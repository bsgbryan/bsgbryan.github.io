const drawScene = (gl, vertices) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const primitiveType = gl.TRIANGLES
  const offset        = 0
  const count         = vertices.length / 3 // 3 vertices/triangle

  gl.drawArrays(primitiveType, offset, count)
}
