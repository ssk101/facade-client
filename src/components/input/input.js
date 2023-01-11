import { FacadeComponent } from '../../lib/classes.js'
import { Define, Template, Styles, Attribute } from '../../lib/decorators.js'
import template from './input.pug'
import css from './input.styl'

@Define('facade')
@Template(template)
@Styles(css)
@Attribute('changed', Boolean)
export default class Input extends FacadeComponent {

}
