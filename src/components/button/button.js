import { FacadeComponent } from '../../lib/classes.js'
import { Define, Template, Styles, Attribute } from '../../lib/decorators.js'
import template from './button.pug'
import css from './button.styl'

@Define('facade')
@Template(template)
@Styles(css)
@Attribute('disabled', Boolean)
@Attribute('href', String)
@Attribute('target', String, { default: '_blank' })
@Attribute('variant', String, { default: 'simple' })
export default class Button extends FacadeComponent {
  attached() {
    this.button = this.shadowRoot.querySelector('button')

    if(!this.href) {
      this.button.addEventListener('click', (e) => {
        this.emit('click', e)
      })
    }
  }
}
