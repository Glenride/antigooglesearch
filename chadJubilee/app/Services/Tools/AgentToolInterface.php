<?php

namespace App\Services\Tools;

interface AgentToolInterface
{
    /**
     * Execute the tool with the given parameters.
     *
     * @param array $parameters
     * @return mixed
     */
    public function execute(array $parameters);

    /**
     * Get the JSON schema for the tool parameters.
     *
     * @return array
     */
    public function getParametersSchema(): array;
}
