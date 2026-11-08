<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Organization;
use Illuminate\Http\RedirectResponse;

class OrganizationController extends Controller
{
    /**
     * Switch the current organization for the user.
     */
    public function switch(Organization $organization): RedirectResponse
    {
        if (!auth()->user()->organizations()->where('organization_id', $organization->id)->exists()) {
            abort(403);
        }

        auth()->user()->update(['current_organization_id' => $organization->id]);

        return redirect()->back()->with('success', "Switched to {$organization->name}");
    }
}
