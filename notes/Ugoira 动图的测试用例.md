# Ugoira 动图的测试用例

比较大的动图：
- 46 MB：[137960387](https://www.pixiv.net/artworks/137960387)
- 45 MB：[144280088](https://www.pixiv.net/artworks/144280088)
- 42 MB：[144620950](https://www.pixiv.net/artworks/144620950)
- 39 MB：[144281961](https://www.pixiv.net/artworks/144281961)
- 36 MB：[144575949](https://www.pixiv.net/artworks/144575949)
- 30 MB：[134516851](https://www.pixiv.net/artworks/134516851)
- 28 MB：[133392994](https://www.pixiv.net/artworks/133392994)
- 25 MB：[144273209](https://www.pixiv.net/artworks/144273209)

缩略图是 png 图片：

https://www.pixiv.net/artworks/144575518

缩略图是 gif 格式静态图片：

https://www.pixiv.net/artworks/144539571

动图的 zip 源文件里的图片都是 jpg 格式：
动图 zip 文件里的图片都是 jpg 格式。在用户投稿动图时，不管上传的图片是 jpg 还是 png，都会被 Pixiv 转换，生成新的 jpg 图片保存到 zip 文件里。只不过 Pixiv 转换图片时压缩等级比较高，所以有时候转换后的 jpg 图片体积比原图还大。

## fix: 修复 Ugoira 转 WebM 时内存溢出

这是一个 PR：
https://github.com/xuejianxianzun/PixivBatchDownloader/pull/673

下载器转换 WebM 时，向 worker 发送数据时没有把 ImageBitmap 作为 transferable 对象传递，这会导致 ImageBitmap 被浏览器再次复制，可能会导致内存溢出。

测试用的动图是这个：
https://www.pixiv.net/artworks/104933944

分辨率为1280*960px，有317张图片，体积 21.8 MB。

用修复之前的代码测试，转换为 WebM 格式时失败，可能就是爆内存了，不过我没有在控制台里看到这个报错，不知道这个错误会在哪里显示。使用修复后的代码转换成功了。

另外我对转换 GIF 的代码也应用了同样的优化（修改了 gif.js），并在 Chrome 和 Firefox 里测试，把这个动图转换为所有格式，都顺利转换完成了。

PS：之前我测试过转换累计一千多张动图，都没有遇到转换 WebM 时失败的情况，看来这个动图是很稀有的，同时满足了分辨率较高+帧数非常多这两个条件，才会导致爆内存。

PS：虽然之前 GIF 没有应用这个优化，不过转换这个动图能够成功，只有 WebM 会转换失败。
