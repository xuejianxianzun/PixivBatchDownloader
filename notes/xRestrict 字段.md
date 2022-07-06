作品数据中有一项 `xRestrict`，以前没注意它是什么意思，现在测试了一番，觉得它表示作品的年龄限制。

`
xRestrict: 0 | 1 | 2
`

- 0 全年龄
- 1 R-18
- 2 R-18G

这个标记在所有类型的作品里都是可用的（包括小说）。

-----------

测试过程：

在 [综合今日排行榜](https://www.pixiv.net/ranking.php?mode=daily) 的**一般**分类中，抓取所有作品，`xRestrict` 皆为 `0`。

在 [综合R-18每日排行榜](https://www.pixiv.net/ranking.php?mode=daily_r18) 中，抓取所有作品，`xRestrict` 皆为 `1`。

在 [综合R-18G排行榜](https://www.pixiv.net/ranking.php?mode=r18g) 中，抓取所有作品，`xRestrict` 皆为 `2`。

-----------

在 [小说 本周排行榜](https://www.pixiv.net/novel/ranking.php?mode=weekly) 的**一般**分类中，抓取所有作品，`xRestrict` 皆为 `0`。

在 [小说 R-18本周排行榜](https://www.pixiv.net/novel/ranking.php?mode=weekly_r18) 的**一般**分类中，抓取所有作品，`xRestrict` 皆为 `1`。

在 [小说 R-18G排行榜](https://www.pixiv.net/novel/ranking.php?mode=r18g) 的**一般**分类中，抓取所有作品，`xRestrict` 皆为 `2`。
