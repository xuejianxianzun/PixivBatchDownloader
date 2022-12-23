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

/***/ "./src/ts/background.ts":
/*!******************************!*\
  !*** ./src/ts/background.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 隐藏或显示浏览器底部的下载栏
chrome.runtime.onMessage.addListener((data, sender) => {
    if (data.msg === 'setShelfEnabled') {
        chrome.downloads.setShelfEnabled(data.value);
    }
});
// 当点击扩展图标时，显示/隐藏下载面板
chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {
        msg: 'click_icon',
    });
});
// 当扩展被安装、被更新、或者浏览器升级时，初始化数据
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ dlBatch: {}, dlIndex: {} });
});
// 存储每个下载任务的数据，这是因为下载完成的顺序和前台发送的顺序可能不一致，所以需要把数据保存起来以供使用
const dlData = {};
// 使用每个页面的 tabId 作为索引，储存此页面的批次编号。用来判断不同批次的下载
let dlBatch = {};
// 储存每个标签页所发送的下载请求的作品 id 列表，用来判断重复的任务
let dlIndex = {};
async function getData(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (data) => {
            resolve(data[key]);
        });
    });
}
// 封装 chrome.storage.local.set
async function setData(data) {
    return chrome.storage.local.set(data);
}
chrome.runtime.onMessage.addListener(async function (msg, sender) {
    // save_work_file 下载作品的文件
    if (msg.msg === 'save_work_file') {
        // 当处于初始状态时，或者变量被回收了，就从存储中读取数据储存在变量中
        // 之后每当要使用这两个数据时，从变量读取，而不是从存储中获得。这样就解决了数据不同步的问题，而且性能更高
        if (Object.keys(dlBatch).length === 0) {
            dlBatch = await getData('dlBatch');
            dlIndex = await getData('dlIndex');
        }
        const tabId = sender.tab.id;
        // 如果开始了新一批的下载，重设批次编号，并清空下载索引
        if (dlBatch[tabId] !== msg.taskBatch) {
            dlBatch[tabId] = msg.taskBatch;
            dlIndex[tabId] = [];
            setData({ dlBatch, dlIndex });
            console.log(dlBatch);
            // 这里存储数据时不需要使用 await，因为后面使用的是全局变量，所以不需要关心存储数据的同步问题
        }
        // 检查任务是否重复，不重复则下载
        if (!dlIndex[tabId].includes(msg.id)) {
            // 储存该任务的索引
            dlIndex[tabId].push(msg.id);
            setData({ dlIndex });
            console.log(dlIndex);
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
            const idIndex = dlIndex[data.tabId].findIndex((val) => val === data.id);
            dlIndex[data.tabId][idIndex] = '';
            setData({ dlIndex });
        }
        // 返回信息
        if (msg) {
            chrome.tabs.sendMessage(data.tabId, { msg, data, err });
            // 清除这个任务的数据
            dlData[detail.id] = null;
        }
    }
});


/***/ })

/******/ });
//# sourceMappingURL=background.js.map