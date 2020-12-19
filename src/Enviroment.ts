import { Literal, LiteralNull } from './literals'
import BangError from './BangError'

type EnviromentVariable = { value: Literal; constant: boolean }
export type EnviromentVariables = {
  [key: string]: EnviromentVariable
}

export class Enviroment {
  private values: EnviromentVariables = {}
  private enclosing: Enviroment | null = null

  constructor(enclosing?: Enviroment) {
    if (enclosing) this.enclosing = enclosing
  }

  define(name: string, constant: boolean, value?: Literal): void {
    if (name === '_') return

    if (this.existsInCurrentScope(name))
      throw new BangError(`Variable Already "${name}" Exists `)

    if (value) this.values[name] = { value, constant }
    else this.values[name] = { value: new LiteralNull(), constant }
  }

  get(name: string): Literal {
    if (name === '_') return new LiteralNull()
    else if (this.values[name]) return this.values[name]?.value
    else if (this.enclosing != null) return this.enclosing.get(name)
    else throw new BangError(`Unknown Variable "${name}"`)
  }

  exists(name: string): EnviromentVariable {
    if (!this.values[name] && this.enclosing !== null)
      return this.enclosing.exists(name)
    else return this.existsInCurrentScope(name)
  }

  existsInCurrentScope(name: string): EnviromentVariable {
    return this.values[name]
  }

  assign(name: string, value: Literal): void {
    if (name === '_') return

    const valueInCurrentScope = this.existsInCurrentScope(name)
    const valueExists = this.exists(name)

    if (valueInCurrentScope && !valueInCurrentScope.constant)
      this.values[name] = { value, constant: false }
    else if (valueInCurrentScope)
      throw new BangError(
        `Variable "${name}" is Constant and can't be redefined`
      )
    else if (valueExists && this.enclosing) this.enclosing?.assign(name, value)
    else throw new BangError(`Variable "${name}" is not defined`)
  }

  clone(): Enviroment {
    const newEnviroment = new Enviroment(this.enclosing?.clone())
    for (const [name, value] of Object.entries(this.values))
      newEnviroment.define(name, value.constant, value.value)

    return newEnviroment
  }
}
