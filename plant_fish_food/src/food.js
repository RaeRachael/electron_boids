
function createFood(number) {
  var foodList = []
  for(var i = 0; i < number; i++) {
    foodList.push(new Food(50+Math.random()*1100, 50+Math.random()*500, i))
  }
  return foodList
}

class Food {

  constructor(x,y,id) {
    this.x = x
    this.y = y
    this.id = id
    this.size = 8
  }

  stepForward() {
    if (this.size < 5) {
      this.x = 50+Math.random()*1100
      this.y = 50+Math.random()*500
      this.size = 8
    }
    this.size = (this.size**2 + 2)**0.5
  }

  eaten() {
    this.size += -0.1
  } 

}

module.exports.createFood = createFood