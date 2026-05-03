import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qRaw = (searchParams.get("q") || "").trim();
  const q = qRaw;
  const qCap = qRaw.charAt(0).toUpperCase() + qRaw.slice(1);

  if (!q || q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  const cars = await prisma.car.findMany({
    where: {
      OR: [
        { brand: { startsWith: q } },
        { model: { startsWith: q } },
        { brand: { startsWith: qCap } },
        { model: { startsWith: qCap } },
      ],
    },
    take: 8,
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      images: { select: { url: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: cars });
}
