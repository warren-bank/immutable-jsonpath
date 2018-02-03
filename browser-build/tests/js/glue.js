window.require = path => {
  switch(path) {
    case "jsonpath":
      return window.jsonpath
    case "index.js":
      return arg => arg
    case "deep-freeze":
      return window.deepFreeze
  }
}

window.it.skip = window.xit
