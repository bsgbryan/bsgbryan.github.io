const degToRad = d => d * Math.PI / 180

const translation = [-0.5, -0.5, -2]

const configureMatrix = (gl, program, deltaTime) => {
  const matrixLocation     = gl.getUniformLocation(program, 'u_matrix')
  const fieldOfViewRadians = degToRad(60)

  const aspect = gl.canvas.width / gl.canvas.height
  const zNear  = 0.1
  const zFar   = 100

  let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)

  translation[1] -= deltaTime * 0.01

  matrix = m4.translate(matrix, translation[0], translation[1], translation[2])

  gl.uniformMatrix4fv(matrixLocation, false, matrix)
}

let lastFrame

const drawScene = (gl, program, timestamp, vertices) => {
  if (lastFrame === undefined)
    lastFrame = timestamp

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const primitiveType = gl.TRIANGLES
  const offset        = 0
  const count         = vertices.length / 3 // 3 vertices/triangle

  configureMatrix(gl, program, timestamp - lastFrame)

  gl.drawArrays(primitiveType, offset, count)

  lastFrame = timestamp

  requestAnimationFrame(ts => drawScene(gl, program, ts * 0.001, vertices))
}
