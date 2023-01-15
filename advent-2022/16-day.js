const fs = require('fs');
const data = fs.readFileSync('16-input')
    .toString()
    .split('\n')
    .map(l => l.trim());
const MaxHeap = require('mnemonist/heap').MaxHeap;
var LRUCache = require('mnemonist/lru-cache');

const tunnels = {};

for (const l of data) {
    const lOut = l.matchAll(/Valve (?<valve>[A-Z]+) has flow rate=(?<rate>[0-9]+); tunnels? leads? to valves? (?<valvesTo>(([A-Z]+,?\s?))*)/g);
    let {valve, rate, valvesTo} = lOut.next().value.groups;
    const valvesToList = valvesTo.split(',').map(x => x.trim());
    tunnels[valve] = {
        rate: parseInt(rate, 10),
        valvesTo: valvesToList,
        closed: false,
        position: valve
    }
}

//console.log(tunnels);

const distMap = {};

const dist = (a, b) => {
    if (distMap[a+','+b]) {
        return distMap[a+','+b];
    }
    const queue = [[a, 0]];
    const visited = {};
    while (queue.length > 0) {
        const [cur, dist] = queue.pop();
        visited[cur] = true;
        if (cur === b) {
            distMap[a+','+b] = dist;
            return dist;
        }
        for (const valve of tunnels[cur].valvesTo) {
            if (!visited[valve]) {
                queue.unshift([valve, dist + 1]);
            }
        }
    }
    console.log("unconnected tunnels?");
    return -1;
}

const totalTime = 26; // 30; Part 1

const pQueue = new MaxHeap((a, b) => {
    if (a.score > b.score) {
        return 1;
    }
    if (a.score < b.score) {
        return -1;
    }
    return 0;
});

pQueue.push({
    curPosition: 'AA',
    score: 0,
    //time: totalTime,
    tunnels: JSON.parse(JSON.stringify(tunnels)),
    // Part 2
    elephantPos: 'AA',
    elephantTime: totalTime,
    personTime: totalTime
});

let maxPressure = 0; 

const start = Date.now();

const seenStates = new LRUCache(100000);

while (pQueue.size > 0) {
    const curState = pQueue.pop();
    let totalPossiblePressure = curState.score;
    for (const t of Object.values(curState.tunnels)) {
        if (!t.closed) {
            const maxTime = Math.max(curState.elephantTime, curState.personTime);
            const minDist = Math.min(dist(curState.elephantPos, t.position), dist(curState.curPosition, t.position));
            const maxTimeAtLoc = maxTime - minDist - 1;
            if (maxTimeAtLoc > 0) {
                totalPossiblePressure += t.rate * maxTimeAtLoc;
            }
        }
    }
    if (totalPossiblePressure < maxPressure) {
        // if we can't possibly get up to the total pressure, stop
        continue;
    }
    //if (curState.time === 0) { 
    if (curState.personTime === 0 && curState.elephantTime === 0) {
        // end for this run of the game
        const prev = maxPressure;
        maxPressure = Math.max(maxPressure, curState.score);
        if (maxPressure > prev) {
            console.log(maxPressure + " " + (Date.now() - start) / 1000 + " " + pQueue.size);
        }
        continue;
    }
    // Part 1
    //let foundNextMove = false;
    let anyNewMoves = false;
    for (const entity of ['person', 'elephant']) {
        for (const t of Object.values(curState.tunnels)) {
            if (!t.closed && t.rate > 0) { // must not already be closed and must be a > 0 rate
                // possible next target
                const d = dist(entity === 'person' ? curState.curPosition : curState.elephantPos, t.position);
                //const newTime = curState.time - d - 1;
                const newTime = entity === 'person' ? (curState.personTime - d - 1) : (curState.elephantTime - d - 1);
                if (newTime > 0) { // needs to have at least 1 second left to open the gate when done
                    const newScore = curState.score + (newTime * t.rate);
                    const newTunnels = JSON.parse(JSON.stringify(curState.tunnels));
                    newTunnels[t.position].closed = true;
                    if (entity === 'person') {
                        const newState = {
                            ...curState,
                            curPosition: t.position,
                            score: newScore,
                            personTime: newTime,
                            tunnels: newTunnels
                        }
                        if (seenStates.has(JSON.stringify(newState))) {
                            continue;   
                        }
                        seenStates.set(JSON.stringify(newState), true);
                        pQueue.push(newState);
                        anyNewMoves = true;
                    } else {
                        const newState = {
                            ...curState,
                            elephantPos: t.position,
                            score: newScore,
                            elephantTime: newTime,
                            tunnels: newTunnels
                        }
                        if (seenStates.has(JSON.stringify(newState))) {
                            continue;   
                        }
                        seenStates.set(JSON.stringify(newState), true);
                        pQueue.push(newState);
                        anyNewMoves = true;
                    }
                    // Part 1
                    /*
                    pQueue.push({
                        curPosition: t.position,
                        score: newScore,
                        time: newTime,
                        tunnels: newTunnels
                    });
                    foundNextMove = true;
                    */
                }
            }
        }
    }
    // Part 1
    /*if (!foundNextMove) {
        // add a terminal node
        pQueue.push({
            ...curState,
            time: curState.time - 1
        });
    }*/
    if (!anyNewMoves) {
        pQueue.push({ // set both clocks to 0 so the game ends for them
            ...curState,
            personTime: 0,
            elephantTime: 0
        });
    }
}

console.log("MAX PRESSURE", maxPressure);