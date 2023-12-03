// keeps angle between 0 and 2 * PI
export function boundAngle(angle) {
    if (angle >= Math.PI * 2) {
        return angle - Math.PI * 2
    }

    if (angle < 0) {
        return Math.PI * 2 + angle
    }

    return angle
}