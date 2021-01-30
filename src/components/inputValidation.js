export function isEmpty (val) {
    return val.trim().length == 0;
}

export function invalidCoord (coord, minMax) {
    return ((typeof(coord) != 'number') || coord < -minMax || coord > minMax)
}