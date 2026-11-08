<?php

namespace App\Services;

use App\Models\UsageLog;
use App\Models\User;

class UsageLogService
{
    /**
     * Log token usage for an AI request.
     */
    public function logTokenUsage(
        User $user,
        int $promptTokens,
        int $completionTokens,
        string $model,
        ?string $agentType = null,
        ?string $projectId = null
    ): UsageLog {
        $totalTokens = $promptTokens + $completionTokens;
        
        return UsageLog::create([
            'organization_id' => $user->current_organization_id,
            'user_id' => $user->id,
            'event_type' => 'token_usage',
            'amount' => $totalTokens,
            'metadata' => [
                'model' => $model,
                'prompt_tokens' => $promptTokens,
                'completion_tokens' => $completionTokens,
                'agent_type' => $agentType,
                'project_id' => $projectId,
            ],
        ]);
    }

    /**
     * Log agent creation.
     */
    public function logAgentCreation(User $user, string $agentId, string $agentType): UsageLog
    {
        return UsageLog::create([
            'organization_id' => $user->current_organization_id,
            'user_id' => $user->id,
            'event_type' => 'agent_creation',
            'amount' => 1,
            'metadata' => [
                'agent_id' => $agentId,
                'agent_type' => $agentType,
            ],
        ]);
    }

    /**
     * Get usage summary for an organization.
     */
    public function getOrganizationUsage(int $organizationId, ?string $period = 'month'): array
    {
        $query = UsageLog::where('organization_id', $organizationId);
        
        if ($period === 'month') {
            $query->where('created_at', '>=', now()->startOfMonth());
        } elseif ($period === 'week') {
            $query->where('created_at', '>=', now()->startOfWeek());
        } elseif ($period === 'day') {
            $query->where('created_at', '>=', now()->startOfDay());
        }

        $tokenUsage = (clone $query)
            ->where('event_type', 'token_usage')
            ->sum('amount');

        $agentCreations = (clone $query)
            ->where('event_type', 'agent_creation')
            ->count();

        return [
            'total_tokens' => $tokenUsage,
            'agent_creations' => $agentCreations,
            'period' => $period,
        ];
    }
}
