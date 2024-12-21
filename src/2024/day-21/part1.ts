import { loadFile } from "../../utils/load-file";

const TAG = "day 21 - part 1";
type Point = [number, number];
type KeyPadData = {
  currentPointer: Point;
  currentValue: string;
};

const calculateComplexity = (line: string): number => {
  let complexity = 0;
  const numericPad = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [null, "0", "A"],
  ];

  const directionalPad = [
    [null, "^", "A"],
    ["<", "v", ">"],
  ];

  return complexity;
};

const main = () => {
  console.time(TAG);
  const input = loadFile(__dirname + "/input.txt").trim();
  const lines = input.split("\n");

  let totalComplexity = 0;
  for (const line of lines) {
    console.log(line);
    totalComplexity += calculateComplexity(line);
  }

  console.log("total complexity", totalComplexity);

  console.timeEnd(TAG);
};

main();
