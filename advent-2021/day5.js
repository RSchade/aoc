const fs = require('fs');

const inData = fs.readFileSync('./input-day-5').toString('utf-8').split('\n');

// Part 1
let seaMap = [];
for (let i = 0; i < 1000; i++) {
    const r = new Array(999);
    seaMap.push(r.fill(0));
}
for (let i = 0; i < inData.length; i++) {
    const r = inData[i]
        .split(" -> ")
        .map(a => a.split(',')
        .map(b => parseInt(b, 10)));
    const x1 = Math.min(r[0][0], r[1][0]);
    const y1 = Math.min(r[0][1], r[1][1]);
    const x2 = Math.max(r[0][0], r[1][0]);
    const y2 = Math.max(r[0][1], r[1][1]);
    if (x1 - x2 !== 0 ^ y1 - y2 !== 0) {
        for (let j = x1; j <= x2; j++) {
            for (let k = y1; k <= y2; k++) {
                seaMap[j][k] += 1;
            }
        }
    }
}
let overlaps = seaMap.flat().filter(a => a > 1);
console.log('All Overlaps', overlaps);
console.log('# of overlaps', overlaps.length);

// Part 2
seaMap = [];
for (let i = 0; i < 1000; i++) {
    const r = new Array(999);
    seaMap.push(r.fill(0));
}
for (let i = 0; i < inData.length; i++) {
    const r = inData[i]
        .split(" -> ")
        .map(a => a.split(',')
        .map(b => parseInt(b, 10)));
    const x1 = r[0][0];
    const y1 = r[0][1];
    const x2 = r[1][0];
    const y2 = r[1][1];
    const x1a = Math.min(r[0][0], r[1][0]);
    const y1a = Math.min(r[0][1], r[1][1]);
    const x2a = Math.max(r[0][0], r[1][0]);
    const y2a = Math.max(r[0][1], r[1][1]);
    if (x1 - x2 !== 0 ^ y1 - y2 !== 0) {
        for (let j = x1a; j <= x2a; j++) {
            for (let k = y1a; k <= y2a; k++) {
                seaMap[j][k] += 1;
            }
        }
    } else {
        let xArr = Array.from({length: x2a - x1a + 1}, (x, i) => x1a + i);
        let yArr = Array.from({length: y2a - y1a + 1}, (x, i) => y1a + i);
        if (x1 > x2) {
            xArr = xArr.reverse();
        }
        if (y1 > y2) {
            yArr = yArr.reverse();
        }
        for (let j = 0; j < xArr.length; j++) {
            seaMap[xArr[j]][yArr[j]] += 1;
        }
    }
}
overlaps = seaMap.flat().filter(a => a > 1);
console.log('All Overlaps', overlaps);
console.log('# of overlaps', overlaps.length);