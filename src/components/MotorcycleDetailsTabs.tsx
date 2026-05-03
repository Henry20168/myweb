"use client";

import { useState, useEffect } from "react";
import { IconBadge, BrandIcon, ModelIcon, CategoryIcon, GearIcon, FuelIcon, CalendarIcon, TagIcon, BoltIcon, MotorcycleIcon } from "@/components/Icons";
import { formatMAD } from "@/lib/util";

interface MotorcycleDetailsTabsProps {
  motorcycle: {
    brand: string;
    model: string;
    year?: number | null;
    category: string;
    transmission: string;
    fuel: string;
    engineCC?: number | null;
    horsepower?: number | null;
    luggageCapacity?: number | null;
    dailyPrice: number;
    status: string;
    abs: boolean;
    bluetooth: boolean;
    usb: boolean;
    tractionControl: boolean;
    cruiseControl: boolean;
    heatedGrips: boolean;
    description?: string | null;
  };
  labels: {
    specsTitle: string;
    brand: string;
    model: string;
    category: string;
    transmission: string;
    fuel: string;
    year: string;
    dailyPrice: string;
    status: string;
    statusAvailable: string;
    noDescription: string;
  };
}

export default function MotorcycleDetailsTabs({ motorcycle, labels }: MotorcycleDetailsTabsProps) {
  const [tab, setTab] = useState<"details" | "features">("details");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const desc = motorcycle.description || labels.noDescription || "No description provided yet.";

  const featureItems: { key: keyof MotorcycleDetailsTabsProps["motorcycle"]; label: string }[] = [
    { key: "abs", label: "ABS" },
    { key: "bluetooth", label: "Bluetooth" },
    { key: "usb", label: "USB Port" },
    { key: "tractionControl", label: "Traction Control" },
    { key: "cruiseControl", label: "Cruise Control" },
    { key: "heatedGrips", label: "Heated Grips" },
  ];

  const activeFeatures = featureItems.filter((f) => motorcycle[f.key] === true);

  return (
    <div>
      <div className="flex border-b border-gray-200 text-sm">
        <button
          type="button"
          onClick={() => setTab("details")}
          className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
            tab === "details"
              ? "border-[var(--brand)] text-gray-900 font-medium"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => setTab("features")}
          className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
            tab === "features"
              ? "border-[var(--brand)] text-gray-900 font-medium"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Features
        </button>
      </div>

      {tab === "details" && (
        <div className="pt-4">
          <div className="font-semibold mb-2">{labels.specsTitle}</div>
          <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
              <IconBadge color="#ecfeff"><ModelIcon/></IconBadge>
              <div className="text-gray-700">
                <span className="text-gray-600 block text-xs">{labels.model}</span>
                <span className="text-gray-900">{motorcycle.model}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
              <IconBadge color="#eef2ff"><BrandIcon/></IconBadge>
              <div className="text-gray-700">
                <span className="text-gray-600 block text-xs">{labels.brand}</span>
                <span className="text-gray-900">{motorcycle.brand}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
              <IconBadge color="#f5f3ff"><CategoryIcon/></IconBadge>
              <div className="text-gray-700">
                <span className="text-gray-600 block text-xs">{labels.category}</span>
                <span className="text-gray-900">{motorcycle.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
              <IconBadge color="#fff7ed"><GearIcon/></IconBadge>
              <div className="text-gray-700">
                <span className="text-gray-600 block text-xs">{labels.transmission}</span>
                <span className="text-gray-900">{motorcycle.transmission}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
              <IconBadge color="#dcfce7"><FuelIcon/></IconBadge>
              <div className="text-gray-700">
                <span className="text-gray-600 block text-xs">{labels.fuel}</span>
                <span className="text-gray-900">{motorcycle.fuel}</span>
              </div>
            </div>
            {motorcycle.engineCC != null && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
                <IconBadge color="#fef2f2"><MotorcycleIcon/></IconBadge>
                <div className="text-gray-700">
                  <span className="text-gray-600 block text-xs">Engine</span>
                  <span className="text-gray-900">{motorcycle.engineCC}cc</span>
                </div>
              </div>
            )}
            {motorcycle.year != null && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
                <IconBadge color="#e0f2fe"><CalendarIcon/></IconBadge>
                <div className="text-gray-700">
                  <span className="text-gray-600 block text-xs">{labels.year}</span>
                  <span className="text-gray-900">{motorcycle.year}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
              <IconBadge color="#fee2e2"><TagIcon/></IconBadge>
              <div className="text-gray-700">
                <span className="text-gray-600 block text-xs">{labels.dailyPrice}</span>
                {mounted ? (
                  <span className="text-gray-900">
                    {formatMAD(motorcycle.dailyPrice)}
                  </span>
                ) : (
                  <span className="text-gray-900">
                    {motorcycle.dailyPrice} MAD
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 ring-1 ring-gray-200">
              <IconBadge color="#f1f5f9"><BoltIcon/></IconBadge>
              <div className="text-gray-700">
                <span className="text-gray-600 block text-xs">{labels.status}</span>
                <span className="text-gray-900">{motorcycle.status || labels.statusAvailable}</span>
              </div>
            </div>
          </div>
          <div className="mt-5 text-gray-700 text-sm leading-relaxed">
            {desc}
          </div>
        </div>
      )}

      {tab === "features" && (
        <div className="pt-4">
          <div className="font-semibold mb-2">Features</div>
          {activeFeatures.length === 0 ? (
            <div className="text-sm text-gray-500">No special features registered for this motorcycle.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {activeFeatures.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                >
                  <span className="text-gray-800">{f.label}</span>
                  <span className="text-xs font-semibold rounded-full bg-green-100 text-green-700 px-2 py-0.5">
                    Included
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
