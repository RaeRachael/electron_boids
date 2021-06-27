const {Boid} = require('./boid.js')

function createFish(number) {
  var fishList = []
  for(var i = 0; i < number; i++) {
    fishList.push(new Fish(50+Math.random()*1100, 50+Math.random()*500, Math.random()*2, Math.random()*2, i))
  }
  return fishList
}

class Fish extends Boid{

  constructor(x,y,xdot,ydot,id) {
    super(x,y,xdot,ydot,id)
    this.speedMax = 4
  }

  stepForward(foodList, fishList, sharkList) {
    if (this.checkWalls(this.x,this.y)) {
      this.rePlace()
    }
    if (!this.needToAvoidWall()) {
      if (!this.avoidShark(sharkList)) {
        if(!this.goTo(foodList)) {
          this.flock(fishList)
        }
      }
    }
    this.move(this.speedMax)
  }

  goTo(foodList) {
    var goTo = false
    foodList.forEach(food => {
      var distance = ((food.x - this.x)**2 + (food.y - this.y)**2)**0.5
      if( distance < food.size ) {
        this.xdot += (this.x - food.x) * -0.05
        this.ydot += (this.y - food.y) * -0.05
        food.eaten()
        goTo = false
        return 1
      } else if ( distance + food.size < 60 ) {
        this.xdot += (this.x - food.x) * -0.1 * food.size/(distance)
        this.ydot += (this.y - food.y) * -0.1 * food.size/(distance)
        goTo = true
      }
    })
    return goTo
  }

  flock(fishList) {
    this.nearfishs = []
    fishList.forEach(fish => {
      if(this.id === fish.id) {
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
      this.xdot += (this.x - nearfish.x) * 0.1/distance
      this.ydot += (this.y - nearfish.y) * 0.1/distance
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
      var distance = ((shark.x - this.x)**2 + (shark.y - this.y)**2)**0.5
      if( distance < 40 ) {
        this.xdot += (this.x - shark.x) * 0.8/distance
        this.ydot += (this.y - shark.y) * 0.8/distance
        avoiding = true
      }
    })
    return avoiding
  }

  eaten() {
    this.rePlace()
  }
}

module.exports.createFish = createFish