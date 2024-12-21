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

function findPath(grid: string[][]): { cost: number; path: Point[] } | null {
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

  const getKey = (pos: Point, dir: number) => `${pos.row},${pos.col},${dir}`;

  while (queue.length > 0) {
    // Find the state with the *lowest* cost in the queue (Dijkstra's essential step)
    let minIndex = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].cost < queue[minIndex].cost) {
        minIndex = i;
      }
    }
    const current = queue.splice(minIndex, 1)[0]; // Remove from queue

    const key = getKey(current.pos, current.dir);

    if (visited[key] !== undefined && visited[key] <= current.cost) {
      continue; // Skip if we've already reached this state with a lower or equal cost
    }
    visited[key] = current.cost; // Only update visited AFTER the check

    if (current.pos.row === end.row && current.pos.col === end.col) {
      return { cost: current.cost, path: current.path };
    }

    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    for (let i = 0; i < 4; i++) {
      let nextDir = i;
      let turnCost = 0;
      if (nextDir !== current.dir) {
        turnCost = 1000;
      }

      const nextPos: Point = {
        row: current.pos.row + directions[i][0],
        col: current.pos.col + directions[i][1],
      };

      if (
        nextPos.row >= 0 &&
        nextPos.row < rows &&
        nextPos.col >= 0 &&
        nextPos.col < cols &&
        grid[nextPos.row][nextPos.col] !== "#"
      ) {
        const newPath = [...current.path, nextPos];
        queue.push({
          pos: nextPos,
          dir: nextDir,
          cost: current.cost + 1 + turnCost,
          path: newPath,
        });
      }
    }
  }

  return null;
}

const grid = fs
  .readFileSync(__dirname + "/input.txt", "utf-8")
  .split("\n")
  .map((row) => row.split(""));

const result = findPath(grid);

if (result) {
  console.log("Cost:", result.cost);
  console.log("Path:", result.path);
} else {
  console.log("No path found.");
}
