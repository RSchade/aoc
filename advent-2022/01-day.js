const fs = require('fs');
const data = fs.readFileSync('01-input').toString();

const lines = data.split("\n");

const totals = [];
let curTotal = 0;
for (let line of lines) {
    line = line.trim();
    if (line == "") {
        totals.push(curTotal);
        curTotal = 0;
    } else {
        curTotal += parseInt(line, 10);
    }
}

// star 1
/*
// imperative
let curMax = 0;
for (let total of totals) {
    if (total > curMax) {
        curMax = total;
    }
}
console.log(curMax);
// functional
console.log(Math.max(...totals));
*/

// star 2
totals.sort((a, b) => {
    return b - a;
});
// imperative
console.log(totals[0] + totals[1] + totals[2]);
// functional
console.log(totals.slice(0,3).reduce((prev, cur) => prev + cur));
