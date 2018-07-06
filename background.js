// 设置 referer
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
	for (var i = 0; i < details.requestHeaders.length; ++i) {
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