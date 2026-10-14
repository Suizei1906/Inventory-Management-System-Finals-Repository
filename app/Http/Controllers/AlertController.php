<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AlertController extends Controller
{
    public function update(Request $request, Alert $alert): RedirectResponse
    {
        $data = $request->validate([
            'Status' => ['required', Rule::in(['Acknowledged', 'Ignored'])],
        ]);

        $alert->update(['Status' => $data['Status']]);

        return back();
    }
}