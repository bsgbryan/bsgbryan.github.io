const merge = ({ r, g, b, a, against }) => {
  const rDelta = r * a
  const gDelta = g * a
  const bDelta = b * a

  const againtRDelta = against.r * (1 - a)
  const againtGDelta = against.g * (1 - a)
  const againtBDelta = against.b * (1 - a)

  const mergedR = rDelta + againtRDelta
  const mergedG = gDelta + againtGDelta
  const mergedB = bDelta + againtBDelta

  return [mergedR, mergedG, mergedB]
}

const [red, green, blue] = merge({
  r: 112,
  g: 101,
  b: 127,
  a: 0.0125,
  against: {
    r: 255,
    g: 255,
    b: 255
  }
})

console.log('merged', { red, green, blue })