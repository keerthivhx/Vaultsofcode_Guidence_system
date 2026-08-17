import React, { useState } from 'react';
import { ShieldCheck, Award, BookOpen, Briefcase, HelpCircle, FileCheck, CheckCircle2, Search, ArrowRight, ExternalLink, MessageSquare, AlertCircle } from 'lucide-react';
import kbData from '../../../server/data/knowledgeBase.json';

export function HomePage({ onNavigate, onOpenWidget }) {
  return (
    <div className="space-y-12 py-6">
      
      {/* Hero Banner */}
      <section className="relative glass-panel rounded-3xl p-8 sm:p-12 overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>VaultOfCode Official Support Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Learn Tech. Build Projects.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Empower Your Engineering Career.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to VaultOfCode! Explore industry-relevant software courses, virtual remote internships, weekend workshops, and instant certificate verification.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('/courses')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenWidget}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold border border-slate-700 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Chatbot Assistant</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Browse Courses", desc: "Full-Stack, Python AI/ML, Data Science", route: "/courses", icon: BookOpen, color: "text-indigo-400" },
          { title: "Virtual Internships", desc: "100% remote domain projects & offer letters", route: "/internships", icon: Briefcase, color: "text-purple-400" },
          { title: "Verify Certificate", desc: "Validate official credentials with Certificate ID", route: "/verify-certificate", icon: ShieldCheck, color: "text-emerald-400" },
          { title: "Offer Letter Portal", desc: "Download and verify internship offer letters", route: "/offer-letter", icon: FileCheck, color: "text-amber-400" }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigate(card.route)}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${card.color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{card.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{card.desc}</p>
              <div className="flex items-center text-xs font-semibold text-indigo-400 gap-1 group-hover:gap-2 transition-all">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}

export function CoursesPage() {
  return (
    <div className="space-y-6 py-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">VaultOfCode Courses & Programs</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Master full-stack development, artificial intelligence, and cloud engineering with real hands-on projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kbData.courses.map((course) => (
          <div key={course.id} className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-[11px] font-semibold border border-indigo-500/20">
                  {course.category}
                </span>
                <span className="text-xs font-bold text-emerald-400">{course.fee}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
              <p className="text-xs text-slate-400 mb-4">Duration: {course.duration} • Mode: {course.mode}</p>
              
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-semibold text-slate-300">Tech Stack:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {course.techStack.map((tech, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Enrolling in ${course.title}! Standard fee: ${course.fee}`)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              Enroll Now ({course.fee})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InternshipsPage() {
  return (
    <div className="space-y-6 py-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Virtual Internship Programs</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Gain guaranteed real-world software experience, offer letters in 48 hours, and verified completion certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kbData.internships.map((intern) => (
          <div key={intern.id} className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-[11px] font-semibold border border-purple-500/20">
                  {intern.domain}
                </span>
                <span className="text-xs font-semibold text-slate-400">{intern.mode}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{intern.title}</h3>
              <p className="text-xs text-slate-300 mb-4">{intern.fee}</p>

              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-semibold text-slate-300">Key Perks:</h4>
                <ul className="space-y-1">
                  {intern.perks.map((perk, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => alert(`Applying for ${intern.title}!`)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
            >
              Apply for Internship
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VerifyCertificatePage() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;

    // Mock verification lookup
    if (certId.toUpperCase().includes('VOC-2026') || certId.length >= 6) {
      setResult({
        valid: true,
        id: certId.toUpperCase(),
        studentName: "Keerthi V.",
        program: "Full-Stack Web Development Mastery",
        issueDate: "July 15, 2026",
        status: "Official & Authenticated"
      });
    } else {
      setResult({
        valid: false,
        message: "Certificate ID not found in VaultOfCode repository. Please double-check your ID format (e.g. VOC-2026-8921)."
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Certificate Verification Portal</h1>
        <p className="text-xs sm:text-sm text-slate-400">Validate the authenticity of VaultOfCode course & internship credentials.</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Enter Certificate ID:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. VOC-2026-8921"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Verify Credentials</span>
              </button>
            </div>
          </div>
        </form>

        {result && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            {result.valid ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Credential Verified & Valid</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 pt-2">
                  <p><strong>Student Name:</strong> {result.studentName}</p>
                  <p><strong>Program:</strong> {result.program}</p>
                  <p><strong>Certificate ID:</strong> {result.id}</p>
                  <p><strong>Issued On:</strong> {result.issueDate}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{result.message}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function OfferLetterPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <FileCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Offer Letter Portal</h1>
        <p className="text-xs sm:text-sm text-slate-400">Download and validate internship offer letters issued by VaultOfCode.</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <p className="text-xs text-slate-300 leading-relaxed">
          Offer letters are issued automatically to your registered email address within <strong>48 hours</strong> of enrolling in an internship program.
        </p>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
          <div className="font-semibold text-indigo-400">Haven't received your offer letter?</div>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Check your email Spam / Junk folder.</li>
            <li>Ensure 48 hours have elapsed since enrollment payment.</li>
            <li>Click human support below to submit a manual resend request.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SupportPage({ onOpenEscalation }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">VaultOfCode Help Desk & Support</h1>
        <p className="text-xs sm:text-sm text-slate-400">Find answers, resolve technical issues, or get in touch with our human support team.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white">AI Support Chatbot</h3>
          <p className="text-xs text-slate-400">Instant 24/7 automated assistant for course, certificate, and website queries.</p>
          <button
            onClick={() => alert('Use the AI Assistant button in bottom-right corner!')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Launch AI Assistant
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white">Human Escalation (WhatsApp)</h3>
          <p className="text-xs text-slate-400">Direct human assistance for payment issues, account bugs, or custom requests.</p>
          <button
            onClick={onOpenEscalation}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
