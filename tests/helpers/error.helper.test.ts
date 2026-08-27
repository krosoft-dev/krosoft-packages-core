import { NETWORK_ERROR_CODE, extractErrors, getErrorMessage, getMessage, isErrorNetwork, toErrorHttp } from "../../src/helpers/error.helper";
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

describe("toErrorHttp", () => {
  it("exposes joined errors as the message (Pascal case payload)", () => {
    // L'API .NET sérialise les clés en PascalCase : toErrorHttp doit savoir les lire.
    const payload = { Code: 400, Message: "BadRequest", Errors: ["field required", "invalid value"] };
    expect(toErrorHttp(400, payload)).toEqual({
      code: 400,
      message: "field required invalid value",
      errors: ["field required", "invalid value"],
    });
  });

  it("reads a camelCase payload", () => {
    expect(toErrorHttp(403, { code: 403, message: "Forbidden", errors: ["access denied"] })).toEqual({
      code: 403,
      message: "access denied",
      errors: ["access denied"],
    });
  });

  it("falls back to the message when there are no errors", () => {
    expect(toErrorHttp(404, { message: "Not found" })).toEqual({
      code: 404,
      message: "Not found",
      errors: null,
    });
  });

  it("uses the HTTP status when the payload has no code", () => {
    expect(toErrorHttp(500, {}).code).toBe(500);
  });

  it("falls back to a default message for an empty payload", () => {
    expect(toErrorHttp(500, null)).toEqual({
      code: 500,
      message: "Request failed",
      errors: null,
    });
  });

  it("ignores blank strings in the errors list", () => {
    expect(toErrorHttp(400, { errors: ["real error", "  ", ""] })).toEqual({
      code: 400,
      message: "real error",
      errors: ["real error"],
    });
  });
});

describe("getErrorMessage", () => {
  it("joins the errors list with a bullet separator", () => {
    expect(getErrorMessage({ code: 400, message: "BadRequest", errors: ["champ requis", "valeur invalide"] })).toBe("champ requis • valeur invalide");
  });

  it("falls back to the message when there are no errors", () => {
    expect(getErrorMessage({ code: 422, message: "Votre quota est dépassé", errors: null })).toBe("Votre quota est dépassé");
  });

  it("uses the HTTP label when neither errors nor message are exploitable", () => {
    expect(getErrorMessage({ code: 403, message: null, errors: null })).toBe("Accès refusé");
  });

  it("falls back to the generic message for an unknown code without message", () => {
    expect(getErrorMessage({ code: 418, message: null, errors: null })).toBe("Erreur inconnue");
  });

  it("reads an ErrorHttp that has only a message", () => {
    expect(getErrorMessage({ message: "boum" })).toBe("boum");
  });

  it("returns the message of a native Error", () => {
    expect(getErrorMessage(new Error("something went wrong"))).toBe("something went wrong");
  });

  it("returns a plain string as-is", () => {
    expect(getErrorMessage("raw error")).toBe("raw error");
  });

  it("falls back to the generic message for null", () => {
    expect(getErrorMessage(null)).toBe("Erreur inconnue");
  });

  it("falls back to the generic message for a number", () => {
    expect(getErrorMessage(42)).toBe("Erreur inconnue");
  });
});

describe("isErrorNetwork", () => {
  it("is true for an ErrorHttp with the network code", () => {
    expect(isErrorNetwork({ code: NETWORK_ERROR_CODE, message: "offline", errors: null })).toBe(true);
  });

  it("is false for an ErrorHttp with an HTTP status code", () => {
    expect(isErrorNetwork({ code: 500, message: "boom", errors: null })).toBe(false);
  });

  it("is false for a plain Error", () => {
    expect(isErrorNetwork(new Error("boom"))).toBe(false);
  });

  it("is false for null", () => {
    expect(isErrorNetwork(null)).toBe(false);
  });
});
