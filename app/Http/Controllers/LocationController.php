<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Location;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    private function rules(?Location $location = null): array
    {
        $unique = Rule::unique('locations', 'LocationName');
        if ($location) {
            $unique->ignore($location->LocationID, 'LocationID');
        }

        return [
            'LocationName' => ['required', 'string', 'max:100', $unique],
        ];
    }

    public function store(Request $request): RedirectResponse
    {
        Location::create($request->validate($this->rules()));

        return back()->with('success', 'Location added.');
    }

    // Renaming also moves every product and batch that used the old name.
    public function update(Request $request, Location $location): RedirectResponse
    {
        $data = $request->validate($this->rules($location));
        $old = $location->LocationName;

        DB::transaction(function () use ($location, $data, $old) {
            $location->update($data);
            Product::where('Location', $old)->update(['Location' => $data['LocationName']]);
            Batch::where('Location', $old)->update(['Location' => $data['LocationName']]);
        });

        return back()->with('success', 'Location updated.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $products = Product::where('Location', $location->LocationName)->count();
        $batches = Batch::where('Location', $location->LocationName)
            ->where('RemainingStock', '>', 0)
            ->count();

        if ($products > 0 || $batches > 0) {
            return back()->withErrors([
                'message' => "Cannot delete {$location->LocationName}: it is still used by {$products} product(s) and {$batches} batch(es) with stock.",
            ]);
        }

        $location->delete();

        return back()->with('success', 'Location deleted.');
    }
}