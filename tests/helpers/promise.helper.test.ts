import { afterEach, describe, expect, it, vi } from "vitest";
import { sleep } from "../../src/helpers/promise.helper";

afterEach(() => {
  vi.useRealTimers();
});

describe("sleep", () => {
  it("resolves only after the given delay", async () => {
    vi.useFakeTimers();
    let resolved = false;
    const promise = sleep(1000).then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(999);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(resolved).toBe(true);
  });
});
