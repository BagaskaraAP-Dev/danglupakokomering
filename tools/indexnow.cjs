#!/usr/bin/env node
/* =============================================================================
   tools/indexnow.cjs — beri tahu mesin pencari (Bing, Yandex, Seznam, Naver, dll.)
   lewat IndexNow bahwa alamat di sitemap.xml baru atau berubah.

   Kunci IndexNow bersifat publik dan disajikan di https://<situs>/<KUNCI>.txt
   (berkas public/<KUNCI>.txt). Google tidak memakai IndexNow; untuk Google kirim
   sitemap lewat Search Console.

   Jalankan setelah deploy produksi:
     npm run indexnow                     (situs bawaan di bawah)
     npm run indexnow -- https://contoh.id
   ============================================================================= */
'use strict';

const KUNCI = 'e7ffb4fa3a50b3c7f297139cb7763b3b';
const SITUS = (process.argv[2] || 'https://danglupakokomering.mooncrust.my.id').replace(/\/$/, '');
const MAKS_PER_KIRIM = 10000;

async function main() {
  const host = new URL(SITUS).host;
  const kunci = await fetch(`${SITUS}/${KUNCI}.txt`).then((r) => (r.ok ? r.text() : ''));
  if (kunci.trim() !== KUNCI) throw new Error(`Berkas kunci ${SITUS}/${KUNCI}.txt belum tersaji. Deploy dulu.`);

  const peta = await fetch(`${SITUS}/sitemap.xml`).then((r) => r.text());
  const alamat = [...peta.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const asing = alamat.filter((u) => new URL(u).host !== host);
  if (!alamat.length) throw new Error('sitemap.xml kosong.');
  if (asing.length) throw new Error(`${asing.length} alamat sitemap bukan milik ${host} (mis. ${asing[0]}). Deploy ulang agar sitemap memakai domain ini.`);

  for (let i = 0; i < alamat.length; i += MAKS_PER_KIRIM) {
    const urlList = alamat.slice(i, i + MAKS_PER_KIRIM);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: KUNCI, keyLocation: `${SITUS}/${KUNCI}.txt`, urlList }),
    });
    // 200 = diterima, 202 = diterima dan kunci sedang diverifikasi
    console.log(`IndexNow: ${urlList.length} alamat → HTTP ${res.status} ${res.statusText} ${(await res.text()).slice(0, 200)}`);
    if (!res.ok) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
