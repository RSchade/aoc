const fs = require('fs');

let inData = fs.readFileSync('./input-day-4').toString('utf-8').split('\n');

// Part 1, win first
const boards = [];
// create boards
let curBoard = [];
for (let i = 2; i < inData.length; i++) {
    const r = inData[i];
    if (r === '') {
        boards.push(curBoard);
        curBoard = [];
    } else {
        curBoard.push(r.split(" ")
            .filter(a => a !== '')
            .map(a => parseInt(a, 10)));
    }
}

// mark the boards, check for bingos
const markBoard = (board, callNumber) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === callNumber) {
                board[i][j] = -1;
            }
        }
    }
}
const checkBoard = board => {
    let won = false;
    for (let i = 0; i < board.length; i++) {
        if (board[i].reduce((p, c) => p + c) === -5) {
            won = true;
        }
    }
    if (!won) {
        for (let i = 0; i < board.length; i++) {
            if (board[0][i] + board[1][i] + 
                board[2][i] + board[3][i] + 
                board[4][i] === -5) {
                won = true;
            }
        }
    }
    let s = 0;
    if (won) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] !== -1) {
                    s += board[i][j]
                }
            }
        }
    }
    return s;
}
const callSheet = inData[0].split(",")
    .filter(a => a !== '')
    .map(a => parseInt(a, 10));
const wins = [];
const alreadyWon = {};
(() => {
    for (const callNumber of callSheet) {
        for (let i = 0; i < boards.length; i++) {
            const b = boards[i];
            markBoard(b, callNumber);
            if (!alreadyWon[i]) {
                const score = checkBoard(b);
                if (score) {
                    wins.push(score * callNumber);
                    alreadyWon[i] = true;
                }
            }
        }
        if (wins.length === boards.length) {
            return;
        }
    }
})();
console.log('First win:', wins[0]);
// Part 2, last win
console.log('Last win:', wins.slice(-1)[0]);