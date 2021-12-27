const fs = require('fs');

const inData = fs.readFileSync('./input-day-8')
    .toString('utf-8')
    .split('\n')
    .map(a => a.split("|").map(a => a.trim().split(' ')));

// Part 1
// figure out numerals 1, 4, 7, 8

// 8 is always 7 on
// 7 is always 3 on
// 4 is always 4 on
// 1 is always 2 on

const freq = {};
for (let i = 0; i < inData.length; i++) {
    for (let j = 0; j < 4; j++) {
        const segOn = inData[i][1][j].length;
        const outNum = {
            '7': '8',
            '3': '7',
            '4': '4',
            '2': '1'
        }[segOn];
        if (outNum) {
            if (!freq[outNum]) {
                freq[outNum] = 0;
            }
            freq[outNum] += 1;
        }
    }
}
console.log('Frequencies of easy numerals:');
console.log(freq);
console.log(Object.values(freq).reduce((a, b) => a + b));

// Part 2
//console.log(inData[0]);

for (let i = 0; i < inData.length; i++) {
    for (let j = 0; j < 10; j++) {
        inData[i][0][j] = inData[i][0][j].split('').sort().join('');
    }
    for (let j = 0; j < 4; j++) {
        inData[i][1][j] = inData[i][1][j].split('').sort().join('');
    }
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

let acc = 0;

for (let i = 0; i < inData.length; i++) {
    const wires = {};
    const cur = inData[i][0];
    cur.sort((a, b) => {
        return a.length - b.length;
    });
    // With 1 (0) and 7 (1) you can figure out the position of 'a'
    wires['a'] = [...difference(new Set(cur[1].split('')), new Set(cur[0].split('')))][0];
    let nine = null;
    let zero = null;
    let six = null;
    for (let j = 0; j < 10; j++) {
        if (cur[j].length === 6) {
            // subtract candidate with 7 (1)
            const m7 = [...difference(new Set(cur[j].split('')), new Set(cur[1].split('')))];
            if (m7.length === 3) {
                // subtracting 4 (2) from the candidate
                const com = [...difference(new Set(cur[2].split('')), new Set(cur[j].split('')))];
                if (com.length === 0) {
                    nine = cur[j];
                } else if (com.length === 1) {
                    zero = cur[j];
                } else {
                    console.log('ISSUE WITH COM');
                }
            } else {
                // 6
                six = cur[j];
            }
        }
    }

    // 6 intersect 7 (1) gives us a, f, we know a so this gives us f
    // and it also gives us c by deduction
    let temp = [...intersection(new Set(six.split('')), new Set(cur[1].split('')))]
        .filter(v => v !== wires['a']);
    wires['f'] = temp[0];
    wires['c'] = cur[1].split('').filter(v => v !== wires['f'] && v !== wires['a'])[0];

    // 9 minus 4 (2) (get rid of a) gives us g
    temp = [...difference(new Set(nine.split('')), new Set(cur[2].split('')))]
        .filter(v => v !== wires['a']);
    wires['g'] = temp[0];
    // 6 minus 4 (2) (get rid of a) gives us 2 options for e and g
    // narrow down to 1 option because g is known
    temp = [...difference(new Set(six.split('')), new Set(cur[2].split('')))]
        .filter(v => v !== wires['a'] && v !== wires['g']);
    wires['e'] = temp[0];
    // 4 (2) minus 0 gives us d, e, g, e and g are known so we can get d
    temp = [...difference(new Set(cur[2].split('')), new Set(zero.split('')))]
        .filter(v => v !== wires['e'] && v !== wires['g']);
    wires['d'] = temp[0];

    // 0 minus 7 (1) gives us b, e, g, and since e and g are known we can get b
    temp = [...difference(new Set(zero.split('')), new Set(cur[1].split('')))]
        .filter(v => v !== wires['e'] && v !== wires['g']);
    wires['b'] = temp[0];

    // the wiring is now known, now go through the output and map to numerals
    //console.log(wires);
    // reverse the wires to map bad -> good
    const wiresRev = {};
    for (const k of Object.keys(wires)) {
        wiresRev[wires[k]] = k;
    }
    //console.log(wiresRev);
    let fullN = '';
    for (let j = 0; j < 4; j++) {
        const cur = inData[i][1][j];
        const cur2 = cur.split('').map(n => {
            return wiresRev[n];
        }).sort().join('');
        const numOut = {
            'abcefg': '0',
            'cf': '1',
            'acdeg': '2',
            'acdfg': '3',
            'bcdf': '4',
            'abdfg': '5',
            'abdefg': '6',
            'acf': '7',
            'abcdefg': '8',
            'abcdfg': '9'
        }[cur2];
        //console.log(cur, cur2, numOut);
        fullN += numOut;
    }
    //console.log(fullN);
    acc += parseInt(fullN, 10);
}

console.log('Gottem:', acc);