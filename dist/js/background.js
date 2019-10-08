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
let donwloadListData = {};
// 判断重复任务的数组
let isExist = [];
// 判断是否重复任务数组的重置标记，0 或 1
let isExistMark = [];
// 接收下载请求
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // 如果之前不是暂停状态，则需要重新下载，重置判断重复任务的数组
    if (msg.msg === 'send_download' && isExistMark[sender.tab.id] !== msg.isExistMark) {
        isExist[sender.tab.id] = [];
        isExistMark[sender.tab.id] = msg.isExistMark;
    }
    // 是否是重复任务
    if (msg.msg === 'send_download' && isExist[sender.tab.id][msg.thisIndex] !== 1) {
        // 收到任务立即标记
        isExist[sender.tab.id][msg.thisIndex] = 1;
        // 开始下载
        chrome.downloads.download({
            url: msg.fileUrl,
            filename: msg.fileName,
            conflictAction: 'overwrite',
            saveAs: false
        }, id => {
            // 成功建立下载任务时，返回下载项的 id
            donwloadListData[id] = {
                no: msg.no,
                url: msg.fileUrl,
                thisIndex: msg.thisIndex,
                tabid: sender.tab.id
            };
        });
    }
});
// 监听下载事件
chrome.downloads.onChanged.addListener(function (detail) {
    // 根据 detail.id 取出保存的信息
    const data = donwloadListData[detail.id];
    // 首先判断是否是本批次的下载任务
    if (!data) {
        return;
    } else if (detail.state !== undefined && detail.state.current === 'complete') {
        // 下载完成后
        // 返回信息
        const msg = 'downloaded';
        chrome.tabs.sendMessage(data.tabid, { msg, data });
    }
});
