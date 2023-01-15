const fs = require('fs');
const data = fs.readFileSync('22-input')
    .toString().split("\n");

let directions = data[data.length - 1];
const board = data.slice(0,-2).map(l => l.split(''));
const boardDisp = JSON.parse(JSON.stringify(board));

const print = () => {
    //console.log(boardDisp.map(l => l.join('')).join("\n"));
}

print();
console.log(directions);

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

let pos = [0, board[0].indexOf(".")];
let globalDir = [0, 1];

const dirs = ["0,1","1,0","0,-1","-1,0"]; // clockwise

console.log(globalDir, pos);

// Part 1
/*
for (const iter of directions.matchAll(/(?<num>[0-9]+)|(?<dir>R|L)/g)) {
    const {num, dir} = iter.groups;
    console.log(globalDir, pos, num ?? '', dir ?? '');
    if (num !== undefined) {
        // move
        const n = parseInt(num, 10);
        for (let i = 0; i < n; i++) {
            let newPos = add(pos, globalDir);
            newPos[0] = newPos[0] % board.length;
            if (newPos[0] < 0) {
                newPos[0] += board.length;
            }
            newPos[1] = newPos[1] % board.length;
            if (newPos[1] < 0) {
                newPos[1] += board[0].length;
            }
            const atNewPos = board[newPos[0]][newPos[1]];
            if (atNewPos === '#') {
                // blocked by wall
                break;
            } else if (atNewPos === '.') {
                // walk free
                pos = newPos;
            } else {
                // wrap
                //console.log("wrap", num);
                let newPos = pos;
                let atNewPos = null;
                do {
                    newPos = add(newPos, globalDir);
                    newPos[0] = newPos[0] % board.length;
                    if (newPos[0] < 0) {
                        newPos[0] += board.length;
                    }
                    newPos[1] = newPos[1] % board.length;
                    if (newPos[1] < 0) {
                        newPos[1] += board[0].length;
                    }
                    //console.log(newPos, globalDir);
                    atNewPos = board[newPos[0]][newPos[1]];
                } while(atNewPos !== '#' && atNewPos !== '.')
                if (atNewPos === '.') {
                    // move to this position
                    pos = newPos;
                } else {
                    // blocked
                    break;
                }
            }
        }
    } else {
        // turn
        const dirIdx = dirs.indexOf(globalDir.join(","));
        if (dir === 'R') {
            globalDir = dirs[(dirIdx + 1) % dirs.length].split(",").map(x => parseInt(x, 10));
        } else {
            const dmidx = (dirIdx - 1);
            globalDir = dirs[dmidx < 0 ? dirs.length + dmidx : dmidx].split(",").map(x => parseInt(x, 10));
        }
    }
}

console.log(globalDir, pos);

console.log(1000 * (pos[0] + 1) + 4 * (pos[1] + 1) + dirs.indexOf(globalDir.join(",")));
*/

// Part 2

// sample problem
/*
const cubeSideLength = 4;
// cube r, cube c, direction coming in, new direction
const cubeWrapMap = {
    "0,2": [[2, 3, 't', [1,0]], [1, 2, 't', [1,0]], [1, 1, 't', [1,0]], [1, 0, 't', [1,0]]], // clockwise: r, b, l, t
    "1,0": [[1, 1, 'l', [0,1]], [2, 2, 'l', [0,1]], [2, 3, 'r', [0,-1]], [0, 2, 't', [1,0]]],
    '1,1': [[1, 2, 'r', [0,1]], [2, 2, 'l', [0,1]], [1, 0, 'r', [0,-1]], [0, 2, 'l', [0,1]]],
    "1,2": [[2, 3, 't', [1,0], true], [2, 2, 't', [1, 0]], [1, 1, 'r', [0,-1]], [0, 2, 'b', [-1,0]]],
    "2,2": [[2, 3, 'l', [0,1]], [1, 0, 'b', [-1,0], true], [1, 1, 'l', [0,1]], [1, 2, 'b', [-1,0]]],
    "2,3": [[1, 0, 'l', [0,1]], [0, 1, 't', [1,0]], [2, 2, 'r', [0,-1]], [1, 2, 'r', [0,-1]]]
}
*/

const cubeSideLength = 50;

/*
   XX
   X
  XX
  X
*/

/*
     (0,1) (0,2)
     (1,1)
(2,0)(2,1)
(3,0)
*/

const cubeWrapMap = {
    "0,1": [[0, 2, 'l', [0,1]], [1, 1, 't', [1,0]], [2, 0, 'l', [0,1], true], [3, 0, 'l', [0,1]]],
    "0,2": [[2, 1, 'r', [0,-1], true], [1, 1, 'r', [0,-1]], [0, 1, 'r', [0,-1]], [3, 0, 'b', [-1,0]]],
    "1,1": [[0, 2, 'b', [-1,0]], [2, 1, 't', [1,0]], [2, 0, 't', [1,0]], [0, 1, 'b', [-1,0]]],
    "2,0": [[2, 1, 'l', [0,1]], [3, 0, 't', [1,0]], [0, 1, 'l', [0,1], true], [1, 1, 'l', [0,1]]],
    "2,1": [[0, 2, 'r', [0,-1], true], [3, 0, 'r', [0,-1]], [2, 0, 'r', [0, -1]], [1, 1, 'b', [-1, 0]]],
    "3,0": [[2, 1, 'b', [-1,0]], [0, 2, 't', [1,0]], [0, 1, 't', [1, 0]], [2, 0, 'b', [-1, 0]]]
}

// 4408 is low

const wrap = (pos, dir) => {
    const cubeIdx = [Math.floor(pos[0]/cubeSideLength), Math.floor(pos[1]/cubeSideLength)];
    const rowInCube = pos[0] - cubeIdx[0] * cubeSideLength;
    const colInCube = pos[1] - cubeIdx[1] * cubeSideLength;
    const wrapInstr = cubeWrapMap[cubeIdx[0] + ',' + cubeIdx[1]];
    let posInLine = -1;
    let wrapIdx = -1;
    console.log("INCUBE", rowInCube, colInCube, cubeIdx, pos, dir)
    // if inside the square, don't wrap
    if (rowInCube > 0 && colInCube > 0 && rowInCube < cubeSideLength - 1 && colInCube < cubeSideLength - 1) {
        //console.log("nowrap");
        return [pos, dir, false];
    }
    if (rowInCube === 0 && dir[0] === -1) {
        // going up
        console.log("up");
        posInLine = colInCube;
        wrapIdx = 3;
    } else if (rowInCube === cubeSideLength - 1 && dir[0] === 1) {
        // going down
        console.log("down");
        posInLine = colInCube;
        wrapIdx = 1;
    } else if (colInCube === 0 && dir[1] === -1) {
        // going left
        console.log("left");
        posInLine = rowInCube;
        wrapIdx = 2;
    } else if (colInCube === cubeSideLength - 1 && dir[1] === 1) {
        // going right
        console.log("right");
        posInLine = rowInCube;
        wrapIdx = 0;
    } else {
        //console.log("nowrap");
        return [pos, dir, false];
    }
    console.log(wrapIdx, cubeIdx);
    const wrapTo = wrapInstr[wrapIdx];
    const wrapDir = wrapTo[2];
    const reverse = !!wrapTo[4];
    const corrPos = reverse ? (cubeSideLength - 1) - posInLine : posInLine;
    let wrappedPos = null;
    if (wrapDir === 't') {
        wrappedPos = [
            wrapTo[0] * cubeSideLength, 
            wrapTo[1] * cubeSideLength + corrPos
        ];
    } else if (wrapDir === 'b') {
        wrappedPos = [
            wrapTo[0] * cubeSideLength + cubeSideLength - 1, 
            wrapTo[1] * cubeSideLength + corrPos
        ];
    } else if (wrapDir === 'l') {
        wrappedPos = [
            wrapTo[0] * cubeSideLength + corrPos, 
            wrapTo[1] * cubeSideLength
        ];
    } else if (wrapDir === 'r') {
        wrappedPos = [
            wrapTo[0] * cubeSideLength + corrPos, 
            wrapTo[1] * cubeSideLength + cubeSideLength - 1
        ];
    }
    console.log("move to:", wrappedPos, wrapTo[3]);
    // return new pos, and new direction
    return [wrappedPos, [...wrapTo[3]], true];
}

//console.log(wrap([3,11], [0,1]));
//return;

for (const iter of directions.matchAll(/(?<num>[0-9]+)|(?<dir>R|L)/g)) {
    const {num, dir} = iter.groups;
    console.log(globalDir, pos, num ?? '', dir ?? '');
    if (num !== undefined) {
        // move
        const n = parseInt(num, 10);
        for (let i = 0; i < n; i++) {
            const [wrappedPos, wrappedDir, moved] = wrap(pos, globalDir);
            let newPos = wrappedPos;
            let newDir = wrappedDir;
            console.log("ATPOSBEFWALK:", pos);
            if (board[newPos[0]][newPos[1]] === '#') {
                // blocked by wall
                break;
            } 
            pos = newPos;
            globalDir = newDir;
            boardDisp[pos[0]][pos[1]] = 'X';
            if (moved) {
                continue;
            }
            newPos = add(pos, globalDir);
            console.log("NEWPOS:", newPos);
            const atNewPos = board[newPos[0]][newPos[1]];
            if (atNewPos === '#') {
                // blocked by wall
                break;
            } else if (atNewPos === '.') {
                // walk free
                boardDisp[newPos[0]][newPos[1]] = 'X';
                pos = newPos;
            }
            print();
            console.log();
        }
    } else {
        // turn
        const dirIdx = dirs.indexOf(globalDir.join(","));
        if (dir === 'R') {
            globalDir = dirs[(dirIdx + 1) % dirs.length].split(",").map(x => parseInt(x, 10));
        } else {
            const dmidx = (dirIdx - 1);
            globalDir = dirs[dmidx < 0 ? dirs.length + dmidx : dmidx].split(",").map(x => parseInt(x, 10));
        }
        console.log("TURNED TO", globalDir);
    }
    print();
}

console.log(globalDir, pos);

console.log(1000 * (pos[0] + 1) + 4 * (pos[1] + 1) + dirs.indexOf(globalDir.join(",")));