-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "category" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "seats" INTEGER,
    "doors" INTEGER,
    "luggageCapacity" INTEGER,
    "horsepower" INTEGER,
    "engine" TEXT,
    "mileagePolicy" TEXT,
    "fuelPolicy" TEXT,
    "minRentalDays" INTEGER DEFAULT 1,
    "rating" REAL DEFAULT 0,
    "gps" BOOLEAN NOT NULL DEFAULT false,
    "bluetooth" BOOLEAN NOT NULL DEFAULT false,
    "ac" BOOLEAN NOT NULL DEFAULT false,
    "usb" BOOLEAN NOT NULL DEFAULT false,
    "parkingSensors" BOOLEAN NOT NULL DEFAULT false,
    "rearCamera" BOOLEAN NOT NULL DEFAULT false,
    "cruiseControl" BOOLEAN NOT NULL DEFAULT false,
    "dailyPrice" INTEGER NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "offerDiscountPercent" INTEGER,
    "offerExpiresAt" DATETIME,
    "offerImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Car" ("brand", "category", "createdAt", "dailyPrice", "description", "fuel", "id", "model", "offerDiscountPercent", "offerExpiresAt", "offerImageUrl", "seats", "status", "transmission", "updatedAt", "year") SELECT "brand", "category", "createdAt", "dailyPrice", "description", "fuel", "id", "model", "offerDiscountPercent", "offerExpiresAt", "offerImageUrl", "seats", "status", "transmission", "updatedAt", "year" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
