import { Primitive, PrimitiveNull } from './primitives'
import { ExternalIO } from './library'
import BangError from './BangError'

type EnviromentVariable = { value: Primitive; constant: boolean }

export class Enviroment {
  private values: Record<string, EnviromentVariable> = {}
  private enclosing?: Enviroment
  private externalIO?: ExternalIO

  private tracking: boolean = true
  private changed: boolean = true
  private accessed: string[] = []

  constructor(enclosing?: Enviroment, externalIO?: ExternalIO) {
    this.enclosing = enclosing
    this.externalIO = externalIO
  }

  define(name: string, constant: boolean, value: Primitive): void {
    if (name === '_') return

    if (this.existsInCurrrentScope(name))
      throw new BangError(`Variable "${name}" already exists`)

    this.values[name] = { value, constant }
  }

  get(name: string): Primitive {
    if (this.tracking) this.accessed.push(name)

    if (name === '_') return new PrimitiveNull()
    else if (this.values[name]) return this.values[name]?.value
    else if (this.enclosing != null) return this.enclosing.get(name)
    else throw new BangError(`Unknown variable "${name}"`)
  }

  exists(name: string): EnviromentVariable {
    if (!this.existsInCurrrentScope(name) && this.enclosing !== undefined)
      return this.enclosing.exists(name)
    else return this.getFromCurrrentScope(name)
  }

  existsInCurrrentScope(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.values, name)
  }

  getFromCurrrentScope(name: string): EnviromentVariable {
    return this.values[name]
  }

  getExternalIO(): ExternalIO {
    if (this.externalIO) return this.externalIO
    else if (this.enclosing) return this.enclosing?.getExternalIO()
    else return {}
  }

  assign(name: string, value: Primitive): void {
    if (this.accessed.includes(name)) this.changed = true

    if (name === '_') return

    const valueInCurrentScope = this.getFromCurrrentScope(name)
    const valueExists = this.exists(name)

    if (valueInCurrentScope && !valueInCurrentScope.constant)
      this.values[name] = { value, constant: false }
    else if (valueInCurrentScope)
      throw new BangError(
        `Variable "${name}" is constant and can't be redefined`
      )
    else if (valueExists && this.enclosing) this.enclosing?.assign(name, value)
    else throw new BangError(`Variable "${name}" is not defined`)
  }

  track() {
    this.tracking = true
    this.changed = false
    this.accessed = []
  }

  stopTrack() {
    this.tracking = false
  }

  hasTrackedVariablesChanged() {
    return this.changed
  }

  resetChanged() {
    this.changed = false
  }
}
