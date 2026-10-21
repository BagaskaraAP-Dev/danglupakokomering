# Dang Lupa ko Komering

> *"Jangan lupakan Komering."*

Portal budaya Suku Komering berbasis AI untuk **Vibe Coding IT Festival 2026** bertema *Empowering Culture Through AI-Driven Innovation*. Pengunjung mengenal sejarah, bahasa, marga, busana adat, kuliner, dan lagu Komering bersama pemandu virtual **Raka & Ratih**.

Dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, **Framer Motion**, **Lucide React**, dan **Google Gemini API**.

Situs produksi: https://danglupakokomering.mooncrust.my.id

## Dokumentasi

| Dokumen | Isi |
| --- | --- |
| [PRD](docs/PRD.md) | Product Requirements: masalah, tujuan, persona, kebutuhan fungsional & nonfungsional beserta statusnya, peta jalan, risiko |
| [TRD](docs/TRD.md) | Technical Requirements: arsitektur, rute & strategi render, alur data kamus, kontrak `/api/chat` & `/api/translate`, keamanan, performa, deploy |
| [DRD](docs/DRD.md) | Design Requirements: arah desain, palet & kontras, tipografi, motif songket/tumpal, maskot, komponen, gerak, aksesibilitas |
| [PRD Revitalisasi](docs/PRD-REVITALISASI.md) | Rencana revitalisasi Tahap 1–3 |
| [PRD Video Hero](docs/PRD-VIDEO-HERO.md) | Video 3D Raka & Ratih di hero (20 Oktober 2026) beserta penyesuaiannya |
| [Laporan Pengembangan](docs/LAPORAN-PENGEMBANGAN.md) | Log pengerjaan dan hasil pengujian |
| [Log pengerjaan (PDF)](DOKUMENTASIITFEST2026/Log-Pengerjaan-Dang-Lupa-ko-Komering.pdf) | Linimasa commit git dari awal dan ringkasan prompt pemilik beserta hasil kerja Claude, 16–21 Oktober 2026, dengan foto Komering, Raka & Ratih, dan tangkapan layar tiap tanggal |
| [Dokumentasi lomba](DOKUMENTASIITFEST2026/README.md) | 36 tangkapan layar proses pengerjaan, urut menurut waktu, dan bahan mentah (tautan, video maskot asli) |

## Fitur

| Bab | Fitur |
| --- | --- |
| Navbar | Logo bundar, teks brand dua baris, penanda bab aktif yang bergeser (Framer Motion `layoutId`), kaca buram saat halaman digulir |
| Hero | Teks tampil tanpa menunggu JavaScript, dua tombol CTA ke Penerjemah dan Peta, statistik kamus yang menghitung naik saat terlihat |
| Maskot hero | Video 3D Raka & Ratih menunduk lalu mengucapkan "Tabik pun" di bingkai lengkung bermotif pucuk rebung. Video berputar tanpa suara; setelah pengunjung pertama kali mengetuk/mengklik halaman, Raka menyapa dengan suara asli setiap kali selesai menunduk. Sentuh Raka → video melompat ke sapaannya sehingga gerak bibir pas dengan suara. Kartu "Raka & Ratih menyapa" membacakan sapaan + artinya dengan sorotan kata |
| Maskot pemandu | Raka (Sejarah) dan Ratih (Penerjemah) diam seperti gambar biasa, hidup lewat cahaya: debu emas songket yang menyingkir dari kursor, pendar yang menguat saat mereka berbicara, dan percikan emas saat disentuh atau saat Ratih selesai menyusun terjemahan |
| Penerjemah AI | Terjemahan dua arah Indonesia ⇄ Basa Kumoring. Mesin lokal menerjemahkan kata per kata saat mengetik (stemming imbuhan, koreksi salah ketik, skor keyakinan); tombol **Terjemahkan** meminta Gemini menyusun kalimat alami hanya dari entri dan contoh kalimat kamus, lalu kata yang tidak ada di kamus ditandai "periksa" |
| Kamus | 3.739 kata (1.808 dasar + 1.931 turunan) dengan contoh kalimat, termasuk 7 kata lirik bertanda "arti dugaan"; pencarian dua arah, filter kelas kata, kata turunan, tautan silang, "Kata Hari Ini". Kamus dimuat saat peramban senggang sehingga biasanya sudah siap sebelum mencari kata; bila pemuatan lebih dari 0,5 detik, butir emas merangkai tulisan "Kamus Basa Kumoring" lalu memencar saat kamus siap |
| Sejarah | Linimasa 8 era yang bisa dibacakan |
| Peta | Titik interaktif di peta wilayah sebaran Komering |
| Marga | Data kebuayan dengan filter kabupaten & pencarian |
| Busana & Adat | Titik interaktif busana pengantin + 9 tahapan pernikahan adat dari kamus |
| Kuliner | 7 hidangan berfoto dengan kisah, bahan, cara menikmati, fakta unik, dan kosakata dapur dari kamus |
| Lagu | Rekaman "Dang Lupa ko Komering" (pencipta: NN) dengan lirik yang tersorot baris demi baris, terjemahan, dan kredit sumber rekaman |
| Jajuluk | Generator gelar adat ("Mangku Alam" / "Nai Mangku Alam"), unduh kartu PNG |
| Kuis | 10 soal acak: budaya + kosakata yang dibuat otomatis dari kamus |
| Tanya Raka & Ratih | Laci obrolan mengambang: pertanyaan bebas dijawab Gemini dari entri kamus dan bab situs yang relevan, lengkap dengan tombol sumber |
| Halaman mandiri | `/kamus/<kata>`, `/kuliner/<slug>`, `/lagu/<slug>` dengan gambar pratinjau tautan, serta `/sumber` untuk rujukan & kredit |

Kamus dimuat di browser dari `public/data/kamus.json`. Chat dan tombol **Terjemahkan** mengirim teks pertanyaan ke Google Gemini lewat `/api/chat` dan `/api/translate`; bila Gemini tidak tersedia, mesin lokal di browser yang menjawab. Tidak ada akun, cookie pelacak, atau data pribadi yang disimpan. Rincian di [TRD](docs/TRD.md).

## Menjalankan

Membutuhkan Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # http://localhost:3000
```

Untuk fitur Gemini, buat `.env.local` (tidak ikut git) berisi `GEMINI_API_KEY=<kunci Google AI Studio>`. Tanpa kunci, situs tetap berjalan memakai mesin lokal.

Perintah lain:

```bash
npm run build      # build produksi
npm start          # jalankan hasil build
npm run lint       # ESLint
npm run typecheck  # pemeriksaan TypeScript
npm run kamus      # bangun ulang kamus dari data/sumber/
npm run indexnow   # beri tahu Bing dkk. isi sitemap.xml (jalankan setelah deploy)
```

## Struktur

```text
├── app/
│   ├── layout.tsx              Font (Playfair Display + Plus Jakarta Sans), metadata, provider
│   ├── page.tsx                Susunan bab halaman
│   ├── globals.css             Palet warisan Komering, motif songket/tumpal, gaya komponen
│   ├── api/chat, api/translate Endpoint Gemini (RAG kamus + bab situs)
│   ├── kamus/, kuliner/, lagu/ Halaman mandiri + gambar pratinjau tautan
│   ├── sumber/                 Sumber, rujukan & kredit
│   ├── not-found.tsx           Halaman 404 ("Halaman tidak ditemukan")
│   └── icon.png  favicon.ico   Ikon situs (lingkaran logo)
├── components/
│   ├── bab/                    Satu komponen per bab: HeroSection, TranslatorSection, KamusSection,
│   │                           SejarahSection, PetaSection, MargaSection, BusanaSection, KulinerSection,
│   │                           LaguSection, JajulukSection, KuisSection
│   ├── maskot/                 MascotShowcase (video hero), MaskotHidup (panggung bercahaya), DebuEmas, Avatar
│   ├── tata-letak/             Navbar, Footer, FloatingChat (Tanya Raka & Ratih), HalamanMandiri
│   ├── providers/              KamusProvider (kamus + mesin penerjemah), ToastProvider
│   └── ui/                     Bab, Reveal, TombolDengar, StatCounter, PemuatKamus, useKanvas, …
├── lib/
│   ├── konten.ts               Konten situs bertipe (sejarah, marga, adat, kuliner, lagu, kuis, chatbot)
│   ├── kamus.ts                Tipe & indeks kamus
│   ├── penerjemah.ts           Mesin NLP penerjemah
│   ├── chatbot.ts  kuis.ts  jajuluk.ts  suara.ts  teks.ts  ai.ts  fokus.ts
│   └── server/                 Basis pengetahuan RAG, klien Gemini, penjaga permintaan, cache
├── docs/                       PRD, TRD, DRD, PRD revitalisasi, PRD video hero, laporan pengembangan
├── public/                     maskot/ (video hero 640×800 + poster, maskot & avatar WebP), peta, busana, logo,
│                               og-raka-ratih.jpg (pratinjau tautan), logo-dang-lupa-ko-komering.jpg, kuliner/, lagu/,
│                               data/kamus.json, berkas kunci IndexNow (<kunci>.txt)
├── data/
│   ├── sumber/                 Kamus & lirik asli (tidak pernah diubah) + kamus_tambahan.json
│   ├── kamus_komering.json/csv Kamus yang sudah dibersihkan
│   ├── kamus-meta.json         Jumlah kata & contoh (diimpor saat build)
│   └── laporan-perbaikan.md    Daftar perbaikan & entri yang perlu ditinjau
├── tools/
│   ├── build-kamus.cjs         Pembersih & pembangun kamus
│   └── indexnow.cjs            Pengirim alamat sitemap ke IndexNow
├── tailwind.config.ts          Token warna dan font
└── DOKUMENTASIITFEST2026/      Dokumentasi lomba: 00-bahan/ + satu folder per tanggal, urut waktu (tidak ikut deploy)
```

## Palet & Desain

| Peran | Warna |
| --- | --- |
| Latar (marun / kayu obsidian) | `#140706` – `#240B09` |
| Permukaan kaca | `rgba(45, 16, 14, 0.65)` + `blur(12px)` + garis `rgba(212, 175, 55, 0.22)` |
| Aksen emas songket | `#D4AF37`, `#E5C158` |
| Teks utama / pudar | `#FDFBF7` / `#A89070` |

Pola songket (belah ketupat) tampil samar di sisi kiri latar dan pita bab; pola pucuk rebung mengisi lengkungan bingkai maskot; deret tumpal menjadi pembatas bab.

## Suara

Sapaan "Tabik pun" di hero memakai **suara asli video 3D** (sapaan + suling), sehingga gerak bibir Raka pas dengan suaranya. Peramban hanya mengizinkan video bersuara setelah pengunjung pernah mengetuk, mengklik, atau menekan tombol di halaman; sebelum itu video berputar tanpa suara.

Suara lain (kartu "Raka & Ratih menyapa", sapaan Raka di Sejarah dan Ratih di Penerjemah, cerita sejarah, hasil terjemahan, kosakata) memakai Web Speech API peramban (`SpeechSynthesisUtterance`, bahasa `id-ID`) lewat `lib/suara.ts`. Untuk Raka dipilih suara pria Indonesia bila tersedia (mis. *Microsoft Ardi* di Edge); bila tidak ada, suara Indonesia lain dipakai dengan nada diturunkan. Selama peramban membacakan teks, suara video hero dibisukan sementara agar tidak bertumpuk.

## Memperbarui Kamus

Semua file kamus dibangun dari `data/sumber/kamus_komering.json` (kamus asli, tidak diubah) ditambah `data/sumber/kamus_tambahan.json` (kata tambahan proyek; kolom `catatan` menandai arti dugaan yang tampil sebagai "⚠ arti dugaan" dan tidak ikut korpus maupun kuis):

```bash
npm run kamus
```

Skrip ini merapikan spasi & karakter tak terlihat, melengkapi singkatan (yg, dg, ttg, dlm, …), memperbaiki kelas kata, memisahkan varian ejaan, mengganti penanda `~` di contoh, menyelesaikan rujukan "lihat X", menggabungkan duplikat, menandai entri sensitif, lalu mempelajari padanan kata dari korpus contoh kalimat. Hasilnya `public/data/kamus.json`, `data/kamus-meta.json`, serta JSON/CSV bersih. Jangan mengedit file hasilnya langsung — perbaikan per entri ditambahkan ke daftar `MANUAL` di skrip.

## Deploy ke Vercel

Folder ini sudah ter-link ke proyek Vercel `danglupakokomering`. Deploy produksi:

```bash
npx vercel deploy --prod
```

Atur `GEMINI_API_KEY` di Environment Variables proyek Vercel (Production & Preview). Agar setiap push ke `main` terdeploy otomatis, beri aplikasi Vercel akses ke repo ini di github.com/settings/installations. Rincian di [TRD §13](docs/TRD.md#13-build-deploy-dan-operasional).

## Catatan Kurasi

Kosakata, istilah adat, dan kuliner bersumber dari Kamus Basa Kumoring di `data/`. Entri yang masih meragukan tercantum di `data/laporan-perbaikan.md` untuk ditinjau penutur asli. Sejarah dan wilayah disusun dari sumber umum dan tradisi lisan. Lagu "Dang Lupa ko Komering" adalah lagu daerah Komering; pencipta tercatat NN (tidak diketahui); terjemahan liriknya bersifat bebas dan tujuh katanya dicatat di kamus sebagai "arti dugaan" sampai dipastikan penutur asli. Waktu tiap baris lirik (`lib/konten.ts`, kolom `t`) diselaraskan dengan rekaman. Jajuluk adalah kreasi untuk edukasi.
