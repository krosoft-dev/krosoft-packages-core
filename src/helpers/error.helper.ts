import { ErrorHttp } from "../types/api/ErrorHttp";

const DEFAULT_MESSAGE = "Request failed";
const UNKNOWN_MESSAGE = "Erreur inconnue";

/** Libellés lisibles par code HTTP, en dernier recours quand l'erreur ne porte aucun message exploitable. */
const HTTP_MESSAGES = new Map<number, string>([
  [403, "Accès refusé"],
  [404, "Ressource introuvable"],
  [500, "Une erreur interne est survenue"],
]);

/** Code réservé aux erreurs qui n'ont jamais atteint l'API (aucun statut HTTP disponible). */
export const NETWORK_ERROR_CODE = 0;

const isErrorHttp = (e: unknown): e is ErrorHttp => typeof e === "object" && e !== null && !(e instanceof Error) && ("code" in e || "message" in e);

export const extractErrors = (error: unknown): string[] => {
  if (isErrorHttp(error) && (error.code === 400 || error.code === 500)) {
    if (error.errors !== null && error.errors !== undefined) {
      return error.errors;
    }
  }

  return [];
};

/** Stringify brut d'une valeur levée : `message` si c'est une `Error`, sinon `String(error)`. */
export const getMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

/**
 * Message affichable quel que soit ce qui a été levé : `ErrorHttp` de l'API, `Error` native, chaîne ou valeur inconnue.
 * Priorité : liste `errors` jointe → `message` exploitable → libellé par code HTTP → fallback générique.
 */
export const getErrorMessage = (error: unknown): string => {
  if (isErrorHttp(error)) {
    const errors = error.errors ?? [];
    if (errors.length > 0) {
      return errors.join(" • ");
    }

    const message = error.message?.trim();
    if (message !== undefined && message !== "") {
      return message;
    }

    return (error.code !== undefined ? HTTP_MESSAGES.get(error.code) : undefined) ?? UNKNOWN_MESSAGE;
  }

  if (error instanceof Error) {
    return error.message !== "" ? error.message : UNKNOWN_MESSAGE;
  }
  if (typeof error === "string" && error.trim() !== "") {
    return error;
  }

  return UNKNOWN_MESSAGE;
};

/**
 * Normalise une réponse d'API `{ Code, Message, Errors }` (casse Pascal ou camel) en `ErrorHttp`.
 * `Message` ne porte souvent que le libellé du statut HTTP ("Forbidden"...) : le détail exploitable
 * est dans `Errors`, qu'on expose donc comme message affiché tout en conservant la liste complète.
 */
export const toErrorHttp = (status: number, data: unknown): ErrorHttp => {
  const payload = (data ?? {}) as Record<string, unknown>;
  const errors = readErrors(payload);
  const message = readMessage(payload);

  return {
    code: readCode(payload) ?? status,
    message: errors.length > 0 ? errors.join(" ") : (message ?? DEFAULT_MESSAGE),
    errors: errors.length > 0 ? errors : null,
  };
};

/** Vrai si l'erreur est une erreur réseau (jamais parvenue à l'API : voir `NETWORK_ERROR_CODE`). */
export const isErrorNetwork = (error: unknown): boolean => isErrorHttp(error) && error.code === NETWORK_ERROR_CODE;

/**
 * `fetch` rejette avec un `TypeError` opaque ("Failed to fetch") dès que la requête n'aboutit pas :
 * blocage CORS, API arrêtée, DNS/URL erronée, certificat HTTPS refusé ou poste hors ligne. Le navigateur
 * réserve le détail à la console : on reconstruit ici un message exploitable. Navigateur uniquement (lit `navigator`/`window`).
 */
export const toErrorNetwork = (url: string, method: string): ErrorHttp => {
  const target = `${method.toUpperCase()} ${url}`;

  return {
    code: NETWORK_ERROR_CODE,
    message: `Impossible de joindre l'API (${target}) : ${readNetworkCause(url)}`,
    errors: null,
  };
};

const readCode = (payload: Record<string, unknown>): number | null => {
  const code = payload.Code ?? payload.code;
  return typeof code === "number" ? code : null;
};

const readMessage = (payload: Record<string, unknown>): string | null => {
  const message = payload.Message ?? payload.message;
  return typeof message === "string" && message.trim() !== "" ? message : null;
};

const readErrors = (payload: Record<string, unknown>): string[] => {
  const errors = payload.Errors ?? payload.errors;
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors.filter((error): error is string => typeof error === "string" && error.trim() !== "");
};

const readNetworkCause = (url: string): string => {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "votre poste est hors ligne, vérifiez votre connexion réseau.";
  }

  const origin = typeof window !== "undefined" ? window.location.origin : null;
  const apiOrigin = readOrigin(url);

  if (origin !== null && apiOrigin !== null && apiOrigin !== origin) {
    return `la requête a été bloquée avant toute réponse. Causes probables : CORS (l'API doit autoriser l'origine ${origin} via Access-Control-Allow-Origin et répondre au préflight OPTIONS), API arrêtée ou injoignable, certificat HTTPS invalide.`;
  }

  return "la requête a été bloquée avant toute réponse. Causes probables : API arrêtée ou injoignable, URL incorrecte, certificat HTTPS invalide.";
};

const readOrigin = (url: string): string | null => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};
