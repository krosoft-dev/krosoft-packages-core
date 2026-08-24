export const tryParseJson = (str: string): unknown => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const beautifyJson = (str: string): string => {
  const parsed = tryParseJson(str);
  return JSON.stringify(parsed, null, 2);
};

/** Garde de type : vrai pour un objet non nul (record clé/valeur), faux pour null, tableaux mis à part. */
export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/**
 * Rend une valeur issue de `JSON.parse` sous forme de chaîne affichable :
 * chaîne telle quelle, nombre/booléen convertis, null/undefined en vide, objets/tableaux indentés.
 */
export const formatJsonValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  // Objets et tableaux : la donnée vient de `JSON.parse`, aucune autre valeur
  // (fonction, symbol…) ne peut apparaître ici.
  return JSON.stringify(value, null, 2);
};
