<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agent extends Model
{
    use HasFactory, HasUuids, \App\Traits\BelongsToOrganization;

    protected $fillable = [
        'name',
        'role',
        'type',
        'description',
        'system_prompt',
        'avatar_color',
        'status',
    ];

    /**
     * Get the projects this agent is assigned to.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
            ->withPivot('assigned_at')
            ->withTimestamps();
    }

    /**
     * Get all messages sent by this agent.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id')
            ->where('sender_type', 'agent');
    }

    /**
     * Scope: Get only active agents.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get the tools available to this agent.
     */
    public function tools(): BelongsToMany
    {
        return $this->belongsToMany(AgentTool::class);
    }
}
