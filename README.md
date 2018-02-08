### [immutable-jsonpath](https://github.com/warren-bank/immutable-jsonpath)

#### Summary:

[jsonpath](https://github.com/dchester/jsonpath) enhancement: extends class prototype with immutable assignment of value to pathExpression

#### Installation:

```bash
npm install --save 'jsonpath'
npm install --save '@warren-bank/immutable-jsonpath'
```

#### Methods:

- - - -

__jsonpath.assign(obj, pathExpression, newValue)__

Returns a clone of `obj` having the following properties:
* every node traversed between the root (`$`) and the target path node (`pathExpression`) are also cloned
* the target path node (`pathExpression`) is replaced by `newValue`

```javascript
const jsonpath = require('jsonpath')

// apply enhancement to jsonpath class prototype
require('@warren-bank/immutable-jsonpath')(jsonpath)

const deepFreeze = require('deep-freeze')
deepFreeze(data)

const newData = jsonpath.assign(data, '$.store.bicycle.color', 'blue')

// cloned Objects
expect(newData).not.toBe(data)
expect(newData.store).not.toBe(data.store)
expect(newData.store.bicycle).not.toBe(data.store.bicycle)
expect(newData.store.bicycle.color).not.toBe(data.store.bicycle.color)

// not cloned
expect(newData.store.book).toBe(data.store.book)
```

- - - -

__jsonpath.update(obj, pathExpression, operation, ...data)__

Returns a clone of `obj` having the following properties:
* every node traversed between the root (`$`) and the target path node (`pathExpression`) are also cloned
* the clone of the target path node (`pathExpression`) is a collection data type:
  * `Array` or `Object`
* the clone of the target path node (`pathExpression`) has been updated by an `operation`
  * `operation` is a string
  * `data` contains parameters to configure the behavior of the `operation`
    * its length and data types are dependent upon the particular `operation`

_considerations:_

* this can be thought of as a convenience method
  * to update a collection (ie: Array, Object) at `pathExpression` in `obj`
    * a common pattern may emerge:
      ```javascript
      let old_val = jsonpath.value(obj, pathExpression)
      let new_val = {...old_val}
      // mutate new_val
      // assign new_val to `pathExpression` in `obj` resulting in a clone of the Object
      let new_obj = jsonpath.assign(obj, pathExpression, new_val)
      ```
    * this can become tedious
    * the way `new_val` is mutated in the vast majority of cases is fairly predictable
    * much of this boilerplate can be performed by a helper function

* my first inclination was to borrow the API convention used by [immutability-helper](https://github.com/kolodny/immutability-helper)
  * instead, I decided to simplify the API and only focus on the primary use cases
    * anything more complicated can follow the above pattern and take complete control of the update operation

_operations:_

* to perform on an `Array`:
  * `delete`
    * removes 1+ elements from Array beginning at a start index
    * `data`:
      * &lt;integer&gt;start
        * index of first element to delete
        * a negative value is subtracted from the length of the Array
      * [&lt;integer&gt;deleteCount]
        * count of elements to delete at `start`
        * default = 1
    * notes:
      * `data` can be passed to the function as either:
        * a single Array value
        * individual arguments
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'delete', 1)
      expect(clone.path.to.arr).toEqual(["a","c"])
      ```
  * `shift`
    * removes the first element from Array
    * note:
      * the element is discarded
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'shift')
      expect(clone.path.to.arr).toEqual(["b","c"])
      ```
  * `pop`
    * removes the last element from Array
    * note:
      * the element is discarded
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'pop')
      expect(clone.path.to.arr).toEqual(["a","b"])
      ```
  * `unshift`
    * inserts 1 element to the beginning of the Array
    * `data`:
      * &lt;Any&gt;value
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'unshift', '0')
      expect(clone.path.to.arr).toEqual(["0","a","b","c"])
      ```
  * `push`
    * inserts 1 element to the end of the Array
    * `data`:
      * &lt;Any&gt;value
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'push', '4')
      expect(clone.path.to.arr).toEqual(["a","b","c","4"])
      ```
  * `concat_start`
    * concatenates the elements of an input Array to the beginning of the Array
    * `data`:
      * &lt;Array&gt;value
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'concat_start', ["0","1","2"])
      expect(clone.path.to.arr).toEqual(["0","1","2","a","b","c"])
      ```
  * `concat_end`
    * concatenates the elements of an input Array to the end of the Array
    * `data`:
      * &lt;Array&gt;value
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'concat_end', ["4","5","6"])
      expect(clone.path.to.arr).toEqual(["a","b","c","4","5","6"])
      ```
  * `slice`
    * replaces the Array with a contiguous subset of its elements
    * same input parameters as [Array.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
    * `data`:
      * &lt;integer&gt;start
        * index of first element to extract into subset
        * a negative value is subtracted from the length of the Array
      * [&lt;integer&gt;end]
        * index of first element (following `start`) to exclude from contiguous subset
        * a negative value is subtracted from the length of the Array
        * default = length of the Array
    * notes:
      * `data` can be passed to the function as either:
        * a single Array value
        * individual arguments
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'slice', 0, 2)
      expect(clone.path.to.arr).toEqual(["a","b"])
      ```
  * `splice`
    * changes the contents of the Array by removing existing elements and/or adding new elements
    * same input parameters as [Array.splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
    * `data`:
      * &lt;integer&gt;start
        * index of element at which to start changing the Array
        * a negative value is subtracted from the length of the Array
      * [&lt;integer&gt;deleteCount]
        * count of elements to delete, beginning at `start`
        * default = all elements following `start`
      * [&lt;Any&gt;item1, &lt;Any&gt;item2, ...]
        * elements to add to the Array, beginning at `start`
    * notes:
      * `data` can be passed to the function as either:
        * a single Array value
        * individual arguments
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const clone = jsonpath.update(data, '$.path.to.arr', 'splice', 2, 1, "3")
      expect(clone.path.to.arr).toEqual(["a","b","3"])
      ```
  * `filter`
    * replaces the Array with a filtered subset of elements
    * similar behavior to [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
    * `data`:
      * &lt;Function&gt;callback
        * parameters passed to `callback`:
          * `element`
            * current element being processed
          * `index`
            * index of the current element being processed
        * return value from `callback`:
          * boolean
            * `true` indicates that `element` is included in resulting subset
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const fn    = element => element === 'b'
      const clone = jsonpath.update(data, '$.path.to.arr', 'filter', fn)
      expect(clone.path.to.arr).toEqual(["b"])
      ```
    * reminder / warning:
      * each `element` passed to `callback` is a value held in `obj`
      * you are responsible for writing the `callback` in such a way that `element` is not mutated
  * `map`
    * replaces the Array with a new Array
      * same length as original Array
      * elements are mapped by a `callback` function
    * similar behavior to [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    * `data`:
      * &lt;Function&gt;callback
        * parameters passed to `callback`:
          * `element`
            * current element being processed
          * `index`
            * index of the current element being processed
        * return value from `callback`:
          * mapped value of `element`
    * example:
      ```javascript
      const data  = {path: {to: {arr: ["a","b","c"]}}}
      const fn    = element => `(${element})`
      const clone = jsonpath.update(data, '$.path.to.arr', 'map', fn)
      expect(clone.path.to.arr).toEqual(["(a)","(b)","(c)"])
      ```
    * reminder / warning:
      * each `element` passed to `callback` is a value held in `obj`
      * you are responsible for writing the `callback` in such a way that `element` is not mutated
      * if `element` is a reference to a collection, you must clone it before making any changes
        * `jsonpath.assign` and `jsonpath.update` are intended for this exact purpose

* to perform on an `Object`:
  * `delete`
    * removes a single attribute
    * `data`:
      * &lt;string&gt;key
        * attribute key to remove from the Object
    * example:
      ```javascript
      const data  = {path: {to: {obj: {a:"a", b:"b", c:"c"}}}}
      const clone = jsonpath.update(data, '$.path.to.obj', 'delete', 'b')
      expect(clone.path.to.obj).toEqual({a:"a", c:"c"})
      ```
  * `add`
    * merges data from an input Object into the Object
    * `data`:
      * &lt;Object&gt;value
    * example:
      ```javascript
      const data  = {path: {to: {obj: {a:"a", b:"b", c:"c"}}}}
      const clone = jsonpath.update(data, '$.path.to.obj', 'add', {d:"d", e:"e"})
      expect(clone.path.to.obj).toEqual({a:"a", b:"b", c:"c", d:"d", e:"e"})
      ```
  * `subtract`
    * removes 1+ attributes
    * `data`:
      * &lt;Object | Array&gt;value
        * collection of attribute keys to remove from the Object
    * example:
      ```javascript
      const data  = {path: {to: {obj: {a:"a", b:"b", c:"c"}}}}
      const clone = jsonpath.update(data, '$.path.to.obj', 'subtract', ["a","c"])
      expect(clone.path.to.obj).toEqual({b:"b"})
      ```

- - - -

#### More Examples:

* in node.js:
  * unit tests w/ jest:
    * [jsonpath.assign() to assign new data into immutable object](https://github.com/warren-bank/immutable-jsonpath/blob/master/tests/__tests__/assign.js)
    * [jsonpath.assign() to vivify non-existent nodes in path](https://github.com/warren-bank/immutable-jsonpath/blob/master/tests/__tests__/assign_vivify.js)
    * [jsonpath.update() to update existing data collections in immutable object](https://github.com/warren-bank/immutable-jsonpath/blob/master/tests/__tests__/update.js)

* in the web browser:
  * [run all of the above unit tests w/ jasmine](https://cdn.rawgit.com/warren-bank/immutable-jsonpath/master/browser-build/tests/index.html)

- - - -

#### Browser Build (transpiled to ES5):

* files in repo:
  * [minified javascript](https://github.com/warren-bank/immutable-jsonpath/blob/master/browser-build/dist/immutable_jsonpath.js)
  * [source map](https://github.com/warren-bank/immutable-jsonpath/blob/master/browser-build/dist/immutable_jsonpath.map)

* files hosted in CDN:
  * [minified javascript](https://cdn.rawgit.com/warren-bank/immutable-jsonpath/master/browser-build/dist/immutable_jsonpath.js)
  * [source map](https://cdn.rawgit.com/warren-bank/immutable-jsonpath/master/browser-build/dist/immutable_jsonpath.map)

* global variable(s):
  * N/A
    * the enhancement is applied to _jsonpath_ automatically
    * make certain that _jsonpath_ is loaded before the enhancement script

- - - -

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
