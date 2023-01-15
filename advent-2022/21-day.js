const fs = require('fs');
const data = fs.readFileSync('21-input')
    .toString()
    .split('\n')
    .map(x => x.trim().split(": "));

const ops = {};
for (const l of data) {
    ops[l[0]] = l[1];
}

// Part 1
/*
console.log(ops);

const evalMonkey = (cur) => {
    console.log(cur);
    if (cur.indexOf("+") !== -1) {
        const s = cur.split("+");
        return evalMonkey(ops[s[0].trim()]) + evalMonkey(ops[s[1].trim()]);
    } else if (cur.indexOf("-") !== -1) {
        const s = cur.split("-");
        return evalMonkey(ops[s[0].trim()]) - evalMonkey(ops[s[1].trim()]);
    } else if (cur.indexOf("*") !== -1) {
        const s = cur.split("*");
        return evalMonkey(ops[s[0].trim()]) * evalMonkey(ops[s[1].trim()]);
    } else if (cur.indexOf("/") !== -1) {
        const s = cur.split("/");
        return evalMonkey(ops[s[0].trim()]) / evalMonkey(ops[s[1].trim()]);
    } else {
        return parseInt(cur, 10);
    }
}

console.log(evalMonkey(ops['root']));
*/

// Part 2
console.log(ops);

const evalMonkey = (cur) => {
    if (cur.indexOf("+") !== -1) {
        const s = cur.split("+");
        return evalMonkey(ops[s[0].trim()]) + evalMonkey(ops[s[1].trim()]);
    } else if (cur.indexOf("-") !== -1) {
        const s = cur.split("-");
        return evalMonkey(ops[s[0].trim()]) - evalMonkey(ops[s[1].trim()]);
    } else if (cur.indexOf("*") !== -1) {
        const s = cur.split("*");
        return evalMonkey(ops[s[0].trim()]) * evalMonkey(ops[s[1].trim()]);
    } else if (cur.indexOf("/") !== -1) {
        const s = cur.split("/");
        return evalMonkey(ops[s[0].trim()]) / evalMonkey(ops[s[1].trim()]);
    } else {
        return parseInt(cur, 10);
    }
}

const splitRoot = ops['root'].split('+').map(x => x.trim());

//ops['humn'] = '301';

for (let i = 3343167710000; i < 10000000000000; i++) {
    ops['humn'] = i + '';
    const l = evalMonkey(ops[splitRoot[0]]);
    const r = evalMonkey(ops[splitRoot[1]]);
    console.log(l, r, l - r, "HUMN:", i);
    if (l === r) {
        break;
    }
}