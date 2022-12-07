const fs = require('fs');
const data = fs.readFileSync('04-input').toString();
const assignments = data.split('\n')
    .map(x => x.split(',')
                .map(elf => elf.trim()
                               .split('-')
                               .map(x => parseInt(x, 10))));
// Part 1
const within = (l, r) => {
    return (l[0] >= r[0] && l[1] <= r[1]);
}
const ret = assignments.map(pair => {
    const l = pair[0];
    const r = pair[1];
    return within(l, r) || within(r, l);
}).reduce((acc, cur) => acc + (cur ? 1 : 0));
console.log(ret);

// Part 2
const overlap = (l, r) => {
    return (l[0] <= r[0] && l[1] >= r[0]) || // 4-8,5-10
           (l[0] <= r[1] && l[1] >= r[1]) // 9-11,4-9
}
const ret2 = assignments.map(pair => {
    const l = pair[0];
    const r = pair[1];
    return overlap(l, r) || overlap(r, l);
}).reduce((acc, cur) => acc + (cur ? 1 : 0));
console.log(ret2);