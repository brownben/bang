import { Expr } from './Expr'
import { Stmt } from '../statements/Stmt'
import { StmtBlock } from '../statements/Block'
import {
  Primitive,
  PrimitiveNull,
  PrimitiveFunction,
  PrimitiveList,
  PrimitiveDictionary,
} from '../primitives'
import { Enviroment } from '../Enviroment'
import BangError from '../BangError'

interface DestructureName {
  actual: string
  renamed: string
}

export class ExprFunction extends Expr {
  arity: number
  parameters: string[] | DestructureName[]
  body: Stmt[]
  spread: boolean

  constructor(
    params: string[] | DestructureName[],
    body: Stmt[],
    lastParameterIsSpread: boolean
  ) {
    super()
    this.parameters = params
    this.spread = lastParameterIsSpread
    this.body = body

    if (params.length === 0 || typeof params?.[0] === 'string')
      this.arity = params.length - Number(this.spread)
    else this.arity = 1
  }

  async evaluate(
    enviroment: Enviroment,
    name?: string
  ): Promise<PrimitiveFunction> {
    const arity = this.arity
    const enviromentCopy = enviroment

    const addListParameters = (
      functionEnviroment: Enviroment,
      argument: Primitive[],
      parameters: string[]
    ) => {
      parameters.forEach((parameter, index) => {
        if ((this.spread && index !== this.arity) || !this.spread)
          functionEnviroment.define(parameter, true, argument[index])
      })

      if (this.spread)
        functionEnviroment.define(
          parameters[this.arity],
          true,
          new PrimitiveList({ values: argument.slice(this.arity) })
        )
    }

    const addDictionaryParameters = (
      functionEnviroment: Enviroment,
      argument: Primitive[],
      parameters: DestructureName[]
    ) => {
      if (
        argument.length !== 1 ||
        !(argument[0] instanceof PrimitiveDictionary)
      )
        throw new BangError(
          `Cannot transform type "${argument[0].type}" into a dictionary`,
          argument[0].token?.line
        )

      const dictionary = argument[0] as PrimitiveDictionary

      for (const { actual, renamed } of parameters) {
        const value = dictionary.getValueForKey(actual) ?? new PrimitiveNull()
        functionEnviroment.define(renamed, true, value)
      }
    }

    const call = async (argument: Primitive[]) => {
      const functionEnviroment = new Enviroment(enviromentCopy)

      if (
        this.parameters.length === 0 ||
        typeof this.parameters?.[0] === 'string'
      )
        addListParameters(
          functionEnviroment,
          argument,
          this.parameters as string[]
        )
      else
        addDictionaryParameters(
          functionEnviroment,
          argument,
          this.parameters as DestructureName[]
        )

      const block = new StmtBlock(this.body)
      await block.execute(functionEnviroment)
      return new PrimitiveNull()
    }

    return new PrimitiveFunction({ name, call, arity, spread: this.spread })
  }
}
