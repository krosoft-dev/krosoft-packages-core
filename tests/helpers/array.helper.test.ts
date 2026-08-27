import { groupBy, toggleValue } from "../../src/helpers/array.helper";
import { describe, it, expect } from "vitest";

describe("toggleValue", () => {
  it("adds the value when absent", () => {
    expect(toggleValue(["a", "b"], "c")).toEqual(["a", "b", "c"]);
  });

  it("removes the value when present", () => {
    expect(toggleValue(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  it("adds to an empty array", () => {
    expect(toggleValue([], "a")).toEqual(["a"]);
  });

  it("removes the last remaining value", () => {
    expect(toggleValue(["a"], "a")).toEqual([]);
  });

  it("works with numbers", () => {
    expect(toggleValue([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it("does not mutate the source array", () => {
    const source = ["a", "b"];
    toggleValue(source, "c");
    expect(source).toEqual(["a", "b"]);
  });
});

describe("groupBy", () => {
  it("groups items by the returned key", () => {
    const items = [
      { type: "fruit", name: "apple" },
      { type: "veg", name: "carrot" },
      { type: "fruit", name: "pear" },
    ];
    expect(groupBy(items, item => item.type)).toEqual({
      fruit: [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "pear" },
      ],
      veg: [{ type: "veg", name: "carrot" }],
    });
  });

  it("groups by a computed key", () => {
    expect(groupBy([1, 2, 3, 4], n => (n % 2 === 0 ? "even" : "odd"))).toEqual({ even: [2, 4], odd: [1, 3] });
  });

  it("returns an empty object for an empty list", () => {
    expect(groupBy([], () => "x")).toEqual({});
  });
});
