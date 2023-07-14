import { getDelta } from "../../types/delta";

describe("diff", () => {
  it("no changes", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\nbbbb\ncccc\ndddd\neee";

    const expectedSubtractions = {};
    const expectedAdditions = {};

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("empty file", () => {
    const contentA = "";
    const contentB = "aaaa";

    const expectedSubtractions = {};
    const expectedAdditions = { "0": "aaaa" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("line removed", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\ncccc\ndddd\neee";

    const expectedSubtractions = { "1": "bbbb" };
    const expectedAdditions = {};

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("multple line removed (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\ncccc\neee";

    const expectedSubtractions = { "1": "bbbb", "3": "dddd" };
    const expectedAdditions = {};

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("multple line removed (II)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "cccc\neee";

    const expectedSubtractions = { "0": "aaaa", "1": "bbbb", "3": "dddd" };
    const expectedAdditions = {};

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("line added", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\n1111\nbbbb\ncccc\ndddd\neee";

    const expectedSubtractions = {};
    const expectedAdditions = { "1": "1111" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("multiple line added (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "0000\naaaa\n1111\nbbbb\ncccc\ndddd\neee";

    const expectedSubtractions = {};
    const expectedAdditions = { "0": "0000", "2": "1111" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("multiple line added (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "0000\n1111\naaaa\nbbbb\ncccc\ndddd\neee";

    const expectedSubtractions = {};
    const expectedAdditions = { "0": "0000", "1": "1111" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("line substitution (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\n2222\ncccc\ndddd\neee";

    const expectedSubtractions = { "1": "bbbb" };
    const expectedAdditions = { "1": "2222" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("line substitution (II)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\n2222\ncccc\ndddd\n333";

    const expectedSubtractions = { "1": "bbbb", "4": "eee" };
    const expectedAdditions = { "1": "2222", "4": "333" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("multiple line added and removed (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "bbbb\ncccc\nxyz\ndddd\neee";

    const expectedSubtractions = { "0": "aaaa" };
    const expectedAdditions = { "2": "xyz" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });

  it("multiple line added and removed (II)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\nxyz\nbbbb\ncccc\neee";

    const expectedSubtractions = { "3": "dddd" };
    const expectedAdditions = { "1": "xyz" };

    const result = getDelta(contentA, contentB);

    expect(result.removed).toEqual(expectedSubtractions);
    expect(result.added).toEqual(expectedAdditions);
  });
});
