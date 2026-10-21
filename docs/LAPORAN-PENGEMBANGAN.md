# Laporan Pengembangan — Dang Lupa ko Komering

Tanggal laporan: 21 Oktober 2026 (pembaruan terbaru di bagian pertama)
Repositori: `BagaskaraAP-Dev/danglupakokomering` (publik) · situs produksi: https://danglupakokomering.mooncrust.my.id

> **Catatan 20 Oktober 2026:** laporan ini dipindah ke `docs/`. `prd.md` yang disebut di bawah kini [`docs/PRD-REVITALISASI.md`](PRD-REVITALISASI.md). Situs produksi kini https://danglupakokomering.mooncrust.my.id (alamat `vercel.app` dialihkan otomatis). Folder `_arsip-statis/` sudah dihapus dan tetap ada di riwayat git. Kondisi terbaru ada di [PRD](PRD.md), [TRD](TRD.md), dan [DRD](DRD.md).

> **Status 21 Oktober 2026:** hero kini memakai video 3D Raka & Ratih yang menyapa "Tabik pun" dengan suara asli, Raka dan Ratih di bab Sejarah & Penerjemah hidup lewat cahaya emas, kamus siap sebelum dicari, folder `components/` dirapikan, dan dua bug kecil (judul 404, favicon) diperbaiki. Rincian di bagian pertama.

> **Status 18 Oktober 2026:** situs berjalan di **Next.js 16 + TypeScript + Tailwind CSS 4 + Framer Motion** dan sudah online di Vercel. Pembaruan 18 Oktober 2026 menjalankan `prd.md` Tahap 1 dan sebagian besar Tahap 2: halaman jauh lebih ringan (484 KB, Lighthouse HP 86–93), tampilan bebas jejak "template AI", chatbot dan penerjemah memakai **Google Gemini** berbasis kamus, serta halaman mandiri per kata, hidangan, dan lagu. Rincian ada di bagian pertama di bawah.

---

## Pembaruan 20–21 Oktober 2026 — Video 3D hero, maskot bercahaya, kamus, dan perapian repo

| Bagian | Hasil |
| --- | --- |
| Video 3D di hero | Gambar statis Raka & Ratih diganti video 3D dari Google Flow (menangkupkan tangan, menunduk, "Tabik pun", suling). Video dipotong ke bingkai lengkung 4:5 dan dikecilkan dari 5,1 MB menjadi 647 KB; poster = bingkai pertama (51 KB). Berputar tanpa suara, berhenti di luar layar. Rincian: [PRD Video Hero](PRD-VIDEO-HERO.md) |
| Sapaan bersuara | Sentuh Raka: video melompat ke detik 4,5 dan suara asli diputar, sehingga gerak bibir pas (mulut terbuka "Ta-" di 4,71 dtk, suara mulai 4,75 dtk). Setelah interaksi pertama, Raka otomatis menyapa setiap kali selesai menunduk; suara mati lagi saat video berulang |
| Maskot pemandu | Raka (Sejarah) dan Ratih (Penerjemah) diam seperti gambar biasa, hidup lewat cahaya: debu emas songket (kanvas), pendar yang menguat saat berbicara, percikan emas saat disentuh atau saat terjemahan kalimat selesai. Disentuh = sapaannya dibacakan |
| Kamus | Kamus juga dimuat saat peramban senggang dan saat kolom pencarian disentuh, sehingga tulisan "Memuat kamus…" tidak lagi muncul sekejap saat mencari kata. Bila pemuatan > 0,5 detik, butir emas merangkai tulisan "Kamus Basa Kumoring" lalu memencar saat kamus siap |
| Struktur folder | `components/` (17 berkas bercampur) dikelompokkan menjadi `bab/`, `maskot/`, `tata-letak/`, `ui/`, `providers/`; 72 jalur impor disesuaikan, riwayat git tiap berkas tetap tersambung (`git mv`) |
| Berkas tak terpakai | `public/maskot-pasangan-hero.jpg` dihapus; video asli 5,1 MB dipindah dari `public/` ke `DOKUMENTASIITFEST2026/00-bahan/` (tidak ikut terunggah); `CLAUDE.md` yang hanya merujuk `AGENTS.md` dihapus; PRD video dipindah dari akar repo ke `docs/PRD-VIDEO-HERO.md` |
| Dokumentasi lomba | Lima tangkapan layar 20 Oktober dinamai sesuai aturan (32–36) dan masuk daftar isi |

### Perubahan arah selama pengerjaan

Beberapa hal dibuat lalu diubah atas permintaan pemilik produk, dicatat agar alasannya tidak hilang:

1. Tombol "Suara Sapaan/Bisukan" dan tombol jeda di pojok bingkai video **dihapus** karena dinilai merusak tampilan. Suara kini lewat sentuhan pada Raka dan sapaan otomatis.
2. Maskot pemandu sempat dibuat miring 3D mengikuti kursor, bergeser saat digulir, melompat saat disentuh, dan bergoyang saat berbicara. Semua gerak tubuh itu **dihapus** karena terasa tidak wajar; yang dipertahankan hanya cahaya.
3. Three.js dan pustaka particles.js tidak dipakai. Efek partikel ditulis langsung di kanvas (`useKanvas`) agar tidak menambah ±150 KB JavaScript.

### Bug yang ditemukan dan diperbaiki

| Bug | Perbaikan |
| --- | --- |
| Tulisan "Memuat kamus…" muncul sebentar setiap kali hendak mencari kata | Kamus dimuat lebih awal; tulisan dan pemuat baru tampak bila pemuatan > 0,5 detik |
| Tombol hero "Coba Penerjemah" dan "Jelajahi Peta & Budaya" terasa menabrak saat disentuh: efek magnetik menggeser tombol sampai ±30 px padahal jaraknya 12 px | Tombol biasa yang diam, sedikit lebih gelap saat ditekan; komponen `TautanMagnet` dihapus |
| Di HP video hero tampak diam: baru berputar setelah JavaScript siap, 8,8 detik di HP kelas menengah (4G, CPU 4× lebih lambat) | Atribut `autoPlay` + `preload="auto"`: peramban memutar video sejak HTML dimuat, kini 3,6 detik. Gerak dikurangi tetap dihormati (dihentikan di bingkai pertama begitu halaman siap). Autoplay yang diblokir (mis. mode hemat daya iPhone) mulai pada sentuhan pertama |
| Tombol hero di HP bertumpuk dengan lebar berbeda (202 px dan 237 px) | Di HP kedua tombol selebar layar (358 px) dan rata; mulai `sm` berdampingan |
| Galat hidrasi React #418 di mode gerak dikurangi: HTML pemuat kamus di server berbeda dengan render pertama di peramban | Tampilan pemuat dipilih lewat CSS `motion-reduce:`, bukan `useReducedMotion`, sehingga HTML server dan peramban sama |
| Bab Kuliner berantakan: foto kecil (387–736 px) melayang dengan pita gelap dan latar buram yang berbeda tiap hidangan; daftar hidangan di HP berupa baris geser yang terpotong di tepi layar; 22 tanda pisah panjang di teks; jarak label "iwak · ikan" tidak rata | Semua foto dibingkai seragam seperti cetakan (jarak tepi ≥ 24 px, sudut membulat, garis emas) di atas latar songket yang sama, tetap tidak diperbesar melewati ukuran asli; daftar di HP menjadi grid 2/3/4 kolom; tanda pisah diganti tanda baca yang pas; label kata berjarak rata |
| Foto Juadah Basah burik: `juadah-basah-hd.jpeg` ternyata perbesaran biasa dari foto asli 149×148 px sehingga kotak kompresi JPEG ikut membesar | Foto asli diperbesar 4× dengan AI Real-ESRGAN (`realesrgan-x4plus`, dijalankan sekali di laptop, tidak ikut ke situs) menjadi `juadah-basah.jpg`, lalu dipotong persegi berpusat di kue agar memenuhi bingkai piring (560×560, 38 KB): tepi tajam, bintik dan kotak kompresi hilang. Nama berkas baru agar cache lama tidak terpakai |
| Paragraf pengantar bab Kuliner ("Way Komering kaya iwak…") dinilai pemilik tidak berguna | Dihapus; kepala bab kini rata kiri (`tata="kiri"`) agar tidak tersisa kolom kosong. Tradisi *katodan* tetap ada di kuis dan jawaban chatbot |
| Pratinjau tautan (WhatsApp dll.) masih memakai gambar maskot lama berpita hitam | `og-raka-ratih.jpg`: logo lengkap + Raka & Ratih terbaru (1200×630, 84 KB), nama berkas baru agar cache lama tidak terpakai; ditambah JSON-LD `WebSite` + `Organization` berlogo di beranda untuk Google |
| Halaman 404 (alamat salah, kata yang tidak ada) berjudul sama dengan beranda | Judul "Halaman tidak ditemukan" |
| `/favicon.ico` mengembalikan 404 untuk peramban dan crawler yang memintanya langsung | `app/favicon.ico` (PNG RGBA 48×48 di dalam ICO; ICO berformat BMP membuat build Turbopack gagal) |
| Video hero bisa berhenti sendiri bila beberapa perubahan visibilitas datang sekaligus | IntersectionObserver membaca entri terakhir, bukan entri pertama |
| `<source>` cadangan video menunjuk berkas 5,1 MB di `public/` yang ikut terunggah | Berkas dipindah ke dokumentasi, sumber cadangan dihapus |

Catatan: setelah komponen dipindah, server `next dev` yang sedang berjalan sempat membalas 500 (`Jest worker encountered 2 child process exceptions`) untuk `/kamus/[kata]` dan `/kuliner/[slug]`. Ini masalah server dev yang perlu dijalankan ulang, bukan bug kode; build produksi melayani semua halaman dengan benar.

### Pengujian

- `npm run typecheck`, `npm run lint` (seluruh repo), dan `next build` (27 halaman) lolos tanpa galat.
- Build produksi dijelajahi di Chrome headless: `/`, `/sumber`, dua halaman kata, lagu, dua hidangan, `robots.txt`, `sitemap.xml` tanpa galat konsol; 14 tautan internal beranda valid; semua tautan `#bab` punya tujuan; kata/hidangan/lagu yang tidak ada → 404; `/api/translate` & `/api/chat` menolak masukan kosong/rusak (400) dan GET (405).
- Video hero (aturan autoplay Chrome sebenarnya): tanpa interaksi tetap tanpa suara; setelah satu klik, suara menyala di ±4,4 dtk tiap putaran dan mati saat berulang; sentuh Raka melompat ke 4,5 dtk dengan suara; gerak dikurangi = diam sampai disentuh; video diblokir = Raka memakai suara peramban. Diuji di 1366 px, 375 px, dan 320 px tanpa geser horizontal.
- Maskot pemandu: `transform` panggung dan gambar tetap `none` saat diam, disentuh, dan berbicara; pendar naik 0,45 → 0,96 saat berbicara.
- Kamus: tanpa interaksi apa pun sudah siap dalam 5 detik; pemuatan cepat → tulisan memuat tidak pernah tampak; pemuatan 3 detik → pemuat tampak setelah 0,5 detik lalu hilang saat siap. Respons `/api/translate` dipalsukan di peramban uji agar kuota Gemini tidak terpakai.
- Berat halaman (build produksi lokal, HP 390 px, tanpa cache): muatan awal **463 KB**, video hero 632 KB setelah hidrasi, `kamus.json` 154 KB saat senggang, total 1.249 KB dalam 9 detik. Elemen LCP: poster video.

### Catatan aksesibilitas

Tanpa tombol jeda dan suara, video hero yang berulang dan sapaan otomatis tidak memenuhi WCAG 2.2.2 (jeda untuk gerak > 5 detik) dan 1.4.2 (kontrol audio otomatis). Ini keputusan pemilik produk. Peredamnya: video berhenti saat tergulir keluar layar, tidak diputar otomatis bila gerak dikurangi, dan suara baru terdengar setelah pengunjung berinteraksi.

### Tindak lanjut

| Prioritas | Tindakan |
| --- | --- |
| Tinggi | Ukur ulang Lighthouse HP di situs produksi setelah deploy (video hero belum pernah diukur di produksi) |
| Tinggi | Aktifkan billing Gemini (kuota gratis 20 permintaan/hari/model) |
| Sedang | Hubungkan aplikasi Vercel ke repo GitHub agar push ke `main` terdeploy otomatis; saat ini masih lewat `npx vercel deploy --prod` |
| Sedang | Bila sapaan otomatis tiap 8 detik terasa terlalu sering, ubah menjadi sekali per kunjungan |
| Rendah | Jalankan ulang `npm run dev` setelah menarik perubahan struktur folder |

---

## Pembaruan 18 Oktober 2026 — Revitalisasi sesuai `prd.md` (Tahap 1 & 2)

Situs produksi: **https://danglupakokomering.vercel.app**

| Ukuran | Sebelum | Sesudah |
| --- | --- | --- |
| Berat halaman awal (HP) | ±7,8 MB | **484 KB** |
| Lighthouse HP — Performance | — | **86–93** (3 kali ukur di situs produksi) |
| Lighthouse HP — Accessibility / Best Practices / SEO | — | **100 / 100 / 100** |
| LCP · TBT · CLS (HP) | — | 3,1–3,4 dtk · 100–150 ms · 0 |
| Chatbot & penerjemah | Aturan tetap & kata per kata di browser | **Google Gemini** + kamus (RAG), mesin lokal sebagai cadangan |
| Alamat halaman di `sitemap.xml` | — (1 halaman) | **3.647** |

### Tahap 1 — Perbaikan cepat

| Poin PRD | Status | Hasil |
| --- | --- | --- |
| 1.1 Kompresi avatar maskot | Selesai | Tiga gambar maskot 2+ MB yang dipakai sebagai avatar diganti WebP 128 px (3–5 KB) dan label piringan lagu (15 KB) di `public/maskot/` |
| 1.1 Teks hero tampil tanpa menunggu JavaScript | Selesai | Hero menjadi Server Component; animasi masuk tidak lagi menyembunyikan teks |
| 1.1 Pemuatan tertunda | Selesai | Gambar di bawah layar pertama dimuat belakangan. Kamus (±160 KB) baru dimuat saat pengunjung menggulir, mengetuk, atau membuka chat. Lagu memakai `preload="none"`. Ikon situs 99 KB → 8 KB |
| 1.2 Maskot tanpa latar putih | Selesai | `ratih-penerjemah.webp` dan `raka-sejarah.webp` (±80 KB, transparan) tampil di atas panggung marun bermotif songket |
| 1.2 Foto kuliner & ornamen sudut | Sebagian | Ornamen sudut panel kini SVG yang tajam. Foto kuliner masih foto lama (387–736 px) karena tidak ada versi yang lebih besar; foto ditampilkan di ukuran aslinya agar tidak pecah |
| 1.2 Hero versi HP | Selesai | Urutan judul → maskot → isi; Raka & Ratih terlihat di layar pertama |
| 1.3 Bersihkan elemen generik | Selesai | Badge "Berbasis AI" dihapus; emoji diganti ikon dan ornamen mahkota SVG (`components/ui/Mahkota.tsx`); glow dan blur dikurangi; animasi berulang (maskot bernapas, kilau, riak titik peta) dihapus; GSAP dicabut dari proyek |
| 1.3 Tata letak khas per bab | Selesai | **Kuliner:** daftar menu bernomor ala majalah + satu hidangan disorot. **Sejarah:** garis waktu mengikuti sungai berliku dari hulu ke hilir. **Lagu:** mode layar penuh, baris yang sedang dinyanyikan tampil besar di tengah. **Busana:** tahapan adat jadi alur bernomor. Pola "◆ BAB 0X ◆" dihapus |
| 1.4 Deploy otomatis GitHub → Vercel | Belum | Aplikasi Vercel di GitHub belum diberi akses ke repo privat ini; deploy masih lewat `npx vercel deploy --prod` |

### Tahap 2 — Naik kelas

| Poin PRD | Status | Hasil |
| --- | --- | --- |
| 2.1 Chatbot & penerjemah Gemini | Selesai | Rute `POST /api/chat` dan `POST /api/translate` (lihat cara kerja di bawah) |
| 2.2 Rekaman suara penutur asli | Belum | Butuh rekaman dari penutur asli; suara masih Text-to-Speech browser |
| 2.3 Peta vektor wilayah | Belum | Butuh data batas wilayah resmi; peta masih gambar ilustrasi |
| 2.4 Halaman mandiri + pratinjau tautan | Selesai | `/kamus/[kata]` untuk setiap kata (dibuat saat pertama dikunjungi lalu disimpan), `/kuliner/[slug]` untuk 7 hidangan, `/lagu/dang-lupa-ko-komering`. Tiap halaman punya judul & deskripsi sendiri, gambar pratinjau 1200×630 bergaya marun-emas, dan data terstruktur (JSON-LD). Ditambah `sitemap.xml` dan `robots.txt` |
| 2.5 Halaman sumber & kredit | Selesai, datanya belum lengkap | `/sumber` memuat asal data kamus, rujukan sejarah, kredit lagu, peran AI, dan teknologi. Penyusun kamus asli dan sumber foto kuliner belum tercatat di data proyek, jadi ditulis "belum tercatat" |

### Cara kerja Gemini

1. **Mesin lokal** (di browser) tetap menerjemahkan kata per kata secara instan saat mengetik.
2. Saat pengguna bertanya atau menekan **Terjemahkan**, server mencari entri kamus yang relevan, contoh kalimat yang memuat kata-kata itu, dan potongan bab situs yang paling cocok.
3. Gemini diminta menjawab **hanya dari bahan itu**, menyebut sumbernya, dan memberi tahu bila sebuah kata berstatus "arti dugaan". Sumber yang dipakai muncul sebagai tombol di bawah jawaban chat.
4. Setiap kata Komering hasil terjemahan Gemini dicek ke kamus dan korpus contoh kalimat; yang tidak ditemukan diberi tanda **"periksa"**.
5. Bila Gemini gagal atau kuotanya habis, mesin lokal yang menjawab. Setiap jawaban diberi label "Gemini" atau "mesin lokal".

**Berbeda dari rencana PRD:**

- Model `gemini-2.5-flash` sudah tidak tersedia untuk pengguna baru. Yang dipakai: `gemini-3.5-flash`, dengan cadangan berurutan `gemini-3.5-flash-lite` → `gemini-3.1-flash-lite` → `gemini-flash-latest`.
- Gemini dipanggil lewat REST langsung (tanpa SDK `@google/genai`), jadi tidak ada dependensi baru.
- Konteks kamus dicari di server, bukan dikirim dari browser, supaya sumber yang dikutip tidak bisa dipalsukan.

**Keamanan & privasi:**

- Kunci API hanya ada di `.env.local` (tidak ikut git) dan di Environment Variable Vercel (Production & Preview, tipe *Secret*).
- Permintaan dari situs lain ditolak (403). Batas 12 pertanyaan chat dan 20 terjemahan per menit per IP. Panjang masukan dibatasi.
- Perintah yang diselipkan di dalam teks terjemahan diabaikan (sudah diuji).
- Chat menampilkan catatan bahwa pertanyaan dikirim ke Google Gemini. Klaim lama "tanpa server" di footer dan jawaban chatbot sudah diperbarui.
- Jawaban untuk pertanyaan pembuka dan terjemahan yang sama disimpan sementara (cache) agar tidak menghabiskan kuota.

### Pengujian

- `tsc`, ESLint, dan `next build` lolos tanpa error.
- Uji otomatis di Chrome (desktop 1440 px & HP 390 px): penerjemah Gemini, pilihan hidangan Kuliner, mode layar penuh Lagu (buka, putar, tutup), chat Gemini beserta tombol sumber, dan semua halaman mandiri. Konsol tanpa galat; tidak ada geser horizontal di HP.
- Situs produksi: semua halaman 200, kata yang tidak ada 404, chat menjawab dalam 2,6–3,4 detik, terjemahan 1,4 detik, permintaan lintas situs 403.

### Berkas

- **Baru:** `app/api/chat/route.ts`, `app/api/translate/route.ts`, `app/kamus/[kata]/`, `app/kuliner/[slug]/`, `app/lagu/[slug]/`, `app/sumber/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/HalamanMandiri.tsx`, `components/ui/Mahkota.tsx`, `lib/ai.ts`, `lib/situs.ts`, `lib/tautan.ts`, `lib/server/` (basis pengetahuan, klien Gemini, penjaga permintaan, cache, data halaman kata, gambar pratinjau), `public/maskot/`
- **Diubah besar:** `TranslatorSection`, `FloatingChat`, `KulinerSection`, `LaguSection`, `SejarahSection`, `BusanaSection`, `HeroSection`, `MascotShowcase`, `KamusProvider`, `app/globals.css`, `lib/konten.ts`

### Tindak lanjut

| Prioritas | Tindakan |
| --- | --- |
| Tinggi | **Aktifkan billing Gemini** di Google AI Studio. Kuota gratis hanya **20 permintaan per hari per model**; dengan empat model kapasitasnya sekitar 80 pertanyaan per hari, terlalu tipis untuk penjurian. Biaya model flash sangat kecil |
| Tinggi | Beri akses repo ke aplikasi Vercel: github.com/settings/installations → Vercel → Configure → tambahkan `danglupakokomering`. Setelah itu setiap push ke `main` terdeploy otomatis |
| Sedang | Minta penutur asli memeriksa hasil terjemahan Gemini. Pemeriksa otomatis hanya memastikan katanya ada di kamus, bukan bahwa susunan kalimatnya benar |
| Sedang | Isi kredit foto di `KREDIT_FOTO` (`app/sumber/page.tsx`) dan nama penyusun kamus bila diketahui |
| Sedang | Rekam suara penutur asli untuk sapaan, lirik, dan kosakata dasar (PRD 2.2) |
| Rendah | Peta vektor dari data batas wilayah resmi (PRD 2.3) dan seluruh Tahap 3 |

---

## 0. Pembaruan 17 Oktober 2026 — PRD Fase 2

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
| 7 | Jalankan `prd.md` revitalisasi (Tahap 1 & 2) | Optimasi performa, maskot transparan, pembersihan jejak "AI-slop", tata letak khas per bab, Gemini untuk chatbot & penerjemah, halaman mandiri + pratinjau tautan, halaman sumber (lihat bagian Pembaruan 18 Oktober 2026). |

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
| gsap / @gsap/react | dicabut 18 Okt 2026 (diganti CSS & Web Animations API) |
| Google Gemini API | REST `generateContent`, model `gemini-3.5-flash` + cadangan |
| lucide-react | 1.49.0 |
| eslint / eslint-config-next | 9.39.5 / 16.3.8 |

### Struktur folder

Kondisi 17 Oktober 2026. Struktur terbaru ada di [TRD §4](TRD.md#4-struktur-repositori).

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

> Daftar terbaru ada di bagian **Pembaruan 18 Oktober 2026 → Tindak lanjut**. Tabel di bawah berasal dari 17 Oktober.

| Prioritas | Tindakan |
| --- | --- |
| Tinggi | Jika sudah pernah deploy ke Vercel sebagai situs statis ("Other"), ganti Framework Preset ke **Next.js**. |
| Sedang | Pastikan rekaman lagu boleh dipakai untuk lomba. Kredit sudah tercantum (Pencipta: NN, sumber rekaman: video YouTube). |
| Sedang | Minta penutur asli memastikan arti 7 kata lirik bertanda "arti dugaan" (*nyuntuh, tajok, andan, kacaroman, sangon, among, lebu*). Bila sudah pasti, hapus kolom `catatan` di `data/sumber/kamus_tambahan.json` lalu jalankan `npm run kamus`. |
| Rendah | Tinjau asumsi kamus di `data/laporan-perbaikan.md` (koreksi *juadah*, arti ganda *adat*, tiga rujukan "lihat" yang kini diselesaikan). |
| Rendah | (Opsional) Ganti foto juadah dengan foto beresolusi lebih besar; versi sekarang hasil perbesaran dari 149×148 piksel. |
| Rendah | (Opsional) Untuk suara Raka yang sama di semua peramban, rekam suara asli lalu putar rekaman itu di `components/maskot/MascotShowcase.tsx`. |
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

- Branch `main` di `BagaskaraAP-Dev/danglupakokomering` (publik). Pekerjaan 18–21 Oktober 2026 dikerjakan di branch `revitalisasi-prd-tahap-1-2` lalu digabung ke `main` lewat pull request pada 21 Oktober 2026; riwayat lengkap: `git log`.
- Rahasia (`.env.local`, kunci Gemini) tidak dilacak git. Kunci produksi disimpan di Environment Variable Vercel.
- Folder `DOKUMENTASIITFEST2026/` berisi dokumentasi lomba milik tim, bukan buatan asisten.
