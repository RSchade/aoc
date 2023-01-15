const firstLayer = `
8  8  3  4  12  2  5  10  7  16  8  7
9  4  4  6   6  3  3  14 14  21 21  9
15 4  5  6   7  8  9  10 11  12 13 14
14 11 11 14 11 14 11  14 14  11 14 11
`;

const secondLayer = `
x 12 x  6  x  10 x  10 x 1  x  9
x 2  13 9  x  17 19 3 12 3  26 6
3 6  x  14 12 3  8  9  x 9  20 12
x 7  14 11 x  8  x  16 2 7  x  9
`;

const thirdLayer = `
x x  x  x x x  x  x  x  x  x x
x 5  x 10 x 8  x  22 x  16 x 9
x 21 6 15 4 9  18 11 26 24 1 12
8 9  3 9  7 13 21 17 4  5  x 7
`;

const fourthLayer = `
x x  x  x x x  x  x  x  x  x x
x x  x  x x x  x  x  x  x  x x
15 x x  14 x 9  x 12 x  4 x 7
6  x 11 11 6 11 x 6  17 7 3 x
`;

const fifthLayer = `
x x  x  x x x  x  x  x  x  x x
x x  x  x x x  x  x  x  x  x x
x x  x  x x x  x  x  x  x  x x
8 x 3 x 6 x 10 x 7 x 15 x
`;

const formatLayer = layer => {
    const splitLayer = layer.trim().split('\n').map(x => x.split(' ').filter(x => x !== ''));
    const out = Array(12);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 12; j++) {
            if (!out[j]) {
                out[j] = [];
            }
            if (splitLayer[i] && splitLayer[i][j] && splitLayer[i][j] !== 'x') {
                out[j].push(parseInt(splitLayer[i][j], 10));
            } else if (splitLayer[i] && splitLayer[i][j] && splitLayer[i][j] === 'x') {
                out[j].push(null);
            } else {
                out[j].unshift(null);
            }
        }
    }
    return out;
}

const layers = [firstLayer, secondLayer, thirdLayer, fourthLayer, fifthLayer].map(formatLayer);

//console.log(layers[4]);
//return;

let most42s = 0;

const isValid = idxs => {
    const cols = Array(12).fill(0); // values of each column on the circle
    const pos = Array(12); // column position for each
    for (let i = 0; i < pos.length; i++) {
        pos[i] = [false, false, false, false];
    }
    // use idxs as offsets
    for (let col = 0; col < 12; col++) {
        for (let layer = 4; layer >= 0; layer--) {
            const curColOnLayer = layers[layer][(col + idxs[layer]) % 12];
            // current column on the layer
            // add to column values, increment positions as necessary
            for (let cell = 3; cell >= 0; cell--) {
                const cur = curColOnLayer[cell];
                if (cur !== null) {
                    if (!pos[col][cell]) {
                        //console.log(curColOnLayer[cell], col, layer, cell);
                        cols[col] += curColOnLayer[cell];
                    }
                    pos[col][cell] = true;
                    // can't end here, holes are possible
                }
            }
        }
        //console.log();
    }
    //console.log(cols);
    const is42 = cols.filter(x => x === 42);
    if (is42.length > most42s) {
        most42s = is42.length;
        //console.log(is42);
        console.log("-----\n\n\n");
        for (let col = 0; col < 12; col++) {
            for (let layer = 4; layer >= 0; layer--) {
                const curColOnLayer = layers[layer][(col + idxs[layer]) % 12];
                console.log(curColOnLayer);
            }
            console.log();
        }
        console.log(cols);
        console.log(most42s, idxs);
    }
    return is42.length === 11;
}

//console.log(isValid([0,0,0,0,0]));
//return;

let i = 0;
const cur = [0,0,0,0,0];
while (cur[4] < 11) {
    //console.log(cur);
    if (isValid(cur)) {
        console.log("Found valid solution");
        console.log(cur);
        break;
    }
    i++;
    let orig = i;
    j = 1;
    while (orig > 0) {
        cur[j] = orig % 12;
        orig = Math.floor(orig / 12);
        j++;
    }
}