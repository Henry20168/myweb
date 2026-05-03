import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
  }
  const body = await req.json();
  const task = await prisma.task.update({
    where: { id },
    data: {
      title: body.title != null ? String(body.title) : undefined,
      description: body.description != null ? String(body.description) : undefined,
      status: body.status != null ? String(body.status) : undefined,
      dueDate: body.dueDate != null ? new Date(body.dueDate) : undefined,
      assignedToId: body.assignedToId != null ? Number(body.assignedToId) : undefined,
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
  }
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
