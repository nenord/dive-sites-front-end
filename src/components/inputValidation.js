export function isEmpty (val) {
    return val.trim().length == 0;
}

export function strLen (val, min, max) {
    return ((val.trim().length < min) || (val.trim().length > max))
}

export function invalidCoord (coord, minMax) {
    return ((typeof(coord) != 'number') || coord < -minMax || coord > minMax)
}

export function invalidDepth (depth) {
    return ((typeof(depth) != 'number') || depth < 1 || depth > 200)
}

export function lenForPark (val, min, max) {
    if (val.trim().length == 0 ) {
        return false
    }
    return ((val.trim().length < min) || (val.trim().length > max))
}