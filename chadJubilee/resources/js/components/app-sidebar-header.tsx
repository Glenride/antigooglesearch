import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useInitials } from '@/hooks/use-initials';
import { Search, LayoutGrid, Bell, Plus } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-100/60 bg-white/80 backdrop-blur-md px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-40">
            {/* Left side - Sidebar trigger and Search */}
            <div className="flex items-center gap-4 flex-1">
                <SidebarTrigger className="-ml-1 text-slate-400 hover:text-[#0A192F] hover:bg-slate-50 transition-colors" />

                {/* Search Bar */}
                <div className="flex-1 max-w-md hidden md:block">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#007BFF] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects, missions..."
                            className="w-full h-10 pl-10 pr-16 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-[#0A192F] font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            <span className="px-1.5 py-0.5 bg-slate-200/50 rounded-md border border-slate-200/60">⌘</span>
                            <span className="px-1.5 py-0.5 bg-slate-200/50 rounded-md border border-slate-200/60">K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Icons and User */}
            <div className="flex items-center gap-4">
                {/* Notification Stack */}
                <div className="flex items-center gap-1 mr-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#0A192F] hover:bg-slate-50 transition-all group">
                        <LayoutGrid className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#0A192F] hover:bg-slate-50 transition-all group">
                        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#00D4FF] rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#0A192F] hover:bg-slate-50 transition-all group">
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-slate-100" />

                {/* User Section */}
                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-[#0A192F] group-hover:text-[#007BFF] transition-colors">{auth.user.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Protocol: Access</div>
                    </div>
                    <Avatar className="w-10 h-10 ring-2 ring-white shadow-md shadow-slate-200 transition-transform group-hover:scale-105">
                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#00D4FF] to-[#007BFF] text-white font-black">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
