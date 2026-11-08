import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Send, Settings2, Wand2, ArrowLeft, Power, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';

interface Tool {
    id: number;
    name: string;
    description: string;
}

interface Agent {
    id: string;
    name: string;
    role: string;
    status: string;
    avatar_color: string;
    system_prompt: string;
    tools: Tool[];
}

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
}

export default function AgentConsole({ agent }: { agent: Agent }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Agent Studio',
            href: '/agents/studio',
        },
        {
            title: agent.name,
            href: `/agents/${agent.id}`,
        },
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate agent response (replace with actual API call)
        setTimeout(() => {
            const agentMessage: Message = {
                id: crypto.randomUUID(),
                role: 'agent',
                content: `I'm ${agent.name}, your ${agent.role}. I received your message: "${userMessage.content}". How can I assist you further?`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, agentMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleStatus = async () => {
        const newStatus = agent.status === 'active' ? 'idle' : 'active';
        try {
            await fetch(`/api/agents/${agent.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            router.reload({ only: ['agent'] });
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${agent.name} Console - Chad Jubilee`} />

            <div className="flex h-full bg-[#F8FAFC]">
                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit('/agents/studio')}
                                className="rounded-lg"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-inner"
                                style={{ backgroundColor: agent.avatar_color }}
                            >
                                {agent.name.substring(0, 1)}
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[#0A192F]">{agent.name}</h1>
                                <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleStatus}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                                    agent.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                {agent.status}
                            </button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit(`/agents/${agent.id}/edit`)}
                                className="rounded-lg"
                            >
                                <Settings2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-6"
                                    style={{ backgroundColor: agent.avatar_color }}
                                >
                                    {agent.name.substring(0, 1)}
                                </div>
                                <h2 className="text-xl font-bold text-[#0A192F] mb-2">Chat with {agent.name}</h2>
                                <p className="text-slate-500 max-w-md mb-6">
                                    This agent is configured as a {agent.role}. Start a conversation to see how it can help you.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {agent.tools.slice(0, 3).map((tool) => (
                                        <span
                                            key={tool.id}
                                            className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full"
                                        >
                                            {tool.name.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                    {agent.tools.length > 3 && (
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                            +{agent.tools.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                                message.role === 'user'
                                                    ? 'bg-[#0A192F] text-white'
                                                    : 'bg-white border border-slate-100 text-[#0A192F]'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                            <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm">{agent.name} is typing...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="bg-white border-t border-slate-100 p-4">
                        <div className="flex items-center gap-3 max-w-4xl mx-auto">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Message ${agent.name}...`}
                                className="flex-1 h-12 rounded-xl border-slate-200"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="h-12 w-12 rounded-xl bg-[#0A192F] hover:bg-[#007BFF]"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Agent Details */}
                <div className="w-80 bg-white border-l border-slate-100 p-6 hidden lg:block overflow-y-auto">
                    <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-widest mb-4">Agent Details</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <span className="text-sm font-medium text-[#0A192F] capitalize">{agent.status}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Role</label>
                            <p className="text-sm text-[#0A192F]">{agent.role}</p>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1">
                                <Wand2 className="w-3 h-3" />
                                Tools ({agent.tools.length})
                            </label>
                            <div className="space-y-2">
                                {agent.tools.map((tool) => (
                                    <div key={tool.id} className="p-3 bg-slate-50 rounded-xl">
                                        <div className="text-xs font-bold text-[#0A192F]">{tool.name.replace(/_/g, ' ')}</div>
                                        <div className="text-[10px] text-slate-500 line-clamp-2">{tool.description}</div>
                                    </div>
                                ))}
                                {agent.tools.length === 0 && (
                                    <p className="text-xs text-slate-400">No tools assigned</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">System Prompt</label>
                            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed line-clamp-6">
                                {agent.system_prompt || 'No system prompt defined'}
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => router.visit(`/agents/${agent.id}/edit`)}
                            className="w-full rounded-xl"
                        >
                            <Settings2 className="w-4 h-4 mr-2" />
                            Edit Agent
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
