export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const numberBetween = (value, min, max) => {
    if (value < min) return min
    if (value > max) return max
    return value
}

export const limitAngle = (angle) => {
    if (angle > -0.1) {
        return angle < 1 ? -0.1 : -3.04
    }

    if (angle < -3.04) {
        return -3.04
    }

    return angle
}