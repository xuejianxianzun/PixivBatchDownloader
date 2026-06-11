export interface UserInfo {
  id: string
  name: string | ''
  avatar: string | ''
  /** 如果下载器知道这个用户是被当前登录用户主动取消关注的，则为 true。如果下载器不知道或不确定，则为 false */
  // 实际上，即使用户主动取消关注了某个用户，也可能是 false。如果用户在未启用或未安装此扩展程序的浏览器里取消关注了某个用户，那么下载器是不知道的，只能设置为 false
  deleteByUser: boolean
  /** 该账号是否存在。如果一个账号被注销，则设为 false */
  exist: boolean
}

export interface FollowingData {
  /** 指示这个对象属于哪个用户 id **/
  user: string
  /** 用户最新的关注列表 **/
  following: string[]
  /** 保存用户关注过的所有用户的信息。即使是被取消关注的用户，也依然保留他的数据 */
  followedUsersInfo: UserInfo[]
  /** 此用户的关注用户总数。这是公开和非公开关注的数量之和。因为本程序不区分一个关注是公开的还是非公开的
   *  注意这可能与 following 的 length 不同，因为这是按照 API 返回的 total 计算的，但是 API 返回的实际用户数量可能比 total 少
   */
  total: number
  /** 最后一次更新 following 数据的时间戳 **/
  time: number
}

export type AllUserFollowingData = FollowingData[]

export interface SetData {
  /**数据属于哪个用户 */
  user: string
  /**此用户的关注用户的 id 列表 **/
  following: string[]
  followedUsersInfo: UserInfo[]
  /**此用户的关注用户总数。注意这可能与 following 的 length 不同*/
  total: number
}

/** 前后台脚本交互的消息 */
export type BackgroundMsg =
  | { msg: 'requestFollowingData' }
  | { msg: 'needUpdateFollowingData' }
  | { msg: 'setFollowingData'; data: SetData }
  | { msg: 'getLoggedUserID' }
  | { msg: 'updateFollowingData' }
  | { msg: 'resetFollowingData' }
  | { msg: 'dispatchFollowingData'; data: AllUserFollowingData }
