import { Api } from '../services/api'
const api = new Api()

export class Model {

}

export function model(name) {
  return function(Class) {
    const props =  Object.getOwnPropertyDescriptors(Class.prototype)

    for(const prop in props) {
      Object.defineProperty(Class, prop, props[prop])
    }
    return Class
  }
}

export function Endpoint(endpoint) {
  const root = window.$facade.apiRoot || window.$facade.api || ''

  function getPath(path) {
    return [
      root,
      endpoint,
      path,
    ]
      .filter(part => part)
      .join('/')
  }

  return function(Model) {
    Model.load = async function(path, params = {}) {
      return api.get(getPath(path), params)
    }

    Model.post = async function(path, payload = {}, headers) {
      return api.post(getPath(path), payload, headers)
    }

    Model.prototype.load = Model.load
    Model.prototype.post = Model.post
  }
}


