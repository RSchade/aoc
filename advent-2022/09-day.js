const fs = require('fs');
const data = fs.readFileSync('09-input').toString().split('\n').map(a => { const b = a.trim().split(' '); return [b[0], parseInt(b[1],10)]});

let hPos = [0,0];
let tPos = [0,0];

const moveMap = {
    R: [1,0],
    L: [-1,0],
    U: [0,1],
    D: [0,-1]
}

const noDiagDirs = [[0,0],[1,0],[-1,0],[0,1],[0,-1]];
const diagDirs = [[1,1],[-1,-1],[1,-1],[-1,1]];
const allDirs = [...noDiagDirs, ...diagDirs];

const add = (a,b) => [a[0]+b[0],a[1]+b[1]];
const equals = (a,b) => a[0] === b[0] && a[1] === b[1];

const tPoses = new Set();

tPoses.add(tPos[0] + ',' + tPos[1]);

// Part 1
/*for (const move of data) {
    const dir = move[0];
    const dist = move[1];
    console.log(move);
    for (let i = 0; i < dist; i++) {
        //console.log();
        hPos = add(moveMap[dir], hPos);
        // figure out if the head and tail aren't in the same row or column
        let goodPos = false;
        let close = false;

        for (const tMove of noDiagDirs) {
            const newT = add(tMove,tPos);
            if (equals(add(tMove,newT),hPos)) {
                close = true;
                break;
            }
            for (const tMove2 of noDiagDirs) {
                if (equals(add(tMove2,newT),hPos)) {
                    close = true;
                    break;
                }
            }
        }

        for (const tMove of (close ? noDiagDirs : diagDirs)) {
            let ptPos = add(tPos, tMove);
            for (const nMove of allDirs) {
                if (equals(add(ptPos, nMove),hPos)) {
                    goodPos = true;
                    break;
                }
            }
            if (goodPos) {
                tPos = ptPos;
                break;
            }
        }
        
        console.log(hPos, tPos);
        tPoses.add(tPos[0] + ',' + tPos[1]);
    }
}
tPoses.add(tPos[0] + ',' + tPos[1]);
console.log(hPos, tPos);

console.log(tPoses.size);*/


// Part 2
const tails = Array(9).fill([0,0]);
for (const move of data) {
    const dir = move[0];
    const dist = move[1];
    console.log(move);
    for (let i = 0; i < dist; i++) {
        hPos = add(moveMap[dir], hPos);
        let prevTail = hPos;
        for (let t = 0; t < tails.length; t++) {
            let tail = tails[t];
            // figure out if the head and tail aren't in the same row or column
            let goodPos = false;
            let close = false;
            
            for (const tMove of noDiagDirs) {
                const newT = add(tMove,tail);
                if (equals(add(tMove,newT),prevTail)) {
                    close = true;
                    break;
                }
                for (const tMove2 of noDiagDirs) {
                    if (equals(add(tMove2,newT),prevTail)) {
                        close = true;
                        break;
                    }
                }
            }

            for (const tMove of (close ? noDiagDirs : diagDirs)) {
                let ptPos = add(tail, tMove);
                for (const nMove of allDirs) {
                    if (equals(add(ptPos, nMove),prevTail)) {
                        goodPos = true;
                        break;
                    }
                }
                if (goodPos) {
                    tails[t] = ptPos;
                    break;
                }
            }
            prevTail = tails[t];
        }
        tPoses.add(tails[8][0] + ',' + tails[8][1]);

        /*for (let c = 30; c >= 0; c--) {
            for (let r = 0; r < 30; r++) {
                if (equals([r,c],hPos)) {
                    process.stdout.write('H');
                    continue;
                }
                let found = false;
                for (let t = 0; t < tails.length; t++) {
                    if (equals(tails[t],[r,c])) {
                        process.stdout.write((t + 1) + '');
                        found = true;
                        break;
                    }
                }
                if (found) {
                    continue;
                }
                process.stdout.write('.');
            }
            console.log('');
        }
        console.log();*/
    }
}

console.log(tPoses.size);