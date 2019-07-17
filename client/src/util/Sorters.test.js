import { compareByAlph } from "./Sorters";

describe("compareByAlph", () => {
  it("should return -1 if a is more than b", () => {
    expect(compareByAlph(2, 1)).toBe(-1);
  });

  it("should return 1 if a is less than b", () => {
    expect(compareByAlph(1, 2)).toBe(1);
  });

  it("should return 0 if both values are the same", () => {
    expect(compareByAlph(1, 1)).toBe(0);
  });
});
