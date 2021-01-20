const degToRad = d => d * Math.PI / 180

const fieldOfViewRadians = degToRad(60)
const zFar               = 10

const colors = new Uint8Array([
  // Bottom
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  // Right
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  // Top
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  // Left
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  244, 244, 244,
  // Front
  248, 248, 248,
  248, 248, 248,
  248, 248, 248,
  248, 248, 248,
  248, 248, 248,
  248, 248, 248,
  // Back
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
])

let lastFrame

let instances = [ ]

const tints = {
  Grey: {
    r: 1,
    g: 1,
    b: 1,
  },
  Purple: {
    r: 0.975,
    g: 0.975,
    b: 1,
  },
  Gold: {
    r: 1,
    g: 0.999,
    b: 0.9,
  },
}
const tintNames = Object.keys(tints)

for (let i = 0; i < 50; i++) {
  const t = Math.random()

  instances.push({
    x:   Math.random() * 2     - 1,
    y:   Math.random() * 2     - 1,
    z: -(Math.random() * zFar) - 1,
    speed: Math.random() + 1 * 0.5,
    tint: t <= 0.5 ?
      tintNames[0]
      :
      t > 0.5 && t <= 0.8 ?
      tintNames[1]
      :
      tintNames[2],
  })

  instances[i].x = (instances[i].x * -instances[i].z) * fieldOfViewRadians
  instances[i].y = (instances[i].y * -instances[i].z) * fieldOfViewRadians
}

const configureColorBuffers = (
  gl,
  c,
  colorLocation,
  colorBuffer,
) => {
  const size = 3                 // 3 components per iteration
  const type = gl.UNSIGNED_BYTE  // the data is 8bit unsigned values
  const normalize = true         // normalize the data (convert from 0-255 to 0-1)
  const stride = 0               // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0               // start at the beginning of the buffer

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, c, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(colorLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset)
}

const drawScene = (
  gl,
  matrixLocation,
  projectionMatrix,
  colorLocation,
  colorBuffer,
  timestamp,
) => {
  if (lastFrame === undefined)
    lastFrame = timestamp

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  for (let i = 0; i < instances.length; i++) {
    const primitiveType = gl.TRIANGLES
    const offset        = 0
    const count         = 108 / 3 // 3 vertices/triangle
    const yOffset       = timestamp * 0.0025

    const matrix = m4.translate(
      projectionMatrix,
      instances[i].x,
      instances[i].y - (yOffset * instances[i].speed),
      instances[i].z,
    )

    const tinted = new Uint8Array(colors.length)

    for (let c = 0; c < colors.length; c += 3) {
      tinted[c    ] = colors[c] * tints[instances[i].tint].r
      tinted[c + 1] = colors[c] * tints[instances[i].tint].g
      tinted[c + 2] = colors[c] * tints[instances[i].tint].b
    }

    configureColorBuffers(gl, tinted, colorLocation, colorBuffer)

    gl.uniformMatrix4fv(matrixLocation, false, matrix)
    gl.drawArrays(primitiveType, offset, count)
  }

  lastFrame = timestamp

  requestAnimationFrame(
    ts => drawScene(
      gl,
      matrixLocation,
      projectionMatrix,
      colorLocation,
      colorBuffer,
      ts * 0.001,
    )
  )
}
