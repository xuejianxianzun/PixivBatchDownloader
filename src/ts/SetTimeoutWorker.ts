interface ListData {
  id: number
  time: number
  callback: Function | null
}

// 使用 worker 里的定时器而非 windows 上的定时器，因为当标签页处于后台时，windows 上的 setTimeout 和 setInterval 的回调函数会被大幅延迟，而 worker 里的定时器不会受到影响
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
    const url = URL.createObjectURL(blob)
    this.worker = new Worker(url)
    URL.revokeObjectURL(url)

    this.worker.addEventListener('message', (ev) => {
      const taskId = ev.data.id as number
      const entry = this.list.get(taskId)
      if (entry && entry.callback !== null) {
        entry.callback()
        this.list.delete(taskId)
      }
    })
  }

  private list = new Map<number, ListData>()
  private taskId = 0

  public set(callback: Function, time: number) {
    const data = {
      id: this.taskId,
      time,
      callback,
    }
    this.list.set(data.id, data)
    this.taskId++

    this.worker.postMessage({
      id: data.id,
      time,
    })

    return data.id
  }

  public sleep(time: number) {
    return new Promise((resolve) => {
      this.set(resolve, time)
    })
  }
}

const setTimeoutWorker = new SetTimeoutWorker()
export { setTimeoutWorker }
