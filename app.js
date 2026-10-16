/* =============================================================================
   Dang Lupa ko Komering — app.js
   Logika interaktif: AI Translator (NLP lokal), TTS, Kamus, Sejarah, Peta,
   Marga, Busana & Adat, Kuliner, Audio Player (Web Audio), Generator Jajuluk,
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
      kamus: DATA.kamus.length + DATA.frasa.length,
      marga: DATA.marga.length,
      kuis: DATA.kuis.length,
      kab: 4,
    };
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

function countUp(el, target) {
  if (reduceMotion) {
    el.textContent = target;
    return;
  }
  const t0 = performance.now();
  const dur = 1200;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* =============================================================================
   AI PENERJEMAH — mesin NLP ringan di browser
   1) Pencocokan frasa terpanjang (n-gram) dari kamus + frasa
   2) Stemming Bahasa Indonesia (imbuhan me-, ber-, di-, -kan, -an, -nya, …)
   3) Akhiran kepemilikan: -ku, -mu, -nya ⇄ -ku, -mu, -ni
   4) Reduplikasi (jama-jama) dan pola "sangat X" → "X nihan"
   5) Koreksi ejaan dengan jarak Levenshtein
   6) Skor keyakinan berbobot per kata
   ============================================================================= */
const Penerjemah = (() => {
  const dict = { id: new Map(), km: new Map() };
  const maxLen = { id: 1, km: 1 };
  const same = new Set(DATA.kataSama.map(norm));
  const LABEL = { id: 'Bahasa Indonesia', km: 'Basa Kumoring' };
  const BOBOT = { exact: 1, same: 1, stem: 0.8, fuzzy: 0.6, unknown: 0 };
  const SUFIKS = {
    id: [['nya', 'ni'], ['ku', 'ku'], ['mu', 'mu'], ['lah', ''], ['kah', ''], ['pun', '']],
    km: [['ni', 'nya'], ['ku', 'ku'], ['mu', 'mu']],
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

  function add(lang, key, out) {
    const k = norm(key);
    if (!k || dict[lang].has(k)) return;
    dict[lang].set(k, out);
    maxLen[lang] = Math.max(maxLen[lang], k.split(' ').length);
  }

  function build() {
    [...DATA.frasa, ...DATA.kamus].forEach((e) => {
      const ids = e.id.split('|').map((s) => s.trim());
      const kms = e.km.split('|').map((s) => s.trim());
      ids.forEach((k) => add('id', k, kms[0]));
      kms.forEach((k) => add('km', k, ids[0]));
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
      if (dict.id.has(c)) return { out: dict.id.get(c), base: c };
    }
    return null;
  }

  function fuzzy(w, lang) {
    if (w.length < 5) return null;
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
    if (d.has(w)) return { out: d.get(w), type: 'exact' };
    if (same.has(w)) return { out: w, type: 'same' };

    for (const [suf, ganti] of SUFIKS[lang]) {
      if (w.length <= suf.length + 2 || !w.endsWith(suf)) continue;
      const base = w.slice(0, -suf.length);
      let hit = null;
      if (d.has(base)) hit = { out: d.get(base) };
      else if (same.has(base)) hit = { out: base };
      else if (lang === 'id') hit = derive(base);
      if (hit) return { out: hit.out + ganti, type: 'stem', base: hit.base || base };
    }

    if (lang === 'id') {
      const hit = derive(w);
      if (hit) return { ...hit, type: 'stem' };
    }

    const fz = fuzzy(w, lang);
    if (fz) return { out: d.get(fz), type: 'fuzzy', base: fz };
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
        const out = dict[from].get(norm(src));
        if (out) {
          segs.push({ src, out, type: 'exact', cap: isCap(tk.t) });
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

  /* Tebak bahasa: jumlah kata yang cocok persis (frasa dihitung per kata).
     Contoh "api kabar": frasa Komering (2 kata) mengalahkan "api" Indonesia (1). */
  function detect(text) {
    const score = (lang) => translate(text, lang).segs
      .reduce((a, s) => a + (s.type === 'exact' ? s.src.split(/\s+/).length : 0), 0);
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
      ? 'Ketik kalimat… contoh: Saya mau makan pindang ikan'
      : 'Ketik Basa Kumoring… contoh: Nyak haga mangan';
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
      stem: 'dari kata dasar',
      fuzzy: 'koreksi ejaan',
      unknown: 'belum dikenal',
    };
    $('#trBreakdown').innerHTML = res.segs
      .filter((s) => s.type !== 'punct')
      .map((s, k) => {
        const hint = s.type === 'fuzzy' ? `maksudmu “${s.base}”?` : s.type === 'stem' && s.base ? `dasar: ${s.base}` : note[s.type];
        return `<span class="seg ${s.type}" style="animation-delay:${k * 40}ms" title="${esc(note[s.type])}">
          <small>${esc(s.src)}</small><b>${esc(s.out)}</b><small>${esc(hint)}</small></span>`;
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

/* ---------- Kamus mini & kata hari ini ---------- */
const Kamus = (() => {
  const PER_PAGE = 12;
  let kat = 'semua';
  let query = '';
  let shown = PER_PAGE;

  const primary = (s) => s.split('|')[0];
  const alt = (s) => s.split('|').slice(1).join(', ');

  function filtered() {
    const q = norm(query);
    return DATA.kamus.filter((e) => {
      if (kat !== 'semua' && e.kat !== kat) return false;
      if (!q) return true;
      return norm(e.id).includes(q) || norm(e.km).includes(q);
    });
  }

  function card(e) {
    const contoh = e.contoh
      ? `<p class="text-xs mt-3 pt-3 border-t italic" style="border-color:var(--garis);color:var(--teks-samar)">
           “${esc(e.contoh[0])}”<br><span class="not-italic">${esc(e.contoh[1])}</span></p>`
      : '';
    const alternatif = alt(e.id) ? `<span style="color:var(--teks-samar)"> · ${esc(alt(e.id))}</span>` : '';
    return `<article class="kamus-card glass">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="font-display text-xl font-bold text-emas-300 break-words">${esc(primary(e.km))}</p>
          <p class="text-sm mt-0.5" style="color:var(--teks-redup)">${esc(primary(e.id))}${alternatif}</p>
        </div>
        <button class="icon-btn sm" data-say="${esc(primary(e.km))}" aria-label="Dengarkan ${esc(primary(e.km))}">${icon('volume')}</button>
      </div>
      <span class="tag mt-3">${esc(DATA.kategori[e.kat] || e.kat)}</span>
      ${contoh}
    </article>`;
  }

  function render() {
    const list = filtered();
    $('#kamusList').innerHTML = list.length
      ? list.slice(0, shown).map(card).join('')
      : '<p class="col-span-full text-center py-8" style="color:var(--teks-samar)">Kata tidak ditemukan. Coba kata lain, ya!</p>';
    $('#kamusMore').classList.toggle('is-hidden', shown >= list.length);
  }

  function wordOfDay() {
    const pool = DATA.kamus.filter((e) => e.contoh);
    const now = new Date();
    const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const e = pool[day % pool.length];
    $('#wotdKm').textContent = primary(e.km);
    $('#wotdId').textContent = `Artinya: ${primary(e.id)}`;
    $('#wotdContoh').textContent = `“${e.contoh[0]}” — ${e.contoh[1]}`;
    $('#wotdSpeak').addEventListener('click', (ev) => Suara.speak(`${primary(e.km)}. ${e.contoh[0]}`, { btn: ev.currentTarget }));
  }

  function init() {
    const cats = { semua: 'Semua', ...DATA.kategori };
    $('#kamusFilter').innerHTML = Object.entries(cats)
      .map(([k, v]) => `<button type="button" class="chip${k === kat ? ' active' : ''}" data-kat="${k}" aria-pressed="${k === kat}">${esc(v)}</button>`)
      .join('');
    $('#kamusFilter').addEventListener('click', (e) => {
      const b = e.target.closest('[data-kat]');
      if (!b) return;
      kat = b.dataset.kat;
      shown = PER_PAGE;
      $$('#kamusFilter .chip').forEach((c) => {
        c.classList.toggle('active', c === b);
        c.setAttribute('aria-pressed', String(c === b));
      });
      render();
    });
    $('#kamusSearch').addEventListener('input', (e) => {
      query = e.target.value;
      shown = PER_PAGE;
      render();
    });
    $('#kamusMore').addEventListener('click', () => {
      shown += PER_PAGE;
      render();
    });
    $('#kamusList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-say]');
      if (b) Suara.speak(b.dataset.say, { btn: b });
    });
    render();
    wordOfDay();
  }

  return { init };
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

    $('#adatSteps').innerHTML = DATA.adatPernikahan.map((s, i) => `
      <li class="glass rounded-2xl p-5 reveal ${i ? `d${Math.min(i, 3)}` : ''}">
        <div class="flex items-center gap-3">
          <span class="step-num" aria-hidden="true">${s.ikon}</span>
          <span class="text-xs font-bold tracking-widest text-emas-400">TAHAP ${i + 1}</span>
        </div>
        <h4 class="font-display text-lg font-bold text-white mt-4">${esc(s.judul)}</h4>
        <p class="text-sm leading-relaxed mt-2" style="color:var(--teks-redup)">${esc(s.isi)}</p>
      </li>`).join('');
  },
};

/* ---------- Kuliner ---------- */
const Kuliner = {
  init() {
    const grid = $('#kulinerGrid');
    grid.innerHTML = DATA.kuliner.map((k, i) => `
      <article class="flip-card reveal ${i % 3 ? `d${i % 3}` : ''}" tabindex="0" role="button" aria-pressed="false"
        aria-label="${esc(k.nama)} — ketuk untuk melihat resep">
        <div class="flip-inner">
          <div class="flip-face glass">
            <div class="food-emoji" aria-hidden="true">${k.emoji}</div>
            <span class="tag mt-5 self-start">${esc(k.jenis)}</span>
            <h3 class="font-display text-2xl font-bold text-white mt-3">${esc(k.nama)}</h3>
            <p class="text-sm leading-relaxed mt-2 flex-1" style="color:var(--teks-redup)">${esc(k.isi)}</p>
            <p class="text-xs font-bold text-emas-400 mt-4 flex items-center gap-1.5">Lihat resep ${icon('arrow')}</p>
          </div>
          <div class="flip-face flip-back glass-strong">
            <p class="eyebrow">Bahan</p>
            <ul class="mt-3 space-y-1.5 text-sm" style="color:var(--teks-redup)">
              ${k.bahan.map((b) => `<li class="flex gap-2"><span class="text-emas-400">◆</span>${esc(b)}</li>`).join('')}
            </ul>
            <p class="eyebrow mt-5">Cara Singkat</p>
            <p class="text-sm leading-relaxed mt-2" style="color:var(--teks-redup)">${esc(k.cara)}</p>
          </div>
        </div>
      </article>`).join('');

    const flip = (card) => {
      const on = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', String(on));
    };
    grid.addEventListener('click', (e) => {
      const c = e.target.closest('.flip-card');
      if (c) flip(c);
    });
    grid.addEventListener('keydown', (e) => {
      const c = e.target.closest('.flip-card');
      if (c && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        flip(c);
      }
    });
  },
};

/* =============================================================================
   PEMUTAR LAGU — musik disintesis dengan Web Audio API
   Melodi petik (tangga nada pentatonik), bas, gendang "dum" & rebana "tak",
   dijadwalkan dengan lookahead scheduler; lirik tersorot mengikuti waktu.
   ============================================================================= */
const Lagu = (() => {
  const L = DATA.lagu;
  const BEAT = 60 / L.bpm;
  const NADA = [293.66, 329.63, 349.23, 440.0, 466.16, 587.33, 659.26, 698.46, 880.0]; // D E F A Bb D' E' F' A'
  const AKAR = [73.42, 87.31, 110.0, 116.54]; // D F A Bb (oktaf rendah)
  const events = [];
  const lines = [];
  let total = 0;

  let ctx = null;
  let comp = null;
  let bus = null;
  let noise = null;
  let playing = false;
  let startAt = 0;
  let offset = 0;
  let next = 0;
  let timer = 0;
  let raf = 0;
  let activeLine = -1;

  function compose() {
    let t = 0;
    const melodi = (mel, t0) => {
      let tt = t0;
      mel.forEach(([n, b]) => {
        events.push({ t: tt, k: 'petik', f: NADA[n], d: b * BEAT });
        tt += b * BEAT;
      });
    };
    const iringan = (t0, beats, akar) => {
      events.push({ t: t0, k: 'bas', f: AKAR[akar], d: beats * BEAT });
      for (let i = 0; i < beats; i++) {
        const tt = t0 + i * BEAT;
        if (i % 4 === 0) events.push({ t: tt, k: 'dum', v: 1 });
        else if (i % 4 === 2) events.push({ t: tt, k: 'dum', v: 0.55 });
        else events.push({ t: tt, k: 'tak', v: 0.9 });
        events.push({ t: tt + BEAT / 2, k: 'tak', v: 0.35 });
      }
    };

    melodi(L.intro, t);
    iringan(t, 8, 0);
    t += 8 * BEAT;

    L.urutan.forEach((bi) => {
      const bag = L.bagian[bi];
      bag.baris.forEach((b, j) => {
        lines.push({ start: t, end: t + 8 * BEAT, km: b.km, id: b.id, label: j === 0 ? bag.label : null });
        melodi(b.mel, t);
        iringan(t, 8, b.akar);
        t += 8 * BEAT;
      });
    });

    // Penutup
    events.push({ t, k: 'petik', f: NADA[0], d: 4 * BEAT }, { t, k: 'petik', f: NADA[5], d: 4 * BEAT });
    events.push({ t, k: 'bas', f: AKAR[0], d: 4 * BEAT }, { t, k: 'dum', v: 1 });
    t += 4 * BEAT;
    total = t;
    events.sort((a, b) => a.t - b.t);
  }

  function ensureCtx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      Toast.show('Browser ini belum mendukung Web Audio.');
      return false;
    }
    ctx = new AC();
    comp = ctx.createDynamicsCompressor();
    comp.connect(ctx.destination);
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
    const ch = noise.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    return true;
  }

  function env(g, when, peak, attack, release) {
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + release);
  }

  function petik(f, when, d) {
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = f;
    o2.type = 'sine';
    o2.frequency.value = f * 2.005;
    g2.gain.value = 0.3;
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(f * 8, when);
    lp.frequency.exponentialRampToValueAtTime(f * 2, when + 0.4);
    const rel = clamp(d * 1.2, 0.4, 1.6);
    env(g, when, 0.22, 0.008, rel);
    o.connect(lp);
    o2.connect(g2).connect(lp);
    lp.connect(g).connect(bus);
    o.start(when);
    o2.start(when);
    o.stop(when + rel + 0.05);
    o2.stop(when + rel + 0.05);
  }

  function bas(f, when, d) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.16, when + 0.05);
    g.gain.setValueAtTime(0.16, when + d * 0.75);
    g.gain.exponentialRampToValueAtTime(0.0001, when + d);
    o.connect(g).connect(bus);
    o.start(when);
    o.stop(when + d + 0.05);
  }

  function dum(when, v) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, when);
    o.frequency.exponentialRampToValueAtTime(55, when + 0.18);
    env(g, when, 0.55 * v, 0.004, 0.28);
    o.connect(g).connect(bus);
    o.start(when);
    o.stop(when + 0.35);
  }

  function tak(when, v) {
    const s = ctx.createBufferSource();
    const bp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    s.buffer = noise;
    bp.type = 'bandpass';
    bp.frequency.value = 2600;
    bp.Q.value = 1.2;
    env(g, when, 0.12 * v, 0.002, 0.07);
    s.connect(bp).connect(g).connect(bus);
    s.start(when);
    s.stop(when + 0.1);
  }

  function schedule() {
    const horizon = ctx.currentTime + 0.15;
    while (next < events.length && startAt + events[next].t < horizon) {
      const e = events[next++];
      const when = Math.max(ctx.currentTime, startAt + e.t);
      if (e.k === 'petik') petik(e.f, when, e.d);
      else if (e.k === 'bas') bas(e.f, when, e.d);
      else if (e.k === 'dum') dum(when, e.v);
      else tak(when, e.v);
    }
  }

  const position = () => (playing ? clamp(ctx.currentTime - startAt, 0, total) : offset);

  async function play() {
    if (playing || !ensureCtx()) return;
    playing = true; // diklaim lebih awal agar klik ganda tidak memulai dua kali
    Suara.stop();
    if (ctx.state === 'suspended') await ctx.resume();
    if (offset >= total) offset = 0;
    bus = ctx.createGain();
    bus.gain.value = 0.9;
    bus.connect(comp);
    startAt = ctx.currentTime + 0.05 - offset;
    next = events.findIndex((e) => e.t >= offset - 1e-3);
    if (next < 0) next = events.length;
    schedule();
    timer = setInterval(schedule, 25);
    tick();
  }

  function halt() {
    playing = false;
    clearInterval(timer);
    cancelAnimationFrame(raf);
    if (bus) {
      const b = bus;
      b.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
      setTimeout(() => b.disconnect(), 300);
      bus = null;
    }
    updateUI();
  }

  function pause() {
    if (!playing) return;
    offset = position();
    halt();
  }

  function seek(sec) {
    const was = playing;
    if (playing) halt();
    offset = clamp(sec, 0, total);
    if (was) play();
    else updateUI();
  }

  function tick() {
    if (position() >= total) {
      halt();
      offset = 0;
      updateUI();
      return;
    }
    updateUI();
    raf = requestAnimationFrame(tick);
  }

  function lineAt(pos) {
    return lines.findIndex((l) => pos >= l.start && pos < l.end);
  }

  function updateUI() {
    const pos = position();
    const seekEl = $('#laguSeek');
    seekEl.value = pos.toFixed(1);
    seekEl.style.setProperty('--pct', `${(pos / total) * 100}%`);
    $('#laguNow').textContent = fmtTime(pos);
    $('#vinyl').classList.toggle('playing', playing);
    const btn = $('#laguPlay');
    btn.innerHTML = icon(playing ? 'pause' : 'play');
    btn.setAttribute('aria-label', playing ? 'Jeda lagu' : 'Putar lagu');

    const idx = lineAt(pos);
    if (idx !== activeLine) {
      activeLine = idx;
      $$('#lyrics .lyric-line').forEach((el, i) => el.classList.toggle('active', i === idx));
      if (idx >= 0) {
        const box = $('#lyrics');
        const el = box.querySelectorAll('.lyric-line')[idx];
        box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
  }

  function renderLyrics() {
    $('#lyrics').innerHTML = lines.map((l, i) => `
      ${l.label ? `<p class="lyric-label">${esc(l.label)}</p>` : ''}
      <button type="button" class="lyric-line" data-line="${i}">
        <span class="km">${esc(l.km)}</span>
        <span class="id">${esc(l.id)}</span>
      </button>`).join('');
  }

  function init() {
    compose();
    renderLyrics();
    $('#laguKet').textContent = L.keterangan;
    $('#laguDur').textContent = fmtTime(total);
    $('#laguSeek').max = total.toFixed(1);
    updateUI();

    $('#laguPlay').addEventListener('click', () => (playing ? pause() : play()));
    $('#laguSeek').addEventListener('input', (e) => seek(Number(e.target.value)));
    $('#laguPrev').addEventListener('click', () => {
      const i = lineAt(position());
      seek(i > 0 ? lines[i - 1].start : 0);
    });
    $('#laguNext').addEventListener('click', () => {
      const i = lineAt(position());
      if (i < lines.length - 1) seek(lines[i + 1].start);
    });
    $('#lyrics').addEventListener('click', (e) => {
      const b = e.target.closest('[data-line]');
      if (!b) return;
      seek(lines[Number(b.dataset.line)].start);
      if (!playing) play();
    });

    const toggleId = $('#laguToggleId');
    toggleId.addEventListener('click', () => {
      const on = toggleId.getAttribute('aria-pressed') !== 'true';
      toggleId.setAttribute('aria-pressed', String(on));
      toggleId.classList.toggle('active', on);
      $('#lyrics').classList.toggle('hide-id', !on);
    });

    const tts = $('#laguTts');
    tts.addEventListener('click', () => {
      if (tts.getAttribute('aria-pressed') === 'true') {
        Suara.stop();
        tts.setAttribute('aria-pressed', 'false');
        return;
      }
      pause();
      tts.setAttribute('aria-pressed', 'true');
      const lirik = [...new Set(lines.map((l) => l.km))].join('. ');
      Suara.speak(lirik, { rate: 0.85, onend: () => tts.setAttribute('aria-pressed', 'false') });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause();
    });
  }

  return { init };
})();

/* ---------- Generator Jajuluk ---------- */
const Jajuluk = (() => {
  const J = DATA.jajuluk;
  let salt = 0;
  let last = null;

  function generate(nama, gender, sifatKey) {
    const h = hashStr(`${norm(nama)}|${gender}|${sifatKey}|${salt}`);
    const gelar = J.gelar[gender][h % J.gelar[gender].length];
    const sifat = J.sifat[sifatKey].kata[(h >>> 8) % J.sifat[sifatKey].kata.length];
    const penutup = J.penutup[(h >>> 16) % J.penutup.length];
    return {
      nama,
      gelar,
      sifat,
      penutup,
      judul: `${gelar.kata} ${sifat.kata} ${penutup.kata}`,
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
      <ul class="mt-6 space-y-2 text-sm max-w-sm mx-auto text-left" style="color:var(--teks-redup)">
        ${[r.gelar, r.sifat, r.penutup].map((p) => `<li class="flex gap-2"><span class="text-emas-400">◆</span><span><strong class="text-emas-200">${esc(p.kata)}</strong> — ${esc(p.arti)}</span></li>`).join('')}
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

    y += 20;
    g.font = '500 30px "Plus Jakarta Sans", sans-serif';
    g.fillStyle = 'rgba(253,246,234,0.8)';
    [r.gelar, r.sifat, r.penutup].forEach((p) => {
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
    if (s >= 8) return { gelar: 'Muli Meranai Pandai', ikon: '🌟', pesan: 'Hebat! Pengetahuanmu tentang Komering sangat baik.' };
    if (s >= 5) return { gelar: 'Sanak Rajin Belajar', ikon: '📚', pesan: 'Bagus! Sedikit lagi menuju gelar tertinggi.' };
    return { gelar: 'Ayo Belajar Lagi', ikon: '🌱', pesan: 'Dang lupa — jelajahi bab-bab di atas lalu coba lagi!' };
  }

  function renderStart() {
    const best = store.get(BEST_KEY, null);
    box().innerHTML = `
      <div class="text-center">
        <div class="text-6xl" aria-hidden="true">🏆</div>
        <h3 class="font-display text-3xl font-bold text-white mt-5">Siap diuji, Sanak?</h3>
        <p class="mt-3" style="color:var(--teks-redup)">${N} soal pilihan ganda diambil acak dari ${DATA.kuis.length} soal. Tiap jawaban disertai penjelasan.</p>
        ${best !== null ? `<p class="mt-4 text-sm text-emas-300 font-semibold">Skor terbaikmu: ${best}/${N}</p>` : ''}
        <button type="button" class="btn-emas mt-8" data-q="start">Mulai Kuis ${icon('arrow')}</button>
      </div>`;
  }

  function start() {
    soal = shuffle(DATA.kuis).slice(0, N).map((q) => ({
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
        <span class="text-emas-400 tracking-widest">SOAL ${idx + 1} / ${N}</span>
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
        <p class="font-bold ${benar ? 'text-green-300' : 'text-red-300'}">${benar ? '✓ Betik nihan! Benar.' : '✗ Belum tepat.'}</p>
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
      ? `<div class="msg-actions">${aksi.map((a) => `<a href="${esc(a.href)}" data-close>${esc(a.label)} →</a>`).join('')}</div>`
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
      let teks = `“${frasa}” dalam ${Penerjemah.LABEL[to]}:\n**${res.text}**\n(keyakinan ${pct}%)`;
      if (asing.length) teks += `\nKata yang belum ada di kamus: ${asing.join(', ')}.`;
      return { oleh: 'ratih', teks, aksi: [{ label: 'Buka Penerjemah', href: '#penerjemah' }], say: to === 'km' ? res.text : null };
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
    if (it) return { oleh: it.oleh, teks: pick(it.jawab), aksi: it.aksi || [] };
    return { oleh: 'ratih', teks: pick(DATA.chatbot.fallback), aksi: [], saran: true };
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
        addMsg(DATA.chatbot.sapaanAwal, 'ratih');
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
