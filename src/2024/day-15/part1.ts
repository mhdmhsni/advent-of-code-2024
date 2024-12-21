import fs from 'fs';

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8");

const split = input.split('\n\n');
const grid = split[0].split('\n').map(line => line.split(''));
const instructions = split[1].split('\n').join('');

let ci = 0;
let cj = 0;

for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '@') {
            ci = i;
            cj = j;
        }
    }
}

const directions: Record<string, [number, number]> = {
    '>': [0, 1],
    'v': [1, 0],
    '<': [0, -1],
    '^': [-1, 0],
}

const isInBoundaries = (i: number, j: number): boolean => {
    return i >= 0 && j >= 0 && i < grid.length && j < grid.length;
}

const move = (direction: [number, number]) => {
    const newi = ci + direction[0];
    const newj = cj + direction[1];

    if (!isInBoundaries(newi, newj)) return;

    let di = ci;
    let dj = cj;

    while (isInBoundaries(di, dj)) {
        di += direction[0];
        dj += direction[1];

        if (grid[di][dj] === '#') {
            break;
        }

        if (grid[di][dj] === '.') {
            grid[di][dj] = 'O'
            grid[ci][cj] = '.'
            ci += direction[0]
            cj += direction[1]
            grid[ci][cj] = '@'
            break
        }
    }


}


const part1 = () => {
    console.time('day 15 part 1')

    for (let instruction of instructions) {
        move(directions[instruction]);
    }


    let r = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 'O') {
                r += i * 100 + j
            }
        }
    }

    console.log(r)
    console.timeEnd('day 15 part 1');
}


part1();