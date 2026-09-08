'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Calendar, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  RefreshCw, 
  ShieldCheck,
  Filter
} from 'lucide-react';

interface AdminAppointment {
  id: string;
  appointmentNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'UPCOMING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialization: string;
    clinicName: string;
  };
  voiceCalls?: {
    status: string;
    failureReason?: string;
  }[];
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Fetch appointments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      fetchAppointments();
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRetryVoiceCall = async (appointmentId: string) => {
    setUpdatingId(appointmentId);
    try {
      await fetch('/api/voice/appointment-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, language: 'en' }),
      });
      fetchAppointments();
    } catch (err) {
      console.error('Retry voice call error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.appointmentNumber.toLowerCase().includes(search.toLowerCase()) ||
      appt.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      appt.user?.phone.includes(search) ||
      appt.doctor?.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointment Records</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search, filter, update statuses, and monitor OmniDimension AI call dispatches.
            </p>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            ← Back to Admin KPI
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, patient name, phone, or doctor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-semibold outline-hidden bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

        </div>

        {/* Appointments Table */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium mt-2">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <th className="py-3.5 px-4">Appt ID</th>
                    <th className="py-3.5 px-4">Patient Info</th>
                    <th className="py-3.5 px-4">Doctor</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">AI Voice Call</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((appt) => {
                    const voiceStatus = appt.voiceCalls?.[0]?.status || 'PENDING';

                    return (
                      <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">{appt.appointmentNumber}</td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{appt.user?.name}</div>
                          <div className="text-[11px] text-slate-500">{appt.user?.phone}</div>
                          <div className="text-[10px] text-slate-400">{appt.user?.email}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-800">{appt.doctor?.name}</div>
                          <div className="text-[11px] text-teal-600 font-medium">{appt.doctor?.specialization}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-900">{appt.appointmentDate}</div>
                          <div className="text-[11px] text-teal-700 font-medium">{appt.appointmentTime}</div>
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={appt.status}
                            disabled={updatingId === appt.id}
                            onChange={(e) => handleUpdateStatus(appt.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white shadow-2xs outline-hidden"
                          >
                            <option value="UPCOMING">UPCOMING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                              {voiceStatus}
                            </span>
                            <button
                              onClick={() => handleRetryVoiceCall(appt.id)}
                              disabled={updatingId === appt.id}
                              className="block text-[10px] text-teal-600 hover:underline font-semibold"
                            >
                              Dispatch Call
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-[10px]"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'CANCELLED')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-[10px]"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-slate-800 font-bold text-base mt-2">No Matching Appointments</h3>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
