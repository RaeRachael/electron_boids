const { createBoids } = require("./src/boid")

const simulationBox = document.getElementById('simulation-box')

var boidList = createBoids(300)

createDisplay(simulationBox, boidList)

function createDisplay(simulationBox, boidList) {
  boidList.forEach(boid => {
    console.log(boid, "boid")
    const boidDisplay = document.createElement('div')
    boidDisplay.setAttribute("id", `${boid.id}`)
    boidDisplay.style.left = `${boid.x +25}px`
    boidDisplay.style.top = `${boid.y +25}px`
    boidDisplay.style.transform = `translate(-50%, -50%) rotate(${boid.angle}rad)`
    boidDisplay.classList.add("boid")
    console.log(boidDisplay, "boidDisplay")
    simulationBox.appendChild(boidDisplay)
  })
}

setInterval(() => {
  drawSimulation(boidList)
}, 10);

function drawSimulation(boidList) {
  for(var i = 0; i < boidList.length; i++) {
    boidList[i].stepForward(boidList)
    displayOneBoid(boidList[i], i)
  }
}

function displayOneBoid(boid, index) {
  const boidDisplay = document.getElementById(`${index}`)
  boidDisplay.style.left = `${boid.x+25}px`
  boidDisplay.style.top = `${boid.y+25}px`
  boidDisplay.style.transform = `translate(-50%, -50%) rotate(${boid.angle}rad)`
  boidDisplay.classList.add("boid")
}