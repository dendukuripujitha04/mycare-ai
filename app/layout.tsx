import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medicare AI — Smart Healthcare Assistance & Doctor Appointments',
  description:
    'Medicare AI combines intelligent health assistance, symptom analysis, doctor appointment scheduling, and automated OmniDimension AI voice call confirmations in one simple platform.',
  keywords: [
    'Medicare AI',
    'AI Health Assistant',
    'Symptom Analyzer',
    'Doctor Appointment',
    'Healthcare Triage',
    'OmniDimension AI Voice',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
