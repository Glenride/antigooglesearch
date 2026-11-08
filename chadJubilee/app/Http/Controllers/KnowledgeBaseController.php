<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class KnowledgeBaseController extends Controller
{
    public function index()
    {
        return Inertia::render('knowledge/index', [
            'documents' => KnowledgeDocument::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB
            'project_id' => 'nullable|exists:projects,id',
        ]);

        $file = $request->file('file');
        $path = $file->store('knowledge', 'public');

        $document = KnowledgeDocument::create([
            'project_id' => $request->project_id,
            'name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'status' => 'pending',
            'metadata' => [
                'mime_type' => $file->getClientMimeType(),
                'indexed_at' => null,
            ]
        ]);

        // Simulated processing
        $document->update(['status' => 'indexed']);

        return redirect()->back()->with('success', "Document {$document->name} uploaded and indexed.");
    }

    public function destroy(KnowledgeDocument $document)
    {
        Storage::delete($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', "Document deleted.");
    }
}
