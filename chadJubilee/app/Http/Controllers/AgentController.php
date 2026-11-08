<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    /**
     * List all available agents.
     */
    public function index()
    {
        $agents = Agent::all()->map(fn($a) => [
            'id' => $a->id,
            'name' => $a->name,
            'role' => $a->role,
            'type' => $a->type,
            'avatar_color' => $a->avatar_color,
            'status' => $a->status,
        ]);

        return response()->json(['agents' => $agents]);
    }

    /**
     * Update agent status.
     */
    public function updateStatus(Request $request, Agent $agent)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,idle,paused',
        ]);

        $agent->update(['status' => $validated['status']]);

        return response()->json([
            'agent' => [
                'id' => $agent->id,
                'name' => $agent->name,
                'role' => $agent->role,
                'status' => $agent->status,
            ],
        ]);
    }
}
