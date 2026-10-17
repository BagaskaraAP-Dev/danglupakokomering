/* =============================================================================
   Dang Lupa ko Komering — konten situs
   Sapaan, sejarah, wilayah, marga, busana & adat, kuliner, lagu, jajuluk, kuis,
   dan basis pengetahuan chatbot. Kosakata Basa Kumoring di file ini dipilih dari
   Kamus Basa Kumoring (public/data/kamus.json, dibangun oleh tools/build-kamus.cjs)
   atau dari contoh kalimatnya; rujukan "kamus" berisi idKata sumbernya.
   ============================================================================= */

export interface Sapaan { km: string; id: string }
export interface Padanan { id: string; km: string; bukti: string }
export interface Sejarah { era: string; judul: string; isi: string }
export interface Wilayah { key: string; nama: string; kab: string; x: number; y: number; isi: string }
export interface Marga { nama: string; kab: string; isi: string }
export interface TitikBusana { key: string; nama: string; x: number; y: number; isi: string }
export interface TahapAdat { km: string; judul: string; kamus: string; isi: string }
export interface Hidangan {
  nama: string;
  alias: string;
  jenis: string;
  kamus?: string;
  /** Foto beresolusi kecil: ditampilkan sebagai piring bundar berbingkai emas */
  piring?: boolean;
  foto: string;
  /** [lebar, tinggi] piksel asli foto */
  ukuran: [number, number];
  alt: string;
  teaser: string;
  cerita: string[];
  bahan: string[];
  sajian: string;
  fakta: string;
  kosakata: string[];
}
export interface BarisLagu { km: string; id: string; t: number[] }
export interface BagianLagu { label: string; ulang?: string; baris: BarisLagu[] }
export interface Lagu {
  judul: string;
  asal: string;
  audio: string;
  durasi: number;
  keterangan: string;
  kredit: { pencipta: string; rekaman: string };
  jeda: [number, number][];
  selesai: number;
  bagian: BagianLagu[];
  akarKata: Record<string, string>;
  abaikan: string[];
}
export interface KataJajuluk { kata: string; arti: string }
export interface Jajuluk {
  sifat: Record<string, { label: string; kata: KataJajuluk[] }>;
  penutup: KataJajuluk[];
}
export interface SoalKuis { q: string; opsi: string[]; benar: number; info: string }
export interface AksiChat { label: string; href: string; cari?: string }
export interface NiatChat { id: string; oleh: 'raka' | 'ratih'; kata: string[]; jawab: string | string[]; aksi?: AksiChat[] }
export interface Konten {
  meta: { nama: string; arti: string; acara: string; tema: string };
  sapaan: Sapaan[];
  kelasKata: Record<string, string>;
  padanan: Padanan[];
  kataSama: string[];
  contohKalimat: { id: string[]; km: string[] };
  sejarah: Sejarah[];
  wilayah: Wilayah[];
  marga: Marga[];
  busana: TitikBusana[];
  adatPernikahan: TahapAdat[];
  kuliner: Hidangan[];
  penganan: [string, string][];
  lagu: Lagu;
  jajuluk: Jajuluk;
  kuis: SoalKuis[];
  chatbot: { sapaanAwal: string; saran: string[]; intents: NiatChat[]; fallback: string[] };
}

export const DATA: Konten = {
  meta: {
    nama: 'Dang Lupa ko Komering',
    arti: 'Jangan lupakan Komering',
    acara: 'Vibe Coding IT Festival 2026',
    tema: 'Empowering Culture Through AI-Driven Innovation',
  },

  /* Sapaan bergilir di kartu hero (pertama: sapaan utama) */
  sapaan: [
    { km: 'Payu kita liak jama-jama!', id: 'Mari kita lihat bersama-sama!' },
    { km: 'Tabik! Api kabar?', id: 'Permisi! Apa kabar?' },
    { km: 'Dang lupa basa kita!', id: 'Jangan lupa bahasa kita!' },
    { km: 'Holau nihan tiuh Kumoring!', id: 'Indah sekali kampung Komering!' },
  ],

  /* Label kelas kata (kode dari public/data/kamus.json) */
  kelasKata: {
    n: 'Kata Benda',
    v: 'Kata Kerja',
    a: 'Kata Sifat',
    adv: 'Kata Keterangan',
    konj: 'Kata Sambung',
    prep: 'Kata Depan',
    seru: 'Kata Seru',
    '': 'Lainnya',
  },

  /* Padanan tambahan untuk penerjemah, masing-masing dengan bukti dari contoh
     kalimat kamus. Melengkapi kata yang tidak menjadi entri kamus. */
  padanan: [
    { id: 'apa kabar', km: 'api kabar', bukti: 'api kabar gustipohngun? — apa kabar para hadirin?' },
    { id: 'siapa nama', km: 'sapa adok', bukti: 'sapa adok sanak sina — siapa nama anak itu' },
    { id: 'nama', km: 'adok', bukti: 'sapa adok sanak sina — siapa nama anak itu' },
    { id: 'di mana|ke mana|dimana|kemana', km: 'dipa', bukti: 'onti tibatokko dipa? — nanti diletakkan dimana?' },
    { id: 'sedang', km: 'lokok', bukti: 'ubak lokok bugawi — ayah sedang bekerja' },
    { id: 'empat', km: 'pak', bukti: 'sikam pak mi adik — kami empat beradik' },
    { id: 'adat', km: 'adat', bukti: 'cara sijakok jadi adat-istiadat jolma tiuh — cara yang demikian sudah menjadi adat istiadat orang kampung' },
    { id: 'Sungai Komering', km: 'Way Kumoring', bukti: 'nama sungai; way = air/sungai' },
    { id: 'dan', km: 'rik', bukti: 'bintor na handak rik borsih — betisnya putih dan bersih' },
    { id: 'bahasa', km: 'basa', bukti: 'kawaiku butulisan basa kumoring — bajuku bertulisan bahasa komering' },
    { id: 'Komering', km: 'Kumoring', bukti: 'incang-incang di Kumoring sa nayah … — pantun-pantun di Komering ini banyak …' },
    { id: 'bersama-sama', km: 'jama-jama', bukti: 'payu kita andun jama-jama barang sina — mari kita angkat bersama-sama barang itu' },
    { id: 'mari', km: 'payu', bukti: 'payu kita andun jama-jama barang sina — mari kita angkat bersama-sama barang itu' },
    { id: 'pengantin', km: 'kabayan', bukti: 'nyak haga ngaliak kabayan arak kaliling tiyuh — saya mau melihat penganten diarak keliling kampung' },
    { id: 'pemuda|bujang', km: 'maranai', bukti: 'maranai sai radu kahwin dijuki adok — pemuda yang sudah kawin diberi gelar' },
  ],

  /* Nama diri & kata yang dipakai sama di kedua bahasa */
  kataSama: ['palembang', 'martapura', 'muaradua', 'baturaja', 'ranau', 'kayu', 'agung', 'lupa', 'selalu',
    'sampai', 'adat', 'pagi', 'gulai', 'baung', 'kasih', 'yuk', 'ya'],

  /* Contoh kalimat untuk chip penerjemah (Komering: kalimat asli dari kamus) */
  contohKalimat: {
    id: ['Apa kabar?', 'Siapa nama anak itu?', 'Saya mau makan ikan', 'Kamu mau pergi ke mana?', 'Rumah kami dekat sungai', 'Ayah sedang bekerja di sawah', 'Jangan lupa bahasa kita'],
    km: ['Nyak mongan gulai aa', 'Sapa adok sanak sina?', 'Ubak lokok bugawi', 'Agui, holau nihan sanak sina', 'Dang lupa basa kita'],
  },

  sejarah: [
    {
      era: 'Masa Leluhur', judul: 'Berakar dari Sekala Brak',
      isi: 'Leluhur Ulun Kumoring (orang Komering) diyakini berasal dari dataran tinggi Sekala Brak di sekitar Gunung Pesagi dan Danau Ranau — kawasan yang juga dianggap tanah asal masyarakat Lampung. Karena itu, Basa Kumoring serumpun dengan bahasa Lampung.',
    },
    {
      era: 'Cerita Tutur', judul: 'Asal Nama "Komering"',
      isi: 'Salah satu cerita tutur menyebut nama Komering berasal dari seorang saudagar asal India bernama Komering Singh yang singgah dan wafat di tepian sungai ini. Sejak itu sungainya dikenal sebagai Way Komering, dan masyarakat di sepanjang alirannya disebut Ulun Kumoring.',
    },
    {
      era: 'Persebaran', judul: 'Menyusuri Way Komering',
      isi: 'Kelompok-kelompok keturunan (buay) bergerak menyusuri sungai dari hulu ke hilir, membuka dusun dan ladang di tepian Way Komering. Dari sinilah lahir kebuayan seperti Buay Madang, Semendawai, dan Buay Pemuka yang namanya masih dipakai hingga kini.',
    },
    {
      era: 'Abad ke-17–19', judul: 'Bersama Kesultanan Palembang',
      isi: 'Wilayah uluan, termasuk tanah Komering, menjalin hubungan dengan Kesultanan Palembang Darussalam. Kitab hukum adat Simbur Cahaya — yang dikaitkan dengan Ratu Sinuhun — menjadi pedoman pemerintahan marga di daerah uluan.',
    },
    {
      era: 'Masa Kolonial', judul: 'Sistem Marga & Pasirah',
      isi: 'Pemerintah kolonial Belanda mempertahankan marga sebagai unit pemerintahan adat. Setiap marga dipimpin seorang Pasirah, dan tanah Komering dibagi ke dalam wilayah administratif Komering Ulu dan Komering Ilir.',
    },
    {
      era: '1983', judul: 'Berakhirnya Pemerintahan Marga',
      isi: 'Sebagai pelaksanaan UU No. 5 Tahun 1979 tentang Pemerintahan Desa, Gubernur Sumatera Selatan menghapus sistem pemerintahan marga pada 1983. Marga tak lagi menjadi unit pemerintahan, tetapi tetap hidup sebagai identitas adat dan kekerabatan.',
    },
    {
      era: '2003', judul: 'Lahirnya OKU Timur & OKU Selatan',
      isi: 'Melalui UU No. 37 Tahun 2003, Kabupaten Ogan Komering Ulu dimekarkan menjadi OKU, OKU Timur (ibu kota Martapura), dan OKU Selatan (ibu kota Muaradua) — rumah bagi sebagian besar Ulun Kumoring.',
    },
    {
      era: 'Kini', judul: 'Menjaga Basa Kumoring',
      isi: 'Basa Kumoring (kode ISO 639-3: kge) masih dituturkan ratusan ribu orang, tetapi generasi muda makin jarang memakainya. Kamus mencatat keluhan yang sama: “incang-incang di Kumoring sa nayah tapi jolma ganta mak nayah sai pandai” — pantun-pantun di Komering banyak, tetapi orang sekarang tidak banyak yang bisa.',
    },
  ],

  /* Titik peta — x/y dalam persen terhadap gambar peta-wilayah-komering.jpg */
  wilayah: [
    {
      key: 'ranau', nama: 'Danau Ranau', kab: 'OKU Selatan', x: 29.5, y: 75.5,
      isi: 'Danau vulkanik di perbatasan Sumatera Selatan–Lampung, dikenal sebagai danau terbesar kedua di Sumatera. Kawasan inilah hulu Way Komering, dekat dengan Sekala Brak — tanah yang diyakini sebagai asal leluhur.',
    },
    {
      key: 'muaradua', nama: 'Muaradua', kab: 'OKU Selatan', x: 30.2, y: 70.4,
      isi: 'Ibu kota Kabupaten OKU Selatan, di bagian hulu aliran Way Komering. Wilayah perbukitan yang sejuk dengan kebun kopi, sawah, dan tradisi uluan yang kuat.',
    },
    {
      key: 'baturaja', nama: 'Baturaja', kab: 'OKU', x: 51.3, y: 59.2,
      isi: 'Ibu kota Kabupaten Ogan Komering Ulu. Kota multietnis tempat bertemunya masyarakat Ogan, Komering, Daya, dan pendatang.',
    },
    {
      key: 'martapura', nama: 'Martapura', kab: 'OKU Timur', x: 53.5, y: 64.7,
      isi: 'Ibu kota OKU Timur dan salah satu jantung tanah Komering. Di sekitarnya terdapat kecamatan yang memakai nama kebuayan lama: Buay Madang, Semendawai, Bunga Mayang, dan Buay Pemuka Peliung.',
    },
    {
      key: 'tanjunglubuk', nama: 'Tanjung Lubuk', kab: 'OKI', x: 61.1, y: 42.6,
      isi: 'Wilayah Komering Ilir (hilir) di Kabupaten Ogan Komering Ilir. Permukiman tumbuh di sepanjang tepian sungai, dengan rumah panggung dan perahu sebagai bagian dari keseharian.',
    },
    {
      key: 'kayuagung', nama: 'Kayu Agung', kab: 'OKI', x: 70.9, y: 43.9,
      isi: 'Ibu kota Kabupaten OKI. Masyarakat asli Kayuagung memiliki bahasa yang berkerabat dekat dengan Basa Kumoring — sama-sama dari rumpun Lampungik.',
    },
    {
      key: 'palembang', nama: 'Palembang', kab: 'Ibu Kota Provinsi', x: 63.1, y: 33.8,
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
    { key: 'beludru', nama: 'Kawai Beludru Merah', x: 37.9, y: 52.5, isi: 'Kawai (baju) beludru merah marun bersulam benang emas. Merah melambangkan keberanian; sulaman emas melambangkan kemakmuran.' },
    { key: 'pusaka', nama: 'Senjata Pusaka', x: 47.9, y: 62.5, isi: 'Keris/siwar yang dibawa mempelai pria — simbol tanggung jawab melindungi keluarga dan menjaga marwah.' },
    { key: 'songket', nama: 'Kain Songket', x: 42.5, y: 84.8, isi: 'Tenun bertabur benang emas dengan motif geometris belah ketupat. Motif yang berulang melambangkan keteraturan dan harapan yang tak putus.' },
    { key: 'kalung', nama: 'Kalung Bersusun', x: 56.7, y: 59.7, isi: 'Perhiasan dada bertingkat berwarna emas. Makin lengkap perhiasan, makin tinggi penghormatan bagi mempelai.' },
    { key: 'gelang', nama: 'Gelang & Pacar', x: 63.75, y: 68.1, isi: 'Gelang emas lebar dan sulaman pada ujung lengan baju. Jari calon pengantin biasanya dihias pacar (inai) menjelang pernikahan.' },
    { key: 'rumahulu', nama: 'Rumah Ulu', x: 71.7, y: 15.6, isi: 'Rumah panggung kayu tradisional daerah uluan Sumatera Selatan. Kolongnya yang tinggi melindungi dari luapan sungai dan binatang, sekaligus menjadi tempat menyimpan perkakas — termasuk sahara, kotak kayu besar penyimpan padi.' },
  ],

  /* Tahapan pernikahan adat — istilah & makna dari kamus (idKata di "kamus") */
  adatPernikahan: [
    { km: 'Mancik', judul: 'Perkenalan Orang Tua', kamus: 'KOM-K02420', isi: 'Perkenalan orang tua calon mempelai — menurut kamus, tahap pertama dalam tahapan pernikahan adat Komering.' },
    { km: 'Ngalamar', judul: 'Lamaran & Baban Binatok', kamus: 'KOM-K00269', isi: 'Pihak laki-laki melamar sambil membawa baban binatok: barang antaran calon pengantin laki-laki.' },
    { km: 'Nerolok', judul: 'Menentukan Hari', kamus: 'KOM-K02511', isi: 'Kedua keluarga bermusyawarah menentukan waktu pernikahan.' },
    { km: 'Ulangan', judul: 'Berpantun Keliling Kampung', kamus: 'KOM-K03692', isi: 'Sebelum menikah, calon pengantin biasanya berpantun seperti bernyanyi keliling kampung.' },
    { km: 'Nyawak & Buantak', judul: 'Gotong Royong Hajatan', kamus: 'KOM-K03061', isi: 'Bapak-bapak membawa beras dalam karung (nyawak), ibu-ibu membawa beras dan pecah belah (buantak) untuk persiapan hajatan.' },
    { km: 'Kunkunan', judul: 'Utusan Penjemput', kamus: 'KOM-K01998', isi: 'Utusan dikirim lebih dulu sebelum penjemputan pengantin perempuan.' },
    { km: 'Cacap', judul: 'Akad Nikah & Cacap', kamus: 'KOM-K00480', isi: 'Setelah akad nikah, kepala kedua kabayan (pengantin) disiram.' },
    { km: 'Arak & Bumiyah', judul: 'Arak-arakan & Pesta', kamus: 'KOM-K00144', isi: 'Kabayan diarak keliling kampung, lalu pesta besar semalam suntuk (bumiyah) dimeriahkan pantun canggoh dan bindiran.' },
    { km: 'Jajuluk', judul: 'Pemberian Gelar', kamus: 'KOM-K01424', isi: 'Pengantin menerima jajuluk — misalnya Mangku Alam untuk suami dan Nai Mangku Alam untuk istri.' },
  ],

  /* Kuliner: foto di public/kuliner/. Kata Komering di teks diambil dari kamus
     (iwak, cabi, siya, poros, lalak, bulung punti, tomtom, nganik, …);
     "kamus" menautkan entri kamusnya bila ada. */
  kuliner: [
    {
      nama: 'Pindang Komering', alias: 'Pindang ikan sungai', jenis: 'Lauk Berkuah', kamus: 'KOM-K02902',
      foto: '/kuliner/pindang-komering.jpeg', ukuran: [635, 357], alt: 'Pindang ikan berkuah merah dengan tomat, nanas, cabai, dan daun kemangi di dalam panci',
      teaser: 'Kuah asam-pedas yang harum, ikan sungai yang lembut — inilah gulai kebanggaan tepian Way Komering.',
      cerita: [
        'Kamus Basa Kumoring mencatat pindang sebagai lauk ikan berkuah dengan bumbu dapur yang menjadi ciri khas gulai di Komering. Hidangan ini lahir dari sungai: iwak (ikan) segar tangkapan pagi langsung masuk ke kuali di pawon (dapur).',
        'Rahasianya ada pada keseimbangan rasa. Poros (asam) dari nanas dan tomat, lalak (pedas) dari cabi (cabai), lalu wangi kemangi yang ditabur paling akhir. Kamus bahkan mencontohkan: “tauman bangik dipindang” — ikan toman enak dipindang.',
      ],
      bahan: ['Iwak sungai: tauman (toman), samancat (gabus), atau patin', 'Nanas & tomat untuk rasa asam yang segar', 'Cabi, bawang siyaw (merah) & bawang handak (putih)', 'Kunyir (kunyit), lengkuas, serai, dan kemangi'],
      sajian: 'Santap panas-panas bersama kan (nasi) hangat. Seruput kuahnya dulu — orang Komering akan berseru, “bangik nihan!” (enak sekali!).',
      fakta: 'Tiap daerah di Sumatera Selatan punya pindang andalannya sendiri. Bagi Ulun Kumoring, pindang bukan cuma hidangan pesta — kamus mencatat kalimat sehari-hari “moh pagi nyak haga masak pindang”: besok pagi saya mau masak pindang.',
      kosakata: ['iwak', 'poros', 'lalak', 'cabi', 'nanas', 'tauman', 'bangik'],
    },
    {
      nama: 'Pindang Kuwol', alias: 'Pindang keong sawah', jenis: 'Lauk Berkuah',
      foto: '/kuliner/pindang-kuwol.jpeg', ukuran: [473, 465], alt: 'Semangkuk keong sawah dalam kuah kuning kemerahan',
      teaser: 'Keong sawah dalam kuah kuning gurih-pedas. Kecil-kecil, tapi sekali coba pasti ketagihan.',
      cerita: [
        'Kuwol adalah keong yang dipungut dari huma (sawah) dan rawa di sekitar Way Komering. Sebelum dimasak, kuwol direndam dan dicuci berkali-kali sampai benar-benar bersih — pekerjaan yang butuh kesabaran.',
        'Kuwol lalu dimasak dalam kuah berbumbu kunyir (kunyit), bawang, dan cabi sampai warna kuningnya meresap ke setiap cangkang. Hasilnya kuah yang gurih, sedikit pedas, dan harum rempah.',
      ],
      bahan: ['Kuwol (keong sawah) yang sudah dibersihkan', 'Kunyir (kunyit), bawang siyaw & bawang handak', 'Cabi (cabai) dan serai', 'Siya (garam) secukupnya'],
      sajian: 'Cara makannya seru: ujung cangkang dipotong, lalu daging kuwol diisap langsung dari cangkangnya — sssrup! Paling asyik dinikmati ramai-ramai.',
      fakta: 'Dulu kuwol adalah lauk murah meriah keluarga petani: cukup dipungut sepulang dari huma. Kini justru dicari karena rasanya yang khas.',
      kosakata: ['huma', 'cabi', 'siya'],
    },
    {
      nama: 'Pepes Tampuyak', alias: 'Pepes ikan tempoyak', jenis: 'Olahan Durian', kamus: 'KOM-K03234',
      foto: '/kuliner/pepes-tampuyak.jpeg', ukuran: [650, 350], alt: 'Ikan berbumbu tempoyak oranye dengan daun kemangi di atas daun pisang',
      teaser: 'Ikan berselimut tempoyak, dibungkus daun pisang, lalu dimasak hingga harum — asam, gurih, dan legit sekaligus.',
      cerita: [
        'Tampuyak adalah durian yang diasamkan — cara orang Komering mengawetkan durian saat panen raya. Daging durian diberi siya (garam), lalu disimpan beberapa hari sampai rasanya asam dan aromanya makin kuat.',
        'Untuk pepes, iwak dilumuri tampuyak dan bumbu halus, kemudian di-“tomtom rik bulung punti” — dibungkus dengan daun pisang, persis seperti contoh kalimat di kamus — dan dimasak sampai matang.',
      ],
      bahan: ['Tampuyak (durian yang diasamkan)', 'Iwak: patin atau ikan sungai lainnya', 'Cabi, bawang siyaw, dan kunyir', 'Kemangi & bulung punti (daun pisang)'],
      sajian: 'Buka bungkusnya di meja dan biarkan aromanya menyebar. Paling pas disantap dengan kan hangat; daun kemangi menambah rasa segar.',
      fakta: 'Saat musim durian, keluarga Komering biasa buduriaan — makan durian ramai-ramai di kebun. Durian yang tak habis dimakan diolah menjadi tampuyak agar tahan lama.',
      kosakata: ['tampuyak', 'durian', 'buduriaan', 'tomtom', 'punti', 'siya'],
    },
    {
      nama: 'Bekasam', alias: 'Ikan fermentasi goreng', jenis: 'Ikan Fermentasi',
      foto: '/kuliner/bekasam.jpeg', ukuran: [736, 416], alt: 'Bekasam goreng dengan taburan bawang putih dan cabai di piring enamel',
      teaser: 'Ikan yang “ditidurkan” bersama nasi dan garam, lalu digoreng renyah dengan bawang dan cabai. Asam-asinnya bikin nambah nasi!',
      cerita: [
        'Bekasam lahir dari kearifan masyarakat sungai. Saat tangkapan iwak melimpah, ikan dibersihkan, dilumuri siya (garam), dicampur nasi atau beras sangrai, lalu disimpan rapat selama beberapa hari.',
        'Fermentasi alami inilah yang membuat ikan awet sekaligus memberi rasa poros (asam) dan gurih yang khas — rasa yang tidak bisa didapat dari ikan segar.',
      ],
      bahan: ['Iwak sungai segar', 'Siya (garam)', 'Nasi atau beras sangrai', 'Bawang handak (putih) & cabi untuk menggoreng'],
      sajian: 'Goreng bekasam bersama bawang handak dan cabi sampai butiran nasinya kering dan renyah, seperti di foto. Sepotong kecil sudah cukup untuk sepiring kan.',
      fakta: 'Fermentasi adalah “kulkas” para leluhur. Jauh sebelum ada lemari es, cara ini membuat hasil sungai bisa disimpan jauh lebih lama.',
      kosakata: ['iwak', 'siya', 'poros', 'bawang handak', 'kan'],
    },
    {
      nama: 'Sambal Jokjok', alias: 'Sambal pecel ikan', jenis: 'Sambal', kamus: 'KOM-K01610',
      foto: '/kuliner/sambal-jokjok.jpeg', ukuran: [387, 387], alt: 'Sambal jokjok berwarna merah oranye di atas cobek batu',
      teaser: 'Pecel ikan ala Komering: ikan dan cabai diulek jadi satu. Pedasnya nendang, gurihnya bikin lupa diri.',
      cerita: [
        'Dalam kamus, jokjok berarti sambal berupa pecel ikan. Daging iwak yang sudah dimasak diulek bersama cabi, bawang, dan siya di atas cobek batu hingga rasa ikannya menyatu dengan sambal.',
        'Saking akrabnya jokjok di meja makan, Basa Kumoring punya kata khusus untuknya: bujokjok — makan dengan lauk pecel ikan.',
      ],
      bahan: ['Iwak (ikan) yang sudah dimasak', 'Cabi (cabai) rawit & cabai merah', 'Bawang siyaw dan siya (garam)', 'Cobek batu untuk mengulek'],
      sajian: 'Jokjok paling nikmat dengan kan hangat dan lalapan. Mau menawarkan ke teman? Pakai kalimat dari kamus: “amon niku haga mongan jokjok onti kuguwaiko” — kalau kamu mau makan pecel ikan, nanti saya buatkan.',
      fakta: 'Mau bilang “pedas” dalam Basa Kumoring? Lalak! Contoh kamus: “sambal sina lalak nihan” — sambal itu pedas sekali.',
      kosakata: ['jokjok', 'bujokjok', 'cabi', 'lalak', 'mongan'],
    },
    {
      nama: 'Juadah Basah', alias: 'Kue basah pandan', jenis: 'Kue Basah', kamus: 'KOM-K01638', piring: true,
      foto: '/kuliner/juadah-basah-hd.jpeg', ukuran: [600, 600], alt: 'Juadah basah hijau pandan berbentuk cincin',
      teaser: 'Kue hijau yang lembut dan lembap, harum pandan dan santan — teman setia kopi sore dan suguhan wajib saat Lebaran.',
      cerita: [
        'Sekilas juadah basah mirip bolu pandan, tetapi teksturnya lebih padat, lembut, dan lembap. Warna hijaunya alami: berasal dari daun pandan dan daun suji yang direbus bersama santan hingga harum.',
        'Telur dan gula dikocok sampai mengembang, lalu dicampur tepung terigu, santan pandan, dan sedikit margarin. Adonan dipanggang perlahan dengan api kecil — ada yang memakai loyang bundar berlubang di tengah seperti pada foto — lalu didinginkan dan dipotong-potong.',
      ],
      bahan: ['Telur & gula pasir', 'Tepung terigu', 'Santan dari nyiwi (daging kelapa)', 'Daun pandan & daun suji untuk warna dan aroma'],
      sajian: 'Potong kecil-kecil dan nikmati bersama kopi atau teh di pagi atau sore hari. Saat Idulfitri dan syukuran, juadah basah biasa hadir di meja tamu.',
      fakta: 'Juadah basah dikenal luas di Sumatera Selatan dan resepnya diwariskan turun-temurun. Teksturnya yang padat dan lembut dipercaya membawa keberuntungan dan kebahagiaan bagi yang menyantapnya. Dalam Basa Kumoring, kue seperti ini disebut kanian.',
      kosakata: ['juadah', 'anggalu', 'kanian', 'nganik', 'nyiwi'],
    },
    {
      nama: 'Tumpi', alias: 'Ketan bungkus daun pisang', jenis: 'Penganan', kamus: 'KOM-K03634',
      foto: '/kuliner/tumpi.jpeg', ukuran: [415, 739], alt: 'Tumpukan tumpi berbungkus daun pisang di atas nyiru anyaman',
      teaser: 'Bungkusan hijau mungil berisi ketan pulen — sederhana, wangi daun pisang, dan selalu habis duluan.',
      cerita: [
        'Menurut kamus, tumpi adalah makanan dari ketan yang dibungkus dengan daun pisang. Ketan dibungkus rapi dengan bulung punti sehingga aroma daunnya meresap dan ketannya tetap lembut.',
        'Seperti pada foto, tumpi biasa dibuat banyak sekaligus lalu disusun di atas nyiru — praktis untuk dibagikan kepada keluarga dan tetangga.',
      ],
      bahan: ['Beras ketan', 'Bulung punti (daun pisang) untuk membungkus'],
      sajian: 'Nikmati tumpi pada sore hari bersama kopi atau teh — saat yang pas untuk kanik, istilah kamus untuk menyantap penganan kecil di sore hari.',
      fakta: 'Basa Kumoring punya dua kata untuk makan: mongan untuk makan nasi, dan nganik untuk makan selain nasi. Jadi, kalau menawarkan tumpi, ucapkan “haga mak niku nganik tumpi?” — maukah kamu makan tumpi?',
      kosakata: ['tumpi', 'nganik', 'mongan', 'kanik', 'punti'],
    },
  ],

  /* Penganan lain yang tercatat di kamus (ditampilkan sebagai tautan ke kamus) */
  penganan: [
    ['ingkuk', 'kue ketan angka delapan'], ['kampolang', 'kemplang'], ['gumak', 'ketan siram gula'],
    ['bingka', 'kue pisang atau ubi'], ['apam', 'kue apem'], ['angkak', 'kue ketan'], ['tapai', 'tapai'],
    ['dawat', 'dawet'], ['tangguli', 'gula aren cair'], ['lutis nanas', 'manisan nanas'],
  ],

  /* Lagu daerah "Dang Lupa ko Komering" (rekaman di public/lagu/, lirik di data/sumber/).
     t = detik mulai baris itu dinyanyikan dalam rekaman (reff dinyanyikan berulang).
     Waktu diselaraskan dengan rekaman memakai pengenal suara + analisis energi vokal.
     Terjemahan bebas berdasarkan kamus; kata yang artinya masih dugaan ditandai di kamus. */
  lagu: {
    judul: 'Dang Lupa ko Komering',
    asal: 'Lagu daerah Komering · Sumatera Selatan',
    audio: '/lagu/dang-lupa-ko-komering.mp3',
    durasi: 273.7,
    keterangan: 'Lirik tersorot mengikuti rekaman. Terjemahan bebas disusun dengan bantuan Kamus Basa Kumoring; tujuh kata lirik (nyuntuh, tajok, andan, kacaroman, sangon, among, lebu) dicatat di kamus dengan tanda “arti dugaan” sampai dipastikan penutur asli.',
    kredit: {
      pencipta: 'NN (lagu daerah Komering, pencipta tidak diketahui)',
      rekaman: 'Video YouTube “Dang Lupa Ko Komering — Lagu Daerah Komering SUMSEL | Lirik, Aksara & Terjemahan”',
    },
    jeda: [[93.5, 108.8], [198.3, 214.1]],
    selesai: 270.0,
    bagian: [
      {
        label: 'Bait 1',
        baris: [
          { km: 'Sikam onjak Kumoring', id: 'Kami berasal dari Komering', t: [28.0] },
          { km: 'Lijung onjak tiuhan', id: 'Pergi meninggalkan kampung halaman', t: [31.4] },
          { km: 'Mirak ga nyepok honing', id: 'Ingin mencari ketenteraman', t: [34.4] },
          { km: 'Nyuntuh hulun sai sonang', id: 'Meneladani orang yang berbahagia', t: [37.5] },
          { km: 'Adat sangon ti kating', id: 'Adat sejak dahulu dipegang teguh', t: [40.6] },
          { km: 'Peninggal ninik muyang', id: 'Peninggalan nenek moyang', t: [43.7] },
        ],
      },
      {
        label: 'Bait 2',
        baris: [
          { km: 'Adat sai sikam pakai', id: 'Adat yang kami pakai', t: [48.2] },
          { km: 'Saka onjak bahari', id: 'Sudah lama, sejak zaman dahulu', t: [51.4] },
          { km: 'Tinawai tiyan ombai', id: 'Diamanatkan oleh para nenek', t: [54.9] },
          { km: 'Tajok Kumoring jadi', id: 'Hingga Komering tegak berdiri', t: [58.1] },
          { km: 'Makwat angguwai posai', id: 'Bukan buatan sendiri', t: [61.2] },
          { km: 'Nyuntuh di kanan kiri', id: 'Meneladani yang di kanan dan kiri', t: [64.3] },
        ],
      },
      {
        label: 'Reff', ulang: '4×',
        baris: [
          { km: 'Kumoring dang lupa dipa juga', id: 'Komering, jangan lupa di mana pun berada', t: [69.1, 75.6, 81.8, 88.3] },
        ],
      },
      {
        label: 'Bait 3',
        baris: [
          { km: 'Ombai akas kaminan', id: 'Nenek, kakek, dan bibi', t: [108.8] },
          { km: 'Among lebu kemaman', id: 'Para tetua dan paman', t: [112.1] },
          { km: 'Puari kiri kanan', id: 'Saudara di kiri dan kanan', t: [115.1] },
          { km: 'Sikam ga kilu andan', id: 'Kami hendak memohon restu', t: [118.3] },
          { km: 'Tingkah laku dang nyimpang', id: 'Tingkah laku jangan menyimpang', t: [121.3] },
          { km: 'Jak adat kacaroman', id: 'Dari adat dan tata krama', t: [124.2] },
        ],
      },
      {
        label: 'Bait 4',
        baris: [
          { km: 'Unyin kolpah puari', id: 'Semua sanak saudara', t: [129.4] },
          { km: 'Sai nyepok dipa juga', id: 'Yang mencari nafkah di mana pun', t: [132.5] },
          { km: 'Pai kita rami-rami', id: 'Mari kita bersama-sama', t: [135.5] },
          { km: 'Bekilu sai kuasa', id: 'Memohon kepada Yang Kuasa', t: [138.2] },
          { km: 'Jadi sai basing gawi', id: 'Agar berhasil apa pun pekerjaannya', t: [141.3] },
          { km: 'Mak milih sapa juga', id: 'Tanpa memandang siapa pun', t: [144.5] },
        ],
      },
      {
        label: 'Reff', ulang: '4×, diulang hingga akhir',
        baris: [
          { km: 'Kumoring dang lupa dipa juga', id: 'Komering, jangan lupa di mana pun berada',
            t: [149.6, 155.9, 161.9, 168.4, 174.4, 181.5, 187.9, 194.2, 214.1, 220.8, 227.1, 233.6, 239.0, 245.9, 252.4, 258.4, 264.4] },
        ],
      },
    ],
    /* Bentuk kata di lirik → kata di kamus (untuk daftar kosakata lagu) */
    akarKata: { nyepok: 'sopok', tiuhan: 'tiuh', bekilu: 'kilu' },
    /* Kata lirik yang tidak ditampilkan di daftar kosakata lagu */
    abaikan: [],
  },

  /* Jajuluk mengikuti pola di kamus (KOM-K01424): dua kata, mis. "Mangku Alam"
     atau "Satria Bangsawan"; gelar istri = "Nai" + gelar suami. */
  jajuluk: {
    sifat: {
      berani: { label: 'Pemberani', kata: [{ kata: 'Satria', arti: 'kesatria yang berani' }, { kata: 'Perkasa', arti: 'kuat dan perkasa' }, { kata: 'Gagah', arti: 'gagah berani' }] },
      bijak: { label: 'Bijaksana', kata: [{ kata: 'Mangku', arti: 'teguh memangku adat' }, { kata: 'Arif', arti: 'arif dan adil' }, { kata: 'Budi', arti: 'berbudi luhur' }] },
      cerdas: { label: 'Cerdas', kata: [{ kata: 'Pandai', arti: 'pandai dan haus ilmu' }, { kata: 'Bestari', arti: 'berilmu dan berbudi' }, { kata: 'Cendekia', arti: 'cerdas dan berwawasan luas' }] },
      ramah: { label: 'Ramah', kata: [{ kata: 'Manis', arti: 'manis tutur katanya' }, { kata: 'Kasih', arti: 'penuh kasih sayang' }, { kata: 'Seri', arti: 'berseri dan menyenangkan' }] },
      dermawan: { label: 'Dermawan', kata: [{ kata: 'Mulia', arti: 'mulia hatinya' }, { kata: 'Budiman', arti: 'baik budi dan suka menolong' }, { kata: 'Dermawan', arti: 'murah hati' }] },
      setia: { label: 'Setia', kata: [{ kata: 'Teguh', arti: 'teguh pendirian' }, { kata: 'Setia', arti: 'setia pada keluarga dan janji' }, { kata: 'Tuah', arti: 'membawa tuah bagi sesama' }] },
    },
    penutup: [
      { kata: 'Alam', arti: 'alam tempatnya tumbuh' },
      { kata: 'Bangsawan', arti: 'keluhuran budi para bangsawan' },
      { kata: 'Negara', arti: 'negeri dan bangsanya' },
      { kata: 'Bumi', arti: 'bumi tempatnya berpijak' },
      { kata: 'Pesagi', arti: 'Gunung Pesagi, tanah leluhur di Sekala Brak' },
      { kata: 'Ranau', arti: 'Danau Ranau di hulu Way Komering' },
      { kata: 'Kumoring', arti: 'tanah dan sungai Komering' },
      { kata: 'Jaya', arti: 'kejayaan para leluhur' },
      { kata: 'Marga', arti: 'kerabat dan marganya' },
    ],
  },

  /* benar = indeks jawaban benar pada opsi (sebelum diacak).
     Kuis juga menambahkan soal kosakata acak langsung dari kamus. */
  kuis: [
    { q: 'Sungai Komering bermuara ke sungai besar apa di sekitar Palembang?', opsi: ['Sungai Musi', 'Sungai Ogan', 'Sungai Lematang', 'Sungai Batanghari'], benar: 0, info: 'Way Komering mengalir dari kawasan Danau Ranau dan bertemu Sungai Musi di sekitar Palembang.' },
    { q: 'Danau yang berada di kawasan hulu Sungai Komering adalah…', opsi: ['Danau Toba', 'Danau Ranau', 'Danau Singkarak', 'Danau Kerinci'], benar: 1, info: 'Danau Ranau terletak di OKU Selatan, berbatasan dengan Lampung Barat.' },
    { q: 'Basa Kumoring termasuk rumpun bahasa…', opsi: ['Melayu Palembang', 'Lampungik', 'Jawa', 'Minangkabau'], benar: 1, info: 'Basa Kumoring serumpun dengan bahasa Lampung (rumpun Lampungik).' },
    { q: 'Kata “tabik” dalam Basa Kumoring digunakan untuk…', opsi: ['Permisi sambil menundukkan badan', 'Mengajak makan', 'Berpamitan tidur', 'Memanggil hewan'], benar: 0, info: 'Kamus: tabik = permisi kepada orang-orang yang sedang duduk sambil menundukkan badan.' },
    { q: 'Apa Basa Kumoring dari kata “makan”?', opsi: ['Nginum', 'Turui', 'Mongan', 'Mulang'], benar: 2, info: 'Mongan = makan, nginum = minum, turui = tidur, mulang = pulang. Contoh: “nyak mongan gulai aa” — saya makan lauk daging.' },
    { q: 'Kata “lombahan” dalam Basa Kumoring berarti…', opsi: ['Pelan', 'Rumah', 'Sungai', 'Jalan'], benar: 1, info: 'Lombahan = rumah. Contoh: “adok sai disopok nilai di bah lombahan” — apa yang dicari kakak di bawah rumah.' },
    { q: 'Kabupaten OKU Timur beribu kota di…', opsi: ['Baturaja', 'Muaradua', 'Kayu Agung', 'Martapura'], benar: 3, info: 'OKU Timur dibentuk lewat UU No. 37 Tahun 2003 dengan ibu kota Martapura.' },
    { q: 'Muaradua adalah ibu kota kabupaten…', opsi: ['OKU Selatan', 'OKU Timur', 'Ogan Ilir', 'Muara Enim'], benar: 0, info: 'Muaradua menjadi ibu kota OKU Selatan sejak pemekaran 2003.' },
    { q: '“Dang lupa” artinya…', opsi: ['Sudah ingat', 'Jangan lupa', 'Mau pulang', 'Belum tahu'], benar: 1, info: 'Dang = jangan. Contoh: “dang lupa nyangkuk kanian semakkung lapah” — jangan lupa mengambil makanan sebelum pergi.' },
    { q: 'Kitab hukum adat Kesultanan Palembang yang berlaku di marga-marga uluan bernama…', opsi: ['Simbur Cahaya', 'Kutara Manawa', 'Undang-Undang Melaka', 'Hikayat Hang Tuah'], benar: 0, info: 'Simbur Cahaya dikaitkan dengan Ratu Sinuhun dan menjadi pedoman pemerintahan marga.' },
    { q: 'Pada masa kolonial, pemimpin sebuah marga disebut…', opsi: ['Pasirah', 'Gubernur', 'Syahbandar', 'Patih'], benar: 0, info: 'Pasirah memimpin marga, unit pemerintahan adat yang bertahan hingga 1983.' },
    { q: 'Leluhur Ulun Kumoring diyakini berasal dari kawasan…', opsi: ['Sekala Brak', 'Pagaruyung', 'Majapahit', 'Kutai'], benar: 0, info: 'Sekala Brak di sekitar Gunung Pesagi dan Danau Ranau, tanah asal yang juga diyakini masyarakat Lampung.' },
    { q: 'Tradisi membagi nasi dan lauk pauk kepada tetangga disebut…', opsi: ['Katodan', 'Bumiyah', 'Mancik', 'Nerolok'], benar: 0, info: 'Kamus: katodan = membagi nasi dan lauk pauk kepada tetangga, biasanya pada Kamis malam.' },
    { q: 'Reff lagu “Dang Lupa ko Komering” berbunyi “Kumoring dang lupa dipa juga”. Artinya…', opsi: ['Komering, jangan lupa di mana pun berada', 'Komering, mari pulang ke kampung', 'Komering, sungai yang panjang', 'Komering, tanah yang subur'], benar: 0, info: 'Kamus: dang = jangan, dipa = di mana. Dengarkan lagunya di bagian Lagu!' },
    { q: 'Basa Kumoring punya dua kata untuk “makan”. Kata “nganik” dipakai untuk…', opsi: ['Makan selain nasi, misalnya kue', 'Makan nasi', 'Makan bersama di pesta', 'Makan di malam hari'], benar: 0, info: 'Kamus: nganik = makan selain nasi, mongan = makan. Contoh: “haga mak niku nganik tumpi?” — maukah kamu makan tumpi?' },
    { q: 'Tampuyak (tempoyak) terbuat dari…', opsi: ['Durian yang diasamkan', 'Kelapa parut', 'Ikan asin', 'Singkong'], benar: 0, info: 'Kamus: tampuyak = durian yang diasamkan, durian yang diawetkan.' },
    { q: '“Rua, tolu, pak” artinya…', opsi: ['Dua, tiga, empat', 'Pagi, siang, malam', 'Ayah, ibu, anak', 'Makan, minum, tidur'], benar: 0, info: 'Rua = dua, tolu = tiga, pak = empat. Contoh: “sikam pak mi adik” — kami empat beradik.' },
    { q: 'Dalam adat Komering, “buay” berarti…', opsi: ['Keturunan/kelompok kerabat', 'Perahu', 'Rumah panggung', 'Alat musik'], benar: 0, info: 'Buay = keturunan. Contoh: Buay Madang, Buay Pemuka.' },
    { q: 'Gelar yang diberikan kepada seseorang setelah menikah disebut…', opsi: ['Jajuluk', 'Tampuyak', 'Lombahan', 'Kabayan'], benar: 0, info: 'Kamus: jajuluk = gelar setelah menikah, mis. Mangku Alam untuk suami dan Nai Mangku Alam untuk istri.' },
    { q: 'Rumah panggung kayu tradisional daerah uluan Sumatera Selatan disebut…', opsi: ['Rumah Ulu', 'Rumah Gadang', 'Joglo', 'Honai'], benar: 0, info: 'Rumah Ulu: rumah panggung kayu dengan kolong tinggi.' },
    { q: 'Tahap pertama pernikahan adat Komering — perkenalan orang tua calon mempelai — disebut…', opsi: ['Mancik', 'Nerolok', 'Cacap', 'Arak'], benar: 0, info: 'Kamus: mancik = perkenalan orang tua calon mempelai, tahap pertama dalam tahapan pernikahan adat Komering.' },
    { q: '“Kabayan” dalam Basa Kumoring berarti…', opsi: ['Pengantin', 'Pemuda', 'Nenek', 'Pedagang'], benar: 0, info: 'Contoh kamus: “nyak haga ngaliak kabayan arak kaliling tiyuh” — saya mau melihat pengantin diarak keliling kampung.' },
    { q: 'Setelah akad nikah, kepala kedua pengantin disiram. Tradisi ini disebut…', opsi: ['Cacap', 'Mancik', 'Nerolok', 'Katodan'], benar: 0, info: 'Kamus: cacap = siram. “mohpagi radu akad nikah kabayan sija ticacap huluna” — besok pagi setelah akad nikah kedua pengantin ini disiram kepalanya.' },
  ],

  chatbot: {
    sapaanAwal: 'Tabik! Nyak Ratih, dan ini Raka. Tanya apa saja seputar budaya Komering, minta terjemahan (mis. **bahasa komering saya mau makan**), atau cari arti kata (mis. **arti kabayan**).',
    saran: ['Siapa suku Komering?', 'Asal-usul nama Komering', 'Bahasa komering "apa kabar"', 'Arti kata kabayan', 'Makanan khas Komering', 'Tahapan nikah adat Komering'],
    intents: [
      { id: 'salam', oleh: 'ratih', kata: ['halo', 'hai', 'hallo', 'hei', 'tabik', 'assalamualaikum', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'permisi'],
        jawab: ['Tabik! Api kabar? Mau ngobrol soal sejarah, bahasa, kuliner, atau adat Komering?', 'Tabik! Nyak Ratih di sini. Silakan tanya apa saja tentang Komering, atau minta nyak menerjemahkan kalimat.'] },
      { id: 'kabar', oleh: 'ratih', kata: ['apa kabar', 'api kabar', 'kabarmu', 'gimana kabar'],
        jawab: ['Kabarku baik! Kalau niku (kamu), api kabar?'] },
      { id: 'tentang', oleh: 'raka', kata: ['suku komering', 'siapa komering', 'apa itu komering', 'orang komering', 'ulun kumoring', 'jolma kumoring', 'komering itu'],
        jawab: 'Ulun Kumoring (orang Komering) bermukim di sepanjang aliran Way Komering, Sumatera Selatan — terutama di OKU Timur, OKU Selatan, OKU, dan OKI. Bahasanya, Basa Kumoring, serumpun dengan bahasa Lampung.',
        aksi: [{ label: 'Lihat peta wilayah', href: '#peta' }] },
      { id: 'nama', oleh: 'raka', kata: ['asal usul nama', 'asal nama', 'nama komering', 'arti komering', 'singh', 'legenda', 'kenapa disebut', 'dinamakan'],
        jawab: 'Salah satu cerita tutur menyebut nama "Komering" berasal dari saudagar India bernama Komering Singh yang wafat di tepian sungai ini. Sungainya lalu disebut Way Komering. Ini cerita rakyat, ya — versi lain juga ada.',
        aksi: [{ label: 'Buka linimasa sejarah', href: '#sejarah' }] },
      { id: 'asal', oleh: 'raka', kata: ['asal', 'usul', 'leluhur', 'nenek moyang', 'sekala', 'brak', 'pesagi', 'berasal', 'sejarah'],
        jawab: 'Menurut tradisi lisan, leluhur Komering berasal dari Sekala Brak di sekitar Gunung Pesagi dan Danau Ranau — tanah asal yang juga diyakini masyarakat Lampung. Dari sana, kelompok-kelompok buay menyusuri Way Komering ke hilir.',
        aksi: [{ label: 'Buka linimasa sejarah', href: '#sejarah' }] },
      { id: 'sungai', oleh: 'raka', kata: ['sungai', 'way', 'wai', 'ranau', 'musi', 'hulu', 'hilir', 'muara', 'danau', 'pangkalan'],
        jawab: 'Way Komering berhulu di kawasan Danau Ranau (OKU Selatan), mengalir melewati Muaradua dan Martapura hingga Komering Ilir, lalu bertemu Sungai Musi di sekitar Palembang. Sungai ini adalah urat nadi kehidupan Ulun Kumoring.',
        aksi: [{ label: 'Jelajahi peta', href: '#peta' }] },
      { id: 'wilayah', oleh: 'raka', kata: ['wilayah', 'daerah', 'kabupaten', 'oku', 'oki', 'martapura', 'muaradua', 'baturaja', 'kayu agung', 'kayuagung', 'tinggal', 'dimana', 'lokasi', 'peta'],
        jawab: 'Wilayah sebaran Komering meliputi Kabupaten OKU Selatan, OKU Timur, OKU, dan OKI di Sumatera Selatan — mengikuti aliran Way Komering. Kota pentingnya antara lain Muaradua, Martapura, Baturaja, dan Kayu Agung.',
        aksi: [{ label: 'Jelajahi peta', href: '#peta' }] },
      { id: 'bahasa', oleh: 'ratih', kata: ['bahasa', 'basa', 'dialek', 'rumpun', 'lampung', 'iso', 'kge'],
        jawab: 'Basa Kumoring termasuk rumpun Lampungik (kode ISO 639-3: kge). Contohnya nyak (saya), niku (kamu), mongan (makan), dan lombahan (rumah). Kamus kami memuat {jumlahKata} kata — coba ketik: **bahasa komering saya mau makan**.',
        aksi: [{ label: 'Buka Penerjemah AI', href: '#penerjemah' }] },
      { id: 'kamus', oleh: 'ratih', kata: ['kamus', 'kosakata', 'kosa kata', 'berapa kata', 'sumber data', 'data kamus'],
        jawab: 'Kamus Basa Kumoring di aplikasi ini memuat {jumlahKata} kata ({jumlahKataDasar} kata dasar + {jumlahTurunan} kata turunan) dengan {jumlahContoh} contoh kalimat. Ketik **arti [kata]** untuk mencari, misalnya **arti holau**.',
        aksi: [{ label: 'Buka kamus', href: '#kamus' }] },
      { id: 'aksara', oleh: 'ratih', kata: ['aksara', 'huruf', 'tulisan', 'kaganga', 'surat ulu'],
        jawab: 'Masyarakat uluan Sumatera Selatan, termasuk Komering, mengenal aksara turunan Kaganga yang sering disebut Surat Ulu — ditulis pada bambu, kulit kayu, atau tanduk. Kerabat dekatnya adalah aksara Lampung.' },
      { id: 'marga', oleh: 'raka', kata: ['marga', 'buay', 'kebuayan', 'klan', 'pasirah', 'keturunan'],
        jawab: 'Buay berarti keturunan atau kelompok kerabat. Dari masa Kesultanan Palembang hingga kolonial, tanah Komering terbagi atas marga yang dipimpin Pasirah. Pemerintahan marga dihapus pada 1983, tetapi nama kebuayan seperti Buay Madang, Semendawai, dan Bunga Mayang masih hidup sebagai nama kecamatan.',
        aksi: [{ label: 'Lihat data marga', href: '#marga' }] },
      { id: 'simbur', oleh: 'raka', kata: ['simbur', 'cahaya', 'hukum adat', 'undang', 'kesultanan', 'palembang'],
        jawab: 'Simbur Cahaya adalah kitab hukum adat Kesultanan Palembang yang dikaitkan dengan Ratu Sinuhun. Aturannya — dari tata pemerintahan marga hingga pergaulan muda-mudi — berlaku di daerah uluan, termasuk tanah Komering.' },
      { id: 'nikah', oleh: 'ratih', kata: ['nikah', 'pernikahan', 'menikah', 'kawin', 'kahwin', 'pengantin', 'kabayan', 'lamaran', 'melamar', 'tahapan', 'resepsi'],
        jawab: 'Menurut kamus, pernikahan adat Komering diawali **mancik** (perkenalan orang tua calon mempelai), lalu **ngalamar** dengan baban binatok, **nerolok** (menentukan hari), gotong royong **nyawak & buantak**, **kunkunan** (utusan penjemput), akad nikah dan **cacap** (kepala pengantin disiram), **arak** keliling kampung, pesta **bumiyah**, hingga pemberian **jajuluk**.',
        aksi: [{ label: 'Lihat tahapan adat', href: '#busana' }] },
      { id: 'busana', oleh: 'ratih', kata: ['busana', 'baju', 'kawai', 'pakaian', 'songket', 'mahkota', 'siger', 'kopiah', 'beludru', 'perhiasan', 'kostum', 'pacar', 'inai'],
        jawab: 'Busana pengantin Komering didominasi kawai (baju) beludru merah marun bersulam emas, kain songket bermotif geometris, mahkota emas untuk mempelai perempuan, serta kopiah emas dan senjata pusaka untuk mempelai pria. Jari calon pengantin dihias pacar (inai).',
        aksi: [{ label: 'Jelajahi busana adat', href: '#busana' }] },
      { id: 'kuliner', oleh: 'ratih', kata: ['makanan', 'kuliner', 'masakan', 'pindang', 'tampuyak', 'tempoyak', 'jokjok', 'sambal', 'juadah', 'juadah basah', 'bolu', 'pandan', 'ingkuk', 'tumpi', 'bekasam', 'kuwol', 'keong', 'pepes', 'kue', 'khas', 'katodan'],
        jawab: 'Coba cicipi **pindang Komering** (kuah asam-pedas ikan sungai), **pindang kuwol** (keong sawah), **pepes tampuyak** (ikan bertempoyak dalam daun pisang), **bekasam** (ikan fermentasi), **sambal jokjok** (pecel ikan), **juadah basah** (kue basah pandan), dan **tumpi** (ketan bungkus daun pisang). Ada juga tradisi **katodan** — membagi nasi dan lauk pauk kepada tetangga. Bangik nihan!',
        aksi: [{ label: 'Lihat kuliner', href: '#kuliner' }] },
      { id: 'rumah', oleh: 'raka', kata: ['rumah adat', 'rumah ulu', 'panggung', 'lombahan'],
        jawab: 'Rumah Ulu adalah rumah panggung kayu tradisional daerah uluan Sumatera Selatan. Dalam Basa Kumoring, rumah disebut lombahan. Di kolongnya biasa diletakkan sahara — kotak kayu besar penyimpan padi.' },
      { id: 'lagu', oleh: 'ratih', kata: ['lagu', 'musik', 'nyanyi', 'lirik', 'bernyanyi', 'karaoke', 'pantun', 'incang'],
        jawab: 'Dengarkan lagu daerah "Dang Lupa ko Komering" di bagian Lagu — liriknya tersorot mengikuti rekaman, lengkap dengan terjemahan. Reff-nya, **Kumoring dang lupa dipa juga**, berarti "Komering, jangan lupa di mana pun berada". Tahukah kamu? Pantun dalam Basa Kumoring disebut incang, dan pantun nasihat di pesta pernikahan disebut canggoh.',
        aksi: [{ label: 'Putar lagu', href: '#lagu' }] },
      { id: 'jajuluk', oleh: 'ratih', kata: ['jajuluk', 'juluk', 'julukan', 'gelar', 'adok', 'nama adat'],
        jawab: 'Menurut kamus, jajuluk adalah gelar atau nama panggilan setelah menikah. Bila gelar pengantin laki-laki Mangku Alam, gelar pengantin perempuannya Nai Mangku Alam. Kata kamus: “amon niku kahwin rik jolma kumoring bujajuluk” — kalau kamu menikah dengan orang Komering, kamu akan bergelar!',
        aksi: [{ label: 'Buat jajuluk-ku', href: '#jajuluk' }] },
      { id: 'kuis', oleh: 'raka', kata: ['kuis', 'quiz', 'tes', 'uji', 'tantangan'],
        jawab: 'Siap diuji? Kuis kami berisi 10 soal: budaya Komering plus kosakata acak langsung dari kamus. Raih skor sempurna untuk gelar "Ulun Kumoring Sejati"!',
        aksi: [{ label: 'Mulai kuis', href: '#kuis' }] },
      { id: 'terimakasih', oleh: 'ratih', kata: ['terima kasih', 'makasih', 'trims', 'thanks', 'tarima kasih', 'thank'],
        jawab: ['Sama-sama! Dang lupa ko Kumoring, ya!'] },
      { id: 'maskot', oleh: 'raka', kata: ['raka', 'ratih', 'maskot', 'siapa kamu', 'kamu siapa'],
        jawab: 'Nyak Raka, pemandu sejarah, dan ini Ratih, pemandu bahasa. Kami mengenakan busana adat Komering: kawai beludru merah bersulam emas, kopiah emas untuk Raka, dan mahkota emas untuk Ratih.' },
      { id: 'ai', oleh: 'ratih', kata: ['ai', 'kecerdasan buatan', 'cara kerja', 'teknologi', 'algoritma'],
        jawab: 'Ada dua lapis. Mesin lokal di browser-mu memakai {jumlahKata} kata kamus dan {jumlahContoh} contoh kalimat untuk mencocokkan kata, mengenali imbuhan, dan memperbaiki salah ketik. Lalu Google Gemini menyusun jawaban atau kalimat yang alami hanya dari entri kamus dan bab situs yang relevan, dan menyebutkan sumbernya. Bila Gemini sedang tidak tersedia, mesin lokal tetap menjawab.' },
    ],
    fallback: [
      'Maaf, nyak mak pacak — aku belum tahu jawabannya. Coba tanya tentang sejarah, bahasa, marga, kuliner, atau ketik **arti [kata]** untuk mencari di kamus.',
      'Hmm, pertanyaan itu belum ada di catatan kami. Coba salah satu topik di bawah ini, atau ketik: **bahasa komering [kalimatmu]**.',
    ],
  },
};
