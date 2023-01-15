const fs = require('fs');
const data = fs.readFileSync('03-input').toString();
const lines = data.split("\n").map(l => [l.slice(0,(l.length-1)/2),l.slice((l.length-1)/2).trim()]);

const alph = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Part 1
const ret = lines.map(l => {
    const left = new Set(l[0]);
    const right = new Set(l[1]);
    const common = new Set();
    for (elem of left) {
        if (right.has(elem)) {
            common.add(elem);
        }
    }
    return common;
}).map(common => {
    const c = [...common][0];
    const priority = alph.indexOf(c) + 1;
    return priority;
}).reduce((a, b) => a + b);
console.log(ret);

// Part 2
const gLines = [];
let group = [];
let cnt = 0;
for (l of lines) {
    if (cnt > 2) {
        cnt = 0;
        gLines.push(group);
        group = [];
    }
    group.push(l[0]+l[1]);
    cnt++;
}
gLines.push(group);

const ret2 = gLines.map(group => {
    return group.map(backpack => {
        return new Set(backpack);
    }).reduce((a, b) => {
        const common = new Set();
        for (elem of b) {
            if (a.has(elem)) {
                common.add(elem);
            }
        }
        return common;
    })
}).map(common => {
    const c = [...common][0];
    const priority = alph.indexOf(c) + 1;
    return priority;
}).reduce((a, b) => a + b);

console.log(ret2);