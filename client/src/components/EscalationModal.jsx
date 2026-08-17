import React from 'react';
import { MessageSquare, ExternalLink, X, PhoneCall, Mail, Clock } from 'lucide-react';

export default function EscalationModal({ isOpen, onClose, whatsAppNumber = "+919876543210" }) {
  if (!isOpen) return null;

  const waUrl = `https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=Hi%20VaultOfCode%20Support,%20I%20need%20assistance%20with%20my%20query.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-indigo-500/30 p-6 shadow-2xl shadow-indigo-950/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Connect with Human Support</h3>
            <p className="text-xs text-slate-400">Official VaultOfCode Help Desk</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          Need personalized help with your payment, custom certificate issue, or account details? Talk directly to our support representative on WhatsApp or Email.
        </p>

        {/* Support Options */}
        <div className="space-y-3 mb-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp ({whatsAppNumber})</span>
            </div>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>support@vaultofcode.com</span>
            </div>
            <span className="text-[10px] text-slate-500">Email</span>
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Mon - Fri (9:00 AM - 7:00 PM IST)</span>
            </div>
            <span className="text-[10px] text-emerald-400">Active</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Return to Chat
          </button>
        </div>

      </div>
    </div>
  );
}
