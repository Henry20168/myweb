"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOCATIONS = ["Casablanca", "Rabat", "Marrakech", "Tangier", "Agadir"];
const CARS = ["Range Rover", "Mercedes G-Class", "VW Touareg", "Hyundai Tucson", "BMW X5"];

export default function LiveBookingNotification() {
  const [notification, setNotification] = useState<{ car: string; location: string } | null>(null);

  useEffect(() => {
    const showNotification = () => {
      const randomCar = CARS[Math.floor(Math.random() * CARS.length)];
      const randomLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      setNotification({ car: randomCar, location: randomLocation });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    };

    // Initial delay
    const initialTimer = setTimeout(showNotification, 10000);
    
    // Repeat interval
    const interval = setInterval(showNotification, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 24, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-24 left-0 z-[150] hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-gray-100 ring-1 ring-black/5"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Recent Booking!</div>
            <div className="text-[10px] text-gray-500">
              Someone just booked a <span className="font-bold text-red-600">{notification.car}</span> in {notification.location}
            </div>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-300 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
