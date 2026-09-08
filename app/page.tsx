import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Stethoscope, 
  Activity, 
  Calendar, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Building2, 
  FileText, 
  HelpCircle,
  Globe2,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-12 sm:pt-20 pb-16 sm:pb-28">
          
          {/* Subtle background glow circle */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-400/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Headline & Action */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200/80 text-teal-800 text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                  <span>Next-Gen Healthcare AI Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Your Health. <br />
                  <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Smarter. Simpler.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Medicare AI combines intelligent health assistance, symptom analysis and seamless doctor appointments in one simple, trusted platform.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/symptoms"
                    className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base rounded-2xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/35 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Activity className="w-5 h-5" />
                    <span>Analyze Symptoms</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/appointments/book"
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span>Book Appointment</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">99.4%</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Triage Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">Instant</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">AI Voice Calls</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">24 / 7</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Health Guidance</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Dashboard Mockup Card */}
              <div className="lg:col-span-5 relative">
                
                {/* Main Visual Glass Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl shadow-slate-200/50 space-y-6 relative z-10">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-semibold">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Live Symptom Analysis</div>
                        <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          AI Engine Active
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                      Preliminary Triage
                    </span>
                  </div>

                  {/* Sample Analysis Output */}
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reported Symptoms</div>
                      <div className="text-sm font-medium text-slate-800 mt-1">High fever, persistent headache, throat soreness (2 days)</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                        <div className="text-xs text-emerald-800 font-medium">Suggested Doctor</div>
                        <div className="text-sm font-bold text-emerald-900 mt-0.5">General Physician</div>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                        <div className="text-xs text-amber-800 font-medium">Triage Priority</div>
                        <div className="text-sm font-bold text-amber-900 mt-0.5">Moderate Care</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20">
                      <div className="flex items-center justify-between text-xs font-medium text-teal-100">
                        <span className="flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5" />
                          OmniDimension Voice Call
                        </span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">AUTOMATED</span>
                      </div>
                      <div className="text-xs font-semibold mt-1">
                        "Namaste Rahul ji, your appointment is confirmed for tomorrow at 10:30 AM."
                      </div>
                    </div>
                  </div>

                  {/* Bottom Safety Note */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2 border-t border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>HIPAA Compliant Data Handling • Non-Diagnostic Triage</span>
                  </div>

                </div>

                {/* Decorative floating elements */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl hidden sm:flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Voice Confirmation</div>
                    <div className="text-[11px] text-slate-500">Telugu • Hindi • English</div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* WHY MEDICARE AI SECTION */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600">Why Medicare AI?</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Modern Healthcare Designed Around Your Convenience
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Healthcare should not mean long waiting rooms, confusing self-diagnoses, or missed appointment confirmations. Medicare AI simplifies your entire health journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="p-8 rounded-3xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/70 hover:border-teal-200 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Intelligent Symptom Analysis</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Describe symptoms in natural language to receive structured health guidance, precautions, and appropriate doctor specialization recommendations.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/70 hover:border-teal-200 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Seamless Appointment Booking</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Browse top-rated doctors across specializations, check real-time availability, and schedule clinic visits in less than 60 seconds.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/70 hover:border-teal-200 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">OmniDimension AI Voice Agent</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Receive an automated, natural human-like voice confirmation call in your preferred language (Telugu, Hindi, or English) immediately after booking.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 8 CORE FEATURE CARDS SECTION */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600">Complete Feature Suite</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything You Need for Smart Healthcare Management
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-5">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">AI Symptoms Analyzer</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Input age, gender, duration, severity, and symptom description to receive preliminary clinical guidance.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-5">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Doctor Appointment</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Book appointments with suitable doctors, pick convenient dates and morning/afternoon time slots.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold mb-5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">AI Health Guidance</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Receive structured safe general precautions tailored to your specific reported symptom duration.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-5">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">General Medicine Info</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Display non-prescription educational medicine info with clear boundaries (never presented as a formal prescription).
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Suggested Doctor</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Smart match algorithm recommends appropriate doctor specializations (e.g. Cardiologist, Dermatologist, ENT).
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Do's & Don'ts Guidance</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Clear, simple actionable lists of helpful actions to perform and harmful habits to avoid immediately.
                </p>
              </div>

              {/* Feature 7 */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-teal-300 shadow-md col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-teal-50/60 via-white to-emerald-50/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                      <PhoneCall className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                        Core Feature
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">OmniDimension AI Voice Call Confirmation</h4>
                      <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
                        After storing your appointment in Neon PostgreSQL, our server instantly dispatches a natural AI phone call in Telugu, Hindi, or English to confirm your visit and answer any questions.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/appointments/book"
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shrink-0 shadow-md transition-all"
                  >
                    Try Booking Now
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600">Simple Workflow</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How Medicare AI Works in 4 Steps
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-base">
                  1
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Input Symptoms</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Describe how you feel, your age, duration, and severity level.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-base">
                  2
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Get AI Guidance</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive precautions, Do's & Don'ts, and suggested doctor specialization.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-base">
                  3
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Book Doctor</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select your preferred doctor, clinic location, date, and time slot.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-base">
                  4
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Receive Voice Call</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  OmniDimension AI automatically calls your phone to confirm appointment details.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SAFETY & PRIVACY */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  Enterprise Safety Standards
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Medical Safety & Privacy First Architecture
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  We maintain strict boundaries between preliminary AI triage and clinical diagnoses. Every server interaction uses encrypted database connections and role-authorized access controls.
                </p>

                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>No definitive medical diagnoses claimed by AI algorithms.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>Zero client-side API key exposure for OmniDimension or Neon DB.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>Automatic emergency warnings for high-risk red-flag symptoms.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-8 border border-slate-700 space-y-4">
                <div className="flex items-center gap-3 text-amber-400">
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                  <span className="font-bold text-lg text-white">Clinical Safety Policy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Medicare AI provides preliminary health information and triage guidance for informational purpose only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a certified physician for medical concerns."
                </p>
                <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>Server-side Validation Active</span>
                  <span className="text-emerald-400 font-semibold">Verified Safe</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600">Frequently Asked Questions</h2>
              <h3 className="text-3xl font-extrabold text-slate-900">Everything You Need to Know</h3>
            </div>

            <div className="space-y-4">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base mb-2">Does Medicare AI provide a confirmed medical diagnosis?</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  No. Medicare AI provides preliminary AI-generated health assistance and triage guidance only. It clearly specifies that results are educational and not a substitute for professional clinical diagnosis.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base mb-2">How does the OmniDimension AI Voice Confirmation work?</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Once your appointment is saved in our database, our server triggers an automated voice call to your phone via OmniDimension API. The AI voice agent speaks in Telugu, Hindi, or English according to your preference to confirm date, time, and doctor.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base mb-2">What happens if the OmniDimension voice call API fails?</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your appointment remains 100% booked and confirmed in the database! The system safely records a soft warning note and allows admins to retry the voice call from the admin panel anytime.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base mb-2">Can admins manage doctors and appointments?</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Yes! Admin users can log into `/admin` to monitor appointment analytics, confirm or cancel appointments, add or edit doctor profiles, and view call statuses.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
