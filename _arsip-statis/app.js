/* =============================================================================
   Dang Lupa ko Komering — app.js
   Logika interaktif: AI Translator (NLP lokal), TTS, Kamus, Sejarah, Peta,
   Marga, Busana & Adat, Kuliner, Pemutar Lagu, Generator Jajuluk,
   Kuis, dan Chatbot. Bergantung pada objek global DATA dari data.js.
   ============================================================================= */
'use strict';

/* ---------- Utilitas ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icon = (name) => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const norm = (s) => String(s).toLowerCase().normalize('NFKC').replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
const pick = (v) => (Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v);
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* penyimpanan tidak tersedia */ }
  },
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* FNV-1a: hash deterministik untuk generator jajuluk */
function hashStr(s) {
  let h = 2166136261;
  for (const ch of s) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Jarak Levenshtein dengan batas atas (berhenti lebih awal bila melebihi max) */
function levenshtein(a, b, max = Infinity) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  Toast.show('Tersalin ke clipboard ✓');
}

function fmtTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ---------- Toast ---------- */
const Toast = (() => {
  let timer;
  return {
    show(msg) {
      const el = $('#toast');
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('show'), 2600);
    },
  };
})();

/* ---------- Text-to-Speech ---------- */
const Suara = (() => {
  const synth = window.speechSynthesis;
  let voice = null;
  let activeBtn = null;

  function pickVoice() {
    const voices = synth.getVoices();
    voice = voices.find((v) => /^id[-_]ID/i.test(v.lang))
      || voices.find((v) => /^id/i.test(v.lang))
      || voices.find((v) => /^ms/i.test(v.lang))
      || null;
  }
  if (synth) {
    pickVoice();
    synth.addEventListener?.('voiceschanged', pickVoice);
  }

  function clearBtn() {
    activeBtn?.classList.remove('speaking');
    activeBtn = null;
  }

  /* Basa Kumoring belum punya suara TTS sendiri; suara Bahasa Indonesia
     dipakai karena ejaannya fonetis dan pelafalannya paling mendekati. */
  function speak(text, { rate = 0.9, btn = null, onend = null } = {}) {
    if (!synth) {
      Toast.show('Browser ini belum mendukung suara (Text-to-Speech).');
      return;
    }
    synth.cancel();
    clearBtn();
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang || 'id-ID';
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = 1.05;
    if (btn) {
      activeBtn = btn;
      btn.classList.add('speaking');
    }
    const done = () => {
      clearBtn();
      onend?.();
    };
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
  }

  function stop() {
    synth?.cancel();
    clearBtn();
  }

  return { speak, stop, get speaking() { return !!synth?.speaking; } };
})();

/* ---------- Navigasi ---------- */
const Nav = {
  init() {
    const header = $('#navbar');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const btn = $('#menuBtn');
    const menu = $('#mobileMenu');
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      btn.innerHTML = icon(open ? 'x' : 'menu');
    };
    btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    $$('#mobileMenu a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

    const links = $$('[data-nav]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => io.observe(s));
  },
};

/* ---------- Animasi muncul saat gulir ---------- */
const Reveal = {
  init() {
    const els = $$('.reveal:not(.is-visible)');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    els.forEach((e) => io.observe(e));
  },
};

/* =============================================================================
   KAMUS BASA KUMORING — dimuat dari data/kamus-komering.js
   (dibangun dari data/kamus_komering.json oleh tools/build-kamus.js)
   ============================================================================= */
const KAMUS = (() => {
  const K = window.KAMUS_KOMERING;
  if (!K) console.warn('data/kamus-komering.js belum termuat — kamus kosong.');
  const src = K || { meta: {}, entri: [], selaras: [], frekuensi: [], sensitif: [] };
  const sensitif = new Set(src.sensitif || []);
  const entri = src.entri.map(([id, kata, kelas = '', arti = '', contoh = [], induk = '', varian = [], lihat = '']) => ({
    id, kata, kelas, arti, contoh, induk, varian, lihat, sensitif: sensitif.has(id),
  }));
  const perKata = new Map();
  const perId = new Map();
  const turunan = new Map();
  const tambah = (m, k, v) => m.set(k, [...(m.get(k) || []), v]);
  entri.forEach((e) => {
    perId.set(e.id, e);
    [e.kata, ...e.varian].forEach((w) => tambah(perKata, norm(w), e));
    if (e.induk) tambah(turunan, norm(e.induk), e);
  });
  return {
    meta: { ...src.meta, jumlahKata: entri.length },
    entri,
    /* Entri yang layak tampil acak (kuis, kata acak, kata hari ini): bukan turunan,
       punya contoh, dan kata itu tidak punya arti sensitif (mis. homonim "manuk") */
    layakAcak: (() => {
      const kataSensitif = new Set(entri.filter((e) => e.sensitif).map((e) => norm(e.kata)));
      return entri.filter((e) => !kataSensitif.has(norm(e.kata)) && !e.induk && e.contoh.length);
    })(),
    selaras: src.selaras || [],
    frek: new Map(src.frekuensi || []),
    cari: (w) => perKata.get(norm(w)) || [],
    id: (id) => perId.get(id),
    turunanDari: (w) => turunan.get(norm(w)) || [],
  };
})();

/* Pecah arti kamus menjadi glosa: "mau, akan, suka" → [mau, akan, suka];
   "ahad (nama hari)" → [ahad]; "pakaian atau seluruh …" → [pakaian, seluruh …] */
function glosa(arti) {
  return String(arti).replace(/\([^)]*\)/g, ' ')
    .split(/\s*(?:[,;/]|\s-\s|\batau\b)\s*/i)
    .map(norm)
    .filter((g) => g && g !== '-');
}

/* Arti ringkas untuk label tombol: glosa pertama, dipotong sebelum "yang …"
   atau di kata ke-5 ("pelepah pinang yang sering …" → "pelepah pinang") */
function artiSingkat(arti, kata = '') {
  const gs = glosa(arti);
  const g = gs.find((x) => x !== norm(kata)) || gs[0] || norm(arti);
  const kt = g.split(' ');
  const yang = kt.indexOf('yang');
  if (yang >= 2) return kt.slice(0, yang).join(' ');
  return kt.length > 5 ? `${kt.slice(0, 5).join(' ')}…` : g;
}

const fmtAngka = (n) => Number(n || 0).toLocaleString('id-ID');
/* Isi penanda {jumlahKata}, {jumlahContoh}, … dengan angka dari meta kamus */
const isiAngka = (s) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in KAMUS.meta ? fmtAngka(KAMUS.meta[k]) : m));

/* ---------- Hero ---------- */
const Hero = {
  i: 0,
  init() {
    const bubble = $('#heroBubble');
    const show = () => {
      const s = DATA.sapaan[this.i];
      $('#heroGreetKm').textContent = s.km;
      $('#heroGreetId').textContent = s.id;
      bubble.classList.remove('swap');
      void bubble.offsetWidth;
      bubble.classList.add('swap');
    };
    $('#heroSpeak').addEventListener('click', (e) => Suara.speak(DATA.sapaan[this.i].km, { btn: e.currentTarget }));
    if (!reduceMotion) {
      setInterval(() => {
        if (document.hidden) return;
        this.i = (this.i + 1) % DATA.sapaan.length;
        show();
      }, 5000);
    }

    const totals = {
      kamus: KAMUS.meta.jumlahKata,
      contoh: KAMUS.meta.jumlahContoh || 0,
      marga: DATA.marga.length,
      kab: 4,
    };
    $$('[data-meta]').forEach((el) => { el.textContent = fmtAngka(KAMUS.meta[el.dataset.meta]); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        countUp(e.target, totals[e.target.dataset.stat]);
      });
    });
    $$('[data-stat]').forEach((el) => io.observe(el));
  },
};

/* ---------- Maskot hero (Alpine.js + GSAP + dotLottie) ----------
   Dipakai lewat x-data="heroMaskot" di index.html. GSAP memunculkan bingkai maskot,
   badge AI Penerjemah, dan kartu sapaan bergiliran, lalu membuatnya melayang.
   Raka mengucapkan "Tabik Pun!" saat halaman dibuka, saat badge di-hover, dan
   saat diklik (memutar tabik-pun.mp3 bila file itu tersedia). */
document.addEventListener('alpine:init', () => {
  window.Alpine.data('heroMaskot', () => ({
    bicara: false,
    suaraMain: false,
    timer: 0,

    init() {
      // Muat animasi gelombang (assets/lottie/gelombang-suara.js) setelah <dotlottie-player> siap
      const wave = this.$refs.wave;
      if (window.LOTTIE_GELOMBANG) {
        customElements.whenDefined('dotlottie-player')
          .then(() => wave.updateComplete)
          .then(() => wave.load(JSON.stringify(window.LOTTIE_GELOMBANG)))
          .catch(() => {});
      }

      const g = window.gsap;
      const { frame, melayang, kartu } = this.$refs;
      // Bila GSAP terlambat dimuat, cadangan CSS (.gsap-masuk) sudah mulai memunculkan elemen
      const terlambat = parseFloat(getComputedStyle(frame).opacity) > 0.05;
      if (!g || terlambat) {
        if (g) {
          g.set([frame, melayang, kartu], { autoAlpha: 1 });
          document.documentElement.classList.add('gsap-aktif');
          if (!reduceMotion) this.melayang(g);
        }
        setTimeout(() => this.sapa(), 400);
        return;
      }
      document.documentElement.classList.add('gsap-aktif');
      if (reduceMotion) {
        g.set([frame, melayang, kartu], { autoAlpha: 1 });
        setTimeout(() => this.sapa(), 400);
        return;
      }
      g.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(frame, { autoAlpha: 0, y: 48, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 }, 0.15)
        .fromTo(melayang, { autoAlpha: 0, x: -28, scale: 0.7 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.8, ease: 'back.out(2.2)' }, '-=0.55')
        .fromTo(kartu, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.5')
        .call(() => {
          this.melayang(g);
          this.sapa();
        });
    },

    melayang(g) {
      g.to(this.$refs.frame, { y: -12, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      g.to(this.$refs.melayang, { y: -9, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.6 });
    },

    /* Tampilkan "Tabik Pun!" + gelombang suara; suara=true juga memutar rekaman Raka */
    sapa(suara = false) {
      if (this.suaraMain && !suara) return; // jangan memotong suara yang sedang diputar
      clearTimeout(this.timer);
      this.bicara = true;
      this.$refs.wave.play?.();
      window.gsap?.fromTo(this.$refs.badge, { scale: 0.88 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
      if (!suara) {
        this.selesai(2800);
        return;
      }
      const audio = this.$refs.audio;
      // tabik-pun.mp3 belum ada / gagal dimuat: cukup gelembung & gelombang
      if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        this.selesai(2000);
        return;
      }
      Suara.stop();
      audio.currentTime = 0;
      audio.play().catch(() => this.selesai(2000));
      this.selesai(8000); // pengaman bila event "ended" tidak pernah datang
    },

    /* Hentikan gelombang & sembunyikan gelembung setelah ms */
    selesai(ms) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.bicara = false;
        this.suaraMain = false;
        this.$refs.wave.stop?.();
      }, ms);
    },
  }));
});

function countUp(el, target) {
  if (reduceMotion) {
    el.textContent = fmtAngka(target);
    return;
  }
  const t0 = performance.now();
  const dur = 1200;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = fmtAngka(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* =============================================================================
   AI PENERJEMAH — mesin NLP ringan di browser
   Pengetahuan:
   a) Kamus Basa Kumoring (kata dasar + turunan, arti Indonesia → glosa)
   b) Padanan kata fungsi hasil penyelarasan korpus contoh kalimat (skor Dice)
   c) Padanan berbukti dari data.js
   Proses:
   1) Pencocokan frasa terpanjang (n-gram)
   2) Stemming Bahasa Indonesia (imbuhan me-, ber-, di-, -kan, -an, -nya, …)
   3) Akhiran: -nya ⇄ -na, -ku, -mu, -lah ⇄ -da
   4) Reduplikasi (jama-jama) dan pola "sangat X" → "X nihan"
   5) Koreksi ejaan dengan jarak Levenshtein
   6) Peringkat kandidat (ketepatan glosa + frekuensi korpus) & skor keyakinan
   ============================================================================= */
const Penerjemah = (() => {
  const dict = { id: new Map(), km: new Map() }; // kunci → { out, type?, ref? }
  const maxLen = { id: 1, km: 1 };
  const same = new Set(DATA.kataSama.map(norm));
  const LABEL = { id: 'Bahasa Indonesia', km: 'Basa Kumoring' };
  const BOBOT = { exact: 1, same: 0.9, korpus: 0.85, stem: 0.8, fuzzy: 0.6, unknown: 0 };
  const SUFIKS = {
    id: [['nya', 'na'], ['ku', 'ku'], ['mu', 'mu'], ['lah', 'da'], ['kah', ''], ['pun', '']],
    km: [['na', 'nya'], ['ku', 'ku'], ['mu', 'mu'], ['da', 'lah']],
  };
  const PREFIKS = [
    [/^meny([a-z]{3,})$/, (m) => [`s${m}`]],
    [/^meng([a-z]{3,})$/, (m) => [m, `k${m}`]],
    [/^mem([a-z]{3,})$/, (m) => [`p${m}`, m]],
    [/^men([a-z]{3,})$/, (m) => [`t${m}`, m]],
    [/^me([a-z]{3,})$/, (m) => [m]],
    [/^ber([a-z]{3,})$/, (m) => [m]],
    [/^be([a-z]{3,})$/, (m) => [m]],
    [/^di([a-z]{3,})$/, (m) => [m]],
    [/^ter([a-z]{3,})$/, (m) => [m]],
    [/^ke([a-z]{3,})$/, (m) => [m]],
    [/^se([a-z]{3,})$/, (m) => [m]],
    [/^pe([a-z]{3,})$/, (m) => [m]],
  ];
  const TOKEN_RE = /[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu;

  // Kosakata yang benar-benar dipakai di korpus: kata ini tidak "dikoreksi ejaannya"
  // (mencegah "sedang" → "senang" atau "kasih" → "masih").
  const kosakata = { id: new Set(), km: new Set() };
  const kataDari = (s) => String(s).toLowerCase().match(/[a-z]+(?:[-'][a-z]+)*/g) || [];
  KAMUS.entri.forEach((e) => e.contoh.forEach(([k, i]) => {
    kataDari(k).forEach((w) => kosakata.km.add(w));
    kataDari(i).forEach((w) => kosakata.id.add(w));
  }));

  // Arti kamus yang panjang diringkas ke intinya: "permisi kepada orang-orang yang …" → "permisi"
  const PENGHUBUNG = /\s(?:kepada|yang|untuk|sambil|dengan|dari|karena|seperti|dalam|di|ke|pada|saat|ketika|agar)\s/;
  function ringkas(g) {
    if (g.split(' ').length <= 3) return g;
    const inti = g.split(PENGHUBUNG)[0];
    return inti.split(' ').length <= 4 ? inti : g.split(' ').slice(0, 3).join(' ');
  }

  function set(lang, key, val) {
    const k = norm(key);
    if (!k) return;
    dict[lang].set(k, val);
    maxLen[lang] = Math.max(maxLen[lang], k.split(' ').length);
  }

  function build() {
    const korpusKm = new Map(); // pasangan korpus terkuat untuk tiap kata Komering
    KAMUS.selaras.forEach(([km, id, skor]) => {
      if (!korpusKm.has(km) || korpusKm.get(km).skor < skor) korpusKm.set(km, { id, skor });
    });
    const bonusFrek = (w) => Math.log1p(KAMUS.frek.get(norm(w)) || 0) * 0.5;

    // 1) Komering → Indonesia: kata dasar didahulukan, lalu yang contohnya terbanyak
    const urut = [...KAMUS.entri].sort((a, b) => (a.induk ? 1 : 0) - (b.induk ? 1 : 0) || b.contoh.length - a.contoh.length);
    urut.forEach((e) => [e.kata, ...e.varian].forEach((w) => {
      const k = norm(w);
      if (dict.km.has(k)) return;
      const g = glosa(e.arti);
      let out = ringkas(g[0] || norm(e.arti));
      const kp = korpusKm.get(k);
      // Korpus memilih glosa yang paling sering dipakai (kuti: "mereka, kalian" → kalian)
      if (kp && kp.skor >= 0.75 && g.includes(kp.id)) out = kp.id;
      else if (kp && kp.skor >= 0.5 && out.split(' ').length > 2) out = kp.id;
      set('km', k, { out, ref: e });
    }));
    korpusKm.forEach((kp, km) => {
      if (!dict.km.has(km)) set('km', km, { out: kp.id, type: 'korpus' });
    });

    // 2) Indonesia → Komering: kandidat berperingkat (glosa tunggal > glosa pertama > glosa lain;
    //    kata dasar > turunan; makin sering muncul di korpus makin diutamakan)
    const kandidat = new Map();
    const usul = (key, skor, val) => {
      const k = norm(key);
      if (!k || k.split(' ').length > 3) return;
      if (!kandidat.has(k) || kandidat.get(k).skor < skor) kandidat.set(k, { ...val, skor });
    };
    KAMUS.entri.forEach((e) => {
      const g = glosa(e.arti);
      g.forEach((gl, i) => usul(gl, (g.length === 1 ? 3 : i === 0 ? 2 : 1) + (e.induk ? 0 : 0.5) + bonusFrek(e.kata), { out: e.kata, ref: e }));
    });
    KAMUS.selaras.forEach(([km, id, skor]) => usul(id, 2.5 + skor + bonusFrek(km), { out: km, type: 'korpus' }));
    kandidat.forEach((v, k) => set('id', k, v));

    // 3) Padanan berbukti dari data.js menimpa keduanya
    DATA.padanan.forEach((p) => {
      const ids = p.id.split('|');
      const kms = p.km.split('|');
      ids.forEach((k) => set('id', k, { out: kms[0] }));
      kms.forEach((k) => set('km', k, { out: ids[0] }));
    });
  }

  const isCap = (w) => /^\p{Lu}/u.test(w);

  /* Kandidat kata dasar Bahasa Indonesia */
  function idCandidates(w) {
    const roots = [w];
    PREFIKS.forEach(([re, f]) => {
      const m = w.match(re);
      if (m) roots.push(...f(m[1]));
    });
    const out = [];
    roots.forEach((r) => {
      out.push(r);
      ['kan', 'an', 'i'].forEach((s) => {
        if (r.length > s.length + 2 && r.endsWith(s)) out.push(r.slice(0, -s.length));
      });
    });
    return out;
  }

  function derive(w) {
    for (const c of idCandidates(w)) {
      const v = dict.id.get(c);
      if (v) return { out: v.out, base: c, ref: v.ref };
    }
    return null;
  }

  function fuzzy(w, lang) {
    if (w.length < 5 || kosakata[lang].has(w)) return null;
    const max = w.length >= 8 ? 2 : 1;
    let best = null;
    let bestD = max + 1;
    for (const key of dict[lang].keys()) {
      if (key.includes(' ') || Math.abs(key.length - w.length) > max) continue;
      const d = levenshtein(w, key, max);
      if (d < bestD) {
        bestD = d;
        best = key;
      }
    }
    return best;
  }

  function lookupWord(w, lang) {
    const d = dict[lang];
    if (d.has(w)) {
      const v = d.get(w);
      return { out: v.out, type: v.type || 'exact', ref: v.ref };
    }
    if (same.has(w)) return { out: w, type: 'same' };

    for (const [suf, ganti] of SUFIKS[lang]) {
      if (w.length <= suf.length + 2 || !w.endsWith(suf)) continue;
      const base = w.slice(0, -suf.length);
      let hit = null;
      if (d.has(base)) hit = d.get(base);
      else if (same.has(base)) hit = { out: base };
      else if (lang === 'id') hit = derive(base);
      if (hit) return { out: hit.out + ganti, type: 'stem', base: hit.base || base, ref: hit.ref };
    }

    if (lang === 'id') {
      const hit = derive(w);
      if (hit) return { ...hit, type: 'stem' };
    }

    const fz = fuzzy(w, lang);
    if (fz) {
      const v = d.get(fz);
      return { out: v.out, type: 'fuzzy', base: fz, ref: v.ref };
    }
    return null;
  }

  function translateWord(raw, lang) {
    const w = norm(raw);
    const cap = isCap(raw);
    const hit = lookupWord(w, lang);
    if (hit) return { src: raw, ...hit, cap };

    // Reduplikasi: "anak-anak", "bersama-sama"
    const parts = w.split('-');
    if (parts.length === 2 && (parts[0] === parts[1] || parts[0].endsWith(parts[1]))) {
      const h = lookupWord(parts[0], lang) || lookupWord(parts[1], lang);
      if (h) return { src: raw, out: `${h.out}-${h.out}`, type: h.type === 'same' ? 'exact' : h.type, cap };
    }
    return { src: raw, out: raw, type: 'unknown', cap: false };
  }

  function translate(text, from) {
    const toks = (text.match(TOKEN_RE) || []).map((t) => ({ t, word: /[\p{L}\p{N}]/u.test(t) }));
    const segs = [];
    let i = 0;

    while (i < toks.length) {
      const tk = toks[i];
      if (!tk.word) {
        segs.push({ src: tk.t, out: tk.t, type: 'punct' });
        i++;
        continue;
      }

      // Pola "sangat X" → "X nihan"
      if (from === 'id' && norm(tk.t) === 'sangat' && toks[i + 1]?.word) {
        const nx = lookupWord(norm(toks[i + 1].t), 'id');
        if (nx) {
          segs.push({ src: `${tk.t} ${toks[i + 1].t}`, out: `${nx.out} nihan`, type: nx.type === 'same' ? 'exact' : nx.type, cap: isCap(tk.t) });
          i += 2;
          continue;
        }
      }

      // Frasa terpanjang (≥ 2 kata)
      let run = 0;
      while (toks[i + run]?.word) run++;
      let matched = false;
      for (let L = Math.min(maxLen[from], run); L >= 2; L--) {
        const src = toks.slice(i, i + L).map((x) => x.t).join(' ');
        const v = dict[from].get(norm(src));
        if (v) {
          segs.push({ src, out: v.out, type: v.type || 'exact', ref: v.ref, cap: isCap(tk.t) });
          i += L;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      segs.push(translateWord(tk.t, from));
      i++;
    }

    let text2 = '';
    segs.forEach((s) => {
      let o = s.out;
      if (s.cap && o && o === o.toLowerCase()) o = o[0].toUpperCase() + o.slice(1);
      const noSpace = s.type === 'punct' && /^[.,!?;:%)\]}”’…]$/.test(o);
      const afterOpen = /[([{“‘]$/.test(text2);
      text2 += (text2 && !noSpace && !afterOpen ? ' ' : '') + o;
    });

    const words = segs.filter((s) => s.type !== 'punct');
    const conf = words.length ? words.reduce((a, s) => a + BOBOT[s.type], 0) / words.length : null;
    return { text: text2, segs, conf };
  }

  /* Tebak bahasa: jumlah kata yang dikenali langsung (frasa dihitung per kata).
     Contoh "api kabar": frasa Komering (2 kata) mengalahkan "api" Indonesia (1). */
  function detect(text) {
    const score = (lang) => translate(text, lang).segs
      .reduce((a, s) => a + (s.type === 'exact' || s.type === 'korpus' ? s.src.split(/\s+/).length : 0), 0);
    return score('km') > score('id') ? 'km' : 'id';
  }

  build();

  /* ---------- UI ---------- */
  let from = 'id';
  let lastResult = null;
  let debounce;

  function setDirection(next) {
    from = next;
    const to = from === 'id' ? 'km' : 'id';
    $('#trFrom').textContent = LABEL[from];
    $('#trTo').textContent = LABEL[to];
    $('#trFrom').classList.toggle('km', from === 'km');
    $('#trTo').classList.toggle('km', to === 'km');
    $('#trOutLabel').textContent = `Hasil · ${LABEL[to]}`;
    $('#trInput').placeholder = from === 'id'
      ? 'Ketik kalimat… contoh: Saya mau makan ikan'
      : 'Ketik Basa Kumoring… contoh: Nyak haga mongan';
    renderExamples();
  }

  function renderExamples() {
    $('#trExamples').innerHTML = DATA.contohKalimat[from]
      .map((k) => `<button type="button" class="chip" data-ex="${esc(k)}">${esc(k)}</button>`)
      .join('');
  }

  function render(res) {
    const out = $('#trOutput');
    lastResult = res;
    if (!res || !res.text) {
      out.textContent = 'Hasil terjemahan akan muncul di sini.';
      out.classList.add('placeholder');
      $('#trBreakdown').innerHTML = '';
      $('#trMeter').style.width = '0%';
      $('#trConf').textContent = '—';
      return;
    }
    out.classList.remove('placeholder');
    out.textContent = res.text;
    const pct = Math.round((res.conf ?? 0) * 100);
    $('#trMeter').style.width = `${pct}%`;
    $('#trConf').textContent = `${pct}%`;

    const note = {
      exact: 'cocok di kamus',
      same: 'kata sama/serapan',
      korpus: 'dipelajari dari korpus',
      stem: 'dari kata dasar',
      fuzzy: 'koreksi ejaan',
      unknown: 'belum dikenal',
    };
    const potong = (t, n = 26) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);
    $('#trBreakdown').innerHTML = res.segs
      .filter((s) => s.type !== 'punct')
      .map((s, k) => {
        let hint = note[s.type];
        if (s.type === 'fuzzy') hint = `maksudmu “${s.base}”?`;
        else if (s.type === 'stem' && s.base) hint = `dasar: ${s.base}`;
        else if (s.ref && from === 'km' && norm(s.ref.arti) !== norm(s.out)) hint = potong(s.ref.arti);
        else if (s.ref) hint = s.ref.id;
        const title = s.ref ? `${s.ref.kata} — ${s.ref.arti} (${s.ref.id}). Klik untuk buka di kamus.` : note[s.type];
        const attr = `class="seg ${s.type}" style="animation-delay:${k * 40}ms" title="${esc(title)}"`;
        const isi = `<small>${esc(s.src)}</small><b>${esc(s.out)}</b><small>${esc(hint)}</small>`;
        return s.ref ? `<button type="button" ${attr} data-cari="${esc(s.ref.kata)}">${isi}</button>` : `<span ${attr}>${isi}</span>`;
      })
      .join('');
  }

  function run(withThinking = false) {
    const text = $('#trInput').value.trim();
    if (!text) {
      render(null);
      return;
    }
    if (!withThinking || reduceMotion) {
      render(translate(text, from));
      return;
    }
    const out = $('#trOutput');
    out.classList.remove('placeholder');
    out.innerHTML = '<span class="thinking" aria-label="Sedang menerjemahkan"><i></i><i></i><i></i></span>';
    setTimeout(() => render(translate(text, from)), 450);
  }

  function init() {
    setDirection('id');

    const input = $('#trInput');
    input.addEventListener('input', () => {
      $('#trCount').textContent = `${input.value.length}/400`;
      clearTimeout(debounce);
      debounce = setTimeout(() => run(false), 300);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        run(true);
      }
    });
    $('#trBtn').addEventListener('click', () => run(true));
    $('#trClear').addEventListener('click', () => {
      input.value = '';
      $('#trCount').textContent = '0/400';
      render(null);
      input.focus();
    });
    $('#trSwap').addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('spin');
      const prevOut = lastResult?.text || '';
      setDirection(from === 'id' ? 'km' : 'id');
      if (prevOut) input.value = prevOut;
      $('#trCount').textContent = `${input.value.length}/400`;
      run(false);
    });
    $('#trExamples').addEventListener('click', (e) => {
      const b = e.target.closest('[data-ex]');
      if (!b) return;
      input.value = b.dataset.ex;
      $('#trCount').textContent = `${input.value.length}/400`;
      run(true);
    });
    $('#trSpeak').addEventListener('click', (e) => {
      if (!lastResult?.text) return Toast.show('Belum ada hasil untuk dibacakan.');
      Suara.speak(lastResult.text, { btn: e.currentTarget, rate: from === 'id' ? 0.85 : 0.95 });
    });
    $('#trCopy').addEventListener('click', () => {
      if (!lastResult?.text) return Toast.show('Belum ada hasil untuk disalin.');
      copyText(lastResult.text);
    });
  }

  return { init, translate, detect, LABEL };
})();

/* ---------- Kamus Basa Kumoring & kata hari ini ---------- */
const Kamus = (() => {
  const PER_PAGE = 12;
  let kelas = 'semua';
  let query = '';
  let dasarSaja = false;
  let shown = PER_PAGE;
  let debounce;

  /* Peringkat hasil: kata persis > arti persis > awalan kata > kata dalam arti > … > contoh kalimat */
  function skor(e, q) {
    const w = norm(e.kata);
    if (w === q || e.varian.some((v) => norm(v) === q)) return 100;
    if (glosa(e.arti).includes(q)) return 80;
    if (w.startsWith(q)) return 60;
    const arti = ` ${norm(e.arti)} `;
    if (arti.includes(` ${q} `)) return 45;
    if (w.includes(q)) return 30;
    if (arti.includes(q)) return 20;
    if (e.contoh.some(([k, i]) => norm(`${k} ${i}`).includes(q))) return 5;
    return 0;
  }

  function hasil() {
    const q = norm(query);
    const list = KAMUS.entri.filter((e) => (kelas === 'semua' || e.kelas === kelas) && (!dasarSaja || !e.induk));
    if (!q) return list;
    // Skor sama → kata yang lebih sering dipakai di korpus didahulukan
    return list
      .map((e) => [skor(e, q) - (e.induk ? 1 : 0), KAMUS.frek.get(norm(e.kata)) || 0, e])
      .filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0] || b[1] - a[1])
      .map(([, , e]) => e);
  }

  function card(e) {
    const label = DATA.kelasKata[e.kelas] || DATA.kelasKata[''];
    const anak = e.induk ? [] : KAMUS.turunanDari(e.kata);
    const contoh = e.contoh.slice(0, 2)
      .map(([k, i]) => `<p class="mt-1.5"><span class="italic">“${esc(k)}”</span><br>${esc(i)}</p>`).join('');
    return `<article class="kamus-card glass">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="font-display text-xl font-bold text-emas-300 break-words">${esc(e.kata)}</p>
          <p class="text-sm mt-0.5" style="color:var(--teks-redup)">${esc(e.arti)}</p>
        </div>
        <button class="icon-btn sm" data-say="${esc(e.kata)}" aria-label="Dengarkan ${esc(e.kata)}">${icon('volume')}</button>
      </div>
      <div class="flex flex-wrap gap-1.5 mt-3">
        <span class="tag">${esc(label)}</span>
        ${e.induk ? `<button type="button" class="tag tag-link" data-cari="${esc(e.induk)}">turunan dari ${esc(e.induk)}</button>` : ''}
        ${e.varian.length ? `<span class="tag tag-soft">varian: ${esc(e.varian.join(', '))}</span>` : ''}
        ${e.lihat ? `<button type="button" class="tag tag-link" data-cari="${esc(e.lihat)}">lihat: ${esc(e.lihat)}</button>` : ''}
      </div>
      ${contoh ? `<div class="text-xs mt-3 pt-2 border-t" style="border-color:var(--garis);color:var(--teks-samar)">${contoh}</div>` : ''}
      ${anak.length ? `<details class="turunan mt-3"><summary>${anak.length} kata turunan</summary><ul>
        ${anak.map((t) => `<li><button type="button" data-cari="${esc(t.kata)}">${esc(t.kata)}</button> — ${esc(t.arti)}</li>`).join('')}
      </ul></details>` : ''}
      <p class="kamus-id">${esc(e.id)}</p>
    </article>`;
  }

  function render() {
    const list = hasil();
    const q = query.trim();
    $('#kamusList').innerHTML = list.length
      ? list.slice(0, shown).map(card).join('')
      : `<p class="col-span-full text-center py-8" style="color:var(--teks-samar)">Kata “${esc(q)}” belum ada di kamus. Coba ejaan lain, atau pakai penerjemah di atas.</p>`;
    $('#kamusMore').classList.toggle('is-hidden', shown >= list.length);
    $('#kamusInfo').textContent = q
      ? `${fmtAngka(list.length)} hasil untuk “${q}”`
      : `Menampilkan ${fmtAngka(Math.min(shown, list.length))} dari ${fmtAngka(list.length)} kata`;
  }

  function setKelas(k) {
    kelas = k;
    $$('#kamusFilter [data-kelas]').forEach((c) => {
      c.classList.toggle('active', c.dataset.kelas === k);
      c.setAttribute('aria-pressed', String(c.dataset.kelas === k));
    });
  }

  /* Cari kata dari mana saja (tombol data-cari, chatbot, penerjemah) */
  function cari(kata) {
    query = kata;
    shown = PER_PAGE;
    setKelas('semua');
    $('#kamusSearch').value = kata;
    render();
    $('#kamus').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function wordOfDay() {
    const pool = KAMUS.layakAcak.filter((e) => ['n', 'v', 'a'].includes(e.kelas)
      && glosa(e.arti)[0] && glosa(e.arti)[0].split(' ').length <= 3 && glosa(e.arti)[0] !== norm(e.kata));
    if (!pool.length) return;
    const now = new Date();
    const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const e = pool[day % pool.length];
    $('#wotdKm').textContent = e.kata;
    $('#wotdId').textContent = `Artinya: ${e.arti}`;
    $('#wotdContoh').textContent = `“${e.contoh[0][0]}” — ${e.contoh[0][1]}`;
    $('#wotdKm').dataset.cari = e.kata;
    $('#wotdSpeak').addEventListener('click', (ev) => Suara.speak(`${e.kata}. ${e.contoh[0][0]}`, { btn: ev.currentTarget }));
  }

  function init() {
    const jumlah = {};
    KAMUS.entri.forEach((e) => { jumlah[e.kelas] = (jumlah[e.kelas] || 0) + 1; });
    const urutan = ['semua', ...Object.keys(DATA.kelasKata).filter((k) => jumlah[k])];
    $('#kamusFilter').innerHTML = `${urutan.map((k) => {
      const nama = k === 'semua' ? 'Semua' : DATA.kelasKata[k];
      const n = k === 'semua' ? KAMUS.entri.length : jumlah[k];
      return `<button type="button" class="chip${k === kelas ? ' active' : ''}" data-kelas="${k}" aria-pressed="${k === kelas}">${esc(nama)} <span class="opacity-60">${fmtAngka(n)}</span></button>`;
    }).join('')}
      <button type="button" class="chip" id="kamusDasar" aria-pressed="false">Kata dasar saja</button>
      <button type="button" class="chip" id="kamusAcak">🎲 Kata acak</button>`;

    $('#kamusFilter').addEventListener('click', (e) => {
      const b = e.target.closest('[data-kelas]');
      if (b) {
        setKelas(b.dataset.kelas);
        shown = PER_PAGE;
        render();
      }
    });
    $('#kamusDasar').addEventListener('click', (e) => {
      dasarSaja = !dasarSaja;
      e.currentTarget.classList.toggle('active', dasarSaja);
      e.currentTarget.setAttribute('aria-pressed', String(dasarSaja));
      shown = PER_PAGE;
      render();
    });
    $('#kamusAcak').addEventListener('click', () => {
      if (KAMUS.layakAcak.length) cari(pick(KAMUS.layakAcak).kata);
    });
    $('#kamusSearch').addEventListener('input', (e) => {
      query = e.target.value;
      shown = PER_PAGE;
      clearTimeout(debounce);
      debounce = setTimeout(render, 150);
    });
    $('#kamusMore').addEventListener('click', () => {
      shown += PER_PAGE;
      render();
    });
    $('#kamusList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-say]');
      if (b) Suara.speak(b.dataset.say, { btn: b });
    });
    // Tautan [data-cari] di seluruh halaman membuka kata itu di kamus
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cari]');
      if (!b) return;
      e.preventDefault();
      cari(b.dataset.cari);
    });
    render();
    wordOfDay();
  }

  return { init, cari };
})();

/* ---------- Sejarah ---------- */
const Sejarah = {
  init() {
    $('#timeline').innerHTML = DATA.sejarah.map((s, i) => `
      <li class="tl-item reveal ${i % 2 ? 'd1' : ''}">
        <span class="tl-dot" aria-hidden="true"><span>${s.ikon}</span></span>
        <article class="tl-card glass">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="tag">${esc(s.era)}</span>
              <h3 class="font-display text-xl font-bold text-white mt-2">${esc(s.judul)}</h3>
            </div>
            <button class="icon-btn sm" data-tl="${i}" aria-label="Dengarkan: ${esc(s.judul)}">${icon('volume')}</button>
          </div>
          <p class="text-sm leading-relaxed mt-2" style="color:var(--teks-redup)">${esc(s.isi)}</p>
        </article>
      </li>`).join('');

    $('#timeline').addEventListener('click', (e) => {
      const b = e.target.closest('[data-tl]');
      if (!b) return;
      const s = DATA.sejarah[b.dataset.tl];
      Suara.speak(`${s.judul}. ${s.isi}`, { btn: b, rate: 1 });
    });

    const btn = $('#sejarahSpeak');
    btn.addEventListener('click', () => {
      if (btn.classList.contains('speaking')) {
        Suara.stop();
        btn.querySelector('span').textContent = 'Dengarkan Raka bercerita';
        return;
      }
      const cerita = DATA.sejarah.map((s) => `${s.judul}. ${s.isi}`).join(' ');
      btn.querySelector('span').textContent = 'Hentikan cerita';
      Suara.speak(cerita, {
        btn,
        rate: 1,
        onend: () => { btn.querySelector('span').textContent = 'Dengarkan Raka bercerita'; },
      });
    });
  },
};

/* ---------- Hotspot (dipakai Peta & Busana) ---------- */
function setupHotspots({ items, layer, info, list, renderInfo, listClass }) {
  layer.innerHTML = items.map((it, i) => `
    <button type="button" class="hotspot" data-i="${i}" style="left:${it.x}%;top:${it.y}%" aria-label="${esc(it.nama)}">
      <span class="hotspot-label">${esc(it.nama)}</span>
    </button>`).join('');
  list.innerHTML = items.map((it, i) => `
    <button type="button" class="${listClass}" data-i="${i}">${it.ikon ? `<span aria-hidden="true">${it.ikon}</span>` : ''}${esc(it.nama)}</button>`).join('');

  const select = (i) => {
    $$('[data-i]', layer).forEach((b) => b.classList.toggle('active', Number(b.dataset.i) === i));
    $$('[data-i]', list).forEach((b) => {
      const on = Number(b.dataset.i) === i;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    info.innerHTML = `<div class="info-swap">${renderInfo(items[i])}</div>`;
  };
  const onClick = (e) => {
    const b = e.target.closest('[data-i]');
    if (b) select(Number(b.dataset.i));
  };
  layer.addEventListener('click', onClick);
  list.addEventListener('click', onClick);
  info.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (b) Suara.speak(b.dataset.say, { btn: b, rate: 1 });
  });
  return select;
}

const Peta = {
  init() {
    const items = DATA.wilayah;
    const select = setupHotspots({
      items,
      layer: $('#petaHotspots'),
      info: $('#petaInfo'),
      list: $('#petaList'),
      listClass: 'place-btn',
      renderInfo: (w) => `
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="tag">${esc(w.kab)}</span>
            <h3 class="font-display text-2xl font-bold text-white mt-2">${w.ikon} ${esc(w.nama)}</h3>
          </div>
          <button class="icon-btn sm" data-say="${esc(`${w.nama}. ${w.isi}`)}" aria-label="Dengarkan">${icon('volume')}</button>
        </div>
        <p class="text-sm leading-relaxed mt-3" style="color:var(--teks-redup)">${esc(w.isi)}</p>`,
    });
    select(items.findIndex((w) => w.key === 'martapura'));
  },
};

/* ---------- Marga ---------- */
const Marga = (() => {
  let kab = 'Semua';
  let q = '';

  function render() {
    const nq = norm(q);
    const list = DATA.marga.filter((m) => (kab === 'Semua' || m.kab === kab) && (!nq || norm(`${m.nama} ${m.isi}`).includes(nq)));
    $('#margaGrid').innerHTML = list.map((m, i) => `
      <article class="marga-card glass" style="animation-delay:${i * 50}ms">
        <span class="tag">${esc(m.kab)}</span>
        <h3 class="font-display text-xl font-bold text-white mt-3">${esc(m.nama)}</h3>
        <p class="text-sm leading-relaxed mt-2" style="color:var(--teks-redup)">${esc(m.isi)}</p>
      </article>`).join('');
    $('#margaEmpty').classList.toggle('is-hidden', list.length > 0);
  }

  function init() {
    const kabs = ['Semua', ...new Set(DATA.marga.map((m) => m.kab))];
    $('#margaFilter').innerHTML = kabs
      .map((k) => `<button type="button" class="chip${k === kab ? ' active' : ''}" data-kab="${esc(k)}" aria-pressed="${k === kab}">${esc(k)}</button>`)
      .join('');
    $('#margaFilter').addEventListener('click', (e) => {
      const b = e.target.closest('[data-kab]');
      if (!b) return;
      kab = b.dataset.kab;
      $$('#margaFilter .chip').forEach((c) => {
        c.classList.toggle('active', c === b);
        c.setAttribute('aria-pressed', String(c === b));
      });
      render();
    });
    $('#margaSearch').addEventListener('input', (e) => {
      q = e.target.value;
      render();
    });
    render();
  }

  return { init };
})();

/* ---------- Busana & Adat ---------- */
const Busana = {
  init() {
    const select = setupHotspots({
      items: DATA.busana,
      layer: $('#busanaHotspots'),
      info: $('#busanaInfo'),
      list: $('#busanaList'),
      listClass: 'chip',
      renderInfo: (b) => `
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-display text-2xl font-bold text-white">${esc(b.nama)}</h3>
          <button class="icon-btn sm" data-say="${esc(`${b.nama}. ${b.isi}`)}" aria-label="Dengarkan">${icon('volume')}</button>
        </div>
        <p class="text-sm leading-relaxed mt-3" style="color:var(--teks-redup)">${esc(b.isi)}</p>`,
    });
    select(1);

    $('#adatSteps').innerHTML = DATA.adatPernikahan.map((s, i) => {
      const entri = KAMUS.id(s.kamus);
      return `
      <li class="glass rounded-2xl p-5 reveal ${i % 3 ? `d${i % 3}` : ''} flex flex-col">
        <div class="flex items-center gap-3">
          <span class="step-num" aria-hidden="true">${s.ikon}</span>
          <span class="text-xs font-bold tracking-widest text-emas-400">TAHAP ${i + 1}</span>
        </div>
        <h4 class="font-display text-xl font-bold text-emas-300 mt-4">${esc(s.km)}</h4>
        <p class="text-sm font-semibold text-white">${esc(s.judul)}</p>
        <p class="text-sm leading-relaxed mt-2 flex-1" style="color:var(--teks-redup)">${esc(s.isi)}</p>
        ${entri ? `<button type="button" class="tag tag-link self-start mt-4" data-cari="${esc(entri.kata)}">📖 ${esc(entri.kata)} · ${esc(entri.id)}</button>` : ''}
      </li>`;
    }).join('');
  },
};

/* ---------- Kuliner: kartu berfoto + dialog kisah hidangan ---------- */
const Kuliner = (() => {
  const items = DATA.kuliner;
  let dlg = null;
  let current = 0;
  let pemicu = null;

  /* Tombol kata kamus: "lalak · pedas" → membuka kata itu di kamus */
  function tagKata(kata, arti) {
    const e = KAMUS.cari(kata).find((x) => !x.sensitif);
    if (!e) return '';
    return `<button type="button" class="tag tag-link" data-cari="${esc(e.kata)}" title="${esc(e.arti)}"><strong>${esc(e.kata)}</strong>&nbsp;· ${esc(arti || artiSingkat(e.arti, e.kata))}</button>`;
  }

  const foto = (k, kelas) => `
    <div class="${kelas}${k.kecil ? ' kecil' : ''}" style="--foto:url('${esc(k.foto)}')">
      <img src="${esc(k.foto)}" alt="${esc(k.alt)}" loading="lazy" decoding="async">
    </div>`;

  function kartu(k, i) {
    return `
    <article class="food-card glass reveal${i === 0 ? ' sm:col-span-2' : ''}${i % 4 ? ` d${i % 4}` : ''}">
      <div class="relative">
        ${foto(k, 'food-photo')}
        <span class="tag food-jenis">${esc(k.jenis)}</span>
      </div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-display text-xl font-bold text-white">${esc(k.nama)}</h3>
        <p class="text-sm text-emas-300 font-semibold">${esc(k.alias)}</p>
        <p class="text-sm leading-relaxed mt-2 flex-1" style="color:var(--teks-redup)">${esc(k.teaser)}</p>
        <button type="button" class="food-more" data-food="${i}" aria-haspopup="dialog">Baca kisahnya ${icon('arrow')}</button>
      </div>
    </article>`;
  }

  function isiDialog(i) {
    current = (i + items.length) % items.length;
    const k = items[current];
    const entri = k.kamus ? KAMUS.id(k.kamus) : null;
    const contoh = entri?.contoh[0];
    const prev = items[(current - 1 + items.length) % items.length];
    const next = items[(current + 1) % items.length];
    dlg.innerHTML = `
      <div class="food-dialog-inner glass-strong">
        ${foto(k, 'food-dialog-photo')}
        <button type="button" class="icon-btn food-close" data-tutup aria-label="Tutup">${icon('x')}</button>
        <div class="p-6 sm:p-8">
          <span class="tag">${esc(k.jenis)}</span>
          <h3 id="kulinerJudul" class="font-display text-3xl font-bold text-white mt-3">${esc(k.nama)}</h3>
          <p class="text-emas-300 font-semibold">${esc(k.alias)}</p>
          ${k.cerita.map((p) => `<p class="leading-relaxed mt-4" style="color:var(--teks-redup)">${esc(p)}</p>`).join('')}

          <div class="grid sm:grid-cols-2 gap-4 mt-6">
            <div class="food-box">
              <p class="eyebrow">Bahan Utama</p>
              <ul class="mt-3 space-y-1.5 text-sm" style="color:var(--teks-redup)">
                ${k.bahan.map((b) => `<li class="flex gap-2"><span class="text-emas-400">◆</span>${esc(b)}</li>`).join('')}
              </ul>
            </div>
            <div class="food-box">
              <p class="eyebrow">Cara Menikmati</p>
              <p class="mt-3 text-sm leading-relaxed" style="color:var(--teks-redup)">${esc(k.sajian)}</p>
            </div>
          </div>

          <div class="food-fakta mt-4">
            <p class="eyebrow">💡 Tahukah Kamu?</p>
            <p class="mt-2 text-sm leading-relaxed" style="color:var(--teks-redup)">${esc(k.fakta)}</p>
          </div>

          <p class="eyebrow mt-6">Kosakata di Pawon</p>
          <div class="flex flex-wrap gap-2 mt-3">${(k.kosakata || []).map((w) => tagKata(w)).join('')}</div>

          ${entri ? `
          <div class="food-box mt-6">
            <p class="eyebrow">Dari Kamus · ${esc(entri.id)}</p>
            <p class="text-sm leading-relaxed mt-2" style="color:var(--teks-redup)"><strong class="text-emas-200">${esc(entri.kata)}</strong> — ${esc(entri.arti)}</p>
            ${contoh ? `<p class="text-xs italic mt-2" style="color:var(--teks-samar)">“${esc(contoh[0])}” — ${esc(contoh[1])}</p>` : ''}
          </div>` : ''}

          <div class="flex justify-between gap-3 mt-8">
            <button type="button" class="chip" data-geser="-1">← ${esc(prev.nama)}</button>
            <button type="button" class="chip" data-geser="1">${esc(next.nama)} →</button>
          </div>
        </div>
      </div>`;
    dlg.scrollTop = 0;
    dlg.querySelector('.food-dialog-inner').scrollTop = 0;
  }

  function buka(i, tombol) {
    pemicu = tombol || null;
    isiDialog(i);
    if (!dlg.open) dlg.showModal();
    dlg.querySelector('[data-tutup]').focus();
  }

  function geser(n, fokus) {
    isiDialog(current + n);
    dlg.querySelector(fokus).focus();
  }

  function init() {
    const grid = $('#kulinerGrid');
    grid.innerHTML = items.map(kartu).join('');
    dlg = $('#kulinerDialog');

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.food-card');
      if (!card) return;
      const b = card.querySelector('[data-food]');
      buka(Number(b.dataset.food), b);
    });

    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-tutup]')) {
        dlg.close();
        return;
      }
      const g = e.target.closest('[data-geser]');
      if (g) {
        geser(Number(g.dataset.geser), `[data-geser="${g.dataset.geser}"]`);
        return;
      }
      // Tautan kamus: tutup dialog dulu, lalu handler global [data-cari] membuka kamus
      if (e.target.closest('[data-cari]')) {
        pemicu = null;
        dlg.close();
      }
    });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') geser(e.key === 'ArrowLeft' ? -1 : 1, '[data-tutup]');
    });
    dlg.addEventListener('close', () => {
      pemicu?.focus({ preventScroll: true });
    });

    $('#kulinerPenganan').innerHTML = DATA.penganan.map(([w, arti]) => tagKata(w, arti)).join('');
  }

  return { init };
})();

/* =============================================================================
   PEMUTAR LAGU — rekaman "Dang Lupa ko Komering" (assets/lagu/)
   Lirik tersorot mengikuti waktu tiap baris (DATA.lagu…t); reff yang
   dinyanyikan berulang menyala setiap kali muncul.
   ============================================================================= */
const Lagu = (() => {
  const L = DATA.lagu;
  const lines = []; // baris tampil
  const occ = []; // tiap kali sebuah baris dinyanyikan: { start, end, line }
  let audio = null;
  let activeLine = -1;
  let ikuti = true;
  let raf = 0;

  function build() {
    L.bagian.forEach((bag, bi) => bag.baris.forEach((b, j) => {
      const li = lines.length;
      lines.push({ ...b, bi, label: j === 0 ? bag.label : null, ulang: j === 0 ? bag.ulang : null });
      b.t.forEach((start) => occ.push({ start, line: li }));
    }));
    occ.sort((a, b) => a.start - b.start);
    // Baris menyala sampai baris berikutnya, jeda musik, atau akhir nyanyian
    occ.forEach((o, i) => {
      const next = i + 1 < occ.length ? occ[i + 1].start : Infinity;
      const jeda = L.jeda.find(([a]) => a > o.start);
      o.end = Math.min(next, jeda ? jeda[0] : Infinity, L.selesai);
    });
  }

  const occAt = (pos) => occ.findIndex((o) => pos >= o.start && pos < o.end);
  const durasi = () => (audio && Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : L.durasi);

  function status(pos, oi) {
    if (oi >= 0) return L.bagian[lines[occ[oi].line].bi].label;
    if (pos < occ[0].start) return '♪ Intro musik';
    if (pos >= L.selesai) return '♪ Penutup';
    return '♪ Interlude musik';
  }

  function scrollKe(li) {
    const box = $('#lyrics');
    const el = box.querySelectorAll('.lyric-line')[li];
    box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function updateUI() {
    const pos = audio.currentTime;
    const d = durasi();
    const seekEl = $('#laguSeek');
    seekEl.max = d.toFixed(1);
    seekEl.value = pos.toFixed(1);
    seekEl.style.setProperty('--pct', `${(pos / d) * 100}%`);
    $('#laguNow').textContent = fmtTime(pos);
    $('#laguDur').textContent = fmtTime(d);

    const oi = occAt(pos);
    $('#laguStatus').textContent = status(pos, oi);
    const li = oi >= 0 ? occ[oi].line : -1;
    if (li !== activeLine) {
      activeLine = li;
      $$('#lyrics .lyric-line').forEach((el, i) => {
        el.classList.toggle('active', i === li);
        if (i === li) el.setAttribute('aria-current', 'true');
        else el.removeAttribute('aria-current');
      });
      if (li >= 0 && ikuti) scrollKe(li);
    }
  }

  function tombolPutar() {
    const playing = !audio.paused;
    const btn = $('#laguPlay');
    btn.innerHTML = icon(playing ? 'pause' : 'play');
    btn.setAttribute('aria-label', playing ? 'Jeda lagu' : 'Putar lagu');
    $('#vinyl').classList.toggle('playing', playing);
  }

  function loop() {
    updateUI();
    if (!audio.paused) raf = requestAnimationFrame(loop);
  }

  function play() {
    Suara.stop();
    audio.play().catch(() => Toast.show('Lagu belum bisa diputar. Coba ketuk tombol putar sekali lagi.'));
  }

  function seek(sec) {
    audio.currentTime = clamp(sec, 0, durasi());
    updateUI();
  }

  function renderLyrics() {
    $('#lyrics').innerHTML = lines.map((l, i) => `
      ${l.label ? `<p class="lyric-label">${esc(l.label)}${l.ulang ? ` <span class="lyric-ulang">${esc(l.ulang)}</span>` : ''}</p>` : ''}
      <button type="button" class="lyric-line" data-line="${i}">
        <span class="km">${esc(l.km)}</span>
        <span class="id">${esc(l.id)}</span>
      </button>`).join('');
  }

  /* Kata-kata lirik yang ada di kamus (kecuali yang artinya sama dengan bahasa Indonesia) */
  function renderKosakata() {
    const seen = new Set(L.abaikan || []);
    const chips = [];
    lines.forEach((l) => norm(l.km).split(/[^a-z]+/).forEach((w) => {
      if (!w || seen.has(w)) return;
      seen.add(w);
      const akar = (L.akarKata || {})[w] || w;
      const e = KAMUS.cari(akar).find((x) => !x.sensitif);
      if (!e || seen.has(e.id)) return;
      seen.add(e.id);
      const arti = artiSingkat(e.arti);
      if (arti === norm(e.kata)) return;
      chips.push(`<button type="button" class="tag tag-link" data-cari="${esc(e.kata)}" title="${esc(e.arti)}"><strong>${esc(w)}</strong>&nbsp;· ${esc(arti)}</button>`);
    }));
    $('#laguKata').innerHTML = chips.join('');
  }

  function init() {
    build();
    audio = $('#laguAudio');
    renderLyrics();
    renderKosakata();
    $('#laguKet').textContent = L.keterangan;
    updateUI();
    tombolPutar();

    audio.addEventListener('play', () => {
      tombolPutar();
      cancelAnimationFrame(raf);
      loop();
    });
    audio.addEventListener('pause', () => {
      tombolPutar();
      updateUI();
    });
    audio.addEventListener('loadedmetadata', updateUI);
    audio.addEventListener('seeked', updateUI);
    audio.addEventListener('error', () => Toast.show('File lagu tidak ditemukan atau gagal dimuat.'));

    $('#laguPlay').addEventListener('click', () => (audio.paused ? play() : audio.pause()));
    $('#laguSeek').addEventListener('input', (e) => seek(Number(e.target.value)));
    $('#laguPrev').addEventListener('click', () => {
      // Kembali ke awal baris ini; bila baru saja dimulai, ke baris sebelumnya
      const pos = audio.currentTime;
      const prev = [...occ].reverse().find((o) => o.start < pos - 1.5);
      seek(prev ? prev.start : 0);
    });
    $('#laguNext').addEventListener('click', () => {
      const next = occ.find((o) => o.start > audio.currentTime + 0.25);
      if (next) seek(next.start);
    });
    $('#lyrics').addEventListener('click', (e) => {
      const b = e.target.closest('[data-line]');
      if (!b) return;
      // Reff muncul berkali-kali: lompat ke kemunculan berikutnya, atau yang pertama
      const t = lines[Number(b.dataset.line)].t;
      seek(t.find((s) => s > audio.currentTime + 0.5) ?? t[0]);
      if (audio.paused) play();
    });

    const toggleId = $('#laguToggleId');
    toggleId.addEventListener('click', () => {
      const on = toggleId.getAttribute('aria-pressed') !== 'true';
      toggleId.setAttribute('aria-pressed', String(on));
      toggleId.classList.toggle('active', on);
      $('#lyrics').classList.toggle('hide-id', !on);
    });

    const ikutiBtn = $('#laguIkuti');
    ikutiBtn.addEventListener('click', () => {
      ikuti = !ikuti;
      ikutiBtn.setAttribute('aria-pressed', String(ikuti));
      ikutiBtn.classList.toggle('active', ikuti);
      if (ikuti && activeLine >= 0) scrollKe(activeLine);
    });
  }

  return { init };
})();

/* ---------- Generator Jajuluk ---------- */
const Jajuluk = (() => {
  const J = DATA.jajuluk;
  let salt = 0;
  let last = null;

  /* Pola kamus (KOM-K01424): dua kata seperti "Mangku Alam" / "Satria Bangsawan";
     gelar istri = "Nai" + gelar suami ("Nai Mangku Alam"). */
  function generate(nama, gender, sifatKey) {
    const h = hashStr(`${norm(nama)}|${gender}|${sifatKey}|${salt}`);
    const sifat = J.sifat[sifatKey].kata[h % J.sifat[sifatKey].kata.length];
    const penutup = J.penutup[(h >>> 8) % J.penutup.length];
    const inti = `${sifat.kata} ${penutup.kata}`;
    const makna = [sifat, penutup];
    if (gender === 'P') makna.unshift({ kata: 'Nai', arti: 'penanda gelar istri, pasangan dari gelar suami' });
    return {
      nama,
      makna,
      judul: gender === 'P' ? `Nai ${inti}` : inti,
      pasangan: gender === 'P' ? `Gelar suami: ${inti}` : `Gelar istri kelak: Nai ${inti}`,
      doa: `Semoga ${nama} tumbuh menjadi pribadi yang ${sifat.arti}, dan selalu ingat akan ${penutup.arti}.`,
    };
  }

  function render(r) {
    const box = $('#jjResult');
    box.classList.remove('reveal-anim');
    void box.offsetWidth;
    box.classList.add('reveal-anim');
    box.innerHTML = `
      <p class="eyebrow justify-center">Jajuluk Komering</p>
      <p class="text-sm mt-5" style="color:var(--teks-redup)">Dianugerahkan kepada</p>
      <p class="font-display italic text-2xl text-white mt-1">${esc(r.nama)}</p>
      <h3 class="jj-title text-emas-gradient mt-5">${esc(r.judul)}</h3>
      <p class="text-xs font-semibold mt-2" style="color:var(--teks-samar)">${esc(r.pasangan)}</p>
      <ul class="mt-6 space-y-2 text-sm max-w-sm mx-auto text-left" style="color:var(--teks-redup)">
        ${r.makna.map((p) => `<li class="flex gap-2"><span class="text-emas-400">◆</span><span><strong class="text-emas-200">${esc(p.kata)}</strong> — ${esc(p.arti)}</span></li>`).join('')}
      </ul>
      <p class="font-display italic mt-6 max-w-sm mx-auto" style="color:var(--teks-redup)">“${esc(r.doa)}”</p>
      <div class="flex flex-wrap justify-center gap-2 mt-7">
        <button type="button" class="btn-ghost btn-sm" data-jj="say">${icon('volume')} Dengarkan</button>
        <button type="button" class="btn-ghost btn-sm" data-jj="again">${icon('refresh')} Acak lagi</button>
        <button type="button" class="btn-ghost btn-sm" data-jj="share">${icon('share')} Bagikan</button>
        <button type="button" class="btn-emas btn-sm" data-jj="png">${icon('download')} Unduh kartu</button>
      </div>`;
  }

  function wrap(g, text, maxW) {
    const words = text.split(' ');
    const out = [];
    let line = '';
    words.forEach((w) => {
      const test = line ? `${line} ${w}` : w;
      if (g.measureText(test).width > maxW && line) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) out.push(line);
    return out;
  }

  async function downloadCard(r) {
    try {
      await Promise.all([
        document.fonts.load('800 80px "Playfair Display"'),
        document.fonts.load('italic 600 56px "Playfair Display"'),
        document.fonts.load('600 30px "Plus Jakarta Sans"'),
      ]);
    } catch { /* font cadangan dipakai */ }

    const W = 1080;
    const H = 1350;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');

    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#3B0D16');
    bg.addColorStop(1, '#1A090D');
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);

    g.strokeStyle = 'rgba(212,162,58,0.10)';
    g.lineWidth = 2;
    for (let y = 0; y < H + 60; y += 60) {
      for (let x = 0; x < W + 60; x += 60) {
        g.beginPath();
        g.moveTo(x, y - 26);
        g.lineTo(x + 26, y);
        g.lineTo(x, y + 26);
        g.lineTo(x - 26, y);
        g.closePath();
        g.stroke();
      }
    }
    const glow = g.createRadialGradient(W / 2, 600, 40, W / 2, 600, 620);
    glow.addColorStop(0, 'rgba(242,198,97,0.24)');
    glow.addColorStop(1, 'rgba(242,198,97,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, W, H);

    g.strokeStyle = '#D4A23A';
    g.lineWidth = 6;
    g.strokeRect(40, 40, W - 80, H - 80);
    g.lineWidth = 2;
    g.strokeRect(62, 62, W - 124, H - 124);

    g.fillStyle = 'rgba(212,162,58,0.8)';
    for (let x = 62; x < W - 62; x += 34) {
      g.beginPath();
      g.moveTo(x, 62);
      g.lineTo(x + 17, 84);
      g.lineTo(x + 34, 62);
      g.fill();
      g.beginPath();
      g.moveTo(x, H - 62);
      g.lineTo(x + 17, H - 84);
      g.lineTo(x + 34, H - 62);
      g.fill();
    }

    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    let y = 210;
    g.fillStyle = '#F2C661';
    g.font = '700 30px "Plus Jakarta Sans", sans-serif';
    g.fillText('◆  JAJULUK KOMERING  ◆', W / 2, y);

    y += 120;
    g.fillStyle = 'rgba(253,246,234,0.72)';
    g.font = '500 32px "Plus Jakarta Sans", sans-serif';
    g.fillText('Dianugerahkan kepada', W / 2, y);
    y += 78;
    g.fillStyle = '#FDF6EA';
    g.font = 'italic 600 60px "Playfair Display", Georgia, serif';
    g.fillText(r.nama, W / 2, y);

    y += 50;
    g.strokeStyle = 'rgba(242,198,97,0.5)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(W / 2 - 160, y);
    g.lineTo(W / 2 + 160, y);
    g.stroke();

    const gold = g.createLinearGradient(160, 0, W - 160, 0);
    gold.addColorStop(0, '#FBE7B5');
    gold.addColorStop(0.5, '#F2C661');
    gold.addColorStop(1, '#D4A23A');
    g.fillStyle = gold;
    g.font = '800 92px "Playfair Display", Georgia, serif';
    y += 120;
    wrap(g, r.judul, W - 240).forEach((ln) => {
      g.fillText(ln, W / 2, y);
      y += 104;
    });

    g.font = '600 26px "Plus Jakarta Sans", sans-serif';
    g.fillStyle = 'rgba(253,246,234,0.55)';
    g.fillText(r.pasangan, W / 2, y - 40);

    y += 30;
    g.font = '500 30px "Plus Jakarta Sans", sans-serif';
    g.fillStyle = 'rgba(253,246,234,0.8)';
    r.makna.forEach((p) => {
      wrap(g, `${p.kata} — ${p.arti}`, W - 260).forEach((ln) => {
        g.fillText(ln, W / 2, y);
        y += 44;
      });
      y += 6;
    });

    y += 30;
    g.fillStyle = 'rgba(253,246,234,0.7)';
    g.font = 'italic 600 32px "Playfair Display", Georgia, serif';
    wrap(g, `“${r.doa}”`, W - 280).forEach((ln) => {
      g.fillText(ln, W / 2, y);
      y += 46;
    });

    g.fillStyle = '#F2C661';
    g.font = '700 30px "Playfair Display", Georgia, serif';
    g.fillText('Dang Lupa ko Komering', W / 2, H - 150);
    g.fillStyle = 'rgba(253,246,234,0.55)';
    g.font = '500 22px "Plus Jakarta Sans", sans-serif';
    g.fillText('Vibe Coding IT Festival 2026 · kreasi edukatif', W / 2, H - 112);

    c.toBlob((blob) => {
      if (!blob) return Toast.show('Gagal membuat kartu.');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `jajuluk-${norm(r.nama).replace(/[^a-z0-9]+/g, '-') || 'komering'}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      Toast.show('Kartu jajuluk diunduh ✓');
    }, 'image/png');
  }

  function init() {
    const keys = Object.keys(J.sifat);
    $('#jjSifat').innerHTML = keys.map((k, i) => `
      <label><input type="radio" name="jjSifat" value="${k}" class="sr-only" ${i === 0 ? 'checked' : ''}>
      <span class="chip">${J.sifat[k].ikon} ${esc(J.sifat[k].label)}</span></label>`).join('');

    $('#jjForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = $('#jjNama').value.trim().replace(/\s+/g, ' ');
      if (!nama) {
        Toast.show('Tulis nama panggilanmu dulu, ya!');
        $('#jjNama').focus();
        return;
      }
      const gender = $('input[name="jjGender"]:checked').value;
      const sifat = $('input[name="jjSifat"]:checked').value;
      salt = 0;
      last = generate(nama, gender, sifat);
      last.input = { gender, sifat };
      render(last);
      if (window.innerWidth < 1024) $('#jjResult').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });

    $('#jjResult').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-jj]');
      if (!b || !last) return;
      const act = b.dataset.jj;
      if (act === 'say') Suara.speak(`${last.judul}. ${last.doa}`, { btn: b, rate: 0.95 });
      if (act === 'again') {
        salt++;
        const { input } = last;
        last = generate(last.nama, input.gender, input.sifat);
        last.input = input;
        render(last);
      }
      if (act === 'png') downloadCard(last);
      if (act === 'share') {
        const text = `Jajuluk Komering-ku: ${last.judul}! ✨ ${last.doa} — buat punyamu di Dang Lupa ko Komering.`;
        if (navigator.share) {
          try { await navigator.share({ title: 'Jajuluk Komering', text, url: location.href }); } catch { /* dibatalkan */ }
        } else {
          copyText(text);
        }
      }
    });
  }

  return { init };
})();

/* ---------- Kuis ---------- */
const Kuis = (() => {
  const N = 10;
  const BEST_KEY = 'dlk-kuis-terbaik';
  let soal = [];
  let idx = 0;
  let skor = 0;
  const box = () => $('#quizBox');

  function peringkat(s) {
    if (s === N) return { gelar: 'Ulun Kumoring Sejati', ikon: '👑', pesan: 'Sempurna! Niku benar-benar menjaga budaya Komering.' };
    if (s >= 8) return { gelar: 'Morli Maranai Pandai', ikon: '🌟', pesan: 'Hebat! Pengetahuanmu tentang Komering sangat baik.' };
    if (s >= 5) return { gelar: 'Sanak Rajin Belajar', ikon: '📚', pesan: 'Holau! Sedikit lagi menuju gelar tertinggi.' };
    return { gelar: 'Ayo Belajar Lagi', ikon: '🌱', pesan: 'Dang lupa — jelajahi bab-bab di atas lalu coba lagi!' };
  }

  function renderStart() {
    const best = store.get(BEST_KEY, null);
    box().innerHTML = `
      <div class="text-center">
        <div class="text-6xl" aria-hidden="true">🏆</div>
        <h3 class="font-display text-3xl font-bold text-white mt-5">Siap diuji, Sanak?</h3>
        <p class="mt-3" style="color:var(--teks-redup)">${N} soal acak: budaya Komering, ditambah kosakata yang diambil langsung dari ${fmtAngka(KAMUS.meta.jumlahKata)} kata kamus. Tiap jawaban disertai penjelasan.</p>
        ${best !== null ? `<p class="mt-4 text-sm text-emas-300 font-semibold">Skor terbaikmu: ${best}/${N}</p>` : ''}
        <button type="button" class="btn-emas mt-8" data-q="start">Mulai Kuis ${icon('arrow')}</button>
      </div>`;
  }

  /* Soal kosakata dari kamus: separuh "apa arti X?", separuh "apa Basa Kumoring dari Y?" */
  function soalKosakata(n) {
    const kap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const pool = KAMUS.layakAcak
      .filter((e) => ['n', 'v', 'a'].includes(e.kelas) && /^[a-z-]+$/.test(e.kata))
      .map((e) => ({ e, g: glosa(e.arti)[0] }))
      .filter(({ e, g }) => g && g.split(' ').length <= 2 && g !== norm(e.kata));
    if (pool.length < 8) return [];
    return shuffle(pool).slice(0, n).map(({ e, g }, i) => {
      const balik = i % 2 === 1;
      const benar = balik ? e.kata : g;
      const salah = [];
      for (const p of shuffle(pool)) {
        const v = balik ? p.e.kata : p.g;
        if (p.g !== g && p.e.kelas === e.kelas && v !== benar && !salah.includes(v)) salah.push(v);
        if (salah.length === 3) break;
      }
      const [k, terj] = e.contoh[0];
      return {
        q: balik ? `Apa Basa Kumoring dari kata “${g}”?` : `Apa arti kata “${e.kata}” dalam Basa Kumoring?`,
        opsi: [benar, ...salah].map(kap),
        benar: 0,
        info: `Kamus (${e.id}): ${e.kata} = ${e.arti}. Contoh: “${k}” — ${terj}.`,
        jenis: 'Kosakata kamus',
      };
    });
  }

  function start() {
    const kosakata = soalKosakata(4);
    const budaya = shuffle(DATA.kuis).slice(0, N - kosakata.length).map((q) => ({ ...q, jenis: 'Budaya' }));
    soal = shuffle([...budaya, ...kosakata]).map((q) => ({
      ...q,
      opsi: shuffle(q.opsi.map((t, i) => ({ t, benar: i === q.benar }))),
    }));
    idx = 0;
    skor = 0;
    renderQ();
  }

  function renderQ() {
    const q = soal[idx];
    box().innerHTML = `
      <div class="flex items-center justify-between text-xs font-bold mb-3">
        <span class="text-emas-400 tracking-widest">SOAL ${idx + 1} / ${N} <span class="tag ml-2 tracking-normal">${esc(q.jenis)}</span></span>
        <span style="color:var(--teks-samar)">Skor: ${skor}</span>
      </div>
      <div class="progress"><span style="width:${(idx / N) * 100}%"></span></div>
      <h3 class="font-display text-2xl font-bold text-white mt-6 leading-snug">${esc(q.q)}</h3>
      <div class="grid gap-3 mt-6">
        ${q.opsi.map((o, i) => `<button type="button" class="quiz-opt" data-opt="${i}"><span class="key">${'ABCD'[i]}</span><span>${esc(o.t)}</span></button>`).join('')}
      </div>
      <div id="quizFeedback" class="mt-5"></div>`;
    box().querySelector('.quiz-opt')?.focus({ preventScroll: true });
  }

  function answer(i) {
    const q = soal[idx];
    const btns = $$('.quiz-opt', box());
    btns.forEach((b) => { b.disabled = true; });
    const benar = q.opsi[i].benar;
    if (benar) skor++;
    btns[i].classList.add(benar ? 'benar' : 'salah');
    btns[q.opsi.findIndex((o) => o.benar)].classList.add('benar');
    $('#quizFeedback').innerHTML = `
      <div class="rounded-2xl p-4 info-swap" style="background:${benar ? 'rgba(127,214,155,.1)' : 'rgba(255,138,138,.08)'};border:1px solid ${benar ? 'rgba(127,214,155,.35)' : 'rgba(255,138,138,.3)'}">
        <p class="font-bold ${benar ? 'text-green-300' : 'text-red-300'}">${benar ? '✓ Holau nihan! Benar.' : '✗ Belum tepat.'}</p>
        <p class="text-sm mt-1" style="color:var(--teks-redup)">${esc(q.info)}</p>
      </div>
      <div class="text-right mt-4">
        <button type="button" class="btn-emas btn-sm" data-q="next">${idx + 1 < N ? 'Soal berikutnya' : 'Lihat hasil'} ${icon('arrow')}</button>
      </div>`;
    $('[data-q="next"]', box()).focus({ preventScroll: true });
  }

  function renderEnd() {
    const best = Math.max(skor, store.get(BEST_KEY, 0));
    store.set(BEST_KEY, best);
    const p = peringkat(skor);
    box().innerHTML = `
      <div class="text-center">
        <div class="score-ring mx-auto" style="--p:${(skor / N) * 100}">
          <div><span class="font-display text-4xl font-extrabold text-emas-300">${skor}/${N}</span></div>
        </div>
        <p class="text-5xl mt-6" aria-hidden="true">${p.ikon}</p>
        <h3 class="font-display text-3xl font-bold text-emas-gradient mt-3">${esc(p.gelar)}</h3>
        <p class="mt-3" style="color:var(--teks-redup)">${esc(p.pesan)}</p>
        <p class="text-sm mt-2" style="color:var(--teks-samar)">Skor terbaik: ${best}/${N}</p>
        <div class="flex flex-wrap justify-center gap-3 mt-8">
          <button type="button" class="btn-emas" data-q="start">${icon('refresh')} Main lagi</button>
          <button type="button" class="btn-ghost" data-q="share">${icon('share')} Bagikan skor</button>
        </div>
      </div>`;
  }

  function init() {
    renderStart();
    box().addEventListener('click', async (e) => {
      const opt = e.target.closest('[data-opt]');
      if (opt && !opt.disabled) return answer(Number(opt.dataset.opt));
      const b = e.target.closest('[data-q]');
      if (!b) return;
      if (b.dataset.q === 'start') start();
      if (b.dataset.q === 'next') {
        idx++;
        if (idx < N) renderQ();
        else renderEnd();
      }
      if (b.dataset.q === 'share') {
        const text = `Aku meraih ${skor}/${N} di Kuis Ulun Kumoring — gelar "${peringkat(skor).gelar}"! Dang lupa ko Komering 🏆`;
        if (navigator.share) {
          try { await navigator.share({ title: 'Kuis Ulun Kumoring', text, url: location.href }); } catch { /* dibatalkan */ }
        } else {
          copyText(text);
        }
      }
    });
  }

  return { init };
})();

/* =============================================================================
   CHATBOT RAKA & RATIH
   Deteksi niat terjemahan (regex) → Penerjemah; selain itu klasifikasi niat
   berbasis skor kata kunci (frasa +3, kata +2, salah ketik +1).
   ============================================================================= */
const Chat = (() => {
  const NAMA = { ratih: 'Ratih', raka: 'Raka' };
  const POLA_TERJEMAH = [
    /(.+?)\s+(?:dalam|dlm|pakai|ke)\s+(?:bahasa|basa)\s+(?:komering|kumoring)\b/i,
    /(?:bahasa|basa)\s+(?:komering|kumoring)(?:nya)?\s+(?:dari\s+|untuk\s+|kata\s+)?(.+)/i,
    /(?:terjemahkan|translate|artikan)\s+(.+)/i,
    /\barti(?:nya)?\s+(?:kata\s+|dari\s+)?(.+)/i,
  ];
  let opened = false;

  const formatTeks = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  function addMsg(text, who, aksi = []) {
    const wrap = document.createElement('div');
    wrap.className = `msg ${who === 'user' ? 'user' : ''}`;
    const avatar = who === 'user' ? '' : `<span class="avatar avatar-${who}" aria-hidden="true"></span>`;
    const name = who === 'user' ? '' : `<span class="msg-name">${NAMA[who]}</span>`;
    const links = aksi.length
      ? `<div class="msg-actions">${aksi.map((a) => `<a href="${esc(a.href)}" data-close${a.cari ? ` data-cari="${esc(a.cari)}"` : ''}>${esc(a.label)} →</a>`).join('')}</div>`
      : '';
    wrap.innerHTML = `${avatar}<div class="msg-body">${name}${formatTeks(text)}${links}</div>`;
    const list = $('#chatMsgs');
    list.appendChild(wrap);
    list.scrollTop = list.scrollHeight;
  }

  function typing(who) {
    const el = document.createElement('div');
    el.className = 'msg';
    el.innerHTML = `<span class="avatar avatar-${who}" aria-hidden="true"></span><div class="msg-body"><span class="thinking" aria-label="${NAMA[who]} sedang mengetik"><i></i><i></i><i></i></span></div>`;
    $('#chatMsgs').appendChild(el);
    $('#chatMsgs').scrollTop = $('#chatMsgs').scrollHeight;
    return el;
  }

  function bersihkan(s) {
    return s.replace(/^[\s"'“”‘’:]+|[\s"'“”‘’?!.:]+$/g, '');
  }

  /* Entri kamus lengkap untuk satu kata Komering (maks. 3 arti) */
  function entriKamus(w) {
    const hits = KAMUS.cari(w);
    if (!hits.length) return null;
    return hits.slice(0, 3).map((e) => {
      const kelas = e.kelas ? ` (${DATA.kelasKata[e.kelas]})` : '';
      const contoh = e.contoh[0] ? `\nContoh: “${e.contoh[0][0]}” — ${e.contoh[0][1]}` : '';
      return `📖 **${e.kata}**${kelas} — ${e.arti}${contoh}`;
    }).join('\n\n');
  }

  function cobaTerjemah(q) {
    for (const re of POLA_TERJEMAH) {
      const m = q.match(re);
      if (!m) continue;
      const frasa = bersihkan(m[1]);
      if (!frasa || /^(itu|ini|apa|komering|kumoring|nama komering)$/i.test(frasa)) continue;
      const from = Penerjemah.detect(frasa);
      const to = from === 'id' ? 'km' : 'id';
      const res = Penerjemah.translate(frasa, from);
      const pct = Math.round((res.conf ?? 0) * 100);
      const asing = res.segs.filter((s) => s.type === 'unknown').map((s) => s.src);
      const aksi = [{ label: 'Buka Penerjemah', href: '#penerjemah' }];
      let teks = `“${frasa}” dalam ${Penerjemah.LABEL[to]}:\n**${res.text}**\n(keyakinan ${pct}%)`;
      if (asing.length) teks += `\nKata yang belum ada di kamus: ${asing.join(', ')}.`;

      // Satu kata: tampilkan juga entri kamusnya
      if (!/\s/.test(frasa)) {
        const kataKm = from === 'km' ? frasa : res.text;
        const entri = entriKamus(kataKm);
        if (entri) {
          teks = from === 'km' ? entri : `“${frasa}” dalam Basa Kumoring: **${res.text}**\n\n${entri}`;
          aksi.unshift({ label: 'Buka di kamus', href: '#kamus', cari: kataKm });
        }
      }
      return { oleh: 'ratih', teks, aksi, say: to === 'km' ? res.text : null };
    }
    return null;
  }

  function cariNiat(q) {
    const n = ` ${norm(q).replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()} `;
    const words = n.trim().split(' ');
    let best = null;
    let bestS = 0;
    DATA.chatbot.intents.forEach((it) => {
      let s = 0;
      it.kata.forEach((k) => {
        if (k.includes(' ')) {
          if (n.includes(` ${k} `)) s += 3;
        } else if (words.includes(k)) {
          s += 2;
        } else if (k.length >= 5 && words.some((w) => Math.abs(w.length - k.length) <= 1 && levenshtein(w, k, 1) <= 1)) {
          s += 1;
        }
      });
      if (s > bestS) {
        bestS = s;
        best = it;
      }
    });
    return best;
  }

  function jawab(q) {
    const tr = cobaTerjemah(q);
    if (tr) return tr;
    const it = cariNiat(q);
    if (it) return { oleh: it.oleh, teks: isiAngka(pick(it.jawab)), aksi: it.aksi || [] };
    // Satu kata Komering tanpa kata tanya: langsung tampilkan entri kamusnya
    const kata = bersihkan(q);
    if (!/\s/.test(kata) && Penerjemah.detect(kata) === 'km') {
      const entri = entriKamus(kata);
      if (entri) return { oleh: 'ratih', teks: entri, aksi: [{ label: 'Buka di kamus', href: '#kamus', cari: kata }] };
    }
    return { oleh: 'ratih', teks: isiAngka(pick(DATA.chatbot.fallback)), aksi: [], saran: true };
  }

  function send(q) {
    const text = q.trim();
    if (!text) return;
    addMsg(text, 'user');
    const r = jawab(text);
    const t = typing(r.oleh);
    setTimeout(() => {
      t.remove();
      addMsg(r.teks, r.oleh, r.aksi);
      if (r.say) Suara.speak(r.say);
    }, reduceMotion ? 0 : 450 + Math.min(900, r.teks.length * 6));
  }

  function setOpen(open) {
    const panel = $('#chatPanel');
    const fab = $('#chatFab');
    panel.hidden = !open;
    fab.classList.toggle('hidden-fab', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open) {
      if (!opened) {
        opened = true;
        addMsg(isiAngka(DATA.chatbot.sapaanAwal), 'ratih');
      }
      setTimeout(() => $('#chatInput').focus(), 200);
    } else {
      fab.focus();
    }
  }

  function init() {
    $('#chatQuick').innerHTML = DATA.chatbot.saran
      .map((s) => `<button type="button" class="chip" data-s="${esc(s)}">${esc(s)}</button>`)
      .join('');
    $('#chatFab').addEventListener('click', () => setOpen(true));
    $('#chatClose').addEventListener('click', () => setOpen(false));
    $('#chatForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#chatInput');
      send(input.value);
      input.value = '';
    });
    $('#chatQuick').addEventListener('click', (e) => {
      const b = e.target.closest('[data-s]');
      if (b) send(b.dataset.s);
    });
    $('#chatMsgs').addEventListener('click', (e) => {
      if (e.target.closest('[data-close]') && window.innerWidth < 640) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('#chatPanel').hidden) setOpen(false);
    });
  }

  return { init, jawab };
})();

/* ---------- Mulai ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof DATA === 'undefined') {
    console.error('data.js belum termuat.');
    return;
  }
  [Nav, Hero, Penerjemah, Kamus, Sejarah, Peta, Marga, Busana, Kuliner, Lagu, Jajuluk, Kuis, Chat]
    .forEach((m) => {
      try {
        m.init();
      } catch (err) {
        console.error('Gagal memuat modul:', err);
      }
    });
  Reveal.init();
});
