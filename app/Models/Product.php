<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'ProductID';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'SuppliersID' => 'integer',
        'CategoryID' => 'integer',
        'UnitCost' => 'float',
        'SellingPrice' => 'float',
        'CurrentStock' => 'integer',
        'ReorderStock' => 'integer',
        'SafetyStock' => 'integer',
        'MaxStock' => 'integer',
        'Seasonal' => 'boolean',
    ];
}