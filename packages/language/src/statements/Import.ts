import { Token } from '../tokens'
import { Stmt } from './Stmt'
import { PrimitiveDictionary, PrimitiveNull } from '../primitives'
import { Enviroment } from '../Enviroment'
import { ExternalIO, getBuiltInFunction } from '../library'
import { Interpreter } from '../Interpreter'
import { getTokens } from '../tokens'
import { getAbstractSyntaxTree } from '../Parser'
import BangError from '../BangError'

const execute = async (source: string, externalIO: ExternalIO) => {
  const interpreter = new Interpreter(externalIO)

  const tokens = getTokens(source)
  const abstractSyntaxTree = getAbstractSyntaxTree(tokens, source)

  await interpreter.run(abstractSyntaxTree)

  return interpreter.getExports()
}

const getNameFromPath = (path: string): string | undefined =>
  path.match(/(.*)\/([_a-zA-Z][_a-zA-Z0-9]*)\.(.*)/)?.[2]

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
    this.as = as ?? getNameFromPath(this.name) ?? moduleName
    this.destructured = destructured
    this.token = token
  }

  async execute(enviroment: Enviroment) {
    const externalIO = enviroment.getExternalIO()
    let importedModule = getBuiltInFunction(this.name, enviroment)

    if (!importedModule) {
      if (!externalIO.importer)
        throw new BangError(
          `No external modules can be imported, as no importer is defined`,
          this.token.line
        )

      let file
      try {
        file = await externalIO.importer(this.name)
      } catch {
        throw new BangError(`Problem loading file "${this.name}"`)
      }

      importedModule = (await execute(file, externalIO)) ?? new PrimitiveNull()
    }

    if (!this.destructured) enviroment.define(this.as, true, importedModule)
    else {
      const rawDictionary =
        importedModule instanceof PrimitiveDictionary
          ? importedModule.dictionary
          : { default: importedModule }

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
