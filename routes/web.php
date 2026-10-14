<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransactionController;
use App\Support\Roles;
use Illuminate\Support\Facades\Route;

$admin = Roles::ADMIN;
$warehouse = Roles::WAREHOUSE_STAFF;
$purchasing = Roles::PURCHASING_MANAGER;
$sales = Roles::SALES_STAFF;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::get('/signup', [AuthController::class, 'showSignup']);
    Route::post('/signup', [AuthController::class, 'signup'])->middleware('throttle:10,1');
    Route::get('/username-available', [AuthController::class, 'usernameAvailable'])->middleware('throttle:60,1');
});

Route::middleware('auth')->group(function () use ($admin, $warehouse, $purchasing, $sales) {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::inertia('/', 'Dashboard');
    Route::inertia('/settings', 'Settings');
    Route::inertia('/transaction', 'Transaction');
    Route::inertia('/products', 'Products')->middleware("role:$admin,$purchasing");
    Route::inertia('/report', 'Report')->middleware("role:$admin,$purchasing,$sales");
    Route::inertia('/alerts', 'Alerts')->middleware("role:$admin,$warehouse,$purchasing");
    Route::inertia('/location', 'Location')->middleware("role:$admin,$warehouse");
    Route::inertia('/suppliers', 'Suppliers')->middleware("role:$admin,$purchasing");
    Route::inertia('/locations', 'LocationManagement')->middleware("role:$admin,$warehouse");

    Route::post('/products', [ProductController::class, 'store'])->middleware("role:$admin,$purchasing");
    Route::put('/products/{product}', [ProductController::class, 'update'])->middleware("role:$admin,$purchasing");

    Route::post('/suppliers', [SupplierController::class, 'store'])->middleware("role:$admin,$purchasing");
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->middleware("role:$admin,$purchasing");
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->middleware("role:$admin,$purchasing");

    Route::post('/locations', [LocationController::class, 'store'])->middleware("role:$admin,$warehouse");
    Route::put('/locations/{location}', [LocationController::class, 'update'])->middleware("role:$admin,$warehouse");
    Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->middleware("role:$admin,$warehouse");

    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::patch('/alerts/{alert}', [AlertController::class, 'update'])->middleware("role:$admin,$warehouse,$purchasing");
    Route::post('/orders', [OrderController::class, 'store'])->middleware("role:$admin,$purchasing,$sales");
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->middleware("role:$admin,$purchasing,$sales");
});