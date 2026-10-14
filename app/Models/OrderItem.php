<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';
    protected $primaryKey = 'OrderItemID';
    public $timestamps = false;
    protected $guarded = [];
    protected $hidden = ['OrderItemID', 'OrderID'];

    protected $casts = [
        'ProductID' => 'integer',
        'Quantity' => 'integer',
        'Price' => 'float',
    ];
}