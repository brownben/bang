export default class BangError extends Error {
  message: string
  line: number

  constructor(message: string, line?: number) {
    super(message)
    this.message = message
    this.line = line ?? 0
  }
}
