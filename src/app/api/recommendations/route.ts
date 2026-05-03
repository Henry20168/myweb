import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type CarWithImages = Prisma.CarGetPayload<{ include: { images: true } }>;
type MotorcycleWithImages = Prisma.MotorcycleGetPayload<{ include: { images: true } }>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",").map(Number).filter(id => !isNaN(id)) || [];
    const type = searchParams.get("type") || "car";

    // If no history, return latest of that type
    if (ids.length === 0) {
      const latest = type === "car" 
        ? await prisma.car.findMany({ include: { images: true }, take: 4, orderBy: { createdAt: "desc" } })
        : await prisma.motorcycle.findMany({ include: { images: true }, take: 4, orderBy: { createdAt: "desc" } });
      return NextResponse.json(latest);
    }

    // Find categories/brands from history
    let categories: string[] = [];
    let brands: string[] = [];

    if (type === "car") {
      const history = await prisma.car.findMany({ 
        where: { id: { in: ids } }, 
        select: { category: true, brand: true } 
      });
      categories = history.map(h => h.category).filter((c): c is string => !!c);
      brands = history.map(h => h.brand).filter((b): b is string => !!b);
    } else {
      const history = await prisma.motorcycle.findMany({ 
        where: { id: { in: ids } }, 
        select: { category: true, brand: true } 
      });
      categories = history.map(h => h.category).filter((c): c is string => !!c);
      brands = history.map(h => h.brand).filter((b): b is string => !!b);
    }

    // Unique sets
    const uniqueCats = Array.from(new Set(categories));
    const uniqueBrands = Array.from(new Set(brands));

    // Recommend similar items
    let recommended: (CarWithImages | MotorcycleWithImages)[] = [];
    
    if (type === "car") {
      recommended = await prisma.car.findMany({
        where: {
          id: { notIn: ids },
          OR: [
            { category: { in: uniqueCats } },
            { brand: { in: uniqueBrands } }
          ]
        },
        include: { images: true },
        take: 4,
      });
    } else {
      recommended = await prisma.motorcycle.findMany({
        where: {
          id: { notIn: ids },
          OR: [
            { category: { in: uniqueCats } },
            { brand: { in: uniqueBrands } }
          ]
        },
        include: { images: true },
        take: 4,
      });
    }

    // If not enough recommendations, pad with latest items not in history/already recommended
    if (recommended.length < 4) {
      const existingIds = [...ids, ...recommended.map(r => r.id)];
      const take = 4 - recommended.length;
      
      const pad = type === "car"
        ? await prisma.car.findMany({
            where: { id: { notIn: existingIds } },
            include: { images: true },
            take,
            orderBy: { createdAt: "desc" },
          })
        : await prisma.motorcycle.findMany({
            where: { id: { notIn: existingIds } },
            include: { images: true },
            take,
            orderBy: { createdAt: "desc" },
          });
      
      return NextResponse.json([...recommended, ...pad]);
    }

    return NextResponse.json(recommended);
  } catch (error) {
    console.error("Recommendations API error:", error);
    // Fallback to latest cars on error to prevent total failure
    try {
      const fallback = await prisma.car.findMany({ include: { images: true }, take: 4, orderBy: { createdAt: "desc" } });
      return NextResponse.json(fallback);
    } catch {
      return NextResponse.json([], { status: 500 });
    }
  }
}
