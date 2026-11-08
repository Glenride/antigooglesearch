import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plug, Slack, Github, MessageSquare, Book, ShieldCheck, Zap, Power, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import integrationRoutes from '@/routes/integrations';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integrations',
        href: '/integrations',
    },
];

interface Integration {
    id: string;
    name: string;
    icon: string;
    type: string;
    connected: boolean;
}

const IconMap: Record<string, any> = {
    slack: Slack,
    github: Github,
    'message-square': MessageSquare,
    book: Book,
};

export default function Integrations({ integrations = [] }: { integrations: Integration[] }) {
    const { post, processing } = useForm();

    const handleConnect = (id: string) => {
        post(integrationRoutes.store().url, {
            data: { provider: id }
        } as any);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrations - Chad Jubilee" />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">
                <div className="mb-8 max-w-5xl mx-auto w-full">
                    <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Integrations</h1>
                    <p className="text-slate-500 font-medium">Connect external tools to empower your AI agents with real-time data.</p>
                </div>

                <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {integrations.map((integration) => {
                        const Icon = IconMap[integration.icon] || Plug;
                        return (
                            <div key={integration.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${integration.connected ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                                        }`}>
                                        <Icon className={`w-7 h-7 ${integration.connected ? 'text-emerald-500' : 'text-slate-400'}`} />
                                    </div>
                                    <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${integration.connected
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                        {integration.connected ? 'Connected' : 'Disconnected'}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#0A192F] mb-1">{integration.name}</h3>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{integration.type}</div>
                                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                        Allow agents to bridge communication and automate workflows directly within your {integration.name} workspace.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    {integration.connected ? (
                                        <>
                                            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200">
                                                <Settings2 className="w-4 h-4 mr-2" />
                                                Configure
                                            </Button>
                                            <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100">
                                                <Power className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => handleConnect(integration.id)}
                                            disabled={processing}
                                            className="flex-1 h-12 bg-[#0A192F] hover:bg-[#007BFF] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                                        >
                                            <Zap className="w-4 h-4 mr-2" />
                                            Connect {integration.name}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 max-w-5xl mx-auto w-full p-8 rounded-3xl bg-blue-50/50 border border-blue-100 border-dashed flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-[#0A192F]">Security first architecture</h4>
                            <p className="text-xs text-slate-500">All integration tokens are encrypted with AES-256-GCM and stored in dedicated vaults.</p>
                        </div>
                    </div>
                    <Button variant="link" className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                        Security Overview
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
