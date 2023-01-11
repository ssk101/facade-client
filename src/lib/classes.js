import {
  wait,
} from '@steelskysoftware/facade-toolbox'

import { render } from './component.js'

export class FacadeComponent extends HTMLElement {
  constructor() {
    super()
    this.createdCallback()
  }

  createdCallback() {
    if(this.$$created) return
    this.$$created = true

    this.attachShadow({
      mode: 'open',
    })

    this.created && this.created()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue !== newValue) {
      this.render()
    }

    this.attributeChanged && this.attributeChanged(name, oldValue, newValue)
  }

  connectedCallback() {
    if(this.$$connected) return
    this.$$connected = true
    this.render(() => {
      this.connected && this.connected()
    })
  }

  disconnectedCallback() {
    this.disconnected && this.disconnected()
  }

  adoptedCallback() {
    this.adopted && this.adopted()
  }

  render(callback) {
    return render(this, callback)
  }

  emit(name, data = {}, options = { bubbles: true, composed: true }) {
    if(data.detail) {
      options.detail = data.detail
      delete data.detail
    }

    this.dispatchEvent(Object.assign(new CustomEvent(name, options), data))
    return this
  }

  on(event, callback) {
    this.addEventListener(event, (e) => callback(e))
  }

  setState(...args) {
    Object.assign(this, ...args)
    return render(this)
  }

  async wait(t = 1000) {
    return wait(t)
  }
}
