<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\AgentStudioController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\WorkflowController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    // Dashboard (uses controller now)
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Project Management
    Route::resource('projects', ProjectController::class);
    
    // Agent Studio & Marketplace
    Route::get('agents/studio', [AgentStudioController::class, 'index'])->name('agents.studio');
    Route::get('agents/marketplace', [AgentStudioController::class, 'marketplace'])->name('agents.marketplace');
    Route::get('agents/create', [AgentStudioController::class, 'create'])->name('agents.create');
    Route::post('agents', [AgentStudioController::class, 'store'])->name('agents.store');
    Route::get('agents/{agent}', [AgentStudioController::class, 'show'])->name('agents.show');
    Route::get('agents/{agent}/edit', [AgentStudioController::class, 'edit'])->name('agents.edit');
    Route::patch('agents/{agent}', [AgentStudioController::class, 'update'])->name('agents.update');
    Route::delete('agents/{agent}', [AgentStudioController::class, 'destroy'])->name('agents.destroy');
    Route::post('agents/templates/{template}/instantiate', [AgentStudioController::class, 'instantiate'])->name('agents.instantiate');
    
    // Knowledge Base
    Route::get('knowledge', [KnowledgeBaseController::class, 'index'])->name('knowledge.index');
    Route::post('knowledge', [KnowledgeBaseController::class, 'store'])->name('knowledge.store');
    Route::delete('knowledge/{document}', [KnowledgeBaseController::class, 'destroy'])->name('knowledge.destroy');
    
    // Integrations
    Route::get('integrations', [IntegrationController::class, 'index'])->name('integrations.index');
    Route::post('integrations', [IntegrationController::class, 'store'])->name('integrations.store');
    
    // Team & Organizations
    Route::get('team', [TeamController::class, 'index'])->name('team.index');
    Route::post('team/invite', [TeamController::class, 'invite'])->name('team.invite');
    Route::delete('team/{user}', [TeamController::class, 'remove'])->name('team.remove');
    
    // Organization
    Route::post('/organizations/{organization}/switch', [OrganizationController::class, 'switch'])->name('organizations.switch');
    
    // Billing
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('billing/checkout', [BillingController::class, 'checkout'])->name('billing.checkout');
    Route::get('billing/portal', [BillingController::class, 'portal'])->name('billing.portal');

    // API Routes for Projects/Agents
    Route::prefix('api')->group(function () {
        // Projects
        Route::get('projects', [ProjectController::class, 'index'])->name('api.projects.index');
        Route::post('projects', [ProjectController::class, 'store'])->name('api.projects.store');
        Route::get('projects/{project}', [ProjectController::class, 'show'])->name('api.projects.show');
        Route::patch('projects/{project}', [ProjectController::class, 'update'])->name('api.projects.update');
        Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('api.projects.destroy');
        
        // Project Agents
        Route::get('projects/{project}/agents', [ProjectController::class, 'agents'])->name('api.projects.agents');
        Route::post('projects/{project}/agents', [ProjectController::class, 'addAgent'])->name('api.projects.addAgent');
        Route::delete('projects/{project}/agents/{agent}', [ProjectController::class, 'removeAgent'])->name('api.projects.removeAgent');
        
        // Messages
        Route::get('projects/{project}/messages', [MessageController::class, 'index'])->name('api.messages.index');
        Route::post('projects/{project}/messages', [MessageController::class, 'store'])->name('api.messages.store');
        
        // Goals
        Route::get('projects/{project}/goals', [GoalController::class, 'index'])->name('api.goals.index');
        Route::post('projects/{project}/goals', [GoalController::class, 'store'])->name('api.goals.store');
        Route::patch('goals/{goal}', [GoalController::class, 'update'])->name('api.goals.update');
        Route::delete('goals/{goal}', [GoalController::class, 'destroy'])->name('api.goals.destroy');
        
        // Files
        Route::get('projects/{project}/files', [ProjectFileController::class, 'index'])->name('api.files.index');
        Route::post('projects/{project}/files', [ProjectFileController::class, 'store'])->name('api.files.store');
        Route::get('files/{file}/download', [ProjectFileController::class, 'download'])->name('api.files.download');
        Route::delete('files/{file}', [ProjectFileController::class, 'destroy'])->name('api.files.destroy');
        
        // Agents
        Route::get('agents', [AgentController::class, 'index'])->name('api.agents.index');
        Route::patch('agents/{agent}/status', [AgentController::class, 'updateStatus'])->name('api.agents.updateStatus');
        
        // Usage Logs
        Route::get('usage', [BillingController::class, 'usage'])->name('api.usage.index');
        
        // Workflows
        Route::get('workflows', [WorkflowController::class, 'list'])->name('api.workflows.list');
        Route::post('workflows/run', [WorkflowController::class, 'run'])->name('api.workflows.run');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
