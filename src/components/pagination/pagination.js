import { Define, Attribute, Template, Styles } from '../../lib/decorators.js'
import  { clamp } from '@steelskysoftware/facade-toolbox'
import template from './pagination.pug'
import css from './pagination.styl'
import '../button/button.js'

@Define('facade')
@Template(template)
@Styles(css)
@Attribute('page', Number, { default: 0 })
@Attribute('per-page', Number, { default: 25 })
@Attribute('total', Number)
@Attribute('display-total', Boolean)
@Attribute('context', String)
@Attribute('disabled', Boolean)
export default class Pagination extends HTMLElement {
  changePage(dir) {
    switch(dir) {
      case 'first': {
        this.page = 0
        break
      }
      case 'prev': {
        this.page = clamp(this.page - 1, 0, this.totalPages || Infinity)
        break
      }
      case 'next': {
        this.page = clamp(this.page + 1, 0, this.totalPages || Infinity)
        break
      }
      case 'last': {
        if(!this.totalPages) {
          break
        }

        this.page = this.totalPages
        break
      }
      default: {
        break
      }
    }

    this.render()

    this.emit('fa:pagination', {
      context: this.context,
      page: this.page,
    })
  }

  gotoPage(e) {
    if(e.keyCode !== 13) return

    let page = clamp(e.target.value - 1, 0, this.totalPages || Infinity)

    this.emit('fa:pagination', {
      context: this.context,
      page,
    })
  }

  get totalPages() {
    if(!this.total) return 0
    return Math.floor(this.total / this.perPage)
  }
}
