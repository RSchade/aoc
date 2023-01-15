const fs = require('fs');
const data = fs.readFileSync('05-input').toString().split('\n');

// Part 1
const instrs = [];
const stacks = [[], [], [], [], [], [], [], [], []];

let readStacks = true;
for (const line of data) {
    if (readStacks) {
        if (line.indexOf('[') !== -1) {
            const stackVals = line.split(' ').map(x => x[1]);
            let numVals = 0;
            let spaceIdxs = 0;
            for(let i = 0; i < stackVals.length; i++) {
                if (!stackVals[i]) {
                    spaceIdxs++;
                    if (spaceIdxs >= 4) {
                        numVals++;
                        spaceIdxs = 0;
                    }
                } else {
                    stacks[numVals].push(stackVals[i]);
                    numVals++;
                    spaceIdxs = 0;
                }
            }
        }
    } else {
        instrs.push(line.trim());
    }
    if (line.trim() === '') {
        readStacks = false;
    }
}

console.log(stacks);
console.log(instrs);

/*for (const step of instrs) {
    const g = step.match(/move (?<m>[0-9]+) from (?<f>[0-9]+) to (?<t>[0-9])+/).groups;
    const amt = parseInt(g.m,10);
    const from = parseInt(g.f,10);
    const to = parseInt(g.t,10);
    for (let i = 0; i < amt; i++) {
        const temp = stacks[from - 1].shift();
        stacks[to - 1].unshift(temp);
    }
}

console.log(stacks);

console.log(stacks.map(s => {
    if (s.length === 0) {
        return '';
    }
    return s[0];
}).reduce((a, b) => a + b));*/

// Part 2
for (const step of instrs) {
    const g = step.match(/move (?<m>[0-9]+) from (?<f>[0-9]+) to (?<t>[0-9])+/).groups;
    const amt = parseInt(g.m,10);
    const from = parseInt(g.f,10);
    const to = parseInt(g.t,10);
    const f = stacks[from - 1];
    const t = stacks[to - 1];
    const temp = f.slice(0,amt);
    stacks[from - 1] = f.slice(amt);
    stacks[to - 1] = temp.concat(t);
}

console.log(stacks);

console.log(stacks.map(s => {
    if (s.length === 0) {
        return '';
    }
    return s[0];
}).reduce((a, b) => a + b));