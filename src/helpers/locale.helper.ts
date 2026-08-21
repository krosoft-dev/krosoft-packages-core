/**
 * Locale utilisée par défaut par les helpers de formatage (dates, nombres, tailles).
 *
 * Les applications qui restent monolingues n'ont rien à faire : la valeur par défaut
 * reste `fr-FR`, le comportement historique du package. Une application multilingue
 * appelle `setLocale` au démarrage puis à chaque changement de langue.
 */
const DEFAULT_LOCALE = "fr-FR";

let currentLocale: string = DEFAULT_LOCALE;

/** Change la locale par défaut de tous les helpers de formatage. */
export const setLocale = (locale: string): void => {
  currentLocale = locale === "" ? DEFAULT_LOCALE : locale;
};

/** Locale par défaut courante, utilisée quand un helper est appelé sans locale explicite. */
export const getLocale = (): string => currentLocale;

/** Rétablit la locale par défaut du package. */
export const resetLocale = (): void => {
  currentLocale = DEFAULT_LOCALE;
};
