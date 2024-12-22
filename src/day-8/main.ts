import * as fs from "fs";

// I honesty didn't understand the requirement so I had to watch and learn.
// Here's the source where I learned from: https://www.youtube.com/watch?v=3VDHDUQDCTY

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();
const grid = input.split("\n");
const n = grid.length;

function inBounds(x: number, y: number): boolean {
  return 0 <= x && x < n && 0 <= y && y < n;
}

function* getAntinodes(
  a: [number, number],
  b: [number, number]
): Generator<[number, number]> {
  const [ax, ay] = a;
  const [bx, by] = b;

  const cx = ax - (bx - ax);
  const cy = ay - (by - ay);
  const dx = bx + (bx - ax);
  const dy = by + (by - ay);

  if (inBounds(cx, cy)) {
    yield [cx, cy];
  }
  if (inBounds(dx, dy)) {
    yield [dx, dy];
  }
}

const antinodes = new Set<string>();
const allLocs: Record<string, [number, number][]> = {};

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    const cell = grid[i][j];
    if (cell !== ".") {
      if (!allLocs[cell]) {
        allLocs[cell] = [];
      }
      allLocs[cell].push([i, j]);
    }
  }
}

for (const freq in allLocs) {
  const locs = allLocs[freq];
  for (let i = 0; i < locs.length; i++) {
    for (let j = i + 1; j < locs.length; j++) {
      const a = locs[i];
      const b = locs[j];
      for (const antinode of getAntinodes(a, b)) {
        antinodes.add(`${antinode[0]},${antinode[1]}`);
      }
    }
  }
}

console.log(antinodes.size);
