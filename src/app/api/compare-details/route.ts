import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").map(Number).filter(Boolean) || [];

  if (ids.length === 0) return NextResponse.json([]);

  const cars = await prisma.car.findMany({
    where: { id: { in: ids } },
    include: { images: true }
  });

  // Also check motorcycles if needed (assuming ids are unique across or we handle type)
  // For now, focusing on cars as per common use case, but we can merge.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const motorcycles = await (prisma as any).motorcycle.findMany({
    where: { id: { in: ids } },
    include: { images: true }
  });

  return NextResponse.json([...cars, ...motorcycles]);
}
