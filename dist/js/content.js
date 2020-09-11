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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/content.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/content.ts":
/*!***************************!*\
  !*** ./src/ts/content.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_PageType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/PageType */ "./src/ts/modules/PageType.ts");
/* harmony import */ var _modules_DownloadButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/DownloadButton */ "./src/ts/modules/DownloadButton.ts");
/* harmony import */ var _modules_CenterPanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/CenterPanel */ "./src/ts/modules/CenterPanel.ts");
/* harmony import */ var _modules_InitPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/InitPage */ "./src/ts/modules/InitPage.ts");
/* harmony import */ var _modules_DownloadControl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/DownloadControl */ "./src/ts/modules/DownloadControl.ts");
/* harmony import */ var _modules_Tip__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/Tip */ "./src/ts/modules/Tip.ts");
/* harmony import */ var _modules_Tip__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_modules_Tip__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _modules_Output__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/Output */ "./src/ts/modules/Output.ts");
/* harmony import */ var _modules_Support__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/Support */ "./src/ts/modules/Support.ts");
/* harmony import */ var _modules_TitleBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/TitleBar */ "./src/ts/modules/TitleBar.ts");
/* harmony import */ var _modules_OutputCSV__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/OutputCSV */ "./src/ts/modules/OutputCSV.ts");
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












/***/ }),

/***/ "./src/ts/modules/API.ts":
/*!*******************************!*\
  !*** ./src/ts/modules/API.ts ***!
  \*******************************/
/*! exports provided: API */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API", function() { return API; });
class API {
    // 根据对象某个属性的值（视为数字）排序对象。返回的结果是降序排列
    static sortByProperty(propertyName) {
        return function (object1, object2) {
            // 排序的内容有时可能是字符串，需要转换成数字排序
            const value1 = parseInt(object1[propertyName]);
            const value2 = parseInt(object2[propertyName]);
            if (value2 < value1) {
                return -1;
            }
            else if (value2 > value1) {
                return 1;
            }
            else {
                return 0;
            }
        };
    }
    // 用正则过滤不安全的字符，（Chrome 和 Windows 不允许做文件名的字符）
    // 把一些特殊字符替换成全角字符
    static replaceUnsafeStr(str) {
        str = str.replace(this.unsafeStr, '');
        for (let index = 0; index < this.fullWidthDict.length; index++) {
            const rule = this.fullWidthDict[index];
            const reg = new RegExp(rule[0], 'g');
            str = str.replace(reg, rule[1]);
        }
        return str;
    }
    // 检查给定的字符串解析为数字后，是否大于 0
    static checkNumberGreater0(arg) {
        let num = parseInt(arg);
        // 空值会是 NaN
        if (!isNaN(num) && num > 0) {
            // 符合条件
            return {
                result: true,
                value: num,
            };
        }
        // 不符合条件
        return {
            result: false,
            value: 0,
        };
    }
    // 从 url 中获取指定的查询字段的值
    // 注意：返回值经过 encodeURIComponent 编码！
    static getURLSearchField(url, query) {
        const result = new URL(url).searchParams.get(query);
        if (result !== null) {
            return encodeURIComponent(result);
        }
        else {
            return '';
        }
    }
    // 从 url 中获取 tag
    static getTagFromURL(url) {
        const nowURL = new URL(url);
        // 2 用户作品列表页
        if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
            // 匹配 pathname 里用户 id 之后的字符
            const test = nowURL.pathname.match(/\/users\/\d+(\/.+)/);
            if (test && test.length === 2) {
                const str = test[1];
                // 如果用户 id 之后的字符多于一个路径，则把最后一个路径作为 tag，示例
                // https://www.pixiv.net/users/2188232/illustrations/ghostblade
                const array = str.split('/');
                // ["", "illustrations", "ghostblade"]
                if (array.length > 2) {
                    return array[array.length - 1];
                }
            }
        }
        // 4 旧版收藏页面
        if (nowURL.pathname === '/bookmark.php') {
            if (parseInt(this.getURLSearchField(nowURL.href, 'untagged')) === 1) {
                // 旧版 “未分类” tag 是个特殊标记
                // https://www.pixiv.net/bookmark.php?untagged=1
                return '未分類';
            }
        }
        // 4 新版收藏页面
        if (nowURL.pathname.includes('/bookmarks/')) {
            // 新版收藏页 url，tag 在路径末端，如
            // https://www.pixiv.net/users/9460149/bookmarks/artworks/R-18
            // https://www.pixiv.net/users/9460149/bookmarks/novels/R-18
            const test = /\/bookmarks\/\w*\/(.[^\/|^\?|^&]*)/.exec(nowURL.pathname);
            if (test !== null && test.length > 1 && !!test[1]) {
                return test[1];
            }
        }
        // 5 搜索页面
        if (nowURL.pathname.includes('/tags/')) {
            return nowURL.pathname.split('tags/')[1].split('/')[0];
        }
        // 默认情况，从查询字符串里获取，如下网址
        // https://www.pixiv.net/bookmark.php?tag=R-18
        return this.getURLSearchField(nowURL.href, 'tag');
    }
    // 更新 token
    static updateToken() {
        // 每隔一段时间更新 token，如果未达到指定时间间隔，则不检查
        const interval = 300000; // 两次检查之间的间隔。目前设置为 5 分钟
        const nowTime = new Date().getTime();
        const lastTimeStr = localStorage.getItem('xzTokenTime');
        const token = localStorage.getItem('xzToken');
        if (token &&
            lastTimeStr &&
            nowTime - Number.parseInt(lastTimeStr) < interval) {
            return;
        }
        // 从网页源码里获取用户 token，并储存起来
        fetch('https://www.pixiv.net/artworks/62751951')
            .then((response) => {
            return response.text();
        })
            .then((data) => {
            let result = data.match(/token":"(\w+)"/);
            if (result) {
                localStorage.setItem('xzToken', result[1]);
                localStorage.setItem('xzTokenTime', new Date().getTime().toString());
            }
            else {
                console.warn('UpdateToken failed: no token found!');
            }
        });
    }
    // 获取 token
    // 从本地存储里获取用户 token
    static getToken() {
        const token = localStorage.getItem('xzToken');
        if (token) {
            return token;
        }
        else {
            this.updateToken();
            return '';
        }
    }
    // 从 url 里获取 artworks id
    // 可以传入 url，无参数则使用当前页面的 url
    static getIllustId(url) {
        const str = url || window.location.search || location.href;
        if (str.includes('illust_id')) {
            // 传统 url
            return /illust_id=(\d*\d)/.exec(str)[1];
        }
        else if (str.includes('/artworks/')) {
            // 新版 url
            return /artworks\/(\d*\d)/.exec(str)[1];
        }
        else {
            // 直接取出 url 中的数字，不保证准确
            return /\d*\d/.exec(location.href)[0];
        }
    }
    // 从 url 里获取 novel id
    // https://www.pixiv.net/novel/show.php?id=12771688
    static getNovelId(url) {
        const str = url || window.location.search || location.href;
        const test = str.match(/\?id=(\d*)?/);
        return test[1];
    }
    // 通用的请求流程
    // 发送 get 请求，返回 json 数据，抛出异常
    static request(url) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'get',
                credentials: 'same-origin',
            })
                .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    // 第一种异常，请求成功但状态不对
                    reject({
                        status: response.status,
                        statusText: response.statusText,
                    });
                }
            })
                .then((data) => {
                resolve(data);
            })
                .catch((error) => {
                // 第二种异常，请求失败
                reject(error);
            });
        });
    }
    // 获取收藏数据
    // 这个 api 返回的作品列表顺序是按收藏顺序由近期到早期排列的
    static async getBookmarkData(id, type = 'illusts', tag, offset, hide = false) {
        const url = `https://www.pixiv.net/ajax/user/${id}/${type}/bookmarks?tag=${tag}&offset=${offset}&limit=100&rest=${hide ? 'hide' : 'show'}&rdm=${Math.random()}`;
        return this.request(url);
    }
    // 添加收藏
    static async addBookmark(type, id, tags, hide, token) {
        const restrict = hide ? 1 : 0;
        let body = {};
        if (type === 'illusts') {
            body = {
                comment: '',
                illust_id: id,
                restrict: restrict,
                tags: tags,
            };
        }
        else {
            body = {
                comment: '',
                novel_id: id,
                restrict: restrict,
                tags: tags,
            };
        }
        return fetch(`https://www.pixiv.net/ajax/${type}/bookmarks/add`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'x-csrf-token': token,
            },
            body: JSON.stringify(body),
        });
    }
    // 获取关注的用户列表
    static getFollowingList(id, rest = 'show', offset = 0, limit = 100, tag = '', lang = 'zh') {
        const url = `https://www.pixiv.net/ajax/user/${id}/following?offset=${offset}&limit=${limit}&rest=${rest}&tag=${tag}&lang=${lang}`;
        return this.request(url);
    }
    // 获取用户信息
    static getUserProfile(id) {
        // full=1 在画师的作品列表页使用，获取详细信息
        // full=0 在作品页内使用，只获取少量信息
        const url = `https://www.pixiv.net/ajax/user/${id}?full=1`;
        return this.request(url);
    }
    // 获取用户指定类型的作品列表
    // 返回作品的 id 列表，不包含详细信息
    static async getUserWorksByType(id, type = ['illusts', 'manga', 'novels']) {
        let typeSet = new Set(type);
        let result = [];
        const url = `https://www.pixiv.net/ajax/user/${id}/profile/all`;
        let data = await this.request(url);
        for (const type of typeSet.values()) {
            const idList = Object.keys(data.body[type]);
            for (const id of idList) {
                result.push({
                    type,
                    id,
                });
            }
        }
        return result;
    }
    // 获取用户指定类型、并且指定 tag 的作品列表
    // 返回整个请求的结果，里面包含作品的详细信息
    // 必须带 tag 使用。不带 tag 虽然也能获得数据，但是获得的并不全，很奇怪。
    static getUserWorksByTypeWithTag(id, type, tag, offset = 0, limit = 999999) {
        // https://www.pixiv.net/ajax/user/2369321/illusts/tag?tag=Fate/GrandOrder&offset=0&limit=9999999
        const url = `https://www.pixiv.net/ajax/user/${id}/${type}/tag?tag=${tag}&offset=${offset}&limit=${limit}`;
        return this.request(url);
    }
    // 获取插画 漫画 的详细信息
    static getArtworkData(id) {
        const url = `https://www.pixiv.net/ajax/illust/${id}`;
        return this.request(url);
    }
    // 获取作品的动图信息
    static getUgoiraMeta(id) {
        const url = `https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`;
        return this.request(url);
    }
    // 获取小说的详细信息
    static getNovelData(id) {
        const url = `https://www.pixiv.net/ajax/novel/${id}`;
        return this.request(url);
    }
    // 获取相关作品
    static getRelatedData(id) {
        // 最后的 18 是预加载首屏的多少个作品的信息，和下载并没有关系
        const url = `https://www.pixiv.net/ajax/illust/${id}/recommend/init?limit=18`;
        return this.request(url);
    }
    // 获取排行榜数据
    // 排行榜数据基本是一批 50 条作品信息
    static getRankingData(option) {
        let url = `https://www.pixiv.net/ranking.php?mode=${option.mode}&p=${option.p}&format=json`;
        // 把可选项添加到 url 里
        let temp = new URL(url);
        // 下面两项需要判断有值再添加。不可以添加了这些字段却使用空值。
        if (option.worksType) {
            temp.searchParams.set('content', option.worksType);
        }
        if (option.date) {
            temp.searchParams.set('date', option.date);
        }
        url = temp.toString();
        return this.request(url);
    }
    // 获取收藏后的相似作品数据
    // 需要传入作品 id 和要抓取的数量。但是实际获取到的数量会比指定的数量少一些
    static getRecommenderData(id, number) {
        const url = `/rpc/recommender.php?type=illust&sample_illusts=${id}&num_recommendations=${number}`;
        return this.request(url);
    }
    // 获取搜索数据
    static getSearchData(word, type = 'artworks', p = 1, option = {}) {
        // 基础的 url
        let url = `https://www.pixiv.net/ajax/search/${type}/${encodeURIComponent(word)}?word=${encodeURIComponent(word)}&p=${p}`;
        // 把可选项添加到 url 里
        let temp = new URL(url);
        for (const [key, value] of Object.entries(option)) {
            if (value) {
                temp.searchParams.set(key, value);
            }
        }
        url = temp.toString();
        return this.request(url);
    }
    static getNovelSearchData(word, p = 1, option = {}) {
        // 基础的 url
        let url = `https://www.pixiv.net/ajax/search/novels/${encodeURIComponent(word)}?word=${encodeURIComponent(word)}&p=${p}`;
        // 把可选项添加到 url 里
        let temp = new URL(url);
        for (const [key, value] of Object.entries(option)) {
            if (value) {
                temp.searchParams.set(key, value);
            }
        }
        url = temp.toString();
        return this.request(url);
    }
    // 获取大家的新作品的数据
    static getNewIllustData(option) {
        let url = `https://www.pixiv.net/ajax/illust/new?lastId=${option.lastId}&limit=${option.limit}&type=${option.type}&r18=${option.r18}`;
        return this.request(url);
    }
    // 获取大家的新作小说的数据
    static getNewNovleData(option) {
        let url = `https://www.pixiv.net/ajax/novel/new?lastId=${option.lastId}&limit=${option.limit}&r18=${option.r18}`;
        return this.request(url);
    }
    // 获取关注的的新作品的数据
    static getBookmarkNewIllustData(p = 1, r18 = false) {
        let path = r18 ? 'bookmark_new_illust_r18' : 'bookmark_new_illust';
        let url = `https://www.pixiv.net/${path}.php?p=${p}`;
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'get',
                credentials: 'same-origin',
            })
                .then((response) => {
                if (response.ok) {
                    return response.text();
                }
                else {
                    throw new Error(response.status.toString());
                }
            })
                .then((data) => {
                let listPageDocument = new DOMParser().parseFromString(data, 'text/html');
                let worksInfoText = listPageDocument.querySelector('#js-mount-point-latest-following').dataset.items;
                resolve(JSON.parse(worksInfoText));
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    // 根据 illustType，返回作品类型的描述
    // 主要用于储存进 idList
    static getWorkType(illustType) {
        switch (parseInt(illustType.toString())) {
            case 0:
                return 'illusts';
            case 1:
                return 'manga';
            case 2:
                return 'ugoira';
            case 3:
                return 'novels';
            default:
                return 'unknown';
        }
    }
    // 从 URL 中获取指定路径名的值，适用于符合 RESTful API 风格的路径
    // 如 https://www.pixiv.net/novel/series/1090654
    // 把路径用 / 分割，查找 key 所在的位置，后面一项就是它的 value
    static getURLPathField(query) {
        const pathArr = location.pathname.split('/');
        const index = pathArr.indexOf(query);
        if (index > 0) {
            return pathArr[index + 1];
        }
        throw new Error(`getURLPathField ${query} failed!`);
    }
    // 获取小说的系列作品信息
    // 这个 api 目前一批最多只能返回 30 个作品的数据，所以可能需要多次获取
    static getNovelSeriesData(series_id, limit = 30, last_order, order_by = 'asc') {
        const url = `https://www.pixiv.net/ajax/novel/series_content/${series_id}?limit=${limit}&last_order=${last_order}&order_by=${order_by}`;
        return this.request(url);
    }
    // 获取系列信息
    // 这个接口的数据结构里同时有 illust （包含漫画）和 novel 系列数据
    // 恍惚记得有插画系列来着，但是没找到对应的网址，难道是记错了？
    static getSeriesData(series_id, pageNo) {
        const url = `https://www.pixiv.net/ajax/series/${series_id}?p=${pageNo}`;
        return this.request(url);
    }
}
// 不安全的字符，这里多数是控制字符，需要替换掉
API.unsafeStr = new RegExp(/[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g);
// 一些需要替换成全角字符的符号，左边是正则表达式的字符
API.fullWidthDict = [
    ['\\\\', '＼'],
    ['/', '／'],
    [':', '：'],
    ['\\?', '？'],
    ['"', '＂'],
    ['<', '＜'],
    ['>', '＞'],
    ['\\*', '＊'],
    ['\\|', '｜'],
    ['~', '～'],
];



/***/ }),

/***/ "./src/ts/modules/BlackandWhiteImage.ts":
/*!**********************************************!*\
  !*** ./src/ts/modules/BlackandWhiteImage.ts ***!
  \**********************************************/
/*! exports provided: blackAndWhiteImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blackAndWhiteImage", function() { return blackAndWhiteImage; });
// 检查图片是否是黑白图片
class BlackAndWhiteImage {
    constructor() {
        this.latitude = 1; // 宽容度
    }
    async check(imgUrl) {
        const img = await this.loadImg(imgUrl).catch((error) => {
            console.log(error);
        });
        // 当加载图片失败时，无法进行判断，默认为彩色图片
        if (!img) {
            return false;
        }
        const first = this.getResult(this.getColor(img));
        return first;
        // 当判断结果是彩色图片的时候，基本不会是误判。但如果结果是黑白图，可能存在误判。
        // 因此，如果第一次判断是黑白的，可以考虑进行第二次检测，第二次只检测局部
    }
    // 加载图片
    async loadImg(url) {
        return new Promise(async (resolve, reject) => {
            const img = document.createElement('img');
            img.onload = () => resolve(img);
            img.onerror = () => {
                reject(new Error(`Load image error! url: ${url}`));
            };
            // 如果传递的时 blobURL 就直接使用，不是的话先获取图片
            if (url.startsWith('blob')) {
                img.src = url;
            }
            else {
                const res = await fetch(url).catch((error) => {
                    throw new Error(`Load image error! url: ${url}`);
                });
                const blob = await res.blob();
                const blobURL = URL.createObjectURL(blob);
                img.src = blobURL;
            }
        });
    }
    // 获取图片中 rgb 三色的平均值
    getColor(img) {
        const width = img.width;
        const height = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const con = canvas.getContext('2d');
        con.drawImage(img, 0, 0);
        const imageData = con.getImageData(0, 0, width, height);
        const data = imageData.data;
        let r = 0;
        let g = 0;
        let b = 0;
        // 取所有像素的平均值
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                r += data[(width * row + col) * 4];
                g += data[(width * row + col) * 4 + 1];
                b += data[(width * row + col) * 4 + 2];
            }
        }
        // 求取平均值
        r /= width * height;
        g /= width * height;
        b /= width * height;
        // 将最终的值取整
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        return [r, g, b];
    }
    // 根据 rgb 的值，判断是否是黑白图片
    getResult(rgb) {
        const [r, g, b] = rgb;
        // 如果 rgb 值相同则是黑白图片
        if (r === g && g === b) {
            return true;
        }
        else {
            // 如果 rgb 值不相同，则根据宽容度判断是否近似为黑白图片
            // 这是因为获取 rgb 的结果时，进行了四舍五入，即使 rgb 非常接近，也可能会相差 1（未论证）
            const max = Math.max(r, g, b); // 取出 rgb 中的最大值
            const min = max - this.latitude; // 允许的最小值
            // 如果 rgb 三个数值与最大的数值相比，差距在宽容度之内，则检查通过
            return [r, g, b].every((number) => {
                return number >= min;
            });
        }
    }
}
const blackAndWhiteImage = new BlackAndWhiteImage();



/***/ }),

/***/ "./src/ts/modules/BookmarkAllWorks.ts":
/*!********************************************!*\
  !*** ./src/ts/modules/BookmarkAllWorks.ts ***!
  \********************************************/
/*! exports provided: BookmarkAllWorks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BookmarkAllWorks", function() { return BookmarkAllWorks; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");





// 一键收藏本页面上的所有作品
class BookmarkAllWorks {
    constructor() {
        this.type = 'illusts'; // 页面是图片还是小说
        this.idList = [];
        this.addTagList = []; // 需要添加 tag 的作品的数据
        this.index = 0;
        this.workList = null;
        this.token = _API__WEBPACK_IMPORTED_MODULE_0__["API"].getToken();
        const btn = _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].addBtn('otherBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_收藏本页面的所有作品'));
        this.btn = btn;
    }
    // workList 是作品列表元素的合集。本模块会尝试分析每个作品元素中的超链接，提取出作品 id
    setWorkList(list) {
        if (!list) {
            alert(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_没有数据可供使用'));
            return;
        }
        this.workList = list;
        this.readyAddTag();
    }
    // 准备添加 tag
    async readyAddTag(loop = 0) {
        // 每次点击清空结果
        this.idList = [];
        this.addTagList = [];
        this.index = 0;
        this.token = _API__WEBPACK_IMPORTED_MODULE_0__["API"].getToken();
        this.btn.setAttribute('disabled', 'disabled');
        this.btn.textContent = `Checking`;
        if (window.location.pathname.includes('/novel')) {
            this.type = 'novels';
        }
        this.getIdList();
    }
    // 获取作品列表里的作品 id
    getIdList() {
        if (!this.workList) {
            return;
        }
        const regExp = this.type === 'illusts' ? /\/artworks\/(\d*)/ : /\?id=(\d*)/;
        for (const el of this.workList) {
            const a = el.querySelector('a');
            if (a) {
                // "https://www.pixiv.net/artworks/82618568"
                // "https://www.pixiv.net/novel/show.php?id=12350618"
                const test = regExp.exec(a.href);
                if (test && test.length > 1) {
                    this.idList.push(test[1]);
                }
            }
        }
        this.getTagData();
    }
    // 获取每个作品的详细信息，保存它们的 tag
    async getTagData() {
        this.btn.textContent = `Get data ${this.index} / ${this.idList.length}`;
        const id = this.idList[this.index];
        try {
            let data;
            // 发起请求
            if (this.type === 'novels') {
                data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelData(id);
            }
            else {
                data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(id);
            }
            const tagArr = data.body.tags.tags; // 取出 tag 信息
            const tags = []; // 保存 tag 列表
            for (const tagData of tagArr) {
                tags.push(tagData.tag);
            }
            this.addTagList.push({
                id: data.body.id,
                tags: tags,
                restrict: false,
            });
            this.index++;
            if (this.index === this.idList.length) {
                this.index = 0;
                return this.addTag();
            }
            this.getTagData();
        }
        catch (error) {
            this.getTagData();
        }
    }
    // 给所有作品添加 tag（即使之前收藏过的，也会再次收藏）
    async addTag() {
        this.btn.textContent = `Add bookmark ${this.index} / ${this.idList.length}`;
        const data = this.addTagList[this.index];
        // 如果设置了不启用快速收藏，则把 tag 设置为空
        if (_Settings__WEBPACK_IMPORTED_MODULE_4__["form"].quickBookmarks.checked === false) {
            data.tags = [];
        }
        await _API__WEBPACK_IMPORTED_MODULE_0__["API"].addBookmark(this.type, data.id, data.tags, data.restrict, this.token);
        this.index++;
        // 添加完毕
        if (this.index === this.addTagList.length) {
            this.btn.textContent = `✓ Complete`;
            this.btn.removeAttribute('disabled');
            return;
        }
        // 继续添加
        this.addTag();
    }
}



/***/ }),

/***/ "./src/ts/modules/BookmarksAddTag.ts":
/*!*******************************************!*\
  !*** ./src/ts/modules/BookmarksAddTag.ts ***!
  \*******************************************/
/*! exports provided: BookmarksAddTag */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BookmarksAddTag", function() { return BookmarksAddTag; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");


// 给收藏页面里的未分类作品批量添加 tag
class BookmarksAddTag {
    constructor(btn) {
        this.type = 'illusts'; // 页面是图片还是小说
        this.addTagList = []; // 需要添加 tag 的作品的数据
        this.once = 100; // 一次请求多少个作品的数据
        this.btn = btn;
        this.bindEvents();
    }
    bindEvents() {
        this.btn.addEventListener('click', () => {
            this.addTagList = []; // 每次点击清空结果
            this.btn.setAttribute('disabled', 'disabled');
            this.btn.textContent = `Checking`;
            if (window.location.pathname.includes('/novel')) {
                this.type = 'novels';
            }
            this.readyAddTag();
        });
    }
    // 准备添加 tag。loop 表示这是第几轮循环
    async readyAddTag(loop = 0) {
        const offset = loop * this.once; // 一次请求只能获取一部分，所以可能有多次请求，要计算偏移量
        // 发起请求
        const [showData, hideData] = await Promise.all([
            _API__WEBPACK_IMPORTED_MODULE_0__["API"].getBookmarkData(_DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].getUserId(), this.type, '未分類', offset, false),
            _API__WEBPACK_IMPORTED_MODULE_0__["API"].getBookmarkData(_DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].getUserId(), this.type, '未分類', offset, true),
        ]).catch((error) => {
            if (error.status && error.status === 403) {
                this.btn.textContent = `× Permission denied`;
            }
            throw new Error('Permission denied');
        });
        // 保存有用的数据
        for (const data of [showData, hideData]) {
            const works = data.body.works;
            // 如果作品的 bookmarkData 为假说明没有实际数据，可能是在获取别人的收藏数据。
            if (works.length > 0 && works[0].bookmarkData) {
                works.forEach((work) => {
                    this.addTagList.push({
                        id: work.id,
                        tags: work.tags,
                        restrict: work.bookmarkData.private,
                    });
                });
            }
        }
        // 已删除或无法访问的作品不会出现在请求结果里。本来一次请求 100 个，但返回的结果有可能会比 100 个少，甚至极端情况下是 0。所以实际获取到的作品可能比  total 数量少，这是正常的。
        // 判断是否请求了所有未分类的作品数据
        const total = offset + this.once;
        if (total >= showData.body.total && total >= hideData.body.total) {
            if (this.addTagList.length === 0) {
                // 如果结果为空，不需要处理
                this.btn.textContent = `✓ No need`;
                this.btn.removeAttribute('disabled');
                return;
            }
            else {
                // 开始添加 tag
                this.addTag(0, this.addTagList, _API__WEBPACK_IMPORTED_MODULE_0__["API"].getToken());
            }
        }
        else {
            // 需要继续获取
            this.readyAddTag(++loop);
        }
    }
    // 给未分类作品添加 tag
    async addTag(index, addList, tt) {
        const item = addList[index];
        await _API__WEBPACK_IMPORTED_MODULE_0__["API"].addBookmark(this.type, item.id, item.tags, item.restrict, tt);
        if (index < addList.length - 1) {
            index++;
            this.btn.textContent = `${index} / ${addList.length}`;
            // 继续添加下一个
            this.addTag(index, addList, tt);
        }
        else {
            this.btn.textContent = `✓ Complete`;
            this.btn.removeAttribute('disabled');
        }
    }
}



/***/ }),

/***/ "./src/ts/modules/CenterPanel.ts":
/*!***************************************!*\
  !*** ./src/ts/modules/CenterPanel.ts ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
/* harmony import */ var _ThemeColor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ThemeColor */ "./src/ts/modules/ThemeColor.ts");





// 中间面板
class CenterPanel {
    constructor() {
        this.centerPanel = document.createElement('div'); // 中间面板
        this.updateLink = document.createElement('a');
        this.updateActiveClass = 'updateActiveClass';
        this.addCenterPanel();
        _ThemeColor__WEBPACK_IMPORTED_MODULE_4__["themeColor"].register(this.centerPanel);
        this.bindEvents();
    }
    // 添加中间面板
    addCenterPanel() {
        const centerPanelHTML = `
      <div class="centerWrap beautify_scrollbar">
      <div class="centerWrap_head">
      <div class="centerWrap_title blue">
      Powerful Pixiv Downloader
      <div class="btns">
      <a class="has_tip centerWrap_top_btn update" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_newver')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank">
      <svg t="1574401457339" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4736" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M894.72 795.477333l-85.418667-85.418667c0.128-0.170667 0.170667-0.341333 0.298667-0.512l-158.890667-158.890667c0.042667-0.597333 37.248-37.248 37.248-37.248l178.773333 0 1.706667-1.493333c-0.853333-196.736-160.426667-356.053333-357.418667-356.053333-72.704 0-140.202667 22.016-196.650667 59.306667L228.949333 129.664C307.968 71.466667 405.333333 36.650667 511.018667 36.650667c263.296 0 476.757333 213.461333 476.757333 476.714667C987.776 619.093333 952.96 716.416 894.72 795.477333zM369.493333 476.117333c-0.042667 0.597333-37.248 37.248-37.248 37.248l-178.773333 0c0 197.461333 160.085333 357.546667 357.546667 357.546667 72.192 0 139.093333-21.76 195.285333-58.538667l85.589333 85.589333c-78.848 57.685333-175.701333 92.117333-280.874667 92.117333-263.296 0-476.757333-213.461333-476.757333-476.757333 0-105.173333 34.474667-202.069333 92.16-280.874667l85.589333 85.589333C211.925333 318.208 211.882667 318.336 211.797333 318.464L369.493333 476.117333z" p-id="4737"></path></svg>
      </a>
      <a class="has_tip centerWrap_top_btn" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_github')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank">
      <svg t="1574401005111" class="icon" widht="16" height="16" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2594" xmlns:xlink="http://www.w3.org/1999/xlink><defs><style type="text/css"></style></defs><path d="M0 520.886c0-69.368 13.51-135.697 40.498-199.02 26.987-63.323 63.322-117.826 109.006-163.51 45.65-45.65 100.154-81.985 163.51-109.006A502.289 502.289 0 0 1 512 8.92c69.335 0 135.663 13.477 198.986 40.497 63.356 26.988 117.86 63.323 163.51 109.007 45.684 45.65 82.02 100.154 109.006 163.51A502.289 502.289 0 0 1 1024 520.852c0 111.318-32.504 211.472-97.511 300.494-64.975 88.989-148.48 150.825-250.484 185.476-5.351 0-9.348-0.99-11.99-2.973-2.676-1.982-4.196-3.997-4.526-6.012a59.458 59.458 0 0 1-0.495-8.984 7.663 7.663 0 0 1-0.991-3.006v-128.99c0-40.63-14.336-75.314-43.008-103.986 76.667-13.345 134.011-41.819 171.999-85.487 37.987-43.669 57.013-96.52 57.013-158.522 0-58.005-18.663-108.346-56.022-150.99 13.345-42.678 11-87.668-6.97-135.003-18.697-1.322-39.011 1.85-61.01 9.513-22 7.663-38.318 14.831-49.02 21.47-10.637 6.673-20.316 13.016-28.97 19.027-38.68-10.669-81.854-16.02-129.486-16.02-47.7 0-90.509 5.351-128.529 16.02-7.333-5.35-15.855-11.164-25.5-17.507-9.68-6.342-26.493-14.005-50.507-22.99-23.982-9.018-45.65-12.85-65.008-11.495-18.663 47.996-20.645 93.646-5.979 136.984-36.665 42.678-54.998 92.986-54.998 150.99 0 62.002 18.663 114.689 55.99 157.994 37.326 43.339 94.67 72.01 171.998 86.016a142.303 142.303 0 0 0-39.969 70.029c-56.683 13.972-96.355 3.963-119.015-30.06-42.017-61.308-79.674-83.307-113.003-65.965-4.69 4.657-3.997 9.48 1.982 14.501 6.012 4.988 14.996 11.66 27.02 19.985 11.99 8.357 20.976 17.507 26.987 27.515 0.661 1.322 2.51 6.177 5.517 14.502a831.917 831.917 0 0 0 8.985 23.981c2.973 7.663 8.654 16.186 17.011 25.5 8.324 9.349 18.003 17.178 29.003 23.52 11 6.309 26.161 11 45.485 14.006 19.324 2.972 41.323 3.138 65.998 0.495v100.484c0 0.991-0.165 2.643-0.495 5.021-0.33 2.312-0.991 3.964-1.982 4.955-0.991 1.024-2.345 2.015-4.03 3.039a12.52 12.52 0 0 1-6.474 1.486c-2.676 0-6.012-0.33-10.009-0.99-101.343-35.345-183.825-97.182-247.51-185.51C31.842 731.037 0 631.577 0 520.92z" p-id="2595"></path></svg>
      </a>
      <a class="has_tip centerWrap_top_btn wiki_url" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_wiki')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank">
      <svg t="1574400169015" class="icon" widht="16" height="16" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1872" xmlns:xlink="http://www.w3.org/1999/xlink" width="17" height="16"><defs><style type="text/css"></style></defs><path d="M1044.286732 3.51978A1138.616836 1138.616836 0 0 0 618.841322 58.172364a198.963565 198.963565 0 0 0-26.814324 10.815324V1023.936004l0.895944-0.383976a979.52278 979.52278 0 0 1 443.236298-68.411724 47.741016 47.741016 0 0 0 51.580776-43.261296V50.172864a47.165052 47.165052 0 0 0-43.453284-46.653084z m-74.299356 632.15249h-224.369977V541.470158h224.369977v94.202112z m0-231.921504h-224.369977V309.484657h224.369977v94.266109zM469.154678 58.172364A1138.296856 1138.296856 0 0 0 43.645272 3.455784 47.421036 47.421036 0 0 0 0 50.172864V908.103244a46.653084 46.653084 0 0 0 15.35904 34.493844 48.060996 48.060996 0 0 0 36.285732 12.415224 980.610712 980.610712 0 0 1 443.300294 68.347728l0.895944 0.575964V68.7957a202.099369 202.099369 0 0 0-26.686332-10.751328zM351.146053 635.800262H126.776076V541.59815h224.369977v94.202112z m0-231.921504H126.776076V309.612649h224.369977v94.266109z" p-id="1873"></path></svg>
      </a>
        <div class="has_tip centerWrap_top_btn centerWrap_close" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_快捷键切换显示隐藏')}">
        <svg t="1574392276519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1123" data-spm-anchor-id="a313x.7781069.0.i0" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14"><defs><style type="text/css"></style></defs><path d="M521.693867 449.297067L111.4112 39.0144a51.2 51.2 0 1 0-72.430933 72.362667l410.282666 410.3168-410.282666 410.3168a51.2 51.2 0 1 0 72.3968 72.3968l410.3168-410.282667 410.3168 410.282667a51.2 51.2 0 1 0 72.3968-72.362667l-410.282667-410.350933 410.282667-410.282667a51.2 51.2 0 1 0-72.3968-72.3968l-410.282667 410.282667z" p-id="1124"></path></svg>
        </div>
      </div>
      </div>
      </div>

      <div class="centerWrap_con">
      <slot data-name="form"></slot>
      </div>

      <div class="gray1 bottom_help_bar"> 
      <a href="javascript:void()" class="showDownTip gray1">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_常见问题')}</a>
      <a class="gray1" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_wiki')}</a>
      <a class="gray1" href="javascript:void()" id="resetOption">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_重置设置')}</a>
      <a class="gray1" href="https://github.com/xuejianxianzun/PixivFanboxDownloader" target="_blank"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_fanboxDownloader')}</a>
      <a id="zanzhu" class="gray1 patronText" href="https://afdian.net/@xuejianxianzun" target="_blank">通过“爱发电”网站支持我</a>
      <a id="patreon" class="gray1 patronText" href="https://www.patreon.com/xuejianxianzun" target="_blank">Become a patron</a>
      <a class="gray1" href="https://discord.gg/eW9JtTK" target="_blank">Discord</a>
      <br>
      <p class="downTip tip"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载说明')}</p>
      </div>

      </div>
      `;
        document.body.insertAdjacentHTML('beforeend', centerPanelHTML);
        this.centerPanel = document.querySelector('.centerWrap');
        this.updateLink = this.centerPanel.querySelector('.update');
        const userLang = document.documentElement.lang;
        const donateId = ['zh', 'zh-CN', 'zh-Hans'].includes(userLang)
            ? 'zanzhu'
            : 'patreon';
        document.getElementById(donateId).style.display = 'inline-block';
    }
    bindEvents() {
        // 监听点击扩展图标的消息，开关中间面板
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg.msg === 'click_icon') {
                if (this.centerPanel.style.display === 'block') {
                    this.close();
                }
                else {
                    this.show();
                }
            }
        });
        // 关闭按钮
        document
            .querySelector('.centerWrap_close')
            .addEventListener('click', () => {
            this.close();
        });
        // 使用快捷键 Alt + x 切换中间面板显示隐藏
        window.addEventListener('keydown', (ev) => {
            if (ev.altKey && ev.keyCode === 88) {
                const nowDisplay = this.centerPanel.style.display;
                if (nowDisplay === 'block') {
                    this.close();
                }
                else {
                    this.show();
                }
            }
        }, false);
        // 点击右侧图标时，显示
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.clickRightIcon, () => {
            this.show();
        });
        // 开始抓取作品时，隐藏
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlStart, () => {
            this.close();
        });
        // 抓取完作品详细数据时，显示
        for (const ev of [_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resume]) {
            window.addEventListener(ev, () => {
                if (!_States__WEBPACK_IMPORTED_MODULE_3__["states"].quickDownload) {
                    this.show();
                }
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.openCenterPanel, () => {
            this.show();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.closeCenterPanel, () => {
            this.close();
        });
        // 显示更新按钮
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.hasNewVer, () => {
            this.updateLink.classList.add(this.updateActiveClass);
            this.updateLink.style.display = 'inline-block';
        });
        // 显示常见问题
        this.centerPanel
            .querySelector('.showDownTip')
            .addEventListener('click', () => _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].toggleEl(this.centerPanel.querySelector('.downTip')));
        // 重置设置
        this.centerPanel
            .querySelector('#resetOption')
            .addEventListener('click', () => {
            const result = window.confirm(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_是否重置设置'));
            if (result) {
                _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resetOption);
            }
        });
    }
    // 显示中间区域
    show() {
        this.centerPanel.style.display = 'block';
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.centerPanelOpened);
    }
    // 隐藏中间区域
    close() {
        this.centerPanel.style.display = 'none';
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.centerPanelClosed);
    }
}
new CenterPanel();


/***/ }),

/***/ "./src/ts/modules/Colors.ts":
/*!**********************************!*\
  !*** ./src/ts/modules/Colors.ts ***!
  \**********************************/
/*! exports provided: Colors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Colors", function() { return Colors; });
// 颜色
class Colors {
}
Colors.blue = '#0ea8ef';
Colors.green = '#14ad27';
Colors.red = '#f33939';
Colors.yellow = '#e49d00';



/***/ }),

/***/ "./src/ts/modules/Config.ts":
/*!**********************************!*\
  !*** ./src/ts/modules/Config.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// 储存一些会在多个组件里使用的常量。运行过程中不会被修改的值。
/* harmony default export */ __webpack_exports__["default"] = ({
    outputMax: 5000,
    latestReleaseAPI: 'https://api.github.com/repos/xuejianxianzun/PixivBatchDownloader/releases/latest',
    illustTypes: ['illustration', 'manga', 'ugoira', 'novel'],
});


/***/ }),

/***/ "./src/ts/modules/DOM.ts":
/*!*******************************!*\
  !*** ./src/ts/modules/DOM.ts ***!
  \*******************************/
/*! exports provided: DOM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOM", function() { return DOM; });
// DOM 操作类
// 保存公用的 DOM 操作方法，以及从 DOM 中获取数据的 API
class DOM {
    // 获取指定元素里，可见的结果
    static getVisibleEl(selector) {
        const list = document.querySelectorAll(selector);
        return Array.from(list).filter((el) => {
            return el.style.display !== 'none';
        });
    }
    // 删除 DOM 元素
    static removeEl(el) {
        if (!el) {
            return;
        }
        if (Reflect.has(el, 'length')) {
            // 如果有 length 属性则循环删除。
            ;
            el.forEach((el) => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        }
        else {
            // 没有 length 属性的直接删除（querySelector 的返回值是 HTMLElement）
            const parent = el.parentNode;
            if (parent) {
                parent.removeChild(el);
            }
        }
    }
    // 切换 DOM 元素的可见性
    static toggleEl(el) {
        el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }
    // 将元素插入到页面顶部
    /*
    newindex-inner 是在未登录时的用户作品列表页面使用的
    layout-body 是在未登录时的搜索页使用的
    */
    static insertToHead(el) {
        if (document.body) {
            document.body.insertAdjacentElement('afterbegin', el);
        }
        else {
            ;
            (document.querySelector('.newindex-inner') ||
                document.querySelector('.layout-body')).insertAdjacentElement('beforebegin', el);
        }
        return el;
    }
    // 动态添加 css 样式
    static addStyle(css) {
        const e = document.createElement('style');
        e.innerHTML = css;
        document.body.append(e);
    }
    // 通过创建 a 标签来下载文件
    static downloadFile(url, fileName) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    }
    // 获取用户 id
    // 这是一个不够可靠的 api
    // 测试：在 https://www.pixiv.net/artworks/79399027 获取 userid ，正确的结果应该是 13895186
    static getUserId() {
        const newRegExp = /\/users\/(\d+)/; // 获取 /users/ 后面连续的数字部分，也就是用户的 id
        // 列表页里从 url 中获取
        const test4 = newRegExp.exec(location.pathname);
        if (!!test4 && test4.length > 1 && !!test4[1]) {
            return test4[1];
        }
        // 获取包含用户 id 的元素，注意这些选择器可能会变，需要进行检查
        const testA = document.querySelector('.sc-LzOjP a') ||
            document.querySelector('aside a') ||
            document.querySelector('nav a');
        // 第一个元素是作品页内，作品下方的作者头像区域的 a 标签
        // 第一个元素是作品页内，页面右侧作者信息区域的 a 标签
        // 第二个元素是用户主页或列表页里，“主页”按钮的 a 标签
        if (testA && testA.href) {
            const test5 = newRegExp.exec(testA.href);
            if (!!test5 && test5.length > 1 && !!test5[1]) {
                return test5[1];
            }
        }
        // 从旧版页面的 head 元素的 script 脚本内容里匹配这一部分
        // pixiv.context.user.id = "<userid>"
        const test1 = /user.id = "(\d*)"/.exec(document.head.innerHTML);
        if (test1 && test1.length > 0) {
            return test1[1];
        }
        // 从旧版页面的 head 元素的 script 脚本内容里匹配这一部分
        // pixiv.context.userId = "<userid>"
        const test2 = /userId = "(\d*)"/.exec(document.head.innerHTML);
        if (test2 && test2.length > 0) {
            return test2[1];
        }
        // 最后从 body 里匹配
        // Warning ：这有可能会匹配到错误的（其他）用户 id！
        const test3 = newRegExp.exec(document.body.innerHTML);
        if (test3) {
            return test3[1];
        }
        // 如果都没有获取到
        throw new Error('getUserId failed!');
    }
    // 寻找 slot，本程序使用的 slot 都要有 data-name 属性
    static findSlot(name) {
        const slot = document.querySelector(`slot[data-name=${name}]`);
        if (!slot) {
            throw new Error(`No such slot: ${name}`);
        }
        return slot;
    }
    // 使用指定的插槽
    static useSlot(name, element) {
        const slot = this.findSlot(name);
        if (typeof element === 'string') {
            // 插入字符串形式的元素
            // 这里不直接使用 insertAdjacentElement 是为了可以返回生成的元素
            const wrap = document.createElement('div');
            wrap.innerHTML = element;
            const el = wrap.children[0];
            slot.appendChild(el);
            return el;
        }
        else {
            // 插入 html 元素
            slot.appendChild(element);
            return element;
        }
    }
    // 清空指定的插槽
    static clearSlot(name) {
        this.findSlot(name).innerHTML = '';
    }
    static addBtn(slot, bg = '', text = '', attr = []) {
        const e = document.createElement('button');
        e.type = 'button';
        e.style.backgroundColor = bg;
        e.textContent = text;
        for (const [key, value] of attr) {
            e.setAttribute(key, value);
        }
        this.useSlot(slot, e);
        return e;
    }
    static async loadImg(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = function () {
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error(`Load image error! url: ${url}`));
            };
        });
    }
}



/***/ }),

/***/ "./src/ts/modules/Deduplication.ts":
/*!*****************************************!*\
  !*** ./src/ts/modules/Deduplication.ts ***!
  \*****************************************/
/*! exports provided: deduplication */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deduplication", function() { return deduplication; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _IndexedDB__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IndexedDB */ "./src/ts/modules/IndexedDB.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FileName */ "./src/ts/modules/FileName.ts");






// 去重
// 通过保存和查询下载记录，判断重复文件
class Deduplication {
    constructor() {
        this.DBName = 'DLRecord';
        this.DBVer = 1;
        this.storeNameList = [
            'record1',
            'record2',
            'record3',
            'record4',
            'record5',
            'record6',
            'record7',
            'record8',
            'record9',
        ]; // 表名的列表
        this.skipIdList = []; // 被跳过下载的文件的 id。当收到下载成功事件时，根据这个 id 列表判断这个文件是不是真的被下载了。如果这个文件是被跳过的，则不保存到下载记录里。
        this.existedIdList = []; // 检查文件是否重复时，会查询数据库。查询到的数据的 id 会保存到这个列表里。当向数据库添加记录时，可以先查询这个列表，如果已经有过记录就改为 put 而不是 add，因为添加主键重复的数据会报错
        this.IDB = new _IndexedDB__WEBPACK_IMPORTED_MODULE_3__["IndexedDB"]();
        this.init();
    }
    async init() {
        if (location.hostname.includes('pixivision.net')) {
            return;
        }
        await this.initDB();
        this.bindEvent();
    }
    // 初始化数据库，获取数据库对象
    async initDB() {
        // 在升级事件里创建表和索引
        const onUpdate = (db) => {
            for (const name of this.storeNameList) {
                if (!db.objectStoreNames.contains(name)) {
                    const store = db.createObjectStore(name, { keyPath: 'id' });
                    store.createIndex('id', 'id', { unique: true });
                }
            }
        };
        return new Promise(async (resolve, reject) => {
            resolve(await this.IDB.open(this.DBName, this.DBVer, onUpdate));
        });
    }
    // 生成一个下载记录
    createRecord(resultId) {
        let name = _Settings__WEBPACK_IMPORTED_MODULE_2__["form"].userSetName.value;
        // 查找这个抓取结果，获取其文件名
        for (const result of _Store__WEBPACK_IMPORTED_MODULE_4__["store"].result) {
            if (result.id === resultId) {
                name = _FileName__WEBPACK_IMPORTED_MODULE_5__["fileName"].getFileName(result);
                break;
            }
        }
        return {
            id: resultId,
            n: name,
        };
    }
    // 当要查找或存储一个 id 时，返回它所对应的 storeName
    getStoreName(id) {
        const firstNum = parseInt(id[0]);
        return this.storeNameList[firstNum - 1];
    }
    bindEvent() {
        // 当有文件被跳过时，保存到 skipIdList
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.skipSaveFile, (ev) => {
            const data = ev.detail.data;
            this.skipIdList.push(data.id);
        });
        // 当有文件下载完成时，存储这个任务的记录
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadSuccess, (ev) => {
            const successData = ev.detail.data;
            // 不储存被跳过下载的文件
            if (this.skipIdList.includes(successData.id)) {
                return;
            }
            const data = this.createRecord(successData.id);
            if (this.existedIdList.includes(successData.id)) {
                this.IDB.put(this.getStoreName(successData.id), data);
            }
            else {
                this.IDB.add(this.getStoreName(successData.id), data).catch(() => {
                    this.IDB.put(this.getStoreName(successData.id), data);
                });
            }
        });
        [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadComplete].forEach((val) => {
            window.addEventListener(val, () => {
                this.skipIdList = [];
            });
        });
        // 给“清空下载记录”的按钮绑定事件
        const btn = document.querySelector('#clearDownloadRecords');
        if (btn) {
            btn.addEventListener('click', () => {
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.clearDownloadRecords);
            });
        }
        // 监听清空下载记录的事件
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.clearDownloadRecords, () => {
            // 清空下载记录
            this.clearRecords();
            // 清空 duplicateList
            this.existedIdList = [];
        });
    }
    // 检查一个 id 是否是重复下载
    // 返回值 true 表示重复，false 表示不重复
    async check(resultId) {
        return new Promise(async (resolve, reject) => {
            // 如果未启用去重，直接返回不重复
            if (_Settings__WEBPACK_IMPORTED_MODULE_2__["form"].deduplication.checked === false) {
                resolve(false);
            }
            // 在数据库进行查找
            const storeNmae = this.getStoreName(resultId);
            const data = (await this.IDB.get(storeNmae, resultId));
            // 查询结果为空，返回不重复
            if (data === null) {
                resolve(false);
            }
            else {
                this.existedIdList.push(data.id);
                // 查询到了对应的记录，根据策略进行判断
                if (_Settings__WEBPACK_IMPORTED_MODULE_2__["form"].dupliStrategy.value === 'loose') {
                    // 如果是宽松策略（只考虑 id），返回重复
                    resolve(true);
                }
                else {
                    // 如果是严格策略（同时考虑 id 和文件名），则比较文件名
                    const record = this.createRecord(resultId);
                    resolve(record.n === data.n);
                }
            }
        });
    }
    // 清空下载记录
    clearRecords() {
        for (const name of this.storeNameList) {
            this.IDB.clear(name);
        }
        window.alert(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载记录已清除'));
    }
}
const deduplication = new Deduplication();



/***/ }),

/***/ "./src/ts/modules/DeleteWorks.ts":
/*!***************************************!*\
  !*** ./src/ts/modules/DeleteWorks.ts ***!
  \***************************************/
/*! exports provided: DeleteWorks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteWorks", function() { return DeleteWorks; });
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
// 删除页面上的作品






class DeleteWorks {
    constructor(worksSelectors) {
        this.worksSelector = ''; // 选择页面上所有作品的选择器
        this.multipleSelector = ''; // 多图作品特有的元素的标识
        this.ugoiraSelector = ''; // 动图作品特有的元素的标识
        this.delMode = false; // 是否处于删除作品状态
        this.deleteWorkCallback = () => { }; // 保存手动删除作品的回调函数，因为可能会多次绑定手动删除事件，所以需要保存传入的 callback 备用
        this.worksSelector = worksSelectors;
        // 作品列表更新后，需要重新给作品绑定删除事件
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].events.worksUpdate, () => {
            if (this.delMode) {
                this.bindDeleteEvent();
            }
        });
    }
    // 清除多图作品的按钮
    addClearMultipleBtn(selector, callback = () => { }) {
        this.multipleSelector = selector;
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].red, _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除多图作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除多图作品Title')],
        ]).addEventListener('click', () => {
            if (_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
                return alert(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
            }
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].events.closeCenterPanel);
            this.clearMultiple();
            callback();
        }, false);
    }
    // 清除动图作品的按钮
    addClearUgoiraBtn(selector, callback = () => { }) {
        this.ugoiraSelector = selector;
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].red, _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除动图作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除动图作品Title')],
        ]).addEventListener('click', () => {
            if (_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
                return alert(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
            }
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].events.closeCenterPanel);
            this.ClearUgoira();
            callback();
        }, false);
    }
    // 手动删除作品的按钮
    addManuallyDeleteBtn(callback = () => { }) {
        this.deleteWorkCallback = callback;
        const delBtn = _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].red, _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_手动删除作品'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_手动删除作品Title')]]);
        delBtn.addEventListener('click', () => {
            this.delMode = !this.delMode;
            this.bindDeleteEvent();
            if (this.delMode) {
                delBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_退出手动删除');
                setTimeout(() => {
                    _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].events.closeCenterPanel);
                }, 100);
            }
            else {
                delBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_手动删除作品');
            }
        });
    }
    // 清除多图作品
    clearMultiple() {
        const allPicArea = document.querySelectorAll(this.worksSelector);
        allPicArea.forEach((el) => {
            if (el.querySelector(this.multipleSelector)) {
                el.remove();
            }
        });
        this.showWorksCount();
    }
    // 清除动图作品
    ClearUgoira() {
        const allPicArea = document.querySelectorAll(this.worksSelector);
        allPicArea.forEach((el) => {
            if (el.querySelector(this.ugoiraSelector)) {
                el.remove();
            }
        });
        this.showWorksCount();
    }
    // 给作品绑定手动删除事件
    // 删除作品后，回调函数可以接收到被删除的元素
    bindDeleteEvent() {
        const listElement = document.querySelectorAll(this.worksSelector);
        listElement.forEach((el) => {
            el.onclick = (ev) => {
                if (this.delMode) {
                    ev.preventDefault();
                    if (_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
                        return alert(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
                    }
                    const target = ev.currentTarget;
                    _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].removeEl(target);
                    this.showWorksCount();
                    this.deleteWorkCallback(target);
                }
            };
        });
    }
    // 显示调整后，列表里的作品数量
    showWorksCount() {
        const selector = this.worksSelector;
        _Log__WEBPACK_IMPORTED_MODULE_0__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_调整完毕', _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].getVisibleEl(selector).length.toString()), 2, false);
    }
}



/***/ }),

/***/ "./src/ts/modules/Download.ts":
/*!************************************!*\
  !*** ./src/ts/modules/Download.ts ***!
  \************************************/
/*! exports provided: Download */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Download", function() { return Download; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FileName */ "./src/ts/modules/FileName.ts");
/* harmony import */ var _ugoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ugoira/ConvertUgoira */ "./src/ts/modules/ugoira/ConvertUgoira.ts");
/* harmony import */ var _ProgressBar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ProgressBar */ "./src/ts/modules/ProgressBar.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _Deduplication__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Deduplication */ "./src/ts/modules/Deduplication.ts");
// 下载文件，并发送给浏览器下载








class Download {
    constructor(progressBarIndex, data) {
        this.fileName = '';
        this.retry = 0;
        this.retryMax = 30;
        this.cancel = false; // 这个下载被取消（任务停止，或者没有通过某个检查）
        this.sizeCheck = undefined; // 检查文件体积
        this.progressBarIndex = progressBarIndex;
        this.download(data);
        this.listenEvents();
    }
    listenEvents() {
        ;
        [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStop, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadPause].forEach((event) => {
            window.addEventListener(event, () => {
                this.cancel = true;
            });
        });
    }
    // 设置进度条信息
    setProgressBar(loaded, total) {
        _ProgressBar__WEBPACK_IMPORTED_MODULE_5__["progressBar"].setProgress(this.progressBarIndex, {
            name: this.fileName,
            loaded: loaded,
            total: total,
        });
    }
    skip(data, msg = '') {
        this.cancel = true;
        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(msg);
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.skipSaveFile, data);
    }
    // 下载文件
    async download(arg) {
        // 检查是否是重复文件
        const duplicate = await _Deduplication__WEBPACK_IMPORTED_MODULE_7__["deduplication"].check(arg.id);
        if (duplicate) {
            return this.skip({
                url: '',
                id: arg.id,
                tabId: 0,
                uuid: false,
            }, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_跳过下载因为重复文件', arg.id));
        }
        // 获取文件名
        this.fileName = _FileName__WEBPACK_IMPORTED_MODULE_3__["fileName"].getFileName(arg.data);
        // 重设当前下载栏的信息
        this.setProgressBar(0, 0);
        // 下载文件
        let xhr = new XMLHttpRequest();
        xhr.open('GET', arg.data.url, true);
        xhr.responseType = 'blob';
        // 显示下载进度
        xhr.addEventListener('progress', async (event) => {
            // 检查体积设置
            if (this.sizeCheck === undefined) {
                this.sizeCheck = await _Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check({ size: event.total });
                if (this.sizeCheck === false) {
                    // 当因为体积问题跳过下载时，可能这个下载进度还是 0 或者很少，所以这里直接把进度条拉满
                    this.setProgressBar(1, 1);
                    this.skip({
                        url: '',
                        id: arg.id,
                        tabId: 0,
                        uuid: false,
                    }, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_不保存图片因为体积', arg.id));
                }
            }
            if (this.cancel) {
                xhr.abort();
                xhr = null;
                return;
            }
            this.setProgressBar(event.loaded, event.total);
        });
        // 图片获取完毕（出错时也会进入 loadend）
        xhr.addEventListener('loadend', async () => {
            if (this.cancel) {
                xhr = null;
                return;
            }
            let file = xhr.response; // 要下载的文件
            // 错误处理
            const downloadError = () => {
                let msg = '';
                if (xhr.status === 404) {
                    // 404 错误时
                    msg = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_file404', arg.id);
                }
                else {
                    // 无法处理的错误状态
                    msg = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_文件下载失败', arg.id);
                }
                _Log__WEBPACK_IMPORTED_MODULE_1__["log"].error(msg, 1);
                this.cancel = true;
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadError, arg.id);
            };
            if (xhr.status !== 200) {
                // 状态码错误
                // 正常下载完毕的状态码是 200
                // 处理小说恢复后下载出错的问题，重新生成小说的 url
                if (arg.data.type === 3 && xhr.status === 0) {
                    arg.data.url = URL.createObjectURL(arg.data.novelBlob);
                    return this.download(arg);
                }
                // 进入重试环节
                _ProgressBar__WEBPACK_IMPORTED_MODULE_5__["progressBar"].showErrorColor(this.progressBarIndex, true);
                this.retry++;
                if (this.retry >= this.retryMax) {
                    // 重试 retryMax 次依然错误
                    // console.log(arg.data.id + ' retryMax')
                    downloadError();
                }
                else {
                    return this.download(arg);
                }
            }
            else {
                // 状态码正常
                _ProgressBar__WEBPACK_IMPORTED_MODULE_5__["progressBar"].showErrorColor(this.progressBarIndex, false);
                // 需要转换动图的情况
                const convertExt = ['webm', 'gif', 'png'];
                if (convertExt.includes(arg.data.ext) && arg.data.ugoiraInfo) {
                    try {
                        if (arg.data.ext === 'webm') {
                            file = await _ugoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__["converter"].webm(file, arg.data.ugoiraInfo);
                        }
                        if (arg.data.ext === 'gif') {
                            file = await _ugoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__["converter"].gif(file, arg.data.ugoiraInfo);
                        }
                        if (arg.data.ext === 'png') {
                            file = await _ugoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__["converter"].apng(file, arg.data.ugoiraInfo);
                        }
                    }
                    catch (error) {
                        const msg = `Error: convert ugoira error, work id ${arg.data.idNum}.`;
                        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].error(msg, 1);
                        this.cancel = true;
                        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadError, arg.id);
                    }
                }
            }
            if (this.cancel) {
                return;
            }
            // 生成下载链接
            const blobUrl = URL.createObjectURL(file);
            // 检查图片的彩色、黑白设置
            // 这里的检查，主要是因为抓取时只能检测第一张的缩略图，有些作品第一张图的颜色和后面不一样。例如某个作品第一张是彩色，后面是黑白；设置条件是只下载彩色。抓取时这个作品通过了检查，后面的黑白图片也会被下载。此时就需要在这里重新检查一次。
            // 对插画、漫画进行检查。动图抓取时检查了第一张图，已经够了，这里不再检查
            // 这里并没有让 filter 初始化，如果用户在抓取之后修改了彩色、黑白的设置，filter 不会响应变化。所以这里不检查第一张图，以避免无谓的检查。如果以后使 filter 在这里初始化了，那么第一张图也需要检查。
            if ((arg.data.type === 0 || arg.data.type === 1) &&
                !arg.data.id.includes('p0')) {
                const result = await _Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check({
                    mini: blobUrl,
                });
                if (!result) {
                    return this.skip({
                        url: blobUrl,
                        id: arg.id,
                        tabId: 0,
                        uuid: false,
                    }, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_不保存图片因为颜色', arg.id));
                }
            }
            // 检查图片的宽高设置
            // 因为抓取时只能检查每个作品第一张图片的宽高，所以可能会出现作品的第一张图片符合要求，但后面的图片不符合要求的情况。这里针对第一张之后的其他图片也进行检查，提高准确率。
            if ((arg.data.type === 0 || arg.data.type === 1) &&
                !arg.data.id.includes('p0')) {
                const img = await this.loadImage(blobUrl);
                const result = await _Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
                if (!result) {
                    return this.skip({
                        url: blobUrl,
                        id: arg.id,
                        tabId: 0,
                        uuid: false,
                    }, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_不保存图片因为宽高', arg.id));
                }
            }
            // 向浏览器发送下载任务
            this.browserDownload(blobUrl, this.fileName, arg.id, arg.taskBatch);
            xhr = null;
            file = null;
        });
        xhr.send();
    }
    async loadImage(url) {
        return new Promise(async (resolve, reject) => {
            const i = document.createElement('img');
            i.src = url;
            i.onload = function () {
                resolve(i);
            };
        });
    }
    // 向浏览器发送下载任务
    browserDownload(blobUrl, fileName, id, taskBatch) {
        // 如果任务已停止，不会向浏览器发送下载任务
        if (this.cancel) {
            // 释放 bloburl
            URL.revokeObjectURL(blobUrl);
            return;
        }
        const sendData = {
            msg: 'send_download',
            fileUrl: blobUrl,
            fileName: fileName,
            id,
            taskBatch,
        };
        chrome.runtime.sendMessage(sendData);
    }
}



/***/ }),

/***/ "./src/ts/modules/DownloadButton.ts":
/*!******************************************!*\
  !*** ./src/ts/modules/DownloadButton.ts ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");


// 右侧的下载按钮
class DownloadButton {
    constructor() {
        this.btn = document.createElement('button');
        this.addBtn();
        this.bindEvents();
    }
    addBtn() {
        this.btn = document.createElement('button');
        this.btn.id = 'rightButton';
        this.btn.textContent = '↓';
        this.btn.setAttribute('title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_显示下载面板') + ' (Alt + X)');
        document.body.insertAdjacentElement('afterbegin', this.btn);
    }
    bindEvents() {
        this.btn.addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.clickRightIcon);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.centerPanelClosed, () => {
            this.show();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.centerPanelOpened, () => {
            this.hide();
        });
    }
    show() {
        this.btn.style.display = 'block';
    }
    hide() {
        this.btn.style.display = 'none';
    }
}
new DownloadButton();


/***/ }),

/***/ "./src/ts/modules/DownloadControl.ts":
/*!*******************************************!*\
  !*** ./src/ts/modules/DownloadControl.ts ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _Download__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Download */ "./src/ts/modules/Download.ts");
/* harmony import */ var _ProgressBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ProgressBar */ "./src/ts/modules/ProgressBar.ts");
/* harmony import */ var _DownloadStates__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DownloadStates */ "./src/ts/modules/DownloadStates.ts");
/* harmony import */ var _ShowSkipCount__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ShowSkipCount */ "./src/ts/modules/ShowSkipCount.ts");
/* harmony import */ var _ShowConvertCount__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ShowConvertCount */ "./src/ts/modules/ShowConvertCount.ts");
/* harmony import */ var _Resume__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Resume */ "./src/ts/modules/Resume.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
// 下载控制














class DownloadControl {
    constructor() {
        this.downloadThreadMax = 5; // 同时下载的线程数的最大值，也是默认值
        this.downloadThread = this.downloadThreadMax; // 同时下载的线程数
        this.taskBatch = 0; // 标记任务批次，每次重新下载时改变它的值，传递给后台使其知道这是一次新的下载
        this.taskList = {}; // 下载任务列表，使用下载的文件的 id 做 key，保存下载栏编号和它在下载状态列表中的索引
        this.errorIdList = []; // 有任务下载失败时，保存 id
        this.downloaded = 0; // 已下载的任务数量
        this.downloadArea = document.createElement('div');
        this.totalNumberEl = document.createElement('span');
        this.downStatusEl = document.createElement('span');
        this.downloadStop = false; // 是否停止下载
        this.downloadPause = false; // 是否暂停下载
        this.createDownloadArea();
        this.listenEvents();
        const skipTipWrap = this.downloadArea.querySelector('.skip_tip');
        new _ShowSkipCount__WEBPACK_IMPORTED_MODULE_10__["ShowSkipCount"](skipTipWrap);
        const convertTipWrap = this.downloadArea.querySelector('.convert_tip');
        new _ShowConvertCount__WEBPACK_IMPORTED_MODULE_11__["ShowConvertCount"](convertTipWrap);
    }
    listenEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlStart, () => {
            this.hideDownloadArea();
            this.reset();
        });
        for (const ev of [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.resultChange, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.resume]) {
            window.addEventListener(ev, () => {
                window.setTimeout(() => {
                    this.readyDownload();
                }, 0);
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.skipSaveFile, (ev) => {
            const data = ev.detail.data;
            this.downloadSuccess(data);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadError, (ev) => {
            const id = ev.detail.data;
            this.downloadError(id);
        });
        // 监听浏览器下载文件后，返回的消息
        chrome.runtime.onMessage.addListener((msg) => {
            if (!this.taskBatch) {
                return;
            }
            // 文件下载成功
            if (msg.msg === 'downloaded') {
                // 释放 BLOBURL
                URL.revokeObjectURL(msg.data.url);
                this.downloadSuccess(msg.data);
            }
            else if (msg.msg === 'download_err') {
                // 浏览器把文件保存到本地时出错
                _Log__WEBPACK_IMPORTED_MODULE_3__["log"].error(`${msg.data.id} download error! code: ${msg.err}. The downloader will try to download the file again `);
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.saveFileError);
                // 重新下载这个文件
                this.saveFileError(msg.data);
            }
            // UUID 的情况
            if (msg.data && msg.data.uuid) {
                _Log__WEBPACK_IMPORTED_MODULE_3__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_uuid'));
            }
        });
    }
    setDownloaded() {
        this.downloaded = _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].downloadedCount();
        const text = `${this.downloaded} / ${_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length}`;
        _Log__WEBPACK_IMPORTED_MODULE_3__["log"].log(text, 2, false);
        // 设置下载进度条
        _ProgressBar__WEBPACK_IMPORTED_MODULE_8__["progressBar"].setTotalProgress(this.downloaded);
        if (this.downloaded === 0) {
            this.setDownStateText(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_未开始下载'));
        }
        // 所有文件正常下载完毕（跳过下载的文件也算正常下载）
        if (this.downloaded === _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
            window.setTimeout(() => {
                // 延后触发下载完成的事件。因为下载完成事件是由上游事件（跳过下载，或下载成功事件）派生的，如果这里不延迟触发，可能导致其他模块先接收到下载完成事件，后接收到上游事件。
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadComplete);
            }, 0);
            this.reset();
            this.setDownStateText(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载完毕'), _Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].green);
            _Log__WEBPACK_IMPORTED_MODULE_3__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载完毕'), 2);
        }
        this.checkCompleteWithError();
    }
    // 在有下载出错的任务的情况下，是否已经完成了下载
    checkCompleteWithError() {
        if (this.errorIdList.length > 0 &&
            this.downloaded + this.errorIdList.length === _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
            // 则进入暂停状态，一定时间后自动开始下载，重试下载出错的文件
            this.pauseDownload();
            setTimeout(() => {
                this.startDownload();
            }, 5000);
        }
    }
    // 显示或隐藏下载区域
    showDownloadArea() {
        this.downloadArea.style.display = 'block';
    }
    hideDownloadArea() {
        this.downloadArea.style.display = 'none';
    }
    // 设置下载状态文本，默认颜色为主题蓝色
    setDownStateText(text, color = _Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].blue) {
        this.downStatusEl.textContent = text;
        this.downStatusEl.style.color = color;
    }
    reset() {
        this.downloadPause = false;
        this.downloadStop = false;
        this.errorIdList = [];
    }
    createDownloadArea() {
        const html = `<div class="download_area">
    <p> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_共抓取到n个文件', '<span class="fwb blue imgNum">0</span>')}</p>
    
    <div class="centerWrap_btns">
    <button class="startDownload" type="button" style="background:${_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].blue};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载按钮1')}</button>
    <button class="pauseDownload" type="button" style="background:${_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].yellow};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载按钮2')}</button>
    <button class="stopDownload" type="button" style="background:${_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].red};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载按钮3')}</button>
    <button class="copyUrl" type="button" style="background:${_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].green};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_复制url')}</button>
    </div>
    <div class="download_status_text_wrap">
    <span>${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_当前状态')}</span>
    <span class="down_status">${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_未开始下载')}</span>
    <span class="skip_tip warn"></span>
    <span class="convert_tip warn"></span>
    </div>
    </div>`;
        const el = _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].useSlot('downloadArea', html);
        this.downloadArea = el;
        this.downStatusEl = el.querySelector('.down_status');
        this.totalNumberEl = el.querySelector('.imgNum');
        el.querySelector('.startDownload').addEventListener('click', () => {
            this.startDownload();
        });
        el.querySelector('.pauseDownload').addEventListener('click', () => {
            this.pauseDownload();
        });
        el.querySelector('.stopDownload').addEventListener('click', () => {
            this.stopDownload();
        });
        el.querySelector('.copyUrl').addEventListener('click', () => {
            this.showURLs();
        });
    }
    // 显示 url
    showURLs() {
        if (_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0) {
            return alert(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_没有数据可供使用'));
        }
        let result = '';
        result = _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.reduce((total, now) => {
            return (total += now.url + '<br>');
        }, result);
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.output, {
            content: result,
            title: _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_复制url'),
        });
    }
    // 下载线程设置
    setDownloadThread() {
        const setThread = parseInt(_Settings__WEBPACK_IMPORTED_MODULE_6__["form"].downloadThread.value);
        if (setThread < 1 ||
            setThread > this.downloadThreadMax ||
            isNaN(setThread)) {
            // 如果数值非法，则重设为默认值
            this.downloadThread = this.downloadThreadMax;
        }
        else {
            this.downloadThread = setThread; // 设置为用户输入的值
        }
        // 如果剩余任务数量少于下载线程数
        if (_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length - this.downloaded < this.downloadThread) {
            this.downloadThread = _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length - this.downloaded;
        }
        // 重设下载进度条
        _ProgressBar__WEBPACK_IMPORTED_MODULE_8__["progressBar"].reset(this.downloadThread, this.downloaded);
    }
    // 抓取完毕之后，已经可以开始下载时，显示必要的信息，并决定是否立即开始下载
    readyDownload() {
        if (_States__WEBPACK_IMPORTED_MODULE_13__["states"].busy) {
            return;
        }
        if (_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0) {
            return _ProgressBar__WEBPACK_IMPORTED_MODULE_8__["progressBar"].reset(0);
        }
        this.showDownloadArea();
        this.totalNumberEl.textContent = _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length.toString();
        this.setDownloaded();
        this.setDownloadThread();
        // 检查 不自动开始下载 的标记
        if (_States__WEBPACK_IMPORTED_MODULE_13__["states"].notAutoDownload) {
            return;
        }
        const autoDownload = _Settings__WEBPACK_IMPORTED_MODULE_6__["form"].quietDownload.checked;
        // 视情况自动开始下载
        if (autoDownload || _States__WEBPACK_IMPORTED_MODULE_13__["states"].quickDownload) {
            this.startDownload();
        }
    }
    // 开始下载
    startDownload() {
        if (!this.downloadPause && !_Resume__WEBPACK_IMPORTED_MODULE_12__["resume"].flag) {
            // 如果之前没有暂停任务，也没有进入恢复模式，则重新下载
            // 初始化下载状态列表
            _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].init();
        }
        else {
            // 从上次中断的位置继续下载
            // 把“使用中”的下载状态重置为“未使用”
            _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].resume();
        }
        this.reset();
        this.setDownloaded();
        this.taskBatch = new Date().getTime(); // 修改本批下载任务的标记
        this.setDownloadThread();
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStart);
        // 建立并发下载线程
        for (let i = 0; i < this.downloadThread; i++) {
            this.createDownload(i);
        }
        this.setDownStateText(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_正在下载中'));
        _Log__WEBPACK_IMPORTED_MODULE_3__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_正在下载中'));
    }
    // 暂停下载
    pauseDownload() {
        if (_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0) {
            return;
        }
        // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
        if (this.downloadStop === true) {
            return;
        }
        if (this.downloadPause === false) {
            // 如果正在下载中
            if (_States__WEBPACK_IMPORTED_MODULE_13__["states"].busy) {
                this.downloadPause = true;
                this.setDownStateText(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_已暂停'), '#f00');
                _Log__WEBPACK_IMPORTED_MODULE_3__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_已暂停'), 2);
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadPause);
            }
            else {
                // 不在下载中的话不允许启用暂停功能
                return;
            }
        }
    }
    // 停止下载
    stopDownload() {
        if (_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0 || this.downloadStop) {
            return;
        }
        this.downloadStop = true;
        this.setDownStateText(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_已停止'), '#f00');
        _Log__WEBPACK_IMPORTED_MODULE_3__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_已停止'), 2);
        this.downloadPause = false;
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStop);
    }
    downloadError(id) {
        this.errorIdList.push(id);
        // 是否继续下载
        const task = this.taskList[id];
        const no = task.progressBarIndex;
        if (this.checkContinueDownload()) {
            this.createDownload(no);
        }
    }
    saveFileError(data) {
        if (this.downloadPause || this.downloadStop) {
            return false;
        }
        const task = this.taskList[data.id];
        // 复位这个任务的状态
        _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].setState(task.index, -1);
        // 建立下载任务，再次下载它
        this.createDownload(task.progressBarIndex);
    }
    downloadSuccess(data) {
        const task = this.taskList[data.id];
        // 更改这个任务状态为“已完成”
        _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].setState(task.index, 1);
        // 发送下载成功的事件
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadSuccess, data);
        // 统计已下载数量
        this.setDownloaded();
        // 是否继续下载
        const no = task.progressBarIndex;
        if (this.checkContinueDownload()) {
            this.createDownload(no);
        }
    }
    // 当一个文件下载成功或失败之后，检查是否还有后续下载任务
    checkContinueDownload() {
        // 如果没有全部下载完毕
        if (this.downloaded < _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
            // 如果任务已停止
            if (this.downloadPause || this.downloadStop) {
                return false;
            }
            // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数，继续添加任务
            if (this.downloaded + this.downloadThread - 1 < _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    // 查找需要进行下载的作品，建立下载
    createDownload(progressBarIndex) {
        const index = _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].getFirstDownloadItem();
        if (index === undefined) {
            // 当已经没有需要下载的作品时，检查是否带着错误完成了下载
            // 如果下载过程中没有出错，就不会执行到这个分支
            return this.checkCompleteWithError();
        }
        else {
            const workData = _Store__WEBPACK_IMPORTED_MODULE_2__["store"].result[index];
            const data = {
                id: workData.id,
                data: workData,
                index: index,
                progressBarIndex: progressBarIndex,
                taskBatch: this.taskBatch,
            };
            // 保存任务信息
            this.taskList[workData.id] = {
                index,
                progressBarIndex: progressBarIndex,
            };
            // 建立下载
            new _Download__WEBPACK_IMPORTED_MODULE_7__["Download"](progressBarIndex, data);
        }
    }
}
new DownloadControl();


/***/ }),

/***/ "./src/ts/modules/DownloadStates.ts":
/*!******************************************!*\
  !*** ./src/ts/modules/DownloadStates.ts ***!
  \******************************************/
/*! exports provided: downloadStates */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downloadStates", function() { return downloadStates; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");


// 下载状态列表
class DownloadStates {
    constructor() {
        this.states = [];
        this.bindEvent();
    }
    bindEvent() {
        // 初始化下载状态
        const evs = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.resultChange];
        for (const ev of evs) {
            window.addEventListener(ev, () => {
                this.init();
            });
        }
    }
    // 创建新的状态列表
    init() {
        this.states = new Array(_Store__WEBPACK_IMPORTED_MODULE_1__["store"].result.length).fill(-1);
    }
    // 统计下载完成的数量
    downloadedCount() {
        let count = 0;
        const length = this.states.length;
        for (let i = 0; i < length; i++) {
            if (this.states[i] === 1) {
                count++;
            }
        }
        return count;
    }
    // 接受传入的状态数据
    // 目前只有在恢复下载的时候使用
    replace(states) {
        this.states = states;
    }
    // 恢复之前的下载任务
    // 这会把之前的“下载中”标记复位到“未开始下载”，以便再次下载
    resume() {
        const length = this.states.length;
        for (let i = 0; i < length; i++) {
            if (this.states[i] === 0) {
                this.setState(i, -1);
            }
        }
    }
    // 获取第一个“未开始下载”标记的索引
    getFirstDownloadItem() {
        const length = this.states.length;
        for (let i = 0; i < length; i++) {
            if (this.states[i] === -1) {
                this.setState(i, 0);
                return i;
            }
        }
        return undefined;
    }
    // 设置已下载列表中的标记
    setState(index, value) {
        this.states[index] = value;
    }
    clear() {
        this.states = [];
    }
}
const downloadStates = new DownloadStates();



/***/ }),

/***/ "./src/ts/modules/EVT.ts":
/*!*******************************!*\
  !*** ./src/ts/modules/EVT.ts ***!
  \*******************************/
/*! exports provided: EVT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVT", function() { return EVT; });
// 事件类
class EVT {
    // 触发事件，可以携带数据
    static fire(type, data = '') {
        const event = new CustomEvent(type, {
            detail: { data: data },
        });
        window.dispatchEvent(event);
    }
}
// 事件名称列表
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
    downloadSuccess: 'downloadSuccess',
    downloadError: 'downloadError',
    downloadComplete: 'downloadComplete',
    pageSwitch: 'pageSwitch',
    pageSwitchedTypeChange: 'pageSwitchedTypeChange',
    pageSwitchedTypeNotChange: 'pageSwitchedTypeNotChange',
    resetOption: 'resetOption',
    convertChange: 'convertChange',
    previewFileName: 'previewFileName',
    output: 'output',
    openCenterPanel: 'openCenterPanel',
    closeCenterPanel: 'closeCenterPanel',
    centerPanelOpened: 'centerPanelOpened',
    centerPanelClosed: 'centerPanelClosed',
    clearMultiple: 'clearMultiple',
    clearUgoira: 'clearUgoira',
    deleteWork: 'deleteWork',
    worksUpdate: 'worksUpdate',
    settingChange: 'settingChange',
    clickRightIcon: 'clickRightIcon',
    destroy: 'destroy',
    convertError: 'convertError',
    convertSuccess: 'convertSuccess',
    skipSaveFile: 'skipSaveFile',
    saveFileError: 'saveFileError',
    hasNewVer: 'hasNewVer',
    restoreDownload: 'restoreDownload',
    DBupgradeneeded: 'DBupgradeneeded',
    clearDownloadRecords: 'clearDownloadRecords',
    saveAvatarIcon: 'saveAvatarIcon',
    clearSavedCrawl: 'clearSavedCrawl',
    resume: 'resume',
    outputCSV: 'outputCSV',
    QuickDownload: 'QuickDownload',
    resultChange: 'resultChange',
};



/***/ }),

/***/ "./src/ts/modules/FastScreen.ts":
/*!**************************************!*\
  !*** ./src/ts/modules/FastScreen.ts ***!
  \**************************************/
/*! exports provided: FastScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FastScreen", function() { return FastScreen; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PageInfo */ "./src/ts/modules/PageInfo.ts");
/* harmony import */ var _ThemeColor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ThemeColor */ "./src/ts/modules/ThemeColor.ts");




// 在搜索页面按收藏数快速筛选
class FastScreen {
    constructor() {
        this.favNums = [
            '100users入り',
            '500users入り',
            '1000users入り',
            '3000users入り',
            '5000users入り',
            '10000users入り',
            '20000users入り',
            '30000users入り',
            '50000users入り',
        ]; // 200 和 2000 的因为数量太少，不添加。40000 的也少
        this.create();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.pageSwitchedTypeChange, () => {
            this.destroy();
        });
    }
    // 添加快速筛选功能
    create() {
        // 判断插入点的元素有没有加载出来
        const target = document.querySelector('#root>div');
        if (!target) {
            setTimeout(() => {
                this.create();
            }, 300);
            return;
        }
        const fastScreenArea = document.createElement('div');
        fastScreenArea.className = 'fastScreenArea';
        this.favNums.forEach((secondTag) => {
            const a = document.createElement('a');
            a.innerText = secondTag;
            a.href = 'javascript:viod(0)';
            a.onclick = () => {
                this.openFastScreenLink(secondTag);
            };
            fastScreenArea.appendChild(a);
        });
        _ThemeColor__WEBPACK_IMPORTED_MODULE_3__["themeColor"].register(fastScreenArea);
        target.insertAdjacentElement('afterend', fastScreenArea);
    }
    // 打开快速筛选链接
    openFastScreenLink(secondTag) {
        // 拼接两个 tag。因为搜索页面可以无刷新切换搜索的 tag，所以从这里动态获取
        const firstTag = _PageInfo__WEBPACK_IMPORTED_MODULE_2__["pageInfo"].tag.split(' ')[0];
        const fullTag = encodeURIComponent(firstTag + ' ' + secondTag);
        // 用新的 tag 替换掉当前网址里的 tag
        const newURL = location.href.replace(encodeURIComponent(_PageInfo__WEBPACK_IMPORTED_MODULE_2__["pageInfo"].tag), fullTag);
        // 添加 s_mode=s_tag 宽松匹配标签
        const u = new URL(newURL);
        u.searchParams.set('s_mode', 's_tag');
        location.href = u.toString();
    }
    destroy() {
        // 删除快速筛选元素
        const fastScreen = document.querySelector('.fastScreenArea');
        _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].removeEl(fastScreen);
    }
}



/***/ }),

/***/ "./src/ts/modules/FileName.ts":
/*!************************************!*\
  !*** ./src/ts/modules/FileName.ts ***!
  \************************************/
/*! exports provided: fileName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fileName", function() { return fileName; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Config */ "./src/ts/modules/Config.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
// 生成文件名







class FileName {
    constructor() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.previewFileName, () => {
            this.previewFileName();
        });
    }
    // 生成文件名
    getFileName(data) {
        // 为空时使用 {id}
        let result = _Settings__WEBPACK_IMPORTED_MODULE_3__["form"].userSetName.value || '{id}';
        // 配置所有命名标记
        const cfg = {
            '{p_title}': {
                value: _Store__WEBPACK_IMPORTED_MODULE_4__["store"].pageInfo.pageTitle,
                prefix: '',
                safe: false,
            },
            '{p_tag}': {
                value: _Store__WEBPACK_IMPORTED_MODULE_4__["store"].pageInfo.pageTag,
                prefix: '',
                safe: false,
            },
            '{id}': {
                value: data.id,
                prefix: '',
                safe: true,
            },
            '{id_num}': {
                value: data.idNum || parseInt(data.id),
                prefix: '',
                safe: true,
            },
            '{p_num}': {
                value: parseInt(/\d*$/.exec(data.id)[0]),
                prefix: '',
                safe: true,
            },
            '{rank}': {
                value: data.rank,
                prefix: '',
                safe: true,
            },
            '{title}': {
                value: data.title,
                prefix: 'title_',
                safe: false,
            },
            '{user}': {
                value: data.user,
                prefix: 'user_',
                safe: false,
            },
            '{userid}': {
                value: data.userId,
                prefix: 'uid_',
                safe: true,
            },
            '{user_id}': {
                value: data.userId,
                prefix: 'uid_',
                safe: true,
            },
            '{px}': {
                value: (function () {
                    if (result.includes('{px}') && data.fullWidth !== undefined) {
                        return data.fullWidth + 'x' + data.fullHeight;
                    }
                    else {
                        return '';
                    }
                })(),
                prefix: '',
                safe: true,
            },
            '{tags}': {
                value: data.tags.join(','),
                prefix: 'tags_',
                safe: false,
            },
            '{tags_translate}': {
                value: data.tagsWithTransl.join(','),
                prefix: 'tags_',
                safe: false,
            },
            '{tags_transl_only}': {
                value: data.tagsTranslOnly.join(','),
                prefix: 'tags_',
                safe: false,
            },
            '{bmk}': {
                value: data.bmk,
                prefix: 'bmk_',
                safe: true,
            },
            '{date}': {
                value: data.date,
                prefix: '',
                safe: true,
            },
            '{type}': {
                value: _Config__WEBPACK_IMPORTED_MODULE_5__["default"].illustTypes[data.type],
                prefix: '',
                safe: true,
            },
            '{series_title}': {
                value: data.seriesTitle || '',
                prefix: '',
                safe: false,
            },
            '{series_order}': {
                value: data.seriesOrder || '',
                prefix: '',
                safe: true,
            },
        };
        // 替换命名规则里的特殊字符
        result = _API__WEBPACK_IMPORTED_MODULE_1__["API"].replaceUnsafeStr(result);
        // 上一步会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
        result = result.replace(/／/g, '/');
        // 判断这个作品是否要去掉序号
        const noSerialNo = cfg['{p_num}'].value === 0 && _Settings__WEBPACK_IMPORTED_MODULE_3__["form"].noSerialNo.checked;
        // 把命名规则的标记替换成实际值
        for (const [key, val] of Object.entries(cfg)) {
            if (result.includes(key)) {
                // 处理去掉序号的情况
                if (noSerialNo) {
                    // 把 p_num 设为空字符串
                    key === '{p_num}' && (val.value = '');
                    // 去掉 id 后面的序号。因为 idNum 不带序号，所以直接拿来用了
                    key === '{id}' && (val.value = cfg['{id_num}'].value);
                }
                let once = String(val.value);
                // 处理标记值中的特殊字符
                if (!val.safe) {
                    once = _API__WEBPACK_IMPORTED_MODULE_1__["API"].replaceUnsafeStr(once);
                }
                // 添加标记名称
                if (_Settings__WEBPACK_IMPORTED_MODULE_3__["form"].tagNameToFileName.checked) {
                    once = val.prefix + once;
                }
                result = result.replace(new RegExp(key, 'g'), once); // 将标记替换成最终值，如果有重复的标记，全部替换
            }
        }
        // 处理空值，连续的 '//'。 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
        result = result.replace(/undefined/g, '').replace(/\/{2,9}/, '/');
        // 对每一层路径进行处理
        let tempArr = result.split('/');
        tempArr.forEach((str, index, arr) => {
            // 替换路径首尾的空格
            // 把每层路径头尾的 . 变成全角的．因为 Chrome 不允许头尾使用 .
            arr[index] = str.trim().replace(/^\./g, '．').replace(/\.$/g, '．');
        });
        result = tempArr.join('/');
        // 去掉头尾的 /
        if (result.startsWith('/')) {
            result = result.replace('/', '');
        }
        if (result.endsWith('/')) {
            result = result.substr(0, result.length - 1);
        }
        // 如果快速下载时只有一个文件，根据“始终建立文件夹”选项，决定是否去掉文件夹部分
        if (_States__WEBPACK_IMPORTED_MODULE_6__["states"].quickDownload &&
            _Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length === 1 &&
            _Settings__WEBPACK_IMPORTED_MODULE_3__["form"].alwaysFolder.checked === false) {
            const index = result.lastIndexOf('/');
            result = result.substr(index + 1, result.length);
        }
        // 处理为多图作品自动建立文件夹的情况
        // 多图作品如果只下载前 1 张，不会为它自动建立文件夹。大于 1 张才会自动建立文件夹
        if (_Settings__WEBPACK_IMPORTED_MODULE_3__["form"].multipleImageDir.checked && data.dlCount > 1) {
            // 操作路径中最后一项（即文件名），在它前面添加一层文件夹
            const allPart = result.split('/');
            const lastPartIndex = allPart.length - 1;
            let lastPart = allPart[lastPartIndex];
            let addString = '';
            if (_Settings__WEBPACK_IMPORTED_MODULE_3__["form"].multipleImageFolderName.value === '1') {
                // 使用作品 id 作为文件夹名
                addString = data.idNum.toString();
            }
            else if (_Settings__WEBPACK_IMPORTED_MODULE_3__["form"].multipleImageFolderName.value === '2') {
                // 遵从命名规则，使用文件名做文件夹名
                // 这里进行了一个替换，因为多图每个图片的名字都不同，这主要是因为 id 后面的序号不同。这会导致文件夹名也不同，有多少个文件就会建立多少个文件夹，而不是统一建立一个文件夹。为了只建立一个文件夹，需要把 id 后面的序号部分去掉。
                // 但是如果一些特殊的命名规则并没有包含 {id} 部分，文件名的区别得不到处理，依然会每个文件建立一个文件夹。
                addString = lastPart.replace(data.id, data.idNum.toString());
            }
            lastPart = addString + '/' + lastPart;
            allPart[lastPartIndex] = lastPart;
            result = allPart.join('/');
        }
        // 生成后缀名
        const ugoiraFormat = ['webm', 'gif', 'png'];
        if (ugoiraFormat.includes(data.ext) && data.ugoiraInfo) {
            // 如果是动图，那么此时根据用户设置的动图保存格式，更新其后缀名
            // 例如，抓取时动图保存格式是 webm，下载开始前，用户改成了 gif，在这里可以响应用户的修改
            data.ext = _Settings__WEBPACK_IMPORTED_MODULE_3__["form"].ugoiraSaveAs.value;
        }
        const extResult = '.' + data.ext;
        // 处理文件名长度限制
        // 去掉文件夹部分，只处理 文件名+后缀名 部分
        // 理论上文件夹部分也可能会超长，但是实际使用中几乎不会有人这么设置，所以不处理
        if (_Settings__WEBPACK_IMPORTED_MODULE_3__["form"].fileNameLengthLimitSwitch.checked) {
            let limit = Number.parseInt(_Settings__WEBPACK_IMPORTED_MODULE_3__["form"].fileNameLengthLimit.value);
            if (limit < 1 || isNaN(limit)) {
                limit = 200; // 如果设置的值不合法，则设置为 200
            }
            const allPart = result.split('/');
            const lastIndex = allPart.length - 1;
            if (allPart[lastIndex].length + extResult.length > limit) {
                allPart[lastIndex] = allPart[lastIndex].substr(0, limit - extResult.length);
            }
            result = allPart.join('/');
        }
        // 添加后缀名
        result += extResult;
        return result;
    }
    // 预览文件名
    previewFileName() {
        if (_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length === 0) {
            return alert(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
        }
        // 使用数组储存和拼接字符串，提高性能
        const resultArr = [];
        const length = _Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length;
        for (let i = 0; i < length; i++) {
            const data = _Store__WEBPACK_IMPORTED_MODULE_4__["store"].result[i];
            // 为默认文件名添加颜色。默认文件名有两种处理方式，一种是取出用其他下载软件下载后的默认文件名，一种是取出本程序使用的默认文件名 data.id。这里使用前者，方便用户用其他下载软件下载后，再用生成的文件名重命名。
            const defaultName = data.url.replace(/.*\//, '');
            const fullName = this.getFileName(data);
            let nowResult = `${defaultName}: ${fullName}<br>`;
            if (length < _Config__WEBPACK_IMPORTED_MODULE_5__["default"].outputMax) {
                // 为生成的文件名添加颜色。只有当文件数量少于一定数值时才添加颜色。这是因为添加颜色会导致生成的 HTML 元素数量增多，复制时资源占用增加。有些用户电脑配置差，如果生成的结果很多，还添加了颜色，可能复制时会导致这个页面卡死。
                const defaultNameHtml = `<span class="color999">${defaultName}</span>`;
                const part = fullName.split('/');
                const length = part.length;
                for (let i = 0; i < length; i++) {
                    const str = part[i];
                    if (i < length - 1) {
                        // 如果不是最后一项，说明是文件夹名，添加颜色
                        part[i] = `<span class="color666">${str}</span>`;
                    }
                    else {
                        // 最后一项，是文件名，添加颜色
                        part[i] = `<span class="color000">${str}</span>`;
                    }
                }
                const fullNameHtml = part.join('/');
                nowResult = `<p class="result">${defaultNameHtml}: ${fullNameHtml}</p>`;
            }
            // 保存本条结果
            resultArr.push(nowResult);
        }
        // 拼接所有结果
        const result = resultArr.join('');
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.output, {
            content: result,
            title: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_预览文件名'),
        });
    }
}
const fileName = new FileName();



/***/ }),

/***/ "./src/ts/modules/Filter.ts":
/*!**********************************!*\
  !*** ./src/ts/modules/Filter.ts ***!
  \**********************************/
/*! exports provided: filter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return filter; });
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
/* harmony import */ var _BlackandWhiteImage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./BlackandWhiteImage */ "./src/ts/modules/BlackandWhiteImage.ts");







// 审查作品是否符合过滤条件
// 可以根据需要，随时进行审查
class Filter {
    constructor() {
        this.downType0 = true;
        this.downType1 = true;
        this.downType2 = true;
        this.downType3 = true;
        this.downSingleImg = true;
        this.downMultiImg = true;
        this.downColorImg = true;
        this.downBlackWhiteImg = true;
        this.filterBMKNum = false; // 是否要求收藏数量
        this.BMKNumMinDef = 0;
        this.BMKNumMaxDef = 999999;
        this.BMKNumMin = this.BMKNumMinDef; // 最小收藏数量
        this.BMKNumMax = this.BMKNumMaxDef; // 最大收藏数量
        this.onlyBmk = false; // 是否只下载收藏的作品
        this.MB = 1024 * 1024;
        this.sizeMin = 0;
        this.sizeMax = 100 * this.MB;
        // 宽高条件
        this.setWHSwitch = false;
        this.filterWh = {
            andOr: '&',
            width: 0,
            height: 0,
        };
        this.ratioType = '0'; // 宽高比例的类型
        this.idRangeSwitch = false; // id 范围的开关
        this.idRange = -1; // id 范围，默认不限制
        this.postDate = false; // 是否设置投稿时间
        this.postDateStart = new Date();
        this.postDateEnd = new Date();
        this.needTagSwitch = false; // 必须包含的 tag 开关
        this.includeTag = ''; // 必须包含的 tag
        this.notNeedTagSwitch = false; // 要排除的 tag 开关
        this.excludeTag = ''; // 要排除的 tag
        this.bindEvent();
    }
    // 从下载区域上获取过滤器的各个选项
    init() {
        // 获取排除作品类型的设置
        this.getDownType();
        this.getDownTypeByImgCount();
        // 获取是否设置了过滤黑白图像
        this.getDownTypeByColor();
        // 获取是否设置了收藏数要求
        this.filterBMKNum = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].BMKNumSwitch.checked;
        this.filterBMKNum && this.getBMKNum();
        // 获取是否设置了只下载书签作品
        this.onlyBmk = this.getOnlyBmk();
        // 获取是否设置了宽高条件
        this.setWHSwitch = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].setWHSwitch.checked;
        if (this.setWHSwitch) {
            this.filterWh = this.getSetWh();
        }
        // 获取宽高比设置
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].ratioSwitch.checked) {
            this.ratioType = this.getRatio();
        }
        // 获取 id 范围设置
        this.idRangeSwitch = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].idRangeSwitch.checked;
        if (this.idRangeSwitch) {
            this.idRange = this.getIdRange();
        }
        // 获取投稿时间设置
        this.postDate = this.getPostDateSetting();
        // 获取必须包含的tag
        this.needTagSwitch = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].needTagSwitch.checked;
        if (this.needTagSwitch) {
            this.includeTag = this.getIncludeTag();
        }
        // 获取要排除的tag
        this.notNeedTagSwitch = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].notNeedTagSwitch.checked;
        if (this.notNeedTagSwitch) {
            this.excludeTag = this.getExcludeTag();
        }
        // 获取只下载首次登场设置
        if (_States__WEBPACK_IMPORTED_MODULE_5__["states"].debut) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_抓取首次登场的作品Title'));
        }
        this.getSize();
    }
    // 检查作品是否符合过滤器的要求
    // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
    // 所有过滤器里，都必须要检查参数为 undefined 的情况
    // 这是一个异步函数，所以要记得使用 await 获取检查结果
    async check(option) {
        // 检查下载的作品类型设置
        if (!this.checkDownType(option.illustType)) {
            return false;
        }
        // 检查图片张数是否允许下载
        if (!this.checkPageCount(option.illustType, option.pageCount)) {
            return false;
        }
        // 检查收藏数要求
        if (!this.checkBMK(option.bookmarkCount)) {
            return false;
        }
        // 检查只下载书签作品的要求
        if (!this.checkOnlyBmk(option.bookmarkData)) {
            return false;
        }
        // 检查要排除的 tag
        if (!this.checkExcludeTag(option.tags)) {
            return false;
        }
        // 检查必须包含的 tag
        if (!this.checkIncludeTag(option.tags)) {
            return false;
        }
        // 检查宽高设置
        if (!this.checkSetWh(option.width, option.height)) {
            return false;
        }
        // 检查宽高比设置
        if (!this.checkRatio(option.width, option.height)) {
            return false;
        }
        // 检查 id 范围设置
        if (!this.checkIdRange(option.id)) {
            return false;
        }
        // 检查投稿时间设置
        if (!this.checkPostDate(option.createDate)) {
            return false;
        }
        // 检查首次登场设置
        if (!this.checkDebut(option.yes_rank)) {
            return false;
        }
        // 检查文件体积设置
        if (!this.checkSize(option.size)) {
            return false;
        }
        // 检查黑白图片
        // 这一步需要加载图片，需要较长的时间，较大的资源占用，放到最后检查，以避免无谓的执行
        const blackAndWhiteResult = await this.checkBlackWhite(option.mini);
        if (!blackAndWhiteResult) {
            return false;
        }
        return true;
    }
    // 当需要时抛出错误
    throwError(msg) {
        _EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].events.crawlError);
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].error(msg, 2);
        window.alert(msg);
        throw new Error(msg);
    }
    // 获取下载的作品类型设置
    getDownType() {
        this.downType0 = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downType0.checked;
        this.downType1 = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downType1.checked;
        this.downType2 = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downType2.checked;
        this.downType3 = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downType3.checked;
        // 如果全部排除则取消任务
        if (!this.downType0 &&
            !this.downType1 &&
            !this.downType2 &&
            !this.downType3) {
            this.throwError(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_checkNotdownTypeAll'));
        }
        let notDownTip = '';
        notDownTip += this.downType0 ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_插画');
        notDownTip += this.downType1 ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_漫画');
        notDownTip += this.downType2 ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_动图');
        notDownTip += this.downType3 ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_小说');
        if (notDownTip) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_checkNotdownTypeResult') + notDownTip);
        }
    }
    getDownTypeByImgCount() {
        this.downSingleImg = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downSingleImg.checked;
        this.downMultiImg = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downMultiImg.checked;
        let notDownTip = '';
        notDownTip += this.downSingleImg ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_单图作品');
        notDownTip += this.downMultiImg ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_多图作品');
        if (notDownTip) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_checkNotdownTypeResult') + notDownTip);
        }
    }
    // 获取图像颜色设置
    getDownTypeByColor() {
        this.downColorImg = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downColorImg.checked;
        this.downBlackWhiteImg = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].downBlackWhiteImg.checked;
        // 如果全部排除则取消任务
        if (!this.downColorImg && !this.downBlackWhiteImg) {
            this.throwError(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_checkNotdownTypeAll'));
        }
        let notDownTip = '';
        notDownTip += this.downColorImg ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_彩色图片');
        notDownTip += this.downBlackWhiteImg ? '' : _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_黑白图片');
        if (notDownTip) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_checkNotdownTypeResult') + notDownTip);
        }
    }
    // 获取用户输入的 tag 内容
    getTagString(str) {
        let result = '';
        if (str) {
            let tempArr = str.split(',');
            // 如果用户在末尾也输入了逗号，则会产生一个空值，去掉它
            if (tempArr[tempArr.length - 1] === '') {
                tempArr.pop();
            }
            result = tempArr.join(',');
        }
        return result;
    }
    // 获取必须包含的tag
    getIncludeTag() {
        const result =  false || this.getTagString(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].needTag.value);
        if (result) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置了必须tag之后的提示') + result);
        }
        return result;
    }
    // 获取要排除的tag
    getExcludeTag() {
        const result =  false || this.getTagString(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].notNeedTag.value);
        if (result) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置了排除tag之后的提示') + result);
        }
        return result;
    }
    // 获取过滤宽高的设置
    getSetWh() {
        let result = {
            andOr: '&',
            width: 0,
            height: 0,
        };
        const checkWidth = _API__WEBPACK_IMPORTED_MODULE_3__["API"].checkNumberGreater0(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].setWidth.value);
        const checkHeight = _API__WEBPACK_IMPORTED_MODULE_3__["API"].checkNumberGreater0(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].setHeight.value);
        // 宽高只要有一个条件大于 0 即可
        if (checkWidth.value > 0 || checkHeight.value > 0) {
            result = {
                andOr: _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].setWidthAndOr.value,
                width: checkWidth ? checkWidth.value : 0,
                height: checkHeight ? checkHeight.value : 0,
            };
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_宽度设置') +
                result.width +
                result.andOr
                    .replace('|', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_或者'))
                    .replace('&', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_并且')) +
                _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_高度设置') +
                result.height);
        }
        return result;
    }
    // 获取输入的收藏数
    getBMKNum() {
        this.BMKNumMin = this.BMKNumMinDef;
        this.BMKNumMax = this.BMKNumMaxDef;
        const min = _API__WEBPACK_IMPORTED_MODULE_3__["API"].checkNumberGreater0(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].BMKNumMin.value);
        const max = _API__WEBPACK_IMPORTED_MODULE_3__["API"].checkNumberGreater0(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].BMKNumMax.value);
        if (min.result) {
            this.BMKNumMin = min.value;
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_收藏数大于') + min.value);
        }
        if (max.result) {
            this.BMKNumMax = max.value;
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_收藏数小于') + max.value);
        }
    }
    // 获取只下载书签作品的设置
    getOnlyBmk() {
        const result = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].setOnlyBmk.checked;
        if (result) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_只下载已收藏的提示'));
        }
        return result;
    }
    // 获取宽高比设置
    getRatio() {
        let result = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].ratio.value;
        if (result === '1') {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置了宽高比之后的提示', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_横图')));
        }
        else if (result === '2') {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置了宽高比之后的提示', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_竖图')));
        }
        else if (result === '3') {
            // 由用户输入
            const typeNum = parseFloat(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].userRatio.value);
            if (isNaN(typeNum)) {
                result = '0';
                _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].ratio.value = result;
                window.alert(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_宽高比必须是数字'));
            }
            else {
                _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输入宽高比') + _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].userRatio.value);
            }
        }
        return result;
    }
    // 获取 id 范围设置
    getIdRange() {
        const result = parseInt(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].idRange.value);
        if (result === 1 || result === 2) {
            let id = parseInt(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].idRangeInput.value);
            if (isNaN(id)) {
                _EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].events.crawlError);
                const msg = 'id is not a number!';
                window.alert(msg);
                _Log__WEBPACK_IMPORTED_MODULE_2__["log"].error(msg);
                throw new Error(msg);
            }
        }
        if (result === 1) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(`id > ${_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].idRangeInput.value}`);
        }
        if (result === 2) {
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(`id < ${_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].idRangeInput.value}`);
        }
        return result;
    }
    // 获取投稿时间设置
    getPostDateSetting() {
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].postDate.checked === false) {
            return false;
        }
        else {
            // 如果启用了此设置，需要判断是否是有效的时间格式
            const postDateStart = new Date(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].postDateStart.value);
            const postDateEnd = new Date(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].postDateEnd.value);
            // 如果输入的时间可以被转换成有效的时间，则启用
            // 转换时间失败时，值是 Invalid Date，不能转换成数字
            if (isNaN(postDateStart.getTime()) || isNaN(postDateEnd.getTime())) {
                _EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].events.crawlError);
                const msg = 'Date format error!';
                _Log__WEBPACK_IMPORTED_MODULE_2__["log"].error(msg);
                window.alert(msg);
                throw new Error(msg);
            }
            else {
                // 转换时间成功
                this.postDateStart = postDateStart;
                this.postDateEnd = postDateEnd;
                _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(`${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_时间范围')}: ${_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].postDateStart.value} - ${_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].postDateEnd.value}`);
                return true;
            }
        }
    }
    // 获取文件体积设置
    getSize() {
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].sizeSwitch.checked) {
            let min = parseFloat(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].sizeMin.value);
            isNaN(min) && (min = 0);
            let max = parseFloat(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].sizeMax.value);
            isNaN(max) && (min = 100);
            // 如果输入的最小值比最大值还要大，则交换它们的值
            if (min > max) {
                ;
                [min, max] = [max, min];
            }
            this.sizeMin = min * this.MB;
            this.sizeMax = max * this.MB;
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(`Size: ${min}MB - ${max}MB`);
        }
    }
    // 检查下载的作品类型设置
    checkDownType(illustType) {
        if (illustType === undefined) {
            return true;
        }
        else {
            switch (illustType) {
                case 0:
                    return this.downType0 ? true : false;
                case 1:
                    return this.downType1 ? true : false;
                case 2:
                    return this.downType2 ? true : false;
                case 3:
                    return this.downType3 ? true : false;
                default:
                    return true;
            }
        }
    }
    // 依据图片数量，检查下载的作品类型
    checkPageCount(illustType, pageCount) {
        // 判断单图、多图时，只对插画、漫画生效，否则跳过检查
        if (illustType !== 0 && illustType !== 1) {
            return true;
        }
        if (illustType === undefined || pageCount === undefined) {
            return true;
        }
        if (pageCount === 1 && this.downSingleImg) {
            return true;
        }
        if (pageCount > 1 && this.downMultiImg) {
            return true;
        }
        return false;
    }
    // 检查过滤黑白图像设置
    async checkBlackWhite(imgUrl) {
        // 如果没有图片网址，或者没有排除任何一个选项，则不检查
        if (!imgUrl || (this.downColorImg && this.downBlackWhiteImg)) {
            return true;
        }
        // result 为 true，表示它是黑白图片，false 是彩色图片
        const result = await _BlackandWhiteImage__WEBPACK_IMPORTED_MODULE_6__["blackAndWhiteImage"].check(imgUrl);
        return (result && this.downBlackWhiteImg) || (!result && this.downColorImg);
    }
    // 检查收藏数要求
    checkBMK(bmk) {
        if (bmk === undefined || !this.filterBMKNum) {
            return true;
        }
        else {
            return bmk >= this.BMKNumMin && bmk <= this.BMKNumMax;
        }
    }
    // 检查作品是否符合【只下载书签作品】的条件,返回值 true 表示包含这个作品
    checkOnlyBmk(bookmarked) {
        if (bookmarked === undefined || !this.onlyBmk) {
            return true;
        }
        return !!bookmarked;
    }
    // 检查作品是否符合包含 tag 的条件, 如果设置了多个 tag，需要作品里全部包含。返回值表示是否保留这个作品。
    checkIncludeTag(tags) {
        if (!this.needTagSwitch || !this.includeTag || tags === undefined) {
            return true;
        }
        let result = false;
        let tempArr = this.includeTag.split(',');
        // 如果设置了必须的 tag
        if (tempArr.length > 0) {
            let tagNeedMatched = 0;
            const tempTags = new Set();
            // 如果不区分大小写的话，Fate/grandorder 和 Fate/GrandOrder 会被算作符合两个 tag，所以用 Set 结构去重。测试 id 51811780
            for (const tag of tags) {
                tempTags.add(tag.toLowerCase());
            }
            for (const tag of tempTags) {
                for (const need of tempArr) {
                    if (tag === need.toLowerCase()) {
                        tagNeedMatched++;
                        break;
                    }
                }
            }
            // 如果全部匹配
            if (tagNeedMatched >= tempArr.length) {
                result = true;
            }
        }
        else {
            result = true;
        }
        return result;
    }
    // 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否保留这个作品。
    checkExcludeTag(tags) {
        if (!this.notNeedTagSwitch || !this.excludeTag || tags === undefined) {
            return true;
        }
        let result = true;
        let tempArr = this.excludeTag.split(',');
        // 如果设置了排除 tag
        if (tempArr.length > 0) {
            for (const tag of tags) {
                for (const notNeed of tempArr) {
                    if (tag.toLowerCase() === notNeed.toLowerCase()) {
                        result = false;
                        break;
                    }
                }
            }
        }
        return result;
    }
    // 检查作品是否符合过滤宽高的条件
    checkSetWh(width, height) {
        if (!this.setWHSwitch) {
            return true;
        }
        if (width === undefined || height === undefined) {
            return true;
        }
        if (this.filterWh.width > 0 || this.filterWh.height > 0) {
            // 如果宽高都小于要求的宽高
            if (width < this.filterWh.width && height < this.filterWh.height) {
                return false;
            }
            else {
                if (this.filterWh.andOr === '|') {
                    // 判断or的情况
                    if (width >= this.filterWh.width || height >= this.filterWh.height) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (this.filterWh.andOr === '&') {
                    // 判断and的情况
                    if (width >= this.filterWh.width && height >= this.filterWh.height) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // 检查作品是否符合宽高比条件
    checkRatio(width, height) {
        if (!_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].ratioSwitch.checked) {
            return true;
        }
        if (width === undefined || height === undefined) {
            return true;
        }
        if (this.ratioType === '1') {
            return width / height > 1;
        }
        else if (this.ratioType === '2') {
            return width / height < 1;
        }
        else {
            return width / height >= parseFloat(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].userRatio.value);
        }
    }
    // 检查 id 范围设置
    checkIdRange(id) {
        if (id === undefined || !this.idRangeSwitch) {
            return true;
        }
        const nowId = parseInt(id.toString());
        const setId = parseInt(_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].idRangeInput.value);
        if (this.idRange === 1) {
            // 大于
            return nowId > setId;
        }
        else if (this.idRange === 2) {
            // 小于
            return nowId < setId;
        }
        else {
            return true;
        }
    }
    // 检查投稿时间设置
    checkPostDate(date) {
        if (!this.postDate || date === undefined) {
            return true;
        }
        else {
            const nowDate = new Date(date);
            if (nowDate >= this.postDateStart && nowDate <= this.postDateEnd) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    // 检查首次登场设置
    // yes_rank 是昨日排名，如果为 0，则此作品是“首次登场”的作品
    checkDebut(yes_rank) {
        if (!_States__WEBPACK_IMPORTED_MODULE_5__["states"].debut || yes_rank === undefined) {
            // 如果没有要求首次登场，或者没有此数据
            return true;
        }
        else {
            // 要求首次登场
            if (yes_rank === 0 || yes_rank === undefined) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    // 检查文件体积
    checkSize(size) {
        if (!_Settings__WEBPACK_IMPORTED_MODULE_0__["form"].sizeSwitch.checked || size === undefined) {
            return true;
        }
        return size >= this.sizeMin && size <= this.sizeMax;
    }
    bindEvent() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].events.crawlStart, () => {
            this.init();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].events.resume, () => {
            // 当需要恢复下载时，初始化过滤器。否则过滤器不会进行过滤
            this.init();
        });
    }
}
const filter = new Filter();



/***/ }),

/***/ "./src/ts/modules/FormHTML.ts":
/*!************************************!*\
  !*** ./src/ts/modules/FormHTML.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");

const formHtml = `<form class="settingForm">
  <div class="tabsTitle">
    <div class="title">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取')}</div>
    <div class="title">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载')}</div>
    <div class="title">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_其他')}</div>
  </div>
  <div class="tabsContnet">
    <div class="con">
      <p class="option" data-no="1">
      <span class="setWantPageWrap">
      <span class="has_tip settingNameStyle1 setWantPageTip1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_页数')}" style="margin-right: 0px;">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_页数')}</span>
      <span class="gray1" style="margin-right: 10px;"> ? </span>
      <input type="text" name="setWantPage" class="setinput_style1 blue setWantPage"
      value = '-1'>
      &nbsp;&nbsp;&nbsp;
      <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
      </span>
      </p>
      <p class="option" data-no="2">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downType0" id="setWorkType0" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType0"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_插画')}&nbsp;</label>
      <input type="checkbox" name="downType1" id="setWorkType1" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType1"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_漫画')}&nbsp;</label>
      <input type="checkbox" name="downType2" id="setWorkType2" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType2"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_动图')}&nbsp;</label>
      <input type="checkbox" name="downType3" id="setWorkType3" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType3"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_小说')}&nbsp;</label>
      </p>
      <p class="option" data-no="21">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downSingleImg" id="setDownSingleImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownSingleImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_单图作品')}&nbsp;</label>
      <input type="checkbox" name="downMultiImg" id="setDownMultiImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownMultiImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图作品')}&nbsp;</label>
      </p>
      <p class="option" data-no="23">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downColorImg" id="setDownColorImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownColorImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_彩色图片')}&nbsp;</label>
      <input type="checkbox" name="downBlackWhiteImg" id="setDownBlackWhiteImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownBlackWhiteImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_黑白图片')}&nbsp;</label>
      </p>
      <p class="option" data-no="3">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_怎样下载多图作品')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图下载设置')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="firstFewImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="firstFewImagesSwitch">
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载前几张图片')}&nbsp;
      <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
      </span>
      </p>
      <p class="option" data-no="6">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_只下载已收藏的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_只下载已收藏')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="setOnlyBmk" id="setOnlyBmk" class="need_beautify checkbox_switch"> 
      <span class="beautify_switch"></span>
      </p>
      <p class="option" data-no="5">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置收藏数量的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置收藏数量')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="BMKNumSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="BMKNumSwitch">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_最小值')}&nbsp;</span>
      <input type="text" name="BMKNumMin" class="setinput_style1 blue bmkNum" value="0">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_最大值')}&nbsp;</span>
      <input type="text" name="BMKNumMax" class="setinput_style1 blue bmkNum" value="0">
      </span>
      </p>
      <p class="option" data-no="7">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_筛选宽高的按钮Title')} ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_筛选宽高的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_筛选宽高的按钮文字')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="setWHSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="setWHSwitch">
      <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" class="need_beautify radio" value="&" checked>
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr1">and&nbsp;</label>
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" class="need_beautify radio" value="|">
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr2">or&nbsp;</label>
      <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
      </span>
      </p>
      <p class="option" data-no="8">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置宽高比例Title')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置宽高比例')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="ratioSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="ratioSwitch">
      <input type="radio" name="ratio" id="ratio1" class="need_beautify radio" value="1">
      <span class="beautify_radio"></span>
      <label for="ratio1"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_横图')}&nbsp; </label>
      <input type="radio" name="ratio" id="ratio2" class="need_beautify radio" value="2">
      <span class="beautify_radio"></span>
      <label for="ratio2"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_竖图')}&nbsp; </label>
      <input type="radio" name="ratio" id="ratio3" class="need_beautify radio" value="3">
      <span class="beautify_radio"></span>
      <label for="ratio3"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_输入宽高比')}</label>
      <input type="text" name="userRatio" class="setinput_style1 blue" value="">
      </span>
      </p>
      <p class="option" data-no="9">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置id范围提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置id范围')}&nbsp;&nbsp; <span class="gray1"> ? </span></span>
      <input type="checkbox" name="idRangeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="idRangeSwitch">
      <input type="radio" name="idRange" id="idRange1" class="need_beautify radio" value="1" checked>
      <span class="beautify_radio"></span>
      <label for="idRange1">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_大于')}&nbsp; </label>
      <input type="radio" name="idRange" id="idRange2" class="need_beautify radio" value="2">
      <span class="beautify_radio"></span>
      <label for="idRange2">  ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_小于')}&nbsp; </label>
      <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="">
      </span>
      </p>
      <p class="option" data-no="10">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置投稿时间提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置投稿时间')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="postDate" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="postDate">
      <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      &nbsp;-&nbsp;
      <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      </span>
      </p>
      <p class="option" data-no="11">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_必须tag的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_必须含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="needTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="needTagSwitch">
      <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
      </span>
      </p>
      <p class="option" data-no="12">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除tag的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_不能含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="notNeedTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="notNeedTagSwitch">
      <input type="text" name="notNeedTag" class="setinput_style1 blue setinput_tag">
      </span>
      </p>

      <slot data-name="crawlBtns" class="centerWrap_btns"></slot>
    </div>
    <div class="con">
    <p class="option" data-no="13">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置文件夹名的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名规则')}<span class="gray1"> ? </span></span>
      <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="{id}">
      <select name="fileNameSelect">
        <option value="default">…</option>
        <option value="{id}">{id}</option>
        <option value="{user}">{user}</option>
        <option value="{user_id}">{user_id}</option>
        <option value="{title}">{title}</option>
        <option value="{p_title}">{p_title}</option>
        <option value="{tags}">{tags}</option>
        <option value="{tags_translate}">{tags_translate}</option>
        <option value="{tags_transl_only}">{tags_transl_only}</option>
        <option value="{p_tag}">{p_tag}</option>
        <option value="{type}">{type}</option>
        <option value="{bmk}">{bmk}</option>
        <option value="{rank}">{rank}</option>
        <option value="{date}">{date}</option>
        <option value="{px}">{px}</option>
        <option value="{series_title}">{series_title}</option>
        <option value="{series_order}">{series_order}</option>
        <option value="{id_num}">{id_num}</option>
        <option value="{p_num}">{p_num}</option>
        </select>
      &nbsp;
      <slot data-name="saveNamingRule" class=""></slot>
      <button class="showFileNameTip textButton" type="button">?</button>
      </p>
      <p class="fileNameTip tip">
      <strong>${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"]
    .transl('_设置文件夹名的提示')
    .replace('<br>', '. ')}</strong>
      <br>
      <span class="blue">{id}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记id')}
      <br>
      <span class="blue">{user}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记user')}
      <br>
      <span class="blue">{user_id}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记userid')}
      <br>
      <span class="blue">{title}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记title')}
      <br>
      <span class="blue">{p_title}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_文件夹标记PTitle')}
      <br>
      <span class="blue">{tags}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记tags')}
      <br>
      <span class="blue">{tags_translate}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记tags_trans')}
      <br>
      <span class="blue">{tags_transl_only}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记tags_transl_only')}
      <br>
      <span class="blue">{p_tag}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_文件夹标记PTag')}
      <br>
      <span class="blue">{type}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记type')}
      <br>
      <span class="blue">{bmk}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记bmk')}
      <br>
      <span class="blue">{rank}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记rank')}
      <br>
      <span class="blue">{date}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记date')}
      <br>
      <span class="blue">{px}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记px')}
      <br>
      <span class="blue">{series_title}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记seriesTitle')}
      <br>
      <span class="blue">{series_order}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记seriesOrder')}
      <br>
      <span class="blue">{id_num}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记id_num')}
      <br>
      <span class="blue">{p_num}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记p_num')}
      <br>
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名标记提醒')}
      </p>

      <p class="option" data-no="29">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_文件名长度限制')}<span class="gray1"> &nbsp; </span></span>
      <input type="checkbox" name="fileNameLengthLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="fileNameLengthLimitSwitch">
      <input type="text" name="fileNameLengthLimit" class="setinput_style1 blue" value="200">
      </span>
      </p>

      <p class="option" data-no="14">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_添加字段名称提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_添加命名标记前缀')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>
      <p class="option" data-no="22">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_第一张图不带序号说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_第一张图不带序号')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="noSerialNo" id="setNoSerialNo" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>
      <p class="option" data-no="19">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图建立目录提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图建立目录')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="multipleImageDir" id="setMultipleImageDir" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="multipleImageDir">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_目录名使用')}</span>
      <input type="radio" name="multipleImageFolderName" id="multipleImageFolderName1" class="need_beautify radio" value="1" checked>
      <span class="beautify_radio"></span>
      <label for="multipleImageFolderName1"> ID&nbsp; </label>
      <input type="radio" name="multipleImageFolderName" id="multipleImageFolderName2" class="need_beautify radio" value="2">
      <span class="beautify_radio"></span>
      <label for="multipleImageFolderName2"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_命名规则')}&nbsp; </label>
      </span>
      </p>

      <p class="option" data-no="15">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_快速下载建立文件夹提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_快速下载建立文件夹')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="alwaysFolder" id="setAlwaysFolder" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      </p>

      <slot data-name="namingBtns" class="centerWrap_btns"></slot>

      <p class="option" data-no="25">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_不符合要求的文件不会被保存')}">
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_文件体积限制')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="sizeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="sizeSwitch">
      <input type="text" name="sizeMin" class="setinput_style1 blue" value="0">MB
      &nbsp;-&nbsp;
      <input type="text" name="sizeMax" class="setinput_style1 blue" value="100">MB
      </span>
      </p>

      <p class="option" data-no="16">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_线程数字')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置下载线程')}<span class="gray1"> ? </span></span>
      <input type="text" name="downloadThread" class="setinput_style1 blue" value="5">
      </p>

      <p class="option" data-no="17">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_快速下载的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_自动开始下载')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="quietDownload" id="setQuietDownload" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <slot data-name="downloadArea"></slot>
      <slot data-name="progressBar"></slot>
    </div>
    
    <div class="con">

      <p class="option" data-no="4">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_动图保存格式title')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_动图保存格式')}<span class="gray1"> ? </span></span>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs1"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_webmVideo')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs3">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_gif')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs4" class="need_beautify radio" value="png"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs4" class="has_tip" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_无损')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_apng')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs2">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_zipFile')} &nbsp;</label>
      </p>

      <p class="option" data-no="24">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_同时转换多少个动图警告')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_同时转换多少个动图')}</span>
      <input type="text" name="convertUgoiraThread" class="setinput_style1 blue" value="1">
      <span class="has_tip gray1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_同时转换多少个动图警告')}"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_提示')} </span>
      </p>

      <p class="option" data-no="26">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_小说保存格式')}<span class="gray1"> &nbsp; </span></span>
      <input type="radio" name="novelSaveAs" id="novelSaveAs1" class="need_beautify radio" value="txt" checked>
      <span class="beautify_radio"></span>
      <label for="novelSaveAs1"> TXT &nbsp;</label>
      <input type="radio" name="novelSaveAs" id="novelSaveAs2" class="need_beautify radio" value="epub"> 
      <span class="beautify_radio"></span>
      <label for="novelSaveAs2"> EPUB &nbsp;</label>
      </p>
      
      <p class="option" data-no="27">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_在小说里保存元数据提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_在小说里保存元数据')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="saveNovelMeta" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="20">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_启用快速收藏说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_启用快速收藏')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="quickBookmarks" id="quickBookmarks" class="need_beautify checkbox_switch" checked> 
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="28">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_不下载重复文件的提示')}">
      ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_不下载重复文件')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="deduplication" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="deduplication">
      <span>&nbsp; ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_策略')}</span>
      <input type="radio" name="dupliStrategy" id="dupliStrategy1" class="need_beautify radio" value="strict" checked>
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_严格模式说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_严格')}</label>
      <input type="radio" name="dupliStrategy" id="dupliStrategy2" class="need_beautify radio" value="loose">
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy2" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_宽松模式说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_宽松')}</label>
      &nbsp;&nbsp;
      <a class="gray1" id="clearDownloadRecords" href="javascript:void(0)">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_清除下载记录')}</a>
      </span>
      </p>

      <p class="option" data-no="18">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_预览搜索结果说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_预览搜索结果')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="previewResult" id="setPreviewResult" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <slot data-name="otherBtns" class="centerWrap_btns"></slot>
    </div>
  </div>
</form>`;
/* harmony default export */ __webpack_exports__["default"] = (formHtml);


/***/ }),

/***/ "./src/ts/modules/ImageToIcon.ts":
/*!***************************************!*\
  !*** ./src/ts/modules/ImageToIcon.ts ***!
  \***************************************/
/*! exports provided: img2ico */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "img2ico", function() { return img2ico; });
// 把图片转换成 icon 文件
// icon 文件结构 https://www.cnblogs.com/cswuyg/p/3603707.html
// 输入选项
// source 图片的 url，或者一个图片文件（如果使用了图片 url，请注意跨域策略的影响）
// size 尺寸，可以同时使用多个尺寸。你也可以使用自定义尺寸。
// shape 指定图标的形状。square 正方形，circle 圆形，fillet 带有圆角的正方形
// bleed 留白，仅当形状是圆角正方形时生效，可以使图片周围有一些留白。
// 输出
// 转换成功后，返回 icon 文件的 Blob 对象
// 生成的 icon 总是正方形（长和宽相等）。如果图片的长度和宽度不相等，则会以窄边作为基准，从窄边开始裁剪出一个正方形
// 生成的 icon 可以包含多种尺寸的图标。图标都是 32 位 png 图像。
class ImageToIcon {
    async convert(opt) {
        return new Promise(async (resolve, reject) => {
            // 加载图片
            const img = await this.loadImage(opt.source);
            // 生成各尺寸的 png 图像的数据
            const pngDataArray = await this.createPngBuffer(img, opt.size, opt.shape, opt.bleed);
            // 创建 ico 文件
            const blob = this.createIcon(pngDataArray);
            resolve(blob);
        });
    }
    async convertImageURL(source) {
        return new Promise(async (resolve, reject) => {
            if (typeof source === 'string') {
                // 请求图片，并为其生成 BlobURL，解决图片跨域导致 canvas 污染的问题
                const res = await fetch(source, {
                    method: 'get',
                    credentials: 'same-origin',
                });
                const blob = await res.blob();
                resolve(URL.createObjectURL(blob));
            }
            else if (source instanceof File) {
                resolve(URL.createObjectURL(source));
            }
            else {
                reject('Unrecognized opt.source');
            }
        });
    }
    async loadImage(source) {
        return new Promise(async (resolve, reject) => {
            let imgURL = await this.convertImageURL(source);
            const i = document.createElement('img');
            i.src = imgURL;
            i.onload = function () {
                resolve(i);
            };
        });
    }
    async createPngBuffer(img, size = [16, 48, 96, 256], shape = 'square', bleed = true) {
        return new Promise(async (resolve, reject) => {
            const buffer = [];
            let length = size.length;
            while (length > 0) {
                const sizeNumber = size[size.length - length];
                const canvas = this.createCanvas(sizeNumber, img);
                // 绘制图像
                this.drawImage(canvas, img, shape, bleed);
                // 把图像转换为 png 图像
                const pngBlob = await this.getPngBlob(canvas);
                // 获取 png 图像的 buffer
                const buf = await pngBlob.arrayBuffer();
                buffer.push({
                    size: sizeNumber,
                    buffer: buf,
                });
                length--;
                if (length === 0) {
                    resolve(buffer);
                }
            }
        });
    }
    createCanvas(size, img) {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        return c;
    }
    drawImage(canvas, img, shape, bleed = true) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('draw error: ctx is null');
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 计算图像被绘制的宽高。比较短的一边占满画布，比较长的一边则根据比例计算绘制的部分
        let dw = 0;
        let dh = 0;
        // 竖图
        if (img.naturalWidth < img.naturalHeight) {
            dw = canvas.width;
            dh = (dw / img.naturalWidth) * img.naturalHeight;
        }
        else {
            // 横图
            dh = canvas.height;
            dw = (dh / img.naturalHeight) * img.naturalWidth;
        }
        // 绘制方形
        if (shape === 'square') {
            ctx.drawImage(img, 0, 0, dw, dh);
        }
        // 绘制圆形
        if (shape === 'circle') {
            let circle = {
                x: canvas.width / 2,
                y: canvas.width / 2,
                r: canvas.width / 2,
            };
            ctx.save();
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
            ctx.clip();
            ctx.drawImage(img, 0, 0, dw, dh);
            ctx.restore();
        }
        // 绘制圆角矩形
        if (shape === 'fillet') {
            let x = 0;
            let y = 0;
            // 当图标尺寸大于 16 时，设置留白距离
            if (bleed && canvas.width > 16) {
                let num = 10 / 256; // 规定留白的比例，即尺寸为 256 时四周留白均为 10 px
                x = Math.ceil(num * canvas.width);
                y = Math.ceil(num * canvas.width);
            }
            // 去掉留白后，最后要保存的图片区域的宽高
            const w = canvas.width - x * 2;
            const h = canvas.height - y * 2;
            // 圆角的半径，设置为保留区域宽高的 1/8
            const r = Math.floor(w / 8);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 0, 0, dw, dh);
        }
        return ctx;
    }
    async getPngBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject('blob is null');
                }
                else {
                    resolve(blob);
                }
            });
        });
    }
    createIcon(pngData) {
        const fileData = [];
        const fileHeadSize = 6;
        // icon 文件头
        const fileHead = new ArrayBuffer(fileHeadSize);
        const v1 = new DataView(fileHead);
        v1.setInt16(0, 0, true); // idReserved
        v1.setInt16(2, 1, true); // idType
        v1.setInt16(4, pngData.length, true); // idCount
        fileData.push(fileHead);
        // 添加 icon 文件入口
        const entrySize = 16;
        const entryTotalSize = entrySize * pngData.length;
        let fileOffset = fileHeadSize + entryTotalSize;
        let fileLength = 0;
        for (const d of pngData) {
            fileOffset += fileLength;
            const entry = new ArrayBuffer(entrySize);
            const v2 = new DataView(entry);
            v2.setInt8(0, d.size); // Width, in pixels, of the image
            v2.setInt8(1, d.size); // Height, in pixels, of the image
            v2.setInt8(2, 0); // Number of colors in image (0 if >=8bpp)
            v2.setInt8(3, 0); // Reserved ( must be 0)
            v2.setInt16(4, 1, true); // Color Planes
            v2.setInt16(6, 32, true); // Bits per pixel
            v2.setInt32(8, d.buffer.byteLength, true); // How many bytes in this resource?
            v2.setInt32(12, fileOffset, true); // Where in the file is this image?
            fileData.push(entry);
            fileLength = d.buffer.byteLength;
        }
        // 添加 png 数据
        for (const d of pngData) {
            fileData.push(d.buffer);
        }
        // 生成 blob 对象
        return new Blob(fileData, {
            type: 'image/vnd.microsoft.icon',
        });
    }
}
const img2ico = new ImageToIcon();



/***/ }),

/***/ "./src/ts/modules/ImgViewer.ts":
/*!*************************************!*\
  !*** ./src/ts/modules/ImgViewer.ts ***!
  \*************************************/
/*! exports provided: ImgViewer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImgViewer", function() { return ImgViewer; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _ThemeColor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ThemeColor */ "./src/ts/modules/ThemeColor.ts");
// 图片查看器
/// <reference path = "./Viewer.d.ts" />


class ImgViewer {
    constructor() {
        this.viewerWarpper = document.createElement('div'); // 图片列表的容器
        this.viewerUl = document.createElement('ul'); // 图片列表的 ul 元素
        this.init();
    }
    // 初始化图片查看器
    newViewer(pageCount, firsturl) {
        // 因为选项里的 size 是枚举类型，所以在这里也要定义一个枚举
        let ToolbarButtonSize;
        (function (ToolbarButtonSize) {
            ToolbarButtonSize["Small"] = "small";
            ToolbarButtonSize["Medium"] = "medium";
            ToolbarButtonSize["Large"] = "large";
        })(ToolbarButtonSize || (ToolbarButtonSize = {}));
        this.myViewer = new Viewer(this.viewerUl, {
            toolbar: {
                zoomIn: 0,
                zoomOut: 0,
                oneToOne: 1,
                reset: 0,
                prev: 1,
                play: {
                    show: 0,
                    size: ToolbarButtonSize.Large,
                },
                next: 1,
                rotateLeft: 0,
                rotateRight: 0,
                flipHorizontal: 0,
                flipVertical: 0,
            },
            url(image) {
                return image.dataset.src;
            },
            viewed(ev) {
                // 当图片显示完成（加载完成）后，预加载下一张图片
                let index = ev.detail.index;
                if (index < pageCount - 1) {
                    index++;
                }
                const nextImg = firsturl.replace('p0', 'p' + index);
                const img = new Image();
                img.src = nextImg;
            },
            // 取消一些动画，比如切换图片时，图片从小变大出现的动画
            transition: false,
            // 取消键盘支持，主要是用键盘左右方向键切换的话，会和 pixiv 页面产生冲突。（pixiv 页面上，左右方向键会切换作品）
            keyboard: false,
            // 不显示 title（图片名和宽高信息）
            title: false,
            // 不显示缩放比例
            tooltip: false,
        });
    }
    init() {
        // 如果之前已经存在图片查看器的元素，则删除重新创建
        // 最好不要重复使用之前的元素。在页面无刷新切换之后，如果复用了之前的元素，只是修改一些内容，那么 Viewer 还是会使用之前的数据，导致出错。
        const test = document.querySelector('main #viewerWarpper');
        test && test.remove();
        // 每次创建新的图片查看器时，删除之前查看器的元素，否则会存在多个
        const test2 = document.querySelector('.viewer-container');
        test2 && test2.remove();
        this.createViewer();
    }
    // 创建图片查看器 html 元素，并绑定一些事件，这个函数只会在初始化时执行一次
    createViewer() {
        if (!document.querySelector('main figcaption')) {
            // 等到作品主体部分的元素生成之后再创建查看器
            setTimeout(() => {
                this.createViewer();
            }, 300);
            return;
        }
        // 查看器图片列表元素的结构： div#viewerWarpper > ul > li > img
        this.viewerWarpper = document.createElement('div');
        this.viewerWarpper.id = 'viewerWarpper';
        this.viewerUl = document.createElement('ul');
        this.viewerWarpper.appendChild(this.viewerUl);
        _ThemeColor__WEBPACK_IMPORTED_MODULE_1__["themeColor"].register(this.viewerWarpper);
        document
            .querySelector('main figcaption')
            .insertAdjacentElement('beforebegin', this.viewerWarpper);
        // 图片查看器显示之后
        this.viewerUl.addEventListener('shown', () => {
            // 显示相关元素
            this.showViewerOther();
            // 点击 1：1 按钮时，全屏查看
            document
                .querySelector('.viewer-one-to-one')
                .addEventListener('click', () => {
                this.hideViewerOther(); // 隐藏查看器的其他元素
                // 进入全屏
                document.body.requestFullscreen();
                // 使图片居中显示，必须加延迟
                setTimeout(() => {
                    this.setViewerCenter();
                }, 100);
                setInterval(() => {
                    this.zoomToMax();
                }, 100);
            });
        });
        // 全屏状态下，查看和切换图片时，显示比例始终为 100%
        this.viewerUl.addEventListener('view', () => {
            if (this.isFullscreen()) {
                setTimeout(() => {
                    // 通过点击 1:1 按钮，调整为100%并居中。这里必须要加延时，否则点击的时候图片还是旧的
                    ;
                    document.querySelector('.viewer-one-to-one').click();
                }, 50);
            }
        });
        // 隐藏查看器时，如果还处于全屏，则退出全屏
        this.viewerUl.addEventListener('hidden', () => {
            if (this.isFullscreen()) {
                document.exitFullscreen();
            }
        });
        // esc 退出图片查看器
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Escape') {
                this.myViewer && this.myViewer.hide();
            }
        });
        void [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
        ].forEach((arg) => {
            // 检测全屏状态变化，目前有兼容性问题（这里也相当于绑定了按 esc 退出的事件）
            document.addEventListener(arg, () => {
                // 退出全屏
                if (!this.isFullscreen()) {
                    this.showViewerOther();
                }
            });
        });
        this.updateViewer();
    }
    // 根据作品信息，更新图片查看器配置。每当页面更新时执行一次
    async updateViewer() {
        this.viewerWarpper.style.display = 'none'; // 先隐藏 viewerWarpper
        // 获取作品信息
        const data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(_API__WEBPACK_IMPORTED_MODULE_0__["API"].getIllustId());
        const body = data.body;
        // 处理插画或漫画作品，不处理动图作品
        if (body.illustType === 0 || body.illustType === 1) {
            // 有多张图片时，创建缩略图
            if (body.pageCount > 1) {
                const { thumb, original } = body.urls;
                // 生成缩略图列表
                let html = [];
                for (let index = 0; index < body.pageCount; index++) {
                    const str = `<li><img src="${thumb.replace('p0', 'p' + index)}" data-src="${original.replace('p0', 'p' + index)}"></li>`;
                    html.push(str);
                }
                this.viewerUl.innerHTML = html.join('');
                // 数据更新后，显示 viewerWarpper
                this.viewerWarpper.style.display = 'block';
                // 销毁看图组件
                if (this.myViewer) {
                    this.myViewer.destroy();
                }
                // 配置看图组件
                this.newViewer(body.pageCount, original);
                // 预加载第一张图片
                const img = new Image();
                img.src = original;
            }
        }
    }
    // 隐藏查看器的其他元素
    hideViewerOther() {
        document
            .querySelector('.viewer-container')
            .classList.add('black-background');
        // 隐藏底部的其他元素，仍然显示左右切换按钮
        const close = document.querySelector('.viewer-close');
        const oneToOne = document.querySelector('.viewer-one-to-one');
        const navbar = document.querySelector('.viewer-navbar');
        for (const element of [close, oneToOne, navbar]) {
            element.style.display = 'none';
        }
    }
    // 显示查看器的其他元素
    showViewerOther() {
        document
            .querySelector('.viewer-container')
            .classList.remove('black-background');
        // 显示底部隐藏的元素
        const close = document.querySelector('.viewer-close');
        const oneToOne = document.querySelector('.viewer-one-to-one');
        const navbar = document.querySelector('.viewer-navbar');
        for (const element of [close, oneToOne, navbar]) {
            element.style.display = 'block';
        }
    }
    zoomToMax() {
        const img = document.querySelector('.viewer-move');
        if (this.isFullscreen() && parseInt(img.style.width) < img.naturalWidth) {
            // img.style.width=img.naturalWidth+'px'
            // img.style.height = img.naturalHeight+'px'
            this.myViewer.zoomTo(1);
        }
    }
    // 在图片100%显示时，使其居中
    setViewerCenter() {
        // 获取图片宽高
        const imgInfo = document.querySelector('.viewer-title').textContent;
        // 如果图片尚未加载出来的话，就没有内容，就过一会儿再执行
        if (!imgInfo) {
            setTimeout(() => {
                this.setViewerCenter();
            }, 200);
            return;
        }
        const [imgWidth, imgHeight] = /\d{1,5} × \d{1,5}/
            .exec(imgInfo)[0]
            .split(' × ');
        // > '66360324_p5_master1200.jpg (919 × 1300)'
        // < ["919", "1300"]
        // 获取网页宽高
        const htmlWidth = document.documentElement.clientWidth;
        const htmlHeight = document.documentElement.clientHeight;
        // 设置边距
        const setWidth = (htmlWidth - parseInt(imgWidth)) / 2;
        let setHeight = (htmlHeight - parseInt(imgHeight)) / 2;
        // 当图片高度大于浏览器窗口高度时，居顶显示而不是居中
        // if (setHeight < 0) {
        //   setHeight = 0
        // }
        this.myViewer.zoomTo(1);
        this.myViewer.moveTo(setWidth, setHeight);
    }
    // 判断是否处于全屏状态
    isFullscreen() {
        return !!document.fullscreenElement;
    }
    // 判断看图器是否处于显示状态
    viewerIsShow() {
        const viewerContainer = document.querySelector('.viewer-container');
        if (viewerContainer) {
            return viewerContainer.classList.contains('viewer-in');
        }
        else {
            return false;
        }
    }
}



/***/ }),

/***/ "./src/ts/modules/IndexedDB.ts":
/*!*************************************!*\
  !*** ./src/ts/modules/IndexedDB.ts ***!
  \*************************************/
/*! exports provided: IndexedDB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexedDB", function() { return IndexedDB; });
// 封装操作 IndexedDB 的一些公共方法，仅满足本程序使用，并不完善
class IndexedDB {
    async open(DBName, DBVer, onUpgrade) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DBName, DBVer);
            request.onupgradeneeded = (ev) => {
                if (onUpgrade) {
                    onUpgrade(request.result);
                }
            };
            request.onsuccess = (ev) => {
                this.db = request.result;
                resolve(request.result);
            };
            request.onerror = (ev) => {
                console.error('open indexDB failed');
                reject(ev);
            };
        });
    }
    async add(storeNames, data) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const r = this.db
                .transaction(storeNames, 'readwrite')
                .objectStore(storeNames)
                .add(data);
            r.onsuccess = (ev) => {
                resolve(ev);
            };
            r.onerror = (ev) => {
                console.error('add failed');
                reject(ev);
            };
        });
    }
    async put(storeNames, data) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const r = this.db
                .transaction(storeNames, 'readwrite')
                .objectStore(storeNames)
                .put(data);
            r.onsuccess = (ev) => {
                resolve(ev);
            };
            r.onerror = (ev) => {
                console.error('put failed');
                reject(ev);
            };
        });
    }
    // 如果没有找到对应的记录，则返回 null
    async get(storeNames, key, index) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const store = this.db
                .transaction(storeNames, 'readonly')
                .objectStore(storeNames);
            let r;
            if (index !== undefined) {
                const i = store.index(index);
                r = i.get(key);
            }
            else {
                r = store.get(key);
            }
            r.onsuccess = (ev) => {
                const data = r.result;
                if (data) {
                    resolve(data);
                }
                resolve(null);
            };
            r.onerror = (ev) => {
                console.error('add failed');
                reject(ev);
            };
        });
    }
    async delete(storeNames, key) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const r = this.db
                .transaction(storeNames, 'readwrite')
                .objectStore(storeNames)
                .delete(key);
            r.onsuccess = (ev) => {
                resolve(ev);
            };
            r.onerror = (ev) => {
                console.error('delete failed');
                reject(ev);
            };
        });
    }
    async clear(storeNames) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const r = this.db
                .transaction(storeNames, 'readwrite')
                .objectStore(storeNames)
                .clear();
            r.onsuccess = (ev) => {
                resolve();
            };
            r.onerror = (ev) => {
                console.error('clear failed');
                reject(ev);
            };
        });
    }
    async openCursor(storeNames, CB) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const r = this.db
                .transaction(storeNames)
                .objectStore(storeNames)
                .openCursor();
            r.onsuccess = (ev) => {
                CB(r.result);
                resolve(); // 这个 resolve 会在 cb 执行一次之后就触发
            };
            r.onerror = (ev) => {
                console.error('openCursor failed');
                reject(ev);
            };
        });
    }
}



/***/ }),

/***/ "./src/ts/modules/InitBookmarkLegacyPage.ts":
/*!**************************************************!*\
  !*** ./src/ts/modules/InitBookmarkLegacyPage.ts ***!
  \**************************************************/
/*! exports provided: InitBookmarkLegacyPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkLegacyPage", function() { return InitBookmarkLegacyPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _BookmarksAddTag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BookmarksAddTag */ "./src/ts/modules/BookmarksAddTag.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./PageInfo */ "./src/ts/modules/PageInfo.ts");
// 初始化旧版收藏页面










class InitBookmarkLegacyPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.idList = []; // 储存从列表页获取到的 id
        this.type = 'illusts'; // 页面是图片还是小说
        this.tag = ''; // 储存当前页面带的 tag，不过有时并没有
        this.isHide = false; // 当前页面是否显示的是非公开收藏
        this.requsetNumber = 0; // 根据页数，计算要抓取的作品个数
        this.onceRequest = 100; // 每次请求多少个数量
        this.offset = 0; // 要去掉的作品数量
        this.crawlRecommended = false; // 是否抓取推荐作品（收藏页面下方）
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
        // 添加下载推荐作品的按钮
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取推荐作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取推荐作品Title')],
        ]).addEventListener('click', () => {
            this.crawlRecommended = true;
            this.readyCrawl();
        }, false);
        // 如果存在 token，则添加“添加 tag”按钮
        if (_API__WEBPACK_IMPORTED_MODULE_1__["API"].getToken()) {
            const btn = _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('otherBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_添加tag'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_添加tag')]]);
            new _BookmarksAddTag__WEBPACK_IMPORTED_MODULE_5__["BookmarksAddTag"](btn);
        }
    }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_数字提示1'),
            value: '-1',
        });
        // 在书签页面隐藏只要书签选项
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([6]);
    }
    getWantPage() {
        let pageTip = '';
        if (this.crawlRecommended) {
            pageTip = _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载推荐作品');
        }
        else {
            pageTip = _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载所有页面');
        }
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载x页'), pageTip);
    }
    nextStep() {
        if (window.location.pathname.includes('/novel')) {
            this.type = 'novels';
        }
        if (this.crawlRecommended) {
            // 下载推荐作品
            this.getRecommendedList();
        }
        else {
            this.readyGetIdList();
            // 获取 id 列表
            this.getIdList();
        }
    }
    readyGetIdList() {
        // 每页个数
        const onceNumber = 20;
        // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
        const nowPage = _API__WEBPACK_IMPORTED_MODULE_1__["API"].getURLSearchField(location.href, 'p'); // 判断当前处于第几页，页码从 1 开始。也可能没有页码
        if (nowPage) {
            this.offset = (parseInt(nowPage) - 1) * onceNumber;
        }
        if (this.offset < 0) {
            this.offset = 0;
        }
        // 根据页数设置，计算要下载的个数
        this.requsetNumber = 0;
        if (this.crawlNumber === -1) {
            this.requsetNumber = 9999999;
        }
        else {
            this.requsetNumber = onceNumber * this.crawlNumber;
        }
        this.tag = _PageInfo__WEBPACK_IMPORTED_MODULE_9__["pageInfo"].tag;
        // 判断是公开收藏还是非公开收藏
        // 在新旧版 url 里，rest 都是在查询字符串里的
        this.isHide = _API__WEBPACK_IMPORTED_MODULE_1__["API"].getURLSearchField(location.href, 'rest') === 'hide';
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_正在抓取'));
        if (this.crawlNumber === -1) {
            _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_获取全部书签作品'));
        }
    }
    // 获取用户的收藏作品列表
    async getIdList() {
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getBookmarkData(_DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].getUserId(), this.type, this.tag, this.offset, this.isHide);
        }
        catch (error) {
            this.getIdList();
            return;
        }
        if (data.body.works.length === 0 ||
            this.idList.length >= this.requsetNumber) {
            // 书签页获取完毕
            return this.afterGetIdList();
        }
        else {
            // 没有抓取完毕时，添加数据
            const idType = this.type === 'illusts' ? 'unknown' : 'novels';
            data.body.works.forEach((data) => this.idList.push({
                type: idType,
                id: data.id,
            }));
            this.offset += this.onceRequest; // 每次增加偏移量
            // 重复抓取过程
            this.getIdList();
        }
    }
    // 获取作品 id 列表完毕之后
    afterGetIdList() {
        // 因为书签页面一次获取 100 个作品，大于一页的数量。所以可能会抓取多了，需要删除多余的作品
        if (this.idList.length > this.requsetNumber) {
            // 删除后面部分（较早收藏的），留下近期收藏的
            this.idList.splice(this.requsetNumber, this.idList.length);
            // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由近期到早期排列的
        }
        _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList = _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.concat(this.idList);
        this.getIdListFinished();
    }
    // 获取书签页面下方的推荐作品列表
    getRecommendedList() {
        const selector = this.type === 'illusts'
            ? '#illust-recommend .image-item'
            : '.novel-items>li';
        const idType = this.type === 'illusts' ? 'unknown' : 'novels';
        const getId = this.type === 'illusts' ? _API__WEBPACK_IMPORTED_MODULE_1__["API"].getIllustId : _API__WEBPACK_IMPORTED_MODULE_1__["API"].getNovelId;
        // 获取下方已经加载出来的作品
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            this.crawlRecommended = false;
            return this.noResult();
        }
        // 添加作品列表
        for (const li of elements) {
            const a = li.querySelector('a');
            if (_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.length === this.crawlNumber) {
                break;
            }
            _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                type: idType,
                id: getId(a.href),
            });
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.type = 'illusts';
        this.idList = [];
        this.offset = 0;
        this.tag = '';
        this.listPageFinished = 0;
        this.crawlRecommended = false; // 解除下载推荐作品的标记
    }
    sortResult() {
        // 把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
        !this.crawlRecommended && _Store__WEBPACK_IMPORTED_MODULE_6__["store"].result.reverse();
    }
}



/***/ }),

/***/ "./src/ts/modules/InitBookmarkPage.ts":
/*!********************************************!*\
  !*** ./src/ts/modules/InitBookmarkPage.ts ***!
  \********************************************/
/*! exports provided: InitBookmarkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkPage", function() { return InitBookmarkPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _BookmarksAddTag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BookmarksAddTag */ "./src/ts/modules/BookmarksAddTag.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./PageInfo */ "./src/ts/modules/PageInfo.ts");
// 初始化新版收藏页面










class InitBookmarkPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.idList = []; // 储存从列表页获取到的 id
        this.type = 'illusts'; // 页面是图片还是小说
        this.tag = ''; // 储存当前页面带的 tag，不过有时并没有
        this.isHide = false; // 当前页面是否显示的是非公开收藏
        this.requsetNumber = 0; // 根据页数，计算要抓取的作品个数
        this.onceRequest = 100; // 每次请求多少个数量
        this.offset = 0; // 要去掉的作品数量
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
        // 如果存在 token，则添加“添加 tag”按钮
        if (_API__WEBPACK_IMPORTED_MODULE_1__["API"].getToken()) {
            const btn = _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('otherBtns', _Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_添加tag'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_添加tag')]]);
            new _BookmarksAddTag__WEBPACK_IMPORTED_MODULE_5__["BookmarksAddTag"](btn);
        }
    }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_数字提示1'),
            value: '-1',
        });
        // 在书签页面隐藏只要书签选项
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([6]);
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载所有页面'));
    }
    nextStep() {
        if (window.location.pathname.includes('/novel')) {
            this.type = 'novels';
        }
        this.readyGetIdList();
        this.getIdList();
    }
    readyGetIdList() {
        // 每页个数
        const onceNumber = 48;
        // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
        const nowPage = _API__WEBPACK_IMPORTED_MODULE_1__["API"].getURLSearchField(location.href, 'p'); // 判断当前处于第几页，页码从 1 开始。也可能没有页码
        if (nowPage) {
            this.offset = (parseInt(nowPage) - 1) * onceNumber;
        }
        if (this.offset < 0) {
            this.offset = 0;
        }
        // 根据页数设置，计算要下载的个数
        this.requsetNumber = 0;
        if (this.crawlNumber === -1) {
            this.requsetNumber = 9999999;
        }
        else {
            this.requsetNumber = onceNumber * this.crawlNumber;
        }
        this.tag = _PageInfo__WEBPACK_IMPORTED_MODULE_9__["pageInfo"].tag;
        // 判断是公开收藏还是非公开收藏
        // 在新旧版 url 里，rest 都是在查询字符串里的
        this.isHide = _API__WEBPACK_IMPORTED_MODULE_1__["API"].getURLSearchField(location.href, 'rest') === 'hide';
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_正在抓取'));
        if (this.crawlNumber === -1) {
            _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_获取全部书签作品'));
        }
    }
    // 获取用户的收藏作品列表
    async getIdList() {
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getBookmarkData(_DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].getUserId(), this.type, this.tag, this.offset, this.isHide);
        }
        catch (error) {
            this.getIdList();
            return;
        }
        if (data.body.works.length === 0 ||
            this.idList.length >= this.requsetNumber) {
            // 书签页获取完毕
            return this.afterGetIdList();
        }
        else {
            // 没有抓取完毕时，添加数据
            const idType = this.type === 'illusts' ? 'unknown' : 'novels';
            data.body.works.forEach((data) => this.idList.push({
                type: idType,
                id: data.id,
            }));
            this.offset += this.onceRequest; // 每次增加偏移量
            // 重复抓取过程
            this.getIdList();
        }
    }
    // 获取作品 id 列表完毕之后
    afterGetIdList() {
        // 因为书签页面一次获取 100 个作品，大于一页的数量。所以可能会抓取多了，需要删除多余的作品
        if (this.idList.length > this.requsetNumber) {
            // 删除后面部分（较早收藏的），留下近期收藏的
            this.idList.splice(this.requsetNumber, this.idList.length);
            // 书签页面的 api 没有考虑页面上的排序顺序，获取到的 id 列表始终是按收藏顺序由近期到早期排列的
        }
        _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList = _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.concat(this.idList);
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.type = 'illusts';
        this.idList = [];
        this.offset = 0;
        this.tag = '';
        this.listPageFinished = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/InitFollowingPage.ts":
/*!*********************************************!*\
  !*** ./src/ts/modules/InitFollowingPage.ts ***!
  \*********************************************/
/*! exports provided: InitFollowingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitFollowingPage", function() { return InitFollowingPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
// 初始化关注列表页面








class InitFollowingPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.baseOffset = 0; // 开始抓取时，记录初始的偏移量
        this.onceNumber = 24; // 每页 24 个画师
        this.getUserListNo = 0; // 获取用户列表时，记录请求的次数
        this.limit = 100; // 每次请求多少个画师的数据
        this.totalNeed = Number.MAX_SAFE_INTEGER;
        this.myId = '';
        this.rest = 'show';
        this.userList = [];
        this.index = 0; // getIdList 时，对 userList 的索引
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_7__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
            value: '-1',
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
    }
    nextStep() {
        this.readyGet();
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_正在抓取'));
        this.getUserList();
    }
    readyGet() {
        this.rest = location.href.includes('rest=hide') ? 'hide' : 'show';
        // 获取抓取开始时的页码
        const nowPage = _API__WEBPACK_IMPORTED_MODULE_4__["API"].getURLSearchField(location.href, 'p');
        // 计算开始抓取时的偏移量
        if (nowPage !== '') {
            this.baseOffset = (parseInt(nowPage) - 1) * this.onceNumber;
        }
        else {
            this.baseOffset = 0;
        }
        // 要抓取多少个用户
        this.totalNeed = Number.MAX_SAFE_INTEGER;
        if (this.crawlNumber !== -1) {
            this.totalNeed = this.onceNumber * this.crawlNumber;
        }
        // 获取用户自己的 id
        const test = /users\/(\d*)\//.exec(location.href);
        if (test && test.length > 1) {
            this.myId = test[1];
        }
        else {
            const msg = `Get the user's own id failed`;
            _Log__WEBPACK_IMPORTED_MODULE_6__["log"].error(msg, 2);
            throw new Error(msg);
        }
    }
    // 获取关注用户列表，保存用户 id
    async getUserList() {
        const offset = this.baseOffset + this.getUserListNo * this.limit;
        let res;
        try {
            res = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getFollowingList(this.myId, this.rest, offset);
        }
        catch (_a) {
            this.getUserList();
            return;
        }
        const users = res.body.users;
        if (users.length === 0) {
            // 用户列表抓取完毕
            return this.getUserListComplete();
        }
        for (const userData of users) {
            this.userList.push(userData.userId);
            if (this.userList.length >= this.totalNeed) {
                // 抓取到了指定数量的用户
                return this.getUserListComplete();
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前有x个用户', this.userList.length.toString()), 1, false);
        this.getUserListNo++;
        this.getUserList();
    }
    getUserListComplete() {
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前有x个用户', this.userList.length.toString()));
        if (this.userList.length === 0) {
            return this.getIdListFinished();
        }
        this.getIdList();
    }
    // 获取用户的 id 列表
    async getIdList() {
        let idList = [];
        try {
            idList = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getUserWorksByType(this.userList[this.index]);
        }
        catch (_a) {
            this.getIdList();
            return;
        }
        _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.concat(idList);
        this.index++;
        if (this.index >= this.userList.length) {
            return this.getIdListFinished();
        }
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前作品个数', _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.length.toString()), 1, false);
        this.getIdList();
    }
    resetGetIdListStatus() {
        this.listPageFinished = 0;
        this.userList = [];
        this.getUserListNo = 0;
        this.index = 0;
    }
    sortResult() {
        // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
        _Store__WEBPACK_IMPORTED_MODULE_5__["store"].result.sort(_API__WEBPACK_IMPORTED_MODULE_4__["API"].sortByProperty('id'));
    }
}



/***/ }),

/***/ "./src/ts/modules/InitIndexPage.ts":
/*!*****************************************!*\
  !*** ./src/ts/modules/InitIndexPage.ts ***!
  \*****************************************/
/*! exports provided: InitIndexPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitIndexPage", function() { return InitIndexPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
// 初始化首页








class InitIndexPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.downIdButton = document.createElement('button');
        this.downIdInput = document.createElement('textarea');
        this.ready = false;
        this.init();
    }
    appendCenterBtns() {
        this.downIdButton = _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_输入id进行抓取'), [['id', 'down_id_button']]);
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].addBtn('otherBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_清空已保存的抓取结果')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].events.clearSavedCrawl);
        });
    }
    appendElseEl() {
        // 用于输入id的输入框
        this.downIdInput.id = 'down_id_input';
        this.downIdInput.style.display = 'none';
        this.downIdInput.setAttribute('placeholder', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_输入id进行抓取的提示文字'));
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].insertToHead(this.downIdInput);
    }
    setFormOption() {
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].hideOption([1]);
    }
    initElse() {
        this.downIdButton.addEventListener('click', () => {
            if (!this.ready) {
                // 还没准备好
                _EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].events.closeCenterPanel);
                this.downIdInput.style.display = 'block';
                this.downIdInput.focus();
                document.documentElement.scrollTop = 0;
            }
            else {
                this.readyCrawl();
            }
        }, false);
        // 当输入框内容改变时检测，非空值时显示下载区域
        this.downIdInput.addEventListener('change', () => {
            if (this.downIdInput.value !== '') {
                this.ready = true;
                _EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].events.openCenterPanel);
                this.downIdButton.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取');
            }
            else {
                this.ready = false;
                _EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_7__["EVT"].events.closeCenterPanel);
                this.downIdButton.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_输入id进行抓取');
            }
        });
    }
    getWantPage() { }
    getIdList() {
        // 检查页面类型，设置输入的 id 的作品类型
        const type = window.location.pathname === '/novel/' ? 'novels' : 'unknown';
        // 检测 id 是否合法
        const array = this.downIdInput.value.split('\n');
        const idSet = new Set();
        for (const str of array) {
            const id = parseInt(str);
            if (isNaN(id) || id < 22 || id > 99999999) {
                // 对不符合要求的 id 显示提示。如果 id 是空字符串则不显示提示
                str !== '' && _Log__WEBPACK_IMPORTED_MODULE_6__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_id不合法') + ': ' + str);
            }
            else {
                idSet.add(id);
            }
        }
        // 添加 id
        for (const id of idSet.values()) {
            _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
                type: type,
                id: id.toString(),
            });
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() { }
    destroy() {
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].clearSlot('crawlBtns');
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].clearSlot('otherBtns');
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].removeEl(this.downIdInput);
    }
}



/***/ }),

/***/ "./src/ts/modules/InitPage.ts":
/*!************************************!*\
  !*** ./src/ts/modules/InitPage.ts ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PageType */ "./src/ts/modules/PageType.ts");
/* harmony import */ var _InitIndexPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InitIndexPage */ "./src/ts/modules/InitIndexPage.ts");
/* harmony import */ var _artwork_InitArtworkPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./artwork/InitArtworkPage */ "./src/ts/modules/artwork/InitArtworkPage.ts");
/* harmony import */ var _InitUserPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./InitUserPage */ "./src/ts/modules/InitUserPage.ts");
/* harmony import */ var _InitBookmarkLegacyPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./InitBookmarkLegacyPage */ "./src/ts/modules/InitBookmarkLegacyPage.ts");
/* harmony import */ var _InitBookmarkPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./InitBookmarkPage */ "./src/ts/modules/InitBookmarkPage.ts");
/* harmony import */ var _artwork_InitSearchArtworkPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./artwork/InitSearchArtworkPage */ "./src/ts/modules/artwork/InitSearchArtworkPage.ts");
/* harmony import */ var _artwork_InitAreaRankingPage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./artwork/InitAreaRankingPage */ "./src/ts/modules/artwork/InitAreaRankingPage.ts");
/* harmony import */ var _artwork_InitRankingArtworkPage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./artwork/InitRankingArtworkPage */ "./src/ts/modules/artwork/InitRankingArtworkPage.ts");
/* harmony import */ var _InitPixivisionPage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./InitPixivisionPage */ "./src/ts/modules/InitPixivisionPage.ts");
/* harmony import */ var _artwork_InitBookmarkDetailPage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./artwork/InitBookmarkDetailPage */ "./src/ts/modules/artwork/InitBookmarkDetailPage.ts");
/* harmony import */ var _artwork_InitBookmarkNewArtworkPage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./artwork/InitBookmarkNewArtworkPage */ "./src/ts/modules/artwork/InitBookmarkNewArtworkPage.ts");
/* harmony import */ var _artwork_InitDiscoverPage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./artwork/InitDiscoverPage */ "./src/ts/modules/artwork/InitDiscoverPage.ts");
/* harmony import */ var _artwork_InitNewArtworkPage__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./artwork/InitNewArtworkPage */ "./src/ts/modules/artwork/InitNewArtworkPage.ts");
/* harmony import */ var _novel_InitNovelPage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./novel/InitNovelPage */ "./src/ts/modules/novel/InitNovelPage.ts");
/* harmony import */ var _novel_InitNovelSeriesPage__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./novel/InitNovelSeriesPage */ "./src/ts/modules/novel/InitNovelSeriesPage.ts");
/* harmony import */ var _novel_InitSearchNovelPage__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./novel/InitSearchNovelPage */ "./src/ts/modules/novel/InitSearchNovelPage.ts");
/* harmony import */ var _novel_InitRankingNovelPage__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./novel/InitRankingNovelPage */ "./src/ts/modules/novel/InitRankingNovelPage.ts");
/* harmony import */ var _novel_InitBookmarkNewNovelPage__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./novel/InitBookmarkNewNovelPage */ "./src/ts/modules/novel/InitBookmarkNewNovelPage.ts");
/* harmony import */ var _novel_InitNewNovelPage__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./novel/InitNewNovelPage */ "./src/ts/modules/novel/InitNewNovelPage.ts");
/* harmony import */ var _artwork_InitSeriesPage__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./artwork/InitSeriesPage */ "./src/ts/modules/artwork/InitSeriesPage.ts");
/* harmony import */ var _InitFollowingPage__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./InitFollowingPage */ "./src/ts/modules/InitFollowingPage.ts");
// 根据不同的页面，初始化下载器的功能























class InitPage {
    constructor() {
        this.initPage();
        // 页面类型变化时，初始化抓取流程
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.pageSwitchedTypeChange, () => {
            setTimeout(() => {
                this.initPage();
            }, 0);
        });
    }
    initPage() {
        switch (_PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].getPageType()) {
            case 0:
                return new _InitIndexPage__WEBPACK_IMPORTED_MODULE_2__["InitIndexPage"]();
            case 1:
                return new _artwork_InitArtworkPage__WEBPACK_IMPORTED_MODULE_3__["InitArtworkPage"]();
            case 2:
                return new _InitUserPage__WEBPACK_IMPORTED_MODULE_4__["InitUserPage"]();
            case 3:
                return new _InitBookmarkLegacyPage__WEBPACK_IMPORTED_MODULE_5__["InitBookmarkLegacyPage"]();
            case 4:
                return new _InitBookmarkPage__WEBPACK_IMPORTED_MODULE_6__["InitBookmarkPage"]();
            case 5:
                return new _artwork_InitSearchArtworkPage__WEBPACK_IMPORTED_MODULE_7__["InitSearchArtworkPage"]();
            case 6:
                return new _artwork_InitAreaRankingPage__WEBPACK_IMPORTED_MODULE_8__["InitAreaRankingPage"]();
            case 7:
                return new _artwork_InitRankingArtworkPage__WEBPACK_IMPORTED_MODULE_9__["InitRankingArtworkPage"]();
            case 8:
                return new _InitPixivisionPage__WEBPACK_IMPORTED_MODULE_10__["InitPixivisionPage"]();
            case 9:
                return new _artwork_InitBookmarkDetailPage__WEBPACK_IMPORTED_MODULE_11__["InitBookmarkDetailPage"]();
            case 10:
                return new _artwork_InitBookmarkNewArtworkPage__WEBPACK_IMPORTED_MODULE_12__["InitBookmarkNewArtworkPage"]();
            case 11:
                return new _artwork_InitDiscoverPage__WEBPACK_IMPORTED_MODULE_13__["InitDiscoverPage"]();
            case 12:
                return new _artwork_InitNewArtworkPage__WEBPACK_IMPORTED_MODULE_14__["InitNewArtworkPage"]();
            case 13:
                return new _novel_InitNovelPage__WEBPACK_IMPORTED_MODULE_15__["InitNovelPage"]();
            case 14:
                return new _novel_InitNovelSeriesPage__WEBPACK_IMPORTED_MODULE_16__["InitNovelSeriesPage"]();
            case 15:
                return new _novel_InitSearchNovelPage__WEBPACK_IMPORTED_MODULE_17__["InitSearchNovelPage"]();
            case 16:
                return new _novel_InitRankingNovelPage__WEBPACK_IMPORTED_MODULE_18__["InitRankingNovelPage"]();
            case 17:
                return new _novel_InitBookmarkNewNovelPage__WEBPACK_IMPORTED_MODULE_19__["InitBookmarkNewNovelPage"]();
            case 18:
                return new _novel_InitNewNovelPage__WEBPACK_IMPORTED_MODULE_20__["InitNewNovelPage"]();
            case 19:
                return new _artwork_InitSeriesPage__WEBPACK_IMPORTED_MODULE_21__["InitSeriesPage"]();
            case 20:
                return new _InitFollowingPage__WEBPACK_IMPORTED_MODULE_22__["InitFollowingPage"]();
            default:
                throw new Error('InitPage error: Illegal pageType.');
        }
    }
}
new InitPage();


/***/ }),

/***/ "./src/ts/modules/InitPageBase.ts":
/*!****************************************!*\
  !*** ./src/ts/modules/InitPageBase.ts ***!
  \****************************************/
/*! exports provided: InitPageBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitPageBase", function() { return InitPageBase; });
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _artwork_SaveArtworkData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./artwork/SaveArtworkData */ "./src/ts/modules/artwork/SaveArtworkData.ts");
/* harmony import */ var _novel_SaveNovelData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./novel/SaveNovelData */ "./src/ts/modules/novel/SaveNovelData.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
// 初始化所有页面抓取流程的基类












class InitPageBase {
    constructor() {
        this.crawlNumber = 0; // 要抓取的个数/页数
        this.firstFewImages = 0; // 每个作品下载几张图片。0为不限制，全部下载。改为1则只下载第一张。这是因为有时候多p作品会导致要下载的图片过多，此时可以设置只下载前几张，减少下载量
        this.maxCount = 1000; // 当前页面类型最多有多少个页面/作品
        this.startpageNo = 1; // 列表页开始抓取时的页码，只在 api 需要页码时使用。目前有搜索页、排行榜页、关注的新作品页使用。
        this.listPageFinished = 0; // 记录一共抓取了多少个列表页。使用范围同上。
        this.ajaxThreadsDefault = 10; // 抓取时的并发连接数默认值，也是最大值
        this.ajaxThreads = this.ajaxThreadsDefault; // 抓取时的并发连接数
        this.ajaxThreadsFinished = 0; // 统计有几个并发线程完成所有请求。统计的是并发线程（ ajaxThreads ）而非请求数
    }
    init() {
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].showAllOption();
        this.setFormOption();
        this.appendCenterBtns();
        this.appendElseEl();
        this.initElse();
        // 个数/页数设置可能在 init 里由代码直接进行设置，不会触发 change 事件，无法被监听到。所以手动触发 settingChange 事件，使其他组件能够接收到通知
        _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.settingChange, { name: 'setWantPage', value: _Settings__WEBPACK_IMPORTED_MODULE_10__["form"].setWantPage.value });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.pageSwitchedTypeChange, () => {
            this.destroy();
        });
    }
    // 各个子类私有的初始化内容
    // 可以在这里绑定事件 
    initElse() { }
    // 销毁初始化页面时添加的元素和事件，恢复设置项等
    destroy() {
        _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].clearSlot('crawlBtns');
        _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].clearSlot('otherBtns');
    }
    // 添加中间按钮
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    // 添加其他元素（如果有）
    appendElseEl() { }
    // 设置表单里的选项。主要是设置页数，隐藏不需要的选项。
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_数字提示1'),
            value: '1',
        });
    }
    // 作品个数/页数的输入不合法
    getWantPageError() {
        _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.crawlError);
        const msg = _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_参数不合法');
        window.alert(msg);
        throw new Error(msg);
    }
    // 检查用户输入的页数/个数设置，并返回提示信息
    // 可以为 -1，或者大于 0
    checkWantPageInput(crawlPartTip, crawlAllTip) {
        const temp = parseInt(_Settings__WEBPACK_IMPORTED_MODULE_10__["form"].setWantPage.value);
        // 如果比 1 小，并且不是 -1，则不通过
        if ((temp < 1 && temp !== -1) || isNaN(temp)) {
            // 比 1 小的数里，只允许 -1 , 0 也不行
            this.getWantPageError();
        }
        if (temp >= 1) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].warning(crawlPartTip.replace('-num-', temp.toString()));
        }
        else if (temp === -1) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].warning(crawlAllTip);
        }
        return temp;
    }
    // 检查用户输入的页数/个数设置
    // 必须大于 0
    checkWantPageInputGreater0() {
        const result = _API__WEBPACK_IMPORTED_MODULE_6__["API"].checkNumberGreater0(_Settings__WEBPACK_IMPORTED_MODULE_10__["form"].setWantPage.value);
        if (result.result) {
            return result.value;
        }
        else {
            this.getWantPageError();
        }
    }
    // 获取作品张数设置
    getFirstFewImages() {
        const result = _Settings__WEBPACK_IMPORTED_MODULE_10__["setting"].getFirstFewImages();
        if (result === undefined) {
            _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.crawlError);
            const msg = _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载前几张图片') + ' ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_必须大于0');
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].error(msg);
            window.alert(msg);
            throw new Error(msg);
        }
        return result;
    }
    // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
    getWantPage() { }
    // 获取多图作品设置。因为这个不属于过滤器 filter，所以在这里直接获取
    getMultipleSetting() {
        // 获取作品张数设置
        if (_Settings__WEBPACK_IMPORTED_MODULE_10__["form"].firstFewImagesSwitch.checked) {
            this.firstFewImages = this.getFirstFewImages();
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图作品下载前n张图片', this.firstFewImages.toString()));
        }
    }
    // 准备抓取，进行抓取之前的一些检查工作。必要时可以在子类中改写
    async readyCrawl() {
        // 检查是否可以开始抓取
        if (_States__WEBPACK_IMPORTED_MODULE_11__["states"].busy) {
            window.alert(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_当前任务尚未完成2'));
            return;
        }
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].clear();
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_任务开始0'));
        this.getWantPage();
        this.getMultipleSetting();
        _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.crawlStart);
        // 进入第一个抓取方法
        this.nextStep();
    }
    // 当可以开始抓取时，进入下一个流程。默认情况下，开始获取作品列表。如有不同，由子类具体定义
    nextStep() {
        this.getIdList();
    }
    // 作品列表获取完毕，开始抓取作品内容页
    getIdListFinished() {
        // 列表页获取完毕后，可以在这里重置一些变量
        this.resetGetIdListStatus();
        if (_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.length === 0) {
            return this.noResult();
        }
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_当前作品个数', _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.length.toString()));
        // 这个 return 在这里重置任务状态，不继续抓取作品的详情了，用于调试时反复进行抓取
        // return states.allWork = false
        if (_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.length <= this.ajaxThreadsDefault) {
            this.ajaxThreads = _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.length;
        }
        else {
            this.ajaxThreads = this.ajaxThreadsDefault;
        }
        for (let i = 0; i < this.ajaxThreads; i++) {
            this.getWorksData();
        }
    }
    // 获取作品的数据
    async getWorksData(idData) {
        idData = idData || _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.shift();
        const id = idData.id;
        try {
            // 发起请求
            if (idData.type === 'novels') {
                const data = await _API__WEBPACK_IMPORTED_MODULE_6__["API"].getNovelData(id);
                await _novel_SaveNovelData__WEBPACK_IMPORTED_MODULE_5__["saveNovelData"].save(data);
            }
            else {
                const data = await _API__WEBPACK_IMPORTED_MODULE_6__["API"].getArtworkData(id);
                await _artwork_SaveArtworkData__WEBPACK_IMPORTED_MODULE_4__["saveArtworkData"].save(data);
            }
            this.afterGetWorksData();
        }
        catch (error) {
            //  请求成功，但 response.ok 错误。不重试请求，跳过该作品继续抓取
            if (error.status) {
                this.logErrorStatus(error.status, id);
                this.afterGetWorksData();
            }
            else {
                // 请求失败，会重试这个请求
                console.log(error);
                setTimeout(() => {
                    this.getWorksData(idData);
                }, 2000);
            }
            return;
        }
    }
    // 每当获取完一个作品的信息
    afterGetWorksData() {
        this.logResultTotal();
        if (_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.length > 0) {
            // 如果存在下一个作品，则
            this.getWorksData();
        }
        else {
            // 没有剩余作品
            this.ajaxThreadsFinished++;
            if (this.ajaxThreadsFinished === this.ajaxThreads) {
                // 如果所有并发请求都执行完毕，复位
                this.ajaxThreadsFinished = 0;
                this.crawlFinished();
            }
        }
    }
    // 抓取完毕
    crawlFinished() {
        if (_Store__WEBPACK_IMPORTED_MODULE_7__["store"].result.length === 0) {
            return this.noResult();
        }
        this.sortResult();
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_共抓取到n个文件', _Store__WEBPACK_IMPORTED_MODULE_7__["store"].result.length.toString()));
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取完毕'), 2);
        // 统计不同类型的文件数量
        // 统计 blob 文件的体积
        // const type = [0, 0, 0, 0]
        // let blobSize = 0
        // for (const result of store.result) {
        //   type[result.type] = type[result.type] + 1
        //   if(result.novelBlob){
        //     blobSize += result.novelBlob.size
        //   }
        // }
        // console.log(type)
        // console.log(blobSize)
        // 发出抓取完毕的信号
        _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.crawlFinish);
    }
    // 网络请求状态异常时输出提示
    logErrorStatus(status, id) {
        switch (status) {
            case 0:
                _Log__WEBPACK_IMPORTED_MODULE_8__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码0'));
                break;
            case 400:
                _Log__WEBPACK_IMPORTED_MODULE_8__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码400'));
                break;
            case 403:
                _Log__WEBPACK_IMPORTED_MODULE_8__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码403'));
                break;
            case 404:
                _Log__WEBPACK_IMPORTED_MODULE_8__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码404'));
                break;
            default:
                _Log__WEBPACK_IMPORTED_MODULE_8__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_无权访问2', id));
                break;
        }
    }
    // 在抓取图片网址时，输出提示
    logResultTotal() {
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_共抓取到n个文件', _Store__WEBPACK_IMPORTED_MODULE_7__["store"].result.length.toString()), 1, false);
    }
    // 抓取结果为 0 时输出提示
    noResult() {
        // 先触发 crawlFinish，后触发 crawlEmpty。这样便于其他组件处理 crawlEmpty 这个例外情况
        // 如果触发顺序反过来，那么最后执行的都是 crawlFinish，可能会覆盖对 crawlEmpty 的处理
        _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.crawlFinish);
        _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.crawlEmpty);
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取结果为零'), 2);
        window.alert(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取结果为零'));
    }
    // 抓取完成后，对结果进行排序
    sortResult() { }
}



/***/ }),

/***/ "./src/ts/modules/InitPixivisionPage.ts":
/*!**********************************************!*\
  !*** ./src/ts/modules/InitPixivisionPage.ts ***!
  \**********************************************/
/*! exports provided: InitPixivisionPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitPixivisionPage", function() { return InitPixivisionPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
// 初始化 pixivision 页面






class InitPixivisionPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.tested = 0; // 检查图片后缀名时的计数
        this.init();
    }
    appendCenterBtns() {
        const typeA = document.querySelector('a[data-gtm-action=ClickCategory]');
        const type = typeA.dataset.gtmLabel;
        if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
            // 在插画、漫画、cosplay类型的页面上创建下载功能
            _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取该页面的图片')).addEventListener('click', () => {
                this.readyCrawl();
            }, false);
        }
    }
    setFormOption() {
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([
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
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            26,
            27,
            28,
        ]);
        // pixivision 里，文件名只有 id 标记会生效，所以把文件名规则替换成 id
        // form.userSetName.value = '{p_title}/{id}'
    }
    nextStep() {
        this.getPixivision();
    }
    getIdList() { }
    resetGetIdListStatus() { }
    // 保存要下载的图片的信息
    addResult(id, url, ext) {
        _Store__WEBPACK_IMPORTED_MODULE_5__["store"].addResult({
            id: id,
            url: url,
            ext: ext,
        });
    }
    getPixivision() {
        const a = document.querySelector('a[data-gtm-action=ClickCategory]');
        const type = a.dataset.gtmLabel;
        if (type === 'illustration') {
            // 插画页面，需要对图片进行测试获取原图 url
            const imageList = document.querySelectorAll('.am__work__main img');
            const urls = Array.from(imageList).map((el) => {
                return el.src
                    .replace('c/768x1200_80/img-master', 'img-original')
                    .replace('_master1200', '');
            });
            this.tested = 0;
            urls.forEach((url) => {
                let arr = url.split('/');
                const id = arr[arr.length - 1].split('.')[0].split('_')[0]; // 作品id，尝试提取出数字部分
                this.testExtName(url, urls.length, id);
            });
        }
        else {
            // 漫画和 cosplay ，直接保存页面上的图片
            let selector = '';
            if (type === 'manga') {
                selector = '.am__work__illust';
            }
            else if (type === 'cosplay') {
                selector = '.fab__image-block__image img';
            }
            // 把图片url添加进数组
            const imageList = document.querySelectorAll(selector);
            Array.from(imageList).forEach((el) => {
                const url = el.src;
                if (url !== 'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg') {
                    // 跳过Cure的logo图片
                    // 漫画页面的图片 url 如：
                    // https://i.pximg.net/c/768x1200_80/img-master/img/2017/06/19/01/08/28/63457814_p0_master1200.jpg
                    // cosplay 页面的 ur 如：
                    // https://i.pximg.net/imgaz/upload/20170808/670930758.jpg
                    const arr = url.split('/');
                    const id = arr[arr.length - 1].split('.')[0].split('_')[0]; // 作品id，尝试提取出数字部分
                    const extTest = arr[arr.length - 1].match(/\.(.*$)/); // 扩展名，不带点 .
                    let ext = 'jpg';
                    if (extTest && extTest.length > 1) {
                        ext = extTest[1];
                    }
                    this.addResult(id, url, ext);
                }
            });
            this.crawlFinished();
        }
    }
    // 测试图片 url 是否正确的函数。pixivision 页面直接获取的图片 url，后缀都是jpg的，所以要测试实际上是jpg还是png
    testExtName(url, imgNumber, id) {
        let ext = '';
        const testImg = new Image();
        testImg.src = url;
        testImg.onload = () => next(true);
        testImg.onerror = () => next(false);
        let next = (bool) => {
            if (bool) {
                ext = 'jpg';
            }
            else {
                url = url.replace('.jpg', '.png');
                ext = 'png';
            }
            this.addResult(id, url, ext);
            this.logResultTotal();
            if (imgNumber !== undefined) {
                this.tested++;
                if (this.tested === imgNumber) {
                    // 如果所有请求都执行完毕
                    this.crawlFinished();
                }
            }
        };
    }
}



/***/ }),

/***/ "./src/ts/modules/InitUserPage.ts":
/*!****************************************!*\
  !*** ./src/ts/modules/InitUserPage.ts ***!
  \****************************************/
/*! exports provided: InitUserPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitUserPage", function() { return InitUserPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./PageInfo */ "./src/ts/modules/PageInfo.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _SaveAvatarIcon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SaveAvatarIcon */ "./src/ts/modules/SaveAvatarIcon.ts");
// 初始化用户页面











class InitUserPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.listType = 0; // 细分的列表类型
        this.onceNumber = 48; // 每页作品个数，插画是 48 个，小说是 24 个
        this.init();
    }
    // 添加中间按钮
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_7__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
        _DOM__WEBPACK_IMPORTED_MODULE_7__["DOM"].addBtn('otherBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户头像为图标'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户头像为图标说明')],
        ]).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.saveAvatarIcon);
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
            value: '-1',
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
    }
    nextStep() {
        this.readyGetIdList();
    }
    readyGetIdList() {
        // 判断页面类型
        // 匹配 pathname 里用户 id 之后的字符
        const test = location.pathname.match(/\/users\/\d+(\/.+)/);
        if (test === null) {
            // 用户主页
            this.listType = 0;
        }
        else if (test.length === 2) {
            const str = test[1]; //取出用户 id 之后的字符
            if (str.includes('/artworks')) {
                // 插画和漫画列表
                this.listType = 1;
            }
            else if (str.includes('/illustrations')) {
                // 插画列表
                this.listType = 2;
            }
            else if (str.includes('/manga')) {
                // 漫画列表
                this.listType = 3;
            }
            else if (str.includes('/novels')) {
                // 小说列表
                this.listType = 4;
                this.onceNumber = 24; // 如果是在小说列表页，一页只有 24 个作品
            }
        }
        _PageInfo__WEBPACK_IMPORTED_MODULE_8__["pageInfo"].tag ? this.getIdListByTag() : this.getIdList();
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_正在抓取'));
    }
    getOffset() {
        const nowPage = _API__WEBPACK_IMPORTED_MODULE_4__["API"].getURLSearchField(location.href, 'p'); // 判断当前处于第几页，页码从 1 开始。也可能没有页码
        let offset = 0;
        if (nowPage) {
            offset = (parseInt(nowPage) - 1) * this.onceNumber;
        }
        if (offset < 0) {
            offset = 0;
        }
        return offset;
    }
    // 根据页数设置，计算要下载的个数
    getRequsetNumber() {
        let requsetNumber = 9999999;
        if (this.crawlNumber !== -1) {
            requsetNumber = this.onceNumber * this.crawlNumber;
        }
        return requsetNumber;
    }
    // 获取用户某些类型的作品的 id 列表
    async getIdList() {
        let type = [];
        switch (this.listType) {
            case 0:
                type = ['illusts', 'manga', 'novels'];
                break;
            case 1:
                type = ['illusts', 'manga'];
                break;
            case 2:
                type = ['illusts'];
                break;
            case 3:
                type = ['manga'];
                break;
            case 4:
                type = ['novels'];
                break;
        }
        let idList = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getUserWorksByType(_DOM__WEBPACK_IMPORTED_MODULE_7__["DOM"].getUserId(), type);
        // 判断是否全都是小说，如果是，把每页的作品个数设置为 24 个
        const allWorkIsNovels = idList.every((val) => {
            return val.type === 'novels';
        });
        allWorkIsNovels && (this.onceNumber = 24);
        // 计算偏移量和需要保留的作品个数
        const offset = this.getOffset();
        const requsetNumber = this.getRequsetNumber();
        // 按照 id 升序排列，之后会删除不需要的部分
        idList.sort(_API__WEBPACK_IMPORTED_MODULE_4__["API"].sortByProperty('id')).reverse();
        // 不带 tag 获取作品时，由于 API 是一次性返回用户的所有作品，可能大于要求的数量，所以需要去掉多余的作品。
        // 删除 offset 需要去掉的部分。删除后面的 id，也就是近期作品
        idList.splice(idList.length - offset, idList.length);
        // 删除超过 requsetNumber 的作品。删除前面的 id，也就是早期作品
        if (idList.length > requsetNumber) {
            idList.splice(0, idList.length - requsetNumber);
        }
        // 储存
        _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.concat(idList);
        this.getIdListFinished();
    }
    // 获取用户某些类型的作品的 id 列表（附带 tag）
    async getIdListByTag() {
        // 这里不用判断 0 也就是用户主页的情况，因为用户主页不会带 tag
        let flag = 'illustmanga';
        switch (this.listType) {
            case 1:
                flag = 'illustmanga';
                break;
            case 2:
                flag = 'illusts';
                break;
            case 3:
                flag = 'manga';
                break;
            case 4:
                flag = 'novels';
                break;
        }
        // 计算偏移量和需要保留的作品个数
        const offset = this.getOffset();
        const requsetNumber = this.getRequsetNumber();
        let data = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getUserWorksByTypeWithTag(_DOM__WEBPACK_IMPORTED_MODULE_7__["DOM"].getUserId(), flag, _PageInfo__WEBPACK_IMPORTED_MODULE_8__["pageInfo"].tag, offset, requsetNumber);
        // 图片和小说返回的数据是不同的，小说并没有 illustType 标记
        if (this.listType === 4) {
            const d = data;
            d.body.works.forEach((data) => _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
                type: 'novels',
                id: data.id,
            }));
        }
        else {
            const d = data;
            d.body.works.forEach((data) => {
                let type = 'illusts';
                switch (data.illustType) {
                    case 0:
                        type = 'illusts';
                        break;
                    case 1:
                        type = 'manga';
                        break;
                    case 2:
                        type = 'ugoira';
                        break;
                }
                _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
                    type,
                    id: data.id,
                });
            });
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.listType = 0;
        this.listPageFinished = 0;
    }
    sortResult() {
        // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
        _Store__WEBPACK_IMPORTED_MODULE_5__["store"].result.sort(_API__WEBPACK_IMPORTED_MODULE_4__["API"].sortByProperty('id'));
    }
}



/***/ }),

/***/ "./src/ts/modules/Lang.ts":
/*!********************************!*\
  !*** ./src/ts/modules/Lang.ts ***!
  \********************************/
/*! exports provided: lang */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lang", function() { return lang; });
/* harmony import */ var _langText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./langText */ "./src/ts/modules/langText.ts");

// 语言类
class Lang {
    constructor() {
        this.langType = 0;
        this.getLangType();
    }
    // 设置语言类型
    getLangType() {
        const userLang = document.documentElement.lang; // 获取语言标识
        switch (userLang) {
            case 'zh':
            case 'zh-CN':
            case 'zh-Hans':
                this.langType = 0; // 设置为简体中文
                break;
            case 'ja':
                this.langType = 1; // 设置为日语
                break;
            case 'zh-Hant':
            case 'zh-tw':
            case 'zh-TW':
                this.langType = 3; // 设置为繁体中文
                break;
            default:
                this.langType = 2; // 设置为英语
                break;
        }
    }
    // translate 翻译
    transl(name, ...arg) {
        let content = _langText__WEBPACK_IMPORTED_MODULE_0__["langText"][name][this.langType];
        arg.forEach((val) => (content = content.replace('{}', val)));
        return content;
    }
}
const lang = new Lang();



/***/ }),

/***/ "./src/ts/modules/Log.ts":
/*!*******************************!*\
  !*** ./src/ts/modules/Log.ts ***!
  \*******************************/
/*! exports provided: log */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log", function() { return log; });
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
/* harmony import */ var _ThemeColor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ThemeColor */ "./src/ts/modules/ThemeColor.ts");




// 日志类
class Log {
    constructor() {
        this.logArea = document.createElement('div'); // 输出日志的区域
        this.id = 'logWrap'; // 日志区域元素的 id
        this.refresh = document.createElement('span'); // 刷新时使用的元素
        this.colors = ['#00ca19', '#d27e00', '#f00'];
        this.toBottom = false; // 指示是否需要把日志滚动到底部。当有日志被添加或刷新，则为 true。滚动到底部之后复位到 false，避免一直滚动到底部。
        this.scrollToBottom();
        // 切换不同页面时，如果任务已经完成，则清空输出区域，避免日志一直堆积。
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.pageSwitch, () => {
            if (!_States__WEBPACK_IMPORTED_MODULE_2__["states"].busy) {
                this.clear();
            }
        });
    }
    // 如果日志区域没有被添加到页面上，则添加上
    checkElement() {
        let test = document.getElementById(this.id);
        if (test === null) {
            this.logArea.id = this.id;
            this.logArea.classList.add('beautify_scrollbar');
            _DOM__WEBPACK_IMPORTED_MODULE_0__["DOM"].insertToHead(this.logArea);
            _ThemeColor__WEBPACK_IMPORTED_MODULE_3__["themeColor"].register(this.logArea);
        }
    }
    // 清空日志
    clear() {
        this.logArea.innerHTML = '';
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
        this.checkElement();
        let span = document.createElement('span');
        if (!keepShow) {
            span = this.refresh;
        }
        span.innerHTML = str;
        if (level > -1) {
            span.style.color = this.colors[level];
        }
        while (br > 0) {
            span.appendChild(document.createElement('br'));
            br--;
        }
        this.logArea.appendChild(span);
        this.toBottom = true; // 需要把日志滚动到底部
    }
    log(str, br = 1, keepShow = true) {
        this.add(str, -1, br, keepShow);
    }
    success(str, br = 1, keepShow = true) {
        this.add(str, 0, br, keepShow);
    }
    warning(str, br = 1, keepShow = true) {
        this.add(str, 1, br, keepShow);
    }
    error(str, br = 1, keepShow = true) {
        this.add(str, 2, br, keepShow);
    }
    // 因为日志区域限制了最大高度，可能会出现滚动条，这里使日志总是滚动到底部
    scrollToBottom() {
        window.setInterval(() => {
            if (this.toBottom) {
                this.logArea.scrollTop = this.logArea.scrollHeight;
                this.toBottom = false;
            }
        }, 800);
    }
}
const log = new Log();



/***/ }),

/***/ "./src/ts/modules/Options.ts":
/*!***********************************!*\
  !*** ./src/ts/modules/Options.ts ***!
  \***********************************/
/*! exports provided: options */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return options; });
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");
// 操作 Setting 表单的选项区域

class Options {
    constructor() {
        this.allOption = _Settings__WEBPACK_IMPORTED_MODULE_0__["form"].querySelectorAll('.option');
        // 获取“页数/个数”设置的元素
        const wantPageOption = this.getOption(1);
        this.wantPageEls = {
            text: wantPageOption.querySelector('.setWantPageTip1'),
            rangTip: wantPageOption.querySelector('.setWantPageTip2'),
            input: wantPageOption.querySelector('.setWantPage'),
        };
    }
    // 使用编号获取指定选项的元素
    getOption(no) {
        for (const option of this.allOption) {
            if (option.dataset.no === no.toString()) {
                return option;
            }
        }
        throw `Not found this option: ${no}`;
    }
    // 显示或隐藏指定的选项
    setOptionDisplay(no, display) {
        for (const number of no) {
            this.getOption(number).style.display = display;
        }
    }
    // 显示所有选项
    // 在切换不同页面时使用
    showAllOption() {
        for (const el of this.allOption) {
            el.style.display = 'block';
        }
    }
    // 隐藏指定的选项。参数是数组，传递设置项的编号。
    hideOption(no) {
        this.setOptionDisplay(no, 'none');
    }
    // 显示指定的选项。因为页面无刷新加载，所以一些选项被隐藏后，可能需要再次显示
    showOption(no) {
        this.setOptionDisplay(no, 'block');
    }
    // 设置 “设置页面/作品数量” 选项的提示和预设值
    setWantPage(arg) {
        this.wantPageEls.text.textContent = arg.text;
        this.wantPageEls.text.dataset.tip = arg.tip;
        this.wantPageEls.rangTip.textContent = arg.rangTip;
        this.wantPageEls.input.value = arg.value;
    }
}
const options = new Options();



/***/ }),

/***/ "./src/ts/modules/Output.ts":
/*!**********************************!*\
  !*** ./src/ts/modules/Output.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Config */ "./src/ts/modules/Config.ts");
/* harmony import */ var _ThemeColor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ThemeColor */ "./src/ts/modules/ThemeColor.ts");






// 输出面板
class Output {
    constructor() {
        this.addOutPutPanel();
        _ThemeColor__WEBPACK_IMPORTED_MODULE_5__["themeColor"].register(this.outputPanel);
        this.bindEvent();
    }
    addOutPutPanel() {
        const outputPanelHTML = `
    <div class="outputWrap">
    <div class="outputClose" title="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_关闭')}">X</div>
    <div class="outputTitle">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输出信息')}</div>
    <div class="outputContent beautify_scrollbar"></div>
    <div class="outputFooter">
    <button class="outputCopy" title="">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_复制')}</button>
    </div>
    </div>
    `;
        document.body.insertAdjacentHTML('beforeend', outputPanelHTML);
        this.outputPanel = document.querySelector('.outputWrap');
        this.outputTitle = this.outputPanel.querySelector('.outputTitle');
        this.outputContent = this.outputPanel.querySelector('.outputContent');
        this.copyBtn = this.outputPanel.querySelector('.outputCopy');
        this.closeBtn = this.outputPanel.querySelector('.outputClose');
    }
    // 关闭输出面板
    close() {
        this.outputPanel.style.display = 'none';
        this.outputContent.innerHTML = '';
    }
    bindEvent() {
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.centerPanelClosed, () => {
            this.close();
        });
        // 复制输出内容
        this.copyBtn.addEventListener('click', () => {
            const range = document.createRange();
            range.selectNodeContents(this.outputContent);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            // 改变提示文字
            this.copyBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_已复制到剪贴板');
            setTimeout(() => {
                window.getSelection().removeAllRanges();
                this.copyBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_复制');
            }, 1000);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.output, (ev) => {
            this.output(ev.detail.data.content, ev.detail.data.title);
        });
    }
    // 输出内容
    output(content, title = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输出信息')) {
        // 如果结果较多，则不直接输出，改为保存 txt 文件
        if (_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length > _Config__WEBPACK_IMPORTED_MODULE_4__["default"].outputMax) {
            const con = content.replace(/<br>/g, '\n'); // 替换换行符
            const file = new Blob([con], {
                type: 'text/plain',
            });
            const url = URL.createObjectURL(file);
            const fileName = new Date().toLocaleString() + '.txt';
            _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].downloadFile(url, fileName);
            // 禁用复制按钮
            this.copyBtn.disabled = true;
            content = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输出内容太多已经为你保存到文件');
        }
        else {
            this.copyBtn.disabled = false;
        }
        if (content) {
            this.outputContent.innerHTML = content;
            this.outputPanel.style.display = 'block';
            this.outputTitle.textContent = title;
        }
    }
}
new Output();


/***/ }),

/***/ "./src/ts/modules/OutputCSV.ts":
/*!*************************************!*\
  !*** ./src/ts/modules/OutputCSV.ts ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Config */ "./src/ts/modules/Config.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");





// name 这个字段在 csv 里显示的名字。
// index 这个字段在数据里的索引名
// toString 输入这个字段的原始数据，将其转换为字符串。
// q 指 quotation ，指示 toString 的结果是否需要使用双引号包裹
// 需要双引号包裹的情况：值含有逗号、换行符、空格、双引号
// 导出 csv 文件
// 参考 https://www.jianshu.com/p/54b3afc06126
class OutputCSV {
    constructor() {
        this.separate = ','; // 分隔符
        this.CRLF = '\r\n'; // 换行符
        this.number2String = (arg) => {
            return arg.toString();
        };
        this.array2String = (arg) => {
            return arg.join(',');
        };
        this.string2String = (arg) => {
            return arg;
        };
        // 定义要保存的字段
        this.fieldCfg = [
            {
                name: 'id',
                index: 'idNum',
                q: false,
                toString: this.number2String,
            },
            {
                name: 'tags',
                index: 'tags',
                q: true,
                toString: this.array2String,
            },
            {
                name: 'tags_transl',
                index: 'tagsTranslOnly',
                q: true,
                toString: this.array2String,
            },
            {
                name: 'user',
                index: 'user',
                q: true,
                toString: this.string2String,
            },
            {
                name: 'userid',
                index: 'userId',
                q: false,
                toString: this.string2String,
            },
            {
                name: 'title',
                index: 'title',
                q: true,
                toString: this.string2String,
            },
            {
                name: 'type',
                index: 'type',
                q: false,
                toString: (arg) => {
                    return _Config__WEBPACK_IMPORTED_MODULE_3__["default"].illustTypes[arg];
                },
            },
            {
                name: 'page',
                index: 'pageCount',
                q: false,
                toString: this.number2String,
            },
            {
                name: 'bookmark',
                index: 'bmk',
                q: false,
                toString: this.number2String,
            },
            {
                name: 'bookmarked',
                index: 'bookmarked',
                q: false,
                toString: (arg) => {
                    return arg ? 'yes' : 'no';
                },
            },
            {
                name: 'width',
                index: 'fullWidth',
                q: false,
                toString: this.number2String,
            },
            {
                name: 'height',
                index: 'fullHeight',
                q: false,
                toString: this.number2String,
            },
            {
                name: 'date',
                index: 'date',
                q: false,
                toString: this.string2String,
            },
        ];
        this.utf8BOM = this.UTF8BOM();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.outputCSV, () => {
            this.beforeCreate();
        });
    }
    beforeCreate() {
        // 如果没有数据则不执行
        if (_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length === 0) {
            alert(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
            return;
        }
        // 使用 result 而不使用 resultMeta。主要是因为断点续传时只会恢复 result，不会恢复 resultMeta，所以 result 最可靠。考虑如下情况：
        // 1：刷新页面后，断点续传恢复了保存的数据，此时只有 result 里有数据，resultMeta 没有数据。
        // 2: 如果在页面 A 进行了下载，resultMeta 保存的是页面 A 的数据。此时进入页面 B，恢复了 B 页面保存的任务，此时 resultMeta 里还是页面 A 的数据。
        // 所以还是使用 result 比较可靠，不易出问题。
        this.create(_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result);
    }
    create(data) {
        const result = []; // 储存结果。每行的结果合并为一个字符串。不带换行符
        // 首先添加字段一栏
        const head = [];
        for (const field of this.fieldCfg) {
            head.push(field.name);
        }
        const headResult = head.join(this.separate);
        result.push(headResult);
        // 循环每个作品的数据，生成结果
        for (const d of data) {
            // 如果是多图作品，并且不是第一张图，则跳过
            // 这是因为多图作品可能有多个数据。在生成 csv 时只使用第一张图的数据
            // 多图作品 && id 不以 p0 结尾（说明不是第一张图）
            if (d.pageCount > 1 && !d.id.endsWith('p0')) {
                continue;
            }
            const temp = []; // 储存这个作品的数据
            for (const field of this.fieldCfg) {
                // 求值并替换双引号。值原本就有的双引号，要替换成两个双引号
                let value = field.toString(d[field.index]).replace(/\"/g, '""');
                // 根据 q 标记决定是否用双引号包裹这个值
                if (field.q) {
                    value = this.addQuotation(value);
                }
                temp.push(value);
            }
            // 把这个作品的数据添加到结果里
            result.push(temp.join(this.separate));
        }
        // 生成文件的 url
        const csvData = result.join(this.CRLF);
        const csvBlob = new Blob([this.utf8BOM, csvData]);
        const url = URL.createObjectURL(csvBlob);
        // 设置文件名
        let name = '';
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            name = ogTitle.content;
        }
        else {
            name = document.title;
        }
        // 下载文件
        _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].downloadFile(url, name + '.csv');
    }
    UTF8BOM() {
        const buff = new ArrayBuffer(3);
        const data = new DataView(buff);
        data.setInt8(0, 0xef);
        data.setInt8(1, 0xbb);
        data.setInt8(2, 0xbf);
        return buff;
    }
    // 在字符串的两端添加双引号
    addQuotation(data) {
        return '"' + data + '"';
    }
}
new OutputCSV();


/***/ }),

/***/ "./src/ts/modules/PageInfo.ts":
/*!************************************!*\
  !*** ./src/ts/modules/PageInfo.ts ***!
  \************************************/
/*! exports provided: pageInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pageInfo", function() { return pageInfo; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");



// 获取页面标题和页面的 tag，在抓取开始时保存。用于命名规则里
class PageInfo {
    constructor() {
        this._title = '';
        this._tag = '';
        this.getPageInfo();
        this.bindEvent();
    }
    get tag() {
        return this._tag;
    }
    // 重置
    // 切换页面时可能旧页面的一些标记在新页面没有了，所以要先重置
    reset() {
        this._title = '';
        this._tag = '';
    }
    // 储存信息
    store() {
        this.getPageInfo();
        _Store__WEBPACK_IMPORTED_MODULE_2__["store"].pageInfo.pageTitle = this._title;
        _Store__WEBPACK_IMPORTED_MODULE_2__["store"].pageInfo.pageTag = this._tag;
    }
    // 获取当前页面的一些信息，用于文件名中
    getPageInfo() {
        this.reset();
        // 去掉标题上的下载状态、消息数量提示
        this._title = document.title
            .replace(/\[(↑|→|▶|↓|║|■|✓| )\] /, '')
            .replace(/^\(\d.*\) /, '');
        // 获取当前页面的 tag
        this._tag = decodeURIComponent(_API__WEBPACK_IMPORTED_MODULE_0__["API"].getTagFromURL(location.href));
    }
    bindEvent() {
        // 页面切换时获取新的页面信息
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.pageSwitch, () => {
            this.getPageInfo();
        });
        // 开始抓取时，把此时的页面信息保存到 store 里。这样即使下载时页面切换了，使用的还是刚开始抓取时的数据。
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlStart, () => {
            this.store();
        });
        // 当需要恢复下载时，保存页面信息
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resume, () => {
            this.store();
        });
    }
}
const pageInfo = new PageInfo();



/***/ }),

/***/ "./src/ts/modules/PageType.ts":
/*!************************************!*\
  !*** ./src/ts/modules/PageType.ts ***!
  \************************************/
/*! exports provided: pageType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pageType", function() { return pageType; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");

// 获取页面类型
class PageType {
    constructor() {
        this.type = 0;
        this.type = this.getPageType();
        // 页面切换时检查新旧页面是否不同
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.pageSwitch, () => {
            this.checkPageTypeIsNew();
        });
    }
    getPageType() {
        const url = window.location.href;
        const pathname = window.location.pathname;
        let type;
        if (window.location.hostname === 'www.pixiv.net' &&
            (pathname === '/' || pathname === '/novel/' || pathname === '/en/')) {
            type = 0;
        }
        else if (/\/artworks\/\d{1,10}/.test(url)) {
            type = 1;
        }
        else if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
            type = 2;
            if (pathname.includes('/following')) {
                type = 20;
            }
        }
        else if (pathname.endsWith('bookmark.php')) {
            type = 3;
        }
        else if (pathname.includes('/bookmarks/')) {
            type = 4;
        }
        else if (url.includes('/tags/')) {
            type = pathname.endsWith('/novels') ? 15 : 5;
        }
        else if (pathname === '/ranking_area.php' && location.search !== '') {
            type = 6;
        }
        else if (pathname === '/ranking.php') {
            type = 7;
        }
        else if (url.includes('https://www.pixivision.net') &&
            url.includes('/a/')) {
            type = 8;
        }
        else if (url.includes('/bookmark_add.php?id=') ||
            url.includes('/bookmark_detail.php?illust_id=')) {
            type = 9;
        }
        else if (url.includes('/bookmark_new_illust.php') ||
            url.includes('/bookmark_new_illust_r18.php')) {
            type = 10;
        }
        else if (pathname === '/discovery') {
            type = 11;
        }
        else if (url.includes('/new_illust.php') ||
            url.includes('/new_illust_r18.php')) {
            type = 12;
        }
        else if (pathname === '/novel/show.php') {
            type = 13;
        }
        else if (pathname.startsWith('/novel/series/')) {
            type = 14;
        }
        else if (pathname === '/novel/ranking.php') {
            type = 16;
        }
        else if (pathname.startsWith('/novel/bookmark_new')) {
            type = 17;
        }
        else if (pathname.startsWith('/novel/new')) {
            type = 18;
        }
        else if (pathname.startsWith('/user/') && pathname.includes('/series/')) {
            type = 19;
        }
        else {
            // 没有匹配到可用的页面类型
            throw new Error('Unsupported page type');
        }
        return type;
    }
    // 检查是不是进入到了新的页面类型
    checkPageTypeIsNew() {
        let newType = this.getPageType();
        if (this.type !== newType) {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.pageSwitchedTypeChange, newType);
        }
        else {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.pageSwitchedTypeNotChange, newType);
        }
        // 保存当前页面类型
        this.type = newType;
    }
}
const pageType = new PageType();



/***/ }),

/***/ "./src/ts/modules/ProgressBar.ts":
/*!***************************************!*\
  !*** ./src/ts/modules/ProgressBar.ts ***!
  \***************************************/
/*! exports provided: progressBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "progressBar", function() { return progressBar; });
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
// 下载进度条



// 进度条
class ProgressBar {
    constructor() {
        this.wrapHTML = `
  <div class="progressBarWrap">
  <div class="total">
  <span class="text">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载进度')}</span>
  <div class="right1">
  <div class="progressBar progressBar1">
  <div class="progress progress1"></div>
  </div>
  <div class="totalNumberWrap">
  <span class="downloaded">0</span>
  /
  <span class="imgNum totalNumber">0</span>
  </div>
  </div>
  </div>

  <ul class="progressBarList"></ul>
  </div>
  `;
        this.barHTML = `<li class="downloadBar">
  <div class="progressBar progressBar2">
  <div class="progress progress2"></div>
  </div>
  <div class="progressTip progressTip2">
  <span class="fileName"></span>
  <span class="loadedWrap">
  <span class="loaded"></span>
  </span>
  </div>
  </li>`;
        this.allProgressBar = [];
        this.wrap = _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].useSlot('progressBar', this.wrapHTML);
        this.downloadedEl = this.wrap.querySelector('.downloaded');
        this.progressColorEl = this.wrap.querySelector('.progress1');
        this.listWrap = this.wrap.querySelector('.progressBarList');
        this.totalNumberEl = this.wrap.querySelector('.totalNumber');
    }
    // 重设所有进度
    reset(progressBarNum, downloaded = 0) {
        if (progressBarNum === 0) { // 如果进度条数量为 0（抓取结果为空），则隐藏进度条区域
            return this.hide();
        }
        // 重置总进度条
        this.setTotalProgress(downloaded);
        this.totalNumberEl.textContent = _Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length.toString();
        // 重置子进度条
        this.listWrap.innerHTML = this.barHTML.repeat(progressBarNum);
        this.show();
        // 保存子进度条上需要使用到的元素
        const allProgressBar = this.listWrap.querySelectorAll('.downloadBar');
        this.allProgressBar = [];
        for (const bar of allProgressBar) {
            const data = {
                name: bar.querySelector('.fileName'),
                loaded: bar.querySelector('.loaded'),
                progress: bar.querySelector('.progress'),
            };
            this.allProgressBar.push(data);
        }
    }
    // 设置总进度条的进度
    setTotalProgress(downloaded) {
        this.downloadedEl.textContent = downloaded.toString();
        const progress = (downloaded / _Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length) * 100;
        this.progressColorEl.style.width = progress + '%';
    }
    // 设置子进度条的进度
    setProgress(index, data) {
        const bar = this.allProgressBar[index];
        bar.name.textContent = data.name;
        bar.loaded.textContent = `${Math.floor(data.loaded / 1024)}/${Math.floor(data.total / 1024)} KiB`;
        const progress = data.loaded / data.total || 0; // 若结果为 NaN 则设为 0
        bar.progress.style.width = progress * 100 + '%';
    }
    // 让某个子进度条显示警告色
    showErrorColor(index, show) {
        const bar = this.allProgressBar[index];
        bar.name.classList[show ? 'add' : 'remove']('downloadError');
    }
    show() {
        this.wrap.style.display = 'block';
    }
    hide() {
        this.wrap.style.display = 'none';
    }
}
const progressBar = new ProgressBar();



/***/ }),

/***/ "./src/ts/modules/QuickBookmark.ts":
/*!*****************************************!*\
  !*** ./src/ts/modules/QuickBookmark.ts ***!
  \*****************************************/
/*! exports provided: QuickBookmark */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuickBookmark", function() { return QuickBookmark; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings */ "./src/ts/modules/Settings.ts");
// 快速收藏



class QuickBookmark {
    constructor() {
        this.btn = document.createElement('a'); // 快速收藏按钮
        this.btnId = 'quickBookmarkEl';
        this.colorClass = 'bookmarkedColor';
        this.likeBtnClass = '_35vRH4a';
        this.isNovel = false;
        this.isBookmarked = null;
        this.timer = 0;
        this.init();
    }
    async init() {
        // 在某些条件下，不展开快速收藏功能
        if (!_API__WEBPACK_IMPORTED_MODULE_0__["API"].getToken() || !_Settings__WEBPACK_IMPORTED_MODULE_2__["form"].quickBookmarks.checked) {
            return;
        }
        window.clearInterval(this.timer);
        this.isNovel = window.location.href.includes('/novel');
        this.isBookmarked = !!(await this.getBookmarkData());
        this.timer = window.setInterval(() => {
            this.initBtn();
        }, 300);
    }
    async getBookmarkData() {
        let data;
        if (this.isNovel) {
            data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelData(_API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelId());
        }
        else {
            data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(_API__WEBPACK_IMPORTED_MODULE_0__["API"].getIllustId());
        }
        return data.body.bookmarkData;
    }
    // 插入快速收藏按钮
    initBtn() {
        // 从父元素查找作品下方的工具栏
        const toolbarParent = document.querySelectorAll('main > section');
        for (const el of toolbarParent) {
            const test = el.querySelector('div>section');
            if (test) {
                this.toolbar = test;
                break;
            }
        }
        if (this.toolbar) {
            // 获取原本的收藏按钮（其实是按钮外层的 div）
            this.pixivBMKDiv = this.toolbar.childNodes[2];
            // 当没有收藏按钮时，停止执行（如用户处于自己作品的页面时没有收藏按钮）
            if (!this.pixivBMKDiv) {
                return;
            }
            // 隐藏原来的收藏按钮
            this.pixivBMKDiv.style.display = 'none';
            // 如果没有快速收藏元素则添加
            this.btn = this.toolbar.querySelector('#' + this.btnId);
            if (!this.btn) {
                this.btn = this.createBtn();
                this.toolbar.insertBefore(this.btn, this.toolbar.childNodes[3]);
            }
            if (this.isBookmarked) {
                this.bookmarked();
            }
            else {
                this.readyBookmark();
            }
            window.clearInterval(this.timer);
        }
    }
    createBtn() {
        const btn = document.createElement('a');
        btn.id = this.btnId;
        btn.textContent = '✩';
        btn.href = 'javascript:void(0)';
        btn.title = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_快速收藏');
        return btn;
    }
    // 准备快速收藏
    readyBookmark() {
        this.btn.classList.remove(this.colorClass);
        this.btn.href = 'javascript:void(0)';
        this.btn.addEventListener('click', () => {
            // 自动点赞
            let likeBtn = document.querySelector(`.${this.likeBtnClass}`);
            if (!likeBtn) {
                // 上面尝试直接用 class 获取点赞按钮，考虑到 class 可能会变化，这里从工具栏的按钮里选择。
                // 点赞按钮是工具栏里的最后一个 button 元素
                console.error('likeBtn class is not available');
                const btnList = this.toolbar.querySelectorAll('button');
                likeBtn = btnList[btnList.length - 1];
            }
            likeBtn.click();
            if (this.isBookmarked) {
                return;
            }
            // 点击 p 站自带的收藏按钮，这是因为这一行为将会在作品下方显示推荐作品。如果不点击自带的按钮，只使用本程序添加的按钮，那么就不会出现推荐作品了。
            const pixivBMKBtn = this.pixivBMKDiv && this.pixivBMKDiv.querySelector('button');
            pixivBMKBtn && pixivBMKBtn.click();
            // 如果设置了快速收藏，则获取 tag
            let tags = [];
            if (_Settings__WEBPACK_IMPORTED_MODULE_2__["form"].quickBookmarks.checked) {
                const tagElements = document.querySelectorAll('._1LEXQ_3 li');
                for (const el of tagElements) {
                    const nowA = el.querySelector('a');
                    if (nowA) {
                        const nowTag = nowA.textContent.trim();
                        if (nowTag) {
                            tags.push(nowTag);
                        }
                    }
                }
            }
            // 如果一个作品是原创作品，它的 tag 列表的最前面会显示“原创” tag。以前是统一显示日文的“オリジナル”，现在则会根据用户语言显示不同的文字。这里会把“オリジナル”添加到末尾，保持和以前的习惯一致。
            if (tags.includes('原创') ||
                tags.includes('Original') ||
                tags.includes('창작')) {
                tags.push('オリジナル');
            }
            const type = this.isNovel ? 'novels' : 'illusts';
            const id = this.isNovel ? _API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelId() : _API__WEBPACK_IMPORTED_MODULE_0__["API"].getIllustId();
            // 这里加了个延迟，因为上面先点击了 pixiv 自带的收藏按钮，但不加延迟的话， p 站自己的不带 tag 的请求反而是后发送的。所以这里通过延迟让 p 站不带 tag 的请求先发送，下载器的带 tag 的请求后发送。
            setTimeout(() => {
                // 调用添加收藏的 api
                _API__WEBPACK_IMPORTED_MODULE_0__["API"].addBookmark(type, id, tags, false, _API__WEBPACK_IMPORTED_MODULE_0__["API"].getToken())
                    .then((response) => response.json())
                    .then((data) => {
                    if (data.error === false) {
                        this.isBookmarked = true;
                        this.bookmarked();
                    }
                });
            }, 400);
        });
    }
    // 如果这个作品已收藏，则改变样式
    bookmarked() {
        this.btn.classList.add(this.colorClass);
        if (this.isNovel) {
            this.btn.href = `/novel/bookmark_add.php?id=${_API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelId()}`;
        }
        else {
            this.btn.href = `/bookmark_add.php?type=illust&illust_id=${_API__WEBPACK_IMPORTED_MODULE_0__["API"].getIllustId()}`;
        }
    }
}



/***/ }),

/***/ "./src/ts/modules/QuickDownloadBtn.ts":
/*!********************************************!*\
  !*** ./src/ts/modules/QuickDownloadBtn.ts ***!
  \********************************************/
/*! exports provided: QuickDownloadBtn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuickDownloadBtn", function() { return QuickDownloadBtn; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");



// 快速下载按钮
// 只负责触发快速下载事件，不负责后续的业务逻辑
// 当在无刷新切换的页面里使用快速下载时（监听了 QuickDownload 事件），记得在切换页面时解除事件监听，避免造成重复监听
class QuickDownloadBtn {
    constructor() {
        this.live = true; // 存活状态
        this.addBtn();
        this.bindEvent();
    }
    addBtn() {
        // 在右侧添加快速下载按钮
        this.btn = document.createElement('button');
        this.btn.id = 'quick_down_btn';
        this.btn.textContent = '↓';
        this.btn.setAttribute('title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_快速下载本页') + ' (Alt + Q)');
        document.body.insertAdjacentElement('afterbegin', this.btn);
    }
    bindEvent() {
        // 点击按钮启动快速下载
        this.btn.addEventListener('click', () => {
            _States__WEBPACK_IMPORTED_MODULE_2__["states"].quickDownload = true;
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.QuickDownload);
        }, false);
        // 使用快捷键 Alt + q 启动快速下载
        window.addEventListener('keydown', (ev) => {
            if (this.live && ev.altKey && ev.keyCode === 81) {
                _States__WEBPACK_IMPORTED_MODULE_2__["states"].quickDownload = true;
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.QuickDownload);
            }
        }, false);
        // 下载完成，或者下载中止时，复位状态
        const evtList = [
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlEmpty,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStop,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadPause,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadComplete,
        ];
        for (const ev of evtList) {
            window.addEventListener(ev, () => {
                _States__WEBPACK_IMPORTED_MODULE_2__["states"].quickDownload = false;
            });
        }
        // 页面类型改变时销毁
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.pageSwitchedTypeChange, () => {
            this.destroy();
        });
    }
    destroy() {
        this.live = false;
        const parent = this.btn.parentNode;
        if (parent) {
            parent.removeChild(this.btn);
        }
    }
}



/***/ }),

/***/ "./src/ts/modules/Resume.ts":
/*!**********************************!*\
  !*** ./src/ts/modules/Resume.ts ***!
  \**********************************/
/*! exports provided: resume */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resume", function() { return resume; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./States */ "./src/ts/modules/States.ts");
/* harmony import */ var _DownloadStates__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DownloadStates */ "./src/ts/modules/DownloadStates.ts");
/* harmony import */ var _IndexedDB__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./IndexedDB */ "./src/ts/modules/IndexedDB.ts");







// 断点续传。恢复未完成的下载
class Resume {
    constructor() {
        this.flag = false; // 指示是否处于恢复模式
        this.DBName = 'PBD';
        this.DBVer = 3;
        this.metaName = 'taskMeta'; // 下载任务元数据的表名
        this.dataName = 'taskData'; // 下载任务数据的表名
        this.statesName = 'taskStates'; // 下载状态列表的表名
        this.part = []; // 储存每个分段里的数据的数量
        this.try = 0; // 任务结果是分批储存的，记录每批失败了几次。根据失败次数减少每批的数量
        // 尝试存储抓取结果时，单次存储的数量不能超过这个数字。因为超过这个数字可能会碰到单次存储的上限
        // 由于每个结果的体积可能不同，所以这只是一个预估值
        // 这有助于减少尝试次数。因为存储的思路是存储失败时改为上次数量的 1/2。例如有 100 w 个结果，存储算法会依次尝试存入 100 w、50 w、25 w、12.5 w 以此类推，直到最后有一次能成功存储一批数据。这样的话就进行了 4 次尝试才成功存入一批数据。但通过直接指定一批数据的大小为 onceMax，理想情况下可以只尝试一次就成功存入一批数据。
        // 非理想情况下，即这个数量的结果已经超过了单次存储上限（目前推测这可能会在大量抓取小说、动图时出现；如果抓取的作品大部分是插画、漫画，这个数量的结果应该不可能超出存储上限），那么这不会减少尝试数量，但因为每次尝试存储的数量不会超过这个数字，这依然有助于减少每次尝试时的资源占用、耗费时间。
        this.onceMax = 150000;
        this.putStatesTime = 2000; // 每隔指定时间存储一次最新的下载状态
        this.needPutStates = false; // 指示是否需要更新存储的下载状态
        this.IDB = new _IndexedDB__WEBPACK_IMPORTED_MODULE_6__["IndexedDB"]();
        this.init();
    }
    async init() {
        if (location.hostname.includes('pixivision.net')) {
            return;
        }
        await this.initDB();
        this.restoreData();
        this.bindEvent();
        this.regularPutStates();
        this.clearExired();
    }
    // 初始化数据库，获取数据库对象
    async initDB() {
        // 在升级事件里创建表和索引
        const onUpdate = (db) => {
            if (!db.objectStoreNames.contains(this.metaName)) {
                const metaStore = db.createObjectStore(this.metaName, {
                    keyPath: 'id',
                });
                metaStore.createIndex('id', 'id', { unique: true });
                metaStore.createIndex('url', 'url', { unique: true });
            }
            if (!db.objectStoreNames.contains(this.dataName)) {
                const dataStore = db.createObjectStore(this.dataName, {
                    keyPath: 'id',
                });
                dataStore.createIndex('id', 'id', { unique: true });
            }
            if (!db.objectStoreNames.contains(this.statesName)) {
                const statesStore = db.createObjectStore(this.statesName, {
                    keyPath: 'id',
                });
                statesStore.createIndex('id', 'id', { unique: true });
            }
        };
        // 打开数据库
        return new Promise(async (resolve, reject) => {
            resolve(await this.IDB.open(this.DBName, this.DBVer, onUpdate));
        });
    }
    // 恢复未完成任务的数据
    async restoreData() {
        // 如果下载器在抓取或者在下载，则不恢复数据
        if (_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
            return;
        }
        // 1 获取任务的元数据
        const meta = (await this.IDB.get(this.metaName, this.getURL(), 'url'));
        if (!meta) {
            this.flag = false;
            return;
        }
        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_正在恢复抓取结果'));
        this.taskId = meta.id;
        // 2 恢复抓取结果
        // 生成每批数据的 id 列表
        const dataIdList = this.createIdList(meta.id, meta.part);
        // 读取全部数据并恢复
        const promiseList = [];
        for (const id of dataIdList) {
            promiseList.push(this.IDB.get(this.dataName, id));
        }
        await Promise.all(promiseList).then((res) => {
            _Store__WEBPACK_IMPORTED_MODULE_3__["store"].result = [];
            const r = res;
            for (const taskData of r) {
                for (const data of taskData.data) {
                    _Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.push(data);
                }
            }
        });
        // 3 恢复下载状态
        const data = (await this.IDB.get(this.statesName, this.taskId));
        if (data) {
            _DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].replace(data.states);
        }
        // 恢复模式就绪
        this.flag = true;
        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已恢复抓取结果'), 2);
        // 发出恢复下载的信号
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.resume);
    }
    bindEvent() {
        // 抓取完成时，保存这次任务的数据
        const evs = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.resultChange];
        for (const ev of evs) {
            window.addEventListener(ev, async () => {
                // 首先检查这个网址下是否已经存在数据，如果有数据，则清除之前的数据，保持每个网址只有一份数据
                const taskData = (await this.IDB.get(this.metaName, this.getURL(), 'url'));
                if (taskData) {
                    await this.IDB.delete(this.metaName, taskData.id);
                    await this.IDB.delete(this.statesName, taskData.id);
                }
                // 保存本次任务的数据
                // 如果此时本次任务已经完成，就不进行保存了
                if (_DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].downloadedCount() === _Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length) {
                    return;
                }
                _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_正在保存抓取结果'));
                this.taskId = new Date().getTime();
                this.part = [];
                await this.saveTaskData();
                // 保存 meta 数据
                const metaData = {
                    id: this.taskId,
                    url: this.getURL(),
                    part: this.part.length,
                };
                this.IDB.add(this.metaName, metaData);
                // 保存 states 数据
                const statesData = {
                    id: this.taskId,
                    states: _DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].states,
                };
                this.IDB.add(this.statesName, statesData);
                _Log__WEBPACK_IMPORTED_MODULE_1__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已保存抓取结果'), 2);
            });
        }
        // 当有文件下载完成时，更新下载状态
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadSuccess, () => {
            this.needPutStates = true;
        });
        // 任务下载完毕时，以及停止任务时，清除这次任务的数据
        const clearDataEv = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadComplete, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStop];
        for (const ev of clearDataEv) {
            window.addEventListener(ev, async () => {
                if (!this.taskId) {
                    return;
                }
                const meta = (await this.IDB.get(this.metaName, this.taskId));
                if (!meta) {
                    return;
                }
                this.IDB.delete(this.metaName, this.taskId);
                this.IDB.delete(this.statesName, this.taskId);
                const dataIdList = this.createIdList(this.taskId, meta.part);
                for (const id of dataIdList) {
                    this.IDB.delete(this.dataName, id);
                }
                this.flag = false;
            });
        }
        // 开始新的抓取时，取消恢复模式
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlStart, () => {
            this.flag = false;
        });
        // 切换页面时，重新检查恢复数据
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.pageSwitch, () => {
            this.flag = false;
            this.restoreData();
        });
        // 清空已保存的抓取结果
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.clearSavedCrawl, () => {
            this.flag = false;
            this.clearSavedCrawl();
        });
    }
    // 定时 put 下载状态
    async regularPutStates() {
        setInterval(() => {
            if (this.needPutStates) {
                const statesData = {
                    id: this.taskId,
                    states: _DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].states,
                };
                this.needPutStates = false;
                // 如果此时本次任务已经完成，就不进行保存了
                if (_DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].downloadedCount() === _Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length) {
                    return;
                }
                this.IDB.put(this.statesName, statesData);
            }
        }, this.putStatesTime);
    }
    // 存储抓取结果
    async saveTaskData() {
        return new Promise(async (resolve, reject) => {
            // 每一批任务的第一次执行会尝试保存所有剩余数据(0.5 的 0 次幂是 1)
            // 如果出错了，则每次执行会尝试保存上一次数据量的一半，直到这次存储成功
            // 之后继续进行下一批任务（如果有）
            let tryNum = Math.floor(_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length * Math.pow(0.5, this.try));
            // 如果这批尝试数据大于指定数量，则设置为指定数量
            tryNum > this.onceMax && (tryNum = this.onceMax);
            let data = {
                id: this.numAppendNum(this.taskId, this.part.length),
                data: _Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.slice(this.getPartTotal(), this.getPartTotal() + tryNum),
            };
            try {
                // 当成功存储了一批数据时
                await this.IDB.add(this.dataName, data);
                this.part.push(data.data.length); // 记录这一次保存的结果数量
                this.try = 0; // 重置已尝试次数
                // 任务数据全部添加完毕
                if (this.getPartTotal() >= _Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length) {
                    // console.log('add complete')
                    resolve();
                }
                else {
                    // 任务数据没有添加完毕，继续添加
                    resolve(this.saveTaskData());
                }
            }
            catch (error) {
                // 当存储失败时
                console.error(error);
                if (error.target && error.target.error && error.target.error.message) {
                    const msg = error.target.error.message;
                    if (msg.includes('too large')) {
                        // 体积超大
                        // 尝试次数 + 1 ，进行下一次尝试
                        this.try++;
                        resolve(this.saveTaskData());
                    }
                    else {
                        // 未知错误，不再进行尝试
                        this.try = 0;
                        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].error('IndexedDB: ' + msg);
                        reject(error);
                    }
                }
            }
        });
    }
    // 清除过期的数据
    async clearExired() {
        // 数据的过期时间，设置为 30 天。30*24*60*60*1000
        const expiryTime = 2592000000;
        const nowTime = new Date().getTime();
        const callback = (item) => {
            if (item) {
                const data = item.value;
                // 检查数据是否过期
                if (nowTime - data.id > expiryTime) {
                    this.IDB.delete(this.metaName, data.id);
                    this.IDB.delete(this.statesName, data.id);
                    const dataIdList = this.createIdList(data.id, data.part);
                    for (const id of dataIdList) {
                        this.IDB.delete(this.dataName, id);
                    }
                }
                item.continue();
            }
        };
        this.IDB.openCursor(this.metaName, callback);
    }
    // 计算 part 数组里的数字之和
    getPartTotal() {
        if (this.part.length === 0) {
            return 0;
        }
        return this.part.reduce((prev, curr) => {
            return prev + curr;
        });
    }
    // 处理本页面的 url
    getURL() {
        return window.location.href.split('#')[0];
    }
    // 在数字后面追加数字
    // 用于在 task id  后面追加序号数字(part)
    numAppendNum(id, num) {
        return parseInt(id.toString() + num);
    }
    // 根据 taskMeta 里的 id 和 part 数量，生成 taskData 里对应的数据的 id 列表
    createIdList(taskid, part) {
        // part 记录数据分成了几部分，所以是从 1 开始的，而不是从 0 开始
        // 生成的 id 的结尾是从 0 开始增加的
        const arr = [];
        let start = 0;
        while (start < part) {
            arr.push(this.numAppendNum(taskid, start));
            start++;
        }
        return arr;
    }
    // 清空已保存的抓取结果
    async clearSavedCrawl() {
        await Promise.all([
            this.IDB.clear(this.metaName),
            this.IDB.clear(this.dataName),
            this.IDB.clear(this.statesName),
        ]);
        window.alert(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数据清除完毕'));
    }
}
const resume = new Resume();



/***/ }),

/***/ "./src/ts/modules/SaveAvatarIcon.ts":
/*!******************************************!*\
  !*** ./src/ts/modules/SaveAvatarIcon.ts ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _ImageToIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ImageToIcon */ "./src/ts/modules/ImageToIcon.ts");






// 保存用户头像为图标
class SaveAvatarIcon {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].events.saveAvatarIcon, () => {
            this.saveAvatarIcon();
        });
    }
    async saveAvatarIcon() {
        const userId = _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].getUserId();
        const userProfile = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getUserProfile(userId);
        const bigImg = userProfile.body.imageBig; // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
        const fullSizeImg = bigImg.replace('_170', ''); // 去掉 170 标记，获取头像图片的原图
        // 生成 ico 文件
        // 尺寸固定为 256，因为尺寸更小的图标如 128，在 windows 资源管理器里会被缩小到 48 显示
        const blob = await _ImageToIcon__WEBPACK_IMPORTED_MODULE_5__["img2ico"].convert({
            size: [256],
            source: fullSizeImg,
            shape: 'fillet',
            bleed: true,
        });
        // 直接保存到下载文件夹
        const url = URL.createObjectURL(blob);
        const name = `ico_${userProfile.body.name}_${userId}.ico`;
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].downloadFile(url, name);
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].success('✓ ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_保存用户头像为图标'));
        _EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].events.closeCenterPanel);
    }
}
new SaveAvatarIcon();


/***/ }),

/***/ "./src/ts/modules/SaveNamingRule.ts":
/*!******************************************!*\
  !*** ./src/ts/modules/SaveNamingRule.ts ***!
  \******************************************/
/*! exports provided: SaveNamingRule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SaveNamingRule", function() { return SaveNamingRule; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _ThemeColor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ThemeColor */ "./src/ts/modules/ThemeColor.ts");





// 保存和加载命名规则
class SaveNamingRule {
    constructor(ruleInput) {
        this.storeName = 'xzNamingList';
        this.list = []; // 保存明明列表，是一个先进先出的队列
        this.limit = 10; // 最大保存数量
        this._show = false; // 是否显示列表
        this.html = `
  <div class="saveNamingRuleWrap">
  <button class="nameSave textButton has_tip" type="button" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存命名规则提示', this.limit.toString())}">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存')}</button>
  <button class="nameLoad textButton" type="button">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_加载')}</button>
  <ul class="namingRuleList"></ul>
  </div>`;
        this.ruleInput = ruleInput;
        const wrap = _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].useSlot('saveNamingRule', this.html);
        _ThemeColor__WEBPACK_IMPORTED_MODULE_4__["themeColor"].register(wrap);
        this.saveBtn = wrap.querySelector('button.nameSave');
        this.loadBtn = wrap.querySelector('button.nameLoad');
        this.listWrap = wrap.querySelector('ul.namingRuleList');
        this.createList();
        this.bindEvent();
    }
    set show(boolean) {
        this._show = boolean;
        boolean ? this.showListWrap() : this.hideListWrap();
    }
    get show() {
        return this._show;
    }
    bindEvent() {
        this.saveBtn.addEventListener('click', () => {
            this.add(this.ruleInput.value);
        });
        this.loadBtn.addEventListener('click', () => {
            this.show = !this.show;
        });
        this.listWrap.addEventListener('mouseleave', () => {
            this.show = false;
        });
    }
    load() {
        const data = localStorage.getItem(this.storeName);
        if (data) {
            this.list = JSON.parse(data);
        }
    }
    save() {
        localStorage.setItem(this.storeName, JSON.stringify(this.list));
    }
    add(rule) {
        if (this.list.length === this.limit) {
            this.list.splice(0, 1);
        }
        this.list.push(rule);
        _Log__WEBPACK_IMPORTED_MODULE_3__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已保存命名规则'));
        this.handleChange();
    }
    delete(index) {
        this.list.splice(index, 1);
        this.handleChange();
    }
    select(rule) {
        this.ruleInput.value = rule;
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.settingChange, { name: 'userSetName', value: rule });
    }
    handleChange() {
        this.save();
        this.createList();
    }
    createList() {
        this.load();
        const htmlArr = [];
        for (let i = 0; i < this.list.length; i++) {
            const html = `<li>
      <span class="rule">${this.list[i]}</span>
      <button class="delete textButton" type="button" data-index="${i}">×</button>
    </li>`;
            htmlArr.push(html);
        }
        if (this.list.length === 0) {
            htmlArr.push(`<li><i>&nbsp;&nbsp;&nbsp;&nbsp;no data</i></li>`);
        }
        this.listWrap.innerHTML = htmlArr.join('');
        const ruleEls = this.listWrap.querySelectorAll('.rule');
        for (const el of ruleEls) {
            el.addEventListener('click', () => {
                this.select(el.textContent);
                this.show = false;
            });
        }
        const deleteEls = this.listWrap.querySelectorAll('.delete');
        for (const el of deleteEls) {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                this.delete(index);
            });
        }
    }
    showListWrap() {
        this.listWrap.style.display = 'block';
    }
    hideListWrap() {
        this.listWrap.style.display = 'none';
    }
}



/***/ }),

/***/ "./src/ts/modules/SaveSettings.ts":
/*!****************************************!*\
  !*** ./src/ts/modules/SaveSettings.ts ***!
  \****************************************/
/*! exports provided: SaveSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SaveSettings", function() { return SaveSettings; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");

class SaveSettings {
    constructor(form) {
        // 本地存储中使用的 name
        this.storeName = 'xzSetting';
        // 需要持久化保存的设置的默认值
        this.optionDefault = {
            setWantPage: '-1',
            firstFewImagesSwitch: false,
            firstFewImages: 1,
            downType0: true,
            downType1: true,
            downType2: true,
            downType3: true,
            downSingleImg: true,
            downMultiImg: true,
            downColorImg: true,
            downBlackWhiteImg: true,
            setOnlyBmk: false,
            ugoiraSaveAs: 'webm',
            convertUgoiraThread: 1,
            needTag: '',
            notNeedTag: '',
            quietDownload: true,
            downloadThread: 5,
            userSetName: '{id}',
            tagNameToFileName: false,
            alwaysFolder: true,
            multipleImageDir: false,
            multipleImageFolderName: '1',
            showOptions: true,
            postDate: false,
            postDateStart: '',
            postDateEnd: '',
            previewResult: true,
            BMKNumSwitch: false,
            BMKNumMin: '0',
            BMKNumMax: '999999',
            setWHSwitch: false,
            setWidthAndOr: '&',
            setWidth: '0',
            setHeight: '0',
            ratioSwitch: false,
            ratio: '1',
            userRatio: '1.4',
            idRangeSwitch: false,
            idRangeInput: '0',
            idRange: '1',
            needTagSwitch: false,
            notNeedTagSwitch: false,
            quickBookmarks: true,
            noSerialNo: false,
            filterBlackWhite: false,
            sizeSwitch: false,
            sizeMin: '0',
            sizeMax: '100',
            novelSaveAs: 'txt',
            saveNovelMeta: false,
            deduplication: false,
            dupliStrategy: 'strict',
            fileNameLengthLimitSwitch: false,
            fileNameLengthLimit: 200,
        };
        // 需要持久化保存的设置
        this.options = this.optionDefault;
        this.form = form;
        this.ListenOptionChange();
        this.handleChange();
        this.restoreOption();
    }
    // 处理输入框： change 时保存 value
    saveTextInput(name) {
        const el = this.form[name];
        el.addEventListener('change', () => {
            this.emitChange(name, el.value);
        });
    }
    // 处理复选框： click 时保存 checked
    saveCheckBox(name) {
        const el = this.form[name];
        el.addEventListener('click', () => {
            this.emitChange(name, el.checked);
        });
    }
    // 处理单选框： click 时保存 value
    saveRadio(name) {
        const radios = this.form[name];
        for (const radio of radios) {
            radio.addEventListener('click', () => {
                this.emitChange(name, radio.value);
            });
        }
    }
    // 监听所有选项的变化，触发 settingChange 事件
    // 该函数可执行一次，否则事件会重复绑定
    ListenOptionChange() {
        // 保存页数/个数设置
        this.saveTextInput('setWantPage');
        // 保存下载的作品类型
        this.saveCheckBox('downType0');
        this.saveCheckBox('downType1');
        this.saveCheckBox('downType2');
        this.saveCheckBox('downType3');
        this.saveCheckBox('downSingleImg');
        this.saveCheckBox('downMultiImg');
        this.saveCheckBox('downColorImg');
        this.saveCheckBox('downBlackWhiteImg');
        // 保存多图作品设置
        this.saveCheckBox('firstFewImagesSwitch');
        this.saveTextInput('firstFewImages');
        // 保存只下载已收藏
        this.saveCheckBox('setOnlyBmk');
        // 保存动图格式选项
        this.saveRadio('ugoiraSaveAs');
        // 保存动图转换线程数
        this.saveTextInput('convertUgoiraThread');
        this.saveRadio('novelSaveAs');
        this.saveCheckBox('saveNovelMeta');
        // 保存收藏数量选项
        this.saveCheckBox('BMKNumSwitch');
        // 保存收藏数量数值
        this.saveTextInput('BMKNumMin');
        this.saveTextInput('BMKNumMax');
        // 保存启用快速收藏
        this.saveCheckBox('quickBookmarks');
        // 保存宽高条件
        this.saveCheckBox('setWHSwitch');
        this.saveRadio('setWidthAndOr');
        this.saveTextInput('setWidth');
        this.saveTextInput('setHeight');
        // 保存宽高比例
        this.saveCheckBox('ratioSwitch');
        this.saveRadio('ratio');
        this.saveTextInput('userRatio');
        // 保存投稿时间
        this.saveCheckBox('postDate');
        this.saveTextInput('postDateStart');
        this.saveTextInput('postDateEnd');
        // 保存 id 范围
        this.saveCheckBox('idRangeSwitch');
        this.saveTextInput('idRangeInput');
        this.saveRadio('idRange');
        // 保存必须的 tag 设置
        this.saveCheckBox('needTagSwitch');
        this.saveTextInput('needTag');
        // 保存排除的 tag 设置
        this.saveCheckBox('notNeedTagSwitch');
        this.saveTextInput('notNeedTag');
        // 保存命名规则
        const userSetNameInput = this.form.userSetName;
        ['change', 'focus'].forEach((ev) => {
            userSetNameInput.addEventListener(ev, () => {
                this.emitChange('userSetName', userSetNameInput.value);
            });
        });
        // 保存是否添加标记名称
        this.saveCheckBox('tagNameToFileName');
        // 保存第一张图不带序号
        this.saveCheckBox('noSerialNo');
        // 保存是否始终建立文件夹
        this.saveCheckBox('alwaysFolder');
        // 保存是否为多图作品自动建立文件夹
        this.saveCheckBox('multipleImageDir');
        // 保存多图建立文件夹时的命名规则
        this.saveRadio('multipleImageFolderName');
        // 保存文件体积限制
        this.saveCheckBox('sizeSwitch');
        this.saveTextInput('sizeMin');
        this.saveTextInput('sizeMax');
        // 保存自动下载
        this.saveCheckBox('quietDownload');
        // 保存下载线程
        this.saveTextInput('downloadThread');
        // 保存预览搜索结果
        this.saveCheckBox('previewResult');
        // 保存去重设置
        this.saveCheckBox('deduplication');
        this.saveRadio('dupliStrategy');
        // 保存文件名长度限制
        this.saveCheckBox('fileNameLengthLimitSwitch');
        this.saveTextInput('fileNameLengthLimit');
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.resetOption, () => {
            this.form.reset();
            this.reset();
        });
    }
    emitChange(name, value) {
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.settingChange, { name: name, value: value });
    }
    // 设置发生改变时，保存设置到本地存储
    handleChange() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.settingChange, (event) => {
            const data = event.detail.data;
            if (Reflect.has(this.optionDefault, data.name)) {
                if (this.options[data.name] !== data.value) {
                    ;
                    this.options[data.name] = data.value;
                    localStorage.setItem(this.storeName, JSON.stringify(this.options));
                }
            }
        });
    }
    // 恢复值为 Boolean 的设置项
    // 给复选框使用
    restoreBoolean(name) {
        // 优先使用用户设置的值
        if (this.options[name] !== undefined) {
            this.form[name].checked = this.options[name];
        }
        else {
            // 否则使用默认值
            this.form[name].checked = this.optionDefault[name];
        }
        // 这里不能简单的使用 || 符号来处理，考虑如下情况：
        // this.options[name] || this.optionDefault[name]
        // 用户设置为 false，默认值为 true，使用 || 的话就恒为 true 了
    }
    // 恢复值为 string 的设置项
    // 给单选按钮和文本框使用
    restoreString(name) {
        // 优先使用用户设置的值
        if (this.options[name] !== undefined) {
            this.form[name].value = this.options[name].toString();
        }
        else {
            // 否则使用默认值
            this.form[name].value = this.optionDefault[name].toString();
        }
    }
    // 读取持久化数据，或使用默认设置，恢复设置表单的设置项
    restoreOption() {
        const savedOption = localStorage.getItem(this.storeName);
        // 读取保存的设置
        if (savedOption) {
            this.options = JSON.parse(savedOption);
        }
        else {
            // 如果没有保存过，则不做处理
            return;
        }
        // 设置下载的作品类型
        this.restoreBoolean('downType0');
        this.restoreBoolean('downType1');
        this.restoreBoolean('downType2');
        this.restoreBoolean('downType3');
        this.restoreBoolean('downSingleImg');
        this.restoreBoolean('downMultiImg');
        this.restoreBoolean('downColorImg');
        this.restoreBoolean('downBlackWhiteImg');
        // 多图下载前几张图作品设置
        this.restoreBoolean('firstFewImagesSwitch');
        this.restoreString('firstFewImages');
        // 设置只下载已收藏
        this.restoreBoolean('setOnlyBmk');
        // 设置动图格式选项
        this.restoreString('ugoiraSaveAs');
        // 设置动图转换线程数
        this.restoreString('convertUgoiraThread');
        this.restoreString('novelSaveAs');
        this.restoreBoolean('saveNovelMeta');
        // 设置收藏数量选项
        this.restoreBoolean('BMKNumSwitch');
        // 设置收藏数量数值
        this.restoreString('BMKNumMin');
        this.restoreString('BMKNumMax');
        // 设置启用快速收藏
        this.restoreBoolean('quickBookmarks');
        // 设置宽高条件
        this.restoreBoolean('setWHSwitch');
        this.restoreString('setWidthAndOr');
        this.restoreString('setWidth');
        this.restoreString('setHeight');
        // 设置宽高比例
        this.restoreBoolean('ratioSwitch');
        this.restoreString('ratio');
        this.restoreString('userRatio');
        // 设置 id 范围
        this.restoreBoolean('idRangeSwitch');
        this.restoreString('idRangeInput');
        this.restoreString('idRange');
        // 设置必须的 tag
        this.restoreBoolean('needTagSwitch');
        this.restoreString('needTag');
        // 设置排除的 tag
        this.restoreBoolean('notNeedTagSwitch');
        this.restoreString('notNeedTag');
        // 设置投稿时间
        this.restoreBoolean('postDate');
        this.restoreString('postDateStart');
        this.restoreString('postDateEnd');
        // 设置自动下载
        this.restoreBoolean('quietDownload');
        // 设置下载线程
        this.restoreString('downloadThread');
        // 设置文件命名规则
        this.restoreString('userSetName');
        // 设置是否添加标记名称
        this.restoreBoolean('tagNameToFileName');
        // 设置第一张图不带序号
        this.restoreBoolean('noSerialNo');
        // 设置是否始终建立文件夹
        this.restoreBoolean('alwaysFolder');
        // 设置是否为多图作品自动建立文件夹
        this.restoreBoolean('multipleImageDir');
        // 设置多图作品建立文件夹时的文件名规则
        this.restoreString('multipleImageFolderName');
        // 设置预览搜索结果
        this.restoreBoolean('previewResult');
        // 设置文件体积限制
        this.restoreBoolean('sizeSwitch');
        this.restoreString('sizeMin');
        this.restoreString('sizeMax');
        // 恢复去重设置
        this.restoreBoolean('deduplication');
        this.restoreString('dupliStrategy');
        // 恢复文件名长度限制
        this.restoreBoolean('fileNameLengthLimitSwitch');
        this.restoreString('fileNameLengthLimit');
    }
    // 重设选项
    reset() {
        // 将保存的选项恢复为默认值
        this.options = this.optionDefault;
        // 覆写本地存储里的设置为默认值
        localStorage.setItem(this.storeName, JSON.stringify(this.options));
        // 重设选项
        this.restoreOption();
        // 触发设置改变事件
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.settingChange);
    }
}



/***/ }),

/***/ "./src/ts/modules/Settings.ts":
/*!************************************!*\
  !*** ./src/ts/modules/Settings.ts ***!
  \************************************/
/*! exports provided: setting, form */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setting", function() { return setting; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "form", function() { return form; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _FormHTML__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FormHTML */ "./src/ts/modules/FormHTML.ts");
/* harmony import */ var _SaveSettings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SaveSettings */ "./src/ts/modules/SaveSettings.ts");
/* harmony import */ var _SaveNamingRule__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SaveNamingRule */ "./src/ts/modules/SaveNamingRule.ts");








// 设置表单
class Settings {
    constructor() {
        this.activeClass = 'active';
        this.chooseKeys = ['Enter', 'NumpadEnter']; // 让回车键可以控制复选框（浏览器默认只支持空格键）
        this.firstFewImages = 0;
        this.form = _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].useSlot('form', _FormHTML__WEBPACK_IMPORTED_MODULE_5__["default"]);
        this.allCheckBox = this.form.querySelectorAll('input[type="checkbox"]');
        this.allRadio = this.form.querySelectorAll('input[type="radio"]');
        this.allSwitch = this.form.querySelectorAll('.checkbox_switch');
        this.allLabel = this.form.querySelectorAll('label');
        this.allTabTitle = this.form.querySelectorAll('.tabsTitle .title');
        this.allTabCon = this.form.querySelectorAll('.tabsContnet .con');
        this.bindEvents();
        this.firstFewImages = this.getFirstFewImages();
        new _SaveNamingRule__WEBPACK_IMPORTED_MODULE_7__["SaveNamingRule"](this.form.userSetName);
        new _SaveSettings__WEBPACK_IMPORTED_MODULE_6__["SaveSettings"](this.form);
        // new SaveSettings 会初始化选项，但可能会有一些选项的值在初始化过程中没有发生改变，也就不会被监听到变化。所以这里需要直接初始化以下状态。
        this.initFormBueatiful();
        // 激活第一个选项卡
        this.activeTab(0);
    }
    // 设置表单上美化元素的状态
    initFormBueatiful() {
        // 设置改变时，重设 label 激活状态
        this.resetLabelActive();
        // 重设该选项的子选项的显示/隐藏
        this.resetSubOptionDisplay();
    }
    // 设置激活的选项卡
    activeTab(no = 0) {
        for (const title of this.allTabTitle) {
            title.classList.remove(this.activeClass);
        }
        this.allTabTitle[no].classList.add(this.activeClass);
        for (const con of this.allTabCon) {
            con.style.display = 'none';
        }
        this.allTabCon[no].style.display = 'block';
    }
    bindEvents() {
        // 给美化的复选框绑定功能
        for (const checkbox of this.allCheckBox) {
            this.bindCheckboxEvent(checkbox);
        }
        // 给美化的单选按钮绑定功能
        for (const radio of this.allRadio) {
            this.bindRadioEvent(radio);
        }
        // 处理 label 状态
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.settingChange, () => {
            this.initFormBueatiful();
        });
        // 在选项卡的标题上触发事件时，激活对应的选项卡
        for (let index = 0; index < this.allTabTitle.length; index++) {
            ;
            ['click', 'mouseenter'].forEach((name) => {
                this.allTabTitle[index].addEventListener(name, () => {
                    this.activeTab(index);
                });
            });
        }
        // 当可以开始下载时，切换到“下载”选项卡
        for (const ev of [_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resultChange, _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resume]) {
            window.addEventListener(ev, () => {
                this.activeTab(1);
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlEmpty, () => {
            this.activeTab(0);
        });
        // 当 firstFewImages 设置改变时，保存它的值
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.settingChange, (event) => {
            const data = event.detail.data;
            if (data.name === 'firstFewImages') {
                this.firstFewImages = this.getFirstFewImages();
            }
        });
        // 预览文件名
        _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].addBtn('namingBtns', _Colors__WEBPACK_IMPORTED_MODULE_3__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_预览文件名')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.previewFileName);
        }, false);
        // 导出 csv
        _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].addBtn('namingBtns', _Colors__WEBPACK_IMPORTED_MODULE_3__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_导出csv')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.outputCSV);
        }, false);
        // 显示命名字段提示
        this.form
            .querySelector('.showFileNameTip')
            .addEventListener('click', () => _DOM__WEBPACK_IMPORTED_MODULE_2__["DOM"].toggleEl(document.querySelector('.fileNameTip')));
        // 输入框获得焦点时自动选择文本（文件名输入框例外）
        const centerInputs = this.form.querySelectorAll('input[type=text]');
        for (const el of centerInputs) {
            if (el.name !== 'userSetName') {
                el.addEventListener('focus', function () {
                    this.select();
                });
            }
        }
        // 把下拉框的选择项插入到文本框里
        this.insertValueToInput(this.form.fileNameSelect, this.form.userSetName);
    }
    // 把下拉框的选择项插入到文本框里
    insertValueToInput(from, to) {
        from.addEventListener('change', () => {
            if (from.value !== 'default') {
                // 把选择项插入到光标位置,并设置新的光标位置
                const position = to.selectionStart;
                to.value =
                    to.value.substr(0, position) +
                        from.value +
                        to.value.substr(position, to.value.length);
                to.selectionStart = position + from.value.length;
                to.selectionEnd = position + from.value.length;
                to.focus();
            }
        });
    }
    // 设置复选框的事件
    bindCheckboxEvent(el) {
        // 让复选框支持用回车键选择
        el.addEventListener('keydown', (event) => {
            if (this.chooseKeys.includes(event.code)) {
                el.checked = !el.checked;
                this.emitChange(el.name, el.checked);
            }
        });
        // 点击美化按钮，反转复选框的值
        el.nextElementSibling.addEventListener('click', () => {
            el.checked = !el.checked;
            this.emitChange(el.name, el.checked);
        });
        // 点击它的 label 时，传递它的值
        const label = this.form.querySelector(`label[for="${el.id}"]`);
        if (label) {
            label.addEventListener('click', () => {
                // 点击复选框的 label 不要手动修改 checked ，因为浏览器会自动处理
                this.emitChange(el.name, el.checked);
            });
        }
    }
    // 设置单选控件的事件
    bindRadioEvent(el) {
        // 点击美化按钮，选择当前单选控件
        el.nextElementSibling.addEventListener('click', () => {
            el.checked = true;
            // 对于单选按钮，它的值是 value，不是 checked
            this.emitChange(el.name, this.form[el.name].value);
        });
        // 点击它的 label 时，传递它的值
        const label = this.form.querySelector(`label[for="${el.id}"]`);
        if (label) {
            label.addEventListener('click', () => {
                this.emitChange(el.name, this.form[el.name].value);
            });
        }
    }
    // 当选项的值被改变时，触发 settingChange 事件
    emitChange(name, value) {
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.settingChange, { name: name, value: value });
    }
    // 重设 label 的激活状态
    resetLabelActive() {
        // 设置复选框的 label 的激活状态
        for (const checkbox of this.allCheckBox) {
            this.setLabelActive(checkbox);
        }
        // 设置单选按钮的 label 的激活状态
        for (const radio of this.allRadio) {
            this.setLabelActive(radio);
        }
    }
    // 设置 input 元素对应的 label 的激活状态
    setLabelActive(input) {
        const label = this.form.querySelector(`label[for="${input.id}"]`);
        if (label) {
            const method = input.checked ? 'add' : 'remove';
            label.classList[method]('active');
        }
    }
    // 重设子选项的显示/隐藏
    resetSubOptionDisplay() {
        for (const _switch of this.allSwitch) {
            const subOption = this.form.querySelector(`.subOptionWrap[data-show="${_switch.name}"]`);
            if (subOption) {
                subOption.style.display = _switch.checked ? 'inline' : 'none';
            }
        }
    }
    // 获取作品张数设置
    getFirstFewImages() {
        const check = _API__WEBPACK_IMPORTED_MODULE_0__["API"].checkNumberGreater0(this.form.firstFewImages.value);
        if (check.result) {
            return check.value;
        }
        else {
            return 999;
        }
    }
    // 计算要从这个作品里下载几张图片
    getDLCount(pageCount) {
        if (this.form.firstFewImagesSwitch.checked && this.firstFewImages <= pageCount) {
            return this.firstFewImages;
        }
        return pageCount;
    }
}
const setting = new Settings();
const form = setting.form;



/***/ }),

/***/ "./src/ts/modules/ShowConvertCount.ts":
/*!********************************************!*\
  !*** ./src/ts/modules/ShowConvertCount.ts ***!
  \********************************************/
/*! exports provided: ShowConvertCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowConvertCount", function() { return ShowConvertCount; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");


// 显示正在转换的文件数量
class ShowConvertCount {
    constructor(el) {
        this.el = el;
        this.bindEvent();
    }
    bindEvent() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.convertChange, (ev) => {
            const count = ev.detail.data;
            let convertText = '';
            if (count > 0) {
                convertText = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_转换任务提示', count.toString());
            }
            this.el.textContent = convertText;
        });
    }
}



/***/ }),

/***/ "./src/ts/modules/ShowSkipCount.ts":
/*!*****************************************!*\
  !*** ./src/ts/modules/ShowSkipCount.ts ***!
  \*****************************************/
/*! exports provided: ShowSkipCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowSkipCount", function() { return ShowSkipCount; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");


// 显示跳过下载的文件数量
class ShowSkipCount {
    constructor(el) {
        this.count = 0; // 跳过下载的数量
        this.el = el;
        this.bindEvent();
    }
    bindEvent() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlStart, () => {
            this.reset();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStop, () => {
            // 重置计数但不清空提示文字，因为用户还需要看
            this.count = 0;
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.skipSaveFile, () => {
            this.addCount();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStart, () => {
            if (this.count === 0) {
                this.reset();
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadComplete, () => {
            // 重置计数但不清空提示文字，因为用户还需要看
            this.count = 0;
        });
    }
    addCount() {
        this.count++;
        this.el.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_已跳过n个文件', this.count.toString());
    }
    reset() {
        this.count = 0;
        this.el.textContent = '';
    }
}



/***/ }),

/***/ "./src/ts/modules/States.ts":
/*!**********************************!*\
  !*** ./src/ts/modules/States.ts ***!
  \**********************************/
/*! exports provided: states */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "states", function() { return states; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");

// 储存需要跨组件使用的、会变化的状态
// 这里的状态不需要持久化保存。
// 状态的值通常只由单一的组件修改，其他组件只读取不修改
class States {
    constructor() {
        // 表示下载器是否处于繁忙状态
        // 如果下载器正在抓取中，或者正在下载中，则为 true；如果下载器处于空闲状态，则为 false
        // 修改者 1：本组件根据下载器的事件来修改这个状态
        this.busy = false;
        // 快速下载标记。如果为 true 说明进入了快速下载模式
        // 修改者 1：QuickDownloadBtn 组件里，启动快速下载时设为 true，下载完成或中止时复位到 false
        this.quickDownload = false;
        // 不自动下载的标记。如果为 true，那么下载器在抓取完成后，不会自动开始下载。（即使用户设置了自动开始下载）
        // 修改者 1：InitSearchArtworkPage 组件根据“预览搜索结果”的设置，修改这个状态
        this.notAutoDownload = false;
        // 在排行榜抓取时，是否只抓取“首次登场”的作品
        // 修改者 1：InitRankingArtworkPage 组件修改这个状态
        this.debut = false;
        this.bindEvent();
    }
    bindEvent() {
        const idle = [
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlFinish,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadPause,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStop,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadComplete,
        ];
        idle.forEach((type) => {
            window.addEventListener(type, () => {
                this.busy = false;
            });
        });
        const busy = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlStart, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStart];
        busy.forEach((type) => {
            window.addEventListener(type, () => {
                this.busy = true;
            });
        });
    }
}
const states = new States();



/***/ }),

/***/ "./src/ts/modules/Store.ts":
/*!*********************************!*\
  !*** ./src/ts/modules/Store.ts ***!
  \*********************************/
/*! exports provided: store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "store", function() { return store; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");

// 储存抓取结果
class Store {
    constructor() {
        this.idList = []; // 储存从列表中抓取到的作品的 id
        this.resultMeta = []; // 储存抓取结果的元数据。
        // 当用于图片作品时，它可以根据每个作品需要下载多少张，生成每一张图片的信息
        this.resultIDList = []; // 储存抓取结果的元数据的 id 列表，用来判断该作品是否已经添加过了，避免重复添加
        // resultIDList 可能会有隐患，因为没有区分图片和小说。如果一次抓取任务里，有图片和小说使用了相同的 id，那么只会保留先抓取到的那个。不过目前看来这种情况几乎不会发生。
        this.result = []; // 储存抓取结果
        this.rankList = {}; // 储存作品在排行榜中的排名
        // 储存页面信息，用来生成文件名
        this.pageInfo = {
            pageTitle: '',
            pageTag: '',
        };
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.crawlStart, () => {
            this.reset();
        });
    }
    assignResult(data) {
        // 图片详细信息的默认值
        const dataDefault = {
            idNum: 0,
            id: '',
            url: '',
            thumb: '',
            title: '',
            pageCount: 1,
            dlCount: 1,
            tags: [],
            tagsWithTransl: [],
            tagsTranslOnly: [],
            user: '',
            userId: '',
            fullWidth: 0,
            fullHeight: 0,
            ext: '',
            bmk: 0,
            bookmarked: false,
            date: '',
            type: 0,
            rank: '',
            ugoiraInfo: null,
            seriesTitle: null,
            seriesOrder: null,
            novelBlob: null,
        };
        return Object.assign(dataDefault, data);
    }
    // 添加每个作品的信息。只需要传递有值的属性
    addResult(data) {
        // 检查该作品数据是否已存在，已存在则不添加
        if (data.idNum !== undefined && this.resultIDList.includes(data.idNum)) {
            return;
        }
        if (data.idNum !== undefined) {
            this.resultIDList.push(data.idNum);
        }
        // 添加该作品的元数据
        const result = this.assignResult(data);
        this.resultMeta.push(result);
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.addResult, result);
        if (result.type === 3) {
            this.result.push(result);
        }
        else {
            // 添加该作品里每一张图片的数据
            for (let i = 0; i < result.dlCount; i++) {
                const result = this.assignResult(data);
                result.idNum = parseInt(result.id);
                result.id = result.id + `_p${i}`;
                result.url = result.url.replace('p0', 'p' + i);
                this.result.push(result);
            }
        }
    }
    getRankList(index) {
        return this.rankList[index];
    }
    setRankList(id, rank) {
        this.rankList[id] = rank;
    }
    reset() {
        this.resultMeta = [];
        this.resultIDList = [];
        this.result = [];
        this.idList = [];
        this.rankList = {};
    }
}
const store = new Store();



/***/ }),

/***/ "./src/ts/modules/Support.ts":
/*!***********************************!*\
  !*** ./src/ts/modules/Support.ts ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Config */ "./src/ts/modules/Config.ts");




// 辅助功能
class Support {
    constructor() {
        this.newTag = '_xzNew660';
        this.checkConflict();
        this.supportListenHistory();
        this.listenPageSwitch();
        this.checkNew();
        this.showNew();
        _API__WEBPACK_IMPORTED_MODULE_2__["API"].updateToken();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resetOption, () => {
            localStorage.removeItem('xzToken');
            _API__WEBPACK_IMPORTED_MODULE_2__["API"].updateToken();
        });
    }
    // 处理和脚本版的冲突
    checkConflict() {
        // 标注自己
        window.sessionStorage.setItem('xz_pixiv_extension', '1');
        // 把脚本版的标记设置为 0，这样脚本版就不会运行
        window.sessionStorage.setItem('xz_pixiv_userscript', '0');
    }
    // 检查新版本
    async checkNew() {
        // 读取上一次检查的时间，如果超过指定的时间，则检查 GitHub 上的信息
        const timeName = 'xzUpdateTime';
        const verName = 'xzGithubVer';
        const interval = 1000 * 60 * 30; // 30 分钟检查一次
        const lastTime = localStorage.getItem(timeName);
        if (!lastTime || new Date().getTime() - parseInt(lastTime) > interval) {
            // 获取最新的 releases 信息
            const latest = await fetch(_Config__WEBPACK_IMPORTED_MODULE_3__["default"].latestReleaseAPI);
            const latestJson = await latest.json();
            const latestVer = latestJson.name;
            // 保存 GitHub 上的版本信息
            localStorage.setItem(verName, latestVer);
            // 保存本次检查的时间戳
            localStorage.setItem(timeName, new Date().getTime().toString());
        }
        // 获取本地扩展的版本号
        const manifest = await fetch(chrome.extension.getURL('manifest.json'));
        const manifestJson = await manifest.json();
        const manifestVer = manifestJson.version;
        // 比较大小
        const latestVer = localStorage.getItem(verName);
        if (latestVer && manifestVer < latestVer) {
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.hasNewVer);
        }
    }
    // 显示最近更新内容
    showNew() {
        const storeNmae = 'xzNewVerTag';
        const value = localStorage.getItem(storeNmae);
        if (window.location.host.includes('pixiv.net') && value !== this.newTag) {
            const whatIsNewHtml = `
      <div class="xz_new">
        <p class="title">Powerful Pixiv Downloader ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_最近更新')}</p>
        <p class="content">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl(this.newTag)}</p>
        <button class="btn">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_确定')}</button>
      </div>`;
            document.body.insertAdjacentHTML('afterbegin', whatIsNewHtml);
            const whatIsNewEl = document.querySelector('.xz_new');
            whatIsNewEl.querySelector('.btn').addEventListener('click', () => {
                localStorage.setItem(storeNmae, this.newTag);
                whatIsNewEl.parentNode.removeChild(whatIsNewEl);
            });
        }
    }
    // 使用无刷新加载的页面需要监听 url 的改变，这里为这些事件添加监听支持
    supportListenHistory() {
        const element = document.createElement('script');
        element.setAttribute('type', 'text/javascript');
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
    `;
        document.head.appendChild(element);
    }
    // 监听页面的无刷新切换。某些页面可以无刷新切换，这时需要进行一些处理
    listenPageSwitch() {
        // 绑定无刷新切换页面的事件，只绑定一次
        ;
        ['pushState', 'popstate', 'replaceState'].forEach((item) => {
            window.addEventListener(item, () => {
                _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.pageSwitch);
            });
        });
    }
}
new Support();


/***/ }),

/***/ "./src/ts/modules/ThemeColor.ts":
/*!**************************************!*\
  !*** ./src/ts/modules/ThemeColor.ts ***!
  \**************************************/
/*! exports provided: themeColor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "themeColor", function() { return themeColor; });
// 检查 pixiv 的颜色模式，并给下载器设置对应的样式。目前只有普通模式和夜间模式。
// 把需要响应主题变化的元素注册到这个组件里，元素会被添加当前主题的 className
// 默认主题是没有 className 的，其他主题通过对应的 className，在默认主题的基础上更改样式。
class ThemeColor {
    constructor() {
        this.selector = '#gtm-var-theme-kind'; // 通过这个选择器查找含有主题标记的元素
        this.timer = 0;
        this._theme = ''; // 保存当前获取到的主题标记
        // 主题标记以及对应的 className
        this.colorMap = new Map([['dark', 'theme-dark']]);
        this.elList = []; // 保存已注册的元素
        // 初始化时使用定时器查找标记元素
        this.timer = window.setTimeout(() => {
            this.findFlag();
        }, 300);
    }
    // 含有主题标记的元素，并监听其变化
    findFlag() {
        const el = document.querySelector(this.selector);
        if (el) {
            window.clearTimeout(this.timer);
            this.theme = el.textContent;
            // 监听标记元素的 textContent 变化
            const ob = new MutationObserver((mutationsList) => {
                for (const item of mutationsList) {
                    if (item.type === 'characterData') {
                        this.theme = item.target.nodeValue;
                        break;
                    }
                }
            });
            ob.observe(el, {
                characterData: true,
                subtree: true,
            });
        }
    }
    set theme(flag) {
        if (!flag) {
            return;
        }
        this._theme = flag;
        for (const el of this.elList) {
            this.setClass(el);
        }
    }
    get theme() {
        return this._theme;
    }
    // 把元素注册到本组件里
    register(el) {
        this.elList.push(el);
        this.setClass(el);
    }
    // 给元素设置主题对应的 className
    setClass(el) {
        // 先清除所有主题颜色的 className
        for (const className of this.colorMap.values()) {
            if (el.classList.contains(className)) {
                el.classList.remove(className);
            }
        }
        // 添加当前主题对应的 className
        const name = this.colorMap.get(this._theme);
        name && el.classList.add(name);
    }
}
const themeColor = new ThemeColor();



/***/ }),

/***/ "./src/ts/modules/Tip.ts":
/*!*******************************!*\
  !*** ./src/ts/modules/Tip.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 显示提示内容
class Tip {
    constructor() {
        this.tipEl = document.createElement('div'); // tip 元素
        this.addTipEl();
        this.bindEvent();
    }
    addTipEl() {
        this.tipEl = document.createElement('div');
        this.tipEl.id = 'tip';
        document.body.insertAdjacentElement('afterbegin', this.tipEl);
    }
    bindEvent() {
        const tips = document.querySelectorAll('.has_tip');
        for (const el of tips) {
            for (const ev of ['mouseenter', 'mouseleave']) {
                el.addEventListener(ev, (event) => {
                    const e = (event || window.event);
                    const text = el.dataset.tip;
                    this.showTip(text, {
                        type: ev === 'mouseenter' ? 1 : 0,
                        x: e.clientX,
                        y: e.clientY,
                    });
                });
            }
        }
    }
    // 显示中间面板上的提示。参数 mouse 指示鼠标是移入还是移出，并包含鼠标坐标
    showTip(text, mouse) {
        if (!text) {
            throw new Error('No tip text.');
        }
        if (mouse.type === 1) {
            this.tipEl.innerHTML = text;
            this.tipEl.style.left = mouse.x + 30 + 'px';
            this.tipEl.style.top = mouse.y - 30 + 'px';
            this.tipEl.style.display = 'block';
        }
        else if (mouse.type === 0) {
            this.tipEl.style.display = 'none';
        }
    }
}
new Tip();


/***/ }),

/***/ "./src/ts/modules/TitleBar.ts":
/*!************************************!*\
  !*** ./src/ts/modules/TitleBar.ts ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageType */ "./src/ts/modules/PageType.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/modules/EVT.ts");
// 在标题栏上显示任务状态的标记


/*
本程序的标记会以 [flag] 形式添加到 title 最前面
flag 及其含义如下：
↑ 抓取中
→ 等待下一步操作（搜索页）
▶ 可以开始下载
↓ 下载中
║ 下载暂停
■ 下载停止
✓ 下载完毕
*/
const flags = {
    crawling: '↑',
    waiting: '→',
    readyDownload: '▶',
    downloading: '↓',
    paused: '║',
    stopped: '■',
    completed: '✓',
    space: ' ',
};
class TitleBar {
    constructor() {
        this.timer = 0; // title 闪烁时，使用的定时器
        this.bindEvent();
    }
    bindEvent() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlStart, () => {
            this.set('crawling');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.worksUpdate, () => {
            this.set('waiting');
        });
        for (const ev of [_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resultChange, _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.resume]) {
            window.addEventListener(ev, () => {
                this.set('readyDownload');
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.downloadStart, () => {
            this.set('downloading');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.downloadComplete, () => {
            this.set('completed');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.downloadPause, () => {
            this.set('paused');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.downloadStop, () => {
            this.set('stopped');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].events.crawlEmpty, () => {
            this.reset();
        });
    }
    // 检查标题里是否含有标记
    includeFlag(flag = '') {
        if (!flag) {
            // 没有传递标记，则检查所有标记
            for (const flga of Object.values(flags)) {
                const str = `[${flga}]`;
                if (document.title.includes(str)) {
                    return true;
                }
            }
        }
        else {
            // 检查指定标记
            const str = `[${flag}]`;
            return document.title.includes(str);
        }
        return false;
    }
    // 重设 title
    reset() {
        const type = _PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].getPageType();
        clearInterval(this.timer);
        // 储存标题的 mete 元素。在某些页面不存在，有时也与实际上的标题不一致。
        const ogTitle = document.querySelector('meta[property="og:title"]');
        // 在一些自动加载的页面里，og:title 标签是最早更新标题的，内容也一致。
        if (ogTitle && (type == 1 || type === 2 || type === 13)) {
            document.title = ogTitle.content;
        }
        else {
            // 如果当前 title 里有标记，则设置为标记后面的文字
            if (this.includeFlag()) {
                const index = document.title.indexOf(']');
                document.title = document.title.substr(index + 1, document.title.length);
            }
        }
    }
    // 在标题上显示指定标记
    set(flagName) {
        const flag = flags[flagName];
        const text = `[${flag}]`;
        // 如果 title 里没有标记，就添加标记
        if (!this.includeFlag()) {
            document.title = `${text} ${document.title}`;
        }
        else {
            // 如果已经有标记了，则替换为新当前传入的标记
            document.title = document.title.replace(/\[.?\]/, text);
        }
        // 可以开始下载，或者等待下一步操作，进行闪烁提醒
        if (flagName === 'readyDownload' || flagName === 'waiting') {
            this.flashing(flag);
        }
        else {
            clearInterval(this.timer);
        }
    }
    // 闪烁提醒，其实是把给定的标记替换成空白，来回切换
    flashing(flag) {
        clearInterval(this.timer);
        const text = `[${flag}]`;
        const whiteSpace = `[${flags.space}]`;
        this.timer = window.setInterval(() => {
            if (this.includeFlag(flag)) {
                // 如果含有标记，就替换成空白
                document.title = document.title.replace(text, whiteSpace);
            }
            else {
                if (this.includeFlag(flags.space)) {
                    // 如果含有空白，就替换成标记
                    document.title = document.title.replace(whiteSpace, text);
                }
                else {
                    // 如果都没有，一般是页面切换了，标题被重置了，取消闪烁
                    clearInterval(this.timer);
                }
            }
        }, 500);
    }
}
new TitleBar();


/***/ }),

/***/ "./src/ts/modules/artwork/InitAreaRankingPage.ts":
/*!*******************************************************!*\
  !*** ./src/ts/modules/artwork/InitAreaRankingPage.ts ***!
  \*******************************************************/
/*! exports provided: InitAreaRankingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitAreaRankingPage", function() { return InitAreaRankingPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
// 初始化地区排行榜页面








class InitAreaRankingPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本页作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本页作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([1]);
    }
    async getIdList() {
        const allPicArea = document.querySelectorAll('.ranking-item>.work_wrapper');
        for (const el of allPicArea) {
            const img = el.querySelector('._thumbnail');
            // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型
            // 提取出 tag 列表
            const id = img.dataset.id;
            const tags = img.dataset.tags.split(' ');
            // 有的作品没有收藏按钮，点进去之后发现这个作品已经被删除了，只是排行榜里没有及时更新。这样的作品没有收藏按钮。
            const bookmarkBtn = el.querySelector('._one-click-bookmark');
            const bookmarked = bookmarkBtn
                ? bookmarkBtn.classList.contains('on')
                : false;
            const filterOpt = {
                id: id,
                tags: tags,
                bookmarkData: bookmarked,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                const id = _API__WEBPACK_IMPORTED_MODULE_6__["API"].getIllustId(el.querySelector('a').href);
                _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                    type: 'unknown',
                    id,
                });
            }
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() { }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitArtworkPage.ts":
/*!***************************************************!*\
  !*** ./src/ts/modules/artwork/InitArtworkPage.ts ***!
  \***************************************************/
/*! exports provided: InitArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitArtworkPage", function() { return InitArtworkPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _QuickBookmark__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../QuickBookmark */ "./src/ts/modules/QuickBookmark.ts");
/* harmony import */ var _ImgViewer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ImgViewer */ "./src/ts/modules/ImgViewer.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _QuickDownloadBtn__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../QuickDownloadBtn */ "./src/ts/modules/QuickDownloadBtn.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../States */ "./src/ts/modules/States.ts");
/* harmony import */ var _SaveAvatarIcon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../SaveAvatarIcon */ "./src/ts/modules/SaveAvatarIcon.ts");
//初始化 artwork 作品页














class InitArtworkPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.crawlDirection = 0; // 抓取方向，指示抓取新作品还是旧作品
        /*
        -1 抓取新作品
        0 不设置抓取方向
        1 抓取旧作品
        */
        this.crawlRelated = false; // 是否下载相关作品
        this.startQuickDownload = () => {
            this.readyCrawl();
        };
        this.init();
    }
    initElse() {
        // 初始化快速收藏功能和图片查看器
        this.initQuickBookmark();
        this.initImgViewer();
        // 页面切换再次初始化
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.pageSwitchedTypeNotChange, this.initQuickBookmark);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.pageSwitchedTypeNotChange, this.initImgViewer);
        // 初始化快速下载按钮
        new _QuickDownloadBtn__WEBPACK_IMPORTED_MODULE_11__["QuickDownloadBtn"]();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.QuickDownload, this.startQuickDownload);
    }
    initImgViewer() {
        new _ImgViewer__WEBPACK_IMPORTED_MODULE_7__["ImgViewer"]();
    }
    initQuickBookmark() {
        new _QuickBookmark__WEBPACK_IMPORTED_MODULE_6__["QuickBookmark"]();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取new')).addEventListener('click', () => {
            this.crawlDirection = -1;
            this.readyCrawl();
        });
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取old')).addEventListener('click', () => {
            this.crawlDirection = 1;
            this.readyCrawl();
        });
        const downRelatedBtn = _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取相关作品'));
        downRelatedBtn.addEventListener('click', () => {
            this.crawlRelated = true;
            this.readyCrawl();
        }, false);
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('otherBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_保存用户头像为图标'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_保存用户头像为图标说明')],
        ]).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.saveAvatarIcon);
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示') +
                '<br>' +
                _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_相关作品大于0'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_数字提示1'),
            value: '-1',
        });
    }
    destroy() {
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].clearSlot('crawlBtns');
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].clearSlot('otherBtns');
        // 解除切换页面时绑定的事件
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.pageSwitchedTypeNotChange, this.initQuickBookmark);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.pageSwitchedTypeNotChange, this.initImgViewer);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.QuickDownload, this.startQuickDownload);
    }
    getWantPage() {
        if (_States__WEBPACK_IMPORTED_MODULE_12__["states"].quickDownload) {
            // 快速下载
            this.crawlNumber = 1;
        }
        else {
            // 检查下载页数的设置
            if (!this.crawlRelated) {
                const crawlAllTip = this.crawlDirection === -1
                    ? _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取new')
                    : _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取old');
                this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载x个作品'), crawlAllTip);
            }
            else {
                // 相关作品的提示
                this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载x个相关作品'), _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载所有相关作品'));
            }
        }
    }
    nextStep() {
        // 下载相关作品
        if (this.crawlRelated) {
            this.getRelatedList();
        }
        else if (_States__WEBPACK_IMPORTED_MODULE_12__["states"].quickDownload) {
            // 快速下载
            _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
                type: 'unknown',
                id: _API__WEBPACK_IMPORTED_MODULE_9__["API"].getIllustId(window.location.href),
            });
            _Log__WEBPACK_IMPORTED_MODULE_10__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始获取作品页面'));
            this.getIdListFinished();
        }
        else {
            // 向前向后下载
            this.getIdList();
        }
    }
    async getIdList() {
        let type = ['illusts', 'manga'];
        let idList = await _API__WEBPACK_IMPORTED_MODULE_9__["API"].getUserWorksByType(_DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].getUserId(), type);
        // 储存符合条件的 id
        let nowId = parseInt(_API__WEBPACK_IMPORTED_MODULE_9__["API"].getIllustId(window.location.href));
        idList.forEach((id) => {
            let idNum = parseInt(id.id);
            // 新作品
            if (idNum >= nowId && this.crawlDirection === -1) {
                _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push(id);
            }
            else if (idNum <= nowId && this.crawlDirection === 1) {
                // 旧作品
                _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push(id);
            }
        });
        // 当设置了下载个数时，进行裁剪
        if (this.crawlNumber !== -1) {
            // 新作品 升序排列
            if (this.crawlDirection === -1) {
                _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.sort(_API__WEBPACK_IMPORTED_MODULE_9__["API"].sortByProperty('id')).reverse();
            }
            else {
                // 旧作品 降序排列
                _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.sort(_API__WEBPACK_IMPORTED_MODULE_9__["API"].sortByProperty('id'));
            }
            _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.splice(0, this.crawlNumber);
        }
        this.getIdListFinished();
    }
    // 下载相关作品时使用
    async getRelatedList() {
        let data = await _API__WEBPACK_IMPORTED_MODULE_9__["API"].getRelatedData(_API__WEBPACK_IMPORTED_MODULE_9__["API"].getIllustId());
        const recommendData = data.body.recommendMethods;
        // 取出相关作品的 id 列表
        let recommendIdList = Object.keys(recommendData);
        // 当设置了下载个数时，进行裁剪
        if (this.crawlNumber !== -1) {
            recommendIdList = recommendIdList.reverse().slice(0, this.crawlNumber);
        }
        for (const id of recommendIdList) {
            _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
                type: 'unknown',
                id,
            });
        }
        _Log__WEBPACK_IMPORTED_MODULE_10__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_相关作品抓取完毕', _Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.length.toString()));
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.crawlDirection = 0; // 解除下载方向的标记
        this.crawlRelated = false; // 解除下载相关作品的标记
    }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitBookmarkDetailPage.ts":
/*!**********************************************************!*\
  !*** ./src/ts/modules/artwork/InitBookmarkDetailPage.ts ***!
  \**********************************************************/
/*! exports provided: InitBookmarkDetailPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkDetailPage", function() { return InitBookmarkDetailPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
// 初始化 bookmark_detail 页面







class InitBookmarkDetailPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取相似图片'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取相似图片')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        }, false);
    }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    getWantPage() {
        const check = this.checkWantPageInputGreater0();
        if (check == undefined) {
            return;
        }
        this.crawlNumber = check;
        if (this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
    }
    // 获取相似的作品列表
    async getIdList() {
        let data = await _API__WEBPACK_IMPORTED_MODULE_5__["API"].getRecommenderData(_API__WEBPACK_IMPORTED_MODULE_5__["API"].getIllustId(), this.crawlNumber);
        for (const id of data.recommendations) {
            _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                type: 'unknown',
                id: id.toString(),
            });
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() { }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitBookmarkNewArtworkPage.ts":
/*!**************************************************************!*\
  !*** ./src/ts/modules/artwork/InitBookmarkNewArtworkPage.ts ***!
  \**************************************************************/
/*! exports provided: InitBookmarkNewArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkNewArtworkPage", function() { return InitBookmarkNewArtworkPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
// 初始化 关注的新作品 artwork 页面









class InitBookmarkNewArtworkPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.r18 = false;
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    appendElseEl() { }
    setFormOption() {
        // 设置“个数/页数”选项
        this.maxCount = 100;
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    getWantPage() {
        const check = this.checkWantPageInputGreater0();
        if (check == undefined) {
            return;
        }
        this.crawlNumber = check;
        if (this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_任务开始1', this.crawlNumber.toString()));
    }
    nextStep() {
        this.r18 = location.pathname.includes('r18');
        const p = _API__WEBPACK_IMPORTED_MODULE_6__["API"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        this.getIdList();
    }
    async getIdList() {
        let p = this.startpageNo + this.listPageFinished;
        // 发起请求，获取列表页
        let worksData;
        try {
            worksData = await _API__WEBPACK_IMPORTED_MODULE_6__["API"].getBookmarkNewIllustData(p, this.r18);
        }
        catch (error) {
            this.getIdList();
            return;
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
                tags: data.tags,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                    type: _API__WEBPACK_IMPORTED_MODULE_6__["API"].getWorkType(data.illustType),
                    id: data.illustId,
                });
            }
        }
        this.listPageFinished++;
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        // 判断任务状态
        // 如果抓取了所有页面，或者抓取完指定页面
        if (p >= this.maxCount || this.listPageFinished === this.crawlNumber) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取完成'));
            this.getIdListFinished();
        }
        else {
            // 继续抓取
            this.getIdList();
        }
    }
    resetGetIdListStatus() {
        this.listPageFinished = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitDiscoverPage.ts":
/*!****************************************************!*\
  !*** ./src/ts/modules/artwork/InitDiscoverPage.ts ***!
  \****************************************************/
/*! exports provided: InitDiscoverPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitDiscoverPage", function() { return InitDiscoverPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _DeleteWorks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../DeleteWorks */ "./src/ts/modules/DeleteWorks.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
// 初始化发现页面








class InitDiscoverPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取当前作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取当前作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([1]);
    }
    appendElseEl() {
        const deleteWorks = new _DeleteWorks__WEBPACK_IMPORTED_MODULE_5__["DeleteWorks"]('._2RNjBox');
        deleteWorks.addClearMultipleBtn('._3b8AXEx');
        deleteWorks.addClearUgoiraBtn('.AGgsUWZ');
        deleteWorks.addManuallyDeleteBtn();
    }
    getWantPage() { }
    getIdList() {
        // 在发现页面，仅下载已有部分，所以不需要去获取列表页
        const nowIllust = document.querySelectorAll('figure>div>a');
        // 获取已有作品的 id
        Array.from(nowIllust).forEach((el) => {
            // discovery 列表的 url 是有额外后缀的，需要去掉
            const id = _API__WEBPACK_IMPORTED_MODULE_6__["API"].getIllustId(el.href.split('&uarea')[0]);
            _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                type: 'unknown',
                id,
            });
        });
        this.getIdListFinished();
    }
    resetGetIdListStatus() { }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitNewArtworkPage.ts":
/*!******************************************************!*\
  !*** ./src/ts/modules/artwork/InitNewArtworkPage.ts ***!
  \******************************************************/
/*! exports provided: InitNewArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNewArtworkPage", function() { return InitNewArtworkPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
// 初始化 大家的新作品 artwork 页面









class InitNewArtworkPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.option = this.resetOption();
        this.limitMax = 20; // 每次请求的数量最大是 20
        this.fetchCount = 0; // 已请求的作品数量
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载大家的新作品')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    appendElseEl() { }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
            value: '100',
        });
    }
    getWantPage() {
        const check = this.checkWantPageInputGreater0();
        if (check == undefined) {
            return;
        }
        this.crawlNumber = check;
        if (this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取多少个作品', this.crawlNumber.toString()));
    }
    nextStep() {
        this.initFetchURL();
        this.getIdList();
    }
    resetOption() {
        return {
            lastId: '0',
            limit: '20',
            type: '',
            r18: '',
        };
    }
    // 组织要请求的 url
    initFetchURL() {
        this.option = this.resetOption();
        if (this.crawlNumber < this.limitMax) {
            this.option.limit = this.crawlNumber.toString();
        }
        else {
            this.option.limit = this.limitMax.toString();
        }
        // 当前页面的作品类型，默认是 illust
        this.option.type = _API__WEBPACK_IMPORTED_MODULE_5__["API"].getURLSearchField(location.href, 'type') || 'illust';
        // 是否是 R18 模式
        this.option.r18 = (location.href.includes('_r18.php') || false).toString();
    }
    async getIdList() {
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_5__["API"].getNewIllustData(this.option);
        }
        catch (error) {
            this.getIdList();
            return;
        }
        let useData = data.body.illusts;
        for (const nowData of useData) {
            // 抓取够了指定的数量
            if (this.fetchCount + 1 > this.crawlNumber) {
                break;
            }
            else {
                this.fetchCount++;
            }
            // 排除广告信息
            if (nowData.isAdContainer) {
                continue;
            }
            const filterOpt = {
                id: nowData.illustId,
                width: nowData.width,
                height: nowData.height,
                pageCount: nowData.pageCount,
                bookmarkData: nowData.bookmarkData,
                illustType: nowData.illustType,
                tags: nowData.tags,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_4__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                    type: _API__WEBPACK_IMPORTED_MODULE_5__["API"].getWorkType(nowData.illustType),
                    id: nowData.illustId,
                });
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_新作品进度', this.fetchCount.toString()), 1, false);
        // 抓取完毕
        if (this.fetchCount >= this.crawlNumber ||
            this.fetchCount >= this.maxCount) {
            _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始获取作品页面'));
            this.getIdListFinished();
            return;
        }
        // 继续抓取
        this.option.lastId = data.body.lastId;
        this.getIdList();
    }
    resetGetIdListStatus() {
        this.fetchCount = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitRankingArtworkPage.ts":
/*!**********************************************************!*\
  !*** ./src/ts/modules/artwork/InitRankingArtworkPage.ts ***!
  \**********************************************************/
/*! exports provided: InitRankingArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitRankingArtworkPage", function() { return InitRankingArtworkPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../States */ "./src/ts/modules/States.ts");
// 初始化 artwork 排行榜页面











class InitRankingArtworkPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.pageCount = 10; // 排行榜的页数
        this.option = this.resetOption();
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取本排行榜作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取本排行榜作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
        // 判断当前页面是否有“首次登场”标记
        const debutModes = ['daily', 'daily_r18', 'rookie', ''];
        const mode = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLSearchField(location.href, 'mode');
        if (debutModes.includes(mode)) {
            _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取首次登场的作品'), [
                ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取首次登场的作品Title')],
            ]).addEventListener('click', () => {
                _States__WEBPACK_IMPORTED_MODULE_10__["states"].debut = true;
                this.readyCrawl();
            });
        }
    }
    initElse() {
        // 抓取完成后，复位 debut 标记
        // 因为 debut 只在抓取阶段被过滤器使用，所以抓取完成后就可以复位
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].events.crawlFinish, () => {
            _States__WEBPACK_IMPORTED_MODULE_10__["states"].debut = false;
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        this.maxCount = 500;
        _Options__WEBPACK_IMPORTED_MODULE_6__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    resetOption() {
        return { mode: 'daily', p: 1, worksType: '', date: '' };
    }
    setPartNum() {
        // 设置页数。排行榜页面一页有50张作品，当页面到达底部时会加载下一页
        if (location.pathname.includes('r18g')) {
            // r18g 只有1个榜单，固定1页
            this.pageCount = 1;
        }
        else if (location.pathname.includes('_r18')) {
            // r18 模式，这里的6是最大值，有的排行榜并没有6页
            this.pageCount = 6;
        }
        else {
            // 普通模式，这里的10也是最大值。如果实际没有10页，则在检测到404页面的时候停止抓取下一页
            this.pageCount = 10;
        }
    }
    getWantPage() {
        this.listPageFinished = 0;
        // 检查下载页数的设置
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载排行榜前x个作品'), _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_向下获取所有作品'));
        // 如果设置的作品个数是 -1，则设置为下载所有作品
        if (this.crawlNumber === -1) {
            this.crawlNumber = 500;
        }
    }
    nextStep() {
        // 设置 option 信息
        // mode 一定要有值，其他字段不需要一定有值
        this.option = this.resetOption();
        this.option.mode = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLSearchField(location.href, 'mode') || 'daily';
        this.option.worksType = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLSearchField(location.href, 'content');
        this.option.date = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLSearchField(location.href, 'date');
        this.startpageNo = 1;
        this.setPartNum();
        this.getIdList();
    }
    async getIdList() {
        this.option.p = this.startpageNo + this.listPageFinished;
        // 发起请求，获取作品列表
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_2__["API"].getRankingData(this.option);
        }
        catch (error) {
            if (error.status === 404) {
                // 如果发生了404错误，则中断抓取，直接下载已有部分。因为可能确实没有下一部分了
                console.log('404错误，直接下载已有部分');
                this.getIdListFinished();
            }
            return;
        }
        this.listPageFinished++;
        const contents = data.contents; // 取出作品信息列表
        for (const data of contents) {
            // 检查是否已经抓取到了指定数量的作品
            if (data.rank > this.crawlNumber) {
                return this.getIdListFinished();
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
                yes_rank: data.yes_rank,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_7__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_8__["store"].setRankList(data.illust_id.toString(), data.rank.toString());
                _Store__WEBPACK_IMPORTED_MODULE_8__["store"].idList.push({
                    type: _API__WEBPACK_IMPORTED_MODULE_2__["API"].getWorkType(data.illust_type),
                    id: data.illust_id.toString(),
                });
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_9__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_排行榜进度', this.listPageFinished.toString()), 1, false);
        // 抓取完毕
        if (this.listPageFinished === this.pageCount) {
            this.getIdListFinished();
        }
        else {
            // 继续抓取
            this.getIdList();
        }
    }
    resetGetIdListStatus() {
        this.listPageFinished = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitSearchArtworkPage.ts":
/*!*********************************************************!*\
  !*** ./src/ts/modules/artwork/InitSearchArtworkPage.ts ***!
  \*********************************************************/
/*! exports provided: InitSearchArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitSearchArtworkPage", function() { return InitSearchArtworkPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../PageInfo */ "./src/ts/modules/PageInfo.ts");
/* harmony import */ var _DeleteWorks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../DeleteWorks */ "./src/ts/modules/DeleteWorks.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _FastScreen__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../FastScreen */ "./src/ts/modules/FastScreen.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../BookmarkAllWorks */ "./src/ts/modules/BookmarkAllWorks.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../States */ "./src/ts/modules/States.ts");
// 初始化 artwork 搜索页
















class InitSearchArtworkPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.worksWrapSelector = '#root section ul';
        this.listClass = 'searchList';
        this.multipleClass = 'multiplePart';
        this.ugoiraClass = 'ugoiraPart';
        this.addBMKBtnClass = 'bmkBtn';
        this.bookmarkedClass = 'bookmarked';
        this.countSelector = 'section h3+div span';
        this.hotWorkAsideSelector = 'section aside';
        this.worksType = '';
        this.option = {};
        this.worksNoPerPage = 60; // 每个页面有多少个作品
        this.needCrawlPageCount = 0; // 一共有有多少个列表页面
        this.sendCrawlTaskCount = 0; // 已经抓取了多少个列表页面
        this.allOption = [
            'order',
            'type',
            'wlt',
            'wgt',
            'hlt',
            'hgt',
            'ratio',
            'tool',
            's_mode',
            'mode',
            'scd',
            'ecd',
            'blt',
            'bgt',
        ];
        this.resultMeta = []; // 每次“开始筛选”完成后，储存当时所有结果，以备“在结果中筛选”使用
        this.worksWrap = null;
        this.deleteId = 0; // 手动删除时，要删除的作品的 id
        this.previewResult = true; // 是否预览结果
        this.causeResultChange = ['firstFewImagesSwitch', 'firstFewImages']; // 这些选项变更时，可能会导致结果改变。但是过滤器 filter 不会检查，所以需要单独检测它的变更，手动处理
        // 显示抓取到的作品数量
        this.showCount = () => {
            const count = this.resultMeta.length || _Store__WEBPACK_IMPORTED_MODULE_9__["store"].resultMeta.length;
            if (count > 0) {
                const countEl = document.querySelector(this.countSelector);
                if (countEl) {
                    countEl.textContent = count.toString();
                }
            }
        };
        // 在页面上生成抓取结果对应的作品元素
        this.createWork = (event) => {
            if (!this.previewResult || !this.worksWrap) {
                return;
            }
            const data = event.detail.data;
            let r18Text = '';
            if (data.tags.includes('R-18')) {
                r18Text = 'R-18';
            }
            if (data.tags.includes('R-18G')) {
                r18Text = 'R-18G';
            }
            let r18HTML = r18Text
                ? `
      <div class="r18Part">
        <div class="child">
          <div class="text">${r18Text}</div>
        </div>
      </div>`
                : '';
            let multipleHTML = '';
            if (data.pageCount > 1) {
                multipleHTML = `
        <div class="${this.multipleClass}">
          <div class="child">
            <span class="span1">
              <span class="span2">
              <svg viewBox="0 0 9 10" size="9" class="multipleSvg">
                <path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10
                C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1
                C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8
                0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z" transform=""></path>
                </svg>
              </span>
            </span>
            <span>${data.pageCount}</span>
          </div>  
        </div>
                    `;
            }
            let ugoiraHTML = '';
            if (data.ugoiraInfo) {
                ugoiraHTML = `
        <svg viewBox="0 0 24 24" class="${this.ugoiraClass}" style="width: 48px; height: 48px;">
        <circle cx="12" cy="12" r="10" class="ugoiraCircle"></circle>
          <path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834
              C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342
              C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799
              C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243
              C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652
              C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z"></path>
        </svg>`;
            }
            // 添加收藏的作品，让收藏图标变红
            const bookmarkedFlag = data.bookmarked ? this.bookmarkedClass : '';
            const html = `
    <li class="${this.listClass}" data-id="${data.idNum}">
    <div class="searchContent">
      <div class="searchImgArea">
        <div width="184" height="184" class="searchImgAreaContent">
          <a target="_blank" class="imgAreaLink" href="/artworks/${data.idNum}">
            <!--顶部横幅-->
            <div class="topbar">

            <!--R-18 标记-->
            ${r18HTML}

            <!--多图作品标记-->
            ${multipleHTML}
              
            </div>
            <!--图片部分-->
            <div class="imgWrap">
            <img src="${data.thumb}" alt="${data.title}" style="object-fit: cover; object-position: center center;">
              <!-- 动图 svg -->
              ${ugoiraHTML}
              </div>
          </a>
          <!--添加显示收藏数-->
          <div class="bmkCount">${data.bmk}</div>
          <!--收藏按钮-->
          <div class="bmkBtnWrap">
            <div class="">
            <button type="button" class="${this.addBMKBtnClass}">
            <svg viewBox="0 0 1024 1024" width="32" height="32" class="bmkBtnSvg ${bookmarkedFlag}">
            <path d="M958.733019 411.348626 659.258367 353.59527 511.998465 85.535095 364.741633 353.59527 65.265958 411.348626 273.72878 634.744555 235.88794 938.463881 511.998465 808.479435 788.091594 938.463881 750.250754 634.744555Z" p-id="1106" class="path2"></path>
            <path d="M959.008 406.016l-308-47.008L512 64 372.992 359.008l-308 47.008 223.008 228-52.992 324L512 805.024l276.992 152.992-52.992-324zM512 740L304 856.992l40-235.008-179.008-182.016 242.016-32 104.992-224 104 224 240.992 34.016L680 622.976l36.992 235.008z" p-id="919"></path>
            </svg>
            </button>
            </div>
          </div>
        <!--收藏按钮结束-->
        </div>
      </div>
      <!--标题名-->
      <a target="_blank" class="titleLink" href="/artworks/${data.idNum}">${data.title}</a>
      <!--底部-->
      <div class="bottomBar">
      <!--作者信息-->
      <div class="userInfo">
      <!--相比原代码，这里去掉了作者头像的 html 代码。因为抓取到的数据里没有作者头像。-->
          <a target="_blank" href="/member.php?id=${data.userId}">
            <div class="userName">${data.user}</div>
          </a>
        </div>
      </div>
    </div>
  </li>
    `;
            // 添加作品
            const li2 = document.createElement('li');
            li2.innerHTML = html;
            const li = li2.children[0];
            this.worksWrap.appendChild(li);
            // 绑定收藏按钮的事件
            const addBMKBtn = li.querySelector(`.${this.addBMKBtnClass}`);
            const bookmarkedClass = this.bookmarkedClass;
            addBMKBtn.addEventListener('click', function () {
                const e = new CustomEvent('addBMK', {
                    detail: { data: { id: data.idNum, tags: data.tags } },
                });
                window.dispatchEvent(e);
                this.classList.add(bookmarkedClass);
            });
        };
        this.addBookmark = (event) => {
            const data = event.detail.data;
            // 如果设置了不启用快速收藏，则把 tag 设置为空
            if (_Settings__WEBPACK_IMPORTED_MODULE_11__["form"].quickBookmarks.checked === false) {
                data.tags = [];
            }
            _API__WEBPACK_IMPORTED_MODULE_8__["API"].addBookmark('illusts', data.id.toString(), data.tags, false, _API__WEBPACK_IMPORTED_MODULE_8__["API"].getToken());
            this.resultMeta.forEach((result) => {
                if (result.idNum === data.id) {
                    result.bookmarked = true;
                }
            });
        };
        // 抓取完成后，保存结果的元数据，并重排结果
        this.onCrawlFinish = () => {
            this.resultMeta = [..._Store__WEBPACK_IMPORTED_MODULE_9__["store"].resultMeta];
            // 显示作品数量
            const count = this.resultMeta.length || _Store__WEBPACK_IMPORTED_MODULE_9__["store"].resultMeta.length;
            if (count > 0) {
                _Log__WEBPACK_IMPORTED_MODULE_10__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前作品个数', count.toString()));
            }
            // 显示文件数量
            _Log__WEBPACK_IMPORTED_MODULE_10__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_共抓取到n个文件', _Store__WEBPACK_IMPORTED_MODULE_9__["store"].result.length.toString()));
            this.clearWorks();
            this.reAddResult();
            // 解绑创建作品元素的事件
            window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.addResult, this.createWork);
            setTimeout(() => {
                _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.worksUpdate);
            }, 0);
        };
        // 清除多图作品
        this.clearMultiple = () => {
            this.filterResult((data) => {
                return data.pageCount <= 1;
            });
        };
        // 清除动图作品
        this.clearUgoira = () => {
            this.filterResult((data) => {
                return !data.ugoiraInfo;
            });
        };
        // 手动删除作品
        this.deleteWork = (event) => {
            const el = event.detail.data;
            this.deleteId = parseInt(el.dataset.id);
            this.filterResult((data) => {
                return data.idNum !== this.deleteId;
            });
        };
        this.onSettingChange = (event) => {
            const data = event.detail.data;
            if (data.name === 'previewResult') {
                this.setPreviewResult(data.value);
            }
            if (this.causeResultChange.includes(data.name)) {
                this.reAddResult();
                _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.resultChange);
            }
        };
        this.init();
        new _FastScreen__WEBPACK_IMPORTED_MODULE_12__["FastScreen"]();
    }
    initElse() {
        this.hotBar();
        this.setPreviewResult(_Settings__WEBPACK_IMPORTED_MODULE_11__["form"].previewResult.checked);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.addResult, this.showCount);
        window.addEventListener('addBMK', this.addBookmark);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.crawlFinish, this.onCrawlFinish);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.clearMultiple, this.clearMultiple);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.clearUgoira, this.clearUgoira);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.deleteWork, this.deleteWork);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.settingChange, this.onSettingChange);
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_13__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始筛选'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始筛选Title')],
        ]).addEventListener('click', () => {
            this.resultMeta = [];
            window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.addResult, this.createWork);
            this.readyCrawl();
        });
        _DOM__WEBPACK_IMPORTED_MODULE_13__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].red, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_在结果中筛选'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_在结果中筛选Title')],
        ]).addEventListener('click', () => {
            this.screenInResult();
        });
        // 添加收藏本页所有作品的功能
        const bookmarkAll = new _BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_14__["BookmarkAllWorks"]();
        bookmarkAll.btn.addEventListener('click', () => {
            const listWrap = this.getWorksWrap();
            if (listWrap) {
                const list = listWrap.querySelectorAll('li');
                // 被二次筛选过滤掉的作品会被隐藏，所以批量添加收藏时，过滤掉隐藏的作品
                const showList = Array.from(list).filter((el) => {
                    return el.style.display !== 'none';
                });
                bookmarkAll.setWorkList(showList);
            }
        });
    }
    appendElseEl() {
        const deleteWorks = new _DeleteWorks__WEBPACK_IMPORTED_MODULE_5__["DeleteWorks"](`.${this.listClass}`);
        deleteWorks.addClearMultipleBtn(`.${this.multipleClass}`, () => {
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.clearMultiple);
        });
        deleteWorks.addClearUgoiraBtn(`.${this.ugoiraClass}`, () => {
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.clearUgoira);
        });
        deleteWorks.addManuallyDeleteBtn((el) => {
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.deleteWork, el);
        });
    }
    setFormOption() {
        this.maxCount = 1000;
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    destroy() {
        _DOM__WEBPACK_IMPORTED_MODULE_13__["DOM"].clearSlot('crawlBtns');
        _DOM__WEBPACK_IMPORTED_MODULE_13__["DOM"].clearSlot('otherBtns');
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.addResult, this.showCount);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.crawlFinish, this.onCrawlFinish);
        // 离开下载页面时，取消设置“不自动下载”
        _States__WEBPACK_IMPORTED_MODULE_15__["states"].notAutoDownload = false;
    }
    async nextStep() {
        this.initFetchURL();
        this.needCrawlPageCount = await this.calcNeedCrawlPageCount();
        if (this.needCrawlPageCount === 0) {
            return this.noResult();
        }
        this.startGetIdList();
        this.clearWorks();
    }
    // 去除热门作品上面的遮挡
    hotBar() {
        // 因为热门作品里的元素是延迟加载的，所以使用定时器检查
        const timer = window.setInterval(() => {
            const hotWorkAside = document.querySelector(this.hotWorkAsideSelector);
            if (hotWorkAside) {
                window.clearInterval(timer);
                // 去掉遮挡作品的购买链接
                const premiumLink = hotWorkAside.nextSibling;
                premiumLink && premiumLink.remove();
                // 去掉遮挡后两个作品的 after。因为是伪元素，所以要通过 css 控制
                const style = `
        section aside ul::after{
          display:none !important;
        }
        `;
                _DOM__WEBPACK_IMPORTED_MODULE_13__["DOM"].addStyle(style);
            }
        }, 300);
    }
    // 返回包含作品列表的 ul 元素
    getWorksWrap() {
        const test = document.querySelectorAll(this.worksWrapSelector);
        if (test.length > 0) {
            if (test.length > 2) {
                // 大于 2 的情况是在搜索页的首页，或者小说页面
                return test[2];
            }
            // 在插画、漫画、artworks 页面只有两个 ul 或者一个
            return test[test.length - 1];
        }
        return null;
    }
    // 清空作品列表，只在作品抓取完毕时使用。之后会生成根据收藏数排列的作品列表。
    // 在其他情况下，删除作品不会清空作品列表，也不会再次生成作品列表，而是把这个作品的元素移除。这是为了减少 dom 操作耗时以及重绘页面引起的耗时，耗时太长会导致用户体验出现严重的问题。
    clearWorks() {
        this.worksWrap = this.getWorksWrap();
        if (!this.previewResult || !this.worksWrap) {
            return;
        }
        this.worksWrap.innerHTML = '';
    }
    // 筛选抓取结果。传入函数，过滤符合条件的结果
    // 在抓取完成之后，所有会从结果合集中删除某些结果的操作都要经过这里
    async filterResult(callback) {
        if (this.resultMeta.length === 0) {
            return alert(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
        }
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.closeCenterPanel);
        _Log__WEBPACK_IMPORTED_MODULE_10__["log"].clear();
        const beforeLength = this.resultMeta.length; // 储存过滤前的结果数量
        const resultMetaTemp = [];
        const resultMetaRemoved = [];
        for (const meta of this.resultMeta) {
            if (await callback(meta)) {
                resultMetaTemp.push(meta);
            }
            else {
                resultMetaRemoved.push(meta);
            }
        }
        this.resultMeta = resultMetaTemp;
        // 如果过滤后，作品元数据发生了改变则重排作品
        if (this.resultMeta.length !== beforeLength) {
            let ids = [];
            for (const result of resultMetaRemoved) {
                ids.push(result.idNum.toString());
            }
            this.removeWorks(ids);
            this.reAddResult();
        }
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].events.resultChange);
    }
    // 传递作品 id 列表，从页面上的作品列表里移除这些作品
    removeWorks(idList) {
        // #root section ul .searchList
        const listSelector = `${this.worksWrapSelector} .${this.listClass}`;
        const lists = document.querySelectorAll(listSelector);
        for (const li of lists) {
            if (li.dataset.id && idList.includes(li.dataset.id)) {
                li.style.display = 'none';
                // li.remove()
                // 推测隐藏元素可以更快的重绘好页面，因为删除元素修改了 dom 结构，花的时间可能会多一些
            }
        }
    }
    // 重新添加抓取结果，执行时机：
    // 1 作品抓取完毕之后，添加抓取到的数据
    // 2 使用“在结果中筛选”或删除作品，使得作品数据变化了，改变作品列表视图
    // 3 修改了“多图下载设置”，导致作品数据变化
    reAddResult() {
        _Store__WEBPACK_IMPORTED_MODULE_9__["store"].reset();
        for (let data of this.resultMeta) {
            const dlCount = _Settings__WEBPACK_IMPORTED_MODULE_11__["setting"].getDLCount(data.pageCount);
            // 如果此时的 dlCount 与之前的 dlCount 不一样，则更新它
            if (dlCount !== data.dlCount) {
                data = Object.assign(data, { dlCount: dlCount });
            }
            _Store__WEBPACK_IMPORTED_MODULE_9__["store"].addResult(data);
        }
    }
    // 在当前结果中再次筛选，会修改第一次筛选的结果
    screenInResult() {
        if (_States__WEBPACK_IMPORTED_MODULE_15__["states"].busy) {
            return alert(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前任务尚未完成'));
        }
        _Log__WEBPACK_IMPORTED_MODULE_10__["log"].clear();
        _Filter__WEBPACK_IMPORTED_MODULE_7__["filter"].init();
        this.getMultipleSetting();
        this.filterResult((data) => {
            const filterOpt = {
                id: data.id,
                illustType: data.type,
                pageCount: data.pageCount,
                tags: data.tags,
                bookmarkCount: data.bmk,
                bookmarkData: data.bookmarked,
                width: data.fullWidth,
                height: data.fullHeight,
                createDate: data.date,
            };
            return _Filter__WEBPACK_IMPORTED_MODULE_7__["filter"].check(filterOpt);
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
        if (this.crawlNumber === -1 || this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
    }
    // 获取搜索页的数据。因为有多处使用，所以进行了封装
    async getSearchData(p) {
        let data = await _API__WEBPACK_IMPORTED_MODULE_8__["API"].getSearchData(_PageInfo__WEBPACK_IMPORTED_MODULE_4__["pageInfo"].tag, this.worksType, p, this.option);
        return data.body.illust || data.body.illustManga || data.body.manga;
    }
    // 组织要请求的 url 中的参数
    initFetchURL() {
        // 从 URL 中获取分类。可能有语言标识。
        /*
        https://www.pixiv.net/tags/Fate%2FGrandOrder/illustrations
        https://www.pixiv.net/en/tags/Fate%2FGrandOrder/illustrations
        */
        let URLType = location.pathname.split('tags/')[1].split('/')[1];
        // 但在“顶部”页面的时候是没有分类的，会是 undefined
        if (URLType === undefined) {
            URLType = '';
        }
        switch (URLType) {
            case '':
                this.worksType = 'artworks';
                break;
            case 'illustrations':
            case 'illust_and_ugoira':
            case 'ugoira':
            case 'illust':
                this.worksType = 'illustrations';
                break;
            case 'manga':
                this.worksType = 'manga';
                break;
            default:
                this.worksType = 'artworks';
                break;
        }
        let p = _API__WEBPACK_IMPORTED_MODULE_8__["API"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        // 从页面 url 中获取可以使用的选项
        this.option = {};
        this.allOption.forEach((param) => {
            let value = _API__WEBPACK_IMPORTED_MODULE_8__["API"].getURLSearchField(location.href, param);
            if (value !== '') {
                this.option[param] = value;
            }
        });
        // 如果没有指定搜索模式，则是精确匹配标签，设置对应的值
        if (this.option.s_mode === undefined) {
            this.option.s_mode = 's_tag_full';
        }
    }
    // 计算应该抓取多少页
    async calcNeedCrawlPageCount() {
        let data = await this.getSearchData(1);
        // 计算总页数
        let pageCount = Math.ceil(data.total / this.worksNoPerPage);
        if (pageCount > this.maxCount) {
            // 最大为 1000
            pageCount = this.maxCount;
        }
        // 计算从本页开始抓取的话，有多少页
        let needFetchPage = pageCount - this.startpageNo + 1;
        // 比较用户设置的页数，取较小的那个数值
        if (needFetchPage < this.crawlNumber) {
            return needFetchPage;
        }
        else {
            return this.crawlNumber;
        }
    }
    // 计算页数之后，准备建立并发抓取线程
    startGetIdList() {
        if (this.needCrawlPageCount <= this.ajaxThreadsDefault) {
            this.ajaxThreads = this.needCrawlPageCount;
        }
        else {
            this.ajaxThreads = this.ajaxThreadsDefault;
        }
        for (let i = 0; i < this.ajaxThreads; i++) {
            this.getIdList();
        }
    }
    async getIdList() {
        let p = this.startpageNo + this.sendCrawlTaskCount;
        this.sendCrawlTaskCount++;
        // 发起请求，获取列表页
        let data;
        try {
            data = await this.getSearchData(p);
        }
        catch (_a) {
            this.getIdList();
            return;
        }
        data = data.data;
        for (const nowData of data) {
            // 排除广告信息
            if (nowData.isAdContainer) {
                continue;
            }
            const filterOpt = {
                id: nowData.illustId,
                width: nowData.width,
                height: nowData.height,
                pageCount: nowData.pageCount,
                bookmarkData: nowData.bookmarkData,
                illustType: nowData.illustType,
                tags: nowData.tags,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_7__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_9__["store"].idList.push({
                    type: _API__WEBPACK_IMPORTED_MODULE_8__["API"].getWorkType(nowData.illustType),
                    id: nowData.illustId,
                });
            }
        }
        this.listPageFinished++;
        _Log__WEBPACK_IMPORTED_MODULE_10__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
            // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
            this.getIdList();
        }
        else {
            // 抓取任务已经全部发送
            if (this.listPageFinished === this.needCrawlPageCount) {
                // 抓取任务全部完成
                _Log__WEBPACK_IMPORTED_MODULE_10__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取完成'));
                this.getIdListFinished();
            }
        }
    }
    resetGetIdListStatus() {
        this.listPageFinished = 0;
        this.sendCrawlTaskCount = 0;
    }
    // 搜索页把下载任务按收藏数从高到低下载
    sortResult() {
        _Store__WEBPACK_IMPORTED_MODULE_9__["store"].resultMeta.sort(_API__WEBPACK_IMPORTED_MODULE_8__["API"].sortByProperty('bmk'));
        _Store__WEBPACK_IMPORTED_MODULE_9__["store"].result.sort(_API__WEBPACK_IMPORTED_MODULE_8__["API"].sortByProperty('bmk'));
    }
    setPreviewResult(value) {
        this.previewResult = value;
        // 如果设置了“预览搜索结果”，则“不自动下载”。否则允许自动下载
        _States__WEBPACK_IMPORTED_MODULE_15__["states"].notAutoDownload = value ? true : false;
    }
}



/***/ }),

/***/ "./src/ts/modules/artwork/InitSeriesPage.ts":
/*!**************************************************!*\
  !*** ./src/ts/modules/artwork/InitSeriesPage.ts ***!
  \**************************************************/
/*! exports provided: InitSeriesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitSeriesPage", function() { return InitSeriesPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
// 初始化插画/漫画的系列作品页面









class InitSeriesPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        // 目前存在新版和旧版共存的情况，对这新旧页面采取不同的抓取方式
        // 一个主要的原因是，旧版一页 18 个作品，新版一页 12 个作品，所以旧版还是继续使用之前的方式比较省事
        this.baseUrl = '';
        this.seriesId = '';
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        this.maxCount = 100;
        _Options__WEBPACK_IMPORTED_MODULE_5__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    getWantPage() {
        const check = this.checkWantPageInputGreater0();
        if (check == undefined) {
            return;
        }
        this.crawlNumber = check;
        if (this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_任务开始1', this.crawlNumber.toString()));
    }
    nextStep() {
        // 设置起始页码
        const p = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        // 判断是否是旧版
        let old = !!document.querySelector('.badge');
        if (old) {
            // 旧版
            // 设置起始网址
            const url = new URL(window.location.href);
            url.searchParams.set('p', '1');
            this.baseUrl = url.toString();
            this.getIdListOld();
        }
        else {
            // 新版
            // 获取系列 id
            this.seriesId = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLPathField('series');
            this.getIdList();
        }
    }
    async getIdListOld() {
        let p = this.startpageNo + this.listPageFinished;
        let dom;
        try {
            const res = await fetch(this.baseUrl.replace('p=1', 'p=' + p));
            const text = await res.text();
            const parse = new DOMParser();
            dom = parse.parseFromString(text, 'text/html');
        }
        catch (error) {
            this.getIdListOld();
            return;
        }
        this.listPageFinished++;
        if (dom.querySelector('.no-content')) {
            // 此页没有内容，也就没有后续内容了
            return this.getIdListFinished();
        }
        const workList = dom.querySelectorAll('.works .image-item');
        // 检查每个作品的信息
        for (const item of workList) {
            // https://www.pixiv.net/user/3698796/series/61267
            const link = item.querySelector('a').href;
            const id = parseInt(link.split('/artworks/')[1]);
            const tagString = item.querySelector('img').dataset.tags;
            const tags = tagString ? tagString.split(' ') : [];
            const bookmarkBtn = item.querySelector('._one-click-bookmark');
            const bookmarked = bookmarkBtn
                ? bookmarkBtn.classList.contains('on')
                : false;
            const filterOpt = {
                id: id,
                tags: tags,
                bookmarkData: bookmarked,
            };
            // 其实 type 这里有个存疑的地方。如果插画没有系列页面，只有漫画有系列页面，那么这里可以直接断言 type 为 manga。但是这一点尚不能完全确定，所以这里 type 是 unknown
            if (await _Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                    type: 'unknown',
                    id: id.toString(),
                });
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        // 抓取完毕
        if (p >= this.maxCount || this.listPageFinished === this.crawlNumber) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_列表页抓取完成'));
            this.getIdListFinished();
        }
        else {
            // 继续抓取
            this.getIdListOld();
        }
    }
    async getIdList() {
        let p = this.startpageNo + this.listPageFinished;
        const data = await _API__WEBPACK_IMPORTED_MODULE_2__["API"].getSeriesData(this.seriesId, p);
        this.listPageFinished++;
        // 保存本页面的作品的 id 列表
        const idList = [];
        for (const info of data.body.page.series) {
            idList.push(info.workId);
        }
        // data.body.page.series 里的才是本页面的作品，illust 里则不同，有时它的作品数量比页面上的更多
        // 从 illust 里查找 id 对应的数据，进行过滤
        for (const work of data.body.thumbnails.illust) {
            if (!idList.includes(work.illustId)) {
                continue;
            }
            if (work.isAdContainer) {
                continue;
            }
            // 过滤器进行检查
            const filterOpt = {
                id: work.illustId,
                tags: work.tags,
                bookmarkData: !!work.bookmarkData,
                width: work.width,
                height: work.height,
                illustType: work.illustType,
            };
            // 因为这个 api 的 illust 数据可能是插画也可能是漫画，所以 type 是 unknown
            if (await _Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                    type: 'unknown',
                    id: work.illustId,
                });
            }
        }
        // 如果 data.body.page.series 为空，就是到了最后一页
        const endFlag = data.body.page.series.length === 0;
        // 抓取完毕
        if (endFlag ||
            p >= this.maxCount ||
            this.listPageFinished === this.crawlNumber) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_列表页抓取完成'));
            this.getIdListFinished();
        }
        else {
            // 继续抓取
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
            this.getIdList();
        }
    }
    resetGetIdListStatus() {
        this.listPageFinished = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/artwork/SaveArtworkData.ts":
/*!***************************************************!*\
  !*** ./src/ts/modules/artwork/SaveArtworkData.ts ***!
  \***************************************************/
/*! exports provided: saveArtworkData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveArtworkData", function() { return saveArtworkData; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");




// 保存单个图片作品的数据
class SaveArtworkData {
    async save(data) {
        // 获取需要检查的信息
        const body = data.body;
        const fullWidth = body.width; // 原图宽度
        const fullHeight = body.height; // 原图高度
        const bmk = body.bookmarkCount; // 收藏数
        const tagArr = body.tags.tags; // 取出 tag 信息
        const tags = []; // 保存 tag 列表
        const tagsWithTransl = []; // 保存 tag 列表，附带翻译后的 tag
        const tagsTranslOnly = []; // 保存翻译后的 tag 列表
        for (const tagData of tagArr) {
            tags.push(tagData.tag);
            tagsWithTransl.push(tagData.tag);
            if (tagData.translation && tagData.translation.en) {
                // 有翻译
                // 不管是什么语种的翻译结果，都保存在 en 属性里
                tagsWithTransl.push(tagData.translation.en);
                tagsTranslOnly.push(tagData.translation.en);
            }
            else {
                // 无翻译
                // 把原 tag 保存到 tagsTranslOnly 里
                tagsTranslOnly.push(tagData.tag);
            }
        }
        const filterOpt = {
            createDate: body.createDate,
            id: body.illustId,
            illustType: body.illustType,
            tags: tagsWithTransl,
            pageCount: body.pageCount,
            bookmarkCount: bmk,
            bookmarkData: body.bookmarkData,
            width: fullWidth,
            height: fullHeight,
            mini: body.urls.mini,
        };
        // 检查通过
        if (await _Filter__WEBPACK_IMPORTED_MODULE_1__["filter"].check(filterOpt)) {
            const illustId = body.illustId;
            const idNum = parseInt(body.illustId);
            const title = body.illustTitle; // 作品标题
            const userid = body.userId; // 用户id
            const user = body.userName; // 用户名
            const thumb = body.urls.thumb;
            const pageCount = body.pageCount;
            const bookmarked = !!body.bookmarkData;
            // 时间原数据如 "2019-12-18T22:23:37+00:00"
            // 网页上显示的日期是转换成了本地时间的，如北京时区显示为 "2019-12-19"，不是显示原始日期 "2019-12-18"。所以这里转换成本地时区的日期，和网页上保持一致，以免用户困惑。
            const date0 = new Date(body.createDate);
            const y = date0.getFullYear();
            const m = (date0.getMonth() + 1).toString().padStart(2, '0');
            const d = date0.getDate().toString().padStart(2, '0');
            const date = `${y}-${m}-${d}`;
            let rank = ''; // 保存作品在排行榜上的编号
            let testRank = _Store__WEBPACK_IMPORTED_MODULE_3__["store"].getRankList(body.illustId);
            if (testRank !== undefined) {
                rank = '#' + testRank;
            }
            let seriesTitle = body.seriesNavData ? body.seriesNavData.title : '';
            let seriesOrder = body.seriesNavData ? '#' + body.seriesNavData.order : '';
            // 储存作品信息
            if (body.illustType !== 2) {
                // 插画或漫画
                // 下载该作品的前面几张
                const dlCount = _Settings__WEBPACK_IMPORTED_MODULE_2__["setting"].getDLCount(body.pageCount);
                const imgUrl = body.urls.original; // 作品的原图 URL
                const tempExt = imgUrl.split('.');
                const ext = tempExt[tempExt.length - 1];
                // 添加作品信息
                _Store__WEBPACK_IMPORTED_MODULE_3__["store"].addResult({
                    id: illustId,
                    idNum: idNum,
                    thumb: thumb,
                    pageCount: pageCount,
                    dlCount: dlCount,
                    url: imgUrl,
                    title: title,
                    tags: tags,
                    tagsWithTransl: tagsWithTransl,
                    tagsTranslOnly: tagsTranslOnly,
                    user: user,
                    userId: userid,
                    fullWidth: fullWidth,
                    fullHeight: fullHeight,
                    ext: ext,
                    bmk: bmk,
                    bookmarked: bookmarked,
                    date: date,
                    type: body.illustType,
                    rank: rank,
                    seriesTitle: seriesTitle,
                    seriesOrder: seriesOrder,
                });
            }
            else if (body.illustType === 2) {
                // 动图
                // 获取动图的信息
                const meta = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getUgoiraMeta(illustId);
                // 动图帧延迟数据
                const ugoiraInfo = {
                    frames: meta.body.frames,
                    mime_type: meta.body.mime_type,
                };
                const ext = _Settings__WEBPACK_IMPORTED_MODULE_2__["form"].ugoiraSaveAs.value; // 扩展名可能是 webm、gif、zip
                _Store__WEBPACK_IMPORTED_MODULE_3__["store"].addResult({
                    id: illustId,
                    idNum: idNum,
                    thumb: thumb,
                    pageCount: pageCount,
                    url: meta.body.originalSrc,
                    title: title,
                    tags: tags,
                    tagsWithTransl: tagsWithTransl,
                    tagsTranslOnly: tagsTranslOnly,
                    user: user,
                    userId: userid,
                    fullWidth: fullWidth,
                    fullHeight: fullHeight,
                    ext: ext,
                    bmk: bmk,
                    bookmarked: bookmarked,
                    date: date,
                    type: body.illustType,
                    rank: rank,
                    ugoiraInfo: ugoiraInfo,
                    seriesTitle: seriesTitle,
                    seriesOrder: seriesOrder,
                });
            }
        }
    }
}
const saveArtworkData = new SaveArtworkData();



/***/ }),

/***/ "./src/ts/modules/langText.ts":
/*!************************************!*\
  !*** ./src/ts/modules/langText.ts ***!
  \************************************/
/*! exports provided: langText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "langText", function() { return langText; });
const langText = {
    _只下载已收藏: [
        '只下载已收藏',
        'ブックマークのみをダウンロードする',
        'Download only bookmarked works',
        '只下載已收藏',
    ],
    _只下载已收藏的提示: [
        '只下载已经收藏的作品',
        'ブックマークした作品のみをダウンロードする',
        'Download only bookmarked works',
        '只下載已經收藏的作品。',
    ],
    _下载作品类型: [
        '下载作品类型',
        'ダウンロード作品の種類',
        'Download work type',
        '下載作品類型',
    ],
    _下载作品类型的提示: [
        '下载哪些类型的作品',
        'どの種類の作品をダウンロードしますか',
        'Which types of works to download',
        '下載哪些類型的作品。',
    ],
    _多p下载前几张: [
        '设置作品张数',
        '作品ごとにダウンロード画像の数',
        'Number of images downloaded per work',
        '設定作品張數',
    ],
    _多p下载前几张提示: [
        '下载每个作品的前几张图片。默认值 0 表示全部下载。',
        '各作品の画像が最初の何枚をダウンロードしますか？ デフォルト値の 0 は、すべてをダウンロードします。',
        'Download the first few images of each piece. The default value of 0 means all downloads.',
        '下載每個作品的前幾張圖片。預設值 0 表示全部下載。',
    ],
    _不能含有tag: [
        '不能含有 tag&nbsp;',
        '指定した tag を除外する',
        'Exclude specified tag',
        '不能含有 tag&nbsp;',
    ],
    _排除tag的提示文字: [
        '您可在下载前设置要排除的tag，这样在下载时将不会下载含有这些tag的作品。不区分大小写；如需排除多个tag，请使用英文逗号分隔。请注意要排除的tag的优先级大于要包含的tag的优先级。',
        'ダウンロード前に、除外する tag を設定できます。大文字と小文字を区別しない；複数の tag を設定する必要がある場合は、「,」で区切ってください。除外された tag は、必要な tag よりも優先されます',
        'Before downloading, you can set the tag you want to exclude. Not case sensitive; If you need to set multiple tags, you can use comma (,) separated. The excluded tag takes precedence over the included tag',
        '可在下載前設定要排除的 tag，下載時將排除含有這些 tag 的作品，不區分大小寫；如需排除多個 tag，請使用半形逗號（,）分隔。請注意，要排除的 tag 優先於要包含的 tag。',
    ],
    _设置了排除tag之后的提示: [
        '排除 tag：',
        '以下の tag を除外：',
        'Excludes tag: ',
        '排除 tag：',
    ],
    _必须含有tag: [
        '必须含有 tag&nbsp;',
        '必要な tag&nbsp;',
        'Must contain tag',
        '必須含有 tag&nbsp;',
    ],
    _必须tag的提示文字: [
        '您可在下载前设置作品里必须包含的tag，不区分大小写；如需包含多个tag，请使用英文逗号分隔。',
        'ダウンロードする前に、必要な tag を設定することができます。大文字と小文字を区別しない；複数の tag を設定する必要がある場合は、「,」で区切ってください。',
        'Before downloading, you can set the tag that must be included. Not case sensitive; If you need to set multiple tags, you can use comma (,) separated. ',
        '可在下載前設定作品裡必須包含的 tag，不區分大小寫；如需包含多個 tag，請使用半形逗號（,）分隔。',
    ],
    _设置了必须tag之后的提示: [
        '包含 tag：',
        '以下の tag を含める：',
        'Include tag: ',
        '包含 tag：',
    ],
    _筛选宽高的按钮文字: [
        '设置宽高条件',
        '幅と高さの条件を設定する',
        'Set the width and height',
        '設定寬高條件',
    ],
    _筛选宽高的按钮Title: [
        '在下载前，您可以设置要下载的图片的宽高条件。',
        'ダウンロードする前に、画像の幅と高さの条件を設定できます。',
        'Before downloading, you can set the width and height conditions of the images you want to download.',
        '在下載前可以設定要下載的圖片的寬高條件。',
    ],
    _设置宽高比例: [
        '设置宽高比例',
        '縦横比を設定する',
        'Set the aspect ratio',
        '設定寬高比例',
    ],
    _设置宽高比例Title: [
        '设置宽高比例，也可以手动输入宽高比',
        '縦横比を設定する、手動で縦横比を入力することもできる',
        'Set the aspect ratio, or manually type the aspect ratio',
        '設定寬高比，也可以手動輸入寬高比。',
    ],
    _不限制: ['不限制', '無制限', 'not limited', '不限制'],
    _横图: ['横图', '横長', 'Horizontal', '橫圖'],
    _竖图: ['竖图', '縦長', 'Vertical', '豎圖'],
    _输入宽高比: ['宽高比 >=', '縦横比 >=', 'Aspect ratio >=', '寬高比 >='],
    _设置了宽高比之后的提示: [
        '宽高比：{}',
        '縦横比：{}',
        'Aspect ratio: {}',
        '寬高比：{}',
    ],
    _宽高比必须是数字: [
        '宽高比必须是数字',
        '縦横比は数値でなければなりません',
        'The aspect ratio must be a number',
        '寬高比必須是數字',
    ],
    _筛选宽高的提示文字: [
        '请输入最小宽度和最小高度，不会下载不符合要求的图片。',
        '最小幅と最小高さを入力してください。要件を満たしていない画像はダウンロードされません。',
        'Please type the minimum width and minimum height. Will not download images that do not meet the requirements',
        '請輸入最小寬度和最小高度，只會下載符合要求的圖片。',
    ],
    _本次输入的数值无效: [
        '本次输入的数值无效',
        '無効な入力',
        'Invalid input',
        '本次輸入的數值無效',
    ],
    _宽度设置: ['宽度 >= ', '幅 >= ', 'Width >= ', '寬度 >= '],
    _或者: [' 或者 ', ' または ', ' or ', ' 或是 '],
    _并且: [' 并且 ', ' そして ', ' and ', ' 並且 '],
    _高度设置: ['高度 >= ', '高さ >= ', 'height >= ', '高度 >= '],
    _个数: [
        '设置作品数量',
        '作品数を設定する',
        'Set the number of works',
        '設定作品數量',
    ],
    _页数: [
        '设置页面数量',
        'ページ数を設定する',
        'Set the number of pages',
        '設定頁面數量',
    ],
    _筛选收藏数的按钮文字: [
        '设置收藏数量',
        'ブックマークされた数を設定する',
        'Set the bookmarkCount conditions',
        '設定收藏數量',
    ],
    _筛选收藏数的按钮Title: [
        '在下载前，您可以设置对收藏数量的要求。',
        'ダウンロードする前に、ブックマークされた数の条件を設定することができます。',
        'Before downloading, You can set the requirements for the number of bookmarks.',
        '下載前可以設定對收藏數量的要求。',
    ],
    _设置收藏数量: [
        '设置收藏数量',
        'ブックマークされた数を設定する',
        'Set the number of bookmarks',
        '設定收藏數量',
    ],
    _设置收藏数量的提示: [
        '如果作品的收藏数小于设置的数字，作品不会被下载。',
        '作品のブックマークされた数が設定された数字よりも少ない場合、作品はダウンロードされません。',
        'If the number of bookmarks of the work is less than the set number, the work will not be downloaded.',
        '只會下載設定收藏數範圍內的作品。',
    ],
    _筛选收藏数的提示文字: [
        '请输入一个数字，如果作品的收藏数小于这个数字，作品不会被下载。',
        '数字を入力してください。 作品のブックマークされた数がこの数字より少ない場合、作品はダウンロードされません。',
        'Please type a number. If the number of bookmarks of the work is less than this number, the work will not be downloaded.',
        '請輸入數字，只會下載設定收藏數範圍內的作品。',
    ],
    _收藏数大于: [
        '收藏数 >= ',
        'ブックマークの数 >= ',
        'Number of bookmarks >= ',
        '收藏數 >= ',
    ],
    _收藏数小于: [
        '收藏数 <= ',
        'ブックマークの数 <= ',
        'Number of bookmarks <= ',
        '收藏數 <= ',
    ],
    _本次任务已全部完成: [
        '本次任务已全部完成。',
        'このタスクは完了しました。',
        'This task has been completed.',
        '本次工作已全部完成',
    ],
    _本次任务条件: [
        '本次任务条件: ',
        'このタスクの条件：',
        'This task condition: ',
        '本次工作條件：',
    ],
    _参数不合法: [
        '参数不合法，本次操作已取消。',
        'パラメータは有効ではありません。この操作はキャンセルされました。',
        'Parameter is not legal, this operation has been canceled.',
        '參數不合法，本次動作已取消。',
    ],
    _从本页开始下载x个作品: [
        '从本页开始下载-num-个作品',
        'このページから -num- 枚の作品をダウンロード。',
        'Download -num- works from this page.',
        '從本頁開始下載-num-個作品',
    ],
    _向下获取所有作品: [
        '向下获取所有作品',
        'このページからすべての作品をダウンロードする。',
        'download all the work from this page.',
        '向下取得所有作品',
    ],
    _从本页开始下载提示: [
        '从本页开始下载<br>如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
        'このページからダウンロードする<br>ダウンロードするページを設定する場合は、1から始まる数字を入力してください。 1は現在のページのみをダウンロードする。',
        'Download from this page<br>If you want to set the number of pages to download, type a number starting at 1. This page is 1.',
        '從本頁開始下載。<br>如果要限制下載的頁數，請輸入從 1 開始的數字，1 為僅下載本頁。',
    ],
    _从本页开始下载x页: [
        '从本页开始下载-num-页',
        '現在のページから -num- ページをウンロードします',
        'download -num- pages from the current page',
        '從本頁開始下載-num-頁',
    ],
    _下载所有页面: [
        '下载所有页面',
        'すべてのページをダウンロードする',
        'download all pages',
        '下載所有頁面',
    ],
    _下载x个相关作品: [
        '下载 -num- 个相关作品',
        '関連作品 -num- 枚をダウンロードする。',
        'download -num- related works.',
        '下載 -num- 個相關作品',
    ],
    _下载所有相关作品: [
        '下载所有相关作品',
        '関連作品をすべてダウンロードする。',
        'download all related works.',
        '下載所有相關作品',
    ],
    _下载推荐作品: [
        '下载推荐作品',
        'お勧め作品をダウンロードする',
        'download recommend works',
        '下載推薦作品',
    ],
    _下载排行榜前x个作品: [
        '下载排行榜前 -num- 个作品',
        'ランク前 -num- 位の作品をダウンロードする。',
        'download the top -num- works in the ranking list',
        '下載排行榜前 -num- 個作品',
    ],
    _输入超过了最大值: [
        '您输入的数字超过了最大值',
        '入力した番号が最大値を超えています',
        'The number you entered exceeds the maximum',
        '輸入的數字超出最大值',
    ],
    _任务开始1: [
        '从本页开始下载{}页',
        'このページから {} ページをダウンロードする',
        'download {} pages from this page',
        '從本頁開始下載 {} 頁',
    ],
    _任务开始0: ['任务开始', 'タスクが開始されます', 'Task starts', '工作開始'],
    _checkNotdownTypeAll: [
        '由于您排除了所有作品类型，本次任务已取消。',
        'すべての種類の作品を除外したため、タスクはキャンセルされました。',
        'Because you excluded all types of work, the task was canceled.',
        '由於排除了所有作品類型，本次工作已取消。',
    ],
    _checkNotdownTypeResult: [
        '排除作品类型：',
        'これらのタイプの作品を除外します：',
        'Excludes these types of works: ',
        '排除作品類型：',
    ],
    _多图作品: [
        '多图作品',
        'マルチイメージ作品',
        'Multi-image works',
        '多圖作品',
    ],
    _多图下载设置: [
        '多图下载设置',
        'マルチイメージ設定',
        'Download multi-image works',
        '多圖下載設定',
    ],
    _怎样下载多图作品: [
        '怎样下载多图作品？',
        'どのようにマルチイメージ作品をダウンロードしますか？',
        'How to download multi-image works?',
        '如何下載多圖作品？',
    ],
    _多图建立目录: [
        '多图建立目录',
        'マルチイメージにフォルダを作成',
        'Create directory for multi-image works',
        '多圖建立目錄',
    ],
    _多图建立目录提示: [
        '当你下载多图作品时，下载器可以自动创建一个目录，保存里面的图片。',
        'マルチイメージをダウンロードする時、自動的にフォルダを作成し、イメージをその中で保存することができます。',
        'When you download a multi-image work, the downloader can automatically create a directory and save the images inside.',
        '當下載多圖作品時，下載器可以自動建立一個目錄，儲存裡面的圖片。',
    ],
    _不下载: ['不下载', '必要なし', 'No', '不下載'],
    _全部下载: ['全部下载', '全部ダウンロード', 'Yes', '全部下載'],
    _下载前几张图片: [
        '下载前几张图片：',
        '最初のいくつかの画像：',
        'First few images:',
        '下載前幾張圖片：',
    ],
    _不下载多图作品: [
        '不下载多图作品',
        'マルチイメージ作品をダウンロードしない',
        'Do not download multi-image works',
        '不下載多圖作品',
    ],
    _多图作品下载前n张图片: [
        '多图作品下载前 {} 张图片',
        'マルチイメージ作品は、最初の {} イメージをダウンロードします',
        'Multi-image works download the first {} images',
        '多圖作品下載前 {} 張圖片',
    ],
    _插画: ['插画 ', 'イラスト', 'Illustrations', '插畫 '],
    _漫画: ['漫画 ', '漫画', 'Manga', '漫畫 '],
    _动图: ['动图 ', 'うごイラ', 'Ugoira', '動圖 '],
    _动图保存格式: [
        '动图保存格式',
        'うごイラの保存タイプ',
        'Save the ugoira work as',
        '動圖儲存格式',
    ],
    _动图保存格式title: [
        '下载动图时，可以把它转换成视频文件',
        'うごイラをダウンロードするとき、動画に変換することができます。',
        'When you download a ugoira work, you can convert it to a video file.',
        '下載動圖時，可以將它轉換為影片檔案。',
    ],
    _webmVideo: ['WebM 视频', 'WebM ビデオ', 'WebM video', '影片（WebM）'],
    _gif: ['GIF 图片', 'GIF 画像', 'GIF picture', '圖片（GIF）'],
    _apng: ['APNG 图片', 'APNG 画像', 'APNG picture', '圖片（APNG）'],
    _zipFile: ['Zip 文件', 'ZIP ファイル', 'Zip file', '壓縮檔（Zip）'],
    _当前作品个数: [
        '当前有 {} 个作品 ',
        '今は　{}　枚の作品があります ',
        'There are now {} works ',
        '目前有 {} 個作品 ',
    ],
    _当前有x个用户: [
        '当前有 {} 个用户 ',
        '現在 {} 人のユーザーがいます ',
        'There are currently {} users ',
        '目前有 {} 個使用者 ',
    ],
    _排行榜进度: [
        '已抓取本页面第{}部分',
        'このページの第　{}　部がクロールされました',
        'Part {} of this page has been crawled',
        '已擷取本頁面第 {} 部分',
    ],
    _新作品进度: [
        '已抓取本页面 {} 个作品',
        'このページの {} つの作品をクロールしました',
        'This page has been crawled {} works',
        '已擷取本頁面 {} 個作品',
    ],
    _抓取多少个作品: [
        '抓取本页面 {} 个作品',
        'このページの {} つの作品をクロールします',
        'Crawl this page {} works',
        '擷取本頁面 {} 個作品',
    ],
    _相关作品抓取完毕: [
        '相关作品抓取完毕。包含有{}个作品，开始获取作品信息。',
        '関連作品はクロールされました。 {} 作品を含み、その作品に関する情報の取得を開始します。',
        'The related works have been crawled. Contains {} works and starts getting information about the work.',
        '相關作品擷取完畢。包含有 {} 個作品，開始取得作品資訊。',
    ],
    _排行榜任务完成: [
        '本页面抓取完毕。<br>当前有{}个作品，开始获取作品信息。',
        'このページのクロール終了。<br>{}枚の作品があります。 作品情報の取得を開始します。',
        'This page is crawled and now has {} works.<br> Start getting the works for more information.',
        '本頁面擷取完畢。<br>目前有 {} 個作品，開始取得作品資訊。',
    ],
    _列表页抓取进度: [
        '已抓取列表页{}个页面',
        '{} のリストページを取得しました',
        'Has acquired {} list pages',
        '已擷取清單頁 {} 個頁面',
    ],
    _列表页抓取完成: [
        '列表页面抓取完成',
        'リストページがクロールされ',
        'The list page is crawled',
        '清單頁面擷取完成',
    ],
    _抓取结果为零: [
        '抓取完毕，但没有找到符合筛选条件的作品。',
        'クロールは終了しましたが、フィルタ条件に一致する作品が見つかりませんでした。',
        'Crawl finished but did not find works that match the filter criteria.',
        '擷取完畢，但沒有找到符合篩選條件的作品。',
    ],
    _当前任务尚未完成: [
        '当前任务尚未完成',
        '現在のタスクはまだ完了していません',
        'The current task has not yet been completed',
        '目前工作尚未完成',
    ],
    _当前任务尚未完成2: [
        '当前任务尚未完成，请等待完成后再下载。',
        '現在のタスクはまだ完了していません、完了するまでお待ちください',
        'The current task has not yet been completed',
        '目前工作尚未完成，請等待完成後再下載。',
    ],
    _列表抓取完成开始获取作品页: [
        '当前列表中有{}张作品，开始获取作品信息',
        '{} 枚の作品があります。 作品情報の取得を開始します。',
        'Now has {} works. Start getting the works for more information.',
        '目前清單中有 {} 張作品，開始取得作品資訊',
    ],
    _开始获取作品页面: [
        '开始获取作品页面',
        '作品ページの取得を開始する',
        'Start getting the works page',
        '開始取得作品頁面',
    ],
    _无权访问2: [
        '无权访问 {}，跳过该作品。',
        '{} のアクセス権限がありません、作品を無視する。',
        'No access {}, skip.',
        '沒有權限存取 {}，跳過該作品。',
    ],
    _作品页状态码0: [
        '请求的url不可访问',
        '要求された URL にアクセスできません',
        'The requested url is not accessible',
        '要求的 url 無法存取',
    ],
    _作品页状态码400: [
        '该作品已被删除',
        '作品は削除されました',
        'The work has been deleted',
        '該作品已被刪除',
    ],
    _作品页状态码403: [
        '无权访问请求的url 403',
        'リクエストされた url にアクセスできない 403',
        'Have no access to the requested url 403',
        '沒有權限存取要求的 url 403',
    ],
    _作品页状态码404: [
        '404 not found',
        '404 not found',
        '404 not found',
        '404 not found',
    ],
    _正在抓取: [
        '正在抓取，请等待……',
        'クロール中、しばらくお待ちください...',
        'Getting, please wait...',
        '擷取中，請稍後……',
    ],
    _获取全部书签作品: [
        '获取全部书签作品，时间可能比较长，请耐心等待。',
        'ブックマークしたすべての作品を取得すると、時間がかかることがあります。お待ちください。',
        'Get all bookmarked works, the time may be longer, please wait.',
        '取得全部書籤作品，時間可能比較長，請耐心等待。',
    ],
    _抓取图片网址遇到中断: [
        '当前任务已中断!',
        '現在のタスクが中断されました。',
        'The current task has been interrupted.',
        '目前工作已中斷！',
    ],
    _关闭: ['关闭', 'クローズ', 'close', '關閉'],
    _输出信息: ['输出信息', '出力情報', 'Output information', '輸出資訊'],
    _复制: ['复制', 'コピー', 'Copy', '複製'],
    _已复制到剪贴板: [
        '已复制到剪贴板，可直接粘贴',
        'クリップボードにコピーされました',
        'Has been copied to the clipboard',
        '已複製至剪貼簿，可直接貼上',
    ],
    _下载设置: ['下载设置', 'ダウンロード設定', 'Download settings', '下載設定'],
    _收起展开设置项: [
        '收起/展开设置项',
        '設定の折りたたみ/展開',
        'Collapse/expand settings',
        '摺疊/展開設定項目',
    ],
    _github: [
        'Github 页面，欢迎 star',
        'Github のページ、star をクリックしてください',
        'Github page, if you like, please star it',
        'Github 頁面，歡迎 star',
    ],
    _wiki: ['使用手册', 'マニュアル', 'Wiki', 'Wiki'],
    _快捷键切换显示隐藏: [
        '使用 Alt + X，可以显示和隐藏下载面板',
        'Alt + X てダウンロードパネルを表示および非表示にする',
        'Use Alt + X to show and hide the download panel',
        'Alt + X 可以顯示或隱藏下載面板。',
    ],
    _共抓取到n个文件: [
        '共抓取到 {} 个文件',
        '合計 {} つのファイルがあります',
        'Crawl a total of {} files',
        '共擷取到 {} 個檔案',
    ],
    _命名规则: ['命名规则', '命名規則', 'Naming rule', '命名規則'],
    _设置文件夹名的提示: [
        `可以使用 '/' 建立文件夹<br>示例：{p_title}/{user}/{id}`,
        `フォルダーは '/' で作成できます<br>例：{p_title}/{user}/{id}`,
        `You can create a directory with '/'<br>Example：{p_title}/{user}/{id}`,
        `可以使用斜線（/）建立資料夾。<br>範例：{p_title}/{user}/{id}`,
    ],
    _添加命名标记前缀: [
        '添加命名标记前缀',
        '前に tag の名前を追加',
        'Add named tag prefix',
        '加入命名標記前綴',
    ],
    _添加字段名称提示: [
        '例如，在用户名前面添加“user_”标记',
        'たとえば、ユーザー名の前に 「user_」 tag を追加します。',
        'For example, add the "user_" tag in front of the username',
        '例如，在使用者名稱前面加入「user_」標記。',
    ],
    _查看标记的含义: [
        '查看标记的含义',
        ' tag の意味を表示する',
        'View the meaning of the tag',
        '檢視標記的意義',
    ],
    _命名标记id: [
        '默认文件名，如 44920385_p0',
        'デフォルトのファイル名，例 44920385_p0',
        'Default file name, for example 44920385_p0',
        '預設檔案名稱，例如：44920385_p0。',
    ],
    _命名标记title: ['作品标题', '作品のタイトル', 'works title', '作品標題'],
    _命名标记tags: [
        '作品的 tag 列表',
        '作品の tags',
        'The tags of the work',
        '作品的 tag 清單',
    ],
    _命名标记user: ['画师名字', 'アーティスト名', 'Artist name', '畫師名稱'],
    _命名标记userid: ['画师 id', 'アーティスト ID', 'Artist id', '畫師 id'],
    _命名标记px: ['宽度和高度', '幅と高さ', 'width and height', '寬度和高度'],
    _命名标记bmk: [
        'bookmark-count，作品的收藏数。把它放在最前面可以让文件按收藏数排序。',
        'bookmark-count，作品のボックマークの数、前に追加することでボックマーク数で并べることができます。',
        'bookmark-count, bookmarks number of works.',
        'bookmark-count，作品的收藏數。將它放在最前面可以讓檔案依收藏數排序。',
    ],
    _命名标记id_num: [
        '数字 id，如 44920385',
        '44920385 などの番号 ID',
        'Number id, for example 44920385',
        '數字 id，例如：44920385。',
    ],
    _命名标记p_num: [
        '图片在作品内的序号，如 0、1、2 …… 每个作品都会重新计数。',
        '0、1、2 など、作品の画像のシリアル番号。各ピースは再集計されます。',
        'The serial number of the picture in the work, such as 0, 1, 2 ... Each work will be recounted.',
        '圖片在作品內的序號，例如：0、1、2……每個作品都將重新計數。',
    ],
    _命名标记tags_trans: [
        '作品的 tag 列表，附带翻译后的 tag（如果有）',
        '作品の tag リスト、翻訳付き tag (あれば)',
        'The tags of the work, with the translated tag (if any)',
        '作品的 tag 清單，包含翻譯後的 tag（如果有的話）。',
    ],
    _命名标记tags_transl_only: [
        '翻译后的 tag 列表',
        '翻訳后の tag リスト',
        'Translated tags',
        '譯後的 tag 清單。',
    ],
    _命名标记date: [
        '作品的创建日期，格式为 yyyy-MM-dd。如 2019-08-29',
        '作品の作成日は yyyy-MM-dd の形式でした。 2019-08-29 など',
        'The date the creation of the work was in the format yyyy-MM-dd. Such as 2019-08-29',
        '作品的建立日期，格式為 yyyy-MM-dd，例如：2019-08-29。',
    ],
    _命名标记rank: [
        '作品在排行榜中的排名。如 #1、#2 …… 只能在排行榜页面中使用。',
        '作品のランキング。例え　#1、#2 …… ランキングページのみで使用できます。',
        'The ranking of the work in the ranking pages. Such as #1, #2 ... Can only be used in ranking pages.',
        '作品在排行榜中的排名。例如：#1、#2……只能在排行榜頁面中使用。',
    ],
    _命名标记type: [
        '作品类型，分为 illustration、manga、ugoira、novel',
        '作品分類は、illustration、manga、ugoira、novel',
        'The type of work, divided into illustration, manga, ugoira, novel',
        '作品類型，分為 illustration、manga、ugoira、novel。',
    ],
    _命名标记提醒: [
        '您可以使用多个标记；建议在不同标记之间添加分割用的字符。示例：{id}-{userid}<br>一定要包含 {id} 或者 {id_num}。<br>* 在某些情况下，会有一些标记不可用。',
        '複数のタグを使用することができます；異なるタグ間の分割のために文字を追加することをお勧めします。例：{id}-{userid}<br>必ず{id}または{id_num}を含めてください。<br>* 場合によっては、一部の tag が利用できず。',
        'You can use multiple tags, and you can add a separate character between different tags. Example: {id}-{userid}<br>Be sure to include {id} or {id_num}.<br>* In some cases, some tags will not be available.',
        '可以使用多個標記；建議在不同標記之間加入分隔用的字元。範例：{id}-{userid}<br>一定要包含 {id} 或者 {id_num}。<br>＊某些情況下有些標記無法使用。',
    ],
    _文件夹标记PTag: [
        '当前页面的 tag。当前页面没有 tag 时不可用。',
        '現在のページの tag。現在のページの tag がないときは使用できません。',
        'The tag of the current page. Not available if the current page has no tag.',
        '目前頁面的 tag。目前頁面沒有 tag 時無法使用。',
    ],
    _命名标记seriesTitle: [
        '系列标题（可能为空）',
        'シリーズタイトル（あれば）',
        'Series title (may be empty)',
        '系列標題（可能為空）',
    ],
    _命名标记seriesOrder: [
        '作品在系列中的序号，如 #1 #2',
        'シリーズの中の作品の番号，例え #1 #2',
        'The number of the work in the series, such as #1 #2',
        '作品在系列中的編號，如 #1 #2',
    ],
    _文件夹标记PTitle: [
        '当前页面的标题',
        'ページのタイトル',
        'The title of this page',
        '目前頁面的標題',
    ],
    _预览文件名: [
        '预览文件名',
        'ファイル名のプレビュー',
        'Preview file name',
        '預覽檔案名稱',
    ],
    _设置下载线程: [
        '设置下载线程',
        'ダウンロードスレッドを設定する',
        'Set the download thread',
        '設定下載執行緒',
    ],
    _线程数字: [
        '可以输入 1-5 之间的数字，设置同时下载的数量',
        '同時ダウンロード数を設定、1-5 の数値を入力してください',
        'You can type a number between 1-5 to set the number of concurrent downloads',
        '可以輸入 1-5 之間的數字，設定同時下載的數量。',
    ],
    _下载按钮1: ['开始下载', 'ダウンロードを開始', 'start download', '開始下載'],
    _下载按钮2: [
        '暂停下载',
        'ダウンロードを一時停止',
        'pause download',
        '暫停下載',
    ],
    _下载按钮3: ['停止下载', 'ダウンロードを停止', 'stop download', '停止下載'],
    _复制url: ['复制 url', 'URL をコピー', 'copy urls', '複製下載網址'],
    _当前状态: ['当前状态 ', '現在の状態 ', 'State ', '目前狀態：'],
    _未开始下载: [
        '未开始下载',
        'まだダウンロードを開始していません',
        'Not yet started downloading',
        '未開始下載',
    ],
    _下载进度: [
        '下载进度：',
        'ダウンロードの進行状況：',
        'Total progress: ',
        '下載進度：',
    ],
    _下载线程: ['下载线程：', 'スレッド：', 'Thread: ', '下載執行緒：'],
    _常见问题: ['常见问题', 'よくある質問', 'Help', '常見問題'],
    _uuid: [
        '如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。',
        'ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。',
        'If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.',
        '如果下載後的檔案名稱異常，請停用其他有下載功能的瀏覽器擴充功能。',
    ],
    _下载说明: [
        "下载的文件保存在浏览器的下载目录里。<br>请不要在浏览器的下载选项里选中'总是询问每个文件的保存位置'。<br><b>如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。</b><br>QQ群：675174717",
        'ダウンロードしたファイルは、ブラウザのダウンロードディレクトリに保存されます。<br><b>ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。</b>',
        'The downloaded file is saved in the browser`s download directory. <br><b>If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.</b>',
        '下載的檔案儲存在瀏覽器的下載目錄裡。<br>請不要在瀏覽器的下載選項裡選取「下載每個檔案前先詢問儲存位置」。<br><b>如果下載後的檔名異常，請停用其他有下載功能的瀏覽器擴充功能。</b><br>QQ 群：675174717',
    ],
    _正在下载中: ['正在下载中', 'ダウンロード中', 'Downloading', '正在下載'],
    _下载完毕: [
        '✓ 下载完毕',
        '✓ ダウンロードが完了しました',
        '✓ Download finished',
        '✓ 下載完畢',
    ],
    _已暂停: [
        '下载已暂停',
        'ダウンロードは一時停止中です',
        'Download is paused',
        '下載已暫停',
    ],
    _已停止: [
        '下载已停止',
        'ダウンロードが停止しました',
        'Download stopped',
        '下載已停止',
    ],
    _已下载: ['已下载', 'downloaded', 'downloaded', '已下載'],
    _抓取完毕: [
        '抓取完毕！',
        'クロールが終了しました！',
        'Crawl finished!',
        '擷取完畢！',
    ],
    _快速下载本页: [
        '快速下载本页作品',
        'この作品をすばやくダウンロードする',
        'Download this work quickly',
        '快速下載本頁作品',
    ],
    _从本页开始抓取new: [
        '从本页开始抓取新作品',
        'このページから新しい作品を入手する',
        'Crawl the new works from this page',
        '從本頁開始擷取新作品',
    ],
    _从本页开始抓取old: [
        '从本页开始抓取旧作品',
        'このページから古い作品を入手する',
        'Crawl the old works from this page',
        '從本頁開始擷取舊作品',
    ],
    _抓取推荐作品: [
        '抓取推荐作品',
        '推奨作品をダウンロードする',
        'Crawl the recommend works',
        '擷取推薦作品',
    ],
    _抓取推荐作品Title: [
        '抓取页面底部的的推荐作品',
        'ページの下部で推奨作品をクロールします',
        'Crawl the recommended works at the bottom of the page',
        '擷取頁面底部的推薦作品。',
    ],
    _抓取相关作品: [
        '抓取相关作品',
        '関連作品をダウンロードする',
        'Crawl the related works',
        '擷取相關作品',
    ],
    _相关作品大于0: [
        ' （下载相关作品必须大于 0）',
        ' 「ダウンロードする関連作品の数は0より大きくなければならない」',
        '  (Download related works must be greater than 0)',
        ' （下載相關作品必須大於 0）',
    ],
    _默认下载多页: [
        ', 如有多页，默认会下载全部。',
        '、複数のページがある場合、デフォルトですべてをダウンロードされます。',
        ', If there are multiple pages, the default will be downloaded.',
        '，如有多頁，預設會下載全部。',
    ],
    _调整完毕: [
        '调整完毕，当前有{}个作品。',
        '調整が完了し、今、{} の作品があります。',
        'The adjustment is complete and now has {} works.',
        '調整完畢，目前有 {} 個作品。',
    ],
    _抓取当前作品: [
        '抓取当前作品',
        '現在の作品をクロールする',
        'Crawl the current work',
        '擷取目前作品',
    ],
    _抓取当前作品Title: [
        '抓取当前列表里的所有作品',
        '現在のリスト内のすべての作品をクロールする',
        'Crawl all the works in the current list',
        '擷取目前清單裡的所有作品',
    ],
    _清除多图作品: [
        '清除多图作品',
        '複数の作品を削除する',
        'Remove multi-drawing works',
        '清除多圖作品',
    ],
    _清除多图作品Title: [
        '如果不需要可以清除多图作品',
        '必要がない場合は、複数のグラフを削除することができます',
        'If you do not need it, you can delete multiple graphs',
        '如果不需要可以清除多圖作品。',
    ],
    _清除动图作品: [
        '清除动图作品',
        'うごイラ作品を削除する',
        'Remove ugoira work',
        '清除動圖作品',
    ],
    _清除动图作品Title: [
        '如果不需要可以清除动图作品',
        '必要がない場合は、うごイラを削除することができます',
        'If you do not need it, you can delete the ugoira work',
        '如果不需要可以清除動圖作品。',
    ],
    _手动删除作品: [
        '手动删除作品',
        '作品を手動で削除する',
        'Manually delete the work',
        '手動刪除作品',
    ],
    _手动删除作品Title: [
        '可以在下载前手动删除不需要的作品',
        'ダウンロードする前に不要な作品を手動で削除することができます',
        'You can manually delete unwanted work before downloading',
        '可以在下載前手動刪除不需要的作品，點擊作品刪除。',
    ],
    _退出手动删除: [
        '退出手动删除',
        '削除モードを終了する',
        'Exit manually delete',
        '結束手動刪除',
    ],
    _抓取本页作品: [
        '抓取本页作品',
        'このページをクロールする',
        'Crawl this page works',
        '擷取本頁作品',
    ],
    _抓取本页作品Title: [
        '抓取本页列表中的所有作品',
        'このページの全ての作品をクロールする',
        'Crawl this page works',
        '擷取本頁清單中的所有作品',
    ],
    _抓取本排行榜作品: [
        '抓取本排行榜作品',
        'このリストの作品をクロールする',
        'Crawl the works in this list',
        '擷取本排行榜作品',
    ],
    _抓取本排行榜作品Title: [
        '抓取本排行榜的所有作品，包括现在尚未加载出来的。',
        'まだ読み込まれていないものを含めて、このリストの作品をダウンロードする',
        'Crawl all of the works in this list, including those that are not yet loaded.',
        '擷取本排行榜的所有作品，包括現在尚未載入出來的。',
    ],
    _抓取首次登场的作品: [
        '抓取首次登场作品',
        '初登場作品をダウンロードする',
        'Crawl the debut works',
        '擷取首次登場作品',
    ],
    _抓取首次登场的作品Title: [
        '只下载首次登场的作品',
        '初登場作品のみダウンロードします',
        'Download only debut works',
        '只下載首次登場的作品',
    ],
    _抓取该页面的图片: [
        '抓取该页面的图片',
        'ページの画像をクロールする',
        'Crawl the picture of the page',
        '擷取該頁面的圖片',
    ],
    _抓取相似图片: [
        '抓取相似图片',
        '類似の作品をクロールする',
        'Crawl similar works',
        '擷取相似圖片',
    ],
    _想要获取多少个作品: [
        '您想要获取多少个作品？',
        'いくつの作品をダウンロードしたいですか？',
        'How many works do you want to download?',
        '想要取得多少個作品？',
    ],
    _数字提示1: [
        '-1, 或者大于 0',
        '-1、または 0 より大きい',
        '-1, or greater than 0',
        '-1 或是大於 0',
    ],
    _下载大家的新作品: [
        '下载大家的新作品',
        'みんなの新作をダウンロードする',
        'Download everyone`s new work',
        '下載大家的新作品',
    ],
    _屏蔽设定: ['屏蔽設定', 'ミュート設定', 'Mute settings', '封鎖設定'],
    _举报: ['举报', '報告', 'Report', '回報'],
    _输入id进行抓取: [
        '输入id进行抓取',
        'idを入力してダウンロードする',
        'Enter id to fetch',
        '輸入 id 進行擷取',
    ],
    _输入id进行抓取的提示文字: [
        '请输入作品id。如果有多个id，则以换行分割（即每行一个id）',
        'イラストレーターIDを入力してください。 複数の id がある場合は、1 行に 1 つの id を付けます。',
        'Please type the illustration id. If there is more than one id, one id per line.',
        '請輸入作品 id。如果有多個 id，則以換行分隔（即每行一個 id）。',
    ],
    _开始抓取: ['开始抓取', 'クロールを開始する', 'Start crawling', '開始擷取'],
    _添加tag: [
        '给未分类作品添加 tag',
        '未分類の作品に tag を追加',
        'Add tag to unclassified work',
        '幫未分類的作品加入 tag',
    ],
    _id不合法: ['id不合法', 'id が不正な', 'id is illegal', 'id 不合法'],
    _快速收藏: [
        '快速收藏',
        'クイックブックマーク',
        'Quick bookmarks',
        '快速收藏',
    ],
    _启用: ['启用', '有効にする', 'Enable', '啟用'],
    _自动开始下载: [
        '自动开始下载',
        'ダウンロードは自動的に開始されます',
        'Download starts automatically',
        '自動開始下載',
    ],
    _快速下载的提示: [
        '当“开始下载”状态可用时，自动开始下载，不需要点击下载按钮。',
        '「ダウンロードを開始する」ステータスが利用可能になると、ダウンロードは自動的に開始され、ダウンロードボタンをクリックする必要はありません。',
        'When the &quot;Start Downloa&quot; status is available, the download starts automatically and no need to click the download button.',
        '當可下載時自動開始下載，不需要點選下載按鈕。',
    ],
    _转换任务提示: [
        '正在转换 {} 个文件',
        '{} ファイルの変換',
        'Converting {} files',
        '正在轉換 {} 個檔案',
    ],
    _最近更新: ['最近更新', '最近更新する', 'What`s new', '最近更新'],
    _确定: ['确定', '確定', 'Ok', '確定'],
    _file404: [
        '404 错误：文件 {} 不存在。',
        '404 エラー：ファイル {} は存在しません。',
        '404 error: File {} does not exist.',
        '404 錯誤：檔案 {} 不存在。',
    ],
    _文件下载失败: [
        '文件 {} 下载失败',
        'ファイル {} のダウンロードを失敗しました',
        'File {} download failed',
        '檔案 {} 下載失敗',
    ],
    _重置设置: ['重置设置', 'リセット設定', 'Reset Settings', '重設設定'],
    _是否重置设置: [
        '是否重置设置？',
        '設定をリセットしますか？',
        'Do you want to reset the settings?',
        '確定要重設設定嗎？',
    ],
    _newver: [
        '有新版本可用',
        '新しいバージョンがあります',
        'A new version is available',
        '有新版本可更新',
    ],
    _快速下载建立文件夹: [
        '快速下载时，始终创建文件夹',
        'クイックダウンロード時、常にフォルダを作成します',
        'Always create directory when downloading quickly',
        '快速下載時，始終建立資料夾',
    ],
    _快速下载建立文件夹提示: [
        '快速下载时，如果只有一张图片，也会建立文件夹',
        'すばやくダウンロードとき、イラストが一枚だけでも、フォルダも作成されます',
        'When downloading quickly, if there is only one picture, a directory is also created',
        '快速下載時，若只有一張圖片，也會建立資料夾',
    ],
    _设置id范围: [
        '设置 id 范围',
        'id 範囲を設定',
        'Set id range',
        '設定 id 範圍',
    ],
    _设置id范围提示: [
        '您可以输入一个作品 id，抓取比它新或者比它旧的作品',
        '1 つの作品 id を入力することで、それより新しいあるいは古い作品をクロールことができます',
        'You can enter a work id and crawl works that are newer or older than it',
        '可以輸入一個作品 id，擷取比它新或者比它舊的作品。',
    ],
    _大于: ['大于', 'より大きい', 'Bigger than', '大於'],
    _小于: ['小于', 'より小さい', 'Less than', '小於'],
    _设置投稿时间: [
        '设置投稿时间',
        '投稿日時を設定する',
        'Set posting date',
        '設定投稿時間',
    ],
    _设置投稿时间提示: [
        '您可以下载指定时间内发布的作品',
        '指定された時間内に配信された作品をダウンロードすることができます',
        'You can download works posted in a specified period of time',
        '可以下載指定時間內發布的作品。',
    ],
    _时间范围: ['时间范围', '時間範囲', 'Time range', '時間範圍'],
    _必须大于0: [
        '必须大于 0',
        '0 より大きくなければなりません',
        'must be greater than 0',
        '必須大於 0',
    ],
    _开始筛选: ['开始筛选', 'スクリーニング開始', 'Start screening', '開始篩選'],
    _开始筛选Title: [
        '按照设置来筛选当前 tag 里的作品。',
        '現在の tag にある作品を設定によってスクリーニングする',
        'Screen the works in the current tag.',
        '按照設定來篩選目前 tag 裡的作品。',
    ],
    _在结果中筛选: [
        '在结果中筛选',
        '結果の中からスクリーニング',
        'Screen in results',
        '在結果中篩選',
    ],
    _在结果中筛选Title: [
        '您可以改变设置，并在结果中再次筛选。',
        '設定を変えて、結果の中で再びスクリーニングすることができます。',
        'You can change the settings and screen again in the results.',
        '可以變更設定，並在結果中再次篩選。',
    ],
    _抓取筛选结果: [
        '抓取筛选结果',
        'スクリーニングの結果をクロールする',
        'Crawl the screening results',
        '擷取篩選結果',
    ],
    _尚未开始筛选: [
        '尚未开始筛选',
        'まだスクリーニングを開始していない',
        'Screening has not started',
        '尚未開始篩選',
    ],
    _没有数据可供使用: [
        '没有数据可供使用',
        '使用可能なデータはない',
        'No data is available.',
        '沒有資料可供使用',
    ],
    _预览搜索结果: [
        '预览搜索页面的筛选结果',
        '検索ページのフィルタ結果をプレビューします',
        'Preview filter results on search page',
        '預覽搜尋頁面的篩選結果',
    ],
    _预览搜索结果说明: [
        '下载器可以把符合条件的作品显示在当前页面上。如果抓取结果太多导致页面崩溃，请关闭这个功能。<br>启用预览功能时，下载器不会自动开始下载。',
        'ローダは、該当する作品を現在のページに表示することができます。クロール結果が多すぎてページが崩れる場合は、この機能をオフにしてください。<br>プレビュー機能を有効にすると、ダウンロードは自動的に開始されません。',
        'The downloader can display the qualified works on the current page. If too many crawling results cause the page to crash, turn off this feature.<br>When the preview feature is enabled, the downloader does not start downloading automatically.',
        '下載器可以將符合條件的作品顯示在目前頁面上。如果擷取結果太多導致頁面當掉，請關閉這個功能。<br>啟用預覽功能時，下載器不會自動開始下載。',
    ],
    _目录名使用: [
        '目录名使用：',
        'ディレクトリ名の使用：',
        'Folder name use: ',
        '資料夾名稱使用：',
    ],
    _启用快速收藏: [
        '启用快速收藏',
        'クイックボックマークを有効にする',
        'Enable quick bookmark',
        '開啟快速收藏',
    ],
    _启用快速收藏说明: [
        '当你点击下载器添加的收藏按钮(☆)，把作品添加到书签时，自动添加这个作品的 tag。',
        'ダウンローダーに追加されたボックマークボタン「☆」をクリックして、作品をブックマークに追加すると、自動的に作品の tag が追加されます。',
        'When you click the favorite button (☆) added by the downloader to bookmark a work, the tag of the work is automatically added.',
        '當點選下載器新增的收藏按鈕（☆），將作品加入書籤時，自動新增這個作品的 tag。',
    ],
    _新增设置项: [
        '新增设置项',
        '新たな機能を追加されました。',
        'Added setting items',
        '新增設定項目',
    ],
    _抓取: ['抓取', 'クロール', 'Crawl', '擷取'],
    _下载: ['下载', 'ダウンロード', 'Download', '下載'],
    _其他: ['其他', 'その他', 'Other', '其他'],
    _第一张图不带序号: [
        '第一张图不带序号',
        '最初のイメージの番号を削除します',
        'The first picture without a serial number',
        '第一張圖片不包含序號',
    ],
    _第一张图不带序号说明: [
        '去掉每个作品第一张图的序号。例如 80036479_p0 变成 80036479',
        '作品ごとの最初のイメージの番号を削除します。例えば 80036479_p0 は 80036479 になります。',
        'Remove the serial number of the first picture of each work. For example 80036479_p0 becomes 80036479.',
        '去掉每個作品第一張圖的序號。例如：80036479_p0 變成 80036479。',
    ],
    _最小值: ['最小值', '最小値', 'Minimum value', '最小值'],
    _最大值: ['最大值', '最大値', 'maximum value', '最大值'],
    _单图作品: [
        '单图作品',
        'シングルイメージ作品',
        'Single image works',
        '單圖作品',
    ],
    _彩色图片: ['彩色图片', 'カラーイメージ', 'Color picture', '彩色圖片'],
    _黑白图片: [
        '黑白图片',
        '白黒イメージ',
        'Black and white pictures',
        '黑白圖片',
    ],
    _不保存图片因为颜色: [
        '{} 没有被保存，因为它的颜色不符合设定。',
        '{} は色が設定に合わないため、保存されていません。',
        '{} was not saved because its colors do not match the settings.',
        '{} 並未儲存，因為它的色彩不符合設定。',
    ],
    _同时转换多少个动图: [
        '同时转换多少个动图',
        '同時変換のうごイラの上限',
        'How many animations are converted at the same time',
        '同時轉換多少個動圖',
    ],
    _同时转换多少个动图警告: [
        '同时转换多个动图会增加资源占用。<br>转换动图时，请保持该标签页激活，否则浏览器会降低转换速度。',
        '複数の動画を同時に変換すると、リソースの占有が増加します。<br>うごイラを変換するときは、このタブを有効にしてください。そうしないと、ブラウザは変換速度を下げます。',
        'Converting multiple animations at the same time will increase resource consumption. <br> Please keep the tab active when converting animation, otherwise the browser will reduce the conversion speed.',
        '同時轉換多個動圖會增加資源占用。<br>轉換動圖時，請保持這個分頁啟動，否則瀏覽器會降低轉換速度。',
    ],
    _提示: ['提示', 'ヒント', 'tip', '提示'],
    _fanboxDownloader: [
        'Fanbox 下载器',
        'Fanbox ダウンロード',
        'Fanbox Downloader',
        'Fanbox 下載器',
    ],
    _不保存图片因为体积: [
        '{} 没有被保存，因为它的体积不符合设定。',
        '{} はファイルサイズが設定に合わないため、保存されていません。',
        '{} was not saved because its size do not match the settings.',
        '{} 並未儲存，因為它的大小不符合設定。',
    ],
    _文件体积限制: [
        '文件体积限制',
        'ファイルサイズ制限',
        'File size limit',
        '檔案大小限制',
    ],
    _不符合要求的文件不会被保存: [
        '不符合要求的文件不会被保存。',
        '設定 に合わないファイルは保存されません。',
        'Files that do not meet the requirements will not be saved.',
        '不符合要求的檔案不會被儲存。',
    ],
    _小说: ['小说', '小説', 'novel', '小說'],
    _抓取系列小说: [
        '抓取系列小说',
        '小説のシリーズをクロールする',
        'Crawl series of novels',
        '擷取系列小說',
    ],
    _小说保存格式: [
        '小说保存格式',
        '小説の保存形式',
        'Save the novel as',
        '小說儲存格式',
    ],
    _在小说里保存元数据: [
        '在小说里保存元数据',
        '小説の中にメタデータを保存する',
        'Save metadata in the novel',
        '將中繼資料（metadata）儲存在小說裡',
    ],
    _在小说里保存元数据提示: [
        '把作者、网址等信息保存到小說里',
        '作者やURLなどの情報をファイルの中に保存します。',
        'Save the author, url and other information in the file',
        '將作者、網址等訊息儲存到小說裡',
    ],
    _收藏本页面的所有作品: [
        '收藏本页面的所有作品',
        'この頁の全ての作品をブックマークに追加します',
        'Bookmark all works on this page',
        '收藏本頁面的所有作品',
    ],
    _输出内容太多已经为你保存到文件: [
        '因为输出内容太多，已经为您保存到文件。',
        '出力内容が多いため、txt ファイルに保存しました。',
        'Because the output is too much, it has been saved to a file.',
        '因為輸出內容太多，已經為你保存到檔案。',
    ],
    _不下载重复文件: [
        '不下载重复文件',
        '重複ファイルをダウンロードしない',
        'Don`t download duplicate files',
        '不下載重複檔案',
    ],
    _不下载重复文件的提示: [
        '下载器会保存自己的下载记录，以避免下载重复的文件。',
        'ダウンローダーは独自のダウンロード履歴を保存して、重複ファイルのダウンロードを回避する。',
        'The downloader will save its download record to avoid downloading duplicate files.',
        '下載器會儲存自己的下載記錄，以避免下載重複的檔案。',
    ],
    _策略: ['策略：', 'フィルター：', 'Strategy:', '策略：'],
    _严格: ['严格', '厳格', 'Strict', '嚴格'],
    _宽松: ['宽松', '緩い', 'Loose', '寬鬆'],
    _严格模式说明: [
        '当文件的 id 和文件名都相同时，认为是重复文件',
        'ファイルの ID とファイル名が同じ場合、重複ファイルとみなされます',
        'When the file id and file name are the same, it is considered a duplicate file',
        '當檔案 id 和檔名都相同時，認為是重複檔案',
    ],
    _宽松模式说明: [
        '只要文件的 id 相同，就认为是重复文件',
        'ファイルの ID が同じである限り、重複ファイルと見なされます',
        'As long as the id of the file is the same, it is considered a duplicate file',
        '只要檔案 id 相同，就認為是重複檔案',
    ],
    _清除下载记录: [
        '清除下载记录',
        '履歴をクリア',
        'Clear download record',
        '清除下載記錄',
    ],
    _下载记录已清除: [
        '下载记录已清除',
        'ダウンロード履歴がクリアされました',
        'Download record has been cleared',
        '已清除下載記錄',
    ],
    _跳过下载因为重复文件: [
        '检测到文件 {} 已经下载过，跳过此次下载',
        '重複ファイル {} をスキップ',
        'Skip downloading duplicate files {}',
        '偵測到檔案 {} 已經下載過，跳過此次下載。',
    ],
    _xzNew660: [
        '添加点续传功能；添加不下载重复文件的功能。',
        '「レジューム機能を追加しました；重複ファイルの除外機能を追加しました。',
        'Add breakpoint resume function; add the function not to download duplicate files.',
        '新增断點續傳功能；新增不下載重複檔案的功能。',
    ],
    _保存用户头像为图标: [
        '保存用户头像为图标',
        'プロフィール画像をアイコンとして保存',
        'Save user avatar as icon',
        '將使用者頭像另存為圖示檔案',
    ],
    _保存用户头像为图标说明: [
        '把用户头像保存为 ico 文件，可以手动设置成文件夹的图标。',
        'ユーザーのプロフィール画像を ico ファイルとして保存して、フォルダーアイコンとして設定できます。',
        'Save user avatar as icon',
        '將使用者頭像儲存為 ico 檔案，可以手動設定成資料夾圖示。',
    ],
    _正在保存抓取结果: [
        '正在保存抓取结果',
        'クロール結果を保存しています',
        'Saving crawl results',
        '正在儲存擷取結果',
    ],
    _已保存抓取结果: [
        '已保存抓取结果',
        'クロール結果を保存しました',
        'Crawl results saved',
        '已儲存擷取結果',
    ],
    _正在恢复抓取结果: [
        '正在恢复抓取结果',
        'クロール結果を再開しています',
        'Restoring crawl results',
        '正在還原擷取結果',
    ],
    _已恢复抓取结果: [
        '已恢复抓取结果',
        'クロール結果を再開しました',
        'Crawl results resumed',
        '已還原擷取結果',
    ],
    _清空已保存的抓取结果: [
        '清空已保存的抓取结果',
        'セーブしたクロール結果をクリアします',
        'Clear saved crawl results',
        '清除已儲存的擷取結果',
    ],
    _数据清除完毕: [
        '数据清除完毕',
        'クリアされたデータ',
        'Data cleared',
        '資料清除完畢',
    ],
    _已跳过n个文件: [
        '已跳过 {} 个文件',
        '{} つのファイルをスキップしました',
        '{} files skipped',
        '已跳过 {} 个文件',
    ],
    _不保存图片因为宽高: [
        '{} 没有被保存，因为它的宽高不符合设定。',
        '{} は幅と高さが設定に合わないため、保存されていません。',
        '{} was not saved because its width and height do not match the settings.',
        '{} 並未儲存，因為它的寬高不符合設定。',
    ],
    _显示下载面板: [
        '显示下载面板',
        'ダウンロードパネルを表示',
        'Show download panel',
        '顯示下載面板',
    ],
    _保存: ['保存', '保存', 'save', '儲存'],
    _加载: ['加载', 'ロード', 'load', '載入'],
    _保存命名规则提示: [
        '保存命名规则，最多 {} 个',
        'ネームルールを保存します。最大 {} 個まで',
        'Save naming rule, up to {}',
        '儲存命名規則，最多 {} 個',
    ],
    _已保存命名规则: [
        '已保存命名规则',
        'ネームルールを保存しました',
        'Naming rule saved',
        '已儲存命名規則',
    ],
    _无损: ['无损', 'ロスレス', 'Lossless', '無損'],
    _文件名长度限制: [
        '文件名长度限制',
        'ファイル名の長さ制限',
        'File name length limit',
        '檔案名稱長度限制',
    ],
    _导出csv: [
        '导出 CSV 文件',
        'CSV ファイルをエクスポート',
        'Export CSV file',
        '導出 CSV 文檔',
    ],
};



/***/ }),

/***/ "./src/ts/modules/novel/InitBookmarkNewNovelPage.ts":
/*!**********************************************************!*\
  !*** ./src/ts/modules/novel/InitBookmarkNewNovelPage.ts ***!
  \**********************************************************/
/*! exports provided: InitBookmarkNewNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkNewNovelPage", function() { return InitBookmarkNewNovelPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
// 初始化收藏的新作小说页面









class InitBookmarkNewNovelPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.baseUrl = '';
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_4__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        this.maxCount = 100;
        _Options__WEBPACK_IMPORTED_MODULE_5__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    getWantPage() {
        const check = this.checkWantPageInputGreater0();
        if (check == undefined) {
            return;
        }
        this.crawlNumber = check;
        if (this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_任务开始1', this.crawlNumber.toString()));
    }
    getPageUrl() {
        // 设置起始页面
        const p = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        const url = new URL(window.location.href);
        url.searchParams.set('p', '1');
        this.baseUrl = url.toString();
        // https://www.pixiv.net/novel/bookmark_new.php?p=1
        // https://www.pixiv.net/novel/bookmark_new_r18.php?p=1
    }
    nextStep() {
        this.getPageUrl();
        this.getIdList();
    }
    async getIdList() {
        let p = this.startpageNo + this.listPageFinished;
        let dom;
        try {
            const res = await fetch(this.baseUrl.replace('p=1', 'p=' + p));
            const text = await res.text();
            const parse = new DOMParser();
            dom = parse.parseFromString(text, 'text/html');
        }
        catch (error) {
            this.getIdList();
            return;
        }
        this.listPageFinished++;
        if (dom.querySelector('._no-item')) {
            // 此页没有内容，也就没有后续内容了
            return this.getIdListFinished();
        }
        const NovelItem = dom.querySelectorAll('.novel-items>li');
        // 检查每个作品的信息
        for (const item of NovelItem) {
            // https://www.pixiv.net/novel/show.php?id=12831389
            const link = item.querySelector('.imgbox a').href;
            const id = parseInt(link.split('id=')[1]);
            const bmkEl = item.querySelector('.bookmark-count');
            let bmk = bmkEl ? parseInt(bmkEl.innerText) : 0;
            const tags = [];
            const tagsA = item.querySelectorAll('.tags>li>a');
            for (const a of tagsA) {
                tags.push(a.innerText.trim());
            }
            // 有的作品没有收藏按钮，点进去之后发现这个作品已经被删除了，只是排行榜里没有及时更新。这样的作品没有收藏按钮。
            const bookmarkBtn = item.querySelector('._one-click-bookmark');
            const bookmarked = bookmarkBtn
                ? bookmarkBtn.classList.contains('on')
                : false;
            const filterOpt = {
                id: id,
                illustType: 3,
                tags: tags,
                bookmarkCount: bmk,
                bookmarkData: bookmarked,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                    type: 'novels',
                    id: id.toString(),
                });
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        // 抓取完毕
        if (p >= this.maxCount || this.listPageFinished === this.crawlNumber) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_列表页抓取完成'));
            this.getIdListFinished();
        }
        else {
            // 继续抓取
            this.getIdList();
        }
    }
    resetGetIdListStatus() {
        this.listPageFinished = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/novel/InitNewNovelPage.ts":
/*!**************************************************!*\
  !*** ./src/ts/modules/novel/InitNewNovelPage.ts ***!
  \**************************************************/
/*! exports provided: InitNewNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNewNovelPage", function() { return InitNewNovelPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
// 初始化 大家的新作小说页面









class InitNewNovelPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.option = this.resetOption();
        this.limitMax = 20; // 每次请求的数量最大是 20
        this.fetchCount = 0; // 已请求的作品数量
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_8__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载大家的新作品')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    appendElseEl() { }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
            value: '100',
        });
    }
    getWantPage() {
        const check = this.checkWantPageInputGreater0();
        if (check == undefined) {
            return;
        }
        this.crawlNumber = check;
        if (this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取多少个作品', this.crawlNumber.toString()));
    }
    nextStep() {
        this.initFetchURL();
        this.getIdList();
    }
    resetOption() {
        return {
            lastId: '0',
            limit: '20',
            type: '',
            r18: '',
        };
    }
    // 组织要请求的 url
    initFetchURL() {
        this.option = this.resetOption();
        if (this.crawlNumber < this.limitMax) {
            this.option.limit = this.crawlNumber.toString();
        }
        else {
            this.option.limit = this.limitMax.toString();
        }
        // 是否是 R18 模式
        this.option.r18 = (location.href.includes('_r18.php') || false).toString();
    }
    async getIdList() {
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_5__["API"].getNewNovleData(this.option);
        }
        catch (error) {
            this.getIdList();
            return;
        }
        let useData = data.body.novels;
        for (const nowData of useData) {
            // 抓取够了指定的数量
            if (this.fetchCount + 1 > this.crawlNumber) {
                break;
            }
            else {
                this.fetchCount++;
            }
            const filterOpt = {
                id: nowData.id,
                bookmarkData: nowData.bookmarkData,
                bookmarkCount: nowData.bookmarkCount,
                illustType: 3,
                tags: nowData.tags,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_4__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                    type: 'novels',
                    id: nowData.id,
                });
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_新作品进度', this.fetchCount.toString()), 1, false);
        // 抓取完毕
        if (this.fetchCount >= this.crawlNumber ||
            this.fetchCount >= this.maxCount) {
            _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始获取作品页面'));
            this.getIdListFinished();
            return;
        }
        // 继续抓取
        this.option.lastId = data.body.lastId;
        this.getIdList();
    }
    resetGetIdListStatus() {
        this.fetchCount = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/novel/InitNovelPage.ts":
/*!***********************************************!*\
  !*** ./src/ts/modules/novel/InitNovelPage.ts ***!
  \***********************************************/
/*! exports provided: InitNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNovelPage", function() { return InitNovelPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _QuickBookmark__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../QuickBookmark */ "./src/ts/modules/QuickBookmark.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _States__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../States */ "./src/ts/modules/States.ts");
/* harmony import */ var _QuickDownloadBtn__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../QuickDownloadBtn */ "./src/ts/modules/QuickDownloadBtn.ts");
/* harmony import */ var _SaveAvatarIcon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../SaveAvatarIcon */ "./src/ts/modules/SaveAvatarIcon.ts");
//初始化小说作品页













class InitNovelPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.quickDownBtn = document.createElement('button');
        this.crawlDirection = 0; // 抓取方向，指示抓取新作品还是旧作品
        this.startQuickDownload = () => {
            this.readyCrawl();
        };
        this.init();
    }
    /*
    -1 抓取新作品
    0 不设置抓取方向
    1 抓取旧作品
    */
    initElse() {
        this.initQuickBookmark();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.pageSwitchedTypeNotChange, this.initQuickBookmark);
        // 初始化快速下载按钮
        new _QuickDownloadBtn__WEBPACK_IMPORTED_MODULE_11__["QuickDownloadBtn"]();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.QuickDownload, this.startQuickDownload);
    }
    initQuickBookmark() {
        new _QuickBookmark__WEBPACK_IMPORTED_MODULE_5__["QuickBookmark"]();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_6__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取new')).addEventListener('click', () => {
            this.crawlDirection = -1;
            this.readyCrawl();
        });
        _DOM__WEBPACK_IMPORTED_MODULE_6__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取old')).addEventListener('click', () => {
            this.crawlDirection = 1;
            this.readyCrawl();
        });
        _DOM__WEBPACK_IMPORTED_MODULE_6__["DOM"].addBtn('otherBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户头像为图标'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户头像为图标说明')],
        ]).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.saveAvatarIcon);
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示') +
                '<br>' +
                _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_相关作品大于0'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
            value: '-1',
        });
    }
    destroy() {
        _DOM__WEBPACK_IMPORTED_MODULE_6__["DOM"].clearSlot('crawlBtns');
        _DOM__WEBPACK_IMPORTED_MODULE_6__["DOM"].clearSlot('otherBtns');
        // 删除快速下载按钮
        _DOM__WEBPACK_IMPORTED_MODULE_6__["DOM"].removeEl(this.quickDownBtn);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.pageSwitchedTypeNotChange, this.initQuickBookmark);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_9__["EVT"].events.QuickDownload, this.startQuickDownload);
    }
    getWantPage() {
        if (_States__WEBPACK_IMPORTED_MODULE_10__["states"].quickDownload) {
            // 快速下载
            this.crawlNumber = 1;
        }
        else {
            // 检查下载页数的设置
            const crawlAllTip = this.crawlDirection === -1
                ? _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取new')
                : _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取old');
            this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x个作品'), crawlAllTip);
        }
    }
    nextStep() {
        if (_States__WEBPACK_IMPORTED_MODULE_10__["states"].quickDownload) {
            // 快速下载
            _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.push({
                type: 'novels',
                id: _API__WEBPACK_IMPORTED_MODULE_7__["API"].getNovelId(window.location.href),
            });
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始获取作品页面'));
            this.getIdListFinished();
        }
        else {
            // 向前向后下载
            this.getIdList();
        }
    }
    async getIdList() {
        let type = ['novels'];
        let idList = await _API__WEBPACK_IMPORTED_MODULE_7__["API"].getUserWorksByType(_DOM__WEBPACK_IMPORTED_MODULE_6__["DOM"].getUserId(), type);
        // 储存符合条件的 id
        let nowId = parseInt(_API__WEBPACK_IMPORTED_MODULE_7__["API"].getIllustId(window.location.href));
        idList.forEach((id) => {
            let idNum = parseInt(id.id);
            // 新作品
            if (idNum >= nowId && this.crawlDirection === -1) {
                _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.push(id);
            }
            else if (idNum <= nowId && this.crawlDirection === 1) {
                // 旧作品
                _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.push(id);
            }
        });
        // 当设置了下载个数时，进行裁剪
        if (this.crawlNumber !== -1) {
            // 新作品 升序排列
            if (this.crawlDirection === -1) {
                _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.sort(_API__WEBPACK_IMPORTED_MODULE_7__["API"].sortByProperty('id')).reverse();
            }
            else {
                // 旧作品 降序排列
                _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.sort(_API__WEBPACK_IMPORTED_MODULE_7__["API"].sortByProperty('id'));
            }
            _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList = _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.splice(0, this.crawlNumber);
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.crawlDirection = 0; // 解除下载方向的标记
    }
}



/***/ }),

/***/ "./src/ts/modules/novel/InitNovelSeriesPage.ts":
/*!*****************************************************!*\
  !*** ./src/ts/modules/novel/InitNovelSeriesPage.ts ***!
  \*****************************************************/
/*! exports provided: InitNovelSeriesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNovelSeriesPage", function() { return InitNovelSeriesPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
//初始化小说系列作品页面







class InitNovelSeriesPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.seriesId = '';
        this.limit = 30;
        this.last = 0;
        this.init();
    }
    initElse() { }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_5__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取系列小说')).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    appendElseEl() { }
    setFormOption() {
        // 隐藏“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].hideOption([1]);
    }
    getWantPage() { }
    nextStep() {
        this.seriesId = _API__WEBPACK_IMPORTED_MODULE_6__["API"].getURLPathField('series');
        this.getIdList();
    }
    async getIdList() {
        const seriesData = await _API__WEBPACK_IMPORTED_MODULE_6__["API"].getNovelSeriesData(this.seriesId, this.limit, this.last, 'asc');
        const list = seriesData.body.seriesContents;
        for (const item of list) {
            _Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.push({
                type: 'novels',
                id: item.id,
            });
        }
        this.last += list.length;
        // 如果这一次返回的作品数量达到了每批限制，可能这次没有请求完，继续请求后续的数据
        if (list.length === this.limit) {
            this.getIdList();
        }
        else {
            this.getIdListFinished();
        }
    }
    resetGetIdListStatus() {
        this.seriesId = '';
        this.last = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/novel/InitRankingNovelPage.ts":
/*!******************************************************!*\
  !*** ./src/ts/modules/novel/InitRankingNovelPage.ts ***!
  \******************************************************/
/*! exports provided: InitRankingNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitRankingNovelPage", function() { return InitRankingNovelPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
// 初始化小说排行榜页面








class InitRankingNovelPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.pageUrlList = [];
        this.init();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_3__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].blue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本排行榜作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本排行榜作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        // 设置“个数/页数”选项
        this.maxCount = 100;
        _Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    getWantPage() {
        // 检查下载页数的设置
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载排行榜前x个作品'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_向下获取所有作品'));
        // 如果设置的作品个数是 -1，则设置为下载所有作品
        if (this.crawlNumber === -1) {
            this.crawlNumber = this.maxCount;
        }
    }
    getPageUrl() {
        const ul = document.querySelector('.ui-selectbox-container ul');
        if (ul) {
            const li = ul.querySelectorAll('li');
            this.maxCount = li.length * 50;
            for (const el of li) {
                this.pageUrlList.push(el.dataset.url);
            }
        }
        else {
            // 只有一页的话，没有页码部分的 ul li
            this.pageUrlList.push(location.href);
        }
    }
    nextStep() {
        this.getPageUrl();
        this.getIdList();
    }
    async getIdList() {
        let dom;
        try {
            const res = await fetch(this.pageUrlList[this.listPageFinished]);
            const text = await res.text();
            const parse = new DOMParser();
            dom = parse.parseFromString(text, 'text/html');
        }
        catch (error) {
            this.getIdList();
            return;
        }
        this.listPageFinished++;
        const rankingItem = dom.querySelectorAll('._ranking-items>div');
        // 检查每个作品的信息
        for (const item of rankingItem) {
            const rank = parseInt(item.querySelector('h1').innerText);
            // 检查是否已经抓取到了指定数量的作品
            if (rank > this.crawlNumber) {
                return this.getIdListFinished();
            }
            // https://www.pixiv.net/novel/show.php?id=12831389
            const link = item.querySelector('.imgbox a').href;
            const id = parseInt(link.split('id=')[1]);
            const bmkEl = item.querySelector('.bookmark-count');
            let bmk = bmkEl ? parseInt(bmkEl.innerText) : 0;
            const tags = [];
            const tagsA = item.querySelectorAll('.tags>li>a');
            for (const a of tagsA) {
                tags.push(a.innerText.trim());
            }
            // 有的作品没有收藏按钮，点进去之后发现这个作品已经被删除了，只是排行榜里没有及时更新。这样的作品没有收藏按钮。
            const bookmarkBtn = item.querySelector('._one-click-bookmark');
            const bookmarked = bookmarkBtn
                ? bookmarkBtn.classList.contains('on')
                : false;
            const filterOpt = {
                id: id,
                illustType: 3,
                tags: tags,
                bookmarkCount: bmk,
                bookmarkData: bookmarked,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_6__["store"].setRankList(id.toString(), rank.toString());
                _Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                    type: 'novels',
                    id: id.toString(),
                });
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_排行榜进度', this.listPageFinished.toString()), 1, false);
        // 抓取完毕
        if (_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.length >= this.crawlNumber ||
            this.listPageFinished === this.pageUrlList.length) {
            this.getIdListFinished();
        }
        else {
            // 继续抓取
            this.getIdList();
        }
    }
    resetGetIdListStatus() {
        this.pageUrlList = [];
        this.listPageFinished = 0;
    }
}



/***/ }),

/***/ "./src/ts/modules/novel/InitSearchNovelPage.ts":
/*!*****************************************************!*\
  !*** ./src/ts/modules/novel/InitSearchNovelPage.ts ***!
  \*****************************************************/
/*! exports provided: InitSearchNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitSearchNovelPage", function() { return InitSearchNovelPage; });
/* harmony import */ var _InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitPageBase */ "./src/ts/modules/InitPageBase.ts");
/* harmony import */ var _Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Colors */ "./src/ts/modules/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/modules/Lang.ts");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Options */ "./src/ts/modules/Options.ts");
/* harmony import */ var _PageInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../PageInfo */ "./src/ts/modules/PageInfo.ts");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/modules/Log.ts");
/* harmony import */ var _FastScreen__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../FastScreen */ "./src/ts/modules/FastScreen.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../BookmarkAllWorks */ "./src/ts/modules/BookmarkAllWorks.ts");
// 初始化小说搜索页












class InitSearchNovelPage extends _InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.worksWrapSelector = '#root section>div>ul';
        this.option = {};
        this.worksNoPerPage = 24; // 每个页面有多少个作品
        this.needCrawlPageCount = 0; // 一共有有多少个列表页面
        this.sendCrawlTaskCount = 0; // 已经抓取了多少个列表页面
        this.allOption = [
            'order',
            'type',
            'wlt',
            'wgt',
            'hlt',
            'hgt',
            'ratio',
            'tool',
            's_mode',
            'mode',
            'scd',
            'ecd',
            'blt',
            'bgt',
            'tgt',
            'original_only',
        ];
        this.init();
    }
    initElse() {
        new _FastScreen__WEBPACK_IMPORTED_MODULE_9__["FastScreen"]();
    }
    appendCenterBtns() {
        _DOM__WEBPACK_IMPORTED_MODULE_10__["DOM"].addBtn('crawlBtns', _Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].green, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    getWorksWrap() {
        const test = document.querySelectorAll(this.worksWrapSelector);
        if (test.length > 0) {
            // 小说页面用这个选择器，只匹配到了一个 ul
            return test[test.length - 1];
        }
        return null;
    }
    appendElseEl() {
        // 添加收藏本页所有作品的功能
        const bookmarkAll = new _BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_11__["BookmarkAllWorks"]();
        bookmarkAll.btn.addEventListener('click', () => {
            const listWrap = this.getWorksWrap();
            if (listWrap) {
                const list = document.querySelectorAll('#root section>div>ul>li');
                const showList = Array.from(list).filter((el) => {
                    return el.style.display !== 'none';
                });
                bookmarkAll.setWorkList(showList);
            }
        });
    }
    setFormOption() {
        this.maxCount = 1000;
        // 设置“个数/页数”选项
        _Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPage({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: `1 - ${this.maxCount}`,
            value: this.maxCount.toString(),
        });
    }
    async nextStep() {
        this.initFetchURL();
        this.needCrawlPageCount = await this.calcNeedCrawlPageCount();
        if (this.needCrawlPageCount === 0) {
            return this.noResult();
        }
        this.startGetIdList();
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
        if (this.crawlNumber === -1 || this.crawlNumber > this.maxCount) {
            this.crawlNumber = this.maxCount;
        }
    }
    // 获取搜索页的数据。因为有多处使用，所以进行了封装
    async getSearchData(p) {
        let data = await _API__WEBPACK_IMPORTED_MODULE_6__["API"].getNovelSearchData(_PageInfo__WEBPACK_IMPORTED_MODULE_4__["pageInfo"].tag, p, this.option);
        return data.body.novel;
    }
    // 组织要请求的 url 中的参数
    initFetchURL() {
        let p = _API__WEBPACK_IMPORTED_MODULE_6__["API"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        // 从页面 url 中获取可以使用的选项
        this.option = {};
        this.allOption.forEach((param) => {
            let value = _API__WEBPACK_IMPORTED_MODULE_6__["API"].getURLSearchField(location.href, param);
            if (value !== '') {
                this.option[param] = value;
            }
        });
        // 如果没有指定搜索模式，则是精确匹配标签，设置对应的值
        if (this.option.s_mode === undefined) {
            this.option.s_mode = 's_tag_full';
        }
    }
    // 计算应该抓取多少页
    async calcNeedCrawlPageCount() {
        let data = await this.getSearchData(1);
        // 计算总页数
        let pageCount = Math.ceil(data.total / this.worksNoPerPage);
        if (pageCount > this.maxCount) {
            // 最大为 1000
            pageCount = this.maxCount;
        }
        // 计算从本页开始抓取的话，有多少页
        let needFetchPage = pageCount - this.startpageNo + 1;
        // 比较用户设置的页数，取较小的那个数值
        if (needFetchPage < this.crawlNumber) {
            return needFetchPage;
        }
        else {
            return this.crawlNumber;
        }
    }
    // 计算页数之后，准备建立并发抓取线程
    startGetIdList() {
        if (this.needCrawlPageCount <= this.ajaxThreadsDefault) {
            this.ajaxThreads = this.needCrawlPageCount;
        }
        else {
            this.ajaxThreads = this.ajaxThreadsDefault;
        }
        for (let i = 0; i < this.ajaxThreads; i++) {
            this.getIdList();
        }
    }
    async getIdList() {
        let p = this.startpageNo + this.sendCrawlTaskCount;
        this.sendCrawlTaskCount++;
        // 发起请求，获取列表页
        let data;
        try {
            data = await this.getSearchData(p);
        }
        catch (_a) {
            this.getIdList();
            return;
        }
        data = data.data;
        for (const nowData of data) {
            const filterOpt = {
                id: nowData.id,
                bookmarkData: nowData.bookmarkData,
                bookmarkCount: nowData.bookmarkCount,
                illustType: 3,
                tags: nowData.tags,
            };
            if (await _Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                _Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                    type: 'novels',
                    id: nowData.id,
                });
            }
        }
        this.listPageFinished++;
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
            // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
            this.getIdList();
        }
        else {
            // 抓取任务已经全部发送
            if (this.listPageFinished === this.needCrawlPageCount) {
                // 抓取任务全部完成
                _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取完成'));
                this.getIdListFinished();
            }
        }
    }
    resetGetIdListStatus() {
        this.listPageFinished = 0;
        this.sendCrawlTaskCount = 0;
    }
    // 搜索页把下载任务按收藏数从高到低下载
    sortResult() {
        _Store__WEBPACK_IMPORTED_MODULE_7__["store"].resultMeta.sort(_API__WEBPACK_IMPORTED_MODULE_6__["API"].sortByProperty('bmk'));
        _Store__WEBPACK_IMPORTED_MODULE_7__["store"].result.sort(_API__WEBPACK_IMPORTED_MODULE_6__["API"].sortByProperty('bmk'));
    }
}



/***/ }),

/***/ "./src/ts/modules/novel/MakeEPUB.ts":
/*!******************************************!*\
  !*** ./src/ts/modules/novel/MakeEPUB.ts ***!
  \******************************************/
/*! exports provided: makeEPUB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeEPUB", function() { return makeEPUB; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../API */ "./src/ts/modules/API.ts");

class MakeEPUB {
    constructor() { }
    // epub 内部会使用标题 title 建立一个文件夹，把一些文件存放进去，所以这里要替换掉标题的特殊字符，特殊字符会导致这个文件夹名被截断，结果就是这个 epub 文件无法被解析。
    make(data, content = '') {
        return new Promise((resolve, reject) => {
            content = content.replace(/\n/g, '<br/>');
            new EpubMaker()
                .withTemplate('idpf-wasteland')
                .withAuthor(_API__WEBPACK_IMPORTED_MODULE_0__["API"].replaceUnsafeStr(data.body.userName))
                .withModificationDate(new Date(data.body.createDate))
                .withRights({
                description: data.body.description,
                license: '',
            })
                .withAttributionUrl(`https://www.pixiv.net/novel/show.php?id=${data.body.id}`)
                .withCover(data.body.coverUrl, {
                license: '',
                attributionUrl: '',
            })
                .withTitle(_API__WEBPACK_IMPORTED_MODULE_0__["API"].replaceUnsafeStr(data.body.title))
                .withSection(new EpubMaker.Section('1', null, { content: content }, false, true))
                .makeEpub()
                .then((blob) => {
                resolve(blob);
            });
        });
    }
}
const makeEPUB = new MakeEPUB();



/***/ }),

/***/ "./src/ts/modules/novel/MakeNovelFile.ts":
/*!***********************************************!*\
  !*** ./src/ts/modules/novel/MakeNovelFile.ts ***!
  \***********************************************/
/*! exports provided: MakeNovelFile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MakeNovelFile", function() { return MakeNovelFile; });
/* harmony import */ var _MakeEPUB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MakeEPUB */ "./src/ts/modules/novel/MakeEPUB.ts");

class MakeNovelFile {
    static async makeEPUB(novelData, text) {
        return _MakeEPUB__WEBPACK_IMPORTED_MODULE_0__["makeEPUB"].make(novelData, text);
    }
    static makeTXT(content) {
        // 替换换行标签，移除 html 标签
        content = content.replace(/<br \/>/g, '\n').replace(/<\/?.+?>/g, '');
        return new Blob([content], {
            type: 'text/plain',
        });
    }
}



/***/ }),

/***/ "./src/ts/modules/novel/SaveNovelData.ts":
/*!***********************************************!*\
  !*** ./src/ts/modules/novel/SaveNovelData.ts ***!
  \***********************************************/
/*! exports provided: saveNovelData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveNovelData", function() { return saveNovelData; });
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Filter */ "./src/ts/modules/Filter.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Store */ "./src/ts/modules/Store.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Settings */ "./src/ts/modules/Settings.ts");
/* harmony import */ var _MakeNovelFile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MakeNovelFile */ "./src/ts/modules/novel/MakeNovelFile.ts");




// 保存单个小说作品的数据
class SaveNovelData {
    async save(data) {
        // 小说没有 illustType 属性， 把小说的 illustType 设置为 3，这是为了方便检查
        const illustType = 3;
        // 获取需要检查的信息
        const body = data.body;
        const bmk = body.bookmarkCount; // 收藏数
        const tagArr = body.tags.tags; // 取出 tag 信息
        const tags = []; // 保存 tag 列表
        // 小说的标签没有进行翻译，所以没有翻译后的标签
        for (const tagData of tagArr) {
            tags.push(tagData.tag);
        }
        const filterOpt = {
            createDate: body.createDate,
            id: body.id,
            illustType: illustType,
            tags: tags,
            bookmarkCount: bmk,
            bookmarkData: body.bookmarkData,
        };
        // 检查通过
        if (await _Filter__WEBPACK_IMPORTED_MODULE_0__["filter"].check(filterOpt)) {
            const id = body.id;
            const idNum = parseInt(id);
            const title = body.title;
            const userid = body.userId;
            const user = body.userName;
            const bookmarked = !!body.bookmarkData;
            // 时间原数据如 "2019-12-18T22:23:37+00:00"
            // 网页上显示的日期是转换成了本地时间的，如北京时区显示为 "2019-12-19"，不是显示原始日期 "2019-12-18"。所以这里转换成本地时区的日期，和网页上保持一致，以免用户困惑。
            const date0 = new Date(body.createDate);
            const y = date0.getFullYear();
            const m = (date0.getMonth() + 1).toString().padStart(2, '0');
            const d = date0.getDate().toString().padStart(2, '0');
            const date = `${y}-${m}-${d}`;
            // 保存作品在排行榜上的编号
            let rank = '';
            let testRank = _Store__WEBPACK_IMPORTED_MODULE_1__["store"].getRankList(body.id);
            if (testRank !== undefined) {
                rank = '#' + testRank;
            }
            let seriesTitle = body.seriesNavData ? body.seriesNavData.title : '';
            let seriesOrder = body.seriesNavData ? '#' + body.seriesNavData.order : '';
            let ext = _Settings__WEBPACK_IMPORTED_MODULE_2__["form"].novelSaveAs.value;
            let metaArr = [];
            let meta = '';
            if (_Settings__WEBPACK_IMPORTED_MODULE_2__["form"].saveNovelMeta.checked) {
                const pageUrl = `https://www.pixiv.net/novel/show.php?id=${id}`;
                const tagsA = [];
                for (const tag of tags) {
                    tagsA.push('#' + tag);
                }
                metaArr.push(title, user, pageUrl, body.description, tagsA.join('\n'));
                meta = metaArr.join('\n\n') + '\n\n\n';
            }
            let content = this.replaceFlag(meta + body.content);
            let blob;
            if (ext === 'txt') {
                blob = _MakeNovelFile__WEBPACK_IMPORTED_MODULE_3__["MakeNovelFile"].makeTXT(content);
            }
            else {
                // 创建 epub 文件，如果失败则回滚到 txt
                try {
                    blob = await _MakeNovelFile__WEBPACK_IMPORTED_MODULE_3__["MakeNovelFile"].makeEPUB(data, content);
                }
                catch (_a) {
                    ext = 'txt';
                    blob = _MakeNovelFile__WEBPACK_IMPORTED_MODULE_3__["MakeNovelFile"].makeTXT(content);
                }
            }
            const url = URL.createObjectURL(blob);
            // 添加作品信息
            _Store__WEBPACK_IMPORTED_MODULE_1__["store"].addResult({
                id: id,
                idNum: idNum,
                thumb: body.coverUrl || undefined,
                dlCount: 1,
                url: url,
                title: title,
                tags: tags,
                tagsWithTransl: tags,
                tagsTranslOnly: tags,
                user: user,
                userId: userid,
                ext: ext,
                bmk: bmk,
                bookmarked: bookmarked,
                date: date,
                type: illustType,
                rank: rank,
                seriesTitle: seriesTitle,
                seriesOrder: seriesOrder,
                novelBlob: blob,
            });
        }
    }
    // '[[jumpuri:予約ページ>https://www.amazon.co.jp/dp/4758092486]]'
    // 替换成
    // '予約ページ（https://www.amazon.co.jp/dp/4758092486）'
    replaceJumpuri(str) {
        let reg = /\[\[jumpuri:(.*?)>(.*?)\]\]/g;
        let temp;
        while ((temp = reg.exec(str))) {
            str = str.replace(temp[0], `${temp[1].trim()}（${temp[2].trim()}）`);
            reg.lastIndex = 0;
        }
        return str;
    }
    // > '[[rb:莉莉丝 > Lilith]]'
    // 替换成
    // '莉莉丝（Lilith）'
    replaceRb(str) {
        let reg = /\[\[rb:(.*?)>(.*?)\]\]/g;
        let temp;
        while ((temp = reg.exec(str))) {
            str = str.replace(temp[0], `${temp[1].trim()}（${temp[2].trim()}）`);
            reg.lastIndex = 0;
        }
        return str;
    }
    // > '[chapter:标题]'
    // 替换成
    // '标题'
    replaceChapter(str) {
        const reg = /\[chapter:(.*?)\]/g;
        let temp;
        while ((temp = reg.exec(str))) {
            str = str.replace(temp[0], temp[1]);
            reg.lastIndex = 0;
        }
        return str;
    }
    // > [pixivimage:70551567]
    // 替换成
    // [pixiv image link: <a href="http://pixiv.net/i/70551567" target="_blank">http://pixiv.net/i/70551567</a>]
    replacePixivImage(str) {
        let reg = /\[pixivimage:(.*?)\]/g;
        let temp;
        while ((temp = reg.exec(str))) {
            const url = `http://pixiv.net/i/${temp[1].trim()}`;
            str = str.replace(temp[0], `[pixiv image link: <a href="${url}" target="_blank">${url}</a>]`);
            reg.lastIndex = 0;
        }
        return str;
    }
    // 对小说里的一些标记进行替换
    replaceFlag(str) {
        str = str.replace(/\[newpage\]/g, '');
        str = this.replaceJumpuri(str);
        str = str.replace(/\[jump:.*?\]/g, '');
        str = this.replaceRb(str);
        str = this.replaceChapter(str);
        str = this.replacePixivImage(str);
        return str;
    }
}
const saveNovelData = new SaveNovelData();



/***/ }),

/***/ "./src/ts/modules/ugoira/ConvertUgoira.ts":
/*!************************************************!*\
  !*** ./src/ts/modules/ugoira/ConvertUgoira.ts ***!
  \************************************************/
/*! exports provided: converter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "converter", function() { return converter; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");
/* harmony import */ var _ToWebM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ToWebM */ "./src/ts/modules/ugoira/ToWebM.ts");
/* harmony import */ var _ToGIF__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ToGIF */ "./src/ts/modules/ugoira/ToGIF.ts");
/* harmony import */ var _ToAPNG__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ToAPNG */ "./src/ts/modules/ugoira/ToAPNG.ts");




// 控制动图转换
class ConvertUgoira {
    constructor() {
        this.downloading = true; // 是否在下载。如果下载停止了则不继续转换后续任务，避免浪费资源
        this._count = 0; // 统计有几个转换任务
        this.maxCount = 1; // 允许同时运行多少个转换任务
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStart, () => {
            this.downloading = true;
        });
        [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadPause, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.downloadStop].forEach((event) => {
            window.addEventListener(event, () => {
                this.downloading = false;
            });
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'convertUgoiraThread') {
                this.maxCount = parseInt(data.value) || 1;
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.convertSuccess, () => {
            this.complete();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.convertError, () => {
            this.complete();
        });
    }
    set count(num) {
        this._count = num;
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.convertChange, this._count);
    }
    async start(file, info, type) {
        return new Promise(async (resolve, reject) => {
            const t = window.setInterval(async () => {
                if (this._count < this.maxCount) {
                    window.clearInterval(t);
                    if (!this.downloading) {
                        return;
                    }
                    this.count = this._count + 1;
                    if (type === 'gif') {
                        resolve(_ToGIF__WEBPACK_IMPORTED_MODULE_2__["toGIF"].convert(file, info));
                    }
                    else if (type === 'png') {
                        resolve(_ToAPNG__WEBPACK_IMPORTED_MODULE_3__["toAPNG"].convert(file, info));
                    }
                    else {
                        // 如果没有 type 则默认使用 webm
                        resolve(_ToWebM__WEBPACK_IMPORTED_MODULE_1__["toWebM"].convert(file, info));
                    }
                }
            }, 200);
        });
    }
    complete() {
        this.count = this._count - 1;
    }
    // 转换成 WebM
    async webm(file, info) {
        return await this.start(file, info, 'webm');
    }
    // 转换成 GIF
    async gif(file, info) {
        return await this.start(file, info, 'gif');
    }
    // 转换成 APNG
    async apng(file, info) {
        return await this.start(file, info, 'png');
    }
}
const converter = new ConvertUgoira();



/***/ }),

/***/ "./src/ts/modules/ugoira/ExtractImage.ts":
/*!***********************************************!*\
  !*** ./src/ts/modules/ugoira/ExtractImage.ts ***!
  \***********************************************/
/*! exports provided: extractImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractImage", function() { return extractImage; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");

// 从 zip 提取图片数据
class ExtractImage {
    constructor() {
        this.loadWorkerJS();
    }
    async loadWorkerJS() {
        if ('zip' in window === false) {
            return;
        }
        // 添加 zip 的 worker 文件
        let zipWorker = await fetch(chrome.extension.getURL('lib/z-worker.js'));
        const zipWorkerBolb = await zipWorker.blob();
        const zipWorkerUrl = URL.createObjectURL(zipWorkerBolb);
        zip.workerScripts = {
            inflater: [zipWorkerUrl],
        };
    }
    // 解压 zip 文件，把里面的图片转换成 DataURL
    async extractImageAsDataURL(zipFile, ugoiraInfo) {
        return new Promise(function (resolve, reject) {
            zip.createReader(new zip.BlobReader(zipFile), (zipReader) => {
                // 读取成功时的回调函数，files 保存了文件列表的信息
                zipReader.getEntries((files) => {
                    // 创建数组，长度与文件数量一致
                    const imgFile = new Array(files.length);
                    // 获取每个文件的数据。因为这个操作是异步的，所以必须检查图片数量
                    files.forEach((file) => {
                        file.getData(new zip.Data64URIWriter(ugoiraInfo.mime_type), (data) => {
                            const fileNo = parseInt(file.filename);
                            imgFile[fileNo] = data;
                            // 把图片按原编号存入对应的位置。这是因为我怀疑有时候 zip.Data64URIWriter 的回调顺序不一致，直接 push 可能导致图片的顺序乱掉
                            for (let i = 0; i < imgFile.length; i++) {
                                // 检测到空值说明没有添加完毕，退出循环
                                if (!imgFile[i]) {
                                    break;
                                }
                                // 如果检查到最后一项，说明添加完毕
                                if (i === imgFile.length - 1) {
                                    resolve(imgFile);
                                }
                            }
                        });
                    });
                });
            }, (message) => {
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].events.convertError);
                reject(new Error('ReadZIP error: ' + message));
            });
        });
    }
}
const extractImage = new ExtractImage();



/***/ }),

/***/ "./src/ts/modules/ugoira/ToAPNG.ts":
/*!*****************************************!*\
  !*** ./src/ts/modules/ugoira/ToAPNG.ts ***!
  \*****************************************/
/*! exports provided: toAPNG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toAPNG", function() { return toAPNG; });
/* harmony import */ var _ExtractImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtractImage */ "./src/ts/modules/ugoira/ExtractImage.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");



class ToAPNG {
    async convert(file, info) {
        return new Promise(async (resolve, reject) => {
            // 获取解压后的图片数据
            let base64Arr = await _ExtractImage__WEBPACK_IMPORTED_MODULE_0__["extractImage"]
                .extractImageAsDataURL(file, info)
                .catch(() => {
                reject(new Error('Start error'));
            });
            if (!base64Arr) {
                return;
            }
            // 每一帧的数据
            let arrayBuffList = await this.getFrameData(base64Arr);
            // 延迟数据
            const delayList = [];
            for (const d of info.frames) {
                delayList.push(d.delay);
            }
            // 获取宽高
            const img = await _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].loadImg(base64Arr[0]);
            // 编码
            const png = UPNG.encode(arrayBuffList, img.width, img.height, 0, delayList);
            base64Arr = null;
            arrayBuffList = null;
            const blob = new Blob([png], {
                type: 'image/vnd.mozilla.apng',
            });
            _EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.convertSuccess);
            resolve(blob);
        });
    }
    // 获取每一帧的数据，传递给编码器使用
    async getFrameData(imgFile) {
        const resultList = [];
        return new Promise(async (resolve, reject) => {
            for (const base64 of imgFile) {
                const img = await _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].loadImg(base64);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const buff = ctx.getImageData(0, 0, img.width, img.height).data.buffer;
                resultList.push(buff);
            }
            resolve(resultList);
        });
    }
}
const toAPNG = new ToAPNG();



/***/ }),

/***/ "./src/ts/modules/ugoira/ToGIF.ts":
/*!****************************************!*\
  !*** ./src/ts/modules/ugoira/ToGIF.ts ***!
  \****************************************/
/*! exports provided: toGIF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toGIF", function() { return toGIF; });
/* harmony import */ var _ExtractImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtractImage */ "./src/ts/modules/ugoira/ExtractImage.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");



class ToGIF {
    constructor() {
        this.gifWorkerUrl = '';
        this.loadWorkerJS();
    }
    async loadWorkerJS() {
        // 添加 gif 的 worker 文件
        let gifWorker = await fetch(chrome.extension.getURL('lib/gif.worker.js'));
        const gifWorkerBolb = await gifWorker.blob();
        this.gifWorkerUrl = URL.createObjectURL(gifWorkerBolb);
    }
    // 转换成 GIF
    async convert(file, info) {
        return new Promise(async (resolve, reject) => {
            // 配置 gif.js
            let gif = new GIF({
                workers: 4,
                quality: 10,
                workerScript: this.gifWorkerUrl,
            });
            // 绑定渲染完成事件
            gif.on('finished', (file) => {
                _EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.convertSuccess);
                resolve(file);
            });
            // 获取解压后的图片数据
            let base64Arr = await _ExtractImage__WEBPACK_IMPORTED_MODULE_0__["extractImage"]
                .extractImageAsDataURL(file, info)
                .catch(() => {
                reject(new Error('Start error'));
            });
            if (!base64Arr) {
                return;
            }
            // 生成每一帧的数据
            let imgList = await this.getFrameData(base64Arr);
            // 添加帧数据
            for (let index = 0; index < imgList.length; index++) {
                gif.addFrame(imgList[index], {
                    delay: info.frames[index].delay,
                });
            }
            base64Arr = null;
            imgList = null;
            // 渲染 gif
            gif.render();
        });
    }
    // 添加每一帧的数据
    async getFrameData(imgFile) {
        const resultList = [];
        return new Promise(async (resolve, reject) => {
            for (const base64 of imgFile) {
                const img = await _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].loadImg(base64);
                resultList.push(img);
            }
            resolve(resultList);
        });
    }
}
const toGIF = new ToGIF();



/***/ }),

/***/ "./src/ts/modules/ugoira/ToWebM.ts":
/*!*****************************************!*\
  !*** ./src/ts/modules/ugoira/ToWebM.ts ***!
  \*****************************************/
/*! exports provided: toWebM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toWebM", function() { return toWebM; });
/* harmony import */ var _ExtractImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtractImage */ "./src/ts/modules/ugoira/ExtractImage.ts");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DOM */ "./src/ts/modules/DOM.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../EVT */ "./src/ts/modules/EVT.ts");



class ToWebM {
    async convert(file, info) {
        return new Promise(async (resolve, reject) => {
            // 创建视频编码器
            const encoder = new Whammy.Video();
            // 获取解压后的图片数据
            let base64Arr = await _ExtractImage__WEBPACK_IMPORTED_MODULE_0__["extractImage"]
                .extractImageAsDataURL(file, info)
                .catch(() => {
                reject(new Error('Start error'));
            });
            if (!base64Arr) {
                return;
            }
            // 生成每一帧的数据
            let canvasList = await this.getFrameData(base64Arr);
            // 添加帧数据
            for (let index = 0; index < canvasList.length; index++) {
                encoder.add(canvasList[index], info.frames[index].delay);
            }
            base64Arr = null;
            canvasList = null;
            // 获取生成的视频
            file = await this.encodeVideo(encoder);
            _EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].fire(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].events.convertSuccess);
            resolve(file);
        });
    }
    // 获取每一帧的数据，传递给编码器使用
    async getFrameData(imgFile) {
        const resultList = [];
        return new Promise(async (resolve, reject) => {
            for (const base64 of imgFile) {
                const img = await _DOM__WEBPACK_IMPORTED_MODULE_1__["DOM"].loadImg(base64);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resultList.push(canvas);
            }
            resolve(resultList);
        });
    }
    // 编码视频
    async encodeVideo(encoder) {
        return new Promise(function (resolve, reject) {
            encoder.compile(false, function (video) {
                resolve(video);
            });
        });
    }
}
const toWebM = new ToWebM();



/***/ })

/******/ });
//# sourceMappingURL=content.js.map