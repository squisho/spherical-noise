let ICOSUBDIVISION = 0
let m = 0.4
let r = 0
let f = null
let particles = [], vertexList = []

const X = 0.525731112119133606
const Z = 0.850650808352039932

const vData = [
  [-X, 0, Z], [X, 0, Z], [-X, 0, -Z],
  [X, 0, -Z], [0, Z, X], [0, Z, -X],
  [0, -Z, X], [0, -Z, -X], [Z, X, 0],
  [-Z, X, 0], [Z, -X, 0], [-Z, -X, 0]
]

const tIndices = [
  [0, 4, 1], [0, 9, 4], [9, 5, 4], [4, 5, 8],
  [4, 8, 1], [8, 10, 1], [8, 3, 10], [5, 3, 8],
  [5, 2, 3], [2, 7, 3], [7, 10, 3], [7, 6, 10],
  [7, 11, 6], [11, 0, 6], [ 0, 1, 6], [ 6, 1, 10],
  [ 9, 0, 11], [ 9, 11, 2], [ 9, 2, 5], [ 7, 2, 11 ]
]

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL)
  // smooth(10)
  translate(width/2, height/2, 0)
  const cam = createEasyCam()
  Icosahedron()
}

function draw() {
  background(0)
  // let dirY = (mouseY / height - 0.5) * 2
  // let dirX = (mouseX / width - 0.5) * 2
  // directionalLight(250, 250, 250, dirX, -dirY, 0.25)
  // text(frameRate, - width / 2.4, - height / 2.5 )

  let f1, f2, f3

  rotateY(degrees(PI) + r * 0.3)
  rotateX(degrees(HALF_PI) * 1.190)

  for (let i = 0; i < particles.length; i += 3) {
    const f1 = particles[i].copy()
    const f2 = particles[i + 1].copy()
    const f3 = particles[i + 2].copy()
    colorMode(HSB, 360, 100, 100)

    noFill()
    strokeWeight(1)
    stroke(
      190 - (f2.x + f1.y+ f3.z) / 10 ,  100 , 70 + abs(f2.y+ f1.x + f3.z) / 4
    )

    beginShape()
    vertex(f1.x, f1.y, f1.z)
    vertex(f2.x, f2.y, f2.z)
    vertex(f3.x, f3.y, f3.z)
    endShape(CLOSE)
  }

  terrain()
  m += 0.01 // make the terrain move
  r += 0.04
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    if (ICOSUBDIVISION === 5) return
    ICOSUBDIVISION += 1
  } else if (keyCode === DOWN_ARROW) {
    if (ICOSUBDIVISION === 0) return
    ICOSUBDIVISION -= 1
  }
  particles = []
  Icosahedron()
}

function Icosahedron() {
  vertexList = []
  for (let i = 0; i < 20; i++) {
    subdivide(
      vData[tIndices[i][0]],
      vData[tIndices[i][1]],
      vData[tIndices[i][2]],
      ICOSUBDIVISION
    )
  }

  for (let e = 0; e < vertexList.length; e += 3) {
    let y = 1, z = 2
    const p = createVector(
      vertexList[e] * 200,
      vertexList[e + y] * 200,
      vertexList[e + z] * 200
    )
    particles.push(p)
  }
}

function terrain() {
  particles.forEach(particle => {
    const p = particle.normalize()
    const f = n => n * 2 + m
    // V1
    // const r = map(noise(f(p.x), f(p.y), f(p.z)), 0, 1, 50, 120)
    // p.mult(r * 2)
    // V2
    const r = map(noise(f(p.x), f(p.y), f(p.z)), 0, 1, 10, 120)
    p.div(r * 0.0001)
  })
}

function norme(v) {
  let ln = 0
  for (let i = 0; i < 3; i++)
    ln += (v[i] * v[i])

  ln = sqrt(ln)
  for (let i = 0; i < 3; i++)
    v[i] /= ln
}

function addi(v) {
  for (let i = 0; i < 3; i++)
    vertexList.push(v[i])
}

function subdivide(v1, v2, v3, depth) {
  if (depth === 0) {
    addi(v1)
    addi(v2)
    addi(v3)
    return
  }

  v12 = [0, 0, 0], v23 = [0, 0, 0], v31 = [0, 0, 0]

  for (let i = 0; i < 3; i++) {
    v12[i] = (v1[i] + v2[i]) / 2
    v23[i] = (v2[i] + v3[i]) / 2
    v31[i] = (v3[i] + v1[i]) / 2
  }

  norme(v12)
  norme(v23)
  norme(v31)

  subdivide(v1, v12, v31, depth - 1)
  subdivide(v2, v23, v12, depth - 1)
  subdivide(v3, v31, v23, depth - 1)
  subdivide(v12, v23, v31, depth - 1)
}
