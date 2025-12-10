<template>
  <canvas ref="canvas" class="fireworks-canvas" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

let animationFrameId: number

onMounted(() => {
  const canvasEl = canvas.value
  if (!canvasEl) return

  const ctx = canvasEl.getContext('2d')
  if (!ctx) return

  let width = (canvasEl.width = window.innerWidth)
  let height = (canvasEl.height = window.innerHeight)

  const fireworks: Firework[] = []
  const particles: Particle[] = []

  function random(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  class Firework {
    x: number
    y: number
    sx: number
    sy: number
    tx: number
    ty: number
    distanceToTarget: number
    distanceTraveled: number
    coordinates: [number, number][] = []
    coordinateCount = 3

    constructor(sx: number, sy: number, tx: number, ty: number) {
      this.x = sx
      this.y = sy
      this.sx = sx
      this.sy = sy
      this.tx = tx
      this.ty = ty
      this.distanceToTarget = Math.sqrt(
        Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2)
      )
      this.distanceTraveled = 0
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y])
      }
    }

    update(index: number) {
      this.coordinates.pop()
      this.coordinates.unshift([this.x, this.y])

      const angle = Math.atan2(this.ty - this.sy, this.tx - this.sx)
      const speed = 5
      this.x += Math.cos(angle) * speed
      this.y += Math.sin(angle) * speed

      this.distanceTraveled = Math.sqrt(
        Math.pow(this.x - this.sx, 2) + Math.pow(this.y - this.sy, 2)
      )

      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty)
        fireworks.splice(index, 1)
      }
    }

    draw() {
      if (!ctx) return
      ctx.beginPath()
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      )
      ctx.lineTo(this.x, this.y)
      ctx.strokeStyle = 'hsl(' + random(0, 360) + ', 100%, 50%)'
      ctx.stroke()
    }
  }

  class Particle {
    x: number
    y: number
    angle: number
    speed: number
    friction = 0.95
    gravity = 1
    hue: number
    brightness: number
    alpha = 1
    decay = random(0.015, 0.03)
    coordinates: [number, number][] = []
    coordinateCount = 5

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.angle = random(0, Math.PI * 2)
      this.speed = random(1, 10)
      this.hue = random(0, 360)
      this.brightness = random(50, 70)
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y])
      }
    }

    update(index: number) {
      this.coordinates.pop()
      this.coordinates.unshift([this.x, this.y])
      this.speed *= this.friction
      this.x += Math.cos(this.angle) * this.speed
      this.y += Math.sin(this.angle) * this.speed + this.gravity
      this.alpha -= this.decay

      if (this.alpha <= this.decay) {
        particles.splice(index, 1)
      }
    }

    draw() {
      if (!ctx) return
      ctx.beginPath()
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      )
      ctx.lineTo(this.x, this.y)
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`
      ctx.stroke()
    }
  }

  function createParticles(x: number, y: number) {
    let particleCount = 30
    while (particleCount--) {
      particles.push(new Particle(x, y))
    }
  }

  function loop() {
    animationFrameId = requestAnimationFrame(loop)
    if (!ctx || !canvasEl) return

    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'

    let i = fireworks.length
    while (i--) {
      fireworks[i].draw()
      fireworks[i].update(i)
    }

    let j = particles.length
    while (j--) {
      particles[j].draw()
      particles[j].update(j)
    }

    if (Math.random() < 0.05) {
      fireworks.push(new Firework(width / 2, height, random(0, width), random(0, height / 2)))
    }
  }

  function handleResize() {
    if (!canvasEl) return
    width = canvasEl.width = window.innerWidth
    height = canvasEl.height = window.innerHeight
  }

  window.addEventListener('resize', handleResize)

  loop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.fireworks-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
