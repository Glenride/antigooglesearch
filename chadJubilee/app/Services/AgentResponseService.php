<?php

namespace App\Services;

use App\Models\Agent;
use App\Models\Message;
use App\Models\Project;
use App\Models\UsageLog;
use OpenAI\Laravel\Facades\OpenAI;

class AgentResponseService
{
    /**
     * Agent system prompts defining their personalities and capabilities.
     */
    protected array $agentPrompts = [
        'research' => "You are the Research Agent for Chad Jubilee, an AI-powered research command center. 
Your role is a Data Analyst who excels at:
- Web research and competitor analysis
- Data synthesis and pattern recognition
- Extracting insights from multiple sources

You communicate in a professional but friendly tone. You're thorough and cite your reasoning.
When given a research task, acknowledge it first, then provide structured findings.
Keep responses concise but comprehensive. Use bullet points for clarity.
Sign off your messages with relevant findings and next steps when appropriate.",

        'writer' => "You are the Spec Writer Agent for Chad Jubilee, an AI-powered research command center.
Your role is a Technical Writer who excels at:
- Documentation and specification writing
- Copy analysis and content strategy
- Converting research into actionable documents

You communicate clearly and professionally. You focus on structure and clarity.
When asked to write, provide well-organized content with clear headings.
Keep responses focused and actionable. Format text for readability.",

        'planner' => "You are the Roadmap Planner Agent for Chad Jubilee, an AI-powered research command center.
Your role is a Project Manager who excels at:
- Timeline planning and task breakdown
- Dependency mapping and resource allocation
- Milestone definition and progress tracking

You communicate with clarity and authority. You think strategically.
When planning, break things into phases with clear deliverables.
Provide realistic timelines and flag potential risks.",
    ];

    /**
     * Process a user message and generate an agent response.
     */
    public function processMessage(Message $userMessage): ?Message
    {
        $project = $userMessage->project;
        
        // Determine which agent should respond based on message content
        $agent = $this->determineRespondingAgent($userMessage->content, $project);
        
        if (!$agent) {
            return null;
        }

        // Build conversation context
        $conversationHistory = $this->buildConversationHistory($project, $userMessage);
        
        // Get AI response with usage tracking
        $result = $this->callOpenAI($agent, $conversationHistory, $project);
        
        if (!$result || !$result['content']) {
            return null;
        }

        // Create the agent's response message
        $agentMessage = Message::create([
            'project_id' => $project->id,
            'sender_type' => 'agent',
            'sender_id' => $agent->id,
            'content' => $result['content'],
            'metadata' => [
                'model' => 'gpt-4o',
                'agent_type' => $agent->type,
                'usage' => $result['usage'] ?? null,
            ],
        ]);

        return $agentMessage;
    }

    /**
     * Determine which agent should respond based on message content.
     */
    protected function determineRespondingAgent(string $content, Project $project): ?Agent
    {
        // Check for explicit @mentions
        $mentionPatterns = [
            '@ResearchAgent' => 'research',
            '@SpecWriter' => 'writer',
            '@RoadmapPlanner' => 'planner',
            '@research' => 'research',
            '@writer' => 'writer',
            '@planner' => 'planner',
        ];

        foreach ($mentionPatterns as $mention => $type) {
            if (stripos($content, $mention) !== false) {
                return $project->agents()->where('type', $type)->first()
                    ?? Agent::where('type', $type)->whereNull('organization_id')->first() // Fallback to global template if no org agent
                    ?? Agent::where('type', $type)->first();
            }
        }

        // Default to the first attached agent if any, or general Research Agent
        return $project->agents()->first()
            ?? Agent::where('type', 'research')->whereNull('organization_id')->first()
            ?? Agent::where('type', 'research')->first();
    }

    /**
     * Build conversation history for context.
     */
    protected function buildConversationHistory(Project $project, Message $latestMessage): array
    {
        // Get last 10 messages for context
        $recentMessages = $project->messages()
            ->where('id', '!=', $latestMessage->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->reverse();

        $history = [];
        
        foreach ($recentMessages as $msg) {
            $role = $msg->sender_type === 'user' ? 'user' : 'assistant';
            $history[] = [
                'role' => $role,
                'content' => $msg->content,
            ];
        }

        // Add the latest user message
        $history[] = [
            'role' => 'user',
            'content' => $latestMessage->content,
        ];

        return $history;
    }

    /**
     * Call OpenAI API to generate response.
     */
    protected function callOpenAI(Agent $agent, array $conversationHistory, Project $project): ?array
    {
        try {
            $systemPrompt = $agent->system_prompt ?: ($this->agentPrompts[$agent->type] ?? $this->agentPrompts['research']);
            
            $messages = [
                ['role' => 'system', 'content' => $systemPrompt],
                ...$conversationHistory,
            ];

            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o',
                'messages' => $messages,
                'max_tokens' => 1000,
                'temperature' => 0.7,
            ]);

            $content = $response->choices[0]->message->content ?? null;
            $usage = $response->usage ?? null;
            
            // Log token usage
            if ($usage && $project->owner) {
                $this->logUsage($project, $agent, $usage);
            }

            return [
                'content' => $content,
                'usage' => $usage ? [
                    'prompt_tokens' => $usage->promptTokens,
                    'completion_tokens' => $usage->completionTokens,
                    'total_tokens' => $usage->totalTokens,
                ] : null,
            ];
        } catch (\Exception $e) {
            \Log::error('OpenAI API Error: ' . $e->getMessage());
            return [
                'content' => "I apologize, but I encountered an error processing your request. Please try again.",
                'usage' => null,
            ];
        }
    }

    /**
     * Log token usage to the database.
     */
    protected function logUsage(Project $project, Agent $agent, $usage): void
    {
        try {
            $owner = $project->owner;
            
            if (!$owner || !$owner->current_organization_id) {
                return;
            }

            UsageLog::create([
                'organization_id' => $owner->current_organization_id,
                'user_id' => $owner->id,
                'event_type' => 'token_usage',
                'amount' => $usage->totalTokens,
                'metadata' => [
                    'model' => 'gpt-4o',
                    'prompt_tokens' => $usage->promptTokens,
                    'completion_tokens' => $usage->completionTokens,
                    'agent_type' => $agent->type,
                    'agent_id' => $agent->id,
                    'project_id' => $project->id,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::warning('Failed to log usage: ' . $e->getMessage());
        }
    }
}
