import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");
const grid = input.trim().split("\n");

const n = grid.length;

const dd = [
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
  [-1, 0], // Up
];

function inGrid(i: number, j: number): boolean {
  return i >= 0 && i < n && j >= 0 && j < n;
}

function score(i: number, j: number): number {
  if (grid[i][j] !== "0") {
    return 0;
  }

  let ans = 0;
  const stack: [number, number][] = [[i, j]];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const [curi, curj] = stack.pop()!;
    const cur = parseInt(grid[curi][curj], 10);

    if (cur === 9) {
      ans += 1;
      continue;
    }

    for (const [di, dj] of dd) {
      const ii = curi + di;
      const jj = curj + dj;

      if (!inGrid(ii, jj)) {
        continue;
      }

      const nbr = parseInt(grid[ii][jj], 10);
      if (nbr !== cur + 1) {
        continue;
      }

      const key = `${ii},${jj}`;
      if (!visited.has(key)) {
        visited.add(key);
        stack.push([ii, jj]);
      }
    }
  }

  return ans;
}

let ans = 0;
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    ans += score(i, j);
  }
}

console.log(ans);
