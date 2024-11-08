import Reels from './Reels'

const reelConfig = {
  numberOfReels: 3,
  symbolsPerReel: 10,
}

const symbols = [
  {
    id: 'CHERRY',
    texture: '/assets/symbols/cherry.png',
    weight: 10,
    payout: {
      double: 5,
      triple: 10,
    },
  },
  {
    id: 'BELL',
    texture: '/assets/symbols/bell.png',
    weight: 7,
    payout: {
      double: 10,
      triple: 20,
    },
  },
  {
    id: 'SEVEN',
    texture: '/assets/symbols/seven.png',
    weight: 3,
    payout: {
      double: 25,
      triple: 50,
    },
  },
  {
    id: 'BAR',
    texture: '/assets/symbols/bar.png',
    weight: 0.5,
    payout: {
      double: 50,
      triple: 100,
    },
  },
]

export default class SlotMachine {
  private reels
  private betAmount: number

  constructor() {
    this.reels = new Reels(reelConfig)
    this.betAmount = 10
  }

  initialize() {
    this.reels.setSymbols(symbols)
  }

  setBet(amount: number) {
    this.betAmount = amount
  }

  spin() {
    this.reels.spin()
    this.calculateWin(this.betAmount)
  }

  getReelStrips() {
    return this.reels.reelStrips
  }

  calculateWin(bet: number): number {
    const results = this.reels.getResults()
    const firstSymbol = results[0]
    let matchCount = 1

    // Count matches from left to right
    for (let i = 1; i < results.length; i++) {
      if (results[i].id === firstSymbol.id) {
        matchCount++
      } else {
        break // Stop counting at first non-match
      }
    }

    // Find the winning symbol details
    const winningSymbol = this.reels.getSymbols.find(
      (s) => s.id === firstSymbol.id
    )
    if (!winningSymbol) return 0

    // Calculate payout
    if (matchCount === 3) {
      const win = bet * winningSymbol.payout.triple
      console.log(`Triple match: ${winningSymbol.id} - Win: ${win}`)
      return win
    } else if (matchCount === 2) {
      const win = bet * winningSymbol.payout.double
      console.log(`Double match: ${winningSymbol.id} - Win: ${win}`)
      return win
    }

    console.log('No win')
    return 0
  }
}
