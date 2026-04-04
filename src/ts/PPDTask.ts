import { secretSignal } from './utils/SecretSignal'

// 把调试用的一些命令注册到这里，以便于管理和使用
// 输入 ppdtask，就会弹出一个输入框，列出注册过的所有命令。输入编号即可执行对应的命令
class PPDTask {
  constructor() {
    secretSignal.register('ppdtask', () => {
      this.select()
    })
  }

  // list 是一个稀疏数组
  private list: {
    index: number
    description: string
    cb: Function
  }[] = []

  /** 添加一个配置。由于使用了索引来存储配置，所以可以重复添加同一个配置，这样用起来比较方便 */
  // index 的范围按照命令的作用来区分：
  // 0 - 9: 用于设置抓取、下载流程里用于调试的 flag
  // 10 - 19: 导出内容，例如抓取一些数据然后导出
  // 20 - 29: 测试下载器的一些功能，例如连续输出日志。打开所有可用的标签页也属于此类
  public register(index: number, description: string, cb: Function): void {
    // 为了防止不同命令的 index 冲突导致错误的覆盖，当这个 index 已经被注册时，检查 description 是否相同
    // 如果相同，说明是同一个命令，直接覆盖
    // 如果不同，说明是不同的命令，递归寻找下一个空闲的 index 进行注册
    const old = this.list[index]
    if (!old || old.description === description) {
      this.list[index] = {
        index,
        description,
        cb,
      }
    } else {
      return this.register(index + 1, description, cb)
    }
  }

  private select() {
    const code = prompt(
      `Please enter a command:\n${this.list
        .filter((item) => item !== undefined)
        .map((item) => `${item.index}: ${item.description}`)
        .join('\n')}`
    )
    if (code === null) {
      return
    }

    const config = this.list.find((item) => item?.index === Number(code))
    if (config) {
      console.log(`⚠️Execute command: ${config.description}`)
      config.cb()
    } else {
      alert('Invalid command')
    }
  }
}

const ppdTask = new PPDTask()
export { ppdTask }
