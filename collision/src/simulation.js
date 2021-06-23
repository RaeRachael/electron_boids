const { createBoids } = require("./src/boid")

const simulationBox = document.getElementById('simulation-box')

var boidList = createBoids(20)

createDisplay(simulationBox, boidList)

function createDisplay(simulationBox, boidList) {
  for(var i = 0; i < 20; i++) {
    console.log(boidList[i], "boid")
    const boidDisplay = document.createElement('div')
    boidDisplay.setAttribute("id", `${i}`)
    boidDisplay.style.left = `${boidList[i].x +25}px`
    boidDisplay.style.top = `${boidList[i].y +25}px`
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
    boidList[i].stepForward(boidList)
    displayOneBoid(boidList[i], i)
  }
}

function displayOneBoid(boid, index) {
  const boidDisplay = document.getElementById(`${index}`)
  boidDisplay.style.left = `${boid.x+25}px`
  boidDisplay.style.top = `${boid.y+25}px`
  boidDisplay.style.transform = `translate(-50%, -50%) rotate(${boid.angle}deg)`
  boidDisplay.classList.add("boid")
}