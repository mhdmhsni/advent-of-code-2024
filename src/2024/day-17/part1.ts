import fs from "fs";

const TAG = "day 17 - part 1";
type Register = "A" | "B" | "C";
const registers: Record<Register, number> = {
  A: 0,
  B: 0,
  C: 0,
};
let instructionPointer = 0;
const outputs: number[] = [];

const getComboValue = (operand: number): number => {
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

const nextInstructionPointer = () => {
  instructionPointer += 2;
};

const adv = (operand: number): void => {
  console.log(`## adv(${operand})`);
  const numerator = registers.A;
  const denominator = Math.pow(2, getComboValue(operand));
  const div = Math.trunc(numerator / denominator);
  registers.A = div;
  nextInstructionPointer();
};

const bxl = (operand: number): void => {
  console.log(`## bxl(${operand})`);
  const xor = registers.B ^ operand;
  registers.B = xor;
  nextInstructionPointer();
};

const bst = (operand: number): void => {
  console.log(`## bst(${operand})`);
  const m = getComboValue(operand);
  const r = m % 8;
  registers.B = r & 7; // lowest three bits
  nextInstructionPointer();
};

const jnz = (operand: number): void => {
  console.log(`## jnz(${operand})`);
  if (registers.A === 0) {
    nextInstructionPointer();
    return;
  }
  instructionPointer = operand;
};

const bxc = (operand: number): void => {
  console.log(`## bxc(${operand}): operand is ignored for legacy reasons`);
  const m = registers.B;
  const n = registers.C;
  registers.B = m ^ n;
  nextInstructionPointer();
};

const out = (operand: number): void => {
  console.log(`## out(${operand})`);
  const m = getComboValue(operand);
  const r = m % 8;
  const o = r & 7;
  outputs.push(o);
  nextInstructionPointer();
};

const bdv = (operand: number): void => {
  console.log(`## bdv(${operand})`);
  const numerator = registers.A;
  const denominator = Math.pow(2, getComboValue(operand));
  const div = Math.trunc(numerator / denominator);
  registers.B = div;
  nextInstructionPointer();
};

const cdv = (operand: number): void => {
  console.log(`## cdv(${operand})`);
  const numerator = registers.A;
  const denominator = Math.pow(2, getComboValue(operand));
  const div = Math.trunc(numerator / denominator);
  registers.C = div;
  nextInstructionPointer();
};

const runProgram = (program: number[]): void => {
  while (instructionPointer < program.length) {
    const currentOperand = program[instructionPointer + 1];

    switch (program[instructionPointer]) {
      case 0:
        adv(currentOperand);
        break;
      case 1:
        bxl(currentOperand);
        break;
      case 2:
        bst(currentOperand);
        break;
      case 3:
        jnz(currentOperand);
        break;
      case 4:
        bxc(currentOperand);
        break;
      case 5:
        out(currentOperand);
        break;
      case 6:
        bdv(currentOperand);
        break;
      case 7:
        cdv(currentOperand);
        break;
      default:
        console.log("operation is not defined...");
        break;
    }
    console.log("$$ registers: " + JSON.stringify(registers));
  }

  console.log("Program Halting...");
};

const main = () => {
  console.time(TAG);

  const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");
  inputSplit[0].split("\n").forEach((line) => {
    const splitByColon = line.split(":");
    const register = splitByColon[0].split(" ")[1].toString() as Register;
    const value = parseInt(splitByColon[1].trim());
    registers[register] = value;
  });
  const program = inputSplit[1].split(":")[1].trim().split(",").map(Number);

  runProgram(program);

  const output = outputs.join(",");
  console.log(output);

  console.timeEnd(TAG);
};

main();
