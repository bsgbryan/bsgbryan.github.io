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
  r: 109,
  g: 111,
  b: 111,
  a: 0.2,
  against: {
    r: 41,
    g: 43,
    b: 44
  }
})

console.log('merged', { red, green, blue })