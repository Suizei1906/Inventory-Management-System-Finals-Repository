<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'suppliers';
    protected $primaryKey = 'SuppliersID';
    public $timestamps = false;
    protected $guarded = [];
}