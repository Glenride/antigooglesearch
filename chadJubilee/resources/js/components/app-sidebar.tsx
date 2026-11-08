import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ActiveAgentsWidget, ProjectSpecsWidget } from '@/components/dashboard-widgets';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import projects from '@/routes/projects';
import agents from '@/routes/agents';
import team from '@/routes/team';
import billing from '@/routes/billing';
import integrationRoutes from '@/routes/integrations';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    CreditCard,
    FolderKanban,
    Activity,
    Cpu,
    Users,
    Plug,
    Settings,
    HelpCircle,
    Zap,
    Database
} from 'lucide-react';
import knowledge from '@/routes/knowledge';

// Navigation sections matching PRD
const generalNavItems: NavItem[] = [
    {
        title: 'Command Center',
        href: dashboard().url,
        icon: LayoutDashboard,
    },
    {
        title: 'Projects',
        href: projects.index().url,
        icon: FolderKanban,
    },
    {
        title: 'Activity',
        href: '#',
        icon: Activity,
    },
];

const toolsNavItems: NavItem[] = [
    {
        title: 'Agent Studio',
        href: agents.studio().url,
        icon: Cpu,
        badge: 'BETA',
    },
    {
        title: 'Marketplace',
        href: agents.marketplace().url,
        icon: Zap,
    },
    {
        title: 'Knowledge Base',
        href: knowledge.index().url,
        icon: Database,
    },
    {
        title: 'Team',
        href: team.index().url,
        icon: Users,
    },
    {
        title: 'Billing',
        href: billing.index().url,
        icon: CreditCard,
    },
];

const supportNavItems: NavItem[] = [
    {
        title: 'Integrations',
        href: integrationRoutes.index().url,
        icon: Plug,
    },
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
    },
    {
        title: 'Help',
        href: '#',
        icon: HelpCircle,
    },
];

// Mock data for agents
const activeAgents = [
    { name: 'Research Agent', role: 'Data Analyst', color: '#8B5CF6', status: 'active' as const },
    { name: 'Spec Writer', role: 'Technical Writer', color: '#F59E0B', status: 'active' as const },
    { name: 'Roadmap Planner', role: 'Project Manager', color: '#3B82F6', status: 'idle' as const },
];

// Mock data for project specs
const projectSpecs = [
    { label: 'Owner', value: 'Mia Patel' },
    { label: 'Due Date', value: '2025-04-15' },
    { label: 'Budget', value: '200k Tokens' },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-white border-r border-slate-100/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Header with Chad Jubilee Logo */}
            <SidebarHeader className="border-b border-slate-100/50 pb-4 pt-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-50">
                            <Link href={dashboard()} prefetch className="flex items-center gap-3">
                                <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#00D4FF] to-[#007BFF] rounded-xl shadow-lg shadow-blue-500/20">
                                    <div className="absolute inset-2 border-2 border-white/80 rounded-full"></div>
                                    <div className="absolute inset-[13px] border-2 border-white/60 rounded-full"></div>
                                </div>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-['Dancing_Script'] font-extrabold text-2xl text-[#0A192F] tracking-tight">Chad Jubilee</span>
                                    <span className="truncate text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">GS_RESEARCH_V1.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4 space-y-6">
                {/* GENERAL Section */}
                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
                        General
                    </SidebarGroupLabel>
                    <NavMain items={generalNavItems} />
                </SidebarGroup>

                {/* TOOLS Section */}
                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
                        Tools
                    </SidebarGroupLabel>
                    <NavMain items={toolsNavItems} />
                </SidebarGroup>

                {/* SUPPORT Section */}
                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
                        Support
                    </SidebarGroupLabel>
                    <NavMain items={supportNavItems} />
                </SidebarGroup>

                {/* Active Agents Panel */}
                <div className="mt-4 px-2">
                    <ActiveAgentsWidget agents={activeAgents} />
                </div>

                {/* Project Specs Panel */}
                <div className="mt-6 px-2 pt-4 border-t border-slate-100">
                    <ProjectSpecsWidget specs={projectSpecs} />
                </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 p-4 bg-white/50 backdrop-blur-sm">
                {/* Organization Switcher */}
                <OrganizationSwitcher />

                {/* Upgrade Button */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-amber-200 hover:bg-amber-50/50 transition-all text-sm font-semibold text-slate-600 hover:text-[#0A192F] group shadow-sm">
                    <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    Upgrade Plan
                </button>

                {/* Copyright */}
                <div className="mt-4 text-center text-[10px] text-slate-300 font-medium">
                    © 2025 Chad Jubilee
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
