const fs = require('fs');

let inData = fs.readFileSync('./input-day-2').toString('utf-8').split('\n');

// part 1
let finalPos = [0, 0];
for (const str of inData) {
    const action = str.split(' ');
    const mag = parseInt(action[1]);
    if (action[0] === 'forward') {
        finalPos[0] += mag;
    } else if (action[0] === 'down') {
        finalPos[1] += mag;
    } else if (action[0] === 'up') {
        finalPos[1] -= mag;
    }
}

console.log('Final Position', finalPos, finalPos[0] * finalPos[1]);

// part 2
finalPos = [0, 0, 0];
for (const str of inData) {
    const action = str.split(' ');
    const mag = parseInt(action[1]);
    if (action[0] === 'forward') {
        finalPos[0] += mag;
        finalPos[1] += finalPos[2] * mag;
    } else if (action[0] === 'down') {
        finalPos[2] += mag;
    } else if (action[0] === 'up') {
        finalPos[2] -= mag;
    }
}

console.log('Final Position', finalPos, finalPos[0] * finalPos[1]);