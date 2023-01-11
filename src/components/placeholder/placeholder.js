import { FacadeComponent } from '../../lib/classes.js'
import { Define, Template, Styles } from '../../lib/decorators.js'
import template from './placeholder.pug'
import css from './placeholder.styl'

@Define('facade')
@Styles(css)
@Template(template)
export default class Placeholder extends FacadeComponent {

}
