# Laporan Perbaikan Kamus Basa Kumoring

Dibuat otomatis oleh `tools/build-kamus.cjs` pada 2026-10-17 dari `data/sumber/kamus_komering.json` (file asli, tidak diubah) dan `data/sumber/kamus_tambahan.json` (7 kata tambahan).

## Ringkasan

| | Jumlah |
| --- | --- |
| Kata dasar | 1808 |
| Kata turunan | 1931 |
| Total kata | 3739 |
| Pasangan contoh kalimat (korpus) | 3658 |
| Padanan kata hasil penyelarasan korpus | 426 |
| Arti dengan singkatan dilengkapi (yg, dg, ttg, dlm, …) | 104 |
| Duplikat kata dasar digabung | 16 |
| Duplikat turunan digabung | 2 |
| Rujukan "lihat X" diselesaikan | 24 |
| Kata tambahan berarti dugaan (perlu verifikasi) | 7 |

Perbaikan otomatis lain: spasi tak terlihat (NBSP) dan spasi berlebih di semua kolom dirapikan.

### Perbaikan manual per entri (48)

- KOM-K00009 abui: pos
- KOM-K00010 acar: pos
- KOM-K00019 adat: pos, meaning, tambahContoh
- KOM-K00035 tiagihi: gantiTerjemahan
- KOM-K00036 tiagihko: gantiTerjemahan
- KOM-K00042 agor: pos
- KOM-K00043 agui: pos
- KOM-K00155 ai: pos
- KOM-K00167 ambasuh pungu/pudak: word, varian, meaning, example
- KOM-K00238 angit: pos
- KOM-K00276 badua: pos
- KOM-K00340 bak: pos
- KOM-K00381 bingkang: pos
- KOM-K00521 cayoh: meaning
- KOM-K00757 dang: pos
- KOM-K00761 dangasa: pos
- KOM-K00760 dangda: pos
- KOM-K00758 dangkung: pos
- KOM-K00759 dangmak: pos
- KOM-K00728 dasar: pos
- KOM-K00902 dupi: pos
- KOM-K01004 gapgup: pos
- KOM-K01122 hojong: pos
- KOM-K01123 tihojong: pos
- KOM-K01140 ibarat: pos
- KOM-K01141 ibarat: pos
- KOM-K01142 ngaibaratko: pos
- KOM-K01143 tiibaratko: pos
- KOM-K01296 sangaimbir: pos
- KOM-K01258 ngi,pukko: word, example
- KOM-K01395 jaja: pos
- KOM-K01511 anjambang: pos, meaning
- KOM-K01534 janji: pos
- KOM-K01568 jogil: pos
- KOM-K01638 juadah: meaning, gantiTerjemahan
- KOM-K01689 jukko: gantiTerjemahan
- KOM-K01857 kantu: pos
- KOM-K02205 liak: varian
- KOM-K02491 munih: pos
- KOM-K02515 ngagalu: meaning, gantiTerjemahan
- KOM-K02550 ngosang kosang: meaning
- KOM-K02616 ompong: meaning
- KOM-K02848 payot: pos
- KOM-K03061 sawak , nyawak: word, varian, example
- KOM-K03077 solik: meaning
- KOM-K03078 solom , nyolom: word, varian, example
- KOM-K03079 sopok, nyopok: word, varian, example
- KOM-K03633 tumpak: meaning, example

### Nomor homonim di depan arti dihapus (5)

- KOM-K01788 karungko: “1 karungkan, masukkan dalam karung” → “karungkan, masukkan dalam karung”
- KOM-K01789 karungko: “2 karungkan, ambilkan bagian untuk kami” → “karungkan, ambilkan bagian untuk kami”
- KOM-K01801 kasab: “1 kasar tentang telapak tangan” → “kasar tentang telapak tangan”
- KOM-K01802 kasab: “2 kotor lantai dengan pasir atau debuan” → “kotor lantai dengan pasir atau debuan”
- KOM-K03318 tilungkop: “1 (orang) jatuh tertelungkup mencium tanah, 2 (wadah yang berisi sesuatu) tertumpah habis” → “(orang) jatuh tertelungkup mencium tanah, (wadah yang berisi sesuatu) tertumpah habis”

### Kelas kata diperbaiki (32)

- KOM-K00009 abui: "" → verb
- KOM-K00010 acar: "" → noun
- KOM-K00019 adat: "verb" → noun
- KOM-K00042 agor: "" → noun
- KOM-K00043 agui: "" → interjection
- KOM-K00155 ai: "" → interjection
- KOM-K00238 angit: "" → adjective
- KOM-K00276 badua: "" → noun
- KOM-K00340 bak: "" → preposition
- KOM-K00381 bingkang: "" → adjective
- KOM-K00757 dang: "" → adverb
- KOM-K00761 dangasa: "" → adverb
- KOM-K00760 dangda: "" → adverb
- KOM-K00758 dangkung: "" → adverb
- KOM-K00759 dangmak: "" → adverb
- KOM-K00728 dasar: "" → noun
- KOM-K00902 dupi: "" → conjunction
- KOM-K01004 gapgup: "" → verb
- KOM-K01122 hojong: "" → verb
- KOM-K01123 tihojong: "" → verb
- KOM-K01140 ibarat: "" → verb
- KOM-K01141 ibarat: "" → adverb
- KOM-K01142 ngaibaratko: "" → verb
- KOM-K01143 tiibaratko: "" → verb
- KOM-K01296 sangaimbir: "" → noun
- KOM-K01395 jaja: "" → verb
- KOM-K01511 anjambang: "g" → verb
- KOM-K01534 janji: "" → noun
- KOM-K01568 jogil: "" → verb
- KOM-K01857 kantu: "" → conjunction
- KOM-K02491 munih: "" → adverb
- KOM-K02848 payot: "" → verb

### Varian ejaan dipisahkan (5)

- KOM-K00167 ambasuh pungu (+ambasuh pudak)
- KOM-K02205 liak (+liyak)
- KOM-K03061 sawak (+nyawak)
- KOM-K03078 solom (+nyolom)
- KOM-K03079 sopok (+nyopok)

### Penanda ~ / – di contoh diganti kata utamanya (7)

- KOM-K02777 pancungda
- KOM-K03051 sahara
- KOM-K03519 nganorjunko
- KOM-K03633 tumpak
- KOM-K03576 tupai
- KOM-K03606 katuwaran
- KOM-K03730 ungkaida

### Penanda nomor homonim di contoh dihapus (16)
Mis. “nyak haga amboli 1 paku sakilo” → “nyak haga amboli paku sakilo” (paku¹ = paku besi, paku² = pakis).

- KOM-K02756 paku
- KOM-K02757 paku
- KOM-K03023 rawang
- KOM-K03316 tilisoh
- KOM-K03317 tilisoh
- KOM-K03397 tingkat
- KOM-K03434 tokon
- KOM-K03437 katokon
- KOM-K03435 nganokonko
- KOM-K03438 sitokonan
- KOM-K03439 tipatokon
- KOM-K03436 titokonko
- KOM-K03440 tokon
- KOM-K03614 tuktuk
- KOM-K03615 nganuktuk
- KOM-K03616 tituktuk

### Duplikat kata dasar digabung (16)

- KOM-K00152 → KOM-K00032 (agas)
- KOM-K00109 → KOM-K00108 (alu)
- KOM-K00138 → KOM-K00137 (apui)
- KOM-K00300 → KOM-K00299 (balak)
- KOM-K00380 → KOM-K00379 (bintor)
- KOM-K00649 → KOM-K00648 (culuk)
- KOM-K00937 → KOM-K00936 (galah)
- KOM-K00957 → KOM-K00956 (galupah)
- KOM-K01035 → KOM-K01034 (golong)
- KOM-K01542 → KOM-K01540 (jantung)
- KOM-K01825 → KOM-K01824 (kawai)
- KOM-K02395 → KOM-K02394 (manuk)
- KOM-K02402 → KOM-K02401 (marah)
- KOM-K02453 → KOM-K02452 (minjak)
- KOM-K02538 → KOM-K02537 (ngating)
- KOM-K03032 → KOM-K03031 (rangraya)

### Duplikat turunan digabung (2)

- KOM-K00981 → KOM-K00977 (gawian)
- KOM-K00068 akuk (sama dengan induk)

### Rujukan "lihat" diselesaikan (24)

- KOM-K00151 adun → aduk (“aduk”)
- KOM-K00551 cangkuk bolak → cangkuk (“mengambil”)
- KOM-K00521 cayoh → carik (“koyak”)
- KOM-K00873 dudo → duda (“sana”)
- KOM-K00950 galogah → galigih (“bambu kecil”)
- KOM-K00967 garingsing → dakdak (“basah kuyup”)
- KOM-K01014 giring → gincing (“miring”)
- KOM-K01064 gorpu → bosi (“besi”)
- KOM-K01121 hiring-hiring → canggoh (“pantun nasihat digunakan ketika ada keramaian seperti pesta pernikahan”)
- KOM-K01854 kamolonan → kabolot (“menyangkutnya makanan di tenggorokan saat kita makan”)
- KOM-K01882 kisakan → canggoh (“pantun nasihat digunakan ketika ada keramaian seperti pesta pernikahan”)
- KOM-K01901 komul → salinggom (“selimut”)
- KOM-K02510 nangkorik → nangkayung (“berteriak”)
- KOM-K02550 ngosang kosang → makkahangsa hangsa (“tidak sabaran”)
- KOM-K02558 niak → ambarikbik (“menetes sedikit demi sedikit (yang selesai, sesuai sampai penghabisan)”) — ejaan rujukan “ambirikbik” dikoreksi
- KOM-K02562 ningkuk → bumiyah (“pesta besar-besaran yang dilaksanakan semalam suntuk”)
- KOM-K02579 nyindaraw → ngalidangdang (“berjalan tapi tanpa tujuan”)
- KOM-K02615 ompai → anyar (“baru (khusus untuk barang)”)
- KOM-K02616 ompong → ranguh ompong (“gigi ompong”)
- KOM-K03034 ritak → retak (“kacang tanah”)
- KOM-K03037 rodik → podok (“dekat”)
- KOM-K03042 rotak → retak (“kacang tanah”)
- KOM-K03077 solik → liak (“lihat”)
- KOM-K03569 tumalawot → malawot (“kutu kasur, kepinding”)

### Rujukan "lihat" yang diselesaikan dengan asumsi — PERLU DITINJAU (1)

- KOM-K02558 niak → ambarikbik — ejaan rujukan “ambirikbik” dikoreksi


### Kata tambahan dengan arti dugaan — PERLU DITINJAU (7)
Dari lirik lagu “Dang Lupa ko Komering”. Ditandai “arti dugaan” di situs, tidak ikut korpus penerjemah, dan tidak muncul di kuis.

- KOM-T0001 nyuntuh: meneladani, mencontoh
- KOM-T0002 tajok: tegak berdiri, berdiri kukuh
- KOM-T0003 andan: restu, izin
- KOM-T0004 kacaroman: tata krama, sopan santun
- KOM-T0005 sangon: sejak dahulu, memang
- KOM-T0006 among: tetua, sebutan kerabat yang dituakan
- KOM-T0007 lebu: tetua, sebutan kerabat yang dituakan


### Entri sensitif — tetap bisa dicari, tidak ditampilkan acak (18)
Tidak muncul di kuis, “kata acak”, dan “kata hari ini” di situs.

- KOM-K00055 kurang-ajar: kurang ajar
- KOM-K00313 bangor: busuk bau kotoran manusia
- KOM-K00429 bolbol: tahi keras, kotoran manusia yang keras, mising keras
- KOM-K00459 buyan: bodoh
- KOM-K00460 buyanjakmanyutsut: seseorang yang terlalu bodoh sehingga dianggap lebih bodoh dari hewan
- KOM-K00508 catu: makan untuk kata-kata kasar, dalam keadaan marah
- KOM-K00573 cicit: nama kemaluan anak laki-laki yang masih balita
- KOM-K00958 galukanik: makian
- KOM-K01438 jalak: nama kemaluan perempuan
- KOM-K01652 jubur: lubang pantat, anus
- KOM-K01929 kotuk: pantat
- KOM-K02357 luangan bangkai: gila anjing
- KOM-K02383 majuh: makan tapi maknanya kasar
- KOM-K02396 manuk: kelamin laki-laki
- KOM-K02677 pajuh: makan untuk kata-kata lagi marah atau emosi, kata makan yang kasar
- KOM-K03446 toling: kemaluan laki-laki
- KOM-K03530 tuaq: nama kelamin laki-laki
- KOM-K03688 uduk: bodoh, buyan

## Perlu ditinjau penutur asli

- **adat** (KOM-K00019) kini berarti “adat, kebiasaan turun-temurun; diacungkan (senjata)”. Arti utama diambil dari turunannya (*adat-istiadat*, *buadat*); arti “diacungkan” dari contoh “sinapang sina adat haguk” dipertahankan sebagai homonim.
- **juadah** (KOM-K01638) kini berarti “kue basah tradisional khas Komering (juadah basah)”; kata “dodol” pada terjemahan contoh yang memuat *juadah* diganti “juadah”.
- Beberapa terjemahan contoh memuat salah ketik, misalnya “nani” (nasi) pada *akuk* dan “kemaren”.
- Kelas kata sebagian entri tampak kurang tepat (mis. *lapah* “jalan” = noun, *ganta* “sekarang” = verb). Tidak diubah otomatis.

### Homonim (kata sama, arti berbeda) — bukan galat, untuk informasi (79)

- ngacar: membuat acar / lari tak tentu arah
- adok: apa / gelar / nama
- adu: lapor / laga
- ali: nama orang / cincin
- ambarungbung: bertingkah laku di luar akal sehat / berlubang (tentang pohon)
- anar: baring / tumbur, tabrak
- andun: angkat / asing - sendiri
- anggur: anggur (sejenis minuman) / pengangguran, tidak ada pekerjaan
- angkuh: hebat, kuat, disegani / angkuh, sombong
- angot: tipis harapan / panas
- bakbak: rambut rontok / ember berlubang
- tibangbang: dibawa / dibawa lari
- baruk: pengilap rambut yang terbuat dari daging kelapa busuk / kulit terluar buah kelapa / sabut
- bayoh: bengkak/bisul kecil / bengkak
- tibolahko: dibelahkan / belang
- budarak: berjalan kaki menggunakan alas kaki / berjalan kaki
- bukbuk: lunak, lembut, empuk tentang makanan yang direbus / pukul
- cagil: mencuri untuk kesenangan / jahil
- nyangkuk: mengambil / jongkok / mengambil nasi atau makanan
- carcir: berlebihan dalam pengeluaran uang namun sedikit-sedikit akhirnya habis / mencret, buang air besar sedikit-sedikit
- corok: siram / menyiram dengan air panas
- cukcuk: merangkai buah / ikan dengan cara ditusuk dengan lidi / posisi duduk jongkok
- tidamaiko: didamaikan / terdamaikan
- darak: darat, daratan / jalan kaki
- dasar: kain, bahan kain / arti, berarti
- dokdok: rendam / pungut
- ngadokdok: merendam / memungut
- ngadokdokko: merendamkan / memungutkan
- tidokdok: direndam / dipungut
- tidokdokko: direndamkan / dipungutkan
- tipadokdok: tak sengaja terendam / tidak sengaja terpungut
- garingsing: panci yang terbuat dari besi untuk digunakan menanak nasi / basah kuyup
- tigincing: menjadi miring / jatuh ke samping
- gokgok: kuat dan besar / tidak plin-plan
- gorah: gaduh / tidak nyaman akhirnya pergi
- goring: senang / suka
- gorpu: besi / pisau, senjata tajam
- haru: wadah sendok yang terbuat dari bambu / centong sayur
- hinik: putih bersih / rata tidak berlubang seperti jalan raya
- ibarat: umpama / umpamakan / umpamanya
- icak: bohong / bohongkan
- nginum: meminum / minum
- tijajako: dijajakan / dijajakkan
- tijajal: diuji / diujikan
- jangguk: janggut / jenggot / syukur dalam keadaan marah, rasakan
- tikajikjik: menjadi mencret / buang air besar di celana secara tidak sengaja karena sudah tidak tahan lagi
- jubur: dubur, lubang pada ujung bawah usus / lubang pantat, anus
- juk: seperti / beri
- jungkalak: jatuh ke belakang / terjungkal
- tijungkalak: terjatuh ke belakang / terjungkal
- tijuntai: dijuntai / dijuntaikan
- tijurak: terbalik / sungsang
- kambolonan: tersedak makanan / tersedak makanan saat makan
- kamincak: katak / katak, kodok
- karungko: karungkan, masukkan dalam karung / karungkan, ambilkan bagian untuk kami
- kasab: kasar tentang telapak tangan / kotor lantai dengan pasir atau debuan
- koris: keris / jagung muda untuk dijadikan sayur, keris jagung
- kotil: kutil / orang kecil pendek, orang kate
- laju: terus / meninggal dunia
- lambung: puncak / tinggi
- langgar: langgar / tinggi / surau
- langir: langir / jeruk purut
- mangah: melirik / melihat dengan teliti
- manuk: burung / kelamin laki-laki
- mitmit: cerewet / suka menggunjing
- miyoh: buang air / kencing, buang air kecil
- mohpoh: mencuci pakaian / mencuci
- mulpul: memanggang (sesuatu) / membakar
- ngabilang harani: mengingat / meramal
- nyiwi: daging kelapa / kelapa
- paborik: pabrik, perusahaan / pabrikkan, tempat penggilingan padi
- paku: paku, sebangsa logam untuk melekatkan papan dan lain-lain / pakis, sayur pakis
- tipapan: tidak sengaja tertinggal / terpancung
- parmisi: permisi, berpamitan / permisilah
- rawang: pintu / jendela
- tilisoh: tertawa terpingkal-pingkal / sakit merintih tak tertahankan
- titis: dites / tetes
- tokon: tekan / kain setengah tiang yang dipakai dengan celana panjang
- tuktuk: menjitak (tentang kepala) / tok-tok
