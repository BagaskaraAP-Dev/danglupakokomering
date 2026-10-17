/* Generator jajuluk (gelar adat) — pola kamus KOM-K01424: dua kata seperti
   "Mangku Alam" / "Satria Bangsawan"; gelar istri = "Nai" + gelar suami. */
import { DATA, type KataJajuluk } from './konten';
import { hashStr, norm } from './teks';

export type Gender = 'L' | 'P';

export interface HasilJajuluk {
  nama: string;
  judul: string;
  pasangan: string;
  doa: string;
  makna: KataJajuluk[];
}

export function buatJajuluk(nama: string, gender: Gender, sifatKey: string, salt: number): HasilJajuluk {
  const J = DATA.jajuluk;
  const h = hashStr(`${norm(nama)}|${gender}|${sifatKey}|${salt}`);
  const daftar = J.sifat[sifatKey].kata;
  const sifat = daftar[h % daftar.length];
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

function bungkus(g: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = [];
  let line = '';
  text.split(' ').forEach((w) => {
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

/** Gambar kartu jajuluk 1080×1350 bernuansa songket lalu kembalikan sebagai PNG */
export async function gambarKartu(r: HasilJajuluk, fontDisplay: string, fontSans: string): Promise<Blob | null> {
  try {
    await Promise.all([
      document.fonts.load(`800 80px ${fontDisplay}`),
      document.fonts.load(`italic 600 56px ${fontDisplay}`),
      document.fonts.load(`600 30px ${fontSans}`),
    ]);
  } catch {
    /* font cadangan dipakai */
  }

  const W = 1080;
  const H = 1350;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  if (!g) return null;
  const serif = `${fontDisplay}, Georgia, serif`;
  const sans = `${fontSans}, sans-serif`;

  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2D100E');
  bg.addColorStop(1, '#140706');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  // Pola songket belah ketupat
  g.strokeStyle = 'rgba(212,175,55,0.10)';
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
  glow.addColorStop(0, 'rgba(229,193,88,0.22)');
  glow.addColorStop(1, 'rgba(229,193,88,0)');
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  g.strokeStyle = '#D4AF37';
  g.lineWidth = 6;
  g.strokeRect(40, 40, W - 80, H - 80);
  g.lineWidth = 2;
  g.strokeRect(62, 62, W - 124, H - 124);

  // Tumpal atas & bawah
  g.fillStyle = 'rgba(212,175,55,0.8)';
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
  g.fillStyle = '#E5C158';
  g.font = `700 30px ${sans}`;
  g.fillText('◆  JAJULUK KOMERING  ◆', W / 2, y);

  y += 120;
  g.fillStyle = 'rgba(253,251,247,0.72)';
  g.font = `500 32px ${sans}`;
  g.fillText('Dianugerahkan kepada', W / 2, y);
  y += 78;
  g.fillStyle = '#FDFBF7';
  g.font = `italic 600 60px ${serif}`;
  g.fillText(r.nama, W / 2, y);

  y += 50;
  g.strokeStyle = 'rgba(229,193,88,0.5)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(W / 2 - 160, y);
  g.lineTo(W / 2 + 160, y);
  g.stroke();

  const emas = g.createLinearGradient(160, 0, W - 160, 0);
  emas.addColorStop(0, '#F6E7B4');
  emas.addColorStop(0.5, '#E5C158');
  emas.addColorStop(1, '#D4AF37');
  g.fillStyle = emas;
  g.font = `800 92px ${serif}`;
  y += 120;
  bungkus(g, r.judul, W - 240).forEach((ln) => {
    g.fillText(ln, W / 2, y);
    y += 104;
  });

  g.font = `600 26px ${sans}`;
  g.fillStyle = 'rgba(253,251,247,0.55)';
  g.fillText(r.pasangan, W / 2, y - 40);

  y += 30;
  g.font = `500 30px ${sans}`;
  g.fillStyle = 'rgba(253,251,247,0.8)';
  r.makna.forEach((p) => {
    bungkus(g, `${p.kata} — ${p.arti}`, W - 260).forEach((ln) => {
      g.fillText(ln, W / 2, y);
      y += 44;
    });
    y += 6;
  });

  y += 30;
  g.fillStyle = 'rgba(253,251,247,0.7)';
  g.font = `italic 600 32px ${serif}`;
  bungkus(g, `“${r.doa}”`, W - 280).forEach((ln) => {
    g.fillText(ln, W / 2, y);
    y += 46;
  });

  g.fillStyle = '#E5C158';
  g.font = `700 30px ${serif}`;
  g.fillText('Dang Lupa ko Komering', W / 2, H - 150);
  g.fillStyle = 'rgba(253,251,247,0.55)';
  g.font = `500 22px ${sans}`;
  g.fillText(`${DATA.meta.acara} · kreasi edukatif`, W / 2, H - 112);

  return new Promise((res) => c.toBlob(res, 'image/png'));
}
