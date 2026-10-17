# PRD FASE 2: INTERAKSI SUARA RAKA & RATIH TANPA ERROR + PEMBERSIHAN UI

## 1. PERBAIKAN UTAMA MASKOT & KARTU SAPAAN (`components/MascotShowcase.tsx` & `lib/suara.ts`)

### A. Bersihkan Wajah Raka & Interaksi Sentuh Langsung ("Tabik Pun!")
1. **Hapus Balon Teks & Badge di Atas Maskot:**
   - **HAPUS** kotak balon bicara (`RAKA`, `Tabik Pun! 👋`, `Api kabar? · Salam hormat — apa kabar?`) yang menutupi wajah Raka.
   - **HAPUS** floating badge `||||| AI Penerjemah` di depan dada Raka.
   - Biarkan ilustrasi 3D Raka & Ratih di dalam bingkai lengkung tampil bersih sepenuhnya.
2. **Klik / Pegang Raka Langsung Bersuara "Tabik Pun":**
   - Buat area klik/sentuh transparan (`cursor-pointer`) tepat pada tubuh karakter Raka di sisi kiri bingkai.
   - Saat Raka dipegang/diklik (`onClick`), **jangan tampilkan tulisan apapun**, cukup berikan efek animasi skala/cahaya emas halus pada Raka dan langsung keluarkan suara pria ramah mengucapkan **"Tabik pun!"**.

### B. Suara Otomatis Kartu "Raka & Ratih Menyapa" (Hapus Tulisan "Belum Diisi Suara")
1. **Hapus Peringatan / Toast "Belum Diisi Suara":**
   - **HAPUS TOTAL** semua logika pemanggilan toast, teks fallback, atau pesan peringatan yang memunculkan tulisan *"belum diisi suara"* / *"audio belum tersedia"* di `MascotShowcase.tsx` maupun `lib/suara.ts`.
   - Hentikan percobaan pemuatan file `.mp3` kosong (`public/tabik-pun.mp3`, `public/audio/sapaan/holau-nihan-tiuh-kumoring.mp3`, dll.) yang menyebabkan error 404 di konsol browser.
2. **Aktifkan Suara Langsung untuk Seluruh Sapaan Bergilir:**
   - Saat tombol speaker di kartu *"Raka & Ratih menyapa"* diklik, langsung bunyikan suara menggunakan Web Speech API (`SpeechSynthesisUtterance` bahasa Indonesia `id-ID` yang diatur natural) sesuai kalimat yang sedang tampil:
     * **"Holau nihan tiuh Kumoring!"** → Ucapkan: *"Holau nihan tiuh Kumoring! Indah sekali kampung Komering!"*
     * **"Payu kita liak jama-jama!"** → Ucapkan: *"Payu kita liak jama-jama! Mari kita lihat bersama-sama!"*
     * **"Tabik! Api kabar?"** → Ucapkan: *"Tabik! Api kabar? Permisi! Apa kabar?"*
     * **"Dang lupa basa kita!"** → Ucapkan: *"Dang lupa basa kita! Jangan lupa bahasa kita!"*
   - Sinkronkan event `onboundary` / durasi bicara dengan efek sorotan kata satu per satu (karaoke highlight) dan animasi riak gelombang pada tombol speaker hingga kalimat selesai diucapkan.

---

## 2. PEMBERSIHAN UI & KONFIGURASI NEXT.JS (`next.config.ts`)
- Tambahkan `devIndicators: false` pada `next.config.ts` untuk menyembunyikan tombol bulat berhuruf "N" (Next.js Dev Indicator) di pojok kiri bawah layar.

---

## 3. PENYELESAIAN DATA KAMUS, LAGU, & KULINER
1. **Tambahkan 7 Kosakata Lirik Lagu ke Kamus (`data/sumber/kamus_komering.json`):**
   - Tambahkan kata `nyuntuh`, `tajok`, `andan`, `kacaroman`, `sangon`, `among`, dan `lebu` beserta arti dan contoh kalimatnya, lalu jalankan `npm run kamus`.
2. **Perbaiki Entri Kamus yang Meragukan:**
   - Pastikan entri `juadah` berarti *"kue basah tradisional khas Komering (juadah basah)"* (tanpa kata *"dodol"*), perbaiki arti `adat`, dan tuntaskan 3 rujukan *"lihat ..."* yang belum selesai.
3. **Kredit Lagu & Optimasi Foto Kuliner:**
   - Tambahkan keterangan sumber/pencipta pada `components/LaguSection.tsx`.
   - Berikan peningkatan tampilan/bingkai pada foto `public/kuliner/juadah-basah.jpeg` di `components/KulinerSection.tsx` agar tampak tajam dan seragam dengan foto kuliner lainnya.
4. **Verifikasi Akhir:**
   - Jalankan `npm run typecheck`, `npm run lint`, dan `npm run build` hingga dipastikan 0 error, tidak ada lagi pesan *"belum diisi suara"*, dan seluruh sapaan bersuara lancar.