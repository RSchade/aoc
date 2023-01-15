const fs = require('fs');
const data = fs.readFileSync('17-input').toString();

const rawRocks = `####

.#.
###
.#.

###
..#
..#

#
#
#
#

##
##
`.split('\n');

const rocks = [];
let curRock = [];
for (const l of rawRocks) {
    if (l === '') {
        rocks.push(curRock);
        curRock = [];
    } else {
        curRock.push(l.split(''));
    }
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

const wide = 7;

// Part 1
/*
let toFall = 2022;

let fallingRock = null;
let highestRock = 0;
let rockIdx = 0;
let i = 0;
const landscape = new Set();

const print = () => {
    for (let i = 30; i >= 0; i--) {
        process.stdout.write("|");
        for (let j = 0; j < wide; j++) {
            let found = false;
            for (const rPt of fallingRock ?? []) {
                if (rPt[0] === i && rPt[1] === j) {
                    process.stdout.write("%");
                    found = true;
                }
            }
            if (!found) {
                process.stdout.write(landscape.has(i+','+j) ? '#' : ' ');
            }
        }
        process.stdout.write("|");
        console.log();
    }
    console.log("---------\n\n");
}

const collided = rock => rock.filter(p => landscape.has(p[0]+','+p[1]) || p[0] < 0).length > 0;

while (toFall > 0) {
    if (!fallingRock) {
        fallingRock = [];
        const curRock = rocks[rockIdx];
        for (let i = 0; i < curRock.length; i++) {
            for (let j = 0; j < curRock[0].length; j++) {
                if (curRock[i][j] === '#') {
                    fallingRock.push([i + (highestRock + 3), j + 2]);
                }
            }
        }
        rockIdx = (rockIdx + 1) % rocks.length;
        print();
    }
    // jet
    const touchingRight = fallingRock.filter(x => x[1] >= wide - 1).length > 0;
    const touchingLeft = fallingRock.filter(x => x[1] <= 0).length > 0;
    const jetDir = data[i % data.length];
    let potentialNext = fallingRock;
    if (jetDir === '>' && !touchingRight) {
        potentialNext = potentialNext.map(x => add(x, [0,1]));
    } else if (jetDir === '<' && !touchingLeft) { 
        potentialNext = potentialNext.map(x => add(x, [0,-1]));
    }
    // check collision
    if (!collided(potentialNext)) {
        fallingRock = potentialNext;   
    } // if collided, do nothing for left/right
    console.log(jetDir, i, fallingRock);
    print();
    // move down
    potentialNext = fallingRock.map(x => add(x, [-1,0]));
    // check collision
    if (!collided(potentialNext)) {
        fallingRock = potentialNext;   
    } else {
        for (const pt of fallingRock) {
            highestRock = Math.max(highestRock, pt[0] + 1);
            landscape.add(pt[0]+','+pt[1]);
        }
        fallingRock = null;
        toFall--;
    }
    i++;
    print();
}

console.log("Highest rock", highestRock);
*/

// Part 2
// after 1000000000000 rocks

let landscape = new Set();
let newLandscape = new Set();
let highestRock = 0;
let rockIdx = 0;
let i = 0;

const simulate = (toFall) => {
    let fallingRock = null;
    let origCol = -1;
    const collided = rock => rock.filter(p => landscape.has(p[0]+','+p[1]) || newLandscape.has(p[0]+','+p[1]) || p[0] < 0).length > 0;

    let rockHeights = [];

    while (toFall > 0) {
        if (!fallingRock) {
            fallingRock = [];
            const curRock = rocks[rockIdx];
            for (let i = 0; i < curRock.length; i++) {
                for (let j = 0; j < curRock[0].length; j++) {
                    if (curRock[i][j] === '#') {
                        fallingRock.push([i + (highestRock + 3), j + 2]);
                    }
                }
            }
            rockIdx = (rockIdx + 1) % rocks.length;
        }
        // jet
        const touchingRight = fallingRock.filter(x => x[1] >= wide - 1).length > 0;
        const touchingLeft = fallingRock.filter(x => x[1] <= 0).length > 0;
        const jetDir = data[i % data.length];
        let potentialNext = fallingRock;
        if (jetDir === '>' && !touchingRight) {
            potentialNext = potentialNext.map(x => add(x, [0,1]));
        } else if (jetDir === '<' && !touchingLeft) { 
            potentialNext = potentialNext.map(x => add(x, [0,-1]));
        }
        // check collision
        if (!collided(potentialNext)) {
            fallingRock = potentialNext;   
        } // if collided, do nothing for left/right
        // move down
        potentialNext = fallingRock.map(x => add(x, [-1,0]));
        // check collision
        if (!collided(potentialNext)) {
            fallingRock = potentialNext;   
        } else {
            for (const pt of fallingRock) {
                highestRock = Math.max(highestRock, pt[0] + 1);
                newLandscape.add(pt[0]+','+pt[1]);
            }
            rockHeights.push(highestRock);
            if (origCol === -1) {
                origCol = fallingRock[0];
            }
            fallingRock = null;
            toFall--;
        }
        i++;
    }

    return [rockHeights, origCol];
}

let target = 1000000000000;

const period = 5 * data.length; // 5 is the number of rocks
//console.log(period, data.length);

// Simulate to try and find the pattern between periods
// when the pattern is found then find the 1st minus the last height, the base height (after 1 sim)
// and how many periods it repeats itself
/*
const oldHeights = [];

for (let i = 0; i < 1000; i++) {
    oldHeights.push(highestRock);
    //console.log(rockIdx % rawRocks.length);
    const [baseHeights, origCol] = simulate(period);
    console.log(i, baseHeights[baseHeights.length - 1], origCol, rockIdx % rawRocks.length);
    landscape = newLandscape;
    newLandscape = new Set();
}*/

// simulate the extra: 265619.999883055

/*
simulate(period);
const [baseHeights, origCol] = simulate(265620);
console.log(baseHeights[baseHeights.length - 1], origCol);
return; // 418591 extra height
*/

// In part 2:
// 0: 79531
// 1-339: 26953061

// for sample:
// 0: 308
// 1-7: 2120

const firstHeight = 79531//308;
const periodsPerRepeat = 339//7;
const heightPerRepeat = 26953061//2120;
const targetBlocks = target;
const blocksPerPeriod = period;

const periodsForTarget = targetBlocks / blocksPerPeriod;
const repeatsForTarget = (periodsForTarget - 1) / periodsPerRepeat;
const rem = (repeatsForTarget - Math.floor(repeatsForTarget)) * periodsPerRepeat * blocksPerPeriod;
console.log("remainder:", rem); // take this remainder, uncomment the top and run rounded (should be extremely close to a number)

console.log(Math.floor(repeatsForTarget) * heightPerRepeat + firstHeight + 418591);
//1575810790896
