import fs from 'fs';

function calculateSumOfMultiplications(input: string): number {
    const instructions = input.match(/mul\(\d+,\d+\)/g);
    if (!instructions) return 0;

    let sum = 0;
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        const [a, b] = instruction.match(/\d+/g)!.map(Number);
        sum += a * b;
    }
    return sum;
}

function calculateSumOfValidMultiplications(input: string): number {
    const instructions = input.match(/(mul\(\d+,\d+\)|do(n't)?)/g);
    if (!instructions) return 0;

    let sum = 0;
    let enabled = true;
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        if (instruction === 'do') {
            enabled = true
        } else if (instruction === "don't") {
            enabled = false
        } else if (enabled) {
            const [a, b] = instruction.match(/\d+/g)!.map(Number);
            sum += a * b;
        }
    }
    return sum;
}

function main(): void {
    const input = fs.readFileSync('./input.txt', 'utf8');

    const part1 = calculateSumOfMultiplications(input);
    const part2 = calculateSumOfValidMultiplications(input);

    console.log({part1, part2})
}

main();