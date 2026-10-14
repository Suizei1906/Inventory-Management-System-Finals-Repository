<?php

namespace App\Services;

use App\Models\Alert;
use App\Models\Batch;
use App\Models\InventoryTransaction;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /** @return array{success:bool,message:string} */
    public function recordTransaction(array $data, string $performedBy): array
    {
        return DB::transaction(function () use ($data, $performedBy) {
            $product = Product::lockForUpdate()->find($data['ProductID']);
            if (! $product) {
                return $this->fail('Product not found.');
            }

            $qty = (int) $data['Quantity'];
            if ($qty <= 0) {
                return $this->fail('Quantity must be greater than zero.');
            }

            $type = $data['TransactionType'];
            $date = $data['TransactionDate'] ?? Carbon::today()->toDateString();
            $batchId = null;

            if ($type === 'PURCHASE') {
                $batch = Batch::create([
                    'ProductID' => $product->ProductID,
                    'Quantity' => $qty,
                    'RemainingStock' => $qty,
                    'PurchaseDate' => $date,
                    'ExpirationDate' => $data['ExpirationDate'] ?? null,
                    'Status' => 'active',
                    'Location' => $data['Location'] ?? $product->Location,
                ]);
                $product->CurrentStock += $qty;
                $batchId = $batch->BatchID;
            } elseif ($type === 'SALE' || $type === 'EXPIRED') {
                $batches = Batch::where('ProductID', $product->ProductID)
                    ->where('Status', 'active')
                    ->where('RemainingStock', '>', 0)
                    ->orderBy('PurchaseDate')
                    ->orderBy('BatchID')
                    ->lockForUpdate()
                    ->get();

                if ($batches->isEmpty()) {
                    return $this->fail("No active batch available for {$product->ProductName}.");
                }

                $available = $batches->sum('RemainingStock');
                if ($qty > $available) {
                    return $this->fail("Only {$available} unit(s) of {$product->ProductName} are available.");
                }

                $batchId = $batches->first()->BatchID;
                $left = $qty;
                foreach ($batches as $batch) {
                    if ($left <= 0) {
                        break;
                    }
                    $take = min($left, $batch->RemainingStock);
                    $batch->RemainingStock -= $take;
                    if ($batch->RemainingStock === 0) {
                        $batch->Status = $type === 'EXPIRED' ? 'expired' : 'depleted';
                    }
                    $batch->save();
                    $left -= $take;
                }
                $product->CurrentStock = max(0, $product->CurrentStock - $qty);
            } elseif ($type === 'RETURN') {
                $product->CurrentStock += $qty;
            } else {
                return $this->fail('Unknown transaction type.');
            }

            $product->save();

            InventoryTransaction::create([
                'ProductID' => $product->ProductID,
                'BatchID' => $batchId,
                'TransactionType' => $type,
                'Quantity' => $qty,
                'TransactionDate' => $date,
                'PerformedBy' => $performedBy,
                'Notes' => $data['Notes'] ?? '',
            ]);

            $this->checkAlerts($product->fresh());

            return ['success' => true, 'message' => 'Transaction recorded successfully.'];
        });
    }

    public function checkAlerts(Product $product): void
    {
        $stock = $product->CurrentStock;
        $name = $product->ProductName;

        $push = function (string $type, string $message) use ($product) {
            $exists = Alert::where('ProductID', $product->ProductID)
                ->where('NotificationType', $type)
                ->where('Status', 'Pending')
                ->exists();

            if (! $exists) {
                Alert::create([
                    'ProductID' => $product->ProductID,
                    'NotificationType' => $type,
                    'NotificationMessage' => $message,
                    'NotificationDate' => Carbon::today()->toDateString(),
                    'Status' => 'Pending',
                ]);
            }
        };

        if ($stock <= 1.5 * $product->ReorderStock) {
            $push('Low Stock Watch', "{$name} stock is approaching the reorder threshold.");
        }
        if ($stock <= $product->ReorderStock) {
            $push('Reorder Now', "{$name} has reached the reorder point.");
        }
        if ($stock < $product->SafetyStock) {
            $push('Critical', "{$name} stock is critically low, below safety stock.");
        }
        if ($stock > $product->MaxStock) {
            $push('Overstock Warning', "{$name} stock exceeds the max stock threshold.");
        }

        Batch::where('ProductID', $product->ProductID)
            ->where('Status', 'active')
            ->where('RemainingStock', '>', 0)
            ->whereNotNull('ExpirationDate')
            ->get()
            ->each(function (Batch $b) use ($push, $name) {
                $days = Carbon::today()->diffInDays(Carbon::parse($b->ExpirationDate)->startOfDay(), false);
                if ($days <= 90) {
                    $push('Expiry Warning', "{$name} batch #{$b->BatchID} is expiring within 90 days.");
                }
            });
    }

    private function fail(string $message): array
    {
        return ['success' => false, 'message' => $message];
    }
}