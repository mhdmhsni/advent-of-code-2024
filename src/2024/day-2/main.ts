import fs from 'fs';

type Expectations = 'increasing' | 'decreasing' | undefined;

const parseInputFile = (): string => {
    return fs.readFileSync('./input.txt', 'utf8');
}

const checkRecordSafety = (record: string[]): boolean => {
    let initialExpectation: Expectations;
    let isLineSafe = true;

    for(let i = 0; i < record.length - 1; i++) {
        const currentNumber = parseInt(record[i], 10);
        const nextNumber = parseInt(record[i + 1], 10);

        const diff = currentNumber - nextNumber;

        if (i === 0) {
            if (diff < 0) initialExpectation = 'increasing';
            else if (diff > 0) initialExpectation = 'decreasing';
        }

        // line is unsafe because the two numbers are identical
        if (diff === 0) {
            console.log('line is unsafe because the two numbers are identical')
                isLineSafe = false
                break;
        }
        // line is unsafe because the diff is more than 3 or less than -3
        else if (diff > 3 || diff < -3) {
            console.log('line is unsafe because the diff is more than 3 or less than -3')
                isLineSafe = false
                break
        }

        // line is unsafe because the number are changing both increasingly and decreasingly
        if (i > 0) {
            let currentBehaviour: Expectations;
            if (diff < 0) currentBehaviour = 'increasing';
            if (diff > 0) currentBehaviour = 'decreasing';

            if (currentBehaviour !== initialExpectation) {
                    isLineSafe = false;
                    break
            }
        }
    }

    return isLineSafe;
}

const main = (): void => {
    const input = parseInputFile();
    const lines = input.split('\n');
    const mappedLines = lines.map(line => line.split(/\s+/));


    // calculate zero error policy
    let absoluteSafeRecords = 0;
    for (const record of mappedLines) {
        const isLineSafe = checkRecordSafety(record)
        if (isLineSafe) absoluteSafeRecords += 1;
    }
    console.log('Safe records with zero error tolerance policy: ', absoluteSafeRecords);

    // calculate one error policy
    let safeRecords = 0;
    for (const record of mappedLines) {
        const isLineSafe = checkRecordSafety(record)
        if (isLineSafe) safeRecords += 1;
        else {
            for (let j = 0; j < record.length; j++) {
                const isLineSafe = checkRecordSafety([...record.slice(0, j), ...record.slice(j + 1)]);
                if (isLineSafe) {
                    safeRecords += 1
                    break
                }
            }
        }
    }
    console.log('Safe records with one error tolerance policy: ', safeRecords);

}

main();