import { afterEach, describe, expect, it } from "vitest";
import { formatDayLabel, formatWeekLabel, isToday, shiftWeek, weekDays, weekStartOf } from "../../src/helpers/week.helper";
import { resetLocale, setLocale } from "../../src/helpers/locale.helper";

// 17/08/2026 est un lundi.
const MONDAY = "2026-08-17";

afterEach(() => {
  resetLocale();
});

describe("weekStartOf", () => {
  it("returns the Monday for a mid-week date (string)", () => {
    expect(weekStartOf("2026-08-19")).toBe(MONDAY);
  });

  it("returns the same Monday when given the Monday", () => {
    expect(weekStartOf(MONDAY)).toBe(MONDAY);
  });

  it("returns the current Monday for the Sunday of the week", () => {
    expect(weekStartOf("2026-08-23")).toBe(MONDAY);
  });

  it("goes back to the previous Monday for a Sunday", () => {
    expect(weekStartOf("2026-08-16")).toBe("2026-08-10");
  });

  it("accepts a Date instance", () => {
    expect(weekStartOf(new Date(2026, 7, 19))).toBe(MONDAY);
  });
});

describe("shiftWeek", () => {
  it("moves forward by one week", () => {
    expect(shiftWeek(MONDAY, 1)).toBe("2026-08-24");
  });

  it("moves backward by one week", () => {
    expect(shiftWeek(MONDAY, -1)).toBe("2026-08-10");
  });

  it("moves forward by several weeks across a month", () => {
    expect(shiftWeek(MONDAY, 3)).toBe("2026-09-07");
  });

  it("returns the same Monday for a zero shift", () => {
    expect(shiftWeek(MONDAY, 0)).toBe(MONDAY);
  });
});

describe("weekDays", () => {
  it("returns seven days", () => {
    expect(weekDays(MONDAY)).toHaveLength(7);
  });

  it("starts on the Monday and ends on the Sunday", () => {
    const days = weekDays(MONDAY);
    expect(days[0].getDate()).toBe(17);
    expect(days[6].getDate()).toBe(23);
  });

  it("returns Date instances", () => {
    expect(weekDays(MONDAY).every(d => d instanceof Date)).toBe(true);
  });
});

describe("formatWeekLabel", () => {
  it("uses a compact start when the week stays in one month", () => {
    expect(formatWeekLabel(MONDAY)).toBe("17 – 23 août 2026");
  });

  it("shows the month on both sides when the week spans two months", () => {
    expect(formatWeekLabel("2026-08-31")).toBe("31 août – 6 septembre 2026");
  });

  it("follows the locale set on the package", () => {
    setLocale("en-US");
    expect(formatWeekLabel(MONDAY)).toBe("17 – August 23, 2026");
  });

  it("gives precedence to an explicit locale", () => {
    setLocale("en-US");
    expect(formatWeekLabel(MONDAY, "fr-FR")).toBe("17 – 23 août 2026");
  });
});

describe("formatDayLabel", () => {
  it("formats a short weekday and day number", () => {
    expect(formatDayLabel(new Date(2026, 7, 17))).toBe("lun. 17");
  });

  it("gives precedence to an explicit locale", () => {
    setLocale("fr-FR");
    expect(formatDayLabel(new Date(2026, 7, 17), "en-US")).toBe("17 Mon");
  });
});

describe("isToday", () => {
  it("is true for the current day", () => {
    expect(isToday(new Date())).toBe(true);
  });

  it("is false for another day", () => {
    expect(isToday(new Date(2026, 7, 17))).toBe(false);
  });
});
