/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { deleteCookie, getCookie, setCookie } from "../../src/helpers/cookie.helper";

const clearCookies = (): void => {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "") {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
};

afterEach(clearCookies);

describe("setCookie / getCookie", () => {
  it("reads back a cookie that was written", () => {
    setCookie("token", "abc123");
    expect(getCookie("token")).toBe("abc123");
  });

  it("encodes and decodes special characters", () => {
    setCookie("q", "a b&c=d");
    expect(getCookie("q")).toBe("a b&c=d");
  });

  it("returns null for a missing cookie", () => {
    expect(getCookie("missing")).toBeNull();
  });

  it("escapes regex-special characters in the name", () => {
    setCookie("a.b", "dot");
    expect(getCookie("a.b")).toBe("dot");
  });
});

describe("deleteCookie", () => {
  it("removes a previously written cookie", () => {
    setCookie("temp", "1");
    expect(getCookie("temp")).toBe("1");

    deleteCookie("temp");
    expect(getCookie("temp")).toBeNull();
  });
});

describe("setCookie — hostOnlyFallback", () => {
  // L'attribut `domain` n'est pas relisible via `document.cookie` : on intercepte l'écriture
  // pour vérifier la chaîne produite. Le host jsdom courant est « localhost ».
  const captureWrite = (write: () => void): string => {
    let written = "";
    Object.defineProperty(document, "cookie", { configurable: true, get: () => "", set: (value: string) => (written = value) });
    try {
      write();
    } finally {
      Reflect.deleteProperty(document, "cookie");
    }

    return written;
  };

  it("keeps a domain that matches the current host", () => {
    const written = captureWrite(() => {
      setCookie("a", "1", { domain: "localhost", hostOnlyFallback: true });
    });
    expect(written).toContain("domain=localhost");
  });

  it("drops a non-matching domain (falls back to host-only)", () => {
    const written = captureWrite(() => {
      setCookie("a", "1", { domain: "example.com", hostOnlyFallback: true });
    });
    expect(written).not.toContain("domain=");
  });

  it("keeps a non-matching domain when the fallback is off", () => {
    const written = captureWrite(() => {
      setCookie("a", "1", { domain: "example.com" });
    });
    expect(written).toContain("domain=example.com");
  });
});
