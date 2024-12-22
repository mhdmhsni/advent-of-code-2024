import fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");

type Equation = {
  a: number;
  b: number;
  c: number;
};

type EquationPair = {
  eq1: Equation;
  eq2: Equation;
};

function solveEquations(equations: EquationPair, adjustPrize = false) {
  const { eq1, eq2 } = equations;

  let adjustedPrize1 = eq1.c;
  let adjustedPrize2 = eq2.c;

  if (adjustPrize) {
    adjustedPrize1 += 10000000000000;
    adjustedPrize2 += 10000000000000;
  }

  const a1 = Math.round(
    (adjustedPrize2 - (eq2.b * adjustedPrize1) / eq1.b) /
      (eq2.a - (eq2.b * eq1.a) / eq1.b)
  );

  const a2 = Math.round((adjustedPrize1 - eq1.a * a1) / eq1.b);

  if (
    eq1.a * a1 + eq1.b * a2 === adjustedPrize1 &&
    eq2.a * a1 + eq2.b * a2 === adjustedPrize2
  )
    return { a: a1, b: a2 };
}

function main() {
  console.time("day 13 part 1 and 2");
  const equations = input.split("\n\n").map((block) => {
    const lines = block.split("\n");
    const buttonA = lines[0].match(/X\+(\d+), Y\+(\d+)/)!;
    const buttonB = lines[1].match(/X\+(\d+), Y\+(\d+)/)!;
    const prize = lines[2].match(/X=(\d+), Y=(\d+)/)!;
    return {
      eq1: {
        a: parseInt(buttonA[1]),
        b: parseInt(buttonB[1]),
        c: parseInt(prize[1]),
      },
      eq2: {
        a: parseInt(buttonA[2]),
        b: parseInt(buttonB[2]),
        c: parseInt(prize[2]),
      },
    } as EquationPair;
  });

  let r1 = 0;
  let r2 = 0;
  for (const equationPair of equations) {
    const ans1 = solveEquations(equationPair);
    if (ans1) {
      r1 += ans1.a * 3 + ans1.b;
    }

    const ans2 = solveEquations(equationPair, true);
    if (ans2) {
      r2 += ans2.a * 3 + ans2.b;
    }
  }

  console.log(r1);
  console.log(r2);
  console.timeEnd("day 13 part 1 and 2");
}

main();