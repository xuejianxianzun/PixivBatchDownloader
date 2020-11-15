# 注意

## 1

小说的 id 和插画的 id 是两套，所以可能会重复。

例如 id 12694537 既有插画也有小说。

## 2

小说的数据没有 illustType，本程序里把小说的 illustType 设置为 3，方便区分。

小说的数据里有 bookmarkCount，这比较方便。

## 3

小说可能会有分页，例如 https://www.pixiv.net/novel/show.php?id=10372931 有 2 页（pageCount），但是这个分页只是形式，content 里已经保存了完整的小说文本。

小说文本里通过插入 `[newpage]` 标记，进行形式上的分页。

## 4

有一些用户同时投稿了图片和小说。如 https://www.pixiv.net/users/7842901

在用户的首页，只会展示图片，不会展示小说。

但是下载器可以在用户的首页抓取到小说。

## 5

用户的插画列表页里，一页有 48 个作品。而小说列表页里，一页是 24 个作品。对此，本程序会尽量判断当前是什么页面，然后设置对应的数字。

# 页面类型

## 用户的小说列表页面

https://www.pixiv.net/users/35419040/novels

### API

先请求用户信息，获取所有小说的 id 列表、系列 id 列表

https://www.pixiv.net/ajax/user/35419040/profile/all

然后发起请求，默认是请求最新的 24 个小说的数据（因为小说列表页面一页只显示 24 个）

https://www.pixiv.net/ajax/user/35419040/profile/novels?ids%5B%5D=12775235&ids%5B%5D=12771688&ids%5B%5D=12737731&ids%5B%5D=12713780&ids%5B%5D=12694537&ids%5B%5D=12678979&ids%5B%5D=12657540&ids%5B%5D=12636687&ids%5B%5D=12600442&ids%5B%5D=12578823&ids%5B%5D=12566441&ids%5B%5D=12558229&ids%5B%5D=12336777&ids%5B%5D=12183084&ids%5B%5D=12073214&ids%5B%5D=12038796&ids%5B%5D=11997289&ids%5B%5D=11936778&ids%5B%5D=11921151&ids%5B%5D=11899911&ids%5B%5D=11854268&ids%5B%5D=11825714&ids%5B%5D=11797331&ids%5B%5D=11783052

## 用户的小说列表页面附带 tag：

https://www.pixiv.net/users/35419040/novels/%E5%A5%B3%E6%80%A7%E4%B8%BB%E4%BA%BA%E5%85%AC

### API

https://www.pixiv.net/ajax/user/35419040/novels/tag?tag=%E5%A5%B3%E6%80%A7%E4%B8%BB%E4%BA%BA%E5%85%AC&offset=0&limit=24

## 系列小说页面

https://www.pixiv.net/novel/series/1090654

### API

https://www.pixiv.net/ajax/novel/series_content/1090654?limit=10&last_order=0&order_by=asc

## 小说详情页面

https://www.pixiv.net/novel/show.php?id=12771688

### API

https://www.pixiv.net/ajax/novel/12771688

## 小说搜索页面

一页显示 24 个

https://www.pixiv.net/tags/%E5%A5%B3%E6%80%A7%E4%B8%BB%E4%BA%BA%E5%85%AC/novels

### API

https://www.pixiv.net/ajax/search/novels/%E7%95%B0%E4%B8%96%E7%95%8C%E8%BB%A2%E7%94%9F?word=%E7%95%B0%E4%B8%96%E7%95%8C%E8%BB%A2%E7%94%9F&order=date_d&mode=all&p=1&s_mode=s_tag_full

## 收藏的小说

https://www.pixiv.net/novel/bookmark.php

## 小说排行榜

https://www.pixiv.net/novel/ranking.php?mode=daily


## 关注的新作品-小说

https://www.pixiv.net/novel/bookmark_new.php

## 大家的新作品-小说

https://www.pixiv.net/novel/new.php