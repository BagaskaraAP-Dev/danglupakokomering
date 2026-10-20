import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HalamanMandiri } from '@/components/HalamanMandiri';
import { TombolDengar } from '@/components/ui/TombolDengar';
import { DATA } from '@/lib/konten';
import { dataKata, ringkasKata } from '@/lib/server/kamus-halaman';
import { jsonLd } from '@/lib/situs';
import { urlKata } from '@/lib/tautan';

type Props = { params: Promise<{ kata: string }> };

// 3.739 kata dirender saat pertama dikunjungi lalu disimpan (ISR), bukan saat build
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = dataKata((await params).kata);
  if (!d) return { title: 'Kata tidak ditemukan' };
  const arti = d.entri[0].arti;
  return {
    title: `${d.kata}: ${arti} — Kamus Basa Kumoring`,
    description: ringkasKata(d),
    alternates: { canonical: urlKata(d.kata) },
    openGraph: { title: `${d.kata} — ${arti}`, description: ringkasKata(d), type: 'article', locale: 'id_ID' },
  };
}

export default async function HalamanKata({ params }: Props) {
  const d = dataKata((await params).kata);
  if (!d) notFound();

  return (
    <HalamanMandiri kembali={{ href: '/#kamus', label: 'Kamus' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: d.kata,
            description: d.entri.map((e) => e.arti).join('; '),
            inLanguage: 'kge',
            inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Kamus Basa Kumoring' },
          }),
        }}
      />
      <p className="penanda-bab">Kamus Basa Kumoring</p>
      <div className="mt-3 flex items-center gap-4">
        <h1 className="break-words font-display text-5xl font-extrabold text-emas-300 sm:text-6xl">{d.kata}</h1>
        <TombolDengar id="kata-halaman" teks={d.kata} label={`Dengarkan ${d.kata}`} kecil={false} />
      </div>
      <p className="mt-3 max-w-2xl text-pasir">
        Suara dibacakan mesin Text-to-Speech browser, bukan rekaman penutur asli. Pelafalan sebenarnya bisa berbeda.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          {d.entri.map((e, i) => (
            <article key={e.id} className="permukaan rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-wide text-pasir tabular-nums">
                {d.entri.length > 1 && <span className="mr-2 text-emas-400">Arti {i + 1}</span>}
                {DATA.kelasKata[e.kelas] ?? DATA.kelasKata['']} · {e.id}
              </p>
              <p className="mt-2 font-display text-2xl font-bold leading-snug text-gading sm:text-3xl">{e.arti}</p>

              {e.catatan && (
                <p className="mt-4 text-sm leading-relaxed text-gading/75">
                  <span className="tag tag-dugaan mr-2">arti dugaan</span>
                  {e.catatan}
                </p>
              )}

              <dl className="mt-5 space-y-2 text-sm">
                {e.varian.length > 0 && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 font-semibold text-emas-400">Varian ejaan</dt>
                    <dd className="text-gading/75">{e.varian.join(', ')}</dd>
                  </div>
                )}
                {e.induk && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 font-semibold text-emas-400">Kata dasar</dt>
                    <dd>
                      <Link href={urlKata(e.induk)} className="font-semibold text-emas-200 hover:underline">
                        {e.induk}
                      </Link>
                    </dd>
                  </div>
                )}
                {e.lihat && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 font-semibold text-emas-400">Lihat juga</dt>
                    <dd>
                      <Link href={urlKata(e.lihat)} className="font-semibold text-emas-200 hover:underline">
                        {e.lihat}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>

              {e.contoh.length > 0 && (
                <div className="mt-6 border-t border-emas/15 pt-5">
                  <h2 className="text-sm font-bold text-emas-400">Contoh kalimat</h2>
                  <ul className="mt-3 space-y-4">
                    {e.contoh.map(([km, id]) => (
                      <li key={km}>
                        <p className="font-display text-lg italic text-gading">“{km}”</p>
                        <p className="mt-0.5 text-sm text-gading/70">{id}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          {d.turunan.length > 0 && (
            <section className="permukaan rounded-3xl p-6">
              <h2 className="text-sm font-bold text-emas-400">{d.turunan.length} kata turunan</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {d.turunan.map((t) => (
                  <li key={t.id}>
                    <Link href={urlKata(t.kata)} className="font-semibold text-emas-200 hover:underline">
                      {t.kata}
                    </Link>{' '}
                    <span className="text-gading/70">— {t.arti}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {d.serupa.length > 0 && (
            <section className="permukaan rounded-3xl p-6">
              <h2 className="text-sm font-bold text-emas-400">Kata dengan arti serupa</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {d.serupa.map((s) => (
                  <li key={s.id}>
                    <Link href={urlKata(s.kata)} className="tag" title={s.arti}>
                      <strong>{s.kata}</strong>&nbsp;· {s.arti.length > 28 ? `${s.arti.slice(0, 27)}…` : s.arti}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="rounded-3xl border border-emas/20 p-6 text-sm leading-relaxed text-gading/75">
            <h2 className="font-bold text-emas-400">Pakai dalam kalimat</h2>
            <p className="mt-2">Coba susun kalimat dengan kata ini di penerjemah. Ratih merangkainya dari entri dan contoh kalimat kamus.</p>
            <Link href="/#penerjemah" className="btn-emas btn-kecil mt-4">
              Buka penerjemah
            </Link>
          </section>
        </aside>
      </div>
    </HalamanMandiri>
  );
}
