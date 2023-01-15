const fs = require('fs');
const data = fs.readFileSync('11-input').toString().split('\n');

const monkeys = [];
let newMonkey = null;
for (const line of data) {
    const splitLine = line.split(":");
    if (line.indexOf("Monkey") !== -1) {
        newMonkey = {};
        monkeys.push(newMonkey);
    } else if (line.indexOf("Starting items") !== -1) {
        newMonkey.items = splitLine[1].split(",").map(a => parseInt(a,10));
    } else if (line.indexOf("Operation") !== -1) {
        newMonkey.operation = splitLine[1].trim();
    } else if (line.indexOf("Test") !== -1) {
        newMonkey.test = parseInt(splitLine[1].trim().split("by")[1], 10); // divisible by tests
    } else if (line.indexOf("If true") !== -1) {
        newMonkey.true = parseInt(splitLine[1].split("monkey")[1],10);
    } else if (line.indexOf("If false") !== -1) {
        newMonkey.false = parseInt(splitLine[1].split("monkey")[1],10);
    }
    newMonkey.inspects = 0;
}

// Part 1
/*


console.log("START:")
console.log(monkeys);
console.log();

const maxRounds = 20;

for (let round = 0; round < maxRounds; round++) {
    for (const monkey of monkeys) {
        while (monkey.items.length > 0) {
            monkey.inspects++; // count inspections
            let w = monkey.items.shift();
            // operations
            const splitOp = monkey.operation.split("=")[1];
            const op = splitOp.replaceAll("old", w);
            w = eval(op); // this is hilariously bad but it's monkeys so we good
            // divide worry levels by 3
            w = Math.floor(w / 3);
            // test
            if (w % monkey.test === 0) {
                monkeys[monkey.true].items.push(w);
            } else {
                monkeys[monkey.false].items.push(w);
            }
        }
    }
    //console.log("ROUND", round + 1);
    //console.log(monkeys);
    //console.log();
}
*/

// Part 2
const maxRounds = 10000;

// convert all of the items arrays into modulo arrays
for (const monkey of monkeys) {
    for (let i = 0; i < monkey.items.length; i++) {
        const w = monkey.items[i];
        monkey.items[i] = Array(monkeys.length);
        for (let j = 0; j < monkeys.length; j++) {
            monkey.items[i][j] = w % monkeys[j].test;
        }
    }
}

for (let round = 0; round < maxRounds; round++) {
    let monkeyNum = 0;
    for (const monkey of monkeys) {
        while (monkey.items.length > 0) {
            monkey.inspects++; // count inspections
            let w = monkey.items.shift();
            // operations
            const splitOp = monkey.operation.split("=")[1];
            if (splitOp.indexOf("*") !== -1) {
                // multiply
                const sides = splitOp.split("*").map(x => x.trim());
                for (let i = 0; i < w.length; i++) {
                    const l = sides[0] === "old" ? w[i] : parseInt(sides[0], 10);
                    const r = sides[1] === "old" ? w[i] : parseInt(sides[1], 10);
                    w[i] = ((l % monkeys[i].test) * (r % monkeys[i].test)) % monkeys[i].test;
                }
            } else {
                // add
                const sides = splitOp.split("+").map(x => x.trim());
                for (let i = 0; i < w.length; i++) {
                    const l = sides[0] === "old" ? w[i] : parseInt(sides[0], 10);
                    const r = sides[1] === "old" ? w[i] : parseInt(sides[1], 10);
                    w[i] = (l + r) % monkeys[i].test;
                }
            }
            // test
            if (w[monkeyNum] === 0) {
                monkeys[monkey.true].items.push(w);
            } else {
                monkeys[monkey.false].items.push(w);
            }
        }
        monkeyNum++;
    }
    //console.log("ROUND", round + 1);
    //console.log(monkeys);
    //console.log();
}

console.log(monkeys);

// 2 most active monkeys inspect numbers multiplied 'monkey business'
const mostActive = monkeys.map(m => m.inspects).sort((a, b) => b - a);
console.log(mostActive);
console.log("monkey business", mostActive[0] * mostActive[1]);