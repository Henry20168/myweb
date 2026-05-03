import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const data = await req.json();
  const patch: Record<string, unknown> = {};
  // Generic scalar fields with coercion when present
  const S = (k: string) => Object.prototype.hasOwnProperty.call(data, k);
  if (S('brand')) patch.brand = data.brand || null;
  if (S('model')) patch.model = data.model || null;
  if (S('year')) patch.year = data.year ? Number(data.year) : null;
  if (S('category')) patch.category = data.category || null;
  if (S('transmission')) patch.transmission = data.transmission || null;
  if (S('fuel')) patch.fuel = data.fuel || null;
  if (S('seats')) patch.seats = data.seats ? Number(data.seats) : null;
  if (S('doors')) patch.doors = data.doors ? Number(data.doors) : null;
  if (S('luggageCapacity')) patch.luggageCapacity = data.luggageCapacity ? Number(data.luggageCapacity) : null;
  if (S('horsepower')) patch.horsepower = data.horsepower ? Number(data.horsepower) : null;
  if (S('engine')) patch.engine = data.engine || null;
  if (S('mileagePolicy')) patch.mileagePolicy = data.mileagePolicy || null;
  if (S('fuelPolicy')) patch.fuelPolicy = data.fuelPolicy || null;
  if (S('minRentalDays')) patch.minRentalDays = (data.minRentalDays === '' || data.minRentalDays === null || typeof data.minRentalDays === 'undefined') ? 1 : Number(data.minRentalDays);
  if (S('rating')) patch.rating = (data.rating === '' || data.rating === null || typeof data.rating === 'undefined') ? 0 : Number(data.rating);
  if (S('gps')) patch.gps = Boolean(data.gps);
  if (S('bluetooth')) patch.bluetooth = Boolean(data.bluetooth);
  if (S('ac')) patch.ac = Boolean(data.ac);
  if (S('usb')) patch.usb = Boolean(data.usb);
  if (S('parkingSensors')) patch.parkingSensors = Boolean(data.parkingSensors);
  if (S('rearCamera')) patch.rearCamera = Boolean(data.rearCamera);
  if (S('cruiseControl')) patch.cruiseControl = Boolean(data.cruiseControl);
  if (S('dailyPrice')) patch.dailyPrice = data.dailyPrice ? Number(data.dailyPrice) : null;
  if (S('description')) patch.description = data.description || null;
  if (S('status')) patch.status = data.status || 'available';
  if (Object.prototype.hasOwnProperty.call(data, 'offerDiscountPercent')) {
    const v = data.offerDiscountPercent;
    patch.offerDiscountPercent = v === null || v === '' || typeof v === 'undefined' ? null : Number(v);
  }
  if (Object.prototype.hasOwnProperty.call(data, 'offerExpiresAt')) {
    const v = data.offerExpiresAt;
    patch.offerExpiresAt = v ? new Date(v) : null;
  }
  if (Object.prototype.hasOwnProperty.call(data, 'offerImageUrl')) {
    const v = data.offerImageUrl;
    patch.offerImageUrl = v || null;
  }
  if (Object.prototype.hasOwnProperty.call(data, 'imageUrl') && data.imageUrl) {
    // If imageUrl is provided, update or create primary image
    const imageUrl = data.imageUrl;
    patch.images = {
      deleteMany: { isPrimary: true },
      create: { url: imageUrl, isPrimary: true }
    };
  }
  try {
    const car = await prisma.car.update({ where: { id }, data: patch, include: { images: true } });
    try { revalidatePath('/'); revalidatePath('/cars'); revalidatePath('/offers'); } catch {}
    return NextResponse.json(car);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    await prisma.car.delete({ where: { id } });
    try { revalidatePath('/'); revalidatePath('/cars'); revalidatePath('/offers'); } catch {}
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}

