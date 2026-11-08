<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Goal extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'project_id',
        'name',
        'phase',
        'completed',
    ];

    protected $casts = [
        'phase' => 'integer',
        'completed' => 'boolean',
    ];

    /**
     * Get the project this goal belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Mark goal as completed.
     */
    public function markComplete(): void
    {
        $this->update(['completed' => true]);
    }

    /**
     * Scope: Get only completed goals.
     */
    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    /**
     * Scope: Get only incomplete goals.
     */
    public function scopeIncomplete($query)
    {
        return $query->where('completed', false);
    }
}
