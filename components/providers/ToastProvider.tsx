'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const ToastContext = createContext<(pesan: string) => void>(() => {});

/** Tampilkan pesan singkat di bawah layar */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [pesan, setPesan] = useState<{ teks: string; n: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const tampilkan = useCallback((teks: string) => {
    setPesan((p) => ({ teks, n: (p?.n ?? 0) + 1 }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPesan(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={tampilkan}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
        <AnimatePresence>
          {pesan && (
            <motion.p
              key={pesan.n}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="max-w-md rounded-full border border-emas/50 bg-kayu-700/95 px-5 py-2.5 text-center text-sm font-semibold text-emas-200 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur"
            >
              {pesan.teks}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
