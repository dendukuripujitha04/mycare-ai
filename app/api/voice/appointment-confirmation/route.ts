import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { triggerAppointmentConfirmationCall } from '@/lib/omnidimension';

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId, language } = await request.json();

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: true,
        user: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && appointment.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await triggerAppointmentConfirmationCall({
      appointmentId: appointment.id,
      userId: appointment.userId,
      userName: appointment.user?.name || appointment.patientName || 'Patient',
      userPhone: appointment.user?.phone || appointment.patientPhone || '',
      appointmentNumber: appointment.appointmentNumber,
      doctorName: appointment.doctor.name,
      doctorSpecialization: appointment.doctor.specialization,
      clinicName: appointment.doctor.clinicName,
      clinicAddress: appointment.doctor.clinicAddress,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      language: language || 'en',
    });

    return NextResponse.json({
      message: 'Voice confirmation process executed',
      result,
    });
  } catch (error: unknown) {
    console.error('Voice confirmation route error:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to process voice call';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
