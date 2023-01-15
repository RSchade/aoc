const fs = require('fs');
const data = fs.readFileSync('14-input')
    .toString()
    .split('\n')
    .map(x => x.trim()
               .split(' -> ')
               .map(x => x.split(',')
                          .map(x => parseInt(x, 10))));

const points = [];
let lowest = -Infinity;

for (const line of data) {
    for (let i = 1; i < line.length; i++) {
        const next = line[i];
        const last = line[i-1];
        const dir = next[0] !== last[0] ? 'x' : 'y';
        const diff = (next[0] - last[0]) + (next[1] - last[1]);
        for (let j = (i === 1 ? 0 : 1); j <= Math.abs(diff); j++) {
            const step = Math.sign(diff) * j;
            if (dir === 'x') {
                points.push([last[0] + step, last[1]]);
            } else if (dir === 'y') {
                points.push([last[0], last[1] + step]);
            }
        }
        if (next[1] > lowest) {
            lowest = next[1];
        }
    }
}

const pointSet = new Set();

for (const pt of points) {
    pointSet.add(pt.join(','));
}

const sandPoint = [500, 0];

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

console.log("Pit is at:", lowest);


let curSand = null;
let sandAtRest = 0;
while (true) {
    if (curSand === null) {
        curSand = [...sandPoint];
    }

    // Part 1
    // if we are in the abyss/pit, then we are done
    /*if (curSand[1] >= lowest) {
        break;
    }*/

    // check down, fall down
    // if bottom is blocked, attempt to move diagonally one step down and to the left
    // if that isn't there then one down and to the right
    // else, comes to rest

    const down = add(curSand,[0,1]);
    const dl = add(curSand,[-1,1]);
    const dr = add(curSand,[1,1]);
    let moved = false;
    for (const pos of [down, dl, dr]) {
        // Part 2
        // simulate a big ol line 2 lower than the lowest point
        
        if (!pointSet.has(pos.join(',')) && pos[1] < lowest + 2) {
            moved = true;
            curSand = pos;
            break;
        }
    }
    if (!moved) {
        sandAtRest++;
        pointSet.add(curSand.join(','));
        // Part 2
        // Stop when sand comes to rest at 500,0
        if (curSand[0] === 500 && curSand[1] === 0) {
            break;
        }
        curSand = null;
    }
}

console.log(sandAtRest);