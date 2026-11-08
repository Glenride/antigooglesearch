<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AgentTool;

class AgentToolSeeder extends Seeder
{
    public function run(): void
    {
        $tools = [
            [
                'name' => 'web_search',
                'handler_class' => 'App\\Services\\Tools\\WebSearchTool',
                'description' => 'Search the live web for the latest information and data.',
                'parameters_schema' => [
                    'query' => ['type' => 'string', 'description' => 'The search query']
                ],
                'is_enabled' => true,
            ],
            [
                'name' => 'file_writer',
                'handler_class' => 'App\\Services\\Tools\\FileWriterTool',
                'description' => 'Create or modify files within the project workspace.',
                'parameters_schema' => [
                    'path' => ['type' => 'string', 'description' => 'Target file path'],
                    'content' => ['type' => 'string', 'description' => 'Content to write']
                ],
                'is_enabled' => true,
            ],
            [
                'name' => 'spec_generator',
                'handler_class' => 'App\\Services\\Tools\\SpecGeneratorTool',
                'description' => 'Generate technical specifications and documentation fragments.',
                'parameters_schema' => [
                    'context' => ['type' => 'string', 'description' => 'Project context for the spec']
                ],
                'is_enabled' => true,
            ],
        ];

        foreach ($tools as $tool) {
            AgentTool::updateOrCreate(['name' => $tool['name']], $tool);
        }
    }
}
