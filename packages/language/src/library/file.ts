import {
  Primitive,
  PrimitiveDictionary,
  PrimitiveFunction,
  PrimitiveList,
  PrimitiveNull,
  PrimitiveString,
} from '../primitives'
import BangError from '../BangError'

interface MockFileSystem {
  readFile: (path: string, options: { encoding: string }) => Promise<string>
  writeFile: (path: string, contents: string) => Promise<void>
  appendFile: (path: string, contents: string) => Promise<void>
  rm: (path: string) => void
  copyFile: (source: string, destination: string) => Promise<void>
  mkdir: (path: string) => Promise<void>
  rmdir: (path: string) => Promise<void>
  readdir: (path: string) => Promise<string[]>
}

export type FileSystem = MockFileSystem | typeof import('fs/promises')

const mockFileSystem: FileSystem = {
  readFile: (_path: string, _options: { encoding: string }) => {
    throw new BangError('Filesystem is not defined')
  },
  writeFile: (_path: string, _contents: string) => {
    throw new BangError('Filesystem is not defined')
  },
  appendFile: (_path: string, _contents: string) => {
    throw new BangError('Filesystem is not defined')
  },
  rm: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
  copyFile: (_source: string, _destination: string) => {
    throw new BangError('Filesystem is not defined')
  },
  mkdir: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
  rmdir: (_path: string) => {
    throw new BangError('Filesystem is not defined')
  },
  readdir: (_path: string) => {
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
        call: async (argument: Primitive[]) => {
          const [filePath] = argument

          if (!(filePath instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            return new PrimitiveString(
              await fs.readFile(filePath.getValue(), { encoding: 'utf-8' })
            )
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem reading file')
          }
        },
      }),

      write: new PrimitiveFunction({
        name: 'file.write',
        arity: 2,
        spread: true,
        call: async (argument: Primitive[]) => {
          const [filePath, fileContents] = argument

          if (!(filePath instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')
          if (!(fileContents instanceof PrimitiveString))
            throw new BangError('Expected file contents to be a string')

          try {
            await fs.writeFile(filePath.getValue(), fileContents.getValue())
            return new PrimitiveNull()
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem writing to file')
          }
        },
      }),

      append: new PrimitiveFunction({
        name: 'file.append',
        arity: 2,
        spread: true,
        call: async (argument: Primitive[]) => {
          const [filePath, fileContents] = argument

          if (!(filePath instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')
          if (!(fileContents instanceof PrimitiveString))
            throw new BangError('Expected file contents to be a string')

          try {
            await fs.appendFile(filePath.getValue(), fileContents.getValue())
            return new PrimitiveNull()
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem appending to file')
          }
        },
      }),

      remove: new PrimitiveFunction({
        name: 'file.remove',
        arity: 1,
        call: async (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            await fs.rm(path.getValue())
            return new PrimitiveNull()
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem removing file')
          }
        },
      }),

      copy: new PrimitiveFunction({
        name: 'file.copy',
        arity: 2,
        call: async (argument: Primitive[]) => {
          const [src, dest] = argument

          if (!(src instanceof PrimitiveString))
            throw new BangError('Expected source to be a string')
          if (!(dest instanceof PrimitiveString))
            throw new BangError('Expected destination to be a string')

          try {
            await fs.copyFile(src.getValue(), dest.getValue())
            return new PrimitiveNull()
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem copying file')
          }
        },
      }),

      createDirectory: new PrimitiveFunction({
        name: 'file.createDirectory',
        arity: 1,
        call: async (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            await fs.mkdir(path.getValue())
            return new PrimitiveNull()
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem creating directory')
          }
        },
      }),

      removeDirectory: new PrimitiveFunction({
        name: 'file.removeDirectory',
        arity: 1,
        call: async (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            await fs.rmdir(path.getValue())
            return new PrimitiveNull()
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem removing directory')
          }
        },
      }),

      list: new PrimitiveFunction({
        name: 'file.list',
        arity: 1,
        call: async (argument: Primitive[]) => {
          const [path] = argument

          if (!(path instanceof PrimitiveString))
            throw new BangError('Expected path to be a string')

          try {
            return new PrimitiveList({
              values: await fs
                .readdir(path.getValue())
                .then((paths) =>
                  paths.map((value) => new PrimitiveString(value))
                ),
            })
          } catch (error) {
            if (error instanceof BangError) throw error
            else throw new BangError('Problem reading contents directory')
          }
        },
      }),
    },
  })
