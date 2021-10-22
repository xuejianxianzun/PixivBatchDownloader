let _wr = function (type) {
  let orig = history[type]
  return function () {
    let rv = orig.apply(this, arguments)
    let e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}
history.pushState = _wr('pushState')
history.replaceState = _wr('replaceState')
