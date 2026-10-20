import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HalamanMandiri } from '@/components/tata-letak/HalamanMandiri';
import { DATA } from '@/lib/konten';
import { jsonLd } from '@/lib/situs';
import { urlLagu } from '@/lib/tautan';
import { slug } from '@/lib/teks';

type Props = { params: Promise<{ slug: string }> };

const L = DATA.lagu;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: slug(L.judul) }];
}

export const metadata: Metadata = {
  title: `Lirik “${L.judul}” dan terjemahannya — Lagu Daerah Komering`,
  description: `Lirik lagu daerah Komering “${L.judul}” dalam Basa Kumoring lengkap dengan terjemahan Bahasa Indonesia. Reff: “Kumoring dang lupa dipa juga” — Komering, jangan lupa di mana pun berada.`,
  alternates: { canonical: urlLagu(L.judul) },
};

export default async function HalamanLagu({ params }: Props) {
  if ((await params).slug !== slug(L.judul)) notFound();

  return (
    <HalamanMandiri kembali={{ href: '/#lagu', label: 'Lagu' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'MusicComposition',
            name: L.judul,
            description: L.keterangan,
            inLanguage: 'kge',
            genre: 'Lagu daerah',
            lyrics: {
              '@type': 'CreativeWork',
              inLanguage: 'kge',
              text: L.bagian.map((b) => b.baris.map((x) => x.km).join('\n')).join('\n\n'),
            },
          }),
        }}
      />
      <p className="penanda-bab">{L.asal}</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] text-gading sm:text-6xl">“{L.judul}”</h1>
      <p className="mt-4 max-w-2xl text-gading/75">{L.keterangan}</p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <audio src={L.audio} controls preload="none" className="w-full max-w-md" aria-label={`Rekaman lagu ${L.judul}`} />
        <Link href="/#lagu" className="btn-emas btn-kecil">
          Putar dengan lirik tersorot
        </Link>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-10">
          {L.bagian.map((b, i) => (
            <section key={`${b.label}-${i}`}>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-emas-400">
                {b.label}
                {b.ulang && <span className="ml-2 normal-case tracking-normal text-pasir">({b.ulang})</span>}
              </h2>
              <ol className="mt-4 space-y-4">
                {b.baris.map((x) => (
                  <li key={x.km}>
                    <p className="font-display text-2xl font-semibold text-gading">{x.km}</p>
                    <p className="mt-0.5 text-gading/70">{x.id}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <aside>
          <dl className="permukaan space-y-3 rounded-3xl p-6 text-sm">
            <div>
              <dt className="font-bold text-emas-400">Pencipta</dt>
              <dd className="mt-0.5 text-gading/80">{L.kredit.pencipta}</dd>
            </div>
            <div>
              <dt className="font-bold text-emas-400">Rekaman</dt>
              <dd className="mt-0.5 text-gading/80">{L.kredit.rekaman}</dd>
            </div>
            <div>
              <dt className="font-bold text-emas-400">Terjemahan</dt>
              <dd className="mt-0.5 text-gading/80">Terjemahan bebas berdasarkan Kamus Basa Kumoring, bukan terjemahan resmi.</dd>
            </div>
          </dl>
        </aside>
      </div>
    </HalamanMandiri>
  );
}
