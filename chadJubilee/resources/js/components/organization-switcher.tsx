import { usePage, router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check, Plus, Building } from 'lucide-react';
import { SharedData, Organization } from '@/types';
import organizationsHelper from '@/routes/organizations';

export function OrganizationSwitcher() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    if (!user || !user.organizations) return null;

    const currentOrg = user.current_organization;
    const organizations = user.organizations;

    const switchOrg = (id: number) => {
        router.post(organizationsHelper.switch(id).url);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-3 mb-3 rounded-2xl bg-white border border-slate-100/60 shadow-sm hover:border-[#007BFF]/30 hover:bg-slate-50/50 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#805AD5] to-[#B794F4] flex items-center justify-center shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform">
                        <span className="text-white text-xs font-bold">
                            {currentOrg?.name?.substring(0, 2).toUpperCase() || 'CJ'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#0A192F] truncate">
                            {currentOrg?.name || 'Chad Jubilee'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Pro Plan
                        </div>
                    </div>
                    <ChevronsUpDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] rounded-2xl p-2 border-slate-100 shadow-xl" sideOffset={8}>
                <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                    Switch Organization
                </DropdownMenuLabel>
                {organizations.map((org: any) => (
                    <DropdownMenuItem
                        key={org.id}
                        onClick={() => switchOrg(org.id)}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer focus:bg-slate-50"
                    >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Building className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className={`text-sm font-semibold flex-1 ${org.id === currentOrg?.id ? 'text-[#0A192F]' : 'text-slate-500'}`}>
                            {org.name}
                        </span>
                        {org.id === currentOrg?.id && <Check className="w-4 h-4 text-emerald-500" />}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer focus:bg-slate-50">
                    <div className="w-8 h-8 rounded-lg border border-dashed border-slate-200 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Create New Org</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
