const fs = require('fs');
const data = fs.readFileSync('18-input')
    .toString()
    .split('\n')
    .map(x => x.trim().split(',').map(x => parseInt(x, 10)));

console.log(data, data.length);

const cubes = {};
for (const c of data) {
    cubes[c] = c;
}

const add = (a, b) => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const toStr = (a) => a.join(',');

const visited = new Set();
let emptyFace = 0;

// Part 1
/*
while (visited.size < data.length) {
    const stack = [];
    for (const l of data) {
        if (!visited.has(toStr(l))) {
            stack.unshift(l);
            break;
        }
    }
    while (stack.length > 0) {
        const cur = stack.pop();
        //console.log(stack.length);
        for (const dir of [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]]) {
            const nCoord = add(cur, dir);
            const v = visited.has(toStr(nCoord));
            if (cubes[nCoord] && !v) {
                visited.add(toStr(nCoord));
                stack.unshift(nCoord);
            } 
            if (!cubes[nCoord]) {
                emptyFace++;
            }
        }
        visited.add(toStr(cur));
    }
    console.log("done with group", visited.size, data.length, emptyFace);
}

console.log("OPEN FACES", emptyFace);
*/

// Part 2
// start at 0,0,0. Expand outwards and count contact with lava

const max = [-Infinity,-Infinity,-Infinity];
const min = [Infinity, Infinity, Infinity];

for (const l of data) {
    min[0] = Math.min(l[0], min[0]);
    min[1] = Math.min(l[1], min[1]);
    min[2] = Math.min(l[2], min[2]);
    max[0] = Math.max(l[0], max[0]);
    max[1] = Math.max(l[1], max[1]);
    max[2] = Math.max(l[2], max[2]);
}
console.log("MIN/MAX", min, max);

const queue = [[0,0,0]];
while (queue.length > 0) {
    const cur = queue.pop();
    for (const dir of [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]]) {
        const nCoord = add(cur, dir);
        const v = visited.has(toStr(nCoord));
        if (!cubes[nCoord] && !v) {
            // air, continue expanding
            visited.add(toStr(nCoord));
            queue.unshift(nCoord);
        }
        if (cubes[nCoord]) {
            emptyFace++;
        }
    }
    visited.add(toStr(cur));
    //console.log(queue.length);
    console.log("OPEN FACES", emptyFace);
    //console.log(cur);
}

// just run this until it stabilizes, I didn't feel like bounds checking with the min and max

console.log("OPEN FACES", emptyFace);