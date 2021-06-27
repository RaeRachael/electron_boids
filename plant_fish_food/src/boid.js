
class Boid {

  constructor(x,y,xdot,ydot,id) {
    this.x = x
    this.y = y
    this.xdot = xdot
    this.ydot = ydot
    this.angle = Math.atan2(this.xdot,-this.ydot)
    this.id = id
    this.speedMax = 4
  }

  rePlace() {
    this.x = 50+Math.random()*1100
    this.y = 50+Math.random()*500
  }

  move() {
    this.angle = Math.atan2(this.xdot,-this.ydot)
    var speed = (this.xdot**2 + this.ydot**2)**0.5
    if (speed > this.speedMax) {
      this.xdot *= this.speedMax/speed
      this.ydot *= this.speedMax/speed
    }
    this.x += this.xdot
    this.y += this.ydot
  }

  needToAvoidWall() {
    var avoid = false
    for(var angle = -6; angle <= 6; angle++) {
      var distance = this.collisionWall(angle)
      if (distance === false) continue
      if (angle !== 0) {
        this.angle += -5/(angle*distance)
      }
      if (distance < 25) {
        avoid = true
      }
    }
    var speed = (this.xdot**2 + this.ydot**2)**0.5
    if (avoid) speed = (speed + 0.1) * 0.95
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
    if(x_test < 0 || x_test > 1200 || y_test < 0 || y_test > 600) {
      return true
    }
    var circles = [{x: -25, y: -25}, {x: 1225, y: -25}, {x: -25, y: 625}, {x: 1225, y: 625}, {x: 600, y: 300}]
    for(var i = 0; i < circles.length; i++) {
      if ( (x_test - circles[i].x)**2 + (y_test - circles[i].y)**2 < 100**2) {
        return true
      }
    }
  }
}

module.exports.Boid = Boid