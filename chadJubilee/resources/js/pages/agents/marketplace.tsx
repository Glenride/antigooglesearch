import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Zap, Search, Filter, Cpu, Code, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import agents from '@/routes/agents';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Marketplace',
        href: '/agents/marketplace',
    },
];

interface Template {
    id: number;
    name: string;
    role: string;
    description: string;
    avatar_url: string;
    suggested_tools: string[];
    capabilities: string[];
}

export default function Marketplace({ templates = [] }: { templates: Template[] }) {
    const { post, processing } = useForm({});

    const handleDeploy = (id: number) => {
        post(agents.instantiate(id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marketplace - Chad Jubilee" />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Agent Marketplace</h1>
                    <p className="text-slate-500 font-medium">Discover and deploy elite agent templates to your organization.</p>
                </div>

                <div className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input className="pl-10 h-12 rounded-xl border-slate-200 bg-white" placeholder="Search agents by role, name, or capability..." />
                    </div>
                    <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200 bg-white hover:bg-slate-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div key={template.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 overflow-hidden shadow-inner">
                                    <img src={template.avatar_url} alt={template.name} className="w-full h-full object-cover rounded-lg" />
                                </div>
                                <div className="px-3 py-1 bg-[#00D4FF]/10 text-[#00D4FF] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#00D4FF]/20">
                                    Elite
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#0A192F] mb-1 group-hover:text-[#007BFF] transition-colors">{template.name}</h3>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{template.role}</div>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{template.description}</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {template.capabilities.slice(0, 2).map((cap) => (
                                        <span key={cap} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100">
                                            {cap.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={() => handleDeploy(template.id)}
                                disabled={processing}
                                className="w-full h-12 bg-[#0A192F] hover:bg-[#007BFF] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                            >
                                <Zap className="w-4 h-4 mr-2 fill-current" />
                                Deploy Template
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
