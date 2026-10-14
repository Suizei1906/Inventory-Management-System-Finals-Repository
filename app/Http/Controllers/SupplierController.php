<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    private function rules(?Supplier $supplier = null): array
    {
        $unique = Rule::unique('suppliers', 'SupplierName');
        if ($supplier) {
            $unique->ignore($supplier->SuppliersID, 'SuppliersID');
        }

        return [
            'SupplierName' => ['required', 'string', 'max:255', $unique],
            'ContactPerson' => ['nullable', 'string', 'max:255'],
            'Phone' => ['nullable', 'string', 'max:50'],
            'Email' => ['nullable', 'email', 'max:255'],
            'Address' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function store(Request $request): RedirectResponse
    {
        Supplier::create($request->validate($this->rules()));

        return back()->with('success', 'Supplier added.');
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $supplier->update($request->validate($this->rules($supplier)));

        return back()->with('success', 'Supplier updated.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $count = Product::where('SuppliersID', $supplier->SuppliersID)->count();

        if ($count > 0) {
            return back()->withErrors([
                'message' => "Cannot delete {$supplier->SupplierName}: {$count} product(s) still use this supplier.",
            ]);
        }

        $supplier->delete();

        return back()->with('success', 'Supplier deleted.');
    }
}