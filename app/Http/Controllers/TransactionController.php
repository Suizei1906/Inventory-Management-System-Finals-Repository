<?php

namespace App\Http\Controllers;

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Category;
use App\Models\Product;
use App\Services\InventoryService;
use App\Support\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TransactionController extends Controller
{
    public function store(Request $request, InventoryService $inventory): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'ProductID' => ['required', 'integer', 'exists:products,ProductID'],
            'TransactionType' => ['required', Rule::in(['PURCHASE', 'SALE', 'RETURN', 'EXPIRED'])],
            'Quantity' => ['required', 'integer', 'min:1'],
            'TransactionDate' => ['nullable', 'date'],
            'Notes' => ['nullable', 'string', 'max:1000', 'required_if:TransactionType,RETURN,EXPIRED'],
            'Location' => ['nullable', Rule::in(HandleInertiaRequests::warehouseLocations())],
            'ExpirationDate' => ['nullable', 'date'],
        ], [
            'Notes.required_if' => 'Notes are required for RETURN and EXPIRED transactions.',
        ]);

        if ($data['TransactionType'] === 'PURCHASE' && $user->Role === Roles::SALES_STAFF) {
            return back()->withErrors(['message' => 'Your role is not allowed to record purchases.']);
        }

        if ($data['TransactionType'] === 'PURCHASE') {
            $product = Product::find($data['ProductID']);
            $category = Category::find($product->CategoryID);
            if ($category?->InventoryStrategy === 'FIFO' && empty($data['ExpirationDate'])) {
                return back()->withErrors(['message' => 'Expiry Date is required for this product.']);
            }
        }

        $result = $inventory->recordTransaction($data, $user->UserName);

        return $result['success']
            ? back()->with('success', $result['message'])
            : back()->withErrors(['message' => $result['message']]);
    }
}