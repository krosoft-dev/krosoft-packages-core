export function hexToRgba(hex: string | null | undefined, alpha: number): string {
  if (hex === null || hex === undefined || hex === "" || hex.length < 7) return `rgba(0,16,49,${String(alpha / 100)})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(alpha / 100)})`;
}

/** Noir (`#000000`) ou blanc (`#FFFFFF`) selon la luminance perçue de `hex`, pour un texte lisible sur ce fond. */
export function getContrastingColor(hex: string | null | undefined): string {
  if (hex === null || hex === undefined || hex === "") return "#FFFFFF";

  const value = hex.replace(/^#/, "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  // Luminance perçue (pondération ITU-R BT.601) : l'œil est plus sensible au vert qu'au rouge/bleu.
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155 ? "#000000" : "#FFFFFF";
}
