import { Token } from '../tokens'
import { Stmt } from './Stmt'
import { PrimitiveDictionary, PrimitiveNull } from '../primitives'
import { Enviroment } from '../Enviroment'
import { getBuiltInFunction } from '../library'
import BangError from '../BangError'

export class StmtImport extends Stmt {
  name: string
  as: string
  destructured?: { actual: string; renamed: string }[]
  token: Token
  constructor(
    moduleName: string,
    {
      token,
      as,
      destructured,
    }: {
      token: Token
      as?: string
      destructured?: { actual: string; renamed: string }[]
    }
  ) {
    super()
    this.name = moduleName
    this.as = as ?? moduleName
    this.destructured = destructured
    this.token = token
  }

  execute(enviroment: Enviroment): null {
    const importedModule = getBuiltInFunction(
      this.name,
      enviroment.getExternalIO()
    )

    if (!importedModule)
      throw new BangError(
        `Unknown library ${this.name}, only builtin libraries can be imported currently`,
        this.token.line
      )

    if (!this.destructured) enviroment.define(this.as, true, importedModule)
    else {
      const rawDictionary =
        importedModule instanceof PrimitiveDictionary
          ? importedModule.dictionary
          : {}

      this.destructured.forEach((value) =>
        enviroment.define(
          value.renamed,
          true,
          rawDictionary?.[value.actual] ?? new PrimitiveNull()
        )
      )
    }

    return null
  }
}
