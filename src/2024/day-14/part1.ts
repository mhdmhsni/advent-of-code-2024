import * as fs from "fs";

// Read input from file
const lines = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim().split("\n");

const n = 103;
const m = 101;

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

// Simulate updates
for (let _ = 0; _ < 100; _++) {
    // Uncomment for visualization if needed
    // for (let i = 0; i < n; i++) {
    //   for (let j = 0; j < m; j++) {
    //     const x = countRobots(i, i + 1, j, j + 1);
    //     process.stdout.write(x > 0 ? x.toString() : ".");
    //   }
    //   console.log();
    // }
    // console.log();

    update();
}

// Calculate results
const q0 = countRobots(0, Math.floor(n / 2), 0, Math.floor(m / 2));
const q1 = countRobots(Math.floor(n / 2) + 1, n, 0, Math.floor(m / 2));
const q2 = countRobots(0, Math.floor(n / 2), Math.floor(m / 2) + 1, m);
const q3 = countRobots(Math.floor(n / 2) + 1, n, Math.floor(m / 2) + 1, m);

console.log(q0, q1, q2, q3);
console.log(q0 * q1 * q2 * q3);
