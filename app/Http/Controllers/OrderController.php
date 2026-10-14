<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\InventoryService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'CustomerName' => ['required', 'string', 'max:255'],
            'OrderDate' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.ProductID' => ['required', 'integer', 'exists:products,ProductID'],
            'items.*.Quantity' => ['required', 'integer', 'min:1'],
            'items.*.Price' => ['nullable', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($data) {
            $order = Order::create([
                'CustomerName' => $data['CustomerName'],
                'OrderDate' => $data['OrderDate'] ?? Carbon::today()->toDateString(),
                'Status' => 'Pending',
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create([
                    'ProductID' => $item['ProductID'],
                    'Quantity' => $item['Quantity'],
                    'Price' => $item['Price'] ?? Product::find($item['ProductID'])->SellingPrice,
                ]);
            }
        });

        return back()->with('success', 'Order created.');
    }

    public function updateStatus(Request $request, Order $order, InventoryService $inventory): RedirectResponse
    {
        $data = $request->validate([
            'Status' => ['required', Rule::in(['Pending', 'Received', 'Cancelled', 'Failed'])],
        ]);

        $error = null;

        DB::transaction(function () use ($order, $data, $inventory, $request, &$error) {
            if ($data['Status'] === 'Received' && $order->Status !== 'Received') {
                foreach ($order->items as $item) {
                    $result = $inventory->recordTransaction([
                        'ProductID' => $item->ProductID,
                        'TransactionType' => 'SALE',
                        'Quantity' => $item->Quantity,
                        'Notes' => "Auto-generated from Order #{$order->OrderID}",
                    ], $request->user()->UserName);

                    if (! $result['success']) {
                        $error = $result['message'];
                        DB::rollBack();
                        return;
                    }
                }
            }

            $order->update(['Status' => $data['Status']]);
        });

        return $error
            ? back()->withErrors(['message' => $error])
            : back()->with('success', 'Order updated.');
    }
}