import fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");
const equations = input.split("\n").map((line) => line.match(/\d+/g)!);
const operators = ["+", "*"];
const part2Operators = ["+", "*", "||"];

let r = 0;
let r2 = 0;

for (let i = 0; i < equations.length; i++) {
  const expectedResult = parseInt(equations[i][0], 10);
  const values = equations[i].slice(1).map(Number);

  const operatorPermutations = calculatePermutationsWithoutPrecedence(
    values,
    operators
  );

  for (let i = 0; i < operatorPermutations.length; i++) {
    if (operatorPermutations[i].value === expectedResult) {
      r += expectedResult;
      break;
    }
  }

  const part2OperatorPermutations = calculatePermutationsWithoutPrecedence(
    values,
    part2Operators
  );

  for (let i = 0; i < part2OperatorPermutations.length; i++) {
    if (part2OperatorPermutations[i].value === expectedResult) {
      r2 += expectedResult;
      break;
    }
  }
}

console.log({ part1: r, part2: r2 });

function calculatePermutationsWithoutPrecedence(
  numbers: number[],
  operators: string[]
): { expression: string; value: number }[] {
  const numOperators = numbers.length - 1; // Number of operators needed
  if (numOperators === 0) {
    return [{ expression: numbers[0].toString(), value: numbers[0] }];
  }

  const results: { expression: string; value: number }[] = [];

  function backtrack(currentOps: string[], index: number) {
    if (currentOps.length === numOperators) {
      // Evaluate the expression strictly left-to-right
      let expression = numbers[0].toString();
      let value = numbers[0];

      for (let i = 0; i < currentOps.length; i++) {
        expression += ` ${currentOps[i]} ${numbers[i + 1]}`;
        if (currentOps[i] === "+") {
          value += numbers[i + 1];
        } else if (currentOps[i] === "*") {
          value = value * numbers[i + 1];
        } else if (currentOps[i] === "||") {
          value = parseInt(`${value}${numbers[i + 1]}`, 10); // Concatenate as a number
        }
      }

      results.push({ expression, value });
      return;
    }

    for (const op of operators) {
      currentOps.push(op);
      backtrack(currentOps, index + 1);
      currentOps.pop();
    }
  }

  backtrack([], 0);
  return results;
}
