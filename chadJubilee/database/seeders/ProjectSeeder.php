<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Goal;
use App\Models\Message;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the actual user (preferring real users over test users)
        // Use latest() to get the most recently created user (likely the real logged-in user)
        $user = User::latest()->first();
        if (!$user) {
            return; // Skip if no users exist
        }

        // Get agents
        $researchAgent = Agent::where('type', 'research')->first();
        $writerAgent = Agent::where('type', 'writer')->first();
        $plannerAgent = Agent::where('type', 'planner')->first();

        // Create sample project
        $project = Project::withoutGlobalScopes()->create([
            'name' => 'Website Redesign 2025',
            'description' => 'Complete redesign of the company website with new branding and improved UX.',
            'owner_id' => $user->id,
            'organization_id' => $user->current_organization_id,
            'status' => 'active',
            'due_date' => now()->addMonths(4),
            'budget_tokens' => 200000,
        ]);

        // Assign agents to project
        if ($researchAgent) {
            $project->agents()->attach($researchAgent->id);
        }
        if ($writerAgent) {
            $project->agents()->attach($writerAgent->id);
        }
        if ($plannerAgent) {
            $project->agents()->attach($plannerAgent->id);
        }

        // Create goals
        $goals = [
            ['name' => 'Phase 1 Analysis', 'phase' => 1, 'completed' => true],
            ['name' => 'Content Generation', 'phase' => 2, 'completed' => false],
            ['name' => 'Final Review', 'phase' => 3, 'completed' => false],
        ];

        foreach ($goals as $goalData) {
            Goal::create([
                'project_id' => $project->id,
                ...$goalData,
            ]);
        }

        // Create sample files
        $files = [
            ['name' => 'Competitor_Analysis_v2.pdf', 'size_bytes' => 2516582, 'mime_type' => 'application/pdf'],
            ['name' => 'Specs_Homepage_Rev1.docx', 'size_bytes' => 145408, 'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        ];

        foreach ($files as $fileData) {
            ProjectFile::create([
                'project_id' => $project->id,
                ...$fileData,
            ]);
        }

        // Create sample conversation
        $messages = [
            [
                'sender_type' => 'user',
                'sender_id' => $user->id,
                'content' => "@ResearchAgent Let's kickoff the competitor analysis for the redesign. Focus on Stripe, Lemon Squeezy, and Paddle.",
                'created_at' => now()->subDay()->setTime(9, 0),
            ],
            [
                'sender_type' => 'agent',
                'sender_id' => $researchAgent?->id,
                'content' => "Acknowledged. Initiating crawl for Stripe, Lemon Squeezy, and Paddle. Focusing on landing page value propositions and pricing tiers.",
                'created_at' => now()->subDay()->setTime(9, 1),
            ],
            [
                'sender_type' => 'agent',
                'sender_id' => $researchAgent?->id,
                'content' => "Crawl complete. I've analyzed 45 unique pages. Here are the common themes:\n1. Developer-first messaging\n2. Transparent pricing calculators\n3. Dark mode defaults",
                'created_at' => now()->subDay()->setTime(9, 15),
            ],
            [
                'sender_type' => 'user',
                'sender_id' => $user->id,
                'content' => "Great. Can you summarize their header copy styles?",
                'created_at' => now()->subDay()->setTime(9, 20),
            ],
            [
                'sender_type' => 'agent',
                'sender_id' => $researchAgent?->id,
                'content' => "Stripe: \"Financial infrastructure for the internet.\" (Abstract, infrastructure-focused)\nLemon Squeezy: \"Payments, tax, & subscriptions for software companies.\" (Functional, specific)\nPaddle: \"The complete payments, tax, and subscriptions solution.\" (Comprehensive, all-in-one)",
                'created_at' => now()->subDay()->setTime(9, 22),
            ],
        ];

        foreach ($messages as $messageData) {
            if ($messageData['sender_id']) {
                Message::create([
                    'project_id' => $project->id,
                    ...$messageData,
                ]);
            }
        }
    }
}
