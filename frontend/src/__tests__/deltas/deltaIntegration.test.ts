import { applyDelta, getDelta } from "../../types/delta";

describe("diff", () => {
  it("no changes", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\nbbbb\ncccc\ndddd\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("empty file", () => {
    const contentA = "";
    const contentB = "aaaa";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("line removed", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\ncccc\ndddd\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("multple line removed (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\ncccc\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("multple line removed (II)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "cccc\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("line added", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\n1111\nbbbb\ncccc\ndddd\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("multiple line added (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "0000\naaaa\n1111\nbbbb\ncccc\ndddd\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("multiple line added (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "0000\n1111\naaaa\nbbbb\ncccc\ndddd\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("line substitution (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\n2222\ncccc\ndddd\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("line substitution (II)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\n2222\ncccc\ndddd\n333";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("multiple line added and removed (I)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "bbbb\ncccc\nxyz\ndddd\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("multiple line added and removed (II)", () => {
    const contentA = "aaaa\nbbbb\ncccc\ndddd\neee";
    const contentB = "aaaa\nxyz\nbbbb\ncccc\neee";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("random test (I)", () => {
    const contentA = "45\n39\n88\n77\n20\n71\n66\n61\n23\n63";
    const contentB = "99\n15\n87\n34\n79\n52\n93\n25\n67\n10";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("random test (II)", () => {
    const contentA = "31\n96\n82\n17\n60\n44\n78\n56\n29\n85";
    const contentB =
      "31\n96\n48\n72\n38\n69\n82\n17\n60\n44\n78\n56\n29\n85\n30\n16\n83";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });

  it("random test (III)", () => {
    const contentA = "22\n13\n51\n8631\n96\n82\n17\n60\n44\n78\n56\n29\n85";
    const contentB =
      "31\n96\n48\n72\n38\n69\n82\n17\n60\n44\n78\n56\n29\n85\n30\n16\n83";

    const delta = getDelta(contentA, contentB);

    const rebuildFile = applyDelta(contentA, delta.removed, delta.added);

    expect(contentB).toEqual(rebuildFile);
  });
});
