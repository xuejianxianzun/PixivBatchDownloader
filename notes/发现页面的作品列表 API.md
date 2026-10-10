# 发现页面的作品列表 API

在 [发现页面](https://www.pixiv.net/discovery) 里，pixiv 会显示为当前用户推荐的作品。

发现页面里最前面的一些作品还会显示在其他页面里：
1. 首页的“推荐作品”区域
2. 新发表的作品底部的“推荐作品”区域

## API

https://www.pixiv.net/ajax/discovery/{path}?mode={mode}&limit={limit}&lang=zh

参数：

- `path`：这是 API 末尾的路径，可能是 `artworks`（插画、漫画）、`novels`（小说）、`users`（用户）。由于下载器现在不会抓取发现页面里的用户，因此只需要使用 `artworks` 和 `novels`。
- `mode`：返回的作品列表的年龄限制模式，可能是：`safe`（全年龄）、`all`（全年龄和 R18）、`r18`（R18）。注意：当 `path` 为 `users` 时没有 `mode` 参数。
- `limit`：这次请求返回多少个作品。当 `path` 为 `artworks` 时默认值是 `60`；当 `path` 为 `novels` 是默认值是 `100`。当 `path` 为 `users` 是默认值是 `20`。在所有 path 里的最大值都是 `100`，超过 100 的话会产生 400 错误（"不正确的请求"）。

示例：

- https://www.pixiv.net/ajax/discovery/artworks?mode=all&limit=60&lang=zh
- https://www.pixiv.net/ajax/discovery/novels?mode=r18&limit=100&lang=zh
- https://www.pixiv.net/ajax/discovery/users?limit=20&lang=zh

