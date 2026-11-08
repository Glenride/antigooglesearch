import { Head, Link } from '@inertiajs/react';
import {
    Search,
    ArrowRight,
    Check,
    Globe,
    Shield,
    Zap,
    Cpu,
    Ghost,
    Lock,
    Play
} from 'lucide-react';

export default function Welcome() {
    return (
        <div className="font-sans text-slate-900 bg-white selection:bg-[#00D4FF] selection:text-white">
            <Head title="Chad Jubilee - Search Like an Outlaw">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
            </Head>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo Icon */}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-white rounded-full opacity-80"></div>
                            <div className="absolute inset-1.5 border-2 border-white rounded-full opacity-60"></div>
                        </div>
                        <span className="font-['Dancing_Script'] font-bold text-2xl text-white tracking-wide">Chad Jubilee</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
                            <a href="#agents" className="hover:text-white transition-colors">Agents</a>
                            <a href="#mission" className="hover:text-white transition-colors">Mission Log</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Join</a>
                        </div>
                        <Link href="/login" className="px-6 py-2.5 bg-[#0A192F] text-white text-sm font-semibold rounded-full hover:bg-black transition-all shadow-lg">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-[#007BFF]">
                    {/* Mesh Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] via-[#007BFF] to-[#0A192F]"></div>
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00D4FF] rounded-full blur-[120px] opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0A192F] rounded-full blur-[120px] opacity-60"></div>

                    {/* Glass Overlay/Wave Texture */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent opacity-20"></div>

                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 mx-auto">
                            <span className="w-2 h-2 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"></span>
                            <span className="text-xs font-semibold tracking-wide uppercase text-white/90">Protocol: GHOST_MERCENARY v1.0</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                            Search like an <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0F7FF] to-[#00D4FF]">Outlaw.</span> Remain a Ghost.
                        </h1>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mt-12 mb-20 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#00D4FF] to-white rounded-full blur opacity-30 group-hover:opacity-50 transition duration-700"></div>
                            <div className="relative h-16 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full flex items-center px-2 shadow-2xl transition-all hover:bg-white/15">
                                <div className="pl-6 text-white/70">
                                    <div className="w-5 h-5 relative">
                                        <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
                                        <div className="relative z-10 w-full h-full bg-white rounded-full scale-50"></div>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter mission query..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/60 text-lg px-4 font-light"
                                />
                                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#007BFF] hover:scale-105 transition-transform shadow-lg">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Stats/Links */}
                        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/80">
                            <div className="flex items-center gap-2">
                                <Ghost className="w-4 h-4" />
                                <span>Zero Logs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                <span>Speed-to-Truth: &lt;3s</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4" />
                                <span>Multi-Agent Consensus</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section (White Background) */}
                <section id="agents" className="py-32 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
                                The Mercenary Orchestration
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0A192F] mb-6">We don't index the web. <br /> We breach it.</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                                Our autonomous agents surf the web in real-time, stripping ads and verifying facts so you don't have to.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature Card 1 */}
                            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,123,255,0.12)] transition-all duration-300 group">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E0F7FF] to-white mb-6 flex items-center justify-center shadow-inner border border-[#E0F7FF] group-hover:scale-110 transition-transform">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#007BFF] to-[#00D4FF] shadow-lg"></div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#0A192F] mb-3">Agent Scout</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Infiltrates Google & Bing APIs to extract raw SERP data, bypassing the SEO-spam layer.
                                </p>
                            </div>

                            {/* Feature Card 2 */}
                            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,123,255,0.12)] transition-all duration-300 group">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E0F7FF] to-white mb-6 flex items-center justify-center shadow-inner border border-[#E0F7FF] group-hover:scale-110 transition-transform">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#007BFF] to-[#00D4FF] shadow-lg"></div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#0A192F] mb-3">Agent Humanist</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Mines Reddit threads and niche forums to find real human experiences and "The Truth."
                                </p>
                            </div>

                            {/* Feature Card 3 */}
                            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,123,255,0.12)] transition-all duration-300 group">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E0F7FF] to-white mb-6 flex items-center justify-center shadow-inner border border-[#E0F7FF] group-hover:scale-110 transition-transform">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#007BFF] to-[#00D4FF] shadow-lg"></div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#0A192F] mb-3">Consensus Engine</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    A master agent that cross-references all data to verify accuracy and resolve contradictions.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A192F] text-white rounded-full font-semibold hover:bg-black transition-colors">
                                View Technical Brief
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* About/Mission Log Section */}
                <section id="mission" className="py-24 bg-[#F8FAFC]">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="inline-block px-3 py-1 rounded-full bg-white text-slate-600 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
                            Live Mission Log
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#0A192F] mb-12 max-w-3xl mx-auto">
                            See the rebellion in real-time.
                        </h2>

                        <div className="relative max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-black font-mono text-left p-8 border border-slate-800">
                            {/* Mission Log Simulation */}
                            <div className="absolute inset-0 bg-[#0A192F]/90 z-0"></div>

                            <div className="relative z-10 flex flex-col gap-4 text-sm md:text-base">
                                <div className="flex gap-4">
                                    <span className="text-green-500/50">[10:00:01]</span>
                                    <span className="text-[#00D4FF]"> &gt; System Initialized. Target: "Google Monopoly"</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-green-500/50">[10:00:02]</span>
                                    <span className="text-white"> &gt; Agent Scout: Breached firewall. Extracting SERP data...</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-green-500/50">[10:00:04]</span>
                                    <span className="text-[#007BFF]"> &gt; Agent Humanist: Mining Reddit for "user truth"...</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-green-500/50">[10:00:05]</span>
                                    <span className="text-red-400"> &gt; Ad-Siphon: Detected 14 trackers. NUKING all scripts.</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-green-500/50">[10:00:07]</span>
                                    <span className="text-yellow-400"> &gt; Consensus Engine: Analyzing contradictions...</span>
                                </div>
                                <div className="flex gap-4 animate-pulse">
                                    <span className="text-green-500/50">[10:00:08]</span>
                                    <span className="text-green-400"> &gt; MISSION COMPLETE. Generating Brief...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Highlight Section (Privacy/Nuke) */}
                <section className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
                                The Nuke Protocol
                            </div>
                            <h2 className="text-4xl font-bold text-[#0A192F] mb-4">Stateless. Ephemeral. <br /> Untouchable.</h2>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Box - Nuke Protocol */}
                            <div className="relative h-[600px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#00D4FF] via-[#007BFF] to-[#0A192F] p-10 text-white shadow-2xl">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4">Total Session Wipe</h3>
                                    <p className="opacity-80 mb-8">Once your 10-minute session expires, the "Jubilee" occurs—all traces are wiped from our servers forever.</p>

                                    {/* Glass Card Inside */}
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center h-64">
                                        <div className="text-4xl font-mono text-red-400 mb-4 animate-pulse">00:00:00</div>
                                        <div className="text-sm uppercase tracking-widest opacity-70">Session Terminated</div>
                                    </div>

                                    {/* 3D Sphere Decoration */}
                                    <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 rounded-full bg-gradient-to-t from-[#00D4FF] to-transparent opacity-60 blur-2xl"></div>
                                </div>
                            </div>

                            {/* Right Column Stack */}
                            <div className="space-y-8">
                                <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200">
                                    {/* Icon Row */}
                                    <div className="flex gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#007BFF]">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#007BFF]">
                                            <Ghost className="w-6 h-6" />
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#007BFF]">
                                            <Lock className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0A192F] mb-2">Ad-Siphon Technology</h3>
                                    <p className="text-slate-500">We strip 100% of JavaScript, Tracking Pixels, and Display Ads before the data even reaches your screen.</p>
                                </div>

                                <div className="bg-[#007BFF] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <h3 className="text-xl font-bold mb-2">Clean "Chad View"</h3>
                                    <p className="opacity-80 mb-6">Read any external link in a minimalist, text-only Markdown format rendered on our secure servers.</p>
                                    <button className="px-6 py-2 bg-[#0A192F] rounded-full text-sm font-bold hover:bg-black transition-colors">
                                        Try Chad View &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-32 bg-[#F8FAFC]">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="inline-block px-3 py-1 rounded-full bg-white text-slate-600 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
                                Join the Rebellion
                            </div>
                            <h2 className="text-4xl font-bold text-[#0A192F] mb-4">Pricing for Outlaws</h2>
                            <p className="text-slate-500">Simple, transparent, anonymous. No hidden fees.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Free Plan */}
                            <div className="bg-white rounded-[32px] p-10 border border-slate-200">
                                <h3 className="text-lg font-medium text-slate-500 mb-2">Privacy Scout</h3>
                                <div className="text-4xl font-bold text-[#0A192F] mb-6">Free</div>
                                <p className="text-slate-500 text-sm mb-8 border-b border-slate-100 pb-8">
                                    For casual users who want to escape the tracking grid.
                                </p>

                                <button className="w-full py-4 bg-black text-white rounded-2xl font-bold mb-8 hover:bg-slate-800 transition-colors">
                                    Start Search
                                </button>

                                <ul className="space-y-4">
                                    {[
                                        "100 Private Searches/mo",
                                        "Basic Ad-Siphon",
                                        "Google/Bing Proxy",
                                        "Standard Speed"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pro Plan */}
                            <div className="bg-white rounded-[32px] p-2 border border-blue-100 shadow-2xl relative">
                                <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-[28px] p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#00D4FF] rounded-full blur-[60px] opacity-40"></div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-medium opacity-90">Ghost Mercenary</h3>
                                            <div className="inline-block px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold mt-1">RECOMMENDED</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-bold">$10</div>
                                            <div className="text-sm opacity-70">/month</div>
                                        </div>
                                    </div>

                                    <p className="opacity-80 text-sm mb-8">
                                        Unlimited power. Zero trail. Complete digital ghost status.
                                    </p>

                                    <button className="w-full py-3 bg-white text-[#007BFF] rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg">
                                        Go Dark
                                    </button>
                                </div>

                                <div className="p-8">
                                    <ul className="space-y-4">
                                        {[
                                            "Unlimited Private Searches",
                                            "Advanced Consensus Engine",
                                            "Humanist Agent Included",
                                            "Zero Data Retention (Nuke Protocol)",
                                            "Chad View (Clean Mode)",
                                            "Priority Support"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#007BFF]">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer and Final CTA */}
                <div className="bg-[#0A192F] relative overflow-hidden">
                    {/* CTA Section */}
                    <div className="relative py-32 px-6">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#007BFF] to-[#0A192F] opacity-20"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D4FF] rounded-full blur-[150px] opacity-20"></div>

                        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to go dark? <br /> Join the rebellion.</h2>
                                <p className="text-white/60 text-lg">
                                    Stop feeding the algorithm. Start searching like an outlaw.
                                </p>
                            </div>
                            <button className="px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform border border-white/10">
                                Launch Protocol
                            </button>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <footer className="border-t border-white/10 py-16 px-6 bg-black/20 backdrop-blur-sm relative z-10">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="relative w-8 h-8 flex items-center justify-center">
                                        <div className="absolute inset-0 border-2 border-white rounded-full opacity-80"></div>
                                        <div className="absolute inset-1.5 border-2 border-white rounded-full opacity-60"></div>
                                    </div>
                                    <span className="font-['Dancing_Script'] font-bold text-2xl text-white tracking-wide">Chad Jubilee</span>
                                </div>
                                <p className="text-white/40 text-sm">© 2025 Chad Jubilee Protocol. All rights reserved.</p>
                            </div>

                            <div className="flex gap-16 text-sm text-white/60">
                                <div className="flex flex-col gap-4">
                                    <span className="text-white font-bold mb-2">Protocol</span>
                                    <a href="#" className="hover:text-white">Agents</a>
                                    <a href="#" className="hover:text-white">Nuke Status</a>
                                    <a href="#" className="hover:text-white">API</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-white font-bold mb-2">Company</span>
                                    <a href="#" className="hover:text-white">Manifesto</a>
                                    <a href="#" className="hover:text-white">Blog</a>
                                    <a href="#" className="hover:text-white">Careers</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-white font-bold mb-2">Legal</span>
                                    <a href="#" className="hover:text-white">Privacy</a>
                                    <a href="#" className="hover:text-white">Terms</a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
