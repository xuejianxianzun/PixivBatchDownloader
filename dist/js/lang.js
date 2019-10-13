"use strict";
const xzLang = {
    // 在属性名前面加上下划线，和文本内容做出区别。{}表示需要进行替换的部分
    _只下载已收藏: [
        '只下载已收藏',
        'ブックマークのみをダウンロードする',
        'Download only bookmarked works',
        '只下載已收藏'
    ],
    _只下载已收藏的提示: [
        '只下载已经收藏的作品',
        '既に収集された作品のみをダウンロードする',
        'Download only bookmarked works',
        '只下載已經收藏的作品'
    ],
    _下载作品类型: [
        '下载作品类型',
        '作品タイプをダウンロードする',
        'Download work type',
        '下載作品類型'
    ],
    _下载作品类型的提示Center: [
        '下载哪些类型的作品',
        'ダウンロードする作品の種類',
        'Which types of works to download',
        '下載哪些類型的作品'
    ],
    _多p下载前几张: [
        '设置作品张数',
        '作品ごとにダウンロードされた画像の数',
        'Number of images downloaded per work',
        '設定作品張數'
    ],
    _多p下载前几张提示: [
        '下载每个作品的前几张图片。默认值 0 表示全部下载。',
        '各作品の最初の数枚の写真をダウンロードしてください。 デフォルト値の 0 は、すべてのダウンロードを意味します。',
        'Download the first few pictures of each piece. The default value of 0 means all downloads.',
        '下載每個作品的前幾張圖片。預設值 0 表示全部下載。'
    ],
    _不能含有tag: [
        '不能含有 tag',
        '指定したタグを除外する',
        'Exclude specified tag',
        '不能含有 tag'
    ],
    _排除tag的提示文字: [
        '您可在下载前设置要排除的tag，这样在下载时将不会下载含有这些tag的作品。不区分大小写；如需排除多个tag，请使用英文逗号分隔。请注意要排除的tag的优先级大于要包含的tag的优先级。',
        "ダウンロードする前に、除外するタグを設定できます。大文字と小文字を区別しない；複数のタグを設定する必要がある場合は、','を分けて使用できます。除外されたタグは、含まれているタグよりも優先されます",
        "Before downloading, you can set the tag you want to exclude. Not case sensitive; If you need to set multiple tags, you can use ',' separated. The excluded tag takes precedence over the included tag",
        '您可在下載前設定要排除的tag，這樣在下載時將不會下載含有這些tag的作品。不區分大小寫；如需排除多個tag，請使用英文逗號分隔。請注意要排除的tag的優先等級大於要包含的tag的優先等級。'
    ],
    _设置了排除tag之后的提示: [
        '排除 tag：',
        'タグを除外：',
        'Excludes tag: ',
        '排除 tag：'
    ],
    _必须含有tag: [
        '必须含有 tag&nbsp;',
        'タグを含める必要があります',
        'Must contain tag',
        '必須含有 tag&nbsp;'
    ],
    _必须tag的提示文字: [
        '您可在下载前设置作品里必须包含的tag，不区分大小写；如需包含多个tag，请使用英文逗号分隔。',
        "ダウンロードする前に、含まれなければならないタグを設定することができます。大文字と小文字を区別しない；複数のタグを設定する必要がある場合は、','を分けて使用できます。",
        "Before downloading, you can set the tag that must be included. Not case sensitive; If you need to set multiple tags, you can use ',' separated. ",
        '您可在下載前設定作品裡必須包含的tag，不區分大小寫；如需包含多個tag，請使用英文逗號分隔。'
    ],
    _设置了必须tag之后的提示: [
        '包含 tag：',
        'タグを含める：',
        'Include tag: ',
        '包含 tag：'
    ],
    _筛选宽高的按钮文字: [
        '设置宽高条件',
        '幅と高さの条件を設定する',
        'Set the width and height',
        '設定寬高條件'
    ],
    _筛选宽高的按钮Title: [
        '在下载前，您可以设置要下载的图片的宽高条件。',
        'ダウンロードする前に、ダウンロードする写真の幅と高さの条件を設定できます。',
        'Before downloading, you can set the width and height conditions of the pictures you want to download.',
        '在下載前，您可以設定要下載的圖片的寬高條件。'
    ],
    _设置宽高比例: [
        '设置宽高比例',
        '縦横比を設定する',
        'Set the aspect ratio',
        '設定寬高比例'
    ],
    _设置宽高比例Title: [
        '设置宽高比例，也可以手动输入宽高比',
        '縦横比を設定するか、手動で縦横比を入力します',
        'Set the aspect ratio, or manually type the aspect ratio',
        '設定寬高比，也可以手動輸入寬高比'
    ],
    _不限制: ['不限制', '無制限', 'not limited', '不限制'],
    _横图: ['横图', '横方向の絵', 'Horizontal picture', '橫圖'],
    _竖图: ['竖图', '縦方向の絵', 'Vertical picture', '豎圖'],
    _输入宽高比: ['宽高比 >=', '縦横比 >=', 'Aspect ratio >=', '寬高比 >='],
    _设置了宽高比之后的提示: [
        '宽高比：{}',
        'アスペクト比：{}',
        'Aspect ratio: {}',
        '寬高比：{}'
    ],
    _宽高比必须是数字: [
        '宽高比必须是数字',
        '縦横比は数値でなければなりません',
        'The aspect ratio must be a number',
        '寬高比必須是數字'
    ],
    _筛选宽高的提示文字: [
        '请输入最小宽度和最小高度，不会下载不符合要求的图片。',
        '最小幅と最小高さを入力してください。要件を満たしていない画像はダウンロードされません。',
        'Please type the minimum width and minimum height. Will not download images that do not meet the requirements',
        '請輸入最小寬度和最小高度，不會下載不符合要求的圖片。'
    ],
    _本次输入的数值无效: [
        '本次输入的数值无效',
        '無効な入力',
        'Invalid input',
        '本次輸入的數值無效'
    ],
    _设置了筛选宽高之后的提示文字p1: [
        '宽度 >= ',
        '幅 >= ',
        'Width >= ',
        '寬度 >= '
    ],
    _或者: [' 或者 ', ' または ', ' or ', ' 或是 '],
    _并且: [' 并且 ', ' そして ', ' and ', ' 並且 '],
    _高度设置: ['高度 >= ', '高さ >= ', 'height >= ', '高度 >= '],
    _个数: [
        '设置作品数量',
        '作品数を設定する',
        'Set the number of works',
        '設定作品數量'
    ],
    _页数: [
        '设置页面数量',
        'ページ数を設定する',
        'Set the number of pages',
        '設定頁面數量'
    ],
    _筛选收藏数的按钮文字: [
        '设置收藏数量',
        'お気に入りの数を設定する',
        'Set the bookmarkCount conditions',
        '設定收藏數量'
    ],
    _筛选收藏数的按钮Title: [
        '在下载前，您可以设置对收藏数量的要求。',
        'ダウンロードする前に、お気に入り数の要件を設定することができます。',
        'Before downloading, You can set the requirements for the number of bookmarks.',
        '在下載前，您可以設定對收藏數量的要求。'
    ],
    _筛选收藏数Center: [
        '设置收藏数量',
        'ブックマークの数を設定する',
        'Set the number of bookmarks',
        '設定收藏數量'
    ],
    _筛选收藏数的提示Center: [
        '如果作品的收藏数小于设置的数字，作品不会被下载。',
        '作品のブックマークの数が設定された数よりも少ない場合、作品はダウンロードされません。',
        'If the number of bookmarks of the work is less than the set number, the work will not be downloaded.',
        '如果作品的收藏數小於設定的數字，作品不會被下載。'
    ],
    _筛选收藏数的提示文字: [
        '请输入一个数字，如果作品的收藏数小于这个数字，作品不会被下载。',
        '数字を入力してください。 作品のブックマークの数がこの数より少ない場合、作品はダウンロードされません。',
        'Please type a number. If the number of bookmarks of the work is less than this number, the work will not be downloaded.',
        '請輸入一個數字，如果作品的收藏數小於這個數字，作品不會被下載。'
    ],
    _设置了筛选收藏数之后的提示文字: [
        '收藏数 >= ',
        'お気に入りの数 >= ',
        'Number of bookmarks >= ',
        '收藏數 >= '
    ],
    _本次任务已全部完成: [
        '本次任务已全部完成。',
        'このタスクは完了しました。',
        'This task has been completed.',
        '本次工作已全部完成'
    ],
    _当前任务尚未完成1: [
        '当前任务尚未完成，请等到提示完成之后再设置新的任务。',
        '現在のタスクはまだ完了していません。お待ちください。',
        'The current task has not yet completed, please wait.',
        '目前工作尚未完成，請等到提示完成之後再設定新的工作。'
    ],
    _本次任务条件: [
        '本次任务条件: ',
        'このタスク条件：',
        'This task condition: ',
        '本次工作條件：'
    ],
    _checkWantPageRule1Arg2: [
        '参数不合法，本次操作已取消。',
        'パラメータは有効ではありません。この操作はキャンセルされました。',
        'Parameter is not legal, this operation has been canceled.',
        '參數不合法，本次動作已取消。'
    ],
    _checkWantPageRule1Arg3: [
        '从本页开始下载-num-个作品',
        'このページから-num-枚の作品をダウンロード。',
        'Download -num- works from this page.',
        '從本頁開始下載-num-個作品'
    ],
    _checkWantPageRule1Arg4: [
        '向下获取所有作品',
        'このページからすべての作品をダウンロードする。',
        'download all the work from this page.',
        '向下取得所有作品'
    ],
    _checkWantPageRule1Arg5: [
        '从本页开始下载<br>如果不限制下载的页数，请不要修改此默认值。<br>如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
        'このページからダウンロードする<br>ダウンロードしたページ数を制限しない場合は、デフォルト値のままにしておきます。<br>ダウンロードするページ数を設定する場合は、1から始まる番号を入力します。 現在のページは1です。',
        'Download from this page<br>If you do not limit the number of pages downloaded, leave the default value.<br>If you want to set the number of pages to download, type a number starting at 1. This page is 1.',
        '從本頁開始下載<br>如果不限制下載的頁數，請不要變更此預設值。<br>如果要限制下載的頁數，請輸入從1開始的數字，1為僅下載本頁。'
    ],
    _checkWantPageRule1Arg8: [
        '从本页开始下载<br>如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
        'このページからダウンロードする<br>ダウンロードするページ数を設定する場合は、1から始まる番号を入力します。 現在のページは1です。',
        'Download from this page<br>If you want to set the number of pages to download, type a number starting at 1. This page is 1.',
        '從本頁開始下載<br>如果要限制下載的頁數，請輸入從1開始的數字，1為僅下載本頁。'
    ],
    _checkWantPageRule1Arg6: [
        '从本页开始下载-num-页',
        '現在のページから-num-ページ',
        'download -num- pages from the current page',
        '從本頁開始下載-num-頁'
    ],
    _checkWantPageRule1Arg7: [
        '下载所有页面',
        'すべてのページをダウンロード',
        'download all pages',
        '下載所有頁面'
    ],
    _checkWantPageRule1Arg9: [
        '下载 -num- 个相关作品',
        '関連作品 -num- 点をダウンロードする。',
        'download -num- related works.',
        '下載 -num- 個相關作品'
    ],
    _checkWantPageRule1Arg10: [
        '下载所有相关作品',
        '関連作品をすべてダウンロード。',
        'download all related works.',
        '下載所有相關作品'
    ],
    _checkWantPageRule1Arg11: [
        '下载推荐作品',
        'お勧め作品をダウンロードする',
        'download recommend works',
        '下載推薦作品'
    ],
    _checkWantPageRule1Arg12: [
        '下载排行榜前 -num- 个作品',
        'リーダーボードの上位 -num- 作品をダウンロードする。',
        'download the top -num- works in the ranking list',
        '下載排行榜前 -num- 個作品'
    ],
    _请输入最低收藏数和要抓取的页数: [
        '请输入最低收藏数和要抓取的页数，用英文逗号分开。\n类似于下面的形式: \n1000,1000',
        "お気に入りの最小数とクロールするページ数を，','で区切って入力してください。\n例えば：\n1000,1000",
        "Please type the minimum number of bookmarks, and the number of pages to be crawled, separated by ','.\nE.g:\n1000,1000",
        '請輸入最低收藏數和要擷取的頁數，用英文逗號分開。\n類似於下面的形式: \n1000,1000'
    ],
    _参数不合法1: [
        '参数不合法，请稍后重试。',
        'パラメータが有効ではありません。後でやり直してください。',
        'Parameter is not legal, please try again later.',
        '參數不合法，請稍後重試。'
    ],
    _wantPage弹出框文字PageType10: [
        '您想要下载多少页？请输入数字。\r\n当前模式下，列表页的页数最多只有',
        'ダウンロードしたいページ数を入力してください。 \r\n最大値：',
        'Please type the number of pages you want to download.\r\n The maximum value is ',
        '您想要下載多少頁？請輸入數字。\r\n目前模式下，清單頁的頁數最多只有'
    ],
    _输入超过了最大值: [
        '您输入的数字超过了最大值',
        '入力した番号が最大値を超えています',
        'The number you entered exceeds the maximum',
        '您輸入的數字超過了最大值'
    ],
    _作品张数提醒: [
        '下载每个作品的前 {} 张图片',
        '各作品の上位 {} つの画像をダウンロードする',
        'Download the first {} images of each work',
        '下載每個作品的前 {} 張圖片'
    ],
    _任务开始1: [
        '从本页开始下载{}页',
        'このページから{}ページをダウンロードする',
        'download {} pages from this page',
        '從本頁開始下載{}頁'
    ],
    _任务开始0: [
        '任务开始',
        'タスクが開始されます。',
        'Task starts.',
        '工作開始'
    ],
    _checkNotdownTypeResult1弹窗: [
        '由于您排除了所有作品类型，本次任务已取消。',
        'すべての種類の作業を除外したため、タスクはキャンセルされました。',
        'Because you excluded all types of work, the task was canceled.',
        '由於您排除了所有作品類型，本次工作已取消。'
    ],
    _checkNotdownTypeResult1Html: [
        '排除作品类型的设置有误，任务取消!',
        '作業タイプの除外にエラー設定がありました。 タスクがキャンセルされました。',
        'There was an error setting for the exclusion of the work type. Task canceled.',
        '排除作品類型的設定有誤，工作取消!'
    ],
    _checkNotdownTypeResult2弹窗: [
        '由于作品类型的设置有误，本次任务已取消。',
        '除外タイプを設定する際にエラーが発生しました。 タスクがキャンセルされました。',
        'There was an error setting for the exclusion of the work type. Task canceled.',
        '由於作品類型的設定有誤，本次工作已取消。'
    ],
    _checkNotdownTypeResult3Html: [
        '排除作品类型：',
        'これらのタイプの作品を除外します：',
        'Excludes these types of works: ',
        '排除作品類型：'
    ],
    _单图: ['单图 ', '1枚の作品', 'one images', '單圖 '],
    _多图: ['多图 ', '2枚以上の作品', 'multiple images', '多圖 '],
    _插画: ['插画 ', 'イラスト', 'Illustrations', '插畫 '],
    _漫画: ['漫画 ', '漫画', 'Manga', '漫畫 '],
    _动图: ['动图 ', 'うごくイラスト', 'Ugoira', '動圖 '],
    _动图保存格式: [
        '动图保存格式',
        'うごイラの作品を保存する',
        'Save the ugoira work as',
        '動圖儲存格式'
    ],
    _动图保存格式title: [
        '下载动图时，可以把它转换成视频文件',
        'あなたがうごイラ作品をダウンロードするとき、あなたはそれをビデオファイルに変換することができます。',
        'When you download a ugoira work, you can convert it to a video file.',
        '下載動圖時，可以將它轉換為影片檔案'
    ],
    _webmVideo: ['WebM 视频', 'WebM ビデオ', 'WebM video', 'WebM 視頻'],
    _gif: ['GIF 图片', 'GIF 画像', 'GIF picture', 'GIF 圖片'],
    _zipFile: ['Zip 文件', 'ZIP ファイル', 'Zip file', 'Zip 檔案'],
    _tag搜索页已抓取多少页: [
        '已抓取本次任务第{}/{}页，当前加载到第{}页',
        '{}/{}ページをクロールしています。 現在のページ番号は{}ページです',
        'Has been crawling {} / {} pages. The current page number is page {}',
        '已擷取本次工作第{}/{}頁，目前載入到第{}頁'
    ],
    _当前作品张数: [
        '当前有{}个作品。',
        '今は{}枚の作品があります。',
        'There are now {} works.',
        '目前有個{}作品。'
    ],
    _tag搜索页任务完成1: [
        '本次任务完成。',
        'この作業は完了です。',
        'This task is completed.',
        '本次工作完成。'
    ],
    _tag搜索页任务完成2: [
        '已抓取本tag的所有页面，本次任务完成。',
        'この作業は完了です。',
        'This task is completed.',
        '已擷取本tag的所有頁面，本次工作完成。'
    ],
    _tag搜索页中断: [
        '当前任务已中断!',
        '現在のタスクが中断されました。',
        'The current task has been interrupted.',
        '目前工作已中斷!'
    ],
    _排行榜进度: [
        '已抓取本页面第{}部分',
        'このページの第{}部がクロールされました',
        'Part {} of this page has been crawled',
        '已擷取本頁面第{}部分'
    ],
    _相关作品抓取完毕: [
        '相关作品抓取完毕。包含有{}张作品，开始获取作品信息。',
        '関連作品はクロールされました。 {}作品を含み、その作品に関する情報の取得を開始します。',
        'The related works have been crawled. Contains {} works and starts getting information about the work.',
        '相關作品擷取完畢。包含有{}張作品，開始取得作品資訊。'
    ],
    _排行榜任务完成: [
        '本页面抓取完毕。<br>当前有{}个作品，开始获取作品信息。',
        'このページはクロールされ。<br>{}個の作品があります。 詳細は作品を入手し始める。',
        'This page is crawled and now has {} works.<br> Start getting the works for more information.',
        '本頁面擷取完畢。<br>目前有{}個作品，開始取得作品資訊。'
    ],
    _列表页抓取进度: [
        '已抓取列表页{}个页面',
        '{}のリストページを取得しました',
        'Has acquired {} list pages',
        '已擷取清單頁{}個頁面'
    ],
    _列表页抓取完成: [
        '列表页面抓取完成，开始获取图片网址',
        'リストページがクロールされ、画像URLの取得が開始されます',
        'The list page is crawled and starts to get the image URL',
        '清單頁面擷取完成，開始取得圖片網址'
    ],
    _列表页抓取结果为零: [
        '抓取完毕，但没有找到符合筛选条件的作品。',
        'クロールは終了しましたが、フィルタ条件に一致する作品が見つかりませんでした。',
        'Crawl finished but did not find works that match the filter criteria.',
        '擷取完畢，但沒有找到符合篩選條件的作品。'
    ],
    _当前任务尚未完成2: [
        '当前任务尚未完成，请等待完成后再下载。',
        '現在のタスクはまだ完了していません',
        'The current task has not yet been completed',
        '目前工作尚未完成，請等待完成後再下載。'
    ],
    _列表抓取完成开始获取作品页: [
        '当前列表中有{}张作品，开始获取作品信息',
        '{}個の作品があります。 詳細は作品を入手し始める。',
        'Now has {} works. Start getting the works for more information.',
        '目前清單中有{}張作品，開始取得作品資訊'
    ],
    _开始获取作品页面: [
        '开始获取作品页面',
        '作品ページの取得を開始する',
        'Start getting the works page',
        '開始取得作品頁面'
    ],
    _无权访问1: [
        '无权访问{}，抓取中断。',
        'アクセス{}、中断はありません。',
        'No access {}, interruption.',
        '無權造訪{}，擷取中斷。'
    ],
    _无权访问2: [
        '无权访问{}，跳过该作品。',
        'アクセス{}、無視する。',
        'No access {}, skip.',
        '無權造訪{}，跳過該作品。'
    ],
    _作品页状态码0: [
        '请求的url不可访问',
        '要求されたURLにアクセスできません',
        'The requested url is not accessible',
        '要求的url無法造訪'
    ],
    _作品页状态码400: [
        '该作品已被删除',
        '作品は削除されました',
        'The work has been deleted',
        '該作品已被刪除'
    ],
    _作品页状态码403: [
        '无权访问请求的url 403',
        'リクエストされたURLにアクセスできない 403',
        'Have no access to the requested url 403',
        '無權造訪要求的url 403'
    ],
    _作品页状态码404: [
        '404 not found',
        '404 not found',
        '404 not found',
        '404 not found'
    ],
    _抓取图片网址的数量: [
        '已获取{}个图片网址',
        '{}つの画像URLを取得',
        'Get {} image URLs',
        '已取得{}個圖片網址'
    ],
    _正在抓取: [
        '正在抓取，请等待……',
        '取得中、しばらくお待ちください...',
        'Getting, please wait...',
        '正在擷取，請等待……'
    ],
    _获取全部书签作品: [
        '获取全部书签作品，时间可能比较长，请耐心等待。',
        'ブックマークしたすべての作品を入手すると、時間がかかることがあります。お待ちください。',
        'Get all bookmarked works, the time may be longer, please wait.',
        '取得全部書籤作品，時間可能比較長，請耐心等待。'
    ],
    _抓取图片网址遇到中断: [
        '当前任务已中断!',
        '現在のタスクが中断されました。',
        'The current task has been interrupted.',
        '目前工作已中斷!'
    ],
    _关闭: ['关闭', 'クローズ', 'close', '關閉'],
    _输出信息: ['输出信息', '出力情報', 'Output information', '輸出資訊'],
    _复制: ['复制', 'コピー', 'Copy', '複製'],
    _已复制到剪贴板: [
        '已复制到剪贴板，可直接粘贴',
        'クリップボードにコピーされました',
        'Has been copied to the clipboard',
        '已複製至剪貼簿，可直接貼上'
    ],
    _下载设置: [
        '下载设置',
        '設定をダウンロードする',
        'Download settings',
        '下載設定'
    ],
    _收起展开设置项: [
        '收起/展开设置项',
        '設定の折りたたみ/展開',
        'Collapse/expand settings',
        '摺疊/展開設定項目'
    ],
    _github: [
        'Github 页面，欢迎 star',
        'Githubのページ、starをクリックしてください',
        'Github page, if you like, please star it',
        'Github 頁面，歡迎 star'
    ],
    _wiki: ['使用说明', '使用説明書', 'Wiki', 'Wiki'],
    _快捷键切换显示隐藏: [
        '使用 Alt + X，可以显示和隐藏下载面板',
        'Alt + Xを使用してダウンロードパネルを表示および非表示にする',
        'Use Alt + X to show and hide the download panel',
        '使用 Alt + X，可以顯示和隱藏下載面板'
    ],
    _设置命名规则3: [
        '共抓取到 {} 个图片',
        '合計 {} 枚の画像を取得し',
        'Crawl a total of {} pictures',
        '共擷取到 {} 個圖片'
    ],
    _设置文件名: [
        '设置命名规则',
        '命名規則を設定する',
        'Set naming rules',
        '設定命名規則'
    ],
    _设置文件夹名的提示: [
        `可以使用 '/' 建立文件夹<br>示例：{p_title}/{user}/{id}`,
        `フォルダは '/'で作成できます<br>例：{p_title}/{user}/{id}`,
        `You can create a folder with '/'<br>Example：{p_title}/{user}/{id}`,
        `可以使用 '/' 建立資料夾<br>範例：{p_title}/{user}/{id}`
    ],
    _添加字段名称: [
        '添加字段名称',
        'フィールド名を追加',
        'Add field name',
        '加入欄位名稱'
    ],
    _添加字段名称提示: [
        '例如，在用户名前面添加“user_”标记',
        'たとえば、ユーザー名の前に "user_"タグを追加します。',
        'For example, add the "user_" tag in front of the username',
        '例如，在使用者名稱前面加入“user_”標記'
    ],
    _查看标记的含义: [
        '查看标记的含义',
        'タグの意味を表示する',
        'View the meaning of the tag',
        '檢視標記的意義'
    ],
    _命名标记1: [
        '默认文件名，如 44920385_p0',
        'デフォルトのファイル名，例 44920385_p0',
        'Default file name, for example 44920385_p0',
        '預設檔案名稱，如 44920385_p0'
    ],
    _命名标记2: ['作品标题', '作品のタイトル', 'works title', '作品標題'],
    _命名标记3: [
        '作品的 tag 列表',
        '作品の tags',
        'The tags of the work',
        '作品的 tag 清單'
    ],
    _命名标记4: ['画师名字', 'アーティスト名', 'Artist name', '畫師名稱'],
    _命名标记6: ['画师 id', 'アーティスト ID', 'Artist id', '畫師 id'],
    _命名标记7: ['宽度和高度', '幅と高さ', 'width and height', '寬度和高度'],
    _命名标记8: [
        'bookmark-count，作品的收藏数。把它放在最前面可以让文件按收藏数排序。',
        'bookmark-count，作品のコレクション数のコレクション数は。',
        'bookmark-count, bookmarks number of works.',
        'bookmark-count，作品的收藏數。將它放在最前面可以讓檔案依收藏數排序。'
    ],
    _命名标记9: [
        '数字 id，如 44920385',
        '44920385 などの番号 ID',
        'Number id, for example 44920385',
        '數字 id，如 44920385'
    ],
    _命名标记10: [
        '图片在作品内的序号，如 0、1、2 …… 每个作品都会重新计数。',
        '0、1、2 など、作品の写真のシリアル番号。各ピースは再集計されます。',
        'The serial number of the picture in the work, such as 0, 1, 2 ... Each work will be recounted.',
        '圖片在作品內的序號，如 0、1、2 …… 每個作品都將重新計數。'
    ],
    _命名标记11: [
        '作品的 tag 列表，附带翻译后的 tag（如果有）',
        '作品のtagリスト、翻訳付きtag(あれば)',
        'The tags of the work, with the translated tag (if any)',
        '作品的 tag 清單，附帶翻譯後的 tag（若有的話）'
    ],
    _命名标记12: [
        '作品的创建日期，格式为 yyyy-MM-dd。如 2019-08-29',
        '作品の作成日はyyyy-MM-ddの形式でした。 2019-08-29 など',
        'The date the creation of the work was in the format yyyy-MM-dd. Such as 2019-08-29',
        '作品的建立日期，格式為 yyyy-MM-dd。如 2019-08-29'
    ],
    _命名标记13: [
        '作品在排行榜中的排名。如 #1、#2 ……',
        'リーダーボードでの作品のランキング。 ＃1、＃2 など ...',
        'The ranking of the work in the ranking list. Such as #1, #2 ...',
        '作品在排行榜中的排名，如 #1、#2 ……'
    ],
    _命名标记14: [
        '作品类型，分为 illustration、manga、ugoira',
        '作品分類は、illustration、manga、ugoira',
        'The type of work, divided into illustration, manga, ugoira',
        '作品類型，分为 illustration、manga、ugoira'
    ],
    _命名标记提醒: [
        '您可以使用多个标记；建议在不同标记之间添加分割用的字符。示例：{id}-{userid}<br>一定要包含 {id} 或者 {id_num}。<br>* 在某些情况下，会有一些标记不可用。',
        '複数のタグを使用することができ；異なるタグ間に別の文字を追加することができます。例：{id}-{userid}<br>必ず{id}または{id_num}を含めてください。<br>* 場合によっては、一部のタグが利用できず。',
        'You can use multiple tags, and you can add a separate character between different tags. Example: {id}-{userid}<br>Be sure to include {id} or {id_num}.<br>* In some cases, some tags will not be available.',
        '您可以使用多個標記；建議在不同標記之間加入分隔用的字元。範例：{id}-{userid}<br>一定要包含 {id} 或者 {id_num}。<br>* 在某些情況下，會有一些標記不可用。'
    ],
    _文件夹标记PUser: [
        '当前页面的画师名字',
        'アーティスト名',
        'Artist name of this page',
        '目前頁面的畫師名稱'
    ],
    _文件夹标记PUid: [
        '当前页面的画师id',
        'アーティストID',
        'Artist id of this page',
        '目前頁面的畫師id'
    ],
    _文件夹标记PTag: [
        '当前页面的 tag',
        '現在のタグ',
        'Current tag',
        '目前頁面的 tag'
    ],
    _文件夹标记PTitle: [
        '当前页面的标题',
        'ページのタイトル',
        'The title of this page',
        '目前頁面的標題'
    ],
    _预览文件名: [
        '预览文件名',
        'ファイル名のプレビュー',
        'Preview file name',
        '預覽檔案名稱'
    ],
    _设置下载线程: [
        '设置下载线程',
        'ダウンロードスレッドを設定する',
        'Set the download thread',
        '設定下載執行緒'
    ],
    _线程数字: [
        '可以输入 1-5 之间的数字，设置同时下载的数量',
        '同時ダウンロード数を設定するには、1〜5 の数値を入力します',
        'You can type a number between 1-5 to set the number of concurrent downloads',
        '可以輸入 1-5 之間的數字，設定同時下載的數量'
    ],
    _下载按钮1: ['开始下载', 'ダウンロードを開始', 'start download', '開始下載'],
    _下载按钮2: [
        '暂停下载',
        'ダウンロードを一時停止',
        'pause download',
        '暫停下載'
    ],
    _下载按钮3: ['停止下载', 'ダウンロードを停止', 'stop download', '停止下載'],
    _下载按钮4: ['复制 url', 'URLをコピー', 'copy urls', '複製url'],
    _当前状态: ['当前状态 ', '現在の状態 ', 'Now state ', '目前狀態 '],
    _未开始下载: [
        '未开始下载',
        'まだダウンロードを開始していません',
        'Not yet started downloading',
        '未開始下載'
    ],
    _下载进度: [
        '下载进度：',
        'ダウンロードの進捗状況：',
        'Download progress: ',
        '下載進度：'
    ],
    _下载线程: ['下载线程：', 'スレッド：', 'Thread: ', '下載執行緒：'],
    _查看下载说明: [
        '查看下载说明',
        '指示の表示',
        'View instructions',
        '檢視下載說明'
    ],
    _下载说明: [
        "下载的文件保存在浏览器的下载目录里。<br>请不要在浏览器的下载选项里选中'总是询问每个文件的保存位置'。<br>如果作品标题或tag里含有不能做文件名的字符，会被替换成下划线_。<br>如果文件名超长，将会被截断。<br><b>如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展。</b><br>QQ群：499873152",
        'ダウンロードしたファイルは、ブラウザのダウンロードディレクトリに保存されます。<br>ファイル名が長いと裁断される。<br><b>ダウンロード後のファイル名が異常な場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。</b>',
        'The downloaded file is saved in the browser`s download directory. <br>If the file name is too long, it will be truncated.<br><b>If the file name after downloading is abnormal, disable other browser extensions that have download capabilities.</b>',
        "下載的檔案儲存在瀏覽器的下載目錄裡。<br>請不要在瀏覽器的下載選項裡選取'總是詢問每個檔案的儲存位置'。<br>如果作品標題或tag裡含有不能做檔名的字元，會被取代為下劃線_。<br>如果檔名過長，將會被截斷。<br><b>如果下載後的檔案名稱異常，請停用其他有下載功能的瀏覽器擴充功能。</b><br>QQ群：499873152"
    ],
    _正在下载中: ['正在下载中', 'ダウンロード中', 'downloading', '正在下載'],
    _下载完毕: [
        '√ 下载完毕!',
        '√ ダウンロードが完了しました',
        '√ Download finished',
        '√ 下載完畢!'
    ],
    _已暂停: [
        '下载已暂停',
        'ダウンロードは一時停止中です',
        'Download is paused',
        '下載已暫停'
    ],
    _已停止: [
        '下载已停止',
        'ダウンロードが停止しました',
        'Download stopped',
        '下載已停止'
    ],
    _已下载: ['已下载', 'downloaded', 'downloaded', '已下載'],
    _没有符合条件的作品: [
        '没有符合条件的作品！',
        '基準を満たす作品はありません！',
        'There are no works that meet the criteria!',
        '沒有符合條件的作品！'
    ],
    _抓取完毕: [
        '抓取完毕！',
        'クロールが終了しました！',
        'Crawl finished!',
        '擷取完畢！'
    ],
    _快速下载本页: [
        '快速下载本页作品',
        'この作品をすばやくダウンロードする',
        'Download this work quickly',
        '快速下載本頁作品'
    ],
    _从本页开始抓取new: [
        '从本页开始抓取新作品',
        'このページから新しい作品を入手する',
        'Crawl the new works from this page',
        '從本頁開始擷取新作品'
    ],
    _从本页开始抓取old: [
        '从本页开始抓取旧作品',
        'このページから古い作品を入手する',
        'Crawl the old works from this page',
        '從本頁開始擷取舊作品'
    ],
    _抓取推荐作品: [
        '抓取推荐作品',
        '推奨作品をダウンロードする',
        'Crawl the recommend works',
        '擷取推薦作品'
    ],
    _抓取推荐作品Title: [
        '抓取页面底部的的推荐作品',
        'ページの下部で推奨作品をクロールします',
        'Crawl the recommended works at the bottom of the page',
        '擷取頁面底部的推薦作品'
    ],
    _抓取相关作品: [
        '抓取相关作品',
        '関連作品をダウンロードする',
        'Crawl the related works',
        '擷取相關作品'
    ],
    _相关作品大于0: [
        ' （下载相关作品必须大于 0）',
        ' （ダウンロードする関連作品の数は0より大きくなければならない）',
        '  (Download related works must be greater than 0)',
        ' （下載相關作品必須大於 0）'
    ],
    _默认下载多页: [
        ', 如有多页，默认会下载全部。',
        '複数のページがある場合、デフォルトでダウンロードされます。',
        ', If there are multiple pages, the default will be downloaded.',
        ', 如有多頁，預設會下載全部。'
    ],
    _调整完毕: [
        '调整完毕，当前有{}个作品。',
        '調整が完了し、今、{}の作品があります。',
        'The adjustment is complete and now has {} works.',
        '調整完畢，目前有{}個作品。'
    ],
    _开始筛选: [
        '开始筛选',
        'スクリーニングを開始',
        'Start screening',
        '開始篩選'
    ],
    _开始筛选Title: [
        '按照设定来筛选当前tag里的作品。如果多次筛选，页码会一直累加。',
        '現在のタグで作品をフィルタリングする。複数回フィルタリングすると、ページ番号は常に累積されます。',
        'Filter the work in the current tag. If you filter multiple times, the page number will increase.',
        '按照設定來篩選當前tag裡的作品。如果多次篩選，頁碼會一直累加。'
    ],
    _在结果中筛选: [
        '在结果中筛选',
        '結果のフィルタリング',
        'Filter in results',
        '在結果中篩選'
    ],
    _在结果中筛选Title: [
        '如果本页筛选后作品太多，可以提高收藏数的要求，在结果中筛选。达不到要求的会被隐藏而不是删除。所以您可以反复进行筛选。被隐藏的项目不会被下载。',
        'あなたは何度も選別することができて、要求の作品が隠されて、それからダウンロードされません。',
        'You can make multiple screening , fail to meet the required works will be hidden, and will not be downloaded.',
        '如果本頁篩選後作品太多，可以提高收藏數的要求，在結果中篩選。達不到要求的會被隱藏而不是刪除。所以您可以反覆進行篩選。被隱藏的項目不會被下載。'
    ],
    _在结果中筛选弹窗: [
        '将在当前作品列表中再次过滤，请输入要求的最低收藏数: ',
        '現在の作品リストで再度フィルタリングされます。要求された作品の最小数を入力してください',
        'Will be filtered again in the current list of works. Please type the required minimum number of bookmarks:',
        '將在目前作品清單中再次篩選，請輸入要求的最低收藏數:'
    ],
    _抓取当前作品: [
        '抓取当前作品',
        '現在の作品をクロールする',
        'Crawl the current work',
        '擷取目前作品'
    ],
    _抓取当前作品Title: [
        '抓取当前列表里的所有作品',
        '現在のリスト内のすべての作品をクロールする',
        'Crawl all the works in the current list',
        '擷取目前清單裡的所有作品'
    ],
    _中断当前任务: [
        '中断当前任务',
        '現在のタスクを中断する',
        'Interrupt the current task',
        '中斷目前工作'
    ],
    _中断当前任务Title: [
        '筛选时中断之后可以继续执行。',
        'ふるい分け作品で中断され、その後引き続き実行可能です。',
        'In the screening works when the break, then you can continue to perform.',
        '篩選時中斷之後可以繼續執行。'
    ],
    _当前任务已中断: [
        '当前任务已中断!',
        '現在のタスクが中断されました',
        'The current task has been interrupted',
        '目前工作已中斷!'
    ],
    _清除多图作品: [
        '清除多图作品',
        '複数の作品を削除する',
        'Remove multi-drawing works',
        '清除多圖作品'
    ],
    _清除多图作品Title: [
        '如果不需要可以清除多图作品',
        '必要がない場合は、複数のグラフを削除することができます',
        'If you do not need it, you can delete multiple graphs',
        '如果不需要可以清除多圖作品'
    ],
    _清除动图作品: [
        '清除动图作品',
        'うごイラ作品を削除する',
        'Remove ugoira work',
        '清除動圖作品'
    ],
    _清除动图作品Title: [
        '如果不需要可以清除动图作品',
        '必要がない場合は、うごイラを削除することができます',
        'If you do not need it, you can delete the ugoira work',
        '如果不需要可以清除動圖作品'
    ],
    _手动删除作品: [
        '手动删除作品',
        '作品を手動で削除する',
        'Manually delete the work',
        '手動刪除作品'
    ],
    _手动删除作品Title: [
        '可以在下载前手动删除不需要的作品',
        'ダウンロードする前に不要な作品を手動で削除することができます',
        'You can manually delete unwanted work before downloading',
        '可以在下載前手動刪除不需要的作品'
    ],
    _退出手动删除: [
        '退出手动删除',
        '削除モードを終了する',
        'Exit manually delete',
        '結束手動刪除'
    ],
    _抓取本页作品: [
        '抓取本页作品',
        'このページをクロールする',
        'Crawl this page works',
        '擷取本頁作品'
    ],
    _抓取本页作品Title: [
        '抓取本页列表中的所有作品',
        'このページをクロールする',
        'Crawl this page works',
        '擷取本頁清單中的所有作品'
    ],
    _抓取本排行榜作品: [
        '抓取本排行榜作品',
        'このリストの作品をクロールする',
        'Crawl the works in this list',
        '擷取本排行榜作品'
    ],
    _抓取本排行榜作品Title: [
        '抓取本排行榜的所有作品，包括现在尚未加载出来的。',
        'まだ読み込まれていないものを含めて、このリストの作品をダウンロードする',
        'Crawl all of the works in this list, including those that are not yet loaded.',
        '擷取本排行榜的所有作品，包括現在尚未載入出來的。'
    ],
    _抓取首次登场的作品: [
        '抓取首次登场作品',
        '初登場作品をダウンロードする',
        'Crawl the debut works',
        '擷取首次登場作品'
    ],
    _抓取首次登场的作品Title: [
        '只下载首次登场的作品',
        '初登場作品のみダウンロードします',
        'Download only debut works',
        '只下載首次登場的作品'
    ],
    _抓取该页面的图片: [
        '抓取该页面的图片',
        'ページの画像をクロールする',
        'Crawl the picture of the page',
        '擷取該頁面的圖片'
    ],
    _抓取相似图片: [
        '抓取相似图片',
        '類似の作品をクロールする',
        'Crawl similar works',
        '擷取相似圖片'
    ],
    _要获取的作品个数2: [
        '您想要获取多少个作品？',
        'いくつの作品をダウンロードしたいですか？',
        'How many works do you want to download?',
        '您想要取得多少個作品？'
    ],
    _数字提示1: [
        '-1, 或者大于 0',
        '-1、または0より大きい',
        '-1, or greater than 0',
        '-1, 或是大於 0'
    ],
    _下载大家的新作品: [
        '下载大家的新作品',
        'みんなの新作をダウンロードする',
        'Download everyone`s new work',
        '下載大家的新作品'
    ],
    _屏蔽设定: ['屏蔽設定', 'ミュート設定', 'Mute settings', '封鎖設定'],
    _举报: ['举报', '報告', 'Report', '回報'],
    _输入id进行抓取: [
        '输入id进行抓取',
        'IDを入力してダウンロードする',
        'Enter id to fetch',
        '輸入id進行擷取'
    ],
    _输入id进行抓取的提示文字: [
        '请输入作品id。如果有多个id，则以换行分割（即每行一个id）',
        'イラストレーターIDを入力してください。 複数のidがある場合は、1行に1つのidを付けます。',
        'Please type the illustration id. If there is more than one id, one id per line.',
        '請輸入作品id。如果有多個id，則以換行分隔（即每行一個id）'
    ],
    _开始抓取: ['开始抓取', 'クロールを開始する', 'Start crawling', '開始擷取'],
    _添加tag: [
        '给未分类作品添加 tag',
        '未分類の作品にタグを追加',
        'Add tag to unclassified work',
        '幫未分類的作品加入 tag'
    ],
    _id不合法: [
        'id不合法，操作取消。',
        'idが不正な、操作はキャンセルされます。',
        'id is illegal, the operation is canceled.',
        'id不合法，動作取消。'
    ],
    _快速收藏: [
        '快速收藏',
        'クイックブックマーク',
        'Quick bookmarks',
        '快速收藏'
    ],
    _显示: ['显示', '表示', 'display', '顯示'],
    _是否显示封面: [
        '是否显示封面',
        'カバーを表示するかどうか',
        'Whether to display the cover',
        '是否顯示封面'
    ],
    _显示封面的提示: [
        '如果搜索结果数量很多，封面图数量也会很多。如果加载大量的封面图，会占用很多网络资源，也可能导致任务异常中断。如果遇到了这种情况，取消选中这个按钮。',
        '検索結果の数が多い場合は、表紙画像の数が多くなります。 大量の表紙画像を読み込むと、ネットワークリソースが膨大になり、異常なタスクの中断を引き起こす可能性があります。 このような場合は、このボタンのチェックを外す。',
        'If the number of search results is large, the number of cover images will be many. If you load a large number of cover images, it will take up a lot of network resources, and it may cause abnormal interruption of tasks. If this happens, uncheck the button.',
        '如果搜尋結果數量很多，封面圖數量也會很多。如果載入大量的封面圖，會占用很多網路資源，也可能導致工作異常中斷。如果遇到了這種情況，取消選取這個按鈕。'
    ],
    _启用: ['启用', '有効にする', 'Enable', '啟用'],
    _是否自动下载: [
        '是否自动下载',
        '自動的にダウンロードするかどうか',
        'Whether to download automatically',
        '是否自動下載'
    ],
    _快速下载的提示: [
        '当“开始下载”状态可用时，自动开始下载，不需要点击下载按钮。',
        '「ダウンロードを開始する」ステータスが利用可能になると、ダウンロードは自動的に開始され、ダウンロードボタンをクリックする必要はありません。',
        'When the &quot;Start Downloa&quot; status is available, the download starts automatically and no need to click the download button.',
        '當“開始下載”狀態可用時，自動開始下載，不需要點選下載按鈕。'
    ],
    _转换任务提示: [
        '正在转换 {} 个文件',
        '{} ファイルの変換',
        'Converting {} files',
        '正在轉換 {} 個檔案'
    ],
    _最近更新: ['最近更新', '最近更新する', 'What`s new', '最近更新'],
    _确定: ['确定', '確定', 'Ok', '確定'],
    _file404: [
        '404 错误：文件 {} 不存在。',
        '404エラー：ファイル {} は存在しません。',
        '404 error: File {} does not exist.',
        '404 錯誤：檔案 {} 不存在。'
    ],
    _newver: [
        '有新版本可用',
        '新しいバージョンがあります',
        'A new version is available',
        '有新版本可用'
    ],
    _xzNew270: [
        '新增 {type} 标记，保存作品类型（illustration、manga、ugoira）。',
        '{type}マークを追加し,作品タイプ(illustration, manga, ugoira)を保存する。',
        'Add a {type} tag to save the type of work (illustration, manga, ugoira).',
        '新增 {type} 標記，儲存作品類型（illustration、manga、ugoira）。'
    ]
};
