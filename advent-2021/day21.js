//let player1Pos = 4;
//let player2Pos = 8;
let player1Pos = 10;
let player2Pos = 7;
const maxBoard = 10;

/*
let curDice = 0;
let rolls = 0;
const nextDiceRoll = () => {
    rolls += 1;
    curDice += 1;
    if (curDice > 100) {
        curDice = 1;
    }
    return curDice;
}

let p1Score = 0;
let p2Score = 0;

while (p1Score < 1000 && p2Score < 1000) {
    const player1Moves = nextDiceRoll() + nextDiceRoll() + nextDiceRoll();
    player1Pos = ((player1Pos + player1Moves - 1) % maxBoard) + 1;
    p1Score += player1Pos;

    if (p1Score >= 1000) {
        break;
    }

    const player2Moves = nextDiceRoll() + nextDiceRoll() + nextDiceRoll();
    player2Pos = ((player2Pos + player2Moves - 1) % maxBoard) + 1;
    p2Score += player2Pos;

    console.log(p1Score, p2Score);
}

console.log('Part 1', rolls * Math.min(p1Score, p2Score));
*/

const diceRolls = [];
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        for (let k = 1; k <= 3; k++) {
            diceRolls.push(i + j + k);
        }
    }
}

const states = {};
let p1Wins = 0;
let p2Wins = 0;

const getName = (pos1, pos2, s1, s2) => `${pos1},${pos2},${s1},${s2}`;

states[getName(player1Pos, player2Pos, 0, 0)] = 1;

while (Object.keys(states).length > 0) {
    for (const k of Object.keys(states)) {
        const [pos1, pos2, s1, s2] = k.split(',').map(a => parseInt(a, 10));
        const games = states[k];
        const validAfterP1 = [];
        for (const d of diceRolls) {
            const newPos1 = (d + pos1 - 1) % maxBoard + 1;
            if (s1 + newPos1 >= 21) {
                p1Wins += games;
            } else {
                validAfterP1.push(newPos1);
            }
        }
        for (const newPos1 of validAfterP1) {
            for (const d of diceRolls) {
                const newPos2 = (d + pos2 - 1) % maxBoard + 1;
                if (s2 + newPos2 >= 21) {
                    p2Wins += games;
                } else {
                    const newK = getName(newPos1, newPos2, s1 + newPos1, s2 + newPos2);
                    if (!states[newK]) {
                        states[newK] = 0;
                    }
                    states[newK] += games;
                }
            }
        }
        delete states[k];
    }
    console.log(Object.keys(states).length);
}

console.log(p1Wins, p2Wins);