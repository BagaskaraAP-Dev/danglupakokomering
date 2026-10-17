#!/usr/bin/env node
/* =============================================================================
   tools/build-kamus.cjs — pembersih & pembangun Kamus Basa Kumoring

   Masukan : data/sumber/kamus_komering.json   (file asli — tidak pernah diubah)
             data/sumber/kamus_tambahan.json   (kata tambahan proyek, mis. dari lirik lagu;
                                                kolom "catatan" menandai arti dugaan)
   Keluaran: data/kamus_komering.json          (dibersihkan, format sama + kolom opsional)
             data/kamus_komering.csv           (semua kata dasar & turunan)
             public/data/kamus.json            (dimuat aplikasi Next.js di browser)
             data/kamus-meta.json              (jumlah kata & contoh, diimpor saat build)
             data/laporan-perbaikan.md         (ringkasan perbaikan & entri yang perlu ditinjau)

   Semua keluaran dibangun ulang dari file asli setiap kali dijalankan, jadi
   jangan mengedit keluarannya langsung. Untuk memperbaiki satu entri, tambahkan
   ke MANUAL di bawah; untuk data baru, ganti file di data/sumber/.

   Jalankan:  node tools/build-kamus.cjs [path/sumber.json]
   ============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'data');
const F_SUMBER = path.resolve(process.argv[2] || path.join(DIR, 'sumber', 'kamus_komering.json'));
const F_TAMBAHAN = path.join(DIR, 'sumber', 'kamus_tambahan.json');
const F_JSON = path.join(DIR, 'kamus_komering.json');
const F_CSV = path.join(DIR, 'kamus_komering.csv');
const F_WEB = path.join(ROOT, 'public', 'data', 'kamus.json');
const F_META = path.join(DIR, 'kamus-meta.json');
const F_LAPORAN = path.join(DIR, 'laporan-perbaikan.md');

const KELAS = {
  noun: 'n', verb: 'v', adjective: 'a', adverb: 'adv',
  conjunction: 'konj', preposition: 'prep', interjection: 'seru', '': '',
};

const SINGKATAN = {
  yg: 'yang', dg: 'dengan', dgn: 'dengan', kpd: 'kepada', utk: 'untuk', unt: 'untuk', tdk: 'tidak',
  sdh: 'sudah', org: 'orang', orng: 'orang', dll: 'dan lain-lain', dsb: 'dan sebagainya', tsb: 'tersebut',
  dr: 'dari', tp: 'tapi', tt: 'tentang', ttg: 'tentang', kk: 'kakak', bhs: 'bahasa', jln: 'jalan',
  jgn: 'jangan', dlm: 'dalam',
};
const RE_SINGKATAN = new RegExp(`\\b(${Object.keys(SINGKATAN).join('|')})\\b\\.?`, 'gi');

/* Entri yang tetap ada di kamus (bisa dicari) tetapi tidak ditampilkan secara
   acak di kuis, "kata acak", atau "kata hari ini". */
const RE_SENSITIF = /\b(?:kemaluan|kelamin|pantat|anus|makian|kurang ajar|bodoh|gila anjing|tahi|kotoran manusia)\b|kata-kata kasar|maknanya kasar|makan yang kasar/i;

/* Perbaikan manual hasil pemeriksaan entri satu per satu (kunci: idKata). */
const MANUAL = {
  // Kelas kata kosong / tidak sah
  'KOM-K00009': { pos: 'verb' }, // abui = usir
  'KOM-K00010': { pos: 'noun' }, // acar
  'KOM-K00042': { pos: 'noun' }, // agor = agar-agar
  'KOM-K00043': { pos: 'interjection' }, // agui = wah
  'KOM-K00155': { pos: 'interjection' }, // ai = seruan
  'KOM-K00238': { pos: 'adjective' }, // angit
  'KOM-K00276': { pos: 'noun' }, // badua = pesuruh
  'KOM-K00340': { pos: 'preposition' }, // bak = oleh, sebab
  'KOM-K00381': { pos: 'adjective' }, // bingkang = bengkok
  'KOM-K00757': { pos: 'adverb' }, // dang = jangan
  'KOM-K00758': { pos: 'adverb' }, // dangkung = jangan dulu
  'KOM-K00759': { pos: 'adverb' }, // dangmak = jangan tidak
  'KOM-K00760': { pos: 'adverb' }, // dangda = janganlah
  'KOM-K00761': { pos: 'adverb' }, // dangasa = jangan berharap
  'KOM-K00728': { pos: 'noun' }, // dasar = arti
  'KOM-K00902': { pos: 'conjunction' }, // dupi = apabila
  'KOM-K01004': { pos: 'verb' }, // gapgup = berdebar-debar
  'KOM-K01122': { pos: 'verb' }, // hojong = duduk
  'KOM-K01123': { pos: 'verb' }, // tihojong = terduduk
  'KOM-K01140': { pos: 'verb' }, // ibarat = umpamakan
  'KOM-K01141': { pos: 'adverb' }, // ibarat = umpamanya
  'KOM-K01142': { pos: 'verb' }, // ngaibaratko
  'KOM-K01143': { pos: 'verb' }, // tiibaratko
  'KOM-K01296': { pos: 'noun' }, // sangaimbir = satu ember
  'KOM-K01395': { pos: 'verb' }, // jaja (menjajakan)
  'KOM-K01511': { pos: 'verb', meaning: 'menyemai' }, // anjambang: pos "g" & arti "v menyemai"
  'KOM-K01534': { pos: 'noun' }, // janji
  'KOM-K01568': { pos: 'verb' }, // jogil = senyum sedikit
  'KOM-K01857': { pos: 'conjunction' }, // kantu = kalau
  'KOM-K02491': { pos: 'adverb' }, // munih = pula
  'KOM-K02848': { pos: 'verb' }, // payot = pijat
  'KOM-K00521': { meaning: 'lihat carik' }, // cayoh: salah ketik "ihat carik"

  // Kata yang menggabungkan varian
  'KOM-K00167': { word: 'ambasuh pungu', varian: ['ambasuh pudak'], meaning: 'basuh tangan', example: 'ambasuh pungu semakkung mongan!' },
  'KOM-K01258': { word: 'ngipukko', example: 'hortina niku ngipukko morli sija' },
  'KOM-K03061': { word: 'sawak', varian: ['nyawak'], example: 'keluarga sikam haga nyawak joh pagi' },
  'KOM-K03078': { word: 'solom', varian: ['nyolom'], example: 'waktu mandi di sungai biasona ya nyolom' },
  'KOM-K03079': { word: 'sopok', varian: ['nyopok'], example: 'ubak nyopok rukukna sai ampai dibolina' },

  // Contoh kalimat bercampur notasi kamus
  'KOM-K03633': { meaning: 'numpang, menumpang (sifatnya sementara saja)', example: 'onti kita tumpak pok bibikmu' },

  // Juadah = kue basah tradisional, bukan dodol (kamus sendiri juga menerjemahkan
  // "anggalu juwadah" sebagai "mengaduk kue"); terjemahan contoh disesuaikan
  'KOM-K01638': { meaning: 'kue basah tradisional khas Komering (juadah basah)', gantiTerjemahan: [['dodol', 'juadah']] },
  'KOM-K02515': { meaning: 'membuat (mengaduk) adonan juadah', gantiTerjemahan: [['dodol', 'juadah']] }, // ngagalu
  'KOM-K00035': { gantiTerjemahan: [['dodol', 'juadah']] }, // tiagihi
  'KOM-K00036': { gantiTerjemahan: [['dodol', 'juadah']] }, // tiagihko
  'KOM-K01689': { gantiTerjemahan: [['dodol', 'juadah']] }, // jukko

  // adat: arti utama "adat" (didukung turunan adat-istiadat & buadat); "diacungkan" tetap sebagai homonim
  'KOM-K00019': {
    pos: 'noun',
    meaning: 'adat, kebiasaan turun-temurun; diacungkan (senjata)',
    tambahContoh: [{ example: 'adat sai sikam pakai', exampleId: 'adat yang kami pakai' }],
  },

  // Rujukan "lihat" yang sasarannya salah tulis
  'KOM-K02550': { meaning: 'lihat makkahangsa hangsa' }, // ngosang kosang: "lihat mak ka.hang.sa hang.sa"
  'KOM-K02616': { meaning: 'lihat ranguh ompong' }, // ompong: "lihat ranguh"
  'KOM-K03077': { meaning: 'lihat liak' }, // solik: "lihat liyak" (liyak = ejaan lain liak)
  'KOM-K02205': { varian: ['liyak'] }, // liak: ejaan "liyak" dipakai di banyak contoh kalimat
};

/* ---------- Pembersih teks ---------- */
const rapikan = (s) => String(s ?? '').replace(/[ ​\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
const lengkapiSingkatan = (s) => s.replace(RE_SINGKATAN, (_, w) => SINGKATAN[w.toLowerCase()]);
const teksId = (s) => lengkapiSingkatan(rapikan(s));
// Nomor homonim di depan arti: "1 kasar …" → "kasar …"; "1 (orang) …, 2 (wadah) …" → "(orang) …, (wadah) …"
const tanpaNomorArti = (s) => s.replace(/(^|[,;]\s*)\d+\s+(?=\D)/g, '$1');

const log = {
  spasi: 0, singkatan: 0, nomorArti: [], kelas: [], varian: [], penanda: [], angka: [], lihat: [], lihatAsumsi: [],
  lihatTertunda: [], gabungInduk: [], gabungTurunan: [], turunanGanda: [], manual: [], kelasTakDikenal: [],
};

function catatSpasi(before, after) {
  if (before !== after && rapikan(before) === after) log.spasi++;
}

function bersihkanContoh(ex, word, exId, id) {
  let s = rapikan(ex);
  if (/(^|\s)[~–—](?=\s|$)/.test(s)) {
    s = s.replace(/(^|\s)[~–—](?=\s|$)/g, `$1${word}`);
    log.penanda.push(`${id} ${word}`);
  }
  // Angka tunggal yang nyasar di contoh (mis. "nyak 1 nganokonko"), bila terjemahannya tanpa angka
  if (/(^|\s)\d(?=\s|$)/.test(s) && !/\d/.test(exId)) {
    s = s.replace(/(^|\s)\d(?=\s|$)/g, '$1').replace(/\s{2,}/g, ' ').trim();
    log.angka.push(`${id} ${word}`);
  }
  return s;
}

function bersihkanEntri(e, induk = null) {
  const m = MANUAL[e.idKata] || {};
  if (MANUAL[e.idKata]) log.manual.push(`${e.idKata} ${rapikan(e.word)}: ${Object.keys(m).join(', ')}`);

  const out = { idKata: rapikan(e.idKata) };
  if (!induk) out.region = rapikan(e.region) || 'komering';
  out.word = m.word ?? rapikan(e.word);
  catatSpasi(e.word, rapikan(e.word));
  out.pos = m.pos ?? rapikan(e.pos);
  if (m.pos && rapikan(e.pos) !== m.pos) log.kelas.push(`${out.idKata} ${out.word}: "${rapikan(e.pos)}" → ${m.pos}`);
  if (!(out.pos in KELAS)) {
    log.kelasTakDikenal.push(`${out.idKata} ${out.word}: "${out.pos}"`);
    out.pos = '';
  }
  out.dialect = rapikan(e.dialect);

  const arti0 = rapikan(e.meaning);
  const arti1 = teksId(e.meaning);
  if (arti1 !== arti0 && !m.meaning) log.singkatan++;
  out.meaning = m.meaning ?? tanpaNomorArti(arti1);
  if (!m.meaning && out.meaning !== arti1) log.nomorArti.push(`${out.idKata} ${rapikan(e.word)}: “${arti1}” → “${out.meaning}”`);

  // Contoh kalimat: entri induk punya "examples"; turunan biasanya hanya example/exampleId
  const mentah = e.examples?.length ? e.examples : [{ example: e.example, exampleId: e.exampleId }];
  const contoh = [];
  const ganti = (txt) => (m.gantiTerjemahan || []).reduce((acc, [dari, ke]) => acc.replace(new RegExp(`\\b${dari}\\b`, 'gi'), ke), txt);
  [...mentah, ...(m.tambahContoh || [])].forEach((c, i) => {
    const exId = ganti(teksId(c.exampleId));
    let ex = bersihkanContoh(c.example, out.word, exId, out.idKata);
    if (i === 0 && m.example) ex = m.example;
    if ((ex || exId) && !contoh.some((x) => x.example === ex)) contoh.push({ example: ex, exampleId: exId });
  });
  out.example = contoh[0]?.example ?? '';
  out.exampleId = contoh[0]?.exampleId ?? '';
  if (!induk) out.examples = contoh;
  else if (contoh.length > 1) out.examples = contoh;

  // Varian ejaan dari kata seperti "sawak , nyawak"
  let varian = m.varian ?? e.varian ?? [];
  if (!m.word && /[,/]/.test(out.word)) {
    const parts = out.word.split(/\s*[,/]\s*/).filter(Boolean);
    out.word = parts[0];
    varian = [...varian, ...parts.slice(1)];
  }
  if (m.varian || varian.length !== (e.varian || []).length) log.varian.push(`${out.idKata} ${out.word} (+${varian.join(', ')})`);

  if (!induk) out.turunan = (e.turunan || []).map((t) => bersihkanEntri(t, out));
  if (varian.length) out.varian = [...new Set(varian)];
  if (e.lihat) out.lihat = e.lihat;
  if (e.idGabungan?.length) out.idGabungan = [...e.idGabungan];
  if (e.catatan) out.catatan = rapikan(e.catatan);
  return out;
}

const kunci = (e) => `${e.word.toLowerCase()}|${e.meaning.toLowerCase()}`;

function gabungContoh(ke, dari) {
  const daftar = ke.examples || (ke.example || ke.exampleId ? [{ example: ke.example, exampleId: ke.exampleId }] : []);
  const tambahan = dari.examples || (dari.example || dari.exampleId ? [{ example: dari.example, exampleId: dari.exampleId }] : []);
  tambahan.forEach((c) => { if (!daftar.some((x) => x.example === c.example)) daftar.push(c); });
  ke.examples = daftar;
  ke.example = daftar[0]?.example ?? '';
  ke.exampleId = daftar[0]?.exampleId ?? '';
  ke.idGabungan = [...new Set([...(ke.idGabungan || []), dari.idKata, ...(dari.idGabungan || [])])];
}

/* ---------- 1. Baca & bersihkan ---------- */
const mentah = JSON.parse(fs.readFileSync(F_SUMBER, 'utf8'));
const tambahan = fs.existsSync(F_TAMBAHAN) ? JSON.parse(fs.readFileSync(F_TAMBAHAN, 'utf8')) : [];
let entri = [...mentah, ...tambahan].map((e) => bersihkanEntri(e));

/* ---------- 2. Gabungkan duplikat persis (kata + arti sama) ---------- */
const peta = new Map();
const hasil = [];
entri.forEach((e) => {
  const k = kunci(e);
  if (peta.has(k)) {
    const tuju = peta.get(k);
    gabungContoh(tuju, e);
    tuju.turunan.push(...e.turunan);
    log.gabungInduk.push(`${e.idKata} → ${tuju.idKata} (${e.word})`);
  } else {
    peta.set(k, e);
    hasil.push(e);
  }
});
entri = hasil;

entri.forEach((e) => {
  const lihat = new Map();
  const turunan = [];
  e.turunan.forEach((t) => {
    if (kunci(t) === kunci(e)) { // turunan yang sama persis dengan induknya
      gabungContoh(e, t);
      log.turunanGanda.push(`${t.idKata} ${t.word} (sama dengan induk)`);
      return;
    }
    const k = kunci(t);
    if (lihat.has(k)) {
      gabungContoh(lihat.get(k), t);
      log.gabungTurunan.push(`${t.idKata} → ${lihat.get(k).idKata} (${t.word})`);
      return;
    }
    lihat.set(k, t);
    turunan.push(t);
  });
  e.turunan = turunan;
});

/* ---------- 3. Selesaikan rujukan "lihat X" ---------- */
const semua = () => entri.flatMap((e) => [e, ...e.turunan]);
const indeksKata = new Map();
semua().forEach((e) => {
  [e.word, ...(e.varian || [])].forEach((w) => indeksKata.set(w, [...(indeksKata.get(w) || []), e]));
});
const jarak = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
};
semua().forEach((e) => {
  const m = e.meaning.match(/^lihat\s+(.+)$/i);
  if (!m) return;
  let target = m[1].trim();
  let cocok = (indeksKata.get(target) || []).filter((t) => !/^lihat\s/i.test(t.meaning));
  let catatan = '';
  if (!cocok.length) {
    // Rujukan salah ketik (mis. "ambirikbik" → "ambarikbik"): ambil satu-satunya kata berjarak 1
    const mirip = [...indeksKata.keys()].filter((w) => w !== e.word && Math.abs(w.length - target.length) <= 1 && jarak(w, target) === 1);
    if (mirip.length === 1) {
      catatan = ` — ejaan rujukan “${target}” dikoreksi`;
      target = mirip[0];
      cocok = indeksKata.get(target).filter((t) => !/^lihat\s/i.test(t.meaning));
    }
  }
  if (!cocok.length) {
    log.lihatTertunda.push(`${e.idKata} ${e.word}: “${e.meaning}”`);
    return;
  }
  const t = cocok[0];
  e.meaning = t.meaning;
  e.lihat = target;
  if (!e.pos) e.pos = t.pos;
  log.lihat.push(`${e.idKata} ${e.word} → ${target} (“${t.meaning}”)${catatan}`);
  if (catatan) log.lihatAsumsi.push(`${e.idKata} ${e.word} → ${target}${catatan}`);
  if (new Set(cocok.map((c) => c.meaning)).size > 1) {
    log.lihatAsumsi.push(`${e.idKata} ${e.word} → ${target}: sasaran punya beberapa arti (${[...new Set(cocok.map((c) => c.meaning))].join(' / ')}); dipakai arti pertama`);
  }
});

/* ---------- 4. Statistik & penyelarasan korpus ---------- */
const semuaEntri = semua();
const dugaan = semuaEntri.filter((e) => e.catatan);
const pasangan = semuaEntri.filter((e) => !e.catatan).flatMap((e) => (e.examples || [{ example: e.example, exampleId: e.exampleId }]))
  .filter((c) => c.example && c.exampleId);
const token = (s) => s.toLowerCase().replace(/[^a-z\-' ]/g, ' ').split(/\s+/).filter((w) => w && w !== '-');

/* Penyelarasan kata (Dice) dari kalimat paralel Komering–Indonesia:
   dice(a,b) = 2·muncul_bersama / (frek_a + frek_b). Pasangan kuat menjadi
   leksikon kata fungsi (nyak = saya, sina = itu, mak = tidak, …). */
const fK = new Map();
const fI = new Map();
const co = new Map();
const tambah = (m, k) => m.set(k, (m.get(k) || 0) + 1);
pasangan.forEach((c) => {
  const K = new Set(token(c.example));
  const I = new Set(token(c.exampleId));
  K.forEach((a) => tambah(fK, a));
  I.forEach((b) => tambah(fI, b));
  K.forEach((a) => I.forEach((b) => tambah(co, `${a}|${b}`)));
});
const dice = (a, b) => (2 * (co.get(`${a}|${b}`) || 0)) / (fK.get(a) + fI.get(b));
const kuat = (d, n) => (d >= 0.6 && n >= 4) || (d >= 0.45 && n >= 25);

const selaras = new Map();
const simpan = (a, b) => {
  const d = dice(a, b);
  const n = co.get(`${a}|${b}`) || 0;
  if (kuat(d, n)) selaras.set(`${a}|${b}`, [a, b, Math.round(d * 100) / 100, n]);
};
const terbaik = (dari, ke, pasang) => {
  let best = null;
  let bd = 0;
  ke.forEach((_, x) => {
    const d = pasang(x);
    if (d > bd) { bd = d; best = x; }
  });
  return best;
};
fK.forEach((n, a) => { if (n >= 4) { const b = terbaik(a, fI, (x) => dice(a, x)); if (b) simpan(a, b); } });
fI.forEach((n, b) => { if (n >= 4) { const a = terbaik(b, fK, (x) => dice(x, b)); if (a) simpan(a, b); } });
const daftarSelaras = [...selaras.values()].sort((x, y) => y[2] - x[2] || y[3] - x[3]);

const frekuensi = [...fK.entries()].filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]);

/* ---------- 5. Tulis keluaran ---------- */
fs.writeFileSync(F_JSON, `${JSON.stringify(entri, null, 2)}\n`);

const csvSel = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const baris = [['ID Kata', 'Kata (Komering)', 'Kelas Kata (PoS)', 'Dialek', 'Arti / Makna (Indonesia)', 'Contoh Kalimat (Komering)', 'Artinya (Indonesia)', 'Kata Dasar', 'Varian', 'Catatan']];
entri.forEach((e) => {
  baris.push([e.idKata, e.word, e.pos, e.dialect, e.meaning, e.example, e.exampleId, '', (e.varian || []).join('; '), e.catatan || '']);
  e.turunan.forEach((t) => baris.push([t.idKata, t.word, t.pos, t.dialect, t.meaning, t.example, t.exampleId, e.word, (t.varian || []).join('; '), t.catatan || '']));
});
fs.writeFileSync(F_CSV, `﻿${baris.map((r) => r.map(csvSel).join(',')).join('\n')}\n`);

/* Format ringkas untuk browser:
   [idKata, kata, kelas, arti, [[contohKm, contohId], …], kataDasar, [varian], lihat, catatan] */
const ringkas = (e, induk) => {
  const contoh = (e.examples || [{ example: e.example, exampleId: e.exampleId }]).filter((c) => c.example || c.exampleId).map((c) => [c.example, c.exampleId]);
  const r = [e.idKata, e.word, KELAS[e.pos], e.meaning, contoh, induk || '', e.varian || [], e.lihat || '', e.catatan || ''];
  while (r.length > 4) {
    const last = r[r.length - 1];
    if (last === '' || (Array.isArray(last) && !last.length)) r.pop();
    else break;
  }
  return r;
};
const barisWeb = entri.flatMap((e) => [ringkas(e), ...e.turunan.map((t) => ringkas(t, e.word))]);
const sensitif = semuaEntri.filter((e) => RE_SENSITIF.test(e.meaning));
const jumlahTurunan = entri.reduce((a, e) => a + e.turunan.length, 0);
const tanggal = new Date().toISOString().slice(0, 10);
const meta = {
  sumber: 'data/kamus_komering.json',
  dibuat: tanggal,
  jumlahKata: barisWeb.length,
  jumlahKataDasar: entri.length,
  jumlahTurunan,
  jumlahContoh: pasangan.length,
};
/* Format public/data/kamus.json (satu entri per baris agar diff tetap terbaca):
   entri    : [idKata, kata, kelas, arti, [[contohKm, contohId], …], kataDasar, [varian], lihat, catatan]
              catatan berisi keterangan bila artinya masih dugaan (perlu verifikasi)
   selaras  : [kataKomering, kataIndonesia, skorDice, jumlahMunculBersama] — dipelajari dari korpus
   frekuensi: [kataKomering, jumlahKalimat] — frekuensi kata di korpus contoh
   sensitif : idKata yang tidak ditampilkan acak (kuis, kata acak, kata hari ini) */
const web = `{
"meta": ${JSON.stringify(meta)},
"entri": [
${barisWeb.map((r) => JSON.stringify(r)).join(',\n')}
],
"selaras": ${JSON.stringify(daftarSelaras)},
"frekuensi": ${JSON.stringify(frekuensi)},
"sensitif": ${JSON.stringify(sensitif.map((e) => e.idKata))}
}
`;
fs.mkdirSync(path.dirname(F_WEB), { recursive: true });
fs.writeFileSync(F_WEB, web);
fs.writeFileSync(F_META, `${JSON.stringify(meta, null, 2)}\n`);

/* ---------- 6. Laporan ---------- */
const daftar = (judul, arr, catatan = '') => (arr.length ? `\n### ${judul} (${arr.length})\n${catatan ? `${catatan}\n` : ''}\n${arr.map((x) => `- ${x}`).join('\n')}\n` : '');
const homonim = (() => {
  const m = new Map();
  semuaEntri.forEach((e) => { const k = e.word.toLowerCase(); m.set(k, [...(m.get(k) || []), e.meaning]); });
  return [...m.entries()].filter(([, v]) => new Set(v).size > 1).map(([k, v]) => `${k}: ${[...new Set(v)].join(' / ')}`);
})();
const laporan = `# Laporan Perbaikan Kamus Basa Kumoring

Dibuat otomatis oleh \`tools/build-kamus.cjs\` pada ${tanggal} dari \`${path.relative(ROOT, F_SUMBER).replace(/\\/g, '/')}\` (file asli, tidak diubah) dan \`data/sumber/kamus_tambahan.json\` (${tambahan.length} kata tambahan).

## Ringkasan

| | Jumlah |
| --- | --- |
| Kata dasar | ${entri.length} |
| Kata turunan | ${jumlahTurunan} |
| Total kata | ${barisWeb.length} |
| Pasangan contoh kalimat (korpus) | ${pasangan.length} |
| Padanan kata hasil penyelarasan korpus | ${daftarSelaras.length} |
| Arti dengan singkatan dilengkapi (yg, dg, ttg, dlm, …) | ${log.singkatan} |
| Duplikat kata dasar digabung | ${log.gabungInduk.length} |
| Duplikat turunan digabung | ${log.gabungTurunan.length + log.turunanGanda.length} |
| Rujukan "lihat X" diselesaikan | ${log.lihat.length} |
| Kata tambahan berarti dugaan (perlu verifikasi) | ${dugaan.length} |

Perbaikan otomatis lain: spasi tak terlihat (NBSP) dan spasi berlebih di semua kolom dirapikan.
${daftar('Perbaikan manual per entri', log.manual)}${daftar('Nomor homonim di depan arti dihapus', log.nomorArti)}${daftar('Kelas kata diperbaiki', log.kelas)}${daftar('Varian ejaan dipisahkan', log.varian)}${daftar('Penanda ~ / – di contoh diganti kata utamanya', log.penanda)}${daftar('Penanda nomor homonim di contoh dihapus', log.angka, 'Mis. “nyak haga amboli 1 paku sakilo” → “nyak haga amboli paku sakilo” (paku¹ = paku besi, paku² = pakis).')}${daftar('Duplikat kata dasar digabung', log.gabungInduk)}${daftar('Duplikat turunan digabung', [...log.gabungTurunan, ...log.turunanGanda])}${daftar('Rujukan "lihat" diselesaikan', log.lihat)}${daftar('Rujukan "lihat" yang diselesaikan dengan asumsi — PERLU DITINJAU', log.lihatAsumsi)}${daftar('Rujukan "lihat" yang belum bisa diselesaikan — PERLU DITINJAU', log.lihatTertunda)}${daftar('Kelas kata tidak dikenal — PERLU DITINJAU', log.kelasTakDikenal)}
${daftar('Kata tambahan dengan arti dugaan — PERLU DITINJAU', dugaan.map((e) => `${e.idKata} ${e.word}: ${e.meaning}`), 'Dari lirik lagu “Dang Lupa ko Komering”. Ditandai “arti dugaan” di situs, tidak ikut korpus penerjemah, dan tidak muncul di kuis.')}
${daftar('Entri sensitif — tetap bisa dicari, tidak ditampilkan acak', sensitif.map((e) => `${e.idKata} ${e.word}: ${e.meaning}`), 'Tidak muncul di kuis, “kata acak”, dan “kata hari ini” di situs.')}
## Perlu ditinjau penutur asli

- **adat** (KOM-K00019) kini berarti “adat, kebiasaan turun-temurun; diacungkan (senjata)”. Arti utama diambil dari turunannya (*adat-istiadat*, *buadat*); arti “diacungkan” dari contoh “sinapang sina adat haguk” dipertahankan sebagai homonim.
- **juadah** (KOM-K01638) kini berarti “kue basah tradisional khas Komering (juadah basah)”; kata “dodol” pada terjemahan contoh yang memuat *juadah* diganti “juadah”.
- Beberapa terjemahan contoh memuat salah ketik, misalnya “nani” (nasi) pada *akuk* dan “kemaren”.
- Kelas kata sebagian entri tampak kurang tepat (mis. *lapah* “jalan” = noun, *ganta* “sekarang” = verb). Tidak diubah otomatis.
${daftar('Homonim (kata sama, arti berbeda) — bukan galat, untuk informasi', homonim)}`;
fs.writeFileSync(F_LAPORAN, laporan);

console.log(`✓ ${barisWeb.length} kata (${entri.length} dasar + ${jumlahTurunan} turunan), ${pasangan.length} contoh, ${daftarSelaras.length} padanan korpus`);
console.log(`✓ ${path.relative(ROOT, F_JSON)}, ${path.relative(ROOT, F_CSV)}, ${path.relative(ROOT, F_WEB)} (${(fs.statSync(F_WEB).size / 1024).toFixed(0)} KB), ${path.relative(ROOT, F_META)}, ${path.relative(ROOT, F_LAPORAN)}`);
