/* Penjaga endpoint AI: tolak permintaan lintas situs dan batasi laju per IP.
   Batas laju disimpan di memori instance, jadi sifatnya "usaha terbaik" — cukup untuk
   mencegah satu pengunjung menghabiskan kuota Gemini, bukan pengganti WAF. */

const JENDELA_MS = 60_000;
const riwayat = new Map<string, number[]>();

export const jsonGalat = (pesan: string, status: number) => Response.json({ galat: pesan }, { status });

export function periksaPermintaan(req: Request, maksPerMenit: number): Response | null {
  const asal = req.headers.get('origin');
  if (asal) {
    try {
      if (new URL(asal).host !== req.headers.get('host')) return jsonGalat('Asal permintaan tidak diizinkan.', 403);
    } catch {
      return jsonGalat('Asal permintaan tidak valid.', 403);
    }
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'lokal';
  const kini = Date.now();
  const jejak = (riwayat.get(ip) ?? []).filter((t) => kini - t < JENDELA_MS);
  if (jejak.length >= maksPerMenit) return jsonGalat('Terlalu banyak pertanyaan. Tunggu sebentar, ya.', 429);
  jejak.push(kini);
  if (riwayat.size > 5000) riwayat.clear();
  riwayat.set(ip, jejak);
  return null;
}

export async function bacaJson(req: Request): Promise<Record<string, unknown> | null> {
  if (Number(req.headers.get('content-length') ?? 0) > 16_000) return null;
  try {
    const isi: unknown = await req.json();
    return isi && typeof isi === 'object' && !Array.isArray(isi) ? (isi as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
