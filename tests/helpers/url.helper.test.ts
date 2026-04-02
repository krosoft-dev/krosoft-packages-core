import { describe, it, expect } from "vitest";
import { buildUrl } from "../../src/helpers/url.helper";

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
});
