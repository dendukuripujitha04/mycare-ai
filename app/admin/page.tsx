'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Users, 
  Stethoscope, 
  Calendar, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ArrowRight,
  UserCheck,
  Building2,
  Activity
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  todaysAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalVoiceCalls: number;
  failedVoiceCalls: number;
  initiatedVoiceCalls: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsRes.status === 403 || statsRes.status === 401) {
        setLoading(false);
        return;
      }
      setStats(statsData.stats);

      const apptRes = await fetch('/api/admin/appointments');
      const apptData = await apptRes.json();
      setRecentAppointments((apptData.appointments || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Monitor appointments, patient registrations, doctor availability, and OmniDimension voice dispatch statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/appointments"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Appointments
            </Link>
            <Link
              href="/admin/doctors"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Manage Doctors
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium mt-2">Loading system telemetry...</p>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Patients</span>
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</div>
                <div className="text-[11px] text-slate-500">Registered users</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Doctors</span>
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.totalDoctors}</div>
                <div className="text-[11px] text-slate-500">Across specializations</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Appointments</span>
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.totalAppointments}</div>
                <div className="text-[11px] text-slate-500">{stats.todaysAppointments} scheduled today</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Voice Confirmation</span>
                  <PhoneCall className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stats.initiatedVoiceCalls}</div>
                <div className="text-[11px] text-slate-500">
                  {stats.failedVoiceCalls > 0 ? (
                    <span className="text-amber-600 font-semibold">{stats.failedVoiceCalls} soft failures</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">100% Dispatch rate</span>
                  )}
                </div>
              </div>

            </div>

            {/* Quick Admin Action Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Link
                href="/admin/appointments"
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Appointment Management</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  View full appointment logs, update statuses (Confirm/Cancel/Complete), and monitor OmniDimension AI call dispatches.
                </p>
              </Link>

              <Link
                href="/admin/doctors"
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Doctor Directory Admin</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Add new doctors, edit qualifications, update clinic operating hours, or toggle active/inactive availability.
                </p>
              </Link>

              <Link
                href="/admin/users"
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Patient User Directory</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Inspect registered users, contact information, total bookings, and registration dates in accordance with privacy rules.
                </p>
              </Link>

            </div>

            {/* Recent Appointments Feed Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base">Recent System Appointments</h3>
                <Link
                  href="/admin/appointments"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  View All ({stats.totalAppointments})
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Patient</th>
                      <th className="py-3 px-2">Doctor</th>
                      <th className="py-3 px-2">Date & Time</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Voice Call</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-slate-800">{appt.appointmentNumber}</td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">{appt.user?.name}</div>
                          <div className="text-[11px] text-slate-500">{appt.user?.phone}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-semibold text-slate-800">{appt.doctor?.name}</div>
                          <div className="text-[11px] text-teal-600">{appt.doctor?.specialization}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-slate-800">{appt.appointmentDate}</div>
                          <div className="text-[11px] text-slate-500">{appt.appointmentTime}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                            {appt.voiceCalls?.[0]?.status || 'INITIATED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}
