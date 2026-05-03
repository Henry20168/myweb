"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterHeroProps {
  words: string[];
}

export default function TypewriterHero({ words }: TypewriterHeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span className="relative inline-flex align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      {/* Invisible spacer to maintain width of the longest word if needed, 
          but for simple "wait" mode we just let it be inline. 
          Actually, since it's absolute in many implementations, 
          let's just make it relative and use AnimatePresence properly. */}
    </span>
  );
}
