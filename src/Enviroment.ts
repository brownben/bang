import { Primitive, PrimitiveNull } from './primitives'
import BangError from './BangError'

type EnviromentVariable = { value: Primitive; constant: boolean }

export class Enviroment {
  private values: Record<string, EnviromentVariable> = {}
  private enclosing: Enviroment | null = null

  constructor(enclosing?: Enviroment) {
    if (enclosing) this.enclosing = enclosing
  }

  define(name: string, constant: boolean, value: Primitive): void {
    if (name === '_') return

    if (this.existsInCurrrentScope(name))
      throw new BangError(`Variable Already "${name}" Exists `)

    this.values[name] = { value, constant }
  }

  get(name: string): Primitive {
    if (name === '_') return new PrimitiveNull()
    else if (this.values[name]) return this.values[name]?.value
    else if (this.enclosing != null) return this.enclosing.get(name)
    else throw new BangError(`Unknown Variable "${name}"`)
  }

  exists(name: string): EnviromentVariable {
    if (!this.existsInCurrrentScope(name) && this.enclosing !== null)
      return this.enclosing.exists(name)
    else return this.getFromCurrrentScope(name)
  }

  existsInCurrrentScope(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.values, name)
  }

  getFromCurrrentScope(name: string): EnviromentVariable {
    return this.values[name]
  }

  assign(name: string, value: Primitive): void {
    if (name === '_') return

    const valueInCurrentScope = this.getFromCurrrentScope(name)
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
}
