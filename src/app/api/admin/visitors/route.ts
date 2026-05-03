import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const visitors = await prisma.visitor.findMany({ orderBy: { lastVisitedAt: 'desc' } });
  return NextResponse.json(visitors);
}
