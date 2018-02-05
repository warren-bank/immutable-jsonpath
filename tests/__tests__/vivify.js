const jsonpath = require('jsonpath')

// apply enhancement to jsonpath class prototype
require('index.js')(jsonpath)

const deepFreeze = require('deep-freeze')

describe('jsonpath.assign() used to vivify non-existent nodes in path', function() {
  it('should scaffold nested Objects', function() {
    const obj   = {}
    const path  = '$.a.aa.aaa.aaaa.aaaaa'
    const value = 'i am a string'
    const data  = jsonpath.assign(obj, path, value)

    expect(jsonpath.value(data, path)).toBe(value)
  })

  it('should scaffold nested Arrays (#1)', function() {
    const obj   = {}
    const path  = '$.store.book[0].author'
    const value = 'i am an author'
    const data  = jsonpath.assign(obj, path, value)

    expect(jsonpath.value(data, path)).toBe(value)
  })

  it('should scaffold nested Arrays (#2)', function() {
    const obj   = {}
    const path  = '$.store.book[0].author[0]'
    const value = 'i am a co-author'
    const data  = jsonpath.assign(obj, path, value)

    expect(jsonpath.value(data, path)).toBe(value)
  })
})
