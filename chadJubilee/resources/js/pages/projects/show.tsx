import AppLayout from '@/layouts/app-layout';
import { ConversationPanel } from '@/components/conversation-panel';
import { GoalsProgressWidget, QuickActionsWidget, RecentFilesWidget, ActiveAgentsWidget } from '@/components/dashboard-widgets';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Pencil, Play, Loader2, ArrowLeft, Plus, UserPlus } from 'lucide-react';
import { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Message {
    id: string;
    sender: {
        name: string;
        color: string;
        isAgent: boolean;
    };
    content: string;
    timestamp: string;
}

interface GoalPhase {
    name: string;
    completed: boolean;
    active?: boolean;
}

interface QuickAction {
    label: string;
    icon: 'play' | 'pause' | 'file';
}

interface RecentFile {
    name: string;
    size: string;
    date: string;
}

interface Agent {
    id: string;
    name: string;
    role: string;
    type: string;
    avatar_color: string;
    status?: 'active' | 'idle' | 'paused';
}

interface Goal {
    id: string;
    name: string;
    phase: number;
    completed: boolean;
}

interface ProjectFile {
    id: string;
    name: string;
    size: string;
    date: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    due_date?: string;
    budget_tokens?: number;
    completion: number;
}

interface Props {
    project: Project;
    agents: Agent[];
    availableAgents: Agent[];
    goals: Goal[];
    files: ProjectFile[];
    messages: Message[];
    goalsProgress: {
        completion: number;
        phases: GoalPhase[];
    };
    quickActions: QuickAction[];
    recentFiles: RecentFile[];
}

export default function ProjectShow({
    project,
    agents,
    availableAgents,
    goals,
    files,
    messages: initialMessages,
    goalsProgress,
    quickActions,
    recentFiles,
}: Props) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
    ];

    const handleSendMessage = useCallback(async (content: string) => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const response = await fetch(`/api/projects/${project.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            if (data.userMessage) {
                setMessages(prev => [...prev, data.userMessage]);
            }

            if (data.agentMessage) {
                setTimeout(() => {
                    setMessages(prev => [...prev, data.agentMessage]);
                }, 300);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    }, [project.id, isLoading]);

    const handleAddAgent = async (agentId: string) => {
        try {
            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const response = await fetch(`/api/projects/${project.id}/agents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ agent_id: agentId }),
            });

            if (response.ok) {
                setShowAddAgentDialog(false);
                router.reload({ only: ['agents', 'availableAgents'] });
            }
        } catch (error) {
            console.error('Error adding agent:', error);
        }
    };

    const agentsForWidget = agents.map(a => ({
        name: a.name,
        role: a.role,
        color: a.avatar_color,
        status: (a.status || 'idle') as 'active' | 'idle',
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.name} - Chad Jubilee`} />

            <div className="flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E0F7FF] via-[#F0F9FF] to-[#F8FAFC] pointer-events-none"></div>

                {/* Project Header */}
                <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-100/60 px-6 py-6 transition-all">
                    {/* Back Link */}
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 hover:text-[#007BFF] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Projects</span>
                    </Link>

                    {/* Title and Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">{project.name}</h1>
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                                project.status === 'active' 
                                    ? 'bg-green-50 text-green-600 border border-green-100' 
                                    : project.status === 'completed'
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                                {project.status}
                            </span>
                            {isLoading && (
                                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#007BFF] animate-pulse">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Agent thinking...</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10 px-5 text-sm border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#0A192F] rounded-xl font-bold transition-all shadow-sm">
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Project
                            </Button>
                            <Button className="h-10 px-5 text-sm bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px]">
                                <Play className="w-4 h-4 mr-2" />
                                Run Workflow
                            </Button>
                        </div>
                    </div>

                    {/* Project Description */}
                    {project.description && (
                        <p className="text-slate-500 text-sm mb-4 max-w-2xl">{project.description}</p>
                    )}

                    {/* Project Meta */}
                    <div className="flex items-center gap-6 text-sm">
                        {project.due_date && (
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">Due:</span>
                                <span className="font-semibold text-[#0A192F]">{project.due_date}</span>
                            </div>
                        )}
                        {project.budget_tokens && (
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">Budget:</span>
                                <span className="font-semibold text-[#0A192F]">{project.budget_tokens.toLocaleString()} tokens</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Agents:</span>
                            <span className="font-semibold text-[#0A192F]">{agents.length}</span>
                        </div>
                    </div>
                </div>

                {/* Three Column Layout */}
                <div className="relative z-10 flex-1 flex overflow-hidden">
                    {/* Left Sidebar - Agents */}
                    <div className="w-72 border-r border-slate-100/60 bg-white/40 backdrop-blur-md p-6 overflow-y-auto scrollbar-hide">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[#0A192F] text-xs uppercase tracking-widest">Project Agents</h3>
                            <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
                                <DialogTrigger asChild>
                                    <button className="text-xs text-[#007BFF] hover:text-[#0056b3] font-bold transition-colors flex items-center gap-1">
                                        <UserPlus className="w-3.5 h-3.5" />
                                        Add
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add Agent to Project</DialogTitle>
                                        <DialogDescription>
                                            Select an agent to add to this project.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-2 max-h-64 overflow-y-auto py-4">
                                        {availableAgents.length === 0 ? (
                                            <p className="text-sm text-slate-500 text-center py-4">All agents are already assigned to this project.</p>
                                        ) : (
                                            availableAgents.map((agent) => (
                                                <button
                                                    key={agent.id}
                                                    onClick={() => handleAddAgent(agent.id)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-200"
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                                                        style={{ backgroundColor: agent.avatar_color }}
                                                    >
                                                        {agent.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-[#0A192F]">{agent.name}</div>
                                                        <div className="text-xs text-slate-500">{agent.role}</div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {agents.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                                    <UserPlus className="w-5 h-5 text-slate-300" />
                                </div>
                                <p className="text-sm text-slate-400 mb-3">No agents assigned</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddAgentDialog(true)}
                                    className="text-xs"
                                >
                                    Add First Agent
                                </Button>
                            </div>
                        ) : (
                            <ActiveAgentsWidget
                                agents={agentsForWidget}
                                onAddAgent={() => setShowAddAgentDialog(true)}
                            />
                        )}
                    </div>

                    {/* Center - Conversation Panel */}
                    <div className="flex-1 p-6 lg:p-10 overflow-hidden">
                        <ConversationPanel
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            className="h-full shadow-[0_12px_40px_rgba(0,0,0,0.04)] ring-1 ring-slate-100"
                        />
                    </div>

                    {/* Right Sidebar - Widgets */}
                    <div className="w-80 border-l border-slate-100/60 bg-white/40 backdrop-blur-md p-8 overflow-y-auto space-y-8 scrollbar-hide">
                        <GoalsProgressWidget
                            completion={goalsProgress.completion}
                            phases={goalsProgress.phases}
                        />
                        <QuickActionsWidget actions={quickActions} />
                        <RecentFilesWidget files={recentFiles} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
