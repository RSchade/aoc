const fs = require('fs');
const data = fs.readFileSync('10-input').toString().split('\n').map(l => l.trim().split(' '));

// Part 1 / Part 2
const strengths = [];
let ops = [];
let cycles = 1;
let x = 1;

const wide = 40;
const high = 6;
let row = Array(wide).fill(' ');

while (data.length > 0 || ops.length > 0) {
    const instr = ops.length === 0 ? data.shift() : null;
    if (instr) {
        //console.log(instr);
        switch (instr[0]) {
            case 'noop':
                break;
            case 'addx':
                ops.push([instr, x, 0]);
                break;
        }
    }
    //console.log(cycles, x);
    if (cycles >= 20 && (cycles - 20) % 40 === 0) {
        strengths.push(x * cycles);
    }
    if (cycles % 40 === 0) {
        console.log(row.join(''));
        row = Array(wide).fill(' ');
    }
    for (const op of ops) {
        op[2]++
        const opInstr = op[0];
        // finish addx
        if (op[2] === 2) {
            x += parseInt(opInstr[1], 10);
        }
        //console.log("op", op);
    }
    ops = ops.filter(op => op[2] < 2);
    // draw
    const curPx = cycles % 40;
    if (curPx >= x - 1 && curPx <= x + 1) {
        row[curPx] = '#';
    }
    cycles++;
}
//console.log(cycles, x);


console.log();
console.log("X", x);
console.log(strengths);
console.log(strengths.reduce((a,b) => a + b, 0));