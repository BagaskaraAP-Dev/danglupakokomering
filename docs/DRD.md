# DRD: Dang Lupa ko Komering

**Design Requirements Document** · identitas visual, komponen, gerak, dan aksesibilitas

| | |
| --- | --- |
| Versi dokumen | 1.0 |
| Tanggal | 19 Oktober 2026 |
| Sumber kebenaran kode | `tailwind.config.ts` (token) · `app/globals.css` (motif & kelas komponen) · `components/ui/` |
| Dokumen terkait | [PRD](PRD.md) (produk) · [TRD](TRD.md) (teknis) |

---

## 1. Arah desain

Situs ini harus terasa seperti **kain songket Komering yang dibentangkan di layar**: marun gelap sebagai kain dasar, emas sebagai benang, motif tumpal dan pucuk rebung sebagai ornamen. Yang memandu pengunjung adalah dua maskot berbusana adat, bukan ilustrasi generik.

| Dial | Nilai | Artinya di situs ini |
| --- | --- | --- |
| ENERGY | 2 | Hangat dan percaya diri, tetapi isi (kata, cerita, lagu) tetap pusat perhatian |
| RHYTHM | 3 | Setiap bab punya susunan sendiri (garis waktu sungai, menu bernomor, pemutar layar penuh) |
| MOTION | 2 | Masuk halus saat digulir dan respons saat disentuh; tidak ada animasi yang berulang sendiri |

### Prinsip

1. **Berakar budaya, bukan template.** Setiap warna dan ornamen punya rujukan ke songket, tumpal, atau busana pengantin Komering.
2. **Isi lebih dulu.** Kata Komering, contoh kalimat, dan lirik mendapat tipografi terbesar dan paling kontras.
3. **Satu titik fokus per layar.** Emas dipakai hemat untuk hal yang paling penting: judul aksen, tombol utama, kata Komering.
4. **Gerak hanya untuk menjawab interaksi.** Raka bergerak saat disentuh, lirik bergeser saat lagu berjalan. Tidak ada "bernapas" atau kilau otomatis.
5. **Jujur secara visual.** Label "arti dugaan", "periksa", "dari kamus", dan "kata per kata" selalu terlihat, tidak disembunyikan demi kerapian. Merek AI tidak ditampilkan; yang bekerja di mata pengunjung adalah Raka & Ratih.

## 2. Warna

Token didefinisikan di `tailwind.config.ts` dan diulang sebagai variabel CSS di `:root` (`app/globals.css`).

### Palet inti

| Peran | Token Tailwind | Nilai | Rujukan budaya |
| --- | --- | --- | --- |
| Latar terdalam | `kayu-950` | `#140706` | Kayu obsidian rumah adat |
| Latar | `kayu-900` / `kayu-800` | `#1A0908` / `#240B09` | Kain dasar songket marun |
| Permukaan | `kayu-700` / `kayu-600` / `kayu-500` | `#2D100E` / `#3D1612` / `#5C1E1A` | Lapisan kain bertumpuk |
| Marun | `marun-600` / `marun-500` / `marun-400` | `#6E1B1F` / `#8E2429` / `#B23A3A` | Warna pengantin Komering |
| Emas songket | `emas` (`emas-500`) | `#D4AF37` | Benang emas |
| Emas terang | `emas-400` / `emas-300` / `emas-200` | `#E5C158` / `#EED68A` / `#F6E7B4` | Kilau benang pada cahaya |
| Emas gelap | `emas-600` / `emas-700` | `#B08E2A` / `#7E6420` | Ornamen pucuk rebung |
| Teks utama | `gading` | `#FDFBF7` | Gading |
| Teks pudar | `pasir` | `#A89070` | Pasir sungai Komering |

### Warna fungsional

Hanya dipakai sebagai penanda status, tidak untuk dekorasi.

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `daun` | `#8FB58A` | Segmen terjemahan "cocok di kamus", jawaban kuis benar |
| `terakota` | `#D98B66` | Segmen "dipelajari dari korpus" |
| `#C9B78C` | (lokal) | Segmen "dari kata dasar" |
| `--galat` | `#E8857A` | Pesan galat, jawaban kuis salah |

### Garis dan permukaan

| Variabel | Nilai | Dipakai untuk |
| --- | --- | --- |
| `--garis` | `rgba(212,175,55,0.22)` | Tepi panel biasa |
| `--garis-kuat` | `rgba(212,175,55,0.45)` | Tepi tombol kaca, panel penting |
| `--teks-redup` | `rgba(253,251,247,0.74)` | Paragraf deskripsi |
| `--teks-samar` | `rgba(253,251,247,0.52)` | Keterangan kecil (jangan untuk teks penting) |

### Kontras (WCAG)

Diukur terhadap latar `kayu-950` dan panel `.permukaan` (komposit `rgba(45,16,14,0.72)` di atas `kayu-950`):

| Pasangan | Rasio | AA teks biasa (4,5:1) |
| --- | --- | --- |
| `gading` di `kayu-950` | 19,1:1 | Lolos |
| `gading` 75% di `kayu-950` | 10,7:1 | Lolos |
| `pasir` di `kayu-950` | 6,5:1 | Lolos |
| `pasir` di panel | 6,0:1 | Lolos |
| `emas-400` di `kayu-950` | 11,4:1 | Lolos |
| `emas` di `kayu-950` | 9,4:1 | Lolos |
| `kayu-950` di tombol `emas-400` | 11,4:1 | Lolos |
| `emas-200` di panel | 14,9:1 | Lolos |

Aturan: teks di bawah opasitas 70% tidak boleh dipakai untuk informasi penting; `--teks-samar` hanya untuk keterangan pelengkap.

### Tema

Situs memakai satu tema gelap. Alasannya identitas, bukan tren: songket Komering bertumpu pada kain marun gelap dengan benang emas, dan emas hanya "menyala" di atas latar gelap. `color-scheme: dark` diset agar kontrol bawaan peramban (scrollbar, audio, select) ikut gelap. Tidak ada pengalih tema.

## 3. Tipografi

| Peran | Font | Alasan |
| --- | --- | --- |
| Judul, kata Komering, lirik, angka besar | **Playfair Display** 600/700/800 + italic (`font-display`) | Serif berkontras tinggi terasa seperti prasasti dan undangan adat; italic dipakai untuk kalimat Komering |
| Teks isi, UI, tombol | **Plus Jakarta Sans** 400–800 (`font-sans`) | Sans buatan Indonesia, terbaca jelas di HP, cocok untuk teks Indonesia yang panjang |

Keduanya dimuat lewat `next/font/google` dengan `display: swap` agar tidak ada kedip teks.

### Skala

| Elemen | Ukuran | Kelas |
| --- | --- | --- |
| Judul hero | 3rem → 3.75rem (sm) → 4.5rem (lg), tebal 800, `leading-[1.03]` | `text-5xl sm:text-6xl lg:text-7xl` |
| Judul bab | `clamp(2rem, 4.5vw, 3.1rem)`, tebal 800, `text-wrap: balance` | `.judul-bab` |
| Judul halaman mandiri | 3rem → 3.75rem | `text-5xl sm:text-6xl` |
| Deskripsi bab | 1.05rem, `line-height 1.75`, `text-wrap: pretty` | `.desk-bab` |
| Penanda bab | 0.8rem, tebal 600, `letter-spacing 0.04em`, warna `pasir` | `.penanda-bab` |
| Label di dalam panel | 0.72rem, tebal 700, huruf kapital, `letter-spacing 0.18em`, emas | `.eyebrow` (hanya di dalam panel, tidak di atas judul bab) |

### Aturan teks

- Kata Basa Kumoring ditebalkan atau ditulis dengan `font-display` italic, sehingga selalu bisa dibedakan dari Bahasa Indonesia.
- Satu kata aksen emas per judul (`.teks-emas`). Gradasi kilau (`.teks-emas-kilau`) **hanya** untuk kata "Komering" di judul hero.
- Angka memakai `tabular-nums` bila disusun berderet.

## 4. Motif dan ornamen

Semua motif berupa SVG inline (data URL) beropasitas rendah, jadi tajam di semua kerapatan layar dan tidak menambah permintaan jaringan.

| Motif | Variabel / kelas | Bentuk | Tempat |
| --- | --- | --- | --- |
| **Songket** | `--pola-songket`, `.pita-songket` | Belah ketupat bersusun dengan bunga tengah, petak 48 px | Sisi kiri latar halaman (memudar ke kanan), latar pita bab berselang |
| **Pucuk rebung** | `--pola-rebung` | Segitiga bertumpuk, petak 40×56 px | Bagian dalam lengkungan bingkai maskot |
| **Tumpal** | `--pola-tumpal`, `.tumpal` | Deret segitiga emas dengan lubang marun, 28×16 px | Pembatas bab (`<Tumpal />`), bisa dibalik (`.balik`) |
| **Sudut songket** | `.sudut-songket` | Tiga belah ketupat kecil di pojok kiri atas dan kanan bawah | Panel unggulan saja: penerjemah, pemutar lagu, kartu jajuluk, kuis, gambar bertitik |
| **Mahkota** | `<Mahkota />` | Tujuh kembang runcing mahkota pengantin, garis emas | Pengganti emoji mahkota/piala (jajuluk, skor kuis) |

Latar halaman: gradasi radial marun hangat di pojok kanan atas dan kiri, cahaya emas samar di bawah, di atas gradasi `kayu-900 → kayu-950 → kayu-800`.

## 5. Maskot Raka & Ratih

| | Raka | Ratih |
| --- | --- | --- |
| Peran | Sejarah, wilayah, sungai, marga, adat, rumah adat | Bahasa, kamus, terjemahan, kuliner, busana, lagu |
| Ciri | Laki-laki, berkopiah emas | Perempuan, bermahkota emas |
| Aset | `public/maskot/raka-sejarah.webp` (transparan) | `public/maskot/ratih-penerjemah.webp` (transparan) |
| Avatar | `public/maskot/avatar-raka.webp` (128 px) | `public/maskot/avatar-ratih.webp` (128 px) |

Aturan:

- Maskot selalu berlatar transparan di atas **panggung marun bermotif songket** (`.panggung-maskot`), tidak boleh dalam kotak putih.
- Di hero, keduanya berdiri dalam bingkai lengkung (`.bingkai-lengkung`) berisi pola pucuk rebung. **Tidak ada teks, balon, atau badge di atas maskot.**
- Mengetuk tubuh Raka (`.sentuh-raka`): Raka membesar 5% dengan cahaya emas (`.cahaya-raka`) lalu terdengar "Tabik pun!". Mengetuk Ratih tidak memicunya.
- Di HP, maskot tampil di layar pertama, tepat di bawah judul.
- Avatar dipakai di tombol chat, gelembung jawaban, dan kartu sapaan. Jangan memakai gambar maskot ukuran penuh untuk avatar.

## 6. Komponen

### Permukaan

| Kelas | Tampilan | Dipakai untuk |
| --- | --- | --- |
| `.permukaan` | `rgba(45,16,14,0.72)` + garis `--garis`, tanpa blur | Panel umum, kartu kamus, kartu marga |
| `.permukaan-kuat` | Gradasi `kayu-600 → kayu-900` hampir pekat + `--garis-kuat` + bayangan jatuh | Panel yang harus menonjol: laci chat, menu seluler, panel penerjemah, kartu kuis, kartu sapaan maskot |

Blur kaca (`backdrop-blur`) hanya dipakai di **navbar saat digulir**, **lapisan belakang laci chat**, dan **toast**. Panel isi tidak memakai blur.

### Tombol

| Kelas | Tampilan | Kapan |
| --- | --- | --- |
| `.btn-emas` | Gradasi emas, teks `kayu-950`, sudut 0.95rem | Satu aksi utama per area (Terjemahkan, Mulai kuis) |
| `.btn-kaca` | Latar transparan, garis `--garis-kuat`, teks `emas-200` | Aksi kedua |
| `.btn-kecil` | Pengubah ukuran | Tombol di dalam panel |
| `.ikon-btn` | Kotak 2.5rem, sudut 0.8rem, ikon emas | Salin, dengarkan, tukar arah, tutup. Wajib `aria-label` |
| `.chip` | Pil kecil | Saran pertanyaan, filter |

Tombol nonaktif: opasitas 50% dan `cursor: not-allowed`.

### Label dan isian

| Kelas | Dipakai untuk |
| --- | --- |
| `.tag` | Pil emas: kata Komering yang bisa diklik untuk membuka kamus |
| `.tag-lembut` | Pil netral untuk informasi pelengkap (mis. varian ejaan) |
| `.tag-dugaan` | Pil terakota bergaris putus-putus berisi **"arti dugaan"**: wajib tampil di setiap entri yang kolom `catatan`-nya terisi |
| `.isian` | Kolom teks dan pencarian, fokus bergaris emas |
| `.seg[data-jenis]` | Segmen hasil terjemahan, diwarnai sesuai jenis (lihat warna fungsional) |

### Kepala bab (`<Bab tata>`)

Kepala bab sengaja berbeda-beda agar ritme halaman tidak seragam:

| `tata` | Susunan |
| --- | --- |
| `kiri` | Judul rata kiri, aksi (mis. kolom cari) di kanan |
| `belah` | Judul di kiri, deskripsi di kanan (lg ke atas) |
| `tengah` | Simetris, untuk bab yang berdiri sendiri seperti Kuis |
| `tanpa` | Bab menyusun kepalanya sendiri |

Penanda di atas judul berupa teks pasir polos (`.penanda-bab`), sering dalam Basa Kumoring: "Ratih Menerjemahkan", "Raka bercerita", "Tanoh Kumoring", "Buay & Marga", "Bangik nihan!", "Juluk & adok". **Pola lama "◆ BAB 0X ◆" tidak boleh kembali.**

## 7. Tata letak per bab

| Bab | Susunan khas | Alasan |
| --- | --- | --- |
| Hero | Dua kolom di desktop (teks kiri, maskot kanan); di HP judul → maskot → isi | Maskot adalah daya tarik terbesar, harus terlihat tanpa gulir |
| Penerjemah | Panel dua sisi dengan tukar arah, rincian per kata berwarna, Ratih di panggung | Alat utama, butuh ruang kerja lebar |
| Kamus | Kolom cari + daftar hasil + panel entri | Pola kamus yang sudah dikenal pengguna |
| Sejarah | Garis waktu mengikuti **sungai berliku dari hulu ke hilir**; titik singgah berselang kiri-kanan di desktop | Sejarah Komering mengalir bersama Way Komering |
| Peta | Gambar wilayah bertitik + daftar lokasi yang bisa ditekan | Dua cara memilih: visual dan daftar |
| Marga | Filter kabupaten + kartu kebuayan | Data berulang yang perlu disaring |
| Busana & Adat | Gambar busana bertitik + tahapan adat sebagai **alur bernomor** | Tahapan pernikahan berurutan |
| Kuliner | **Menu bernomor ala majalah** + satu hidangan disorot dengan foto besar | Terasa seperti membaca daftar sajian, bukan grid kartu |
| Lagu | Pemutar dengan lirik tersorot; **mode layar penuh** menampilkan baris aktif besar di tengah | Fokus pada lirik dan suara |
| Jajuluk | Formulir nama → kartu gelar yang bisa diunduh | Hasil yang bisa dibagikan |
| Kuis | Simetris di tengah, opsi besar, cincin skor | Satu tugas pada satu waktu |

Pembatas antarbab: deret tumpal. Bab berselang memakai pita songket (`pita`) agar ada perubahan latar tanpa sekadar membalik warna.

## 8. Gerak

| Gerak | Implementasi | Tujuan |
| --- | --- | --- |
| Masuk saat digulir | `.muncul` (CSS `animation-timeline: view()`), tanpa JavaScript | Memberi tanda bab baru tanpa menunda isi |
| Masuk hero | `.geser-masuk` 0,7 dtk dengan `--tunda` bertingkat | Urutan baca judul → isi |
| Penanda menu aktif | Framer Motion `layoutId` | Menunjukkan posisi baca |
| Tombol magnetik | `<TautanMagnet>` mengikuti kursor sedikit | Umpan balik arah pada CTA hero |
| Bicara | Riak (`.riak-suara`) dan sorotan kata hanya selama suara berbunyi | Menunjukkan apa yang sedang dibacakan |
| Laci chat, toast | Framer Motion masuk/keluar | Menjaga konteks saat panel muncul |

Aturan:

- **Tidak ada animasi tak berujung** yang berjalan tanpa interaksi. Animasi lama `kilau` dan `kelip` sudah dihapus dari `tailwind.config.ts`.
- `prefers-reduced-motion: reduce` mematikan semua animasi dan transisi (durasi 0,01 ms), mengganti gulir halus dengan lompatan langsung, dan `useReducedMotion()` dipakai di komponen Framer Motion.
- Animasi tidak boleh menyembunyikan teks sampai JavaScript selesai.

## 9. Ikon dan gambar

- Ikon UI dari **lucide-react** (garis tipis, seragam) untuk aksi fungsional: salin, kirim, tutup, tukar arah, bahasa. Ornamen budaya memakai SVG kustom (`Mahkota`, `Tumpal`, sudut songket).
- **Tidak memakai emoji** sebagai ikon atau isi tombol.
- Foto kuliner ditampilkan di ukuran aslinya (387–736 px) agar tidak pecah; juadah memakai bingkai piring bundar (`data-piring`). Foto baru minimal 1200 px sisi panjang.
- Semua gambar isi punya `alt` deskriptif dalam Bahasa Indonesia; gambar dekoratif `alt=""` dan `aria-hidden`.
- Format: WebP/AVIF lewat `next/image`; maskot WebP transparan.

## 10. Responsif

| Lebar | Perilaku |
| --- | --- |
| < 640 px | Satu kolom; tombol chat berupa avatar bulat; laci chat menjadi panel bawah setinggi `min(88dvh, 40rem)` |
| ≥ 640 px (`sm`) | Laci chat menjadi panel samping kanan 26rem |
| ≥ 1024 px (`lg`) | Hero dua kolom, kepala bab `belah`, garis waktu sejarah zig-zag, menu kuliner vertikal |
| ≥ 1280 px (`xl`) | Menu navbar penuh; di bawahnya memakai menu seluler |

Syarat: tidak ada geser horizontal di 360 px dan target sentuh minimal 44 px. Pada layar sentuh (`@media (pointer: coarse)`), `.chip`, `.btn-kecil`, dan `.ikon-btn` dinaikkan ke 44 px; di desktop ukurannya tetap ringkas. Tautan footer memakai `min-h-11`. Footer beranda diberi ruang bawah ekstra di bawah `lg` agar tombol chat tidak menutupi baris terakhir. Diuji di 390 px dan 1440 px.

Pengecualian yang diketahui: di bawah 640 px label titik peta disembunyikan dan titiknya mengecil (area sentuh ±22 px). Daftar lokasi di bawah peta menjadi cara utama memilih tempat di HP. Peta vektor (PRD 2.3) harus menghapus pengecualian ini.

## 11. Aksesibilitas

- Fokus papan ketik: garis emas 2 px (`:focus-visible`, offset 3 px). Jangan menghapus outline tanpa pengganti.
- Tautan "Lewati ke konten utama" di awal halaman.
- `lang="id"` di dokumen. Data terstruktur kata memakai `inLanguage: kge`.
- Tombol ikon wajib `aria-label`; teks tombol yang disembunyikan di HP tetap ada sebagai `sr-only`.
- Status pilihan memakai `aria-pressed` (menu kuliner, tombol tempat di peta).
- Laci chat, menu seluler, dan mode layar penuh lagu bisa ditutup dengan `Esc`. Laci chat dan layar penuh lagu menjebak fokus Tab di dalam dialog, lalu mengembalikan fokus ke tombol pemicu saat ditutup.
- "Lewati ke konten utama" memindahkan fokus ke `<main>` (bukan hanya menggulir).
- Warna tidak menjadi satu-satunya penanda: segmen terjemahan juga punya legenda dan keterangan teks.
- Seleksi teks: latar emas, teks `kayu-950`.

## 12. Bahasa dan nada

- Bahasa Indonesia yang hangat, ringkas, dan menyapa ("Tunggu sebentar, ya."). Raka & Ratih berbicara sebagai pemandu, bukan sebagai sistem.
- Sapaan dan penanda bab memakai Basa Kumoring bila ada padanannya, selalu dengan artinya di dekatnya.
- Hindari klaim berlebihan tentang AI. Tulis apa yang dilakukan ("Gemini merangkainya dari entri dan contoh kalimat kamus"), bukan label pemasaran.
- Keterbatasan disebut terus terang: "Suara dibacakan mesin Text-to-Speech browser, bukan rekaman penutur asli."
- Label status wajib: **arti dugaan**, **periksa**, **dari kamus** (jawaban chat cadangan), **kata per kata** / **disusun Ratih dari kamus** (penerjemah). Jangan menampilkan nama merek AI di antarmuka.
- Jawaban chat: tanpa judul, tabel, daftar bertingkat, atau emoji; kata Komering ditebalkan; maks. ±120 kata.

## 13. Gambar pratinjau tautan (Open Graph)

Dibuat otomatis oleh `kartuOg()` (`lib/server/kartu-og.tsx`), 1200×630:

- Latar gradasi `#140706 → #2A0D0C → #4A1418`, bingkai garis emas 55% bersudut 28 px.
- Label kecil huruf kapital emas di atas, judul besar `#E5C158` (ukuran menyesuaikan panjang), sub-judul gading, isi gading 72%.
- Foto opsional 290×290 di kanan (kuliner).
- Kaki: "Dang Lupa ko Komering" + deret 9 belah ketupat emas-marun berselang.

## 14. Yang tidak boleh dipakai

| Pola | Alasan |
| --- | --- |
| Biru/ungu neon, gradasi pelangi | Tidak punya rujukan budaya Komering |
| Badge kapsul "Berbasis AI" di atas judul | Klaim kosong; fitur AI ditunjukkan lewat kerjanya |
| Emoji sebagai ikon | Merusak keseragaman dan terlihat seperti template |
| Glow emas di banyak elemen sekaligus | Emas kehilangan fungsinya sebagai penanda fokus |
| Blur kaca di panel isi | Membebani GPU HP dan menurunkan keterbacaan |
| Animasi berulang otomatis (bernapas, kilau, riak titik peta) | Mengalihkan perhatian dan menguras baterai |
| Maskot berlatar putih | Memecah tema gelap |
| Kepala bab seragam "◆ BAB 0X ◆" | Membuat semua bab terasa sama |
| Angka statistik yang ditulis tangan | Semua angka diambil dari data kamus |

## 15. Riwayat dokumen

| Versi | Tanggal | Perubahan |
| --- | --- | --- |
| 1.0 | 19 Okt 2026 | Dokumen pertama, sesuai kode di branch `revitalisasi-prd-tahap-1-2` |
