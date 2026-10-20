# PRD: Dang Lupa ko Komering

**Product Requirements Document** · portal budaya dan bahasa Suku Komering

| | |
| --- | --- |
| Versi dokumen | 1.0 |
| Tanggal | 19 Oktober 2026 |
| Pemilik produk | Bagaskara Amukti Palapa (BagaskaraAP-Dev) |
| Situs produksi | https://danglupakokomering.mooncrust.my.id (alamat lama `danglupakokomering.vercel.app` dialihkan ke sini) |
| Repositori | `BagaskaraAP-Dev/danglupakokomering` |
| Dokumen terkait | [TRD](TRD.md) (teknis) · [DRD](DRD.md) (desain) · [PRD Revitalisasi](PRD-REVITALISASI.md) (rencana revitalisasi) · [Laporan Pengembangan](LAPORAN-PENGEMBANGAN.md) (log pengerjaan) |

---

## 1. Ringkasan

*Dang Lupa ko Komering* ("Jangan lupakan Komering") adalah portal web untuk mengenal bahasa dan budaya Suku Komering (Ulun Kumoring) dari Sumatera Selatan. Pengunjung bisa menerjemahkan Bahasa Indonesia ⇄ Basa Kumoring, mencari kata di kamus 3.739 entri, membaca sejarah dan peta wilayah, mengenal marga, busana adat, kuliner, dan lagu daerah, lalu bertanya bebas kepada pemandu virtual **Raka & Ratih**.

Situs ini dibuat untuk **Vibe Coding IT Festival 2026** bertema *Empowering Culture Through AI-Driven Innovation*. AI dipakai untuk hal yang benar-benar membantu pelestarian bahasa: menyusun terjemahan kalimat dan menjawab pertanyaan, dengan jawaban yang selalu bersandar pada data kamus situs dan menyebut sumbernya.

## 2. Latar belakang dan masalah

1. **Bahasa daerah kehilangan penutur muda.** Basa Kumoring (ISO 639-3: `kge`) masih dipakai di kampung, tetapi generasi muda dan perantau jarang memakainya. Materi belajar yang mudah diakses dari HP hampir tidak ada.
2. **Data bahasa tersebar dan sulit dipakai.** Kamus Basa Kumoring tersedia sebagai berkas mentah (JSON/CSV) dengan singkatan, ejaan ganda, dan rujukan silang yang belum rapi. Orang awam tidak bisa memakainya langsung.
3. **Penerjemah umum tidak mengenal Komering.** Layanan terjemahan populer tidak mendukung Basa Kumoring, dan model bahasa umum cenderung mengarang kata yang terdengar meyakinkan tetapi salah.
4. **Budaya dikenalkan sepotong-sepotong.** Sejarah, marga, adat pernikahan, kuliner, dan lagu daerah jarang tersaji dalam satu tempat yang enak dijelajahi.

## 3. Visi, tujuan, dan non-tujuan

**Visi:** mengenal Komering terasa dekat, seru, dan selalu ada di genggaman, tanpa mengorbankan kejujuran data.

### Tujuan

| ID | Tujuan | Ukuran keberhasilan |
| --- | --- | --- |
| G-1 | Pengunjung bisa memahami dan memakai kosakata Komering dasar | Kamus bisa dicari dua arah; setiap kata punya halaman sendiri yang bisa dibagikan |
| G-2 | Pertanyaan bebas tentang Komering dijawab dengan benar dan bersumber | Jawaban chat menyebut sumber (entri kamus atau bab situs) dan menolak menebak bila data tidak ada |
| G-3 | Situs cepat dan nyaman di HP kelas menengah | Lighthouse HP Performance ≥ 85; berat halaman awal < 800 KB |
| G-4 | Identitas visual berakar budaya Komering | Palet marun-emas songket, motif tumpal, maskot berbusana adat; tidak memakai pola template generik |
| G-5 | Data jujur dan dapat ditelusuri | Kata yang artinya belum pasti diberi label "arti dugaan"; halaman `/sumber` mencantumkan asal data |

### Non-tujuan (versi ini)

- Bukan kamus resmi atau rujukan akademik. Situs menyajikan data kamus yang ada beserta catatan keraguannya.
- Tidak ada akun pengguna, login, atau penyimpanan data pribadi di server.
- Tidak ada rekaman suara penutur asli (masih Text-to-Speech peramban; direncanakan, lihat §8).
- Tidak menerjemahkan dokumen panjang. Batas terjemahan 400 karakter per permintaan.

## 4. Pengguna sasaran

| Persona | Kebutuhan utama | Fitur yang paling dipakai |
| --- | --- | --- |
| **Generasi muda Komering** (pelajar, mahasiswa) | Belajar kosakata dan ungkapan sehari-hari, bangga pada asal-usul | Penerjemah, kamus, kuis, jajuluk |
| **Perantau dan keluarga campuran** | Mengingat atau mengajarkan bahasa ke anak | Kamus, lagu berlirik, sapaan yang dibacakan |
| **Juri lomba dan pengunjung umum** | Melihat cara AI dipakai untuk budaya dengan cepat | Hero, chat Raka & Ratih, penerjemah Gemini |
| **Peneliti dan pegiat budaya** | Menelusuri data dan sumbernya | Halaman per kata, halaman `/sumber`, label arti dugaan |
| **Penutur asli** (kurator masa depan) | Memeriksa dan mengoreksi arti | Halaman per kata; fitur "Usulkan Koreksi" direncanakan (§8) |

## 5. Prinsip produk

Empat kekuatan inti ini tidak boleh hilang dalam pengembangan apa pun:

1. **Identitas visual berakar budaya.** Palet marun-emas songket, motif tumpal dan pucuk rebung, maskot Raka & Ratih berbusana adat. Rincian di [DRD](DRD.md).
2. **Kedalaman konten.** Kamus 3.739 kata beserta 3.658 contoh kalimat, lirik yang berjalan bersama lagu, kuis yang mengambil soal dari kamus.
3. **Teknis rapi dan menjaga privasi.** Konsol tanpa galat, tata letak tidak bergeser saat dimuat (CLS 0), tidak ada data pribadi yang disimpan.
4. **Kejujuran data.** AI hanya boleh memakai kata yang ada di kamus. Arti yang belum pasti selalu ditandai. Jawaban cadangan dari kamus selalu diberi label ("dari kamus", "kata per kata"). Nama merek AI tidak ditampilkan di antarmuka; catatan di laci obrolan tetap memberi tahu bahwa pertanyaan diproses AI.

## 6. Kebutuhan fungsional

Status: **Selesai** = berjalan di produksi · **Sebagian** = berjalan dengan keterbatasan yang dicatat · **Belum** = direncanakan.

### 6.1 Navigasi dan beranda

| ID | Kebutuhan | Status |
| --- | --- | --- |
| FR-NAV-1 | Navbar tetap di atas berisi logo dan 10 menu bab (Penerjemah, Kamus, Sejarah, Peta, Marga, Busana & Adat, Kuliner, Lagu, Jajuluk, Kuis). Penanda menu aktif mengikuti bab yang sedang dibaca | Selesai |
| FR-NAV-2 | Di layar kecil menu dilipat menjadi menu seluler yang bisa dibuka dan ditutup | Selesai |
| FR-NAV-3 | Tautan "Lewati ke konten utama" untuk pengguna papan ketik dan pembaca layar | Selesai |
| FR-HERO-1 | Judul dan teks pembuka tampil tanpa menunggu JavaScript | Selesai |
| FR-HERO-2 | Raka & Ratih terlihat di layar pertama HP (urutan: judul → maskot → isi) | Selesai |
| FR-HERO-3 | Mengetuk Raka memutar sapaan "Tabik pun!" dengan suara; kartu "Raka & Ratih menyapa" membacakan sapaan bergilir beserta artinya dengan sorotan kata | Selesai |
| FR-HERO-4 | Statistik kamus (jumlah kata, contoh kalimat, dsb.) diambil dari data kamus saat build, bukan angka tulisan tangan | Selesai |

### 6.2 Penerjemah Indonesia ⇄ Basa Kumoring

| ID | Kebutuhan | Status |
| --- | --- | --- |
| FR-TR-1 | Terjemahan kata per kata instan di peramban saat mengetik (mesin lokal) | Selesai |
| FR-TR-2 | Tombol **Terjemahkan** mengirim teks ke Gemini yang menyusun kalimat alami hanya dari entri kamus dan contoh kalimat yang relevan | Selesai |
| FR-TR-3 | Kata Komering hasil Gemini yang tidak ditemukan di kamus diberi tanda **"periksa"** | Selesai |
| FR-TR-4 | Bila AI gagal atau kuota habis, hasil mesin lokal tetap tampil dengan label "kata per kata" dan toast penjelasan | Selesai |
| FR-TR-5 | Tukar arah terjemahan, salin hasil, dengarkan hasil, skor keyakinan, dan rincian per kata yang bisa diklik untuk membuka kamus | Selesai |
| FR-TR-6 | Masukan dibatasi 400 karakter | Selesai |

### 6.3 Kamus Basa Kumoring

| ID | Kebutuhan | Status |
| --- | --- | --- |
| FR-KM-1 | 3.739 kata (1.808 kata dasar, 1.931 turunan) dengan 3.658 contoh kalimat | Selesai |
| FR-KM-2 | Pencarian dua arah (Komering atau Indonesia) dengan peringkat, filter kelas kata, "kata dasar saja", "kata acak" | Selesai |
| FR-KM-3 | Setiap entri menampilkan kelas kata, arti, varian ejaan, kata dasar, kata turunan, rujukan "lihat juga", dan contoh kalimat | Selesai |
| FR-KM-4 | Kata yang artinya belum pasti diberi label **"arti dugaan"** dan tidak dipakai korpus penerjemah maupun kuis | Selesai |
| FR-KM-5 | Entri sensitif tetap bisa dicari tetapi tidak tampil acak (kuis, kata acak, kata hari ini) | Selesai |
| FR-KM-6 | Setiap kata punya halaman sendiri `/kamus/<kata>` dengan judul, deskripsi, gambar pratinjau tautan, dan data terstruktur | Selesai |
| FR-KM-7 | Tombol kata di bagian mana pun (penerjemah, kuliner, lagu, chat, adat) membuka kata itu di bab Kamus | Selesai |

### 6.4 Bab budaya

| ID | Kebutuhan | Status |
| --- | --- | --- |
| FR-SJ-1 | **Sejarah:** garis waktu 8 era mengikuti alur sungai dari hulu ke hilir; bisa dibacakan | Selesai |
| FR-PT-1 | **Peta:** 7 titik interaktif wilayah sebaran Komering beserta daftar lokasi | Sebagian (masih gambar ilustrasi, belum peta vektor) |
| FR-MG-1 | **Marga:** 10 kebuayan dengan filter kabupaten dan pencarian | Selesai |
| FR-BS-1 | **Busana & Adat:** 8 titik pada busana pengantin dan 9 tahapan pernikahan adat bertaut ke kamus | Selesai |
| FR-KL-1 | **Kuliner:** 7 hidangan berfoto dalam daftar menu bernomor; tiap hidangan punya kisah, bahan, cara menikmati, fakta unik, kosakata dapur, dan halaman `/kuliner/<slug>` | Selesai (foto lama beresolusi rendah) |
| FR-LG-1 | **Lagu:** rekaman "Dang Lupa ko Komering" dengan lirik tersorot per baris, ketuk baris untuk melompat, terjemahan, mode layar penuh, kredit (pencipta NN) dan halaman `/lagu/<slug>` | Selesai |
| FR-JJ-1 | **Jajuluk:** generator gelar adat dari nama, bisa didengarkan, diacak, dibagikan, dan diunduh sebagai kartu PNG | Selesai |
| FR-KS-1 | **Kuis:** 10 soal acak (6 budaya + 4 kosakata dari kamus); skor terbaik disimpan di peramban | Selesai |

### 6.5 Tanya Raka & Ratih (chat)

| ID | Kebutuhan | Status |
| --- | --- | --- |
| FR-CH-1 | Tombol mengambang membuka laci obrolan (samping di desktop, panel bawah di HP) | Selesai |
| FR-CH-2 | Pertanyaan bebas dijawab Gemini hanya dari konteks kamus dan bab situs yang dicari server (hybrid RAG) | Selesai |
| FR-CH-3 | Sumber yang dipakai tampil sebagai tombol di bawah jawaban dan membuka bab atau kata terkait | Selesai |
| FR-CH-4 | Bila data tidak cukup, Raka/Ratih mengatakannya terus terang dan menyarankan bab terdekat | Selesai |
| FR-CH-5 | Pertanyaan di luar topik Komering ditolak dengan sopan; perintah yang menyuruh mengubah peran diabaikan | Selesai |
| FR-CH-6 | Bila AI tidak tersedia, chatbot lokal berbasis niat menjawab dengan label "dari kamus" | Selesai |
| FR-CH-7 | Catatan di laci obrolan memberi tahu bahwa pertanyaan diproses AI di server (tanpa menyebut merek) | Selesai |

### 6.6 Halaman pendukung

| ID | Kebutuhan | Status |
| --- | --- | --- |
| FR-SB-1 | Halaman `/sumber` memuat asal data kamus, rujukan sejarah, kredit lagu dan foto, peran AI, serta teknologi | Sebagian (kredit foto kuliner dan nama penyusun kamus belum tercatat) |
| FR-SEO-1 | `sitemap.xml` memuat semua halaman publik (3.647 alamat) dan `robots.txt` menutup `/api/` | Selesai |
| FR-SEO-2 | Setiap halaman mandiri punya gambar pratinjau 1200×630 bergaya marun-emas untuk WhatsApp dan media sosial | Selesai |

## 7. Kebutuhan nonfungsional

| ID | Kategori | Kebutuhan | Kondisi terakhir (18 Okt 2026) |
| --- | --- | --- | --- |
| NFR-1 | Performa | Lighthouse HP Performance ≥ 85; berat halaman awal < 800 KB; CLS 0 | 86–93 · 484 KB · CLS 0 |
| NFR-2 | Aksesibilitas | Lighthouse Accessibility 100; kontras teks minimal WCAG AA; semua kontrol bisa dipakai dengan papan ketik; menghormati `prefers-reduced-motion` | 100 |
| NFR-3 | SEO | Lighthouse SEO 100; judul, deskripsi, canonical, dan JSON-LD di setiap halaman mandiri | 100 |
| NFR-4 | Privasi | Tidak ada akun, cookie pelacak, atau analitik pihak ketiga. Hanya teks pertanyaan/terjemahan yang dikirim ke Gemini. Skor kuis disimpan lokal di peramban | Terpenuhi |
| NFR-5 | Keamanan | Kunci API hanya di server; permintaan lintas situs ditolak; batas laju per IP; panjang masukan dibatasi | Terpenuhi (rincian di [TRD §9](TRD.md#9-keamanan-dan-privasi)) |
| NFR-6 | Keandalan AI | Fitur inti tetap jalan tanpa Gemini (mesin lokal sebagai cadangan); waktu tunggu jawaban maksimal 30 detik | Chat 2,6–3,4 dtk · terjemahan 1,4 dtk |
| NFR-7 | Kompatibilitas | Chrome, Edge, Safari, Firefox versi terkini; lebar layar 360 px ke atas tanpa geser horizontal | Diuji di 390 px dan 1440 px |
| NFR-8 | Kualitas kode | `tsc`, ESLint, dan `next build` lolos tanpa galat sebelum setiap rilis | Terpenuhi |

## 8. Peta jalan

Rencana rinci beserta latar belakang masalahnya ada di [PRD Revitalisasi](PRD-REVITALISASI.md). Ringkasan statusnya:

| Tahap | Poin | Status |
| --- | --- | --- |
| **1. Perbaikan cepat** | Kompresi aset, hero tanpa menunggu JS, maskot transparan, pembersihan elemen generik, tata letak khas per bab | Selesai |
| | Foto kuliner beresolusi tinggi | Belum (menunggu foto asli yang lebih besar) |
| | Deploy otomatis GitHub → Vercel | Belum (aplikasi Vercel belum diberi akses ke repo; deploy masih lewat Vercel CLI) |
| **2. Naik kelas** | Chatbot & penerjemah Gemini, halaman mandiri, halaman sumber | Selesai |
| | Rekaman suara penutur asli (sapaan, lirik, kosakata dasar) | Belum |
| | Peta vektor (SVG/GeoJSON) OKU, OKU Timur, OKU Selatan, OKI | Belum |
| **3. Berkelanjutan** | Tombol "Usulkan Koreksi" per entri, PWA offline, streak "Kata Hari Ini", kartu skor kuis, alur cerita menyusuri Way Komering, versi Bahasa Inggris, Vercel Analytics | Belum |

## 9. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Kuota Gemini gratis hanya ±20 permintaan/hari/model | Chat dan terjemahan Gemini berhenti saat ramai (mis. penjurian) | Rantai 4 model, cache jawaban 6 jam, mesin lokal sebagai cadangan. **Aktifkan billing Google AI Studio** sebelum penjurian |
| Gemini menyusun kalimat Komering yang tata bahasanya keliru | Pengguna belajar kalimat yang salah | Gemini hanya boleh memakai kata dari kamus; kata di luar kamus ditandai "periksa"; perlu tinjauan penutur asli |
| Arti 7 kata lirik masih dugaan | Informasi keliru | Label "arti dugaan", tidak masuk korpus dan kuis, dicatat di `data/laporan-perbaikan.md` |
| Hak cipta rekaman lagu dan foto kuliner belum jelas | Konten harus diturunkan | Kredit dicantumkan di bab Lagu dan `/sumber`; pastikan izin sebelum dipakai di luar lomba |
| Suara Text-to-Speech berbeda antarperamban dan tidak berlafal Komering | Lafal tidak autentik | Pemberitahuan di halaman kata; rekaman penutur asli di Tahap 2 |
| Batas laju dan cache hidup di memori instance serverless | Batas bisa ditembus bila banyak instance | Cukup untuk skala lomba; WAF/KV bila trafik membesar (lihat [TRD §15](TRD.md#15-batasan-dan-utang-teknis)) |

## 10. Asumsi, ketergantungan, dan pertanyaan terbuka

**Ketergantungan:** Vercel (hosting dan fungsi serverless), Google Gemini API, Google Fonts lewat `next/font`, Web Speech API peramban.

**Asumsi:** data di `data/sumber/kamus_komering.json` adalah sumber kebenaran untuk kosakata dan tidak diubah langsung; tambahan proyek masuk ke `data/sumber/kamus_tambahan.json`.

**Pertanyaan terbuka:**

1. Siapa penyusun Kamus Basa Kumoring sumber dan bagaimana lisensinya?
2. Siapa pemilik foto kuliner? (`KREDIT_FOTO` di `app/sumber/page.tsx` masih kosong.)
3. Apakah rekaman lagu boleh dipakai di luar lomba?
4. Siapa penutur asli yang bisa memverifikasi arti dugaan dan hasil terjemahan Gemini?

## 11. Riwayat dokumen

| Versi | Tanggal | Perubahan |
| --- | --- | --- |
| 1.0 | 19 Okt 2026 | Dokumen pertama, disusun dari kondisi produksi setelah revitalisasi Tahap 1 & 2 |
