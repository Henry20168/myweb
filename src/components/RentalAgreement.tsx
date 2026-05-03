"use client";

import { format } from "date-fns";
import { formatMAD } from "@/lib/util";

interface RentalAgreementProps {
  booking: {
    id: number;
    customerName: string;
    phone: string;
    email: string | null;
    pickupCity: string;
    returnCity: string;
    pickupAt: string | Date;
    returnAt: string | Date;
    days: number;
    price: number;
    vehicleType: string;
    car?: { brand: string; model: string; year?: number | null };
    motorcycle?: { brand: string; model: string; year?: number | null };
  };
  company?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export default function RentalAgreement({ booking, company }: RentalAgreementProps) {
  const vehicle = booking.car || booking.motorcycle;
  const today = new Date();

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto text-gray-900 font-serif print:p-0 print:m-0" id="rental-agreement">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-red-600 mb-1">
            {company?.name || "AALIKOUCH CAR"}
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Premium Rental Services</p>
        </div>
        <div className="text-right text-xs space-y-1">
          <p className="font-bold">Agreement #{booking.id.toString().padStart(6, '0')}</p>
          <p>{format(today, "MMMM dd, yyyy")}</p>
          <p>{company?.address || "Rabat, Morocco"}</p>
          <p>{company?.phone || "+212 661 44 93 53"}</p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center underline uppercase mb-10">Rental Agreement</h2>

      <div className="grid grid-cols-2 gap-12 mb-10">
        {/* Customer Section */}
        <section>
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Customer Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Full Name:</span>
              <span className="font-bold">{booking.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Phone:</span>
              <span className="font-bold">{booking.phone}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Email:</span>
              <span className="font-bold">{booking.email || "—"}</span>
            </div>
          </div>
        </section>

        {/* Vehicle Section */}
        <section>
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Vehicle Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Vehicle:</span>
              <span className="font-bold">{vehicle?.brand} {vehicle?.model}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Year:</span>
              <span className="font-bold">{vehicle?.year || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Type:</span>
              <span className="font-bold capitalize">{booking.vehicleType}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Rental Period Section */}
      <section className="bg-gray-50 p-6 rounded-2xl mb-10">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest text-center">Rental Terms</h3>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Pick-up</p>
              <p className="text-lg font-bold">{booking.pickupCity}</p>
              <p className="text-gray-600">{format(new Date(booking.pickupAt), "EEE, MMM dd, yyyy 'at' HH:mm")}</p>
            </div>
          </div>
          <div className="space-y-4 text-right">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Return</p>
              <p className="text-lg font-bold">{booking.returnCity}</p>
              <p className="text-gray-600">{format(new Date(booking.returnAt), "EEE, MMM dd, yyyy 'at' HH:mm")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="mb-12">
        <div className="flex justify-between items-end border-t-2 border-gray-900 pt-6">
          <div>
            <p className="text-sm text-gray-500">Duration: <span className="font-bold text-gray-900">{booking.days} Days</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1 uppercase font-bold tracking-widest">Total Amount Paid</p>
            <p className="text-4xl font-black text-red-600 leading-none">{formatMAD(booking.price)}</p>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section className="text-[10px] text-gray-500 leading-relaxed space-y-2 border-t border-gray-100 pt-8 mb-20">
        <p className="font-bold text-gray-700">General Terms:</p>
        <p>1. The vehicle must be returned in the same condition as received. Any damage will be charged to the customer.</p>
        <p>2. Fuel must be returned at the same level as at pick-up. Missing fuel will be charged at current market rates plus a service fee.</p>
        <p>3. Only authorized drivers listed on this agreement are allowed to operate the vehicle.</p>
        <p>4. Smoking is strictly prohibited inside the vehicle. A cleaning fee will apply if violated.</p>
      </section>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-20 pt-10">
        <div className="border-t border-gray-400 pt-4">
          <p className="text-xs font-bold uppercase mb-12">Customer Signature</p>
          <div className="h-10"></div>
        </div>
        <div className="border-t border-gray-400 pt-4">
          <p className="text-xs font-bold uppercase mb-12">Company Representative</p>
          <div className="h-10"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-[9px] text-gray-400 uppercase tracking-[0.2em]">
        Thank you for choosing Aalikouch Car. Have a safe journey.
      </div>
    </div>
  );
}
