// 设置 referer
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
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
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.sendMessage(
		tab.id, {
			'msg': 'click_icon'
		},
		function (response) {}
	);
});

// 因为下载完成的顺序和发送顺序可能不一致，所以需要存储每个任务的数据
let donwloadBar_no_data = {};

// 接收下载请求
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	// console.log(msg);
	if (msg.msg === 'send_download') {
		// 以 file_url 为 key，建立一个对象，保存任务数据
		donwloadBar_no_data[msg.file_url] = {};
		donwloadBar_no_data[msg.file_url]['no'] = msg.no;
		donwloadBar_no_data[msg.file_url]['tabid'] = sender.tab.id;
		// 开始下载
		chrome.downloads.download({
			url: msg.file_url,
			filename: msg.file_name,
			conflictAction: 'overwrite',
			saveAs: false
		});
	}
});

// 监听下载事件
chrome.downloads.onChanged.addListener(function (detail) {
	// console.log('detail', detail);
	// 下载完成后
	if (detail.state !== undefined && detail.state.current === 'complete') {
		// 根据 downloadid 查询下载信息
		chrome.downloads.search({
			id: detail.id
		}, function (result) {
			// console.log(result);
			let file_url = result[0].url; // 取出这个任务的的 file_url
			// 返回消息
			chrome.tabs.sendMessage(
				donwloadBar_no_data[file_url]['tabid'], {
					'msg': 'downloaded',
					'file_url': file_url,
					'no': donwloadBar_no_data[file_url]['no']
				},
				function (response) {}
			);
		});
	}
});