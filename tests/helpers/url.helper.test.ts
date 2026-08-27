import { describe, it, expect } from "vitest";
import { buildUrl, getUrlHostname, isValidHttpUrl, normalizeUrl } from "../../src/helpers/url.helper";

describe("buildUrl", () => {
  it("returns baseUrl when params are empty", () => {
    expect(buildUrl("https://api.example.com/items", {})).toBe("https://api.example.com/items");
  });

  it("appends a single string param", () => {
    expect(buildUrl("https://api.example.com/items", { search: "hello" })).toBe("https://api.example.com/items?search=hello");
  });

  it("appends multiple params", () => {
    expect(buildUrl("https://api.example.com/items", { page: 1, size: 20 })).toBe("https://api.example.com/items?page=1&size=20");
  });

  it("skips undefined values", () => {
    expect(buildUrl("https://api.example.com/items", { page: undefined, size: 20 })).toBe("https://api.example.com/items?size=20");
  });

  it("skips null values", () => {
    expect(buildUrl("https://api.example.com/items", { search: null, size: 10 })).toBe("https://api.example.com/items?size=10");
  });

  it("skips empty string values", () => {
    expect(buildUrl("https://api.example.com/items", { search: "", size: 10 })).toBe("https://api.example.com/items?size=10");
  });

  it("skips zero values", () => {
    expect(buildUrl("https://api.example.com/items", { page: 0, size: 10 })).toBe("https://api.example.com/items?size=10");
  });

  it("appends array values as repeated params", () => {
    expect(buildUrl("https://api.example.com/items", { ids: [1, 2, 3] })).toBe("https://api.example.com/items?ids=1&ids=2&ids=3");
  });

  it("appends sortBy params", () => {
    expect(buildUrl("https://api.example.com/items", {}, [{ key: "name", order: "asc" }])).toBe("https://api.example.com/items?sortBy=name:asc");
  });

  it("appends multiple sortBy params", () => {
    expect(
      buildUrl("https://api.example.com/items", {}, [
        { key: "name", order: "asc" },
        { key: "date", order: "desc" },
      ]),
    ).toBe("https://api.example.com/items?sortBy=name:asc&sortBy=date:desc");
  });

  it("combines params and sortBy", () => {
    expect(buildUrl("https://api.example.com/items", { page: 1 }, [{ key: "name", order: "asc" }])).toBe(
      "https://api.example.com/items?page=1&sortBy=name:asc",
    );
  });

  it("ignores sortBy when array is empty", () => {
    expect(buildUrl("https://api.example.com/items", { page: 1 }, [])).toBe("https://api.example.com/items?page=1");
  });

  it("tolerates a null sortBy", () => {
    expect(buildUrl("https://api.example.com/items", { page: 1 }, null)).toBe("https://api.example.com/items?page=1");
  });
});

describe("normalizeUrl", () => {
  it("prefixes a schemeless value with https://", () => {
    expect(normalizeUrl("example.com/path")).toBe("https://example.com/path");
  });

  it("keeps an existing http scheme", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("keeps an existing https scheme", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeUrl("  example.com  ")).toBe("https://example.com");
  });

  it("returns an empty string for a blank value", () => {
    expect(normalizeUrl("   ")).toBe("");
  });
});

describe("getUrlHostname", () => {
  it("returns the hostname of an absolute URL", () => {
    expect(getUrlHostname("https://example.com/path?q=1")).toBe("example.com");
  });

  it("strips a leading www.", () => {
    expect(getUrlHostname("https://www.example.com")).toBe("example.com");
  });

  it("normalizes a schemeless value first", () => {
    expect(getUrlHostname("example.com/path")).toBe("example.com");
  });

  it("returns the raw input when it is unparsable", () => {
    expect(getUrlHostname("http://")).toBe("http://");
  });
});

describe("isValidHttpUrl", () => {
  it("accepts an absolute https url", () => {
    expect(isValidHttpUrl("https://example.com")).toBe(true);
  });

  it("accepts a schemeless url with a dotted host", () => {
    expect(isValidHttpUrl("example.com/path")).toBe(true);
  });

  it("returns false for a blank value", () => {
    expect(isValidHttpUrl("   ")).toBe(false);
  });

  it("rejects localhost by default", () => {
    expect(isValidHttpUrl("localhost:3000")).toBe(false);
  });

  it("accepts localhost when allowLocalhost is set", () => {
    expect(isValidHttpUrl("localhost:3000", { allowLocalhost: true })).toBe(true);
  });
});
