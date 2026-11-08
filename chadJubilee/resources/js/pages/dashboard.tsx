import AppLayout from '@/layouts/app-layout';
import { ConversationPanel } from '@/components/conversation-panel';
import { GoalsProgressWidget, QuickActionsWidget, RecentFilesWidget } from '@/components/dashboard-widgets';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Pencil, Play, Loader2, Zap, Plus } from 'lucide-react';
import { useState, useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Command Center',
        href: dashboard().url,
    },
];

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

interface ProjectSpec {
    label: string;
    value: string;
}

interface Agent {
    name: string;
    role: string;
    color: string;
    status: 'active' | 'idle' | 'paused';
}

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
}

interface DashboardProps {
    project: Project | null;
    agents: Agent[];
    projectSpecs: ProjectSpec[];
    goalsProgress: {
        completion: number;
        phases: GoalPhase[];
    };
    quickActions: QuickAction[];
    recentFiles: RecentFile[];
    messages: Message[];
}

export default function Dashboard() {
    const { props } = usePage<{ props: DashboardProps }>();
    const {
        project,
        goalsProgress = { completion: 0, phases: [] },
        quickActions = [],
        recentFiles = [],
        messages: initialMessages = []
    } = props as unknown as DashboardProps;

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = useCallback(async (content: string) => {
        if (!project || isLoading) return;

        setIsLoading(true);

        try {
            // Get XSRF token from cookie
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

            // Add user message
            if (data.userMessage) {
                setMessages(prev => [...prev, data.userMessage]);
            }

            // Add agent response if present
            if (data.agentMessage) {
                // Small delay to make it feel more natural
                setTimeout(() => {
                    setMessages(prev => [...prev, data.agentMessage]);
                }, 300);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    }, [project, isLoading]);

    // Empty state if no project
    if (!project) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Command Center - Chad Jubilee" />
                <div className="flex flex-col items-center justify-center h-full bg-[#F8FAFC] p-12 relative overflow-hidden">
                    {/* Subtle Mesh Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E0F7FF] via-[#F0F9FF] to-[#F8FAFC] z-0"></div>

                    <div className="text-center relative z-10">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-500/10 flex items-center justify-center mx-auto mb-8 border border-slate-100 rotate-3 transform-gpu">
                            <Zap className="w-10 h-10 text-[#00D4FF]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#0A192F] mb-4">No Active Missions</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">Initialize your first protocol to begin searching like a ghost. Remain hidden, stay efficient.</p>
                        <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold px-10 py-7 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5 mr-3" />
                            Initialize Protocol
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Command Center - Chad Jubilee" />

            {/* Main Dashboard Container */}
            <div className="flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
                {/* Background Essentials */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E0F7FF] via-[#F0F9FF] to-[#F8FAFC] pointer-events-none"></div>

                {/* Project Header */}
                <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-100/60 px-6 py-6 transition-all">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        <span className="hover:text-[#007BFF] cursor-pointer transition-colors">Projects</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-[#0A192F]">Mission P1</span>
                    </div>

                    {/* Title and Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">{project.name}</h1>
                            {isLoading && (
                                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#007BFF] animate-pulse">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>GHOST_MERCENARY thinking...</span>
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

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-10 px-1">
                        <button className="text-sm font-bold text-[#007BFF] pb-4 border-b-2 border-[#007BFF] relative after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-[#007BFF] after:shadow-[0_0_8px_rgba(0,123,255,0.5)]">
                            Overview
                        </button>
                        <button className="text-sm font-bold text-slate-400 hover:text-[#0A192F] pb-4 border-b-2 border-transparent transition-all">
                            Tasks Board
                        </button>
                        <button className="text-sm font-bold text-slate-400 hover:text-[#0A192F] pb-4 border-b-2 border-transparent transition-all">
                            Agents Configuration
                        </button>
                    </div>
                </div>

                {/* Three Column Layout */}
                <div className="relative z-10 flex-1 flex overflow-hidden">
                    {/* Left Column - Conversation Panel */}
                    <div className="flex-1 p-6 lg:p-10 overflow-hidden">
                        <ConversationPanel
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            className="h-full shadow-[0_12px_40px_rgba(0,0,0,0.04)] ring-1 ring-slate-100"
                        />
                    </div>

                    {/* Right Column - Widgets sidebar */}
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

