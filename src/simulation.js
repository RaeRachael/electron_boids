const simultionBox = document.getElementById('simulation-box')

var boidList = [
  {position_x: 50, position_y: 50, angle:0},
  {position_x: 100, position_y: 50, angle:45},
  {position_x: 150, position_y: 50, angle:90},
  {position_x: 200, position_y: 50, angle:100}
]
drawSimulation(simultionBox, boidList)

function drawSimulation(simulationBox, boidList) {
  boidList.forEach(boid => {
    displayOneBoid(simulationBox, boid)
  });
}

function displayOneBoid(simulationBox, boid) {
  console.log(boid, "boid")
  const boidDisplay = document.createElement('div')
  boidDisplay.style.left = `${boid.position_x}px`
  boidDisplay.style.top = `${boid.position_y}px`
  boidDisplay.style.transform = `translate(-50%, -50%) rotate(${boid.angle}deg)`
  boidDisplay.classList.add("boid")
  console.log(boidDisplay, "boidDisplay")
  simulationBox.appendChild(boidDisplay)
}