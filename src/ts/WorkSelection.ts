import { EVT } from './EVT'
import { IDData, IDTypeString } from './store/StoreType'

/** 集中保存“手动选择作品”和“手动排除作品”两个功能的状态与 id 列表，并负责它们的互斥与交叉操作 */
class WorkSelection {
  /** 手动选择作品的 id 列表 */
  public selectIdList: IDData[] = []

  /** 排除作品的 id 列表 */
  public excludeIdList: IDData[] = []

  /** 是否处于手动选择作品模式 */
  public selectActive = false
  /** 手动选择作品模式是否处于暂停状态 */
  public selectPaused = false

  /** 是否处于手动排除作品模式 */
  public excludeActive = false
  /** 手动排除作品模式是否处于暂停状态 */
  public excludePaused = false

  /** 状态发生变化时通知各个模块同步 UI */
  private change() {
    EVT.fire('workSelectionChange')
  }

  /** 进入手动选择作品模式，并强制退出排除模式（后进入的状态获胜） */
  public enterSelectMode() {
    this.selectActive = true
    this.excludeActive = false
    // 不要修改 excludePaused：保留排除模式的暂停状态，避免切换到选择模式再切回来时丢失状态
    // 保留 selectPaused，由调用方决定是全新开始还是继续
    this.change()
  }

  /** 进入手动排除作品模式，并强制退出选择模式（后进入的状态获胜） */
  public enterExcludeMode() {
    this.excludeActive = true
    this.selectActive = false
    // 不要修改 selectPaused：保留选择模式的暂停状态，避免切换到排除模式再切回来时丢失状态
    // 保留 excludePaused，由调用方决定是全新开始还是继续
    this.change()
  }

  /** 退出手动选择作品模式 */
  public exitSelectMode() {
    this.selectActive = false
    this.selectPaused = false
    this.change()
  }

  /** 退出手动排除作品模式 */
  public exitExcludeMode() {
    this.excludeActive = false
    this.excludePaused = false
    this.change()
  }

  /** 设置手动选择作品模式的暂停状态 */
  public setSelectPaused(paused: boolean) {
    this.selectPaused = paused
    this.change()
  }

  /** 设置手动排除作品模式的暂停状态 */
  public setExcludePaused(paused: boolean) {
    this.excludePaused = paused
    this.change()
  }

  /** 在某个列表里查找指定 id 和类型的索引 */
  private findIndex(list: IDData[], id: string, type: IDTypeString): number {
    return list.findIndex((item) => item.id === id && item.type === type)
  }

  /** 添加或移除一个被手动选择的作品。返回 true 表示已添加，false 表示已移除（toggle） */
  public toggleSelectId(
    id: string,
    type: IDTypeString,
    title?: string
  ): boolean {
    const index = this.findIndex(this.selectIdList, id, type)
    if (index !== -1) {
      // 已存在则移除。即对同一个作品多次点击时，会切换它的添加/移除状态
      this.selectIdList.splice(index, 1)
      return false
    }

    // 如果它已经被排除，则从排除列表里移除（后执行的操作获胜）
    const excludeIndex = this.findIndex(this.excludeIdList, id, type)
    if (excludeIndex !== -1) {
      this.excludeIdList.splice(excludeIndex, 1)
      EVT.fire('excludeWorkRemovedExternally', id)
    }

    this.selectIdList.push({ id, type, title })
    return true
  }

  /** 添加或移除一个被排除的作品。返回 true 表示已添加，false 表示已移除（toggle） */
  public toggleExcludeId(
    id: string,
    type: IDTypeString,
    title?: string
  ): boolean {
    const index = this.findIndex(this.excludeIdList, id, type)
    if (index !== -1) {
      // 已存在则移除。即对同一个作品多次点击时，会切换它的添加/移除状态
      this.excludeIdList.splice(index, 1)
      return false
    }

    // 如果它已经被选择，则从选择列表里移除（后执行的操作获胜）
    const selectIndex = this.findIndex(this.selectIdList, id, type)
    if (selectIndex !== -1) {
      this.selectIdList.splice(selectIndex, 1)
      EVT.fire('selectWorkRemovedExternally', id)
    }

    this.excludeIdList.push({ id, type, title })
    EVT.fire('manuallyExcludeWork', { id, type })
    return true
  }

  /** 仅添加一个被手动选择的作品，不进行 toggle（反选）操作。
   * 若该 id 已存在于选择列表，则直接返回 false，不做任何修改。
   * 若该 id 已存在于排除列表，则从排除列表里移除它（后执行的操作获胜）。
   * 返回 true 表示确实新增了一个 id。 */
  public addSelectId(id: string, type: IDTypeString, title?: string): boolean {
    const index = this.findIndex(this.selectIdList, id, type)
    if (index !== -1) {
      // 已存在则直接返回，不重复添加
      return false
    }

    // 如果它已经被排除，则从排除列表里移除（后执行的操作获胜）
    const excludeIndex = this.findIndex(this.excludeIdList, id, type)
    if (excludeIndex !== -1) {
      this.excludeIdList.splice(excludeIndex, 1)
      EVT.fire('excludeWorkRemovedExternally', id)
    }

    this.selectIdList.push({ id, type, title })
    return true
  }

  /** 仅添加一个被排除的作品，不进行 toggle（反选）操作。
   * 若该 id 已存在于排除列表，则直接返回 false，不做任何修改。
   * 若该 id 已存在于选择列表，则从选择列表里移除它（后执行的操作获胜）。
   * 返回 true 表示确实新增了一个 id。 */
  public addExcludeId(id: string, type: IDTypeString, title?: string): boolean {
    const index = this.findIndex(this.excludeIdList, id, type)
    if (index !== -1) {
      // 已存在则直接返回，不重复添加
      return false
    }

    // 如果它已经被选择，则从选择列表里移除（后执行的操作获胜）
    const selectIndex = this.findIndex(this.selectIdList, id, type)
    if (selectIndex !== -1) {
      this.selectIdList.splice(selectIndex, 1)
      EVT.fire('selectWorkRemovedExternally', id)
    }

    this.excludeIdList.push({ id, type, title })
    EVT.fire('manuallyExcludeWork', { id, type })
    return true
  }

  /** 清空手动选择作品的列表 */
  public clearSelect() {
    this.selectIdList = []
  }

  /** 清空排除作品的列表 */
  public clearExclude() {
    this.excludeIdList = []
  }
}

const workSelection = new WorkSelection()
export { workSelection }
