const {Boid} = require('./boid.js')

function createSharks(number) {
  var sharkList = []
  for(var i = 0; i < number; i++) {
    sharkList.push(new Shark(50+Math.random()*1100, 50+Math.random()*500, Math.random()*2, Math.random()*2, i))
  }
  return sharkList
}

class Shark extends Boid {

  constructor(x,y,xdot,ydot,id) {
    super(x,y,xdot,ydot,id)
    this.speedMax = 5
    this.food = 100
    this.scale = 1
  }

  stepForward(fishList) {
    this.food -= 1
    if (this.food < 0) {
      this.food = 50
      this.scale -= 0.005
    }

    if (this.food > 100) {
      this.food = 50
      this.scale += 0.005
    }

    if (this.scale < 0.5 || this.checkWalls(this.x,this.y)) {
      this.rePlace()
      this.scale = 1
    }
    if (!this.needToAvoidWall()) {
      this.huntBoid(fishList) 
    }
    this.move()
  }

  huntBoid(fishList) {
    var chase = false
    fishList.forEach(fish => {
      var distance = ((fish.x - this.x)**2 + (fish.y - this.y)**2)**0.5
      if( distance < 60 ) {
        chase = true
        if (distance < 10) {
          this.feed(fish)
        }
        else {
          this.xdot += (this.x - fish.x) * -0.5/distance
          this.ydot += (this.y - fish.y) * -0.5/distance
          chase = true
        }
      }
    })
    if (!chase) {
      this.xdot *= 1.5
      this.ydot *= 1.5
    }
  }

  feed(fish) {
    this.food *= 25
    fish.eaten()
  }
}

module.exports.createSharks = createSharks