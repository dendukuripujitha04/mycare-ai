import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export async function GET(
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
      include: {
        doctor: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        voiceCalls: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && appointment.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ appointment });
  } catch (error: unknown) {
    console.error('Fetch single appointment error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existingAppt = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppt) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && existingAppt.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: body,
      include: { doctor: true, voiceCalls: true },
    });

    return NextResponse.json({ message: 'Appointment updated successfully', appointment: updated });
  } catch (error: unknown) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 400 });
  }
}
