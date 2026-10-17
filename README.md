# Dang Lupa ko Komering

> *"Jangan lupakan Komering."*

Portal budaya Suku Komering berbasis AI untuk **Vibe Coding IT Festival 2026** bertema *Empowering Culture Through AI-Driven Innovation*. Pengunjung mengenal sejarah, bahasa, marga, busana adat, kuliner, dan lagu Komering bersama pemandu virtual **Raka & Ratih**.

Dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, **Framer Motion**, **GSAP**, dan **Lucide React**.

## Fitur

| Bab | Fitur |
| --- | --- |
| Navbar | Logo bundar, teks brand tiga baris, penanda bab aktif yang bergeser (Framer Motion `layoutId`), kaca buram saat halaman digulir |
| Hero | Lencana berkilau, tombol CTA magnetik, statistik yang menghitung naik saat terlihat |
| Maskot | Raka & Ratih di bingkai lengkung bermotif pucuk rebung tanpa tulisan apa pun di atasnya, animasi masuk & "bernapas" (GSAP). Sentuh/klik Raka → ia membesar sedikit dengan cahaya emas dan mengucapkan "Tabik pun!" (suara pria). Kartu "Raka & Ratih menyapa" membacakan sapaan + artinya dengan sorotan kata dan riak pada tombol speaker |
| Penerjemah AI | Terjemahan dua arah Indonesia ⇄ Basa Kumoring dari 3.739 kata kamus + padanan dari 3.658 contoh kalimat (penyelarasan statistik), stemming imbuhan, koreksi salah ketik, skor keyakinan, Text-to-Speech |
| Kamus | 3.739 kata (1.808 dasar + 1.931 turunan) dengan contoh kalimat, termasuk 7 kata lirik bertanda "arti dugaan"; pencarian dua arah, filter kelas kata, kata turunan, tautan silang, "Kata Hari Ini" |
| Sejarah | Linimasa 8 era yang bisa dibacakan |
| Peta | Titik interaktif di peta wilayah sebaran Komering |
| Marga | Data kebuayan dengan filter kabupaten & pencarian |
| Busana & Adat | Titik interaktif busana pengantin + 9 tahapan pernikahan adat dari kamus |
| Kuliner | 7 hidangan berfoto dengan kisah, bahan, cara menikmati, fakta unik, dan kosakata dapur dari kamus |
| Lagu | Rekaman "Dang Lupa ko Komering" (pencipta: NN) dengan lirik yang tersorot baris demi baris, terjemahan, dan kredit sumber rekaman |
| Jajuluk | Generator gelar adat ("Mangku Alam" / "Nai Mangku Alam"), unduh kartu PNG |
| Kuis | 10 soal acak: budaya + kosakata yang dibuat otomatis dari kamus |
| Tanya Raka & Ratih | Laci obrolan mengambang: tanya-jawab budaya, terjemahan, dan arti kata |

Semua fitur AI berjalan di browser — kamus dimuat sekali dari `public/data/kamus.json`, tanpa server AI dan tanpa data pribadi yang dikirim.

## Menjalankan

Membutuhkan Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # http://localhost:3000
```

Perintah lain:

```bash
npm run build      # build produksi
npm start          # jalankan hasil build
npm run lint       # ESLint
npm run typecheck  # pemeriksaan TypeScript
npm run kamus      # bangun ulang kamus dari data/sumber/
```

## Struktur

```text
├── app/
│   ├── layout.tsx              Font (Playfair Display + Plus Jakarta Sans), metadata, provider
│   ├── page.tsx                Susunan bab halaman
│   ├── globals.css             Palet warisan Komering, motif songket/tumpal, gaya komponen
│   └── icon.png                Favicon (lingkaran logo)
├── components/
│   ├── Navbar.tsx  HeroSection.tsx  MascotShowcase.tsx  StatCounter.tsx
│   ├── TranslatorSection.tsx  KamusSection.tsx  SejarahSection.tsx  PetaSection.tsx
│   ├── MargaSection.tsx  BusanaSection.tsx  KulinerSection.tsx  LaguSection.tsx
│   ├── JajulukSection.tsx  KuisSection.tsx  Footer.tsx  FloatingChat.tsx
│   ├── providers/              KamusProvider (kamus + mesin penerjemah), ToastProvider
│   └── ui/                     Bab, Reveal, TombolDengar, TautanMagnet, GambarBertitik, …
├── lib/
│   ├── konten.ts               Konten situs bertipe (sejarah, marga, adat, kuliner, lagu, kuis, chatbot)
│   ├── kamus.ts                Tipe & indeks kamus
│   ├── penerjemah.ts           Mesin NLP penerjemah
│   ├── chatbot.ts  kuis.ts  jajuluk.ts  suara.ts  teks.ts
├── public/                     Gambar maskot, peta, busana, logo, kuliner/, lagu/, data/kamus.json
├── data/
│   ├── sumber/                 Kamus & lirik asli (tidak pernah diubah) + kamus_tambahan.json
│   ├── kamus_komering.json/csv Kamus yang sudah dibersihkan
│   ├── kamus-meta.json         Jumlah kata & contoh (diimpor saat build)
│   └── laporan-perbaikan.md    Daftar perbaikan & entri yang perlu ditinjau
├── tools/build-kamus.cjs       Pembersih & pembangun kamus
├── tailwind.config.ts          Token warna, font, dan animasi
└── _arsip-statis/              Versi HTML/CSS/JS lama sebelum migrasi (cadangan, tidak dipakai)
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

Sapaan Raka ("Tabik pun!") dan kartu "Raka & Ratih menyapa" memakai Web Speech API peramban (`SpeechSynthesisUtterance`, bahasa `id-ID`) lewat `lib/suara.ts`. Untuk Raka dipilih suara pria Indonesia bila tersedia (mis. *Microsoft Ardi* di Edge); bila tidak ada, suara Indonesia lain dipakai dengan nada diturunkan. Tidak ada file audio sapaan yang dimuat, sehingga tidak ada permintaan 404 dan tidak ada pesan "suara belum tersedia".

## Memperbarui Kamus

Semua file kamus dibangun dari `data/sumber/kamus_komering.json` (kamus asli, tidak diubah) ditambah `data/sumber/kamus_tambahan.json` (kata tambahan proyek; kolom `catatan` menandai arti dugaan yang tampil sebagai "⚠ arti dugaan" dan tidak ikut korpus maupun kuis):

```bash
npm run kamus
```

Skrip ini merapikan spasi & karakter tak terlihat, melengkapi singkatan (yg, dg, ttg, dlm, …), memperbaiki kelas kata, memisahkan varian ejaan, mengganti penanda `~` di contoh, menyelesaikan rujukan "lihat X", menggabungkan duplikat, menandai entri sensitif, lalu mempelajari padanan kata dari korpus contoh kalimat. Hasilnya `public/data/kamus.json`, `data/kamus-meta.json`, serta JSON/CSV bersih. Jangan mengedit file hasilnya langsung — perbaikan per entri ditambahkan ke daftar `MANUAL` di skrip.

## Deploy ke Vercel

Impor repo ini di [vercel.com/new](https://vercel.com/new); Vercel mendeteksi Next.js secara otomatis (build command `next build`).

## Catatan Kurasi

Kosakata, istilah adat, dan kuliner bersumber dari Kamus Basa Kumoring di `data/`. Entri yang masih meragukan tercantum di `data/laporan-perbaikan.md` untuk ditinjau penutur asli. Sejarah dan wilayah disusun dari sumber umum dan tradisi lisan. Lagu "Dang Lupa ko Komering" adalah lagu daerah Komering; pencipta tercatat NN (tidak diketahui); terjemahan liriknya bersifat bebas dan tujuh katanya dicatat di kamus sebagai "arti dugaan" sampai dipastikan penutur asli. Waktu tiap baris lirik (`lib/konten.ts`, kolom `t`) diselaraskan dengan rekaman. Jajuluk adalah kreasi untuk edukasi.
