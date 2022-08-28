# 调查使用 ids API 批量获取用户作品数据的可行性

# 设想的使用场景

ids API 一次可以获取一个用户的最多 100 个作品。

我考虑在用户主页、关注页面使用 ids API，以减少请求数量，避免被 Pixiv 限制，并且能够加快抓取速度。

# 总结

在进行了调查之后（调查详情见下面的其余章节），我发现由于 ids API 是用在列表页的，所以它缺少了很多重要的数据，这导致它的实用性非常低。

所以我决定不使用 ids API，原定的后续测试也不再进行。

后续测试：分别测试下载用户的图像和小说作品。测试的用户必须有比较多的作品，因为下载器需要测试分页、分类等情况下的抓取。

图像作品测试：ATDAN- https://www.pixiv.net/users/6662895

小说作品测试：岬@気分屋 https://www.pixiv.net/users/4914751/novels

-------------------

# 获取图像作品

GET 请求：

```
https://www.pixiv.net/ajax/user/${userId}/profile/illusts?${ids[]=${id}&}[]&work_category=${any}&is_first_page=${0|1}&lang=zh
```

`ids%5B%5D` 就是 `ids[]` 编码后的字符。

## 示例

在这个插画页面一共有 44 个作品，可以用 ids 一次获取。

https://www.pixiv.net/users/29314050/illustrations?p=2

https://www.pixiv.net/ajax/user/29314050/profile/illusts?ids%5B%5D=85168273&ids%5B%5D=84827101&ids%5B%5D=84705567&ids%5B%5D=84657981&ids%5B%5D=84539920&ids%5B%5D=84480254&ids%5B%5D=84394673&ids%5B%5D=84374230&ids%5B%5D=84303396&ids%5B%5D=84263903&ids%5B%5D=84181148&ids%5B%5D=84130741&ids%5B%5D=84047462&ids%5B%5D=83890059&ids%5B%5D=83344820&ids%5B%5D=83290875&ids%5B%5D=83098495&ids%5B%5D=82898919&ids%5B%5D=82725756&ids%5B%5D=82447213&ids%5B%5D=82402757&ids%5B%5D=82387328&ids%5B%5D=82226080&ids%5B%5D=82164277&ids%5B%5D=82021843&ids%5B%5D=81900191&ids%5B%5D=81577725&ids%5B%5D=81514563&ids%5B%5D=81397530&ids%5B%5D=81386700&ids%5B%5D=81297107&ids%5B%5D=80829359&ids%5B%5D=80635995&ids%5B%5D=80468661&ids%5B%5D=80459668&ids%5B%5D=80459580&ids%5B%5D=80439269&ids%5B%5D=71824381&ids%5B%5D=71194149&ids%5B%5D=68952244&ids%5B%5D=68828089&ids%5B%5D=68338362&ids%5B%5D=68215691&ids%5B%5D=68186633&work_category=illust&is_first_page=0&lang=zh

---------------------

在这个漫画页面一共有 48 个作品，可以用 ids 一次获取。

https://www.pixiv.net/users/13651304/manga

https://www.pixiv.net/ajax/user/13651304/profile/illusts?ids%5B%5D=100759554&ids%5B%5D=100692527&ids%5B%5D=100639409&ids%5B%5D=100588249&ids%5B%5D=100490654&ids%5B%5D=100438098&ids%5B%5D=100387115&ids%5B%5D=100339345&ids%5B%5D=100285567&ids%5B%5D=100236436&ids%5B%5D=100142030&ids%5B%5D=100086941&ids%5B%5D=100041473&ids%5B%5D=99996732&ids%5B%5D=99945920&ids%5B%5D=99895483&ids%5B%5D=90796954&ids%5B%5D=90613653&ids%5B%5D=90496475&ids%5B%5D=90297910&ids%5B%5D=88487594&ids%5B%5D=88096614&ids%5B%5D=86093940&ids%5B%5D=85793943&ids%5B%5D=85698325&ids%5B%5D=85650530&ids%5B%5D=85503839&ids%5B%5D=85446714&ids%5B%5D=85423139&ids%5B%5D=85243316&ids%5B%5D=85176470&ids%5B%5D=85157879&ids%5B%5D=85075786&ids%5B%5D=85053742&ids%5B%5D=84958498&ids%5B%5D=84908105&ids%5B%5D=84850871&ids%5B%5D=84758337&ids%5B%5D=84717529&ids%5B%5D=84609301&ids%5B%5D=84571525&ids%5B%5D=84419193&ids%5B%5D=84206337&ids%5B%5D=84116104&ids%5B%5D=84095284&ids%5B%5D=83800696&ids%5B%5D=83779831&ids%5B%5D=83564141&work_category=manga&is_first_page=1&lang=zh

看来 `illusts` 这个分类可以获取所有类型的图像作品。

## 参数 ids

作品 id 列表，每个作品生成一个查询参数 `ids%5B%5D=${id}`。

同一个请求里的 id 列表上限是 100，超出 100 个就会返回错误信息：`"不正确的请求。"`。

## 参数 work_category 

这个参数是必需的，但是它的值可以留空。

虽然上面两个 URL 中的 `work_category` 参数区分了 `illust` 和 `manga`，但是并没有实际意义。

```
https://www.pixiv.net/ajax/user/13651304/profile/illusts?ids%5B%5D=63167873&ids%5B%5D=100759554&work_category=illust&is_first_page=1&lang=zh
```

上面的 URL 里有 2 个 id，第一个 id 是插画，第二个 id 是漫画。URL 这里的 work_category 值可以任意修改，能够获取到同样的作品数据。

`work_category` 目前发现可以使用这些值：

| 标记        | 对应的页面                                                       |
| ----------- | ---------------------------------------------------------------- |
| [空字符串]  | 用户主页：https://www.pixiv.net/users/9460149/artworks           |
| [任意字符]  | 同上，用户主页                                                   |
| illustManga | 同上，用户主页                                                   |
| illust      | 插画分类：https://www.pixiv.net/users/9460149/illustrations      |
| ugoira      | 同上，插画分类。以前动图有单独的分类页面，现在合并到插画分类里了 |
| manga       | 漫画分类：https://www.pixiv.net/users/13651304/manga             |

实际上使用其中任意一种都可以获取到同样的数据，它们的区别仅仅在于返回的数据的 extraData 里的网址和简介不一样，这些下载器不需要使用，无需理会。

## 参数 is_first_page 

这个参数是必需的，它的值只有两种。

- 当用户处于作品列表页第一页的时候，值为 `1`。
- 处于后续页面的时候，值为 `0`。

但实际上，使用 `0` 或 `1` 都可以得到相同的数据，所以随便选一个就可以了。

# 获取小说作品

GET 请求：

```
https://www.pixiv.net/ajax/user/${userId}/profile/novels?${ids[]=${id}&}[]&lang=zh
```

## 示例

https://www.pixiv.net/users/13690798/novels

在这个小说页面，一页显示 24 个小说，可以用 ids 一次获取。

https://www.pixiv.net/ajax/user/13690798/profile/novels?ids%5B%5D=18226719&ids%5B%5D=18203788&ids%5B%5D=18192738&ids%5B%5D=18156043&ids%5B%5D=18129432&ids%5B%5D=18075802&ids%5B%5D=18020394&ids%5B%5D=17988887&ids%5B%5D=17932673&ids%5B%5D=17851776&ids%5B%5D=17844106&ids%5B%5D=17812030&ids%5B%5D=17783989&ids%5B%5D=17727100&ids%5B%5D=17683230&ids%5B%5D=17683227&ids%5B%5D=17636562&ids%5B%5D=17587257&ids%5B%5D=17569659&ids%5B%5D=17521595&ids%5B%5D=17514892&ids%5B%5D=17478413&ids%5B%5D=17431416&ids%5B%5D=17393828&lang=zh

## 参数 ids

同图像作品的 ids 参数。id 上限为 100。

# 图像作品缺少的数据

ids API 是用于作品列表的，相比于对单个作品的请求，它缺少了一些数据。

对于单个图像作品如：（这是系列作品中的一个） https://www.pixiv.net/artworks/58318451

使用 ids API 获取其数据：

https://www.pixiv.net/ajax/user/4203133/profile/illusts?ids%5B%5D=58318451&work_category=illust&is_first_page=0&lang=zh

获取详细数据： 

https://www.pixiv.net/ajax/illust/58318451

可以看到 ids API 返回的数据缺少了一些属性，其中对下载器有影响的缺失属性有：

```json
{
  "urls": {
    "mini": "https://i.pximg.net/c/48x48/img-master/img/2016/08/08/08/31/02/58318451_p0_square1200.jpg",
    "thumb": "https://i.pximg.net/c/250x250_80_a2/img-master/img/2016/08/08/08/31/02/58318451_p0_square1200.jpg",
    "small": "https://i.pximg.net/c/540x540_70/img-master/img/2016/08/08/08/31/02/58318451_p0_master1200.jpg",
    "regular": "https://i.pximg.net/img-master/img/2016/08/08/08/31/02/58318451_p0_master1200.jpg",
    "original": "https://i.pximg.net/img-original/img/2016/08/08/08/31/02/58318451_p0.png"
  },
  "tags": {
    "authorId": "4203133",
    "isLocked": false,
    "tags": [
      {
        "tag": "艦これ",
        "locked": true,
        "deletable": false,
        "userId": "4203133",
        "translation": {
          "en": "舰C"
        },
        "userName": "弱電波(@JackDempa)"
      },
      {
        "tag": "浜風",
        "locked": true,
        "deletable": false,
        "userId": "4203133",
        "translation": {
          "en": "滨风"
        },
        "userName": "弱電波(@JackDempa)"
      },
      {
        "tag": "ドSホイホイ",
        "locked": false,
        "deletable": true,
        "translation": {
          "en": "抖S"
        }
      },
      {
        "tag": "乳風",
        "locked": false,
        "deletable": true,
        "translation": {
          "en": "Shipgirls with huge breasts"
        }
      },
      {
        "tag": "憲兵さんこっちです",
        "locked": false,
        "deletable": true,
        "translation": {
          "en": "宪兵，就是那个人"
        }
      },
      {
        "tag": "納得の犯罪臭",
        "locked": false,
        "deletable": true
      },
      {
        "tag": "怯え",
        "locked": false,
        "deletable": true,
        "translation": {
          "en": "fear"
        }
      },
      {
        "tag": "手首押さえつけ",
        "locked": false,
        "deletable": true,
        "translation": {
          "en": "wristlock"
        }
      },
      {
        "tag": "押し倒し",
        "locked": false,
        "deletable": true,
        "translation": {
          "en": "pushed down"
        }
      },
      {
        "tag": "艦これ10000users入り",
        "locked": false,
        "deletable": true,
        "translation": {
          "en": "舰队收藏10000收藏"
        }
      }
    ],
    "writable": true
  },
  "bookmarkCount": 14408,
  "likeCount": 12174,
  "viewCount": 309641,
  "commentCount": 63,
  "seriesNavData": {
    "seriesType": "manga",
    "seriesId": "11855",
    "title": "恐怖顔まとめ",
    "order": 1,
    "isWatched": false,
    "isNotifying": false,
    "prev": null,
    "next": {
      "id": "58873007",
      "title": "恐怖潮",
      "order": 2
    }
  }
}
```

这会导致下载器的一些功能受限：

**不能使用这些过滤器：**

- 必须含有标签
- 不能含有标签
- 收藏数量

**不能使用这些命名规则：**

- {tags_translate}
- {tags_transl_only}
- {like} 
- {view}
- {bmk}
- {bmk_1000}
- {series_title} 
- {series_order} 
- {series_id}

# 小说作品缺少的数据

ids API 是用于作品列表的，相比于对单个作品的请求，它缺少了一些数据。

对于单个小说作品如：（这是系列作品中的一个） https://www.pixiv.net/novel/show.php?id=17868764

使用 ids API 获取其数据：

https://www.pixiv.net/ajax/user/9460149/profile/novels?ids%5B%5D=17868764

获取详细数据： 

https://www.pixiv.net/ajax/novel/17868764

可以看到 ids API 返回的数据缺少了一些属性，其中对下载器有影响的缺失属性有：

```json
{
  "likeCount": 0,
  "viewCount": 39,
  "content": "111111111111",
  "coverUrl": "https://i.pximg.net/c/600x600/novel-cover-master/img/2022/06/29/22/28/30/sci9114820_f3946e0fb12dd5bfc055932e88a8a512_master1200.jpg",
  "tags": {
    "authorId": "9460149",
    "isLocked": true,
    "tags": [
      {
        "tag": "中文",
        "locked": true,
        "deletable": true,
        "userId": "9460149",
        "userName": "雪见仙尊"
      }
    ],
    "writable": true
  },
  "seriesNavData": {
    "seriesType": "novel",
    "seriesId": 9114820,
    "title": "测试系列",
    "isConcluded": false,
    "isReplaceable": false,
    "isWatched": false,
    "isNotifying": false,
    "order": 1,
    "next": {
      "title": "post2",
      "order": 2,
      "id": "17870277",
      "available": true
    },
    "prev": null
  }
}
```

与图像作品不同的是，小说的 ids API 里含有收藏数量。

而且小说的标签好像是都没有翻译的，所以对标签相关的功能没有影响。

这会导致下载器的一些功能受限：

**不能使用这些命名规则：**

- {like} 
- {view}
- {series_title} 
- {series_order} 
- {series_id}

此外，**获取不到小说的正文和封面图。** 这个问题非常严重，导致 ids API 根本不能用来抓取小说作品。
