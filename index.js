const assert = require('assert')

const enhancer = jsonpath => {
  jsonpath.JSONPath.prototype.assign = function(obj, path_string, value) {
    assert.ok(obj instanceof Object, "obj needs to be an object")
    assert.ok(path_string, "we need a path")
    assert.ok(value, "we need a value")

    const path_to_leaf = this.parser.parse(path_string).map(component => component.expression.value)

    let result, ptr
    for (let i=0; i<path_to_leaf.length; i++) {
      const key = path_to_leaf[i]
      const path_to_node = path_to_leaf.slice(0, i+1)
      const node = this.value(obj, path_to_node)
      const new_value = (i === path_to_leaf.length - 1)
        ? value
        : (node === undefined)
          ? {}
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
}

module.exports = enhancer
