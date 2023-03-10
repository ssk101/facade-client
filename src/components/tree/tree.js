import {
  Define,
  Template,
  Styles,
  Input,
} from '../../lib/decorators.js'
import template from './tree.pug'
import css from './tree.styl'

@Define('facade')
@Template(template)
@Styles(css)
@Input('tree', JSON, { default: {} })
export default class Tree extends HTMLElement {
  connected() {
    this.state = Object.keys(this.tree).reduce((acc, groupName) => {
      acc[groupName] = { collapsed: false }
      return acc
    }, {})
  }

  toggleEdit(e, index) {
    if(e.type === 'keyup' && e.keyCode === 13) {
      this.render(this.editing[index] = false)
    }
    if(e.type === 'click') {
      this.render(this.editing[index] = true)
      this.shadow
    }
  }

  toggleCollapse(groupName) {
    this.state[groupName].collapsed = !this.state[groupName].collapsed
    this.render()
  }
}