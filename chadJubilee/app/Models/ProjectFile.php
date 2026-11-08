<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'project_id',
        'name',
        'size_bytes',
        'path',
        'mime_type',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
    ];

    /**
     * Get the project this file belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get human-readable file size.
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size_bytes;
        
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 1) . ' MB';
        } elseif ($bytes >= 1024) {
            return round($bytes / 1024, 1) . ' KB';
        } else {
            return $bytes . ' B';
        }
    }

    /**
     * Get formatted date.
     */
    public function getFormattedDateAttribute(): string
    {
        $now = now();
        $created = $this->created_at;
        
        if ($created->isToday()) {
            return 'Today';
        } elseif ($created->isYesterday()) {
            return 'Yesterday';
        } else {
            return $created->format('M j');
        }
    }
}
