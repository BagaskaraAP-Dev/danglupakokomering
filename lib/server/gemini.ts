/* Klien REST Gemini (generateContent) dengan keluaran JSON terstruktur.
   Kunci hanya dibaca di server dari GEMINI_API_KEY; tidak pernah dikirim ke browser.
   Kuota gratis Gemini dihitung per model per hari (±20 permintaan), jadi permintaan
   dicoba berurutan di beberapa model; model yang kena kuota dilewati sampai waktu reset. */

const API = 'https://generativelanguage.googleapis.com/v1beta/models';
const RANTAI_MODEL = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
const BATAS_TOTAL_MS = 25_000;
const BATAS_PERCOBAAN_MS = 14_000;

export class GagalGemini extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly tundaMs = 0,
  ) {
    super(message);
  }
}

export interface Giliran {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface Permintaan {
  sistem: string;
  isi: Giliran[];
  skema: Record<string, unknown>;
  suhu?: number;
  maksToken?: number;
}

/** model → waktu (epoch ms) sampai model itu boleh dicoba lagi */
const diparkir = new Map<string, number>();

/** "19875s" dari RetryInfo → milidetik */
function bacaTunda(detail: string): number {
  const m = detail.match(/"retryDelay":\s*"(\d+(?:\.\d+)?)s"/);
  return m ? Number(m[1]) * 1000 : 60_000;
}

async function panggil(model: string, kunci: string, p: Permintaan, batasMs: number): Promise<unknown> {
  const res = await fetch(`${API}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': kunci },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: p.sistem }] },
      contents: p.isi,
      generationConfig: {
        temperature: p.suhu ?? 0.4,
        maxOutputTokens: p.maksToken ?? 900,
        responseMimeType: 'application/json',
        responseSchema: p.skema,
        thinkingConfig: { thinkingLevel: 'low' },
      },
    }),
    signal: AbortSignal.timeout(batasMs),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new GagalGemini(`HTTP ${res.status}: ${detail.slice(0, 160)}`, res.status, res.status === 429 ? bacaTunda(detail) : 0);
  }
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[] };
  const kandidat = data.candidates?.[0];
  const teks = kandidat?.content?.parts?.map((x) => x.text ?? '').join('') ?? '';
  if (!teks) throw new GagalGemini(`tanpa jawaban (${kandidat?.finishReason ?? 'kosong'})`, 502);
  try {
    return JSON.parse(teks);
  } catch {
    throw new GagalGemini(`JSON tidak valid (${kandidat?.finishReason})`, 502);
  }
}

export async function tanyaGemini(p: Permintaan): Promise<unknown> {
  const kunci = process.env.GEMINI_API_KEY;
  if (!kunci) throw new GagalGemini('GEMINI_API_KEY belum diatur', 503);
  const mulai = Date.now();
  const rantai = [...new Set([process.env.GEMINI_MODEL || RANTAI_MODEL[0], ...RANTAI_MODEL])];
  let galat: unknown = new GagalGemini('semua model sedang kena kuota', 429);

  for (const model of rantai) {
    if ((diparkir.get(model) ?? 0) > Date.now()) continue;
    const sisa = BATAS_TOTAL_MS - (Date.now() - mulai);
    if (sisa < 3_000) break;
    try {
      return await panggil(model, kunci, p, Math.min(BATAS_PERCOBAAN_MS, sisa));
    } catch (err) {
      galat = err;
      console.warn(`[gemini] ${model} gagal:`, err instanceof Error ? `${err.name} ${err.message.slice(0, 120)}` : err);
      const status = err instanceof GagalGemini ? err.status : 504;
      if (err instanceof GagalGemini && status === 429) diparkir.set(model, Date.now() + err.tundaMs);
      if (![404, 429, 500, 502, 503, 504].includes(status)) break;
    }
  }
  throw galat;
}
