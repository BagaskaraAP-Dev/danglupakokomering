'use client';

/** "Lewati ke konten utama": memindahkan fokus ke <main id="utama"> tanpa menambah entri riwayat hash.
 *  Entri hash dari <a> biasa tidak punya state router, sehingga Back dari halaman lain tidak memulihkan isi. */
export function TautanLewati() {
  return (
    <a
      href="#utama"
      className="skip-link"
      onClick={(e) => {
        const utama = document.getElementById('utama');
        if (!utama) return;
        e.preventDefault();
        utama.focus({ preventScroll: true });
        utama.scrollIntoView();
      }}
    >
      Lewati ke konten utama
    </a>
  );
}
