<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $table = 'orders';
    protected $primaryKey = 'OrderID';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = ['OrderDate' => 'date:Y-m-d'];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'OrderID', 'OrderID');
    }
}