# 在 Yandex 浏览器（安卓）上调试扩展程序

我们可以输入网址打开[扩展管理页面](browser://extensions)，加载扩展程序。

这会打开文件浏览器，我们需要找到并选择扩展程序的 manifest.json 文件，把扩展程序加载到 Yandex 浏览器中。

官方文档：https://yandex.com/support/browser-mobile-android-phone/personal-settings/extensions.html#developers2

# Manifest version 3 支持

2022/06/27

Yandex 浏览器 22.7.0 仍然不支持 Manifest version 3 的扩展程序。加载 V3 的扩展程序会出现错误：

![](./Screenshot_2022-06-27-10-28-34-210_com.yandex.bro.jpg)