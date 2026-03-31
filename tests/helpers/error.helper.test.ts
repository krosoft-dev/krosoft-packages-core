import { extractErrors, getMessage } from "../../src/helpers/error.helper";
import { describe, it, expect } from "vitest";

describe("extractErrors", () => {
  it("returns empty array for a plain Error", () => {
    expect(extractErrors(new Error("oops"))).toEqual([]);
  });

  it("returns empty array for null", () => {
    expect(extractErrors(null)).toEqual([]);
  });

  it("returns empty array for undefined", () => {
    expect(extractErrors(undefined)).toEqual([]);
  });

  it("returns empty array when code is not 400 or 500", () => {
    expect(extractErrors({ code: 404, errors: ["not found"] })).toEqual([]);
  });

  it("returns empty array when errors is null", () => {
    expect(extractErrors({ code: 400, errors: null })).toEqual([]);
  });

  it("returns empty array when errors is undefined", () => {
    expect(extractErrors({ code: 400, errors: undefined })).toEqual([]);
  });

  it("returns errors for code 400", () => {
    expect(extractErrors({ code: 400, errors: ["field required", "invalid value"] })).toEqual(["field required", "invalid value"]);
  });

  it("returns errors for code 500", () => {
    expect(extractErrors({ code: 500, errors: ["internal error"] })).toEqual(["internal error"]);
  });
});

describe("getMessage", () => {
  it("returns message from an Error instance", () => {
    expect(getMessage(new Error("something went wrong"))).toBe("something went wrong");
  });

  it("returns string representation for a plain string", () => {
    expect(getMessage("raw error")).toBe("raw error");
  });

  it("returns string representation for a number", () => {
    expect(getMessage(42)).toBe("42");
  });

  it("returns string representation for null", () => {
    expect(getMessage(null)).toBe("null");
  });

  it("returns string representation for an object", () => {
    expect(getMessage({ code: 400 })).toBe("[object Object]");
  });
});
