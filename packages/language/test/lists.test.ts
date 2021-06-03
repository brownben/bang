import { expectOutput, expectError } from './helpers'

it('should parse empty list', async () => {
  await expectOutput('[]').toEqual([])
})

it('should parse a list with a range of values', async () => {
  await expectOutput('[1, false, null, "hello"]').toEqual([
    1,
    false,
    null,
    'hello',
  ])
})

it('should cope with a list with consecutive commas', async () => {
  await expectError('[,,]')
})

it('should match equality between lists', async () => {
  await expectOutput(
    '[1, false, null, "hello"] == [1, false, null, "hello"]'
  ).toBe(true)
  await expectOutput(
    '[1, false, null, "hello", 2] == [1, false, null, "hello"]'
  ).toBe(false)
  await expectOutput('[1, false, null, "hello", 2] == "hello"').toBe(false)
  await expectOutput(
    '[1, false, null, "hello"] != [1, false, null, "hello"]'
  ).toBe(false)
  await expectOutput(
    '[1, false, null, "hello", 2] != [1, false, null, "hello"]'
  ).toBe(true)
  await expectOutput('[1, false, null, "hello", 2] != "hello"').toBe(true)
})

it('should have lengths for lists', async () => {
  await expectOutput('[].length').toBe(0)
  await expectOutput('[1].length').toBe(1)
  await expectOutput('[1, false, null, "hello"].length').toBe(4)
})

it('should concatenate lists with +', async () => {
  await expectOutput('[] + [1]').toEqual([1])
  await expectOutput('[1,2,3] + [4,5]').toEqual([1, 2, 3, 4, 5])
})

it('should append to lists with +', async () => {
  await expectOutput('[] + 1').toEqual([1])
  await expectOutput('[1,2,3] + 4 + 5').toEqual([1, 2, 3, 4, 5])
  await expectOutput('[1,2,3] + "hello"').toEqual([1, 2, 3, 'hello'])
})

it('should not append to immutable lists with +', async () => {
  await expectError('[].freeze() + 1')
  await expectError('[1,2,3].freeze() + 4 + 5')
  await expectError('[1,2,3].freeze() + "hello"')
})

it('should have indexOf method', async () => {
  await expectOutput('[1,2,3].indexOf(4)').toBe(null)
  await expectOutput('[1,2,3].indexOf(2)').toBe(1)
})

it('should have findIndex method', async () => {
  await expectOutput('[1,2,3].findIndex((a)=>a==1)').toBe(0)
  await expectOutput('[1,2,3].findIndex((a)=> a > 4)').toBe(null)
  await expectError(`["a","b","c"].findIndex(1)`)
})

it('should have find method', async () => {
  await expectOutput('[1,2,3].find((a)=> a < 3)').toBe(1)
  await expectOutput('[1,2,3].find((a)=> a > 4)').toBe(null)
  await expectError(`["a","b","c"].find(1)`)
})

it('should have join method', async () => {
  await expectOutput(`[].join(',')`).toBe('')
  await expectOutput(`[1,2,3].join(',')`).toBe('1,2,3')
  await expectOutput(`["a","b","c"].join(' and ')`).toBe('a and b and c')
  await expectError(`["a","b","c"].join(1)`)
})

it('should have map function', async () => {
  await expectOutput('[1,2,3].map((a)=> a * 2)').toEqual([2, 4, 6])
  await expectOutput('[1,2,3].map((a)=> a + 2)').toEqual([3, 4, 5])
  await expectOutput('[1,2,3].map((a, i)=> a * i)').toEqual([0, 2, 6])
  await expectError('[1,2,3].map(7)')
})

it('should have filter function', async () => {
  await expectOutput('[1,2,3].filter((a)=> a >= 0)').toEqual([1, 2, 3])
  await expectOutput('[1,2,3].filter((a)=> a >= 2)').toEqual([2, 3])
  await expectOutput('[1,2,3].filter((a)=> a >= 7)').toEqual([])
  await expectOutput('[1,2,3].filter((a, i) => a == i + 1)').toEqual([1, 2, 3])
  await expectError('[1,2,3].filter(7)')
})

it('should have reduce function', async () => {
  await expectOutput('[1,2,3].reduce((a,b) => a+b, 0)').toBe(6)
  await expectOutput('[1,2,3,5,-2].reduce((a,b) => a*b,1)').toBe(-60)
  await expectOutput('[].reduce(() => 1, 7)').toBe(7)
  await expectError('[1,2,3].reduce(5,5)')
})

it('should have foreach function', async () => {
  await expectOutput('[1,2,3].forEach((a)=> a >= 0)').toBe(null)
  await expectOutput('[1,2,3].forEach((a)=> a >= 2)').toBe(null)
  await expectOutput('[1,2,3].forEach((a)=> a >= 7)').toBe(null)
  await expectError('[1,2,3].forEach(7)')
})

it('should have any function', async () => {
  await expectOutput('[1,2,3].any()').toBe(true)
  await expectOutput('[].any()').toBe(false)
  await expectOutput('[false, null].any()').toBe(false)
  await expectOutput('[false, null, 1].any()').toBe(true)
})

it('should have every function', async () => {
  await expectOutput('[1,2,3].every()').toBe(true)
  await expectOutput('[].every()').toBe(true)
  await expectOutput('[false, null].every()').toBe(false)
  await expectOutput('[false, null, 1].every()').toBe(false)
})

it('should have includes function', async () => {
  await expectOutput('[1,2,3].includes(1)').toBe(true)
  await expectOutput('[1,2,3].includes(4)').toBe(false)
  await expectOutput('[].includes(1)').toBe(false)
  await expectOutput('[false, null].includes(true)').toBe(false)
  await expectOutput('[false, null, 1].includes(null)').toBe(true)
})

it('should have reverse function', async () => {
  await expectOutput('[1,2,3].reverse()').toEqual([3, 2, 1])
  await expectOutput('[].reverse()').toEqual([])
  await expectOutput('[false, null].reverse()').toEqual([null, false])
  await expectOutput('[false, null, 1].reverse()').toEqual([1, null, false])
})

it('should have push function', async () => {
  await expectOutput('[1,2,3].push(4)').toEqual([1, 2, 3, 4])
  await expectOutput('[1,2,3].push("helo")').toEqual([1, 2, 3, 'helo'])
  await expectError('[1,2,3].freeze().push(4)')
})

it('should have pop function', async () => {
  await expectOutput('[1,2,3].pop()').toBe(3)
  await expectOutput('[1,2,3,4].pop()').toBe(4)
  await expectOutput('[].pop()').toBe(null)
  await expectError('[1,2,3].freeze().pop()')
})

it('should have unshift function', async () => {
  await expectOutput('[1,2,3].unshift(4)').toEqual([4, 1, 2, 3])
  await expectOutput('[1,2,3].unshift("helo")').toEqual(['helo', 1, 2, 3])
  await expectError('[1,2,3].freeze().unshift(4)')
})

it('should have shift function', async () => {
  await expectOutput('[1,2,3].shift()').toBe(1)
  await expectOutput('[5,1,2,3,4].shift()').toBe(5)
  await expectOutput('[].shift()').toBe(null)
  await expectError('[1,2,3].freeze().shift()')
})

it('should have copy function', async () => {
  await expectOutput('[1,2,3].copy()').toEqual([1, 2, 3])
  await expectOutput('[5,1,2,3,4].copy()').toEqual([5, 1, 2, 3, 4])
  await expectOutput('[1,2,3].freeze().copy()').toEqual([1, 2, 3])
})

it('should get values by index', async () => {
  await expectOutput('[1,2,3][0]').toBe(1)
  await expectOutput('[1,2,3][1]').toBe(2)
  await expectOutput('[1,2,3][2]').toBe(3)
  await expectError('[1,2,3][4]')
})

it('should get values by negative index', async () => {
  await expectOutput('[1,2,3][-3]').toBe(1)
  await expectOutput('[1,2,3][-2]').toBe(2)
  await expectOutput('[1,2,3][-1]').toBe(3)
  await expectError('[1,2,3][-4]')
})

it('should get values by other types', async () => {
  await expectError('[1,2,3]["hello"]')
  await expectError('[1,2,3][null]')
  await expectError('[1,2,3][true]')
})

it('should assign values in a list', async () => {
  await expectOutput(`
let a = [1,2,3]
a[0] = "hello"
a`).toEqual(['hello', 2, 3])
  await expectOutput(`
let a = [1,2,3]
a[1] = "hello"
a`).toEqual([1, 'hello', 3])
  await expectOutput(`
let a = [1,2,3]
a[-1] = "hello"
a`).toEqual([1, 2, 'hello'])
  await expectError(`
let a = [1,2,3]
a[4] = "hello"
a`)
  await expectError(`
let a = [1,2,3]
a["hello"] = "hello"
a`)
  await expectError(`
let a = [1,2,3]
a.hello = "hello"
a`)
})

it('should not assign values in an immutable list', async () => {
  await expectError(`
let a = [1,2,3].freeze()
a[0] = "hello"
a`)
})

it('should have a get method', async () => {
  await expectOutput('[1,2,3].get(1)').toBe(2)
  await expectOutput('[1,2,3].get(5)').toBe(null)
})

it('should error if end bracket is missing', async () => {
  await expectError('[1,2,3')
  await expectError('[1,2,')
})

it('should get slice of lists', async () => {
  await expectOutput(`[1,2,3,4,5][:1]`).toEqual([1])
  await expectOutput(`[1,2,3,4,5][:2]`).toEqual([1, 2])
  await expectOutput(`[1,2,3,4,5][:4]`).toEqual([1, 2, 3, 4])
  await expectOutput(`[1,2,3,4,5][1:]`).toEqual([2, 3, 4, 5])
  await expectOutput(`[1,2,3,4,5][2:]`).toEqual([3, 4, 5])
  await expectOutput(`[1,2,3,4,5][4:]`).toEqual([5])
  await expectOutput(`[1,2,3,4,5][0:1]`).toEqual([1])
  await expectOutput(`[1,2,3,4,5][0:2]`).toEqual([1, 2])
  await expectOutput(`[1,2,3,4,5][0:4]`).toEqual([1, 2, 3, 4])
  await expectOutput(`[1,2,3,4,5][0:-1]`).toEqual([1, 2, 3, 4])
  await expectOutput(`[1,2,3,4,5][-3:-1]`).toEqual([3, 4])
  await expectOutput(`[1,2,3,4,5][-9:-7]`).toEqual([])
  await expectOutput(`[1,2,3,4,5][0:0]`).toEqual([])
  await expectOutput(`[1,2,3,4,5][1:1]`).toEqual([])
  await expectOutput(`[1,2,3,4,5][7:9]`).toEqual([])
  await expectOutput(`[1,2,3,4,5][4:-5]`).toEqual([])
  await expectOutput(`[1,2,3,4,5][:]`).toEqual([1, 2, 3, 4, 5])
  await expectError(`[1,2,3,4,5][]`)
})

it('should error on assignment to slice', async () => {
  await expectError(`[1,2,3,4,5][1:] = [1,1,1,1]`)
})

it('should have min function', async () => {
  await expectOutput('[1,2,3].min()').toBe(1)
  await expectOutput('[1,2,3,-2].min()').toBe(-2)
  await expectError('[].min()')
  await expectError('[false, null].min()')
  await expectError('["1", 1].min()')
})

it('should have max function', async () => {
  await expectOutput('[1,2,3].max()').toBe(3)
  await expectOutput('[1,2,3,5,-2].max()').toBe(5)
  await expectError('[].max()')
  await expectError('[false, null].max()')
  await expectError('["1", 1].max()')
})

it('should have sum function', async () => {
  await expectOutput('[1,2,3].sum()').toBe(6)
  await expectOutput('[1,2,3,5,-2].sum()').toBe(9)
  await expectOutput('[].sum()').toBe(0)
  await expectError('[false, null].sum()')
  await expectError('["1", 1].sum()')
})
