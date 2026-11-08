import { cn } from '@/lib/utils';
import { Send, Bot, User } from 'lucide-react';
import { useState } from 'react';

interface Message {
    id: string;
    sender: {
        name: string;
        avatar?: string;
        color: string;
        isAgent?: boolean;
    };
    content: string;
    timestamp: string;
}

interface ConversationPanelProps {
    messages: Message[];
    onSendMessage?: (message: string) => void;
    className?: string;
}

export function ConversationPanel({ messages, onSendMessage, className }: ConversationPanelProps) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && onSendMessage) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className={cn("flex flex-col h-full bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)]", className)}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100/50">
                            <Bot className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="font-bold text-sm tracking-wide">Awaiting mission orders...</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="flex gap-5 group">
                            {/* Avatar */}
                            <div
                                className={cn(
                                    "w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg transition-all group-hover:scale-110",
                                    message.sender.isAgent ? "bg-gradient-to-br from-[#007BFF] to-[#00D4FF]" : "bg-[#0A192F]"
                                )}
                            >
                                {message.sender.isAgent ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className={cn(
                                        "font-extrabold text-sm tracking-tight",
                                        message.sender.isAgent ? "text-[#007BFF]" : "text-[#0A192F]"
                                    )}>
                                        {message.sender.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                                        {message.timestamp}
                                    </span>
                                </div>

                                <div className={cn(
                                    "text-sm leading-relaxed p-5 rounded-3xl rounded-tl-sm border shadow-sm transition-all",
                                    message.sender.isAgent
                                        ? "bg-[#E0F7FF]/30 border-[#E0F7FF] text-slate-800 font-medium"
                                        : "bg-white border-slate-100 text-slate-600"
                                )}>
                                    {message.content.split('\n').map((line, i) => (
                                        <p key={i} className={i > 0 ? 'mt-3' : ''}>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-5 border-t border-slate-100 bg-slate-50/30 rounded-b-3xl">
                <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 px-5 py-4 focus-within:ring-4 focus-within:ring-[#007BFF]/10 focus-within:border-[#007BFF] transition-all shadow-sm group">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type mission protocol or query..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-[#0A192F] font-medium placeholder-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 bg-[#0A192F] hover:bg-black disabled:bg-slate-100 disabled:text-slate-300 rounded-xl flex items-center justify-center text-white transition-all shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}

