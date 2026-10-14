<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $t) {
            $t->increments('LocationID');
            $t->string('LocationName')->unique();
        });

        // Start with the 16 default bins plus any location already used by
        // existing products/batches, so nothing in your data is orphaned.
        $names = [];
        foreach (['A', 'B', 'C', 'D'] as $aisle) {
            foreach ([1, 2] as $shelf) {
                foreach ([1, 2] as $bin) {
                    $names[] = "Aisle {$aisle} - Shelf {$shelf} - Bin {$bin}";
                }
            }
        }
        foreach (['products', 'batches'] as $table) {
            foreach (DB::table($table)->whereNotNull('Location')->distinct()->pluck('Location') as $loc) {
                $names[] = $loc;
            }
        }

        foreach (array_values(array_unique($names)) as $name) {
            DB::table('locations')->insert(['LocationName' => $name]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};