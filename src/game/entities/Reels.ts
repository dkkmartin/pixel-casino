interface ReelSymbol {
  id: string
  texture: string
  weight: number
  payout: {
    double: number
    triple: number
  }
}

interface ReelConfig {
  numberOfReels: number
  symbolsPerReel: number
}

export default class Reels {
  private symbols: ReelSymbol[]
  public reelStrips: ReelSymbol[][]
  private reelPositions: number[]
  private isSpinning: boolean
  private config: ReelConfig

  constructor(config: ReelConfig) {
    this.config = config
    this.reelPositions = new Array(config.numberOfReels).fill(0)
    this.isSpinning = false
    this.symbols = []
    this.reelStrips = []
  }

  private createReelStrips(): ReelSymbol[][] {
    // Create an array of symbols for each reel
    return Array(this.config.numberOfReels)
      .fill(null)
      .map(() => {
        // Create a strip of symbols based on weights
        return Array(this.config.symbolsPerReel)
          .fill(null)
          .map(() => this.getRandomSymbol())
      })
  }

  private getRandomSymbol(): ReelSymbol {
    // Calculate total weight
    const totalWeight = this.symbols.reduce(
      (sum, symbol) => sum + symbol.weight,
      0
    )

    // Get random value between 0 and total weight
    let random = Math.random() * totalWeight

    // Find the symbol based on weight
    for (const symbol of this.symbols) {
      random -= symbol.weight
      if (random <= 0) {
        return symbol
      }
    }

    return this.symbols[0] // Fallback
  }

  spin() {
    this.isSpinning = true
    this.reelPositions = this.reelPositions.map(() =>
      Math.floor(Math.random() * this.config.symbolsPerReel)
    )
    this.stop()
  }

  stop() {
    this.isSpinning = false
    console.log('Final result:', this.getResults())
  }

  setSymbols(symbols: ReelSymbol[]) {
    this.symbols = symbols
    this.reelStrips = this.createReelStrips()
  }

  getResults() {
    return this.reelStrips.map((strip, reelIndex) => {
      const position = this.reelPositions[reelIndex]
      return strip[position]
    })
  }

  get getSymbols() {
    return this.symbols
  }
}
