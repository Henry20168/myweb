import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [carCount, motoCount, bookingCount, contactCount, latestBookings] = await Promise.all([
    prisma.car.count(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).motorcycle.count(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).booking.count(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).contactMessage.count(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Aggregate stats
  const carCategories = await prisma.car.groupBy({
    by: ['category'],
    _count: { id: true },
  });

  const carBrands = await prisma.car.groupBy({
    by: ['brand'],
    _count: { id: true },
  });

  return NextResponse.json({
    counts: {
      cars: carCount,
      motorcycles: motoCount,
      bookings: bookingCount,
      messages: contactCount,
    },
    latestBookings,
    categories: carCategories,
    brands: carBrands,
  });
}
