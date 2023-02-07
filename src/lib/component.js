import differ from 'virtual-dom'
import { camelCase } from '@steelskysoftware/facade-toolbox'

const { VNode, diff, patch, create, h } = differ
const CALLBACKS = []
const QUEUE = new Set()
const CACHE = new WeakMap()
let next = Promise.resolve()

export function render(element, callback) {
  if(QUEUE.size === 0) next = next.then(attempt)
  if(typeof callback === 'function') { CALLBACKS.push(callback) }
  QUEUE.add(element)
  return next
}

function attempt() {
  try {
    apply()
  } catch (e) {
    console.error(e)
  } finally {
    QUEUE.clear()
    while(CALLBACKS.length) CALLBACKS.pop()()
  }
}

function renderElement(element) {
  const target = element.shadowRoot || element
  const cached = CACHE.get(element)
  const previous = cached || new VNode(target.nodeName)

  const { constructedSheet, styles } = element
  let template = []

  if(styles && (!element.shadowRoot || !constructedSheet)) {
    const styleNode = h('style', styles)
    template.unshift(styleNode)
  } else if(element.shadowRoot && constructedSheet) {
    element.shadowRoot.adoptedStyleSheets = [constructedSheet]
  }

  if(element.template) {
    template = template.concat(element.template(element))
  }

  if(!cached && target.childNodes?.length) {
    let child = target.firstChild

    while(child) {
      const next = child.nextSibling
      target.removeChild(child)
      child = next
    }
  }

  if(!element.shadowRoot && !cached) {
    element.innerHTML = ''
  }

  const current = new VNode(target.nodeName, null, template)
  const changes = diff(previous, current)

  patch(target, changes)

  CACHE.set(element, current)
}

function apply() {
  for(const element of QUEUE) {
    renderElement(element)
  }
}

export function assignAttribute(attr, Type = String, Class, opts = {}) {
  const get = function get() {
    const val = this.getAttribute(attr)

    if(val === null) {
      if(typeof opts.default === 'function') {
        return opts.default(this)
      }

      return opts.default
    }

    if(Type === Boolean) {
      return val != null && val != 'false'
    }

    if(val && (Type === Array || Type === JSON)) {
      try {
        return JSON.parse(val)
      } catch (e) {
        console.error(e)
      }
    }

    return !Type.prototype
      ? val
      : new Type(val).valueOf()
  }

  const set = function set(val) {
    if(val == null) {
      return this.removeAttribute(attr)
    }

    if(Type === Array || Type === JSON) {
      return this.setAttribute(attr, JSON.stringify(val))
    }

    if(!Type.prototype) {
      return this.setAttribute(attr, Type(val))
    }

    this.setAttribute(attr, val)
  }

  const created = Class.prototype.created

  Class.prototype.created = function() {
    Object.defineProperty(this, camelCase(attr), {
      get, set,
    })
    return created ? created.apply(this, arguments) : void 0
  }
}
