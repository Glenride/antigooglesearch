<?php

namespace App\Services\Tools;

class SpecGeneratorTool implements AgentToolInterface
{
    public function execute(array $parameters)
    {
        $context = $parameters['context'] ?? '';
        // Mock implementation for now
        return [
            'status' => 'success',
            'spec' => "# PRD: {$context}\n\nThis is a mock PRD generated based on the context."
        ];
    }

    public function getParametersSchema(): array
    {
        return [
            'context' => ['type' => 'string', 'description' => 'Project context for the spec']
        ];
    }
}
