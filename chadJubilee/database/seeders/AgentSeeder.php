<?php

namespace Database\Seeders;

use App\Models\Agent;
use Illuminate\Database\Seeder;

class AgentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agents = [
            [
                'name' => 'Research Agent',
                'role' => 'Data Analyst',
                'type' => 'research',
                'avatar_color' => '#8B5CF6', // Purple
                'status' => 'active',
            ],
            [
                'name' => 'Spec Writer',
                'role' => 'Technical Writer',
                'type' => 'writer',
                'avatar_color' => '#F59E0B', // Amber
                'status' => 'active',
            ],
            [
                'name' => 'Roadmap Planner',
                'role' => 'Project Manager',
                'type' => 'planner',
                'avatar_color' => '#3B82F6', // Blue
                'status' => 'idle',
            ],
        ];

        foreach ($agents as $agentData) {
            Agent::create($agentData);
        }
    }
}
