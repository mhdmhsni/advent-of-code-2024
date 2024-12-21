import * as fs from "fs";

// for this part had to learn from https://www.youtube.com/watch?v=9I_S8gGcslo

// Read input from file
const line = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();

function progress(current: number, total: number): string {
  return `${Math.floor((current / total) * 100)}%`;
}

console.time("day 9 part 2");

function makeMemoryMap(src: string): {
  blocks: string[];
  size: number[];
  loc: number[];
} {
  const blocks: string[] = [];
  const size: number[] = new Array(src.length).fill(0);
  const loc: number[] = new Array(src.length).fill(0);

  let isFile = true;
  let id = 0;

  for (let char of src) {
    const x = parseInt(char);

    if (isFile) {
      loc[id] = blocks.length;
      size[id] = x;
      blocks.push(...Array(x).fill(id.toString()));
      id++;
      isFile = false;
    } else {
      blocks.push(...Array(x).fill("."));
      isFile = true;
    }
  }

  return { blocks, size, loc };
}

function defrag(arr: string[], size: number[], loc: number[]): string[] {
  let big = 0;

  // Find the largest file index with size > 0
  while (size[big] > 0) {
    big++;
  }
  big--;

  for (let toMove = big; toMove >= 0; toMove--) {
    let freeSpace = 0;
    let firstFree = 0;

    // Find the first free space that works
    while (firstFree < loc[toMove] && freeSpace < size[toMove]) {
      firstFree += freeSpace;
      freeSpace = 0;

      while (arr[firstFree] !== ".") {
        firstFree++;
      }

      while (
        firstFree + freeSpace < arr.length &&
        arr[firstFree + freeSpace] === "."
      ) {
        freeSpace++;
      }
    }

    if (firstFree >= loc[toMove]) {
      continue;
    }

    // Move file by swapping block values
    for (let idx = firstFree; idx < firstFree + size[toMove]; idx++) {
      arr[idx] = toMove.toString();
    }

    for (let idx = loc[toMove]; idx < loc[toMove] + size[toMove]; idx++) {
      arr[idx] = ".";
    }
  }

  return arr;
}

function calcChecksum(memoryMap: string[]): number {
  let r = 0;
  for (let i = 0; i < memoryMap.length; i++) {
    const number = parseInt(memoryMap[i]);
    if (!Number.isNaN(number)) {
      r += number * i;
    }
  }

  return r;
}

const { blocks: filesystem, size, loc } = makeMemoryMap(line);
const defragmentedMemoryMap = defrag(filesystem, size, loc);
const checksum = calcChecksum(defragmentedMemoryMap);

console.log(checksum);
console.timeEnd("day 9 part 2");
