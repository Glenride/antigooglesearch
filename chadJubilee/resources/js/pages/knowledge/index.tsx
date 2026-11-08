import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { FileText, Upload, Trash2, Clock, Search, Filter, ShieldCheck, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import knowledgeRoutes from '@/routes/knowledge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Knowledge Base',
        href: '/knowledge',
    },
];

interface KnowledgeDocument {
    id: number;
    name: string;
    file_type: string;
    file_size: number;
    status: 'pending' | 'processing' | 'indexed' | 'failed';
    created_at: string;
}

export default function KnowledgeBase({ documents = [] }: { documents: KnowledgeDocument[] }) {
    const { data, setData, post, processing, progress, reset } = useForm({
        file: null as File | null,
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) return;

        post(knowledgeRoutes.store().url, {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this document? This will remove its indexed embeddings from agents.')) {
            router.delete(knowledgeRoutes.destroy(id).url);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Knowledge Base - Chad Jubilee" />

            <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">
                <div className="mb-8 max-w-6xl mx-auto w-full flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">Knowledge Base</h1>
                        <p className="text-slate-500 font-medium">Manage reference documents used for RAG and agent context.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-2">
                            <Database className="w-3 h-3" />
                            Storage Usage: 12%
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Upload Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-widest">Add Document</h3>
                                <form onSubmit={handleUpload} className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={e => setData('file', e.target.files?.[0] || null)}
                                            accept=".pdf,.doc,.docx,.txt,.md"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl hover:border-[#007BFF]/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                                        >
                                            {data.file ? (
                                                <div className="text-center p-4">
                                                    <FileText className="w-8 h-8 text-[#007BFF] mx-auto mb-2" />
                                                    <div className="text-xs font-bold text-[#0A192F] truncate max-w-[150px]">{data.file.name}</div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-[#007BFF] group-hover:scale-110 transition-all" />
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drop files here</div>
                                                </div>
                                            )}
                                        </label>
                                    </div>

                                    {progress && (
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-[#007BFF] h-full transition-all" style={{ width: `${progress.percentage}%` }}></div>
                                        </div>
                                    )}

                                    <Button
                                        disabled={!data.file || processing}
                                        className="w-full h-12 bg-[#0A192F] hover:bg-[#007BFF] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Document
                                    </Button>
                                </form>
                            </div>

                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supported Formats</div>
                                <div className="flex flex-wrap gap-2">
                                    {['PDF', 'DOCX', 'TXT', 'MD'].map(ext => (
                                        <span key={ext} className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded border border-slate-100">{ext}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0A192F] p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                            <div className="relative">
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Security Note</div>
                                <p className="text-xs text-slate-400 leading-relaxed">Documents are encrypted and stored in private SOC2 compliant buckets.</p>
                            </div>
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input className="pl-10 h-12 rounded-xl border-slate-200 bg-white" placeholder="Search knowledge base..." />
                            </div>
                            <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200 bg-white hover:bg-slate-50">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {documents.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <FileText className="w-12 h-12 text-slate-200 mb-4" />
                                                    <div className="text-sm font-bold text-slate-400">Your knowledge base is empty</div>
                                                    <div className="text-xs text-slate-300 mt-1">Upload documents to start indexing context.</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        documents.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                                            <FileText className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-[#0A192F]">{doc.name}</div>
                                                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(doc.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${doc.status === 'indexed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            doc.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' :
                                                                doc.status === 'failed' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'indexed' ? 'bg-emerald-500' :
                                                                doc.status === 'processing' ? 'bg-blue-500' :
                                                                    doc.status === 'failed' ? 'bg-red-500' :
                                                                        'bg-slate-500'
                                                            }`} />
                                                        {doc.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium text-slate-500">{formatSize(doc.file_size)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
