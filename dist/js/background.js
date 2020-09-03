/******/ ;(function (modules) {
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
      /******/ exports: {},
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
  /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      })
      /******/
    }
    /******/
  } // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function (exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module',
      })
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true })
    /******/
  } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (
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
      value: value,
    })
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key]
          }.bind(null, key)
        )
    /******/ return ns
    /******/
  } // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function (module) {
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
  /******/ /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  } // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = './src/ts/background.ts')
  )
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ './src/ts/background.ts':
      /*!******************************!*\
  !*** ./src/ts/background.ts ***!
  \******************************/
      /*! no static exports found */
      /***/ function (module, exports) {
        eval(
          "// 修改 responseHeaders 开始\r\nconst regex = /access-control-allow-origin/i;\r\nfunction removeMatchingHeaders(headers, regex) {\r\n    for (var i = 0, header; (header = headers[i]); i++) {\r\n        if (header.name.match(regex)) {\r\n            headers.splice(i, 1);\r\n            return;\r\n        }\r\n    }\r\n}\r\nfunction responseListener(details) {\r\n    removeMatchingHeaders(details.responseHeaders, regex);\r\n    details.responseHeaders.push({\r\n        name: 'access-control-allow-origin',\r\n        value: '*',\r\n    });\r\n    return { responseHeaders: details.responseHeaders };\r\n}\r\nchrome.webRequest.onHeadersReceived.addListener(responseListener, {\r\n    urls: ['*://*.pximg.net/*'],\r\n}, ['blocking', 'responseHeaders', 'extraHeaders']);\r\n// 修改 responseHeaders 结束\r\n// 当点击扩展图标时，切换显示/隐藏下载面板\r\nchrome.browserAction.onClicked.addListener(function (tab) {\r\n    // 打开下载面板\r\n    chrome.tabs.sendMessage(tab.id, {\r\n        msg: 'click_icon',\r\n    });\r\n});\r\n// 因为下载完成的顺序和发送顺序可能不一致，所以需要存储任务的数据\r\nlet dlData = {};\r\n// 储存下载任务的索引，用来判断重复的任务\r\nlet dlIndex = [];\r\n// 储存下载任务的批次编号，用来判断不同批次的下载\r\nlet dlBatch = [];\r\n// 接收下载请求\r\nchrome.runtime.onMessage.addListener(function (msg, sender) {\r\n    // 接收下载任务\r\n    if (msg.msg === 'send_download') {\r\n        const tabId = sender.tab.id;\r\n        // 如果开始了新一批的下载，重设批次编号，清空下载索引\r\n        if (dlBatch[tabId] !== msg.taskBatch) {\r\n            dlBatch[tabId] = msg.taskBatch;\r\n            dlIndex[tabId] = [];\r\n        }\r\n        // 检查任务是否重复，不重复则下载\r\n        if (!dlIndex[tabId].includes(msg.id)) {\r\n            // 储存该任务的索引\r\n            dlIndex[tabId].push(msg.id);\r\n            // 开始下载\r\n            chrome.downloads.download({\r\n                url: msg.fileUrl,\r\n                filename: msg.fileName,\r\n                conflictAction: 'overwrite',\r\n                saveAs: false,\r\n            }, (id) => {\r\n                // id 是 Chrome 新建立的下载任务的 id\r\n                dlData[id] = {\r\n                    url: msg.fileUrl,\r\n                    id: msg.id,\r\n                    tabId: tabId,\r\n                    uuid: false,\r\n                };\r\n            });\r\n        }\r\n    }\r\n});\r\n// 判断文件名是否变成了 UUID 格式。因为文件名处于整个绝对路径的中间，所以没加首尾标记 ^ $\r\nconst UUIDRegexp = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/;\r\n// 监听下载事件\r\nchrome.downloads.onChanged.addListener(function (detail) {\r\n    // 根据 detail.id 取出保存的数据\r\n    const data = dlData[detail.id];\r\n    if (data) {\r\n        let msg = '';\r\n        let err = '';\r\n        // 判断当前文件名是否正常。下载时必定会有一次 detail.filename.current 有值\r\n        if (detail.filename && detail.filename.current) {\r\n            const changedName = detail.filename.current;\r\n            if (changedName.endsWith('jfif') ||\r\n                changedName.match(UUIDRegexp) !== null) {\r\n                // 文件名是 UUID\r\n                data.uuid = true;\r\n            }\r\n        }\r\n        if (detail.state && detail.state.current === 'complete') {\r\n            msg = 'downloaded';\r\n        }\r\n        if (detail.error && detail.error.current) {\r\n            msg = 'download_err';\r\n            err = detail.error.current;\r\n            const idIndex = dlIndex[data.tabId].findIndex((val) => {\r\n                val === data.id;\r\n            });\r\n            dlIndex[data.tabId][idIndex] = ''; // 从任务列表里删除它，以便前台重试下载\r\n        }\r\n        // 返回信息\r\n        if (msg) {\r\n            chrome.tabs.sendMessage(data.tabId, { msg, data, err });\r\n            // 清除这个任务的数据\r\n            dlData[detail.id] = null;\r\n        }\r\n    }\r\n});\r\n\n\n//# sourceURL=webpack:///./src/ts/background.ts?"
        )

        /***/
      },

    /******/
  }
)
