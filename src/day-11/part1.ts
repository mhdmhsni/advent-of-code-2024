import fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();

function getInitialPebbles(): number[] {
  return input.split(" ").map(Number);
}

function processPebbles(pebbles: number[]): number[] {
  let clone = [...pebbles];
  let r: number[] = [];

  for (let i = 0; i < clone.length; i++) {
    if (clone[i] === 0) {
      r.push(1);
      continue;
    }

    const left = clone[i].toString().slice(0, clone[i].toString().length / 2);
    const right = clone[i].toString().slice(clone[i].toString().length / 2);

    if (clone[i].toString().length % 2 === 0) {
      r.push(parseInt(left));
      r.push(parseInt(right));
    } else {
      const d = clone[i] * 2024;
      r.push(d);
    }
  }

  return r;
}

function processPebblesByIteration(
  pebbles: number[],
  iterations: number
): number[] {
  let processed: Record<number, number[]> = {};
  let lastProcessed: number[] = [...pebbles];

  for (let i = 1; i <= iterations; i++) {
    lastProcessed = processPebbles(lastProcessed);
    processed[i] = lastProcessed;
  }

  return processed[iterations];
}

console.time("day 11 part 1");

const initialPebbles = getInitialPebbles();
const result = processPebblesByIteration(initialPebbles, 25);

console.log(result.length);
console.timeEnd("day 11 part 1");
