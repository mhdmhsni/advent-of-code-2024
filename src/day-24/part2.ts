import fs from "fs";

const TAG = "day 24 - part 2";

type Bit = number | null;
type OperationFunction = (a: Bit, b: Bit) => Bit;

const OPERATIONS_DICT: Record<string, OperationFunction> = {
  AND: (a: Bit, b: Bit): Bit => a! & b!,
  OR: (a: Bit, b: Bit): Bit => a! | b!,
  XOR: (a: Bit, b: Bit): Bit => a! ^ b!,
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
  console.time(TAG);
  const input = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();

  const initialValuesMap = new Map<string, Bit>();
  const operationsMap = new Map<string, string>();

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

  console.log(zValues);

  let b = "";
  for (const [_, value] of zValues) {
    b += value;
  }

  console.log(b);

  const decimal = parseInt(b, 2);
  console.log(decimal);

  console.timeEnd(TAG);
};

main();
