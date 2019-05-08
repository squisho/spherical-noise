let ICOSUBDIVISION = 2
let offset = 0.4, rotation = 0, level = 0
let ico, mic, cam

function createIcosahedron() {
  return new Icosahedron(ICOSUBDIVISION)
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL)
  // smooth(10)
  translate(width/2, height/2, 0)
  cam = createEasyCam()
  cam.zoom(1000)
  ico = createIcosahedron()
  mic = new p5.AudioIn()
  mic.start()
}

function draw() {
  background(0)
  rotateY(degrees(PI) + rotation * 0.3)
  rotateX(degrees(HALF_PI) + rotation * 1.190)

  for (let i = 0; i < ico.particles.length; i += 3) {
    const f1 = ico.particles[i].copy()
    const f2 = ico.particles[i + 1].copy()
    const f3 = ico.particles[i + 2].copy()
    colorMode(HSB, 360, 100, 100)

    // noFill()
    let c = color(
      225 - (f2.x + f1.y + f3.z) / 10,
      100,
      120  + abs(f2.y + f1.z + f3.x) / 4
    )
    strokeWeight(1)
    stroke(c)
    fill(c)

    beginShape()
    vertex(f1.x, f1.y, f1.z)
    vertex(f2.x, f2.y, f2.z)
    vertex(f3.x, f3.y, f3.z)
    endShape(CLOSE)
  }

  const currentLevel = mic.getLevel()
  // updateLevel(currentLevel)
  // const maxHeight = map(level, 0, 1, 50, 120)
  ico.terrain(offset)//, maxHeight)
  // make the terrain move with the sound
  offset += map(currentLevel, 0, 1, 0.000001, 0.15) // 0.01
  rotation += 0.01 // rotation
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    if (ICOSUBDIVISION === 5) return
    ICOSUBDIVISION += 1
  } else if (keyCode === DOWN_ARROW) {
    if (ICOSUBDIVISION === 0) return
    ICOSUBDIVISION -= 1
  }
  ico = createIcosahedron()
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function updateLevel(currentLevel) {
  const q = 0.3
  const newLevel = (q * level) + ((1 - q) * currentLevel)
  level = newLevel
}
