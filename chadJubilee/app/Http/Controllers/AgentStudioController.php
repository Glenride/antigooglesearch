<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AgentTemplate;
use App\Models\Agent;

class AgentStudioController extends Controller
{
    public function index()
    {
        return Inertia::render('agents/studio', [
            'agents' => auth()->user()->currentOrganization->agents ?? []
        ]);
    }

    public function create()
    {
        return Inertia::render('agents/builder', [
            'tools' => \App\Models\AgentTool::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'system_prompt' => 'required|string',
            'tools' => 'array',
        ]);

        $agent = Agent::create([
            'name' => $validated['name'],
            'role' => $validated['role'],
            'system_prompt' => $validated['system_prompt'],
            'type' => 'research', // Defaulting for now
            'status' => 'idle',
            'avatar_color' => '#8B5CF6',
        ]);

        if (!empty($validated['tools'])) {
            $agent->tools()->sync($validated['tools']);
        }

        return redirect()->route('agents.studio')->with('success', "Agent {$agent->name} created successfully.");
    }

    public function marketplace()
    {
        return Inertia::render('agents/marketplace', [
            'templates' => AgentTemplate::where('is_public', true)->get()
        ]);
    }

    public function show(Agent $agent)
    {
        return Inertia::render('agents/console', [
            'agent' => $agent->load('tools'),
        ]);
    }

    public function edit(Agent $agent)
    {
        return Inertia::render('agents/edit', [
            'agent' => $agent->load('tools'),
            'tools' => \App\Models\AgentTool::all(),
        ]);
    }

    public function update(Request $request, Agent $agent)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'system_prompt' => 'required|string',
            'tools' => 'array',
        ]);

        $agent->update([
            'name' => $validated['name'],
            'role' => $validated['role'],
            'system_prompt' => $validated['system_prompt'],
        ]);

        if (isset($validated['tools'])) {
            $agent->tools()->sync($validated['tools']);
        }

        return redirect()->route('agents.studio')->with('success', "Agent {$agent->name} updated successfully.");
    }

    public function destroy(Agent $agent)
    {
        $name = $agent->name;
        $agent->tools()->detach();
        $agent->delete();

        return redirect()->route('agents.studio')->with('success', "Agent {$name} deleted successfully.");
    }

    public function instantiate(AgentTemplate $template)
    {
        $agent = Agent::create([
            'name' => $template->name,
            'role' => $template->role,
            'system_prompt' => $template->system_prompt,
            'type' => 'research',
            'avatar_color' => '#8B5CF6',
            'status' => 'idle',
        ]);

        // Optionally copy tools from template
        if ($template->suggested_tools) {
            $toolIds = \App\Models\AgentTool::whereIn('name', $template->suggested_tools)->pluck('id');
            $agent->tools()->sync($toolIds);
        }

        return redirect()->route('agents.studio')->with('success', "Agent {$agent->name} instantiated successfully.");
    }
}
