import Link from 'next/link';
import { Stethoscope, Heart, ShieldAlert, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Medical Disclaimer Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-4">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Medical Safety Disclaimer</h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Medicare AI provides AI-assisted preliminary healthcare information and triage guidance for educational purpose only. It does NOT replace professional medical consultation, diagnosis, or treatment. In case of medical emergency, immediately call 108 / 911 or proceed to the nearest hospital emergency room.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shadow-teal-500/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                MEDICARE <span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering healthcare access through intelligent symptom triage, doctor appointments, and automated AI voice confirmation calls.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>for better patient outcomes</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/symptoms" className="hover:text-teal-400 transition-colors">Symptoms Analyzer</Link>
              </li>
              <li>
                <Link href="/appointments/book" className="hover:text-teal-400 transition-colors">Book Appointment</Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-teal-400 transition-colors">Find Doctors</Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-teal-400 transition-colors">My Appointments</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & AI Features */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>AI Symptom Triage</li>
              <li>OmniDimension AI Voice Agent</li>
              <li>Instant Confirmation Calls</li>
              <li>Doctor Availability Search</li>
              <li>Multilingual Voice (TE / HI / EN)</li>
              <li>Secure Patient History</li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Emergency & Support</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>National Emergency: 108 / 112</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@medicare.ai</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Jubilee Hills, Hyderabad, IN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Medicare AI Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Security & HIPAA Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
