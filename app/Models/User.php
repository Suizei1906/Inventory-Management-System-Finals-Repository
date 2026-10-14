<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = 'users';
    protected $primaryKey = 'UserID';
    public $timestamps = false;
    protected $guarded = [];
    protected $hidden = ['Password', 'remember_token'];

    public function getAuthPassword()
    {
        return $this->Password;
    }
}