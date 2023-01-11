import {
  constructStyles
} from './style.js'

import {
  assignAttribute,
} from './component.js'

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

export function Define(prefix) {
  return function define(Class) {
    const tagName = [
      prefix || window.$facade.componentPrefix || 'facade',
      Class.name
        .replace(/[A-Z]/g, (c) => { return '-' + c.toLowerCase() }),
    ].join('')

    if(!Class.attributes) {
      Class.attributes = {}
    }

    Object.defineProperty(Class, 'observedAttributes', {
      get: function() {
        return Object.keys(this.attributes)
      }
    })

    if(!customElements.get(tagName)) {
      customElements.define(tagName, Class)
    }

    return document.createElement(tagName)
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