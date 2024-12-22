import { loadFile } from "../utils/load-file";
import { processTime } from "../utils/process-time";

type Multiplier = 64 | 2048;
type Divisor = 32;

const TAG = "day 22 - part 1";
const PRUNE_MODULO = 16777216;
const PROCESS_LIMIT = 2000;

const multiply = (multiplicand: number, multiplier: Multiplier) =>
  multiplicand * multiplier;

const divide = (dividend: number, divisor: Divisor) =>
  Math.floor(dividend / divisor);

const prune = (value: number) => value % PRUNE_MODULO;

const mix = (multipliedValue: number, value: number) =>
  (multipliedValue ^ value) >>> 0; // unsigned right shift because JS sucks!

const multiply_by_64_mix_prune = (value: number) => {
  const multiplied = multiply(value, 64);
  const mixed = mix(multiplied, value);
  return prune(mixed);
};

const divide_by_32_mix_prune = (value: number) => {
  const divided = divide(value, 32);
  const mixed = mix(divided, value);
  return prune(mixed);
};

const multiply_by_2048_mix_prune = (value: number) => {
  const multiplied = multiply(value, 2048);
  const mixed = mix(multiplied, value);
  return prune(mixed);
};

const findSecretNumber = (value: number) => {
  let r = value;
  for (let i = 0; i < PROCESS_LIMIT; i++) {
    r = multiply_by_2048_mix_prune(
      divide_by_32_mix_prune(multiply_by_64_mix_prune(r))
    );
  }

  return r;
};

const main = () => {
  const input = loadFile(__dirname + "/input.txt");
  const lines = input.split("\n").map(Number);

  let sum = 0;
  for (const line of lines) {
    const sn = findSecretNumber(line);
    sum += sn;
  }

  console.log(sum);
};

processTime(TAG, main);
