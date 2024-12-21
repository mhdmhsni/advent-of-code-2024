import fs from "fs";

function findXMAS(input: string): number {
  const rows = input.split("\n").map((row) => row.split(""));
  const table = Array.from(rows);

  let matchCounts = {
    row: 0,
    rowReverse: 0,
    column: 0,
    columnReverse: 0,
    diagonal: 0,
    diagonalReverse: 0,
    diagonalB2T: 0,
    diagonalB2TReverse: 0,
  };

  for (let i = 0; i < table.length; i++) {
    // search in the row
    let row = table[i].join("");
    matchCounts.row += row.match(/XMAS/g)?.length || 0;

    // search in the row reverse
    let rowReverse = table[i].join("");
    matchCounts.rowReverse += rowReverse.match(/SAMX/g)?.length || 0;
  }

  for (let i = 0; i < table[0].length; i++) {
    // search in the column
    let column = table.map((row) => row[i]).join("");
    matchCounts.column += column.match(/XMAS/g)?.length || 0;

    // search in the column reverse
    let columnReverse = table.map((row) => row[i]).join("");
    matchCounts.columnReverse += columnReverse.match(/SAMX/g)?.length || 0;
  }

  for (let i = 0; i < table.length; i++) {
    // search in the diagonal from left to right
    for (let j = 0; j < table[i].length; j++) {
      if (table[i][j] === "X") {
        if (i + 3 < table.length && j + 3 < table[i].length) {
          if (
            table[i + 1][j + 1] === "M" &&
            table[i + 2][j + 2] === "A" &&
            table[i + 3][j + 3] === "S"
          ) {
            matchCounts.diagonal++;
          }
        }
      }
    }

    // search in the diagonal from right to left
    for (let j = table[i].length - 1; j >= 0; j--) {
      if (table[i][j] === "X") {
        if (i + 3 < table.length && j - 3 >= 0) {
          if (
            table[i + 1][j - 1] === "M" &&
            table[i + 2][j - 2] === "A" &&
            table[i + 3][j - 3] === "S"
          ) {
            matchCounts.diagonalReverse++;
          }
        }
      }
    }

    // search in the diagonal from bottom to top
    for (let j = 0; j < table[i].length; j++) {
      if (table[i][j] === "X") {
        if (i - 3 >= 0 && j + 3 < table[i].length) {
          if (
            table[i - 1][j + 1] === "M" &&
            table[i - 2][j + 2] === "A" &&
            table[i - 3][j + 3] === "S"
          ) {
            matchCounts.diagonalB2T++;
          }
        }
      }
    }

    // search in the diagonal from bottom to top in reverse
    for (let j = table[i].length - 1; j >= 0; j--) {
      if (table[i][j] === "X") {
        if (i - 3 >= 0 && j - 3 >= 0) {
          if (
            table[i - 1][j - 1] === "M" &&
            table[i - 2][j - 2] === "A" &&
            table[i - 3][j - 3] === "S"
          ) {
            matchCounts.diagonalB2TReverse++;
          }
        }
      }
    }
  }

  console.log({ matchCounts });
  return Object.values(matchCounts).reduce((acc, curr) => acc + curr, 0);
}

function findXShapedMAS(input: string): number {
  const rows = input.split("\n").map((row) => row.split(""));
  const table = Array.from(rows);

  let matchCounts = 0;

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      // stupid boundaries check, could have been a simple padding
      if (
        i - 1 >= 0 &&
        j - 1 >= 0 &&
        i + 1 < table.length &&
        j + 1 < table[i].length
      ) {
        if (table[i][j] === "A") {
          // M  M
          //  A
          // S  S
          if (table[i - 1][j - 1] === "M" && table[i - 1][j + 1] === "M") {
            if (table[i + 1][j - 1] === "S" && table[i + 1][j + 1] === "S") {
              matchCounts++;
            }
          }

          // S  S
          //  A
          // M  M
          if (table[i - 1][j - 1] === "S" && table[i - 1][j + 1] === "S") {
            if (table[i + 1][j - 1] === "M" && table[i + 1][j + 1] === "M") {
              matchCounts++;
            }
          }

          // S  M
          //  A
          // S  M
          if (table[i - 1][j - 1] === "S" && table[i - 1][j + 1] === "M") {
            if (table[i + 1][j - 1] === "S" && table[i + 1][j + 1] === "M") {
              matchCounts++;
            }
          }

          // M  S
          //  A
          // M  S
          if (table[i - 1][j - 1] === "M" && table[i - 1][j + 1] === "S") {
            if (table[i + 1][j - 1] === "M" && table[i + 1][j + 1] === "S") {
              matchCounts++;
            }
          }
        }
      }
    }
  }

  return matchCounts;
}

function main(): void {
  const input = fs.readFileSync("src/day-4/input.txt", "utf-8");

  const part1 = findXMAS(input);
  const part2 = findXShapedMAS(input);

  console.log({ part1, part2 });
}

main();
