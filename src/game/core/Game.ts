import { Application, Assets, Container, Sprite } from 'pixi.js'
import SlotMachine from '../entities/SlotMachine'

export default class Game {
  private app: Application
  private slotMachine: SlotMachine
  private reelContainers: Container[] = []
  private reelsParentContainer: Container
  private mainContainer: Container

  constructor() {
    this.app = new Application()
    this.slotMachine = new SlotMachine()
    this.mainContainer = new Container()
    this.reelsParentContainer = new Container()
  }

  async initialize() {
    this.slotMachine.initialize()
    await this.app.init({
      width: 800,
      height: 600,
      backgroundColor: '#073601',
    })
    document.querySelector('#app')?.appendChild(this.app.canvas)
    await this.render()
  }

  private async loadAssets() {
    await Assets.load([
      '/assets/machine/frame_complete.png',
      '/assets/machine/handle_normal.png',
      '/assets/machine/handle_pulled.png',
      '/assets/symbols/cherry.png',
      '/assets/symbols/bell.png',
      '/assets/symbols/seven.png',
      '/assets/symbols/bar.png',
    ])
  }

  private setupMachineFrame() {
    const machineFrame = Sprite.from('/assets/machine/frame_complete.png')
    const handleNormal = Sprite.from('/assets/machine/handle_normal.png')
    const handlePulled = Sprite.from('/assets/machine/handle_pulled.png')

    // Setup handle properties
    handleNormal.zIndex = 100
    handlePulled.zIndex = 100
    handleNormal.eventMode = 'static'
    handleNormal.cursor = 'pointer'
    handlePulled.visible = false

    // Add event listener to handle
    handleNormal.on('pointerdown', () => {
      handleNormal.visible = false
      handlePulled.visible = true

      setTimeout(() => {
        handleNormal.visible = true
        handlePulled.visible = false
        this.onHandlePull()
      }, 500)
    })

    this.mainContainer.addChild(machineFrame, handleNormal, handlePulled)
  }

  private createReelContainers() {
    // Create containers for each reel
    this.reelContainers = Array(3)
      .fill(null)
      .map(() => new Container())

    // Position each reel container relative to each other
    this.reelContainers.forEach((container, index) => {
      container.x = index * 130 // Now relative to parent container
      container.zIndex = 200
      this.reelsParentContainer.addChild(container)
    })

    // Position the parent container to align with the frame
    this.reelsParentContainer.x = this.app.screen.width / 3.4
    this.reelsParentContainer.y = this.app.screen.height / 2
  }

  private createReelSymbols() {
    const reelStrips = this.slotMachine.getReelStrips()

    this.reelContainers.forEach((reelContainer, reelIndex) => {
      const strip = reelStrips[reelIndex]

      strip.forEach((symbol, symbolIndex) => {
        const sprite = Sprite.from(symbol.texture)
        sprite.y = symbolIndex * (sprite.height + 10) // Add some padding between symbols
        reelContainer.addChild(sprite)
      })
    })
  }

  private onHandlePull() {
    this.slotMachine.spin()
    // TODO: Add spinning animation
  }

  async render() {
    await this.loadAssets()

    // Enable sorting for main stage
    this.app.stage.sortableChildren = true

    // Setup machine components first
    this.setupMachineFrame()
    this.createReelContainers()
    this.createReelSymbols()

    // Add containers to stage after setup
    this.app.stage.addChild(this.mainContainer, this.reelsParentContainer)
  }
}
