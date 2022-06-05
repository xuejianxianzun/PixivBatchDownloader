// 封装操作 IndexedDB 的一些公共方法，仅满足本程序使用，并不完善
class IndexedDB {
  public db: IDBDatabase | undefined

  public async open(
    DBName: string,
    DBVer: number,
    onUpgrade?: (db: IDBDatabase) => void
  ) {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DBName, DBVer)

      request.onupgradeneeded = (ev) => {
        if (onUpgrade) {
          onUpgrade(request.result)
        }
      }

      request.onsuccess = (ev) => {
        this.db = request.result
        resolve(request.result)
      }

      request.onerror = (ev) => {
        console.error('open indexDB failed')
        console.trace()
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

      r.onsuccess = (ev) => {
        resolve(ev)
      }
      r.onerror = (ev) => {
        console.error(`add failed in ${storeNames}`, data)
        console.trace()
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
      r.onsuccess = (ev) => {
        resolve(ev)
      }
      r.onerror = (ev) => {
        console.error('put failed')
        console.trace()
        reject(ev)
      }
    })
  }

  // 向一个存储库中批量添加数据
  public async batchAddData(storeName: string, dataList: any[], key: any) {
    return new Promise(async (resolve, reject) => {
      if (dataList.length === 0) {
        resolve()
      }

      // 获取已存在的 key
      let existedKeys: string[] = (await this.getAllKeys(storeName)) as string[]

      // 使用事务
      const tr = this.db?.transaction(storeName, 'readwrite')
      if (!tr) {
        throw new Error(`transaction ${storeName} is undefined`)
      }
      const store = tr.objectStore(storeName)

      tr.oncomplete = () => {
        resolve()
      }

      tr.onerror = (err) => {
        console.error(err)
        console.trace()
        reject(err)
      }

      for (const data of dataList) {
        await insert(data)
      }

      async function insert(data: any) {
        return new Promise((resolve, reject) => {
          // 如果 key 已存在，则使用 put
          const type: 'add' | 'put' = existedKeys.includes(data[key])
            ? 'put'
            : 'add'

          const request = store[type](data)

          request.onsuccess = () => {
            resolve()
          }

          request.onerror = (err) => {
            reject(err)
          }
        })
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

      r.onsuccess = (ev) => {
        const data = r.result
        resolve(data ? data : null)
      }

      r.onerror = (ev) => {
        console.error('get failed')
        console.trace()
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

      r.onsuccess = (ev) => {
        const data = r.result
        if (data) {
          resolve(data)
        }
        resolve(data ? data : null)
      }
      r.onerror = (ev) => {
        console.error('getAll failed')
        console.trace()
        reject(ev)
      }
    })
  }

  public async getAllKeys(storeNames: string) {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }
      const r = this.db
        .transaction(storeNames, 'readonly')
        .objectStore(storeNames)
        .getAllKeys()

      r.onsuccess = (ev) => {
        const data = r.result
        resolve(data ? data : null)
      }
      r.onerror = (ev) => {
        console.error('getAllKeys failed')
        console.trace()
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

      r.onsuccess = (ev) => {
        resolve(ev)
      }
      r.onerror = (ev) => {
        console.error('delete failed')
        console.trace()
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

      r.onsuccess = (ev) => {
        resolve()
      }
      r.onerror = (ev) => {
        console.error('clear failed')
        console.trace()
        reject(ev)
      }
    })
  }

  public async openCursor(
    storeNames: string,
    CB: (c: IDBCursorWithValue | null) => void
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

      r.onsuccess = (ev) => {
        CB(r.result)
        resolve() // 这个 resolve 会在 cb 执行一次之后就触发
      }
      r.onerror = (ev) => {
        console.error('openCursor failed')
        console.trace()
        reject(ev)
      }
    })
  }
}

export { IndexedDB }
