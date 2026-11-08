<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class IntegrationController extends Controller
{
    public function index()
    {
        $integrations = Integration::all();
        
        // Define baseline integrations that should always be visible
        $providers = [
            ['id' => 'slack', 'name' => 'Slack', 'icon' => 'slack', 'type' => 'communication'],
            ['id' => 'github', 'name' => 'GitHub', 'icon' => 'github', 'type' => 'development'],
            ['id' => 'discord', 'name' => 'Discord', 'icon' => 'message-square', 'type' => 'communication'],
            ['id' => 'notion', 'name' => 'Notion', 'icon' => 'book', 'type' => 'productivity'],
        ];

        $mappedIntegrations = collect($providers)->map(function ($provider) use ($integrations) {
            $existing = $integrations->where('provider', $provider['id'])->first();
            return array_merge($provider, [
                'connected' => $existing ? $existing->is_active : false,
                'db_id' => $existing ? $existing->id : null,
            ]);
        });

        return Inertia::render('integrations/index', [
            'integrations' => $mappedIntegrations
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider' => 'required|string',
        ]);

        $integration = Integration::where('provider', $validated['provider'])->first();

        if ($integration) {
            $integration->update(['is_active' => !$integration->is_active]);
        } else {
            Integration::create([
                'provider' => $validated['provider'],
                'is_active' => true,
                'settings' => [],
            ]);
        }

        return redirect()->back()->with('success', 'Integration status updated.');
    }
}
