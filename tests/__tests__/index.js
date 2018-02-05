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

  it('can be used to perform more complicated operations on an existing collection: Object', function() {
    deepFreeze(data_1)

    const path = '$.a.aa.aaa'
    const aaa  = jsonpath.value(data_1, path)

    const new_keys  = {
      aaaa_prime: {aaaaa_prime: 'world'}
    }
    const aaa_prime = Object.assign({}, aaa, new_keys)
    const data_3    = jsonpath.assign(data_1, path, aaa_prime)

    expect(jsonpath.value(data_1, path)).toBe(aaa)
    expect(jsonpath.value(data_3, path)).toBe(aaa_prime)

    expect(data_3).not.toBe(data_1)
  })

  it('can be used to perform more complicated operations on an existing collection: Array', function() {
    // data_1.a.aa.aaa = [
    //                     data_1.a.aa.aaa
    //                   ]
    const path    = '$.a.aa.aaa'
    const aaa_obj = jsonpath.value(data_1, path)
    const aaa_arr = [aaa_obj]

    jsonpath.value(data_1, path, aaa_arr)
    deepFreeze(data_1)

    // data_3.a.aa.aaa = [
    //                     data_1.a.aa.aaa[0],
    //                     data_1.a.aa.aaa[0],
    //                     data_1.a.aa.aaa[0]
    //                   ]
    const aaa_prime = [...aaa_arr, {...aaa_obj}, {...aaa_obj}]
    const data_3    = jsonpath.assign(data_1, path, aaa_prime)

    expect(jsonpath.value(data_1, path)).toBe(aaa_arr)
    expect(jsonpath.value(data_3, path)).toBe(aaa_prime)

    expect(data_3).not.toBe(data_1)
  })
})
