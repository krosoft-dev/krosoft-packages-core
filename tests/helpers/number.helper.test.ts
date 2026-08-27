import { afterEach, describe, expect, it } from "vitest";
import { average, formatCurrency, formatNumber, formatSize, sum } from "../../src/helpers/number.helper";
import { resetLocale, setLocale } from "../../src/helpers/locale.helper";

afterEach(() => {
  resetLocale();
});

describe("formatNumber", () => {
  it("formats a number with fr-FR locale", () => {
    expect(formatNumber(1000)).toBe("1\u202f000");
  });

  it("returns empty string for undefined", () => {
    expect(formatNumber(undefined)).toBe("");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatSize", () => {
  it("formats bytes", () => {
    expect(formatSize(512)).toBe("512 o");
  });

  it("formats kilobytes", () => {
    expect(formatSize(1024)).toBe("1.00 Ko");
  });

  it("formats megabytes", () => {
    expect(formatSize(1_048_576)).toBe("1.00 Mo");
  });

  it("formats gigabytes", () => {
    expect(formatSize(1_073_741_824)).toBe("1.00 Go");
  });
});

describe("formatCurrency", () => {
  it("formats an amount in EUR by default", () => {
    expect(formatCurrency(12.5)).toBe("12,50 €");
  });

  it("groups thousands", () => {
    expect(formatCurrency(1000)).toBe("1 000,00 €");
  });

  it("returns empty string for undefined", () => {
    expect(formatCurrency(undefined)).toBe("");
  });

  it("accepts another currency", () => {
    expect(formatCurrency(1000, "USD")).toBe("1 000,00 $US");
  });

  it("accepts another locale", () => {
    expect(formatCurrency(12.5, "USD", "en-US")).toBe("$12.50");
  });
});

describe("sum", () => {
  it("sums a list of numbers", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it("returns 0 for an empty list", () => {
    expect(sum([])).toBe(0);
  });

  it("handles negative numbers", () => {
    expect(sum([10, -3, -2])).toBe(5);
  });
});

describe("average", () => {
  it("averages a list of numbers", () => {
    expect(average([2, 4, 6])).toBe(4);
  });

  it("returns 0 for an empty list", () => {
    expect(average([])).toBe(0);
  });

  it("returns the value itself for a single element", () => {
    expect(average([7])).toBe(7);
  });
});

describe("locale par défaut", () => {
  it("formats numbers with the locale set on the package", () => {
    setLocale("en-GB");
    expect(formatNumber(1000)).toBe("1,000");
  });

  it("gives precedence to an explicit locale over the default one", () => {
    setLocale("en-GB");
    expect(formatNumber(1000, "fr-FR")).toBe("1\u202f000");
  });

  it("uses the international size units outside French", () => {
    setLocale("en-GB");
    expect(formatSize(512)).toBe("512 B");
    expect(formatSize(1024)).toBe("1.00 KB");
    expect(formatSize(1_048_576)).toBe("1.00 MB");
    expect(formatSize(1_073_741_824)).toBe("1.00 GB");
  });

  it("keeps the French size units whatever the region tag", () => {
    expect(formatSize(1024, "fr-CA")).toBe("1.00 Ko");
  });
});
