const { createFish } = require("./src/fish")
const { createSharks } = require("./src/shark")

const startingFormButton = document.querySelector("#starting-form")
const resetButton = document.querySelector("#reset")
let runningSim = false
let fishList = []
let sharkList = []
let simulation


startingFormButton.addEventListener("submit", function(event){
  event.preventDefault();   // stop the form from submitting
  let fishNumber = document.getElementById("fish-number").value
  let sharkNumber = document.getElementById("shark-number").value
  
  fishList = createFish(fishNumber)
  sharkList = createSharks(sharkNumber)

  const simulationBox = document.getElementById('simulation-box')
  simulationBox.style.height = "600px"
  simulationBox.style.visibility = "visible"
  startingFormButton.style.visibility = "hidden"
  resetButton.style.visibility = "visible"

  createDisplay(simulationBox, fishList, sharkList)

  runningSim = true 
  simulation = setInterval(() => {
    drawSimulation(fishList, sharkList)
  }, 50);
})


resetButton.addEventListener("click", function(event){
  event.preventDefault();   // stop the form from submitting

  const simulationBox = document.getElementById('simulation-box')
  // simulationBox.innerHTML=""
  simulationBox.style.height = "0px"
  simulationBox.style.visibility = "hidden"
  startingFormButton.style.visibility = "visible"
  resetButton.style.visibility = "hidden"

  runningSim = false
  clearInterval(simulation)
})

function createDisplay(simulationBox, fishList, sharkList) {
  fishList.forEach(fish => {
    if (!document.getElementById(`fish-${fish.id}`)) {
      const fishDisplay = document.createElement('div')
      fishDisplay.setAttribute("id", `fish-${fish.id}`)
      fishDisplay.style.left = `${fish.x +25}px`
      fishDisplay.style.top = `${fish.y +25}px`
      fishDisplay.style.transform = `translate(-50%, -50%) rotate(${fish.angle}rad)`
      fishDisplay.classList.add("fish")
      simulationBox.appendChild(fishDisplay)
    }
  })
  sharkList.forEach(shark => {
    if (!document.getElementById(`shark-${shark.id}`)) {
      const sharkDisplay = document.createElement('div')
      sharkDisplay.setAttribute("id", `shark-${shark.id}`)
      sharkDisplay.style.left = `${shark.x +25}px`
      sharkDisplay.style.top = `${shark.y +25}px`
      sharkDisplay.style.borderWidth = `0 7px 20px 7px`
      sharkDisplay.style.transform = `translate(-50%, -50%) rotate(${shark.angle}rad)`
      sharkDisplay.classList.add("shark")
      simulationBox.appendChild(sharkDisplay)
    }
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