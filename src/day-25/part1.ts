import { loadFile } from "../utils/load-file";
import { processTime } from "../utils/process-time";

const calculateHeights = (schematic: string): number[] => {
  const grid = schematic.split("\n").map((row) => row.split(""));
  const heights = Array.from({ length: grid[0].length }, () => -1);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "#") {
        heights[j]++;
      }
    }
  }

  return heights;
};

const main = () => {
  const input = loadFile(__dirname + "/input.txt");
  const locks: string[] = [];
  const keys: string[] = [];

  const locksHeights: number[][] = [];
  const keysHeights: number[][] = [];

  input.split("\n\n").forEach((group) => {
    const lines = group.split("\n");
    if (lines[0].split("").every((char) => char === "#")) {
      locks.push(group);
    }

    if (lines[lines.length - 1].split("").every((char) => char === "#")) {
      keys.push(group);
    }
  });

  locks.forEach((lock) => {
    const heights = calculateHeights(lock);
    locksHeights.push(heights);
  });

  keys.forEach((key) => {
    const heights = calculateHeights(key);
    keysHeights.push(heights);
  });

  const TOTAL_HEIGHT = locks[0].split("\n").length - 1;

  let matchesFound = 0;
  for (let i = 0; i < locksHeights.length; i++) {
    const currentLock = locksHeights[i];

    for (let j = 0; j < keysHeights.length; j++) {
      const currentKey = keysHeights[j];
      let overlaps = false;

      for (let k = 0; k < currentLock.length; k++) {
        if (currentLock[k] + currentKey[k] >= TOTAL_HEIGHT) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        matchesFound++;
      }
    }
  }

  console.log({ matchesFound });
};

const TAG = "day 25 - part 1";
processTime(TAG, main);
