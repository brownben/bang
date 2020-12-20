import { expectOutput } from './helpers'

describe('literals should return values', () => {
  it('should handle numbers', () => {
    expectOutput('.1').toBe(0.1)
    expectOutput('1').toBe(1)
    expectOutput('758.23').toBe(758.23)
  })

  it('should handle numbers (with digit separators)', () => {
    expectOutput('.1').toBe(0.1)
    expectOutput('1_1').toBe(11)
    expectOutput('1__1').toBe(11)
    expectOutput('222_758.232').toBe(222758.232)
    expectOutput('12_222_758').toBe(12222758)
  })

  it('should handle booleans', () => {
    expectOutput('false').toBe(false)
    expectOutput('true').toBe(true)
  })

  it('should handle strings', () => {
    expectOutput('"false"').toBe('false')
    expectOutput('`true`').toBe('true')
  })

  it('should handle null', () => {
    expectOutput('null').toBe(null)
  })
})
