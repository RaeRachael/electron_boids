const {Boid} = require('./boid.js')

function createSharks(number) {
  var sharkList = []
  for(var i = 0; i < number; i++) {
    sharkList.push(new Shark(50+Math.random()*1100, 50+Math.random()*500, Math.random()*2, Math.random()*2, 1, i))
  }
  return sharkList
}

class Shark extends Boid {

  constructor(x, y, xdot, ydot, scale, id) {
    super(x, y, xdot, ydot, scale, id)
    this.food = 100
    this.children = 0
    this.senseDistance = 60
  }

  async stepForward(fishList, sharkList) {
    this.food -= 1
    if (this.food < 0) {
      this.food = 100
      this.scale -= 0.005
    }
    if (this.food > 100) {
      this.food -= 50
      this.scale += 0.01
    }
    if (this.scale < 0.75 || this.checkWalls(this.x,this.y)) {
      removeOneDisplay("shark", this.id)
      for(var i = 0; i < sharkList.length; i++) {
        if (sharkList[i] && sharkList[i].id === this.id) delete sharkList[i]
      }
      return
    }
    if (this.scale > 1.3) {
      this.scale = 1
      sharkList.push(new Shark(this.x, this.y, 0, 0, 0.8, `${this.id}.${this.children}`))
      createOneDisplay("shark", `${this.id}.${this.children}`)
      this.children++
    }
    // this.speedMax = 5 / this.scale

    this.avoidWall()
    this.huntBoid(fishList) 
    this.move()
    return {x: this.x, y: this.y, angle: this.angle, scale: this.scale, id: this.id, type: "shark"}
  }

  huntBoid(fishList) {
    var chase = false
    fishList.forEach(fish => {
      if (fish) {
        var distance = ((fish.x - this.x)**2 + (fish.y - this.y)**2)**0.5
        if( distance < this.senseDistance ) {
          chase = true
          if (distance < 10 * this.scale) {
            this.feed(fish)
          }
          else {
            this.xdot += (this.x - fish.x - 5*fish.xdot) * -0.5/distance
            this.ydot += (this.y - fish.y - 5*fish.ydot) * -0.5/distance
          }
        }
      }
    })
    if (chase) {
      this.senseDistance *= 0.95
      if (this.senseDistance < 20) this.senseDistance = 20
    } else {
      this.senseDistance *= 1.2
      this.xdot *= 1.5
      this.ydot *= 1.5
      if (this.senseDistance > 100) this.senseDistance = 100
    }
    console.log(chase, this.senseDistance)
  }

  feed(fish) {
    this.food += 20
    fish.eaten()
  }
}

module.exports.createSharks = createSharks