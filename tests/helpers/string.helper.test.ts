import { includesNormalized, normalizeText } from "../../src/helpers/string.helper";
import { describe, it, expect } from "vitest";

describe("normalizeText", () => {
  it("lowercases the value", () => {
    expect(normalizeText("HELLO")).toBe("hello");
  });

  it("removes accents / diacritics", () => {
    expect(normalizeText("Amélie")).toBe("amelie");
  });

  it("removes multiple diacritics", () => {
    expect(normalizeText("Élève à Nîmes")).toBe("eleve a nimes");
  });

  it("leaves plain text unchanged", () => {
    expect(normalizeText("hello")).toBe("hello");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeText("")).toBe("");
  });
});

describe("includesNormalized", () => {
  it("matches ignoring case", () => {
    expect(includesNormalized("Hello World", "world")).toBe(true);
  });

  it("matches ignoring accents", () => {
    expect(includesNormalized("Amélie", "amelie")).toBe(true);
  });

  it("matches accented needle against unaccented haystack", () => {
    expect(includesNormalized("amelie", "Amélie")).toBe(true);
  });

  it("returns false when needle is absent", () => {
    expect(includesNormalized("Amélie", "bob")).toBe(false);
  });

  it("matches an empty needle", () => {
    expect(includesNormalized("Amélie", "")).toBe(true);
  });
});
