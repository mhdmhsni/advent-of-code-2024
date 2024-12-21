import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");
const grid = input.trim().split("\n");
const n = grid.length;

// Directions
const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

// Check if coordinates are in bounds
function inGrid(i: number, j: number): boolean {
  return i >= 0 && i < n && j >= 0 && j < n;
}

// Implementing a simple cache to mimic lru_cache
const ratingCache: Map<string, number> = new Map();

function rating(i: number, j: number): number {
  const cacheKey = `${i},${j}`;
  if (ratingCache.has(cacheKey)) {
    return ratingCache.get(cacheKey)!;
  }

  if (grid[i][j] === "9") {
    ratingCache.set(cacheKey, 1);
    return 1;
  }

  let ans = 0;
  for (const [di, dj] of directions) {
    const ii = i + di;
    const jj = j + dj;
    if (!inGrid(ii, jj)) continue;

    if (parseInt(grid[ii][jj]) === parseInt(grid[i][j]) + 1) {
      ans += rating(ii, jj);
    }
  }

  ratingCache.set(cacheKey, ans);
  return ans;
}

let ans = 0;
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (grid[i][j] === "0") {
      ans += rating(i, j);
    }
  }
}

console.log(ans);
