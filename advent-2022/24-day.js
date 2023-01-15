const fs = require('fs');
const initialBoard = fs.readFileSync('24-input')
    .toString()
    .split('\n')
    .map(x => x.split('').map(x => {
        if (x === '.') {
            return [];
        } else {
            return [x];
        }
    }));

const print = (b) => {
    console.log(b.map(x => {
        return x.map(pt => {
            if (pt.length === 0) {
                return '.';
            } else if (pt.length > 1) {
                return pt.length;  
            } else {
                return pt[0];
            }
        }).join('');
    }).join('\n'));
}
const add = (a,b) => [a[0] + b[0], a[1] + b[1]];

console.log("BOARD");
print(initialBoard);
console.log("R,C:", initialBoard.length, initialBoard[0].length);
console.log();
console.log();

const createNewBoard = (board) => {
    const newBoard = Array(board.length);
    for (let i = 0; i < newBoard.length; i++) {
        newBoard[i] = Array(board[0].length);
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j][0] === '#') {
                newBoard[i][j] = ['#'];
            } else {
                newBoard[i][j] = [];
            }
        }
    }
    return newBoard;
}

const iterBlizzards = (board) => {
    const newBoard = createNewBoard(board);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            for (const pt of board[i][j]) {
                let mv = [0,0];
                if (pt === '^') {
                    mv[0] = -1;
                } else if (pt === '>') {
                    mv[1] = 1;
                } else if (pt === '<') {
                    mv[1] = -1
                } else if (pt === 'v') {
                    mv[0] = 1;
                }
                if (mv[0] === 0 && mv[1] === 0) {
                    // not moving (already populated)
                } else {
                    // actually move
                    const to = add([i,j], mv);
                    const at = board[to[0]][to[1]];
                    if (at[0] === '#') {
                        // reset
                        if (pt === '^') {
                            newBoard[board.length - 2][j].push(pt);
                        } else if (pt === '>') {
                            newBoard[i][1].push(pt);
                        } else if (pt === 'v') {
                            newBoard[1][j].push(pt);
                        } else if (pt === '<') {
                            newBoard[i][board[0].length - 2].push(pt);
                        }
                    } else {
                        newBoard[to[0]][to[1]].push(pt);
                    }
                }
            }
        }
    }
    return newBoard;
}

const blizzardMaps = [initialBoard];
const getBlizzardMap = (time) => {
    if (blizzardMaps.length <= time) {
        for (let i = blizzardMaps.length; i <= time; i++) {
            blizzardMaps.push(iterBlizzards(blizzardMaps[i - 1]));
        }
    } 
    return blizzardMaps[time];
}


//let b = initialBoard;

// test out blizzards
/*
for (let i = 0; i < 10; i++) {
    b = iterBlizzards(b);
    print(b);
    console.log();
}
*/

let startingBoard = initialBoard;

// 0 to 311 : first trip
// 312 to 573 : trip back (took 261)
// : trip back to ending

// when starting from another timestep
for (let i = 0; i <= 573; i++) {
    startingBoard = iterBlizzards(startingBoard);
}

const LRUCache = require('mnemonist/lru-cache');

// Find best path through blizzards
const queue = [{
    pos: [0,1],//[initialBoard.length - 1, initialBoard[0].length - 2],//[0,1],
    //board: JSON.parse(JSON.stringify(startingBoard)),
    time: 574
}]; 

const seenStates = new LRUCache(300000);

let i = 0;

while (queue.length > 0) {
    const cur = queue.shift();
    const pos = cur.pos;
    //const board = cur.board;
    // save visited states
    const stringState = [cur.pos, cur.time].join(',');
    if (seenStates.has(stringState)) {
        continue;
    }
    seenStates.set(stringState, true);
    i++;
    if (i % 1000 === 0) {
        console.log("ITER", pos, cur.time, i, 'to:', [initialBoard.length - 1, initialBoard[0].length - 2]);   
    }
    //console.log("ITER", pos, cur.time);
    //print(board);
    //console.log();
    // start:
    if (pos[0] === initialBoard.length - 1 && pos[1] === initialBoard[0].length - 2) {
    // end:
    //if (pos[0] === 0 && pos[1] === 1) {
        console.log("FOUND END", pos, cur.time);
        break;
    }
    for (const dir of [[1,0],[-1,0],[0,-1],[0,1],[0,0]]) {
        const nPos = add(cur.pos, dir);
        if (nPos[0] < 0 || nPos[0] > initialBoard.length - 1 || nPos[1] < 0 || nPos[1] > initialBoard[0].length - 1) {
            // can't be out of bounds
            continue;
        }
        const newBoard = getBlizzardMap(cur.time + 1);
        const atNPos = newBoard[nPos[0]][nPos[1]];
        if (atNPos.length > 0) {
            // can't be in a wall or a blizzard
            continue;
        }
        queue.push({
            pos: nPos,
            board: newBoard,
            time: cur.time + 1
        });
    }
}
