"use client";

import { useEffect, useState } from "react";
import CarCard, { Car } from "./CarCard";
import { CarCardSkeleton } from "./Skeleton";

export default function RecommendedCars({ title = "Recommended for You" }: { title?: string }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const saved = localStorage.getItem("recentlyViewed");
    let ids = "";
    if (saved) {
      try {
        const recent = JSON.parse(saved);
        ids = recent.map((r: { id: number }) => r.id).join(",");
      } catch {}
    }

    fetch(`/api/recommendations?ids=${ids}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (!loading && cars.length === 0) return null;

  return (
    <section className="space-y-6" suppressHydrationWarning>
      <div className="flex items-center justify-between" suppressHydrationWarning>
        <h2 className="text-2xl font-bold text-gray-900" suppressHydrationWarning>{title}</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" suppressHydrationWarning>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CarCardSkeleton key={i} />)
          : cars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </section>
  );
}
