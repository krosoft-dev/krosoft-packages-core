import { getLocale } from "./locale.helper";

export const formatFullDateTime = (dateString: string | null | undefined, locale: string = getLocale()): string => {
  if (dateString === null || dateString === undefined || dateString === "") {
    return "";
  }

  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
export const formatShortDateTime = (dateString: string | null | undefined, locale: string = getLocale()): string => {
  if (dateString === null || dateString === undefined || dateString === "") {
    return "";
  }

  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatShortDate = (dateString: string | null | undefined, locale: string = getLocale()): string => {
  if (dateString === null || dateString === undefined || dateString === "") {
    return "";
  }

  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export const formatShortDateTimeNoSeconds = (dateString: string | null | undefined, locale: string = getLocale()): string => {
  if (dateString === null || dateString === undefined || dateString === "") {
    return "";
  }

  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Date et heure lisibles (ex : « 6 août à 05:40 ») : les étapes d'un suivi de colis se lisent à l'heure près. */
export const formatDateTime = (date: Date | string, locale: string = getLocale()): string =>
  new Date(date).toLocaleString(locale, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

/** Mois et année en toutes lettres (ex : « août 2026 ») : en-têtes de planning, sélecteurs de mois. */
export const formatMonthYear = (date: Date | string | null | undefined, locale: string = getLocale()): string => {
  if (date === null || date === undefined || date === "") {
    return "";
  }

  return new Date(date).toLocaleDateString(locale, { month: "long", year: "numeric" });
};

/** Format attendu par un `<input type="date">`, en heure locale (pas d'ISO/UTC qui décale à la veille). */
export const toInputDate = (date: Date | string): string => {
  const value = typeof date === "string" ? new Date(date) : date;

  return `${String(value.getFullYear())}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

export const formatTimeSpan = (timeSpan: string | null | undefined): string => {
  if (timeSpan === null || timeSpan === undefined || timeSpan === "") {
    return "";
  }

  // Format attendu: "0:00:00:28.7797708" (jours:heures:minutes:secondes.millisecondes)
  const parts = timeSpan.split(":");
  const seconds = parts[parts.length - 1].split(".")[0];
  const minutes = parts[parts.length - 2];
  const hours = parts[parts.length - 3];
  const days = parts[parts.length - 4];

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
