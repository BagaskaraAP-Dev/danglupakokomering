# PRD: Penggantian Gambar Maskot Hero dengan Video Interaktif 3D

> **Status: selesai 20–21 Oktober 2026**, diterapkan di `components/maskot/MascotShowcase.tsx`. Isi PRD asli di bawah dibiarkan apa adanya; penyesuaian saat penerapan:
>
> - Gambar maskot hero ternyata ada di `MascotShowcase`, bukan di `HeroSection` (bingkainya `.bingkai-lengkung`, bukan `figure.bingkai-hero`), jadi `HeroSection` tetap Server Component.
> - Tinggi tetap 380–480 px diganti bingkai lengkung 4:5 yang sudah ada dengan `object-position: top`, sehingga mahkota tidak terpotong lengkungan.
> - Poster memakai bingkai pertama video (`/maskot/poster-video-hero.webp`, 51 KB), bukan `/maskot-pasangan-hero.jpg`, agar gambar tidak melompat saat video mulai. Gambar lama dihapus.
> - Video dipotong ke area bingkai dan dikecilkan: 640×800, 647 KB (dari 5,1 MB). Berkas asli disimpan di `DOKUMENTASIITFEST2026/00-bahan/video-maskot-3d-asli.mp4`. Semula `preload="none"` dan diputar setelah hidrasi; sejak 21 Okt memakai `autoPlay` + `preload="auto"` karena di HP hidrasi memakan 5–8 detik sehingga video tampak diam. Gerak dikurangi: dihentikan di bingkai pertama begitu halaman siap.
> - Tombol Suara/Bisu (dan tombol jeda) sempat dibuat lalu **dihapus atas permintaan pemilik**. Suara kini terdengar saat Raka disentuh (video melompat ke sapaan sehingga bibir pas dengan suara) dan otomatis setiap Raka selesai menunduk, setelah pengunjung pertama kali berinteraksi dengan halaman (aturan autoplay peramban).
> - Tanpa tombol jeda, WCAG 2.2.2 (jeda gerak > 5 detik) dan 1.4.2 (kontrol audio otomatis) tidak terpenuhi; video berhenti saat tergulir keluar layar.

1. Tujuan (Objective)

Mengganti gambar statis /maskot-pasangan-hero.jpg pada komponen components/HeroSection.tsx dengan video animasi /video3d-maskot-pasangan-hero.mp4 (atau /maskot/video3d-maskot-pasangan-hero.mp4 jika disalin ke dalam subfolder public/maskot/). Video menampilkan animasi maskot Raka & Ratih memberi salam dan mengucapkan "Tabik Pun" diiringi musik suling tradisional.

2. Lokasi File & Komponen Terkait

Komponen Target: components/HeroSection.tsx (Baris 92–113, pada bagian <figure className="bingkai-hero ...">)

Path Video di public/: /video3d-maskot-pasangan-hero.mp4

Path Fallback/Poster di public/: /maskot-pasangan-hero.jpg

3. Spesifikasi Fungsional & Teknis

3.1. Implementasi Tag <video>

Ganti komponen <Image src="/maskot-pasangan-hero.jpg" ... /> di dalam components/HeroSection.tsx menjadi elemen HTML5 <video>.

Gunakan atribut wajib berikut agar video langsung berputar tanpa diblokir browser:

autoPlay

loop

muted (default muted saat halaman pertama kali dibuka agar autoplay berjalan lancar)

playsInline

poster="/maskot-pasangan-hero.jpg"

Sediakan <source src="/video3d-maskot-pasangan-hero.mp4" type="video/mp4" /> (dan fallback <source src="/maskot/video3d-maskot-pasangan-hero.mp4" type="video/mp4" /> bila file juga diletakkan di dalam folder public/maskot/).

3.2. Fitur Tombol Suara ("Tabik Pun")

Karena video memiliki audio sapaan "Tabik Pun" dan alunan suling, tambahkan state isMuted (useState(true)) dan videoRef (useRef<HTMLVideoElement>(null)).

Buat tombol interaktif di pojok kanan atas/bawah bingkai video untuk menyalakan/mematikan suara (Unmute/Mute).

Saat tombol ditekan untuk menyalakan suara (isMuted === false), set video.muted = false supaya pengunjung bisa langsung mendengar sapaan "Tabik Pun".

3.3. Penyesuaian Rasio Aspek & Estetika (Anti-AI Slop)

Rasio & Object Fit: Video memiliki orientasi vertikal/potret dengan latar belakang krem hangat (#F5EBE1 / senada dengan lapisan-krem). Gunakan class w-full h-[380px] sm:h-[440px] lg:h-[480px] object-cover object-top bg-[#F4EAE0] agar kepala dan mahkota (Paksangkong & Kopiah Emas) serta gerakan menunduk maskot terlihat utuh dan proporsional di dalam .bingkai-hero.

Penyatuan Visual: Pertahankan badge figcaption "Raka & Ratih — Duta Muda Komering" di bagian bawah bingkai serta ornamen sudut emas yang sudah ada.

Hormati Preferensi Pengguna: Jika pengguna mengaktifkan prefers-reduced-motion, sediakan perilaku yang tetap aman dan nyaman.

4. Prompt Siap Pakai (Copy-Paste Langsung ke Claude Code / Cursor / AI Agent)

Salin blok perintah di bawah ini dan tempelkan langsung ke AI Agent Anda:

Tolong update file `components/HeroSection.tsx` untuk mengganti gambar statis `/maskot-pasangan-hero.jpg` menjadi video `/video3d-maskot-pasangan-hero.mp4` yang sudah ada di folder `public/`.

Ketentuan implementasi:
1. Ubah `components/HeroSection.tsx` menjadi Client Component (`"use client"` di baris paling atas) atau buat sub-komponen video client jika diperlukan, lalu gunakan `useRef` dan `useState` untuk mengontrol elemen `<video>`.
2. Ganti komponen `<Image src="/maskot-pasangan-hero.jpg" ... />` di dalam `<figure className="bingkai-hero ...">` dengan elemen `<video>`:
   - Gunakan atribut: `autoPlay`, `loop`, `muted={isMuted}`, `playsInline`, `preload="auto"`, dan `poster="/maskot-pasangan-hero.jpg"`.
   - Tambahkan `<source src="/video3d-maskot-pasangan-hero.mp4" type="video/mp4" />` dan fallback `<source src="/maskot/video3d-maskot-pasangan-hero.mp4" type="video/mp4" />`.
3. Karena video berorientasi vertikal dengan latar krem hangat, atur styling `<video>` menjadi `w-full h-[380px] sm:h-[430px] lg:h-[470px] object-cover object-top bg-[#f3eadf] block` agar mahkota dan gerakan membungkuk memberi salam ("Tabik Pun") tidak terpotong.
4. Tambahkan tombol toggle suara (Mute/Unmute) yang elegan sesuai desain tema Komering (warna marun/emas, tanpa gaya generik AI) di pojok kanan atas di dalam `<figure>` dengan teks singkat seperti "🔊 Suara Sapaan" (saat muted) dan "🔇 Bisu" (saat unmuted). Saat di-unmute, pastikan `videoRef.current.muted = false` dan `videoRef.current.play()` dipanggil.
5. Pertahankan seluruh elemen yang sudah ada di sekitarnya (ornamen sudut emas, figcaption "Raka & Ratih", serta struktur layout HeroSection). Pastikan tidak ada error TypeScript atau ESLint.


5. Kriteria Selesai (Definition of Done)

[x] Gambar statis di Hero Section berganti menjadi video animasi 3D Raka & Ratih.

[x] Video otomatis berputar (autoplay, loop, muted) saat web dibuka di Desktop dan HP.

[x] Tombol suara berfungsi menyalakan audio sapaan "Tabik Pun" dan suling.

[x] Mahkota dan tubuh maskot tampil proporsional, tidak terpotong pada bagian kepala.