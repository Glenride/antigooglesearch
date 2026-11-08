import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderKanban, Plus, ChevronRight, Calendar, Coins } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    due_date?: string;
    agents_count: number;
    completion?: number;
}

interface Agent {
    id: string;
    name: string;
    role: string;
    type: string;
    avatar_color: string;
}

interface Props {
    projects: Project[];
    availableAgents: Agent[];
}

export default function ProjectIndex({ projects = [], availableAgents = [] }: Props) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        due_date: '',
        budget_tokens: '',
    });

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setIsCreating(true);

        try {
            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description || null,
                    due_date: formData.due_date || null,
                    budget_tokens: formData.budget_tokens ? parseInt(formData.budget_tokens) : null,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setShowCreateDialog(false);
                setFormData({ name: '', description: '', due_date: '', budget_tokens: '' });
                router.visit(`/projects/${data.project.id}`);
            }
        } catch (error) {
            console.error('Error creating project:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects - Chad Jubilee" />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Projects</h1>
                        <p className="text-slate-500 font-medium">Manage and monitor your active missions.</p>
                    </div>
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">
                                <Plus className="w-4 h-4 mr-2" />
                                New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <form onSubmit={handleCreateProject}>
                                <DialogHeader>
                                    <DialogTitle>Create New Project</DialogTitle>
                                    <DialogDescription>
                                        Set up a new project to collaborate with AI agents.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Project Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Website Redesign 2025"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            placeholder="What is this project about?"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="due_date" className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                Due Date
                                            </Label>
                                            <Input
                                                id="due_date"
                                                type="date"
                                                value={formData.due_date}
                                                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="budget_tokens" className="flex items-center gap-2">
                                                <Coins className="w-3.5 h-3.5 text-slate-400" />
                                                Token Budget
                                            </Label>
                                            <Input
                                                id="budget_tokens"
                                                type="number"
                                                placeholder="e.g., 100000"
                                                value={formData.budget_tokens}
                                                onChange={(e) => setFormData(prev => ({ ...prev, budget_tokens: e.target.value }))}
                                                className="rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateDialog(false)}
                                        className="rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!formData.name.trim() || isCreating}
                                        className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold rounded-xl"
                                    >
                                        {isCreating ? 'Creating...' : 'Create Project'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {projects.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 p-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <FolderKanban className="w-8 h-8 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-[#0A192F] mb-2">No projects yet</h2>
                        <p className="text-slate-500 mb-6 text-center max-w-sm">Create your first project to start collaborating with AI agents.</p>
                        <Button 
                            variant="outline" 
                            className="rounded-xl font-bold"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            Create First Project
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <FolderKanban className="w-5 h-5 text-[#007BFF]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {project.completion !== undefined && (
                                            <span className="text-xs font-bold text-[#007BFF] bg-blue-50 px-2 py-1 rounded-lg">
                                                {project.completion}%
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#007BFF] transition-colors" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#0A192F] mb-1 group-hover:text-[#007BFF] transition-colors">{project.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description || 'No description'}</p>
                                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {project.agents_count} Agents
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                                        project.status === 'active' 
                                            ? 'bg-green-50 text-green-600' 
                                            : project.status === 'completed'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {project.status}
                                    </span>
                                    {project.due_date && (
                                        <div className="text-xs font-medium text-slate-400 ml-auto">
                                            Due: {project.due_date}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
