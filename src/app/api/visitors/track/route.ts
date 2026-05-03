import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const city = typeof body.city === 'string' ? body.city : null;
  const country = typeof body.country === 'string' ? body.country : null;
  const deviceType = typeof body.deviceType === 'string' ? body.deviceType : null;
  const lastPath = typeof body.lastPath === 'string' ? body.lastPath : null;

  // For now, we treat each call as a generic visitor; later we could link to a cookie/session id.
  const visitor = await prisma.visitor.create({
    data: {
      city: city || null,
      country: country || null,
      deviceType: deviceType || null,
      lastPath: lastPath || null,
    },
  });

  return NextResponse.json({ ok: true, id: visitor.id });
}
