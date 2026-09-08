import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const [
      totalUsers,
      totalDoctors,
      totalAppointments,
      todaysAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      totalVoiceCalls,
      failedVoiceCalls,
      initiatedVoiceCalls,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { appointmentDate: todayStr } }),
      prisma.appointment.count({ where: { status: 'UPCOMING' } }),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { status: 'CANCELLED' } }),
      prisma.voiceCall.count(),
      prisma.voiceCall.count({ where: { status: 'FAILED' } }),
      prisma.voiceCall.count({ where: { status: { in: ['INITIATED', 'RINGING', 'ANSWERED', 'COMPLETED'] } } }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        todaysAppointments,
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        totalVoiceCalls,
        failedVoiceCalls,
        initiatedVoiceCalls,
      },
    });
  } catch (error: unknown) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
