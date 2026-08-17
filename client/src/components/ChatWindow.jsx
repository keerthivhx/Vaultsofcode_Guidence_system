import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, ExternalLink, Headset, Sparkles, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';
import { sendChatMessage } from '../services/api';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome-msg',
  role: 'assistant',
  text: "Hello! 👋 Welcome to **VaultOfCode Support**! I am your AI assistant. I can help you with:\n\n• **Courses** & Training Programs\n• Virtual **Internships** & Offer Letters\n• **Certificate Verification**\n• Payments & Enrollment\n• Technical & Website Guidance\n\nHow can I assist you today?",
  intent: 'general_query',
  recommendedRoute: null,
  suggestedQuestions: [
    "What courses do you offer?",
    "How can I verify my certificate?",
    "How to apply for a virtual internship?",
    "Where is the Offer Letter portal?"
  ],
  escalationRequired: false,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function ChatWindow({ onNavigate, onOpenEscalation, isWidgetMode = false, onCloseWidget }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('voc_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('voc_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend = null) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    setError(null);
    setInput('');

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Build history payload (past 6 turns)
      const historyPayload = newMessages
        .filter(m => m.id !== 'welcome-msg')
        .slice(-6)
        .map(m => ({ role: m.role, text: m.text }));

      const botResponse = await sendChatMessage(queryText, historyPayload);

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: botResponse.answer,
        intent: botResponse.intent,
        recommendedRoute: botResponse.recommendedRoute,
        suggestedQuestions: botResponse.suggestedQuestions,
        escalationRequired: botResponse.escalationRequired,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Unable to connect to AI server. Please try again.');
      
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        text: "I'm having trouble connecting to the support server right now. Please check your connection or contact our support team directly.",
        intent: 'unknown',
        escalationRequired: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear conversation history?')) {
      setMessages([DEFAULT_WELCOME_MESSAGE]);
      localStorage.removeItem('voc_chat_history');
      setError(null);
    }
  };

  return (
    <div className={`flex flex-col glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ${
      isWidgetMode ? 'h-[550px] w-[380px] sm:w-[420px]' : 'h-[750px] max-w-4xl mx-auto w-full'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">VaultOfCode AI Assistant</h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">First-Level Student Support</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            title="Clear conversation"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {isWidgetMode && (
            <button
              onClick={onCloseWidget}
              title="Close chat window"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`flex flex-col max-w-[85%] ${isBot ? 'items-start' : 'items-end'}`}>
                {/* Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                      : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20 shadow-md font-medium'
                  }`}
                >
                  <div className="prose-chat whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* Smart Website Route Button */}
                  {isBot && msg.recommendedRoute && (
                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => onNavigate(msg.recommendedRoute)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all"
                      >
                        <span>Navigate to {msg.recommendedRoute}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Human Escalation Button */}
                  {isBot && msg.escalationRequired && (
                    <div className="mt-3 pt-2 border-t border-slate-800">
                      <button
                        onClick={onOpenEscalation}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                      >
                        <Headset className="w-4 h-4" />
                        <span>Contact Human Support (WhatsApp)</span>
                      </button>
                    </div>
                  )}

                  {/* Suggested Questions */}
                  {isBot && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <SuggestedQuestions
                      questions={msg.suggestedQuestions}
                      onSelectQuestion={(q) => handleSend(q)}
                    />
                  )}
                </div>

                {/* Footer Timestamp & Intent Tag */}
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {isBot && msg.intent && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      #{msg.intent}
                    </span>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Analyzing knowledge base & generating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        {error && (
          <div className="mb-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about courses, certificates, internships..."
            maxLength={1000}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
          <span>Protected by Anti-Hallucination Safety Layer</span>
          <span>{input.length}/1000</span>
        </div>
      </div>

    </div>
  );
}
