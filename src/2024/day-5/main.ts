import fs from 'fs';

function isOrdered(update: string[], rules: string[][]): boolean {
    for (let i = 0; i < update.length - 1; i++) {
       if (!rules.find((rule) => rule[0] === update[i] && rule[1] === update[i + 1])) {
           return false
       }
    }
    return true;
}

function orderList(update: string[], rules: string[][]): string[] {
    let dictionary: Record<string, string[]> = {};
    const orderedUpdate: string[] = [];

    update.forEach(page => {
        dictionary[page] = rules.filter(rule => rule[0] === page)
            .map(rule => rule[1])
            .filter(rule => update.includes(rule));
    })

    while (Object.keys(dictionary).length > 0) {
        const lastPage = Object.keys(dictionary).find(page => dictionary[page].length === 0)!;

        for (const key in dictionary) {
            dictionary[key] = dictionary[key].filter(item => item !== lastPage);
        }

        delete dictionary[lastPage];

        orderedUpdate.unshift(lastPage);
    }

    return orderedUpdate;
}

function findOrderedMiddlePageSum(rules: string[][], updates: string[][]): number {
    return updates.reduce<number>((acc, update) => {
        if (!isOrdered(update, rules)) return acc;

        const midIndex = Math.floor(update.length / 2);
        const mid = parseInt(update[midIndex]);
        acc += mid;
        return acc;
    }, 0)
}

function findUnorderedMiddlePageSum(rules: string[][], updates: string[][]): number {
    return updates.reduce<number>((acc, update) => {
        if (isOrdered(update, rules)) {
            return acc;
        }

        update = orderList(update, rules);
        const midIndex = Math.floor(update.length / 2);
        const mid = parseInt(update[midIndex]);
        acc += mid;
        return acc;
    }, 0)
}

function main(): void  {
    // const input = fs.readFileSync(__dirname + '/sample-input.txt', 'utf8');
    const input = fs.readFileSync(__dirname + '/input.txt', 'utf8');

    const [rulesRaw, updatesRaw] = input.split('\n\n');
    const rules = rulesRaw.split('\n').map((rule) => rule.split('|'));
    const updates = updatesRaw.split('\n').map((update) => update.split(','));


    const part1 = findOrderedMiddlePageSum(rules, updates);
    const part2 = findUnorderedMiddlePageSum(rules, updates);
    console.log({part1, part2});
}

main();