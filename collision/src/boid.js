
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
    var distanceLeft1 = this.collision(-1, boidList)
    var distanceRight1 = this.collision(1, boidList)
    var distanceLeft2 = this.collision(-2, boidList)
    var distanceRight2 = this.collision(2, boidList)
    var distance = this.collision(0, boidList)
    // boidList.forEach(boid => {
    //   if(this === boid) {
    //     return true
    //   }
    //   var distance = ((boid.x - this.x)**2 + (boid.y - this.y)**2)**0.5
    //   if( distance < 50 ) {
    //     this.angle += Math.sin((this.angle - boid.angle + 180) * Math.PI / 180)*10/(distance)**0.5
    //     this.angle = (this.angle+360)%360
    //     this.speed += (boid.speed - this.speed)/(distance)**0.5
    //   }
    // });
    // // boid.speed += (Math.random() - 0.4) * 0.1
    this.angle += (Math.random() - 0.5) * 1
    this.speed += 0.001 - (distance%1000)/5000
    if(this.speed < 0.05) this.speed = 0.05
    this.angle += ((50/distanceLeft1)**2 + (50/distanceLeft2)**2 - (50/distanceRight1)**2 - (50/distanceRight2)**2)
    this.angle = (this.angle+360)%360
    this.x += this.speed * Math.sin(this.angle * Math.PI / 180)
    this.y += this.speed * -Math.cos(this.angle * Math.PI / 180)
    // this.x = (this.x+800)%800
    // this.y = (this.y+600)%600
  }

  collision(direction, boidList) {
    for(var t = 2; t < 30; t+=2) {
      var x_test = this.x + t * Math.sin((this.angle+30*direction) * Math.PI / 180)
      var y_test = this.y + t * -Math.cos((this.angle+30*direction) * Math.PI / 180)
      var outOfBounds = this.checkOutOfBounds(x_test, y_test, boidList)
      if (outOfBounds) {
        return t * outOfBounds
      }
    }
    return 1000
  }

  checkOutOfBounds(x_test, y_test, boidList) {
    if(x_test < 0 || x_test > 800 || y_test < 0 || y_test > 600) {
      return 1
    }
    for(var i = 0; i < boidList.length; i++) {
      if(this.id !== i && (x_test - boidList[i].x)**2 + (y_test - boidList[i].y)**2 < 20**2) {
        return 3
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