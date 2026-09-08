import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSessionCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validated.password);

    const newUser = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        phone: validated.phone,
        passwordHash: hashedPassword,
        role: validated.role || 'USER',
      },
    });

    const session = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

    await createSessionCookie(session);

    return NextResponse.json(
      { message: 'Registration successful', user: session },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const errMessage = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ error: errMessage }, { status: 400 });
  }
}
