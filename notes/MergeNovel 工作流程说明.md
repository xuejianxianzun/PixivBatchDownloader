# MergeNovel 工作流程说明

日期：2026-07-10

本文档说明 `src/ts/download/MergeNovel.ts` 的主要执行流程，重点描述：

- `merge`
- `mergeTXT`
- `mergeEPUB`

目标是帮助阅读代码时，先从“按顺序会做什么”入手，而不是直接陷入实现细节。

---

## 1. 这个类负责什么

`MergeNovel` 的职责是：

1. 获取一个小说系列里的所有小说
2. 按当前设置过滤、整理这些小说
3. 根据保存格式生成合并后的 TXT 或 EPUB
4. 处理系列封面、章节封面、内嵌图片、设定资料图片
5. 在合并完成后写入下载记录

它是一个“系列小说合并工作流”类。

---

## 2. `merge` 的主流程

`merge(seriesId, seriesTitle?, slowMode = false)` 是整个类的入口。

它的执行顺序可以理解为下面这些阶段。

### 2.1 初始化阶段

1. 检查 `seriesId` 是否存在  
   如果没有，直接报错并返回 `0`。

2. 初始化当前任务的上下文  
   主要设置：
   - `this.seriesId`
   - `this.seriesTitle`
   - `this.slowMode`

3. 生成当前系列的链接字符串  
   后续日志会反复使用它。

### 2.2 前置检查阶段

1. 如果调用方传入了 `seriesTitle`，先用 `filter.check({ seriesTitle })` 检查是否允许合并这个系列  
   如果不通过，就直接跳过并返回 `0`。

2. 输出开始合并的提示日志

3. 如果当前保存格式是 `txt`，额外提示用户 EPUB 更适合合并小说阅读

4. 如果当前页面就是系列页，则关闭中间面板  
   这样系列页内手动触发合并时，界面更干净。

### 2.3 获取系列内小说 id 列表

1. 调用 `tryGetNovelIds`
2. 它内部会：
   - 输出“获取小说列表”的日志
   - 按顺序请求 `API.getNovelSeriesContent`
   - 对返回的每篇小说应用过滤器
   - 把通过过滤的小说 id 保存到 `this.novelIdList`
   - 如果一批数量达到上限，则继续递归请求下一批

3. 如果这一阶段请求失败，则记录错误并终止整个合并流程

4. 如果最终一个可合并的小说都没有，则跳过并返回 `0`

### 2.4 决定是否进入慢速抓取

如果系列中的小说数量大于 `settings.slowCrawlOnWorksNumber`，并且之前还没启用慢速模式：

1. 把 `this.slowMode` 设为 `true`
2. 输出“慢速抓取”日志

这会影响后续请求前是否增加等待时间。

### 2.5 获取每篇小说的详细数据

1. 调用 `getAllNovelData`
2. 这个阶段会遍历 `this.novelIdList`
3. 对每个 id：
   - 先尝试从 `cacheWorkData` 读取缓存
   - 如果没有缓存，就请求 `API.getNovelData`
   - 提取并整理标签
   - 对标签再次做过滤检查
   - 构造 `NovelSummary`
   - 保存到 `this.allNovelData`

4. 如果启用了 `quickMergeNovel`，会在拿到第一批需要的数据后提前停止

5. 最后按小说在系列中的顺序 `no` 升序排序

### 2.6 获取设定资料

满足以下条件时，才会获取设定资料：

- `settings.saveNovelMeta === true`
- `states.quickMergeNovel === false`

执行内容：

1. 调用 `getNovelGlossarys.getGlossarys`
2. 提取设定资料里的图片信息，保存到 `this.glossaryImages`
3. 把设定资料整理成文本，保存到 `this.seriesGlossaryText`

### 2.7 获取系列本身的详细信息

调用 `loadSeriesData`，获取并保存：

- 系列标题
- 作者名
- 系列简介
- 系列 tags
- 系列更新时间
- `seriesData`

然后根据这些数据生成最终文件名 `this.novelName`。

### 2.8 按格式进入分支

1. 如果 `settings.novelSaveAs === 'txt'`，执行 `mergeTXT`
2. 否则执行 `mergeEPUB`

### 2.9 合并后的收尾工作

无论 TXT 还是 EPUB，主合并流程结束后还会继续做这些事：

1. 如果启用了系列封面下载，则把系列封面单独保存为一个图片文件
2. 输出合并完成日志
3. 如果当前页面是系列页，显示成功提示
4. 为系列中的每篇小说写入下载记录
5. 延迟调用 `reset` 清理实例里的中间状态
6. 返回实际合并的小说数量

---

## 3. `mergeTXT` 的主流程

`mergeTXT()` 负责生成一个合并后的 TXT 文件。

它的大步骤如下。

### 3.1 下载 TXT 相关资源

先调用 `downloadTXTAssets()`。

它做两件事：

1. 遍历所有小说，下载正文里的内嵌图片  
   这些图片不能嵌入 TXT 文件本体，所以只能单独保存。

2. 遍历设定资料图片并下载  
   这些图片同样会作为单独文件保存。

### 3.2 生成系列级元数据文本

调用 `buildTXTSeriesMeta()`，按顺序生成：

1. 系列标题
2. 作者
3. 系列链接
4. 更新时间
5. 系列 tags
6. 系列简介
7. 设定资料文本
8. 元数据结束分隔线

如果未启用 `saveNovelMeta`，这一段为空。

### 3.3 生成每篇小说的章节文本

对 `this.allNovelData` 逐篇调用 `buildTXTNovelSection(data)`。

每篇小说会按以下顺序写入：

1. 章节编号 `第N章` / `Chapter N`
2. 小说标题
3. 小说自己的元数据
   - 小说 URL
   - 更新时间
   - tags
   - 简介
   - “下面是正文”分隔线
4. 正文内容
   - 把 `<br />` 转换成换行
   - 去掉 html 标签
5. 章节结尾的额外空行

### 3.4 保存 TXT 文件

1. 把所有文本段组合成一个 `Blob`
2. 调用 `SendDownload.noReply(blob, this.novelName, 'uniquify')`
3. 使用 `uniquify` 策略避免直接覆盖同名文件

---

## 4. `mergeEPUB` 的主流程

`mergeEPUB(body)` 负责生成一个或多个 EPUB 文件。

它的结构比 `mergeTXT` 更复杂，因为 EPUB 支持：

- 书籍元数据
- 内嵌图片
- 章节封面
- 分卷保存

### 4.1 生成 EPUB 公共元数据

一开始会准备：

1. 系列链接
2. 更新时间 `Date`
3. 描述文本 `description`

其中 `description` 来自 `buildEPUBDescription()`，包含：

1. 系列更新时间
2. 系列简介
3. 设定资料文本

这些内容会被放进 EPUB 的信息页。

### 4.2 进入 `generateEPUB` 分卷循环

`mergeEPUB` 内部定义了一个递归函数 `generateEPUB()`。

它的作用是：

1. 生成当前这一卷 EPUB
2. 从 `index` 指向的小说开始持续添加章节
3. 如果体积达到限制，就先保存这一卷
4. 然后递归生成下一卷

所以 `mergeEPUB` 支持把一个很大的系列拆成多个 EPUB 文件。

### 4.3 决定这一卷是否需要设定资料图片

调用 `checkNeedSaveGlossaryImages(index)`。

只有满足以下条件时才会把设定资料图片放进这一卷：

1. 当前是第一个分卷
2. 启用了 `saveNovelMeta`
3. 启用了 `downloadNovelEmbeddedImage`

原因是：设定资料图片属于整个系列，而不是某一篇小说，所以只需要放进第一个 EPUB。

### 4.4 替换 description 里的设定资料图片标记

如果这一卷需要设定资料图片：

1. 调用 `buildEPUBDescriptionWithImages`
2. 把设定资料文本里的图片标记替换成 EPUB 可用的 `<img>` 标签

注意：这里只是先改 description 里的占位内容，真正把图片二进制写进 EPUB 是下一步做的。

### 4.5 初始化 EPUB 对象

调用 `createEPUB(link, date, currentDescription)`。

这一步会：

1. 创建 `jEpub`
2. 写入：
   - i18n
   - title
   - author
   - publisher
   - tags
   - description
3. 设置 uuid 和日期

### 4.6 写入设定资料图片

调用 `addGlossaryImagesToEPUB`。

如果当前分卷需要设定资料图片，就会：

1. 下载每张设定资料图片
2. 把图片写入 EPUB 资源
3. 累计图片体积

### 4.7 写入系列封面

调用 `addSeriesCoverToEPUB`。

如果启用了系列封面下载，就会：

1. 等待下载间隔
2. 下载系列封面
3. 把封面设置为当前 EPUB 的封面
4. 累计其体积

### 4.8 逐篇添加小说章节

接下来遍历 `this.allNovelData`，从当前 `index` 开始逐篇处理。

每篇小说的处理顺序如下。

#### 4.8.1 生成章节封面 HTML

调用 `buildEpisodeCoverHtml(data, episodeCovers, jepub)`：

1. 如果未启用章节封面，返回空字符串
2. 如果该封面 URL 之前已经写入过，直接复用
3. 否则下载封面
4. 如果 URL 不同但图片字节数相同，也视为同一张图并复用
5. 如果确实是新图：
   - 写入 EPUB
   - 累计体积
   - 返回对应的 `<img>` HTML

这里的重点是：**避免同一个系列里多个章节重复保存相同封面图**。

#### 4.8.2 生成章节元数据 HTML

调用 `buildEpisodeMetaHtml(data)`，生成：

1. 小说 URL
2. 更新时间
3. tags
4. 简介
5. “下面是正文”分隔线

#### 4.8.3 生成章节正文 HTML

调用 `buildEPUBChapterContent(data, coverHtml, metaHtml)`：

1. 对正文应用置换单词
2. 把正文转换成适合 EPUB 的 `<p>` 结构
3. 把章节封面、章节元数据、正文拼接起来

#### 4.8.4 处理正文中的内嵌图片

调用 `downloadNovelEmbeddedImage.EPUB(...)`：

1. 下载章节正文里引用的图片
2. 把图片写入 EPUB
3. 把正文里的标记替换成对应图片标签
4. 返回更新后的正文和新增资源体积

#### 4.8.5 把章节写入 EPUB

1. 生成章节标题
2. 使用 `jepub.add(...)` 添加章节

### 4.9 检查是否需要分卷

每添加完一篇小说后，会：

1. 累计正文和图片体积
2. 调用 `checkSizeLimit()`

如果超出 `settings.singleEPUBFileSizeLimit`：

1. 先保存当前 EPUB
2. 把 `index` 移动到下一篇小说
3. 递归调用 `generateEPUB()` 生成下一卷

如果当前已经是最后一篇小说：

1. 直接保存最终 EPUB
2. 结束整个 `mergeEPUB`

---

## 5. 主流程中的几个关键状态

下面这些状态在阅读流程时最值得关注。

### 5.1 `this.novelIdList`

保存通过第一轮过滤后的小说 id 列表。  
来源：`getNovelIds()`

### 5.2 `this.allNovelData`

保存每篇小说提炼后的摘要数据。  
来源：`getAllNovelData()`

后续 TXT / EPUB 合并主要都基于它。

### 5.3 `this.glossaryImages`

保存设定资料里的图片信息。  
来源：`loadGlossaryData()`

### 5.4 `this.seriesGlossaryText`

保存整理后的设定资料文本。  
来源：`loadGlossaryData()`

### 5.5 `this.seriesData`

保存系列本身的详细信息。  
来源：`loadSeriesData()`

### 5.6 `this.sizeLog`

仅用于 EPUB 分卷。  
用来记录当前分卷和历史分卷的累计体积。

---

## 6. 阅读这个文件时的建议顺序

如果以后要重新理解 `MergeNovel.ts`，建议按下面顺序读：

1. `merge`
2. `getNovelIds`
3. `getAllNovelData`
4. `mergeTXT`
5. `mergeEPUB`
6. `buildEPUBDescription`
7. `buildEpisodeCoverHtml`
8. `buildEPUBChapterContent`
9. `saveEPUBFile`

这样会比从上往下逐行看更容易把握整体结构。

---

## 7. 一句话总结

`merge` 负责**总调度**，`mergeTXT` 负责**拼接纯文本并下载附属图片**，`mergeEPUB` 负责**构建带元数据、图片、封面、分卷能力的电子书文件**。
