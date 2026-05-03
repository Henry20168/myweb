import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid client id' }, { status: 400 });
  }
  const body = await req.json();
  const client = await prisma.client.update({
    where: { id },
    data: {
      fullName: body.fullName != null ? String(body.fullName) : undefined,
      phone: body.phone != null ? String(body.phone) : undefined,
      email: body.email != null ? String(body.email) : undefined,
      city: body.city != null ? String(body.city) : undefined,
      address: body.address != null ? String(body.address) : undefined,
      nationality: body.nationality != null ? String(body.nationality) : undefined,
      idType: body.idType != null ? String(body.idType) : undefined,
      idNumber: body.idNumber != null ? String(body.idNumber) : undefined,
      notes: body.notes != null ? String(body.notes) : undefined,
      status: body.status != null ? String(body.status) : undefined,
    },
  });
  return NextResponse.json(client);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid client id' }, { status: 400 });
  }
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
