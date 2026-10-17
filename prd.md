# Product Requirements Document (PRD): Revitalisasi Platform Budaya & Bahasa Komering (Basa Kumoring)

- **Nama Proyek:** Platform Digital Pelestarian Budaya & Bahasa Komering (*Basa Kumoring*)
- **Kategori Kompetisi:** *AI-Driven Innovation* & Pelestarian Budaya Daerah
- **Mesin AI Utama:** Google Gemini API (`gemini-2.5-flash` dengan arsitektur *Hybrid RAG*)
- **Target Hosting & CI/CD:** Vercel (terhubung otomatis dengan repositori GitHub)
- **Prioritas Utama:** Penyelesaian Tahap 1 (Perbaikan Cepat Pra-Penjurian) & Integrasi Gemini API (Tahap 2)

---

## 1. Latar Belakang & Kekuatan Utama yang Wajib Dipertahankan

Situs ini memiliki kedalaman riset dan fondasi teknis yang jarang ditemukan pada situs pelestarian budaya daerah. Dalam seluruh proses perombakan antarmuka dan peningkatan fitur, **empat kekuatan inti berikut tidak boleh hilang**:

1. **Identitas Visual Berakar Budaya:** Palet warna marun–emas khas kain songket, ornamen motif tumpal, serta maskot **Raka dan Ratih** berbusana adat Komering (bukan *template* biru-ungu generik).
2. **Kedalaman Konten & Fitur:** Basis data **3.739 kata kamus** lengkap dengan contoh kalimat, lirik lagu daerah yang berjalan seiring pemutaran lagu, kuis dinamis yang mengambil soal langsung dari kamus, serta generator *Jajuluk* (gelar adat).
3. **Fondasi Teknis Rapi & Ramah Privasi:** Konsol peramban bersih dari *error*, tata letak stabil tanpa pergeseran saat dimuat (*Cumulative Layout Shift* bernilai nol), serta pemrosesan yang menjaga privasi pengguna tanpa mengirim data pribadi.
4. **Kejujuran Data:** Penanda **"arti dugaan"** tetap ditampilkan secara transparan pada kosakata yang maknanya belum sepenuhnya pasti.

---

## 2. Daftar Masalah Utama (Diurutkan dari Dampak Terbesar)

| Prioritas | Masalah Utama | Rincian Temuan Teknis & Pengalaman Pengguna |
| :--- | :--- | :--- |
| **1** | **Beban Halaman Terlalu Berat & Lambat di HP** | • Sekali buka memuat sekitar **7,8 MB**; di simulasi jaringan HP lambat, konten utama baru tampil setelah **28 detik**.<br>• Sebanyak **6,7 MB** berasal dari 3 gambar maskot ukuran asli (masing-masing lebih dari 2 MB) yang hanya dipakai sebagai latar avatar bulat kecil di tombol *chat* dan kartu sapaan (ukuran ideal cukup sekitar 10 KB).<br>• Teks di bagian pembuka (*hero*) disembunyikan sampai JavaScript selesai dan animasinya jalan, sehingga layar terasa kosong lebih lama. |
| **2** | **Pola Bab Berulang (Terdeteksi Anti-Slop)** | Hampir semua bab memakai pola seragam: label kecil `"◆ BAB 0X ◆"`, judul di tengah dengan satu kata emas, paragraf di tengah, lalu deretan kotak. Setelah 3 bab, tampilan terasa monoton dan ditandai oleh *plugin anti-slop* sebagai ciri tampilan buatan AI. |
| **3** | **Ciri Visual "Buatan AI" Lainnya** | • *Badge* kapsul bertuliskan `"Berbasis AI"` di atas judul.<br>• Penggunaan emoji standar sebagai ikon (seperti piala, mahkota, gulungan kertas, termasuk di tombol pilihan).<br>• Efek cahaya emas (*glow*) yang berlebihan di banyak elemen.<br>• Animasi yang bergerak terus-menerus tanpa dipicu interaksi pengguna (maskot "bernapas", efek kilau berulang). |
| **4** | **Gambar Tidak Menyatu dengan Tema** | • Maskot di bab Penerjemah dan Sejarah masih berlatar putih, sehingga tampak seperti kotak putih besar di tengah tema gelap.<br>• Sebagian foto kuliner tampak buram karena resolusi rendah.<br>• Ornamen sudut tipis di pojok panel terlihat pecah seperti *glitch*. |
| **5** | **Peta Kurang Meyakinkan** | • Peta menggunakan gambar ilustrasi yang sudah memiliki teks tercetak, lalu ditimpa lagi dengan titik interaktif sehingga label menjadi dobel.<br>• Ukuran tulisan di peta sangat kecil saat dibuka di HP.<br>• Akurasi geografis belum terjamin. |
| **6** | **Maskot Tersembunyi di Layar Pertama HP** | Di tampilan HP, Raka dan Ratih tidak terlihat pada layar pertama (*above the fold*). Daya tarik visual terbesar situs ini baru muncul setelah pengguna menggulir layar (*scroll*). |
| **7** | **Klaim "AI" Lebih Besar dari Mesinnya** | • Penerjemah masih bekerja kata per kata berdasarkan pencocokan kamus.<br>• *Chatbot* menjawab berdasarkan aturan tetap (*rule-based*). Jika juri mengetik pertanyaan bebas, *chatbot* mudah mentok. Ini menjadi titik lemah utama untuk tema lomba *AI-Driven Innovation*. |
| **8** | **Lafal Tidak Autentik** | Kosakata dan teks *Basa Kumoring* masih dibacakan menggunakan suara *Text-to-Speech* Bahasa Indonesia, sehingga intonasi dan lafalnya tidak sesuai dengan penutur asli. |
| **9** | **Sumber & Kredit Belum Dicantumkan** | Materi sejarah dan asal-usul belum dilengkapi daftar pustaka, serta aset foto kuliner/budaya belum memiliki kredit sumber. |
| **10** | **Struktur Satu Halaman Panjang (SPA Statis)** | Seluruh isi bertumpuk di satu halaman panjang. Tidak ada alamat URL khusus untuk tiap kata atau hidangan, sehingga tidak bisa dibagikan satu per satu atau diindeks secara spesifik oleh Google. |

---

## 3. Rencana Pengembangan Bertahap (Roadmap & Requirements)

### Tahap 1: Perbaikan Cepat (Estimasi: 1–2 Hari | Prioritas Tertinggi Sebelum Penjurian)
Fokus utama tahap ini adalah memangkas waktu muat secara drastis di HP dan menghilangkan seluruh ciri visual "template AI".

#### 1.1 Optimasi Performa & Kecepatan Muat (Target Skor Lighthouse Performance HP: 85 ke Atas)
- **Kompresi Avatar Maskot:** Ubah ukuran 3 gambar maskot yang dipakai pada tombol *chat* dan kartu sapaan menjadi ukuran avatar sebenarnya (`96x96px` atau `128x128px`) dengan format **WebP/AVIF** hingga berukuran sekitar **10 KB per gambar** (menghemat lebih dari 6,6 MB).
- **Render Langsung Teks Hero:** Hapus penyembunyian teks pembuka (*hero*) yang menunggu eksekusi JavaScript selesai. Tampilkan judul dan teks utama seketika melalui HTML/CSS bawaan, sementara animasi berjalan tanpa menghalangi keterbacaan teks.
- **Lazy Loading Aset:** Terapkan atribut `loading="lazy"` dan `decoding="async"` pada seluruh gambar di bawah layar pertama.

#### 1.2 Perbaikan Aset Visual & Penyatuan Tema
- **Transparansi Maskot:** Hapus latar belakang putih pada gambar maskot di bab Penerjemah dan Sejarah, lalu simpan dalam format WebP transparan agar menyatu dengan latar marun gelap.
- **Perbaikan Foto & Ornamen:** Ganti atau tingkatkan resolusi foto kuliner yang buram, serta perbaiki kode SVG/gambar ornamen sudut panel agar tampak tajam dan tidak terlihat seperti *glitch*.
- **Penataan Ulang Hero Versi HP:** Atur tata letak layar pertama pada perangkat seluler agar maskot **Raka dan Ratih** langsung terlihat mendampingi judul utama tanpa perlu di-*scroll*.

#### 1.3 Penghapusan Jejak "AI-Slop" & Variasi Tata Letak Bab
- **Bersihkan Elemen Generik:**
  - Hapus *badge* kapsul `"Berbasis AI"` di atas judul.
  - Ganti seluruh emoji pada ikon dan tombol pilihan dengan ikon SVG kustom bergaya seragam atau ornamen motif tumpal/songket.
  - Kurangi efek pendar cahaya emas (*glow*) yang berlebihan.
  - Hentikan animasi *infinite loop* (maskot bernapas terus-menerus dan efek kilau otomatis); ubah menjadi animasi interaktif yang hanya aktif saat disentuh atau diarahkan kursor.
- **Rombak Pola `"◆ BAB 0X ◆"` Menjadi Tata Letak Khas per Bab:**
  - **Bab Kuliner:** Ubah menjadi tampilan galeri visual berukuran besar (*editorial showcase*).
  - **Bab Sejarah:** Ubah menjadi tata letak garis waktu (*timeline*) mengalir yang merepresentasikan perjalanan waktu di sepanjang sungai.
  - **Bab Lagu Daerah:** Ubah menjadi tampilan pemutar musik layar penuh (*full-screen music player*) dengan fokus pada lirik yang berjalan bersama audio.

#### 1.4 Otomatisasi Deployment
- Hubungkan repositori GitHub langsung ke **Vercel** agar setiap pembaruan kode terpublikasi secara otomatis (*Continuous Deployment*).

---

### Tahap 2: Naik Kelas — Integrasi Gemini AI, Keaslian Budaya, & Pembaruan Struktur
Fokus utama tahap ini adalah menjawab langsung tema kompetisi **AI-Driven Innovation** menggunakan **Google Gemini API** serta memperkuat nilai autentik pelestarian budaya.

#### 2.1 Chatbot & Penerjemah Kontekstual Berbasis Google Gemini API
Untuk menggantikan penerjemah kata per kata dan *chatbot* berbasis aturan tetap tanpa mengorbankan keamanan kunci API maupun privasi pengguna:
- **Keamanan API Key (Vercel Serverless Functions):**
  - Simpan API Key di *Environment Variable* Vercel (misal: `GEMINI_API_KEY`).
  - Buat dua rute *backend* ringan di Vercel: `/api/chat` dan `/api/translate` menggunakan SDK resmi `@google/genai` dengan model **`gemini-2.5-flash`**.
- **Cara Kerja Chatbot Raka & Ratih (*Hybrid RAG*):**
  1. Ketika juri atau pengguna mengajukan pertanyaan bebas, sistem melakukan pencarian cepat pada indeks lokal **3.739 kata kamus** dan materi budaya/sejarah di dalam situs.
  2. Data kamus dan artikel yang relevan dilampirkan sebagai konteks ke **Gemini API**.
  3. Gemini menyusun jawaban yang luwes, menjawab pertanyaan bebas dengan akurat, **menyebutkan sumber datanya** (misalnya merujuk pada entri kamus atau bab sejarah terkait), serta tetap memberi tahu pengguna jika kata yang dirujuk memiliki tanda **"arti dugaan"**.
- **Cara Kerja Penerjemah Kontekstual Gemini:**
  1. Kalimat yang dimasukkan pengguna dicocokkan terlebih dahulu dengan kosakata kamus 3.739 kata beserta contoh kalimatnya.
  2. Gemini merangkai hasil terjemahan yang alami sesuai struktur kalimat *Basa Kumoring*, bukan sekadar mengganti kata satu per satu secara kaku.

#### 2.2 Rekaman Suara Penutur Asli (*Native Speaker Audio*)
- Ganti pembacaan suara robot Bahasa Indonesia dengan rekaman audio asli penutur *Basa Kumoring* (format `.mp3` atau `.ogg` terkompresi) untuk sapaan, lirik lagu, dan kosakata dasar.
- Elemen ini menjadi pembeda paling kuat untuk platform pelestarian bahasa daerah.

#### 2.3 Peta Vektor Interaktif Wilayah Komering
- Ganti gambar peta ilustrasi statis dengan **Peta Vektor Asli (SVG presisi tinggi / GeoJSON)** yang mencakup wilayah **OKU, OKU Timur, OKU Selatan, dan OKI**.
- Pastikan peta dapat di-*zoom* (*pinch-to-zoom*), memiliki satu lapis label yang bersih (tidak dobel), akurat secara geografis, dan tulisannya tetap tajam serta terbaca jelas di layar HP.

#### 2.4 Halaman Mandiri per Entri (Dynamic Routing & Social Preview)
- Buat alamat URL tersendiri untuk setiap kata kamus, hidangan kuliner, dan lagu daerah (contoh: `/kamus/juadah`, `/kuliner/pindang-komering`).
- Tambahkan *OpenGraph Meta Tags* dan gambar pratinjau otomatis (*OG Image*) sehingga saat tautan kata atau kuliner dibagikan ke WhatsApp atau Instagram, muncul kartu pratinjau visual yang rapi dan mudah ditemukan di pencarian Google.

#### 2.5 Halaman Sumber Pustaka & Kredit
- Sediakan bagian atau halaman khusus yang mencantumkan daftar pustaka sejarah, referensi penyusunan kamus, serta kredit pemilik foto kuliner dan dokumentasi budaya.

---

### Tahap 3: Modern & Berkelanjutan (Pengembangan Jangka Panjang)
Fokus tahap ini adalah menjaga keberlanjutan ekosistem situs bersama masyarakat penutur asli.

1. **Kolaborasi Komunitas ("Usulkan Koreksi"):**
   - Tambahkan tombol **"Usulkan Koreksi"** pada setiap entri kata (terutama kata berlabel *"arti dugaan"*) agar penutur asli dapat mengirim masukan perbaikan arti atau contoh kalimat.
2. **Dukungan Offline (Progressive Web App / PWA):**
   - Pasang *Service Worker* dan penyimpanan lokal agar kamus 3.739 kata dan fitur utama tetap dapat diakses secara *offline* di daerah dengan sinyal seluler lemah.
3. **Fitur "Kata Hari Ini" & Kartu Skor Kuis:**
   - Tambahkan fitur **"Kata Hari Ini"** lengkap dengan penghitung hari beruntun (*streak*) serta generator kartu skor hasil kuis yang dapat diunduh dan dibagikan ke media sosial.
4. **Alur Cerita Mengikuti Aliran Sungai (*Way Komering Storytelling*):**
   - Ubah struktur 10 bab yang setara menjadi alur perjalanan naratif yang menyusuri aliran **Way Komering mulai dari hulu di Danau Ranau (OKU Selatan), melintasi OKU dan OKU Timur, hingga hilir di OKI dan bermuara ke Palembang**.
5. **Dukungan Bahasa Inggris & Analitik:**
   - Sediakan versi Bahasa Inggris untuk audiens dan peneliti global, serta pasang **Vercel Analytics** untuk memantau fitur yang paling sering digunakan tanpa melacak data pribadi pengguna.

---

## 4. Spesifikasi Teknis Integrasi Gemini API (Panduan Implementasi)

Berikut adalah struktur kontrak *endpoint* yang akan dipasang ketika `GEMINI_API_KEY` disiapkan:

### Endpoint 1: `POST /api/chat`
- **Input Payload:**
  ```json
  {
    "message": "Apa arti kata juadah dan kapan biasanya disajikan?",
    "history": [],
    "dictionaryContext": [
      {
        "kata": "juadah",
        "arti": "kue tradisional / penganan khas",
        "contoh": "...",
        "status": "terverifikasi"
      }
    ],
    "culturalContext": "Ringkasan bab kuliner tentang penyajian juadah pada acara adat..."
  }
  ```
- **Aturan System Prompt Gemini:**
  - Berperan sebagai maskot budaya **Raka & Ratih**.
  - Wajib mendasarkan jawaban pada `dictionaryContext` dan `culturalContext` yang dikirim bersama pertanyaan.
  - Wajib menyebutkan sumber (misalnya: *"Berdasarkan Kamus Basa Kumoring di situs ini..."*).
  - Wajib mencantumkan catatan apabila kata yang dibahas berstatus `"arti dugaan"`.

### Endpoint 2: `POST /api/translate`
- **Input Payload:**
  ```json
  {
    "text": "Saya ingin belajar bahasa daerah bersama teman",
    "direction": "id-to-komering",
    "matchedWords": [
      { "id": "belajar", "komering": "...", "status": "terverifikasi" },
      { "id": "teman", "komering": "...", "status": "arti dugaan" }
    ]
  }
  ```
- **Output Payload:**
  ```json
  {
    "translation": "...",
    "notes": "Kata '...' menggunakan arti dugaan dalam kamus.",
    "Breakdown": []
  }
  ```

---

## 5. Daftar Periksa Keberhasilan (Definition of Done)

- [ ] **Performa HP:** Beban halaman awal turun dari 7,8 MB menjadi di bawah 800 KB; ukuran gambar avatar maskot sekitar 10 KB; skor *Lighthouse Performance* di HP mencapai 85 ke atas.
- [ ] **Tampilan Layar Pertama HP:** Teks pembuka langsung tampil tanpa menunggu animasi JS, dan maskot Raka & Ratih terlihat jelas di layar pertama tanpa perlu di-*scroll*.
- [ ] **Kualitas Visual & Anti-Slop:** Tidak ada lagi latar putih pada maskot, tidak ada *badge* `"Berbasis AI"`, seluruh emoji telah diganti ikon/motif seragam, animasi berulang telah dimatikan, dan setiap bab memiliki tata letak yang berbeda.
- [ ] **Kecerdasan Gemini AI:** *Chatbot* dan penerjemah terhubung ke Gemini API melalui Vercel Serverless, mampu menjawab pertanyaan bebas juri secara kontekstual, dan selalu menyertakan sumber dari kamus/situs.
- [ ] **Keaslian & Kredibilitas:** Suara sapaan/kata dasar menggunakan rekaman penutur asli, peta berbentuk vektor yang tajam di HP, setiap kata memiliki halaman sendiri, dan halaman sumber/kredit telah tersedia.