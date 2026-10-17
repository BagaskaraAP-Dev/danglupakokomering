/** Ornamen mahkota pengantin Komering (garis emas sederhana) — pengganti emoji mahkota/piala */
export function Mahkota({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 72" className={className} fill="none" aria-hidden>
      <g stroke="#D4AF37" strokeWidth="2.2" strokeLinejoin="round">
        {/* Tujuh kembang runcing bertingkat, makin tinggi ke tengah */}
        <path d="M14 52 20 30 26 52" />
        <path d="M28 52 35 20 42 52" />
        <path d="M44 52 52 12 60 52" fill="rgba(212,175,55,.14)" />
        <path d="M60 52 68 12 76 52" fill="rgba(212,175,55,.14)" />
        <path d="M78 52 85 20 92 52" />
        <path d="M94 52 100 30 106 52" />
        <path d="M10 52h100v8H10z" fill="rgba(212,175,55,.22)" />
      </g>
      <g fill="#E5C158">
        <circle cx="60" cy="56" r="2.6" />
        <circle cx="38" cy="56" r="1.8" />
        <circle cx="82" cy="56" r="1.8" />
        <path d="M60 4 64 8 60 12 56 8Z" />
      </g>
      <path d="M22 64h76" stroke="#B08E2A" strokeWidth="1.5" strokeDasharray="2 4" />
    </svg>
  );
}
