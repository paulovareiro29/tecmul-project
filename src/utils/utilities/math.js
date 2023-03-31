export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const numberBetween = (value, min, max) => {
    if (value < min) return min
    if (value > max) return max
    return value
}