const fs = require('fs');

const inData = fs.readFileSync('./input-day-13')
    .toString('utf-8')
    .split('\n');

// Part 1
const dots = inData.filter(a => a.indexOf(',') !== -1)
    .map(a => a.split(',')
    .map(a => parseInt(a, 10)));
const max = [0, 0];
const min = [9999, 9999];
for (const d of dots) {
    max[0] = Math.max(d[0], max[0]);
    max[1] = Math.max(d[1], max[1]);
    min[0] = Math.min(d[0], min[0]);
    min[1] = Math.min(d[1], min[1]);
}
console.log('max', max);
console.log('min', min);
let grid = new Array(max[1] + 1);
for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(max[0] + 1);
    grid[i].fill('.');
}
for (const d of dots) {
    grid[d[1]][d[0]] = '#'
}

const printBoard = () => {
    console.log(grid.map(a => a.join('')).join('\n'));
}

printBoard();

const folds = inData
    .filter(a => a.indexOf('fold') !== -1)
    .map(a => {
        if (a.indexOf('y=') !== -1) {
            return ['y', parseInt(a.split('=')[1], 10)];
        } else if (a.indexOf('x=') !== -1) {
            return ['x', parseInt(a.split('=')[1], 10)];
        } else {
            console.log('FOLD ISSUE');
        }
    });

console.log(folds);

for (const fold of folds) {
    console.log(grid.length, grid[0].length);
    const foldOn = fold[1];
    if (fold[0] === 'y') {
        console.log('fold y');
        for (let i = grid.length - 1; i > foldOn; i--) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j] === '#') {
                    const newLen = grid.length - foldOn - 1;
                    grid[newLen - (i - foldOn)][j] = '#';
                }
            }
        }
        grid = grid.slice(0, foldOn);
    } else {
        console.log('fold x');
        for (let i = 0; i < grid.length; i++) {
            for (let j = grid[0].length - 1; j > foldOn; j--) {
                if (grid[i][j] === '#') {
                    const newJ = j - foldOn;
                    if (newJ <= foldOn) {
                        grid[i][foldOn - newJ] = '#';
                    }
                }
            }
        }
        console.log();
        grid = grid.map(a => a.slice(0, foldOn));
        console.log(grid.length, grid[0].length);
    }
    printBoard();
    console.log();
    //break;
}

console.log('Part 1, dots:', grid.map(a => a.map(a => a === '#' ? 1 : 0)).flat().reduce((a, b) => a + b));