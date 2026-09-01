# 解决移动版 Firefox 的兼容性问题

日期：2026-09-01

今天我使用 USB 调试把本扩展安装到了手机上的 Firefox 浏览器里，来解决无法保存文件的问题。相关 issue：
https://github.com/xuejianxianzun/PixivBatchDownloader/issues/526

在研究中不断发现新的问题，总结如下：

# 问题列表

## 1. downloads API 在 Firefox Android 上不可用

Firefox Android（79 及以后版本）不支持 `browser.downloads` 命名空间，调用里面的方法会抛出 `Error: Not implemented`。桌面版 Firefox 不受影响。

| 方法 | 现象 | 处理方式 |
| ---- | ---- | -------- |
| `downloads.search()` | 后台脚本启动时报错 `检查下载记录数量时出错 Error: Not implemented` | 在 catch 里识别该错误后跳过"下载记录数量检查"，并保存检查时间戳，避免每次后台启动都重复报错。`src/ts/serviceWorker/CheckDownloadCount.ts` |
| `downloads.download()` | 文件在前台加载完成，但无法保存到本地，下载任务一直卡住 | 在 Firefox Android 上强制改用 a 标签下载（`<a download>`，该属性在 Firefox Android 上受支持），不经过后台的 downloads API |
| `downloads.onChanged` | 无法监听下载完成事件，无法把保存结果告知前台 | 后台在 Firefox Android 上不注册该监听器。`src/ts/serviceWorker/background.ts` |

## 2. Firefox Android 上下载的降级方案：使用 a 标签下载

- `<a download>` 属性在 Firefox Android 上受支持（MDN 兼容性表：Firefox for Android 20+），点击后文件会保存到手机的下载目录，文件名使用 `download` 属性指定的值。
- 在 `Config.ts` 里新增了统一判断条件 `Config.downloadsAPIDisabled`（`isFirefox && mobile`），所有需要区分此情况的地方都使用它。
- 主下载流程（`Download.ts` 的 `sendDownload`）：Firefox Android 上强制走 a 标签下载路径，向后台发送 `save_work_file_a_download` 消息，后台收到后返回模拟的"下载成功"消息，前台正常结束任务、继续下载下一个文件。
- 附带文件（小说封面、内嵌图、术语图、合并系列文件、作品简介、作品元数据等）：`Tools.chooseDownloadMethod` 在 Firefox Android 上强制返回 `anchorDownload`，一处修改覆盖所有调用点。
- `DownloadInterval` 在 Firefox Android 上强制添加 200 ms 的下载间隔，避免短时间内触发大量 a 标签下载导致部分文件丢失。
- a 标签下载的局限：不能创建子文件夹保存文件，文件名里的路径部分会被去掉，只保留文件名。

## 3. a 标签批量下载在 Firefox Android 上无法保证文件全部保存

实测：下载 48 个文件，Firefox 只弹出了 12 个保存确认对话框，其余下载请求被静默丢弃；下载进度显示 48/48 全部完成，但实际只有确认过的 12 个文件保存到了手机。用户提出的三个判断均得到验证：

1. **每个文件都会弹出保存确认对话框，且无法关闭**。Firefox Android（Fenix 重写，v79 起）内建下载确认框，每次下载都会弹出，并且没有桌面版那种"不询问保存位置"的设置（Mozilla 官方支持论坛回复："This is currently not possible in Firefox for Android"）。blob URL 下载同样弹框，没有可绕过的 MIME 类型。
2. **对话框可见期间会阻塞其他下载启动**。这是已报告的 bug（Bugzilla 2039264，Firefox for Android :: Downloads）：下载对话框可见期间，两次下载间隔小于 10 秒时，后续文件的弹窗根本不显示；切换标签页再回来，弹窗闪现一下但无法交互、自动关闭。
3. **未确认的文件被静默丢弃，且没有任何报错**。被阻塞的下载请求没有进入下载流程就被丢弃；a 标签下载本身没有成功/失败回调，前台会伪造"下载成功"消息，所以出现"显示全部下载完成、实际部分丢失"的误导。

结论：**Firefox Android 上使用 a 标签批量下载不可能可靠保证全部文件保存**。当前 200 ms 的下载间隔远小于 Bugzilla 报告中阻塞弹窗的 10 秒阈值，无法保证每个对话框都被用户看到并确认。即使把下载间隔拉到 10 秒以上，也意味着每个文件都要手动点一次"保存"（48 个文件约需 8 分钟 + 48 次点击），体验不可接受。

可选的出路：

- 手机上改用 Quetta 浏览器（Chromium 内核，支持从 Chrome Web Store 安装扩展）。`Config.downloadsAPIDisabled` 只在 Firefox 上为 true，Quetta 会自动走正常的 downloads API 路径，无确认框、批量下载可靠。而且我已经在 Quetta 上测试过，它有 downloads API，并且没有保存文件的没有弹窗，下载完全正常。
- 在 Firefox Android 上把整批文件打包为一个 zip 文件下载，只弹一次确认框即可获得全部文件。缺点是改变产品行为、大文件内存压力大。
- 在 Firefox Android 上运行时提示用户"每个文件需手动确认、建议使用 Quetta"，避免"显示成功但实际丢文件"的误导。
