import { expectOutput, expectError } from './helpers'

it('should parse empty list', () => {
  expectOutput('[]').toEqual([])
})

it('should parse a list with a range of values', () => {
  expectOutput('[1, false, null, "hello"]').toEqual([1, false, null, 'hello'])
})

it('should cope with a list with consecutive commas', () => {
  expectError('[,,]')
})

it('should match equality between lists', () => {
  expectOutput('[1, false, null, "hello"] == [1, false, null, "hello"]').toBe(
    true
  )
  expectOutput(
    '[1, false, null, "hello", 2] == [1, false, null, "hello"]'
  ).toBe(false)
  expectOutput('[1, false, null, "hello", 2] == "hello"').toBe(false)
  expectOutput('[1, false, null, "hello"] != [1, false, null, "hello"]').toBe(
    false
  )
  expectOutput(
    '[1, false, null, "hello", 2] != [1, false, null, "hello"]'
  ).toBe(true)
  expectOutput('[1, false, null, "hello", 2] != "hello"').toBe(true)
})

it('should have lengths for lists', () => {
  expectOutput('[].length').toBe(0)
  expectOutput('[1].length').toBe(1)
  expectOutput('[1, false, null, "hello"].length').toBe(4)
})

it('should concatenate lists with +', () => {
  expectOutput('[] + [1]').toEqual([1])
  expectOutput('[1,2,3] + [4,5]').toEqual([1, 2, 3, 4, 5])
})

it('should append to lists with +', () => {
  expectOutput('[] + 1').toEqual([1])
  expectOutput('[1,2,3] + 4 + 5').toEqual([1, 2, 3, 4, 5])
  expectOutput('[1,2,3] + "hello"').toEqual([1, 2, 3, 'hello'])
})

it('should not append to immutable lists with +', () => {
  expectError('[].freeze() + 1')
  expectError('[1,2,3].freeze() + 4 + 5')
  expectError('[1,2,3].freeze() + "hello"')
})

it('should have indexOf method', () => {
  expectOutput('[1,2,3].indexOf(4)').toBe(null)
  expectOutput('[1,2,3].indexOf(2)').toBe(1)
})

it('should have findIndex method', () => {
  expectOutput('[1,2,3].findIndex((a)=>a==1)').toBe(0)
  expectOutput('[1,2,3].findIndex((a)=> a > 4)').toBe(null)
  expectError(`["a","b","c"].findIndex(1)`)
})

it('should have find method', () => {
  expectOutput('[1,2,3].find((a)=> a < 3)').toBe(1)
  expectOutput('[1,2,3].find((a)=> a > 4)').toBe(null)
  expectError(`["a","b","c"].find(1)`)
})

it('should have join method', () => {
  expectOutput(`[].join(',')`).toBe('')
  expectOutput(`[1,2,3].join(',')`).toBe('1,2,3')
  expectOutput(`["a","b","c"].join(' and ')`).toBe('a and b and c')
  expectError(`["a","b","c"].join(1)`)
})

it('should have map function', () => {
  expectOutput('[1,2,3].map((a)=> a * 2)').toEqual([2, 4, 6])
  expectOutput('[1,2,3].map((a)=> a + 2)').toEqual([3, 4, 5])
  expectError('[1,2,3].map(7)')
})

it('should have filter function', () => {
  expectOutput('[1,2,3].filter((a)=> a >= 0)').toEqual([1, 2, 3])
  expectOutput('[1,2,3].filter((a)=> a >= 2)').toEqual([2, 3])
  expectOutput('[1,2,3].filter((a)=> a >= 7)').toEqual([])
  expectError('[1,2,3].filter(7)')
})

it('should have foreach function', () => {
  expectOutput('[1,2,3].forEach((a)=> a >= 0)').toBe(null)
  expectOutput('[1,2,3].forEach((a)=> a >= 2)').toBe(null)
  expectOutput('[1,2,3].forEach((a)=> a >= 7)').toBe(null)
  expectError('[1,2,3].forEach(7)')
})

it('should have any function', () => {
  expectOutput('[1,2,3].any()').toBe(true)
  expectOutput('[].any()').toBe(false)
  expectOutput('[false, null].any()').toBe(false)
  expectOutput('[false, null, 1].any()').toBe(true)
})

it('should have every function', () => {
  expectOutput('[1,2,3].every()').toBe(true)
  expectOutput('[].every()').toBe(true)
  expectOutput('[false, null].every()').toBe(false)
  expectOutput('[false, null, 1].every()').toBe(false)
})

it('should have includes function', () => {
  expectOutput('[1,2,3].includes(1)').toBe(true)
  expectOutput('[1,2,3].includes(4)').toBe(false)
  expectOutput('[].includes(1)').toBe(false)
  expectOutput('[false, null].includes(true)').toBe(false)
  expectOutput('[false, null, 1].includes(null)').toBe(true)
})

it('should have reverse function', () => {
  expectOutput('[1,2,3].reverse()').toEqual([3, 2, 1])
  expectOutput('[].reverse()').toEqual([])
  expectOutput('[false, null].reverse()').toEqual([null, false])
  expectOutput('[false, null, 1].reverse()').toEqual([1, null, false])
})

it('should have push function', () => {
  expectOutput('[1,2,3].push(4)').toEqual([1, 2, 3, 4])
  expectOutput('[1,2,3].push("helo")').toEqual([1, 2, 3, 'helo'])
  expectError('[1,2,3].freeze().push(4)')
})

it('should have pop function', () => {
  expectOutput('[1,2,3].pop()').toBe(3)
  expectOutput('[1,2,3,4].pop()').toBe(4)
  expectOutput('[].pop()').toBe(null)
  expectError('[1,2,3].freeze().pop()')
})

it('should have unshift function', () => {
  expectOutput('[1,2,3].unshift(4)').toEqual([4, 1, 2, 3])
  expectOutput('[1,2,3].unshift("helo")').toEqual(['helo', 1, 2, 3])
  expectError('[1,2,3].freeze().unshift(4)')
})

it('should have shift function', () => {
  expectOutput('[1,2,3].shift()').toBe(1)
  expectOutput('[5,1,2,3,4].shift()').toBe(5)
  expectOutput('[].shift()').toBe(null)
  expectError('[1,2,3].freeze().shift()')
})

it('should have copy function', () => {
  expectOutput('[1,2,3].copy()').toEqual([1, 2, 3])
  expectOutput('[5,1,2,3,4].copy()').toEqual([5, 1, 2, 3, 4])
  expectOutput('[1,2,3].freeze().copy()').toEqual([1, 2, 3])
})

it('should get values by index', () => {
  expectOutput('[1,2,3][0]').toBe(1)
  expectOutput('[1,2,3][1]').toBe(2)
  expectOutput('[1,2,3][2]').toBe(3)
  expectError('[1,2,3][4]')
})

it('should get values by negative index', () => {
  expectOutput('[1,2,3][-3]').toBe(1)
  expectOutput('[1,2,3][-2]').toBe(2)
  expectOutput('[1,2,3][-1]').toBe(3)
  expectError('[1,2,3][-4]')
})

it('should get values by other types', () => {
  expectError('[1,2,3]["hello"]')
  expectError('[1,2,3][null]')
  expectError('[1,2,3][true]')
})

it('should assign values in a list', () => {
  expectOutput(`
let a = [1,2,3]
a[0] = "hello"
a`).toEqual(['hello', 2, 3])
  expectOutput(`
let a = [1,2,3]
a[1] = "hello"
a`).toEqual([1, 'hello', 3])
  expectOutput(`
let a = [1,2,3]
a[-1] = "hello"
a`).toEqual([1, 2, 'hello'])
  expectError(`
let a = [1,2,3]
a[4] = "hello"
a`)
  expectError(`
let a = [1,2,3]
a["hello"] = "hello"
a`)
  expectError(`
let a = [1,2,3]
a.hello = "hello"
a`)
})

it('should not assign values in an immutable list', () => {
  expectError(`
let a = [1,2,3].freeze()
a[0] = "hello"
a`)
})

it('should have a get method', () => {
  expectOutput('[1,2,3].get(1)').toBe(2)
  expectOutput('[1,2,3].get(5)').toBe(null)
})

it('should error if end bracket is missing', () => {
  expectError('[1,2,3')
  expectError('[1,2,')
})

it('should get slice of lists', () => {
  expectOutput(`[1,2,3,4,5][:1]`).toEqual([1])
  expectOutput(`[1,2,3,4,5][:2]`).toEqual([1, 2])
  expectOutput(`[1,2,3,4,5][:4]`).toEqual([1, 2, 3, 4])
  expectOutput(`[1,2,3,4,5][1:]`).toEqual([2, 3, 4, 5])
  expectOutput(`[1,2,3,4,5][2:]`).toEqual([3, 4, 5])
  expectOutput(`[1,2,3,4,5][4:]`).toEqual([5])
  expectOutput(`[1,2,3,4,5][0:1]`).toEqual([1])
  expectOutput(`[1,2,3,4,5][0:2]`).toEqual([1, 2])
  expectOutput(`[1,2,3,4,5][0:4]`).toEqual([1, 2, 3, 4])
  expectOutput(`[1,2,3,4,5][0:-1]`).toEqual([1, 2, 3, 4])
  expectOutput(`[1,2,3,4,5][-3:-1]`).toEqual([3, 4])
  expectOutput(`[1,2,3,4,5][-9:-7]`).toEqual([])
  expectOutput(`[1,2,3,4,5][0:0]`).toEqual([])
  expectOutput(`[1,2,3,4,5][1:1]`).toEqual([])
  expectOutput(`[1,2,3,4,5][7:9]`).toEqual([])
  expectOutput(`[1,2,3,4,5][4:-5]`).toEqual([])
  expectOutput(`[1,2,3,4,5][:]`).toEqual([1, 2, 3, 4, 5])
  expectError(`[1,2,3,4,5][]`)
})

it('should error on assignment to slice', () => {
  expectError(`[1,2,3,4,5][1:] = [1,1,1,1]`)
})
