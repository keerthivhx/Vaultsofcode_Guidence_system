import React, { useState } from 'react';
import { MessageSquare, X, Bot, Sparkles } from 'lucide-react';
import ChatWindow from './ChatWindow';

export default function ChatWidget({ isOpen, onToggle, onNavigate, onOpenEscalation }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Expanded Popover Window */}
      {isOpen && (
        <div className="mb-4 animate-scale-up shadow-2xl">
          <ChatWindow
            onNavigate={(route) => {
              onNavigate(route);
              onToggle(false);
            }}
            onOpenEscalation={onOpenEscalation}
            isWidgetMode={true}
            onCloseWidget={() => onToggle(false)}
          />
        </div>
      )}

      {/* Floating Widget Trigger Button */}
      <button
        onClick={() => onToggle(!isOpen)}
        className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-400/30"
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          )}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-900 animate-pulse" />
          )}
        </div>

        <span className="text-xs tracking-wide">
          {isOpen ? 'Close Assistant' : 'Need Help? AI Support'}
        </span>
      </button>

    </div>
  );
}
