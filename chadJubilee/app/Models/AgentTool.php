<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AgentTool extends Model
{
    protected $guarded = [];

    protected $casts = [
        'parameters_schema' => 'array',
        'is_enabled' => 'boolean',
    ];

    public function agents(): BelongsToMany
    {
        return $this->belongsToMany(Agent::class);
    }
}
