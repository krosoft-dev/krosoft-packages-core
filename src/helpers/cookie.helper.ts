/** Options d'écriture d'un cookie. Tout est optionnel : par défaut, cookie de session « host-only ». */
export interface CookieOptions {
  /** Domaine du cookie. Omis → cookie « host-only » (domaine courant uniquement). */
  domain?: string;
  /** Chemin de validité. Défaut « / ». */
  path?: string;
  /** Politique SameSite. Défaut « Lax ». */
  sameSite?: "Strict" | "Lax" | "None";
  /** Ajoute l'attribut `Secure` (implicite et obligatoire quand `sameSite` vaut « None »). */
  secure?: boolean;
  /** Durée de vie en jours. Omis → cookie de session (supprimé à la fermeture du navigateur). */
  days?: number;
  /**
   * Ne pose l'attribut `domain` que s'il correspond au host courant. Sinon (ex. `.test.exemple.fr`
   * sur `localhost`), le navigateur rejetterait le cookie silencieusement : on retombe alors sur un
   * cookie « host-only » plutôt que de perdre l'écriture. Défaut : `false`.
   */
  hostOnlyFallback?: boolean;
}

const DAY_IN_MS = 86_400_000;

const domainMatchesHost = (domain: string): boolean => {
  const host = window.location.hostname;
  const normalized = domain.replace(/^\./, "");

  return host === normalized || host.endsWith(`.${normalized}`);
};

const buildAttributes = ({ domain, path = "/", sameSite = "Lax", secure, days, hostOnlyFallback }: CookieOptions): string => {
  const parts: string[] = [`path=${path}`, `SameSite=${sameSite}`];

  if (domain !== undefined && domain !== "" && (hostOnlyFallback !== true || domainMatchesHost(domain))) {
    parts.push(`domain=${domain}`);
  }
  if (days !== undefined) {
    parts.push(`expires=${new Date(Date.now() + days * DAY_IN_MS).toUTCString()}`);
  }
  if (secure === true || sameSite === "None") {
    parts.push("Secure");
  }

  return parts.map(part => `; ${part}`).join("");
};

/** Lit et décode un cookie par son nom. Renvoie `null` s'il est absent. Navigateur uniquement (DOM requis). */
export const getCookie = (name: string): string | null => {
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));

  return match !== null ? decodeURIComponent(match[1]) : null;
};

/** Écrit un cookie encodé avec les options fournies. Navigateur uniquement (DOM requis). */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  document.cookie = `${name}=${encodeURIComponent(value)}${buildAttributes(options)}`;
};

/** Supprime un cookie (expiration dans le passé). `domain`/`path` doivent correspondre à ceux de l'écriture. */
export const deleteCookie = (name: string, options: Pick<CookieOptions, "domain" | "path"> = {}): void => {
  const { domain, path = "/" } = options;
  const domainPart = domain !== undefined && domain !== "" ? `; domain=${domain}` : "";
  document.cookie = `${name}=; path=${path}${domainPart}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
