
export function percent (max: number, value: number) {
  return (100 * value) / max
}

export function ratio (max: number, value: number) {
  const r = value / max
  console.log(1 - r)
  return r
}
