<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Jobs\ProcessAgentResponse;
use App\Models\Message;
use App\Models\Project;
use App\Services\AgentResponseService;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get messages for a project.
     */
    public function index(Request $request, Project $project)
    {
        // Ensure user owns the project
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $messages = $project->messages()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($m) {
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
            });

        return response()->json(['messages' => $messages]);
    }

    /**
     * Store a new message from the user and trigger agent response.
     */
    public function store(Request $request, Project $project, AgentResponseService $agentService)
    {
        // Ensure user owns the project
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        // Create user message
        $userMessage = Message::create([
            'project_id' => $project->id,
            'sender_type' => 'user',
            'sender_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        // Broadcast user message via WebSocket
        broadcast(new MessageSent($userMessage))->toOthers();

        $sender = $request->user();
        $userResponse = [
            'id' => $userMessage->id,
            'sender' => [
                'name' => $sender->name,
                'color' => '#F472B6',
                'isAgent' => false,
            ],
            'content' => $userMessage->content,
            'timestamp' => $userMessage->formatted_timestamp,
        ];

        // Process agent response synchronously for now (can be queued later)
        $agentMessage = $agentService->processMessage($userMessage);

        $agentResponse = null;
        if ($agentMessage) {
            // Broadcast agent message via WebSocket
            broadcast(new MessageSent($agentMessage))->toOthers();
            
            $agentSender = $agentMessage->sender;
            $agentResponse = [
                'id' => $agentMessage->id,
                'sender' => [
                    'name' => $agentSender?->name ?? 'Agent',
                    'color' => $agentSender?->avatar_color ?? '#8B5CF6',
                    'isAgent' => true,
                ],
                'content' => $agentMessage->content,
                'timestamp' => $agentMessage->formatted_timestamp,
            ];
        }

        return response()->json([
            'userMessage' => $userResponse,
            'agentMessage' => $agentResponse,
        ], 201);
    }
}
