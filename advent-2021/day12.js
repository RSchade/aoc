const fs = require('fs');

const inData = fs.readFileSync('./input-day-12')
    .toString('utf-8')
    .split('\n')
    .map(a => a.split('-'));
const graph = {};
for (const r of inData) {
    if (!graph[r[0]]) {
        graph[r[0]] = [];
    }
    if (!graph[r[1]]) {
        graph[r[1]] = [];
    }
    if (r[1] !== 'start') {
        graph[r[0]].push(r[1]);
    }
    if (r[0] !== 'start') {
        graph[r[1]].push(r[0]);
    }
}
delete graph['end'];
console.log(graph);

// Part 1
(() => {
    const visited = {};
    let pathCount = 0;
    const counter = (src, dst) => {
        if (src.toLowerCase() === src) {
            visited[src] = true;
        }
        if (src === dst) {
            pathCount += 1;
        } else if (graph[src]) {
            for (const adj of graph[src]) {
                if (!visited[adj]) {
                    counter(adj, dst);
                }
            }
        }
        visited[src] = false;
    }

    counter('start', 'end');

    console.log('Part 1', pathCount);
})();

// Part 2
(() => {
    let allSyms = [];
    for (const r of inData) {
        allSyms.push(r[0]);
        allSyms.push(r[1]);
    }
    allSyms = [...new Set(allSyms)];
    let paths = [];
    for (const doub of allSyms) {
        if (doub === 'start' || doub === 'end' || doub.toLowerCase() !== doub) {
            continue;
        }
        const visited = {};
        //console.log(doub);
        for (const s of allSyms) {
            visited[s] = 0;
        }
        const counter = (doub, src, dst, prevPath) => {
            visited[src] += 1;
            if (src === dst) {
                paths.push(prevPath.map(a => a));
            } else if (graph[src]) {
                for (const adj of graph[src]) {
                    if ((doub === adj && visited[adj] <= 1) ||
                        visited[adj] === 0 ||
                        adj.toLowerCase() !== adj) {
                        counter(doub, adj, dst, prevPath.concat([adj]));
                    }
                }
            }
            if (visited[src] > 0) {
                visited[src] -= 1;
            }
        }
        counter(doub, 'start', 'end', ['start']);
    }
    console.log('Part 2', [...new Set(paths.map(a => a.join('')).flat())].length);
})();