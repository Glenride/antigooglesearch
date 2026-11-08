<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Agent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with the user's current project.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get all available agents
        $allAgents = Agent::all();
        
        // Check if user has a current organization
        if (!$user->currentOrganization) {
            return Inertia::render('dashboard', [
                'project' => null,
                'agents' => $allAgents->map(fn($a) => [
                    'name' => $a->name,
                    'role' => $a->role,
                    'color' => $a->avatar_color,
                    'status' => $a->status,
                ])->toArray(),
                'projectSpecs' => [],
                'goalsProgress' => [
                    'completion' => 0,
                    'phases' => [],
                ],
                'quickActions' => [
                    ['label' => 'Resume All Agents', 'icon' => 'play'],
                    ['label' => 'Pause Workflow', 'icon' => 'pause'],
                    ['label' => 'Generate Report', 'icon' => 'file'],
                ],
                'recentFiles' => [],
                'messages' => [],
            ]);
        }
        
        // Get the current organization's most recent project
        $project = $user->currentOrganization->projects()
            ->with([
                'agents',
                'goals',
                'files' => fn($q) => $q->limit(5),
                'messages' => fn($q) => $q->orderBy('created_at', 'asc'),
            ])
            ->orderBy('updated_at', 'desc')
            ->first();

        // If no project, return empty state
        if (!$project) {
            return Inertia::render('dashboard', [
                'project' => null,
                'agents' => $allAgents->map(fn($a) => [
                    'name' => $a->name,
                    'role' => $a->role,
                    'color' => $a->avatar_color,
                    'status' => $a->status,
                ])->toArray(),
                'projectSpecs' => [],
                'goalsProgress' => [
                    'completion' => 0,
                    'phases' => [],
                ],
                'quickActions' => [
                    ['label' => 'Resume All Agents', 'icon' => 'play'],
                    ['label' => 'Pause Workflow', 'icon' => 'pause'],
                    ['label' => 'Generate Report', 'icon' => 'file'],
                ],
                'recentFiles' => [],
                'messages' => [],
            ]);
        }

        // Format messages for conversation panel
        $messages = $project->messages->map(function ($m) {
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
        })->toArray();

        // Format goals for progress widget
        $goalsProgress = [
            'completion' => $project->completion_percentage,
            'phases' => $project->goals->map(fn($g) => [
                'name' => $g->name,
                'completed' => $g->completed,
            ])->toArray(),
        ];

        // Format files
        $recentFiles = $project->files->map(fn($f) => [
            'name' => $f->name,
            'size' => $f->formatted_size,
            'date' => $f->formatted_date,
        ])->toArray();

        // Format project specs
        $projectSpecs = [
            ['label' => 'Owner', 'value' => $user->name],
            ['label' => 'Due Date', 'value' => $project->due_date?->format('Y-m-d') ?? 'Not set'],
            ['label' => 'Budget', 'value' => number_format($project->budget_tokens) . ' Tokens'],
        ];

        // Format active agents
        $activeAgents = $project->agents->map(fn($a) => [
            'name' => $a->name,
            'role' => $a->role,
            'color' => $a->avatar_color,
            'status' => $a->status,
        ])->toArray();

        return Inertia::render('dashboard', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
            ],
            'agents' => $activeAgents,
            'projectSpecs' => $projectSpecs,
            'goalsProgress' => $goalsProgress,
            'quickActions' => [
                ['label' => 'Resume All Agents', 'icon' => 'play'],
                ['label' => 'Pause Workflow', 'icon' => 'pause'],
                ['label' => 'Generate Report', 'icon' => 'file'],
            ],
            'recentFiles' => $recentFiles,
            'messages' => $messages,
        ]);
    }
}
