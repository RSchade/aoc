const fs = require('fs');
const data = fs.readFileSync('15-input')
    .toString()
    .split('\n')
    .map(l => l.trim());

const sensors = [];
const beacons = [];
const dists = [];

const manhattanDist = (a, b) => Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);

for (const l of data) {
    const splitLine = l.split(':');
    const sx = parseInt(splitLine[0].split(', ')[0].replace(/[^\d.-]/g,''), 10);
    const sy = parseInt(splitLine[0].split(', ')[1].replace(/[^\d.-]/g,''), 10);
    const bx = parseInt(splitLine[1].split(', ')[0].replace(/[^\d.-]/g,''), 10);
    const by = parseInt(splitLine[1].split(', ')[1].replace(/[^\d.-]/g,''), 10);
    sensors.push([sx, sy]);
    beacons.push([bx, by]);
    dists.push(manhattanDist([sx, sy], [bx, by]));
}

// Part 1
const checkLine = 10;
const positions = new Set();

// sensor, beacon and dist idxs are all aligned

// for the given check line we know that the given cell needs to be within the
// manhattan distance in the dist array to be in range of that sensor
// so for every sensor check if it's in range of somewhere on the check line, then the distress can't be there
for (let i = 0; i < sensors.length; i++) {
    const sensorPos = sensors[i];
    const dist = dists[i];
    const toLine = Math.abs(sensorPos[1] - checkLine);
    // toLine is the distance to the check line
    const slack = dist - toLine;
    // slack is the amount left to move in the X direction after travelling in the Y
    for (let j = 0; j <= slack; j++) {
        positions.add(sensorPos[0] + j); // travel to the right
        positions.add(sensorPos[0] - j); // travel to the left
    }
}

// remove 'duplicate beacons'
for (const b of beacons) {
    if (b[1] === checkLine) {
        positions.delete(b[0]);
    }
}

console.log("Beacon cannot be present:", positions.size);

const merge = intervals => {
    if (intervals.length < 2) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [];
    let previous = intervals[0];
    
    for (let i = 1; i < intervals.length; i += 1) {
      if (previous[1] >= intervals[i][0] - 1) {
        previous = [previous[0], Math.max(previous[1], intervals[i][1])];
      } else {
        result.push(previous);
        previous = intervals[i];
      }
    }
    
    result.push(previous);
    
    return result;
  };


// Part 2
const multiplier = 4000000;
const maxCoord = 4000000;

const ranges = Array();
for (let i = 0; i <= maxCoord; i++) {
    ranges.push([]);
}

const findDistressBeacon = () => {
    for (const s of sensors) {
        if (s[1] <= maxCoord && s[1] >= 0 && s[0] >= 0 && s[0] <= maxCoord) {
            ranges[s[1]].push([s[0], s[0]]);
        }
    }
    for (let checkLine = 0; checkLine <= maxCoord; checkLine++) {
        if (checkLine % 100000 === 0) {
            console.log(checkLine);
        }
        const range = [...ranges[checkLine]];
        for (let i = 0; i < sensors.length; i++) {
            const sensorPos = sensors[i];
            const dist = dists[i];
            const toLine = Math.abs(sensorPos[1] - checkLine);
            // toLine is the distance to the check line
            const slack = dist - toLine;
            if (slack >= 0) {
                // slack is the amount left to move in the X direction after travelling in the Y
                const xs = [sensorPos[0] - slack, sensorPos[0] + slack];
                const minX = Math.max(Math.min(...xs), 0);
                const maxX = Math.min(Math.max(...xs), maxCoord);
                // combine ranges
                range.push([minX, maxX]);
                // combine existing ranges together
                ranges[checkLine] = merge(range);
            }
        }
    }
    console.log(ranges);
    for (let i = 0; i < ranges.length; i++) {
        ranges[i] = merge(ranges[i]);
        if (ranges[i].length > 1) {
            return [ranges[i][0][1] + 1, i];
        }
    }
}

const distressCoord = findDistressBeacon();

console.log(distressCoord);
console.log("Tuning frequency:", multiplier * distressCoord[0] + distressCoord[1]);