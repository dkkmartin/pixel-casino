import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameLoop } from '../game/core/GameLoop'
import { Canvas } from '../game/core/Canvas'

describe('GameLoop', () => {
  let gameLoop: GameLoop
  let canvas: Canvas

  beforeEach(() => {
    // Mock canvas element
    const mockCanvas = document.createElement('canvas')
    mockCanvas.id = 'game-canvas'
    document.body.appendChild(mockCanvas)

    canvas = new Canvas(800, 600)
    gameLoop = new GameLoop(canvas)
  })

  it('should start game loop', () => {
    const spy = vi.spyOn(window, 'requestAnimationFrame')
    gameLoop.start()
    expect(spy).toHaveBeenCalled()
  })

  it('should stop game loop', () => {
    const spy = vi.spyOn(window, 'cancelAnimationFrame')
    gameLoop.start()
    gameLoop.stop()
    expect(spy).toHaveBeenCalled()
  })

  it('should not start multiple loops', () => {
    const spy = vi.spyOn(window, 'requestAnimationFrame')
    gameLoop.start()
    gameLoop.start() // Try to start again
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
