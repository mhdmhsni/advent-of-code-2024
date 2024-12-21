import fs from "fs";

type Region = {
  area: number;
  perimeter: number;
};

const input = fs.readFileSync(__dirname + "/input.txt", "utf8");

const processedPlots: Set<string> = new Set();

function main() {
  console.time("day 12 part 1");
  const grid = input
    .trim()
    .split("\n")
    .map((line) => line.split(""));

  let result = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const region = getRegionData(grid, i, j);
      if (region) {
        result += region.area * region.perimeter;
      }
    }
  }

  console.log(result);
  console.timeEnd("day 12 part 1");
}

function getRegionData(
  grid: string[][],
  i: number,
  j: number
): Region | undefined {
  if (processedPlots.has(getSetId(i, j))) return undefined;
  const regionData: Region = {
    area: 0,
    perimeter: 0,
  };
  const plot = grid[i][j];
  processRegion(grid, plot, regionData, i, j);
  return regionData;
}

function getSetId(i: number, j: number): string {
  return (j * 1000 + i).toString();
}

function processRegion(
  grid: string[][],
  plot: string,
  regionData: Region,
  i: number,
  j: number
): Region | undefined {
  if (processedPlots.has(getSetId(i, j))) return undefined;
  regionData.area += 1;
  processedPlots.add(getSetId(i, j));

  // right
  if (j < grid[i].length - 1 && grid[i][j + 1] === plot) {
    processRegion(grid, plot, regionData, i, j + 1);
  } else {
    regionData.perimeter += 1;
  }

  // down
  if (i < grid.length - 1 && grid[i + 1][j] === plot) {
    processRegion(grid, plot, regionData, i + 1, j);
  } else {
    regionData.perimeter += 1;
  }

  // left
  if (j > 0 && grid[i][j - 1] === plot) {
    processRegion(grid, plot, regionData, i, j - 1);
  } else {
    regionData.perimeter += 1;
  }

  // up
  if (i > 0 && grid[i - 1][j] === plot) {
    processRegion(grid, plot, regionData, i - 1, j);
  } else {
    regionData.perimeter += 1;
  }
}

main();
