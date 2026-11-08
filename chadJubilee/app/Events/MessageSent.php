<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $messageData;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Message $message
    ) {
        $sender = $message->sender;
        
        $this->messageData = [
            'id' => $message->id,
            'sender' => [
                'name' => $sender?->name ?? 'Unknown',
                'color' => $message->sender_type === 'agent' 
                    ? ($sender?->avatar_color ?? '#8B5CF6')
                    : '#F472B6',
                'isAgent' => $message->sender_type === 'agent',
            ],
            'content' => $message->content,
            'timestamp' => $message->formatted_timestamp,
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('project.' . $this->message->project_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return ['message' => $this->messageData];
    }
}
