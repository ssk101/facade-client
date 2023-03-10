import { Define, Template, Styles } from '../../lib/decorators.js'
import template from './viewport.pug'
import css from './viewport.styl'

@Define('facade')
@Template(template)
@Styles(css)
export default class Viewport extends HTMLElement {

}
