
function createBoids(number) {
  var boidList = []
  for(var i = 0; i < number; i++) {
    boidList.push(new Boid(Math.random()*800, Math.random()*600, Math.random()*360, 1+Math.random()*1, i))
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
    if (!this.avoidWall()) {
      if (!this.avoidBoid(boidList)) {
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

  avoidWall() {
    var avoid = false
    for(var angle = -1; angle >= -8; angle--) {
      var distance = this.collisionWall(angle)
      this.angle += -100/(angle*distance)
      if (distance < 20) {
        avoid = true
      }
      // this.speed += 1/1000 * (1 - (distance%1000)/5000)
    }
    for(var angle = 1; angle <= 8; angle++) {
      var distance = this.collisionWall(angle)
      this.angle += -100/(angle*distance)
      if (distance < 20) {
        avoid = true
      }
      // this.speed += 1/1000 * (1 - (distance%1000)/5000)
    }
    return avoid
    // var distanceLeft1 = this.collisionWall(-1)
    // var distanceRight1 = this.collisionWall(1)
    // var distanceLeft2 = this.collisionWall(-4)
    // var distanceRight2 = this.collisionWall(4)
    // var distance = this.collisionWall(0)
    // this.speed += 0.002 - (distance%1000)/5000
    // this.angle += 1000*((1/distanceLeft1)**2 + (0.5/distanceLeft2)**2 - (1/distanceRight1)**2 - (0.5/distanceRight2)**2)
    // if (distance + distanceLeft1 + distanceLeft2 + distanceRight1 + distanceRight2 !== 5000) {
    //   return true
    // } else {
    //   return false
    // }
  }

  avoidBoid(boidList) {
    var avoid = false
    for(var angle = -1; angle >= -8; angle--) {
      var distance = this.collisionBoid(angle, boidList)
      this.angle += -10/(angle*distance)
      // this.speed += 1/1000 * (1 - (distance%1000)/5000)
      if (distance < 10) {
        avoid = true
      }
    }
    for(var angle = 1; angle <= 8; angle++) {
      var distance = this.collisionBoid(angle, boidList)
      this.angle += -10/(angle*distance)
      // this.speed += 1/1000 * (1 - (distance%1000)/5000)
      if (distance < 10) {
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
    return 1000
  }

  collisionBoid(direction, boidList) {
    for(var t = 1; t < 50; t+=1) {
      var x_test = this.x + t * Math.sin((this.angle+10*direction) * Math.PI / 180)
      var y_test = this.y + t * -Math.cos((this.angle+10*direction) * Math.PI / 180)
      if (this.checkBoids(x_test, y_test, boidList)) {
        return t
      }
    }
    return 1000
  }

  checkWalls(x_test, y_test) {
    if(x_test < 0 || x_test > 900 || y_test < 0 || y_test > 600) {
      return true
    }
  }

  checkBoids(x_test, y_test, boidList) {
    for(var i = 0; i < boidList.length; i++) {
      if(this.id !== i && (x_test - boidList[i].x)**2 + (y_test - boidList[i].y)**2 < 30**2) {
        return true
      }
    }
  }
}

// checkOutOfBounds(x_test, y_test, boidList) {
//   if(x_test < 0 || x_test > 800 || y_test < 0 || y_test > 600) {
//     return true
//   }
//   for(var i = 0; i < boidList.length; i++) {
//     if(this.id !== i && (x_test - boidList[i].x)**2 + (y_test - boidList[i].y)**2 < 20**2) {
//       console.log(this.x, boidList[i].x, i, this.id, "boid collision")
//       return true
//     }
//   }
// }

module.exports.createBoids = createBoids