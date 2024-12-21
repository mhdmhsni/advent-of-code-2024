import { loadFile } from "../../utils/load-file";

/**
 * I couldn't figure out how to solve this problem, so I looked up the solution from here:
 * https://www.reddit.com/r/adventofcode/comments/1hj2odw/comment/m367q41/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
 * But definitely a learning point for me.
 * TODO: Understand the solution and implement it myself.
 */

// A Path contains lanternfish-style buckets for each sequence defining the "step" between two keypresses.
type Path = Map<string, number>;

const part = 2;

const numPad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [" ", "0", "A"],
];

const dPad = [
  [" ", "^", "A"],
  ["<", "v", ">"],
];

const bestSteps = new Map<string, string>();

const totalComplexity = () =>
  loadFile(__dirname + "/input.txt")
    .trim()
    .split(/\n/)
    .map(complexity)
    .reduce((a, b) => a + b, 0);

const complexity = (code: string) =>
  pathLength(findNestedPath(code, [2, 25][part - 1])) *
  Number(code.slice(0, 3));

const findNestedPath = (code: string, depth: number): Map<string, number> =>
  depth
    ? findMinPath(dPad, findNestedPath(code, depth - 1))
    : findMinPath(numPad, new Map([[code, 1]]));

const findMinPath = (pad: string[][], current: Path) => {
  const [, blankY] = findKey(pad, " ");
  const path = new Map<string, number>();
  [...current.entries()].forEach(([step, count]) =>
    step
      .split("")
      .map((key, i, keys) => [keys[(i - 1 + keys.length) % keys.length], key])
      .map(([start, end]) => controlStep(pad, start, end, blankY))
      .forEach((step) => path.set(step!, (path.get(step!) ?? 0) + count))
  );
  return path;
};

// Determines the lowest-complexity control sequence that will move to the next key and press it.
const controlStep = (
  pad: string[][],
  start: string,
  end: string,
  blankY: number
) => {
  const [xI, yI] = findKey(pad, start);
  const [xO, yO] = findKey(pad, end);
  const stepX = xI < xO ? ">".repeat(xO - xI) : "<".repeat(xI - xO);
  const stepY = yI < yO ? "v".repeat(yO - yI) : "^".repeat(yI - yO);

  return !stepX || !stepY
    ? `${stepX}${stepY}A`
    : xI === 0 && yO === blankY
    ? `${stepX}${stepY}A`
    : yI === blankY && xO === 0
    ? `${stepY}${stepX}A`
    : betterStep(`${stepX}${stepY}A`, `${stepY}${stepX}A`);
};

// A memoized selector to choose the lowest-complexity step when there's not an obvious choice.
const betterStep = (a: string, b: string) => {
  const choice = `${a},${b}`;
  if (bestSteps.has(choice)) return bestSteps.get(choice);

  // Arbitrarily set choice to the first option to avoid a recursive loop
  bestSteps.set(choice, a);
  let [pathA, pathB] = [a, b].map((step) => new Map([[step, 1]]));
  let lengthA: number, lengthB: number;
  do {
    [pathA, pathB] = [pathA, pathB].map((p) => findMinPath(dPad, p));
  } while ((lengthA = pathLength(pathA)) === (lengthB = pathLength(pathB)));

  bestSteps.set(choice, lengthA < lengthB ? a : b);
  return bestSteps.get(choice);
};

const findKey = (pad: string[][], char: string) => {
  const y = pad.findIndex((row) => row.includes(char));
  return [pad[y].indexOf(char), y];
};

const pathLength = (path: Map<string, number>) =>
  [...path.entries()]
    .map(([step, count]) => step.length * count)
    .reduce((a, b) => a + b, 0);

const c = totalComplexity();
console.log(c);
