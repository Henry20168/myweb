/*
  Warnings:

  - You are about to drop the column `currentCity` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `flightNumber` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `idNumber` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `idType` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `renterAddress` on the `Booking` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Motorcycle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "category" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "engine" TEXT,
    "engineCC" INTEGER,
    "horsepower" INTEGER,
    "mileagePolicy" TEXT,
    "fuelPolicy" TEXT,
    "minRentalDays" INTEGER DEFAULT 1,
    "rating" REAL DEFAULT 0,
    "abs" BOOLEAN NOT NULL DEFAULT false,
    "bluetooth" BOOLEAN NOT NULL DEFAULT false,
    "usb" BOOLEAN NOT NULL DEFAULT false,
    "tractionControl" BOOLEAN NOT NULL DEFAULT false,
    "cruiseControl" BOOLEAN NOT NULL DEFAULT false,
    "heatedGrips" BOOLEAN NOT NULL DEFAULT false,
    "luggageCapacity" INTEGER,
    "dailyPrice" INTEGER NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "offerDiscountPercent" INTEGER,
    "offerExpiresAt" DATETIME,
    "offerImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MotorcycleImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "motorcycleId" INTEGER NOT NULL,
    CONSTRAINT "MotorcycleImage_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MotorcycleBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "motorcycleId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "pickupCity" TEXT NOT NULL,
    "returnCity" TEXT NOT NULL,
    "pickupAt" DATETIME NOT NULL,
    "returnAt" DATETIME NOT NULL,
    "days" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "internalNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MotorcycleBooking_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MotorcycleBookingExtra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "extraId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "MotorcycleBookingExtra_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "MotorcycleBooking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MotorcycleBookingExtra_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "address" TEXT,
    "nationality" TEXT,
    "idType" TEXT,
    "idNumber" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "internalNotes" TEXT
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstVisitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVisitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitsCount" INTEGER NOT NULL DEFAULT 1,
    "city" TEXT,
    "country" TEXT,
    "deviceType" TEXT,
    "lastPath" TEXT
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'agent',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "dueDate" DATETIME,
    "assignedToId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "carId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "pickupCity" TEXT NOT NULL,
    "returnCity" TEXT NOT NULL,
    "pickupAt" DATETIME NOT NULL,
    "returnAt" DATETIME NOT NULL,
    "days" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "internalNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("carId", "createdAt", "customerName", "days", "email", "id", "notes", "phone", "pickupAt", "pickupCity", "price", "returnAt", "returnCity", "status") SELECT "carId", "createdAt", "customerName", "days", "email", "id", "notes", "phone", "pickupAt", "pickupCity", "price", "returnAt", "returnCity", "status" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
