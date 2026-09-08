import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { doctorSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const specialization = searchParams.get('specialization') || '';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const session = await getCurrentSession();
    const isAdmin = session?.role === 'ADMIN';

    const whereClause: any = {};

    if (!isAdmin || !includeInactive) {
      whereClause.status = 'ACTIVE';
    }

    if (specialization && specialization !== 'All') {
      whereClause.specialization = specialization;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
        { clinicName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ doctors });
  } catch (error: unknown) {
    console.error('Doctors fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validated = doctorSchema.parse(body);

    const doctor = await prisma.doctor.create({
      data: validated,
    });

    return NextResponse.json({ message: 'Doctor created successfully', doctor }, { status: 201 });
  } catch (error: unknown) {
    console.error('Doctor creation error:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to create doctor';
    return NextResponse.json({ error: errMessage }, { status: 400 });
  }
}
