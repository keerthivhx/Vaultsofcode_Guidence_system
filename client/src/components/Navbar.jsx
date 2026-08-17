import React from 'react';
import { ShieldCheck, Terminal, Award, FileCheck, HelpCircle, BarChart3, BookOpen, Briefcase } from 'lucide-react';

export default function Navbar({ activeRoute, onNavigate, onOpenWidget }) {
  const navItems = [
    { path: '/', label: 'Home', icon: Terminal },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/internships', label: 'Internships', icon: Briefcase },
    { path: '/workshops', label: 'Workshops', icon: Award },
    { path: '/verify-certificate', label: 'Verify Cert', icon: ShieldCheck },
    { path: '/offer-letter', label: 'Offer Letter', icon: FileCheck },
    { path: '/support', label: 'Support', icon: HelpCircle },
    { path: '/eval-report', label: 'AI Benchmark', icon: BarChart3, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  Vault<span className="text-indigo-400">Of</span>Code
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                  AI ASSISTANT
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">First-Level Student Support System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : item.highlight
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Chat Assistant Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWidget}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ask AI Chatbot</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
