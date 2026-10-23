# 下载器里的层级（z-index）一览

按层级数字从高到低排列，方便排查「谁盖住了谁」。

- 统计范围：`src/` 下所有 `.less` / `.css` 里的 `z-index`，以及 `.ts` 里通过 `style.zIndex` 设置的值。
- 「模块」一列是创建或使用这个元素的模块（ts 文件）；只有样式没有对应模块时会注明。
- Pixiv 自身元素的层级来自代码注释（没有写在样式里），也一并列入，用 ⚠️ 标出。

## 总表

| 层级 | 元素 | 模块 | 样式 / 代码位置 | 备注 |
| --- | --- | --- | --- | --- |
| 2147483647 | `#xzLoadingWrap`（加载提示的遮罩） | `src/ts/Loading.ts` | `src/style/Loading.less:3` | 用最大值，保证在最上层 |
| 2147483647 | `#xzMaskWrap`（白色遮罩层） | `src/ts/Mask.ts` | `src/style/style.less:334` | |
| 2147483647 | `.xzToast`（轻提示） | `src/ts/Toast.ts` | `src/style/style.less:343` | `pointer-events: none`，不挡点击 |
| 100001 | `#originSizeWrap`（查看原图的区域） | `src/ts/ShowOriginSizeImage.ts` | `src/style/style.less:455` | 比收藏面板（3001）高，所以看大图时会挡住面板，面板此时会临时隐藏 |
| 100001 | `.xz_PreviewWorkDetailPanel`（预览作品的详细信息面板） | `src/ts/PreviewWorkDetailInfo.ts` | `src/style/previewWorkDetailPanel.less:5` | |
| 100000 | `#previewWorkWrap`（预览作品的容器） | `src/ts/PreviewWork.ts` | `src/style/style.less:368` | |
| 99999 | `.XZInputWrap`（通用输入弹窗） | `src/ts/Input.ts` | `src/style/input.less:3` | 见下方备注 3 |
| 19999 | `.xzTipPanelWrap`（用户浮动面板，特定页面） | `src/ts/setting/QuicklyBlockUsers.ts` | `src/style/userFloatingPanel.less:23` | 为了盖住旧版页面的用户简介小卡片（10001） |
| ⚠️ 10001 | Pixiv 用户简介小卡片（旧版页面） | Pixiv 页面自身 | `src/style/userFloatingPanel.less:19` 的注释 | 浮动面板因此提高到 19999 |
| 9999 | `.xz_msg_box`（消息框） | `src/ts/MsgBox.ts` | `src/style/msgBox.less:5` | 收藏面板的层级必须低于它，见 `bookmarkPanel.less` 的注释 |
| 9999 | `.outputWrap`（输出面板） | `src/ts/output/OutputPanel.ts` | `src/style/outputWrap.less:9` | |
| 9999 | `.outputClose`（输出面板的关闭按钮） | `src/ts/output/OutputPanel.ts` | `src/style/outputWrap.less:54` | |
| 5001 | `#tip`（鼠标悬停时的提示条） | `src/ts/setting/ShowTip.ts` | `src/style/style.less:315` | |
| 5000 | `.centerWrap`（设置面板） | `src/ts/setting/SettingsPanel*.ts` | `src/style/settingsPanel.less:154` | |
| 3001 | `.xzBookmarkPanel`（收藏面板） | `src/ts/BookmarkPanel.ts` | `src/style/bookmarkPanel.less:17` | 不能 ≥ 9999（msgBox）；要 > 2015（图片查看器） |
| 3000 | `.xzBookmarkPanelMask`（收藏面板的遮罩层） | `src/ts/BookmarkPanel.ts` | `src/style/bookmarkPanel.less:9` | |
| 2015 | 图片查看器的容器 | `src/ts/ImageViewer.ts`（viewerjs） | `src/static/lib/viewer.min.js:67` `zIndex: 2015` | ⚠️ 写死在库里，不在样式或 ts 代码里；另一个 `zIndexInline: 0` 是内联查看器 |
| 1002 | `.namingRuleList`（设置面板里的命名规则列表） | `src/ts/setting/SaveNamingRule.ts` | `src/style/settingsPanel.less:1369` | |
| 1001 | `#rightButtonContainer`（比赛页面里的右侧按钮） | `src/ts/RightButtonManager.ts` | `src/style/log.less:92` | 比赛页面顶部有固定横幅，需要提高 |
| 1001 | `.ppdMarqueeRect`（框选的矩形） | `src/ts/WorkSelectionMarquee.ts` | `src/style/marquee.less:15` | |
| 1000 | `.logWrap`（比赛页面里的日志区域） | `src/ts/Log.ts` | `src/style/log.less:88` | 同上，只在比赛页面提高 |
| 1000 | `#rightButtonContainer`（右侧按钮） | `src/ts/RightButtonManager.ts` | `src/style/rightButtons.less:8` | |
| 1000 | `#thumbnailListSelectorEl`（多图作品页面的缩略图列表） | `src/ts/pageFunciton/DisplayThumbnailListOnMultiImageWorkPage.ts` | `...less:147` | |
| 1000 | `.thumbnailSelectedFlag`（已选缩略图的标记） | 同上 | `...less:90` | |
| 1000 | `#excludeWorkEl`（排除作品的横条） | `src/ts/ExcludeWork.ts` | `src/style/excludeWork.less:25` | |
| 1000 | `.excludedWorkFlag`（已排除作品的标记） | `src/ts/ExcludeWork.ts` | `src/style/excludeWork.less:78` | |
| 1000 | `#selectWorkEl`（选择作品的横条） | `src/ts/SelectWork.ts` | `src/style/selectWork.less:25` | |
| 1000 | `.selectedWorkFlag`（已选作品的标记） | `src/ts/SelectWork.ts` | `src/style/selectWork.less:78` | |
| 999 | `.xzTipPanelWrap`（用户浮动面板，默认） | `src/ts/setting/QuicklyBlockUsers.ts` | `src/style/userFloatingPanel.less:15` | |
| 19 | `.btnOnThumb`（作品缩略图上的按钮） | `src/ts/buttonsOnThumb/*` | `src/style/style.less:480` | 为了盖住 Pixiv 的用户信息小卡片（12），见下方备注 1 |
| 18 | `#zoomBtnOnThumb`（缩略图上的“查看原图”按钮） | `src/ts/buttonsOnThumb/*` | `src/style/style.less:504` | 比其它缩略图按钮低一级 |
| ⚠️ 12 | Pixiv 用户信息小卡片（含 3 个作品缩略图） | Pixiv 页面自身 | `src/style/style.less:477` 的注释 | 缩略图上的按钮因此用 19 |
| 9 | `.id_range_tip`（id 范围提示） | `src/ts/crawlMixedPage/InitHomePage.ts` | `src/style/style.less:542` | |
| 4 | `.settingsPanel_stickyHeader`（设置面板的粘性头部） | `src/ts/setting/SettingsPanel*.ts` | `src/style/settingsPanel.less:1694` | |
| 2 | 约稿页面（移动端）里作品链接 `a` 标签 | `src/ts/ArtworkThumbnail.ts:308` | 代码里设置 `el.style.zIndex = '2'` | 仅移动端约稿页面 |
| 1 | `.hasRippleAnimation::before`（按钮的水波动画层） | 通用样式 | `src/style/style.less:604` | `pointer-events: none` |
| 1 | `.beautify_checkbox`（设置面板的美化复选框） | 设置面板（`OptionsHtml.html` 里的静态结构） | `src/style/settingsPanel.less:861` | |
| 1 | `.topbar`（搜索结果预览卡片的顶栏） | `src/ts/crawlArtworkPage/SearchResultPreview.ts` | `src/style/search.less:192` | |
| 1 | 缩略图本身（PC 端，为显示边框而加的定位） | `src/ts/WorkThumbnail.ts:347` | 代码里生成的样式 | 只为创建层叠上下文 |
| 1 | 已下载作品的边框容器 | `src/ts/ShowBorderOnDownloadedWorks.ts:208` | 代码里生成的样式 | 书签页面里降为 0（见下一行） |
| 1 | `.viewer-loading:after`（图片查看器的加载动画） | viewerjs 库内部 | `src/static/style/viewer.min.css:370` | |
| 0 | `.logArea` / `.logWrap`（日志区域） | `src/ts/Log.ts` | `src/style/log.less:8`、`:24` | 比赛页面里提高到 1000 |
| 0 | `.searchImgAreaContent`（搜索结果预览卡片的图片区域） | `src/ts/crawlArtworkPage/SearchResultPreview.ts` | `src/style/search.less:180` | |
| 0 | 缩略图的 `::after`（边框伪元素） | `src/ts/WorkThumbnail.ts:361` | 代码里生成的样式 | 注释：层级需要大于 -1，否则容易被图片遮挡 |
| 0 | 已下载作品的边框伪元素 | `src/ts/ShowBorderOnDownloadedWorks.ts:223` | 代码里生成的样式 | 同上 |
| 0 | 书签页面（`body[data-page-type='4']`）里的边框容器 | `src/ts/ShowBorderOnDownloadedWorks.ts:212` | 代码里生成的样式 | 否则会挡住缩略图左下角的铅笔（编辑）图标 |
| 0 | 缩略图容器（移动端，添加下载按钮时） | `src/ts/buttonsOnThumb/DownloadBtnOnThumbOnMobile.ts:136` | 代码里设置 | 见下方备注 2 |
| -1 | `.xzBGLayer`（背景图层） | `src/ts/BG.ts` | `src/style/style.less:510` | |
| -1 | `.xzBG .xzbgMask`（文字区域上的半透明遮罩） | `src/ts/BG.ts` | `src/style/style.less:527` | |
| -1 | 已选/已排除/已选缩略图标记的 `::after` | `src/ts/SelectWork.ts`、`ExcludeWork.ts`、`DisplayThumbnailListOnMultiImageWorkPage.ts` | `selectWork.less:106`、`excludeWork.less:106`、`DisplayThumbnailListOnMultiImageWorkPage.less:121` | |
| -999 | `iframe[name='expandedFooter']`（Pixiv 页脚广告） | 无（纯样式屏蔽） | `src/style/blockAds.less:25` | 用负层级把它压到不可见 |

## 备注

1. **缩略图上的按钮为什么是 19**（`src/style/style.less:475` 的注释）：
   鼠标放在用户名上时 Pixiv 会显示用户信息小卡片（含 3 个作品缩略图），它的 `z-index` 是 **12**，
   所以按钮要更高；但也不宜太大，否则会意外盖住某些元素，于是取 19。
2. **移动端缩略图的定位**（`src/ts/buttonsOnThumb/DownloadBtnOnThumbOnMobile.ts:115` 的注释）：
   只在缩略图原本是 `static` 时才给它加 `position: relative` + `z-index: 0`。
   ⚠️ 不能用 `z-index: 1`：那会盖住 Pixiv 自己的收藏按钮（它是缩略图**外面**的兄弟元素，自身 `z-index` 为 `auto`）。
   用 `0` 既能创建层叠上下文、把按钮限制在缩略图内部，又不会遮挡收藏按钮。
3. **图片查看器的 2015 来自库本身**：`src/static/lib/viewer.min.js` 里 `zIndex: 2015`（容器）、`zIndexInline: 0`（内联查看器）。
   收藏面板的层级（3001）就是按「要大于 2015、小于 msgBox 9999」定的。
4. 需要修改层级时，建议同时检查这几条依赖关系：
   `msgBox 9999` > `设置面板 5000` > `收藏面板 3001` > `图片查看器 2015` > `缩略图上的按钮 19` > `缩略图 1/0`。
