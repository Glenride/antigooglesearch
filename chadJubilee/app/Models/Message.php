<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory, HasUuids, \App\Traits\BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'project_id',
        'sender_type',
        'sender_id',
        'content',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the project this message belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the sender (User or Agent).
     */
    public function sender()
    {
        if ($this->sender_type === 'user') {
            return $this->belongsTo(User::class, 'sender_id');
        }
        return $this->belongsTo(Agent::class, 'sender_id');
    }

    /**
     * Check if message is from an agent.
     */
    public function isFromAgent(): bool
    {
        return $this->sender_type === 'agent';
    }

    /**
     * Check if message is from a user.
     */
    public function isFromUser(): bool
    {
        return $this->sender_type === 'user';
    }

    /**
     * Get formatted timestamp.
     */
    public function getFormattedTimestampAttribute(): string
    {
        $now = now();
        $created = $this->created_at;
        
        if ($created->isToday()) {
            return 'Today, ' . $created->format('g:i A');
        } elseif ($created->isYesterday()) {
            return 'Yesterday, ' . $created->format('g:i A');
        } else {
            return $created->format('M j, g:i A');
        }
    }
}
