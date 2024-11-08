export default class Player {
  private money: number

  constructor(amount: number) {
    this.money = amount ? amount : 1000
  }

  public get getMoney(): number {
    return this.money
  }

  addMoney(amount: number): boolean {
    if (amount < 0) return false
    this.money += amount
    return true
  }

  placeBet(amount: number): boolean {
    if (amount <= 0) return false
    if (amount > this.money) return false
    this.money -= amount
    return true
  }
}
