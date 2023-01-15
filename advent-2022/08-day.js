const fs = require('fs');
const data = fs.readFileSync('08-input').toString()
    .split('\n')
    .map(r => r.trim()
               .split('')
               .map(x => parseInt(x,10)));

console.log(data);

const rows = data.length;
const cols = data[0].length;

let visible = 0;

// Part 1
const checkVisibility = (i, j, s) => {
    let found = true;
    for (let x = 0; x < cols; x++) {   
        const curSize = data[i][x];
        if (x === j) {
            if (found) {
                return true;
            }
            found = true;
            continue;
        }
        if (curSize >= s) {
            found = false;
        }
    }
    if (found) {
        return true;
    }
    found = true;
    for (let x = 0; x < rows; x++) {   
        const curSize = data[x][j];
        if (x === i) {
            if (found) {
                return true;
            }
            found = true;
            continue;
        }
        if (curSize >= s) {
            found = false;
        }
    }
    return found;
}

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        // exterior trees
        if (i === 0 || j === 0 || i === rows - 1 || j === cols - 1) {
            visible++;
        } else {
            // interior trees
            if (checkVisibility(i,j, data[i][j])) {
                visible++;
            }
        }
    }
}

console.log(visible);

// Part 2
const calcTreeScore = (i, j, s) => {
    const scores = [];
    let curScore = 0;
    for (let x = j - 1; x >= 0; x--) {
        const curSize = data[i][x];
        curScore++;
        if (curSize >= s) {
            break;
        }
    }
    scores.push(curScore);
    curScore = 0;
    for (let x = j + 1; x < cols; x++) {
        const curSize = data[i][x];
        curScore++;
        if (curSize >= s) {
            break;
        }
    }
    scores.push(curScore);
    curScore = 0;
    for (let x = i - 1; x >= 0; x--) {
        const curSize = data[x][j];
        curScore++;
        if (curSize >= s) {
            break;
        }
    }
    scores.push(curScore);
    curScore = 0;
    for (let x = i + 1; x < rows; x++) {
        const curSize = data[x][j];
        curScore++;
        if (curSize >= s) {
            break;
        }
    }
    scores.push(curScore);
    return scores.reduce((a, b) => a * b);
}

let treeScores = [];
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        treeScores.push(calcTreeScore(i,j,data[i][j]));
    }
}
console.log(Math.max(...treeScores));