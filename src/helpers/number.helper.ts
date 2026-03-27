export const formatNumber = (value: number | undefined): string => {
  if (value === undefined) return "";
  return new Intl.NumberFormat("fr-FR").format(value);
};

export const formatSize = (bytes: number): string => {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} Go`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} Mo`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} Ko`;
  return `${bytes} o`;
};
