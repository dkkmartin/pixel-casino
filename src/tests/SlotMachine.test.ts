import { describe, it, expect, beforeEach, vi } from 'vitest'
import SlotMachine from '../game/entities/SlotMachine'

describe('SlotMachine', () => {
  const machine = new SlotMachine()
  describe('Initialization Tests', () => {
    it('should create a slot machine with default credits', () => {
      expect(machine.getCredits()).toBe(1000)
    })
    it('should have default bet amount of 10 or higher', () => {
      expect(machine.getCurrentBet()).toBeGreaterThanOrEqual(10)
    })
    it('should have 3 reels', () => {
      expect(machine.getReels().length).toBe(3)
    })
  })

  describe('Betting system tests', () => {
    it('should throw specific error on bet below minimum', () => {
      expect(() => machine.placeBet(5)).toThrow(
        `Bet must be at least ${machine.getMinBet()} credits`
      )
    })

    it('should throw specific error on bet above maximum', () => {
      expect(() => machine.placeBet(1000)).toThrow(
        `Bet cannot exceed ${machine.getMaxBet()} credits`
      )
    })

    it('should throw specific error if insufficient credits', () => {
      const poorMachine = new SlotMachine(5)
      expect(() => poorMachine.placeBet(10)).toThrow('Insufficient credits')
    })
  })

  describe('Spinning tests', () => {
    beforeEach(() => {
      machine.placeBet(10)
    })

    it('should update reel positions', () => {
      const initialPositions = machine
        .getReels()
        .map((reel) => reel.currentPosition)
      machine.spin()
      const newPositions = machine
        .getReels()
        .map((reel) => reel.currentPosition)
      expect(newPositions).not.toEqual(initialPositions)
    })
  })

  it('should return array of 3 symbols', () => {
    const result = machine.spin()
    expect(result.length).toBe(3)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('name')
    expect(result[0]).toHaveProperty('value')
  })

  describe('Winning calculations', () => {
    let testMachine: SlotMachine

    beforeEach(() => {
      testMachine = new SlotMachine()
      testMachine.placeBet(10) // Place minimum bet
    })

    it('should pay 10x for three matching symbols', () => {
      // Mock three cherries (value 10)
      const symbols = testMachine.getSymbols()

      const threeMatching = [symbols.CHERRY, symbols.CHERRY, symbols.CHERRY]

      // Override random selection
      vi.spyOn(testMachine as any, 'getRandomSymbolsFromReels').mockReturnValue(
        threeMatching
      )

      const initialCredits = testMachine.getCredits()
      testMachine.spin()

      // Expected: symbol value (10) * bet (10) * multiplier (10) = 1000
      expect(testMachine.getCredits()).toBe(initialCredits + 1000)
    })

    it('should pay 2x for two matching symbols', () => {
      // Two cherries and one different
      const symbols = testMachine.getSymbols()

      const twoMatching = [symbols.CHERRY, symbols.CHERRY]

      vi.spyOn(testMachine as any, 'getRandomSymbolsFromReels').mockReturnValue(
        twoMatching
      )

      const initialCredits = testMachine.getCredits()
      testMachine.spin()

      // Expected: symbol value (10) * bet (10) * multiplier (2) = 200
      expect(testMachine.getCredits()).toBe(initialCredits + 200)
    })

    it('should pay nothing for no matches', () => {
      const symbols = testMachine.getSymbols()

      const noMatches = [symbols.CHERRY, symbols.BELL, symbols.BAR]

      vi.spyOn(testMachine as any, 'getRandomSymbolsFromReels').mockReturnValue(
        noMatches
      )

      const initialCredits = testMachine.getCredits()
      testMachine.spin()

      expect(testMachine.getCredits()).toBe(initialCredits)
    })
  })
})
