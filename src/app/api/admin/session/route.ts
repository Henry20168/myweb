import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const COOKIE = 'aalikouch_admin';
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 });
    
    if (String(pin) !== String(process.env.ADMIN_PIN)) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    // Create a signed JWT
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(SECRET);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, { 
      httpOnly: true, 
      path: '/', 
      maxAge: 60 * 60 * 8,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return res;
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
