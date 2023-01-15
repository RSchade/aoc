const fs = require('fs');
const data = fs.readFileSync('25-input').toString().split('\n').map(x => x.trim());

console.log(data);

// parse SNAFU

// starting from the right to the left, powers of 5s
// 25s 5s 1s

// digits are:
// 2 1 0 -1 -2
// 2 1 0 -  =

const parseSnafu = (snafu) => {
    let dec = 0;
    for (let i = 0; i < snafu.length; i++) {
        const curPlaceVal = Math.pow(5, (snafu.length - i - 1));
        let snafuDigitVal = {
            '2': 2,
            '1': 1,
            '0': 0,
            '-': -1,
            '=': -2
        }[snafu[i]];
        dec += snafuDigitVal * curPlaceVal;
    }
    return dec;
}

// add all of them together

const decVals = data.map(parseSnafu);
const addedVals = decVals.reduce((a, b) => a + b);

console.log(decVals);
console.log(addedVals);

// convert back to SNAFU

// 0, 1, 2, 1=, 1-, 10, 11, 12, 2=, 2-, 20
// 0, 1, 2, 3,   4, 10, 11, 12, 13, 14, 20

const snafuToDec = (dec) => {
    let snafu = '';
    let left = dec;
    while (left > 0) {
        let digit = left % 5;
        if (digit === 3) {
            digit = '=';
            left += 2;
        } else if (digit === 4) {
            digit = '-';
            left += 1;
        }
        snafu = digit + snafu;
        left = Math.floor(left / 5);
    }
    return snafu;
}

console.log("ADDED SNAFU VAL:", snafuToDec(addedVals));//snafuToDec(addedVals));