# 使用 USB 调试在手机版 Firefox 里调试扩展

在 PC 上通过 USB 连接 Android 手机，用 `web-ext` 把扩展推送到手机上的 Firefox，再用桌面 Firefox 的 DevTools 远程调试该扩展。适用于开发测试 Firefox 版扩展在安卓端的表现。

整体流程：安装 adb → 手机端开启调试 → web-ext 推送扩展 → 桌面 about:debugging 远程调试。

## 一、安装 Android SDK Platform Tools（adb）

adb 是电脑与手机通信的基础工具，web-ext 和桌面 Firefox 的远程调试都依赖它。

1. **下载**：
官方直链：`https://dl.google.com/android/repository/platform-tools-latest-windows.zip`
2. **解压**到无中文、无空格的路径，例如 `C:\platform-tools`。解压后应有 `adb.exe`、`fastboot.exe`、`AdbWinApi.dll` 等文件。
3. **配置环境变量**（推荐，任意终端可用）：右键「此电脑」→ 属性 → 高级系统设置 → 环境变量 → 系统变量 `Path` → 新建 → 粘贴解压路径 → 确定。**配置后必须关闭并重新打开终端**才生效。
4. **验证**：新终端运行 `adb version`，出现版本号即成功；提示"不是内部或外部命令"说明环境变量没配好或没重开终端。

## 二、手机端准备

1. **开启开发者选项**：设置 → 关于手机 → 连续点击"版本号" 7 次，提示已进入开发者模式。
2. **开启 USB 调试**：设置 → 开发者选项 → 打开"USB 调试"。
3. **Firefox 开启远程 USB 调试**：手机 Firefox → 设置 → 滑到最底部 → 打开"通过 USB 远程调试"（Remote debugging via USB）。
4. **连接授权**：数据线（必须支持数据传输，不能是纯充电线）连接电脑和手机。手机屏幕会弹出"允许 USB 调试"弹窗，勾选"一律允许"并点允许。此时终端运行 `adb devices`，设备状态应从 `unauthorized` 变为 `device`。
   - 若弹窗已消失：拔插 USB 线重试，或运行 `adb kill-server && adb devices` 让设备重新连接。

## 三、安装 web-ext 并推送扩展

```bash
npm install -g web-ext
```

1. **确认设备**：`adb devices` 显示设备状态为 `device`。
2. **确定扩展目录**：`--source-dir` 指向包含 `manifest.json` 的目录（本项目是编译产物 `dist/`）。web-ext 会把该目录自动打包并推送到手机，**不需要手动指定 zip/xpi 文件**。
3. **运行推送命令**：

```bash
web-ext run -t firefox-android --adb-device <序列号> --firefox-apk org.mozilla.firefox --source-dir <扩展目录>
```

实际示例：

```bash
cd C:\document\github\PixivBatchDownloader
web-ext run -t firefox-android --adb-device aea70c79 --firefox-apk org.mozilla.firefox --source-dir dist
```

常用参数说明：

| 参数 | 说明 |
| --- | --- |
| `-t firefox-android` | 目标平台为安卓 Firefox |
| `--adb-device <序列号>` | 设备序列号（`adb devices` 第一列） |
| `--firefox-apk` | 手机上的 Firefox 包名：正式版 `org.mozilla.firefox`、Beta `org.mozilla.firefox.beta`、Nightly `org.mozilla.fenix` |
| `--source-dir` | 含 manifest.json 的扩展目录，默认是当前目录 |
| `--adb-bin` | adb 不在 PATH 时显式指定，如 `C:\platform-tools\adb.exe` |

**注意**：web-ext 推送的扩展是"临时加载"的——关闭 web-ext 进程或断开 USB 后，手机上的扩展会被卸载。需要持久安装时，改用 Firefox 调试菜单的"从文件安装附加组件"直接安装 xpi。

**重载扩展（关键步骤，最容易漏）**：web-ext 推送完成后，手机上的扩展文件虽然已更新，但**正在运行的扩展仍是旧代码**。必须在桌面 Firefox 的 `about:debugging` → 设备页 → Extensions 区找到该扩展，点击 **"重载"（Reload）** 按钮，扩展才会真正加载新代码。**只刷新手机上的网页不会让扩展重载**——刷新页面只是重新执行扩展当前已加载的旧代码。遇到"改了代码、重新推送后行为没有任何变化"的情况，优先检查这一步。

重载扩展时，**必须同时执行这两个操作**：先在 PC 版 Firefox 里重载扩展，然后刷新手机上的网页。缺少任意一个步骤都会导致问题。

## 四、在 PC 的 Firefox 上远程调试

1. 手机 Firefox 保持开启"通过 USB 远程调试"（第二步已配置）。
2. 桌面 Firefox 地址栏输入 `about:debugging` 回车。
3. 进入 **Setup（设置）** 页面 → 点击 **"启用 USB 设备"（Enable USB devices）**。
4. 左侧栏出现设备（设备型号名）；若没出现，点 **"刷新设备"（Refresh devices）**，或拔插 USB 线。
5. 点击设备名进入设备信息页，页面包含 **Extensions（扩展）**、**Tabs（标签页）** 等区域：
   - 调试扩展：在 Extensions 区找到扩展 → 点右侧 **"检查"（Inspect）** → 桌面新开 DevTools 标签页，可看扩展的 console、后台脚本等。**每次 web-ext 推送新代码后，必须先点这里的"重载"（Reload）按钮，扩展才会加载新代码；否则前后台运行的都还是旧代码。**
   - 调试网页：先在手机 Firefox 打开目标页面（如 pixiv.net），再在桌面 Tabs 区找到它 → Inspect。
6. DevTools 用法与调试桌面网页一致：断点、console、改样式、看网络请求。

## 五、常见问题排查

| 现象 | 处理 |
| --- | --- |
| `adb devices` 显示 `unauthorized` | 手机弹窗未确认：重新拔插 USB，留意弹窗点允许；或在开发者选项里"撤销 USB 调试授权"后重连 |
| 设备不出现在 about:debugging | 先确认 `adb devices` 状态为 `device`；换 USB 口/数据线；`adb kill-server && adb start-server` 后点"刷新设备"；Windows 上可能需要手机厂商的 USB 驱动 |
| 切换 USB 模式（如仅充电→传输文件）导致 web-ext 断开 | 正常反应（USB 重新枚举导致连接中断）。web-ext 进程还活着就等它自动重连；已退出就原命令重跑。建议先插好线、设好 USB 模式，再启动 web-ext |
| 连接后提示版本不兼容 | 桌面 Firefox 版本不能比手机版老太多（超过一个大版本会协议不兼容），升级桌面 Firefox |
| 扩展在手机上"消失" | 临时加载的扩展在 web-ext 退出或断开 USB 后被卸载，属正常；需持久测试请用"从文件安装附加组件"装正式 xpi |
| 改了代码、重新推送后行为没有任何变化 | 扩展没有重载：web-ext 推送只更新文件，必须在 about:debugging 的设备页里点扩展的"重载"按钮；或完全关闭手机 Firefox 再重开（强制后台脚本重启） |

## 参考

- MDN：about:debugging（https://developer.mozilla.org/docs/Tools/about:debugging）
- Android SDK Platform Tools 官方页（https://developer.android.google.cn/studio/releases/platform-tools）
- web-ext 文档（https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/）
