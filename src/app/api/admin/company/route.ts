import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const info = await prisma.companyInfo.findFirst();
  return NextResponse.json(info || {});
}

export async function POST(req: Request) {

  const body = (await req.json().catch(()=>({}))) as Partial<{
    name: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
  }>;
  const data: Partial<{
    name: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
  }> = {
    name: typeof body.name === 'string' ? body.name : undefined,
    address: typeof body.address === 'string' ? body.address : undefined,
    phone: typeof body.phone === 'string' ? body.phone : undefined,
    email: typeof body.email === 'string' ? body.email : undefined,
    whatsapp: typeof body.whatsapp === 'string' ? body.whatsapp : undefined,
  };
  (Object.keys(data) as (keyof typeof data)[]).forEach((k) => {
    if (data[k] === undefined) {
      delete data[k];
    }
  });

  // upsert first record
  const existing = await prisma.companyInfo.findFirst();
  const saved = existing
    ? await prisma.companyInfo.update({ where: { id: existing.id }, data })
    : await prisma.companyInfo.create({ data: data as Prisma.CompanyInfoCreateInput });

  return NextResponse.json(saved);
}
