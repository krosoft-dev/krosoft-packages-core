import { getContrastingColor, hexToRgba } from "../../src/helpers/color.helper";
import { describe, it, expect } from "vitest";

describe("hexToRgba", () => {
  it("valid 6-digit hex, alpha 100", () => {
    expect(hexToRgba("#ff0000", 100)).toBe("rgba(255, 0, 0, 1)");
  });

  it("valid 6-digit hex, alpha 0", () => {
    expect(hexToRgba("#ff0000", 0)).toBe("rgba(255, 0, 0, 0)");
  });

  it("valid 6-digit hex, alpha 50", () => {
    expect(hexToRgba("#001031", 50)).toBe("rgba(0, 16, 49, 0.5)");
  });

  it("empty string → fallback", () => {
    expect(hexToRgba("", 100)).toBe("rgba(0,16,49,1)");
  });

  it("3-digit hex (#fff, length 4 < 7) → fallback", () => {
    expect(hexToRgba("#fff", 50)).toBe("rgba(0,16,49,0.5)");
  });

  it("empty string, alpha 0 → fallback", () => {
    expect(hexToRgba("", 0)).toBe("rgba(0,16,49,0)");
  });

  it("null → fallback", () => {
    expect(hexToRgba(null, 100)).toBe("rgba(0,16,49,1)");
  });

  it("undefined → fallback", () => {
    expect(hexToRgba(undefined, 100)).toBe("rgba(0,16,49,1)");
  });
});

describe("getContrastingColor", () => {
  it("returns black on a light background", () => {
    expect(getContrastingColor("#ffffff")).toBe("#000000");
  });

  it("returns white on a dark background", () => {
    expect(getContrastingColor("#000000")).toBe("#FFFFFF");
  });

  it("accepts a hex without the leading hash", () => {
    expect(getContrastingColor("ffff00")).toBe("#000000");
  });

  it("returns white for null", () => {
    expect(getContrastingColor(null)).toBe("#FFFFFF");
  });

  it("returns white for undefined", () => {
    expect(getContrastingColor(undefined)).toBe("#FFFFFF");
  });

  it("returns white for an empty string", () => {
    expect(getContrastingColor("")).toBe("#FFFFFF");
  });
});
