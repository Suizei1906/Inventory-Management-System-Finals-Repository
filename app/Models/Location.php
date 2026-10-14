<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';
    protected $primaryKey = 'LocationID';
    public $timestamps = false;
    protected $guarded = [];

    /** Every valid location name, in creation order. */
    public static function names(): array
    {
        return static::orderBy('LocationID')->pluck('LocationName')->all();
    }
}