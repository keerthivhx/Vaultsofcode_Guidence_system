import React from 'react';
import AssessmentWizard from './components/AssessmentWizard';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">VaultOfCourse <span className="font-light text-blue-600">| Career AI</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-500" /> Powered by Gemini AI
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Discover Your Perfect Career Path</h1>
          <p className="text-lg text-slate-600">Tell us a bit about yourself, and our advanced AI will generate a personalized roadmap for your education and career.</p>
        </div>

        <AssessmentWizard />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2026 VaultOfCourse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
