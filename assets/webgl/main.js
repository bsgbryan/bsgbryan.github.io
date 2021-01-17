
const unitCube = new Float32Array([
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

const vertices = unitCube

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

const main = () => {
  const canvas = document.querySelector('#webgl')
  const gl     = canvas.getContext('webgl')

  if (!gl) return

  const program = createProgramFromShaders(gl)

  gl.useProgram(program)

  configurePositionBuffers(gl, program)
  configureColorBuffers(gl, program)

  resizeCanvasToDisplaySize(gl.canvas)

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)

  gl.cullFace(gl.FRONT)

  drawScene(gl, program, 0, vertices)
}

main()