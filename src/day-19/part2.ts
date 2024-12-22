import fs from "fs";

const TAG = "day 19 - part 2";

const countConstructDesign = (
  desiredDesign: string,
  patterns: string[]
): number => {
  // key = remaining string, value = number of ways to construct
  const memo = new Map<string, number>();

  const countConstruct = (remaining: string): number => {
    if (memo.has(remaining)) return memo.get(remaining)!;

    if (remaining === "") return 1;

    let totalWays = 0;

    for (const pattern of patterns) {
      if (remaining.startsWith(pattern)) {
        const newRemaining = remaining.slice(pattern.length);
        totalWays += countConstruct(newRemaining);
      }
    }

    memo.set(remaining, totalWays);
    return totalWays;
  };

  return countConstruct(desiredDesign);
};

const main = () => {
  console.time(TAG);

  const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");
  let splitInput = input.split("\n\n");
  const patterns = splitInput[0].split(",").map((pattern) => pattern.trim());
  const desiredDesigns = splitInput[1]
    .trim()
    .split("\n")
    .map((design) => design.trim());

  let possibleDesigns = 0;
  for (const desiredDesign of desiredDesigns) {
    const r = countConstructDesign(desiredDesign, patterns);
    if (r) {
      possibleDesigns += r;
    }
  }

  console.log(possibleDesigns);

  console.timeEnd(TAG);
};

main();
