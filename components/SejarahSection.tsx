'use client';

import { Volume2 } from 'lucide-react';
import Image from 'next/image';
import { DATA } from '@/lib/konten';
import { suara, useSedangBicara } from '@/lib/suara';
import { useToast } from './providers/ToastProvider';
import { Bab } from './ui/Bab';
import { Reveal } from './ui/Reveal';
import { TombolDengar } from './ui/TombolDengar';

const CERITA = DATA.sejarah.map((s) => `${s.judul}. ${s.isi}`).join(' ');

export function SejarahSection() {
  const bercerita = useSedangBicara('cerita-sejarah');
  const toast = useToast();

  return (
    <Bab
      id="sejarah"
      nomor="02"
      label="Raka Bercerita"
      judul={
        <>
          Jejak <span className="teks-emas">Sejarah</span> Ulun Kumoring
        </>
      }
      deskripsi="Dari dataran tinggi Sekala Brak hingga pemekaran kabupaten — menyusuri perjalanan masyarakat di sepanjang Way Komering."
    >
      <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal as="aside" className="space-y-5 lg:sticky lg:top-28">
          <div className="bingkai-persegi mx-auto max-w-sm lg:max-w-none">
            <Image
              src="/maskot-raka-sejarah.jpg"
              alt="Maskot Raka berkopiah emas memegang gulungan Peta Sungai Komering"
              width={1200}
              height={896}
              sizes="(min-width: 1024px) 30vw, 90vw"
            />
          </div>
          <div className="gelembung ekor-atas permukaan-kuat">
            <p className="text-sm leading-relaxed text-gading/75">
              <strong className="text-emas-300">Raka:</strong> “Nyak Raka. Ayo ram susuri sejarah Way Kumoring jama-jama — dari hulu
              sampai ke hilir!”
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

        <ol className="linimasa space-y-5">
          {DATA.sejarah.map((s, i) => (
            <Reveal as="li" key={s.judul} className="group relative" delay={(i % 2) * 0.08}>
              <span className="titik-linimasa" aria-hidden>
                <span>{s.ikon}</span>
              </span>
              <article className="permukaan rounded-[1.1rem] px-5 py-4 transition-[border-color,translate] duration-300 group-hover:translate-x-1 group-hover:border-emas/45">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="tag">{s.era}</span>
                    <h3 className="mt-2 font-display text-xl font-bold text-gading">{s.judul}</h3>
                  </div>
                  <TombolDengar id={`sejarah-${i}`} teks={`${s.judul}. ${s.isi}`} label={`Dengarkan: ${s.judul}`} rate={1} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gading/75">{s.isi}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </Bab>
  );
}
