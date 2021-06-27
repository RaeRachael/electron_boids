
function createFood(number) {
  var foodList = []
  for(var i = 0; i < number; i++) {
    foodList.push(new Food(50+Math.random()*1100, 50+Math.random()*500, i))
  }
  return foodList
}

class Food {

  constructor(x, y, id) {
    this.x = x
    this.y = y
    this.id = id
    this.size = 15
  }

  stepForward() {
    this.size = (this.size**2 + 4)**0.5
    this.x += 1-Math.random()*2
    this.y += 1-Math.random()*2
    if ( this.x < 25) this.x = 25
    if ( this.y < 25) this.y = 25 
    if ( this.x > 1175) this.x = 1175
    if ( this.y > 575) this.y = 575
  }

  eaten() {
    this.size = (this.size**2 - 1)**0.5
    if (this.size < 10) {
      this.x = 50+Math.random()*1100
      this.y = 50+Math.random()*500
      this.size = 15
    }
  } 

}

module.exports.createFood = createFood