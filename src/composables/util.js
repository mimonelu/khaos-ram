export const irandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const pick = array => array[Math.floor(Math.random() * array.length)]

export const wait = duration => new Promise(resolve => setTimeout(resolve, duration))
