const fs = require('fs');

// Part 1
let lTimers = fs.readFileSync('./input-day-6')
    .toString('utf-8')
    .split(',')
    .map(a => parseInt(a, 10));

for (let i = 0; i < 80; i++) {
    const newEntries = [];
    for (let j = 0; j < lTimers.length; j++) {
        lTimers[j] -= 1;
        if (lTimers[j] < 0) {
            newEntries.push(8);
            lTimers[j] = 6;
        }
    }
    lTimers.push(...newEntries);
}

console.log('After 80 days', lTimers, lTimers.length);

// Part 2
lTimers = fs.readFileSync('./input-day-6')
    .toString('utf-8')
    .split(',')
    .map(a => parseInt(a, 10));
const buckets = [[0, 0, 0, 0, 0, 0, 0, 0, 0]];
for (const t of lTimers) {
    buckets[0][t] += 1;
}
for (let i = 0; i < 256; i++) {
    const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    n[8] = buckets[i][0];
    n[7] = buckets[i][8];
    n[6] = buckets[i][7] + buckets[i][0];
    n[5] = buckets[i][6];
    n[4] = buckets[i][5];
    n[3] = buckets[i][4];
    n[2] = buckets[i][3];
    n[1] = buckets[i][2];
    n[0] = buckets[i][1];
    buckets.push(n);
}
const l = buckets[buckets.length - 1];
console.log('After 256 days:', l.reduce((a, b) => a + b));