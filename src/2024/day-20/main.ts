import fs from "fs";

const TAG = "day 20";

type Point = [number, number];

const findTrack = (grid: string[][], start: Point, end: Point): Point[] => {
  const result: Point[] = [start];
  const seen: Set<string> = new Set([start.toString()]);

  while (result.at(-1)?.toString() !== end.toString()) {
    const [row, col] = result.at(-1) as Point;
    const neighborPoints = (
      [
        [row + 1, col],
        [row - 1, col],
        [row, col + 1],
        [row, col - 1],
      ] as Point[]
    ).find(
      ([neighborRow, neighborCol]) =>
        grid[neighborRow]?.[neighborCol] === "." &&
        !seen.has([neighborRow, neighborCol].toString())
    );

    if (!neighborPoints) throw new Error("No valid path found.");

    result.push(neighborPoints);
    seen.add(neighborPoints.toString());
  }

  return result;
};

const countCheatsByPos = (
  trackIndex: Map<string, number>,
  grid: string[][],
  row: number,
  col: number,
  d: number,
  minSaved: number
): number => {
  const i = trackIndex.get([row, col].toString());
  if (i === undefined) return 0;

  let result = 0;
  for (let neighborRow = row - d; neighborRow <= row + d; neighborRow++) {
    for (let neighborCol = col - d; neighborCol <= col + d; neighborCol++) {
      const dd = Math.abs(neighborRow - row) + Math.abs(neighborCol - col);
      const ni = trackIndex.get([neighborRow, neighborCol].toString());
      const saved = ni !== undefined ? ni - i - dd : -Infinity;

      if (
        dd <= d &&
        grid[neighborRow]?.[neighborCol] === "." &&
        saved >= minSaved
      ) {
        result++;
      }
    }
  }

  return result;
};

const countCheats = (track: Point[], grid: string[][], t: number): number => {
  const trackIndex = new Map<string, number>(
    track.map((v, k) => [v.toString(), k])
  );
  return track.reduce(
    (a, c) => a + countCheatsByPos(trackIndex, grid, c[0], c[1], t, 100),
    0
  );
};

const main = () => {
  console.time(TAG);
  let start: Point | undefined;
  let end: Point | undefined;
  const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");

  const grid: string[][] = input
    .split("\n")
    .map((value: string, index: number) => {
      return [...value].map((m, c) => {
        if (m === "S") {
          start = [index, c];
          return ".";
        }
        if (m === "E") {
          end = [index, c];
          return ".";
        }
        return m;
      });
    });

  if (!start || !end) {
    throw new Error("Start or end position not found in the input.");
  }

  const track = findTrack(grid, start, end);

  console.log("A", countCheats(track, grid, 2));
  console.log("B", countCheats(track, grid, 20));
  console.timeEnd(TAG);
};

main();
