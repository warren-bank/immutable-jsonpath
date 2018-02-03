### [immutable-jsonpath](https://github.com/warren-bank/immutable-jsonpath)

#### Summary:

[jsonpath](https://github.com/dchester/jsonpath) enhancement: extends class prototype with immutable assignment of value to pathExpression

#### Installation:

```bash
npm install --save 'jsonpath'
npm install --save '@warren-bank/immutable-jsonpath'
```

- - - -

#### Methods:

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

#### More Examples:

* in node.js:
  * [unit tests w/ jest](https://github.com/warren-bank/immutable-jsonpath/blob/master/tests/__tests__/index.js)

* in the web browser:
  * [unit tests w/ jasmine](https://cdn.rawgit.com/warren-bank/immutable-jsonpath/master/browser-build/tests/index.html)

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
