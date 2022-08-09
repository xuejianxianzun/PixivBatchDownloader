import { API } from '../API'
import { lang } from '../Lang'
import { msgBox } from '../MsgBox'

// 获取用户在 Pixiv 里屏蔽的用户和/或 tag，进行过滤
class Mute {
  private userList: string[] = []
  private tagList: string[] = []
  private got = false // 是否获取过用户设置

  /**检查传入的 user id 是否包含在用户屏蔽设置里 */
  public async checkUser(id: number | string) {
    // 检查时，要求至少进行过一次获取用户设置的操作
    if (!this.got) {
      await this.getMuteSettings()
    }

    if (typeof id === 'number') {
      id = id.toString()
    }
    return this.userList.includes(id)
  }

  /**检查传入的 tag 是否包含在用户屏蔽设置里 */
  public async checkTag(tag: string) {
    if (!this.got) {
      await this.getMuteSettings()
    }

    return this.tagList.includes(tag)
  }

  // 此模块不会在初始化时获取设置，这是为了避免增加一次无谓的网络请求
  // 当执行此模块的 check 方法时，如果没有获取过设置，则此模块会主动获取一次设置
  // 其他模块也可以在必要的时候（如开始抓取时）直接执行此方法，预先获取设置，为后面的流程做准备
  public async getMuteSettings() {
    this.userList = []
    this.tagList = []

    return new Promise(async (resolve, reject) => {
      try {
        const response = await API.getMuteSettings()
        const items = response.body.mute_items
        for (const item of items) {
          // 如果这个屏蔽项未启用，则不保存
          if (item.enabled === false) {
            continue
          }
          if (item.type === 'user') {
            this.userList.push(item.value)
          }
          if (item.type === 'tag') {
            this.tagList.push(item.value)
          }
        }

        this.got = true
        return resolve(items)
      } catch (error) {
        if (error.status === 401) {
          msgBox.error(lang.transl('_作品页状态码401'))
        }
        return reject(error.status)
      }
    })
  }
}

const mute = new Mute()
export { mute }
