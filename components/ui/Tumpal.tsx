/** Pembatas bab bermotif tumpal (deret segitiga songket) */
export function Tumpal({ balik = false }: { balik?: boolean }) {
  return <div className={`tumpal ${balik ? 'balik' : ''}`} aria-hidden />;
}
