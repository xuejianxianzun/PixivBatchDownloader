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

/***/ "./src/ts/API.ts":
/*!***********************!*\
  !*** ./src/ts/API.ts ***!
  \***********************/
/*! exports provided: API */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API", function() { return API; });
class API {
    // 发送 get 请求，返回 json 数据，抛出异常
    static sendGetRequest(url) {
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
                    // 请求成功但状态不对
                    reject({
                        status: response.status,
                        statusText: response.statusText,
                    });
                    switch (response.status) {
                        case 400:
                            return console.error('Status Code: 400（Bad Request）。服务器无法理解此请求');
                        case 401:
                            return console.error('Status Code: 401（Unauthorized）。您可能需要登录 Pixiv 账号');
                        case 403:
                            return console.error('Status Code: 403（Forbidden）。服务器拒绝了这个请求');
                        case 404:
                            return console.error('Status Code: 404（Not Found）。服务器找不到请求的资源');
                        case 500:
                            return console.error('Status Code: 500（Internal Server Error）。服务器内部错误');
                        case 503:
                            return console.error('Status Code: 503（Service Unavailable）。服务器忙或者在维护');
                        default:
                            return console.error(`请求的状态不正确，状态码：${response.status}`);
                    }
                }
            })
                .then((data) => {
                resolve(data);
            })
                .catch((error) => {
                // 请求失败
                reject(error);
            });
        });
    }
    // 获取收藏数据
    // 这个 api 返回的作品列表顺序是按收藏顺序由近期到早期排列的
    static async getBookmarkData(id, type = 'illusts', tag, offset, hide = false) {
        const url = `https://www.pixiv.net/ajax/user/${id}/${type}/bookmarks?tag=${tag}&offset=${offset}&limit=100&rest=${hide ? 'hide' : 'show'}&rdm=${Math.random()}`;
        return this.sendGetRequest(url);
    }
    // 添加收藏
    static async addBookmark(id, type, tags, hide, token) {
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
        return this.sendGetRequest(url);
    }
    // 获取好 P 友列表
    static getMyPixivList(id, offset = 0, limit = 100, lang = 'zh') {
        const url = `https://www.pixiv.net/ajax/user/${id}/mypixiv?offset=${offset}&limit=${limit}&lang=${lang}`;
        return this.sendGetRequest(url);
    }
    // 获取粉丝列表
    static getFollowersList(id, offset = 0, limit = 100, lang = 'zh') {
        const url = `https://www.pixiv.net/ajax/user/${id}/followers?offset=${offset}&limit=${limit}&lang=${lang}`;
        return this.sendGetRequest(url);
    }
    // 获取用户信息
    static getUserProfile(id) {
        // full=1 在画师的作品列表页使用，获取详细信息
        // full=0 在作品页内使用，只获取少量信息
        const url = `https://www.pixiv.net/ajax/user/${id}?full=1`;
        return this.sendGetRequest(url);
    }
    // 获取用户指定类型的作品列表
    // 返回作品的 id 列表，不包含详细信息
    static async getUserWorksByType(id, type = ['illusts', 'manga', 'novels']) {
        let typeSet = new Set(type);
        let result = [];
        const url = `https://www.pixiv.net/ajax/user/${id}/profile/all`;
        let data = await this.sendGetRequest(url);
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
        return this.sendGetRequest(url);
    }
    // 获取插画 漫画 动图 的详细信息
    static getArtworkData(id) {
        const url = `https://www.pixiv.net/ajax/illust/${id}`;
        return this.sendGetRequest(url);
    }
    // 获取动图的元数据
    static getUgoiraMeta(id) {
        const url = `https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`;
        return this.sendGetRequest(url);
    }
    // 获取小说的详细信息
    static getNovelData(id) {
        const url = `https://www.pixiv.net/ajax/novel/${id}`;
        return this.sendGetRequest(url);
    }
    // 获取相关作品
    static getRelatedData(id) {
        // 最后的 18 是预加载首屏的多少个作品的信息，和下载并没有关系
        const url = `https://www.pixiv.net/ajax/illust/${id}/recommend/init?limit=18`;
        return this.sendGetRequest(url);
    }
    // 获取排行榜数据
    // 排行榜数据基本是一批 50 条作品信息
    static getRankingData(option) {
        let url = `https://www.pixiv.net/ranking.php?mode=${option.mode}&p=${option.p}&format=json`;
        // 把可选项添加到 url 里
        let temp = new URL(url);
        // 下面两项需要判断有值再添加。不可以让这些字段使用空值
        if (option.worksType) {
            temp.searchParams.set('content', option.worksType);
        }
        if (option.date) {
            temp.searchParams.set('date', option.date);
        }
        url = temp.toString();
        return this.sendGetRequest(url);
    }
    // 获取收藏后的相似作品数据
    // 需要传入作品 id 和要抓取的数量。但是实际获取到的数量会比指定的数量少一些
    static getRecommenderData(id, number) {
        const url = `/rpc/recommender.php?type=illust&sample_illusts=${id}&num_recommendations=${number}`;
        return this.sendGetRequest(url);
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
        return this.sendGetRequest(url);
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
        return this.sendGetRequest(url);
    }
    // 获取大家的新作品的数据
    static getNewIllustData(option) {
        const url = `https://www.pixiv.net/ajax/illust/new?lastId=${option.lastId}&limit=${option.limit}&type=${option.type}&r18=${option.r18}`;
        return this.sendGetRequest(url);
    }
    // 获取大家的新作小说的数据
    static getNewNovleData(option) {
        const url = `https://www.pixiv.net/ajax/novel/new?lastId=${option.lastId}&limit=${option.limit}&r18=${option.r18}`;
        return this.sendGetRequest(url);
    }
    // 获取关注的用户的新作品的数据
    static getBookmarkNewWorkData(type, p, r18, lang = 'zh') {
        const url = `https://www.pixiv.net/ajax/follow_latest/${type}?p=${p}&mode=${r18 ? 'r18' : 'all'}&lang=${lang}`;
        return this.sendGetRequest(url);
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
        return this.sendGetRequest(url);
    }
    // 获取系列信息
    // 这个接口的数据结构里同时有 illust （包含漫画）和 novel 系列数据
    // 恍惚记得有插画系列来着，但是没找到对应的网址，难道是记错了？
    static getSeriesData(series_id, pageNo) {
        const url = `https://www.pixiv.net/ajax/series/${series_id}?p=${pageNo}`;
        return this.sendGetRequest(url);
    }
    // 点赞
    static async addLike(id, type, token) {
        let data = {};
        if (type === 'illusts') {
            data = {
                illust_id: id,
            };
        }
        else {
            data = {
                novel_id: id,
            };
        }
        const r = await fetch(`https://www.pixiv.net/ajax/${type}/like`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'x-csrf-token': token,
            },
            credentials: 'same-origin',
            body: JSON.stringify(data),
        });
        const json = (await r.json());
        return json;
    }
    static async getMuteSettings() {
        return this.sendGetRequest(`https://www.pixiv.net/ajax/mute/items?context=setting`);
    }
}



/***/ }),

/***/ "./src/ts/BoldKeywords.ts":
/*!********************************!*\
  !*** ./src/ts/BoldKeywords.ts ***!
  \********************************/
/*! exports provided: BoldKeywords */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoldKeywords", function() { return BoldKeywords; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");


class BoldKeywords {
    constructor(wrap) {
        this.className = 'showBlobKeywords';
        this.wrap = wrap;
        this.bindEvent();
        this.setClassName();
    }
    bindEvent() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'boldKeywords') {
                this.setClassName();
            }
        });
    }
    setClassName() {
        this.wrap.classList[_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].boldKeywords ? 'add' : 'remove'](this.className);
    }
}



/***/ }),

/***/ "./src/ts/Bookmark.ts":
/*!****************************!*\
  !*** ./src/ts/Bookmark.ts ***!
  \****************************/
/*! exports provided: Bookmark */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bookmark", function() { return Bookmark; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/API.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Token */ "./src/ts/Token.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Tools */ "./src/ts/Tools.ts");




// 对 API.addBookmark 进行封装
class Bookmark {
    static async getWorkData(type, id) {
        return type === 'illusts'
            ? await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(id)
            : await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelData(id);
    }
    /**添加收藏
     *
     * 可选参数 tags：可以直接传入这个作品的 tag 列表
     *
     * 如果未传入 tags，但收藏设置要求 tags，则此方法会发送请求获取作品数据
     *
     * 可选参数 needAddTag：控制是否添加 tag。缺省时使用 settings.widthTagBoolean
     *
     * 可选参数 restrict：指示这个收藏是否为非公开收藏。缺省时使用 settings.restrictBoolean
     *
     */
    static async add(id, type, tags, needAddTag, restrict) {
        const _needAddTag = needAddTag === undefined ? _setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].widthTagBoolean : !!needAddTag;
        if (_needAddTag) {
            // 需要添加 tags
            if (tags === undefined) {
                // 如果未传递 tags，则请求作品数据来获取 tags
                const data = await this.getWorkData(type, id);
                tags = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].extractTags(data);
            }
        }
        else {
            // 不需要添加 tags
            tags = [];
        }
        const _restrict = restrict === undefined ? _setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].restrictBoolean : !!restrict;
        return _API__WEBPACK_IMPORTED_MODULE_0__["API"].addBookmark(id, type, tags, _restrict, _Token__WEBPACK_IMPORTED_MODULE_2__["token"].token);
    }
}



/***/ }),

/***/ "./src/ts/CenterPanel.ts":
/*!*******************************!*\
  !*** ./src/ts/CenterPanel.ts ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _setting_BG__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./setting/BG */ "./src/ts/setting/BG.ts");
/* harmony import */ var _OpenCenterPanel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./OpenCenterPanel */ "./src/ts/OpenCenterPanel.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _BoldKeywords__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./BoldKeywords */ "./src/ts/BoldKeywords.ts");










// 选项卡的名称和索引
var Tabbar;
(function (Tabbar) {
    Tabbar[Tabbar["Crawl"] = 0] = "Crawl";
    Tabbar[Tabbar["Download"] = 1] = "Download";
    Tabbar[Tabbar["Other"] = 2] = "Other";
})(Tabbar || (Tabbar = {}));
// 中间面板
class CenterPanel {
    constructor() {
        this.updateActiveClass = 'updateActiveClass';
        this.activeClass = 'active';
        this.addCenterPanel();
        this.activeTab(Tabbar.Crawl);
        _Theme__WEBPACK_IMPORTED_MODULE_3__["theme"].register(this.centerPanel);
        new _setting_BG__WEBPACK_IMPORTED_MODULE_6__["BG"](this.centerPanel);
        new _BoldKeywords__WEBPACK_IMPORTED_MODULE_9__["BoldKeywords"](this.centerPanel);
        this.bindEvents();
    }
    // 添加中间面板
    addCenterPanel() {
        const centerPanelHTML = `
      <div class="centerWrap ${'lang_' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].type}">

      <div class="centerWrap_head">
      <div class="centerWrap_title blue">
      ${_config_Config__WEBPACK_IMPORTED_MODULE_4__["Config"].appName}
      <div class="btns">
      <a class="has_tip centerWrap_top_btn update" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_newver')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gengxin"></use>
        </svg>
      </a>
      <a class="has_tip centerWrap_top_btn github_icon" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_github')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-github"></use>
      </svg>
      </a>
      <a class="has_tip centerWrap_top_btn wiki_url" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_wiki')}" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-help"></use>
        </svg>
      </a>
        <div class="has_tip centerWrap_top_btn centerWrap_close" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_隐藏下载面板')}">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        </div>
      </div>
      </div>
      </div>

      <div class="centerWrap_tabs tabsTitle">
        <div class="title">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取')}</div>
        <div class="title">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载')}</div>
        <div class="title">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_其他')}</div>
      </div>

      <div class="centerWrap_con beautify_scrollbar">

      <slot data-name="form"></slot>

      <div class="help_bar gray1"> 
      <button class="textButton gray1 showDownTip" type="button">${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_常见问题')}</button>
      <a class="gray1" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_wiki')}</a>
      <a class="gray1" href="https://github.com/xuejianxianzun/PixivFanboxDownloader" target="_blank"> ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_fanboxDownloader')}</a>
      <a id="zanzhu" class="gray1 patronText" href="https://afdian.net/@xuejianxianzun" target="_blank">在“爱发电”支持我</a>
      <a id="patreon" class="gray1 patronText" href="https://www.patreon.com/xuejianxianzun" target="_blank">Become a patron</a>
      <a class="gray1" href="https://discord.gg/eW9JtTK" target="_blank">Discord</a>
      <br>
      </div>

      </div>

      </div>
      `;
        document.body.insertAdjacentHTML('beforeend', centerPanelHTML);
        this.centerPanel = document.querySelector('.centerWrap');
        this.updateLink = this.centerPanel.querySelector('.update');
        const donateId = _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].type === 'zh-cn' ? 'zanzhu' : 'patreon';
        document.getElementById(donateId).style.display = 'inline-block';
        this.allTabTitle = this.centerPanel.querySelectorAll('.tabsTitle .title');
    }
    bindEvents() {
        // 监听点击扩展图标的消息，开关中间面板
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg.msg === 'click_icon') {
                this.toggle();
            }
        });
        // 使用快捷键 Alt + x 切换中间面板显示隐藏
        window.addEventListener('keydown', (ev) => {
            if (ev.altKey && ev.code === 'KeyX') {
                this.toggle();
            }
        }, false);
        // 关闭按钮
        document
            .querySelector('.centerWrap_close')
            .addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('closeCenterPanel');
        });
        // 开始抓取作品时，隐藏
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlStart, () => {
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('closeCenterPanel');
        });
        // 抓取完作品详细数据时，显示
        for (const ev of [_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resume]) {
            window.addEventListener(ev, () => {
                if (!_store_States__WEBPACK_IMPORTED_MODULE_2__["states"].quickCrawl && !_store_States__WEBPACK_IMPORTED_MODULE_2__["states"].downloadFromViewer) {
                    this.show();
                }
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.openCenterPanel, () => {
            this.show();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.closeCenterPanel, () => {
            this.close();
        });
        // 显示更新按钮
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.hasNewVer, () => {
            this.updateLink.classList.add(this.updateActiveClass);
            this.updateLink.style.display = 'inline-block';
        });
        // 显示常见问题
        this.centerPanel
            .querySelector('.showDownTip')
            .addEventListener('click', () => _MsgBox__WEBPACK_IMPORTED_MODULE_5__["msgBox"].show(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_下载说明'), {
            title: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_常见问题'),
        }));
        this.centerPanel.addEventListener('click', (e) => {
            const ev = e || window.event;
            ev.stopPropagation();
        });
        document.addEventListener('click', () => {
            if (getComputedStyle(this.centerPanel)['display'] !== 'none') {
                _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('closeCenterPanel');
            }
        });
        // 在选项卡的标题上触发事件时，激活对应的选项卡
        const eventList = ['click', 'mouseenter'];
        for (let index = 0; index < this.allTabTitle.length; index++) {
            eventList.forEach((eventName) => {
                this.allTabTitle[index].addEventListener(eventName, () => {
                    // 触发 mouseenter 时，如果用户设置了通过点击切换选项卡，则直接返回
                    // 触发 click 时无需检测，始终可以切换
                    if (eventName === 'mouseenter' && _setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].switchTabBar === 'click') {
                        return;
                    }
                    this.activeTab(index);
                });
            });
        }
        // 当可以开始下载时，切换到“下载”选项卡
        for (const ev of [
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlFinish,
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resultChange,
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resume,
        ]) {
            window.addEventListener(ev, () => {
                if (_store_States__WEBPACK_IMPORTED_MODULE_2__["states"].mergeNovel) {
                    return;
                }
                this.activeTab(Tabbar.Download);
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlEmpty, () => {
            this.activeTab(Tabbar.Crawl);
        });
    }
    // 设置激活的选项卡
    activeTab(no = 0) {
        for (const title of this.allTabTitle) {
            title.classList.remove(this.activeClass);
        }
        this.allTabTitle[no].classList.add(this.activeClass);
        const allTabCon = this.centerPanel.querySelectorAll('.tabsContnet');
        for (let index = 0; index < allTabCon.length; index++) {
            allTabCon[index].style.display = index === no ? 'block' : 'none';
        }
    }
    // 显示中间区域
    show() {
        if (_store_States__WEBPACK_IMPORTED_MODULE_2__["states"].mergeNovel) {
            return;
        }
        this.centerPanel.style.display = 'block';
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('centerPanelOpened');
    }
    // 隐藏中间区域
    close() {
        this.centerPanel.style.display = 'none';
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('centerPanelClosed');
    }
    toggle() {
        const nowDisplay = this.centerPanel.style.display;
        nowDisplay === 'block' ? this.close() : this.show();
        if (nowDisplay === 'block') {
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('closeCenterPanel');
        }
        else {
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('openCenterPanel');
        }
    }
}
new CenterPanel();


/***/ }),

/***/ "./src/ts/CheckUnsupportBrowser.ts":
/*!*****************************************!*\
  !*** ./src/ts/CheckUnsupportBrowser.ts ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Log */ "./src/ts/Log.ts");

// 某些国产套壳浏览器不能正常使用本程序。如果检测到该浏览器，则显示提示
// 相关文档： notes/一些国产套壳浏览器使用本程序的情况.md
class CheckUnsupportBrowser {
    constructor() {
        this.rules = {
            // "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36 SE 2.X MetaSr 1.0"
            Sougou: function () {
                return navigator.userAgent.includes(' SE ');
            },
            // "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3872.400 QQBrowser/10.8.4455.400"
            QQ: function () {
                return navigator.userAgent.includes('QQBrowser');
            },
            // "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3947.100 Safari/537.36 2345Explorer/10.21.0.21486"
            '2345': function () {
                return navigator.userAgent.includes('2345Explorer');
            },
            All: function () {
                // 如果这个浏览器的 Chrome 内核的版本号较低，也会显示提示
                // 为什么设置为 80：
                // 1. 下载器使用的浏览器 API 需要浏览器的内核版本最低为 79
                // 2. 猎豹浏览器内核版本是 79，符合上一个条件，但是它存在问题，所以要排除它，于是 79 也不可用
                const minChromeVer = 80;
                const test = navigator.userAgent.match(/Chrome\/(\d*)/);
                if (test && test[1]) {
                    const ver = Number.parseInt(test[1]);
                    if (ver < minChromeVer) {
                        return true;
                    }
                }
                return false;
            },
        };
        this.tipText = '你的浏览器可能不能正常使用这个扩展程序。<br>如果你在使用中遇到问题，请安装最新版本的 Chrome 浏览器，然后在 Chrome 浏览器上使用这个扩展。';
        this.check();
    }
    check() {
        for (const func of Object.values(this.rules)) {
            if (func()) {
                return _Log__WEBPACK_IMPORTED_MODULE_0__["log"].warning(this.tipText);
            }
        }
    }
}
new CheckUnsupportBrowser();


/***/ }),

/***/ "./src/ts/ConvertUgoira/ConvertUgoira.ts":
/*!***********************************************!*\
  !*** ./src/ts/ConvertUgoira/ConvertUgoira.ts ***!
  \***********************************************/
/*! exports provided: convertUgoira */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertUgoira", function() { return convertUgoira; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _ToWebM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ToWebM */ "./src/ts/ConvertUgoira/ToWebM.ts");
/* harmony import */ var _ToGIF__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ToGIF */ "./src/ts/ConvertUgoira/ToGIF.ts");
/* harmony import */ var _ToAPNG__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ToAPNG */ "./src/ts/ConvertUgoira/ToAPNG.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");







// 控制动图转换
class ConvertUgoira {
    constructor() {
        this.downloading = true; // 是否在下载。如果下载停止了则不继续转换后续任务，避免浪费资源
        this._count = 0; // 统计有几个转换任务
        this.maxCount = 1; // 允许同时运行多少个转换任务
        this.setMaxCount();
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStart, () => {
            this.downloading = true;
        });
        [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadPause, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStop].forEach((event) => {
            window.addEventListener(event, () => {
                this.downloading = false;
            });
        });
        // 设置发生变化时
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'convertUgoiraThread') {
                this.setMaxCount();
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.convertSuccess, () => {
            this.complete();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.readZipError, () => {
            this.complete();
        });
        // 如果转换动图时页面被隐藏了，则显示一次提示
        document.addEventListener('visibilitychange', () => {
            this.checkHidden();
        });
    }
    setMaxCount() {
        this.maxCount =
            _setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].convertUgoiraThread > 0 ? _setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].convertUgoiraThread : 1;
    }
    set count(num) {
        this._count = num;
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('convertChange', this._count);
        this.checkHidden();
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
                        resolve(_ToGIF__WEBPACK_IMPORTED_MODULE_3__["toGIF"].convert(file, info));
                    }
                    else if (type === 'png') {
                        resolve(_ToAPNG__WEBPACK_IMPORTED_MODULE_4__["toAPNG"].convert(file, info));
                    }
                    else {
                        // 如果没有 type 则默认使用 webm
                        resolve(_ToWebM__WEBPACK_IMPORTED_MODULE_2__["toWebM"].convert(file, info));
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
    checkHidden() {
        if (this._count > 0 && document.visibilityState === 'hidden') {
            const name = 'tipConvertUgoira';
            const test = sessionStorage.getItem(name);
            if (test === null) {
                _MsgBox__WEBPACK_IMPORTED_MODULE_5__["msgBox"].warning(_Lang__WEBPACK_IMPORTED_MODULE_6__["lang"].transl('_转换动图时页面被隐藏的提示'));
                sessionStorage.setItem(name, '1');
            }
        }
    }
}
const convertUgoira = new ConvertUgoira();



/***/ }),

/***/ "./src/ts/ConvertUgoira/ExtractImage.ts":
/*!**********************************************!*\
  !*** ./src/ts/ConvertUgoira/ExtractImage.ts ***!
  \**********************************************/
/*! exports provided: extractImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractImage", function() { return extractImage; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");

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
        let zipWorker = await fetch(chrome.runtime.getURL('lib/z-worker.js'));
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
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('readZipError');
                reject(new Error('ReadZIP error: ' + message));
            });
        });
    }
}
const extractImage = new ExtractImage();



/***/ }),

/***/ "./src/ts/ConvertUgoira/ToAPNG.ts":
/*!****************************************!*\
  !*** ./src/ts/ConvertUgoira/ToAPNG.ts ***!
  \****************************************/
/*! exports provided: toAPNG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toAPNG", function() { return toAPNG; });
/* harmony import */ var _ExtractImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtractImage */ "./src/ts/ConvertUgoira/ExtractImage.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");



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
            const img = await _utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].loadImg(base64Arr[0]);
            // 编码
            const png = UPNG.encode(arrayBuffList, img.width, img.height, 0, delayList);
            base64Arr = null;
            arrayBuffList = null;
            const blob = new Blob([png], {
                type: 'image/vnd.mozilla.apng',
            });
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('convertSuccess');
            resolve(blob);
        });
    }
    // 获取每一帧的数据，传递给编码器使用
    async getFrameData(imgFile) {
        const resultList = [];
        return new Promise(async (resolve, reject) => {
            for (const base64 of imgFile) {
                const img = await _utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].loadImg(base64);
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

/***/ "./src/ts/ConvertUgoira/ToGIF.ts":
/*!***************************************!*\
  !*** ./src/ts/ConvertUgoira/ToGIF.ts ***!
  \***************************************/
/*! exports provided: toGIF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toGIF", function() { return toGIF; });
/* harmony import */ var _ExtractImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtractImage */ "./src/ts/ConvertUgoira/ExtractImage.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");



class ToGIF {
    constructor() {
        this.gifWorkerUrl = '';
        this.loadWorkerJS();
    }
    async loadWorkerJS() {
        // 添加 gif 的 worker 文件
        let gifWorker = await fetch(chrome.runtime.getURL('lib/gif.worker.js'));
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
            gif.on('finished', (file, data) => {
                data = null;
                _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('convertSuccess');
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
                const img = await _utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].loadImg(base64);
                resultList.push(img);
            }
            resolve(resultList);
        });
    }
}
const toGIF = new ToGIF();



/***/ }),

/***/ "./src/ts/ConvertUgoira/ToWebM.ts":
/*!****************************************!*\
  !*** ./src/ts/ConvertUgoira/ToWebM.ts ***!
  \****************************************/
/*! exports provided: toWebM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toWebM", function() { return toWebM; });
/* harmony import */ var _ExtractImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtractImage */ "./src/ts/ConvertUgoira/ExtractImage.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");



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
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('convertSuccess');
            resolve(file);
        });
    }
    // 获取每一帧的数据，传递给编码器使用
    async getFrameData(imgFile) {
        const resultList = [];
        return new Promise(async (resolve, reject) => {
            for (const base64 of imgFile) {
                const img = await _utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].loadImg(base64);
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



/***/ }),

/***/ "./src/ts/EVT.ts":
/*!***********************!*\
  !*** ./src/ts/EVT.ts ***!
  \***********************/
/*! exports provided: EVT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVT", function() { return EVT; });
// 管理自定义事件
class EVENT {
    constructor() {
        this.bindOnceFlagList = [];
        this.list = {
            // 当抓取开始时触发
            crawlStart: 'crawlStart',
            // 让下载器抓取特定的 tag，而不是自动获取当前页面的 tag（仅在 tag 搜索页面有效）
            crawlTag: 'crawlTag',
            // 当检查到错误的设置时触发
            wrongSetting: 'wrongSetting',
            // 当获取作品的 id 列表完成时触发
            getIdListFinished: 'getIdListFinished',
            // 获取了作品的 id 列表，需要下载这些 id 列表时使用
            crawlIdList: 'crawlIdList',
            // 当抓取完成时触发。不管结果是否为空都会触发
            crawlFinish: 'crawlFinish',
            // 当抓取结果为空时触发。触发时机晚于 crawlFinish
            crawlEmpty: 'crawlEmpty',
            // store 里每存储一个作品的元数据，就触发一次。如果一个元数据产生了多个结果（多图作品），只触发一次
            addResult: 'addResult',
            // 当抓取完毕之后，抓取结果又发生变化时触发（比如进行多次筛选、改变设置项等，导致结果变化）
            resultChange: 'resultChange',
            // 当进行快速抓取时触发
            quickCrawl: 'quickCrawl',
            // 下载被取消（取消是在尚未开始下载前触发的，它不同于下载停止）
            downloadCancel: 'downloadCancel',
            // 开始下载时触发
            downloadStart: 'downloadStart',
            // 下载状态变成暂停时触发
            downloadPause: 'downloadPause',
            // 请求停止下载
            requestPauseDownload: 'requestPauseDownload',
            // 下载状态变成停止时触发
            downloadStop: 'downloadStop',
            // 当文件在下载阶段下载失败时触发
            // 当动图转换出错时触发
            downloadError: 'downloadError',
            // 当一个文件在下载阶段被跳过时触发
            skipDownload: 'skipDownload',
            // 当浏览器把一个文件保存到本地失败时触发
            saveFileError: 'saveFileError',
            // 当下载的文件传递给浏览器进行保存，并且成功保存之后触发
            // skipDownload 也会触发这个事件
            downloadSuccess: 'downloadSuccess',
            // 下载队列里的所有文件都已经下载并保存完毕，并且没有出错的。如果有出错的，就不会触发这个事件
            downloadComplete: 'downloadComplete',
            // 页面切换
            pageSwitch: 'pageSwitch',
            // 页面切换，并且页面类型变化
            pageSwitchedTypeChange: 'pageSwitchedTypeChange',
            // 页面切换，并且页面类型不变
            pageSwitchedTypeNotChange: 'pageSwitchedTypeNotChange',
            // 请求重置所有设置
            resetSettings: 'resetSettings',
            // 重置所有设置执行完毕
            resetSettingsEnd: 'resetSettingsEnd',
            // 请求导出设置
            exportSettings: 'exportSettings',
            // 请求导入设置
            importSettings: 'importSettings',
            // 当动图转换数量发生变化时触发
            convertChange: 'convertChange',
            // 当读取/解压 zip 文件出错时触发
            readZipError: 'readZipError',
            // 当动图转换成功时触发
            convertSuccess: 'convertSuccess',
            // 指示打开中间面板
            openCenterPanel: 'openCenterPanel',
            // 指示关闭中间面板
            closeCenterPanel: 'closeCenterPanel',
            // 中间面板已打开
            centerPanelOpened: 'centerPanelOpened',
            // 中间面板已关闭
            centerPanelClosed: 'centerPanelClosed',
            // 当清除多图作品时触发
            clearMultiple: 'clearMultiple',
            // 当清除动图作品时触发
            clearUgoira: 'clearUgoira',
            // 当手动删除作品时触发
            deleteWork: 'deleteWork',
            // 当下载器在页面上创建的作品列表全部完成时触发
            worksUpdate: 'worksUpdate',
            // 当需要清空下载记录时触发（指用于检测重复文件的下载记录）
            clearDownloadRecord: 'clearDownloadRecord',
            // 当需要导出下载记录时触发
            exportDownloadRecord: 'exportDownloadRecord',
            // 当需要导入下载记录时触发
            importDownloadRecord: 'importDownloadRecord',
            // 当需要清空断点续传的数据时触发
            clearSavedCrawl: 'clearSavedCrawl',
            // 当从断点续传数据恢复了下载时触发
            resume: 'resume',
            // 当需要导出 csv 文件时触发
            exportCSV: 'exportCSV',
            // 当需要导出抓取结果时触发
            exportResult: 'exportResult',
            // 当需要导出抓取结果时触发
            importResult: 'importResult',
            // 当需要保存用户头像时触发
            saveAvatarImage: 'saveAvatarImage',
            // 当需要保存用户头像为图标时触发
            saveAvatarIcon: 'saveAvatarIcon',
            // 当需要保存用户背景图片时触发
            saveUserCover: 'saveUserCover',
            // 当需要预览文件名时触发
            previewFileName: 'previewFileName',
            // 当需要预览 url 时触发
            showURLs: 'showURLs',
            // 当需要输出面板输出内容时触发
            output: 'output',
            // 当设置表单里的设置项发生变化时触发
            settingChange: 'settingChange',
            // 当下载器检测到有新版本时触发
            hasNewVer: 'hasNewVer',
            // 进入批量收藏模式时触发
            bookmarkModeStart: 'bookmarkModeStart',
            // 批量收藏完成时触发
            bookmarkModeEnd: 'bookmarkModeEnd',
            // 需要单独显示信息时触发
            showMsg: 'showMsg',
            // 需要显示冒泡提示时触发
            sendToast: 'sendToast',
            // 需要清空日志区域时触发
            clearLog: 'clearLog',
            // 选择背景图片
            selectBG: 'selectBG',
            // 清除背景图片
            clearBG: 'clearBG',
            // 点击了下载器在作品缩略图上添加的按钮时触发
            // 其他按钮监听这个事件后隐藏自己，就可以避免其他按钮出现闪烁、残留的问题
            clickBtnOnThumb: 'clickBtnOnThumb',
            // 显示原比例图片时触发
            showOriginSizeImage: 'showOriginSizeImage',
        };
    }
    // 只绑定某个事件一次，用于防止事件重复绑定
    // 通过 flag 确认是否是同一个事件
    // 可以执行多次，不会自动解绑
    bindOnce(flag, targetEvt, evtFun) {
        const query = this.bindOnceFlagList.includes(flag);
        if (!query) {
            this.bindOnceFlagList.push(flag);
            window.addEventListener(targetEvt, function (ev) {
                evtFun(ev);
            });
        }
    }
    // 触发事件，可以携带数据
    // 数据通过 ev.detail.data 获取，如果未传递则是空对象
    fire(type, data) {
        const event = new CustomEvent(type, {
            detail: { data: data === undefined ? {} : data },
        });
        window.dispatchEvent(event);
    }
}
const EVT = new EVENT();



/***/ }),

/***/ "./src/ts/FileName.ts":
/*!****************************!*\
  !*** ./src/ts/FileName.ts ***!
  \****************************/
/*! exports provided: fileName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fileName", function() { return fileName; });
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _setting_NameRuleManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setting/NameRuleManager */ "./src/ts/setting/NameRuleManager.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _utils_DateFormat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/DateFormat */ "./src/ts/utils/DateFormat.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Tools */ "./src/ts/Tools.ts");







// 生成文件名
class FileName {
    constructor() {
        // 下载器所有的动图文件名后缀
        this.ugoiraExt = ['zip', 'webm', 'gif', 'png'];
        this.addStr = '[downloader_add]';
        // 不能出现在文件名开头的一些特定字符
        this.checkStartCharList = ['/', ' '];
    }
    // 生成 {rank} 标记的值
    createRank(rank) {
        // 处理空值
        if (rank === null) {
            return '';
        }
        // string 是旧版本中使用的，以前抓取结果里的 rank 直接就是 '#1' 这样的字符串，后来改成了数字类型
        if (typeof rank === 'string') {
            return rank;
        }
        // 其他的情况则应该是期望的值（数字类型）
        return '#' + rank;
    }
    // 生成 {p_num} 标记的值
    createPNum(data) {
        var _a;
        const index = (_a = data.index) !== null && _a !== void 0 ? _a : _Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].getResultIndex(data);
        // 处理第一张图不带序号的情况
        if (index === 0 && _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].noSerialNo) {
            return '';
        }
        // 只有插画和漫画有编号
        if (data.type === 0 || data.type === 1) {
            const p = index.toString();
            // 根据需要在前面填充 0
            return _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].zeroPadding
                ? p.padStart(_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].zeroPaddingLength, '0')
                : p;
        }
        else {
            // 其他类型没有编号，返回空字符串
            return '';
        }
    }
    // 生成 {id} 标记的值
    createId(data) {
        var _a;
        const index = (_a = data.index) !== null && _a !== void 0 ? _a : _Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].getResultIndex(data);
        // 处理第一张图不带序号的情况
        if (index === 0 && _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].noSerialNo) {
            return data.idNum.toString();
        }
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].zeroPadding) {
            return data.id;
        }
        else {
            // 需要填充 0 的情况
            // 只有插画和漫画有编号
            if (data.type === 0 || data.type === 1) {
                return (data.idNum +
                    '_p' +
                    index.toString().padStart(_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].zeroPaddingLength, '0'));
            }
            else {
                // 其他类型没有编号，所以不会进行填充，直接返回 id
                return data.id;
            }
        }
    }
    // 返回收藏数的简化显示
    getBKM1000(bmk) {
        if (bmk < 1000) {
            return '0+';
        }
        else {
            // 1000 以上，以 1000 为单位
            const str = bmk.toString();
            return str.slice(0, str.length - 3) + '000+';
        }
    }
    // 在文件名前面添加一层文件夹
    // appendFolder 方法会对非法字符进行处理（包括处理路径分隔符 / 这主要是因为 tags 可能含有斜线 /，需要替换）
    appendFolder(fullPath, folderName) {
        const allPart = fullPath.split('/');
        allPart.splice(allPart.length - 1, 0, _utils_Utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].replaceUnsafeStr(folderName));
        return allPart.join('/');
    }
    // 检查文件名开头是否含有特定字符
    checkStartChar(str) {
        for (const check of this.checkStartCharList) {
            if (str.startsWith(check)) {
                return true;
            }
        }
        return false;
    }
    // 移除文件名开头的特定字符
    removeStartChar(str) {
        while (this.checkStartChar(str)) {
            for (const check of this.checkStartCharList) {
                if (str.startsWith(check)) {
                    str = str.replace(check, '');
                }
            }
        }
        return str;
    }
    // 传入命名规则和所有标记，生成文件名
    generateFileName(rule, cfg) {
        var _a;
        let result = rule;
        // 把命名规则里的标记替换成实际值
        for (const [key, val] of Object.entries(cfg)) {
            if (rule.includes(key)) {
                // 空值替换成空字符串
                let temp = (_a = val.value) !== null && _a !== void 0 ? _a : '';
                // 如果这个值不是字符串类型则转换为字符串
                temp = typeof temp !== 'string' ? temp.toString() : temp;
                // 替换不可以作为文件名的特殊字符
                if (!val.safe) {
                    temp = _utils_Utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].replaceUnsafeStr(temp);
                }
                // 添加标记前缀
                if (_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].tagNameToFileName) {
                    temp = val.prefix + temp;
                }
                // 将标记替换成结果，如果有重复的标记，全部替换
                result = result.replace(new RegExp(key, 'g'), temp);
            }
        }
        // 处理文件名里的一些边界情况
        // 如果文件名开头不可用的特殊字符
        result = this.removeStartChar(result);
        // 测试用例
        // const testStr = ' / / {p_tag} / {p_title} /{id}-{user}'
        // console.log(this.removeStartChar(testStr))
        // 如果文件名的尾部是 / 则去掉
        if (result.endsWith('/')) {
            result = result.substr(0, result.length - 1);
        }
        // 处理连续的 /
        result = result.replace(/\/{2,100}/g, '/');
        return result;
    }
    // 传入一个抓取结果，获取其文件名
    getFileName(data) {
        var _a;
        // 命名规则
        const userSetName = _setting_NameRuleManager__WEBPACK_IMPORTED_MODULE_1__["nameRuleManager"].rule;
        // 判断是否要为每个作品创建单独的文件夹
        let createFolderForEachWork = _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].workDir && data.dlCount > _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].workDirFileNumber;
        let r18FolderName = _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].r18Folder ? _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].r18FolderName : '';
        const allNameRule = userSetName +
            (createFolderForEachWork ? _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].workDirNameRule : '') +
            r18FolderName;
        // 1 生成所有命名标记的值
        // 对于一些较为耗时的计算，先判断用户设置的命名规则里是否使用了这个标记，如果未使用则不计算
        const cfg = {
            '{p_title}': {
                value: _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].title,
                prefix: '',
                safe: false,
            },
            '{p_tag}': {
                value: _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].tag,
                prefix: '',
                safe: false,
            },
            '{id}': {
                value: this.createId(data),
                prefix: '',
                safe: true,
            },
            '{id_num}': {
                value: data.idNum || parseInt(data.id),
                prefix: '',
                safe: true,
            },
            '{p_num}': {
                value: !allNameRule.includes('{p_num}') ? null : this.createPNum(data),
                prefix: '',
                safe: true,
            },
            '{rank}': {
                value: !allNameRule.includes('{rank}')
                    ? null
                    : this.createRank(data.rank),
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
                value: !allNameRule.includes('{px}')
                    ? null
                    : data.fullWidth
                        ? data.fullWidth + 'x' + data.fullHeight
                        : '',
                prefix: '',
                safe: true,
            },
            '{tags}': {
                value: !allNameRule.includes('{tags}') ? null : data.tags.join(','),
                prefix: 'tags_',
                safe: false,
            },
            '{tags_translate}': {
                value: !allNameRule.includes('{tags_translate}')
                    ? null
                    : data.tagsWithTransl.join(','),
                prefix: 'tags_',
                safe: false,
            },
            '{tags_transl_only}': {
                value: !allNameRule.includes('{tags_transl_only}')
                    ? null
                    : data.tagsTranslOnly.join(','),
                prefix: 'tags_',
                safe: false,
            },
            '{bmk}': {
                value: data.bmk,
                prefix: 'bmk_',
                safe: true,
            },
            '{bmk_1000}': {
                value: this.getBKM1000(data.bmk),
                prefix: 'bmk_',
                safe: true,
            },
            '{like}': {
                value: data.likeCount,
                prefix: 'like_',
                safe: true,
            },
            '{view}': {
                value: data.viewCount,
                prefix: 'view_',
                safe: true,
            },
            '{date}': {
                value: !allNameRule.includes('{date}')
                    ? null
                    : _utils_DateFormat__WEBPACK_IMPORTED_MODULE_4__["DateFormat"].format(data.date, _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].dateFormat),
                prefix: '',
                safe: false,
            },
            '{task_date}': {
                value: !allNameRule.includes('{task_date}')
                    ? null
                    : _utils_DateFormat__WEBPACK_IMPORTED_MODULE_4__["DateFormat"].format(_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].crawlCompleteTime, _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].dateFormat),
                prefix: '',
                safe: false,
            },
            '{type}': {
                value: _config_Config__WEBPACK_IMPORTED_MODULE_3__["Config"].worksTypeName[data.type],
                prefix: '',
                safe: true,
            },
            '{series_title}': {
                value: data.seriesTitle || '',
                prefix: '',
                safe: false,
            },
            '{series_order}': {
                value: data.seriesOrder === null ? '' : '#' + data.seriesOrder,
                prefix: '',
                safe: true,
            },
            '{sl}': {
                value: (_a = data.sl) !== null && _a !== void 0 ? _a : 0,
                prefix: '',
                safe: true,
            },
        };
        // 2 生成文件名
        let result = this.generateFileName(userSetName, cfg);
        // 3 根据某些设置向结果中添加新的文件夹
        // 注意：添加文件夹的顺序会影响文件夹的层级，所以不可随意更改顺序
        // 根据作品类型自动创建对应的文件夹
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderByType) {
            // 根据作品类型和对应开关确定是否需要要为其建立文件夹
            const allSwitch = [
                _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderByTypeIllust,
                _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderByTypeManga,
                _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderByTypeUgoira,
                _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderByTypeNovel,
            ];
            if (allSwitch[data.type]) {
                const folder = _config_Config__WEBPACK_IMPORTED_MODULE_3__["Config"].worksTypeName[data.type];
                result = this.appendFolder(result, folder);
            }
        }
        // 根据 sl 创建文件夹
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderBySl && data.sl !== null) {
            const folder = 'sl' + data.sl.toString();
            result = this.appendFolder(result, folder);
        }
        // 根据第一个匹配的 tag 建立文件夹
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderByTag && _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderTagList.length > 0) {
            const workTags = data.tagsWithTransl.map((val) => val.toLowerCase());
            // 循环用户输入的 tag 列表，查找作品 tag 是否含有匹配项
            // 这样用户输入的第一个匹配的 tag 就会作为文件夹名字
            // 不要循环作品 tag 列表，因为那样找到的第一个匹配项未必是用户输入的第一个
            // 例如 用户输入顺序：巨乳 欧派
            // 作品 tag 里的顺序：欧派 巨乳
            for (const tag of _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].createFolderTagList) {
                // 查找匹配的时候转换成小写
                const nowTag = tag.toLowerCase();
                if (workTags.includes(nowTag)) {
                    // 设置为文件夹名字的时候使用原 tag（不转换成小写）
                    result = this.appendFolder(result, tag);
                    break;
                }
            }
        }
        // 把 R18(G) 作品存入指定目录里
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].r18Folder && (data.xRestrict === 1 || data.xRestrict === 2)) {
            result = this.appendFolder(result, this.generateFileName(r18FolderName, cfg));
        }
        // 为每个作品创建单独的文件夹
        if (createFolderForEachWork) {
            const workDirName = this.generateFileName(_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].workDirNameRule, cfg);
            // 生成文件名。由于用户可能会添加斜线来建立多层路径，所以需要循环添加每个路径
            const allPath = workDirName.split('/');
            for (const path of allPath) {
                if (path.length > 0) {
                    result = this.appendFolder(result, path);
                }
            }
        }
        // 4 文件夹部分和文件名已经全部生成完毕，处理一些边界情况
        // 处理连续的 / 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
        result = result.replace(/\/{2,100}/g, '/');
        // 对每一层路径和文件名进行处理
        const pathArray = result.split('/');
        for (let i = 0; i < pathArray.length; i++) {
            let str = pathArray[i];
            // 去掉每层路径首尾的空格
            // 把每层路径头尾的 . 替换成全角的．因为 Chrome 不允许头尾使用 .
            str = str.trim().replace(/^\./g, '．').replace(/\.$/g, '．');
            // 处理路径是 Windows 保留文件名的情况（不需要处理后缀名）
            str = _utils_Utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].handleWindowsReservedName(str, this.addStr);
            pathArray[i] = str;
        }
        result = pathArray.join('/');
        // 5 生成后缀名
        // 如果是动图，那么此时根据用户设置的动图保存格式，更新其后缀名
        if (this.ugoiraExt.includes(data.ext) &&
            data.ugoiraInfo &&
            _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].imageSize !== 'thumb') {
            // 当下载图片的方形缩略图时，不修改其后缀名，因为此时下载的是作品的静态缩略图，不是动图
            data.ext = _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].ugoiraSaveAs;
        }
        // 如果是小说，那么此时根据用户设置的动图保存格式，更新其后缀名
        if (data.type === 3) {
            data.ext = _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].novelSaveAs;
        }
        const extResult = '.' + data.ext;
        // 6 文件名长度限制
        // 去掉文件夹部分，只处理 文件名+后缀名 部分
        // 理论上文件夹部分也可能会超长，但是实际使用中几乎不会有人这么设置，所以不处理
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].fileNameLengthLimitSwitch) {
            let limit = _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].fileNameLengthLimit;
            const allPart = result.split('/');
            const lastIndex = allPart.length - 1;
            if (allPart[lastIndex].length + extResult.length > limit) {
                allPart[lastIndex] = allPart[lastIndex].substr(0, limit - extResult.length);
            }
            result = allPart.join('/');
        }
        // 7 添加后缀名
        result += extResult;
        // 8 返回结果
        return result;
    }
}
const fileName = new FileName();



/***/ }),

/***/ "./src/ts/Help.ts":
/*!************************!*\
  !*** ./src/ts/Help.ts ***!
  \************************/
/*! exports provided: help */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "help", function() { return help; });
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");


// 显示帮助信息
// 在第一次使用某些功能的时候显示一次性的帮助信息
class Help {
    showDownloadTip() {
        const flag = {
            name: 'PBDDownloadTip',
            value: '1',
        };
        const getValue = localStorage.getItem(flag.name);
        if (getValue === null) {
            _MsgBox__WEBPACK_IMPORTED_MODULE_0__["msgBox"].show(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载说明提示2'));
            localStorage.setItem(flag.name, flag.value);
        }
    }
}
const help = new Help();



/***/ }),

/***/ "./src/ts/ImageViewer.ts":
/*!*******************************!*\
  !*** ./src/ts/ImageViewer.ts ***!
  \*******************************/
/*! exports provided: ImageViewer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageViewer", function() { return ImageViewer; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/API.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Loading */ "./src/ts/Loading.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Bookmark__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Bookmark */ "./src/ts/Bookmark.ts");
// 图片查看器
/// <reference path = "./ImageViewer.d.ts" />









// 对 Viewer 进行修改以供下载器使用
// 原版是接收页面上已存在的缩略图列表，但在下载器里它需要从作品 id 获取数据，生成缩略图列表
class ImageViewer {
    constructor(cfg) {
        this.viewerWarpper = document.createElement('div'); // 图片列表的容器
        this.viewerUl = document.createElement('ul'); // 图片列表的 ul 元素
        this.show = false; // 当前查看器实例是否处于显示状态
        this.isOriginalSize = false; // 是否原尺寸显示图片
        // 默认配置
        this.cfg = {
            workId: _Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].getIllustId(),
            showImageList: false,
            imageListId: '',
            insertTarget: '',
            insertPostion: 'beforeend',
            imageNumber: 2,
            imageSize: 'original',
            showDownloadBtn: true,
            showBookmarkBtn: true,
            autoStart: false,
            showLoading: false,
        };
        this.viewerWarpperFlag = 'viewerWarpperFlag';
        this.addBtnClass = 'viewer-add-btn';
        this.cfg = Object.assign(this.cfg, cfg);
        this.init();
    }
    init() {
        // 当创建新的查看器实例时，删除旧的查看器元素。其实不删除也没有问题，但是查看器每初始化一次都会创建全新的对象，所以旧的对象没必要保留。
        // 删除之前创建的图片列表，否则旧的图片列表依然存在
        const oldViewerWarpper = document.querySelector('.' + this.viewerWarpperFlag);
        oldViewerWarpper && oldViewerWarpper.remove();
        // 删除旧的查看器的 DOM 节点
        const oldViewerContainer = document.querySelector('.viewer-container');
        oldViewerContainer && oldViewerContainer.remove();
        this.createImageList();
        this.bindEvents();
    }
    // 如果多次初始化查看器，这些事件会被多次绑定。但是因为回调函数内部判断了查看器实例，所以不会有问题
    bindEvents() {
        // 按 F 进入/退出 1:1 查看模式
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyF') {
                if (this.show) {
                    this.isOriginalSize = !this.isOriginalSize;
                    this.setOriginalSize();
                }
            }
        });
        // 按 Alt + B 收藏当前作品
        // 因为 Pixiv 会在按下 B 键时收藏当前作品，所以下载器不能使用 B 键。尝试阻止 Pixiv 的事件但是没有成功
        document.addEventListener('keydown', (event) => {
            if (event.altKey && event.code === 'KeyB') {
                if (this.show) {
                    this.addBookmark();
                }
            }
        });
        // 按 D 下载当前作品
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyD') {
                if (this.show) {
                    this.download();
                }
            }
        });
        // 监听左右方向键，防止在看图时，左右方向键导致 Pixiv 切换作品
        window.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
                if (this.show) {
                    // 阻止事件冒泡
                    event.stopPropagation();
                    // 控制切换到上一张或者下一张
                    // true 表示启用循环切换
                    event.code === 'ArrowLeft'
                        ? this.myViewer.prev(true)
                        : this.myViewer.next(true);
                }
            }
        }, true);
    }
    // 创建缩略图列表
    async createImageList() {
        if (this.cfg.showImageList) {
            // 如果要显示缩略图列表，则等待要插入的容器元素生成
            if (!document.querySelector(this.cfg.insertTarget)) {
                window.setTimeout(() => {
                    this.createImageList();
                }, 300);
                return;
            }
        }
        let useBigURL = ''; // 查看大图时的第一张图片的 url
        // 查看器图片列表元素的结构： div > ul > li > img
        // 创建图片列表的容器
        this.viewerWarpper = document.createElement('div');
        this.viewerWarpper.classList.add(this.viewerWarpperFlag);
        this.viewerUl = document.createElement('ul');
        this.viewerWarpper.appendChild(this.viewerUl);
        this.viewerWarpper.style.display = 'none';
        if (this.cfg.imageListId) {
            this.viewerWarpper.id = this.cfg.imageListId;
        }
        if (this.cfg.showLoading) {
            _Loading__WEBPACK_IMPORTED_MODULE_4__["loading"].show = true;
        }
        // 获取作品数据，生成缩略图列表
        this.workData = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(this.cfg.workId);
        const body = this.workData.body;
        // 处理插画、漫画、动图作品，不处理其他类型的作品
        if (body.illustType === 0 ||
            body.illustType === 1 ||
            body.illustType === 2) {
            // 如果图片数量达到指定值，则会创建创建缩略图，启用查看器
            if (body.pageCount >= this.cfg.imageNumber) {
                // 配置大图 url
                useBigURL = body.urls[this.cfg.imageSize] || body.urls.original;
                // 生成缩略图列表
                let html = [];
                for (let index = 0; index < body.pageCount; index++) {
                    // 使用 thumb url 的话，p0 之后的图片经常没有对应的文件，导致缩略图因为 404 无法显示。根据 issues/140 使用另一套 url 作为缩略图 url，不会产生 404。前后对比示例：
                    // https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2021/03/03/06/29/53/88179809_p1_custom1200.jpg
                    // https://i.pximg.net/c/128x128/img-master/img/2021/03/03/06/29/53/88179809_p1_square1200.jpg
                    const str = `<li><img src="${_Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].convertArtworkThumbURL(body.urls.thumb, index)}" data-src="${useBigURL.replace('p0', 'p' + index)}"></li>`;
                    html.push(str);
                }
                this.viewerUl.innerHTML = html.join('');
            }
            else {
                return;
            }
        }
        else {
            return;
        }
        if (this.cfg.showLoading) {
            _Loading__WEBPACK_IMPORTED_MODULE_4__["loading"].show = false;
        }
        if (this.cfg.showImageList) {
            // 把缩略图列表添加到页面上
            _Theme__WEBPACK_IMPORTED_MODULE_3__["theme"].register(this.viewerWarpper);
            this.viewerWarpper.style.display = 'block';
            const target = document.querySelector(this.cfg.insertTarget);
            if (target) {
                target.insertAdjacentElement('beforebegin', this.viewerWarpper);
            }
        }
        this.configureViewer(body.pageCount, useBigURL);
    }
    // 配置图片查看器
    async configureViewer(pageCount, firstBigImgURL) {
        // 图片查看器显示之后
        this.viewerUl.addEventListener('shown', () => {
            this.show = true;
            if (this.cfg.showDownloadBtn) {
                this.addDownloadBtn();
            }
            if (this.cfg.showBookmarkBtn) {
                this.addBookmarkBtn();
            }
            // 如果图片数量只有 1 个，则不显示缩略图一栏
            const navbar = document.querySelector('.viewer-navbar');
            if (navbar) {
                // 控制不透明度，这样它依然会占据空间，不会导致工具栏下移
                navbar.style.opacity = pageCount > 1 ? '1' : '0';
            }
            // 点击 1：1 按钮时
            const oneToOne = document.querySelector('.viewer-one-to-one');
            if (oneToOne) {
                oneToOne.setAttribute('title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_原始尺寸') + ' (F)');
                oneToOne.addEventListener('click', (ev) => {
                    // 阻止冒泡，否则放大过程中会多一次闪烁（推测可能是这个按钮原有的事件导致的，停止冒泡之后就好了）
                    ev.stopPropagation();
                    this.isOriginalSize = !this.isOriginalSize;
                    this.setOriginalSize();
                }, true);
            }
        });
        // 退出图片查看器时（可能尚未完全退出）
        this.viewerUl.addEventListener('hide', () => {
            this.show = false;
        });
        // 查看每一张图片时，如果处于 1:1 模式，就把图片缩放到 100%
        // viewed 事件是图片加载完成时触发的
        this.viewerUl.addEventListener('viewed', () => {
            if (this.isOriginalSize) {
                this.setOriginalSize();
            }
        });
        // 因为选项里的 size 是枚举类型，所以在这里也要定义一个枚举
        let ToolbarButtonSize;
        (function (ToolbarButtonSize) {
            ToolbarButtonSize["Small"] = "small";
            ToolbarButtonSize["Medium"] = "medium";
            ToolbarButtonSize["Large"] = "large";
        })(ToolbarButtonSize || (ToolbarButtonSize = {}));
        // 配置新的看图组件
        const handleToTop = this.moveToTop.bind(this);
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
                handleToTop();
                // 当图片显示完成（加载完成）后，预加载下一张图片
                let index = ev.detail.index;
                if (index < pageCount - 1) {
                    index++;
                }
                const nextImg = firstBigImgURL.replace('p0', 'p' + index);
                const img = new Image();
                img.src = nextImg;
            },
            // 取消一些动画，比如切换图片时，图片从小变大出现的动画
            transition: false,
            keyboard: true,
            // 不显示 title（图片名和宽高信息）
            title: false,
            // 不显示缩放比例
            tooltip: false,
        });
        // 预加载第一张图片
        const img = new Image();
        img.src = firstBigImgURL;
        if (this.cfg.autoStart) {
            // 自动显示
            this.myViewer.show();
        }
    }
    // 设置原始尺寸显示
    setOriginalSize() {
        if (this.isOriginalSize) {
            // 1:1 显示图片
            this.myViewer.zoomTo(1);
            this.moveToTop();
        }
        else {
            // 缩小图片以适应可视区域
            const w = this.myViewer.image.naturalWidth;
            const h = this.myViewer.image.naturalHeight;
            const vw = this.myViewer.viewerData.width * 0.9;
            const vh = this.myViewer.viewerData.height * 0.9;
            const wScale = vw / w;
            const hScale = vh / h;
            let scale = Math.min(wScale, hScale);
            if (scale >= 1) {
                return;
            }
            this.myViewer.zoomTo(scale);
            const nowTop = Number.parseInt(this.myViewer.image.style.marginTop);
            this.myViewer.move(0, vh * 0.05 - nowTop);
        }
    }
    // 如果图片的高度超出可视区域高度，则从图片的顶部开始显示
    moveToTop() {
        const img = this.myViewer.image;
        const windowHeight = window.innerHeight;
        if (img.height <= windowHeight) {
            return;
        }
        // 如果图片高度大于视口高度，让它从顶部显示
        // 目的是把图片的 marginTop 设为 0，但不能直接修改 marginTop，否则鼠标拖动图片时会抖动
        const nowTop = Number.parseInt(this.myViewer.image.style.marginTop);
        this.myViewer.move(0, 0 - nowTop);
    }
    /**在图片查看器的工具栏里添加按钮
     *
     * 元素必须具有 id 属性，用于区分
     */
    addBtn(btn) {
        // 最后的查看器元素就是最新添加的查看器
        const allContainer = document.querySelectorAll('.viewer-container');
        const last = allContainer[allContainer.length - 1];
        const test = last.querySelector('#' + btn.id);
        if (test) {
            return;
        }
        const one2one = last.querySelector('.viewer-one-to-one');
        if (one2one) {
            return one2one.insertAdjacentElement('afterend', btn);
        }
        else {
            console.error('Add btn failed');
        }
    }
    // 在图片查看器里添加下载按钮
    addDownloadBtn() {
        const li = document.createElement('li');
        li.setAttribute('role', 'button');
        li.setAttribute('title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载') + ' (D)');
        li.classList.add(this.addBtnClass);
        li.textContent = '↓';
        li.id = 'imageViewerDownloadBtn';
        this.addBtn(li);
        li.addEventListener('click', () => {
            this.download();
        });
    }
    // 在图片查看器里添加收藏按钮
    addBookmarkBtn() {
        const li = document.createElement('li');
        li.setAttribute('role', 'button');
        li.setAttribute('title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_收藏') + ' (Alt + B)');
        li.classList.add(this.addBtnClass);
        li.style.fontSize = '14px';
        li.textContent = '❤';
        li.id = 'imageViewerBookmarkBtn';
        this.addBtn(li);
        li.addEventListener('click', async () => {
            this.addBookmark();
        });
    }
    async addBookmark() {
        // 显示提示
        _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].show(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_收藏'), {
            bgColor: '#333',
            position: 'mouse',
        });
        await _Bookmark__WEBPACK_IMPORTED_MODULE_8__["Bookmark"].add(this.cfg.workId, 'illusts', _Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].extractTags(this.workData));
        _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已收藏'));
    }
    // 下载当前查看的作品
    download() {
        // 因为 downloadFromViewer 状态会影响后续下载行为，所以必须先判断 busy 状态
        if (_store_States__WEBPACK_IMPORTED_MODULE_5__["states"].busy) {
            _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前任务尚未完成'));
            return;
        }
        _store_States__WEBPACK_IMPORTED_MODULE_5__["states"].downloadFromViewer = true;
        // 发送要下载的作品 id
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('crawlIdList', [
            {
                id: this.cfg.workId,
                type: 'unknown',
            },
        ]);
        // 显示提示
        _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].show(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已发送下载请求'), {
            bgColor: '#333',
            position: 'mouse',
        });
    }
}



/***/ }),

/***/ "./src/ts/InitPage.ts":
/*!****************************!*\
  !*** ./src/ts/InitPage.ts ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PageType */ "./src/ts/PageType.ts");
/* harmony import */ var _crawlMixedPage_InitHomePage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./crawlMixedPage/InitHomePage */ "./src/ts/crawlMixedPage/InitHomePage.ts");
/* harmony import */ var _crawlArtworkPage_InitArtworkPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./crawlArtworkPage/InitArtworkPage */ "./src/ts/crawlArtworkPage/InitArtworkPage.ts");
/* harmony import */ var _crawlMixedPage_InitUserPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./crawlMixedPage/InitUserPage */ "./src/ts/crawlMixedPage/InitUserPage.ts");
/* harmony import */ var _crawlMixedPage_InitBookmarkLegacyPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./crawlMixedPage/InitBookmarkLegacyPage */ "./src/ts/crawlMixedPage/InitBookmarkLegacyPage.ts");
/* harmony import */ var _crawlMixedPage_InitBookmarkPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./crawlMixedPage/InitBookmarkPage */ "./src/ts/crawlMixedPage/InitBookmarkPage.ts");
/* harmony import */ var _crawlArtworkPage_InitSearchArtworkPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./crawlArtworkPage/InitSearchArtworkPage */ "./src/ts/crawlArtworkPage/InitSearchArtworkPage.ts");
/* harmony import */ var _crawlArtworkPage_InitAreaRankingPage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./crawlArtworkPage/InitAreaRankingPage */ "./src/ts/crawlArtworkPage/InitAreaRankingPage.ts");
/* harmony import */ var _crawlArtworkPage_InitRankingArtworkPage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./crawlArtworkPage/InitRankingArtworkPage */ "./src/ts/crawlArtworkPage/InitRankingArtworkPage.ts");
/* harmony import */ var _crawlArtworkPage_InitPixivisionPage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./crawlArtworkPage/InitPixivisionPage */ "./src/ts/crawlArtworkPage/InitPixivisionPage.ts");
/* harmony import */ var _crawlArtworkPage_InitBookmarkDetailPage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./crawlArtworkPage/InitBookmarkDetailPage */ "./src/ts/crawlArtworkPage/InitBookmarkDetailPage.ts");
/* harmony import */ var _crawlMixedPage_InitBookmarkNewPage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./crawlMixedPage/InitBookmarkNewPage */ "./src/ts/crawlMixedPage/InitBookmarkNewPage.ts");
/* harmony import */ var _crawlArtworkPage_InitDiscoverPage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./crawlArtworkPage/InitDiscoverPage */ "./src/ts/crawlArtworkPage/InitDiscoverPage.ts");
/* harmony import */ var _crawlArtworkPage_InitNewArtworkPage__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./crawlArtworkPage/InitNewArtworkPage */ "./src/ts/crawlArtworkPage/InitNewArtworkPage.ts");
/* harmony import */ var _crawlNovelPage_InitNovelPage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./crawlNovelPage/InitNovelPage */ "./src/ts/crawlNovelPage/InitNovelPage.ts");
/* harmony import */ var _crawlNovelPage_InitNovelSeriesPage__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./crawlNovelPage/InitNovelSeriesPage */ "./src/ts/crawlNovelPage/InitNovelSeriesPage.ts");
/* harmony import */ var _crawlNovelPage_InitSearchNovelPage__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./crawlNovelPage/InitSearchNovelPage */ "./src/ts/crawlNovelPage/InitSearchNovelPage.ts");
/* harmony import */ var _crawlNovelPage_InitRankingNovelPage__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./crawlNovelPage/InitRankingNovelPage */ "./src/ts/crawlNovelPage/InitRankingNovelPage.ts");
/* harmony import */ var _crawlNovelPage_InitNewNovelPage__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./crawlNovelPage/InitNewNovelPage */ "./src/ts/crawlNovelPage/InitNewNovelPage.ts");
/* harmony import */ var _crawlArtworkPage_InitArtworkSeriesPage__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./crawlArtworkPage/InitArtworkSeriesPage */ "./src/ts/crawlArtworkPage/InitArtworkSeriesPage.ts");
/* harmony import */ var _crawlMixedPage_InitFollowingPage__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./crawlMixedPage/InitFollowingPage */ "./src/ts/crawlMixedPage/InitFollowingPage.ts");
// 根据不同的页面，初始化下载器的功能






















class InitPage {
    constructor() {
        this.initPage();
        // 页面类型变化时，初始化抓取流程
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitchedTypeChange, () => {
            setTimeout(() => {
                this.initPage();
            }, 0);
        });
    }
    initPage() {
        switch (_PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].type) {
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.Home:
                return new _crawlMixedPage_InitHomePage__WEBPACK_IMPORTED_MODULE_2__["InitHomePage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.Artwork:
                return new _crawlArtworkPage_InitArtworkPage__WEBPACK_IMPORTED_MODULE_3__["InitArtworkPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.UserHome:
                return new _crawlMixedPage_InitUserPage__WEBPACK_IMPORTED_MODULE_4__["InitUserPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.BookmarkLegacy:
                return new _crawlMixedPage_InitBookmarkLegacyPage__WEBPACK_IMPORTED_MODULE_5__["InitBookmarkLegacyPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.Bookmark:
                return new _crawlMixedPage_InitBookmarkPage__WEBPACK_IMPORTED_MODULE_6__["InitBookmarkPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.ArtworkSearch:
                return new _crawlArtworkPage_InitSearchArtworkPage__WEBPACK_IMPORTED_MODULE_7__["InitSearchArtworkPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.AreaRanking:
                return new _crawlArtworkPage_InitAreaRankingPage__WEBPACK_IMPORTED_MODULE_8__["InitAreaRankingPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.ArtworkRanking:
                return new _crawlArtworkPage_InitRankingArtworkPage__WEBPACK_IMPORTED_MODULE_9__["InitRankingArtworkPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.Pixivision:
                return new _crawlArtworkPage_InitPixivisionPage__WEBPACK_IMPORTED_MODULE_10__["InitPixivisionPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.BookmarkDetail:
                return new _crawlArtworkPage_InitBookmarkDetailPage__WEBPACK_IMPORTED_MODULE_11__["InitBookmarkDetailPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.NewArtworkBookmark:
                return new _crawlMixedPage_InitBookmarkNewPage__WEBPACK_IMPORTED_MODULE_12__["InitBookmarkNewPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.Discover:
                return new _crawlArtworkPage_InitDiscoverPage__WEBPACK_IMPORTED_MODULE_13__["InitDiscoverPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.NewArtwork:
                return new _crawlArtworkPage_InitNewArtworkPage__WEBPACK_IMPORTED_MODULE_14__["InitNewArtworkPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.Novel:
                return new _crawlNovelPage_InitNovelPage__WEBPACK_IMPORTED_MODULE_15__["InitNovelPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.NovelSeries:
                return new _crawlNovelPage_InitNovelSeriesPage__WEBPACK_IMPORTED_MODULE_16__["InitNovelSeriesPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.NovelSearch:
                return new _crawlNovelPage_InitSearchNovelPage__WEBPACK_IMPORTED_MODULE_17__["InitSearchNovelPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.NovelRanking:
                return new _crawlNovelPage_InitRankingNovelPage__WEBPACK_IMPORTED_MODULE_18__["InitRankingNovelPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.NewNovelBookmark:
                return new _crawlMixedPage_InitBookmarkNewPage__WEBPACK_IMPORTED_MODULE_12__["InitBookmarkNewPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.NewNovel:
                return new _crawlNovelPage_InitNewNovelPage__WEBPACK_IMPORTED_MODULE_19__["InitNewNovelPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.ArtworkSeries:
                return new _crawlArtworkPage_InitArtworkSeriesPage__WEBPACK_IMPORTED_MODULE_20__["InitArtworkSeriesPage"]();
            case _PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.Following:
                return new _crawlMixedPage_InitFollowingPage__WEBPACK_IMPORTED_MODULE_21__["InitFollowingPage"]();
            default:
                return;
        }
    }
}
new InitPage();


/***/ }),

/***/ "./src/ts/Lang.ts":
/*!************************!*\
  !*** ./src/ts/Lang.ts ***!
  \************************/
/*! exports provided: lang */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lang", function() { return lang; });
/* harmony import */ var _LangText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LangText */ "./src/ts/LangText.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config/Config */ "./src/ts/config/Config.ts");




// 语言类
class Lang {
    constructor() {
        this.langTypes = ['zh-cn', 'zh-tw', 'en', 'ja'];
        this.flagIndex = new Map([
            ['zh-cn', 0],
            ['zh-tw', 1],
            ['en', 2],
            ['ja', 3],
        ]);
        // 读取本地存储的设置
        const savedSettings = localStorage.getItem(_config_Config__WEBPACK_IMPORTED_MODULE_3__["Config"].settingStoreName);
        if (savedSettings) {
            // 有储存的设置
            const restoreData = JSON.parse(savedSettings);
            if (this.langTypes.includes(restoreData.userSetLang)) {
                // 恢复设置里的语言类型
                this.type = restoreData.userSetLang;
            }
            else {
                // 自动获取语言类型
                this.type = this.getLangType();
            }
        }
        else {
            // 如果没有储存的设置，则自动获取语言类型
            this.type = this.getLangType();
        }
        this.bindEvents();
    }
    bindEvents() {
        // 因为 Settings 初始化时会触发设置变化事件，所以监听事件即可获取语言设置
        // 本模块必须在 Settings 之前加载，否则监听不到 Settings 初始化的事件
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name !== 'userSetLang') {
                return;
            }
            const old = this.type;
            this.type = this.getType(data.value);
            if (this.type !== old) {
                _MsgBox__WEBPACK_IMPORTED_MODULE_2__["msgBox"].show(this.transl('_变更语言后刷新页面的提示'));
            }
        });
    }
    getType(flag) {
        return flag === 'auto' ? this.getLangType() : flag;
    }
    // 获取页面使用的语言，返回对应的 flag
    getLangType() {
        const userLang = document.documentElement.lang;
        switch (userLang) {
            case 'zh':
            case 'zh-CN':
            case 'zh-Hans':
                return 'zh-cn'; // 简体中文
            case 'ja':
                return 'ja'; // 日本語
            case 'zh-Hant':
            case 'zh-tw':
            case 'zh-TW':
                return 'zh-tw'; // 繁體中文
            default:
                return 'en'; // English
        }
    }
    // translate 翻译
    transl(name, ...arg) {
        let content = _LangText__WEBPACK_IMPORTED_MODULE_0__["langText"][name][this.flagIndex.get(this.type)];
        arg.forEach((val) => (content = content.replace('{}', val)));
        return content;
    }
}
const lang = new Lang();



/***/ }),

/***/ "./src/ts/LangText.ts":
/*!****************************!*\
  !*** ./src/ts/LangText.ts ***!
  \****************************/
/*! exports provided: langText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "langText", function() { return langText; });
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/Config */ "./src/ts/config/Config.ts");

// 储存下载器使用的多语言文本
// 在属性名前面加上下划线，和文本内容做出区别
// {} 是占位符
// <br> 是换行
const langText = {
    _type: ['cn', 'tw', 'en', 'ja'],
    _只下载已收藏: [
        '只下载已收藏',
        '只下載已收藏',
        'Download only bookmarked works',
        'ブックマークのみをダウンロードする',
    ],
    _下载作品类型: [
        '下载作品类型',
        '下載作品類型',
        'Download work type',
        'ダウンロード作品の種類',
    ],
    _下载作品类型的提示: [
        '下载哪些类型的作品',
        '下載哪些類型的作品。',
        'Which types of works to download',
        'どの種類の作品をダウンロードしますか',
    ],
    _不能含有tag: [
        '<span class="key">不能</span>含有标签',
        '<span class="key">不能</span>含有標籤',
        '<span class="key">Exclude</span> tag',
        'タグを除外する',
    ],
    _排除tag的提示文字: [
        '您可在下载前设置要排除的标签，这样在下载时将不会下载含有这些标签的作品。不区分大小写；如需排除多个标签，请使用英文逗号分隔。请注意要排除的标签的优先级大于要包含的tag的优先级。',
        '可在下載前設定要排除的標籤，下載時將排除含有這些標籤 的作品，不區分大小寫；如需排除多個標籤，請使用半形逗號（,）分隔。請注意，要排除的標籤 優先於要包含的標籤。',
        'Before downloading, you can set the tag you want to exclude. Not case sensitive; If you need to set multiple tags, you can use comma (,) separated. The excluded tag takes precedence over the included tag',
        'ダウンロード前に、除外するタグを設定できます。大文字と小文字を区別しない；複数のタグを設定する必要がある場合は、「,」で区切ってください。除外されたタグは、必要なタグよりも優先されます',
    ],
    _设置了排除tag之后的提示: [
        '排除标签：',
        '排除標籤：',
        'Excludes tag: ',
        '以下のタグを除外：',
    ],
    _必须含有tag: [
        '<span class="key">必须</span>含有标签',
        '<span class="key">必須</span>含有標籤',
        '<span class="key">Include</span> tag',
        '<span class="key">必要な</span>タグ',
    ],
    _必须tag的提示文字: [
        '您可在下载前设置作品里必须包含的标签，不区分大小写；如需包含多个标签，请使用英文逗号分隔。',
        '可在下載前設定作品裡必須包含的標籤，不區分大小寫；如需包含多個標籤，請使用半形逗號（,）分隔。',
        'Before downloading, you can set the tag that must be included. Not case sensitive; If you need to set multiple tags, you can use comma (,) separated. ',
        'ダウンロードする前に、必要なタグを設定することができます。大文字と小文字を区別しない；複数のタグを設定する必要がある場合は、「,」で区切ってください。',
    ],
    _设置了必须tag之后的提示: [
        '包含标签：',
        '包含標籤：',
        'Include tag: ',
        '以下の タグ を含める：',
    ],
    _筛选宽高的按钮文字: [
        '设置<span class="key">宽高</span>条件',
        '設定<span class="key">寬高</span>條件',
        'Set the <span class="key">width and height</span>',
        '幅と高さの条件を設定する',
    ],
    _筛选宽高的按钮Title: [
        '在下载前，您可以设置要下载的图片的宽高条件。',
        '在下載前可以設定要下載的圖片的寬高條件。',
        'Before downloading, you can set the width and height conditions of the images you want to download.',
        'ダウンロードする前に、画像の幅と高さの条件を設定できます。',
    ],
    _设置宽高比例: [
        '设置宽高<span class="key">比例</span>',
        '設定寬高<span class="key">比例</span>',
        'Set the aspect <span class="key">ratio</span>',
        '縦横比を設定する',
    ],
    _设置宽高比例Title: [
        '设置宽高比例，也可以手动输入宽高比',
        '設定寬高比，也可以手動輸入寬高比。',
        'Set the aspect ratio, or manually type the aspect ratio',
        '縦横比を設定する、手動で縦横比を入力することもできる',
    ],
    _不限制: ['不限制', '不限制', 'not limited', '無制限'],
    _横图: ['横图', '橫圖', 'Horizontal', '横長'],
    _竖图: ['竖图', '豎圖', 'Vertical', '縦長'],
    _正方形: ['正方形', '正方形', 'Square', '正方形'],
    _输入宽高比: ['宽高比 >=', '寬高比 >=', 'Aspect ratio >=', '縦横比 >='],
    _设置了宽高比之后的提示: [
        '宽高比：{}',
        '寬高比：{}',
        'Aspect ratio: {}',
        '縦横比：{}',
    ],
    _宽高比必须是数字: [
        '宽高比必须是数字',
        '寬高比必須是數字',
        'The aspect ratio must be a number',
        '縦横比は数値でなければなりません',
    ],
    _筛选宽高的提示文字: [
        '请输入最小宽度和最小高度，不会下载不符合要求的图片。',
        '請輸入最小寬度和最小高度，只會下載符合要求的圖片。',
        'Please type the minimum width and minimum height. Will not download images that do not meet the requirements',
        '最小幅と最小高さを入力してください。要件を満たしていない画像はダウンロードされません。',
    ],
    _本次输入的数值无效: [
        '本次输入的数值无效',
        '本次輸入的數值無效',
        'Invalid input',
        '無効な入力',
    ],
    _宽度: ['宽度', '寬度', 'Width', '幅'],
    _或者: [' 或者 ', ' 或是 ', ' or ', ' または '],
    _并且: [' 并且 ', ' 並且 ', ' and ', ' そして '],
    _高度: ['高度', '高度', 'height', '高さ'],
    _个数: [
        '设置作品数量',
        '設定作品數量',
        'Set the number of works',
        '作品数を設定する',
    ],
    _页数: [
        '设置页面数量',
        '設定頁面數量',
        'Set the number of pages',
        'ページ数を設定する',
    ],
    _筛选收藏数的按钮Title: [
        '在下载前，您可以设置对收藏数量的要求。',
        '下載前可以設定對收藏數量的要求。',
        'Before downloading, You can set the requirements for the number of bookmarks.',
        'ダウンロードする前に、ブックマークされた数の条件を設定することができます。',
    ],
    _设置收藏数量: [
        '设置<span class="key">收藏</span>数量',
        '設定<span class="key">收藏</span>數量',
        'Set the number of <span class="key">bookmarks</span>',
        'ブックマークされた数を設定する',
    ],
    _设置收藏数量的提示: [
        '如果作品的收藏数小于设置的数字，作品不会被下载。',
        '只會下載設定收藏數範圍內的作品。',
        'If the number of bookmarks of the work is less than the set number, the work will not be downloaded.',
        '作品のブックマークされた数が設定された数字よりも少ない場合、作品はダウンロードされません。',
    ],
    _筛选收藏数的提示文字: [
        '请输入一个数字，如果作品的收藏数小于这个数字，作品不会被下载。',
        '請輸入數字，只會下載設定收藏數範圍內的作品。',
        'Please type a number. If the number of bookmarks of the work is less than this number, the work will not be downloaded.',
        '数字を入力してください。 作品のブックマークされた数がこの数字より少ない場合、作品はダウンロードされません。',
    ],
    _收藏数大于: [
        '收藏数 >= ',
        '收藏數 >= ',
        'Number of bookmarks >= ',
        'ブックマークの数 >= ',
    ],
    _收藏数小于: [
        '收藏数 <= ',
        '收藏數 <= ',
        'Number of bookmarks <= ',
        'ブックマークの数 <= ',
    ],
    _本次任务已全部完成: [
        '本次任务已全部完成。',
        '本次工作已全部完成',
        'This task has been completed.',
        'この作業は完了しました。',
    ],
    _本次任务条件: [
        '本次任务条件: ',
        '本次工作條件：',
        'This task condition: ',
        'この作業の条件：',
    ],
    _参数不合法: [
        '参数不合法，本次操作已取消。',
        '參數不合法，本次動作已取消。',
        'Parameter is not legal, this operation has been canceled.',
        'パラメータは有効ではありません。この操作はキャンセルされました。',
    ],
    _向下获取所有作品: [
        '向下获取所有作品',
        '向下取得所有作品',
        'download all the work from this page.',
        'このページからすべての作品をダウンロードする。',
    ],
    _从本页开始下载提示: [
        '从本页开始下载<br>如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
        '從本頁開始下載。<br>如果要限制下載的頁數，請輸入從 1 開始的數字，1 為僅下載本頁。',
        'Download from this page<br>If you want to set the number of pages to download, type a number starting at 1. This page is 1.',
        'このページからダウンロードする<br>ダウンロードするページを設定する場合は、1から始まる数字を入力してください。 1は現在のページのみをダウンロードする。',
    ],
    _下载所有页面: [
        '下载所有页面',
        '下載所有頁面',
        'download all pages',
        'すべてのページをダウンロードする',
    ],
    _下载x个相关作品: [
        '下载 {} 个相关作品',
        '下載 {} 個相關作品',
        'download {} related works.',
        '関連作品 {} 枚をダウンロードする。',
    ],
    _下载所有相关作品: [
        '下载所有相关作品',
        '下載所有相關作品',
        'download all related works.',
        '関連作品をすべてダウンロードする。',
    ],
    _下载推荐作品: [
        '下载推荐作品',
        '下載推薦作品',
        'download recommend works',
        'お勧め作品をダウンロードする',
    ],
    _下载排行榜前x个作品: [
        '下载排行榜前 {} 个作品',
        '下載排行榜前 {} 個作品',
        'download the top {} works in the ranking list',
        'ランク前 {} 位の作品をダウンロードする。',
    ],
    _输入超过了最大值: [
        '您输入的数字超过了最大值',
        '輸入的數字超出最大值',
        'The number you set exceeds the maximum',
        '入力した番号が最大値を超えています',
    ],
    _从本页开始下载x页: [
        '从本页开始下载 {} 页',
        '從本頁開始下載 {} 頁',
        'download {} pages from this page',
        'このページから {} ページをダウンロードする',
    ],
    _从本页开始下载x个: [
        '从本页开始下载 {} 个作品',
        '從本頁開始下載 {} 個作品',
        'Download {} works from this page.',
        'このページから {} 枚の作品をダウンロード。',
    ],
    _任务开始0: ['任务开始', '工作開始', 'Task starts', '作業が開始されます'],
    _排除作品类型: [
        '排除作品类型：',
        '排除作品類型：',
        'Excludes these types of works: ',
        'これらのタイプの作品を除外：',
    ],
    _多图作品: [
        '多图作品',
        '多圖作品',
        'Multi-image works',
        'マルチイメージ作品',
    ],
    _多图下载设置: [
        '多图下载设置',
        '多圖下載設定',
        'Download multi-image works',
        'マルチイメージ設定',
    ],
    _不下载: ['不下载', '不下載', 'No', '必要なし'],
    _全部下载: ['全部下载', '全部下載', 'Yes', '全部ダウンロード'],
    _插画: ['插画', '插畫', 'Illustrations', 'イラスト'],
    _漫画: ['漫画', '漫畫', 'Manga', '漫画'],
    _动图: ['动图', '動圖', 'Ugoira', 'うごイラ'],
    _动图保存格式: [
        '<span class="key">动图</span>保存格式',
        '<span class="key">動圖</span>儲存格式',
        'Save the <span class="key">ugoira</span> work as',
        'うごイラの保存タイプ',
    ],
    _动图保存格式title: [
        '下载动图时，可以把它转换成视频文件',
        '下載動圖時，可轉換為影片檔。',
        'When you download a ugoira work, you can convert it to a video file.',
        'うごイラをダウンロードするとき、動画に変換することができます。',
    ],
    _webmVideo: ['WebM 视频', '影片（WebM）', 'WebM video', 'WebM ビデオ'],
    _gif: ['GIF 图片', '圖片（GIF）', 'GIF picture', 'GIF 画像'],
    _apng: ['APNG 图片', '圖片（APNG）', 'APNG picture', 'APNG 画像'],
    _zipFile: ['Zip 文件', '壓縮檔（Zip）', 'Zip file', 'ZIP ファイル'],
    _当前作品个数: [
        '当前有 {} 个作品 ',
        '目前有 {} 個作品 ',
        'There are now {} works ',
        '今は　{}　枚の作品があります ',
    ],
    _当前有x个用户: [
        '当前有 {} 个用户 ',
        '目前有 {} 個使用者 ',
        'There are currently {} users ',
        '現在 {} 人のユーザーがいます ',
    ],
    _排行榜进度: [
        '已抓取本页面第{}部分',
        '已擷取本頁面第 {} 部分',
        'Part {} of this page has been crawled',
        'このページの第　{}　部がクロールされました',
    ],
    _新作品进度: [
        '已抓取本页面 {} 个作品',
        '已擷取本頁面 {} 個作品',
        'This page has been crawled {} works',
        'このページの {} つの作品をクロールしました',
    ],
    _抓取多少个作品: [
        '抓取本页面 {} 个作品',
        '擷取本頁面 {} 個作品',
        'Crawl this page {} works',
        'このページの {} つの作品をクロールします',
    ],
    _相关作品抓取完毕: [
        '相关作品抓取完毕。包含有{}个作品，开始获取作品信息。',
        '相關作品擷取完畢。包含有 {} 個作品，開始取得作品資訊。',
        'The related works have been crawled. Contains {} works and starts getting information about the work.',
        '関連作品はクロールされました。 {} 作品を含み、その作品に関する情報の取得を開始します。',
    ],
    _排行榜任务完成: [
        '本页面抓取完毕。<br>当前有{}个作品，开始获取作品信息。',
        '本頁面擷取完畢。<br>目前有 {} 個作品，開始取得作品資訊。',
        'This page is crawled and now has {} works.<br> Start getting the works for more information.',
        'このページのクロール終了。<br>{}枚の作品があります。 作品情報の取得を開始します。',
    ],
    _开始获取作品信息: [
        '开始获取作品信息',
        '開始取得作品資訊',
        'Start getting work data',
        '作品情報の取得を開始します',
    ],
    _列表页抓取进度: [
        '已抓取列表页{}个页面',
        '已擷取清單頁 {} 個頁面',
        'Has acquired {} list pages',
        '{} のリストページを取得しました',
    ],
    _列表页抓取完成: [
        '列表页面抓取完成',
        '清單頁面擷取完成',
        'The list page is crawled',
        'リストページがクロールされ',
    ],
    _抓取结果为零: [
        '抓取完毕，但没有找到符合筛选条件的作品。',
        '擷取完畢，但沒有找到符合篩選條件的作品。',
        'Crawl complete but did not find works that match the filter criteria.',
        'クロールは終了しましたが、フィルタ条件に一致する作品が見つかりませんでした。',
    ],
    _当前任务尚未完成: [
        '当前任务尚未完成',
        '目前工作尚未完成',
        'The current task has not yet been completed',
        '現在の作業はまだ完了していません',
    ],
    _当前任务尚未完成2: [
        '当前任务尚未完成，请等待完成后再下载。',
        '目前工作尚未完成，請等待完成後再下載。',
        'The current task has not yet been completed',
        '現在の作業はまだ完了していません、完了するまでお待ちください',
    ],
    _列表抓取完成开始获取作品页: [
        '当前列表中有{}张作品，开始获取作品信息',
        '目前清單中有 {} 張作品，開始取得作品資訊',
        'Now has {} works. Start getting the works for more information.',
        '{} 枚の作品があります。 作品情報の取得を開始します。',
    ],
    _开始获取作品页面: [
        '开始获取作品页面',
        '開始取得作品頁面',
        'Start getting the works page',
        '作品ページの取得を開始する',
    ],
    _无权访问: [
        '无权访问 {}，跳过该作品。',
        '沒有權限存取 {}，跳過該作品。',
        'No access {}, skip.',
        '{} のアクセス権限がありません、作品を無視する。',
    ],
    _作品页状态码0: [
        '请求的url不可访问',
        '要求的 url 無法存取',
        'The requested url is not accessible',
        '要求された URL にアクセスできません',
    ],
    _作品页状态码400: [
        '该作品已被删除',
        '該作品已被刪除',
        'The work has been deleted',
        '作品は削除されました',
    ],
    _作品页状态码403: [
        '无权访问请求的url 403',
        '沒有權限存取要求的 url 403',
        'Have no access to the requested url 403',
        'リクエストされた url にアクセスできない 403',
    ],
    _作品页状态码404: [
        '404 not found',
        '404 not found',
        '404 not found',
        '404 not found',
    ],
    _正在抓取: [
        '正在抓取，请等待……',
        '擷取中，請稍後……',
        'Getting, please wait...',
        'クロール中、しばらくお待ちください...',
    ],
    _获取全部书签作品: [
        '获取全部书签作品，时间可能比较长，请耐心等待。',
        '取得全部書籤作品，時間可能比較長，請耐心等待。',
        'Get all bookmarked works, the time may be longer, please wait.',
        'ブックマークしたすべての作品を取得すると、時間がかかることがあります。お待ちください。',
    ],
    _抓取图片网址遇到中断: [
        '当前任务已中断!',
        '目前工作已中斷！',
        'The current task has been interrupted.',
        '現在の作業が中断されました。',
    ],
    _关闭: ['关闭', '關閉', 'close', 'クローズ'],
    _输出信息: ['输出信息', '輸出資訊', 'Output information', '出力情報'],
    _复制: ['复制', '複製', 'Copy', 'コピー'],
    _已复制到剪贴板: [
        '已复制到剪贴板，可直接粘贴',
        '已複製至剪貼簿，可直接貼上',
        'Has been copied to the clipboard',
        'クリップボードにコピーされました',
    ],
    _下载设置: ['下载设置', '下載設定', 'Download settings', 'ダウンロード設定'],
    _收起展开设置项: [
        '收起/展开设置项',
        '摺疊/展開設定項目',
        'Collapse/expand settings',
        '設定の折りたたみ/展開',
    ],
    _github: [
        'Github 页面，欢迎 star',
        'Github 頁面，歡迎 star',
        'Github page, if you like, please star it',
        'Github のページ、star をクリックしてください',
    ],
    _wiki: ['使用手册', 'Wiki', 'Wiki', 'マニュアル'],
    _快捷键切换显示隐藏: [
        '使用 Alt + X，可以显示和隐藏下载面板',
        'Alt + X 可以顯示或隱藏下載面板。',
        'Use Alt + X to show and hide the download panel',
        'Alt + X てダウンロードパネルを表示および非表示にする',
    ],
    _隐藏下载面板: [
        '隐藏下载面板（Alt + X）',
        '隱藏下載面板（Alt + X）',
        'Hide the download panel (Alt + X)',
        'ダウンロードパネルを非表示にする（Alt + X）',
    ],
    _共抓取到n个文件: [
        '共抓取到 {} 个文件',
        '共擷取到 {} 個檔案',
        'Crawl a total of {} files',
        '合計 {} つのファイルがあります',
    ],
    _共抓取到n个作品: [
        '共抓取到 {} 个作品',
        '共擷取到 {} 個作品',
        'Crawl a total of {} works',
        '合計 {} つの作品があります',
    ],
    _命名规则: ['命名规则', '命名規則', 'Naming rule', '命名規則'],
    _设置文件夹名的提示: [
        "可以使用 '/' 建立文件夹。示例：",
        '可以使用斜線（/）建立資料夾。範例：',
        "You can create a directory with '/'. Example：",
        "フォルダーは '/' で作成できます。例：",
    ],
    _添加命名标记前缀: [
        '添加命名标记<span class="key">前缀</span>',
        '加入命名標記<span class="key">前綴</span>',
        'Add named tag <span class="key">prefix</span>',
        '前にタグの名前を追加',
    ],
    _添加字段名称提示: [
        `例如，在用户名前面添加“user_”标记`,
        '例如，在使用者名稱前面加入「user_」標記。',
        `For example, add the 'user_' tag in front of the username`,
        'たとえば、ユーザー名の前に 「user_」タグを追加します。',
    ],
    _命名标记id: [
        '默认文件名，如 44920385_p0',
        '預設檔案名稱，例如：44920385_p0。',
        'Default file name, for example 44920385_p0',
        'デフォルトのファイル名，例 44920385_p0',
    ],
    _命名标记title: ['作品标题', '作品標題', 'Works title', '作品のタイトル'],
    _命名标记tags: [
        '作品的标签列表',
        '作品的標籤清單',
        'The tags of the work',
        '作品のタグ',
    ],
    _命名标记user: ['用户名字', '使用者名稱', 'User name', 'ユーザー名'],
    _用户id: ['用户 ID', '使用者 ID', 'User ID', 'ユーザー ID'],
    _命名标记px: ['宽度和高度', '寬度和高度', 'Width and height', '幅と高さ'],
    _命名标记bmk: [
        'Bookmark count，作品的收藏数。把它放在最前面可以让文件按收藏数排序。',
        'Bookmark count，作品的收藏數。將它放在最前面可以讓檔案依收藏數排序。',
        'Bookmark count, bookmarks number of works.',
        'Bookmark count，作品のボックマークの数、前に追加することでボックマーク数で并べることができます。',
    ],
    _命名标记bmk_1000: [
        '作品收藏数的简化显示。例如：0+、1000+、2000+、15000+',
        '作品收藏數的簡化顯示。例如：0+、1000+、2000+、15000+',
        'Simplified number of bookmark, e.g. 0+、1000+、2000+、15000+',
        '作品のボックマークの数の簡略表示。 例：0+、1000+、2000+、15000+',
    ],
    _命名标记like: [
        'Like count，作品的点赞数。',
        'Like count，作品的點讚數。',
        'Like count.',
        'Like count。',
    ],
    _命名标记view: [
        'View count，作品的浏览量。',
        'View count，作品的瀏覽量。',
        'View count.',
        'View count。',
    ],
    _命名标记id_num: [
        '数字 id，如 44920385',
        '數字 id，例如：44920385。',
        'Number id, for example 44920385',
        '44920385 などの番号 ID',
    ],
    _命名标记p_num: [
        '图片在作品内的序号，如 0、1、2 …… 每个作品都会重新计数。',
        '圖片在作品內的序號，例如：0、1、2……每個作品都將重新計數。',
        'The serial number of the picture in the work, such as 0, 1, 2 ... Each work will be recounted.',
        '0、1、2 など、作品の画像のシリアル番号。各ピースは再集計されます。',
    ],
    _命名标记tags_trans: [
        '作品的标签列表，附带翻译后的标签（如果有）',
        '作品的標籤清單，包含翻譯後的標籤（如果有的話）。',
        'The tags of the work, with the translated tag (if any)',
        '作品のタグリスト、翻訳付きタグ(あれば)',
    ],
    _命名标记tags_transl_only: [
        '翻译后的标签列表',
        '譯後的標籤清單。',
        'Translated tags',
        '翻訳后のタグリスト',
    ],
    _命名标记date: [
        '作品的创建时间。如 2019-08-29',
        '作品的建立時間。例如：2019-08-29。',
        'The time the creation of the work. Such as 2019-08-29',
        '作品の作成時間。例 2019-08-29',
    ],
    _命名标记rank: [
        '作品在排行榜中的排名。如 #1、#2 …… 只能在排行榜页面中使用。',
        '作品在排行榜中的排名。例如：#1、#2……只能在排行榜頁面中使用。',
        'The ranking of the work in the ranking pages. Such as #1, #2 ... Can only be used in ranking pages.',
        '作品のランキング。例え　#1、#2 …… ランキングページのみで使用できます。',
    ],
    _命名标记type: [
        '作品类型，分为',
        '作品類型，分為',
        'The type of work, divided into',
        '作品分類は',
    ],
    _命名标记提醒: [
        '为了防止文件名重复，命名规则里一定要包含 {id} 或者 {id_num}{p_num}。<br>您可以使用多个标记；建议在不同标记之间添加分割用的字符。示例：{id}-{userid}<br>* 在某些情况下，会有一些标记不可用。',
        '為了防止檔名重複，命名規則裡一定要包含 {id} 或者 {id_num}{p_num}。可以使用多個標記；建議在不同標記之間加入分隔用的字元。範例：{id}-{userid}<br>＊某些情況下有些標記無法使用。',
        'To prevent duplicate file names, {id} or {id_num}{p_num} must be included in the naming rules.<br>You can use multiple tags, and you can add a separate character between different tags. Example: {id}-{userid}<br>* In some cases, some tags will not be available.',
        'ファイル名の重複を防ぐために、命名規則には {id} または {id_num}{p_num} を含める必要があります。<br>複数のタグを使用することができます；異なるタグ間の分割のために文字を追加することをお勧めします。例：{id}-{userid}<br>* 場合によっては、一部のタグが利用できず。',
    ],
    _命名规则一定要包含id: [
        '为了防止文件名重复，命名规则里一定要包含 {id} 或者 {id_num}{p_num}',
        '為了防止檔名重複，命名規則裡一定要包含 {id} 或者 {id_num}{p_num}。',
        'To prevent duplicate file names, {id} or {id_num}{p_num} must be included in the naming rules.',
        'ファイル名の重複を防ぐために、命名規則には {id} または {id_num}{p_num} を含める必要があります。',
    ],
    _文件夹标记PTag: [
        '当前页面的标签。当前页面没有标签时不可用。',
        '目前頁面的標籤。目前頁面沒有標籤時無法使用。',
        'The tag of the current page. Not available if the current page has no tag.',
        '現在のページのタグ。現在のページのタグ がないときは使用できません。',
    ],
    _命名标记seriesTitle: [
        '系列标题（可能为空）',
        '系列標題（可能為空）',
        'Series title (may be empty)',
        'シリーズタイトル（あれば）',
    ],
    _命名标记seriesOrder: [
        '作品在系列中的序号，如 #1 #2',
        '作品在系列中的編號，如 #1 #2',
        'The number of the work in the series, such as #1 #2',
        'シリーズの中の作品の番号，例え #1 #2',
    ],
    _文件夹标记PTitle: [
        '当前页面的标题',
        '目前頁面的標題',
        'The title of this page',
        'ページのタイトル',
    ],
    _预览文件名: [
        '预览文件名',
        '預覽檔案名稱',
        'Preview file name',
        'ファイル名のプレビュー',
    ],
    _设置下载线程: [
        '设置下载<span class="key">线程</span>',
        '設定下載<span class="key">執行緒</span>',
        'Set the download <span class="key">thread</span>',
        'ダンロードスレッドの設定',
    ],
    _线程数字: [
        `可以输入 1-${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].downloadThreadMax} 之间的数字，设置同时下载的数量`,
        `可以輸入 1-${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].downloadThreadMax} 之間的數字，設定同時下載的數量。`,
        `You can type a number between 1-${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].downloadThreadMax} to set the number of concurrent downloads`,
        `同時ダウンロード数を設定、1-${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].downloadThreadMax} の数値を入力してください`,
    ],
    _开始下载: ['开始下载', '開始下載', 'start download', '開始'],
    _暂停下载: ['暂停下载', '暫停下載', 'pause download', '一時停止'],
    _停止下载: ['停止下载', '停止下載', 'stop download', '停止'],
    _复制url: ['复制 url', '複製下載網址', 'copy urls', 'URL をコピー'],
    _当前状态: ['当前状态 ', '目前狀態：', 'State ', '現在の状態 '],
    _未开始下载: [
        '未开始下载',
        '未開始下載',
        'Not yet started downloading',
        'まだダウンロードを開始していません',
    ],
    _下载进度: ['下载进度', '下載進度', 'Total progress', '概要'],
    _下载线程: ['下载线程：', '下載執行緒：', 'Thread: ', 'スレッド：'],
    _常见问题: ['常见问题', '常見問題', 'Help', 'よくある質問'],
    _uuid: [
        '如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。',
        '如果下載後的檔案名稱異常，請停用其他有下載功能的瀏覽器擴充功能。',
        'If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.',
        'ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。',
    ],
    _下载说明: [
        '下载的文件保存在浏览器的下载目录里。<br><br>建议在浏览器的下载设置中关闭“下载前询问每个文件的保存位置”。<br><br>如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。<br><br>如果你使用 ssr、v2ray 等代理软件，开启全局代理有助于提高下载速度。<br><br>QQ群：675174717',
        '下載的檔案儲存在瀏覽器的下載目錄裡。<br><br>請不要在瀏覽器的下載選項裡選取「下載每個檔案前先詢問儲存位置」。<br><br>如果下載後的檔名異常，請停用其他有下載功能的瀏覽器擴充功能。',
        'The downloaded file is saved in the browser`s download directory. <br><br>It is recommended to turn off "Ask where to save each file before downloading" in the browser`s download settings.<br><br>If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.',
        'ダウンロードしたファイルは、ブラウザのダウンロードディレクトリに保存されます。<br><br>ブラウザのダウンロード設定で 「 ダウンロード前に各ファイルの保存場所を確認する 」 をオフにすることをお勧めします。<br><br>ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。',
    ],
    _下载说明提示2: [
        '下载的文件保存在浏览器的下载目录里。<br><br>建议您在浏览器的下载设置中关闭“下载前询问每个文件的保存位置”。<br><br>如果你使用 ssr、v2ray 等代理软件，开启全局代理有助于提高下载速度。',
        '下載的檔案儲存在瀏覽器的下載目錄裡。<br><br>請不要在瀏覽器的下載選項裡選取「下載每個檔案前先詢問儲存位置」。',
        'The downloaded file is saved in the browser`s download directory. <br><br>It is recommended to turn off "Ask where to save each file before downloading" in the browser`s download settings.',
        'ダウンロードしたファイルは、ブラウザのダウンロードディレクトリに保存されます。<br><br>ブラウザのダウンロード設定で 「 ダウンロード前に各ファイルの保存場所を確認する 」 をオフにすることをお勧めします。',
    ],
    _正在下载中: ['正在下载中', '正在下載', 'Downloading', 'ダウンロード中'],
    _下载完毕: [
        '✓ 下载完毕',
        '✓ 下載完畢',
        '✓ Download complete',
        '✓ ダウンロードが完了しました',
    ],
    _下载完毕2: [
        '下载完毕',
        '下載完畢',
        'Download complete',
        'ダウンロードが完了しました',
    ],
    _已暂停: [
        '下载已暂停',
        '下載已暫停',
        'Download is paused',
        'ダウンロードは一時停止中です',
    ],
    _已停止: [
        '下载已停止',
        '下載已停止',
        'Download stopped',
        'ダウンロードが停止しました',
    ],
    _已下载: ['已下载', '已下載', 'downloaded', 'downloaded'],
    _抓取完毕: [
        '抓取完毕！',
        '擷取完畢！',
        'Crawl complete!',
        'クロールが終了しました！',
    ],
    _快速下载本页: [
        '快速下载本页作品',
        '快速下載本頁作品',
        'Download this work quickly',
        'この作品をすばやくダウンロードする',
    ],
    _从本页开始抓取new: [
        '从本页开始抓取新作品',
        '從本頁開始擷取新作品',
        'Crawl the new works from this page',
        'このページから新しい作品を入手する',
    ],
    _从本页开始抓取old: [
        '从本页开始抓取旧作品',
        '從本頁開始擷取舊作品',
        'Crawl the old works from this page',
        'このページから古い作品を入手する',
    ],
    _抓取推荐作品: [
        '抓取推荐作品',
        '擷取推薦作品',
        'Crawl the recommend works',
        '推奨作品をダウンロードする',
    ],
    _抓取推荐作品Title: [
        '抓取页面底部的的推荐作品',
        '擷取頁面底部的推薦作品。',
        'Crawl the recommended works at the bottom of the page',
        'ページの下部で推奨作品をクロールします',
    ],
    _抓取相关作品: [
        '抓取相关作品',
        '擷取相關作品',
        'Crawl the related works',
        '関連作品をダウンロードする',
    ],
    _相关作品大于0: [
        ' （下载相关作品必须大于 0）',
        ' （下載相關作品必須大於 0）',
        '  (Download related works must be greater than 0)',
        ' 「ダウンロードする関連作品の数は0より大きくなければならない」',
    ],
    _默认下载多页: [
        ', 如有多页，默认会下载全部。',
        '，如有多頁，預設會下載全部。',
        ', If there are multiple pages, the default will be downloaded.',
        '、複数のページがある場合、デフォルトですべてをダウンロードされます。',
    ],
    _调整完毕: [
        '调整完毕，当前有{}个作品。',
        '調整完畢，目前有 {} 個作品。',
        'The adjustment is complete and now has {} works.',
        '調整が完了し、今、{} の作品があります。',
    ],
    _抓取当前作品: [
        '抓取当前作品',
        '擷取目前作品',
        'Crawl the current work',
        '現在の作品をクロールする',
    ],
    _抓取当前作品Title: [
        '抓取当前列表里的所有作品',
        '擷取目前清單裡的所有作品',
        'Crawl all the works in the current list',
        '現在のリスト内のすべての作品をクロールする',
    ],
    _清除多图作品: [
        '清除多图作品',
        '清除多圖作品',
        'Remove multi-drawing works',
        '複数の作品を削除する',
    ],
    _清除多图作品Title: [
        '如果不需要可以清除多图作品',
        '如果不需要可以清除多圖作品。',
        'If you do not need it, you can delete multiple graphs',
        '必要がない場合は、複数のグラフを削除することができます',
    ],
    _清除动图作品: [
        '清除动图作品',
        '清除動圖作品',
        'Remove ugoira work',
        'うごイラ作品を削除する',
    ],
    _清除动图作品Title: [
        '如果不需要可以清除动图作品',
        '如果不需要可以清除動圖作品。',
        'If you do not need it, you can delete the ugoira work',
        '必要がない場合は、うごイラを削除することができます',
    ],
    _手动删除作品: [
        '手动删除作品',
        '手動刪除作品',
        'Manually delete the work',
        '作品を手動で削除する',
    ],
    _手动删除作品Title: [
        '可以在下载前手动删除不需要的作品',
        '可以在下載前手動刪除不需要的作品，點擊作品刪除。',
        'You can manually delete unwanted work before downloading',
        'ダウンロードする前に不要な作品を手動で削除することができます',
    ],
    _退出手动删除: [
        '退出手动删除',
        '結束手動刪除',
        'Exit manually delete',
        '削除モードを終了する',
    ],
    _抓取本页作品: [
        '抓取本页作品',
        '擷取本頁作品',
        'Crawl this page works',
        'このページをクロールする',
    ],
    _抓取本页作品Title: [
        '抓取本页列表中的所有作品',
        '擷取本頁清單中的所有作品',
        'Crawl this page works',
        'このページの全ての作品をクロールする',
    ],
    _抓取本排行榜作品: [
        '抓取本排行榜作品',
        '擷取本排行榜作品',
        'Crawl the works in this list',
        'このリストの作品をクロールする',
    ],
    _抓取本排行榜作品Title: [
        '抓取本排行榜的所有作品，包括现在尚未加载出来的。',
        '擷取本排行榜的所有作品，包括現在尚未載入出來的。',
        'Crawl all of the works in this list, including those that are not yet loaded.',
        'まだ読み込まれていないものを含めて、このリストの作品をダウンロードする',
    ],
    _抓取首次登场的作品: [
        '抓取首次登场作品',
        '擷取首次登場作品',
        'Crawl the debut works',
        '初登場作品をダウンロードする',
    ],
    _抓取首次登场的作品Title: [
        '只下载首次登场的作品',
        '只下載首次登場的作品',
        'Download only debut works',
        '初登場作品のみダウンロードします',
    ],
    _抓取该页面的图片: [
        '抓取该页面的图片',
        '擷取該頁面的圖片',
        'Crawl the picture of the page',
        'ページの画像をクロールする',
    ],
    _抓取相似图片: [
        '抓取相似图片',
        '擷取相似圖片',
        'Crawl similar works',
        '類似の作品をクロールする',
    ],
    _想要获取多少个作品: [
        '您想要获取多少个作品？',
        '想要取得多少個作品？',
        'How many works do you want to download?',
        'いくつの作品をダウンロードしたいですか？',
    ],
    _数字提示1: [
        '-1, 或者大于 0',
        '-1 或是大於 0',
        '-1, or greater than 0',
        '-1、または 0 より大きい',
    ],
    _下载大家的新作品: [
        '下载大家的新作品',
        '下載大家的新作品',
        'Download everyone`s new work',
        'みんなの新作をダウンロードする',
    ],
    _屏蔽设定: ['屏蔽設定', '封鎖設定', 'Mute settings', 'ミュート設定'],
    _举报: ['举报', '回報', 'Report', '報告'],
    _输入id进行抓取: [
        '输入 id 进行抓取',
        '輸入 id 進行擷取',
        'Type id to crawl',
        'idを入力してダウンロードする',
    ],
    _输入id进行抓取的提示文字: [
        '请输入作品 id。如果有多个 id，则以换行分割（即每行一个id）',
        '請輸入作品 id。如果有多個 id，則以換行分隔（即每行一個 id）。',
        'Please type the illustration id. If there is more than one id, one id per line.',
        'イラストレーターIDを入力してください。 複数の id がある場合は、1 行に 1 つの id を付けます。',
    ],
    _开始抓取: ['开始抓取', '開始擷取', 'Start crawl', 'クロールを開始する'],
    _给未分类作品添加添加tag: [
        '给未分类作品添加标签',
        '幫未分類的作品加入標籤',
        'Add tag to unclassified work',
        '未分類の作品にタグを追加',
    ],
    _id不合法: ['id不合法', 'id 不合法', 'id is illegal', 'id が不正な'],
    _快速收藏: [
        '快速收藏',
        '快速收藏',
        'Quick bookmarks',
        'クイックブックマーク',
    ],
    _启用: ['启用', '啟用', 'Enable', '有効にする'],
    _自动开始下载: [
        '<span class="key">自动</span>开始下载',
        '<span class="key">自動</span>開始下載',
        'Download starts <span class="key">automatically</span>',
        'ダウンロードは自動的に開始されます',
    ],
    _快速下载的提示: [
        '当“开始下载”状态可用时，自动开始下载，不需要点击下载按钮。',
        '當可下載時自動開始下載，不需要點選下載按鈕。',
        'When the &quot;Start Downloa&quot; status is available, the download starts automatically and no need to click the download button.',
        '「ダウンロードを開始する」ステータスが利用可能になると、ダウンロードは自動的に開始され、ダウンロードボタンをクリックする必要はありません。',
    ],
    _转换任务提示: [
        '正在转换 {} 个文件',
        '正在轉換 {} 個檔案',
        'Converting {} files',
        '{} ファイルの変換',
    ],
    _最近更新: ['最近更新', '最近更新', 'What`s new', '最近更新する'],
    _确定: ['确定', '確定', 'Ok', '確定'],
    _file404: [
        '404 错误：文件 {} 不存在。',
        '404 錯誤：檔案 {} 不存在。',
        '404 error: File {} does not exist.',
        '404 エラー：ファイル {} は存在しません。',
    ],
    _文件下载失败: [
        '文件 {} 下载失败',
        '檔案 {} 下載失敗',
        'File {} download failed',
        'ファイル {} のダウンロードを失敗しました',
    ],
    _是否重置设置: [
        '是否重置设置？',
        '確定要重設設定嗎？',
        'Do you want to reset the settings?',
        '設定をリセットしますか？',
    ],
    _newver: [
        '有新版本可用',
        '有新版本可更新',
        'A new version is available',
        '新しいバージョンがあります',
    ],
    _快速下载建立文件夹: [
        '快速下载时，始终创建文件夹',
        '快速下載時，始終建立資料夾',
        'Always create folder when downloading quickly',
        'クイックダウンロード時、常にフォルダを作成します',
    ],
    _快速下载建立文件夹提示: [
        '快速下载时，如果只有一张图片，也会建立文件夹',
        '快速下載時，若只有一張圖片，也會建立資料夾',
        'When downloading quickly, if there is only one picture, a folder is also created',
        'すばやくダウンロードとき、イラストが一枚だけでも、フォルダも作成されます',
    ],
    _设置id范围: [
        '设置 <span class="key">ID</span> 范围',
        '設定 <span class="key">ID</span> 範圍',
        'Set <span class="key">ID</span> range',
        '<span class="key">ID</span> 範囲を設定',
    ],
    _设置id范围提示: [
        '您可以输入一个作品 id，抓取比它新或者比它旧的作品',
        '可以輸入一個作品 id，擷取比它新或者比它舊的作品。',
        'You can type a work id and crawl works that are newer or older than it',
        '1 つの作品 id を入力することで、それより新しいあるいは古い作品をクロールことができます',
    ],
    _大于: ['大于', '大於', 'Bigger than', 'より大きい'],
    _小于: ['小于', '小於', 'Less than', 'より小さい'],
    _设置投稿时间: [
        '设置投稿<span class="key">时间</span>',
        '設定投稿<span class="key">時間</span>',
        'Set posting <span class="key">date</span>',
        '投稿日時を設定する',
    ],
    _设置投稿时间提示: [
        '您可以下载指定时间内发布的作品',
        '可以下載指定時間內發布的作品。',
        'You can download works posted in a specified period of time',
        '指定された時間内に配信された作品をダウンロードすることができます',
    ],
    _时间范围: ['时间范围', '時間範圍', 'Time range', '時間範囲'],
    _必须大于0: [
        '必须大于 0',
        '必須大於 0',
        'must be greater than 0',
        '0 より大きくなければなりません',
    ],
    _开始筛选: ['开始筛选', '開始篩選', 'Start screening', 'スクリーニング開始'],
    _开始筛选Title: [
        '按照设置来筛选当前标签里的作品。',
        '按照設定來篩選目前標籤裡的作品。',
        'Screen the works in the current tag.',
        '現在のタグにある作品を設定によってスクリーニングする',
    ],
    _在结果中筛选: [
        '在结果中筛选',
        '在結果中篩選',
        'Screen in results',
        '結果の中からスクリーニング',
    ],
    _在结果中筛选Title: [
        '您可以改变设置，并在结果中再次筛选。',
        '可以變更設定，並在結果中再次篩選。',
        'You can change the settings and screen again in the results.',
        '設定を変えて、結果の中で再びスクリーニングすることができます。',
    ],
    _抓取筛选结果: [
        '抓取筛选结果',
        '擷取篩選結果',
        'Crawl the screening results',
        'スクリーニングの結果をクロールする',
    ],
    _尚未开始筛选: [
        '尚未开始筛选',
        '尚未開始篩選',
        'Screening has not started',
        'まだスクリーニングを開始していない',
    ],
    _没有数据可供使用: [
        '没有数据可供使用',
        '沒有資料可供使用',
        'No data is available.',
        '使用可能なデータはない',
    ],
    _预览搜索结果: [
        '<span class="key">预览</span>搜索页面的筛选结果',
        '<span class="key">預覽</span>搜尋頁面的篩選結果',
        '<span class="key">Preview</span> filter results on search page',
        '検索ページのフィルタ結果をプレビューします',
    ],
    _预览搜索结果说明: [
        '下载器可以把符合条件的作品显示在当前页面上。如果抓取结果太多导致页面崩溃，请关闭这个功能。<br>启用预览功能时，下载器不会自动开始下载。',
        '下載器可以將符合條件的作品顯示在目前頁面上。如果擷取結果太多導致頁面當掉，請關閉這個功能。<br>啟用預覽功能時，下載器不會自動開始下載。',
        'The downloader can display the qualified works on the current page. If too many crawling results cause the page to crash, turn off this feature.<br>When the preview feature is enabled, the downloader does not start downloading automatically.',
        'ローダは、該当する作品を現在のページに表示することができます。クロール結果が多すぎてページが崩れる場合は、この機能をオフにしてください。<br>プレビュー機能を有効にすると、ダウンロードは自動的に開始されません。',
    ],
    _目录名使用: [
        '目录名使用：',
        '資料夾名稱使用：',
        'Name: ',
        'ディレクトリ名の使用：',
    ],
    _目录名: ['目录名', '資料夾名稱', 'Name', 'ディレクトリ名'],
    _启用快速收藏: [
        '启用快速收藏',
        '開啟快速收藏',
        'Enable quick bookmark',
        'クイックボックマークを有効にする',
    ],
    _启用快速收藏说明: [
        '当你点击下载器添加的收藏按钮(☆)，把作品添加到书签时，自动添加这个作品的标签。',
        '當點選下載器新增的收藏按鈕（☆），將作品加入書籤時，自動新增這個作品的標籤。',
        'When you click the favorite button (☆) added by the downloader to bookmark a work, the tag of the work is automatically added.',
        'ダウンローダーに追加されたボックマークボタン「☆」をクリックして、作品をブックマークに追加すると、自動的に作品のタグが追加されます。',
    ],
    _新增设置项: [
        '新增设置项',
        '新增設定項目',
        'Added setting items',
        '新たな機能を追加されました',
    ],
    _抓取: ['抓取', '擷取', 'Crawl', 'クロール'],
    _下载: ['下载', '下載', 'Download', 'ダウンロード'],
    _其他: ['其他', '其他', 'Other', 'その他'],
    _第一张图不带序号: [
        '第一张图不带<span class="key">序号</span>',
        '第一張圖片不包含<span class="key">序號</span>',
        'The first picture without a <span class="key">serial number</span>',
        '最初のイメージの番号を削除',
    ],
    _第一张图不带序号说明: [
        '去掉每个作品第一张图的序号。例如 80036479_p0 变成 80036479',
        '去掉每個作品第一張圖的序號。例如：80036479_p0 變成 80036479。',
        'Remove the serial number of the first picture of each work. For example 80036479_p0 becomes 80036479.',
        '作品ごとの最初のイメージの番号を削除します。例えば 80036479_p0 は 80036479 になります。',
    ],
    _最小值: ['最小值', '最小值', 'Minimum', '最小値'],
    _最大值: ['最大值', '最大值', 'Maximum', '最大値'],
    _单图作品: [
        '单图作品',
        '單圖作品',
        'Single image works',
        'シングルイメージ作品',
    ],
    _彩色图片: ['彩色图片', '彩色圖片', 'Color picture', 'カラーイメージ'],
    _黑白图片: [
        '黑白图片',
        '黑白圖片',
        'Black and white pictures',
        '白黒イメージ',
    ],
    _不保存图片因为颜色: [
        '{} 没有被保存，因为它的颜色不符合设定。',
        '{} 並未儲存，因為它的色彩不符合設定。',
        '{} was not saved because its colors do not match the settings.',
        '{} は色が設定に合わないため、保存されていません。',
    ],
    _同时转换多少个动图: [
        '同时<span class="key">转换</span>多少个动图',
        '同時<span class="key">轉換</span>多少個動圖',
        'How many animations are <span class="key">converted</span> at the same time',
        '同時変換のうごイラの上限',
    ],
    _同时转换多少个动图警告: [
        '同时转换多个动图会增加资源占用。<br>转换动图时，请保持该标签页激活，否则浏览器会降低转换速度。',
        '同時轉換多個動圖會增加資源占用。<br>轉換動圖時，請保持這個分頁啟動，否則瀏覽器會降低轉換速度。',
        'Converting multiple animations at the same time will increase resource consumption. <br> Please keep the tab active when converting animation, otherwise the browser will reduce the conversion speed.',
        '複数の動画を同時に変換すると、リソースの占有が増加します。<br>うごイラを変換するときは、このタブを有効にしてください。そうしないと、ブラウザは変換速度を下げます。',
    ],
    _提示: ['提示', '提示', 'Tip', 'ヒント'],
    _提示2: ['提示', '提示', 'Tip', '？'],
    _fanboxDownloader: [
        'Fanbox 下载器',
        'Fanbox 下載器',
        'Fanbox Downloader',
        'Fanbox ダウンロード',
    ],
    _不保存图片因为体积: [
        '{} 没有被保存，因为它的体积不符合设定。',
        '{} 並未儲存，因為它的大小不符合設定。',
        '{} was not saved because its size do not match the settings.',
        '{} はファイルサイズが設定に合わないため、保存されていません。',
    ],
    _文件体积限制: [
        '文件<span class="key">体积</span>限制',
        '檔案<span class="key">體積</span>限制',
        'File <span class="key">size</span> limit',
        'ファイルサイズ制限',
    ],
    _不符合要求的文件不会被保存: [
        '不符合要求的文件不会被保存。',
        '不會儲存不符合要求的檔案。',
        'Files that do not meet the requirements will not be saved.',
        '設定 に合わないファイルは保存されません。',
    ],
    _小说: ['小说', '小說', 'Novel', '小説'],
    _抓取系列小说: [
        '抓取系列小说',
        '擷取系列小說',
        'Crawl series of novels',
        '小説のシリーズをクロールする',
    ],
    _合并系列小说: [
        '合并系列小说',
        '合併系列小說',
        'Merge series of novels',
        'シリーズ小説の統合',
    ],
    _小说保存格式: [
        '<span class="key">小说</span>保存格式',
        '<span class="key">小說</span>儲存格式',
        'Save the <span class="key">novel</span> as',
        '<span class="key">小説</span>の保存形式',
    ],
    _在小说里保存元数据: [
        '在小说里保存<span class="key">元数据</span>',
        '在小說裡儲存<span class="key">元資料</span>',
        'Save <span class="key">metadata</span> in the novel',
        '小説の中にメタデータを保存する',
    ],
    _在小说里保存元数据提示: [
        '把作者、网址等信息保存到小说里',
        '將作者、網址等資訊儲存到小說裡',
        'Save the author, url and other information in the file',
        '作者やURLなどの情報をファイルの中に保存します。',
    ],
    _收藏本页面的所有作品: [
        '收藏本页面的所有作品',
        '收藏本頁面的所有作品',
        'Bookmark all works on this page',
        'この頁の全ての作品をブックマークに追加します',
    ],
    _输出内容太多已经为你保存到文件: [
        '因为输出内容太多，已经为您保存到文件。',
        '因為輸出內容太多，已經為你儲存到檔案。',
        'Because the output is too much, it has been saved to a file.',
        '出力内容が多いため、txt ファイルに保存しました。',
    ],
    _不下载重复文件: [
        '不下载<span class="key">重复</span>文件',
        '不下載<span class="key">重複</span>檔案',
        'Don`t download <span class="key">duplicate</span> files',
        '重複ファイルをダウンロードしない',
    ],
    _不下载重复文件的提示: [
        '下载器会保存自己的下载记录，以避免下载重复的文件。<br>当你清除 Cookie 和其他站点数据时，下载器的记录也会被清除。',
        '下載器會儲存自己的下載紀錄，以避免下載重複的檔案。<br>當你清除 Cookie 和其他站點資料時，下載器的紀錄也會被清除。',
        `The downloader will save its download record to avoid downloading duplicate files.<br>When you clear cookies and other site data, the downloader's records will also be cleared.`,
        'ダウンローダーは独自のダウンロード履歴を保存して、重複ファイルのダウンロードを回避する。<br>cookie と他のサイトデータを削除すると、ダウンローダーの記録も削除されます。',
    ],
    _策略: ['策略：', '策略：', 'Strategy:', 'フィルター：'],
    _严格: ['严格', '嚴格', 'Strict', '厳格'],
    _宽松: ['宽松', '寬鬆', 'Loose', '緩い'],
    _严格模式说明: [
        '当文件的 id 和文件名都相同时，认为是重复文件',
        '當檔案 id 和檔名都相同時，認為是重複檔案',
        'When the file id and file name are the same, it is considered a duplicate file',
        'ファイルの ID とファイル名が同じ場合、重複ファイルとみなされます',
    ],
    _宽松模式说明: [
        '只要文件的 id 相同，就认为是重复文件',
        '只要檔案 id 相同，就認為是重複檔案',
        'As long as the id of the file is the same, it is considered a duplicate file',
        'ファイルの ID が同じである限り、重複ファイルと見なされます',
    ],
    _清除下载记录: [
        '清除下载记录',
        '清除下載紀錄',
        'Clear download record',
        '履歴をクリア',
    ],
    _下载记录已清除: [
        '下载记录已清除',
        '已清除下載紀錄',
        'Download record has been cleared',
        'ダウンロード履歴がクリアされました',
    ],
    _跳过下载因为重复文件: [
        '检测到文件 {} 已经下载过，跳过此次下载',
        '偵測到檔案 {} 已經下載過，跳過此次下載。',
        'Skip downloading duplicate files {}',
        '重複ファイル {} をスキップ',
    ],
    _保存用户头像为图标: [
        '保存用户头像为图标',
        '將使用者頭像另存為圖示檔案',
        'Save user avatar as icon',
        'プロフィール画像をアイコンとして保存',
    ],
    _保存用户头像为图标说明: [
        '把用户头像保存为 ico 文件，可以手动设置成文件夹的图标。',
        '將使用者頭像儲存為 ico 檔案，可以手動設定成資料夾圖示。',
        'Save user avatar as icon',
        'ユーザーのプロフィール画像を ico ファイルとして保存して、フォルダーアイコンとして設定できます。',
    ],
    _正在保存抓取结果: [
        '正在保存抓取结果',
        '正在儲存擷取結果',
        'Saving crawl results',
        'クロール結果を保存しています',
    ],
    _已保存抓取结果: [
        '已保存抓取结果',
        '已儲存擷取結果',
        'Crawl results saved',
        'クロール結果を保存しました',
    ],
    _正在恢复抓取结果: [
        '正在恢复抓取结果',
        '正在還原擷取結果',
        'Restoring crawl results',
        'クロール結果を再開しています',
    ],
    _已恢复抓取结果: [
        '已恢复抓取结果',
        '已還原擷取結果',
        'Crawl results resumed',
        'クロール結果を再開しました',
    ],
    _清空已保存的抓取结果: [
        '清空已保存的抓取结果',
        '清除已儲存的擷取結果',
        'Clear saved crawl results',
        'セーブしたクロール結果をクリアします',
    ],
    _数据清除完毕: [
        '数据清除完毕',
        '資料清除完畢',
        'Data cleared',
        'クリアされたデータ',
    ],
    _已跳过n个文件: [
        '已跳过 {} 个文件',
        '已跳過 {} 個檔案',
        '{} files skipped',
        '{} つのファイルをスキップしました',
    ],
    _不保存图片因为宽高: [
        '{} 没有被保存，因为它的宽高不符合设定。',
        '{} 並未儲存，因為它的寬高不符合設定。',
        '{} was not saved because its width and height do not match the settings.',
        '{} は幅と高さが設定に合わないため、保存されていません。',
    ],
    _显示下载面板: [
        '显示下载面板',
        '顯示下載面板',
        'Show download panel',
        'ダウンロードパネルを表示',
    ],
    _保存: ['保存', '儲存', 'Save', '保存'],
    _加载: ['加载', '載入', 'Load', 'ロード'],
    _保存命名规则提示: [
        '保存命名规则，最多 {} 个',
        '儲存命名規則，最多 {} 個',
        'Save naming rule, up to {}',
        'ネームルールを保存します。最大 {} 個まで',
    ],
    _已保存命名规则: [
        '已保存命名规则',
        '已儲存命名規則',
        'Naming rule saved',
        'ネームルールを保存しました',
    ],
    _无损: ['无损', '無損', 'Lossless', 'ロスレス'],
    _文件名长度限制: [
        '文件名<span class="key">长度</span>限制',
        '檔案名稱<span class="key">長度</span>限制',
        'File name <span class="key">length</span> limit',
        'ファイル名の長さ制限',
    ],
    _导出csv: [
        '导出 CSV 文件',
        '匯出 CSV 檔',
        'Export CSV file',
        'CSV ファイルをエクスポート',
    ],
    _导出抓取结果: [
        '导出抓取结果',
        '匯出擷取結果',
        'Export crawl results',
        'クロール結果をエクスポート',
    ],
    _导入抓取结果: [
        '导入抓取结果',
        '匯入擷取結果',
        'Import crawl results',
        'クロール結果をインポート',
    ],
    _导入成功: ['导入成功', '匯入成功', 'Import successfully', 'インポート成功'],
    _导出成功: [
        '导出成功',
        '匯出成功',
        'Export successfully',
        'エクスポート成功',
    ],
    _图片尺寸: [
        '图片<span class="key">尺寸</span>',
        '圖片<span class="key">尺寸</span>',
        'Image <span class="key">size</span>',
        '画像<span class="key">サイズ</span>',
    ],
    _图片尺寸2: ['图片尺寸', '圖片尺寸', 'Image size', '画像サイズ'],
    _原图: ['原图', '原圖', 'Original', 'Original'],
    _普通: ['普通', '普通', 'Regular', 'Regular'],
    _小图: ['小图', '小圖', 'Small', 'Small'],
    _方形缩略图: [
        '方形缩略图',
        '方形縮圖',
        'Square thumbnail',
        'Square thumbnail',
    ],
    _导出: ['导出', '匯出', 'Export', 'エクスポート'],
    _导入: ['导入', '匯入', 'Import', 'インポート'],
    _清除: ['清除', '清除', 'Clear', 'クリア'],
    _导入下载记录: [
        '导入下载记录',
        '匯入下載紀錄',
        'Import download record',
        'ダウンロード記録をインポート',
    ],
    _完成: ['完成', '完成', 'Completed', '完了'],
    _日期格式: [
        '日期和时间<span class="key">格式</span>',
        '日期和時間<span class="key">格式</span>',
        'Date and time <span class="key">format</span>',
        '日付と時刻の書式',
    ],
    _日期格式提示: [
        '你可以使用以下标记来设置日期和时间格式。这会影响命名规则里的 {date} 和 {task_date}。<br>对于时间如 2021-04-30T06:40:08',
        '你可以使用以下標記來設定日期和時間格式。這會影響命名規則裡的 {date} 和 {task_date}。<br>對於資料如：2021-04-30T06:40:08。',
        'You can use the following notation to set the date and time format. This will affect {date} and {task_date} in the naming rules. <br>For time such as 2021-04-30T06:40:08',
        '以下のタグを使用して日時と時刻の書式を設定することができます。 これは命名規則の {date} と {task_date} に影響します。 <br> 例：2021-04-30T06:40:08',
    ],
    _命名标记taskDate: [
        '本次任务抓取完成时的时间。例如：2020-10-21',
        '本次工作擷取完成時的時間。例如：2020-10-21。',
        'The time when the task was crawl completed. For example: 2020-10-21',
        'この作業のクロールが完了した時刻です。 例：2020-10-21',
    ],
    _自动检测: ['自动检测', '自動偵測', 'Auto', '自動検出'],
    _变更语言后刷新页面的提示: [
        '更换语言后，请刷新页面。',
        '變更語言後，請重新整理頁面。',
        'Please refresh the page after changing the language.',
        '言語を変更した後は、ページを更新してください。',
    ],
    _公开: ['公开', '公開', 'Public', '公開'],
    _不公开: ['不公开', '非公開', 'Private', '非公開'],
    _已收藏: ['已收藏', '已收藏', 'Bookmarked', 'ブックマークした'],
    _未收藏: ['未收藏', '未收藏', 'Not bookmarked', 'ブックマークされていない'],
    _下载之后收藏作品: [
        '下载之后<span class="key">收藏</span>作品',
        '下載之後<span class="key">收藏</span>作品',
        '<span class="key">Bookmark</span> works after downloading',
        'ダウンロードした作品をブックマークする',
    ],
    _下载之后收藏作品的提示: [
        '下载文件之后，自动收藏这个作品。',
        '下載檔案之後，自動收藏這個作品。',
        'After you download a file, the downloader will automatically bookmark the work.',
        'ダウンロード後、作品は自動的にブックマークされます。',
    ],
    _收藏设置: [
        '<span class="key">收藏</span>设置',
        '<span class="key">收藏</span>設定',
        '<span class="key">Bookmark</span> settings',
        'ブックマーク設定 ',
    ],
    _添加tag: ['添加标签', '加入標籤', 'Add tag', 'タグを追加'],
    _不添加tag: ['不添加标签', '不加入標籤', "Don't add tag", 'タグなし'],
    _用户阻止名单: [
        '用户<span class="key">阻止</span>名单',
        '使用者<span class="key">阻止</span>名單',
        'User <span class="key">block</span> list',
        'ユーザーブロックリスト',
    ],
    _用户阻止名单的说明: [
        '不下载这些用户的作品。需要输入用户 id。如果有多个用户 id，使用英文逗号,分割。',
        '不下載這些使用者的作品。需要輸入使用者 id。若有多個使用者 id，使用半形逗號（,）分隔。',
        'The works of these users will not be downloaded. Need to type the user ID. If there are multiple user ID, use comma (,) separated.',
        'これらのユーザーの作品はダウンロードしません。ユーザー ID が必要です。複数のユーザ ID は "," で区切ってください。',
    ],
    _全部: ['全部', '全部', 'All', '全部'],
    _任一: ['任一', '任一', 'One', '何れか'],
    _颜色主题: [
        '颜色<span class="key">主题</span>',
        '色彩<span class="key">主題</span>',
        'Color <span class="key">theme</span>',
        'カラーテーマ',
    ],
    _管理设置: [
        '管理<span class="key">设置</span>',
        '管理<span class="key">設定</span>',
        'Manage <span class="key">settings</span>',
        '<span class="key">設定</span>の管理',
    ],
    _导出设置: ['导出设置', '匯出設定', 'Export settings', 'エクスポート設定'],
    _导入设置: ['导入设置', '匯入設定', 'Import settings', 'インポート設定'],
    _重置设置: ['重置设置', '重設設定', 'Reset settings', 'リセット設定'],
    _日均收藏数量: [
        '日均收藏数量',
        '日均收藏數量',
        'Average number of daily bookmarks',
        '1 日の平均ブックマーク数',
    ],
    _日均收藏数量的提示: [
        '你可以设置作品的平均每日收藏数量。满足条件的作品会被下载。',
        '您可以設定作品的平均每日收藏數量。滿足條件的作品會被下載。',
        'You can set the average daily bookmarks number of works. Works that meet the conditions will be downloaded.',
        '作品の 1 日の平均ブックマーク数を設定することができます。条件を満した作品はダウンロードされます。',
    ],
    _下载用户列表: [
        '下载用户列表',
        '下載使用者列表',
        'Download users list',
        'ユーザーリストのダウンロード',
    ],
    _手动选择作品: [
        '手动选择作品',
        '手動選擇作品',
        'Manually select works',
        '手動で作品を選ぶ',
    ],
    _抓取选择的作品: [
        '抓取选择的作品',
        '擷取選擇的作品',
        'Crawl selected works',
        '選ばれた作品をクロール',
    ],
    _清空选择的作品: [
        '清空选择的作品',
        '清空選擇的作品',
        'Clear selected works',
        '選んだ作品をクリアします',
    ],
    _暂停选择: ['暂停选择', '暫停選擇', 'Pause select', '選択を一時停止'],
    _继续选择: ['继续选择', '繼續選擇', 'Continue select', '選択を続ける'],
    _离开页面前提示选择的作品未抓取: [
        '选择的作品尚未抓取。现在离开此页面会导致你选择的作品被清空。',
        '選擇的作品尚未擷取。現在離開此頁面會導致您選擇的作品被清空。',
        'The selected work has not been crawled. Leaving this page now will cause your selected work to be cleared.',
        '選ばれた作品はまだクロールしていません。今このページを離れると、選ばれた作品がクリアされます。',
    ],
    _排除了所有作品类型: [
        '排除了所有作品类型',
        '排除了所有作品類型',
        'Excluded all work types',
        'すべての作品種類を除外しました',
    ],
    _为作品创建单独的文件夹: [
        '为<span class="key">每个</span>作品创建单独的文件夹',
        '為<span class="key">每個</span>作品建立單獨的資料夾',
        'Create a separate folder for <span class="key">each</span> work',
        '作品ごとに別フォルダを作成',
    ],
    _文件数量大于: [
        '文件数量 >',
        '檔案數量 >',
        'Number of files >',
        'ファイル数 >',
    ],
    _保存用户头像: [
        '保存用户头像',
        '儲存使用者頭像',
        'Save user avatar',
        'ユーザーアイコンの保存',
    ],
    _保存用户封面: [
        '保存用户封面',
        '儲存使用者封面',
        'Save user cover',
        'ユーザーカバーの保存',
    ],
    _待处理: ['待处理', '待處理', 'Pending', '処理待ち'],
    _超出最大页码: [
        '超出最大页码：',
        '超出最大頁碼：',
        'Maximum page number exceeded:',
        '最大ページ数を超えました：',
    ],
    _针对特定用户屏蔽tag: [
        '针对特定用户屏蔽<span class="key">标签</span>',
        '針對特定使用者排除<span class="key">標籤</span>',
        'Block <span class="key">tags</span> for specific users',
        '特定のユーザーに対して<span class="key">タグ</span>をブロック',
    ],
    _展开收起: ['展开/收起', '展開/摺疊', 'Expand/Collapse', '展開/折りたたみ'],
    _展开: ['展开', '展開', 'Expand', '展開'],
    _收起: ['收起', '摺疊', 'Collapse', '折りたたみ'],
    _把r18作品存入指定的文件夹里: [
        '把 <span class="key">R-18(G)</span> 作品存入指定的文件夹里',
        '把 <span class="key">R-18(G)</span> 作品存入指定的資料夾裡',
        'Save the <span class="key">R-18(G)</span> works in the designated folder',
        '<span class="key">R-18(G)</span> の作品を指定のフォルダに入れる',
    ],
    _必填项不能为空: [
        '必填项不能为空',
        '必填項不能為空',
        'Required fields cannot be empty',
        '必須フィールドが入力されていません',
    ],
    _用户ID必须是数字: [
        '用户 ID 必须是数字',
        '使用者 ID 必須是數字',
        'User ID must be a number',
        'ユーザー ID は数字です',
    ],
    _必须是数字: [
        '必须是数字',
        '必須是數字',
        'Must be a number',
        '数字でなければなりません',
    ],
    _tag用逗号分割: [
        '多个标签使用英文逗号,分割',
        '多個標籤使用半形逗號（,）分割',
        'Multiple tags use comma (,) split',
        '複数のタグはカンマ「,」で区切ってください',
    ],
    _添加: ['添加', '新增', 'Add', '追加'],
    _取消: ['取消', '取消', 'Cancel', 'キャンセル'],
    _更新: ['更新', '更新', 'Update', '更新'],
    _删除: ['删除', '刪除', 'Delete', '削除'],
    _添加成功: ['添加成功', '新增成功', 'Added successfully', '追加されました'],
    _更新成功: ['更新成功', '更新成功', 'update completed', '更新成功'],
    _在作品缩略图上显示放大图标: [
        '在作品缩略图上显示<span class="key">放大</span>图标',
        '在作品縮圖上顯示<span class="key">放大</span>圖示',
        'Show <span class="key">zoom</span> icon on thumbnail',
        '作品のサムネイルに<span class="key">拡大</span>アイコンを表示する',
    ],
    _在作品缩略图上显示下载按钮: [
        '在作品缩略图上显示<span class="key">下载</span>按钮',
        '在作品縮圖上顯示<span class="key">下載</span>按鈕',
        'Show <span class="key">download</span> button on thumbnail',
        '作品のサムネイルに<span class="key">ダウンロード</span>ボタンを表示',
    ],
    _已发送下载请求: [
        '已发送下载请求',
        '已傳送下載請求',
        'Download request sent',
        'ダウンロードリクエストを送信しました',
    ],
    _HowToUse: [
        '点击页面右侧的蓝色按钮可以打开下载器面板。',
        '點選頁面右側的藍色按鈕可以開啟下載器面板。',
        'Click the blue button on the right side of the page to open the downloader panel.',
        'ページ右側の青いボタンをクリックすると、ダウンローダーパネルが開きます。',
    ],
    _我知道了: ['我知道了', '我知道了', 'OK', '分かりました'],
    _背景图片: [
        '<span class="key">背景</span>图片',
        '<span class="key">背景</span>圖片',
        '<span class="key">Background</span> image',
        '<span class="key">背景</span>画像',
    ],
    _选择文件: ['选择文件', '選擇檔案', 'Select a file', 'ファイルを選択'],
    _不透明度: ['不透明度', '不透明度', 'Opacity', '不透明度'],
    _对齐方式: ['对齐方式', '對齊方式', 'Alignment', '揃え方式'],
    _顶部: ['顶部', '頂部', 'top', '上揃え'],
    _居中: ['居中', '居中', 'center', '中央揃え'],
    _根据作品类型自动创建文件夹: [
        '根据作品<span class="key">类型</span>自动创建文件夹',
        '根據作品<span class="key">類型</span>自動建立資料夾',
        'Create folders based on the <span class="key">type</span> of work',
        '作品種類に応じてフォルダを自動作成',
    ],
    _使用第一个匹配的tag建立文件夹: [
        '使用第一个匹配的<span class="key">标签</span>建立文件夹',
        '使用第一個符合的<span class="key">標籤</span>建立資料夾',
        'Create a folder with the first matched <span class="key">tag</span>',
        '最初の一致するタグにフォルダを作成',
    ],
    _使用匹配的tag建立文件夹的说明: [
        '如果作品的标签列表里含有用户设置的标签，就会使用这个标签建立文件夹（仅限第一个）',
        '如果作品的標籤列表裡含有使用者設定的標籤，就會使用這個標籤建立資料夾（僅限第一個）',
        'If the tag list of the work contains a tag set by the user, this tag will be used to create a folder (only the first one)',
        '作品のタグリストにユーザーが設定したタグが含まれている場合、そのタグを使用してフォルダが作成されます。(最初の1つだけ)',
    ],
    _全年龄: ['全年龄', '全年齡', 'All ages', '全年齢'],
    _没有符合条件的结果: [
        '没有符合条件的结果',
        '沒有符合條件的結果',
        'There are no eligible results',
        '対象となる結果はありません',
    ],
    _收藏: ['收藏', '收藏', 'Bookmark', 'ブックマーク'],
    _已加入收藏: ['已加入收藏', '已加入收藏', 'Bookmarked', 'ブックマークした'],
    _全屏查看: ['全屏', '全螢幕', 'Full screen view', '全画面表示'],
    _抓取id区间: [
        '抓取 id 区间',
        '擷取 id 區間',
        'Crawl id range',
        'id 範囲をクロール',
    ],
    _抓取id区间说明: [
        '你可以设置一个作品 id 范围，抓取此范围内的所有作品（包含开始和结束的 id）。\n注意：如果一次任务中产生的抓取结果数量太多，可能会导致页面崩溃。',
        '你可以設定一個作品 id 範圍，擷取此範圍內的所有作品（包含開始和結束的 id）。\n注意：如果一次任務中產生的擷取結果數量太多，可能會導致頁面崩潰。',
        'You can set a range of work id and grab all works in this range (including the begin and end id). \nNote: If the number of crawling results in a task is too much, it may cause the page to crash.',
        '作品 id の範囲を設定し、その範囲内のすべての作品をクロールすることができます。「開始 id と終了 id を含む」\n注意：1 つのタスクであまりにも多くのクロール結果を生成すると、ページがクラッシュする可能性があります。',
    ],
    _抓取id区间起点: [
        '请输入开始的 id',
        '請輸入開始的 id',
        'Please type in the beginning id',
        '開始 id を入力してください',
    ],
    _抓取id区间终点: [
        '请输入结束的 id',
        '請輸入結束的 id',
        'Please type  in the ending id',
        '終了 id を入力してください',
    ],
    _选项卡切换方式: [
        '<span class="key">选项卡</span>切换方式',
        '<span class="key">頁籤</span>切換方式',
        'How to switch <span class="key">tabs</span>',
        'タブ切り替え方式',
    ],
    _鼠标经过: ['鼠标经过', '滑鼠經過', 'Mouse over', 'マウスオーバー'],
    _鼠标点击: ['鼠标点击', '滑鼠點選', 'Mouse click', 'マウスクリック'],
    _在序号前面填充0: [
        '在序号前面<span class="key">填充 0</span>',
        '在序號前面<span class="key">填充 0</span>',
        '<span class="key">Add 0</span> in front of the serial number',
        'シリアル番号の前に 0 を記入',
    ],
    _序号总长度: [
        '序号总长度',
        '序號總長度',
        'Total length of serial number',
        'シリアル番号の全長',
    ],
    _完全一致: ['完全一致', '完全一致', 'Perfect match', '完全一致'],
    _部分一致: ['部分一致', '部分一致', 'Partial match', '部分一致'],
    _位置: ['位置', '位置', 'Position', '位置'],
    _左: ['左', '左', 'Left', '左'],
    _右: ['右', '右', 'Right', '右'],
    _多图作品只下载前几张图片: [
        '多图作品只下载<span class="key">前几张</span>图片',
        '多圖作品只下載<span class="key">前幾張</span>圖片',
        'Multi-picture works only download the <span class="key">first few</span> pictures',
        'マルチ作品は最初の何枚の画像のみをダウンロードする',
    ],
    _多图作品的图片数量限制: [
        '多图作品的图片<span class="key">数量</span>限制',
        '多圖作品的圖片<span class="key">數量</span>限制',
        'Limits on the <span class="key">number</span> of images for multi-picture works',
        'マルチ作品の画像数の制限',
    ],
    _超出此限制的多图作品不会被下载: [
        '超出此限制的多图作品不会被下载',
        '超出此限制的多圖作品不會被下載',
        'Multi-image works exceeding this limit will not be downloaded',
        'この制限を超えたマルチ作品はダウンロードされません',
    ],
    _在搜索页面添加快捷搜索区域: [
        '在搜索页面添加快捷<span class="key">搜索</span>区域',
        '在搜尋頁面新增快捷<span class="key">搜尋</span>區域',
        'Add a quick <span class="key">search</span> area on the search page',
        '検索ページにクイック検索領域を追加します',
    ],
    _保存作品的元数据: [
        '保存作品的<span class="key">元数据</span>',
        '儲存作品的<span class="key">元資料</span>',
        'Save the <span class="key">metadata</span> of the work',
        '作品のメタデータを保存する',
    ],
    _保存作品的元数据说明: [
        '为每个作品建立一个 txt 文件保存它的元数据',
        '為每個作品建立一個 txt 檔案儲存它的元資料',
        'Create a txt file for each work to save its metadata',
        '作品ごとに txt ファイルを作成して、メタデータを保存します',
    ],
    _在不同的页面类型中使用不同的命名规则: [
        '在不同的页面类型中使用<span class="key">不同</span>的命名规则',
        '在不同的頁面型別中使用<span class="key">不同</span>的命名規則',
        'Use <span class="key">different</span> naming rules in different page types',
        'ページの種類によって異なる命名規則を使用',
    ],
    _显示高级设置: [
        '显示<span class="key">高级</span>设置',
        '顯示<span class="key">進階</span>設定',
        'Show <span class="key">advanced</span> settings',
        '詳細設定を表示する',
    ],
    _显示高级设置说明: [
        '被隐藏的设置仍然会发挥作用',
        '被隱藏的設定仍然會發揮作用',
        'Hidden settings will still work',
        '隠していた設定がそのまま機能する',
    ],
    _系统磁盘空间不足提醒: [
        '下载时发生错误，可能的原因：<br>系统磁盘的剩余空间可能不足。请尝试清理系统磁盘空间，然后重新启动浏览器，继续未完成的下载。',
        '下載時發生錯誤，可能的原因：<br>系統磁碟的剩餘空間可能不足。請嘗試清理系統磁碟空間，然後重新啟動瀏覽器，繼續未完成的下載。',
        'An error occurred while downloading, possible causes：<br>The remaining space of the system disk may be too low. Please try to clear the system disk space, and then restart the browser to continue the unfinished download.',
        'ダウンロード中にエラーが発生しました、考えられる原因<br>「システムディスクに領域不足の可能性があります。システムディスクの領域をクリアしてから、ブラウザを再起動して、未完了のダウンロードを続行してください。」',
    ],
    _提示登录pixiv账号: [
        '请您登录 Pixiv 账号然后重试。',
        '請您登入 Pixiv 賬號然後重試。',
        'Please log in to your Pixiv account and try again.',
        'Pixiv アカウントにログインして、もう一度お試しください。',
    ],
    _下载完成后显示通知: [
        '下载完成后显示<span class="key">通知</span>',
        '下載完成後顯示<span class="key">通知</span>',
        'Show <span class="key">notification</span> after download is complete',
        'ダウンロードが完了した後に通知を表示する',
    ],
    _以粗体显示关键字: [
        '用<span class="key">粗体</span>显示关键字',
        '用<span class="key">粗體</span>顯示關鍵字粗体',
        'Show keywords in <span class="key">bold</span>',
        'キーワードを太字で表示',
    ],
    _抓取标签列表: [
        '抓取标签列表',
        '抓取標籤列表',
        'Crawl a list of tags',
        'タグのリストをクロール',
    ],
    _抓取标签列表的输入框提示: [
        '请输入你要抓取的标签列表。多个标签之间使用换行分割',
        '請輸入你要抓取的標籤列表。多個標籤之間使用換行分割',
        'Please type the list of tags you want to crawl. Use line breaks between multiple tags',
        'クロールしたいタグのリストを入力してください。 複数のタグを改行で分割',
    ],
    _抓取标签列表的文件夹提示: [
        '在抓取标签列表时，你可以使用 {p_tag} 或者 {p_title} 标记获取当前抓取的标签，并用来建立文件夹。例如：{p_tag}/{id}',
        '在抓取標籤列表時，你可以使用 {p_tag} 或者 {p_title} 標記獲取當前抓取的標籤，並用來建立資料夾。例如：{p_tag}/{id}',
        'When crawling the tag list, you can use {p_tag} or {p_title} tags to get the tags currently crawled and use them to create folders. For example: {p_tag}/{id}',
        'タグリストをクロールする時に、 {p_tag} や {p_title}を使用すると、現在クロールされているタグを取得し、それらを使ってフォルダを作成することができます。例：{p_tag}/{id}',
    ],
    _停止抓取标签列表: [
        '停止抓取标签列表',
        '停止抓取標籤列表',
        'Stop crawling the list of tags',
        'タグリストのクロールを停止',
    ],
    _等待下载的标签: [
        '等待下载的标签',
        '等待下載的標籤',
        'Tags waiting to be downloaded',
        'ダウンロード待ちのタグ',
    ],
    _你确定要停止抓取吗: [
        '你确定要停止抓取吗？',
        '你確定要停止抓取嗎？',
        'Are you sure you want to stop crawling?',
        '本当にクロールをやめたいのか',
    ],
    _只能在搜索页面使用: [
        '只能在搜索页面使用',
        '只能在搜尋頁面使用',
        'Can only be used on the search page',
        '検索ページでのみ使用できます',
    ],
    _自动导出抓取结果: [
        '自动<span class="key">导出</span>抓取结果',
        '自動<span class="key">匯出</span>抓取結果',
        'Automatically <span class="key">export</span> crawl results',
        'クロール結果の自動エクスポート',
    ],
    _文件格式: ['文件格式', '檔案格式', 'File format', 'ファイル形式'],
    _预览作品: [
        '<span class="key">预览</span>作品',
        '<span class="key">預覽</span>作品',
        '<span class="key">Preview</span> works',
        '作品のプレビュー',
    ],
    _点击鼠标左键可以关闭预览图: [
        '点击鼠标左键可以关闭预览图',
        '點選滑鼠左鍵可以關閉預覽圖',
        'Click the left mouse button to close the preview',
        'マウスの左クリックでプレビュー画像を閉じる',
    ],
    _尺寸: ['尺寸', '尺寸', 'Size', 'サイズ'],
    _允许鼠标停留在预览图上: [
        '允许鼠标停留在预览图上',
        '允許滑鼠停留在預覽圖上',
        'Allow the mouse to stay on the preview image',
        'プレビュー画像の上にマウスを置くことができます',
    ],
    _点击预览图时下载作品: [
        '点击预览图时下载作品',
        '點選預覽圖時下載作品',
        'Download the work when you click on the preview',
        'プレビュー画像をクリックするとその作品がダウンロードされます',
    ],
    _转换动图时页面被隐藏的提示: [
        '这个标签页正在转换动图。如果这个标签页被隐藏了，转换速度可能会变慢。',
        '這個標籤頁正在轉換動圖。如果這個標籤頁被隱藏了，轉換速度可能會變慢。',
        'This tab page is converting ugoira. If this tab page is hidden, the conversion speed may slow down.',
        'このタブページはうごイラを変換しています。 このタブを非表示にすると、変換速度が低下する場合があります。',
    ],
    _原始尺寸: ['原始尺寸', '原始尺寸', 'Original size', 'オリジナルサイズ'],
    _增强: ['增强', '增強', 'Enhance', '強化機能'],
    _长按右键显示大图: [
        '在缩略图上长按鼠标右键时显示大图',
        '在缩略图上长按鼠标右键时显示大图',
        '在缩略图上长按鼠标右键时显示大图',
        '在缩略图上长按鼠标右键时显示大图',
    ],
    _whatisnew: [
        '新增设置项：<br>预览作品',
        '新增設定項目：<br>預覽作品',
        'Added setting items:<br>Preview works',
        '新たな機能を追加されました：<br>プレビューは機能します',
    ],
};



/***/ }),

/***/ "./src/ts/ListenPageSwitch.ts":
/*!************************************!*\
  !*** ./src/ts/ListenPageSwitch.ts ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");

// 监听页面的无刷新切换
class ListenPageSwitch {
    constructor() {
        this.supportListenHistory();
        this.listenPageSwitch();
    }
    // 为监听 url 变化的事件提供支持
    supportListenHistory() {
        const s = document.createElement('script');
        const url = chrome.runtime.getURL('lib/listen_history_change.js');
        s.src = url;
        document.head.appendChild(s);
    }
    // 无刷新切换页面时派发事件
    listenPageSwitch() {
        // 点击浏览器的前进或后退按钮会触发 popstate 事件
        // 点击链接进入一个 url 不同的页面是 pushState 操作
        // 现在还没有遇到 replaceState 操作
        ;
        ['pushState', 'popstate', 'replaceState'].forEach((item) => {
            window.addEventListener(item, () => {
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('pageSwitch');
            });
        });
    }
}
new ListenPageSwitch();


/***/ }),

/***/ "./src/ts/Loading.ts":
/*!***************************!*\
  !*** ./src/ts/Loading.ts ***!
  \***************************/
/*! exports provided: loading */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loading", function() { return loading; });
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Theme */ "./src/ts/Theme.ts");

// loading 图标
class Loading {
    constructor() {
        this.id = 'xzLoadingWrap';
        this.html = `
  <div id="xzLoadingWrap">
    <div class="iconWrap">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-loading"></use>
    </svg>
    </div>
  </div>`;
        this._show = false;
    }
    set show(val) {
        this._show = val;
        this._show ? this.showEl() : this.hiddenEl();
    }
    get show() {
        return this._show;
    }
    create() {
        document.body.insertAdjacentHTML('beforeend', this.html);
        const el = document.body.querySelector('#' + this.id);
        _Theme__WEBPACK_IMPORTED_MODULE_0__["theme"].register(el);
        return el;
    }
    getEl() {
        let el = document.body.querySelector('#' + this.id);
        if (el) {
            return el;
        }
        else {
            return this.create();
        }
    }
    showEl() {
        this.getEl().style.display = 'flex';
    }
    hiddenEl() {
        this.getEl().style.display = 'none';
    }
}
const loading = new Loading();



/***/ }),

/***/ "./src/ts/Log.ts":
/*!***********************!*\
  !*** ./src/ts/Log.ts ***!
  \***********************/
/*! exports provided: log */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log", function() { return log; });
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config/Colors */ "./src/ts/config/Colors.ts");




// 日志
class Log {
    constructor() {
        this.logArea = document.createElement('div'); // 输出日志的区域
        this.id = 'logWrap'; // 日志区域元素的 id
        this.refresh = document.createElement('span'); // 刷新时使用的元素
        this.levelColor = [
            'inherit',
            _config_Colors__WEBPACK_IMPORTED_MODULE_3__["Colors"].textSuccess,
            _config_Colors__WEBPACK_IMPORTED_MODULE_3__["Colors"].textWarning,
            _config_Colors__WEBPACK_IMPORTED_MODULE_3__["Colors"].textError,
        ];
        this.max = 200;
        this.count = 0;
        this.toBottom = false; // 指示是否需要把日志滚动到底部。当有日志被添加或刷新，则为 true。滚动到底部之后复位到 false，避免一直滚动到底部。
        this.scrollToBottom();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.clearLog, () => {
            this.clear();
        });
    }
    // 添加日志
    /*
    str 日志文本
    level 日志等级
    br 换行标签的个数
    keepShow 追加日志的模式，默认为 true，把这一条日志添加后不再修改。false 则是刷新显示这条消息。
  
    level 日志等级：
    0 normal
    1 success
    2 warning
    3 error
    */
    add(str, level, br, keepShow) {
        this.checkElement();
        let span = document.createElement('span');
        if (!keepShow) {
            span = this.refresh;
        }
        else {
            this.count++;
        }
        span.innerHTML = str;
        span.style.color = this.levelColor[level];
        while (br > 0) {
            span.appendChild(document.createElement('br'));
            br--;
        }
        this.logArea.appendChild(span);
        this.toBottom = true; // 需要把日志滚动到底部
    }
    log(str, br = 1, keepShow = true) {
        this.add(str, 0, br, keepShow);
    }
    success(str, br = 1, keepShow = true) {
        this.add(str, 1, br, keepShow);
    }
    warning(str, br = 1, keepShow = true) {
        this.add(str, 2, br, keepShow);
    }
    error(str, br = 1, keepShow = true) {
        this.add(str, 3, br, keepShow);
    }
    checkElement() {
        // 如果日志区域没有被添加到页面上，则添加
        let test = document.getElementById(this.id);
        if (test === null) {
            this.logArea.id = this.id;
            this.logArea.classList.add('beautify_scrollbar', 'logWrap');
            _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].insertToHead(this.logArea);
            _Theme__WEBPACK_IMPORTED_MODULE_2__["theme"].register(this.logArea);
        }
        // 如果页面上的日志条数超过指定数量，则清空
        // 因为日志数量太多的话会占用很大的内存。同时显示 8000 条日志可能占用接近 1 GB 的内存
        if (this.count > this.max) {
            this.logArea.innerHTML = '';
            this.count = 0;
        }
    }
    // 清空日志
    clear() {
        this.logArea.remove();
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

/***/ "./src/ts/MouseOverThumbnail.ts":
/*!**************************************!*\
  !*** ./src/ts/MouseOverThumbnail.ts ***!
  \**************************************/
/*! exports provided: mouseOverThumbnail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseOverThumbnail", function() { return mouseOverThumbnail; });
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tools */ "./src/ts/Tools.ts");
// 查找（图像）作品的缩略图，当鼠标进入、移出时触发回调

class MouseOverThumbnail {
    constructor() {
        // 作品缩略图的选择器
        // 选择器的元素必须含有作品的超链接（超链接可以在这个元素上，也可以在这个元素的子元素上）
        this.selectors = [
            'div[width="136"]',
            'div[width="288"]',
            'div[width="184"]',
            'div[width="112"]',
            'div[width="104"]',
            'div[width="90"]',
            'div[width="118"]',
            '._work',
            'figure > div',
            '._work.item',
        ];
        this.enterCallback = [];
        this.leaveCallback = [];
        // 立即对作品缩略图绑定事件
        this.handleThumbnail(document.body);
        // 使用监视器，让未来出现的作品缩略图也绑定上事件
        this.createObserver(document.body);
    }
    // 判断元素是否含有作品缩略图，如果找到了缩略图则为其绑定事件
    handleThumbnail(parent) {
        if (!parent.querySelectorAll) {
            return;
        }
        // 遍历所有的选择器，为找到的元素绑定事件
        // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
        // 如果在查找到某个选择器之后，不再查找剩余的选择器，就会遗漏一部分缩略图。
        for (const selector of this.selectors) {
            const elements = parent.querySelectorAll(selector);
            for (const el of elements) {
                const id = this.findWorkId(el);
                // 只有查找到作品 id 时才会执行回调函数
                if (id) {
                    el.addEventListener('mouseenter', (ev) => {
                        this.enterCallback.forEach((cb) => cb(el, id, ev));
                    });
                    el.addEventListener('mouseleave', (ev) => {
                        this.leaveCallback.forEach((cb) => cb(el, ev));
                    });
                }
            }
        }
    }
    createObserver(target) {
        const observer = new MutationObserver((records) => {
            for (const record of records) {
                if (record.addedNodes.length > 0) {
                    // 遍历被添加的元素
                    for (const newEl of record.addedNodes) {
                        this.handleThumbnail(newEl);
                    }
                }
            }
        });
        observer.observe(target, {
            childList: true,
            subtree: true,
        });
    }
    // onEnter 回调函数会接收到 3 个参数：
    // el 作品缩略图的元素
    // id 作品 id
    // ev 鼠标进入或者移出 el 时的 event
    onEnter(fn) {
        this.enterCallback.push(fn);
    }
    // onLeave 的回调函数没有 id 参数，因为鼠标离开时的 id 就是鼠标进入时的 id
    onLeave(fn) {
        this.leaveCallback.push(fn);
    }
    // 从元素中查找图片作品的 id
    // 如果查找不到 id，返回空字符串 ''
    findWorkId(el) {
        let a;
        if (el.nodeName === 'A') {
            a = el;
        }
        else {
            a = el.querySelector('a');
        }
        return a === null ? '' : _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].getIllustId(a.href);
    }
}
const mouseOverThumbnail = new MouseOverThumbnail();



/***/ }),

/***/ "./src/ts/MsgBox.ts":
/*!**************************!*\
  !*** ./src/ts/MsgBox.ts ***!
  \**************************/
/*! exports provided: msgBox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "msgBox", function() { return msgBox; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");




// 简单的消息框
class MsgBox {
    constructor() {
        this.typeColor = {
            success: _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].textSuccess,
            warning: _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].textWarning,
            error: _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].textError,
        };
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.showMsg, (ev) => {
            const msg = ev.detail.data;
            this.create(msg);
        });
    }
    show(msg, arg) {
        this.create(Object.assign({}, arg, { msg: msg }));
    }
    success(msg, arg) {
        this.create(Object.assign({ color: this.typeColor.success }, arg, { msg: msg }));
    }
    warning(msg, arg) {
        this.create(Object.assign({ color: this.typeColor.warning }, arg, { msg: msg }));
    }
    error(msg, arg) {
        this.create(Object.assign({ color: this.typeColor.error }, arg, { msg: msg }));
    }
    create(data) {
        const wrap = document.createElement('div');
        wrap.classList.add('xz_msg_box');
        let colorStyle = '';
        if (data.color) {
            colorStyle = `style="color:${data.color}"`;
        }
        wrap.innerHTML = `
        <p class="title" ${colorStyle}>${data.title || ''}</p>
        <p class="content" ${colorStyle}>${data.msg}</p>
        <button class="btn" type="button">${data.btn || _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_确定')}</button>
      `;
        _Theme__WEBPACK_IMPORTED_MODULE_2__["theme"].register(wrap);
        const btn = wrap.querySelector('.btn');
        if (btn) {
            wrap.addEventListener('click', (ev) => {
                ev.stopPropagation();
            });
            btn.addEventListener('click', () => {
                this.remove(wrap);
            });
            window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.closeCenterPanel, () => {
                this.remove(wrap);
            });
        }
        document.body.insertAdjacentElement('afterbegin', wrap);
        btn.focus();
    }
    remove(el) {
        el && el.parentNode && el.parentNode.removeChild(el);
    }
}
const msgBox = new MsgBox();



/***/ }),

/***/ "./src/ts/OpenCenterPanel.ts":
/*!***********************************!*\
  !*** ./src/ts/OpenCenterPanel.ts ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PageType */ "./src/ts/PageType.ts");



// 页面右侧的按钮，点击可以打开中间面板
class OpenCenterPanel {
    constructor() {
        this.btn = document.createElement('button');
        this.addBtn();
        this.setVisible();
        this.bindEvents();
    }
    addBtn() {
        this.btn = document.createElement('button');
        this.btn.classList.add('rightButton');
        this.btn.id = 'openCenterPanelBtn';
        this.btn.setAttribute('title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_显示下载面板') + ' (Alt + X)');
        this.btn.innerHTML = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-dakai"></use>
</svg>`;
        document.body.insertAdjacentElement('afterbegin', this.btn);
    }
    bindEvents() {
        // 这里阻止事件冒泡是为了配合 CenterPanel 的“点击页面其他部分隐藏 CenterPanel”的效果
        this.btn.addEventListener('click', (e) => {
            const ev = e || window.event;
            ev.stopPropagation();
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('openCenterPanel');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.centerPanelClosed, () => {
            this.show();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.centerPanelOpened, () => {
            this.hide();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitchedTypeChange, () => {
            this.setVisible();
        });
    }
    show() {
        this.btn.style.display = 'flex';
    }
    hide() {
        this.btn.style.display = 'none';
    }
    // 如果当前页面不支持下载，就隐藏按钮。这只是一个障眼法。
    setVisible() {
        _PageType__WEBPACK_IMPORTED_MODULE_2__["pageType"].type === _PageType__WEBPACK_IMPORTED_MODULE_2__["pageType"].list.Unsupported ? this.hide() : this.show();
    }
}
new OpenCenterPanel();


/***/ }),

/***/ "./src/ts/PageType.ts":
/*!****************************!*\
  !*** ./src/ts/PageType.ts ***!
  \****************************/
/*! exports provided: pageType, PageName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pageType", function() { return pageType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageName", function() { return PageName; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");

// 所有页面类型及对应的数字编号
// 可以通过 pageType.list 使用
var PageName;
(function (PageName) {
    PageName[PageName["Unsupported"] = -1] = "Unsupported";
    PageName[PageName["Home"] = 0] = "Home";
    PageName[PageName["Artwork"] = 1] = "Artwork";
    PageName[PageName["UserHome"] = 2] = "UserHome";
    PageName[PageName["BookmarkLegacy"] = 3] = "BookmarkLegacy";
    PageName[PageName["Bookmark"] = 4] = "Bookmark";
    PageName[PageName["ArtworkSearch"] = 5] = "ArtworkSearch";
    PageName[PageName["AreaRanking"] = 6] = "AreaRanking";
    PageName[PageName["ArtworkRanking"] = 7] = "ArtworkRanking";
    PageName[PageName["Pixivision"] = 8] = "Pixivision";
    PageName[PageName["BookmarkDetail"] = 9] = "BookmarkDetail";
    PageName[PageName["NewArtworkBookmark"] = 10] = "NewArtworkBookmark";
    PageName[PageName["Discover"] = 11] = "Discover";
    PageName[PageName["NewArtwork"] = 12] = "NewArtwork";
    PageName[PageName["Novel"] = 13] = "Novel";
    PageName[PageName["NovelSeries"] = 14] = "NovelSeries";
    PageName[PageName["NovelSearch"] = 15] = "NovelSearch";
    PageName[PageName["NovelRanking"] = 16] = "NovelRanking";
    PageName[PageName["NewNovelBookmark"] = 17] = "NewNovelBookmark";
    PageName[PageName["NewNovel"] = 18] = "NewNovel";
    PageName[PageName["ArtworkSeries"] = 19] = "ArtworkSeries";
    PageName[PageName["Following"] = 20] = "Following";
})(PageName || (PageName = {}));
// 获取页面类型
class PageType {
    constructor() {
        // 当前页面类型
        this.type = PageName.Unsupported;
        // 所有页面类型
        this.list = PageName;
        this.type = this.getType();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitch, () => {
            this.checkTypeChange();
        });
    }
    getType() {
        const url = window.location.href;
        const pathname = window.location.pathname;
        if (window.location.hostname === 'www.pixiv.net' &&
            ['/', '/manga', '/novel/', '/en/'].includes(pathname)) {
            return PageName.Home;
        }
        else if (/\/artworks\/\d{1,10}/.test(url)) {
            return PageName.Artwork;
        }
        else if (/\/users\/\d+/.test(url) && !url.includes('/bookmarks')) {
            if (pathname.includes('/following') ||
                pathname.includes('/mypixiv') ||
                pathname.includes('/followers')) {
                return PageName.Following;
            }
            else {
                return PageName.UserHome;
            }
        }
        else if (pathname.endsWith('bookmark.php')) {
            return PageName.BookmarkLegacy;
        }
        else if (pathname.includes('/bookmarks/')) {
            return PageName.Bookmark;
        }
        else if (url.includes('/tags/')) {
            return pathname.endsWith('/novels')
                ? PageName.NovelSearch
                : PageName.ArtworkSearch;
        }
        else if (pathname === '/ranking_area.php' && location.search !== '') {
            return PageName.AreaRanking;
        }
        else if (pathname === '/ranking.php') {
            return PageName.ArtworkRanking;
        }
        else if (url.includes('https://www.pixivision.net') &&
            url.includes('/a/')) {
            return PageName.Pixivision;
        }
        else if (url.includes('/bookmark_add.php?id=') ||
            url.includes('/bookmark_detail.php?illust_id=')) {
            return PageName.BookmarkDetail;
        }
        else if (url.includes('/bookmark_new_illust.php') ||
            url.includes('/bookmark_new_illust_r18.php')) {
            return PageName.NewArtworkBookmark;
        }
        else if (pathname === '/discovery') {
            return PageName.Discover;
        }
        else if (url.includes('/new_illust.php') ||
            url.includes('/new_illust_r18.php')) {
            return PageName.NewArtwork;
        }
        else if (pathname === '/novel/show.php') {
            return PageName.Novel;
        }
        else if (pathname.startsWith('/novel/series/')) {
            return PageName.NovelSeries;
        }
        else if (pathname === '/novel/ranking.php') {
            return PageName.NovelRanking;
        }
        else if (pathname.startsWith('/novel/bookmark_new')) {
            return PageName.NewNovelBookmark;
        }
        else if (pathname.startsWith('/novel/new')) {
            return PageName.NewNovel;
        }
        else if (pathname.startsWith('/user/') && pathname.includes('/series/')) {
            return PageName.ArtworkSeries;
        }
        else {
            // 没有匹配到可用的页面类型
            return PageName.Unsupported;
        }
    }
    // 页面切换时，检查页面类型是否变化
    checkTypeChange() {
        const old = this.type;
        this.type = this.getType();
        if (this.type !== old) {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('pageSwitchedTypeChange', this.type);
        }
        else {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('pageSwitchedTypeNotChange', this.type);
        }
    }
}
const pageType = new PageType();



/***/ }),

/***/ "./src/ts/PreviewWork.ts":
/*!*******************************!*\
  !*** ./src/ts/PreviewWork.ts ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/ts/API.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MouseOverThumbnail */ "./src/ts/MouseOverThumbnail.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _ShowOriginSizeImage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ShowOriginSizeImage */ "./src/ts/ShowOriginSizeImage.ts");





// 鼠标经过作品的缩略图时，显示更大尺寸的缩略图
class PreviewWork {
    constructor() {
        this.defaultSize = 1200;
        // 预览作品的容器的元素
        this.wrapId = 'previewWorkWrap';
        this.border = 8; // wrap 的 border 占据的空间
        // 保存当前鼠标经过的缩略图的数据
        this.workId = '';
        // 显示预览区域的延迟时间
        // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成后不会立即加载图片
        // 如果鼠标在缩略图上停留达到 delay 的时间，才会加载 regular 尺寸的图片
        // 这是因为要加载的图片体积比较大，regular 规格的图片的体积可能达到 800KB，如果立即加载的话会浪费网络资源
        this.showDelay = 300;
        this.showTimer = 0;
        // 鼠标离开缩略图之后，经过指定的时间才会隐藏 wrap
        // 如果在这个时间内又进入缩略图，或者进入 wrap，则取消隐藏定时器，继续显示 wrap
        // 如果不使用延迟隐藏，而是立即隐藏的话，用户就不能滚动页面来查看完整的 wrap
        this.hiddenDelay = 50;
        this.hiddenTimer = 0;
        // 预览 wrap 的状态
        this._show = false;
        this.createElements();
        this.bindEvents();
    }
    get show() {
        return this._show;
    }
    set show(val) {
        if (val) {
            // 如果保存的作品数据不是最后一个鼠标经过的作品，可能是请求尚未完成，此时延长等待时间
            if (!this.workData || this.workData.body.id !== this.workId) {
                this.readyShow();
            }
            else {
                this._show = val;
                this.showWrap();
            }
        }
        else {
            window.clearTimeout(this.showTimer);
            this._show = val;
            this.wrap.style.display = 'none';
            // 隐藏 wrap 时，把 img 的 src 设置为空
            // 这样如果图片没有加载完就会停止加载，避免浪费网络资源
            this.img.src = '';
        }
    }
    createElements() {
        this.wrap = document.createElement('div');
        this.wrap.id = this.wrapId;
        this.img = document.createElement('img');
        this.wrap.appendChild(this.img);
        document.body.appendChild(this.wrap);
    }
    bindEvents() {
        _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_2__["mouseOverThumbnail"].onEnter((el, id) => {
            window.clearTimeout(this.hiddenTimer);
            if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].PreviewWork) {
                return;
            }
            this.workId = id;
            this.getWorkData();
            this.workEL = el;
            // 一定时间后，显示容器，加载大图
            this.readyShow();
            _ShowOriginSizeImage__WEBPACK_IMPORTED_MODULE_4__["showOriginSizeImage"].enterEl(el);
        });
        _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_2__["mouseOverThumbnail"].onLeave((el) => {
            _ShowOriginSizeImage__WEBPACK_IMPORTED_MODULE_4__["showOriginSizeImage"].leaveEl(el);
            this.show = false;
        });
        // 可以使用 Alt + P 快捷键来启用/禁用此功能
        window.addEventListener('keydown', (ev) => {
            if (ev.altKey && ev.code === 'KeyP') {
                Object(_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["setSetting"])('PreviewWork', !_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].PreviewWork);
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.pageSwitch, () => {
            this.show = false;
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.centerPanelOpened, () => {
            this.show = false;
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.showOriginSizeImage, () => {
            this.show = false;
        });
    }
    async getWorkData() {
        const data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(this.workId);
        if (data.body.id === this.workId) {
            this.workData = data;
            _ShowOriginSizeImage__WEBPACK_IMPORTED_MODULE_4__["showOriginSizeImage"].setWorkData(this.workData);
        }
    }
    readyShow() {
        this.showTimer = window.setTimeout(() => {
            this.show = true;
        }, this.showDelay);
    }
    readyHidden() {
        window.clearTimeout(this.showTimer);
        this.hiddenTimer = window.setTimeout(() => {
            this.show = false;
        }, this.hiddenDelay);
    }
    // 显示预览 wrap
    showWrap() {
        var _a;
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].PreviewWork || !this.workEL || !this.workData) {
            return;
        }
        const cfg = {
            width: this.defaultSize,
            height: this.defaultSize,
            left: 0,
            top: 0,
        };
        // 1. 设置宽高
        const w = this.workData.body.width;
        const h = this.workData.body.height;
        const rect = this.workEL.getBoundingClientRect();
        const innerWidth = window.innerWidth - 17;
        const leftSpace = rect.left;
        const rightSpace = innerWidth - rect.right;
        const xSpace = Math.max(leftSpace, rightSpace);
        const scrollBarHeight = window.innerHeight - document.documentElement.clientHeight;
        const innerHeight = window.innerHeight - scrollBarHeight;
        // 宽高从图片宽高、wrap 宽高、可视区域的宽高中，取最小值，使图片不会超出可视区域外
        // 竖图
        if (w < h) {
            cfg.height = Math.min(this.defaultSize, innerHeight, h);
            cfg.width = (cfg.height / h) * w;
        }
        else if (w > h) {
            // 横图
            cfg.width = Math.min(this.defaultSize, xSpace, w);
            cfg.height = (cfg.width / w) * h;
        }
        else {
            // 正方形图片
            cfg.height = Math.min(this.defaultSize, innerHeight, xSpace, h);
            cfg.width = Math.min(this.defaultSize, w, innerHeight);
        }
        // 如果 wrap 宽度超过了可视窗口宽度，则需要再次调整宽高
        if (cfg.width > xSpace) {
            cfg.height = (xSpace / cfg.width) * cfg.height;
            cfg.width = xSpace;
        }
        // 如果 wrap 高度超过了可视窗口高度，则需要再次调整宽高
        if (cfg.height > innerHeight) {
            cfg.width = (innerHeight / cfg.height) * cfg.width;
            cfg.height = innerHeight;
        }
        // 减去 border 的空间
        cfg.height = cfg.height - this.border;
        cfg.width = cfg.width - this.border;
        // 2. 计算位置
        // 在页面可视区域内，比较缩略图左侧和右侧空间，把 wrap 显示在空间比较大的那一侧
        if (leftSpace >= rightSpace) {
            cfg.left = rect.left - cfg.width - this.border + window.scrollX;
        }
        else {
            cfg.left = rect.right + window.scrollX;
        }
        // 然后设置 top
        // 让 wrap 和缩略图在垂直方向上居中对齐
        cfg.top = window.scrollY + rect.top;
        const wrapHalfHeight = (cfg.height + this.border) / 2;
        const workHalfHeight = rect.height / 2;
        cfg.top = cfg.top - wrapHalfHeight + workHalfHeight;
        // 检查 wrap 顶端是否超出了窗口可视区域
        if (cfg.top < window.scrollY) {
            cfg.top = window.scrollY;
        }
        // 检查 wrap 底部是否超出了窗口可视区域
        const bottomOver = cfg.top + cfg.height + this.border - window.scrollY - window.innerHeight;
        if (bottomOver > 0) {
            // 如果底部超出了窗口可视区域，则计算顶部是否还有可用空间
            const topFreeSpace = cfg.top - window.scrollY;
            if (topFreeSpace > 0) {
                // 如果顶部还有空间可用，就尽量向上移动，但不会导致顶端超出可视区域
                cfg.top = cfg.top - Math.min(bottomOver, topFreeSpace) - scrollBarHeight;
            }
        }
        // 3. 显示 wrap
        const url = (_a = this.workData) === null || _a === void 0 ? void 0 : _a.body.urls[_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].prevWorkSize];
        if (!url) {
            return;
        }
        this.img.src = url;
        const styleArray = [];
        for (const [key, value] of Object.entries(cfg)) {
            styleArray.push(`${key}:${value}px;`);
        }
        styleArray.push('display:block;');
        this.wrap.setAttribute('style', styleArray.join(''));
    }
}
new PreviewWork();


/***/ }),

/***/ "./src/ts/SelectWork.ts":
/*!******************************!*\
  !*** ./src/ts/SelectWork.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MsgBox */ "./src/ts/MsgBox.ts");







// 手动选择作品，图片作品和小说都可以选择
class SelectWork {
    constructor() {
        this.created = false;
        this.selectorId = 'selectWorkEl';
        this.left = 0;
        this.top = 0;
        this.half = 10; // 指示器的一半宽度（用于设置位置）
        this._start = false;
        this._pause = false;
        this._tempHide = false; // 打开下载面板时临时隐藏。这个变量只会影响选择器的 display
        this.controlBtn = document.createElement('button'); // 启动、暂停、继续选择的按钮
        this.crawlBtn = document.createElement('button'); // 抓取选择的作品的按钮，并且会退出选择模式
        this.clearBtn = document.createElement('button'); // 清空选择的作品的按钮
        this.selectedWorkFlagClass = 'selectedWorkFlag'; // 给已选择的作品添加标记时使用的 class
        this.positionValue = ['relative', 'absolute', 'fixed']; // 标记元素需要父元素拥有这些定位属性
        this.artworkReg = /artworks\/(\d{2,15})/;
        this.novelReg = /novel\/show\.php\?id=(\d{2,15})/;
        // 不同页面里的作品列表容器的选择器可能不同，这里储存所有页面里会使用到的的选择器
        // root 是大部分页面通用的; js-mount-point-discovery 是发现页面使用的
        this.worksWrapperSelectorList = [
            '#root',
            '#js-mount-point-discovery',
        ];
        // 储存当前页面使用的选择器
        this.usedWorksWrapperSelector = this.worksWrapperSelectorList[0];
        this.idList = [];
        this.observeTimer = 0;
        this.sendCrawl = false; // 它用来判断抓取的是不是选择的作品。抓取选择的作品时激活此标记；当触发下一次的抓取完成事件时，表示已经抓取了选择的作品。
        this.crawled = false; // 是否已经抓取了选择的作品
        if (!this.created && location.hostname.endsWith('.pixiv.net')) {
            this.created = true;
            this.selector = this.createSelectorEl();
            this.addBtn();
            this.bindEvents();
        }
    }
    get start() {
        return this._start;
    }
    set start(bool) {
        this._start = bool;
        _store_States__WEBPACK_IMPORTED_MODULE_4__["states"].selectWork = bool;
        this.updateSelectorEl();
        this.updateControlBtn();
    }
    get pause() {
        return this._pause;
    }
    set pause(bool) {
        this._pause = bool;
        if (bool) {
            _store_States__WEBPACK_IMPORTED_MODULE_4__["states"].selectWork = false;
        }
        this.updateSelectorEl();
        this.updateControlBtn();
    }
    get tempHide() {
        return this._tempHide;
    }
    set tempHide(bool) {
        this._tempHide = bool;
        this.updateSelectorEl();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.openCenterPanel, () => {
            this.tempHide = true;
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.closeCenterPanel, () => {
            this.tempHide = false;
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.crawlFinish, () => {
            if (this.sendCrawl) {
                this.sendCrawl = false;
                this.crawled = true;
            }
        });
        // 可以使用 Alt + S 快捷键来模拟点击控制按钮
        window.addEventListener('keydown', (ev) => {
            if (ev.altKey && ev.code === 'KeyS') {
                this.controlBtn.click();
            }
        });
        // 鼠标移动时保存鼠标的坐标
        window.addEventListener('mousemove', (ev) => {
            this.moveEvent(ev);
        }, true);
        // 离开页面前提示用户
        window.onbeforeunload = () => {
            // 如果存在选择的作品，并且选择的作品（全部或部分）没有被抓取，则进行提示
            if (this.idList.length > 0 && !this.crawled) {
                _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_离开页面前提示选择的作品未抓取'), {
                    btn: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_我知道了'),
                });
                return false;
            }
        };
        // 每次页面切换之后，重新添加被选择的作品上的标记。
        // 因为 pixiv 的页面切换一般会导致作品列表变化，所以之前添加的标记也没有了。
        // 监听 dom 变化，当 dom 变化停止一段时间之后，一般作品列表就加载出来了，此时重新添加标记（防抖）
        // 一个页面里可能产生多轮 dom 变化，所以可能会多次触发 reAddAllFlag 方法。这是必要的。
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.pageSwitch, () => {
            // 查找作品列表容器，并保存使用的选择器
            let worksWrapper = null;
            for (const selector of this.worksWrapperSelectorList) {
                worksWrapper = document.querySelector(selector);
                if (worksWrapper) {
                    this.usedWorksWrapperSelector = selector;
                    break;
                }
            }
            if (worksWrapper === null) {
                return;
            }
            // 监听作品列表容器的变化
            const ob = new MutationObserver((records) => {
                window.clearTimeout(this.observeTimer);
                this.observeTimer = window.setTimeout(() => {
                    this.reAddAllFlag();
                }, 300);
                // 延迟时间不宜太小，否则代码执行时可能页面上还没有对应的元素，而且更耗费性能
            });
            ob.observe(worksWrapper, {
                childList: true,
                subtree: true,
            });
        });
    }
    clearIdList() {
        // 清空标记需要使用 id 数据，所以需要执行之后才能清空 id
        this.removeAllSelectedFlag();
        this.idList = [];
        this.updateCrawlBtn();
    }
    createSelectorEl() {
        const el = document.createElement('div');
        el.id = this.selectorId;
        document.body.appendChild(el);
        return el;
    }
    updateSelectorEl() {
        if (!this.selector) {
            return;
        }
        const show = this.start && !this.pause && !this.tempHide;
        this.selector.style.display = show ? 'block' : 'none';
        // 设置元素的 style 时，如果新的值和旧的值相同（例如：每次都设置 display 为 none），Chrome 会自动优化，此时不会导致节点发生变化。
        // 如果选择器处于隐藏状态，就不会更新其坐标。这样可以优化性能
        if (show) {
            this.selector.style.left = this.left - this.half + 'px';
            this.selector.style.top = this.top - this.half + 'px';
        }
    }
    addBtn() {
        this.controlBtn = _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].addBtn('selectWorkBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_手动选择作品'), [['title', 'Alt + S']]);
        this.updateControlBtn();
        this.clearBtn = _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].addBtn('selectWorkBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgRed, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_清空选择的作品'));
        this.clearBtn.style.display = 'none';
        this.clearBtn.addEventListener('click', () => {
            this.clearIdList();
        });
        this.crawlBtn = _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].addBtn('selectWorkBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取选择的作品'));
        this.crawlBtn.style.display = 'none';
        this.crawlBtn.addEventListener('click', (ev) => {
            this.downloadSelect();
        });
    }
    // 切换控制按钮的文字和点击事件
    updateControlBtn() {
        if (!this.start) {
            this.controlBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_手动选择作品');
            this.controlBtn.onclick = (ev) => {
                this.startSelect(ev);
                this.clearBtn.style.display = 'block';
            };
        }
        else {
            if (!this.pause) {
                this.controlBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_暂停选择');
                this.controlBtn.onclick = (ev) => {
                    this.pauseSelect();
                };
            }
            else {
                this.controlBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_继续选择');
                this.controlBtn.onclick = (ev) => {
                    this.startSelect(ev);
                };
            }
        }
    }
    // 在选择作品的数量改变时，在抓取按钮上显示作品数量
    updateCrawlBtn() {
        this.crawlBtn.style.display = this.start ? 'block' : 'none';
        if (this.idList.length > 0) {
            this.crawlBtn.textContent =
                _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取选择的作品') + ` ${this.idList.length}`;
        }
        else {
            this.crawlBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取选择的作品');
        }
    }
    // 监听点击事件
    clickEvent(ev) {
        const workId = this.findWork(ev.path || ev.composedPath());
        if (workId) {
            // 如果点击的元素是作品元素，就阻止默认事件。否则会进入作品页面，导致无法在当前页面继续选择
            ev.preventDefault();
            // 如果点击的元素不是作品元素，就不做任何处理，以免影响用户体验
            const index = this.idList.findIndex((item) => {
                return item.id === workId.id && item.type === workId.type;
            });
            // 这个 id 不存在于 idList 里
            if (index === -1) {
                this.idList.push(workId);
                this.crawled = false;
                this.addSelectedFlag(ev.target, workId.id);
            }
            else {
                // id 已存在，则删除
                this.idList.splice(index, 1);
                this.removeSelectedFlag(workId.id);
            }
            this.updateCrawlBtn();
        }
    }
    // 监听鼠标移动
    // 鼠标移动时，由于事件触发频率很高，所以这里的代码也会执行很多次，但是这没有导致明显的性能问题，所以没有加以限制（如：使用节流）
    moveEvent(ev) {
        this.left = ev.x;
        this.top = ev.y;
        this.updateSelectorEl();
    }
    // esc 暂停选择
    escEvent(ev) {
        if (ev.code === 'Escape') {
            this.pauseSelect();
        }
    }
    // 开始或继续选择
    startSelect(ev) {
        this.start = true;
        if (this.pause) {
            // 如果之前暂停了，则继续选择。不清空之前的结果
            this.pause = false;
        }
        else {
            // 如果是全新开始的选择，则清空之前的结果
            this.clearIdList();
        }
        this.bindClickEvent = this.clickEvent.bind(this);
        this.bindEscEvent = this.escEvent.bind(this);
        window.addEventListener('click', this.bindClickEvent, true);
        document.addEventListener('keyup', this.bindEscEvent);
        _EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].fire('closeCenterPanel');
    }
    pauseSelect() {
        this.pause = true;
        this.bindClickEvent &&
            window.removeEventListener('click', this.bindClickEvent, true);
        this.bindEscEvent &&
            document.removeEventListener('keyup', this.bindEscEvent);
    }
    // 抓取选择的作品，这会暂停选择
    downloadSelect() {
        if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
            _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前任务尚未完成'));
            return;
        }
        this.pauseSelect();
        if (this.idList.length > 0) {
            // 传递 id 列表时，将其转换成一个新的数组。否则传递的是引用，外部操作会影响到内部的 id 列表
            _EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].fire('crawlIdList', Array.from(this.idList));
            this.sendCrawl = true;
            this.crawled = false;
        }
        else {
            _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
        }
    }
    // 从传递的元素中查找第一个作品 id
    findWork(arr) {
        for (const el of arr) {
            // 查找所有 a 标签
            if (el.nodeName === 'A') {
                const href = el.href;
                // 测试图片作品链接
                const test = this.artworkReg.exec(href);
                if (test && test[1]) {
                    return {
                        type: 'unknown',
                        id: test[1],
                    };
                }
                // 测试小说作品链接
                const test2 = this.novelReg.exec(href);
                if (test2 && test2[1]) {
                    return {
                        type: 'novels',
                        id: test2[1],
                    };
                }
            }
        }
    }
    // 当点击事件查找到一个作品时，给这个作品添加标记
    addSelectedFlag(el, id) {
        var _a;
        const i = document.createElement('i');
        i.classList.add(this.selectedWorkFlagClass);
        i.dataset.id = id;
        i.innerHTML = `<svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-select"></use>
    </svg>`;
        let target = el;
        // 如果点击的元素处于 svg 里，则添加到 svg 外面。因为 svg 里面不会显示添加的标记
        // 这里的代码只能应对 svg 内只有一层子元素的情况。目前 pixiv 的作品列表都是这样
        if (el.nodeName === 'svg' || ((_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.nodeName) === 'svg') {
            target = el.parentElement;
        }
        target.insertAdjacentElement('beforebegin', i);
        // 如果父元素没有某些定位，就会导致标记定位异常。修复此问题
        if (target.parentElement) {
            const position = window.getComputedStyle(target.parentElement)['position'];
            if (!this.positionValue.includes(position)) {
                target.parentElement.style.position = 'relative';
            }
        }
    }
    // 重新添加被选择的作品上的标记
    reAddAllFlag() {
        if (this.idList.length === 0) {
            return;
        }
        for (const { id, type } of this.idList) {
            if (this.getSelectedFlag(id)) {
                // 如果这个作品的标记依旧存在，就不需要重新添加
                /**
                 * 示例：从作品列表 https://www.pixiv.net/users/18095070/illustrations
                 * 进入 tag 列表页 https://www.pixiv.net/users/18095070/illustrations/%E5%A5%B3%E3%81%AE%E5%AD%90
                 * pixiv 会复用可用的作品，所以这些作品上的标记也依然存在，不需要重新添加
                 */
                return;
            }
            let el;
            if (type === 'novels') {
                el = document.querySelector(`${this.usedWorksWrapperSelector} a[href="/novel/show.php?id=${id}"]`);
            }
            else {
                el = document.querySelector(`${this.usedWorksWrapperSelector} a[href="/artworks/${id}"]`);
            }
            if (el) {
                // 如果在当前页面查找到了选择的作品，就给它添加标记
                this.addSelectedFlag(el, id);
            }
        }
    }
    getSelectedFlag(id) {
        return document.querySelector(`.${this.selectedWorkFlagClass}[data-id='${id}']`);
    }
    // 清空指定作品的标记
    removeSelectedFlag(id) {
        const el = this.getSelectedFlag(id);
        el && el.remove();
    }
    // 清空所有标记
    removeAllSelectedFlag() {
        for (const item of this.idList) {
            this.removeSelectedFlag(item.id);
        }
    }
}
new SelectWork();


/***/ }),

/***/ "./src/ts/ShowDownloadBtnOnThumb.ts":
/*!******************************************!*\
  !*** ./src/ts/ShowDownloadBtnOnThumb.ts ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MouseOverThumbnail */ "./src/ts/MouseOverThumbnail.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config/Colors */ "./src/ts/config/Colors.ts");







// 在图片作品的缩略图上显示下载按钮，点击按钮会直接下载这个作品
class ShowDownloadBtnOnThumb {
    constructor() {
        this.btnId = 'downloadBtnOnThumb';
        this.btnSize = 32;
        this.currentWorkId = ''; // 保存触发事件的缩略图的作品 id
        this.hiddenBtnTimer = 0; // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
        this.hiddenBtnDelay = 100;
        this.doNotShowBtn = false; // 当点击了按钮后，进入此状态，此状态中不会显示按钮
        this.addBtn();
        this.bindEvents();
    }
    // 此状态是为了解决这个问题：点击了按钮之后，按钮会被隐藏，隐藏之后，鼠标下方就是图片缩略图区域，这会触发缩略图的鼠标事件，导致按钮马上就又显示了出来。所以点击按钮之后设置这个状态，在其为 true 的期间不会显示按钮。过一段时间再把它复位。复位所需的时间很短，因为只要能覆盖这段时间就可以了：从隐藏按钮开始算起，到缩略图触发鼠标事件结束。
    addBtn() {
        const btn = document.createElement('button');
        btn.id = this.btnId;
        btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-download"></use>
</svg>`;
        this.btn = document.body.appendChild(btn);
    }
    bindEvents() {
        // 页面切换时隐藏按钮
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitch, () => {
            this.hiddenBtn();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.clickBtnOnThumb, () => {
            this.hiddenBtnNow();
        });
        // 鼠标移入按钮时取消隐藏按钮
        this.btn.addEventListener('mouseenter', (ev) => {
            window.clearTimeout(this.hiddenBtnTimer);
        });
        // 鼠标移出按钮时隐藏按钮
        this.btn.addEventListener('mouseleave', () => {
            this.hiddenBtn();
        });
        // 点击按钮时初始化图片查看器
        this.btn.addEventListener('click', (ev) => {
            this.hiddenBtnNow();
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('clickBtnOnThumb');
            if (this.currentWorkId) {
                const IDData = {
                    type: 'illusts',
                    id: this.currentWorkId,
                };
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('crawlIdList', [IDData]);
                // 点击 wrap 建立下载任务，下载时不显示下载面板
                _store_States__WEBPACK_IMPORTED_MODULE_3__["states"].quickCrawl = true;
                _Toast__WEBPACK_IMPORTED_MODULE_4__["toast"].show(_Lang__WEBPACK_IMPORTED_MODULE_5__["lang"].transl('_已发送下载请求'), {
                    bgColor: _config_Colors__WEBPACK_IMPORTED_MODULE_6__["Colors"].bgBlue,
                    position: 'mouse',
                });
            }
        });
        _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_2__["mouseOverThumbnail"].onEnter((el, id) => {
            this.currentWorkId = id;
            this.showBtn(el);
        });
        _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_2__["mouseOverThumbnail"].onLeave(() => {
            this.hiddenBtn();
        });
    }
    // 显示按钮
    showBtn(target) {
        if (this.doNotShowBtn || !_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].showDownloadBtnOnThumb) {
            return;
        }
        window.clearTimeout(this.hiddenBtnTimer);
        const rect = target.getBoundingClientRect();
        this.btn.style.left =
            window.pageXOffset +
                rect.left +
                (_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].magnifierPosition === 'left' ? 0 : rect.width - this.btnSize) +
                'px';
        let top = window.pageYOffset + rect.top;
        // 如果显示了放大按钮，就需要加大 top，让下载按钮显示在放大按钮下面
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].magnifier) {
            top = top + this.btnSize + 8;
        }
        this.btn.style.top = top + 'px';
        this.btn.style.display = 'flex';
    }
    // 延迟隐藏按钮
    hiddenBtn() {
        window.clearTimeout(this.hiddenBtnTimer);
        this.hiddenBtnTimer = window.setTimeout(() => {
            this.btn.style.display = 'none';
        }, this.hiddenBtnDelay);
    }
    // 立刻隐藏按钮
    hiddenBtnNow() {
        this.doNotShowBtn = true;
        window.setTimeout(() => {
            this.doNotShowBtn = false;
        }, 100);
        window.clearTimeout(this.hiddenBtnTimer);
        this.btn.style.display = 'none';
    }
}
new ShowDownloadBtnOnThumb();


/***/ }),

/***/ "./src/ts/ShowHowToUse.ts":
/*!********************************!*\
  !*** ./src/ts/ShowHowToUse.ts ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MsgBox */ "./src/ts/MsgBox.ts");



class ShowHowToUse {
    constructor() {
        this.flag = 'xzHowToUse';
        this.check();
    }
    check() {
        const query = window.localStorage.getItem(this.flag);
        if (!query) {
            this.show();
        }
    }
    show() {
        _MsgBox__WEBPACK_IMPORTED_MODULE_2__["msgBox"].show(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_HowToUse'), {
            title: _config_Config__WEBPACK_IMPORTED_MODULE_1__["Config"].appName,
            btn: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_我知道了'),
        });
        window.localStorage.setItem(this.flag, '1');
    }
}
new ShowHowToUse();


/***/ }),

/***/ "./src/ts/ShowNotification.ts":
/*!************************************!*\
  !*** ./src/ts/ShowNotification.ts ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Tools */ "./src/ts/Tools.ts");





class ShowNotification {
    constructor() {
        this.iconURL = '';
        this.iconURL = chrome.runtime.getURL('icon/logo128.png');
        this.bindEvents();
    }
    bindEvents() {
        // 当用户开启“下载完成后显示通知”的提示时，请求权限
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'showNotificationAfterDownloadComplete' && data.value) {
                this.requstPremission();
            }
        });
        // 当下载任务完毕时，显示通知
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadComplete, () => {
            window.setTimeout(() => {
                // 如果抓取标签列表没有完成，则不显示通知
                // 在一次抓取多个标签时，当最后一个标签下载完之后会解除 crawlTagList 状态，这时可以显示一条通知
                if (!_store_States__WEBPACK_IMPORTED_MODULE_3__["states"].crawlTagList &&
                    _setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].showNotificationAfterDownloadComplete) {
                    this.show(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载完毕2'), _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].getPageTitle());
                }
            }, 300);
        });
    }
    async show(title, text) {
        await this.requstPremission();
        new Notification(title, {
            body: text,
            // 不设置 tag。如果设置了相同的 tag，那么新的通知会覆盖旧的通知，导致如果有多个页面下载完毕，用户只能看到最后一个页面的通知
            // tag: 'PowerfulPixivDownloader',
            icon: this.iconURL,
        });
    }
    requstPremission() {
        if (Notification.permission !== 'granted') {
            return Notification.requestPermission();
        }
    }
}
new ShowNotification();


/***/ }),

/***/ "./src/ts/ShowOriginSizeImage.ts":
/*!***************************************!*\
  !*** ./src/ts/ShowOriginSizeImage.ts ***!
  \***************************************/
/*! exports provided: showOriginSizeImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showOriginSizeImage", function() { return showOriginSizeImage; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/Utils */ "./src/ts/utils/Utils.ts");



class ShowOriginSizeImage {
    constructor() {
        // 原比例查看图片的容器的元素
        this.wrapId = 'originSizeWrap';
        this.defaultSize = 1200;
        this.border = 8; // wrap 的 border 占据的空间
        // 不可以把 left、top 设置为负值，否则超出屏幕的区域无法查看
        // 所以通过修改 margin 来达到定位的效果
        this.style = {
            imgW: this.defaultSize,
            imgH: this.defaultSize,
            width: this.defaultSize,
            height: this.defaultSize,
            mt: 0,
            ml: 0,
        };
        this.defaultStyle = _utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].deepCopy(this.style);
        this.zoomList = [0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5];
        this.zoomIndex = 6;
        // 默认的缩放比例为 1 
        this.zoom = this.zoomList[this.zoomIndex];
        // 定义当鼠标移动 1 像素时，wrap 移动多少像素
        this.onePxMove = 10;
        this.moveX = 0;
        this.moveY = 0;
        this._show = false;
        this.showTimer = 0;
        this.rightClickBeforeShow = false;
        this.readyShow = (ev) => {
            // 当预览区域显示之后，在作品缩略图上长按鼠标右键，显示原尺寸图片
            // 0 左键 1 滚轮 2 右键
            if (ev.button === 2) {
                this.showTimer = window.setTimeout(() => {
                    this.rightClickBeforeShow = true;
                    if (this.workData) {
                        this.initWrap(ev);
                    }
                }, 500);
            }
        };
        this.cancelShow = (ev) => {
            window.clearTimeout(this.showTimer);
        };
        this.createElements();
        this.bindEvents();
    }
    get show() {
        return this._show;
    }
    set show(val) {
        this._show = val;
        if (val) {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('showOriginSizeImage');
        }
    }
    createElements() {
        this.wrap = document.createElement('div');
        this.wrap.id = this.wrapId;
        this.img = document.createElement('img');
        this.wrap.appendChild(this.img);
        document.documentElement.appendChild(this.wrap);
    }
    bindEvents() {
        this.wrap.addEventListener('click', () => {
            this.hidden();
        });
        document.body.addEventListener('click', () => {
            this.hidden();
        });
        this.wrap.addEventListener('mousewheel', (ev) => {
            ev.preventDefault();
            // 向上滚 deltaY 是负数（-125），向下滚是正数（125）
            const zoomAdd = ev.deltaY < 0;
            this.zoomWrap(ev, zoomAdd);
        });
        this.wrap.addEventListener('mousemove', (ev) => {
            if (this.moveX === 0) {
                // client x y 是可视区域，不包含滚动区域
                this.moveX = ev.clientX;
                this.moveY = ev.clientY;
            }
            // 本来我对此事件进行了节流处理，但是节流的话容易显得画面不流畅。
            // 而且我试了试，不节流也不会产生太高的 CPU 负荷。所以现在不再做节流处理
            this.moveWrap(ev);
            this.moveX = ev.clientX;
            this.moveY = ev.clientY;
        });
        window.addEventListener('contextmenu', (ev) => {
            // 如果是在原图区域显示之前按下了右键，并且随后显示了原图区域，那么就屏蔽这一次右键菜单
            if (this.rightClickBeforeShow) {
                ev.preventDefault();
                this.rightClickBeforeShow = false;
                this.moveX = ev.clientX;
                this.moveY = ev.clientY;
            }
        });
    }
    enterEl(el) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].showOriginImage) {
            return;
        }
        el.addEventListener('mousedown', this.readyShow);
        el.addEventListener('mouseup', this.cancelShow);
    }
    leaveEl(el) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].showOriginImage) {
            return;
        }
        el.removeEventListener('mousedown', this.readyShow);
        el.removeEventListener('mouseup', this.cancelShow);
    }
    // 初次显示一个图片时，初始化 wrap 的样式
    initWrap(ev) {
        var _a;
        const url = (_a = this.workData) === null || _a === void 0 ? void 0 : _a.body.urls[_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].showOriginImageSize];
        if (!url) {
            return;
        }
        this.img.src = '';
        this.img.src = url;
        this.zoomIndex = 6;
        this.zoom = this.zoomList[this.zoomIndex];
        this.style = this.defaultStyle;
        this.show = true;
        // 计算图片的原始宽高
        const originWidth = this.workData.body.width;
        const originHeight = this.workData.body.height;
        // 如果加载的是“普通”尺寸，需要根据原图的比例计算宽高
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].showOriginImageSize === 'regular') {
            if (originWidth >= originHeight) {
                // 横图或者正方形
                this.style.imgW = Math.min(originWidth, this.defaultSize);
                this.style.imgH = (this.style.imgW / originWidth) * originHeight;
            }
            else {
                this.style.imgH = Math.min(originHeight, this.defaultSize);
                this.style.imgW = (this.style.imgH / originHeight) * originWidth;
            }
        }
        else {
            this.style.imgW = originWidth;
            this.style.imgH = originHeight;
        }
        // 可视区域的 1 像素等于图片尺寸的多少像素
        let onePxMove = 1;
        if (originWidth >= originHeight) {
            onePxMove = this.style.imgW / (window.innerWidth - 17);
        }
        else {
            onePxMove = this.style.imgH / (window.innerHeight);
        }
        // 乘以修正系数，加大 onePxMove
        // 这样可以让用户在移动鼠标时，不需要移动到边界上就可以查看到图片的边界
        this.onePxMove = onePxMove * 1.1;
        this.style.width = this.style.imgW;
        this.style.height = this.style.imgH;
        const innerWidth = window.innerWidth - 17;
        if (this.style.width > innerWidth) {
            // 如果图片宽度超过了可视区域，则根据鼠标在可视宽度中的点击位置，将图片等比例移动到这里
            // 这样用户向左移动鼠标时，可以看到图片的左边界
            // 设想把图片居中显示，但是鼠标位置在左侧，那么用户向左移动鼠标，是看不到图片的左边界的。所以此时不能居中显示
            const leftSpace = this.style.width * (ev.clientX / innerWidth);
            // 计算需要向左移动的距离
            this.style.ml = 0 - (leftSpace - ev.clientX);
        }
        else {
            // 否则水平居中显示
            this.style.ml = (window.innerWidth - 17 - this.style.width - this.border) / 2;
        }
        if (this.style.height > window.innerHeight) {
            // 如果图片高度超过了可视区域，则根据鼠标点击位置在可视宽度中的比例，将 top 设置为同样的比例
            const topSpace = this.style.height * (ev.clientY / window.innerHeight);
            this.style.mt = 0 - (topSpace - ev.clientY);
        }
        else {
            // 否则垂直居中显示
            this.style.mt =
                (window.innerHeight - this.style.height - this.border) / 2;
        }
        this.setWrapStyle();
        this.wrap.style.display = 'block';
    }
    // 以鼠标所在位置为中心点缩放
    // 例如，鼠标放在角色的眼睛上面进行缩放，在缩放之后，依然把眼睛定位到鼠标所在位置
    // 当用户滚动鼠标滚轮时，传递鼠标相对于原图区域的坐标（不包含 border）
    zoomWrap(ev, zoomAdd) {
        // 设置 zoom 等级
        const oldZoom = this.zoom;
        const oldZoomIndex = this.zoomIndex;
        let cancel = false;
        this.zoomIndex += zoomAdd ? 1 : -1;
        this.zoom = this.zoomList[this.zoomIndex];
        if (this.zoom === undefined) {
            cancel = true;
        }
        // 检查缩放后的图片的尺寸是否超出了限制
        const testWidth = this.style.imgW * this.zoom;
        const testHeight = this.style.imgH * this.zoom;
        if (Math.max(testWidth, testHeight) > 30000) {
            cancel = true;
        }
        if (cancel) {
            this.zoom = oldZoom;
            this.zoomIndex = oldZoomIndex;
            return;
        }
        // 启动缩放
        this.style.width = this.style.imgW * this.zoom;
        this.style.height = this.style.imgH * this.zoom;
        // 计算这次缩放相对于上次缩放增加的倍率（容器的尺寸会增加多少倍）
        const zoom = (this.zoom - oldZoom) / oldZoom;
        // 缩放之前，鼠标与容器顶点形成了一个矩形（0, 0, offsetX, offsetY）
        // 计算这个矩形在缩放之后，相比于缩放之前增加了多少像素
        const offsetXAdd = ev.offsetX * zoom;
        const offsetYAdd = ev.offsetY * zoom;
        // 对缩放之前的 margin 值加以修改，使缩放之前的鼠标位置的图像现在仍然位于鼠标位置
        this.style.ml = this.style.ml - offsetXAdd;
        this.style.mt = this.style.mt - offsetYAdd;
        this.setWrapStyle();
    }
    moveWrap(ev) {
        // 计算鼠标距离上次执行时，移动的距离
        const mouseMoveX = ev.clientX - this.moveX;
        const mouseMoveY = ev.clientY - this.moveY;
        // 在水平方向上应该移动多少像素
        let moveX = mouseMoveX * this.onePxMove * this.zoom;
        // 在垂直方向上应该移动多少像素
        let moveY = mouseMoveY * this.onePxMove * this.zoom;
        // 设置容差值，允许图像的边界与可视区域之间存在空隙
        // 例如，本来图片的左侧与可视区域的左侧重合时，就不应该允许图片继续向右移动了。
        // 现在设置了容差值，使图片可以继续向右移动 tolerance 像素。
        // 这样可以让用户知道已经移动到了图片的边缘，避免用户产生疑惑。
        const tolerance = 10;
        let ml;
        let mt;
        // 鼠标向左移动，wrap 向右移动，ml 增加
        if (mouseMoveX < 0) {
            // 如果 wrap 左侧还有被隐藏的部分，才允许向右移动 
            if (this.style.ml < tolerance) {
                ml = this.style.ml - moveX;
            }
        }
        // 鼠标向右移动，wrap 向左移动，ml 减少
        if (mouseMoveX > 0) {
            // 如果 wrap 右侧还有被隐藏的部分，才允许向左移动
            if (this.style.ml + this.style.width > window.innerWidth - tolerance) {
                ml = this.style.ml - moveX;
            }
        }
        // 鼠标向上移动，warp 向下移动，mt 增加
        if (mouseMoveY < 0) {
            // 如果 wrap 顶部还有被隐藏的部分，才允许向下移动
            if (this.style.mt < tolerance) {
                mt = this.style.mt - moveY;
            }
        }
        // 鼠标向下移动，warp 向上移动，mt 减少
        if (mouseMoveY > 0) {
            // 如果 wrap 底部还有被隐藏的部分，才允许向上移动
            if (this.style.mt + this.style.height > window.innerHeight - tolerance) {
                mt = this.style.mt - moveY;
            }
        }
        // 设置 margin 时，需要检查容器是否处于可视区域之外。如果超出了可视区域则不赋值
        if (ml !== undefined) {
            if ((ml > 0 && ml < window.innerWidth) || (ml < 0 && ml + this.style.width > tolerance)) {
                // 如果 ml 小于 0，其右边的坐标不可以小于 0
                this.style.ml = ml;
            }
        }
        if (mt !== undefined) {
            if ((mt > 0 && mt < window.innerHeight) || (mt < 0 && mt + this.style.height > tolerance)) {
                // 如果 mt 小于 0，其底边的坐标不可以小于 0 
                this.style.mt = mt;
            }
        }
        this.setWrapStyle();
    }
    setWrapStyle() {
        this.wrap.style.width = this.style.width + 'px';
        this.wrap.style.height = this.style.height + 'px';
        this.wrap.style.marginTop = this.style.mt + 'px';
        this.wrap.style.marginLeft = this.style.ml + 'px';
    }
    hidden() {
        this.show = false;
        this.img.src = '';
        this.wrap.style.display = 'none';
    }
    setWorkData(data) {
        this.workData = data;
    }
}
const showOriginSizeImage = new ShowOriginSizeImage();



/***/ }),

/***/ "./src/ts/ShowWhatIsNew.ts":
/*!*********************************!*\
  !*** ./src/ts/ShowWhatIsNew.ts ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/Utils */ "./src/ts/utils/Utils.ts");




// 显示最近更新内容
class ShowWhatIsNew {
    constructor() {
        this.flag = 'xzNew1130';
        this.msg = `${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_新增设置项')}<br>${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_预览作品')}`;
        this.storeName = 'xzNewVerTag';
        this.show();
    }
    show() {
        const value = localStorage.getItem(this.storeName);
        if (_utils_Utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].isPixiv() && value !== this.flag) {
            _MsgBox__WEBPACK_IMPORTED_MODULE_2__["msgBox"].show(this.msg, {
                title: _config_Config__WEBPACK_IMPORTED_MODULE_1__["Config"].appName + ` ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_最近更新')}`,
                btn: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_我知道了'),
            });
            localStorage.setItem(this.storeName, this.flag);
        }
    }
}
new ShowWhatIsNew();


/***/ }),

/***/ "./src/ts/ShowZoomBtnOnThumb.ts":
/*!**************************************!*\
  !*** ./src/ts/ShowZoomBtnOnThumb.ts ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _ImageViewer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImageViewer */ "./src/ts/ImageViewer.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MouseOverThumbnail */ "./src/ts/MouseOverThumbnail.ts");




// 在作品缩略图上显示放大按钮，点击按钮会调用图片查看器来查看大图
class ShowZoomBtnOnThumb {
    constructor() {
        this.btnId = 'zoomBtnOnThumb';
        this.btnSize = [32, 32];
        this.hiddenBtnTimer = 0; // 使用定时器让按钮延迟消失。这是为了解决一些情况下按钮闪烁的问题
        this.hiddenBtnDelay = 100;
        this.currentWorkId = ''; // 显示放大按钮时，保存触发事件的作品 id
        this.doNotShowBtn = false; // 当点击了放大按钮后，进入此状态，此状态中不会显示放大按钮
        this.addBtn();
        this.bindEvents();
    }
    // 此状态是为了解决这个问题：点击了放大按钮之后，按钮会被隐藏，隐藏之后，鼠标下方就是图片缩略图区域，这会触发缩略图的鼠标事件，导致放大按钮马上就又显示了出来。所以点击放大按钮之后设置这个状态，在其为 true 的期间不会显示放大按钮。过一段时间再把它复位。复位所需的时间很短，因为只要能覆盖这段时间就可以了：从隐藏放大按钮开始算起，到缩略图触发鼠标事件结束。
    addBtn() {
        const btn = document.createElement('button');
        btn.id = this.btnId;
        btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-fangda"></use>
</svg>`;
        this.btn = document.body.appendChild(btn);
    }
    bindEvents() {
        // 页面切换时隐藏按钮
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitch, () => {
            this.hiddenBtn();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.clickBtnOnThumb, () => {
            this.hiddenBtnNow();
        });
        // 页面切换时隐藏按钮
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart, () => {
            this.hiddenBtn();
        });
        // 鼠标移入按钮时取消隐藏按钮
        this.btn.addEventListener('mouseenter', (ev) => {
            window.clearTimeout(this.hiddenBtnTimer);
        });
        // 鼠标移出按钮时隐藏按钮
        this.btn.addEventListener('mouseleave', () => {
            this.hiddenBtn();
        });
        // 点击按钮时初始化图片查看器
        this.btn.addEventListener('click', (ev) => {
            this.hiddenBtnNow();
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('clickBtnOnThumb');
            if (this.currentWorkId) {
                new _ImageViewer__WEBPACK_IMPORTED_MODULE_1__["ImageViewer"]({
                    workId: this.currentWorkId,
                    imageNumber: 1,
                    imageSize: _setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].magnifierSize,
                    autoStart: true,
                    showLoading: true,
                });
            }
        });
        _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_3__["mouseOverThumbnail"].onEnter((el, id) => {
            this.currentWorkId = id;
            this.showBtn(el);
        });
        _MouseOverThumbnail__WEBPACK_IMPORTED_MODULE_3__["mouseOverThumbnail"].onLeave(() => {
            this.hiddenBtn();
        });
    }
    // 显示放大按钮
    showBtn(target) {
        if (this.doNotShowBtn) {
            return;
        }
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].magnifier) {
            return;
        }
        window.clearTimeout(this.hiddenBtnTimer);
        const rect = target.getBoundingClientRect();
        this.btn.style.left =
            window.pageXOffset +
                rect.left +
                (_setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].magnifierPosition === 'left'
                    ? 0
                    : rect.width - this.btnSize[0]) +
                'px';
        this.btn.style.top = window.pageYOffset + rect.top + 'px';
        this.btn.style.display = 'flex';
    }
    // 延迟隐藏放大按钮
    hiddenBtn() {
        window.clearTimeout(this.hiddenBtnTimer);
        this.hiddenBtnTimer = window.setTimeout(() => {
            this.btn.style.display = 'none';
        }, this.hiddenBtnDelay);
    }
    // 立刻隐藏放大按钮
    hiddenBtnNow() {
        this.doNotShowBtn = true;
        window.setTimeout(() => {
            this.doNotShowBtn = false;
        }, 100);
        window.clearTimeout(this.hiddenBtnTimer);
        this.btn.style.display = 'none';
    }
}
new ShowZoomBtnOnThumb();


/***/ }),

/***/ "./src/ts/Theme.ts":
/*!*************************!*\
  !*** ./src/ts/Theme.ts ***!
  \*************************/
/*! exports provided: theme */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "theme", function() { return theme; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/Utils */ "./src/ts/utils/Utils.ts");


// 下载器的主题默认跟随页面主题。如果用户设置了下载器主题，则不再跟随页面主题
class Theme {
    constructor() {
        this.allTheme = ['white', 'dark'];
        this.defaultTheme = 'white'; // 默认主题
        this.theme = 'white'; // 保存当前使用的主题
        this.settingTheme = ''; // 保存用户设置的下载器主题
        // 主题标记以及对应的 className
        // 把需要响应主题变化的元素注册到这个组件里，元素会被添加当前主题的 className
        // 默认主题 white 是没有 className 的，其他主题通过对应的 className，在默认主题的基础上更改样式。
        this.classNameMap = new Map([
            ['white', ''],
            ['dark', 'theme-dark'],
        ]);
        this.selector = '#gtm-var-theme-kind'; // 通过这个选择器查找含有主题标记的元素
        this.timer = 0;
        // 页面上储存的主题标记，与本组件里的主题的对应关系
        this.htmlFlagMap = new Map([
            ['', 'white'],
            ['default', 'white'],
            ['dark', 'dark'],
        ]);
        this.elList = []; // 保存已注册的元素
        if (_utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].isPixiv()) {
            this.bindEvents();
        }
    }
    bindEvents() {
        // 主题设置变化时修改主题
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'theme') {
                this.settingTheme = data.value;
                this.setTheme(data.value);
            }
        });
        // 使用定时器查找标记元素
        this.timer = window.setInterval(() => {
            this.findFlag();
        }, 300);
    }
    // 查找含有 pixiv 主题标记的元素，并监听其变化
    findFlag() {
        const el = document.querySelector(this.selector);
        if (el) {
            window.clearInterval(this.timer);
            this.setTheme(this.getThemeFromHtml());
            // 监听标记元素的 textContent 变化
            const ob = new MutationObserver((mutationsList) => {
                for (const item of mutationsList) {
                    if (item.type === 'characterData') {
                        this.setTheme(this.getThemeFromHtml());
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
    getThemeFromHtml() {
        // 从含有 pixiv 主题标记的元素里获取主题
        const el = document.querySelector(this.selector);
        if (el) {
            return this.htmlFlagMap.get(el.textContent) || this.defaultTheme;
        }
        // 根据 html 元素的背景颜色判断
        // "rgb(245, 245, 245)"
        // "rgb(0, 0, 0)"
        const htmlBG = getComputedStyle(document.documentElement)['backgroundColor'];
        if (htmlBG) {
            if (htmlBG.includes('rgb(2')) {
                return 'white';
            }
            else if (htmlBG.includes('rgb(0')) {
                return 'dark';
            }
        }
        return this.defaultTheme;
    }
    setTheme(flag) {
        // 如果用户设置了下载器主题，则始终使用下载器主题（忽略页面主题）
        if (this.allTheme.includes(this.settingTheme)) {
            flag = this.settingTheme;
        }
        let result = 'white'; // 储存根据标记所选择的主题
        // 根据标记，设置要使用的主题
        switch (flag) {
            case 'white':
                result = 'white';
                break;
            case 'dark':
                result = 'dark';
                break;
            default:
                // 如果传递的值是本模块不能识别的，包括 'auto'，就都自动获取
                result = this.getThemeFromHtml() || this.defaultTheme;
                break;
        }
        // 如果计算出的主题和当前主题不同，则执行变化
        if (result !== this.theme) {
            this.theme = result;
            for (const el of this.elList) {
                this.setClass(el);
            }
        }
    }
    // 把元素注册到本组件里
    register(el) {
        if (!_utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].isPixiv()) {
            return;
        }
        this.elList.push(el);
        this.setClass(el);
    }
    // 给元素设置主题对应的 className
    setClass(el) {
        // 先清除所有主题颜色的 className
        for (const className of this.classNameMap.values()) {
            if (el.classList.contains(className)) {
                el.classList.remove(className);
            }
        }
        // 添加当前主题对应的 className
        const name = this.classNameMap.get(this.theme);
        name && el.classList.add(name);
    }
}
const theme = new Theme();



/***/ }),

/***/ "./src/ts/Tip.ts":
/*!***********************!*\
  !*** ./src/ts/Tip.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

// 给下载器的界面元素添加提示文本，当鼠标移动到元素上时会显示提示
// 如果要给某个元素添加提示，先给它添加 has_tip 的 className，然后用 data-tip 设置提示内容
class Tip {
    constructor() {
        this.tipEl = document.createElement('div'); // tip 元素
        this.addTipEl();
        this.bindEvents();
    }
    addTipEl() {
        this.tipEl = document.createElement('div');
        this.tipEl.id = 'tip';
        document.body.insertAdjacentElement('afterbegin', this.tipEl);
    }
    bindEvents() {
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

/***/ "./src/ts/Toast.ts":
/*!*************************!*\
  !*** ./src/ts/Toast.ts ***!
  \*************************/
/*! exports provided: toast */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toast", function() { return toast; });
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/Colors */ "./src/ts/config/Colors.ts");

// 轻提示，只显示文字和背景颜色
// 适用于无需用户进行确认的提示
class Toast {
    constructor() {
        this.defaultCfg = {
            msg: '',
            color: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].white,
            bgColor: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].bgBrightBlue,
            dealy: 1500,
            enter: 'up',
            leave: 'fade',
            position: 'topCenter',
        };
        this.successCfg = {
            msg: '',
            color: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].white,
            bgColor: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].bgSuccess,
            dealy: 1500,
            enter: 'up',
            leave: 'fade',
            position: 'topCenter',
        };
        this.warningCfg = {
            msg: '',
            color: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].white,
            bgColor: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].bgWarning,
            dealy: 1500,
            enter: 'up',
            leave: 'fade',
            position: 'topCenter',
        };
        this.errorCfg = {
            msg: '',
            color: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].white,
            bgColor: _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].bgError,
            dealy: 1500,
            enter: 'up',
            leave: 'fade',
            position: 'topCenter',
        };
        this.tipClassName = 'xzToast';
        this.mousePosition = { x: 0, y: 0 };
        this.minTop = 20;
        this.once = 1; // 每一帧移动多少像素
        this.total = 20; // 移动多少像素后消失
        this.bindEvents();
    }
    bindEvents() {
        // 必须是监听 mousemove 而不是 click
        window.addEventListener('mousemove', (ev) => {
            this.mousePosition.x = ev.x;
            this.mousePosition.y = ev.y;
        });
    }
    show(msg, arg) {
        this.create(Object.assign({}, this.defaultCfg, arg, { msg: msg }));
    }
    success(msg, arg) {
        this.create(Object.assign({}, this.successCfg, arg, { msg: msg }));
    }
    warning(msg, arg) {
        this.create(Object.assign({}, this.warningCfg, arg, { msg: msg }));
    }
    error(msg, arg) {
        this.create(Object.assign({}, this.errorCfg, arg, { msg: msg }));
    }
    create(arg) {
        const span = document.createElement('span');
        span.textContent = arg.msg;
        span.style.color = arg.color;
        // 设置背景颜色，优先使用 color
        span.style.backgroundColor = arg.bgColor;
        span.style.opacity = '0'; // 先使提示完全透明
        // 把提示添加到页面上
        span.classList.add(this.tipClassName);
        document.body.appendChild(span);
        // 设置 left，使其居中
        // 默认的中间点是窗口的中间
        let centerPoint = window.innerWidth / 2;
        if (arg.position === 'mouse') {
            // 把中间点设置为鼠标所处的位置
            centerPoint = this.mousePosition.x;
        }
        // 设置 left
        const rect = span.getBoundingClientRect();
        let left = centerPoint - rect.width / 2;
        const minLeft = 0; // 防止提示左侧超出窗口
        const maxLeft = window.innerWidth - rect.width; // 防止提示右侧超出窗口
        if (left < minLeft) {
            left = minLeft;
        }
        if (left > maxLeft) {
            left = maxLeft;
        }
        span.style.left = left + 'px';
        // 设置 top
        let lastTop = 0;
        if (arg.position === 'topCenter') {
            lastTop = this.minTop;
        }
        else if (arg.position === 'mouse') {
            // 跟随鼠标位置
            // top 值减去一点高度，使文字出现在鼠标上方
            let y = this.mousePosition.y - 40;
            if (y < this.minTop) {
                y = this.minTop;
            }
            lastTop = y;
        }
        // 出现动画
        if (arg.enter === 'none') {
            span.style.top = lastTop + 'px';
            span.style.opacity = '1';
        }
        else {
            this.enter(span, arg.enter, lastTop);
        }
        // 消失动画
        window.setTimeout(() => {
            if (arg.leave === 'none') {
                span.remove();
            }
            else {
                this.leave(span, arg.leave, lastTop);
            }
        }, arg.dealy);
    }
    // 提示出现的动画
    enter(el, way, lastTop) {
        const startTop = lastTop + this.total; // 初始 top 值
        const once = 2;
        const total = this.total;
        let numberOfTimes = 0; // 执行次数
        const frame = function (timestamp) {
            numberOfTimes++;
            // 计算总共上移了多少像素
            const move = once * numberOfTimes;
            // 计算不透明度
            const opacity = move / total;
            if (move <= total && opacity <= 1) {
                if (way === 'up') {
                    el.style.top = startTop - move + 'px';
                }
                el.style.opacity = opacity.toString();
                // 请求下一帧
                window.requestAnimationFrame(frame);
            }
        };
        window.requestAnimationFrame(frame);
    }
    // 提示消失的动画
    leave(el, way, lastTop) {
        const startTop = lastTop; // 初始 top 值
        const once = this.once;
        const total = this.total;
        let numberOfTimes = 0; // 执行次数
        const frame = function (timestamp) {
            numberOfTimes++;
            // 计算总共上移了多少像素
            const move = once * numberOfTimes;
            // 计算不透明度
            const opacity = 1 - move / total;
            if (move < total && opacity > 0) {
                if (way === 'up') {
                    el.style.top = startTop - move + 'px';
                }
                el.style.opacity = opacity.toString();
                // 请求下一帧
                window.requestAnimationFrame(frame);
            }
            else {
                // 动画执行完毕，删除元素
                el.remove();
            }
        };
        window.requestAnimationFrame(frame);
    }
}
const toast = new Toast();



/***/ }),

/***/ "./src/ts/Token.ts":
/*!*************************!*\
  !*** ./src/ts/Token.ts ***!
  \*************************/
/*! exports provided: token */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "token", function() { return token; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/Utils */ "./src/ts/utils/Utils.ts");


// 获取和保存 token
class Token {
    constructor() {
        this.tokenStore = 'xzToken';
        this.timeStore = 'xzTokenTime';
        this.updateURL = 'https://www.pixiv.net/artworks/62751951';
        if (_utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].isPixiv()) {
            this.token = this.getToken();
            this.updateToken();
            this.bindEvents();
        }
    }
    bindEvents() {
        // 重置设置时清除保存的 token，因为用户切换账号时，登录上新账号后可能 token 还是之前账号的，就会出错。清除设置时清除 token，就可以解决这个问题。
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resetSettings, () => {
            this.reset();
        });
    }
    getToken() {
        const token = localStorage.getItem(this.tokenStore);
        return token ? token : '';
    }
    updateToken() {
        const interval = 300000; // 两次更新之间的最小时间间隔。目前设置为 5 分钟
        const nowTime = new Date().getTime();
        const lastTimeStr = localStorage.getItem(this.timeStore);
        if (this.token &&
            lastTimeStr &&
            nowTime - Number.parseInt(lastTimeStr) < interval) {
            return;
        }
        // 从网页源码里获取用户 token 并储存
        fetch(this.updateURL)
            .then((response) => {
            return response.text();
        })
            .then((data) => {
            const result = data.match(/token":"(\w+)"/);
            // 不论用户是否登录，都有 token，所以不能根据 token 来判断用户是否登录
            // 如果存在下面的字符串，则说明用户未登录：
            // "userData":null
            if (result) {
                this.token = result[1];
                localStorage.setItem(this.tokenStore, this.token);
                localStorage.setItem(this.timeStore, new Date().getTime().toString());
            }
            else {
                console.error('UpdateToken failed: no token found!');
            }
        });
    }
    reset() {
        this.token = '';
        localStorage.removeItem(this.tokenStore);
        localStorage.removeItem(this.timeStore);
        this.updateToken();
    }
}
const token = new Token();



/***/ }),

/***/ "./src/ts/Tools.ts":
/*!*************************!*\
  !*** ./src/ts/Tools.ts ***!
  \*************************/
/*! exports provided: Tools */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tools", function() { return Tools; });
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/Utils */ "./src/ts/utils/Utils.ts");

class Tools {
    // 把结果中的动图排列到最前面
    static sortUgoiraFirst(a, b) {
        if (a.type === 2 && b.type !== 2) {
            return -1;
        }
        else if (a.type === 2 && b.type === 2) {
            return 0;
        }
        else {
            return 1;
        }
    }
    // 根据 tag 判断是否是 R-18(G) 作品
    static isR18OrR18G(tags) {
        const str = Array.isArray(tags) ? tags.toString() : tags;
        return (str.includes('R-18') ||
            str.includes('R-18G') ||
            str.includes('R18') ||
            str.includes('R18G'));
    }
    // 在不同的页面类型里，尝试从 url 中获取 tag
    static getTagFromURL(url = location.href) {
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
                    return decodeURIComponent(array[array.length - 1]);
                }
            }
        }
        // 4 旧版收藏页面
        if (nowURL.pathname === '/bookmark.php') {
            if (parseInt(_utils_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].getURLSearchField(nowURL.href, 'untagged')) === 1) {
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
                return decodeURIComponent(test[1]);
            }
        }
        // 5 搜索页面
        if (nowURL.pathname.includes('/tags/')) {
            return decodeURIComponent(nowURL.pathname.split('tags/')[1].split('/')[0]);
        }
        // 默认情况，从查询字符串里获取，如下网址
        // https://www.pixiv.net/bookmark.php?tag=R-18
        return decodeURIComponent(_utils_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].getURLSearchField(nowURL.href, 'tag'));
    }
    // 从 url 里获取 artworks id
    // 可以传入作品页面的 url（推荐）。如果未传入 url 则使用当前页面的 url（此时可能获取不到 id）
    // 如果查找不到 id 会返回空字符串
    static getIllustId(url) {
        const str = url || window.location.search || location.href;
        let test = null;
        if (str.includes('/artworks/')) {
            // 新版 url
            test = /artworks\/(\d*\d)/.exec(str);
        }
        else if (str.includes('illust_id')) {
            // 传统 url
            test = /illust_id=(\d*\d)/.exec(str);
        }
        if (test && test.length > 1) {
            return test[1];
        }
        else {
            return '';
        }
    }
    // 从 url 里获取 novel id
    // 可以传入作品页面的 url（推荐）。如果未传入 url 则使用当前页面的 url（此时可能获取不到 id）
    // 如果查找不到 id 会返回空字符串
    // https://www.pixiv.net/novel/show.php?id=12771688
    static getNovelId(url) {
        const str = url || window.location.search || location.href;
        let result = '';
        const test = str.match(/\?id=(\d*)?/);
        if (test && test.length > 1) {
            result = test[1];
        }
        return result;
    }
    // 获取当前页面的用户 id
    // 这是一个不够可靠的 api
    // 测试：在 https://www.pixiv.net/artworks/79399027 获取 userId ，正确的结果应该是 13895186
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
    // 将元素插入到 Pixiv 页面顶部
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
    // 创建下载面板上的通用按钮
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
    /**获取页面标题，并且删除 TitleBar 的标记和未读消息的计数（现在 p 站似乎没有消息计数了） */
    static getPageTitle() {
        return document.title
            .replace(/\[(↑|→|▶|↓|║|■|✓| )\] /, '')
            .replace(/^\(\d.*\) /, '');
    }
    // 自定义的类型保护
    static isArtworkTags(data) {
        return data.translation !== undefined;
    }
    /**从作品数据里提取出 tag 列表
     *
     * 可选参数 type:
     *
     * 'origin' 默认值，获取原版 tag
     *
     * 'transl' 获取翻译后的 tag。只有图片作品有翻译，小说作品的 tag 没有翻译。如果某个 tag 没有翻译，则会保存它的原版 tag
     *
     * 'both' 同时获取原版 tag 和翻译后的 tag。此时可能会有重复的值，所以返回值做了去重处理。
     */
    static extractTags(data, type = 'origin') {
        const tags = [];
        const tagsTransl = [];
        const tagArr = data.body.tags.tags;
        for (const tagData of tagArr) {
            // 添加原版 tag
            tags.push(tagData.tag);
            // 添加翻译的 tag
            if (this.isArtworkTags(tagData)) {
                if (tagData.translation && tagData.translation.en) {
                    // 不管是什么语种的翻译结果，都保存在 en 属性里
                    tagsTransl.push(tagData.translation.en);
                }
                else {
                    // 如果没有翻译，则把原 tag 保存到翻译里
                    tagsTransl.push(tagData.tag);
                }
            }
            else {
                // 没有翻译
                tagsTransl.push(tagData.tag);
            }
        }
        if (type === 'origin') {
            return tags;
        }
        else if (type === 'transl') {
            return Array.from(new Set(tagsTransl));
        }
        else {
            return Array.from(new Set(tags.concat(tagsTransl)));
        }
    }
    /**转换 thumb url
     *
     * 因为现在 pixiv 的多图作品的数据里，thumb url 只是第一张图的，后面的图片没有 thumb url 数据
     *
     * 此方法使用另一套缩略图 url，这样所有的图片都能够获得可用的缩略图 url
     */
    // 根据 issues/140 进行此优化。前后对比示例：
    // https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2021/03/03/06/29/53/88179809_p1_custom1200.jpg
    // https://i.pximg.net/c/128x128/img-master/img/2021/03/03/06/29/53/88179809_p1_square1200.jpg
    static convertArtworkThumbURL(thumbURL, no) {
        return thumbURL
            .replace('250x250_80_a2/custom-thumb', '128x128/img-master')
            .replace('custom1200', 'square1200')
            .replace('p0', 'p' + no);
    }
    // 旧版本的 Result 数据中没有 index 属性，使用此方法进行兼容性处理
    static getResultIndex(data) {
        if (data.type === 0 || data.type === 1) {
            // 插画和漫画，从 id 里取出序号
            return parseInt(/\d*$/.exec(data.id)[0]);
        }
        else {
            // 其他作品类型只有 1 个文件所以值为 0
            return 0;
        }
    }
    static isPremium() {
        // 在 body 的一个 script 标签里包含有当前用户是否是会员的信息
        // premium: 'yes'
        // premium: 'no'
        const test = document.body.innerHTML.match(/premium: '(\w+)'/);
        if (test && test.length > 1) {
            return test[1] === 'yes';
        }
        return false;
    }
}



/***/ }),

/***/ "./src/ts/config/Colors.ts":
/*!*********************************!*\
  !*** ./src/ts/config/Colors.ts ***!
  \*********************************/
/*! exports provided: Colors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Colors", function() { return Colors; });
var Colors;
(function (Colors) {
    // 通用颜色
    Colors["white"] = "#fff";
    Colors["black"] = "#000";
    Colors["red"] = "#f00";
    Colors["theme"] = "#0ea8ef";
    // 带有语义的字体颜色
    Colors["textSuccess"] = "#00BD17";
    Colors["textWarning"] = "#d27e00";
    Colors["textError"] = "#f00";
    // 背景颜色
    // 稍暗，适合在颜色区域的面积较大时使用
    Colors["bgBlue"] = "#0ea8ef";
    Colors["bgGreen"] = "#14ad27";
    Colors["bgYellow"] = "#e49d00";
    Colors["bgRed"] = "#f33939";
    // 带有语义的背景颜色
    // 稍亮，适合在小区域使用
    Colors["bgBrightBlue"] = "#29b3f3";
    Colors["bgSuccess"] = "#00BD17";
    Colors["bgWarning"] = "#e49d00";
    Colors["bgError"] = "#f00";
})(Colors || (Colors = {}));



/***/ }),

/***/ "./src/ts/config/Config.ts":
/*!*********************************!*\
  !*** ./src/ts/config/Config.ts ***!
  \*********************************/
/*! exports provided: Config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return Config; });
// 储存一些配置
// 用户不可以修改这里的配置
class Config {
}
/**使用输出面板显示内容时，如果文件数量大于这个值，就不再显示内容，而是保存到 txt 文件 */
Config.outputMax = 5000;
/**同时下载的文件数量的最大值 */
Config.downloadThreadMax = 6;
/**下载某个文件出错时，最大重试次数 */
Config.retryMax = 10;
/**作品类型所对应的字符串名称 */
Config.worksTypeName = ['Illustration', 'Manga', 'Ugoira', 'Novel'];
/**程序名 */
Config.appName = 'Powerful Pixiv Downloader';
/**下载器设置在 localStorage 里储存时的 name */
Config.settingStoreName = 'xzSetting';
/**按收藏数量过滤作品时，预设的最大收藏数量 */
Config.BookmarkCountLimit = 9999999;
/**作品总数量限制 */
Config.worksNumberLimit = 999999999;



/***/ }),

/***/ "./src/ts/content.ts":
/*!***************************!*\
  !*** ./src/ts/content.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _setting_InvisibleSettings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./setting/InvisibleSettings */ "./src/ts/setting/InvisibleSettings.ts");
/* harmony import */ var _ListenPageSwitch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ListenPageSwitch */ "./src/ts/ListenPageSwitch.ts");
/* harmony import */ var _CenterPanel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CenterPanel */ "./src/ts/CenterPanel.ts");
/* harmony import */ var _InitPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./InitPage */ "./src/ts/InitPage.ts");
/* harmony import */ var _crawlMixedPage_QuickCrawl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./crawlMixedPage/QuickCrawl */ "./src/ts/crawlMixedPage/QuickCrawl.ts");
/* harmony import */ var _download_DownloadControl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./download/DownloadControl */ "./src/ts/download/DownloadControl.ts");
/* harmony import */ var _download_showStatusOnTitle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./download/showStatusOnTitle */ "./src/ts/download/showStatusOnTitle.ts");
/* harmony import */ var _Tip__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Tip */ "./src/ts/Tip.ts");
/* harmony import */ var _Tip__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_Tip__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _PreviewWork__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./PreviewWork */ "./src/ts/PreviewWork.ts");
/* harmony import */ var _ShowZoomBtnOnThumb__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ShowZoomBtnOnThumb */ "./src/ts/ShowZoomBtnOnThumb.ts");
/* harmony import */ var _ShowDownloadBtnOnThumb__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ShowDownloadBtnOnThumb */ "./src/ts/ShowDownloadBtnOnThumb.ts");
/* harmony import */ var _output_OutputPanel__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./output/OutputPanel */ "./src/ts/output/OutputPanel.ts");
/* harmony import */ var _output_PreviewFileName__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./output/PreviewFileName */ "./src/ts/output/PreviewFileName.ts");
/* harmony import */ var _output_ShowURLs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./output/ShowURLs */ "./src/ts/output/ShowURLs.ts");
/* harmony import */ var _download_ExportResult2CSV__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./download/ExportResult2CSV */ "./src/ts/download/ExportResult2CSV.ts");
/* harmony import */ var _download_ExportResult__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./download/ExportResult */ "./src/ts/download/ExportResult.ts");
/* harmony import */ var _download_ImportResult__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./download/ImportResult */ "./src/ts/download/ImportResult.ts");
/* harmony import */ var _download_ExportLST__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./download/ExportLST */ "./src/ts/download/ExportLST.ts");
/* harmony import */ var _download_MergeNovel__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./download/MergeNovel */ "./src/ts/download/MergeNovel.ts");
/* harmony import */ var _download_SaveWorkMeta__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./download/SaveWorkMeta */ "./src/ts/download/SaveWorkMeta.ts");
/* harmony import */ var _ShowWhatIsNew__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./ShowWhatIsNew */ "./src/ts/ShowWhatIsNew.ts");
/* harmony import */ var _ShowHowToUse__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./ShowHowToUse */ "./src/ts/ShowHowToUse.ts");
/* harmony import */ var _CheckUnsupportBrowser__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./CheckUnsupportBrowser */ "./src/ts/CheckUnsupportBrowser.ts");
/* harmony import */ var _ShowNotification__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./ShowNotification */ "./src/ts/ShowNotification.ts");
/*
 * project: Powerful Pixiv Downloader
 * author:  xuejianxianzun; 雪见仙尊
 * license: GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
 * Github： https://github.com/xuejianxianzun/PixivBatchDownloader
 * Releases: https://github.com/xuejianxianzun/PixivBatchDownloader/releases
 * Wiki:    https://xuejianxianzun.github.io/PBDWiki
 * Website: https://pixiv.download/
 * E-mail:  xuejianxianzun@gmail.com
 */























// import './CheckNewVersion'






/***/ }),

/***/ "./src/ts/crawl/InitPageBase.ts":
/*!**************************************!*\
  !*** ./src/ts/crawl/InitPageBase.ts ***!
  \**************************************/
/*! exports provided: InitPageBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitPageBase", function() { return InitPageBase; });
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _store_SaveArtworkData__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../store/SaveArtworkData */ "./src/ts/store/SaveArtworkData.ts");
/* harmony import */ var _store_SaveNovelData__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../store/SaveNovelData */ "./src/ts/store/SaveNovelData.ts");
/* harmony import */ var _filter_Mute__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../filter/Mute */ "./src/ts/filter/Mute.ts");
/* harmony import */ var _SelectWork__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../SelectWork */ "./src/ts/SelectWork.ts");
/* harmony import */ var _pageFunciton_DestroyManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../pageFunciton/DestroyManager */ "./src/ts/pageFunciton/DestroyManager.ts");
/* harmony import */ var _VipSearchOptimize__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./VipSearchOptimize */ "./src/ts/crawl/VipSearchOptimize.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
// 初始化所有页面抓取流程的基类




















class InitPageBase {
    constructor() {
        this.crawlNumber = 0; // 要抓取的个数/页数
        this.maxCount = 1000; // 当前页面类型最多有多少个页面/作品
        this.startpageNo = 1; // 列表页开始抓取时的页码，只在 api 需要页码时使用。目前有搜索页、排行榜页、新作品页、系列页面使用。
        this.listPageFinished = 0; // 记录一共抓取了多少个列表页。使用范围同上。
        this.ajaxThreadsDefault = 10; // 抓取时的并发连接数默认值，也是最大值
        this.ajaxThread = this.ajaxThreadsDefault; // 抓取时的并发请求数
        this.finishedRequest = 0; // 抓取作品之后，如果 id 队列为空，则统计有几个并发线程完成了请求。当这个数量等于 ajaxThreads 时，说明所有请求都完成了
        this.crawlStopped = false; // 抓取是否已停止
    }
    // 子组件不可以修改 init 方法
    init() {
        this.setFormOption();
        this.addCrawlBtns();
        this.addAnyElement();
        this.initAny();
        // 注册当前页面的 destroy 函数
        _pageFunciton_DestroyManager__WEBPACK_IMPORTED_MODULE_14__["destroyManager"].register(this.destroy.bind(this));
        // 切换页面时，如果任务已经完成，则清空输出区域，避免日志一直堆积。
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].bindOnce('clearLogAfterPageSwitch', _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].list.pageSwitch, () => {
            if (!_store_States__WEBPACK_IMPORTED_MODULE_9__["states"].busy) {
                _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('clearLog');
            }
        });
        // 监听下载 id 列表的事件
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].bindOnce('crawlIdList', _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].list.crawlIdList, (ev) => {
            const idList = ev.detail.data;
            if (idList) {
                this.crawlIdList(idList);
            }
        });
    }
    // 设置表单里的选项。主要是设置页数，隐藏不需要的选项。
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_7__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_数字提示1'),
        });
    }
    // 添加抓取区域的按钮
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    // 添加其他任意元素（如果有）
    addAnyElement() { }
    // 初始化任意内容
    // 如果有一些代码不能归纳到 init 方法的前面几个方法里，那就放在这里
    // 通常用来初始化特有的组件、功能、事件、状态等
    initAny() { }
    // 销毁初始化页面时添加的元素和事件，恢复设置项等
    destroy() {
        _Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].clearSlot('crawlBtns');
        _Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].clearSlot('otherBtns');
    }
    // 作品个数/页数的输入不合法
    getWantPageError() {
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('wrongSetting');
        const msg = _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_参数不合法');
        _MsgBox__WEBPACK_IMPORTED_MODULE_17__["msgBox"].error(msg);
        throw new Error(msg);
    }
    // 在某些页面检查页数/个数设置
    // 可以为 -1，或者大于 0
    checkWantPageInput(crawlPartTip, crawlAllTip) {
        const want = _setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].wantPageArr[_PageType__WEBPACK_IMPORTED_MODULE_19__["pageType"].type];
        // 如果比 1 小，并且不是 -1，则不通过
        if ((want < 1 && want !== -1) || isNaN(want)) {
            // 比 1 小的数里，只允许 -1 , 0 也不行
            throw this.getWantPageError();
        }
        if (want >= 1) {
            _Log__WEBPACK_IMPORTED_MODULE_5__["log"].warning(crawlPartTip.replace('{}', want.toString()));
        }
        else if (want === -1) {
            _Log__WEBPACK_IMPORTED_MODULE_5__["log"].warning(crawlAllTip);
        }
        return want;
    }
    // 在某些页面检查页数/个数设置，要求必须大于 0
    // 参数 max 为最大值
    // 参数 page 指示单位是“页”（页面）还是“个”（作品个数）
    checkWantPageInputGreater0(max, page) {
        const want = _setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].wantPageArr[_PageType__WEBPACK_IMPORTED_MODULE_19__["pageType"].type];
        if (want > 0) {
            const result = want > max ? max : want;
            if (page) {
                _Log__WEBPACK_IMPORTED_MODULE_5__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_从本页开始下载x页', result.toString()));
            }
            else {
                _Log__WEBPACK_IMPORTED_MODULE_5__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_从本页开始下载x个', result.toString()));
            }
            return result;
        }
        else {
            throw this.getWantPageError();
        }
    }
    // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
    getWantPage() { }
    // 获取多图作品设置。因为这个不属于过滤器 filter，所以在这里直接获取
    getMultipleSetting() {
        // 获取作品张数设置
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].firstFewImagesSwitch) {
            _Log__WEBPACK_IMPORTED_MODULE_5__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图作品只下载前几张图片') + _setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].firstFewImages);
        }
    }
    // 准备正常进行抓取，执行一些检查
    async readyCrawl() {
        // 检查是否可以开始抓取
        if (_store_States__WEBPACK_IMPORTED_MODULE_9__["states"].busy) {
            _Toast__WEBPACK_IMPORTED_MODULE_16__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_当前任务尚未完成'));
            return;
        }
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].clear();
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_任务开始0'));
        if (_utils_Utils__WEBPACK_IMPORTED_MODULE_18__["Utils"].isPixiv()) {
            await _filter_Mute__WEBPACK_IMPORTED_MODULE_12__["mute"].getMuteSettings();
        }
        this.getWantPage();
        this.getMultipleSetting();
        this.finishedRequest = 0;
        this.crawlStopped = false;
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('crawlStart');
        // 进入第一个抓取流程
        this.nextStep();
    }
    // 基于传递的 id 列表直接开始抓取
    // 这个方法是为了让其他模块可以传递 id 列表，直接进行下载。
    // 这个类的子类没有必要使用这个方法。当子类需要直接指定 id 列表时，修改自己的 getIdList 方法即可。
    async crawlIdList(idList) {
        // 检查是否可以开始抓取
        if (_store_States__WEBPACK_IMPORTED_MODULE_9__["states"].busy) {
            _Toast__WEBPACK_IMPORTED_MODULE_16__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_当前任务尚未完成'));
            return;
        }
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].clear();
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_任务开始0'));
        if (_utils_Utils__WEBPACK_IMPORTED_MODULE_18__["Utils"].isPixiv()) {
            await _filter_Mute__WEBPACK_IMPORTED_MODULE_12__["mute"].getMuteSettings();
        }
        this.getMultipleSetting();
        this.finishedRequest = 0;
        this.crawlStopped = false;
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('crawlStart');
        _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList = idList;
        this.getIdListFinished();
    }
    // 当可以开始抓取时，进入下一个流程。默认情况下，开始获取作品列表。如有不同，由子类具体定义
    nextStep() {
        this.getIdList();
    }
    // 获取 id 列表，由各个子类具体定义
    getIdList() { }
    // id 列表获取完毕，开始抓取作品内容页
    getIdListFinished() {
        this.resetGetIdListStatus();
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('getIdListFinished');
        if (_store_States__WEBPACK_IMPORTED_MODULE_9__["states"].bookmarkMode) {
            return;
        }
        if (_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.length === 0) {
            return this.noResult();
        }
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_当前作品个数', _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.length.toString()));
        // 这个 return 在这里重置任务状态，不继续抓取作品的详情了，用于调试时反复进行抓取
        // return states.allWork = false
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_开始获取作品信息'));
        if (_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.length <= this.ajaxThreadsDefault) {
            this.ajaxThread = _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.length;
        }
        else {
            this.ajaxThread = this.ajaxThreadsDefault;
        }
        for (let i = 0; i < this.ajaxThread; i++) {
            this.getWorksData();
        }
    }
    // 重设抓取作品列表时使用的变量或标记
    resetGetIdListStatus() { }
    // 获取作品的数据
    async getWorksData(idData) {
        idData = idData || _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.shift();
        const id = idData.id;
        if (!id) {
            const msg = 'Error: work id is invalid!';
            _MsgBox__WEBPACK_IMPORTED_MODULE_17__["msgBox"].error(msg);
            throw new Error(msg);
        }
        try {
            if (idData.type === 'novels') {
                const data = await _API__WEBPACK_IMPORTED_MODULE_3__["API"].getNovelData(id);
                await _store_SaveNovelData__WEBPACK_IMPORTED_MODULE_11__["saveNovelData"].save(data);
                this.afterGetWorksData(data);
            }
            else {
                const data = await _API__WEBPACK_IMPORTED_MODULE_3__["API"].getArtworkData(id);
                await _store_SaveArtworkData__WEBPACK_IMPORTED_MODULE_10__["saveArtworkData"].save(data);
                this.afterGetWorksData(data);
            }
        }
        catch (error) {
            if (error.status) {
                // 请求成功，但状态码不正常，不再重试
                this.logErrorStatus(error.status, id);
                this.afterGetWorksData();
            }
            else {
                // 请求失败，没有获得服务器的返回数据，一般都是
                // TypeError: Failed to fetch
                // 此外这里也会捕获到 save 作品数据时的错误（如果有）
                console.error(error);
                // 再次发送这个请求
                setTimeout(() => {
                    this.getWorksData(idData);
                }, 2000);
            }
        }
    }
    // 每当获取完一个作品的信息
    async afterGetWorksData(data) {
        // 抓取可能中途停止，在停止之后完成的抓取不进行任何处理
        if (this.crawlStopped) {
            return;
        }
        this.logResultTotal();
        // 如果会员搜索优化策略指示停止抓取，则立即进入完成状态
        if (data && (await _VipSearchOptimize__WEBPACK_IMPORTED_MODULE_15__["vipSearchOptimize"].stopCrawl(data))) {
            // 指示抓取已停止
            this.crawlStopped = true;
            this.crawlFinished();
        }
        if (_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.length > 0) {
            // 如果存在下一个作品，则
            this.getWorksData();
        }
        else {
            // 没有剩余作品，统计此后有多少个完成的请求
            this.finishedRequest++;
            // 所有请求都执行完毕
            if (this.finishedRequest === this.ajaxThread) {
                this.crawlFinished();
            }
        }
    }
    // 抓取完毕
    crawlFinished() {
        if (_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length === 0) {
            return this.noResult();
        }
        _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].crawlCompleteTime = new Date();
        this.sortResult();
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].downloadUgoiraFirst) {
            _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].resultMeta.sort(_Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].sortUgoiraFirst);
            _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.sort(_Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].sortUgoiraFirst);
        }
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_共抓取到n个作品', _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].resultMeta.length.toString()));
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_共抓取到n个文件', _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length.toString()));
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取完毕'), 2);
        // 发出抓取完毕的信号
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('crawlFinish');
        // 自动导出抓取结果
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].autoExportResult &&
            _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length > _setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].autoExportResultNumber) {
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].autoExportResultCSV) {
                _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('exportCSV');
            }
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].autoExportResultJSON) {
                _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('exportResult');
            }
        }
    }
    // 网络请求状态异常时输出提示
    logErrorStatus(status, id) {
        switch (status) {
            case 0:
                _Log__WEBPACK_IMPORTED_MODULE_5__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码0'));
                break;
            case 400:
                _Log__WEBPACK_IMPORTED_MODULE_5__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码400'));
                break;
            case 403:
                _Log__WEBPACK_IMPORTED_MODULE_5__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码403'));
                break;
            case 404:
                _Log__WEBPACK_IMPORTED_MODULE_5__["log"].error(id + ': ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_作品页状态码404'));
                break;
            default:
                _Log__WEBPACK_IMPORTED_MODULE_5__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_无权访问', id));
                break;
        }
    }
    // 每当抓取了一个作品之后，输出提示
    logResultTotal() {
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].log(`${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_待处理')} ${_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.length}, ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_共抓取到n个作品', _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].resultMeta.length.toString())}`, 1, false);
    }
    // 抓取结果为 0 时输出提示
    noResult() {
        // 先触发 crawlFinish，后触发 crawlEmpty。这样便于其他组件处理 crawlEmpty 这个例外情况
        // 如果触发顺序反过来，那么最后执行的都是 crawlFinish，可能会覆盖对 crawlEmpty 的处理
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('crawlFinish');
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('crawlEmpty');
        const msg = _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取结果为零');
        _Log__WEBPACK_IMPORTED_MODULE_5__["log"].error(msg, 2);
        _MsgBox__WEBPACK_IMPORTED_MODULE_17__["msgBox"].error(msg);
    }
    // 抓取完成后，对结果进行排序
    sortResult() { }
}



/***/ }),

/***/ "./src/ts/crawl/VipSearchOptimize.ts":
/*!*******************************************!*\
  !*** ./src/ts/crawl/VipSearchOptimize.ts ***!
  \*******************************************/
/*! exports provided: vipSearchOptimize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vipSearchOptimize", function() { return vipSearchOptimize; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");






// 当 Pixiv 会员使用按热门度排序搜索时，进行优化
// 优化的原理：当会员使用热门度排序时，Pixiv 返回的数据是按收藏数量从高到低排序的。（但不是严格一致，经常有少量作品顺序不对）
// 假如会员用户在下载器里设置了收藏数量大于 10000，那么当查找到小于 10000 收藏的作品时，就可以考虑停止搜索，因为后面的作品都是收藏数量低于 10000 的了
class VipSearchOptimize {
    constructor() {
        // 在哪些页面上启用
        this.enablePageType = [_PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].list.ArtworkSearch];
        // 小说搜索页面不需要优化，因为列表数据中包含了每个作品的收藏数
        // 只有会员才能使用的排序方式（按热门度排序）
        this.vipOrders = [
            'popular_d',
            'popular_male_d',
            'popular_female_d',
        ];
        // popular_d 受全站欢迎
        // popular_male_d 受男性欢迎
        // popular_female_d 受女性欢迎
        // 是否对这次抓取使用优化策略
        this.vipSearchOptimize = false;
        this.filterFailed = 0; // 连续检查失败的数量。在检查作品是否满足收藏条件时，如果满足就将此计数清零；如果不满足就自增
        this.checkNumber = 30; // 连续多少个作品未达到要求时，停止抓取。这是一个猜测值
        this.bindEvents();
    }
    // 设置 checkNumber 的原因：Pixiv 按热门度排序返回的数据其实并不是严格按照收藏数量排序的。所以设置一个数字作为处理这个情况的手段：连续多少个作品都不满足要求时，认为后续都是不满足要求的
    bindEvents() {
        // 启动抓取时设置是否启用优化策略
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart, () => {
            this.vipSearchOptimize = this.setVipOptimize();
        });
        // 抓取完毕时重置状态
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlFinish, () => {
            this.reset();
        });
    }
    reset() {
        this.vipSearchOptimize = false;
        this.filterFailed = 0;
    }
    // 指示是否停止抓取作品
    async stopCrawl(data) {
        // 如果未启用会员搜索优化，或者没有设置收藏数量要求，则不停止抓取
        if (!this.vipSearchOptimize || !_setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].BMKNumSwitch) {
            return false;
        }
        // 连续多少个作品没有达到要求，则停止抓取
        if (this.filterFailed >= this.checkNumber) {
            return true;
        }
        // 判断收藏数量是否不符合要求
        const check = await _filter_Filter__WEBPACK_IMPORTED_MODULE_3__["filter"].check({
            bookmarkCount: data.body.bookmarkCount,
        });
        if (!check) {
            this.filterFailed++;
        }
        else {
            this.filterFailed = 0;
        }
        return this.filterFailed >= this.checkNumber;
    }
    // 设置是否启用优化策略
    setVipOptimize() {
        // 判断页面类型
        if (!this.enablePageType.includes(_PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].type)) {
            return false;
        }
        // 判断是否是会员
        if (!_Tools__WEBPACK_IMPORTED_MODULE_5__["Tools"].isPremium()) {
            return false;
        }
        // 判断 order 方式
        const order = _utils_Utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].getURLSearchField(window.location.href, 'order');
        // 无排序方式
        if (!order) {
            return false;
        }
        const vipOrder = this.vipOrders.includes(order);
        // 不是按热门度排序
        if (!vipOrder) {
            return false;
        }
        // 按热门度排序
        // 判断是否启用了收藏数设置，如果是，则启用会员搜索优化
        return _setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].BMKNumSwitch;
    }
}
const vipSearchOptimize = new VipSearchOptimize();



/***/ }),

/***/ "./src/ts/crawlArtworkPage/InitAreaRankingPage.ts":
/*!********************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitAreaRankingPage.ts ***!
  \********************************************************/
/*! exports provided: InitAreaRankingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitAreaRankingPage", function() { return InitAreaRankingPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
// 初始化地区排行榜页面







class InitAreaRankingPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.init();
    }
    initAny() { }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本页作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本页作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([1]);
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
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                const id = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].getIllustId(el.querySelector('a').href);
                _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                    type: 'unknown',
                    id,
                });
            }
        }
        this.getIdListFinished();
    }
}



/***/ }),

/***/ "./src/ts/crawlArtworkPage/InitArtworkPage.ts":
/*!****************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitArtworkPage.ts ***!
  \****************************************************/
/*! exports provided: InitArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitArtworkPage", function() { return InitArtworkPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _pageFunciton_QuickBookmark__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pageFunciton/QuickBookmark */ "./src/ts/pageFunciton/QuickBookmark.ts");
/* harmony import */ var _ImageViewer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ImageViewer */ "./src/ts/ImageViewer.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
//初始化 artwork 作品页












class InitArtworkPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.crawlDirection = 0; // 抓取方向，指示抓取新作品还是旧作品
        /*
        -1 抓取新作品
        0 不设置抓取方向
        1 抓取旧作品
        */
        this.crawlRelated = false; // 是否下载相关作品
        this.init();
    }
    initAny() {
        // 初始化快速收藏功能和图片查看器
        this.initQuickBookmark();
        this.initImgViewer();
        // 页面切换再次初始化
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].list.pageSwitchedTypeNotChange, this.initQuickBookmark);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].list.pageSwitchedTypeNotChange, this.initImgViewer);
    }
    initImgViewer() {
        new _ImageViewer__WEBPACK_IMPORTED_MODULE_7__["ImageViewer"]({
            showImageList: true,
            imageListId: 'viewerWarpper',
            insertTarget: 'main figcaption',
            insertPostion: 'beforebegin',
        });
    }
    initQuickBookmark() {
        new _pageFunciton_QuickBookmark__WEBPACK_IMPORTED_MODULE_6__["QuickBookmark"]();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取new')).addEventListener('click', () => {
            this.crawlDirection = -1;
            this.readyCrawl();
        });
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取old')).addEventListener('click', () => {
            this.crawlDirection = 1;
            this.readyCrawl();
        });
        const downRelatedBtn = _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取相关作品'));
        downRelatedBtn.addEventListener('click', () => {
            this.crawlRelated = true;
            this.readyCrawl();
        }, false);
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示') +
                '<br>' +
                _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_相关作品大于0'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_数字提示1'),
        });
    }
    destroy() {
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].clearSlot('crawlBtns');
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].clearSlot('otherBtns');
        // 解除切换页面时绑定的事件
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].list.pageSwitchedTypeNotChange, this.initQuickBookmark);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].list.pageSwitchedTypeNotChange, this.initImgViewer);
    }
    getWantPage() {
        // 检查下载页数的设置
        if (!this.crawlRelated) {
            const crawlAllTip = this.crawlDirection === -1
                ? _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取new')
                : _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始抓取old');
            this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载x个'), crawlAllTip);
        }
        else {
            // 相关作品的提示
            this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载x个相关作品'), _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载所有相关作品'));
        }
    }
    nextStep() {
        // 下载相关作品
        if (this.crawlRelated) {
            this.getRelatedList();
        }
        else {
            // 向前向后下载
            this.getIdList();
        }
    }
    async getIdList() {
        let type = ['illusts', 'manga'];
        let idList = await _API__WEBPACK_IMPORTED_MODULE_9__["API"].getUserWorksByType(_Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].getUserId(), type);
        // 储存符合条件的 id
        let nowId = parseInt(_Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].getIllustId(window.location.href));
        idList.forEach((id) => {
            let idNum = parseInt(id.id);
            // 新作品
            if (idNum >= nowId && this.crawlDirection === -1) {
                _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push(id);
            }
            else if (idNum <= nowId && this.crawlDirection === 1) {
                // 旧作品
                _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push(id);
            }
        });
        // 当设置了下载个数时，进行裁剪
        if (this.crawlNumber !== -1) {
            // 新作品 升序排列
            if (this.crawlDirection === -1) {
                _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].sortByProperty('id')).reverse();
            }
            else {
                // 旧作品 降序排列
                _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].sortByProperty('id'));
            }
            _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.splice(0, this.crawlNumber);
        }
        this.getIdListFinished();
    }
    // 下载相关作品时使用
    async getRelatedList() {
        let data = await _API__WEBPACK_IMPORTED_MODULE_9__["API"].getRelatedData(_Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].getIllustId());
        // 相关作品的列表由两部分构成，所以要组合起来
        let ids = [];
        for (const illust of data.body.illusts) {
            if (illust.isAdContainer) {
                continue;
            }
            ids.push(illust.id);
        }
        ids = ids.concat(data.body.nextIds);
        // 当设置了下载个数时，进行裁剪
        if (this.crawlNumber !== -1) {
            ids = ids.slice(0, this.crawlNumber);
        }
        for (const id of ids) {
            _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
                type: 'unknown',
                id,
            });
        }
        _Log__WEBPACK_IMPORTED_MODULE_10__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_相关作品抓取完毕', _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.length.toString()));
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.crawlDirection = 0; // 解除下载方向的标记
        this.crawlRelated = false; // 解除下载相关作品的标记
    }
}



/***/ }),

/***/ "./src/ts/crawlArtworkPage/InitArtworkSeriesPage.ts":
/*!**********************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitArtworkSeriesPage.ts ***!
  \**********************************************************/
/*! exports provided: InitArtworkSeriesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitArtworkSeriesPage", function() { return InitArtworkSeriesPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
// 初始化插画/漫画的系列作品页面










class InitArtworkSeriesPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.seriesId = '';
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    initAny() { }
    setFormOption() {
        // 个数/页数选项的提示
        this.maxCount = 100;
        _setting_Options__WEBPACK_IMPORTED_MODULE_5__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示'),
            rangTip: `1 - ${this.maxCount}`,
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, true);
    }
    nextStep() {
        // 设置起始页码
        const p = _utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        // 获取系列 id
        this.seriesId = _API__WEBPACK_IMPORTED_MODULE_2__["API"].getURLPathField('series');
        this.getIdList();
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
            if (!idList.includes(work.id)) {
                continue;
            }
            if (work.isAdContainer) {
                continue;
            }
            // 过滤器进行检查
            const filterOpt = {
                id: work.id,
                tags: work.tags,
                bookmarkData: !!work.bookmarkData,
                width: work.width,
                height: work.height,
                workType: work.illustType,
                userId: work.userId,
                createDate: work.createDate,
                xRestrict: work.xRestrict,
            };
            // 因为这个 api 的 illust 数据可能是插画也可能是漫画，所以 type 是 unknown
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check(filterOpt)) {
                _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                    type: 'unknown',
                    id: work.id,
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

/***/ "./src/ts/crawlArtworkPage/InitBookmarkDetailPage.ts":
/*!***********************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitBookmarkDetailPage.ts ***!
  \***********************************************************/
/*! exports provided: InitBookmarkDetailPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkDetailPage", function() { return InitBookmarkDetailPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
// 初始化 bookmark_detail 页面







class InitBookmarkDetailPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取相似图片'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取相似图片')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        }, false);
    }
    initAny() { }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, false);
    }
    // 获取相似的作品列表
    async getIdList() {
        let data = await _API__WEBPACK_IMPORTED_MODULE_5__["API"].getRecommenderData(_Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].getIllustId(), this.crawlNumber);
        for (const id of data.recommendations) {
            _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                type: 'unknown',
                id: id.toString(),
            });
        }
        this.getIdListFinished();
    }
}



/***/ }),

/***/ "./src/ts/crawlArtworkPage/InitDiscoverPage.ts":
/*!*****************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitDiscoverPage.ts ***!
  \*****************************************************/
/*! exports provided: InitDiscoverPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitDiscoverPage", function() { return InitDiscoverPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _pageFunciton_DeleteWorks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pageFunciton/DeleteWorks */ "./src/ts/pageFunciton/DeleteWorks.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
// 初始化发现页面







class InitDiscoverPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取当前作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取当前作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    initAny() { }
    setFormOption() {
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([1]);
    }
    addAnyElement() {
        const deleteWorks = new _pageFunciton_DeleteWorks__WEBPACK_IMPORTED_MODULE_5__["DeleteWorks"]('._2RNjBox');
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
            const id = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].getIllustId(el.href.split('&uarea')[0]);
            _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                type: 'unknown',
                id,
            });
        });
        this.getIdListFinished();
    }
}



/***/ }),

/***/ "./src/ts/crawlArtworkPage/InitNewArtworkPage.ts":
/*!*******************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitNewArtworkPage.ts ***!
  \*******************************************************/
/*! exports provided: InitNewArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNewArtworkPage", function() { return InitNewArtworkPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
// 初始化 大家的新作品 artwork 页面










class InitNewArtworkPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.option = this.resetOption();
        this.limitMax = 20; // 每次请求的数量最大是 20
        this.fetchCount = 0; // 已请求的作品数量
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载大家的新作品')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    initAny() { }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, false);
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
        this.option.type =
            _utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].getURLSearchField(location.href, 'type') || 'illust';
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
                id: nowData.id,
                width: nowData.width,
                height: nowData.height,
                pageCount: nowData.pageCount,
                bookmarkData: nowData.bookmarkData,
                workType: nowData.illustType,
                tags: nowData.tags,
                userId: nowData.userId,
                createDate: nowData.createDate,
                xRestrict: nowData.xRestrict,
            };
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_4__["filter"].check(filterOpt)) {
                _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                    type: _API__WEBPACK_IMPORTED_MODULE_5__["API"].getWorkType(nowData.illustType),
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

/***/ "./src/ts/crawlArtworkPage/InitPixivisionPage.ts":
/*!*******************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitPixivisionPage.ts ***!
  \*******************************************************/
/*! exports provided: InitPixivisionPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitPixivisionPage", function() { return InitPixivisionPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
// 初始化 pixivision 页面







class InitPixivisionPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.init();
    }
    addCrawlBtns() {
        const typeA = document.querySelector('a[data-gtm-action=ClickCategory]');
        const type = typeA.dataset.gtmLabel;
        if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
            // 在插画、漫画、cosplay类型的页面上创建下载功能
            _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取该页面的图片')).addEventListener('click', () => {
                this.readyCrawl();
            }, false);
        }
    }
    setFormOption() {
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].hideOption([
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
            16,
            18,
            19,
            21,
            22,
            23,
            24,
            26,
            27,
            28,
            30,
            31,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            42,
            43,
            44,
            46,
            47,
            48,
            49,
            50,
            51,
            54,
            55,
            56,
            58,
            59,
            60,
            61,
        ]);
    }
    nextStep() {
        this.getPixivision();
    }
    // 保存要下载的图片的信息
    addResult(id, url, ext) {
        _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].addResult({
            id: id,
            idNum: Number.parseInt(id),
            original: url,
            ext: ext,
        });
    }
    async getPixivision() {
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
            for (const url of urls) {
                let arr = url.split('/');
                const id = arr[arr.length - 1].split('.')[0].split('_')[0]; // 作品id，尝试提取出数字部分
                await this.testExtName(url, id);
            }
            this.crawlFinished();
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
    // 通过加载图片来判断图片的后缀名。pixivision 页面直接获取的图片后缀都是 jpg 的
    async testExtName(url, id) {
        let ext = 'jpg'; // 默认为 jpg
        await _utils_Utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].loadImg(url).catch(() => {
            // 如果图片加载失败则把后缀改为 png
            url = url.replace('.jpg', '.png');
            ext = 'png';
        });
        this.addResult(id, url, ext);
        this.logResultTotal();
    }
}



/***/ }),

/***/ "./src/ts/crawlArtworkPage/InitRankingArtworkPage.ts":
/*!***********************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitRankingArtworkPage.ts ***!
  \***********************************************************/
/*! exports provided: InitRankingArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitRankingArtworkPage", function() { return InitRankingArtworkPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
// 初始化 artwork 排行榜页面












class InitRankingArtworkPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.pageCount = 10; // 排行榜的页数
        this.option = this.resetOption();
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取本排行榜作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取本排行榜作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
        // 判断当前页面是否有“首次登场”标记
        const debutModes = ['daily', 'daily_r18', 'rookie', ''];
        const mode = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'mode');
        if (debutModes.includes(mode)) {
            _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取首次登场的作品'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_抓取首次登场的作品Title')]]).addEventListener('click', () => {
                _store_States__WEBPACK_IMPORTED_MODULE_10__["states"].debut = true;
                this.readyCrawl();
            });
        }
    }
    initAny() {
        // 抓取完成后，复位 debut 标记
        // 因为 debut 只在抓取阶段被过滤器使用，所以抓取完成后就可以复位
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.crawlFinish, () => {
            _store_States__WEBPACK_IMPORTED_MODULE_10__["states"].debut = false;
        });
    }
    setFormOption() {
        // 个数/页数选项的提示
        this.maxCount = 500;
        _setting_Options__WEBPACK_IMPORTED_MODULE_6__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
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
        this.option.mode = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'mode') || 'daily';
        this.option.worksType = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'content');
        this.option.date = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'date');
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
                workType: parseInt(data.illust_type),
                tags: data.tags,
                pageCount: parseInt(data.illust_page_count),
                bookmarkData: data.is_bookmarked,
                width: data.width,
                height: data.height,
                yes_rank: data.yes_rank,
                userId: data.user_id.toString(),
            };
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_7__["filter"].check(filterOpt)) {
                _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].setRankList(data.illust_id.toString(), data.rank);
                _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].idList.push({
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

/***/ "./src/ts/crawlArtworkPage/InitSearchArtworkPage.ts":
/*!**********************************************************!*\
  !*** ./src/ts/crawlArtworkPage/InitSearchArtworkPage.ts ***!
  \**********************************************************/
/*! exports provided: InitSearchArtworkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitSearchArtworkPage", function() { return InitSearchArtworkPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _pageFunciton_DeleteWorks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pageFunciton/DeleteWorks */ "./src/ts/pageFunciton/DeleteWorks.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _pageFunciton_FastScreen__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../pageFunciton/FastScreen */ "./src/ts/pageFunciton/FastScreen.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _pageFunciton_BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../pageFunciton/BookmarkAllWorks */ "./src/ts/pageFunciton/BookmarkAllWorks.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _store_IdListWithPageNo__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../store/IdListWithPageNo */ "./src/ts/store/IdListWithPageNo.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _Bookmark__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../Bookmark */ "./src/ts/Bookmark.ts");
/* harmony import */ var _crawlMixedPage_CrawlTagList__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../crawlMixedPage/CrawlTagList */ "./src/ts/crawlMixedPage/CrawlTagList.ts");
// 初始化 artwork 搜索页





















class InitSearchArtworkPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
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
        this.needCrawlPageCount = 0; // 需要抓取多少个列表页面
        this.sendCrawlTaskCount = 0; // 发送抓取请求之前会自增，用于计算要抓取的页码。不是请求完成后自增
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
            'work_lang',
        ];
        this.resultMeta = []; // 每次“开始筛选”完成后，储存当时所有结果，以备“在结果中筛选”使用
        this.worksWrap = null;
        this.deleteId = 0; // 手动删除时，要删除的作品的 id
        this.causeResultChange = ['firstFewImagesSwitch', 'firstFewImages']; // 这些选项变更时，可能会导致结果改变。但是过滤器 filter 不会检查，所以需要单独检测它的变更，手动处理
        this.flag = 'searchArtwork';
        this.crawlStartBySelf = false;
        this.onSettingChange = (event) => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_14__["states"].crawlTagList) {
                return;
            }
            const data = event.detail.data;
            if (this.causeResultChange.includes(data.name)) {
                if (_store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].result.length > 0) {
                    this.reAddResult();
                    _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('resultChange');
                }
            }
        };
        // 抓取完成后，保存结果的元数据，并重排结果
        this.onCrawlFinish = () => {
            // 当从图片查看器发起下载时，也会触发抓取完毕的事件，但此时不应该调整搜索页面的结果。
            if (_store_States__WEBPACK_IMPORTED_MODULE_14__["states"].downloadFromViewer || _store_States__WEBPACK_IMPORTED_MODULE_14__["states"].crawlTagList || _store_States__WEBPACK_IMPORTED_MODULE_14__["states"].quickCrawl) {
                return;
            }
            if (!this.crawlStartBySelf) {
                return;
            }
            this.resultMeta = [..._store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].resultMeta];
            this.clearWorks();
            this.reAddResult();
            // 解绑创建作品元素的事件
            window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.addResult, this.createWork);
            setTimeout(() => {
                _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('worksUpdate');
            }, 0);
            this.crawlStartBySelf = false;
        };
        // 显示抓取到的作品数量
        this.showCount = () => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_14__["states"].crawlTagList || !_setting_Settings__WEBPACK_IMPORTED_MODULE_10__["settings"].previewResult) {
                return;
            }
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_10__["settings"].previewResult && this.countEl) {
                const count = this.resultMeta.length || _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].resultMeta.length;
                this.countEl.textContent = count.toString();
            }
        };
        // 在页面上生成抓取结果对应的作品元素
        this.createWork = (event) => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_14__["states"].crawlTagList) {
                return;
            }
            if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_10__["settings"].previewResult || !this.worksWrap) {
                return;
            }
            const data = event.detail.data;
            let r18Text = '';
            if (data.xRestrict === 1) {
                r18Text = 'R-18';
            }
            if (data.xRestrict === 2) {
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
          <a target="_blank" href="/users/${data.userId}">
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
        this.addBookmark = (event) => {
            const data = event.detail.data;
            for (const r of _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].result) {
                if (r.idNum === data.id) {
                    _Bookmark__WEBPACK_IMPORTED_MODULE_19__["Bookmark"].add(data.id.toString(), 'illusts', data.tags);
                    // 同步数据
                    r.bookmarked = true;
                    this.resultMeta.forEach((result) => {
                        if (result.idNum === data.id) {
                            result.bookmarked = true;
                        }
                    });
                    break;
                }
            }
        };
        this.crawlTag = () => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_14__["states"].crawlTagList) {
                this.readyCrawl();
            }
        };
        this.init();
        new _pageFunciton_FastScreen__WEBPACK_IMPORTED_MODULE_11__["FastScreen"]();
        _crawlMixedPage_CrawlTagList__WEBPACK_IMPORTED_MODULE_20__["crawlTagList"].init();
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
        });
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_12__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.resultMeta = [];
            this.crawlStartBySelf = true;
            window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.addResult, this.createWork);
            this.readyCrawl();
        });
        _Tools__WEBPACK_IMPORTED_MODULE_12__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_在结果中筛选'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_在结果中筛选Title')],
        ]).addEventListener('click', () => {
            this.screenInResult();
        });
    }
    addAnyElement() {
        const deleteWorks = new _pageFunciton_DeleteWorks__WEBPACK_IMPORTED_MODULE_4__["DeleteWorks"](`.${this.listClass}`);
        deleteWorks.addClearMultipleBtn(`.${this.multipleClass}`, () => {
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('clearMultiple');
        });
        deleteWorks.addClearUgoiraBtn(`.${this.ugoiraClass}`, () => {
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('clearUgoira');
        });
        deleteWorks.addManuallyDeleteBtn((el) => {
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('deleteWork', el);
        });
        // 添加收藏本页所有作品的功能
        const bookmarkAllBtn = _Tools__WEBPACK_IMPORTED_MODULE_12__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_收藏本页面的所有作品'));
        const bookmarkAll = new _pageFunciton_BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_13__["BookmarkAllWorks"](bookmarkAllBtn);
        bookmarkAllBtn.addEventListener('click', () => {
            const listWrap = this.getWorksWrap();
            if (listWrap) {
                const list = listWrap.querySelectorAll('li');
                // 被二次筛选过滤掉的作品会被隐藏，所以批量添加收藏时，过滤掉隐藏的作品
                const showList = Array.from(list).filter((el) => {
                    return el.style.display !== 'none';
                });
                bookmarkAll.sendWorkList(showList);
            }
        });
    }
    initAny() {
        this.hotBar();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.pageSwitchedTypeNotChange, () => {
            this.hotBar();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.addResult, this.showCount);
        window.addEventListener('addBMK', this.addBookmark);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.crawlFinish, this.onCrawlFinish);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.clearMultiple, this.clearMultiple);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.clearUgoira, this.clearUgoira);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.deleteWork, this.deleteWork);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.settingChange, this.onSettingChange);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.crawlTag, this.crawlTag);
    }
    destroy() {
        _Tools__WEBPACK_IMPORTED_MODULE_12__["Tools"].clearSlot('crawlBtns');
        _Tools__WEBPACK_IMPORTED_MODULE_12__["Tools"].clearSlot('otherBtns');
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.addResult, this.showCount);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.crawlFinish, this.onCrawlFinish);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.settingChange, this.onSettingChange);
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.crawlTag, this.crawlTag);
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
    }
    async nextStep() {
        this.initFetchURL();
        // 计算应该抓取多少页
        const data = await this.getSearchData(1);
        // 计算总页数
        let pageCount = Math.ceil(data.total / this.worksNoPerPage);
        if (pageCount > 1000) {
            // 如果作品页数大于 1000 页，则判断当前用户是否是 pixiv 会员
            const isPremium = _Tools__WEBPACK_IMPORTED_MODULE_12__["Tools"].isPremium();
            if (!isPremium) {
                // 如果用户不是会员，则最多只能抓取到 1000 页
                pageCount = 1000;
            }
            else {
                // 如果用户是会员，最多可以抓取到 5000 页
                if (pageCount > 5000) {
                    pageCount = 5000;
                }
            }
        }
        // 如果当前页面的页码大于有效页码，则不进行抓取
        if (this.startpageNo > pageCount) {
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('crawlFinish');
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('crawlEmpty');
            return _MsgBox__WEBPACK_IMPORTED_MODULE_18__["msgBox"].error(`${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_超出最大页码')} ${pageCount}`);
        }
        if (this.crawlNumber === -1 || this.crawlNumber > pageCount) {
            this.crawlNumber = pageCount;
        }
        // 计算从当前页面开始抓取的话，有多少页
        let needFetchPage = pageCount - this.startpageNo + 1;
        // 比较用户设置的页数，取较小的那个数值
        this.needCrawlPageCount = Math.min(needFetchPage, this.crawlNumber);
        if (this.needCrawlPageCount === 0) {
            return this.noResult();
        }
        this.startGetIdList();
        this.clearWorks();
        this.countEl = document.querySelector(this.countSelector);
    }
    // 组织要请求的 url 中的参数
    initFetchURL() {
        var _a, _b;
        // 从 URL 中获取分类。可能有语言标识。
        /*
        https://www.pixiv.net/tags/Fate%2FGrandOrder/illustrations
        https://www.pixiv.net/en/tags/Fate%2FGrandOrder/illustrations
        */
        const URLType = (_a = location.pathname.split('tags/')[1].split('/')[1]) !== null && _a !== void 0 ? _a : '';
        // 在“顶部”页面的时候是没有分类的，会是 undefined，此时使用空字符串
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
        let p = _utils_Utils__WEBPACK_IMPORTED_MODULE_15__["Utils"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        // 从页面 url 中获取可以使用的选项
        this.option = {};
        this.allOption.forEach((param) => {
            let value = _utils_Utils__WEBPACK_IMPORTED_MODULE_15__["Utils"].getURLSearchField(location.href, param);
            if (value !== '') {
                this.option[param] = value;
            }
        });
        // 如果没有指定标签匹配模式，则使用 s_tag 标签（部分一致）
        // s_tag_full 是标签（完全一致）
        this.option.s_mode = (_b = this.option.s_mode) !== null && _b !== void 0 ? _b : 's_tag';
    }
    // 获取搜索页的数据。因为有多处使用，所以进行了封装
    async getSearchData(p) {
        let data = await _API__WEBPACK_IMPORTED_MODULE_7__["API"].getSearchData(_store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].tag, this.worksType, p, this.option);
        return data.body.illust || data.body.illustManga || data.body.manga;
    }
    // 建立并发抓取线程
    startGetIdList() {
        if (this.needCrawlPageCount <= this.ajaxThreadsDefault) {
            this.ajaxThread = this.needCrawlPageCount;
        }
        else {
            this.ajaxThread = this.ajaxThreadsDefault;
        }
        for (let i = 0; i < this.ajaxThread; i++) {
            this.getIdList();
        }
    }
    // 仅当出错重试时，才会传递参数 p。此时直接使用传入的 p，而不是继续让 p 增加
    async getIdList(p) {
        if (p === undefined) {
            p = this.startpageNo + this.sendCrawlTaskCount;
            this.sendCrawlTaskCount++;
        }
        // 发起请求，获取列表页
        let data;
        try {
            data = await this.getSearchData(p);
        }
        catch (_a) {
            return this.getIdList(p);
        }
        data = data.data;
        for (const nowData of data) {
            // 排除广告信息
            if (nowData.isAdContainer) {
                continue;
            }
            const filterOpt = {
                createDate: nowData.createDate,
                id: nowData.id,
                width: nowData.width,
                height: nowData.height,
                pageCount: nowData.pageCount,
                bookmarkData: nowData.bookmarkData,
                workType: nowData.illustType,
                tags: nowData.tags,
                userId: nowData.userId,
                xRestrict: nowData.xRestrict,
            };
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check(filterOpt)) {
                _store_IdListWithPageNo__WEBPACK_IMPORTED_MODULE_16__["idListWithPageNo"].add(this.flag, {
                    type: _API__WEBPACK_IMPORTED_MODULE_7__["API"].getWorkType(nowData.illustType),
                    id: nowData.id,
                }, p);
            }
        }
        this.listPageFinished++;
        _Log__WEBPACK_IMPORTED_MODULE_9__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
            // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
            this.getIdList();
        }
        else {
            // 抓取任务已经全部发送
            if (this.listPageFinished === this.needCrawlPageCount) {
                // 抓取任务全部完成
                _Log__WEBPACK_IMPORTED_MODULE_9__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取完成'));
                _store_IdListWithPageNo__WEBPACK_IMPORTED_MODULE_16__["idListWithPageNo"].store(this.flag);
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
        _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].resultMeta.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_15__["Utils"].sortByProperty('bmk'));
        _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].result.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_15__["Utils"].sortByProperty('bmk'));
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
    clearWorks() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_10__["settings"].previewResult || !this.crawlStartBySelf) {
            return;
        }
        this.worksWrap = this.getWorksWrap();
        if (this.worksWrap) {
            this.worksWrap.innerHTML = '';
        }
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
    // 筛选抓取结果。传入函数，过滤符合条件的结果
    // 在抓取完成之后，所有会从结果合集中删除某些结果的操作都要经过这里
    async filterResult(callback) {
        if (this.resultMeta.length === 0) {
            _Toast__WEBPACK_IMPORTED_MODULE_17__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
            return;
        }
        _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('closeCenterPanel');
        _Log__WEBPACK_IMPORTED_MODULE_9__["log"].clear();
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
        _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('resultChange');
    }
    // 重新添加抓取结果，执行时机：
    // 1 作品抓取完毕之后，添加抓取到的数据
    // 2 使用“在结果中筛选”或删除作品，使得作品数据变化了，改变作品列表视图
    // 3 修改了“多图下载设置”，导致作品数据变化
    reAddResult() {
        _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].reset();
        for (let data of this.resultMeta) {
            _store_Store__WEBPACK_IMPORTED_MODULE_8__["store"].addResult(data);
        }
        // showCount 依赖 addResult 事件，但如果清空了所有结果，则不会触发 addResult 事件，所以需要手动调用它
        if (this.resultMeta.length === 0) {
            this.showCount();
        }
    }
    // 在当前结果中再次筛选，会修改第一次筛选的结果
    screenInResult() {
        if (_store_States__WEBPACK_IMPORTED_MODULE_14__["states"].busy) {
            _Toast__WEBPACK_IMPORTED_MODULE_17__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前任务尚未完成'));
            return;
        }
        _Log__WEBPACK_IMPORTED_MODULE_9__["log"].clear();
        this.getMultipleSetting();
        this.filterResult((data) => {
            const filterOpt = {
                id: data.id,
                workType: data.type,
                pageCount: data.pageCount,
                tags: data.tags,
                bookmarkCount: data.bmk,
                bookmarkData: data.bookmarked,
                width: data.fullWidth,
                height: data.fullHeight,
                createDate: data.date,
                userId: data.userId,
                xRestrict: data.xRestrict,
            };
            return _filter_Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check(filterOpt);
        });
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
                _utils_Utils__WEBPACK_IMPORTED_MODULE_15__["Utils"].addStyle(style);
            }
        }, 300);
    }
}



/***/ }),

/***/ "./src/ts/crawlMixedPage/CrawlTagList.ts":
/*!***********************************************!*\
  !*** ./src/ts/crawlMixedPage/CrawlTagList.ts ***!
  \***********************************************/
/*! exports provided: crawlTagList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "crawlTagList", function() { return crawlTagList; });
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
// 在搜索页面抓取 tag 列表，抓取完一个 tag 就立即开始下载。下载完毕后再抓取下一个 tag
// 这是个单例类，为了控制其执行时机，需要手动执行 init 方法来进行一部分初始化








class CrawlTagList {
    constructor() {
        this.bindEventFlag = false;
        this.EnablPage = [_PageType__WEBPACK_IMPORTED_MODULE_7__["pageType"].list.ArtworkSearch, _PageType__WEBPACK_IMPORTED_MODULE_7__["pageType"].list.NovelSearch];
        this._tagList = [];
        this.storeName = 'crawlTagList';
        this.wrapId = 'crawlTagListInputWrap';
        this.onDownloadComplete = () => {
            window.setTimeout(() => {
                if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].crawlTagList) {
                    this._tagList.shift();
                    this.tagList = this._tagList;
                    if (this._tagList.length === 0) {
                        _store_States__WEBPACK_IMPORTED_MODULE_4__["states"].crawlTagList = false;
                        // 输出提示
                        this.showTagListWrap.innerHTML = `<span style="color:${_config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].textSuccess}">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载完毕')}</span>`;
                        return;
                    }
                    // 继续抓取下一个标签
                    this.readyCrawl();
                }
            }, 0);
        };
    }
    init() {
        this.addCrawlBtns();
        this.addElement();
        this.bindEvents();
        this.restoreData();
    }
    get tagList() {
        return this._tagList;
    }
    set tagList(val) {
        this._tagList = val;
        this.storeData();
        this.showTagList();
        this.toggleWrap(true);
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取标签列表')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('closeCenterPanel');
            this.toggleWrap(true);
            // 跳转到页面顶部，否则用户可能看不到输入区域
            window.scrollTo(0, 0);
        });
    }
    addElement() {
        const htmlText = `<textarea
      id="crawlTagListTextArea"
      placeholder="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取标签列表的输入框提示')}"
    ></textarea>
    <p id="crawlTagListTip">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取标签列表的文件夹提示')}</p>
    <div id="crawlTagListBtnsWrap">
      <button id="crawlTagListBtn">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取标签列表')}</button>
      <button id="clearTagListBtn">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_停止抓取标签列表')}</button>
    </div>
    <div id="tagListWrap">
      <p>${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_等待下载的标签')}</p>
      <ul id="showTagList">
      <ul>
    </div>
  `;
        // 创建输入标签列表的区域。如果页面上已存在该区域，则移除它，重新创建
        const test = document.getElementById(this.wrapId);
        if (test !== null) {
            test.remove();
        }
        const wrap = document.createElement('div');
        wrap.id = this.wrapId;
        wrap.innerHTML = htmlText;
        this.wrap = _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].insertToHead(wrap);
        this.input = this.wrap.querySelector('#crawlTagListTextArea');
        this.startCrawlBtn = this.wrap.querySelector('#crawlTagListBtn');
        this.clearCrawlBtn = this.wrap.querySelector('#clearTagListBtn');
        this.showTagListWrap = this.wrap.querySelector('#showTagList');
        this.startCrawlBtn.addEventListener('click', () => {
            this.checkInput();
        });
        this.clearCrawlBtn.addEventListener('click', () => {
            this.clear();
        });
    }
    bindEvents() {
        // 防止事件重复绑定
        if (this.bindEventFlag) {
            return;
        }
        this.bindEventFlag = true;
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].list.downloadComplete, this.onDownloadComplete);
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].list.crawlEmpty, this.onDownloadComplete);
        // 当页面类型变化时，如果进入到了不支持的页面类型，则隐藏输入区域
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].list.pageSwitch, () => {
            if (!this.EnablPage.includes(_PageType__WEBPACK_IMPORTED_MODULE_7__["pageType"].type) &&
                this._tagList.length === 0) {
                this.toggleWrap(false);
            }
        });
    }
    checkInput() {
        if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
            return _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前任务尚未完成'));
        }
        const value = this.input.value.trim();
        if (value === '') {
            return _MsgBox__WEBPACK_IMPORTED_MODULE_3__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
        }
        const array = value.split('\n').filter((val) => val !== '' && val !== ' ');
        if (array.length === 0) {
            return _MsgBox__WEBPACK_IMPORTED_MODULE_3__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
        }
        this.tagList = array;
        this.readyCrawl();
    }
    readyCrawl() {
        if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
            return _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前任务尚未完成'));
        }
        if (!this.EnablPage.includes(_PageType__WEBPACK_IMPORTED_MODULE_7__["pageType"].type)) {
            return _MsgBox__WEBPACK_IMPORTED_MODULE_3__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取标签列表') +
                '<br>' +
                _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_只能在搜索页面使用'));
        }
        _store_States__WEBPACK_IMPORTED_MODULE_4__["states"].crawlTagList = true;
        const tag = this._tagList[0];
        // 修改 title，便于使用 P_title 建立文件夹
        document.title = tag;
        // 修改 url，使用当前抓取的标签替换原本 url 里的标签，便于使用 p_tag  建立文件夹
        const urlTag = _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].getTagFromURL();
        const newURL = location.href.replace(encodeURIComponent(urlTag), encodeURIComponent(tag));
        history.pushState({ p_tag: tag }, tag, newURL);
        // 触发抓取事件
        _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('crawlTag', tag);
    }
    // 控制 wrap 的显示，如果不传入参数，则自行切换显示/隐藏状态
    toggleWrap(flag) {
        if (flag !== undefined) {
            this.wrap.style.display = flag ? 'block' : 'none';
        }
        else {
            const now = this.wrap.style.display;
            this.wrap.style.display = now === 'block' ? 'none' : 'block';
        }
    }
    showTagList() {
        const text = this.tagList.map((val) => `<li>${val}</li>`);
        this.showTagListWrap.innerHTML = text.join('');
    }
    clear() {
        if (this.tagList.length === 0) {
            return;
        }
        const confirm = window.confirm(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_你确定要停止抓取吗'));
        if (confirm) {
            this.tagList = [];
            // states.busy 有可能是因为下载器正在抓取作品，通过刷新页面可以取消抓取。
            if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
                location.reload();
            }
        }
    }
    // 每当 tagList 状态变化时，保存 tagList 到本地存储
    storeData() {
        if (this.tagList.length === 0) {
            return localStorage.removeItem(this.storeName);
        }
        localStorage.setItem(this.storeName, JSON.stringify(this.tagList));
    }
    // 启动时从本地存储里读取 tagList 数据
    restoreData() {
        const str = localStorage.getItem(this.storeName);
        if (!str) {
            return;
        }
        const data = JSON.parse(str);
        if (str.length === 0) {
            return;
        }
        this.tagList = data;
        // 在输入框里显示需要抓取的标签列表
        this.input.value = this.tagList.map((val) => val).join('\n');
        // 不会自动开始抓取未完成的标签。这是基于以下考虑：
        // 1. 如果之前有未完成的下载，那么下载器会自动恢复下载。如果此时自动开始抓取，会造成冲突
        // 2. 如果自动开始抓取，那么用户每打开一个新的搜索页面，下载器都会自动开始抓取，影响用户正常使用
    }
}
const crawlTagList = new CrawlTagList();



/***/ }),

/***/ "./src/ts/crawlMixedPage/InitBookmarkLegacyPage.ts":
/*!*********************************************************!*\
  !*** ./src/ts/crawlMixedPage/InitBookmarkLegacyPage.ts ***!
  \*********************************************************/
/*! exports provided: InitBookmarkLegacyPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkLegacyPage", function() { return InitBookmarkLegacyPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Token */ "./src/ts/Token.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _pageFunciton_BookmarksAddTag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pageFunciton/BookmarksAddTag */ "./src/ts/pageFunciton/BookmarksAddTag.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
// 初始化旧版收藏页面













class InitBookmarkLegacyPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.idList = []; // 储存从列表页获取到的 id
        this.type = 'illusts'; // 页面是图片还是小说
        this.isHide = false; // 当前页面是否显示的是非公开收藏
        this.requsetNumber = 0; // 根据页数，计算要抓取的作品个数
        this.filteredNumber = 0; // 记录检查了多少作品（不论结果是否通过都计入）
        this.onceRequest = 100; // 每次请求多少个数量
        this.offset = 0; // 要去掉的作品数量
        this.crawlRecommended = false; // 是否抓取推荐作品（收藏页面下方）
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
        // 添加下载推荐作品的按钮
        _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_抓取推荐作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_抓取推荐作品Title')],
        ]).addEventListener('click', () => {
            this.crawlRecommended = true;
            this.readyCrawl();
        }, false);
    }
    addAnyElement() {
        // 如果存在 token，则添加“添加 tag”按钮
        if (_Token__WEBPACK_IMPORTED_MODULE_3__["token"].token) {
            const btn = _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_给未分类作品添加添加tag'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_给未分类作品添加添加tag')]]);
            new _pageFunciton_BookmarksAddTag__WEBPACK_IMPORTED_MODULE_6__["BookmarksAddTag"](btn);
        }
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_5__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_数字提示1'),
        });
    }
    getWantPage() {
        let pageTip = '';
        if (this.crawlRecommended) {
            pageTip = _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载推荐作品');
        }
        else {
            pageTip = _Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载所有页面');
        }
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_从本页开始下载x页'), pageTip);
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
            this.getIdList();
        }
    }
    readyGetIdList() {
        // 每页个数
        const onceNumber = 20;
        // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
        const nowPage = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'p'); // 判断当前处于第几页，页码从 1 开始。也可能没有页码
        if (nowPage) {
            this.offset = (parseInt(nowPage) - 1) * onceNumber;
        }
        if (this.offset < 0) {
            this.offset = 0;
        }
        // 根据页数设置，计算要下载的个数
        this.requsetNumber = 0;
        if (this.crawlNumber === -1) {
            this.requsetNumber = _config_Config__WEBPACK_IMPORTED_MODULE_12__["Config"].worksNumberLimit;
        }
        else {
            this.requsetNumber = onceNumber * this.crawlNumber;
        }
        // 判断是公开收藏还是非公开收藏
        // 在新旧版 url 里，rest 都是在查询字符串里的
        this.isHide = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'rest') === 'hide';
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_正在抓取'));
        if (this.crawlNumber === -1) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_获取全部书签作品'));
        }
    }
    // 获取用户的收藏作品列表
    async getIdList() {
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getBookmarkData(_Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].getUserId(), this.type, _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].tag, this.offset, this.isHide);
        }
        catch (error) {
            this.getIdList();
            return;
        }
        if (data.body.works.length === 0 ||
            this.idList.length >= this.requsetNumber ||
            this.filteredNumber >= this.requsetNumber) {
            // 书签页获取完毕
            return this.afterGetIdList();
        }
        else {
            // 没有抓取完毕时，添加数据
            const idType = this.type === 'illusts' ? 'unknown' : 'novels';
            for (const workData of data.body.works) {
                if (this.filteredNumber >= this.requsetNumber) {
                    return this.afterGetIdList();
                }
                const filterOpt = {
                    id: workData.id,
                    tags: workData.tags,
                    bookmarkData: workData.bookmarkData,
                    createDate: workData.createDate,
                    userId: workData.userId,
                };
                this.filteredNumber++;
                if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_10__["filter"].check(filterOpt)) {
                    this.idList.push({
                        type: idType,
                        id: workData.id,
                    });
                }
            }
            this.offset += this.onceRequest; // 每次增加偏移量
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_当前作品个数', this.idList.length.toString()), 1, false);
            // 继续抓取
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
        _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList = _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.concat(this.idList);
        this.getIdListFinished();
    }
    // 获取书签页面下方的推荐作品列表
    getRecommendedList() {
        const selector = this.type === 'illusts'
            ? '#illust-recommend .image-item'
            : '.novel-items>li';
        const idType = this.type === 'illusts' ? 'unknown' : 'novels';
        const getId = this.type === 'illusts' ? _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].getIllustId : _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].getNovelId;
        // 获取下方已经加载出来的作品
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            this.crawlRecommended = false;
            return this.noResult();
        }
        // 添加作品列表
        for (const li of elements) {
            const a = li.querySelector('a');
            if (_store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.length === this.crawlNumber) {
                break;
            }
            _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
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
        this.filteredNumber = 0;
        this.crawlRecommended = false; // 解除下载推荐作品的标记
    }
    sortResult() {
        // 把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
        !this.crawlRecommended && _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].result.reverse();
    }
}



/***/ }),

/***/ "./src/ts/crawlMixedPage/InitBookmarkNewPage.ts":
/*!******************************************************!*\
  !*** ./src/ts/crawlMixedPage/InitBookmarkNewPage.ts ***!
  \******************************************************/
/*! exports provided: InitBookmarkNewPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkNewPage", function() { return InitBookmarkNewPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
// 初始化 关注的用户的新作品页面










class InitBookmarkNewPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.type = 'illust';
        this.r18 = false;
        this.newVer = false;
        // 这次抓取任务最多可以抓取到多少个作品
        this.crawlWorksMaxNumber = 0;
        // 裁剪 API 返回的作品数据时的偏移量
        this.firstOffset = 0;
        // 总计抓取了多少个作品（被裁剪掉的不算）
        this.crawledWorksNumber = 0;
        // 每当 API 返回数据时，保存第一个作品的 id，用来判断后面的数据是否出现重复
        // 如果数据重复就停止抓取，因为后面的每一页的数据都是完全相同的
        this.firstWorkId = '';
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    initAny() { }
    setFormOption() {
        // 个数/页数选项的提示
        this.maxCount = 100;
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: `1 - ${this.maxCount}`,
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, true);
    }
    nextStep() {
        this.type = window.location.pathname.includes('/novel') ? 'novel' : 'illust';
        this.r18 = location.pathname.includes('r18');
        this.newVer = !document.querySelector('h1');
        // 根据页数计算最多抓取多少个作品。新版一页 60 个作品，旧版一页 20 个作品
        this.crawlWorksMaxNumber = this.crawlNumber * (this.newVer ? 60 : 20);
        // 设置 API 里发起请求的页数
        const p = _utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].getURLSearchField(location.href, 'p');
        const pageNo = parseInt(p) || 1;
        if (this.newVer) {
            // 新版页面里，由于 API 返回的就是这一页的作品，所以直接获取地址栏的页码就可以
            this.startpageNo = pageNo;
        }
        else {
            // 旧版页面里，由于 API 一页会返回相当于旧版 3 页的数据，所以不能直接使用地址栏的页码
            // 例如用户在旧版页面的第 5 页开始抓取，实质上是从第 81 个作品开始抓取。所以 API 里要从第 2 页开始抓取（第 61 - 120 个作品），并且设置偏移量为 20
            // API 里开始抓取的页数，向上取整
            this.startpageNo = Math.ceil((pageNo * 20) / 60);
            // 计算 API 返回的 60 个数据里，可以保留多少个
            const howManyLeft = this.startpageNo * 60 - (pageNo - 1) * 20;
            // 计算偏移量
            this.firstOffset = 60 - howManyLeft;
        }
        this.getIdList();
    }
    async getIdList() {
        let p = this.startpageNo + this.listPageFinished;
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_6__["API"].getBookmarkNewWorkData(this.type, p, this.r18);
        }
        catch (error) {
            this.getIdList();
            return;
        }
        let worksData = data.body.thumbnails[this.type];
        // 检查数据，如果数据为空，或者和上一页的数据重复，说明已经不需要继续抓取了
        if (worksData.length === 0 || this.firstWorkId === worksData[0].id) {
            _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取完成'));
            return this.getIdListFinished();
        }
        else {
            // 如果数据没有重复，则保存第一个作品的 id
            this.firstWorkId = worksData[0].id;
        }
        // 旧版页面可能需要对 API 返回的数据进行裁剪
        if (!this.newVer) {
            // 使用偏移量移除不需要的数据（仅一次）
            if (this.firstOffset > 0) {
                worksData = worksData.slice(this.firstOffset);
                this.firstOffset = 0;
            }
            // 计算还有多少个作品需要抓取，然后裁剪数组，避免抓取结果超出预定的数量
            const needCrawl = this.crawlWorksMaxNumber - this.crawledWorksNumber;
            if (needCrawl < worksData.length) {
                worksData = worksData.slice(0, needCrawl);
            }
        }
        this.crawledWorksNumber += worksData.length;
        // 过滤作品
        // 过滤插画·漫画
        if (this.type === 'illust') {
            for (const data of worksData) {
                if (data.isAdContainer) {
                    continue;
                }
                const filterOpt = {
                    id: data.id,
                    width: data.width,
                    height: data.height,
                    pageCount: data.pageCount,
                    bookmarkData: data.bookmarkData,
                    workType: data.illustType,
                    tags: data.tags,
                    userId: data.userId,
                    xRestrict: data.xRestrict,
                };
                if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                    _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                        type: _API__WEBPACK_IMPORTED_MODULE_6__["API"].getWorkType(data.illustType),
                        id: data.id,
                    });
                }
            }
        }
        else {
            // 过滤小说
            for (const data of worksData) {
                const filterOpt = {
                    id: data.id,
                    workType: 3,
                    tags: data.tags,
                    bookmarkCount: data.bookmarkCount,
                    bookmarkData: data.bookmarkData,
                    userId: data.userId,
                };
                if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                    _store_Store__WEBPACK_IMPORTED_MODULE_7__["store"].idList.push({
                        type: 'novels',
                        id: data.id,
                    });
                }
            }
        }
        this.listPageFinished++;
        _Log__WEBPACK_IMPORTED_MODULE_8__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        // 判断任务状态
        // 如果抓取到了指定数量的作品，或者抓取到了最后一页，或者抓取完了指定的页面数量
        if (this.crawledWorksNumber >= this.crawlWorksMaxNumber ||
            p >= this.maxCount ||
            this.listPageFinished === this.crawlNumber) {
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
        this.firstOffset = 0;
        this.crawledWorksNumber = 0;
        this.firstWorkId = '';
    }
}



/***/ }),

/***/ "./src/ts/crawlMixedPage/InitBookmarkPage.ts":
/*!***************************************************!*\
  !*** ./src/ts/crawlMixedPage/InitBookmarkPage.ts ***!
  \***************************************************/
/*! exports provided: InitBookmarkPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitBookmarkPage", function() { return InitBookmarkPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Token__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Token */ "./src/ts/Token.ts");
/* harmony import */ var _pageFunciton_BookmarksAddTag__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../pageFunciton/BookmarksAddTag */ "./src/ts/pageFunciton/BookmarksAddTag.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
// 初始化新版收藏页面













class InitBookmarkPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.idList = []; // 储存从列表页获取到的 id
        this.type = 'illusts'; // 页面是图片还是小说
        this.isHide = false; // 当前页面是否显示的是非公开收藏
        this.requsetNumber = 0; // 根据页数，计算要抓取的作品个数
        this.filteredNumber = 0; // 记录检查了多少作品（不论结果是否通过都计入）
        this.onceRequest = 100; // 每次请求多少个数量
        this.offset = 0; // 要去掉的作品数量
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_数字提示1'),
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_下载所有页面'));
    }
    addAnyElement() {
        // 如果存在 token，则添加“添加 tag”按钮
        if (_Token__WEBPACK_IMPORTED_MODULE_8__["token"].token) {
            const btn = _Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_给未分类作品添加添加tag'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_给未分类作品添加添加tag')]]);
            new _pageFunciton_BookmarksAddTag__WEBPACK_IMPORTED_MODULE_9__["BookmarksAddTag"](btn);
        }
    }
    nextStep() {
        if (window.location.pathname.includes('/novel')) {
            this.type = 'novels';
        }
        this.readyGetIdList();
        this.getIdList();
    }
    readyGetIdList() {
        // 每页个作品数，插画 48 个，小说 24 个
        const onceNumber = window.location.pathname.includes('/novels') ? 24 : 48;
        // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
        const nowPage = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'p'); // 判断当前处于第几页，页码从 1 开始。也可能没有页码
        if (nowPage) {
            this.offset = (parseInt(nowPage) - 1) * onceNumber;
        }
        if (this.offset < 0) {
            this.offset = 0;
        }
        // 根据页数设置，计算要下载的个数
        if (this.crawlNumber === -1) {
            this.requsetNumber = _config_Config__WEBPACK_IMPORTED_MODULE_12__["Config"].worksNumberLimit;
        }
        else {
            this.requsetNumber = onceNumber * this.crawlNumber;
        }
        // 判断是公开收藏还是非公开收藏
        // 在新旧版 url 里，rest 都是在查询字符串里的
        this.isHide = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'rest') === 'hide';
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_正在抓取'));
        if (this.crawlNumber === -1) {
            _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_获取全部书签作品'));
        }
    }
    // 获取用户的收藏作品列表
    async getIdList() {
        let data;
        try {
            data = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getBookmarkData(_Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].getUserId(), this.type, _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].tag, this.offset, this.isHide);
        }
        catch (error) {
            this.getIdList();
            return;
        }
        if (data.body.works.length === 0 ||
            this.idList.length >= this.requsetNumber ||
            this.filteredNumber >= this.requsetNumber) {
            // 书签页获取完毕
            return this.afterGetIdList();
        }
        else {
            // 没有抓取完毕时，添加数据
            const idType = this.type === 'illusts' ? 'unknown' : 'novels';
            for (const workData of data.body.works) {
                if (this.filteredNumber >= this.requsetNumber) {
                    return this.afterGetIdList();
                }
                const filterOpt = {
                    id: workData.id,
                    tags: workData.tags,
                    bookmarkData: workData.bookmarkData,
                    createDate: workData.createDate,
                    userId: workData.userId,
                    xRestrict: workData.xRestrict,
                };
                this.filteredNumber++;
                if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_10__["filter"].check(filterOpt)) {
                    this.idList.push({
                        type: idType,
                        id: workData.id,
                    });
                }
            }
            this.offset += this.onceRequest; // 每次增加偏移量
            _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_当前作品个数', this.idList.length.toString()), 1, false);
            // 继续抓取
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
        _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.concat(this.idList);
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.type = 'illusts';
        this.idList = [];
        this.offset = 0;
        this.requsetNumber = 0;
        this.filteredNumber = 0;
    }
}



/***/ }),

/***/ "./src/ts/crawlMixedPage/InitFollowingPage.ts":
/*!****************************************************!*\
  !*** ./src/ts/crawlMixedPage/InitFollowingPage.ts ***!
  \****************************************************/
/*! exports provided: InitFollowingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitFollowingPage", function() { return InitFollowingPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _utils_CreateCSV__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/CreateCSV */ "./src/ts/utils/CreateCSV.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
// 初始化关注页面、好 P 友页面、粉丝页面










class InitFollowingPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.baseOffset = 0; // 开始抓取时，记录初始的偏移量
        this.onceNumber = 24; // 每页 24 个画师
        this.pageType = 0; // 页面子类型
        // 0 我的关注
        // 1 我的好 P 友
        // 2 我的粉丝
        this.getUserListNo = 0; // 获取用户列表时，记录请求的次数
        this.limit = 100; // 每次请求多少个用户
        this.totalNeed = Number.MAX_SAFE_INTEGER;
        this.myId = '';
        this.rest = 'show';
        this.userList = [];
        this.index = 0; // getIdList 时，对 userList 的索引
        this.userInfoList = []; // 储存用户列表，包含 id 和用户名
        this.downUserList = false; // 下载用户列表的标记
        this.homePrefix = 'https://www.pixiv.net/users/'; // 用户主页的通用链接前缀
        this.getPageType();
        this.init();
    }
    getPageType() {
        const pathname = window.location.pathname;
        if (pathname.includes('/following')) {
            this.pageType = 0;
        }
        else if (pathname.includes('/mypixiv')) {
            this.pageType = 1;
        }
        else if (pathname.includes('/followers')) {
            this.pageType = 2;
        }
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
        _Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载用户列表')).addEventListener('click', () => {
            this.downUserList = true;
            this.readyCrawl();
        });
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
    }
    nextStep() {
        this.readyGet();
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_正在抓取'));
        this.getPageType();
        this.getUserList();
    }
    readyGet() {
        this.rest = location.href.includes('rest=hide') ? 'hide' : 'show';
        // 获取抓取开始时的页码
        const nowPage = _utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].getURLSearchField(location.href, 'p');
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
    // 获取用户列表
    async getUserList() {
        const offset = this.baseOffset + this.getUserListNo * this.limit;
        let res;
        try {
            switch (this.pageType) {
                case 0:
                    res = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getFollowingList(this.myId, this.rest, offset);
                    break;
                case 1:
                    res = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getMyPixivList(this.myId, offset);
                    break;
                case 2:
                    res = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getFollowersList(this.myId, offset);
                    break;
            }
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
            // 保存用户 id
            this.userList.push(userData.userId);
            // 如果需要下载用户列表
            if (this.downUserList) {
                this.userInfoList.push({
                    userId: userData.userId,
                    userName: userData.userName,
                    homePage: this.homePrefix + userData.userId,
                    userComment: userData.userComment,
                    profileImageUrl: userData.profileImageUrl,
                });
            }
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
        // 处理下载用户列表的情况
        if (this.downUserList) {
            this.toCSV();
            return this.getIdListFinished();
        }
        this.getIdList();
    }
    toCSV() {
        // 添加用户信息
        const data = this.userInfoList.map((item) => {
            return Object.values(item);
        });
        // 添加用户信息的标题字段
        data.unshift(Object.keys(this.userInfoList[0]));
        const csv = _utils_CreateCSV__WEBPACK_IMPORTED_MODULE_8__["createCSV"].create(data);
        const csvURL = URL.createObjectURL(csv);
        const csvName = _Tools__WEBPACK_IMPORTED_MODULE_7__["Tools"].getPageTitle();
        _utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].downloadFile(csvURL, _utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].replaceUnsafeStr(csvName) + '.csv');
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
        _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.concat(idList);
        this.index++;
        if (this.index >= this.userList.length) {
            return this.getIdListFinished();
        }
        _Log__WEBPACK_IMPORTED_MODULE_6__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_当前作品个数', _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.length.toString()), 1, false);
        this.getIdList();
    }
    resetGetIdListStatus() {
        this.userList = [];
        this.userInfoList = [];
        this.downUserList = false;
        this.getUserListNo = 0;
        this.index = 0;
    }
    sortResult() {
        // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
        _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].result.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].sortByProperty('id'));
    }
}



/***/ }),

/***/ "./src/ts/crawlMixedPage/InitHomePage.ts":
/*!***********************************************!*\
  !*** ./src/ts/crawlMixedPage/InitHomePage.ts ***!
  \***********************************************/
/*! exports provided: InitHomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitHomePage", function() { return InitHomePage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Theme */ "./src/ts/Theme.ts");
// 初始化首页









class InitHomePage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.downIdButton = document.createElement('button');
        this.downIdInput = document.createElement('textarea');
        this.ready = false;
        this.init();
        this.idRangeTip = this.createidRangeTip();
    }
    addCrawlBtns() {
        this.downIdButton = _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_输入id进行抓取'), [['id', 'down_id_button']]);
        const crawlIdRange = _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取id区间'));
        crawlIdRange.addEventListener('click', () => {
            this.crawlIdRange();
        });
    }
    addAnyElement() {
        // 用于输入id的输入框
        this.downIdInput.id = 'down_id_input';
        this.downIdInput.style.display = 'none';
        this.downIdInput.setAttribute('placeholder', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_输入id进行抓取的提示文字'));
        _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].insertToHead(this.downIdInput);
        _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_清空已保存的抓取结果')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('clearSavedCrawl');
        });
    }
    setFormOption() {
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].hideOption([1]);
    }
    initAny() {
        this.downIdButton.addEventListener('click', () => {
            if (!this.ready) {
                // 还没准备好
                _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('closeCenterPanel');
                this.downIdInput.style.display = 'block';
                this.downIdInput.focus();
                document.documentElement.scrollTop = 0;
            }
            else {
                this.checkIdList();
            }
        }, false);
        // 当输入框内容改变时检测，非空值时显示下载区域
        this.downIdInput.addEventListener('change', () => {
            if (this.downIdInput.value !== '') {
                this.ready = true;
                window.setTimeout(() => {
                    _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('openCenterPanel');
                }, 300);
                this.downIdButton.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取');
            }
            else {
                this.ready = false;
                _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('closeCenterPanel');
                this.downIdButton.textContent = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_输入id进行抓取');
            }
        });
    }
    // 单独添加一个用于提示 id 范围的元素，因为上面的日志显示在日志区域的顶端，不便于查看
    createidRangeTip() {
        const div = document.createElement('div');
        div.classList.add('id_range_tip', 'beautify_scrollbar', 'logWrap');
        _Theme__WEBPACK_IMPORTED_MODULE_8__["theme"].register(div);
        return _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].insertToHead(div);
    }
    // 把合法的 id 添加到数组里
    checkIdList() {
        // 不必去重，因为 store 存储抓取结果时会去重
        const array = this.downIdInput.value.split('\n');
        const result = [];
        for (const str of array) {
            const id = parseInt(str);
            if (isNaN(id) || id < 22 || id > _config_Config__WEBPACK_IMPORTED_MODULE_6__["Config"].worksNumberLimit) {
                console.log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_id不合法') + ': ' + str);
            }
            else {
                result.push(id.toString());
            }
        }
        this.addIdList(result);
    }
    crawlIdRange() {
        let start = 0;
        let end = 0;
        // 接收起点
        const startInput = window.prompt(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取id区间说明') + '\n' + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取id区间起点'), '0');
        if (startInput) {
            const num = Number.parseInt(startInput);
            if (!isNaN(num) && num >= 0) {
                start = num;
            }
            else {
                return _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_参数不合法'));
            }
        }
        else {
            return;
        }
        // 接收终点
        const endInput = window.prompt(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取id区间终点'), '1');
        if (endInput) {
            const num = Number.parseInt(endInput);
            if (!isNaN(num) && num > start) {
                end = num;
            }
            else {
                return _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_参数不合法'));
            }
        }
        else {
            return;
        }
        // 提示抓取范围，便于用户分批次抓取的时候查看
        const tip = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取id区间') + `: ${start} - ${end}`;
        this.idRangeTip.textContent = tip;
        this.idRangeTip.style.display = 'block';
        // 不要在这里使用 log.log ，因为之后开始抓取时，日志区域会被清空，所以用户在日志区域里看不到这个提示
        // 生成 id 列表
        const ids = [];
        while (start <= end) {
            ids.push(start.toString());
            start++;
        }
        this.addIdList(ids);
        _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'));
    }
    // 把 id 列表添加到 store 里，然后开始抓取
    addIdList(ids) {
        // 检查页面类型，设置输入的 id 的作品类型
        const type = window.location.pathname === '/novel/' ? 'novels' : 'unknown';
        const idList = [];
        for (const id of ids) {
            idList.push({
                type: type,
                id: id,
            });
        }
        _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('crawlIdList', idList);
    }
    destroy() {
        _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].clearSlot('crawlBtns');
        _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].clearSlot('otherBtns');
        this.downIdInput.remove();
    }
}



/***/ }),

/***/ "./src/ts/crawlMixedPage/InitUserPage.ts":
/*!***********************************************!*\
  !*** ./src/ts/crawlMixedPage/InitUserPage.ts ***!
  \***********************************************/
/*! exports provided: InitUserPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitUserPage", function() { return InitUserPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _pageFunciton_SaveAvatarIcon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../pageFunciton/SaveAvatarIcon */ "./src/ts/pageFunciton/SaveAvatarIcon.ts");
/* harmony import */ var _pageFunciton_SaveAvatarImage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../pageFunciton/SaveAvatarImage */ "./src/ts/pageFunciton/SaveAvatarImage.ts");
/* harmony import */ var _pageFunciton_SaveUserCover__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../pageFunciton/SaveUserCover */ "./src/ts/pageFunciton/SaveUserCover.ts");
/* harmony import */ var _pageFunciton_BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../pageFunciton/BookmarkAllWorks */ "./src/ts/pageFunciton/BookmarkAllWorks.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
// 初始化用户页面
















var ListType;
(function (ListType) {
    ListType[ListType["UserHome"] = 0] = "UserHome";
    ListType[ListType["Artworks"] = 1] = "Artworks";
    ListType[ListType["Illustrations"] = 2] = "Illustrations";
    ListType[ListType["Manga"] = 3] = "Manga";
    ListType[ListType["Novels"] = 4] = "Novels";
})(ListType || (ListType = {}));
class InitUserPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.listType = ListType.UserHome; // 当前页面应该获取哪些类型的作品
        this.onceNumber = 48; // 每页作品个数，插画是 48 个，小说是 24 个
        this.bookmarkAll = new _pageFunciton_BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_13__["BookmarkAllWorks"]();
        this.sendBookmarkIdList = () => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_9__["states"].bookmarkMode) {
                // 将 id 的 type 设置为 illusts 或 novels
                const list = [];
                for (const data of _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList) {
                    if (data.type === 'novels') {
                        list.push(data);
                    }
                    else {
                        list.push({
                            type: 'illusts',
                            id: data.id,
                        });
                    }
                }
                _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = []; // 清空这次抓取到的 id 列表
                this.bookmarkAll.sendIdList(list);
            }
        };
        this.init();
    }
    // 添加中间按钮
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取') + _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_默认下载多页')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    addAnyElement() {
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户头像')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('saveAvatarImage');
        });
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户封面')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('saveUserCover');
        });
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户头像为图标'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存用户头像为图标说明')]]).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('saveAvatarIcon');
        });
        // 添加收藏本页所有作品的功能
        const bookmarkAllBtn = _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_收藏本页面的所有作品'));
        this.bookmarkAll = new _pageFunciton_BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_13__["BookmarkAllWorks"](bookmarkAllBtn);
        bookmarkAllBtn.addEventListener('click', async () => {
            // 获取该用户的所有作品的 id 列表
            // 模拟了抓取流程，以获取相同的 id 列表
            _EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].fire('bookmarkModeStart');
            _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].tag = _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].getTagFromURL();
            this.crawlNumber = 1; // 设置为只抓取 1 页
            this.readyGetIdList();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].list.getIdListFinished, this.sendBookmarkIdList);
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
    }
    nextStep() {
        this.readyGetIdList();
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_正在抓取'));
    }
    readyGetIdList() {
        // 判断页面类型
        // 匹配 pathname 里用户 id 之后的字符
        const test = location.pathname.match(/\/users\/\d+(\/.+)/);
        if (test === null) {
            // 用户主页
            this.listType = ListType.UserHome;
        }
        else if (test.length === 2) {
            const str = test[1]; //取出用户 id 之后的字符
            if (str.includes('/artworks')) {
                // 插画和漫画列表
                this.listType = ListType.Artworks;
            }
            else if (str.includes('/illustrations')) {
                // 插画列表
                this.listType = ListType.Illustrations;
            }
            else if (str.includes('/manga')) {
                // 漫画列表
                this.listType = ListType.Manga;
            }
            else if (str.includes('/novels')) {
                // 小说列表
                this.listType = ListType.Novels;
                this.onceNumber = 24; // 如果是在小说列表页，一页只有 24 个作品
            }
        }
        _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].tag ? this.getIdListByTag() : this.getIdList();
    }
    getOffset() {
        const nowPage = _utils_Utils__WEBPACK_IMPORTED_MODULE_14__["Utils"].getURLSearchField(location.href, 'p'); // 判断当前处于第几页，页码从 1 开始。也可能没有页码
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
        let requsetNumber = _config_Config__WEBPACK_IMPORTED_MODULE_15__["Config"].worksNumberLimit;
        if (this.crawlNumber !== -1) {
            requsetNumber = this.onceNumber * this.crawlNumber;
        }
        return requsetNumber;
    }
    // 获取用户某些类型的作品的 id 列表
    async getIdList() {
        let type = [];
        switch (this.listType) {
            case ListType.UserHome:
                type = ['illusts', 'manga', 'novels'];
                break;
            case ListType.Artworks:
                type = ['illusts', 'manga'];
                break;
            case ListType.Illustrations:
                type = ['illusts'];
                break;
            case ListType.Manga:
                type = ['manga'];
                break;
            case ListType.Novels:
                type = ['novels'];
                break;
        }
        let idList = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getUserWorksByType(_Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].getUserId(), type);
        // 判断是否全都是小说，如果是，把每页的作品个数设置为 24 个
        const allWorkIsNovels = idList.every((data) => {
            return data.type === 'novels';
        });
        allWorkIsNovels && (this.onceNumber = 24);
        // 计算偏移量和需要保留的作品个数
        const offset = this.getOffset();
        const requsetNumber = this.getRequsetNumber();
        // 按照 id 升序排列，之后会删除不需要的部分
        idList.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_14__["Utils"].sortByProperty('id')).reverse();
        // 不带 tag 获取作品时，由于 API 是一次性返回用户的所有作品，可能大于要求的数量，所以需要去掉多余的作品。
        // 删除 offset 需要去掉的部分。删除后面的 id，也就是近期作品
        idList.splice(idList.length - offset, idList.length);
        // 删除超过 requsetNumber 的作品。删除前面的 id，也就是早期作品
        if (idList.length > requsetNumber) {
            idList.splice(0, idList.length - requsetNumber);
        }
        // 储存
        _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList = _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.concat(idList);
        this.getIdListFinished();
    }
    // 获取用户某些类型的作品的 id 列表（附带 tag）
    async getIdListByTag() {
        // 这里不用判断用户主页的情况，因为用户主页不会带 tag
        let flag = 'illustmanga';
        switch (this.listType) {
            case ListType.Artworks:
                flag = 'illustmanga';
                break;
            case ListType.Illustrations:
                flag = 'illusts';
                break;
            case ListType.Manga:
                flag = 'manga';
                break;
            case ListType.Novels:
                flag = 'novels';
                break;
        }
        // 计算偏移量和需要保留的作品个数
        const offset = this.getOffset();
        const requsetNumber = this.getRequsetNumber();
        let data = await _API__WEBPACK_IMPORTED_MODULE_4__["API"].getUserWorksByTypeWithTag(_Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].getUserId(), flag, _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].tag, offset, requsetNumber);
        // 图片和小说返回的数据是不同的，小说并没有 illustType 标记
        if (this.listType === ListType.Novels) {
            const d = data;
            d.body.works.forEach((data) => _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
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
                _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].idList.push({
                    type,
                    id: data.id,
                });
            });
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.listType = ListType.UserHome;
    }
    sortResult() {
        // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
        _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].result.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_14__["Utils"].sortByProperty('id'));
    }
    destroy() {
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].clearSlot('crawlBtns');
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].clearSlot('otherBtns');
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_6__["EVT"].list.getIdListFinished, this.sendBookmarkIdList);
    }
}



/***/ }),

/***/ "./src/ts/crawlMixedPage/QuickCrawl.ts":
/*!*********************************************!*\
  !*** ./src/ts/crawlMixedPage/QuickCrawl.ts ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");






// 快速抓取
class QuickCrawl {
    constructor() {
        this.show = true; // 是否显示
        // 指定在哪些页面类型里启用
        this.enablePageType = [_PageType__WEBPACK_IMPORTED_MODULE_2__["pageType"].list.Artwork, _PageType__WEBPACK_IMPORTED_MODULE_2__["pageType"].list.Novel];
        this.addBtn();
        this.setVisible();
        this.bindEvents();
    }
    addBtn() {
        // 在右侧添加快速抓取按钮
        this.btn = document.createElement('button');
        this.btn.classList.add('rightButton');
        this.btn.id = 'quickCrawlBtn';
        this.btn.setAttribute('title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_快速下载本页') + ' (Alt + Q)');
        this.btn.innerHTML = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-download"></use>
</svg>`;
        document.body.insertAdjacentElement('afterbegin', this.btn);
    }
    bindEvents() {
        // 点击按钮启动快速抓取
        this.btn.addEventListener('click', () => {
            this.sendDownload();
        }, false);
        // 使用快捷键 Alt + q 启动快速抓取
        window.addEventListener('keydown', (ev) => {
            if (this.show && ev.altKey && ev.code === 'KeyQ') {
                this.sendDownload();
            }
        }, false);
        // 页面类型改变时设置按钮的显示隐藏
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitch, () => {
            this.setVisible();
        });
    }
    sendDownload() {
        // 因为 quickCrawl 状态会影响后续下载行为，所以必须先判断 busy 状态
        if (_store_States__WEBPACK_IMPORTED_MODULE_3__["states"].busy) {
            _Toast__WEBPACK_IMPORTED_MODULE_4__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
            return;
        }
        _store_States__WEBPACK_IMPORTED_MODULE_3__["states"].quickCrawl = true;
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('quickCrawl');
        const isNovel = window.location.href.includes('/novel');
        let idData;
        if (isNovel) {
            idData = {
                type: 'novels',
                id: _Tools__WEBPACK_IMPORTED_MODULE_5__["Tools"].getNovelId(window.location.href),
            };
        }
        else {
            idData = {
                type: 'unknown',
                id: _Tools__WEBPACK_IMPORTED_MODULE_5__["Tools"].getIllustId(window.location.href),
            };
        }
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('crawlIdList', [idData]);
    }
    setVisible() {
        this.show = this.enablePageType.includes(_PageType__WEBPACK_IMPORTED_MODULE_2__["pageType"].type);
        this.btn.style.display = this.show ? 'flex' : 'none';
    }
}
new QuickCrawl();


/***/ }),

/***/ "./src/ts/crawlNovelPage/InitNewNovelPage.ts":
/*!***************************************************!*\
  !*** ./src/ts/crawlNovelPage/InitNewNovelPage.ts ***!
  \***************************************************/
/*! exports provided: InitNewNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNewNovelPage", function() { return InitNewNovelPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
// 初始化 大家的新作小说页面









class InitNewNovelPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.option = this.resetOption();
        this.limitMax = 20; // 每次请求的数量最大是 20
        this.fetchCount = 0; // 已请求的作品数量
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_8__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载大家的新作品')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    initAny() { }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
        });
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInputGreater0(this.maxCount, false);
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
                workType: 3,
                tags: nowData.tags,
                userId: nowData.userId,
                createDate: nowData.createDate,
                xRestrict: nowData.xRestrict,
            };
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_4__["filter"].check(filterOpt)) {
                _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
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

/***/ "./src/ts/crawlNovelPage/InitNovelPage.ts":
/*!************************************************!*\
  !*** ./src/ts/crawlNovelPage/InitNovelPage.ts ***!
  \************************************************/
/*! exports provided: InitNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNovelPage", function() { return InitNovelPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _pageFunciton_QuickBookmark__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pageFunciton/QuickBookmark */ "./src/ts/pageFunciton/QuickBookmark.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
//初始化小说作品页










class InitNovelPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.crawlDirection = 0; // 抓取方向，指示抓取新作品还是旧作品
        this.init();
    }
    /*
    -1 抓取新作品
    0 不设置抓取方向
    1 抓取旧作品
    */
    initAny() {
        this.initQuickBookmark();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_8__["EVT"].list.pageSwitchedTypeNotChange, this.initQuickBookmark);
    }
    initQuickBookmark() {
        new _pageFunciton_QuickBookmark__WEBPACK_IMPORTED_MODULE_5__["QuickBookmark"]();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取new')).addEventListener('click', () => {
            this.crawlDirection = -1;
            this.readyCrawl();
        });
        _Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取old')).addEventListener('click', () => {
            this.crawlDirection = 1;
            this.readyCrawl();
        });
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示') +
                '<br>' +
                _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_相关作品大于0'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
        });
    }
    destroy() {
        _Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].clearSlot('crawlBtns');
        _Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].clearSlot('otherBtns');
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_8__["EVT"].list.pageSwitchedTypeNotChange, this.initQuickBookmark);
    }
    getWantPage() {
        // 检查下载页数的设置
        const crawlAllTip = this.crawlDirection === -1
            ? _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取new')
            : _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始抓取old');
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x个'), crawlAllTip);
    }
    async getIdList() {
        let type = ['novels'];
        let idList = await _API__WEBPACK_IMPORTED_MODULE_7__["API"].getUserWorksByType(_Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].getUserId(), type);
        // 储存符合条件的 id
        let nowId = parseInt(_Tools__WEBPACK_IMPORTED_MODULE_6__["Tools"].getNovelId(window.location.href));
        idList.forEach((id) => {
            let idNum = parseInt(id.id);
            // 新作品
            if (idNum >= nowId && this.crawlDirection === -1) {
                _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.push(id);
            }
            else if (idNum <= nowId && this.crawlDirection === 1) {
                // 旧作品
                _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.push(id);
            }
        });
        // 当设置了下载个数时，进行裁剪
        if (this.crawlNumber !== -1) {
            // 新作品 升序排列
            if (this.crawlDirection === -1) {
                _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].sortByProperty('id')).reverse();
            }
            else {
                // 旧作品 降序排列
                _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_9__["Utils"].sortByProperty('id'));
            }
            _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList = _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.splice(0, this.crawlNumber);
        }
        this.getIdListFinished();
    }
    resetGetIdListStatus() {
        this.crawlDirection = 0; // 解除下载方向的标记
    }
}



/***/ }),

/***/ "./src/ts/crawlNovelPage/InitNovelSeriesPage.ts":
/*!******************************************************!*\
  !*** ./src/ts/crawlNovelPage/InitNovelSeriesPage.ts ***!
  \******************************************************/
/*! exports provided: InitNovelSeriesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitNovelSeriesPage", function() { return InitNovelSeriesPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
//初始化小说系列作品页面








class InitNovelSeriesPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.seriesId = '';
        this.limit = 30;
        this.last = 0;
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_5__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取系列小说')).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    addAnyElement() {
        _Tools__WEBPACK_IMPORTED_MODULE_5__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_合并系列小说')).addEventListener('click', () => {
            _store_States__WEBPACK_IMPORTED_MODULE_7__["states"].mergeNovel = true;
            this.readyCrawl();
        });
    }
    initAny() { }
    setFormOption() {
        // 隐藏“个数/页数”选项
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].hideOption([1]);
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
            _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].idList.push({
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

/***/ "./src/ts/crawlNovelPage/InitRankingNovelPage.ts":
/*!*******************************************************!*\
  !*** ./src/ts/crawlNovelPage/InitRankingNovelPage.ts ***!
  \*******************************************************/
/*! exports provided: InitRankingNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitRankingNovelPage", function() { return InitRankingNovelPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
// 初始化小说排行榜页面








class InitRankingNovelPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
    constructor() {
        super();
        this.pageUrlList = [];
        this.init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本排行榜作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_抓取本排行榜作品Title')],
        ]).addEventListener('click', () => {
            this.readyCrawl();
        });
    }
    initAny() { }
    setFormOption() {
        // 个数/页数选项的提示
        this.maxCount = 100;
        _setting_Options__WEBPACK_IMPORTED_MODULE_4__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_个数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_想要获取多少个作品'),
            rangTip: `1 - ${this.maxCount}`,
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
            const userId = item.querySelector('img').dataset.userId;
            // 有的作品没有收藏按钮，点进去之后发现这个作品已经被删除了，只是排行榜里没有及时更新。这样的作品没有收藏按钮。
            const bookmarkBtn = item.querySelector('._one-click-bookmark');
            const bookmarked = bookmarkBtn
                ? bookmarkBtn.classList.contains('on')
                : false;
            const filterOpt = {
                id: id,
                workType: 3,
                tags: tags,
                bookmarkCount: bmk,
                bookmarkData: bookmarked,
                userId: userId,
            };
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_5__["filter"].check(filterOpt)) {
                _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].setRankList(id.toString(), rank);
                _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.push({
                    type: 'novels',
                    id: id.toString(),
                });
            }
        }
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_排行榜进度', this.listPageFinished.toString()), 1, false);
        // 抓取完毕
        if (_store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].idList.length >= this.crawlNumber ||
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

/***/ "./src/ts/crawlNovelPage/InitSearchNovelPage.ts":
/*!******************************************************!*\
  !*** ./src/ts/crawlNovelPage/InitSearchNovelPage.ts ***!
  \******************************************************/
/*! exports provided: InitSearchNovelPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitSearchNovelPage", function() { return InitSearchNovelPage; });
/* harmony import */ var _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../crawl/InitPageBase */ "./src/ts/crawl/InitPageBase.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Options */ "./src/ts/setting/Options.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _pageFunciton_FastScreen__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../pageFunciton/FastScreen */ "./src/ts/pageFunciton/FastScreen.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _pageFunciton_BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../pageFunciton/BookmarkAllWorks */ "./src/ts/pageFunciton/BookmarkAllWorks.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _store_IdListWithPageNo__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../store/IdListWithPageNo */ "./src/ts/store/IdListWithPageNo.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _crawlMixedPage_CrawlTagList__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../crawlMixedPage/CrawlTagList */ "./src/ts/crawlMixedPage/CrawlTagList.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
// 初始化小说搜索页

















class InitSearchNovelPage extends _crawl_InitPageBase__WEBPACK_IMPORTED_MODULE_0__["InitPageBase"] {
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
            'tlt',
            'tgt',
            'original_only',
            'work_lang',
        ];
        this.flag = 'searchNovel';
        this.crawlTag = () => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_16__["states"].crawlTagList) {
                this.readyCrawl();
            }
        };
        this.init();
        new _pageFunciton_FastScreen__WEBPACK_IMPORTED_MODULE_8__["FastScreen"]();
        _crawlMixedPage_CrawlTagList__WEBPACK_IMPORTED_MODULE_15__["crawlTagList"].init();
    }
    addCrawlBtns() {
        _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgBlue, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_开始抓取'), [
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
    addAnyElement() {
        // 添加收藏本页所有作品的功能
        const bookmarkAllBtn = _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].addBtn('otherBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_1__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_收藏本页面的所有作品'));
        const bookmarkAll = new _pageFunciton_BookmarkAllWorks__WEBPACK_IMPORTED_MODULE_10__["BookmarkAllWorks"](bookmarkAllBtn);
        bookmarkAllBtn.addEventListener('click', () => {
            const listWrap = this.getWorksWrap();
            if (listWrap) {
                const list = document.querySelectorAll('#root section>div>ul>li');
                const showList = Array.from(list).filter((el) => {
                    return el.style.display !== 'none';
                });
                bookmarkAll.sendWorkList(showList);
            }
        });
    }
    setFormOption() {
        // 个数/页数选项的提示
        _setting_Options__WEBPACK_IMPORTED_MODULE_3__["options"].setWantPageTip({
            text: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_页数'),
            tip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载提示'),
            rangTip: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数字提示1'),
        });
    }
    initAny() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_13__["EVT"].list.crawlTag, this.crawlTag);
    }
    destroy() {
        _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].clearSlot('crawlBtns');
        _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].clearSlot('otherBtns');
        window.removeEventListener(_EVT__WEBPACK_IMPORTED_MODULE_13__["EVT"].list.crawlTag, this.crawlTag);
    }
    async nextStep() {
        this.initFetchURL();
        // 计算应该抓取多少页
        const data = await this.getSearchData(1);
        // 计算总页数
        let pageCount = Math.ceil(data.total / this.worksNoPerPage);
        if (pageCount > 1000) {
            // 如果作品页数大于 1000 页，则判断当前用户是否是 pixiv 会员
            const isPremium = _Tools__WEBPACK_IMPORTED_MODULE_9__["Tools"].isPremium();
            if (!isPremium) {
                // 如果用户不是会员，则最多只能抓取到 1000 页
                pageCount = 1000;
            }
            else {
                // 如果用户是会员，最多可以抓取到 5000 页
                if (pageCount > 5000) {
                    pageCount = 5000;
                }
            }
        }
        // 如果当前页面的页码大于有效页码，则不进行抓取
        if (this.startpageNo > pageCount) {
            _EVT__WEBPACK_IMPORTED_MODULE_13__["EVT"].fire('crawlFinish');
            _EVT__WEBPACK_IMPORTED_MODULE_13__["EVT"].fire('crawlEmpty');
            return _MsgBox__WEBPACK_IMPORTED_MODULE_14__["msgBox"].error(`${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_超出最大页码')} ${pageCount}`);
        }
        if (this.crawlNumber === -1 || this.crawlNumber > pageCount) {
            this.crawlNumber = pageCount;
        }
        // 计算从当前页面开始抓取的话，有多少页
        let needFetchPage = pageCount - this.startpageNo + 1;
        // 比较用户设置的页数，取较小的那个数值
        this.needCrawlPageCount = Math.min(needFetchPage, this.crawlNumber);
        if (this.needCrawlPageCount === 0) {
            return this.noResult();
        }
        this.startGetIdList();
    }
    getWantPage() {
        this.crawlNumber = this.checkWantPageInput(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_从本页开始下载x页'), _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载所有页面'));
    }
    // 获取搜索页的数据。因为有多处使用，所以进行了封装
    async getSearchData(p) {
        let data = await _API__WEBPACK_IMPORTED_MODULE_5__["API"].getNovelSearchData(_store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].tag, p, this.option);
        return data.body.novel;
    }
    // 组织要请求的 url 中的参数
    initFetchURL() {
        var _a;
        let p = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, 'p');
        this.startpageNo = parseInt(p) || 1;
        // 从页面 url 中获取可以使用的选项
        this.option = {};
        this.allOption.forEach((param) => {
            let value = _utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].getURLSearchField(location.href, param);
            if (value !== '') {
                this.option[param] = value;
            }
        });
        // 如果没有指定标签匹配模式，则使用 s_tag 标签（部分一致）
        // s_tag_full 是标签（完全一致）
        this.option.s_mode = (_a = this.option.s_mode) !== null && _a !== void 0 ? _a : 's_tag';
    }
    // 计算页数之后，准备建立并发抓取线程
    startGetIdList() {
        if (this.needCrawlPageCount <= this.ajaxThreadsDefault) {
            this.ajaxThread = this.needCrawlPageCount;
        }
        else {
            this.ajaxThread = this.ajaxThreadsDefault;
        }
        for (let i = 0; i < this.ajaxThread; i++) {
            this.getIdList();
        }
    }
    // 仅当出错重试时，才会传递参数 p。此时直接使用传入的 p，而不是继续让 p 增加
    async getIdList(p) {
        if (p === undefined) {
            p = this.startpageNo + this.sendCrawlTaskCount;
            this.sendCrawlTaskCount++;
        }
        // 发起请求，获取列表页
        let data;
        try {
            data = await this.getSearchData(p);
        }
        catch (_a) {
            return this.getIdList(p);
        }
        data = data.data;
        for (const nowData of data) {
            const filterOpt = {
                createDate: nowData.createDate,
                id: nowData.id,
                bookmarkData: nowData.bookmarkData,
                bookmarkCount: nowData.bookmarkCount,
                workType: 3,
                tags: nowData.tags,
                userId: nowData.userId,
                xRestrict: nowData.xRestrict,
            };
            if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_4__["filter"].check(filterOpt)) {
                _store_IdListWithPageNo__WEBPACK_IMPORTED_MODULE_12__["idListWithPageNo"].add(this.flag, {
                    type: 'novels',
                    id: nowData.id,
                }, p);
            }
        }
        this.listPageFinished++;
        _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取进度', this.listPageFinished.toString()), 1, false);
        if (this.sendCrawlTaskCount + 1 <= this.needCrawlPageCount) {
            // 继续发送抓取任务（+1 是因为 sendCrawlTaskCount 从 0 开始）
            this.getIdList();
        }
        else {
            // 抓取任务已经全部发送
            if (this.listPageFinished === this.needCrawlPageCount) {
                // 抓取任务全部完成
                _Log__WEBPACK_IMPORTED_MODULE_7__["log"].log(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_列表页抓取完成'));
                _store_IdListWithPageNo__WEBPACK_IMPORTED_MODULE_12__["idListWithPageNo"].store(this.flag);
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
        _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].resultMeta.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].sortByProperty('bmk'));
        _store_Store__WEBPACK_IMPORTED_MODULE_6__["store"].result.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_11__["Utils"].sortByProperty('bmk'));
    }
}



/***/ }),

/***/ "./src/ts/download/BookmarkAfterDL.ts":
/*!********************************************!*\
  !*** ./src/ts/download/BookmarkAfterDL.ts ***!
  \********************************************/
/*! exports provided: BookmarkAfterDL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BookmarkAfterDL", function() { return BookmarkAfterDL; });
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Bookmark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Bookmark */ "./src/ts/Bookmark.ts");





// 当文件下载成功后，收藏这个作品
class BookmarkAfterDL {
    constructor(tipEl) {
        // 储存接收到的 id，用于防止对一个作品重复添加收藏
        // 其实重复添加收藏没什么影响，和只添加一次没区别。为了不浪费网络请求，还是尽量不要重复添加。
        this.savedIds = [];
        this.successCount = 0;
        this.tipEl = document.createElement('span');
        if (tipEl) {
            this.tipEl = tipEl;
        }
        this.bindEvents();
    }
    // 可选传入一个元素，显示收藏的数量和总数
    bindEvents() {
        // 当有文件下载完成时，提取 id 进行收藏
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.downloadSuccess, (ev) => {
            const successData = ev.detail.data;
            this.send(Number.parseInt(successData.id));
        });
        // 当有文件跳过下载时，如果是重复的下载，也进行收藏
        // 因为重复的下载，本意还是要下载的，只是之前下载过了。所以进行收藏。
        // 其他跳过下载的原因，则是本意就是不下载，所以不收藏。
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.skipDownload, (ev) => {
            const skipData = ev.detail.data;
            if (skipData.reason === 'duplicate') {
                this.send(Number.parseInt(skipData.id));
            }
        });
        // 当开始新的抓取时重置状态和提示
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.crawlStart, (ev) => {
            this.reset();
            this.showProgress();
        });
    }
    showProgress() {
        if (this.savedIds.length === 0) {
            return (this.tipEl.textContent = '');
        }
        this.tipEl.textContent = `${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已收藏')} ${this.successCount}/${this.savedIds.length}`;
    }
    reset() {
        this.savedIds = [];
        this.successCount = 0;
    }
    // 接收作品 id，开始收藏
    send(id) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].bmkAfterDL) {
            return;
        }
        if (typeof id !== 'number') {
            id = Number.parseInt(id);
        }
        // 检查这个 id 是否已经添加了
        if (this.savedIds.includes(id)) {
            return;
        }
        this.addBookmark(id);
    }
    // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
    async addBookmark(id) {
        return new Promise(async (resolve, reject) => {
            this.savedIds.push(id);
            this.showProgress();
            // 从 store 里查找这个作品的数据
            const dataSource = _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].resultMeta.length > 0 ? _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].resultMeta : _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result;
            const data = dataSource.find((val) => val.idNum === id);
            if (data === undefined) {
                return reject(new Error(`Not find ${id} in result`));
            }
            await _Bookmark__WEBPACK_IMPORTED_MODULE_4__["Bookmark"].add(id.toString(), data.type !== 3 ? 'illusts' : 'novels', data.tags).catch((err) => {
                // 如果添加收藏失败，则从 id 列表里删除它，重新开始添加收藏
                console.error(err);
                const len = this.savedIds.length;
                for (let index = 0; index < len; index++) {
                    if (this.savedIds[index] === id) {
                        delete this.savedIds[index];
                        break;
                    }
                }
                return resolve(this.send(id));
            });
            this.successCount++;
            this.showProgress();
            resolve();
        });
    }
}



/***/ }),

/***/ "./src/ts/download/Deduplication.ts":
/*!******************************************!*\
  !*** ./src/ts/download/Deduplication.ts ***!
  \******************************************/
/*! exports provided: deduplication */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deduplication", function() { return deduplication; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _utils_IndexedDB__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/IndexedDB */ "./src/ts/utils/IndexedDB.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../FileName */ "./src/ts/FileName.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _utils_SecretSignal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/SecretSignal */ "./src/ts/utils/SecretSignal.ts");











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
        this.existedIdList = []; // 检查文件是否重复时，会查询数据库。查询到的数据的 id 会保存到这个列表里。当向数据库添加记录时，可以先查询这个列表，如果已经有过记录就改为 put 而不是 add，因为添加主键重复的数据会报错
        // 从图片 url 里取出日期字符串的正则表达式
        this.dateRegExp = /img\/(.*)\//;
        this.IDB = new _utils_IndexedDB__WEBPACK_IMPORTED_MODULE_4__["IndexedDB"]();
        this.init();
    }
    async init() {
        await this.initDB();
        this.bindEvents();
        // this.exportTestFile(10)
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
    bindEvents() {
        // 当有文件下载完成时，存储这个任务的记录
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadSuccess, (ev) => {
            const successData = ev.detail.data;
            this.add(successData.id);
        });
        // 导入含有 id 列表的 txt 文件
        _utils_SecretSignal__WEBPACK_IMPORTED_MODULE_10__["secretSignal"].register('recordtxt', () => {
            this.importRecordFromTxt();
        });
        // 导入下载记录的按钮
        {
            const btn = document.querySelector('#importDownloadRecord');
            if (btn) {
                btn.addEventListener('click', () => {
                    _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('importDownloadRecord');
                });
            }
        }
        // 监听导入下载记录的事件
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.importDownloadRecord, () => {
            this.importRecordFromJSON();
        });
        // 导出下载记录的按钮
        {
            const btn = document.querySelector('#exportDownloadRecord');
            if (btn) {
                btn.addEventListener('click', () => {
                    _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('exportDownloadRecord');
                });
            }
        }
        // 监听导出下载记录的事件
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.exportDownloadRecord, () => {
            this.exportRecord();
        });
        // 清空下载记录的按钮
        {
            const btn = document.querySelector('#clearDownloadRecord');
            if (btn) {
                btn.addEventListener('click', () => {
                    _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('clearDownloadRecord');
                });
            }
        }
        // 监听清空下载记录的事件
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.clearDownloadRecord, () => {
            this.clearRecords();
            this.existedIdList = [];
        });
    }
    // 当要查找或存储一个 id 时，返回它所对应的 storeName
    getStoreName(id) {
        const firstNum = parseInt(id[0]);
        return this.storeNameList[firstNum - 1];
    }
    // 生成一个下载记录
    createRecord(data) {
        let result = undefined;
        if (typeof data === 'string') {
            result = _store_Store__WEBPACK_IMPORTED_MODULE_5__["store"].findResult(data);
        }
        else {
            result = data;
        }
        if (result === undefined) {
            throw new Error('createRecord failed');
        }
        return {
            id: result.id,
            n: _FileName__WEBPACK_IMPORTED_MODULE_6__["fileName"].getFileName(result),
            d: this.getDateString(result),
        };
    }
    // 从文件 URL 里取出日期字符串。例如
    // 'https://i.pximg.net/img-original/img/2021/10/11/00/00/06/93364702_p0.png'
    // 返回
    // '2021/10/11/00/00/06'
    getDateString(result) {
        if (result.type !== 3) {
            return result.original.match(this.dateRegExp)[1];
        }
    }
    // 添加一条下载记录
    async add(resultId) {
        const storeName = this.getStoreName(resultId);
        const data = this.createRecord(resultId);
        if (this.existedIdList.includes(resultId)) {
            this.IDB.put(storeName, data);
        }
        else {
            // 先查询有没有这个记录
            const result = await this.IDB.get(storeName, data.id);
            this.IDB[result ? 'put' : 'add'](storeName, data);
        }
    }
    // 检查一个作品是否是重复下载
    // 返回值 true 表示重复，false 表示不重复
    async check(result) {
        if (!_utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].isPixiv()) {
            return false;
        }
        return new Promise(async (resolve, reject) => {
            // 如果未启用去重，直接返回不重复
            if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].deduplication) {
                return resolve(false);
            }
            // 在数据库进行查找
            const storeName = this.getStoreName(result.id);
            const data = (await this.IDB.get(storeName, result.id));
            if (data === null) {
                return resolve(false);
            }
            // 有记录，说明这个文件下载过
            this.existedIdList.push(data.id);
            // 首先检查日期字符串是否发生了变化
            let dateChange = false;
            if (data.d) {
                dateChange = data.d !== this.getDateString(result);
                // 如果日期字符串变化了，则不视为重复文件
                if (dateChange) {
                    return resolve(false);
                }
            }
            // 如果日期字符串没有变化，再根据策略进行判断
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].dupliStrategy === 'loose') {
                // 如果是宽松策略（不比较文件名）
                return resolve(true);
            }
            else {
                // 如果是严格策略（考虑文件名）
                const name = _FileName__WEBPACK_IMPORTED_MODULE_6__["fileName"].getFileName(result);
                return resolve(name === data.n);
            }
        });
    }
    // 清空下载记录
    clearRecords() {
        for (const name of this.storeNameList) {
            this.IDB.clear(name);
        }
        _Toast__WEBPACK_IMPORTED_MODULE_8__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载记录已清除'));
    }
    // 导出下载记录
    async exportRecord() {
        let record = [];
        for (const name of this.storeNameList) {
            const r = (await this.IDB.getAll(name));
            record = record.concat(r);
        }
        const blob = _utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].json2Blob(record);
        const url = URL.createObjectURL(blob);
        _utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].downloadFile(url, `record-${_utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].replaceUnsafeStr(new Date().toLocaleString())}.json`);
        _Toast__WEBPACK_IMPORTED_MODULE_8__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导出成功'));
    }
    // 导入下载记录
    async importRecord(record) {
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入下载记录'));
        // 器显示导入进度
        let stored = 0;
        let total = record.length;
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].log(`${stored}/${total}`, 1, false);
        // 依次处理每个存储库
        for (let index = 0; index < this.storeNameList.length; index++) {
            // 提取出要存入这个存储库的数据
            const data = [];
            for (const r of record) {
                if (parseInt(r.id[0]) - 1 === index) {
                    data.push(r);
                }
            }
            // 批量添加数据
            await this.IDB.batchAddData(this.storeNameList[index], data, 'id');
            stored += data.length;
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].log(`${stored}/${total}`, 1, false);
        }
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入成功'));
        _Toast__WEBPACK_IMPORTED_MODULE_8__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入成功'));
        _MsgBox__WEBPACK_IMPORTED_MODULE_9__["msgBox"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入成功'), {
            title: _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入下载记录'),
        });
        // 时间参考：导入 100000 条下载记录，花费的时间在 30 秒以内。但偶尔会有例外，中途像卡住了一样，很久没动，最后花了两分钟多的时间。
    }
    // 从 json 文件导入
    async importRecordFromJSON() {
        const record = (await _utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].loadJSONFile().catch((err) => {
            _MsgBox__WEBPACK_IMPORTED_MODULE_9__["msgBox"].error(err);
            return;
        }));
        if (!record) {
            return;
        }
        // 判断格式是否符合要求
        if (Array.isArray(record) === false ||
            record[0].id === undefined ||
            record[0].n === undefined) {
            const msg = 'Format error!';
            return _MsgBox__WEBPACK_IMPORTED_MODULE_9__["msgBox"].error(msg);
        }
        this.importRecord(record);
    }
    // 从 txt 文件导入
    // 每行一个文件 id（带序号），以换行分割
    async importRecordFromTxt() {
        const file = (await _utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].selectFile('.txt'))[0];
        const text = await file.text();
        // 以换行分割
        let split = '\r\n';
        if (!text.includes(split)) {
            split = '\n';
        }
        const arr = text.split(split);
        // 把每一行视为一个 id，进行导入
        const record = [];
        for (const str of arr) {
            if (str) {
                record.push({
                    id: str,
                    n: str,
                });
            }
        }
        this.importRecord(record);
    }
    // 创建一个文件，模拟导出的下载记录
    exportTestFile(number) {
        let r = [];
        for (let index = 1; index <= number; index++) {
            r.push({
                id: index.toString(),
                n: index.toString(),
            });
        }
        const blob = _utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].json2Blob(r);
        const url = URL.createObjectURL(blob);
        _utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].downloadFile(url, `record-test-${number}.json`);
    }
}
const deduplication = new Deduplication();



/***/ }),

/***/ "./src/ts/download/Download.ts":
/*!*************************************!*\
  !*** ./src/ts/download/Download.ts ***!
  \*************************************/
/*! exports provided: Download */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Download", function() { return Download; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../FileName */ "./src/ts/FileName.ts");
/* harmony import */ var _ConvertUgoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ConvertUgoira/ConvertUgoira */ "./src/ts/ConvertUgoira/ConvertUgoira.ts");
/* harmony import */ var _ProgressBar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ProgressBar */ "./src/ts/download/ProgressBar.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _Deduplication__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Deduplication */ "./src/ts/download/Deduplication.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _MakeNovelFile__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./MakeNovelFile */ "./src/ts/download/MakeNovelFile.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
// 下载文件，然后发送给浏览器进行保存













class Download {
    constructor(progressBarIndex, data) {
        this.fileName = '';
        this.retry = 0; // 重试次数
        this.lastRequestTime = 0; // 最后一次发起请求的时间戳
        this.retryInterval = []; // 保存每次到达重试环节时，距离上一次请求的时间差
        this.cancel = false; // 这个下载是否被取消（下载被停止，或者这个文件没有通过某个检查）
        this.sizeChecked = false; // 是否对文件体积进行了检查
        this.progressBarIndex = progressBarIndex;
        this.download(data);
        this.bindEvents();
    }
    bindEvents() {
        ;
        [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStop, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadPause].forEach((event) => {
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
    // 跳过某个文件的下载，可以传入警告消息
    skip(data, msg) {
        this.cancel = true;
        if (msg) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(msg);
        }
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('skipDownload', data);
    }
    // 当重试达到最大次数时
    afterReTryMax(status, fileId) {
        // 404, 500 错误，跳过，不会再尝试下载这个文件（因为没有触发 downloadError 事件，所以不会重试下载）
        if (status === 404 || status === 500) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].error(`Error: ${fileId} Code: ${status}`);
            return this.skip({
                id: fileId,
                reason: status.toString(),
            });
        }
        // 状态码为 0 ，可能是系统磁盘空间不足导致的错误，也可能是超时等错误
        if (status === 0) {
            // 判断是否是磁盘空间不足。特征是每次重试之间的间隔时间比较短。
            // 超时的特征是等待时间比较长，可能超过 20 秒
            const timeLimit = 10000; // 如果从发起请求到进入重试的时间间隔小于这个值，则视为磁盘空间不足的情况
            const result = this.retryInterval.filter((val) => val <= timeLimit);
            // 在全部的 10 次请求中，如果有 9 次小于 10 秒，就认为是磁盘空间不足。
            if (result.length > 9) {
                _Log__WEBPACK_IMPORTED_MODULE_1__["log"].error(`Error: ${fileId} Code: ${status}`);
                const tip = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_系统磁盘空间不足提醒');
                _Log__WEBPACK_IMPORTED_MODULE_1__["log"].error(tip);
                _MsgBox__WEBPACK_IMPORTED_MODULE_12__["msgBox"].error(tip);
                return _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('requestPauseDownload');
            }
        }
        // 其他状态码，暂时跳过这个任务，但最后还是会尝试重新下载它
        this.cancel = true;
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('downloadError', fileId);
    }
    // 下载文件
    async download(arg) {
        // 检查是否是重复文件
        const duplicate = await _Deduplication__WEBPACK_IMPORTED_MODULE_7__["deduplication"].check(arg.data);
        if (duplicate) {
            return this.skip({
                id: arg.id,
                reason: 'duplicate',
            }, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_跳过下载因为重复文件', arg.id));
        }
        // 如果是动图，再次检查是否排除了动图
        // 因为有时候用户在抓取时没有排除动图，但是在下载时排除了动图。所以下载时需要再次检查
        if (arg.data.type === 2 && !_setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].downType2) {
            return this.skip({
                id: arg.id,
                reason: 'excludedType',
            });
        }
        // 获取文件名
        this.fileName = _FileName__WEBPACK_IMPORTED_MODULE_3__["fileName"].getFileName(arg.data);
        // 重设当前下载栏的信息
        this.setProgressBar(0, 0);
        // 下载文件
        let url;
        if (arg.data.type === 3) {
            // 生成小说的文件
            if (arg.data.novelMeta) {
                let blob = await _MakeNovelFile__WEBPACK_IMPORTED_MODULE_9__["MakeNovelFile"].make(arg.data.novelMeta);
                url = URL.createObjectURL(blob);
            }
            else {
                throw new Error('Not found novelMeta');
            }
        }
        else {
            // 对于图像作品，如果设置了图片尺寸就使用指定的 url，否则使用原图 url
            url = arg.data[_setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].imageSize] || arg.data.original;
        }
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        // 显示下载进度
        xhr.addEventListener('progress', async (event) => {
            // 检查体积设置
            if (!this.sizeChecked) {
                this.sizeChecked = true;
                const result = await _filter_Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check({ size: event.total });
                if (!result) {
                    // 当因为体积问题跳过下载时，可能这个下载进度还是 0 或者很少，所以这里直接把进度条拉满
                    this.setProgressBar(1, 1);
                    this.skip({
                        id: arg.id,
                        reason: 'size',
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
            // 状态码错误，进入重试流程
            if (xhr.status !== 200) {
                // 正常下载完毕的状态码是 200
                // 储存重试的时间戳等信息
                this.retryInterval.push(new Date().getTime() - this.lastRequestTime);
                _ProgressBar__WEBPACK_IMPORTED_MODULE_5__["progressBar"].errorColor(this.progressBarIndex, true);
                this.retry++;
                if (this.retry >= _config_Config__WEBPACK_IMPORTED_MODULE_11__["Config"].retryMax) {
                    // 重试达到最大次数
                    this.afterReTryMax(xhr.status, arg.id);
                }
                else {
                    // 开始重试
                    return this.download(arg);
                }
            }
            else {
                // 状态码正常
                _ProgressBar__WEBPACK_IMPORTED_MODULE_5__["progressBar"].errorColor(this.progressBarIndex, false);
                // 需要转换动图的情况
                const convertExt = ['webm', 'gif', 'png'];
                const ext = _setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].ugoiraSaveAs;
                if (convertExt.includes(ext) &&
                    arg.data.ugoiraInfo &&
                    _setting_Settings__WEBPACK_IMPORTED_MODULE_8__["settings"].imageSize !== 'thumb') {
                    // 当下载图片的方形缩略图时，不转换动图，因为此时下载的是作品的静态缩略图，无法进行转换
                    try {
                        if (ext === 'webm') {
                            file = await _ConvertUgoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__["convertUgoira"].webm(file, arg.data.ugoiraInfo);
                        }
                        if (ext === 'gif') {
                            file = await _ConvertUgoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__["convertUgoira"].gif(file, arg.data.ugoiraInfo);
                        }
                        if (ext === 'png') {
                            file = await _ConvertUgoira_ConvertUgoira__WEBPACK_IMPORTED_MODULE_4__["convertUgoira"].apng(file, arg.data.ugoiraInfo);
                        }
                    }
                    catch (error) {
                        const msg = `Convert ugoira error, id ${arg.data.idNum}.`;
                        // 因为会重试所以不再日志上显示
                        // log.error(msg, 1)
                        console.error(msg);
                        this.cancel = true;
                        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('downloadError', arg.id);
                    }
                }
            }
            if (this.cancel) {
                return;
            }
            // 生成下载链接
            const blobUrl = URL.createObjectURL(file);
            // 对插画、漫画进行颜色检查
            // 在这里进行检查的主要原因：抓取时只能检测第一张的缩略图，并没有检查后面的图片。所以这里需要对后面的图片进行检查。
            // 另一个原因：如果抓取时没有设置不下载某种颜色的图片，下载时又开启了设置，那么就在这里进行检查
            if (arg.data.type === 0 || arg.data.type === 1) {
                const result = await _filter_Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check({
                    mini: blobUrl,
                });
                if (!result) {
                    return this.skip({
                        id: arg.id,
                        reason: 'color',
                    }, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_不保存图片因为颜色', arg.id));
                }
            }
            // 检查图片的宽高设置
            // 因为抓取时只能检查每个作品第一张图片的宽高，所以可能会出现作品的第一张图片符合要求，但后面的图片不符合要求的情况。这里针对第一张之后的其他图片也进行检查，提高准确率。
            if ((arg.data.type === 0 || arg.data.type === 1) &&
                !arg.data.id.includes('p0')) {
                const img = await _utils_Utils__WEBPACK_IMPORTED_MODULE_10__["Utils"].loadImg(blobUrl);
                const result = await _filter_Filter__WEBPACK_IMPORTED_MODULE_6__["filter"].check({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
                if (!result) {
                    return this.skip({
                        id: arg.id,
                        reason: 'widthHeight',
                    }, _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_不保存图片因为宽高', arg.id));
                }
            }
            // 向浏览器发送下载任务
            this.browserDownload(blobUrl, this.fileName, arg.id, arg.taskBatch);
            xhr = null;
            file = null;
        });
        this.lastRequestTime = new Date().getTime();
        // 没有设置 timeout，默认值是 0，不会超时
        xhr.send();
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
            msg: 'save_work_file',
            fileUrl: blobUrl,
            fileName: fileName,
            id,
            taskBatch,
        };
        chrome.runtime.sendMessage(sendData);
    }
}



/***/ }),

/***/ "./src/ts/download/DownloadControl.ts":
/*!********************************************!*\
  !*** ./src/ts/download/DownloadControl.ts ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _download_Download__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../download/Download */ "./src/ts/download/Download.ts");
/* harmony import */ var _ProgressBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ProgressBar */ "./src/ts/download/ProgressBar.ts");
/* harmony import */ var _DownloadStates__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DownloadStates */ "./src/ts/download/DownloadStates.ts");
/* harmony import */ var _ShowDownloadStates__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ShowDownloadStates */ "./src/ts/download/ShowDownloadStates.ts");
/* harmony import */ var _ShowSkipCount__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ShowSkipCount */ "./src/ts/download/ShowSkipCount.ts");
/* harmony import */ var _ShowConvertCount__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ShowConvertCount */ "./src/ts/download/ShowConvertCount.ts");
/* harmony import */ var _BookmarkAfterDL__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./BookmarkAfterDL */ "./src/ts/download/BookmarkAfterDL.ts");
/* harmony import */ var _Resume__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Resume */ "./src/ts/download/Resume.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Help__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../Help */ "./src/ts/Help.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
// 下载控制





















class DownloadControl {
    constructor() {
        this.thread = 5; // 同时下载的线程数的默认值
        // 这里默认设置为 5，是因为国内一些用户的下载速度比较慢，所以不应该同时下载很多文件。
        // 最大值由 Config.downloadThreadMax 定义
        this.taskBatch = 0; // 标记任务批次，每次重新下载时改变它的值，传递给后台使其知道这是一次新的下载
        this.taskList = {}; // 下载任务列表，使用下载的文件的 id 做 key，保存下载栏编号和它在下载状态列表中的索引
        this.errorIdList = []; // 有任务下载失败时，保存 id
        this.downloaded = 0; // 已下载的任务数量
        this.wrapper = document.createElement('div');
        this.totalNumberEl = document.createElement('span');
        this.stop = false; // 是否停止下载
        this.pause = false; // 是否暂停下载
        this.createDownloadArea();
        this.bindEvents();
        const statusTipWrap = this.wrapper.querySelector('.down_status');
        new _ShowDownloadStates__WEBPACK_IMPORTED_MODULE_10__["ShowDownloadStates"](statusTipWrap);
        const skipTipWrap = this.wrapper.querySelector('.skip_tip');
        new _ShowSkipCount__WEBPACK_IMPORTED_MODULE_11__["ShowSkipCount"](skipTipWrap);
        const convertTipWrap = this.wrapper.querySelector('.convert_tip');
        new _ShowConvertCount__WEBPACK_IMPORTED_MODULE_12__["ShowConvertCount"](convertTipWrap);
        // 只在 p 站内启用下载后收藏的功能
        if (_utils_Utils__WEBPACK_IMPORTED_MODULE_18__["Utils"].isPixiv()) {
            const bmkAfterDLTipWrap = this.wrapper.querySelector('.bmkAfterDL_tip');
            new _BookmarkAfterDL__WEBPACK_IMPORTED_MODULE_13__["BookmarkAfterDL"](bmkAfterDLTipWrap);
        }
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart, () => {
            this.hideDownloadArea();
            this.reset();
        });
        for (const ev of [
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlFinish,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resultChange,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resume,
        ]) {
            window.addEventListener(ev, () => {
                // 让开始下载的方法进入任务队列，以便让监听上述事件的其他部分的代码先执行完毕
                window.setTimeout(() => {
                    this.readyDownload();
                }, 0);
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.skipDownload, (ev) => {
            const data = ev.detail.data;
            // 跳过下载的文件不会触发下载成功事件
            this.downloadOrSkipAFile(data);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadError, (ev) => {
            const id = ev.detail.data;
            this.downloadError(id);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.requestPauseDownload, (ev) => {
            // 请求暂停下载
            this.pauseDownload();
        });
        // 监听浏览器返回的消息
        chrome.runtime.onMessage.addListener((msg) => {
            if (!this.taskBatch) {
                return;
            }
            // 文件下载成功
            if (msg.msg === 'downloaded') {
                // 释放 BLOBURL
                URL.revokeObjectURL(msg.data.url);
                // 发送下载成功的事件
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('downloadSuccess', msg.data);
                this.downloadOrSkipAFile(msg.data);
            }
            else if (msg.msg === 'download_err') {
                // 浏览器把文件保存到本地时出错
                _Log__WEBPACK_IMPORTED_MODULE_3__["log"].error(`${msg.data.id} download error! code: ${msg.err}. The downloader will try to download the file again `);
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('saveFileError');
                // 重新下载这个文件
                // 但并不确定能否如预期一样重新下载这个文件
                this.saveFileError(msg.data);
            }
            // UUID 的情况
            if (msg.data && msg.data.uuid) {
                _Log__WEBPACK_IMPORTED_MODULE_3__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_uuid'));
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadComplete, () => {
            _Log__WEBPACK_IMPORTED_MODULE_3__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载完毕'), 2);
            _Toast__WEBPACK_IMPORTED_MODULE_17__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_下载完毕2'));
        });
    }
    createDownloadArea() {
        const html = `<div class="download_area">
    <p> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_共抓取到n个文件', '<span class="fwb blue imgNum">0</span>')}</p>
    
    <div class="centerWrap_btns">
    <button class="startDownload" type="button" style="background:${_config_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].bgBlue};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_开始下载')}</button>
    <button class="pauseDownload" type="button" style="background:${_config_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].bgYellow};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_暂停下载')}</button>
    <button class="stopDownload" type="button" style="background:${_config_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].bgRed};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_停止下载')}</button>
    <button class="copyUrl" type="button" style="background:${_config_Colors__WEBPACK_IMPORTED_MODULE_5__["Colors"].bgGreen};"> ${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_复制url')}</button>
    </div>
    <div class="download_status_text_wrap">
    <span>${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_当前状态')}</span>
    <span class="down_status">${_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_未开始下载')}</span>
    <span class="skip_tip warn"></span>
    <span class="convert_tip warn"></span>
    <span class="bmkAfterDL_tip green"></span>
    </div>
    </div>`;
        this.wrapper = _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].useSlot('downloadArea', html);
        this.totalNumberEl = this.wrapper.querySelector('.imgNum');
        this.wrapper
            .querySelector('.startDownload')
            .addEventListener('click', () => {
            this.startDownload();
        });
        this.wrapper
            .querySelector('.pauseDownload')
            .addEventListener('click', () => {
            this.pauseDownload();
        });
        this.wrapper
            .querySelector('.stopDownload')
            .addEventListener('click', () => {
            this.stopDownload();
        });
        this.wrapper.querySelector('.copyUrl').addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('showURLs');
        });
    }
    // 抓取完毕之后，已经可以开始下载时，显示必要的信息，并决定是否立即开始下载
    readyDownload() {
        if (_store_States__WEBPACK_IMPORTED_MODULE_15__["states"].busy || _store_States__WEBPACK_IMPORTED_MODULE_15__["states"].mergeNovel) {
            return;
        }
        if (_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0) {
            return _ProgressBar__WEBPACK_IMPORTED_MODULE_8__["progressBar"].reset(0);
        }
        this.showDownloadArea();
        this.totalNumberEl.textContent = _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length.toString();
        this.setDownloaded();
        this.setDownloadThread();
        _Help__WEBPACK_IMPORTED_MODULE_19__["help"].showDownloadTip();
        // 在插画漫画搜索页面里，如果启用了“预览搜索页面的筛选结果”
        if (_PageType__WEBPACK_IMPORTED_MODULE_20__["pageType"].type === _PageType__WEBPACK_IMPORTED_MODULE_20__["pageType"].list.ArtworkSearch &&
            _setting_Settings__WEBPACK_IMPORTED_MODULE_6__["settings"].previewResult) {
            // “预览搜索页面的筛选结果”会阻止自动开始下载。但是一些情况例外
            // 允许由图片查看器发起的下载请求自动开始下载
            // 允许由抓取标签列表功能发起的下载请求自动开始下载
            if (!_store_States__WEBPACK_IMPORTED_MODULE_15__["states"].downloadFromViewer &&
                !_store_States__WEBPACK_IMPORTED_MODULE_15__["states"].quickCrawl &&
                !_store_States__WEBPACK_IMPORTED_MODULE_15__["states"].crawlTagList) {
                return;
            }
        }
        // 自动开始下载的情况
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_6__["settings"].quietDownload ||
            _store_States__WEBPACK_IMPORTED_MODULE_15__["states"].quickCrawl ||
            _store_States__WEBPACK_IMPORTED_MODULE_15__["states"].downloadFromViewer ||
            _store_States__WEBPACK_IMPORTED_MODULE_15__["states"].crawlTagList) {
            this.startDownload();
        }
    }
    // 开始下载
    startDownload() {
        if (!this.pause && !_Resume__WEBPACK_IMPORTED_MODULE_14__["resume"].flag) {
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
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('downloadStart');
        // 建立并发下载线程
        for (let i = 0; i < this.thread; i++) {
            this.createDownload(i);
        }
        _Log__WEBPACK_IMPORTED_MODULE_3__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_正在下载中'));
    }
    // 暂停下载
    pauseDownload() {
        if (_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0) {
            return;
        }
        // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
        if (this.stop === true) {
            return;
        }
        if (this.pause === false) {
            // 如果正在下载中
            if (_store_States__WEBPACK_IMPORTED_MODULE_15__["states"].busy) {
                this.pause = true;
                _Log__WEBPACK_IMPORTED_MODULE_3__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_已暂停'), 2);
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('downloadPause');
            }
            else {
                // 不在下载中的话不允许启用暂停功能
                return;
            }
        }
    }
    // 停止下载
    stopDownload() {
        if (_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0 || this.stop) {
            return;
        }
        this.stop = true;
        _Log__WEBPACK_IMPORTED_MODULE_3__["log"].error(_Lang__WEBPACK_IMPORTED_MODULE_4__["lang"].transl('_已停止'), 2);
        this.pause = false;
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('downloadStop');
    }
    downloadError(id) {
        this.errorIdList.push(id);
        // 是否继续下载
        const task = this.taskList[id];
        const no = task.progressBarIndex;
        if (this.checkContinueDownload()) {
            this.createDownload(no);
        }
        else {
            this.checkCompleteWithError();
        }
    }
    saveFileError(data) {
        if (this.pause || this.stop) {
            return false;
        }
        const task = this.taskList[data.id];
        // 复位这个任务的状态
        _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].setState(task.index, -1);
        // 建立下载任务，再次下载它
        this.createDownload(task.progressBarIndex);
    }
    downloadOrSkipAFile(data) {
        const task = this.taskList[data.id];
        // 更改这个任务状态为“已完成”
        _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].setState(task.index, 1);
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
        if (this.downloaded < _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
            // 如果任务已停止
            if (this.pause || this.stop) {
                return false;
            }
            // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数，继续添加任务
            if (this.downloaded + this.thread - 1 < _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
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
    // 设置下载线程数量
    setDownloadThread() {
        const setThread = _setting_Settings__WEBPACK_IMPORTED_MODULE_6__["settings"].downloadThread;
        if (setThread < 1 ||
            setThread > _config_Config__WEBPACK_IMPORTED_MODULE_16__["Config"].downloadThreadMax ||
            isNaN(setThread)) {
            // 如果数值非法，则重设为默认值
            this.thread = _config_Config__WEBPACK_IMPORTED_MODULE_16__["Config"].downloadThreadMax;
            Object(_setting_Settings__WEBPACK_IMPORTED_MODULE_6__["setSetting"])('downloadThread', _config_Config__WEBPACK_IMPORTED_MODULE_16__["Config"].downloadThreadMax);
        }
        else {
            this.thread = setThread; // 设置为用户输入的值
        }
        // 如果剩余任务数量少于下载线程数
        if (_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length - this.downloaded < this.thread) {
            this.thread = _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length - this.downloaded;
        }
        // 重设下载进度条
        _ProgressBar__WEBPACK_IMPORTED_MODULE_8__["progressBar"].reset(this.thread, this.downloaded);
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
            const workData = _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result[index];
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
            new _download_Download__WEBPACK_IMPORTED_MODULE_7__["Download"](progressBarIndex, data);
        }
    }
    setDownloaded() {
        this.downloaded = _DownloadStates__WEBPACK_IMPORTED_MODULE_9__["downloadStates"].downloadedCount();
        const text = `${this.downloaded} / ${_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length}`;
        _Log__WEBPACK_IMPORTED_MODULE_3__["log"].log(text, 2, false);
        // 设置总下载进度条
        _ProgressBar__WEBPACK_IMPORTED_MODULE_8__["progressBar"].setTotalProgress(this.downloaded);
        // 所有文件正常下载完毕（跳过下载的文件也算正常下载）
        if (this.downloaded === _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
            window.setTimeout(() => {
                // 延后触发下载完成的事件。因为下载完成事件是由上游事件（跳过下载，或下载成功事件）派生的，如果这里不延迟触发，可能导致其他模块先接收到下载完成事件，后接收到上游事件。
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('downloadComplete');
            }, 0);
            this.reset();
        }
        this.checkCompleteWithError();
    }
    // 在有下载出错的情况下，是否已经完成了下载
    checkCompleteWithError() {
        if (this.errorIdList.length > 0 &&
            this.downloaded + this.errorIdList.length === _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length) {
            // 进入暂停状态，一定时间后自动开始下载，重试下载出错的文件
            this.pauseDownload();
            setTimeout(() => {
                this.startDownload();
            }, 2000);
        }
    }
    reset() {
        this.pause = false;
        this.stop = false;
        this.errorIdList = [];
    }
    showDownloadArea() {
        this.wrapper.style.display = 'block';
    }
    hideDownloadArea() {
        this.wrapper.style.display = 'none';
    }
}
new DownloadControl();


/***/ }),

/***/ "./src/ts/download/DownloadStates.ts":
/*!*******************************************!*\
  !*** ./src/ts/download/DownloadStates.ts ***!
  \*******************************************/
/*! exports provided: downloadStates */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downloadStates", function() { return downloadStates; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");


// 下载状态列表
class DownloadStates {
    constructor() {
        this.states = [];
        this.bindEvents();
    }
    bindEvents() {
        // 初始化下载状态
        const evs = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resultChange];
        for (const ev of evs) {
            window.addEventListener(ev, () => {
                this.init();
            });
        }
    }
    // 创建新的状态列表
    init() {
        this.states = new Array(_store_Store__WEBPACK_IMPORTED_MODULE_1__["store"].result.length).fill(-1);
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

/***/ "./src/ts/download/ExportLST.ts":
/*!**************************************!*\
  !*** ./src/ts/download/ExportLST.ts ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../FileName */ "./src/ts/FileName.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");






// 输出 lst 文件
class ExportLST {
    constructor() {
        this.separate = '?/'; // 分隔符
        this.CRLF = '\r\n'; // 换行符
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener('keydown', (ev) => {
            if (ev.altKey && ev.code === 'KeyL') {
                this.createLst();
            }
        }, false);
    }
    createLst() {
        if (_store_Store__WEBPACK_IMPORTED_MODULE_1__["store"].result.length === 0) {
            _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_没有数据可供使用'));
            return;
        }
        const array = [];
        for (const data of _store_Store__WEBPACK_IMPORTED_MODULE_1__["store"].result) {
            array.push(data.original + this.separate + _FileName__WEBPACK_IMPORTED_MODULE_2__["fileName"].getFileName(data));
        }
        const result = array.join(this.CRLF);
        const blob = new Blob([result]);
        const url = URL.createObjectURL(blob);
        const name = _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].getPageTitle() + '.lst';
        _utils_Utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].downloadFile(url, name);
    }
}
new ExportLST();


/***/ }),

/***/ "./src/ts/download/ExportResult.ts":
/*!*****************************************!*\
  !*** ./src/ts/download/ExportResult.ts ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");






class ExportResult {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.exportResult, () => {
            this.output();
        });
    }
    output() {
        // 如果没有数据则不执行
        if (_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length === 0) {
            _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_没有数据可供使用'));
            return;
        }
        // 使用数组储存文件数据
        let resultArray = [];
        // 定义数组项的分隔字符
        const split = ',';
        // 在数组开头添加数组的开始符号
        resultArray.push('[');
        // 循环添加每一个结果，以及分割字符
        for (const result of _store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result) {
            resultArray.push(JSON.stringify(result));
            resultArray.push(split);
        }
        // 删除最后一个分隔符（不去掉的话会导致格式错误）
        resultArray.pop();
        // 在数组末尾添加数组的结束符号
        resultArray.push(']');
        // 创建 blob 对象
        const blob = new Blob(resultArray, { type: 'application/json' });
        resultArray = [];
        const url = URL.createObjectURL(blob);
        _utils_Utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].downloadFile(url, `result-${_utils_Utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].replaceUnsafeStr(_Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getPageTitle())}-${_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].crawlCompleteTime.getTime()}.json`);
        _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_导出成功'));
    }
}
new ExportResult();


/***/ }),

/***/ "./src/ts/download/ExportResult2CSV.ts":
/*!*********************************************!*\
  !*** ./src/ts/download/ExportResult2CSV.ts ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../FileName */ "./src/ts/FileName.ts");
/* harmony import */ var _utils_CreateCSV__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/CreateCSV */ "./src/ts/utils/CreateCSV.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");









// name 这个字段在 csv 里的标题
// index 这个字段在数据里的索引名
// 导出抓取结果为 csv 文件
class ExportResult2CSV {
    constructor() {
        this.xRestrictMap = new Map([
            [0, 'AllAges'],
            [1, 'R-18'],
            [2, 'R-18G'],
        ]);
        // 定义要保存的字段
        this.fieldCfg = [
            {
                name: 'id',
                index: 'idNum',
            },
            {
                name: 'tags',
                index: 'tags',
            },
            {
                name: 'tags_transl',
                index: 'tagsTranslOnly',
            },
            {
                name: 'user',
                index: 'user',
            },
            {
                name: 'userId',
                index: 'userId',
            },
            {
                name: 'title',
                index: 'title',
            },
            {
                name: 'description',
                index: 'description',
            },
            {
                name: 'type',
                index: 'type',
            },
            {
                name: 'page',
                index: 'pageCount',
            },
            {
                name: 'bookmark',
                index: 'bmk',
            },
            {
                name: 'bookmarked',
                index: 'bookmarked',
            },
            {
                name: 'likeCount',
                index: 'likeCount',
            },
            {
                name: 'viewCount',
                index: 'viewCount',
            },
            {
                name: 'commentCount',
                index: 'commentCount',
            },
            {
                name: 'width',
                index: 'fullWidth',
            },
            {
                name: 'height',
                index: 'fullHeight',
            },
            {
                name: 'xRestrict',
                index: 'xRestrict',
            },
            {
                name: 'date',
                index: 'date',
            },
            {
                name: 'original',
                index: 'original',
            },
            {
                name: 'thumb',
                index: 'thumb',
            },
            // fileName 字段的 index 属性可以随便写，因为没有影响。
            {
                name: 'fileName',
                index: 'title',
            },
        ];
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.exportCSV, () => {
            this.beforeCreate();
        });
    }
    beforeCreate() {
        // 如果没有数据则不执行
        if (_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result.length === 0) {
            _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
            return;
        }
        // 使用 result 而不使用 resultMeta。主要是因为断点续传时只会恢复 result，不会恢复 resultMeta，所以 result 最可靠。考虑如下情况：
        // 1：刷新页面后，断点续传恢复了保存的数据，此时只有 result 里有数据，resultMeta 没有数据。
        // 2: 如果在页面 A 进行了下载，resultMeta 保存的是页面 A 的数据。此时进入页面 B，恢复了 B 页面保存的任务，此时 resultMeta 里还是页面 A 的数据。
        // 所以还是使用 result 比较可靠，不易出问题。
        this.create(_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].result);
    }
    create(data) {
        var _a, _b;
        const body = []; // 内容数组
        // 标题数组
        const head = [];
        for (const field of this.fieldCfg) {
            head.push(field.name);
        }
        body.push(head);
        // 循环每个作品的数据
        for (const d of data) {
            // 每个作品只导出一条记录
            // 如果是多图作品里第一张图之后的图片数据，则跳过
            const index = (_a = d.index) !== null && _a !== void 0 ? _a : _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getResultIndex(d);
            if (index > 0) {
                continue;
            }
            const bodyItem = []; // 储存这个作品生成的所有字段
            // 生成每个字段的结果
            for (const field of this.fieldCfg) {
                if (field.name === 'fileName') {
                    bodyItem.push(_FileName__WEBPACK_IMPORTED_MODULE_5__["fileName"].getFileName(d));
                }
                else {
                    let result = (_b = d[field.index]) !== null && _b !== void 0 ? _b : '';
                    // 对于某些字段，将其内容特殊化处理
                    if (field.name === 'type') {
                        result = _config_Config__WEBPACK_IMPORTED_MODULE_3__["Config"].worksTypeName[result];
                    }
                    if (field.name === 'bookmarked') {
                        result = result ? 'Yes' : 'No';
                    }
                    if (field.name === 'xRestrict') {
                        result = this.xRestrictMap.get(result) || '';
                    }
                    bodyItem.push(result);
                }
            }
            // 把这个作品的数据添加到内容数组里
            body.push(bodyItem);
        }
        const csv = _utils_CreateCSV__WEBPACK_IMPORTED_MODULE_6__["createCSV"].create(body);
        const csvURL = URL.createObjectURL(csv);
        // 设置文件名
        let csvName = `result-${_utils_Utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].replaceUnsafeStr(_Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getPageTitle())}-${_store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].crawlCompleteTime.getTime()}.csv`;
        _utils_Utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].downloadFile(csvURL, csvName);
        _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_导出成功'));
    }
}
new ExportResult2CSV();


/***/ }),

/***/ "./src/ts/download/ImportResult.ts":
/*!*****************************************!*\
  !*** ./src/ts/download/ImportResult.ts ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");








class ImportResult {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.importResult, () => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_3__["states"].busy) {
                _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
                return;
            }
            this.import();
        });
    }
    async import() {
        const loadedJSON = (await _utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].loadJSONFile().catch((err) => {
            return _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].error(err);
        }));
        if (!loadedJSON) {
            return;
        }
        // 要求是数组并且要有内容
        if (!Array.isArray(loadedJSON) || !loadedJSON.length || !loadedJSON[0]) {
            return _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error('Format error!');
        }
        // 检查是否含有必须的字段（只检查了一部分）
        const keys = Object.keys(loadedJSON[0]);
        const need = ['idNum', 'id', 'original', 'type', 'ext'];
        for (const field of need) {
            if (!keys.includes(field)) {
                return _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error('Format error!');
            }
        }
        // 根据过滤选项，过滤导入的结果
        const temp = [];
        for (const result of loadedJSON) {
            const check = await _filter_Filter__WEBPACK_IMPORTED_MODULE_7__["filter"].check({
                id: result.idNum,
                workType: result.type,
                pageCount: result.pageCount,
                tags: result.tagsWithTransl,
                bookmarkCount: result.bmk,
                bookmarkData: result.bookmarked,
                width: result.fullWidth,
                height: result.fullHeight,
                createDate: result.date,
                userId: result.userId,
                xRestrict: result.xRestrict,
            });
            if (check) {
                temp.push(result);
            }
        }
        // 如果没有符合过滤条件的结果
        if (temp.length === 0) {
            _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_没有符合条件的结果'));
            return;
        }
        // 恢复数据
        // 通过 store.addResult 添加数据，可以应用多图作品设置，对导入的结果进行调整
        _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].reset();
        for (const r of temp) {
            _store_Store__WEBPACK_IMPORTED_MODULE_4__["store"].addResult(r);
        }
        // 发送通知
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('resultChange');
        _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入成功'));
    }
}
new ImportResult();


/***/ }),

/***/ "./src/ts/download/MakeEPUB.ts":
/*!*************************************!*\
  !*** ./src/ts/download/MakeEPUB.ts ***!
  \*************************************/
/*! exports provided: makeEPUB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeEPUB", function() { return makeEPUB; });
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");

class MakeEPUB {
    constructor() { }
    // epub 内部会使用标题 title 建立一个文件夹，把一些文件存放进去，所以这里要替换掉标题的特殊字符，特殊字符会导致这个文件夹名被截断，结果就是这个 epub 文件无法被解析。
    make(data, saveMeta = true) {
        return new Promise((resolve, reject) => {
            let content = data.content;
            // 附带小说元数据
            if (saveMeta) {
                content = data.meta + content;
            }
            // 把换行符替换成 br 标签
            content = content.replace(/\n/g, '<br/>');
            new EpubMaker()
                .withTemplate('idpf-wasteland')
                .withAuthor(_utils_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].replaceUnsafeStr(data.userName))
                .withModificationDate(new Date(data.createDate))
                .withRights({
                description: data.description,
                license: '',
            })
                .withAttributionUrl(`https://www.pixiv.net/novel/show.php?id=${data.id}`)
                .withCover(data.coverUrl, {
                license: '',
                attributionUrl: '',
            })
                .withTitle(_utils_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].replaceUnsafeStr(data.title))
                .withSection(new EpubMaker.Section('chapter', null, { content: content }, false, true))
                .makeEpub()
                .then((blob) => {
                resolve(blob);
            });
        });
    }
}
const makeEPUB = new MakeEPUB();



/***/ }),

/***/ "./src/ts/download/MakeNovelFile.ts":
/*!******************************************!*\
  !*** ./src/ts/download/MakeNovelFile.ts ***!
  \******************************************/
/*! exports provided: MakeNovelFile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MakeNovelFile", function() { return MakeNovelFile; });
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _MakeEPUB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MakeEPUB */ "./src/ts/download/MakeEPUB.ts");


class MakeNovelFile {
    static async make(data, type = _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].novelSaveAs) {
        if (type === 'txt') {
            return this.makeTXT(data, _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].saveNovelMeta);
        }
        return _MakeEPUB__WEBPACK_IMPORTED_MODULE_1__["makeEPUB"].make(data, _setting_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"].saveNovelMeta);
    }
    static makeTXT(data, saveMeta = true) {
        let content = data.content;
        // 附带小说元数据
        if (saveMeta) {
            content = data.meta + content;
        }
        // 替换换行标签，移除 html 标签
        content = content.replace(/<br \/>/g, '\n').replace(/<\/?.+?>/g, '');
        return new Blob([content], {
            type: 'text/plain',
        });
    }
}



/***/ }),

/***/ "./src/ts/download/MergeNovel.ts":
/*!***************************************!*\
  !*** ./src/ts/download/MergeNovel.ts ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");






class MergeNovel {
    constructor() {
        this.CRLF = '\n'; // pixiv 小说的换行符
        this.init();
    }
    init() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlFinish, () => {
            window.setTimeout(() => {
                if (_store_States__WEBPACK_IMPORTED_MODULE_3__["states"].mergeNovel) {
                    this.merge();
                }
            }, 0);
        });
    }
    async merge() {
        if (_store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].resultMeta.length === 0 ||
            _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].resultMeta[0].novelMeta === null) {
            _store_States__WEBPACK_IMPORTED_MODULE_3__["states"].mergeNovel = false;
            return;
        }
        // 因为结果里的小说顺序可能是乱的，所以需要按照小说的序号对结果进行排序
        const allResult = _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].resultMeta.sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].sortByProperty('seriesOrder', 'asc'));
        const firstResult = _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].resultMeta[0];
        // 汇总小说数据
        const allNovelData = [];
        for (const result of allResult) {
            allNovelData.push({
                no: result.seriesOrder,
                title: result.title,
                content: result.novelMeta.content,
            });
        }
        // 生成小说文件并下载
        let file = null;
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].novelSaveAs === 'txt') {
            file = this.makeTXT(allNovelData);
        }
        else {
            file = await this.makeEPUB(allNovelData, firstResult);
        }
        const url = URL.createObjectURL(file);
        const fileName = `${firstResult.seriesTitle}-tags_${firstResult.tags}-user_${firstResult.user}-seriesId_${firstResult.seriesId}.${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].novelSaveAs}`;
        _utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].downloadFile(url, fileName);
        _store_States__WEBPACK_IMPORTED_MODULE_3__["states"].mergeNovel = false;
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('downloadComplete');
        _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].reset();
    }
    makeTXT(novelDataArray) {
        const result = [];
        for (const data of novelDataArray) {
            // 添加章节名
            result.push(`${this.chapterNo(data.no)} ${data.title}`);
            // 在章节名与正文之间添加换行
            result.push(this.CRLF.repeat(2));
            // 添加正文
            // 替换换行标签，移除 html 标签
            result.push(data.content.replace(/<br \/>/g, this.CRLF).replace(/<\/?.+?>/g, ''));
            // 在正文结尾添加换行标记，使得不同章节之间区分开来
            result.push(this.CRLF.repeat(4));
        }
        return new Blob(result, {
            type: 'text/plain',
        });
    }
    makeEPUB(novelDataArray, firstResult) {
        return new Promise((resolve, reject) => {
            // 添加一些元数据
            let epubData = new EpubMaker()
                .withTemplate('idpf-wasteland')
                .withAuthor(_utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].replaceUnsafeStr(firstResult.novelMeta.userName))
                .withModificationDate(new Date(firstResult.novelMeta.createDate))
                .withRights({
                description: firstResult.novelMeta.description,
                license: '',
            })
                .withAttributionUrl(`https://www.pixiv.net/novel/show.php?id=${firstResult.novelMeta.id}`)
                .withCover(firstResult.novelMeta.coverUrl, {
                license: '',
                attributionUrl: '',
            })
                .withTitle(_utils_Utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].replaceUnsafeStr(firstResult.seriesTitle));
            // 下面注释的伪代码是用于创建二级目录用的。目前 pixiv 的小说只需要一层目录就够了，所以这里的代码未被使用
            // const Section = new EpubMaker.Section(...........)
            // for (const data of novelDataArray) {
            //   Section.withSubSection(
            //     new EpubMaker.Section(...........)
            //   )
            // }
            // epubData = epubData.withSection(Section)
            // 为每一篇小说创建一个章节
            for (const data of novelDataArray) {
                // 创建 epub 文件时不需要在标题和正文后面添加换行符
                epubData.withSection(new EpubMaker.Section('chapter', data.no, {
                    title: `${this.chapterNo(data.no)} ${data.title}`,
                    // 把换行符替换成 br 标签
                    content: data.content.replace(/\n/g, '<br/>'),
                }, true, true)
                // 倒数第二个参数是 includeInToc，必须为 true，否则某些小说阅读软件无法读取章节信息
                // includeInToc 的作用是在 .ncx 文件和 nav.xhtml 文件里添加导航信息
                );
            }
            epubData.makeEpub().then((blob) => {
                resolve(blob);
            });
        });
    }
    // 在每个小说的开头加上章节编号
    // 在 TXT 格式的小说里添加章节编号，可以使小说阅读软件能够识别章节，以及显示章节导航，提高阅读体验
    // 对于 EPUB 格式的小说，由于其内部自带分章结构，所以并不依赖这里的章节编号
    chapterNo(number) {
        // 如果是中文用户，返回“第N章”。这样最容易被国内的小说阅读软件识别出来
        if (_Lang__WEBPACK_IMPORTED_MODULE_5__["lang"].type === 'zh-cn' || _Lang__WEBPACK_IMPORTED_MODULE_5__["lang"].type === 'zh-tw' || _Lang__WEBPACK_IMPORTED_MODULE_5__["lang"].type === 'ja') {
            return `第${number}章`;
        }
        else {
            // 对于其他地区，返回 `Chapter N`。但是由于我没有使用过国外的小说阅读软件，所以并不清楚是否能够起到分章作用
            return `Chapter ${number}`;
        }
        // 我还尝试过使用 #1 这样的编号，但是这种方式并不可靠，有的小说可以分章有的小说不可以，我也不知道怎么回事
    }
}
new MergeNovel();


/***/ }),

/***/ "./src/ts/download/ProgressBar.ts":
/*!****************************************!*\
  !*** ./src/ts/download/ProgressBar.ts ***!
  \****************************************/
/*! exports provided: progressBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "progressBar", function() { return progressBar; });
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
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
        this.KB = 1024;
        this.MB = 1024 * 1024;
        this.createElements();
        this.bindEvents();
    }
    createElements() {
        this.wrap = _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].useSlot('progressBar', this.wrapHTML);
        this.downloadedEl = this.wrap.querySelector('.downloaded');
        this.progressColorEl = this.wrap.querySelector('.progress1');
        this.listWrap = this.wrap.querySelector('.progressBarList');
        this.totalNumberEl = this.wrap.querySelector('.totalNumber');
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_3__["EVT"].list.crawlStart, () => {
            this.hide();
        });
    }
    // 重设所有进度
    reset(progressBarNum, downloaded = 0) {
        if (progressBarNum === 0) {
            // 如果进度条数量为 0（抓取结果为空），则隐藏进度条区域
            return this.hide();
        }
        // 重置总进度条
        this.setTotalProgress(downloaded);
        this.totalNumberEl.textContent = _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length.toString();
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
        const progress = (downloaded / _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length) * 100;
        this.progressColorEl.style.width = progress + '%';
    }
    // 设置子进度条的进度
    setProgress(index, data) {
        const bar = this.allProgressBar[index];
        if (!bar) {
            console.error(index, this.allProgressBar);
            return;
        }
        bar.name.textContent = data.name;
        let text = '';
        if (data.total >= this.MB) {
            // 如果判断条件加上： || data.total === 0
            // 则文件未下载时显示的默认单位会是 MiB
            // 使用 MiB 作为单位
            text = `${(data.loaded / this.MB).toFixed(1)}/${(data.total / this.MB).toFixed(1)} MiB`;
        }
        else {
            // 使用 KiB 作为单位
            text = `${Math.floor(data.loaded / this.KB)}/${Math.floor(data.total / this.KB)} KiB`;
        }
        bar.loaded.textContent = text;
        const progress = data.loaded / data.total || 0; // 若结果为 NaN 则设为 0
        bar.progress.style.width = progress * 100 + '%';
    }
    // 让某个子进度条显示警告色
    errorColor(index, show) {
        const bar = this.allProgressBar[index];
        if (!bar) {
            console.error(index, this.allProgressBar);
            return;
        }
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

/***/ "./src/ts/download/Resume.ts":
/*!***********************************!*\
  !*** ./src/ts/download/Resume.ts ***!
  \***********************************/
/*! exports provided: resume */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resume", function() { return resume; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _DownloadStates__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DownloadStates */ "./src/ts/download/DownloadStates.ts");
/* harmony import */ var _utils_IndexedDB__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/IndexedDB */ "./src/ts/utils/IndexedDB.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");









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
        this.IDB = new _utils_IndexedDB__WEBPACK_IMPORTED_MODULE_6__["IndexedDB"]();
        this.init();
    }
    async init() {
        if (!_utils_Utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].isPixiv()) {
            return;
        }
        await this.initDB();
        this.restoreData();
        this.bindEvents();
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
        if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
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
            // 恢复数据时不适合使用 store.addResult，因为那样会被多图作品设置影响，可能导致恢复的数据和之前下载时不一致
            // 所以这里直接替换整个 store.result
            _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result = [];
            const r = res;
            for (const taskData of r) {
                for (const data of taskData.data) {
                    _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.push(data);
                }
            }
        });
        // 3 恢复下载状态
        const data = (await this.IDB.get(this.statesName, this.taskId));
        if (data) {
            _DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].replace(data.states);
        }
        _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].crawlCompleteTime = meta.date;
        // 恢复模式就绪
        this.flag = true;
        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已恢复抓取结果'), 2);
        // 发出恢复下载的信号
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('resume');
    }
    bindEvents() {
        // 抓取完成时，保存这次任务的数据
        const evs = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlFinish, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resultChange];
        for (const ev of evs) {
            window.addEventListener(ev, async () => {
                if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].mergeNovel) {
                    return;
                }
                // 首先检查这个网址下是否已经存在数据，如果有数据，则清除之前的数据，保持每个网址只有一份数据
                const taskData = (await this.IDB.get(this.metaName, this.getURL(), 'url'));
                if (taskData) {
                    await this.IDB.delete(this.metaName, taskData.id);
                    await this.IDB.delete(this.statesName, taskData.id);
                }
                // 保存本次任务的数据
                // 如果此时本次任务已经完成，就不进行保存了
                if (_DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].downloadedCount() === _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length) {
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
                    date: _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].crawlCompleteTime,
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
        // 当有文件下载完成或者跳过下载时，更新下载状态
        const saveEv = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadSuccess, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.skipDownload];
        saveEv.forEach((val) => {
            window.addEventListener(val, () => {
                this.needPutStates = true;
            });
        });
        // 任务下载完毕时，以及停止任务时，清除这次任务的数据
        const clearDataEv = [_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadComplete, _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStop];
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
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart, () => {
            this.flag = false;
        });
        // 切换页面时，重新检查恢复数据
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitch, () => {
            this.flag = false;
            this.restoreData();
        });
        // 清空已保存的抓取结果
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.clearSavedCrawl, () => {
            this.flag = false;
            this.clearSavedCrawl();
        });
    }
    // 定时 put 下载状态
    async regularPutStates() {
        window.setInterval(() => {
            if (this.needPutStates) {
                const statesData = {
                    id: this.taskId,
                    states: _DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].states,
                };
                this.needPutStates = false;
                // 如果此时本次任务已经完成，就不进行保存了
                if (_DownloadStates__WEBPACK_IMPORTED_MODULE_5__["downloadStates"].downloadedCount() === _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length) {
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
            let tryNum = Math.floor(_store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length * Math.pow(0.5, this.try));
            // 如果这批尝试数据大于指定数量，则设置为指定数量
            tryNum > this.onceMax && (tryNum = this.onceMax);
            let data = {
                id: this.numAppendNum(this.taskId, this.part.length),
                data: _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.slice(this.getPartTotal(), this.getPartTotal() + tryNum),
            };
            try {
                // 当成功存储了一批数据时
                await this.IDB.add(this.dataName, data);
                this.part.push(data.data.length); // 记录这一次保存的结果数量
                this.try = 0; // 重置已尝试次数
                // 任务数据全部添加完毕
                if (this.getPartTotal() >= _store_Store__WEBPACK_IMPORTED_MODULE_3__["store"].result.length) {
                    resolve(true);
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
        _MsgBox__WEBPACK_IMPORTED_MODULE_7__["msgBox"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_数据清除完毕'));
    }
}
const resume = new Resume();



/***/ }),

/***/ "./src/ts/download/SaveWorkMeta.ts":
/*!*****************************************!*\
  !*** ./src/ts/download/SaveWorkMeta.ts ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../FileName */ "./src/ts/FileName.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");




// 为每个作品创建一个 txt 文件，保存这个作品的元数据
class SaveWorkMeta {
    constructor() {
        // 保存已经下载了元数据的作品的 id
        this.savedIds = [];
        this.CRLF = '\n'; // txt 文件中使用的换行符
        this.bindEvents();
    }
    bindEvents() {
        // 当有作品文件下载成功时，保存其元数据
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadSuccess, (ev) => {
            const successData = ev.detail.data;
            this.saveMeta(Number.parseInt(successData.id));
        });
        // 当开始新的抓取时，清空保存的 id 列表
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart, () => {
            this.savedIds = [];
        });
    }
    // 添加一项元数据
    // 在 name 和 value 后面添加换行符
    addMeta(name, value) {
        return `${name}${this.CRLF}${value}${this.CRLF.repeat(2)}`;
    }
    getWorkURL(data) {
        return `https://www.pixiv.net/${data.type === 3 ? 'n' : 'i'}/${data.idNum}`;
    }
    joinTags(tags) {
        const format = tags.map((tag) => '#' + tag);
        return format.join(this.CRLF);
    }
    // 替换换行标签，移除 html 标签
    handleHTML(str) {
        return str.replace(/<br \/>/g, this.CRLF).replace(/<\/?.+?>/g, '');
    }
    // 根据作品类型判断是否需要保存它的元数据
    checkNeedSave(type) {
        switch (type) {
            case 0:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType0;
            case 1:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType1;
            case 2:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType2;
            case 3:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType3;
            default:
                return false;
        }
    }
    saveMeta(id) {
        // 如果所有类型的作品都不需要保存元数据
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType0 &&
            !_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType1 &&
            !_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType2 &&
            !_setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].saveMetaType3) {
            return;
        }
        if (this.savedIds.includes(id)) {
            return;
        }
        // 查找这个作品的数据
        const dataSource = _store_Store__WEBPACK_IMPORTED_MODULE_1__["store"].resultMeta.length > 0 ? _store_Store__WEBPACK_IMPORTED_MODULE_1__["store"].resultMeta : _store_Store__WEBPACK_IMPORTED_MODULE_1__["store"].result;
        const data = dataSource.find((val) => val.idNum === id);
        if (data === undefined) {
            console.error(`Not find ${id} in result`);
            return;
        }
        if (this.checkNeedSave(data.type) === false) {
            return;
        }
        // 添加文件内容
        const fileContent = [];
        fileContent.push(this.addMeta('Id', data.idNum.toString()));
        fileContent.push(this.addMeta('Title', data.title));
        fileContent.push(this.addMeta('User', data.user));
        fileContent.push(this.addMeta('UserId', data.userId));
        fileContent.push(this.addMeta('URL', this.getWorkURL(data)));
        fileContent.push(this.addMeta('Tags', this.joinTags(data.tags)));
        fileContent.push(this.addMeta('Date', data.date));
        // description 的标题下面多添加一行空格，便于和 description 内容进行区分
        fileContent.push(this.addMeta('Description\n', this.handleHTML(data.description)));
        // 生成文件
        const blob = new Blob(fileContent, {
            type: 'text/plain',
        });
        // 生成文件名
        // 元数据文件需要和它对应的图片/小说文件的路径相同，文件名相似，这样它们才能在资源管理器里排在一起，便于查看
        // 生成这个数据的路径和文件名
        const _fileName = _FileName__WEBPACK_IMPORTED_MODULE_2__["fileName"].getFileName(data);
        // 取出后缀名之前的部分
        const index = _fileName.lastIndexOf('.');
        // 把 id 字符串换成数字 id，这是为了去除 id 后面可能存在的序号，如 p0
        let part1 = _fileName
            .substring(0, index)
            .replace(data.id, data.idNum.toString());
        // 拼接出元数据文件的文件名
        const metaFileName = `${part1}-meta.txt`;
        // 发送下载请求
        // 因为我偷懒，所以后台不会返回下载状态，默认为下载成功
        chrome.runtime.sendMessage({
            msg: 'save_description_file',
            fileUrl: URL.createObjectURL(blob),
            fileName: metaFileName,
        });
        this.savedIds.push(id);
    }
}
new SaveWorkMeta();


/***/ }),

/***/ "./src/ts/download/ShowConvertCount.ts":
/*!*********************************************!*\
  !*** ./src/ts/download/ShowConvertCount.ts ***!
  \*********************************************/
/*! exports provided: ShowConvertCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowConvertCount", function() { return ShowConvertCount; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");


// 显示正在转换的文件数量
class ShowConvertCount {
    constructor(el) {
        this.el = el;
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.convertChange, (ev) => {
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

/***/ "./src/ts/download/ShowDownloadStates.ts":
/*!***********************************************!*\
  !*** ./src/ts/download/ShowDownloadStates.ts ***!
  \***********************************************/
/*! exports provided: ShowDownloadStates */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowDownloadStates", function() { return ShowDownloadStates; });
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");



// 显示下载状态
class ShowDownloadStates {
    constructor(el) {
        this.el = el;
        this.bindEvents();
    }
    bindEvents() {
        for (const ev of [
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlFinish,
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resultChange,
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resume,
        ]) {
            window.addEventListener(ev, () => {
                this.setText(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_未开始下载'));
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadStart, () => {
            this.setText(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_正在下载中'));
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadPause, () => {
            this.setText(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已暂停'), '#f00');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadStop, () => {
            this.setText(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已停止'), '#f00');
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadComplete, () => {
            this.setText(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_下载完毕'), _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].textSuccess);
        });
    }
    setText(text, color = _config_Colors__WEBPACK_IMPORTED_MODULE_0__["Colors"].bgBlue) {
        this.el.textContent = text;
        this.el.style.color = color;
    }
}



/***/ }),

/***/ "./src/ts/download/ShowSkipCount.ts":
/*!******************************************!*\
  !*** ./src/ts/download/ShowSkipCount.ts ***!
  \******************************************/
/*! exports provided: ShowSkipCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowSkipCount", function() { return ShowSkipCount; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");


// 显示跳过下载的文件数量
class ShowSkipCount {
    constructor(el) {
        this.count = 0; // 跳过下载的数量
        this.el = el;
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart, () => {
            this.reset();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStop, () => {
            // 重置计数但不清空提示文字，因为用户还需要看
            this.count = 0;
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.skipDownload, () => {
            this.addCount();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStart, () => {
            if (this.count === 0) {
                this.reset();
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resultChange, () => {
            this.reset();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadComplete, () => {
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

/***/ "./src/ts/download/showStatusOnTitle.ts":
/*!**********************************************!*\
  !*** ./src/ts/download/showStatusOnTitle.ts ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");


/**
↑ 抓取中
→ 等待下一步操作（搜索页）
▶ 可以开始下载
↓ 下载中
║ 下载暂停
■ 下载停止
✓ 下载完毕
*/
var Flags;
(function (Flags) {
    Flags["crawling"] = "\u2191";
    Flags["waiting"] = "\u2192";
    Flags["readyDownload"] = "\u25B6";
    Flags["downloading"] = "\u2193";
    Flags["paused"] = "\u2551";
    Flags["stopped"] = "\u25A0";
    Flags["completed"] = "\u2713";
    Flags["space"] = " ";
})(Flags || (Flags = {}));
// 把下载器运行中的状态添加到页面标题前面
class showStatusOnTitle {
    constructor() {
        this.timer = 0; // title 闪烁时，使用的定时器
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlStart, () => {
            this.set(Flags.crawling);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.worksUpdate, () => {
            this.set(Flags.waiting);
        });
        for (const ev of [
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlFinish,
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resultChange,
            _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resume,
        ]) {
            window.addEventListener(ev, () => {
                this.set(Flags.readyDownload);
            });
        }
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadStart, () => {
            this.set(Flags.downloading);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadComplete, () => {
            this.set(Flags.completed);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadPause, () => {
            this.set(Flags.paused);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.downloadStop, () => {
            this.set(Flags.stopped);
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.crawlEmpty, () => {
            this.reset();
        });
    }
    // 检查标题里是否含有标记
    includeFlag(flag) {
        if (!flag) {
            // 没有传递标记，则检查所有标记
            for (const value of Object.values(Flags)) {
                const str = `[${value}]`;
                if (document.title.includes(str)) {
                    return true;
                }
            }
        }
        else {
            // 否则检查指定标记
            const str = `[${flag}]`;
            return document.title.includes(str);
        }
        return false;
    }
    // 重设 title
    reset() {
        clearInterval(this.timer);
        const metaTagPage = [
            _PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].list.Artwork,
            _PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].list.UserHome,
            _PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].list.Novel,
        ];
        // 从 og:title 标签获取标题。og:title 标签是最早更新标题的。但不确定是否在所有页面上都可以直接使用 og:title 标签的内容，所以这里只在部分页面上使用
        if (metaTagPage.includes(_PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].type)) {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
                document.title = ogTitle.content;
                return;
            }
        }
        // 去掉 title 里的标记
        const index = document.title.indexOf(']');
        document.title = document.title.substr(index + 1, document.title.length);
    }
    // 在标题上显示指定标记
    set(flag) {
        const str = `[${flag}]`;
        // 如果 title 里没有标记，就添加标记
        if (!this.includeFlag()) {
            document.title = `${str} ${document.title}`;
        }
        else {
            // 如果已经有标记了，则替换为新当前传入的标记
            document.title = document.title.replace(/\[.?\]/, str);
        }
        // 可以开始下载，或者等待下一步操作，进行闪烁提醒
        if (flag === Flags.readyDownload || flag === Flags.waiting) {
            this.flashing(flag);
        }
        else {
            clearInterval(this.timer);
        }
    }
    // 闪烁提醒，把给定的标记替换成空白，来回切换
    flashing(flag) {
        clearInterval(this.timer);
        const str = `[${flag}]`;
        const whiteSpace = `[${Flags.space}]`;
        this.timer = window.setInterval(() => {
            if (this.includeFlag(flag)) {
                // 如果含有标记，就替换成空白
                document.title = document.title.replace(str, whiteSpace);
            }
            else {
                if (this.includeFlag(Flags.space)) {
                    // 如果含有空白，就替换成标记
                    document.title = document.title.replace(whiteSpace, str);
                }
                else {
                    // 如果都没有，一般是页面切换了，标题被重置了，取消闪烁
                    clearInterval(this.timer);
                }
            }
        }, 500);
    }
}
new showStatusOnTitle();


/***/ }),

/***/ "./src/ts/filter/BlackandWhiteImage.ts":
/*!*********************************************!*\
  !*** ./src/ts/filter/BlackandWhiteImage.ts ***!
  \*********************************************/
/*! exports provided: blackAndWhiteImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blackAndWhiteImage", function() { return blackAndWhiteImage; });
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");

// 检查图片是否是黑白图片
// 获取图片中 rgb 三色的平均值，如果很接近就判断为黑白图片
// 这是一个不太可靠的方法，在少数情况下，彩色图片可能会被误判为黑白图片
class BlackAndWhiteImage {
    constructor() {
        this.latitude = 1; // 宽容度
    }
    async check(imgUrl) {
        try {
            const img = await this.loadImg(imgUrl);
            const first = this.getResult(this.getColor(img));
            return first;
        }
        catch (error) {
            // loadImg 失败时返回的 reject 会在这里被捕获
            // 直接把这个图片视为彩色图片
            return false;
        }
    }
    // 加载图片
    async loadImg(url) {
        return new Promise(async (resolve, reject) => {
            // 如果传递的是 blobURL 就直接使用
            if (url.startsWith('blob')) {
                resolve(_utils_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].loadImg(url));
            }
            else {
                // 不是 blobURL 的话先获取图片
                const res = await fetch(url).catch((error) => {
                    // fetch 加载图片可能会失败 TypeError: Failed to fetch
                    console.log(`Load image error! url: ${url}`);
                });
                // 如果 fetch 加载图片失败，res 会是 undefined
                if (!res) {
                    return reject();
                }
                const blob = await res.blob();
                const blobURL = URL.createObjectURL(blob);
                resolve(_utils_Utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].loadImg(blobURL));
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

/***/ "./src/ts/filter/BlockTagsForSpecificUser.ts":
/*!***************************************************!*\
  !*** ./src/ts/filter/BlockTagsForSpecificUser.ts ***!
  \***************************************************/
/*! exports provided: blockTagsForSpecificUser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blockTagsForSpecificUser", function() { return blockTagsForSpecificUser; });
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");









// 针对特定用户屏蔽 tag
class BlockTagsForSpecificUser {
    constructor() {
        this.rules = [];
        this._addWrapShow = false;
        this.wrapHTML = `
  <div class="blockTagsForSpecificUserWrap">

    <div class="controlBar">
      <button type="button" class="textButton expand">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_收起')}</button>
      <span class="total">0</span>
      <button type="button" class="textButton showAdd">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_添加')}</button>
    </div>

    <div class="addWrap">
      <div class="settingItem addInputWrap" >
        <div class="inputItem uid">
          <span class="label uidLabel">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_用户id')}</span>
          <input type="text" class="setinput_style1 blue addUidInput" placeholder="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_必须是数字')}" />
        </div>

        <div class="inputItem tags">
          <span class="label tagsLabel">Tags</span>
          <input type="text" class="setinput_style1 blue addTagsInput" placeholder="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_tag用逗号分割')}" />
        </div>

        <div class="btns">
          <button type="button" class="textButton add" title="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_添加')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wanchengqueding"></use>
            </svg>
          </button>

          
          <button type="button" class="textButton cancel" title="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_取消')}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-guanbiquxiao"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="listWrap">
    </div>
  </div>
  `;
        this.getRule();
        this.createWrap();
        this.createAllList();
        _Theme__WEBPACK_IMPORTED_MODULE_6__["theme"].register(this.wrap);
        this.listWrapShow = this.listWrapShow;
        this.updateWrapDisplay();
        this.showTotal();
        this.bindEvents();
    }
    set addWrapShow(val) {
        this._addWrapShow = val;
        this.addWrap.style.display = val ? 'block' : 'none';
        if (!val) {
            this.addInputUid.value = '';
            this.addInputTags.value = '';
        }
    }
    get addWrapShow() {
        return this._addWrapShow;
    }
    set listWrapShow(val) {
        Object(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["setSetting"])('blockTagsForSpecificUserShowList', val);
        this.listWrap.style.display = val ? 'block' : 'none';
        this.expandBtn.textContent = val
            ? _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_收起')
            : _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_展开');
    }
    get listWrapShow() {
        return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockTagsForSpecificUserShowList;
    }
    // 创建列表外部的容器，静态html
    createWrap() {
        this.wrap = _Tools__WEBPACK_IMPORTED_MODULE_0__["Tools"].useSlot('blockTagsForSpecificUser', this.wrapHTML);
        this.expandBtn = this.wrap.querySelector('.expand');
        this.showAddBtn = this.wrap.querySelector('.showAdd');
        this.totalSpan = this.wrap.querySelector('.total');
        this.addWrap = this.wrap.querySelector('.addWrap');
        this.addInputUid = this.wrap.querySelector('.addUidInput');
        this.addInputTags = this.wrap.querySelector('.addTagsInput');
        this.addBtn = this.wrap.querySelector('.add');
        this.cancelBtn = this.wrap.querySelector('.cancel');
        this.listWrap = this.wrap.querySelector('.listWrap');
        // 展开/折叠
        this.expandBtn.addEventListener('click', () => {
            this.listWrapShow = !this.listWrapShow;
            if (this.listWrapShow && this.rules.length === 0) {
                _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
            }
        });
        // 切换显示添加区域
        this.showAddBtn.addEventListener('click', () => {
            this.addWrapShow = !this.addWrapShow;
            if (this.addWrapShow) {
                this.addInputUid.focus();
            }
        });
        // 添加规则的按钮
        this.addBtn.addEventListener('click', () => {
            this.addRule(this.addInputUid.value, this.addInputTags.value);
        });
        // 取消添加的按钮
        this.cancelBtn.addEventListener('click', () => {
            this.addWrapShow = false;
        });
    }
    // 根据规则动态创建 html
    createAllList() {
        for (const data of this.rules) {
            this.createList(data);
        }
    }
    // 创建规则对应的元素，并绑定事件
    createList(data) {
        const { uid, user, tags } = data;
        const html = `
    <div class="settingItem" data-key="${uid}">
      <div class="inputItem uid">
        <span class="label uidLabel">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_用户id')}</span>
        <input type="text" class="setinput_style1 blue" data-uidInput="${uid}" value="${uid}" />
      </div>

      <div class="inputItem tags">
        <span class="label tagsLabel">Tags</span>
        <input type="text" class="setinput_style1 blue" data-tagsInput="${uid}" value="${tags.toString()}" />
      </div>

      <div class="btns">

        <button type="button" class="textButton" data-updateRule="${uid}" title="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_更新')}">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengxin"></use>
          </svg>
        </button>

        <button type="button" class="textButton" data-deleteRule="${uid}" title="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_删除')}">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shanchu1"></use>
          </svg>
        </button>
      </div>
    </div>`;
        // 倒序显示，早添加的处于底部，晚添加的处于顶部
        this.listWrap.insertAdjacentHTML('afterbegin', html);
        const uidLabel = this.listWrap.querySelector('.uidLabel');
        if (user) {
            uidLabel.textContent = user;
        }
        else {
            this.updateUserName(data);
        }
        const updateRule = this.listWrap.querySelector(`button[data-updateRule='${uid}']`);
        const deleteRule = this.listWrap.querySelector(`button[data-deleteRule='${uid}']`);
        const uidInput = this.listWrap.querySelector(`input[data-uidInput='${uid}']`);
        const tagsInput = this.listWrap.querySelector(`input[data-tagsInput='${uid}']`);
        [uidInput, tagsInput].forEach((el) => {
            el === null || el === void 0 ? void 0 : el.addEventListener('change', () => {
                if (el.value) {
                    this.updateRule(uid, uidInput.value, tagsInput.value, false);
                }
            });
        });
        // 更新按钮
        updateRule === null || updateRule === void 0 ? void 0 : updateRule.addEventListener('click', () => {
            this.updateRule(uid, uidInput.value, tagsInput.value);
        });
        // 删除按钮
        deleteRule === null || deleteRule === void 0 ? void 0 : deleteRule.addEventListener('click', () => {
            this.deleteRule(uid);
        });
    }
    // 如果某个规则没有用户名，就获取用户名储存起来
    async updateUserName(data) {
        const profile = await _API__WEBPACK_IMPORTED_MODULE_5__["API"].getUserProfile(data.uid.toString()).catch((err) => {
            console.log(err);
        });
        if (profile && profile.body.name) {
            const name = profile.body.name;
            const index = this.findIndex(data.uid);
            if (index > -1) {
                this.rules[index].user = name;
                Object(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["setSetting"])('blockTagsForSpecificUserList', [...this.rules]);
                // 显示到页面上
                const listElement = this.listWrap.querySelector(`.settingItem[data-key='${data.uid}']`);
                if (listElement) {
                    const label = listElement.querySelector('.uidLabel');
                    label && (label.textContent = name);
                }
            }
        }
    }
    // 检查用户输入的值
    checkValue(uidInput, tagsInput) {
        const tags = _utils_Utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].string2array(tagsInput);
        if (!uidInput || !tagsInput || tags.length === 0) {
            _MsgBox__WEBPACK_IMPORTED_MODULE_8__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_必填项不能为空'));
            return false;
        }
        const uid = Number.parseInt(uidInput);
        if (!uid || isNaN(uid)) {
            _MsgBox__WEBPACK_IMPORTED_MODULE_8__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_用户ID必须是数字'));
            return false;
        }
        return {
            uid,
            tags,
        };
    }
    findIndex(uid) {
        return this.rules.findIndex((rule) => rule.uid === uid);
    }
    // 添加规则
    addRule(uidInput, tagsInput) {
        const check = this.checkValue(uidInput, tagsInput);
        if (!check) {
            return;
        }
        const { uid, tags } = check;
        // 查找这个用户是否已经被添加过，如果添加过，则改为更新，而不是添加新规则
        const index = this.findIndex(uid);
        if (index > -1) {
            // 把两次的 tag 合并起来
            const joinTags = this.rules[index].tags.concat(tags);
            return this.updateRule(uid, uid.toString(), joinTags.toString());
        }
        this.rules.push(check);
        Object(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["setSetting"])('blockTagsForSpecificUserList', [...this.rules]);
        this.createList({
            uid,
            tags,
            user: '',
        });
        this.addWrapShow = false;
        this.listWrapShow = true;
        _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_添加成功'));
    }
    // 更新规则
    // tip 表示是否用消息框进行提示。当用户点击了更新按钮时应该显示提示；输入内容变化导致的自动更新可以不显示提示
    updateRule(oldUid, uidInput, tagsInput, tip = true) {
        const check = this.checkValue(uidInput, tagsInput);
        if (!check) {
            return;
        }
        const { uid, tags } = check;
        const index = this.findIndex(oldUid);
        this.rules[index] = check;
        Object(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["setSetting"])('blockTagsForSpecificUserList', [...this.rules]);
        const listElement = this.listWrap.querySelector(`.settingItem[data-key='${oldUid}']`);
        listElement === null || listElement === void 0 ? void 0 : listElement.remove();
        this.createList({ uid, tags, user: '' });
        if (tip) {
            _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_更新成功'));
        }
        this.addWrapShow = false;
    }
    // 删除规则
    deleteRule(uid) {
        const index = this.findIndex(uid);
        this.rules.splice(index, 1);
        Object(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["setSetting"])('blockTagsForSpecificUserList', [...this.rules]);
        const listElement = this.listWrap.querySelector(`.settingItem[data-key='${uid}']`);
        listElement === null || listElement === void 0 ? void 0 : listElement.remove();
    }
    getRule() {
        this.rules = [..._setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockTagsForSpecificUserList];
    }
    updateWrapDisplay() {
        this.wrap.style.display = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockTagsForSpecificUser
            ? 'block'
            : 'none';
    }
    showTotal() {
        this.totalSpan.textContent = this.rules.length.toString();
    }
    bindEvents() {
        // 选项变化
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name.includes('blockTagsForSpecificUser')) {
                this.showTotal();
                this.updateWrapDisplay();
            }
        });
        // 选项重置
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.resetSettingsEnd, () => {
            this.getRule();
            this.listWrap.innerHTML = '';
            this.createAllList();
            this.listWrapShow = this.listWrapShow;
        });
    }
    // 如果找到了符合的记录，则返回 true
    check(uid, tags) {
        if (typeof uid === 'string') {
            uid = Number.parseInt(uid);
        }
        // 查找有无记录
        const index = this.findIndex(uid);
        if (index === -1) {
            return false;
        }
        // 如果有记录则判断是否有相同的 tag，有任意一个就返回
        const rule = this.rules[index];
        const tagsString = tags.toString().toLowerCase();
        for (const tag of rule.tags) {
            if (tagsString.includes(tag.toLowerCase())) {
                return true;
            }
        }
        // 没有相同的 tag
        return false;
    }
}
const blockTagsForSpecificUser = new BlockTagsForSpecificUser();



/***/ }),

/***/ "./src/ts/filter/Filter.ts":
/*!*********************************!*\
  !*** ./src/ts/filter/Filter.ts ***!
  \*********************************/
/*! exports provided: filter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return filter; });
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _BlackandWhiteImage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BlackandWhiteImage */ "./src/ts/filter/BlackandWhiteImage.ts");
/* harmony import */ var _Mute__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Mute */ "./src/ts/filter/Mute.ts");
/* harmony import */ var _BlockTagsForSpecificUser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./BlockTagsForSpecificUser */ "./src/ts/filter/BlockTagsForSpecificUser.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");









// 检查作品是否符合过滤条件
class Filter {
    constructor() {
        // 检查收藏数要求
        this.oneDayTime = 24 * 60 * 60 * 1000; // 一天的毫秒数
        this.minimumTime = 4 * 60 * 60 * 1000; // 检查日均收藏数量时，要求作品发表之后经过的时间大于这个值。因为发表之后经过时间很短的作品，其日均收藏数量非常不可靠，所以对于小于这个值的作品不进行日均收藏数量的检查。
        // 检查文件体积
        this.MiB = 1024 * 1024;
        this.bindEvents();
    }
    // 对启用了的过滤选项输出提示
    showTip() {
        this.getDownType();
        this.getDownTypeByAge();
        this.getDownTypeByImgCount();
        this.getDownTypeByColor();
        this.getDownTypeByBmked();
        this.getMultiImageWorkImageLimit();
        this.getBMKNum();
        this.getSetWh();
        this.getRatio();
        this.getIdRange();
        this.getPostDate();
        this.getIncludeTag();
        this.getExcludeTag();
        if (_store_States__WEBPACK_IMPORTED_MODULE_3__["states"].debut) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_抓取首次登场的作品Title'));
        }
        this.getBlockList();
        this.getSize();
    }
    // 检查作品是否符合过滤器的要求
    // 注意：这是一个异步函数，所以要使用 await 获取检查结果
    // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
    // 每个过滤器函数里都必须检查参数为 undefined 的情况
    // 每个过滤器函数必须返回一个 boolean 值，true 表示保留这个作品，false 表示排除这个作品
    async check(option) {
        // 检查下载的作品类型设置
        if (!this.checkDownType(option.workType)) {
            return false;
        }
        if (!this.checkDownTypeByAge(option.xRestrict)) {
            return false;
        }
        // 检查单图、多图的下载
        if (!this.checkPageCount(option.workType, option.pageCount)) {
            return false;
        }
        // 检查单图、多图的下载
        if (!this.checkMultiImageWorkImageLimit(option.workType, option.pageCount)) {
            return false;
        }
        // 检查收藏和未收藏的要求
        if (!this.checkDownTypeByBmked(option.bookmarkData)) {
            return false;
        }
        // 检查收藏数要求
        if (!this.checkBMK(option.bookmarkCount, option.createDate)) {
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
        // 检查用户在 Pixiv 的屏蔽设定
        if (!(await this.checkMuteUser(option.userId))) {
            return false;
        }
        if (!(await this.checkMuteTag(option.tags))) {
            return false;
        }
        // 检查用户阻止名单
        if (!this.checkBlockList(option.userId)) {
            return false;
        }
        // 检查针对特定用户屏蔽的 tags
        if (!this.checkBlockTagsForSpecificUser(option.userId, option.tags)) {
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
        // 这一步需要加载图片，需要较长的时间，较多的资源占用，所以放到最后检查
        if (!(await this.checkBlackWhite(option.mini))) {
            return false;
        }
        return true;
    }
    // ---------------- get ----------------
    // 提示下载的作品类型设置
    getDownType() {
        // 如果全部排除则取消任务
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType0 &&
            !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType1 &&
            !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType2 &&
            !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType3) {
            this.showWarning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除了所有作品类型'));
        }
        const tips = [];
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType0 && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_插画'));
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType1 && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_漫画'));
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType2 && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_动图'));
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType3 && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_小说'));
        if (tips.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除作品类型') + tips.toString());
        }
    }
    getDownTypeByAge() {
        // 如果全部排除则取消任务
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downAllAges && !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downR18 && !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downR18G) {
            this.showWarning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除了所有作品类型'));
        }
        const tips = [];
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downAllAges && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_全年龄'));
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downR18 && tips.push('R-18');
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downR18G && tips.push('R-18G');
        if (tips.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除作品类型') + tips.toString());
        }
    }
    getDownTypeByImgCount() {
        const tips = [];
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downSingleImg && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_单图作品'));
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downMultiImg && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图作品'));
        if (tips.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除作品类型') + tips.toString());
        }
    }
    // 提示图像颜色设置
    getDownTypeByColor() {
        // 如果全部排除则取消任务
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downColorImg && !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBlackWhiteImg) {
            this.showWarning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除了所有作品类型'));
        }
        const tips = [];
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downColorImg && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_彩色图片'));
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBlackWhiteImg && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_黑白图片'));
        if (tips.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除作品类型') + tips.toString());
        }
    }
    // 提示下载收藏和未收藏作品的设置
    getDownTypeByBmked() {
        // 如果全部排除则取消任务
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downNotBookmarked && !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBookmarked) {
            this.showWarning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除了所有作品类型'));
        }
        const tips = [];
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downNotBookmarked && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_未收藏'));
        !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBookmarked && tips.push(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_已收藏'));
        if (tips.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_排除作品类型') + tips.toString());
        }
    }
    // 提示多图作品的图片数量限制
    getMultiImageWorkImageLimit() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].multiImageWorkImageLimitSwitch) {
            return;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].multiImageWorkImageLimit > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_多图作品的图片数量限制') +
                '：' +
                _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].multiImageWorkImageLimit);
        }
    }
    // 提示必须包含的tag
    getIncludeTag() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].needTagSwitch) {
            return;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].needTag.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置了必须tag之后的提示') + _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].needTag.toString());
        }
    }
    // 提示要排除的tag
    getExcludeTag() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].notNeedTagSwitch) {
            return;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].notNeedTag.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置了排除tag之后的提示') + _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].notNeedTag.toString());
        }
    }
    // 提示宽高设置
    getSetWh() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWHSwitch) {
            return;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWidth || _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setHeight) {
            const andOr = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWidthAndOr
                .replace('|', _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_或者'))
                .replace('&', _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_并且'));
            const text = `${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_宽度')} ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].widthHeightLimit} ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWidth} ${andOr} ${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_高度')} ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].widthHeightLimit} ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setHeight}`;
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(text);
        }
    }
    // 提示输入的收藏数
    getBMKNum() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumSwitch) {
            return;
        }
        const min = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumMin;
        const max = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumMax;
        const average = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumAverage;
        if (min >= 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_收藏数大于') + min);
        }
        if (max >= 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_收藏数小于') + max);
        }
        if (average >= 0 && _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumAverageSwitch) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(`${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_日均收藏数量')} >= ${average}`);
        }
    }
    // 提示宽高比设置
    getRatio() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].ratioSwitch) {
            return '0';
        }
        let result = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].ratio;
        if (result === 'square') {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置了宽高比之后的提示', _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_正方形')));
        }
        else if (result === 'horizontal') {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置了宽高比之后的提示', _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_横图')));
        }
        else if (result === 'vertical') {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_设置了宽高比之后的提示', _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_竖图')));
        }
        else if (result === 'userSet') {
            // 由用户输入
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_输入宽高比') + _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].userRatio);
        }
        return result;
    }
    // 提示 id 范围设置
    getIdRange() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].idRangeSwitch) {
            return;
        }
        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(`id ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].idRange} ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].idRangeInput}`);
    }
    // 提示投稿时间设置
    getPostDate() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDate) {
            return;
        }
        if (isNaN(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDateStart) || isNaN(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDateStart)) {
            const msg = 'Date format error!';
            this.showWarning(msg);
        }
        else {
            const start = new Date(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDateStart).toLocaleString();
            const end = new Date(_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDateEnd).toLocaleString();
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(`${_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_时间范围')}: ${start} - ${end}`);
        }
    }
    // 提示文件体积设置
    getSize() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].sizeSwitch) {
            return;
        }
        _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(`Size: ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].sizeMin}MiB - ${_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].sizeMax}MiB`);
    }
    getBlockList() {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].userBlockList) {
            return;
        }
        for (const uid of _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockList) {
            if (isNaN(Number.parseInt(uid))) {
                return this.showWarning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_用户ID必须是数字'));
            }
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockList.length > 0) {
            _Log__WEBPACK_IMPORTED_MODULE_1__["log"].warning(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_用户阻止名单') + ': ' + _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockList.toString());
        }
    }
    // ---------------- check ----------------
    // 检查下载的作品类型设置
    checkDownType(workType) {
        switch (workType) {
            case 0:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType0;
            case 1:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType1;
            case 2:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType2;
            case 3:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downType3;
            default:
                return true;
        }
    }
    checkDownTypeByAge(xRestrict) {
        switch (xRestrict) {
            case 0:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downAllAges;
            case 1:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downR18;
            case 2:
                return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downR18G;
            default:
                return true;
        }
    }
    // 检查多图作品的图片数量限制
    checkMultiImageWorkImageLimit(workType, pageCount) {
        // 此过滤条件只检查插画和漫画，只对多图作品生效。如果图片数量小于 2 则不检查
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].multiImageWorkImageLimitSwitch ||
            _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].multiImageWorkImageLimit < 1 ||
            pageCount === undefined ||
            pageCount < 2 ||
            (workType !== 0 && workType !== 1)) {
            return true;
        }
        return pageCount <= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].multiImageWorkImageLimit;
    }
    // 依据图片数量，检查下载的作品类型
    checkPageCount(workType, pageCount) {
        if (workType === undefined || pageCount === undefined) {
            return true;
        }
        // 将动图视为单图
        if (workType === 2) {
            pageCount = 1;
        }
        if (pageCount === 1) {
            return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downSingleImg;
        }
        if (pageCount > 1) {
            return _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downMultiImg;
        }
        return false;
    }
    // 检查过滤黑白图像设置
    async checkBlackWhite(imgUrl) {
        // 如果没有图片网址，或者没有排除任何一个选项，则不检查
        if (!imgUrl || (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downColorImg && _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBlackWhiteImg)) {
            return true;
        }
        // result 为 true，表示它是黑白图片，false 是彩色图片
        const result = await _BlackandWhiteImage__WEBPACK_IMPORTED_MODULE_5__["blackAndWhiteImage"].check(imgUrl);
        return ((result && _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBlackWhiteImg) ||
            (!result && _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downColorImg));
    }
    // 检查作品是否符合已收藏、未收藏作品的设置
    checkDownTypeByBmked(bookmarked) {
        // 如果没有参数，或者都没有排除
        if (bookmarked === undefined) {
            return true;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downNotBookmarked && _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBookmarked) {
            return true;
        }
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downNotBookmarked && _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBookmarked) {
            // 只下载已收藏
            return !!bookmarked;
        }
        else if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downNotBookmarked && !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].downBookmarked) {
            // 只下载未收藏
            return !bookmarked;
        }
        return false;
    }
    checkBMK(bmk, date) {
        if (bmk === undefined || !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumSwitch) {
            return true;
        }
        // 检查收藏数量是否达到设置的最大值、最小值范围
        const checkNumber = bmk >= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumMin && bmk <= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumMax;
        // 如果没有设置检查日均收藏，就直接返回收藏数量的检查结果
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumAverageSwitch || date === undefined) {
            return checkNumber;
        }
        // 检查日均收藏
        const createTime = new Date(date).getTime();
        const nowTime = new Date().getTime();
        // 如果作品发表时间太短（小于 4 小时）
        if (nowTime - createTime < this.minimumTime) {
            // 如果 4 小时里的收藏数量已经达到要求，则保留这个作品
            // 如果 4 小时里的收藏数量没有达到要求，则不检查继续它的日均收藏数量，返回收藏数量的检查结果
            return bmk >= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumAverage ? true : checkNumber;
        }
        const day = (nowTime - createTime) / this.oneDayTime; // 计算作品发表以来的天数
        const average = bmk / day;
        const checkAverage = average >= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].BMKNumAverage;
        // 返回结果。收藏数量和日均收藏并不互斥，两者只要有一个满足条件就会保留这个作品
        return checkNumber || checkAverage;
    }
    // 检查作品是否符合包含 tag 的条件。返回值表示是否保留这个作品。
    checkIncludeTag(tags) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].needTagSwitch ||
            _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].needTag.length === 0 ||
            tags === undefined) {
            return true;
        }
        let result = false;
        // 把设置的包含的 tag 转换成小写，生成数组
        const needTags = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].needTag.map((val) => {
            return val.toLowerCase();
        });
        // 如果设置了必须的 tag
        if (needTags.length > 0) {
            // 把处理的 tag 变成小写，并且去重
            // 如果不区分大小写的话，Fate/grandorder 和 Fate/GrandOrder 会被算作符合两个 tag，所以用 Set 结构去重。测试 id 51811780
            const workTags = new Set();
            for (const tag of tags) {
                workTags.add(tag.toLowerCase());
            }
            // 全部包含
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].needTagMode === 'all') {
                let tagNeedMatched = 0;
                for (const tag of workTags) {
                    for (const need of needTags) {
                        if (tag === need) {
                            tagNeedMatched++;
                            break;
                        }
                    }
                }
                // 如果全部匹配
                if (tagNeedMatched >= needTags.length) {
                    result = true;
                }
            }
            else {
                // 包含任意一个
                for (const tag of workTags.values()) {
                    if (needTags.includes(tag)) {
                        result = true;
                        break;
                    }
                }
            }
        }
        else {
            result = true;
        }
        return result;
    }
    // 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否保留这个作品。
    checkExcludeTag(tags) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].notNeedTagSwitch ||
            _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].notNeedTag.length === 0 ||
            tags === undefined) {
            return true;
        }
        const notNeedTags = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].notNeedTag.map((str) => str.toLowerCase());
        for (const tag of tags) {
            for (const notNeed of notNeedTags) {
                // 部分匹配
                if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].tagMatchMode === 'partial') {
                    if (tag.toLowerCase().includes(notNeed)) {
                        // 如果检查到了排除的 tag，进行复查
                        // 使用空格对 tag 进行分词，尝试提高准确率
                        // 例如：用户本意是排除腐向作品（bl），但是如果作品的 tag 是 Strike the Blood 或者 Blue Poison 都会导致作品被排除。这是错误的。
                        // 所以在有分词的情况下，应当对分词进行全等匹配以提高准确度
                        const words = tag.split(' ');
                        if (words.length > 1) {
                            // 如果 tag 有空格，依次使用每个分词进行全词匹配。如果有任一一个 tag 被匹配到则排除这个作品
                            if (words.some((word) => word.toLowerCase() === notNeed)) {
                                return false;
                            }
                        }
                        else {
                            // 如果 tag 没有空格，直接返回结果
                            return false;
                        }
                    }
                }
                else {
                    // 全词匹配
                    if (tag.toLowerCase() === notNeed) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // 检查作品是否符合过滤宽高的条件
    checkSetWh(width, height) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWHSwitch) {
            return true;
        }
        // 缺少必要的参数
        if (width === undefined || height === undefined) {
            return true;
        }
        const setWidth = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWidth;
        const setHeight = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setHeight;
        // 未设置宽高，或者设置的宽高都不合法
        if (setWidth === 0 && setHeight === 0) {
            return true;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].widthHeightLimit === '>=') {
            // 大于等于
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWidthAndOr === '&') {
                return width >= setWidth && height >= setHeight;
            }
            else {
                return width >= setWidth || height >= setHeight;
            }
        }
        else if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].widthHeightLimit === '<=') {
            // 小于等于
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWidthAndOr === '&') {
                return width <= setWidth && height <= setHeight;
            }
            else {
                return width <= setWidth || height <= setHeight;
            }
        }
        else {
            // 精确等于
            if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].setWidthAndOr === '&') {
                return width === setWidth && height === setHeight;
            }
            else {
                return width === setWidth || height === setHeight;
            }
        }
    }
    // 检查作品是否符合宽高比条件
    checkRatio(width, height) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].ratioSwitch) {
            return true;
        }
        if (width === undefined || height === undefined) {
            return true;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].ratio === 'square') {
            return width === height;
        }
        else if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].ratio === 'horizontal') {
            return width / height > 1;
        }
        else if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].ratio === 'vertical') {
            return width / height < 1;
        }
        else {
            return width / height >= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].userRatio;
        }
    }
    // 检查 id 范围设置
    checkIdRange(id) {
        if (id === undefined || !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].idRangeSwitch) {
            return true;
        }
        const setId = _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].idRangeInput;
        let nowId;
        if (typeof id !== 'number') {
            nowId = parseInt(id);
        }
        else {
            nowId = id;
        }
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].idRange === '>') {
            return nowId > setId;
        }
        else {
            return nowId < setId;
        }
    }
    // 检查投稿时间设置
    checkPostDate(date) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDate || date === undefined) {
            return true;
        }
        const nowDate = new Date(date);
        return (nowDate.getTime() >= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDateStart &&
            nowDate.getTime() <= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].postDateEnd);
    }
    // 检查首次登场设置
    // yes_rank 是昨日排名，如果为 0，则此作品是“首次登场”的作品
    checkDebut(yes_rank) {
        if (!_store_States__WEBPACK_IMPORTED_MODULE_3__["states"].debut || yes_rank === undefined) {
            return true;
        }
        return yes_rank === 0;
    }
    checkBlockList(userId) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].userBlockList || userId === undefined) {
            return true;
        }
        // 如果阻止名单里有这个用户 id，则返回 false 表示阻止这个作品
        return !_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockList.includes(userId);
    }
    checkSize(size) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].sizeSwitch || size === undefined) {
            return true;
        }
        return (size >= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].sizeMin * this.MiB && size <= _setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].sizeMax * this.MiB);
    }
    async checkMuteUser(userId) {
        if (userId === undefined) {
            return true;
        }
        return !(await _Mute__WEBPACK_IMPORTED_MODULE_6__["mute"].checkUser(userId));
    }
    async checkMuteTag(tags) {
        if (tags === undefined) {
            return true;
        }
        // 一旦检查到某个 tag 存在于 mute 列表里，就排除这个作品
        for (const tag of tags) {
            if (await _Mute__WEBPACK_IMPORTED_MODULE_6__["mute"].checkTag(tag)) {
                return false;
            }
        }
        return true;
        // return !(tags.some((mute.checkTag.bind(mute))))
    }
    checkBlockTagsForSpecificUser(userId, tags) {
        if (!_setting_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].blockTagsForSpecificUser ||
            userId === undefined ||
            tags === undefined) {
            return true;
        }
        // 对结果取反
        return !_BlockTagsForSpecificUser__WEBPACK_IMPORTED_MODULE_7__["blockTagsForSpecificUser"].check(userId, tags);
    }
    // 如果设置项的值不合法，则显示提示
    showWarning(msg) {
        _EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].fire('wrongSetting');
        _MsgBox__WEBPACK_IMPORTED_MODULE_8__["msgBox"].error(msg);
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].list.crawlStart, () => {
            this.showTip();
        });
    }
}
const filter = new Filter();



/***/ }),

/***/ "./src/ts/filter/Mute.ts":
/*!*******************************!*\
  !*** ./src/ts/filter/Mute.ts ***!
  \*******************************/
/*! exports provided: mute */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mute", function() { return mute; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");



// 获取用户在 Pixiv 里屏蔽的用户和/或 tag，进行过滤
class Mute {
    constructor() {
        this.userList = [];
        this.tagList = [];
        this.got = false; // 是否获取过用户设置
    }
    /**检查传入的 user id 是否包含在用户屏蔽设置里 */
    async checkUser(id) {
        // 检查时，要求至少进行过一次获取用户设置的操作
        if (!this.got) {
            await this.getMuteSettings();
        }
        if (typeof id === 'number') {
            id = id.toString();
        }
        return this.userList.includes(id);
    }
    /**检查传入的 tag 是否包含在用户屏蔽设置里 */
    async checkTag(tag) {
        if (!this.got) {
            await this.getMuteSettings();
        }
        return this.tagList.includes(tag);
    }
    // 此模块不会在初始化时获取设置，这是为了避免增加一次无谓的网络请求
    // 当执行此模块的 check 方法时，如果没有获取过设置，则此模块会主动获取一次设置
    // 其他模块也可以在必要的时候（如开始抓取时）直接执行此方法，预先获取设置，为后面的流程做准备
    async getMuteSettings() {
        this.userList = [];
        this.tagList = [];
        return new Promise(async (resolve, reject) => {
            try {
                const response = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getMuteSettings();
                const items = response.body.mute_items;
                for (const item of items) {
                    // 如果这个屏蔽项未启用，则不保存
                    if (item.enabled === false) {
                        continue;
                    }
                    if (item.type === 'user') {
                        this.userList.push(item.value);
                    }
                    if (item.type === 'tag') {
                        this.tagList.push(item.value);
                    }
                }
                this.got = true;
                return resolve(items);
            }
            catch (error) {
                if (error.status === 401) {
                    _MsgBox__WEBPACK_IMPORTED_MODULE_2__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_提示登录pixiv账号'));
                }
                return reject(error.status);
            }
        });
    }
}
const mute = new Mute();



/***/ }),

/***/ "./src/ts/output/OutputPanel.ts":
/*!**************************************!*\
  !*** ./src/ts/output/OutputPanel.ts ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");








// 输出面板
class OutputPanel {
    constructor() {
        this.addOutPutPanel();
        _Theme__WEBPACK_IMPORTED_MODULE_5__["theme"].register(this.outputPanel);
        this.bindEvents();
    }
    bindEvents() {
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });
        this.outputPanel.addEventListener('click', (e) => {
            const ev = e || window.event;
            ev.stopPropagation();
        });
        document.addEventListener('click', () => {
            if (this.outputPanel.style.display !== 'none') {
                this.close();
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.closeCenterPanel, () => {
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
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.output, (ev) => {
            this.output(ev.detail.data);
        });
    }
    addOutPutPanel() {
        const html = `
    <div class="outputWrap">
    <div class="outputClose" title="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_关闭')}">×</div>
    <div class="outputTitle">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输出信息')}</div>
    <div class="outputContent beautify_scrollbar"></div>
    <div class="outputFooter">
    <button class="outputCopy" title="">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_复制')}</button>
    </div>
    </div>
    `;
        document.body.insertAdjacentHTML('beforeend', html);
        this.outputPanel = document.querySelector('.outputWrap');
        this.outputTitle = this.outputPanel.querySelector('.outputTitle');
        this.outputContent = this.outputPanel.querySelector('.outputContent');
        this.copyBtn = this.outputPanel.querySelector('.outputCopy');
        this.closeBtn = this.outputPanel.querySelector('.outputClose');
    }
    // 输出内容
    output(data) {
        if (!data.content) {
            return _Toast__WEBPACK_IMPORTED_MODULE_7__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_没有数据可供使用'));
        }
        if (_store_Store__WEBPACK_IMPORTED_MODULE_2__["store"].result.length < _config_Config__WEBPACK_IMPORTED_MODULE_4__["Config"].outputMax) {
            this.copyBtn.disabled = false;
            this.outputTitle.textContent = data.title;
            this.outputContent.innerHTML = data.content;
            this.outputPanel.style.display = 'block';
        }
        else {
            // 如果结果较多，则不直接输出，改为保存 txt 文件
            const file = new Blob([data.content], {
                type: 'text/plain',
            });
            const url = URL.createObjectURL(file);
            const fileName = `Output-${new Date().toLocaleString()}.txt`;
            _utils_Utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].downloadFile(url, fileName);
            this.copyBtn.disabled = true;
            _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].warning(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输出内容太多已经为你保存到文件'));
        }
    }
    // 关闭输出面板
    close() {
        this.outputPanel.style.display = 'none';
        this.outputContent.innerHTML = '';
        this.outputTitle.innerText = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输出信息');
    }
}
new OutputPanel();


/***/ }),

/***/ "./src/ts/output/PreviewFileName.ts":
/*!******************************************!*\
  !*** ./src/ts/output/PreviewFileName.ts ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _FileName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../FileName */ "./src/ts/FileName.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");






// 预览文件名
class PreviewFileName {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.previewFileName, () => {
            this.previewFileName();
        });
    }
    previewFileName() {
        if (_store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length === 0) {
            return _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_没有数据可供使用'));
        }
        // 使用数组储存和拼接字符串，提高性能
        const resultArr = [];
        let result = '';
        const length = _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length;
        if (length < _config_Config__WEBPACK_IMPORTED_MODULE_4__["Config"].outputMax) {
            // 输出结果，添加 html 标签
            for (let i = 0; i < length; i++) {
                const data = _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result[i];
                // 生成文件名，并为文件名添加颜色显示
                // 只有当文件数量少于限制值时才添加颜色。这是因为添加颜色会导致生成的 HTML 元素数量增多，渲染和复制时的资源占用增多
                const part = _FileName__WEBPACK_IMPORTED_MODULE_2__["fileName"].getFileName(data).split('/');
                const length = part.length;
                for (let i = 0; i < length; i++) {
                    const str = part[i];
                    if (i < length - 1) {
                        // 如果不是最后一项，说明是文件夹名，添加特定的颜色
                        part[i] = `<span class="colorFolder">${str}</span>`;
                    }
                    else {
                        // 最后一项是文件名，设置为黑色
                        part[i] = `<span class="color000">${str}</span>`;
                    }
                }
                const fullNameHtml = part.join('/');
                if (data.type !== 3) {
                    // 对于图片作品，在文件名前面显示默认文件名
                    // 默认文件名有两种选择，一种是使用 url 里的文件名，一种是使用 data.id。这里使用前者，方便用户用其他下载软件下载后，复制输出的内容制作重命名脚本
                    const defaultName = data.original.replace(/.*\//, '');
                    const nowResult = `<p class="result"><span class="color999">${defaultName}</span>: ${fullNameHtml}</p>`;
                    resultArr.push(nowResult);
                }
                else {
                    // 小说作品不显示原文件名（因为没有此数据）
                    const nowResult = `<p class="result">${fullNameHtml}</p>`;
                    resultArr.push(nowResult);
                }
            }
            result = resultArr.join('');
        }
        else {
            // 不生成 html 标签，只生成纯文本，保存为 txt 文件
            for (let i = 0; i < length; i++) {
                const data = _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result[i];
                const fullName = _FileName__WEBPACK_IMPORTED_MODULE_2__["fileName"].getFileName(data);
                if (data.type !== 3) {
                    // 图片作品，在文件名前面显示文件 url 里的文件名
                    let defaultName = data.original.replace(/.*\//, '');
                    resultArr.push(`${defaultName}: ${fullName}`);
                }
                else {
                    // 小说作品不显示原文件名（因为没有此数据）
                    resultArr.push(fullName);
                }
            }
            result = resultArr.join('\n');
        }
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('output', {
            content: result,
            title: _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_预览文件名'),
        });
    }
}
new PreviewFileName();


/***/ }),

/***/ "./src/ts/output/ShowURLs.ts":
/*!***********************************!*\
  !*** ./src/ts/output/ShowURLs.ts ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");






// 显示 url
class ShowURLs {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.showURLs, () => {
            this.showURLs();
        });
    }
    showURLs() {
        const urls = [];
        const size = _setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].imageSize;
        for (const data of _store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result) {
            // 只输出图片文件的 url
            // 小说文件没有固定的 url 所以不输出
            if (data.type !== 3) {
                urls.push(data[size]);
            }
        }
        if (_store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length === 0 || urls.length === 0) {
            return _Toast__WEBPACK_IMPORTED_MODULE_4__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_没有数据可供使用'));
        }
        let result = '';
        if (_store_Store__WEBPACK_IMPORTED_MODULE_0__["store"].result.length < _config_Config__WEBPACK_IMPORTED_MODULE_5__["Config"].outputMax) {
            result = urls.join('<br>');
        }
        else {
            result = urls.join('\n');
        }
        _EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].fire('output', {
            content: result,
            title: _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_复制url'),
        });
    }
}
new ShowURLs();


/***/ }),

/***/ "./src/ts/pageFunciton/BookmarkAllWorks.ts":
/*!*************************************************!*\
  !*** ./src/ts/pageFunciton/BookmarkAllWorks.ts ***!
  \*************************************************/
/*! exports provided: BookmarkAllWorks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BookmarkAllWorks", function() { return BookmarkAllWorks; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _Bookmark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Bookmark */ "./src/ts/Bookmark.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");






class BookmarkAllWorks {
    constructor(tipWrap) {
        this.idList = [];
        this.bookmarKData = [];
        this.tipWrap = document.createElement('button');
        if (tipWrap) {
            this.tipWrap = tipWrap;
        }
    }
    // 传递 workList，这是作品列表元素的合集。代码会尝试分析每个作品元素中的超链接，提取出作品 id
    // 如果传递的作品是本页面上的作品，可以省略 type。代码会根据页面 url 判断是图片还是小说。
    // 如果传递的作品不是本页面上的，为防止误判，需要显式传递 type
    sendWorkList(list, type) {
        this.reset();
        type = type !== null && type !== void 0 ? type : (window.location.pathname.includes('/novel') ? 'novels' : 'illusts');
        const regExp = type === 'illusts' ? /\/artworks\/(\d*)/ : /\?id=(\d*)/;
        for (const el of list) {
            const a = el.querySelector('a');
            if (a) {
                // "https://www.pixiv.net/artworks/82618568"
                // "https://www.pixiv.net/novel/show.php?id=12350618"
                const test = regExp.exec(a.href);
                if (test && test.length > 1) {
                    this.idList.push({
                        type,
                        id: test[1],
                    });
                }
            }
        }
        this.startBookmark();
    }
    // 直接传递 id 列表
    sendIdList(list) {
        this.reset();
        this.idList = list;
        this.startBookmark();
    }
    reset() {
        this.idList = [];
        this.bookmarKData = [];
    }
    // 启动收藏流程
    async startBookmark() {
        if (this.idList.length === 0) {
            _Toast__WEBPACK_IMPORTED_MODULE_3__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_没有数据可供使用'));
            return;
        }
        this.tipWrap.textContent = `Checking`;
        this.tipWrap.setAttribute('disabled', 'disabled');
        await this.getTagData();
        await this.addBookmarkAll();
        this.complete();
    }
    // 获取每个作品的 tag 数据
    async getTagData() {
        return new Promise(async (resolve) => {
            for (const id of this.idList) {
                this.tipWrap.textContent = `Get data ${this.bookmarKData.length} / ${this.idList.length}`;
                let data;
                if (id.type === 'novels') {
                    data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelData(id.id);
                }
                else {
                    data = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(id.id);
                }
                this.bookmarKData.push({
                    type: id.type,
                    id: data.body.id,
                    tags: _Tools__WEBPACK_IMPORTED_MODULE_5__["Tools"].extractTags(data),
                    restrict: false,
                });
            }
            resolve();
        });
    }
    // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
    async addBookmarkAll() {
        return new Promise(async (resolve) => {
            let index = 0;
            for (const data of this.bookmarKData) {
                this.tipWrap.textContent = `Add bookmark ${index} / ${this.bookmarKData.length}`;
                await _Bookmark__WEBPACK_IMPORTED_MODULE_4__["Bookmark"].add(data.id, data.type, data.tags);
                index++;
            }
            resolve();
        });
    }
    complete() {
        this.tipWrap.textContent = `✓ Complete`;
        this.tipWrap.removeAttribute('disabled');
        _EVT__WEBPACK_IMPORTED_MODULE_2__["EVT"].fire('bookmarkModeEnd');
        _Toast__WEBPACK_IMPORTED_MODULE_3__["toast"].success('✓ Complete');
    }
}



/***/ }),

/***/ "./src/ts/pageFunciton/BookmarksAddTag.ts":
/*!************************************************!*\
  !*** ./src/ts/pageFunciton/BookmarksAddTag.ts ***!
  \************************************************/
/*! exports provided: BookmarksAddTag */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BookmarksAddTag", function() { return BookmarksAddTag; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _Bookmark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Bookmark */ "./src/ts/Bookmark.ts");




// 给收藏页面里的未分类作品批量添加 tag
class BookmarksAddTag {
    constructor(btn) {
        this.type = 'illusts'; // 页面是图片还是小说
        this.addTagList = []; // 需要添加 tag 的作品的数据
        this.addIndex = 0; // 添加 tag 时的计数
        this.once = 100; // 一次请求多少个作品的数据
        this.btn = btn;
        this.bindEvents();
    }
    bindEvents() {
        this.btn.addEventListener('click', () => {
            // 每次点击重置状态
            this.addTagList = [];
            this.addIndex = 0;
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
        let errorFlag = false;
        // 发起请求
        const [showData, hideData] = await Promise.all([
            _API__WEBPACK_IMPORTED_MODULE_0__["API"].getBookmarkData(_Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getUserId(), this.type, '未分類', offset, false),
            _API__WEBPACK_IMPORTED_MODULE_0__["API"].getBookmarkData(_Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getUserId(), this.type, '未分類', offset, true),
        ]).catch((error) => {
            if (error.status && error.status === 403) {
                this.btn.textContent = `× Permission denied`;
            }
            errorFlag = true;
            return [];
        });
        if (errorFlag) {
            return;
        }
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
                this.addTag();
            }
        }
        else {
            // 需要继续获取
            this.readyAddTag(++loop);
        }
    }
    // 给未分类作品添加 tag
    async addTag() {
        const item = this.addTagList[this.addIndex];
        await _Bookmark__WEBPACK_IMPORTED_MODULE_3__["Bookmark"].add(item.id, this.type, item.tags, true, item.restrict);
        if (this.addIndex < this.addTagList.length - 1) {
            this.addIndex++;
            this.btn.textContent = `${this.addIndex} / ${this.addTagList.length}`;
            // 继续添加下一个
            return this.addTag();
        }
        else {
            // 添加完成
            this.btn.textContent = `✓ Complete`;
            this.btn.removeAttribute('disabled');
            _Toast__WEBPACK_IMPORTED_MODULE_2__["toast"].success('✓ Complete');
        }
    }
}



/***/ }),

/***/ "./src/ts/pageFunciton/DeleteWorks.ts":
/*!********************************************!*\
  !*** ./src/ts/pageFunciton/DeleteWorks.ts ***!
  \********************************************/
/*! exports provided: DeleteWorks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteWorks", function() { return DeleteWorks; });
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _store_States__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/States */ "./src/ts/store/States.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
// 删除页面上的作品








class DeleteWorks {
    constructor(worksSelectors) {
        this.worksSelector = ''; // 选择页面上所有作品的选择器
        this.multipleSelector = ''; // 多图作品特有的元素的标识
        this.ugoiraSelector = ''; // 动图作品特有的元素的标识
        this.delMode = false; // 是否处于手动删除作品状态
        this.delBtn = document.createElement('button');
        this.iconId = 'deleteWorkEl';
        this.left = 0;
        this.top = 0;
        this.half = 12;
        this.deleteWorkCallback = () => { }; // 保存手动删除作品的回调函数，因为可能会多次绑定手动删除事件，所以需要保存传入的 callback 备用
        this.worksSelector = worksSelectors;
        this.icon = this.createDeleteIcon();
        this.bindEvents();
    }
    createDeleteIcon() {
        const el = document.createElement('div');
        el.id = this.iconId;
        document.body.appendChild(el);
        return el;
    }
    updateDeleteIcon() {
        if (!this.icon) {
            return;
        }
        this.icon.style.display = this.delMode ? 'block' : 'none';
        // 如果指示图标处于隐藏状态，就不会更新其坐标。这样可以优化性能
        if (this.delMode) {
            this.icon.style.left = this.left - this.half + 'px';
            this.icon.style.top = this.top - this.half + 'px';
        }
    }
    bindEvents() {
        // 作品列表更新后，需要重新给作品绑定手动删除事件
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.worksUpdate, () => {
            if (this.delMode) {
                this.bindDeleteEvent();
            }
        });
        // 切换页面时，退出手动删除模式
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].list.pageSwitch, () => {
            if (this.delMode) {
                this.toggleDeleteMode();
            }
        });
        // 鼠标移动时保存鼠标的坐标
        window.addEventListener('mousemove', (ev) => {
            this.moveEvent(ev);
        }, true);
    }
    // 监听鼠标移动
    moveEvent(ev) {
        this.left = ev.x;
        this.top = ev.y;
        this.updateDeleteIcon();
    }
    // 清除多图作品的按钮
    addClearMultipleBtn(selector, callback = () => { }) {
        this.multipleSelector = selector;
        _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgRed, _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除多图作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除多图作品Title')],
        ]).addEventListener('click', () => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
                _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
                return;
            }
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('closeCenterPanel');
            this.clearMultiple();
            callback();
        }, false);
    }
    // 清除动图作品的按钮
    addClearUgoiraBtn(selector, callback = () => { }) {
        this.ugoiraSelector = selector;
        _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgRed, _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除动图作品'), [
            ['title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除动图作品Title')],
        ]).addEventListener('click', () => {
            if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
                _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
                return;
            }
            _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('closeCenterPanel');
            this.ClearUgoira();
            callback();
        }, false);
    }
    // 手动删除作品的按钮
    addManuallyDeleteBtn(callback = () => { }) {
        this.deleteWorkCallback = callback;
        this.delBtn = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].addBtn('crawlBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgRed, _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_手动删除作品'), [['title', _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_手动删除作品Title')]]);
        this.delBtn.addEventListener('click', () => {
            this.toggleDeleteMode();
        });
    }
    // 切换删除模式
    toggleDeleteMode() {
        this.delMode = !this.delMode;
        this.bindDeleteEvent();
        this.updateDeleteIcon();
        if (this.delMode) {
            this.delBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_退出手动删除');
            setTimeout(() => {
                _EVT__WEBPACK_IMPORTED_MODULE_5__["EVT"].fire('closeCenterPanel');
            }, 100);
        }
        else {
            this.delBtn.textContent = _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_手动删除作品');
        }
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
                    if (_store_States__WEBPACK_IMPORTED_MODULE_4__["states"].busy) {
                        _MsgBox__WEBPACK_IMPORTED_MODULE_6__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_当前任务尚未完成'));
                        return;
                    }
                    const target = ev.currentTarget;
                    target.remove();
                    this.showWorksCount();
                    this.deleteWorkCallback(target);
                }
            };
        });
    }
    // 显示调整后，列表里的作品数量
    showWorksCount() {
        const selector = this.worksSelector;
        _Log__WEBPACK_IMPORTED_MODULE_0__["log"].success(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_调整完毕', _utils_Utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].getVisibleEl(selector).length.toString()), 2, false);
    }
}



/***/ }),

/***/ "./src/ts/pageFunciton/DestroyManager.ts":
/*!***********************************************!*\
  !*** ./src/ts/pageFunciton/DestroyManager.ts ***!
  \***********************************************/
/*! exports provided: destroyManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroyManager", function() { return destroyManager; });
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");


// 管理所有页面的销毁事件
// 页面把自己的 destory 函数注册到这个类里，当页面类型变化时会自动执行对应
class DestroyManager {
    constructor() {
        this.list = new Map();
        this.lastType = _PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].type;
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_1__["EVT"].list.pageSwitchedTypeChange, () => {
            const fun = this.list.get(this.lastType);
            fun && fun();
            this.lastType = _PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].type;
        });
    }
    // 接收 destory 函数，并关联到对应的页面类型
    register(fun) {
        this.list.set(_PageType__WEBPACK_IMPORTED_MODULE_0__["pageType"].type, fun);
    }
}
const destroyManager = new DestroyManager();



/***/ }),

/***/ "./src/ts/pageFunciton/FastScreen.ts":
/*!*******************************************!*\
  !*** ./src/ts/pageFunciton/FastScreen.ts ***!
  \*******************************************/
/*! exports provided: FastScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FastScreen", function() { return FastScreen; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");




// 在搜索页面按收藏数快速筛选
class FastScreen {
    constructor() {
        this.fastScreenArea = document.createElement('div');
        this.tagList = [
            '100users入り',
            '500users入り',
            '1000users入り',
            '5000users入り',
            '10000users入り',
            '20000users入り',
            '30000users入り',
            '50000users入り',
            '100000users入り',
        ];
        this.create();
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'showFastSearchArea') {
                this.setDisplay();
            }
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitchedTypeChange, () => {
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
        this.fastScreenArea.className = 'fastScreenArea';
        this.tagList.forEach((tag) => {
            const btn = document.createElement('button');
            btn.innerText = tag;
            btn.onclick = () => {
                this.openFastScreenLink(tag);
            };
            this.fastScreenArea.appendChild(btn);
        });
        _Theme__WEBPACK_IMPORTED_MODULE_2__["theme"].register(this.fastScreenArea);
        target.insertAdjacentElement('afterend', this.fastScreenArea);
        this.setDisplay();
    }
    // 设置是否显示快速筛选区域
    setDisplay() {
        this.fastScreenArea.style.display = _setting_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].showFastSearchArea
            ? 'block'
            : 'none';
    }
    // 打开快速筛选链接
    openFastScreenLink(fastTag) {
        // 拼接 tag。因为搜索页面可以无刷新切换搜索的 tag，所以需要动态获取当前 tag
        const nowTag = _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getTagFromURL();
        const firstTag = nowTag.split(' ')[0];
        const fullTag = firstTag + ' ' + fastTag;
        // 用组合后的 tag 替换掉当前网址里的 tag
        let newURL = location.href.replace(encodeURIComponent(nowTag), encodeURIComponent(fullTag));
        // 如果 url 路径的 tags/ 后面没有子路径，代表是在“顶部”分类。
        // “顶部”分类里始终是严格的搜索模式，即使添加 s_mode=s_tag 也无效，这经常会导致搜索结果为 0。所以如果分类是“顶部”，就自动修改为“插画·漫画”分类以获取更多搜索结果。
        // “顶部”分类的 url 示例
        // https://www.pixiv.net/tags/%E9%9B%AA%E8%8A%B1%E3%83%A9%E3%83%9F%E3%82%A3%2010000users%E5%85%A5%E3%82%8A?s_mode=s_tag
        const str = new URL(newURL).pathname.split('tags/')[1];
        if (str.includes('/') === false) {
            // 在 tag 后面添加“插画·漫画”分类的路径
            newURL = newURL.replace(str, str + '/artworks');
        }
        // 设置宽松的搜索模式 s_mode=s_tag
        const u = new URL(newURL);
        u.searchParams.set('s_mode', 's_tag');
        location.href = u.toString();
    }
    destroy() {
        this.fastScreenArea.remove();
    }
}



/***/ }),

/***/ "./src/ts/pageFunciton/QuickBookmark.ts":
/*!**********************************************!*\
  !*** ./src/ts/pageFunciton/QuickBookmark.ts ***!
  \**********************************************/
/*! exports provided: QuickBookmark */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuickBookmark", function() { return QuickBookmark; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Token */ "./src/ts/Token.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Bookmark__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Bookmark */ "./src/ts/Bookmark.ts");
// 作品页面内的快速收藏功能






class QuickBookmark {
    constructor() {
        this.btn = document.createElement('a'); // 快速收藏按钮
        this.btnId = 'quickBookmarkEl'; // 快速收藏按钮的 id
        this.redClass = 'bookmarkedColor'; // 收藏后的红色的颜色值
        this.likeBtnClass = '_35vRH4a'; // 点赞按钮的 class
        this.isNovel = false;
        this.timer = 0;
        this.flag = 'xzFlag'; // 当插入快速下载按钮时，给原本的收藏按钮添加一个标记
        this.init();
    }
    async init() {
        // 没有 token 就不能进行收藏
        if (!_Token__WEBPACK_IMPORTED_MODULE_3__["token"].token) {
            return;
        }
        this.isNovel = window.location.href.includes('/novel');
        this.timer = window.setInterval(() => {
            this.initBtn();
        }, 300);
    }
    // 插入快速收藏按钮
    async initBtn() {
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
            // 获取心形收藏按钮的 div
            this.pixivBMKDiv = this.toolbar.childNodes[2];
            // 当没有心形收藏按钮时，中止这次执行（可能是尚未添加；或者是用户处于自己的作品页面）
            if (!this.pixivBMKDiv) {
                return;
            }
            if (!this.isNovel) {
                // 在插画漫画作品页面里，给心形收藏按钮添加标记，标记过的就不再处理
                // 但是在小说页面里不会给心形收藏按钮添加标记，也不会修改它，因为小说页面里切换作品时，工具栏不会重新生成，也就是说小说页面里的心形收藏按钮用的都是一开始的那一个，如果下载器修改了它，就会导致异常
                if (this.pixivBMKDiv.classList.contains(this.flag)) {
                    return;
                }
                else {
                    // 给心形收藏按钮添加标记，表示已经对其进行处理
                    this.pixivBMKDiv.classList.add(this.flag);
                }
            }
            window.clearInterval(this.timer);
            // 删除可能存在的旧的快速收藏按钮
            const oldBtn = this.toolbar.querySelector('#' + this.btnId);
            if (oldBtn) {
                oldBtn.remove();
            }
            // 判断这个作品是否收藏过了
            this.workData = await this.getWorkData();
            this.isBookmarked = !!this.workData.body.bookmarkData;
            // 监听心形收藏按钮从未收藏到收藏的变化
            // 没有收藏时，心形按钮的第一个子元素是 button。收藏之后，button 被移除，然后添加一个 a 标签
            if (!this.isBookmarked) {
                this.ob = new MutationObserver((mutations) => {
                    for (const change of mutations) {
                        if (change.type === 'childList') {
                            const added = change.addedNodes;
                            if (added.length > 0 && added[0].nodeName === 'A') {
                                this.isBookmarked = true;
                                this.bookmarked();
                            }
                        }
                    }
                });
                this.ob.observe(this.pixivBMKDiv, {
                    childList: true,
                });
            }
            // 添加快速收藏按钮
            this.btn = this.createBtn();
            this.toolbar.insertBefore(this.btn, this.toolbar.childNodes[3]);
            if (this.isBookmarked) {
                this.bookmarked();
            }
            else {
                this.btn.addEventListener('click', () => {
                    this.addBookmark();
                });
            }
        }
    }
    //　创建快速收藏按钮
    createBtn() {
        const btn = document.createElement('a');
        btn.id = this.btnId;
        btn.textContent = '✩';
        btn.href = 'javascript:void(0)';
        btn.title = _Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_快速收藏');
        return btn;
    }
    async getWorkData() {
        const id = this.isNovel ? _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getNovelId() : _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getIllustId();
        return this.isNovel
            ? await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getNovelData(id)
            : await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getArtworkData(id);
    }
    async addBookmark() {
        const type = this.isNovel ? 'novels' : 'illusts';
        const id = this.isNovel ? _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getNovelId() : _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getIllustId();
        this.like(type, id);
        if (this.isBookmarked) {
            return;
        }
        await _Bookmark__WEBPACK_IMPORTED_MODULE_5__["Bookmark"].add(id, type, _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].extractTags(this.workData));
        // 收藏成功之后
        this.isBookmarked = true;
        this.bookmarked();
        // 让心形收藏按钮也变成收藏后的状态
        if (!this.isNovel) {
            this.changePixivBMKDiv();
        }
    }
    // 点赞这个作品
    like(type, id) {
        _API__WEBPACK_IMPORTED_MODULE_0__["API"].addLike(id, type, _Token__WEBPACK_IMPORTED_MODULE_3__["token"].token);
        // 不在小说页面里修改点赞按钮，否则切换到其他小说之后点赞按钮依然是蓝色的
        if (this.isNovel) {
            return;
        }
        // 将点赞按钮的颜色改为蓝色
        let likeBtn = document.querySelector(`.${this.likeBtnClass}`);
        if (!likeBtn) {
            // 上面尝试直接用 class 获取点赞按钮，如果获取不到则从工具栏里选择
            // 点赞按钮是工具栏里的最后一个 button 元素
            console.error('likeBtn class is not available');
            const btnList = this.toolbar.querySelectorAll('button');
            likeBtn = btnList[btnList.length - 1];
        }
        likeBtn.style.color = '#0096fa';
    }
    getEditBookmarkLink() {
        if (this.isNovel) {
            return `/novel/bookmark_add.php?id=${_Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getNovelId()}`;
        }
        else {
            return `/bookmark_add.php?type=illust&illust_id=${_Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].getIllustId()}`;
        }
    }
    // 如果这个作品已收藏，则改变快速收藏按钮
    bookmarked() {
        this.btn.classList.add(this.redClass);
        this.btn.href = this.getEditBookmarkLink();
    }
    // 把心形收藏按钮从未收藏变成已收藏
    changePixivBMKDiv() {
        if (!this.pixivBMKDiv) {
            return;
        }
        // 取消监听心形收藏按钮的变化
        if (this.ob) {
            this.ob.disconnect();
        }
        const svg = this.pixivBMKDiv.querySelector('svg');
        if (!svg) {
            return;
        }
        // 这条规则让心形的内部填充，显示出来完整的心。缺少这个规则的话，心形只有边框，内部还是空的
        const redStyle = `
    .${this.redClass} mask path{
      fill: white !important;
    }`;
        _utils_Utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].addStyle(redStyle);
        // 创建一个 a 标签，用它替换掉 button（模拟心形按钮收藏后的变化）
        const a = document.createElement('a');
        a.href = this.getEditBookmarkLink();
        a.appendChild(svg);
        // 移除 button，添加 a 标签
        const btn = this.pixivBMKDiv.querySelector('button');
        btn && btn.remove();
        this.pixivBMKDiv.insertAdjacentElement('afterbegin', a);
        // 给 svg 添加 class，让心形变红
        svg.classList.add(this.redClass);
        // 点击 a 标签时阻止事件冒泡。因为不阻止的话，点击这个 a 标签，pixiv 会进行添加收藏的操作。我的目的是让它跳转到编辑 tag 的页面。
        a.addEventListener('click', (ev) => {
            ev.stopPropagation();
        }, true);
    }
}



/***/ }),

/***/ "./src/ts/pageFunciton/SaveAvatarIcon.ts":
/*!***********************************************!*\
  !*** ./src/ts/pageFunciton/SaveAvatarIcon.ts ***!
  \***********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_imageToIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/imageToIcon */ "./src/ts/utils/imageToIcon.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");







// 保存用户头像为图标
class SaveAvatarIcon {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].list.saveAvatarIcon, () => {
            this.saveAvatarIcon();
        });
    }
    async saveAvatarIcon() {
        const userId = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].getUserId();
        const userProfile = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getUserProfile(userId);
        const bigImg = userProfile.body.imageBig; // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
        const fullSizeImg = bigImg.replace('_170', ''); // 去掉 170 标记，获取头像图片的原图
        // 生成 ico 文件
        // 尺寸固定为 256，因为尺寸更小的图标如 128，在 windows 资源管理器里会被缩小到 48 显示
        const blob = await _utils_imageToIcon__WEBPACK_IMPORTED_MODULE_5__["img2ico"].convert({
            size: [256],
            source: fullSizeImg,
            shape: 'fillet',
            bleed: true,
        });
        // 直接保存到下载文件夹
        const url = URL.createObjectURL(blob);
        const name = `${userProfile.body.name}_${userId}_icon.ico`;
        _utils_Utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].downloadFile(url, name);
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].success('✓ ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_保存用户头像为图标'));
        _EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].fire('closeCenterPanel');
    }
}
new SaveAvatarIcon();


/***/ }),

/***/ "./src/ts/pageFunciton/SaveAvatarImage.ts":
/*!************************************************!*\
  !*** ./src/ts/pageFunciton/SaveAvatarImage.ts ***!
  \************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");






// 保存用户头像
class SaveAvatarImage {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].list.saveAvatarImage, () => {
            this.saveAvatarImage();
        });
    }
    async saveAvatarImage() {
        const userId = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].getUserId();
        const userProfile = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getUserProfile(userId);
        const imageURL = userProfile.body.imageBig;
        // 提取图片的后缀名
        const arr = imageURL.split('.');
        const ext = arr[arr.length - 1];
        // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
        // 如果是 gif 格式，则不生成其大图 url，因为生成的大图是静态图。不知道 gif 头像是否有大图，以及其 url 是什么样的
        // 如果是其他格式，则去掉 170 标记，获取头像图片的原图
        const fullSizeImgURL = ext === 'gif' ? imageURL : imageURL.replace('_170', '');
        // 加载文件
        const img = await fetch(fullSizeImgURL);
        const blob = await img.blob();
        // 直接保存到下载文件夹
        const url = URL.createObjectURL(blob);
        const name = `${userProfile.body.name}_${userId}_avatar.${ext}`;
        _utils_Utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].downloadFile(url, name);
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].success('✓ ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_保存用户头像'));
        _EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].fire('closeCenterPanel');
    }
}
new SaveAvatarImage();


/***/ }),

/***/ "./src/ts/pageFunciton/SaveUserCover.ts":
/*!**********************************************!*\
  !*** ./src/ts/pageFunciton/SaveUserCover.ts ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");







// 保存用户封面图片
class SaveUserCover {
    constructor() {
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].list.saveUserCover, () => {
            this.saveUserCover();
        });
    }
    async saveUserCover() {
        const userId = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].getUserId();
        const userProfile = await _API__WEBPACK_IMPORTED_MODULE_1__["API"].getUserProfile(userId);
        const bgData = userProfile.body.background;
        if (bgData === null) {
            return _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_没有数据可供使用'));
        }
        const bgUrl = bgData.url;
        if (!bgUrl) {
            return _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].error(_Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_没有数据可供使用'));
        }
        // 加载文件
        const img = await fetch(bgUrl);
        const blob = await img.blob();
        // 提取后缀名
        const arr = bgUrl.split('.');
        const ext = arr[arr.length - 1];
        // 直接保存到下载文件夹
        const url = URL.createObjectURL(blob);
        const name = `${userProfile.body.name}_${userId}_cover.${ext}`;
        _utils_Utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].downloadFile(url, name);
        _Log__WEBPACK_IMPORTED_MODULE_2__["log"].success('✓ ' + _Lang__WEBPACK_IMPORTED_MODULE_0__["lang"].transl('_保存用户封面'));
        _EVT__WEBPACK_IMPORTED_MODULE_4__["EVT"].fire('closeCenterPanel');
    }
}
new SaveUserCover();


/***/ }),

/***/ "./src/ts/setting/BG.ts":
/*!******************************!*\
  !*** ./src/ts/setting/BG.ts ***!
  \******************************/
/*! exports provided: BG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BG", function() { return BG; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _utils_IndexedDB__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/IndexedDB */ "./src/ts/utils/IndexedDB.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Settings */ "./src/ts/setting/Settings.ts");




class BG {
    constructor(wrap) {
        this.id = 'xzBG';
        this.flagClassName = 'xzBG';
        this.haveImage = false;
        this.DBName = 'PBDBG';
        this.DBVer = 1;
        this.storeName = 'bg';
        this.keyName = 'bg';
        // 在数据库升级事件里创建表
        this.onUpdate = (db) => {
            if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, {
                    keyPath: 'key',
                });
            }
        };
        this.wrap = wrap;
        this.el = this.createEl();
        this.IDB = new _utils_IndexedDB__WEBPACK_IMPORTED_MODULE_2__["IndexedDB"]();
        this.init();
    }
    async init() {
        this.bindEvents();
        await this.initDB();
        this.restore();
    }
    async initDB() {
        await this.IDB.open(this.DBName, this.DBVer, this.onUpdate);
    }
    createEl() {
        const div = document.createElement('div');
        div.id = this.id;
        const el = this.wrap.insertAdjacentElement('afterbegin', div);
        return el;
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.selectBG, () => {
            this.selectBG();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.clearBG, () => {
            this.clearBG();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'bgDisplay') {
                this.setDisplay();
            }
            if (data.name === 'bgOpacity') {
                this.setOpacity();
            }
            if (data.name === 'bgPositionY') {
                this.setPositionY();
            }
        });
    }
    async restore() {
        const data = (await this.IDB.get(this.storeName, this.keyName));
        if (!data || !data.file) {
            return;
        }
        const url = URL.createObjectURL(data.file);
        this.setBGImage(url);
    }
    async selectBG() {
        const file = (await _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].selectFile('.jpg,.jpeg,.png,.bmp'))[0];
        const url = URL.createObjectURL(file);
        this.setBGImage(url);
        const data = {
            key: this.keyName,
            file: file,
        };
        const test = await this.IDB.get(this.storeName, this.keyName);
        this.IDB[test ? 'put' : 'add'](this.storeName, data);
    }
    async setBGImage(url) {
        this.setPositionY();
        this.setOpacity();
        // 预加载背景图片
        // 由于浏览器的工作原理，背景图片在未被显示之前是不会加载的，在显示时才会进行加载。这会导致背景层显示之后出现短暂的空白（因为在加载图片）。为了避免空白，需要预加载图片
        await _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].loadImg(url);
        this.el.style.backgroundImage = `url(${url})`;
        this.haveImage = true;
        this.setDisplay();
    }
    setDisplay() {
        this.el.style.display = _Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].bgDisplay ? 'block' : 'none';
        if (!this.haveImage) {
            this.wrap.classList.remove(this.flagClassName);
        }
        else {
            this.wrap.classList[_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].bgDisplay ? 'add' : 'remove'](this.flagClassName);
        }
    }
    setOpacity() {
        this.el.style.opacity = (_Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].bgOpacity / 100).toString();
    }
    setPositionY() {
        this.el.style.backgroundPositionY = _Settings__WEBPACK_IMPORTED_MODULE_3__["settings"].bgPositionY;
    }
    clearBG() {
        this.el.style.backgroundImage = 'none';
        this.IDB.clear(this.storeName);
        this.haveImage = false;
        this.setDisplay();
    }
}



/***/ }),

/***/ "./src/ts/setting/ConvertOldSettings.ts":
/*!**********************************************!*\
  !*** ./src/ts/setting/ConvertOldSettings.ts ***!
  \**********************************************/
/*! exports provided: convertOldSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertOldSettings", function() { return convertOldSettings; });
// 为了兼容以前的版本的设置，把旧的设置值转换为新版本的设置值
class ConvertOldSettings {
    constructor() {
        // 旧设置和新设置的对应关系
        // 为了集中管理，便于使用，写到了一个对象里
        this.data = {
            ratio: {
                '0': 'square',
                '1': 'horizontal',
                '2': 'vertical',
                '3': 'userSet',
            },
            idRange: {
                '1': '>',
                '2': '<',
            },
            widthTag: {
                '1': 'yes',
                '-1': 'no',
            },
            restrict: {
                '1': 'yes',
                '-1': 'no',
            },
            userSetLang: {
                '-1': 'auto',
                '0': 'zh-cn',
                '1': 'ja',
                '2': 'en',
                '3': 'zh-tw',
            },
        };
    }
    // 传递需要转换的设置的键值
    convert(key, value) {
        const map = this.data[key];
        // 如果这是一个可以转换的设置
        if (map) {
            // 如果传递的值是旧的设置值，则能够获取到新的设置值
            // 如果传递的值已经是新的设置值，则获取到的是 undefined ，此时不需要转换
            const newValue = map[value];
            if (newValue !== undefined) {
                return newValue;
            }
        }
        return value;
    }
}
const convertOldSettings = new ConvertOldSettings();



/***/ }),

/***/ "./src/ts/setting/Form.ts":
/*!********************************!*\
  !*** ./src/ts/setting/Form.ts ***!
  \********************************/
/*! exports provided: form */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "form", function() { return form; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _config_Colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/Colors */ "./src/ts/config/Colors.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _FormHTML__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FormHTML */ "./src/ts/setting/FormHTML.ts");
/* harmony import */ var _SaveNamingRule__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SaveNamingRule */ "./src/ts/setting/SaveNamingRule.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _FormSettings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./FormSettings */ "./src/ts/setting/FormSettings.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");









// 设置表单
class Form {
    constructor() {
        this.chooseKeys = ['Enter', 'NumpadEnter']; // 让回车键可以控制复选框（浏览器默认只支持空格键）
        this.tipCreateFolderFlag = 'tipCreateFolder'; // 控制“创建文件夹的提示”是否显示
        this.tipCreateFolderId = 'tipCreateFolder'; // “创建文件夹的提示”的容器 id
        this.form = _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].useSlot('form', _FormHTML__WEBPACK_IMPORTED_MODULE_4__["formHtml"]);
        _Theme__WEBPACK_IMPORTED_MODULE_6__["theme"].register(this.form);
        this.allCheckBox = this.form.querySelectorAll('input[type="checkbox"]');
        this.allRadio = this.form.querySelectorAll('input[type="radio"]');
        this.allSwitch = this.form.querySelectorAll('.checkbox_switch');
        this.allLabel = this.form.querySelectorAll('label');
        new _SaveNamingRule__WEBPACK_IMPORTED_MODULE_5__["SaveNamingRule"](this.form.userSetName);
        this.formSettings = new _FormSettings__WEBPACK_IMPORTED_MODULE_7__["FormSettings"](this.form);
        this.bindEvents();
        this.initFormBueatiful();
        this.checkTipCreateFolder();
    }
    // 设置表单上美化元素的状态
    initFormBueatiful() {
        // 设置改变时，重设 label 激活状态
        this.resetLabelActive();
        // 重设该选项的子选项的显示/隐藏
        this.resetSubOptionDisplay();
    }
    bindEvents() {
        // 给美化的复选框绑定功能
        for (const checkbox of this.allCheckBox) {
            this.bindBeautifyEvent(checkbox);
            // 让复选框支持用回车键选择
            checkbox.addEventListener('keydown', (event) => {
                if (this.chooseKeys.includes(event.code)) {
                    checkbox.click();
                }
            });
        }
        // 给美化的单选按钮绑定功能
        for (const radio of this.allRadio) {
            this.bindBeautifyEvent(radio);
        }
        // 当某个设置发生改变时，重新设置美化状态
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            this.formSettings.restoreFormSettings();
            this.initFormBueatiful();
        });
        // 当设置重置时，重新设置美化状态
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resetSettingsEnd, () => {
            this.form.reset();
            this.formSettings.restoreFormSettings();
            // 美化表单，包括设置子选项区域的显示隐藏。所以这需要在恢复设置之后执行
            this.initFormBueatiful();
        });
        // 预览文件名
        _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].addBtn('namingBtns', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_预览文件名')).addEventListener('click', () => {
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('previewFileName');
        }, false);
        // 添加只在 pixiv 上使用的按钮
        if (_utils_Utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].isPixiv()) {
            // 导出 csv
            _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].addBtn('exportResult', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_导出csv')).addEventListener('click', () => {
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('exportCSV');
            }, false);
            // 导出抓取结果
            _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].addBtn('exportResult', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_导出抓取结果')).addEventListener('click', () => {
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('exportResult');
            }, false);
            // 导入抓取结果
            _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].addBtn('exportResult', _config_Colors__WEBPACK_IMPORTED_MODULE_2__["Colors"].bgGreen, _Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_导入抓取结果')).addEventListener('click', () => {
                _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('importResult');
            }, false);
        }
        // 选择背景图片
        {
            const el = this.form.querySelector('#selectBG');
            if (el) {
                el.addEventListener('click', () => {
                    _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('selectBG');
                });
            }
        }
        // 清除背景图片
        {
            const el = this.form.querySelector('#clearBG');
            if (el) {
                el.addEventListener('click', () => {
                    _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('clearBG');
                });
            }
        }
        // 重置设置按钮
        {
            const el = this.form.querySelector('#resetSettings');
            if (el) {
                el.addEventListener('click', () => {
                    const result = window.confirm(_Lang__WEBPACK_IMPORTED_MODULE_3__["lang"].transl('_是否重置设置'));
                    if (result) {
                        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('resetSettings');
                    }
                });
            }
        }
        // 导出设置按钮
        {
            const el = this.form.querySelector('#exportSettings');
            if (el) {
                el.addEventListener('click', () => {
                    _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('exportSettings');
                });
            }
        }
        // 导入设置按钮
        {
            const el = this.form.querySelector('#importSettings');
            if (el) {
                el.addEventListener('click', () => {
                    _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('importSettings');
                });
            }
        }
        // 显示命名字段提示
        this.form
            .querySelector('.showFileNameTip')
            .addEventListener('click', () => _utils_Utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].toggleEl(document.querySelector('.fileNameTip')));
        // 显示日期格式提示
        this.form
            .querySelector('.showDateTip')
            .addEventListener('click', () => _utils_Utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].toggleEl(document.querySelector('.dateFormatTip')));
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
    // 点击美化按钮时，点击对应的 input 控件
    bindBeautifyEvent(el) {
        el.nextElementSibling.addEventListener('click', () => {
            el.click();
        });
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
    // 是否显示“创建文件夹的提示”
    checkTipCreateFolder() {
        if (!_utils_Utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].isPixiv()) {
            return;
        }
        const tip = this.form.querySelector('#' + this.tipCreateFolderId);
        if (!tip) {
            return;
        }
        // 如果用户没有点击“我知道了”按钮，则显示这个提示
        if (!window.localStorage.getItem(this.tipCreateFolderFlag)) {
            tip.style.display = 'block';
            // 用户点击“我知道了”按钮之后，隐藏这个提示并设置标记
            const btn = tip.querySelector('button');
            if (btn) {
                btn.addEventListener('click', () => {
                    tip.style.display = 'none';
                    window.localStorage.setItem(this.tipCreateFolderFlag, '1');
                });
            }
        }
    }
}
const form = new Form().form;



/***/ }),

/***/ "./src/ts/setting/FormHTML.ts":
/*!************************************!*\
  !*** ./src/ts/setting/FormHTML.ts ***!
  \************************************/
/*! exports provided: formHtml */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formHtml", function() { return formHtml; });
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");


const formHtml = `<form class="settingForm">
    <div class="tabsContnet">
      <p class="option" data-no="1">
      <span class="setWantPageWrap">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_页数')}"><span class="setWantPageTip1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_页数')}</span><span class="gray1"> ? </span></span>
      <input type="text" name="setWantPage" class="setinput_style1 blue setWantPage"
      value = '-1'>&nbsp;
      <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
      </span>
      </p>

      <p class="option" data-no="2">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downType0" id="setWorkType0" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType0"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_插画')}&nbsp;</label>
      <input type="checkbox" name="downType1" id="setWorkType1" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_漫画')}&nbsp;</label>
      <input type="checkbox" name="downType2" id="setWorkType2" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_动图')}&nbsp;</label>
      <input type="checkbox" name="downType3" id="setWorkType3" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType3"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_小说')}&nbsp;</label>
      </p>

      <p class="option" data-no="44">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downAllAges" id="downAllAges" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="downAllAges"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_全年龄')}&nbsp;</label>
      <input type="checkbox" name="downR18" id="downR18" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="downR18"> R-18&nbsp;</label>
      <input type="checkbox" name="downR18G" id="downR18G" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="downR18G"> R-18G&nbsp;</label>
      </p>

      <p class="option" data-no="6">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downNotBookmarked" id="setDownNotBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownNotBookmarked"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_未收藏')}&nbsp;</label>
      <input type="checkbox" name="downBookmarked" id="setDownBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownBookmarked"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_已收藏')}&nbsp;</label>
      </p>
      
      <p class="option" data-no="23">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downColorImg" id="setDownColorImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownColorImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_彩色图片')}&nbsp;</label>
      <input type="checkbox" name="downBlackWhiteImg" id="setDownBlackWhiteImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownBlackWhiteImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_黑白图片')}&nbsp;</label>
      </p>

      <p class="option" data-no="21">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downSingleImg" id="setDownSingleImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownSingleImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_单图作品')}&nbsp;</label>
      <input type="checkbox" name="downMultiImg" id="setDownMultiImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownMultiImg"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_多图作品')}&nbsp;</label>
      </p>

      <p class="option" data-no="51">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_显示高级设置说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_显示高级设置')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="3">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_必须大于0')}" >${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_多图作品只下载前几张图片')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="firstFewImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="firstFewImagesSwitch">
      <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
      </span>
      </p>

      <p class="option" data-no="47">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_超出此限制的多图作品不会被下载') +
    '. ' +
    _Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_必须大于0')}" >${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_多图作品的图片数量限制')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="multiImageWorkImageLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="multiImageWorkImageLimitSwitch">
      &lt;=&nbsp;
      <input type="text" name="multiImageWorkImageLimit" class="setinput_style1 blue" value="1">
      </span>
      </p>

      <p class="option" data-no="5">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置收藏数量的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置收藏数量')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="BMKNumSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="BMKNumSwitch">
      &gt;=&nbsp;
      <input type="text" name="BMKNumMin" class="setinput_style1 blue bmkNum" value="0">
      &lt;=&nbsp;
      <input type="text" name="BMKNumMax" class="setinput_style1 blue bmkNum" value="${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].BookmarkCountLimit}">
      <span>&nbsp;${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_或者')}</span>
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_日均收藏数量的提示')}">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_日均收藏数量')}
      <span class="gray1"> ? </span></span>
      <input type="checkbox" name="BMKNumAverageSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="BMKNumAverageSwitch">
        <input type="text" name="BMKNumAverage" class="setinput_style1 blue bmkNum" value="600">
      </span>
      </span>
      </p>

      <p class="option" data-no="8">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置宽高比例Title')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置宽高比例')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="ratioSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="ratioSwitch">
      <input type="radio" name="ratio" id="ratio1" class="need_beautify radio" value="horizontal">
      <span class="beautify_radio"></span>
      <label for="ratio1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_横图')}&nbsp; </label>

      <input type="radio" name="ratio" id="ratio2" class="need_beautify radio" value="vertical">
      <span class="beautify_radio"></span>
      <label for="ratio2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_竖图')}&nbsp; </label>
      
      <input type="radio" name="ratio" id="ratio0" class="need_beautify radio" value="square">
      <span class="beautify_radio"></span>
      <label for="ratio0"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_正方形')}&nbsp; </label>

      <input type="radio" name="ratio" id="ratio3" class="need_beautify radio" value="userSet">
      <span class="beautify_radio"></span>
      <label for="ratio3"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_输入宽高比')}</label>
      <input type="text" name="userRatio" class="setinput_style1 blue" value="1.4">
      </span>
      </p>

      <p class="option" data-no="7">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_筛选宽高的按钮Title')} ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_筛选宽高的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_筛选宽高的按钮文字')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="setWHSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="setWHSwitch">

      <input type="radio" name="widthHeightLimit" id="widthHeightLimit1" class="need_beautify radio" value=">=" checked>
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit1">&gt;=&nbsp;</label>

      <input type="radio" name="widthHeightLimit" id="widthHeightLimit2" class="need_beautify radio" value="=">
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit2">=&nbsp;</label>
      
      <input type="radio" name="widthHeightLimit" id="widthHeightLimit3" class="need_beautify radio" value="<=">
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit3">&lt;=&nbsp;</label>

      <span class="">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_宽度')}</span>
      <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" class="need_beautify radio" value="&" checked>
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr1">and&nbsp;</label>
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" class="need_beautify radio" value="|">
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr2">or&nbsp;</label>
      <span class="">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_高度')}</span>
      <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
      </span>
      </p>

      <p class="option" data-no="9">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置id范围提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置id范围')}&nbsp; <span class="gray1"> ? </span></span>
      <input type="checkbox" name="idRangeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="idRangeSwitch">
      <input type="radio" name="idRange" id="idRange1" class="need_beautify radio" value=">" checked>
      <span class="beautify_radio"></span>
      <label for="idRange1">  &gt;&nbsp; </label>
      <input type="radio" name="idRange" id="idRange2" class="need_beautify radio" value="<">
      <span class="beautify_radio"></span>
      <label for="idRange2">  &lt;&nbsp; </label>
      <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="">
      </span>
      </p>

      <p class="option" data-no="10">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置投稿时间提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置投稿时间')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="postDate" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="postDate">
      <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      &nbsp;-&nbsp;
      <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      </span>
      </p>

      <p class="option" data-no="11">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_必须tag的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_必须含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="needTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="needTagSwitch">
      <input type="radio" name="needTagMode" id="needTagMode1" class="need_beautify radio" value="all" checked>
      <span class="beautify_radio"></span>
      <label for="needTagMode1">  ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_全部')}&nbsp; </label>
      <input type="radio" name="needTagMode" id="needTagMode2" class="need_beautify radio" value="one">
      <span class="beautify_radio"></span>
      <label for="needTagMode2">  ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_任一')}&nbsp; </label>
      <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
      </span>
      </p>

      <p class="option" data-no="12">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_排除tag的提示文字')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_不能含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="notNeedTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="notNeedTagSwitch">
      <span class="gray1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_任一')}&nbsp;</span>
      <input type="radio" id="tagMatchMode1" class="need_beautify radio" name="tagMatchMode" value="partial" checked>
      <span class="beautify_radio"></span>
      <label for="tagMatchMode1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_部分一致')}&nbsp; </label>
      <input type="radio" id="tagMatchMode2" class="need_beautify radio" name="tagMatchMode" value="whole" checked>
      <span class="beautify_radio"></span>
      <label for="tagMatchMode2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_完全一致')}&nbsp; </label>
      <br>
      <textarea class="centerPanelTextArea beautify_scrollbar" name="notNeedTag" rows="1"></textarea>
      </span>
      </p>

      <div class="centerWrap_btns">
        <slot data-name="crawlBtns"></slot>
        <slot data-name="selectWorkBtns"></slot>
      </div>
    </div>
    <div class="tabsContnet">
    <p class="option" data-no="13">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名规则')}</span>
      <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="{p_title}/{id}">
      &nbsp;
      <select name="fileNameSelect" class="beautify_scrollbar">
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
        <option value="{like}">{like}</option>
        <option value="{bmk}">{bmk}</option>
        <option value="{bmk_1000}">{bmk_1000}</option>
        <option value="{view}">{view}</option>
        <option value="{rank}">{rank}</option>
        <option value="{date}">{date}</option>
        <option value="{task_date}">{task_date}</option>
        <option value="{px}">{px}</option>
        <option value="{series_title}">{series_title}</option>
        <option value="{series_order}">{series_order}</option>
        <option value="{id_num}">{id_num}</option>
        <option value="{p_num}">{p_num}</option>
        </select>
      &nbsp;
      <slot data-name="saveNamingRule"></slot>
      <button class="showFileNameTip textButton" type="button">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_提示2')}</button>
      </p>
      <p class="tip tipWithBtn" id="tipCreateFolder">
        <span class="left">
        ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置文件夹名的提示')}<strong>{user}/{id}</strong>
        </span>
        <span class="right">
         <button type="button" class="textButton gray1" id="tipCreateFolderBtn">
         ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_我知道了')}
         </button>
        </span>
      </p>
      <p class="fileNameTip tip">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置文件夹名的提示')}<strong>{user}/{id}</strong>
      <br>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记提醒')}
      <br>
      <span class="blue">{id}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记id')}
      <br>
      <span class="blue">{user}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记user')}
      <br>
      <span class="blue">{user_id}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_用户id')}
      <br>
      <span class="blue">{title}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记title')}
      <br>
      <span class="blue">{p_title}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_文件夹标记PTitle')}
      <br>
      <span class="blue">{tags}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记tags')}
      <br>
      <span class="blue">{tags_translate}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记tags_trans')}
      <br>
      <span class="blue">{tags_transl_only}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记tags_transl_only')}
      <br>
      <span class="blue">{p_tag}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_文件夹标记PTag')}
      <br>
      <span class="blue">{type}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记type')} ${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].worksTypeName.join(', ')}
      <br>
      <span class="blue">{like}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记like')}
      <br>
      <span class="blue">{bmk}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记bmk')}
      <br>
      <span class="blue">{bmk_1000}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记bmk_1000')}
      <br>
      <span class="blue">{view}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记view')}
      <br>
      <span class="blue">{rank}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记rank')}
      <br>
      <span class="blue">{date}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记date')}
      <br>
      <span class="blue">{task_date}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记taskDate')}
      <br>
      <span class="blue">{px}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记px')}
      <br>
      <span class="blue">{series_title}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记seriesTitle')}
      <br>
      <span class="blue">{series_order}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记seriesOrder')}
      <br>
      <span class="blue">{id_num}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记id_num')}
      <br>
      <span class="blue">{p_num}</span>
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名标记p_num')}
      </p>

      <p class="option" data-no="50">
      <span class="settingNameStyle1"">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_在不同的页面类型中使用不同的命名规则')}</span>
      <input type="checkbox" name="setNameRuleForEachPageType" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="14">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_添加字段名称提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_添加命名标记前缀')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="22">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_第一张图不带序号说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_第一张图不带序号')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="noSerialNo" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>
      
      <p class="option" data-no="46">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_在序号前面填充0')}</span>
      <input type="checkbox" name="zeroPadding" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="zeroPadding">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_序号总长度')}</span>
      <input type="text" name="zeroPaddingLength" class="setinput_style1 blue" value="3" style="width:30px;min-width: 30px;">
      </span>
      </p>
      
      <p class="option" data-no="42">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_根据作品类型自动创建文件夹')}</span>
      <input type="checkbox" name="createFolderByType" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="createFolderByType">
      <input type="checkbox" name="createFolderByTypeIllust" id="createFolderByTypeIllust" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeIllust" class="has_tip" data-tip="${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].worksTypeName[0]}"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_插画')}&nbsp;</label>

      <input type="checkbox" name="createFolderByTypeManga" id="createFolderByTypeManga" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeManga" class="has_tip" data-tip="${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].worksTypeName[1]}"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_漫画')}&nbsp;</label>

      <input type="checkbox" name="createFolderByTypeUgoira" id="createFolderByTypeUgoira" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeUgoira" class="has_tip" data-tip="${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].worksTypeName[2]}"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_动图')}&nbsp;</label>

      <input type="checkbox" name="createFolderByTypeNovel" id="createFolderByTypeNovel" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeNovel" class="has_tip" data-tip="${_config_Config__WEBPACK_IMPORTED_MODULE_0__["Config"].worksTypeName[3]}"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_小说')}&nbsp;</label>
      </span>
      </p>

      <p class="option" data-no="43">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_使用匹配的tag建立文件夹的说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_使用第一个匹配的tag建立文件夹')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="createFolderByTag" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="createFolderByTag">
      <span class="gray1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_tag用逗号分割')}</span>
      <br>
      <textarea class="centerPanelTextArea beautify_scrollbar" name="createFolderTagList" rows="1"></textarea>
      </span>
      </p>

      <p class="option" data-no="38">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_把r18作品存入指定的文件夹里')}</span>
      <input type="checkbox" name="r18Folder" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="r18Folder">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_目录名')}</span>
      <input type="text" name="r18FolderName" class="setinput_style1 blue" style="width:150px;min-width: 150px;" value="[R-18&R-18G]">
      </span>
      </p>

      <p class="option" data-no="19">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_为作品创建单独的文件夹')}</span>
      <input type="checkbox" name="workDir" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="workDir">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_文件数量大于')}</span>
      <input type="text" name="workDirFileNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
      <span>&nbsp;</span>
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_目录名')}</span>
      <input type="text" name="workDirNameRule" class="setinput_style1 blue" value="{id_num}">
      </span>
      </p>

      <div class="centerWrap_btns">
        <slot data-name="namingBtns"></slot>
        <slot data-name="exportResult"></slot>
      </div>

      <p class="option" data-no="16">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_线程数字')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_设置下载线程')}<span class="gray1"> ? </span></span>
      <input type="text" name="downloadThread" class="setinput_style1 blue" value="5">
      </p>

      <p class="option" data-no="17">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_快速下载的提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_自动开始下载')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="quietDownload" id="setQuietDownload" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="33">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载之后收藏作品的提示')}">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载之后收藏作品')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="bmkAfterDL" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="52">
      <span class="settingNameStyle1">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载完成后显示通知')}</span>
      <input type="checkbox" name="showNotificationAfterDownloadComplete" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <slot data-name="downloadArea"></slot>
      <slot data-name="progressBar"></slot>
    </div>
    
    <div class="tabsContnet">

    <div class="centerWrap_btns">
      <slot data-name="otherBtns"></slot>
    </div>

    <p class="option" data-no="57">
    <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_显示高级设置说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_显示高级设置')}<span class="gray1"> ? </span></span>
    <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option settingCategoryName" data-no="58">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_下载')}</span>
    </p>

      <p class="option" data-no="4">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_动图保存格式title')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_动图保存格式')}<span class="gray1"> ? </span></span>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_webmVideo')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs3">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_gif')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs4" class="need_beautify radio" value="png"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs4" class="has_tip" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_无损')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_apng')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs2">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_zipFile')} &nbsp;</label>
      </p>

      <p class="option" data-no="24">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_同时转换多少个动图警告')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_同时转换多少个动图')}</span>
      <input type="text" name="convertUgoiraThread" class="setinput_style1 blue" value="1">
      <span class="has_tip gray1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_同时转换多少个动图警告')}"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_提示')} </span>
      </p>

      <p class="option" data-no="26">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_小说保存格式')}<span class="gray1"> &nbsp; </span></span>
      <input type="radio" name="novelSaveAs" id="novelSaveAs1" class="need_beautify radio" value="txt" checked>
      <span class="beautify_radio"></span>
      <label for="novelSaveAs1"> TXT &nbsp;</label>
      <input type="radio" name="novelSaveAs" id="novelSaveAs2" class="need_beautify radio" value="epub"> 
      <span class="beautify_radio"></span>
      <label for="novelSaveAs2"> EPUB &nbsp;</label>
      </p>
      
      <p class="option" data-no="27">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_在小说里保存元数据提示')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_在小说里保存元数据')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="saveNovelMeta" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="49">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_保存作品的元数据说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_保存作品的元数据')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="saveMetaType0" id="setSaveMetaType0" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType0"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_插画')}&nbsp;</label>
      <input type="checkbox" name="saveMetaType1" id="setSaveMetaType1" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_漫画')}&nbsp;</label>
      <input type="checkbox" name="saveMetaType2" id="setSaveMetaType2" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_动图')}&nbsp;</label>
      <input type="checkbox" name="saveMetaType3" id="setSaveMetaType3" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType3"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_小说')}&nbsp;</label>
      </p>

      <p class="option" data-no="29">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_文件名长度限制')}</span>
      <input type="checkbox" name="fileNameLengthLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="fileNameLengthLimitSwitch">
      <input type="text" name="fileNameLengthLimit" class="setinput_style1 blue" value="200">
      </span>
      </p>

      <p class="option" data-no="30">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_图片尺寸')} </span>
      <input type="radio" name="imageSize" id="imageSize1" class="need_beautify radio" value="original" checked>
      <span class="beautify_radio"></span>
      <label for="imageSize1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_原图')} </label>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize2" class="need_beautify radio" value="regular">
      <span class="beautify_radio"></span>
      <label for="imageSize2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_普通')} </label>
      <span class="gray1">(1200px)</span>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize3" class="need_beautify radio" value="small">
      <span class="beautify_radio"></span>
      <label for="imageSize3"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_小图')} </label>
      <span class="gray1">(540px)</span>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize4" class="need_beautify radio" value="thumb">
      <span class="beautify_radio"></span>
      <label for="imageSize4"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_方形缩略图')} </label>
      <span class="gray1">(250px)</span>
      </p>
  
      <p class="option" data-no="25">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_不符合要求的文件不会被保存')}">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_文件体积限制')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="sizeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="sizeSwitch">
      <input type="text" name="sizeMin" class="setinput_style1 blue" value="0">MiB
      &nbsp;-&nbsp;
      <input type="text" name="sizeMax" class="setinput_style1 blue" value="100">MiB
      </span>
      </p>

      <p class="option" data-no="28">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_不下载重复文件的提示')}">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_不下载重复文件')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="deduplication" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="deduplication">
      <span>&nbsp; ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_策略')}</span>
      <input type="radio" name="dupliStrategy" id="dupliStrategy1" class="need_beautify radio" value="strict" checked>
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_严格模式说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_严格')}</label>
      &nbsp;
      <input type="radio" name="dupliStrategy" id="dupliStrategy2" class="need_beautify radio" value="loose">
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy2" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_宽松模式说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_宽松')}</label>
      &nbsp;
      <button class="textButton gray1" type="button" id="exportDownloadRecord">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导出')}</button>
      <button class="textButton gray1" type="button" id="importDownloadRecord">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入')}</button>
      <button class="textButton gray1" type="button" id="clearDownloadRecord">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除')}</button>
      </span>
      </p>

      <p class="option" data-no="54">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_自动导出抓取结果')} </span>
      <input type="checkbox" name="autoExportResult" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="autoExportResult">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_文件数量大于')}</span>
      <input type="text" name="autoExportResultNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
      <span>&nbsp;</span>
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_文件格式')} </span>
      <input type="checkbox" name="autoExportResultCSV" id="autoExportResultCSV" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="autoExportResultCSV"> CSV </label>
      &nbsp;
      <input type="checkbox" name="autoExportResultJSON" id="autoExportResultJSON" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="autoExportResultJSON"> JSON </label>

      </span>
      </p>

      <p class="option settingCategoryName" data-no="59">
        <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_抓取')}</span>
      </p>

      <p class="option" data-no="35">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_用户阻止名单的说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_用户阻止名单')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="userBlockList" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="userBlockList">
      <input type="text" name="blockList" class="setinput_style1 blue setinput_tag" placeholder="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_用户ID必须是数字')}">
      </span>
      </p>

      <p class="option" data-no="39">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_针对特定用户屏蔽tag')}</span>
      <input type="checkbox" name="blockTagsForSpecificUser" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="blockTagsForSpecificUser">
      <slot data-name="blockTagsForSpecificUser"></slot>
      </span>
      </p>

      <p class="option settingCategoryName" data-no="60">
        <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_增强')}</span>
      </p>

      <p class="option" data-no="55">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_预览作品')} </span>
      <input type="checkbox" name="PreviewWork" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="PreviewWork">
      
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_图片尺寸2')}</span>
      <input type="radio" name="prevWorkSize" id="prevWorkSize1" class="need_beautify radio" value="original">
      <span class="beautify_radio"></span>
      <label for="prevWorkSize1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_原图')} </label>
      &nbsp;
      <input type="radio" name="prevWorkSize" id="prevWorkSize2" class="need_beautify radio" value="regular" checked>
      <span class="beautify_radio"></span>
      <label for="prevWorkSize2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_普通')} </label>
      </p>

      <p class="option" data-no="62">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_长按右键显示大图')} </span>
      <input type="checkbox" name="showOriginImage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="showOriginImage">
      
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_图片尺寸2')}</span>
      <input type="radio" name="showOriginImageSize" id="showOriginImageSize1" class="need_beautify radio" value="original">
      <span class="beautify_radio"></span>
      <label for="showOriginImageSize1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_原图')} </label>
      &nbsp;
      <input type="radio" name="showOriginImageSize" id="showOriginImageSize2" class="need_beautify radio" value="regular" checked>
      <span class="beautify_radio"></span>
      <label for="showOriginImageSize2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_普通')} </label>
      </p>

      <p class="option" data-no="40">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_在作品缩略图上显示放大图标')} </span>
      <input type="checkbox" name="magnifier" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="magnifier">

      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_位置')} </span>
      <input type="radio" name="magnifierPosition" id="magnifierPosition1" class="need_beautify radio" value="left">
      <span class="beautify_radio"></span>
      <label for="magnifierPosition1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_左')} </label>
      &nbsp;
      <input type="radio" name="magnifierPosition" id="magnifierPosition2" class="need_beautify radio" value="right" checked>
      <span class="beautify_radio"></span>
      <label for="magnifierPosition2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_右')} </label>

      <span class="verticalSplit"></span>

      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_图片尺寸2')}</span>
      <input type="radio" name="magnifierSize" id="magnifierSize1" class="need_beautify radio" value="original">
      <span class="beautify_radio"></span>
      <label for="magnifierSize1"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_原图')} </label>
      &nbsp;
      <input type="radio" name="magnifierSize" id="magnifierSize2" class="need_beautify radio" value="regular" checked>
      <span class="beautify_radio"></span>
      <label for="magnifierSize2"> ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_普通')} </label>

      </span>
      </p>

      <p class="option" data-no="56">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_在作品缩略图上显示下载按钮')}</span>
      <input type="checkbox" name="showDownloadBtnOnThumb" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="48">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_在搜索页面添加快捷搜索区域')} </span>
      <input type="checkbox" name="showFastSearchArea" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="18">
      <span class="has_tip settingNameStyle1" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_预览搜索结果说明')}">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_预览搜索结果')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="previewResult" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="34">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_收藏设置')}</span>
      
      <input type="radio" name="widthTag" id="widthTag1" class="need_beautify radio" value="yes" checked>
      <span class="beautify_radio"></span>
      <label for="widthTag1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_添加tag')}&nbsp;</label>
      <input type="radio" name="widthTag" id="widthTag2" class="need_beautify radio" value="no">
      <span class="beautify_radio"></span>
      <label for="widthTag2">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_不添加tag')}</label>

      <span class="verticalSplit"></span>
      
      <input type="radio" name="restrict" id="restrict1" class="need_beautify radio" value="no" checked>
      <span class="beautify_radio"></span>
      <label for="restrict1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_公开')}&nbsp;</label>
      <input type="radio" name="restrict" id="restrict2" class="need_beautify radio" value="yes">
      <span class="beautify_radio"></span>
      <label for="restrict2">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_不公开')}</label>
      </p>

      <p class="option settingCategoryName" data-no="61">
        <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_其他')}</span>
      </p>

      <p class="option" data-no="31">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_日期格式')}</span>
      <input type="text" name="dateFormat" class="setinput_style1 blue" style="width:250px;" value="YYYY-MM-DD">
      <button type="button" class="gray1 textButton showDateTip">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_提示')}</button>
      </p>
      <p class="dateFormatTip tip" style="display:none">
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_日期格式提示')}</span>
      <br>
      <span class="blue">YYYY</span> <span>2021</span>
      <br>
      <span class="blue">YY</span> <span>21</span>
      <br>
      <span class="blue">MM</span> <span>04</span>
      <br>
      <span class="blue">MMM</span> <span>Apr</span>
      <br>
      <span class="blue">MMMM</span> <span>April</span>
      <br>
      <span class="blue">DD</span> <span>30</span>
      <br>
      <span class="blue">hh</span> <span>06</span>
      <br>
      <span class="blue">mm</span> <span>40</span>
      <br>
      <span class="blue">ss</span> <span>08</span>
      <br>
      </p>

      <p class="option" data-no="36">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_颜色主题')}</span>
      <input type="radio" name="theme" id="theme1" class="need_beautify radio" value="auto" checked>
      <span class="beautify_radio"></span>
      <label for="theme1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_自动检测')}</label>
      &nbsp;
      <input type="radio" name="theme" id="theme2" class="need_beautify radio" value="white">
      <span class="beautify_radio"></span>
      <label for="theme2">White</label>
      &nbsp;
      <input type="radio" name="theme" id="theme3" class="need_beautify radio" value="dark">
      <span class="beautify_radio"></span>
      <label for="theme3">Dark</label>
      </p>

      <p class="option" data-no="41">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_背景图片')} </span>
      <input type="checkbox" name="bgDisplay" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="bgDisplay">

      <button class="textButton gray1" type="button" id="selectBG">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_选择文件')}</button>
      <button class="textButton gray1" type="button" id="clearBG">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_清除')}</button>
      
      &nbsp;
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_对齐方式')}&nbsp;</span>
      <input type="radio" name="bgPositionY" id="bgPosition1" class="need_beautify radio" value="center" checked>
      <span class="beautify_radio"></span>
      <label for="bgPosition1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_居中')}</label>
      <input type="radio" name="bgPositionY" id="bgPosition2" class="need_beautify radio" value="top">
      <span class="beautify_radio"></span>
      <label for="bgPosition2">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_顶部')}</label>

      &nbsp;
      <span>${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_不透明度')}&nbsp;</span>
      <input name="bgOpacity" type="range" />
      </span>
      </p>
      
      <p class="option" data-no="45">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_选项卡切换方式')}</span>
      <input type="radio" name="switchTabBar" id="switchTabBar1" class="need_beautify radio" value="over" checked>
      <span class="beautify_radio"></span>
      <label for="switchTabBar1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_鼠标经过')}</label>
      &nbsp;
      <input type="radio" name="switchTabBar" id="switchTabBar2" class="need_beautify radio" value="click">
      <span class="beautify_radio"></span>
      <label for="switchTabBar2">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_鼠标点击')}</label>
      </p>

      <p class="option" data-no="32">
      <span class="settingNameStyle1"><span class="key">Language</span></span>
      <input type="radio" name="userSetLang" id="userSetLang1" class="need_beautify radio" value="auto" checked>
      <span class="beautify_radio"></span>
      <label for="userSetLang1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_自动检测')}</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang2" class="need_beautify radio" value="zh-cn">
      <span class="beautify_radio"></span>
      <label for="userSetLang2">简体中文</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang3" class="need_beautify radio" value="zh-tw">
      <span class="beautify_radio"></span>
      <label for="userSetLang3">繁體中文</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang4" class="need_beautify radio" value="ja">
      <span class="beautify_radio"></span>
      <label for="userSetLang4">日本語</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang5" class="need_beautify radio" value="en">
      <span class="beautify_radio"></span>
      <label for="userSetLang5">English</label>
      &nbsp;
      </p>

      <p class="option" data-no="53">
      <span class="settingNameStyle1">
      ${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_以粗体显示关键字')}</span>
      <input type="checkbox" name="boldKeywords" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="37">
      <span class="settingNameStyle1">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_管理设置')}</span>
      <button class="textButton gray1" type="button" id="exportSettings">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导出设置')}</button>
      <button class="textButton gray1" type="button" id="importSettings">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_导入设置')}</button>
      <button class="textButton gray1" type="button" id="resetSettings">${_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_重置设置')}</button>
      </p>
    </div>
</form>`;


/***/ }),

/***/ "./src/ts/setting/FormSettings.ts":
/*!****************************************!*\
  !*** ./src/ts/setting/FormSettings.ts ***!
  \****************************************/
/*! exports provided: FormSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormSettings", function() { return FormSettings; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _utils_DateFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/DateFormat */ "./src/ts/utils/DateFormat.ts");
/* harmony import */ var _NameRuleManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NameRuleManager */ "./src/ts/setting/NameRuleManager.ts");





class FormSettings {
    constructor(form) {
        // 没有填写 userSetName 字段，因为这个字段由 nameRuleManager 管理
        this.inputFileds = {
            checkbox: [
                'downType0',
                'downType1',
                'downType2',
                'downType3',
                'downAllAges',
                'downR18',
                'downR18G',
                'downSingleImg',
                'downMultiImg',
                'downColorImg',
                'downBlackWhiteImg',
                'downNotBookmarked',
                'downBookmarked',
                'firstFewImagesSwitch',
                'multiImageWorkImageLimitSwitch',
                'saveNovelMeta',
                'BMKNumSwitch',
                'BMKNumAverageSwitch',
                'setWHSwitch',
                'ratioSwitch',
                'postDate',
                'idRangeSwitch',
                'needTagSwitch',
                'notNeedTagSwitch',
                'magnifier',
                'tagNameToFileName',
                'noSerialNo',
                'createFolderByTag',
                'workDir',
                'r18Folder',
                'sizeSwitch',
                'quietDownload',
                'previewResult',
                'deduplication',
                'fileNameLengthLimitSwitch',
                'bmkAfterDL',
                'userBlockList',
                'blockTagsForSpecificUser',
                'bgDisplay',
                'createFolderByType',
                'createFolderByTypeIllust',
                'createFolderByTypeManga',
                'createFolderByTypeUgoira',
                'createFolderByTypeNovel',
                'zeroPadding',
                'showFastSearchArea',
                'saveMetaType0',
                'saveMetaType1',
                'saveMetaType2',
                'saveMetaType3',
                'setNameRuleForEachPageType',
                'showAdvancedSettings',
                'showNotificationAfterDownloadComplete',
                'boldKeywords',
                'autoExportResult',
                'autoExportResultCSV',
                'autoExportResultJSON',
                'PreviewWork',
                'showDownloadBtnOnThumb',
                'prevWorkSize',
                'showOriginImage',
            ],
            text: [
                'setWantPage',
                'firstFewImages',
                'multiImageWorkImageLimit',
                'convertUgoiraThread',
                'BMKNumMin',
                'BMKNumMax',
                'BMKNumAverage',
                'setWidth',
                'setHeight',
                'userRatio',
                'idRangeInput',
                'needTag',
                'notNeedTag',
                'workDirFileNumber',
                'r18FolderName',
                'sizeMin',
                'sizeMax',
                'downloadThread',
                'fileNameLengthLimit',
                'dateFormat',
                'blockList',
                'bgOpacity',
                'zeroPaddingLength',
                'workDirNameRule',
                'autoExportResultNumber',
            ],
            radio: [
                'ugoiraSaveAs',
                'novelSaveAs',
                'widthHeightLimit',
                'setWidthAndOr',
                'ratio',
                'idRange',
                'magnifierSize',
                'magnifierPosition',
                'dupliStrategy',
                'imageSize',
                'userSetLang',
                'restrict',
                'widthTag',
                'needTagMode',
                'theme',
                'bgPositionY',
                'switchTabBar',
                'tagMatchMode',
                'prevWorkSize',
                'showOriginImageSize',
            ],
            textarea: ['createFolderTagList'],
            datetime: ['postDateStart', 'postDateEnd'],
        };
        this.form = form;
        _NameRuleManager__WEBPACK_IMPORTED_MODULE_4__["nameRuleManager"].registerInput(this.form.userSetName);
        this.bindEvents();
        this.restoreFormSettings();
        this.ListenChange();
    }
    bindEvents() {
        // 页面切换时，从设置里恢复当前页面的页数/个数
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitchedTypeChange, () => {
            this.restoreWantPage();
        });
    }
    // 监听所有输入选项的变化
    // 该函数可执行一次，否则事件会重复绑定
    ListenChange() {
        for (const name of this.inputFileds.text) {
            // 对于某些特定输入框，不使用通用的事件处理函数
            if (name === 'setWantPage') {
                continue;
            }
            this.saveTextInput(name);
        }
        // setWantPage 变化时，保存到 wantPageArr
        this.form.setWantPage.addEventListener('change', () => {
            const temp = Array.from(_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].wantPageArr);
            temp[_PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].type] = Number.parseInt(this.form.setWantPage.value);
            Object(_Settings__WEBPACK_IMPORTED_MODULE_2__["setSetting"])('wantPageArr', temp);
        });
        for (const name of this.inputFileds.textarea) {
            this.saveTextInput(name);
        }
        for (const name of this.inputFileds.datetime) {
            this.saveTextInput(name);
        }
        for (const name of this.inputFileds.radio) {
            this.saveRadio(name);
        }
        for (const name of this.inputFileds.checkbox) {
            this.saveCheckBox(name);
        }
    }
    // 读取设置，恢复表单里的设置项
    restoreFormSettings() {
        for (const name of this.inputFileds.text) {
            // setWantPage 需要从 wantPageArr 恢复
            if (name === 'setWantPage') {
                this.restoreWantPage();
                continue;
            }
            this.restoreString(name);
        }
        for (const name of this.inputFileds.radio) {
            this.restoreString(name);
        }
        for (const name of this.inputFileds.textarea) {
            this.restoreString(name);
        }
        for (const name of this.inputFileds.checkbox) {
            this.restoreBoolean(name);
        }
        for (const name of this.inputFileds.datetime) {
            this.restoreDate(name);
        }
    }
    // ---------------------
    // 处理输入框： change 时保存 value
    saveTextInput(name) {
        const el = this.form[name];
        el.addEventListener('change', () => {
            Object(_Settings__WEBPACK_IMPORTED_MODULE_2__["setSetting"])(name, el.value);
        });
    }
    // 处理复选框： click 时保存 checked
    saveCheckBox(name) {
        // 由于表单里存在两个 showAdvancedSettings 设置，会获取到 NodeListOf<HTMLInputElement>
        // 其他设置只有一个，是 HTMLInputElement
        const el = this.form[name];
        let elArray = [];
        if (el.length !== undefined) {
            elArray = Array.from(el);
        }
        else {
            elArray.push(el);
        }
        elArray.forEach((el) => {
            el.addEventListener('click', () => {
                Object(_Settings__WEBPACK_IMPORTED_MODULE_2__["setSetting"])(name, el.checked);
            });
        });
    }
    // 处理单选框： click 时保存 value
    saveRadio(name) {
        const radios = this.form[name];
        for (const radio of radios) {
            radio.addEventListener('click', () => {
                Object(_Settings__WEBPACK_IMPORTED_MODULE_2__["setSetting"])(name, radio.value);
            });
        }
    }
    // 恢复值为 Boolean 的设置项
    restoreBoolean(name) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"][name] !== undefined) {
            // 由于表单里存在两个 showAdvancedSettings 设置，会获取到 NodeListOf<HTMLInputElement>
            // 其他设置只有一个，是 HTMLInputElement
            const el = this.form[name];
            let elArray = [];
            if (el.length !== undefined) {
                elArray = Array.from(el);
            }
            else {
                elArray.push(el);
            }
            elArray.forEach((el) => {
                el.checked = _Settings__WEBPACK_IMPORTED_MODULE_2__["settings"][name];
            });
        }
    }
    // 恢复值为 string 的设置项
    restoreString(name) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"][name] !== undefined) {
            this.form[name].value = _Settings__WEBPACK_IMPORTED_MODULE_2__["settings"][name].toString();
        }
    }
    // 恢复日期、时间设置项
    restoreDate(name) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"][name] !== undefined) {
            // 把时间戳转换成 input 使用的字符串
            const date = _Settings__WEBPACK_IMPORTED_MODULE_2__["settings"][name];
            this.form[name].value = _utils_DateFormat__WEBPACK_IMPORTED_MODULE_3__["DateFormat"].format(date, 'YYYY-MM-DDThh:mm');
        }
    }
    // 从设置里恢复当前页面的页数/个数
    restoreWantPage() {
        const want = _Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].wantPageArr[_PageType__WEBPACK_IMPORTED_MODULE_1__["pageType"].type];
        if (want !== undefined) {
            this.form.setWantPage.value = want.toString();
        }
    }
}



/***/ }),

/***/ "./src/ts/setting/InvisibleSettings.ts":
/*!*********************************************!*\
  !*** ./src/ts/setting/InvisibleSettings.ts ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _utils_SecretSignal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SecretSignal */ "./src/ts/utils/SecretSignal.ts");
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Log */ "./src/ts/Log.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");




// 管理不可见的设置。通过预设的按键，切换其开关状态
class InvisibleSettings {
    constructor() {
        this.list = [
            {
                name: 'createFolderBySl',
                code: 'switchsl',
            },
            {
                name: 'createFolderBySl',
                code: 'kaiguansl',
            },
            {
                name: 'downloadUgoiraFirst',
                code: 'dlugoirafirst',
            },
            {
                name: 'downloadUgoiraFirst',
                code: 'qw111',
            },
        ];
        this.register();
    }
    register() {
        for (const item of this.list) {
            _utils_SecretSignal__WEBPACK_IMPORTED_MODULE_1__["secretSignal"].register(item.code, () => {
                this.onChange(item.name);
            });
        }
    }
    onChange(name) {
        const nowValue = _Settings__WEBPACK_IMPORTED_MODULE_0__["settings"][name];
        if (typeof nowValue !== 'boolean') {
            return;
        }
        // 如果查找到了符合的记录，则反转这个设置的值
        const newValue = !_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"][name];
        Object(_Settings__WEBPACK_IMPORTED_MODULE_0__["setSetting"])(name, newValue);
        // 显示提示信息
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__["settings"][name]) {
            const msg = name + ' on';
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].success(msg);
            _Toast__WEBPACK_IMPORTED_MODULE_3__["toast"].success(msg);
        }
        else {
            const msg = name + ' off';
            _Log__WEBPACK_IMPORTED_MODULE_2__["log"].warning(msg);
            _Toast__WEBPACK_IMPORTED_MODULE_3__["toast"].warning(msg);
        }
    }
}
new InvisibleSettings();


/***/ }),

/***/ "./src/ts/setting/NameRuleManager.ts":
/*!*******************************************!*\
  !*** ./src/ts/setting/NameRuleManager.ts ***!
  \*******************************************/
/*! exports provided: nameRuleManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nameRuleManager", function() { return nameRuleManager; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _PageType__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../PageType */ "./src/ts/PageType.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Settings */ "./src/ts/setting/Settings.ts");






// 管理命名规则
// 在实际使用中，作为 settings.userSetName 的代理
// 其他类必须使用 nameRuleManager.rule 存取器来存取命名规则
class NameRuleManager {
    constructor() {
        // 命名规则输入框的集合
        this.inputList = [];
        // 可以在所有页面使用的通用命名规则
        this.generalRule = '{p_title}/{id}';
        this.bindEvents();
    }
    bindEvents() {
        // 页面类型变化时，设置命名规则
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitchedTypeChange, () => {
            this.setInputValue();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            // 当用户开启这个开关时，设置当前页面类型的命名规则
            if (data.name === 'setNameRuleForEachPageType' &&
                _Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].setNameRuleForEachPageType) {
                if (_Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].nameRuleForEachPageType[_PageType__WEBPACK_IMPORTED_MODULE_3__["pageType"].type] !==
                    _Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].userSetName) {
                    this.setInputValue();
                }
            }
        });
    }
    // 注册命名规则输入框
    registerInput(input) {
        this.inputList.push(input);
        this.setInputValue();
        // 保存事件被触发之前的值
        let lastValue = input.value;
        // 给输入框绑定事件
        const evList = ['change', 'focus'];
        // change 事件只对用户手动输入有效
        // 当用户从下拉框添加一个命名标记时，不会触发 change 事件，需要监听 focus 事件
        evList.forEach((evName) => {
            input.addEventListener(evName, () => {
                // 当事件触发时，比较输入框的值是否与事件触发之前发生了变化
                // 如果值没有变化，就什么都不做
                // 对于 change 事件来说，值必然发生了变化，但是 focus 就不一定了
                // 试想：用户修改命名规则为非法的规则，例如输入 111，触发 change 事件之后下载器会提示命名规则非法
                // 然后用户点击输入框（focus 事件）想要修改规则，此时值没有变化，就不应该执行后续代码。如果依然执行后续代码，那么每当用户点击输入框，下载器就会马上显示提示，这导致用户根本没办法在输入框里修改命名规则
                if (input.value === lastValue) {
                    return;
                }
                lastValue = input.value;
                if (_Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].nameRuleForEachPageType[_PageType__WEBPACK_IMPORTED_MODULE_3__["pageType"].type] !== input.value) {
                    this.rule = input.value;
                }
            });
        });
    }
    // 设置输入框的值为当前命名规则
    setInputValue() {
        const rule = this.rule;
        this.inputList.forEach((input) => {
            input.value = rule;
        });
        if (rule !== _Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].userSetName) {
            Object(_Settings__WEBPACK_IMPORTED_MODULE_5__["setSetting"])('userSetName', this.rule);
        }
    }
    get rule() {
        if (_Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].setNameRuleForEachPageType) {
            return _Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].nameRuleForEachPageType[_PageType__WEBPACK_IMPORTED_MODULE_3__["pageType"].type];
        }
        else {
            return _Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].userSetName;
        }
    }
    set rule(str) {
        // 检查传递的命名规则的合法性
        // 为了防止文件名重复，命名规则里一定要包含 {id} 或者 {id_num}{p_num}
        const check = str.includes('{id}') ||
            (str.includes('{id_num}') && str.includes('{p_num}'));
        if (!check) {
            window.setTimeout(() => {
                _MsgBox__WEBPACK_IMPORTED_MODULE_2__["msgBox"].error(_Lang__WEBPACK_IMPORTED_MODULE_1__["lang"].transl('_命名规则一定要包含id'));
            }, 300);
        }
        else {
            // 检查合法性通过
            if (str) {
                // 替换特殊字符
                str = this.handleUserSetName(str);
            }
            else {
                str = this.generalRule;
            }
            Object(_Settings__WEBPACK_IMPORTED_MODULE_5__["setSetting"])('userSetName', str);
            if (_Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].setNameRuleForEachPageType) {
                _Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].nameRuleForEachPageType[_PageType__WEBPACK_IMPORTED_MODULE_3__["pageType"].type] = str;
                Object(_Settings__WEBPACK_IMPORTED_MODULE_5__["setSetting"])('nameRuleForEachPageType', _Settings__WEBPACK_IMPORTED_MODULE_5__["settings"].nameRuleForEachPageType);
            }
            this.setInputValue();
        }
    }
    // 处理用命名规则的非法字符和非法规则
    // 这里不必处理得非常详尽，因为在生成文件名时，还会对结果进行处理
    // 测试用例：在作品页面内设置下面的命名规则，下载器会自动进行更正
    // /{p_tag}/|/{user}////<//{rank}/{px}/{sl}/{p_tag}///{id}-{user}-{user_id}""-?{tags_transl_only}////
    handleUserSetName(str) {
        // 替换命名规则里可能存在的非法字符
        str = _utils_Utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].replaceUnsafeStr(str);
        // replaceUnsafeStr 会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
        str = str.replace(/／/g, '/');
        // 处理连续的 /
        str = str.replace(/\/{2,100}/g, '/');
        // 如果命名规则头部或者尾部是 / 则去掉
        if (str.startsWith('/')) {
            str = str.replace('/', '');
        }
        if (str.endsWith('/')) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }
}
const nameRuleManager = new NameRuleManager();



/***/ }),

/***/ "./src/ts/setting/Options.ts":
/*!***********************************!*\
  !*** ./src/ts/setting/Options.ts ***!
  \***********************************/
/*! exports provided: options */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return options; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Form */ "./src/ts/setting/Form.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings */ "./src/ts/setting/Settings.ts");



// 可以控制每个设置的隐藏、显示
// 可以设置页数/个数的提示内容
class Options {
    constructor() {
        // 保持显示的选项的 id
        this.whiteList = [
            1,
            2,
            4,
            13,
            17,
            32,
            44,
            23,
            50,
            51,
            57,
        ];
        // 某些页面类型需要隐藏某些选项。当调用 hideOption 方法时，把选项 id 保存起来
        // 优先级高于 whiteList
        this.hiddenList = [];
        this.allOption = _Form__WEBPACK_IMPORTED_MODULE_1__["form"].querySelectorAll('.option');
        // 获取“页数/个数”设置的元素
        const wantPageOption = this.getOption(1);
        this.wantPageEls = {
            text: wantPageOption.querySelector('.setWantPageTip1'),
            rangTip: wantPageOption.querySelector('.setWantPageTip2'),
            input: wantPageOption.querySelector('.setWantPage'),
        };
        this.handleShowAdvancedSettings();
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'showAdvancedSettings') {
                this.handleShowAdvancedSettings();
            }
        });
        const list = [
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitchedTypeNotChange,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.pageSwitchedTypeChange,
        ];
        list.forEach((ev) => {
            window.addEventListener(ev, () => {
                this.hiddenList = [];
                window.setTimeout(() => {
                    this.handleShowAdvancedSettings();
                });
            });
        });
    }
    handleShowAdvancedSettings() {
        for (const option of this.allOption) {
            if (option.dataset.no === undefined) {
                continue;
            }
            const no = Number.parseInt(option.dataset.no);
            // 如果需要隐藏高级设置
            if (!_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].showAdvancedSettings) {
                // 如果在白名单中，并且当前页面不需要隐藏它，那么它就是显示的
                if (this.whiteList.includes(no) && !this.hiddenList.includes(no)) {
                    this.showOption([no]);
                }
                // 如果没有在白名单中，或者当前页面需要隐藏它，就隐藏它
                if (!this.whiteList.includes(no) || this.hiddenList.includes(no)) {
                    option.style.display = 'none';
                }
            }
            else {
                // 如果需要显示高级设置，那么只隐藏当前页面需要隐藏的选项
                if (this.hiddenList.includes(no)) {
                    option.style.display = 'none';
                }
                else {
                    this.showOption([no]);
                }
            }
        }
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
    // 注意：由于这个方法会修改 hiddenList，所以它是有副作用的
    // 这个方法只应该在其他类里面使用，在这个类里不要直接调用它
    hideOption(no) {
        this.hiddenList = no;
        this.setOptionDisplay(no, 'none');
    }
    // 显示指定的选项。因为页面无刷新加载，所以一些选项被隐藏后，可能需要再次显示
    showOption(no) {
        this.setOptionDisplay(no, 'block');
    }
    // 设置 “设置页面/作品数量” 选项的提示和预设值
    setWantPageTip(arg) {
        this.wantPageEls.text.textContent = arg.text;
        this.wantPageEls.text.parentElement.dataset.tip = arg.tip;
        this.wantPageEls.rangTip.textContent = arg.rangTip;
    }
}
const options = new Options();



/***/ }),

/***/ "./src/ts/setting/SaveNamingRule.ts":
/*!******************************************!*\
  !*** ./src/ts/setting/SaveNamingRule.ts ***!
  \******************************************/
/*! exports provided: SaveNamingRule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SaveNamingRule", function() { return SaveNamingRule; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");
/* harmony import */ var _Lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Lang */ "./src/ts/Lang.ts");
/* harmony import */ var _Theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Theme */ "./src/ts/Theme.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
/* harmony import */ var _NameRuleManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./NameRuleManager */ "./src/ts/setting/NameRuleManager.ts");







// 保存和加载命名规则列表
class SaveNamingRule {
    constructor(ruleInput) {
        this.limit = 20; // 最大保存数量
        this._show = false; // 是否显示列表
        this.html = `
  <div class="saveNamingRuleWrap">
  <button class="nameSave textButton has_tip" type="button" data-tip="${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存命名规则提示', this.limit.toString())}">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_保存')}</button>
  <button class="nameLoad textButton" type="button">${_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_加载')}</button>
  <ul class="namingRuleList"></ul>
  </div>`;
        this.ruleInput = ruleInput;
        _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].clearSlot('saveNamingRule');
        const wrap = _Tools__WEBPACK_IMPORTED_MODULE_1__["Tools"].useSlot('saveNamingRule', this.html);
        _Theme__WEBPACK_IMPORTED_MODULE_3__["theme"].register(wrap);
        this.saveBtn = wrap.querySelector('button.nameSave');
        this.loadBtn = wrap.querySelector('button.nameLoad');
        this.listWrap = wrap.querySelector('ul.namingRuleList');
        this.createList();
        this.bindEvents();
    }
    set show(boolean) {
        this._show = boolean;
        boolean ? this.showListWrap() : this.hideListWrap();
    }
    get show() {
        return this._show;
    }
    bindEvents() {
        this.saveBtn.addEventListener('click', () => {
            this.add(this.ruleInput.value);
        });
        this.loadBtn.addEventListener('click', () => {
            this.show = !this.show;
        });
        this.listWrap.addEventListener('mouseleave', () => {
            this.show = false;
        });
        // 设置发生变化时重新创建列表
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, (ev) => {
            const data = ev.detail.data;
            if (data.name === 'namingRuleList') {
                this.createList();
            }
        });
    }
    add(rule) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].namingRuleList.length === this.limit) {
            this.delete(0);
        }
        // 如果这个规则已存在，不会重复添加它
        if (!_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].namingRuleList.includes(rule)) {
            const list = Array.from(_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].namingRuleList);
            list.push(rule);
            Object(_Settings__WEBPACK_IMPORTED_MODULE_4__["setSetting"])('namingRuleList', list);
        }
        _Toast__WEBPACK_IMPORTED_MODULE_5__["toast"].success(_Lang__WEBPACK_IMPORTED_MODULE_2__["lang"].transl('_已保存命名规则'));
    }
    delete(index) {
        const list = Array.from(_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].namingRuleList);
        list.splice(index, 1);
        Object(_Settings__WEBPACK_IMPORTED_MODULE_4__["setSetting"])('namingRuleList', list);
    }
    select(rule) {
        this.ruleInput.value = rule;
        _NameRuleManager__WEBPACK_IMPORTED_MODULE_6__["nameRuleManager"].rule = rule;
    }
    createList() {
        const htmlArr = [];
        for (let i = 0; i < _Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].namingRuleList.length; i++) {
            const html = `<li>
      <span class="rule">${_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].namingRuleList[i]}</span>
      <button class="delete textButton" type="button" data-index="${i}">×</button>
    </li>`;
            htmlArr.push(html);
        }
        if (_Settings__WEBPACK_IMPORTED_MODULE_4__["settings"].namingRuleList.length === 0) {
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

/***/ "./src/ts/setting/Settings.ts":
/*!************************************!*\
  !*** ./src/ts/setting/Settings.ts ***!
  \************************************/
/*! exports provided: settings, setSetting */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settings", function() { return settings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSetting", function() { return setSetting; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");
/* harmony import */ var _ConvertOldSettings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ConvertOldSettings */ "./src/ts/setting/ConvertOldSettings.ts");
/* harmony import */ var _MsgBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MsgBox */ "./src/ts/MsgBox.ts");
/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/Config */ "./src/ts/config/Config.ts");
/* harmony import */ var _utils_SecretSignal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/SecretSignal */ "./src/ts/utils/SecretSignal.ts");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Toast */ "./src/ts/Toast.ts");
// settings 保存了下载器的所有设置项
// 每当修改了 settings 的任何一个值，都会触发 EVT.list.settingChange 事件，传递这个选项的名称和值 {name:string, value:any}
// 如果打开了多个标签页，每个页面的 settings 数据是互相独立的。但是 localStorage 里的数据只有一份：最后一个设置变更是在哪个页面发生的，就把哪个页面的 settings 保存到 localStorage 里。所以恢复设置时，恢复的也是这个页面的设置。







class Settings {
    constructor() {
        // 默认设置
        this.defaultSettings = {
            setWantPage: -1,
            wantPageArr: [
                -1,
                -1,
                -1,
                -1,
                -1,
                1000,
                -1,
                500,
                -1,
                1000,
                100,
                -1,
                100,
                -1,
                -1,
                1000,
                100,
                100,
                100,
                100,
                -1,
            ],
            firstFewImagesSwitch: false,
            firstFewImages: 1,
            multiImageWorkImageLimitSwitch: false,
            multiImageWorkImageLimit: 10,
            downType0: true,
            downType1: true,
            downType2: true,
            downType3: true,
            downAllAges: true,
            downR18: true,
            downR18G: true,
            downSingleImg: true,
            downMultiImg: true,
            downColorImg: true,
            downBlackWhiteImg: true,
            downNotBookmarked: true,
            downBookmarked: true,
            ugoiraSaveAs: 'webm',
            convertUgoiraThread: 1,
            needTag: [],
            notNeedTag: [],
            quietDownload: true,
            downloadThread: 5,
            userSetName: '{p_title}/{id}',
            namingRuleList: [],
            tagNameToFileName: false,
            workDir: false,
            workDirFileNumber: 1,
            workDirNameRule: '{id_num}',
            showOptions: true,
            postDate: false,
            postDateStart: 946684800000,
            postDateEnd: 4102444800000,
            previewResult: true,
            BMKNumSwitch: false,
            BMKNumMin: 0,
            BMKNumMax: _config_Config__WEBPACK_IMPORTED_MODULE_4__["Config"].BookmarkCountLimit,
            BMKNumAverageSwitch: false,
            BMKNumAverage: 600,
            setWHSwitch: false,
            widthHeightLimit: '>=',
            setWidthAndOr: '&',
            setWidth: 0,
            setHeight: 0,
            ratioSwitch: false,
            ratio: 'horizontal',
            userRatio: 1.4,
            idRangeSwitch: false,
            idRangeInput: 0,
            idRange: '>',
            needTagSwitch: false,
            notNeedTagSwitch: false,
            noSerialNo: false,
            filterBlackWhite: false,
            sizeSwitch: false,
            sizeMin: 0,
            sizeMax: 100,
            novelSaveAs: 'txt',
            saveNovelMeta: false,
            deduplication: false,
            dupliStrategy: 'loose',
            fileNameLengthLimitSwitch: false,
            fileNameLengthLimit: 200,
            imageSize: 'original',
            dateFormat: 'YYYY-MM-DD',
            userSetLang: 'auto',
            bmkAfterDL: false,
            widthTag: 'yes',
            restrict: 'no',
            widthTagBoolean: true,
            restrictBoolean: false,
            userBlockList: false,
            blockList: [],
            theme: 'auto',
            needTagMode: 'all',
            r18Folder: false,
            r18FolderName: '[R-18&R-18G]',
            blockTagsForSpecificUser: false,
            blockTagsForSpecificUserShowList: true,
            blockTagsForSpecificUserList: [],
            magnifier: true,
            magnifierSize: 'regular',
            magnifierPosition: 'right',
            bgDisplay: false,
            bgOpacity: 50,
            bgPositionY: 'center',
            createFolderByType: false,
            createFolderByTypeIllust: false,
            createFolderByTypeManga: false,
            createFolderByTypeUgoira: false,
            createFolderByTypeNovel: false,
            createFolderByTag: false,
            createFolderTagList: [],
            createFolderBySl: false,
            downloadUgoiraFirst: false,
            switchTabBar: 'over',
            zeroPadding: false,
            zeroPaddingLength: 3,
            tagMatchMode: 'whole',
            showFastSearchArea: true,
            saveMetaType0: false,
            saveMetaType1: false,
            saveMetaType2: false,
            saveMetaType3: false,
            setNameRuleForEachPageType: false,
            nameRuleForEachPageType: {
                '-1': '{p_title}/{id}',
                '0': '{p_title}/{id}',
                '1': '{p_title}/{id}',
                '2': '{user}/{id}',
                '3': '{p_title}/{id}',
                '4': '{p_title}/{id}',
                '5': '{p_tag}/{id}',
                '6': '{p_title}/{id}',
                '7': '{p_title}/{rank}-{id}',
                '8': '{p_title}/{id}',
                '9': '{p_title}/{id}',
                '10': '{p_title}/{id}',
                '11': '{p_title}/{id}',
                '12': '{p_title}/{id}',
                '13': '{p_title}/{id}-{title}',
                '14': '{user}/{series_title}/{series_order} {title} {id}',
                '15': '{p_tag}/{id}-{title}',
                '16': '{p_title}/{rank}-{id}-{title}',
                '17': '{p_title}/{id}-{title}',
                '18': '{p_title}/{id}-{title}',
                '19': '{user}/{series_title}/{series_order} {title} {id}',
                '20': '{p_title}/{id}',
            },
            showAdvancedSettings: false,
            showNotificationAfterDownloadComplete: false,
            boldKeywords: true,
            autoExportResult: false,
            autoExportResultCSV: true,
            autoExportResultJSON: false,
            autoExportResultNumber: 1,
            PreviewWork: true,
            showDownloadBtnOnThumb: true,
            prevWorkSize: 'regular',
            showOriginImage: true,
            showOriginImageSize: 'original'
        };
        this.allSettingKeys = Object.keys(this.defaultSettings);
        // 值为浮点数的选项
        this.floatNumberKey = ['userRatio', 'sizeMin', 'sizeMax'];
        // 值为整数的选项不必单独列出
        // 值为数字数组的选项
        this.numberArrayKeys = ['wantPageArr'];
        // 值为字符串数组的选项
        this.stringArrayKeys = [
            'namingRuleList',
            'blockList',
            'needTag',
            'notNeedTag',
            'createFolderTagList',
        ];
        // 以默认设置作为初始设置
        this.settings = _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].deepCopy(this.defaultSettings);
        this.restore();
        this.bindEvents();
    }
    bindEvents() {
        // 当设置发生变化时进行本地存储
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.settingChange, () => {
            localStorage.setItem(_config_Config__WEBPACK_IMPORTED_MODULE_4__["Config"].settingStoreName, JSON.stringify(this.settings));
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resetSettings, () => {
            this.reset();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.exportSettings, () => {
            this.exportSettings();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.importSettings, () => {
            this.importSettings();
        });
        // 切换只选择动图/选择全部作品类型
        const codes = ['onlyugoira', 'qw222'];
        for (const code of codes) {
            _utils_SecretSignal__WEBPACK_IMPORTED_MODULE_5__["secretSignal"].register(code, () => {
                // 如果只有动图被选中，则选择全部作品类型
                // 反之，只选择动图
                if (this.settings.downType2 &&
                    !this.settings.downType0 &&
                    !this.settings.downType1 &&
                    !this.settings.downType3) {
                    this.settings.downType0 = true;
                    this.settings.downType1 = true;
                    this.settings.downType3 = true;
                    // 多次修改只触发一次改变事件，提高效率
                    this.setSetting('downType0', true);
                    _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].warning('onlyUgoira off');
                }
                else {
                    this.settings.downType0 = false;
                    this.settings.downType1 = false;
                    this.settings.downType2 = true;
                    this.settings.downType3 = false;
                    this.setSetting('downType2', true);
                    _Toast__WEBPACK_IMPORTED_MODULE_6__["toast"].success('onlyUgoira on');
                }
            });
        }
    }
    // 初始化时，恢复设置
    restore() {
        let restoreData = this.defaultSettings;
        const savedSettings = localStorage.getItem(_config_Config__WEBPACK_IMPORTED_MODULE_4__["Config"].settingStoreName);
        if (savedSettings) {
            restoreData = JSON.parse(savedSettings);
        }
        this.assignSettings(restoreData);
    }
    // 接收整个设置项，通过循环将其更新到 settings 上
    // 循环设置而不是整个替换的原因：
    // 1. 进行类型转换，如某些设置项是 number ，但是数据来源里是 string，setSetting 可以把它们转换到正确的类型
    // 2. 某些选项在旧版本里没有，所以不能用旧的设置整个覆盖
    assignSettings(data) {
        const origin = _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].deepCopy(data);
        for (const [key, value] of Object.entries(origin)) {
            this.setSetting(key, value);
        }
    }
    exportSettings() {
        const blob = _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].json2Blob(this.settings);
        const url = URL.createObjectURL(blob);
        _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].downloadFile(url, _config_Config__WEBPACK_IMPORTED_MODULE_4__["Config"].appName + ` Settings.json`);
    }
    async importSettings() {
        const loadedJSON = (await _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].loadJSONFile().catch((err) => {
            return _MsgBox__WEBPACK_IMPORTED_MODULE_3__["msgBox"].error(err);
        }));
        if (!loadedJSON) {
            return;
        }
        // 检查是否存在设置里的属性
        if (loadedJSON.downloadThread === undefined) {
            return _MsgBox__WEBPACK_IMPORTED_MODULE_3__["msgBox"].error('Format error!');
        }
        // 开始恢复导入的设置
        this.reset(loadedJSON);
    }
    // 重置设置
    // 可选参数：传递一份设置数据，用于从配置文件导入，恢复设置
    reset(data) {
        this.assignSettings(data ? data : this.defaultSettings);
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('resetSettingsEnd');
    }
    tipError(key) {
        _MsgBox__WEBPACK_IMPORTED_MODULE_3__["msgBox"].error(`${key}: Invalid value`);
    }
    // 更改设置项
    // 其他模块应该通过这个方法更改设置
    // 这里面有一些类型转换的代码，主要目的：
    // 1. 兼容旧版本的设置。读取旧版本的设置时，将其转换成新版本的设置。例如某个设置在旧版本里是 string 类型，值为 'a,b,c'。新版本里是 string[] 类型，这里会自动将其转换成 ['a','b','c']
    // 2. 减少额外操作。例如某个设置的类型为 string[]，其他模块可以传递 string 类型的值如 'a,b,c'，而不必先把它转换成 string[]
    setSetting(key, value) {
        if (!this.allSettingKeys.includes(key)) {
            return;
        }
        const keyType = typeof this.defaultSettings[key];
        const valueType = typeof value;
        // 把旧的设置值转换为新的设置值。需要转换的值都是 string 类型
        if (valueType === 'string') {
            value = _ConvertOldSettings__WEBPACK_IMPORTED_MODULE_2__["convertOldSettings"].convert(key, value);
        }
        // 将传入的值转换成选项对应的类型
        if (keyType === 'string' && valueType !== 'string') {
            value = value.toString();
        }
        if (keyType === 'number' && valueType !== 'number') {
            // 时间是需要特殊处理的 number 类型
            if (key === 'postDateStart' || key == 'postDateEnd') {
                if (valueType === 'string') {
                    if (value === '') {
                        // 如果日期是空字符串，则替换为默认值
                        value = this.defaultSettings[key];
                    }
                    else {
                        // 把日期字符串转换成时间戳
                        const date = new Date(value);
                        value = date.getTime();
                    }
                }
            }
            else {
                // 处理普通的 number 类型
                if (this.floatNumberKey.includes(key)) {
                    value = Number.parseFloat(value);
                }
                else {
                    value = Number.parseInt(value);
                }
            }
            if (isNaN(value)) {
                return this.tipError(key);
            }
        }
        if (keyType === 'boolean' && valueType !== 'boolean') {
            value = !!value;
        }
        // 处理数组类型的值
        if (Array.isArray(this.defaultSettings[key])) {
            if (this.stringArrayKeys.includes(key)) {
                // 字符串转换成 string[]
                if (valueType === 'string') {
                    value = _utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].string2array(value);
                }
            }
            if (this.numberArrayKeys.includes(key)) {
                // 把数组转换成 number[]
                if (Array.isArray(value)) {
                    value = value.map((val) => {
                        if (typeof val !== 'number') {
                            return Number(val);
                        }
                        else {
                            return val;
                        }
                    });
                }
                else {
                    return;
                }
            }
        }
        // 对于一些不合法的值，重置为默认值
        if (key === 'firstFewImages' && value < 1) {
            value = this.defaultSettings[key];
        }
        if (key === 'fileNameLengthLimit' && value < 1) {
            value = this.defaultSettings[key];
        }
        if (key === 'setWidthAndOr' && value === '') {
            value = this.defaultSettings[key];
        }
        // 更改设置
        ;
        this.settings[key] = value;
        // 当修改某些设置时，顺便修改和它有对应关系的设置
        if (key === 'widthTag') {
            this.settings.widthTagBoolean = value === 'yes';
        }
        if (key === 'restrict') {
            this.settings.restrictBoolean = value === 'yes';
        }
        // 触发设置变化的事件
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('settingChange', { name: key, value: value });
    }
}
const self = new Settings();
const settings = self.settings;
const setSetting = self.setSetting.bind(self);



/***/ }),

/***/ "./src/ts/store/IdListWithPageNo.ts":
/*!******************************************!*\
  !*** ./src/ts/store/IdListWithPageNo.ts ***!
  \******************************************/
/*! exports provided: idListWithPageNo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idListWithPageNo", function() { return idListWithPageNo; });
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _utils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils */ "./src/ts/utils/Utils.ts");


// 这是为了解决抓取多个列表页面时，获得的 id 数据顺序混乱的问题
// 这个类会保留每个 id 所处的页码。抓取完成后可以把这些 id 按页码顺序排列，保证 id 的顺序和在页码里的顺序一致
class IdListWithPageNo {
    constructor() {
        // 存储 id 列表，按 flag 不同分别存储
        this.allList = {};
    }
    // 添加一条记录
    add(flag, idData, page) {
        if (this.allList[flag] === undefined) {
            this.allList[flag] = [];
        }
        this.allList[flag].push({
            id: idData.id,
            type: idData.type,
            page: page,
        });
    }
    // 清空记录
    clear(flag) {
        if (this.allList[flag]) {
            delete this.allList[flag];
        }
    }
    // 排序
    sort(flag) {
        if (this.allList[flag]) {
            this.allList[flag].sort(_utils_Utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].sortByProperty('page', 'asc'));
        }
    }
    // 转储到 store.idList 里
    // 自动排序
    // 转储之后自动清空
    store(flag) {
        if (this.allList[flag]) {
            this.sort(flag);
            for (const data of this.allList[flag]) {
                _Store__WEBPACK_IMPORTED_MODULE_0__["store"].idList.push({
                    id: data.id,
                    type: data.type,
                });
            }
            this.clear(flag);
        }
    }
    // 如果没有值，返回的就是 undefined
    get(flag) {
        return this.allList[flag];
    }
}
const idListWithPageNo = new IdListWithPageNo();



/***/ }),

/***/ "./src/ts/store/SaveArtworkData.ts":
/*!*****************************************!*\
  !*** ./src/ts/store/SaveArtworkData.ts ***!
  \*****************************************/
/*! exports provided: saveArtworkData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveArtworkData", function() { return saveArtworkData; });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../API */ "./src/ts/API.ts");
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");





// 保存单个图片作品的数据
class SaveArtworkData {
    async save(data) {
        // 获取需要检查的信息
        const body = data.body;
        const fullWidth = body.width; // 原图宽度
        const fullHeight = body.height; // 原图高度
        const bmk = body.bookmarkCount; // 收藏数
        const tags = _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].extractTags(data); // tag 列表
        let tagsWithTransl = _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].extractTags(data, 'both'); // 保存 tag 列表，附带翻译后的 tag
        let tagsTranslOnly = _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].extractTags(data, 'transl'); // 保存翻译后的 tag 列表
        const filterOpt = {
            createDate: body.createDate,
            id: body.id,
            workType: body.illustType,
            tags: tagsWithTransl,
            pageCount: body.pageCount,
            bookmarkCount: bmk,
            bookmarkData: body.bookmarkData,
            width: fullWidth,
            height: fullHeight,
            mini: body.urls.mini,
            userId: body.userId,
            xRestrict: body.xRestrict,
        };
        // 这里检查颜色设置是有一个隐患的：因为有些多图作品第一张图的颜色和后面的图片的颜色不一样，但这里检查时只检查第一张的缩略图。如果第一张被排除掉了，那么它后面的图片也就不会被加入抓取结果。
        // 检查通过
        if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_1__["filter"].check(filterOpt)) {
            const idNum = parseInt(body.id);
            const title = body.title; // 作品标题
            const userId = body.userId; // 用户id
            const user = body.userName; // 用户名
            const pageCount = body.pageCount;
            const bookmarked = !!body.bookmarkData;
            // 保存作品在排行榜上的编号
            const rankData = _Store__WEBPACK_IMPORTED_MODULE_3__["store"].getRankList(body.id);
            const rank = rankData ? rankData : null;
            const seriesTitle = body.seriesNavData ? body.seriesNavData.title : '';
            const seriesOrder = body.seriesNavData ? body.seriesNavData.order : null;
            // 储存作品信息
            if (body.illustType === 0 || body.illustType === 1) {
                // 插画或漫画
                const imgUrl = body.urls.original; // 作品的原图 URL
                const tempExt = imgUrl.split('.');
                const ext = tempExt[tempExt.length - 1];
                // 添加作品信息
                _Store__WEBPACK_IMPORTED_MODULE_3__["store"].addResult({
                    id: body.id,
                    idNum: idNum,
                    // 对于插画和漫画的缩略图，当一个作品包含多个图片文件时，需要转换缩略图 url
                    thumb: body.pageCount > 1
                        ? _Tools__WEBPACK_IMPORTED_MODULE_4__["Tools"].convertArtworkThumbURL(body.urls.thumb, 0)
                        : body.urls.thumb,
                    pageCount: pageCount,
                    original: imgUrl,
                    regular: body.urls.regular,
                    small: body.urls.small,
                    title: title,
                    description: body.description,
                    tags: tags,
                    tagsWithTransl: tagsWithTransl,
                    tagsTranslOnly: tagsTranslOnly,
                    user: user,
                    userId: userId,
                    fullWidth: fullWidth,
                    fullHeight: fullHeight,
                    ext: ext,
                    bmk: bmk,
                    bookmarked: bookmarked,
                    date: body.createDate,
                    type: body.illustType,
                    rank: rank,
                    seriesTitle: seriesTitle,
                    seriesOrder: seriesOrder,
                    seriesId: body.seriesNavData ? body.seriesNavData.seriesId : null,
                    viewCount: body.viewCount,
                    likeCount: body.likeCount,
                    commentCount: body.commentCount,
                    xRestrict: body.xRestrict,
                    sl: body.sl,
                });
            }
            else if (body.illustType === 2) {
                // 动图
                // 获取动图的信息
                const meta = await _API__WEBPACK_IMPORTED_MODULE_0__["API"].getUgoiraMeta(body.id);
                // 动图帧延迟数据
                const ugoiraInfo = {
                    frames: meta.body.frames,
                    mime_type: meta.body.mime_type,
                };
                // 当下载图片的方形缩略图时，它的后缀名从 url 中提取。
                // 此时不应该把它的后缀名设置为动图的保存格式，因为缩略图无法转换成动图
                let ext = _setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].ugoiraSaveAs;
                if (_setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].imageSize === 'thumb') {
                    const tempExt = body.urls.thumb.split('.');
                    ext = tempExt[tempExt.length - 1];
                }
                _Store__WEBPACK_IMPORTED_MODULE_3__["store"].addResult({
                    id: body.id,
                    idNum: idNum,
                    thumb: body.urls.thumb,
                    pageCount: pageCount,
                    original: meta.body.originalSrc,
                    regular: meta.body.src,
                    small: meta.body.src,
                    title: title,
                    description: body.description,
                    tags: tags,
                    tagsWithTransl: tagsWithTransl,
                    tagsTranslOnly: tagsTranslOnly,
                    user: user,
                    userId: userId,
                    fullWidth: fullWidth,
                    fullHeight: fullHeight,
                    ext: ext,
                    bmk: bmk,
                    bookmarked: bookmarked,
                    date: body.createDate,
                    type: body.illustType,
                    rank: rank,
                    ugoiraInfo: ugoiraInfo,
                    seriesTitle: seriesTitle,
                    seriesOrder: seriesOrder,
                    viewCount: body.viewCount,
                    likeCount: body.likeCount,
                    commentCount: body.commentCount,
                    xRestrict: body.xRestrict,
                    sl: body.sl,
                });
            }
        }
    }
}
const saveArtworkData = new SaveArtworkData();



/***/ }),

/***/ "./src/ts/store/SaveNovelData.ts":
/*!***************************************!*\
  !*** ./src/ts/store/SaveNovelData.ts ***!
  \***************************************/
/*! exports provided: saveNovelData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveNovelData", function() { return saveNovelData; });
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../filter/Filter */ "./src/ts/filter/Filter.ts");
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Store */ "./src/ts/store/Store.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");




// 保存单个小说作品的数据
class SaveNovelData {
    async save(data) {
        // 小说没有 illustType 属性， 把小说的 illustType 设置为 3，这是为了方便检查
        const illustType = 3;
        // 获取需要检查的信息
        const body = data.body;
        const bmk = body.bookmarkCount; // 收藏数
        const tags = _Tools__WEBPACK_IMPORTED_MODULE_3__["Tools"].extractTags(data); // tag 列表
        // 小说的标签没有进行翻译，所以没有翻译后的标签
        const filterOpt = {
            createDate: body.createDate,
            id: body.id,
            workType: illustType,
            tags: tags,
            bookmarkCount: bmk,
            bookmarkData: body.bookmarkData,
            userId: body.userId,
            xRestrict: body.xRestrict,
        };
        // 检查通过
        if (await _filter_Filter__WEBPACK_IMPORTED_MODULE_0__["filter"].check(filterOpt)) {
            const id = body.id;
            const idNum = parseInt(id);
            const title = body.title;
            const userId = body.userId;
            const user = body.userName;
            const bookmarked = !!body.bookmarkData;
            // 保存作品在排行榜上的编号
            const rankData = _Store__WEBPACK_IMPORTED_MODULE_1__["store"].getRankList(id);
            const rank = rankData ? rankData : null;
            // 系列标题和序号
            const seriesTitle = body.seriesNavData ? body.seriesNavData.title : '';
            const seriesOrder = body.seriesNavData ? body.seriesNavData.order : null;
            // 保存小说的一些元数据
            let meta = '';
            let metaArr = [];
            const pageUrl = `https://www.pixiv.net/novel/show.php?id=${id}`;
            const tagsA = [];
            for (const tag of tags) {
                tagsA.push('#' + tag);
            }
            metaArr.push(title, user, pageUrl, body.description, tagsA.join('\n'));
            meta = metaArr.join('\n\n') + '\n\n\n';
            // 添加作品信息
            _Store__WEBPACK_IMPORTED_MODULE_1__["store"].addResult({
                id: id,
                idNum: idNum,
                thumb: body.coverUrl || undefined,
                title: title,
                description: body.description,
                tags: tags,
                tagsWithTransl: tags,
                tagsTranslOnly: tags,
                user: user,
                userId: userId,
                // 这里的 ext 并不重要，下载时会根据 novelSaveAs 设置自动生成对应的数据
                ext: _setting_Settings__WEBPACK_IMPORTED_MODULE_2__["settings"].novelSaveAs,
                bmk: bmk,
                bookmarked: bookmarked,
                date: body.createDate,
                type: illustType,
                rank: rank,
                seriesTitle: seriesTitle,
                seriesOrder: seriesOrder,
                seriesId: body.seriesNavData ? body.seriesNavData.seriesId : null,
                viewCount: body.viewCount,
                likeCount: body.likeCount,
                commentCount: body.commentCount,
                novelMeta: {
                    id: body.id,
                    title: body.title,
                    content: this.replaceFlag(body.content),
                    description: body.description,
                    coverUrl: body.coverUrl,
                    createDate: body.createDate,
                    userName: body.userName,
                    meta: meta,
                },
                xRestrict: body.xRestrict,
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

/***/ "./src/ts/store/States.ts":
/*!********************************!*\
  !*** ./src/ts/store/States.ts ***!
  \********************************/
/*! exports provided: states */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "states", function() { return states; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");

// 储存需要跨模块使用的、会变化的状态
// 这里的状态不需要持久化保存。
// 状态的值通常只由单一的模块修改，其他模块只读取不修改
class States {
    constructor() {
        // 表示下载器是否处于繁忙状态
        // 如果下载器正在抓取中，或者正在下载中，则为 true；如果下载器处于空闲状态，则为 false
        // 修改者：本模块根据下载器的事件来修改这个状态
        this.busy = false;
        // 快速下载标记
        // 快速下载模式中不会显示下载面板，并且会自动开始下载
        // 启动快速下载时设为 true，下载完成或中止时复位到 false
        this.quickCrawl = false;
        // 这次下载是否是从图片查看器建立的
        // 如果是，那么下载途中不会显示下载面板，并且会自动开始下载
        // 作用同 quickCrawl，只是触发方式不同
        this.downloadFromViewer = false;
        // 在排行榜抓取时，是否只抓取“首次登场”的作品
        // 修改者：InitRankingArtworkPage 模块修改这个状态
        this.debut = false;
        // 收藏模式的标记
        // 修改者：本模块监听批量收藏作品的事件来修改这个标记
        // 开始批量收藏时设为 true，收藏完成之后复位到 false
        this.bookmarkMode = false;
        // 合并系列小说时使用的标记
        this.mergeNovel = false;
        // 抓取标签列表时使用的标记
        this.crawlTagList = false;
        // 是否处于手动选择作品状态
        this.selectWork = false;
        this.bindEvents();
    }
    bindEvents() {
        const idle = [
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlFinish,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadPause,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStop,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadComplete,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.bookmarkModeEnd,
        ];
        idle.forEach((type) => {
            window.addEventListener(type, () => {
                this.busy = false;
            });
        });
        const busy = [
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStart,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.bookmarkModeStart,
        ];
        busy.forEach((type) => {
            window.addEventListener(type, () => {
                this.busy = true;
            });
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.bookmarkModeStart, () => {
            this.bookmarkMode = true;
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.bookmarkModeEnd, () => {
            this.bookmarkMode = false;
        });
        // 下载完成，或者下载中止时，复位快速下载类状态
        const resetQuickState = [
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlEmpty,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadStop,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadPause,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadComplete,
            _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.downloadCancel,
        ];
        for (const ev of resetQuickState) {
            window.addEventListener(ev, () => {
                this.quickCrawl = false;
                this.downloadFromViewer = false;
            });
        }
    }
}
const states = new States();



/***/ }),

/***/ "./src/ts/store/Store.ts":
/*!*******************************!*\
  !*** ./src/ts/store/Store.ts ***!
  \*******************************/
/*! exports provided: store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "store", function() { return store; });
/* harmony import */ var _EVT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EVT */ "./src/ts/EVT.ts");
/* harmony import */ var _setting_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../setting/Settings */ "./src/ts/setting/Settings.ts");
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Tools */ "./src/ts/Tools.ts");



// 储存抓取结果
class Store {
    constructor() {
        this.idList = []; // 储存从列表中抓取到的作品的 id
        this.resultMeta = []; // 储存抓取结果的元数据。
        // 当用于图片作品时，它可以根据每个作品需要下载多少张，生成每一张图片的信息
        this.artworkIDList = []; // 储存抓取到的图片作品的 id 列表，用来避免重复添加
        this.novelIDList = []; // 储存抓取到的小说作品的 id 列表，用来避免重复添加
        this.result = []; // 储存抓取结果
        this.rankList = {}; // 储存作品在排行榜中的排名
        this.tag = ''; // 开始抓取时，储存页面此时的 tag
        this.title = ''; // 开始抓取时，储存页面此时的 title
        this.crawlCompleteTime = new Date();
        this.fileDataDefault = {
            idNum: 0,
            id: '',
            original: '',
            thumb: '',
            regular: '',
            small: '',
            title: '',
            description: '',
            pageCount: 1,
            dlCount: 1,
            index: 0,
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
            rank: null,
            ugoiraInfo: null,
            seriesTitle: null,
            seriesOrder: null,
            seriesId: null,
            novelMeta: null,
            likeCount: 0,
            viewCount: 0,
            commentCount: 0,
            xRestrict: 0,
            sl: null,
        };
        this.bindEvents();
    }
    // 计算要从这个作品里下载几张图片
    getDLCount(pageCount) {
        if (_setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].firstFewImagesSwitch) {
            return Math.min(pageCount, _setting_Settings__WEBPACK_IMPORTED_MODULE_1__["settings"].firstFewImages);
        }
        else {
            return pageCount;
        }
    }
    // 添加每个作品的信息。只需要传递有值的属性
    // 如果一个作品有多张图片，只需要传递第一张图片的数据。后面的数据会根据设置自动生成
    addResult(data) {
        // 检查该作品 id 是否已存在，已存在则不添加
        const useList = data.type === 3 ? this.novelIDList : this.artworkIDList;
        if (data.idNum !== undefined) {
            if (useList.includes(data.idNum)) {
                return;
            }
            useList.push(data.idNum);
        }
        // 添加该作品的元数据
        const workData = Object.assign({}, this.fileDataDefault, data);
        // 注意：由于 Object.assign 不是深拷贝，所以不可以修改 result 的引用类型数据，否则会影响到源对象
        // 可以修改基础类型的数据
        if (workData.type === 0 || workData.type === 1) {
            workData.dlCount = this.getDLCount(workData.pageCount);
            workData.id = workData.idNum + `_p0`;
        }
        else {
            workData.id = workData.idNum.toString();
        }
        this.resultMeta.push(workData);
        _EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].fire('addResult', workData);
        // 把该作品里的每个文件的数据添加到结果里
        if (workData.type === 2 || workData.type === 3) {
            // 动图和小说作品直接添加
            this.result.push(workData);
        }
        else {
            // 插画和漫画
            // 循环生成每一个图片文件的数据
            const p0 = 'p0';
            for (let i = 0; i < workData.dlCount; i++) {
                const fileData = Object.assign({}, workData);
                const pi = 'p' + i;
                fileData.index = i;
                fileData.id = fileData.id.replace(p0, pi);
                fileData.original = fileData.original.replace(p0, pi);
                fileData.regular = fileData.regular.replace(p0, pi);
                fileData.small = fileData.small.replace(p0, pi);
                fileData.thumb = fileData.thumb.replace(p0, pi);
                this.result.push(fileData);
            }
        }
    }
    getRankList(index) {
        return this.rankList[index];
    }
    setRankList(id, rank) {
        this.rankList[id] = rank;
    }
    findResult(id) {
        for (const result of this.result) {
            if (result.id === id) {
                return result;
            }
        }
    }
    reset() {
        this.resultMeta = [];
        this.artworkIDList = [];
        this.novelIDList = [];
        this.result = [];
        this.idList = [];
        this.rankList = {};
        this.tag = _Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].getTagFromURL();
        this.title = _Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].getPageTitle();
    }
    bindEvents() {
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.crawlStart, () => {
            this.reset();
        });
        window.addEventListener(_EVT__WEBPACK_IMPORTED_MODULE_0__["EVT"].list.resume, () => {
            this.tag = _Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].getTagFromURL();
            this.title = _Tools__WEBPACK_IMPORTED_MODULE_2__["Tools"].getPageTitle();
        });
    }
}
const store = new Store();



/***/ }),

/***/ "./src/ts/utils/CreateCSV.ts":
/*!***********************************!*\
  !*** ./src/ts/utils/CreateCSV.ts ***!
  \***********************************/
/*! exports provided: createCSV */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCSV", function() { return createCSV; });
// 生成 csv 文件
// csv 文件结构参考 https://www.jianshu.com/p/54b3afc06126
const example = [
    ['titleA', 'titleB', 'titleC'],
    ['a1', 'b1', 'c1'],
    [[1, 2, 3], false, 456],
    [undefined, 'b,b,b', 'c c c'],
];
// 每一项数据可以是任何类型（any）。如果它不是 String，它会被自动转换为 String。
// 自动转换的结果可能不符合你的预期。如果你要完全控制输出的内容，你应该自己把内容全部转换成字符串，再传递到这个类里。
// 这个类会自动处理需要添加双引号的情况，所以你不用自己添加双引号。
// 如果某个数据是 Array，它不应该包含：1. 嵌套的数组；2. Symbol 类型的数据。
class CreateCSV {
    constructor() {
        this.separate = ','; // 分隔符
        this.CRLF = '\r\n'; // 换行符
        this.reg = / |\"|,|\n/; // 判断字符串是否需要添加双引号
        this.utf8BOM = this.UTF8BOM();
    }
    // 需要双引号包裹的情况：含有逗号、换行符、空格、双引号。
    // 全角符号不需要添加双引号。
    // 格式化每一行的数据
    format(arr) {
        const rowData = [];
        // 格式化这一行里每一列的数据
        for (let i = 0; i < arr.length; i++) {
            let colData = '';
            const origin = arr[i];
            const type = typeof origin;
            // 把每一列的数据转换成字符串
            switch (type) {
                case 'string':
                    colData = origin;
                    break;
                case 'bigint':
                case 'number':
                case 'boolean':
                case 'function':
                    colData = origin.toString();
                    break;
                case 'undefined':
                    colData = '';
                    break;
                case 'symbol':
                    colData = origin.description || '';
                    break;
                case 'object':
                    if (origin === null) {
                        colData = '';
                    }
                    else if (Array.isArray(origin)) {
                        colData = origin.join(this.separate);
                    }
                    break;
                default:
                    throw new Error('Unkown data type');
            }
            // 值原本就有的双引号，要替换成两个双引号
            colData = colData.replace(/\"/g, '""');
            // 用双引号包裹这个值
            if (this.reg.test(colData)) {
                colData = this.addQuotation(colData);
            }
            rowData.push(colData);
        }
        return rowData;
    }
    create(data) {
        // 储存结果。每行的结果合并为一个字符串
        const result = [];
        // 在顶部添加 utf8BOM
        result.push(this.utf8BOM);
        // 添加每一行的数据和换行符
        for (const row of data) {
            result.push(this.format(row).join(this.separate));
            result.push(this.CRLF);
        }
        const csvBlob = new Blob(result, {
            type: 'text/csv',
        });
        return csvBlob;
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
    addQuotation(str) {
        return '"' + str + '"';
    }
}
const createCSV = new CreateCSV();
// createCSV.create(example)



/***/ }),

/***/ "./src/ts/utils/DateFormat.ts":
/*!************************************!*\
  !*** ./src/ts/utils/DateFormat.ts ***!
  \************************************/
/*! exports provided: DateFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateFormat", function() { return DateFormat; });
// 格式化日期（和时间）
class DateFormat {
    // format 参数可以由以下格式组合：
    /*
    YYYY
    YY
    MM
    MMM
    MMMM
    DD
    hh
    mm
    ss
    */
    // 区分大小写；可以添加空格或其他符号；不要使用上面未包含的格式。
    // 参考资料：
    // https://www.w3.org/TR/NOTE-datetime
    // https://en.wikipedia.org/wiki/Date_format_by_country
    static format(date, format = 'YYYY-MM-DD') {
        // 生成年、月、日、时、分、秒
        const _date = new Date(date);
        const YYYY = _date.getFullYear().toString();
        const YY = YYYY.substring(YYYY.length - 2, YYYY.length);
        const MM = (_date.getMonth() + 1).toString().padStart(2, '0');
        const MMM = this.months[_date.getMonth()];
        const MMMM = this.Months[_date.getMonth()];
        const DD = _date.getDate().toString().padStart(2, '0');
        const hh = _date.getHours().toString().padStart(2, '0');
        const mm = _date.getMinutes().toString().padStart(2, '0');
        const ss = _date.getSeconds().toString().padStart(2, '0');
        // 对格式字符串进行替换
        let r = format;
        r = r.replace('YYYY', YYYY);
        r = r.replace('YY', YY);
        r = r.replace('MMMM', MMMM);
        r = r.replace('MMM', MMM);
        r = r.replace('MM', MM);
        r = r.replace('DD', DD);
        r = r.replace('hh', hh);
        r = r.replace('mm', mm);
        r = r.replace('ss', ss);
        return r;
    }
}
DateFormat.months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
];
DateFormat.Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];



/***/ }),

/***/ "./src/ts/utils/IndexedDB.ts":
/*!***********************************!*\
  !*** ./src/ts/utils/IndexedDB.ts ***!
  \***********************************/
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
                console.trace();
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
                console.trace();
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
                console.trace();
                reject(ev);
            };
        });
    }
    // 向一个存储库中批量添加数据
    async batchAddData(storeName, dataList, key) {
        return new Promise(async (resolve, reject) => {
            var _a;
            if (dataList.length === 0) {
                resolve();
            }
            // 获取已存在的 key
            let existedKeys = (await this.getAllKeys(storeName));
            // 使用事务
            const tr = (_a = this.db) === null || _a === void 0 ? void 0 : _a.transaction(storeName, 'readwrite');
            if (!tr) {
                throw new Error(`transaction ${storeName} is undefined`);
            }
            const store = tr.objectStore(storeName);
            tr.oncomplete = () => {
                resolve();
            };
            tr.onerror = (err) => {
                console.error(err);
                console.trace();
                reject(err);
            };
            for (const data of dataList) {
                await insert(data);
            }
            async function insert(data) {
                return new Promise((resolve, reject) => {
                    // 如果 key 已存在，则使用 put
                    const type = existedKeys.includes(data[key])
                        ? 'put'
                        : 'add';
                    const request = store[type](data);
                    request.onsuccess = () => {
                        resolve();
                    };
                    request.onerror = (err) => {
                        reject(err);
                    };
                });
            }
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
                resolve(data ? data : null);
            };
            r.onerror = (ev) => {
                console.error('get failed');
                console.trace();
                reject(ev);
            };
        });
    }
    async getAll(storeNames) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const r = this.db
                .transaction(storeNames, 'readwrite')
                .objectStore(storeNames)
                .getAll();
            r.onsuccess = (ev) => {
                const data = r.result;
                if (data) {
                    resolve(data);
                }
                resolve(data ? data : null);
            };
            r.onerror = (ev) => {
                console.error('getAll failed');
                console.trace();
                reject(ev);
            };
        });
    }
    async getAllKeys(storeNames) {
        return new Promise((resolve, reject) => {
            if (this.db === undefined) {
                reject('Database is not defined');
                return;
            }
            const r = this.db
                .transaction(storeNames, 'readonly')
                .objectStore(storeNames)
                .getAllKeys();
            r.onsuccess = (ev) => {
                const data = r.result;
                resolve(data ? data : null);
            };
            r.onerror = (ev) => {
                console.error('getAllKeys failed');
                console.trace();
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
                console.trace();
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
                console.trace();
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
                console.trace();
                reject(ev);
            };
        });
    }
}



/***/ }),

/***/ "./src/ts/utils/SecretSignal.ts":
/*!**************************************!*\
  !*** ./src/ts/utils/SecretSignal.ts ***!
  \**************************************/
/*! exports provided: secretSignal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "secretSignal", function() { return secretSignal; });
// 可以用字母和数字组成隐藏口令，注册到这个模块，当用户输入隐藏口令时执行回调函数
class SecretSignal {
    constructor() {
        this.list = [];
        // 允许的按键：字母键，数字键，小键盘数字键
        // "KeyX"
        // "Digit9"
        // "Numpad1"
        this.codePrefix = ['Key', 'Digit', 'Numpad'];
        this.input = '';
        this.bindEvents();
    }
    register(code, cb) {
        this.list.push({
            code,
            cb,
        });
    }
    bindEvents() {
        window.addEventListener('keydown', (ev) => {
            // 不保存控制按键，不保存输入状态中的按键
            if (!ev.code ||
                ev.altKey ||
                ev.ctrlKey ||
                ev.metaKey ||
                ev.shiftKey ||
                ev.isComposing) {
                return;
            }
            // 保存字母和数字的按键
            for (const prefix of this.codePrefix) {
                if (ev.code.startsWith(prefix) &&
                    ev.code.length === prefix.length + 1) {
                    const key = ev.code[ev.code.length - 1].toLowerCase();
                    this.input += key;
                    this.check();
                }
            }
        });
    }
    check() {
        for (const item of this.list) {
            if (this.input.endsWith(item.code)) {
                item.cb();
            }
        }
    }
}
const secretSignal = new SecretSignal();



/***/ }),

/***/ "./src/ts/utils/Utils.ts":
/*!*******************************!*\
  !*** ./src/ts/utils/Utils.ts ***!
  \*******************************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utils", function() { return Utils; });
class Utils {
    static replaceUnsafeStr(str) {
        // 用正则去掉不安全的字符
        str = str.replace(this.unsafeStr, '');
        // 把一些特殊字符替换成全角字符
        for (let index = 0; index < this.fullWidthDict.length; index++) {
            const rule = this.fullWidthDict[index];
            const reg = new RegExp(rule[0], 'g');
            str = str.replace(reg, rule[1]);
        }
        return str;
    }
    /** 检查并处理 Windows 保留文件名。
     * 如果不传递可选参数，则将其替换为空字符串。
     * 如果传递了可选参数，则在其后添加传递的可选参数的值 */
    static handleWindowsReservedName(str, addStr) {
        if (this.windowsReservedNames.includes(str)) {
            if (addStr) {
                return str + addStr;
            }
            else {
                return '';
            }
        }
        else {
            return str;
        }
    }
    // 对象深拷贝
    static deepCopy(data) {
        if (data === null || typeof data !== 'object') {
            return data;
        }
        const result = (Array.isArray(data) ? [] : {});
        for (const [key, value] of Object.entries(data)) {
            result[key] =
                data === null || typeof data !== 'object' ? value : this.deepCopy(value);
        }
        return result;
    }
    // 字符串分割成数组
    static string2array(str) {
        str = str.replace(/\n/g, ''); // textarea 的值可能会存在换行符
        const temp = str.trim().split(',');
        const result = [];
        for (const str of temp) {
            if (str !== '') {
                result.push(str.trim());
            }
        }
        return result;
    }
    // 依据对象某个属性的值（视为数字）来排序对象数组。默认降序排列
    static sortByProperty(key, order = 'desc') {
        return function (a, b) {
            // 排序的内容有时可能是字符串，需要转换成数字排序
            const value1 = typeof a[key] === 'number' ? a[key] : parseFloat(a[key]);
            const value2 = typeof b[key] === 'number' ? b[key] : parseFloat(b[key]);
            if (value2 < value1) {
                return order === 'desc' ? -1 : 1;
            }
            else if (value2 > value1) {
                return order === 'desc' ? 1 : -1;
            }
            else {
                return 0;
            }
        };
    }
    // 创建 input 元素选择 json 文件
    static async loadJSONFile() {
        return new Promise((resolve, reject) => {
            const i = document.createElement('input');
            i.setAttribute('type', 'file');
            i.setAttribute('accept', 'application/json');
            i.onchange = () => {
                if (i.files && i.files.length > 0) {
                    // 读取文件内容
                    const file = new FileReader();
                    file.readAsText(i.files[0]);
                    file.onload = () => {
                        const str = file.result;
                        let result;
                        try {
                            result = JSON.parse(str);
                            // if((result as any).constructor !== Object){
                            // 允许是对象 {} 或者数组 []
                            if (result === null || typeof result !== 'object') {
                                const msg = 'Data is not an object!';
                                return reject(new Error(msg));
                            }
                            return resolve(result);
                        }
                        catch (error) {
                            const msg = 'JSON parse error!';
                            return reject(new Error(msg));
                        }
                    };
                }
            };
            i.click();
        });
    }
    // 创建 input 元素选择文件
    static async selectFile(accept) {
        return new Promise((resolve, reject) => {
            const i = document.createElement('input');
            i.setAttribute('type', 'file');
            if (accept) {
                i.setAttribute('accept', accept);
            }
            i.onchange = () => {
                if (i.files && i.files.length > 0) {
                    return resolve(i.files);
                }
                else {
                    return reject();
                }
            };
            i.click();
        });
    }
    // 通过创建 a 标签来下载文件
    static downloadFile(url, fileName) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    }
    // 判断当前页面是否属于 pixiv.net
    static isPixiv() {
        return window.location.host.endsWith('.pixiv.net');
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
    // 获取指定元素里，可见的结果
    static getVisibleEl(selector) {
        const list = document.querySelectorAll(selector);
        return Array.from(list).filter((el) => {
            return el.style.display !== 'none';
        });
    }
    // 删除 DOM 元素，或者 DOM 元素列表
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
    // 第二个参数设置显示时的 display，默认是 block，如果要设置为其他类型，则需要指定第二个参数
    static toggleEl(el, showDisplay = 'block') {
        el.style.display = el.style.display === showDisplay ? 'none' : showDisplay;
    }
    // 动态添加 css 样式
    static addStyle(css) {
        const e = document.createElement('style');
        e.innerHTML = css;
        document.body.append(e);
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
    /**如果数据量多大，不应该使用这个方法 */
    static json2Blob(data) {
        const str = JSON.stringify(data, null, 2);
        const blob = new Blob([str], { type: 'application/json' });
        return blob;
    }
}
// 不安全的字符，这里多数是控制字符，需要替换掉
Utils.unsafeStr = new RegExp(/[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g);
// 一些需要替换成全角字符的符号，左边是正则表达式的字符
Utils.fullWidthDict = [
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
/** Windows 保留文件名，不可单独作为文件名，不区分大小写 */
// 为了效率，这里把大写和小写都直接列出，避免在使用时进行转换
Utils.windowsReservedNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'LPT1',
    'LPT2',
    'LPT3',
    'COM2',
    'COM3',
    'COM4',
    'con',
    'prn',
    'aux',
    'nul',
    'com1',
    'lpt1',
    'lpt2',
    'lpt3',
    'com2',
    'com3',
    'com4',
];



/***/ }),

/***/ "./src/ts/utils/imageToIcon.ts":
/*!*************************************!*\
  !*** ./src/ts/utils/imageToIcon.ts ***!
  \*************************************/
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



/***/ })

/******/ });
//# sourceMappingURL=content.js.map