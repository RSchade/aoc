const fs = require('fs');

const inData = fs.readFileSync('./input-day-20')
    .toString('utf-8').split('\n');

let enhance = null;
let img = null;

let cur = '';
let top = true;
for (let i = 0; i < inData.length; i++) {
    if (inData[i] === '') {
        enhance = cur;
        cur = '';
        top = false;
        continue;
    }
    cur += inData[i] + (top ? '' : '\n');
}
img = cur.split('\n').map(a => a.split('').map(a => a === '#' ? 1 : 0));
img = img.slice(0,-1);
enhance = enhance.split('').map(a => a === '#' ? 1 : 0);

//console.log(enhance);
//console.log(img);

const padImg = (img, fill) => {
    let padAmt = [0,0,0,0];
    for (let i = 0; i < img[0].length; i++) {
        if (img[0][i] === fill) {
            padAmt[0] = 2;
        }
    }
    if (padAmt[0] === 0) {
        for (let i = 0; i < img[1].length; i++) {
            if (img[1][i] === fill) {
                padAmt[0] = 1;
            }
        }
    }
    for (let i = 0; i < img[0].length; i++) {
        if (img[img.length - 1][i] === fill) {
            padAmt[1] = 2;
        }
    }
    if (padAmt[1] === 0) {
        for (let i = 0; i < img[1].length; i++) {
            if (img[img.length - 2][i] === fill) {
                padAmt[1] = 1;
            }
        }
    }
    for (let i = 0; i < img.length; i++) {
        if (img[i][0] === fill) {
            padAmt[2] = 2;
        }
    }
    if (padAmt[2] === 0) {
        for (let i = 0; i < img.length; i++) {
            if (img[i][1] === fill) {
                padAmt[2] = 1;
            }
        }
    }
    for (let i = 0; i < img.length; i++) {
        if (img[i][img[0].length - 1] === fill) {
            padAmt[3] = 2;
        }
    }
    if (padAmt[3] === 0) {
        for (let i = 0; i < img.length; i++) {
            if (img[i][img[0].length - 2] === fill) {
                padAmt[3] = 1;
            }
        }
    }
    console.log(padAmt);
    for (let i = 0; i < img.length; i++) {
        for (let j = 0; j < padAmt[2]; j++) {
            img[i].unshift(3);
        }
        for (let j = 0; j < padAmt[3]; j++) {
            img[i].push(3);
        }
    }
    for (let j = 0; j < padAmt[1]; j++) {
        img.push((new Array(img[0].length)).fill(3));
    }
    for (let j = 0; j < padAmt[0]; j++) {
        img.unshift((new Array(img[0].length)).fill(3));
    }

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < img[0].length; j++) {
            img[i][j] = fill;
        }
    }
    for (let i = -2; i < 0; i++) {
        for (let j = 0; j < img[0].length; j++) {
            img[img.length + i][j] = fill;
        }
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < img.length; j++) {
            img[j][i] = fill;
        }
    }
    for (let i = -2; i < 0; i++) {
        for (let j = 0; j < img.length; j++) {
            img[j][img.length + i] = fill;
        }
    }
}

const applyEnhance = (img, imgOut, idx1, idx2) => {
    let bits = '';
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            bits += img[i + idx1][j + idx2];
        }
    }
    imgOut[idx1][idx2] = enhance[parseInt(bits, 2)];
}

console.log(img.map(a => a.join('')).join('\n'));
console.log();

let fill = 0;

for (let i = 0; i < 50; i++) {
    padImg(img, fill);
    fill = fill === 0 ? 1 : 0;
    console.log(img.map(a => a.join('')).join('\n'));
    console.log();

    let imgOut = JSON.parse(JSON.stringify(img));

    for (let i = 1; i < img.length - 1; i++) {
        for (let j = 1; j < img[0].length - 1; j++) {
            applyEnhance(img, imgOut, i, j);
        }
    }

    img = imgOut;

    console.log(img.map(a => a.join('')).join('\n'));
    console.log();
}

img.shift();
img.pop();
for (let i = 0; i < img.length; i++) {
    img[i][0] = 0;
}
for (let i = 0; i < img.length; i++) {
    img[i][img[0].length - 1] = 0;
}

console.log(img.map(a => a.join('')).join('\n'));
console.log();

console.log(img.flat().reduce((a, b) => a + b));

//fs.writeFileSync('out', img.map(a => a.map(a => a === 1 ? 'O' : ' ')).map(a => a.join('')).join('\n'));