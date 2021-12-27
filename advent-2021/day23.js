const fs = require('fs');
const Heap = require('mnemonist/heap');

const inData = fs.readFileSync('./input-day-23')
    .toString('utf-8').split('\n').map(a => a.split(''));

// Part 1
const getBoardStr = b => {
    return b.state.map(a => {
        return a.map(a => {
            if (typeof(a) === 'number') {
                return b.amphis[a].type;
            } else {
                return a;
            }
        }).join('');
    }).join('\n')
}

const drawBoard = b => {
    console.log(getBoardStr(b));
    console.log();
}

const getBoardKey = b => JSON.stringify(b.state);

const energy = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000
}

const rooms = {
    'A': 3,
    'B': 5,
    'C': 7,
    'D': 9
}

const startBoard = {
    amphis: [],
    state: inData,
    energyUsed: 0
}

for (let i = 0; i < inData.length; i++) {
    for (let j = 0; j < inData[0].length; j++) {
        const elem = inData[i][j];
        if (['A','B','C','D'].indexOf(elem) !== -1) {
            const newAmphi = {
                type: elem,
                moved: false,
                i,
                j
            };
            const amhiIdx = startBoard.amphis.push(newAmphi) - 1;
            newAmphi.idx = amhiIdx;
            inData[i][j] = amhiIdx;
        }
    }
}

const createNewBoard = (state, amphi, amphis, curI, curJ, curEnergyUsed, amphiTerminal) => {
    const newState = state.map(r => r.map(c => {
        if (c === amphi.idx) {
            return '.';
        }
        return c;
    }));
    newState[curI][curJ] = amphi.idx;
    const newAmphis = JSON.parse(JSON.stringify(amphis));
    newAmphis[amphi.idx].moved = true;
    newAmphis[amphi.idx].i = curI;
    newAmphis[amphi.idx].j = curJ;
    newAmphis[amphi.idx].terminal = amphiTerminal;
    return {
        amphis: newAmphis,
        state: newState,
        energyUsed: curEnergyUsed
    };
}

const getNeighborStates = b => {
    const neighbors = [];
    const {state, amphis} = b;
    for (const amphi of amphis) {
        if (amphi.terminal) {
            continue;
        }
        const queue = [[amphi.i,amphi.j,0]];
        const visited = {};
        while (queue.length > 0) {
            const cur = queue.pop();
            if (!visited[`${cur[0]},${cur[1]}`]) {
                const [curI, curJ, curWeight] = cur;
                const newWeight = curWeight + energy[amphi.type];
                if (state[curI - 1][curJ] === '.') {
                    // up available
                    queue.unshift([curI - 1, curJ, newWeight]);
                }
                // can't move down if haven't moved before
                if (amphi.moved) {
                    if (state[curI + 1][curJ] === '.') {
                        // down available
                        queue.unshift([curI + 1, curJ, newWeight]);
                    }
                }
                if (state[curI][curJ - 1] === '.') {
                    // left available
                    queue.unshift([curI, curJ - 1, newWeight]);
                }
                if (state[curI][curJ + 1] === '.') {
                    // right available
                    queue.unshift([curI, curJ + 1, newWeight]);
                }
                visited[`${cur[0]},${cur[1]}`] = true;
                if (!(amphi.i === curI && amphi.j === curJ)) {
                    if (amphi.moved) {
                        // needs to be in the home room, and at the bottom
                        if (curJ === rooms[amphi.type] && 
                            curI >= 2 && 
                            state[curI][curJ] === '.' && 
                            ((amphis[state[curI + 1][curJ]] && amphis[state[curI + 1][curJ]].type === amphi.type) || state[curI + 1][curJ] === '#')) {
                            const newN = createNewBoard(state, amphi, amphis, curI, curJ, curWeight + b.energyUsed, true);
                            neighbors.push([curWeight, newN]);
                            break;
                        }
                    } else {
                        // can't block a room
                        if (state[curI + 1][curJ] === '#') {
                            const newN = createNewBoard(state, amphi, amphis, curI, curJ, curWeight + b.energyUsed, false);
                            neighbors.push([curWeight, newN]);
                        }
                    }
                }
            }
        }
    }
    return neighbors;
}

const isEndState = b => {
    /*const endState = `#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########`;*/
    const endState = `#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########`;
    return endState === getBoardStr(b);
}

console.log('Start Board');
drawBoard(startBoard);

console.log('Find Path');

/*
getNeighborStates(startBoard).map(b => {
    console.log(b[0]);
    drawBoard(b[1]);
})

return;
*/

const queue = new Heap(function(a, b) {
    if (a.priority < b.priority)
      return -1;
    if (a.priority > b.priority)
      return 1;
    return 0;
  });

queue.push({priority: 0, board: startBoard});

const dist = {};
const prev = {};
const prevToStr = {};

dist[getBoardKey(startBoard)] = 0;

while (queue.size > 0) {
    const {priority, board} = queue.pop();
    const bKey = getBoardKey(board);
    if (priority !== dist[bKey]) {
        continue;
    }
    //drawBoard(board);
    if (isEndState(board)) {
        console.log('end state reached');
        let ptr = getBoardKey(board);
        while(ptr) {
            console.log(prevToStr[ptr]);
            console.log();
            if (!prev[ptr]) {
                break;
            }
            ptr = getBoardKey(prev[ptr]);
        }
        console.log(board.energyUsed);
        break;
    }
    for (const [w, n] of getNeighborStates(board)) {
        const nKey = getBoardKey(n);
        if (typeof(dist[bKey]) !== 'number') {
            dist[bKey] = Infinity;
        }
        if (typeof(dist[nKey]) !== 'number') {
            dist[nKey] = Infinity;
        }
        const alt = dist[bKey] + w;
        if (alt < dist[nKey]) {
            dist[nKey] = alt;
            prev[nKey] = board;
            prevToStr[nKey] = getBoardStr(board);
            queue.push({priority: alt, board: n});
        }
    }
}
