export const formatFullDateTime = (dateString: string | null | undefined): string => {
  if (dateString === null || dateString === undefined || dateString === "") return "";

  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
export const formatShortDateTime = (dateString: string | null | undefined): string => {
  if (dateString === null || dateString === undefined || dateString === "") return "";

  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatShortDate = (dateString: string | null | undefined): string => {
  if (dateString === null || dateString === undefined || dateString === "") return "";

  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export const formatShortDateTimeNoSeconds = (dateString: string | null | undefined): string => {
  if (dateString === null || dateString === undefined || dateString === "") return "";

  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTimeSpan = (timeSpan: string | null | undefined): string => {
  if (timeSpan === null || timeSpan === undefined || timeSpan === "") return "";

  // Format attendu: "0:00:00:28.7797708" (jours:heures:minutes:secondes.millisecondes)
  const parts = timeSpan.split(":");
  const seconds = parts[parts.length - 1].split(".")[0];
  const minutes = parts[parts.length - 2];
  const hours = parts[parts.length - 3];
  const days = parts[parts.length - 4];

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
