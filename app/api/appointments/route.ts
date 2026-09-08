import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { appointmentBookingSchema } from '@/lib/validations';
import { triggerAppointmentConfirmationCall } from '@/lib/omnidimension';

// GET: Admin-only — fetch all appointments
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: true,
        voiceCalls: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ appointments });
  } catch (error: unknown) {
    console.error('Fetch appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST: Public — anyone can book an appointment (no login needed)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = appointmentBookingSchema.parse(body);

    const doctor = await prisma.doctor.findUnique({
      where: { id: validated.doctorId },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Selected doctor was not found.' }, { status: 404 });
    }

    // Generate unique appointment number
    const appointmentNumber = `MCA-${Math.floor(100000 + Math.random() * 900000)}`;

    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber,
        doctorId: doctor.id,
        patientName: validated.name,
        patientPhone: validated.phone,
        appointmentDate: validated.appointmentDate,
        appointmentTime: validated.appointmentTime,
        reason: validated.reason,
        notes: validated.notes || null,
        status: 'UPCOMING',
      },
      include: {
        doctor: true,
      },
    });

    // CORE FEATURE: Trigger OmniDimension voice confirmation call
    // Uses name & phone from the booking form — no login required
    const voiceResult = await triggerAppointmentConfirmationCall({
      appointmentId: appointment.id,
      userId: null,
      userName: validated.name,
      userPhone: validated.phone,
      appointmentNumber: appointment.appointmentNumber,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      clinicName: doctor.clinicName,
      clinicAddress: doctor.clinicAddress,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      language: 'en',
    });

    return NextResponse.json(
      {
        message: 'Appointment booked successfully',
        appointment,
        voiceCallStatus: voiceResult,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Book appointment error:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to book appointment';
    return NextResponse.json({ error: errMessage }, { status: 400 });
  }
}
