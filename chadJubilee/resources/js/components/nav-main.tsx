import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ExtendedNavItem extends NavItem {
    badge?: string;
}

export function NavMain({ items = [] }: { items: ExtendedNavItem[] }) {
    const page = usePage();
    return (
        <SidebarMenu className="gap-1">
            {items.map((item) => {
                const isActive = page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url);
                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={{ children: item.title }}
                            className={cn(
                                "h-11 px-4 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-[#F0F9FF] text-[#007BFF] font-extrabold shadow-sm ring-1 ring-[#007BFF]/10"
                                    : "text-slate-500 hover:text-[#0A192F] hover:bg-slate-50"
                            )}
                        >
                            <Link href={item.href} prefetch className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    {item.icon && (
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-all duration-300",
                                            isActive
                                                ? "text-[#007BFF] scale-110"
                                                : "text-slate-400 group-hover:text-[#0A192F] group-hover:scale-110"
                                        )} />
                                    )}
                                    <span className="text-sm tracking-tight">{item.title}</span>
                                </div>
                                {item.badge && (
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "ml-auto text-[10px] px-2.5 py-0.5 h-auto rounded-full font-black border uppercase tracking-tighter",
                                            isActive
                                                ? "bg-[#00D4FF] text-[#0A192F] border-[#00D4FF]/20 shadow-[0_0_8px_rgba(0,212,255,0.4)]"
                                                : "bg-[#0A192F]/5 text-[#0A192F] border-[#0A192F]/10"
                                        )}
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
