
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
    this.xdot = 3-Math.random()*6
    this.ydot = 3-Math.random()*6
    this.id = id
    this.size = 15
  }

  async stepForward() {
    this.size = (this.size**2 + 4)**0.5
    this.xdot += 0.5-Math.random()
    this.ydot += 0.5-Math.random()
    if (this.xdot**2 +this.ydot**2 > 9) {
      this.xdot *= 0.9
      this.ydot *= 0.9
    }
    this.x += this.xdot
    this.y += this.ydot
    if ( this.x < 50) {
      this.x = 50
      this.xdot *= -1
    }
    if ( this.y < 50) {
      this.y = 50
      this.ydot *= -1
    }
    if ( this.x > 1150) {
      this.x = 1150
      this.xdot *= -1
    }
    if ( this.y > 550) {
      this.y = 550
      this.ydot *= -1
    }

    return {x: this.x, y: this.y, size: this.size, id: this.id, type: "food"}
  }

  eaten() {
    this.size = (this.size**2 - 1)**0.5
    if (this.size < 15) {
      this.x = 50+Math.random()*1100
      this.y = 50+Math.random()*500
      this.size = 15
    }
  } 

}

module.exports.createFood = createFood