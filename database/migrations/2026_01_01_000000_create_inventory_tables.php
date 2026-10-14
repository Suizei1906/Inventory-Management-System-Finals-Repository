<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $t) {
            $t->increments('UserID');
            $t->string('UserName')->unique();
            $t->string('Password');
            $t->string('Role');
            $t->rememberToken();
        });

        Schema::create('suppliers', function (Blueprint $t) {
            $t->increments('SuppliersID');
            $t->string('SupplierName');
            $t->string('ContactPerson')->nullable();
            $t->string('Phone')->nullable();
            $t->string('Email')->nullable();
            $t->string('Address')->nullable();
        });

        Schema::create('categories', function (Blueprint $t) {
            $t->increments('CategoryID');
            $t->string('CategoryName');
            $t->string('InventoryStrategy');
        });

        Schema::create('products', function (Blueprint $t) {
            $t->increments('ProductID');
            $t->string('ProductName');
            $t->unsignedInteger('SuppliersID');
            $t->unsignedInteger('CategoryID');
            $t->decimal('UnitCost', 12, 2);
            $t->decimal('SellingPrice', 12, 2);
            $t->integer('CurrentStock')->default(0);
            $t->integer('ReorderStock');
            $t->integer('SafetyStock');
            $t->integer('MaxStock');
            $t->boolean('Seasonal')->default(false);
            $t->string('Location')->nullable();

            $t->foreign('SuppliersID')->references('SuppliersID')->on('suppliers');
            $t->foreign('CategoryID')->references('CategoryID')->on('categories');
        });

        Schema::create('batches', function (Blueprint $t) {
            $t->increments('BatchID');
            $t->unsignedInteger('ProductID');
            $t->integer('Quantity');
            $t->integer('RemainingStock');
            $t->date('PurchaseDate');
            $t->date('ExpirationDate')->nullable();
            $t->string('Status')->default('active');
            $t->string('Location')->nullable();

            $t->foreign('ProductID')->references('ProductID')->on('products')->cascadeOnDelete();
        });

        Schema::create('transactions', function (Blueprint $t) {
            $t->increments('TransactionID');
            $t->unsignedInteger('ProductID');
            $t->unsignedInteger('BatchID')->nullable();
            $t->string('TransactionType');
            $t->integer('Quantity');
            $t->date('TransactionDate');
            $t->string('PerformedBy');
            $t->text('Notes')->nullable();

            $t->foreign('ProductID')->references('ProductID')->on('products');
            $t->foreign('BatchID')->references('BatchID')->on('batches');
        });

        Schema::create('orders', function (Blueprint $t) {
            $t->increments('OrderID');
            $t->string('CustomerName');
            $t->date('OrderDate');
            $t->string('Status')->default('Pending');
        });

        Schema::create('order_items', function (Blueprint $t) {
            $t->increments('OrderItemID');
            $t->unsignedInteger('OrderID');
            $t->unsignedInteger('ProductID');
            $t->integer('Quantity');
            $t->decimal('Price', 12, 2);

            $t->foreign('OrderID')->references('OrderID')->on('orders')->cascadeOnDelete();
            $t->foreign('ProductID')->references('ProductID')->on('products');
        });

        Schema::create('alerts', function (Blueprint $t) {
            $t->increments('NotificationID');
            $t->unsignedInteger('ProductID');
            $t->string('NotificationType');
            $t->string('NotificationMessage');
            $t->date('NotificationDate');
            $t->string('Status')->default('Pending');

            $t->foreign('ProductID')->references('ProductID')->on('products')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        foreach (['alerts', 'order_items', 'orders', 'transactions', 'batches', 'products', 'categories', 'suppliers', 'users'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};