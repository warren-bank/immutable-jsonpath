const jsonpath = require('jsonpath')

// apply enhancement to jsonpath class prototype
require('index.js')(jsonpath)

const deepFreeze = require('deep-freeze')

describe('jsonpath.assign() to vivify non-existent nodes in path', function() {
  const obj = deepFreeze({})

  it('should scaffold nested Objects', function() {
    const path  = '$.a.aa.aaa.aaaa.aaaaa'
    const value = 'i am a string'
    const data  = jsonpath.assign(obj, path, value)

    expect(jsonpath.value(data, path)).toBe(value)
  })

  it('should scaffold nested Arrays (#1)', function() {
    const path  = '$.store.book[0].author'
    const value = 'i am an author'
    const data  = jsonpath.assign(obj, path, value)

    expect(jsonpath.value(data, path)).toBe(value)
  })

  it('should scaffold nested Arrays (#2)', function() {
    const path  = '$.store.book[0].author[0]'
    const value = 'i am a co-author'
    const data  = jsonpath.assign(obj, path, value)

    expect(jsonpath.value(data, path)).toBe(value)
  })

  it('should should throw an Error when extending a non-collection', function() {
    const obj   = deepFreeze({store: {book: 'i am not an array!'}})

    const path  = '$.store.book[0].author[0]'
    const value = 'i am a co-author'

    let data
    expect(() => {
      data = jsonpath.assign(obj, path, value)
    }).toThrow()

    expect(data).toBe(undefined)
  })
})
