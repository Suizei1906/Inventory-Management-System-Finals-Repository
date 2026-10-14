<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'UserName' => ['required', 'string'],
            'Password' => ['required', 'string'],
        ]);

        $user = User::where('UserName', trim($data['UserName']))->first();

        if (! $user || ! Hash::check($data['Password'], $user->Password)) {
            return back()->withErrors(['UserName' => 'Invalid username or password']);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    public function showSignup(): Response
    {
        return Inertia::render('Signup');
    }

    public function signup(Request $request): RedirectResponse
    {
        $request->merge(['UserName' => trim((string) $request->input('UserName'))]);

        $data = $request->validate([
            'UserName' => [
                'required', 'string', 'max:50',
                function ($attr, $value, $fail) {
                    if (User::whereRaw('LOWER(UserName) = ?', [mb_strtolower($value)])->exists()) {
                        $fail('That username is already taken');
                    }
                },
            ],
            'Password' => ['required', 'string', 'min:4', 'confirmed'],
            'Role' => ['required', Rule::in(Roles::SELF_SERVICE)],
        ], [
            'Password.min' => 'Password must be at least 4 characters',
            'Password.confirmed' => 'Passwords do not match',
        ]);

        $user = User::create([
            'UserName' => $data['UserName'],
            'Password' => Hash::make($data['Password']),
            'Role' => $data['Role'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/');
    }

    public function usernameAvailable(Request $request): JsonResponse
    {
        $name = trim((string) $request->query('username'));
        $taken = $name !== '' && User::whereRaw('LOWER(UserName) = ?', [mb_strtolower($name)])->exists();

        return response()->json(['available' => ! $taken]);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}