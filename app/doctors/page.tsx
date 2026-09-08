'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Stethoscope, 
  MapPin, 
  Clock, 
  Award, 
  Calendar, 
  Building2, 
  Loader2,
  Phone
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  qualification: string;
  phone: string;
  email: string;
  clinicName: string;
  clinicAddress: string;
  availableDays: string;
  availableFrom: string;
  availableTo: string;
  imageUrl?: string;
  status: string;
}

const SPECIALIZATIONS = [
  'All',
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'ENT Specialist',
  'Orthopedic',
  'Pediatrician',
  'Gynecologist',
  'Neurologist',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpec, search]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedSpec && selectedSpec !== 'All') query.append('specialization', selectedSpec);

      const res = await fetch(`/api/doctors?${query.toString()}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error('Fetch doctors error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Verified Medical Specialists</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find & Book Expert Doctors
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Browse top medical practitioners across specializations, check availability, and schedule your appointment.
          </p>
        </div>

        {/* Search & Specialization Filters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor by name, specialization, or clinic..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden transition-all shadow-xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpec(spec)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpec === spec
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
            <p className="text-slate-500 text-xs font-medium">Loading medical specialists...</p>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-5">
                  
                  {/* Doctor Avatar & Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{doc.name}</h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                        {doc.specialization}
                      </span>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{doc.experience} Experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
                    <div className="font-semibold text-slate-800">{doc.qualification}</div>
                    
                    <div className="flex items-start gap-2 text-slate-500">
                      <Building2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{doc.clinicName} — <span className="text-slate-400">{doc.clinicAddress}</span></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{doc.availableDays} ({doc.availableFrom} - {doc.availableTo})</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Available Today
                  </div>

                  <Link
                    href={`/appointments/book?doctorId=${doc.id}`}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-slate-800 font-bold text-base">No Doctors Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any doctors matching your current search or specialization filter. Try adjusting your query.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
