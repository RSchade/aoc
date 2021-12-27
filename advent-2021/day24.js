const fs = require('fs');

const inData = fs.readFileSync('./input-day-24')
    .toString('utf-8').split('\n');

const interp = (instr, state, input, inputPtr) => {
    const instrSplit = instr.split(' ');
    const op = instrSplit[0];
    const args = instrSplit.slice(1);
    const stateVar = state[args[0]];
    let otherVar = null;
    if (args.length === 2) {
        if (isNaN(parseInt(args[1], 10))) {
            otherVar = state[args[1]];
        } else {
            otherVar = parseInt(args[1], 10);
        }
    }
    switch (op) {
        case 'inp':
            state[args[0]] = parseInt(input[inputPtr], 10);
            inputPtr += 1;
            break;
        case 'add':
            state[args[0]] += otherVar;
            break;
        case 'mul':
            state[args[0]] *= otherVar;
            break;
        case 'div':
            state[args[0]] = Math.floor(stateVar / otherVar);
            break;
        case 'mod':
            state[args[0]] = stateVar % otherVar;
            break;
        case 'eql':
            state[args[0]] = stateVar === otherVar ? 1 : 0;
            break;
    }
    return inputPtr;
}

const divScores = {
    13: {
        xp: -12,
        wp: 9,
        zdiv: 26
    },
    12: {
        xp: -5,
        wp: 9,
        zdiv: 26
    },
    11: {
        xp: 10,
        wp: 6,
        zdiv: 1
    },
    10: {
        xp: -4,
        wp: 7,
        zdiv: 26
    },
    9: {
        xp: -15,
        wp: 1,
        zdiv: 26
    },
    8: {
        xp: -15,
        wp: 8,
        zdiv: 26
    },
    7: {
        xp: -12,
        wp: 13,
        zdiv: 26
    },
    6: {
        xp: 13,
        wp: 6,
        zdiv: 1
    },
    5: {
        xp: 15,
        wp: 10,
        zdiv: 1
    },
    4: {
        xp: 0,
        wp: 3,
        zdiv: 26
    },
    3: {
        xp: 11,
        wp: 4,
        zdiv: 1
    },
    2: {
        xp: 12,
        wp: 8,
        zdiv: 1
    },
    1: {
        xp: 10,
        wp: 10,
        zdiv: 1
    },
    0: {
        xp: 10,
        wp: 12,
        zdiv: 1
    }
}

//for (let i = 99999999999999; i >= 11111111111111; i--) {
    //99999993499899
//99999993818125
/*
let lowest = Infinity;
let best = null;
for (let k = 1111; k <= 9999; k++) {
    const i = '9999A99AAA99AA';
    const inputStr = i.toString().split('');
    for (const [i, a] of [5, 6, 10, 11].entries()) {
        inputStr[a] = k.toString()[i];
    }
    //console.log(inputStr.join(''));
    let hasZero = false;
    for (const c of inputStr) {
        if (c === '0') {
            hasZero = true;
            break;
        }
    }
    if (hasZero) {
        continue;
    }
    let inputPtr = 0;
    const state = {
        w: 0, x: 0, y: 0, z: 0
    }
    let invalid = false;
    let prevInputPtr = 0;
    for (const instr of inData) {
        if (instr.split(' ')[0] === 'inp' && divScores[inputPtr + 1]) {
            const xp = divScores[inputPtr + 1].xp;
            const newW = (state.z % 26) + xp;
            if (newW > 9 || newW < 1) {
                //invalid = true;
                //break;
                inputStr[inputPtr + 1] = '9';
            } else {
                //console.log(newW);
                inputStr[inputPtr + 1] = newW.toString();
            }
        }
        inputPtr = interp(instr, state, inputStr, inputPtr);
        if (inputPtr !== prevInputPtr) {
            //console.log(16 - inputPtr, state);
        }
        prevInputPtr = inputPtr;
    }
    if (invalid) {
        continue;
    }
    //console.log(state);
    if (lowest > state.z) {
        best = inputStr.join('');
    }
    lowest = Math.min(lowest, state.z);
    if (state.z === 0) {
        console.log('Found working number:')
        console.log(state);
        console.log(i);
        break;
    }
}
console.log(best, lowest);
*/

//99991993419919

//19559958649567 = 13
//99559958649567

    /*if (zdiv > 0) {
        if (xl >= 1 && xl <= 9) {
            w[i] = xl;
        } else {
            for (let j = 9; j >= 1; j--) {
                const x = xl !== j ? 1 : 0;
                const ztest = Math.floor(z/zdiv) * (25 * x + 1) + (j + wp) * x; 
                const nextTest = (ztest % 26) + xp;
                if (nextTest >= 1 && nextTest <= 9) {
                    w[i] = j;
                    break;
                }
            }
        }
    }*/

//let w = (new Array(14)).fill(1);

// w + 14 = 14th digit (0 index)

/*
const possibleZs = [];
const zeroZs = [];
const candidateZs = [];
for (let i = 0; i < 14; i++) {
    possibleZs.push({});
    candidateZs.push({});
}
possibleZs[0] = [];
for (let i = 15; i <= 23; i++) {
    possibleZs[0][i] = true;
}
for (let i = 1; i < 14; i++) {
    for (let curN = 1; curN <= 9; curN++) {
        for (const possibleZ of Object.keys(possibleZs[i - 1])) {
            const {xp, wp, zdiv} = divScores[i];
            const xl = (possibleZ % 26) + xp;
            const x = xl !== curN ? 1 : 0;
            const curZ = Math.floor(possibleZ/zdiv) * (25 * x + 1) + (curN + wp) * x;
            if (i === 13 && curZ === 0) {
                console.log('found possible Z:', possibleZ);
                zeroZs.push(possibleZ);
            }
            if (!possibleZs[i][curZ]) {
                possibleZs[i][curZ] = {};
            }
            possibleZs[i][curZ][curN] = true;
        }
    }
    console.log('Finished adding Zs for digit', i);
}

// backtrack
for (let i = 13; i >= 0; i--) {
    for (const startZ of Object.keys(possibleZs[i])) {
        if (i === 13 && startZ !== 0) {
            continue;
        }
        for (const testZ of Object.keys(possibleZs[i - 1])) {
            for (const curN of Object.keys(possibleZs[i - 1][testZ])) {
                console.log(curN);
                const {xp, wp, zdiv} = divScores[i];
                const xl = (testZ % 26) + xp;
                const x = xl !== curN ? 1 : 0;
                const curZ = Math.floor(testZ/zdiv) * (25 * x + 1) + (curN + wp) * x;
                if (curZ === startZ) {
                    if (!candidateZs[i][curZ]) {
                        candidateZs[i][curZ] = {};
                    }
                    candidateZs[i][curZ][curN] = true;
                }
            }
        }
    }
    console.log(i);
}

fs.writeFileSync('candidateZs.json', JSON.stringify(candidateZs));
*/



//const inputStr = '19559958649567'.split('');
//93959993429899
const inputStr = '11815671117121'.split('').map(a => parseInt(a, 10));
let inputPtr = 0;
let prevInputPtr = 0;
const state = {
    w: 0, x: 0, y: 0, z: 0
}
for (const instr of inData) {
    inputPtr = interp(instr, state, inputStr, inputPtr);
    if (inputPtr !== prevInputPtr) {
        console.log(16 - inputPtr, state);
    }
    prevInputPtr = inputPtr;
}
console.log(state);

/*
let z = 0;
for (let i = 0; i < 14; i++) {
    const {xp, wp, zdiv} = divScores[i];
    const xl = (z % 26) + xp;
    const x = xl !== inputStr[i] ? 1 : 0;
    z = Math.floor(z/zdiv) * (25 * x + 1) + (inputStr[i] + wp) * x;
    console.log(z);
}
*/

return;

/*
const genZ = (scores, inZ, inW) => {
    const {xp, wp, zdiv} = scores;
    const xl = (inZ % 26) + xp;
    const x = xl !== inW ? 1 : 0;
    return Math.floor(inZ/zdiv) * (25 * x + 1) + (inW + wp) * x;
}

const stack = [];
const visited = new Set();
//const prev = {};

for (let i = 12; i <= 12 + 9; i++) {
    stack.push([i, i - 14, 0]);
}

let i = 0;

while (stack.length > 0) {
    const [inZ, inW, digit] = stack.pop();
    if (!visited.has(`${inZ},${inW}`)) {
        const nextScores = divScores[digit + 1];
        for (let w = 1; w <= 9; w++) {
            const zOut = genZ(nextScores, inZ, w);
            //prev[`${zOut},${w}`] = `${inZ},${inW}`;
            if (digit === 12) {
                i = (i + 1) % 1000000;
                if (i === 999999) {
                    console.log(inW, inZ);
                }
                if (zOut === 0) {
                    console.log('Found solution:');
                    console.log(zOut, inW + w);
                    /*let ptr = `${zOut},${w}`;
                    while (ptr) {
                        console.log(ptr);
                        ptr = prev[ptr];
                    }*//*
                    return;
                }
            } else {
                stack.push([zOut, w + inW.toString(), digit + 1]);
            }
        }
        if (!inZ) {
            console.log(inZ, inW, digit);
        }
        visited.add(`${inZ},${inW}`);
    }
}*/