export function hexToRgba(hex: string, alpha: number): string {
  if (!hex || hex.length < 7) return `rgba(0,16,49,${alpha / 100})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
}
