API：
```
https://www.pixiv.net/ajax/search/${Pagetype}/${word}?word=${word}&order=${order}&p=${p}&type=${type}&s_mode=${s_mode}&mode=${mode}&wlt=${wlt}&hlt=${hlt}&ratio=${ratio}&tool=${tool}&scd=${scd}&ecd=$(ecd)
```

## 不能直接从页面 url 中获取的字段：

Pagetype:

artworks  // 插画·漫画
illustrations // 插画
manga // 漫画
novels  // 小说

------

## 可以直接从页面 url 中获取的字段：

word:   // 从 url 获取
string


order:    // 如果 url 里没有 order 就视为 date_d
date_d  // 默认，按从新到旧
date  // 从旧到新，可以从 url 获取

p:
number

type: // 从 url 获取，结合其他条件
                  //获取所有类型时，留空。如：插画、漫画、动图（动态插画）  插画·漫画没有这个字段
illust            // 插画
manga             // 漫画
ugoira            // 动图，但其实和 illust 一样，没有单独区分动图
illust_and_ugoira // 插画 和 动图，但其实和 illust 一样
小说页面没有这个字段


wlt:    // 从 url 获取
number


hlt:    // 从 url 获取
number


ratio:  // 从 url 获取
0.5  // 横图
0   // 正方形
-0.5  // 纵图

tool: // 绘图工具，从 url 获取

s_mode：  // 搜索的精准度
            // 为空时是 "标签"
s_tag_full  // 标签（完全一致）
s_tc        // 标题，说明文字

mode:
      // 如果不限制，则留空
safe
r18

scd // 开始时间
2019-10-23

ecd  // 结束时间
2019-11-06

// 如果非会员使用收藏数标记，会被忽略

blt   // 收藏数量起始范围

bgt   // 收藏数量终止范围


https://www.pixiv.net/ajax/search/artworks/Fate%2FGrandOrder%20R-18?word=Fate%2FGrandOrder%20R-18&p=2&s_mode=s_tag_full

https://www.pixiv.net/ajax/search/manga/Fate%2FGrandOrder?word=Fate%2FGrandOrder&order=date&type=manga

https://www.pixiv.net/ajax/search/manga/Fate%2FGrandOrder%20R-18?word=Fate%2FGrandOrder%20R-18&type=manga

https://www.pixiv.net/ajax/search/novels/Fate%2FGrandOrder%20R-18?word=Fate%2FGrandOrder%20R-18&p=2

https://www.pixiv.net/ajax/search/novels/Fate%2FGrandOrder%20R-18?word=Fate%2FGrandOrder%20R-18&order=date&p=3