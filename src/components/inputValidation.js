export function isEmpty (val) {
    return val.trim().length == 0;
}

export function strLen (val, min, max) {
    return ((val.trim().length < min) || (val.trim().length > max))
}

export function invalidCoord (coord, minMax) {
    return ((typeof(coord) != 'number') || coord < -minMax || coord > minMax)
}