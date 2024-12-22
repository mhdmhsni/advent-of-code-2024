import { loadFile } from "../utils/load-file";
import { processTime } from "../utils/process-time";

type Multiplier = 64 | 2048;
type Divisor = 32;

const TAG = "day 22 - part 1";
const PRUNE_MODULO = 16777216;
const PROCESS_LIMIT = 2000;

const multiplyBy64 = (multiplicand: number) => multiplicand << 6;

const multiplyBy2048 = (multiplicand: number) => multiplicand << 11;

const divideBy32 = (dividend: number) => Math.floor(dividend >> 5);

const prune = (value: number) => value & (PRUNE_MODULO - 1);

const mix = (multipliedValue: number, value: number) =>
  (multipliedValue ^ value) >>> 0; // unsigned right shift because JS sucks!

const multiply_by_64_mix_prune = (value: number) => {
  const multiplied = multiplyBy64(value);
  const mixed = mix(multiplied, value);
  return prune(mixed);
};

const divide_by_32_mix_prune = (value: number) => {
  const divided = divideBy32(value);
  const mixed = mix(divided, value);
  return prune(mixed);
};

const multiply_by_2048_mix_prune = (value: number) => {
  const multiplied = multiplyBy2048(value);
  const mixed = mix(multiplied, value);
  return prune(mixed);
};

const findSecretNumber = (value: number) => {
  let secretNumber = value;
  for (let i = 0; i < PROCESS_LIMIT; i++) {
    secretNumber = multiply_by_2048_mix_prune(
      divide_by_32_mix_prune(multiply_by_64_mix_prune(secretNumber))
    );
  }

  return secretNumber;
};

const main = () => {
  const input = loadFile(__dirname + "/input.txt");
  const lines = input.split("\n").map(Number);

  let sum = 0;
  for (const line of lines) {
    sum += findSecretNumber(line);
  }

  console.log(sum);
};

processTime(TAG, main);
