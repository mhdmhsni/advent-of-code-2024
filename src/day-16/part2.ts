import fs from "fs";

interface Point {
  row: number;
  col: number;
}
interface State {
  pos: Point;
  dir: number;
  cost: number;
  path: Point[];
}

function findShortestPaths(grid: string[][]): Point[][] | null {
  const rows = grid.length;
  const cols = grid[0].length;

  const start: Point = { row: -1, col: -1 };
  const end: Point = { row: -1, col: -1 };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "S") {
        start.row = r;
        start.col = c;
      } else if (grid[r][c] === "E") {
        end.row = r;
        end.col = c;
      }
    }
  }

  if (start.row === -1 || end.row === -1) {
    return null;
  }

  const queue: State[] = [{ pos: start, dir: 1, cost: 0, path: [start] }];
  const visited: { [key: string]: number } = {};
  const shortestPaths: Point[][] = [];
  let minCost = Infinity;

  const getKey = (pos: Point, dir: number) => `${pos.row},${pos.col},${dir}`;

  while (queue.length > 0) {
    let minIndex = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].cost < queue[minIndex].cost) {
        minIndex = i;
      }
    }
    const current = queue.splice(minIndex, 1)[0];
    const key = getKey(current.pos, current.dir);

    if (visited[key] !== undefined && visited[key] <= current.cost) {
      continue;
    }
    visited[key] = current.cost;

    if (current.pos.row === end.row && current.pos.col === end.col) {
      if (current.cost < minCost) {
        minCost = current.cost;
        shortestPaths.length = 0;
        shortestPaths.push(current.path);
      } else if (current.cost == minCost) {
        shortestPaths.push(current.path);
      }
      continue;
    }
  }
  return shortestPaths;
}

function generateShortestPathGrid(grid: string[][]): string[][] {
  const shortestPaths = findShortestPaths(grid);
  console.log(shortestPaths);
  if (!shortestPaths || shortestPaths.length === 0) {
    return grid; // Return original grid if no path found
  }

  const pathTiles = new Set<string>();
  for (const path of shortestPaths) {
    for (const tile of path) {
      pathTiles.add(`${tile.row},${tile.col}`);
    }
  }

  const newGrid = grid.map((row) => row.slice()); // Deep copy

  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[0].length; c++) {
      if (pathTiles.has(`${r},${c}`)) {
        newGrid[r][c] = "O";
      }
    }
  }

  return newGrid;
}

const grid = fs
  .readFileSync(__dirname + "/input.txt", "utf-8")
  .split("\n")
  .map((row) => row.split(""));

const generatedGrid = generateShortestPathGrid(grid);

if (generatedGrid) {
  generatedGrid.forEach((row) => console.log(row.join("")));
} else {
  console.log("No path found.");
}
