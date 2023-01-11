import { FacadeComponent } from '../../lib/classes.js'
import { Define, Attribute, Template, Styles } from '../../lib/decorators.js'
import template from './loading.pug'
import css from './loading.styl'

@Define('facade')
@Template(template)
@Styles(css)
@Attribute('loading-text', String)
export default class Loading extends FacadeComponent {
  async created() {
    this.observe(this, ['loading-text'], async() => {
      this.render()
    })
  }

  async $loadingTextChanged(changes) {
    this.render()
  }

  get loadingTextPrefixed() {
    if(this.loadingText) {
      return `Loading: ${this.loadingText}`
    }
    return ''
  }
}
