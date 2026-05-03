import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Type definitions
interface Car {
  id: number;
  brand: string;
  model: string;
  category?: string | null;
  images: Array<{ url: string; isPrimary?: boolean }>;
}

interface Motorcycle {
  id: number;
  brand: string;
  model: string;
  category?: string | null;
  images: Array<{ url: string; isPrimary?: boolean }>;
}

interface BookingExtra {
  id: number;
  extra: {
    id: number;
    name: string;
    pricePerDay: number;
  };
  qty: number;
}

interface CarBooking {
  id: number;
  customerName: string;
  phone: string;
  email: string | null;
  pickupCity: string;
  returnCity: string;
  pickupAt: Date;
  returnAt: Date;
  days: number;
  price: number;
  status: string;
  notes: string | null;
  car: Car;
  extras: BookingExtra[];
  createdAt: Date;
}

interface MotorcycleBooking {
  id: number;
  customerName: string;
  phone: string;
  email: string | null;
  pickupCity: string;
  returnCity: string;
  pickupAt: Date;
  returnAt: Date;
  days: number;
  price: number;
  status: string;
  notes: string | null;
  motorcycle: Motorcycle;
  extras: BookingExtra[];
  createdAt: Date;
}


interface BookingWithVehicleType {
  vehicleType: 'car' | 'motorcycle';
  vehicle: Car | Motorcycle;
  createdAt: Date;
}

interface ExtraItem {
  extraId: number;
  qty?: number;
}

interface BookingRequest {
  carId?: number;
  motorcycleId?: number;
  customerName: string;
  phone: string;
  email?: string;
  pickupCity: string;
  returnCity: string;
  pickupAt: string;
  returnAt: string;
  days: number;
  price: number;
  extras: ExtraItem[];
  notes?: string;
}

 export async function GET() {
  try {

    // Fetch both car and motorcycle bookings
    let carBookings: CarBooking[] = [];
    try {
      carBookings = await prisma.booking.findMany({ 
        include: { car: { include: { images: true } }, extras: { include: { extra: true } } }, 
        orderBy: { createdAt: 'desc' } 
      }) as unknown as CarBooking[];
    } catch (cErr) {
      console.error('Error fetching car bookings:', cErr);
    }

    let motorcycleBookings: MotorcycleBooking[] = [];
    try {
      motorcycleBookings = await prisma.motorcycleBooking.findMany({ 
        include: { motorcycle: { include: { images: true } }, extras: { include: { extra: true } } }, 
        orderBy: { createdAt: 'desc' } 
      }) as unknown as MotorcycleBooking[];
    } catch (mErr) {
      console.error('Error fetching motorcycle bookings:', mErr);
    }
    
    // Combine and format bookings for admin panel
    const allBookings = [
      ...carBookings.map((booking: CarBooking) => ({ ...booking, vehicleType: 'car' as const, vehicle: booking.car })),
      ...motorcycleBookings.map((booking: MotorcycleBooking) => ({ ...booking, vehicleType: 'motorcycle' as const, vehicle: booking.motorcycle }))
    ].sort((a: BookingWithVehicleType, b: BookingWithVehicleType) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    
    console.log(`GET /api/bookings: Returning ${allBookings.length} bookings (${carBookings.length} cars, ${motorcycleBookings.length} motorcycles)`);
    return NextResponse.json(allBookings);
  } catch (err) {
    console.error('GET /api/bookings error:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
 }

export async function POST(req: Request) {
  const body: BookingRequest = await req.json();
  console.log('POST /api/bookings: Received body:', JSON.stringify(body, null, 2));
  try {
    // Determine if this is a car or motorcycle booking
    const isCarBooking = 'carId' in body;
    const isMotorcycleBooking = 'motorcycleId' in body;
    
    console.log(`POST /api/bookings: Type: ${isCarBooking ? 'car' : isMotorcycleBooking ? 'motorcycle' : 'unknown'}`);
    if (!isCarBooking && !isMotorcycleBooking) {
      throw new Error('Invalid booking: must provide either carId or motorcycleId');
    }
    
    const result = await prisma.$transaction(async (tx) => {
      let booking;
      
      if (isCarBooking) {
        // Create car booking
        booking = await tx.booking.create({
          data: {
            carId: Number(body.carId),
            customerName: String(body.customerName || ''),
            phone: String(body.phone || ''),
            email: body.email ? String(body.email) : null,
            pickupCity: String(body.pickupCity || 'Morocco'),
            returnCity: String(body.returnCity || 'Morocco'),
            pickupAt: new Date(body.pickupAt),
            returnAt: new Date(body.returnAt),
            days: Number(body.days || 1),
            price: Number(body.price || 0),
            status: 'pending',
            notes: body.notes || null,
          },
        });
      } else if (isMotorcycleBooking) {
        // Create motorcycle booking using the MotorcycleBooking model
        booking = await tx.motorcycleBooking.create({
          data: {
            motorcycleId: Number(body.motorcycleId),
            customerName: String(body.customerName || ''),
            phone: String(body.phone || ''),
            email: body.email ? String(body.email) : null,
            pickupCity: String(body.pickupCity || 'Morocco'),
            returnCity: String(body.returnCity || 'Morocco'),
            pickupAt: new Date(body.pickupAt),
            returnAt: new Date(body.returnAt),
            days: Number(body.days || 1),
            price: Number(body.price || 0),
            status: 'pending',
            notes: body.notes || null,
          },
        });
      } else {
        throw new Error('Invalid booking: must provide either carId or motorcycleId');
      }
      
      const extras: Array<{ extraId: number; qty?: number }> = Array.isArray(body.extras) ? body.extras : [];
      if (extras.length) {
        if (isCarBooking) {
          await tx.bookingExtra.createMany({
            data: extras.map((e: ExtraItem) => ({ bookingId: booking.id, extraId: Number(e.extraId), qty: Number(e.qty || 1) })),
          });
        } else if (isMotorcycleBooking) {
          await tx.motorcycleBookingExtra.createMany({
            data: extras.map((e: ExtraItem) => ({ bookingId: booking.id, extraId: Number(e.extraId), qty: Number(e.qty || 1) })),
          });
        }
      }
      return booking;
    });

    console.log(`POST /api/bookings: Successfully created ${isCarBooking ? 'car' : 'motorcycle'} booking ID: ${result.id}`);
    let full: CarBooking | MotorcycleBooking | null = null;
    if (isCarBooking) {
      full = await prisma.booking.findUnique({
        where: { id: result.id },
        include: { car: { include: { images: true } }, extras: { include: { extra: true } } },
      }) as CarBooking;
    } else if (isMotorcycleBooking) {
      full = await prisma.motorcycleBooking.findUnique({
        where: { id: result.id },
        include: { motorcycle: { include: { images: true } }, extras: { include: { extra: true } } },
      }) as unknown as MotorcycleBooking;
    }

    // Fire-and-forget email notification; booking stays valid even if email fails
    if (full) {
      const host = process.env.SMTP_HOST;
      const port = Number(process.env.SMTP_PORT || 587);
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const from = process.env.SMTP_FROM || user || full.email || 'booking@aalikouch-car.local';
      const toOwner = process.env.BOOKING_RECEIVE_EMAIL || process.env.CONTACT_RECEIVE_EMAIL || user || full.email || '';

      if (host && user && pass && toOwner) {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

        const vehicle = isCarBooking ? (full as CarBooking).car : (full as MotorcycleBooking).motorcycle;
        const img = vehicle?.images?.[0]?.url;
        const extrasLines = (full.extras || [])
          .map((e: BookingExtra) => `${e.extra.name} x ${e.qty || 1}`)
          .join(', ') || 'None';

        const pickupAtFormatted = full.pickupAt.toLocaleString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const returnAtFormatted = full.returnAt.toLocaleString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const detailedHtml = `
          <div style="background:#f5f5f5;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111111;">
            <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;box-shadow:0 10px 25px rgba(0,0,0,0.06);">
              <div style="background:#111111;color:#ffffff;padding:16px 20px;border-bottom:3px solid #e11d48;display:flex;align-items:center;justify-content:space-between;">
                <div>
                  <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">Aalikouch Car</div>
                  <div style="font-size:18px;font-weight:700;">New Booking #${full.id}</div>
                </div>
                <div style="font-size:12px;color:#fbbf24;">${full.status?.toUpperCase() || 'PENDING'}</div>
              </div>

              ${img ? `
              <div style="padding:16px 20px 0 20px;">
                <div style="border-radius:10px;border:1px solid #e5e5e5;background:#0b0b0b;padding:10px;text-align:center;">
                  <img src="${img}" alt="car" style="max-width:100%;height:auto;border-radius:8px;display:block;margin:0 auto;" />
                </div>
              </div>` : ''}

              <div style="padding:20px 20px 8px 20px;">
                <div style="font-size:16px;font-weight:600;color:#111111;margin-bottom:4px;">
                  ${vehicle?.brand || ''} ${vehicle?.model || ''}
                </div>
                <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">
                  ${vehicle?.category || ''}
                </div>
                <div style="font-size:20px;font-weight:700;color:#e11d48;">
                  ${full.price.toLocaleString()} MAD
                  <span style="font-size:13px;font-weight:500;color:#4b5563;"> · ${full.days} day(s)</span>
                </div>
              </div>

              <div style="padding:4px 20px 16px 20px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;">
                <div style="background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;padding:10px 12px;">
                  <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Pickup Details</div>
                  <div style="font-size:13px;color:#111111;font-weight:600;">${full.pickupCity}</div>
                  <div style="font-size:12px;color:#4b5563;margin-top:2px;">${pickupAtFormatted}</div>
                </div>
                <div style="background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;padding:10px 12px;">
                  <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Return Details</div>
                  <div style="font-size:13px;color:#111111;font-weight:600;">${full.returnCity}</div>
                  <div style="font-size:12px;color:#4b5563;margin-top:2px;">${returnAtFormatted}</div>
                </div>
              </div>

              <div style="padding:4px 20px 16px 20px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr);gap:12px;">
                <div style="background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;padding:10px 12px;">
                  <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Customer</div>
                  <div style="font-size:13px;color:#111111;"><strong>Name:</strong> ${full.customerName || '-'}</div>
                  <div style="font-size:13px;color:#111111;margin-top:2px;"><strong>Phone:</strong> ${full.phone || '-'}</div>
                  <div style="font-size:13px;color:#111111;margin-top:2px;"><strong>Email:</strong> ${full.email || '-'}</div>
                </div>
                <div style="background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;padding:10px 12px;">
                  <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Extras</div>
                  <div style="font-size:13px;color:#111111;">${extrasLines}</div>
                </div>
              </div>

              ${full.notes ? `
              <div style="padding:0 20px 12px 20px;">
                <div style="background:#fff7f7;border-radius:10px;border:1px solid #fecaca;padding:10px 12px;">
                  <div style="font-size:11px;font-weight:600;color:#b91c1c;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Customer Notes</div>
                  <div style="font-size:13px;color:#7f1d1d;">${full.notes}</div>
                </div>
              </div>` : ''}

              <div style="padding:0 20px 18px 20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:12px;color:#6b7280;">Generated automatically by <span style="color:#e11d48;font-weight:600;">Aalikouch Car</span></div>
                <div style="font-size:13px;font-weight:700;color:#111111;">Total: ${full.price.toLocaleString()} MAD</div>
              </div>
            </div>
          </div>
        `;

        const shortText = `New booking #${full.id} for ${vehicle?.brand || ''} ${vehicle?.model || ''} from ${full.pickupCity} (${full.pickupAt.toISOString()}) to ${full.returnCity} (${full.returnAt.toISOString()}). Total: ${full.price} MAD.`;

        try {
          // Detailed email
          await transporter.sendMail({
            from,
            to: toOwner,
            subject: `[Booking] New booking #${full.id}`,
            html: detailedHtml,
          });

          // Short notification email (can be filtered separately if needed)
          await transporter.sendMail({
            from,
            to: toOwner,
            subject: `[Booking] New booking notification #${full.id}`,
            text: shortText,
          });
        } catch (mailError) {
          console.error('/api/bookings mail error', mailError);
        }
      }
    }

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (err) {
    console.error('/api/bookings error', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
