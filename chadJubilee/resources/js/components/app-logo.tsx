import { Zap } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#00D4FF] to-[#007BFF] rounded-lg shadow-md shadow-blue-500/10">
                <div className="absolute inset-1.5 border-2 border-white/80 rounded-full"></div>
                <div className="absolute inset-[10px] border-2 border-white/60 rounded-full"></div>
            </div>
            <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-['Dancing_Script'] font-extrabold text-xl text-[#0A192F] tracking-tight">Chad Jubilee</span>
            </div>
        </div>
    );
}
