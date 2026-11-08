<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->text('description')->after('role')->nullable();
            $table->text('system_prompt')->after('description')->nullable();
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('organization_id')->after('id')->nullable()->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');
        });

        Schema::table('agents', function (Blueprint $table) {
            $table->dropColumn(['description', 'system_prompt']);
        });
    }
};
