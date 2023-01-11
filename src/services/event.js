export function emit(el, name, data) {
  const event = new CustomEvent(name, { detail: data })
  el.dispatchEvent(event)
}

export function listen(to, event, cb) {
  const root = this.shadowRoot
  let target = to

  if(typeof to === 'string') {
    target = root.querySelector(to)
  }

  if(!target) return

  target.addEventListener(event, (e) => {
    return cb(e)
  })
}