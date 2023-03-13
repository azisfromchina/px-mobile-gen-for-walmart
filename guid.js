const parse = (pattern, raw) => {
    if (!pattern.test(raw)) {
        throw new Error("wrong format");
    }
    pattern.test(raw)
    return pattern.exec(raw).slice(1,6)
}

const swap = (array) => {
    let arrayLocal = Object.assign([], array);
    arrayLocal[0] = Buffer.from(arrayLocal[0], 'hex').swap32().toString('hex');
    arrayLocal[1] = Buffer.from(arrayLocal[1], 'hex').swap16().toString('hex');
    arrayLocal[2] = Buffer.from(arrayLocal[2], 'hex').swap16().toString('hex');
    return arrayLocal
}

const transform = (pattern, raw) => {
    return swap(parse(pattern, raw))
}

const convertRaw = (raw) => {
    const pattern = /([0-9A-Fa-f]{8})([0-9A-Fa-f]{4})([0-9A-Fa-f]{4})([0-9A-Fa-f]{4})([0-9A-Fa-f]{12})/i
    let guid = transform(pattern, raw);
    return guid.join("-").toLowerCase()
}


module.exports = convertRaw