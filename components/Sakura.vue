<template>
  <canvas ref="canvas" class="sakura-canvas" />
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

  class Sakura {
    x: number
    y: number
    size: number
    speed: number
    angle: number
    spin: number

    constructor() {
      this.x = Math.random() * width
      this.y = Math.random() * height - height
      this.size = Math.random() * 20 + 15
      this.speed = Math.random() * 2 + 1
      this.angle = Math.random() * Math.PI * 2
      this.spin = Math.random() < 0.5 ? -1 : 1
    }

    update() {
      this.y += this.speed
      this.x += this.spin * Math.sin(this.angle)
      this.angle += 0.03

      if (this.y > height) {
        this.y = -this.size
        this.x = Math.random() * width
      }
    }

    draw() {
      if (!ctx) return
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      // A simple cherry blossom petal shape
      ctx.quadraticCurveTo(this.size / 2, this.size / 4, this.size, 0)
      ctx.quadraticCurveTo(this.size / 2, -this.size / 4, 0, 0)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255, 192, 203, 0.7)' // Pink
      ctx.fill()
      ctx.restore()
    }
  }

  const sakuraPetals: Sakura[] = []
  for (let i = 0; i < 50; i++) {
    sakuraPetals.push(new Sakura())
  }

  function loop() {
    animationFrameId = requestAnimationFrame(loop)
    if (!ctx || !canvasEl) return

    ctx.clearRect(0, 0, width, height)

    sakuraPetals.forEach(petal => {
      petal.update()
      petal.draw()
    })
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
.sakura-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
