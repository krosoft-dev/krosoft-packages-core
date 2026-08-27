/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadContent, downloadFile } from "../../src/helpers/file.helper";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("downloadFile", () => {
  it("builds a temporary anchor, clicks it and cleans up", () => {
    const createObjectURL = vi.fn(() => "blob:mock");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: revokeObjectURL, configurable: true });

    const anchor = document.createElement("a");
    const click = vi.spyOn(anchor, "click").mockImplementation(() => undefined);
    vi.spyOn(document, "createElement").mockReturnValue(anchor);

    downloadFile(new Blob(["hello"]), "greeting.txt");

    expect(anchor.getAttribute("href")).toBe("blob:mock");
    expect(anchor.download).toBe("greeting.txt");
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    expect(document.body.contains(anchor)).toBe(false);
  });
});

describe("downloadContent", () => {
  it("creates a blob with the given mime type then downloads it", () => {
    let captured: Blob | undefined;
    const createObjectURL = vi.fn((blob: Blob) => {
      captured = blob;
      return "blob:mock";
    });
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: vi.fn(), configurable: true });

    const anchor = document.createElement("a");
    vi.spyOn(anchor, "click").mockImplementation(() => undefined);
    vi.spyOn(document, "createElement").mockReturnValue(anchor);

    downloadContent("a,b,c", "data.csv", "text/csv");

    expect(captured?.type).toBe("text/csv");
    expect(anchor.download).toBe("data.csv");
  });

  it("defaults to a plain text mime type", () => {
    let captured: Blob | undefined;
    const createObjectURL = vi.fn((blob: Blob) => {
      captured = blob;
      return "blob:mock";
    });
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: vi.fn(), configurable: true });

    const anchor = document.createElement("a");
    vi.spyOn(anchor, "click").mockImplementation(() => undefined);
    vi.spyOn(document, "createElement").mockReturnValue(anchor);

    downloadContent("hello", "note.txt");

    expect(captured?.type).toBe("text/plain;charset=utf-8");
  });
});
