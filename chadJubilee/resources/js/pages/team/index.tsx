import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, UserPlus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
];

export default function TeamIndex({ members = [] }: { members: any[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team - Chad Jubilee" />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Team Management</h1>
                        <p className="text-slate-500 font-medium">Manage your organization's members and permissions.</p>
                    </div>
                    <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Member
                    </Button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#0A192F]">Members</h2>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{members.length} Members</span>
                    </div>

                    {members.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <Users className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">No other members in this organization yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {members.map((member: any) => (
                                <div key={member.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden">
                                            {member.avatar ? <img src={member.avatar} alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Users className="w-5 h-5" /></div>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#0A192F]">{member.name}</div>
                                            <div className="text-sm text-slate-500">{member.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                            {member.pivot?.role || 'Member'}
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
