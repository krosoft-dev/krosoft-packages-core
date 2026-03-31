import { describe, expect, it } from "vitest";
import { beautifyJson, tryParseJson } from "../../src/helpers";

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
