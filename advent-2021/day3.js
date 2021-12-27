const fs = require('fs');

let inData = fs.readFileSync('./input-day-3').toString('utf-8').split('\n');

// Part 1
const ones = [];
const zeroes = [];
for (let i = 0; i < inData.length; i++) {
    for (let j = 0; j < inData[i].length; j++) {
        if (!ones[j]) {
            ones[j] = 0;
        }
        if (!zeroes[j]) {
            zeroes[j] = 0;
        }
        if (inData[i][j] === '1') {
            ones[j] += 1;
        } else {
            zeroes[j] += 1;
        }
    }
}

let gamma = "";
let epsilon = "";
for (let i = 0; i < ones.length; i++) {
    if (ones[i] > zeroes[i]) {
        gamma += "1";
        epsilon += "0";
    } else {
        gamma += "0";
        epsilon += "1";
    }
}

console.log('Gamma and Epsilon');
console.log(gamma, epsilon);
console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));

// Part 2
const applyCriteria = (highest, pos, data) => {
    let ones = 0;
    let zeroes = 0;
    for (let i = 0; i < data.length; i++) {
        const cur  = data[i][pos];
        if (cur === '1') {
            ones += 1;
        } else {
            zeroes += 1;
        }
    }
    let out;
    if (highest) {
        out = ones >= zeroes ? '1' : '0';
    } else {
        out = ones < zeroes ? '1' : '0';
    }
    const newData = data.filter(n => {
        return n[pos] === out;
    });
    return newData;
}

const len = inData[0].length;

// o2 is most freq, co2 is least freq
let o2Data = inData;
let co2Data = inData;
for (let i = 0; i < len; i++) {
    if (o2Data.length > 1) {
        o2Data = applyCriteria(true, i, o2Data);
    }
    if (co2Data.length > 1) {
        co2Data = applyCriteria(false, i, co2Data);
    }
}

console.log('CO2 and O2');
console.log(co2Data[0], o2Data[0]);
console.log(parseInt(co2Data[0], 2) * parseInt(o2Data[0], 2));