const fs = require('fs');
const glMatrix = require('gl-matrix');
const _ = require('lodash');
const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const inData = fs.readFileSync('./input-day-19')
    .toString('utf-8').split('\n');

const angles = [0, 0.5 * Math.PI, Math.PI, (3/2) * Math.PI];

const rots = [
    angles.map(r => mat4.fromXRotation(mat4.create(), r)),
    angles.map(r => mat4.fromYRotation(mat4.create(), r)),
    angles.map(r => mat4.fromZRotation(mat4.create(), r))
].flat();

const getAllRots = vList => {
    const out = [];
    for (let i = 0; i < rots.length; i++) {
        let curRotOut = [];
        for (let j = 0; j < vList.length; j++) {
            const v = vList[j];
            curRotOut.push([...vec3.transformMat4(vec3.create(),v,rots[i]).map(Math.round)]);
        }
        out.push(curRotOut);
    }
    return out;
}

const isAligned = (v1, v2, offset1, offset2) => {
    let found = 0;
    for (let j = 0; j < v1.length; j++) {
        for (let k = 0; k < v2.length; k++) {
            if (Math.round((v1[j][0]-offset1[0])-(v2[k][0]-offset2[0])) === 0 && 
                Math.round((v1[j][1]-offset1[1])-(v2[k][1]-offset2[1])) === 0 && 
                Math.round((v1[j][2]-offset1[2])-(v2[k][2]-offset2[2])) === 0) {
                found += 1;
                if (found >= 12) {
                    return [offset1, offset2];
                }
            }
        }
    }
    return false;
}

const alignAndCheck = (v1, v2) => {
    for (let i = 0; i < v1.length; i++) {
        for (let j = 0; j < v2.length; j++) {
            const out = isAligned(v1, v2, v1[i], v2[j]);
            if (out) {
                return out;
            }
        }
    }
    return false;
}

const checkSimilarity = (s1, s2) => {
    for (let i = 0; i < s1.length; i++) {
        for (let j = 0; j < s2.length; j++) {
            const v1 = s1[i];
            const v2 = s2[j];
            const out = alignAndCheck(v1,v2);
            if (out) {
                return [v1,v2, out[0], out[1], i, j];
            }
        }
    }
    return false;
}

const scanners = {};
let curScanner = null;
for (let i = 0; i < inData.length; i++) {
    const line = inData[i];
    if (line === '') {
        continue;
    }
    if (line.indexOf('scanner') !== -1) {
        curScanner = [];
        scanners[line.split(' ').filter(a => {
            const out = parseInt(a,10);
            return typeof(out) === 'number' && !isNaN(out);
        })[0]] = curScanner;
    } else {
        curScanner.push(line.split(',').map(a => parseInt(a,10)));
    }
}

const genRots = () => {
    for (const k of Object.keys(scanners)) {
        scanners[k] = getAllRots(scanners[k]);
    }
}

const offsetBeacons = (b, obj, offset) => {
    for (const a of b) {
        const c = [a[0]+offset[0],a[1]+offset[1],a[2]+offset[2]];
        if (!obj[c]) {
            obj[c] = 0;
        }
        obj[c] += 1;
    }
}

const foundScanners = {}
const blobMapping = {};

const merge = () => {
    for (const k of Object.keys(scanners)) {
        for (const k2 of Object.keys(scanners)) {
            if (k === k2 || !scanners[k] || !scanners[k2]) {
                continue;
            }
            if (blobMapping[k2]) {
                break;   
            }
            console.log(k, k2);
            const out = checkSimilarity(scanners[k],scanners[k2]);
            if (out) {
                console.log('found', k, k2);
                const newBeacons = {};
                let absScan = [out[2][0]-out[3][0],out[2][1]-out[3][1],out[2][2]-out[3][2]];
                offsetBeacons(out[0], newBeacons, [0,0,0]);
                offsetBeacons(out[1], newBeacons, absScan);
                const r1 = rots[out[4]];
                const r2 = rots[out[5]];
                if (blobMapping[k]) {
                    for (const bk of blobMapping[k]) {
                        if (foundScanners[bk]) {
                            foundScanners[bk] = [...vec3.transformMat4(vec3.create(),foundScanners[bk],r1).map(Math.round)];
                        }
                    }
                }
                if (blobMapping[k2]) {
                    for (const bk of blobMapping[k2]) {
                        if (foundScanners[bk]) {
                            foundScanners[bk] = [...vec3.transformMat4(vec3.create(),foundScanners[bk],r2).map(Math.round)];
                        }
                    }
                }
                if (blobMapping[k2]) {
                    foundScanners[k] = absScan;
                    blobMapping[k2].push(k);
                    
                } else if (!blobMapping[k]) {
                    blobMapping[k] = [k, k2];
                    foundScanners[k2] = absScan;
                    
                } else {
                    blobMapping[k].push(k2);
                    foundScanners[k2] = absScan;
                    foundScanners[k] = [0,0,0];
                }
                console.log(Object.values(newBeacons).filter(a => a > 1).length);
                scanners[k] = getAllRots(...[Object.keys(newBeacons).map(a => a.split(',').map(a => parseInt(a,10)))]);
                delete scanners[k2];
            }
        }
    }
}
genRots();
while (true) {
    merge();
    console.log();
    if (Object.keys(scanners).length !== 1) {
        console.log(scanners);
        console.log(Object.keys(scanners).length);
        console.log('failed');
    } else {
        console.log('Part 1:', Object.values(scanners)[0][0].length);
        break;
    }
}

console.log(blobMapping);
console.log(foundScanners);

const scannerVals = Object.values(foundScanners);

let maxMDist = -Infinity;
for (const s1 of scannerVals) {
    for (const s2 of scannerVals) {
        const mDist = Math.abs(s1[0] - s2[0]) + Math.abs(s1[1] - s2[1]) + Math.abs(s1[2] - s2[2]);
        maxMDist = Math.max(mDist, maxMDist);
    }
}

console.log('Part 2', maxMDist);