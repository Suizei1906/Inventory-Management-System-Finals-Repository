<?php

namespace App\Http\Controllers;

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    private function rules(): array
    {
        return [
            'ProductName' => ['required', 'string', 'max:255'],
            'SuppliersID' => ['required', 'integer', 'exists:suppliers,SuppliersID'],
            'CategoryID' => ['required', 'integer', 'exists:categories,CategoryID'],
            'UnitCost' => ['required', 'numeric', 'min:0'],
            'SellingPrice' => ['required', 'numeric', 'min:0'],
            'ReorderStock' => ['required', 'integer', 'min:0'],
            'SafetyStock' => ['required', 'integer', 'min:0'],
            'MaxStock' => ['required', 'integer', 'min:0'],
            'Seasonal' => ['required', 'boolean'],
            'Location' => ['nullable', Rule::in(HandleInertiaRequests::warehouseLocations())],
        ];
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate($this->rules());
        Product::create($data + ['CurrentStock' => 0]);

        return back()->with('success', 'Product added.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $product->update($request->validate($this->rules()));

        return back()->with('success', 'Product updated.');
    }
}