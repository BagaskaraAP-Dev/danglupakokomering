import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { HalamanMandiri } from '@/components/tata-letak/HalamanMandiri';
import { KAMUS_META } from '@/lib/kamus';
import { DATA } from '@/lib/konten';
import { urlHidangan } from '@/lib/tautan';
import { fmtAngka } from '@/lib/teks';

export const metadata: Metadata = {
  title: 'Sumber, rujukan & kredit',
  description: 'Asal data Kamus Basa Kumoring, rujukan bab sejarah, kredit lagu dan foto, serta teknologi yang dipakai portal Dang Lupa ko Komering.',
  alternates: { canonical: '/sumber' },
};

/* Kredit foto kuliner per berkas. Kosong = pakai SUMBER_FOTO_UMUM; isi dengan nama pemilik bila sudah diketahui. */
const KREDIT_FOTO: Record<string, string> = {};
const SUMBER_FOTO_UMUM = 'Google Gambar, pemilik asli belum terlacak';
const ISU_GITHUB = 'https://github.com/BagaskaraAP-Dev/danglupakokomering/issues';

const RUJUKAN_SEJARAH = [
  { judul: 'Tradisi lisan Ulun Kumoring', isi: 'Asal leluhur dari Sekala Brak dan cerita tutur asal nama "Komering". Dicantumkan sebagai cerita rakyat; versinya bisa berbeda antar-marga.' },
  { judul: 'Kitab Simbur Cahaya', isi: 'Kitab hukum adat Kesultanan Palembang Darussalam yang berlaku di daerah uluan.' },
  { judul: 'UU No. 5 Tahun 1979 tentang Pemerintahan Desa', isi: 'Dasar penghapusan pemerintahan marga di Sumatera Selatan pada 1983.' },
  { judul: 'UU No. 37 Tahun 2003', isi: 'Pembentukan Kabupaten OKU Timur dan OKU Selatan.' },
  { judul: 'ISO 639-3: kge', isi: 'Kode bahasa Komering dalam standar internasional ISO 639-3.' },
];

function Bagian({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <section className="border-t border-emas/15 pt-8">
      <h2 className="font-display text-2xl font-bold text-gading">{judul}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-gading/80">{children}</div>
    </section>
  );
}

export default function HalamanSumber() {
  return (
    <HalamanMandiri kembali={{ href: '/', label: 'Beranda' }}>
      <p className="penanda-bab">Transparansi data</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold text-gading">Sumber, rujukan &amp; kredit</h1>
      <p className="mt-4 max-w-2xl text-gading/75">
        Portal ini disusun untuk {DATA.meta.acara}. Halaman ini mencatat dari mana isi situs berasal, bagian mana yang masih dugaan, dan
        apa yang dikerjakan AI.
      </p>

      <div className="mt-12 max-w-3xl space-y-10">
        <Bagian judul="Kamus Basa Kumoring">
          <p>
            Kamus memuat <strong className="text-emas-200">{fmtAngka(KAMUS_META.jumlahKata)} kata</strong> ({fmtAngka(KAMUS_META.jumlahKataDasar)}{' '}
            kata dasar dan {fmtAngka(KAMUS_META.jumlahTurunan)} turunan) dengan {fmtAngka(KAMUS_META.jumlahContoh)} contoh kalimat. Datanya
            berasal dari berkas <code>data/sumber/kamus_komering.json</code>, ditambah 7 kata dari <code>kamus_tambahan.json</code> yang
            artinya masih dugaan.
          </p>
          <p>
            Berkas asli tidak diubah. Skrip <code>tools/build-kamus.cjs</code> merapikannya secara otomatis: spasi, kelas kata, singkatan
            arti, duplikat, dan rujukan &quot;lihat&quot;. Ada pula 48 perbaikan manual per entri, yang semuanya tercatat di{' '}
            <code>data/laporan-perbaikan.md</code>.
          </p>
          <p className="text-sm text-pasir">
            Penyusun dan penerbit kamus asli belum tercantum di data proyek. Kata berlabel{' '}
            <span className="tag tag-dugaan">arti dugaan</span> masih perlu dipastikan penutur asli.
          </p>
        </Bagian>

        <Bagian judul="Rujukan bab sejarah, wilayah & marga">
          <ul className="space-y-3">
            {RUJUKAN_SEJARAH.map((r) => (
              <li key={r.judul}>
                <strong className="text-emas-200">{r.judul}</strong>
                <span className="text-gading/75">: {r.isi}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-pasir">
            Tahapan adat pernikahan dan istilah busana diambil dari entri Kamus Basa Kumoring (nomor entri tercantum di bab Busana &amp; Adat).
          </p>
        </Bagian>

        <Bagian judul={`Lagu “${DATA.lagu.judul}”`}>
          <p>
            <strong className="text-emas-200">Pencipta:</strong> {DATA.lagu.kredit.pencipta}.
          </p>
          <p>
            <strong className="text-emas-200">Rekaman:</strong> {DATA.lagu.kredit.rekaman}.
          </p>
          <p>Terjemahan lirik bersifat bebas, disusun dengan bantuan kamus. Tujuh kata lirik masih berstatus arti dugaan.</p>
        </Bagian>

        <Bagian judul="Foto kuliner">
          <ul className="divide-y divide-emas/10">
            {DATA.kuliner.map((h) => (
              <li key={h.foto} className="flex flex-wrap justify-between gap-2 py-2.5 text-sm">
                <Link href={urlHidangan(h.nama)} className="font-semibold text-emas-200 hover:underline">
                  {h.nama}
                </Link>
                <span className={KREDIT_FOTO[h.foto] ? 'text-gading/75' : 'text-pasir'}>{KREDIT_FOTO[h.foto] || SUMBER_FOTO_UMUM}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-pasir">
            Ketujuh foto diambil dari hasil pencarian Google Gambar dan dipakai sebagai ilustrasi untuk tujuan edukasi non-komersial. Hak cipta
            tetap milik pemotretnya. Foto Juadah Basah diperjelas dengan AI Real-ESRGAN karena berkas aslinya hanya 149×148 piksel. Bila kamu
            pemilik salah satu foto dan ingin namamu dicantumkan atau fotonya diganti, sampaikan lewat{' '}
            <a href={ISU_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emas-200 underline-offset-2 hover:underline">
              GitHub Issues
            </a>
            .
          </p>
        </Bagian>

        <Bagian judul="Peran AI di situs ini">
          <p>
            <strong className="text-emas-200">Mesin lokal</strong> (berjalan di browser) mencocokkan kata dengan kamus, mengenali imbuhan, dan
            memperbaiki salah ketik.
          </p>
          <p>
            <strong className="text-emas-200">AI di server situs</strong> dipakai untuk chatbot Raka &amp; Ratih dan terjemahan
            kalimat. Server lebih dulu mencari entri kamus dan bab yang relevan, lalu AI diminta menjawab hanya dari bahan itu dan
            menyebutkan sumbernya. Kata Komering yang tidak ditemukan di kamus ditandai &quot;periksa&quot;.
          </p>
          <p>
            Suara memakai Text-to-Speech bawaan browser, bukan rekaman penutur asli. Rekaman penutur asli adalah pekerjaan berikutnya yang paling
            penting.
          </p>
        </Bagian>

        <Bagian judul="Teknologi & aset">
          <p>
            Next.js, React, Tailwind CSS, Framer Motion, ikon Lucide, serta huruf Playfair Display dan Plus Jakarta Sans (Google Fonts, lisensi SIL
            OFL). Maskot Raka &amp; Ratih, ilustrasi busana adat, dan peta wilayah adalah aset visual proyek ini.
          </p>
        </Bagian>
      </div>
    </HalamanMandiri>
  );
}
