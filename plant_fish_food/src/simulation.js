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

  createDisplay(foodList, fishList, sharkList)

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

function createDisplay(foodList, fishList, sharkList) {
  foodList.forEach(food => {
    createOneDisplay("food", food.id)
  })
  fishList.forEach(fish => {
    createOneDisplay("fish", fish.id)
  })
  sharkList.forEach(shark => {
    createOneDisplay("shark", shark.id)
  })
}

function createOneDisplay(type, index) {
  console.log(type, index)
  const simulationBox = document.getElementById('simulation-box')
  const display = document.createElement('div')
  display.setAttribute("id", `${type}-${index}`)
  display.classList.add(`${type}`)
  simulationBox.appendChild(display)
}

function removeOneDisplay(type, id) {
  const display = document.getElementById(`${type}-${id}`)
  if (display) display.remove()
}

async function drawSimulation(foodList, fishList, sharkList) {
  var promiseList = []
  for(var i = 0; i < foodList.length; i++) {
    promiseList.push( foodList[i].stepForward(foodList, sharkList) )
  }
  for(var i = 0; i < fishList.length; i++) {
    if (!fishList[i]) continue
    promiseList.push( fishList[i].stepForward(foodList, fishList, sharkList) )
  }
  for(var i = 0; i < sharkList.length; i++) {
    if (!sharkList[i]) continue
    promiseList.push( sharkList[i].stepForward(fishList, sharkList) )
  }

  var displays = await Promise.all(promiseList)
  displays.forEach(display => {
    if(display) {
      switch (display.type) {
        case "food":
          displayOneFood(display)
          break
        case "fish":
          displayOneFish(display)
          break
        case "shark":
          displayOneShark(display)
          break
      }
    }
  })
  return true
}

function displayOneFood(food) {
  const foodDisplay = document.getElementById(`food-${food.id}`)
  foodDisplay.style.left = `${food.x +25}px`
  foodDisplay.style.top = `${food.y +25}px`
  foodDisplay.style.width = `${food.size *2}px`
  foodDisplay.style.height = `${food.size *2}px`
  foodDisplay.style.opacity = `${food.size/100 - 0.1}`
}

function displayOneFish(fish) {
  const fishDisplay = document.getElementById(`fish-${fish.id}`)
  if (!fishDisplay) return
  fishDisplay.style.left = `${fish.x+25}px`
  fishDisplay.style.top = `${fish.y+25}px`
  fishDisplay.style.borderWidth = `0 ${3*fish.scale}px ${10*fish.scale}px ${3*fish.scale}px`
  fishDisplay.style.transform = `translate(-50%, -50%) rotate(${fish.angle}rad)`
}

function displayOneShark(shark) {
  const sharkDisplay = document.getElementById(`shark-${shark.id}`)
  if (!sharkDisplay) return
  sharkDisplay.style.left = `${shark.x+25}px`
  sharkDisplay.style.top = `${shark.y+25}px`
  sharkDisplay.style.borderWidth = `0 ${7*shark.scale}px ${20*shark.scale}px ${7*shark.scale}px`
  sharkDisplay.style.transform = `translate(-50%, -50%) rotate(${shark.angle}rad)`
}