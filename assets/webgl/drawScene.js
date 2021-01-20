const degToRad = d => d * Math.PI / 180

const fieldOfViewRadians = degToRad(60)
const zFar               = 10

let lastFrame

let instances = [ ]

for (let i = 0; i < 50; i++) {
  instances.push({
    x:   Math.random() * 2     - 1,
    y:   Math.random() * 2     - 1,
    z: -(Math.random() * zFar) - 1,
  })

  instances[i].x = (instances[i].x * -instances[i].z) * fieldOfViewRadians
  instances[i].y = (instances[i].y * -instances[i].z) * fieldOfViewRadians
}

const drawScene = (
  gl,
  matrixLocation,
  projectionMatrix,
  timestamp
) => {
  if (lastFrame === undefined)
    lastFrame = timestamp

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  for (let i = 0; i < instances.length; i++) {
    const primitiveType = gl.TRIANGLES
    const offset        = 0
    const count         = 108 / 3 // 3 vertices/triangle
    const yOffset       = timestamp * 0.00125

    const matrix = m4.translate(
      projectionMatrix,
      instances[i].x,
      instances[i].y - yOffset,
      instances[i].z
    )

    gl.uniformMatrix4fv(matrixLocation, false, matrix)
    gl.drawArrays(primitiveType, offset, count)
  }

  lastFrame = timestamp

  requestAnimationFrame(
    ts => drawScene(
      gl,
      matrixLocation,
      projectionMatrix,
      ts * 0.001,
    )
  )
}
