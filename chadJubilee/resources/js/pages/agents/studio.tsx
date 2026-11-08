import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Cpu, Plus, Sparkles, Settings2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import agentRoutes from '@/routes/agents';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agent Studio',
        href: '/agents/studio',
    },
];

interface Agent {
    id: string;
    name: string;
    role: string;
    status: string;
    avatar_color: string;
}

export default function AgentStudio({ agents = [] }: { agents: Agent[] }) {
    const [deleteAgent, setDeleteAgent] = useState<Agent | null>(null);
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (deleteAgent) {
            destroy(`/agents/${deleteAgent.id}`, {
                onSuccess: () => setDeleteAgent(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agent Studio - Chad Jubilee" />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Agent Studio</h1>
                        <p className="text-slate-500 font-medium">Configure and manage your organization's AI workforce.</p>
                    </div>
                    <Button asChild className="bg-[#0A192F] hover:bg-[#007BFF] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">
                        <Link href={agentRoutes.create().url}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Custom Agent
                        </Link>
                    </Button>
                </div>

                {agents.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                            <Cpu className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-[#0A192F] mb-2">No active agents</h2>
                        <p className="text-slate-500 mb-8 text-center max-w-sm">Deploy agents from the marketplace or build a custom one from scratch to start automating tasks.</p>
                        <div className="flex gap-4">
                            <Button asChild className="rounded-xl font-bold bg-[#0A192F] hover:bg-[#007BFF] px-6 h-12">
                                <Link href={agentRoutes.create().url}>
                                    Build Custom Agent
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="rounded-xl font-bold px-6 h-12 bg-white border-slate-200">
                                <Link href={agentRoutes.marketplace().url}>
                                    <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                                    Browse Marketplace
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {agents.map((agent) => (
                            <div key={agent.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-inner"
                                        style={{ backgroundColor: agent.avatar_color }}
                                    >
                                        {agent.name.substring(0, 1)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.visit(`/agents/${agent.id}/edit`)}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteAgent(agent)}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-[#0A192F] mb-1">{agent.name}</h3>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{agent.role}</div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{agent.status}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.visit(`/agents/${agent.id}`)}
                                        className="h-8 px-3 rounded-lg text-[#007BFF] hover:bg-blue-50 font-bold text-xs uppercase tracking-widest"
                                    >
                                        Open Console
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!deleteAgent} onOpenChange={(open) => !open && setDeleteAgent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {deleteAgent?.name}?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the agent
                            and remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAgent(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
