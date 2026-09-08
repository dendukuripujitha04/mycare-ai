import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        voiceCalls: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ appointments });
  } catch (error: unknown) {
    console.error('Admin appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin appointments' }, { status: 500 });
  }
}
