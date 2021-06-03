import { expectError, expectOutput } from '../helpers'

const expectOutputWithJSON = (string: string) =>
  expectOutput('import json \n' + string)

it('should parse values from string', async () => {
  await expectOutputWithJSON('json.parse("2")').toBe(2)
  await expectOutputWithJSON('json.parse(`"2"`)').toBe('2')
  await expectOutputWithJSON('type(json.parse(`"<unique>"`)) == `unique`')
  await expectOutputWithJSON('json.parse("[1,2,3]")').toEqual([1, 2, 3])
  await expectOutputWithJSON('json.parse(`{"a":2}`)').toEqual({ a: 2 })
  await expectOutputWithJSON('json.parse("true")').toBe(true)
  await expectOutputWithJSON('json.parse("null")').toBe(null)
})

it('should parse nested dictionaries', async () => {
  await expectOutputWithJSON(
    `json.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}')`
  ).toEqual({ '1': 1, '2': 2, '3': { '4': 4, '5': { '6': 6 } } })
})

it('should throw error on invalid json', async () => {
  await expectError('import json\n json.parse("{a:4}")')
})

it('should only parse a string', async () => {
  await expectError('import json\n json.parse(7)')
})

it('should stringify objects', async () => {
  await expectOutputWithJSON(
    `json.stringify({"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}})`
  ).toBe('{"1":1,"2":2,"3":{"4":4,"5":{"6":6}}}')
  await expectOutputWithJSON(
    `json.stringify({"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}, 2)`
  ).toBe(`{
  "1": 1,
  "2": 2,
  "3": {
    "4": 4,
    "5": {
      "6": 6
    }
  }
}`)
})

it('should stringify primitives', async () => {
  await expectOutputWithJSON(`json.stringify(2)`).toBe('2')
  await expectOutputWithJSON(`json.stringify(true)`).toBe('true')
  await expectOutputWithJSON(`json.stringify(false)`).toBe('false')
  await expectOutputWithJSON(`json.stringify(null)`).toBe('null')
  await expectOutputWithJSON(`json.stringify('hi')`).toBe('"hi"')
  await expectOutputWithJSON(`import unique\n json.stringify(unique())`).toBe(
    '"<unique>"'
  )
})
