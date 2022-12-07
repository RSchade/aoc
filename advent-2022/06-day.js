const fs = require('fs');
const data = fs.readFileSync('06-input').toString();

console.log(data);

const buffer = []
for (let i = 0; i < data.length; i++) {
    buffer.push(data[i]);
    if (buffer.length > 4) {// Part 2 14) {
        buffer.shift()
    }
    const uniq = [...new Set(buffer)].length === 4; // Part 2: 14
    if (uniq) {
        console.log(i + 1)
        break;
    }
}