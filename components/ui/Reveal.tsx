'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const TAG = {
  div: motion.div,
  li: motion.li,
  aside: motion.aside,
  article: motion.article,
  form: motion.form,
} as const;

interface RevealProps {
  children: ReactNode;
  as?: keyof typeof TAG;
  className?: string;
  delay?: number;
  y?: number;
  id?: string;
}

/** Memunculkan isi dengan naik-pudar halus saat masuk layar (sekali saja) */
export function Reveal({ children, as = 'div', className, delay = 0, y = 28, id }: RevealProps) {
  const diam = useReducedMotion();
  const Komponen = TAG[as];
  return (
    <Komponen
      id={id}
      className={className}
      initial={diam ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </Komponen>
  );
}
