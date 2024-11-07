import { Application, Assets, Sprite } from 'pixi.js'
import SlotMachine from '../entities/SlotMachine'

export default class Game {
  private app: Application
  private slotMachine

  constructor() {
    this.app = new Application()
    this.slotMachine = new SlotMachine()
  }

  async initialize() {
    this.slotMachine.initialize()
    await this.app.init({ width: 800, height: 600 })
    document.querySelector('#app')?.appendChild(this.app.canvas)
    this.render()
  }

  async render() {
    await Assets.load([
      '/assets/machine/frame_complete.png',
      '/assets/machine/handle_normal.png',
      '/assets/machine/handle_pulled.png',
    ])
    let machineFrameSprite = Sprite.from('/assets/machine/frame_complete.png')
    let machineHandle = Sprite.from('/assets/machine/handle_normal.png')
    let machineHandlePulled = Sprite.from('/assets/machine/handle_pulled.png')
    machineHandle.zIndex = 100
    machineHandlePulled.zIndex = 100
    machineHandle.eventMode = 'static'
    machineHandle.cursor = 'pointer'

    machineHandlePulled.visible = false

    machineHandle.on('pointerdown', () => {
      // Hide normal, show pulled
      machineHandle.visible = false
      machineHandlePulled.visible = true

      // After a delay, switch back
      setTimeout(() => {
        machineHandle.visible = true
        machineHandlePulled.visible = false
        this.onClick()
      }, 500) // 500ms = half second
    })
    this.app.stage.addChild(
      machineHandle,
      machineHandlePulled,
      machineFrameSprite
    )
  }

  onClick() {
    this.slotMachine.spin()
  }

  update() {}
}
