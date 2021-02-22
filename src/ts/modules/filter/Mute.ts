import { API } from '../utils/API'

// 获取用户在 Pixiv 里屏蔽的用户和/或 tag，进行过滤
class Mute {
  private userList: string[] = []
  private tagList: string[] = []

  public checkUser(id: number | string) {
    if (typeof id === 'number') {
      id = id.toString()
    }
    return this.userList.includes(id)
  }

  public checkTag(tag: string) {
    return this.tagList.includes(tag)
  }

  public async getMuteSettings() {
    this.userList = []
    this.tagList = []

    const response = await API.getMuteSettings()
    const items = response.body.mute_items
    for (const item of items) {
      if (item.type === 'user') {
        this.userList.push(item.value)
      }
      if (item.type === 'tag') {
        this.tagList.push(item.value)
      }
    }
  }
}

const mute = new Mute()
export { mute }
