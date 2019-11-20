排行榜的 api 其实就是在排行榜页面的网址后面加上 `p` 数和 `format=json`。如下：

```
// 页面网址
https://www.pixiv.net/ranking.php?mode=daily&content=illust&date=20191118

// api
https://www.pixiv.net/ranking.php?mode=daily&content=illust&date=20191118&p=2&format=json
```

## mode

- daily
- daily_r18
- weekly
- weekly_r18
- monthly
- rookie
- male_r18
- female_r18
- r18g

## content

- 空，综合
- illust
- ugoira
- manga

## date

YYYYMMDD 格式的日期，如：

20191118

## p

数字

## format

- json