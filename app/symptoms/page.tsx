'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Stethoscope, 
  Pill, 
  Calendar, 
  Loader2, 
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  symptoms: string;
  age: number;
  gender: string;
  duration: string;
  severity: string;
  possibleConditions: string[];
  suggestedDoctor: string;
  precautions: string[];
  medicineInformation: string[];
  dos: string[];
  donts: string[];
  emergencyWarning: string | null;
  disclaimer: string;
}

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<number | ''>(28);
  const [gender, setGender] = useState('Male');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Critical'>('Moderate');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms in detail.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/symptoms/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          age: Number(age),
          gender,
          duration,
          severity,
          additionalInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze symptoms');
      }

      setResult(data.analysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Clinical Triage Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Symptoms Analyzer
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Describe your current symptoms to receive preliminary health guidance, safe precautions, Do's & Don'ts, and suggested doctor specializations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-6">
            
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Symptom Details Form</h2>
                <p className="text-xs text-slate-500">Provide accurate details for triage</p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Describe Symptoms <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms, for example: fever, headache, cough, body pain..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden bg-white"
                  >
                    <option value="Less than 24 hours">Less than 24 hrs</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="4-7 days">4-7 days</option>
                    <option value="More than 1 week">&gt; 1 week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden bg-white"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g. preexisting conditions, allergies..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 pt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Symptoms...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Symptoms</span>
                  </>
                )}
              </button>

            </form>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>AI results are preliminary educational triage guidance and do not replace certified medical diagnosis.</span>
            </div>

          </div>

          {/* Right Column: Results Output Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {loading ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 py-16">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
                <h3 className="text-slate-900 font-bold text-lg">Analyzing Health Symptoms</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Running clinical triage engine, evaluating precautions, doctor recommendations, and safety alerts...
                </p>
              </div>
            ) : result ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
                
                {/* Emergency Warning if present */}
                {result.emergencyWarning && (
                  <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-2 shadow-lg shadow-rose-600/20">
                    <div className="flex items-center gap-2 font-extrabold text-sm tracking-wide uppercase">
                      <AlertTriangle className="w-5 h-5 animate-bounce" />
                      <span>Immediate Emergency Care Recommended</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed">
                      {result.emergencyWarning}
                    </p>
                  </div>
                )}

                {/* Header & Suggested Doctor Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Recommended Specialist</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{result.suggestedDoctor}</h3>
                    <p className="text-xs text-slate-500 mt-1">Based on reported symptom characteristics</p>
                  </div>

                  <Link
                    href={`/appointments/book?specialization=${encodeURIComponent(result.suggestedDoctor)}`}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book {result.suggestedDoctor}</span>
                  </Link>
                </div>

                {/* Possible Conditions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" />
                    Possible Health Conditions (Preliminary)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.possibleConditions.map((cond, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Precautions & Medicine Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Precautions */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-600" />
                      General Precautions
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {result.precautions.map((prec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{prec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* General Medicine Info */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Pill className="w-4 h-4 text-indigo-600" />
                      General Medication Information
                    </h4>
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 text-xs text-slate-700">
                      {result.medicineInformation.map((med, i) => (
                        <p key={i}>{med}</p>
                      ))}
                      <div className="text-[10px] text-indigo-700 font-semibold pt-1 border-t border-indigo-100">
                        * Strictly educational. Not a prescription.
                      </div>
                    </div>
                  </div>

                </div>

                {/* Do's and Don'ts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                  
                  {/* Do's */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Actionable Do's
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.dos.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Don'ts */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Things to Avoid (Don'ts)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.donts.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 bg-rose-50/50 p-2 rounded-lg">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Action CTA & Disclaimer Footer */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-[11px] leading-relaxed italic">
                    {result.disclaimer}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">Need professional medical consultation?</span>
                    <Link
                      href={`/appointments/book?specialization=${encodeURIComponent(result.suggestedDoctor)}`}
                      className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Book Appointment</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 py-20">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-slate-800 font-bold text-base">Ready for Symptom Triage</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Fill out the symptoms form on the left to generate preliminary health advice, precautions, and doctor recommendations.
                </p>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
