// 封装操作 IndexedDB 的一些公共方法，仅满足本程序使用，并不完善
class IndexedDB {
  public db: IDBDatabase | undefined

  public async open(
    DBName: string,
    DBVer: number,
    onUpgrade?: (db: IDBDatabase) => void,
  ) {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DBName, DBVer)

      request.onupgradeneeded = ev => {
        if (onUpgrade) {
          onUpgrade(request.result)
        }
      }

      request.onsuccess = ev => {
        this.db = request.result
        resolve(request.result)
      }

      request.onerror = ev => {
        console.error('open indexDB failed')
        reject(ev)
      }
    })
  }

  public async add(storeNames: string, data: object) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const r = this.db
        .transaction(storeNames, 'readwrite')
        .objectStore(storeNames)
        .add(data)

      r.onsuccess = ev => {
        resolve(ev)
      }
      r.onerror = ev => {
        console.error('add failed')
        reject(ev)
      }
    })
  }

  public async getAll(storeNames: string) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const r = this.db
        .transaction(storeNames, 'readwrite')
        .objectStore(storeNames)
        .getAll()

      r.onsuccess = ev => {
        const data = r.result
        if (data) {
          resolve(data)
        }
        resolve(null)
      }
      r.onerror = ev => {
        console.error('getAll failed')
        reject(ev)
      }
    })
  }

  public async put(storeNames: string, data: object) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const r = this.db
        .transaction(storeNames, 'readwrite')
        .objectStore(storeNames)
        .put(data)
      r.onsuccess = ev => {
        resolve(ev)
      }
      r.onerror = ev => {
        console.error('put failed')
        reject(ev)
      }
    })
  }

  // 如果没有找到对应的记录，则返回 null
  public async get(storeNames: string, key: any, index?: string) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const store = this.db
        .transaction(storeNames, 'readonly')
        .objectStore(storeNames)

      let r: IDBRequest<any>

      if (index !== undefined) {
        const i = store.index(index)
        r = i.get(key)
      } else {
        r = store.get(key)
      }

      r.onsuccess = ev => {
        const data = r.result
        if (data) {
          resolve(data)
        }
        resolve(null)
      }

      r.onerror = ev => {
        console.error('add failed')
        reject(ev)
      }
    })
  }

  public async delete(storeNames: string, key: number) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const r = this.db
        .transaction(storeNames, 'readwrite')
        .objectStore(storeNames)
        .delete(key)

      r.onsuccess = ev => {
        resolve(ev)
      }
      r.onerror = ev => {
        console.error('delete failed')
        reject(ev)
      }
    })
  }

  public async clear(storeNames: string) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const r = this.db
        .transaction(storeNames, 'readwrite')
        .objectStore(storeNames)
        .clear()

      r.onsuccess = ev => {
        resolve()
      }
      r.onerror = ev => {
        console.error('clear failed')
        reject(ev)
      }
    })
  }

  public async openCursor(
    storeNames: string,
    CB: (c: IDBCursorWithValue | null) => void,
  ) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const r = this.db
        .transaction(storeNames)
        .objectStore(storeNames)
        .openCursor()

      r.onsuccess = ev => {
        CB(r.result)
        resolve() // 这个 resolve 会在 cb 执行一次之后就触发
      }
      r.onerror = ev => {
        console.error('openCursor failed')
        reject(ev)
      }
    })
  }
}

export { IndexedDB }
