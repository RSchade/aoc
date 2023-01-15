const fs = require('fs');
const data = fs.readFileSync('23-input')
    .toString().split('\n').map(l => l.trim().split(''));
const squareSize = [data.length, data[0].length];
console.log("Original Board Size:", squareSize);

let board = {};
for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
        if (data[i][j] === '#') {
            board[[i,j]] = {
                lookOrder: ['n', 's', 'w', 'e'],
                proposed: null
            }
        }
    }
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const w = [0,-1];
const e = [0,1];
const n = [-1,0];
const s = [1,0];
const ne = [-1,1];
const nw = [-1,-1];
const sw = [1,-1];
const se = [1,1];

const dirCheckLkp = {
    n: [n,ne,nw],
    s: [s,sw,se],
    e: [e,se,ne],
    w: [w,nw,sw]
}

const print = () => {
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
            const val = board[i + ',' +j];
            if (val) {
                process.stdout.write("#");
            } else {
                process.stdout.write(".");
            }
        }
        console.log();
    }
    console.log();
}

print();

const maxRounds = Infinity//10;

for (let r = 0; r < maxRounds; r++) {
    console.log("ROUND:", r + 1);
    // first phase
    for (const rawElf of Object.keys(board)) {
        const elf = rawElf.split(',').map(x => parseInt(x, 10));
        let hasNeighbor = false;
        // if no elves adjacent, don't do anything
        for (const d of [n,s,w,e,ne,nw,sw,se]) {
            const pos = add(elf, d);
            if (board[pos]) {
                hasNeighbor = true;
                break;
            }
        }
        if (hasNeighbor) {
            // check positions in the correct order
            let foundMove = null;
            for (const lookDir of board[elf].lookOrder) {
                let valid = true;
                for (const checkDir of dirCheckLkp[lookDir]) {
                    const pos = add(elf,checkDir);
                    if (board[pos]) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    foundMove = dirCheckLkp[lookDir][0]; // first one is the way to move
                    break;
                }
            }
            if (foundMove) {
                board[elf].proposed = add(elf, foundMove);
            }
        }
    }
    // second phase
    const proposedCounts = {};
    for (const elfVal of Object.values(board)) {
        // rotate lookOrder
        elfVal.lookOrder = elfVal.lookOrder.concat([elfVal.lookOrder[0]]).slice(1);
        // add up proposed counts
        if (elfVal.proposed) {
            if (!proposedCounts[elfVal.proposed]) {
                proposedCounts[elfVal.proposed] = 0;
            }
            proposedCounts[elfVal.proposed]++;
        }
    }
    let anyMoved = false;
    const newBoard = {};
    for (const rawElf of Object.keys(board)) {
        const elf = rawElf.split(',').map(x => parseInt(x, 10));
        const elfVal = board[rawElf];
        // if there is more than one proposed count, don't move
        if (proposedCounts[elfVal.proposed] <= 1) {
            newBoard[elfVal.proposed] = elfVal;
            anyMoved = true;
        } else {
            newBoard[elf] = elfVal;
        }
        elfVal.proposed = null;
    }
    board = newBoard;
    print();

    if (!anyMoved) {
        console.log("No elves moved at round", r + 1);
        break;
    }
}

// Part 1
const positions = Object.keys(board).map(x => x.split(',').map(x => parseInt(x, 10)));
const maxI = Math.max(...positions.map(x => x[0]));
const maxJ = Math.max(...positions.map(x => x[1]));
const minI = Math.min(...positions.map(x => x[0]));
const minJ = Math.min(...positions.map(x => x[1]));
let emptyTiles = 0;
for (let i = minI; i <= maxI; i++) {
    for (let j = minJ; j <= maxJ; j++) {
        if (!board[i + ',' + j]) {
            emptyTiles++;
        }
    }
}

console.log("Empty tiles:", emptyTiles);