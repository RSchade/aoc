const Heap = require('mnemonist/heap');
const fs = require('fs');

let inData = fs.readFileSync('./input-day-15')
    .toString('utf-8')
    .split('\n')
    .map(a => a.split('').map(a => parseInt(a, 10)));

// Part 2 modifier
const biggerData = new Array(inData.length * 5);
for (let i = 0; i < biggerData.length; i++) {
    biggerData[i] = new Array(inData[0].length * 5);
    for (let j = 0; j < biggerData[i].length; j++) {
        const i2 = Math.floor(i / inData.length);
        const j2 = Math.floor(j / inData[0].length);
        biggerData[i][j] = ((inData[i % inData.length][j % inData[0].length] + i2 + j2 - 1) % 9) + 1;
    }
}
inData = biggerData;
// Part 1
const queue = new Heap(function(a, b) {
    if (a.priority < b.priority)
      return -1;
    if (a.priority > b.priority)
      return 1;
    return 0;
  });

queue.push({priority: 0, i: 0, j: 0});
const backTrack = {};
const dist = {};
for (let i = 0; i < inData.length; i++) {
    for (let j = 0; j < inData[0].length; j++) {
        if (i === 0 && j === 0) {
            dist[`${i},${j}`] = 0;
        } else {
            dist[`${i},${j}`] = 999999999;
        }
    }
}
while(queue.size > 0) {
    const cur = queue.pop();
    const {i, j, priority} = cur;
    if (priority !== dist[`${i},${j}`]) {
        continue;
    }
    if (i === inData.length - 1 && j === inData[0].length - 1) {
        console.log('stopped')
        break;
    }
    for (const n of [[i-1,j], [i+1,j], [i,j-1,], [i,j+1]]) {
        if (n[0] >= 0 && n[1] >= 0 && n[0] < inData.length && n[1] < inData[0].length) {
            const newDist = dist[`${i},${j}`] + inData[n[0]][n[1]];
            if (newDist < dist[`${n[0]},${n[1]}`]) {
                queue.push({priority: newDist, i: n[0], j: n[1]});
                backTrack[`${n[0]},${n[1]}`] = [i,j];
                dist[`${n[0]},${n[1]}`] = newDist;
            }
        }
    }
}
//console.log(dist);
//console.log(backTrack);
let cur = [inData.length - 1, inData[0].length - 1];
let score = 0;
while (cur) {
    score += inData[cur[0]][cur[1]];
    console.log(cur);
    cur = backTrack[`${cur[0]},${cur[1]}`];
    if (!cur) {
        continue;
    }
    if (cur[0] === 0 && cur[1] === 0) {
        break;
    }
}

console.log('Answer:', score);