/* Gambar pratinjau tautan (Open Graph 1200×630) bergaya marun-emas untuk halaman mandiri */
import { ImageResponse } from 'next/og';

export const UKURAN_OG = { width: 1200, height: 630 };

interface Kartu {
  label: string;
  judul: string;
  sub?: string;
  isi?: string;
  /** data URL foto (opsional), tampil di sisi kanan */
  foto?: string;
}

const potong = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function kartuOg({ label, judul, sub, isi, foto }: Kartu): ImageResponse {
  const ukuranJudul = foto ? (judul.length > 11 ? 58 : 72) : judul.length > 22 ? 64 : judul.length > 14 ? 84 : 108;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #140706 0%, #2a0d0c 55%, #4a1418 100%)',
          color: '#FDFBF7',
          padding: 56,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid rgba(212,175,55,0.55)',
            borderRadius: 28,
            padding: '48px 52px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: '#E5C158', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ display: 'flex', flex: 1, gap: 44, marginTop: 24, overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', fontSize: ukuranJudul, fontWeight: 700, color: '#E5C158', lineHeight: 1.05 }}>{potong(judul, 40)}</div>
              {sub && <div style={{ display: 'flex', fontSize: foto ? 32 : 36, marginTop: 18, lineHeight: 1.25 }}>{potong(sub, 90)}</div>}
              {isi && <div style={{ display: 'flex', fontSize: foto ? 24 : 26, marginTop: foto ? 16 : 22, color: 'rgba(253,251,247,0.72)', lineHeight: 1.4 }}>{potong(isi, foto ? 78 : 190)}</div>}
            </div>
            {foto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={foto} alt="" width={290} height={290} style={{ borderRadius: 24, objectFit: 'cover', border: '2px solid rgba(212,175,55,0.55)' }} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: 'rgba(253,251,247,0.65)' }}>
            <div style={{ display: 'flex' }}>Dang Lupa ko Komering</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} style={{ width: 16, height: 16, transform: 'rotate(45deg)', background: i % 2 ? '#8E2429' : '#D4AF37' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    UKURAN_OG,
  );
}
