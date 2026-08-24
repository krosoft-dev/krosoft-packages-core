import { describe, expect, it } from "vitest";
import { beautifyJson, formatJsonValue, isRecord, tryParseJson } from "../../src/helpers";

describe("tryParseJson", () => {
  it("parses valid JSON", () => {
    expect(tryParseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("returns null for invalid JSON", () => {
    expect(tryParseJson("not json")).toBeNull();
  });

  it("parses arrays", () => {
    expect(tryParseJson("[1,2,3]")).toEqual([1, 2, 3]);
  });
});

describe("beautifyJson", () => {
  it("beautifies valid JSON", () => {
    expect(beautifyJson('{"a":1}')).toBe('{\n  "a": 1\n}');
  });

  it("returns null stringified for invalid JSON", () => {
    expect(beautifyJson("not json")).toBe("null");
  });
});

describe("isRecord", () => {
  it("is true for plain objects", () => {
    expect(isRecord({ a: 1 })).toBe(true);
  });

  it("is true for arrays (typeof object)", () => {
    expect(isRecord([1, 2])).toBe(true);
  });

  it("is false for null and primitives", () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord("x")).toBe(false);
    expect(isRecord(42)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
  });
});

describe("formatJsonValue", () => {
  it("returns an empty string for null and undefined", () => {
    expect(formatJsonValue(null)).toBe("");
    expect(formatJsonValue(undefined)).toBe("");
  });

  it("returns strings unchanged", () => {
    expect(formatJsonValue("hello")).toBe("hello");
  });

  it("stringifies numbers and booleans", () => {
    expect(formatJsonValue(42)).toBe("42");
    expect(formatJsonValue(false)).toBe("false");
  });

  it("indents objects and arrays", () => {
    expect(formatJsonValue({ a: 1 })).toBe('{\n  "a": 1\n}');
    expect(formatJsonValue([1, 2])).toBe("[\n  1,\n  2\n]");
  });
});
