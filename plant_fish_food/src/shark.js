const {Boid} = require('./boid.js')

function createSharks(number) {
  var sharkList = []
  for(var i = 0; i < number; i++) {
    sharkList.push(new Shark(50+Math.random()*1100, 50+Math.random()*500, Math.random()*2, Math.random()*2, 1, i, 5, 20, 100))
  }
  return sharkList
}

class Shark extends Boid {

  constructor(x, y, xdot, ydot, size, id, speedMax, minSight, maxSight) {
    super(x, y, xdot, ydot, size, id)
    this.food = 100
    this.children = 0
    this.speedMax = speedMax
    this.birthRate = 2
    this.sight = 60
    this.childSize = 0.8
    this.minSight = minSight
    this.maxSight = maxSight
    this.energyUsageRate = 0.25 * ((this.speedMax/5)**2 + this.maxSight/100 + (50 - this.minSight)/30)
    console.log("shark", this.size, this.energyUsageRate, this.speedMax, this.maxSight, this.minSight)
  }

  async stepForward(fishList, sharkList) {
    this.food -= this.energyUsageRate
    if (this.food < 0) {
      this.food = 100
      this.size -= 0.005
    }
    if (this.food > 100) {
      this.food -= 50
      this.size += 0.01
    }
    if (this.size < 0.75 || this.checkWalls(this.x,this.y)) {
      removeOneDisplay("shark", this.id)
      for(var i = 0; i < sharkList.length; i++) {
        if (sharkList[i] && sharkList[i].id === this.id) delete sharkList[i]
      }
      return
    }
    if (this.size > 1.3) {
      this.giveBirth(sharkList)
    }
    // this.speedMax = 5 / this.size

    this.avoidWall()
    this.huntBoid(fishList) 
    this.move()
    return {x: this.x, y: this.y, angle: this.angle, size: this.size, id: this.id, type: "shark"}
  }

  giveBirth(sharkList) {
    if ( (this.size**2 - this.childSize**2)**0.5 > this.childSize) {
      sharkList.push(new Shark(this.x, this.y, 0, 0, this.childSize, `${this.id}.${this.children}`, this.speedMax + 0.5-Math.random(), this.minSight + 5-Math.random()*10, this.maxSight + 5-Math.random()*10))
      createOneDisplay("shark", `${this.id}.${this.children}`)
      this.children++
      this.size = (this.size**2 - this.childSize**2)**0.5
    }
  }

  huntBoid(fishList) {
    var chase = false
    fishList.forEach(fish => {
      if (fish) {
        var distance = ((fish.x - this.x)**2 + (fish.y - this.y)**2)**0.5
        if ( distance < this.sight ) {
          chase = true
          if (distance < 10 * this.size) {
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
      this.sight *= 0.95
      if (this.sight < this.minSight) this.minSight = 0.3
    } else {
      this.sight *= 1.2
      this.xdot *= 1.5
      this.ydot *= 1.5
      if (this.sight > this.maxSight) this.maxSight = 1.5
    }
  }

  feed(fish) {
    this.food += 20
    fish.eaten()
  }
}

module.exports.createSharks = createSharks