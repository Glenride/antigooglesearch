import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Save, Wand2, ShieldCheck, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Tool {
    id: number;
    name: string;
    description: string;
}

interface Agent {
    id: string;
    name: string;
    role: string;
    system_prompt: string;
    tools: Tool[];
}

export default function EditAgent({ agent, tools = [] }: { agent: Agent; tools: Tool[] }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Agent Studio',
            href: '/agents/studio',
        },
        {
            title: agent.name,
            href: `/agents/${agent.id}`,
        },
        {
            title: 'Edit',
            href: `/agents/${agent.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors } = useForm({
        name: agent.name,
        role: agent.role,
        system_prompt: agent.system_prompt,
        tools: agent.tools.map((t) => t.id) as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/agents/${agent.id}`);
    };

    const toggleTool = (toolId: number) => {
        const currentTools = [...data.tools];
        const index = currentTools.indexOf(toolId);
        if (index > -1) {
            currentTools.splice(index, 1);
        } else {
            currentTools.push(toolId);
        }
        setData('tools', currentTools);
    };

    const handleDelete = () => {
        router.delete(`/agents/${agent.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${agent.name} - Chad Jubilee`} />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">
                <div className="mb-8 max-w-4xl mx-auto w-full flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Edit Agent</h1>
                        <p className="text-slate-500 font-medium">Update your agent's configuration and capabilities.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/agents/studio')}
                        className="rounded-xl border-slate-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Studio
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-2 block">Agent Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Data Ghost"
                                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="role" className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-2 block">Agent Role</Label>
                                    <Input
                                        id="role"
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        placeholder="e.g. Senior Research Specialist"
                                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                    {errors.role && <p className="text-red-500 text-xs mt-1 font-bold">{errors.role}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="system_prompt" className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-2 block">System Prompt (The Agent's "Soul")</Label>
                                <Textarea
                                    id="system_prompt"
                                    value={data.system_prompt}
                                    onChange={e => setData('system_prompt', e.target.value)}
                                    placeholder="Define how this agent should think, behave, and use its tools..."
                                    className="min-h-[300px] rounded-2xl border-slate-200 focus:ring-blue-500 p-4 leading-relaxed"
                                />
                                {errors.system_prompt && <p className="text-red-500 text-xs mt-1 font-bold">{errors.system_prompt}</p>}
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                            <h3 className="text-sm font-bold text-red-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Danger Zone
                            </h3>
                            <p className="text-sm text-red-600 mb-4">Once you delete an agent, there is no going back.</p>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                className="rounded-xl"
                            >
                                Delete Agent
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-widest flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-[#00D4FF]" />
                                Tool Registry
                            </h3>
                            <div className="space-y-3">
                                {tools.map((tool) => (
                                    <div
                                        key={tool.id}
                                        onClick={() => toggleTool(tool.id)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${data.tools.includes(tool.id)
                                            ? 'border-[#007BFF] bg-blue-50/30'
                                            : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id={`tool-${tool.id}`}
                                                checked={data.tools.includes(tool.id)}
                                                className="border-slate-300 data-[state=checked]:bg-[#007BFF] data-[state=checked]:border-[#007BFF]"
                                            />
                                            <div>
                                                <div className="text-sm font-bold text-[#0A192F]">{tool.name.replace('_', ' ')}</div>
                                                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">{tool.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0A192F] p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>

                            <div className="space-y-2 relative">
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Selected Capabilities</div>
                                <div className="text-2xl font-extrabold text-white">{data.tools.length} Tools</div>
                                <div className="text-xs text-slate-400">Your agent will have access to live data processing.</div>
                            </div>

                            <Button
                                disabled={processing}
                                className="w-full h-14 bg-white hover:bg-slate-100 text-[#0A192F] font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Changes
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                <ShieldCheck className="w-3 h-3" />
                                Enterprise Grade Security
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {agent.name}?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the agent
                            and remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
