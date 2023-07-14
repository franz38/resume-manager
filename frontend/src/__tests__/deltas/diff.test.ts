import { diff } from "../../types/delta";

describe("diff", () => {
  it("should return the correct difference for two strings", () => {
    const str1 = "aaaa\nbbbb\ncccc\ndddd\neee'";
    const str2 = "aaaa\nbbbb\ncccc\nxyz\neee'";

    const expectedDiff = [[3], [3]];
    const result = diff(str1, str2);
    expect(result).toEqual(expectedDiff);
  });

  it("should handle strings with no differences", () => {
    const str1 = "aaaa\nbbbb\ncccc\ndddd\neee'";
    const str2 = "zzzz\nbbbb\ncccc\nxyz\neee'";

    const expectedDiff = [
      [0, 3],
      [0, 3],
    ];
    const result = diff(str1, str2);
    expect(result).toEqual(expectedDiff);
  });

  it("should handle strings with no differences", () => {
    const str1 = "bbbb\ncccc\ndddd\neee'";
    const str2 = "zzzz\nbbbb\ncccc\nxyz\neee'";

    const expectedDiff = [[2], [0, 3]];
    const result = diff(str1, str2);
    expect(result).toEqual(expectedDiff);
  });

  it("should handle strings with no differences", () => {
    const str1 = "aaa\nbbbb\ncccc\ndddd\neee'";
    const str2 = "aaa\nxyz'";

    const expectedDiff = [[1, 2, 3, 4], [1]];
    const result = diff(str1, str2);
    expect(result).toEqual(expectedDiff);
  });

  it("should handle strings with no differences", () => {
    const str1 = "aaa\n\n\n\ncccc\ndddd\neee'";
    const str2 = "aaa\n\n\n\ncccc\nxyz\neee'";

    const expectedDiff = [[5], [5]];
    const result = diff(str1, str2);
    expect(result).toEqual(expectedDiff);
  });

  it("should handle strings with no differences", () => {
    const str1 = "aaa\n\n\n\ncccc\ndddd\neee'";
    const str2 = "aaa\nabc\n\n\ncccc\nxyz\neee'";

    const expectedDiff = [
      [3, 5],
      [1, 5],
    ];
    const result = diff(str1, str2);
    expect(result).toEqual(expectedDiff);
  });

  it("should handle multiple differences in multi-line strings", () => {
    const str1 = "abc\ndef\nghi\njkl\nmno";
    const str2 = "abc\nxyz\npqr\njkl\nstu\nvwx";

    const expectedDiff = [
      [1, 2, 4],
      [1, 2, 4, 5],
    ];
    const result = diff(str1, str2);
    expect(result).toEqual(expectedDiff);
  });
});
