const fs = require('fs');

const inData = fs.readFileSync('./input-day-7')
    .toString('utf-8')
    .split(',')
    .map(a => parseInt(a, 10));

// Part 1
let max = 0;
for (let i = 0; i < inData.length; i++) {
    max = Math.max(inData[i], max);
}

let minFuel = 9999999999999;
let minFuelIdx = 0;
for (let i = 0; i < max; i++) {
    let acc = 0;
    for (let j = 0; j < inData.length; j++) {
        acc += Math.abs(inData[j] - i);
    }
    minFuel = Math.min(acc, minFuel);
    if (minFuel === acc) {
        minFuelIdx = i;
    }
}

console.log('Part 1: Max, minFuel, minFuelIdx', max, minFuel, minFuelIdx);

// Part 2
const fuel = n => {
    let acc = 0;
    for (let i = 1; i <= n; i++) {
        acc += i;
    }
    return acc;
}
minFuel = 9999999999999;
minFuelIdx = 0;
for (let i = 0; i < max; i++) {
    let acc = 0;
    for (let j = 0; j < inData.length; j++) {
        acc += fuel(Math.abs(inData[j] - i));
    }
    minFuel = Math.min(acc, minFuel);
    if (minFuel === acc) {
        minFuelIdx = i;
    }
}

console.log('Part 2: Max, minFuel, minFuelIdx', max, minFuel, minFuelIdx);