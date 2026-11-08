import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    CheckCircle2,
    Circle,
    Play,
    Pause,
    FileText,
    File,
    ChevronRight,
    Zap
} from 'lucide-react';

// Goals Progress Widget
interface GoalPhase {
    name: string;
    completed: boolean;
    active?: boolean;
}

interface GoalsProgressWidgetProps {
    completion: number;
    phases: GoalPhase[];
    className?: string;
}

export function GoalsProgressWidget({ completion, phases, className }: GoalsProgressWidgetProps) {
    return (
        <div className={cn("relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)]", className)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF] rounded-full blur-[80px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-extrabold text-[#0A192F] text-xs uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#00D4FF] fill-[#00D4FF]/20" />
                        Mission Progress
                    </h3>
                    <span className="text-sm font-black text-[#007BFF] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{completion}%</span>
                </div>

                <div className="mb-2.5 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Status: Protocol Execution</div>
                <div className="h-2.5 bg-slate-100 rounded-full mb-6 overflow-hidden border border-slate-200/50 shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-[#00D4FF] via-[#007BFF] to-[#007BFF] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                        style={{ width: `${completion}%` }}
                    />
                </div>

                <div className="space-y-4">
                    {phases.map((phase, index) => (
                        <div key={index} className="flex items-center gap-4 group">
                            <div className={cn(
                                "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                phase.completed
                                    ? "bg-[#007BFF]/10 text-[#007BFF] shadow-sm ring-1 ring-[#007BFF]/20"
                                    : "bg-slate-50 text-slate-300 ring-1 ring-slate-100"
                            )}>
                                {phase.completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                    <Circle className="w-3.5 h-3.5" />
                                )}
                            </div>
                            <span className={cn(
                                "text-sm transition-colors",
                                phase.completed
                                    ? "text-[#0A192F] font-bold"
                                    : "text-slate-400 font-medium group-hover:text-slate-600"
                            )}>
                                {phase.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Quick Actions Widget
interface QuickAction {
    label: string;
    icon: 'play' | 'pause' | 'file';
    onClick?: () => void;
}

interface QuickActionsWidgetProps {
    actions: QuickAction[];
    className?: string;
}

export function QuickActionsWidget({ actions, className }: QuickActionsWidgetProps) {
    const iconMap = {
        play: Play,
        pause: Pause,
        file: FileText,
    };

    return (
        <div className={cn("bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]", className)}>
            <h3 className="font-bold text-[#0A192F] mb-4 text-xs uppercase tracking-widest">Quick Actions</h3>

            <div className="space-y-2">
                {actions.map((action, index) => {
                    const IconComponent = iconMap[action.icon];
                    return (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-sm text-slate-600 hover:text-[#0A192F] hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-200 group"
                        >
                            <span className="w-8 h-8 flex items-center justify-center bg-[#E0F7FF] text-[#007BFF] rounded-lg group-hover:scale-105 transition-transform">
                                <IconComponent className="w-4 h-4" />
                            </span>
                            <span className="font-semibold">{action.label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// Recent Files Widget
interface RecentFile {
    name: string;
    size: string;
    date: string;
}

interface RecentFilesWidgetProps {
    files: RecentFile[];
    onViewAll?: () => void;
    className?: string;
}

export function RecentFilesWidget({ files, onViewAll, className }: RecentFilesWidgetProps) {
    return (
        <div className={cn("bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#0A192F] text-xs uppercase tracking-widest">Recent Files</h3>
                <button
                    onClick={onViewAll}
                    className="text-xs text-[#007BFF] hover:text-[#0056b3] font-bold hover:underline transition-colors"
                >
                    VIEW ALL
                </button>
            </div>

            <div className="space-y-3">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group"
                    >
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:border-blue-200 transition-colors">
                            <File className="w-5 h-5 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="text-sm font-semibold text-[#0A192F] group-hover:text-[#007BFF] truncate transition-colors">
                                {file.name}
                            </div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                                {file.size} • {file.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Active Agents Widget (for sidebar or elsewhere)
interface Agent {
    name: string;
    role: string;
    avatar?: string;
    color: string;
    status?: 'active' | 'idle';
}

interface ActiveAgentsWidgetProps {
    agents: Agent[];
    onManage?: () => void;
    onAddAgent?: () => void;
    className?: string;
}

export function ActiveAgentsWidget({ agents, onManage, onAddAgent, className }: ActiveAgentsWidgetProps) {
    return (
        <div className={cn("", className)}>
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Agents</h4>
                <button
                    onClick={onManage}
                    className="text-xs text-[#007BFF] hover:text-[#0056b3] font-medium transition-colors"
                >
                    Manage
                </button>
            </div>

            <div className="space-y-2">
                {agents.map((agent, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-200"
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                            style={{ backgroundColor: agent.color }}
                        >
                            {agent.avatar || agent.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#0A192F] flex items-center gap-2">
                                {agent.name}
                                {agent.status === 'active' && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e]" />
                                )}
                            </div>
                            <div className="text-xs text-slate-500 truncate">{agent.role}</div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onAddAgent}
                className="w-full mt-3 py-2 text-sm text-slate-500 hover:text-[#0A192F] hover:bg-slate-100 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 transition-all font-semibold"
            >
                + Add Agent
            </button>
        </div>
    );
}

// Project Specs Widget (for sidebar or elsewhere)
interface ProjectSpec {
    label: string;
    value: string;
}

interface ProjectSpecsWidgetProps {
    specs: ProjectSpec[];
    className?: string;
}

export function ProjectSpecsWidget({ specs, className }: ProjectSpecsWidgetProps) {
    return (
        <div className={cn("", className)}>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Project Specs</h4>

            <div className="space-y-2">
                {specs.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 hover:bg-slate-100/50 rounded-lg transition-colors">
                        <span className="text-slate-500">{spec.label}</span>
                        <span className="font-semibold text-[#0A192F]">{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

