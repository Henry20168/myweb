import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      title: String(body.title || ''),
      description: body.description ? String(body.description) : null,
      status: body.status ? String(body.status) : 'open',
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      assignedToId: body.assignedToId ? Number(body.assignedToId) : null,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
