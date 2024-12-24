/**
 * This is incomplete.
 * I was trying to solve this problem programmatically but I realized that it was not the best approach.
 * So I started to go through the instructions manually.
 * Half way there but I won't be able to finish it as I don't have enough knowledge to solve it.
 * BUT I know that the whole input is actually a ripple-carry adder. os this means that every part should work in a specific way. I will try to solve it manually later but for today I will move on.
 */

import { processTime } from "../utils/process-time";
import { loadFile } from "../utils/load-file";

const TAG = "day 24 - part 2";

type Bit = number | null;
type OperationFunction = (a: Bit, b: Bit) => Bit;

const OPERATIONS_DICT: Record<string, OperationFunction> = {
  AND: (a: Bit, b: Bit): Bit => a! & b!,
  OR: (a: Bit, b: Bit): Bit => a! | b!,
  XOR: (a: Bit, b: Bit): Bit => a! ^ b!,
};

const decimalToBinaryWithPadding = (
  decimalNumber: number,
  bitLength: number
): string => {
  const binaryNumber = decimalNumber.toString(2);
  const paddedBinary = binaryNumber.padStart(bitLength, "0");
  return paddedBinary;
};

const hasNullValues = (initialValuesMap: Map<string, Bit>): boolean => {
  for (const value of initialValuesMap.values()) {
    if (value === null) {
      return true;
    }
  }

  return false;
};

const executeOperation = (
  initialValuesMap: Map<string, Bit>,
  operation: string,
  result: string
): void => {
  const [leftOperand, operator, rightOperand] = operation.split(" ");
  const leftValue = initialValuesMap.get(leftOperand) as Bit;
  const rightValue = initialValuesMap.get(rightOperand) as Bit;

  if (leftValue === null || rightValue === null) {
    return;
  }

  const operationFunction = OPERATIONS_DICT[operator];
  const newValue = operationFunction(leftValue, rightValue);
  initialValuesMap.set(result, newValue);
};

const main = () => {
  const input = loadFile(__dirname + "/input.txt");
  const initialValuesMap = new Map<string, Bit>();

  const [INITIAL_VALUES, OPERATIONS] = input.split("\n\n");
  INITIAL_VALUES.split("\n").forEach((line) => {
    const [_, value] = line.split(":");
    initialValuesMap.set(_, parseInt(value.trim()) as Bit);
  });

  OPERATIONS.split("\n").forEach((operation) => {
    const [instruction, result] = operation.split(" -> ");
    const [leftOperand, operator, rightOperand] = instruction.split(" ");

    if (!initialValuesMap.has(leftOperand)) {
      initialValuesMap.set(leftOperand, null);
    }

    if (!initialValuesMap.has(rightOperand)) {
      initialValuesMap.set(rightOperand, null);
    }

    if (!initialValuesMap.has(result)) {
      initialValuesMap.set(result, null);
    }
  });

  const xValues = [];
  const yValues = [];

  for (const [key, value] of initialValuesMap.entries()) {
    if (key.startsWith("x")) {
      xValues.push([key.slice(1), value]);
    }

    if (key.startsWith("y")) {
      yValues.push([key.slice(1), value]);
    }
  }

  const xValuesBinary = xValues
    .reverse()
    .map(([_, value]) => value)
    .reduce((acc, value) => (acc = `${acc}${value}`), "");

  const yValuesBinary = yValues
    .reverse()
    .map(([_, value]) => value)
    .reduce((acc, value) => (acc = `${acc}${value}`), "");

  const xDecimal = parseInt(xValuesBinary as string, 2);
  const yDecimal = parseInt(yValuesBinary as string, 2);

  const EXPECTED = xDecimal + yDecimal;
  const EXPECTED_BINARY = EXPECTED.toString(2);

  while (hasNullValues(initialValuesMap)) {
    OPERATIONS.split("\n").forEach((operation) => {
      const [instruction, result] = operation.split(" -> ");
      executeOperation(initialValuesMap, instruction, result);
    });
  }

  let zValues = [];
  for (const [key, value] of initialValuesMap.entries()) {
    if (key.startsWith("z")) {
      zValues.push([key.slice(1), value]);
    }
  }

  zValues.sort().reverse();

  let calculatedBinary = "";
  for (const [_, value] of zValues) {
    calculatedBinary += value;
  }

  const calculatedDecimal = parseInt(calculatedBinary, 2);

  const diffMap = new Map<string, Bit>();

  const reversedExpectedBinary = EXPECTED_BINARY.split("").reverse();
  const reversedCalculatedBinary = calculatedBinary.split("").reverse();

  // Create the binary difference map
  // The key is the bit position and the value is what the bit should be
  for (let i = 0; i < reversedCalculatedBinary.length; i++) {
    const calculatedBit = reversedCalculatedBinary[i];
    const expectedBit = reversedExpectedBinary[i];
    if (calculatedBit !== expectedBit) {
      const j = i < 10 ? `0${i}` : `${i}`;
      diffMap.set(`z${j}`, parseInt(expectedBit) as Bit);
    }
  }

  console.log(diffMap);

  // filter out the instructions that are not in the difference map
  const filteredInstructions = OPERATIONS.split("\n").filter((operation) => {
    const [_, result] = operation.split(" -> ");
    return diffMap.has(result);
  });

  console.log(filteredInstructions);
};

processTime(TAG, main);
