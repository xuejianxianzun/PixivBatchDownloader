interface ListData {
  id: number
  time: number
  callback: Function | null
}

class SetTimeoutWorker {
  constructor() {
    this.createWorker()
  }

  // 因为 worker 的代码很短，所以直接储存在这里，避免从网络加载导致的延迟问题
  private readonly workerCode = `onmessage = (ev) => {
    setTimeout(() => {
      postMessage({
        id: ev.data.id
      })
    }, ev.data.time)
  }`

  private worker!: Worker

  private createWorker() {
    const blob = new Blob([this.workerCode])
    this.worker = new Worker(URL.createObjectURL(blob))

    this.worker.addEventListener('message', (ev) => {
      const id = ev.data.id as number
      if (this.list[id].callback !== null) {
        this.list[id].callback!()
        this.clear(id)
      }
    })
  }

  private list: ListData[] = []

  private timerId = 0

  public set(callback: Function, time: number) {
    const data = {
      id: this.timerId,
      time,
      callback,
    }
    this.list.push(data)
    this.timerId++

    this.worker.postMessage({
      id: data.id,
      time,
    })

    return data.id
  }

  public clear(id: number) {
    this.list[id].callback = null
  }
}

const setTimeoutWorker = new SetTimeoutWorker()
export { setTimeoutWorker }
