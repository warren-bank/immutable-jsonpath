const jsonpath = require('jsonpath')

// apply enhancement to jsonpath class prototype
require('index.js')(jsonpath)

const deepFreeze = require('deep-freeze')

describe('jsonpath.value() to update object', function() {
  const path = '$.a.aa.aaa.aaaa.aaaaa'
  let data_1

  beforeEach(() => {
    data_1 = {
      a: {aa: {aaa: {aaaa: {aaaaa: 'hello'}}}},
      b: {bb: {}}
    }
  })

  it('should return a reference to the input object', function() {
    const data_2 = data_1
    jsonpath.value(data_2, path, 'world')

    expect(data_2).toBe(data_1)
  })

  it('should mutate pathExpression in the input object', function() {
    const data_2 = data_1
    jsonpath.value(data_2, path, 'world')

    expect(jsonpath.value(data_1, path)).toEqual('world')
    expect(jsonpath.value(data_2, path)).toEqual('world')
    expect(jsonpath.value(data_2, path)).toBe(jsonpath.value(data_1, path))
  })

  it.skip('should throw an Error when the input object is frozen', function() {
    deepFreeze(data_1)

    expect(() => {
      jsonpath.value(data_1, path, 'world')
    }).toThrow()
  })

  it('should silently fail to perform update when the input object is frozen', function() {
    deepFreeze(data_1)

    jsonpath.value(data_1, path, 'world')

    expect(jsonpath.value(data_1, path)).toEqual('hello')
  })
})

describe('jsonpath.assign() to update object', function() {
  const path = '$.a.aa.aaa.aaaa.aaaaa'
  let data_1

  beforeEach(() => {
    data_1 = {
      a: {aa: {aaa: {aaaa: {aaaaa: 'hello'}}}},
      b: {bb: {}}
    }
  })

  it('should not return a reference to the input object', function() {
    const data_3 = jsonpath.assign(data_1, path, 'world')

    expect(data_3).not.toBe(data_1)
  })

  it('should not mutate pathExpression in the input object', function() {
    const data_3 = jsonpath.assign(data_1, path, 'world')

    expect(jsonpath.value(data_1, path)).toEqual('hello')
    expect(jsonpath.value(data_3, path)).toEqual('world')
    expect(jsonpath.value(data_3, path)).not.toBe(jsonpath.value(data_1, path))
  })

  it('should not throw an Error when the input object is frozen', function() {
    deepFreeze(data_1)
    let data_3

    expect(() => {
      data_3 = jsonpath.assign(data_1, path, 'world')
    }).not.toThrow()

    expect(jsonpath.value(data_3, path)).toEqual('world')
  })

  it('should not clone nodes in the input object that occur outside of the path between root ($) and leaf (pathExpression)', function() {
    const data_3 = jsonpath.assign(data_1, path, 'world')

    expect(data_3.b).toBe(data_1.b)
  })
})
