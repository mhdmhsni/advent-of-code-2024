import fs from "fs";

// I solved this but my original algorithm was soooooo slow (took around 30s to solve)
// To optimize it, got ideas from https://www.youtube.com/watch?v=9I_S8gGcslo

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();

function progress(current: number, total: number): string {
  return `${Math.floor((current / total) * 100)}%`;
}

console.time("day 9 part 1");

function makeMemoryMap(src: string): string[] {
  const grid = [];
  let isEmptySpace = false;

  let id = 0;

  for (let i = 0; i < src.length; i++) {
    console.log("initializing the memory map: ", progress(i, src.length));

    const num = parseInt(src[i]);

    if (!isEmptySpace) {
      for (let j = 1; j <= num; j++) {
        grid.push(id.toString());
      }
      id++;
    } else {
      for (let j = 1; j <= num; j++) {
        grid.push(".");
      }
    }

    isEmptySpace = !isEmptySpace;
  }

  return grid;
}

function defrag(memoryMap: string[]): string[] {
  const clone = [...memoryMap];

  let firstFreeSpace = 0;
  while (clone[firstFreeSpace] != ".") {
    firstFreeSpace += 1;
  }

  let indexOfFile = memoryMap.length - 1;
  while (clone[indexOfFile] === ".") {
    indexOfFile -= 1;
  }

  while (indexOfFile > firstFreeSpace) {
    clone[firstFreeSpace] = clone[indexOfFile];
    clone[indexOfFile] = ".";

    while (clone[indexOfFile] === ".") {
      indexOfFile -= 1;
    }

    while (clone[firstFreeSpace] !== ".") {
      firstFreeSpace += 1;
    }
  }

  return clone;
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

const memoryMap = makeMemoryMap(input);
const defragmentedMemoryMap = defrag(memoryMap);
const checksum = calcChecksum(defragmentedMemoryMap);

console.log(checksum);
console.timeEnd("day 9 part 1");
