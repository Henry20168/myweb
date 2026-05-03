/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cars = [
    // Approximated realistic specs for current fleet (can be edited later in Admin)
    { brand: 'Fiat', model: '500 Cabriolet', year: 2023, category: 'Convertible', transmission: 'Automatic', fuel: 'Petrol', seats: 4, doors: 2, luggageCapacity: 185, horsepower: 70, engine: '1.0L 3cyl', mileagePolicy: '200 km/day included', fuelPolicy: 'Return as received', minRentalDays: 1, rating: 4.5, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 350, description: '', status: 'available', imageUrl: 'https://finecars.am/assets/images/fc/fc90b8_white.png' },
    { brand: 'Hyundai', model: 'Accent', year: 2023, category: 'Sedan', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 4, luggageCapacity: 387, horsepower: 128, engine: '1.6L 4cyl', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.6, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 300, description: '', status: 'available', imageUrl: 'https://www.hyundai.com/content/dam/hyundai/ma/fr/data/vehicle-thumbnail/product/the-all-new-accent/small/Accent-320x172.png' },
    { brand: 'Hyundai', model: 'Accent', year: 2025, category: 'Sedan', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 4, luggageCapacity: 402, horsepower: 120, engine: '1.5L 4cyl', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.7, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 300, description: '', status: 'available', imageUrl: 'https://assets.invygo.com/car-images%2F4f593bf3-4c8e-49cd-a7ed-e55bb41a2c3e_Untitled-4.png' },
    { brand: 'Mercedes', model: 'Classe A Pack AMG', year: 2022, category: 'Hatchback', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 370, horsepower: 150, engine: '2.0L 4cyl', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.8, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 1000, description: '', status: 'available', imageUrl: 'https://images.unsplash.com/photo-1598553259424-4a4f89d9804c?auto=format&fit=crop&q=80&w=800' },
    { brand: 'Volkswagen', model: 'Touareg Executive', year: 2025, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 810, horsepower: 286, engine: '3.0L V6 TDI', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.8, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 1400, description: '', status: 'available', imageUrl: 'https://maroccarrental.com/wp-content/uploads/2024/03/location-vw-touareg-casablanca.png.webp' },
    { brand: 'Volkswagen', model: 'Touareg Élégance', year: 2025, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 810, horsepower: 231, engine: '3.0L V6 TDI', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.7, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 1000, description: '', status: 'available', imageUrl: 'https://www.luxecar24.com/wp-content/uploads/2024/02/location-vw-touareg.png' },
    { brand: 'Hyundai', model: 'Tucson Full Options', year: 2022, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 620, horsepower: 180, engine: '1.6L Turbo', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.6, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 600, description: '', status: 'available', imageUrl: 'https://s7d1.scene7.com/is/image/hyundai/2026-tucson-sel-fwd-rockwood-green-vehicle-browse-hero:Browse?fmt=webp-alpha' },
    { brand: 'Hyundai', model: 'Tucson Prestige', year: 2021, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 620, horsepower: 150, engine: '1.6L Turbo', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.5, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 500, description: '', status: 'available', imageUrl: 'https://s7d1.scene7.com/is/image/hyundai/2026-tucson-hybrid-sel-awd-creamy-white-vehicle-browse-hero:Browse?fmt=webp-alpha' },
    { brand: 'Porsche', model: 'Macan', year: 2025, category: 'Luxury', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, luggageCapacity: 488, horsepower: 261, engine: '2.0L Turbo', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.9, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 2500, description: '', status: 'available', imageUrl: 'https://mkt-vehicleimages-prd.autotradercdn.ca/photos/chrome/Expanded/White/2025PRS031901809/2025PRS03190180901.jpg' },
    { brand: 'Land Rover', model: 'Sport', year: 2025, category: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 647, horsepower: 300, engine: '3.0L I6 MHEV', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.8, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 3500, description: '', status: 'available', imageUrl: 'https://media.chromedata.com/MediaGallery/media/MjkzOTU4Xk1lZGlhIEdhbGxlcnk/MVVH3oZBnb2R6JghcloNxJz5o9hlOVQoUrSr350joqFofjQnKFOa6xDHONXyAO1C8iS3D8WLAywX-S5IipG6IJbDhYGWA-ACuIhXLBhPmVGay-MpDE-O54acWre04ZaRk_aZQvCzmtKwy64e16tGT1W9CYSmTy6nOSOvAc-JRV72xBUL6SJJMg/cc_2025LRS072003848_01_640_1AG.png' },
    { brand: 'Peugeot', model: '208 Hybrid', year: 2025, category: 'Hatchback', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, doors: 5, luggageCapacity: 265, horsepower: 136, engine: '1.2L Hybrid', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.6, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 450, description: '', status: 'available', imageUrl: 'https://www.espagnauto.com/images/NEWW_208_ALLURE.png' },
    { brand: 'Dacia', model: 'Duster', year: 2024, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 411, horsepower: 110, engine: '1.5L dCi', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.3, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: false, cruiseControl: true, dailyPrice: 300, description: '', status: 'available', imageUrl: 'https://dacia.gslmotors.com/wp-content/uploads/sites/71/2025/02/all-new-duster-ESSENTIAL_ECO-G_100.png' },
    { brand: 'Mercedes', model: 'Classe G 63', year: 2023, category: 'Luxury', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, luggageCapacity: 667, horsepower: 577, engine: '4.0L V8 Biturbo', mileagePolicy: '150 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.9, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 9000, description: '', status: 'available', imageUrl: 'https://scalethumb.leparking.fr/unsafe/331x248/smart/https://cloud.leparking.fr/2023/08/13/03/42/mercedes-g-class-2023-mercedes-benz-amg-g-63-4matic-black_8871899304.jpg' },
    { brand: 'Dacia', model: 'Logan', year: 2022, category: 'Sedan', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 4, luggageCapacity: 510, horsepower: 90, engine: '1.5L dCi', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.2, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 300, description: '', status: 'available', imageUrl: 'https://chamaluxury.com/_next/image?url=%2Fuploads%2FDacia_Logan_2025_ad65a9ff04.png&w=1920&q=90' },
    { brand: 'Hyundai', model: 'Santa Fe 7 places Full Options', year: 2022, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 7, doors: 5, luggageCapacity: 571, horsepower: 191, engine: '2.2L CRDi', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.6, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 800, description: '', status: 'available', imageUrl: 'https://kifalstorage.s3.amazonaws.com/new/img/hyundai/santafe/principal.png' },
    { brand: 'Renault', model: 'Express', year: 2023, category: 'Van', transmission: 'Manual', fuel: 'Diesel', seats: 2, doors: 4, luggageCapacity: 3000, horsepower: 95, engine: '1.5L dCi', mileagePolicy: '200 km/day included', fuelPolicy: 'Return as received', minRentalDays: 1, rating: 4.1, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 300, description: '', status: 'available', imageUrl: 'https://locationdevoituresmarrakech.com/images/produits/jpye76nexoif.png' },
    { brand: 'Ford', model: 'Transit', year: 2021, category: 'Van', transmission: 'Manual', fuel: 'Diesel', seats: 3, doors: 4, luggageCapacity: 3500, horsepower: 130, engine: '2.0L EcoBlue', mileagePolicy: '200 km/day included', fuelPolicy: 'Return as received', minRentalDays: 1, rating: 4.2, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: false, cruiseControl: true, dailyPrice: 500, description: '', status: 'available', imageUrl: 'https://d2qldpouxvc097.cloudfront.net/image-by-path?bucket=a5-gallery-serverless-prod-chromebucket-1iz9ffi08lwxm&key=448277/front34/lg/e7e7e7' },
    { brand: 'Audi', model: 'A3 Sport', year: 2022, category: 'Hatchback', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 380, horsepower: 150, engine: '2.0L TDI', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.7, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 800, description: '', status: 'available', imageUrl: 'https://www.espagnauto.com/images/NEW_A3_SLINE.png' },
    { brand: 'Renault', model: 'Clio', year: 2023, category: 'Hatchback', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 391, horsepower: 100, engine: '1.5L dCi', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.4, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: true, dailyPrice: 300, description: '', status: 'available', imageUrl: 'https://notfycarent.ma/storage/cars/November2022/yzdoorWaFUKOi6I5Re9M.png' },
    { brand: 'Peugeot', model: '208', year: 2021, category: 'Hatchback', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 311, horsepower: 100, engine: '1.5L BlueHDi', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.3, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: true, dailyPrice: 300, description: '', status: 'available', imageUrl: 'https://images.unsplash.com/photo-1630136511116-2434526d1105?auto=format&fit=crop&q=80&w=800' },
    { brand: 'Mercedes', model: 'Classe E', year: 2025, category: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 4, luggageCapacity: 540, horsepower: 204, engine: '2.0L Diesel', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.8, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 1400, description: '', status: 'available', imageUrl: 'https://images.unsplash.com/photo-1621932953986-15fcf084da0f?auto=format&fit=crop&q=80&w=800' },

    // New models requested
    // Kia Sportage 2025 Diesel (approximate realistic specs based on public info)
    { brand: 'Kia', model: 'Sportage', year: 2025, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 540, horsepower: 183, engine: '2.0L CRDi', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.6, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 600, description: '', status: 'available', imageUrl: 'https://images.unsplash.com/photo-1623162386121-50e569996b79?auto=format&fit=crop&q=80&w=800' },

    // Hyundai i10 2025 essence (petrol) – city hatchback
    { brand: 'Hyundai', model: 'i10', year: 2025, category: 'Hatchback', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, luggageCapacity: 252, horsepower: 84, engine: '1.2L Petrol', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.3, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 250, description: '', status: 'available', imageUrl: 'https://s3-eu-west-1.amazonaws.com/photo-ref-carboatmedia-fr/SFlVTkRBSQ==/STEw/53f003323f282368e0b90996e3ba7463/MQ==/6ff34b41052eede87a5fae48610cafa5.png' },

    // Kia Picanto 2025 essence (petrol) – small city hatchback
    { brand: 'Kia', model: 'Picanto', year: 2025, category: 'Hatchback', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, luggageCapacity: 255, horsepower: 84, engine: '1.2L Petrol', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.2, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 250, description: '', status: 'available', imageUrl: 'https://carprices.ae/uploads/2024_KIA_Picanto_banner_4d5b2a34fd.png' },

    // Dacia Jogger 2024 – 7-seater family car
    { brand: 'Dacia', model: 'Jogger', year: 2024, category: 'Wagon', transmission: 'Manual', fuel: 'Petrol', seats: 7, doors: 5, luggageCapacity: 181, horsepower: 90, engine: '1.0L TCe', mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.3, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 450, description: '', status: 'available', imageUrl: 'https://images.unsplash.com/photo-1640191660242-46639d679093?auto=format&fit=crop&q=80&w=800' },
    { brand: 'Ford', model: 'Tourneo', year: 2024, category: 'Van', transmission: 'Manual', fuel: 'Diesel', seats: 9, doors: 5, luggageCapacity: 850, horsepower: 130, engine: '2.0L TDCi', mileagePolicy: '300 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.4, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 1000, description: '', status: 'available', imageUrl: 'https://image.elite-auto.fr/visuel/FORD/ford_24tourneocustmtitml2h1awdvp2bfr_angularfront.png' },
    { brand: 'Kia', model: 'Picanto', year: 2024, category: 'Hatchback', transmission: 'Manual', fuel: 'Petrol', seats: 5, doors: 5, luggageCapacity: 255, horsepower: 84, engine: '1.2L Petrol', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.1, gps: false, bluetooth: true, ac: true, usb: true, parkingSensors: false, rearCamera: false, cruiseControl: false, dailyPrice: 180, description: '', status: 'available', imageUrl: 'https://images.unsplash.com/photo-1621285853634-713b1464c143?auto=format&fit=crop&q=80&w=800' },
    { brand: 'Audi', model: 'Q8', year: 2024, category: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, luggageCapacity: 605, horsepower: 231, engine: '3.0L V6 TDI', mileagePolicy: '200 km/day included', fuelPolicy: 'Full to full', minRentalDays: 2, rating: 4.9, gps: true, bluetooth: true, ac: true, usb: true, parkingSensors: true, rearCamera: true, cruiseControl: true, dailyPrice: 2000, description: '', status: 'available', imageUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800' },
  ];

  const motorcycles = [
    
    { brand: 'Honda', model: 'XADV 750', year: 2024, category: 'Adventure', transmission: 'Manual', fuel: 'Petrol', engine: 'Parallel Twin', engineCC: 745, horsepower: 58, mileagePolicy: '300 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.6, abs: true, bluetooth: true, usb: true, tractionControl: false, cruiseControl: false, heatedGrips: false, luggageCapacity: 25, dailyPrice: 800, description: '', status: 'available', imageUrl: 'https://inwfile.com/s-fz/q8wd1g.png' },

    // Yamaha Tmax 560 2024 – maxi scooter
    { brand: 'Yamaha', model: 'TMAX 560', year: 2024, category: 'Scooter', transmission: 'Automatic', fuel: 'Petrol', engine: 'Parallel Twin', engineCC: 562, horsepower: 47, mileagePolicy: '250 km/day included', fuelPolicy: 'Full to full', minRentalDays: 1, rating: 4.5, abs: true, bluetooth: true, usb: true, tractionControl: false, cruiseControl: false, heatedGrips: false, luggageCapacity: 40, dailyPrice: 800, description: '', status: 'available', imageUrl: 'https://media.motoservices.com/media/cache/vehicle_detail/media/vehicle/2320/yamaha-tmax-560.png' },

      ];

  // clear existing for idempotent seeding (dev only)
  await prisma.motorcycleBookingExtra.deleteMany();
  await prisma.motorcycleBooking.deleteMany();
  await prisma.motorcycleImage.deleteMany();
  await prisma.motorcycle.deleteMany();
  await prisma.bookingExtra.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();

  // Seed cars
  for (const c of cars) {
    const created = await prisma.car.create({
      data: {
        brand: c.brand,
        model: c.model,
        year: c.year,
        category: c.category,
        transmission: c.transmission,
        fuel: c.fuel,
        seats: c.seats,
        doors: c.doors ?? null,
        luggageCapacity: c.luggageCapacity ?? null,
        horsepower: c.horsepower ?? null,
        engine: c.engine ?? null,
        mileagePolicy: c.mileagePolicy ?? null,
        fuelPolicy: c.fuelPolicy ?? null,
        minRentalDays: c.minRentalDays ?? 1,
        rating: c.rating ?? 0,
        gps: !!c.gps,
        bluetooth: !!c.bluetooth,
        ac: !!c.ac,
        usb: !!c.usb,
        parkingSensors: !!c.parkingSensors,
        rearCamera: !!c.rearCamera,
        cruiseControl: !!c.cruiseControl,
        dailyPrice: c.dailyPrice,
        description: c.description,
        status: c.status,
      }
    });
    if (c.imageUrl) {
      await prisma.carImage.create({ data: { carId: created.id, url: c.imageUrl, isPrimary: true } });
    }
  }

  // Seed motorcycles
  for (const m of motorcycles) {
    const created = await prisma.motorcycle.create({
      data: {
        brand: m.brand,
        model: m.model,
        year: m.year,
        category: m.category,
        transmission: m.transmission,
        fuel: m.fuel,
        engine: m.engine ?? null,
        engineCC: m.engineCC ?? null,
        horsepower: m.horsepower ?? null,
        mileagePolicy: m.mileagePolicy ?? null,
        fuelPolicy: m.fuelPolicy ?? null,
        minRentalDays: m.minRentalDays ?? 1,
        rating: m.rating ?? 0,
        abs: !!m.abs,
        bluetooth: !!m.bluetooth,
        usb: !!m.usb,
        tractionControl: !!m.tractionControl,
        cruiseControl: !!m.cruiseControl,
        heatedGrips: !!m.heatedGrips,
        luggageCapacity: m.luggageCapacity ?? null,
        dailyPrice: m.dailyPrice,
        description: m.description,
        status: m.status,
      }
    });
    if (m.imageUrl) {
      await prisma.motorcycleImage.create({ data: { motorcycleId: created.id, url: m.imageUrl, isPrimary: true } });
    }
  }
}

main()
  .then(async () => { await prisma.$disconnect(); console.log('Seeded'); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
