<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the user's projects.
     */
    public function index(Request $request)
    {
        $projects = Project::where('owner_id', $request->user()->id)
            ->with(['agents', 'goals'])
            ->withCount('messages')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'status' => $project->status,
                    'due_date' => $project->due_date?->format('Y-m-d'),
                    'completion' => $project->completion_percentage,
                    'agents_count' => $project->agents->count(),
                    'messages_count' => $project->messages_count,
                ];
            });

        // Get all available agents for the create modal
        $availableAgents = Agent::orderBy('name')->get()->map(fn($a) => [
            'id' => $a->id,
            'name' => $a->name,
            'role' => $a->role,
            'type' => $a->type,
            'avatar_color' => $a->avatar_color,
        ]);

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'availableAgents' => $availableAgents,
        ]);
    }

    /**
     * Display the specified project.
     */
    public function show(Request $request, Project $project)
    {
        // Ensure user owns the project
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $project->load([
            'agents',
            'goals',
            'files' => fn($q) => $q->limit(5),
            'messages' => fn($q) => $q->orderBy('created_at', 'asc'),
        ]);

        // Get all available agents for adding to project
        $availableAgents = Agent::whereNotIn('id', $project->agents->pluck('id'))
            ->orderBy('name')
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'role' => $a->role,
                'type' => $a->type,
                'avatar_color' => $a->avatar_color,
            ]);

        return Inertia::render('projects/show', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'due_date' => $project->due_date?->format('Y-m-d'),
                'budget_tokens' => $project->budget_tokens,
                'completion' => $project->completion_percentage,
            ],
            'agents' => $project->agents->map(fn($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'role' => $a->role,
                'type' => $a->type,
                'avatar_color' => $a->avatar_color,
                'status' => $a->status,
            ]),
            'availableAgents' => $availableAgents,
            'goals' => $project->goals->map(fn($g) => [
                'id' => $g->id,
                'name' => $g->name,
                'phase' => $g->phase,
                'completed' => $g->completed,
            ]),
            'files' => $project->files->map(fn($f) => [
                'id' => $f->id,
                'name' => $f->name,
                'size' => $f->formatted_size,
                'date' => $f->formatted_date,
            ]),
            'messages' => $project->messages->map(function ($m) {
                $sender = $m->sender;
                return [
                    'id' => $m->id,
                    'sender' => [
                        'name' => $sender?->name ?? 'Unknown',
                        'color' => $m->sender_type === 'agent' 
                            ? ($sender?->avatar_color ?? '#8B5CF6')
                            : '#F472B6',
                        'isAgent' => $m->sender_type === 'agent',
                    ],
                    'content' => $m->content,
                    'timestamp' => $m->formatted_timestamp,
                ];
            }),
            'goalsProgress' => [
                'completion' => $project->completion_percentage,
                'phases' => $project->goals->map(fn($g) => [
                    'name' => $g->name,
                    'completed' => $g->completed,
                ]),
            ],
            'quickActions' => [
                ['label' => 'Resume All Agents', 'icon' => 'play'],
                ['label' => 'Pause Workflow', 'icon' => 'pause'],
                ['label' => 'Generate Report', 'icon' => 'file'],
            ],
            'recentFiles' => $project->files->take(5)->map(fn($f) => [
                'name' => $f->name,
                'size' => $f->formatted_size,
                'date' => $f->formatted_date,
            ]),
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'budget_tokens' => 'nullable|integer|min:0',
        ]);

        $project = Project::create([
            ...$validated,
            'owner_id' => $request->user()->id,
            'status' => 'active',
        ]);

        return response()->json(['project' => $project], 201);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,paused,completed',
            'due_date' => 'nullable|date',
            'budget_tokens' => 'nullable|integer|min:0',
        ]);

        $project->update($validated);

        return response()->json(['project' => $project]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    /**
     * Add an agent to the project.
     */
    public function addAgent(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'agent_id' => 'required|uuid|exists:agents,id',
        ]);

        $agent = Agent::findOrFail($validated['agent_id']);

        if ($project->agents()->where('agent_id', $agent->id)->exists()) {
            return response()->json(['message' => 'Agent already assigned to project'], 422);
        }

        $project->agents()->attach($agent->id, ['assigned_at' => now()]);

        return response()->json([
            'message' => 'Agent added successfully',
            'agent' => [
                'id' => $agent->id,
                'name' => $agent->name,
                'role' => $agent->role,
                'type' => $agent->type,
                'avatar_color' => $agent->avatar_color,
                'status' => $agent->status,
            ],
        ], 201);
    }

    /**
     * Remove an agent from the project.
     */
    public function removeAgent(Request $request, Project $project, Agent $agent)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        if (!$project->agents()->where('agent_id', $agent->id)->exists()) {
            return response()->json(['message' => 'Agent not assigned to project'], 404);
        }

        $project->agents()->detach($agent->id);

        return response()->json(['message' => 'Agent removed successfully']);
    }

    /**
     * Get agents assigned to a project.
     */
    public function agents(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $agents = $project->agents->map(fn($a) => [
            'id' => $a->id,
            'name' => $a->name,
            'role' => $a->role,
            'type' => $a->type,
            'avatar_color' => $a->avatar_color,
            'status' => $a->status,
        ]);

        return response()->json(['agents' => $agents]);
    }
}
