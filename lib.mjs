export function inner(value) {
  if (value < 0) {
    return -value
  }
  return value * 2
}

export function outer(value) {
  if (value > 100) {
    return inner(value) + 2
  }
  return inner(value) + 1
}
