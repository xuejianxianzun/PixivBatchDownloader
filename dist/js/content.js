/******/ ;(function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {} // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }) // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ) // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true // Return the exports of the module
    /******/
    /******/ /******/ return module.exports
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      })
      /******/
    }
    /******/
  } // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      })
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true })
    /******/
  } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value)
    /******/ if (mode & 8) return value
    /******/ if (
      mode & 4 &&
      typeof value === 'object' &&
      value &&
      value.__esModule
    )
      return value
    /******/ var ns = Object.create(null)
    /******/ __webpack_require__.r(ns)
    /******/ Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    })
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key]
          }.bind(null, key)
        )
    /******/ return ns
    /******/
  } // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default']
          }
        : /******/ function getModuleExports() {
            return module
          }
    /******/ __webpack_require__.d(getter, 'a', getter)
    /******/ return getter
    /******/
  } // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  } // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = './src/ts/content.ts')
  )
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ './src/ts/content.ts':
      /*!***************************!*\
  !*** ./src/ts/content.ts ***!
  \***************************/
      /*! no exports provided */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony import */ var _modules_InitPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./modules/InitPage */ './src/ts/modules/InitPage.ts'
        )
        /* harmony import */ var _modules_DownloadControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./modules/DownloadControl */ './src/ts/modules/DownloadControl.ts'
        )
        /* harmony import */ var _modules_RightIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./modules/RightIcon */ './src/ts/modules/RightIcon.ts'
        )
        /* harmony import */ var _modules_Tip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./modules/Tip */ './src/ts/modules/Tip.ts'
        )
        /* harmony import */ var _modules_Tip__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
          _modules_Tip__WEBPACK_IMPORTED_MODULE_3__
        )
        /* harmony import */ var _modules_Output__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./modules/Output */ './src/ts/modules/Output.ts'
        )
        /* harmony import */ var _modules_Support__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./modules/Support */ './src/ts/modules/Support.ts'
        )
        /*
         * project: Powerful Pixiv Downloader
         * author:  xuejianxianzun; 雪见仙尊
         * license: GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
         * Github： https://github.com/xuejianxianzun/PixivBatchDownloader
         * Releases: https://github.com/xuejianxianzun/PixivBatchDownloader/releases
         * Wiki:    https://github.com/xuejianxianzun/PixivBatchDownloader/wiki
         * Website: https://pixiv.download/
         * E-mail:  xuejianxianzun@gmail.com
         * QQ group:  675174717
         */

        /***/
      },

    /***/ './src/ts/modules/API.ts':
      /*!*******************************!*\
  !*** ./src/ts/modules/API.ts ***!
  \*******************************/
      /*! exports provided: API */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'API',
          function() {
            return API
          }
        )
        class API {
          // 根据对象某个属性的值，排序对象。返回的结果是倒序排列
          static sortByProperty(propertyName) {
            return function(object1, object2) {
              // 排序的内容有时可能是字符串，需要转换成数字排序
              const value1 = parseInt(object1[propertyName])
              const value2 = parseInt(object2[propertyName])
              if (value2 < value1) {
                return -1
              } else if (value2 > value1) {
                return 1
              } else {
                return 0
              }
            }
          }
          // 检查给定的字符串解析为数字后，是否大于 0
          static checkNumberGreater0(arg) {
            let num = parseInt(arg)
            // 空值会是 NaN
            if (!isNaN(num) && num > 0) {
              // 符合条件
              return {
                result: true,
                value: num
              }
            }
            // 不符合条件
            return {
              result: false,
              value: 0
            }
          }
          // 从 url 中获取指定的查询字段的值
          // 注意：返回值经过 encodeURIComponent 编码！
          static getURLField(url, query) {
            const result = new URL(url).searchParams.get(query)
            if (result !== null) {
              return encodeURIComponent(result)
            } else {
              return ''
            }
          }
          // 从 url 中获取 tag
          static getTagFromURL(url) {
            const nowURL = new URL(url)
            // 2 用户作品列表页
            if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
              // 匹配 pathname 里用户 id 之后的字符
              const test = nowURL.pathname.match(/\/users\/\d+(\/.+)/)
              if (test && test.length === 2) {
                const str = test[1]
                // 如果用户 id 之后的字符多于一个路径，则把最后一个路径作为 tag，示例
                // https://www.pixiv.net/users/2188232/illustrations/ghostblade
                const array = str.split('/')
                // ["", "illustrations", "ghostblade"]
                if (array.length > 2) {
                  return array[array.length - 1]
                }
              }
            }
            // 4 旧版收藏页面
            if (nowURL.pathname === '/bookmark.php') {
              if (parseInt(this.getURLField(nowURL.href, 'untagged')) === 1) {
                // 旧版 “未分类” tag 是个特殊标记
                // https://www.pixiv.net/bookmark.php?untagged=1
                return '未分類'
              }
            }
            // 4 新版收藏页面
            if (nowURL.pathname.includes('/bookmarks/artworks')) {
              // 新版收藏页 url，tag 在路径末端，如
              // https://www.pixiv.net/users/9460149/bookmarks/artworks/R-18
              const test = /\/bookmarks\/artworks\/(.[^\/|^\?|^&]*)/.exec(
                nowURL.pathname
              )
              if (test !== null && test.length > 1 && !!test[1]) {
                return test[1]
              }
            }
            // 5 搜索页面
            if (nowURL.pathname.includes('/tags/')) {
              return nowURL.pathname.split('tags/')[1].split('/')[0]
            }
            // 默认情况，从查询字符串里获取，如下网址
            // https://www.pixiv.net/bookmark.php?tag=R-18
            return this.getURLField(nowURL.href, 'tag')
          }
          // 更新 token
          // 从网页源码里获取用户 token，并储存起来
          static updateToken() {
            fetch('https://www.pixiv.net/artworks/62751951')
              .then(response => {
                return response.text()
              })
              .then(data => {
                let result = data.match(/token":"(\w+)"/)
                if (result) {
                  localStorage.setItem('xzToken', result[1])
                } else {
                  console.warn('UpdateToken failed: no token found!')
                }
              })
          }
          // 获取 token
          // 从本地存储里获取用户 token
          static getToken() {
            let result = localStorage.getItem('xzToken')
            if (result) {
              return result
            } else {
              this.updateToken()
              return ''
            }
          }
          // 从 url 里获取作品 id
          // 可以传入 url，无参数则使用当前页面的 url
          static getIllustId(url) {
            const str = url || window.location.search || location.href
            if (str.includes('illust_id')) {
              // 传统 url
              return /illust_id=(\d*\d)/.exec(str)[1]
            } else if (str.includes('/artworks/')) {
              // 新版 url
              return /artworks\/(\d*\d)/.exec(str)[1]
            } else {
              // 直接取出 url 中的数字，不保证准确
              return /\d*\d/.exec(location.href)[0]
            }
          }
          // 通用的请求流程
          // 发送 get 请求，返回 json 数据，抛出异常
          static request(url) {
            return new Promise((resolve, reject) => {
              fetch(url, {
                method: 'get',
                credentials: 'same-origin'
              })
                .then(response => {
                  if (response.ok) {
                    return response.json()
                  } else {
                    // 第一种异常，请求成功但状态不对
                    reject({
                      status: response.status,
                      statusText: response.statusText
                    })
                  }
                })
                .then(data => {
                  resolve(data)
                })
                .catch(error => {
                  // 第二种异常，请求失败
                  reject(error)
                })
            })
          }
          // 获取收藏数据
          // 这个 api 返回的作品列表顺序是按收藏顺序由近期到早期排列的
          static async getBookmarkData(id, tag, offset, hide = false) {
            const url = `https://www.pixiv.net/ajax/user/${id}/illusts/bookmarks?tag=${tag}&offset=${offset}&limit=100&rest=${
              hide ? 'hide' : 'show'
            }&rdm=${Math.random()}`
            return this.request(url)
          }
          // 添加收藏
          static async addBookmark(id, tags, token, hide) {
            let restrict
            if (!hide) {
              // 公开作品
              restrict = 0
            } else {
              // 非公开作品
              restrict = 1
            }
            return fetch('https://www.pixiv.net/rpc/index.php', {
              method: 'post',
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded; charset=UTF-8'
              },
              credentials: 'same-origin',
              body: `mode=save_illust_bookmark&illust_id=${id}&restrict=${restrict}&comment=&tags=${tags}&tt=${token}`
            })
          }
          // 获取用户信息
          static getUserProfile(id) {
            // full=1 在画师的作品列表页使用，获取详细信息
            // full=0 在作品页内使用，只获取少量信息
            const url = `https://www.pixiv.net/ajax/user/${id}?full=1`
            return this.request(url)
          }
          // 获取用户指定类型的作品列表
          // 返回作品的 id 列表，不包含详细信息
          static async getUserWorksByType(id, type = ['illusts', 'manga']) {
            let typeSet = new Set(type)
            let result = []
            const url = `https://www.pixiv.net/ajax/user/${id}/profile/all`
            let data = await this.request(url)
            for (const type of typeSet.values()) {
              result = result.concat(Object.keys(data.body[type]))
            }
            return result
          }
          // 获取用户指定类型、并且指定 tag 的作品列表
          // 返回整个请求的结果，里面包含作品的详细信息
          // 必须带 tag 使用。不带 tag 虽然也能获得数据，但是获得的并不全，很奇怪。
          static getUserWorksByTypeWithTag(
            id,
            type,
            tag,
            offset = 0,
            number = 999999
          ) {
            // https://www.pixiv.net/ajax/user/2369321/illusts/tag?tag=Fate/GrandOrder&offset=0&limit=9999999
            const url = `https://www.pixiv.net/ajax/user/${id}/${type}/tag?tag=${tag}&offset=${offset}&limit=${number}`
            return this.request(url)
          }
          // 获取作品的详细信息
          static getWorksData(id) {
            const url = `https://www.pixiv.net/ajax/illust/${id}`
            return this.request(url)
          }
          // 获取作品的动图信息
          static getUgoiraMeta(id) {
            const url = `https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`
            return this.request(url)
          }
          // 获取相关作品
          static getRelatedData(id) {
            // 最后的 18 是预加载首屏的多少个作品的信息，和下载并没有关系
            const url = `https://www.pixiv.net/ajax/illust/${id}/recommend/init?limit=18`
            return this.request(url)
          }
          // 获取排行榜数据
          // 排行榜数据基本是一批 50 条作品信息
          static getRankingData(option) {
            let url = `https://www.pixiv.net/ranking.php?mode=${option.mode}&p=${option.p}&format=json`
            // 把可选项添加到 url 里
            let temp = new URL(url)
            // 下面两项需要判断有值再添加。不可以添加了这些字段却使用空值。
            if (option.worksType) {
              temp.searchParams.set('content', option.worksType)
            }
            if (option.date) {
              temp.searchParams.set('date', option.date)
            }
            url = temp.toString()
            return this.request(url)
          }
          // 获取收藏后的相似作品数据
          // 需要传入作品 id 和要抓取的数量。但是实际获取到的数量会比指定的数量少一些
          static getRecommenderData(id, number) {
            const url = `/rpc/recommender.php?type=illust&sample_illusts=${id}&num_recommendations=${number}`
            return this.request(url)
          }
          // 获取搜索数据
          static getSearchData(word, type = 'artworks', p = 1, option = {}) {
            // 基础的 url
            let url = `https://www.pixiv.net/ajax/search/${type}/${encodeURIComponent(
              word
            )}?word=${encodeURIComponent(word)}&p=${p}`
            // 把可选项添加到 url 里
            let temp = new URL(url)
            for (const [key, value] of Object.entries(option)) {
              if (value) {
                temp.searchParams.set(key, value)
              }
            }
            url = temp.toString()
            return this.request(url)
          }
          // 获取大家的新作品的数据
          static getNewIllustData(option) {
            let url = `https://www.pixiv.net/ajax/illust/new?lastId=${option.lastId}&limit=${option.limit}&type=${option.type}&r18=${option.r18}`
            return this.request(url)
          }
          // 获取关注的的新作品的数据
          static getBookmarkNewIllustData(p = 1, r18 = false) {
            let path = r18 ? 'bookmark_new_illust_r18' : 'bookmark_new_illust'
            let url = `https://www.pixiv.net/${path}.php?p=${p}`
            return new Promise((resolve, reject) => {
              fetch(url, {
                method: 'get',
                credentials: 'same-origin'
              })
                .then(response => {
                  if (response.ok) {
                    return response.text()
                  } else {
                    throw new Error(response.status.toString())
                  }
                })
                .then(data => {
                  let listPageDocument = new window.DOMParser().parseFromString(
                    data,
                    'text/html'
                  )
                  let worksInfoText = listPageDocument.querySelector(
                    '#js-mount-point-latest-following'
                  ).dataset.items
                  resolve(JSON.parse(worksInfoText))
                })
                .catch(error => {
                  reject(error)
                })
            })
          }
        }

        /***/
      },

    /***/ './src/ts/modules/BookmarksAddTag.ts':
      /*!*******************************************!*\
  !*** ./src/ts/modules/BookmarksAddTag.ts ***!
  \*******************************************/
      /*! exports provided: BookmarksAddTag */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'BookmarksAddTag',
          function() {
            return BookmarksAddTag
          }
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )

        // 给收藏里的未分类作品批量添加 tag
        class BookmarksAddTag {
          constructor(btn) {
            this.addTagList = [] // 需要添加 tag 的作品的数据
            this.once = 100 // 一次请求多少个作品的数据
            this.btn = btn
            this.bindEvents()
          }
          bindEvents() {
            this.btn.addEventListener('click', () => {
              this.addTagList = [] // 每次点击清空结果
              this.btn.setAttribute('disabled', 'disabled')
              this.btn.textContent = `Checking`
              this.readyAddTag()
            })
          }
          // 准备添加 tag。loop 表示这是第几轮循环
          async readyAddTag(loop = 0) {
            const offset = loop * this.once // 一次请求只能获取一部分，所以可能有多次请求，要计算偏移量
            // 发起请求
            const [showData, hideData] = await Promise.all([
              _API__WEBPACK_IMPORTED_MODULE_0__['API'].getBookmarkData(
                _DOM__WEBPACK_IMPORTED_MODULE_1__['DOM'].getUserId(),
                '未分類',
                offset,
                false
              ),
              _API__WEBPACK_IMPORTED_MODULE_0__['API'].getBookmarkData(
                _DOM__WEBPACK_IMPORTED_MODULE_1__['DOM'].getUserId(),
                '未分類',
                offset,
                true
              )
            ]).catch(error => {
              if (error.status && error.status === 403) {
                this.btn.textContent = `× Permission denied`
              }
              throw new Error('Permission denied')
            })
            // 保存有用的数据
            for (const data of [showData, hideData]) {
              const works = data.body.works
              // 如果作品的 bookmarkData 为假说明没有实际数据，可能是在获取别人的收藏数据。
              if (works.length > 0 && works[0].bookmarkData) {
                works.forEach(work => {
                  this.addTagList.push({
                    id: work.id,
                    tags: encodeURI(work.tags.join(' ')),
                    restrict: work.bookmarkData.private
                  })
                })
              }
            }
            // 已删除或无法访问的作品不会出现在请求结果里。本来一次请求 100 个，但返回的结果有可能会比 100 个少，甚至极端情况下是 0。所以实际获取到的作品可能比  total 数量少，这是正常的。
            // 判断是否请求了所有未分类的作品数据
            const total = offset + this.once
            if (total >= showData.body.total && total >= hideData.body.total) {
              if (this.addTagList.length === 0) {
                // 如果结果为空，不需要处理
                this.btn.textContent = `√ No need`
                this.btn.removeAttribute('disabled')
                return
              } else {
                // 开始添加 tag
                this.addTag(
                  0,
                  this.addTagList,
                  _API__WEBPACK_IMPORTED_MODULE_0__['API'].getToken()
                )
              }
            } else {
              // 需要继续获取
              this.readyAddTag(++loop)
            }
          }
          // 给未分类作品添加 tag
          async addTag(index, addList, tt) {
            const item = addList[index]
            await _API__WEBPACK_IMPORTED_MODULE_0__['API'].addBookmark(
              item.id,
              item.tags,
              tt,
              item.restrict
            )
            if (index < addList.length - 1) {
              index++
              this.btn.textContent = `${index} / ${addList.length}`
              // 继续添加下一个
              this.addTag(index, addList, tt)
            } else {
              this.btn.textContent = `√ Complete`
              this.btn.removeAttribute('disabled')
            }
          }
        }

        /***/
      },

    /***/ './src/ts/modules/CenterButtons.ts':
      /*!*****************************************!*\
  !*** ./src/ts/modules/CenterButtons.ts ***!
  \*****************************************/
      /*! exports provided: centerButtons */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'centerButtons',
          function() {
            return centerButtons
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./CenterPanel */ './src/ts/modules/CenterPanel.ts'
        )

        // 中间面板添加按钮的区域
        class CenterButtons {
          constructor() {
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.destroy,
              () => {
                this.clear()
              }
            )
          }
          add(bg = '', text = '', attr = []) {
            const e = document.createElement('button')
            e.type = 'button'
            e.style.backgroundColor = bg
            e.textContent = text
            for (const [key, value] of attr) {
              e.setAttribute(key, value)
            }
            _CenterPanel__WEBPACK_IMPORTED_MODULE_1__['centerPanel'].useSlot(
              'centerBtns',
              e
            )
            return e
          }
          clear() {
            _CenterPanel__WEBPACK_IMPORTED_MODULE_1__['centerPanel'].clearSlot(
              'centerBtns'
            )
          }
        }
        const centerButtons = new CenterButtons()

        /***/
      },

    /***/ './src/ts/modules/CenterPanel.ts':
      /*!***************************************!*\
  !*** ./src/ts/modules/CenterPanel.ts ***!
  \***************************************/
      /*! exports provided: centerPanel */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'centerPanel',
          function() {
            return centerPanel
          }
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        // 用户界面

        // 中间面板
        class CenterPanel {
          constructor() {
            this.centerPanel = document.createElement('div') // 中间面板
            this.toggleFormEl = document.createElement('div') // 切换显示设置表单的按钮
            this.slots = null
            this.addCenterPanel()
            this.bindEvents()
          }
          // 添加中间面板
          addCenterPanel() {
            const centerPanelHTML = `
      <div class="centerWrap">
      <div class="centerWrap_head">
      <span class="centerWrap_title blue"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl('_下载设置')}</span>
      <div class="btns">
      <a class="has_tip centerWrap_top_btn update" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl(
        '_newver'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank">
      <svg t="1574401457339" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4736" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M894.72 795.477333l-85.418667-85.418667c0.128-0.170667 0.170667-0.341333 0.298667-0.512l-158.890667-158.890667c0.042667-0.597333 37.248-37.248 37.248-37.248l178.773333 0 1.706667-1.493333c-0.853333-196.736-160.426667-356.053333-357.418667-356.053333-72.704 0-140.202667 22.016-196.650667 59.306667L228.949333 129.664C307.968 71.466667 405.333333 36.650667 511.018667 36.650667c263.296 0 476.757333 213.461333 476.757333 476.714667C987.776 619.093333 952.96 716.416 894.72 795.477333zM369.493333 476.117333c-0.042667 0.597333-37.248 37.248-37.248 37.248l-178.773333 0c0 197.461333 160.085333 357.546667 357.546667 357.546667 72.192 0 139.093333-21.76 195.285333-58.538667l85.589333 85.589333c-78.848 57.685333-175.701333 92.117333-280.874667 92.117333-263.296 0-476.757333-213.461333-476.757333-476.757333 0-105.173333 34.474667-202.069333 92.16-280.874667l85.589333 85.589333C211.925333 318.208 211.882667 318.336 211.797333 318.464L369.493333 476.117333z" p-id="4737"></path></svg>
      </a>
      <a class="has_tip centerWrap_top_btn wiki_url" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl(
        '_wiki'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank">
      <svg t="1574400169015" class="icon" widht="16" height="16" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1872" xmlns:xlink="http://www.w3.org/1999/xlink" width="17" height="16"><defs><style type="text/css"></style></defs><path d="M1044.286732 3.51978A1138.616836 1138.616836 0 0 0 618.841322 58.172364a198.963565 198.963565 0 0 0-26.814324 10.815324V1023.936004l0.895944-0.383976a979.52278 979.52278 0 0 1 443.236298-68.411724 47.741016 47.741016 0 0 0 51.580776-43.261296V50.172864a47.165052 47.165052 0 0 0-43.453284-46.653084z m-74.299356 632.15249h-224.369977V541.470158h224.369977v94.202112z m0-231.921504h-224.369977V309.484657h224.369977v94.266109zM469.154678 58.172364A1138.296856 1138.296856 0 0 0 43.645272 3.455784 47.421036 47.421036 0 0 0 0 50.172864V908.103244a46.653084 46.653084 0 0 0 15.35904 34.493844 48.060996 48.060996 0 0 0 36.285732 12.415224 980.610712 980.610712 0 0 1 443.300294 68.347728l0.895944 0.575964V68.7957a202.099369 202.099369 0 0 0-26.686332-10.751328zM351.146053 635.800262H126.776076V541.59815h224.369977v94.202112z m0-231.921504H126.776076V309.612649h224.369977v94.266109z" p-id="1873"></path></svg>
      </a>
      <a class="has_tip centerWrap_top_btn" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl(
        '_github'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank">
      <svg t="1574401005111" class="icon" widht="16" height="16" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2594" xmlns:xlink="http://www.w3.org/1999/xlink><defs><style type="text/css"></style></defs><path d="M0 520.886c0-69.368 13.51-135.697 40.498-199.02 26.987-63.323 63.322-117.826 109.006-163.51 45.65-45.65 100.154-81.985 163.51-109.006A502.289 502.289 0 0 1 512 8.92c69.335 0 135.663 13.477 198.986 40.497 63.356 26.988 117.86 63.323 163.51 109.007 45.684 45.65 82.02 100.154 109.006 163.51A502.289 502.289 0 0 1 1024 520.852c0 111.318-32.504 211.472-97.511 300.494-64.975 88.989-148.48 150.825-250.484 185.476-5.351 0-9.348-0.99-11.99-2.973-2.676-1.982-4.196-3.997-4.526-6.012a59.458 59.458 0 0 1-0.495-8.984 7.663 7.663 0 0 1-0.991-3.006v-128.99c0-40.63-14.336-75.314-43.008-103.986 76.667-13.345 134.011-41.819 171.999-85.487 37.987-43.669 57.013-96.52 57.013-158.522 0-58.005-18.663-108.346-56.022-150.99 13.345-42.678 11-87.668-6.97-135.003-18.697-1.322-39.011 1.85-61.01 9.513-22 7.663-38.318 14.831-49.02 21.47-10.637 6.673-20.316 13.016-28.97 19.027-38.68-10.669-81.854-16.02-129.486-16.02-47.7 0-90.509 5.351-128.529 16.02-7.333-5.35-15.855-11.164-25.5-17.507-9.68-6.342-26.493-14.005-50.507-22.99-23.982-9.018-45.65-12.85-65.008-11.495-18.663 47.996-20.645 93.646-5.979 136.984-36.665 42.678-54.998 92.986-54.998 150.99 0 62.002 18.663 114.689 55.99 157.994 37.326 43.339 94.67 72.01 171.998 86.016a142.303 142.303 0 0 0-39.969 70.029c-56.683 13.972-96.355 3.963-119.015-30.06-42.017-61.308-79.674-83.307-113.003-65.965-4.69 4.657-3.997 9.48 1.982 14.501 6.012 4.988 14.996 11.66 27.02 19.985 11.99 8.357 20.976 17.507 26.987 27.515 0.661 1.322 2.51 6.177 5.517 14.502a831.917 831.917 0 0 0 8.985 23.981c2.973 7.663 8.654 16.186 17.011 25.5 8.324 9.349 18.003 17.178 29.003 23.52 11 6.309 26.161 11 45.485 14.006 19.324 2.972 41.323 3.138 65.998 0.495v100.484c0 0.991-0.165 2.643-0.495 5.021-0.33 2.312-0.991 3.964-1.982 4.955-0.991 1.024-2.345 2.015-4.03 3.039a12.52 12.52 0 0 1-6.474 1.486c-2.676 0-6.012-0.33-10.009-0.99-101.343-35.345-183.825-97.182-247.51-185.51C31.842 731.037 0 631.577 0 520.92z" p-id="2595"></path></svg>
      </a>
        <div class="has_tip centerWrap_top_btn centerWrap_toogle_option" data-show="1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
          'lang'
        ].transl('_收起展开设置项')}">▲</div>
        <div class="has_tip centerWrap_top_btn centerWrap_close" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
          'lang'
        ].transl('_快捷键切换显示隐藏')}">
        <svg t="1574392276519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1123" data-spm-anchor-id="a313x.7781069.0.i0" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14"><defs><style type="text/css"></style></defs><path d="M521.693867 449.297067L111.4112 39.0144a51.2 51.2 0 1 0-72.430933 72.362667l410.282666 410.3168-410.282666 410.3168a51.2 51.2 0 1 0 72.3968 72.3968l410.3168-410.282667 410.3168 410.282667a51.2 51.2 0 1 0 72.3968-72.362667l-410.282667-410.350933 410.282667-410.282667a51.2 51.2 0 1 0-72.3968-72.3968l-410.282667 410.282667z" p-id="1124"></path></svg>
        </div>
      </div>
      </div>

      <div class="centerWrap_con">
      <slot data-name="form"></slot>
      <slot data-name="centerBtns" class="centerWrap_btns"></slot>
      <slot data-name="downloadArea"></slot>
      <slot data-name="progressBar"></slot>
      </div>

      <div class="gray1 bottom_help_bar"> 
      <span class="showDownTip">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl('_常见问题')}</span>
      <a class="wiki2" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl('_wiki')}</a>
      <span id="resetOption">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl('_重置设置')}</span>
      <br>
      <p class="downTip tip"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
        'lang'
      ].transl('_下载说明')}</p>
      </div>

      </div>
      `
            document.body.insertAdjacentHTML('beforeend', centerPanelHTML)
            this.centerPanel = document.querySelector('.centerWrap')
            this.toggleFormEl = this.centerPanel.querySelector(
              '.centerWrap_toogle_option'
            )
            this.slots = this.centerPanel.querySelectorAll('slot')
          }
          // 绑定中间面板上的事件
          bindEvents() {
            // 监听点击扩展图标的消息，开关中间面板
            chrome.runtime.onMessage.addListener(msg => {
              if (msg.msg === 'click_icon') {
                if (this.centerPanel.style.display === 'block') {
                  this.close()
                } else {
                  this.show()
                }
              }
            })
            // 关闭按钮
            document
              .querySelector('.centerWrap_close')
              .addEventListener('click', () => {
                this.close()
              })
            // 使用快捷键 Alt + x 切换中间面板显示隐藏
            window.addEventListener(
              'keydown',
              ev => {
                if (ev.altKey && ev.keyCode === 88) {
                  const nowDisplay = this.centerPanel.style.display
                  if (nowDisplay === 'block') {
                    this.close()
                  } else {
                    this.show()
                  }
                }
              },
              false
            )
            // 点击右侧图标时，显示
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.clickRightIcon,
              () => {
                this.show()
              }
            )
            // 开始抓取作品时，隐藏
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.crawlStart,
              () => {
                this.close()
              }
            )
            // 抓取完作品详细数据时，显示
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.crawlFinish,
              () => {
                if (
                  !_Store__WEBPACK_IMPORTED_MODULE_3__['store'].states
                    .quickDownload &&
                  !_Store__WEBPACK_IMPORTED_MODULE_3__['store'].states
                    .notAutoDownload
                ) {
                  this.show()
                }
              }
            )
            // 点击切换显示表单的按钮时，派发事件
            this.toggleFormEl.addEventListener('click', () => {
              const nowShow = this.toggleFormEl.dataset.show
              const newShow = nowShow === '0' ? '1' : '0'
              this.toggleFormEl.dataset.show = newShow
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.toggleForm,
                !!parseInt(newShow)
              )
            })
            // 切换显示表单时，更改按钮的数据
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.toggleForm,
              event => {
                const boolean = event.detail.data
                this.toggleFormEl.dataset.show = boolean ? '1' : '0'
                this.toggleFormEl.innerHTML = boolean ? '▲' : '▼'
              }
            )
            // 显示下载说明
            document
              .querySelector('.showDownTip')
              .addEventListener('click', () =>
                _DOM__WEBPACK_IMPORTED_MODULE_2__['DOM'].toggleEl(
                  document.querySelector('.downTip')
                )
              )
            // 重置设置
            document
              .getElementById('resetOption')
              .addEventListener('click', () => {
                const result = window.confirm(
                  _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                    '_是否重置设置'
                  )
                )
                if (result) {
                  _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].fire(
                    _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.resetOption
                  )
                }
              })
          }
          // 显示中间区域
          show() {
            this.centerPanel.style.display = 'block'
            _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.showCenterPanel
            )
          }
          // 隐藏中间区域
          close() {
            this.centerPanel.style.display = 'none'
            _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.hideCenterPanel
            )
          }
          useSlot(name, element) {
            if (!this.slots) {
              throw 'No slots!'
            }
            let findSlot
            for (const slot of this.slots) {
              if (slot.dataset.name === name) {
                findSlot = slot
                break
              }
            }
            if (!findSlot) {
              throw 'No slots!'
            }
            if (typeof element === 'string') {
              // 插入字符串形式的元素
              const wrap = document.createElement('div')
              wrap.innerHTML = element
              const el = wrap.children[0]
              findSlot.appendChild(el)
              return el
            } else {
              // 插入 html 元素
              findSlot.appendChild(element)
              return element
            }
          }
          // 清空指定的插槽
          clearSlot(name) {
            if (!this.slots) {
              return
            }
            for (const slot of this.slots) {
              if (slot.dataset.name === name) {
                slot.innerHTML = ''
              }
            }
          }
        }
        const centerPanel = new CenterPanel()

        /***/
      },

    /***/ './src/ts/modules/Colors.ts':
      /*!**********************************!*\
  !*** ./src/ts/modules/Colors.ts ***!
  \**********************************/
      /*! exports provided: Colors */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'Colors',
          function() {
            return Colors
          }
        )
        // 颜色
        class Colors {}
        Colors.blue = '#0ea8ef'
        Colors.green = '#14ad27'
        Colors.red = '#f33939'
        Colors.yellow = '#e49d00'

        /***/
      },

    /***/ './src/ts/modules/ConvertUgoira.ts':
      /*!*****************************************!*\
  !*** ./src/ts/modules/ConvertUgoira.ts ***!
  \*****************************************/
      /*! exports provided: converter */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'converter',
          function() {
            return converter
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        // 转换动图

        class ConvertUgoira {
          constructor() {
            this.gifWorkerUrl = ''
            this.downloading = true // 是否在下载。如果下载停止了则不继续转换后续任务，避免浪费资源
            this.count = 0 // 统计有几个转换任务
            this.maxCount = 1 // 允许同时运行多少个转换任务
            this.loadWorkerJS()
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadStart,
              () => {
                this.downloading = true
              }
            )
            ;[
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadPause,
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadStop
            ].forEach(event => {
              window.addEventListener(event, () => {
                this.downloading = false
              })
            })
          }
          set setCount(num) {
            this.count = num
            _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.convertChange,
              this.count
            )
          }
          async loadWorkerJS() {
            if ('zip' in window === false) {
              return
            }
            // 添加 zip 的 worker 文件
            let zipWorker = await fetch(
              chrome.extension.getURL('lib/z-worker.js')
            )
            const zipWorkerBolb = await zipWorker.blob()
            const zipWorkerUrl = URL.createObjectURL(zipWorkerBolb)
            zip.workerScripts = {
              inflater: [zipWorkerUrl]
            }
            // 添加 gif 的 worker 文件
            let gifWorker = await fetch(
              chrome.extension.getURL('lib/gif.worker.js')
            )
            const gifWorkerBolb = await gifWorker.blob()
            this.gifWorkerUrl = URL.createObjectURL(gifWorkerBolb)
          }
          // 解压 zip 文件
          async readZip(zipFile, ugoiraInfo) {
            return new Promise(function(resolve, reject) {
              zip.createReader(
                new zip.BlobReader(zipFile),
                zipReader => {
                  // 读取成功时的回调函数，files 保存了文件列表的信息
                  zipReader.getEntries(files => {
                    // 创建数组，长度与文件数量一致
                    const imgFile = new Array(files.length)
                    // 获取每个文件的数据。因为这个操作是异步的，所以必须检查图片数量
                    files.forEach(file => {
                      file.getData(
                        new zip.Data64URIWriter(ugoiraInfo.mime_type),
                        data => {
                          const fileNo = parseInt(file.filename)
                          imgFile[fileNo] = data
                          // 把图片按原编号存入对应的位置。这是因为我怀疑有时候 zip.Data64URIWriter 的回调顺序不一致，直接 push 可能导致图片的顺序乱掉
                          for (let i = 0; i < imgFile.length; i++) {
                            // 检测到空值说明没有添加完毕，退出循环
                            if (!imgFile[i]) {
                              break
                            }
                            // 如果检查到最后一项，说明添加完毕
                            if (i === imgFile.length - 1) {
                              resolve(imgFile)
                            }
                          }
                        }
                      )
                    })
                  })
                },
                message => {
                  _Log__WEBPACK_IMPORTED_MODULE_1__['log'].error(
                    'error: readZIP error.',
                    2
                  )
                  reject(new Error('readZIP error: ' + message))
                }
              )
            })
          }
          // 添加每一帧的数据
          async getFrameData(imgFile, type = 'webm') {
            const resultList = new Array(imgFile.length)
            return new Promise(function(resolve, reject) {
              const drawImg = function(index) {
                const img = new Image()
                img.onload = function(event) {
                  // 处理视频
                  if (type === 'webm') {
                    const canvasEl = document.createElement('canvas')
                    const ctx = canvasEl.getContext('2d')
                    canvasEl.width = img.width
                    canvasEl.height = img.height
                    ctx.drawImage(img, 0, 0)
                    resultList[index] = canvasEl
                  }
                  // 处理 gif
                  if (type === 'gif') {
                    resultList[index] = img
                  }
                  // 继续下一个
                  if (index < imgFile.length - 1) {
                    index++
                    drawImg(index)
                  } else {
                    resolve(resultList)
                  }
                }
                img.src = imgFile[index]
              }
              // onload 完成时的顺序和添加事件时的顺序不一致，为了避免图片顺序乱掉，这里逐个添加每个图片
              drawImg(0)
            })
          }
          // 编码视频
          async encodeVideo(encoder) {
            return new Promise(function(resolve, reject) {
              encoder.compile(false, function(video) {
                resolve(video)
              })
            })
          }
          // 开始转换，主要是解压文件
          async start(file, info) {
            return new Promise(async (resolve, reject) => {
              const t = window.setInterval(async () => {
                if (this.count < this.maxCount) {
                  window.clearInterval(t)
                  if (!this.downloading) {
                    return
                  }
                  this.setCount = this.count + 1
                  // 将压缩包里的图片转换为 base64 字符串
                  const base64Arr = await this.readZip(file, info)
                  resolve(base64Arr)
                }
              }, 200)
            })
          }
          complete() {
            this.setCount = this.count - 1
          }
          // 转换成 webm
          async webm(file, info) {
            return new Promise(async (resolve, reject) => {
              // 创建视频编码器
              const encoder = new Whammy.Video()
              // 获取解压后的图片数据
              let base64Arr = await this.start(file, info)
              // 生成每一帧的数据
              let canvasData = await this.getFrameData(base64Arr)
              // 添加帧数据
              for (let index = 0; index < canvasData.length; index++) {
                const base64 = canvasData[index]
                encoder.add(base64, info.frames[index].delay)
              }
              base64Arr = null
              canvasData = null
              // 获取生成的视频
              file = await this.encodeVideo(encoder)
              this.complete()
              resolve(file)
            })
          }
          // 转换成 gif
          async gif(file, info) {
            return new Promise(async (resolve, reject) => {
              // 配置 gif.js
              let gif = new GIF({
                workers: 4,
                quality: 10,
                workerScript: this.gifWorkerUrl
              })
              // 绑定渲染完成事件
              gif.on('finished', file => {
                this.complete()
                resolve(file)
              })
              // 获取解压后的图片数据
              let base64Arr = await this.start(file, info)
              // 生成每一帧的数据
              let imgData = await this.getFrameData(base64Arr, 'gif')
              // 添加帧数据
              for (let index = 0; index < imgData.length; index++) {
                gif.addFrame(imgData[index], {
                  delay: info.frames[index].delay
                })
              }
              base64Arr = null
              imgData = null
              // 渲染 gif
              gif.render()
            })
          }
        }
        const converter = new ConvertUgoira()

        /***/
      },

    /***/ './src/ts/modules/DOM.ts':
      /*!*******************************!*\
  !*** ./src/ts/modules/DOM.ts ***!
  \*******************************/
      /*! exports provided: DOM */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'DOM',
          function() {
            return DOM
          }
        )
        // DOM 操作类
        // 提供公用的 DOM 操作方法，以及从 DOM 中获取数据的 API
        class DOM {
          // 获取指定元素里，可见的结果
          static getVisibleEl(selector) {
            const list = document.querySelectorAll(selector)
            return Array.from(list).filter(el => {
              return el.style.display !== 'none'
            })
          }
          // 删除 DOM 元素
          static removeEl(el) {
            if (!el) {
              return
            }
            if (Reflect.has(el, 'length')) {
              // 如果有 length 属性则循环删除。
              el.forEach(el => {
                if (el.parentNode) {
                  el.parentNode.removeChild(el)
                }
              })
            } else {
              // 没有 length 属性的直接删除（querySelector 的返回值是 HTMLElement）
              const parent = el.parentNode
              if (parent) {
                parent.removeChild(el)
              }
            }
          }
          // 切换 DOM 元素的可见性
          static toggleEl(el) {
            el.style.display = el.style.display === 'block' ? 'none' : 'block'
          }
          // 将元素插入到页面顶部
          /*
    newindex-inner 是在未登录时的用户作品列表页面使用的
    layout-body 是在未登录时的搜索页使用的
    */
          static insertToHead(el) {
            if (document.body) {
              document.body.insertAdjacentElement('afterbegin', el)
            } else {
              ;(
                document.querySelector('.newindex-inner') ||
                document.querySelector('.layout-body')
              ).insertAdjacentElement('beforebegin', el)
            }
            return el
          }
          // 获取用户 id
          static getUserId() {
            const newRegExp = /\/users\/(\d+)/ // 匹配新版用户页面 url 里的 id
            // 获取 /users/ 后面连续的数字部分
            // 列表页里从 url 中获取
            const test4 = newRegExp.exec(location.pathname)
            if (!!test4 && test4.length > 1 && !!test4[1]) {
              return test4[1]
            }
            // 从新版页面的作品页、列表页获取包含用户 id 的元素，注意这些选择器可能会变到其他元素上
            const testA =
              document.querySelector('.jkOmlQ a') ||
              document.querySelector('a.lknEaI')
            if (testA && testA.href) {
              const test5 = newRegExp.exec(testA.href)
              if (!!test5 && test5.length > 1 && !!test5[1]) {
                return test5[1]
              }
            }
            // 从旧版页面的头像获取（在旧版书签页面使用）
            const nameElement = document.querySelector('.user-name')
            if (nameElement) {
              return newRegExp.exec(nameElement.href)[1]
            }
            // 最后从 body 里匹配，注意这有可能会匹配到错误的（其他的）用户 id！
            let test3 = newRegExp.exec(document.body.innerHTML)
            if (test3) {
              return test3[1]
            }
            // 如果都没有获取到
            throw new Error('getUserId failed!')
          }
        }

        /***/
      },

    /***/ './src/ts/modules/DeleteWorks.ts':
      /*!***************************************!*\
  !*** ./src/ts/modules/DeleteWorks.ts ***!
  \***************************************/
      /*! exports provided: DeleteWorks */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'DeleteWorks',
          function() {
            return DeleteWorks
          }
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./CenterPanel */ './src/ts/modules/CenterPanel.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        // 删除页面上的作品

        class DeleteWorks {
          constructor(worksSelectors) {
            this.worksSelector = '' // 选择页面上所有作品的选择器
            this.multipleSelector = '' // 多图作品特有的元素的标识
            this.ugoiraSelector = '' // 动图作品特有的元素的标识
            this.delMode = false // 是否处于删除作品状态
            this.deleteWorkCallback = () => {} // 保存手动删除作品的回调函数，因为可能会多次绑定手动删除事件，所以需要保存传入的 callback 备用
            this.worksSelector = worksSelectors
            // 作品列表更新后，需要重新给作品绑定删除事件
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.worksUpdate,
              () => {
                if (this.delMode) {
                  this.bindDeleteEvent()
                }
              }
            )
          }
          allowWork() {
            return _Store__WEBPACK_IMPORTED_MODULE_6__['store'].states.allowWork
          }
          // 清除多图作品的按钮
          addClearMultipleBtn(selector, callback = () => {}) {
            this.multipleSelector = selector
            _CenterButtons__WEBPACK_IMPORTED_MODULE_5__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_2__['Colors'].red,
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_清除多图作品'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                      '_清除多图作品Title'
                    )
                  ]
                ]
              )
              .addEventListener(
                'click',
                () => {
                  if (!this.allowWork()) {
                    return alert(
                      _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                        '_当前任务尚未完成'
                      )
                    )
                  }
                  _CenterPanel__WEBPACK_IMPORTED_MODULE_4__[
                    'centerPanel'
                  ].close()
                  this.clearMultiple()
                  callback()
                },
                false
              )
          }
          // 清除动图作品的按钮
          addClearUgoiraBtn(selector, callback = () => {}) {
            this.ugoiraSelector = selector
            _CenterButtons__WEBPACK_IMPORTED_MODULE_5__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_2__['Colors'].red,
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_清除动图作品'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                      '_清除动图作品Title'
                    )
                  ]
                ]
              )
              .addEventListener(
                'click',
                () => {
                  if (!this.allowWork()) {
                    return alert(
                      _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                        '_当前任务尚未完成'
                      )
                    )
                  }
                  _CenterPanel__WEBPACK_IMPORTED_MODULE_4__[
                    'centerPanel'
                  ].close()
                  this.ClearUgoira()
                  callback()
                },
                false
              )
          }
          // 手动删除作品的按钮
          addManuallyDeleteBtn(callback = () => {}) {
            this.deleteWorkCallback = callback
            const delBtn = _CenterButtons__WEBPACK_IMPORTED_MODULE_5__[
              'centerButtons'
            ].add(
              _Colors__WEBPACK_IMPORTED_MODULE_2__['Colors'].red,
              _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                '_手动删除作品'
              ),
              [
                [
                  'title',
                  _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                    '_手动删除作品Title'
                  )
                ]
              ]
            )
            delBtn.addEventListener('click', () => {
              this.manuallyDelete(delBtn)
            })
          }
          // 清除多图作品
          clearMultiple() {
            const allPicArea = document.querySelectorAll(this.worksSelector)
            allPicArea.forEach(el => {
              if (el.querySelector(this.multipleSelector)) {
                el.remove()
              }
            })
            this.showWorksCount()
          }
          // 清除动图作品
          ClearUgoira() {
            const allPicArea = document.querySelectorAll(this.worksSelector)
            allPicArea.forEach(el => {
              if (el.querySelector(this.ugoiraSelector)) {
                el.remove()
              }
            })
            this.showWorksCount()
          }
          // 给作品绑定删除事件
          bindDeleteEvent() {
            const listElement = document.querySelectorAll(this.worksSelector)
            listElement.forEach(el => {
              el.onclick = ev => {
                if (this.delMode) {
                  ev.preventDefault()
                  if (!this.allowWork()) {
                    return alert(
                      _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                        '_当前任务尚未完成'
                      )
                    )
                  }
                  const target = ev.currentTarget
                  _DOM__WEBPACK_IMPORTED_MODULE_3__['DOM'].removeEl(target)
                  this.showWorksCount()
                  this.deleteWorkCallback(target)
                }
              }
            })
          }
          // 手动删除作品
          // 回调函数可以接收到被删除的元素
          manuallyDelete(delBtn) {
            this.delMode = !this.delMode
            this.bindDeleteEvent()
            if (this.delMode) {
              delBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__[
                'lang'
              ].transl('_退出手动删除')
              setTimeout(() => {
                _CenterPanel__WEBPACK_IMPORTED_MODULE_4__['centerPanel'].close()
              }, 300)
            } else {
              delBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__[
                'lang'
              ].transl('_手动删除作品')
            }
          }
          // 显示调整后，列表里的作品数量
          showWorksCount() {
            const selector = this.worksSelector
            _Log__WEBPACK_IMPORTED_MODULE_0__['log'].success(
              _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                '_调整完毕',
                _DOM__WEBPACK_IMPORTED_MODULE_3__['DOM']
                  .getVisibleEl(selector)
                  .length.toString()
              ),
              2,
              false
            )
          }
        }

        /***/
      },

    /***/ './src/ts/modules/Download.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/Download.ts ***!
  \************************************/
      /*! exports provided: Download */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'Download',
          function() {
            return Download
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _TitleBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./TitleBar */ './src/ts/modules/TitleBar.ts'
        )
        /* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./FileName */ './src/ts/modules/FileName.ts'
        )
        /* harmony import */ var _ConvertUgoira__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./ConvertUgoira */ './src/ts/modules/ConvertUgoira.ts'
        )
        /* harmony import */ var _ProgressBar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./ProgressBar */ './src/ts/modules/ProgressBar.ts'
        )
        // 下载文件，并发送给浏览器下载

        class Download {
          constructor(progressBarIndex, data) {
            this.fileName = ''
            this.stoped = false
            this.retry = 0
            this.retryMax = 50
            this.progressBarIndex = progressBarIndex
            this.download(data)
            this.listenEvents()
          }
          listenEvents() {
            ;[
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadStop,
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadPause
            ].forEach(event => {
              window.addEventListener(event, () => {
                this.stoped = true
              })
            })
          }
          // 设置进度条信息
          setProgressBar(loaded, total) {
            _ProgressBar__WEBPACK_IMPORTED_MODULE_6__[
              'progressBar'
            ].setProgress(this.progressBarIndex, {
              name: this.fileName,
              loaded: loaded,
              total: total
            })
          }
          // 下载文件
          download(arg) {
            _TitleBar__WEBPACK_IMPORTED_MODULE_3__['titleBar'].change('↓')
            // 获取文件名
            this.fileName = _FileName__WEBPACK_IMPORTED_MODULE_4__[
              'fileName'
            ].getFileName(arg.data)
            // 重设当前下载栏的信息
            this.setProgressBar(0, 0)
            // 下载图片
            let xhr = new XMLHttpRequest()
            xhr.open('GET', arg.data.url, true)
            xhr.responseType = 'blob'
            // 显示下载进度
            xhr.addEventListener('progress', event => {
              if (this.stoped) {
                xhr.abort()
                xhr = null
                return
              }
              this.setProgressBar(event.loaded, event.total)
            })
            // 图片获取完毕（出错时也会进入 loadend）
            xhr.addEventListener('loadend', async () => {
              if (this.stoped) {
                xhr = null
                return
              }
              let file = xhr.response // 要下载的文件
              // 错误处理
              const HandleError = () => {
                let msg = ''
                if (xhr.status === 404) {
                  // 404 错误时
                  msg = _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                    '_file404',
                    arg.id
                  )
                } else {
                  // 无法处理的错误状态
                  msg = _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                    '_文件下载失败',
                    arg.id
                  )
                }
                _Log__WEBPACK_IMPORTED_MODULE_1__['log'].error(msg, 1)
                // 创建 txt 文件，保存提示信息
                file = new Blob([`${msg}`], {
                  type: 'text/plain'
                })
                this.fileName = this.fileName.replace(
                  /\.jpg$|\.png$|\.zip$|\.gif$|\.webm$/,
                  '.txt'
                )
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadError
                )
              }
              if (xhr.status !== 200) {
                // 状态码错误
                // 正常下载完毕的状态码是 200
                _ProgressBar__WEBPACK_IMPORTED_MODULE_6__[
                  'progressBar'
                ].showErrorColor(this.progressBarIndex, true)
                this.retry++
                if (this.retry >= this.retryMax) {
                  // 重试 retryMax 次依然错误，进行错误处理
                  HandleError()
                } else {
                  return this.download(arg)
                }
              } else {
                // 状态码正常
                _ProgressBar__WEBPACK_IMPORTED_MODULE_6__[
                  'progressBar'
                ].showErrorColor(this.progressBarIndex, false)
                if (
                  (arg.data.ext === 'webm' || arg.data.ext === 'gif') &&
                  arg.data.ugoiraInfo
                ) {
                  // 如果需要转换成视频
                  if (arg.data.ext === 'webm') {
                    file = await _ConvertUgoira__WEBPACK_IMPORTED_MODULE_5__[
                      'converter'
                    ].webm(file, arg.data.ugoiraInfo)
                  }
                  // 如果需要转换成动图
                  if (arg.data.ext === 'gif') {
                    file = await _ConvertUgoira__WEBPACK_IMPORTED_MODULE_5__[
                      'converter'
                    ].gif(file, arg.data.ugoiraInfo)
                  }
                }
              }
              // 生成下载链接
              const blobUrl = URL.createObjectURL(file)
              // 向浏览器发送下载任务
              this.browserDownload(
                blobUrl,
                this.fileName,
                arg.id,
                arg.taskBatch
              )
              xhr = null
              file = null
            })
            xhr.send()
          }
          // 向浏览器发送下载任务
          browserDownload(blobUrl, fileName, id, taskBatch) {
            // 如果任务已停止，不会向浏览器发送下载任务
            if (this.stoped) {
              // 释放 bloburl
              URL.revokeObjectURL(blobUrl)
              return
            }
            const sendData = {
              msg: 'send_download',
              fileUrl: blobUrl,
              fileName: fileName,
              id,
              taskBatch
            }
            chrome.runtime.sendMessage(sendData)
          }
        }

        /***/
      },

    /***/ './src/ts/modules/DownloadControl.ts':
      /*!*******************************************!*\
  !*** ./src/ts/modules/DownloadControl.ts ***!
  \*******************************************/
      /*! no exports provided */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _TitleBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./TitleBar */ './src/ts/modules/TitleBar.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./CenterPanel */ './src/ts/modules/CenterPanel.ts'
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )
        /* harmony import */ var _Download__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./Download */ './src/ts/modules/Download.ts'
        )
        /* harmony import */ var _ProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./ProgressBar */ './src/ts/modules/ProgressBar.ts'
        )
        // 下载控制

        class DownloadControl {
          constructor() {
            this.downloadThreadMax = 5 // 同时下载的线程数的最大值，也是默认值
            this.downloadThread = this.downloadThreadMax // 同时下载的线程数
            this.taskBatch = 0 // 标记任务批次，每次重新下载时改变它的值，传递给后台使其知道这是一次新的下载
            this.statesList = [] // 下载状态列表，保存每个下载任务的状态
            this.taskList = {} // 下载任务列表，使用下载的文件的 id 做 key，保存下载栏编号和它在下载状态列表中的索引
            this.downloaded = 0 // 已下载的任务数量
            this.convertText = ''
            this.reTryTimer = 0 // 重试下载的定时器
            this.downloadArea = document.createElement('div') // 下载区域
            this.totalNumberEl = document.createElement('span')
            this.downStatusEl = document.createElement('span')
            this.convertTipEL = document.createElement('div') // 转换动图时显示提示的元素
            this.downloadStop = false // 是否停止下载
            this.downloadPause = false // 是否暂停下载
            this.createDownloadArea()
            this.listenEvents()
          }
          // 返回任务停止状态。暂停和停止都视为停止下载
          get downloadStopped() {
            return this.downloadPause || this.downloadStop
          }
          listenEvents() {
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.crawlStart,
              () => {
                this.hideDownloadArea()
                this.reset()
              }
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.crawlFinish,
              () => {
                this.showDownloadArea()
                this.beforeDownload()
              }
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.convertChange,
              ev => {
                const count = ev.detail.data
                if (count > 0) {
                  this.convertText = _Lang__WEBPACK_IMPORTED_MODULE_3__[
                    'lang'
                  ].transl('_转换任务提示', count.toString())
                } else {
                  this.convertText = ''
                }
                this.convertTipEL.innerHTML = this.convertText
                this.LogDownloadStates()
              }
            )
            // 监听浏览器下载文件后，返回的消息
            chrome.runtime.onMessage.addListener(msg => {
              if (!this.taskBatch) {
                return
              }
              // 文件下载成功
              if (msg.msg === 'downloaded') {
                // 释放 BLOBURL
                URL.revokeObjectURL(msg.data.url)
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events
                    .downloadSucccess
                )
                this.downloadSuccess(msg.data)
              } else if (msg.msg === 'download_err') {
                // 浏览器把文件保存到本地时出错
                _Log__WEBPACK_IMPORTED_MODULE_2__['log'].error(
                  `${msg.data.id} download error! code: ${msg.err}. The downloader will try to download the file again `
                )
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadError
                )
                // 重新下载这个文件
                this.downloadError(msg.data)
              }
              // UUID 的情况
              if (msg.data && msg.data.uuid) {
                _Log__WEBPACK_IMPORTED_MODULE_2__['log'].error(
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_uuid')
                )
              }
            })
          }
          set setDownloaded(val) {
            this.downloaded = val
            this.LogDownloadStates()
            // 设置下载进度信息
            this.totalNumberEl.textContent = _Store__WEBPACK_IMPORTED_MODULE_1__[
              'store'
            ].result.length.toString()
            _ProgressBar__WEBPACK_IMPORTED_MODULE_9__[
              'progressBar'
            ].setTotalProgress(this.downloaded)
            // 重置下载进度信息
            if (this.downloaded === 0) {
              this.setDownStateText(
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_未开始下载')
              )
            }
            // 下载完毕
            if (
              this.downloaded ===
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length
            ) {
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadComplete
              )
              this.reset()
              this.setDownStateText(
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_下载完毕')
              )
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].success(
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_下载完毕'),
                2
              )
              _TitleBar__WEBPACK_IMPORTED_MODULE_4__['titleBar'].change('√')
            }
          }
          downloadedAdd() {
            this.setDownloaded = this.downloaded + 1
          }
          // 显示或隐藏下载区域
          showDownloadArea() {
            this.downloadArea.style.display = 'block'
          }
          hideDownloadArea() {
            this.downloadArea.style.display = 'none'
          }
          // 设置下载状态文本，默认颜色为主题蓝色
          setDownStateText(str, color = '') {
            const el = document.createElement('span')
            el.textContent = str
            if (color) {
              el.style.color = color
            }
            this.downStatusEl.innerHTML = ''
            this.downStatusEl.appendChild(el)
          }
          reset() {
            this.statesList = []
            this.downloadPause = false
            this.downloadStop = false
            clearTimeout(this.reTryTimer)
          }
          createDownloadArea() {
            const html = `<div class="download_area">
    <p> ${_Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
      '_共抓取到n个图片',
      '<span class="fwb blue imgNum">0</span>'
    )}</p>
    
    <div class="centerWrap_btns">
    <button class="startDownload" type="button" style="background:${
      _Colors__WEBPACK_IMPORTED_MODULE_5__['Colors'].blue
    };"> ${_Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
              '_下载按钮1'
            )}</button>
    <button class="pauseDownload" type="button" style="background:#e49d00;"> ${_Lang__WEBPACK_IMPORTED_MODULE_3__[
      'lang'
    ].transl('_下载按钮2')}</button>
    <button class="stopDownload" type="button" style="background:${
      _Colors__WEBPACK_IMPORTED_MODULE_5__['Colors'].red
    };"> ${_Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
              '_下载按钮3'
            )}</button>
    <button class="copyUrl" type="button" style="background:${
      _Colors__WEBPACK_IMPORTED_MODULE_5__['Colors'].green
    };"> ${_Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
              '_下载按钮4'
            )}</button>
    </div>
    <div class="centerWrap_down_tips">
    <p>
    ${_Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_当前状态')}
    <span class="down_status blue"><span>${_Lang__WEBPACK_IMPORTED_MODULE_3__[
      'lang'
    ].transl('_未开始下载')}</span></span>
    <span class="convert_tip warn"></span>
    </p>
    </div>
    </div>`
            const el = _CenterPanel__WEBPACK_IMPORTED_MODULE_6__[
              'centerPanel'
            ].useSlot('downloadArea', html)
            this.downloadArea = el
            this.downStatusEl = el.querySelector('.down_status ')
            this.convertTipEL = el.querySelector('.convert_tip')
            this.totalNumberEl = el.querySelector('.imgNum')
            document
              .querySelector('.startDownload')
              .addEventListener('click', () => {
                this.startDownload()
              })
            document
              .querySelector('.pauseDownload')
              .addEventListener('click', () => {
                this.pauseDownload()
              })
            document
              .querySelector('.stopDownload')
              .addEventListener('click', () => {
                this.stopDownload()
              })
            document.querySelector('.copyUrl').addEventListener('click', () => {
              this.showURLs()
            })
          }
          // 显示 url
          showURLs() {
            if (
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length === 0
            ) {
              return alert(
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_没有数据可供使用'
                )
              )
            }
            let result = ''
            result = _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.reduce(
              (total, now) => {
                return (total += now.url + '<br>')
              },
              result
            )
            _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.output,
              result
            )
          }
          // 下载线程设置
          setDownloadThread() {
            const setThread = parseInt(
              _Settings__WEBPACK_IMPORTED_MODULE_7__['form'].downloadThread
                .value
            )
            if (
              setThread < 1 ||
              setThread > this.downloadThreadMax ||
              isNaN(setThread)
            ) {
              // 如果数值非法，则重设为默认值
              this.downloadThread = this.downloadThreadMax
            } else {
              this.downloadThread = setThread // 设置为用户输入的值
            }
            // 如果剩余任务数量少于下载线程数
            if (
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length -
                this.downloaded <
              this.downloadThread
            ) {
              this.downloadThread =
                _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length -
                this.downloaded
            }
            // 重设下载进度条
            _ProgressBar__WEBPACK_IMPORTED_MODULE_9__['progressBar'].reset(
              this.downloadThread
            )
          }
          // 抓取完毕之后，已经可以开始下载时，根据一些状态进行处理
          beforeDownload() {
            this.setDownloaded = 0
            this.setDownloadThread()
            // 检查 不自动开始下载 的标记
            if (
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].states
                .notAutoDownload
            ) {
              return
            }
            const autoDownload =
              _Settings__WEBPACK_IMPORTED_MODULE_7__['form'].quietDownload
                .checked
            if (
              !autoDownload &&
              !_Store__WEBPACK_IMPORTED_MODULE_1__['store'].states.quickDownload
            ) {
              _TitleBar__WEBPACK_IMPORTED_MODULE_4__['titleBar'].change('▶')
            }
            // 视情况自动开始下载
            if (
              autoDownload ||
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].states.quickDownload
            ) {
              this.startDownload()
            }
          }
          // 开始下载
          startDownload() {
            // 如果正在下载中，或无图片，则不予处理
            if (
              !_Store__WEBPACK_IMPORTED_MODULE_1__['store'].states.allowWork ||
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length === 0
            ) {
              return
            }
            // 如果之前不是暂停状态，则需要重新下载
            if (!this.downloadPause) {
              this.setDownloaded = 0
              // 初始化下载记录
              // 状态：
              // -1 未使用
              // 0 使用中
              // 1 已完成
              this.statesList = new Array(
                _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length
              ).fill(-1)
              this.taskBatch = new Date().getTime() // 修改本批下载任务的标记
            } else {
              // 继续下载
              // 把“使用中”的下载状态重置为“未使用”
              for (let index = 0; index < this.statesList.length; index++) {
                if (this.statesList[index] === 0) {
                  this.statesList[index] = -1
                }
              }
            }
            // 重置一些条件
            this.downloadPause = false
            this.downloadStop = false
            clearTimeout(this.reTryTimer)
            this.setDownloadThread()
            _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadStart
            )
            // 启动或继续下载，建立并发下载线程
            for (let i = 0; i < this.downloadThread; i++) {
              this.createDownload(i)
            }
            this.setDownStateText(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_正在下载中')
            )
            _Log__WEBPACK_IMPORTED_MODULE_2__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_正在下载中')
            )
          }
          // 暂停下载
          pauseDownload() {
            clearTimeout(this.reTryTimer)
            if (
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length === 0
            ) {
              return
            }
            // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
            if (this.downloadStop === true) {
              return
            }
            if (this.downloadPause === false) {
              // 如果正在下载中
              if (
                !_Store__WEBPACK_IMPORTED_MODULE_1__['store'].states.allowWork
              ) {
                this.downloadPause = true // 发出暂停信号
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadPause
                )
                _TitleBar__WEBPACK_IMPORTED_MODULE_4__['titleBar'].change('║')
                this.setDownStateText(
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_已暂停'),
                  '#f00'
                )
                _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_已暂停'),
                  2
                )
              } else {
                // 不在下载中的话不允许启用暂停功能
                return
              }
            }
          }
          // 停止下载
          stopDownload() {
            clearTimeout(this.reTryTimer)
            if (
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length ===
                0 ||
              this.downloadStop
            ) {
              return
            }
            this.downloadStop = true
            _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadStop
            )
            _TitleBar__WEBPACK_IMPORTED_MODULE_4__['titleBar'].change('■')
            this.setDownStateText(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_已停止'),
              '#f00'
            )
            _Log__WEBPACK_IMPORTED_MODULE_2__['log'].error(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_已停止'),
              2
            )
            this.downloadPause = false
          }
          downloadError(data) {
            if (this.downloadPause || this.downloadStop) {
              return false
            }
            const task = this.taskList[data.id]
            // 复位这个任务的状态
            this.setDownloadedIndex(task.index, -1)
            // 建立下载任务，再次下载它
            this.createDownload(task.progressBarIndex)
          }
          downloadSuccess(data) {
            const task = this.taskList[data.id]
            // 更改这个任务状态为“已完成”
            this.setDownloadedIndex(task.index, 1)
            // 增加已下载数量
            this.downloadedAdd()
            // 是否继续下载
            const no = task.progressBarIndex
            if (this.checkContinueDownload()) {
              this.createDownload(no)
            }
          }
          // 设置已下载列表中的标记
          setDownloadedIndex(index, value) {
            this.statesList[index] = value
          }
          // 当一个文件下载完成后，检查是否还有后续下载任务
          checkContinueDownload() {
            // 如果没有全部下载完毕
            if (
              this.downloaded <
              _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length
            ) {
              // 如果任务已停止
              if (this.downloadPause || this.downloadStop) {
                return false
              }
              // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数，继续添加任务
              if (
                this.downloaded + this.downloadThread - 1 <
                _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length
              ) {
                return true
              } else {
                return false
              }
            } else {
              return false
            }
          }
          // 在日志上显示下载进度
          LogDownloadStates() {
            let text = `${this.downloaded} / ${_Store__WEBPACK_IMPORTED_MODULE_1__['store'].result.length}`
            // 追加转换动图的提示
            if (this.convertText) {
              text += ', ' + this.convertText
            }
            _Log__WEBPACK_IMPORTED_MODULE_2__['log'].log(text, 2, false)
          }
          // 查找需要进行下载的作品，建立下载
          createDownload(progressBarIndex) {
            let length = this.statesList.length
            let index
            for (let i = 0; i < length; i++) {
              if (this.statesList[i] === -1) {
                this.statesList[i] = 0
                index = i
                break
              }
            }
            if (index === undefined) {
              throw new Error('There are no data to download')
            } else {
              const workData =
                _Store__WEBPACK_IMPORTED_MODULE_1__['store'].result[index]
              const data = {
                id: workData.id,
                data: workData,
                index: index,
                progressBarIndex: progressBarIndex,
                taskBatch: this.taskBatch
              }
              // 保存任务信息
              this.taskList[workData.id] = {
                index,
                progressBarIndex: progressBarIndex
              }
              // 建立下载
              new _Download__WEBPACK_IMPORTED_MODULE_8__['Download'](
                progressBarIndex,
                data
              )
            }
          }
        }
        new DownloadControl()

        /***/
      },

    /***/ './src/ts/modules/EVT.ts':
      /*!*******************************!*\
  !*** ./src/ts/modules/EVT.ts ***!
  \*******************************/
      /*! exports provided: EVT */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'EVT',
          function() {
            return EVT
          }
        )
        class EVT {
          static fire(type, data = '') {
            const event = new CustomEvent(type, {
              detail: { data: data }
            })
            window.dispatchEvent(event)
          }
        }
        EVT.events = {
          crawlStart: 'crawlStart',
          crawlFinish: 'crawlFinish',
          crawlEmpty: 'crawlEmpty',
          crawlError: 'crawlError',
          addResult: 'addResult',
          downloadStart: 'downloadStart',
          downloadPause: 'downloadPause',
          downloadStop: 'downloadStop',
          download: 'download',
          downloadSucccess: 'downloadSucccess',
          downloadError: 'downloadError',
          downloadComplete: 'downloadComplete',
          pageSwitch: 'pageSwitch',
          pageTypeChange: 'pageTypeChange',
          resetOption: 'resetOption',
          convertChange: 'convertChange',
          previewFileName: 'previewFileName',
          output: 'output',
          hideCenterPanel: 'hideCenterPanel',
          showCenterPanel: 'showCenterPanel',
          clearMultiple: 'clearMultiple',
          clearUgoira: 'clearUgoira',
          deleteWork: 'deleteWork',
          worksUpdate: 'worksUpdate',
          toggleForm: 'toggleForm',
          settingChange: 'settingChange',
          clickRightIcon: 'clickRightIcon',
          destroy: 'destroy'
        }

        /***/
      },

    /***/ './src/ts/modules/FastScreen.ts':
      /*!**************************************!*\
  !*** ./src/ts/modules/FastScreen.ts ***!
  \**************************************/
      /*! exports provided: FastScreen */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'FastScreen',
          function() {
            return FastScreen
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./PageInfo */ './src/ts/modules/PageInfo.ts'
        )

        // 在搜索页面按收藏数快速筛选
        class FastScreen {
          constructor() {
            this.create()
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.destroy,
              () => {
                this.destroy()
              }
            )
          }
          // 添加快速筛选功能
          create() {
            // 判断插入点的元素有没有加载出来
            let target = document.querySelector('#root>div')
            if (!target) {
              setTimeout(() => {
                this.create()
              }, 300)
              return
            }
            const favNums = [
              '100users入り',
              '500users入り',
              '1000users入り',
              '3000users入り',
              '5000users入り',
              '10000users入り',
              '20000users入り',
              '30000users入り',
              '50000users入り'
            ] // 200 和 2000 的因为数量太少，不添加。40000 的也少
            const fastScreenArea = document.createElement('div')
            fastScreenArea.className = 'fastScreenArea'
            favNums.forEach(secondTag => {
              let a = document.createElement('a')
              a.innerText = secondTag
              a.href = 'javascript:viod(0)'
              a.onclick = () => {
                this.openFastScreenLink(secondTag)
              }
              fastScreenArea.appendChild(a)
            })
            target.insertAdjacentElement('afterend', fastScreenArea)
          }
          // 打开快速筛选链接
          openFastScreenLink(secondTag) {
            // 拼接两个 tag。因为搜索页面可以无刷新切换搜索的 tag，所以从这里动态获取
            const firstTag = _PageInfo__WEBPACK_IMPORTED_MODULE_2__[
              'pageInfo'
            ].getPageTag.split(' ')[0]
            const fullTag = encodeURIComponent(firstTag + ' ' + secondTag)
            // 用新的 tag 替换掉当前网址里的 tag
            let newURL = location.href.replace(
              encodeURIComponent(
                _PageInfo__WEBPACK_IMPORTED_MODULE_2__['pageInfo'].getPageTag
              ),
              fullTag
            )
            // 添加 s_mode=s_tag 宽松匹配标签
            let u = new URL(newURL)
            u.searchParams.set('s_mode', 's_tag')
            location.href = u.toString()
          }
          destroy() {
            // 删除快速筛选元素
            const fastScreen = document.querySelector('.fastScreenArea')
            _DOM__WEBPACK_IMPORTED_MODULE_1__['DOM'].removeEl(fastScreen)
          }
        }

        /***/
      },

    /***/ './src/ts/modules/FileName.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/FileName.ts ***!
  \************************************/
      /*! exports provided: fileName */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'fileName',
          function() {
            return fileName
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )

        class FileName {
          constructor() {
            // 用正则过滤不安全的字符，（Chrome 和 Windows 不允许做文件名的字符）
            // 不安全的字符，这里多数是控制字符，需要替换掉
            this.unsafeStr = new RegExp(
              /[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g
            )
            // 一些需要替换成全角字符的符号，左边是正则表达式的字符
            this.fullWidthDict = [
              ['\\\\', '＼'],
              ['/', '／'],
              [':', '：'],
              ['\\?', '？'],
              ['"', '＂'],
              ['<', '＜'],
              ['>', '＞'],
              ['\\*', '＊'],
              ['\\|', '｜'],
              ['~', '～']
            ]
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.previewFileName,
              () => {
                this.previewFileName()
              }
            )
          }
          // 把一些特殊字符替换成全角字符
          replaceUnsafeStr(str) {
            str = str.replace(this.unsafeStr, '')
            for (let index = 0; index < this.fullWidthDict.length; index++) {
              const rule = this.fullWidthDict[index]
              const reg = new RegExp(rule[0], 'g')
              str = str.replace(reg, rule[1])
            }
            return str
          }
          // 生成文件名，传入参数为图片信息
          getFileName(data) {
            let result =
              _Settings__WEBPACK_IMPORTED_MODULE_1__['form'].userSetName.value
            // 为空时使用 {id}
            result = result || '{id}' // 生成文件名
            const illustTypes = ['illustration', 'manga', 'ugoira'] // 作品类型 0 插画 1 漫画 2 动图
            // 储存每个文件名标记的配置
            const cfg = [
              {
                name: '{p_user}',
                // 标记
                value:
                  _Store__WEBPACK_IMPORTED_MODULE_2__['store'].pageInfo
                    .pageUserName,
                // 值
                prefix: '',
                // 添加在前面的标记
                safe: false
                // 是否是安全的文件名。如果可能包含一些特殊字符，就不安全，要进行替换
              },
              {
                name: '{p_uid}',
                value:
                  _Store__WEBPACK_IMPORTED_MODULE_2__['store'].pageInfo
                    .pageUserID || '',
                prefix: '',
                safe: true
              },
              {
                name: '{p_title}',
                value:
                  _Store__WEBPACK_IMPORTED_MODULE_2__['store'].pageInfo
                    .pageTitle,
                prefix: '',
                safe: false
              },
              {
                name: '{p_tag}',
                value:
                  _Store__WEBPACK_IMPORTED_MODULE_2__['store'].pageInfo.pageTag,
                prefix: '',
                safe: false
              },
              {
                name: '{id}',
                value: data.id,
                prefix: '',
                safe: true
              },
              {
                name: '{id_num}',
                value: data.idNum,
                prefix: '',
                safe: true
              },
              {
                name: '{p_num}',
                value: parseInt(/\d*$/.exec(data.id)[0]),
                prefix: '',
                safe: true
              },
              {
                name: '{rank}',
                value: data.rank,
                prefix: '',
                safe: true
              },
              {
                name: '{title}',
                value: data.title,
                prefix: 'title_',
                safe: false
              },
              {
                name: '{user}',
                value: data.user,
                prefix: 'user_',
                safe: false
              },
              {
                name: '{userid}',
                value: data.userid,
                prefix: 'uid_',
                safe: true
              },
              {
                name: '{px}',
                value: (function() {
                  if (result.includes('{px}') && data.fullWidth !== undefined) {
                    return data.fullWidth + 'x' + data.fullHeight
                  } else {
                    return ''
                  }
                })(),
                prefix: '',
                safe: true
              },
              {
                name: '{tags}',
                value: data.tags.join(','),
                prefix: 'tags_',
                safe: false
              },
              {
                name: '{tags_translate}',
                value: data.tagsTranslated.join(','),
                prefix: 'tags_',
                safe: false
              },
              {
                name: '{bmk}',
                value: data.bmk,
                prefix: 'bmk_',
                safe: true
              },
              {
                name: '{date}',
                value: data.date,
                prefix: '',
                safe: true
              },
              {
                name: '{type}',
                value: illustTypes[data.type],
                prefix: '',
                safe: true
              }
            ]
            // 替换命名规则里的特殊字符
            result = this.replaceUnsafeStr(result)
            // 上一步会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
            result = result.replace(/／/g, '/')
            // 把命名规则的标记替换成实际值
            for (const item of cfg) {
              if (
                result.includes(item.name) &&
                item.value !== '' &&
                item.value !== null
              ) {
                // 只有当标记有值时才继续操作. 所以没有值的标记会原样保留
                let once = String(item.value)
                // 处理标记值中的特殊字符
                if (!item.safe) {
                  once = this.replaceUnsafeStr(once)
                }
                // 添加标记名称
                if (
                  _Settings__WEBPACK_IMPORTED_MODULE_1__['form']
                    .tagNameToFileName.checked
                ) {
                  once = item.prefix + once
                }
                result = result.replace(new RegExp(item.name, 'g'), once) // 将标记替换成最终值，如果有重复的标记，全部替换
              }
            }
            // 处理空值，连续的 '//'。 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
            result = result.replace(/undefined/g, '').replace(/\/{2,9}/, '/')
            // 对每一层路径进行处理
            let tempArr = result.split('/')
            tempArr.forEach((str, index, arr) => {
              // 替换路径首尾的空格
              // 把每层路径头尾的 . 变成全角的．因为 Chrome 不允许头尾使用 .
              arr[index] = str
                .trim()
                .replace(/^\./g, '．')
                .replace(/\.$/g, '．')
            })
            result = tempArr.join('/')
            // 去掉头尾的 /
            if (result.startsWith('/')) {
              result = result.replace('/', '')
            }
            if (result.endsWith('/')) {
              result = result.substr(0, result.length - 1)
            }
            // 如果快速下载时只有一个文件，根据“始终建立文件夹”选项，决定是否建立文件夹
            if (
              _Store__WEBPACK_IMPORTED_MODULE_2__['store'].states
                .quickDownload &&
              _Store__WEBPACK_IMPORTED_MODULE_2__['store'].result.length ===
                1 &&
              _Settings__WEBPACK_IMPORTED_MODULE_1__['form'].alwaysFolder
                .checked === false
            ) {
              const index = result.lastIndexOf('/')
              result = result.substr(index + 1, result.length)
            }
            // 添加后缀名
            result += '.' + data.ext
            return result
          }
          // 预览文件名
          previewFileName() {
            if (
              _Store__WEBPACK_IMPORTED_MODULE_2__['store'].result.length === 0
            ) {
              return alert(
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_没有数据可供使用'
                )
              )
            }
            // 使用数组储存和拼接字符串，提高性能
            const resultArr = []
            const length =
              _Store__WEBPACK_IMPORTED_MODULE_2__['store'].result.length
            for (let i = 0; i < length; i++) {
              const data =
                _Store__WEBPACK_IMPORTED_MODULE_2__['store'].result[i]
              // 为默认文件名添加颜色。这里有两种处理方式，一种是取出用其他下载软件下载后的默认文件名，一种是取出本程序使用的默认文件名 data.id。这里使用前者，方便用户用其他下载软件下载后，再用生成的文件名重命名。
              const defaultName = data.url.replace(/.*\//, '')
              const defaultNameHtml = `<span class="color999">${defaultName}</span>`
              // 为生成的文件名添加颜色
              const fullName = this.getFileName(data)
              const part = fullName.split('/')
              const length = part.length
              for (let i = 0; i < length; i++) {
                const str = part[i]
                if (i < length - 1) {
                  // 如果不是最后一项，说明是文件夹名，添加颜色
                  part[i] = `<span class="color666">${str}</span>`
                } else {
                  // 最后一项，是文件名，添加颜色
                  part[i] = `<span class="color000">${str}</span>`
                }
              }
              const fullNameHtml = part.join('/')
              // 保存本条结果
              const nowResult = `<p class="result">${defaultNameHtml}: ${fullNameHtml}</p>`
              resultArr.push(nowResult)
            }
            // 拼接所有结果
            const result = resultArr.join('')
            _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.output,
              result
            )
          }
        }
        const fileName = new FileName()

        /***/
      },

    /***/ './src/ts/modules/Filter.ts':
      /*!**********************************!*\
  !*** ./src/ts/modules/Filter.ts ***!
  \**********************************/
      /*! exports provided: filter */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'filter',
          function() {
            return filter
          }
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )

        // 审查每个作品的数据，决定是否要下载它。下载区域有一些选项是过滤器选项。
        class Filter {
          constructor() {
            this.downType0 = true
            this.downType1 = true
            this.downType2 = true
            this.multipleImageWorks = 0 // 多图作品设置
            this.includeTag = '' // 必须包含的tag的列表
            this.excludeTag = '' // 要排除的tag的列表
            this.filterBMKNum = false // 是否要求收藏数量
            this.BMKNum = 0 // 输入的收藏数量
            this.onlyBmk = false // 是否只下载收藏的作品
            // 宽高条件
            this.filterWh = {
              andOr: '&',
              width: 0,
              height: 0
            }
            this.ratioType = '0' // 宽高比例的类型
            this.idRange = -1 // id 范围，默认不限制
            this.postDate = false // 是否设置投稿时间
            this.postDateStart = new Date()
            this.postDateEnd = new Date()
            this.debut = false // 只下载首次登场的作品
          }
          // 从下载区域上获取过滤器的各个选项
          init() {
            // 获取排除作品类型的设置
            this.getDownType()
            // 获取多图作品设置
            this.multipleImageWorks = parseInt(
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].multipleImageWorks
                .value
            )
            // 获取是否设置了收藏数要求
            this.filterBMKNum = this.getBMKNumSet()
            if (this.filterBMKNum) {
              this.BMKNum = this.getBMKNum()
            }
            // 获取是否设置了只下载书签作品
            this.onlyBmk = this.getOnlyBmk()
            // 获取是否设置了宽高条件
            this.filterWh = this.getSetWh()
            // 获取宽高比设置
            this.ratioType = this.getRatio()
            // 获取 id 范围设置
            this.idRange = this.getIdRange()
            // 获取投稿时间设置
            this.postDate = this.getPostDateSetting()
            // 获取必须包含的tag
            this.includeTag = this.getIncludeTag()
            // 获取要排除的tag
            this.excludeTag = this.getExcludeTag()
            // 获取只下载首次登场设置
            this.debut = this.getDebut()
          }
          // 检查作品是否符合过滤器的要求
          // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
          check(option) {
            // 储存每一项检查的结果. true 表示保留这个作品
            let result = []
            // 检查下载的作品类型设置
            result.push(this.checkDownType(option.illustType))
            // 检查多图作品设置
            result.push(this.checkMultipleImageWorks(option.pageCount))
            // 检查收藏数要求
            result.push(this.checkBMK(option.bookmarkCount))
            // 检查只下载书签作品的要求
            result.push(this.checkOnlyBmk(option.bookmarkData))
            // 检查要排除的 tag
            result.push(this.checkExcludeTag(option.tags))
            // 检查必须包含的 tag
            result.push(this.checkIncludeTag(option.tags))
            // 检查宽高设置
            result.push(this.checkSetWh(option.width, option.height))
            // 检查宽高比设置
            result.push(this.checkRatio(option.width, option.height))
            // 检查 id 范围设置
            result.push(this.checkIdRange(option.id))
            // 检查投稿时间设置
            result.push(this.checkPostDate(option.createDate))
            // 检查首次登场设置
            result.push(this.checkDebut(option.yes_rank))
            // 结果里不包含 false 时，检查通过。只要有一个 false 就不通过
            return !result.includes(false)
          }
          // 获取下载的作品类型设置
          getDownType() {
            this.downType0 =
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].downType0.checked
            this.downType1 =
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].downType1.checked
            this.downType2 =
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].downType2.checked
            // 如果全部排除则取消任务
            if (!this.downType0 && !this.downType1 && !this.downType2) {
              _EVT__WEBPACK_IMPORTED_MODULE_4__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_4__['EVT'].events.crawlError
              )
              const msg = _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                '_checkNotdownTypeAll'
              )
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].error(msg, 2)
              window.alert(msg)
              throw new Error(msg)
            }
            let notDownTip = ''
            notDownTip += this.downType0
              ? ''
              : _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl('_插画')
            notDownTip += this.downType1
              ? ''
              : _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl('_漫画')
            notDownTip += this.downType2
              ? ''
              : _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl('_动图')
            if (notDownTip) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_checkNotdownTypeResult'
                ) + notDownTip
              )
            }
          }
          // 获取必须包含的tag
          getIncludeTag() {
            const result =
              false ||
              this.checkTagString(
                _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].needTag.value
              )
            if (result) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_设置了必须tag之后的提示'
                ) + result
              )
            }
            return result
          }
          // 获取要排除的tag
          getExcludeTag() {
            const result =
              false ||
              this.checkTagString(
                _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].notNeedTag.value
              )
            if (result) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_设置了排除tag之后的提示'
                ) + result
              )
            }
            return result
          }
          // 获取过滤宽高的设置
          getSetWh() {
            let result = {
              andOr: '&',
              width: 0,
              height: 0
            }
            const checkWidth = _API__WEBPACK_IMPORTED_MODULE_3__[
              'API'
            ].checkNumberGreater0(
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].setWidth.value
            )
            const checkHeight = _API__WEBPACK_IMPORTED_MODULE_3__[
              'API'
            ].checkNumberGreater0(
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].setHeight.value
            )
            // 宽高只要有一个条件大于 0 即可
            if (checkWidth.value > 0 || checkHeight.value > 0) {
              result = {
                andOr:
                  _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].setWidthAndOr
                    .value,
                width: checkWidth ? checkWidth.value : 0,
                height: checkHeight ? checkHeight.value : 0
              }
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_设置了筛选宽高之后的提示文字p1'
                ) +
                  result.width +
                  result.andOr
                    .replace(
                      '|',
                      _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl('_或者')
                    )
                    .replace(
                      '&',
                      _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl('_并且')
                    ) +
                  _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                    '_高度设置'
                  ) +
                  result.height
              )
            }
            return result
          }
          // 获取检查收藏数量的设置
          getBMKNumSet() {
            const check =
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].checkFavNum.value
            // 0 为不检查，1 为检查
            return check === '1'
          }
          // 获取输入的收藏数
          getBMKNum() {
            const check = _API__WEBPACK_IMPORTED_MODULE_3__[
              'API'
            ].checkNumberGreater0(
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].setFavNum.value
            )
            if (check.result) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_设置了筛选收藏数之后的提示文字'
                ) + check.value
              )
            }
            return check.value
          }
          // 获取只下载书签作品的设置
          getOnlyBmk() {
            const result =
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].setOnlyBmk.checked
            if (result) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_只下载已收藏的提示'
                )
              )
            }
            return result
          }
          // 获取宽高比设置
          getRatio() {
            let result =
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].ratio.value
            if (result === '1') {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_设置了宽高比之后的提示',
                  _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl('_横图')
                )
              )
            } else if (result === '2') {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_设置了宽高比之后的提示',
                  _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl('_竖图')
                )
              )
            } else if (result === '3') {
              // 由用户输入
              const typeNum = parseFloat(
                _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].userRatio.value
              )
              if (isNaN(typeNum)) {
                result = '0'
                _Settings__WEBPACK_IMPORTED_MODULE_0__[
                  'form'
                ].ratio.value = result
                window.alert(
                  _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                    '_宽高比必须是数字'
                  )
                )
              } else {
                _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                  _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                    '_输入宽高比'
                  ) +
                    _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].userRatio
                      .value
                )
              }
            }
            return result
          }
          // 获取 id 范围设置
          getIdRange() {
            const result = parseInt(
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].idRange.value
            )
            if (result === 1 || result === 2) {
              let id = parseInt(
                _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].idRangeInput
                  .value
              )
              if (isNaN(id)) {
                _EVT__WEBPACK_IMPORTED_MODULE_4__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_4__['EVT'].events.crawlError
                )
                const msg = 'id is not a number!'
                window.alert(msg)
                _Log__WEBPACK_IMPORTED_MODULE_2__['log'].error(msg)
                throw new Error(msg)
              }
            }
            if (result === 1) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                `id > ${_Settings__WEBPACK_IMPORTED_MODULE_0__['form'].idRangeInput.value}`
              )
            }
            if (result === 2) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                `id < ${_Settings__WEBPACK_IMPORTED_MODULE_0__['form'].idRangeInput.value}`
              )
            }
            return result
          }
          // 获取投稿时间设置
          getPostDateSetting() {
            if (
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].postDate
                .checked === false
            ) {
              return false
            } else {
              // 如果启用了此设置，需要判断是否是有效的时间格式
              const postDateStart = new Date(
                _Settings__WEBPACK_IMPORTED_MODULE_0__[
                  'form'
                ].postDateStart.value
              )
              const postDateEnd = new Date(
                _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].postDateEnd.value
              )
              // 如果输入的时间可以被转换成有效的时间，则启用
              // 转换时间失败时，值是 Invalid Date，不能转换成数字
              if (
                isNaN(postDateStart.getTime()) ||
                isNaN(postDateEnd.getTime())
              ) {
                _EVT__WEBPACK_IMPORTED_MODULE_4__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_4__['EVT'].events.crawlError
                )
                const msg = 'Date format error!'
                _Log__WEBPACK_IMPORTED_MODULE_2__['log'].error(msg)
                window.alert(msg)
                throw new Error(msg)
              } else {
                // 转换时间成功
                this.postDateStart = postDateStart
                this.postDateEnd = postDateEnd
                _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                  `${_Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                    '_时间范围'
                  )}: ${
                    _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].postDateStart
                      .value
                  } - ${
                    _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].postDateEnd
                      .value
                  }`
                )
                return true
              }
            }
          }
          // 获取首次登场设置
          getDebut() {
            const result =
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].debut.value === '1'
            if (result) {
              _Log__WEBPACK_IMPORTED_MODULE_2__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_1__['lang'].transl(
                  '_抓取首次登场的作品Title'
                )
              )
            }
            return result
          }
          // 检查下载的作品类型设置
          checkDownType(illustType) {
            if (illustType === undefined) {
              return true
            } else {
              switch (illustType) {
                case 0:
                  return this.downType0 ? true : false
                case 1:
                  return this.downType1 ? true : false
                case 2:
                  return this.downType2 ? true : false
                default:
                  return true
              }
            }
          }
          // 检查多图作品设置
          checkMultipleImageWorks(pageCount) {
            if (pageCount === undefined) {
              return true
            } else {
              if (pageCount > 1) {
                // 是多图
                if (this.multipleImageWorks === -1) {
                  // 不下载多图
                  return false
                } else {
                  return true
                }
              } else {
                // 不是多图
                return true
              }
            }
          }
          // 检查收藏数要求
          checkBMK(bmk) {
            if (bmk === undefined || !this.filterBMKNum) {
              return true
            } else {
              return bmk >= this.BMKNum
            }
          }
          // 检查作品是否符合【只下载书签作品】的条件,返回值 true 表示包含这个作品
          checkOnlyBmk(bookmarked) {
            // 如果设置了只下载书签作品
            if (this.onlyBmk) {
              return !!bookmarked
            }
            return true
          }
          // 检查用户输入的 tag 内容
          checkTagString(str) {
            let result = ''
            if (str) {
              let tempArr = str.split(',')
              // 如果用户在末尾也输入了逗号，则会产生一个空值，去掉它
              if (tempArr[tempArr.length - 1] === '') {
                tempArr.pop()
              }
              result = tempArr.join(',')
            }
            return result
          }
          // 检查作品是否符合包含 tag 的条件, 如果设置了多个 tag，需要作品里全部包含。返回值表示是否保留这个作品。
          checkIncludeTag(tags) {
            let result = false
            if (!this.includeTag || tags === undefined) {
              return true
            }
            let tempArr = this.includeTag.split(',')
            // 如果设置了必须的 tag
            if (tempArr.length > 0) {
              let tagNeedMatched = 0
              const tempTags = new Set()
              // 如果不区分大小写的话，Fate/grandorder 和 Fate/GrandOrder 会被算作符合两个 tag，所以用 Set 结构去重。测试 id 51811780
              for (const tag of tags) {
                tempTags.add(tag.toLowerCase())
              }
              for (const tag of tempTags) {
                for (const need of tempArr) {
                  if (tag === need.toLowerCase()) {
                    tagNeedMatched++
                    break
                  }
                }
              }
              // 如果全部匹配
              if (tagNeedMatched >= tempArr.length) {
                result = true
              }
            } else {
              result = true
            }
            return result
          }
          // 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否保留这个作品。
          checkExcludeTag(tags) {
            let result = true
            if (!this.excludeTag || tags === undefined) {
              return true
            }
            let tempArr = this.excludeTag.split(',')
            // 如果设置了排除 tag
            if (tempArr.length > 0) {
              for (const tag of tags) {
                for (const notNeed of tempArr) {
                  if (tag.toLowerCase() === notNeed.toLowerCase()) {
                    result = false
                    break
                  }
                }
              }
            }
            return result
          }
          // 检查作品是否符合过滤宽高的条件
          checkSetWh(width, height) {
            if (width === undefined) {
              width = 0
            }
            if (height === undefined) {
              height = 0
            }
            if (this.filterWh.width > 0 || this.filterWh.height > 0) {
              // 如果宽高都小于要求的宽高
              if (
                width < this.filterWh.width &&
                height < this.filterWh.height
              ) {
                return false
              } else {
                if (this.filterWh.andOr === '|') {
                  // 判断or的情况
                  if (
                    width >= this.filterWh.width ||
                    height >= this.filterWh.height
                  ) {
                    return true
                  } else {
                    return false
                  }
                } else if (this.filterWh.andOr === '&') {
                  // 判断and的情况
                  if (
                    width >= this.filterWh.width &&
                    height >= this.filterWh.height
                  ) {
                    return true
                  } else {
                    return false
                  }
                }
              }
            }
            return true
          }
          // 检查作品是否符合宽高比条件
          checkRatio(width, height) {
            if (width === undefined) {
              width = 0
            }
            if (height === undefined) {
              height = 0
            }
            if (this.ratioType === '0') {
              return true
            } else if (this.ratioType === '1') {
              return width / height > 1
            } else if (this.ratioType === '2') {
              return width / height < 1
            } else {
              return (
                width / height >=
                parseFloat(
                  _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].userRatio.value
                )
              )
            }
          }
          // 检查 id 范围设置
          checkIdRange(id) {
            if (id === undefined) {
              return true
            }
            const nowId = parseInt(id.toString())
            const setId = parseInt(
              _Settings__WEBPACK_IMPORTED_MODULE_0__['form'].idRangeInput.value
            )
            if (this.idRange === 1) {
              // 大于
              return nowId > setId
            } else if (this.idRange === 2) {
              // 小于
              return nowId < setId
            } else {
              return true
            }
          }
          // 检查投稿时间设置
          checkPostDate(date) {
            if (!this.postDate || date === undefined) {
              return true
            } else {
              const nowDate = new Date(date)
              if (
                nowDate >= this.postDateStart &&
                nowDate <= this.postDateEnd
              ) {
                return true
              } else {
                return false
              }
            }
          }
          // 检查首次登场设置
          // yes_rank 是昨日排名，如果为 0，则此作品是“首次登场”的作品
          checkDebut(yes_rank) {
            if (!this.debut) {
              return true
            } else {
              if (yes_rank === 0 || yes_rank === undefined) {
                return true
              } else {
                return false
              }
            }
          }
        }
        const filter = new Filter()

        /***/
      },

    /***/ './src/ts/modules/ImgViewer.ts':
      /*!*************************************!*\
  !*** ./src/ts/modules/ImgViewer.ts ***!
  \*************************************/
      /*! exports provided: imgViewer */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'imgViewer',
          function() {
            return imgViewer
          }
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        // 图片查看器类
        /// <reference path = "./Viewer.d.ts" />

        class ImgViewer {
          constructor() {
            this.viewerUl = document.createElement('ul') // 图片列表的 ul 元素
            this.viewerWarpper = document.createElement('div') // 图片列表的容器
          }
          // 初始化图片查看器
          newViewer(pageCount, firsturl) {
            // 因为选项里的 size 是枚举类型，所以在这里也要定义一个枚举
            let ToolbarButtonSize
            ;(function(ToolbarButtonSize) {
              ToolbarButtonSize['Small'] = 'small'
              ToolbarButtonSize['Medium'] = 'medium'
              ToolbarButtonSize['Large'] = 'large'
            })(ToolbarButtonSize || (ToolbarButtonSize = {}))
            this.myViewer = new Viewer(this.viewerUl, {
              toolbar: {
                zoomIn: 0,
                zoomOut: 0,
                oneToOne: 1,
                reset: 0,
                prev: 1,
                play: {
                  show: 0,
                  size: ToolbarButtonSize.Large
                },
                next: 1,
                rotateLeft: 0,
                rotateRight: 0,
                flipHorizontal: 0,
                flipVertical: 0
              },
              url(image) {
                return image.dataset.src
              },
              viewed(ev) {
                // 当图片显示完成（加载完成）后，预加载下一张图片
                let index = ev.detail.index
                if (index < pageCount - 1) {
                  index++
                }
                const nextImg = firsturl.replace('p0', 'p' + index)
                const img = new Image()
                img.src = nextImg
              },
              // 取消一些动画，比如切换图片时，图片从小变大出现的动画
              transition: false,
              // 取消键盘支持，主要是用键盘左右方向键切换的话，会和 pixiv 页面产生冲突。（pixiv 页面上，左右方向键会切换作品）
              keyboard: false,
              // 不显示 title（图片名和宽高信息）
              title: false,
              // 不显示缩放比例
              tooltip: false
            })
          }
          // 初始化图片查看器
          init() {
            // 检查图片查看器元素是否已经生成
            if (!document.getElementById('viewerWarpper')) {
              // 创建图片查看器
              this.createViewer()
            } else {
              // 更新数据
              this.updateViewer()
            }
          }
          // 创建图片查看器 html 元素，并绑定一些事件，这个函数只会在初始化时执行一次
          createViewer() {
            if (!document.querySelector('main figcaption')) {
              // 等到作品主体部分的元素生成之后再创建查看器
              setTimeout(() => {
                this.createViewer()
              }, 300)
              return
            }
            // 查看器图片列表元素的结构： div#viewerWarpper > ul > li > img
            this.viewerWarpper = document.createElement('div')
            this.viewerWarpper.id = 'viewerWarpper'
            this.viewerUl = document.createElement('ul')
            this.viewerWarpper.appendChild(this.viewerUl)
            document
              .querySelector('main figcaption')
              .insertAdjacentElement('beforebegin', this.viewerWarpper)
            // 图片查看器显示之后
            this.viewerUl.addEventListener('shown', () => {
              // 显示相关元素
              this.showViewerOther()
              // 点击 1：1 按钮时，全屏查看
              document
                .querySelector('.viewer-one-to-one')
                .addEventListener('click', () => {
                  this.hideViewerOther() // 隐藏查看器的其他元素
                  // 进入全屏
                  document.body.requestFullscreen()
                  // 使图片居中显示，必须加延迟
                  setTimeout(() => {
                    this.setViewerCenter()
                  }, 100)
                  setInterval(() => {
                    this.zoomToMax()
                  }, 100)
                })
            })
            // 全屏状态下，查看和切换图片时，显示比例始终为 100%
            this.viewerUl.addEventListener('view', () => {
              if (this.isFullscreen()) {
                setTimeout(() => {
                  // 通过点击 1:1 按钮，调整为100%并居中。这里必须要加延时，否则点击的时候图片还是旧的
                  document.querySelector('.viewer-one-to-one').click()
                }, 50)
              }
            })
            // 隐藏查看器时，如果还处于全屏，则退出全屏
            this.viewerUl.addEventListener('hidden', () => {
              if (this.isFullscreen()) {
                document.exitFullscreen()
              }
            })
            // esc 退出图片查看器
            document.addEventListener('keyup', event => {
              if (event.keyCode === 27) {
                // 按下 esc
                // 如果非全屏，且查看器已经打开，则退出查看器
                if (!this.isFullscreen() && this.viewerIsShow()) {
                  document.querySelector('.viewer-close').click()
                }
              }
            })
            void [
              'fullscreenchange',
              'webkitfullscreenchange',
              'mozfullscreenchange'
            ].forEach(arg => {
              // 检测全屏状态变化，目前有兼容性问题（这里也相当于绑定了按 esc 退出的事件）
              document.addEventListener(arg, () => {
                // 退出全屏
                if (!this.isFullscreen()) {
                  this.showViewerOther()
                }
              })
            })
            this.updateViewer()
          }
          // 根据作品信息，更新图片查看器配置。每当页面更新时执行一次
          async updateViewer() {
            this.viewerWarpper.style.display = 'none' // 先隐藏 viewerWarpper
            // 获取作品信息
            const data = await _API__WEBPACK_IMPORTED_MODULE_0__[
              'API'
            ].getWorksData(
              _API__WEBPACK_IMPORTED_MODULE_0__['API'].getIllustId()
            )
            const thisOneData = data.body
            // 处理插画或漫画作品，不处理动图作品
            if (thisOneData.illustType === 0 || thisOneData.illustType === 1) {
              // 有多张图片时，创建缩略图
              if (thisOneData.pageCount > 1) {
                const { thumb, original } = thisOneData.urls
                this.viewerUl.innerHTML = new Array(thisOneData.pageCount)
                  .fill(1)
                  .reduce((html, now, index) => {
                    return (html += `<li><img src="${thumb.replace(
                      'p0',
                      'p' + index
                    )}" data-src="${original.replace(
                      'p0',
                      'p' + index
                    )}"></li>`)
                  }, '')
                // 数据更新后，显示 viewerWarpper
                this.viewerWarpper.style.display = 'block'
                // 销毁看图组件
                if (this.myViewer) {
                  this.myViewer.destroy()
                }
                // 重新配置看图组件
                this.newViewer(thisOneData.pageCount, original)
                // 预加载第一张图片
                const img = new Image()
                img.src = original
              }
            }
          }
          // 隐藏查看器的其他元素
          hideViewerOther() {
            document
              .querySelector('.viewer-container')
              .classList.add('black-background')
            // 隐藏底部的其他元素，仍然显示左右切换按钮
            const close = document.querySelector('.viewer-close')
            const oneToOne = document.querySelector('.viewer-one-to-one')
            const navbar = document.querySelector('.viewer-navbar')
            for (const element of [close, oneToOne, navbar]) {
              element.style.display = 'none'
            }
          }
          // 显示查看器的其他元素
          showViewerOther() {
            document
              .querySelector('.viewer-container')
              .classList.remove('black-background')
            // 显示底部隐藏的元素
            const close = document.querySelector('.viewer-close')
            const oneToOne = document.querySelector('.viewer-one-to-one')
            const navbar = document.querySelector('.viewer-navbar')
            for (const element of [close, oneToOne, navbar]) {
              element.style.display = 'block'
            }
          }
          zoomToMax() {
            const img = document.querySelector('.viewer-move')
            if (
              this.isFullscreen() &&
              parseInt(img.style.width) < img.naturalWidth
            ) {
              // img.style.width=img.naturalWidth+'px'
              // img.style.height = img.naturalHeight+'px'
              this.myViewer.zoomTo(1)
            }
          }
          // 在图片100%显示时，使其居中
          setViewerCenter() {
            // 获取图片宽高
            const imgInfo = document.querySelector('.viewer-title').textContent
            // 如果图片尚未加载出来的话，就没有内容，就过一会儿再执行
            if (!imgInfo) {
              setTimeout(() => {
                this.setViewerCenter()
              }, 200)
              return
            }
            const [imgWidth, imgHeight] = /\d{1,5} × \d{1,5}/
              .exec(imgInfo)[0]
              .split(' × ')
            // > '66360324_p5_master1200.jpg (919 × 1300)'
            // < ["919", "1300"]
            // 获取网页宽高
            const htmlWidth = document.documentElement.clientWidth
            const htmlHeight = document.documentElement.clientHeight
            // 设置边距
            const setWidth = (htmlWidth - parseInt(imgWidth)) / 2
            let setHeight = (htmlHeight - parseInt(imgHeight)) / 2
            // 当图片高度大于浏览器窗口高度时，居顶显示而不是居中
            // if (setHeight < 0) {
            //   setHeight = 0
            // }
            this.myViewer.zoomTo(1)
            this.myViewer.moveTo(setWidth, setHeight)
          }
          // 判断是否处于全屏状态
          isFullscreen() {
            return !!document.fullscreenElement
          }
          // 判断看图器是否处于显示状态
          viewerIsShow() {
            const viewerContainer = document.querySelector('.viewer-container')
            if (viewerContainer) {
              return viewerContainer.classList.contains('viewer-in')
            } else {
              return false
            }
          }
        }
        const imgViewer = new ImgViewer()

        /***/
      },

    /***/ './src/ts/modules/InitAreaRankingPage.ts':
      /*!***********************************************!*\
  !*** ./src/ts/modules/InitAreaRankingPage.ts ***!
  \***********************************************/
      /*! exports provided: InitAreaRankingPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitAreaRankingPage',
          function() {
            return InitAreaRankingPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Filter */ './src/ts/modules/Filter.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        // 初始化地区排行榜页面

        class InitAreaRankingPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_3__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_抓取本页作品'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_抓取本页作品Title'
                    )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.readyCrawl()
              })
          }
          setFormOption() {
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].hideOption([
              1,
              15,
              18
            ])
          }
          destroy() {}
          getIdList() {
            // 地区排行榜
            const allPicArea = document.querySelectorAll(
              '.ranking-item>.work_wrapper'
            )
            for (const el of allPicArea) {
              const img = el.querySelector('._thumbnail')
              // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型
              // 提取出 tag 列表
              const id = img.dataset.id
              const tags = img.dataset.tags.split(' ')
              const bookmarked = el
                .querySelector('._one-click-bookmark')
                .classList.contains('on')
              const filterOpt = {
                id: id,
                tags: tags,
                bookmarkData: bookmarked
              }
              if (
                _Filter__WEBPACK_IMPORTED_MODULE_5__['filter'].check(filterOpt)
              ) {
                const id = _API__WEBPACK_IMPORTED_MODULE_6__['API'].getIllustId(
                  el.querySelector('a').href
                )
                _Store__WEBPACK_IMPORTED_MODULE_7__['store'].idList.push(id)
              }
            }
            this.getIdListFinished()
          }
          resetGetIdListStatus() {}
        }

        /***/
      },

    /***/ './src/ts/modules/InitBookmarkDetailPage.ts':
      /*!**************************************************!*\
  !*** ./src/ts/modules/InitBookmarkDetailPage.ts ***!
  \**************************************************/
      /*! exports provided: InitBookmarkDetailPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitBookmarkDetailPage',
          function() {
            return InitBookmarkDetailPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        // 初始化 bookmark_detail 页面

        class InitBookmarkDetailPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_3__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_抓取相似图片'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_抓取相似图片'
                    )
                  ]
                ]
              )
              .addEventListener(
                'click',
                () => {
                  this.readyCrawl()
                },
                false
              )
          }
          setFormOption() {
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_个数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_要获取的作品个数2'
              ),
              rangTip: `1 - ${this.maxCount}`,
              value: this.maxCount.toString()
            })
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].hideOption([
              15,
              18
            ])
          }
          destroy() {}
          getWantPage() {
            const check = this.checkWantPageInputGreater0()
            if (check == undefined) {
              return
            }
            this.crawlNumber = check
            if (this.crawlNumber > this.maxCount) {
              this.crawlNumber = this.maxCount
            }
          }
          // 获取相似的作品列表
          async getIdList() {
            let data = await _API__WEBPACK_IMPORTED_MODULE_5__[
              'API'
            ].getRecommenderData(
              _API__WEBPACK_IMPORTED_MODULE_5__['API'].getIllustId(),
              this.crawlNumber
            )
            for (const id of data.recommendations) {
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.push(
                id.toString()
              )
            }
            this.getIdListFinished()
          }
          resetGetIdListStatus() {}
        }

        /***/
      },

    /***/ './src/ts/modules/InitBookmarkNewIllustPage.ts':
      /*!*****************************************************!*\
  !*** ./src/ts/modules/InitBookmarkNewIllustPage.ts ***!
  \*****************************************************/
      /*! exports provided: InitBookmarkNewIllustPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitBookmarkNewIllustPage',
          function() {
            return InitBookmarkNewIllustPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Filter */ './src/ts/modules/Filter.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        // 初始化 关注的新作品页面

        class InitBookmarkNewIllustPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.r18 = false
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_3__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_开始抓取'),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_开始抓取'
                    ) +
                      _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                        '_默认下载多页'
                      )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.readyCrawl()
              })
          }
          appendElseEl() {
            // 添加 R-18 页面的链接
            const r18Link = `<li><a href="/bookmark_new_illust_r18.php">R-18</a></li>`
            const target = document.querySelector('.menu-items')
            if (target) {
              target.insertAdjacentHTML('beforeend', r18Link)
            }
          }
          setFormOption() {
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_页数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_checkWantPageRule1Arg8'
              ),
              rangTip: `1 - ${this.maxCount}`,
              value: this.maxCount.toString()
            })
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].hideOption([
              15,
              18
            ])
          }
          destroy() {}
          getWantPage() {
            const check = this.checkWantPageInputGreater0()
            if (check == undefined) {
              return
            }
            this.crawlNumber = check
            if (this.crawlNumber > this.maxCount) {
              this.crawlNumber = this.maxCount
            }
            this.listPageFinished = 0
            _Log__WEBPACK_IMPORTED_MODULE_8__['log'].warning(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_任务开始1',
                this.crawlNumber.toString()
              )
            )
          }
          nextStep() {
            this.r18 = location.pathname.includes('r18')
            const p = _API__WEBPACK_IMPORTED_MODULE_6__['API'].getURLField(
              location.href,
              'p'
            )
            this.startpageNo = parseInt(p) || 1
            this.getIdList()
          }
          async getIdList() {
            let p = this.startpageNo + this.listPageFinished
            // 发起请求，获取列表页
            let worksData
            try {
              worksData = await _API__WEBPACK_IMPORTED_MODULE_6__[
                'API'
              ].getBookmarkNewIllustData(p, this.r18)
            } catch (error) {
              this.getIdList()
              return
            }
            // 检查一些此时可以进行检查的设置项
            for (const data of worksData) {
              const filterOpt = {
                id: data.illustId,
                width: data.width,
                height: data.height,
                pageCount: data.pageCount,
                bookmarkData: data.isBookmarked,
                illustType: parseInt(data.illustType),
                tags: data.tags
              }
              if (
                _Filter__WEBPACK_IMPORTED_MODULE_5__['filter'].check(filterOpt)
              ) {
                _Store__WEBPACK_IMPORTED_MODULE_7__['store'].idList.push(
                  data.illustId
                )
              }
            }
            this.listPageFinished++
            _Log__WEBPACK_IMPORTED_MODULE_8__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_列表页抓取进度',
                this.listPageFinished.toString()
              ),
              1,
              false
            )
            // 判断任务状态
            // 如果抓取了所有页面，或者抓取完指定页面
            if (p >= 100 || this.listPageFinished === this.crawlNumber) {
              _Log__WEBPACK_IMPORTED_MODULE_8__['log'].log(
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_列表页抓取完成'
                )
              )
              this.getIdListFinished()
            } else {
              // 继续抓取
              this.getIdList()
            }
          }
          resetGetIdListStatus() {
            this.listPageFinished = 0
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitBookmarkPage.ts':
      /*!********************************************!*\
  !*** ./src/ts/modules/InitBookmarkPage.ts ***!
  \********************************************/
      /*! exports provided: InitBookmarkPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitBookmarkPage',
          function() {
            return InitBookmarkPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _BookmarksAddTag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./BookmarksAddTag */ './src/ts/modules/BookmarksAddTag.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
          /*! ./PageInfo */ './src/ts/modules/PageInfo.ts'
        )
        // 初始化收藏页面

        class InitBookmarkPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.idList = [] // 储存从列表页获取到的 id
            this.tag = '' // 储存当前页面带的 tag，不过有时并没有
            this.isHide = false // 当前页面是否显示的是非公开收藏
            this.requsetNumber = 0 // 根据页数，计算要抓取的作品个数
            this.onceRequest = 100 // 每次请求多少个数量
            this.offset = 0 // 要去掉的作品数量
            this.crawlRecommended = false // 是否抓取推荐作品（收藏页面下方）
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_4__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_2__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_开始抓取'),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                      '_开始抓取'
                    ) +
                      _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                        '_默认下载多页'
                      )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.readyCrawl()
              })
            // 添加下载推荐作品的按钮，只在旧版收藏页面使用
            const isOldPage = !!document.querySelector('.user-name')
            if (isOldPage) {
              const downRecmdBtn = _CenterButtons__WEBPACK_IMPORTED_MODULE_4__[
                'centerButtons'
              ].add(
                _Colors__WEBPACK_IMPORTED_MODULE_2__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_抓取推荐作品'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                      '_抓取推荐作品Title'
                    )
                  ]
                ]
              )
              downRecmdBtn.addEventListener(
                'click',
                () => {
                  this.crawlRecommended = true
                  this.readyCrawl()
                },
                false
              )
            }
            // 如果存在 token，则添加“添加 tag”按钮
            if (_API__WEBPACK_IMPORTED_MODULE_1__['API'].getToken()) {
              const btn = _CenterButtons__WEBPACK_IMPORTED_MODULE_4__[
                'centerButtons'
              ].add(
                _Colors__WEBPACK_IMPORTED_MODULE_2__['Colors'].green,
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_添加tag'),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                      '_添加tag'
                    )
                  ]
                ]
              )
              new _BookmarksAddTag__WEBPACK_IMPORTED_MODULE_6__[
                'BookmarksAddTag'
              ](btn)
            }
          }
          setFormOption() {
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_5__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_页数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_checkWantPageRule1Arg8'
              ),
              rangTip: _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_数字提示1'
              ),
              value: '-1'
            })
            // 在书签页面隐藏只要书签选项
            _Options__WEBPACK_IMPORTED_MODULE_5__['options'].hideOption([
              6,
              15,
              18
            ])
            if (location.href.includes('bookmark.php')) {
              _Options__WEBPACK_IMPORTED_MODULE_5__['options'].hideOption([6])
            }
          }
          destroy() {}
          getWantPage() {
            let pageTip = ''
            if (this.crawlRecommended) {
              pageTip = _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_checkWantPageRule1Arg11'
              )
            } else {
              pageTip = _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_checkWantPageRule1Arg7'
              )
            }
            this.crawlNumber = this.checkWantPageInput(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_checkWantPageRule1Arg6'
              ),
              pageTip
            )
          }
          nextStep() {
            if (this.crawlRecommended) {
              // 下载推荐图片
              this.getRecommendedList()
            } else {
              this.readyGetIdList()
            }
          }
          readyGetIdList() {
            // 每页个数
            // 旧版每页 20 个作品，新版每页 48 个作品（因为新版不显示无法访问的作品，所以有时候一页不足 48 个）
            const isOldPage = !!document.querySelector('.user-name')
            const onceNumber = isOldPage ? 20 : 48
            // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
            const nowPage = _API__WEBPACK_IMPORTED_MODULE_1__[
              'API'
            ].getURLField(location.href, 'p') // 判断当前处于第几页，页码从 1 开始。也可能没有页码
            if (nowPage) {
              this.offset = (parseInt(nowPage) - 1) * onceNumber
            }
            if (this.offset < 0) {
              this.offset = 0
            }
            // 根据页数设置，计算要下载的个数
            this.requsetNumber = 0
            if (this.crawlNumber === -1) {
              this.requsetNumber = 9999999
            } else {
              this.requsetNumber = onceNumber * this.crawlNumber
            }
            this.tag =
              _PageInfo__WEBPACK_IMPORTED_MODULE_10__['pageInfo'].getPageTag
            // 判断是公开收藏还是非公开收藏
            // 在新旧版 url 里，rest 都是在查询字符串里的
            this.isHide =
              _API__WEBPACK_IMPORTED_MODULE_1__['API'].getURLField(
                location.href,
                'rest'
              ) === 'hide'
            // 获取 id 列表
            this.getIdList()
            _Log__WEBPACK_IMPORTED_MODULE_8__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_正在抓取')
            )
            if (this.crawlNumber === -1) {
              _Log__WEBPACK_IMPORTED_MODULE_8__['log'].log(
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_获取全部书签作品'
                )
              )
            }
          }
          // 获取用户的收藏作品列表
          async getIdList() {
            let data
            try {
              data = await _API__WEBPACK_IMPORTED_MODULE_1__[
                'API'
              ].getBookmarkData(
                _DOM__WEBPACK_IMPORTED_MODULE_9__['DOM'].getUserId(),
                this.tag,
                this.offset,
                this.isHide
              )
            } catch (error) {
              this.getIdList()
              return
            }
            if (
              data.body.works.length === 0 ||
              this.idList.length >= this.requsetNumber
            ) {
              // 书签页获取完毕
              return this.afterGetIdList()
            } else {
              // 没有抓取完毕时，添加数据
              data.body.works.forEach(data => this.idList.push(data.id))
              this.offset += this.onceRequest // 每次增加偏移量
              // 重复抓取过程
              this.getIdList()
            }
          }
          // 获取作品 id 列表完毕之后
          afterGetIdList() {
            // 因为书签页面一次获取 100 个作品，大于一页的数量。所以可能会抓取多了，需要删除多余的作品
            if (this.idList.length > this.requsetNumber) {
              // 删除后面部分（较早收藏的），留下近期收藏的
              this.idList.splice(this.requsetNumber, this.idList.length)
              // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由近期到早期排列的
            }
            _Store__WEBPACK_IMPORTED_MODULE_7__[
              'store'
            ].idList = _Store__WEBPACK_IMPORTED_MODULE_7__[
              'store'
            ].idList.concat(this.idList)
            this.getIdListFinished()
          }
          // 获取书签页面下方的推荐作品列表
          getRecommendedList() {
            // 获取下方已经加载出来的作品
            const elements = document.querySelectorAll(
              '#illust-recommend .image-item'
            )
            if (elements.length === 0) {
              this.crawlRecommended = false
              return this.noResult()
            }
            // 添加作品列表
            for (const li of elements) {
              const a = li.querySelector('a')
              _Store__WEBPACK_IMPORTED_MODULE_7__['store'].idList.push(
                _API__WEBPACK_IMPORTED_MODULE_1__['API'].getIllustId(a.href)
              )
            }
            this.getIdListFinished()
          }
          resetGetIdListStatus() {
            this.idList = []
            this.offset = 0
            this.tag = ''
            this.listPageFinished = 0
            this.crawlRecommended = false // 解除下载推荐作品的标记
          }
          sortResult() {
            // 把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
            _Store__WEBPACK_IMPORTED_MODULE_7__['store'].result.reverse()
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitDiscoverPage.ts':
      /*!********************************************!*\
  !*** ./src/ts/modules/InitDiscoverPage.ts ***!
  \********************************************/
      /*! exports provided: InitDiscoverPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitDiscoverPage',
          function() {
            return InitDiscoverPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _DeleteWorks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./DeleteWorks */ './src/ts/modules/DeleteWorks.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        // 初始化发现页面

        class InitDiscoverPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_3__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_抓取当前作品'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_抓取当前作品Title'
                    )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.readyCrawl()
              })
          }
          setFormOption() {
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].hideOption([
              1,
              15,
              18
            ])
          }
          appendElseEl() {
            const deleteWorks = new _DeleteWorks__WEBPACK_IMPORTED_MODULE_5__[
              'DeleteWorks'
            ]('._2RNjBox')
            deleteWorks.addClearMultipleBtn('._3b8AXEx')
            deleteWorks.addClearUgoiraBtn('.AGgsUWZ')
            deleteWorks.addManuallyDeleteBtn()
          }
          destroy() {}
          getWantPage() {}
          getIdList() {
            // 在发现页面，仅下载已有部分，所以不需要去获取列表页
            const nowIllust = document.querySelectorAll('figure>div>a')
            // 获取已有作品的 id
            Array.from(nowIllust).forEach(el => {
              // discovery 列表的 url 是有额外后缀的，需要去掉
              const id = _API__WEBPACK_IMPORTED_MODULE_6__['API'].getIllustId(
                el.href.split('&uarea')[0]
              )
              _Store__WEBPACK_IMPORTED_MODULE_7__['store'].idList.push(id)
            })
            this.getIdListFinished()
          }
          resetGetIdListStatus() {}
        }

        /***/
      },

    /***/ './src/ts/modules/InitIndexPage.ts':
      /*!*****************************************!*\
  !*** ./src/ts/modules/InitIndexPage.ts ***!
  \*****************************************/
      /*! exports provided: InitIndexPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitIndexPage',
          function() {
            return InitIndexPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterPanel */ './src/ts/modules/CenterPanel.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        // 初始化首页

        class InitIndexPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.ready = false
            this.downIdButton = document.createElement('button')
            this.downIdInput = document.createElement('textarea')
            this.init()
          }
          appendCenterBtns() {
            this.downIdButton = _CenterButtons__WEBPACK_IMPORTED_MODULE_4__[
              'centerButtons'
            ].add(
              _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_输入id进行抓取'
              ),
              [['id', 'down_id_button']]
            )
          }
          appendElseEl() {
            // 用于输入id的输入框
            this.downIdInput.id = 'down_id_input'
            this.downIdInput.style.display = 'none'
            this.downIdInput.setAttribute(
              'placeholder',
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_输入id进行抓取的提示文字'
              )
            )
            _DOM__WEBPACK_IMPORTED_MODULE_6__['DOM'].insertToHead(
              this.downIdInput
            )
          }
          setFormOption() {
            _Options__WEBPACK_IMPORTED_MODULE_5__['options'].hideOption([
              1,
              15,
              18
            ])
          }
          initElse() {
            this.downIdButton.addEventListener(
              'click',
              () => {
                if (!this.ready) {
                  // 还没准备好
                  _CenterPanel__WEBPACK_IMPORTED_MODULE_3__[
                    'centerPanel'
                  ].close()
                  this.downIdInput.style.display = 'block'
                  this.downIdInput.focus()
                  document.documentElement.scrollTop = 0
                } else {
                  this.readyCrawl()
                }
              },
              false
            )
            // 当输入框内容改变时检测，非空值时显示下载区域
            this.downIdInput.addEventListener('change', () => {
              if (this.downIdInput.value !== '') {
                this.ready = true
                _CenterPanel__WEBPACK_IMPORTED_MODULE_3__['centerPanel'].show()
                this.downIdButton.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__[
                  'lang'
                ].transl('_开始抓取')
              } else {
                this.ready = false
                _CenterPanel__WEBPACK_IMPORTED_MODULE_3__['centerPanel'].close()
                this.downIdButton.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__[
                  'lang'
                ].transl('_输入id进行抓取')
              }
            })
          }
          nextStep() {
            // 在主页通过id抓取时，不需要获取列表页，直接完成
            _Log__WEBPACK_IMPORTED_MODULE_8__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_开始获取作品页面'
              )
            )
            this.getIdList()
          }
          getWantPage() {}
          getIdList() {
            // 检查 id
            const tempSet = new Set(this.downIdInput.value.split('\n'))
            const idValue = Array.from(tempSet)
            for (const id of idValue) {
              // 如果有 id 不是数字，或者处于非法区间，中止任务
              const nowId = parseInt(id)
              if (isNaN(nowId) || nowId < 22 || nowId > 99999999) {
                _Log__WEBPACK_IMPORTED_MODULE_8__['log'].error(
                  _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                    '_id不合法'
                  ),
                  0,
                  false
                )
              } else {
                _Store__WEBPACK_IMPORTED_MODULE_7__['store'].idList.push(
                  nowId.toString()
                )
              }
            }
            this.getIdListFinished()
          }
          resetGetIdListStatus() {}
          destroy() {
            _DOM__WEBPACK_IMPORTED_MODULE_6__['DOM'].removeEl(this.downIdInput)
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitNewIllustPage.ts':
      /*!*********************************************!*\
  !*** ./src/ts/modules/InitNewIllustPage.ts ***!
  \*********************************************/
      /*! exports provided: InitNewIllustPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitNewIllustPage',
          function() {
            return InitNewIllustPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Filter */ './src/ts/modules/Filter.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        // 初始化 大家的新作品页面

        class InitNewIllustPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.timer = 0
            this.option = this.resetOption()
            this.limitMax = 20 // 每次请求的数量最大是 20
            this.fetchCount = 0 // 已请求的作品数量
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_3__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_开始抓取'),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_下载大家的新作品'
                    )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.readyCrawl()
              })
          }
          appendElseEl() {
            // 添加 R-18 页面的链接
            const r18Link = `<a href="/new_illust_r18.php" style="color:#179fdd;padding-left:20px;">R-18</a>`
            const target = document.querySelector('#root h1')
            if (target) {
              target.insertAdjacentHTML('beforeend', r18Link)
              clearTimeout(this.timer)
            } else {
              this.timer = window.setTimeout(() => {
                this.appendElseEl()
              }, 300)
            }
          }
          setFormOption() {
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_个数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_要获取的作品个数2'
              ),
              rangTip: `1 - ${this.maxCount}`,
              value: '100'
            })
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].hideOption([
              15,
              18
            ])
          }
          destroy() {}
          getWantPage() {
            const check = this.checkWantPageInputGreater0()
            if (check == undefined) {
              return
            }
            this.crawlNumber = check
            if (this.crawlNumber > this.maxCount) {
              this.crawlNumber = this.maxCount
            }
            _Log__WEBPACK_IMPORTED_MODULE_8__['log'].warning(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_抓取多少个作品',
                this.crawlNumber.toString()
              )
            )
          }
          nextStep() {
            this.initFetchURL()
            this.getIdList()
          }
          resetOption() {
            return {
              lastId: '0',
              limit: '20',
              type: '',
              r18: ''
            }
          }
          // 组织要请求的 url
          initFetchURL() {
            this.option = this.resetOption()
            if (this.crawlNumber < this.limitMax) {
              this.option.limit = this.crawlNumber.toString()
            } else {
              this.option.limit = this.limitMax.toString()
            }
            this.fetchCount = 0
            // 当前页面的作品类型，默认是 illust
            this.option.type =
              _API__WEBPACK_IMPORTED_MODULE_6__['API'].getURLField(
                location.href,
                'type'
              ) || 'illust'
            // 是否是 R18 模式
            this.option.r18 = (
              location.href.includes('_r18.php') || false
            ).toString()
          }
          async getIdList() {
            let data
            try {
              data = await _API__WEBPACK_IMPORTED_MODULE_6__[
                'API'
              ].getNewIllustData(this.option)
            } catch (error) {
              this.getIdList()
              return
            }
            let useData = data.body.illusts
            for (const nowData of useData) {
              // 抓取够了指定的数量
              if (this.fetchCount + 1 > this.crawlNumber) {
                break
              } else {
                this.fetchCount++
              }
              // 排除广告信息
              if (nowData.isAdContainer) {
                continue
              }
              const filterOpt = {
                id: nowData.illustId,
                width: nowData.width,
                height: nowData.height,
                pageCount: nowData.pageCount,
                bookmarkData: nowData.bookmarkData,
                illustType: nowData.illustType,
                tags: nowData.tags
              }
              if (
                _Filter__WEBPACK_IMPORTED_MODULE_5__['filter'].check(filterOpt)
              ) {
                _Store__WEBPACK_IMPORTED_MODULE_7__['store'].idList.push(
                  nowData.illustId
                )
              }
            }
            _Log__WEBPACK_IMPORTED_MODULE_8__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_新作品进度',
                this.fetchCount.toString()
              ),
              1,
              false
            )
            // 抓取完毕
            if (
              this.fetchCount >= this.crawlNumber ||
              this.fetchCount >= this.maxCount
            ) {
              _Log__WEBPACK_IMPORTED_MODULE_8__['log'].log(
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_开始获取作品页面'
                )
              )
              this.getIdListFinished()
              return
            }
            // 继续抓取
            this.option.lastId = data.body.lastId
            this.getIdList()
          }
          resetGetIdListStatus() {}
        }

        /***/
      },

    /***/ './src/ts/modules/InitPage.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/InitPage.ts ***!
  \************************************/
      /*! no exports provided */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./PageType */ './src/ts/modules/PageType.ts'
        )
        /* harmony import */ var _InitIndexPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./InitIndexPage */ './src/ts/modules/InitIndexPage.ts'
        )
        /* harmony import */ var _InitWorksPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./InitWorksPage */ './src/ts/modules/InitWorksPage.ts'
        )
        /* harmony import */ var _InitUserPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./InitUserPage */ './src/ts/modules/InitUserPage.ts'
        )
        /* harmony import */ var _InitBookmarkPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./InitBookmarkPage */ './src/ts/modules/InitBookmarkPage.ts'
        )
        /* harmony import */ var _InitSearchPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./InitSearchPage */ './src/ts/modules/InitSearchPage.ts'
        )
        /* harmony import */ var _InitAreaRankingPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./InitAreaRankingPage */ './src/ts/modules/InitAreaRankingPage.ts'
        )
        /* harmony import */ var _InitRankingPage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./InitRankingPage */ './src/ts/modules/InitRankingPage.ts'
        )
        /* harmony import */ var _InitPixivisionPage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./InitPixivisionPage */ './src/ts/modules/InitPixivisionPage.ts'
        )
        /* harmony import */ var _InitBookmarkDetailPage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
          /*! ./InitBookmarkDetailPage */ './src/ts/modules/InitBookmarkDetailPage.ts'
        )
        /* harmony import */ var _InitBookmarkNewIllustPage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
          /*! ./InitBookmarkNewIllustPage */ './src/ts/modules/InitBookmarkNewIllustPage.ts'
        )
        /* harmony import */ var _InitDiscoverPage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
          /*! ./InitDiscoverPage */ './src/ts/modules/InitDiscoverPage.ts'
        )
        /* harmony import */ var _InitNewIllustPage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
          /*! ./InitNewIllustPage */ './src/ts/modules/InitNewIllustPage.ts'
        )
        // 初始化页面，初始化抓取流程

        class InitPage {
          constructor() {
            this.initPage()
            // 页面类型变化时，初始化抓取流程
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.pageTypeChange,
              () => {
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.destroy
                )
                this.initPage()
              }
            )
          }
          initPage() {
            switch (
              _PageType__WEBPACK_IMPORTED_MODULE_1__['pageType'].getPageType()
            ) {
              case 0:
                return new _InitIndexPage__WEBPACK_IMPORTED_MODULE_2__[
                  'InitIndexPage'
                ]()
              case 1:
                return new _InitWorksPage__WEBPACK_IMPORTED_MODULE_3__[
                  'InitWorksPage'
                ]()
              case 2:
                return new _InitUserPage__WEBPACK_IMPORTED_MODULE_4__[
                  'InitUserPage'
                ]()
              case 4:
                return new _InitBookmarkPage__WEBPACK_IMPORTED_MODULE_5__[
                  'InitBookmarkPage'
                ]()
              case 5:
                return new _InitSearchPage__WEBPACK_IMPORTED_MODULE_6__[
                  'InitSearchPage'
                ]()
              case 6:
                return new _InitAreaRankingPage__WEBPACK_IMPORTED_MODULE_7__[
                  'InitAreaRankingPage'
                ]()
              case 7:
                return new _InitRankingPage__WEBPACK_IMPORTED_MODULE_8__[
                  'InitRankingPage'
                ]()
              case 8:
                return new _InitPixivisionPage__WEBPACK_IMPORTED_MODULE_9__[
                  'InitPixivisionPage'
                ]()
              case 9:
                return new _InitBookmarkDetailPage__WEBPACK_IMPORTED_MODULE_10__[
                  'InitBookmarkDetailPage'
                ]()
              case 10:
                return new _InitBookmarkNewIllustPage__WEBPACK_IMPORTED_MODULE_11__[
                  'InitBookmarkNewIllustPage'
                ]()
              case 11:
                return new _InitDiscoverPage__WEBPACK_IMPORTED_MODULE_12__[
                  'InitDiscoverPage'
                ]()
              case 12:
                return new _InitNewIllustPage__WEBPACK_IMPORTED_MODULE_13__[
                  'InitNewIllustPage'
                ]()
              default:
                throw new Error('InitCrawlProcess error: Illegal pageType.')
            }
          }
        }
        new InitPage()

        /***/
      },

    /***/ './src/ts/modules/InitPageBase.ts':
      /*!****************************************!*\
  !*** ./src/ts/modules/InitPageBase.ts ***!
  \****************************************/
      /*! exports provided: InitPageBase */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitPageBase',
          function() {
            return InitPageBase
          }
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Filter */ './src/ts/modules/Filter.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )
        /* harmony import */ var _TitleBar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
          /*! ./TitleBar */ './src/ts/modules/TitleBar.ts'
        )
        /* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
          /*! ./PageInfo */ './src/ts/modules/PageInfo.ts'
        )
        // 初始化抓取页面的流程

        class InitPageBase {
          constructor() {
            this.crawlNumber = 0 // 要抓取的个数/页数
            this.multipleImageWorks = 0 // 多图作品设置
            this.firstFewImages = 0 // 每个作品下载几张图片。0为不限制，全部下载。改为1则只下载第一张。这是因为有时候多p作品会导致要下载的图片过多，此时可以设置只下载前几张，减少下载量
            this.maxCount = 1000 // 当前页面类型最多有多少个页面/作品
            this.startpageNo = 1 // 列表页开始抓取时的页码，只在 api 需要页码时使用。目前有搜索页、排行榜页、关注的新作品页使用。
            this.listPageFinished = 0 // 记录一共抓取了多少个列表页。使用范围同上。
            this.ajaxThreadsDefault = 10 // 抓取时的并发连接数默认值，也是最大值
            this.ajaxThreads = this.ajaxThreadsDefault // 抓取时的并发连接数
            this.ajaxThreadsFinished = 0 // 统计有几个并发线程完成所有请求。统计的是并发线程（ ajaxThreads ）而非请求数
          }
          // 初始化
          init() {
            _Options__WEBPACK_IMPORTED_MODULE_3__['options'].showAllOption()
            this.setFormOption()
            this.appendCenterBtns()
            this.appendElseEl()
            this.initElse()
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].events.destroy,
              () => {
                this.destroy()
              }
            )
          }
          // 各个子类私有的初始化内容
          initElse() {}
          // 销毁初始化页面时添加的元素和事件，恢复设置项等
          // 各个子类不需要销毁中间按钮，CenterButtons 类会自行销毁
          destroy() {}
          // 添加中间按钮
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_2__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_开始抓取'),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                      '_开始抓取'
                    ) +
                      _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                        '_默认下载多页'
                      )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.readyCrawl()
              })
          }
          // 添加其他元素（如果有）
          appendElseEl() {}
          // 设置表单里的选项。主要是设置页数，隐藏不需要的选项。
          setFormOption() {
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_3__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_页数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                '_checkWantPageRule1Arg8'
              ),
              rangTip: _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                '_数字提示1'
              ),
              value: '1'
            })
            _Options__WEBPACK_IMPORTED_MODULE_3__['options'].hideOption([
              15,
              18
            ])
          }
          // 作品个数/页数的输入不合法
          getWantPageError() {
            _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].events.crawlError
            )
            const msg = _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
              '_参数不合法'
            )
            window.alert(msg)
            throw new Error(msg)
          }
          // 检查用户输入的页数/个数设置，并返回提示信息
          // 可以为 -1，或者大于 0
          checkWantPageInput(crawlPartTip, crawlAllTip) {
            const temp = parseInt(
              _Settings__WEBPACK_IMPORTED_MODULE_9__['form'].setWantPage.value
            )
            // 如果比 1 小，并且不是 -1，则不通过
            if ((temp < 1 && temp !== -1) || isNaN(temp)) {
              // 比 1 小的数里，只允许 -1 , 0 也不行
              this.getWantPageError()
            }
            if (temp >= 1) {
              _Log__WEBPACK_IMPORTED_MODULE_7__['log'].warning(
                crawlPartTip.replace('-num-', temp.toString())
              )
            } else if (temp === -1) {
              _Log__WEBPACK_IMPORTED_MODULE_7__['log'].warning(crawlAllTip)
            }
            return temp
          }
          // 检查用户输入的页数/个数设置
          // 必须大于 0
          checkWantPageInputGreater0() {
            const result = _API__WEBPACK_IMPORTED_MODULE_5__[
              'API'
            ].checkNumberGreater0(
              _Settings__WEBPACK_IMPORTED_MODULE_9__['form'].setWantPage.value
            )
            if (result.result) {
              return result.value
            } else {
              this.getWantPageError()
            }
          }
          // 获取作品张数设置
          getFirstFewImages() {
            const check = _API__WEBPACK_IMPORTED_MODULE_5__[
              'API'
            ].checkNumberGreater0(
              _Settings__WEBPACK_IMPORTED_MODULE_9__['form'].firstFewImages
                .value
            )
            if (check.result) {
              return check.value
            } else {
              _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].events.crawlError
              )
              const msg =
                _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                  '_下载前几张图片'
                ) +
                ' ' +
                _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_必须大于0')
              _Log__WEBPACK_IMPORTED_MODULE_7__['log'].error(msg)
              window.alert(msg)
              throw new Error(msg)
            }
          }
          // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
          getWantPage() {}
          checkNotAllowPage() {
            if (location.href.includes('novel')) {
              _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].events.crawlError
              )
              window.alert('Not support novel page!')
              throw new Error('Not support novel page!')
            }
            // if () {
            //   EVT.fire(EVT.events.crawlError)
            //   window.alert('Not support page!')
            //   throw new Error('Not support page!')
            // }
          }
          // 获取多图作品设置。因为这个不属于过滤器 filter，所以在这里直接获取
          getMultipleSetting() {
            this.multipleImageWorks = parseInt(
              _Settings__WEBPACK_IMPORTED_MODULE_9__['form'].multipleImageWorks
                .value
            )
            if (this.multipleImageWorks === -1) {
              _Log__WEBPACK_IMPORTED_MODULE_7__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                  '_不下载多图作品'
                )
              )
            }
            // 获取作品张数设置
            if (this.multipleImageWorks === 1) {
              this.firstFewImages = this.getFirstFewImages()
              _Log__WEBPACK_IMPORTED_MODULE_7__['log'].warning(
                _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                  '_多图作品下载前n张图片',
                  this.firstFewImages.toString()
                )
              )
            }
          }
          // 准备抓取，进行抓取之前的一些检查工作。必要时可以在子类中改写
          async readyCrawl() {
            // 检查是否可以开始抓取
            this.checkNotAllowPage()
            if (
              !_Store__WEBPACK_IMPORTED_MODULE_6__['store'].states.allowWork
            ) {
              window.alert(
                _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                  '_当前任务尚未完成2'
                )
              )
              return
            }
            _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].events.crawlStart
            )
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].clear()
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].success(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_任务开始0')
            )
            _TitleBar__WEBPACK_IMPORTED_MODULE_10__['titleBar'].change('↑')
            this.getWantPage()
            _Filter__WEBPACK_IMPORTED_MODULE_4__['filter'].init()
            this.getMultipleSetting()
            await _PageInfo__WEBPACK_IMPORTED_MODULE_11__['pageInfo'].store()
            // 进入第一个抓取方法
            this.nextStep()
          }
          // 当可以开始抓取时，进入下一个流程。默认情况下，开始获取作品列表。如有不同，由子类具体定义
          nextStep() {
            this.getIdList()
          }
          // 作品列表获取完毕，开始抓取作品内容页
          getIdListFinished() {
            // 列表页获取完毕后，可以在这里重置一些变量
            this.resetGetIdListStatus()
            if (
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.length === 0
            ) {
              return this.noResult()
            }
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                '_当前作品个数',
                _Store__WEBPACK_IMPORTED_MODULE_6__[
                  'store'
                ].idList.length.toString()
              )
            )
            if (
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.length <=
              this.ajaxThreadsDefault
            ) {
              this.ajaxThreads =
                _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.length
            } else {
              this.ajaxThreads = this.ajaxThreadsDefault
            }
            for (let i = 0; i < this.ajaxThreads; i++) {
              this.getWorksData()
            }
          }
          getPNo(pageCount) {
            let pNo = pageCount
            if (this.multipleImageWorks === 1 && this.firstFewImages <= pNo) {
              pNo = this.firstFewImages
            }
            return pNo
          }
          // 获取作品的数据
          // 在重试时会传入要重试的 id
          async getWorksData(id) {
            id =
              id || _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.shift()
            let data
            try {
              // 发起请求
              data = await _API__WEBPACK_IMPORTED_MODULE_5__[
                'API'
              ].getWorksData(id)
            } catch (error) {
              //  请求成功，但 response.ok 错误。不重试请求，跳过该作品继续抓取
              if (error.status) {
                this.logErrorStatus(error.status, id)
                this.afterGetWorksData()
              } else {
                // 请求失败，会重试这个请求
                setTimeout(() => {
                  this.getWorksData(id)
                }, 2000)
              }
              return
            }
            // 获取需要检查的信息
            const body = data.body
            const fullWidth = body.width // 原图宽度
            const fullHeight = body.height // 原图高度
            const bmk = body.bookmarkCount // 收藏数
            const tagArr = body.tags.tags // 取出 tag 信息
            const tags = [] // 保存 tag 列表
            const tagTranslation = [] // 保存 tag 列表，附带翻译后的 tag
            for (const tagData of tagArr) {
              tags.push(tagData.tag)
              tagTranslation.push(tagData.tag)
              if (tagData.translation && tagData.translation.en) {
                tagTranslation.push(tagData.translation.en)
              }
            }
            const filterOpt = {
              createDate: body.createDate,
              id: body.illustId,
              illustType: body.illustType,
              tags: tags,
              pageCount: body.pageCount,
              bookmarkCount: bmk,
              bookmarkData: body.bookmarkData,
              width: fullWidth,
              height: fullHeight
            }
            // 检查通过
            if (
              _Filter__WEBPACK_IMPORTED_MODULE_4__['filter'].check(filterOpt)
            ) {
              const illustId = body.illustId
              const idNum = parseInt(body.illustId)
              const title = body.illustTitle // 作品标题
              const userid = body.userId // 用户id
              const user = body.userName // 用户名
              const thumb = body.urls.thumb
              const pageCount = body.pageCount
              const bookmarked = !!body.bookmarkData
              // 时间原数据如 "2019-12-18T22:23:37+00:00"
              // 网页上显示的日期是转换成了本地时间的，如北京时区显示为 "2019-12-19"，不是显示原始日期 "2019-12-18"。所以这里转换成本地时区的日期，和网页上保持一致，以免用户困惑。
              const date0 = new Date(body.createDate)
              const y = date0.getFullYear()
              const m = (date0.getMonth() + 1).toString().padStart(2, '0')
              const d = date0
                .getDate()
                .toString()
                .padStart(2, '0')
              const date = `${y}-${m}-${d}`
              let rank = '' // 保存作品在排行榜上的编号
              let testRank = _Store__WEBPACK_IMPORTED_MODULE_6__[
                'store'
              ].getRankList(body.illustId)
              if (testRank !== undefined) {
                rank = '#' + testRank
              }
              // 储存作品信息
              if (body.illustType !== 2) {
                // 插画或漫画
                // 下载该作品的前面几张
                const pNo = this.getPNo(body.pageCount)
                const imgUrl = body.urls.original // 作品的原图 URL
                const tempExt = imgUrl.split('.')
                const ext = tempExt[tempExt.length - 1]
                // 添加作品信息
                _Store__WEBPACK_IMPORTED_MODULE_6__['store'].addResult(
                  {
                    id: illustId,
                    idNum: idNum,
                    thumb: thumb,
                    pageCount: pageCount,
                    url: imgUrl,
                    title: title,
                    tags: tags,
                    tagsTranslated: tagTranslation,
                    user: user,
                    userid: userid,
                    fullWidth: fullWidth,
                    fullHeight: fullHeight,
                    ext: ext,
                    bmk: bmk,
                    bookmarked: bookmarked,
                    date: date,
                    type: body.illustType,
                    rank: rank
                  },
                  pNo
                )
                this.logImagesNo()
              } else if (body.illustType === 2) {
                // 动图
                // 获取动图的信息
                const meta = await _API__WEBPACK_IMPORTED_MODULE_5__[
                  'API'
                ].getUgoiraMeta(illustId)
                // 动图帧延迟数据
                const ugoiraInfo = {
                  frames: meta.body.frames,
                  mime_type: meta.body.mime_type
                }
                const ext =
                  _Settings__WEBPACK_IMPORTED_MODULE_9__['form'].ugoiraSaveAs
                    .value // 扩展名可能是 webm、gif、zip
                _Store__WEBPACK_IMPORTED_MODULE_6__['store'].addResult({
                  id: illustId,
                  idNum: idNum,
                  thumb: thumb,
                  pageCount: pageCount,
                  url: meta.body.originalSrc,
                  title: title,
                  tags: tags,
                  tagsTranslated: tagTranslation,
                  user: user,
                  userid: userid,
                  fullWidth: fullWidth,
                  fullHeight: fullHeight,
                  ext: ext,
                  bmk: bmk,
                  bookmarked: bookmarked,
                  date: date,
                  type: body.illustType,
                  rank: rank,
                  ugoiraInfo: ugoiraInfo
                })
                this.logImagesNo()
              }
            }
            this.afterGetWorksData()
          }
          // 每当获取完一个作品的信息
          afterGetWorksData() {
            if (
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.length > 0
            ) {
              // 如果存在下一个作品，则
              this.getWorksData()
            } else {
              // 没有剩余作品
              this.ajaxThreadsFinished++
              if (this.ajaxThreadsFinished === this.ajaxThreads) {
                // 如果所有并发请求都执行完毕，复位
                this.ajaxThreadsFinished = 0
                this.crawlFinished()
              }
            }
          }
          // 抓取完毕
          crawlFinished() {
            if (
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].result.length === 0
            ) {
              return this.noResult()
            }
            this.sortResult()
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                '_抓取图片网址的数量',
                _Store__WEBPACK_IMPORTED_MODULE_6__[
                  'store'
                ].result.length.toString()
              )
            )
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_抓取完毕'),
              2
            )
            _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].events.crawlFinish
            )
          }
          // 网络请求状态异常时输出提示
          logErrorStatus(status, id) {
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].error(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                '_无权访问2',
                id
              ),
              1
            )
            switch (status) {
              case 0:
                console.log(
                  _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                    '_作品页状态码0'
                  )
                )
                break
              case 400:
                console.log(
                  _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                    '_作品页状态码400'
                  )
                )
                break
              case 403:
                console.log(
                  _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                    '_作品页状态码403'
                  )
                )
                break
              case 404:
                console.log(
                  _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                    '_作品页状态码404'
                  ) +
                    ' ' +
                    id
                )
                break
              default:
                break
            }
          }
          // 在抓取图片网址时，输出提示
          logImagesNo() {
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                '_抓取图片网址的数量',
                _Store__WEBPACK_IMPORTED_MODULE_6__[
                  'store'
                ].result.length.toString()
              ),
              1,
              false
            )
          }
          // 抓取结果为 0 时输出提示
          noResult() {
            _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_8__['EVT'].events.crawlEmpty
            )
            _TitleBar__WEBPACK_IMPORTED_MODULE_10__['titleBar'].reset()
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].error(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
                '_抓取结果为零'
              ),
              2
            )
            window.alert(
              _Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_抓取结果为零')
            )
          }
          // 抓取完成后，对结果进行排序
          sortResult() {}
        }

        /***/
      },

    /***/ './src/ts/modules/InitPixivisionPage.ts':
      /*!**********************************************!*\
  !*** ./src/ts/modules/InitPixivisionPage.ts ***!
  \**********************************************/
      /*! exports provided: InitPixivisionPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitPixivisionPage',
          function() {
            return InitPixivisionPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        // 初始化 pixivision 页面

        class InitPixivisionPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.tested = 0 // 检查图片后缀名时的计数
            this.init()
          }
          appendCenterBtns() {
            const typeA = document.querySelector(
              'a[data-gtm-action=ClickCategory]'
            )
            const type = typeA.dataset.gtmLabel
            if (
              type === 'illustration' ||
              type === 'manga' ||
              type === 'cosplay'
            ) {
              // 在插画、漫画、cosplay类型的页面上创建下载功能
              _CenterButtons__WEBPACK_IMPORTED_MODULE_3__['centerButtons']
                .add(
                  _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                  _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                    '_抓取该页面的图片'
                  )
                )
                .addEventListener(
                  'click',
                  () => {
                    this.readyCrawl()
                  },
                  false
                )
            }
          }
          setFormOption() {
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].hideOption([
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              14,
              15,
              16,
              18
            ])
            // pixivision 里，文件名只有 id 标记会生效，所以把文件名部分替换成 id
            _Settings__WEBPACK_IMPORTED_MODULE_5__['form'].userSetName.value =
              '{p_title}/{id}'
          }
          destroy() {}
          nextStep() {
            this.getPixivision()
          }
          getIdList() {}
          resetGetIdListStatus() {}
          // 保存要下载的图片的信息
          addResult(id, url, ext) {
            _Store__WEBPACK_IMPORTED_MODULE_6__['store'].addResult({
              id: id,
              url: url,
              ext: ext
            })
          }
          getPixivision() {
            const a = document.querySelector('a[data-gtm-action=ClickCategory]')
            const type = a.dataset.gtmLabel
            if (type === 'illustration') {
              // 插画页面，需要对图片进行测试获取原图 url
              const imageList = document.querySelectorAll('.am__work__main img')
              const urls = Array.from(imageList).map(el => {
                return el.src
                  .replace('c/768x1200_80/img-master', 'img-original')
                  .replace('_master1200', '')
              })
              this.tested = 0
              urls.forEach(url => {
                let arr = url.split('/')
                const id = arr[arr.length - 1].split('.')[0] // 取出作品 id
                this.testExtName(url, urls.length, id)
              })
            } else {
              // 漫画和 cosplay ，直接保存页面上的图片
              let selector = ''
              if (type === 'manga') {
                selector = '.am__work__illust'
              } else if (type === 'cosplay') {
                selector = '.fab__image-block__image img'
              }
              // 把图片url添加进数组
              const imageList = document.querySelectorAll(selector)
              Array.from(imageList).forEach(el => {
                const url = el.src
                if (
                  url !==
                  'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg'
                ) {
                  // 跳过Cure的logo图片
                  const arr = url.split('/')
                  const id = arr[arr.length - 1].split('.')[0] // 作品id
                  const ext = arr[arr.length - 1] // 扩展名
                  this.addResult(id, url, ext)
                }
              })
              this.crawlFinished()
            }
          }
          // 测试图片 url 是否正确的函数。pixivision 页面直接获取的图片 url，后缀都是jpg的，所以要测试实际上是jpg还是png
          testExtName(url, imgNumber, id) {
            let ext = ''
            const testImg = new Image()
            testImg.src = url
            testImg.onload = () => next(true)
            testImg.onerror = () => next(false)
            let next = bool => {
              if (bool) {
                ext = 'jpg'
              } else {
                url = url.replace('.jpg', '.png')
                ext = 'png'
              }
              this.addResult(id, url, ext)
              this.logImagesNo()
              if (imgNumber !== undefined) {
                this.tested++
                if (this.tested === imgNumber) {
                  // 如果所有请求都执行完毕
                  this.crawlFinished()
                }
              }
            }
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitRankingPage.ts':
      /*!*******************************************!*\
  !*** ./src/ts/modules/InitRankingPage.ts ***!
  \*******************************************/
      /*! exports provided: InitRankingPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitRankingPage',
          function() {
            return InitRankingPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )
        /* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Filter */ './src/ts/modules/Filter.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        // 初始化排行榜页面

        class InitRankingPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.pageCount = 10 // 排行榜的页数
            this.option = this.resetOption()
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_4__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_抓取本排行榜作品'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                      '_抓取本排行榜作品Title'
                    )
                  ]
                ]
              )
              .addEventListener('click', () => {
                _Settings__WEBPACK_IMPORTED_MODULE_6__['form'].debut.value = '0'
                this.readyCrawl()
              })
            // 判断当前页面是否有“首次登场”标记
            let debutModes = ['daily', 'daily_r18', 'rookie', '']
            let mode = _API__WEBPACK_IMPORTED_MODULE_2__['API'].getURLField(
              location.href,
              'mode'
            )
            if (debutModes.includes(mode)) {
              _CenterButtons__WEBPACK_IMPORTED_MODULE_4__['centerButtons']
                .add(
                  _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                    '_抓取首次登场的作品'
                  ),
                  [
                    [
                      'title',
                      _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                        '_抓取首次登场的作品Title'
                      )
                    ]
                  ]
                )
                .addEventListener('click', () => {
                  _Settings__WEBPACK_IMPORTED_MODULE_6__['form'].debut.value =
                    '1'
                  this.readyCrawl()
                })
            }
          }
          setFormOption() {
            // 设置“个数/页数”选项
            this.maxCount = 500
            _Options__WEBPACK_IMPORTED_MODULE_5__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_个数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_要获取的作品个数2'
              ),
              rangTip: `1 - ${this.maxCount}`,
              value: this.maxCount.toString()
            })
            _Options__WEBPACK_IMPORTED_MODULE_5__['options'].hideOption([
              15,
              18
            ])
          }
          destroy() {}
          resetOption() {
            return { mode: 'daily', p: 1, worksType: '', date: '' }
          }
          setPartNum() {
            // 设置页数。排行榜页面一页有50张作品，当页面到达底部时会加载下一页
            if (location.pathname.includes('r18g')) {
              // r18g 只有1个榜单，固定1页
              this.pageCount = 1
            } else if (location.pathname.includes('_r18')) {
              // r18 模式，这里的6是最大值，有的排行榜并没有6页
              this.pageCount = 6
            } else {
              // 普通模式，这里的10也是最大值。如果实际没有10页，则在检测到404页面的时候停止抓取下一页
              this.pageCount = 10
            }
          }
          getWantPage() {
            this.listPageFinished = 0
            // 检查下载页数的设置
            this.crawlNumber = this.checkWantPageInput(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_checkWantPageRule1Arg12'
              ),
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_checkWantPageRule1Arg4'
              )
            )
            // 如果设置的作品个数是 -1，则设置为下载所有作品
            if (this.crawlNumber === -1) {
              this.crawlNumber = 500
            }
          }
          nextStep() {
            // 设置 option 信息
            // mode 一定要有值，其他选项不需要
            this.option = this.resetOption()
            this.option.mode =
              _API__WEBPACK_IMPORTED_MODULE_2__['API'].getURLField(
                location.href,
                'mode'
              ) || 'daily'
            this.option.worksType = _API__WEBPACK_IMPORTED_MODULE_2__[
              'API'
            ].getURLField(location.href, 'content')
            this.option.date = _API__WEBPACK_IMPORTED_MODULE_2__[
              'API'
            ].getURLField(location.href, 'date')
            this.startpageNo = 1
            this.setPartNum()
            this.getIdList()
          }
          async getIdList() {
            this.option.p = this.startpageNo + this.listPageFinished
            // 发起请求，获取作品列表
            let data
            try {
              data = await _API__WEBPACK_IMPORTED_MODULE_2__[
                'API'
              ].getRankingData(this.option)
            } catch (error) {
              if (error.status === 404) {
                // 如果发生了404错误，则中断抓取，直接下载已有部分。因为可能确实没有下一部分了
                console.log('404错误，直接下载已有部分')
                this.getIdListFinished()
              }
              return
            }
            this.listPageFinished++
            const contents = data.contents // 取出作品信息列表
            for (const data of contents) {
              // 检查是否已经抓取到了指定数量的作品
              if (data.rank > this.crawlNumber) {
                return this.getIdListFinished()
              }
              // 目前，数据里并没有包含收藏数量，所以在这里没办法检查收藏数量要求
              const filterOpt = {
                id: data.illust_id,
                illustType: parseInt(data.illust_type),
                tags: data.tags,
                pageCount: parseInt(data.illust_page_count),
                bookmarkData: data.is_bookmarked,
                width: data.width,
                height: data.height,
                yes_rank: data.yes_rank
              }
              if (
                _Filter__WEBPACK_IMPORTED_MODULE_7__['filter'].check(filterOpt)
              ) {
                _Store__WEBPACK_IMPORTED_MODULE_8__['store'].setRankList(
                  data.illust_id.toString(),
                  data.rank.toString()
                )
                _Store__WEBPACK_IMPORTED_MODULE_8__['store'].idList.push(
                  data.illust_id.toString()
                )
              }
            }
            _Log__WEBPACK_IMPORTED_MODULE_9__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_排行榜进度',
                this.listPageFinished.toString()
              ),
              1,
              false
            )
            // 抓取完毕
            if (this.listPageFinished === this.pageCount) {
              this.getIdListFinished()
            } else {
              // 继续抓取
              this.getIdList()
            }
          }
          resetGetIdListStatus() {
            this.listPageFinished = 0
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitSearchPage.ts':
      /*!******************************************!*\
  !*** ./src/ts/modules/InitSearchPage.ts ***!
  \******************************************/
      /*! exports provided: InitSearchPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitSearchPage',
          function() {
            return InitSearchPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./PageInfo */ './src/ts/modules/PageInfo.ts'
        )
        /* harmony import */ var _DeleteWorks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./DeleteWorks */ './src/ts/modules/DeleteWorks.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./Filter */ './src/ts/modules/Filter.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
          /*! ./CenterPanel */ './src/ts/modules/CenterPanel.ts'
        )
        /* harmony import */ var _TitleBar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
          /*! ./TitleBar */ './src/ts/modules/TitleBar.ts'
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )
        /* harmony import */ var _FastScreen__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
          /*! ./FastScreen */ './src/ts/modules/FastScreen.ts'
        )
        // 初始化搜索页

        class InitSearchPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.worksType = ''
            this.option = {}
            this.worksNoPerPage = 60 // 每个页面有多少个作品
            this.needCrawlPageCount = 0 // 一共有有多少个列表页面
            this.sendCrawlTaskCount = 0 // 已经抓取了多少个列表页面
            this.allOption = [
              'order',
              'type',
              'wlt',
              'hlt',
              'ratio',
              'tool',
              's_mode',
              'mode',
              'scd',
              'ecd',
              'blt',
              'bgt'
            ]
            this.resultMeta = [] // 每次“开始筛选”完成后，储存当时所有结果，以备“在结果中筛选”使用
            this.worksWrap = null
            this.deleteId = 0 // 手动删除时，要删除的作品的 id
            this.crawlWorks = false // 是否在抓取作品数据（“开始筛选”时改为 true）
            this.crawled = false // 是否已经进行过抓取
            this.previewResult = true // 是否预览结果
            this.optionsCauseResultChange = [
              'multipleImageWorks',
              'firstFewImages'
            ] // 这些选项变更时，需要重新添加结果。例如多图作品“只下载前几张” firstFewImages 会影响生成的结果，但是过滤器 filter 不会检查，所以需要单独检测它的变更
            this.needReAdd = false // 是否需要重新添加结果（并且会重新渲染）
            this.showCount = () => {
              const count = this.resultMeta.length.toString()
              _Log__WEBPACK_IMPORTED_MODULE_11__['log'].success(
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_调整完毕',
                  count
                )
              )
              const countEl = document.querySelector('.bWodjS')
              if (countEl) {
                countEl.textContent = count
              }
            }
            // 在页面显示作品
            this.addWork = event => {
              if (!this.previewResult || !this.worksWrap) {
                return
              }
              const data = event.detail.data
              let multipleHTML = ''
              if (data.pageCount > 1) {
                multipleHTML = `
        <div class="sc-fzXfOZ fjaNWC">
                  <svg viewBox="0 0 9 10" width="9" height="10" class="sc-fzXfOY bAzGJs">
                      <path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10
        C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1
        C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2
        C0,1.44771525 0.44771525,1 1,1 Z"></path>
                    </svg><span class="sc-fzXfOX bAzGJr">${data.pageCount}</span></div>
                    `
              }
              let ugoiraHTML = ''
              if (data.ugoiraInfo) {
                ugoiraHTML = `
        <svg viewBox="0 0 24 24" class="sc-fzXfOy PhQhi sc-fzXfPK bAzGJL" style="width: 48px; height: 48px;">
          <circle cx="12" cy="12" r="10" class="sc-fzXfOz bAzGJZ"></circle>
          <path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834
              C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342
              C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799
              C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243
              C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652
              C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z"></path>
        </svg>`
              }
              let r18HTML = ''
              if (data.tags.includes('R-18') || data.tags.includes('R-18G')) {
                r18HTML = `
      <div class="sc-fzXfPe bAzGKl">
        <div class="sc-fzXfPf bAzGKm">
          <div class="sc-fzXfPb gGhRgx">R-18</div>
        </div>
      </div>`
              }
              const tagString = encodeURI(data.tags.join(' '))
              // 添加收藏的作品，让收藏图标变红
              const bookmarkedClass = 'bookmarked'
              const bookmarkedFlag = data.bookmarked ? bookmarkedClass : ''
              const html = `
    <li class="sc-LzNQd lmXjIY" data-id="${data.idNum}">
    <div class="sc-fzXfQr bUhGlE">
      <div class="sc-fzXfQp euhEKT">
        <div width="184" height="184" class="sc-fzXfPc bnaqNl"><a target="_blank" class="sc-fzXfPH jPCTIp" href="/artworks/${data.idNum}">
            <!--顶部横幅-->
            <div class="sc-fzXfPd bAzGKk">

            <!--R-18 标记-->
            ${r18HTML}

            <!--多图作品标记-->
            ${multipleHTML}
              
            </div>
            <!--图片部分-->
            <div class="sc-fzXfPL fRnGwV"><img
                   src="${data.thumb}"
                   alt="${data.title}" class="sc-fzXfPM iwqMqq"
                   style="object-fit: cover; object-position: center center;">
              <!-- 动图 svg -->
              ${ugoiraHTML}
              </div>
          </a>
          <!--添加显示收藏数-->
          <div class="xz-bmkCount">${data.bmk}</div>
          <!--收藏按钮-->
          <div class="sc-fzXfQq bAzGLe">
            <div class="">
            <button type="button" class="sc-fzXfOw bAzGJW xz-addBMK">
            <svg viewBox="0 0 32 32" width="32" height="32" class="sc-fzXfOs gTsQRf ${bookmarkedFlag}">
                  <path d="
    M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183
    C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5
    C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366
    C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>
                  <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5
    C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328
    C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5
    C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z"
                        class="sc-fzXfOr bAzGJR"></path>
                </svg></button></div>
          </div>
        <!--收藏按钮结束-->
        </div>
      </div>
      <!--标题名-->
      <a target="_blank" class="sc-fzXfQs cyvKvA" href="/artworks/${data.idNum}">${data.title}</a>
      <!--底部-->
      <div class="sc-fzXfQl bAzGKZ">
      <!--作者信息-->
      <div class="sc-fzXfQm bAzGLa">
          <a target="_blank" href="/member.php?id=${data.userid}">
            <div class="sc-fzXfQo fbWLbf">${data.user}</div>
          </a>
        </div>
      </div>
    </div>
  </li>
    `
              // 添加作品
              const li2 = document.createElement('li')
              li2.innerHTML = html
              const li = li2.children[0]
              this.worksWrap.appendChild(li)
              // 绑定收藏按钮的事件
              const addBMKBtn = li.querySelector('.xz-addBMK')
              addBMKBtn.addEventListener('click', function() {
                const e = new CustomEvent('addBMK', {
                  detail: { data: { id: data.idNum, tags: tagString } }
                })
                window.dispatchEvent(e)
                this.classList.add(bookmarkedClass)
              })
            }
            this.addBookmark = event => {
              const data = event.detail.data
              _API__WEBPACK_IMPORTED_MODULE_9__['API'].addBookmark(
                data.id.toString(),
                data.tags,
                _API__WEBPACK_IMPORTED_MODULE_9__['API'].getToken(),
                false
              )
              this.resultMeta.forEach(result => {
                if (result.idNum === data.id) {
                  result.bookmarked = true
                }
              })
              // this.reAddResult()
            }
            // “开始筛选”完成后，保存筛选结果的元数据，并重排结果
            this.onCrawlFinish = () => {
              if (this.crawlWorks) {
                this.crawled = true
                this.resultMeta = [
                  ..._Store__WEBPACK_IMPORTED_MODULE_10__['store'].resultMeta
                ]
                this.reAddResult()
              }
            }
            // 清除多图作品
            this.clearMultiple = () => {
              this.filterResult(data => {
                return data.pageCount <= 1
              })
            }
            // 清除动图作品
            this.clearUgoira = () => {
              this.filterResult(data => {
                return !data.ugoiraInfo
              })
            }
            // 手动删除作品
            this.deleteWork = event => {
              const el = event.detail.data
              this.deleteId = parseInt(el.dataset.id)
              this.filterResult(data => {
                return data.idNum !== this.deleteId
              })
            }
            this.onSettingChange = event => {
              const data = event.detail.data
              if (data.name === 'previewResult') {
                this.setPreviewResult(data.value)
              }
              if (this.optionsCauseResultChange.includes(data.name)) {
                this.needReAdd = true
              }
            }
            this.init()
            new _FastScreen__WEBPACK_IMPORTED_MODULE_15__['FastScreen']()
          }
          initElse() {
            this.setPreviewResult(
              _Settings__WEBPACK_IMPORTED_MODULE_14__['form'].previewResult
                .checked
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.addResult,
              this.addWork
            )
            window.addEventListener('addBMK', this.addBookmark)
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.crawlFinish,
              this.onCrawlFinish
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.crawlFinish,
              this.showCount
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.clearMultiple,
              this.clearMultiple
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.clearUgoira,
              this.clearUgoira
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.deleteWork,
              this.deleteWork
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.settingChange,
              this.onSettingChange
            )
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_4__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].green,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_开始筛选'),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_开始筛选Title'
                    )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.startScreen()
              })
            _CenterButtons__WEBPACK_IMPORTED_MODULE_4__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].red,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_在结果中筛选'
                ),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_在结果中筛选Title'
                    )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.screenInResult()
              })
          }
          appendElseEl() {
            const deleteWorks = new _DeleteWorks__WEBPACK_IMPORTED_MODULE_6__[
              'DeleteWorks'
            ]('.lmXjIY')
            deleteWorks.addClearMultipleBtn('.fjaNWC', () => {
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.clearMultiple
              )
            })
            deleteWorks.addClearUgoiraBtn('.bAzGJL', () => {
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.clearUgoira
              )
            })
            deleteWorks.addManuallyDeleteBtn(el => {
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.deleteWork,
                el
              )
            })
          }
          setFormOption() {
            this.maxCount = 1000
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_3__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_页数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_checkWantPageRule1Arg8'
              ),
              rangTip: `1 - ${this.maxCount}`,
              value: this.maxCount.toString()
            })
            _Options__WEBPACK_IMPORTED_MODULE_3__['options'].hideOption([15])
          }
          destroy() {
            window.removeEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.addResult,
              this.addWork
            )
            window.removeEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.crawlFinish,
              this.onCrawlFinish
            )
            window.removeEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.crawlFinish,
              this.showCount
            )
            // 离开下载页面时，取消设置“不自动下载”
            _Store__WEBPACK_IMPORTED_MODULE_10__[
              'store'
            ].states.notAutoDownload = false
          }
          startScreen() {
            if (
              !_Store__WEBPACK_IMPORTED_MODULE_10__['store'].states.allowWork
            ) {
              return alert(
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_当前任务尚未完成'
                )
              )
            }
            this.crawlWorks = true
            this.readyCrawl()
          }
          async nextStep() {
            this.initFetchURL()
            this.needCrawlPageCount = await this.calcNeedCrawlPageCount()
            if (this.needCrawlPageCount === 0) {
              return this.noResult()
            }
            this.startGetIdList()
            this.clearWorks()
          }
          // 返回包含作品列表的 ul 元素
          getWorksWrap() {
            const test = document.querySelectorAll('#root section ul')
            if (test.length > 0) {
              return test[test.length - 1]
            }
            return null
          }
          clearWorks() {
            this.worksWrap = this.getWorksWrap()
            if (!this.previewResult || !this.worksWrap) {
              return
            }
            this.worksWrap.innerHTML = ''
          }
          // 传入函数，过滤符合条件的结果
          filterResult(callback) {
            if (!this.crawled) {
              return alert(
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_尚未开始筛选'
                )
              )
            }
            if (this.resultMeta.length === 0) {
              return alert(
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_没有数据可供使用'
                )
              )
            }
            _CenterPanel__WEBPACK_IMPORTED_MODULE_12__['centerPanel'].close()
            _Log__WEBPACK_IMPORTED_MODULE_11__['log'].clear()
            const nowLength = this.resultMeta.length // 储存过滤前的结果数量
            this.resultMeta = this.resultMeta.filter(callback)
            // 如果过滤后，作品元数据发生了改变，或者强制要求重新生成结果，才会重排作品。以免浪费资源。
            if (this.resultMeta.length !== nowLength || this.needReAdd) {
              this.reAddResult()
            }
            this.needReAdd = false
            this.crawlWorks = false
            // 发布 crawlFinish 事件，会在日志上显示下载数量。
            _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.crawlFinish
            )
          }
          // 当筛选结果的元数据改变时，重新生成抓取结果
          // 在此过程中，会清空之前的作品元素，重新生成作品元素
          reAddResult() {
            _Store__WEBPACK_IMPORTED_MODULE_10__['store'].resetResult()
            this.clearWorks()
            this.resultMeta.forEach(data => {
              const pNo = this.getPNo(data.pageCount)
              _Store__WEBPACK_IMPORTED_MODULE_10__['store'].addResult(data, pNo)
            })
            _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_7__['EVT'].events.worksUpdate
            )
            _TitleBar__WEBPACK_IMPORTED_MODULE_13__['titleBar'].change('→')
          }
          // 在当前结果中再次筛选，会修改第一次筛选的结果
          screenInResult() {
            if (
              !_Store__WEBPACK_IMPORTED_MODULE_10__['store'].states.allowWork
            ) {
              return alert(
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                  '_当前任务尚未完成'
                )
              )
            }
            _Log__WEBPACK_IMPORTED_MODULE_11__['log'].clear()
            _Filter__WEBPACK_IMPORTED_MODULE_8__['filter'].init()
            this.getMultipleSetting()
            this.filterResult(data => {
              const filterOpt = {
                id: data.id,
                illustType: data.type,
                pageCount: data.pageCount,
                tags: data.tags,
                bookmarkCount: data.bmk,
                bookmarkData: data.bookmarked,
                width: data.fullWidth,
                height: data.fullHeight,
                createDate: data.date
              }
              return _Filter__WEBPACK_IMPORTED_MODULE_8__['filter'].check(
                filterOpt
              )
            })
          }
          getWantPage() {
            this.crawlNumber = this.checkWantPageInput(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_checkWantPageRule1Arg6'
              ),
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_checkWantPageRule1Arg7'
              )
            )
            if (this.crawlNumber === -1 || this.crawlNumber > this.maxCount) {
              this.crawlNumber = this.maxCount
            }
          }
          // 获取搜索页的数据。因为有多处使用，所以进行了封装
          async getSearchData(p) {
            let data = await _API__WEBPACK_IMPORTED_MODULE_9__[
              'API'
            ].getSearchData(
              _PageInfo__WEBPACK_IMPORTED_MODULE_5__['pageInfo'].getPageTag,
              this.worksType,
              p,
              this.option
            )
            return data.body.illust || data.body.illustManga || data.body.manga
          }
          // 组织要请求的 url 中的参数
          initFetchURL() {
            // 从 URL 中获取分类。可能有语言标识。
            /*
        https://www.pixiv.net/tags/Fate%2FGrandOrder/illustrations
        https://www.pixiv.net/en/tags/Fate%2FGrandOrder/illustrations
        */
            let URLType = location.pathname.split('tags/')[1].split('/')[1]
            // 但在“顶部”页面的时候是没有分类的，会是 undefined
            if (URLType === undefined) {
              URLType = ''
            }
            switch (URLType) {
              case '':
                this.worksType = 'artworks'
                break
              case 'illustrations':
              case 'illust_and_ugoira':
              case 'ugoira':
              case 'illust':
                this.worksType = 'illustrations'
                break
              case 'manga':
                this.worksType = 'manga'
                break
              default:
                this.worksType = 'artworks'
                break
            }
            let p = _API__WEBPACK_IMPORTED_MODULE_9__['API'].getURLField(
              location.href,
              'p'
            )
            this.startpageNo = parseInt(p) || 1
            // 从页面 url 中获取可以使用的选项
            this.option = {}
            this.allOption.forEach(param => {
              let value = _API__WEBPACK_IMPORTED_MODULE_9__['API'].getURLField(
                location.href,
                param
              )
              if (value !== '') {
                this.option[param] = value
              }
            })
          }
          // 计算应该抓取多少页
          async calcNeedCrawlPageCount() {
            let data = await this.getSearchData(1)
            // 计算总页数
            let pageCount = Math.ceil(data.total / this.worksNoPerPage)
            if (pageCount > this.maxCount) {
              // 最大为 1000
              pageCount = this.maxCount
            }
            // 计算从本页开始抓取的话，有多少页
            let needFetchPage = pageCount - this.startpageNo + 1
            // 比较用户设置的页数，取较小的那个数值
            if (needFetchPage < this.crawlNumber) {
              return needFetchPage
            } else {
              return this.crawlNumber
            }
          }
          // 计算页数之后，准备建立并发抓取线程
          startGetIdList() {
            if (this.needCrawlPageCount <= this.ajaxThreadsDefault) {
              this.ajaxThreads = this.needCrawlPageCount
            } else {
              this.ajaxThreads = this.ajaxThreadsDefault
            }
            for (let i = 0; i < this.ajaxThreads; i++) {
              this.getIdList()
            }
          }
          async getIdList() {
            let p = this.startpageNo + this.sendCrawlTaskCount
            this.sendCrawlTaskCount++
            // 发起请求，获取列表页
            let data
            try {
              data = await this.getSearchData(p)
            } catch (_a) {
              this.getIdList()
              return
            }
            data = data.data
            for (const nowData of data) {
              // 排除广告信息
              if (nowData.isAdContainer) {
                continue
              }
              const filterOpt = {
                id: nowData.illustId,
                width: nowData.width,
                height: nowData.height,
                pageCount: nowData.pageCount,
                bookmarkData: nowData.bookmarkData,
                illustType: nowData.illustType,
                tags: nowData.tags
              }
              if (
                _Filter__WEBPACK_IMPORTED_MODULE_8__['filter'].check(filterOpt)
              ) {
                _Store__WEBPACK_IMPORTED_MODULE_10__['store'].idList.push(
                  nowData.illustId
                )
              }
            }
            this.listPageFinished++
            _Log__WEBPACK_IMPORTED_MODULE_11__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_列表页抓取进度',
                this.listPageFinished.toString()
              ),
              1,
              false
            )
            if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
              // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
              this.getIdList()
            } else {
              // 抓取任务已经全部发送
              if (this.listPageFinished === this.needCrawlPageCount) {
                // 抓取任务全部完成
                _Log__WEBPACK_IMPORTED_MODULE_11__['log'].log(
                  _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                    '_列表页抓取完成'
                  )
                )
                this.getIdListFinished()
              }
            }
          }
          resetGetIdListStatus() {
            this.listPageFinished = 0
            this.sendCrawlTaskCount = 0
          }
          // 搜索页把下载任务按收藏数从高到低下载
          sortResult() {
            _Store__WEBPACK_IMPORTED_MODULE_10__['store'].resultMeta.sort(
              _API__WEBPACK_IMPORTED_MODULE_9__['API'].sortByProperty('bmk')
            )
            _Store__WEBPACK_IMPORTED_MODULE_10__['store'].result.sort(
              _API__WEBPACK_IMPORTED_MODULE_9__['API'].sortByProperty('bmk')
            )
          }
          setPreviewResult(value) {
            this.previewResult = value
            // 如果设置了“预览搜索结果”，则“不自动下载”。否则允许自动下载
            _Store__WEBPACK_IMPORTED_MODULE_10__[
              'store'
            ].states.notAutoDownload = value ? true : false
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitSettings.ts':
      /*!****************************************!*\
  !*** ./src/ts/modules/InitSettings.ts ***!
  \****************************************/
      /*! exports provided: InitSettings */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitSettings',
          function() {
            return InitSettings
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        // 保存和初始化设置项
        // 只有部分设置会被保存

        class InitSettings {
          constructor(form) {
            // 本地存储中使用的 name
            this.storeName = 'xzSetting'
            // 需要持久化保存的设置的默认值
            this.optionDefault = {
              multipleImageWorks: 0,
              firstFewImages: 1,
              downType0: true,
              downType1: true,
              downType2: true,
              ugoiraSaveAs: 'webm',
              needTag: '',
              notNeedTag: '',
              quietDownload: true,
              downloadThread: 5,
              userSetName: '{id}',
              tagNameToFileName: true,
              alwaysFolder: true,
              showOptions: true,
              postDate: false,
              postDateStart: '',
              postDateEnd: '',
              previewResult: true,
              checkFavNum: '0',
              setFavNum: '0'
            }
            // 需要持久化保存的设置
            this.options = this.optionDefault
            this.form = form
            this.restoreOption()
            this.bindOptionEvent()
          }
          // 恢复值是 Boolean 的设置项
          restoreBoolean(name) {
            // 优先使用用户设置的值
            if (this.options[name] !== undefined) {
              this.form[name].checked = this.options[name]
            } else {
              // 否则使用默认值
              this.form[name].checked = this.optionDefault[name]
            }
            // 这里不能简单的使用“或”符号来处理，考虑如下情况：
            // this.needSaveOpts[name] || this.needSaveOptsDefault[name]
            // 用户设置为 false，默认值为 true，使用 || 的话就恒为 true 了
          }
          // 恢复值是 string 的设置项
          restoreString(name) {
            // 优先使用用户设置的值
            if (this.options[name] !== undefined) {
              this.form[name].value = this.options[name].toString()
            } else {
              // 否则使用默认值
              this.form[name].value = this.optionDefault[name].toString()
            }
          }
          // 从持久化设置，或还是用默认值，恢复下载区域的设置
          restoreOption() {
            const savedOption = localStorage.getItem(this.storeName)
            // 如果之前已经持久化，则读取设置，初始化下载区域的选项
            if (savedOption) {
              this.options = JSON.parse(savedOption)
            } else {
              // 如果没有保存过，则不做处理
              return
            }
            // 设置是否显示选项区域
            _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.toggleForm,
              this.options.showOptions
            )
            // 多图作品设置
            this.restoreString('multipleImageWorks')
            // 设置作品张数
            this.restoreString('firstFewImages')
            // 设置下载的作品类型
            this.restoreBoolean('downType0')
            this.restoreBoolean('downType1')
            this.restoreBoolean('downType2')
            // 设置动图格式选项
            this.restoreString('ugoiraSaveAs')
            // 设置收藏数量选项
            this.restoreString('checkFavNum')
            // 设置收藏数量数值
            this.restoreString('setFavNum')
            // 设置必须的 tag
            this.restoreString('needTag')
            // 设置排除的 tag
            this.restoreString('notNeedTag')
            // 设置投稿时间
            this.restoreBoolean('postDate')
            this.restoreString('postDateStart')
            this.restoreString('postDateEnd')
            // 设置自动下载
            this.restoreBoolean('quietDownload')
            // 设置下载线程
            this.restoreString('downloadThread')
            // 设置文件命名规则
            this.restoreString('userSetName')
            // 设置是否添加标记名称
            this.restoreBoolean('tagNameToFileName')
            // 设置是否始终建立文件夹
            this.restoreBoolean('alwaysFolder')
            // 设置预览搜索结果
            this.restoreBoolean('previewResult')
          }
          // 处理输入框： change 时直接保存 value
          saveTextInput(name) {
            const el = this.form[name]
            el.addEventListener('change', () => {
              this.saveSetting(name, el.value)
            })
          }
          // 处理复选框： click 时直接保存 checked
          saveCheckBox(name) {
            const el = this.form[name]
            el.addEventListener('click', () => {
              this.saveSetting(name, el.checked)
            })
          }
          // 处理单选框： click 时直接保存 value
          saveRadio(name) {
            const radios = this.form[name]
            for (const radio of radios) {
              radio.addEventListener('focus', () => {
                this.saveSetting(name, radio.value)
              })
            }
          }
          // 绑定选项的事件，当选项变动时保存。
          // 只可执行一次，否则事件会重复绑定
          bindOptionEvent() {
            // 保存是否显示选项区域
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.toggleForm,
              event => {
                const boolean = event.detail.data
                this.saveSetting('showOptions', boolean)
              }
            )
            // 保存多图作品设置
            this.saveRadio('multipleImageWorks')
            // 保存作品张数
            this.saveTextInput('firstFewImages')
            // 保存下载的作品类型
            this.saveCheckBox('downType0')
            this.saveCheckBox('downType1')
            this.saveCheckBox('downType2')
            // 保存动图格式选项
            this.saveRadio('ugoiraSaveAs')
            // 保存收藏数量选项
            this.saveRadio('checkFavNum')
            // 保存收藏数量数值
            this.saveTextInput('setFavNum')
            // 保存投稿时间
            this.saveCheckBox('postDate')
            this.saveTextInput('postDateStart')
            this.saveTextInput('postDateEnd')
            // 保存必须的 tag 设置
            this.saveTextInput('needTag')
            // 保存排除的 tag 设置
            this.saveTextInput('notNeedTag')
            // 保存自动下载
            this.saveCheckBox('quietDownload')
            // 保存下载线程
            this.saveTextInput('downloadThread')
            // 保存命名规则
            const userSetNameInput = this.form.userSetName
            ;['change', 'focus'].forEach(ev => {
              userSetNameInput.addEventListener(ev, () => {
                this.saveSetting('userSetName', userSetNameInput.value)
              })
            })
            // 保存是否添加标记名称
            this.saveCheckBox('tagNameToFileName')
            // 保存是否始终建立文件夹
            this.saveCheckBox('alwaysFolder')
            // 保存预览搜索结果
            this.saveCheckBox('previewResult')
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.resetOption,
              () => {
                this.form.reset()
                this.reset()
              }
            )
          }
          // 持久化保存设置
          saveSetting(key, value) {
            this.options[key] = value
            _EVT__WEBPACK_IMPORTED_MODULE_0__[
              'EVT'
            ].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.settingChange,
              { name: key, value: value }
            )
            localStorage.setItem(this.storeName, JSON.stringify(this.options))
          }
          // 重设选项
          reset() {
            // 将 needSaveOpts 恢复为默认值
            this.options = this.optionDefault
            // 覆写本地存储里的设置为默认值
            localStorage.setItem(this.storeName, JSON.stringify(this.options))
            // 使用默认值重设选项
            this.restoreOption()
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitUserPage.ts':
      /*!****************************************!*\
  !*** ./src/ts/modules/InitUserPage.ts ***!
  \****************************************/
      /*! exports provided: InitUserPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitUserPage',
          function() {
            return InitUserPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./PageInfo */ './src/ts/modules/PageInfo.ts'
        )
        // 初始化用户页面

        class InitUserPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.tag = '' // 储存当前页面的 tag，有时没有 tag
            this.listType = 0 // 细分的列表类型
            this.onceNumber = 48 // 每页个数
            this.requsetNumber = 0 // 根据页数，计算要抓取的作品个数
            this.offset = 0 // 要去掉的作品数量
            this.init()
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_3__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_开始抓取'),
                [
                  [
                    'title',
                    _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                      '_开始抓取'
                    ) +
                      _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                        '_默认下载多页'
                      )
                  ]
                ]
              )
              .addEventListener('click', () => {
                this.readyCrawl()
              })
          }
          setFormOption() {
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_页数'),
              tip: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_checkWantPageRule1Arg8'
              ),
              rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_数字提示1'
              ),
              value: '-1'
            })
            _Options__WEBPACK_IMPORTED_MODULE_4__['options'].hideOption([
              15,
              18
            ])
          }
          destroy() {}
          getWantPage() {
            this.crawlNumber = this.checkWantPageInput(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_checkWantPageRule1Arg6'
              ),
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
                '_checkWantPageRule1Arg7'
              )
            )
          }
          nextStep() {
            this.readyGetIdList()
          }
          readyGetIdList() {
            // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
            const nowPage = _API__WEBPACK_IMPORTED_MODULE_5__[
              'API'
            ].getURLField(location.href, 'p') // 判断当前处于第几页，页码从 1 开始。也可能没有页码
            if (nowPage) {
              this.offset = (parseInt(nowPage) - 1) * this.onceNumber
            }
            if (this.offset < 0) {
              this.offset = 0
            }
            // 根据页数设置，计算要下载的个数
            this.requsetNumber = 0
            if (this.crawlNumber === -1) {
              this.requsetNumber = 9999999
            } else {
              this.requsetNumber = this.onceNumber * this.crawlNumber
            }
            // 判断页面类型
            // 匹配 pathname 里用户 id 之后的字符
            const test = location.pathname.match(/\/users\/\d+(\/.+)/)
            if (test === null) {
              // 用户主页
              this.listType = 0
            } else if (test.length === 2) {
              const str = test[1] //取出用户 id 之后的字符
              if (str.includes('/artworks')) {
                // 所有作品
                this.listType = 0
              } else if (str.includes('/illustrations')) {
                // 插画分类
                this.listType = 1
              } else if (str.includes('/manga')) {
                // 漫画分类
                this.listType = 2
              }
            }
            this.tag =
              _PageInfo__WEBPACK_IMPORTED_MODULE_9__['pageInfo'].getPageTag
            if (!this.tag) {
              this.getIdList()
            } else {
              if (this.listType === 1) {
                this.getIdListByTag('illusts')
              } else if (this.listType === 2) {
                this.getIdListByTag('manga')
              } else if (this.listType === 0) {
                this.getIdListByTag('illustmanga')
              }
            }
            _Log__WEBPACK_IMPORTED_MODULE_7__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl('_正在抓取')
            )
          }
          // 获取用户的全部作品列表
          async getIdList() {
            let type = []
            // 插画和漫画列表页
            if (this.listType === 0) {
              type = ['illusts', 'manga']
            } else if (this.listType === 1) {
              // 插画列表页，包含动图
              type = ['illusts']
            } else if (this.listType === 2) {
              // 漫画列表页
              type = ['manga']
            }
            let idList = await _API__WEBPACK_IMPORTED_MODULE_5__[
              'API'
            ].getUserWorksByType(
              _DOM__WEBPACK_IMPORTED_MODULE_8__['DOM'].getUserId(),
              type
            )
            // 把作品 id 转换成数字
            let tempList = []
            tempList = idList.map(id => {
              return parseInt(id)
            })
            // 升序排列
            tempList.sort(function(x, y) {
              return x - y
            })
            idList = tempList.map(id => {
              return id.toString()
            })
            // 不带 tag 获取作品时，由于 API 是一次性返回用户的所有作品，可能大于要求的数量，所以需要去掉多余的作品。
            // 删除 offset 需要去掉的部分。删除后面的 id，也就是近期作品
            idList.splice(idList.length - this.offset, idList.length)
            // 删除超过 requsetNumber 的作品。删除前面的 id，也就是早期作品
            if (idList.length > this.requsetNumber) {
              idList.splice(0, idList.length - this.requsetNumber)
            }
            // 储存
            _Store__WEBPACK_IMPORTED_MODULE_6__[
              'store'
            ].idList = _Store__WEBPACK_IMPORTED_MODULE_6__[
              'store'
            ].idList.concat(idList)
            this.getIdListFinished()
          }
          // 获取用户某一类型的作品列表（附带 tag）
          async getIdListByTag(type) {
            let data = await _API__WEBPACK_IMPORTED_MODULE_5__[
              'API'
            ].getUserWorksByTypeWithTag(
              _DOM__WEBPACK_IMPORTED_MODULE_8__['DOM'].getUserId(),
              type,
              this.tag,
              this.offset,
              this.requsetNumber
            )
            data.body.works.forEach(data =>
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.push(data.id)
            )
            this.getIdListFinished()
          }
          resetGetIdListStatus() {
            this.offset = 0
            this.tag = ''
            this.listType = 0
            this.listPageFinished = 0
          }
          sortResult() {
            // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
            _Store__WEBPACK_IMPORTED_MODULE_6__['store'].result.sort(
              _API__WEBPACK_IMPORTED_MODULE_5__['API'].sortByProperty('id')
            )
          }
        }

        /***/
      },

    /***/ './src/ts/modules/InitWorksPage.ts':
      /*!*****************************************!*\
  !*** ./src/ts/modules/InitWorksPage.ts ***!
  \*****************************************/
      /*! exports provided: InitWorksPage */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'InitWorksPage',
          function() {
            return InitWorksPage
          }
        )
        /* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./InitPageBase */ './src/ts/modules/InitPageBase.ts'
        )
        /* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Colors */ './src/ts/modules/Colors.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _CenterButtons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./CenterButtons */ './src/ts/modules/CenterButtons.ts'
        )
        /* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Options */ './src/ts/modules/Options.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _QuickBookmark__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./QuickBookmark */ './src/ts/modules/QuickBookmark.ts'
        )
        /* harmony import */ var _ImgViewer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./ImgViewer */ './src/ts/modules/ImgViewer.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
          /*! ./Log */ './src/ts/modules/Log.ts'
        )
        //初始化作品页

        class InitWorksPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__[
          'InitPageBase'
        ] {
          constructor() {
            super()
            this.crawlDirection = 0 // 抓取方向，在作品页内指示抓取新作品还是旧作品
            /*
        -1 抓取新作品
        0 不设置抓取方向
        1 抓取旧作品
        */
            this.crawlRelated = false // 是否下载相关作品（作品页内的）
            this.quickDownBtn = document.createElement('div')
            this.init()
          }
          initElse() {
            // 初始化快速收藏功能和图片查看器
            new _QuickBookmark__WEBPACK_IMPORTED_MODULE_7__['QuickBookmark']()
            _ImgViewer__WEBPACK_IMPORTED_MODULE_8__['imgViewer'].init()
            // 页面切换时初始化图片查看器
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_2__['EVT'].events.pageSwitch,
              () => {
                _ImgViewer__WEBPACK_IMPORTED_MODULE_8__['imgViewer'].init()
              }
            )
          }
          appendCenterBtns() {
            _CenterButtons__WEBPACK_IMPORTED_MODULE_4__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_从本页开始抓取new'
                )
              )
              .addEventListener('click', () => {
                this.crawlDirection = -1
                this.readyCrawl()
              })
            _CenterButtons__WEBPACK_IMPORTED_MODULE_4__['centerButtons']
              .add(
                _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_从本页开始抓取old'
                )
              )
              .addEventListener('click', () => {
                this.crawlDirection = 1
                this.readyCrawl()
              })
            const downRelatedBtn = _CenterButtons__WEBPACK_IMPORTED_MODULE_4__[
              'centerButtons'
            ].add(
              _Colors__WEBPACK_IMPORTED_MODULE_1__['Colors'].blue,
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_抓取相关作品')
            )
            downRelatedBtn.addEventListener(
              'click',
              () => {
                this.crawlRelated = true
                this.readyCrawl()
              },
              false
            )
          }
          appendElseEl() {
            // 在右侧创建快速下载按钮
            this.quickDownBtn.id = 'quick_down_btn'
            this.quickDownBtn.textContent = '↓'
            this.quickDownBtn.setAttribute(
              'title',
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_快速下载本页')
            )
            document.body.appendChild(this.quickDownBtn)
            this.quickDownBtn.addEventListener(
              'click',
              () => {
                _Store__WEBPACK_IMPORTED_MODULE_6__[
                  'store'
                ].states.quickDownload = true
                this.readyCrawl()
              },
              false
            )
          }
          setFormOption() {
            // 设置“个数/页数”选项
            _Options__WEBPACK_IMPORTED_MODULE_5__['options'].setWantPage({
              text: _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl('_个数'),
              tip:
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_checkWantPageRule1Arg8'
                ) +
                '<br>' +
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_相关作品大于0'
                ),
              rangTip: _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_数字提示1'
              ),
              value: '-1'
            })
            _Options__WEBPACK_IMPORTED_MODULE_5__['options'].hideOption([18])
          }
          destroy() {
            // 删除快速下载按钮
            _DOM__WEBPACK_IMPORTED_MODULE_9__['DOM'].removeEl(this.quickDownBtn)
          }
          getWantPage() {
            if (
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].states.quickDownload
            ) {
              // 快速下载
              this.crawlNumber = 1
            } else {
              // 检查下载页数的设置
              if (!this.crawlRelated) {
                this.crawlNumber = this.checkWantPageInput(
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                    '_checkWantPageRule1Arg3'
                  ),
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                    '_checkWantPageRule1Arg4'
                  )
                )
              } else {
                // 相关作品的提示
                this.crawlNumber = this.checkWantPageInput(
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                    '_checkWantPageRule1Arg9'
                  ),
                  _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                    '_checkWantPageRule1Arg10'
                  )
                )
              }
            }
          }
          nextStep() {
            // 下载相关作品
            if (this.crawlRelated) {
              this.getRelatedList()
            } else if (
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].states.quickDownload
            ) {
              // 快速下载
              _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.push(
                _API__WEBPACK_IMPORTED_MODULE_10__['API'].getIllustId(
                  window.location.href
                )
              )
              _Log__WEBPACK_IMPORTED_MODULE_11__['log'].log(
                _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                  '_开始获取作品页面'
                )
              )
              this.getIdListFinished()
            } else {
              // 向前向后下载
              this.getIdList()
            }
          }
          async getIdList() {
            let type = ['illusts', 'manga']
            let idList = await _API__WEBPACK_IMPORTED_MODULE_10__[
              'API'
            ].getUserWorksByType(
              _DOM__WEBPACK_IMPORTED_MODULE_9__['DOM'].getUserId(),
              type
            )
            // 储存符合条件的 id
            let nowId = parseInt(
              _API__WEBPACK_IMPORTED_MODULE_10__['API'].getIllustId(
                window.location.href
              )
            )
            idList.forEach(id => {
              let idNum = parseInt(id)
              // 新作品
              if (idNum >= nowId && this.crawlDirection === -1) {
                _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.push(id)
              } else if (idNum <= nowId && this.crawlDirection === 1) {
                // 旧作品
                _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.push(id)
              }
            })
            // 当设置了下载个数时，进行裁剪
            if (this.crawlNumber !== -1) {
              // 新作品 升序排列
              if (this.crawlDirection === -1) {
                _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.sort(
                  function(x, y) {
                    return parseInt(x) - parseInt(y)
                  }
                )
              } else {
                // 旧作品 降序排列
                _Store__WEBPACK_IMPORTED_MODULE_6__['store'].idList.sort(
                  function(x, y) {
                    return parseInt(y) - parseInt(x)
                  }
                )
              }
              _Store__WEBPACK_IMPORTED_MODULE_6__[
                'store'
              ].idList = _Store__WEBPACK_IMPORTED_MODULE_6__[
                'store'
              ].idList.splice(0, this.crawlNumber)
            }
            this.getIdListFinished()
          }
          // 下载相关作品时使用
          async getRelatedList() {
            let data = await _API__WEBPACK_IMPORTED_MODULE_10__[
              'API'
            ].getRelatedData(
              _API__WEBPACK_IMPORTED_MODULE_10__['API'].getIllustId()
            )
            const recommendData = data.body.recommendMethods
            // 取出相关作品的 id 列表
            let recommendIdList = Object.keys(recommendData)
            // 当设置了下载个数时，进行裁剪
            if (this.crawlNumber !== -1) {
              recommendIdList = recommendIdList
                .reverse()
                .slice(0, this.crawlNumber)
            }
            _Store__WEBPACK_IMPORTED_MODULE_6__[
              'store'
            ].idList = _Store__WEBPACK_IMPORTED_MODULE_6__[
              'store'
            ].idList.concat(recommendIdList)
            _Log__WEBPACK_IMPORTED_MODULE_11__['log'].log(
              _Lang__WEBPACK_IMPORTED_MODULE_3__['lang'].transl(
                '_相关作品抓取完毕',
                _Store__WEBPACK_IMPORTED_MODULE_6__[
                  'store'
                ].idList.length.toString()
              )
            )
            this.getIdListFinished()
          }
          resetGetIdListStatus() {
            this.crawlDirection = 0 // 解除下载方向的标记
            this.crawlRelated = false // 解除下载相关作品的标记
          }
        }

        /***/
      },

    /***/ './src/ts/modules/Lang.ts':
      /*!********************************!*\
  !*** ./src/ts/modules/Lang.ts ***!
  \********************************/
      /*! exports provided: lang */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'lang',
          function() {
            return lang
          }
        )
        /* harmony import */ var _langText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./langText */ './src/ts/modules/langText.ts'
        )

        // 语言类
        class Lang {
          constructor() {
            this.langType = 0
            this.getLangType()
          }
          // 设置语言类型
          getLangType() {
            const userLang = document.documentElement.lang // 获取语言标识
            switch (userLang) {
              case 'zh':
              case 'zh-CN':
              case 'zh-Hans':
                this.langType = 0 // 设置为简体中文
                break
              case 'ja':
                this.langType = 1 // 设置为日语
                break
              case 'zh-Hant':
              case 'zh-tw':
              case 'zh-TW':
                this.langType = 3 // 设置为繁体中文
                break
              default:
                this.langType = 2 // 设置为英语
                break
            }
          }
          // translate 翻译
          transl(name, ...arg) {
            let content =
              _langText__WEBPACK_IMPORTED_MODULE_0__['langText'][name][
                this.langType
              ]
            arg.forEach(val => (content = content.replace('{}', val)))
            return content
          }
        }
        const lang = new Lang()

        /***/
      },

    /***/ './src/ts/modules/Log.ts':
      /*!*******************************!*\
  !*** ./src/ts/modules/Log.ts ***!
  \*******************************/
      /*! exports provided: log */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'log',
          function() {
            return log
          }
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )

        // 日志类
        class Log {
          constructor() {
            this.logArea = document.createElement('div') // 输出日志的区域
            this.id = 'logWrap' // 日志区域元素的 id
            this.refresh = document.createElement('span') // 刷新时使用的元素
            this.colors = ['#00ca19', '#d27e00', '#f00']
            // 切换不同页面时，如果任务已经完成，则清空输出区域，避免日志一直堆积。
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.destroy,
              () => {
                if (
                  _Store__WEBPACK_IMPORTED_MODULE_2__['store'].states.allowWork
                ) {
                  this.clear()
                }
              }
            )
          }
          // 如果日志元素没有添加到页面上，则添加上去
          checkElement() {
            let test = document.getElementById(this.id)
            if (test === null) {
              this.logArea.id = this.id
              _DOM__WEBPACK_IMPORTED_MODULE_0__['DOM'].insertToHead(
                this.logArea
              )
            }
          }
          // 清空日志
          clear() {
            this.logArea.innerHTML = ''
          }
          // 添加日志
          /*
    str 日志文本
    level 日志等级
    br 换行标签的个数
    keepShow 追加日志的模式，默认为 true，把这一条日志添加后不再修改。false 则是刷新显示这条消息。
  
    level 日志等级：
    -1 auto 不设置颜色
    0 success 绿色
    1 warning 黄色
    2 error 红色
    */
          add(str, level, br, keepShow) {
            let span = document.createElement('span')
            if (!keepShow) {
              span = this.refresh
            }
            span.innerHTML = str
            if (level > -1) {
              span.style.color = this.colors[level]
            }
            while (br > 0) {
              span.appendChild(document.createElement('br'))
              br--
            }
            this.logArea.appendChild(span)
          }
          log(str, br = 1, keepShow = true) {
            this.checkElement()
            this.add(str, -1, br, keepShow)
          }
          success(str, br = 1, keepShow = true) {
            this.checkElement()
            this.add(str, 0, br, keepShow)
          }
          warning(str, br = 1, keepShow = true) {
            this.add(str, 1, br, keepShow)
          }
          error(str, br = 1, keepShow = true) {
            this.add(str, 2, br, keepShow)
          }
        }
        const log = new Log()

        /***/
      },

    /***/ './src/ts/modules/Options.ts':
      /*!***********************************!*\
  !*** ./src/ts/modules/Options.ts ***!
  \***********************************/
      /*! exports provided: options */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'options',
          function() {
            return options
          }
        )
        /* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Settings */ './src/ts/modules/Settings.ts'
        )

        // 操作 Setting 表单的选项区域
        class Options {
          constructor() {
            this.allOption = _Settings__WEBPACK_IMPORTED_MODULE_0__[
              'form'
            ].querySelectorAll(
              `.${_Settings__WEBPACK_IMPORTED_MODULE_0__['optionClass']}`
            )
            // 获取“页数/个数”设置的元素
            const wantPageOption = this.getOption(1)
            this.wantPageEls = {
              text: wantPageOption.querySelector('.setWantPageTip1'),
              rangTip: wantPageOption.querySelector('.setWantPageTip2'),
              input: wantPageOption.querySelector('.setWantPage')
            }
          }
          // 使用编号获取指定选项的元素
          getOption(no) {
            for (const option of this.allOption) {
              if (option.dataset.no === no.toString()) {
                return option
              }
            }
            throw `Not found this option: ${no}`
          }
          // 显示或隐藏指定的选项
          setOptionDisplay(no, display) {
            for (const number of no) {
              this.getOption(number).style.display = display
            }
          }
          // 显示所有选项
          // 在切换不同页面时使用
          showAllOption() {
            for (const el of this.allOption) {
              el.style.display = 'block'
            }
          }
          // 隐藏指定的选项。参数是数组，传递设置项的编号。
          hideOption(no) {
            this.setOptionDisplay(no, 'none')
          }
          // 显示指定的选项。因为页面无刷新加载，所以一些选项被隐藏后，可能需要再次显示
          showOption(no) {
            this.setOptionDisplay(no, 'block')
          }
          // 设置 “设置页面/作品数量” 选项的提示和预设值
          setWantPage(arg) {
            this.wantPageEls.text.textContent = arg.text
            this.wantPageEls.text.dataset.tip = arg.tip
            this.wantPageEls.rangTip.textContent = arg.rangTip
            this.wantPageEls.input.value = arg.value
          }
        }
        const options = new Options()

        /***/
      },

    /***/ './src/ts/modules/Output.ts':
      /*!**********************************!*\
  !*** ./src/ts/modules/Output.ts ***!
  \**********************************/
      /*! no exports provided */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        // 输出传递的文本

        class Output {
          constructor() {
            this.outputPanel = document.createElement('div') // 输出面板
            this.outputContent = document.createElement('div') // 输出文本的容器元素
            this.addOutPutPanel()
            this.bindEvent()
          }
          // 添加输出面板
          addOutPutPanel() {
            const outputPanelHTML = `
    <div class="outputWrap">
    <div class="outputClose" title="${_Lang__WEBPACK_IMPORTED_MODULE_1__[
      'lang'
    ].transl('_关闭')}">X</div>
    <div class="outputTitle">${_Lang__WEBPACK_IMPORTED_MODULE_1__[
      'lang'
    ].transl('_输出信息')}</div>
    <div class="outputContent"></div>
    <div class="outputFooter">
    <div class="outputCopy" title="">${_Lang__WEBPACK_IMPORTED_MODULE_1__[
      'lang'
    ].transl('_复制')}</div>
    </div>
    </div>
    `
            document.body.insertAdjacentHTML('beforeend', outputPanelHTML)
            this.outputPanel = document.querySelector('.outputWrap')
            this.outputContent = document.querySelector('.outputContent')
          }
          close() {
            this.outputPanel.style.display = 'none'
            this.outputContent.innerHTML = ''
          }
          bindEvent() {
            // 关闭输出面板
            document
              .querySelector('.outputClose')
              .addEventListener('click', () => {
                this.close()
              })
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.hideCenterPanel,
              () => {
                this.close()
              }
            )
            // 复制输出内容
            document
              .querySelector('.outputCopy')
              .addEventListener('click', () => {
                const range = document.createRange()
                range.selectNodeContents(this.outputContent)
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(range)
                document.execCommand('copy')
                // 改变提示文字
                document.querySelector(
                  '.outputCopy'
                ).textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__[
                  'lang'
                ].transl('_已复制到剪贴板')
                setTimeout(() => {
                  window.getSelection().removeAllRanges()
                  document.querySelector(
                    '.outputCopy'
                  ).textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__[
                    'lang'
                  ].transl('_复制')
                }, 1000)
              })
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.output,
              ev => {
                this.output(ev.detail.data)
              }
            )
          }
          // 输出内容
          output(text) {
            if (text) {
              this.outputContent.innerHTML = text
              this.outputPanel.style.display = 'block'
            }
          }
        }
        new Output()

        /***/
      },

    /***/ './src/ts/modules/PageInfo.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/PageInfo.ts ***!
  \************************************/
      /*! exports provided: pageInfo */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'pageInfo',
          function() {
            return pageInfo
          }
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./PageType */ './src/ts/modules/PageType.ts'
        )
        // 获取页面上的一些信息，用于文件名中

        class PageInfo {
          constructor() {
            // 预设为 1 是为了指示这个标记有值，这样在获取到实际值之前，就可以把它插入到下拉框里。
            this.pageTitle = ''
            this.pageUserName = ''
            this.pageUserID = ''
            this.pageTag = ''
            this.getPageInfo()
            // 页面切换时获取新的页面信息
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_2__['EVT'].events.pageSwitch,
              () => {
                this.getPageInfo()
              }
            )
          }
          get getPageTag() {
            return this.pageTag
          }
          // 重置
          // 切换页面时可能旧页面的一些标记在新页面没有了，所以要先重置
          reset() {
            this.pageTitle = ''
            this.pageUserName = ''
            this.pageUserID = ''
            this.pageTag = ''
          }
          // 储存信息
          // 开始抓取时，把此时的页面信息保存到 store 里。这样即使下载时页面切换了，使用的刚开始抓取时的信息。
          async store() {
            await this.getPageInfo()
            _Store__WEBPACK_IMPORTED_MODULE_3__[
              'store'
            ].pageInfo.pageTitle = this.pageTitle
            _Store__WEBPACK_IMPORTED_MODULE_3__[
              'store'
            ].pageInfo.pageUserName = this.pageUserName
            _Store__WEBPACK_IMPORTED_MODULE_3__[
              'store'
            ].pageInfo.pageUserID = this.pageUserID
            _Store__WEBPACK_IMPORTED_MODULE_3__[
              'store'
            ].pageInfo.pageTag = this.pageTag
          }
          // 获取当前页面的一些信息，用于文件名中
          async getPageInfo() {
            // 执行时可能 DOM 加载完成了，但主要内容没有加载出来，需要等待
            if (!document.body.innerHTML.includes('/users/')) {
              return window.setTimeout(() => {
                this.getPageInfo()
              }, 300)
            }
            const type = _PageType__WEBPACK_IMPORTED_MODULE_4__[
              'pageType'
            ].getPageType()
            this.reset()
            // 去掉标题上的下载状态、消息数量提示
            this.pageTitle = document.title
              .replace(/\[(↑|→|▶|↓|║|■|√| )\] /, '')
              .replace(/^\(\d.*\) /, '')
            // 设置用户信息
            if (type === 1 || type === 2) {
              // 只有 1 和 2 可以使用页面上的用户信息
              let data = await _API__WEBPACK_IMPORTED_MODULE_0__[
                'API'
              ].getUserProfile(
                _DOM__WEBPACK_IMPORTED_MODULE_1__['DOM'].getUserId()
              )
              this.pageUserID = data.body.userId
              this.pageUserName = data.body.name
            }
            // 获取当前页面的 tag
            this.pageTag = decodeURIComponent(
              _API__WEBPACK_IMPORTED_MODULE_0__['API'].getTagFromURL(
                location.href
              )
            )
            // 将可用选项添加到下拉选项里
            this.initPageInfoSelector()
          }
          initPageInfoSelector() {
            let optionHtml = '<option value="default" disable>…</option>'
            const info = new Map([
              ['p_title', this.pageTitle],
              ['p_user', this.pageUserName],
              ['p_uid', this.pageUserID],
              ['p_tag', this.pageTag]
            ])
            for (let [key, value] of info.entries()) {
              if (value) {
                optionHtml += `<option value="{${key}}">{${key}}</option>`
              }
            }
            let target = document.getElementById('pageInfoSelect')
            if (target) {
              target.innerHTML = optionHtml
            }
          }
        }
        const pageInfo = new PageInfo()

        /***/
      },

    /***/ './src/ts/modules/PageType.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/PageType.ts ***!
  \************************************/
      /*! exports provided: pageType */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'pageType',
          function() {
            return pageType
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        // 获取页面类型

        class PageType {
          constructor() {
            this.type = 0
            this.type = this.getPageType()
            // 页面切换时检查新旧页面是否不同
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.pageSwitch,
              () => {
                this.checkPageTypeIsNew()
              }
            )
          }
          // 判断页面类型
          // 有些页面类型（如小说）虽然不支持，但它和支持的页面是无刷新切换的，所以视为支持的页面。等到开始抓取时再次判断是否可以抓取
          getPageType() {
            const url = window.location.href
            let type
            if (
              window.location.hostname === 'www.pixiv.net' &&
              (window.location.pathname === '/' ||
                window.location.pathname === '/en/')
            ) {
              type = 0
            } else if (/\/artworks\/\d{1,10}/.test(url)) {
              type = 1
            } else if (
              /\/users\/\d+/.test(url) &&
              !url.includes('/bookmarks')
            ) {
              type = 2
            } else if (
              location.pathname === '/bookmark.php' ||
              url.includes('/bookmarks')
            ) {
              type = 4
            } else if (url.includes('/tags/')) {
              type = 5
            } else if (
              location.pathname === '/ranking_area.php' &&
              location.search !== ''
            ) {
              type = 6
            } else if (window.location.pathname === '/ranking.php') {
              type = 7
            } else if (
              url.includes('https://www.pixivision.net') &&
              url.includes('/a/')
            ) {
              type = 8
            } else if (
              url.includes('/bookmark_add.php?id=') ||
              url.includes('/bookmark_detail.php?illust_id=')
            ) {
              type = 9
            } else if (
              url.includes('/bookmark_new_illust.php') ||
              url.includes('/bookmark_new_illust_r18.php')
            ) {
              type = 10
            } else if (window.location.pathname === '/discovery') {
              type = 11
            } else if (
              url.includes('/new_illust.php') ||
              url.includes('/new_illust_r18.php')
            ) {
              type = 12
            } else {
              // 没有匹配到可用的页面类型
              throw new Error('Page type matching failed')
            }
            return type
          }
          // 检查是不是进入到了新的页面类型
          checkPageTypeIsNew() {
            let newType = this.getPageType()
            if (this.type !== newType) {
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.pageTypeChange,
                newType
              )
            }
            // 保存当前页面类型
            this.type = newType
          }
        }
        const pageType = new PageType()

        /***/
      },

    /***/ './src/ts/modules/ProgressBar.ts':
      /*!***************************************!*\
  !*** ./src/ts/modules/ProgressBar.ts ***!
  \***************************************/
      /*! exports provided: progressBar */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'progressBar',
          function() {
            return progressBar
          }
        )
        /* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Store */ './src/ts/modules/Store.ts'
        )
        /* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./CenterPanel */ './src/ts/modules/CenterPanel.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )

        // 进度条
        class ProgressBar {
          constructor() {
            this.wrapHTML = `
  <div class="progressBarWrap">
  <div class="total">
  <span class="text">${_Lang__WEBPACK_IMPORTED_MODULE_2__['lang'].transl(
    '_下载进度'
  )}</span>
  <div class="right1">
  <div class="progressBar progressBar1">
  <div class="progress progress1"></div>
  </div>
  <div class="progressTip progressTip1">
  <span class="downloaded">0</span>
  /
  <span class="imgNum totalNumber">0</span>
  </div>
  </div>
  </div>

  <ul class="progressBarList"></ul>
  </div>
  `
            this.barHTML = `<li class="downloadBar">
  <div class="progressBar progressBar2">
  <div class="progress progress2"></div>
  </div>
  <div class="progressTip progressTip2">
  <span class="fileName"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${_Lang__WEBPACK_IMPORTED_MODULE_2__[
    'lang'
  ].transl('_已下载')}&nbsp;&nbsp;<span class="loaded">0/0</span>KB
  </div>
  </li>`
            this.allProgressBar = []
            this.wrap = _CenterPanel__WEBPACK_IMPORTED_MODULE_1__[
              'centerPanel'
            ].useSlot('progressBar', this.wrapHTML)
            this.downloadedEl = this.wrap.querySelector('.downloaded')
            this.progressColorEl = this.wrap.querySelector('.progress1')
            this.listWrap = this.wrap.querySelector('.progressBarList')
            this.totalNumberEl = this.wrap.querySelector('.totalNumber')
          }
          // 重设所有进度
          reset(num) {
            // 重置总进度条
            this.downloadedEl.textContent = '0'
            this.totalNumberEl.textContent = _Store__WEBPACK_IMPORTED_MODULE_0__[
              'store'
            ].result.length.toString()
            this.progressColorEl.style.width = '0%'
            // 重置子进度条
            this.listWrap.innerHTML = this.barHTML.repeat(num)
            this.wrap.style.display = 'block'
            // 保存子进度条上需要使用到的元素
            const allProgressBar = this.listWrap.querySelectorAll(
              '.downloadBar'
            )
            this.allProgressBar = []
            for (const bar of allProgressBar) {
              const data = {
                name: bar.querySelector('.fileName'),
                loaded: bar.querySelector('.loaded'),
                progress: bar.querySelector('.progress')
              }
              this.allProgressBar.push(data)
            }
          }
          // 设置总进度条的进度
          setTotalProgress(downloaded) {
            this.downloadedEl.textContent = downloaded.toString()
            const progress =
              (downloaded /
                _Store__WEBPACK_IMPORTED_MODULE_0__['store'].result.length) *
              100
            this.progressColorEl.style.width = progress + '%'
          }
          // 设置子进度条的进度
          setProgress(index, data) {
            const bar = this.allProgressBar[index]
            bar.name.textContent = data.name
            bar.loaded.textContent = `${Math.floor(
              data.loaded / 1024
            )}/${Math.floor(data.total / 1024)}`
            const progress = data.loaded / data.total || 0 // 若结果为 NaN 则设为 0
            bar.progress.style.width = progress * 100 + '%'
          }
          // 让某个子进度条显示警告色
          showErrorColor(index, show) {
            const bar = this.allProgressBar[index]
            bar.name.classList[show ? 'add' : 'remove']('downloadError')
          }
        }
        const progressBar = new ProgressBar()

        /***/
      },

    /***/ './src/ts/modules/QuickBookmark.ts':
      /*!*****************************************!*\
  !*** ./src/ts/modules/QuickBookmark.ts ***!
  \*****************************************/
      /*! exports provided: QuickBookmark */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'QuickBookmark',
          function() {
            return QuickBookmark
          }
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        // 快速收藏

        class QuickBookmark {
          constructor() {
            this.quickBookmarkEl = document.createElement('a') // 快速收藏的元素
            this.quickBookmark()
          }
          // 快速收藏
          quickBookmark() {
            // 因为切换作品（pushstate）时，不能准确的知道 toolbar 何时更新，而且获取 token 也可能需要时间，所以只能不断检测
            setTimeout(() => {
              this.quickBookmark()
            }, 300)
            // 如果获取不到 token，则不展开快速收藏功能
            if (!_API__WEBPACK_IMPORTED_MODULE_0__['API'].getToken()) {
              return
            }
            // 因为 p 站改版 class 经常变，所以从父元素查找，父元素的 class 变化没那么频繁
            const toolbarParent = document.querySelectorAll('main > section')
            let toolbar // 作品下方的工具栏
            for (const el of toolbarParent) {
              const test = el.querySelector('div>section')
              if (test) {
                toolbar = test
                break
              }
            }
            if (toolbar) {
              this.quickBookmarkEl = document.querySelector('#quickBookmarkEl')
              // 如果没有 quick 元素则添加
              if (!this.quickBookmarkEl) {
                // 创建快速收藏元素
                this.quickBookmarkEl = document.createElement('a')
                this.quickBookmarkEl.id = 'quickBookmarkEl'
                this.quickBookmarkEl.textContent = '✩'
                this.quickBookmarkEl.href = 'javascript:void(0)'
                this.quickBookmarkEl.title = _Lang__WEBPACK_IMPORTED_MODULE_1__[
                  'lang'
                ].transl('_快速收藏')
                toolbar.insertBefore(
                  this.quickBookmarkEl,
                  toolbar.childNodes[3]
                )
                // 隐藏原来的收藏按钮并检测收藏状态
                const orgIcon = toolbar.childNodes[2]
                if (!orgIcon) {
                  // 当用户处于自己作品的页面时，是没有收藏按钮的，停止执行
                  return
                } else {
                  orgIcon.style.display = 'none'
                }
                const heart = orgIcon.querySelector('svg')
                if (
                  window.getComputedStyle(heart)['fill'] === 'rgb(255, 64, 96)'
                ) {
                  // 如果已经收藏过了
                  this.quickBookmarkEnd()
                } else {
                  // 准备快速收藏
                  this.readyQuickBookmark()
                }
              } else {
                // 如果有 quick 元素，什么都不做
                return
              }
            }
          }
          // 准备快速收藏
          readyQuickBookmark() {
            this.quickBookmarkEl.addEventListener('click', () => {
              document.querySelector('._35vRH4a').click() // 自动点赞
              // 储存 tag
              const tagElements = document.querySelectorAll('._1LEXQ_3 li')
              const tagArray = Array.from(tagElements).map(el => {
                const nowA = el.querySelector('a')
                if (nowA) {
                  let nowTag = nowA.textContent
                  // 对于原创作品，非日文的页面上只显示了用户语言的“原创”，替换成日文 tag “オリジナル”。
                  if (
                    nowTag === '原创' ||
                    nowTag === 'Original' ||
                    nowTag === '창작'
                  ) {
                    nowTag = 'オリジナル'
                  }
                  return nowTag
                }
              })
              const tagString = encodeURI(tagArray.join(' '))
              // 调用添加收藏的 api
              _API__WEBPACK_IMPORTED_MODULE_0__['API']
                .addBookmark(
                  _API__WEBPACK_IMPORTED_MODULE_0__['API'].getIllustId(),
                  tagString,
                  _API__WEBPACK_IMPORTED_MODULE_0__['API'].getToken(),
                  false
                )
                .then(response => response.json())
                .then(data => {
                  if (data.error !== undefined && data.error === false) {
                    this.quickBookmarkEnd()
                  }
                })
            })
          }
          // 如果这个作品已收藏，则改变样式
          quickBookmarkEnd() {
            this.quickBookmarkEl.style.color = '#FF4060'
            this.quickBookmarkEl.href = `/bookmark_add.php?type=illust&illust_id=${_API__WEBPACK_IMPORTED_MODULE_0__[
              'API'
            ].getIllustId()}`
          }
        }

        /***/
      },

    /***/ './src/ts/modules/RightIcon.ts':
      /*!*************************************!*\
  !*** ./src/ts/modules/RightIcon.ts ***!
  \*************************************/
      /*! no exports provided */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )

        // 右侧的下载图标
        class RightIcon {
          constructor() {
            this.icon = document.createElement('div')
            this.addIcon()
            this.bindEvents()
          }
          // 添加右侧下载按钮
          addIcon() {
            this.icon = document.createElement('div')
            this.icon.textContent = '↓'
            this.icon.id = 'rightButton'
            document.body.appendChild(this.icon)
          }
          bindEvents() {
            this.icon.addEventListener('click', () => {
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
                _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.clickRightIcon
              )
            })
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.hideCenterPanel,
              () => {
                this.show()
              }
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.showCenterPanel,
              () => {
                this.hide()
              }
            )
          }
          show() {
            this.icon.style.display = 'block'
          }
          hide() {
            this.icon.style.display = 'none'
          }
        }
        new RightIcon()

        /***/
      },

    /***/ './src/ts/modules/Settings.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/Settings.ts ***!
  \************************************/
      /*! exports provided: form, optionClass */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'form',
          function() {
            return form
          }
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'optionClass',
          function() {
            return optionClass
          }
        )
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./DOM */ './src/ts/modules/DOM.ts'
        )
        /* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./CenterPanel */ './src/ts/modules/CenterPanel.ts'
        )
        /* harmony import */ var _InitSettings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./InitSettings */ './src/ts/modules/InitSettings.ts'
        )

        // 设置表单
        class Settings {
          constructor() {
            this.optionClass = 'option'
            this.html = `<form class="settingForm">
  <p class="${this.optionClass}" data-no="1">
  <span class="setWantPageWrap">
  <span class="has_tip settingNameStyle1 setWantPageTip1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl(
    '_页数'
  )}" style="margin-right: 0px;">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl(
              '_页数'
            )}</span><span class="gray1" style="margin-right: 10px;"> ? </span>
  <input type="text" name="setWantPage" class="setinput_style1 blue setWantPage"
  value = '-1'
  >
  &nbsp;&nbsp;&nbsp;
  <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
  </span>
  </p>
  <p class="${this.optionClass}" data-no="2">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_下载作品类型的提示Center')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
  <label for="setWorkType0"><input type="checkbox" name="downType0" id="setWorkType0" checked> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_插画')}&nbsp;</label>
  <label for="setWorkType1"><input type="checkbox" name="downType1" id="setWorkType1" checked> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_漫画')}&nbsp;</label>
  <label for="setWorkType2"><input type="checkbox" name="downType2" id="setWorkType2" checked> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_动图')}&nbsp;</label>
  </p>
  <p class="${this.optionClass}" data-no="3">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_怎样下载多图作品')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_多图作品设置')}<span class="gray1"> ? </span></span>
  <label for="multipleImageWorks1"><input type="radio" name="multipleImageWorks" id="multipleImageWorks1" value="0"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_全部下载')}&nbsp; </label>
  <label for="multipleImageWorks2"><input type="radio" name="multipleImageWorks" id="multipleImageWorks2" value="-1"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_不下载')}&nbsp; </label>
  <label for="multipleImageWorks3"><input type="radio" name="multipleImageWorks" id="multipleImageWorks3" value="1"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_下载前几张图片')}&nbsp; </label>
  <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
  </p>
  <p class="${this.optionClass}" data-no="4">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_动图保存格式title')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_动图保存格式')}<span class="gray1"> ? </span></span>
  <label for="ugoiraSaveAs1"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" value="webm" checked> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_webmVideo')} &nbsp;</label>
  <label for="ugoiraSaveAs3"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" value="gif"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_gif')} &nbsp;</label>
  <label for="ugoiraSaveAs2"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" value="zip"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_zipFile')} &nbsp;</label>
  </p>
  <p class="${this.optionClass}" data-no="5">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_筛选收藏数的提示Center')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_筛选收藏数Center')}<span class="gray1"> ? </span></span>
  <label for="checkFavNum0"><input type="radio" name="checkFavNum" id="checkFavNum0" value="0" checked>  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_不限制')}&nbsp; </label>
  <label for="checkFavNum1"><input type="radio" name="checkFavNum" id="checkFavNum1" value="1">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_大于')}&nbsp; </label>
  <input type="text" name="setFavNum" class="setinput_style1 blue" value="0">&nbsp;&nbsp;&nbsp;&nbsp;
  </p>
  <p class="${this.optionClass}" data-no="6">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_只下载已收藏的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_只下载已收藏')}<span class="gray1"> ? </span></span>
  <label for="setOnlyBmk"><input type="checkbox" name="setOnlyBmk" id="setOnlyBmk"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_启用')}</label>
  </p>
  <p class="${this.optionClass}" data-no="7">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_筛选宽高的按钮Title')} ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl(
              '_筛选宽高的提示文字'
            )}">${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
              '_筛选宽高的按钮文字'
            )}<span class="gray1"> ? </span></span>
  <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
  <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" value="&" checked> <label for="setWidth_AndOr1">and&nbsp;</label>
  <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" value="|"> <label for="setWidth_AndOr2">or&nbsp;</label>
  <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
  </p>
  <p class="${this.optionClass}" data-no="8">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_设置宽高比例Title')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_设置宽高比例')}<span class="gray1"> ? </span></span>
  <label for="ratio0"><input type="radio" name="ratio" id="ratio0" value="0" checked>  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_不限制')}&nbsp; </label>
  <label for="ratio1"><input type="radio" name="ratio" id="ratio1" value="1">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_横图')}&nbsp; </label>
  <label for="ratio2"><input type="radio" name="ratio" id="ratio2" value="2">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_竖图')}&nbsp; </label>
  <label for="ratio3"><input type="radio" name="ratio" id="ratio3" value="3">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_输入宽高比')}</label>
  <input type="text" name="userRatio" class="setinput_style1 blue" value="1.4">
  </p>
  <p class="${this.optionClass}" data-no="9">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_设置id范围提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_设置id范围')} <span class="gray1"> ? </span></span>
  <label for="idRange0"><input type="radio" name="idRange" id="idRange0" value="0" checked>  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_不限制')}&nbsp; </label>
  <label for="idRange1"><input type="radio" name="idRange" id="idRange1" value="1">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_大于')}&nbsp; </label>
  <label for="idRange2"><input type="radio" name="idRange" id="idRange2" value="2">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_小于')}&nbsp; </label>
  <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="">
  </p>
  <p class="${this.optionClass}" data-no="10">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_设置投稿时间提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_设置投稿时间')} <span class="gray1"> ? </span></span>
  <label for="setPostDate"><input type="checkbox" name="postDate" id="setPostDate"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_启用')}</label>
  <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
  &nbsp;-&nbsp;
  <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
  </p>
  <p class="${this.optionClass}" data-no="11">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_必须tag的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_必须含有tag')}<span class="gray1"> ? </span></span>
  <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
  </p>
  <p class="${this.optionClass}" data-no="12">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_排除tag的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_不能含有tag')}<span class="gray1"> ? </span></span>
  <input type="text" name="notNeedTag" class="setinput_style1 blue setinput_tag">
  </p>
  <p class="${this.optionClass}" data-no="13">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_设置文件夹名的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_设置文件名')}<span class="gray1"> ? </span></span>
  <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="{id}">
  &nbsp;
  <select name="pageInfoSelect" id="pageInfoSelect">
  </select>
  &nbsp;
  <select name="fileNameSelect">
    <option value="default" disable>…</option>
    <option value="{id}">{id}</option>
    <option value="{title}">{title}</option>
    <option value="{tags}">{tags}</option>
    <option value="{tags_translate}">{tags_translate}</option>
    <option value="{user}">{user}</option>
    <option value="{userid}">{userid}</option>
    <option value="{type}">{type}</option>
    <option value="{date}">{date}</option>
    <option value="{bmk}">{bmk}</option>
    <option value="{px}">{px}</option>
    <option value="{rank}">{rank}</option>
    <option value="{id_num}">{id_num}</option>
    <option value="{p_num}">{p_num}</option>
    </select>
  &nbsp;&nbsp;
  <span class="showFileNameTip">？</span>
  </p>
  <p class="fileNameTip tip">
  <strong>${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang']
    .transl('_设置文件夹名的提示')
    .replace('<br>', '. ')}</strong>
  <br>
  <span class="blue">{p_user}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_文件夹标记PUser')}
  <br>
  <span class="blue">{p_uid}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_文件夹标记PUid')}
  <br>
  <span class="blue">{p_tag}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_文件夹标记PTag')}
  <br>
  <span class="blue">{p_title}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_文件夹标记PTitle')}
  <br>
  <span class="blue">{id}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记1')}
  <br>
  <span class="blue">{title}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记2')}
  <br>
  <span class="blue">{tags}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记3')}
  <br>
  <span class="blue">{tags_translate}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记11')}
  <br>
  <span class="blue">{user}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记4')}
  <br>
  <span class="blue">{userid}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记6')}
  <br>
  <span class="blue">{date}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记12')}
  <br>
  <span class="blue">{type}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记14')}
  <br>
  <span class="blue">{bmk}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记8')}
  <br>
  <span class="blue">{px}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记7')}
  <br>
  <span class="blue">{id_num}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记9')}
  <br>
  <span class="blue">{p_num}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记10')}
  <br>
  <span class="blue">{rank}</span>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记13')}
  <br>
  ${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl('_命名标记提醒')}
  </p>
  <p class="${this.optionClass}" data-no="14">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_添加字段名称提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_添加字段名称')}<span class="gray1"> ? </span></span>
  <label for="setTagNameToFileName"><input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" checked> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_启用')}</label>
  &nbsp;&nbsp;&nbsp;
  <span class="showFileNameResult"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_预览文件名')}</span>
  </p>
  <p class="${this.optionClass}" data-no="15">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_快速下载建立文件夹提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl(
              '_快速下载建立文件夹'
            )}<span class="gray1"> ? </span></span>
  <label for="setAlwaysFolder"><input type="checkbox" name="alwaysFolder" id="setAlwaysFolder" > ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_启用')}</label>
  </p>
  <p class="${this.optionClass}" data-no="16">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_线程数字')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
              '_设置下载线程'
            )}<span class="gray1"> ? </span></span>
  <input type="text" name="downloadThread" class="setinput_style1 blue" value="5">
  </p>
  <p class="${this.optionClass}" data-no="17">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_快速下载的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_是否自动下载')}<span class="gray1"> ? </span></span>
  <label for="setQuietDownload"><input type="checkbox" name="quietDownload" id="setQuietDownload" checked> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_启用')}</label>
  </p>
  <p class="${this.optionClass}" data-no="18">
  <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_预览搜索结果说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__[
              'lang'
            ].transl('_预览搜索结果')}<span class="gray1"> ? </span></span>
  <label for="setPreviewResult"><input type="checkbox" name="previewResult" id="setPreviewResult" checked> ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
    'lang'
  ].transl('_启用')}</label>
  </p>
  <input type="hidden" name="debut" value="0">
  </form>`
            this.form = _CenterPanel__WEBPACK_IMPORTED_MODULE_3__[
              'centerPanel'
            ].useSlot('form', this.html)
            this.bindEvents()
            new _InitSettings__WEBPACK_IMPORTED_MODULE_4__['InitSettings'](
              this.form
            )
          }
          // 把下拉框的选择项插入到文本框里
          insertValueToInput(from, to) {
            from.addEventListener('change', () => {
              if (from.value !== 'default') {
                // 把选择项插入到光标位置,并设置新的光标位置
                const position = to.selectionStart
                to.value =
                  to.value.substr(0, position) +
                  from.value +
                  to.value.substr(position, to.value.length)
                to.selectionStart = position + from.value.length
                to.selectionEnd = position + from.value.length
                to.focus()
              }
            })
          }
          bindEvents() {
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.toggleForm,
              event => {
                const boolean = event.detail.data
                this.form.style.display = boolean ? 'block' : 'none'
              }
            )
            // 预览文件名
            this.form
              .querySelector('.showFileNameResult')
              .addEventListener('click', () => {
                _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events
                    .previewFileName
                )
              })
            // 显示命名字段提示
            this.form
              .querySelector('.showFileNameTip')
              .addEventListener('click', () =>
                _DOM__WEBPACK_IMPORTED_MODULE_2__['DOM'].toggleEl(
                  document.querySelector('.fileNameTip')
                )
              )
            // 输入框获得焦点时自动选择文本（文件名输入框例外）
            const centerInputs = this.form.querySelectorAll('input[type=text]')
            for (const el of centerInputs) {
              if (el.name !== 'userSetName') {
                el.addEventListener('focus', function() {
                  this.select()
                })
              }
            }
            // 把下拉框的选择项插入到文本框里
            this.insertValueToInput(
              this.form.pageInfoSelect,
              this.form.userSetName
            )
            this.insertValueToInput(
              this.form.fileNameSelect,
              this.form.userSetName
            )
          }
          getSetting(name) {
            const input = this.form[name]
          }
        }
        const settings = new Settings()
        const form = settings.form
        const optionClass = settings.optionClass

        /***/
      },

    /***/ './src/ts/modules/Store.ts':
      /*!*********************************!*\
  !*** ./src/ts/modules/Store.ts ***!
  \*********************************/
      /*! exports provided: store */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'store',
          function() {
            return store
          }
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        // 仓库

        // 存储抓取结果和状态
        class Store {
          constructor() {
            this.resultMeta = [] // 储存抓取结果的元数据。它可以根据每个作品需要下载多少张，生成每一张图片的信息
            this.result = [] // 储存抓取结果
            this.idList = [] // 储存从列表中抓取到的作品的 id
            this.rankList = {} // 储存作品在排行榜中的排名
            // 储存和下载有关的状态
            this.states = {
              allowWork: true,
              quickDownload: false,
              notAutoDownload: false // 抓取完成后，不自动开始下载
            }
            // 储存页面信息，用来生成文件名
            this.pageInfo = {
              pageTitle: '',
              pageUserName: '',
              pageUserID: '',
              pageTag: ''
            }
            const allowWorkTrue = [
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.crawlFinish,
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.crawlEmpty,
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.crawlError,
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadPause,
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadStop
            ]
            allowWorkTrue.forEach(type => {
              window.addEventListener(type, () => {
                this.states.allowWork = true
              })
            })
            const allowWorkFalse = [
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.crawlStart,
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadStart
            ]
            allowWorkFalse.forEach(type => {
              window.addEventListener(type, () => {
                this.states.allowWork = false
              })
            })
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.crawlStart,
              () => {
                this.resetResult()
              }
            )
            window.addEventListener(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.downloadComplete,
              () => {
                this.resetStates()
              }
            )
          }
          /*
     id - 其实是默认名，包含两部分：id + 序号，如 44920385_p0。动图只有 id 没有序号
     url - 图片大图的 url
     title - 作品的标题
     tags - 作品的 tag 列表
     tagsTranslated - 作品的 tag 列表，附带翻译后的 tag（如果有）
     user - 作品的画师名字
     userid - 作品的画师id
     fullWidth - 第一张图片的宽度
     fullHeight - 第一张图片的高度
     ext - 图片下载时使用的后缀名
     bmk - 作品的收藏数量
     date - 作品的创建日期，格式为 yyyy-MM-dd。如 2019-08-29
     type - 作品的类型，分为 illustration、manga、ugoira
     rank - 作品在排行榜中的排名
     ugoiraInfo - 当作品是动图时才有值，包含 frames（数组）和 mimeType（string）属性
     */
          assignResult(data) {
            // 图片详细信息的默认值
            const dataDefault = {
              idNum: 0,
              id: '',
              url: '',
              thumb: '',
              title: '',
              pageCount: 1,
              tags: [],
              tagsTranslated: [],
              user: '',
              userid: '',
              fullWidth: 0,
              fullHeight: 0,
              ext: '',
              bmk: 0,
              bookmarked: false,
              date: '',
              type: 0,
              rank: '',
              ugoiraInfo: null
            }
            return Object.assign(dataDefault, data)
          }
          // 添加每个图片的信息。只需要传递有值的属性
          addResult(data, pNo = 1) {
            // 添加元数据
            const result = this.assignResult(data)
            this.resultMeta.push(result)
            _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].fire(
              _EVT__WEBPACK_IMPORTED_MODULE_0__['EVT'].events.addResult,
              result
            )
            // 添加每一张图片的数据
            for (let i = 0; i < pNo; i++) {
              const result = this.assignResult(data)
              result.id = result.id + `_p${i}`
              result.url = result.url.replace('p0', 'p' + i)
              this.result.push(result)
            }
          }
          getRankList(index) {
            return this.rankList[index]
          }
          setRankList(id, rank) {
            this.rankList[id] = rank
          }
          resetResult() {
            this.resultMeta = []
            this.result = []
            this.idList = []
            this.rankList = {}
          }
          resetStates() {
            this.states.allowWork = true
            this.states.quickDownload = false
          }
        }
        const store = new Store()

        /***/
      },

    /***/ './src/ts/modules/Support.ts':
      /*!***********************************!*\
  !*** ./src/ts/modules/Support.ts ***!
  \***********************************/
      /*! no exports provided */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./Lang */ './src/ts/modules/Lang.ts'
        )
        /* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./EVT */ './src/ts/modules/EVT.ts'
        )
        /* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./API */ './src/ts/modules/API.ts'
        )

        // 辅助功能
        class Support {
          constructor() {
            this.newTag = '_xzNew350'
            this.checkConflict()
            this.supportListenHistory()
            this.listenPageSwitch()
            this.checkNew()
            this.showNew()
            _API__WEBPACK_IMPORTED_MODULE_2__['API'].updateToken()
          }
          // 处理和脚本版的冲突
          checkConflict() {
            // 标注自己
            window.sessionStorage.setItem('xz_pixiv_extension', '1')
            // 把脚本版的标记设置为 0，这样脚本版就不会运行
            window.sessionStorage.setItem('xz_pixiv_userscript', '0')
          }
          // 检查新版本
          async checkNew() {
            // 显示更新按钮
            const show = function() {
              const updateIco = document.querySelector(
                '.centerWrap_top_btn.update'
              )
              updateIco.style.display = 'inline-block'
            }
            // 读取上一次检查的时间，如果超过一小时则检查 GitHub 上的信息
            const lastTime = localStorage.getItem('xzUpdateTime')
            if (
              !lastTime ||
              new Date().getTime() - parseInt(lastTime) > 60 * 60 * 1000
            ) {
              // 获取最新的 releases 信息
              const latest = await fetch(
                'https://api.github.com/repos/xuejianxianzun/PixivBatchDownloader/releases/latest'
              )
              const latestJson = await latest.json()
              const latestVer = latestJson.name
              // 保存 GitHub 上的版本信息
              localStorage.setItem('xzGithubVer', latestVer)
              // 保存本次检查的时间戳
              localStorage.setItem(
                'xzUpdateTime',
                new Date().getTime().toString()
              )
            }
            // 获取本地扩展的版本号
            const manifest = await fetch(
              chrome.extension.getURL('manifest.json')
            )
            const manifestJson = await manifest.json()
            const manifestVer = manifestJson.version
            // 比较大小
            const latestVer = localStorage.getItem('xzGithubVer')
            if (latestVer && manifestVer < latestVer) {
              show()
            }
          }
          // 显示最近更新内容
          showNew() {
            if (
              window.location.host.includes('pixiv.net') &&
              !localStorage.getItem(this.newTag)
            ) {
              const whatIsNewHtml = `
      <div class="xz_new">
        <p class="title">Powerful Pixiv Downloader ${_Lang__WEBPACK_IMPORTED_MODULE_0__[
          'lang'
        ].transl('_最近更新')}</p>
        <p class="content">${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
          this.newTag
        )}</p>
        <button class="btn">${_Lang__WEBPACK_IMPORTED_MODULE_0__['lang'].transl(
          '_确定'
        )}</button>
      </div>`
              document.body.insertAdjacentHTML('afterbegin', whatIsNewHtml)
              const whatIsNewEl = document.querySelector('.xz_new')
              whatIsNewEl
                .querySelector('.btn')
                .addEventListener('click', () => {
                  localStorage.setItem(this.newTag, '1')
                  whatIsNewEl.parentNode.removeChild(whatIsNewEl)
                })
            }
          }
          // 使用无刷新加载的页面需要监听 url 的改变，这里为这些事件添加监听支持
          supportListenHistory() {
            const element = document.createElement('script')
            element.setAttribute('type', 'text/javascript')
            element.innerHTML = `
    let _wr = function (type) {
      let orig = history[type];
      return function () {
        let rv = orig.apply(this, arguments);
        let e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    `
            document.head.appendChild(element)
          }
          // 监听页面的无刷新切换。某些页面可以无刷新切换，这时需要进行一些处理
          listenPageSwitch() {
            // 绑定无刷新切换页面的事件，只绑定一次
            // pixiv 的后退使用 replaceState
            // pushState 判断从列表页进入作品页的情况，popstate 判断从作品页退回列表页的情况
            ;['pushState', 'popstate', 'replaceState'].forEach(item => {
              window.addEventListener(item, () => {
                _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].fire(
                  _EVT__WEBPACK_IMPORTED_MODULE_1__['EVT'].events.pageSwitch
                )
              })
            })
          }
        }
        new Support()

        /***/
      },

    /***/ './src/ts/modules/Tip.ts':
      /*!*******************************!*\
  !*** ./src/ts/modules/Tip.ts ***!
  \*******************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        // 显示自定义的提示
        class Tip {
          constructor() {
            this.tipEl = document.createElement('div') // tip 元素
            this.addTipEl()
          }
          // 显示提示
          addTipEl() {
            const tipHTML = `<div id="tip"></div>`
            document.body.insertAdjacentHTML('beforeend', tipHTML)
            this.tipEl = document.getElementById('tip')
            const tips = document.querySelectorAll('.has_tip')
            for (const el of tips) {
              for (const ev of ['mouseenter', 'mouseleave']) {
                el.addEventListener(ev, event => {
                  const e = event || window.event
                  const text = el.dataset.tip
                  this.showTip(text, {
                    type: ev === 'mouseenter' ? 1 : 0,
                    x: e.clientX,
                    y: e.clientY
                  })
                })
              }
            }
          }
          // 显示中间面板上的提示。参数 arg 指示鼠标是移入还是移出，并包含鼠标位置
          showTip(text, arg) {
            if (!text) {
              throw new Error('No tip text.')
            }
            if (arg.type === 1) {
              this.tipEl.innerHTML = text
              this.tipEl.style.left = arg.x + 30 + 'px'
              this.tipEl.style.top = arg.y - 30 + 'px'
              this.tipEl.style.display = 'block'
            } else if (arg.type === 0) {
              this.tipEl.style.display = 'none'
            }
          }
        }
        new Tip()

        /***/
      },

    /***/ './src/ts/modules/TitleBar.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/TitleBar.ts ***!
  \************************************/
      /*! exports provided: titleBar */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'titleBar',
          function() {
            return titleBar
          }
        )
        /* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./PageType */ './src/ts/modules/PageType.ts'
        )
        // 在标题栏上显示下载器工作状态

        class TitleBar {
          constructor() {
            /*
        本程序的状态会以 [string] 形式添加到 title 最前面，并闪烁提醒
        string 和含义列表如下：
        ↑ 抓取中
        → 等待下一步操作（搜索页）
        ▶ 可以开始下载
        ↓ 下载中
        ║ 下载暂停
        ■ 下载停止
        √ 下载完毕
          空格，当需要闪烁标题时使用
        */
            this.status = ['↑', '→', '▶', '↓', '║', '■', '√', ' ']
            this.timer = 0 // 修改 title 的定时器
          }
          // 检查标题里有没有本程序定义的状态字符
          haveStatus(status = '') {
            if (!status) {
              // 没有传递 status，则检查所有标记
              for (const status of this.status) {
                const str = `[${status}]`
                if (document.title.includes(str)) {
                  return true
                }
              }
            } else {
              // 检查指定标记
              const str = `[${status}]`
              return document.title.includes(str)
            }
            return false
          }
          // 重设 title
          reset() {
            const type = _PageType__WEBPACK_IMPORTED_MODULE_0__[
              'pageType'
            ].getPageType()
            clearInterval(this.timer)
            // 储存标题的 mete 元素。在某些页面不存在，有时也与实际上的标题不一致。
            const ogTitle = document.querySelector('meta[property="og:title"]')
            // 无刷新自动加载的页面里，og:title 标签是最早更新标题的，内容也一致。
            if (ogTitle && (type == 1 || type === 2)) {
              document.title = ogTitle.content
            } else {
              // 如果当前 title 里有状态提醒，则设置为状态后面的文字
              if (this.haveStatus()) {
                const index = document.title.indexOf(']')
                document.title = document.title.substr(
                  index + 1,
                  document.title.length
                )
              }
            }
          }
          // 修改title
          change(string) {
            const state = `[${string}]`
            // 如果 title 里没有状态，就添加状态
            if (!this.haveStatus()) {
              document.title = `${state} ${document.title}`
            } else {
              // 如果已经有状态了，则替换为新当前传入的状态
              document.title = document.title.replace(/\[.?\]/, state)
            }
            // 闪烁提醒，其实是把 [▶] 或 [→] 与空白 [ ] 来回切换
            if (string === '▶' || string === '→') {
              this.timer = window.setInterval(() => {
                if (this.haveStatus(string)) {
                  // 如果含有状态，就替换成空白
                  document.title = document.title.replace(state, '[ ]')
                } else {
                  if (this.haveStatus(' ')) {
                    // 如果含有空白，就替换成状态
                    document.title = document.title.replace('[ ]', state)
                  } else {
                    // 如果都没有，一般是页面切换了，标题被重置了，取消执行闪烁（此时也根本无法形成闪烁效果了）
                    clearInterval(this.timer)
                  }
                }
              }, 500)
            } else {
              clearInterval(this.timer)
            }
          }
        }
        const titleBar = new TitleBar()

        /***/
      },

    /***/ './src/ts/modules/langText.ts':
      /*!************************************!*\
  !*** ./src/ts/modules/langText.ts ***!
  \************************************/
      /*! exports provided: langText */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'langText',
          function() {
            return langText
          }
        )
        const langText = {
          _只下载已收藏: [
            '只下载已收藏',
            'ブックマークのみをダウンロードする',
            'Download only bookmarked works',
            '只下載已收藏'
          ],
          _只下载已收藏的提示: [
            '只下载已经收藏的作品',
            'ブックマークした作品のみをダウンロードする',
            'Download only bookmarked works',
            '只下載已經收藏的作品'
          ],
          _下载作品类型: [
            '下载作品类型',
            'ダウンロード作品の種類',
            'Download work type',
            '下載作品類型'
          ],
          _下载作品类型的提示Center: [
            '下载哪些类型的作品',
            'どの種類の作品をダウンロードしますか',
            'Which types of works to download',
            '下載哪些類型的作品'
          ],
          _多p下载前几张: [
            '设置作品张数',
            '作品ごとにダウンロードされた画像の数',
            'Number of images downloaded per work',
            '設定作品張數'
          ],
          _多p下载前几张提示: [
            '下载每个作品的前几张图片。默认值 0 表示全部下载。',
            '各作品の画像が最初の何枚をダウンロードしますか？ デフォルト値の 0 は、すべてをダウンロードします。',
            'Download the first few pictures of each piece. The default value of 0 means all downloads.',
            '下載每個作品的前幾張圖片。預設值 0 表示全部下載。'
          ],
          _不能含有tag: [
            '不能含有 tag',
            '指定した tagを除外する',
            'Exclude specified tag',
            '不能含有 tag'
          ],
          _排除tag的提示文字: [
            '您可在下载前设置要排除的tag，这样在下载时将不会下载含有这些tag的作品。不区分大小写；如需排除多个tag，请使用英文逗号分隔。请注意要排除的tag的优先级大于要包含的tag的优先级。',
            "ダウンロードする前に、除外する tagを設定できます。大文字と小文字を区別しない；複数の tagを設定する必要がある場合は、','で区切ってください。除外された tagは、含まれている tagよりも優先されます",
            "Before downloading, you can set the tag you want to exclude. Not case sensitive; If you need to set multiple tags, you can use ',' separated. The excluded tag takes precedence over the included tag",
            '您可在下載前設定要排除的tag，這樣在下載時將不會下載含有這些tag的作品。不區分大小寫；如需排除多個tag，請使用英文逗號分隔。請注意要排除的tag的優先等級大於要包含的tag的優先等級。'
          ],
          _设置了排除tag之后的提示: [
            '排除 tag：',
            ' tagを除外：',
            'Excludes tag: ',
            '排除 tag：'
          ],
          _必须含有tag: [
            '必须含有 tag',
            '必要な tag',
            'Must contain tag',
            '必須含有 tag'
          ],
          _必须tag的提示文字: [
            '您可在下载前设置作品里必须包含的tag，不区分大小写；如需包含多个tag，请使用英文逗号分隔。',
            "ダウンロードする前に、必要な tagを設定することができます。大文字と小文字を区別しない；複数の tagを設定する必要がある場合は、','で区切ってください。",
            "Before downloading, you can set the tag that must be included. Not case sensitive; If you need to set multiple tags, you can use ',' separated. ",
            '您可在下載前設定作品裡必須包含的tag，不區分大小寫；如需包含多個tag，請使用英文逗號分隔。'
          ],
          _设置了必须tag之后的提示: [
            '包含 tag：',
            ' tagを含める：',
            'Include tag: ',
            '包含 tag：'
          ],
          _筛选宽高的按钮文字: [
            '设置宽高条件',
            '幅と高さの条件を設定する',
            'Set the width and height',
            '設定寬高條件'
          ],
          _筛选宽高的按钮Title: [
            '在下载前，您可以设置要下载的图片的宽高条件。',
            'ダウンロードする前に、画像の幅と高さの条件を設定できます。',
            'Before downloading, you can set the width and height conditions of the pictures you want to download.',
            '在下載前，您可以設定要下載的圖片的寬高條件。'
          ],
          _设置宽高比例: [
            '设置宽高比例',
            '縦横比を設定する',
            'Set the aspect ratio',
            '設定寬高比例'
          ],
          _设置宽高比例Title: [
            '设置宽高比例，也可以手动输入宽高比',
            '縦横比を設定する、手動で縦横比を入力することもできる',
            'Set the aspect ratio, or manually type the aspect ratio',
            '設定寬高比，也可以手動輸入寬高比'
          ],
          _不限制: ['不限制', '無制限', 'not limited', '不限制'],
          _横图: ['横图', '横長', 'Horizontal', '橫圖'],
          _竖图: ['竖图', '縦長', 'Vertical', '豎圖'],
          _输入宽高比: [
            '宽高比 >=',
            '縦横比 >=',
            'Aspect ratio >=',
            '寬高比 >='
          ],
          _设置了宽高比之后的提示: [
            '宽高比：{}',
            '縦横比：{}',
            'Aspect ratio: {}',
            '寬高比：{}'
          ],
          _宽高比必须是数字: [
            '宽高比必须是数字',
            '縦横比は数値でなければなりません',
            'The aspect ratio must be a number',
            '寬高比必須是數字'
          ],
          _筛选宽高的提示文字: [
            '请输入最小宽度和最小高度，不会下载不符合要求的图片。',
            '最小幅と最小高さを入力してください。要件を満たしていない画像はダウンロードされません。',
            'Please type the minimum width and minimum height. Will not download images that do not meet the requirements',
            '請輸入最小寬度和最小高度，不會下載不符合要求的圖片。'
          ],
          _本次输入的数值无效: [
            '本次输入的数值无效',
            '無効な入力',
            'Invalid input',
            '本次輸入的數值無效'
          ],
          _设置了筛选宽高之后的提示文字p1: [
            '宽度 >= ',
            '幅 >= ',
            'Width >= ',
            '寬度 >= '
          ],
          _或者: [' 或者 ', ' または ', ' or ', ' 或是 '],
          _并且: [' 并且 ', ' そして ', ' and ', ' 並且 '],
          _高度设置: ['高度 >= ', '高さ >= ', 'height >= ', '高度 >= '],
          _个数: [
            '设置作品数量',
            '作品数を設定する',
            'Set the number of works',
            '設定作品數量'
          ],
          _页数: [
            '设置页面数量',
            'ページ数を設定する',
            'Set the number of pages',
            '設定頁面數量'
          ],
          _筛选收藏数的按钮文字: [
            '设置收藏数量',
            'ブックマークされた数を設定する',
            'Set the bookmarkCount conditions',
            '設定收藏數量'
          ],
          _筛选收藏数的按钮Title: [
            '在下载前，您可以设置对收藏数量的要求。',
            'ダウンロードする前に、ブックマークされた数の条件を設定することができます。',
            'Before downloading, You can set the requirements for the number of bookmarks.',
            '在下載前，您可以設定對收藏數量的要求。'
          ],
          _筛选收藏数Center: [
            '设置收藏数量',
            'ブックマークされた数を設定する',
            'Set the number of bookmarks',
            '設定收藏數量'
          ],
          _筛选收藏数的提示Center: [
            '如果作品的收藏数小于设置的数字，作品不会被下载。',
            '作品のブックマークされた数が設定された数字よりも少ない場合、作品はダウンロードされません。',
            'If the number of bookmarks of the work is less than the set number, the work will not be downloaded.',
            '如果作品的收藏數小於設定的數字，作品不會被下載。'
          ],
          _筛选收藏数的提示文字: [
            '请输入一个数字，如果作品的收藏数小于这个数字，作品不会被下载。',
            '数字を入力してください。 作品のブックマークされた数がこの数字より少ない場合、作品はダウンロードされません。',
            'Please type a number. If the number of bookmarks of the work is less than this number, the work will not be downloaded.',
            '請輸入一個數字，如果作品的收藏數小於這個數字，作品不會被下載。'
          ],
          _设置了筛选收藏数之后的提示文字: [
            '收藏数 >= ',
            'ブックマークの数 >= ',
            'Number of bookmarks >= ',
            '收藏數 >= '
          ],
          _本次任务已全部完成: [
            '本次任务已全部完成。',
            'このタスクは完了しました。',
            'This task has been completed.',
            '本次工作已全部完成'
          ],
          _本次任务条件: [
            '本次任务条件: ',
            'このタスクの条件：',
            'This task condition: ',
            '本次工作條件：'
          ],
          _参数不合法: [
            '参数不合法，本次操作已取消。',
            'パラメータは有効ではありません。この操作はキャンセルされました。',
            'Parameter is not legal, this operation has been canceled.',
            '參數不合法，本次動作已取消。'
          ],
          _checkWantPageRule1Arg3: [
            '从本页开始下载-num-个作品',
            'このページから-num-枚の作品をダウンロード。',
            'Download -num- works from this page.',
            '從本頁開始下載-num-個作品'
          ],
          _checkWantPageRule1Arg4: [
            '向下获取所有作品',
            'このページからすべての作品をダウンロードする。',
            'download all the work from this page.',
            '向下取得所有作品'
          ],
          _checkWantPageRule1Arg8: [
            '从本页开始下载<br>如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
            'このページからダウンロードする<br>ダウンロードするページを設定する場合は、1から始まる数字を入力してください。 1は現在のページのみをダウンロードする。',
            'Download from this page<br>If you want to set the number of pages to download, type a number starting at 1. This page is 1.',
            '從本頁開始下載<br>如果要限制下載的頁數，請輸入從1開始的數字，1為僅下載本頁。'
          ],
          _checkWantPageRule1Arg6: [
            '从本页开始下载-num-页',
            '現在のページから-num-ページをウンロードします',
            'download -num- pages from the current page',
            '從本頁開始下載-num-頁'
          ],
          _checkWantPageRule1Arg7: [
            '下载所有页面',
            'すべてのページをダウンロードする',
            'download all pages',
            '下載所有頁面'
          ],
          _checkWantPageRule1Arg9: [
            '下载 -num- 个相关作品',
            '関連作品 -num- 枚をダウンロードする。',
            'download -num- related works.',
            '下載 -num- 個相關作品'
          ],
          _checkWantPageRule1Arg10: [
            '下载所有相关作品',
            '関連作品をすべてダウンロードする。',
            'download all related works.',
            '下載所有相關作品'
          ],
          _checkWantPageRule1Arg11: [
            '下载推荐作品',
            'お勧め作品をダウンロードする',
            'download recommend works',
            '下載推薦作品'
          ],
          _checkWantPageRule1Arg12: [
            '下载排行榜前 -num- 个作品',
            'キング前 -num- 位の作品をダウンロードする。',
            'download the top -num- works in the ranking list',
            '下載排行榜前 -num- 個作品'
          ],
          _请输入最低收藏数和要抓取的页数: [
            '请输入最低收藏数和要抓取的页数，用英文逗号分开。\n类似于下面的形式: \n1000,1000',
            "ボックマークの最小数とクロールするページ数を，','で区切って入力してください。\n例えば：\n1000,1000",
            "Please type the minimum number of bookmarks, and the number of pages to be crawled, separated by ','.\nE.g:\n1000,1000",
            '請輸入最低收藏數和要擷取的頁數，用英文逗號分開。\n類似於下面的形式: \n1000,1000'
          ],
          _wantPage弹出框文字PageType10: [
            '您想要下载多少页？请输入数字。\r\n当前模式下，列表页的页数最多只有',
            'ダウンロードしたいページ数を入力してください。 \r\n最大値：',
            'Please type the number of pages you want to download.\r\n The maximum value is ',
            '您想要下載多少頁？請輸入數字。\r\n目前模式下，清單頁的頁數最多只有'
          ],
          _输入超过了最大值: [
            '您输入的数字超过了最大值',
            '入力した番号が最大値を超えています',
            'The number you entered exceeds the maximum',
            '您輸入的數字超過了最大值'
          ],
          _任务开始1: [
            '从本页开始下载{}页',
            'このページから{}ページをダウンロードする',
            'download {} pages from this page',
            '從本頁開始下載{}頁'
          ],
          _任务开始0: [
            '任务开始',
            'タスクが開始されます',
            'Task starts',
            '工作開始'
          ],
          _checkNotdownTypeAll: [
            '由于您排除了所有作品类型，本次任务已取消。',
            'すべての種類の作品を除外したため、タスクはキャンセルされました。',
            'Because you excluded all types of work, the task was canceled.',
            '由於您排除了所有作品類型，本次工作已取消。'
          ],
          _checkNotdownTypeResult: [
            '排除作品类型：',
            'これらのタイプの作品を除外します：',
            'Excludes these types of works: ',
            '排除作品類型：'
          ],
          _多图作品: [
            '多图作品',
            'マルチイメージ作品',
            'Multi-image works',
            '多圖作品'
          ],
          _多图作品设置: [
            '多图作品设置',
            'マルチイメージ設定',
            'Multi-image works',
            '多圖作品設定'
          ],
          _怎样下载多图作品: [
            '怎样下载多图作品？',
            'どのようにマルチイメージ作品をダウンロードしますか？',
            'How to download multi-image works?',
            '怎样下載多圖作品？'
          ],
          _不下载: [
            '不下载',
            'ダウンロードしない',
            'Do not download',
            '不下載'
          ],
          _全部下载: [
            '全部下载',
            '全部ダウンロードする',
            'Download all',
            '全部下載'
          ],
          _下载前几张图片: [
            '下载前几张图片：',
            '最初のいくつかの画像：',
            'First few images:',
            '下載前幾張圖片：'
          ],
          _不下载多图作品: [
            '不下载多图作品',
            'マルチイメージ作品をダウンロードしないでください',
            'Do not download multi-image works',
            '不下載多圖作品'
          ],
          _多图作品下载前n张图片: [
            '多图作品下载前 {} 张图片',
            'マルチイメージ作品は、最初の {} イメージをダウンロードします',
            'Multi-image works download the first {} images',
            '多圖作品下載前 {} 張圖片'
          ],
          _插画: ['插画 ', 'イラスト', 'Illustrations', '插畫 '],
          _漫画: ['漫画 ', '漫画', 'Manga', '漫畫 '],
          _动图: ['动图 ', 'うごイラ', 'Ugoira', '動圖 '],
          _动图保存格式: [
            '动图保存格式',
            'うごイラをどのタイプが保存するか',
            'Save the ugoira work as',
            '動圖儲存格式'
          ],
          _动图保存格式title: [
            '下载动图时，可以把它转换成视频文件',
            'うごイラをダウンロードするとき、動画に変換することができます。',
            'When you download a ugoira work, you can convert it to a video file.',
            '下載動圖時，可以將它轉換為影片檔案'
          ],
          _webmVideo: ['WebM 视频', 'WebM ビデオ', 'WebM video', 'WebM 視頻'],
          _gif: ['GIF 图片', 'GIF 画像', 'GIF picture', 'GIF 圖片'],
          _zipFile: ['Zip 文件', 'ZIP ファイル', 'Zip file', 'Zip 檔案'],
          _当前作品个数: [
            '当前有 {} 个作品 ',
            '今は{}枚の作品があります ',
            'There are now {} works ',
            '目前有 {} 個作品 '
          ],
          _排行榜进度: [
            '已抓取本页面第{}部分',
            'このページの第{}部がクロールされました',
            'Part {} of this page has been crawled',
            '已擷取本頁面第{}部分'
          ],
          _新作品进度: [
            '已抓取本页面 {} 个作品',
            'このページの {} つの作品をクロールしました',
            'This page has been crawled {} works',
            '已擷取本頁面 {} 個作品'
          ],
          _抓取多少个作品: [
            '抓取本页面 {} 个作品',
            'このページの「」つの作品をクロールします',
            'Crawl this page {} works',
            '擷取本頁面 {} 個作品'
          ],
          _相关作品抓取完毕: [
            '相关作品抓取完毕。包含有{}个作品，开始获取作品信息。',
            '関連作品はクロールされました。 {}作品を含み、その作品に関する情報の取得を開始します。',
            'The related works have been crawled. Contains {} works and starts getting information about the work.',
            '相關作品擷取完畢。包含有{}個作品，開始取得作品資訊。'
          ],
          _排行榜任务完成: [
            '本页面抓取完毕。<br>当前有{}个作品，开始获取作品信息。',
            'このページはクロールされ。<br>{}枚の作品があります。 作品情報の取得を開始します。',
            'This page is crawled and now has {} works.<br> Start getting the works for more information.',
            '本頁面擷取完畢。<br>目前有{}個作品，開始取得作品資訊。'
          ],
          _列表页抓取进度: [
            '已抓取列表页{}个页面',
            '{}のリストページを取得しました',
            'Has acquired {} list pages',
            '已擷取清單頁{}個頁面'
          ],
          _搜索页已抓取所有页面: [
            '已抓取本 tag 的所有页面，开始获取图片网址',
            '現在 tagの全ページを取得している、画像URLの取得が開始されます',
            'Gets all pages of the current tag, starts to get the image URL',
            '已擷取本 tag 的所有頁面，開始取得圖片網址'
          ],
          _列表页抓取完成: [
            '列表页面抓取完成，开始获取图片网址',
            'リストページがクロールされ、画像URLの取得が開始されます',
            'The list page is crawled and starts to get the image URL',
            '清單頁面擷取完成，開始取得圖片網址'
          ],
          _抓取结果为零: [
            '抓取完毕，但没有找到符合筛选条件的作品。',
            'クロールは終了しましたが、フィルタ条件に一致する作品が見つかりませんでした。',
            'Crawl finished but did not find works that match the filter criteria.',
            '擷取完畢，但沒有找到符合篩選條件的作品。'
          ],
          _当前任务尚未完成: [
            '当前任务尚未完成',
            '現在のタスクはまだ完了していません',
            'The current task has not yet been completed',
            '目前工作尚未完成'
          ],
          _当前任务尚未完成2: [
            '当前任务尚未完成，请等待完成后再下载。',
            '現在のタスクはまだ完了していません',
            'The current task has not yet been completed',
            '目前工作尚未完成，請等待完成後再下載。'
          ],
          _列表抓取完成开始获取作品页: [
            '当前列表中有{}张作品，开始获取作品信息',
            '{}枚の作品があります。 作品情報の取得を開始します。',
            'Now has {} works. Start getting the works for more information.',
            '目前清單中有{}張作品，開始取得作品資訊'
          ],
          _开始获取作品页面: [
            '开始获取作品页面',
            '作品ページの取得を開始する',
            'Start getting the works page',
            '開始取得作品頁面'
          ],
          _无权访问2: [
            '无权访问 {}，跳过该作品。',
            '{} のアクセス権限がありません、作品を無視する。',
            'No access {}, skip.',
            '無權造訪 {}，跳過該作品。'
          ],
          _作品页状态码0: [
            '请求的url不可访问',
            '要求されたURLにアクセスできません',
            'The requested url is not accessible',
            '要求的url無法造訪'
          ],
          _作品页状态码400: [
            '该作品已被删除',
            '作品は削除されました',
            'The work has been deleted',
            '該作品已被刪除'
          ],
          _作品页状态码403: [
            '无权访问请求的url 403',
            'リクエストされたURLにアクセスできない 403',
            'Have no access to the requested url 403',
            '無權造訪要求的url 403'
          ],
          _作品页状态码404: [
            '404 not found',
            '404 not found',
            '404 not found',
            '404 not found'
          ],
          _抓取图片网址的数量: [
            '已获取 {} 个图片网址',
            '{} つの画像URLを取得',
            'Get {} image URLs',
            '已取得 {} 個圖片網址'
          ],
          _正在抓取: [
            '正在抓取，请等待……',
            '取得中、しばらくお待ちください...',
            'Getting, please wait...',
            '正在擷取，請等待……'
          ],
          _获取全部书签作品: [
            '获取全部书签作品，时间可能比较长，请耐心等待。',
            'ブックマークしたすべての作品を入手すると、時間がかかることがあります。お待ちください。',
            'Get all bookmarked works, the time may be longer, please wait.',
            '取得全部書籤作品，時間可能比較長，請耐心等待。'
          ],
          _抓取图片网址遇到中断: [
            '当前任务已中断!',
            '現在のタスクが中断されました。',
            'The current task has been interrupted.',
            '目前工作已中斷!'
          ],
          _关闭: ['关闭', 'クローズ', 'close', '關閉'],
          _输出信息: ['输出信息', '出力情報', 'Output information', '輸出資訊'],
          _复制: ['复制', 'コピー', 'Copy', '複製'],
          _已复制到剪贴板: [
            '已复制到剪贴板，可直接粘贴',
            'クリップボードにコピーされました',
            'Has been copied to the clipboard',
            '已複製至剪貼簿，可直接貼上'
          ],
          _下载设置: [
            '下载设置',
            'ダウンロード設定',
            'Download settings',
            '下載設定'
          ],
          _收起展开设置项: [
            '收起/展开设置项',
            '設定の折りたたみ/展開',
            'Collapse/expand settings',
            '摺疊/展開設定項目'
          ],
          _github: [
            'Github 页面，欢迎 star',
            'Githubのページ、starをクリックしてください',
            'Github page, if you like, please star it',
            'Github 頁面，歡迎 star'
          ],
          _wiki: ['使用手册', 'マニュアル', 'Wiki', 'Wiki'],
          _快捷键切换显示隐藏: [
            '使用 Alt + X，可以显示和隐藏下载面板',
            'Alt + Xを使用してダウンロードパネルを表示および非表示にする',
            'Use Alt + X to show and hide the download panel',
            '使用 Alt + X，可以顯示和隱藏下載面板'
          ],
          _共抓取到n个图片: [
            '共抓取到 {} 个图片',
            '合計 {} 枚の画像を取得し',
            'Crawl a total of {} pictures',
            '共擷取到 {} 個圖片'
          ],
          _设置文件名: [
            '设置命名规则',
            '命名規則を設定する',
            'Set naming rules',
            '設定命名規則'
          ],
          _设置文件夹名的提示: [
            `可以使用 '/' 建立文件夹<br>示例：{p_title}/{user}/{id}`,
            `フォルダーは '/'で作成できます<br>例：{p_title}/{user}/{id}`,
            `You can create a folder with '/'<br>Example：{p_title}/{user}/{id}`,
            `可以使用 '/' 建立資料夾<br>範例：{p_title}/{user}/{id}`
          ],
          _添加字段名称: [
            '添加字段名称',
            'フィールド名を追加',
            'Add field name',
            '加入欄位名稱'
          ],
          _添加字段名称提示: [
            '例如，在用户名前面添加“user_”标记',
            'たとえば、ユーザー名の前に "user_" tagを追加します。',
            'For example, add the "user_" tag in front of the username',
            '例如，在使用者名稱前面加入“user_”標記'
          ],
          _查看标记的含义: [
            '查看标记的含义',
            ' tagの意味を表示する',
            'View the meaning of the tag',
            '檢視標記的意義'
          ],
          _命名标记1: [
            '默认文件名，如 44920385_p0',
            'デフォルトのファイル名，例 44920385_p0',
            'Default file name, for example 44920385_p0',
            '預設檔案名稱，如 44920385_p0'
          ],
          _命名标记2: ['作品标题', '作品のタイトル', 'works title', '作品標題'],
          _命名标记3: [
            '作品的 tag 列表',
            '作品の tags',
            'The tags of the work',
            '作品的 tag 清單'
          ],
          _命名标记4: ['画师名字', 'アーティスト名', 'Artist name', '畫師名稱'],
          _命名标记6: ['画师 id', 'アーティスト ID', 'Artist id', '畫師 id'],
          _命名标记7: [
            '宽度和高度',
            '幅と高さ',
            'width and height',
            '寬度和高度'
          ],
          _命名标记8: [
            'bookmark-count，作品的收藏数。把它放在最前面可以让文件按收藏数排序。',
            'bookmark-count，作品のボックマークの数、前に追加することでボックマーク数に并べる。',
            'bookmark-count, bookmarks number of works.',
            'bookmark-count，作品的收藏數。將它放在最前面可以讓檔案依收藏數排序。'
          ],
          _命名标记9: [
            '数字 id，如 44920385',
            '44920385 などの番号 ID',
            'Number id, for example 44920385',
            '數字 id，如 44920385'
          ],
          _命名标记10: [
            '图片在作品内的序号，如 0、1、2 …… 每个作品都会重新计数。',
            '0、1、2 など、作品の画像のシリアル番号。各ピースは再集計されます。',
            'The serial number of the picture in the work, such as 0, 1, 2 ... Each work will be recounted.',
            '圖片在作品內的序號，如 0、1、2 …… 每個作品都將重新計數。'
          ],
          _命名标记11: [
            '作品的 tag 列表，附带翻译后的 tag（如果有）',
            '作品のtagリスト、翻訳付きtag(あれば)',
            'The tags of the work, with the translated tag (if any)',
            '作品的 tag 清單，附帶翻譯後的 tag（若有的話）'
          ],
          _命名标记12: [
            '作品的创建日期，格式为 yyyy-MM-dd。如 2019-08-29',
            '作品の作成日はyyyy-MM-ddの形式でした。 2019-08-29 など',
            'The date the creation of the work was in the format yyyy-MM-dd. Such as 2019-08-29',
            '作品的建立日期，格式為 yyyy-MM-dd。如 2019-08-29'
          ],
          _命名标记13: [
            '作品在排行榜中的排名。如 #1、#2 ……',
            'リーダーボードでの作品のランキング。 ＃1、＃2 など ...',
            'The ranking of the work in the ranking list. Such as #1, #2 ...',
            '作品在排行榜中的排名，如 #1、#2 ……'
          ],
          _命名标记14: [
            '作品类型，分为 illustration、manga、ugoira',
            '作品分類は、illustration、manga、ugoira',
            'The type of work, divided into illustration, manga, ugoira',
            '作品類型，分为 illustration、manga、ugoira'
          ],
          _命名标记提醒: [
            '您可以使用多个标记；建议在不同标记之间添加分割用的字符。示例：{id}-{userid}<br>一定要包含 {id} 或者 {id_num}。<br>* 在某些情况下，会有一些标记不可用。',
            '複数の tagを使用することができ；異なる tag間に別の文字を追加することができます。例：{id}-{userid}<br>必ず{id}または{id_num}を含めてください。<br>* 場合によっては、一部の tagが利用できず。',
            'You can use multiple tags, and you can add a separate character between different tags. Example: {id}-{userid}<br>Be sure to include {id} or {id_num}.<br>* In some cases, some tags will not be available.',
            '您可以使用多個標記；建議在不同標記之間加入分隔用的字元。範例：{id}-{userid}<br>一定要包含 {id} 或者 {id_num}。<br>* 在某些情況下，會有一些標記不可用。'
          ],
          _文件夹标记PUser: [
            '当前页面的画师名字',
            'アーティスト名',
            'Artist name of this page',
            '目前頁面的畫師名稱'
          ],
          _文件夹标记PUid: [
            '当前页面的画师id',
            'アーティストID',
            'Artist id of this page',
            '目前頁面的畫師id'
          ],
          _文件夹标记PTag: [
            '当前页面的 tag',
            '現在の tag',
            'Current tag',
            '目前頁面的 tag'
          ],
          _文件夹标记PTitle: [
            '当前页面的标题',
            'ページのタイトル',
            'The title of this page',
            '目前頁面的標題'
          ],
          _预览文件名: [
            '预览文件名',
            'ファイル名のプレビュー',
            'Preview file name',
            '預覽檔案名稱'
          ],
          _设置下载线程: [
            '设置下载线程',
            'ダウンロードスレッドを設定する',
            'Set the download thread',
            '設定下載執行緒'
          ],
          _线程数字: [
            '可以输入 1-5 之间的数字，设置同时下载的数量',
            '同時ダウンロード数を設定するには、1〜5 の数値を入力します',
            'You can type a number between 1-5 to set the number of concurrent downloads',
            '可以輸入 1-5 之間的數字，設定同時下載的數量'
          ],
          _下载按钮1: [
            '开始下载',
            'ダウンロードを開始',
            'start download',
            '開始下載'
          ],
          _下载按钮2: [
            '暂停下载',
            'ダウンロードを一時停止',
            'pause download',
            '暫停下載'
          ],
          _下载按钮3: [
            '停止下载',
            'ダウンロードを停止',
            'stop download',
            '停止下載'
          ],
          _下载按钮4: ['复制 url', 'URLをコピー', 'copy urls', '複製url'],
          _当前状态: ['当前状态 ', '現在の状態 ', 'Now state ', '目前狀態 '],
          _未开始下载: [
            '未开始下载',
            'まだダウンロードを開始していません',
            'Not yet started downloading',
            '未開始下載'
          ],
          _下载进度: [
            '下载进度：',
            'ダウンロードの進行状況：',
            'Download progress: ',
            '下載進度：'
          ],
          _下载线程: ['下载线程：', 'スレッド：', 'Thread: ', '下載執行緒：'],
          _常见问题: [
            '常见问题',
            'よくある質問',
            'Common problems',
            '常見問題'
          ],
          _uuid: [
            '如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。',
            'ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。',
            'If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.',
            '如果下載後的檔案名稱異常，請停用其他有下載功能的瀏覽器擴充功能。'
          ],
          _下载说明: [
            "下载的文件保存在浏览器的下载目录里。<br>请不要在浏览器的下载选项里选中'总是询问每个文件的保存位置'。<br><b>如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。</b><br>QQ群：675174717",
            'ダウンロードしたファイルは、ブラウザのダウンロードディレクトリに保存されます。<br><b>ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。</b>',
            'The downloaded file is saved in the browser`s download directory. <br><b>If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.</b>',
            "下載的檔案儲存在瀏覽器的下載目錄裡。<br>請不要在瀏覽器的下載選項裡選取'總是詢問每個檔案的儲存位置'。<br><b>如果下載後的檔案名稱異常，請停用其他有下載功能的瀏覽器擴充功能。</b><br>QQ群：675174717"
          ],
          _正在下载中: [
            '正在下载中',
            'ダウンロード中',
            'Downloading',
            '正在下載'
          ],
          _下载完毕: [
            '√ 下载完毕!',
            '√ ダウンロードが完了しました',
            '√ Download finished',
            '√ 下載完畢!'
          ],
          _已暂停: [
            '下载已暂停',
            'ダウンロードは一時停止中です',
            'Download is paused',
            '下載已暫停'
          ],
          _已停止: [
            '下载已停止',
            'ダウンロードが停止しました',
            'Download stopped',
            '下載已停止'
          ],
          _已下载: ['已下载', 'downloaded', 'downloaded', '已下載'],
          _抓取完毕: [
            '抓取完毕！',
            'クロールが終了しました！',
            'Crawl finished!',
            '擷取完畢！'
          ],
          _快速下载本页: [
            '快速下载本页作品',
            'この作品をすばやくダウンロードする',
            'Download this work quickly',
            '快速下載本頁作品'
          ],
          _从本页开始抓取new: [
            '从本页开始抓取新作品',
            'このページから新しい作品を入手する',
            'Crawl the new works from this page',
            '從本頁開始擷取新作品'
          ],
          _从本页开始抓取old: [
            '从本页开始抓取旧作品',
            'このページから古い作品を入手する',
            'Crawl the old works from this page',
            '從本頁開始擷取舊作品'
          ],
          _抓取推荐作品: [
            '抓取推荐作品',
            '推奨作品をダウンロードする',
            'Crawl the recommend works',
            '擷取推薦作品'
          ],
          _抓取推荐作品Title: [
            '抓取页面底部的的推荐作品',
            'ページの下部で推奨作品をクロールします',
            'Crawl the recommended works at the bottom of the page',
            '擷取頁面底部的推薦作品'
          ],
          _抓取相关作品: [
            '抓取相关作品',
            '関連作品をダウンロードする',
            'Crawl the related works',
            '擷取相關作品'
          ],
          _相关作品大于0: [
            ' （下载相关作品必须大于 0）',
            ' （ダウンロードする関連作品の数は0より大きくなければならない）',
            '  (Download related works must be greater than 0)',
            ' （下載相關作品必須大於 0）'
          ],
          _默认下载多页: [
            ', 如有多页，默认会下载全部。',
            '複数のページがある場合、デフォルトですべてをダウンロードされます。',
            ', If there are multiple pages, the default will be downloaded.',
            ', 如有多頁，預設會下載全部。'
          ],
          _调整完毕: [
            '调整完毕，当前有{}个作品。',
            '調整が完了し、今、{}の作品があります。',
            'The adjustment is complete and now has {} works.',
            '調整完畢，目前有{}個作品。'
          ],
          _抓取当前作品: [
            '抓取当前作品',
            '現在の作品をクロールする',
            'Crawl the current work',
            '擷取目前作品'
          ],
          _抓取当前作品Title: [
            '抓取当前列表里的所有作品',
            '現在のリスト内のすべての作品をクロールする',
            'Crawl all the works in the current list',
            '擷取目前清單裡的所有作品'
          ],
          _清除多图作品: [
            '清除多图作品',
            '複数の作品を削除する',
            'Remove multi-drawing works',
            '清除多圖作品'
          ],
          _清除多图作品Title: [
            '如果不需要可以清除多图作品',
            '必要がない場合は、複数のグラフを削除することができます',
            'If you do not need it, you can delete multiple graphs',
            '如果不需要可以清除多圖作品'
          ],
          _清除动图作品: [
            '清除动图作品',
            'うごイラ作品を削除する',
            'Remove ugoira work',
            '清除動圖作品'
          ],
          _清除动图作品Title: [
            '如果不需要可以清除动图作品',
            '必要がない場合は、うごイラを削除することができます',
            'If you do not need it, you can delete the ugoira work',
            '如果不需要可以清除動圖作品'
          ],
          _手动删除作品: [
            '手动删除作品',
            '作品を手動で削除する',
            'Manually delete the work',
            '手動刪除作品'
          ],
          _手动删除作品Title: [
            '可以在下载前手动删除不需要的作品',
            'ダウンロードする前に不要な作品を手動で削除することができます',
            'You can manually delete unwanted work before downloading',
            '可以在下載前手動刪除不需要的作品'
          ],
          _退出手动删除: [
            '退出手动删除',
            '削除モードを終了する',
            'Exit manually delete',
            '結束手動刪除'
          ],
          _抓取本页作品: [
            '抓取本页作品',
            'このページをクロールする',
            'Crawl this page works',
            '擷取本頁作品'
          ],
          _抓取本页作品Title: [
            '抓取本页列表中的所有作品',
            'このページをクロールする',
            'Crawl this page works',
            '擷取本頁清單中的所有作品'
          ],
          _抓取本排行榜作品: [
            '抓取本排行榜作品',
            'このリストの作品をクロールする',
            'Crawl the works in this list',
            '擷取本排行榜作品'
          ],
          _抓取本排行榜作品Title: [
            '抓取本排行榜的所有作品，包括现在尚未加载出来的。',
            'まだ読み込まれていないものを含めて、このリストの作品をダウンロードする',
            'Crawl all of the works in this list, including those that are not yet loaded.',
            '擷取本排行榜的所有作品，包括現在尚未載入出來的。'
          ],
          _抓取首次登场的作品: [
            '抓取首次登场作品',
            '初登場作品をダウンロードする',
            'Crawl the debut works',
            '擷取首次登場作品'
          ],
          _抓取首次登场的作品Title: [
            '只下载首次登场的作品',
            '初登場作品のみダウンロードします',
            'Download only debut works',
            '只下載首次登場的作品'
          ],
          _抓取该页面的图片: [
            '抓取该页面的图片',
            'ページの画像をクロールする',
            'Crawl the picture of the page',
            '擷取該頁面的圖片'
          ],
          _抓取相似图片: [
            '抓取相似图片',
            '類似の作品をクロールする',
            'Crawl similar works',
            '擷取相似圖片'
          ],
          _要获取的作品个数2: [
            '您想要获取多少个作品？',
            'いくつの作品をダウンロードしたいですか？',
            'How many works do you want to download?',
            '您想要取得多少個作品？'
          ],
          _数字提示1: [
            '-1, 或者大于 0',
            '-1、または0より大きい',
            '-1, or greater than 0',
            '-1, 或是大於 0'
          ],
          _下载大家的新作品: [
            '下载大家的新作品',
            'みんなの新作をダウンロードする',
            'Download everyone`s new work',
            '下載大家的新作品'
          ],
          _屏蔽设定: ['屏蔽設定', 'ミュート設定', 'Mute settings', '封鎖設定'],
          _举报: ['举报', '報告', 'Report', '回報'],
          _输入id进行抓取: [
            '输入id进行抓取',
            'IDを入力してダウンロードする',
            'Enter id to fetch',
            '輸入id進行擷取'
          ],
          _输入id进行抓取的提示文字: [
            '请输入作品id。如果有多个id，则以换行分割（即每行一个id）',
            'イラストレーターIDを入力してください。 複数のidがある場合は、1行に1つのidを付けます。',
            'Please type the illustration id. If there is more than one id, one id per line.',
            '請輸入作品id。如果有多個id，則以換行分隔（即每行一個id）'
          ],
          _开始抓取: [
            '开始抓取',
            'クロールを開始する',
            'Start crawling',
            '開始擷取'
          ],
          _添加tag: [
            '给未分类作品添加 tag',
            '未分類の作品にtagを追加',
            'Add tag to unclassified work',
            '幫未分類的作品加入 tag'
          ],
          _id不合法: [
            'id不合法，操作取消。',
            'idが不正な、操作はキャンセルされます。',
            'id is illegal, the operation is canceled.',
            'id不合法，動作取消。'
          ],
          _快速收藏: [
            '快速收藏',
            'クイックブックマーク',
            'Quick bookmarks',
            '快速收藏'
          ],
          _启用: ['启用', '有効にする', 'Enable', '啟用'],
          _是否自动下载: [
            '是否自动下载',
            '自動的にダウンロードするかどうか',
            'Whether to download automatically',
            '是否自動下載'
          ],
          _快速下载的提示: [
            '当“开始下载”状态可用时，自动开始下载，不需要点击下载按钮。',
            '「ダウンロードを開始する」ステータスが利用可能になると、ダウンロードは自動的に開始され、ダウンロードボタンをクリックする必要はありません。',
            'When the &quot;Start Downloa&quot; status is available, the download starts automatically and no need to click the download button.',
            '當“開始下載”狀態可用時，自動開始下載，不需要點選下載按鈕。'
          ],
          _转换任务提示: [
            '正在转换 {} 个文件',
            '{} ファイルの変換',
            'Converting {} files',
            '正在轉換 {} 個檔案'
          ],
          _最近更新: ['最近更新', '最近更新する', 'What`s new', '最近更新'],
          _确定: ['确定', '確定', 'Ok', '確定'],
          _file404: [
            '404 错误：文件 {} 不存在。',
            '404エラー：ファイル {} は存在しません。',
            '404 error: File {} does not exist.',
            '404 錯誤：檔案 {} 不存在。'
          ],
          _文件下载失败: [
            '文件 {} 下载失败',
            'ファイル {} のダウンロードに失敗しました',
            'File {} download failed',
            '檔案 {} 下載失败'
          ],
          _重置设置: ['重置设置', 'リセット設定', 'Reset Settings', '重設設定'],
          _是否重置设置: [
            '是否重置设置？',
            '設定をリセットしますか？',
            'Do you want to reset the settings?',
            '是否重設設定？'
          ],
          _newver: [
            '有新版本可用',
            '新しいバージョンがあります',
            'A new version is available',
            '有新版本可用'
          ],
          _xzNew350: [
            '可以在搜索页面预览结果了。',
            '検索ページで結果をプレビューできます。',
            'You can preview the results on the search page.',
            '可以在檢索頁面預覽結果了。'
          ],
          _快速下载建立文件夹: [
            '始终建立文件夹',
            'いつもフォルダを作成されます',
            'Always create folder',
            '總是建立資料夾'
          ],
          _快速下载建立文件夹提示: [
            '快速下载时，如果只有一张图片，也会建立文件夹',
            'すばやくダウンロードとき、イラストが一枚だけでも、フォルダも作成されます',
            'When downloading quickly, if there is only one picture, a folder is also created',
            '快速下載時，若只有一張圖片，也會建立資料夾'
          ],
          _设置id范围: [
            '设置 id 范围&nbsp;',
            'ID範囲を設定&nbsp;',
            'Set id range&nbsp;',
            '設定 id 範圍&nbsp;'
          ],
          _设置id范围提示: [
            '您可以输入一个作品 id，抓取比它新或者比它旧的作品',
            '1つの作品IDを入力することで、それより新しいあるいは古い作品をクロールことができます',
            'You can enter a work id and crawl works that are newer or older than it',
            '您可以輸入一個作品 id，擷取比它新或者比它舊的作品。'
          ],
          _大于: ['大于', 'より大きい', 'Bigger than', '大於'],
          _小于: ['小于', 'より小さい', 'Less than', '小於'],
          _设置投稿时间: [
            '设置投稿时间',
            '投稿日時を設定する',
            'Set posting date',
            '設定投稿時間'
          ],
          _设置投稿时间提示: [
            '您可以下载指定时间内发布的作品',
            '指定された時間内に配信された作品をダウンロードすることができます',
            'You can download works posted in a specified period of time',
            '您可以下載指定時間内發佈的作品'
          ],
          _时间范围: ['时间范围', '時間範囲', 'Time range', '時間范围'],
          _必须大于0: [
            '必须大于 0',
            '0 より大きくなければなりません',
            'must be greater than 0',
            '必須大於 0'
          ],
          _开始筛选: [
            '开始筛选',
            'スクリーニング開始',
            'Start screening',
            '開始篩選'
          ],
          _开始筛选Title: [
            '按照设置来筛选当前 tag 里的作品。',
            '現在のtagにある作品を設定によってスクリーニングする',
            'Screen the works in the current tag.',
            '按照設定來篩選當前 tag 裡的作品。'
          ],
          _在结果中筛选: [
            '在结果中筛选',
            '結果の中からスクリーニング',
            'Screen in results',
            '在結果中篩選'
          ],
          _在结果中筛选Title: [
            '您可以改变设置，并在结果中再次筛选。',
            '設定を変えて、結果の中で再びスクリーニングすることができます。',
            'You can change the settings and screen again in the results.',
            '您可以變更設定，并在結果中再次篩選。'
          ],
          _抓取筛选结果: [
            '抓取筛选结果',
            'スクリーニングの結果をクロールする',
            'Crawl the screening results',
            '擷取篩選結果'
          ],
          _尚未开始筛选: [
            '尚未开始筛选',
            'まだスクリーニングを開始していない',
            'Screening has not started',
            '尚未開始篩選'
          ],
          _没有数据可供使用: [
            '没有数据可供使用',
            '使用可能なデータはない',
            'No data is available.',
            '沒有資料可供使用'
          ],
          _预览搜索结果: [
            '预览搜索结果',
            '検索結果を見る',
            'Preview search results',
            '預覽搜尋結果'
          ],
          _预览搜索结果说明: [
            '下载器可以把符合条件的作品显示在当前页面上。如果抓取结果太多导致页面崩溃，请关闭这个功能。',
            'ローダは、該当する作品を現在のページに表示することができます。クロール結果が多すぎてページが崩れる場合は、この機能をオフにしてください。',
            'The downloader can display the qualified works on the current page. If too many crawling results cause the page to crash, turn off this feature.',
            '下載器可以將符合條件的作品顯示在目前頁面上。如果擷取結果太多導致頁面當掉，請關閉這個功能。'
          ]
        }

        /***/
      }

    /******/
  }
)
//# sourceMappingURL=content.js.map
