<!-- TOC -->

- [API](#api)
  - [获取任意投稿列表时的通用规则](#获取任意投稿列表时的通用规则)
      - [查询字符串的可用字段](#查询字符串的可用字段)
    - [body 里的字段](#body-里的字段)
      - [items 字段的内容](#items-字段的内容)
  - [获取自己主页的投稿列表](#获取自己主页的投稿列表)
    - [url](#url)
  - [获取“正在赞助”页面的投稿列表](#获取正在赞助页面的投稿列表)
    - [url](#url-1)
  - [获取创作者信息](#获取创作者信息)
    - [url](#url-2)
    - [body 里的字段](#body-里的字段-1)
  - [获取创作者投稿列表](#获取创作者投稿列表)
    - [url](#url-3)
  - [获取创作者某个 tag 的投稿列表](#获取创作者某个-tag-的投稿列表)
    - [url](#url-4)
  - [获取指定投稿](#获取指定投稿)
    - [url](#url-5)
    - [body 里的字段](#body-里的字段-2)
    - [付费内容的 body 字段](#付费内容的-body-字段)
    - [免费内容的 body 字段](#免费内容的-body-字段)
    - [user 字段的内容](#user-字段的内容)
    - [nextPost prevPost 字段的内容](#nextpost-prevpost-字段的内容)
  - [获取创作者商品列表](#获取创作者商品列表)
    - [url](#url-6)
    - [有用数据](#有用数据)
- [页面](#页面)
  - [用户自己的主页](#用户自己的主页)
    - [url 规则](#url-规则)
    - [内容](#内容)
    - [按钮](#按钮)
  - [正在赞助](#正在赞助)
    - [url 规则](#url-规则-1)
    - [内容](#内容-1)
    - [按钮](#按钮-1)
  - [创作者的主页/个人资料页](#创作者的主页个人资料页)
    - [url 规则](#url-规则-2)
    - [内容](#内容-2)
    - [按钮](#按钮-2)
  - [创作者的投稿列表页面](#创作者的投稿列表页面)
    - [url 规则](#url-规则-3)
    - [内容](#内容-3)
    - [资源](#资源)
    - [按钮](#按钮-3)
  - [创作者某个 tag 的投稿列表](#创作者某个-tag-的投稿列表)
    - [url 规则](#url-规则-4)
    - [内容：](#内容)
    - [按钮](#按钮-4)
  - [创作者的投稿内容页面](#创作者的投稿内容页面)
    - [url 规则](#url-规则-5)
    - [内容](#内容-4)
    - [资源](#资源-1)
    - [按钮](#按钮-5)
  - [创作者的商店页面](#创作者的商店页面)
    - [url 规则](#url-规则-6)
    - [内容](#内容-5)
    - [资源](#资源-2)
      - [商品封面图](#商品封面图)
    - [按钮](#按钮-6)
    - [注意](#注意)
- [设置选项](#设置选项)
  - [抓取的投稿数量](#抓取的投稿数量)
  - [抓取的文件类型](#抓取的文件类型)
  - [抓取免费的投稿](#抓取免费的投稿)
  - [设置价格区间](#设置价格区间)
  - [设置 id 范围](#设置-id-范围)
  - [设置时间范围](#设置时间范围)
  - [设置命名规则](#设置命名规则)
  - [只对图片使用序号](#只对图片使用序号)
- [测试用的网址](#测试用的网址)
  - [测试的画师](#测试的画师)
    - [1](#1)
    - [2](#2)

<!-- /TOC -->

# API

注意：

1. 所有的“投稿列表”里都不含有付费内容。

2. 请求时要携带 cookie，如 

```
fetch('https://fanbox.pixiv.net/api/post.listCreator?userId=457541&limit=10', {
  method: 'get',
  credentials: 'include'
})
.then(res=>{
  return res.json()
})
.then(data=>{
  console.log(data)
  console.log(data.body.nextUrl)
})
```

## 获取任意投稿列表时的通用规则

#### 查询字符串的可用字段

| 字段                 | 说明                   |
| -------------------- | :--------------------- |
| userId               | 用户 id                |
| maxPublishedDatetime | 最大发布时间           |
| maxId                | 最大的投稿 id          |
| limit                | 这次请求获取多少篇投稿 |

- `userId` 在自己主页、“正在赞助”页面，不需要指定 userId。

- `maxPublishedDatetime` 筛选从指定时间开始，**更早期**的投稿。格式如 `"2020-02-14 16:30:37"`，需要用 `encodeURIComponent` 编码。

- `maxId` 筛选从指定 id 开始，**更早期**的投稿。（包含这个 id）

- `limit` 这次请求最多获取多少篇投稿。最大值为 300，超过 300 会产生 HTTP 400 错误。

### body 里的字段

获取到任意投稿列表后，数据在 body 属性里，里面有如下字段：

| 字段    | 值               | 说明                         |
| ------- | :--------------- | :--------------------------- |
| items   | array            | 投稿列表，见下               |
| nextUrl | string 或者 null | 下一次获取投稿列表使用的 URL |

items 是个数组，保存每一篇投稿的信息。获取的投稿顺序总是从最新到最久。（投稿 id 从大到小排列）

如果有 nextUrl ，则使用 nextUrl 请求接下来的投稿。

#### items 字段的内容

每一篇投稿的数据是 object，包含的字段如下：

| 字段              | 值                                      | 说明                                  |
| ----------------- | :-------------------------------------- | :------------------------------------ |
| id                |                                         | string                                | id |
| title             | string                                  | title                                 |
| coverImageUrl     | string 或者 null                        | 封面图 URL，无则为 null               |
| feeRequired       | number                                  | 需要的赞助金额（日元）                |
| publishedDatetime | string，如  "2020-02-29T19:27:19+09:00" | 发布时间                              |
| updatedDatetime   | string 如 "2020-03-04T21:53:44+09:00"   | 更新时间                              |
| type              | 'file' 或者 'images' 或者 'article'     | 资源的类型                            |
| body              | object 或者 null (下面详细说明)         | 付费的内容，未解锁的话是null          |
| tags              | string[]                                | tags，但是大部分都是空的 []           |
| excerpt           | string 或者 null                        | body 里 text 字段的摘要，未解锁是null |
| isLiked           | boolean                                 | 是否已点赞                            |
| likeCount         | number                                  | 点赞数                                |
| commentCount      | number                                  | 评论数                                |
| restrictedFor     | number 或者 null                        | 限制？不清楚。赞助过的话为 null       |
| user              | object                                  | 作者信息，见下                        |
| status            | "published" 或者还有其他状态，但没遇到  | 该投稿的状态                          |

## 获取自己主页的投稿列表

自己主页显示的投稿列表，有些是赞助的，有些是未赞助的。价值不大。

### url

直接获取最新的 x 篇投稿，官方默认是 10 个：

`https://fanbox.pixiv.net/api/post.listHome?limit=10`

或者使用完整参数：

`https://fanbox.pixiv.net/api/post.listHome?maxPublishedDatetime=2020-03-11%2023%3A04%3A28&maxId=886386&limit=10`

内容在 body 字段里。

## 获取“正在赞助”页面的投稿列表

### url

直接获取最新的 x 篇投稿，官方默认是 10 个：

`https://fanbox.pixiv.net/api/post.listSupporting?limit=10`

或者使用完整参数：

`https://fanbox.pixiv.net/api/post.listSupporting?maxPublishedDatetime=2020-03-01%2018%3A52%3A36&maxId=864129&limit=10`

内容在 body 字段里。

## 获取创作者信息

### url

`https://fanbox.pixiv.net/api/creator.get?userId=457541`

内容在 body 字段里。

### body 里的字段

仅记录部分字段：

| 字段            | 值      | 说明             |
| --------------- | :------ | :--------------- |
| hasAdultContent | boolean | 是否含有成人内容 |
| isSupported     | boolean | 是否赞助过       |
| isStopped       | boolean | 是否已停止赞助   |

## 获取创作者投稿列表

### url

直接获取最新的 x 篇投稿，官方默认是 10 个：

`https://fanbox.pixiv.net/api/post.listCreator?userId=457541&limit=10`

或者使用完整参数：

`https://fanbox.pixiv.net/api/post.listCreator?userId=457541&maxPublishedDatetime=2020-02-14%2016%3A30%3A37&maxId=830218&limit=10`

内容在 body 字段里。

## 获取创作者某个 tag 的投稿列表

### url

`https://fanbox.pixiv.net/api/post.listTagged?tag=%E5%8B%95%E7%94%BB&userId=1082583`

## 获取指定投稿

### url

`https://fanbox.pixiv.net/api/post.info?postId=777807`

内容在 body 字段里。

### body 里的字段

| 字段              | 值                                      | 说明                                  |
| ----------------- | :-------------------------------------- | :------------------------------------ |
| id                | string                                  | id                                    |
| title             | string                                  | title                                 |
| coverImageUrl     | string 或者 null                        | 封面图 URL，无则为 null               |
| feeRequired       | number                                  | 需要的赞助金额（日元）                |
| publishedDatetime | string，如  "2020-02-29T19:27:19+09:00" | 发布时间                              |
| updatedDatetime   | string 如 "2020-03-04T21:53:44+09:00"   | 更新时间                              |
| type              | 'file' 或者 'images' 或者 'article'     | 资源的类型                            |
| body              | object 或者 null (下面详细说明)         | 付费的内容，未解锁的话是null          |
| tags              | string[]                                | tags，但是大部分都是空的 []           |
| excerpt           | string 或者 null                        | body 里 text 字段的摘要，未解锁是null |
| isLiked           | boolean                                 | 是否已点赞                            |
| likeCount         | number                                  | 点赞数                                |
| commentCount      | number                                  | 评论数                                |
| restrictedFor     | number 或者 null                        | 限制？不清楚。赞助过的话为 null       |
| user              | object                                  | 作者信息，见下                        |
| status            | "published" 或者还有其他状态，但没遇到  | 该投稿的状态                          |
| commentList       | object                                  | 所有评论的详细信息                    |
| nextPost          | object  或者 null                       | 下一个投稿的简略信息，见下            |
| prevPost          | object  或者 null                       | 上一个投稿的简略信息，见下            |
| imageForShare     | string                                  | 分享用的图片的 URL                    |


### 付费内容的 body 字段

未解锁时（没有赞助或者赞助金额不够），是 `null`。

解锁后是一个 object，可能有以下字段中的一个或多个。示例：

```
{
  // 文字，string
  "text": 'xxxxxxx',
  
  // 文件，array
  "files": [
    {
        "id": "iJlYhPHdYlhoQRAY2c6NKtZG",
        "name": "20200118b",
        "extension": "zip",
        "size": 89088067,
        "url": "https://fanbox.pixiv.net/files/post/777807/iJlYhPHdYlhoQRAY2c6NKtZG.zip"
    }
  ]
  
  // 图片，array
  "images": [
     {
         "id": "gW1I6hnq5VLxTVhMGAPMUWO4",
         "extension": "png",
         "width": 975,
         "height": 1430,
         "originalUrl": "https://fanbox.pixiv.net/images/post/861023/gW1I6hnq5VLxTVhMGAPMUWO4.png",
         "thumbnailUrl": "https://fanbox.pixiv.net/images/post/861023/w/1200/gW1I6hnq5VLxTVhMGAPMUWO4.jpeg"
     },
     {
         "id": "rDA2iArPMxva2ibagyuQuzTR",
         "extension": "png",
         "width": 997,
         "height": 1399,
         "originalUrl": "https://fanbox.pixiv.net/images/post/861023/rDA2iArPMxva2ibagyuQuzTR.png",
         "thumbnailUrl": "https://fanbox.pixiv.net/images/post/861023/w/1200/rDA2iArPMxva2ibagyuQuzTR.jpeg"
     }
  ] 
}
```

### 免费内容的 body 字段

但是有些投稿（对所有人公开）就不太一样，例如 https://www.pixiv.net/fanbox/creator/49348/post/885969 ，`body` 里 `blocks` 记录投稿里的所有内容（文字和图片等），除了文字之外的其他部分有个资源 id，从资源 map 里获取信息然后加载。

对所有人公开的投稿， `feeRequired` 为 `0`.

```
"blocks": [
    {
        "type": "p",
        "text": "◎あなたのサークル「Allegro Mistic」は、月曜日　西地区“れ”ブロック－04b に配置されました。"
    },
    {
        "type": "image",
        "imageId": "b0OZ6qQ3AQDqd9xCsvt4jMPY"
    }
],
"imageMap": {
    "b0OZ6qQ3AQDqd9xCsvt4jMPY": {
        "id": "b0OZ6qQ3AQDqd9xCsvt4jMPY",
        "extension": "png",
        "width": 300,
        "height": 427,
        "originalUrl": "https://fanbox.pixiv.net/images/post/885969/b0OZ6qQ3AQDqd9xCsvt4jMPY.png",
        "thumbnailUrl": "https://fanbox.pixiv.net/images/post/885969/w/1200/b0OZ6qQ3AQDqd9xCsvt4jMPY.jpeg"
    }
},
"fileMap": {},
"embedMap": {}
```

当出现 `blocks` 时，后面三个资源 map 对象都会出现，不会不出现。如果资源为空，则是恐怖对象，不会是 null。

### user 字段的内容

```
{
    "userId": "135770",
    "name": "コンノトヒロ",
    "iconUrl": "https://pixiv.pximg.net/c/160x160_90_a2_g5/fanbox/public/images/user/135770/icon/CZTHpYlkEg62QNmr6Uhwjj19.jpeg"
}
```

`iconUrl` 是头像的 url。

### nextPost prevPost 字段的内容

内容的格式是一样的

```
{
    "id": "870057",
    "title": "【R‐18】フウサブン",
    "publishedDatetime": "2020-03-04 08:48:40"
}
```

## 获取创作者商品列表

这是直接从 booth 获取的，不是从 fanbox。

### url

`https://api.booth.pm/pixiv/shops/show.json?pixiv_user_id=2527282&adult=include`

### 有用数据

`body.total_count` 商品总数

`body.items` 所有商品的信息

`body.items[index].primary_image.url` 每个商品的封面图

`body.items[index].name` 每个商品的名称

`body.items[index].market_url` 每个商品的网址


`body.user.nickname` 用户名

`body.user.pixiv_user_id` 用户 id

# 页面

## 用户自己的主页

### url 规则

`https://www.pixiv.net/fanbox`

后面可能带查询字符串，但不能再有其他路径。有其他路径的不是用户主页了。

### 内容

赞助画师的投稿，和没有赞助的画师的投稿。

### 按钮

抓取赞助的所有用户的投稿

## 正在赞助

### url 规则

`https://www.pixiv.net/fanbox/supporting`

### 内容

赞助画师的投稿。

### 按钮

抓取赞助的所有用户的投稿

## 创作者的主页/个人资料页

### url 规则

```
https://www.pixiv.net/fanbox/creator/457541
https://www.pixiv.net/fanbox/creator/6843920
```

最后的 uid 和其在 pixiv 主站的用户 id 一致。

### 内容

1. 个人介绍
2. 投稿列表

### 按钮

抓取该用户的投稿

## 创作者的投稿列表页面

### url 规则

```
https://www.pixiv.net/fanbox/creator/457541/post
```

主页 URL 后面加上 `post` 路径。

### 内容

投稿列表。

1. 不会直接显示付费内容。
2. 不会显示文件下载按钮。
3. 有设置封面图的话，不管是否赞助，都会显示封面图。
4. 没有封面图的话，没赞助时，直接是一个锁。赞助时会显示第一张作为封面图。

### 资源

主要就是封面图，有些投稿没有封面图。虽然封面图看上去可能是裁剪成横图的，但实际上是完整的图片。

### 按钮

抓取该用户的投稿

## 创作者某个 tag 的投稿列表

### url 规则

```
https://www.pixiv.net/fanbox/creator/1082583/tag/%E5%8B%95%E7%94%BB
```

### 内容：

某个 tag 的投稿的列表。

### 按钮

抓取该 tag 的投稿

## 创作者的投稿内容页面

### url 规则

```
https://www.pixiv.net/fanbox/creator/457541/post/777807
```

### 内容

投稿的详细内容

包括付费内容。

### 资源

1. 文件下载按钮（如果有）
2. 图片（如果有）
3. 文本（如果有）

### 按钮

抓取这篇投稿

## 创作者的商店页面

### url 规则

```
https://www.pixiv.net/fanbox/creator/6843920/shop
```

主页 URL 后面加上 `shop` 路径。

### 内容

商品列表，点击会进入 booth 的贩售页面。

### 资源

#### 商品封面图

图片网址如：

`https://booth.pximg.net/51c24798-6d04-43fe-a454-ea981807179c/i/1801292/a0c03ec2-1d23-4571-a79f-77a8b0fd2e1d.jpg`

不知除了 `pximg.net` 是否还有其他 cdn 域名。

### 按钮

抓取商品的封面图

### 注意

商品的 api 和网址不是 fanbox 的，会导致一些选项和命名字段不可用。

# 设置选项

## 抓取的投稿数量

## 抓取的文件类型

<input type="checkbox"> 所有 <input type="checkbox">图片 <input type="checkbox">视频 <input type="checkbox">压缩包 <input type="checkbox">psd

## 抓取免费的投稿

是/否

## 设置价格区间

只抓取指定价格范围的投稿

## 设置 id 范围

## 设置时间范围

## 设置命名规则

| 字段  | 说明             |
| ----- | :--------------- |
| id    | 投稿的 id        |
| title | 投稿的标题       |
| date  | 投稿的发布时间   |
| fee   | 投稿的价格       |
| name  | 资源原本的文件名 |
| index | 资源的序号       |
| user  | 画师的名字       |
| uid   | 画师的 id        |

## 只对图片使用序号

对于不是图片的文件，不添加序号。

# 测试用的网址

## 测试的画师

### 1

[omutatsu/おむたつ](https://www.pixiv.net/fanbox/creator/1499614)

有 100 和 500 两档赞助，并且都有对应价格的资源

有对所有人公开的投稿

有图片

有 psd

-没有视频
-没有 zip

### 2

[さき千鈴](https://www.pixiv.net/fanbox/creator/236592/post)

测试视频用