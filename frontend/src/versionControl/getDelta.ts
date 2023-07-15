import { longestCommonSubsequence } from "./longestCommonSubsequence";
import { Delta } from "./types";

export const getDelta = (fileA_: string, fileB_: string): Delta => {
  const additions: { [key: string]: string } = {};
  const subtractions: { [key: string]: string } = {};
  const fileA: string[] = fileA_.split("\n");
  const fileB: string[] = fileB_.split("\n");

  const res = longestCommonSubsequence(fileA, fileB);
  const removedId = res[0];
  const addedId = res[1];

  removedId.forEach((rId) => {
    if (fileA[rId].length > 0) subtractions[rId.toString()] = fileA[rId];
  });

  addedId.forEach((aId) => {
    if (fileB[aId].length > 0) additions[aId.toString()] = fileB[aId];
  });

  return {
    added: additions,
    removed: subtractions,
    filename: "",
    path: "",
  };
};
