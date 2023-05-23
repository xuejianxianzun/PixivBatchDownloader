/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/background.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/ManageFollowing.ts":
/*!***********************************!*\
  !*** ./src/ts/ManageFollowing.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 注意这是一个后台脚本
class ManageFollowing {
    constructor() {
        this.store = 'following';
        this.data = [];
        /**当状态为 locked 时，如果有新的任务，则将其放入等待队列 */
        this.queue = [];
        this.status = 'idle';
        this.updateTaskTabID = 0;
        this.load();
        chrome.runtime.onInstalled.addListener(async () => {
            // 每次更新或刷新扩展时尝试读取数据，如果数据不存在则设置数据
            const data = await chrome.storage.local.get(this.store);
            if (data[this.store] === undefined || Array.isArray(data[this.store]) === false) {
                this.storage();
            }
        });
        chrome.runtime.onMessage.addListener(async (msg, sender) => {
            if (msg.msg === 'requestFollowingData') {
                this.dispath(sender === null || sender === void 0 ? void 0 : sender.tab);
            }
            if (msg.msg === 'needUpdateFollowingData') {
                if (this.status === 'locked') {
                    // 查询上次执行更新任务的标签页还是否存在，如果不存在，
                    // 则改为让这次发起请求的标签页执行更新任务
                    const tabs = await this.findAllPixivTab();
                    const find = tabs.find(tab => tab.id === this.updateTaskTabID);
                    if (!find) {
                        this.updateTaskTabID = sender.tab.id;
                        console.log('改为让这次发起请求的标签页执行更新任务');
                    }
                    else {
                        // 如果上次执行更新任务的标签页依然存在，且状态锁定，则拒绝这次请求
                        console.log('上次执行更新任务的标签页依然存在，且状态锁定，拒绝这次请求');
                        return;
                    }
                }
                else {
                    this.updateTaskTabID = sender.tab.id;
                }
                this.status = 'locked';
                console.log('执行更新任务的标签页', this.updateTaskTabID);
                chrome.tabs.sendMessage(this.updateTaskTabID, {
                    msg: 'getFollowingData'
                });
            }
            if (msg.msg === 'changeFollowingData') {
                const task = msg.data;
                // 当前台获取新的关注列表完成之后，会发送此消息。
                // 如果发送消息的页面和发起请求的页面是同一个，则解除锁定状态
                if (task.action === 'set') {
                    if (sender.tab.id === this.updateTaskTabID) {
                        // set 操作不会被放入队列中，而且总是会被立即执行
                        // 这是因为在请求数据的过程中可能产生了其他操作，set 操作的数据可能已经是旧的了
                        // 所以需要先应用 set 里的数据，然后再执行其他操作，在旧数据的基础上进行修改
                        this.setData(task);
                        console.log('更新数据完成，解除锁定');
                        // 如果队列中没有等待的操作，则立即派发数据并储存数据
                        // 如果有等待的操作，则不派发和储存数据，因为稍后队列执行完毕后也会派发和储存数据
                        // 这是为了避免重复派发和储存数据，避免影响性能
                        if (this.queue.length === 0) {
                            this.dispath();
                            this.storage();
                        }
                        this.statusToIdle();
                        return;
                    }
                    else {
                        // 如果不是同一个页面，则这个 set 操作会被丢弃
                        return;
                    }
                }
                this.queue.push(task);
                this.executionQueue();
            }
        });
        this.checkDeadlock();
    }
    async load() {
        if (this.status !== 'idle') {
            return;
        }
        this.status = 'loading';
        const data = await chrome.storage.local.get(this.store);
        console.log(data);
        if (data[this.store] && Array.isArray(data[this.store])) {
            this.data = data[this.store];
            this.statusToIdle();
        }
        else {
            return setTimeout(() => {
                this.load();
            }, 500);
        }
        console.log('已加载关注用户列表数据', this.data);
    }
    /**向前台脚本派发数据
     * 可以指定向哪个 tab 派发
     * 如果未指定 tab，则向所有 pixiv 标签页派发
     */
    async dispath(tab) {
        if (tab === null || tab === void 0 ? void 0 : tab.id) {
            chrome.tabs.sendMessage(tab.id, {
                msg: 'dispathFollowingData',
                data: this.data
            });
        }
        else {
            console.log('向所有标签页派发数据');
            const tabs = await this.findAllPixivTab();
            for (const tab of tabs) {
                console.log(tab);
                chrome.tabs.sendMessage(tab.id, {
                    msg: 'dispathFollowingData',
                    data: this.data
                });
            }
        }
    }
    storage() {
        return chrome.storage.local.set({ following: this.data });
    }
    /**执行队列中的所有操作 */
    executionQueue() {
        if (this.status !== 'idle' || this.queue.length === 0) {
            return;
        }
        console.log('队列中的操作数量', this.queue.length);
        while (this.queue.length > 0) {
            // set 操作不会在此处执行
            const queue = this.queue.shift();
            if (queue.action === 'add') {
                this.addData(queue);
            }
            else if (queue.action === 'remove') {
                this.removeData(queue);
            }
        }
        // 队列中的所有操作完成后一次性派发和储存数据
        this.dispath();
        this.storage();
    }
    setData(task) {
        const index = this.data.findIndex((following) => following.user === task.user);
        if (index > -1) {
            this.data[index].following = task.IDList;
            this.data[index].privateTotal = task.privateTotal;
            this.data[index].publicTotal = task.publicTotal;
            this.data[index].time = new Date().getTime();
        }
        else {
            this.data.push({
                user: task.user,
                following: task.IDList,
                privateTotal: task.privateTotal,
                publicTotal: task.publicTotal,
                time: new Date().getTime(),
            });
        }
    }
    addData(task) {
        const index = this.data.findIndex((following) => following.user === task.user);
        if (index === -1) {
            return;
        }
        this.data[index].following = this.data[index].following.concat(task.IDList);
        this.data[index].privateTotal = task.privateTotal;
        this.data[index].publicTotal = task.publicTotal;
        this.data[index].time = new Date().getTime();
    }
    removeData(task) {
        const index = this.data.findIndex((following) => following.user === task.user);
        if (index === -1) {
            return;
        }
        for (const id of task.IDList) {
            const i = this.data[index].following.findIndex(str => str === id);
            if (i > -1) {
                this.data[index].following.splice(i, 1);
            }
        }
        this.data[index].privateTotal = task.privateTotal;
        this.data[index].publicTotal = task.publicTotal;
        this.data[index].time = new Date().getTime();
    }
    async findAllPixivTab() {
        const tabs = await chrome.tabs.query({
            url: 'https://*.pixiv.net/*'
        });
        return tabs;
    }
    statusToIdle() {
        this.status = 'idle';
        this.executionQueue();
    }
    /**解除死锁
     * 一个标签页在执行更新任务时可能会被用户关闭，这会导致锁死
     * 定时检查执行更新任务的标签页是否还存在，如果不存在则解除死锁
     */
    checkDeadlock() {
        setInterval(async () => {
            if (this.status === 'locked') {
                const tabs = await this.findAllPixivTab();
                const find = tabs.find(tab => tab.id === this.updateTaskTabID);
                if (!find) {
                    console.log('解除死锁');
                    this.statusToIdle();
                }
            }
        }, 30000);
    }
}
new ManageFollowing();


/***/ }),

/***/ "./src/ts/background.ts":
/*!******************************!*\
  !*** ./src/ts/background.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ManageFollowing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageFollowing */ "./src/ts/ManageFollowing.ts");
/* harmony import */ var _ManageFollowing__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ManageFollowing__WEBPACK_IMPORTED_MODULE_0__);

// 隐藏或显示浏览器底部的下载栏
chrome.runtime.onMessage.addListener((data, sender) => {
    if (data.msg === 'setShelfEnabled') {
        chrome.downloads.setShelfEnabled(data.value);
    }
});
// 当点击扩展图标时，显示/隐藏下载面板
chrome.action.onClicked.addListener(function (tab) {
    // 在本程序没有权限的页面上点击扩展图标时，url 始终是 undefined，此时不发送消息
    if (!tab.url) {
        return;
    }
    chrome.tabs.sendMessage(tab.id, {
        msg: 'click_icon',
    });
});
// 当扩展被安装、被更新、或者浏览器升级时，初始化数据
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ batchNo: {}, idList: {} });
});
// 存储每个下载任务的数据，这是因为下载完成的顺序和前台发送的顺序可能不一致，所以需要把数据保存起来以供使用
const dlData = {};
// 使用每个页面的 tabId 作为索引，储存此页面里当前下载任务的编号。用来判断不同批次的下载
let batchNo = {};
// 使用每个页面的 tabId 作为索引，储存此页面里所发送的下载请求的作品 id 列表，用来判断重复的任务
let idList = {};
// batchNo 和 idList 需要持久化存储（但是当浏览器关闭并重新启动时可以清空，因为此时前台的下载任务必然和浏览器关闭之前的不是同一批了，所以旧的数据已经没用了）
// 如果不进行持久化存储，如果前台任务处于下载途中，后台 SW 被回收了，那么变量也会被清除。之后前台传递过来的可能还是同一批下载里的任务，但是后台却丢失了记录。这可能会导致下载出现重复文件等异常。
// 实际上，下载时后台 SW 会持续存在很长时间，不会轻易被回收的。持久化存储只是为了以防万一
// 封装 chrome.storage.local.set。不需要等待回调
async function setData(data) {
    return chrome.storage.local.set(data);
}
chrome.runtime.onMessage.addListener(async function (msg, sender) {
    // save_work_file 下载作品的文件
    if (msg.msg === 'save_work_file') {
        // 当处于初始状态时，或者变量被回收了，就从存储中读取数据储存在变量中
        // 之后每当要使用这两个数据时，从变量读取，而不是从存储中获得。这样就解决了数据不同步的问题，而且性能更高
        if (Object.keys(batchNo).length === 0) {
            const data = await chrome.storage.local.get(['batchNo', 'idList']);
            batchNo = data.batchNo;
            idList = data.idList;
        }
        const tabId = sender.tab.id;
        // 如果开始了新一批的下载，重设批次编号，并清空下载索引
        if (batchNo[tabId] !== msg.taskBatch) {
            batchNo[tabId] = msg.taskBatch;
            idList[tabId] = [];
            setData({ batchNo, idList });
            // 这里存储数据时不需要使用 await，因为后面使用的是全局变量，所以不需要关心存储数据的同步问题
        }
        // 检查任务是否重复，不重复则下载
        if (!idList[tabId].includes(msg.id)) {
            // 储存该任务的索引
            idList[tabId].push(msg.id);
            setData({ idList });
            // 开始下载
            chrome.downloads.download({
                url: msg.fileUrl,
                filename: msg.fileName,
                conflictAction: 'overwrite',
                saveAs: false,
            }, (id) => {
                // id 是 Chrome 新建立的下载任务的 id
                // 使用下载任务的 id 作为 key 保存数据
                const data = {
                    url: msg.fileUrl,
                    id: msg.id,
                    tabId: tabId,
                    uuid: false,
                };
                dlData[id] = data;
            });
        }
    }
    // save_description_file 下载作品的简介文件，不需要返回下载状态
    // save_novel_cover_file 下载小说的封面图片
    if (msg.msg === 'save_description_file' ||
        msg.msg === 'save_novel_cover_file' ||
        msg.msg === 'save_novel_embedded_image') {
        chrome.downloads.download({
            url: msg.fileUrl,
            filename: msg.fileName,
            conflictAction: 'overwrite',
            saveAs: false,
        });
    }
});
// 判断文件名是否变成了 UUID 格式。因为文件名处于整个绝对路径的中间，所以没加首尾标记 ^ $
const UUIDRegexp = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/;
// 监听下载变化事件
// 每个下载会触发两次 onChanged 事件
chrome.downloads.onChanged.addListener(async function (detail) {
    // 根据 detail.id 取出保存的数据
    const data = dlData[detail.id];
    if (data) {
        let msg = '';
        let err = '';
        // 判断当前文件名是否正常。下载时必定会有一次 detail.filename.current 有值
        if (detail.filename && detail.filename.current) {
            const changedName = detail.filename.current;
            if (changedName.match(UUIDRegexp) !== null) {
                // 文件名是 UUID
                data.uuid = true;
            }
        }
        if (detail.state && detail.state.current === 'complete') {
            msg = 'downloaded';
        }
        if (detail.error && detail.error.current) {
            msg = 'download_err';
            err = detail.error.current;
            // 当保存一个文件出错时，从任务记录列表里删除它，以便前台重试下载
            const idIndex = idList[data.tabId].findIndex((val) => val === data.id);
            idList[data.tabId][idIndex] = '';
            setData({ idList });
        }
        // 返回信息
        if (msg) {
            chrome.tabs.sendMessage(data.tabId, { msg, data, err });
            // 清除这个任务的数据
            dlData[detail.id] = null;
        }
    }
});
// 清除不需要的数据，避免数据体积越来越大
async function clearData() {
    for (const key of Object.keys(idList)) {
        const tabId = parseInt(key);
        try {
            await chrome.tabs.get(tabId);
        }
        catch (error) {
            // 如果建立下载任务的标签页已经不存在，则会触发错误，如：
            // Unchecked runtime.lastError: No tab with id: 1943988409.
            // 此时删除对应的数据
            delete idList[tabId];
            delete batchNo[tabId];
        }
    }
    setData({ batchNo, idList });
}
setInterval(() => {
    clearData();
}, 60000);


/***/ })

/******/ });
//# sourceMappingURL=background.js.map