const fs = require('fs');
const data = fs.readFileSync('02-input').toString();
const lines = data.split("\n").map(l => l.trim().split(" "));

// Part 1
let score = 0;
for (const l of lines) {
    const f = l[0];
    const s = l[1];
    if (f === 'A') {
        if (s === 'X') {
            score += 1 + 3;
        } else if (s === 'Y') {
            score += 2 + 6;
        } else if (s === 'Z') {
            score += 3;
        }
    } else if (f === 'B') {
        if (s === 'X') {
            score += 1;
        } else if (s === 'Y') {
            score += 2 + 3;
        } else if (s === 'Z') {
            score += 3 + 6;
        }
    } else if (f === 'C') {
        if (s === 'X') {
            score += 1 + 6;
        } else if (s === 'Y') {
            score += 2;
        } else if (s === 'Z') {
            score += 3 + 3;
        }
    }
}

console.log(score);

// Part 2
score = 0;
for (const l of lines) {
    const f = l[0];
    const s = l[1];
    if (f === 'A') { // Rock
        if (s === 'X') { // Lose
            score += 3 + 0;
        } else if (s === 'Y') { // Draw
            score += 1 + 3;
        } else if (s === 'Z') { // Win
            score += 2 + 6;
        }
    } else if (f === 'B') { // Paper
        if (s === 'X') {
            score += 1 + 0;
        } else if (s === 'Y') {
            score += 2 + 3;
        } else if (s === 'Z') {
            score += 3 + 6;
        }
    } else if (f === 'C') { // Scissors
        if (s === 'X') {
            score += 2 + 0;
        } else if (s === 'Y') {
            score += 3 + 3;
        } else if (s === 'Z') {
            score += 1 + 6;
        }
    }
}

console.log(score);