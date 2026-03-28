export function hexToRgba(hex: string | null | undefined, alpha: number): string {
  if (hex === null || hex === undefined || hex === "" || hex.length < 7) return `rgba(0,16,49,${String(alpha / 100)})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(alpha / 100)})`;
}
