const fs = require('fs');
const data = fs.readFileSync('13-input').toString().split('\n').map(x => x.trim());

const pairs = [];
let curPair = [];
for (const line of data) {
    if (line === '') {
        pairs.push(curPair);
        curPair = [];
    } else {
        curPair.push(eval(line)); // evil eval!
    }
}
pairs.push(curPair);

// Part 1

const compare = (p) => {
    //console.log("Checking:", JSON.stringify(p));
    const [l, r] = p;
    // Integer case
    if (typeof(l) === 'number' && typeof(r) === 'number') {
        //console.log("Checking:", l, r);
        if (l === r) {
           // console.log("same, continue");
            return "continue";
        }
        return l < r;
    } else if (typeof(l) !== 'number' && typeof(r) === 'number') {
        return compare([l,[r]]);
    } else if (typeof(l) === 'number' && typeof(r) !== 'number') {
        return compare([[l],r]);
    }
    // List case
    for (let i = 0; i < l.length; i++) {
        if (r[i] === undefined) {
            //console.log("right exhausted, fail");
            return false; // exhausted on the right side
        }
        const res = compare([l[i], r[i]]);
        if (res === false) {
            //console.log("cmp fail");
            return false;
        } else if (res === true) {
            return true;
        }
    }
    return l.length === r.length ? "continue" : true;
}

/*
// Part 1
let total = 0;
for (let i = 0; i < pairs.length; i++) {
    console.log("Comparing");
    const res = compare(pairs[i]);
    // if result is continue, that means the left side ran out which is the same as true
    console.log("Result", res);
    console.log();
    if (res === true || res === "continue") {
        total += i + 1;
    }
}
console.log("Pair sum", total);
*/

// Part 2

const allPackets = [];
for (const line of data) {
    if (line !== '') {
        allPackets.push(eval(line)); // evil eval part 2
    }
}
// add the super special packets
allPackets.push([[2]]);
allPackets.push([[6]]);

console.log("BEFORE");
console.log(allPackets);
console.log();

// put all the packets in the correct order
allPackets.sort((a, b) => {
    const res = compare([a, b]);
    //console.log(res);
    if (res === true) {
        return -1;
    } else if (res === false) {
        return 1;
    } else {
        return 0;
    }
});

console.log("AFTER");
console.log(allPackets);
console.log();

const specialPacketLocs = [];
for (let i = 0; i < allPackets.length; i++) {
    const x = JSON.stringify(allPackets[i]);
    if (x === '[[2]]' || x === '[[6]]') {
        specialPacketLocs.push(i + 1);
    }
}

console.log(specialPacketLocs);
console.log(specialPacketLocs.reduce((a, b) => a * b));