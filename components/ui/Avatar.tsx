/** Wajah Raka atau Ratih, dipotong dari ilustrasi maskot */
export function Avatar({ siapa, className = '' }: { siapa: 'raka' | 'ratih'; className?: string }) {
  return <span className={`avatar avatar-${siapa} ${className}`} aria-hidden />;
}
