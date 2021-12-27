const fs = require('fs');
const { zip } = require('lodash');

const inData = fs.readFileSync('./input-day-22')
    .toString('utf-8').split('\n');

console.log(inData);

// Part 1
/*
const size = 101;
const reactor = (new Array(size)).fill(0).map(a => (new Array(size)).fill(0).map(a => (new Array(size)).fill(false)));

const toIdx = i => i + Math.floor(size / 2);

const max = size/2;
const min = -size/2;

for (const r of inData) {
    console.log(r);
    const action = r.indexOf("on") !== -1;
    const intervals = r.split(',')
        .map(a => a.split('=')[1])
        .map(a => a.split('..')
        .map(a => parseInt(a, 10)));
    if (intervals[0][0] < min || intervals[0][1] > max) {
        continue;
    }
    for (let i = intervals[0][0]; i <= intervals[0][1]; i++) {
        for (let j = intervals[1][0]; j <= intervals[1][1]; j++) {
            for (let k = intervals[2][0]; k <= intervals[2][1]; k++) {
                const i1 = toIdx(i);
                const j1 = toIdx(j);
                const k1 = toIdx(k);
                if (i1 < size && i1 >= 0 && j1 < size && 
                    j1 >= 0 && k1 < size && k1 >= 0) {
                    reactor[i1][j1][k1] = action;
                }
            }
        }
    }
}

console.log(reactor.flat().flat().flat().reduce((a, b) => a + b));
*/

// Part 2
let cubesList = [];
for (const r of inData) {
    const action = r.indexOf("on") !== -1;
    const intervals = r.split(',')
        .map(a => a.split('=')[1])
        .map(a => a.split('..')
        .map(a => parseInt(a, 10)));
    cubesList.push([action, intervals]);
}

//let cubes = 0;

const getIVol = (c, ints) => {
    return Math.max(Math.min(ints[0][1],c[0][1])-Math.max(ints[0][0],c[0][0])+1,0) *
           Math.max(Math.min(ints[1][1],c[1][1])-Math.max(ints[1][0],c[1][0])+1,0) *
           Math.max(Math.min(ints[2][1],c[2][1])-Math.max(ints[2][0],c[2][0])+1,0);
}

const getSharedCube = (ints, c) => {
    return [
        [Math.max(ints[0][0],c[0][0]), Math.min(ints[0][1],c[0][1])],
        [Math.max(ints[1][0],c[1][0]), Math.min(ints[1][1],c[1][1])],
        [Math.max(ints[2][0],c[2][0]), Math.min(ints[2][1],c[2][1])]
    ];
}

/*
const intersect = (a, i) => {
    const ints = JSON.parse(JSON.stringify(a));
    let vol = 0;
    let pieces = [];
    console.log(inData[i]);
    for (const [action, c] of cubesList.slice(i+1)) {
        let newVol = getIVol(c, ints);
        if (action) {
            const usedPieces = [];
            const usedOffPieces = [];
            for (const [pieceType, p] of pieces) {
                const curVol = getIVol(p, c);
                if (curVol > 0) {
                    if (pieceType) {
                        usedPieces.push(getSharedCube(p, c));
                        newVol -= curVol;
                    } else {
                        usedOffPieces.push(getSharedCube(p, c));
                        newVol -= getIVol(p, c);
                        for (const p2 of usedPieces) {
                            newVol -= getIVol(p2, p);
                        }
                    }
                }
            }
            newVol -= usedOffPieces.reduce((acc, v, i) =>
                acc.concat(usedOffPieces.slice(i+1).map(w => getIVol(v, w))),
            []).reduce((a, b) => a + b, 0);
            newVol += usedPieces.reduce((acc, v, i) =>
                acc.concat(usedPieces.slice(i+1).map(w => getIVol(v, w))),
            []).reduce((a, b) => a + b, 0);
            const newPiece = getSharedCube(ints, c);
            pieces.push([true, newPiece]);
            vol += newVol;
        } else {
            // TODO: this is wrong
            //const newPieces = [];
            for (const [pt, p] of pieces) {
                if (pt) {
                    const curVol = getIVol(p, c);
                    if (curVol > 0) {
                        newVol -= curVol;
                    } else {
                        //newPieces.push([pt, p]);
                    }
                }
            }
            //pieces = newPieces;
            pieces.push([false, c]);
            vol += newVol;
        }
        console.log(vol, newVol);
        //console.log(pieces);
    }
    console.log('ivol', vol);
    return vol;
}

let i = 0;
for (const [action, intervals] of cubesList) {
    if (action) {
        const vol = ((intervals[0][1] - intervals[0][0]) + 1) * 
                ((intervals[1][1] - intervals[1][0]) + 1) *
                ((intervals[2][1] - intervals[2][0]) + 1);
        console.log('vol', vol);
        const iVol = intersect(intervals, i);
        if (vol < iVol) {
            console.log('error');
            return;
        }
        cubes += vol - iVol; 
        console.log('new diff', vol - iVol);
        console.log(cubes);
    }
    i += 1;
}
*/

const boundaries = [[],[],[]];

for (const [action, intervals] of cubesList) {
    for (let i = 0; i < 3; i++) {
        boundaries[i].push(intervals[i][0]);
        boundaries[i].push(intervals[i][1] + 1);
    }
}

for (let i = 0; i < 3; i++) {
    boundaries[i] = boundaries[i].sort((a, b) => a - b);
}

cubesList.reverse();

let count = 0;

for (const [x1, x2] of zip(boundaries[0], boundaries[0].slice(1))) {
    console.log('x', x1);
    const insX = cubesList.filter(([action, ins]) => {
        return ins[0][0] <= x1 && x1 <= ins[0][1];
    });
    for (const [y1, y2] of zip(boundaries[1], boundaries[1].slice(1))) {
        const insY = insX.filter(([action, ins]) => {
            return ins[1][0] <= y1 && y1 <= ins[1][1];
        });
        for (const [z1, z2] of zip(boundaries[2], boundaries[2].slice(1))) {
            const insZ = insY.filter(([action, ins]) => {
                return ins[2][0] <= z1 && z1 <= ins[2][1];
            });
            if (insZ.length > 0 && insZ[0][0]) {
                count += (x2 - x1) * (y2 - y1) * (z2 - z1);
            }
        }
    }
}

console.log(count);