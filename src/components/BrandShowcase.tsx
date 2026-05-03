"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const BRANDS = [
  { name: "Mercedes-Benz", logo: "https://logos-world.net/wp-content/uploads/2020/05/Mercedes-Benz-Logo.png" },
  { name: "BMW", logo: "https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png" },
  { name: "Range Rover", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/LandRover.svg/3840px-LandRover.svg.png" },
  { name: "Toyota", logo: "https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png" },
  { name: "Volkswagen", logo: "https://logos-world.net/wp-content/uploads/2021/03/Volkswagen-Logo.png" },
  { name: "Hyundai", logo: "https://logos-world.net/wp-content/uploads/2021/03/Hyundai-Logo.png" },
  { name: "Dacia", logo: "https://logos-world.net/wp-content/uploads/2021/03/Dacia-Logo.png" },
  { name: "Peugeot", logo: "https://logos-world.net/wp-content/uploads/2021/03/Peugeot-Logo.png" },
  { name: "Renault", logo: "https://logos-world.net/wp-content/uploads/2021/03/Renault-Logo.png" },
  { name: "Audi", logo: "https://logos-world.net/wp-content/uploads/2021/03/Audi-Logo.png" },
  { name: "Kia", logo: "https://logos-world.net/wp-content/uploads/2021/03/Kia-Logo.png" },
  { name: "Ford", logo: "https://logos-world.net/wp-content/uploads/2021/03/Ford-Logo.png" },
];

export default function BrandShowcase({ dict }: { dict: string }) {
  if (!dict) return null;

  return (
    <section className="py-12 border-y border-gray-100 overflow-hidden">
      <div className="flex flex-col space-y-8">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{dict}</p>
        </div>
        
        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-16 items-center flex-nowrap"
          >
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={100}
                  height={32}
                  unoptimized
                  className="h-8 w-auto object-contain"
                />
                <span className="font-bold text-gray-400 text-sm whitespace-nowrap">{brand.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
