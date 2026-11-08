<?php

namespace App\Jobs;

use App\Events\MessageSent;
use App\Models\Message;
use App\Services\AgentResponseService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessAgentResponse implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Message $userMessage
    ) {}

    /**
     * Execute the job.
     */
    public function handle(AgentResponseService $agentService): void
    {
        $agentMessage = $agentService->processMessage($this->userMessage);
        
        if ($agentMessage) {
            broadcast(new MessageSent($agentMessage));
        }
    }
}
