<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'TransactionID';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'ProductID' => 'integer',
        'BatchID' => 'integer',
        'Quantity' => 'integer',
        'TransactionDate' => 'date:Y-m-d',
    ];
}