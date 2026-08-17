import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, GraduationCap, Briefcase, BookOpen, User, CheckCircle2, Loader2, Award, Sparkles } from 'lucide-react';

const steps = [
  { id: 1, title: "Basic Info", icon: <User className="w-5 h-5" /> },
  { id: 2, title: "Education", icon: <GraduationCap className="w-5 h-5" /> },
  { id: 3, title: "Goals", icon: <Briefcase className="w-5 h-5" /> },
  { id: 4, title: "Path Finder", icon: <BookOpen className="w-5 h-5" /> },
];

export default function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentEducation: '',
    degreeCourse: '',
    college: '',
    year: '',
    skills: '',
    interests: '',
    careerGoals: '',
    preferredLocation: '',
    budget: '',
    degreePlan: '',
    counselingHelp: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setCurrentStep(5); // Loading step
    try {
      const response = await fetch('http://localhost:5000/api/guidance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setReport(data.report);
        setCurrentStep(6); // Report step
      } else {
        alert("Something went wrong. Please try again.");
        setCurrentStep(4);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="text-blue-600" /> Let's get to know you
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none" placeholder="+1 234 567 8900" required />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={nextStep} disabled={!formData.name || !formData.email} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <GraduationCap className="text-blue-600" /> Your Educational Background
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Education Level</label>
                <select name="currentEducation" value={formData.currentEducation} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none">
                  <option value="">Select option...</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course/Degree Name</label>
                  <input type="text" name="degreeCourse" value={formData.degreeCourse} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. BCA, B.Tech" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year/Semester</label>
                  <input type="text" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. 3rd Year" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College/University</label>
                <input type="text" name="college" value={formData.college} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Where do you study?" />
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={prevStep} className="text-gray-600 hover:text-gray-900 px-4 py-3 font-medium flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase className="text-blue-600" /> Career & Interests
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What are your current skills?</label>
                <textarea name="skills" value={formData.skills} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. HTML, Python, Graphic Design, Communication..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What are your main interests?</label>
                <textarea name="interests" value={formData.interests} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Artificial Intelligence, Marketing, Solving Puzzles..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What is your ultimate career goal?</label>
                <input type="text" name="careerGoals" value={formData.careerGoals} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Become a Data Scientist, Start my own agency..." />
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={prevStep} className="text-gray-600 hover:text-gray-900 px-4 py-3 font-medium flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="text-blue-600" /> Shaping Your Future
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">How are you planning to pursue your next degree or higher education?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Online Degree', 'Offline/Regular Degree', 'Hybrid', 'Distance Learning', 'Not Sure Yet'].map(option => (
                    <label key={option} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.degreePlan === option ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="degreePlan" value={option} checked={formData.degreePlan === option} onChange={handleChange} className="hidden" />
                  <span className="text-gray-700 font-medium">{option}</span>
                </label>
                  ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Would you like help choosing the right degree, university, or specialization?</label>
              <div className="space-y-3">
                {[
                  "Yes, I want counseling",
                  "Yes, I want more information",
                  "Maybe, I'm exploring options",
                  "No, I just want career guidance"
                ].map(option => (
                  <label key={option} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.counselingHelp === option ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                <input type="radio" name="counselingHelp" value={option} checked={formData.counselingHelp === option} onChange={handleChange} className="hidden" />
                <span className="text-gray-700 font-medium">{option}</span>
              </label>
                  ))}
            </div>
          </div>
            </div >
    <div className="mt-8 flex justify-between">
      <button onClick={prevStep} className="text-gray-600 hover:text-gray-900 px-4 py-3 font-medium flex items-center gap-2">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        Generate AI Report <Sparkles className="w-4 h-4" />
      </button>
    </div>
          </motion.div >
        );
      case 5:
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full w-24 h-24 flex items-center justify-center shadow-2xl">
          <Sparkles className="text-white w-10 h-10 animate-pulse" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">AI is analyzing your profile...</h2>
      <div className="text-gray-500 max-w-md mx-auto space-y-2">
        <p className="flex items-center justify-center gap-2"><CheckCircle2 className="text-green-500 w-4 h-4" /> Evaluating strengths & goals</p>
        <p className="flex items-center justify-center gap-2"><CheckCircle2 className="text-green-500 w-4 h-4" /> Matching career paths</p>
        <p className="flex items-center justify-center gap-2"><CheckCircle2 className="text-green-500 w-4 h-4" /> Finding perfect degrees</p>
        <p className="flex items-center justify-center gap-2"><Loader2 className="text-blue-500 w-4 h-4 animate-spin" /> Generating personalized roadmap</p>
      </div>
    </motion.div>
  );
      case 6:
  return <ReportView report={report} onReset={() => setCurrentStep(1)} />;
      default:
  return null;
}
  };

return (
  <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
    {currentStep < 5 && (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>

        {steps.map(step => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${currentStep >= step.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}>
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? 'text-blue-800' : 'text-gray-400'}`}>{step.title}</span>
              </div>
))}
          </div >
        </div >
      )}

<div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${currentStep < 5 ? 'p-8' : ''}`}>
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReportView({ report, onReset }) {
  if (!report) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-8 sm:p-12 text-center">
        <Award className="w-16 h-16 mx-auto mb-6 text-blue-400" />
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">Your Personalized Career Blueprint</h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">{report.careerProfile}</p>
      </div>

      <div className="p-8 sm:p-12 space-y-12">
        {/* Recommended Careers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
            <Briefcase className="text-indigo-600" /> Recommended Career Paths
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {report.recommendedCareerPaths.map((career, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">{career.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{career.why}</p>
                <div className="mb-3">
                  <strong className="text-xs uppercase tracking-wider text-gray-500">Typical Roles:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {career.roles.map(role => <span key={role} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">{role}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="text-blue-600" /> Recommended Education
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Degrees</h4>
                <ul className="space-y-2">
                  {report.recommendedDegrees.map((deg, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0"/> {deg}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Where to Study</h4>
                <ul className="space-y-2">
                  {report.recommendedUniversities.map((uni, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0"/> {uni}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="text-amber-500" /> Skills to Master
            </h2>
            <div className="flex flex-wrap gap-3">
              {report.skillsToLearn.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm font-semibold shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Action Plan */}
        <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Your Action Plan</h2>
          <div className="grid md:grid-cols-2 gap-8 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-blue-200 -translate-x-1/2"></div>
            
            <div className="relative">
              <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-100 inline-block px-4 py-1 rounded-full text-sm">Short-Term (3-6 Months)</h3>
              <ul className="space-y-4">
                {report.shortTermPlan.map((action, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                    <span className="text-gray-700 text-sm leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-lg font-bold text-indigo-800 mb-4 bg-indigo-100 inline-block px-4 py-1 rounded-full text-sm">Long-Term (1-3 Years)</h3>
              <ul className="space-y-4">
                {report.longTermPlan.map((action, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                    <span className="text-gray-700 text-sm leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final Conclusion */}
        <section className="text-center py-6">
          <p className="text-xl text-gray-800 font-medium italic max-w-3xl mx-auto leading-relaxed">
            "{report.overallRecommendation}"
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors">
              Download PDF Report
            </button>
            <button onClick={onReset} className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Start Over
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
