/**
 * Normalise une chaîne pour la recherche : minuscules + suppression des accents
 * (diacritiques). Permet de faire correspondre « amelie » à « Amélie », etc.
 */
export const normalizeText = (value: string): string => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Vrai si `haystack` contient `needle` en ignorant la casse et les accents.
 * Un `needle` vide matche toujours.
 */
export const includesNormalized = (haystack: string, needle: string): boolean => normalizeText(haystack).includes(normalizeText(needle));
