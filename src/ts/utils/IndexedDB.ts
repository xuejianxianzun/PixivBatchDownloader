// 封装操作 IndexedDB 的一些公共方法，仅满足本程序使用，并不完善
class IndexedDB {
  public db: IDBDatabase | undefined

  /** 从 IndexedDB 的错误里取出一个简短的原因，取不到时返回 unknown。
   *
   * 为什么需要它：请求失败时 reject 的是**事件对象**（真正的错误在 `target.error` 里，
   * 名字是 VersionError 这类有意义的值），而这层封装自己 reject 的是**字符串**
   * （如 Database is not defined）。直接塞进日志只会看到 [object Event]。 */
  public static getErrorName(ev: any) {
    if (typeof ev === 'string') {
      return ev
    }
    const name = ev?.target?.error?.name || ev?.name
    // 普通 Error 的 name 只是 Error，没有信息量，这种情况改用 message
    if (name && name !== 'Error') {
      return name
    }
    return ev?.message || name || 'unknown'
  }

  // DBVer 省略时，按数据库当前的版本打开（不会触发升级）
  public async open(
    DBName: string,
    DBVer?: number,
    onUpgrade?: (
      db: IDBDatabase,
      transaction: IDBTransaction,
      oldVersion: number
    ) => void
  ) {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DBName, DBVer)

      request.onupgradeneeded = (ev) => {
        if (onUpgrade) {
          // request.transaction 就是版本变更事务本身。
          // 要修改已存在的存储库（例如删索引）必须用它，不能在升级事件里另开 db.transaction()：
          // 那样新事务要等升级结束后才执行，那时已经不允许改结构了
          // oldVersion 为 0 表示这是新建数据库（全新安装），调用方可以据此区分「建库」和「升级」
          onUpgrade(
            request.result,
            request.transaction as IDBTransaction,
            ev.oldVersion
          )
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

      // 请求的版本比数据库当前的版本高、而还有别的连接在打开这个数据库时，
      // 浏览器不会自动关闭那些连接，而是让这个请求一直停在阻塞状态（既不成功也不失败）。
      // 所以这里把它当成打开失败，让调用方有机会降级处理（例如按当前版本重新打开）
      request.onblocked = () => {
        console.warn('open indexDB blocked')
        // 起一个明确的名字：调用方靠 name 区分「被阻塞」和「版本不匹配」
        const error = new Error('indexedDB open request is blocked')
        error.name = 'BlockedError'
        reject(error)
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

  /** 向一个存储库中批量写入数据（同一个 key 的记录会被覆盖）
   *
   * 这里有三个刻意的选择：
   *
   * 1. 一律使用 put。导入的语义就是「恢复、合并」，同一个 id 用导入的数据覆盖即可。
   *    老代码为了决定用 add 还是 put，会把库里所有 key 读成数组，再用 includes 逐条查找——
   *    那是 O(n) 的线性扫描：库里已经有 55 万条时，再导入 55 万条要比较上万亿次
   *    （导入第一个文件还算能忍，导入第二个文件就会慢两个数量级）。
   *    而且 add 一旦碰到重复主键，整个事务会 abort，那个存储库的数据会一条都写不进去。
   *
   * 2. 分块写入（默认 2 万条一个事务）。一个事务塞进几十万条请求会长时间占用内存和锁，
   *    出错时还会整块回滚；分块之后，一块失败也只影响这一块。
   *
   * 3. 每一块里的请求一次性全部发起，只在事务的 complete 上等一次。
   *    每条都 await 会为每条记录多付一次「微任务 + 事件循环」的往返，
   *    而 IndexedDB 的请求本来就会在事务里排队。
   */
  public async batchAddData(
    storeName: string,
    dataList: any[],
    chunkSize = 20000
  ) {
    if (dataList.length === 0) {
      return
    }
    if (!this.db) {
      throw new Error('Database is not defined')
    }

    for (let start = 0; start < dataList.length; start += chunkSize) {
      await this.putChunk(storeName, dataList.slice(start, start + chunkSize))
    }
  }

  /** 在一个事务里写入一批数据，等这个事务结束后才返回 */
  private putChunk(storeName: string, dataList: any[]) {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database is not defined'))
        return
      }

      let tr: IDBTransaction
      try {
        tr = this.db.transaction(storeName, 'readwrite')
      } catch (error) {
        // 数据库正在关闭等情况下，transaction() 会同步抛出异常
        reject(error)
        return
      }

      tr.oncomplete = () => {
        resolve()
      }
      // 只要有一个请求失败，事务就会 abort，所以错误只在事务级别处理
      tr.onerror = () => {
        reject(tr.error || new Error(`transaction ${storeName} failed`))
      }
      tr.onabort = () => {
        reject(tr.error || new Error(`transaction ${storeName} aborted`))
      }

      const store = tr.objectStore(storeName)
      try {
        for (const data of dataList) {
          store.put(data)
        }
      } catch (error) {
        reject(error)
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
      // 只读操作必须使用 readonly 事务：readwrite 事务对同一个存储库是排他的，
      // 会和其他标签页里的写入互相排队（手机上后台标签页被冻结时，可能一直等不到锁）
      const r = this.db
        .transaction(storeNames, 'readonly')
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

  /** 分页读取一个存储库里的记录（按主键升序），一页最多 count 条；读完了返回 null
   *
   * 为什么用它代替「一次 getAll 整个存储库」：一个存储库的记录要一次全部放进内存，
   * 记录多的时候（手机上尤其明显）峰值内存会远大于单个导出文件的体积上限。
   * 分页之后内存里只有当前这一页，导出就能真正保持「任意时刻只有一页 + 一个文件」。
   *
   * 为什么不用游标：游标每读一条都要等一次 onsuccess（每条记录一次事件循环往返），
   * 几十万条累积起来很慢。而这里一个请求就返回一整页，几十万条只需要几十个请求，
   * 速度和一次 getAll 基本相同（都是把记录反序列化成对象，主要开销在这里）。
   *
   * @param storeName 存储库名称
   * @param lastKey 上一页最后一条记录的主键，读下一页时传入；不传表示从第一页开始
   * @param count 一页最多读取多少条
   */
  public async getAllByPage<T = any>(
    storeName: string,
    lastKey: string | undefined,
    count: number
  ): Promise<T[] | null> {
    return new Promise((resolve, reject) => {
      if (this.db === undefined) {
        reject('Database is not defined')
        return
      }

      // 主键是字符串。lowerBound(lastKey, true) 表示「大于 lastKey」，
      // 这样下一页不会重复上一页的最后一条
      const range =
        lastKey === undefined
          ? undefined
          : IDBKeyRange.lowerBound(lastKey, true)

      const store = this.db
        .transaction(storeName, 'readonly')
        .objectStore(storeName)
      // 只读操作仍然使用 readonly 事务（见 getAll 里的说明）
      const r = range
        ? store.getAll(range, count)
        : store.getAll(undefined, count)

      r.onsuccess = () => {
        const data = r.result as T[] | undefined
        resolve(data && data.length > 0 ? data : null)
      }
      r.onerror = (ev) => {
        console.error('getAllByPage failed')
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
    return new Promise<void>((resolve, reject) => {
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
    return new Promise<void>((resolve, reject) => {
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
