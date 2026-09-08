import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, createSessionCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(validated.password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    await createSessionCookie(session);

    return NextResponse.json(
      { message: 'Login successful', user: session },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errMessage = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ error: errMessage }, { status: 400 });
  }
}
