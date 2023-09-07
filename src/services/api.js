export class Api {
  constructor() {}

  async get(path, params) {
    const url = await this.url(path, params)
    const response = await fetch(url)
    const { status, headers } = response
    const contentType = headers.get('content-type')

    if(response.ok) {
      if(contentType.match(/^image\/\w*$/)) return response.blob()
      return response.json()
    } else {
      return new Error(response.statusText)
    }
  }
  async post(path, body, headers = {}) {
    const url = await this.url(path)
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    const isForm = body.constructor?.name === 'FormData'

    const data = {
      ...!isForm && { headers: Object.assign({}, defaultHeaders, headers) }
    }

    if(body) {
      Object.assign(data, {
        method: 'POST',
        body: isForm ? body : JSON.stringify(body),
      })
    }

    return fetch(url, data).then(res => res.json())
  }

  async url(path, params) {
    let search

    if(Object.keys(params || {}).length) {
      search = new URLSearchParams()

      for(const key in params) {
        if(typeof params[key] === 'object') {
          for(const v of params[key]) {
            search.append(`${key}[]`, v)
          }
        } else {
          search.append(key, params[key])
        }
      }

      params = search.toString()
    }

    return `${path}${search ? '?' + search.toString() : ''}`
  }
}