// Taken from https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

const vertexShaderSource = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}`;

const fragmentShaderSource = `
precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

void main() {
   gl_FragColor = v_color;
}`;

const compileShader = (gl, shaderSource, shaderType) => {
  const shader = gl.createShader(shaderType)

  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw(`could not compile shader: ${gl.getShaderInfoLog(shader)}`)
 
  return shader
}

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram()

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw(`program failed to link: ${gl.getProgramInfoLog(program)}`)

  return program
}

const createProgramFromShaders = gl => {
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)

  return createProgram(gl, vertexShader, fragmentShader)
}

const resizeCanvasToDisplaySize = canvas => {
  const displayWidth  = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  const needResize =
    canvas.width  !== displayWidth ||
    canvas.height !== displayHeight

  if (needResize) {
    canvas.width  = displayWidth
    canvas.height = displayHeight
  }

  return needResize
}