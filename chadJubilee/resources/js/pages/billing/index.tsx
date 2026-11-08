import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CreditCard, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing',
        href: '/billing',
    },
];

export default function BillingIndex({ plans = [], currentSubscription }: { plans: any[], currentSubscription: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing - Chad Jubilee" />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Billing & Subscription</h1>
                    <p className="text-slate-500 font-medium">Manage your plan and usage limits.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Current Subscription Card */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <Zap className="w-12 h-12 text-[#00D4FF15]" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-[#007BFF] uppercase tracking-widest mb-2">Current Plan</div>
                                <h2 className="text-2xl font-bold text-[#0A192F] mb-6">{currentSubscription?.plan?.name || 'Free Plan'}</h2>

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Status</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="font-bold text-[#0A192F]">{currentSubscription?.stripe_status || 'Active'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Billing Period</div>
                                        <div className="font-bold text-[#0A192F]">Monthly</div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-blue-500/20">
                                        Upgrade Plan
                                    </Button>
                                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold border-slate-200">
                                        Manage Billing
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Usage */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-[#0A192F] mb-6">Usage Summary</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-500">API Tokens</span>
                                        <span className="text-sm font-bold text-[#0A192F]">14.2k / 50k</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#007BFF] rounded-full" style={{ width: '28%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-500">Active Agents</span>
                                        <span className="text-sm font-bold text-[#0A192F]">3 / 5</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-md font-bold text-[#0A192F] mb-4">Payment Method</h3>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CreditCard className="w-6 h-6 text-slate-400" />
                                <div>
                                    <div className="font-bold text-[#0A192F] text-sm">Visa ending in 4242</div>
                                    <div className="text-xs text-slate-500 font-medium">Expires 12/26</div>
                                </div>
                            </div>
                        </div>

                        {/* Plan Features */}
                        <div className="bg-[#0A192F] p-6 rounded-3xl text-white shadow-xl shadow-slate-900/10">
                            <h3 className="text-md font-bold mb-4">Pro Benefits</h3>
                            <ul className="space-y-3">
                                {['Unlimited Agents', 'Advanced RAG Model', 'Custom Toolsets', 'Priority Support'].map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-[#00D4FF]" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
