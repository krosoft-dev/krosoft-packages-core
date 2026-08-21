import { afterEach, describe, expect, it } from "vitest";
import { getLocale, resetLocale, setLocale } from "../../src/helpers/locale.helper";

afterEach(() => {
  resetLocale();
});

describe("locale", () => {
  it("defaults to fr-FR", () => {
    expect(getLocale()).toBe("fr-FR");
  });

  it("stores the locale that was set", () => {
    setLocale("en-GB");
    expect(getLocale()).toBe("en-GB");
  });

  it("falls back to the default locale for an empty value", () => {
    setLocale("en-GB");
    setLocale("");
    expect(getLocale()).toBe("fr-FR");
  });

  it("restores the default locale on reset", () => {
    setLocale("en-GB");
    resetLocale();
    expect(getLocale()).toBe("fr-FR");
  });
});
