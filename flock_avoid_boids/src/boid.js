
function createBoids(number) {
  var boidList = []
  for(var i = 0; i < number; i++) {
    boidList.push(new Boid(Math.random()*900, Math.random()*600, Math.random()*360, 1+Math.random()*1, i))
  }
  return boidList
}

class Boid {

  constructor(x,y,angle,speed,id,left1,left2,right1,right2) {
    this.x = x
    this.y = y
    this.turnPref = {l1: left1, l2: left2, r1: right1, r2: right2}
    this.angle = angle
    this.speed = speed
    this.id = id
  }

  stepForward(boidList) {
    if (!this.needToAvoidWall()) {
      if (!this.needToAvoidBoid(boidList)) {
        this.flock(boidList)
      } 
    }
    if (this.speed < 0.05) this.speed = 0.05
    this.angle = (this.angle+360)%360
    this.x += this.speed * Math.sin(this.angle * Math.PI / 180)
    this.y += this.speed * -Math.cos(this.angle * Math.PI / 180)
  }

  flock() {
    boidList.forEach(boid => {
      if(this.id === boid.id) {
        return true
      }
      var distance = ((boid.x - this.x)**2 + (boid.y - this.y)**2)**0.5
      if( distance < 40 ) {
        this.angle += Math.sin((this.angle - boid.angle + 180) * Math.PI / 180)
        this.speed += (boid.speed - this.speed)/100
      }
    });
  }

  needToAvoidWall() {
    var avoid = false
    for(var angle = -8; angle <= 8; angle++) {
      var distance = this.collisionWall(angle)
      if (distance === false) continue
      if (angle === 0) {
        // this.angle += 50/(distance)
        // this.speed += 1/1000 * (1 - (distance%1000)/5000)
      } else {
        this.angle += -100/(angle*distance)
      }
      if (distance < 20) {
        avoid = true
      }
    }
    return avoid
  }

  needToAvoidBoid(boidList) {
    var avoid = false
    for(var angle = -8; angle <= 8; angle++) {
      var distance = this.collisionBoid(angle, boidList)
      if (distance === false) continue
      if (angle === 0) {
        this.angle += 5/(distance)
        this.speed += 1/1000 * (1 - distance%1000)
      } else {
        this.angle += -10/(angle*distance)
      }
      if (distance < 20) {
        avoid = true
      }
    }
    return avoid
  }

  collisionWall(direction) {
    for(var t = 1; t < 50; t+=1) {
      var x_test = this.x + t * Math.sin((this.angle+10*direction) * Math.PI / 180)
      var y_test = this.y + t * -Math.cos((this.angle+10*direction) * Math.PI / 180)
      if (this.checkWalls(x_test, y_test)) {
        return t
      }
    }
    return false
  }

  collisionBoid(direction, boidList) {
    for(var t = 1; t < 50; t+=1) {
      var x_test = this.x + t * Math.sin((this.angle+10*direction) * Math.PI / 180)
      var y_test = this.y + t * -Math.cos((this.angle+10*direction) * Math.PI / 180)
      if (this.checkBoids(x_test, y_test, boidList)) {
        return t
      }
    }
    return false
  }

  checkWalls(x_test, y_test) {
    if(x_test < 0 || x_test > 900 || y_test < 0 || y_test > 600) {
      return true
    }
  }

  checkBoids(x_test, y_test, boidList) {
    for(var i = 0; i < boidList.length; i++) {
      if(this.id !== i && (x_test - boidList[i].x)**2 + (y_test - boidList[i].y)**2 < 30**2) {
        if (!this.isSimilarPath(boidList[i])) { return boidList[i] }
      }
    }
  }

  isSimilarPath(boid) {
    if (this.angle + 5 > boid.angle || this.angle - 5 < boid.angle) {
      return false
    }
    if (this.speed + 0.1 > boid.speed || this.speed - 0.1 < boid.speed) {
      return false
    }
    return true
  }
}

module.exports.createBoids = createBoids