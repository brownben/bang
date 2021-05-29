import {
  readFileSync,
  existsSync,
  writeFileSync,
  appendFileSync,
  rmSync,
  copyFileSync,
  mkdirSync,
  rmdirSync,
  readdirSync,
} from 'fs'
import {
  Primitive,
  PrimitiveBoolean,
  PrimitiveDictionary,
  PrimitiveFunction,
  PrimitiveList,
  PrimitiveNull,
  PrimitiveString,
} from '../primitives'
import BangError from '../BangError'

const fileFunction = <T>(func: (argument: Primitive[]) => T) => {
  // TODO: throw error if used in browser build
  return func
}

export const file = new PrimitiveDictionary({
  immutable: true,

  keyValues: {
    read: new PrimitiveFunction({
      name: 'file.read',
      arity: 1,
      call: fileFunction((argument: Primitive[]) => {
        const [filePath] = argument

        if (!(filePath instanceof PrimitiveString))
          throw new BangError('Expected a string')

        try {
          return new PrimitiveString(
            readFileSync(filePath.getValue(), { encoding: 'utf-8' })
          )
        } catch {
          throw new BangError('Problem Reading File')
        }
      }),
    }),

    exists: new PrimitiveFunction({
      name: 'file.exists',
      arity: 1,
      call: fileFunction((argument: Primitive[]) => {
        const [filePath] = argument

        if (!(filePath instanceof PrimitiveString))
          throw new BangError('Expected a string')

        return new PrimitiveBoolean(existsSync(filePath.getValue()))
      }),
    }),

    write: new PrimitiveFunction({
      name: 'file.write',
      arity: 2,
      spread: true,
      call: fileFunction((argument: Primitive[]) => {
        const [filePath, fileContents] = argument

        if (!(filePath instanceof PrimitiveString))
          throw new BangError('Expected path to be a string')
        if (!(fileContents instanceof PrimitiveString))
          throw new BangError('Expected file contents to be a string')

        try {
          writeFileSync(filePath.getValue(), fileContents.getValue())
          return new PrimitiveNull()
        } catch {
          throw new BangError('Problem Writing to File')
        }
      }),
    }),

    append: new PrimitiveFunction({
      name: 'file.append',
      arity: 2,
      spread: true,
      call: fileFunction((argument: Primitive[]) => {
        const [filePath, fileContents] = argument

        if (!(filePath instanceof PrimitiveString))
          throw new BangError('Expected path to be a string')
        if (!(fileContents instanceof PrimitiveString))
          throw new BangError('Expected file contents to be a string')

        try {
          appendFileSync(filePath.getValue(), fileContents.getValue())
          return new PrimitiveNull()
        } catch {
          throw new BangError('Problem Appending to File')
        }
      }),
    }),

    remove: new PrimitiveFunction({
      name: 'file.remove',
      arity: 1,
      call: fileFunction((argument: Primitive[]) => {
        const [path] = argument

        if (!(path instanceof PrimitiveString))
          throw new BangError('Expected path to be a string')

        try {
          rmSync(path.getValue())
          return new PrimitiveNull()
        } catch {
          throw new BangError('Problem removing file')
        }
      }),
    }),

    copy: new PrimitiveFunction({
      name: 'file.copy',
      arity: 2,
      call: fileFunction((argument: Primitive[]) => {
        const [src, dest] = argument

        if (!(src instanceof PrimitiveString))
          throw new BangError('Expected source to be a string')
        if (!(dest instanceof PrimitiveString))
          throw new BangError('Expected destination to be a string')

        try {
          copyFileSync(src.getValue(), dest.getValue())
          return new PrimitiveNull()
        } catch {
          throw new BangError('Problem Copying File')
        }
      }),
    }),

    createDirectory: new PrimitiveFunction({
      name: 'file.createDirectory',
      arity: 1,
      call: fileFunction((argument: Primitive[]) => {
        const [path] = argument

        if (!(path instanceof PrimitiveString))
          throw new BangError('Expected path to be a string')

        try {
          mkdirSync(path.getValue())
          return new PrimitiveNull()
        } catch {
          throw new BangError('Problem creating directory')
        }
      }),
    }),

    removeDirectory: new PrimitiveFunction({
      name: 'file.removeDirectory',
      arity: 1,
      call: fileFunction((argument: Primitive[]) => {
        const [path] = argument

        if (!(path instanceof PrimitiveString))
          throw new BangError('Expected path to be a string')

        try {
          rmdirSync(path.getValue())
          return new PrimitiveNull()
        } catch {
          throw new BangError('Problem removing directory')
        }
      }),
    }),

    list: new PrimitiveFunction({
      name: 'file.list',
      arity: 1,
      call: fileFunction((argument: Primitive[]) => {
        const [path] = argument

        if (!(path instanceof PrimitiveString))
          throw new BangError('Expected path to be a string')

        try {
          return new PrimitiveList({
            values: readdirSync(path.getValue()).map(
              (value) => new PrimitiveString(value)
            ),
          })
        } catch {
          throw new BangError('Problem reading directory')
        }
      }),
    }),
  },
})
