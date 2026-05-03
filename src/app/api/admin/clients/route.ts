import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const body = await req.json();
  const client = await prisma.client.create({
    data: {
      fullName: String(body.fullName || ''),
      phone: String(body.phone || ''),
      email: body.email ? String(body.email) : null,
      city: body.city ? String(body.city) : null,
      address: body.address ? String(body.address) : null,
      nationality: body.nationality ? String(body.nationality) : null,
      idType: body.idType ? String(body.idType) : null,
      idNumber: body.idNumber ? String(body.idNumber) : null,
      notes: body.notes ? String(body.notes) : null,
      status: body.status ? String(body.status) : 'active',
    },
  });
  return NextResponse.json(client, { status: 201 });
}
