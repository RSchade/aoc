const fs = require('fs');

const inData = JSON.parse('{ "data": [' + fs.readFileSync('./input-day-18')
    .toString('utf-8').split('\n').join(',') + '] }');

const list = inData.data;

//         a
//     b            c
//   d     e    f       g
//  h  i j  k  l  m   n   o
// p q              r  s

const getClosest = (n,idx) => {
    const otherIdx = (idx + 1) % 2;
    let ptr = n.parent;
    let cameFrom = n;
    while (ptr) {
        if (ptr.children[idx] !== cameFrom) {
            const stack = [];
            stack.push(ptr.children[idx]);
            while (stack.length > 0) {
                const ptr2 = stack.pop();
                if (typeof(ptr2.value) === 'number') {
                    return ptr2;
                }
                stack.push(...[ptr2.children[idx],ptr2.children[otherIdx]]);
            }
        }
        cameFrom = ptr;
        ptr = ptr.parent;
    }
    return null;
}

const recreate = (a) => {
    if (typeof(a.value) === 'number') {
        return a.value;
    }
    return [recreate(a.children[0]), recreate(a.children[1])];
}

const reduce = (start,actionType) => {
    let stack = [[start,null]];
    let tree = null;
    while (stack.length > 0) {
        const [a,parent] = stack.pop();
        const n = {
            parent,
            children: [],
            value: null
        };
        if (!tree) {
            tree = n;
        }
        if (parent) {
            parent.children.push(n);
        }
        if (typeof(a) !== 'number') {
            stack.push([a[1],n]);
            stack.push([a[0],n]);
        } else {
            n.value = a;
        }
    }
    let needsExplode = false;
    stack = [[tree,1]];
    while (stack.length > 0) {
        const [n,d] = stack.pop();
        if (actionType === 0 && !n.value && d >= 5 && n.children.length === 2 && typeof(n.children[0].value) === 'number') {
            const lVal = n.children[1].value;
            const rVal = n.children[0].value;
            const l = getClosest(n,1);
            const r = getClosest(n,0);
            n.value = 0;
            n.children = [];
            if (l) {
                l.value += lVal;
            }
            if (r) {
                r.value += rVal;
            }
            break;
        }
        if (actionType === 1 && typeof(n.value) === 'number' && n.value > 9) {
            const v = n.value;
            n.value = null;
            n.children = [
                {parent: n, children: [], value: Math.floor(v/2)},
                {parent: n, children: [], value: Math.ceil(v/2)}
            ];
            if (d >= 4) {
                needsExplode = true;
            }
            break;
        }
        if (n.children.length === 2) {
            stack.push([n.children[1],d+1]);
            stack.push([n.children[0],d+1]);
        }
    }
    return [recreate(tree), needsExplode];
}

const rereduce = a => {
    let prev = '';
    //console.log(JSON.stringify(a));
    let [out, needsExplode] = reduce(a,0);
    let actionType = 0;
    let prevActionType = 0;
    while (true) {
        prev = JSON.stringify(out);
        [out, needsExplode] = reduce(out,actionType);
        //console.log(actionType, JSON.stringify(out));
        if (prev === JSON.stringify(out) && actionType !== prevActionType) {
            break;
        }
        if (needsExplode) {
            actionType = 0;
        } else {
            if (prev === JSON.stringify(out)) {
                prevActionType = actionType;
                actionType = (actionType + 1) % 2;
            }
        }
    }
    return out;
}

const add = (a, b) => {
    const c = [a,b];
    return rereduce(c);
}

const getMag = a => {
    if (typeof(a) === 'number') {
        return a;
    }
    return getMag(a[0]) * 3 + getMag(a[1]) * 2;
}

// Part 1
let total = list[0];

for (let i = 1; i < list.length; i++) {
    total = add(total,list[i]);
}

console.log(JSON.stringify(total));
console.log('Part 1', getMag(total));

// Part 2
let highestMag = -Infinity;
for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
        highestMag = Math.max(highestMag, getMag(add(list[i], list[j])));
        highestMag = Math.max(highestMag, getMag(add(list[j], list[i])));
    }
}

console.log('Part 2', highestMag);