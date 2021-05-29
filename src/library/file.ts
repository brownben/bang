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

interface MockFileSystem {
  readFileSync: (path: string, options: { encoding: string }) => string
  existsSync: (path: string) => boolean
  writeFileSync: (path: string, contents: string) => void
  appendFileSync: (path: string, contents: string) => void
  rmSync: (path: string) => void
  copyFileSync: (source: string, destination: string) => void
  mkdirSync: (path: string) => void
  rmdirSync: (path: string) => void
  readdirSync: (path: string) => string[]
}

export type FileSystem = MockFileSystem | typeof import('fs')

const mockFileSystem: FileSystem = {
  readFileSync: (_path: string, _options: { encoding: string }) => {
    throw new BangError('Filesystem is not defined')
  },
  existsSync: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
  writeFileSync: (_path: string, _contents: string) => {
    throw new BangError('Filesystem is not defined')
  },
  appendFileSync: (_path: string, _contents: string) => {
    throw new BangError('Filesystem is not defined')
  },
  rmSync: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
  copyFileSync: (_source: string, _destination: string) => {
    throw new BangError('Filesystem is not defined')
  },
  mkdirSync: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
  rmdirSync: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
  readdirSync: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
}

export const file = (fs: FileSystem = mockFileSystem) =>
  new PrimitiveDictionary({
    immutable: true,

    keyValues: {
      read: new PrimitiveFunction({
        name: 'file.read',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [filePath] = argument

          if (!(filePath instanceof PrimitiveString))
            throw new BangError('Expected a string')

          try {
            return new PrimitiveString(
              fs.readFileSync(filePath.getValue(), { encoding: 'utf-8' })
            )
          } catch {
            throw new BangError('Problem Reading File')
          }
        },
      }),

      exists: new PrimitiveFunction({
        name: 'file.exists',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [filePath] = argument

          if (!(filePath instanceof PrimitiveString))
            throw new BangError('Expected a string')

          return new PrimitiveBoolean(fs.existsSync(filePath.getValue()))
        },
      }),

      write: new PrimitiveFunction({
        name: 'file.write',
        arity: 2,
        spread: true,
        call: (argument: Primitive[]) => {
          const [filePath, fileContents] = argument

          if (!(filePath instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')
          if (!(fileContents instanceof PrimitiveString))
            throw new BangError('Expected file contents to be a string')

          try {
            fs.writeFileSync(filePath.getValue(), fileContents.getValue())
            return new PrimitiveNull()
          } catch {
            throw new BangError('Problem Writing to File')
          }
        },
      }),

      append: new PrimitiveFunction({
        name: 'file.append',
        arity: 2,
        spread: true,
        call: (argument: Primitive[]) => {
          const [filePath, fileContents] = argument

          if (!(filePath instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')
          if (!(fileContents instanceof PrimitiveString))
            throw new BangError('Expected file contents to be a string')

          try {
            fs.appendFileSync(filePath.getValue(), fileContents.getValue())
            return new PrimitiveNull()
          } catch {
            throw new BangError('Problem Appending to File')
          }
        },
      }),

      remove: new PrimitiveFunction({
        name: 'file.remove',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            fs.rmSync(path.getValue())
            return new PrimitiveNull()
          } catch {
            throw new BangError('Problem removing file')
          }
        },
      }),

      copy: new PrimitiveFunction({
        name: 'file.copy',
        arity: 2,
        call: (argument: Primitive[]) => {
          const [src, dest] = argument

          if (!(src instanceof PrimitiveString))
            throw new BangError('Expected source to be a string')
          if (!(dest instanceof PrimitiveString))
            throw new BangError('Expected destination to be a string')

          try {
            fs.copyFileSync(src.getValue(), dest.getValue())
            return new PrimitiveNull()
          } catch {
            throw new BangError('Problem Copying File')
          }
        },
      }),

      createDirectory: new PrimitiveFunction({
        name: 'file.createDirectory',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            fs.mkdirSync(path.getValue())
            return new PrimitiveNull()
          } catch {
            throw new BangError('Problem creating directory')
          }
        },
      }),

      removeDirectory: new PrimitiveFunction({
        name: 'file.removeDirectory',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            fs.rmdirSync(path.getValue())
            return new PrimitiveNull()
          } catch {
            throw new BangError('Problem removing directory')
          }
        },
      }),

      list: new PrimitiveFunction({
        name: 'file.list',
        arity: 1,
        call: (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            return new PrimitiveList({
              values: fs
                .readdirSync(path.getValue())
                .map((value) => new PrimitiveString(value)),
            })
          } catch {
            throw new BangError('Problem reading directory')
          }
        },
      }),
    },
  })
