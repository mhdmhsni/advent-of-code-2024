import fs from "fs";

const TAG = "day 18 - part 2";

type Point = {
  x: number;
  y: number;
};

type Grid = {
  width: number;
  height: number;
  grid: string[][];
};

const getNeighbors = (p: Point, grid: Grid): Point[] => {
  const neighbors: Point[] = [];
  const { width, height, grid: gridData } = grid;

  const possibleNeighbors = [
    { x: p.x + 1, y: p.y },
    { x: p.x - 1, y: p.y },
    { x: p.x, y: p.y + 1 },
    { x: p.x, y: p.y - 1 },
  ];

  for (const n of possibleNeighbors) {
    if (
      n.x >= 0 &&
      n.x < width &&
      n.y >= 0 &&
      n.y < height &&
      gridData[n.y][n.x] === "."
    ) {
      neighbors.push(n);
    }
  }

  return neighbors;
};

const dijkstra = (grid: Grid): Point[] | null => {
  const start: Point = { x: 0, y: 0 };
  const end: Point = { x: grid.width - 1, y: grid.height - 1 };

  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: Point | null } = {};
  const queue: Point[] = [];

  const getKey = (p: Point) => `${p.x},${p.y}`;

  distances[getKey(start)] = 0;
  queue.push(start);

  while (queue.length > 0) {
    // Find the point with the smallest distance (simple linear search for now)
    let minIndex = 0;
    for (let i = 1; i < queue.length; i++) {
      if (distances[getKey(queue[i])] < distances[getKey(queue[minIndex])]) {
        minIndex = i;
      }
    }
    const current = queue.splice(minIndex, 1)[0];

    if (current.x === end.x && current.y === end.y) {
      break; // Found the end
    }

    const neighbors = getNeighbors(current, grid);

    for (const neighbor of neighbors) {
      const dist = distances[getKey(current)] + 1; // All steps have weight 1
      const neighborKey = getKey(neighbor);

      if (
        distances[neighborKey] === undefined ||
        dist < distances[neighborKey]
      ) {
        distances[neighborKey] = dist;
        previous[neighborKey] = current;
        queue.push(neighbor);
      }
    }
  }

  if (previous[getKey(end)] === undefined) {
    return null; // No path found
  }

  // Reconstruct path
  const path: Point[] = [];
  let current: Point | null = end;
  while (current) {
    path.unshift(current);
    current = previous[getKey(current)];
  }

  return path;
};

const getCorruptedGrid = (grid: string[][], corruptedTiles: Point[]) => {
  const clone = [...grid];
  for (const ct of corruptedTiles) {
    const { x, y } = ct;
    clone[y][x] = "#";
  }
  return clone;
};

const stringifyTheGrid = (grid: string[][]) => {
  return grid.map((line) => line.join("")).join("\n");
};

const main = () => {
  console.time(TAG);

  const input = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();
  const corrupted: Point[] = input.split("\n").map((line) => {
    const [x, y] = line.split(",").map(Number);
    return {
      x,
      y,
    };
  });
  const rows = 71;
  const cols = rows;

  const INITIAL_GRID = Array.from({ length: rows }, () =>
    Array(cols).fill(".")
  );

  let pathFound = true;
  let corruptedTilesNumber = 1024;
  let lastFoundPath: Point[] | null = [];
  while (pathFound) {
    const newCorruptedTile = corrupted[corruptedTilesNumber - 1];
    const index = lastFoundPath.findIndex(
      (el) => el.x === newCorruptedTile.x && el.y === newCorruptedTile.y
    );
    if (lastFoundPath.length > 0 && index === -1) {
      corruptedTilesNumber++;
      continue;
    }

    const validCorruptedTiles = corrupted.slice(0, corruptedTilesNumber);
    const grid: Grid = {
      width: cols,
      height: rows,
      grid: getCorruptedGrid(INITIAL_GRID, validCorruptedTiles),
    };

    const r = dijkstra(grid);
    if (r) {
      lastFoundPath = r;
      corruptedTilesNumber++;
    } else {
      pathFound = false;
      console.log(validCorruptedTiles[validCorruptedTiles.length - 1]);
    }
  }

  console.timeEnd(TAG);
};

main();
