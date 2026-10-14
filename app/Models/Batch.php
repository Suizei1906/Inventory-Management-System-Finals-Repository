<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $table = 'batches';
    protected $primaryKey = 'BatchID';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'ProductID' => 'integer',
        'Quantity' => 'integer',
        'RemainingStock' => 'integer',
        'PurchaseDate' => 'date:Y-m-d',
        'ExpirationDate' => 'date:Y-m-d',
    ];
}