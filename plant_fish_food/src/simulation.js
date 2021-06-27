const { createFood } = require("./src/food")
const { createFish } = require("./src/fish")
const { createSharks } = require("./src/shark")

const startingFormButton = document.querySelector("#starting-form")
const resetButton = document.querySelector("#reset")
let runningSim = false
let foodList = []
let fishList = []
let sharkList = []
let simulation


startingFormButton.addEventListener("submit", function(event){
  event.preventDefault();   // stop the form from submitting
  let foodNumber = document.getElementById("food-number").value
  let fishNumber = document.getElementById("fish-number").value
  let sharkNumber = document.getElementById("shark-number").value
  
  foodList = createFood(foodNumber)
  fishList = createFish(fishNumber)
  sharkList = createSharks(sharkNumber)

  const simulationBox = document.getElementById('simulation-box')
  simulationBox.style.height = "600px"
  simulationBox.style.visibility = "visible"
  startingFormButton.style.visibility = "hidden"
  resetButton.style.visibility = "visible"

  createDisplay(simulationBox, foodList, fishList, sharkList)

  runningSim = true 
  simulation = setInterval(() => {
    drawSimulation(foodList, fishList, sharkList)
  }, 50);
})


resetButton.addEventListener("click", function(event){
  event.preventDefault();   // stop the form from submitting

  const simulationBox = document.getElementById('simulation-box')
  simulationBox.innerHTML=""
  simulationBox.style.height = "0px"
  simulationBox.style.visibility = "hidden"
  startingFormButton.style.visibility = "visible"
  resetButton.style.visibility = "hidden"

  runningSim = false
  clearInterval(simulation)
})

function createDisplay(simulationBox, foodList, fishList, sharkList) {
  foodList.forEach(food => {
    const foodDisplay = document.createElement('div')
    foodDisplay.setAttribute("id", `food-${food.id}`)
    foodDisplay.classList.add("food")
    simulationBox.appendChild(foodDisplay)
  })
  fishList.forEach(fish => {
    const fishDisplay = document.createElement('div')
    fishDisplay.setAttribute("id", `fish-${fish.id}`)
    fishDisplay.classList.add("fish")
    simulationBox.appendChild(fishDisplay)
  })
  sharkList.forEach(shark => {
    const sharkDisplay = document.createElement('div')
    sharkDisplay.setAttribute("id", `shark-${shark.id}`)
    sharkDisplay.classList.add("shark")
    simulationBox.appendChild(sharkDisplay)
  })
}

function drawSimulation(foodList, fishList, sharkList) {
  for(var i = 0; i < foodList.length; i++) {
    foodList[i].stepForward(foodList, sharkList)
    displayOneFood(foodList[i], i)
  }
  for(var i = 0; i < fishList.length; i++) {
    fishList[i].stepForward(foodList, fishList, sharkList)
    displayOneFish(fishList[i], i)
  }
  for(var i = 0; i < sharkList.length; i++) {
    sharkList[i].stepForward(fishList)
    displayOneShark(sharkList[i], i)
  }
}

function displayOneFood(food, index) {
  const foodDisplay = document.getElementById(`food-${index}`)
  foodDisplay.style.left = `${food.x +25}px`
  foodDisplay.style.top = `${food.y +25}px`
  foodDisplay.style.width = `${food.size *2}px`
  foodDisplay.style.height = `${food.size *2}px`
}

function displayOneFish(fish, index) {
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