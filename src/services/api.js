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
  async post(path, body, headers) {
    const url = await this.url(path)
    const data = {}

    if(body) {
      Object.assign(data, {
        method: 'POST',
        body: JSON.stringify(body),
      })
    }

    if(headers) {
      Object.assign(data, { headers })
    } else {
      Object.assign(data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
    }

    return fetch(url, data).then(res => res.json())
  }

  async url(path, params) {
    let search

    if(params) {
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