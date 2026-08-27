import { SortOption } from "../types/SortOption";

export function buildUrl(baseUrl: string, params: object, sortBy?: SortOption[]): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== 0 && value !== "") {
      if (Array.isArray(value)) {
        value.forEach(item => {
          urlParams.append(key, String(item));
        });
      } else {
        urlParams.append(key, value as string);
      }
    }
  });

  if (sortBy !== undefined && sortBy.length > 0) {
    sortBy.forEach(sortOption => {
      urlParams.append("sortBy", `${sortOption.key}:${sortOption.order}`);
    });
  }

  const queryString = urlParams.toString().replace(/%3A/g, ":").replace(/%5B/g, "[").replace(/%5D/g, "]");
  return queryString !== "" ? `${baseUrl}?${queryString}` : baseUrl;
}

/** Complète une saisie sans schéma (`example.com/...`) pour en faire une URL absolue en `https://`. Renvoie `""` si vide. */
export const normalizeUrl = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

/** Domaine affichable d'une URL, sans `www.`. Renvoie la saisie brute si elle est illisible. */
export const getUrlHostname = (value: string): string => {
  try {
    return new URL(normalizeUrl(value)).hostname.replace(/^www\./i, "");
  } catch {
    return value;
  }
};

export interface HttpUrlOptions {
  /** Autorise les hôtes sans point (`localhost`, alias de dev). Défaut : `false` (une URL publique a un domaine). */
  allowLocalhost?: boolean;
}

/** Vrai si la saisie, une fois normalisée, est une URL http(s) exploitable. Rejette `localhost` sauf `allowLocalhost`. */
export const isValidHttpUrl = (value: string, options: HttpUrlOptions = {}): boolean => {
  const normalized = normalizeUrl(value);
  if (normalized === "") {
    return false;
  }

  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    // Un hôte sans point (« localhost », une faute de frappe) est refusé par défaut.
    return options.allowLocalhost === true || url.hostname.includes(".");
  } catch {
    return false;
  }
};
