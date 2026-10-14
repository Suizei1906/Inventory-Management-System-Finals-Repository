<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $table = 'alerts';
    protected $primaryKey = 'NotificationID';
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'ProductID' => 'integer',
        'NotificationDate' => 'date:Y-m-d',
    ];
}