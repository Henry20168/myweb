"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatMAD } from "@/lib/util";
import { IconBadge, CarIcon, ClockIcon, PinIcon, BoxIcon, BabySeatIcon, ReceiptIcon, DownloadIcon } from "@/components/Icons";
import { moroccanCities, cityFeeFromRabat, getFeeFromRabat, cityRegion } from "@/lib/cities";
import RedDatePicker from "./RedDatePicker";

type Img = { url?: string };
export type CartCar = {
  id: number;
  brand?: string | null;
  model?: string | null;
  category?: string | null;
  transmission?: string | null;
  fuel?: string | null;
  seats?: number | null;
  dailyPrice?: number | null;
  description?: string | null;
  images?: Img[];
};

type CartText = {
  steps: [string, string, string, string, string];
  selectVehicleTitle: string;
  peopleSuffix: string;
  perDaySuffix: string;
  continueToDetails: string;
  errorSelectVehicle: string;
  // time and city helpers
  timePlaceholder: string;
  timeHelp: string;
  cityFree: string;
  cityExtraPrefix: string;
  // rental details step
  rentalDetailsTitle: string;
  pickUpDetails: string;
  returnDetails: string;
  locationLabel: string;
  dateLabel: string;
  timeLabel: string;
  rentalSummaryTitle: string;
  rentalSummaryCarRental: string;
  rentalSummaryPickupShipping: string;
  rentalSummaryReturnShipping: string;
  rentalSummarySubtotal: string;
  rentalSummaryHint: string;
  backToVehicle: string;
  continueToExtras: string;
  errorDetailsMissing: string;
  // right reservation summary
  reservationSummaryTitle: string;
  progressLabel: string;
  selectedVehicleTitle: string;
  reservationRentalDetailsTitle: string;
  reservationPickUpLabel: string;
  reservationDropOffLabel: string;
  reservationDaysRental: string; // e.g. "days Rental" / "jours de location"
  reservationPickupLocation: string;
  reservationReturnLocation: string;
  reservationVehicleRentalLine: string; // e.g. "Vehicle Rental" (X days)
  reservationAdditionalServicesLine: string;
  reservationShippingPickupShort: string;
  reservationShippingReturnShort: string;
  reservationChildSeatShort: string;
  reservationTotalAmount: string;
  // extras (step 3) and payment
  extrasTitle: string;
  autoIncludedServices: string;
  shippingPickupLabel: string;
  shippingReturnLabel: string;
  includedTag: string;
  childSeatTitle: string;
  childSeatDesc: string;
  childSeatPerDayHint: string;
  childSeatAddsPrefix: string;
  extrasSummary: string;
  extrasSummaryAutoTag: string;
  extrasSummaryTotalLabel: string;
  paymentTitle: string;
  backToExtras: string;
  daySuffix: string;
};

const CART_TEXT: Record<'en' | 'fr' | 'ar', CartText> = {
  en: {
    steps: ['Vehicle', 'Rental Details', 'Extras', 'Payment', 'Confirmation'],
    selectVehicleTitle: 'Select Your Vehicle',
    peopleSuffix: 'People',
    perDaySuffix: '/Per day',
    continueToDetails: 'Continue to Rental Details',
    errorSelectVehicle: 'Please select a vehicle before continuing.',
    timePlaceholder: 'Select your time',
    timeHelp: 'Choose the time that suits you',
    cityFree: 'Free',
    cityExtraPrefix: '+',
    rentalDetailsTitle: 'Rental Details',
    pickUpDetails: 'Pick-up Details',
    returnDetails: 'Return Details',
    locationLabel: 'Location',
    dateLabel: 'Date',
    timeLabel: 'Time',
    rentalSummaryTitle: 'Rental Summary',
    rentalSummaryCarRental: 'Car Rental:',
    rentalSummaryPickupShipping: 'Pickup Shipping:',
    rentalSummaryReturnShipping: 'Return Shipping:',
    rentalSummarySubtotal: 'Subtotal:',
    rentalSummaryHint: 'Shipping service cost depends on distance from Rabat.',
    backToVehicle: 'Back to Vehicle',
    continueToExtras: 'Continue to Extras',
    errorDetailsMissing: 'Set pick-up and drop-off date/time (drop-off after pick-up) to finalize later steps.',
    reservationSummaryTitle: 'Reservation Summary',
    progressLabel: 'Progress',
    selectedVehicleTitle: 'Selected Vehicle',
    reservationRentalDetailsTitle: 'Rental Details',
    reservationPickUpLabel: 'Pick - Up',
    reservationDropOffLabel: 'Drop - Off',
    reservationDaysRental: 'days Rental',
    reservationPickupLocation: 'Pickup Location',
    reservationReturnLocation: 'Return Location',
    reservationVehicleRentalLine: 'Vehicle Rental',
    reservationAdditionalServicesLine: 'Additional Services',
    reservationShippingPickupShort: 'Shipping Pickup -',
    reservationShippingReturnShort: 'Shipping Return -',
    reservationChildSeatShort: 'Child Safety Seat',
    reservationTotalAmount: 'Total Amount',
    extrasTitle: 'Add Extras',
    autoIncludedServices: 'Auto-included Services',
    shippingPickupLabel: 'Shipping Pickup -',
    shippingReturnLabel: 'Shipping Return -',
    includedTag: 'Included',
    childSeatTitle: 'Child Safety Seat',
    childSeatDesc: 'Safety-certified child car seats for different age groups',
    childSeatPerDayHint: '/day',
    childSeatAddsPrefix: 'Adds',
    extrasSummary: 'Extras Summary',
    extrasSummaryAutoTag: 'Auto',
    extrasSummaryTotalLabel: 'Total Extras',
    paymentTitle: 'Payment',
    backToExtras: 'Back to Extras',
    daySuffix: 'days',
  },
  fr: {
    steps: ['Véhicule', 'Détails de location', 'Extras', 'Paiement', 'Confirmation'],
    selectVehicleTitle: 'Choisissez votre véhicule',
    peopleSuffix: 'Personnes',
    perDaySuffix: '/jour',
    continueToDetails: 'Continuer vers les détails de location',
    errorSelectVehicle: 'Veuillez sélectionner un véhicule avant de continuer.',
    timePlaceholder: "Choisissez l'heure",
    timeHelp: "Choisissez l'heure qui vous convient",
    cityFree: 'Gratuit',
    cityExtraPrefix: '+',
    rentalDetailsTitle: 'Détails de location',
    pickUpDetails: 'Détails de prise en charge',
    returnDetails: 'Détails de retour',
    locationLabel: 'Lieu',
    dateLabel: 'Date',
    timeLabel: 'Heure',
    rentalSummaryTitle: 'Récapitulatif de location',
    rentalSummaryCarRental: 'Location voiture :',
    rentalSummaryPickupShipping: 'Livraison départ :',
    rentalSummaryReturnShipping: 'Livraison retour :',
    rentalSummarySubtotal: 'Sous-total :',
    rentalSummaryHint: 'Le coût du service de livraison dépend de la distance depuis Rabat.',
    backToVehicle: 'Retour au véhicule',
    continueToExtras: 'Continuer vers les extras',
    errorDetailsMissing: "Définissez les dates/horaires de départ et de retour (retour après le départ) pour continuer.",
    reservationSummaryTitle: 'Récapitulatif de réservation',
    progressLabel: 'Progression',
    selectedVehicleTitle: 'Véhicule sélectionné',
    reservationRentalDetailsTitle: 'Détails de location',
    reservationPickUpLabel: 'Départ',
    reservationDropOffLabel: 'Retour',
    reservationDaysRental: 'jours de location',
    reservationPickupLocation: 'Lieu de départ',
    reservationReturnLocation: 'Lieu de retour',
    reservationVehicleRentalLine: 'Location véhicule',
    reservationAdditionalServicesLine: 'Services additionnels',
    reservationShippingPickupShort: 'Livraison départ -',
    reservationShippingReturnShort: 'Livraison retour -',
    reservationChildSeatShort: 'Siège enfant',
    reservationTotalAmount: 'Montant total',
    extrasTitle: 'Ajouter des options',
    autoIncludedServices: 'Services inclus automatiquement',
    shippingPickupLabel: 'Livraison départ -',
    shippingReturnLabel: 'Livraison retour -',
    includedTag: 'Inclus',
    childSeatTitle: 'Siège enfant',
    childSeatDesc: 'Sièges auto enfants certifiés pour différents âges',
    childSeatPerDayHint: '/jour',
    childSeatAddsPrefix: 'Ajoute',
    extrasSummary: 'Récapitulatif des extras',
    extrasSummaryAutoTag: 'Auto',
    extrasSummaryTotalLabel: 'Total des extras',
    paymentTitle: 'Paiement',
    backToExtras: 'Retour aux extras',
    daySuffix: 'jours',
  },
  ar: {
    steps: ['المركبة', 'تفاصيل الإيجار', 'الإضافات', 'الدفع', 'التأكيد'],
    selectVehicleTitle: 'اختر سيارتك',
    peopleSuffix: 'أشخاص',
    perDaySuffix: ' /اليوم',
    continueToDetails: 'متابعة إلى تفاصيل الإيجار',
    errorSelectVehicle: 'يرجى اختيار سيارة قبل المتابعة.',
    timePlaceholder: 'اختر الوقت',
    timeHelp: 'اختر الوقت المناسب لك',
    cityFree: 'مجانا',
    cityExtraPrefix: '+',
    rentalDetailsTitle: 'تفاصيل الإيجار',
    pickUpDetails: 'تفاصيل الاستلام',
    returnDetails: 'تفاصيل الإرجاع',
    locationLabel: 'الموقع',
    dateLabel: 'التاريخ',
    timeLabel: 'الوقت',
    rentalSummaryTitle: 'ملخص الإيجار',
    rentalSummaryCarRental: 'إيجار السيارة:',
    rentalSummaryPickupShipping: 'توصيل الاستلام:',
    rentalSummaryReturnShipping: 'توصيل الإرجاع:',
    rentalSummarySubtotal: 'المجموع الفرعي:',
    rentalSummaryHint: 'تعتمد تكلفة خدمة التوصيل على المسافة من الرباط.',
    backToVehicle: 'الرجوع إلى السيارة',
    continueToExtras: 'متابعة إلى الإضافات',
    errorDetailsMissing: 'يرجى ضبط مدينة/تاريخ/وقت الاستلام والإرجاع (الإرجاع بعد الاستلام) للمتابعة.',
    reservationSummaryTitle: 'ملخص الحجز',
    progressLabel: 'التقدم',
    selectedVehicleTitle: 'السيارة المختارة',
    reservationRentalDetailsTitle: 'تفاصيل الإيجار',
    reservationPickUpLabel: 'الاستلام',
    reservationDropOffLabel: 'الإرجاع',
    reservationDaysRental: 'أيام إيجار',
    reservationPickupLocation: 'مكان الاستلام',
    reservationReturnLocation: 'مكان الإرجاع',
    reservationVehicleRentalLine: 'إيجار السيارة',
    reservationAdditionalServicesLine: 'الخدمات الإضافية',
    reservationShippingPickupShort: 'توصيل الاستلام -',
    reservationShippingReturnShort: 'توصيل الإرجاع -',
    reservationChildSeatShort: 'مقعد أمان للأطفال',
    reservationTotalAmount: 'إجمالي المبلغ',
    extrasTitle: 'إضافة إضافات',
    autoIncludedServices: 'خدمات مضافة تلقائياً',
    shippingPickupLabel: 'توصيل الاستلام -',
    shippingReturnLabel: 'توصيل الإرجاع -',
    includedTag: 'مشمول',
    childSeatTitle: 'مقعد أمان للأطفال',
    childSeatDesc: 'مقاعد سيارة للأطفال معتمدة لمختلف الأعمار',
    childSeatPerDayHint: 'لكل يوم',
    childSeatAddsPrefix: 'يضيف',
    extrasSummary: 'ملخص الإضافات',
    extrasSummaryAutoTag: 'تلقائي',
    extrasSummaryTotalLabel: 'إجمالي الإضافات',
    paymentTitle: 'الدفع',
    backToExtras: 'الرجوع إلى الإضافات',
    daySuffix: 'أيام',
  },
};

const timeSlots = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

function TimeSelect({ label, value, onChange, placeholder, help }: { label: string; value: string; onChange: (v: string)=>void; placeholder: string; help: string }) {
  const [open, setOpen] = useState(false);
  const display = value || placeholder;
  return (
    <div className="relative">
      <div className="text-xs text-gray-600">{label}</div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-gray-900"
      >
        <span className="flex items-center gap-2">
          <span>{display}</span>
        </span>
        <span className="text-gray-500">▾</span>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 border-b border-gray-100">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600">
              <ClockIcon />
            </span>
            <span>{help}</span>
          </div>
          <ul className="max-h-64 overflow-auto py-1 text-sm text-gray-900">
            {timeSlots.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left hover:bg-gray-50"
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CitySelect({ label, value, onChange, freeLabel, extraPrefix }: { label: string; value: string; onChange: (v: string)=>void; freeLabel: string; extraPrefix: string }) {
  const [open, setOpen] = useState(false);
  const fee = getFeeFromRabat(value);
  return (
    <div className="relative">
      <div className="text-xs text-gray-600">{label}</div>
      <button type="button" onClick={()=>setOpen(v=>!v)} className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-gray-900">
        <span className="flex items-center gap-2">
          {fee>0 ? (
            <span className="inline-flex items-center rounded-full border border-red-300 px-2 py-0.5 text-xs">
              <span className="text-black">{extraPrefix} </span>
              <span className="text-red-600 font-semibold">{fee} MAD</span>
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-green-300 px-2 py-0.5 text-xs">
              <span className="text-green-700 font-semibold">{freeLabel}</span>
            </span>
          )}
          <span>{value}</span>
        </span>
        <span className="text-gray-500">▾</span>
      </button>
      <div className="text-[11px] text-gray-500 mt-1">{cityRegion[value] || ''}</div>
      {open && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          <ul className="py-1 text-sm text-gray-900">
            {moroccanCities.map((c)=>{
              const f = getFeeFromRabat(c);
              return (
                <li key={c}>
                  <button type="button" onClick={()=>{ onChange(c); setOpen(false); }} className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-gray-50">
                    {f>0 ? (
                      <span className="mt-0.5 inline-flex items-center rounded-full border border-red-300 px-2 py-0.5 text-[10px]">
                        <span className="text-black">{extraPrefix} </span>
                        <span className="text-red-600 font-semibold">{f} MAD</span>
                      </span>
                    ) : (
                      <span className="mt-0.5 inline-flex items-center rounded-full border border-green-300 px-2 py-0.5 text-[10px]">
                        <span className="text-green-700 font-semibold">{freeLabel}</span>
                      </span>
                    )}
                    <div>
                      <div className="leading-4">{c}</div>
                      {cityRegion[c] && <div className="text-[11px] text-gray-500">{cityRegion[c]}</div>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CartFlow({ cars }: { cars: CartCar[] }) {
  const router = useRouter();
  const search = useSearchParams();
  const [lang, setLang] = useState<'en' | 'fr' | 'ar'>('en');
  const initialStep = Number(search?.get('step') || '1');
  const [step, setStep] = useState(Math.min(5, Math.max(1, initialStep))); // 1 Vehicle, 2 Rental Details, 3 Extras, 4 Payment, 5 Done
  const [selectedId, setSelectedId] = useState<number | null>(cars?.[0]?.id ?? null);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [returnTime, setReturnTime] = useState<string>("");
  const [pickupCity, setPickupCity] = useState<string>("Rabat");
  const [returnCity, setReturnCity] = useState<string>("Rabat");

  const pickupAt = useMemo(()=> (pickupDate && pickupTime) ? new Date(`${pickupDate}T${pickupTime}:00`) : null, [pickupDate, pickupTime]);
  const returnAt = useMemo(()=> (returnDate && returnTime) ? new Date(`${returnDate}T${returnTime}:00`) : null, [returnDate, returnTime]);
  const days = useMemo(()=>{
    if (!pickupAt || !returnAt) return 1;
    const ms = Math.max(0, +returnAt - +pickupAt);
    const d = Math.ceil(ms / (1000*60*60*24));
    return Math.max(1, d);
  }, [pickupAt, returnAt]);

  const selected = useMemo(() => cars.find((c) => c.id === selectedId) || null, [cars, selectedId]);
  const vehicleCost = (selected?.dailyPrice ?? 0) * Math.max(1, days);
  const pickupFee = useMemo(()=> getFeeFromRabat(pickupCity), [pickupCity]);
  const returnFee = useMemo(()=> getFeeFromRabat(returnCity), [returnCity]);
  const [childSeat, setChildSeat] = useState(false);
  const childSeatPerDay = 50;
  const childSeatTotal = useMemo(()=> childSeat ? childSeatPerDay * Math.max(1, days) : 0, [childSeat, days]);
  const extrasTotal = pickupFee + returnFee + childSeatTotal; // shipping + optional extras
  const total = vehicleCost + extrasTotal;

  // Step 4: payment
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);

  const t = CART_TEXT[lang];

  async function loadJsPDF(): Promise<any> {
    if ((window as any).jspdf?.jsPDF) return (window as any).jspdf.jsPDF;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      s.onload = () => resolve(null);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return (window as any).jspdf.jsPDF;
  }

  async function toDataUrl(url: string): Promise<string> {
    const r = await fetch(url);
    const b = await r.blob();
    return await new Promise((res) => { const fr = new FileReader(); fr.onload = ()=>res(fr.result as string); fr.readAsDataURL(b); });
  }

  async function downloadReceipt() {
    const jsPDF = await loadJsPDF();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const orderId = bookingId ?? '-';
    const company = 'AALIKOUCH CAR';
    const link = `${location.origin}/booking-success/${orderId}`;
    const qrUrl = `https://quickchart.io/qr?size=180&text=${encodeURIComponent(link)}`;
    const qr = await toDataUrl(qrUrl);
    const fmt = (n:number)=> new Intl.NumberFormat('en-MA', { style:'currency', currency:'MAD', maximumFractionDigits:0 }).format(n);

    // Header Background
    doc.setFillColor(17, 24, 39); // gray-900
    doc.rect(0, 0, 595, 180, 'F');

    // Logo / Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(company, 40, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175); // gray-400
    doc.text('PREMIUM VEHICLE RENTALS', 40, 78);

    // QR Code on Header
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(470, 40, 85, 85, 10, 10, 'F');
    doc.addImage(qr, 'PNG', 475, 45, 75, 75);
    doc.setFontSize(8);
    doc.text('SCAN TO VERIFY', 512, 135, { align: 'center' });

    // Booking ID & Date
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`BOOKING #${orderId.toString().padStart(6, '0')}`, 40, 130);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`ISSUED ON: ${new Date().toLocaleDateString()}`, 40, 145);

    let y = 220;

    // Content Grid - Left Column (Details)
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 40, y);
    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`NAME: ${customerName || '-'}`, 40, y); y += 15;
    doc.text(`PHONE: ${phone || '-'}`, 40, y); y += 15;
    doc.text(`EMAIL: ${email || '-'}`, 40, y);

    y += 40;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE & RENTAL PERIOD', 40, y);
    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${selected?.brand} ${selected?.model}`, 40, y);
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(`PICK-UP: ${pickupCity} (${pickupAt?.toLocaleString() || '-'})`, 40, y); y += 15;
    doc.text(`RETURN: ${returnCity} (${returnAt?.toLocaleString() || '-'})`, 40, y); y += 15;
    doc.text(`DURATION: ${days} DAYS`, 40, y);

    // Right Column - Pricing Summary Box
    const boxY = 205;
    doc.setFillColor(249, 250, 251); // gray-50
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.roundedRect(340, boxY, 215, 240, 15, 15, 'FD');

    let ry = boxY + 30;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PRICING SUMMARY', 360, ry);
    
    ry += 30;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Vehicle Rental', 360, ry);
    doc.text(fmt(vehicleCost), 535, ry, { align: 'right' });
    
    ry += 20;
    doc.text('Additional Services', 360, ry);
    doc.text(fmt(extrasTotal), 535, ry, { align: 'right' });

    if (pickupFee > 0) {
      ry += 15;
      doc.setTextColor(107, 114, 128);
      doc.text(`- Shipping Pickup (${pickupCity})`, 370, ry);
      doc.text(fmt(pickupFee), 535, ry, { align: 'right' });
    }
    if (returnFee > 0) {
      ry += 15;
      doc.setTextColor(107, 114, 128);
      doc.text(`- Shipping Return (${returnCity})`, 370, ry);
      doc.text(fmt(returnFee), 535, ry, { align: 'right' });
    }
    if (childSeat) {
      ry += 15;
      doc.setTextColor(107, 114, 128);
      doc.text('- Child Safety Seat', 370, ry);
      doc.text(fmt(childSeatTotal), 535, ry, { align: 'right' });
    }

    ry += 40;
    doc.setDrawColor(229, 231, 235);
    doc.line(360, ry, 535, ry);
    
    ry += 25;
    doc.setTextColor(220, 38, 38); // red-600
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT', 360, ry);
    doc.setFontSize(16);
    doc.text(fmt(total), 535, ry, { align: 'right' });

    // Footer Info
    y = 520;
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT & NOTES', 40, y);
    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('METHOD: CASH ON DELIVERY', 40, y); y += 15;
    doc.text(`NOTES: ${notes || 'NONE'}`, 40, y);

    // Bottom Banner
    doc.setFillColor(17, 24, 39);
    doc.rect(0, 780, 595, 62, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('THANK YOU FOR CHOOSING AALIKOUCH CAR', 297, 810, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('WWW.AALIKOUCH-CAR.COM  |  SUPPORT: +212 661 449 353', 297, 825, { align: 'center' });

    doc.save(`AALIKOUCH_BOOKING_${orderId}.pdf`);
  }

  async function confirmBooking() {
    if (!selected) {
      goToStep(1);
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        carId: selected.id,
        customerName,
        phone,
        email: email || null,
        pickupCity,
        returnCity,
        pickupAt: pickupAt ? pickupAt.toISOString() : new Date().toISOString(),
        returnAt: returnAt ? returnAt.toISOString() : new Date().toISOString(),
        days,
        price: total,
        notes,
        // Map selected extras to IDs if you later wire DB extras; for now none
        extras: [] as Array<{ extraId: number; qty?: number }>,
      };
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Booking failed');
      setBookingId(data.id);
      goToStep(5);
    } catch (e) {
      alert('Could not confirm booking. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // keep step in URL for real navigation behavior
  useEffect(() => {
    const s = Number(search?.get('step') || '1');
    if (Number.isFinite(s) && s !== step) {
      setStep(Math.min(5, Math.max(1, s)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function goToStep(n: number) {
    const clamped = Math.min(5, Math.max(1, n));
    setFlowError(null);
    setStep(clamped);
    router.replace(`/cart?step=${clamped}`, { scroll: false } as any);
  }

  function canContinueFromVehicle() {
    return !!selectedId;
  }

  function canContinueFromDetails() {
    return !!(selected && pickupAt && returnAt && pickupCity && returnCity && +returnAt! > +pickupAt!);
  }

  function requireDetailsOrShowError(): boolean {
    if (!canContinueFromDetails()) {
      setFlowError('Please set pick-up and return city, date, and time (return after pick-up) before continuing.');
      return false;
    }
    setFlowError(null);
    return true;
  }

  // Mobile-specific ordering: show higher-priced vehicles first on small screens
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(('matches' in e ? e.matches : (e as MediaQueryList).matches));
    handler(mq);
    mq.addEventListener?.('change', handler as any);
    return () => mq.removeEventListener?.('change', handler as any);
  }, []);

  useEffect(() => {
    function resolveLang(raw?: string | null): 'en' | 'fr' | 'ar' {
      const code = (raw || '').toLowerCase();
      if (code === 'fr' || code === 'ar') return code;
      return 'en';
    }

    function syncLang(code?: string) {
      try {
        const fromCookie = typeof document !== 'undefined'
          ? document.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith('lang='))?.split('=')[1]
          : undefined;
        const fromStorage = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null;
        const finalCode = resolveLang(code || fromCookie || fromStorage || 'en');
        setLang(finalCode);
      } catch {
        setLang('en');
      }
    }

    syncLang();

    if (typeof window !== 'undefined') {
      const handler = (ev: Event) => {
        const detail = (ev as CustomEvent<string>).detail;
        syncLang(detail);
      };
      window.addEventListener('aalikouch-lang-change', handler as EventListener);
      return () => window.removeEventListener('aalikouch-lang-change', handler as EventListener);
    }
  }, []);

  const displayedCars = useMemo(() => {
    if (!isMobile) return cars;
    return [...cars].sort((a, b) => (b.dailyPrice ?? 0) - (a.dailyPrice ?? 0));
  }, [cars, isMobile]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Steps Header */}
      <div className="premium-card p-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
          <div 
            className="h-full bg-[var(--brand)] transition-all duration-500 ease-out" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between relative">
          {[
            { n: 1, label: t.steps[0] },
            { n: 2, label: t.steps[1] },
            { n: 3, label: t.steps[2] },
            { n: 4, label: t.steps[3] },
            { n: 5, label: t.steps[4] },
          ].map((s) => (
            <div key={s.n} className="flex flex-col items-center gap-3 relative z-10">
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 ${
                step >= s.n ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-gray-50 text-gray-400 border border-gray-100'
              }`}>
                {step > s.n ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : s.n}
              </div>
              <div className={`hidden md:block text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                step >= s.n ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
        {/* Left Column: Flow Stages */}
        <div className="space-y-6 min-w-0">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.selectVehicleTitle}</h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Stage 1 of 4</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                {displayedCars.map((c) => {
                  const img = c.images?.[0]?.url;
                  const active = c.id === selectedId;
                  return (
                    <label 
                      key={c.id} 
                      className={`premium-card p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden ${
                        active ? 'ring-2 ring-[var(--brand)] shadow-2xl shadow-red-100' : 'hover:border-gray-300'
                      }`}
                    >
                      {active && (
                        <div className="absolute top-0 right-0 p-2">
                          <div className="h-6 w-6 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow-lg shadow-red-200">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative h-32 w-full md:w-56 flex items-center justify-center">
                          <div className={`absolute inset-0 rounded-3xl transition-colors duration-500 ${active ? 'bg-red-50/50' : 'bg-gray-50'}`} />
                          {img ? (
                            <Image 
                              src={img} 
                              alt={`${c.brand} ${c.model}`} 
                              fill
                              className="relative z-10 object-contain p-4 transition-transform duration-700 group-hover:scale-110 drop-shadow-xl" 
                            />
                          ) : (
                            <span className="text-gray-300 font-black text-xs uppercase tracking-widest">No Image</span>
                          )}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left space-y-4">
                          <div>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1 block">
                              {c.brand} • {c.category}
                            </span>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none group-hover:text-[var(--brand)] transition-colors">
                              {c.model}
                            </h2>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-gray-400" />
                              {c.fuel || 'Fuel'}
                            </div>
                            <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-gray-400" />
                              {c.transmission || 'Transmission'}
                            </div>
                            <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-gray-400" />
                              {c.seats || 5} {t.peopleSuffix}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-50 flex items-center justify-center md:justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-gray-900">{formatMAD(c.dailyPrice ?? 0).replace(' MAD', '')}</span>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MAD / Day</span>
                            </div>
                            <input 
                              type="radio" 
                              name="car" 
                              checked={active} 
                              onChange={()=>setSelectedId(c.id)} 
                              className="hidden" 
                            />
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-8 flex justify-end">
                <Link
                  href="/cart?step=2"
                  onClick={(e)=>{ 
                    if (!canContinueFromVehicle()) { 
                      e.preventDefault(); 
                      setFlowError(t.errorSelectVehicle); 
                      return; 
                    } 
                    setFlowError(null); 
                    goToStep(2); 
                  }}
                  className={`btn-premium btn-premium-brand min-w-[280px] ${!canContinueFromVehicle() ? 'opacity-50 grayscale' : ''}`}
                >
                  {t.continueToDetails}
                  <svg className="ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.rentalDetailsTitle}</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Stage 2 of 4</p>
              </div>

              <div className="premium-card p-8 space-y-10">
                {/* Pick-up Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                      <PinIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.pickUpDetails}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-black text-gray-900 uppercase">{pickupCity}</span>
                        {pickupFee > 0 ? (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-100">
                            +{pickupFee} MAD
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg border border-green-100">
                            {t.cityFree}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <CitySelect label={t.locationLabel} value={pickupCity} onChange={setPickupCity} freeLabel={t.cityFree} extraPrefix={t.cityExtraPrefix} />
                    <div className="grid grid-cols-2 gap-4">
                      <RedDatePicker label={t.dateLabel} value={pickupDate} onChange={setPickupDate} />
                      <TimeSelect label={t.timeLabel} value={pickupTime} onChange={setPickupTime} placeholder={t.timePlaceholder} help={t.timeHelp} />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    Route Details
                  </div>
                </div>

                {/* Return Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                      <PinIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.returnDetails}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-black text-gray-900 uppercase">{returnCity}</span>
                        {returnFee > 0 ? (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-100">
                            +{returnFee} MAD
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg border border-green-100">
                            {t.cityFree}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <CitySelect label={t.locationLabel} value={returnCity} onChange={setReturnCity} freeLabel={t.cityFree} extraPrefix={t.cityExtraPrefix} />
                    <div className="grid grid-cols-2 gap-4">
                      <RedDatePicker
                        label={t.dateLabel}
                        value={returnDate}
                        onChange={setReturnDate}
                        minDate={pickupDate ? new Date(pickupDate) : undefined}
                      />
                      <TimeSelect label={t.timeLabel} value={returnTime} onChange={setReturnTime} placeholder={t.timePlaceholder} help={t.timeHelp} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <button 
                  onClick={()=>goToStep(1)} 
                  className="btn-premium btn-premium-outline w-full md:w-auto"
                >
                  <svg className="mr-2 rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  {t.backToVehicle}
                </button>
                <Link
                  href="/cart?step=3"
                  onClick={(e)=>{ if (!requireDetailsOrShowError()) { e.preventDefault(); return; } goToStep(3); }}
                  className={`btn-premium btn-premium-brand w-full md:min-w-[280px] ${!canContinueFromDetails() ? 'opacity-50 grayscale' : ''}`}
                >
                  {t.continueToExtras}
                  <svg className="ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
              
              {flowError && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-[11px] font-black text-red-600 uppercase tracking-widest text-center animate-shake">
                  {flowError}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.extrasTitle}</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Stage 3 of 4</p>
              </div>

              <div className="space-y-4">
                {/* Active Extra: Child Seat */}
                <label className={`premium-card p-6 cursor-pointer block group transition-all duration-300 ${childSeat ? 'ring-2 ring-[var(--brand)] shadow-2xl shadow-red-100' : 'hover:border-gray-300'}`}>
                  <div className="flex items-center gap-6">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors duration-500 ${childSeat ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                      <BabySeatIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t.childSeatTitle}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-red-600">{childSeatPerDay}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MAD / Day</span>
                        </div>
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">{t.childSeatDesc}</p>
                      {childSeat && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mt-3">
                          Total: {formatMAD(childSeatTotal)}
                        </p>
                      )}
                    </div>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={childSeat} 
                        onChange={(e)=>setChildSeat(e.target.checked)} 
                        className="peer appearance-none w-6 h-6 rounded-lg border-2 border-gray-200 checked:bg-red-600 checked:border-red-600 transition-all cursor-pointer" 
                      />
                      <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </div>
                </label>

                {/* Unavailable extras */}
                {[
                  { name: 'Full Insurance', note: 'Complete protection against damage and theft', price: 125, icon: '🛡️' },
                  { name: 'GPS Navigation', note: 'Live traffic and offline maps', price: 40, icon: '🛰️' },
                  { name: 'WiFi Hotspot', note: 'High-speed internet for up to 10 devices', price: 60, icon: '📶' },
                ].map((x)=> (
                  <div key={x.name} className="premium-card p-6 opacity-50 grayscale select-none border-dashed">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl grayscale">
                        {x.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-black text-gray-400 uppercase tracking-tight">{x.name}</h3>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coming Soon</span>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{x.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <button 
                  onClick={()=>goToStep(2)} 
                  className="btn-premium btn-premium-outline w-full md:w-auto"
                >
                  <svg className="mr-2 rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  {t.backToExtras}
                </button>
                <Link
                  href="/cart?step=4"
                  onClick={(e)=>{ if (!requireDetailsOrShowError()) { e.preventDefault(); return; } goToStep(4); }}
                  className="btn-premium btn-premium-brand w-full md:min-w-[280px]"
                >
                  {t.paymentTitle}
                  <svg className="ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Payment & Contact</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Stage 4 of 4</p>
              </div>

              <div className="premium-card p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input value={customerName} onChange={(e)=>setCustomerName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                      <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+212 ..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address (Optional)</label>
                      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment Method</h3>
                  <label className={`block p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer ${
                    paymentMethod === 'cod' ? 'border-[var(--brand)] bg-red-50/30' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="relative flex items-center justify-center mt-1">
                        <input type="radio" checked={paymentMethod==='cod'} onChange={()=>setPaymentMethod('cod')} className="peer appearance-none w-6 h-6 rounded-full border-2 border-gray-200 checked:border-[var(--brand)] transition-all" />
                        <div className="absolute w-3 h-3 rounded-full bg-[var(--brand)] opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-gray-900 uppercase tracking-tight">Cash on Delivery</div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">Pay when you pick up your vehicle. No credit card required now.</p>
                      </div>
                      <div className="text-2xl">💵</div>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Special Notes</label>
                  <textarea 
                    value={notes} 
                    onChange={(e)=>setNotes(e.target.value)} 
                    placeholder="Any special requests or instructions..." 
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <button 
                  onClick={()=>goToStep(3)} 
                  className="btn-premium btn-premium-outline w-full md:w-auto"
                >
                  <svg className="mr-2 rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  {t.backToExtras}
                </button>
                <button 
                  type="button" 
                  onClick={confirmBooking} 
                  disabled={submitting}
                  className={`btn-premium btn-premium-brand w-full md:min-w-[320px] ${submitting ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Finalizing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Confirm Booking
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 text-center py-12">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-green-500 text-white flex items-center justify-center shadow-2xl shadow-green-200 animate-reveal-up">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight leading-none">Booking Confirmed!</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm max-w-md mx-auto">
                  Your reservation #{bookingId} has been successfully received. A confirmation email has been sent.
                </p>
              </div>
              <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  type="button" 
                  onClick={downloadReceipt} 
                  className="btn-premium btn-premium-outline min-w-[240px]"
                >
                  <DownloadIcon className="mr-2" /> 
                  Download Receipt
                </button>
                <Link 
                  href="/" 
                  className="btn-premium btn-premium-brand min-w-[240px]"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Floating Reservation Summary */}
        <aside className="sticky top-24 space-y-6">
          <div className="premium-card p-8 bg-gray-900 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <ReceiptIcon className="text-red-500" />
                {t.reservationSummaryTitle}
              </h2>

              <div className="space-y-6">
                {/* Vehicle Mini Card */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{t.selectedVehicleTitle}</h3>
                  {selected ? (
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-20 bg-white/10 rounded-xl p-2 flex items-center justify-center relative">
                        {selected.images?.[0]?.url && (
                          <Image 
                            src={selected.images[0].url!} 
                            alt="car" 
                            fill
                            className="object-contain p-1" 
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase tracking-tight">{selected.brand} {selected.model}</div>
                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">{formatMAD(selected.dailyPrice ?? 0)} / Day</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-gray-500 uppercase">No vehicle selected</div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1"><PinIcon className="text-red-500 h-4 w-4" /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.reservationPickUpLabel}</p>
                        <p className="text-xs font-bold mt-0.5">{pickupCity}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{pickupAt ? pickupAt.toLocaleString() : 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1"><PinIcon className="text-red-500 h-4 w-4" /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.reservationDropOffLabel}</p>
                        <p className="text-xs font-bold mt-0.5">{returnCity}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{returnAt ? returnAt.toLocaleString() : 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-gray-400">Vehicle ({days} {t.daySuffix})</span>
                      <span>{formatMAD(vehicleCost)}</span>
                    </div>
                    {(pickupFee > 0 || returnFee > 0 || childSeat) && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Additional Services</div>
                        {pickupFee > 0 && (
                          <div className="flex justify-between text-[10px] font-bold pl-2 border-l border-white/10">
                            <span className="text-gray-400">Shipping Pickup</span>
                            <span>{formatMAD(pickupFee)}</span>
                          </div>
                        )}
                        {returnFee > 0 && (
                          <div className="flex justify-between text-[10px] font-bold pl-2 border-l border-white/10">
                            <span className="text-gray-400">Shipping Return</span>
                            <span>{formatMAD(returnFee)}</span>
                          </div>
                        )}
                        {childSeat && (
                          <div className="flex justify-between text-[10px] font-bold pl-2 border-l border-white/10">
                            <span className="text-gray-400">{t.childSeatTitle}</span>
                            <span>{formatMAD(childSeatTotal)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">{t.reservationTotalAmount}</p>
                      <p className="text-3xl font-black tracking-tight leading-none">{formatMAD(total)}</p>
                    </div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Inc. VAT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Box */}
          <div className="premium-card p-6 bg-gray-50 border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-gray-900 shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Need Help?</h4>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Contact us via WhatsApp for assistance.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
