const assert = require('assert')

const enhancer = jsonpath => {
  jsonpath.JSONPath.prototype.assign = function(obj, path, value) {
    assert.ok(obj instanceof Object, "obj needs to be an object")
    assert.ok(path,  "we need a path")
    assert.ok(value, "we need a value")

    // ordered from root to path node
    const ancestry = []

    let node = this.nodes(obj, path).shift()
    if (!node) return this._vivify(obj, path, value)

    const chunks = node.path

    const breadcrumbs = []
    while (chunks.length) {
      let key, node_path, node

      key = chunks.shift()
      breadcrumbs.push(key)

      node_path = this.stringify(breadcrumbs)
      node      = this.nodes(obj, node_path).shift().value

      ancestry.push({key, node})
    }

    let result, ptr
    ancestry.forEach(({key, node}, index) => {
      if (!index) {
        assert.ok(node === obj, "sanity check: first ancestor node must be the input object")

        result = {...node}
        ptr = result
      }
      else if (index < ancestry.length - 1) {
        ptr[key] = {...node}
        ptr = ptr[key]
      }
      else {
        ptr[key] = value
      }
    })

    return result || obj
  }
}

module.exports = enhancer
