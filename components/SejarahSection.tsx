'use client';
/* Sejarah sebagai aliran sungai: dari hulu (leluhur di Sekala Brak & Danau Ranau) ke
   hilir (masa kini). Sungai berliku di tengah (desktop) atau di kiri (HP); tiap era
   adalah persinggahan di tepiannya. */
import { Volume2 } from 'lucide-react';
import Image from 'next/image';
import { DATA } from '@/lib/konten';
import { suara, useSedangBicara } from '@/lib/suara';
import { useToast } from './providers/ToastProvider';
import { Bab } from './ui/Bab';
import { Reveal } from './ui/Reveal';
import { TombolDengar } from './ui/TombolDengar';

const CERITA = DATA.sejarah.map((s) => `${s.judul}. ${s.isi}`).join(' ');

/** Sungai berliku; preserveAspectRatio none + non-scaling-stroke → tebal garis tetap */
function Sungai() {
  const liku = 'M50 0 C 85 45, 15 95, 50 140 S 85 235, 50 280 S 15 375, 50 420 S 85 515, 50 560 S 15 655, 50 700 S 85 795, 50 840 S 15 935, 50 1000';
  return (
    <svg className="sungai-sejarah" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden>
      <path d={liku} stroke="rgba(127,167,181,0.22)" strokeWidth="16" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      <path d={liku} stroke="rgba(229,193,88,0.75)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="2 7" strokeLinecap="round" />
    </svg>
  );
}

export function SejarahSection() {
  const bercerita = useSedangBicara('cerita-sejarah');
  const toast = useToast();

  return (
    <Bab
      id="sejarah"
      tata="belah"
      label="Raka bercerita"
      judul={
        <>
          Jejak <span className="teks-emas">Sejarah</span> Ulun Kumoring
        </>
      }
      deskripsi="Seperti Way Komering yang mengalir dari Danau Ranau ke Palembang, kisah masyarakatnya pun mengalir: dari leluhur di dataran tinggi Sekala Brak hingga pemekaran kabupaten."
    >
      <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <Reveal as="aside" className="lg:sticky lg:top-24">
          <div className="panggung-maskot">
            <Image
              src="/maskot/raka-sejarah.webp"
              alt="Maskot Raka berkopiah emas memegang gulungan Peta Sungai Komering"
              width={1100}
              height={821}
              sizes="(min-width: 1024px) 30vw, 90vw"
              className="relative z-[1] block h-auto w-full"
            />
          </div>
          <div className="gelembung ekor-atas permukaan-kuat mt-6">
            <p className="text-sm leading-relaxed text-gading/75">
              <strong className="text-emas-300">Raka:</strong> “Nyak Raka. Ayo ram susuri sejarah Way Kumoring jama-jama, dari hulu sampai
              ke hilir!”
            </p>
            <button
              type="button"
              className="btn-kaca btn-kecil mt-4 w-full"
              onClick={() => {
                if (bercerita) {
                  suara.berhenti();
                  return;
                }
                if (!suara.ucapkan(CERITA, { id: 'cerita-sejarah', rate: 1 })) toast('Browser ini tidak mendukung Text-to-Speech.');
              }}
            >
              <Volume2 className="size-4" aria-hidden />
              {bercerita ? 'Hentikan cerita' : 'Dengarkan Raka bercerita'}
            </button>
          </div>
        </Reveal>

        <div className="relative">
          <p className="ujung-sungai mb-6">Hulu · Sekala Brak &amp; Danau Ranau</p>
          <div className="relative">
          <Sungai />
          <ol className="alur-sungai">
            {DATA.sejarah.map((s, i) => (
              <Reveal as="li" key={s.judul} className="singgah">
                <span className="titik-singgah" aria-hidden />
                <article className="permukaan rounded-2xl px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-emas-400">{s.era}</p>
                      <h3 className="mt-1.5 font-display text-xl font-bold text-gading">{s.judul}</h3>
                    </div>
                    <TombolDengar id={`sejarah-${i}`} teks={`${s.judul}. ${s.isi}`} label={`Dengarkan: ${s.judul}`} rate={1} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gading/75">{s.isi}</p>
                </article>
              </Reveal>
            ))}
          </ol>
          </div>
          <p className="ujung-sungai mt-6">Hilir · Palembang &amp; masa kini</p>
        </div>
      </div>
    </Bab>
  );
}
