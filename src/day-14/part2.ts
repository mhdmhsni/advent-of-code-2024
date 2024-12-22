import * as fs from "fs";

// Read input from file
const lines = fs
  .readFileSync(__dirname + "/input.txt", "utf-8")
  .trim()
  .split("\n");

const n = 103;
const m = 101;

// Uncomment to use alternate values
// const n = 7;
// const m = 11;

const p: number[][] = [];
const v: number[][] = [];

for (const line of lines) {
  const [a, b] = line.split(" ");
  const pos = a.split("=")[1].split(",").map(Number);
  const vel = b.split("=")[1].split(",").map(Number);

  p.push([pos[1], pos[0]]); // Swap indices as per the original logic
  v.push([vel[1], vel[0]]);
}

const N = p.length;

function update(): void {
  for (let i = 0; i < N; i++) {
    p[i][0] = (p[i][0] + v[i][0] + n) % n;
    p[i][1] = (p[i][1] + v[i][1] + m) % m;
  }
}

function countRobots(i0: number, i1: number, j0: number, j1: number): number {
  let ans = 0;
  for (let i = i0; i < i1; i++) {
    for (let j = j0; j < j1; j++) {
      for (const [ii, jj] of p) {
        if (i === ii && j === jj) {
          ans++;
        }
      }
    }
  }
  return ans;
}

const seen: Record<string, number> = {};
let step = 0;

while (true) {
  const picture: string[][] = Array.from({ length: n }, () =>
    Array(m).fill("  ")
  );

  for (const [i, j] of p) {
    picture[i][j] = "##";
  }

  const pictureStr = picture.map((line) => line.join("")).join("\n");

  if (seen[pictureStr] !== undefined) {
    console.log(`Saw this picture at step ${seen[pictureStr]}, stopping...`);
    break;
  }
  countRobots;

  seen[pictureStr] = step;

  console.log(pictureStr);
  fs.appendFile(
    __dirname + "/output.txt",
    "Step number: " + step + "\n" + pictureStr + "\n\n",
    (err) => {
      if (err) throw new Error(err.message);
    }
  );
  console.log("\n\n");

  update();

  step++;
}
