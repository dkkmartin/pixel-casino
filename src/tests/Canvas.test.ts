import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Canvas } from '../game/core/Canvas'

describe('Canvas', () => {
  let mockCanvas: HTMLCanvasElement
  let mockContext: CanvasRenderingContext2D

  beforeEach(() => {
    // Mock canvas element
    mockCanvas = document.createElement('canvas')
    mockCanvas.id = 'game-canvas'
    document.body.appendChild(mockCanvas)

    // Mock context
    mockContext = mockCanvas.getContext('2d')!
  })

  it('should initialize with correct dimensions', () => {
    const canvas = new Canvas(800, 600)
    const dims = canvas.getDimensions()
    expect(dims.width).toBe(800)
    expect(dims.height).toBe(600)
  })

  it('should clear canvas correctly', () => {
    const canvas = new Canvas(800, 600)
    // Access private ctx property using type assertion
    const spy = vi.spyOn(canvas['ctx'], 'clearRect')
    canvas.clear()
    expect(spy).toHaveBeenCalledWith(0, 0, 800, 600)
  })

  it('should resize canvas correctly', () => {
    const canvas = new Canvas(800, 600)
    canvas.resizeCanvas(1024, 768)
    const dims = canvas.getDimensions()
    expect(dims.width).toBe(1024)
    expect(dims.height).toBe(768)
  })
})
