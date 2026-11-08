<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory, HasUuids, \App\Traits\BelongsToOrganization;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'organization_id',
        'status',
        'due_date',
        'budget_tokens',
    ];

    protected $casts = [
        'due_date' => 'date',
        'budget_tokens' => 'integer',
    ];

    /**
     * Get the owner of the project.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the agents assigned to this project.
     */
    public function agents(): BelongsToMany
    {
        return $this->belongsToMany(Agent::class)
            ->withPivot('assigned_at')
            ->withTimestamps();
    }

    /**
     * Get all messages for this project.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get all goals for this project.
     */
    public function goals(): HasMany
    {
        return $this->hasMany(Goal::class)->orderBy('phase', 'asc');
    }

    /**
     * Get all files for this project.
     */
    public function files(): HasMany
    {
        return $this->hasMany(ProjectFile::class)->orderBy('created_at', 'desc');
    }

    /**
     * Calculate completion percentage based on goals.
     */
    public function getCompletionPercentageAttribute(): int
    {
        $total = $this->goals()->count();
        if ($total === 0) {
            return 0;
        }
        $completed = $this->goals()->where('completed', true)->count();
        return (int) round(($completed / $total) * 100);
    }
}
