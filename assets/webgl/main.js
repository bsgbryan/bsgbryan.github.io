
const vertices = new Float32Array([
  // Front
  0, 0, 0,
  0, 0, 1,
  1, 0, 1,
  0, 0, 0,
  1, 0, 1,
  1, 0, 0,
  // Right
  1, 0, 0,
  1, 0, 1,
  1, 1, 1,
  1, 0, 0,
  1, 1, 1,
  1, 1, 0,
  // Back
  1, 1, 0,
  1, 1, 1,
  0, 1, 1,
  1, 1, 0,
  0, 1, 1,
  0, 1, 0,
  // Left
  0, 1, 0,
  0, 1, 1,
  0, 0, 1,
  0, 1, 0,
  0, 0, 1,
  0, 0, 0,
  // Top
  0, 0, 1,
  0, 1, 1,
  1, 1, 1,
  0, 0, 1,
  1, 1, 1,
  1, 0, 1,
  // Bottom
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
  0, 0, 0,
  1, 1, 0,
  0, 1, 0,
])

const colors = new Uint8Array([
  // Front
  42, 42, 42,
  42, 42, 42,
  42, 42, 42,
  42, 42, 42,
  42, 42, 42,
  42, 42, 42,
  // Right
  84, 84, 84,
  84, 84, 84,
  84, 84, 84,
  84, 84, 84,
  84, 84, 84,
  84, 84, 84,
  // Back
  126, 126, 126,
  126, 126, 126,
  126, 126, 126,
  126, 126, 126,
  126, 126, 126,
  126, 126, 126,
  // Left
  168, 168, 168,
  168, 168, 168,
  168, 168, 168,
  168, 168, 168,
  168, 168, 168,
  168, 168, 168,
  // Top
  210, 210, 210,
  210, 210, 210,
  210, 210, 210,
  210, 210, 210,
  210, 210, 210,
  210, 210, 210,
  // Bottom
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
  252, 252, 252,
])

const configurePositionBuffers = (gl, program) => {
  const positionBuffer   = gl.createBuffer()
  const positionLocation = gl.getAttribLocation(program, 'a_position')

  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 3          // 3 components per iteration
  const type = gl.FLOAT   // the data is 32bit floats
  const normalize = false // don't normalize the data
  const stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0        // start at the beginning of the buffer

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(positionLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)
}

const configureColorBuffers = (gl, program) => {
  const colorBuffer = gl.createBuffer()
  const colorLocation = gl.getAttribLocation(program, 'a_color')

  const size = 3                 // 3 components per iteration
  const type = gl.UNSIGNED_BYTE  // the data is 8bit unsigned values
  const normalize = true         // normalize the data (convert from 0-255 to 0-1)
  const stride = 0               // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0               // start at the beginning of the buffer

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(colorLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset)
}

const configureMatrix = (gl, program) => {
  // lookup uniforms
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

  const translation = [-0.5, -0.5, -2]
  const rotation = [degToRad(190), degToRad(40), degToRad(320)]
  const scale = [1, 1, 1]
  const fieldOfViewRadians = degToRad(60)

  // Compute the matrix
  const aspect = gl.canvas.width / gl.canvas.height
  const zNear = 0.1
  const zFar = 100

  let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)

  matrix = m4.translate(matrix, translation[0], translation[1], translation[2])
  matrix = m4.xRotate(matrix, rotation[0])
  matrix = m4.yRotate(matrix, rotation[1])
  matrix = m4.zRotate(matrix, rotation[2])
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2])

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix)
}

const main = () => {
  const canvas = document.querySelector('#webgl')
  const gl     = canvas.getContext('webgl')

  if (!gl) return

  const program = createProgramFromShaders(gl)

  gl.useProgram(program)

  configurePositionBuffers(gl, program)
  configureColorBuffers(gl, program)
  configureMatrix(gl, program)

  resizeCanvasToDisplaySize(gl.canvas)

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)

  gl.cullFace(gl.FRONT)

  drawScene(gl, vertices)
}

const radToDeg = r => r * 180 / Math.PI
const degToRad = d => d * Math.PI / 180

main()