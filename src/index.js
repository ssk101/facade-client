import { initRoutes } from './lib/router.js'
import { appendStyles } from './lib/style.js'
import styles from './styles/variables.styl'

appendStyles(styles, document)

window.$facade = {}

export async function bootstrap(options) {
  const { routes, styles } = options
  appendStyles(styles, document)

  window.$facade = options

  initRoutes(routes || [])
  await import('./components/viewport/viewport.js')
  window.dispatchEvent(new Event('hashchange'))
}

export {
  FacadeComponent,
} from './lib/classes.js'

export {
  Define,
  Template,
  Styles,
  Attribute,
  Input,
} from './lib/decorators.js'

export {
  appendStyles,
  constructStyles,
} from './lib/style.js'

export { Model, model, Endpoint } from './lib/model.js'
export { Api } from './services/api.js'
export { emit, listen } from './services/event.js'
export { h }
