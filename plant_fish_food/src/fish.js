const {Boid} = require('./boid.js')

function createFish(number) {
  var fishList = []
  for(var i = 0; i < number; i++) {
    fishList.push(new Fish(50+Math.random()*1100, 50+Math.random()*500, Math.random()*2, Math.random()*2, 1, i))
  }
  return fishList
}

class Fish extends Boid{

  constructor(x, y, xdot, ydot, scale, id) {
    super(x, y, xdot, ydot, scale, id)
    this.speedMax = 3
    this.children = 0
  }

  async stepForward(foodList, fishList, sharkList) { 
    this.scale -= 0.001
    if (this.scale < 0.75 || this.checkWalls(this.x,this.y)) {
      removeOneDisplay("fish", this.id)
      for(var i = 0; i < fishList.length; i++) {
        if (fishList[i] && fishList[i].id === this.id) delete fishList[i]
      }
      return
    }
    if (this.scale > 1.5) {
      this.scale = 1
      fishList.push(new Fish(this.x, this.y, 0, 0, 0.8, `${this.id}.${this.children}`))
      createOneDisplay("fish", `${this.id}.${this.children}`)
      this.children++
      fishList.push(new Fish(this.x, this.y, 0, 0, 0.8, `${this.id}.${this.children}`))
      createOneDisplay("fish", `${this.id}.${this.children}`)
      this.children++
    }
    if (!this.avoidWall()) {
      if(!this.avoidShark(sharkList)) {
        this.flock(fishList)
        this.goTo(foodList)
      }
    }
    this.move(this.speedMax)
    return {x: this.x, y: this.y, angle: this.angle, scale: this.scale, id: this.id, type: "fish"}
  }

  goTo(foodList) {
    var foodInSight = false
    foodList.forEach(food => {
      var distance = ((food.x - this.x)**2 + (food.y - this.y)**2)**0.5
      if ( distance < 40 + food.size ) {
        this.xdot += (this.x - food.x) * -1/(distance + 5)
        this.ydot += (this.y - food.y) * -1/(distance + 5)
        foodInSight = true
      }
      if ( distance < food.size ) {
        food.eaten()
        this.scale += 0.002
      }
    })
    if (!foodInSight) {
      this.xdot *= 1.05
      this.ydot *= 1.05
    }
  }

  flock(fishList) {
    this.nearfishs = []
    fishList.forEach(fish => {
      if(!fish || this.id === fish.id) {
        return true
      }
      var distance = ((fish.x - this.x)**2 + (fish.y - this.y)**2)**0.5
      if( distance < 60 ) {
        this.nearfishs.push(fish)
      }
    })
    if (this.nearfishs.length > 0) {
      this.updateAveragefish()
      this.spreadOut()
      this.alignWith()
      this.moveToCenter()
    }
  }

  updateAveragefish() {
    this.averagefish = {x: 0, y: 0, xdot: 0, ydot: 0}
    this.nearfishs.forEach(nearfish => {
      this.averagefish.x += nearfish.x
      this.averagefish.y += nearfish.y
      this.averagefish.xdot += nearfish.xdot
      this.averagefish.ydot += nearfish.ydot
    });
    this.averagefish.x /= this.nearfishs.length
    this.averagefish.y /= this.nearfishs.length
    this.averagefish.xdot /= this.nearfishs.length
    this.averagefish.ydot /= this.nearfishs.length
  }

  spreadOut() {
    this.nearfishs.forEach(nearfish => {
      var distance = ((nearfish.x - this.x)**2 + (nearfish.y - this.y)**2)**0.5
      this.xdot += (this.x - nearfish.x) * 0.4/(distance + 5)
      this.ydot += (this.y - nearfish.y) * 0.4/(distance + 5)
    })
  }

  alignWith() {
    this.xdot += (this.xdot - this.averagefish.xdot) * -0.01
    this.ydot += (this.ydot - this.averagefish.ydot) * -0.01
  }

  moveToCenter() {
    this.xdot += (this.x - this.averagefish.x) * -0.05
    this.ydot += (this.y - this.averagefish.y) * -0.05
  }

  avoidShark(sharkList) {
    var avoiding = false
    sharkList.forEach(shark => {
      // if (!shark)
      var distance = ((shark.x - this.x)**2 + (shark.y - this.y)**2)**0.5
      if( distance < 60 ) {
        this.xdot += (this.x - shark.x) * 2/(distance + 5)
        this.ydot += (this.y - shark.y) * 2/(distance + 5)
        avoiding = true
      }
    })
    return avoiding
  }

  eaten() {
    this.scale = 0
  }
}

module.exports.createFish = createFish