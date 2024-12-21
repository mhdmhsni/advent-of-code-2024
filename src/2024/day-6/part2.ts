import * as fs from "fs";
import * as path from "path";

// For this one I cheated. sorry.

// Read and parse the input file
const inputPath = path.join(__dirname, "./input.txt");
const grid: string[][] = fs
  .readFileSync(inputPath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const n: number = grid.length;
const m: number = grid[0].length;

// Find the starting position of "^"
let found: boolean = false;
let ii: number = 0,
  jj: number = 0;
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    if (grid[i][j] === "^") {
      found = true;
      ii = i;
      jj = j;
      break;
    }
  }
  if (found) break;
}

const dd: [number, number][] = [
  [-1, 0], // Up
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
];

// Assess possible starting locations
let dir: number = 0;
const ogSeen: Set<string> = new Set();
let i: number = ii,
  j: number = jj;

while (true) {
  ogSeen.add(`${i},${j}`); // Using strings for coordinates

  const nextI: number = i + dd[dir][0];
  const nextJ: number = j + dd[dir][1];

  if (!(0 <= nextI && nextI < n && 0 <= nextJ && nextJ < m)) {
    break;
  }

  if (grid[nextI][nextJ] === "#") {
    dir = (dir + 1) % 4; // Change direction
  } else {
    i = nextI;
    j = nextJ;
  }
}

function willLoop(oi: number, oj: number): boolean {
  if (grid[oi][oj] === "#") {
    return false;
  }

  grid[oi][oj] = "#"; // Temporarily mark as obstacle
  let i: number = ii,
    j: number = jj;
  let dir: number = 0;
  const seen: Set<string> = new Set();

  while (true) {
    const key: string = `${i},${j},${dir}`;
    if (seen.has(key)) {
      grid[oi][oj] = "."; // Restore grid
      return true;
    }
    seen.add(key);

    const nextI: number = i + dd[dir][0];
    const nextJ: number = j + dd[dir][1];

    if (!(0 <= nextI && nextI < n && 0 <= nextJ && nextJ < m)) {
      grid[oi][oj] = "."; // Restore grid
      return false;
    }

    if (grid[nextI][nextJ] === "#") {
      dir = (dir + 1) % 4; // Change direction
    } else {
      i = nextI;
      j = nextJ;
    }
  }
}

// Count the number of loops
let ans: number = 0;
for (const key of ogSeen) {
  const [oi, oj]: [number, number] = key.split(",").map(Number) as [
    number,
    number
  ];
  if (willLoop(oi, oj)) {
    ans += 1;
  }
}

console.log(ans);
