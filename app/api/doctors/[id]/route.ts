import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ doctor });
  } catch (error: unknown) {
    console.error('Doctor fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  } catch (error: unknown) {
    console.error('Doctor update error:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.doctor.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error: unknown) {
    console.error('Doctor delete error:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 400 });
  }
}
