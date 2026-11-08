<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class TeamController extends Controller
{
    public function index()
    {
        return Inertia::render('team/index', [
            'members' => auth()->user()->currentOrganization->users ?? []
        ]);
    }

    public function invite(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        // Invitation logic placeholder
        return redirect()->back()->with('success', 'Invitation sent.');
    }

    public function remove(User $user)
    {
        auth()->user()->currentOrganization->users()->detach($user->id);
        return redirect()->back()->with('success', 'Member removed.');
    }
}
