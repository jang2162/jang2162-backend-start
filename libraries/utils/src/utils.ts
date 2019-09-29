function _range(startOrEnd: number, end?: number, step?: number) {
    let start = 0;
    if (end === undefined) {
        [start, end, step] = [0, startOrEnd, startOrEnd > 0 ? 1 : -1];
    } else {
        start = startOrEnd;
    }

    if (step === undefined) {
        step = start < end ? 1 : -1;
    }
    return {_start: start, _end: end, _step: step};
}

export const range = (startOrEnd: number, end?: number, step?: number) => {
    const {_start, _end, _step} = _range(startOrEnd, end, step);
    const res = [];
    const len = Math.abs(Math.ceil(_end - _start / _step));
    for (let i=0; i<len; i++) {
        res.push(_start + i * _step)
    }
    return res;
};

export const rangeIter = (startOrEnd: number, end?: number, step?: number) => {
    const {_start, _end, _step} = _range(startOrEnd, end, step);
    const len = Math.abs(Math.ceil(_end - _start / _step));

    return {
        *[Symbol.iterator]() {
            for (let i=0; i<len; i++) {
                yield _start + i * _step;
            }
        }
    }
};

export const isEmpty = (obj: any) => Object.entries(obj).length === 0 && obj.constructor === Object;

