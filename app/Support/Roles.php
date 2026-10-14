<?php

namespace App\Support;

class Roles
{
    public const ADMIN = 'Admin';
    public const WAREHOUSE_STAFF = 'Warehouse Staff';
    public const PURCHASING_MANAGER = 'Purchasing Manager';
    public const SALES_STAFF = 'Sales Staff';

    public const SELF_SERVICE = [
        self::WAREHOUSE_STAFF,
        self::PURCHASING_MANAGER,
        self::SALES_STAFF,
    ];
}