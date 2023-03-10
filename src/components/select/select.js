import { Define, Template, Styles, Attribute } from '../../lib/decorators.js'
import template from './select.pug'
import css from './select.styl'

@Define('facade')
@Template(template)
@Styles(css)
@Attribute('value', String)
@Attribute('disabled', Boolean)
@Attribute('no-blank', Boolean)
@Attribute('placeholder', String, { default: 'Select option' })
export default class Select extends HTMLElement {
  created() {
    this.observer = new MutationObserver((list, observer) => {
      this.render()
    })
  }

  connected() {
    this.observer.observe(this, {
      childList: true,
      attributes: true,
    })
  }

  disconnected() {
    this.observer.disconnect()
  }

  select(e) {
    const option = e.target.selectedOptions[0]
    this.value = option.value
    const data = Object.assign({ value: this.value }, option)
    this.emit('select', data)
    this.render()
  }

  get options() {
    return Array.from(this.querySelectorAll('option'))
  }
}
