<?php

namespace App\Services\Tools;

class FileWriterTool implements AgentToolInterface
{
    public function execute(array $parameters)
    {
        $path = $parameters['path'] ?? '';
        $content = $parameters['content'] ?? '';
        // Mock implementation for now
        return [
            'status' => 'success',
            'message' => "File written to {$path}"
        ];
    }

    public function getParametersSchema(): array
    {
        return [
            'path' => ['type' => 'string', 'description' => 'Target file path'],
            'content' => ['type' => 'string', 'description' => 'Content to write']
        ];
    }
}
