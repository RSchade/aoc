const fs = require('fs');
const data = fs.readFileSync('19-input').toString().split('\n');
const LRUCache = require('mnemonist/lru-cache');

/*
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
*/

const robots = {};

for (const l of data) {
    const matched = l.matchAll(/Blueprint (?<blueprintNumber>[0-9]*): Each ore robot costs (?<oreOreAmt>[0-9]*) ore. Each clay robot costs (?<clayOreAmt>[0-9]*) ore. Each obsidian robot costs (?<obsOreAmt>[0-9]*) ore and (?<obsClayAmt>[0-9]*) clay. Each geode robot costs (?<geodeOreAmt>[0-9]*) ore and (?<geodeObsAmt>[0-9]*) obsidian./g);
    const { blueprintNumber, oreOreAmt, clayOreAmt, obsOreAmt, obsClayAmt, geodeOreAmt, geodeObsAmt} = matched.next().value.groups;
    robots[blueprintNumber] = {
        oreOreAmt: parseInt(oreOreAmt, 10),
        clayOreAmt: parseInt(clayOreAmt, 10),
        obsOreAmt: parseInt(obsOreAmt, 10),
        obsClayAmt: parseInt(obsClayAmt, 10),
        geodeOreAmt: parseInt(geodeOreAmt, 10),
        geodeObsAmt: parseInt(geodeObsAmt, 10)
    };
}

const totalTime = 32//24; (part 1)

let qualityTotal = 0;
let allMaxGeodes = [];

const addNextState = (blueprint, cur, newResource) => {
    const states = [];
    const corrOre = cur.ore - (newResource === 'ore' ? 1 : 0);
    const corrObs = cur.obs - (newResource === 'obs' ? 1 : 0);
    const corrClay = cur.clay - (newResource === 'clay' ? 1 : 0);
    const corrGeodes = cur.geodes - (newResource === 'geode' ? 1 : 0);
    // add a state when it's possible to at least make one other robot
    let timeUntilOre = (blueprint.oreOreAmt - corrOre) / cur.oreRobots;
    let timeUntilClay = (blueprint.clayOreAmt - corrOre) / cur.oreRobots;
    let timeUntilObs = Math.max((blueprint.obsOreAmt - corrOre) / cur.oreRobots, (blueprint.obsClayAmt - corrClay) / cur.clayRobots);
    let timeUntilGeode = Math.max((blueprint.geodeOreAmt - corrOre) / cur.oreRobots, (blueprint.geodeObsAmt - corrObs) / cur.obsRobots);
    // If each time step more than a particular resource is created than can be used then prevent more robots from being created
    if (cur.oreRobots >= blueprint.oreOreAmt && cur.oreRobots >= blueprint.clayOreAmt && cur.oreRobots >= blueprint.obsOreAmt && cur.oreRobots >= blueprint.geodeOreAmt) {
        timeUntilOre = Infinity;
    }
    if (cur.clayRobots >= blueprint.obsClayAmt) {
        timeUntilClay = Infinity;
    }
    if (cur.obsRobots >= blueprint.geodeObsAmt) {
        timeUntilObs = Infinity;
    }
    // Go through each potential new state
    for (let [nextSim, action] of [...new Set([[timeUntilOre, 'ore'], [timeUntilClay, 'clay'], [timeUntilObs, 'obs'], [timeUntilGeode, 'geode'], [totalTime - cur.time, 'nothing']])]) {
        nextSim = Math.ceil(nextSim);
        if (nextSim <= 0) {
            nextSim = 1;
        }
        if (cur.time + nextSim === totalTime && action !== 'nothing') {
            // the end action should always be nothing, since making a new robot there is useless
            continue;
        }
        if (nextSim !== Infinity && !isNaN(nextSim) && cur.time + nextSim <= totalTime) {
            states.push({
                ...cur,
                ore: corrOre + cur.oreRobots * nextSim,
                clay: corrClay + cur.clayRobots * nextSim,
                obs: corrObs + cur.obsRobots * nextSim,
                geodes: corrGeodes + cur.geodeRobots * nextSim,
                time: cur.time + nextSim,
                action,
                actions: [...cur.actions, [action, cur.time + nextSim]]
            });
        }
    }
    return states;
}

const start = Date.now();

for (const id of Object.keys(robots)) {
    console.log("Trying blueprint id", id);
    const MaxHeap = require('mnemonist/heap').MaxHeap;
    const queue = new MaxHeap((a, b) => {
        if (a.geodes + a.geodeRobots * 2 > b.geodes + b.geodeRobots * 2) {
            return 1;
        }
        if (a.geodes + a.geodeRobots * 2 < a.geodes + b.geodeRobots * 2) {
            return -1;
        }
        return 0;
    });
    const seenStates = new LRUCache(100000);
    let maxGeodes = 0;
    const blueprint = robots[id];
    queue.push({
        ore: 0,
        clay: 0,
        obs: 0,
        geodes: 0,
        oreRobots: 1,
        clayRobots: 0,
        obsRobots: 0,
        geodeRobots: 0,
        time: 0,
        action: 'nothing',
        actions: []
    });
    while (queue.size > 0) {
        let cur = queue.pop();
        const action = cur.action;
        // if there are less possible new geodes than the max, then stop going through this state
        const tLeft = totalTime - cur.time;
        const geodesIfNothing = cur.geodes * tLeft;
        let geodesIfAlwaysNew = 0;
        // if this were to be better: figure out how many geode robots that could reasonably be 
        // made instead of assuming they can be made indefinitely
        for (let i = tLeft - 1; i > 0; i--) {
            geodesIfAlwaysNew += i;
        }
        if (geodesIfAlwaysNew + geodesIfNothing + cur.geodes <= maxGeodes) {
            continue;
        }
        // add to cache
        if (seenStates.has(JSON.stringify(cur))) {
            continue;   
        }
        seenStates.set(JSON.stringify(cur), true);
        if (cur.time >= totalTime) {
            //console.log("found finish:", cur);
            let t = maxGeodes;
            maxGeodes = Math.max(maxGeodes, cur.geodes);
            if (t !== maxGeodes) {
                console.log("new max geodes", maxGeodes, (Date.now() - start) / 1000);
                //console.log(cur);
            }
            continue;
        }
        // potential spends
        if (action === 'ore') {
            // create ore robot
            const states = addNextState(blueprint, {
                ...cur,
                ore: cur.ore - blueprint.oreOreAmt,
                oreRobots: cur.oreRobots + 1
            }, 'ore').map(s => {
                return {
                    ...s
                }
            });
            for (const state of states) {
                queue.push(state);
            }
        }
        if (action === 'clay') {
            // create clay robot
            const states = addNextState(blueprint, {
                ...cur,
                ore: cur.ore - blueprint.clayOreAmt,
                clayRobots: cur.clayRobots + 1
            }, 'clay').map(s => {
                return {
                    ...s
                }
            });
            for (const state of states) {
                queue.push(state);
            }
        }
        if (action === 'obs') {
            // create obs robot
            const states = addNextState(blueprint, {
                ...cur,
                ore: cur.ore - blueprint.obsOreAmt,
                clay: cur.clay - blueprint.obsClayAmt,
                obsRobots: cur.obsRobots + 1
            }, 'obs').map(s => {
                return {
                    ...s
                }
            });
            for (const state of states) {
                queue.push(state);
            }
        }
        if (action === 'geode') {
            //console.log("making geode", cur.time)
            // create geode robot
            const states = addNextState(blueprint, {
                ...cur,
                ore: cur.ore - blueprint.geodeOreAmt,
                obs: cur.obs - blueprint.geodeObsAmt,
                geodeRobots: cur.geodeRobots + 1
            }, 'geode').map(s => {
                return {
                    ...s
                }
            });
            for (const state of states) {
                queue.push(state);
            }
        }
        if (action === 'nothing') {
            // do nothing
            const states = addNextState(blueprint, {...cur});
            for (const state of states) {
                queue.push(state);
            }
        }
    }
    console.log("Quality", parseInt(id, 10) * maxGeodes);
    qualityTotal += maxGeodes * parseInt(id, 10);
    allMaxGeodes.push(maxGeodes);
}

console.log("Quality Total:", qualityTotal);
console.log("Max Geode List:", maxGeodes);
console.log("Max Geodes Multiplied:", allMaxGeodes.reduce((a, b) => a * b));