"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface CategoryLinkProps {
  href: string;
  className: string;
  children: ReactNode;
}

export default function CategoryLink({ href, className, children }: CategoryLinkProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      suppressHydrationWarning
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
