<?php

namespace App\Http\Middleware;

use App\Models\Alert;
use App\Models\Batch;
use App\Models\Category;
use App\Models\InventoryTransaction;
use App\Models\Location;
use App\Models\Order;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use App\Support\Roles;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'UserID' => $user->UserID,
                    'UserName' => $user->UserName,
                    'Role' => $user->Role,
                ] : null,
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],

            'inventory' => fn () => $user ? [
                'suppliers' => Supplier::orderBy('SuppliersID')->get(),
                'categories' => Category::orderBy('CategoryID')->get(),
                'products' => Product::orderBy('ProductID')->get(),
                'batches' => Batch::orderBy('BatchID')->get(),
                'transactions' => InventoryTransaction::orderBy('TransactionID')->get(),
                'orders' => Order::with('items')->orderBy('OrderID')->get(),
                'notifications' => Alert::orderBy('NotificationID')->get(),
                'locations' => Location::orderBy('LocationID')->get(),
                'warehouseLocations' => self::warehouseLocations(),
                'users' => $user->Role === Roles::ADMIN
                    ? User::orderBy('UserID')->get(['UserID', 'UserName', 'Role'])
                    : [],
            ] : null,
        ]);
    }

    /** Location names come from the locations table (see Location Management). */
    public static function warehouseLocations(): array
    {
        return Location::names();
    }
}