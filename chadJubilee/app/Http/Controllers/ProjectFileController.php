<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectFileController extends Controller
{
    /**
     * Get files for a project.
     */
    public function index(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $files = $project->files->map(fn($f) => [
            'id' => $f->id,
            'name' => $f->name,
            'size' => $f->formatted_size,
            'date' => $f->formatted_date,
            'mime_type' => $f->mime_type,
        ]);

        return response()->json(['files' => $files]);
    }

    /**
     * Upload a file to a project.
     */
    public function store(Request $request, Project $project)
    {
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $uploadedFile = $request->file('file');
        $path = $uploadedFile->store("projects/{$project->id}", 'local');

        $projectFile = ProjectFile::create([
            'project_id' => $project->id,
            'name' => $uploadedFile->getClientOriginalName(),
            'size_bytes' => $uploadedFile->getSize(),
            'path' => $path,
            'mime_type' => $uploadedFile->getMimeType(),
        ]);

        return response()->json([
            'file' => [
                'id' => $projectFile->id,
                'name' => $projectFile->name,
                'size' => $projectFile->formatted_size,
                'date' => $projectFile->formatted_date,
                'mime_type' => $projectFile->mime_type,
            ],
        ], 201);
    }

    /**
     * Download a file.
     */
    public function download(Request $request, ProjectFile $file)
    {
        $project = $file->project;
        
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        if (!Storage::disk('local')->exists($file->path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('local')->download($file->path, $file->name);
    }

    /**
     * Delete a file.
     */
    public function destroy(Request $request, ProjectFile $file)
    {
        $project = $file->project;
        
        if ($project->owner_id !== $request->user()->id) {
            abort(403);
        }

        Storage::disk('local')->delete($file->path);
        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }
}
