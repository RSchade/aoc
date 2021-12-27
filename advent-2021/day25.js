const fs = require('fs');

const inData = fs.readFileSync('./input-day-25')
    .toString('utf-8').split('\n').map(a => a.split(''));

const disp = b => console.log(b.map(a => a.join('')).join('\n') + '\n');
const getStr = b => b.map(a => a.join('')).join('\n');

let tempMap = JSON.parse(JSON.stringify(inData));

console.log('Start:');
disp(tempMap);

for (let k = 0; k < 1000; k++) {
    let rMap = JSON.parse(JSON.stringify(tempMap));

    // left
    for (let i = 0; i < inData.length; i++) {
        for (let j = 0; j < inData[0].length; j++) {
            if (tempMap[i][j] === '>' && tempMap[i][(j + 1) % inData[0].length] === '.') {
                rMap[i][j] = '.';
                rMap[i][(j + 1) % inData[0].length] = '>';
            }
        }
    }

    let dMap = JSON.parse(JSON.stringify(rMap));

    // down
    for (let i = 0; i < inData.length; i++) {
        for (let j = 0; j < inData[0].length; j++) {
            if (rMap[i][j] === 'v' && rMap[(i + 1) % inData.length][j] === '.') {
                dMap[i][j] = '.';
                dMap[(i + 1) % inData.length][j] = 'v';
            }
        }
    }

    console.log('After step ' + (k + 1) + ':');
    disp(dMap);

    if (getStr(tempMap) === getStr(dMap)) {
        console.log('Stopped at step ' + (k + 1));
        break;
    }

    tempMap = dMap;
}