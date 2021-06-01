export default class BangError {
  message: string
  source: string[]
  line: number

  constructor(message: string, line?: number, code?: string) {
    this.message = message
    this.source = code?.split('\n') ?? []
    this.line = line ?? 0
  }

  output(): void {
    console.log(`Error: ${this.message}`)
  }
}
