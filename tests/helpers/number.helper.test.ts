import { describe, it, expect } from "vitest";
import { formatNumber, formatSize } from "../../src/helpers/number.helper";

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
