'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  Clock, 
  Building2, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Phone,
  User
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  availableDays: string;
  availableFrom: string;
  availableTo: string;
}

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM',
];

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const preselectedDoctorId = searchParams.get('doctorId') || '';
  const preselectedSpecialization = searchParams.get('specialization') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  useEffect(() => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setAppointmentDate(tomorrow);
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      const docsList: Doctor[] = data.doctors || [];
      setDoctors(docsList);

      if (!selectedDoctorId && preselectedSpecialization) {
        const matched = docsList.find((d) => d.specialization === preselectedSpecialization);
        if (matched) setSelectedDoctorId(matched.id);
      } else if (!selectedDoctorId && docsList.length > 0) {
        setSelectedDoctorId(docsList[0].id);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!selectedDoctorId) { setError('Please select a doctor.'); return; }
    if (!phone.trim()) { setError('Please enter your phone number.'); return; }
    if (!appointmentDate) { setError('Please select an appointment date.'); return; }
    if (!reason.trim()) { setError('Please enter the reason for your visit.'); return; }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          doctorId: selectedDoctorId,
          phone,
          appointmentDate,
          appointmentTime,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setBookingSuccess({ appointment: data.appointment, voiceStatus: data.voiceCallStatus });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error processing appointment booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xl space-y-8 text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Appointment Booked Successfully!</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Appointment ID: <strong className="text-slate-900">{bookingSuccess.appointment.appointmentNumber}</strong>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase">Patient</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{name}</div>
              <div className="text-teal-600 font-medium">{phone}</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase">Doctor</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{bookingSuccess.appointment.doctor.name}</div>
              <div className="text-teal-600 font-medium">{bookingSuccess.appointment.doctor.specialization}</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase">Date & Time</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{bookingSuccess.appointment.appointmentDate}</div>
              <div className="text-teal-700 font-semibold">{bookingSuccess.appointment.appointmentTime}</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase">Clinic</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{bookingSuccess.appointment.doctor.clinicName}</div>
              <div className="text-slate-500">{bookingSuccess.appointment.doctor.clinicAddress}</div>
            </div>
          </div>

          {/* OmniDimension Voice Call Status */}
          <div className={`p-5 rounded-2xl text-white text-left shadow-lg ${
            bookingSuccess.voiceStatus?.success 
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600' 
              : 'bg-gradient-to-r from-amber-600 to-orange-600'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              OmniDimension AI Voice Call Status
              <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {bookingSuccess.voiceStatus?.status || 'INITIATED'}
              </span>
            </div>
            <p className="text-xs font-medium opacity-90">
              {bookingSuccess.voiceStatus?.message || 'Medicare AI is calling you to confirm your appointment.'}
            </p>
            {bookingSuccess.voiceStatus?.debugError && (
              <div className="mt-2 p-2 bg-black/20 rounded text-[11px] font-mono break-all opacity-90">
                <span className="font-bold">Error detail:</span> {bookingSuccess.voiceStatus.debugError}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Back to Home <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setBookingSuccess(null); setReason(''); setPhone(''); setName(''); }}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
            >
              Book Another
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full space-y-8">

      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          Doctor Consultation Scheduler
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Book an Appointment</h1>
        <p className="text-slate-600 text-sm">
          Fill in your details below. After booking, you will receive an AI voice call confirming your appointment.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Your Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                suppressHydrationWarning
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              The AI voice agent will address you by this name during the confirmation call.
            </p>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Doctor <span className="text-rose-500">*</span>
            </label>
            {loadingDoctors ? (
              <div className="h-11 bg-slate-100 animate-pulse rounded-xl" />
            ) : (
              <select
                required
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                suppressHydrationWarning
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialization} ({doc.clinicName})
                  </option>
                ))}
              </select>
            )}

            {selectedDoctor && (
              <div className="mt-2 p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900">{selectedDoctor.name} ({selectedDoctor.specialization})</div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{selectedDoctor.clinicName} — {selectedDoctor.clinicAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Available: {selectedDoctor.availableDays} ({selectedDoctor.availableFrom} – {selectedDoctor.availableTo})</span>
                </div>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                suppressHydrationWarning
              />
            </div>
            <p className="text-[11px] text-teal-700 mt-1 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              OmniDimension AI will call this number to confirm your appointment.
            </p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Appointment Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Time Slot <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                suppressHydrationWarning
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Visit <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Fever checkup, skin rash consultation, joint pain, routine health screening..."
              className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            suppressHydrationWarning
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Booking & Dispatching AI Voice Call...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Book Appointment</span>
              </>
            )}
          </button>

        </form>
      </div>
    </main>
  );
}

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
        </div>
      }>
        <BookAppointmentContent />
      </Suspense>
      <Footer />
    </div>
  );
}
