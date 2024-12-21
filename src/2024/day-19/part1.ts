import fs from "fs";

const TAG = "day 19 - part 1";

const canConstructDesign = (
  desiredDesign: string,
  patterns: string[]
): boolean => {
  const canConstruct = (remaining: string): boolean => {
    if (remaining === "") return true;

    for (const pattern of patterns) {
      if (remaining.startsWith(pattern)) {
        const newRemaining = remaining.slice(pattern.length);
        if (canConstruct(newRemaining)) return true;
      }
    }

    return false;
  };

  return canConstruct(desiredDesign);
};

const main = (): void => {
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
    const r = canConstructDesign(desiredDesign, patterns);
    if (r) {
      possibleDesigns++;
    }
  }

  console.log(possibleDesigns);

  console.timeEnd(TAG);
};

main();
