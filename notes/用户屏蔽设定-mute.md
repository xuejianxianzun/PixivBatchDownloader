- [屏蔽设定](#屏蔽设定)
  - [返回值里通用的数据结构](#返回值里通用的数据结构)
  - [获取用户的屏蔽设置](#获取用户的屏蔽设置)
  - [检查是否屏蔽了指定用户](#检查是否屏蔽了指定用户)
  - [检查是否屏蔽了指定作品](#检查是否屏蔽了指定作品)
  - [添加一个屏蔽项](#添加一个屏蔽项)
  - [删除一个屏蔽项](#删除一个屏蔽项)

# 屏蔽设定

Pixiv 允许用户屏蔽某些 tag 和用户。普通用户只能设置 1 个屏蔽项，高级会员可以设置 500 个。

在作品页面里，作品的图片下方有 `...` 的扩展菜单，点击可以看到“屏蔽”功能。在用户页面里也有这个菜单。

以下操作都要携带 cookie。

## 返回值里通用的数据结构

```json
{
  "type": "tag" | "user",
  "value": string,
  "label": string,
  "iconUrl": null | string,
  "enabled": boolean,
  "isMuted": boolean,
  "listType": "existing" | "candidate"
}
```

- `type` 指示这个项目是 tag 还是 user
- `value` 当项目是 tag 时为 tag 名称；当项目是 user 时为 userId
- `label` 当项目是 tag 时为 tag 名称；当项目是 user 时为用户名
- `iconUrl` 当项目是 tag 时为 `null`；当项目是 user 时为用户头像 url
- `enabled` 这个项目是否启用。如果为 `false`，则这个项目虽然存在，但是并没有实际上屏蔽。可能导致为 `false` 的原因：以前使用会员功能屏蔽了多个 tag，后来会员过期了，但是屏幕项目还在，只是失效了。
- `isMuted` 是否屏蔽这个项目。目前看到的都是 `true`。
- `listType` `'existing'` 表示这个项目存在于“設定中”区域里；`'candidate'` 指这个项目存在于“候補”区域里。这只表示它们显示的区域，不应作为判断的标准。

## 获取用户的屏蔽设置

`GET`

`https://www.pixiv.net/ajax/mute/items?context=setting`

返回结果示例如下，最多可能有两种数据类型，一种是屏蔽的 tag，一种是屏蔽的用户。

```json
{
    "error": false,
    "message": "",
    "body": {
        "mute_items": [
            {
                "type": "tag",
                "value": "沖田総司",
                "label": "沖田総司",
                "iconUrl": null,
                "enabled": true,
                "isMuted": true,
                "listType": "existing"
            },
            {
                "type": "user",
                "value": "73152",
                "label": "光崎",
                "iconUrl": "https://i.pximg.net/user-profile/img/2015/12/30/19/26/46/10307852_e9687aa5de3f4103cb3b99845e221462_170.jpg",
                "enabled": false,
                "isMuted": true,
                "listType": "existing"
            }
        ]
    }
}
```

## 检查是否屏蔽了指定用户

`GET`

`https://www.pixiv.net/ajax/mute/items?context=user&id=${userId}&lang=zh`

返回值里有个坑： value 的值是 number，而其他 api 里是 string。

```json
{
    "error": false,
    "message": "",
    "body": {
        "mute_items": [
            {
                "type": "user",
                "value": 73152,
                "label": "光崎",
                "iconUrl": "https://i.pximg.net/user-profile/img/2015/12/30/19/26/46/10307852_e9687aa5de3f4103cb3b99845e221462_170.jpg",
                "enabled": true,
                "isMuted": true,
                "listType": "candidate"
            }
        ]
    }
}
```

## 检查是否屏蔽了指定作品

`GET`

`https://www.pixiv.net/ajax/mute/items?context=illust&id=${id}&lang=zh`

返回结果里会包含：

1. 当前作品所属的用户是否被屏蔽
2. 当前作品所有的 tag（每个 tag 是否被屏蔽）

```json
{
    "error": false,
    "message": "",
    "body": {
        "mute_items": [
            {
                "type": "user",
                "value": "73152",
                "label": "光崎",
                "iconUrl": "https://i.pximg.net/user-profile/img/2015/12/30/19/26/46/10307852_e9687aa5de3f4103cb3b99845e221462_170.jpg",
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "Fate/GrandOrder",
                "label": "Fate/GrandOrder",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "FGO",
                "label": "FGO",
                "iconUrl": null,
                "enabled": true,
                "isMuted": true,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "プロトマーリン",
                "label": "プロトマーリン",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "Fate/GrandOrderArcade",
                "label": "Fate/GrandOrderArcade",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "石の貯蔵は十分か?",
                "label": "石の貯蔵は十分か?",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "Fate/GO30000users入り",
                "label": "Fate/GO30000users入り",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "Fate/Prototype30000users入り",
                "label": "Fate/Prototype30000users入り",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "ふつくしい",
                "label": "ふつくしい",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            },
            {
                "type": "tag",
                "value": "勝てる気がしない",
                "label": "勝てる気がしない",
                "iconUrl": null,
                "enabled": true,
                "isMuted": false,
                "listType": "candidate"
            }
        ]
    }
}
```

## 添加一个屏蔽项

`POST`

`https://www.pixiv.net/ajax/mute/items/add`

body:

示例： 

```javascript
{
   context: 'illust',
   type: 'tag',
   value: 'FGO'
}
```

`context=illust&type=tag&value=FGO`

返回：

```json
{
    "error": false,
    "message": "",
    "body": ""
}
```

## 删除一个屏蔽项

`POST`

`https://www.pixiv.net/ajax/mute/items/delete`

body 同上。