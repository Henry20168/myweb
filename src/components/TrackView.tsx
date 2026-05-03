"use client";

import { useEffect } from "react";

interface RecentVehicle {
  id: number;
  brand: string;
  model: string;
  image?: string;
  price: number;
  type: 'car' | 'motorcycle';
}

export default function TrackView({ vehicle }: { vehicle: RecentVehicle }) {
  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    let list: RecentVehicle[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {
        list = [];
      }
    }

    // Remove if already exists (to move to top)
    list = list.filter(v => !(v.id === vehicle.id && v.type === vehicle.type));
    
    // Add to top
    list.unshift(vehicle);
    
    // Keep only last 10
    list = list.slice(0, 10);
    
    localStorage.setItem("recentlyViewed", JSON.stringify(list));
  }, [vehicle]);

  return null;
}
