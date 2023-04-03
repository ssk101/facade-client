import { openDB, DBSchema } from 'idb'

export class IDB {
  constructor(dbName, version = 1) {
    this.dbName = dbName
    this.version = version
  }

  log() {
    console.info('IDB:', ...arguments)
  }

  async getOrCreateStore(storeName) {
    const db = await openDB(this.dbName, this.version, {
      upgrade: (db) => {
        return db.createObjectStore(storeName)
      }
    })

    return db.transaction(storeName).objectStore(storeName)
  }

  async set(storeName, key, val) {
    return (await openDB(this.dbName)).put(storeName, val, key)
  }

  async get(storeName, key) {
    return (await openDB(this.dbName)).get(storeName, key)
  }

  async add(storeName, key, val) {
    return (await openDB(this.dbName)).add(storeName, key, val)
  }

  async delete(storeName, key) {
    return (await openDB(this.dbName)).delete(storeName, key)
  }

  async getAll(storeName) {
    return (await openDB(this.dbName)).getAll(storeName)
  }

  async getAllKeys(storeName) {
    return (await openDB(this.dbName)).getAllKeys(storeName)
  }
}