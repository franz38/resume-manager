import { Delta } from "./types";

export const getDeltaString = (delta: Delta): string =>
  applyDelta("", delta.removed, delta.added);

export const applyDelta = (
  fileContent: string,
  subtractions: { [key: string]: string },
  additions: { [key: string]: string },
): string => {
  const additionKeys = Object.keys(additions)
    .map((k) => parseInt(k))
    .sort((a, b) => a - b);
  const subtractionsKeys = Object.keys(subtractions)
    .map((k) => parseInt(k))
    .sort((a, b) => a - b);

  let lines = fileContent.split("\n");

  if (lines.length == 1 && lines[0].length == 0) lines = [];

  subtractionsKeys.forEach((lineNumber) => {
    lines[lineNumber] = undefined;
  });

  lines = lines.filter((l) => l != undefined);

  additionKeys.forEach((lineNumber) => {
    while (lineNumber > lines.length) lines.push("");
    lines.splice(lineNumber, 0, additions[lineNumber.toString()]);
  });

  return lines.join("\n");
};
