import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && appointment.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const cancelledAppt = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { doctor: true },
    });

    return NextResponse.json({
      message: 'Appointment cancelled successfully',
      appointment: cancelledAppt,
    });
  } catch (error: unknown) {
    console.error('Cancel appointment error:', error);
    return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 400 });
  }
}
