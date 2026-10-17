import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HalamanMandiri } from '@/components/HalamanMandiri';
import { DATA } from '@/lib/konten';
import { ambilBasis } from '@/lib/server/basis';
import { jsonLd } from '@/lib/situs';
import { urlHidangan, urlKata } from '@/lib/tautan';
import { artiSingkat, slug } from '@/lib/teks';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return DATA.kuliner.map((h) => ({ slug: slug(h.nama) }));
}

const cariHidangan = (s: string) => DATA.kuliner.findIndex((h) => slug(h.nama) === s);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const h = DATA.kuliner[cariHidangan((await params).slug)];
  if (!h) return {};
  return {
    title: `${h.nama} (${h.alias}) — Kuliner Komering`,
    description: `${h.teaser} ${h.cerita[0]}`.slice(0, 300),
    alternates: { canonical: urlHidangan(h.nama) },
    openGraph: { title: `${h.nama} — ${h.alias}`, description: h.teaser, type: 'article', locale: 'id_ID' },
  };
}

export default async function HalamanHidangan({ params }: Props) {
  const i = cariHidangan((await params).slug);
  if (i < 0) notFound();
  const h = DATA.kuliner[i];
  const n = DATA.kuliner.length;
  const prev = DATA.kuliner[(i - 1 + n) % n];
  const next = DATA.kuliner[(i + 1) % n];
  const { kamus } = ambilBasis();
  const entri = h.kamus ? kamus.id(h.kamus) : undefined;
  const kosakata = h.kosakata.flatMap((k) => {
    const e = kamus.cari(k).find((x) => !x.sensitif);
    return e ? [e] : [];
  });

  return (
    <HalamanMandiri kembali={{ href: '/#kuliner', label: 'Kuliner' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${h.nama} — ${h.alias}`,
            description: h.teaser,
            image: h.foto,
            inLanguage: 'id',
            about: { '@type': 'Thing', name: h.nama },
          }),
        }}
      />
      <article>
        <header className="grid items-end gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="penanda-bab">
              Kuliner Komering · {String(i + 1).padStart(2, '0')}/{String(n).padStart(2, '0')} · {h.jenis}
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] text-gading sm:text-6xl">{h.nama}</h1>
            <p className="mt-2 text-lg font-semibold text-emas-300">{h.alias}</p>
            <p className="mt-6 font-display text-xl italic leading-relaxed text-gading/85 sm:text-2xl">{h.teaser}</p>
          </div>
          <figure className="mx-auto w-full max-w-md">
            <Image
              src={h.foto}
              alt={h.alt}
              width={h.ukuran[0]}
              height={h.ukuran[1]}
              preload
              sizes="(min-width: 768px) 28rem, 92vw"
              className={`h-auto w-full border border-emas/30 object-cover ${h.piring ? 'aspect-square rounded-full' : 'rounded-[1.4rem]'}`}
            />
          </figure>
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="max-w-2xl space-y-5 text-[1.05rem] leading-relaxed text-gading/80">
            {h.cerita.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <h2 className="pt-4 font-display text-2xl font-bold text-gading">Cara menikmati</h2>
            <p>{h.sajian}</p>
            <h2 className="pt-4 font-display text-2xl font-bold text-gading">Tahukah kamu?</h2>
            <p>{h.fakta}</p>
          </div>

          <aside className="space-y-6">
            <section className="permukaan rounded-3xl p-6">
              <h2 className="text-sm font-bold text-emas-400">Bahan utama</h2>
              <ul className="mt-3 space-y-2 text-sm text-gading/80">
                {h.bahan.map((b) => (
                  <li key={b} className="border-b border-emas/10 pb-2 last:border-0">
                    {b}
                  </li>
                ))}
              </ul>
            </section>
            {kosakata.length > 0 && (
              <section className="permukaan rounded-3xl p-6">
                <h2 className="text-sm font-bold text-emas-400">Kosakata di pawon</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {kosakata.map((e) => (
                    <li key={e.id}>
                      <Link href={urlKata(e.kata)} className="tag" title={e.arti}>
                        <strong>{e.kata}</strong>&nbsp;· {artiSingkat(e.arti, e.kata)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {entri && (
              <section className="rounded-3xl border border-emas/20 p-6 text-sm leading-relaxed">
                <h2 className="font-bold text-emas-400">Dari kamus · {entri.id}</h2>
                <p className="mt-2 text-gading/80">
                  <Link href={urlKata(entri.kata)} className="font-semibold text-emas-200 hover:underline">
                    {entri.kata}
                  </Link>{' '}
                  — {entri.arti}
                </p>
                {entri.contoh[0] && (
                  <p className="mt-2 italic text-pasir">
                    “{entri.contoh[0][0]}” — {entri.contoh[0][1]}
                  </p>
                )}
              </section>
            )}
          </aside>
        </div>

        <nav aria-label="Hidangan lain" className="mt-16 grid gap-4 border-t border-emas/15 pt-8 sm:grid-cols-2">
          <Link href={urlHidangan(prev.nama)} className="group rounded-2xl p-4 hover:bg-white/[0.03]">
            <span className="text-xs font-semibold text-pasir">← Sebelumnya</span>
            <span className="mt-1 block font-display text-xl font-bold text-gading group-hover:text-emas-300">{prev.nama}</span>
          </Link>
          <Link href={urlHidangan(next.nama)} className="group rounded-2xl p-4 text-right hover:bg-white/[0.03]">
            <span className="text-xs font-semibold text-pasir">Berikutnya →</span>
            <span className="mt-1 block font-display text-xl font-bold text-gading group-hover:text-emas-300">{next.nama}</span>
          </Link>
        </nav>
      </article>
    </HalamanMandiri>
  );
}
