const fs = require('fs');
const data = fs.readFileSync('20-input')
    .toString()
    .split('\n')
    .map((x, i) => [parseInt(x.trim(), 10), i]);

//console.log(data);

// Part 1
/*
for (let i = 0; i < data.length; i++) {
    const toMoveIdx = data.findIndex(x => x[1] === i);
    const toMove = data[toMoveIdx];
    //console.log(toMove, toMoveIdx);
    data.splice(toMoveIdx, 1);
    const moveTo = (toMoveIdx + toMove[0]) % data.length;
    data.splice(moveTo === 0 ? data.length : moveTo, 0, toMove);
    //console.log(toMove[0], moveTo, JSON.stringify(data.map(x => x[0])));
}

const idxOfZero = data.map(x => x[0]).indexOf(0);

const output = [];

for (let i = 1; i <= 3; i++) {
    output.push(data[(idxOfZero + 1000 * i) % data.length][0]);
}

console.log(output);
console.log(output.reduce((a, b) => a + b));
*/

for (let i = 0; i < data.length; i++) {
    data[i][0] *= 811589153;
}

console.log(data);

for (let mix = 0; mix < 10; mix++) {
    for (let i = 0; i < data.length; i++) {
        const toMoveIdx = data.findIndex(x => x[1] === i);
        const toMove = data[toMoveIdx];
        //console.log(toMove, toMoveIdx);
        data.splice(toMoveIdx, 1);
        const moveTo = (toMoveIdx + toMove[0]) % data.length;
        data.splice(moveTo === 0 ? data.length : moveTo, 0, toMove);
        //console.log(toMove[0], moveTo, JSON.stringify(data.map(x => x[0])));
    }
}

const idxOfZero = data.map(x => x[0]).indexOf(0);
const output = [];
for (let i = 1; i <= 3; i++) {
    output.push(data[(idxOfZero + 1000 * i) % data.length][0]);
}
console.log(output);
console.log(output.reduce((a, b) => a + b));