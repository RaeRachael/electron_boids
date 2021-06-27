const { createFish } = require("./src/fish")
const { createSharks } = require("./src/shark")

const startingFormButton = document.querySelector("#starting-form")
const resetFormButton = document.querySelector("#reset-form")
let runningSim = false

if (!runningSim) {
  startingFormButton.addEventListener("submit", function(event){
    event.preventDefault();   // stop the form from submitting
    let fishNumber = document.getElementById("fish-number").value
    let sharkNumber = document.getElementById("shark-number").value
    
    var fishList = createFish(fishNumber)
    var sharkList = createSharks(sharkNumber)

    const simulationBox = document.getElementById('simulation-box')
    simulationBox.style.width = "1200px"
    simulationBox.style.height = "600px"
    simulationBox.style.visibility="visible"
    startingFormButton.style.visibility="hidden"
    resetFormButton.style.visibility="visible"

    createDisplay(simulationBox, fishList, sharkList)

    runningSim = true
    let simulation = setInterval(() => {
      drawSimulation(fishList, sharkList)
    }, 50);

  })
} else {
  resetFormButton.addEventListener("submit", function(event){
    event.preventDefault();   // stop the form from submitting

    const simulationBox = document.getElementById('simulation-box')
    simulationBox.style.width = "1200px"
    simulationBox.style.height = "0px"
    simulationBox.style.visibility="hidden"
    startingFormButton.style.visibility="visible"
    resetFormButton.style.visibility="hidden"

    runningSim = false
    clearInterval(simulation)
  })

}

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
    sharkDisplay.style.borderWidth = `0 7px 20px 7px`
    sharkDisplay.style.transform = `translate(-50%, -50%) rotate(${shark.angle}rad)`
    sharkDisplay.classList.add("shark")
    simulationBox.appendChild(sharkDisplay)
  })
}

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
}

function displayOneShark(shark, index) {
  const sharkDisplay = document.getElementById(`shark-${index}`)
  sharkDisplay.style.left = `${shark.x+25}px`
  sharkDisplay.style.top = `${shark.y+25}px`
  sharkDisplay.style.borderWidth = `0 ${7*shark.scale}px ${20*shark.scale}px ${7*shark.scale}px`
  sharkDisplay.style.transform = `translate(-50%, -50%) rotate(${shark.angle}rad)`
}