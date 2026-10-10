# 如何获得 Pixiv 的 i18n 翻译

在网络请求里搜索包含“/locale.”的请求，即可找到 Pixiv 当前语言的 i18n 文件，网址格式如下：

https://s.pximg.net/soy/pixiv-web-next/_next/static/chunks/locale.zh-cn.b5380c932e7d0e0a.js

里面包含了 i18n 的 key（英语）和当前语言的翻译。

如果要查看其他语言里的翻译，不能直接把网址中的“zh-cn”替换为对应的语言代码，因为每种语言后面的 hash 字符串如 b5380c932e7d0e0a 是不同的，直接替换语言代码后的网址会是 404。

需要先手动切换 Pixiv 的页面语言，然后在网络请求里找到对应语言的 i18n 文件。
