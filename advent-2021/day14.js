const fs = require('fs');

const inData = fs.readFileSync('./input-day-14')
    .toString('utf-8')
    .split('\n');

// Part 1
const template = inData[0];
const rules = inData.slice(2).map(r => r.split(' -> '));
console.log(template);
//console.log(rules);

const matchRule = (f, s) => {
    for (const rule of rules) {
        if (rule[0] === f + s) {
            return rule[1];
        }
    }
    return false;
}

let out = template;
let newOut = '';
for (let i = 0; i < 10; i++) {
    let carryOver = false;
    for (let j = 0; j < out.length - 1; j++) {
        const f = out[j];
        const s = out[j + 1];
        const toAdd = matchRule(f, s);
        if (carryOver) {
            newOut += carryOver;
            carryOver = false;
        } else {
            newOut += f;
        }
        if (toAdd) {
            newOut += toAdd;
            carryOver = s;
        }
    }
    if (carryOver) {
        newOut += carryOver;
        carryOver = false;
    }
    out = newOut;
    newOut = '';
    //console.log(out);
}

const outSplit = out.split('');
const freq = {};
for (const a of outSplit) {
    if (!freq[a]) {
        freq[a] = 0;
    }
    freq[a] += 1;
}
//console.log(freq);
let sortedFreq = Object.values(freq).sort((a, b) => b - a);
console.log('Part 1:', sortedFreq[0] - sortedFreq[sortedFreq.length - 1]);

// Part 2

let twoFreqs = {};
for (let i = 0; i < template.length - 1; i++) {
    const k = template[i] + template[i+1];
    if (!twoFreqs[k]) {
        twoFreqs[k] = 0;
    }
    twoFreqs[k] += 1;
}
const ruleObj = {};
for (const rule of rules) {
    ruleObj[rule[0]] = rule[1];
}
for (let i = 0; i < 40; i++) {
    let newFreqs = {};
    for (const k of Object.keys(twoFreqs)) {
        if (ruleObj[k]) {
            const f = k.split('')[0];
            const s = k.split('')[1];
            const toAdd1 = f + ruleObj[k];
            const toAdd2 = ruleObj[k] + s;
            if (!newFreqs[toAdd1]) {
                newFreqs[toAdd1] = 0;
            }
            if (!newFreqs[toAdd2]) {
                newFreqs[toAdd2] = 0;
            }
            newFreqs[toAdd1] += twoFreqs[k];
            newFreqs[toAdd2] += twoFreqs[k];
        } else {
            newFreqs[k] = twoFreqs[k];
        }  
    }
    twoFreqs = newFreqs;
}

// figure out last two characters
let lastTwo = template.slice(-2);
for (let i = 0; i < 40; i++) {
    const m = ruleObj[lastTwo];
    lastTwo = m + lastTwo.slice(-1);
}

const freq2 = {};
for (const a of Object.keys(twoFreqs)) {
    const c = a[0];
    //console.log(c, twoFreqs[a]);
    if (!freq2[c]) {
        freq2[c] = 0;
    }
    freq2[c] += twoFreqs[a];
}
// add in the last character calculated above
const lastChar = lastTwo.slice(-1);
freq2[lastChar] += 1;    
console.log(twoFreqs);
console.log(freq2);
//console.log(freq);
sortedFreq = Object.values(freq2).sort((a, b) => b - a);
console.log('Part 2:', sortedFreq[0] - sortedFreq[sortedFreq.length - 1]);