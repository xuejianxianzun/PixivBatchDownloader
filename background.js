// 设置 referer
browser.webRequest.onBeforeSendHeaders.addListener(function (details) {
	for (let i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name === 'Referer') {
			details.requestHeaders[i].value = 'https://www.pixiv.net';
			break;
		}
	}
	return {
		requestHeaders: details.requestHeaders
	};
}, {
	urls: ['*://*.pixiv.net/*']
}, ['blocking', 'requestHeaders']);

// 当点击扩展图标时，切换显示/隐藏下载面板
browser.browserAction.onClicked.addListener(function (tab) {
	browser.tabs.sendMessage(
		tab.id, {
			'msg': 'click_icon'
		}
	);
});

// 因为下载完成的顺序和发送顺序可能不一致，所以需要存储每个任务的数据
let donwloadBar_no_data = {};

// 接收下载请求
browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	// console.log(msg);
	if (msg.msg === 'send_download') {
		// 以 file_url 为 key，建立一个对象，保存任务数据

		let data = {
			no: msg.no,
			tabid: sender.tab.id
		};

		// 开始下载
		let blob = dataURLtoBlob(msg.file_url)
		let blobURL =  URL.createObjectURL(blob)
		browser.downloads.download({
			url: blobURL,
			filename: msg.file_name,
			conflictAction: 'overwrite',
			saveAs: false
		}).then(r => {
			donwloadBar_no_data[r] = data
			URL.revokeObjectURL(blobURL)
		}).catch(err => {
			browser.tabs.sendMessage(sender.tab.id, {msg: 'donwload_err', no: msg.no})
		});
	}
});

// 监听下载事件
browser.downloads.onChanged.addListener(function (detail) {
	// 下载完成后
	if (detail.state !== undefined && detail.state.current === 'complete') {
		// 根据 downloadid 查询下载信息
		let msg = 'downloaded';
		if (!donwloadBar_no_data[detail.id]) return
		let {tabid, no} = donwloadBar_no_data[detail.id];
		browser.tabs.sendMessage(tabid, {msg, no});
	}
});

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), type = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), len = bstr.length, u8arr = new Uint8Array(len);
    while (len--) {
        u8arr[len] = bstr.charCodeAt(len);
    }
    return new Blob([u8arr], {type});
}
