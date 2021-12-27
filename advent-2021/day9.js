const fs = require('fs');

const inData = fs.readFileSync('./input-day-9')
    .toString('utf-8')
    .split('\n')
    .map(a => a.split('').map(a => parseInt(a, 10)));

// Part 1
const out = [];
const outCoords = []; // for part 2
for (let i = 0; i < inData.length; i++) {
    for (let j = 0; j < inData[0].length; j++) {
        const curTile = inData[i][j];
        const n = [];
        if (i - 1 >= 0) {
            n.push(inData[i - 1][j]);
        }
        if (i + 1 < inData.length) {
            n.push(inData[i + 1][j]);
        }
        if (j - 1 >= 0) {
            n.push(inData[i][j - 1]);
        }
        if (j + 1 < inData[0].length) {
            n.push(inData[i][j + 1]);
        }
        let min = 9999999;
        for (let k = 0; k < n.length; k++) {
            min = Math.min(min, n[k]);
        }
        if (curTile < min) {
            out.push(curTile); // risk level is 1 + height
            outCoords.push([i,j]);
        }
    }
}

console.log('Sum of low points:', out.map(a => a + 1).reduce((a, b) => a + b));

// Part 2
const getNeighbors = (i, j) =>{
    const n = [];
    if (i - 1 >= 0) {
        n.push([i-1,j]);
    }
    if (i + 1 < inData.length) {
        n.push([i+1,j]);
    }
    if (j - 1 >= 0) {
        n.push([i,j-1]);
    }
    if (j + 1 < inData[0].length) {
        n.push([i,j+1]);
    }
    return n;
}

const getCoord = (i, j) => `${i},${j}`;

const visited = {};

const calcBasinSize = (i1, j1) => {
    let size = 0;
    const queue = [[i1,j1]];
    while (queue.length > 0) {
        const [i, j] = queue.shift();
        if (!visited[getCoord(i,j)]) {
            for (const c of getNeighbors(i,j)) {
                if (inData[c[0]][c[1]] < 9) {
                    queue.push(c);
                }
            }
            size++;
            visited[getCoord(i,j)] = true;
        }
    }
    return size;
}

const sizes = [];
for (const [i,j] of outCoords) {
    const cur = inData[i][j];
    if (cur < 9) {
        sizes.push(calcBasinSize(i, j));
    }
}

sizes.sort((a, b) => {
    return b - a;
});
console.log('Basin Sizes:', sizes);
console.log(sizes.slice(0,3));
const threeLargest = sizes.slice(0,3);
console.log('Top 3 multiplied:', threeLargest[0] * threeLargest[1] * threeLargest[2]);