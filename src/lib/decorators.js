import {
  wait,
} from '@steelskysoftware/facade-toolbox'

import {
  constructStyles
} from './style.js'

import {
  assignAttribute,
  render,
} from './component.js'

let ELEMENTS

function element(tag, ...values) {
  var [tagName, ...classes] = tag.split('.')
  var element = document.createElement(tagName || 'div')
  element.className = classes.join(' ')
  values.forEach(value => {
    if(typeof value === 'string') {
      element.textContent = value
    } else if(value instanceof Node) {
      element.appendChild(value)
    } else if(Array.isArray(value)) {
      value.forEach(function(value) {
        if(typeof value === 'string') {
          element.appendChild(document.createTextNode(value))
        } else {
          element.appendChild(value)
        }
      })
    } else if(value && typeof value === 'object') {
      Object.assign(element, value)
      Object.keys(value).forEach(key => {
        if(typeof value[key] !== 'object') {
          element.setAttribute(key, value[key])
        }
      })
    }
  })
  return element
}

export function Attribute(attr, Type, opts = {}) {
  return function assign(Class) {
    if(!Class.attributes) {
      Class.attributes = {}
    }

    Class.attributes[attr] = Type
    return assignAttribute(attr, Type, Class, opts)
  }
}

export function Template(method) {
  return function assign(Class) {
    Class.prototype.template = method
  }
}


function register(tagName, Class, opts = {}) {
  if(!ELEMENTS) ELEMENTS = new Map()
  if(!ELEMENTS.has(tagName)) {
    ELEMENTS.set(tagName, new Set())
  }
  var elements = ELEMENTS.get(tagName)

  Object.assign(Class.prototype, {
    createdCallback() {
      if(this.$$created) return
      this.$$created = true

      if(!this.shadowRoot) {
        this.attachShadow({
          mode: 'open',
        })
      }

      if(this.created) this.created()
    },
    connectedCallback() {
      if(this.$$connected) return
      this.$$connected = true
      elements.add(this)

      this.render(() => {
        this.connected && this.connected()
      })
    },
    disconnectedCallback() {
      this.disconnected && this.disconnected()
    },
    adoptedCallback() {
      this.adopted && this.adopted()
    },
    attributeChangedCallback(name, oldValue, newValue) {
      if(oldValue !== newValue) {
        this.render()
      }

      this.attributeChanged && this.attributeChanged(name, oldValue, newValue)
    },
    render: function(callback) {
      return render(this, callback)
    },
    emit(name, data = {}, options = { bubbles: true, composed: true }) {
      if(data.detail) {
        options.detail = data.detail
        delete data.detail
      }

      this.dispatchEvent(Object.assign(new CustomEvent(name, options), data))
      return this
    },
    on(event, callback) {
      this.addEventListener(event, (e) => callback(e))
    },
    setState(...args) {
      Object.assign(this, ...args)
      return render(this)
    },
    wait: async function(t = 1000) {
      return wait(t)
    },
  })

  if(!customElements.get(tagName)) {
    customElements.define(tagName, class FacadeComponent extends Class {
      constructor() {
        super()
        this.createdCallback && this.createdCallback()
      }
    })
  } else {
    const target = customElements.get(tagName)
    const description = Object.getOwnPropertyDescriptors(target.prototype)
    const staticDescription = Object.getOwnPropertyDescriptors(target)

    try {
      Object.keys(description)
        .forEach(property => {
          Object.defineProperty(
            target.prototype,
            property,
            description[property]
          )
        })
      Object.keys(staticDescription)
        .forEach(property => {
          if(property === 'prototype') {
            return
          }
          Object.defineProperty(target, property, staticDescription[property])
        })
    } catch (e) {
      console.error(e)
    }

    transfer(target, Class)

    for(const element of elements) {
      element.render()
    }
  }

  return Class
}

export function Define(prefix, opts) {
  return function define(Class) {
    if(!Class.attributes) {
      Class.attributes = {}
    }

    Object.defineProperty(Class, 'observedAttributes', {
      get: function() {
        return Object.keys(this.attributes)
      }
    })

    const tagName = [
      prefix || window.$facade.componentPrefix || 'facade',
      Class.name
      .replace(/[A-Z]/g, (c) => { return '-' + c.toLowerCase() }),
    ].join('')

    register(tagName, Class, opts)
    return element.bind(null, tagName)
  }
}

export function Input(property, Type, options = {}) {
  const prop = Symbol.for(property)

  return function define(Class) {
    Object.defineProperty(Class.prototype, property, {
      configurable: true,
      get() {
        const val = this[prop]

        if(typeof val === 'undefined' || val === null) {
          return options.default || val
        }

        if(val && typeof val === 'string' && (Type === Array || Type === JSON)) {
          try {
            return JSON.parse(val)
          } catch (e) {
            return val
          }
        }

        return val
      },
      set(value) {
        if(this[prop] === value) {
          return
        }

        const changes = Object.assign({}, {
          prev: this[prop],
          current: value,
        })

        const cb = this[`$${property}Changed`]

        this[prop] = value
        this.render()

        if(typeof cb === 'function') {
          cb.call(this, changes)
        }

      },
    })
  }
}

export function Styles(styles) {
  return function assign(Class) {
    const { css, constructedSheet } = constructStyles(styles)
    Class.prototype.styles = css
    Class.prototype.constructedSheet = constructedSheet
  }
}