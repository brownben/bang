import { expectError, expectOutput } from '../helpers'
import { writeFileSync, rmSync } from 'fs'

const expectOutputWithFile = (string: string) =>
  expectOutput('import file \n' + string)

beforeAll(() => {
  writeFileSync('./testFile.txt', 'test data')
})
afterAll(() => rmSync('./testFile.txt'))

it('should read files', async () => {
  await expectOutputWithFile('file.read("./testFile.txt")').toBe('test data')
  await expectError('import file\n file.read(7)')
})

it('should write to files', async () => {
  await expectOutputWithFile('file.write("./testFile.txt", "new data")').toBe(
    null
  )
  await expectOutputWithFile('file.read("./testFile.txt")').toBe('new data')
  await expectError('import file\n file.write(7,7)')
  await expectError('import file\n file.write("hello", 7)')
})

it('should append to files', async () => {
  await expectOutputWithFile('file.append("./testFile.txt", "even more")').toBe(
    null
  )
  await expectOutputWithFile('file.read("./testFile.txt")').toBe(
    'new dataeven more'
  )
  await expectError('import file\n file.append(7, 7)')
  await expectError('import file\n file.append("hello", 7)')
})

it('should copy files', async () => {
  await expectOutputWithFile(
    'file.copy("./testFile.txt", "./testFile2.txt")'
  ).toBe(null)
  await expectError('import file\n file.copy(7, 7)')
  await expectError('import file\n file.copy("hello", 7)')
})

it('should delete files', async () => {
  await expectOutputWithFile('file.remove("./testFile2.txt")').toBe(null)
  await expectError('import file\n file.remove(7)')
})

it('should create directpry', async () => {
  await expectOutputWithFile('file.createDirectory("./testDir")').toBe(null)
  await expectError('import file\n file.createDirectory(7)')
})

it('should create files in directory', async () => {
  await expectOutputWithFile(
    'file.write("./testDir/testFile.txt", "new data")'
  ).toBe(null)
  await expectOutputWithFile(
    'file.write("./testDir/testFile1.txt", "new data")'
  ).toBe(null)
})
it('should error removing directory if contents', async () => {
  await expectError('import file\n file.removeDirectory("./testFile.txt")')
})

it('should list directory contents', async () => {
  await expectOutputWithFile('file.list("./testDir")').toEqual([
    'testFile.txt',
    'testFile1.txt',
  ])
  await expectOutputWithFile('file.remove("./testDir/testFile.txt")').toBe(null)
  await expectOutputWithFile('file.remove("./testDir/testFile1.txt")').toBe(
    null
  )
  await expectOutputWithFile('file.list("./testDir")').toEqual([])
  await expectError('import file\n file.list(7)')
})

it('should remove directory', async () => {
  await expectOutputWithFile('file.removeDirectory("./testDir")').toBe(null)
  await expectError('import file\n file.removeDirectory(7)')
})

it('should error if file doesnt exist', async () => {
  await expectError('import file\n file.read("./testFile/ad/c.txt")')
  await expectError('import file\n file.append("./testFile/ad/c.txt", "")')
  await expectError('import file\n file.write("./testFile/ad/c.txt", "")')
  await expectError('import file\n file.remove("./testFile/ad/c.txt")')
  await expectError('import file\n file.copy("./testFile/ad/c.txt", "./2")')
  await expectError('import file\n file.list("./testFile.txt")')
  await expectError('import file\n file.removeDirectory("./testFile.txt")')
  await expectError('import file\n file.createDirectory("./testFile/ad/c.txt")')
})

it('should error filesystem not defined', async () => {
  await expectError('import file\n file.read("./testFile/ad/c.txt")', {})
  await expectError('import file\n file.append("./testFile/ad/c.txt", "")', {})
  await expectError('import file\n file.write("./testFile/ad/c.txt", "")', {})
  await expectError('import file\n file.remove("./testFile/ad/c.txt")', {})
  await expectError('import file\n file.copy("./testFile/ad/c.txt", "./2")', {})
  await expectError('import file\n file.list("./testFile.txt")', {})
  await expectError('import file\n file.removeDirectory("./testFile.txt")', {})
  await expectError(
    'import file\n file.createDirectory("./testFile/ad/c.txt")',
    {}
  )
})
