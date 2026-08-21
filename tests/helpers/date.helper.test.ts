import { afterEach, describe, expect, it } from "vitest";
import { formatFullDateTime, formatShortDate, formatShortDateTime, formatShortDateTimeNoSeconds, formatTimeSpan } from "../../src/helpers/date.helper";
import { resetLocale, setLocale } from "../../src/helpers/locale.helper";

const DATE = "2024-06-15T14:30:45";

afterEach(() => {
  resetLocale();
});

describe("formatFullDateTime", () => {
  it("returns empty string for empty input", () => {
    expect(formatFullDateTime("")).toBe("");
  });

  it("returns empty string for null", () => {
    expect(formatFullDateTime(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatFullDateTime(undefined)).toBe("");
  });

  it("formats date with time and seconds", () => {
    expect(formatFullDateTime(DATE)).toBe("15 juin 2024, 14:30:45");
  });
});

describe("formatShortDateTime", () => {
  it("returns empty string for empty input", () => {
    expect(formatShortDateTime("")).toBe("");
  });

  it("returns empty string for null", () => {
    expect(formatShortDateTime(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatShortDateTime(undefined)).toBe("");
  });

  it("formats date with time and seconds", () => {
    expect(formatShortDateTime(DATE)).toBe("15/06/2024 14:30:45");
  });
});

describe("formatShortDate", () => {
  it("returns empty string for empty input", () => {
    expect(formatShortDate("")).toBe("");
  });

  it("returns empty string for null", () => {
    expect(formatShortDate(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatShortDate(undefined)).toBe("");
  });

  it("formats date without time", () => {
    expect(formatShortDate(DATE)).toBe("15/06/2024");
  });
});

describe("formatShortDateTimeNoSeconds", () => {
  it("returns empty string for empty input", () => {
    expect(formatShortDateTimeNoSeconds("")).toBe("");
  });

  it("returns empty string for null", () => {
    expect(formatShortDateTimeNoSeconds(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatShortDateTimeNoSeconds(undefined)).toBe("");
  });

  it("formats date with time but no seconds", () => {
    expect(formatShortDateTimeNoSeconds(DATE)).toBe("15/06/2024 14:30");
  });
});

describe("formatTimeSpan", () => {
  it("returns empty string for empty input", () => {
    expect(formatTimeSpan("")).toBe("");
  });

  it("returns empty string for null", () => {
    expect(formatTimeSpan(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatTimeSpan(undefined)).toBe("");
  });

  it("formats a timespan with days, hours, minutes and seconds", () => {
    expect(formatTimeSpan("0:02:15:28.7797708")).toBe("0d 02h 15m 28s");
  });
});

describe("locale par défaut", () => {
  it("follows the locale set on the package", () => {
    setLocale("en-GB");
    expect(formatShortDate(DATE)).toBe("15/06/2024");
    expect(formatFullDateTime(DATE)).toBe("15 Jun 2024, 14:30:45");
  });

  it("gives precedence to an explicit locale over the default one", () => {
    setLocale("en-GB");
    expect(formatShortDate(DATE, "fr-FR")).toBe("15/06/2024");
    expect(formatFullDateTime(DATE, "fr-FR")).toBe("15 juin 2024, 14:30:45");
  });

  it("formats with the US convention", () => {
    expect(formatShortDate(DATE, "en-US")).toBe("6/15/2024");
  });
});
