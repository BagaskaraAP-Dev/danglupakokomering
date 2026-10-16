# Dang Lupa ko Komering

> *"Jangan lupakan Komering."*

Portal budaya Suku Komering berbasis AI untuk **Vibe Coding IT Festival 2026** bertema *Empowering Culture Through AI-Driven Innovation*. Pengunjung mengenal sejarah, bahasa, marga, busana adat, kuliner, dan lagu Komering bersama pemandu virtual **Raka & Ratih**.

## Fitur

| Bab | Fitur |
| --- | --- |
| Penerjemah AI | Terjemahan dua arah Indonesia ⇄ Basa Kumoring: pencocokan frasa terpanjang, stemming imbuhan, koreksi salah ketik (Levenshtein), skor keyakinan, dan Text-to-Speech |
| Kamus Mini | Pencarian & filter kategori, "Kata Hari Ini" |
| Sejarah | Linimasa 8 era yang bisa dibacakan |
| Peta | Titik interaktif di peta wilayah sebaran Komering |
| Marga | Data kebuayan dengan filter kabupaten |
| Busana & Adat | Titik interaktif makna busana pengantin + rangkaian adat pernikahan |
| Kuliner | Kartu balik berisi bahan & cara membuat |
| Lagu | Musik disintesis Web Audio API dengan lirik karaoke & terjemahan |
| Jajuluk | Generator gelar adat kreasi, unduh kartu PNG |
| Kuis | 10 soal acak dengan penjelasan & skor terbaik |
| Chatbot | Tanya-jawab budaya + terjemahan langsung |

Semua fitur berjalan di browser — tanpa server dan tanpa data pribadi yang dikirim.

## Struktur

```text
├── index.html   Struktur halaman & komponen UI
├── style.css    Tema warna Komering, glassmorphism, animasi
├── data.js      Basis data lokal (kamus, sejarah, marga, kuliner, lagu, kuis, chatbot)
├── app.js       Logika interaktif
└── assets/      Ilustrasi maskot, peta, dan busana adat
```

## Menjalankan

Buka `index.html` langsung di browser — tidak perlu instalasi atau build.

## Deploy ke Vercel

Impor repo ini di [vercel.com/new](https://vercel.com/new) sebagai situs statis (Framework Preset: **Other**, tanpa build command).

## Catatan Kurasi

Kosakata Basa Kumoring disusun dari kosakata umum rumpun Lampungik dan dapat berbeda antar-marga. Istilah adat, data marga, dan kuliner perlu diverifikasi bersama penutur asli dan tokoh adat Komering. Lagu dan jajuluk adalah kreasi untuk edukasi, bukan karya tradisional. Koreksi data cukup dilakukan di `data.js`.
