import { fmtAngka } from '@/lib/teks';

/** Angka ringkas dari data (kamus/konten), ditampilkan apa adanya tanpa animasi hitung */
export function StatCounter({ label, nilai }: { label: string; nilai: number }) {
  return (
    <div className="kartu-stat permukaan">
      <dt className="text-[0.72rem] font-semibold tracking-wide text-pasir">{label}</dt>
      <dd className="font-display text-[1.65rem] font-extrabold leading-tight text-emas-300 tabular-nums">{fmtAngka(nilai)}</dd>
    </div>
  );
}
