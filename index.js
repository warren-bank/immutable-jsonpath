const assert = require('assert')

const enhancer = jsonpath => {
  jsonpath.JSONPath.prototype.assign = function(obj, path_string, value) {
    assert.ok(obj instanceof Object, "obj needs to be an object")
    assert.ok(path_string, "we need a path")
    assert.ok(value !== undefined, "we need a value")

    const path_to_leaf = this.parser.parse(path_string).map(component => component.expression.value)

    let result, ptr
    for (let i=0; i<path_to_leaf.length; i++) {
      const key = path_to_leaf[i]
      const key_next = (i === path_to_leaf.length - 1) ? undefined : path_to_leaf[i+1]
      const path_to_node = path_to_leaf.slice(0, i+1)
      const node = this.value(obj, path_to_node)
      const new_value = (i === path_to_leaf.length - 1)
        ? value
        : (node === undefined)
          ? (typeof key_next === 'string')
            ? {}
            : (typeof key_next === 'number')
              ? []
              : new Error('path contains the invalid key: ' + JSON.stringify(key_next))
          : (node instanceof Array)
            ? [...node]
            : (node instanceof Object)
              ? {...node}
              : new Error('path implicitly extends a leaf node that is not a collection')

      if (new_value instanceof Error) throw new_value

      if (i === 0) result = new_value
      else ptr[key] = new_value

      ptr = new_value
    }

    return result || obj
  }

  jsonpath.JSONPath.prototype.update = function(obj, path_string, operation, data, ...rest) {
    assert.ok(obj instanceof Object, "obj needs to be an object")
    assert.ok(path_string, "we need a path")
    assert.ok(typeof operation === 'string', "we need an operation")

    const old_value = this.value(obj, path_string)
    const error_msg = {
      path: 'path does not resolve to a collection',
      op:   'operation is not valid',
      data: 'data is not valid'
    }

    if (old_value === undefined) {
      throw new Error(error_msg.path)
    }
    else if (old_value instanceof Array) {
      let new_value, new_obj
      let processed = false

      // operations that are special cases for 'splice'
      switch (operation.toLowerCase()) {
        case 'delete':
          assert.ok(typeof data === 'number', "data is needed")
          let deleteCount = (rest && rest.length) ? rest[0] : 1
          operation = 'splice'
          data = [data, deleteCount]
          break;
      }

      // operations that are special cases for 'slice'
      switch (operation.toLowerCase()) {
        case 'shift':
          operation = 'slice'
          data = [1, old_value.length]
          break;
        case 'pop':
          operation = 'slice'
          data = [0, old_value.length - 1]
          break;
      }

      switch (operation.toLowerCase()) {
        case 'unshift':
          assert.ok(data !== undefined, "data is needed")
          new_value = [data, ...old_value]
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'push':
          assert.ok(data !== undefined, "data is needed")
          new_value = [...old_value, data]
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'concat_start':
          assert.ok(data instanceof Array, "data Array is needed")
          new_value = [...data, ...old_value]
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'concat_end':
          assert.ok(data instanceof Array, "data Array is needed")
          new_value = [...old_value, ...data]
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'slice':
          if (typeof data === 'number') {
            data = (rest && rest.length)
              ? [data, ...rest]
              : [data]
          }
          assert.ok(data instanceof Array, "data Array is needed")
          new_value = old_value.slice(...data)
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'splice':
          if (typeof data === 'number') {
            data = (rest && rest.length)
              ? [data, ...rest]
              : [data]
          }
          assert.ok(data instanceof Array, "data Array is needed")
          new_value = [...old_value]
          new_value.splice(...data)
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'filter':
          assert.ok(data instanceof Function, "filter Function is needed")
          new_value = [...old_value]
          new_value = new_value.filter((element, index) => data(element, index))
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'map':
          assert.ok(data instanceof Function, "map Function is needed")
          new_value = [...old_value]
          new_value = new_value.map((element, index) => data(element, index))
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        default:
          throw new Error(error_msg.op)
      }

      return new_obj
    }
    else if (old_value instanceof Object) {
      let new_value, new_obj

      switch (operation.toLowerCase()) {
        case 'delete':
          assert.ok(typeof data === 'string', "data is needed")
      //  new_value = {...old_value, [data]: undefined}
      //  new_value = Object.assign({}, old_value, {[data]: undefined})
          new_value = {...old_value}; delete new_value[data]
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'add':
          assert.ok(data instanceof Object, "data Object is needed")
      //  new_value = {...old_value, ...data}
          new_value = Object.assign({}, old_value, data)
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        case 'subtract':
          if ((data instanceof Object) && !(data instanceof Array)) {
            data = Object.keys(data)
          }
          assert.ok(data instanceof Array, "data <Object|Array> is needed")
          new_value = {...old_value}
          data.forEach(key => {
            delete new_value[key]
          })
          new_obj   = this.assign(obj, path_string, new_value)
          break;
        default:
          throw new Error(error_msg.op)
      }

      return new_obj
    }
    else {
      throw new Error(error_msg.path)
    }
  }
}

module.exports = enhancer
