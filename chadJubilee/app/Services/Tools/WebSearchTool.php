<?php

namespace App\Services\Tools;

class WebSearchTool implements AgentToolInterface
{
    public function execute(array $parameters)
    {
        $query = $parameters['query'] ?? '';
        // Mock implementation for now
        return [
            'status' => 'success',
            'results' => [
                ['title' => "Search results for: {$query}", 'url' => 'https://example.com', 'snippet' => 'This is a mock search result.']
            ]
        ];
    }

    public function getParametersSchema(): array
    {
        return [
            'query' => ['type' => 'string', 'description' => 'The search query']
        ];
    }
}
