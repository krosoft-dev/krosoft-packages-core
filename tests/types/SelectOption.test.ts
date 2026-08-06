import { describe, expect, expectTypeOf, it } from "vitest";
import type { SelectOption } from "../../src/types/SelectOption";

describe("SelectOption", () => {
  it("accepts an object with value and label as strings", () => {
    const option: SelectOption = { value: "fr", label: "Français" };
    expect(option.value).toBe("fr");
    expect(option.label).toBe("Français");
  });

  it("has value and label typed as string", () => {
    expectTypeOf<SelectOption>().toEqualTypeOf<{ value: string; label: string }>();
    expectTypeOf<SelectOption["value"]>().toBeString();
    expectTypeOf<SelectOption["label"]>().toBeString();
  });

  it("can be used in an array (typical select usage)", () => {
    const options: SelectOption[] = [
      { value: "1", label: "Un" },
      { value: "2", label: "Deux" },
    ];
    expect(options).toHaveLength(2);
    expect(options.map((o) => o.value)).toEqual(["1", "2"]);
  });

  it("supports empty strings", () => {
    const option: SelectOption = { value: "", label: "" };
    expect(option.value).toBe("");
    expect(option.label).toBe("");
  });
});
