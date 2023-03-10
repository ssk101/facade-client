import { Define, Attribute, Template, Styles } from '../../lib/decorators.js'
import template from './container.pug'
import css from './container.styl'
import '../sticky/sticky.js'

@Define('facade')
@Template(template)
@Styles(css)
@Attribute('no-data', Boolean)
@Attribute('collapsed', Boolean)
@Attribute('sticky-header', Boolean)
export default class Container extends HTMLElement {
  async created() {
    this.observe(this, ['no-data'], async() => {
      this.render()
    })
  }
  async $noDataChanged(changes) {
    this.render()
  }

  collapse() {
    this.collapsed = !this.collapsed
    this.emit('container:collapsed', { collapsed: this.collapsed })
    this.render()
  }
}
