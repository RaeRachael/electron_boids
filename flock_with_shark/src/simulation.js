const { createFish } = require("./src/fish")
const { createSharks } = require("./src/shark")

const simulationBox = document.getElementById('simulation-box')

var fishList = createFish(300)
var sharkList = createSharks(2)

createDisplay(simulationBox, fishList, sharkList)

function createDisplay(simulationBox, fishList, sharkList) {
  fishList.forEach(fish => {
    const fishDisplay = document.createElement('div')
    fishDisplay.setAttribute("id", `fish-${fish.id}`)
    fishDisplay.style.left = `${fish.x +25}px`
    fishDisplay.style.top = `${fish.y +25}px`
    fishDisplay.style.transform = `translate(-50%, -50%) rotate(${fish.angle}rad)`
    fishDisplay.classList.add("fish")
    simulationBox.appendChild(fishDisplay)
  })
  sharkList.forEach(shark => {
    const sharkDisplay = document.createElement('div')
    sharkDisplay.setAttribute("id", `shark-${shark.id}`)
    sharkDisplay.style.left = `${shark.x +25}px`
    sharkDisplay.style.top = `${shark.y +25}px`
    sharkDisplay.style.borderWidth = `0 ${7*shark.scale}px ${20*shark.scale}px ${7*shark.scale}px`
    sharkDisplay.style.transform = `translate(-50%, -50%) scale(0.7) rotate(${shark.angle}rad)`
    sharkDisplay.classList.add("shark")
    simulationBox.appendChild(sharkDisplay)
    console.log(shark.scale, sharkDisplay)
  })
}

setInterval(() => {
  drawSimulation(fishList, sharkList)
}, 10);

function drawSimulation(fishList, sharkList) {
  for(var i = 0; i < fishList.length; i++) {
    fishList[i].stepForward(fishList, sharkList)
    displayOnefish(fishList[i], i)
  }
  for(var i = 0; i < sharkList.length; i++) {
    sharkList[i].stepForward(fishList)
    displayOneShark(sharkList[i], i)
  }
}

function displayOnefish(fish, index) {
  const fishDisplay = document.getElementById(`fish-${index}`)
  fishDisplay.style.left = `${fish.x+25}px`
  fishDisplay.style.top = `${fish.y+25}px`
  fishDisplay.style.transform = `translate(-50%, -50%) rotate(${fish.angle}rad)`
  fishDisplay.classList.add("fish")
}

function displayOneShark(shark, index) {
  const sharkDisplay = document.getElementById(`shark-${index}`)
  sharkDisplay.style.left = `${shark.x+25}px`
  sharkDisplay.style.top = `${shark.y+25}px`
  sharkDisplay.style.borderWidth = `0 ${7*shark.scale}px ${20*shark.scale}px ${7*shark.scale}px`
  sharkDisplay.style.transform = `translate(-50%, -50%) scale(0.7) rotate(${shark.angle}rad)`
  sharkDisplay.classList.add("shark")
  simulationBox.appendChild(sharkDisplay)
  console.log(shark.scale, sharkDisplay)
}