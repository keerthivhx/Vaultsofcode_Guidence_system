import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedQuestions({ questions = [], onSelectQuestion }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-800/60">
      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Suggested Questions:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 transition-all duration-200 active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
