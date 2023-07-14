import { applyDelta } from "../../types/delta";

describe("diff", () => {
  it("no changes", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = {};
    const additions = {};

    const expectedDiff = "aaaa\nbbbb\ncccc\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("add a line", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = {};
    const additions = { "1": "1111" };

    const expectedDiff = "aaaa\n1111\nbbbb\ncccc\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("add a line (over the limit)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = {};
    const additions = { "8": "1111" };

    const expectedDiff = "aaaa\nbbbb\ncccc\ndddd\neee\n\n\n\n1111";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("remove a line", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = { "1": "bbbb" };
    const additions = {};

    const expectedDiff = "aaaa\ncccc\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("remove and add on the same line", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = { "1": "bbbb" };
    const additions = { "1": "xyz" };

    const expectedDiff = "aaaa\nxyz\ncccc\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("remove and add on different lines (I)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = { "0": "aaaa" };
    const additions = { "1": "xyz" };

    const expectedDiff = "bbbb\nxyz\ncccc\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("remove and add on different lines (II)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = { "2": "cccc" };
    const additions = { "1": "xyz" };

    const expectedDiff = "aaaa\nxyz\nbbbb\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("remove and add on different lines (III)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = { "0": "aaaa", "2": "cccc" };
    const additions = { "1": "xyz" };

    const expectedDiff = "bbbb\nxyz\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("remove and add on different lines (IV)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = { "0": "aaaa", "2": "cccc" };
    const additions = { "1": "xyz", "4": "++++" };

    const expectedDiff = "bbbb\nxyz\ndddd\neee\n++++";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("add line at the end (I)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = {};
    const additions = { "5": "+++" };

    const expectedDiff = "aaaa\nbbbb\ncccc\ndddd\neee\n+++";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("add line at the end (II)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = {};
    const additions = { "6": "---", "5": "+++++" };

    const expectedDiff = "aaaa\nbbbb\ncccc\ndddd\neee\n+++++\n---";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("remove multiple lines", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = { "0": "aaaa", "3": "dddd", "4": "eee" };
    const additions = {};

    const expectedDiff = "bbbb\ncccc";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("add multiple line (I)", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = {};
    const additions = { "1": "1111", "2": "2222" };

    const expectedDiff = "aaaa\n1111\n2222\nbbbb\ncccc\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });

  it("add multiple line (I))", () => {
    const initialContent = "aaaa\nbbbb\ncccc\ndddd\neee";
    const subtractions = {};
    const additions = { "0": "0000", "2": "2222" };

    const expectedDiff = "0000\naaaa\n2222\nbbbb\ncccc\ndddd\neee";
    const result = applyDelta(initialContent, subtractions, additions);
    expect(result).toEqual(expectedDiff);
  });
});
