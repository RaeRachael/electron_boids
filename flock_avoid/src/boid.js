
function createBoids(number) {
  var boidList = []
  for(var i = 0; i < number; i++) {
    boidList.push(new Boid(Math.random()*900, Math.random()*600, Math.random()*2, Math.random()*2, i))
  }
  return boidList
}

class Boid {

  constructor(x,y,xdot,ydot,id) {
    this.x = x
    this.y = y
    this.xdot = xdot
    this.ydot = ydot
    this.angle = Math.atan2(this.xdot,-this.ydot)
    this.id = id
  }

  stepForward(boidList) {
    if (this.checkWalls(this.x,this.y)) {
      this.x = Math.random()*900
      this.y = Math.random()*600
    }
    if (!this.needToAvoidWall()) {
      this.flock(boidList) 
    }
    this.x += this.xdot
    this.y += this.ydot
  }

  flock() {
    this.nearBoids = []
    boidList.forEach(boid => {
      if(this.id === boid.id) {
        return true
      }
      var distance = ((boid.x - this.x)**2 + (boid.y - this.y)**2)**0.5
      if( distance < 40 ) {
        this.nearBoids.push(boid)
      }
    })
    if (this.nearBoids.length > 0) {
      this.updateAverageBoid()
      this.spreadOut()
      this.alignWith()
      this.moveToCenter()
    }
    this.angle = Math.atan2(this.xdot,-this.ydot)
  }

  updateAverageBoid() {
    this.averageBoid = {x: 0, y: 0, xdot: 0, ydot: 0}
    this.nearBoids.forEach(nearBoid => {
      this.averageBoid.x += nearBoid.x
      this.averageBoid.y += nearBoid.y
      this.averageBoid.xdot += nearBoid.xdot
      this.averageBoid.ydot += nearBoid.ydot
    });
    this.averageBoid.x /= this.nearBoids.length
    this.averageBoid.y /= this.nearBoids.length
    this.averageBoid.xdot /= this.nearBoids.length
    this.averageBoid.ydot /= this.nearBoids.length
  }

  spreadOut() {
    this.nearBoids.forEach(nearBoid => {
      var distance = ((nearBoid.x - this.x)**2 + (nearBoid.y - this.y)**2)**0.5
      this.xdot += (this.x - nearBoid.x) * 0.05/distance
      this.ydot += (this.y - nearBoid.y) * 0.05/distance
    })
  }

  alignWith() {
    this.xdot += (this.xdot - this.averageBoid.xdot) * -0.01
    this.ydot += (this.ydot - this.averageBoid.ydot) * -0.01
  }

  moveToCenter() {
    this.xdot += (this.x - this.averageBoid.x) * -0.01
    this.ydot += (this.y - this.averageBoid.y) * -0.01
  }

  needToAvoidWall() {
    var avoid = false
    for(var angle = -8; angle <= 8; angle++) {
      var distance = this.collisionWall(angle)
      if (distance === false) continue
      if (angle !== 0) {
        this.angle += -1.2/(angle*distance)
      }
      if (distance < 20) {
        avoid = true
      }
    }
    var speed = (this.xdot**2 + this.ydot**2)**0.5
    if (avoid) speed = (speed + 0.05) * 0.9
    this.xdot = Math.sin(this.angle)*speed
    this.ydot = -Math.cos(this.angle)*speed
    return avoid
  }

  collisionWall(direction) {
    for(var t = 1; t < 50; t+=1) {
      var x_test = this.x + t * Math.sin(this.angle + direction * Math.PI * 10/ 180)
      var y_test = this.y + t * -Math.cos(this.angle + direction * Math.PI * 10/ 180)
      if (this.checkWalls(x_test, y_test)) {
        return t
      }
    }
    return false
  }

  checkWalls(x_test, y_test) {
    if( (x_test-450)**2 + (y_test-300)**2 > 300**2 || (x_test-450)**2 + (y_test+25)**2 < 75**2 || (x_test-450)**2 + (y_test-625)**2 < 75**2) {
    // if(x_test < 0 || x_test > 900 || y_test < 0 || y_test > 600 || (x_test-450)**2 + (y_test-300)**2 < 50**2) {
      return true
    }
  }
}

module.exports.createBoids = createBoids