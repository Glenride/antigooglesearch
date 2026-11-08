<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\User;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::updateOrCreate(
            ['slug' => 'chad-jubilee-inc'],
            ['name' => 'Chad Jubilee Inc']
        );

        foreach (User::all() as $user) {
            $user->organizations()->syncWithoutDetaching([$org->id => ['role' => 'admin']]);
            $user->update(['current_organization_id' => $org->id]);
        }
    }
}
