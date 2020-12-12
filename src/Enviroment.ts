import { Literal, LiteralNull } from './literals'
import BangError from './BangError'

export type EnviromentVariables = {
  [key: string]: { value: Literal; constant: boolean }
}

export class Enviroment {
  private values: EnviromentVariables = {}

  define(name: string, constant: boolean, value?: Literal) {
    if (this.exists(name))
      throw new BangError(`Variable Already "${name}" Exists `)

    if (value) this.values[name] = { value, constant }
    else this.values[name] = { value: new LiteralNull(), constant }
  }

  get(name: string) {
    if (this.values[name]) return this.values[name]?.value
    else throw new BangError(`Unknown Variable "${name}"`)
  }

  exists(name: string) {
    return this.values[name]
  }

  assign(name: string, value: Literal) {
    const exisitingValue = this.exists(name)

    if (exisitingValue && !exisitingValue.constant)
      this.values[name] = { value, constant: false }
    else if (exisitingValue)
      throw new BangError(
        `Variable "${name}" is Constant and can't be redefined`
      )
    else throw new BangError(`Variable "${name}" is not defined`)
  }

  getValues() {
    return this.values
  }
}
