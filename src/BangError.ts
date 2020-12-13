export default class BangError {
  message: string
  source: string[]
  line: number

  constructor(message: string, code?: string, line?: number) {
    this.message = message
    this.source = code?.split('\n') ?? []
    this.line = line ?? 0
  }

  output(): void {
    console.log(`Error: ${this.message}`)
    if (this.source && this.line !== 0) {
      console.log(`   ${this.line - 1} | ${this.source[this.line - 2]}`)
      console.log(`   ${this.line} | ${this.source[this.line - 1]}`)
      console.log(`   ${this.line + 1} | ${this.source[this.line]}`)
    }
  }
}
