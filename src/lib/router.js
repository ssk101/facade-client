const ROUTES = new Set()
let initialized

const rootPath = (path) => {
  return path.split('/').filter(p => p)[0]
}

const parseLocation = () => {
  let path

  if(location.hash) {
    path = location.hash.replace('#!', '')
  } else {
    path = location.pathname.slice(1).toLowerCase() || '/'
  }

  return path
}

const findRouteByPath = (path) => {
  return Array.from(ROUTES).find(r => {
    return rootPath(r.path) === rootPath(path)
  })
}

const paramsFor = (route) => {
  const parts = route.path.split('/').slice(2)

  const mappedParts = new Map()

  for(const [i, part] of parts.entries()) {
    if(part && part.includes(':')) {
      mappedParts.set(i, part.replace(/[:?]/g, ''))
    }
  }

  return { mappedParts }
}

const router = async () => {
  if(initialized) return
  initialized = true

  const path = parseLocation()
  const route = findRouteByPath(path)

  if(!route) return

  const imported = await route.component()
  const component = imported.default || typeof imported === 'function'
    ? imported()
    : imported

  if(!component) return

  assignParams(route, component)

  const viewport = (
    document.body.querySelector(`${window.$facade.componentPrefix}-viewport`) ||
    document.body.querySelector('facade-viewport')
  )

  if(!viewport) {
    return console.warn('No viewport found!')
  }

  viewport.innerHTML = ''

  component.setAttribute('slot', 'viewport')
  viewport.appendChild(component)
}

const assignParams = (route, component) => {
  let { keys, mappedParts } = mapFor(route)
  let result = keys.next()
  let params = location.pathname.split('/').slice(2).filter(p => p)

  while(!result.done) {
    const i = result.value
    const key = mappedParts.get(i)
    const paramValue = params[i]

    if(paramValue) {
      component.setAttribute(key, paramValue)
    }

    result = keys.next()
  }
}

const mapFor = (route) => {
  const { mappedParts } = paramsFor(route)
  const keys = mappedParts.keys()
  return { keys, mappedParts }
}

const pathFor = (route, params) => {
  let { keys, mappedParts } = mapFor(route)
  let result = keys.next()

  if(!params) {
    params = location.pathname.split('/').slice(2).filter(p => p)
  }

  const path = [rootPath(route.path)]

  while(!result.done) {
    const i = result.value
    const key = mappedParts.get(i)
    const paramValue = params[Array.isArray(params) ? i : key]

    if(paramValue) {
      path.push(paramValue)
    }

    result = keys.next()
  }

  return path.join('/')
}

export const routeFor = (name, params = {}) => {
  const route = Array.from(ROUTES).find(r => r.name === name)

  if(!route) {
    return console.warn(`Route for ${name} not found`)
  }

  const path = pathFor(route, params)
  return path
}

export const initRoutes = (routes) => {
  for(const route of routes) {
    ROUTES.add(route)
  }
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
