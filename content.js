/*
 * project: PixivBatchDownloader
 * build:   5.7.4
 * author:  xuejianxianzun 雪见仙尊
 * license: GNU General Public License v3.0
 * E-mail:  xuejianxianzun@gmail.com
 * Github： https://github.com/xuejianxianzun/PixivBatchDownloader
 * blog:    https://saber.love/pixiv
 * QQ群:    499873152
 */

'use strict';

let quiet_download = false, // 是否静默下载，即下载时不弹窗提醒，并且自动开始下载（无需点击下载按钮）。目前新版本已经默认不弹窗了，这个参数的意义基本就是自动下载了
	use_alert = false, // 是否使用弹窗提醒
	download_thread_deauflt = 5, // 同时下载的线程数，可以修改。如果不想用加延迟 time_interval 的方法来防止漏图，那么可以把这里改成1，单线程下载不会漏图。此版本用的是加延迟的方法，可以支持多线程
	multiple_down_number = 0, // 设置多图作品下载前几张图片。0为不限制，全部下载。改为1则只下载第一张。这是因为有时候多p作品会导致要下载的图片过多，此时可以设置只下载前几张，减少下载量
	tag_search_show_img = true, //是否显示tag搜索页里面的封面图片。如果tag搜索页的图片数量太多，那么加载封面图可能要很久，并且可能因为占用大量带宽导致抓取中断。这种情况下可以将此参数改为false，不加载封面图。
	fileName_length = 200, // 文件名的最大长度，超出将会截断。如果文件的保存路径过长可能会保存失败，此时可以把这个数值改小些。
	viewer_enable = true, // 是否启用看图模式
	loc_url = window.location.href, //当前页面的url
	page_type, //区分页面类型
	img_info = [], //储存图片信息，其中可能会有空值，如 undefined 和 ''。如果改成json格式的话，使用id调用，就更方便了
	illust_url_list = [], //储存作品列表url的数组
	imgList = [], //储存tag搜索页的所有作品
	ajax_for_illust_threads = 5, //抓取页面时的并发连接数
	ajax_for_illust_delay = 100, //抓取页面的并发请求每个间隔多少毫秒
	ajax_threads_finished = 0, //统计有几个并发线程完成所有请求。统计的是并发数（ajax_for_illust_threads）而非请求数
	test_suffix_finished = true, //检查图片后缀名正确性的函数是否执行完毕
	test_suffix_no = 0, //检查图片后缀名函数的计数
	now_tips = '', //输出顶部提示
	base_url, //列表页url规则
	startpage_no, //列表页开始抓取时的页码
	listPage_finished = 0, //记录一共抓取了多少列表页
	listPage_finished2 = 0, //记录tag搜索页本次任务已经抓取了多少页
	want_page, //要抓取几页
	quick = false, // 快速下载当前页面，这个只在作品页内直接下载时使用，和quiet_download有细微区别
	want_favorite_number = 0, //tag搜索页要求的最低收藏数
	interrupt = false, //是否中断正在进行的任务，目前仅在tag搜索页使用
	allow_work = true, //当前是否允许展开工作（如果有未完成的任务则会变为false
	notNeed_tag = [], //要排除的tag的列表
	notNeed_tag_tip, //输入tag的文本框的默认提示
	need_tag = [], //必须包含的tag的列表
	need_tag_tip, //输入tag的文本框的默认提示
	notdown_type = '', //设置不要下载的作品类型
	is_set_filterWH = false, //是否设置了筛选宽高
	filterWH = {
		and_or: '&',
		width: 0,
		height: 0
	}, //宽高条件
	is_set_filterBMK = false, // 是否设置了筛选收藏数
	filterBMK,
	part_number, //保存不同排行榜的列表数量
	requset_number = 0, //下载添加收藏后的相似作品时的请求数量
	max_num = 0, //最多允许获取多少数量
	list_is_new, // 列表页加载模式是否是新版
	tag_search_lv1_selector, // tag搜索页，作品列表的父元素的选择器
	tag_search_lv2_selector, // tag搜索页，作品列表自身的选择器
	tag_search_list_selector, // tag搜索页，直接选择作品的选择器
	tag_search_multiple_selector, // tag搜索页，多图作品的选择器
	tag_search_gif_selector, // tag搜索页，动图作品的选择器
	tag_search_new_html, // tag搜索页作品的html
	xz_multiple_html, // tag搜索页作品的html中的多图标识
	xz_gif_html, // tag搜索页作品的html中的动图标识
	tag_search_new_html_one_page = '', // 拼接每一页里所有列表的html
	tag_search_temp_result, // 临时储存tag搜索每一页的结果
	fileNameRule = '',
	safe_fileName_rule = new RegExp(/\\|\/|:|\?|"|<|>|\*|\|/g), // 安全的文件名
	xianzun_btns_wrap,
	donwloadBar_list, // 下载队列的dom元素
	download_a, // 下载用的a标签
	download_started = false, // 下载是否已经开始
	downloaded = 0, // 已下载的文件
	download_stop = false, // 是否停止下载
	download_thread, // 下载线程
	download_stop_num = 0, // 已停止的线程数
	download_pause = false, // 是否暂停下载
	download_pause_num = 0, // 已暂停的线程数
	xz_btns_ctr,
	xz_btns_con,
	old_title = document.title,
	title_timer,
	click_time = 0, // 点击下载按钮的时间戳
	time_delay = 0, // 延迟点击的时间
	time_interval = 400, // 为了不会漏下图，设置的两次点击之间的间隔时间。下载图片的速度越快，此处的值就需要越大。默认的400是比较大的，如果下载速度慢，可以尝试改成300/200。
	down_xiangguan = false, // 下载相关作品（作品页内的）
	viewerELCreated = false, // 是否已经创建了图片列表元素
	viewerWarpper, // 图片列表的容器
	viewerUl, // 图片列表的 ul 元素
	myViewer; // 查看器

// 多语言配置
let lang_type; // 语言类型
let user_lang = document.documentElement.lang; //获取语言选项
if (user_lang === 'zh' || user_lang === 'zh-CN' || user_lang === 'zh-Hans' || user_lang === 'zh-Hant' || user_lang === 'zh-tw' || user_lang === 'zh-TW') { // 设置语言为中文
	lang_type = 0;
} else if (user_lang === 'ja') { // 设置语言为日语
	lang_type = 1;
} else { // 设置语言为英语
	lang_type = 2;
}

// 日文和英文目前是机翻，欢迎了解这些语言的人对翻译进行完善
let xz_lang = { // 储存语言配置。在属性名前面加上下划线，和文本内容做出区别。{}表示需要进行替换的部分
	'_过滤作品类型的按钮': [
		'排除指定类型的作品',
		'タイプでフィルタリングする',
		'Filter by works type'
	],
	'_过滤作品类型的按钮_title': [
		'在下载前，您可以设置想要排除的作品类型。',
		'ダウンロードする前に、除外するタイプを設定することができます。',
		'Before downloading, you can set the type you want to exclude.'
	],
	'_过滤作品类型的弹出框文字': [
		'请输入数字来设置下载时要排除的作品类型。\n如需多选，将多个数字连写即可\n如果什么都不输入，那么将不排除任何作品\n1: 排除单图\n2: 排除多图\n3: 排除动图\n4: 排除已经收藏的作品',
		'ダウンロード時に除外するタイプを設定する番号を入力してください。\nさまざまなオプションが必要な場合は、それを連続して入力することができます。\n1.単一の画像の作品を除外する\n2.複数の画像の作品を除外する\n3.うごイラの作品を除外する\n4: ブックマーク',
		'Please enter a number to set the type of you want to excluded when downloading.\nIf you need multiple choice, you can enter continuously.\n1: one-images works\n2.multiple-images works\n3.animat works\n4.bookmarked works'
	],
	'_排除tag的按钮文字': [
		'设置作品不能包含的tag',
		'作品に含まれていないタグを設定する',
		'Set the tag that the work can not contain'
	],
	'_排除tag的按钮_title': [
		'在下载前，您可以设置想要排除的tag',
		'ダウンロードする前に、除外するタグを設定できます',
		'Before downloading, you can set the tag you want to exclude'
	],
	'_排除tag的提示文字': [
		'您可在下载前设置要排除的tag，这样在下载时将不会下载含有这些tag的作品。区分大小写；如需排除多个tag，请使用英文逗号分隔。请注意要排除的tag的优先级大于要包含的tag的优先级。',
		'ダウンロードする前に、除外するタグを設定できます。ケースセンシティブ；複数のタグを設定する必要がある場合は、\',\'を分けて使用できます。除外されたタグは、含まれているタグよりも優先されます',
		'Before downloading, you can set the tag you want to exclude. Case sensitive; If you need to set multiple tags, you can use \',\' separated. The excluded tag takes precedence over the included tag'
	],
	'_设置了排除tag之后的提示': [
		'本次任务设置了排除的tag:',
		'このタスクはタグを除外します：',
		'This task excludes tag:'
	],
	'_必须tag的按钮文字': [
		'设置作品必须包含的tag',
		'作品に含める必要があるタグを設定する',
		'Set the tag that the work must contain'
	],
	'_必须tag的按钮_title': [
		'在下载前，您可以设置必须包含的tag。',
		'ダウンロードする前に、含まれなければならないタグを設定することができます',
		'Before downloading, you can set the tag that must be included'
	],
	'_必须tag的提示文字': [
		'您可在下载前设置作品里必须包含的tag，区分大小写；如需包含多个tag，请使用英文逗号分隔。',
		'ダウンロードする前に、含まれなければならないタグを設定することができます。ケースセンシティブ；複数のタグを設定する必要がある場合は、\',\'を分けて使用できます。',
		'Before downloading, you can set the tag that must be included. Case sensitive; If you need to set multiple tags, you can use \',\' separated. '
	],
	'_设置了必须tag之后的提示': [
		'本次任务设置了必须的tag：',
		'このタスクは、必要なタグを設定します：',
		'This task set the necessary tag: '
	],
	'_筛选宽高的按钮文字': [
		'设置宽高条件',
		'幅と高さの条件を設定する',
		'Set the width and height conditions'
	],
	'_筛选宽高的按钮_title': [
		'在下载前，您可以设置要下载的图片的宽高条件。',
		'ダウンロードする前に、ダウンロードする写真の幅と高さの条件を設定できます。',
		'Before downloading, you can set the width and height conditions of the pictures you want to download.'
	],
	'_筛选宽高的提示文字': [
		'请输入最小宽度和最小高度，在抓取图片url时会排除不符合要求的图片\n用or符号 \'|\' 分割表示满足任意一个条件即可\n用and符号 \'&\' 分割表示需要同时满足两个条件',
		'最小幅と最小高さを入力してください\n\'|\'を使用すると、1つの条件だけが必要であることを意味し；\n\'&\'を使用すると、2つの条件を同時に満たす必要があることを意味します。',
		'Please enter the minimum width and minimum height.\nUsing \'|\' means that only one condition is required; \nusing \'&\' means that two conditions need to be satisfied at the same time.'
	],
	'_本次输入的数值无效': [
		'本次输入的数值无效',
		'無効な入力',
		'Invalid input'
	],
	'_设置成功': [
		'设置成功',
		'セットアップが正常に完了しました',
		'Set up successfully'
	],
	'_设置了筛选宽高之后的提示文字p1': [
		'本次任务设置了过滤宽高条件:宽度>=',
		'この作業では、フィルターの幅と高さの条件を設定します。幅≥',
		'This task sets the filter width and height conditions. Width ≥'
	],
	'_或者': [
		' 或者 ',
		' または ',
		' or '
	],
	'_并且': [
		' 并且 ',
		' そして ',
		' and '
	],
	'_高度设置': [
		'高度>=',
		'高さ≥',
		'height ≥'
	],
	'_筛选收藏数的按钮文字': [
		'设置收藏数量',
		'お気に入りの数を設定する',
		'Set the bookmarkCount conditions'
	],
	'_筛选收藏数的按钮_title': [
		'在下载前，您可以设置对收藏数量的要求。',
		'ダウンロードする前に、お気に入り数の要件を設定することができます。',
		'Before downloading, You can set the requirements for the number of bookmarks.'
	],
	'_筛选收藏数的提示文字': [
		'请输入一个数字，如果作品的收藏数小于这个数字，作品不会被下载。',
		'数字を入力してください。 作品のブックマークの数がこの数より少ない場合、作品はダウンロードされません。',
		'Please enter a number. If the number of bookmarks of the work is less than this number, the work will not be downloaded.'
	],
	'_设置了筛选收藏数之后的提示文字': [
		'本次任务设置了收藏数条件:收藏数>=',
		'このタスクは、お気に入りの数を設定します。条件：お気に入りの数≥',
		'This task sets the number of bookmarks condition: number of bookmarks ≥'
	],
	'_本次任务已全部完成': [
		'本次任务已全部完成。',
		'このタスクは完了しました。',
		'This task has been completed.'
	],
	'_当前任务尚未完成1': [
		'当前任务尚未完成，请等到提示完成之后再设置新的任务。',
		'現在のタスクはまだ完了していません。お待ちください。',
		'The current task has not yet completed, please wait.'
	],
	'_check_want_page_rule1_arg1': [
		'如果要下载全部作品，请保持默认值。\n如果需要设置下载的作品数，请输入从1开始的数字，1为仅下载当前作品。',
		'すべての作品をダウンロードしたい場合は、デフォルト値のままにしてください。\nダウンロード数を設定する必要がある場合は、1から始まる番号を入力します。 現在の作品には1の番号が付けられています。',
		'If you want to download all the work, please leave the default value.\nIf you need to set the number of downloads, enter a number starting at 1. The current works are numbered 1.'
	],
	'_check_want_page_rule1_arg2': [
		'参数不合法，本次操作已取消。<br>',
		'パラメータは有効ではありません。この操作はキャンセルされました。<br>',
		'Parameter is not legal, this operation has been canceled.<br>'
	],
	'_check_want_page_rule1_arg3': [
		'任务开始<br>本次任务条件: 从本页开始下载-num-个作品',
		'タスクが開始されます。<br>このタスク条件：このページから-num-枚の作品をダウンロード。',
		'Task starts. <br>This task condition: Download -num- works from this page.'
	],
	'_check_want_page_rule1_arg4': [
		'任务开始<br>本次任务条件: 向下获取所有作品',
		'タスクが開始されます。<br>このタスク条件：このページからすべての作品をダウンロードする。',
		'Task starts. <br>This task condition: download all the work from this page.'
	],
	'_check_want_page_rule1_arg5': [
		'如果不限制下载的页数，请不要修改此默认值。\n如果要限制下载的页数，请输入从1开始的数字，1为仅下载本页。',
		'ダウンロードしたページ数を制限しない場合は、デフォルト値のままにしておきます。\n ダウンロードするページ数を設定する場合は、1から始まる番号を入力します。 現在のページは1です。',
		'If you do not limit the number of pages downloaded, leave the default value.\nIf you want to set the number of pages to download, enter a number starting at 1. This page is 1.'
	],
	'_check_want_page_rule1_arg6': [
		'任务开始<br>本次任务条件: 从本页开始下载-num-页',
		'タスクが開始されます。<br>このタスク条件：現在のページから-num-ページ',
		'Task starts. <br>This task condition: download -num- pages from the current page'
	],
	'_check_want_page_rule1_arg7': [
		'任务开始<br>本次任务条件: 下载所有页面',
		'タスクが開始されます。<br>このタスク条件：すべてのページをダウンロード',
		'Task starts. <br>This task condition: download all pages'
	],
	'_请输入最低收藏数和要抓取的页数': [
		'请输入最低收藏数和要抓取的页数，用英文逗号分开。\n类似于下面的形式: \n1000,1000',
		'お気に入りの最小数とクロールするページ数を，\',\'で区切って入力してください。\n例えば：\n1000,1000',
		'Please enter the minimum number of bookmarks, and the number of pages to be crawled, separated by \',\'.\nE.g:\n1000,1000'
	],
	'_参数不合法1': [
		'参数不合法，请稍后重试。',
		'パラメータが合法ではありません。後でやり直してください。',
		'Parameter is not legal, please try again later.'
	],
	'_tag搜索任务开始': [
		'任务开始<br>本次任务条件: 收藏数不低于{}，向下抓取{}页',
		'タスクが開始されます。<br>このタスク条件：ブックマークの数は{}ページ以上で、{}ページがクロールされます。',
		'Task starts. <br>This task condition: the number of bookmarks is not less than {}, {} pages down to crawl.'
	],
	'_want_page_弹出框文字_page_type10': [
		'你想要下载多少页？请输入数字。\r\n当前模式下，列表页的页数最多只有',
		'ダウンロードしたいページ数を入力してください。 \r\n最大値：',
		'Please enter the number of pages you want to download.\r\n The maximum value is '
	],
	'_输入超过了最大值': [
		'你输入的数字超过了最大值',
		'入力した番号が最大値を超えています',
		'The number you entered exceeds the maximum'
	],
	'_多图作品下载张数': [
		'多图作品将下载前{}张图片',
		'2枚以上の作品，最初の{}枚の写真をダウンロードする',
		'Multi-artwork will download the first {} pictures'
	],
	'_任务开始1': [
		'任务开始<br>本次任务条件: 从本页开始下载{}页',
		'タスクが開始されます。<br>このタスク条件：このページから{}ページをダウンロードする',
		'Task starts. <br>This task condition: download {} pages from this page'
	],
	'_任务开始0': [
		'任务开始',
		'タスクが開始されます。',
		'Task starts.'
	],
	'_check_notdown_type_result1_弹窗': [
		'由于您排除了所有作品类型，本次任务已取消。',
		'すべての種類の作業を除外したため、タスクはキャンセルされました。',
		'Because you excluded all types of work, the task was canceled.'
	],
	'_check_notdown_type_result1_html': [
		'排除作品类型的设置有误，任务取消!',
		'作業タイプの除外にエラー設定がありました。 タスクがキャンセルされました。',
		'There was an error setting for the exclusion of the work type. Task canceled.'
	],
	'_check_notdown_type_result2_弹窗': [
		'由于作品类型的设置有误，本次任务已取消。',
		'除外タイプを設定する際にエラーが発生しました。 タスクがキャンセルされました。',
		'There was an error setting for the exclusion of the work type. Task canceled.'
	],
	'_check_notdown_type_result3_html': [
		'本次任务设置了排除作品类型:',
		'この作業では、これらのタイプの作品レーションは除外されます：',
		'This task excludes these types of works:'
	],
	'_单图': [
		'单图 ',
		'1枚の作品',
		'one images works '
	],
	'_多图': [
		'多图 ',
		'2枚以上の作品',
		'multiple images works '
	],
	'_动图': [
		'动图 ',
		'うごイラ',
		'GIF works '
	],
	'_已收藏的作品': [
		'已收藏的作品 ',
		'ブックマーク',
		'bookmarked works'
	],
	'_tag搜索页已抓取多少页': [
		'已抓取本次任务第{}/{}页，当前加载到第{}页',
		'{}/{}ページをクロールしています。 現在のページ番号は{}ページです',
		'Has been crawling {} / {} pages. The current page number is page {}'
	],
	'_tag搜索页任务完成1': [
		'本次任务完成。当前有{}张作品。',
		'この作業は完了です。 今は{}枚の作品があります。',
		'This task is completed. There are now {} works.'
	],
	'_tag搜索页任务完成2': [
		'已抓取本tag的所有页面，本次任务完成。当前有{}张作品。',
		'この作業は完了です。 今は{}枚の作品があります。',
		'This task is completed. There are now {} works.'
	],
	'_tag搜索页中断': [
		'当前任务已中断!<br>当前有{}张作品。',
		'現在のタスクが中断されました。<br>今は{}枚の作品があります。',
		'The current task has been interrupted.<br> There are now {} works.'
	],
	'_排行榜进度': [
		'已抓取本页面第{}部分',
		'このページの第{}部がクロールされました',
		'Part {} of this page has been crawled'
	],
	'_排行榜任务完成': [
		'本页面抓取完成。当前有{}张作品，开始获取作品信息。',
		'このページはクロールされ、{}個の作品があります。 詳細は作品を入手し始める。',
		'This page is crawled and now has {} works. Start getting the works for more information.'
	],
	'_列表页获取完成2': [
		'列表页获取完成。<br>当前有{}张作品，开始获取作品信息。',
		'リストページがクロールされます。<br>{}個の作品があります。 詳細は作品を入手し始める。',
		'The list page gets done. <br>Now has {} works. Start getting the works for more information.'
	],
	'_列表页抓取进度': [
		'已抓取列表页{}个页面',
		'{}のリストページを取得しました',
		'Has acquired {} list pages'
	],
	'_列表页抓取完成': [
		'列表页面抓取完成，开始获取图片网址',
		'リストページがクロールされ、画像URLの取得が開始されます',
		'The list page is crawled and starts to get the image URL'
	],
	'_列表页抓取结果为零': [
		'抓取完毕，但没有找到符合筛选条件的作品。',
		'クロールは終了しましたが、フィルタ条件に一致する作品が見つかりませんでした。',
		'Crawl finished but did not find works that match the filter criteria.'
	],
	'_排行榜列表页抓取遇到404': [
		'本页面抓取完成。当前有{}张作品，开始获取作品信息。',
		'このページはクロールされます、{}個の作品があります。 詳細は作品を入手し始める。',
		'This page is crawled. Now has {} works. Start getting the works for more information.'
	],
	'_当前任务尚未完成2': [
		'当前任务尚未完成，请等待完成后再下载。',
		'現在のタスクはまだ完了していません',
		'The current task has not yet been completed'
	],
	'_列表抓取完成开始获取作品页': [
		'当前列表中有{}张作品，开始获取作品信息',
		'{}個の作品があります。 詳細は作品を入手し始める。',
		'Now has {} works. Start getting the works for more information.'
	],
	'_开始获取作品页面': [
		'<br>开始获取作品页面',
		'<br>作品ページの取得を開始する',
		'<br>Start getting the works page'
	],
	'_无权访问1': [
		'无权访问{}，抓取中断。',
		'アクセス{}、中断はありません。',
		'No access {}, interruption.'
	],
	'_无权访问2': [
		'无权访问{}，跳过该作品。',
		'アクセス{}、無視する。',
		'No access {}, skip.'
	],
	'_作品页状态码0': [
		'请求的url不可访问',
		'要求されたURLにアクセスできません',
		'The requested url is not accessible'
	],
	'_作品页状态码400': [
		'该作品已被删除',
		'作品は削除されました',
		'The work has been deleted'
	],
	'_作品页状态码403': [
		'无权访问请求的url 403',
		'リクエストされたURLにアクセスできない 403',
		'Have no access to the requested url 403'
	],
	'_作品页状态码404': [
		'404 not found',
		'404 not found',
		'404 not found'
	],
	'_抓取图片网址的数量': [
		'已获取{}个图片网址',
		'{}つの画像URLを取得',
		'Get {} image URLs'
	],
	'_抓取图片网址遇到中断': [
		'当前任务已中断!',
		'現在のタスクが中断されました。',
		'The current task has been interrupted.'
	],
	'_收起下载按钮': [
		'收起下载按钮',
		'ダウンロードボタンを非表示にする',
		''
	],
	'_展开下载按钮': [
		'展开下载按钮',
		'ダウンロードボタンを表示',
		''
	],
	'_展开收起下载按钮_title': [
		'展开/收起下载按钮',
		'ダウンロードボタンを表示/非表示',
		'Show / hide download button'
	],
	'_关闭': [
		'关闭',
		'クローズド',
		'close'
	],
	'_输出信息': [
		'输出信息',
		'出力情報',
		'Output information'
	],
	'_复制': [
		'复制',
		'コピー',
		'Copy'
	],
	'_已复制到剪贴板': [
		'已复制到剪贴板，可直接粘贴',
		'クリップボードにコピーされました',
		'Has been copied to the clipboard'
	],
	'_下载设置': [
		'下载设置',
		'設定をダウンロードする',
		'Download settings'
	],
	'_隐藏': [
		'隐藏',
		'隠された',
		'hide'
	],
	'_设置命名规则': [
		'共抓取到{}个图片，请设置文件命名规则：',
		'合計{}枚の画像を取得し、ファイルの命名規則を設定してください：',
		'Grab a total of {} pictures, please set the file naming rules: '
	],
	'_查看可用的标记': [
		'查看可用的标记',
		'利用可能なタグを見る',
		'See available tags'
	],
	'_可用标记1': [
		'作品id',
		'作品ID',
		'works id'
	],
	'_可用标记2': [
		'作品标题',
		'作品のタイトル',
		'works title'
	],
	'_可用标记3': [
		'作品的tag列表',
		'作品のtags',
		'Tags of works'
	],
	'_可用标记4': [
		'画师的名字',
		'アーティスト名',
		'Artist name'
	],
	'_可用标记6': [
		'画师的id',
		'アーティストID',
		'Artist id'
	],
	'_可用标记7': [
		'宽度和高度',
		'幅と高さ',
		'width and height'
	],
	'_可用标记8': [
		'bookmark-count，作品的收藏数。把它放在最前面就可以让下载后的文件按收藏数排序。',
		'bookmark-count，作品のコレクション数のコレクション数は。',
		'bookmark-count.'
	],
	'_可用标记5': [
		'你可以使用多个标记；建议在不同标记之间添加分割用的字符。示例：{id}-{userid}-{px}<br>* 在pixivision里，只有id标记会生效',
		'複数のタグを使用することができ；異なるタグ間に別の文字を追加することができます。例：{id}-{userid}-{px}<br>* pixivisionでは、idのみが利用可能です',
		'You can use multiple tags, and you can add a separate character between different tags. Example: {id}-{userid}-{px}<br>* On pixivision, only id is available'
	],
	'_预览文件名': [
		'预览文件名',
		'ファイル名のプレビュー',
		'Preview file name'
	],
	'_下载按钮1': [
		'开始下载',
		'start download',
		'start download'
	],
	'_下载按钮2': [
		'暂停下载',
		'puse download',
		'puse download'
	],
	'_下载按钮3': [
		'停止下载',
		'stop download',
		'stop download'
	],
	'_下载按钮4': [
		'复制url',
		'copy urls',
		'copy urls'
	],
	'_当前状态': [
		'当前状态 ',
		'現在の状態 ',
		'Now state '
	],
	'_未开始下载': [
		'未开始下载',
		'まだダウンロードを開始していません',
		'Not yet started downloading'
	],
	'_下载进度：': [
		'下载进度：',
		'ダウンロードの進捗状況：',
		'Download progress: '
	],
	'_下载线程：': [
		'下载线程：',
		'スレッド：',
		'Thread: '
	],
	'_查看下载说明': [
		'查看下载说明',
		'指示の表示',
		'View instructions'
	],
	'_下载说明': [
		'下载的文件保存在浏览器的下载目录里。<br>本脚本不支持自动创建文件夹。<br>你可能会下载到.zip格式的文件，这是动态图的源文件。<br>请不要在浏览器的下载选项里选中\'总是询问每个文件的保存位置\'。<br>如果浏览器询问\'是否允许下载多个文件\'，请选择\'允许\'。<br>如果浏览器询问\'保存\'文件还是\'打开\'文件，请选择\'保存\'。<br>如果浏览器提示文件名过长，请将浏览器的下载文件夹改为名字较短的文件夹，之后重试。<br>如果作品标题或tag里含有不能做文件名的字符，会被替换成下划线_。<br>任务暂停成功后，你可以使用\'开始下载\'按钮继续下载;<br>任务下载完毕或停止后，你可以使用\'开始下载\'按钮重新下载。<br>如果任务下载缓慢或失败，可使用\'复制url\'功能，之后尝试使用其他下载软件进行下载。',
		'ダウンロードしたファイルは、ブラウザのダウンロードディレクトリに保存されます。<br>このスクリプトは、フォルダの自動作成をサポートしていません。<br>ブラウザが\'複数のファイルをダウンロードできるようにするかどうか\'と尋ねる場合は、\'許可\'を選択します。<br>Chromeをお勧めします。',
		'The downloaded file is saved in the browser`s download directory.<br>This script does not support the automatic creation of folders.<br>If the browser asks \'whether to allow multiple files to be downloaded \', select \'Allow \'.<br>Chrome is recommended.'
	],
	'_正在下载中': [
		'正在下载中',
		'ダウンロード',
		'downloading'
	],
	'_正在暂停': [
		'任务正在暂停中，但当前位于下载线程中的文件会继续下载',
		'後でダウンロードが一時停止されます。',
		'The download will be paused later.'
	],
	'_正在停止': [
		'任务正在停止中，但当前位于下载线程中的文件会继续下载',
		'ダウンロードは後で中止されます。',
		'The download will stop later.'
	],
	'_下载已停止': [
		'下载已停止',
		'ダウンロードが停止しました',
		'Download stopped'
	],
	'_显示隐藏下载面板': [
		'显示/隐藏下载面板',
		'ダウンロードパネルの表示/非表示',
		'Show / hide the download panel'
	],
	'_下载完毕': [
		'下载完毕!',
		'ダウンロードが完了しました',
		'Download finished'
	],
	'_已暂停': [
		'下载已暂停',
		'ダウンロードは一時停止中です',
		'Download is paused'
	],
	'_已停止': [
		'下载已停止',
		'ダウンロードが停止しました',
		'Download stopped'
	],
	'_已下载': [
		'已下载',
		'downloaded',
		'downloaded'
	],
	'_获取图片网址完毕': [
		'获取完毕，共{}个图片地址',
		'合計{}個の画像URLを取得する',
		'Get a total of {} image url'
	],
	'_没有符合条件的作品': [
		'没有符合条件的作品!任务结束。',
		'基準を満たす作品はありません！タスクは終了します。',
		'There are no works that meet the criteria! The task ends.'
	],
	'_没有符合条件的作品弹窗': [
		'抓取完毕!没有符合条件的作品!',
		'クロールが終了しました！基準を満たす作品はありません',
		'Crawl finished! There are no works that meet the criteria! '
	],
	'_抓取完毕': [
		'抓取完毕!',
		'クロールが終了しました！',
		'Crawl finished!'
	],
	'_快速下载本页': [
		'快速下载本页作品',
		'この作品をすばやくダウンロードする',
		'Download this work quickly'
	],
	'_从本页开始下载': [
		'从本页开始下载作品',
		'このページからダウンロードできます',
		'Download works from this page'
	],
	'_下载相关作品': [
		'下载相关作品',
		'関連作品をダウンロードする',
		'Download the related works'
	],
	'_下载该画师的作品': [
		'下载该画师的作品',
		'アーティストの作品をダウンロードする',
		'Download the artist`s work'
	],
	'_下载响应作品': [
		'下载响应作品',
		'イメージレスポンスの作品をダウンロードする',
		'Download the responses illustration'
	],
	'_下载该tag中的作品': [
		'下载该tag中的作品',
		'タグで作品をダウンロードする',
		'Download the work in the tag'
	],
	'_下载书签': [
		'下载书签中的作品',
		'このブックマークでこの作品をダウンロード',
		'Download the works in this bookmark'
	],
	'_默认下载多页': [
		', 如有多页，默认会下载全部。',
		'複数のページがある場合、デフォルトがダウンロードされます。',
		', If there are multiple pages, the default will be downloaded.'
	],
	'_调整完毕': [
		'调整完毕，当前有{}张作品。',
		'調整が完了し、今、{}の作品があります。',
		'The adjustment is complete and now has {} works.'
	],
	'_按收藏数筛选': [
		'按收藏数筛选',
		'お気に入りからのフィルター',
		'Filter by bookmarks'
	],
	'_按收藏数筛选_title': [
		'按收藏数筛选当前tag里的作品。如果多次筛选，页码会一直累加。',
		'現在のタグのエントリ数でフィルタリングします。多次过滤时，页码增加。',
		'Filter by the number of entries in the current tag. If you filter multiple times, the page number will increase.'
	],
	'_在结果中筛选': [
		'在结果中筛选',
		'結果のフィルタリング',
		'Filter in results'
	],
	'_在结果中筛选_title': [
		'如果本页筛选后作品太多，可以提高收藏数的要求，在结果中筛选。达不到要求的会被隐藏而不是删除。所以你可以反复进行筛选。被隐藏的项目不会被下载。',
		'あなたは何度も選別することができて、要求の作品が隠されて、それからダウンロードされません。',
		'You can make multiple screening , fail to meet the required works will be hidden, and will not be downloaded.'
	],
	'_在结果中筛选弹窗': [
		'将在当前作品列表中再次过滤，请输入要求的最低收藏数: ',
		'将在当前作品列表中再次筛选，请输入要求的最低收藏数',
		'Will be filtered again in the current list of works. Please enter the required minimum number of bookmarks:'
	],
	'_下载当前作品': [
		'下载当前作品',
		'現在の作品をダウンロードする',
		'Download the current work'
	],
	'_下载当前作品_title': [
		'下载当前列表里的所有作品',
		'現在のリストにあるすべての作品をダウンロードする',
		'Download all the works in the current list'
	],
	'_中断当前任务': [
		'中断当前任务',
		'現在のタスクを中断する',
		'Interrupt the current task'
	],
	'_中断当前任务_title': [
		'筛选时中断之后可以继续执行。',
		'ふるい分け作品で中断され、その後引き続き実行可能です。',
		'In the screening works when the break, then you can continue to perform.'
	],
	'_当前任务已中断': [
		'当前任务已中断!',
		'現在のタスクが中断されました',
		'The current task has been interrupted'
	],
	'_下载时排除tag': [
		'下载时排除tag',
		'ダウンロード時にタグを除外する',
		'Exclude tags when downloading'
	],
	'_清除多图作品': [
		'清除多图作品',
		'複数の図面を削除する',
		'Remove multi-drawing works'
	],
	'_清除多图作品_title': [
		'如果不需要可以清除多图作品',
		'必要がない場合は、複数のグラフを削除することができます',
		'If you do not need it, you can delete multiple graphs'
	],
	'_清除动图作品': [
		'清除动图作品',
		'うごイラ作品を削除する',
		'Remove animat work'
	],
	'_清除动图作品_title': [
		'如果不需要可以清除动图作品',
		'必要がない場合は、うごイラを削除することができます',
		'If you do not need it, you can delete the animat work'
	],
	'_手动删除作品': [
		'手动删除作品',
		'マニュアル削除作品',
		'Manually delete the work'
	],
	'_手动删除作品_title': [
		'可以在下载前手动删除不需要的作品',
		'ダウンロードする前に不要な作品を手動で削除することができます',
		'You can manually delete unwanted work before downloading'
	],
	'_退出手动删除': [
		'退出手动删除',
		'削除モードを終了する',
		'Exit manually delete'
	],
	'_清空作品列表': [
		'清空作品列表',
		'作品のリストを空にする',
		'Empty the list of works'
	],
	'_清空作品列表_title': [
		'如果网页内容过多，可能导致页面崩溃。如有需要可以清除当前的作品列表。',
		'',
		''
	],
	'_下载本页作品': [
		'下载本页作品',
		'このページをダウンロードする',
		'Download this page works'
	],
	'_下载本页作品_title': [
		'下载本页列表中的所有作品',
		'このページをダウンロードする',
		'Download this page works'
	],
	'_已清除多图作品': [
		'已清除多图作品',
		'マルチマップ作品を削除しました',
		'Has deleted the multi-map works'
	],
	'_已清除动图作品': [
		'已清除动图作品',
		'うごイラが削除されました',
		'Dynamic work has been removed'
	],
	'_下载本排行榜作品': [
		'下载本排行榜作品',
		'このリストの作品をダウンロードする',
		'Download the works in this list'
	],
	'_下载本排行榜作品_title': [
		'下载本排行榜的所有作品，包括现在尚未加载出来的。',
		'このリストの作品をダウンロードする、まだロードされていないものを含む',
		'Download all of the works in this list, including those that are not yet loaded.'
	],
	'_下载该页面的图片': [
		'下载该页面的图片',
		'ページの写真をダウンロードする',
		'Download the picture of the page'
	],
	'_下载该专辑的图片': [
		'下载该专辑的图片',
		'アルバムの画像をダウンロードする',
		'Download the album`s picture'
	],
	'_下载推荐图片': [
		'下载推荐图片',
		'おすすめ作品をダウンロードする',
		'Download recommended works'
	],
	'_下载推荐图片_title': [
		'下载为你推荐的图片',
		'あなたのお勧め作品をダウンロードする',
		'Download for your recommended works'
	],
	'_下载相似图片': [
		'下载相似图片',
		'類似の作品をダウンロードする',
		'Download similar works'
	],
	'_要获取的作品个数': [
		'你想要获取多少个作品？（注意是个数而不是页数）\r\n请输入数字，最大值为',
		'いくつの作品をダウンロードしたいですか？ （ページ数ではなく作品数に注意してください）\r\n数値を入力してください。最大値は',
		'How many works do you want to download? (Note that the number of works rather than the number of pages)\r\nPlease enter a number, max '
	],
	'_超过最大值': [
		'你输入的数字超过了最大值',
		'入力した番号が最大値を超えています',
		'The number you entered exceeds the maximum'
	],
	'_下载大家的新作品': [
		'下载大家的新作品',
		'みんなの新作をダウンロードする',
		'Download everyone`s new work'
	],
	'_屏蔽设定': [
		'屏蔽設定',
		'ミュート設定',
		'Mute settings'
	],
	'_举报': [
		'举报',
		'報告',
		'Report'
	],
	'_输入id进行下载': [
		'输入id进行下载',
		'IDでダウンロード',
		'Download by ID'
	],
	'_输入id进行下载的提示文字': [
		'请输入作品id。如果有多个id，则以换行分割（即每行一个id）',
		'イラストレーターIDを入力してください。 複数のidがある場合は、1行に1つのidを付けます。',
		'Please enter the illustration id. If there is more than one id, one id per line.'
	],
	'_开始下载': [
		'开始下载',
		'ダウンロードを開始する',
		'Start download'
	],
	'_id不合法': [
		'id不合法，操作取消。',
		'idが不正な、操作はキャンセルされます。',
		'id is illegal, the operation is canceled.'
	],
	'_快速收藏': [
		'快速收藏',
		'クイックブックマーク',
		'Quick bookmarks'
	]
};

// xianzun_lang_translate 翻译
function xzlt(name) {
	let content = xz_lang[name][lang_type];
	if (arguments.length > 1) {
		for (let i = 1; i < arguments.length; i++) {
			content = content.replace('{}', arguments[i]);
		}
	}
	return content;
}

// 去除广告
let block_ad_css = '<style>section.ad,._3M6FtEB,[name=header],.ads_anchor,.ad-bigbanner,.ad-footer,._premium-lead-tag-search-bar,#header-banner.ad,.popular-introduction-overlay,.ad-bigbanner,.adsbygoogle,.ui-fixed-container aside,.ad-multiple_illust_viewer,.ads_area{display: none!important;z-index: -999!important;width: 0!important;height: 0!important;opacity: 0!important;}</style>';
document.body.insertAdjacentHTML('beforeend', block_ad_css);

let parser = new DOMParser(); // DOMParser，将字符串形式的html代码解析为DOM结构

// 设置输入框获得焦点和失去焦点时的样式
jQuery.focusblur = function (element, defcolor, truecolor) {
	let focusblurid = element;
	let defval = focusblurid.val();
	focusblurid.focus(function () {
		let thisval = $(this).val();
		if (thisval == defval) {
			$(this).val('');
			$(this).css('color', truecolor);
		}
	});
	focusblurid.blur(function () {
		let thisval = $(this).val();
		if (thisval === '') {
			$(this).val(defval);
			$(this).css('color', defcolor);
		}
	});
};

// 快速收藏
function quickBookmark() {
	// 本函数一直运行。因为切换作品（pushstate）时，不能准确的知道 toolbar 何时更新，所以只能不断检测，这样在切换作品时才不会出问题
	setTimeout(() => {
		quickBookmark();
	}, 300);

	let toolbar = document.querySelector('._2g7Dix7');
	if (!toolbar) { // 如果没有 toolbar
		return false;
	} else { // 如果有 toolbar
		let quickBookmarkId = 'quickBookmarkElement';
		let quickBookmarkElement = document.querySelector(`#${quickBookmarkId}`);
		if (!quickBookmarkElement) { // 如果没有 quick 元素则添加
			let pinkClass = '_20nOYr7';
			let heartA = toolbar.childNodes[2].querySelector('svg');

			let quickBookmarkElement = document.createElement('div');
			quickBookmarkElement.id = quickBookmarkId;
			quickBookmarkElement.innerHTML = '✩';
			quickBookmarkElement.title = xzlt('_快速收藏');
			quickBookmarkElement.style.fontSize = '34px';
			quickBookmarkElement.style.lineHeight = '30px';
			quickBookmarkElement.style.marginRight = '15px';
			quickBookmarkElement.style.cursor = 'pointer';
			quickBookmarkElement.style.display = 'none';
			toolbar.insertBefore(quickBookmarkElement, toolbar.childNodes[3]);
			quickBookmarkElement.addEventListener('click', () => {
				let now_id = location.search.match(/illust_id=.*\d?/)[0].split('=')[1];
				let tagArray = [];
				let tagElements = document.querySelectorAll('._3SAblVQ li');
				for (const element of tagElements) {
					let now_a = element.querySelector('a');
					if (now_a) {
						tagArray.push(now_a.innerHTML); // 储存 tag
					}
				}
				// 对于原创作品，非日文的页面上只显示了用户语言的“原创”，其实有个隐藏的日文 tag “オリジナル”，所以要添加上。
				if (tagArray[0] === '原创' || tagArray[0] === 'Original' || tagArray[0] === '창작') {
					tagArray.push('オリジナル');
				}
				let tagString = encodeURI(tagArray.join(' '));
				let tt = '';
				// 从含有 globalInitData 信息的脚本里，匹配 token 字符串
				let reg_token = document.querySelectorAll('script')[8].innerHTML.match(/(?<=token:\W").*?(?=")/);
				if (reg_token.length > 0) {
					tt = reg_token[0];
				} else {
					console.log('获取 token 失败');
				}
				// 调用添加收藏的 api
				fetch('https://www.pixiv.net/rpc/index.php', {
						method: 'post',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						credentials: 'include', // 附带 cookie
						body: `mode=save_illust_bookmark&illust_id=${now_id}&restrict=0&comment=&tags=${tagString}&tt=${tt}`
					})
					.then(function (response) {
						response.text()
							.then(function (data) {
								if (response.ok) {
									data = JSON.parse(data);
									if (data.error !== undefined && data.error === false) {
										// console.log('收藏成功');
										// 如果已经收藏过了，则隐藏 quick 元素
										quickBookmarkElement.style.color = '#FF4060';
										quickBookmarkElement.style.display = 'none';
										heartA.classList.add(pinkClass); // 添加这个 class 变红
									}
								} else {
									// 失败 如 403 404
								}
							});
					});
			});
			// 刚添加之后是隐藏的，之后检测一下，如果没有收藏再显示
			setTimeout(() => {
				if (!heartA.classList.contains(pinkClass)) {
					quickBookmarkElement.style.display = 'block';
				}
			}, 100);
			// 这里加一点延时，防止判断的太早，那样可能判断时收藏图标还没变红，产生误判
		} else { // 如果有 quick 元素，什么都不做
			return false;
		}
	}
}

// 初始化图片查看器
function initViewer() {
	if (!viewer_enable) {
		return false;
	}
	if (!viewerELCreated) {
		createViewer();
		return false;
	}
	if (viewerELCreated) { // 每次被调用时，如果一切都准备好了，则更新数据
		updateViewer();
	}
}

// 创建图片查看器 html 元素，并绑定一些事件，这个函数只会执行一次
function createViewer() {
	if (!document.querySelector('._290uSJE')) { // 如果图片中间部分的元素还未生成，则过一会儿再检测
		setTimeout(() => {
			createViewer();
		}, 200);
		return false;
	}
	// 图片列表样式
	let viewerStyle = `
		<style>
		#viewerWarpper {
			margin:24px auto 15px;
			overflow: hidden;
			background: #fff;
			padding: 0 16px;
			display: none;
			border-top: 1px solid #eee;
			border-bottom: 1px solid #eee;
		}
		#viewerWarpper ul {
			max-width:568px;
			margin:24px auto;
			padding: 0 16px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: nowrap;
			overflow: auto;
		}
		#viewerWarpper li {
			display: flex;
			flex-shrink: 0;
			margin-right: 8px;
			overflow: hidden;
		}
		#viewerWarpper li img {
			cursor: pointer;
			max-height: 144px;
			width: auto;
		}
		</style>
		`;
	document.body.insertAdjacentHTML('beforeend', viewerStyle);
	// 图片列表 html 结构： div#viewerWarpper > ul > li > img
	viewerWarpper = document.createElement('div');
	viewerWarpper.id = 'viewerWarpper';
	viewerUl = document.createElement('ul');
	viewerWarpper.appendChild(viewerUl);
	document.querySelector('._290uSJE').insertBefore(viewerWarpper, document.querySelector('._1Hctrfm'));

	viewerELCreated = true;

	// 覆写 Viewer.js 的部分样式
	let over_viewer_style = `
		<style>
		.viewer-backdrop{
			background: rgba(0, 0, 0, .8);
		}
		.viewer-toolbar .viewer-prev {
			background-color: rgba(0, 0, 0, .8);
			border-radius: 50%;
			cursor: pointer;
			height: 100px;
			overflow: hidden;
			position: fixed;
			left: -70px;
			top: 40%;
			width: 100px;
		  }
		  .viewer-toolbar .viewer-prev::before {
			top: 40px;
			left: 70px;
			position: absolute;
		  }

		  .viewer-toolbar .viewer-next {
			background-color: rgba(0, 0, 0, .8);
			border-radius: 50%;
			cursor: pointer;
			height: 100px;
			overflow: hidden;
			position: fixed;
			right: -70px;
			top: 40%;
			width: 100px;
		  }
		  .viewer-toolbar .viewer-next::before {
			left: 10px;
			top: 40px;
			position: absolute;
		  }
		  .black-background{
			  background: rgba(0, 0, 0, 1);
		  }
		</style>
		`;
	document.body.insertAdjacentHTML('beforeend', over_viewer_style);

	// 缩放时显示或隐藏某些元素，本来想超过100%自动进入全屏，但是全屏必须要用户操作才行
	// viewerUl.addEventListener('zoom', function () {
	// 	if (event.detail.ratio >= 1) { // 缩放达到或超过100%（或者点击1:1按钮时）
	// 		// 隐藏查看器的其他元素
	// 		hideViewerOther();
	// 	} else { // 显示查看器的其他元素
	// 		showViewerOther();
	// 	}
	// });

	// 图片查看器显示之后
	viewerUl.addEventListener('shown', function () {
		// 显示相关元素
		showViewerOther();
		// 绑定点击全屏事件
		document.querySelector('.viewer-one-to-one').addEventListener('click', () => {
			hideViewerOther(); // 隐藏查看器的其他元素
			launchFullScreen(document.body); // 进入全屏
			setTimeout(() => { // 使图片居中显示，必须加延迟
				setViewerCenter();
			}, 100);
		});
	});

	// 全屏状态下，查看器查看和切换图片时，始终显示为100%
	viewerUl.addEventListener('view', function () {
		if (isFullscreen()) {
			setTimeout(() => { // 通过点击 1:1 按钮，调整为100%并居中。这里必须要加延时，否则点击的时候图片还是旧的
				document.querySelector('.viewer-one-to-one').click();
			}, 50);
		}
	});

	// 查看器隐藏时，如果还处于全屏，则退出全屏
	viewerUl.addEventListener('hidden', function () {
		if (isFullscreen()) {
			exitFullscreen();
		}
	});

	// esc 退出图片查看器
	document.addEventListener('keyup', function (event) {
		let e = event || window.event;
		if (e.keyCode == 27) { // 按下 esc
			// 如果非全屏，且查看器已经打开，则退出查看器
			if (!isFullscreen() && viewerIsShow()) {
				document.querySelector('.viewer-close').click();
			}
		}
	});

	updateViewer();
}

// 更新图片查看器的图片列表
function updateViewer() {
	// 每次要更新的时候，先隐藏 viewerWarpper
	viewerWarpper.style.display = 'none';
	let now_id = location.search.match(/\d.*\d/)[0];
	fetch('https://www.pixiv.net/ajax/illust/' + now_id, {
			method: 'get',
			credentials: 'include', // 附带 cookie
		})
		.then(function (response) {
			response.text()
				.then(function (data) {
					let this_one_data = JSON.parse(data).body;
					if (this_one_data.illustType === 0 || this_one_data.illustType === 1) { // 单图或多图，0插画1漫画2动图（1的如68430279）
						if (this_one_data.pageCount > 1) { // 多图
							// 当作品类型为 插画或者漫画，并且是多图时，才会产生缩略图
							let urls_thumb = this_one_data.urls.thumb;
							// https://i.pximg.net/c/240x240/img-master/img/2017/11/28/00/23/44/66070515_p0_master1200.jpg
							let urls_original = this_one_data.urls.original;
							// https://i.pximg.net/img-original/img/2017/11/28/00/23/44/66070515_p0.png
							let length = this_one_data.pageCount;
							let viewerList = '';
							for (let index = 0; index < length; index++) {
								let pageNo = 'p' + index;
								viewerList += `<li><img src="${urls_thumb.replace('p0',pageNo)}" data-src="${urls_original.replace('p0',pageNo)}"></li>`;
							}
							viewerUl.innerHTML = viewerList;
							// 数据更新后，显示 viewerWarpper
							viewerWarpper.style.display = 'block';
							// 销毁看图组件
							if (myViewer) {
								myViewer.destroy();
							}
							// 重新配置看图组件
							myViewer = new Viewer(viewerUl, {
								toolbar: {
									zoomIn: 0,
									zoomOut: 0,
									oneToOne: 1,
									reset: 0,
									prev: 1,
									play: {
										show: 0,
										size: 'large',
									},
									next: 1,
									rotateLeft: 0,
									rotateRight: 0,
									flipHorizontal: 0,
									flipVertical: 0,
								},
								url(image) {
									return image.getAttribute('data-src');
								},
								transition: false, // 取消一些动画，比如切换图片时，图片从小变大出现的动画
								keyboard: false, // 取消键盘支持，主要是用键盘左右方向键切换的话，会和 pixiv 页面产生冲突。（pixiv 页面上，左右方向键会切换作品）
								title: false, // 不显示 title（图片名和宽高信息）
								tooltip: false, // 不显示缩放比例
							});
						}
					}
				});
		});
}

// 隐藏查看器的其他元素
function hideViewerOther() {
	document.querySelector('.viewer-container').classList.add('black-background');
	document.querySelector('.viewer-close').style.display = 'none';
	// 隐藏底部的其他元素，仍然显示左右切换按钮
	document.querySelector('.viewer-one-to-one').style.display = 'none';
	document.querySelector('.viewer-navbar').style.display = 'none';
}

// 显示查看器的其他元素
function showViewerOther() {
	document.querySelector('.viewer-container').classList.remove('black-background');
	document.querySelector('.viewer-close').style.display = 'block';
	document.querySelector('.viewer-one-to-one').style.display = 'block';
	document.querySelector('.viewer-navbar').style.display = 'block';
}

// 在图片100%显示时，使其居中
function setViewerCenter() {
	// 获取图片宽高
	let imgInfo = document.querySelector('.viewer-title').innerHTML;
	if (!imgInfo) { // 但是如果图片尚未加载出来的话，就没有内容，就过一会儿再执行
		setTimeout(() => {
			setViewerCenter();
		}, 200);
		return false;
	}
	let imgSize = imgInfo.match(/\(.*\)/)[0].replace(/\(|\)| /g, '').split('×');
	// > '66360324_p5_master1200.jpg (919 × 1300)'
	// < [919,1300]
	let imgWidth = imgSize[0];
	let imgHeight = imgSize[1];
	myViewer.zoomTo(1);
	// 获取网页宽高
	let htmlWidth = document.documentElement.clientWidth;
	let htmlHeight = document.documentElement.clientHeight;
	// 设置边距
	let setWidth = (htmlWidth - imgWidth) / 2;
	let setHeight = (htmlHeight - imgHeight) / 2;
	if (setHeight < 0) { // 当图片高度大于浏览器窗口高度时，居顶显示而不是居中
		setHeight = 0;
	}
	myViewer.moveTo(setWidth, setHeight);
}

// 进入全屏
function launchFullScreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
}

// 退出全屏
function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozExitFullScreen) {
		document.mozExitFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
}

// 全屏状态变化时的处理
function changeFullscreen() {
	if (isFullscreen()) { // 进入全屏

	} else { // 退出全屏
		showViewerOther();
	}
}

// 判断是否处于全屏状态
function isFullscreen() {
	return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false;
}

function viewerIsShow() {
	let viewer_container = document.querySelector('.viewer-container');
	if (viewer_container) {
		return viewer_container.classList.contains('viewer-in');
	} else {
		return false;
	}
}

// 检测全屏状态变化，绑定的事件有兼容性问题（这里也相当于绑定了 esc 按键事件）
// fullscreenchange/webkitfullscreenchange/mozfullscreenchange
// 标准的 fullscreenchange 至今没有支持
document.addEventListener('webkitfullscreenchange', () => {
	changeFullscreen();
});
document.addEventListener('mozfullscreenchange', () => {
	changeFullscreen();
});

// 修改title
function changeTitle(string) {
	// 本脚本的提醒会以 [string] 形式添加到title最前面
	/*
	0	复原
	↑	抓取中
	→	等待下一步操作（tag搜索页）
	▶ 	准备下载
	↓	下载中
	║	下载暂停
	■	下载停止
	√	下载完毕
	*/
	if (string === '0') {
		clearInterval(title_timer);
		document.title = old_title;
		return false;
	}
	if (document.title[0] !== '[') { // 如果当前title里没有本脚本的提醒，就存储当前title为旧title
		old_title = document.title;
	}
	let new_title = `[${string}] ${old_title}`;
	document.title = new_title;
	// 当可以执行下一步操作时，闪烁提醒
	if (string === '▶' || string === '→') {
		title_timer = setInterval(function () {
			if (document.title.indexOf(string) > -1) {
				document.title = new_title.replace(string, ' ');
			} else {
				document.title = new_title;
			}
		}, 500);
	} else {
		clearInterval(title_timer);
	}
}

// 添加过滤作品类型的按钮
function setNotDownType(no) {
	let notDownType = document.createElement('div');
	notDownType.id = 'notDownType';
	xz_btns_con.appendChild(notDownType);
	$(notDownType).text(xzlt('_过滤作品类型的按钮'));
	$(notDownType).attr('title', xzlt('_过滤作品类型的按钮_title'));
	setButtonStyle(notDownType, no, '#DA7002');
	notDownType.addEventListener('click', function () {
		notdown_type = prompt(xzlt('_过滤作品类型的弹出框文字'), '');
		if (notdown_type === null) { //如果取消设置，则将返回值null改为字符串，不然无法使用indexOf
			notdown_type = '';
		}
	}, false);
}

// 检查排除作品类型的参数是否合法
function checkNotDownType_tips() {
	if (notdown_type !== '') {
		if (notdown_type.indexOf('1') > -1 && notdown_type.indexOf('2') > -1 && notdown_type.indexOf('3') > -1 && notdown_type.indexOf('4') > -1) {
			alert(xzlt('_check_notdown_type_result1_弹窗'));
			$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_check_notdown_type_result1_html') + '<br><br>');
			return false;
		} else if (notdown_type.indexOf('1') === -1 && notdown_type.indexOf('2') === -1 && notdown_type.indexOf('3') === -1 && notdown_type.indexOf('4') === -1) {
			alert(xzlt('_check_notdown_type_result2_弹窗'));
			$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_check_notdown_type_result1_html') + '<br><br>');
			return false;
		} else {
			$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_check_notdown_type_result3_html') + notdown_type.replace('1', xzlt('_单图')).replace('2', xzlt('_多图')).replace('3', xzlt('_动图')).replace('4', xzlt('_已收藏的作品')));
		}
	}
}

// 检查作品是否符合过滤类型。所有添加了setNotDownType按钮的都要到这里检查一遍
function checkNotDownType_result(string, url, bookmarked) {
	if (bookmarked === true && notdown_type.indexOf('4') > -1) { //如果已经收藏并且设置了排除收藏的作品
		return false;
	}
	if (string.indexOf('multiple') > -1) { //如果是多图并且没有排除多图
		if (notdown_type.indexOf('2') === -1) {
			illust_url_list.push(url);
		}
	} else if (string.indexOf('ugoku-illust') > -1) { //如果是动图并且没有排除动图
		if (notdown_type.indexOf('3') === -1) {
			illust_url_list.push(url);
		}
	} else { //如果是单图并且没有排除单图（包括mode=big）
		if (notdown_type.indexOf('1') === -1) {
			illust_url_list.push(url);
		}
	}
}
// 检查是否设置了多图作品的张数限制
function check_multiple_down_number_tips() {
	if (multiple_down_number > 0) {
		$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_多图作品下载张数', multiple_down_number));
	}
}
//添加过滤tag的按钮
function setFilterTag_notNeed(no) {
	let nottag = document.createElement('div');
	nottag.id = 'nottag';
	xz_btns_con.appendChild(nottag);
	$(nottag).text(xzlt('_排除tag的按钮文字'));
	$(nottag).attr('title', xzlt('_排除tag的按钮_title'));
	setButtonStyle(nottag, no, '#e42a2a');

	let nottaginput = document.createElement('textarea');
	nottaginput.id = 'nottaginput';
	nottaginput.style.cssText = 'width: 600px;height: 40px;font-size: 12px;margin:6px auto;background:#fff;colir:#bbb;padding:7px;display:none;border:1px solid #e42a2a;';
	$('#root').children().eq(0).before(nottaginput);
	notNeed_tag_tip = xzlt('_排除tag的提示文字');
	$('#nottaginput').val(notNeed_tag_tip);
	$.focusblur($('#nottaginput'), '#bbb', '#333');

	nottag.addEventListener('click', function () {
		$('#nottaginput').toggle();
		if ($('#nottaginput').is(':visible')) {
			$('#nottaginput').css('display', 'block');
			document.documentElement.scrollTop = 0;
		}
	}, false);
}

// 获取要排除的tag
function get_NotNeed_Tag() {
	if ($('#nottaginput').val() !== notNeed_tag_tip) {
		notNeed_tag = $('#nottaginput').val().split(',');
		if (notNeed_tag[notNeed_tag.length - 1] === '') { //处理最后一位是逗号的情况
			notNeed_tag.pop();
		}
		$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_设置了排除tag之后的提示') + notNeed_tag.join(','));
		now_tips = $('#outputInfo').html();
	} else { //如果没有设置tag，则重置
		notNeed_tag = [];
	}
}

//添加必须的tag的按钮
function setFilterTag_Need(no) {
	let needtag = document.createElement('div');
	needtag.id = 'needtag';
	xz_btns_con.appendChild(needtag);
	$(needtag).text(xzlt('_必须tag的按钮文字'));
	$(needtag).attr('title', xzlt('_必须tag的按钮_title'));
	setButtonStyle(needtag, no, '#00A514');

	let needtaginput = document.createElement('textarea');
	needtaginput.id = 'needtaginput';
	needtaginput.style.cssText = 'width: 600px;height: 40px;font-size: 12px;margin:6px auto;background:#fff;colir:#bbb;padding:7px;display:none;border:1px solid #00A514;';
	$('#root').children().eq(0).before(needtaginput);
	need_tag_tip = xzlt('_必须tag的提示文字');
	$('#needtaginput').val(need_tag_tip);
	$.focusblur($('#needtaginput'), '#bbb', '#333');

	needtag.addEventListener('click', function () {
		$('#needtaginput').toggle();
		if ($('#needtaginput').is(':visible')) {
			$('#needtaginput').css('display', 'block');
			document.documentElement.scrollTop = 0;
		}
	}, false);
}

// 获取必须包含的tag
function get_Need_Tag() {
	if ($('#needtaginput').val() !== need_tag_tip) {
		need_tag = $('#needtaginput').val().split(',');
		if (need_tag[need_tag.length - 1] === '') { //处理最后一位是逗号的情况
			need_tag.pop();
		}
		$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_设置了必须tag之后的提示') + need_tag.join(','));
	} else { //如果没有设置tag，则重置
		need_tag = [];
	}
}

// 添加筛选宽高的按钮
function setFilterWH(no) {
	let filterWHBotton = document.createElement('div');
	filterWHBotton.id = 'filterWHBotton';
	xz_btns_con.appendChild(filterWHBotton);
	$(filterWHBotton).text(xzlt('_筛选宽高的按钮文字'));
	$(filterWHBotton).attr('title', xzlt('_筛选宽高的按钮_title'));
	setButtonStyle(filterWHBotton, no, '#179FDD');

	filterWHBotton.addEventListener('click', function () {
		let inputWH = prompt(xzlt('_筛选宽高的提示文字'), filterWH.width + filterWH.and_or + filterWH.height);
		if (inputWH === null) {
			return false;
		}
		if (inputWH === '' || (inputWH.indexOf('|') === -1 && inputWH.indexOf('&') === -1) || (inputWH.indexOf('|') > -1 && inputWH.indexOf('&') > -1)) { //如果为空值，或没有输入任意一个分隔符号，或者同时输入了两个分隔符
			alert(xzlt('_本次输入的数值无效'));
			return false;
		} else {
			let and_or = '';
			if (inputWH.indexOf('|') > -1) { //如果关系为or
				and_or = '|';
				inputWH = inputWH.split('|');
			} else if (inputWH.indexOf('&') > -1) { //如果关系为and
				and_or = '&';
				inputWH = inputWH.split('&');
			}
			let width = parseInt(inputWH[0]);
			let height = parseInt(inputWH[1]);
			if (isNaN(width) || isNaN(height)) { //检查输入的是否是有效数字
				alert(xzlt('_本次输入的数值无效'));
				return false;
			} else { //检查通过
				filterWH.and_or = and_or;
				filterWH.width = width;
				filterWH.height = height;
				is_set_filterWH = true;
				alert(xzlt('_设置成功'));
			}
		}
	}, false);
}

// 检查过滤宽高的设置
function checkSetWH() {
	if (page_type !== 5 && is_set_filterWH) { // 排除tag搜索页，因为tag搜索页的宽高设置在startGet里不生效
		let and_or = filterWH.and_or;
		$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_设置了筛选宽高之后的提示文字p1') + filterWH.width + and_or.replace('|', xzlt('_或者')).replace('&', xzlt('_并且')) + xzlt('_高度设置') + filterWH.height);
	}
}

// 添加筛选收藏数的按钮
function setFilterBMK(no) {
	let filterBMKBotton = document.createElement('div');
	filterBMKBotton.id = 'filterBMKBotton';
	xz_btns_con.appendChild(filterBMKBotton);
	$(filterBMKBotton).text(xzlt('_筛选收藏数的按钮文字'));
	$(filterBMKBotton).attr('title', xzlt('_筛选收藏数的按钮_title'));
	setButtonStyle(filterBMKBotton, no, '#179FDD');

	filterBMKBotton.addEventListener('click', function () {
		let inputBMK = parseInt(prompt(xzlt('_筛选收藏数的提示文字'), '0'));
		if (inputBMK === '' || isNaN(inputBMK) || inputBMK < 0) { //如果为空值，或者不为数字
			alert(xzlt('_本次输入的数值无效'));
			return false;
		} else {
			filterBMK = inputBMK;
			is_set_filterBMK = true;
			alert(xzlt('_设置成功'));
		}
	}, false);
}

// 检查过滤收藏数的设置
function checkSetBMK() {
	if (page_type !== 5 && is_set_filterBMK) { // 排除tag搜索页，因为tag搜索页的宽高设置在startGet里不生效
		$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_设置了筛选收藏数之后的提示文字') + filterBMK);
	}
}

// 给tag搜索页的作品绑定删除属性
function tagSearchDel() {
	let all_works = $(tag_search_list_selector);
	if (all_works.length === 0) { // 有时执行时列表还没加载出来，需要延时。目前tag搜索页是这样
		setTimeout(tagSearchDel, 1000);
		return false;
	} else {
		for (let i = 0; i < all_works.length; i++) {
			let now_works = all_works.eq(i);
			if (!now_works.attr('data-del')) {
				now_works.attr('data-del', '');
				now_works.bind('click', function () {
					if ($('#deleteBotton').attr('data_del') === '1') {
						this.remove();
						if (allow_work) {
							outputNowResult();
						}
						return false;
					}
				});
			}
		}
	}
}

//专辑里面的页面大量使用无刷新加载技术，所以专辑里的所有页面都需要监听url的改变。
let element = document.createElement('script');
element.setAttribute('type', 'text/javascript');
element.innerHTML = `let _wr = function (type) {
						let orig = history[type];
						return function () {
							let rv = orig.apply(this, arguments);
							let e = new Event(type);
							e.arguments = arguments;
							window.dispatchEvent(e);
							return rv;
						};
					};
					history.pushState = _wr('pushState');
					history.replaceState = _wr('replaceState');`;
document.head.appendChild(element);

// 下载相似作品、相关作品时，设置要下载的个数
function set_requset_num() {
	max_num = 300; //设置最大允许获取多少个作品。这个数字是可以改的，比如500,1000，这里限制为300。
	requset_number = parseInt(window.prompt(xzlt('_要获取的作品个数') + max_num, '60'));
	if (isNaN(requset_number) || requset_number <= 0) {
		alert(xzlt('_参数不合法1'));
		requset_number = 0; // 重置
		return false;
	} else if (requset_number > max_num) {
		alert(xzlt('_超过最大值') + max_num);
		requset_number = 0; // 重置
		return false;
	}
}

// 获取作品页信息出错，如404
function illust_error(url) {
	if (page_type === 1 && !down_xiangguan) { // 在作品页内下载时，设置的want_page其实是作品数
		if (want_page > 0) {
			want_page--;
		}
		// 在作品页内下载时，如果出现了无法访问的作品时，就获取不到接下来的作品了，直接结束。
		$(outputInfo).html($(outputInfo).html() + '<br>' + xzlt('_无权访问1', url) + '<br>');
		allow_work = true;
		allWorkFinished();
	} else { // 跳过当前作品
		$(outputInfo).html($(outputInfo).html() + '<br>' + xzlt('_无权访问2', url) + '<br>');
		if (illust_url_list.length > 0) { //如果存在下一个作品，则
			getIllustPage(illust_url_list[0]);
		} else { //没有剩余作品
			ajax_threads_finished++;
			if (ajax_threads_finished === ajax_for_illust_threads) { //如果所有并发请求都执行完毕
				ajax_threads_finished = 0; //复位
				allow_work = true;
				allWorkFinished();
			}
		}
	}
}
// 根据对象的属性排序
function sortByProperty(propertyName) {
	return function (object1, object2) {
		let value1 = object1[propertyName];
		let value2 = object2[propertyName];
		if (value2 < value1) { //倒序排列
			return -1;
		} else if (value2 > value1) {
			return 1;
		} else {
			return 0;
		}
	};
}

// 对结果列表进行排序
function listSort() {
	imgList.sort(sortByProperty('num'));
	$(tag_search_list_selector).remove();
	for (let i = 0; i < imgList.length; i++) {
		$('#js-react-search-mid ._1BUAfFH').append(imgList[i].e);
	}
}

// tag搜索页的筛选任务执行完毕
function tagSearchPageFinished() {
	allow_work = true;
	// listPage_finished=0; //不注释掉的话，每次添加筛选任务都是从当前页开始，而不是一直往后累计
	listPage_finished2 = 0; //重置已抓取的页面数量
	listSort();
	changeTitle('→');
	if (use_alert) {
		alert(xzlt('_本次任务已全部完成'));
	}
	tagSearchDel();
}

// 检查用户输入的要获取的页数的参数
function check_want_page_rule1(input_tip, error_tip, start1_tip, start2_tip) {
	if (page_type === 2 || page_type === 3 || page_type === 4) {
		if (document.querySelector('.next ._button') === null) { // 如果没有下一页按钮，则自动设置为1
			want_page = 1;
		}
	}
	if (want_page !== 1) {
		want_page = prompt(input_tip, '-1');
	}
	if (~~Number(want_page) < 1 && want_page !== '-1') { //比1小的数里，只允许-1, 0也不行
		$('#outputInfo').html($('#outputInfo').html() + error_tip);
		return false;
	}
	if (~~Number(want_page) >= 1) {
		want_page = ~~Number(want_page);
		$('#outputInfo').html($('#outputInfo').html() + start1_tip.replace('-num-', want_page));
		return true;
	} else if (want_page === '-1') {
		want_page = -1;
		$('#outputInfo').html($('#outputInfo').html() + start2_tip);
		return true;
	}
}

// 显示调整后的列表数量，仅在某些页面中使用
function outputNowResult() {
	addOutputInfo();
	let now_output_info = $('#outputInfo').html();
	$('#outputInfo').html(now_output_info + xzlt('_调整完毕', $(tag_search_list_selector + ':visible').length) + '<br>');
}

// 添加图片信息
function addImgInfo(id, imgUrl, title, nowAllTag, user, userid, fullWidth, fullHeight, ext, bmk) {
	img_info.push({
		id: id,
		url: imgUrl,
		title: title,
		tags: nowAllTag,
		user: user,
		userid: userid,
		fullWidth: fullWidth,
		fullHeight: fullHeight,
		ext: ext,
		bmk: bmk
	});
}

// 在pixiv专辑里判断是否应该隐藏下载面板。进行过专辑类型检查之后会传参。初步检查url的时候没有参数
function is_show_downloader(bool) {
	old_title = document.title;
	changeTitle('0');
	if (bool === true) {
		xianzun_btns_wrap.style.display = 'block';
	} else if (bool === false) {
		xianzun_btns_wrap.style.display = 'none';
	} else {
		if (window.location.href.indexOf('/a/') > -1) { // 在子页面正常执行代码
			xianzun_btns_wrap.style.display = 'block';
			// 判断pixiv专辑类型，如果是插画就下载，其他类型则隐藏下载面板。因为内容是异步加载，需要模拟请求
			let showcase_id = /\d.*\d/.exec(window.location.pathname)[0];
			let tt = $('input[name=tt]')[0].value; //取出token
			$.ajax({
				url: 'https://www.pixiv.net/ajax/showcase/article?article_id=' + showcase_id + '&tt=' + tt,
				type: 'get',
				dataType: 'json',
				success: function (data) {
					if (data.body[0].subCategory === 'illustration') { // 是插画
						is_show_downloader(true);
						// 当前专辑发生变化时，拼接出每个图片的作品页url
						illust_url_list = [];
						let illusts_list = data.body[0].illusts;
						for (let i = 0; i < illusts_list.length; i++) {
							illust_url_list.push('https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + illusts_list[i].illust_id);
						}
					} else {
						is_show_downloader(false);
					}
				}
			});
		} else { // 如果不在子页面，则隐藏下载面板
			xianzun_btns_wrap.style.display = 'none';
		}
	}
}

// 启动抓取
function startGet() {
	if (!allow_work || download_started) {
		alert(xzlt('_当前任务尚未完成1'));
		return false;
	}

	addOutputInfo();

	// 设置要获取的作品数或页数
	if (page_type === 1) {
		if (quick) { // 快速下载
			want_page = 1;
		} else if (!down_xiangguan) { // 手动设置下载页数
			let result = check_want_page_rule1(
				xzlt('_check_want_page_rule1_arg1'),
				xzlt('_check_want_page_rule1_arg2'),
				xzlt('_check_want_page_rule1_arg3'),
				xzlt('_check_want_page_rule1_arg4')
			);
			if (!result) {
				return false;
			}
		}
	} else if (page_type === 2 || page_type === 3 || page_type === 4) {
		want_page = 0; // 每次点击时需要重新询问下载页数，否则就一直按之前设置的了
		let result = check_want_page_rule1(
			xzlt('_check_want_page_rule1_arg5'),
			xzlt('_check_want_page_rule1_arg2'),
			xzlt('_check_want_page_rule1_arg6'),
			xzlt('_check_want_page_rule1_arg7')
		);
		if (!result) {
			return false;
		}
	} else if (page_type === 5) {
		$('._premium-lead-popular-d-body').remove(); // 去除热门作品一栏
		let userset = prompt(xzlt('_请输入最低收藏数和要抓取的页数'), '1000,1000');
		want_favorite_number = Number(userset.split(',')[0]);
		want_page = Number(userset.split(',')[1]);
		if (isNaN(want_favorite_number) || want_favorite_number <= 0 || isNaN(want_page) || want_favorite_number <= 0) {
			alert(xzlt('_参数不合法1'));
			return false;
		}
		$('#outputInfo').html($('#outputInfo').html() + xzlt('_tag搜索任务开始', want_favorite_number, want_page));
		if (!listPage_finished) { //如果是首次抓取 则处理当前页面
			$(tag_search_list_selector).remove(); // 移除当前列表内容
			$('body').append('<div id="tag_search_temp_result" style="display:none"></div>');
			tag_search_temp_result = $('#tag_search_temp_result');
		}
	} else if (page_type === 10) {
		want_page = parseInt(window.prompt(xzlt('_want_page_弹出框文字_page_type10') + max_num, '10'));
		if (isNaN(want_page)) {
			alert(xzlt('_参数不合法1'));
			return false;
		} else if (want_page > max_num) {
			alert(xzlt('_输入超过了最大值') + max_num);
			return false;
		} else {
			$('#outputInfo').html($('#outputInfo').html() + xzlt('_任务开始1', want_page));
		}
	}
	if (page_type === 7) {
		listPage_finished = 0;
	}
	// 检查是否设置了不下载的作品类型
	checkNotDownType_tips();
	// 检查是否设置了多图作品的张数限制
	check_multiple_down_number_tips();
	// 检查是否设置了宽高条件
	checkSetWH();
	// 检查是否设置了收藏数要求
	checkSetBMK();
	// 获取要排除的tag
	get_NotNeed_Tag();
	// 获取必须包含的tag
	get_Need_Tag();

	now_tips = $(outputInfo).html();
	resetResult();
	if (page_type !== 6) {
		allow_work = false; //开始执行时更改许可状态
	}

	if (page_type === 0 || page_type === 12) {
		$(outputInfo).html($(outputInfo).html() + xzlt('_开始获取作品页面'));
		getListUrlFinished(); //通过id抓取时，或者showcase 特辑，不需要获取列表页
	} else if (page_type === 1) {
		if (down_xiangguan) { // 下载相关作品
			getListPage();
		} else {
			getIllustPage(window.location.href); //开始获取图片。因为新版作品页切换作品不需要刷新页面了，所以要传递实时的url。
		}
	} else if (page_type === 6) {
		getListPage2();
	} else {
		getListPage(); //开始获取列表页
	}
}

// 获取作品列表页
function getListPage() {
	changeTitle('↑');
	let url;
	if (page_type === 9 || down_xiangguan) {
		let id; //取出作品id
		if (location.href.indexOf('recommended.php') > -1) { // '为你推荐'里面的示例作品id为'auto'
			id = 'auto';
		} else {
			id = location.href.split('id=')[1]; // 作品页的url需要实时获取
		}
		url = '/rpc/recommender.php?type=illust&sample_illusts=' + id + '&num_recommendations=' + requset_number; //获取相似的作品
	} else if (page_type === 11) { // 对于发现图片，仅下载已有部分，所以不需要去获取列表页了。
		let now_illust = $(tag_search_list_selector); //获取已有作品
		for (let i = 0; i < now_illust.length; i++) { //拼接作品的url
			// discovery列表的url也是有额外后缀的，需要去掉
			illust_url_list.push(now_illust.eq(i).find('a').eq(0).attr('href').split('&uarea')[0]);
		}
		$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_列表页获取完成2', illust_url_list.length));
		getListUrlFinished();
		return false;
	} else {
		url = base_url + (startpage_no + listPage_finished);
	}
	$.ajax({
		url: url,
		type: 'get',
		async: true,
		cache: false,
		dataType: 'text',
		success: function (data) {
			listPage_finished++;
			let listPage_document;
			if (page_type !== 7 && page_type !== 9 && !down_xiangguan) { // 排行榜和相似作品、相关作品，直接获取json数据，不需要解析为DOM
				listPage_document = $(parser.parseFromString(data, 'text/html'));
			}
			let allPicArea;
			if (page_type === 5) { // tag搜索页
				listPage_finished2++;
				let this_one_info;
				this_one_info = listPage_document.find(tag_search_lv1_selector).attr('data-items'); // 保存这一次的信息
				this_one_info = JSON.parse(this_one_info); // 转化为数组
				for (let j = 0; j < this_one_info.length; j++) {
					// 拼接每个作品的html
					let new_html = tag_search_new_html;
					let pageCount = parseInt(this_one_info[j]['pageCount']); // 包含的图片数量
					if (pageCount > 1) { // 多图
						new_html = new_html.replace('<!--xz_multiple_html-->', xz_multiple_html);
					}
					let illustType = this_one_info[j]['illustType']; // 作品类型 0 插画 1 漫画 2 动图
					if (illustType === '2') { // 动图
						new_html = new_html.replace('<!--xz_gif_html-->', xz_gif_html);
					}
					if (this_one_info[j]['isBookmarked']) { // 是否已收藏
						new_html = new_html.replace(/xz_isBookmarked/g, 'on');
					}
					// 填充内容
					new_html = new_html.replace(/xz_illustId/g, this_one_info[j]['illustId']);
					new_html = new_html.replace(/xz_pageCount/g, this_one_info[j]['pageCount']);
					if (tag_search_show_img) {
						new_html = new_html.replace(/xz_url/g, this_one_info[j]['url']);
					}
					new_html = new_html.replace(/xz_illustTitle/g, this_one_info[j]['illustTitle']);
					new_html = new_html.replace(/xz_userId/g, this_one_info[j]['userId']);
					new_html = new_html.replace(/xz_userName/g, this_one_info[j]['userName']);
					new_html = new_html.replace(/xz_userImage/g, this_one_info[j]['userImage']);
					new_html = new_html.replace(/xz_bookmarkCount/g, this_one_info[j]['bookmarkCount']);
					// 设置宽高
					let ture_width = parseInt(this_one_info[j]['width']);
					let ture_height = parseInt(this_one_info[j]['height']);
					let max_width = '198';
					let max_height = '198';
					if (ture_width >= ture_height) {
						new_html = new_html.replace(/xz_width/g, max_width);
						new_html = new_html.replace(/xz_height/g, 'auto');
					} else {
						new_html = new_html.replace(/xz_width/g, 'auto');
						new_html = new_html.replace(/xz_height/g, max_height);
					}
					tag_search_new_html_one_page += new_html;
				}
				tag_search_temp_result.html(tag_search_new_html_one_page);
				tag_search_new_html_one_page = '';
				allPicArea = tag_search_temp_result.find(tag_search_lv2_selector);
				for (let i = 0; i < allPicArea.length; i++) {
					let now_id = this_one_info[i]['illustId'];
					let shoucang = this_one_info[i]['bookmarkCount'];
					if (shoucang >= want_favorite_number) {
						imgList.push({
							'id': now_id,
							'e': allPicArea[i],
							'num': Number(shoucang)
						});
						$(window.top.document).find(tag_search_lv1_selector).after(allPicArea[i]);
					}
				}
				tag_search_temp_result.html('');
				$('#outputInfo').html(now_tips + '<br>' + xzlt('_tag搜索页已抓取多少页', listPage_finished2, want_page, startpage_no + listPage_finished - 1));
				//判断任务状态
				if (listPage_finished2 == want_page) {
					allow_work = true;
					$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_tag搜索页任务完成1', $(tag_search_list_selector).length) + '<br><br>');
					tagSearchPageFinished();
					return false;
				} else if (!listPage_document.find('.next ._button')[0]) { //到最后一页了,已抓取本tag的所有页面
					allow_work = true;
					$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_tag搜索页任务完成2', $(tag_search_list_selector).length) + '<br><br>');
					tagSearchPageFinished();
					return false;
				} else if (interrupt) { //任务被用户中断
					$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_tag搜索页中断', $(tag_search_list_selector).length) + '<br><br>');
					interrupt = false;
					tagSearchPageFinished();
					return false;
				} else {
					getListPage();
				}
			} else if (page_type === 7) { // 其他排行榜。地区排行榜不经过这个步骤
				let contents = JSON.parse(data).contents; //取出作品信息列表
				for (let i = 0; i < contents.length; i++) {
					let nowClass = '';
					let pageCount = parseInt(contents[i].illust_page_count); // 包含的图片数量
					if (pageCount > 1) { // 多图
						nowClass = 'multiple';
					}
					if (contents[i].illust_type === '2') { // 作品类型 0 插画 1 漫画 2 动图
						nowClass = 'ugoku-illust';
					}
					let nowHref = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + contents[i].illust_id;
					let bookmarked = contents[i].is_bookmarked;
					checkNotDownType_result(nowClass, nowHref, bookmarked);
				}

				$('#outputInfo').html(now_tips + '<br>' + xzlt('_排行榜进度', listPage_finished));
				if (listPage_finished == part_number) {
					$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_排行榜任务完成', illust_url_list.length));
					getListUrlFinished();
				} else {
					getListPage();
				}
			} else if (page_type === 9 || down_xiangguan) { //添加收藏后的相似作品
				let illust_list = JSON.parse(data).recommendations; //取出id列表
				for (let i = 0; i < illust_list.length; i++) { //拼接作品的url
					illust_url_list.push('https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + illust_list[i]);
				}
				$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_列表页获取完成2', illust_url_list.length));
				getListUrlFinished();
			} else { // 不要把下面的if和这个else合并
				if (page_type === 10 && list_is_new === true) { //关注的新作品 列表改成和tag搜索页一样的了
					let this_one_info = listPage_document.find(tag_search_lv1_selector).attr('data-items'); // 保存这一次的信息
					this_one_info = JSON.parse(this_one_info); // 转化为数组
					for (let j = 0; j < this_one_info.length; j++) {
						let nowClass = '';
						let bookmarked;
						let nowHref = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + this_one_info[j]['illustId'];
						let pageCount = parseInt(this_one_info[j]['pageCount']); // 包含的图片数量
						if (pageCount > 1) { // 多图
							nowClass = 'multiple';
						}
						let illustType = this_one_info[j]['illustType']; // 作品类型 0 插画 1 漫画 2 动图
						if (illustType === '2') { // 动图
							nowClass = 'ugoku-illust';
						}
						if (this_one_info[j]['isBookmarked']) { // 是否已收藏
							bookmarked = true;
						}
						checkNotDownType_result(nowClass, nowHref, bookmarked);
					}
				} else if (page_type === 13) { // 响应关联作品
					let allPicArea = listPage_document.find('.linkStyleWorks>ul>li');
					for (let i = 0; i < allPicArea.length; i++) {
						// 响应关联作品这里获取的url有额外的后缀，需要去掉。如：
						// https://www.pixiv.net/member_illust.php?mode=medium&illust_id=63854366&uarea=response_out
						illust_url_list.push(allPicArea[i].querySelector('a').href.split('&uarea')[0]);
					}
				} else {
					let allPicArea = listPage_document.find('._image-items .image-item');
					for (let i = 0; i < allPicArea.length; i++) {
						if (allPicArea.eq(i).find('.title').attr('title') === '-----') { //如果这个作品被删除、或非公开
							continue;
						}
						let nowClass = allPicArea.eq(i).find('a').eq(0).attr('class');
						let nowHref = allPicArea.eq(i).find('a').eq(0).attr('href');
						let bookmarked = allPicArea.eq(i).find('._one-click-bookmark')[0].classList.contains('on');
						checkNotDownType_result(nowClass, nowHref, bookmarked);
					}
				}

				$('#outputInfo').html(now_tips + '<br>' + xzlt('_列表页抓取进度', listPage_finished));
				//判断任务状态
				if (!listPage_document.find('.next ._button')[0] || listPage_finished == want_page) { //如果没有下一页的按钮或者抓取完指定页面
					allow_work = true;
					listPage_finished = 0;
					$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_列表页抓取完成'));
					if (illust_url_list.length === 0) { //没有符合条件的作品
						$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_列表页抓取结果为零'));
						return false;
					}
					getListUrlFinished();
				} else {
					getListPage();
				}
			}
		},
		statusCode: {
			404: function () {
				if (page_type === 7) { //其他排行榜
					//如果发生了404错误，则中断抓取，直接下载已有部分。（因为可能确实没有下一部分了，只是这种情况我们没见到。这样的话之前预设的最大页数可能就不对
					console.log('404错误，直接下载已有部分');
					$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_排行榜列表页抓取遇到404', illust_url_list.length) + '<br><br>');
					getListUrlFinished();
				}
			}
		}
	});
}

// 第二个获取列表的函数，仅在tag搜索页和地区排行榜使用（从当前列表页直接获取所有内容页的列表）
function getListPage2() {
	changeTitle('↑');
	addOutputInfo();
	if (!allow_work) {
		alert(xzlt('_当前任务尚未完成2'));
		return false;
	}
	if (page_type === 5) {
		if ($(tag_search_list_selector + ':visible').length === 0) {
			return false;
		}
		if (interrupt) {
			interrupt = false;
		}
		illust_url_list = [];
		resetResult();
		// 获取要排除的tag 因为tag搜索页里的下载按钮没有启动startGet，而是在这里
		get_NotNeed_Tag();
		checkSetWH();
	}
	allow_work = false;
	if (page_type === 5) { // tag搜索页
		checkNotDownType_tips();
		check_multiple_down_number_tips();
		let allPicArea = $(tag_search_list_selector + ':visible');
		for (let i = allPicArea.length - 1; i >= 0; i--) {
			// 因为此页面类型里，判断作品类型的class与其他页面不同，所以在这里转换成能被接下来的函数识别的字符
			let nowClass = '';
			if (allPicArea.eq(i).find(tag_search_multiple_selector)[0] !== undefined) {
				nowClass = 'multiple';
			} else if (allPicArea.eq(i).find(tag_search_gif_selector)[0] !== undefined) {
				nowClass = 'ugoku-illust';
			}
			let nowHref = allPicArea.eq(i).find('a').eq(0).attr('href');
			let bookmarked = allPicArea.eq(i).find('._one-click-bookmark')[0].classList.contains('on');
			checkNotDownType_result(nowClass, nowHref, bookmarked);
		}
	} else { // 地区排行榜
		let allPicArea = $('.ranking-item');
		for (let i = allPicArea.length - 1; i >= 0; i--) {
			let nowClass = allPicArea.eq(i).find('a').eq(1).attr('class');
			let nowHref = allPicArea.eq(i).find('a').eq(1).attr('href');
			let bookmarked = allPicArea.eq(i).find('._one-click-bookmark')[0].classList.contains('on');
			checkNotDownType_result(nowClass, nowHref, bookmarked);
		}
	}
	addOutputInfo();
	$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_列表抓取完成开始获取作品页', illust_url_list.length));
	getListUrlFinished();
}

// 作品列表获取完毕，开始抓取图片内容页
function getListUrlFinished() {
	now_tips = $('#outputInfo').html();
	if (illust_url_list.length < ajax_for_illust_threads) {
		ajax_for_illust_threads = illust_url_list.length;
	}
	for (let i = 0; i < ajax_for_illust_threads; i++) {
		setTimeout(getIllustPage(illust_url_list[0]), i * ajax_for_illust_delay);
	}
}

// 获取作品内容页面的函数（区别于获取列表页面的函数）
function getIllustPage(url) {
	/*
	url参数为完整的作品url，或者不包含根路径的作品url，如：
	https://www.pixiv.net/member_illust.php?mode=medium&illust_id=65546468
	/member_illust.php?mode=medium&illust_id=65546468
	*/
	changeTitle('↑');
	illust_url_list.shift(); //有时并未使用illust_url_list，但对空数组进行shift()是合法的
	if (interrupt) { //判断任务是否已中断，目前只在tag搜索页有用到
		allow_work = true;
		return false;
	}
	if (quick) { // 快速下载时在这里提示一次
		$(outputInfo).html($(outputInfo).html() + xzlt('_开始获取作品页面'));
		now_tips = $(outputInfo).html();
	}
	url = 'https://www.pixiv.net/ajax/illust/' + url.match(/\d.*\d/)[0]; // 取出作品id，拼接出作品页api

	$.ajax({
		url: url,
		type: 'get',
		async: true,
		cache: false,
		dataType: 'text',
		success: function (data) {
			if (interrupt) { //这里需要再判断一次，因为ajax执行完毕是需要时间的
				allow_work = true;
				return false;
			}

			// 预设及获取图片信息
			let jsInfo = JSON.parse(data); // 储存作品信息
			jsInfo = jsInfo.body;
			let id = jsInfo.illustId;
			let fullWidth = parseInt(jsInfo.width); //原图宽度
			let fullHeight = parseInt(jsInfo.height); //原图高度
			let title = jsInfo.illustTitle;
			let nowAllTagInfo = jsInfo.tags.tags; // tag列表
			let nowAllTag = [];
			for (let i = nowAllTagInfo.length - 1; i >= 0; i--) {
				nowAllTag[i] = nowAllTagInfo[i].tag;
			}
			let userid = jsInfo.userId; //画师id
			let user = ''; //画师名字
			if (nowAllTagInfo.length > 0) {
				user = nowAllTagInfo[0].userName; // 从第一个tag里取出画师名字
			}
			let bmk = jsInfo.bookmarkCount; // 收藏数
			let ext = ''; //扩展名
			let imgUrl = '';

			// 检查宽高设置
			let WH_check_result = true; //预设为通过
			if (is_set_filterWH) {
				if (fullWidth < filterWH.width && fullHeight < filterWH.height) { //如果宽高都小于要求的宽高
					WH_check_result = false;
				} else {
					if (filterWH.and_or === '|') {
						if (fullWidth >= filterWH.width || fullHeight >= filterWH.height) { //判断or的情况
							WH_check_result = true;
						} else {
							WH_check_result = false;
						}
					} else if (filterWH.and_or === '&') {
						if (fullWidth >= filterWH.width && fullHeight >= filterWH.height) { //判断and的情况
							WH_check_result = true;
						} else {
							WH_check_result = false;
						}
					}
				}
			}

			// 检查收藏数要求
			let BMK_check_result = true; //预设为通过
			if (is_set_filterBMK) {
				if (bmk < filterBMK) {
					BMK_check_result = false;
				}
			}

			// 检查排除收藏
			let check_bookmark_pass = true;
			if (notdown_type.indexOf('4') > -1) {
				if (jsInfo.bookmarkData !== null) { // 已收藏
					check_bookmark_pass = false;
				}
			}

			// 检查要排除的tag 其实page_type==9的时候在获取作品列表时就能获得tag列表，但为了统一，也在这里检查
			let tag_check_result; // 储存tag检查结果

			// 检查要排除的tag
			let tag_noeNeed_isFound = false;
			if (notNeed_tag.length > 0) { //如果设置了过滤tag
				outerloop: //命名外圈语句
					for (let i = nowAllTag.length - 1; i >= 0; i--) {
						for (let ii = notNeed_tag.length - 1; ii >= 0; ii--) {
							if (nowAllTag[i] === notNeed_tag[ii]) {
								tag_noeNeed_isFound = true;
								break outerloop;
							}
						}
					}
			}

			// 检查必须包含的tag
			if (!tag_noeNeed_isFound) { //如果没有匹配到要排除的tag
				if (need_tag.length > 0) { //如果设置了必须包含的tag
					let tag_need_isFound = false;
					outerloop2: //命名外圈语句
						for (let i = nowAllTag.length - 1; i >= 0; i--) {
							for (let ii = need_tag.length - 1; ii >= 0; ii--) {
								if (nowAllTag[i] === need_tag[ii]) {
									tag_need_isFound = true;
									break outerloop2;
								}
							}
						}
					tag_check_result = tag_need_isFound;
				} else { //如果没有设置必须包含的tag，则通过
					tag_check_result = true;
				}
			} else { //如果匹配到了要排除的tag，则不予通过
				tag_check_result = false;
			}

			// 排除设置：
			// 1	单图
			// 2	多图
			// 3	动图
			// 4	已收藏，在上面检查过了
			let this_illust_type;
			if (jsInfo.illustType === 0 || jsInfo.illustType === 1) { // 单图或多图，0插画1漫画2动图（1的如68430279）
				if (jsInfo.pageCount === 1) { // 单图
					this_illust_type = 1;
				} else if (jsInfo.pageCount > 1) { // 多图
					this_illust_type = 2;
				}
			} else if (jsInfo.illustType === 2) { // 动图
				this_illust_type = 3;
			}

			// 结合作品类型处理作品
			if (this_illust_type === 1 && tag_check_result && check_bookmark_pass && WH_check_result && BMK_check_result) { //如果是单图，并且通过了tag检查和宽高检查和收藏检查和收藏数检查
				if (notdown_type.indexOf('1') === -1) { //如果没有排除单图
					imgUrl = jsInfo.urls.original;
					ext = imgUrl.split('.');
					ext = ext[ext.length - 1]; //扩展名
					addImgInfo(id + '_p0', imgUrl, title, nowAllTag, user, userid, fullWidth, fullHeight, ext, bmk);
					outputImgNum();
				}
			} else if (this_illust_type !== 1 && tag_check_result && check_bookmark_pass && WH_check_result && BMK_check_result) { //单图以外的情况,并且通过了tag检查和宽高检查和收藏检查和收藏数检查
				if (this_illust_type === 3) { //如果是动图
					if (notdown_type.indexOf('3') === -1) { //如果没有排除动图
						// 动图的最终url如：
						// https://i.pximg.net/img-zip-ugoira/img/2018/04/25/21/27/44/68401493_ugoira1920x1080.zip
						imgUrl = jsInfo.urls.original.replace('img-original', 'img-zip-ugoira').replace('ugoira0', 'ugoira1920x1080').replace('jpg', 'zip').replace('png', 'zip');
						ext = 'zip'; //扩展名
						addImgInfo(id, imgUrl, title, nowAllTag, user, userid, fullWidth, fullHeight, ext, bmk);
						outputImgNum();
					}
				} else { //多图作品
					if (notdown_type.indexOf('2') === -1) { //如果没有排除多图
						let pNo = jsInfo.pageCount; //P数
						// 检查是否需要修改下载的张数。有效值为大于0并不大于总p数，否则下载所有张数
						if (multiple_down_number > 0 && multiple_down_number <= pNo) {
							pNo = multiple_down_number;
						}
						// 获取多p作品的原图页面
						imgUrl = jsInfo.urls.original;
						ext = imgUrl.split('.');
						ext = ext[ext.length - 1];
						for (let i = 0; i < pNo; i++) {
							let now_url = imgUrl.replace('p0', 'p' + i); //拼接出每张图片的url
							addImgInfo(id + '_p' + i, now_url, title, nowAllTag, user, userid, fullWidth, fullHeight, ext, bmk);
						}
						// 检查网址并添加到数组的动作执行完毕
						outputImgNum();
					}
				}
			}

			if (page_type === 1 && !down_xiangguan) { // 在作品页内下载时，设置的want_page其实是作品数
				if (want_page > 0) {
					want_page--;
				}
				if (want_page === -1 || want_page > 0) { // 应该继续下载时
					// 检查是否有下一个作品
					// 在所有不为null的里面（可能有1-3个），取出key比当前作品id小的那一个，就是下一个
					let user_illust = jsInfo.userIllusts;
					let next_id;
					for (let key in user_illust) {
						if (user_illust[key]) {
							if (user_illust[key].illustId < id) {
								next_id = user_illust[key].illustId;
								break;
							}
						}
					}
					if (next_id) {
						getIllustPage('https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + next_id);
					} else { //没有剩余作品
						allow_work = true;
						allWorkFinished();
					}
				} else { //没有剩余作品
					allow_work = true;
					allWorkFinished();
				}
			} else {
				if (illust_url_list.length > 0) { //如果存在下一个作品，则
					getIllustPage(illust_url_list[0]);
				} else { //没有剩余作品
					ajax_threads_finished++;
					if (ajax_threads_finished === ajax_for_illust_threads) { //如果所有并发请求都执行完毕
						ajax_threads_finished = 0; //复位
						allow_work = true;
						allWorkFinished();
					}
				}
			}
		},
		statusCode: { //如果发生了错误则跳过该url
			0: function () {
				//ERR_CONNECTION_RESET
				console.log(xzlt('_作品页状态码0'));
				illust_error(url);
			},
			400: function () {
				//400错误
				console.log(xzlt('_作品页状态码400')); //在收藏的作品列表中，有些作品被作者删除了，却还显示有“编辑”按钮（但也有些没有这个按钮）。点击这个按钮会跳转到错误的“编辑收藏”页面，导致400错误。这个情况仅在下载书签作品时会发生。
				illust_error(url);
			},
			403: function () {
				//403错误
				console.log(xzlt('_作品页状态码403'));
				illust_error(url);
			},
			404: function () {
				//404错误。无法访问的作品 测试id=35697511
				console.log(xzlt('_作品页状态码404') + ' ' + url);
				illust_error(url);
			}
		}
	});
}

// 测试图片url是否正确的函数。对于mode=big的作品和pixivision、pixiv特辑，可以拼接出图片url，只是后缀都是jpg的，所以要测试下到底是jpg还是png
function testExtName(url, length, img_info_data) {
	test_suffix_finished = false;
	// 初步获取到的后缀名都是jpg的
	let ext = '';
	let testImg = new Image();
	testImg.src = url;
	testImg.onload = function () {
		nextStep(true);
	};
	testImg.onerror = function () {
		nextStep(false);
	};

	function nextStep(bool) {
		if (bool) {
			ext = 'jpg';
		} else {
			url = url.replace('.jpg', '.png');
			ext = 'png';
		}
		addImgInfo(img_info_data.id, url, img_info_data.title, img_info_data.tags, img_info_data.user, img_info_data.userid, img_info_data.fullWidth, img_info_data.fullHeight, ext, '');
		outputImgNum();
		if (length !== undefined) { //length参数只有在获取pixivision插画和pixiv特辑时才会传入
			test_suffix_no++;
			if (test_suffix_no === length) { //如果所有请求都执行完毕
				allWorkFinished();
			}
		}
		test_suffix_finished = true;
	}
}
// mode=big类型在pc端可能已经消失了，但是移动端查看大图还是big https://www.pixiv.net/member_illust.php?mode=big&illust_id=66745241
// pixivision则是因为跨域问题，无法抓取p站页面

// 抓取完毕
function allWorkFinished() {
	if (test_suffix_finished) { // 检查网址的任务 是否都全部完成。
		if (down_xiangguan) { // 如果是作品页内下载相关作品，到这里解除这个标识
			down_xiangguan = false;
		}
		$(outputInfo).html($(outputInfo).html() + '<br>' + xzlt('_获取图片网址完毕', img_info.length) + '<br>');
		if (img_info.length === 0) {
			$(outputInfo).html($(outputInfo).html() + xzlt('_没有符合条件的作品') + '<br><br>');
			if (!quiet_download) {
				alert(xzlt('_没有符合条件的作品弹窗'));
			}
			return false;
		}
		// 显示输出结果完毕
		$(outputInfo).html($(outputInfo).html() + xzlt('_抓取完毕') + '<br><br>');
		if (!quiet_download && !quick) {
			if (use_alert) {
				alert(xzlt('_抓取完毕'));
			}
			changeTitle('▶');
		}
		now_tips = $(outputInfo).html();
		// 重置输出区域
		downloaded = 0;
		$('.downloaded').html('0');
		$('.download_fileName').html('');
		$('.loaded').html('0/0');
		$('.progress').css('width', '0%');

		// 显示输出区域
		if (!quick) {
			$('.outputWrap').show();
		}
		// 重置输出区域
		$('.imgNum').text(img_info.length);
		if (img_info.length < download_thread_deauflt) { // 检查下载线程数
			download_thread = img_info.length;
		} else {
			download_thread = download_thread_deauflt; // 重设为默认值
		}
		let outputWrap_down_list = $('.outputWrap_down_list');
		outputWrap_down_list.show(); // 显示下载队列
		if ($('.donwloadBar').length < download_thread) { // 如果下载队列的显示数量小于线程数，则增加队列
			let need_add = download_thread - $('.donwloadBar').length;
			let donwloadBar = outputWrap_down_list.find('.donwloadBar').eq(0);
			// 增加下载队列的数量
			for (let i = 0; i < need_add; i++) {
				outputWrap_down_list.append(donwloadBar.clone());
			}
		} else if ($('.donwloadBar').length > download_thread) { // 如果下载队列的显示数量大于线程数，则减少队列
			let need_delete = $('.donwloadBar').length - download_thread;
			// 减少下载队列的数量
			for (let i = 0; i < need_delete; i++) {
				outputWrap_down_list.find('.donwloadBar').eq(0).remove();
			}
		}
		// 快速下载时点击下载按钮
		if (quick || quiet_download) {
			setTimeout(function () {
				$('.startDownload').click();
			}, 200);
		}
	} else { //如果没有完成，则延迟一段时间后再执行
		setTimeout(function () {
			allWorkFinished();
		}, 1000);
	}
}

// 创建输出抓取进度的区域
let outputInfo = document.createElement('div');
outputInfo.id = 'outputInfo';
outputInfo.style.cssText = 'background: #fff;padding: 10px;font-size: 14px;margin:6px auto;width:950px;';

function addOutputInfo() {
	if (document.querySelector('#outputInfo') === null) {
		if (location.hostname === 'www.pixivision.net') {
			$('._header-container').eq(0).before(outputInfo);
		} else {
			$('header').eq(0).before(outputInfo);
		}
	}
}

// 在抓取图片网址时，输出提示
function outputImgNum() {
	$(outputInfo).html(now_tips + '<br>' + xzlt('_抓取图片网址的数量', img_info.length));
	if (interrupt) { //如果任务中断
		$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_抓取图片网址遇到中断') + '<br><br>');
	}
}

// 单独设置按钮的位置和背景颜色
function setButtonStyle(e, no, bg) {
	e.className = 'download_btn';
	e.style.backgroundColor = bg;
}

// 添加css样式表
let styleE = document.createElement('style');
document.body.appendChild(styleE);
styleE.innerHTML = '';

function addBtnsAreaCtrl() {
	// 输出右侧按钮区域
	xianzun_btns_wrap = document.createElement('div');
	document.body.appendChild(xianzun_btns_wrap);
	xianzun_btns_wrap.outerHTML = `
	<div class="xianzun_btns_wrap">
	<div class="xz_btns_ctr" title="${xzlt('_展开收起下载按钮_title')}" data-show="0"><span class="xianzun_arrow_left"></span><span> ${xzlt('_展开下载按钮')} </span></div>
	<div class="xz_btns_con">
	</div>
	</div>
	`;
	// 设置右侧按钮的样式
	styleE.innerHTML += `
		.xianzun_btns_wrap{position: fixed;top: 140px;right: -196px;z-index: 999;font-size: 0;transition: right .3s;}
		.xianzun_btns_wrap *{box-sizing:content-box;}
		.xz_btns_ctr{width: 30px;padding: 11px 0;cursor: pointer;display: inline-block;vertical-align: top;font-size: 14px;text-align: center;background: #34b0e0;color: #fff;border-radius: 5px;transition: background .3s;letter-spacing:3px;}
		.xz_btns_ctr span:nth-child(1){display: inline-block;width: 0;height: 0;line-height: 0;}
		.xianzun_arrow_left{border-bottom: 6px solid transparent;border-left: 6px solid transparent;border-right: 6px solid #fff;border-top: 6px solid transparent;margin-right:8px;}
		.xianzun_arrow_right{border-bottom: 6px solid transparent;border-left: 6px solid #fff;border-right: 6px solid transparent;border-top: 6px solid transparent;margin-left:8px;}
		.xz_btns_ctr span:nth-child(2){margin-top:5px;writing-mode:tb;}
		.xz_btns_ctr:hover{background: #179FDD;}
		.xz_btns_con{vertical-align: top;padding-left: 10px;display: inline-block;position: relative;}
		.download_btn{width:170px;line-height:20px;font-size:14px;border-radius: 3px;color: #fff;text-align: center;cursor: pointer;margin-bottom: 12px;padding:8px;}
		`;
	// 绑定切换右侧按钮显示的事件
	xianzun_btns_wrap = document.querySelector('.xianzun_btns_wrap');
	xz_btns_ctr = document.querySelector('.xz_btns_ctr');
	xz_btns_con = document.querySelector('.xz_btns_con');
	xz_btns_ctr.addEventListener('click', function () {
		if (this.getAttribute('data-show') === '0') {
			xianzun_btns_wrap.style.right = '0px';
			this.querySelector('span').className = 'xianzun_arrow_right';
			this.querySelectorAll('span')[1].innerHTML = xzlt('_收起下载按钮');
			this.setAttribute('data-show', '1');
		} else if (this.getAttribute('data-show') === '1') {
			xianzun_btns_wrap.style.right = '-196px';
			this.querySelector('span').className = 'xianzun_arrow_left';
			this.querySelectorAll('span')[1].innerHTML = xzlt('_展开下载按钮');
			this.setAttribute('data-show', '0');
		}
	});
}

function addOutputWarp() {
	// 添加输出url的区域
	let outputInfoWrap = document.createElement('div');
	document.body.appendChild(outputInfoWrap);
	outputInfoWrap.outerHTML = `
		<div class="outputInfoWrap">
		<div class="outputUrlClose" title="${xzlt('_关闭')}">X</div>
		<div class="outputUrlTitle">${xzlt('_输出信息')}</div>
		<div class="outputInfoContent"></div>
		<div class="outputUrlFooter">
		<div class="outputUrlCopy" title="">${xzlt('_复制')}</div>
		</div>
		</div>
		`;
	styleE.innerHTML += `
		.outputInfoWrap{padding: 20px 30px;width: 520px;background:#fff;border-radius: 20px;z-index: 9999;box-shadow: 0px 0px 15px #2ca6df;display: none;position: fixed;top: 15%; margin-left: -300px;left: 50%;}
		.outputUrlTitle{height: 20px;line-height: 20px;text-align: center;font-size:18px;color:#179FDD;}
		.outputInfoContent{border: 1px solid #ccc;transition: .3s;font-size: 14px;margin-top: 10px;padding: 5px 10px;overflow: auto;max-height:400px;line-height:20px;}
		.outputInfoContent::selection{background:#179FDD;color:#fff;}
		.outputUrlFooter{height: 60px;text-align: center;}
		.outputUrlClose{cursor: pointer;position: absolute;width: 30px;height: 30px;top:20px;right:30px;z-index: 9999;font-size:18px;text-align:center;}
		.outputUrlClose:hover{color:#179FDD;}
		.outputUrlCopy{height: 34px;line-height: 34px;min-width:100px;padding: 2px 25px;margin-top: 15px;background:#179FDD;display:inline-block;color:#fff;font-size:14px;border-radius:6px;cursor:pointer;}
		`;
	// 绑定关闭输出url区域的事件
	$('.outputUrlClose').on('click', function () {
		$('.outputInfoWrap').hide();
	});
	// 绑定复制url的事件
	$('.outputUrlCopy').on('click', function () {
		let range = document.createRange();
		range.selectNodeContents($('.outputInfoContent')[0]);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		document.execCommand('copy');
		// 改变提示文字
		$('.outputUrlCopy').text(xzlt('_已复制到剪贴板'));
		setTimeout(function () {
			window.getSelection().removeAllRanges();
			$('.outputUrlCopy').text(xzlt('_复制'));
		}, 1000);
	});

	// 设置下载区域
	let outputWrap = document.createElement('div');
	document.body.appendChild(outputWrap);
	outputWrap.outerHTML = `
		<div class="outputWrap">
		<div class="outputWrap_head">
		<span class="outputWrap_title blue"> ${xzlt('_下载设置')}</span>
		<div class="outputWrap_close" title="${xzlt('_隐藏')}">X</div>
		</div>
		<div class="outputWrap_con">
		<p> ${xzlt('_设置命名规则', '<span class="imgNum blue">0</span>')}</p>
		<p>
		<input type="text" name="fileNameRule" class="fileNameRule" value="{id}">
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<span class="blue showFileNameTip"> ${xzlt('_查看可用的标记')}</span>
		&nbsp;&nbsp;&nbsp;
		<span class="blue showFileNameResult"> ${xzlt('_预览文件名')}</span>
		</p>
		<p class="fileNameTip tip">
		<span class="blue">{id}</span>
		${xzlt('_可用标记1')}
		<br>
		<span class="blue">{title}</span>
		${xzlt('_可用标记2')}
		<br>
		<span class="blue">{tags}</span>
		${xzlt('_可用标记3')}
		<br>
		<span class="blue">{user}</span>
		${xzlt('_可用标记4')}
		<br>
		<span class="blue">{userid}</span>
		${xzlt('_可用标记6')}
		<br>
		<span class="blue">{px}</span>
		${xzlt('_可用标记7')}
		<br>
		<span class="blue">{bmk}</span>
		${xzlt('_可用标记8')}
		<br>
		${xzlt('_可用标记5')}
		<br>
		</p>
		<div class="outputWrap_btns">
		<div class="startDownload" style="background:#00A514;"> ${xzlt('_下载按钮1')}</div>
		<div class="pauseDownload" style="background:#e49d00;"> ${xzlt('_下载按钮2')}</div>
		<div class="stopDownload" style="background:#e42a2a;"> ${xzlt('_下载按钮3')}</div>
		<div class="copyUrl" style="background:#179FDD;"> ${xzlt('_下载按钮4')}</div>
		</div>
		<div class="outputWrap_down_tips">
		<p>
		${xzlt('_当前状态')}
		<span class="down_status blue"> ${xzlt('_未开始下载')}</span>
		</p>
		<div>
		${xzlt('_下载进度：')}
		<div class="right1">
		<div class="progressBar progressBar1">
		<div class="progress progress1"></div>
		</div>
		<div class="progressTip progressTip1">
		<span class="downloaded">0</span>
		/
		<span class="imgNum">0</span>
		</div>
		</div>
		</div>
		</div>
		<div class="outputWrap_down_list">
		<p> ${xzlt('_下载线程：')}</p>
		<ul>
		<li class="donwloadBar">
		<div class="progressBar progressBar2">
		<div class="progress progress2"></div>
		</div>
		<div class="progressTip progressTip2">
		<span class="download_fileName"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${xzlt('_已下载')}&nbsp;&nbsp;<span class="loaded">0/0</span>KB
		</div>
		</li>
		</ul>
		</div>
		<a class="download_a" download=""></a>
		<p class="blue showDownTip"> ${xzlt('_查看下载说明')}</p>
		<p class="downTip tip"> ${xzlt('_下载说明')}</p>
		</div>
		</div>
		`;
	styleE.innerHTML += `
		li{list-style: none;}
		.outputWrap{display:none;width: 650px;position: fixed;left: -350px;margin-left: 50%;background: #fff;top: 13%;color: #333;z-index: 999;font-size: 14px;padding: 25px;border-radius: 15px;border:1px solid #ddd;box-shadow: 0px 0px 25px #2ca6df;}
		.outputWrap p{line-height: 24px;margin:0;}
		.outputWrap .blue{color: #03a4e2;}
		.outputWrap .tip{color: #999;}
		.outputWrap_head{height: 30px;position: relative;padding-bottom: 10px;}
		.outputWrap_title{display: block;line-height: 30px;text-align: center;font-size: 18px;}
		.outputWrap_close{font-size: 18px;position: absolute;top: 0px;right: 0px;width: 30px;height: 30px;text-align: center;cursor: pointer;}
		.outputWrap_close:hover{color:#4a9fff;}
		.fileNameRule{min-width: 200px;line-height: 20px;font-size: 12px;height: 20px;text-indent: 4px;box-sizing:border-box;}
		.showFileNameTip,.showFileNameResult{cursor: pointer;}
		.fileNameTip{display: none;padding-top: 5px;}
		.outputWrap_btns{padding: 15px 0 8px;font-size: 0;}
		.outputWrap_btns div{display: inline-block;min-width: 100px;padding: 0 10px;text-align: center;height: 36px;line-height: 36px;color: #fff;border-radius: 4px;margin-right: 35px;font-size: 14px;cursor: pointer;}
		.outputWrap_down_tips{padding: 10px 0 0;line-height: 28px;}
		.download_progress1{position: relative;}
		.right1{position: relative;display: inline-block;width: 500px;height: 22px;vertical-align: middle;}
		.progressBar{position: absolute;background: #6792A2;height: 22px;border-radius: 11px;}
		.progress{background: #15BEFF;height: 22px;border-radius: 11px;transition: .15s;}
		.progressTip{color: #fff;position: absolute;line-height: 22px;font-size: 14px;}
		.progressBar1{width: 500px;}
		.progress1{width:0%;}
		.progressTip1{width: 500px;text-align: center;}
		.outputWrap_down_list{display:none;}
		.outputWrap_down_list ul{padding-top: 5px;margin:0;padding-left:0;}
		.donwloadBar{position: relative;width: 100%;padding: 5px 0;height: 22px;box-sizing:content-box;}
		.progressBar2{width: 100%;}
		.progress2{width:0%;}
		.progressTip2{width: 100%;}
		.download_fileName{max-width: 60%;white-space:nowrap;  text-overflow:ellipsis;overflow: hidden;vertical-align:top;display: inline-block;text-indent: 1em;}
		.showDownTip{padding-top: 10px;cursor: pointer;display: inline-block;}
		.download_a{display: none;}
		.downTip{display: none;}
		`;
	// 绑定下载区域的事件
	$('.outputWrap_close').on('click', function () {
		$('.outputWrap').hide();
	});
	$('.showFileNameTip').on('click', function () {
		$('.fileNameTip').toggle();
	});
	$('.showFileNameResult').on('click', function () {
		showOutputInfoWrap('name');
	});
	$('.showDownTip').on('click', function () {
		$('.downTip').toggle();
	});
	// 检查是否有用户命名规则
	let fileNameRule_input = document.querySelector('.fileNameRule');
	let user_set_name = localStorage.getItem('user_name_rule');
	if (user_set_name) {
		fileNameRule_input.value = user_set_name;
	} else {
		fileNameRule_input.value = '{id}'; // 如果没有找到保存的用户规则，则设置为默认值
	}
	if (page_type === 8) {
		fileNameRule_input.value = '{id}'; // pixivision里只有id可以使用
	}
	// 当用户改变了命名规则时保存
	fileNameRule_input.addEventListener('change', function () {
		if (this.value === '') { //用户清空时，恢复成默认值
			this.value = '{id}';
		}
		localStorage.setItem('user_name_rule', this.value);
	});
	// 开始下载按钮
	$('.startDownload').on('click', function () { // 准备下载
		if (download_started || download_pause === 'ready_pause' || download_stop === 'ready_stop' || img_info.length === 0) { // 如果正在下载中，或正在进行暂停任务，或正在进行停止任务，则不予处理
			return false;
		}
		// 重置一些条件
		download_started = true;
		if (!download_pause) { // 如果没有暂停，则重新下载，否则继续下载
			downloaded = 0;
			$('.downloaded').html('0');
			$('.download_fileName').html('');
			$('.loaded').html('0/0');
			$('.progress').css('width', '0%');
		}
		download_pause = false;
		download_pause_num = 0;
		download_stop = false;
		download_stop_num = 0;
		fileNameRule = $('.fileNameRule').val();

		// 启动或继续 建立并发下载线程
		$(outputInfo).html($(outputInfo).html() + '<br>' + xzlt('_正在下载中') + '<br>');
		if (page_type === 5) {
			img_info.reverse();
			imgList.reverse();
		}
		for (let i = 0; i < download_thread; i++) {
			if (i + downloaded < img_info.length) {
				setTimeout(function () {
					startDownload(i + downloaded, i);
				}, 100 * (i + 1));
			}
		}
		$('.down_status').html(xzlt('_正在下载中'));
		donwloadBar_list = $('.donwloadBar');
		download_a = document.querySelector('.download_a');
	});
	// 暂停下载按钮
	$('.pauseDownload').on('click', function () {
		if (img_info.length === 0) {
			return false;
		}
		if (download_stop === true) { // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
			return false;
		}
		if (download_pause === false) {
			if (download_started) { // 如果正在下载中
				download_pause = 'ready_pause'; //发出暂停信号
				$('.down_status').html(xzlt('_正在暂停'));
			} else { // 不在下载中的话不允许启用暂停功能
				return false;
			}
		}
	});
	// 停止下载按钮
	$('.stopDownload').on('click', function () {
		if (img_info.length === 0) {
			return false;
		}
		if (download_stop === false) {
			if (download_started) { // 如果正在下载中
				download_stop = 'ready_stop'; //发出停止下载的信号
				$('.down_status').html(xzlt('_正在停止'));
			} else { // 不在下载中的话允许启用停止功能
				download_stop = true;
				$('.down_status').html(`<span style="color:#f00">${xzlt('_下载已停止')}</span>`);
				$(outputInfo).html($(outputInfo).html() + xzlt('_下载已停止') + '<br><br>');
			}
			download_pause = false;
		}
	});
	// 复制url按钮
	$('.copyUrl').on('click', function () { // 显示图片url列表
		showOutputInfoWrap('url');
	});

	// 添加控制下载区域的按钮
	let outputlWrap_ctr = document.createElement('div');
	outputlWrap_ctr.id = 'outputlWrap_ctr';
	xz_btns_con.appendChild(outputlWrap_ctr);
	$(outputlWrap_ctr).text(xzlt('_显示隐藏下载面板'));
	$(outputlWrap_ctr).attr('title', xzlt('_显示隐藏下载面板'));
	setButtonStyle(outputlWrap_ctr, -1, '#179FDD');
	outputlWrap_ctr.addEventListener('click', function () {
		$('.outputWrap').toggle();
	}, false);
}

// 生成输出区域的内容，按 type 不同，输出不同的内容
function showOutputInfoWrap(type) {
	if (img_info.length === 0) {
		return false;
	}
	let result = '';
	if (type === 'url') { // 拷贝图片 url
		for (let i = 0; i < img_info.length; i++) {
			result = result + img_info[i].url + '<br>';
		}
	} else if (type === 'name') { // 预览和拷贝图片名
		for (let i = 0; i < img_info.length; i++) {
			let ext = '.' + img_info[i].ext;
			result = result + img_info[i].id + ext + ': ' + getFileName(img_info[i]) + ext + '<br>';
			// 在每个文件名前面加上它的原本的名字，方便用来做重命名
		}
	} else {
		return false;
	}
	$('.outputInfoContent').html(result);
	$('.outputInfoWrap').show();
}

// 生成文件名，传入参数为图片信息
function getFileName(data) {
	fileNameRule = $('.fileNameRule').val();
	// 处理宽高
	let px = '';
	if (fileNameRule.indexOf('{px}') > -1) {
		if (data.fullWidth !== undefined) {
			px = data.fullWidth + 'x' + data.fullHeight;
		}
	}
	// 拼接文件名，不包含后缀名
	let result = fileNameRule.replace('{id}', data.id).replace('{title}', 'title_' + data.title).replace('{user}', 'user_' + data.user).replace('{userid}', 'uid_' + data.userid).replace('{px}', px).replace('{tags}', 'tags_' + (data.tags.join(','))).replace('{bmk}', 'bmk_' + data.bmk).replace(safe_fileName_rule, '_').replace(/undefined/g, '');
	return result;
}

// 开始下载 下载序号，要使用的显示队列的序号
function startDownload(downloadNo, donwloadBar_no) {
	quick = false;
	changeTitle('↓');
	let fullFileName = getFileName(img_info[downloadNo]);
	// 处理文件名长度 这里有个问题，因为无法预知浏览器下载文件夹的长度，所以只能预先设置一个预设值
	fullFileName = fullFileName.substr(0, fileName_length) + '.' + img_info[downloadNo].ext;
	donwloadBar_list.eq(donwloadBar_no).find('.download_fileName').html(fullFileName);

	let xhr = new XMLHttpRequest;
	xhr.open('GET', img_info[downloadNo].url, true);
	xhr.responseType = 'blob';
	xhr.timeout = 300000;
	xhr.addEventListener('progress', function (e) {
		e = e || event;
		// 显示下载进度
		let loaded = parseInt(e.loaded / 1000);
		let total = parseInt(e.total / 1000);
		donwloadBar_list.eq(donwloadBar_no).find('.loaded').html(loaded + '/' + total);
		donwloadBar_list.eq(donwloadBar_no).find('.progress').css('width', loaded / total * 100 + '%');
	});
	xhr.addEventListener('loadend', function () {
		let blobURL = window.URL.createObjectURL(xhr.response);
		// 控制点击下载按钮的时间间隔大于0.5秒
		if (new Date().getTime() - click_time > time_interval) {
			click_time = new Date().getTime();
			click_doanload_a(blobURL, fullFileName, donwloadBar_no);
		} else {
			time_delay += time_interval;
			setTimeout(() => {
				click_doanload_a(blobURL, fullFileName, donwloadBar_no);
			}, time_delay);
		}
	});
	xhr.send();
}

function click_doanload_a(blobURL, fullFileName, donwloadBar_no) {
	if (new Date().getTime() - click_time < time_interval) {
		// console.count('+1s');	// 此句输出加时的次数
		setTimeout(() => {
			click_doanload_a(blobURL, fullFileName, donwloadBar_no);
		}, time_interval); // 虽然设置了两次点击间隔不得小于time_interval，但实际执行过程中仍然有可能比time_interval小。间隔太小的话就会导致漏下。当间隔过小时补上延迟
		return false;
	}
	// console.log(new Date().getTime() - click_time); // 此句输出两次点击的实际间隔
	download_a.href = blobURL;
	download_a.setAttribute('download', fullFileName);
	download_a.click();
	click_time = new Date().getTime();
	time_delay -= time_interval;

	if (time_delay < 0) { // 因为有多个线程，所以有可能把time_delay减小到0以下，这里做限制
		time_delay += time_interval;
	}
	window.URL.revokeObjectURL(blobURL);
	// 下载之后
	downloaded++;
	$('.downloaded').html(downloaded);
	$('.progress1').css('width', downloaded / img_info.length * 100 + '%');
	if (downloaded === img_info.length) { // 如果所有文件都下载完毕
		download_started = false;
		download_stop = false;
		download_pause = false;
		downloaded = 0;
		$('.down_status').html(xzlt('_下载完毕'));
		$(outputInfo).html($(outputInfo).html() + xzlt('_下载完毕') + '<br><br>');
		changeTitle('√');
		if (!quiet_download) {
			if (use_alert) {
				alert(xzlt('_下载完毕'));
			}
		}
	} else { // 如果没有全部下载完毕
		//如果需要暂停下载
		if (download_pause === 'ready_pause') {
			download_pause_num++; // 统计中断数量
			if (download_pause_num === download_thread) {
				$(outputInfo).html($(outputInfo).html() + xzlt('_已暂停') + '<br>');
				$('.down_status').html(`<span style="color:#d25b03">${xzlt('_已暂停')}</span>`);
				download_started = false;
				download_pause = true;
				download_pause_num = 0;
				return false;
			}
		} else if (download_pause) { // 如果已经完成暂停
			download_started = false;
			changeTitle('║');
			return false;
		}

		//如果需要停止下载
		if (download_stop === 'ready_stop') {
			download_stop_num++; // 统计中断数量
			if (download_stop_num === download_thread) {
				$(outputInfo).html($(outputInfo).html() + xzlt('_已停止') + '<br>');
				$('.down_status').html(`<span style="color:#f00">${xzlt('_已停止')}</span>`);
				download_started = false;
				download_stop = true;
				download_stop_num = 0;
				return false;
			}
		} else if (download_stop) { // 如果已经停止下载
			download_started = false;
			changeTitle('■');
			return false;
		}

		// 继续添加任务
		if (downloaded + download_thread - 1 < img_info.length) { // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数
			startDownload(downloaded + download_thread - 1, donwloadBar_no); // 这里需要减一，就是downloaded本次自增的数字，否则会跳一个序号
		}
	}
}

// 清空图片信息并重置输出区域，在重复抓取时使用
function resetResult() {
	img_info = [];
	$('.outputWrap').hide();
	$('.outputInfoContent').text('');
	download_started = false;
	download_pause = false;
	download_stop = false;
}

// --------------------------------------------------------------------------
if (location.hostname === 'www.pixiv.net' && location.pathname === '/') { //0.首页
	page_type = 0;

	addBtnsAreaCtrl();
	addOutputWarp();

	let down_id_button,
		down_id_input,
		down_id_tip = '',
		id_value = [];

	// 添加输入id的按钮
	down_id_button = document.createElement('div');
	xz_btns_con.appendChild(down_id_button);
	down_id_button.id = 'down_id_button';
	down_id_button.dataset.ready = 'false'; //是否准备好了
	$(down_id_button).text(xzlt('_输入id进行下载'));
	setButtonStyle(down_id_button, 0, '#00A514');
	down_id_button.addEventListener('click', function () {
		illust_url_list = []; //每次开始下载前重置作品的url列表
		if (down_id_button.dataset.ready === 'false') { //还没准备好
			down_id_input.toggle(); //切换显示id输入框
			if (down_id_input.is(':visible')) {
				down_id_input.css('display', 'block');
				// down_id_input.focus();
				document.documentElement.scrollTop = 0;
			}
		} else {
			//检查id
			id_value = down_id_input.val().split('\n');
			for (let i = id_value.length - 1; i >= 0; i--) {
				let now_id = parseInt(id_value[i]);
				if (isNaN(now_id) || now_id < 22 || now_id > 99999999) { //如果id不是数字，或者处于非法区间
					illust_url_list = []; //清空结果
					alert(xzlt('_id不合法'));
					return false;
				} else {
					//拼接作品的url
					illust_url_list.push('https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + id_value[i]);
				}
			}
			$(outputInfo).html($(outputInfo).html() + xzlt('_任务开始0'));
			startGet(); //进入下载流程
		}
	}, false);

	//用于输入id的输入框
	down_id_input = document.createElement('textarea');
	down_id_input.id = 'down_id_input';
	down_id_input.style.cssText = 'width: 600px;height: 80px;font-size: 12px;margin:6px auto;background:#fff;colir:#bbb;padding:7px;display:none;border:1px solid #179FDD;';
	$('header').eq(0).before(down_id_input);
	down_id_input = $(down_id_input);
	down_id_tip = xzlt('_输入id进行下载的提示文字');
	down_id_input.val(down_id_tip);
	$.focusblur(down_id_input, '#bbb', '#333');
	down_id_input.on('input', function () {
		// 当输入框内容改变时检测
		if (!!down_id_input.val() && down_id_input.val() !== down_id_tip) { //非空值且不等于默认值
			down_id_button.dataset.ready = 'true';
			$(down_id_button).text(xzlt('_开始下载'));
		} else {
			down_id_button.dataset.ready = 'false';
			$(down_id_button).text(xzlt('_输入id进行下载'));
		}
	});

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_Need(4);
	setFilterTag_notNeed(5);
}
if (loc_url.indexOf('illust_id') > -1 && loc_url.indexOf('mode=manga') == -1 && loc_url.indexOf('bookmark_detail') == -1 && loc_url.indexOf('bookmark_add') == -1) { //1.on_illust_list，作品页内页
	page_type = 1;

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let startBotton = document.createElement('div');
		xz_btns_con.appendChild(startBotton);
		$(startBotton).text(xzlt('_快速下载本页'));
		setButtonStyle(startBotton, 0, '#00A514');
		startBotton.addEventListener('click', function () {
			quick = true;
			startGet();
		}, false);
	})();

	(function () {
		let startBotton = document.createElement('div');
		xz_btns_con.appendChild(startBotton);
		$(startBotton).text(xzlt('_从本页开始下载'));
		setButtonStyle(startBotton, 1, '#00A514');
		startBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	(function () {
		let startBotton = document.createElement('div');
		xz_btns_con.appendChild(startBotton);
		$(startBotton).text(xzlt('_下载相关作品'));
		setButtonStyle(startBotton, 2, '#00A514');
		startBotton.addEventListener('click', function () {
			set_requset_num();
			if (requset_number > 0) {
				down_xiangguan = true;
				startGet();
			}
		}, false);
	})();

	setFilterWH(3);
	setFilterBMK(4);
	setNotDownType(5);
	setFilterTag_Need(6);
	setFilterTag_notNeed(7);

	window.addEventListener('pushState', () => {
		$(outputInfo).html(''); // 切换页面时，清空输出区域
		initViewer();
	});

	quickBookmark();
	initViewer();

} else if ((loc_url.indexOf('member_illust.php?id=') > -1 || loc_url.indexOf('&id=') > -1) && (loc_url.indexOf('&tag') == -1 && loc_url.indexOf('?tag') == -1) && loc_url.indexOf('response.php') == -1) { //2.on_illust_list
	page_type = 2;
	listPage_finished = 0; //向下第几页
	base_url = loc_url.split('&p=')[0] + '&p=';

	if ($('.page-list .current')[0] !== undefined) { //如果显示有页码
		startpage_no = Number($('.page-list .current').eq(0).text()); //最开始时的页码
	} else { //否则认为只有1页
		startpage_no = 1;
	}

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载该画师的作品'));
		$(downloadBotton).attr('title', xzlt('_下载该画师的作品') + xzlt('_默认下载多页'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_Need(4);
	setFilterTag_notNeed(5);

} else if ((loc_url.indexOf('bookmark.php') > -1 && loc_url.indexOf('tag=') > -1) || (loc_url.indexOf('member_illust.php?id=') > -1 && loc_url.indexOf('&tag=') > -1)) { //3.on_tagpage

	page_type = 3;
	listPage_finished = 0; //向下第几页
	base_url = loc_url.split('&p=')[0] + '&p=';

	if ($('.page-list .current')[0] !== undefined) { //如果显示有页码
		startpage_no = Number($('.page-list .current').eq(0).text()); //最开始时的页码
	} else { //否则认为只有1页
		startpage_no = 1;
	}

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载该tag中的作品'));
		$(downloadBotton).attr('title', xzlt('_下载该tag中的作品') + xzlt('_默认下载多页'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_Need(4);
	setFilterTag_notNeed(5);

} else if (loc_url.indexOf('bookmark.php') > -1 && loc_url.indexOf('tag=') == -1) { //4.on_bookmark
	page_type = 4;
	listPage_finished = 0; //向下第几页

	/*
	//根据排序方式选择对应的url 该方法较为繁琐，但作为备用方法保留
	let now_order_element=$('.menu-items').eq(2).find('a.current');
	if (now_order_element.attr('href').indexOf('order=date') === -1) { //如果是按收藏顺序排序
		if (now_order_element.text().indexOf('↓')>-1) { //倒序
			base_url='https://www.pixiv.net/bookmark.php?rest=show&order=desc&p=';
		}else if (now_order_element.text().indexOf('↑')>-1) {   //正序
			base_url='https://www.pixiv.net/bookmark.php?rest=show&order=asc&p=';
		}
	}else{  //如果是按投稿时间顺序排序
		if (now_order_element.text().indexOf('↓')>-1) { //倒序
			base_url='https://www.pixiv.net/bookmark.php?rest=show&order=date_d&p=';
		}else if (now_order_element.text().indexOf('↑')>-1) {   //正序
			base_url='https://www.pixiv.net/bookmark.php?rest=show&order=date&p=';
		}
	}
	*/

	if ($('.page-list .current')[0] !== undefined) { //如果显示有页码，则是2页及以上
		startpage_no = Number($('.page-list .current').eq(0).text()); //当前所处的页码
		base_url = 'https://www.pixiv.net/bookmark.php' + $('.page-list').eq(0).find('a').eq(0).attr('href').split('&p=')[0] + '&p='; //从页码中取值，作为列表页url的规则（等同于上面注释里的代码，但更便捷）
	} else { //否则只有1页
		startpage_no = 1;
		base_url = loc_url + '&p=';
	}

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载书签'));
		$(downloadBotton).attr('title', xzlt('_下载书签') + xzlt('_默认下载多页'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_Need(4);
	setFilterTag_notNeed(5);

} else if (loc_url.indexOf('search.php?') > -1) { //5.on_tagsearch
	page_type = 5;

	tag_search_lv1_selector = '#js-mount-point-search-result-list';
	tag_search_lv2_selector = '._25taFA4';
	tag_search_list_selector = '._25taFA4';
	tag_search_multiple_selector = '._1VJYUl1';
	tag_search_gif_selector = '._347Rtjn';
	// 因为tag搜索页新版将结果储存在一个div标签的属性里,而不是直接输出到html,但我们需要呈现html,所以需要模拟生成的元素
	tag_search_new_html = `
		<div class="_25taFA4">
		<figure class="mSh0kS-" style="width: 200px; max-height: 288px;">
		<div class="_3NnoQkv">
		<a href="/member_illust.php?mode=medium&illust_id=xz_illustId" rel="noopener" class="_1wlaFo6">
		<!--xz_multiple_html-->
		<img alt="" class="_309ad3C" width="xz_width" height="xz_height" src="xz_url">
		<!--xz_gif_html-->
		</a>
		<div class="thumbnail-menu">
		<div class="_one-click-bookmark js-click-trackable xz_isBookmarked" data-click-category="abtest_www_one_click_bookmark" data-click-action="illust" data-click-label="xz_illustId" data-type="illust" data-id="xz_illustId" title="添加收藏" style="position: static;"></div>
		<div class="_balloon-menu-opener">
		<div class="opener"></div>
		<section class="_balloon-menu-popup">
		<ul class="_balloon-menu-closer menu">
		<li>
		<span class="item">${xzlt('_屏蔽设定')}</span>
		</li>
		<li>
		<a class="item" target="_blank" href="/illust_infomsg.php?illust_id=xz_illustId">${xzlt('_举报')}</a>
		</li>
		</ul>
		</section>
		</div>
		</div>
		</div>
		<figcaption class="_1IP8RNV">
		<ul>
		<li class="SXucpBq">
		<a href="/member_illust.php?mode=medium&illust_id=xz_illustId" title="xz_illustTitle">xz_illustTitle</a>
		</li>
		<li>
		<a href="/member_illust.php?id=xz_userId" target="_blank" title="xz_userName" class="js-click-trackable ui-profile-popup _28hboXu" data-click-category="recommend 20130415-0531" data-click-action="ClickToMember" data-click-label="" data-user_id="xz_userId" data-user_name="xz_userName">
		<span class="_2taBWk8">
		<div class="" style="background: url(xz_userImage) center top / cover no-repeat; width: 16px; height: 16px;"></div>
		</span>
		<span class="_1fXePI5">xz_userName</span>
		</a>
		</li>
		<li style="position: relative;">
		<ul class="count-list">
		<li>
		<a href="/bookmark_detail.php?illust_id=xz_illustId" class="_ui-tooltip bookmark-count"> <i class="_icon sprites-bookmark-badge"></i>xz_bookmarkCount</a>
		</li>
		</ul>
		</li>
		</ul>
		</figcaption>
		</figure>
		</div>
		`;
	xz_multiple_html = '<div class="_1VJYUl1"><span><span class="_1RSXump"></span>xz_pageCount</span></div>';
	xz_gif_html = '<div class="_347Rtjn"></div>';

	base_url = loc_url.split('&p=')[0] + '&p=';
	startpage_no = Number($('.page-list .current').eq(0).text()); //最开始时的页码
	listPage_finished = 0; //向下第几页
	$('#js-react-search-mid').css('minHeight', 'auto'); //原来的最小高度是500，改成auto以免搜索时这部分空白

	tagSearchDel();

	addBtnsAreaCtrl();
	addOutputWarp();

	// 添加快速筛选功能
	let nowTag = $('.column-title a').text().split(' ')[0];
	let favNums = ['100users入り', '500users入り', '1000users入り', '3000users入り', '5000users入り', '10000users入り', '20000users入り', '30000users入り', '50000users入り']; //200和2000的因为数量太少，不添加。40000的也少
	styleE.innerHTML += '.fastScreenArea a{display:inline-block;padding:10px;}';
	let fastScreenArea = document.createElement('div');
	fastScreenArea.className = 'fastScreenArea';
	let insetParent = document.querySelector('._unit');
	insetParent.insertBefore(fastScreenArea, insetParent.querySelector('#js-react-search-top'));
	let search_mode = ''; // 判断当前搜索模式，默认的“全部”模式不需要做处理
	if (loc_url.indexOf('&mode=r18') > -1) {
		search_mode = '&mode=r18';
	} else if (loc_url.indexOf('&mode=safe') > -1) {
		search_mode = '&mode=safe';
	}
	let order_mode = ''; // 判断当前排序方式
	if (loc_url.indexOf('&order=date_d') > -1) { // 按最新排序
		order_mode = '&order=date_d';
	} else if (loc_url.indexOf('&order=date') > -1) { // 按旧排序
		order_mode = '&order=date';
	}
	for (let i = 0; i < favNums.length; i++) {
		fastScreenArea.innerHTML += `<a href="https://www.pixiv.net/search.php?s_mode=s_tag${search_mode}${order_mode}&word=${nowTag}%20${favNums[i]}">${favNums[i]}</a>`;
	}

	(function () {
		let startBotton = document.createElement('div');
		xz_btns_con.appendChild(startBotton);
		$(startBotton).text(xzlt('_按收藏数筛选'));
		$(startBotton).attr('title', xzlt('_按收藏数筛选_title'));
		setButtonStyle(startBotton, 1, '#00A514');
		startBotton.addEventListener('click', function () {
			if (interrupt) {
				interrupt = false;
			}
			startGet();
		}, false);
	})();

	(function () {
		let filterSelf = document.createElement('div');
		xz_btns_con.appendChild(filterSelf);
		$(filterSelf).text(xzlt('_在结果中筛选'));
		$(filterSelf).attr('title', xzlt('_在结果中筛选_title'));
		setButtonStyle(filterSelf, 2, '#0096DB');
		filterSelf.addEventListener('click', function () {
			let allPicArea = $(tag_search_list_selector);
			let want_favorite_number2 = prompt(xzlt('_在结果中筛选弹窗'), '1500');
			if (!want_favorite_number2) {
				return false;
			} else if (isNaN(Number(want_favorite_number2)) || ~~Number(want_favorite_number2) <= 0) {
				alert(xzlt('_参数不合法1'));
				return false;
			} else {
				want_favorite_number2 = ~~Number(want_favorite_number2);
			}
			for (let i = 0; i < allPicArea.length; i++) {
				if (allPicArea.eq(i).find('._ui-tooltip').eq(0).text() < want_favorite_number2) { //必须限制序号0，不然对图片的回应数也会连起来
					allPicArea.eq(i).hide(); //这里把结果中不符合二次过滤隐藏掉，而非删除
				} else {
					allPicArea.eq(i).show();
				}
			}
			outputNowResult();
		}, false);
	})();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载当前作品'));
		$(downloadBotton).attr('title', xzlt('_下载当前作品_title'));
		setButtonStyle(downloadBotton, 3, '#00A514');
		downloadBotton.addEventListener('click', function () {
			getListPage2();
		}, false);
	})();

	setFilterWH(4);
	setNotDownType(5);
	setFilterTag_notNeed(6);
	$('#nottag').text(xzlt('_下载时排除tag'));

	(function () {
		let stopFilter = document.createElement('div');
		xz_btns_con.appendChild(stopFilter);
		$(stopFilter).text(xzlt('_中断当前任务'));
		$(stopFilter).attr('title', xzlt('_中断当前任务_title'));
		setButtonStyle(stopFilter, 7, '#e42a2a');
		stopFilter.addEventListener('click', function () {
			interrupt = true;
			if (!allow_work) {
				$('#outputInfo').html($('#outputInfo').html() + '<br>' + xzlt('_当前任务已中断') + '<br><br>');
				alert(xzlt('_当前任务已中断'));
				allow_work = true;
			}
		}, false);
	})();

	(function () {
		let clearMultiple = document.createElement('div');
		xz_btns_con.appendChild(clearMultiple);
		$(clearMultiple).text(xzlt('_清除多图作品'));
		$(clearMultiple).attr('title', xzlt('_清除多图作品_title'));
		setButtonStyle(clearMultiple, 8, '#E42A2A');
		clearMultiple.addEventListener('click', function () {
			let allPicArea = $(tag_search_list_selector);
			for (let i = 0; i < allPicArea.length; i++) {
				if (allPicArea.eq(i).find(tag_search_multiple_selector)[0] !== undefined) {
					allPicArea.eq(i).remove();
				}
			}
			outputNowResult();
		}, false);
	})();

	(function () {
		let clearUgoku = document.createElement('div');
		xz_btns_con.appendChild(clearUgoku);
		$(clearUgoku).text(xzlt('_清除动图作品'));
		$(clearUgoku).attr('title', xzlt('_清除动图作品_title'));
		setButtonStyle(clearUgoku, 9, '#E42A2A');
		clearUgoku.addEventListener('click', function () {
			let allPicArea = $(tag_search_list_selector);
			for (let i = 0; i < allPicArea.length; i++) {
				if (allPicArea.eq(i).find(tag_search_gif_selector)[0] !== undefined) {
					allPicArea.eq(i).remove();
				}
			}
			outputNowResult();
		}, false);
	})();

	(function () {
		let deleteBotton = document.createElement('div');
		deleteBotton.id = 'deleteBotton';
		xz_btns_con.appendChild(deleteBotton);
		$(deleteBotton).text(xzlt('_手动删除作品'));
		$(deleteBotton).attr('title', xzlt('_手动删除作品_title'));
		$(deleteBotton).attr('data_del', '0');
		setButtonStyle(deleteBotton, 10, '#e42a2a');
		$('#deleteBotton').bind('click', function () {
			if ($('#deleteBotton').attr('data_del') === '0') {
				$('#deleteBotton').attr('data_del', '1');
				$('#deleteBotton').text(xzlt('_退出手动删除'));
			} else if ($('#deleteBotton').attr('data_del') === '1') {
				$('#deleteBotton').attr('data_del', '0');
				$('#deleteBotton').text(xzlt('_手动删除作品'));
			}
		});
	})();
} else if (loc_url.indexOf('ranking_area.php') > -1 && loc_url !== 'https://www.pixiv.net/ranking_area.php') { //6.on_ranking_area
	page_type = 6;

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载本页作品'));
		$(downloadBotton).attr('title', xzlt('_下载本页作品_title'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_notNeed(4);
	setFilterTag_Need(5);

} else if (location.pathname === '/ranking.php') { //7.on_ranking_else
	page_type = 7;

	if (location.search === '') { // 直接获取json数据
		base_url = loc_url + '?format=json&p=';
	} else {
		base_url = loc_url + '&format=json&p=';
	}

	startpage_no = 1; //从第一页（部分）开始抓取
	listPage_finished = 0; //已经向下抓取了几页（部分）

	// 设置页数。排行榜页面一页有50张作品，当页面到达底部时会加载下一页
	if (base_url.indexOf('r18g') > -1) { // r18g只有1个榜单，固定1页
		part_number = 1;
	} else if (base_url.indexOf('_r18') > -1) { // r18模式，这里的6是最大值，有的排行榜并没有6页
		part_number = 6;
	} else { //普通模式，这里的10也是最大值。如果实际没有10页，则在检测到404页面的时候停止抓取下一页
		part_number = 10;
	}

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载本排行榜作品'));
		$(downloadBotton).attr('title', xzlt('_下载本排行榜作品_title'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_Need(4);
	setFilterTag_notNeed(5);

} else if (loc_url.indexOf('https://www.pixivision.net') > -1 && loc_url.indexOf('/a/') > -1) { //8.on_pixivision
	page_type = 8;

	let type = $('a[data-gtm-action=ClickCategory]').eq(0).attr('data-gtm-label');
	if (type == 'illustration' || type == 'manga' || type == 'cosplay') { //在插画、漫画、cosplay类型的页面上创建下载功能

		addBtnsAreaCtrl();
		addOutputWarp();

		// 创建下载按钮
		(function () {
			let downloadBotton = document.createElement('div');
			xz_btns_con.appendChild(downloadBotton);
			$(downloadBotton).html(xzlt('_下载该页面的图片'));
			setButtonStyle(downloadBotton, 1, '#00A514');
			downloadBotton.addEventListener('click', function () {
				$('.logo-area h1').hide();
				resetResult();
				addOutputInfo();
				changeTitle('↑');
				let imageList = []; //图片元素的列表
				if (type == 'illustration') { // 针对不同的类型，选择器不同
					imageList = $('.am__work__main img');
					let urls = [];
					for (let i = 0; i < imageList.length; i++) { // 把图片url添加进数组
						urls.push(imageList[i].src.replace('c/768x1200_80/img-master', 'img-original').replace('_master1200', ''));
					}
					test_suffix_no = 0;

					for (let j = 0; j < urls.length; j++) {
						let id = urls[j].split('/');
						id = id[id.length - 1].split('.')[0]; //作品id
						setTimeout(testExtName(urls[j], urls.length, {
							id: id,
							title: '',
							tags: [],
							user: '',
							userid: '',
							fullWidth: '',
							fullHeight: ''
						}), j * ajax_for_illust_delay);
					}
				} else {
					if (type == 'manga') {
						imageList = $('.am__work__illust');
					} else if (type == 'cosplay') {
						imageList = $('.fab__image-block__image  img');
					}
					for (let i = 0; i < imageList.length; i++) { // 把图片url添加进数组
						let imgUrl = imageList[i].src;
						if (imgUrl === 'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg') { // 跳过Cure的logo图片
							continue;
						}
						let id = imgUrl.split('/');
						id = id[id.length - 1].split('.')[0]; //作品id
						let ext = imgUrl.split('.');
						ext = ext[ext.length - 1]; //扩展名
						addImgInfo(id, imgUrl, '', [], '', '', '', '', ext, '');
					}
					allWorkFinished();
				}
			}, false);
		})();
	}

} else if (loc_url.indexOf('bookmark_add.php?id=') > -1 || loc_url.indexOf('bookmark_detail.php?illust_id=') > -1 || loc_url.indexOf('recommended.php') > -1) { //9.on_bookmark_add
	// bookmark_add的页面刷新就变成bookmark_detail了; recommended.php是首页的“为你推荐”栏目
	// 在收藏后的相似图片页面，可以获得收藏数，如 https://www.pixiv.net/bookmark_detail.php?illust_id=63706584
	page_type = 9;

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		if (loc_url.indexOf('recommended.php') > -1) {
			$(downloadBotton).text(xzlt('_下载推荐图片'));
			$(downloadBotton).attr('title', xzlt('_下载推荐图片_title'));
		} else {
			$(downloadBotton).text(xzlt('_下载相似图片'));
		}
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			set_requset_num();
			if (requset_number > 0) {
				startGet();
			}
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_Need(4);
	setFilterTag_notNeed(5);

} else if (loc_url.indexOf('bookmark_new_illust') > -1 || loc_url.indexOf('new_illust.php') > -1 || loc_url.indexOf('new_illust_r18.php') > -1) { //10.bookmark_new_illust and new_illust 关注的人的新作品 以及 大家的新作品
	page_type = 10;

	addBtnsAreaCtrl();
	addOutputWarp();
	if (loc_url.indexOf('/bookmark_new_illust') > -1) {
		list_is_new = true;
		tag_search_lv1_selector = '#js-mount-point-latest-following';
		tag_search_lv2_selector = '._25taFA4';
		tag_search_list_selector = '._25taFA4';
		tag_search_multiple_selector = '._1VJYUl1';
		tag_search_gif_selector = '._347Rtjn';
	}

	//列表页url规则
	if (loc_url.indexOf('type=') === -1) { //如果没有type标志，说明是在“综合”分类的第一页，手动加上分类
		base_url = loc_url + '?type=all'.split('&p=')[0] + '&p=';
	} else {
		base_url = loc_url.split('&p=')[0] + '&p=';
	}

	if (loc_url.indexOf('bookmark_new_illust') > -1) { // 其实这个条件和条件2在一定程度上是重合的，所以这个必须放在前面。
		max_num = 100; //关注的人的新作品（包含普通版和r18版）的最大页数都是100
	} else if (loc_url.indexOf('new_illust.php') > -1) {
		max_num = 1000; //大家的新作品（普通版）的最大页数是1000
	} else if (loc_url.indexOf('new_illust_r18.php') > -1) {
		max_num = 500; //大家的的新作品（r18版）的最大页数是500
	}
	if ($('.page-list .current')[0] !== undefined) { //如果显示有页码
		startpage_no = Number($('.page-list .current').eq(0).text()); //以当前页的页码为起始页码
	} else { //否则认为只有1页
		startpage_no = 1;
	}
	listPage_finished = 0;

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_从本页开始下载'));
		$(downloadBotton).attr('title', xzlt('_下载大家的新作品'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setNotDownType(3);
	setFilterTag_Need(4);
	setFilterTag_notNeed(5);
} else if (window.location.pathname === '/discovery') { //11.discover 发现
	// 其实发现页面和9收藏后的推荐页面一样，先获取列表再下载。但是发现页面有个特点是每次获取的数据是不同的，如果再请求一次列表数据，那么下载到的图片和本次加载的图片就不一样了。所以这里改用直接下载左侧已有作品
	page_type = 11;

	tag_search_list_selector = '._3msSJaE'; // 发现作品的已有作品，借用tag搜索页的变量名，直接拿来用
	tag_search_multiple_selector = '._1VJYUl1'; // 多图的选择器，借用tag搜索页的变量名，直接拿来用
	tag_search_gif_selector = '._347Rtjn'; // 动图的选择器，借用tag搜索页的变量名，直接拿来用

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载当前作品'));
		$(downloadBotton).attr('title', xzlt('_下载当前作品_title'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();

	setFilterWH(1);
	setFilterBMK(2);
	setFilterTag_Need(3);
	setFilterTag_notNeed(4);

	(function () {
		let clearMultiple = document.createElement('div');
		xz_btns_con.appendChild(clearMultiple);
		$(clearMultiple).text(xzlt('_清除多图作品'));
		$(clearMultiple).attr('title', xzlt('_清除多图作品_title'));
		setButtonStyle(clearMultiple, 5, '#E42A2A');
		clearMultiple.addEventListener('click', function () {
			let allPicArea = $(tag_search_list_selector);
			for (let i = 0; i < allPicArea.length; i++) {
				if (allPicArea.eq(i).find(tag_search_multiple_selector)[0] !== undefined) {
					allPicArea.eq(i).remove();
				}
			}
			outputNowResult();
		}, false);
	})();

	(function () {
		let clearUgoku = document.createElement('div');
		xz_btns_con.appendChild(clearUgoku);
		$(clearUgoku).text(xzlt('_清除动图作品'));
		$(clearUgoku).attr('title', xzlt('_清除动图作品_title'));
		setButtonStyle(clearUgoku, 6, '#E42A2A');
		clearUgoku.addEventListener('click', function () {
			let allPicArea = $(tag_search_list_selector);
			for (let i = 0; i < allPicArea.length; i++) {
				if (allPicArea.eq(i).find(tag_search_gif_selector)[0] !== undefined) {
					allPicArea.eq(i).remove();
				}
			}
			outputNowResult();
		}, false);
	})();

	(function () {
		let deleteBotton = document.createElement('div');
		deleteBotton.id = 'deleteBotton';
		xz_btns_con.appendChild(deleteBotton);
		$(deleteBotton).text(xzlt('_手动删除作品'));
		$(deleteBotton).attr('title', xzlt('_手动删除作品_title'));
		$(deleteBotton).attr('data_del', '0');
		setButtonStyle(deleteBotton, 7, '#e42a2a');
		$('#deleteBotton').bind('click', function () {
			$(tag_search_list_selector).bind('click', function () {
				if ($('#deleteBotton').attr('data_del') === '1') {
					this.remove();
					if (allow_work) {
						outputNowResult();
					}
					return false;
				}
			});
			if ($('#deleteBotton').attr('data_del') === '0') {
				$('#deleteBotton').attr('data_del', '1');
				$('#deleteBotton').text(xzlt('_退出手动删除'));
			} else if ($('#deleteBotton').attr('data_del') === '1') {
				$('#deleteBotton').attr('data_del', '0');
				$('#deleteBotton').text(xzlt('_手动删除作品'));
			}
		});
	})();

	(function () {
		let clearBotton = document.createElement('div');
		xz_btns_con.appendChild(clearBotton);
		$(clearBotton).text(xzlt('_清空作品列表'));
		$(clearBotton).attr('title', xzlt('_清空作品列表_title'));
		setButtonStyle(clearBotton, 8, '#e42a2a');
		clearBotton.addEventListener('click', function () {
			$(tag_search_list_selector).remove();
		}, false);
	})();
} else if (loc_url.indexOf('/showcase/') > 0) { //12.showcase 特辑
	// 这个类型的页面，不仅url是动态变化的，而且一个专辑页面里还会动态加载其他专辑，做的心好累啊
	page_type = 12;

	// 首先正常加载下载面板
	addBtnsAreaCtrl();
	addOutputWarp();

	// 创建下载按钮
	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).html(xzlt('_下载该专辑的图片'));
		setButtonStyle(downloadBotton, 1, '#00A514');
		downloadBotton.addEventListener('click', function () {
			resetResult();
			addOutputInfo();
			startGet();
		}, false);
	})();

	// 根据url判断显示还是隐藏下载面板
	xianzun_btns_wrap = document.querySelector('.xianzun_btns_wrap');

	is_show_downloader();

	// 监听url变化。动态加载新专辑时用的是replaceState事件
	['pushState', 'popstate', 'replaceState'].forEach((item) => {
		window.addEventListener(item, () => is_show_downloader());
	});

} else if (loc_url.indexOf('response.php') > -1) { // 13.响应关联作品
	page_type = 13;

	listPage_finished = 0; //向下第几页
	base_url = loc_url.split('&p=')[0] + '&p=';

	if ($('.page-list .current')[0] !== undefined) { //如果显示有页码
		startpage_no = Number($('.page-list .current').eq(0).text()); //最开始时的页码
	} else { //否则认为只有1页
		startpage_no = 1;
	}

	addBtnsAreaCtrl();
	addOutputWarp();

	(function () {
		let downloadBotton = document.createElement('div');
		xz_btns_con.appendChild(downloadBotton);
		$(downloadBotton).text(xzlt('_下载响应作品'));
		$(downloadBotton).attr('title', xzlt('_下载响应作品'));
		setButtonStyle(downloadBotton, 0, '#00A514');
		downloadBotton.addEventListener('click', function () {
			startGet();
		}, false);
	})();
}