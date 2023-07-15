export const longestCommonSubsequence = (
  file1: string[],
  file2: string[],
): [number[], number[]] => {
  const table: number[][] = [];

  for (let i = 0; i <= file1.length; i++) {
    const tmp: number[] = [];
    for (let j = 0; j <= file2.length; j++) {
      tmp.push(null);
    }
    table.push(tmp);
  }

  for (let j = 0; j <= file2.length; j++) {
    table[0][j] = 0;
  }
  for (let i = 0; i <= file1.length; i++) {
    table[i][0] = 0;
  }

  for (let i = 1; i <= file1.length; i++) {
    for (let j = 1; j <= file2.length; j++) {
      if (file1[i - 1] === file2[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
    }
  }

  let i = file1.length;
  let j = file2.length;

  const index: [number, number][] = [];
  while (table[i][j] !== 0 && i >= 0 && j >= 0) {
    if (table[i - 1][j] === table[i][j]) {
      i--;
    } else if (table[i][j - 1] === table[i][j]) {
      j--;
    } else {
      index.push([i - 1, j - 1]);
      i--;
      j--;
    }
  }

  const removed: number[] = [];
  const added: number[] = [];
  for (let i = 0; i < file1.length; i++) {
    if (!index.some(([x]) => x === i)) {
      removed.push(i);
    }
  }
  for (let j = 0; j < file2.length; j++) {
    if (!index.some(([, y]) => y === j)) {
      added.push(j);
    }
  }

  return [removed, added];
};

export const longestCommonSubsequenceHandler = (fileA: string, fileB: string) =>
  longestCommonSubsequence(fileA.split("\n"), fileB.split("\n"));
