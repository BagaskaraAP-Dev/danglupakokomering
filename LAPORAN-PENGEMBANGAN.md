# Laporan Pengembangan — Dang Lupa ko Komering

Tanggal laporan: 17 Oktober 2026
Repositori: `BagaskaraAP-Dev/danglupakokomering` (privat) · commit terakhir di GitHub: `a415121` (versi awal)

> **Status singkat:** situs sudah dimigrasi penuh ke **Next.js 16 + TypeScript + Tailwind CSS 4 + Framer Motion + GSAP** sesuai `prd.md`, termasuk **PRD Fase 2** (Raka bersih & bisa disentuh, sapaan bersuara, perbaikan kamus). TypeScript, ESLint, dan `next build` lolos tanpa error maupun peringatan; konsol browser bersih tanpa 404; semua fitur sudah diuji di Chrome ukuran desktop (1440 px) dan HP (390 px). **Semua perubahan belum di-commit.**

---

## 0. Pembaruan Terbaru — PRD Fase 2

| Poin PRD Fase 2 | Status | Hasil |
| --- | --- | --- |
| Hapus balon bicara & badge "AI Penerjemah" di atas maskot | ✅ | Tidak ada lagi tulisan atau badge di dalam bingkai; diuji: 0 elemen teks di atas Raka & Ratih |
| Klik/pegang Raka langsung bersuara "Tabik pun!" | ✅ | Area sentuh transparan (`cursor-pointer`) tepat di tubuh Raka. Saat disentuh: tanpa tulisan, Raka membesar 5% dengan cahaya emas lalu terdengar "Tabik pun!" (Web Speech API id-ID, suara pria bila tersedia; jika tidak, nada diturunkan). Mengetuk Ratih tidak memicunya |
| Hapus toast/peringatan "suara belum tersedia" | ✅ | Semua logika itu dihapus dari `MascotShowcase.tsx` dan `lib/suara.ts` |
| Hentikan pemuatan `.mp3` kosong (penyebab 404) | ✅ | Tidak ada lagi file audio sapaan yang dimuat; konsol bersih |
| Speaker kartu "Raka & Ratih menyapa" bersuara untuk semua sapaan | ✅ | Diuji keempatnya: "Holau nihan tiuh Kumoring! Indah sekali kampung Komering!", "Payu kita liak jama-jama! Mari kita lihat bersama-sama!", "Tabik! Api kabar? Permisi! Apa kabar?", "Dang lupa basa kita! Jangan lupa bahasa kita!" |
| Sorotan kata (karaoke) + riak selama bicara | ✅ | Mengikuti event `onboundary`; bila suara tidak mengirim event itu, sorotan memakai perkiraan durasi. Riak berhenti tepat saat suara selesai |
| `devIndicators: false` | ✅ | Tombol "N" tidak muncul lagi saat `npm run dev` (diuji) |
| 7 kosakata lirik masuk kamus | ✅ | nyuntuh, tajok, andan, kacaroman, sangon, among, lebu — disimpan di `data/sumber/kamus_tambahan.json` (lihat catatan di bawah). Kamus kini 3.739 kata |
| Perbaiki `juadah`, `adat`, dan 3 rujukan "lihat" | ✅ | *juadah* = "kue basah tradisional khas Komering (juadah basah)"; *adat* = "adat, kebiasaan turun-temurun; diacungkan (senjata)"; *ompong* → *ranguh ompong*, *ngosang kosang* → *makkahangsa hangsa*, *solik* → *liak* |
| Kredit lagu | ✅ | Bagian Lagu kini menampilkan **Pencipta: NN** (tidak diketahui) dan sumber rekaman |
| Foto juadah tajam & seragam | ✅ | Diperbesar 4× dengan penajaman (`juadah-basah-hd.jpeg`) dan disajikan sebagai piring bundar berbingkai emas di atas latar songket, setinggi foto lain |
| Verifikasi akhir | ✅ | typecheck 0 error, lint 0 error, build sukses, konsol tanpa 404, tidak ada pesan "belum diisi suara" |

**Catatan penting Fase 2:**

1. **Arti 7 kata lirik adalah dugaan.** Kata-kata itu tidak ditemukan di kamus sumber maupun di internet, jadi artinya disusun dari konteks lirik (dan, untuk *sangon*, kemiripan dengan *sinangon* "dulu"). Di situs, entrinya diberi tanda **"⚠ arti dugaan"**, tidak dipakai korpus penerjemah, dan tidak muncul di kuis. Mohon dipastikan oleh penutur asli.
2. **File kamus asli tidak diubah.** Tujuh kata baru ditaruh di `data/sumber/kamus_tambahan.json` (bukan di `kamus_komering.json`), agar data asli tetap bisa dibedakan dari tambahan proyek yang belum terverifikasi. Hasil gabungannya tetap masuk ke semua keluaran lewat `npm run kamus`.
3. **Dasar koreksi juadah:** kamus sendiri sudah menerjemahkan *"bibik anggalu juwadah"* sebagai "bibik mengaduk **kue**". Kata "dodol" di terjemahan contoh yang memuat *juadah* diganti "juadah".
4. **Suara Raka bergantung pada peramban.** Komputer ini tidak punya suara Indonesia bawaan Windows. Edge menyediakan suara pria *Ardi*; Chrome umumnya hanya punya suara wanita "Google Bahasa Indonesia", sehingga nadanya diturunkan agar terdengar lebih berat. Untuk suara yang sama di semua perangkat, kelak bisa dipakai rekaman asli.

---

## 1. Ringkasan Pekerjaan

Urutan pekerjaan sejak repositori dibuat:

| # | Permintaan | Hasil |
| --- | --- | --- |
| 1 | Masukkan `kamus_komering.csv/json` ke website | Kamus dibersihkan otomatis menjadi 3.732 kata (1.801 dasar + 1.931 turunan) dan 3.657 contoh kalimat. Penerjemah, kamus, adat, kuliner, kuis, dan chatbot memakai kamus ini. |
| 2 | Tambah lagu asli + foto makanan | Rekaman "Dang Lupa ko Komering" dengan lirik yang tersorot baris demi baris. Tujuh hidangan berfoto, masing-masing dengan cerita lengkap. |
| 3 | Juadah ternyata kue juadah basah, bukan dodol | Kartu diganti menjadi **Juadah Basah** (kue basah pandan); tidak ada lagi kata "dodol" di kartu kuliner. |
| 4 | Upgrade hero (GSAP, Alpine.js, Lottie) | Selesai, lalu **digantikan** oleh versi React di langkah 5. |
| 5 | Jalankan `prd.md` | Migrasi total ke Next.js. Hero, maskot, navbar, dan chat dibangun ulang sesuai PRD. |
| 6 | Jalankan pembaruan `prd.md` (Fase 2) | Raka bersih & bisa disentuh, sapaan bersuara, perbaikan kamus, kredit lagu, foto juadah (lihat §0). |

---

## 2. Pemenuhan `prd.md`

### Aturan desain "anti-AI-slop"

| Ketentuan PRD | Status | Keterangan |
| --- | --- | --- |
| Tanpa biru/ungu neon, gradien pelangi, kartu Bootstrap generik | ✅ | Warna penanda di penerjemah yang dulu biru/ungu diganti nada alam (daun, terakota, pandan, emas). |
| Latar `#140706`–`#240B09` | ✅ | Token `kayu-950` … `kayu-800` |
| Permukaan `rgba(45,16,14,0.65)` + `blur(12px)` + garis `rgba(212,175,55,0.22)` | ✅ | Kelas `.permukaan` |
| Aksen `#D4AF37` / `#E5C158`, teks `#FDFBF7` | ✅ | Token `emas`, `emas-400`, `gading`; teks pudar `pasir` `#A89070` |
| Playfair Display + Plus Jakarta Sans | ✅ | Dimuat lewat `next/font` (tanpa kedip font) |
| Pola songket samar di sisi kiri latar & dalam lengkungan bingkai maskot | ✅ | Pola belah ketupat di kiri latar, pola pucuk rebung di dalam bingkai, deret tumpal sebagai pembatas bab |

### Komponen

| Bagian PRD | Status | Implementasi |
| --- | --- | --- |
| A. Navbar | ✅ | `components/Navbar.tsx`: logo bundar `w-12 h-12` (gambar diperbesar 1,3× agar hanya lingkaran marun-emas yang tampil), teks 3 baris (DANG LUPA KO / KOMERING / PORTAL BUDAYA & AI), penanda aktif bergeser (`layoutId`), kaca buram saat digulir, menu seluler |
| Favicon dari logo | ✅ | `app/icon.png` & `app/apple-icon.png`, hasil potongan lingkaran logo |
| B. Hero | ✅ | `components/HeroSection.tsx`: lencana dengan kilau emas, judul, sub-judul miring, paragraf, CTA emas magnetik + CTA kaca, 4 statistik yang menghitung naik saat terlihat |
| C. Maskot di bingkai lengkung + gerak bernapas | ✅ | `components/MascotShowcase.tsx`, animasi GSAP |
| Hapus badge "🎵 Lagu Daerah" | ✅ | Sudah tidak ada |
| Badge AI Penerjemah → "Tabik Pun! 👋" (diketik otomatis) saat dimuat/hover/klik | ✅ | Ditambah sub-teks Basa Kumoring "Api kabar?" (Salam hormat — apa kabar?) |
| Equalizer SVG beranimasi saat Raka bicara | ✅ | `components/ui/Gelombang.tsx` |
| Audio `public/tabik-pun.mp3` + penanganan cadangan, tanpa suara robot | ✅ | HTML5 Audio; jika file gagal dimuat, balon & equalizer tetap jalan tanpa suara |
| Kartu "Raka & Ratih menyapa: Payu kita liak jama-jama!" + speaker beriak | ✅ | Sapaan bergilir (Payu… yang pertama), riak gelombang, kata tersorot satu per satu |
| D. Tombol "Tanya Raka & Ratih" → laci obrolan | ✅ | `components/FloatingChat.tsx`: laci samping di desktop, panel bawah di HP |
| Bagian modular di bawah hero | ✅ | Semua bab dijadikan komponen (lihat §3) |
| Langkah 1–5 (analisis aset, inisialisasi, `public/`, tema, komponen) | ✅ | Lihat §4 |

---

## 3. Fitur per Bab

| Bab | Komponen | Isi |
| --- | --- | --- |
| Navbar | `Navbar.tsx` | 10 menu dengan penanda bab aktif |
| Hero & maskot | `HeroSection.tsx`, `MascotShowcase.tsx`, `StatCounter.tsx` | Lihat §2 |
| 01 Penerjemah | `TranslatorSection.tsx` | Indonesia ⇄ Basa Kumoring; tukar arah, skor keyakinan, rincian per kata (klik untuk membuka kamus), contoh kalimat, salin, dengarkan, Kata Hari Ini |
| Kamus | `KamusSection.tsx` | 3.739 kata (termasuk 7 kata lirik bertanda "arti dugaan"); pencarian berperingkat, filter kelas kata, "Kata dasar saja", "Kata acak", kata turunan, tautan silang |
| 02 Sejarah | `SejarahSection.tsx` | Linimasa 8 era, "Dengarkan Raka bercerita" |
| 03 Peta | `PetaSection.tsx` | 7 titik interaktif + daftar lokasi |
| 04 Marga | `MargaSection.tsx` | 10 kebuayan, filter kabupaten & pencarian |
| 05 Busana & Adat | `BusanaSection.tsx` | 8 titik busana + 9 tahapan pernikahan adat dengan tautan kamus |
| 06 Kuliner | `KulinerSection.tsx` | 7 hidangan berfoto; jendela cerita (kisah, bahan, cara menikmati, fakta, kosakata dapur); penganan lain dari kamus |
| 07 Lagu | `LaguSection.tsx` | Rekaman asli 4:33, lirik tersorot, ketuk baris untuk melompat, terjemahan, 16 kosakata lagu |
| 08 Jajuluk | `JajulukSection.tsx` | Generator gelar ("Mangku Alam" / "Nai Mangku Alam"), dengarkan, acak lagi, bagikan, unduh kartu PNG |
| 09 Kuis | `KuisSection.tsx` | 10 soal (6 budaya + 4 kosakata dari kamus), skor terbaik tersimpan di browser |
| Obrolan | `FloatingChat.tsx` | Tanya budaya, terjemahan ("bahasa komering …"), arti kata ("arti …"), saran cepat |
| Footer | `Footer.tsx` | Tentang, jelajahi, catatan kurasi |

---

## 4. Arsitektur Baru

### Teknologi (versi dikunci, semuanya rilis stabil)

| Paket | Versi |
| --- | --- |
| next | 16.3.8 |
| react / react-dom | 19.3.0 |
| typescript | 5.9.3 |
| tailwindcss / @tailwindcss/postcss | 4.3.3 |
| framer-motion | 13.5.0 |
| gsap / @gsap/react | 3.15.0 / 2.1.2 |
| lucide-react | 1.49.0 |
| eslint / eslint-config-next | 9.39.5 / 16.3.8 |

### Struktur folder

```text
app/            layout.tsx, page.tsx, globals.css, icon.png, apple-icon.png
components/     16 komponen bab + providers/ (Kamus, Toast) + ui/ (9 komponen kecil)
lib/            konten.ts, kamus.ts, penerjemah.ts, chatbot.ts, kuis.ts, jajuluk.ts, suara.ts, teks.ts
public/         gambar maskot/peta/busana, logo, kuliner/, lagu/, data/kamus.json
data/           sumber/ (file asli), kamus_komering.json/csv, kamus-meta.json, laporan-perbaikan.md
tools/          build-kamus.cjs
_arsip-statis/  versi HTML/CSS/JS lama (cadangan)
```

Kode baru: ±5.900 baris TypeScript/TSX/CSS.

### Cara kerja data

- Kamus (504 KB) dimuat **sekali** dari `public/data/kamus.json` oleh `KamusProvider`, lalu indeks kamus dan mesin penerjemah dibangun di browser. Angka statistik diambil dari `data/kamus-meta.json` saat build, jadi tampil tanpa menunggu kamus.
- Semua konten situs ada di `lib/konten.ts` dan sudah bertipe TypeScript.
- Tombol kata di bagian mana pun (penerjemah, kuliner, lagu, chatbot, adat) memanggil `bukaKamus(kata)`, yang membuka kata itu di bagian Kamus.
- Semua AI berjalan di browser: tanpa server AI dan tanpa data pribadi yang dikirim.

---

## 5. Hasil Pengujian

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run typecheck` (TypeScript) | ✅ 0 error |
| `npm run lint` (ESLint, aturan Next.js + React Hooks) | ✅ 0 error, 0 peringatan |
| `npm run build` | ✅ sukses, tanpa peringatan; halaman dirender statis |
| Konsol browser | ✅ bersih — tidak ada error maupun 404 (Fase 2) |
| Scroll horizontal di HP 390 px | ✅ tidak ada |

Uji fungsi di Chrome (otomatis):

| Uji | Hasil |
| --- | --- |
| Balon "Tabik Pun! 👋" saat halaman dibuka, hilang sendiri, muncul lagi saat hover/klik | ✅ |
| Badge "Lagu Daerah" | ✅ sudah tidak ada |
| Statistik | ✅ 3.739 · 3.658 · 10 · 4 (setelah Fase 2) |
| "Siapa nama anak itu?" | ✅ "Sapa adok sanak sina?" (keyakinan 90%) |
| "Ayah sedang bekerja di sawah" | ✅ "Ubak lokok bugawi di huma"; tukar arah → kembali ke kalimat semula |
| Klik kata hasil terjemahan → kamus | ✅ |
| Cari "rumah" di kamus | ✅ hasil pertama *lombahan* |
| Titik peta & busana | ✅ |
| Jendela kuliner (Juadah Basah) | ✅ tanpa kata "dodol"; geser antar-hidangan; kosakata membuka kamus |
| Lagu di detik 110 | ✅ baris aktif *Ombai akas kaminan* |
| Jajuluk "Dimas" | ✅ "Satria Jaya" / "Nai Satria Jaya" |
| Kuis 10 soal sampai layar skor | ✅ |
| Obrolan "arti kabayan" & saran cepat | ✅ |
| Penanda menu aktif mengikuti bab | ✅ |
| Menu seluler, laci obrolan versi HP | ✅ |

Masalah yang ditemukan saat pengujian dan **sudah diperbaiki**:

1. Kelas CSS buatan sendiri selalu menimpa utilitas Tailwind v4 (akibatnya tombol menu muncul di desktop dan ikon pencarian menutupi teks). Perbaikan: kelas-kelas itu dipindahkan ke `@layer base` dan `@layer components`.
2. Tombol obrolan di HP mengerut karena avatarnya elemen inline. Perbaikan: `.avatar { display: inline-block }`.
3. Empat pola `setState` di dalam `useEffect` yang ditandai ESLint diganti dengan pola yang dianjurkan React (nilai turunan, `useSyncExternalStore`, pembaruan saat render).

---

## 6. Keputusan & Perubahan Penting

1. **Cara menjalankan berubah.** `index.html` sudah tidak bisa dibuka langsung. Gunakan `npm install` lalu `npm run dev` (lihat §8).
2. **File lama tidak dihapus.** `index.html`, `style.css`, `app.js`, `data.js`, `kamus-komering.js`, dan animasi Lottie lama dipindahkan ke `_arsip-statis/`, karena versi terakhirnya belum pernah di-commit. Boleh dihapus setelah Anda puas dengan versi baru.
3. **Alpine.js, dotLottie, dan video maskot** dari permintaan sebelumnya diganti React + Framer Motion + GSAP dan equalizer SVG, sesuai PRD. Video maskot tidak dibawa karena tidak ada di PRD.
4. **Suara.** Sesuai PRD Fase 2, semua suara memakai Web Speech API peramban (id-ID), termasuk "Tabik pun!" Raka dan kartu sapaan. Tidak ada file audio sapaan yang dimuat.
5. **`package.json` memakai `"type": "module"`.** Karena itu skrip kamus diganti nama menjadi `tools/build-kamus.cjs` (jalankan dengan `npm run kamus`).
6. **Aset dipindah ke `public/`.** Folder `assets/` lama sudah tidak ada.
7. **`metadataBase`** otomatis memakai domain Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) untuk gambar pratinjau tautan.

---

## 7. Yang Perlu Ditindaklanjuti

| Prioritas | Tindakan |
| --- | --- |
| Tinggi | **Commit & push** ke GitHub. Semua perubahan sejak versi awal (`a415121`) belum tersimpan di repositori. |
| Tinggi | Jika sudah pernah deploy ke Vercel sebagai situs statis ("Other"), ganti Framework Preset ke **Next.js**. |
| Sedang | Pastikan rekaman lagu boleh dipakai untuk lomba. Kredit sudah tercantum (Pencipta: NN, sumber rekaman: video YouTube). |
| Sedang | Minta penutur asli memastikan arti 7 kata lirik bertanda "arti dugaan" (*nyuntuh, tajok, andan, kacaroman, sangon, among, lebu*). Bila sudah pasti, hapus kolom `catatan` di `data/sumber/kamus_tambahan.json` lalu jalankan `npm run kamus`. |
| Rendah | Tinjau asumsi kamus di `data/laporan-perbaikan.md` (koreksi *juadah*, arti ganda *adat*, tiga rujukan "lihat" yang kini diselesaikan). |
| Rendah | (Opsional) Ganti foto juadah dengan foto beresolusi lebih besar; versi sekarang hasil perbesaran dari 149×148 piksel. |
| Rendah | (Opsional) Untuk suara Raka yang sama di semua peramban, rekam suara asli lalu putar rekaman itu di `components/MascotShowcase.tsx`. |
| Rendah | Hapus `_arsip-statis/` setelah versi Next.js dipastikan memuaskan. |

---

## 8. Cara Menjalankan

```bash
npm install
npm run dev          # buka http://localhost:3000
```

| Perintah | Fungsi |
| --- | --- |
| `npm run build` lalu `npm start` | Build & jalankan versi produksi |
| `npm run lint` | Pemeriksaan ESLint |
| `npm run typecheck` | Pemeriksaan TypeScript |
| `npm run kamus` | Bangun ulang kamus dari `data/sumber/kamus_komering.json` |

> Catatan OneDrive: folder proyek ada di OneDrive. Kalau `npm run build` gagal dengan `EPERM … .next`, hapus folder `.next` lalu build ulang (OneDrive kadang mengunci file hasil build).

---

## 9. Status Git Saat Ini

- Branch `main`, commit terakhir `a415121` (versi awal statis).
- **Dihapus dari pelacakan (dipindah):** `index.html`, `style.css`, `app.js`, `data.js`, `assets/*.jpg`
- **Diubah:** `.gitignore` (ditambah `.next/`, `next-env.d.ts`, dll.), `README.md`
- **Baru, belum dilacak:** `app/`, `components/`, `lib/`, `public/` (termasuk `kuliner/juadah-basah-hd.jpeg`), `data/` (termasuk `sumber/kamus_tambahan.json`), `tools/`, `package.json`, `package-lock.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `_arsip-statis/`, `prd.md`, `LAPORAN-PENGEMBANGAN.md`
- **Bukan buatan saya, belum disentuh:** `DOKUMENTASIITFEST2026/`
