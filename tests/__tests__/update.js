const jsonpath = require('jsonpath')

// apply enhancement to jsonpath class prototype
require('index.js')(jsonpath)

const deepFreeze = require('deep-freeze')

describe('jsonpath.update() to update existing data collections in immutable object', function() {
  const path_arr = '$.a.aa.aaa'
  const path_obj = '$.a.aa.aaa[3].bbbb'
  let old_obj

  beforeEach(() => {
    old_obj = deepFreeze({
      a: {aa: {aaa: [
                      {b:    {aaaaa: 'hello'}},
                      {bb:   {aaaaa: 'hello'}},
                      {bbb:  {aaaaa: 'hello'}},
                      {bbbb: {aaaaa: 'hello'}}
                    ]}}
    })
  })

  const arr_keys = (new_obj) => {
    const new_value = jsonpath.value(new_obj, path_arr)
    return new_value.map(o => Object.keys(o)[0])
  }

  it('should update Array: delete 1 element', function() {
    let arr_index, new_obj, new_value

    arr_index = 0
    new_obj   = jsonpath.update(old_obj, path_arr, 'delete', arr_index)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(3)

    expect(arr_keys(new_obj)).toEqual(['bb','bbb','bbbb'])
  })

  it('should update Array: delete 2 elements', function() {
    let arr_index, deleteCount, new_obj, new_value

    arr_index   = 1
    deleteCount = 2
    new_obj     = jsonpath.update(old_obj, path_arr, 'delete', arr_index, deleteCount)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(2)

    expect(arr_keys(new_obj)).toEqual(['b','bbbb'])
  })

  it('should update Array: shift', function() {
    let new_obj, new_value

    new_obj = jsonpath.update(old_obj, path_arr, 'shift')

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(3)

    expect(arr_keys(new_obj)).toEqual(['bb','bbb','bbbb'])
  })

  it('should update Array: pop', function() {
    let new_obj, new_value

    new_obj = jsonpath.update(old_obj, path_arr, 'pop')

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(3)

    expect(arr_keys(new_obj)).toEqual(['b','bb','bbb'])
  })

  it('should update Array: unshift', function() {
    let new_key, new_item, new_obj, new_value

    new_key  = "new_element"
    new_item = {[new_key]: true}
    new_obj  = jsonpath.update(old_obj, path_arr, 'unshift', new_item)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(5)

    expect(arr_keys(new_obj)).toEqual([new_key,'b','bb','bbb','bbbb'])
  })

  it('should update Array: push', function() {
    let new_key, new_item, new_obj, new_value

    new_key  = "new_element"
    new_item = {[new_key]: true}
    new_obj  = jsonpath.update(old_obj, path_arr, 'push', new_item)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(5)

    expect(arr_keys(new_obj)).toEqual(['b','bb','bbb','bbbb',new_key])
  })

  it('should update Array: concat_start', function() {
    let new_keys, new_items, new_obj, new_value

    new_keys  = ["new_element_1","new_element_2","new_element_3"]
    new_items = new_keys.map(new_key => ({[new_key]: true}))
    new_obj   = jsonpath.update(old_obj, path_arr, 'concat_start', new_items)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(7)

    expect(arr_keys(new_obj)).toEqual([...new_keys,'b','bb','bbb','bbbb'])
  })

  it('should update Array: concat_end', function() {
    let new_keys, new_items, new_obj, new_value

    new_keys  = ["new_element_1","new_element_2","new_element_3"]
    new_items = new_keys.map(new_key => ({[new_key]: true}))
    new_obj   = jsonpath.update(old_obj, path_arr, 'concat_end', new_items)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(7)

    expect(arr_keys(new_obj)).toEqual(['b','bb','bbb','bbbb',...new_keys])
  })

  it('should update Array: slice (begin: negative, end: undefined)', function() {
    let index_begin, index_end, new_obj, new_value

    index_begin = -2
    new_obj     = jsonpath.update(old_obj, path_arr, 'slice', index_begin)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(2)

    expect(arr_keys(new_obj)).toEqual(['bbb','bbbb'])
  })

  it('should update Array: slice (begin: negative, end: negative)', function() {
    let index_begin, index_end, new_obj, new_value

    index_begin = -2
    index_end   = -1
    new_obj     = jsonpath.update(old_obj, path_arr, 'slice', index_begin, index_end)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(1)

    expect(arr_keys(new_obj)).toEqual(['bbb'])
  })

  it('should update Array: slice (begin: positive, end: positive)', function() {
    let index_begin, index_end, new_obj, new_value

    index_begin = 1
    index_end   = 3
    new_obj     = jsonpath.update(old_obj, path_arr, 'slice', index_begin, index_end)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(2)

    expect(arr_keys(new_obj)).toEqual(['bb','bbb'])
  })

  it('should update Array: slice <Array>(begin: positive, end: positive)', function() {
    let index_begin, index_end, new_obj, new_value

    index_begin = 1
    index_end   = 3
    new_obj     = jsonpath.update(old_obj, path_arr, 'slice', [index_begin, index_end])

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(2)

    expect(arr_keys(new_obj)).toEqual(['bb','bbb'])
  })

  it('should update Array: splice (start: positive, deleteCount: 1, items: undefined)', function() {
    let index_begin, delete_count, new_obj, new_value

    index_begin  = 1
    delete_count = 1
    new_obj      = jsonpath.update(old_obj, path_arr, 'splice', index_begin, delete_count)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(3)

    expect(arr_keys(new_obj)).toEqual(['b','bbb','bbbb'])
  })

  it('should update Array: splice (start: positive, deleteCount: 2, items: undefined)', function() {
    let index_begin, delete_count, new_obj, new_value

    index_begin  = 1
    delete_count = 2
    new_obj      = jsonpath.update(old_obj, path_arr, 'splice', index_begin, delete_count)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(2)

    expect(arr_keys(new_obj)).toEqual(['b','bbbb'])
  })

  it('should update Array: splice (start: positive, deleteCount: 2, items: 2)', function() {
    let index_begin, delete_count, new_keys, new_items, new_obj, new_value

    index_begin  = 1
    delete_count = 2
    new_keys     = ["new_element_1","new_element_2"]
    new_items    = new_keys.map(new_key => ({[new_key]: true}))
    new_obj      = jsonpath.update(old_obj, path_arr, 'splice', index_begin, delete_count, ...new_items)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(4)

    expect(arr_keys(new_obj)).toEqual(['b',...new_keys,'bbbb'])
  })

  it('should update Array: splice <Array>(start: positive, deleteCount: 2, items: 2)', function() {
    let index_begin, delete_count, new_keys, new_items, new_obj, new_value

    index_begin  = 1
    delete_count = 2
    new_keys     = ["new_element_1","new_element_2"]
    new_items    = new_keys.map(new_key => ({[new_key]: true}))
    new_obj      = jsonpath.update(old_obj, path_arr, 'splice', [index_begin, delete_count, ...new_items])

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_arr)
    expect(new_value instanceof Array).toBe(true)
    expect(new_value.length).toBe(4)

    expect(arr_keys(new_obj)).toEqual(['b',...new_keys,'bbbb'])
  })

  it('should update Object: delete 1 key', function() {
    let obj_key, new_obj, new_value

    obj_key = 'aaaaa'
    new_obj = jsonpath.update(old_obj, path_obj, 'delete', obj_key)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_obj)
    expect(new_value instanceof Object).toBe(true)

    expect(Object.keys(new_value)).toEqual([])
  })

  it('should update Object: add 3 keys (to hashtable)', function() {
    let obj_addition, new_keys, new_obj, new_value

    obj_addition = {}
    new_keys     = ["new_element_1","new_element_2"]
    new_keys.forEach((new_key, index) => {
      obj_addition[new_key] = index + 1
    })

    new_obj = jsonpath.update(old_obj, path_obj, 'add', obj_addition)

    expect(new_obj).not.toBe(old_obj)

    new_value = jsonpath.value(new_obj, path_obj)
    expect(new_value instanceof Object).toBe(true)

    expect(new_value).toEqual({aaaaa: 'hello', new_element_1: 1, new_element_2: 2})
  })
})
