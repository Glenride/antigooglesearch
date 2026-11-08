<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Project;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    /**
     * Get goals for a project.
     */
    public function index(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $goals = $project->goals->map(fn($g) => [
            'id' => $g->id,
            'name' => $g->name,
            'phase' => $g->phase,
            'completed' => $g->completed,
        ]);

        return response()->json(['goals' => $goals]);
    }

    /**
     * Store a new goal for a project.
     */
    public function store(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phase' => 'required|integer|min:1',
        ]);

        $goal = Goal::create([
            'project_id' => $project->id,
            'name' => $validated['name'],
            'phase' => $validated['phase'],
            'completed' => false,
        ]);

        return response()->json([
            'goal' => [
                'id' => $goal->id,
                'name' => $goal->name,
                'phase' => $goal->phase,
                'completed' => $goal->completed,
            ],
        ], 201);
    }

    /**
     * Update a goal.
     */
    public function update(Request $request, Goal $goal)
    {
        $project = $goal->project;
        
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phase' => 'sometimes|required|integer|min:1',
            'completed' => 'sometimes|boolean',
        ]);

        $goal->update($validated);

        return response()->json([
            'goal' => [
                'id' => $goal->id,
                'name' => $goal->name,
                'phase' => $goal->phase,
                'completed' => $goal->completed,
            ],
        ]);
    }

    /**
     * Delete a goal.
     */
    public function destroy(Request $request, Goal $goal)
    {
        $project = $goal->project;
        
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $goal->delete();

        return response()->json(['message' => 'Goal deleted successfully']);
    }
}
