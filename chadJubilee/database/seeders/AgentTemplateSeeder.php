<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AgentTemplate;

class AgentTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Ghost Researcher',
                'role' => 'Data Intelligence',
                'description' => 'Specialized in deep-web data extraction and synthesis. Perfect for discovery phases.',
                'system_prompt' => 'You are a elite ghost researcher. Your goal is to find facts that others miss. Use your tools to scour the web and return high-fidelity reports.',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost',
                'suggested_tools' => ['web_search'],
                'capabilities' => ['deep_search', 'report_writing'],
                'is_public' => true,
            ],
            [
                'name' => 'Spec Mercenary',
                'role' => 'Technical Architect',
                'description' => 'Translates vague ideas into iron-clad technical specifications and roadmaps.',
                'system_prompt' => 'You are a lead technical architect. You take requirements and turn them into actionable PRDs and task lists.',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=merc',
                'suggested_tools' => ['spec_generator', 'file_writer'],
                'capabilities' => ['prd_generation', 'roadmap_planning'],
                'is_public' => true,
            ],
            [
                'name' => 'Shadow Coder',
                'role' => 'Full-Stack Engineer',
                'description' => 'A high-speed implementation specialist. Writes clean, modular code at elite speed.',
                'system_prompt' => 'You are a senior shadow coder. You implement features based on specs with minimal guidance.',
                'avatar_url' => 'https://api.dicebear.com/7.x/bottts/svg?seed=shadow',
                'suggested_tools' => ['file_writer'],
                'capabilities' => ['refactoring', 'new_feature_impl'],
                'is_public' => true,
            ],
        ];

        foreach ($templates as $template) {
            AgentTemplate::updateOrCreate(['name' => $template['name']], $template);
        }
    }
}
