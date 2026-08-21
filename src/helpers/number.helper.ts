import { getLocale } from "./locale.helper";

export const formatNumber = (value: number | undefined, locale: string = getLocale()): string => {
  if (value === undefined) return "";
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Suffixes d'ordre de grandeur par langue. Le français garde les siens (o/Ko/Mo/Go)
 * afin que la sortie historique du package reste identique au caractère près ;
 * toute autre langue retombe sur les symboles internationaux.
 */
const SIZE_UNITS: Record<string, readonly [string, string, string, string]> = {
  fr: ["o", "Ko", "Mo", "Go"],
  default: ["B", "KB", "MB", "GB"],
};

const sizeUnits = (locale: string): readonly [string, string, string, string] => SIZE_UNITS[locale.split("-")[0].toLowerCase()] ?? SIZE_UNITS.default;

export const formatSize = (bytes: number, locale: string = getLocale()): string => {
  const [byte, kilo, mega, giga] = sizeUnits(locale);

  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} ${giga}`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} ${mega}`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} ${kilo}`;
  return `${bytes.toString()} ${byte}`;
};
