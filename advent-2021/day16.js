const fs = require('fs');

const inData = fs.readFileSync('./input-day-16')
    .toString('utf-8')
    .split('')
    .map(a => parseInt(a,16).toString(2).padStart(4,0).split(''))
    .flat();

let verSum = 0;
let offset = 0;
let curLeft = null;
let leftStack = [];
let out = [];
while (offset < inData.length) {
    const curPkt = inData.slice(offset);
    if (parseInt(curPkt.join(''),10) === 0) {
        break;
    }
    const ver = parseInt(curPkt.slice(0,3).join(''),2);
    const typ = parseInt(curPkt.slice(3,6).join(''),2);
    verSum += ver;
    console.log('left', curLeft);
    console.log(offset, ver, typ);

    if (typ === 4) {
        let ptr = 6;
        let outVal = '';
        while (true) {
            const a = curPkt[ptr];
            outVal += curPkt.slice(ptr + 1, ptr + 5).join('');
            if (a === '1') {
                ptr += 5;
            } else {
                break;
            }
        }
        let len = 5 + ptr;
        out.push(parseInt(outVal,2));
        //len += len % 4;
        console.log('len', len);
        if (curLeft) {
            if (curLeft.type === 'bits') {
                offset += len;
                curLeft.val -= len;
                console.log('lenleft', curLeft.val);
            } else if (curLeft.type === 'pkts') {
                offset += len;
                curLeft.val -= 1;
            }
        } else {
            console.log('no left');
            return;
        }
    } else {
        const lenTyp = parseInt(curPkt.slice(6,7),2);
        if (curLeft) {
            curLeft.oldOffset = offset;
        }
        leftStack.push(curLeft);
        if (lenTyp === 0) {
            const subBits = parseInt(curPkt.slice(8,22).join(''),2);
            console.log('bits', subBits);
            offset += 22;
            curLeft = {type: 'bits', val: subBits};
        } else {
            const subPkts = parseInt(curPkt.slice(8,18).join(''),2);
            console.log('subPkts', subPkts);
            offset += 18;
            curLeft = {type: 'pkts', val: subPkts};
        }
        //out.push('(');
        out.push({
            0: '+',
            1: '*',
            2: 'min',
            3: 'max',
            5: '>',
            6: '<',
            7: '='
        }[typ]);
    }
    while (!curLeft || curLeft.val <= 0) {
        curLeft = leftStack.pop();
        console.log(curLeft);
        if (!curLeft) {
            //return;
            out.push(')');
            break;
        }
        if (curLeft.oldOffset && curLeft.type === 'bits') {
            curLeft.val -= offset - curLeft.oldOffset;
        } else if (curLeft.type === 'pkts') {
            curLeft.val -= 1;
        }
        console.log('left', curLeft.val);
        if (curLeft.val < 0) {
            return;
        }
        out.push(')');
    }
    console.log();
}
if (leftStack.length > 0) {
    out.push(...')'.repeat(leftStack.length));
}
console.log(leftStack);
console.log('Part 1:', verSum);

console.log(out);

const multiOp = (op, out) => {
    let agg = parse(out);
    let next = agg;
    while (next !== ')' && out.length > 0) {
        next = parse(out);
        if (next === ')') {
            break;
        }
        agg = op(agg, next);
    }
    return agg;
}

const parse = out => {
    let cur = out.shift();
    console.log(cur);
    if (cur === '+') {
        return multiOp((a, b) => a + b, out);
    } else if (cur === '*') {
        return multiOp((a, b) => a * b, out);
    } else if (cur === 'min') {
        return multiOp((a, b) => Math.min(a, b), out);
    } else if (cur === 'max') {
        return multiOp((a, b) => Math.max(a, b), out);
    } else if (cur === '>') {
        const o = (parse(out) > parse(out)) ? 1 : 0;
        if (out[0] === ')') {
            out.shift();
        }
        return o;
    } else if (cur === '<') {
        const o = (parse(out) < parse(out)) ? 1 : 0;
        if (out[0] === ')') {
            out.shift();
        }
        return o;
    } else if (cur === '=') {
        const o = (parse(out) === parse(out)) ? 1 : 0;
        if (out[0] === ')') {
            out.shift();
        }
        return o;
    } else {
        return cur;
    }
}
console.log(out.join(' '));
console.log('Part 2', parse(out));
