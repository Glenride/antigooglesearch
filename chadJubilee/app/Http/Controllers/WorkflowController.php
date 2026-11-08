<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessAgentResponse;
use App\Models\Agent;
use App\Models\Message;
use App\Models\Project;
use App\Services\AgentResponseService;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
    protected array $workflowPrompts = [
        'research' => 'Please conduct comprehensive research on the project topic. Analyze competitors, identify market trends, and synthesize key findings into actionable insights.',
        'generate_report' => 'Please generate a detailed report summarizing all research findings, analysis, and recommendations for this project.',
        'analyze_competitors' => 'Please perform an in-depth competitor analysis. Identify key competitors, their strengths and weaknesses, and strategic opportunities.',
        'create_roadmap' => 'Please create a detailed project roadmap with phases, milestones, dependencies, and timeline estimates.',
        'write_specs' => 'Please write comprehensive technical specifications based on the project requirements and research findings.',
    ];

    /**
     * Trigger a workflow for a project.
     */
    public function run(Request $request, AgentResponseService $agentService)
    {
        $validated = $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'workflow' => 'required|string|in:research,generate_report,analyze_competitors,create_roadmap,write_specs',
            'agent_type' => 'nullable|string|in:research,writer,planner',
        ]);

        $project = Project::findOrFail($validated['project_id']);

        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $workflowType = $validated['workflow'];
        $agentType = $validated['agent_type'] ?? $this->getDefaultAgentType($workflowType);

        $agent = $project->agents()->where('type', $agentType)->first()
            ?? Agent::where('type', $agentType)->first();

        if (!$agent) {
            return response()->json([
                'message' => "No {$agentType} agent available for this workflow",
            ], 422);
        }

        $workflowPrompt = $this->workflowPrompts[$workflowType];

        $userMessage = Message::create([
            'project_id' => $project->id,
            'sender_type' => 'user',
            'sender_id' => $request->user()->id,
            'content' => "@{$agent->name} {$workflowPrompt}",
            'metadata' => [
                'workflow' => $workflowType,
                'triggered_at' => now()->toISOString(),
            ],
        ]);

        $agentMessage = $agentService->processMessage($userMessage);

        return response()->json([
            'message' => 'Workflow triggered successfully',
            'workflow' => $workflowType,
            'agent' => [
                'id' => $agent->id,
                'name' => $agent->name,
                'type' => $agent->type,
            ],
            'userMessage' => [
                'id' => $userMessage->id,
                'content' => $userMessage->content,
            ],
            'agentMessage' => $agentMessage ? [
                'id' => $agentMessage->id,
                'content' => $agentMessage->content,
            ] : null,
        ]);
    }

    /**
     * Get the default agent type for a workflow.
     */
    protected function getDefaultAgentType(string $workflow): string
    {
        return match ($workflow) {
            'research', 'analyze_competitors' => 'research',
            'generate_report', 'write_specs' => 'writer',
            'create_roadmap' => 'planner',
            default => 'research',
        };
    }

    /**
     * List available workflows.
     */
    public function list()
    {
        $workflows = [
            [
                'id' => 'research',
                'name' => 'Research Task',
                'description' => 'Conduct comprehensive research on project topic',
                'default_agent' => 'research',
            ],
            [
                'id' => 'generate_report',
                'name' => 'Generate Report',
                'description' => 'Generate a detailed summary report',
                'default_agent' => 'writer',
            ],
            [
                'id' => 'analyze_competitors',
                'name' => 'Competitor Analysis',
                'description' => 'Perform in-depth competitor analysis',
                'default_agent' => 'research',
            ],
            [
                'id' => 'create_roadmap',
                'name' => 'Create Roadmap',
                'description' => 'Create project roadmap with milestones',
                'default_agent' => 'planner',
            ],
            [
                'id' => 'write_specs',
                'name' => 'Write Specifications',
                'description' => 'Write technical specifications',
                'default_agent' => 'writer',
            ],
        ];

        return response()->json(['workflows' => $workflows]);
    }
}
