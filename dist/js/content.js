"use strict";
/// <reference path = "./content.d.ts" />
/// <reference path = "../../node_modules/viewerjs/types/index.d.ts" />
/*
 * project: Pixiv Batch Downloader
 * author:  xuejianxianzun; 雪见仙尊
 * license: GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
 * Github： https://github.com/xuejianxianzun/PixivBatchDownloader
 * Releases: https://github.com/xuejianxianzun/PixivBatchDownloader/releases
 * Wiki:    https://github.com/xuejianxianzun/PixivBatchDownloader/wiki
 * Website: https://pixiv.download/
 * E-mail:  xuejianxianzun@gmail.com
 * QQ group:499873152
 */
// 页面类型
class PageType {
    constructor() {
        this.type = 0;
    }
    getPageType() {
        const url = window.location.href;
        let type;
        if (window.location.hostname === 'www.pixiv.net' &&
            window.location.pathname === '/') {
            type = 0;
        }
        else if ((url.includes('illust_id') || url.includes('/artworks/')) &&
            !url.includes('mode=manga') &&
            !url.includes('bookmark_detail') &&
            !url.includes('bookmark_add') &&
            !url.includes('response.php')) {
            type = 1;
        }
        else if (!url.includes('mode=manga&illust_id') &&
            (/member_illust\.php\?.*id=/.test(url) ||
                url.includes('member.php?id=') ||
                url.includes('bookmark.php'))) {
            type = 2;
        }
        else if (url.includes('search.php?')) {
            type = 5;
        }
        else if (url.includes('ranking_area.php') &&
            url !== 'https://www.pixiv.net/ranking_area.php') {
            type = 6;
        }
        else if (window.location.pathname === '/ranking.php') {
            type = 7;
        }
        else if (url.includes('https://www.pixivision.net') &&
            url.includes('/a/')) {
            type = 8;
        }
        else if (url.includes('bookmark_add.php?id=') ||
            url.includes('bookmark_detail.php?illust_id=')) {
            type = 9;
        }
        else if (url.includes('bookmark_new_illust') ||
            url.includes('new_illust.php') ||
            url.includes('new_illust_r18.php')) {
            type = 10;
        }
        else if (window.location.pathname === '/discovery') {
            type = 11;
        }
        else {
            // 没有匹配到可用的页面类型
            throw new Error('Page type matching failed');
        }
        this.checkNewPageType(type);
        return type;
    }
    // 检查是不是进入到了新的页面类型
    checkNewPageType(newType) {
        // 检查当前页面相比上一个页面，类型是否改变
        if (this.type !== newType && this.onPageTypeChange) {
            this.onPageTypeChange();
        }
        // 保存当前页面类型
        this.type = newType;
    }
}
// 储存页面上的有用信息
class PageInfoClass {
    constructor(type) {
        this.pageTitle = '1';
        this.pageUser = '';
        this.pageUserID = '';
        this.pageTag = '';
        this.getPageInfo(type);
    }
    // 获取当前页面的一些信息，用于文件名中
    getPageInfo(type) {
        // 所有页面都可以使用 p_title。这里的 1 用作占位符。因无刷新加载时，要等待 DOM 加载，此时获取到的还是旧页面的值，所以只占位。具体的值在生成文件名时获取。
        const url = window.location.href;
        let tag = '';
        // 只有 1 和 2 可以使用画师信息
        if (type === 1 || type === 2) {
            // 先占位
            this.pageUser = '1';
            this.pageUserID = '1';
            // 1 会在 updateViewer 获取作品信息时获取画师信息，2 在这里单独获取用户信息
            if (type === 2) {
                API.getUserInfo();
            }
            // 如果有 tag 则设置 tag。因为 tag 是从 url 判断的，所以不需要占位
            tag = API.getQuery(url, 'tag');
            this.pageTag = decodeURIComponent(tag);
        }
        else if (type === 5) {
            tag = API.getQuery(url, 'word');
            this.pageTag = decodeURIComponent(tag);
        }
        this.setPageInfoSelector();
    }
    // 把获取到的页面信息添加到下拉选项里
    setPageInfoSelector() {
        let optionHtml = '<option value="default">…</option>';
        const info = new Map([
            ['p_title', this.pageTitle],
            ['p_user', this.pageUser],
            ['p_uid', this.pageUserID],
            ['p_tag', this.pageTag]
        ]);
        for (let [key, value] of info.entries()) {
            if (value) {
                optionHtml += `<option value="{${key}}">{${key}}</option>`;
            }
        }
        setting.xzForm.pageInfoSelect.innerHTML = optionHtml;
    }
}
// 颜色
class Colors {
}
Colors.blue = '#0ea8ef';
Colors.green = '#14ad27';
Colors.red = '#f33939';
//标题栏
class TitleBar {
    constructor() {
        this.titleTimer = 0; // 修改 title 的定时器
    }
    // 检查标题里有没有包含本程序定义的状态字符
    titleHasStatus(status = '') {
        const titleStatus = [
            '[0]',
            '[↑]',
            '[→]',
            '[▶]',
            '[↓]',
            '[║]',
            '[■]',
            '[√]',
            '[ ]'
        ];
        if (!status) {
            // 没有传递 status，则检查所有标记
            for (const str of titleStatus) {
                if (document.title.includes(str)) {
                    return true;
                }
            }
        }
        else {
            // 检查指定标记
            return document.title.includes(status);
        }
        return false;
    }
    // 重设 title
    resetTitle() {
        let type = pageType.getPageType();
        clearInterval(this.titleTimer);
        // 储存标题的 mete 元素。在某些页面不存在，有时也与实际上的标题不一致。
        const ogTitle = document.querySelector('meta[property="og:title"]');
        // 无刷新自动加载的页面里，og:title 标签是最早更新标题的，内容也一致。
        if (ogTitle && (type == 1 || type === 2)) {
            document.title = ogTitle.content;
        }
        else {
            // 如果当前 title 里有状态提醒，则设置为状态后面的文字
            if (this.titleHasStatus()) {
                const index = document.title.indexOf(']');
                document.title = document.title.substr(index + 1, document.title.length);
            }
        }
    }
    // 修改title
    changeTitle(string) {
        // 工作时，本程序的状态会以 [string] 形式添加到 title 最前面，并闪烁提醒
        /*
      0 不显示在标题上，它是把标题复原的信号
      ↑ 抓取中
      → 等待下一步操作（tag搜索页）
      ▶  准备下载
      ↓ 下载中
      ║ 下载暂停
      ■ 下载停止
      √ 下载完毕
      */
        // 重设 title
        if (string === '0') {
            this.resetTitle();
            return;
        }
        const status = `[${string}]`;
        // 如果 title 里没有状态，就添加状态
        if (!this.titleHasStatus()) {
            document.title = `${status} ${document.title}`;
        }
        else {
            // 如果已经有状态了，则替换为新当前传入的状态
            document.title = document.title.replace(/\[.?\]/, status);
        }
        // 当需要执行下一步操作时，闪烁提醒
        if (string === '▶' || string === '→') {
            this.titleTimer = setInterval(() => {
                if (this.titleHasStatus(status)) {
                    document.title = document.title.replace(status, '[ ]');
                }
                else {
                    document.title = document.title.replace('[ ]', status);
                }
            }, 500);
        }
        else {
            clearInterval(this.titleTimer);
        }
    }
}
// DOM 操作类
// 提供公用的 DOM 操作方法，以及依赖于 DOM 的 API
class DOM {
    // 把文本形式的 css 样式插入到页面里
    static insertCSS(text) {
        const styleE = document.createElement('style');
        styleE.textContent = text;
        document.body.appendChild(styleE);
    }
    // 获取可见元素
    static getVisibleEl(selector) {
        const list = document.querySelectorAll(selector);
        return Array.from(list).filter(el => {
            return el.style.display !== 'none';
        });
    }
    // 删除 DOM 元素
    static removeEl(el) {
        if (Reflect.has(el, 'length')) {
            // 如果有 length 属性则循环删除。
            ;
            el.forEach(el => el.parentNode.removeChild(el));
        }
        else {
            // 没有 length 属性的直接删除（querySelector 的返回值是 HTMLElement）
            ;
            el.parentNode.removeChild(el);
        }
    }
    // 切换 DOM 元素k可见性
    static toggleEl(el) {
        el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }
    // 获取用户id
    static getUserId() {
        let userId = '';
        // 首先尝试从 url 中获取
        const test = /(\?|&)id=(\d{1,9})/.exec(window.location.search);
        const nameElement = document.querySelector('.user-name');
        if (test) {
            userId = test[2];
        }
        else if (nameElement) {
            // 从旧版页面的头像获取（在书签页面使用）
            userId = /\?id=(\d{1,9})/.exec(nameElement.href)[1];
        }
        else {
            // 从新版页面的头像获取，因为经常改版，不得已改成从源码匹配了
            const el = document.getElementById('root') ||
                document.getElementById('spa-contents');
            // 在 PC 模式的新版页面使用 root，在手机模式的新版页面使用 spa-contents
            userId = /member\.php\?id=(\d{1,9})/.exec(el.innerHTML)[1];
        }
        return userId;
    }
    // 获取当前页面的页码，在 tag 搜索页和 大家/关注的新作品页面使用
    static getNowPageNo() {
        let no = 1; // 默认只有1页
        // 如果显示有页码，以当前页的页码为起始页码
        if (document.querySelector('.page-list .current')) {
            no = parseInt(document.querySelector('.page-list .current').textContent);
        }
        return no;
    }
    // 获取 token
    static getToken() {
        // 从含有 globalInitData 信息的脚本里，匹配 token 字符串
        const regToken = document.head.innerHTML.match(/token: "(\w+)"/);
        if (regToken && regToken.length > 0) {
            return regToken[1];
        }
        // 从保存 token 的 input 获取
        const tokenInput = document.querySelector('input[name="tt"]');
        if (tokenInput) {
            return tokenInput.value;
        }
        return '';
    }
}
// 用户设置
// 下载面板上可以修改的的选项
class Setting {
    constructor() {
        this.imgNumberPerWork = 0; // 每个作品下载几张图片。0为不限制，全部下载。改为1则只下载第一张。这是因为有时候多p作品会导致要下载的图片过多，此时可以设置只下载前几张，减少下载量
        this.notdownType = ''; // 设置不要下载的作品类型
        this.ugoiraSaveAs = 'webm';
        this.needTag = ''; // 必须包含的tag的列表
        this.notNeedTag = ''; // 要排除的tag的列表
        this.displayCover = true; // 是否显示tag搜索页里面的封面图片。如果tag搜索页的图片数量太多，那么加载封面图可能要很久，并且可能因为占用大量带宽导致抓取中断。这种情况下可以将此参数改为false，不加载封面图。
        this.quietDownload = true;
        this.downloadThreadMax = 5; // 同时下载的线程数的最大值，也是默认值
        this.downloadThread = this.downloadThreadMax; // 同时下载的线程数
        this.userSetName = '{id}';
        this.tagNameToFileName = true;
        this.showOptions = true;
        this.isSetFilterBmk = false; // 是否设置了筛选收藏数
        this.filterBmk = 0; // 要求收藏达到指定数量
        this.wantPage = 0; // 要抓取几页
        this.onlyDownBmk = false; // 是否只下载收藏的作品
        this.isSetFilterWh = false; // 是否设置了筛选宽高
        this.ratioType = '0'; // 宽高比例的类型
        // 宽高条件
        this.filterWh = {
            andOr: '&',
            width: 0,
            height: 0
        };
    }
    // 获取要下载的个数
    getWantPage() {
        const result = API.checkNumberGreater0(setting.xzForm.setWantPage.value);
        if (result.result) {
            return result.value;
        }
        else {
            const msg = lang.transl('_参数不合法1');
            window.alert(msg);
            throw new Error(msg);
        }
    }
    // 获取排除类型
    getNotDownType() {
        let result = Array.from(setting.xzForm.querySelectorAll('.xzFormP5 input')).reduce((result, el, index) => {
            const thisElement = el;
            if (thisElement.checked === false) {
                return (result += index);
            }
            else {
                return result;
            }
        }, '');
        // 如果全部排除则取消任务
        if (setting.notdownType.includes('012')) {
            // notdownType 的结果是顺序的，所以可以直接查找 012
            window.alert(lang.transl('_checkNotdownTypeResult1弹窗'));
            const msg = lang.transl('_checkNotdownTypeResult1Html');
            Log.add(msg, 2, 2);
            throw new Error(msg);
        }
        setting.notdownType = result;
        // 排除了至少一种时，显示提示
        if (setting.notdownType.includes('0') ||
            setting.notdownType.includes('1') ||
            setting.notdownType.includes('2')) {
            Log.add(lang.transl('_checkNotdownTypeResult3Html') +
                setting.notdownType
                    .replace('0', lang.transl('_插画'))
                    .replace('1', lang.transl('_漫画'))
                    .replace('2', lang.transl('_动图')), 1);
        }
        return result;
    }
    // 获取作品张数限制
    getImgNumberPerWork() {
        const checkResult = API.checkNumberGreater0(setting.xzForm.setPNo.value);
        if (checkResult.result) {
            setting.imgNumberPerWork = checkResult.value;
            Log.add(lang.transl('_作品张数提醒', setting.imgNumberPerWork.toString()), 1);
        }
        else {
            setting.imgNumberPerWork = 0;
        }
    }
    // 检查用户输入的 tag 内容
    checkTagString(str) {
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
    // 获取要排除的tag
    getNotNeedTag() {
        setting.notNeedTag = this.checkTagString(setting.xzForm.setTagNotNeed.value);
        Log.add(lang.transl('_设置了排除tag之后的提示') + setting.notNeedTag, 1);
    }
    // 获取必须包含的tag
    getNeedTag() {
        setting.needTag = this.checkTagString(setting.xzForm.setTagNeed.value);
        Log.add(lang.transl('_设置了必须tag之后的提示') + setting.needTag, 1);
    }
    // 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否要排除这个作品。
    checkNotNeedTag(tags) {
        let result = false;
        // 如果设置了排除 tag
        if (setting.notNeedTag.length > 0) {
            for (const tag of tags) {
                if (result) {
                    break;
                }
                for (const notNeed of setting.notNeedTag) {
                    if (tag.toLowerCase() === notNeed.toLowerCase()) {
                        result = true;
                        break;
                    }
                }
            }
        }
        return result;
    }
    // 检查作品是否符合包含 tag 的条件, 如果设置了多个 tag，需要作品里全部包含。返回值表示是否保留这个作品。
    checkNeedTag(tags) {
        let result = false;
        // 如果设置了必须的 tag
        if (setting.needTag.length > 0) {
            let tagNeedMatched = 0;
            const tempTags = new Set();
            // 如果不区分大小写的话，Fate/grandorder 和 Fate/GrandOrder 会被算作符合两个 tag，所以用 Set 结构去重。测试 id 51811780
            for (const tag of tags) {
                tempTags.add(tag.toLowerCase());
            }
            for (const tag of tempTags) {
                for (const need of setting.needTag) {
                    if (tag === need.toLowerCase()) {
                        tagNeedMatched++;
                        break;
                    }
                }
            }
            // 如果全部匹配
            if (tagNeedMatched >= setting.needTag.length) {
                result = true;
            }
        }
        else {
            result = true;
        }
        return result;
    }
    // 获取过滤宽高的设置
    getSetWh() {
        const checkResultWidth = API.checkNumberGreater0(setting.xzForm.setWidth.value);
        const checkResultHeight = API.checkNumberGreater0(setting.xzForm.setHeight.value);
        // 宽高只要有一个条件大于 0 即可
        if (checkResultWidth.value > 0 || checkResultHeight.value > 0) {
            setting.isSetFilterWh = true;
            setting.filterWh = {
                andOr: setting.xzForm.setWidthAndOr.value,
                width: checkResultWidth ? checkResultWidth.value : 0,
                height: checkResultHeight ? checkResultHeight.value : 0
            };
            Log.add(lang.transl('_设置了筛选宽高之后的提示文字p1') +
                setting.filterWh.width +
                setting.filterWh.andOr
                    .replace('|', lang.transl('_或者'))
                    .replace('&', lang.transl('_并且')) +
                lang.transl('_高度设置') +
                setting.filterWh.height, 1);
        }
        else {
            setting.isSetFilterWh = false;
        }
    }
    // 检查作品是否符合过滤宽高的条件
    checkSetWh(width, height) {
        if (setting.isSetFilterWh) {
            // 如果宽高都小于要求的宽高
            if (width < setting.filterWh.width && height < setting.filterWh.height) {
                return false;
            }
            else {
                if (setting.filterWh.andOr === '|') {
                    // 判断or的情况
                    if (width >= setting.filterWh.width ||
                        height >= setting.filterWh.height) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (setting.filterWh.andOr === '&') {
                    // 判断and的情况
                    if (width >= setting.filterWh.width &&
                        height >= setting.filterWh.height) {
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
    // 获取收藏数要求
    getSetBmk() {
        const checkResult = API.checkNumberGreater0(setting.xzForm.setFavNum.value);
        if (checkResult.result) {
            setting.isSetFilterBmk = checkResult.result;
            setting.filterBmk = checkResult.value;
            Log.add(lang.transl('_设置了筛选收藏数之后的提示文字') + setting.filterBmk, 1);
        }
    }
    // 获取只下载书签作品的设置
    getOnlyBmk() {
        setting.onlyDownBmk = setting.xzForm.setOnlyBmk.checked;
        if (setting.onlyDownBmk) {
            Log.add(lang.transl('_只下载已收藏的提示'), 1);
        }
    }
    // 检查作品是否符合【只下载书签作品】的条件,返回值 true 表示包含这个作品
    checkOnlyDownBmk(bookmarked) {
        // 如果设置了只下载书签作品
        if (setting.onlyDownBmk) {
            if (!bookmarked) {
                return false;
            }
            else {
                return true;
            }
        }
        return true;
    }
    // 检查用户输入的页数设置，并返回提示信息
    checkWantPageInput(errorTip, start1Tip, start2Tip) {
        const temp = parseInt(setting.xzForm.setWantPage.value);
        // 如果比 1 小，并且不是 -1，则不通过
        if ((temp < 1 && temp !== -1) || isNaN(temp)) {
            // 比 1 小的数里，只允许 -1 , 0 也不行
            Log.add(errorTip, 2, 2);
            throw new Error('CrawlPage error: Illegal parameter.');
        }
        if (temp >= 1) {
            setting.wantPage = temp;
            Log.add(start1Tip.replace('-num-', setting.wantPage.toString()), 1);
            return true;
        }
        else if (temp === -1) {
            setting.wantPage = temp;
            Log.add(start2Tip, 1);
            return true;
        }
        return false;
    }
    // 获取宽高比的设置
    getRatioSetting() {
        setting.ratioType = setting.xzForm.ratio.value;
        // 不限制
        if (setting.ratioType === '0') {
            return false;
        }
        // 由用户输入
        if (setting.ratioType === '3') {
            const typeNum = parseFloat(setting.xzForm.userRatio.value);
            if (isNaN(typeNum)) {
                setting.ratioType = '0';
                setting.xzForm.ratio.value = setting.ratioType;
                window.alert(lang.transl('_宽高比必须是数字'));
                return false;
            }
        }
        if (setting.ratioType === '1') {
            Log.add(lang.transl('_设置了宽高比之后的提示', lang.transl('_横图')), 1);
        }
        else if (setting.ratioType === '2') {
            Log.add(lang.transl('_设置了宽高比之后的提示', lang.transl('_竖图')), 1);
        }
        else {
            Log.add(lang.transl('_输入宽高比') + setting.xzForm.userRatio.value, 1);
        }
    }
    // 检查作品是否符合宽高比条件
    checkRatio(width, height) {
        if (setting.ratioType === '0') {
            return true;
        }
        else if (setting.ratioType === '1') {
            return width / height > 1;
        }
        else if (setting.ratioType === '2') {
            return width / height < 1;
        }
        else {
            return width / height >= parseFloat(setting.xzForm.userRatio.value);
        }
    }
}
// 初始化下载面板的设置项，以及在用户修改时保存设置
// 只有部分设置会被持久化保存
class InitAndSaveSetting {
    constructor() {
        this.storeName = 'xzSetting';
        // 需要持久化保存的设置。这里预设为成默认值
        this.savedSetting = {
            imgNumberPerWork: setting.imgNumberPerWork,
            notdownType: setting.notdownType,
            ugoiraSaveAs: setting.ugoiraSaveAs,
            needTag: setting.needTag,
            notNeedTag: setting.notNeedTag,
            displayCover: setting.displayCover,
            quietDownload: setting.quietDownload,
            downloadThread: setting.downloadThread,
            userSetName: setting.userSetName,
            tagNameToFileName: setting.tagNameToFileName,
            showOptions: setting.showOptions
        };
    }
    // 初始化下载面板的表单设置，并绑定事件
    init() {
        // 读取储存的设置
        let str = window.localStorage.getItem(this.storeName);
        if (str) {
            // 如果之前已经持久化，则覆盖预设值
            this.savedSetting = JSON.parse(str);
            setting.imgNumberPerWork = this.savedSetting.imgNumberPerWork;
            setting.ugoiraSaveAs = this.savedSetting.ugoiraSaveAs;
            setting.needTag = this.savedSetting.needTag;
            setting.notNeedTag = this.savedSetting.notNeedTag;
            setting.displayCover = this.savedSetting.displayCover;
            setting.quietDownload = this.savedSetting.quietDownload;
            setting.downloadThread = this.savedSetting.downloadThread;
            setting.userSetName = this.savedSetting.userSetName;
            setting.tagNameToFileName = this.savedSetting.tagNameToFileName;
            setting.showOptions = this.savedSetting.showOptions;
            // notdownType 去掉旧版本遗留的 3 和 4
            setting.notdownType = this.savedSetting.notdownType.replace(/3|4/g, '');
        }
        const that = this;
        // 设置作品张数
        const setPNoInput = setting.xzForm.setPNo;
        setPNoInput.value = setting.imgNumberPerWork.toString();
        // 保存作品张数
        setPNoInput.addEventListener('change', function () {
            if (parseInt(this.value) >= 0) {
                that.saveSetting('imgNumberPerWork', this.value);
            }
        });
        // 设置排除类型
        for (let index = 0; index < setting.notdownType.length; index++) {
            let name = 'setWorkType' + setting.notdownType[index];
            setting.xzForm[name].checked = false;
        }
        // 保存排除类型
        for (let index = 0; index < 3; index++) {
            let name = 'setWorkType' + index.toString();
            setting.xzForm[name].addEventListener('click', () => {
                this.saveSetting('notdownType', setting.getNotDownType());
            });
        }
        // 设置动图格式选项
        setting.xzForm.ugoiraSaveAs.value = setting.ugoiraSaveAs;
        // 保存动图格式选项
        for (const input of setting.xzForm.ugoiraSaveAs) {
            input.addEventListener('click', function () {
                that.saveSetting('ugoiraSaveAs', this.value);
            });
        }
        // 设置必须的 tag
        const setTagNeedInput = setting.xzForm.setTagNeed;
        setTagNeedInput.value = setting.needTag;
        // 保存必须的 tag设置
        setTagNeedInput.addEventListener('change', function () {
            that.saveSetting('needTag', this.value);
        });
        // 设置排除的 tag
        const setTagNotNeedInput = setting.xzForm.setTagNotNeed;
        setTagNotNeedInput.value = setting.notNeedTag;
        // 保存排除的 tag设置
        setTagNotNeedInput.addEventListener('change', function () {
            that.saveSetting('notNeedTag', this.value);
        });
        // 设置是否显示封面
        const setDisplayCoverInput = setting.xzForm.setDisplayCover;
        setDisplayCoverInput.checked = setting.displayCover;
        // 保存封面选项
        setDisplayCoverInput.addEventListener('click', function () {
            that.saveSetting('displayCover', this.checked);
        });
        // 设置是否显示选项区域
        const showOptionsBtn = document.querySelector('.centerWrap_toogle_option');
        ui.toggleOptionArea(setting.showOptions);
        // 保存是否显示选项区域
        showOptionsBtn.addEventListener('click', () => {
            setting.showOptions = !setting.showOptions;
            ui.toggleOptionArea(setting.showOptions);
            this.saveSetting('showOptions', setting.showOptions);
        });
        // 设置快速下载
        const setQuietDownloadInput = setting.xzForm.setQuietDownload;
        setQuietDownloadInput.checked = setting.quietDownload;
        // 保存快速下载
        setQuietDownloadInput.addEventListener('click', function () {
            that.saveSetting('quietDownload', this.checked);
        });
        // 设置下载线程
        const setThreadInput = setting.xzForm.setThread;
        setThreadInput.value = setting.downloadThread.toString();
        // 保存下载线程
        setThreadInput.addEventListener('change', function () {
            if (parseInt(this.value) > 0 && parseInt(this.value) <= 5) {
                that.saveSetting('downloadThread', this.value);
            }
        });
        // 设置文件命名规则
        const fileNameRuleInput = setting.xzForm.fileNameRule;
        // pixivision 里，文件名只有 id 标记会生效，所以把文件名部分替换成 id
        if (pageType.getPageType() === 8) {
            fileNameRuleInput.value = '{p_title}/{id}';
        }
        else {
            fileNameRuleInput.value = setting.userSetName;
        }
        // 保存文件命名规则
        fileNameRuleInput.addEventListener('change', function () {
            if (this.value !== '') {
                that.saveSetting('userSetName', this.value);
            }
            else {
                // 把下拉框恢复默认值
                setting.xzForm.fileNameSelect.value = setting.xzForm.fileNameSelect
                    .children[0].value;
            }
        });
        // 是否添加字段名称
        const setTagNameToFileNameInput = setting.xzForm.setTagNameToFileName;
        setTagNameToFileNameInput.checked = setting.tagNameToFileName;
        setTagNameToFileNameInput.addEventListener('click', function () {
            that.saveSetting('tagNameToFileName', this.checked);
        });
    }
    // 储存设置
    saveSetting(key, value) {
        ;
        setting[key] = value;
        this.savedSetting[key] = value;
        window.localStorage.setItem(this.storeName, JSON.stringify(this.savedSetting));
    }
}
// 用户界面类
// 只负责本程序的界面元素，不管理页面上的其他元素
class UI {
    constructor() {
        this.xzTipEl = document.createElement('div'); // 显示提示文本的元素
        this.addTagBtn = document.createElement('button'); // 给未分类作品添加 tag 的按钮
        this.rightButton = document.createElement('div'); // 右侧按钮
        this.centerPanel = document.createElement('div'); // 中间设置面板
        this.centerBtnWrap = document.createElement('div'); // 中间插入按钮的区域
        this.pauseBtn = document.createElement('button'); // 暂停下载按钮
        this.stopBtn = document.createElement('button'); // 停止下载按钮
        this.listenClickIcon();
        this.addUI();
    }
    // 监听点击扩展图标的消息，开关界面
    listenClickIcon() {
        chrome.runtime.onMessage.addListener(msg => {
            if (msg.msg === 'click_icon') {
                if (ui.centerPanel.style.display === 'block') {
                    ui.centerWrapHide();
                }
                else {
                    ui.centerWrapShow();
                }
            }
        });
    }
    // 添加 css 样式
    async loadCss() {
        // css 需要时间来加载，下载器的界面会先显示出来。所以这里先加载一段 css，隐藏界面。
        const preCss = `
    #rightButton,#quick_down_btn,.outputInfoWrap,.XZTipEl,.centerWrap,#down_id_input{
      display:none;
    }`;
        DOM.insertCSS(preCss);
        // 加载本程序的样式
        // 加载 viewerjs 的样式
        let fileList = ['style/style.css', 'style/viewer.min.css'];
        for (const fileName of fileList) {
            const file = await fetch(chrome.extension.getURL(fileName));
            const cssText = await file.text();
            DOM.insertCSS(cssText);
        }
    }
    // 显示最近更新
    showNew(tag) {
        if (window.location.host.includes('pixiv.net') &&
            !window.localStorage.getItem(tag)) {
            const whatIsNewHtml = `
<div class="xz_new">
  <p class="title">Pixiv Batch Downloader ${lang.transl('_最近更新')}</p>
  <p class="content">${lang.transl(tag)}</p>
  <button class="btn">${lang.transl('_确定')}</button>
</div>`;
            document.body.insertAdjacentHTML('afterbegin', whatIsNewHtml);
            const whatIsNewEl = document.querySelector('.xz_new');
            whatIsNewEl.querySelector('.btn').addEventListener('click', () => {
                window.localStorage.setItem(tag, '1');
                whatIsNewEl.parentNode.removeChild(whatIsNewEl);
            });
        }
    }
    // 将元素插入到页面顶部
    /*
  大部分页面使用 header，文章页使用 root。因为在文章页执行时，可能获取不到 header.
  newindex-inner 是在未登录时的画师作品列表页面使用的
  layout-body 是在未登录时的 tag 搜索页使用的
  */
    insertToHead(el) {
        ;
        (document.querySelector('#root>*') ||
            document.querySelector('header') ||
            document.querySelector('.newindex-inner') ||
            document.querySelector('.layout-body')).insertAdjacentElement('beforebegin', el);
    }
    // 向中间面板添加按钮
    addCenterButton(bg = Colors.blue, text = '', attr = []) {
        const e = document.createElement('button');
        e.type = 'button';
        e.style.backgroundColor = bg;
        e.textContent = text;
        for (const [key, value] of attr) {
            e.setAttribute(key, value);
        }
        this.centerBtnWrap.appendChild(e);
        return e;
    }
    // 添加右侧下载按钮
    addRightButton() {
        this.rightButton.textContent = '↓';
        this.rightButton.id = 'rightButton';
        document.body.appendChild(this.rightButton); // 绑定切换右侧按钮显示的事件
        this.rightButton.addEventListener('click', () => {
            this.centerWrapShow();
        }, false);
    }
    // 显示中间面板上的提示。参数 arg 指示鼠标是移入还是移出，并包含鼠标位置
    xzTip(text, arg) {
        if (!text) {
            throw new Error('No tip text.');
        }
        if (arg.type === 1) {
            this.xzTipEl.innerHTML = text;
            this.xzTipEl.style.left = arg.x + 30 + 'px';
            this.xzTipEl.style.top = arg.y - 30 + 'px';
            this.xzTipEl.style.display = 'block';
        }
        else if (arg.type === 0) {
            this.xzTipEl.style.display = 'none';
        }
    }
    // 添加输出 url 列表、文件名列表的面板
    addOutPutPanel() {
        const outputInfoWrap = document.createElement('div');
        document.body.appendChild(outputInfoWrap);
        outputInfoWrap.outerHTML = `
      <div class="outputInfoWrap">
      <div class="outputUrlClose" title="${lang.transl('_关闭')}">X</div>
      <div class="outputUrlTitle">${lang.transl('_输出信息')}</div>
      <div class="outputInfoContent"></div>
      <div class="outputUrlFooter">
      <div class="outputUrlCopy" title="">${lang.transl('_复制')}</div>
      </div>
      </div>
      `;
        // 关闭输出区域
        document.querySelector('.outputUrlClose').addEventListener('click', () => {
            ;
            document.querySelector('.outputInfoWrap').style.display = 'none';
        });
        // 复制输出内容
        document.querySelector('.outputUrlCopy').addEventListener('click', () => {
            const range = document.createRange();
            range.selectNodeContents(document.querySelector('.outputInfoContent'));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            // 改变提示文字
            document.querySelector('.outputUrlCopy').textContent = lang.transl('_已复制到剪贴板');
            setTimeout(() => {
                window.getSelection().removeAllRanges();
                document.querySelector('.outputUrlCopy').textContent = lang.transl('_复制');
            }, 1000);
        });
    }
    // 添加下载面板
    addDownloadPanel() {
        document.body.appendChild(this.centerPanel);
        this.centerPanel.outerHTML = `
      <div class="XZTipEl"></div>
      <div class="centerWrap">
      <div class="centerWrap_head">
      <span class="centerWrap_title xz_blue"> ${lang.transl('_下载设置')}</span>
      <div class="btns">
      <a class="xztip centerWrap_top_btn update" data-tip="${lang.transl('_newver')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank"><img src="${chrome.extension.getURL('images/update.png')}" /></a>
      <a class="xztip centerWrap_top_btn wiki_url" data-tip="${lang.transl('_wiki')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"><img src="${chrome.extension.getURL('images/wiki.png')}" /></a>
      <a class="xztip centerWrap_top_btn" data-tip="${lang.transl('_github')}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank"><img src="${chrome.extension.getURL('images/github-logo.png')}" /></a>
        <div class="xztip centerWrap_top_btn centerWrap_toogle_option" data-tip="${lang.transl('_收起展开设置项')}">▲</div>
        <div class="xztip centerWrap_top_btn centerWrap_close" data-tip="${lang.transl('_快捷键切换显示隐藏')}">X</div>
      </div>
      </div>
      <div class="centerWrap_con">
      <form class="xzForm">
      <div class="xz_option_area">
      <p class="xzFormP1">
      <span class="setWantPageWrap">
      <span class="xztip settingNameStyle1 setWantPageTip1" data-tip="" style="margin-right: 0px;">${lang.transl('_页数')}</span><span class="gray1" style="margin-right: 10px;"> ? </span>
      <input type="text" name="setWantPage" class="setinput_style1 xz_blue setWantPage">&nbsp;&nbsp;&nbsp;
      <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
      </span>
      </p>
      <p class="xzFormP3">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_多p下载前几张提示')}">${lang.transl('_多p下载前几张')}<span class="gray1"> ? </span></span>
      <input type="text" name="setPNo" class="setinput_style1 xz_blue" value="${setting.imgNumberPerWork}">
      </p>
      <p class="xzFormP5">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_下载作品类型的提示Center')}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <label for="setWorkType0"><input type="checkbox" name="setWorkType0" id="setWorkType0" checked> ${lang.transl('_插画')}&nbsp;</label>
      <label for="setWorkType1"><input type="checkbox" name="setWorkType1" id="setWorkType1" checked> ${lang.transl('_漫画')}&nbsp;</label>
      <label for="setWorkType2"><input type="checkbox" name="setWorkType2" id="setWorkType2" checked> ${lang.transl('_动图')}&nbsp;</label>
      </p>
      <p class="xzFormP12">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_动图保存格式title')}">${lang.transl('_动图保存格式')}<span class="gray1"> ? </span></span>
      <label for="ugoiraSaveAs1"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" value="webm" checked> ${lang.transl('_webmVideo')} &nbsp;</label>
      <label for="ugoiraSaveAs3"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" value="gif" checked> ${lang.transl('_gif')} &nbsp;</label>
      <label for="ugoiraSaveAs2"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" value="zip"> ${lang.transl('_zipFile')} &nbsp;</label>
      </p>
      <p class="xzFormP2">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_筛选收藏数的提示Center')}">${lang.transl('_筛选收藏数Center')}<span class="gray1"> ? </span></span>
      <input type="text" name="setFavNum" class="setinput_style1 xz_blue" value="0">&nbsp;&nbsp;&nbsp;&nbsp;
      </p>
      <p class="xzFormP11">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_只下载已收藏的提示')}">${lang.transl('_只下载已收藏')}<span class="gray1"> ? </span></span>
      <label for="setOnlyBmk"><input type="checkbox" name="setOnlyBmk" id="setOnlyBmk"> ${lang.transl('_启用')}</label>
      </p>
      <p class="xzFormP4">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_筛选宽高的按钮Title')} ${lang.transl('_筛选宽高的提示文字')}">${lang.transl('_筛选宽高的按钮文字')}<span class="gray1"> ? </span></span>
      <input type="text" name="setWidth" class="setinput_style1 xz_blue" value="0">
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" value="&" checked> <label for="setWidth_AndOr1">and&nbsp;</label>
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" value="|"> <label for="setWidth_AndOr2">or&nbsp;</label>
      <input type="text" name="setHeight" class="setinput_style1 xz_blue" value="0">
      </p>
      <p class="xzFormP13">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_设置宽高比例Title')}">${lang.transl('_设置宽高比例')}<span class="gray1"> ? </span></span>
      <input type="radio" name="ratio" id="ratio0" value="0" checked> <label for="ratio0"> ${lang.transl('_不限制')}&nbsp; </label>
      <input type="radio" name="ratio" id="ratio1" value="1"> <label for="ratio1"> ${lang.transl('_横图')}&nbsp; </label>
      <input type="radio" name="ratio" id="ratio2" value="2"> <label for="ratio2"> ${lang.transl('_竖图')}&nbsp; </label>
      <input type="radio" name="ratio" id="ratio3" value="3"> <label for="ratio3"> ${lang.transl('_输入宽高比')}<input type="text" name="userRatio" class="setinput_style1 xz_blue" value="1.4"></label>
      </p>
      <p class="xzFormP6">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_必须tag的提示文字')}">${lang.transl('_必须含有tag')}<span class="gray1"> ? </span></span>
      <input type="text" name="setTagNeed" class="setinput_style1 xz_blue setinput_tag">
      </p>
      <p class="xzFormP7">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_排除tag的提示文字')}">${lang.transl('_不能含有tag')}<span class="gray1"> ? </span></span>
      <input type="text" name="setTagNotNeed" class="setinput_style1 xz_blue setinput_tag">
      </p>
      <p class="xzFormP9">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_显示封面的提示')}">${lang.transl('_是否显示封面')}<span class="gray1"> ? </span></span>
      <label for="setDisplayCover"><input type="checkbox" name="setDisplayCover" id="setDisplayCover" checked> ${lang.transl('_显示')}</label>
      </p>
      <p class="xzFormP8">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_快速下载的提示')}">${lang.transl('_是否自动下载')}<span class="gray1"> ? </span></span>
      <label for="setQuietDownload"><input type="checkbox" name="setQuietDownload" id="setQuietDownload"> ${lang.transl('_启用')}</label>
      </p>
      </div>
      <div class="centerWrap_btns centerWrap_btns_free" id="centerWrap_btns_free">
  
      </div>
      <p> ${lang.transl('_设置命名规则3', '<span class="fwb xz_blue imgNum">0</span>')}</p>
      <p>
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_线程数字')}">${lang.transl('_设置下载线程')}<span class="gray1"> ? </span></span>
      <input type="text" name="setThread" class="setinput_style1 xz_blue" value="${setting.downloadThread}">
      </p>
      <p>
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_设置文件夹名的提示')}">${lang.transl('_设置文件名')}<span class="gray1"> ? </span></span>
      <input type="text" name="fileNameRule" class="setinput_style1 xz_blue fileNameRule" value="{id}">
      &nbsp;
      <select name="pageInfoSelect">
      </select>
      &nbsp;
      <select name="fileNameSelect">
        <option value="default">…</option>
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
      <span class="gray1 showFileNameTip">？</span>
      </p>
      <p class="fileNameTip tip">
      ${lang.transl('_设置文件夹名的提示').replace('<br>', '. ')}
      <br>
      <span class="xz_blue">{p_user}</span>
      ${lang.transl('_文件夹标记PUser')}
      <br>
      <span class="xz_blue">{p_uid}</span>
      ${lang.transl('_文件夹标记PUid')}
      <br>
      <span class="xz_blue">{p_tag}</span>
      ${lang.transl('_文件夹标记PTag')}
      <br>
      <span class="xz_blue">{p_title}</span>
      ${lang.transl('_文件夹标记PTitle')}
      <br>
      <span class="xz_blue">{id}</span>
      ${lang.transl('_命名标记1')}
      <br>
      <span class="xz_blue">{title}</span>
      ${lang.transl('_命名标记2')}
      <br>
      <span class="xz_blue">{tags}</span>
      ${lang.transl('_命名标记3')}
      <br>
      <span class="xz_blue">{tags_translate}</span>
      ${lang.transl('_命名标记11')}
      <br>
      <span class="xz_blue">{user}</span>
      ${lang.transl('_命名标记4')}
      <br>
      <span class="xz_blue">{userid}</span>
      ${lang.transl('_命名标记6')}
      <br>
      <span class="xz_blue">{date}</span>
      ${lang.transl('_命名标记12')}
      <br>
      <span class="xz_blue">{type}</span>
      ${lang.transl('_命名标记14')}
      <br>
      <span class="xz_blue">{bmk}</span>
      ${lang.transl('_命名标记8')}
      <br>
      <span class="xz_blue">{px}</span>
      ${lang.transl('_命名标记7')}
      <br>
      <span class="xz_blue">{id_num}</span>
      ${lang.transl('_命名标记9')}
      <br>
      <span class="xz_blue">{p_num}</span>
      ${lang.transl('_命名标记10')}
      <br>
      <span class="xz_blue">{rank}</span>
      ${lang.transl('_命名标记13')}
      <br>
      ${lang.transl('_命名标记提醒')}
      </p>
      <p class="xzFormP10">
      <span class="xztip settingNameStyle1" data-tip="${lang.transl('_添加字段名称提示')}">${lang.transl('_添加字段名称')}<span class="gray1"> ? </span></span>
      <label for="setTagNameToFileName"><input type="checkbox" name="setTagNameToFileName" id="setTagNameToFileName" checked> ${lang.transl('_启用')}</label>
      &nbsp;&nbsp;&nbsp;
      <span class="gray1 showFileNameResult"> ${lang.transl('_预览文件名')}</span>
      </p>
      </form>
      <div class="download_panel">
      <div class="centerWrap_btns">
      <button class="startDownload" type="button" style="background:${Colors.blue};"> ${lang.transl('_下载按钮1')}</button>
      <button class="pauseDownload" type="button" style="background:#e49d00;"> ${lang.transl('_下载按钮2')}</button>
      <button class="stopDownload" type="button" style="background:${Colors.red};"> ${lang.transl('_下载按钮3')}</button>
      <button class="copyUrl" type="button" style="background:${Colors.green};"> ${lang.transl('_下载按钮4')}</button>
      </div>
      <div class="centerWrap_down_tips">
      <p>
      ${lang.transl('_当前状态')}
      <span class="down_status xz_blue"> ${lang.transl('_未开始下载')}</span>
      <span class="convert_tip xz_blue"></span>
      </p>
      <div class="progressBarWrap">
      <span class="text">${lang.transl('_下载进度')}</span>
      <div class="right1">
      <div class="progressBar progressBar1">
      <div class="progress progress1"></div>
      </div>
      <div class="progressTip progressTip1">
      <span class="downloaded">0</span>
      /
      <span class="imgNum">0</span>
      </div>
      </div>
      </div>
      </div>
      <div class="centerWrap_down_list">
      <ul>
      <li class="downloadBar">
      <div class="progressBar progressBar2">
      <div class="progress progress2"></div>
      </div>
      <div class="progressTip progressTip2">
      <span class="download_fileName"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${lang.transl('_已下载')}&nbsp;&nbsp;<span class="loaded">0/0</span>KB
      </div>
      </li>
      </ul>
      </div>
      </div>
      <p class="gray1"> 
      <span class="showDownTip">${lang.transl('_查看下载说明')}</span>
      <a class="xztip centerWrap_top_btn wiki2" href="https://github.com/xuejianxianzun/PixivBatchDownloader/wiki" target="_blank"><img src="${chrome.extension.getURL('images/wiki.png')}" /> ${lang.transl('_wiki')}</a></p>
      <p class="downTip tip"> ${lang.transl('_下载说明')}</p>
      </div>
      `;
        this.centerPanel = document.querySelector('.centerWrap');
        this.centerBtnWrap = document.getElementById('centerWrap_btns_free');
        setting.xzForm = document.querySelector('.xzForm');
        this.pauseBtn = document.querySelector('.pauseDownload');
        this.stopBtn = document.querySelector('.stopDownload');
    }
    // 添加 UI
    async addUI() {
        this.loadCss();
        this.addRightButton();
        this.addOutPutPanel();
        this.addDownloadPanel();
        this.downloadPanelEvents();
    }
    // 显示提示
    bindXzTip() {
        this.xzTipEl = document.querySelector('.XZTipEl');
        if (!this.xzTipEl) {
            throw new Error('xzTipEl not exists');
        }
        const xztips = document.querySelectorAll('.xztip');
        for (const el of xztips) {
            for (const ev of ['mouseenter', 'mouseleave']) {
                el.addEventListener(ev, event => {
                    const e = (event || window.event);
                    const text = el.dataset.tip;
                    this.xzTip(text, {
                        type: ev === 'mouseenter' ? 1 : 0,
                        x: e.clientX,
                        y: e.clientY
                    });
                });
            }
        }
    }
    // 把下拉框的选择项插入到文本框里
    insertValueToInput(form, to) {
        form.addEventListener('change', () => {
            if (form.value !== 'default') {
                // 把选择项插入到光标位置,并设置新的光标位置
                const position = to.selectionStart;
                to.value =
                    to.value.substr(0, position) +
                        form.value +
                        to.value.substr(position, to.value.length);
                to.selectionStart = position + form.value.length;
                to.selectionEnd = position + form.value.length;
                to.focus();
                // 保存命名规则
                initSetting.saveSetting('userSetName', to.value);
            }
        });
    }
    // 绑定中间面板的事件
    downloadPanelEvents() {
        // 关闭中间面板
        document
            .querySelector('.centerWrap_close')
            .addEventListener('click', () => {
            this.centerWrapHide();
        });
        // 使用快捷键 Alt + x 切换中间面板显示隐藏
        window.addEventListener('keydown', event => {
            const e = event || window.event;
            if (e.altKey && e.keyCode === 88) {
                const nowDisplay = this.centerPanel.style.display;
                if (nowDisplay === 'block') {
                    this.centerWrapHide();
                }
                else {
                    this.centerWrapShow();
                }
            }
        }, false);
        // 预览文件名
        document
            .querySelector('.showFileNameResult')
            .addEventListener('click', () => {
            output.previewFileName();
        });
        // 显示 url
        document.querySelector('.copyUrl').addEventListener('click', () => {
            output.showUrls();
        });
        // 显示命名字段提示
        document
            .querySelector('.showFileNameTip')
            .addEventListener('click', () => DOM.toggleEl(document.querySelector('.fileNameTip')));
        // 显示下载说明
        document
            .querySelector('.showDownTip')
            .addEventListener('click', () => DOM.toggleEl(document.querySelector('.downTip')));
        // 开始下载按钮
        document.querySelector('.startDownload').addEventListener('click', () => {
            dlCtrl.startDownload();
        });
        // 暂停下载按钮
        this.pauseBtn.addEventListener('click', () => {
            dlCtrl.pauseDownload();
        });
        // 停止下载按钮
        this.stopBtn.addEventListener('click', () => {
            dlCtrl.stopDownload();
        });
        // 给有提示的元素绑定事件
        this.bindXzTip();
        // 输入框获得焦点时自动选择文本（文件名输入框例外）
        const centerInputs = setting.xzForm.querySelectorAll('input[type=text]');
        for (const el of centerInputs) {
            if (el.name !== 'fileNameRule') {
                el.addEventListener('focus', function () {
                    this.select();
                });
            }
        }
        // 把下拉框的选择项插入到文本框里
        this.insertValueToInput(setting.xzForm.pageInfoSelect, setting.xzForm.fileNameRule);
        this.insertValueToInput(setting.xzForm.fileNameSelect, setting.xzForm.fileNameRule);
    }
    // 收起展开选项设置区域
    toggleOptionArea(bool) {
        const xzOptionArea = (document.querySelector('.xz_option_area'));
        xzOptionArea.style.display = bool ? 'block' : 'none';
        document.querySelector('.centerWrap_toogle_option').innerHTML = bool
            ? '▲'
            : '▼';
    }
    // 提示下载状态
    changeDownStatus(str) {
        document.querySelector('.down_status').innerHTML = str;
    }
    // 重置下载面板的信息
    resetDownloadPanel() {
        this.showDownloaded();
        for (const el of document.querySelectorAll('.imgNum')) {
            el.textContent = store.downloadList.length.toString();
        }
        for (const el of document.querySelectorAll('.download_fileName')) {
            el.textContent = '';
        }
        for (const el of document.querySelectorAll('.loaded')) {
            el.textContent = '0/0';
        }
        for (const el of document.querySelectorAll('.progress')) {
            ;
            el.style.width = '0%';
        }
    }
    // 显示或隐藏下载面板
    downloadPanelDisplay(str) {
        const download_panel = document.querySelector('.download_panel');
        download_panel.style.display = str;
    }
    // 显示中间区域
    centerWrapShow() {
        this.centerPanel.style.display = 'block';
        this.rightButton.style.display = 'none';
    }
    // 隐藏中间区域
    centerWrapHide() {
        this.centerPanel.style.display = 'none';
        this.rightButton.style.display = 'block';
        const outputInfoWrap = document.querySelector('.outputInfoWrap');
        outputInfoWrap.style.display = 'none';
    }
    // 在进度条上显示已下载数量
    showDownloaded() {
        document.querySelector('.downloaded').textContent = dl.downloaded.toString();
    }
}
// 日志类
class Log {
    // 如果日志元素没有添加到页面上，则添加上去
    static checkElement() {
        let test = document.getElementById(this.id);
        if (test === null) {
            this.logArea.id = this.id;
            ui.insertToHead(this.logArea);
        }
    }
    // 清空日志
    static clear() {
        this.logArea.innerHTML = '';
    }
    // 输出日志
    /*
    str 信息文本，必要参数
    level 日志等级，可选，默认值为 -1
    br 换行标签的个数，可选，默认值为 1
    addMode 追加日志的模式，默认为 true，累加所有日志。false 则会建立快照，只在快照后追加最后一条日志。
  
    日志等级：
    -1 auto 不设置颜色
    0 success 绿色
    1 warring 黄色
    2 error 红色
    */
    static add(str, level = -1, br = 1, addMode = true) {
        this.checkElement();
        let base = '';
        // 处理添加状态
        if (addMode) {
            // 追加日志时，清空日志快照
            this.logSnapshot = '';
            base = this.logArea.innerHTML; // 使用当前日志信息
        }
        else {
            // 只追加最新一条时，先做快照
            if (this.logSnapshot === '') {
                this.logSnapshot = this.logArea.innerHTML;
            }
            base = this.logSnapshot; // 使用快照
        }
        // 添加颜色
        if (level > -1) {
            str = `<span style="color:${this.colors[level]}">${str}</span>`;
        }
        // 添加换行符
        str += '<br>'.repeat(br);
        // 输出
        this.logArea.innerHTML = base + str;
    }
}
Log.logArea = document.createElement('div'); // 输出日志的区域
Log.id = 'outputArea'; // 日志区域元素的 id
Log.colors = ['#00ca19', '#d27e00', '#f00'];
// 图片查看器类
class ImgViewer {
    constructor() {
        this.viewerUl = document.createElement('ul'); // 图片列表的 ul 元素
        this.viewerWarpper = document.createElement('div'); // 图片列表的容器
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
                    size: ToolbarButtonSize.Large
                },
                next: 1,
                rotateLeft: 0,
                rotateRight: 0,
                flipHorizontal: 0,
                flipVertical: 0
            },
            url(image) {
                return image.dataset.src;
            },
            viewed(event) {
                // 当图片显示完成（加载完成）后，预加载下一张图片
                const ev = event || window.event;
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
            tooltip: false
        });
    }
    // 初始化图片查看器
    initViewer() {
        // 检查图片查看器元素是否已经生成
        if (!document.getElementById('viewerWarpper')) {
            // 创建图片查看器
            this.createViewer();
        }
        else {
            // 更新数据
            this.updateViewer();
        }
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
        document.addEventListener('keyup', event => {
            const e = event || window.event;
            if (e.keyCode === 27) {
                // 按下 esc
                // 如果非全屏，且查看器已经打开，则退出查看器
                if (!this.isFullscreen() && this.viewerIsShow()) {
                    ;
                    document.querySelector('.viewer-close').click();
                }
            }
        });
        void [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange'
        ].forEach(arg => {
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
    updateViewer() {
        this.viewerWarpper.style.display = 'none'; // 先隐藏 viewerWarpper
        // 获取作品信息
        fetch('https://www.pixiv.net/ajax/illust/' + API.getIllustId(), {
            method: 'get',
            credentials: 'same-origin' // 附带 cookie
        })
            .then(response => response.json())
            .then((data) => {
            const thisOneData = data.body;
            pageInfo.pageUser = thisOneData.userName;
            pageInfo.pageUserID = thisOneData.userId;
            // 更新图片查看器
            if (thisOneData.illustType === 0 || thisOneData.illustType === 1) {
                // 插画或漫画
                if (thisOneData.pageCount > 1) {
                    // 有多张图片时，创建缩略图
                    const { thumb, original } = thisOneData.urls;
                    this.viewerUl.innerHTML = new Array(thisOneData.pageCount)
                        .fill(1)
                        .reduce((html, now, index) => {
                        return (html += `<li><img src="${thumb.replace('p0', 'p' + index)}" data-src="${original.replace('p0', 'p' + index)}"></li>`);
                    }, '');
                    // 数据更新后，显示 viewerWarpper
                    this.viewerWarpper.style.display = 'block';
                    // 销毁看图组件
                    if (this.myViewer) {
                        this.myViewer.destroy();
                    }
                    // 重新配置看图组件
                    this.newViewer(thisOneData.pageCount, original);
                    // 预加载第一张图片
                    const img = new Image();
                    img.src = original;
                }
            }
        });
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
        this.myViewer.zoomTo(1);
        // 获取网页宽高
        const htmlWidth = document.documentElement.clientWidth;
        const htmlHeight = document.documentElement.clientHeight;
        // 设置边距
        const setWidth = (htmlWidth - parseInt(imgWidth)) / 2;
        let setHeight = (htmlHeight - parseInt(imgHeight)) / 2;
        // 当图片高度大于浏览器窗口高度时，居顶显示而不是居中
        if (setHeight < 0) {
            setHeight = 0;
        }
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
// api 类
// 不依赖页面元素或者下载器的状态，可独立使用的纯粹的 api
class API {
    // 根据对象的属性排序
    static sortByProperty(propertyName) {
        // 排序的内容有时可能是字符串，需要转换成数字排序
        return function (object1, object2) {
            const value1 = parseInt(object1[propertyName]);
            const value2 = parseInt(object2[propertyName]);
            // 倒序排列
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
    // 检查参数是否是大于 0 的数字
    static checkNumberGreater0(arg) {
        let thisArg = parseInt(arg);
        // 空值会是 NaN
        if (!isNaN(thisArg) && thisArg > 0) {
            // 符合条件
            return {
                result: true,
                value: thisArg
            };
        }
        // 不符合条件
        return {
            result: false,
            value: 0
        };
    }
    // 获取用户信息。可以传入 id，或者自动获取当前页面的用户 id
    static getUserInfo(id = '') {
        fetch(`https://www.pixiv.net/ajax/user/${id || DOM.getUserId()}/profile/top`, {
            method: 'get',
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then((data) => {
            // 设置 pageInfo 的信息
            let useData = {};
            // 如果有插画作品
            if (Object.keys(data.body.illusts).length > 0) {
                useData = data.body.illusts;
            }
            else if (Object.keys(data.body.manga).length > 0) {
                // 如果没有插画作品，则从漫画作品中查找
                useData = data.body.manga;
            }
            else {
                // 查找不到
                pageInfo.pageUser = '';
                pageInfo.pageUserID = '';
                return;
            }
            let keys = Object.keys(useData);
            let first = useData[keys[0]];
            pageInfo.pageUser = first.userName;
            pageInfo.pageUserID = first.userId;
        });
    }
    // 从 url 里获取作品id，可以传参，无参数则使用当前页面的 url 匹配
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
            // 直接取出 url 中的数字
            return /\d*\d/.exec(location.href)[0];
        }
    }
    // 从 url 中获取指定的查询条件
    static getQuery(url, query) {
        const result = new URL(url).searchParams.get(query);
        return result || '';
    }
}
// 书签相关类
class Bookmark {
    constructor() {
        this.quickBookmarkEl = document.createElement('a'); // 快速收藏的元素
    }
    // 快速收藏
    quickBookmark() {
        const tt = DOM.getToken();
        if (!tt) {
            // 如果获取不到 token，则不展开本程序的快速收藏功能
            throw new Error('Token not found!');
        }
        // 因为切换作品（pushstate）时，不能准确的知道 toolbar 何时更新，所以只能不断检测
        setTimeout(() => {
            this.quickBookmark();
        }, 300);
        // 因为 p 站改版 class 经常变，所以从父元素查找，父元素的 class 变化没那么频繁
        const toolbarParent = document.querySelectorAll('main > section');
        let toolbar; // 作品下方的工具栏
        for (const el of toolbarParent) {
            if (el.querySelector('div>section')) {
                toolbar = el.querySelector('div>section');
                break;
            }
        }
        if (toolbar) {
            this.quickBookmarkEl = document.querySelector('#quickBookmarkEl');
            // 如果没有 quick 元素则添加
            if (!this.quickBookmarkEl) {
                // 创建快速收藏元素
                this.quickBookmarkEl = document.createElement('a');
                this.quickBookmarkEl.id = 'quickBookmarkEl';
                this.quickBookmarkEl.innerHTML = '✩';
                this.quickBookmarkEl.href = 'javascript:void(0)';
                this.quickBookmarkEl.title = lang.transl('_快速收藏');
                toolbar.insertBefore(this.quickBookmarkEl, toolbar.childNodes[3]);
                // 隐藏原来的收藏按钮并检测收藏状态
                const orgIcon = toolbar.childNodes[2];
                orgIcon.style.display = 'none';
                const heart = orgIcon.querySelector('svg');
                if (window.getComputedStyle(heart)['fill'] === 'rgb(255, 64, 96)') {
                    // 如果已经收藏过了
                    this.quickBookmarkEnd();
                }
                else {
                    // 准备快速收藏
                    this.readyQuickBookmark();
                }
            }
            else {
                // 如果有 quick 元素，什么都不做
                return;
            }
        }
    }
    // 准备快速收藏
    readyQuickBookmark() {
        this.quickBookmarkEl.addEventListener('click', () => {
            ;
            document.querySelector('._35vRH4a').click(); // 自动点赞
            // 储存 tag
            const tagElements = document.querySelectorAll('._1LEXQ_3 li');
            const tagArray = Array.from(tagElements).map(el => {
                const nowA = el.querySelector('a');
                if (nowA) {
                    let nowTag = nowA.textContent;
                    // 对于原创作品，非日文的页面上只显示了用户语言的“原创”，替换成日文 tag “オリジナル”。
                    if (nowTag === '原创' || nowTag === 'Original' || nowTag === '창작') {
                        nowTag = 'オリジナル';
                    }
                    return nowTag;
                }
            });
            const tagString = encodeURI(tagArray.join(' '));
            // 调用添加收藏的 api
            this.addBookmark(API.getIllustId(), tagString, DOM.getToken(), false)
                .then(response => response.json())
                .then(data => {
                if (data.error !== undefined && data.error === false) {
                    this.quickBookmarkEnd();
                }
            });
        });
    }
    // 添加收藏
    async addBookmark(id, tags, tt, hide) {
        let restrict;
        if (!hide) {
            // 公开作品
            restrict = 0;
        }
        else {
            // 非公开作品
            restrict = 1;
        }
        return fetch('https://www.pixiv.net/rpc/index.php', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'same-origin',
            body: `mode=save_illust_bookmark&illust_id=${id}&restrict=${restrict}&comment=&tags=${tags}&tt=${tt}`
        });
    }
    // 如果这个作品已收藏，则改变样式
    quickBookmarkEnd() {
        this.quickBookmarkEl.style.color = '#FF4060';
        this.quickBookmarkEl.href = `/bookmark_add.php?type=illust&illust_id=${API.getIllustId()}`;
    }
    // 获取未分类书签的 tag 信息
    getInfoFromBookmark(url) {
        ui.addTagBtn.textContent = `loading`;
        return fetch(url, {
            credentials: 'same-origin'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                if (response.status === 403) {
                    ui.addTagBtn.textContent = `× permission denied`;
                }
                throw new Error(response.status.toString());
            }
        })
            .then(data => {
            const works = data.body.works;
            const result = [];
            if (works.length > 0 && works[0].bookmarkData) {
                // 判断作品的 bookmarkData，如果为假说明这是在别人的收藏页面，不再获取数据。
                works.forEach(item => {
                    result.push({
                        id: item.id,
                        tags: encodeURI(item.tags.join(' ')),
                        restrict: item.bookmarkData.private
                    });
                });
            }
            return result;
        });
    }
    // 准备添加 tag。loop 表示这是第几轮循环
    async readyAddTag(loop = 0) {
        const offset = loop * 100; // 一次请求只能获取 100 个，所以可能有多次请求，要计算偏移量
        // 配置 url
        const showUrl = `https://www.pixiv.net/ajax/user/${DOM.getUserId()}/illusts/bookmarks?tag=${encodeURI('未分類')}&offset=${offset}&limit=100&rest=show&rdm=${Math.random()}`; // 公开的未分类收藏
        const hideUrl = showUrl.replace('show', 'hide'); // 非公开的未分类收藏
        // 发起请求
        const [showData, hideData] = await Promise.all([
            this.getInfoFromBookmark(showUrl),
            this.getInfoFromBookmark(hideUrl)
        ]);
        // 保存结果
        store.addTagList = store.addTagList.concat(showData);
        store.addTagList = store.addTagList.concat(hideData);
        // 进行下一步的处理
        if (store.addTagList.length === 0) {
            // 如果结果为空，不需要处理
            ui.addTagBtn.textContent = `√ no need`;
            ui.addTagBtn.removeAttribute('disabled');
            return;
        }
        else {
            // 判断是否获取完毕，如果本次请求获取的数据为空，则已经没有数据
            if (showData.length === 0 && hideData.length === 0) {
                // 已经获取完毕
                this.addTag(0, store.addTagList, DOM.getToken());
            }
            else {
                // 需要继续获取
                this.readyAddTag(++loop);
            }
        }
    }
    // 给未分类作品添加 tag
    async addTag(index, addList, tt) {
        const item = addList[index];
        await this.addBookmark(item.id, item.tags, tt, item.restrict);
        if (index < addList.length - 1) {
            index++;
            ui.addTagBtn.textContent = `${index} / ${addList.length}`;
            // 继续添加下一个
            this.addTag(index, addList, tt);
        }
        else {
            ui.addTagBtn.textContent = `√ complete`;
            ui.addTagBtn.removeAttribute('disabled');
        }
    }
}
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
        let content = xzLang[name][this.langType];
        arg.forEach(val => (content = content.replace('{}', val)));
        return content;
    }
}
// 转换动图类
class ConvertUgoira {
    constructor() {
        this.gifWorkerUrl = '';
        this.count = 0; // 统计有几个转换任务
        this.convertTipText = '';
        this.loadWorkerJS();
    }
    async loadWorkerJS() {
        // 添加 zip 的 worker 文件
        let zipWorker = await fetch(chrome.extension.getURL('lib/z-worker.js'));
        const zipWorkerBolb = await zipWorker.blob();
        const zipWorkerUrl = URL.createObjectURL(zipWorkerBolb);
        if (zip) {
            zip.workerScripts = {
                inflater: [zipWorkerUrl]
            };
        }
        // 添加 gif 的 worker 文件
        let gifWorker = await fetch(chrome.extension.getURL('lib/gif.worker.js'));
        const gifWorkerBolb = await gifWorker.blob();
        this.gifWorkerUrl = URL.createObjectURL(gifWorkerBolb);
    }
    get getCount() {
        return this.count;
    }
    // 设置计数
    set setCount(value) {
        this.count = value;
        // 在下载面板显示转换数量
        const convertTip = document.querySelector('.convert_tip');
        if (this.count > 0) {
            this.convertTipText = lang.transl('_转换任务提示', this.count.toString());
        }
        else {
            this.convertTipText = '';
        }
        convertTip.innerText = this.convertTipText;
        // 在日志里显示转换数量
        dlFile.showTotalProgress();
    }
    // 解压 zip 文件
    async readZip(zipFile, ugoiraInfo) {
        return new Promise(function (resolve, reject) {
            zip.createReader(new zip.BlobReader(zipFile), (zipReader) => {
                // 读取成功时的回调函数，files 保存了文件列表的信息
                zipReader.getEntries((files) => {
                    // 创建数组，长度与文件数量一致
                    const imgFile = new Array(files.length);
                    // 获取每个文件的数据。因为这个操作是异步的，所以必须检查图片数量
                    files.forEach((file) => {
                        file.getData(new zip.Data64URIWriter(ugoiraInfo.mimeType), (data) => {
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
                Log.add('error: readZIP error.', 2, 2);
                reject(new Error('readZIP error: ' + message));
            });
        });
    }
    // 添加每一帧的数据
    async getFrameData(imgFile, type = 'webm') {
        const resultList = new Array(imgFile.length);
        return new Promise(function (resolve, reject) {
            const drawImg = function (index) {
                const img = new Image();
                img.onload = function (event) {
                    // 处理视频
                    if (type === 'webm') {
                        const xzCanvas = document.createElement('canvas');
                        const ctx = xzCanvas.getContext('2d');
                        xzCanvas.width = img.width;
                        xzCanvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        resultList[index] = xzCanvas;
                    }
                    // 处理 gif
                    if (type === 'gif') {
                        resultList[index] = img;
                    }
                    // 继续下一个
                    if (index < imgFile.length - 1) {
                        index++;
                        drawImg(index);
                    }
                    else {
                        resolve(resultList);
                    }
                };
                img.src = imgFile[index];
            };
            // onload 完成时的顺序和添加事件时的顺序不一致，为了避免图片顺序乱掉，这里逐个添加每个图片
            drawImg(0);
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
    // 开始转换，主要是解压文件
    async start(file, info) {
        this.setCount++; // 增加计数
        return new Promise(async (resolve, reject) => {
            // 将压缩包里的图片转换为 base64 字符串
            const base64Arr = await this.readZip(file, info);
            resolve(base64Arr);
        });
    }
    complete() {
        this.count--;
    }
    // 转换成 webm
    async webm(file, info) {
        return new Promise(async (resolve, reject) => {
            // 创建视频编码器
            const encoder = new Whammy.Video();
            // 获取解压后的图片数据
            const base64Arr = await this.start(file, info);
            // 生成每一帧的数据
            const canvasData = await this.getFrameData(base64Arr);
            // 添加帧数据
            for (let index = 0; index < canvasData.length; index++) {
                const base64 = canvasData[index];
                encoder.add(base64, info.frames[index].delay);
            }
            // 获取生成的视频
            file = (await this.encodeVideo(encoder));
            this.complete();
            resolve(file);
        });
    }
    // 转换成 gif
    async gif(file, info) {
        return new Promise(async (resolve, reject) => {
            // 配置 gif.js
            let gif = new GIF({
                workers: 4,
                quality: 10,
                workerScript: this.gifWorkerUrl
            });
            // 绑定渲染完成事件
            gif.on('finished', (file) => {
                this.complete();
                resolve(file);
            });
            // 获取解压后的图片数据
            const base64Arr = await this.start(file, info);
            // 生成每一帧的数据
            const imgData = await this.getFrameData(base64Arr, 'gif');
            // 添加帧数据
            for (let index = 0; index < imgData.length; index++) {
                gif.addFrame(imgData[index], {
                    delay: info.frames[index].delay
                });
            }
            // 渲染 gif
            gif.render();
        });
    }
}
// 存储抓取结果
class Store {
    constructor() {
        this.type2IdList = []; // 储存 pageType 2 的 id 列表
        this.addTagList = []; // 需要添加 tag 的作品列表
        this.downloadList = []; // 储存图片信息
        this.illustUrlList = []; // 储存要下载的作品的页面url
        this.rankList = {}; // 储存作品在排行榜中的排名
    }
    // 接收 id 列表，然后拼接出作品页面的 url，储存起来。有的地方是直接添加作品页面的 url，就不需要调用这个方法
    addIllustUrlList(arr) {
        arr.forEach(data => {
            this.illustUrlList.push('https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + data);
        });
    }
    // 添加每个图片的信息。某些参数允许传空值
    /*
     id - 图片是 id + 序号，如 44920385_p0。动图只有 id
     url - 图片的 url
     title - 作品的标题
     tags - 作品的 tag 列表
     tagsTranslated - 作品的 tag 列表，附带翻译后的 tag（如果有）
     user - 作品的画师名字
     userid - 作品的画师id
     fullWidth - 图片的宽度
     fullHeight - 图片的高度
     ext - 图片的后缀名
     bmk - 作品的收藏数量
     date - 作品的创建日期，格式为 yyyy-MM-dd。如 2019-08-29
     type - 作品的类型，分为插画/漫画/动图
     rank - 在排行榜页面使用，保存图片的排名
     ugoiraInfo - 当作品是动图时才有值，包含 frames（数组）和 mimeType（string）属性
     */
    addResults(id, url, title, tags, tagsTranslated, user, userid, fullWidth, fullHeight, ext, bmk, date, type, rank, ugoiraInfo) {
        this.downloadList.push({
            id,
            url,
            title,
            tags,
            tagsTranslated,
            user,
            userid,
            fullWidth,
            fullHeight,
            ext,
            bmk,
            date,
            type,
            rank,
            ugoiraInfo
        });
    }
}
// 文件名类
class FileName {
    constructor() {
        // 用正则过滤不安全的字符，（Chrome 和 Windows 不允许做文件名的字符）
        // 不安全的字符，这里多数是控制字符，需要替换掉
        this.unsafeStr = new RegExp(/[\u0001-\u001f\u007f-\u009f\u00ad\u0600-\u0605\u061c\u06dd\u070f\u08e2\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufdd0-\ufdef\ufeff\ufff9-\ufffb\ufffe\uffff]/g);
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
        ];
    }
    // 把一些特殊字符替换成全角字符
    replaceUnsafeStr(str) {
        str = str.replace(this.unsafeStr, '');
        for (let index = 0; index < this.fullWidthDict.length; index++) {
            const rule = this.fullWidthDict[index];
            const reg = new RegExp(rule[0], 'g');
            str = str.replace(reg, rule[1]);
        }
        return str;
    }
    // 生成文件名，传入参数为图片信息
    getFileName(data) {
        let result = setting.xzForm.fileNameRule.value;
        // 为空时使用 {id}
        result = result || '{id}'; // 生成文件名
        const illustTypes = ['illustration', 'manga', 'ugoira']; // 作品类型 0 插画 1 漫画 2 动图
        // 储存每个文件名标记的配置
        const cfg = [
            {
                name: '{p_user}',
                // 标记
                value: pageInfo.pageUser,
                // 值
                prefix: '',
                // 添加在前面的字段名称
                safe: false
                // 是否是安全的文件名。如果可能包含一些特殊字符，就不安全，要进行替换
            },
            {
                name: '{p_uid}',
                value: pageInfo.pageUserID ? DOM.getUserId() : '',
                prefix: '',
                safe: true
            },
            {
                name: '{p_title}',
                value: document.title
                    .replace(/\[(0|↑|→|▶|↓|║|■|√| )\] /, '')
                    .replace(/^\(\d.*\) /, ''),
                // 去掉标题上的下载状态、消息数量提示
                prefix: '',
                safe: false
            },
            {
                name: '{p_tag}',
                value: pageInfo.pageTag,
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
                value: parseInt(data.id),
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
                value: (function () {
                    if (result.includes('{px}') && data.fullWidth !== undefined) {
                        return data.fullWidth + 'x' + data.fullHeight;
                    }
                    else {
                        return '';
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
        ];
        // 替换命名规则里的特殊字符
        result = this.replaceUnsafeStr(result);
        // 上一步会把斜线 / 替换成全角的斜线 ／，这里再替换回来，否则就不能建立文件夹了
        result = result.replace(/／/g, '/');
        // 把命名规则的标记替换成实际值
        for (const item of cfg) {
            if (result.includes(item.name) &&
                item.value !== '' &&
                item.value !== null) {
                // 只有当标记有值时才继续操作. 所以没有值的标记会原样保留
                let once = String(item.value);
                // 处理标记值中的特殊字符
                if (!item.safe) {
                    once = this.replaceUnsafeStr(once);
                }
                // 添加字段名称
                if (setting.xzForm.setTagNameToFileName.checked) {
                    once = item.prefix + once;
                }
                result = result.replace(new RegExp(item.name, 'g'), once); // 将标记替换成最终值，如果有重复的标记，全部替换
            }
        }
        // 处理空值，连续的 '//'。 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
        result = result.replace(/undefined/g, '').replace(/\/{2,9}/, '/');
        // 对每一层路径进行处理
        let tempArr = result.split('/');
        tempArr.forEach((str, index, arr) => {
            // 替换路径首尾的空格
            // 把每层路径头尾的 . 变成全角的．因为 Chrome 不允许头尾使用 .
            arr[index] = str
                .trim()
                .replace(/^\./g, '．')
                .replace(/\.$/g, '．');
        });
        result = tempArr.join('/');
        // 去掉头尾的 /
        if (result.startsWith('/')) {
            result = result.replace('/', '');
        }
        if (result.endsWith('/')) {
            result = result.substr(0, result.length - 1);
        }
        // 快速下载时，如果只有一个文件，则不建立文件夹
        if (dlCtrl.quickDownload && store.downloadList.length === 1) {
            const index = result.lastIndexOf('/');
            result = result.substr(index + 1, result.length);
        }
        // 添加后缀名
        result += '.' + data.ext;
        return result;
    }
}
// 针对不同页面类型，进行初始化
class InitPageBase {
    constructor() {
        this.setWantPageWrap = document.querySelector('.xzFormP1');
        this.setWantPage = this.setWantPageWrap.querySelector('.setWantPage');
        this.setWantPageTip1 = this.setWantPageWrap.querySelector('.setWantPageTip1');
        this.setWantPageTip2 = this.setWantPageWrap.querySelector('.setWantPageTip2');
    }
    // 初始化
    init() { }
    // 清空中间按钮
    clearCenterBtns() {
        document.getElementById('centerWrap_btns_free').innerHTML = '';
    }
    // 显示调整后，列表里的作品数量。仅在 tag 搜索页和发现页面中使用
    outputNowResult() {
        const selector = dl.worksSelector;
        Log.add(lang.transl('_调整完毕', DOM.getVisibleEl(selector).length.toString()), 0, 2, false);
    }
    // 清除多图作品
    addClearMultipleBtn() {
        ui.addCenterButton(Colors.red, lang.transl('_清除多图作品'), [
            ['title', lang.transl('_清除多图作品Title')]
        ]).addEventListener('click', () => {
            ui.centerWrapHide();
            const allPicArea = document.querySelectorAll(dl.worksSelector);
            allPicArea.forEach(el => {
                if (el.querySelector(dl.tagSearchMultipleSelector)) {
                    el.remove();
                }
            });
            this.outputNowResult();
        }, false);
    }
    // 清除动图作品
    addClearUgokuBtn() {
        ui.addCenterButton(Colors.red, lang.transl('_清除动图作品'), [
            ['title', lang.transl('_清除动图作品Title')]
        ]).addEventListener('click', () => {
            ui.centerWrapHide();
            const allPicArea = document.querySelectorAll(dl.worksSelector);
            allPicArea.forEach(el => {
                if (el.querySelector(dl.tagSearchUgoiraSelector)) {
                    el.remove();
                }
            });
            this.outputNowResult();
        }, false);
    }
    // 手动删除作品
    addManuallyDeleteBtn() {
        let delWork = false; // 是否处于删除作品状态
        const delBtn = ui.addCenterButton(Colors.red, lang.transl('_手动删除作品'), [['title', lang.transl('_手动删除作品Title')]]);
        delBtn.addEventListener('click', () => {
            delWork = !delWork;
            // 给作品绑定删除属性
            const listElement = document.querySelectorAll(dl.worksSelector);
            listElement.forEach(el => {
                el.onclick = e => {
                    e = e || window.event;
                    if (delWork) {
                        e.preventDefault();
                        DOM.removeEl(e.target);
                        if (dl.allowWork) {
                            this.outputNowResult();
                        }
                    }
                };
            });
            if (delWork) {
                delBtn.textContent = lang.transl('_退出手动删除');
                setTimeout(() => {
                    ui.centerWrapHide();
                }, 300);
            }
            else {
                delBtn.textContent = lang.transl('_手动删除作品');
            }
        });
    }
    // 添加中间按钮
    appendCenterBtns() { }
    // 添加其他元素（如果有）
    appendElseEl() { }
    // 在某些页面里，隐藏不需要的选项。参数是数组，传递设置项的编号。
    hideNotNeedOption(no) {
        for (const num of no) {
            const el = document.querySelector('.xzFormP' + num.toString());
            el.style.display = 'none';
        }
    }
    // 设置表单里的选项。如果有对其他地方的设置，可以直接写在 init 里
    setSetting() {
        // 隐藏“是否显示封面图”的选项
        this.hideNotNeedOption([9]);
        // 设置页数
        setting.wantPage = -1;
        this.setWantPageTip1.textContent = lang.transl('_页数');
        this.setWantPageTip1.dataset.tip = lang.transl('_checkWantPageRule1Arg5');
        this.setWantPageTip2.textContent = lang.transl('_数字提示1');
        this.setWantPage.value = setting.wantPage.toString();
    }
}
// 初始化首页
class InitIndexPage extends InitPageBase {
    constructor() {
        super(...arguments);
        this.downIdButton = document.createElement('button');
        this.downIdInput = document.createElement('textarea');
        this.ready = false;
    }
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.appendElseEl();
        this.setSetting();
    }
    appendCenterBtns() {
        this.downIdButton = ui.addCenterButton(Colors.blue, lang.transl('_输入id进行抓取'), [['id', 'down_id_button']]);
        this.downIdButton.addEventListener('click', () => {
            store.illustUrlList = []; // 每次开始下载前重置作品的url列表
            if (!this.ready) {
                // 还没准备好
                ui.centerWrapHide();
                this.downIdInput.style.display = 'block';
                this.downIdInput.focus();
                document.documentElement.scrollTop = 0;
            }
            else {
                // 检查 id
                const tempSet = new Set(this.downIdInput.value.split('\n'));
                const idValue = Array.from(tempSet);
                idValue.forEach(id => {
                    // 如果有 id 不是数字，或者处于非法区间，中止任务
                    const nowId = parseInt(id);
                    if (isNaN(nowId) || nowId < 22 || nowId > 99999999) {
                        window.alert(lang.transl('_id不合法'));
                        throw new Error('Illegal id.');
                    }
                    else {
                        store.addIllustUrlList([nowId.toString()]);
                    }
                });
                crawler.readyGet();
            }
        }, false);
    }
    appendElseEl() {
        // 用于输入id的输入框
        this.downIdInput = document.createElement('textarea');
        this.downIdInput.id = 'down_id_input';
        this.downIdInput.style.display = 'none';
        this.downIdInput.setAttribute('placeholder', lang.transl('_输入id进行抓取的提示文字'));
        ui.insertToHead(this.downIdInput);
        this.downIdInput.addEventListener('change', () => {
            // 当输入框内容改变时检测，非空值时显示下载面板
            if (this.downIdInput.value !== '') {
                this.ready = true;
                ui.centerWrapShow();
                this.downIdButton.textContent = lang.transl('_开始抓取');
            }
            else {
                this.ready = false;
                ui.centerWrapHide();
                this.downIdButton.textContent = lang.transl('_输入id进行抓取');
            }
        });
    }
    setSetting() {
        this.hideNotNeedOption([1, 9]);
    }
}
//初始化作品页
class InitIllustPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.appendElseEl();
        this.setSetting();
        bookmark.quickBookmark();
        viewer.initViewer();
    }
    appendCenterBtns() {
        ui.addCenterButton(Colors.blue, lang.transl('_从本页开始抓取new')).addEventListener('click', () => {
            dlCtrl.downDirection = -1;
            crawler.readyGet();
        });
        ui.addCenterButton(Colors.blue, lang.transl('_从本页开始抓取old')).addEventListener('click', () => {
            dlCtrl.downDirection = 1;
            crawler.readyGet();
        });
        const downXgBtn = ui.addCenterButton(Colors.blue, lang.transl('_抓取相关作品'));
        downXgBtn.addEventListener('click', () => {
            dlCtrl.downRelated = true;
            crawler.readyGet();
        }, false);
    }
    appendElseEl() {
        // 在右侧创建快速下载按钮
        const quickDownBtn = document.createElement('div');
        quickDownBtn.id = 'quick_down_btn';
        quickDownBtn.textContent = '↓';
        quickDownBtn.setAttribute('title', lang.transl('_快速下载本页'));
        document.body.appendChild(quickDownBtn);
        quickDownBtn.addEventListener('click', () => {
            dlCtrl.quickDownload = true;
            crawler.readyGet();
        }, false);
    }
    setSetting() {
        // 隐藏“是否显示封面图”的选项
        this.hideNotNeedOption([9]);
        // 设置页数
        setting.wantPage = -1;
        this.setWantPageTip1.textContent = lang.transl('_个数');
        this.setWantPageTip1.dataset.tip =
            lang.transl('_checkWantPageRule1Arg5') +
                '<br>' +
                lang.transl('_相关作品大于0');
        this.setWantPageTip2.textContent = lang.transl('_数字提示1');
        this.setWantPage.value = setting.wantPage.toString();
    }
}
// 初始化用户页面
class InitUserPage extends InitPageBase {
    constructor() {
        super(...arguments);
        this.addTagBtn = document.createElement('button');
    }
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.setSetting();
        // 删除快速下载按钮
        const quickDownBtn = document.getElementById('quick_down_btn');
        if (quickDownBtn) {
            quickDownBtn.remove();
        }
        // 如果是书签页则显示添加 tag 的按钮，其他页面里隐藏这个按钮
        const isBookmarkPage = location.href.includes('bookmark.php');
        //
        let addTagBtn = document.getElementById('add_tag_btn');
        if (isBookmarkPage && !!addTagBtn) {
            addTagBtn.style.display = 'inline-block';
        }
        else {
            if (!!addTagBtn) {
                addTagBtn.style.display = 'none';
            }
        }
        // 这里也可以显示隐藏“下载推荐作品”的按钮，但是没必要。因为旧版书签页面的进出都是需要刷新的。
    }
    appendCenterBtns() {
        ui.addCenterButton(Colors.blue, lang.transl('_开始抓取'), [
            ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')]
        ]).addEventListener('click', crawler.readyGet);
        // 添加下载推荐作品的按钮，只在旧版收藏页面使用
        const columnTitle = document.querySelector('.column-title');
        if (columnTitle) {
            const downRecmdBtn = ui.addCenterButton(Colors.blue, lang.transl('_抓取推荐作品'), [['title', lang.transl('_抓取推荐作品Title')]]);
            downRecmdBtn.addEventListener('click', () => {
                dlCtrl.downRecommended = true;
                crawler.readyGet();
            }, false);
        }
        // 如果存在 token，则添加“添加 tag”按钮
        if (DOM.getToken()) {
            this.addTagBtn = ui.addCenterButton(Colors.green, lang.transl('_添加tag'), [['title', lang.transl('_添加tag')]]);
            this.addTagBtn.id = 'add_tag_btn';
            if (!location.href.includes('bookmark.php')) {
                this.addTagBtn.style.display = 'none';
            }
            this.addTagBtn.addEventListener('click', () => {
                store.addTagList = []; // 每次点击清空结果
                this.addTagBtn.setAttribute('disabled', 'disabled');
                bookmark.readyAddTag();
            });
        }
    }
    setSetting() {
        // 隐藏“是否显示封面图”的选项
        this.hideNotNeedOption([9]);
        // 在书签页面隐藏只要书签选项
        if (location.href.includes('bookmark.php')) {
            this.hideNotNeedOption([11]);
        }
    }
}
// 初始化搜索页
class InitSearchPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.appendElseEl();
        this.setSetting();
        dl.worksSelector = '.JoCpVnw';
        dl.baseUrl = location.href.split('&p=')[0] + '&p=';
        dl.startpageNo = DOM.getNowPageNo();
        dl.listPageFinished = 0;
        document.getElementById('js-react-search-mid').style.minHeight = 'auto'; // 这部分的高度改成 auto 以免搜索时会有空白区域
    }
    appendCenterBtns() {
        // 添加下载面板的按钮
        ui.addCenterButton(Colors.green, lang.transl('_开始筛选'), [
            ['title', lang.transl('_开始筛选Title')]
        ]).addEventListener('click', () => {
            crawler.readyGet();
        }, false);
        ui.addCenterButton(Colors.green, lang.transl('_在结果中筛选'), [
            ['title', lang.transl('_在结果中筛选Title')]
        ]).addEventListener('click', () => {
            const allPicArea = document.querySelectorAll(dl.worksSelector);
            let wantFavoriteNumber2 = parseInt(window.prompt(lang.transl('_在结果中筛选弹窗'), '2000'));
            if (!wantFavoriteNumber2 ||
                isNaN(Number(wantFavoriteNumber2)) ||
                ~~Number(wantFavoriteNumber2) <= 0) {
                const msg = lang.transl('_参数不合法1');
                window.alert(msg);
                throw new Error(msg);
            }
            else {
                wantFavoriteNumber2 = ~~Number(wantFavoriteNumber2);
            }
            allPicArea.forEach(el => {
                if (parseInt(el.querySelector('._ui-tooltip').textContent) <
                    wantFavoriteNumber2) {
                    // 必须限制序号0，不然对图片的回应数也会连起来
                    el.style.display = 'none'; // 这里把结果中不符合二次过滤隐藏掉，而非删除
                }
                else {
                    el.style.display = 'inline-flex';
                }
            });
            this.outputNowResult();
            ui.centerWrapHide();
        }, false);
        ui.addCenterButton(Colors.red, lang.transl('_中断当前任务'), [
            ['title', lang.transl('_中断当前任务Title')]
        ]).addEventListener('click', () => {
            dlCtrl.interrupt = true;
            if (!dl.allowWork) {
                Log.add(lang.transl('_当前任务已中断'), 2, 2);
                dl.allowWork = true;
            }
            ui.centerWrapHide();
        }, false);
        this.addClearMultipleBtn();
        this.addClearUgokuBtn();
        this.addManuallyDeleteBtn();
        ui.addCenterButton(Colors.blue, lang.transl('_抓取当前作品'), [
            ['title', lang.transl('_抓取当前作品Title')]
        ]).addEventListener('click', crawler.getWorksList);
    }
    appendElseEl() {
        // 添加快速筛选功能
        const nowTag = document
            .querySelector('.column-title a')
            .textContent.split(' ')[0];
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
        ]; // 200 和 2000 的因为数量太少，不添加。40000 的也少
        const fastScreenArea = document.createElement('div');
        fastScreenArea.className = 'fastScreenArea';
        const insetParent = document.querySelector('._unit');
        insetParent.insertBefore(fastScreenArea, insetParent.querySelector('#js-react-search-top'));
        let searchMode = ''; // 判断当前搜索模式，默认的“全部”模式不需要做处理
        if (location.href.includes('&mode=r18')) {
            searchMode = '&mode=r18';
        }
        else if (location.href.includes('&mode=safe')) {
            searchMode = '&mode=safe';
        }
        let orderMode = ''; // 判断当前排序方式
        if (location.href.includes('&order=date_d')) {
            // 按最新排序
            orderMode = '&order=date_d';
        }
        else if (location.href.includes('&order=date')) {
            // 按旧排序
            orderMode = '&order=date';
        }
        fastScreenArea.innerHTML = favNums.reduce((result, cur) => {
            return (result += `<a href="https://www.pixiv.net/search.php?s_mode=s_tag${searchMode}${orderMode}&word=${nowTag}%20${cur}">${cur}</a>`);
        }, '');
    }
    setSetting() {
        setting.xzForm.setFavNum.value = '1000'; // tag 搜索页默认收藏数设置为 1000
        // 设置页数
        setting.wantPage = 1000;
        this.setWantPageTip1.textContent = lang.transl('_页数');
        this.setWantPageTip1.dataset.tip = lang.transl('_要获取的作品个数2');
        this.setWantPageTip2.textContent = '-1 - 1000';
        this.setWantPage.value = setting.wantPage.toString();
    }
}
// 初始化地区排行榜页面
class InitAreaRankingPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.setSetting();
    }
    appendCenterBtns() {
        ui.addCenterButton(Colors.blue, lang.transl('_抓取本页作品'), [
            ['title', lang.transl('_抓取本页作品Title')]
        ]).addEventListener('click', crawler.readyGet);
    }
    setSetting() {
        this.hideNotNeedOption([1, 9]);
    }
}
// 初始化排行榜页面
class InitRankingPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.setSetting();
        if (window.location.search === '') {
            // 直接获取json数据
            dl.baseUrl = location.href + '?format=json&p=';
        }
        else {
            dl.baseUrl = location.href + '&format=json&p=';
        }
        dl.startpageNo = 1; // 从第一页（部分）开始抓取
        dl.listPageFinished = 0; // 已经向下抓取了几页（部分）
    }
    appendCenterBtns() {
        ui.addCenterButton(Colors.blue, lang.transl('_抓取本排行榜作品'), [
            ['title', lang.transl('_抓取本排行榜作品Title')]
        ]).addEventListener('click', crawler.readyGet);
        // 在“今日”页面，添加下载首次登场的作品的按钮
        if (location.href.includes('mode=daily')) {
            ui.addCenterButton(Colors.blue, lang.transl('_抓取首次登场的作品'), [
                ['title', lang.transl('_抓取首次登场的作品Title')]
            ]).addEventListener('click', () => {
                dlCtrl.debut = true;
                crawler.readyGet();
            });
        }
    }
    setSetting() {
        // 隐藏“是否显示封面图”的选项
        this.hideNotNeedOption([9]);
        // 设置页数
        setting.wantPage = 500;
        this.setWantPageTip1.textContent = lang.transl('_个数');
        this.setWantPageTip1.dataset.tip = lang.transl('_要获取的作品个数2');
        this.setWantPageTip2.textContent = '1 - 500';
        this.setWantPage.value = setting.wantPage.toString();
    }
}
// 初始化 pixivision 页面
class InitPixivisionPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.setSetting();
    }
    appendCenterBtns() {
        const typeA = document.querySelector('a[data-gtm-action=ClickCategory]');
        const type = typeA.dataset.gtmLabel;
        if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
            // 在插画、漫画、cosplay类型的页面上创建下载功能
            ui.addCenterButton(Colors.blue, lang.transl('_抓取该页面的图片')).addEventListener('click', () => {
                crawler.readyGet();
            }, false);
        }
    }
    setSetting() {
        this.hideNotNeedOption([1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13]);
    }
}
// 初始化 bookmark_detail 页面
class InitBookmarkDetailPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.setSetting();
    }
    appendCenterBtns() {
        ui.addCenterButton(Colors.blue, lang.transl('_抓取相似图片'), [
            ['title', lang.transl('_抓取相似图片')]
        ]).addEventListener('click', () => {
            crawler.readyGet();
        }, false);
    }
    setSetting() {
        // 隐藏“是否显示封面图”的选项
        this.hideNotNeedOption([9]);
        // 设置页数
        setting.wantPage = 100;
        this.setWantPageTip1.textContent = lang.transl('_个数');
        this.setWantPageTip1.dataset.tip = lang.transl('_要获取的作品个数2');
        this.setWantPageTip2.textContent = '1 - 500';
        this.setWantPage.value = setting.wantPage.toString();
    }
}
// 初始化 关注的人的新作品 以及 大家的新作品页面
class InitNewIllustPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.setSetting();
        // 列表页url规则
        if (!location.href.includes('type=')) {
            // 如果没有type标志，说明是在“综合”分类的第一页，手动加上分类
            dl.baseUrl = location.href + '?type=all'.split('&p=')[0] + '&p=';
        }
        else {
            dl.baseUrl = location.href.split('&p=')[0] + '&p=';
        }
        dl.startpageNo = DOM.getNowPageNo();
        dl.listPageFinished = 0;
    }
    appendCenterBtns() {
        ui.addCenterButton(Colors.blue, lang.transl('_开始抓取'), [
            ['title', lang.transl('_下载大家的新作品')]
        ]).addEventListener('click', crawler.readyGet);
    }
    setSetting() {
        // 隐藏“是否显示封面图”的选项
        this.hideNotNeedOption([9]);
        // 设置页数
        setting.wantPage = 10;
        this.setWantPageTip1.textContent = lang.transl('_页数');
        this.setWantPageTip1.dataset.tip = lang.transl('_checkWantPageRule1Arg8');
        const maxNum = this.getMaxNum();
        this.setWantPageTip2.textContent = `1 - ${maxNum}`;
        this.setWantPage.value = setting.wantPage.toString();
    }
    // 当前页面类型里最多有多少页
    getMaxNum() {
        let num = 0;
        // 其实这个条件和条件 2 在一定程度上是重合的，所以这个必须放在前面
        if (location.href.includes('bookmark_new_illust')) {
            num = 100; // 关注的人的新作品（包含普通版和 r18 版）的最大页数都是 100
        }
        else if (location.href.includes('new_illust.php')) {
            num = 1000; // 大家的新作品（普通版）的最大页数是 1000
        }
        else if (location.href.includes('new_illust_r18.php')) {
            num = 500; // 大家的的新作品（r18版）的最大页数是 500
        }
        return num;
    }
}
// 初始化发现页面
class InitDiscoverPage extends InitPageBase {
    init() {
        this.clearCenterBtns();
        this.appendCenterBtns();
        this.setSetting();
        dl.worksSelector = '._2RNjBox'; // 发现页面的作品列表
    }
    appendCenterBtns() {
        ui.addCenterButton(Colors.blue, lang.transl('_抓取当前作品'), [
            ['title', lang.transl('_抓取当前作品Title')]
        ]).addEventListener('click', crawler.readyGet);
        this.addClearMultipleBtn();
        this.addClearUgokuBtn();
        this.addManuallyDeleteBtn();
    }
    setSetting() {
        this.hideNotNeedOption([1, 9]);
    }
}
// 初始化页面，根据页面类型，返回初始化对象
class InitPage {
    initPage(type) {
        let result;
        switch (type) {
            case 0:
                result = new InitIndexPage();
                break;
            case 1:
                result = new InitIllustPage();
                break;
            case 2:
                result = new InitUserPage();
                break;
            case 5:
                result = new InitSearchPage();
                break;
            case 6:
                result = new InitAreaRankingPage();
                break;
            case 7:
                result = new InitRankingPage();
                break;
            case 8:
                result = new InitPixivisionPage();
                break;
            case 9:
                result = new InitBookmarkDetailPage();
                break;
            case 10:
                result = new InitNewIllustPage();
                break;
            case 11:
                result = new InitDiscoverPage();
                break;
            default:
                throw new Error('InitPage error: Illegal parameter.');
        }
        result.init();
    }
    initCrawl(type) {
        let result;
        switch (type) {
            case 0:
                result = new CrawlIndexPage();
                break;
            case 1:
                result = new CrawlIllustPage();
                break;
            case 2:
                result = new CrawlUserPage();
                break;
            case 5:
                result = new CrawlSearchPage();
                break;
            case 6:
                result = new CrawlAreaRankingPage();
                break;
            case 7:
                result = new CrawlRankingPage();
                break;
            case 8:
                result = new CrawlPixivisionPage();
                break;
            case 9:
                result = new CrawlBookmarkDetailPage();
                break;
            case 10:
                result = new CrawlNewIllustPage();
                break;
            case 11:
                result = new CrawlDiscoverPage();
                break;
            default:
                throw new Error('CrawlPage error: Illegal parameter.');
        }
        return result;
    }
}
// 抓取流程
class CrawlPageBase {
    constructor() {
        this.ajaxForIllustThreads = 6; // 抓取页面时的并发连接数
        this.ajaxThreadsFinished = 0; // 统计有几个并发线程完成所有请求。统计的是并发数（ ajaxForIllustThreads ）而非请求数
        this.requsetNumber = 0; // 要下载多少个作品
        this.type = pageType.getPageType();
    }
    // 检查是否可以开始抓取
    checkCanCrawl() {
        if (!dl.allowWork || dlCtrl.downloadStarted) {
            window.alert(lang.transl('_当前任务尚未完成1'));
            throw new Error(lang.transl('_当前任务尚未完成1'));
        }
        if (dlCtrl.interrupt) {
            dlCtrl.interrupt = false;
        }
        Log.add(lang.transl('_任务开始0'), 0);
        Log.add(lang.transl('_本次任务条件'));
        ui.downloadPanelDisplay('none');
    }
    // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
    getWangtPage() { }
    // 准备抓取，进行抓取之前的一些检查工作。必要时可以在子类中改写
    readyGet() {
        this.checkCanCrawl();
        this.getWangtPage();
        // 检查是否设置了收藏数要求
        setting.getSetBmk();
        // 检查是否设置了作品张数限制
        setting.getImgNumberPerWork();
        // 获取必须包含的tag
        setting.getNeedTag();
        // 获取要排除的tag
        setting.getNotNeedTag();
        // 检查是否设置了只下载书签作品
        setting.getOnlyBmk();
        // 检查排除作品类型的设置
        setting.getNotDownType();
        // 检查是否设置了宽高条件
        setting.getSetWh();
        // 检查宽高比设置
        setting.getRatioSetting();
        // 检查是否设置了只下载首次登场
        if (dlCtrl.debut) {
            Log.add(lang.transl('_抓取首次登场的作品Title'), 1);
        }
        // 重置下载状态
        this.resetResult();
        // 开始执行时，标记任务状态，当前任务结束后才能再启动新任务
        dl.allowWork = false;
        this.type = pageType.getPageType();
        // 进入第一个抓取方法
        this.nextStep();
    }
    // 当开始抓取时，进入什么流程。默认情况下，开始获取作品列表。有些页面需要进入其他方法，由子类具体定义
    nextStep() {
        this.getListPage();
    }
    // 一般来说在 getListPage 里就会获取要下载的作品的列表，但搜索页面里可以多次筛选，下载时再取获取作品列表，所以单独定义了一个方法
    getWorksList() { }
    // 作品列表获取完毕，开始抓取作品内容页
    getListUrlFinished() {
        // 列表页获取完毕后，可以在这里重置一些变量
        dlCtrl.debut = false;
        this.type = pageType.getPageType();
        if (store.illustUrlList.length < this.ajaxForIllustThreads) {
            this.ajaxForIllustThreads = store.illustUrlList.length;
        }
        for (let i = 0; i < this.ajaxForIllustThreads; i++) {
            this.getIllustData();
        }
    }
    // 当因为网络问题无法获取作品数据时，重试
    reTryGetIllustData(url) {
        setTimeout(() => {
            this.getIllustData(url);
        }, 2000);
    }
    // 获取作品的数据
    async getIllustData(url) {
        // url 参数为完整的作品页 url，如：
        // https://www.pixiv.net/member_illust.php?mode=medium&illust_id=65546468
        // 目前，只有在作品页内和重试时，需要显式传递 url。
        titleBar.changeTitle('↑');
        // 如果没有传递 url，则取出 illustUrlList 的第一项进行抓取
        if (!url) {
            url = store.illustUrlList.shift();
        }
        // 判断任务是否已中断，目前只在tag搜索页有用到
        if (dlCtrl.interrupt) {
            dl.allowWork = true;
            return;
        }
        // 快速下载时在这里提示一次
        if (dlCtrl.quickDownload) {
            Log.add(lang.transl('_开始获取作品页面'));
        }
        const usedUrl = 'https://www.pixiv.net/ajax/illust/' + API.getIllustId(url); // 取出作品id，拼接出作品页api
        // 发起请求
        try {
            const response = await fetch(usedUrl);
            if (response.ok) {
                const data = await response.json();
                // 这里需要再判断一次中断情况，因为ajax执行完毕是需要时间的
                if (dlCtrl.interrupt) {
                    dl.allowWork = true;
                    return;
                }
                // 预设及获取图片信息
                const jsInfo = data.body;
                const id = jsInfo.illustId;
                const fullWidth = jsInfo.width; // 原图宽度
                const fullHeight = jsInfo.height; // 原图高度
                const title = jsInfo.illustTitle; // 作品标题
                const userid = jsInfo.userId; // 画师id
                let user = jsInfo.userName; // 画师名字，如果这里获取不到，下面从 tag 尝试获取
                const nowAllTagInfo = jsInfo.tags.tags; // 取出 tag 信息
                const nowAllTag = []; // 保存 tag 列表
                const tagWithTranslation = []; // 保存 tag 列表，附带翻译后的 tag
                if (nowAllTagInfo.length > 0) {
                    if (!user) {
                        user = nowAllTagInfo[0].userName ? nowAllTagInfo[0].userName : ''; // 这里从第一个tag里取出画师名字，如果没有 tag 那就获取不到画师名
                    }
                    for (const tagData of nowAllTagInfo) {
                        nowAllTag.push(tagData.tag);
                        tagWithTranslation.push(tagData.tag);
                        if (tagData.translation && tagData.translation.en) {
                            tagWithTranslation.push(tagData.translation.en);
                        }
                    }
                }
                const bmk = jsInfo.bookmarkCount; // 收藏数
                let ext = ''; // 扩展名
                let imgUrl = '';
                const whCheckResult = setting.checkSetWh(fullWidth, fullHeight); // 检查宽高设置
                const ratioCheckResult = setting.checkRatio(fullWidth, fullHeight); // 检查宽高比设置
                // 检查收藏数要求
                let bmkCheckResult = true;
                if (setting.isSetFilterBmk) {
                    if (bmk < setting.filterBmk) {
                        bmkCheckResult = false;
                    }
                }
                // 检查只下载书签作品的要求
                const checkBookmarkResult = setting.checkOnlyDownBmk(!!jsInfo.bookmarkData);
                // 检查排除类型设置，这里取反
                const notdownTypeResult = !setting.notdownType.includes(jsInfo.illustType.toString());
                let tagCheckResult; // 储存 tag 检查结果
                // 检查要排除的 tag
                const tagNotNeedIsFound = setting.checkNotNeedTag(nowAllTag);
                // 如果检查排除的 tag，没有匹配到
                if (!tagNotNeedIsFound) {
                    // 检查必须包含的 tag
                    tagCheckResult = setting.checkNeedTag(nowAllTag);
                }
                else {
                    // 如果匹配到了要排除的tag，则不予通过
                    tagCheckResult = false;
                }
                // 上面的检查全部通过才可以下载这个作品
                const totalCheck = tagCheckResult &&
                    checkBookmarkResult &&
                    notdownTypeResult &&
                    whCheckResult &&
                    ratioCheckResult &&
                    bmkCheckResult;
                // 检查通过
                if (totalCheck) {
                    // 获取作品在排行榜上的编号
                    let rank = '';
                    if (this.type === 7) {
                        rank = '#' + store.rankList[jsInfo.illustId];
                    }
                    // 储存作品信息
                    if (jsInfo.illustType !== 2) {
                        // 插画或漫画
                        // 检查要下载该作品的前面几张
                        let pNo = jsInfo.pageCount;
                        if (setting.imgNumberPerWork > 0 &&
                            setting.imgNumberPerWork <= pNo) {
                            pNo = setting.imgNumberPerWork;
                        }
                        // 获取多p作品的原图页面
                        imgUrl = jsInfo.urls.original;
                        const tempExt = imgUrl.split('.');
                        ext = tempExt[tempExt.length - 1];
                        // 添加作品信息
                        for (let i = 0; i < pNo; i++) {
                            const nowUrl = imgUrl.replace('p0', 'p' + i); // 拼接出每张图片的url
                            store.addResults(id + '_p' + i, nowUrl, title, nowAllTag, tagWithTranslation, user, userid, fullWidth, fullHeight, ext, bmk, jsInfo.createDate.split('T')[0], jsInfo.illustType, rank, {});
                        }
                        this.outputImgNum();
                    }
                    else if (jsInfo.illustType === 2) {
                        // 动图
                        // 获取动图的信息
                        const getUgoiraInfo = await fetch(`https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`, {
                            method: 'get',
                            credentials: 'same-origin' // 附带 cookie
                        });
                        const info = await getUgoiraInfo.json();
                        // 动图帧延迟数据
                        const ugoiraInfo = {
                            frames: info.body.frames,
                            mimeType: info.body.mime_type
                        };
                        ext = setting.xzForm.ugoiraSaveAs.value; // 扩展名可能是 webm、gif、zip
                        store.addResults(id, info.body.originalSrc, title, nowAllTag, tagWithTranslation, user, userid, fullWidth, fullHeight, ext, bmk, jsInfo.createDate.split('T')[0], jsInfo.illustType, rank, ugoiraInfo);
                        this.outputImgNum();
                    }
                }
                // 在作品页内下载时，设置的 wantPage 其实是作品数
                if (this.type === 1 && !dlCtrl.downRelated) {
                    if (setting.wantPage > 0) {
                        setting.wantPage--;
                    }
                    if (setting.wantPage === -1 || setting.wantPage > 0) {
                        // 应该继续下载时，检查是否有下一个作品
                        const userIllust = jsInfo.userIllusts;
                        let nextId;
                        // 在所有不为 null 的数据里（可能有1-3个），illustId 比当前 id 大的是新作品, 比当前 id 小的是旧作品
                        for (const val of Object.values(userIllust)) {
                            if (val) {
                                const thisId = parseInt(val.illustId); // 转换成数字进行比较
                                if (dlCtrl.downDirection === -1 && thisId > parseInt(id)) {
                                    nextId = val.illustId;
                                    break;
                                }
                                else if (dlCtrl.downDirection === 1 &&
                                    thisId < parseInt(id)) {
                                    nextId = val.illustId;
                                    break;
                                }
                            }
                        }
                        if (nextId) {
                            this.getIllustData('https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' +
                                nextId);
                        }
                        else {
                            // 没有剩余作品
                            this.crawFinished();
                        }
                    }
                    else {
                        // 没有剩余作品
                        this.crawFinished();
                    }
                }
                else {
                    if (store.illustUrlList.length > 0) {
                        // 如果存在下一个作品，则
                        this.getIllustData();
                    }
                    else {
                        // 没有剩余作品
                        this.ajaxThreadsFinished++;
                        if (this.ajaxThreadsFinished === this.ajaxForIllustThreads) {
                            // 如果所有并发请求都执行完毕则复位
                            this.ajaxThreadsFinished = 0;
                            this.crawFinished();
                        }
                    }
                }
            }
            else {
                this.onError(url);
                const status = response.status;
                switch (status) {
                    case 0:
                        console.log(lang.transl('_作品页状态码0'));
                        break;
                    case 400:
                        console.log(lang.transl('_作品页状态码400'));
                        break;
                    case 403:
                        console.log(lang.transl('_作品页状态码403'));
                        break;
                    case 404:
                        console.log(lang.transl('_作品页状态码404') + ' ' + url);
                        break;
                    default:
                        break;
                }
            }
        }
        catch (error) {
            console.log(error);
            // 这里预期 catch 的是因网络原因，fetch 出错的情况
            this.reTryGetIllustData(url);
        }
    }
    // 抓取完毕
    crawFinished() {
        dl.allowWork = true;
        // 检查快速下载状态
        let autoDownload = setting.xzForm.setQuietDownload.checked;
        dlCtrl.downRelated = false; // 解除下载相关作品的标记
        dlCtrl.downDirection = 0; // 解除下载方向的标记
        dlCtrl.downRecommended = false; // 解除下载推荐作品的标记
        // tag 搜索页把下载任务按收藏数从高到低下载
        if (this.type === 5) {
            store.downloadList.sort(API.sortByProperty('bmk'));
        }
        // 在画师的列表页里
        if (this.type === 2) {
            if (!location.href.includes('bookmark.php')) {
                // 如果是其他列表页，把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
                store.downloadList.sort(API.sortByProperty('id'));
            }
            else {
                // 如果是书签页，把作品数据反转，这样可以先下载收藏时间早的，后下载收藏时间近的
                store.downloadList.reverse();
            }
            // 注意这里如果在控制台打印 imgInfo 的话，可能看到修改前后的数据是一样的，因为 imgInfo 引用的地址没变，实际上数据修改成功了。如果想要看到不同的数据，可以将 imgInfo 用扩展运算符解开之后再修改。
        }
        if (store.downloadList.length === 0) {
            Log.add(lang.transl('_抓取完毕'));
            Log.add(lang.transl('_没有符合条件的作品'), 2, 2);
            window.alert(lang.transl('_抓取完毕') + lang.transl('_没有符合条件的作品'));
            dl.allowWork = true;
            return;
        }
        Log.add(lang.transl('_抓取完毕'), -1, 2);
        if (!autoDownload && !dlCtrl.quickDownload) {
            titleBar.changeTitle('▶');
        }
        dl.downloaded = 0;
        ui.resetDownloadPanel(); // 重置下载面板
        ui.downloadPanelDisplay('block');
        // 显示下载面板
        if (!dlCtrl.quickDownload) {
            ui.centerWrapShow();
        }
        // 视情况自动开始下载
        if (dlCtrl.quickDownload || autoDownload) {
            dlCtrl.startDownload();
        }
    }
    // 在抓取图片网址时，输出提示
    outputImgNum() {
        Log.add(lang.transl('_抓取图片网址的数量', store.downloadList.length.toString()), -1, 1, false);
        // 如果任务中断
        if (dlCtrl.interrupt) {
            Log.add(lang.transl('_抓取图片网址遇到中断'), 2, 2);
        }
    }
    // 获取作品列表的结果为 0 时输出提示
    noResult() {
        Log.add(lang.transl('_列表页抓取结果为零'), 2, 2);
        dl.allowWork = true;
        titleBar.changeTitle('0');
    }
    // 错误处理
    onError(url) {
        if (!dlCtrl.downRelated) {
            Log.add(lang.transl('_无权访问1', url), 2, 2);
            // 在作品页内下载时，设置的wantPage其实是作品数
            if (setting.wantPage > 0) {
                setting.wantPage--;
            }
            // 在作品页内下载时，如果出现了无法访问的作品时，就获取不到接下来的作品了，直接结束。
            this.crawFinished();
        }
        else {
            Log.add(lang.transl('_无权访问2', url), 2, 1);
            // 跳过当前作品
            if (store.illustUrlList.length > 0) {
                // 如果存在下一个作品，则
                this.getIllustData();
            }
            else {
                // 没有剩余作品
                this.ajaxThreadsFinished++;
                if (this.ajaxThreadsFinished === this.ajaxForIllustThreads) {
                    // 如果所有并发请求都执行完毕，复位
                    this.ajaxThreadsFinished = 0;
                    this.crawFinished();
                }
            }
        }
    }
    // 清空图片信息并重置输出区域，在重复抓取时使用
    resetResult() {
        store.downloadList = [];
        dl.downloadedList = [];
        store.rankList = {};
        dlCtrl.downloadStarted = false;
        dlCtrl.downloadPause = false;
        dlCtrl.downloadStop = false;
        titleBar.changeTitle('0');
        ui.centerWrapHide();
        document.querySelector('.outputInfoContent').innerHTML = '';
    }
}
// 抓取首页
class CrawlIndexPage extends CrawlPageBase {
    nextStep() {
        // 在主页通过id抓取时，不需要获取列表页，直接完成
        Log.add(lang.transl('_开始获取作品页面'));
        this.getListUrlFinished();
    }
    getWangtPage() { }
    getListPage() { }
}
// 抓取作品页
class CrawlIllustPage extends CrawlPageBase {
    getWangtPage() {
        if (dlCtrl.quickDownload) {
            // 快速下载
            setting.wantPage = 1;
        }
        else {
            // 检查下载页数的设置
            let result = false;
            if (!dlCtrl.downRelated) {
                result = setting.checkWantPageInput(lang.transl('_checkWantPageRule1Arg2'), lang.transl('_checkWantPageRule1Arg3'), lang.transl('_checkWantPageRule1Arg4'));
            }
            else {
                // 相关作品的提示
                result = setting.checkWantPageInput(lang.transl('_checkWantPageRule1Arg2'), lang.transl('_checkWantPageRule1Arg9'), lang.transl('_checkWantPageRule1Arg10'));
            }
            if (!result) {
                throw new Error('CrawlPage error: Illegal parameter.');
            }
        }
    }
    nextStep() {
        // 下载相关作品
        if (dlCtrl.downRelated) {
            this.getListPage();
        }
        else {
            // 开始获取图片。因为新版作品页切换作品不需要刷新页面了，所以要传递实时的url。
            this.getIllustData(window.location.href);
        }
    }
    // 下载相关作品时使用
    getListPage() {
        titleBar.changeTitle('↑');
        let url = 'https://www.pixiv.net/ajax/illust/' +
            API.getIllustId() +
            '/recommend/init?limit=18';
        // 最后的 18 是预加载首屏的多少个作品的信息，和下载并没有关系
        // 发起请求，获取列表页
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.text();
            }
            else {
                throw new Error(response.status.toString());
            }
        })
            .then((data) => {
            const recommendData = JSON.parse(data).body.recommendMethods;
            let recommendIdList = Object.keys(recommendData);
            // wantPage 可能是 -1 或者大于 0 的数字。当设置了下载个数时，进行裁剪
            if (setting.wantPage !== -1) {
                recommendIdList = recommendIdList.reverse().slice(0, setting.wantPage);
            }
            store.addIllustUrlList(recommendIdList); // 拼接作品的url
            Log.add(lang.transl('_相关作品抓取完毕', store.illustUrlList.length.toString()));
            this.getListUrlFinished();
        });
    }
}
// 抓取用户页面
class CrawlUserPage extends CrawlPageBase {
    constructor() {
        super(...arguments);
        this.onceRequest = 100; // 每次请求多少个数量
        this.hasTag = false; // pageType 2 里，是否带 tag
        this.type2ListType = 0; // pageType 2 里的页面类型，都是列表页
        this.offsetNumber = 0; // 要去掉的作品数量
        this.url = ''; // 请求的 url
    }
    getWangtPage() {
        let pageTip = lang.transl('_checkWantPageRule1Arg7');
        if (dlCtrl.downRecommended) {
            pageTip = lang.transl('_checkWantPageRule1Arg11');
        }
        const result = setting.checkWantPageInput(lang.transl('_checkWantPageRule1Arg2'), lang.transl('_checkWantPageRule1Arg6'), pageTip);
        if (!result) {
            throw new Error('CrawlPage error: Illegal parameter.');
        }
    }
    nextStep() {
        // 下载推荐图片
        if (dlCtrl.downRecommended) {
            this.getRecommendedList();
        }
        else {
            this.readyGetListPage();
        }
    }
    // 获取作品列表页前的准备工作
    readyGetListPage() {
        // 每次开始时重置一些条件
        this.offsetNumber = 0;
        store.type2IdList = [];
        this.type2ListType = 0;
        // works_type:
        // 0 插画和漫画全都要，但是不带 tag
        // 4 插画和漫画全都要，带 tag
        // 1 只要插画
        // 2 只要漫画
        // 3 书签作品
        // 是否是 tag 模式
        this.hasTag = !!API.getQuery(location.href, 'tag');
        // 每页个数
        let onceNumber = 48; // 新版每页 48 个作品（因为新版不显示无法访问的作品，所以有时候一页不足这个数量）
        // 旧版每页 20 个作品
        if (document.querySelector('.user-name')) {
            onceNumber = 20;
        }
        // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
        const nowPage = API.getQuery(location.href, 'p'); // 判断当前处于第几页，页码从 1 开始。也可能没有页码
        if (nowPage) {
            this.offsetNumber = (parseInt(nowPage) - 1) * onceNumber;
        }
        if (this.offsetNumber < 0) {
            this.offsetNumber = 0;
        }
        // 根据页数设置，计算要下载的个数
        this.requsetNumber = 0;
        if (setting.wantPage === -1) {
            this.requsetNumber = 9999999;
        }
        else {
            this.requsetNumber = onceNumber * setting.wantPage;
        }
        // 根据不同的页面类型，选择不同的 API 来获取 id 列表
        this.url = `https://www.pixiv.net/ajax/user/${DOM.getUserId()}/profile/all`;
        if (location.href.includes('member.php?id=')) {
            // 画师资料页主页，采用默认设置即可，无需进行处理
        }
        else if (/member_illust\.php\?.*id=/.test(location.href)) {
            // 作品列表页
            if (API.getQuery(location.href, 'type') === 'illust') {
                // 插画分类
                this.type2ListType = 1;
                // 带 tag
                if (this.hasTag) {
                    this.url = `https://www.pixiv.net/ajax/user/${DOM.getUserId()}/illusts/tag?tag=${API.getQuery(location.href, 'tag')}&offset=${this.offsetNumber}&limit=${this.requsetNumber}`;
                }
            }
            else if (API.getQuery(location.href, 'type') === 'manga') {
                // 漫画分类
                this.type2ListType = 2;
                // 带 tag
                if (this.hasTag) {
                    this.url = `https://www.pixiv.net/ajax/user/${DOM.getUserId()}/manga/tag?tag=${API.getQuery(location.href, 'tag')}&offset=${this.offsetNumber}&limit=${this.requsetNumber}`;
                }
            }
            else if (this.hasTag) {
                // url 里没有插画也没有漫画，但是有 tag，则是在资料页首页点击了 tag，需要同时获取插画和漫画
                this.type2ListType = 4;
                this.url = `https://www.pixiv.net/ajax/user/${DOM.getUserId()}/illustmanga/tag?tag=${API.getQuery(location.href, 'tag')}&offset=${this.offsetNumber}&limit=${this.requsetNumber}`;
            }
        }
        else if (location.href.includes('bookmark.php')) {
            // 书签页面，需要多次循环获取
            this.type2ListType = 3;
            this.hasTag = true; // 书签页面固定设置为有 tag（虽然有时候并没有带 tag，但数据结构和带 tag 是一样的）
            let restMode = 'show'; // 判断是公开收藏还是非公开收藏
            if (API.getQuery(location.href, 'rest') === 'hide') {
                restMode = 'hide';
            }
            let nowTag = API.getQuery(location.href, 'tag'); // 要使用的tag
            // 在“未分类”页面时，设置 tag
            if (parseInt(API.getQuery(location.href, 'untagged')) === 1) {
                nowTag = encodeURI('未分類');
            }
            this.url = `https://www.pixiv.net/ajax/user/${DOM.getUserId()}/illusts/bookmarks?tag=${nowTag}&offset=${this.offsetNumber}&limit=${this.onceRequest}&rest=${restMode}`;
        }
        else {
            // 不进行抓取
            dl.allowWork = true;
            return;
        }
        titleBar.changeTitle('↑');
        this.getListPage();
        Log.add(lang.transl('_正在抓取'));
        if (this.type2ListType === 3 && setting.wantPage === -1) {
            Log.add(lang.transl('_获取全部书签作品'));
        }
    }
    // 获取作品列表页
    getListPage() {
        let bmkGetEnd = false; // 书签作品是否获取完毕
        fetch(this.url, {
            credentials: 'same-origin'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.status.toString());
            }
        })
            .then((data) => {
            // 不带 tag，并且也不是书签页面
            if (!this.hasTag) {
                // 都是使用的这个 tag
                // https://www.pixiv.net/ajax/user/27517/profile/all
                const thisdata = data;
                if (this.type2ListType === 0) {
                    // 获取全部插画和漫画
                    store.type2IdList = store.type2IdList
                        .concat(Object.keys(thisdata.body.illusts))
                        .concat(Object.keys(thisdata.body.manga));
                }
                else if (this.type2ListType === 1) {
                    // 插画列表页，包含动图
                    store.type2IdList = store.type2IdList.concat(Object.keys(thisdata.body.illusts));
                }
                else if (this.type2ListType === 2) {
                    // 漫画列表页
                    store.type2IdList = store.type2IdList.concat(Object.keys(thisdata.body.manga));
                }
            }
            else {
                // 带 tag
                const thisdata = data;
                const works = thisdata.body.works;
                // 不是书签页面
                if (this.type2ListType !== 3) {
                    // 插画、漫画、或者全都要并带 tag ，数据结构都一样
                    // https://www.pixiv.net/ajax/user/27517/illusts/tag?tag=%E5%A5%B3%E3%81%AE%E5%AD%90&offset=0&limit=9999999
                    // https://www.pixiv.net/ajax/user/27517/manga/tag?tag=%E5%A5%B3%E3%81%AE%E5%AD%90&offset=0&limit=9999999
                    // https://www.pixiv.net/ajax/user/544479/illustmanga/tag?tag=%E6%9D%B1%E9%A2%A8%E8%B0%B7%E6%97%A9%E8%8B%97&offset=0&limit=9999999
                    works.forEach(data => store.type2IdList.push(data.id));
                }
                else {
                    // 书签页面
                    // https://www.pixiv.net/ajax/user/9460149/illusts/bookmarks?tag=&offset=0&limit=100&rest=show
                    // https://www.pixiv.net/ajax/user/9460149/illusts/bookmarks?tag=推荐&offset=0&limit=100&rest=show
                    // 获取数量超出实际存在数量，works 长度会是 0，代表后面没有更多页面了
                    if (works.length === 0 ||
                        store.type2IdList.length >= this.requsetNumber) {
                        bmkGetEnd = true; // 书签页获取完毕
                    }
                    else {
                        works.forEach(data => store.type2IdList.push(data.id));
                    }
                }
            }
            if (store.type2IdList.length > 0) {
                if (this.type2ListType === 0 ||
                    (this.type2ListType === 1 && !this.hasTag) ||
                    (this.type2ListType === 2 && !this.hasTag)) {
                    // 非书签页，并且非 tag 页
                    // 在获取全部作品时（即使用默认的 api 时），由于 API 里不能设置 requset_number，所以要在这里处理。
                    // 把 id 从小到大排序
                    let tempList = [];
                    // 转换成数字
                    tempList = store.type2IdList.map(id => {
                        return parseInt(id);
                    });
                    // 升序排列
                    tempList.sort(function (x, y) {
                        return x - y;
                    });
                    // 保存到结果中
                    store.type2IdList = tempList.map(id => {
                        return id.toString();
                    });
                    // 删除后面的 id（删除不需要的近期作品）
                    store.type2IdList.splice(store.type2IdList.length - this.offsetNumber, store.type2IdList.length);
                }
                // 获取完毕后，对 id 列表进行处理。不需要重复调用本函数的情况
                if (this.type2ListType !== 3 || bmkGetEnd) {
                    // 删除多余的作品
                    if (store.type2IdList.length > this.requsetNumber) {
                        if (this.type2ListType !== 3) {
                            // 删除前面部分
                            store.type2IdList.splice(0, store.type2IdList.length - this.requsetNumber);
                        }
                        else {
                            // 书签作品需要删除后面部分
                            store.type2IdList.splice(this.requsetNumber, store.type2IdList.length);
                            // 书签页面的 api 没有考虑页面上的排序顺序。获取到的 id 列表是按收藏顺序由最近到最早排列的
                        }
                    }
                    // 重置之前的结果
                    store.illustUrlList = [];
                    store.addIllustUrlList(store.type2IdList); // 拼接作品的url
                    Log.add(lang.transl('_列表抓取完成开始获取作品页', store.illustUrlList.length.toString()));
                    this.getListUrlFinished();
                }
                else if (this.type2ListType === 3 && !bmkGetEnd) {
                    // 如果是书签页，且没有获取完毕，则重复执行
                    this.offsetNumber += this.onceRequest; // 每次增加偏移量，并获取之后固定数量
                    this.url = this.url.replace(/offset=\d*\d?/, `offset=${this.offsetNumber}`);
                    this.getListPage();
                }
            }
            else {
                return this.noResult();
            }
        })
            .catch(error => console.log(error));
    }
    // 获取书签页面下方的推荐作品列表
    getRecommendedList() {
        // 获取下方已经加载出来的作品
        const elements = document.querySelectorAll('#illust-recommend .image-item');
        if (elements.length === 0) {
            Log.add(lang.transl('_抓取完毕'));
            Log.add(lang.transl('_没有符合条件的作品'), 2, 2);
            window.alert(lang.transl('_抓取完毕') + lang.transl('_没有符合条件的作品'));
            dl.allowWork = true;
            dlCtrl.downRecommended = false;
            return;
        }
        // 添加作品列表
        for (const li of elements) {
            const a = li.querySelector('a');
            store.illustUrlList.push(a.href);
        }
        this.getListUrlFinished();
    }
}
// 抓取搜索页
class CrawlSearchPage extends CrawlPageBase {
    constructor() {
        super(...arguments);
        this.searchResult = []; // 储存 tag 搜索页面上符合条件的作品
        this.tagPageFinished = 0; // 记录 tag 搜索页本次任务已经抓取了多少页
        // 因为 tag 搜索页新版的作品不是直接输出到页面里,但我们需要呈现 html ,所以需要模拟生成的元素
        this.tagSearchNewHtml = `
<div class="JoCpVnw" data-illust-type="xz_illustType">
<figure class="mSh0kS-" style="width: 200px; max-height: 288px;">
<div class="_3IpHIQ_">
<a href="/member_illust.php?mode=medium&illust_id=xz_illustId" rel="noopener" class="PKslhVT">
<!--xz_multiple_html-->
<img alt="" class="_1hsIS11" width="xz_width" height="xz_height" src="xz_url">
<!--xz_ugoira_html-->
</a>
<div class="thumbnail-menu">
<div class="_one-click-bookmark js-click-trackable xz_isBookmarked" data-click-category="abtest_www_one_click_bookmark" data-click-action="illust" data-click-label="xz_illustId" data-type="illust" data-id="xz_illustId" title="添加收藏" style="position: static;"></div>
<div class="_balloon-menu-opener">
<div class="opener"></div>
<section class="_balloon-menu-popup">
<ul class="_balloon-menu-closer menu">
<li>
<span class="item">${lang.transl('_屏蔽设定')}</span>
</li>
<li>
<a class="item" target="_blank" href="/illust_infomsg.php?illust_id=xz_illustId">${lang.transl('_举报')}</a>
</li>
</ul>
</section>
</div>
</div>
</div>
<figcaption class="_3HwPt89">
<ul>
<li class="QBU8zAz">
<a href="/member_illust.php?mode=medium&illust_id=xz_illustId" title="xz_illustTitle">xz_illustTitle</a>
</li>
<li>
<a href="/member_illust.php?id=xz_userId" target="_blank" title="xzUserName" class="js-click-trackable ui-profile-popup _2wIynyg" data-click-category="recommend 20130415-0531" data-click-action="ClickToMember" data-click-label="" data-user_id="xz_userId" data-user_name="xzUserName">
<span class="_3KDKjXM">
<div class="" style="background: url(xz_userImage) center top / cover no-repeat; width: 16px; height: 16px;"></div>
</span>
<span class="lPoWus1">xzUserName</span>
</a>
</li>
<li style="position: relative;">
<ul class="count-list">
<li>
<a href="/bookmark_detail.php?illust_id=xz_illustId" class="_ui-tooltip bookmark-count"> <i class="_icon sprites-bookmark-badge"></i>xz_bookmarkCount</a>
</li>
</ul>
</li>
</ul>
</figcaption>
</figure>
</div>
`;
        // tag 搜索页作品的html中的多图标识
        this.xzMultipleHtml = `<div class="${dl.tagSearchMultipleSelector.replace('.', '')}"><span><span class="XPwdj2F"></span>xz_pageCount</span></div>`;
        // tag 搜索页作品的html中的动图标识
        this.xzUgoiraHtml = `<div class="${dl.tagSearchUgoiraSelector.replace('.', '')}"></div>`;
        this.dataSelector = '#js-mount-point-search-result-list'; // tag 搜索页，储存作品信息的元素
        this.worksListWrap = '.x7wiBV0'; //  tag 搜索页，储存作品列表的元素
    }
    getWangtPage() {
        const result = setting.checkWantPageInput(lang.transl('_checkWantPageRule1Arg2'), lang.transl('_checkWantPageRule1Arg6'), lang.transl('_checkWantPageRule1Arg7'));
        if (!result) {
            return;
        }
        if (setting.wantPage === -1) {
            setting.wantPage = 1000; // tag 搜索页最多只能获取一千页
        }
        // 如果是首次抓取，则移除当前列表。之后会把抓取结果放进来
        if (!dl.listPageFinished) {
            DOM.removeEl(document.querySelectorAll(dl.worksSelector));
        }
    }
    nextStep() {
        // 去除热门作品一栏
        DOM.removeEl(document.querySelectorAll('._premium-lead-popular-d-body'));
        this.getListPage();
    }
    getListPage() {
        titleBar.changeTitle('↑');
        let url = dl.baseUrl + (dl.startpageNo + dl.listPageFinished);
        // 发起请求，获取列表页
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.text();
            }
            else {
                throw new Error(response.status.toString());
            }
        })
            .then((data) => {
            dl.listPageFinished++;
            let listPageDocument;
            // 解析网页内容。排行榜和相似作品、相关作品，直接获取 json 数据，不需要这样处理
            listPageDocument = new window.DOMParser().parseFromString(data, 'text/html');
            // tag 搜索页
            this.tagPageFinished++;
            let thisOneInfo = listPageDocument.querySelector(this.dataSelector).dataset.items;
            // 保存本页的作品信息
            let thisOneData = JSON.parse(thisOneInfo);
            // 删除广告信息。热门的 tag 搜索列表里可能会混杂广告
            thisOneData.forEach((item, index, array) => {
                if (item.isAdContainer) {
                    array.splice(index, 1);
                }
            });
            setting.displayCover = setting.xzForm.setDisplayCover.checked;
            const listWrap = document.querySelector(this.worksListWrap);
            // 在这里进行一些检查，不符合条件的作品 continue 跳过，符合条件的保留下来
            for (const data of thisOneData) {
                // 检查收藏设置
                const bookmarkCount = data.bookmarkCount;
                if (bookmarkCount < setting.filterBmk) {
                    continue;
                }
                // 检查宽高设置和宽高比设置
                const tureWidth = data.width;
                const tureHeight = data.height;
                if (!setting.checkSetWh(tureWidth, tureHeight) ||
                    !setting.checkRatio(tureWidth, tureHeight)) {
                    continue;
                }
                // 检查只下载书签作品的设置
                if (!setting.checkOnlyDownBmk(data.isBookmarked)) {
                    continue;
                }
                // 检查排除类型设置
                if (setting.notdownType.includes(data.illustType)) {
                    continue;
                }
                // 检查排除的 tag 的设置
                if (setting.checkNotNeedTag(data.tags)) {
                    continue;
                }
                // 检查必须包含的 tag  的设置
                if (!setting.checkNeedTag(data.tags)) {
                    continue;
                }
                // 检查通过后,拼接每个作品的html
                let newHtml = this.tagSearchNewHtml;
                newHtml = newHtml.replace('xz_illustType', data.illustType);
                if (data.isBookmarked) {
                    newHtml = newHtml.replace(/xz_isBookmarked/g, 'on');
                }
                if (data.pageCount > 1) {
                    newHtml = newHtml.replace('<!--xz_multiple_html-->', this.xzMultipleHtml);
                }
                if (data.illustType === '2') {
                    newHtml = newHtml.replace('<!--xz_ugoira_html-->', this.xzUgoiraHtml);
                }
                newHtml = newHtml
                    .replace(/xz_illustId/g, data.illustId)
                    .replace(/xz_pageCount/g, data.pageCount.toString());
                if (setting.displayCover) {
                    newHtml = newHtml.replace(/xz_url/g, data.url);
                }
                else {
                    newHtml = newHtml.replace(/xz_url/g, '');
                }
                newHtml = newHtml
                    .replace(/xz_illustTitle/g, data.illustTitle)
                    .replace(/xz_userId/g, data.userId)
                    .replace(/xzUserName/g, data.userName)
                    .replace(/xz_userImage/g, data.userImage)
                    .replace(/xz_bookmarkCount/g, data.bookmarkCount.toString());
                // 设置宽高
                const maxWidth = '198';
                const maxHeight = '198';
                if (tureWidth >= tureHeight) {
                    newHtml = newHtml
                        .replace(/xz_width/g, maxWidth)
                        .replace(/xz_height/g, 'auto');
                }
                else {
                    newHtml = newHtml
                        .replace(/xz_width/g, 'auto')
                        .replace(/xz_height/g, maxHeight);
                }
                this.searchResult.push({
                    id: parseInt(data.illustId),
                    el: newHtml,
                    num: Number(bookmarkCount)
                });
                listWrap.insertAdjacentHTML('beforeend', newHtml);
            }
            Log.add(lang.transl('_tag搜索页已抓取多少页', this.tagPageFinished.toString(), setting.wantPage.toString(), (dl.startpageNo + dl.listPageFinished - 1).toString()), -1, 1, false);
            // 每抓取完一页，判断任务状态
            if (this.tagPageFinished === setting.wantPage) {
                // 抓取完了指定的页数
                Log.add(lang.transl('_tag搜索页任务完成1'), 0);
                this.tagSearchPageFinished();
                return;
            }
            else if (!listPageDocument.querySelector('.next ._button')) {
                // 到最后一页了,已抓取本 tag 的所有页面
                Log.add(lang.transl('_tag搜索页任务完成2'), 0);
                this.tagSearchPageFinished();
                return;
            }
            else if (dlCtrl.interrupt) {
                // 任务被用户中断
                Log.add(lang.transl('_tag搜索页中断'), 2);
                dlCtrl.interrupt = false;
                this.tagSearchPageFinished();
                return;
            }
            else {
                this.getListPage();
            }
        });
    }
    getWorksList() {
        titleBar.changeTitle('↑');
        if (!dl.allowWork) {
            window.alert(lang.transl('_当前任务尚未完成2'));
            return;
        }
        if (DOM.getVisibleEl(dl.worksSelector).length === 0) {
            return;
        }
        dlCtrl.interrupt = false;
        store.illustUrlList = [];
        this.resetResult();
        // 因为 tag 搜索页里的下载按钮是从这里开始执行，所以有些检查在这里进行
        // 这里有一些检查是之前在 startGet 里检查过的，这里再检查一次，以应对用户中途修改设置的情况
        // 检查是否设置了作品张数限制
        setting.getImgNumberPerWork();
        // 获取必须包含的tag
        setting.getNeedTag();
        // 获取要排除的tag
        setting.getNotNeedTag();
        // 检查是否设置了只下载书签作品
        setting.getOnlyBmk();
        // 检查排除作品类型的设置
        setting.getNotDownType();
        // 检查是否设置了宽高条件
        setting.getSetWh();
        // 检查宽高比设置
        setting.getRatioSetting();
        // 下载时，只下载可见的作品，不下载隐藏起来的作品
        const allPicArea = DOM.getVisibleEl(dl.worksSelector);
        // tag 搜索页里，标识作品类型的 class 与其他页面不同，所以在这里转换成能被接下来的函数识别的字符
        for (const el of allPicArea) {
            // 检查排除类型设置
            // 在筛选时给作品列表加上了类型标志。如果不筛选而直接下载，是没有标志的，不过不影响判断
            const illustType = el.dataset.illustType;
            if (setting.notdownType.includes(illustType)) {
                continue;
            }
            // 检查排除类型的设置
            if (setting.notdownType.includes(illustType)) {
                continue;
            }
            // 检查只下载书签作品的设置
            const bookmarked = el
                .querySelector('._one-click-bookmark')
                .classList.contains('on');
            if (!setting.checkOnlyDownBmk(bookmarked)) {
                continue;
            }
            store.illustUrlList.push(el.querySelector('a').href);
        }
        dl.allowWork = false;
        Log.add(lang.transl('_列表抓取完成开始获取作品页', store.illustUrlList.length.toString()));
        if (store.illustUrlList.length <= 0) {
            return this.noResult();
        }
        this.getListUrlFinished();
    }
    // tag搜索页的筛选任务执行完毕
    tagSearchPageFinished() {
        dl.allowWork = true;
        this.tagPageFinished = 0; // 重置已抓取的页面数量
        Log.add(lang.transl('_当前作品张数', document.querySelectorAll(dl.worksSelector).length.toString()), -1, 2);
        this.listSort();
        titleBar.changeTitle('→');
    }
    // 对结果列表进行排序，按收藏数从高到低显示
    listSort() {
        this.searchResult.sort(API.sortByProperty('num'));
        const listWrap = document.querySelector(this.worksListWrap);
        listWrap.innerHTML = '';
        this.searchResult.forEach(data => {
            listWrap.insertAdjacentHTML('beforeend', data.el);
        });
    }
}
// 抓取地区排行榜页面
class CrawlAreaRankingPage extends CrawlPageBase {
    nextStep() {
        this.getListPage();
    }
    getListPage() {
        titleBar.changeTitle('↑');
        // 地区排行榜
        const allPicArea = document.querySelectorAll('.ranking-item>.work_wrapper');
        for (const el of allPicArea) {
            const img = el.querySelector('._thumbnail');
            // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型
            // 提取出 tag 列表
            const tags = img.dataset.tags.split(' ');
            // 检查排除的 tag 的设置
            if (setting.checkNotNeedTag(tags)) {
                continue;
            }
            // 检查必须包含的 tag  的设置
            if (!setting.checkNeedTag(tags)) {
                continue;
            }
            // 检查只下载书签作品的设置
            const bookmarked = el
                .querySelector('._one-click-bookmark')
                .classList.contains('on');
            if (!setting.checkOnlyDownBmk(bookmarked)) {
                continue;
            }
            store.illustUrlList.push(el.querySelector('a').href);
        }
        dl.allowWork = false;
        Log.add(lang.transl('_列表抓取完成开始获取作品页', store.illustUrlList.length.toString()));
        if (store.illustUrlList.length <= 0) {
            return this.noResult();
        }
        this.getListUrlFinished();
    }
}
// 抓取排行榜页面
class CrawlRankingPage extends CrawlPageBase {
    constructor() {
        super(...arguments);
        this.partNumber = 10; // 保存不同排行榜的列表数量
    }
    setPartNum() {
        // 设置页数。排行榜页面一页有50张作品，当页面到达底部时会加载下一页
        if (dl.baseUrl.includes('r18g')) {
            // r18g 只有1个榜单，固定1页
            this.partNumber = 1;
        }
        else if (dl.baseUrl.includes('_r18')) {
            // r18 模式，这里的6是最大值，有的排行榜并没有6页
            this.partNumber = 6;
        }
        else {
            // 普通模式，这里的10也是最大值。如果实际没有10页，则在检测到404页面的时候停止抓取下一页
            this.partNumber = 10;
        }
    }
    getWangtPage() {
        dl.listPageFinished = 0;
        // 检查下载页数的设置
        let result = setting.checkWantPageInput(lang.transl('_checkWantPageRule1Arg2'), lang.transl('_checkWantPageRule1Arg12'), lang.transl('_checkWantPageRule1Arg4'));
        if (!result) {
            return;
        }
        // 如果设置的作品个数是 -1，则设置为下载所有作品
        if (setting.wantPage === -1) {
            setting.wantPage = 500;
        }
    }
    nextStep() {
        this.getListPage();
    }
    getListPage() {
        this.setPartNum();
        titleBar.changeTitle('↑');
        let url = dl.baseUrl + (dl.startpageNo + dl.listPageFinished);
        // 发起请求，获取列表页
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.text();
            }
            else {
                throw new Error(response.status.toString());
            }
        })
            .then((data) => {
            dl.listPageFinished++;
            let complete = false; // 如果数量足够，就标记为完成
            const contents = JSON.parse(data).contents; // 取出作品信息列表
            for (const data of contents) {
                // 不是下载首次登场作品时，会检查设置的下载数量。下载首次登场作品时不检查。
                if (!dlCtrl.debut && data.rank > setting.wantPage) {
                    complete = true;
                    break;
                }
                // 目前，数据里并没有包含收藏数量，所以在这里没办法检查收藏数量要求
                // 检查只下载“首次收藏”要求。yes_rank 是昨日排名，如果为 0，则此作品是“首次登场”的作品
                if (dlCtrl.debut && data.yes_rank !== 0) {
                    continue;
                }
                // 检查只下载收藏作品的设置
                if (!setting.checkOnlyDownBmk(data.is_bookmarked)) {
                    continue;
                }
                // 检查排除类型的设置
                if (setting.notdownType.includes(data.illust_type)) {
                    continue;
                }
                // 检查排除的 tag 的设置
                if (setting.checkNotNeedTag(data.tags)) {
                    continue;
                }
                // 检查必须包含的 tag  的设置
                if (!setting.checkNeedTag(data.tags)) {
                    continue;
                }
                // 检查宽高设置和宽高比设置
                if (!setting.checkSetWh(data.width, data.height) ||
                    !setting.checkRatio(data.width, data.height)) {
                    continue;
                }
                store.rankList[data.illust_id.toString()] = data.rank.toString();
                store.addIllustUrlList([data.illust_id.toString()]);
            }
            Log.add(lang.transl('_排行榜进度', dl.listPageFinished.toString()), -1, 1, false);
            // 抓取完毕
            if (complete || dl.listPageFinished === this.partNumber) {
                if (store.illustUrlList.length === 0) {
                    return this.noResult();
                }
                else {
                    Log.add(lang.transl('_排行榜任务完成', store.illustUrlList.length.toString()));
                    this.getListUrlFinished();
                }
            }
            else {
                // 继续抓取
                this.getListPage();
            }
        })
            .catch((error) => {
            // error 的 message 属性是请求出错时的状态码
            if (error.message === '404') {
                // 排行榜
                if (this.type === 7) {
                    // 如果发生了404错误，则中断抓取，直接下载已有部分。（因为可能确实没有下一部分了。预设的最大页数可能不符合当前情况
                    console.log('404错误，直接下载已有部分');
                    if (store.illustUrlList.length === 0) {
                        return this.noResult();
                    }
                    else {
                        Log.add(lang.transl('_排行榜任务完成', store.illustUrlList.length.toString()));
                        this.getListUrlFinished();
                    }
                }
            }
        });
    }
}
// 抓取 pixivision 页面
class CrawlPixivisionPage extends CrawlPageBase {
    constructor() {
        super(...arguments);
        this.tested = 0; // 检查图片后缀名时的计数
    }
    readyGet() {
        this.getPixivision();
    }
    getListPage() { }
    getPixivision() {
        const typeA = document.querySelector('a[data-gtm-action=ClickCategory]');
        const type = typeA.dataset.gtmLabel;
        this.resetResult();
        titleBar.changeTitle('↑');
        if (type === 'illustration') {
            // 针对不同类型的页面，使用不同的选择器
            const imageList = document.querySelectorAll('.am__work__main img');
            const urls = Array.from(imageList).map(el => {
                return el.src
                    .replace('c/768x1200_80/img-master', 'img-original')
                    .replace('_master1200', '');
            });
            this.tested = 0;
            urls.forEach(url => {
                let arr = url.split('/');
                const id = arr[arr.length - 1].split('.')[0]; // 取出作品 id
                this.testExtName(url, urls.length, {
                    id: id,
                    title: '',
                    tags: [],
                    user: '',
                    userid: '',
                    fullWidth: '',
                    fullHeight: ''
                });
            });
        }
        else {
            let selector = '';
            if (type === 'manga') {
                selector = '.am__work__illust';
            }
            else if (type === 'cosplay') {
                selector = '.fab__image-block__image img';
            }
            // 把图片url添加进数组
            const imageList = document.querySelectorAll(selector);
            Array.from(imageList).forEach(el => {
                const imgUrl = el.src;
                if (imgUrl !== 'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg') {
                    // 跳过Cure的logo图片
                    let arr = imgUrl.split('/');
                    const id = arr[arr.length - 1].split('.')[0]; // 作品id
                    const ext = arr[arr.length - 1]; // 扩展名
                    store.addResults(id, imgUrl, '', [], [], '', '', 0, 0, ext, 0, '', 0, '', {});
                }
            });
            this.crawFinished();
        }
    }
    // 测试图片 url 是否正确的函数。pixivision 页面直接获取的图片 url，后缀都是jpg的，所以要测试实际上是jpg还是png
    testExtName(url, imgNumber, imgInfoData) {
        let ext = '';
        const testImg = new Image();
        testImg.src = url;
        testImg.onload = () => nextStep(true);
        testImg.onerror = () => nextStep(false);
        let nextStep = (bool) => {
            if (bool) {
                ext = 'jpg';
            }
            else {
                url = url.replace('.jpg', '.png');
                ext = 'png';
            }
            store.addResults(imgInfoData.id, url, imgInfoData.title, imgInfoData.tags, [], imgInfoData.user, imgInfoData.userid, imgInfoData.fullWidth, imgInfoData.fullHeight, ext, 0, '', 0, '', {});
            this.outputImgNum();
            if (imgNumber !== undefined) {
                this.tested++;
                if (this.tested === imgNumber) {
                    // 如果所有请求都执行完毕
                    this.crawFinished();
                }
            }
        };
    }
}
// 抓取 bookmark_detail 页面
class CrawlBookmarkDetailPage extends CrawlPageBase {
    getWangtPage() { }
    getListPage() {
        const maxNum = 500; // 设置最大允许获取多少个作品。相似作品的这个数字是可以改的，可以比 500 更大，这里只是一个预设值。
        let wangPage = setting.getWantPage();
        this.requsetNumber = wangPage;
        if (wangPage > maxNum) {
            this.requsetNumber = maxNum;
        }
        titleBar.changeTitle('↑');
        let url = '';
        const id = API.getIllustId(); // 作品页的url需要实时获取
        url =
            '/rpc/recommender.php?type=illust&sample_illusts=' +
                id +
                '&num_recommendations=' +
                this.requsetNumber; // 获取相似的作品
        // 发起请求，获取列表页
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.text();
            }
            else {
                throw new Error(response.status.toString());
            }
        })
            .then((data) => {
            dl.listPageFinished++;
            // 添加收藏后的相似作品
            const illustList = JSON.parse(data).recommendations; // 取出id列表
            store.addIllustUrlList(illustList); // 拼接作品的url
            Log.add(lang.transl('_排行榜任务完成', store.illustUrlList.length.toString()));
            this.getListUrlFinished();
        });
    }
}
// 抓取 关注的人的新作品 以及 大家的新作品页面
class CrawlNewIllustPage extends CrawlPageBase {
    constructor() {
        super(...arguments);
        this.listIsNewMode = false;
        this.dataSelector = '#js-mount-point-latest-following';
    }
    getWangtPage() {
        const wantPage = setting.getWantPage();
        if (wantPage) {
            Log.add(lang.transl('_任务开始1', setting.wantPage.toString()), 1);
        }
    }
    nextStep() {
        if (location.href.includes('/bookmark_new_illust')) {
            this.listIsNewMode = true;
        }
        this.getListPage();
    }
    getListPage() {
        titleBar.changeTitle('↑');
        let url = dl.baseUrl + (dl.startpageNo + dl.listPageFinished);
        // 发起请求，获取列表页
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.text();
            }
            else {
                throw new Error(response.status.toString());
            }
        })
            .then((data) => {
            dl.listPageFinished++;
            let listPageDocument = new window.DOMParser().parseFromString(data, 'text/html');
            // 不要把下一行的 if 和上一行的 else 合并
            if (this.type === 10 && this.listIsNewMode === true) {
                // 关注的新作品 列表改成和 tag 搜索页一样的了
                let thisOneInfo = listPageDocument.querySelector(this.dataSelector).dataset.items;
                // 保存本页的作品信息
                let thisOneData = JSON.parse(thisOneInfo);
                for (const data of thisOneData) {
                    // 检查收藏设置
                    // 关注的新作品页面里的 bookmarkCount 都是 0. 这可能是因为该页面不需要展示收藏数，所以就直接设置为 0 了。所以目前这里不能判断收藏数
                    // const bookmarkCount = data.bookmarkCount
                    // if (bookmarkCount < filterBmk) {
                    //   continue
                    // }
                    // 检查宽高设置和宽高比设置
                    const tureWidth = data.width;
                    const tureHeight = data.height;
                    if (!setting.checkSetWh(tureWidth, tureHeight) ||
                        !setting.checkRatio(tureWidth, tureHeight)) {
                        continue;
                    }
                    // 检查只下载书签作品的设置
                    if (!setting.checkOnlyDownBmk(data.isBookmarked)) {
                        continue;
                    }
                    // 检查排除类型的设置
                    if (setting.notdownType.includes(data.illustType)) {
                        continue;
                    }
                    // 检查排除的 tag 的设置
                    if (setting.checkNotNeedTag(data.tags)) {
                        continue;
                    }
                    // 检查必须包含的 tag  的设置
                    if (!setting.checkNeedTag(data.tags)) {
                        continue;
                    }
                    store.addIllustUrlList([data.illustId]);
                }
            }
            else {
                // 传统的列表页，作品是直接包含在页面里的
                const allPicArea = listPageDocument.querySelectorAll('._image-items .image-item');
                for (const el of allPicArea) {
                    // 如果这个作品被删除、或非公开，则去掉它
                    if (el.querySelector('.title').getAttribute('title') === '-----') {
                        continue;
                    }
                    const img = el.querySelector('._thumbnail');
                    // img.dataset.type 全都是 "illust"，因此不能用来区分作品类型
                    // 提取出 tag 列表
                    const tags = img.dataset.tags.split(' ');
                    // 检查排除的 tag 的设置
                    if (setting.checkNotNeedTag(tags)) {
                        continue;
                    }
                    // 检查必须包含的 tag  的设置
                    if (!setting.checkNeedTag(tags)) {
                        continue;
                    }
                    // 检查只下载书签作品的设置
                    const bookmarked = el
                        .querySelector('._one-click-bookmark')
                        .classList.contains('on');
                    if (!setting.checkOnlyDownBmk(bookmarked)) {
                        continue;
                    }
                    store.illustUrlList.push(el.querySelector('a').href);
                }
            }
            Log.add(lang.transl('_列表页抓取进度', dl.listPageFinished.toString()), -1, 1, false);
            // 判断任务状态
            // 如果没有下一页的按钮或者抓取完指定页面
            if (!listPageDocument.querySelector('.next ._button') ||
                dl.listPageFinished === setting.wantPage) {
                dl.allowWork = true;
                dl.listPageFinished = 0;
                Log.add(lang.transl('_列表页抓取完成'));
                // 没有符合条件的作品
                if (store.illustUrlList.length === 0) {
                    return this.noResult();
                }
                else {
                    this.getListUrlFinished();
                }
            }
            else {
                // 继续抓取
                this.getListPage();
            }
        });
    }
}
// 抓取发现页面
class CrawlDiscoverPage extends CrawlPageBase {
    getWangtPage() { }
    getListPage() {
        titleBar.changeTitle('↑');
        // 在发现页面，仅下载已有部分，所以不需要去获取列表页
        const nowIllust = document.querySelectorAll('.QBU8zAz>a'); // 获取已有作品
        // 拼接作品的 url
        Array.from(nowIllust).forEach(el => {
            // discovery 列表的 url 是有额外后缀的，需要去掉
            store.illustUrlList.push(el.href.split('&uarea')[0]);
        });
        Log.add(lang.transl('_排行榜任务完成', store.illustUrlList.length.toString()));
        this.getListUrlFinished();
    }
}
// 下载控制类
// 任务状态，任务标记
class DownloadControl {
    constructor() {
        this.downDirection = 0; // 抓取方向，在作品页内指示抓取新作品还是旧作品
        /*
        -1 抓取新作品
        0 不设置抓取方向
        1 抓取旧作品
        */
        this.downRecommended = false; // 是否下载推荐作品（收藏页面下方）
        this.quickDownload = false; // 快速下载当前作品，这个只在作品页内直接下载时使用
        this.downRelated = false; // 是否下载相关作品（作品页内的）
        this.debut = false; // 只下载首次登场的作品
        this.downloadStarted = false; // 下载是否已经开始
        this.downloadStop = false; // 是否停止下载
        this.downloadPause = false; // 是否暂停下载
        this.interrupt = false; // 是否中断正在进行的任务，目前仅在 tag 搜索页使用
    }
    // 开始下载
    startDownload() {
        // 如果正在下载中，或无图片，则不予处理
        if (dlCtrl.downloadStarted || store.downloadList.length === 0) {
            return;
        }
        // 如果之前不是暂停状态，则需要重新下载
        if (!dlCtrl.downloadPause) {
            dl.downloaded = 0;
            ui.resetDownloadPanel();
            // 初始化下载记录
            // 状态：
            // -1 未使用
            // 0 使用中
            // 1 已完成
            dl.downloadedList = new Array(store.downloadList.length).fill(-1);
            dl.taskBatch = new Date().getTime(); // 修改本次下载任务的标记
        }
        else {
            // 继续下载
            // 把“使用中”的下载状态重置为“未使用”
            for (let index = 0; index < dl.downloadedList.length; index++) {
                if (dl.downloadedList[index] === 0) {
                    dl.downloadedList[index] = -1;
                }
            }
        }
        // 下载线程设置
        const setThread = parseInt(setting.xzForm.setThread.value);
        if (setThread < 1 ||
            setThread > setting.downloadThreadMax ||
            isNaN(setThread)) {
            // 如果数值非法，则重设为默认值
            setting.downloadThread = setting.downloadThreadMax;
        }
        else {
            setting.downloadThread = setThread; // 设置为用户输入的值
        }
        // 如果剩余任务数量少于下载线程数
        if (store.downloadList.length - dl.downloaded < setting.downloadThread) {
            setting.downloadThread = store.downloadList.length - dl.downloaded;
        }
        // 重设下载进度条的数量
        const centerWrapDownList = document.querySelector('.centerWrap_down_list');
        let downloadBarList = centerWrapDownList.querySelectorAll('.downloadBar');
        if (downloadBarList.length !== setting.downloadThread) {
            centerWrapDownList.innerHTML = downloadBarList[0].outerHTML.repeat(setting.downloadThread);
        }
        downloadBarList = centerWrapDownList.querySelectorAll('.downloadBar');
        centerWrapDownList.style.display = 'block';
        // 重置一些条件
        dlCtrl.downloadPause = false;
        dlCtrl.downloadStop = false;
        dlCtrl.downloadStarted = true;
        clearTimeout(dl.reTryTimer);
        // 启动或继续下载，建立并发下载线程
        for (let i = 0; i < setting.downloadThread; i++) {
            dlFile.download(i);
        }
        ui.changeDownStatus(lang.transl('_正在下载中'));
        Log.add(lang.transl('_正在下载中'));
        dlFile.showTotalProgress();
    }
    // 暂停下载
    pauseDownload() {
        clearTimeout(dl.reTryTimer);
        if (store.downloadList.length === 0) {
            return;
        }
        // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
        if (dlCtrl.downloadStop === true) {
            return;
        }
        if (dlCtrl.downloadPause === false) {
            // 如果正在下载中
            if (dlCtrl.downloadStarted) {
                dlCtrl.downloadPause = true; // 发出暂停信号
                dlCtrl.downloadStarted = false;
                dlCtrl.quickDownload = false;
                titleBar.changeTitle('║');
                ui.changeDownStatus(`<span style="color:#f00">${lang.transl('_已暂停')}</span>`);
                Log.add(lang.transl('_已暂停'), 1, 2);
            }
            else {
                // 不在下载中的话不允许启用暂停功能
                return;
            }
        }
    }
    // 停止下载
    stopDownload() {
        clearTimeout(dl.reTryTimer);
        if (store.downloadList.length === 0) {
            return;
        }
        if (dlCtrl.downloadStop === false) {
            dlCtrl.downloadStop = true;
            dlCtrl.downloadStarted = false;
            dlCtrl.quickDownload = false;
            titleBar.changeTitle('■');
            ui.changeDownStatus(`<span style="color:#f00">${lang.transl('_已停止')}</span>`);
            Log.add(lang.transl('_已停止'), 2, 2);
            dlCtrl.downloadPause = false;
        }
    }
    // 重试下载
    reTryDownload() {
        // 如果下载已经完成，则不执行操作
        if (dl.downloaded === store.downloadList.length) {
            return;
        }
        // 暂停下载并在一定时间后重试下载
        this.pauseDownload();
        dl.reTryTimer = setTimeout(() => {
            this.startDownload();
        }, 1000);
    }
}
// 下载和保存文件
class DownloadFile {
    constructor() {
        this.downloadTime = 0; // 把下载完成的文件交给浏览器保存的时间戳
        this.timeInterval = 200; // 设置向浏览器发送下载任务的间隔时间。如果在很短时间内让浏览器建立大量下载任务，有一些下载任务就会丢失，所以设置这个参数。
        this.listenDownloaded();
    }
    // 监听浏览器下载文件后，返回的消息
    listenDownloaded() {
        chrome.runtime.onMessage.addListener((msg) => {
            // 下载成功
            if (msg.msg === 'downloaded') {
                this.afterDownload(msg);
            }
            else if (msg.msg === 'download_err') {
                // 下载出错
                Log.add(`${store.downloadList[msg.data.thisIndex].id}: download error! code: ${msg.err}`, 2);
                dlCtrl.reTryDownload();
            }
        });
    }
    // 下载文件。参数是要使用的下载栏的序号
    download(downloadBarNo) {
        // 修改标题
        titleBar.changeTitle('↓');
        // 获取还未开始下载的文件的索引
        let thisImgInfo;
        let thisIndex = -1;
        for (let index = 0; index < dl.downloadedList.length; index++) {
            if (dl.downloadedList[index] === -1) {
                thisImgInfo = store.downloadList[index];
                thisIndex = index;
                dl.downloadedList[thisIndex] = 0;
                break;
            }
        }
        // 如果没有获取到则返回
        if (thisIndex === -1) {
            throw new Error('There are no files to download');
        }
        // 获取文件名
        let fullFileName = fileName.getFileName(thisImgInfo);
        // 重设当前下载栏的信息
        let downloadBarList = document.querySelectorAll('.downloadBar');
        const loadedBar = downloadBarList[downloadBarNo].querySelector('.loaded');
        const progressBar = downloadBarList[downloadBarNo].querySelector('.progress');
        loadedBar.textContent = '0/0';
        progressBar.style.width = '0%';
        downloadBarList[downloadBarNo].querySelector('.download_fileName').textContent = fullFileName;
        // 下载图片
        const xhr = new XMLHttpRequest();
        xhr.open('GET', thisImgInfo.url, true);
        xhr.responseType = 'blob';
        // 中止下载
        const btns = [ui.pauseBtn, ui.stopBtn];
        btns.forEach(el => {
            el.addEventListener('click', () => {
                xhr.abort();
            });
        });
        // 显示下载进度
        xhr.addEventListener('progress', function (e) {
            if (dlCtrl.downloadPause || dlCtrl.downloadStop) {
                return;
            }
            e = e || window.event;
            const loaded = Math.floor(e.loaded / 1024);
            const total = Math.floor(e.total / 1024);
            loadedBar.textContent = loaded + '/' + total;
            progressBar.style.width = (loaded / total) * 100 + '%';
        });
        // 图片下载完成
        xhr.addEventListener('loadend', async () => {
            if (dlCtrl.downloadPause || dlCtrl.downloadStop) {
                return;
            }
            // 正常下载完毕的状态码是 200
            if (xhr.status !== 200) {
                // 404 时不进行重试，因为重试也依然会是 404
                if (xhr.status === 404) {
                    // 输出提示信息
                    Log.add(lang.transl('_file404', thisImgInfo.id), 2, 1);
                    // 因为 404 时进度条不会动，所以需要手动设置进度条完成
                    progressBar.style.width = '100%';
                }
                else {
                    dlCtrl.reTryDownload();
                    return;
                }
            }
            let file = new Blob(); // 要下载的文件
            if (xhr.status === 404) {
                // 404 错误时创建 txt 文件，并保存提示信息
                file = new Blob([`${lang.transl('_file404', thisImgInfo.id)}`], {
                    type: 'text/plain'
                });
                fullFileName = fullFileName.replace(/\.jpg$|\.png$|\.zip$|\.gif$|\.webm$/, '.txt');
            }
            else if ((thisImgInfo.ext === 'webm' || thisImgInfo.ext === 'gif') &&
                thisImgInfo.ugoiraInfo.frames) {
                // 在转换之前检查停止状态，避免进行无用的转换，占用资源
                if (dlCtrl.downloadPause || dlCtrl.downloadStop) {
                    return;
                }
                file = xhr.response;
                // 如果需要转换成视频
                if (thisImgInfo.ext === 'webm') {
                    file = await convert.webm(file, thisImgInfo.ugoiraInfo);
                }
                // 如果需要转换成动图
                if (thisImgInfo.ext === 'gif') {
                    file = await new ConvertUgoira().gif(file, thisImgInfo.ugoiraInfo);
                }
                convert.setCount--; // 减少计数
            }
            else {
                // 不需要转换
                file = xhr.response;
            }
            // 生成下载链接
            const blobUrl = URL.createObjectURL(file);
            // 向浏览器发送下载任务
            this.browserDownload(blobUrl, fullFileName, downloadBarNo, thisIndex);
        });
        // 捕获错误
        xhr.addEventListener('error', () => {
            // 下载途中突然网络变化导致链接断开、以及超时都会 error，xhr.status 为 0。
            dlCtrl.reTryDownload();
            return;
        });
        xhr.send();
    }
    // 向浏览器发送下载任务
    browserDownload(blobUrl, fullFileName, downloadBarNo, thisIndex) {
        // 如果前后两次任务的时间间隔小于 time_interval，则延迟一定时间使间隔达到 time_interval。
        const t = new Date().getTime() - this.downloadTime;
        if (t < this.timeInterval) {
            setTimeout(() => {
                this.browserDownload(blobUrl, fullFileName, downloadBarNo, thisIndex);
            }, this.timeInterval - t);
            return;
        }
        // 如果任务已停止，不会向浏览器发送下载任务
        if (dlCtrl.downloadPause || dlCtrl.downloadStop) {
            // 释放 bloburl
            URL.revokeObjectURL(blobUrl);
            return;
        }
        this.downloadTime = new Date().getTime();
        const sendInfo = {
            msg: 'send_download',
            fileUrl: blobUrl,
            fileName: fullFileName,
            no: downloadBarNo,
            thisIndex: thisIndex,
            taskBatch: dl.taskBatch
        };
        chrome.runtime.sendMessage(sendInfo);
    }
    // 下载之后
    afterDownload(msg) {
        // 释放 bloburl
        URL.revokeObjectURL(msg.data.url);
        // 更改这个任务状态为“已完成”
        dl.downloadedList[msg.data.thisIndex] = 1;
        dl.downloaded++;
        // 显示进度信息
        ui.showDownloaded();
        this.showTotalProgress();
        const progress1 = document.querySelector('.progress1');
        progress1.style.width =
            (dl.downloaded / store.downloadList.length) * 100 + '%';
        // 如果所有文件都下载完毕
        if (dl.downloaded === store.downloadList.length) {
            dlCtrl.downloadStarted = false;
            dlCtrl.quickDownload = false;
            dlCtrl.downloadStop = false;
            dlCtrl.downloadPause = false;
            clearTimeout(dl.reTryTimer);
            ui.changeDownStatus(lang.transl('_下载完毕'));
            Log.add(lang.transl('_下载完毕'), 0, 2);
            titleBar.changeTitle('√');
        }
        else {
            // 如果没有全部下载完毕
            // 如果任务已停止
            if (dlCtrl.downloadPause || dlCtrl.downloadStop) {
                return;
            }
            // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数，继续添加任务
            if (dl.downloaded + setting.downloadThread - 1 <
                store.downloadList.length) {
                this.download(msg.data.no);
            }
        }
    }
    // 获取总下载进度
    showTotalProgress() {
        const progress = document.querySelector('.progressTip.progressTip1');
        let text = progress.innerText;
        // 追加转换文件的提示
        if (convert.convertTipText && convert.getCount > 0) {
            text += ', ' + convert.convertTipText;
        }
        Log.add(text, -1, 2, false);
    }
}
// 输出结果类，输出文件名和网址
class Output {
    // 设置输出区域的内容，并显示
    showOutputInfoWrap(text) {
        if (text) {
            document.querySelector('.outputInfoContent').innerHTML = text;
            document.querySelector('.outputInfoWrap').style.display = 'block';
        }
    }
    // 预览文件名
    previewFileName() {
        let result = '';
        result = store.downloadList.reduce((total, now) => {
            return (total +=
                now.url.replace(/.*\//, '') + ': ' + fileName.getFileName(now) + '<br>'); // 在每个文件名前面加上它的原本的名字，方便用来做重命名
        }, result);
        this.showOutputInfoWrap(result);
    }
    // 显示 url
    showUrls() {
        let result = '';
        result = store.downloadList.reduce((total, now) => {
            return (total += now.url + '<br>');
        }, result);
        this.showOutputInfoWrap(result);
    }
}
// 下载器
// 辅助功能，及一些下载过程中使用的数据
class Downloader {
    constructor() {
        this.taskBatch = 0; // 标记任务批次，每次重新下载时改变它的值，传递给后台使其知道这是一次新的下载
        this.downloadedList = []; // 标记已完成的完成的下载任务
        this.worksSelector = ''; // tag 搜索页，直接选择作品的选择器
        this.tagSearchMultipleSelector = '._3b8AXEx'; // 作品选择器
        this.tagSearchUgoiraSelector = '.AGgsUWZ'; // 动图作品的选择器
        this.baseUrl = ''; // 列表页url规则
        this.startpageNo = 1; // 列表页开始抓取时的页码
        this.listPageFinished = 0; // 记录一共抓取了多少列表页
        this.allowWork = true; // 当前是否允许展开工作（如果有未完成的任务则应为 false
        this.downloaded = 0; // 已下载的文件
        this.reTryTimer = 0; // 重试下载的定时器
        this.checkConflict();
        this.supportListenHistory();
        this.listenPageSwitch();
        this.checkNew();
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
        // 显示更新按钮
        const show = function () {
            const updateIco = document.querySelector('.centerWrap_top_btn.update');
            updateIco.style.display = 'inline-block';
        };
        // 读取上一次检查的时间，如果超过一小时则检查 GitHub 上的信息
        const lastTime = localStorage.getItem('xzUpdateTime');
        if (!lastTime ||
            new Date().getTime() - parseInt(lastTime) > 60 * 60 * 1000) {
            // 获取最新的 releases 信息
            const latest = await fetch('https://api.github.com/repos/xuejianxianzun/PixivBatchDownloader/releases/latest');
            const latestJson = await latest.json();
            const latestVer = latestJson.name;
            // 保存 GitHub 上的版本信息
            localStorage.setItem('xzGithubVer', latestVer);
            // 保存本次检查的时间戳
            localStorage.setItem('xzUpdateTime', new Date().getTime().toString());
        }
        // 获取本地扩展的版本号
        const manifest = await fetch(chrome.extension.getURL('manifest.json'));
        const manifestJson = await manifest.json();
        const manifestVer = manifestJson.version;
        // 比较大小
        const latestVer = localStorage.getItem('xzGithubVer');
        if (latestVer && manifestVer < latestVer) {
            show();
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
        let type = pageType.getPageType();
        if (type === 1 || type === 2) {
            // pushState 判断从列表页进入作品页的情况，popstate 判断从作品页退回列表页的情况
            ;
            ['pushState', 'popstate'].forEach(item => {
                window.addEventListener(item, () => {
                    // 当新旧页面的 pageType 不相同的时候
                    pageType.onPageTypeChange = () => {
                        // 重新初始化页面，初始化抓取流程
                        initPage.initPage(type);
                        crawler = initPage.initCrawl(type);
                        // 切换页面时，如果任务已经完成，则清空输出区域，避免日志一直堆积。
                        if (dl.allowWork) {
                            Log.clear();
                        }
                    };
                    // 获取页面信息
                    pageInfo.getPageInfo(type);
                });
            });
        }
    }
}
const lang = new Lang();
const pageType = new PageType();
const type = pageType.getPageType();
const setting = new Setting();
const initSetting = new InitAndSaveSetting();
const dl = new Downloader();
const ui = new UI();
initSetting.init();
const pageInfo = new PageInfoClass(type);
const convert = new ConvertUgoira();
const viewer = new ImgViewer();
const store = new Store();
const bookmark = new Bookmark();
const titleBar = new TitleBar();
const initPage = new InitPage();
initPage.initPage(type);
let crawler = initPage.initCrawl(type);
const dlCtrl = new DownloadControl();
const dlFile = new DownloadFile();
const fileName = new FileName();
const output = new Output();
