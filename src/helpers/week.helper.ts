import { getLocale } from "./locale.helper";
import { toInputDate } from "./date.helper";

/** Nombre de jours affichés par le planning : une semaine pleine. */
const DAYS_IN_WEEK = 7;

/** Parse une date « YYYY-MM-DD » en heure locale (évite le décalage UTC de `new Date("YYYY-MM-DD")`). */
const parseLocalDate = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

/** Lundi de la semaine contenant `date`, normalisé au format `YYYY-MM-DD`. */
export const weekStartOf = (date: Date | string = new Date()): string => {
  const value = typeof date === "string" ? new Date(date) : date;
  const monday = new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const offsetToMonday = monday.getDay() === 0 ? -6 : 1 - monday.getDay();
  monday.setDate(monday.getDate() + offsetToMonday);

  return toInputDate(monday);
};

/** Lundi de la semaine décalée de `amount` semaines (négatif pour reculer). */
export const shiftWeek = (weekStart: string, amount: number): string => {
  const shifted = parseLocalDate(weekStart);
  shifted.setDate(shifted.getDate() + amount * DAYS_IN_WEEK);

  return toInputDate(shifted);
};

/** Les sept jours de la semaine, du lundi au dimanche. */
export const weekDays = (weekStart: string): Date[] => {
  const start = parseLocalDate(weekStart);

  return Array.from({ length: DAYS_IN_WEEK }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
};

/** Libellé de la semaine, ex. « 18 – 24 août 2026 ». */
export const formatWeekLabel = (weekStart: string, locale: string = getLocale()): string => {
  const start = parseLocalDate(weekStart);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + (DAYS_IN_WEEK - 1));
  const sameMonth = start.getMonth() === end.getMonth();

  const startLabel = sameMonth ? String(start.getDate()) : start.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const endLabel = end.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  return `${startLabel} – ${endLabel}`;
};

/** Libellé court d'un jour de la grille, ex. « lun. 18 ». */
export const formatDayLabel = (day: Date, locale: string = getLocale()): string => day.toLocaleDateString(locale, { weekday: "short", day: "numeric" });

/** Vrai si `day` est aujourd'hui — la colonne correspondante est mise en avant. */
export const isToday = (day: Date): boolean => {
  const now = new Date();

  return day.getFullYear() === now.getFullYear() && day.getMonth() === now.getMonth() && day.getDate() === now.getDate();
};
