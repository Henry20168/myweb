export interface VehicleImage {
  url: string;
  isPrimary?: boolean;
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year?: number;
  category: string;
  transmission: string;
  fuel: string;
  dailyPrice: number;
  description: string;
  status: string;
  images: VehicleImage[];
  imageUrl?: string;
  offerDiscountPercent?: number | null;
  offerExpiresAt?: string | null;
  offerImageUrl?: string | null;
  // Car specific
  seats?: number | null;
  doors?: number | null;
  luggageCapacity?: number | null;
  horsepower?: number | null;
  engine?: string;
  mileagePolicy?: string;
  fuelPolicy?: string;
  minRentalDays?: number;
  gps?: boolean;
  bluetooth?: boolean;
  ac?: boolean;
  usb?: boolean;
  parkingSensors?: boolean;
  rearCamera?: boolean;
  cruiseControl?: boolean;
  // Motorcycle specific
  engineCC?: number | null;
}

export interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  subject?: string;
  body: string;
  status: string;
  createdAt: string | Date;
}

export interface Client {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  notes?: string;
  status: 'active' | 'vip' | 'blocked';
}

export interface Extra {
  id: number;
  name: string;
}

export interface BookingExtra {
  extra: Extra;
  qty: number;
}

export interface Booking {
  id: number;
  vehicleType: 'car' | 'motorcycle';
  customerName: string;
  phone: string;
  email: string | null;
  pickupCity: string;
  returnCity: string;
  pickupAt: string | Date;
  returnAt: string | Date;
  days: number;
  price: number;
  status: string;
  notes: string | null;
  carId?: number | null;
  motorcycleId?: number | null;
  car?: Vehicle;
  motorcycle?: Vehicle;
  vehicle?: Vehicle;
  extras?: BookingExtra[];
}

export interface AdminStats {
  counts: {
    cars: number;
    motorcycles: number;
    bookings: number;
    messages: number;
  };
  latestBookings: Booking[];
  categories: Array<{ category: string; _count: { id: number } }>;
  brands: Array<{ brand: string; _count: { id: number } }>;
}

export type AdminTab = 'analytics' | 'manage' | 'bookings' | 'support' | 'add' | 'add-motorcycle' | 'offers' | 'clients' | 'tasks';
