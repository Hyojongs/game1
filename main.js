const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0
    const image = new Image()
    image.src = './img/pekora.png'
    image.onload = () => {
      const scale = 0.5
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 100
      }
    }

  }
  draw() {

    c.save()

    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    )

    c.rotate(this.rotation)

    c.translate(
      -player.position.x + player.width / 2,
      -player.position.y + player.height / 2
    )

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )

    c.restore()
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
    }
  }
}


class Invader {
  constructor({position}) {
    this.velocity = {
      x: 0,
      y: 0
    }
    const image = new Image()
    image.src = './img/usagi.png'
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: position.x,
        y: position.y
      }
    }

  }
  draw() {

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update({velocity}) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }
}



class Projectile {
  constructor({
    position,
    velocity
  }) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'orange'
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}


class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 5,
      y: 0
    }

    this.invaders = []

    const rows = Math.floor(Math.random() * 8 + 3)
    const colums = Math.floor(Math.random() * 5 + 2)

    this.width = colums * 20

    for (let x = 0; x < colums; x++){
     for (let y = 0; y < rows; y++){
      this.invaders.push(new Invader({position : {
        x : x * 45 ,
        y : y * 50
      }}))
    }
  }
    console.log(this.invaders)
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

    if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}



const player = new Player()
const projectiles = []
const grids = [new Grid]
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  },
}


function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  player.update()
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    } else {
      projectile.update()
    }
  })

  grids.forEach((grid) => {
    grid.update()
    grid.invaders.forEach(invader => {
      invader.update({velocity : grid.velocity})
    })
  })

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7
    player.rotation = -0.05
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 7
    player.rotation = 0.05
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }
}

animate()

addEventListener('keydown', ({
  key
}) => {
  switch (key) {
    case 'a':
      keys.a.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
    case ' ':
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width + 25,
            y: player.position.y + player.height
          },
          velocity: {
            x: 0,
            y: -8
          }

        }))

      console.log(projectiles)
      break
  }
})

addEventListener('keyup', ({
  key
}) => {
  switch (key) {
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case ' ':
      break
  }
})