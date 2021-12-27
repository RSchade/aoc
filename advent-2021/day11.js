const fs = require('fs');

const origData = fs.readFileSync('./input-day-11')
    .toString('utf-8')
    .split('\n')
    .map(a => a.split('').map(a => parseInt(a, 10)));

let inData = origData.map(a => a.map(a => a));

// Part 1
let flashed = {};

const inc = () => {
    for (r of inData) {
        for (let i = 0; i < r.length; i++) {
            r[i] += 1;
        }
    }
}

const incAdj = (i, j) => {
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
            const i2 = i + k;
            const j2 = j + l;
            if (i2 >= 0 && j2 >= 0 && 
                i2 < inData.length && j2 < inData[0].length &&
                !(i === i2 && j === j2)) {
                inData[i2][j2] += 1;
            }
        }
    }
}

const flash = () => {
    let flashes = 0;
    for (let i = 0; i < inData.length; i++) {
        const r = inData[i];
        for (let j = 0; j < r.length; j++) {
            const v = r[j];
            if (v > 9 && !flashed[`${i},${j}`]) {
                flashed[`${i},${j}`] = true;
                incAdj(i,j);
                flashes += 1;
            }
        }
    }
    return flashes;
}

const flashToZero = () => {
    let flashes = 0;
    for (const r of inData) {
        for (let i = 0; i < r.length; i++) {
            if (r[i] > 9) {
                r[i] = 0;
                flashes += 1;
            }
        }
    }
    return flashes;
}


let totalFlashes = 0;
for (let i = 0; i < 100; i++) {
    flashed = {};
    inc();
    let flashes = 1;
    while (flashes > 0) {
        flashes = flash();
        totalFlashes += flashes;
    }
    flashToZero();
    //console.log(inData.map(a => a.join('')).join('\n'));
    //console.log('');
}

console.log('Total flashes:', totalFlashes);


// Part 2
inData = origData.map(a => a.map(a => a));
for (let i = 0; i < 99999999999; i++) {
    flashed = {};
    inc();
    let flashes = 1;
    while (flashes > 0) {
        flashes = flash();
    }
    flashToZero();
    if (Object.keys(flashed).length === inData.length * inData[0].length) {
        console.log('Step when flash is simultaneous:', i + 1);
        break;
    }
}