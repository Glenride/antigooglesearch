<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentTemplate extends Model
{
    protected $guarded = [];

    protected $casts = [
        'suggested_tools' => 'array',
        'capabilities' => 'array',
        'is_public' => 'boolean',
    ];
}
