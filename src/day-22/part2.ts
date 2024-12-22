import { loadFile } from "../utils/load-file";
import { processTime } from "../utils/process-time";

type Multiplier = 64 | 2048;
type Divisor = 32;

const TAG = "day 22 - part 2";

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

const getFirstDigit = (value: number) => value % 10;

const getLast4DigitsKey = (arr: number[]) => arr.join(",");

const updateLast4Digits = (
  arr: number[],
  secretNumber: number,
  previousDigit: number
) => {
  return [...arr.slice(1), getFirstDigit(secretNumber) - previousDigit];
};

const updateDict = (
  dict: Record<string, number>,
  key: string,
  secretNumber: number
) => {
  dict[key] = (dict[key] || 0) + (secretNumber % 10);
};

const findSecretNumber = (value: number, dict: Record<string, number>) => {
  let secretNumber = value;
  const seen = new Set<string>();
  let last4 = [10, 10, 10, 10];

  for (let i = 0; i < PROCESS_LIMIT; i++) {
    const previousDigit = getFirstDigit(secretNumber);

    secretNumber = multiply_by_2048_mix_prune(
      divide_by_32_mix_prune(multiply_by_64_mix_prune(secretNumber))
    );

    last4 = updateLast4Digits(last4, secretNumber, previousDigit); // update the last 4 changes
    const key = getLast4DigitsKey(last4);

    if (!seen.has(key)) {
      seen.add(key);
      updateDict(dict, key, secretNumber);
    }
  }

  return;
};

const main = () => {
  const input = loadFile(__dirname + "/input.txt");
  const lines = input.split("\n").map(Number);

  const dict: Record<string, number> = {};
  for (const line of lines) {
    findSecretNumber(line, dict); // dict is passed by reference
  }

  const max = Math.max(...Object.values(dict));

  console.log(max);
};

processTime(TAG, main);
