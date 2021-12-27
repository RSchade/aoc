const fs = require('fs');

let inData = fs.readFileSync('./input-day-1').toString('utf-8').split('\n');

// Puzzle 1, measurements greater than previous
let largerThanPrevious = 0;
for (let i = 1; i < inData.length; i++) {
    const diff = inData[i] - inData[i - 1];
    if (diff > 0) {
        largerThanPrevious += 1;
    }
}

console.log('Larger Than Previoius', largerThanPrevious);

// Puzzle 2, slididng window
const windowSize = 3;
largerThanPrevious = 0;
let prevWindow = -1;
for (let i = 0; i < inData.length - windowSize; i++) {
    let curWindow = 0;
    for (let j = 0; j < windowSize; j++) {
        curWindow += parseInt(inData[j + i]);
    }
    largerThanPrevious += prevWindow !== -1 && curWindow > prevWindow ? 1 : 0;
    prevWindow = curWindow;
}

console.log('Larger than Previous Window', largerThanPrevious);