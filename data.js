/* =============================================================================
   Dang Lupa ko Komering — data.js
   Basis data lokal (tanpa server): kamus & frasa, sejarah, wilayah, marga,
   busana & adat, kuliner, lagu, jajuluk, kuis, dan basis pengetahuan chatbot.

   CATATAN KURASI
   Kosakata Basa Kumoring di sini disusun dari kosakata umum rumpun Lampungik
   dan dapat berbeda antar-marga/dialek. Validasi bersama penutur asli & tokoh
   adat Komering sebelum dipakai sebagai rujukan resmi. Format kamus:
     id  : kata/frasa Indonesia, alternatif dipisah "|" (yang pertama = utama)
     km  : padanan Basa Kumoring, alternatif dipisah "|"
     kat : kategori (lihat DATA.kategori)
   ============================================================================= */

const DATA = {
  meta: {
    nama: 'Dang Lupa ko Komering',
    arti: 'Jangan lupakan Komering',
    acara: 'Vibe Coding IT Festival 2026',
    tema: 'Empowering Culture Through AI-Driven Innovation',
  },

  /* Sapaan bergilir di hero */
  sapaan: [
    { km: 'Tabik pun! Api kabar?', id: 'Salam hormat! Apa kabar?' },
    { km: 'Salamat ratong di tanoh Kumoring!', id: 'Selamat datang di tanah Komering!' },
    { km: 'Dang lupa basa ram!', id: 'Jangan lupa bahasa kita!' },
    { km: 'Ram belajar jama-jama, yuk!', id: 'Kita belajar bersama-sama, yuk!' },
  ],

  kategori: {
    sapaan: 'Sapaan',
    ganti: 'Kata Ganti',
    tanya: 'Kata Tanya',
    angka: 'Angka',
    kerja: 'Kata Kerja',
    sifat: 'Kata Sifat',
    ket: 'Keterangan',
    orang: 'Orang',
    alam: 'Alam & Benda',
    tubuh: 'Tubuh',
    budaya: 'Budaya',
  },

  kamus: [
    // Sapaan & ungkapan
    { id: 'permisi|salam hormat', km: 'tabik pun', kat: 'sapaan', contoh: ['Tabik pun, nyak haga liak.', 'Permisi, saya mau melihat.'] },
    { id: 'terima kasih', km: 'tarima kasih', kat: 'sapaan' },
    { id: 'maaf', km: 'ngalimpura', kat: 'sapaan' },
    { id: 'selamat datang', km: 'salamat ratong', kat: 'sapaan', contoh: ['Salamat ratong di lamban sikam.', 'Selamat datang di rumah kami.'] },

    // Kata ganti
    { id: 'saya|aku', km: 'nyak', kat: 'ganti', contoh: ['Nyak haga mangan.', 'Saya mau makan.'] },
    { id: 'kamu|engkau', km: 'niku', kat: 'ganti', contoh: ['Niku dapok cawa Basa Kumoring?', 'Kamu bisa berbicara Bahasa Komering?'] },
    { id: 'dia', km: 'ia', kat: 'ganti' },
    { id: 'kami', km: 'sikam', kat: 'ganti' },
    { id: 'kita', km: 'ram', kat: 'ganti', contoh: ['Ram mangan jama-jama.', 'Kita makan bersama-sama.'] },
    { id: 'kalian', km: 'kuti', kat: 'ganti' },
    { id: 'mereka', km: 'tian', kat: 'ganti', contoh: ['Tian ratong jak Martapura.', 'Mereka datang dari Martapura.'] },

    // Kata tanya
    { id: 'apa', km: 'api', kat: 'tanya' },
    { id: 'siapa', km: 'sapa', kat: 'tanya' },
    { id: 'di mana|ke mana|mana', km: 'dipa', kat: 'tanya', contoh: ['Niku haga mit dipa?', 'Kamu mau pergi ke mana?'] },
    { id: 'berapa', km: 'pira', kat: 'tanya' },
    { id: 'mengapa|kenapa', km: 'ngapi', kat: 'tanya' },
    { id: 'bagaimana', km: 'repa', kat: 'tanya' },

    // Angka
    { id: 'satu', km: 'sai', kat: 'angka' },
    { id: 'dua', km: 'rua', kat: 'angka' },
    { id: 'tiga', km: 'telu', kat: 'angka' },
    { id: 'empat', km: 'pak', kat: 'angka' },
    { id: 'lima', km: 'lima', kat: 'angka' },
    { id: 'enam', km: 'enom', kat: 'angka' },
    { id: 'tujuh', km: 'pitu', kat: 'angka' },
    { id: 'delapan', km: 'walu', kat: 'angka' },
    { id: 'sembilan', km: 'siwa', kat: 'angka' },
    { id: 'sepuluh', km: 'sapuluh', kat: 'angka' },

    // Kata kerja
    { id: 'makan', km: 'mangan', kat: 'kerja', contoh: ['Nyak radu mangan.', 'Saya sudah makan.'] },
    { id: 'minum', km: 'nginum', kat: 'kerja' },
    { id: 'tidur', km: 'pedom', kat: 'kerja', contoh: ['Sanak lunik udi pedom.', 'Anak kecil itu tidur.'] },
    { id: 'pergi|berangkat', km: 'mit', kat: 'kerja' },
    { id: 'berjalan|jalan kaki', km: 'lapah', kat: 'kerja' },
    { id: 'datang', km: 'ratong', kat: 'kerja' },
    { id: 'pulang', km: 'mulang', kat: 'kerja', contoh: ['Ganta nyak haga mulang.', 'Sekarang saya mau pulang.'] },
    { id: 'duduk', km: 'mejong', kat: 'kerja' },
    { id: 'lihat|melihat', km: 'liak', kat: 'kerja' },
    { id: 'dengar|mendengar', km: 'dengi', kat: 'kerja' },
    { id: 'bicara|berbicara|berkata', km: 'cawa', kat: 'kerja' },
    { id: 'tahu', km: 'pandai', kat: 'kerja', contoh: ['Nyak mak pandai.', 'Saya tidak tahu.'] },
    { id: 'beli|membeli', km: 'mili', kat: 'kerja' },
    { id: 'bekerja|kerja', km: 'begawi', kat: 'kerja' },
    { id: 'mau|ingin|hendak', km: 'haga', kat: 'kerja' },
    { id: 'bisa|dapat', km: 'dapok', kat: 'kerja' },
    { id: 'ingat', km: 'ingok', kat: 'kerja' },
    { id: 'ada', km: 'wat', kat: 'kerja', contoh: ['Wat iwa di wai.', 'Ada ikan di sungai.'] },

    // Keterangan & kata tugas
    { id: 'jangan', km: 'dang', kat: 'ket', contoh: ['Dang lupa basa ram.', 'Jangan lupa bahasa kita.'] },
    { id: 'sudah|telah', km: 'radu', kat: 'ket' },
    { id: 'belum', km: 'makkung', kat: 'ket' },
    { id: 'tidak', km: 'mak', kat: 'ket' },
    { id: 'bukan', km: 'lain', kat: 'ket' },
    { id: 'sekali|sangat', km: 'nihan', kat: 'ket', contoh: ['Pindang iwa lemak nihan.', 'Pindang ikan enak sekali.'] },
    { id: 'juga', km: 'muneh', kat: 'ket' },
    { id: 'dengan|bersama', km: 'jama', kat: 'ket' },
    { id: 'dan', km: 'rik', kat: 'ket' },
    { id: 'yang', km: 'sai', kat: 'ket' },
    { id: 'dari', km: 'jak', kat: 'ket' },
    { id: 'ini', km: 'ijo', kat: 'ket' },
    { id: 'itu', km: 'udi', kat: 'ket' },
    { id: 'sini', km: 'dija', kat: 'ket' },
    { id: 'sana', km: 'dudi', kat: 'ket' },
    { id: 'sekarang', km: 'ganta', kat: 'ket' },
    { id: 'besok', km: 'jemoh', kat: 'ket', contoh: ['Jemoh ram mit jama-jama.', 'Besok kita pergi bersama-sama.'] },
    { id: 'kemarin', km: 'tuni', kat: 'ket' },
    { id: 'malam', km: 'bingi', kat: 'ket' },
    { id: 'hari', km: 'rani', kat: 'ket' },

    // Kata sifat
    { id: 'besar', km: 'balak', kat: 'sifat', contoh: ['Lamban ia balak nihan.', 'Rumah dia besar sekali.'] },
    { id: 'kecil', km: 'lunik', kat: 'sifat' },
    { id: 'banyak', km: 'lamon', kat: 'sifat' },
    { id: 'baik|bagus', km: 'betik', kat: 'sifat' },
    { id: 'jauh', km: 'jawoh', kat: 'sifat' },
    { id: 'dekat', km: 'parek', kat: 'sifat' },
    { id: 'enak|lezat', km: 'lemak', kat: 'sifat' },
    { id: 'lama', km: 'saka', kat: 'sifat' },
    { id: 'tua', km: 'tuha', kat: 'sifat' },
    { id: 'muda', km: 'ngura', kat: 'sifat' },

    // Orang
    { id: 'orang', km: 'ulun', kat: 'orang' },
    { id: 'anak', km: 'sanak', kat: 'orang' },
    { id: 'gadis', km: 'muli', kat: 'orang' },
    { id: 'bujang|pemuda', km: 'meranai', kat: 'orang' },

    // Alam & benda
    { id: 'sungai|air', km: 'wai', kat: 'alam', contoh: ['Lamban nyak parek wai.', 'Rumah saya dekat sungai.'] },
    { id: 'rumah', km: 'lamban', kat: 'alam' },
    { id: 'tanah', km: 'tanoh', kat: 'alam' },
    { id: 'ikan', km: 'iwa', kat: 'alam' },
    { id: 'padi', km: 'pari', kat: 'alam' },
    { id: 'api', km: 'apui', kat: 'alam' },
    { id: 'hujan', km: 'ujan', kat: 'alam' },
    { id: 'kopi', km: 'kupi', kat: 'alam' },
    { id: 'uang', km: 'duit', kat: 'alam' },
    { id: 'nama', km: 'gelar', kat: 'alam' },

    // Tubuh
    { id: 'kepala', km: 'hulu', kat: 'tubuh' },
    { id: 'tangan', km: 'culuk', kat: 'tubuh' },
    { id: 'kaki', km: 'kukut', kat: 'tubuh' },
    { id: 'hidung', km: 'irung', kat: 'tubuh' },

    // Budaya
    { id: 'bahasa', km: 'basa', kat: 'budaya' },
    { id: 'Komering', km: 'Kumoring', kat: 'budaya' },
    { id: 'gelar adat', km: 'adok', kat: 'budaya' },
    { id: 'julukan', km: 'jajuluk', kat: 'budaya' },
    { id: 'keturunan|klan', km: 'buay', kat: 'budaya' },
  ],

  /* Frasa utuh — dicocokkan lebih dulu (frasa terpanjang menang) */
  frasa: [
    { id: 'apa kabar', km: 'api kabar' },
    { id: 'kabar baik', km: 'kabar betik' },
    { id: 'siapa namamu|siapa nama kamu', km: 'sapa gelarmu' },
    { id: 'nama saya', km: 'gelarku' },
    { id: 'mau ke mana', km: 'haga mit dipa' },
    { id: 'dari mana', km: 'jak dipa' },
    { id: 'tidak ada', km: 'mak wat' },
    { id: 'tidak tahu', km: 'mak pandai' },
    { id: 'sudah makan', km: 'radu mangan' },
    { id: 'jangan lupa', km: 'dang lupa' },
    { id: 'bersama-sama', km: 'jama-jama' },
    { id: 'bahasa Komering', km: 'basa Kumoring' },
    { id: 'orang Komering', km: 'ulun Kumoring' },
    { id: 'sungai Komering', km: 'way Kumoring' },
  ],

  /* Kata yang sama/serapan di kedua bahasa — dianggap cocok */
  kataSama: ['lupa', 'kabar', 'belajar', 'di', 'adat', 'mata', 'gunung', 'asal', 'usul', 'budaya',
    'kasih', 'sampai', 'selalu', 'pindang', 'baung', 'tempoyak', 'seruit', 'marga', 'pasirah',
    'palembang', 'martapura', 'muaradua', 'baturaja', 'ranau', 'way', 'yuk', 'ya'],

  /* Contoh kalimat untuk chip penerjemah */
  contohKalimat: {
    id: ['Apa kabar?', 'Siapa namamu?', 'Saya mau makan pindang ikan', 'Kamu mau pergi ke mana?', 'Rumah saya dekat sungai', 'Jangan lupa bahasa kita', 'Kita belajar bersama-sama'],
    km: ['Api kabar?', 'Nyak haga mangan', 'Lamban nyak parek wai', 'Dang lupa basa ram', 'Pindang iwa lemak nihan'],
  },

  sejarah: [
    {
      era: 'Masa Leluhur', ikon: '⛰️', judul: 'Berakar dari Sekala Brak',
      isi: 'Leluhur Ulun Kumoring (orang Komering) diyakini berasal dari dataran tinggi Sekala Brak di sekitar Gunung Pesagi dan Danau Ranau — kawasan yang juga dianggap tanah asal masyarakat Lampung. Karena itu, Basa Kumoring serumpun dengan bahasa Lampung.',
    },
    {
      era: 'Cerita Tutur', ikon: '📜', judul: 'Asal Nama "Komering"',
      isi: 'Salah satu cerita tutur menyebut nama Komering berasal dari seorang saudagar asal India bernama Komering Singh yang singgah dan wafat di tepian sungai ini. Sejak itu sungainya dikenal sebagai Way Komering, dan masyarakat di sepanjang alirannya disebut Ulun Kumoring.',
    },
    {
      era: 'Persebaran', ikon: '🛶', judul: 'Menyusuri Way Komering',
      isi: 'Kelompok-kelompok keturunan (buay) bergerak menyusuri sungai dari hulu ke hilir, membuka dusun dan ladang di tepian Way Komering. Dari sinilah lahir kebuayan seperti Buay Madang, Semendawai, dan Buay Pemuka yang namanya masih dipakai hingga kini.',
    },
    {
      era: 'Abad ke-17–19', ikon: '🕌', judul: 'Bersama Kesultanan Palembang',
      isi: 'Wilayah uluan, termasuk tanah Komering, menjalin hubungan dengan Kesultanan Palembang Darussalam. Kitab hukum adat Simbur Cahaya — yang dikaitkan dengan Ratu Sinuhun — menjadi pedoman pemerintahan marga di daerah uluan.',
    },
    {
      era: 'Masa Kolonial', ikon: '🏛️', judul: 'Sistem Marga & Pasirah',
      isi: 'Pemerintah kolonial Belanda mempertahankan marga sebagai unit pemerintahan adat. Setiap marga dipimpin seorang Pasirah, dan tanah Komering dibagi ke dalam wilayah administratif Komering Ulu dan Komering Ilir.',
    },
    {
      era: '1983', ikon: '📋', judul: 'Berakhirnya Pemerintahan Marga',
      isi: 'Sebagai pelaksanaan UU No. 5 Tahun 1979 tentang Pemerintahan Desa, Gubernur Sumatera Selatan menghapus sistem pemerintahan marga pada 1983. Marga tak lagi menjadi unit pemerintahan, tetapi tetap hidup sebagai identitas adat dan kekerabatan.',
    },
    {
      era: '2003', ikon: '🗺️', judul: 'Lahirnya OKU Timur & OKU Selatan',
      isi: 'Melalui UU No. 37 Tahun 2003, Kabupaten Ogan Komering Ulu dimekarkan menjadi OKU, OKU Timur (ibu kota Martapura), dan OKU Selatan (ibu kota Muaradua) — rumah bagi sebagian besar Ulun Kumoring.',
    },
    {
      era: 'Kini', ikon: '🤖', judul: 'Menjaga Basa Kumoring',
      isi: 'Basa Kumoring (kode ISO 639-3: kge) masih dituturkan ratusan ribu orang, tetapi generasi muda makin jarang memakainya. Teknologi dan AI dapat menjadi jembatan — kamus digital, penerjemah, dan konten interaktif — agar bahasa ibu tetap hidup.',
    },
  ],

  /* Titik peta — x/y dalam persen terhadap gambar peta-wilayah-komering.jpg */
  wilayah: [
    {
      key: 'ranau', nama: 'Danau Ranau', kab: 'OKU Selatan', x: 29.5, y: 75.5, ikon: '🏞️',
      isi: 'Danau vulkanik di perbatasan Sumatera Selatan–Lampung, dikenal sebagai danau terbesar kedua di Sumatera. Kawasan inilah hulu Way Komering, dekat dengan Sekala Brak — tanah yang diyakini sebagai asal leluhur.',
    },
    {
      key: 'muaradua', nama: 'Muaradua', kab: 'OKU Selatan', x: 30.2, y: 70.4, ikon: '📍',
      isi: 'Ibu kota Kabupaten OKU Selatan, di bagian hulu aliran Way Komering. Wilayah perbukitan yang sejuk dengan kebun kopi, sawah, dan tradisi uluan yang kuat.',
    },
    {
      key: 'baturaja', nama: 'Baturaja', kab: 'OKU', x: 51.3, y: 59.2, ikon: '📍',
      isi: 'Ibu kota Kabupaten Ogan Komering Ulu. Kota multietnis tempat bertemunya masyarakat Ogan, Komering, Daya, dan pendatang.',
    },
    {
      key: 'martapura', nama: 'Martapura', kab: 'OKU Timur', x: 53.5, y: 64.7, ikon: '⭐',
      isi: 'Ibu kota OKU Timur dan salah satu jantung tanah Komering. Di sekitarnya terdapat kecamatan yang memakai nama kebuayan lama: Buay Madang, Semendawai, Bunga Mayang, dan Buay Pemuka Peliung.',
    },
    {
      key: 'tanjunglubuk', nama: 'Tanjung Lubuk', kab: 'OKI', x: 61.1, y: 42.6, ikon: '📍',
      isi: 'Wilayah Komering Ilir (hilir) di Kabupaten Ogan Komering Ilir. Permukiman tumbuh di sepanjang tepian sungai, dengan rumah panggung dan perahu sebagai bagian dari keseharian.',
    },
    {
      key: 'kayuagung', nama: 'Kayu Agung', kab: 'OKI', x: 70.9, y: 43.9, ikon: '📍',
      isi: 'Ibu kota Kabupaten OKI. Masyarakat asli Kayuagung memiliki bahasa yang berkerabat dekat dengan Basa Kumoring — sama-sama dari rumpun Lampungik.',
    },
    {
      key: 'palembang', nama: 'Palembang', kab: 'Ibu Kota Provinsi', x: 63.1, y: 33.8, ikon: '🏙️',
      isi: 'Di sekitar Palembang, Way Komering bertemu Sungai Musi. Kota bekas pusat Kesultanan Palembang Darussalam yang hukum adatnya, Simbur Cahaya, pernah berlaku hingga ke marga-marga uluan.',
    },
  ],

  marga: [
    { nama: 'Buay Madang', kab: 'OKU Timur', isi: 'Kebuayan di aliran tengah Way Komering. Namanya kini diabadikan sebagai Kecamatan Buay Madang dan Buay Madang Timur.' },
    { nama: 'Madang Suku', kab: 'OKU Timur', isi: 'Wilayah adat yang terbagi menjadi Madang Suku I, II, dan III — kini masing-masing menjadi kecamatan di OKU Timur.' },
    { nama: 'Semendawai', kab: 'OKU Timur', isi: 'Bekas Marga Semendawai Suku I–III. Kini menjadi Kecamatan Semendawai Barat, Semendawai Timur, dan Semendawai Suku III.' },
    { nama: 'Bunga Mayang', kab: 'OKU Timur', isi: 'Wilayah adat di tepian Way Komering yang namanya kini dipakai sebagai Kecamatan Bunga Mayang.' },
    { nama: 'Buay Pemuka Peliung', kab: 'OKU Timur', isi: 'Kebuayan "Pemuka" yang kini menjadi Kecamatan Buay Pemuka Peliung, tak jauh dari Martapura.' },
    { nama: 'Buay Pemuka Bangsa Raja', kab: 'OKU Timur', isi: 'Kerabat kebuayan Pemuka, kini diabadikan sebagai Kecamatan Buay Pemuka Bangsa Raja.' },
    { nama: 'Buay Rawan', kab: 'OKU Selatan', isi: 'Kebuayan di kawasan hulu, kini menjadi nama kecamatan di Kabupaten OKU Selatan.' },
    { nama: 'Buay Sandang Aji', kab: 'OKU Selatan', isi: 'Kebuayan di dataran tinggi OKU Selatan yang namanya kini menjadi nama kecamatan.' },
    { nama: 'Tanjung Lubuk', kab: 'OKI', isi: 'Wilayah Komering Ilir di Kabupaten OKI, di tepian hilir Way Komering.' },
    { nama: 'Sirah Pulau Padang', kab: 'OKI', isi: 'Wilayah Komering Ilir di Kabupaten OKI, dekat pertemuan aliran sungai menuju Palembang.' },
  ],

  /* Titik busana — x/y dalam persen terhadap busana-adat-komering.jpg */
  busana: [
    { key: 'kopiah', nama: 'Kopiah Emas', x: 44.4, y: 35.5, isi: 'Penutup kepala mempelai pria berlapis emas dengan ukiran sulur. Melambangkan kewibawaan dan kesiapan memimpin keluarga.' },
    { key: 'mahkota', nama: 'Mahkota Emas', x: 58.8, y: 35.7, isi: 'Mahkota bertingkat dengan ornamen kembang dan rumbai berjuntai untuk mempelai perempuan. Lambang kemuliaan, kehormatan, dan doa agar rumah tangga berkembang.' },
    { key: 'beludru', nama: 'Baju Beludru Merah', x: 37.9, y: 52.5, isi: 'Baju beludru merah marun bersulam benang emas. Merah melambangkan keberanian; sulaman emas melambangkan kemakmuran.' },
    { key: 'pusaka', nama: 'Senjata Pusaka', x: 47.9, y: 62.5, isi: 'Keris/siwar yang dibawa mempelai pria — simbol tanggung jawab melindungi keluarga dan menjaga marwah.' },
    { key: 'songket', nama: 'Kain Songket', x: 42.5, y: 84.8, isi: 'Tenun bertabur benang emas dengan motif geometris belah ketupat. Motif yang berulang melambangkan keteraturan dan harapan yang tak putus.' },
    { key: 'kalung', nama: 'Kalung Bersusun', x: 56.7, y: 59.7, isi: 'Perhiasan dada bertingkat berwarna emas. Makin lengkap perhiasan, makin tinggi penghormatan bagi mempelai.' },
    { key: 'gelang', nama: 'Gelang & Sulam Lengan', x: 63.75, y: 68.1, isi: 'Gelang emas lebar dan sulaman pada ujung lengan baju — pelengkap kemegahan busana pengantin perempuan.' },
    { key: 'rumahulu', nama: 'Rumah Ulu', x: 71.7, y: 15.6, isi: 'Rumah panggung kayu tradisional daerah uluan Sumatera Selatan. Kolongnya yang tinggi melindungi dari luapan sungai dan binatang, sekaligus menjadi tempat menyimpan perkakas.' },
  ],

  adatPernikahan: [
    { judul: 'Penjajakan & Lamaran', ikon: '🤝', isi: 'Keluarga pria datang secara adat menyampaikan maksud baik dan melamar, membawa seserahan sebagai tanda kesungguhan.' },
    { judul: 'Musyawarah Adat', ikon: '🗣️', isi: 'Kedua keluarga bermusyawarah bersama tokoh adat menentukan hari baik, mas kawin, dan rangkaian acara.' },
    { judul: 'Akad Nikah', ikon: '🕌', isi: 'Ijab kabul dilaksanakan secara Islam, disaksikan keluarga besar dan para tetua.' },
    { judul: 'Arak-arakan Pengantin', ikon: '🥁', isi: 'Pengantin berbusana adat lengkap diarak, diiringi tetabuhan dan doa dari kerabat.' },
    { judul: 'Pemberian Adok', ikon: '👑', isi: 'Pasangan menerima adok — gelar adat — sebagai penanda status baru mereka dalam kekerabatan.' },
  ],

  kuliner: [
    {
      nama: 'Pindang Ikan Baung', emoji: '🍲', jenis: 'Hidangan Utama',
      isi: 'Ikan baung segar dari Way Komering dimasak berkuah kuning yang asam, pedas, dan harum rempah.',
      bahan: ['Ikan baung/patin', 'Nanas', 'Serai & lengkuas', 'Kunyit, bawang, cabai', 'Daun kemangi'],
      cara: 'Rebus bumbu halus bersama serai, lengkuas, dan nanas. Masukkan ikan, masak hingga matang, lalu tambahkan kemangi.',
    },
    {
      nama: 'Seruit', emoji: '🐟', jenis: 'Tradisi Makan Bersama',
      isi: 'Ikan bakar atau goreng dicampur sambal terasi, tempoyak, dan lalapan, lalu disantap ramai-ramai. Makan bersama ini disebut nyeruit — lambang kebersamaan.',
      bahan: ['Ikan sungai bakar/goreng', 'Sambal terasi', 'Tempoyak', 'Lalapan & terong bakar'],
      cara: 'Suwir ikan, campur dengan sambal dan tempoyak, lalu santap bersama nasi hangat dan lalapan.',
    },
    {
      nama: 'Brengkes Tempoyak', emoji: '🍃', jenis: 'Pepes Ikan',
      isi: 'Ikan dibalut bumbu tempoyak (durian fermentasi), dibungkus daun pisang, lalu dikukus — gurih, asam, dan wangi.',
      bahan: ['Ikan patin/baung', 'Tempoyak', 'Cabai & bawang', 'Daun kemangi', 'Daun pisang'],
      cara: 'Lumuri ikan dengan tempoyak dan bumbu halus, bungkus daun pisang, kukus 30–40 menit.',
    },
    {
      nama: 'Engkak Ketan', emoji: '🍰', jenis: 'Kue Tradisional',
      isi: 'Kue lapis dari tepung ketan, santan, telur, dan gula yang dipanggang selapis demi selapis — legit dan wajib hadir saat Lebaran.',
      bahan: ['Tepung ketan', 'Santan kental', 'Telur', 'Gula pasir', 'Mentega'],
      cara: 'Tuang adonan tipis-tipis, panggang tiap lapisan hingga matang, ulangi sampai loyang penuh.',
    },
    {
      nama: 'Lemang', emoji: '🎋', jenis: 'Sajian Hari Raya',
      isi: 'Beras ketan dan santan dimasukkan ke bambu beralas daun pisang, lalu dibakar perlahan berjam-jam.',
      bahan: ['Beras ketan', 'Santan', 'Garam', 'Daun pisang', 'Bambu muda'],
      cara: 'Isi bambu berlapis daun pisang dengan ketan dan santan, bakar miring sambil diputar hingga matang.',
    },
    {
      nama: 'Ikan Salai', emoji: '🔥', jenis: 'Olahan Ikan Sungai',
      isi: 'Ikan sungai diasap berjam-jam hingga kering dan awet — cara tradisional mengolah tangkapan melimpah dari Way Komering.',
      bahan: ['Ikan baung/lais', 'Garam', 'Kayu bakar untuk pengasapan'],
      cara: 'Bersihkan ikan, beri garam, lalu asap di atas para-para hingga kering. Olah lagi jadi gulai atau sambal.',
    },
  ],

  /* Lagu ciptaan untuk aplikasi; mel = [indeks nada, ketukan], akar = indeks nada bas */
  lagu: {
    judul: 'Dang Lupa ko Komering',
    keterangan: 'Lagu ciptaan untuk aplikasi ini (bukan lagu tradisional). Musik disintesis langsung oleh browser — tanpa file audio.',
    bpm: 96,
    intro: [[0, 1], [3, 1], [4, 1], [5, 1], [4, 1], [3, 1], [2, 2]],
    bagian: [
      {
        label: 'Bait 1',
        baris: [
          { km: 'Tabik pun, muli meranai', id: 'Salam hormat, para gadis dan bujang', mel: [[0, 1], [2, 1], [3, 1], [4, 1], [3, 1], [2, 1], [1, 2]], akar: 0 },
          { km: 'Ram ratong jak Way Kumoring', id: 'Kita datang dari Sungai Komering', mel: [[2, 1], [3, 1], [5, 1], [4, 1], [3, 2], [2, 2]], akar: 1 },
          { km: 'Lamban balak di pinggir wai', id: 'Rumah besar di tepi sungai', mel: [[3, 1], [4, 1], [5, 1], [6, 1], [5, 1], [4, 1], [3, 2]], akar: 2 },
          { km: 'Dang lupa asal-usul ram', id: 'Jangan lupa asal-usul kita', mel: [[4, 1], [3, 1], [2, 1], [1, 1], [2, 1], [1, 1], [0, 2]], akar: 0 },
        ],
      },
      {
        label: 'Reff',
        baris: [
          { km: 'Dang lupa, dang lupa ko Kumoring', id: 'Jangan lupa, jangan lupakan Komering', mel: [[5, 1], [5, 1], [6, 1], [5, 1], [4, 2], [3, 2]], akar: 3 },
          { km: 'Basa ram, adat ram, betik nihan', id: 'Bahasa kita, adat kita, baik sekali', mel: [[3, 1], [4, 1], [5, 1], [4, 1], [3, 1], [2, 1], [3, 2]], akar: 1 },
          { km: 'Jak Ranau sampai Palembang', id: 'Dari Ranau sampai Palembang', mel: [[5, 1], [6, 1], [7, 1], [6, 1], [5, 1], [4, 1], [5, 2]], akar: 2 },
          { km: 'Ingok selalu, ulun Kumoring', id: 'Ingatlah selalu, wahai orang Komering', mel: [[4, 1], [3, 1], [2, 1], [3, 1], [2, 1], [1, 1], [0, 2]], akar: 0 },
        ],
      },
      {
        label: 'Bait 2',
        baris: [
          { km: 'Pindang baung lemak nihan', id: 'Pindang ikan baung enak sekali', mel: [[0, 1], [2, 1], [3, 1], [4, 1], [3, 1], [2, 1], [1, 2]], akar: 0 },
          { km: 'Ram mangan jama-jama', id: 'Kita makan bersama-sama', mel: [[2, 1], [3, 1], [5, 1], [4, 1], [3, 2], [2, 2]], akar: 1 },
          { km: 'Sai, rua, telu, pak, lima', id: 'Satu, dua, tiga, empat, lima', mel: [[3, 1], [4, 1], [5, 1], [6, 1], [5, 1], [4, 1], [3, 2]], akar: 2 },
          { km: 'Haga belajar Basa Kumoring', id: 'Ingin belajar Bahasa Komering', mel: [[4, 1], [3, 1], [2, 1], [1, 1], [2, 1], [1, 1], [0, 2]], akar: 0 },
        ],
      },
    ],
    urutan: [0, 1, 2, 1],
  },

  jajuluk: {
    gelar: {
      L: [
        { kata: 'Pangeran', arti: 'pemimpin yang dihormati' },
        { kata: 'Radin', arti: 'bangsawan yang santun' },
        { kata: 'Minak', arti: 'orang yang dituakan' },
        { kata: 'Kimas', arti: 'pribadi berharga bagai emas' },
        { kata: 'Batin', arti: 'pemuka kampung' },
        { kata: 'Dalom', arti: 'yang luhur dan dalam ilmunya' },
      ],
      P: [
        { kata: 'Ratu', arti: 'perempuan yang dimuliakan' },
        { kata: 'Dalom', arti: 'yang luhur budinya' },
        { kata: 'Minak', arti: 'perempuan yang dituakan' },
        { kata: 'Intan', arti: 'permata keluarga' },
        { kata: 'Batin', arti: 'penjaga kampung' },
        { kata: 'Mas', arti: 'berharga bagai emas' },
      ],
    },
    sifat: {
      berani: { label: 'Pemberani', ikon: '🛡️', kata: [{ kata: 'Perkasa', arti: 'kuat dan perkasa' }, { kata: 'Gagah', arti: 'gagah berani' }, { kata: 'Sakti', arti: 'tangguh menghadapi rintangan' }] },
      bijak: { label: 'Bijaksana', ikon: '📜', kata: [{ kata: 'Mangku', arti: 'teguh memangku adat' }, { kata: 'Arif', arti: 'arif dan adil' }, { kata: 'Budi', arti: 'berbudi luhur' }] },
      cerdas: { label: 'Cerdas', ikon: '💡', kata: [{ kata: 'Pandai', arti: 'pandai dan haus ilmu' }, { kata: 'Bestari', arti: 'berilmu dan berbudi' }, { kata: 'Cendekia', arti: 'cerdas dan berwawasan luas' }] },
      ramah: { label: 'Ramah', ikon: '🤝', kata: [{ kata: 'Manis', arti: 'manis tutur katanya' }, { kata: 'Kasih', arti: 'penuh kasih sayang' }, { kata: 'Seri', arti: 'berseri dan menyenangkan' }] },
      dermawan: { label: 'Dermawan', ikon: '🎁', kata: [{ kata: 'Mulia', arti: 'mulia hatinya' }, { kata: 'Budiman', arti: 'baik budi dan suka menolong' }, { kata: 'Murah', arti: 'murah hati' }] },
      setia: { label: 'Setia', ikon: '🤍', kata: [{ kata: 'Teguh', arti: 'teguh pendirian' }, { kata: 'Setia', arti: 'setia pada keluarga dan janji' }, { kata: 'Tuah', arti: 'membawa tuah bagi sesama' }] },
    },
    penutup: [
      { kata: 'Negara', arti: 'negeri dan bangsanya' },
      { kata: 'Bumi', arti: 'bumi tempatnya berpijak' },
      { kata: 'Pesagi', arti: 'Gunung Pesagi, tanah leluhur di Sekala Brak' },
      { kata: 'Ranau', arti: 'Danau Ranau di hulu Way Komering' },
      { kata: 'Kumoring', arti: 'tanah dan sungai Komering' },
      { kata: 'Jaya', arti: 'kejayaan para leluhur' },
      { kata: 'Alam', arti: 'alam tempatnya tumbuh' },
      { kata: 'Marga', arti: 'kerabat dan marganya' },
      { kata: 'Ulu', arti: 'tanah uluan, kampung halamannya' },
    ],
  },

  /* benar = indeks jawaban benar pada opsi (sebelum diacak) */
  kuis: [
    { q: 'Sungai Komering bermuara ke sungai besar apa di sekitar Palembang?', opsi: ['Sungai Musi', 'Sungai Ogan', 'Sungai Lematang', 'Sungai Batanghari'], benar: 0, info: 'Way Komering mengalir dari kawasan Danau Ranau dan bertemu Sungai Musi di sekitar Palembang.' },
    { q: 'Danau yang berada di kawasan hulu Sungai Komering adalah…', opsi: ['Danau Toba', 'Danau Ranau', 'Danau Singkarak', 'Danau Kerinci'], benar: 1, info: 'Danau Ranau terletak di OKU Selatan, berbatasan dengan Lampung Barat.' },
    { q: 'Basa Kumoring termasuk rumpun bahasa…', opsi: ['Melayu Palembang', 'Lampungik', 'Jawa', 'Minangkabau'], benar: 1, info: 'Basa Kumoring serumpun dengan bahasa Lampung (rumpun Lampungik).' },
    { q: 'Ungkapan "Tabik pun" digunakan untuk…', opsi: ['Salam hormat atau permisi', 'Mengajak makan', 'Berpamitan tidur', 'Memanggil hewan'], benar: 0, info: '"Tabik pun" adalah salam hormat, dipakai saat menyapa atau meminta izin.' },
    { q: 'Apa Bahasa Komering dari kata "makan"?', opsi: ['Nginum', 'Pedom', 'Mangan', 'Mulang'], benar: 2, info: 'Mangan = makan, nginum = minum, pedom = tidur, mulang = pulang.' },
    { q: 'Kata "lamban" dalam Basa Kumoring berarti…', opsi: ['Pelan', 'Rumah', 'Sungai', 'Jalan'], benar: 1, info: 'Lamban = rumah. Contoh: "Lamban nyak parek wai" (rumah saya dekat sungai).' },
    { q: 'Kabupaten OKU Timur beribu kota di…', opsi: ['Baturaja', 'Muaradua', 'Kayu Agung', 'Martapura'], benar: 3, info: 'OKU Timur dibentuk lewat UU No. 37 Tahun 2003 dengan ibu kota Martapura.' },
    { q: 'Muaradua adalah ibu kota kabupaten…', opsi: ['OKU Selatan', 'OKU Timur', 'Ogan Ilir', 'Muara Enim'], benar: 0, info: 'Muaradua menjadi ibu kota OKU Selatan sejak pemekaran 2003.' },
    { q: '"Dang lupa" artinya…', opsi: ['Sudah ingat', 'Jangan lupa', 'Mau pulang', 'Belum tahu'], benar: 1, info: 'Dang = jangan. Dang lupa = jangan lupa!' },
    { q: 'Kitab hukum adat Kesultanan Palembang yang berlaku di marga-marga uluan bernama…', opsi: ['Simbur Cahaya', 'Kutara Manawa', 'Undang-Undang Melaka', 'Hikayat Hang Tuah'], benar: 0, info: 'Simbur Cahaya dikaitkan dengan Ratu Sinuhun dan menjadi pedoman pemerintahan marga.' },
    { q: 'Pada masa kolonial, pemimpin sebuah marga disebut…', opsi: ['Pasirah', 'Gubernur', 'Syahbandar', 'Patih'], benar: 0, info: 'Pasirah memimpin marga, unit pemerintahan adat yang bertahan hingga 1983.' },
    { q: 'Leluhur Ulun Kumoring diyakini berasal dari kawasan…', opsi: ['Sekala Brak', 'Pagaruyung', 'Majapahit', 'Kutai'], benar: 0, info: 'Sekala Brak di sekitar Gunung Pesagi dan Danau Ranau, tanah asal yang juga diyakini masyarakat Lampung.' },
    { q: 'Tradisi menyantap ikan dengan sambal dan tempoyak secara bersama-sama disebut…', opsi: ['Nyeruit', 'Begawi', 'Ngopi', 'Bekarang'], benar: 0, info: 'Nyeruit — makan seruit bersama — adalah lambang kebersamaan.' },
    { q: 'Tempoyak terbuat dari…', opsi: ['Durian yang difermentasi', 'Kelapa parut', 'Ikan asin', 'Singkong'], benar: 0, info: 'Tempoyak adalah daging durian yang difermentasi; rasanya asam gurih.' },
    { q: '"Sai, rua, telu" artinya…', opsi: ['Satu, dua, tiga', 'Pagi, siang, malam', 'Ayah, ibu, anak', 'Makan, minum, tidur'], benar: 0, info: 'Sai = satu, rua = dua, telu = tiga.' },
    { q: 'Dalam adat Komering, "buay" berarti…', opsi: ['Keturunan/kelompok kerabat', 'Perahu', 'Rumah panggung', 'Alat musik'], benar: 0, info: 'Buay = keturunan. Contoh: Buay Madang, Buay Pemuka.' },
    { q: 'Gelar adat yang diterima seseorang saat menikah disebut…', opsi: ['Adok', 'Seruit', 'Lamban', 'Tapis'], benar: 0, info: 'Adok adalah gelar adat yang diberikan saat pernikahan.' },
    { q: 'Rumah panggung kayu tradisional daerah uluan Sumatera Selatan disebut…', opsi: ['Rumah Ulu', 'Rumah Gadang', 'Joglo', 'Honai'], benar: 0, info: 'Rumah Ulu: rumah panggung kayu dengan kolong tinggi.' },
  ],

  chatbot: {
    sapaanAwal: 'Tabik pun! Nyak Ratih, dan ini Raka. Tanya apa saja seputar budaya Komering — atau minta terjemahan, misalnya: **bahasa komering terima kasih**.',
    saran: ['Siapa suku Komering?', 'Asal-usul nama Komering', 'Bahasa komering "apa kabar"', 'Makanan khas Komering', 'Apa itu marga & buay?', 'Adat pernikahan Komering'],
    intents: [
      { id: 'salam', oleh: 'ratih', kata: ['halo', 'hai', 'hallo', 'hei', 'tabik', 'assalamualaikum', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'permisi'],
        jawab: ['Tabik pun! Api kabar? 😊 Mau ngobrol soal sejarah, bahasa, kuliner, atau adat Komering?', 'Tabik pun! Nyak Ratih di sini. Silakan tanya apa saja tentang Komering, atau minta nyak menerjemahkan kalimat.'] },
      { id: 'kabar', oleh: 'ratih', kata: ['apa kabar', 'api kabar', 'kabarmu', 'gimana kabar'],
        jawab: ['Kabar betik nihan — kabarku sangat baik! Kalau niku (kamu)?'] },
      { id: 'tentang', oleh: 'raka', kata: ['suku komering', 'siapa komering', 'apa itu komering', 'orang komering', 'ulun kumoring', 'komering itu'],
        jawab: 'Ulun Kumoring (orang Komering) bermukim di sepanjang aliran Way Komering, Sumatera Selatan — terutama di OKU Timur, OKU Selatan, OKU, dan OKI. Bahasanya, Basa Kumoring, serumpun dengan bahasa Lampung.',
        aksi: [{ label: 'Lihat peta wilayah', href: '#peta' }] },
      { id: 'nama', oleh: 'raka', kata: ['asal usul nama', 'asal nama', 'nama komering', 'arti komering', 'singh', 'legenda', 'kenapa disebut', 'dinamakan'],
        jawab: 'Salah satu cerita tutur menyebut nama "Komering" berasal dari saudagar India bernama Komering Singh yang wafat di tepian sungai ini. Sungainya lalu disebut Way Komering. Ini cerita rakyat, ya — versi lain juga ada.',
        aksi: [{ label: 'Buka linimasa sejarah', href: '#sejarah' }] },
      { id: 'asal', oleh: 'raka', kata: ['asal', 'usul', 'leluhur', 'nenek moyang', 'sekala', 'brak', 'pesagi', 'berasal', 'sejarah'],
        jawab: 'Menurut tradisi lisan, leluhur Komering berasal dari Sekala Brak di sekitar Gunung Pesagi dan Danau Ranau — tanah asal yang juga diyakini masyarakat Lampung. Dari sana, kelompok-kelompok buay menyusuri Way Komering ke hilir.',
        aksi: [{ label: 'Buka linimasa sejarah', href: '#sejarah' }] },
      { id: 'sungai', oleh: 'raka', kata: ['sungai', 'way', 'wai', 'ranau', 'musi', 'hulu', 'hilir', 'muara', 'danau'],
        jawab: 'Way Komering berhulu di kawasan Danau Ranau (OKU Selatan), mengalir melewati Muaradua dan Martapura hingga Komering Ilir, lalu bertemu Sungai Musi di sekitar Palembang. Sungai ini adalah urat nadi kehidupan Ulun Kumoring.',
        aksi: [{ label: 'Jelajahi peta', href: '#peta' }] },
      { id: 'wilayah', oleh: 'raka', kata: ['wilayah', 'daerah', 'kabupaten', 'oku', 'oki', 'martapura', 'muaradua', 'baturaja', 'kayu agung', 'kayuagung', 'tinggal', 'dimana', 'lokasi', 'peta'],
        jawab: 'Wilayah sebaran Komering meliputi Kabupaten OKU Selatan, OKU Timur, OKU, dan OKI di Sumatera Selatan — mengikuti aliran Way Komering. Kota pentingnya antara lain Muaradua, Martapura, Baturaja, dan Kayu Agung.',
        aksi: [{ label: 'Jelajahi peta', href: '#peta' }] },
      { id: 'bahasa', oleh: 'ratih', kata: ['bahasa', 'basa', 'dialek', 'rumpun', 'lampung', 'iso', 'kge'],
        jawab: 'Basa Kumoring termasuk rumpun Lampungik (kode ISO 639-3: kge). Banyak katanya mirip bahasa Lampung, misalnya nyak (saya), niku (kamu), mangan (makan), dan lamban (rumah). Coba ketik: **bahasa komering saya mau makan**.',
        aksi: [{ label: 'Buka Penerjemah AI', href: '#penerjemah' }] },
      { id: 'aksara', oleh: 'ratih', kata: ['aksara', 'huruf', 'tulisan', 'kaganga', 'surat ulu'],
        jawab: 'Masyarakat uluan Sumatera Selatan, termasuk Komering, mengenal aksara turunan Kaganga yang sering disebut Surat Ulu — ditulis pada bambu, kulit kayu, atau tanduk. Kerabat dekatnya adalah aksara Lampung.' },
      { id: 'marga', oleh: 'raka', kata: ['marga', 'buay', 'kebuayan', 'klan', 'pasirah', 'keturunan'],
        jawab: 'Buay berarti keturunan atau kelompok kerabat. Dari masa Kesultanan Palembang hingga kolonial, tanah Komering terbagi atas marga yang dipimpin Pasirah. Pemerintahan marga dihapus pada 1983, tetapi nama kebuayan seperti Buay Madang, Semendawai, dan Bunga Mayang masih hidup sebagai nama kecamatan.',
        aksi: [{ label: 'Lihat data marga', href: '#marga' }] },
      { id: 'simbur', oleh: 'raka', kata: ['simbur', 'cahaya', 'hukum adat', 'undang', 'kesultanan', 'palembang'],
        jawab: 'Simbur Cahaya adalah kitab hukum adat Kesultanan Palembang yang dikaitkan dengan Ratu Sinuhun. Aturannya — dari tata pemerintahan marga hingga pergaulan muda-mudi — berlaku di daerah uluan, termasuk tanah Komering.' },
      { id: 'nikah', oleh: 'ratih', kata: ['nikah', 'pernikahan', 'menikah', 'kawin', 'pengantin', 'lamaran', 'melamar', 'adok', 'resepsi'],
        jawab: 'Rangkaian adat pernikahan Komering umumnya meliputi penjajakan & lamaran, musyawarah adat, akad nikah, arak-arakan pengantin, dan pemberian adok (gelar adat) bagi pasangan. Istilah dan urutannya bisa berbeda di tiap marga.',
        aksi: [{ label: 'Lihat busana & adat', href: '#busana' }] },
      { id: 'busana', oleh: 'ratih', kata: ['busana', 'baju', 'pakaian', 'songket', 'mahkota', 'siger', 'kopiah', 'beludru', 'perhiasan', 'kostum'],
        jawab: 'Busana pengantin Komering didominasi beludru merah marun bersulam emas, kain songket bermotif geometris, mahkota emas untuk mempelai perempuan, serta kopiah emas dan senjata pusaka untuk mempelai pria. Merah melambangkan keberanian, emas melambangkan kemuliaan.',
        aksi: [{ label: 'Jelajahi busana adat', href: '#busana' }] },
      { id: 'kuliner', oleh: 'ratih', kata: ['makanan', 'kuliner', 'masakan', 'pindang', 'seruit', 'tempoyak', 'engkak', 'lemang', 'salai', 'kue', 'khas', 'resep'],
        jawab: 'Hidangan yang akrab di tanah Komering antara lain Pindang Ikan Baung, Seruit, Brengkes Tempoyak, Engkak Ketan, Lemang, dan Ikan Salai. Ikan sungai jadi bintangnya karena Way Komering kaya ikan. Lemak nihan! 😋',
        aksi: [{ label: 'Lihat resep kuliner', href: '#kuliner' }] },
      { id: 'rumah', oleh: 'raka', kata: ['rumah adat', 'rumah ulu', 'panggung'],
        jawab: 'Rumah Ulu adalah rumah panggung kayu tradisional daerah uluan Sumatera Selatan. Kolongnya yang tinggi melindungi penghuni dari luapan sungai dan binatang, sekaligus jadi tempat menyimpan perkakas.' },
      { id: 'lagu', oleh: 'ratih', kata: ['lagu', 'musik', 'nyanyi', 'lirik', 'bernyanyi', 'karaoke'],
        jawab: 'Coba dengarkan lagu "Dang Lupa ko Komering" di bagian Lagu — melodinya dimainkan langsung oleh browser, lengkap dengan lirik Basa Kumoring dan terjemahannya!',
        aksi: [{ label: 'Putar lagu', href: '#lagu' }] },
      { id: 'jajuluk', oleh: 'ratih', kata: ['jajuluk', 'juluk', 'julukan', 'gelar', 'nama adat'],
        jawab: 'Dalam tradisi Lampungik, juluk adalah nama panggilan kehormatan semasa muda, sedangkan adok diberikan saat menikah. Mau coba Generator Jajuluk? Masukkan namamu dan pilih karakter yang paling menggambarkan dirimu.',
        aksi: [{ label: 'Buat jajuluk-ku', href: '#jajuluk' }] },
      { id: 'kuis', oleh: 'raka', kata: ['kuis', 'quiz', 'tes', 'uji', 'tantangan'],
        jawab: 'Siap diuji? Kuis kami berisi 10 pertanyaan acak seputar bahasa, sejarah, dan budaya Komering. Raih skor sempurna untuk gelar "Ulun Kumoring Sejati"!',
        aksi: [{ label: 'Mulai kuis', href: '#kuis' }] },
      { id: 'terimakasih', oleh: 'ratih', kata: ['terima kasih', 'makasih', 'trims', 'thanks', 'tarima kasih', 'thank'],
        jawab: ['Tarima kasih muneh! (Terima kasih juga!) Dang lupa ko Komering, ya! 🙏'] },
      { id: 'maskot', oleh: 'raka', kata: ['raka', 'ratih', 'maskot', 'siapa kamu', 'kamu siapa'],
        jawab: 'Nyak Raka, pemandu sejarah, dan ini Ratih, pemandu bahasa. Kami mengenakan busana adat Komering: beludru merah bersulam emas, kopiah emas untuk Raka, dan mahkota emas untuk Ratih.' },
      { id: 'ai', oleh: 'ratih', kata: ['ai', 'kecerdasan buatan', 'cara kerja', 'teknologi', 'algoritma'],
        jawab: 'Penerjemah dan chatbot ini berjalan sepenuhnya di browser-mu: mencocokkan frasa terpanjang, mengenali imbuhan Bahasa Indonesia (stemming), memperbaiki salah ketik (jarak Levenshtein), lalu menghitung tingkat keyakinan terjemahan. Tanpa server — tidak ada data yang dikirim ke mana pun.' },
    ],
    fallback: [
      'Ngalimpura (maaf), nyak makkung pandai soal udi — aku belum tahu jawabannya. Coba tanya tentang sejarah, bahasa, marga, kuliner, atau minta terjemahan, ya!',
      'Hmm, pertanyaan itu belum ada di catatan kami. Coba salah satu topik di bawah ini, atau ketik: **bahasa komering [kalimatmu]**.',
    ],
  },
};
