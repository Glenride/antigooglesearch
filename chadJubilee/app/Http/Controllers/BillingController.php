<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Plan;

class BillingController extends Controller
{
    public function index()
    {
        return Inertia::render('billing/index', [
            'plans' => Plan::where('is_active', true)->get(),
            'currentSubscription' => auth()->user()->currentOrganization->subscription ?? null
        ]);
    }

    public function checkout(Request $request)
    {
        // Stripe checkout logic placeholder
        return redirect()->back()->with('info', 'Checkout integration pending.');
    }

    public function portal()
    {
        // Stripe portal logic placeholder
        return redirect()->back()->with('info', 'Portal integration pending.');
    }

    public function usage()
    {
        return response()->json([
            'usage' => auth()->user()->currentOrganization->usageLogs ?? []
        ]);
    }
}
