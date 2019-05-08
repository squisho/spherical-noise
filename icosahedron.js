X = 0.525731112119133606
Z = 0.850650808352039932

class Icosahedron {
  vertexList = []
  particles = []

  vData = [
    [-X, 0, Z], [X, 0, Z], [-X, 0, -Z],
    [X, 0, -Z], [0, Z, X], [0, Z, -X],
    [0, -Z, X], [0, -Z, -X], [Z, X, 0],
    [-Z, X, 0], [Z, -X, 0], [-Z, -X, 0]
  ]

  tIndices = [
    [0, 4, 1], [0, 9, 4], [9, 5, 4], [4, 5, 8],
    [4, 8, 1], [8, 10, 1], [8, 3, 10], [5, 3, 8],
    [5, 2, 3], [2, 7, 3], [7, 10, 3], [7, 6, 10],
    [7, 11, 6], [11, 0, 6], [ 0, 1, 6], [ 6, 1, 10],
    [ 9, 0, 11], [ 9, 11, 2], [ 9, 2, 5], [ 7, 2, 11 ]
  ]

  constructor(subdivision) {
    // Iterate over points for (let i = 0; i < 20; i++) {
    for (let i = 0; i < 20; i++) {
      this.subdivide(
        this.vData[this.tIndices[i][0]],
        this.vData[this.tIndices[i][1]],
        this.vData[this.tIndices[i][2]],
        subdivision
      )
    }

    for (let e = 0; e < this.vertexList.length; e += 3) {
      let y = 1, z = 2
      const p = createVector(
        this.vertexList[e] * 200,
        this.vertexList[e + y] * 200,
        this.vertexList[e + z] * 200
      )
      this.particles.push(p)
    }
  }

  norm = v => {
    let len = 0
    for (let i = 0; i < 3; i++)
      len += (v[i] * v[i])

    len = sqrt(len)
    for (let i = 0; i < 3; i++)
      v[i] /= len
  }

  add = v => {
    for (let i = 0; i < 3; i++)
      this.vertexList.push(v[i])
  }

  // recursive function to construct shape
  subdivide = (v1, v2, v3, depth) => {
    if (depth === 0) {
      [v1, v2, v3].forEach(v => this.add(v))
      return
    }

    let v12 = [0, 0, 0], v23 = [0, 0, 0], v31 = [0, 0, 0]

    for (let i = 0; i < 3; i++) {
      v12[i] = (v1[i] + v2[i]) / 2
      v23[i] = (v2[i] + v3[i]) / 2
      v31[i] = (v3[i] + v1[i]) / 2
    }

    this.norm(v12)
    this.norm(v23)
    this.norm(v31)

    this.subdivide(v1, v12, v31, depth - 1)
    this.subdivide(v2, v23, v12, depth - 1)
    this.subdivide(v3, v31, v23, depth - 1)
    this.subdivide(v12, v23, v31, depth - 1)
  }

  terrain = (offset, maxHeight=120) => {
    const f = n => n * 2 + offset

    this.particles.forEach(particle => {
      const p = particle.normalize()
      const r = map(noise(f(p.x), f(p.y), f(p.z)), 0, 1, 10, maxHeight)
      p.div(r * 0.0001)
    })
  }
}
