import fs from "fs";

type Position = {
  row: number;
  col: number;
};

type Direction = "up" | "down" | "left" | "right";

type TrackHistory = {
  pos: Position;
  dir: Direction;
}[];

function turn90DegreesToRight(direction: Direction): Direction {
  switch (direction) {
    case "up":
      return "right";
    case "right":
      return "down";
    case "down":
      return "left";
    case "left":
      return "up";
  }
}

function canGuardMoveForward(
  position: Position,
  direction: Direction,
  grid: string[][]
): Position | undefined {
  switch (direction) {
    case "up": {
      return grid[position.row - 1][position.col] === "."
        ? {
            row: position.row - 1,
            col: position.col,
          }
        : undefined;
    }
    case "down": {
      return grid[position.row + 1][position.col] === "."
        ? {
            row: position.row + 1,
            col: position.col,
          }
        : undefined;
    }
    case "left": {
      return grid[position.row][position.col - 1] === "."
        ? {
            row: position.row,
            col: position.col - 1,
          }
        : undefined;
    }
    case "right": {
      return grid[position.row][position.col + 1] === "."
        ? {
            row: position.row,
            col: position.col + 1,
          }
        : undefined;
    }
  }
}

function isGuardInGridBoundaries(
  position: Position,
  grid: string[][]
): boolean {
  return (
    position.row > 0 &&
    position.row < grid.length - 1 &&
    position.col > 0 &&
    position.col < grid[position.row].length - 1
  );
}

function getInitialPosition(grid: string[][]): Position {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === "^") {
        return {
          row,
          col,
        };
      }
    }
  }

  return {
    row: 0,
    col: 0,
  };
}

function pushToVisitedSpots(
  position: Position,
  visitedSpots: Position[]
): void {
  const index = visitedSpots.findIndex(
    (spot) => spot.row === position.row && spot.col === position.col
  );
  if (index === -1) {
    visitedSpots.push(position);
  }
}

function checkIfItsALoop(grid: string[][]): boolean {
  const history: TrackHistory = [];
  let currentPosition: Position = getInitialPosition(grid);
  let currentDirection: Direction = "up";

  while (true) {
    if (isGuardInGridBoundaries(currentPosition, grid)) {
      const nextPositionOnSameDirection = canGuardMoveForward(
        currentPosition,
        currentDirection,
        grid
      );
      if (nextPositionOnSameDirection) {
        const index = history.findIndex(
          (item) =>
            item.pos.row === nextPositionOnSameDirection.row &&
            item.pos.col === nextPositionOnSameDirection.col &&
            item.dir === currentDirection
        );
        if (index !== -1) {
          return true;
        }
        history.push({
          pos: nextPositionOnSameDirection,
          dir: currentDirection,
        });
        currentPosition = nextPositionOnSameDirection;
      } else {
        currentDirection = turn90DegreesToRight(currentDirection);
      }
    } else {
      break;
    }
  }

  return false;
}

function findVisitedSpots(grid: string[][]): Position[] {
  const visitedSpots: Position[] = [];
  let currentPosition: Position = getInitialPosition(grid);
  visitedSpots.push(currentPosition);
  let currentDirection: Direction = "up";

  while (true) {
    if (isGuardInGridBoundaries(currentPosition, grid)) {
      const nextPositionOnSameDirection = canGuardMoveForward(
        currentPosition,
        currentDirection,
        grid
      );
      if (nextPositionOnSameDirection) {
        pushToVisitedSpots(nextPositionOnSameDirection, visitedSpots);
        currentPosition = nextPositionOnSameDirection;
      } else {
        currentDirection = turn90DegreesToRight(currentDirection);
      }
    } else {
      break;
    }
  }

  return visitedSpots;
}

function findLoops(grid: string[][]): number {
  const visitedSpots: Position[] = findVisitedSpots(grid).slice(1);
  const cloneGrid = JSON.parse(JSON.stringify(grid));

  let loopCounter = 0;
  for (let i = 1; i < visitedSpots.length; i++) {
    console.log("progress: ", (i / visitedSpots.length) * 100, "%");
    const currentSpot = visitedSpots[i];
    cloneGrid[currentSpot.row][currentSpot.col] = "#";
    const isLoop = checkIfItsALoop(cloneGrid);
    if (isLoop) loopCounter += 1;
    cloneGrid[currentSpot.row][currentSpot.col] = ".";
  }

  return loopCounter;
}

function findGuardPath(grid: string[][]): number {
  const visitedSpots: Position[] = findVisitedSpots(grid);
  return visitedSpots.length;
}

function main(): void {
  const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");
  const lines = input.split("\n");
  const grid = lines.map((line) => line.split(""));

  const part1 = findGuardPath(grid);
  const part2 = findLoops(grid); // this one gives 2210, where the correct answer is 2188. I could not find where I did wrong honestly. I'll revisit later. For now the `part2.ts` file should do the job. It's based on https://www.youtube.com/watch?v=PivtIotcOhw
  console.log({ part1, part2 });
}

main();
