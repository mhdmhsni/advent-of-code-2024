import fs from "fs";

const TAG = "day 17 - part 2";
type Register = "A" | "B" | "C";

const getComboValue = (
  registers: Record<Register, number>,
  operand: number
): number => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return registers.A;
    case 5:
      return registers.B;
    case 6:
      return registers.C;
    default:
      return 7;
  }
};

const adv = (registers: Record<Register, number>, operand: number): void => {
  //   console.log(`## adv(${operand})`);
  const numerator = registers.A;
  const denominator = Math.pow(2, getComboValue(registers, operand));
  const div = Math.trunc(numerator / denominator);
  registers.A = div;
};

const bxl = (registers: Record<Register, number>, operand: number): void => {
  //   console.log(`## bxl(${operand})`);
  const xor = (registers.B ^ operand) >>> 0; // unsigned XOR because JS sucks
  registers.B = xor;
};

const bst = (registers: Record<Register, number>, operand: number): void => {
  //   console.log(`## bst(${operand})`);
  const m = getComboValue(registers, operand);
  const r = m % 8;
  registers.B = r & 7; // lowest three bits
};

const jnz = (registers: Record<Register, number>, operand: number): boolean => {
  //   console.log(`## jnz(${operand})`);
  if (registers.A === 0) {
    return true;
  }
  return false;
};

const bxc = (registers: Record<Register, number>, operand: number): void => {
  //   console.log(`## bxc(${operand}): operand is ignored for legacy reasons`);
  const m = registers.B;
  const n = registers.C;
  registers.B = (m ^ n) >>> 0; // unsigned XOR because JS sucks
};

const out = (registers: Record<Register, number>, operand: number): number => {
  console.log(`## out(${operand})`);
  const m = getComboValue(registers, operand);
  const r = m % 8;
  const o = r & 7;
  console.log("output is:::::::: ", o);
  return o;
};

const bdv = (registers: Record<Register, number>, operand: number): void => {
  //   console.log(`## bdv(${operand})`);
  const numerator = registers.A;
  const denominator = Math.pow(2, getComboValue(registers, operand));
  const div = Math.trunc(numerator / denominator);
  registers.B = div;
};

const cdv = (registers: Record<Register, number>, operand: number): void => {
  //   console.log(`## cdv(${operand})`);
  const numerator = registers.A;
  const denominator = Math.pow(2, getComboValue(registers, operand));
  const div = Math.trunc(numerator / denominator);
  registers.C = div;
};

const runProgram = (
  registers: Record<Register, number>,
  program: number[]
): number[] => {
  console.log(
    `### running program for: ${
      JSON.stringify(registers) + " | " + program.join(",")
    }`
  );
  let instructionPointer = 0;
  const outputs: number[] = [];

  while (program[instructionPointer] !== undefined) {
    const currentOperand = program[instructionPointer + 1];
    let shouldJump = true;
    switch (program[instructionPointer]) {
      case 0:
        adv(registers, currentOperand);
        break;
      case 1:
        bxl(registers, currentOperand);
        break;
      case 2:
        bst(registers, currentOperand);
        break;
      case 3:
        shouldJump = jnz(registers, currentOperand);
        break;
      case 4:
        bxc(registers, currentOperand);
        break;
      case 5:
        outputs.push(out(registers, currentOperand));
        break;
      case 6:
        bdv(registers, currentOperand);
        break;
      case 7:
        cdv(registers, currentOperand);
        break;
      default:
        console.log("operation is not defined...");
        break;
    }
    console.log("$$ registers: " + JSON.stringify(registers));

    shouldJump
      ? (instructionPointer += 2)
      : (instructionPointer = program[instructionPointer + 1]);
  }

  console.log("Program Halting...");
  console.log("Returning output array...");
  console.log(`### The calculated output is: ${outputs.join(",")}`);
  return outputs;
};

/**
 * For part 2, knowing that every time 3 bits of A is used, we can work from the last program output to determine the leading bits,
 * and then search via leading bits + [000 - 111] iteratively until the program length is matched.
 */
const findA = (
  registers: Record<Register, number>,
  program: number[]
): number | undefined => {
  const Q = [];
  Q.push({ result: "", len: 0 });
  while (Q.length) {
    const q = Q.shift();
    if (!q) return;
    if (q.len === program.length) {
      return parseInt(q.result, 2); // found the answer
    }
    const from = parseInt(q.result + "000", 2);
    const to = parseInt(q.result + "111", 2);
    const expect = program.slice((q.len + 1) * -1).join(","); // that -1 is because we need to take a reverse slice (starting from the end)
    for (let a = from; a <= to; a++) {
      const r = runProgram({ ...registers, A: a }, program);
      if (r.join(",") === expect) {
        Q.push({ result: a.toString(2), len: q.len + 1 });
      }
    }
  }
};

const main = () => {
  console.time(TAG);

  const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");
  const registers: Record<Register, number> = {
    A: 0,
    B: 0,
    C: 0,
  };
  inputSplit[0].split("\n").forEach((line) => {
    const splitByColon = line.split(":");
    const register = splitByColon[0].split(" ")[1].toString() as Register;
    const value = parseInt(splitByColon[1].trim());
    registers[register] = value;
  });
  const program = inputSplit[1].split(":")[1].trim().split(",").map(Number);

  const outputs = runProgram(registers, program);
  const output = outputs.join(",");
  console.log("##### part 1: ", output);

  const smallestA = findA(registers, program);
  console.log("##### part 2: ", smallestA);

  console.timeEnd(TAG);
};

main();
