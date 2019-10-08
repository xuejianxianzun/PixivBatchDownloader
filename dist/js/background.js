"use strict";
// 设置 referer
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    let setReferer = false;
    for (let i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Referer') {
            setReferer = true;
            details.requestHeaders[i].value = 'https://www.pixiv.net';
            break;
        }
    }
    if (!setReferer) {
        details.requestHeaders.push({
            name: 'Referer',
            value: 'https://www.pixiv.net'
        });
    }
    return {
        requestHeaders: details.requestHeaders
    };
}, {
    urls: ['*://*.pixiv.net/*', '*://*.pximg.net/*']
}, ['blocking', 'requestHeaders']);
// 当点击扩展图标时，切换显示/隐藏下载面板
chrome.browserAction.onClicked.addListener(function (tab) {
    // 打开下载面板
    chrome.tabs.sendMessage(tab.id, {
        msg: 'click_icon'
    });
});
// 因为下载完成的顺序和发送顺序可能不一致，所以需要存储任务的数据
let dlData = {};
// 储存下载任务的索引，用来判断重复的任务
let dlIndex = [];
// 储存下载任务的批次编号，用来判断不同批次的下载
let dlBatch = [];
// 接收下载请求
chrome.runtime.onMessage.addListener(function (msg, sender) {
    // 接收下载任务
    if (msg.msg === 'send_download') {
        const tabId = sender.tab.id;
        // 如果开始了新一批的下载，重设批次编号，清空下载索引
        if (dlBatch[tabId] !== msg.taskBatch) {
            dlBatch[tabId] = msg.taskBatch;
            dlIndex[tabId] = [];
        }
        // 检查任务是否重复，不重复则下载
        if (dlIndex[tabId][msg.thisIndex] !== 1) {
            // 储存该任务的索引
            dlIndex[tabId][msg.thisIndex] = 1;
            // 开始下载
            chrome.downloads.download({
                url: msg.fileUrl,
                filename: msg.fileName,
                conflictAction: 'overwrite',
                saveAs: false
            }, id => {
                // id 是 Chrome 新建立的下载任务的 id
                dlData[id] = {
                    no: msg.no,
                    url: msg.fileUrl,
                    thisIndex: msg.thisIndex,
                    tabId: tabId
                };
            });
        }
    }
});
// 监听下载事件
chrome.downloads.onChanged.addListener(function (detail) {
    // 根据 detail.id 取出保存的信息
    const data = dlData[detail.id];
    if (data && detail.state && detail.state.current === 'complete') {
        // 下载完成后返回信息
        const msg = 'downloaded';
        chrome.tabs.sendMessage(data.tabId, { msg, data });
        // 清除这个任务的信息
        dlData[detail.id] = null;
    }
});
