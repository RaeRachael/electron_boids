const simulationBox = document.getElementById('simulation-box')

const SPEED = 2
var boidList = []

createDisplay(simulationBox, boidList)

function createDisplay(simulationBox, boidList) {
  for(var i = 0; i < 20; i++) {
    boidList.push({x: Math.random()*800, y: Math.random()*600, angle: Math.random()*180})
    console.log(boidList[i], "boid")
    const boidDisplay = document.createElement('div')
    boidDisplay.setAttribute("id", `${i}`)
    boidDisplay.style.left = `${boidList[i].x}px`
    boidDisplay.style.top = `${boidList[i].y}px`
    boidDisplay.style.transform = `translate(-50%, -50%) rotate(${boidList[i].angle}deg)`
    boidDisplay.classList.add("boid")
    console.log(boidDisplay, "boidDisplay")
    simulationBox.appendChild(boidDisplay)
  }
}

setInterval(() => {
  drawSimulation(boidList)
}, 50);

function drawSimulation(boidList) {
  for(var i = 0; i< boidList.length; i++) {
    stepForward(boidList[i], boidList)
    displayOneBoid(boidList[i], i)
  }
}

function stepForward(boid, boidList) {
  boidList.forEach(otherBoid => {
    if(otherBoid === boid) {
      return true
    }
    var distance = ((otherBoid.x - boid.x)**2 + (otherBoid.y - boid.y)**2)**0.5
    if( distance < 50 ) {
      boid.angle += Math.sin((boid.angle - otherBoid.angle + 180) * Math.PI / 180) * 10/(distance)**0.5
      boid.angle = (boid.angle+360)%360
    }
  });
  boid.x += SPEED * Math.sin(boid.angle * Math.PI / 180)
  boid.y += SPEED * -Math.cos(boid.angle * Math.PI / 180)
  boid.x = (boid.x+800)%800
  boid.y = (boid.y+600)%600
}

function displayOneBoid(boid, index) {
  const boidDisplay = document.getElementById(`${index}`)
  boidDisplay.style.left = `${boid.x}px`
  boidDisplay.style.top = `${boid.y}px`
  boidDisplay.style.transform = `translate(-50%, -50%) rotate(${boid.angle}deg)`
  boidDisplay.classList.add("boid")
}