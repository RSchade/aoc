const fs = require('fs');

const inData = fs.readFileSync('./input-day-10')
    .toString('utf-8')
    .split('\n');

const score = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
};

const l = {
    ')': true, ']': true, '}': true, '>': true
}

const j = {
    '(': ')', '[': ']', '{': '}', '<': '>'
}

const goodLines = [];

// Part 1
let acc = 0;
for (const line of inData) {
    const stack = [];
    let err = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (l[c]) {
            const c2 = stack.pop();
            if (j[c2] !== c) {
                //console.log('err', c);
                acc += score[c];
                err = true;
                break;
            }
        } else {
            stack.push(c);
        }
    }
    if (!err) {
        goodLines.push(line);
    }
}

console.log('Part 1', acc);

const accs = [];
for (const line of goodLines) {
    const stack = [];
    let err = false;
    let acc = 0;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (l[c]) {
            const c2 = stack.pop();
            if (j[c2] !== c) {
                //console.log('err', c);
                acc += score[c];
                err = true;
                break;
            }
        } else {
            stack.push(c);
        }
    }
    for (const c of stack.reverse()) {
        acc *= 5;
        acc += {
            '(': 1,
            '[': 2,
            '{': 3,
            '<': 4
        }[c];
    }
    accs.push(acc);
}

accs.sort((a, b) => b - a);

console.log(accs);
console.log('Part 2', accs[Math.floor(accs.length/2)]);