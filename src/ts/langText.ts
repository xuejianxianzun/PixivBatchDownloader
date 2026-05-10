import { Config } from './Config'

// 储存下载器使用的多语言文本
// 在属性名前面添加下划线
// 目前每条语句有 6 种翻译，按顺序排列，依次是：简体中文、繁体中文、英语、日语、韩语、俄语
// {} 是占位符
// <br> 和 \n 是换行

export const langText = {
  _只下载已收藏: [
    '只下载已收藏',
    '只下載已收藏',
    'Download only bookmarked works',
    'ブックマークのみをダウンロードする',
    '북마크된 작품만 다운로드',
    'Загружайте только работы, сохраненные в закладках',
  ],
  _下载作品类型: [
    '下载作品类型',
    '下載作品類型',
    'Download work type',
    'ダウンロード作品の種類',
    '다운로드할 작품 유형',
    'Типы контента для загрузки',
  ],
  _作品类型: [
    '作品<span class="key">类型</span>',
    '作品<span class="key">類型</span>',
    '<span class="key">Type</span> of work',
    '作品の<span class="key">種類</span>',
    '작품 <span class="key">유형</span>',
    'Тип <span class="key">работы</span>',
  ],
  _不能含有tag: [
    '<span class="key">不能</span>含有标签',
    '<span class="key">不能</span>含有標籤',
    '<span class="key">Exclude</span> tag',
    'タグを<span class="key">除外</span>する',
    '<span class="key">제외</span> 태그',
    '<span class="key">Исключить</span> ярлык',
  ],
  _排除tag的提示文字: [
    '您可在下载前设置要排除的标签，这样在下载时将不会下载含有这些标签的作品。<br>不区分大小写；如需排除多个标签，请使用英文逗号分隔。<br>请注意，要排除的标签的优先级大于要包含的标签的优先级。',
    '可在下載前設定要排除的標籤，下載時將排除含有這些標籤的作品。<br>不區分大小寫；如需排除多個標籤，請使用半形逗號（,）分隔。<br>請注意，要排除的標籤優先於要包含的標籤。',
    'Before downloading, you can set the tag you want to exclude. <br>Not case sensitive; If you need to set multiple tags, you can use comma (,) separated. <br>The excluded tag takes precedence over the included tag',
    'ダウンロード前に、除外するタグを設定できます。<br>大文字と小文字を区別しない；複数のタグを設定する必要がある場合は、「,」で区切ってください。<br>除外されたタグは、必要なタグよりも優先されます',
    '다운로드하기 전에 제외해야 하는 태그를 설정할 수 있습니다. 대소문자를 구분하지 않습니다. 여러 태그를 설정해야 하는 경우 쉼표(,)로 구분합니다. 제외된 태그가 포함된 태그보다 우선합니다.',
    'Перед загрузкой можно задать тег, который необходимо исключить. Не чувствителен к регистру; Если вам нужно задать несколько тегов, вы можете использовать разделение запятыми (,). Исключенный тег имеет приоритет над включенным тегом',
  ],
  _设置了排除tag之后的提示: [
    '排除标签：',
    '排除標籤：',
    'Excludes tag: ',
    '以下のタグを除外：',
    '제외 태그: ',
    'Исключающий тег: ',
  ],
  _必须含有tag: [
    '<span class="key">必须</span>含有标签',
    '<span class="key">必須</span>含有標籤',
    '<span class="key">Include</span> tag',
    '<span class="key">必要</span>なタグ',
    '<span class="key">포함</span> 태그',
    '<span class="key">Включать</span> ярлык',
  ],
  _必须tag的提示文字: [
    '您可在下载前设置作品里必须包含的标签，不区分大小写；如需包含多个标签，请使用英文逗号分隔。',
    '可在下載前設定作品裡必須包含的標籤，不區分大小寫；如需包含多個標籤，請使用半形逗號（,）分隔。',
    'Before downloading, you can set the tag that must be included. Not case sensitive; If you need to set multiple tags, you can use comma (,) separated.',
    'ダウンロードする前に、必要なタグを設定することができます。大文字と小文字を区別しない；複数のタグを設定する必要がある場合は、「,」で区切ってください。',
    '다운로드하기 전에 포함해야 하는 태그를 설정할 수 있습니다. 대소문자를 구분하지 않습니다. 여러 태그를 설정해야 하는 경우 쉼표(,)로 구분합니다.',
    'Перед загрузкой можно задать тег, который должен быть включен. Не чувствителен к регистру; Если вам нужно задать несколько тегов, вы можете использовать разделение запятыми (,).',
  ],
  _设置了必须tag之后的提示: [
    '包含标签：',
    '包含標籤：',
    'Include tag: ',
    '以下の タグ を含める：',
    '포함 태그: ',
    'Включающий тег: ',
  ],
  _图片的宽高比例: [
    '图片的宽高<span class="key">比例</span>',
    '圖片的寬高<span class="key">比例</span>',
    'Aspect <span class="key">ratio</span>',
    '画像の<span class="key">縦横比</span>',
    '<span class="key">종횡비</span>',
    'Соотношение <span class="key">сторон</span>',
  ],
  _设置宽高比例Title: [
    '设置宽高比例，也可以手动输入宽高比',
    '設定寬高比，也可以手動輸入寬高比。',
    'Set the aspect ratio, or manually type the aspect ratio',
    '縦横比を設定する、手動で縦横比を入力することもできる',
    '종횡비를 설정하거나, 값을 수동으로 입력할 수 있습니다.',
    'Установите соотношение сторон или введите соотношение сторон вручную',
  ],
  _不限制: [
    '不限制',
    '不限制',
    'not limited',
    '無制限',
    '제한 없음',
    'Без лимитов',
  ],
  _横图: ['横图', '橫圖', 'Horizontal', '横長', '가로', 'Горизонтальный'],
  _竖图: ['竖图', '豎圖', 'Vertical', '縦長', '세로', 'Вертикальный'],
  _正方形: ['正方形', '正方形', 'Square', '正方形', '정사각형', 'Квадрат(1:1)'],
  _宽高比: ['宽高比', '寬高比', 'Ratio', '縦横比', '종횡비 ', 'Соотношение'],
  _宽高比的提示: [
    `宽高比是宽度除以高度得到的数字。<br>宽高比小于 1 时，图片是竖图。<br>宽高比大于 1 时，图片是横图。<br>宽高比越大，图片越扁长。`,
    `寬高比是寬度除以高度得到的數字。<br>寬高比小於 1 時，圖片是豎圖。<br>寬高比大於 1 時，圖片是橫圖。<br>寬高比越大，圖片越扁長。`,
    `Aspect ratio is the number obtained by dividing the width by the height.<br>When the aspect ratio is less than 1, the image is portrait.<br>When the aspect ratio is greater than 1, the image is landscape.<br>The larger the aspect ratio, the more elongated the image.`,
    `アスペクト比は幅を高さで割った値です。<br>アスペクト比が1未満の場合、画像は縦長です。<br>アスペクト比が1より大きい場合、画像は横長です。<br>アスペクト比が大きいほど、画像は横長になります。`,
    `종횡비는 너비를 높이로 나눈 숫자입니다.<br>종횡비가 1보다 작을 때, 이미지는 세로 이미지입니다.<br>종횡비가 1보다 클 때, 이미지는 가로 이미지입니다.<br>종횡비가 클수록, 이미지는 더 길쭉합니다.`,
    `Соотношение сторон — это число, полученное делением ширины на высоту.<br>Когда соотношение сторон меньше 1, изображение вертикальное.<br>Когда соотношение сторон больше 1, изображение горизонтальное.<br>Чем больше соотношение сторон, тем более вытянутое изображение.`,
  ],
  _设置了宽高比之后的提示: [
    '🛸宽高比：{}',
    '🛸寬高比：{}',
    '🛸Aspect ratio: {}',
    '🛸縦横比：{}',
    '🛸종횡비: {}',
    '🛸Соотношение сторон: {}',
  ],
  _宽高比必须是数字: [
    '宽高比必须是数字',
    '寬高比必須是數字',
    'The aspect ratio must be a number',
    '縦横比は数値でなければなりません',
    '종횡비는 숫자여야 합니다',
    'Соотношение сторон должно быть числом',
  ],
  _图片的宽高: [
    '图片的<span class="key">宽高</span>',
    '圖片的<span class="key">寬高</span>',
    '<span class="key">Width</span> and height',
    '画像の<span class="key">幅と高さ</span>',
    '<span class="key">너비</span> 그리고 높이',
    '<span class="key">Ширина</span> и высота',
  ],
  _筛选宽高的提示文字: [
    '请输入最小宽度和最小高度，不会下载不符合要求的图片。',
    '請輸入最小寬度和最小高度，只會下載符合要求的圖片。',
    'Please type the minimum width and minimum height. Will not download images that do not meet the requirements',
    '最小幅と最小高さを入力してください。要件を満たしていない画像はダウンロードされません。',
    '최소 너비와 최소 높이를 입력해주세요, 요구 사항을 충족하지 않는 이미지는 다운로드하지 않습니다.',
    'Введите минимальную ширину и минимальную высоту. Не соответствующие требованиям изображения, загружаться не будут',
  ],
  _本次输入的数值无效: [
    '本次输入的数值无效',
    '本次輸入的數值無效',
    'Invalid input',
    '無効な入力',
    '잘못된 입력',
    'Недопустимый ввод',
  ],
  _宽度: ['宽度', '寬度', 'Width', '幅', '너비', 'Ширина'],
  _或者: [' 或者 ', ' 或是 ', ' or ', ' または ', '또는', 'или'],
  _并且: [' 并且 ', ' 並且 ', ' and ', ' そして ', '그리고', 'и'],
  _高度: ['高度', '高度', 'height', '高さ', '높이', 'высота'],
  _抓取多少作品: [
    '抓取<span class="key">多少</span>作品',
    '擷取<span class="key">多少</span>作品',
    'How <span class="key">many</span> works to crawl',
    '<span class="key">クロールする</span>作品の数',
    '긁어올 작품 <span class="key">수</span>',
    'Какое <span class="key">количество</span> работ сканировать',
  ],
  _抓取多少页面: [
    '抓取<span class="key">多少</span>页面',
    '擷取<span class="key">多少</span>頁面',
    'How <span class="key">many</span> pages to crawl',
    '<span class="key">クロールする</span>ページ数',
    '긁어올 페이지 <span class="key">수</span>',
    'Какое <span class="key">количество</span> страниц сканировать',
  ],
  _收藏数量: [
    '<span class="key">收藏</span>数量',
    '<span class="key">收藏</span>數量',
    'Number of <span class="key">bookmarks</span>',
    '<span class="key">ブックマーク</span>の数',
    '<span class="key">북마크</span> 수',
    'Количество <span class="key">закладок</span>',
  ],
  _设置收藏数量的提示: [
    '如果作品的收藏数小于设置的数字，作品不会被下载。',
    '只會下載設定收藏數範圍內的作品。',
    'If the number of bookmarks of the work is less than the set number, the work will not be downloaded.',
    '作品のブックマークされた数が設定された数字よりも少ない場合、作品はダウンロードされません。',
    '작품의 북마크 수가 설정된 값보다 적을 경우 작품은 다운로드되지 않습니다.',
    'Если количество закладок произведения меньше заданного, произведение не будет загружено',
  ],
  _筛选收藏数的提示文字: [
    '请输入一个数字，如果作品的收藏数小于这个数字，作品不会被下载。',
    '請輸入數字，只會下載設定收藏數範圍內的作品。',
    'Please type a number. If the number of bookmarks of the work is less than this number, the work will not be downloaded.',
    '数字を入力してください。 作品のブックマークされた数がこの数字より少ない場合、作品はダウンロードされません。',
    '숫자를 입력해주세요. 작품의 북마크 수가 이 수보다 적을 경우 작품은 다운로드되지 않습니다.',
    'Пожалуйста, введите число. Если количество закладок произведения меньше этого числа, произведение не будет загружено.',
  ],
  _收藏数大于: [
    '收藏数 >= ',
    '收藏數 >= ',
    'Number of bookmarks >= ',
    'ブックマークの数 >= ',
    '북마크 수 >= ',
    'Количество закладок >= ',
  ],
  _收藏数小于: [
    '收藏数 <= ',
    '收藏數 <= ',
    'Number of bookmarks <= ',
    'ブックマークの数 <= ',
    '북마크 수 <=',
    'Количество закладок <= ',
  ],
  _本次任务已全部完成: [
    '本次任务已全部完成。',
    '本次工作已全部完成。',
    'This task has been completed.',
    'この作業は完了しました。',
    '이 작업은 완료되었습니다.',
    'Эта задача была выполнена.',
  ],
  _本次任务条件: [
    '本次任务条件: ',
    '本次工作條件：',
    'This task condition: ',
    'この作業の条件：',
    '이 작업 조건: ',
    'Это условие задачи: ',
  ],
  _参数不合法本次操作已取消: [
    '参数不合法，本次操作已取消。',
    '參數不合法，本次動作已取消。',
    'Parameter is not legal, this operation has been canceled.',
    'パラメータは有効ではありません。この操作はキャンセルされました。',
    '매개변수가 잘못되었습니다, 이 작업은 취소됩니다.',
    'Параметр не является разрешенным, операция отменена.',
  ],
  _本次操作已取消: [
    '本次操作已取消',
    '本次動作已取消',
    'This operation has been canceled',
    'この操作はキャンセルされました',
    '이 작업이 취소되었습니다.',
    'Эта операция была отменена',
  ],
  _向下获取所有作品: [
    '向下获取所有作品',
    '向下取得所有作品',
    'download all the work from this page.',
    'このページからすべての作品をダウンロードする。',
    '모든 작품 다운로드',
    'загрузить все работы с этой страницы',
  ],
  _抓取多少作品的提示: [
    `你可以设置抓取多少个作品。
<br>
<br>
注意：如果你修改了默认的抓取过滤条件，那么可能会有一些作品被排除。
<br>
例如：你设置为抓取 10 个作品，其中有 6 个被排除了，那么下载器就只会保留满足条件的 4 个。
<br>
<br>
对不同使用场景的说明：
<br>
<br>
当你位于某个插画或小说的详情页面里，下载器会从当前作品开始抓取（包含当前作品）。
<br>
设置为 1 只会抓取当前作品。
<br>
设置为 -1 表示不限制抓取数量，下载器会从当前作品开始，抓取到最后一个作品。
<br>
<br>
在其他页面里（例如排行榜页面、关注的用户的新作品页面），下载器会从这一页的第一个作品开始抓取。
<br>
设置为 1 只会抓取第 1 个作品。
<br>
设置为 -1 表示抓取该页面里的所有作品。
<br>`,
    `你可以設置抓取多少個作品。
<br>
<br>
注意：如果你修改了預設的抓取過濾條件，那麼可能會有一些作品被排除。
<br>
例如：你設置為抓取 10 個作品，其中有 6 個被排除了，那麼下載器就只會保留滿足條件的 4 個。
<br>
<br>
對不同使用場景的說明：
<br>
<br>
當你位於某個插畫或小說的詳情頁面裡，下載器會從當前作品開始抓取（包含當前作品）。
<br>
設置為 1 只會抓取當前作品。
<br>
設置為 -1 表示不限制抓取數量，下載器會從當前作品開始，抓取到最後一個作品。
<br>
<br>
在其他頁面裡（例如排行榜頁面、關注的用戶的新作品頁面），下載器會從這一頁的第一個作品開始抓取。
<br>
設置為 1 只會抓取第 1 個作品。
<br>
設置為 -1 表示抓取該頁面裡的所有作品。
<br>`,
    `You can set how many works to crawl.
<br>
<br>
Note: If you modify the default crawl filter conditions, some works may be excluded.
<br>
For example: If you set to crawl 10 works, and 6 of them are excluded, the downloader will only keep the 4 that meet the conditions.
<br>
<br>
Explanation for different usage scenarios:
<br>
<br>
When you are on the detail page of a certain illustration or novel, the downloader will start crawling from the current work (including the current work).
<br>
Setting to 1 will only crawl the current work.
<br>
Setting to -1 means no limit on the number of crawls; the downloader will start from the current work and crawl to the last work.
<br>
<br>
On other pages (e.g., ranking page, followed user's new works page), the downloader will start crawling from the first work on this page.
<br>
Setting to 1 will only crawl the 1st work.
<br>
Setting to -1 means crawl all works on this page.
<br>`,
    `作品のクロール数を設定できます。
<br>
<br>
注意：デフォルトのクロールフィルター条件を変更した場合、いくつかの作品が除外される可能性があります。
<br>
例：クロール数を10に設定し、そのうち6つが除外された場合、ダウンロードツールは条件を満たす4つだけを保持します。
<br>
<br>
異なる使用シナリオの説明：
<br>
<br>
特定のイラストまたは小説の詳細ページにいる場合、ダウンロードツールは現在の作品からクロールを開始します（現在の作品を含む）。
<br>
1に設定すると、現在の作品のみをクロールします。
<br>
-1に設定すると、クロール数の制限がなく、ダウンロードツールは現在の作品から最後の作品までクロールします。
<br>
<br>
他のページ（例：ランキングページ、フォロー中のユーザーの新着作品ページ）では、ダウンロードツールはこのページの最初の作品からクロールを開始します。
<br>
1に設定すると、最初の作品のみをクロールします。
<br>
-1に設定すると、このページのすべての作品をクロールします。
<br>`,
    `작품 크롤링 수를 설정할 수 있습니다.
<br>
<br>
주의: 기본 크롤링 필터 조건을 수정하면 일부 작품이 제외될 수 있습니다.
<br>
예: 크롤링 10개 작품으로 설정하고 그 중 6개가 제외되면, 다운로더는 조건을 만족하는 4개만 유지합니다.
<br>
<br>
다른 사용 시나리오에 대한 설명:
<br>
<br>
특정 일러스트나 소설의 상세 페이지에 있을 때, 다운로더는 현재 작품부터 크롤링을 시작합니다(현재 작품 포함).
<br>
1로 설정하면 현재 작품만 크롤링합니다.
<br>
-1로 설정하면 크롤링 수 제한이 없으며, 다운로더는 현재 작품부터 마지막 작품까지 크롤링합니다.
<br>
<br>
다른 페이지(예: 랭킹 페이지, 팔로우한 사용자의 신작 페이지)에서 다운로더는 이 페이지의 첫 번째 작품부터 크롤링을 시작합니다.
<br>
1로 설정하면 첫 번째 작품만 크롤링합니다.
<br>
-1로 설정하면 이 페이지의 모든 작품을 크롤링합니다.
<br>`,
    `Вы можете установить, сколько работ захватывать.
<br>
<br>
Внимание: Если вы измените условия фильтрации захвата по умолчанию, некоторые работы могут быть исключены.
<br>
Например: Если вы установите захват 10 работ, и 6 из них исключены, загрузчик сохранит только 4, соответствующие условиям.
<br>
<br>
Пояснение для разных сценариев использования:
<br>
<br>
Когда вы находитесь на странице деталей определенной иллюстрации или романа, загрузчик начнет захват с текущей работы (включая текущую работу).
<br>
Установка на 1 захватит только текущую работу.
<br>
Установка на -1 означает отсутствие ограничения на количество захватов, загрузчик начнет с текущей работы и захватит до последней работы.
<br>
<br>
На других страницах (например, странице рейтинга, странице новых работ следуемого пользователя), загрузчик начнет захват с первой работы на этой странице.
<br>
Установка на 1 захватит только 1-ю работу.
<br>
Установка на -1 означает захват всех работ на этой странице.
<br>`,
  ],
  _抓取多少页面的提示: [
    `你可以设置抓取多少个页面里的作品。
<br>
下载器总是从当前页面开始抓取的：
<br>
如果你在第 1 页，就从第 1 页开始抓取。如果你在第 2 页，就从第 2 页开始抓取。
<br>
<br>
设置为 -1 会使下载器抓取到最后一页。
<br>
如果你只需要抓取一部分页面，可以设置抓取的页数：
<br>
设置为 1 只会抓取这一页里的作品。
<br>
设置为 2 会抓取这一页和下一页，以此类推。
<br>
<br>
如果你有需要的话，可以把抓取大量页面的任务拆分成多次。例如：
<br>
设置抓取的页数为 100，然后从第 1 页开始抓取。下载器会抓取第 1 - 100 页里的作品。
<br>
下载完成后，跳转到第 101 页，开始下一次抓取。下载器会抓取第 101 - 200 页里的作品。
<br>
以此类推。
<br>`,
    `你可以設定抓取多少個頁面裡的作品。
<br>
下載器總是從當前頁面開始抓取的：
<br>
如果你在第 1 頁，就從第 1 頁開始抓取。如果你在第 2 頁，就從第 2 頁開始抓取。
<br>
<br>
設定為 -1 會使下載器抓取到最後一頁。
<br>
如果你只需要抓取一部分頁面，可以設定抓取的頁數：
<br>
設定為 1 只會抓取這一頁裡的作品。
<br>
設定為 2 會抓取這一頁和下一頁，以此類推。
<br>
<br>
如果你有需要的話，可以把抓取大量頁面的任務拆分成多次。例如：
<br>
設定抓取的頁數為 100，然後從第 1 頁開始抓取。下載器會抓取第 1 - 100 頁裡的作品。
<br>
下載完成後，跳轉到第 101 頁，開始下一次抓取。下載器會抓取第 101 - 200 頁裡的作品。
<br>
以此類推。
<br>`,
    `You can set how many pages of works to crawl.
<br>
The downloader always starts crawling from the current page:
<br>
If you are on page 1, it starts crawling from page 1. If you are on page 2, it starts crawling from page 2.
<br>
<br>
Setting it to -1 will make the downloader crawl until the last page.
<br>
If you only need to crawl some pages, you can set the number of pages to crawl:
<br>
Setting it to 1 will only crawl the works on the current page.
<br>
Setting it to 2 will crawl the current page and the next page, and so on.
<br>
<br>
If needed, you can split the task of crawling a large number of pages into multiple sessions. For example:
<br>
Set the number of pages to crawl to 100, then start crawling from page 1. The downloader will crawl works from pages 1 to 100.
<br>
After the download is complete, navigate to page 101 and start the next crawl. The downloader will crawl works from pages 101 to 200.
<br>
And so on.
<br>`,
    `何ページ分の作品をクロールするかを設定できます。
<br>
ダウンローダーは常に現在のページからクロールを開始します：
<br>
1ページ目にいる場合、1ページ目からクロールを開始します。2ページ目にいる場合、2ページ目からクロールを開始します。
<br>
<br>
-1に設定すると、ダウンローダーは最後のページまでクロールします。
<br>
一部のページだけをクロールする必要がある場合、クロールするページ数を設定できます：
<br>
1に設定すると、現在のページの作品のみをクロールします。
<br>
2に設定すると、現在のページと次のページをクロールします。以降も同様です。
<br>
<br>
必要に応じて、大量のページをクロールするタスクを複数回に分けることができます。たとえば：
<br>
クロールするページ数を100に設定し、1ページ目からクロールを開始します。ダウンローダーは1ページ目から100ページ目までの作品をクロールします。
<br>
ダウンロードが完了したら、101ページ目に移動して次のクロールを開始します。ダウンローダーは101ページ目から200ページ目までの作品をクロールします。
<br>
以降も同様です。
<br>`,
    `크롤링할 페이지 수를 설정할 수 있습니다.
<br>
다운로더는 항상 현재 페이지에서 크롤링을 시작합니다:
<br>
1페이지에 있으면 1페이지부터 크롤링을 시작합니다. 2페이지에 있으면 2페이지부터 크롤링을 시작합니다.
<br>
<br>
-1로 설정하면 다운로더가 마지막 페이지까지 크롤링합니다.
<br>
일부 페이지만 크롤링해야 하는 경우, 크롤링할 페이지 수를 설정할 수 있습니다:
<br>
1로 설정하면 현재 페이지의 작품만 크롤링합니다.
<br>
2로 설정하면 현재 페이지와 다음 페이지를 크롤링합니다. 이런 식으로 진행됩니다.
<br>
<br>
필요한 경우, 많은 페이지를 크롤링하는 작업을 여러 번으로 나눌 수 있습니다. 예를 들어:
<br>
크롤링할 페이지 수를 100으로 설정하고 1페이지부터 크롤링을 시작합니다. 다운로더는 1페이지부터 100페이지까지의 작품을 크롤링합니다.
<br>
다운로드가 완료된 후 101페이지로 이동하여 다음 크롤링을 시작합니다. 다운로더는 101페이지부터 200페이지까지의 작품을 크롤링합니다.
<br>
이런 식으로 진행됩니다.
<br>`,
    `Вы можете настроить, сколько страниц с работами нужно собрать.
<br>
Загрузчик всегда начинает сбор с текущей страницы:
<br>
Если вы находитесь на 1-й странице, сбор начнется с 1-й страницы. Если вы на 2-й странице, сбор начнется со 2-й страницы.
<br>
<br>
Установка значения -1 заставит загрузчик собирать данные до последней страницы.
<br>
Если вам нужно собрать только часть страниц, вы можете указать количество страниц для сбора:
<br>
Установка значения 1 означает, что будут собраны только работы с текущей страницы.
<br>
Установка значения 2 означает, что будут собраны работы с текущей страницы и следующей, и так далее.
<br>
<br>
При необходимости задачу сбора большого количества страниц можно разбить на несколько этапов. Например:
<br>
Установите количество страниц для сбора равным 100 и начните сбор с 1-й страницы. Загрузчик соберет работы со страниц 1–100.
<br>
После завершения загрузки перейдите на 101-ю страницу и начните следующую сессию сбора. Загрузчик соберет работы со страниц 101–200.
<br>
И так далее.
<br>`,
  ],
  _下载所有页面: [
    '下载所有页面',
    '下載所有頁面',
    'download all pages',
    'すべてのページをダウンロードする',
    '모든 페이지 다운로드',
    'загрузить все страницы',
  ],
  _抓取所有页面: [
    `抓取所有页面`,
    `抓取所有頁面`,
    `Crawl all pages`,
    `すべてのページをクロール`,
    `모든 페이지 크롤링`,
    `Скраулить все страницы`,
  ],
  _下载x个相关作品: [
    '下载 {} 个相关作品',
    '下載 {} 個相關作品',
    'download {} related works.',
    '関連作品 {} 枚をダウンロードする。',
    '관련 작품 {}개를 다운로드',
    'скачать {} связанные работы',
  ],
  _下载所有相关作品: [
    '下载所有相关作品',
    '下載所有相關作品',
    'download all related works.',
    '関連作品をすべてダウンロードする。',
    '모든 관련 작품 다운로드',
    'скачать все соответствующие работы.',
  ],
  _下载推荐作品: [
    '下载推荐作品',
    '下載推薦作品',
    'download recommended works',
    'おすすめ作品をダウンロードする',
    '추천 작품 다운로드',
    'скачать рекомендуемые работы',
  ],
  _下载排行榜前x个作品: [
    '下载排行榜前 {} 个作品',
    '下載排行榜前 {} 個作品',
    'download the top {} works in the ranking list',
    'ランク前 {} 位の作品をダウンロードする。',
    '랭킹 목록 상위 {}개의 작품 다운로드',
    'загрузить лучшие {} работы в рейтинговом списке',
  ],
  _输入超过了最大值: [
    '您输入的数字超过了最大值',
    '輸入的數字超出最大值',
    'The number you set exceeds the maximum',
    '入力した番号が最大値を超えています',
    '설정하신 수가 최대값을 초과합니다',
    'Заданное вами число превышает максимальное',
  ],
  _从本页开始下载x页: [
    '从本页开始下载 {} 页',
    '從本頁開始下載 {} 頁',
    'download {} pages from this page',
    'このページから {} ページをダウンロードする',
    '이 페이지부터 {} 페이지 다운로드',
    'Начать загрузку с страниц этой {} страницы',
  ],
  _从本页开始抓取x页: [
    `从本页开始抓取 {} 页`,
    `從本頁開始抓取 {} 頁`,
    `Start crawling from this page for {} pages`,
    `このページから {} ページをクロール開始`,
    `이 페이지부터 {} 페이지 크롤링 시작`,
    `Начиная с этой страницы, скраулить {} страниц`,
  ],
  _抓取x页_每页最多含有50个作品: [
    `抓取 {} 页（每页最多含有 50 个作品）`,
    `抓取 {} 頁（每頁最多含有 50 個作品）`,
    `Crawl {} pages (up to 50 works per page)`,
    `{} ページをクロール（1ページあたり最大50作品）`,
    `{} 페이지 크롤링 (페이지당 최대 50개 작품)`,
    `Скраулить {} страниц (максимум 50 работ на страницу)`,
  ],
  _从本页开始下载x个: [
    '从本页开始下载 {} 个作品',
    '從本頁開始下載 {} 個作品',
    'Download {} works from this page.',
    'このページから {} 枚の作品をダウンロード。',
    '이 페이지부터 {}개의 작품 다운로드',
    'Загрузить {} работы с этой страницы.',
  ],
  _从本页开始抓取x个: [
    `从本页开始抓取 {} 个作品`,
    `從本頁開始抓取 {} 個作品`,
    `Start crawling from this page for {} works`,
    `このページから {} 件の作品をクロール開始`,
    `이 페이지부터 {}개 작품 크롤링 시작`,
    `Начиная с этой страницы, скраулить {} работ`,
  ],
  _任务开始: [
    '任务开始',
    '工作開始',
    'Task starts',
    '作業が開始されます',
    '작업 시작',
    'Задание начинается',
  ],
  _排除作品类型: [
    '🛸排除作品类型：',
    '🛸排除作品類型：',
    '🛸Excludes these types of works: ',
    '🛸これらのタイプの作品を除外：',
    '🛸제외된 작품 유형: ',
    '🛸Исключает эти виды работ: ',
  ],
  _多图作品: [
    '多图作品',
    '多圖作品',
    'Multi-image works',
    '複数画像作品',
    '여러 이미지 작품',
    'Работа с несколькими изображениями',
  ],
  _多图下载设置: [
    '多图下载设置',
    '多圖下載設定',
    'Download multi-image works',
    '複数画像設定',
    '여러 이미지 작품 다운로드',
    'Загрузить работы с несколькими изображениями',
  ],
  _不下载: ['不下载', '不下載', 'No', '必要なし', '아니요', 'Нет'],
  _全部下载: ['全部下载', '全部下載', 'Yes', '全部ダウンロード', '네', 'Да'],
  _插画: [
    '插画',
    '插畫',
    'Illustrations',
    'イラスト',
    '일러스트',
    'Иллюстрации',
  ],
  _漫画: ['漫画', '漫畫', 'Manga', 'マンガ', '만화', 'Манга'],
  _动图: [
    '动图',
    '動圖',
    'Ugoira',
    'うごイラ',
    '움직이는 일러스트',
    'Ugoira(гиф)',
  ],
  _小说: ['小说', '小說', 'Novels', '小説', '소설', 'Новеллы'],
  _动图保存格式: [
    '<span class="key">动图</span>保存格式',
    '<span class="key">動圖</span>儲存格式',
    'Save the <span class="key">ugoira</span> work as',
    '<span class="key">うごイラ</span>の保存タイプ',
    '<span class="key">움직이는 일러스트</span> 작품 저장 형식',
    'Сохранить <span class="key">Ugoira</span> как',
  ],
  _动图保存格式的说明: [
    `下载器可以把动图保存为多种格式，并且你可以根据需要同时选择多种格式。<br>
<br>
格式列表：<br>
- WebP 图片：可以选择有损或无损压缩。相比其他图像格式，在画质相同时的体积最小，推荐使用。<br>
- WebM 视频：有损压缩。它是视频文件，需要使用视频播放器打开。<br>
- GIF 图片：有损压缩。优点是兼容性好，缺点是画质最差，体积也比较大，不推荐。<br>
- APNG 图片：无损压缩。缺点是体积最大，而且转换耗时也最长。<br>
- ZIP 文件：无损。它是动图的源文件，包含多张静态图片，并且下载器会在里面添加一个 JSON 文件保存动画的元数据。<br>
- Ugoira 文件：无损。它其实就是 ZIP 文件，只是扩展名为 .ugoira。<br>
<br>
子选项：<br>
- WebP 图像质量：你可以设置 WebP 图片的质量，默认是高质量的有损压缩。你也可以改为无损压缩。<br>
- 为动图保存一张缩略图：下载动图时，保存一张它的静态缩略图文件。<br>
<br>
推荐的格式：<br>
我推荐优先使用 WebP 图片，因为它在相同画质时的体积最小。缺点是一些比较旧的看图软件可能不支持查看 WebP 动图。<br>
另外，对于 Windows 用户我也很推荐使用 Ugoira 文件。你可以安装 <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a> 来播放 .ugoira 文件（免费版即可），此时 Ugoira 文件有很多优点：原始文件，无损，有动画效果，无须转换，体积也小。但是其他系统可能没有类似的软件。<br>
<br>
每种格式的体积：<br>
我下载了近期的 1000 个动图作品进行测试，下面是每种格式的平均体积，仅供参考：<br>
- ZIP/Ugoira：9MB<br>
- WebP：7 MB（有损压缩）或 35 MB（无损压缩）<br>
- WebM：10 MB<br>
- GIF：20 MB<br>
- APNG：48 MB<br>
从小到大排序：WebP（有损）< ZIP/Ugoira < WebM < GIF < WebP（无损）< APNG。<br>
<br>
在资源管理器里显示缩略图：<br>
这部分说明只适用于 Windows 系统。通过一些设置，你可以在资源管理器里查看所有动图格式的缩略图。<br>
- GIF 图片：系统本身就支持显示它的缩略图。<br>
- WebP 图片：安装 <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a>，然后按 F5 打开它的设置，在“快捷菜单”设置的“缩略图预览”里选择 WebP 格式，即可显示 WebP 动画的缩略图。<br>
- WebM 视频：安装 <a href="https://www.codecguide.com/download_k-lite_codec_pack_standard.htm" target="_blank">K-Lite Codec Pack</a> 即可显示 WebM 视频的缩略图。<br>
- APNG 图片、ZIP 文件、Ugoira 文件：在 Icaros 里添加这些格式的扩展名，就可以显示它们的缩略图。如果你安装了 K-Lite Codec Pack，那么它应该自带了 Icaros，你可以在开始菜单里搜索来找到它。如果你找不到它，也可以单独安装 <a href="https://github.com/Xanashi/Icaros/releases" target="_blank">Icaros</a>。运行 Icaros，启用它的缩略图功能，在文件类型列表的末尾添加 <span class="blue">;apng;zip;ugoira</span>，或者把对应类型的文件拖拽到 Icaros 的窗口里来添加它。<br>`,
    `下載器可以把動圖儲存為多種格式，而且你可以依照需要同時選擇多種格式。<br>
<br>
格式列表：<br>
- WebP 圖片：可以選擇有損或無損壓縮。和其他圖像格式相比，在畫質相同時，它的體積最小，推薦使用。<br>
- WebM 影片：有損壓縮。它是影片檔案，需要使用影片播放器開啟。<br>
- GIF 圖片：有損壓縮。優點是相容性好，缺點是畫質最差，體積也比較大，不推薦。<br>
- APNG 圖片：無損壓縮。缺點是體積最大，而且轉換耗時也最久。<br>
- ZIP 檔案：無損。它是動圖的原始檔案，包含多張靜態圖片，而且下載器會在裡面加入一個 JSON 檔案來保存動畫的中繼資料。<br>
- Ugoira 檔案：無損。它其實就是 ZIP 檔案，只是副檔名為 .ugoira。<br>
<br>
子選項：<br>
- WebP 圖像品質：你可以設定 WebP 圖片的品質，預設是高品質的有損壓縮。你也可以改成無損壓縮。<br>
- 為動圖儲存一張縮圖：下載動圖時，儲存一張它的靜態縮圖檔案。<br>
<br>
推薦的格式：<br>
我推薦優先使用 WebP 圖片，因為它在相同畫質時的體積最小。缺點是一些比較舊的看圖軟體可能不支援查看 WebP 動圖。<br>
另外，對於 Windows 使用者，我也很推薦使用 Ugoira 檔案。你可以安裝 <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a> 來播放 .ugoira 檔案（免費版即可），這樣 Ugoira 檔案有很多優點：原始檔案、無損、有動畫效果、不需要轉換，而且體積也小。不過其他系統可能沒有類似的軟體。<br>
<br>
每種格式的體積：<br>
我下載了近期的 1000 個動圖作品進行測試，下面是每種格式的平均體積，僅供參考：<br>
- ZIP/Ugoira：9MB<br>
- WebP：7 MB（有損壓縮）或 35 MB（無損壓縮）<br>
- WebM：10 MB<br>
- GIF：20 MB<br>
- APNG：48 MB<br>
從小到大排序：WebP（有損）< ZIP/Ugoira < WebM < GIF < WebP（無損）< APNG。<br>
<br>
在檔案總管裡顯示縮圖：<br>
這部分說明只適用於 Windows 系統。透過一些設定，你可以在檔案總管裡查看所有動圖格式的縮圖。<br>
- GIF 圖片：系統本身就支援顯示它的縮圖。<br>
- WebP 圖片：安裝 <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a>，然後按 F5 打開它的設定，在 "快捷選單" 設定的 "縮圖預覽" 裡選擇 WebP 格式，即可顯示 WebP 動畫的縮圖。<br>
- WebM 影片：安裝 <a href="https://www.codecguide.com/download_k-lite_codec_pack_standard.htm" target="_blank">K-Lite Codec Pack</a> 即可顯示 WebM 影片的縮圖。<br>
- APNG 圖片、ZIP 檔案、Ugoira 檔案：在 Icaros 裡加入這些格式的副檔名，就可以顯示它們的縮圖。如果你安裝了 K-Lite Codec Pack，那它應該會附帶 Icaros，你可以在開始功能表裡搜尋找到它。如果你找不到它，也可以單獨安裝 <a href="https://github.com/Xanashi/Icaros/releases" target="_blank">Icaros</a>。執行 Icaros，啟用它的縮圖功能，在檔案類型列表的末尾添加 <span class="blue">;apng;zip;ugoira</span>，或者把對應類型的檔案拖曳到 Icaros 的視窗裡來添加它。<br>`,
    `The downloader can save Ugoira in multiple formats, and you can also choose multiple formats at the same time if needed.<br>
<br>
Format list:<br>
- WebP image: You can choose either lossy or lossless compression. Compared with other image formats, it has the smallest file size at the same image quality, so it is recommended.<br>
- WebM video: Lossy compression. It is a video file, so you need a video player to open it.<br>
- GIF image: Lossy compression. Its advantage is good compatibility, but the drawbacks are the worst image quality and a relatively large file size, so it is not recommended.<br>
- APNG image: Lossless compression. The drawbacks are that it has the largest file size and also takes the longest time to convert.<br>
- ZIP file: Lossless. It is the source file of the Ugoira, containing multiple static images, and the downloader also adds a JSON file inside it to save the animation metadata.<br>
- Ugoira file: Lossless. It is basically just a ZIP file with the .ugoira extension.<br>
<br>
Sub-options:<br>
- WebP image quality: You can set the quality of WebP images. By default, it uses high-quality lossy compression. You can also change it to lossless compression.<br>
- Save a thumbnail for Ugoira: When downloading Ugoira, also save one static thumbnail file for it.<br>
<br>
Recommended formats:<br>
I recommend using WebP images first, because they have the smallest file size at the same image quality. The drawback is that some older image viewers may not support animated WebP images.<br>
Also, I highly recommend Ugoira files for Windows users. You can install <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a> to play .ugoira files, and the free version is enough. In that case, Ugoira files have many advantages: original file, lossless, animated, no conversion needed, and small file size. But other systems may not have similar software.<br>
<br>
File size of each format:<br>
I downloaded and tested 1,000 recent Ugoira works. Below is the average file size of each format, for reference only:<br>
- ZIP/Ugoira: 9 MB<br>
- WebP: 7 MB (lossy) or 35 MB (lossless)<br>
- WebM: 10 MB<br>
- GIF: 20 MB<br>
- APNG: 48 MB<br>
Sorted from smallest to largest: WebP (lossy) < ZIP/Ugoira < WebM < GIF < WebP (lossless) < APNG.<br>
<br>
Show thumbnails in File Explorer:<br>
This part only applies to Windows. With a few settings, you can view thumbnails for all Ugoira formats in File Explorer.<br>
- GIF image: The system already supports showing its thumbnail.<br>
- WebP image: Install <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a>, then press F5 to open its settings. In the "Context Menu" settings, under "Thumbnail Preview", select the WebP format, and then thumbnails for animated WebP files will be shown.<br>
- WebM video: Install <a href="https://www.codecguide.com/download_k-lite_codec_pack_standard.htm" target="_blank">K-Lite Codec Pack</a>, and thumbnails for WebM videos will be shown.<br>
- APNG image, ZIP file, and Ugoira file: Add the extensions for these formats in Icaros, and their thumbnails can be shown. If you installed K-Lite Codec Pack, it should already include Icaros, and you can search for it in the Start menu. If you cannot find it, you can also install <a href="https://github.com/Xanashi/Icaros/releases" target="_blank">Icaros</a> separately. Run Icaros, enable its thumbnail feature, add <span class="blue">;apng;zip;ugoira</span> at the end of the file type list, or drag files of those types into the Icaros window to add them.<br>`,
    `ダウンローダーでは、Ugoira を複数の形式で保存できます。必要に応じて、複数の形式を同時に選ぶこともできます。<br>
<br>
形式一覧：<br>
- WebP 画像：非可逆圧縮と可逆圧縮を選べます。他の画像形式と比べて、同じ画質ならファイルサイズが最も小さいので、おすすめです。<br>
- WebM 動画：非可逆圧縮です。動画ファイルなので、動画プレイヤーで開く必要があります。<br>
- GIF 画像：非可逆圧縮です。互換性が高いのは利点ですが、画質が最も悪く、ファイルサイズも比較的大きいため、おすすめしません。<br>
- APNG 画像：可逆圧縮です。欠点は、ファイルサイズが最も大きく、変換にかかる時間も最も長いことです。<br>
- ZIP ファイル：可逆です。これは Ugoira の元ファイルで、複数の静止画像が含まれています。さらに、ダウンローダーがその中にアニメーションのメタデータを保存する JSON ファイルを追加します。<br>
- Ugoira ファイル：可逆です。実際には拡張子が .ugoira になった ZIP ファイルです。<br>
<br>
サブオプション：<br>
- WebP 画像品質：WebP 画像の品質を設定できます。デフォルトは高品質の非可逆圧縮です。可逆圧縮に変更することもできます。<br>
- Ugoira 用にサムネイルを1枚保存する：Ugoira をダウンロードするときに、静止サムネイルファイルを1枚保存します。<br>
<br>
おすすめの形式：<br>
まずは WebP 画像を使うのがおすすめです。同じ画質ならファイルサイズが最も小さいからです。欠点は、少し古い画像ビューアでは WebP アニメーションを表示できない場合があることです。<br>
また、Windows ユーザーには Ugoira ファイルもとてもおすすめです。.ugoira ファイルを再生するために <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a> をインストールできます。無料版で十分です。この場合、Ugoira ファイルには多くの利点があります。元ファイル、可逆、アニメーションあり、変換不要、しかもサイズも小さいです。ただし、他の OS には同様のソフトがないかもしれません。<br>
<br>
各形式のファイルサイズ：<br>
最近の Ugoira 作品を 1000 件ダウンロードしてテストしました。以下は各形式の平均ファイルサイズです。参考用です。<br>
- ZIP/Ugoira：9MB<br>
- WebP：7 MB（非可逆圧縮）または 35 MB（可逆圧縮）<br>
- WebM：10 MB<br>
- GIF：20 MB<br>
- APNG：48 MB<br>
小さい順に並べると、WebP（非可逆）< ZIP/Ugoira < WebM < GIF < WebP（可逆）< APNG です。<br>
<br>
エクスプローラーでサムネイルを表示する：<br>
この説明は Windows のみ対象です。いくつか設定すれば、エクスプローラーで全部の Ugoira 形式のサムネイルを表示できます。<br>
- GIF 画像：システムがもともとサムネイル表示に対応しています。<br>
- WebP 画像：<a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a> をインストールしてから、F5 を押して設定を開きます。"ショートカットメニュー" 設定の "サムネイルプレビュー" で WebP 形式を選ぶと、WebP アニメーションのサムネイルを表示できます。<br>
- WebM 動画：<a href="https://www.codecguide.com/download_k-lite_codec_pack_standard.htm" target="_blank">K-Lite Codec Pack</a> をインストールすると、WebM 動画のサムネイルを表示できます。<br>
- APNG 画像、ZIP ファイル、Ugoira ファイル：Icaros にこれらの形式の拡張子を追加すると、サムネイルを表示できます。K-Lite Codec Pack をインストールしていれば、Icaros も一緒に入っているはずなので、スタートメニューで検索して見つけられます。見つからない場合は、<a href="https://github.com/Xanashi/Icaros/releases" target="_blank">Icaros</a> を単独でインストールすることもできます。Icaros を起動してサムネイル機能を有効にし、ファイルタイプ一覧の末尾に <span class="blue">;apng;zip;ugoira</span> を追加するか、対応する種類のファイルを Icaros のウィンドウへドラッグ＆ドロップして追加してください。<br>`,
    `다운로더는 Ugoira를 여러 형식으로 저장할 수 있고, 필요에 따라 여러 형식을 동시에 선택할 수도 있습니다.<br>
<br>
형식 목록:<br>
- WebP 이미지: 손실 압축과 무손실 압축 중에서 선택할 수 있습니다. 다른 이미지 형식과 비교했을 때, 같은 화질이라면 파일 크기가 가장 작아서 추천합니다.<br>
- WebM 비디오: 손실 압축입니다. 비디오 파일이므로 비디오 플레이어로 열어야 합니다.<br>
- GIF 이미지: 손실 압축입니다. 장점은 호환성이 좋다는 점이지만, 단점은 화질이 가장 나쁘고 파일 크기도 비교적 커서 추천하지 않습니다.<br>
- APNG 이미지: 무손실 압축입니다. 단점은 파일 크기가 가장 크고 변환 시간도 가장 오래 걸린다는 점입니다.<br>
- ZIP 파일: 무손실입니다. 이것은 Ugoira의 원본 파일이며, 여러 장의 정적 이미지가 들어 있습니다. 또 다운로더가 그 안에 애니메이션 메타데이터를 저장하는 JSON 파일도 추가합니다.<br>
- Ugoira 파일: 무손실입니다. 사실상 확장자만 .ugoira인 ZIP 파일입니다.<br>
<br>
하위 옵션:<br>
- WebP 이미지 품질: WebP 이미지의 품질을 설정할 수 있습니다. 기본값은 고화질 손실 압축이며, 무손실 압축으로 바꿀 수도 있습니다.<br>
- Ugoira용 썸네일 1장을 저장하기: Ugoira를 다운로드할 때 정적인 썸네일 파일 1장도 함께 저장합니다.<br>
<br>
추천 형식:<br>
같은 화질일 때 파일 크기가 가장 작기 때문에, 우선 WebP 이미지를 추천합니다. 단점은 일부 오래된 이미지 뷰어에서는 WebP 애니메이션을 지원하지 않을 수 있다는 점입니다.<br>
또한 Windows 사용자라면 Ugoira 파일도 아주 추천합니다. <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a>를 설치하면 .ugoira 파일을 재생할 수 있고, 무료 버전으로도 충분합니다. 이 경우 Ugoira 파일은 장점이 많습니다. 원본 파일이고, 무손실이며, 애니메이션 효과가 있고, 변환이 필요 없고, 파일 크기도 작습니다. 다만 다른 운영체제에는 비슷한 소프트웨어가 없을 수도 있습니다.<br>
<br>
형식별 파일 크기:<br>
최근 Ugoira 작품 1000개를 다운로드해서 테스트했습니다. 아래는 각 형식의 평균 파일 크기이며, 참고용입니다.<br>
- ZIP/Ugoira: 9MB<br>
- WebP: 7 MB(손실 압축) 또는 35 MB(무손실 압축)<br>
- WebM: 10 MB<br>
- GIF: 20 MB<br>
- APNG: 48 MB<br>
작은 것부터 큰 것 순서: WebP(손실) < ZIP/Ugoira < WebM < GIF < WebP(무손실) < APNG.<br>
<br>
탐색기에서 썸네일 표시하기:<br>
이 설명은 Windows에서만 적용됩니다. 몇 가지 설정을 하면 탐색기에서 모든 Ugoira 형식의 썸네일을 볼 수 있습니다.<br>
- GIF 이미지: 시스템에서 원래 썸네일 표시를 지원합니다.<br>
- WebP 이미지: <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a>를 설치한 다음 F5를 눌러 설정을 엽니다. "바로가기 메뉴" 설정의 "썸네일 미리보기"에서 WebP 형식을 선택하면 WebP 애니메이션의 썸네일을 표시할 수 있습니다.<br>
- WebM 비디오: <a href="https://www.codecguide.com/download_k-lite_codec_pack_standard.htm" target="_blank">K-Lite Codec Pack</a>를 설치하면 WebM 비디오의 썸네일을 표시할 수 있습니다.<br>
- APNG 이미지, ZIP 파일, Ugoira 파일: Icaros에 이런 형식의 확장자를 추가하면 썸네일을 표시할 수 있습니다. K-Lite Codec Pack을 설치했다면 Icaros도 함께 들어 있을 가능성이 높으니 시작 메뉴에서 검색해서 찾을 수 있습니다. 찾을 수 없다면 <a href="https://github.com/Xanashi/Icaros/releases" target="_blank">Icaros</a>를 따로 설치해도 됩니다. Icaros를 실행하고 썸네일 기능을 켠 뒤, 파일 형식 목록 맨 끝에 <span class="blue">;apng;zip;ugoira</span> 를 추가하거나, 해당 형식의 파일을 Icaros 창으로 드래그해서 추가하면 됩니다.<br>`,
    `Загрузчик может сохранять Ugoira в нескольких форматах, и при необходимости вы можете выбрать сразу несколько форматов одновременно.<br>
<br>
Список форматов:<br>
- Изображение WebP: можно выбрать сжатие с потерями или без потерь. По сравнению с другими форматами изображений, при одинаковом качестве у него самый маленький размер файла, поэтому этот вариант рекомендуется.<br>
- Видео WebM: сжатие с потерями. Это видеофайл, поэтому для открытия нужен видеоплеер.<br>
- Изображение GIF: сжатие с потерями. Плюс в хорошей совместимости, но минусы в том, что качество изображения хуже всего, а размер файла сравнительно большой, поэтому этот вариант не рекомендуется.<br>
- Изображение APNG: сжатие без потерь. Минусы в том, что размер файла самый большой, и конвертация занимает больше всего времени.<br>
- ZIP-файл: без потерь. Это исходный файл Ugoira, в котором содержится несколько статических изображений, а загрузчик также добавляет внутрь JSON-файл для сохранения метаданных анимации.<br>
- Файл Ugoira: без потерь. На самом деле это обычный ZIP-файл, только с расширением .ugoira.<br>
<br>
Подпункты:<br>
- Качество изображения WebP: вы можете настроить качество изображений WebP. По умолчанию используется высококачественное сжатие с потерями. При желании можно переключить и на сжатие без потерь.<br>
- Сохранить одну миниатюру для Ugoira: при скачивании Ugoira сохранить один статический файл миниатюры.<br>
<br>
Рекомендуемые форматы:<br>
В первую очередь я рекомендую использовать изображения WebP, потому что при одинаковом качестве у них самый маленький размер файла. Недостаток в том, что некоторые старые программы для просмотра изображений могут не поддерживать анимированный WebP.<br>
Кроме того, пользователям Windows я тоже очень рекомендую формат Ugoira. Вы можете установить <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a> для воспроизведения файлов .ugoira, и бесплатной версии будет достаточно. В этом случае у файлов Ugoira много преимуществ: это исходный файл, без потерь, с анимацией, без необходимости конвертации, и при этом он тоже небольшой по размеру. Но в других системах похожего ПО может не быть.<br>
<br>
Размер каждого формата:<br>
Я скачал и протестировал 1000 недавних работ Ugoira. Ниже приведен средний размер файла для каждого формата, только для справки:<br>
- ZIP/Ugoira: 9MB<br>
- WebP: 7 MB (сжатие с потерями) или 35 MB (сжатие без потерь)<br>
- WebM: 10 MB<br>
- GIF: 20 MB<br>
- APNG: 48 MB<br>
Сортировка от меньшего к большему: WebP (с потерями) < ZIP/Ugoira < WebM < GIF < WebP (без потерь) < APNG.<br>
<br>
Показ миниатюр в Проводнике:<br>
Эта часть относится только к Windows. После некоторых настроек вы сможете видеть миниатюры всех форматов Ugoira в Проводнике.<br>
- Изображение GIF: система уже сама поддерживает показ его миниатюр.<br>
- Изображение WebP: установите <a href="https://www.bandisoft.com/bandiview/" target="_blank">BandiView</a>, затем нажмите F5, чтобы открыть его настройки. В настройках "Контекстное меню", в разделе "Предпросмотр миниатюр", выберите формат WebP, и тогда миниатюры анимированных WebP будут отображаться.<br>
- Видео WebM: установите <a href="https://www.codecguide.com/download_k-lite_codec_pack_standard.htm" target="_blank">K-Lite Codec Pack</a>, и миниатюры видео WebM будут отображаться.<br>
- Изображение APNG, ZIP-файл и файл Ugoira: добавьте расширения этих форматов в Icaros, и их миниатюры будут отображаться. Если у вас установлен K-Lite Codec Pack, то Icaros, скорее всего, уже входит в комплект, и его можно найти через поиск в меню "Пуск". Если вы не можете его найти, можно отдельно установить <a href="https://github.com/Xanashi/Icaros/releases" target="_blank">Icaros</a>. Запустите Icaros, включите функцию миниатюр, добавьте <span class="blue">;apng;zip;ugoira</span> в конец списка типов файлов или перетащите файлы этих типов в окно Icaros, чтобы добавить их.<br>`,
  ],
  _webmVideo: [
    'WebM 视频',
    '影片（WebM）',
    'WebM video',
    'WebM ビデオ',
    'WebM 동영상',
    'WebM видео',
  ],
  _webp图片: [
    'WebP 图片',
    '圖片（WebP）',
    'WebP image',
    'WebP 画像',
    'WebP 이미지',
    'WebP изображение',
  ],
  _WebP图像质量: [
    `WebP 图像质量`,
    `WebP 圖像品質`,
    `WebP image quality`,
    `WebP 画像品質`,
    `WebP 이미지 품질`,
    `Качество изображения WebP`,
  ],
  _有损: ['有损', '有損', 'Lossy', '非可逆', '손실', 'С потерями'],
  _无损: ['无损', '無損', 'Lossless', '可逆', '무손실', 'Без потерь'],
  _为动图保存一张缩略图: [
    `为动图保存一张缩略图`,
    `為動圖儲存一張縮圖`,
    `Save a thumbnail for Ugoira`,
    `Ugoira 用にサムネイルを1枚保存する`,
    `Ugoira용 썸네일 1장을 저장하기`,
    `Сохранить одну миниатюру для Ugoira`,
  ],
  _跳过这个缩略图: [
    `跳过这个缩略图`,
    `跳過這張縮圖`,
    `Skip this thumbnail`,
    `このサムネイルをスキップ`,
    `이 썸네일 건너뛰기`,
    `Пропустить эту миниатюру`,
  ],
  _gif图片: [
    'GIF 图片',
    '圖片（GIF）',
    'GIF image',
    'GIF 画像',
    'GIF 이미지',
    'GIF изображение',
  ],
  _apng图片: [
    'APNG 图片',
    '圖片（APNG）',
    'APNG image',
    'APNG 画像',
    'APNG 이미지',
    'APNG изображение',
  ],
  _zip文件: [
    'ZIP 文件',
    '壓縮檔（ZIP）',
    'ZIP file',
    'ZIP ファイル',
    'ZIP 파일',
    'ZIP файл',
  ],
  _Ugoira文件: [
    `Ugoira 文件`,
    `Ugoira 檔案`,
    `Ugoira file`,
    `Ugoira ファイル`,
    `Ugoira 파일`,
    `Файл Ugoira`,
  ],
  _当前有x个作品: [
    '当前有 {} 个作品',
    '目前有 {} 個作品',
    'There are now {} works',
    '今は　{}　枚の作品があります',
    '현재 {}개의 작품이 있습니다',
    'В настоящее время существует {} работ',
  ],
  _当前有x个用户: [
    '当前有 {} 个用户',
    '目前有 {} 個使用者',
    'There are currently {} users',
    '現在 {} 人のユーザーがいます',
    '현재 {}명의 유저가 있습니다',
    'В настоящее время существует {} пользователей',
  ],
  _当前有x个符合条件的用户: [
    `当前有 {} 个符合条件的用户`,
    `當前有 {} 個符合條件的用戶`,
    `Currently there are {} qualifying users`,
    `現在、条件に合うユーザーが {} 人います`,
    `현재 {}명의 조건에 맞는 사용자가 있습니다`,
    `Сейчас {} подходящих пользователей`,
  ],
  _已抓取x个用户: [
    '已抓取 {} 个用户',
    '已擷取 {} 個使用者',
    'crawled {} users',
    'クロールされた {} ユーザー',
    '{}명의 유저를 긁어왔습니다',
    'Сканированные {} пользователи',
  ],
  _排行榜进度: [
    '已抓取本页面第 {} 部分',
    '已擷取本頁面第 {} 部分',
    'Part {} of this page has been crawled',
    'このページの第　{}　部がクロールされました',
    '이 페이지의 {} 부분을 긁어왔습니다',
    'Часть {} этой страницы была просмотрена',
  ],
  _新作品进度: [
    '已抓取本页面 {} 个作品',
    '已擷取本頁面 {} 個作品',
    'This page has been crawled {} works',
    'このページの {} つの作品をクロールしました',
    '이 페이지의 {}개의 작품을 긁어왔습니다',
    'На этой странице было просканированно {} работ',
  ],
  _抓取多少个作品: [
    '抓取本页面 {} 个作品',
    '擷取本頁面 {} 個作品',
    'Crawl this page {} works',
    'このページの {} つの作品をクロールします',
    '이 페이지의 {}개의 작품 긁어오기',
    'Сканировать на этой странице {} работ',
  ],
  _相关作品抓取完毕: [
    '相关作品抓取完毕。包含有{}个作品，开始获取作品信息。',
    '相關作品擷取完畢。包含有 {} 個作品，開始取得作品資訊。',
    'The related works have been crawled. Contains {} works and starts getting information about the work.',
    '関連作品はクロールされました。 {} 作品を含み、その作品に関する情報の取得を開始します。',
    '관련 작품 긁어오기 완료, {}개의 작품이 포함되어 있으며, 작품 정보 가져오기를 시작합니다',
    'Связанные работы были просканированы. Содержит {} работ и начинает получать информацию о работе(ах).',
  ],
  _排行榜任务完成: [
    '本页面抓取完毕。<br>当前有{}个作品，开始获取作品信息。',
    '本頁面擷取完畢。<br>目前有 {} 個作品，開始取得作品資訊。',
    'This page is crawled and now has {} works.<br> Start getting the works for more information.',
    'このページのクロール終了。<br>{}枚の作品があります。 作品情報の取得を開始します。',
    '이 페이지 긁어오기 완료되었습니다<br>현재 {}개의 작품이 있으며, 작품 정보 가져오기를 시작합니다',
    'Эта страница просмотрена и имеет {} работ.<br> Начинаю получать работы для получения дополнительной информации.',
  ],
  _开始获取作品信息: [
    '开始获取作品信息',
    '開始取得作品資訊',
    'Start getting work data',
    '作品情報の取得を開始します',
    '작품 정보 가져오기 시작',
    'Начинаю получать данные о работе',
  ],
  _列表页抓取进度: [
    '已抓取列表页 {} 个页面',
    '已擷取清單頁 {} 個頁面',
    'Has acquired {} list pages',
    '{} のリストページを取得しました',
    '{}개의 목록 페이지를 획득하였습니다',
    'Получено {} страниц списка',
  ],
  _列表页抓取进度2: [
    '正在抓取列表页 {}/{}',
    '正在抓取列表頁 {}/{}',
    'crawling list page {}/{}',
    'リストページの取得 {}/{}',
    '목록 페이지 긁어오는 중 {}/{}',
    'Вытаскивание списка страниц {}/{}',
  ],
  _列表页抓取完成: [
    '列表页面抓取完成',
    '清單頁面擷取完成',
    'The list page is crawled',
    'リストページがクロールされ',
    '목록 페이지 긁어오기 완료',
    'Список страниц просканирован',
  ],
  _抓取结果为零请检查筛选条件: [
    `抓取完毕，但没有找到符合筛选条件的作品。<br>请检查“抓取”相关的设置，并查看日志里显示的信息。`,
    `抓取完畢，但沒有找到符合篩選條件的作品。<br>請檢查「抓取」相關的設置，並查看日誌裡顯示的資訊。`,
    `Crawling completed, but no works matching the filter conditions were found.<br>Please check the "crawl"-related settings and view the information displayed in the log.`,
    `クロールが完了しましたが、フィルター条件に一致する作品が見つかりませんでした。<br>「クロール」関連の設定を確認し、ログに表示される情報をご覧ください。`,
    `크롤링이 완료되었으나, 필터 조건에 맞는 작품을 찾을 수 없습니다.<br>"크롤" 관련 설정을 확인하고 로그에 표시된 정보를 확인하세요。`,
    `Кроулинг завершен, но работы, соответствующие условиям фильтрации, не найдены。<br>Проверьте настройки, связанные с "crawl", и просмотрите информацию, отображаемую в журнале。`,
  ],
  _抓取结果为零并且所有作品都产生了合并系列小说时的提示: [
    `本次抓取中的所有作品都是系列小说，没有单篇小说需要下载，所以抓取结果是 0。`,
    `本次抓取中的所有作品都是系列小說，沒有單篇小說需要下載，所以抓取結果是 0。`,
    `All works in this crawl are series novels, and there are no standalone novels to download, so the crawl result is 0.`,
    `今回のクロール対象の作品はすべてシリーズ小説で、単発小説は存在しないため、クロール結果は 0 件です。`,
    `이번 크롤링의 모든 작품이 시리즈 소설이며, 단편 소설은 없으므로 크롤링 결과는 0입니다.`,
    `Все работы в этом краулинге являются сериями романов, отдельных романов для скачивания нет, поэтому результат краулинга — 0.`,
  ],
  _当前任务尚未完成: [
    '当前任务尚未完成',
    '目前工作尚未完成',
    'The current task has not yet been completed',
    '現在の作業はまだ完了していません',
    '현재 작업이 아직 완료되지 않았습니다',
    'Текущее задание еще не выполнено',
  ],
  _当前任务尚未完成2: [
    '当前任务尚未完成，请等待完成后再下载。',
    '目前工作尚未完成，請等待完成後再下載。',
    'The current task has not yet been completed',
    '現在の作業はまだ完了していません、完了するまでお待ちください',
    '현재 작업이 아직 완료되지 않았습니다, 완료될 때까지 기다려주세요.',
    'Текущее задание еще не выполнено',
  ],
  _下载器正忙忽略本次操作: [
    `下载器正忙，忽略本次操作`,
    `下載器正忙，忽略本次操作`,
    `Downloader is busy, ignoring this operation`,
    `ダウンロードツールがビジー状態です。この操作を無視します`,
    `다운로더가 바빠서 이번 작업을 무시합니다`,
    `Загрузчик занят, текущая операция игнорируется`,
  ],
  _列表抓取完成开始获取作品页: [
    '当前列表中有{}张作品，开始获取作品信息',
    '目前清單中有 {} 張作品，開始取得作品資訊',
    'Now has {} works. Start getting the works for more information.',
    '{} 枚の作品があります。 作品情報の取得を開始します。',
    '현재 {}개의 작품이 있습니다, 작품 정보 가져오기를 시작합니다',
    'Сейчас в работе {} работ. Начните получать работы для получения дополнительной информации.',
  ],
  _开始获取作品页面: [
    '开始获取作品页面',
    '開始取得作品頁面',
    'Start getting the works page',
    '作品ページの取得を開始する',
    '작품 페이지 가져오기 시작',
    'Начинаю получать страницу с работами',
  ],
  _无权访问: [
    '无权访问 {}，跳过该作品。',
    '沒有權限存取 {}，跳過該作品。',
    'No access {}, skip.',
    '{} のアクセス権限がありません、作品を無視する。',
    '{}에 접근 권한이 없습니다, 이 작업을 건너뜁니다.',
    'Нет доступа {}, пропуск.',
  ],
  _你的账号可能已经被限制无法添加收藏: [
    `你的账号可能已经被限制，无法添加收藏`,
    `你的帳號可能已經被限制，無法添加收藏`,
    `Your account may have been restricted and cannot add bookmarks`,
    `アカウントが制限されている可能性があり、ブックマークを追加できません`,
    `계정이 제한되어 북마크를 추가할 수 없습니다`,
    `Ваш аккаунт, возможно, ограничен и не может добавлять закладки`,
  ],
  _状态码: [
    `状态码`,
    `狀態碼`,
    `Status code`,
    `ステータスコード`,
    `상태 코드`,
    `Код состояния`,
  ],
  _状态码0的提示: [
    '请求的 URL 不可访问 (0)',
    '要求的 URL 無法存取 (0)',
    'The requested URL is not accessible (0)',
    '要求された URL にアクセスできません (0)',
    '요청한 URL에 접근할 수 없습니다 (0)',
    'Запрашиваемый URL недоступен (0)',
  ],
  _状态码400的提示: [
    `请求无效，可能是格式错误，或者请求的资源已经不存在（400 Bad Request）`,
    `請求無效，可能是格式錯誤，或者請求的資源已經不存在（400 Bad Request）`,
    `Invalid request, possibly due to format error, or the requested resource no longer exists (400 Bad Request)`,
    `無効なリクエストです。フォーマットエラー、またはリクエストされたリソースがすでに存在しない可能性があります（400 Bad Request）`,
    `잘못된 요청, 형식 오류일 수 있거나 요청한 리소스가 이미 존재하지 않을 수 있습니다(400 Bad Request)`,
    `Недействительный запрос, возможно, ошибка формата или запрашиваемый ресурс уже не существует (400 Bad Request)`,
  ],
  _状态码401的提示: [
    `未授权，请您登录 Pixiv 账号然后重试（401 Unauthorized）`,
    `未授權，請您登錄 Pixiv 帳號然後重試（401 Unauthorized）`,
    `Unauthorized, please log in to your Pixiv account and try again (401 Unauthorized)`,
    `未承認です。Pixiv アカウントにログインして再試行してください（401 Unauthorized）`,
    `권한 없음, Pixiv 계정에 로그인한 후 다시 시도해 주세요 (401 Unauthorized)`,
    `Не авторизовано, пожалуйста, войдите в аккаунт Pixiv и попробуйте снова (401 Unauthorized)`,
  ],
  _状态码403的提示: [
    `禁止访问。您可能没有权限访问这个 URL（403 Forbidden）`,
    `禁止訪問。您可能沒有權限訪問這個 URL（403 Forbidden）`,
    `Access forbidden. You may not have permission to access this URL (403 Forbidden)`,
    `アクセス禁止。この URL にアクセスする権限がない可能性があります（403 Forbidden）`,
    `접근 금지. 이 URL에 접근할 권한이 없을 수 있습니다(403 Forbidden)`,
    `Доступ запрещен. Возможно, у вас нет прав доступа к этому URL (403 Forbidden)`,
  ],
  _状态码404的提示: [
    `要获取的数据不存在（404 Not Found）`,
    `要獲取的數據不存在（404 Not Found）`,
    `The data to be retrieved does not exist (404 Not Found)`,
    `取得するデータが存在しません（404 Not Found）`,
    `가져올 데이터가 존재하지 않습니다(404 Not Found)`,
    `Данные для получения не существуют (404 Not Found)`,
  ],
  _该作品可能已经被删除或者需要成为作者的好友才能查看: [
    `该作品可能已经被删除，或者需要成为作者的 Pixiv 好友才能查看`,
    `該作品可能已經被刪除，或者需要成為作者的 Pixiv 好友才能查看`,
    `This work may have been deleted, or you need to become the author's Pixiv friend to view it`,
    `この作品は削除された可能性があります。あるいは、作者の Pixiv 友達になる必要があります`,
    `이 작품은 삭제되었을 수 있으며, 작가의 Pixiv 친구가 되어야 볼 수 있습니다`,
    `Это произведение, возможно, было удалено, или вам нужно стать Pixiv-другом автора, чтобы просмотреть его`,
  ],
  _状态码429下载器会重试的提示: [
    `请求太频繁（429 Too Many Requests）。下载器会等待几分钟，然后重试该请求`,
    `請求太頻繁（429 Too Many Requests）。下載器會等待幾分鐘，然後重試該請求`,
    `Too many requests (429 Too Many Requests). The downloader will wait a few minutes and then retry the request`,
    `リクエストが多すぎます（429 Too Many Requests）。ダウンロードツールは数分間待機してから、このリクエストを再試行します`,
    `요청이 너무 빈번합니다(429 Too Many Requests). 다운로더가 몇 분 동안 기다린 후 해당 요청을 재시도합니다`,
    `Слишком много запросов (429 Too Many Requests). Загрузчик подождёт несколько минут, а затем повторит запрос`,
  ],
  _状态码429的提示: [
    `请求太频繁（429 Too Many Requests）`,
    `請求太頻繁（429 Too Many Requests）`,
    `Too many requests (429 Too Many Requests)`,
    `リクエストが多すぎます（429 Too Many Requests）`,
    `요청이 너무 빈번합니다(429 Too Many Requests)`,
    `Слишком много запросов (429 Too Many Requests)`,
  ],
  _下载器会等待几分钟然后重试: [
    `下载器会等待几分钟，然后重试该请求`,
    `下載器會等待幾分鐘，然後重試該請求`,
    `The downloader will wait a few minutes and then retry the request`,
    `ダウンロードツールは数分間待機してから、このリクエストを再試行します`,
    `다운로더가 몇 분 동안 기다린 후 해당 요청을 재시도합니다`,
    `Загрузчик подождёт несколько минут, а затем повторит запрос`,
  ],
  _状态码500的提示: [
    `服务器处理该请求时发生了错误（500 Internal Server Error）`,
    `伺服器處理該請求時發生了錯誤（500 Internal Server Error）`,
    `An error occurred while the server was processing this request (500 Internal Server Error)`,
    `サーバーがこのリクエストを処理中にエラーが発生しました（500 Internal Server Error）`,
    `서버가 이 요청을 처리하는 동안 오류가 발생했습니다(500 Internal Server Error)`,
    `Во время обработки этого запроса сервером произошла ошибка (500 Internal Server Error)`,
  ],
  _状态码503的提示: [
    `服务器目前无法处理该请求（503 Service Unavailable）`,
    `伺服器目前無法處理該請求（503 Service Unavailable）`,
    `The server is currently unable to process this request (503 Service Unavailable)`,
    `サーバーが現在このリクエストを処理できません（503 Service Unavailable）`,
    `서버가 현재 이 요청을 처리할 수 없습니다(503 Service Unavailable)`,
    `Сервер в настоящее время не может обработать этот запрос (503 Service Unavailable)`,
  ],
  _错误代码: [
    '错误代码',
    '錯誤程式碼',
    'Error code',
    'エラー コード',
    '오류 코드',
    'Код ошибки',
  ],
  _网络错误状态码为x网址为y: [
    `网络错误，状态码 {}，网址：<br>{}`,
    `網路錯誤，狀態碼 {}，網址：<br>{}`,
    `Network error, status code {}, URL: <br>{}`,
    `ネットワークエラー、ステータスコード {}、URL: <br>{}`,
    `네트워크 오류, 상태 코드 {}, URL: <br>{}`,
    `Сетевая ошибка, код состояния {}, URL: <br>{}`,
  ],
  _正在抓取: [
    '正在抓取，请等待……',
    '擷取中，請稍後……',
    'Getting, please wait...',
    'クロール中、しばらくお待ちください...',
    '얻어오는 중, 잠시만 기다려주세요...',
    'Получение, пожалуйста, подождите...',
  ],
  _获取全部书签作品: [
    '获取全部书签作品，时间可能比较长，请耐心等待。',
    '取得全部書籤作品，時間可能比較長，請耐心等待。',
    'Get all bookmarked works, the time may be longer, please wait.',
    'ブックマークしたすべての作品を取得すると、時間がかかることがあります。お待ちください。',
    '북마크된 작품을 모두 가져오는 것은 시간이 오래 걸릴 수 있으니 기다려주세요.',
    'Получить все работы из закладок, это может занять время, пожалуйста, подождите',
  ],
  _抓取图片网址遇到中断: [
    '当前任务已中断!',
    '目前工作已中斷！',
    'The current task has been interrupted.',
    '現在の作業が中断されました。',
    '현재 작업이 중단되었습니다!',
    'Текущая задача была прервана.',
  ],
  _关闭: ['关闭', '關閉', 'close', 'クローズ', '닫기', 'закрыть'],
  _输出信息: [
    '输出信息',
    '輸出資訊',
    'Output information',
    '出力情報',
    '출력 정보',
    'Выходная информация',
  ],
  _复制: ['复制', '複製', 'Copy', 'コピー', '복사', 'Копировать'],
  _已复制到剪贴板: [
    '已复制到剪贴板，可直接粘贴',
    '已複製至剪貼簿，可直接貼上',
    'Has been copied to the clipboard',
    'クリップボードにコピーされました',
    '클립보드에 복사되었습니다.',
    'Скопировано в буфер обмена',
  ],
  _下载设置: [
    '下载设置',
    '下載設定',
    'Download settings',
    'ダウンロード設定',
    '다운로드 설정',
    'Настройки загрузки',
  ],
  _收起展开设置项: [
    '收起/展开设置项',
    '摺疊/展開設定項目',
    'Collapse/expand settings',
    '設定の折りたたみ/展開',
    '설정 축소/확장',
    'Свернуть/развернуть настройки',
  ],
  _github: [
    'Github 页面，欢迎 star',
    'Github 頁面，歡迎 star',
    'Github page, if you like, please star it',
    'Github のページ、star をクリックしてください',
    'Github, 유용하셨다면 Star를 주세요.',
    'Страница на Github, если вам нравится, пожалуйста, поставьте звезду',
  ],
  _wiki: ['使用手册', 'Wiki', 'Wiki', 'マニュアル', '위키', 'Вики'],
  _快捷键ALTX显示隐藏控制面板: [
    '你可以使用快捷键 <span class="blue">Alt</span> + <span class="blue">X</span> 显示或隐藏控制面板。',
    '你可以使用快捷鍵 <span class="blue">Alt</span> + <span class="blue">X</span> 顯示或隱藏控制面板。',
    'You can use the shortcut keys <span class="blue">Alt</span> + <span class="blue">X</span> to show or hide the control panel.',
    'ショートカット キー <span class="blue">Alt</span> + <span class="blue">X</span> を使用して、コントロール パネルを表示または非表示にできます。',
    '단축키 <span class="blue">Alt</span> + <span class="blue">X</span>를 사용하여 제어판을 표시하거나 숨길 수 있습니다.',
    'Вы можете использовать сочетания клавиш <span class="blue">Alt</span> + <span class="blue">X</span>, чтобы отобразить или скрыть панель управления.',
  ],
  _隐藏控制面板: [
    '隐藏控制面板（Alt + X）',
    '隱藏控制面板（Alt + X）',
    'hide control panel (Alt + X)',
    'コントロールパネルを隠す（Alt + X）',
    '제어판 숨기기 (Alt + X)',
    'скрыть панель управления (Alt + X)',
  ],
  _显示控制面板: [
    '显示控制面板 (Alt + X)',
    '顯示控制面板 (Alt + X)',
    'Show control panel (Alt + X)',
    'コントロールパネルを表示 (Alt + X)',
    '제어판 표시 (Alt + X)',
    'показать панель управления (Alt + X)',
  ],
  _共抓取到n个文件: [
    '共抓取到 {} 个文件',
    '共擷取到 {} 個檔案',
    'Crawl a total of {} files',
    '合計 {} つのファイルがあります',
    '총 {}개의 파일을 긁어왔습니다',
    'Всего просканированно {} файлов',
  ],
  _共抓取到n个作品: [
    '共抓取到 {} 个作品',
    '共擷取到 {} 個作品',
    'Crawl a total of {} works',
    '合計 {} つの作品があります',
    '총 {}개의 작품을 긁어왔습니다',
    'Всего просканированно {} работ',
  ],
  _共抓取到n个作品产生了n个抓取结果: [
    `共抓取到 {} 个作品，产生了 {} 个抓取结果`,
    `共抓取到 {} 個作品，產生了 {} 個抓取結果`,
    `Crawled a total of {} works, producing {} crawl results`,
    `合計 {} 件の作品をクロールし、{} 件のクロール結果を生成しました`,
    `총 {}개의 작품을 크롤링하여 {}개의 크롤링 결과가 생성되었습니다`,
    `Всего скраулено {} работ, сгенерировано {} результатов краулинга`,
  ],
  _图像作品的命名规则: [
    `图像作品的<span class="key">命名</span>规则`,
    `圖像作品的<span class="key">命名</span>規則`,
    `<span class="key">Naming</span> rule for image works`,
    `画像作品の<span class="key">命名</span>ルール`,
    `이미지 작품의 <span class="key">명명</span> 규칙`,
    `Правило <span class="key">именования</span> для работ с изображениями`,
  ],
  _小说的命名规则: [
    `小说的<span class="key">命名</span>规则`,
    `小說的<span class="key">命名</span>規則`,
    `<span class="key">Naming</span> rule for novels`,
    `小説の<span class="key">命名</span>ルール`,
    `소설의 <span class="key">명명</span> 규칙`,
    `Правило <span class="key">именования</span> для novel`,
  ],
  _命名规则: [
    '命名规则',
    '命名規則',
    'Naming rule',
    '命名規則',
    '명명 규칙',
    'Правила названий',
  ],
  _添加命名标记前缀: [
    '添加命名标记<span class="key">前缀</span>',
    '加入命名標記<span class="key">前綴</span>',
    'Add named tag <span class="key">prefix</span>',
    '<span class="key">前に</span>タグの名前を追加',
    '명명된 태그 추가 <span class="key">접두사</span>',
    'Добавить именованный тег <span class="key">префикс</span>',
  ],
  _添加字段名称提示: [
    `例如，在用户名前面添加“user_”标记`,
    '例如，在使用者名稱前面加入「user_」標記。',
    `For example, add the 'user_' tag in front of the username`,
    'たとえば、ユーザー名の前に 「user_」タグを追加します。',
    `예: 유저명 앞에 'user_' 태그 추가`,
    `Например, добавьте тег 'user_' перед именем пользователя`,
  ],
  _命名标记id: [
    `每个文件的 ID。图片文件会附带序号，如 <span class="blue">85633671_p0</span>；小说文件没有序号。注意：这不是作品 ID，而是文件 ID。如果一个作品里含有多张图片，每张图片的 {id} 都是不同的，例如 <span class="blue">85633671_p1</span>、<span class="blue">85633671_p2</span>。`,
    `每個檔案的 ID。圖片檔案會附帶序號，例如 <span class="blue">85633671_p0</span>；小說檔案沒有序號。注意：這不是作品 ID，而是檔案 ID。如果一個作品裡含有多張圖片，每張圖片的 {id} 都是不同的，例如 <span class="blue">85633671_p1</span>、<span class="blue">85633671_p2</span>。`,
    `The ID of each file. Image files include a sequence number, such as <span class="blue">85633671_p0</span>; novel files do not have a sequence number. Note: this is not the work ID, but the file ID. If a work contains multiple images, the {id} for each image is different, for example <span class="blue">85633671_p1</span> and <span class="blue">85633671_p2</span>.`,
    `各ファイルの ID です。image ファイルには連番が付きます。たとえば <span class="blue">85633671_p0</span> のようになります。novel ファイルには連番はありません。注意: これは作品 ID ではなく、ファイル ID です。1つの作品に複数の image が含まれている場合、各 image の {id} はそれぞれ異なります。たとえば <span class="blue">85633671_p1</span>、<span class="blue">85633671_p2</span> です。`,
    `각 파일의 ID입니다. image 파일에는 <span class="blue">85633671_p0</span> 처럼 일련번호가 붙습니다. novel 파일에는 일련번호가 없습니다. 주의: 이것은 work ID가 아니라 파일 ID입니다. 하나의 work에 여러 장의 image가 들어 있으면 각 image의 {id} 는 서로 다릅니다. 예를 들면 <span class="blue">85633671_p1</span>, <span class="blue">85633671_p2</span> 입니다.`,
    `ID каждого файла. У файлов image есть порядковый номер, например <span class="blue">85633671_p0</span>; у файлов novel порядкового номера нет. Обратите внимание: это не ID work, а ID файла. Если work содержит несколько image, то {id} у каждой image будет разным, например <span class="blue">85633671_p1</span> и <span class="blue">85633671_p2</span>.`,
  ],
  _命名标记title: [
    '作品标题',
    '作品標題',
    'Works title',
    '作品のタイトル',
    '작품 제목',
    'Название работ',
  ],
  _命名标记tags: [
    '作品的标签列表',
    '作品的標籤清單',
    'The tags of the work',
    '作品のタグ',
    '작품 태그',
    'Теги работ',
  ],
  _命名标记user: [
    '用户名字',
    '使用者名稱',
    'User name',
    'ユーザー名',
    '유저명',
    'Никнейм юзера',
  ],
  _用户id: [
    '用户 ID（数字）',
    '使用者 ID（數字）',
    'User ID (Number)',
    'ユーザー ID (Number)',
    '유저 ID (숫자)',
    'ID Юзера (Число)',
  ],
  _命名标记px: [
    `原图的宽度和高度。例如：<span class="blue">600x900</span>。小说作品没有这个属性，下载器会忽略它。`,
    `原圖的寬度和高度。例如：<span class="blue">600x900</span>。小說作品沒有這個屬性，下載器會忽略它。`,
    `The width and height of the original image. For example: <span class="blue">600x900</span>. Novel works do not have this property, and the downloader will ignore it.`,
    `原画像の幅と高さ。例：<span class="blue">600x900</span>。小説作品にはこの属性がなく、ダウンロードツールはそれを無視します。`,
    `원본 이미지의 너비와 높이. 예: <span class="blue">600x900</span>. 소설 작품에는 이 속성이 없으며, 다운로더는 이를 무시합니다.`,
    `Ширина и высота оригинального изображения. Например: <span class="blue">600x900</span>. Романы не имеют этого свойства, и загрузчик будет игнорировать его。`,
  ],
  _命名标记char_count: [
    `小说的字数或单词数（取决于小说的语言），是数字。当作品不是小说时会被忽略。`,
    `小說的字數或單詞數（取決於小說的語言），是數字。當作品不是小說時會被忽略。`,
    `The number of characters or words in the novel (depending on the language of the novel), it is a number. It will be ignored when the work is not a novel.`,
    `小説の文字数または単語数（小説の言語による）、数値です。作品が小説でない場合は無視されます。`,
    `소설의 글자 수 또는 단어 수 (소설의 언어에 따라), 숫자입니다. 작품이 소설이 아닌 경우 무시됩니다.`,
    `Количество символов или слов в романе (зависит от языка романа), это число. Игнорируется, если работа не является романом.`,
  ],
  _命名标记bmk: [
    'Bookmark count，作品的收藏数。把它放在最前面可以让文件按收藏数排序。',
    'Bookmark count，作品的收藏數。將它放在最前面可以讓檔案依收藏數排序。',
    'Bookmark count, bookmarks number of works.',
    'Bookmark count，作品のボックマークの数、前に追加することでボックマーク数で并べることができます。',
    '북마크 수. 맨 앞에 두면 북마크 수별로 문서를 정렬할 수 있습니다.',
    'Количество закладок, количество произведений в закладках',
  ],
  _命名标记bmk_id: [
    'Bookmark ID。你收藏的每一个作品都会有一个 Bookmark ID。收藏的时间越晚，Bookmark ID 就越大。当你下载你的收藏时，可以使用 {bmk_id} 作为排序依据。',
    'Bookmark ID。你收藏的每一個作品都會有一個 Bookmark ID。收藏的時間越晚，Bookmark ID 就越大。當你下載你的收藏時，可以使用 {bmk_id} 作為排序依據。',
    'Bookmark ID. Every work in your bookmarks will have a Bookmark ID. The later the bookmark is added, the larger the Bookmark ID. When you download your bookmarks, you can use {bmk_id} as a sorting basis.',
    'ブックマークID。 ブックマーク内のすべての作品にはブックマークIDがあります。 ブックマークを後で追加すると、ブックマークIDが大きくなります。 ブックマークをダウンロードするときは、{bmk_id}を並べ替えの基準として使用できます。',
    '북마크 ID. 당신이 북마크하고 있는 작품마다 북마크 ID가 있습니다. 북마크 시간이 늦어질수록 북마크 ID는 커집니다. 북마크를 다운로드할때 {bmk_id}를 기준으로 정렬할 수 있습니다.',
    'Bookmark ID. Каждая работа в ваших закладках будет иметь идентификатор закладки. Чем позже добавлена закладка, тем больше ID закладки. Когда вы загружаете закладки, вы можете использовать {bmk_id} в качестве основы для сортировки.',
  ],
  _命名标记bmk_1000: [
    '作品收藏数的简化显示。例如：<span class="blue">0+</span>、<span class="blue">1000+</span>、<span class="blue">2000+</span>、<span class="blue">3000+</span> ……',
    '作品收藏數的簡化顯示。例如：<span class="blue">0+</span>、<span class="blue">1000+</span>、<span class="blue">2000+</span>、<span class="blue">3000+</span> ……',
    'Simplified number of bookmark, e.g. <span class="blue">0+</span>、<span class="blue">1000+</span>、<span class="blue">2000+</span>、<span class="blue">3000+</span> ……',
    '作品のボックマークの数の簡略表示。例：<span class="blue">0+</span>、<span class="blue">1000+</span>、<span class="blue">2000+</span>、<span class="blue">3000+</span> ……',
    '단순화된 북마크 수. 예: <span class="blue">0+</span>, <span class="blue">1000+</span>, <span class="blue">2000+</span>, <span class="blue">3000+</span> ……',
    'Упрощенное количество закладок, напр. <span class="blue">0+</span>、<span class="blue">1000+</span>、<span class="blue">2000+</span>、<span class="blue">3000+</span> ......',
  ],
  _命名标记age: [
    `作品的年龄限制，分为：<span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>`,
    `作品的年齡限制，分為：<span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>`,
    `The age restriction of the work is divided into: <span class="blue">All Ages</span>, <span class="blue">R-18</span>, <span class="blue">R-18G</span>`,
    `作品の年齢制限は、<span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>に分かれます`,
    `작품의 연령 제한은 <span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>으로 나뉩니다`,
    `Возрастное ограничение работы разделено на: <span class="blue">All Ages</span>, <span class="blue">R-18</span>, <span class="blue">R-18G</span>`,
  ],
  _命名标记age_r: [
    `仅当作品为限制级时，输出它的年龄限制，分为：<span class="blue">R-18</span>、<span class="blue">R-18G</span>，否则忽略它。`,
    `僅當作品為限制級時，輸出它的年齡限制，分為：<span class="blue">R-18</span>、<span class="blue">R-18G</span>，否則忽略它。`,
    `Output its age restriction only when the work is restricted, divided into: <span class="blue">R-18</span>, <span class="blue">R-18G</span>; otherwise, ignore it.`,
    `作品が制限級の場合のみ、その年齢制限を出力：<span class="blue">R-18</span>、<span class="blue">R-18G</span>。それ以外の場合はそれを無視します。`,
    `작품이 제한 등급일 때만 그 연령 제한을 출력：<span class="blue">R-18</span>、<span class="blue">R-18G</span>。그렇지 않으면 이를 무시합니다。`,
    `Выводить возрастное ограничение только если работа ограничена, разделено на: <span class="blue">R-18</span>, <span class="blue">R-18G</span>; в противном случае игнорируйте его。`,
  ],
  _命名标记like: [
    'Like count，作品的点赞数。',
    'Like count，作品的點讚數。',
    'Like count.',
    'Like count。',
    '좋아요 수',
    'Колличество лайков',
  ],
  _命名标记view: [
    'View count，作品的浏览量。',
    'View count，作品的瀏覽量。',
    'View count.',
    'View count。',
    '조회수',
    'Колличество просмотров',
  ],
  _命名标记pid: [
    `作品的数字 ID，不包括序号，例如 <span class="blue">85633671</span>。`,
    `作品的數字 ID，不包括序號，例如 <span class="blue">85633671</span>。`,
    `The numeric ID of the work, excluding the sequence number, for example <span class="blue">85633671</span>.`,
    `作品の数字 ID、シーケンス番号を含まない、例：<span class="blue">85633671</span>。`,
    `작품의 숫자 ID, 순서 번호를 포함하지 않음, 예: <span class="blue">85633671</span>。`,
    `Числовой ID работы, без порядкового номера, например <span class="blue">85633671</span>.`,
  ],
  _命名标记p: [
    `图片在作品内的序号，例如 <span class="blue">0</span>、<span class="blue">1</span>、<span class="blue">2</span> …… 每个作品都会重新计数。小说作品没有这个属性，下载器会忽略它。`,
    `圖片在作品內的序號，例如 <span class="blue">0</span>、<span class="blue">1</span>、<span class="blue">2</span> …… 每個作品都會重新計數。小說作品沒有這個屬性，下載器會忽略它。`,
    `The sequence number of the image within the work, for example <span class="blue">0</span>, <span class="blue">1</span>, <span class="blue">2</span> ... Each work will recount. Novel works do not have this property, and the downloader will ignore it.`,
    `作品内の画像のシーケンス番号、例：<span class="blue">0</span>、<span class="blue">1</span>、<span class="blue">2</span> …… 各作品で再カウントされます。小説作品にはこの属性がなく、ダウンロードツールはそれを無視します。`,
    `작품 내 이미지의 순서 번호, 예: <span class="blue">0</span>、<span class="blue">1</span>、<span class="blue">2</span> …… 각 작품마다 다시 카운트됩니다. 소설 작품에는 이 속성이 없으며, 다운로더는 이를 무시합니다.`,
    `Серийный номер изображения в работе, например <span class="blue">0</span>, <span class="blue">1</span>, <span class="blue">2</span> ... Каждая работа пересчитывается. У романов нет этого свойства, и загрузчик игнорирует его.`,
  ],
  _命名标记_sl: [
    `图像作品的 sanity_level 属性，值是以下数字之一：<span class="blue">0</span>、<span class="blue">2</span>、<span class="blue">4</span>、<span class="blue">6</span>。小说作品没有这个属性，会忽略这个标记。`,
    `圖像作品的 sanity_level 屬性，值是以下數字之一：<span class="blue">0</span>、<span class="blue">2</span>、<span class="blue">4</span>、<span class="blue">6</span>。小說作品沒有這個屬性，會忽略這個標記。`,
    `The sanity_level property of image works has a value of one of the following numbers: <span class="blue">0</span>, <span class="blue">2</span>, <span class="blue">4</span>, <span class="blue">6</span>. Novel works do not have this property and will ignore this marker.`,
    `画像作品の sanity_level 属性の値は以下の数字のいずれかです：<span class="blue">0</span>、<span class="blue">2</span>、<span class="blue">4</span>、<span class="blue">6</span>。小説作品にはこの属性がなく、このマーカーは無視されます。`,
    `이미지 작품의 sanity_level 속성 값은 다음 숫자 중 하나입니다: <span class="blue">0</span>, <span class="blue">2</span>, <span class="blue">4</span>, <span class="blue">6</span>. 소설 작품에는 이 속성이 없으며 이 마커를 무시합니다.`,
    `Атрибут sanity_level изображений работ принимает одно из следующих значений: <span class="blue">0</span>, <span class="blue">2</span>, <span class="blue">4</span>, <span class="blue">6</span>. Новеллы не имеют этого атрибута и будут игнорировать эту метку.`,
  ],
  _命名标记_multi_image_folder: [
    `它代表“为多图作品添加一层文件夹”里设置的文件夹规则。如果你启用了这个设置，那么下载器在为多图作品创建文件名时，会把它替换为你设置的文件夹规则。非多图作品会忽略这个标记。`,
    `它代表「為多圖作品添加一層資料夾」裡設定的資料夾規則。如果你啟用了這個設定，那麼下載器在為多圖作品建立檔名時，會把它替換為你設定的資料夾規則。非多圖作品會忽略這個標記。`,
    `It represents the folder rule set in "Add a folder layer for multi-image works". If you have enabled this setting, the downloader will replace it with the folder rule you set when creating the filename for multi-image works. Non-multi-image works will ignore this marker.`,
    `これは「複数画像作品に1層のフォルダを追加」で設定したフォルダ規則を表します。この設定を有効にしている場合、ダウンローダーは複数画像作品のファイル名を作成する際に、それをあなたが設定したフォルダ規則に置き換えます。非複数画像作品はこのマーカーを無視します。`,
    `이는 "다중 이미지 작품에 한 층의 폴더 추가"에서 설정한 폴더 규칙을 나타냅니다. 이 설정을 활성화한 경우, 다운로더는 다중 이미지 작품의 파일명을 생성할 때 이를 설정한 폴더 규칙으로 대체합니다. 비다중 이미지 작품은 이 마커를 무시합니다.`,
    `Оно представляет правило папки, установленное в «Добавить слой папки для многоизображных работ». Если вы включили эту настройку, загрузчик при создании имени файла для многоизображных работ заменит его на правило папки, которое вы задали. Работы, не являющиеся многоизображными, будут игнорировать эту метку.`,
  ],
  _命名标记_r18_g_folder: [
    `它代表“为 R-18(G) 作品添加一层文件夹”里设置的文件夹规则。如果你启用了这个设置，下载器在为 R-18(G) 作品生成文件名时，会把它替换为你设置的文件夹规则。非 R-18(G) 作品会忽略这个标记。`,
    `它代表「為 R-18(G) 作品添加一層資料夾」裡設定的資料夾規則。如果你啟用了這個設定，下載器在為 R-18(G) 作品產生檔名時，會把它替換為你設定的資料夾規則。非 R-18(G) 作品會忽略這個標記。`,
    `It represents the folder rule set in "Add a folder layer for R-18(G) works". If you have enabled this setting, the downloader will replace it with the folder rule you set when generating the filename for R-18(G) works. Non R-18(G) works will ignore this marker.`,
    `これは「R-18(G)作品に1層のフォルダを追加」で設定したフォルダ規則を表します。この設定を有効にしている場合、ダウンローダーは R-18(G)作品のファイル名を生成する際に、それをあなたが設定したフォルダ規則に置き換えます。R-18(G) 以外の作品はこのマーカーを無視します。`,
    `이는 "R-18(G) 작품에 한 층의 폴더 추가"에서 설정한 폴더 규칙을 나타냅니다. 이 설정을 활성화한 경우, 다운로더는 R-18(G) 작품의 파일명을 생성할 때 이를 설정한 폴더 규칙으로 대체합니다. 비 R-18(G) 작품은 이 마커를 무시합니다.`,
    `Оно представляет правило папки, установленное в настройке «Добавить слой папки для работ R-18(G)». Если вы включили эту настройку, загрузчик при генерации имени файла для работ R-18(G) заменит его на правило папки, которое вы задали. Работы, не являющиеся R-18(G), будут игнорировать эту метку.`,
  ],
  _命名标记_match_tag_folder1: [
    `它是"使用第一个匹配的标签建立文件夹"里第一个标签列表的匹配结果。如果你启用了这个设置，并且匹配到了你设置的标签，它就会输出这个标签；否则会被忽略。`,
    `它是「使用第一個匹配的標籤建立資料夾」裡第一個標籤列表的匹配結果。如果你啟用了這個設定，並且匹配到了你設定的標籤，它就會輸出這個標籤；否則會被忽略。`,
    `This is the match result of the first tag list in "Create folder using the first matching tag". If you have enabled this setting and a matching tag is found, it will output that tag; otherwise it will be ignored.`,
    `これは「最初にマッチしたタグを使ってフォルダーを作成する」の最初のタグリストのマッチ結果です。この設定を有効にしていて、設定したタグがマッチした場合はそのタグを出力します。マッチしなかった場合は無視されます。`,
    `이것은 "처음 매칭된 태그로 폴더 만들기"에서 첫 번째 태그 목록의 매칭 결과입니다. 이 설정을 활성화하고 설정한 태그가 매칭되면 해당 태그를 출력합니다. 그렇지 않으면 무시됩니다.`,
    `Это результат совпадения первого списка тегов в настройке "Создать папку по первому совпавшему тегу". Если вы включили эту настройку и найдено совпадение с заданным тегом, токен выведет этот тег; в противном случае он будет проигнорирован.`,
  ],
  _命名标记_match_tag_folder2: [
    `它是"使用第一个匹配的标签建立文件夹"里第二个标签列表的匹配结果。如果你启用了这个设置，并且匹配到了你设置的标签，它就会输出这个标签；否则会被忽略。`,
    `它是「使用第一個匹配的標籤建立資料夾」裡第二個標籤列表的匹配結果。如果你啟用了這個設定，並且匹配到了你設定的標籤，它就會輸出這個標籤；否則會被忽略。`,
    `This is the match result of the second tag list in "Create folder using the first matching tag". If you have enabled this setting and a matching tag is found, it will output that tag; otherwise it will be ignored.`,
    `これは「最初にマッチしたタグを使ってフォルダーを作成する」の2番目のタグリストのマッチ結果です。この設定を有効にしていて、設定したタグがマッチした場合はそのタグを出力します。マッチしなかった場合は無視されます。`,
    `이것은 "처음 매칭된 태그로 폴더 만들기"에서 두 번째 태그 목록의 매칭 결과입니다. 이 설정을 활성화하고 설정한 태그가 매칭되면 해당 태그를 출력합니다. 그렇지 않으면 무시됩니다.`,
    `Это результат совпадения второго списка тегов в настройке "Создать папку по первому совпавшему тегу". Если вы включили эту настройку и найдено совпадение с заданным тегом, токен выведет этот тег; в противном случае он будет проигнорирован.`,
  ],
  _命名标记tags_trans: [
    `作品的标签列表，没有附带翻译后的标签`,
    `作品的標籤列表，沒有附帶翻譯後的標籤`,
    `The tag list of the work, without translated tags`,
    `翻訳タグなしの作品のタグリスト`,
    `번역 태그 없이 작품의 태그 목록만 포함`,
    `Список тегов work без переведённых тегов`,
  ],
  _命名标记tags_transl_only: [
    '翻译后的标签列表',
    '譯後的標籤清單。',
    'Translated tags',
    '翻訳后のタグリスト',
    '번역된 태그',
    'Теги перевода',
  ],
  _命名标记date: [
    '作品的创建时间。如 <span class="blue">2019-08-29</span>。',
    '作品的建立時間。例如：<span class="blue">2019-08-29</span>。',
    'The time the creation of the work. Such as <span class="blue">2019-08-29</span>',
    '作品の作成時間。例 <span class="blue">2019-08-29</span>',
    '작품 생성 날짜. 예: <span class="blue">2019-08-29</span>',
    'Время создания произведения. Например, <span class="blue">2019-08-29</span>',
  ],
  _命名标记upload_date: [
    '作品内容最后一次被修改的时间。如 <span class="blue">2019-08-30</span>。',
    '作品內容最後一次被修改的時間。如 <span class="blue">2019-08-30</span>。',
    'The time when the content of the work was last modified. Such as <span class="blue">2019-08-30</span>.',
    '作品の内容が最後に変更された時刻。例 <span class="blue">2019-08-30</span>',
    '저작물의 내용이 마지막으로 수정된 시간입니다. 예: <span class="blue">2019-08-30</span>',
    'Время, когда содержание работы было изменено в последний раз. Например, <span class="blue">2019-08-30</span>.',
  ],
  _命名标记rank: [
    `作品在排行榜中的排名。如 <span class="blue">#1</span>、<span class="blue">#2</span> …… 只能在排行榜页面中使用，在其他页面里会被忽略。`,
    `作品在排行榜中的排名。如 <span class="blue">#1</span>、<span class="blue">#2</span> …… 只能在排行榜頁面中使用，在其他頁面裡會被忽略。`,
    `The ranking of the work in the leaderboard. Such as <span class="blue">#1</span>, <span class="blue">#2</span> ... Can only be used on the leaderboard page, and will be ignored on other pages.`,
    `作品のランキングボードでの順位。例：<span class="blue">#1</span>、<span class="blue">#2</span> …… ランキングボードページでのみ使用可能で、他のページでは無視されます。`,
    `작품의 랭킹 보드 순위. 예: <span class="blue">#1</span>、<span class="blue">#2</span> …… 랭킹 보드 페이지에서만 사용할 수 있으며, 다른 페이지에서는 무시됩니다。`,
    `Рейтинг работы в лидерборде. Например <span class="blue">#1</span>, <span class="blue">#2</span> ... Можно использовать только на странице лидерборда, на других страницах будет игнорироваться。`,
  ],
  _命名标记type: [
    `输出作品类型。插画输出 <span class="blue">Illustration</span>, 漫画输出 <span class="blue">Manga</span>, 动图输出 <span class="blue">Ugoira</span>, 小说输出 <span class="blue">Novel</span>。`,
    `輸出作品類型。插畫輸出 <span class="blue">Illustration</span>, 漫畫輸出 <span class="blue">Manga</span>, 動圖輸出 <span class="blue">Ugoira</span>, 小說輸出 <span class="blue">Novel</span>。`,
    `Output the work type. Illustration outputs <span class="blue">Illustration</span>, manga outputs <span class="blue">Manga</span>, Ugoira outputs <span class="blue">Ugoira</span>, novel outputs <span class="blue">Novel</span>.`,
    `作品タイプを出力します。イラストの場合は <span class="blue">Illustration</span>、漫画の場合は <span class="blue">Manga</span>、動画像の場合は <span class="blue">Ugoira</span>、小説の場合は <span class="blue">Novel</span> を出力します。`,
    `작품 유형을 출력합니다. 일러스트는 <span class="blue">Illustration</span>, 만화는 <span class="blue">Manga</span>, 동화는 <span class="blue">Ugoira</span>, 소설은 <span class="blue">Novel</span>을 출력합니다.`,
    `Выводить тип работы. Для иллюстрации выводится <span class="blue">Illustration</span>, для манги — <span class="blue">Manga</span>, для Ugoira — <span class="blue">Ugoira</span>, для новеллы — <span class="blue">Novel</span>.`,
  ],
  _命名标记type_illust: [
    `仅当作品是插画时，输出 <span class="blue">Illustration</span>。`,
    `僅當作品是插畫時，輸出 <span class="blue">Illustration</span>。`,
    `Output <span class="blue">Illustration</span> only when the work is an illustration.`,
    `作品がイラストの場合のみ、<span class="blue">Illustration</span>を出力します。`,
    `작품이 일러스트일 때만 <span class="blue">Illustration</span>을 출력합니다.`,
    `Выводить <span class="blue">Illustration</span> только когда работа является иллюстрацией.`,
  ],
  _命名标记type_manga: [
    `仅当作品是漫画时，输出 <span class="blue">Manga</span>。`,
    `僅當作品是漫畫時，輸出 <span class="blue">Manga</span>。`,
    `Output <span class="blue">Manga</span> only when the work is a manga.`,
    `作品が漫画の場合のみ、<span class="blue">Manga</span>を出力します。`,
    `작품이 만화일 때만 <span class="blue">Manga</span>을 출력합니다.`,
    `Выводить <span class="blue">Manga</span> только когда работа является мангой.`,
  ],
  _命名标记type_ugoira: [
    `仅当作品是动图时，输出 <span class="blue">Ugoira</span>。`,
    `僅當作品是動圖時，輸出 <span class="blue">Ugoira</span>。`,
    `Output <span class="blue">Ugoira</span> only when the work is a Ugoira.`,
    `作品が動画像の場合のみ、<span class="blue">Ugoira</span>を出力します。`,
    `작품이 동화(Ugoira)일 때만 <span class="blue">Ugoira</span>을 출력합니다.`,
    `Выводить <span class="blue">Ugoira</span> только когда работа является Ugoira.`,
  ],
  _命名标记type_novel: [
    `仅当作品是小说时，输出 <span class="blue">Novel</span>。`,
    `僅當作品是小說時，輸出 <span class="blue">Novel</span>。`,
    `Output <span class="blue">Novel</span> only when the work is a novel.`,
    `作品が小説の場合のみ、<span class="blue">Novel</span>を出力します。`,
    `작품이 소설일 때만 <span class="blue">Novel</span>을 출력합니다.`,
    `Выводить <span class="blue">Novel</span> только когда работа является новеллой.`,
  ],
  _命名标记AI: [
    `如果作品是由 AI 生成的，则输出 <span class="blue">AI</span>，否则忽略它。`,
    `如果作品是由 AI 生成的，則輸出 <span class="blue">AI</span>，否則忽略它。`,
    `If the work is AI-generated, output <span class="blue">AI</span>; otherwise, ignore it.`,
    `作品がAI生成の場合、<span class="blue">AI</span>を出力します。それ以外の場合はそれを無視します。`,
    `작품이 AI 생성이라면 <span class="blue">AI</span>를 출력하며, 그렇지 않으면 이를 무시합니다。`,
    `Если работа сгенерирована ИИ, выведите <span class="blue">AI</span>; в противном случае игнорируйте её。`,
  ],
  _命名规则一定要包含id: [
    '为了防止文件名重复，命名规则里一定要包含 {id} 或者 {pid}{p}',
    '為了防止檔名重複，命名規則裡一定要包含 {id} 或者 {pid}{p}。',
    'To prevent duplicate file names, {id} or {pid}{p} must be included in the naming rules.',
    'ファイル名の重複を防ぐために、命名規則には {id} または {pid}{p} を含める必要があります。',
    '파일명이 중복되지 않도록, 명명 규칙에는 {id} 또는 {pid}{p}이 포함되어야 합니다.',
    'Чтобы предотвратить дублирование имен файлов, {id} или {pid}{p} должны быть включены в правила именования.',
  ],
  _文件夹标记page_tag: [
    `如果页面里的作品属于同一个标签，下载器会输出这个标签，否则忽略它。通常当你处于这些页面里时有值：搜索某个标签、在用户主页里查看某个标签分类下的作品、在自己的收藏里查看某个标签分类下的作品。`,
    `如果頁面裡的作品屬於同一個標籤，下載器會輸出這個標籤，否則忽略它。通常當你處於這些頁面裡時有值：搜尋某個標籤、在用戶主頁裡查看某個標籤分類下的作品、在自己的收藏裡查看某個標籤分類下的作品。`,
    `If the works on the page belong to the same tag, the downloader will output this tag; otherwise, ignore it. It usually has a value when you are on these pages: searching for a certain tag, viewing works under a certain tag category on the user page, viewing works under a certain tag category in your own bookmarks.`,
    `ページ内の作品が同じタグに属する場合、ダウンロードツールはこのタグを出力します。それ以外の場合はそれを無視します。通常、これらのページにいる場合に値があります：特定のタグを検索する場合、ユーザーページで特定のタグカテゴリの下の作品を表示する場合、自分のブックマークで特定のタグカテゴリの下の作品を表示する場合。`,
    `페이지의 작품이 동일한 태그에 속하면 다운로더가 이 태그를 출력합니다. 그렇지 않으면 이를 무시합니다. 일반적으로 이러한 페이지에 있을 때 값이 있습니다: 특정 태그 검색 시, 사용자 페이지에서 특정 태그 카테고리 아래 작품 보기, 자신의 북마크에서 특정 태그 카테고리 아래 작품 보기。`,
    `Если работы на странице принадлежат одному и тому же тегу, загрузчик выведет этот тег; в противном случае игнорируйте его. Обычно имеет значение, когда вы находитесь на этих страницах: при поиске определенного тега, просмотре работ под определенной категорией тега на странице пользователя, просмотре работ под определенной категорией тега в своих закладках。`,
  ],
  _命名标记seriesTitle: [
    '系列标题。当作品属于一个系列时可用。',
    '系列標題。當作品屬於一個系列時可用。',
    'Series title. Available when the work belongs to a series.',
    'シリーズタイトル。作品がシリーズに属している場合に利用できる。',
    '시리즈 제목. 작품이 시리즈에 속할 때 사용할 수 있습니다.',
    'Название серии. Доступно, если работа принадлежит к серии.',
  ],
  _命名标记seriesOrder: [
    '作品在系列中的序号，如 <span class="blue">#1</span> <span class="blue">#2</span>。 当作品属于一个系列时可用。',
    '作品在系列中的編號，如 <span class="blue">#1</span> <span class="blue">#2</span>。當作品屬於一個系列時可用。',
    'The number of the work in the series, such as <span class="blue">#1</span> <span class="blue">#2</span>. Available when the work belongs to a series.',
    'シリーズの中の作品の番号，例え <span class="blue">#1</span> <span class="blue">#2</span>。作品がシリーズに属している場合に利用できる。',
    '시리즈 내 작품 번호. 예: <span class="blue">#1</span> <span class="blue">#2</span>. 작품이 시리즈에 속할 때 사용할 수 있습니다.',
    'Номер работы в серии, например, <span class="blue">#1</span> <span class="blue">#2</span>. Доступно, если работа принадлежит к серии.',
  ],
  _命名标记seriesId: [
    `系列 ID，是数字。当作品属于一个系列时可用。`,
    `系列 ID，是數字。當作品屬於一個系列時可用。`,
    `Series ID, it is a number. Available when the work belongs to a series.`,
    `シリーズ ID、数値です。作品がシリーズに属している場合に利用できる。`,
    `시리즈 ID, 숫자입니다。작품이 시리즈에 속할 때 사용할 수 있습니다.`,
    `ID серии, это число. Доступно, если работа принадлежит к серии.`,
  ],
  _命名标记page_title: [
    '开始抓取时的页面标题',
    '開始抓取時的頁面標題',
    'Page title when starting the scrape',
    'スクレイピング開始時のページタイトル',
    '페이지 스크래핑 시작 시의 페이지 제목',
    'Заголовок страницы при начале сбора данных',
  ],
  _预览文件名: [
    '预览文件名',
    '預覽檔案名稱',
    'Preview file name',
    'ファイル名',
    '파일명 미리보기',
    'Имя файла предварительного просмотра',
  ],
  _下载线程: [
    '同时下载<span class="key">数量</span>',
    '同時下載<span class="key">數量</span>',
    'Download <span class="key">thread</span>',
    '<span class="key">同時</span>ダウンロード数',
    '다운로드 <span class="key">쓰레드</span>',
    'Количество <span class="key">потоков</span> на загрузку',
  ],
  _下载线程的说明: [
    `你可以输入 1-${Config.downloadThreadMax} 之间的数字，设置同时下载的数量`,
    `你可以輸入 1-${Config.downloadThreadMax} 之間的數字，設定同時下載的數量。`,
    `You can type a number between 1-${Config.downloadThreadMax} to set the number of concurrent downloads`,
    `同時ダウンロード数を設定、1-${Config.downloadThreadMax} の数値を入力してください`,
    `1-${Config.downloadThreadMax} 사이의 숫자를 입력하여 동시 다운로드 수를 설정할 수 있습니다.`,
    `Вы можете ввести число между 1-${Config.downloadThreadMax} , чтобы установить количество одновременных загрузок`,
  ],
  _开始下载: [
    '开始下载',
    '開始下載',
    'Start download',
    '開始',
    '다운로드 시작',
    'Начать загрузку',
  ],
  _暂停下载: [
    '暂停下载',
    '暫停下載',
    'Pause download',
    '一時停止',
    '다운로드 일시중지',
    'Приостановить загрузку',
  ],
  _停止下载: [
    '停止下载',
    '停止下載',
    'Stop download',
    '停止',
    '다운로드 정지',
    'Остановить загрузку',
  ],
  _复制url: [
    '复制 URL',
    '複製下載網址',
    'Copy URLs',
    'URL をコピー',
    'URL 복사',
    'Копировать URL',
  ],
  _当前状态: [
    '当前状态 ',
    '目前狀態：',
    'State ',
    '現在の状態 ',
    '현재 상태',
    'Текущее состояние',
  ],
  _未开始下载: [
    '未开始下载',
    '未開始下載',
    'Not yet started downloading',
    'まだダウンロードを開始していません',
    '아직 다운로드를 시작하지 않았습니다.',
    'Загрузка еще не началась',
  ],
  _下载进度: [
    '下载进度',
    '下載進度',
    'Total progress',
    '概要',
    '다운로드 진행률',
    'Полный прогресс',
  ],
  _任务进度: [
    '任务进度',
    '任務進度',
    'Task progress',
    'タスクの進行状況',
    '작업 진행',
    'прогресс',
  ],
  _常见问题: [
    '常见问题',
    '常見問題',
    'FAQ',
    'よくある質問',
    '도움말',
    'помощь',
  ],
  _获取帮助: [
    `获取帮助`,
    `獲取幫助`,
    `Get Help`,
    `ヘルプを表示`,
    `도움 받기`,
    `Получить помощь`,
  ],
  _获取帮助的提示: [
    `你可以通过以下方式来交流、求助和反馈问题：<br>
- <a href="https://discord.gg/eW9JtTK" target="_blank">Discord</a><br>
- <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/issues" target="_blank">Github issues</a><br>
- 中文用户可以加下载器的 QQ 群：674991373<br>
<br>
提示：请不要在 Chrome Web Store 的评价里反馈问题，因为有些评价会被 Google 过滤掉，所以我可能无法回复你。`,
    `你可以通过以下方式來交流、求助和反饋問題：<br>
- <a href="https://discord.gg/eW9JtTK" target="_blank">Discord</a><br>
- <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/issues" target="_blank">Github issues</a><br>
<br>
提示：請不要在 Chrome Web Store 的評價裡反饋問題，因為有些評價會被 Google 過濾掉，所以我可能無法回覆你。`,
    `You can communicate, ask for help, and report issues through the following ways:<br>
- <a href="https://discord.gg/eW9JtTK" target="_blank">Discord</a><br>
- <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/issues" target="_blank">Github issues</a><br>
<br>
Tip: Please do not report issues in the Chrome Web Store reviews, as some reviews may be filtered by Google, so I may not be able to reply to you.`,
    `以下の方法で交流、質問、問題の報告ができます：<br>
- <a href="https://discord.gg/eW9JtTK" target="_blank">Discord</a><br>
- <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/issues" target="_blank">Github issues</a><br>
<br>
ヒント：Chrome Web Store のレビューで問題を報告しないでください。一部のレビューは Google によってフィルタリングされるため、返信できない場合があります。`,
    `다음 방법으로 소통, 도움 요청, 문제 피드백을 할 수 있습니다:<br>
- <a href="https://discord.gg/eW9JtTK" target="_blank">Discord</a><br>
- <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/issues" target="_blank">Github issues</a><br>
<br>
팁: Chrome Web Store 리뷰에 문제를 보고하지 마세요. 일부 리뷰는 Google에 의해 필터링될 수 있어 답변을 드리지 못할 수 있습니다.`,
    `Вы можете общаться, обращаться за помощью и сообщать о проблемах следующими способами:<br>
- <a href="https://discord.gg/eW9JtTK" target="_blank">Discord</a><br>
- <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/issues" target="_blank">Github issues</a><br>
<br>
Подсказка: Пожалуйста, не сообщайте о проблемах в отзывах Chrome Web Store, поскольку некоторые отзывы могут быть отфильтрованы Google, и я могу не смочь вам ответить.`,
  ],
  _uuid: [
    `⚠️下载器检测到下载后的文件名可能异常。如果文件名是一串随机的字母和数字，或者没有使用下载器设置里的命名规则，就表示发生了此问题。<br>
这不是下载器自身的问题，而是被其他扩展程序影响了，导致下载器设置的文件名丢失。<br>
当你遇到这个问题时，可以考虑下面的处理方法：<br>
1. 推荐：你可以新建一个浏览器本地用户来使用这个下载器。对于 Chrome 和 Edge 浏览器，你可以点击浏览器右上角的头像图标，然后创建新的个人资料（不需要登录 Google 或 Microsoft 账号）。每个用户都有独立的浏览器窗口，所以你可以为新用户安装这个下载器，并且不要安装其他扩展程序。当你需要下载 Pixiv 或 Fanbox 的文件时，使用这个用户进行下载，就可以避免受到其他扩展程序的影响。
<br>
2. 你可以找出导致此问题的扩展程序，并在使用本下载器时，临时禁用它们。这些扩展程序通常具有下载文件、管理下载的功能，例如：IDM Integration Module、Chrono 下载管理器、mage Downloade 等。如果你不确定是哪个扩展导致的，可以先禁用所有扩展，然后一个一个启用，并使用下载器进行下载，这样就可以找出是哪个扩展导致了此问题。<br>
<br>
技术细节：<br>
某些扩展程序会监听 chrome.downloads.onDeterminingFilename 事件，这很容易导致预设的文件名丢失。<br>
假设本下载器为某个文件设置了自定义文件名：user/image.jpg。<br>
如果另一个扩展程序监听了 onDeterminingFilename 事件，浏览器会询问它对文件名的建议（使它有机会修改文件名）。问题在于：此时浏览器传递的文件名是默认的（也就是 URL 里的最后一段路径），而不是下载器设置的文件名。<br>
所以下载器设置的文件名会丢失，并且文件名会变成 URL 里的最后一段路径。<br>`,
    `⚠️下載器檢測到下載後的檔名可能異常。如果檔名是一串隨機的字母和數字，或者沒有使用下載器設定裡的命名規則，就表示發生了此問題。<br>
這不是下載器自身的問題，而是被其他擴充套件程式影響了，導致下載器設定的檔名丟失。<br>
當你遇到這個問題時，可以考慮下面的處理方法：<br>
1. 推薦：你可以新建一個瀏覽器本地使用者來使用這個下載器。對於 Chrome 和 Edge 瀏覽器，你可以點選瀏覽器右上角的頭像圖示，然後建立新的個人資料（不需要登入 Google 或 Microsoft 賬號）。每個使用者都有獨立的瀏覽器視窗，所以你可以為新使用者安裝這個下載器，並且不要安裝其他擴充套件程式。當你需要下載 Pixiv 或 Fanbox 的檔案時，使用這個使用者進行下載，就可以避免受到其他擴充套件程式的影響。
<br>
2. 你可以找出導致此問題的擴充套件程式，並在使用本下載器時，臨時禁用它們。這些擴充套件程式通常具有下載檔案、管理下載的功能，例如：IDM Integration Module、Chrono 下載管理器、mage Downloade 等。如果你不確定是哪個擴充套件導致的，可以先禁用所有擴充套件，然後一個一個啟用，並使用下載器進行下載，這樣就可以找出是哪個擴充套件導致了此問題。<br>
<br>
技術細節：<br>
某些擴充套件程式會監聽 chrome.downloads.onDeterminingFilename 事件，這很容易導致預設的檔名丟失。<br>
假設本下載器為某個檔案設定了自定義檔名：user/image.jpg。<br>
如果另一個擴充套件程式監聽了 onDeterminingFilename 事件，瀏覽器會詢問它對檔名的建議（使它有機會修改檔名）。問題在於：此時瀏覽器傳遞的檔名是預設的（也就是 URL 裡的最後一段路徑），而不是下載器設定的檔名。<br>
所以下載器設定的檔名會丟失，並且檔名會變成 URL 裡的最後一段路徑。<br>`,
    `⚠️The downloader detects that the file name after downloading may be abnormal. If the file name is a string of random letters and numbers, or does not use the naming rules in the downloader settings, it means that this problem has occurred. <br>
This is not a problem with the downloader itself, but it is affected by other extensions, causing the file name set by the downloader to be lost. <br>
When you encounter this problem, you can consider the following solutions: <br>
1. Recommended: You can create a new browser local user to use this downloader. For Chrome and Edge browsers, you can click the avatar icon in the upper right corner of the browser and create a new profile (no need to log in to a Google or Microsoft account). Each user has a separate browser window, so you can install this downloader for the new user and do not install other extensions. When you need to download files from Pixiv or Fanbox, use this user to download to avoid being affected by other extensions. <br>
2. You can find out the extensions that cause this problem and temporarily disable them when using this downloader. These extensions usually have the functions of downloading files and managing downloads, such as: IDM Integration Module, Chrono Download Manager, mage Downloade, etc. If you are not sure which extension is causing the problem, you can find out which extension is causing the problem by disabling all extensions, then enabling them one by one and downloading them using the Downloader. <br>
<br>
Technical details: <br>
Some extensions listen to the chrome.downloads.onDeterminingFilename event, which can easily cause the preset file name to be lost. <br>
Suppose this Downloader sets a custom file name for a file: user/image.jpg. <br>
If another extension listens to the onDeterminingFilename event, the browser will ask it for suggestions for the file name (giving it a chance to modify the file name). The problem is: the file name passed by the browser is the default (the last path in the URL), not the file name set by the Downloader. <br>
So the file name set by the Downloader is lost, and the file name becomes the last path in the URL. <br>`,
    `⚠️ダウンローダーは、ダウンロード後のファイル名が異常である可能性があることを検出しました。ファイル名がランダムな文字と数字の文字列である場合、またはダウンローダー設定の命名規則を使用していない場合は、この問題が発生していることを意味します。<br>
これはダウンローダー自体の問題ではなく、他の拡張機能の影響を受け、ダウンローダーによって設定されたファイル名が失われています。<br>
この問題が発生した場合は、以下の解決策を検討してください。<br>
1. 推奨：このダウンローダーを使用するために、新しいブラウザローカルユーザーを作成できます。ChromeおよびEdgeブラウザの場合、ブラウザの右上隅にあるアバターアイコンをクリックして、新しいプロファイルを作成できます（GoogleまたはMicrosoftアカウントにログインする必要はありません）。ユーザーごとにブラウザウィンドウが異なりますので、新しいユーザー用にこのダウンローダーをインストールし、他の拡張機能はインストールしないでください。PixivやFanboxからファイルをダウンロードする必要がある場合は、他の拡張機能の影響を受けないように、このユーザーを使用してダウンロードしてください。 <br>
2. この問題の原因となっている拡張機能を特定し、このダウンローダーを使用する際に一時的に無効にすることができます。これらの拡張機能は通常、ファイルのダウンロードとダウンロード管理の機能を備えています。例としては、IDM Integration Module、Chrono Download Manager、mage Downloade などがあります。どの拡張機能が問題の原因となっているのかわからない場合は、すべての拡張機能を無効にしてから、1つずつ有効にしてダウンローダーを使用してダウンロードすることで、どの拡張機能が問題の原因となっているのかを特定できます。<br>
<br>
技術的な詳細: <br>
一部の拡張機能は chrome.downloads.onDeterminingFilename イベントをリッスンしており、これによりプリセットされたファイル名が失われる場合があります。<br>
このダウンローダーがファイルにカスタムファイル名（user/image.jpg）を設定するとします。<br>
別の拡張機能が onDeterminingFilename イベントをリッスンしている場合、ブラウザはその拡張機能にファイル名の候補を尋ねます（これにより、拡張機能はファイル名を変更する機会を得ます）。問題は、ブラウザから渡されるファイル名がデフォルト（URL の最後のパス）であり、ダウンローダーによって設定されたファイル名ではないことです。<br>
そのため、ダウンローダーによって設定されたファイル名は失われ、ファイル名が URL の最後のパスになります。<br>`,
    `⚠️다운로더가 다운로드 후 파일 이름이 비정상적일 수 있음을 감지했습니다. 파일 이름이 임의의 문자와 숫자로 구성되어 있거나 다운로더 설정의 명명 규칙을 사용하지 않는 경우 이 문제가 발생했음을 의미합니다. <br>
이 문제는 다운로더 자체의 문제가 아니라 다른 확장 프로그램의 영향을 받아 다운로더에서 설정한 파일 이름이 손실되는 것입니다. <br>
이 문제가 발생하면 다음 해결 방법을 고려해 보세요. <br>
1. 권장 사항: 이 다운로더를 사용할 새 브라우저 로컬 사용자를 만들 수 있습니다. Chrome 및 Edge 브라우저의 경우 브라우저 오른쪽 상단의 아바타 아이콘을 클릭하고 새 프로필을 만들 수 있습니다(Google 또는 Microsoft 계정에 로그인할 필요 없음). 각 사용자는 별도의 브라우저 창을 사용하므로 새 사용자를 위해 이 다운로더를 설치하고 다른 확장 프로그램을 설치하지 않아도 됩니다. Pixiv 또는 Fanbox에서 파일을 다운로드해야 하는 경우 다른 확장 프로그램의 영향을 받지 않도록 이 사용자를 사용하여 다운로드하세요. <br>
2. 이 문제를 일으키는 확장 프로그램을 찾아 이 다운로더를 사용할 때 일시적으로 비활성화할 수 있습니다. 이러한 확장 프로그램은 일반적으로 IDM 통합 모듈, Chrono Download Manager, mage Downloade 등과 같이 파일 다운로드 및 다운로드 관리 기능을 제공합니다. 어떤 확장 프로그램이 문제를 일으키는지 확실하지 않은 경우, 모든 확장 프로그램을 비활성화한 후 하나씩 활성화하고 다운로더를 사용하여 다운로드하면 어떤 확장 프로그램이 문제를 일으키는지 확인할 수 있습니다. <br>
<br>
기술 세부 정보: <br>
일부 확장 프로그램은 chrome.downloads.onDeterminingFilename 이벤트를 수신하는데, 이로 인해 미리 설정된 파일 이름이 쉽게 손실될 수 있습니다. <br>
이 다운로더가 파일에 사용자 지정 파일 이름(user/image.jpg)을 설정한다고 가정해 보겠습니다. <br>
다른 확장 프로그램이 onDeterminingFilename 이벤트를 수신하는 경우, 브라우저는 해당 확장 프로그램에 파일 이름을 제안하도록 요청하여 파일 이름을 수정할 수 있는 기회를 제공합니다. 문제는 브라우저에서 전달된 파일 이름이 다운로더에서 설정한 파일 이름이 아니라 기본값(URL의 마지막 경로)이라는 것입니다. <br>
따라서 다운로더에서 설정한 파일 이름은 사라지고, 파일 이름이 URL의 마지막 경로가 됩니다. <br>`,
    `⚠️Загрузчик обнаруживает, что имя файла после загрузки может быть ненормальным. Если имя файла представляет собой строку случайных букв и цифр или не использует правила именования в настройках загрузчика, это означает, что возникла эта проблема. <br>
Это не проблема самого загрузчика, но на нее влияют другие расширения, что приводит к потере имени файла, установленного загрузчиком. <br>
Если вы столкнулись с этой проблемой, вы можете рассмотреть следующие решения: <br>
1. Рекомендуется: вы можете создать нового локального пользователя браузера для использования этого загрузчика. Для браузеров Chrome и Edge вы можете нажать на значок аватара в правом верхнем углу браузера и создать новый профиль (не нужно входить в учетную запись Google или Microsoft). У каждого пользователя есть отдельное окно браузера, поэтому вы можете установить этот загрузчик для нового пользователя и не устанавливать другие расширения. Если вам нужно скачать файлы с Pixiv или Fanbox, используйте этого пользователя для загрузки, чтобы избежать влияния других расширений. <br>
2. Вы можете узнать, какие расширения вызывают эту проблему, и временно отключить их при использовании этого загрузчика. Эти расширения обычно выполняют функции загрузки файлов и управления загрузками, например: IDM Integration Module, Chrono Download Manager, mage Downloade и т. д. Если вы не уверены, какое именно расширение вызывает проблему, вы можете выяснить это, отключив все расширения, а затем включив их по одному и загрузив их с помощью загрузчика. <br>
<br>
Технические подробности: <br>
Некоторые расширения обрабатывают событие chrome.downloads.onDeterminingFilename, что может легко привести к потере предустановленного имени файла. <br>
Предположим, этот загрузчик задаёт пользовательское имя для файла: user/image.jpg. <br>
Если другое расширение обрабатывают событие onDeterminingFilename, браузер запросит у него варианты имени файла (что даёт ему возможность изменить имя файла). Проблема в том, что браузер передал имя файла по умолчанию (последний путь в URL), а не имя файла, заданное загрузчиком. <br>
Поэтому имя файла, заданное загрузчиком, теряется, и имя файла становится последним путем в URL. <br>`,
  ],
  _账户可能被封禁的警告: [
    `<strong>警告</strong>：频繁和大量的抓取（和下载）可能会导致你的 Pixiv 账号被封禁。
    <br>
    多数用户不会遇到这个情况，而且下载器默认会减慢抓取的速度。但如果你的账户被封禁，下载器不会承担任何责任。
    <br>
    如果你计划进行大量的下载，可以考虑注册 Pixiv 小号。<br>
    Wiki 有相关说明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8F%B7%E4%B8%8B%E8%BD%BD" target="_blank">使用小号下载</a>
    <br>`,

    `<strong>警告</strong>：頻繁且大量的抓取（和下載）可能會導致你的 Pixiv 帳號被封禁。
    <br>
    多數用戶不會遇到這種情況，而且下載器默認會減慢抓取的速度。但如果你的帳戶被封禁，下載器不會承擔任何責任。
    <br>
    如果你計劃進行大量的下載，可以考慮註冊 Pixiv 小號。<br>
    Wiki 有相關說明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8F%B7%E4%B8%8B%E8%BD%BD" target="_blank">使用小號下載</a>
    <br>`,

    `<strong>Warning</strong>: Frequent and large-scale crawling (and downloading) may lead to your Pixiv account being banned.
    <br>
    Most users will not encounter this issue, and the downloader will slow down the crawling speed by default. However, if your account is banned, the downloader will not take any responsibility.
    <br>
    If you plan to perform large-scale downloads, consider registering a secondary Pixiv account.<br>
    The Wiki provides related information: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">Using a Secondary Account for Downloading</a>
    <br>`,

    `<strong>警告</strong>：頻繁かつ大規模なクロール（およびダウンロード）は、Pixivアカウントの禁止につながる可能性があります。
    <br>
    ほとんどのユーザーはこの問題に遭遇しませんが、ダウンローダーはデフォルトでクロールの速度を遅くします。ただし、アカウントが禁止された場合、ダウンローダーは一切の責任を負いません。
    <br>
    大規模なダウンロードを計画している場合は、Pixivのサブアカウントを登録することを検討してください。<br>
    Wikiに関連情報があります：<a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">サブアカウントを使用したダウンロード</a>
    <br>`,

    `<strong>경고</strong>: 빈번하고 대규모의 크롤링(및 다운로드)은 Pixiv 계정이 차단될 수 있습니다.
    <br>
    대부분의 사용자는 이 문제를 겪지 않으며, 다운로더는 기본적으로 크롤링 속도를 늦춥니다. 하지만 계정이 차단되더라도 다운로더는 어떠한 책임도 지지 않습니다.
    <br>
    대규모 다운로드를 계획하고 있다면 Pixiv 보조 계정을 등록하는 것을 고려하세요.<br>
    위키에 관련 정보가 있습니다: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">보조 계정으로 다운로드하기</a>
    <br>`,

    `<strong>Предупреждение</strong>: Частый и масштабный краулинг (и загрузка) могут привести к блокировке вашего аккаунта Pixiv.
    <br>
    Большинство пользователей не сталкиваются с этой проблемой, и загрузчик по умолчанию снижает скорость краулинга. Однако, если ваш аккаунт будет заблокирован, загрузчик не несет за это ответственности.
    <br>
    Если вы планируете выполнять масштабные загрузки, рассмотрите возможность регистрации дополнительного аккаунта Pixiv.<br>
    В Вики есть соответствующая информация: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">Использование дополнительного аккаунта для загрузки</a>
    <br>`,
  ],
  _常见问题说明: [
    `下载的文件保存在浏览器的下载目录里。如果你想保存到其他位置，需要修改浏览器的下载目录。
    <br><br>
    建议您在浏览器的下载设置中关闭“下载前询问每个文件的保存位置”，否则保存每个文件时都会显示另存为对话框。
    <br><br>
    如果下载后的文件名异常，请禁用其他有下载功能的浏览器扩展程序。<br>还有些扩展程序会导致下载器不能开始下载。
    <br><br>
    如果你的浏览器在启动时会停止响应一段时间，你可以清除浏览器的下载记录来解决此问题。
    <br><br>
    下载器的 Wiki：<a href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">https://xuejianxianzun.github.io/PBDWiki</a>
    <br>
    <a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/常见问题" target="_blank">在 Wiki 查看常见问题</a>
    <br><br>
    梯子推荐：
    <br>
    如果你需要一个机场（梯子）的话，可以试试我现在用的机场：魔法喵 <a href="https://mofacgb.cc/register?code=GYjQWDob" title="魔法喵" target="_blank">https://mofacgb.cc</a>，性价比很高，9.9 元 768 GB 流量（倍率都是 1x），而且下载速度很快（下载速率上限是 800 Mbps）。下载 Pixiv、Fanbox 的文件建议使用“日本 2”节点。
    <br>
    如果上面的网址打不开，可以访问地址发布页：<a href="https://mofmiao.com" title="魔法喵" target="_blank">https://mofmiao.com</a>
    <br>
    你也可以查看我写的使用体验：<a href="https://saber.love/?p=12736" title="魔法喵使用体验" target="_blank">魔法喵使用体验</a>
    <br>
    我的邀请码：GYjQWDob
    <br><br>`,

    `下載的文件保存在瀏覽器的下載目錄裡。如果您想保存到其他位置，需要修改瀏覽器的下載目錄。
    <br><br>
    建議您在瀏覽器的下載設置中關閉“下載前詢問每個文件的保存位置”，否則保存每個文件時都會顯示另存為對話框。
    <br><br>
    如果下載後的文件名異常，請禁用其他具有下載功能的瀏覽器擴展程序。<br>還有一些擴展程序會導致下載器無法開始下載。
    <br><br>
    如果您的瀏覽器在啟動時會停止響應一段時間，您可以清除瀏覽器的下載記錄來解決此問題。
    <br><br>
    下載器的 Wiki：<a href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">https://xuejianxianzun.github.io/PBDWiki</a>
    <br>
    <a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/常见问题" target="_blank">在 Wiki 查看常見問題</a>
    <br><br>`,

    `Downloaded files are saved in the browser's download directory. If you want to save them to another location, you need to change the browser's download directory.
    <br><br>
    It is recommended to disable "Ask where to save each file before downloading" in the browser's download settings, otherwise a save-as dialog will appear for each file.
    <br><br>
    If the filenames of downloaded files are abnormal, please disable other browser extensions with download capabilities. <br>Some extensions may also prevent the downloader from starting downloads.
    <br><br>
    If your browser stops responding for a while when starting, you can resolve this issue by clearing the browser's download history.
    <br><br>
    Downloader Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">https://xuejianxianzun.github.io/PBDWiki</a>
    <br>
    <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/FAQ" target="_blank">View FAQs in the Wiki</a>
    <br><br>`,

    `ダウンロードしたファイルはブラウザのダウンロードディレクトリに保存されます。別の場所に保存したい場合は、ブラウザのダウンロードディレクトリを変更する必要があります。
    <br><br>
    ブラウザのダウンロード設定で「ダウンロード前に各ファイルの保存場所を確認する」をオフにすることをお勧めします。そうしないと、ファイルを保存するたびに「名前を付けて保存」ダイアログが表示されます。
    <br><br>
    ダウンロードしたファイル名に異常がある場合は、ダウンロード機能を持つ他のブラウザ拡張機能を無効にしてください。<br>一部の拡張機能はダウンローダーがダウンロードを開始できない原因となることがあります。
    <br><br>
    ブラウザが起動時にしばらく応答しない場合、ブラウザのダウンロード履歴をクリアすることでこの問題を解決できます。
    <br><br>
    ダウンローダーのWiki：<a href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">https://xuejianxianzun.github.io/PBDWiki</a>
    <br>
    <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/FAQ" target="_blank">Wikiでよくある質問を確認</a>
    <br><br>`,

    `다운로드한 파일은 브라우저의 다운로드 디렉토리에 저장됩니다. 다른 위치에 저장하려면 브라우저의 다운로드 디렉토리를 변경해야 합니다.
    <br><br>
    브라우저의 다운로드 설정에서 "다운로드 전에 각 파일의 저장 위치를 묻기"를 비활성화하는 것이 좋습니다. 그렇지 않으면 파일을 저장할 때마다 "다른 이름으로 저장" 대화 상자가 나타납니다.
    <br><br>
    다운로드한 파일 이름에 이상이 있는 경우, 다운로드 기능이 있는 다른 브라우저 확장 프로그램을 비활성화하십시오. <br>일부 확장 프로그램은 다운로더가 다운로드를 시작하지 못하게 할 수 있습니다.
    <br><br>
    브라우저가 시작 시 일정 시간 동안 응답하지 않는 경우, 브라우저의 다운로드 기록을 지워 이 문제를 해결할 수 있습니다.
    <br><br>
    다운로더 위키: <a href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">https://xuejianxianzun.github.io/PBDWiki</a>
    <br>
    <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/FAQ" target="_blank">위키에서 자주 묻는 질문 보기</a>
    <br><br>`,

    `Загруженные файлы сохраняются в папке загрузок браузера. Если вы хотите сохранить их в другое место, необходимо изменить папку загрузок в настройках браузера.
    <br><br>
    Рекомендуется отключить в настройках загрузки браузера опцию "Запрашивать место сохранения каждого файла перед загрузкой", иначе при сохранении каждого файла будет отображаться диалог "Сохранить как".
    <br><br>
    Если имена загруженных файлов выглядят ненормально, пожалуйста, отключите другие расширения браузера с функциями загрузки. <br>Некоторые расширения могут препятствовать началу загрузки загрузчиком.
    <br><br>
    Если ваш браузер перестает отвечать на некоторое время при запуске, вы можете решить эту проблему, очистив историю загрузок браузера.
    <br><br>
    Вики загрузчика: <a href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">https://xuejianxianzun.github.io/PBDWiki</a>
    <br>
    <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/FAQ" target="_blank">Просмотр часто задаваемых вопросов в Вики</a>
    <br><br>`,
  ],
  _正在下载中: [
    '正在下载中',
    '正在下載',
    'Downloading',
    'ダウンロード中',
    '다운로드 중',
    'Загрузка',
  ],
  _下载完毕: [
    '下载完毕',
    '下載完畢',
    'Download complete',
    'ダウンロードが完了しました',
    '다운로드 완료',
    'Загрузка завершена',
  ],
  _下载已暂停: [
    '下载已暂停',
    '下載已暫停',
    'Download is paused',
    'ダウンロードは一時停止中です',
    '다운로드 일시중지',
    'Загрузка приостановлена',
  ],
  _下载已停止: [
    '下载已停止',
    '下載已停止',
    'Download stopped',
    'ダウンロードが停止しました',
    '다운로드 정지',
    'Загрузка остановлена',
  ],
  _已下载: [
    '已下载',
    '已下載',
    'downloaded',
    'downloaded',
    '다운로드됨',
    'загруженно',
  ],
  _稍后会重试下载失败的文件: [
    `稍后会重试下载失败的文件`,
    `稍後會重試下載失敗的檔案`,
    `Failed files will be retried later`,
    `ダウンロードに失敗したファイルは後で再試行されます`,
    `다운로드에 실패한 파일은 나중에 다시 시도합니다`,
    `Неудачно загруженные файлы будут повторно загружены позже`,
  ],
  _抓取完毕: [
    '抓取完毕！',
    '擷取完畢！',
    'Crawl complete!',
    'クロールが終了しました！',
    '긁어오기 완료!',
    'Вытаскивание завершено!',
  ],
  _抓取完毕2: [
    '抓取完毕',
    '擷取完畢',
    'Crawl complete',
    'クロールが終了しました',
    '긁어오기 완료',
    'Вытаскивание завершено',
  ],
  _快速下载本页: [
    '快速下载本页作品 (Alt + Q)',
    '快速下載本頁作品 (Alt + Q)',
    'Download this work quickly (Alt + Q)',
    'この作品をすばやくダウンロードする (Alt + Q)',
    '작품 빠른 다운로드 (Alt + Q)',
    'Быстро загрузить эту работу (Alt + Q)',
  ],
  _快捷键ALTQ快速下载本页作品: [
    '你可以使用快捷键 <span class="blue">Alt</span> + <span class="blue">Q</span> 快速下载本页作品。',
    '你可以使用快捷鍵 <span class="blue">Alt</span> + <span class="blue">Q</span> 快速下載本頁作品。',
    'You can use the shortcut keys <span class="blue">Alt</span> + <span class="blue">Q</span> to quickly download works on this page.',
    'ショートカット キー <span class="blue">Alt</span> + <span class="blue">Q</span> を使用して、このページの作品をすばやくダウンロードできます。',
    '단축키 <span class="blue">Alt</span> + <span class="blue">Q</span>를 사용하여 이 페이지에서 작품을 빠르게 다운로드할 수 있습니다.',
    'Вы можете использовать сочетания клавиш <span class="blue">Alt</span> + <span class="blue">Q</span> для быстрой загрузки работ на этой странице.',
  ],
  _抓取此作品: [
    '抓取此作品',
    '抓取此作品',
    'Crawl this work',
    'この作品をクロールする',
    '이 작품을 크롤링',
    'Просканировать эту работу',
  ],
  _从本页开始抓取new: [
    '从本页开始抓取新作品',
    '從本頁開始擷取新作品',
    'Crawl the new works from this page',
    'このページから新しい作品を入手する',
    '이 페이지부터 새 작품 긁어오기',
    'Просканировать новые работы с этой страницы',
  ],
  _从本页开始抓取old: [
    '从本页开始抓取旧作品',
    '從本頁開始擷取舊作品',
    'Crawl the old works from this page',
    'このページから古い作品を入手する',
    '이 페이지부터 오래된 작품 긁어오기',
    'Просканировать старые работы с этой страницы',
  ],
  _抓取推荐作品: [
    '抓取推荐作品',
    '擷取推薦作品',
    'Crawl the recommend works',
    '推奨作品をダウンロードする',
    '추천 작품 긁어오기',
    'Просканировать рекомендуемые работы',
  ],
  _抓取推荐作品Title: [
    '抓取页面底部的的推荐作品',
    '擷取頁面底部的推薦作品。',
    'Crawl the recommended works at the bottom of the page',
    'ページの下部で推奨作品をクロールします',
    '페이지 하단 추천 작품 긁어오기',
    'Просканировать рекомендованные работы внизу страницы',
  ],
  _抓取相关作品: [
    '抓取相关作品',
    '擷取相關作品',
    'Crawl the related works',
    '関連作品をダウンロードする',
    '관련 작품 긁어오기',
    'Просканировать похожие работы',
  ],
  _调整完毕: [
    '调整完毕，当前有{}个作品',
    '調整完畢，目前有 {} 個作品',
    'The adjustment is complete and now has {} works',
    '調整が完了し、今、{} の作品があります',
    '조정이 완료되어, 현재 {}개의 작품이 있습니다',
    'Настройка завершена и теперь имеет {} работ',
  ],
  _抓取当前作品: [
    '抓取当前作品',
    '擷取目前作品',
    'Crawl current works',
    '現在の作品をクロールする',
    '현재 작품 긁어오기',
    'Просканировать текущую работу',
  ],
  _抓取当前作品Title: [
    '抓取当前列表里的所有作品',
    '擷取目前清單裡的所有作品',
    'Crawl all the works in the current list',
    '現在のリスト内のすべての作品をクロールする',
    '현재 목록에 있는 모든 작품 긁어오기',
    'Просканировать все работы в текущем списке',
  ],
  _清除多图作品: [
    '清除多图作品',
    '清除多圖作品',
    'Remove multi-image works',
    '複数画像をクリア',
    '여러 이미지 작품 지우기',
    'Удалить работы с несколькими изображениями',
  ],
  _清除动图作品: [
    '清除动图作品',
    '清除動圖作品',
    'Remove ugoira works',
    'うごイラ作品を削除する',
    '움직이는 일러스트 작품 지우기',
    'Убрать Ugoira(gif) работы',
  ],
  _手动删除作品: [
    '手动删除作品',
    '手動刪除作品',
    'Manually delete the work',
    '作品を手動で削除する',
    '수동으로 작품 지우기',
    'Вручную удалить работу',
  ],
  _手动删除作品Title: [
    '可以在下载前手动删除不需要的作品',
    '可以在下載前手動刪除不需要的作品，點擊作品刪除。',
    'You can manually delete unwanted work before downloading',
    'ダウンロードする前に不要な作品を手動で削除することができます',
    '다운로드를 원하지 않는 작품을 수동으로 지울 수 있습니다.',
    'Вы можете вручную удалить нежелательные работы перед загрузкой',
  ],
  _退出手动删除: [
    '退出手动删除',
    '結束手動刪除',
    'Exit manually delete',
    '削除モードを終了する',
    '수동 지우기 종료',
    'Выйти из ручного удаления',
  ],
  _抓取本页作品: [
    '抓取本页作品',
    '擷取本頁作品',
    'Crawl this page works',
    'このページをクロールする',
    '이 페이지의 작품 긁어오기',
    'Просканировать работы с этой страницы',
  ],
  _抓取本页作品Title: [
    '抓取本页列表中的所有作品',
    '擷取本頁清單中的所有作品',
    'Crawl this page works',
    'このページの全ての作品をクロールする',
    '이 페이지의 모든 작품 긁어오기',
    'Просканировать работы с этой страницы',
  ],
  _抓取本排行榜作品: [
    '抓取本排行榜作品',
    '擷取本排行榜作品',
    `Crawl this ranking's works`,
    'このリストの作品をクロールする',
    '이 목록의 작품 긁어오기',
    'Просканировать работы из этого списка',
  ],
  _抓取本排行榜作品Title: [
    '抓取本排行榜的所有作品，包括现在尚未加载出来的。',
    '擷取本排行榜的所有作品，包括現在尚未載入出來的。',
    'Crawl all of the works in this list, including those that are not yet loaded.',
    'まだ読み込まれていないものを含めて、このリストの作品をダウンロードする',
    '아직 불러오지 않은 작품을 포함하여, 이 목록의 모든 작품을 긁어옵니다.',
    'Просмотреть все работы в этом списке, включая те, которые еще не загружены.',
  ],
  _抓取首次登场的作品: [
    '抓取首次登场作品',
    '擷取首次登場作品',
    'Crawl the debut works',
    '初登場作品をダウンロードする',
    '데뷔작 긁어오기',
    'Просканировать по дебютные работы',
  ],
  _抓取首次登场的作品Title: [
    '只下载首次登场的作品',
    '只下載首次登場的作品',
    'Download only debut works',
    '初登場作品のみダウンロードします',
    '데뷔작만 다운로드',
    'Скачать только дебютные работы',
  ],
  _抓取该页面的图片: [
    '抓取该页面的图片',
    '擷取該頁面的圖片',
    'Crawl images on this page',
    'ページの画像をクロールする',
    '페이지의 이미지 긁어오기',
    'Просканировать по изображение страницы',
  ],
  _抓取相似图片: [
    '抓取相似图片',
    '擷取相似圖片',
    'Crawl similar works',
    '類似の作品をクロールする',
    '비슷한 작품 긁어오기',
    'Просканировать похожие работы',
  ],
  _想要获取多少个作品: [
    '您想要获取多少个作品？',
    '想要取得多少個作品？',
    'How many works do you want to download?',
    'いくつの作品をダウンロードしたいですか？',
    '몇 개의 작품을 다운로드하시겠습니까?',
    'Сколько работ вы хотите загрузить?',
  ],
  _负1或者大于0: [
    '-1, 或者大于 0',
    '-1，或是大於 0',
    '-1, or greater than 0',
    '-1、または 0 より大きい',
    '-1, 또는 0보다 크게',
    '-1, или больше 0',
  ],
  _下载大家的新作品: [
    '下载大家的新作品',
    '下載大家的新作品',
    `Download everyone's new work`,
    'みんなの新作をダウンロードする',
    '모두의 새 작품 다운로드',
    'Вседа загружать новые работы',
  ],
  _屏蔽设定: [
    '屏蔽設定',
    '封鎖設定',
    'Mute settings',
    'ミュート設定',
    '차단 설정',
    'Настройки защиты',
  ],
  _举报: ['举报', '回報', 'Report', '報告', '신고', 'Отчет'],
  _输入id进行抓取: [
    '输入 ID 进行抓取',
    '輸入 ID 進行擷取',
    'Type ID to crawl',
    'IDを入力してダウンロードする',
    '유형 ID 긁어오기',
    'Введите ID для вытаскивания',
  ],
  _输入id进行抓取的提示文字: [
    '请输入作品 id。如果有多个 id，则以换行分割（即每行一个id）。',
    '請輸入作品 id。如果有多個 id，則以換行分隔（即每行一個 id）。',
    'Enter work IDs. For multiple IDs, separate them with newlines (one ID per line).',
    'イラストレーターIDを入力してください。 複数の id がある場合は、1 行に 1 つの id を付けます。',
    '일러스트 작품 ID를 입력해주세요. 여러 개의 ID가 있으면 줄을 바꾸어주세요 (한 줄에 한 개의 ID).',
    'Пожалуйста, введите идентификатор иллюстрации. Если идентификаторов несколько, то по одному идентификатору на строку.',
  ],
  _输入的ID视为图像ID: [
    '因为这个标签页展示的是图像，所以输入的 ID 会被视为图像作品的 ID。',
    '因為這個標籤頁展示的是圖片，所以輸入的 ID 會被視為圖片作品的 ID。',
    'Since this tab displays images, the entered IDs will be treated as image work IDs.',
    'このタブは画像を表示するため、入力したIDが画像作品のIDとなります。',
    '이 탭에는 이미지가 표시되므로 입력한 ID가 해당 이미지 작품의 ID로 간주됩니다.',
    'Поскольку на этой вкладке отображаются изображения, введенный идентификатор будет считаться идентификатором работы с изображением.',
  ],
  _输入的ID视为小说ID: [
    '因为这个标签页展示的是小说，所以输入的 ID 会被视为小说作品的 ID。',
    '因為這個標籤頁展示的是小說，所以輸入的 ID 會被視為小說作品的 ID。',
    'Since this tab displays novels, the entered IDs will be treated as novel work IDs.',
    'このタブは小説を表示するため、入力したIDは小説作品のIDとして扱われます。',
    '이 탭에는 소설이 표시되므로 입력한 ID는 소설 작품의 ID로 처리됩니다.',
    'Поскольку на этой вкладке отображаются романы, введенный идентификатор будет рассматриваться как идентификатор романа.',
  ],
  _开始抓取: [
    '开始抓取',
    '開始擷取',
    'Start crawl',
    'クロールを開始する',
    '긁어오기 시작',
    'Начать вытаскивание',
  ],
  _开始抓取等待队列里的作品: [
    `开始抓取等待队列里的作品`,
    `開始抓取等待隊列裡的作品`,
    `Start crawling the works in the waiting queue`,
    `待機キューの作品のクロールを開始`,
    `대기 큐에 있는 작품 크롤링 시작`,
    `Начать краулинг работ из очереди ожидания`,
  ],
  _给未分类作品添加添加tag: [
    '给未分类的作品添加标签',
    '幫未分類的作品加入標籤',
    'Add tag to uncategorized work',
    '未分類の作品にタグを追加',
    '분류되지 않은 작품에 태그 추가',
    'Добавить метку к неклассифицированной работе',
  ],
  _id不合法: [
    'id不合法',
    'id 不合法',
    'id is illegal',
    'id が不正な',
    '올바르지 않은 ID',
    'Это ID неверно',
  ],
  _快速收藏AltB: [
    '快速收藏 (Alt + B)',
    '快速收藏 (Alt + B)',
    'Quick bookmarks (Alt + B)',
    'クイックブックマーク (Alt + B)',
    '빠른 북마크 (Alt + B)',
    'Быстрые закладки (Alt + B)',
  ],
  _取消收藏AltB: [
    `取消收藏(Alt + B)`,
    `取消收藏(Alt + B)`,
    `Cancel bookmark (Alt + B)`,
    `ブックマークをキャンセル(Alt + B)`,
    `북마크 취소(Alt + B)`,
    `Отменить закладку (Alt + B)`,
  ],
  _启用: ['启用', '啟用', 'Enable', '有効にする', '활성화', 'Включить'],
  _自动开始下载: [
    '<span class="key">自动</span>开始下载',
    '<span class="key">自動</span>開始下載',
    'Download starts <span class="key">automatically</span>',
    'ダウンロードは<span class="key">自動的</span>に開始されます',
    '<span class="key">자동으로</span> 다운로드 시작',
    'Загрузка начинается <span class="key">автоматически</span>',
  ],
  _自动开始下载的帮助内容: [
    `抓取完成之后自动开始下载，不需要点击下载按钮。<br>
<br>
注意：即使你关闭了此设置，一些快速下载方式也总是会自动开始下载。例如点击作品缩略图上的下载按钮，或者下载手动选择的作品。`,
    `抓取完成之後自動開始下載，不需要點擊下載按鈕。<br>
<br>
注意：即使你關閉了此設定，一些快速下載方式也總是會自動開始下載。例如點擊作品縮略圖上的下載按鈕，或者下載手動選擇的作品。`,
    `Automatically starts downloading after crawling is complete, without needing to click the download button.<br>
<br>
Note: Even if you disable this setting, some quick download methods will always start downloading automatically — for example, clicking the download button on a work's thumbnail, or downloading manually selected works.`,
    `crawl が完了すると自動的にダウンロードを開始します。ダウンロードボタンをクリックする必要はありません。<br>
<br>
注意：この設定をオフにしても、一部のクイックダウンロード方法は常に自動的にダウンロードを開始します。例えば、作品のサムネイル上のダウンロードボタンをクリックする場合や、手動で選択した作品をダウンロードする場合です。`,
    `crawl이 완료된 후 자동으로 다운로드를 시작합니다. 다운로드 버튼을 클릭할 필요가 없습니다.<br>
<br>
주의: 이 설정을 꺼도 일부 빠른 다운로드 방법은 항상 자동으로 다운로드를 시작합니다. 예를 들어 작품 썸네일의 다운로드 버튼을 클릭하거나, 수동으로 선택한 작품을 다운로드하는 경우입니다.`,
    `После завершения crawl загрузка начинается автоматически — нажимать кнопку загрузки не нужно.<br>
<br>
Обратите внимание: даже если вы отключите эту настройку, некоторые способы быстрой загрузки всегда будут запускаться автоматически. Например, при нажатии кнопки загрузки на миниатюре work или при загрузке work, выбранных вручную.`,
  ],
  _转换任务提示: [
    '正在转换 {} 个文件',
    '正在轉換 {} 個檔案',
    'Converting {} files',
    '{} ファイルの変換',
    '{}개의 파일을 변환하는 중',
    'Преобразование {} файлов',
  ],
  _最近更新: [
    '最近更新',
    '最近更新',
    `What's new`,
    '最近更新する',
    '새로운 기능',
    'Что нового',
  ],
  _确定: ['确定', '確定', 'Ok', '確定', '확인', 'Ок'],
  _file404: [
    '404 错误：文件 {} 不存在。',
    '404 錯誤：檔案 {} 不存在。',
    '404 error: File {} does not exist.',
    '404 エラー：ファイル {} は存在しません。',
    '404 오류: 파일 {}이 존재하지 않습니다.',
    '404 ошибка: Файл {} не существует.',
  ],
  _文件下载失败: [
    '文件 {} 下载失败',
    '檔案 {} 下載失敗',
    'File {} download failed',
    'ファイル {} のダウンロードを失敗しました',
    '파일 {} 다운로드 실패',
    'Загрузка файла {} не удалась',
  ],
  _获取作品数据失败: [
    `获取作品数据失败`,
    `獲取作品數據失敗`,
    `Failed to fetch work data`,
    `作品データの取得に失敗`,
    `작품 데이터 가져오기 실패`,
    `Не удалось получить данные работы`,
  ],
  _是否重置设置: [
    '是否重置设置？',
    '確定要重設設定嗎？',
    'Do you want to reset the settings?',
    '設定をリセットしますか？',
    '설정을 초기화하시겠습니까?',
    'Вы хотите сбросить настройки?',
  ],
  _newver: [
    '有新版本可用',
    '有新版本可更新',
    'A new version is available',
    '新しいバージョンがあります',
    '새 버전이 있습니다',
    'Доступна новая версия',
  ],
  _id范围: [
    '<span class="key">ID</span> 范围',
    '<span class="key">ID</span> 範圍',
    '<span class="key">ID</span> range',
    '<span class="key">ID</span> 範囲',
    '<span class="key">ID</span> 범위',
    '<span class="key">ID</span> диапазон',
  ],
  _设置id范围提示: [
    `您可以输入一个作品 ID，抓取 ID 比它大的作品（新作品）或者比它小的作品（旧作品）`,
    `您可以輸入一個作品 ID，抓取 ID 比它大的作品（新作品）或者比它小的作品（舊作品）`,
    `You can enter a work ID to crawl works with IDs larger than it (new works) or smaller than it (old works)`,
    `作品 ID を入力すると、その ID より大きい作品（新しい作品）または小さい作品（古い作品）をクロールできます`,
    `작품 ID를 입력하면 해당 ID보다 큰 작품(신작) 또는 작은 작품(구작)을 크롤링할 수 있습니다`,
    `Вы можете ввести ID работы, чтобы скраулить работы с ID больше него (новые работы) или меньше него (старые работы)`,
  ],
  _大于: ['大于', '大於', 'Bigger than', 'より大きい', '보다 큼', 'Больше чем'],
  _小于: ['小于', '小於', 'Less than', 'より小さい', '보다 작음', 'Меньше чем'],
  _投稿时间: [
    '投稿<span class="key">时间</span>',
    '投稿<span class="key">時間</span>',
    'Posting <span class="key">time</span>',
    '<span class="key">投稿</span>日時',
    '게시 <span class="key">날짜</span>',
    '<span class="key">Дата</span> публикации',
  ],
  _设置投稿时间提示: [
    '您可以下载指定时间内发布的作品',
    '可以下載指定時間內發布的作品。',
    'You can download works posted in a specified period of time',
    '指定された時間内に配信された作品をダウンロードすることができます',
    '지정된 기간 내에 게시된 작품을 다운로드할 수 있습니다.',
    'Вы можете загружать работы, размещенные за определенный период времени',
  ],
  _时间范围: [
    '时间范围',
    '時間範圍',
    'Time range',
    '時間範囲',
    '시간 범위',
    'Диапазон времени',
  ],
  _必须大于0: [
    '必须大于 0',
    '必須大於 0',
    'must be greater than 0',
    '0 より大きくなければなりません',
    '0보다 커야합니다',
    'должно быть больше 0',
  ],
  _开始筛选: [
    '开始筛选',
    '開始篩選',
    'Start screening',
    'スクリーニング開始',
    '선별 시작',
    'Начать скрининг',
  ],
  _开始筛选Title: [
    '按照设置来筛选当前标签里的作品。',
    '按照設定來篩選目前標籤裡的作品。',
    'Screen the works in the current tag.',
    '現在のタグにある作品を設定によってスクリーニングする',
    '설정에 따라 현재 태그 내 작품을 선별합니다.',
    'Отобразить работы в с текущим тегом',
  ],
  _在结果中筛选: [
    '在结果中筛选',
    '在結果中篩選',
    'Screen in results',
    '結果の中からスクリーニング',
    '결과 중에서 선별',
    'Экран результатов',
  ],
  _在结果中筛选说明: [
    '您可以改变设置，并在结果中再次筛选。',
    '可以變更設定，並在結果中再次篩選。',
    'You can change the settings and screen again in the results.',
    '設定を変えて、結果の中で再びスクリーニングすることができます。',
    '설정을 변경하고, 결과를 다시 선별할 수 있습니다',
    'Вы можете изменить настройки и снова просмотреть результаты',
  ],
  _抓取筛选结果: [
    '抓取筛选结果',
    '擷取篩選結果',
    'Crawl the screening results',
    'スクリーニングの結果をクロールする',
    '선별 결과 긁어오기',
    'Просканировать результаты скрининга',
  ],
  _尚未开始筛选: [
    '尚未开始筛选',
    '尚未開始篩選',
    'Screening has not started',
    'まだスクリーニングを開始していない',
    '선별이 시작되지 않았습니다',
    'Скрининг не начался',
  ],
  _没有数据可供使用: [
    '没有数据可供使用',
    '沒有資料可供使用',
    'No data is available.',
    '使用可能なデータはない',
    '사용 가능한 데이터가 없습니다',
    'Нет данных',
  ],
  _没有找到可下载的作品: [
    `没有找到可下载的作品`,
    `沒有找到可下載的作品`,
    `No works available for download were found`,
    `ダウンロード可能な作品が見つかりませんでした`,
    `다운로드 가능한 작품을 찾을 수 없습니다`,
    `Не найдено работ, доступных для скачивания`,
  ],
  _预览搜索结果: [
    '<span class="key">预览</span>搜索页面的筛选结果',
    '<span class="key">預覽</span>搜尋頁面的篩選結果',
    '<span class="key">Preview</span> filter results on search page',
    '検索ページのフィルタ結果を<span class="key">プレビュー</span>します',
    '<span class="key">미리보기</span> 검색 페이지 필터 결과',
    '<span class="key">Предварительный просмотр</span> результатов фильтрации на странице поиска',
  ],
  _预览搜索结果说明: [
    `在搜索页面（/tags/）里抓取时，下载器可以把抓取到的作品显示在当前页面上，并且按照收藏数量从高到低排序。<br>
    启用预览功能时，下载器不会自动开始下载，这是为了让用户可以对抓取结果再次进行筛选。<br>
    你可以设置最多显示多少个预览。如果预览的数量太多，可能会导致页面崩溃。`,
    `在搜尋頁面（/tags/）裡抓取時，下載器可以把抓取到的作品顯示在當前頁面上，並且按照收藏數量從高到低排序。<br>
    啟用預覽功能時，下載器不會自動開始下載，這是為了讓使用者可以對抓取結果再次進行篩選。<br>
    你可以設定顯示多少個預覽。如果預覽的數量太多，可能會導致頁面崩潰。`,
    `When crawling in the search page (/tags/), the downloader can display the crawled works on the current page and sort them from high to low according to the number of bookmarks. <br>
    When the preview function is enabled, the downloader will not automatically start downloading, so that users can filter the crawled results again. <br>
    You can set how many previews to display. If there are too many previews, the page may crash.`,
    `検索ページ（/tags/）をクロールする際、ダウンローダーはクロールした作品を現在のページに表示し、ブックマーク数の多い順に並べ替えることができます。<br>
プレビュー機能を有効にすると、ダウンローダーは自動的にダウンロードを開始せず、ユーザーはクロール結果を再度絞り込むことができます。<br>
表示するプレビューの数を設定できます。プレビューが多すぎると、ページがクラッシュする可能性があります。`,
    `검색 페이지(/tags/)에서 크롤링할 때, 다운로더는 크롤링된 작품을 현재 페이지에 표시하고 북마크 수에 따라 높은 순위부터 낮은 순위까지 ​​정렬할 수 있습니다. <br>
미리보기 기능을 활성화하면 다운로더가 자동으로 다운로드를 시작하지 않으므로 사용자는 크롤링된 결과를 다시 필터링할 수 있습니다. <br>
표시할 미리보기 개수를 설정할 수 있습니다. 미리보기가 너무 많으면 페이지가 다운될 수 있습니다.`,
    `При сканировании страницы поиска (/tags/) загрузчик может отображать просканированные работы на текущей странице и сортировать их от большего к меньшему в соответствии с количеством закладок. <br>
Когда функция предварительного просмотра включена, загрузчик не будет автоматически начинать загрузку, чтобы пользователи могли снова отфильтровать просканированные результаты. <br>
Вы можете установить количество отображаемых предварительных просмотров. Если предварительных просмотров будет слишком много, страница может выйти из строя.`,
  ],
  _提示启用预览搜索页面的筛选结果时不会自动开始下载: [
    '💡由于启用了“预览搜索页面的筛选结果”，本次抓取完成后，下载器不会自动开始下载。<br>这是为了让用户可以在抓取后进一步筛选抓取结果。',
    '💡由於啟用了“預覽搜尋頁面的篩選結果”，本次抓取完成後，下載器不會自動開始下載。<br>這是為了讓使用者可以在抓取後進一步篩選抓取結果。',
    '💡Since "Preview filter results of search page" is enabled, the downloader will not automatically start downloading after this crawl is completed.<br>This is to allow users to further filter the crawl results after the crawl.',
    '💡「検索ページのフィルター結果のプレビュー」が有効になっているため、このクロールが完了した後、ダウンローダーは自動的にダウンロードを開始しません。 <br>これは、ユーザーがクロール後にクロール結果をさらにフィルタリングできるようにするためです。',
    "💡'검색 페이지 필터 결과 미리보기'가 활성화되어 있으므로 크롤링이 완료된 후 다운로더가 자동으로 다운로드를 시작하지 않습니다. <br>이는 사용자가 크롤링 후 크롤링 결과를 추가로 필터링할 수 있도록 하기 위한 것입니다.",
    '💡Поскольку функция «Предварительный просмотр результатов фильтра страницы поиска» включена, загрузчик не начнет загрузку автоматически после завершения сканирования. <br>Это позволит пользователям дополнительно фильтровать результаты сканирования после сканирования.',
  ],
  _目录名使用: [
    '目录名使用：',
    '資料夾名稱使用：',
    'Name: ',
    'ディレクトリ名の使用：',
    '이름: ',
    'Имя: ',
  ],
  _目录名: ['目录名', '資料夾名稱', 'Name', 'ディレクトリ名', '이름', 'Имя'],
  _启用快速收藏: [
    '启用快速收藏',
    '開啟快速收藏',
    'Enable quick bookmark',
    'クイックボックマークを有効にする',
    '빠른 북마크 활성화',
    'Включить быструю закладку',
  ],
  _启用快速收藏说明: [
    '当你点击下载器添加的收藏按钮(☆)，把作品添加到书签时，自动添加这个作品的标签。',
    '當點選下載器新增的收藏按鈕（☆），將作品加入書籤時，自動新增這個作品的標籤。',
    'When you click the favorite button (☆) added by the downloader to bookmark a work, the tag of the work is automatically added.',
    'ダウンローダーに追加されたボックマークボタン「☆」をクリックして、作品をブックマークに追加すると、自動的に作品のタグが追加されます。',
    '다운로더에 추가된 북마크 버튼(☆)을 클릭하여 북마크에 작품을 추가하면 자동으로 이 작품의 태그가 추가됩니다.',
    'Когда вы нажимаете на кнопку Закладка (☆), добавленную загрузчиком, чтобы добавить произведение в закладки, автоматически добавляется тег для этого произведения',
  ],
  _新增设置项: [
    '新增设置项',
    '新增設定項目',
    'Added setting items',
    '新たな機能を追加されました',
    '새로운 설정 항목 추가',
    'Добавить новый элемент настройки',
  ],
  _新增功能: [
    '新增功能',
    '新增功能',
    'New feature',
    '新機能',
    '새로운 기능',
    'Новая фича',
  ],
  _抓取: ['抓取', '擷取', 'Crawl', 'クロール', '긁어오기', 'Сканирование'],
  _下载: ['下载', '下載', 'Download', 'ダウンロード', '다운로드', 'Скачивание'],
  _其他: ['其他', '其他', 'Others', 'その他', '그 외', 'Другие настройки'],
  _更多: ['更多', '更多', 'More', 'その他', '더보기', 'Больше'],
  _第一张图不带序号: [
    '第一张图不带<span class="key">序号</span>',
    '第一張圖片不包含<span class="key">序號</span>',
    'The first image without a <span class="key">serial number</span>',
    '最初のイメージの<span class="key">番号</span>を削除',
    '<span class="key">일련번호</span>가 없는 첫 번째 이미지',
    'Первое изображение без <span class="key">серийного номера</span>',
  ],
  _第一张图不带序号说明: [
    '去掉每个作品第一张图的序号。例如 80036479_p0 变成 80036479',
    '去掉每個作品第一張圖的序號。例如：80036479_p0 變成 80036479。',
    'Remove the serial number of the first image of each work. For example 80036479_p0 becomes 80036479.',
    '作品ごとの最初のイメージの番号を削除します。例えば 80036479_p0 は 80036479 になります。',
    '작품마다 첫 번째 이미지의 일련번호를 지웁니다.<br>예: 80036479_p0은 80036479가 됩니다.',
    'Удалите серийный номер с первой фотографии каждой работы. Например, 80036479_p0 становится 80036479',
  ],
  _最小值: ['最小值', '最小值', 'Minimum', '最小値', '최소', 'Минимум'],
  _最大值: ['最大值', '最大值', 'Maximum', '最大値', '최대', 'Максимум'],
  _单图作品: [
    '单图作品',
    '單圖作品',
    'Single image works',
    'シングルイメージ作品',
    '단일 이미지 작품',
    'Работа с одним изображением',
  ],
  _彩色图片: [
    '彩色图片',
    '彩色圖片',
    'Color images',
    'カラーイメージ',
    '컬러 이미지',
    'Цветная картинки',
  ],
  _黑白图片: [
    '黑白图片',
    '黑白圖片',
    'Black and white images',
    '白黒イメージ',
    '흑백 이미지',
    'Черно-белые изображения',
  ],
  _不保存图片因为颜色: [
    '{} 没有被保存，因为它的颜色不符合设定。',
    '{} 並未儲存，因為它的色彩不符合設定。',
    '{} was not saved because its colors do not match the settings.',
    '{} は色が設定に合わないため、保存されていません。',
    '{} 색상이 설정과 일치하지 않아, 저장되지 않았습니다.',
    '{} не был(и) сохранен(ы), потому что его цвета не соответствуют настройкам.',
  ],
  _同时转换多少个动图: [
    '同时<span class="key">转换</span>多少个动图',
    '同時<span class="key">轉換</span>多少個動圖',
    'How many animations are <span class="key">converted</span> at the same time',
    '同時変換の<span class="key">うごイラ</span>の上限',
    '동시에 <span class="key">변환할</span> 움직이는 일러스트 수',
    'Сколько анимаций <span class="key">преобразуется</span> одновременно',
  ],
  _同时转换多少个动图的说明: [
    `同时转换多个动图会增加资源占用。<br>
    建议不超过3。`,
    `同時轉換多個動圖會增加資源占用。<br>
    建議不超過3。
    `,
    `Converting multiple animations at the same time will increase resource consumption.<br>
    It is recommended not to exceed 3.
    `,
    `複数の動画を同時に変換すると、リソースの占有が増加します。<br>
    3 を超えないことが推奨されます。
    `,
    `여러 움직이는 일러스트를 동시에 변환하면 리소스가 더 많이 사용됩니다.<br>
    3을 초과하지 않는 것이 좋습니다.
    `,
    `Одновременное преобразование нескольких анимаций увеличит потребление ресурсов.<br>
    Рекомендуется не превышать 3.
    `,
  ],
  _提示: ['提示', '提示', 'Tip', 'ヒント', '팁', 'Подсказка'],
  _fanboxDownloader: [
    'Fanbox 下载器',
    'Fanbox 下載器',
    'Fanbox Downloader',
    'Fanbox ダウンロード',
    'Fanbox 다운로더',
    'Fanbox загрузчик',
  ],
  _不保存图片因为体积: [
    '{} 没有被保存，因为它的体积不符合设定。',
    '{} 並未儲存，因為它的大小不符合設定。',
    '{} was not saved because its size do not match the settings.',
    '{} はファイルサイズが設定に合わないため、保存されていません。',
    '{} 크기가 설정에 맞지 않아, 저장되지 않았습니다.',
    '{} не был(и) сохранен(ы), потому что его размер не соответствует настройкам.',
  ],
  _文件体积限制: [
    '文件<span class="key">体积</span>限制',
    '檔案<span class="key">體積</span>限制',
    'File <span class="key">size</span> limit',
    'ファイル<span class="key">サイズ</span>制限',
    '파일 <span class="key">크기</span> 제한',
    'Ограничение <span class="key">размера</span> файла',
  ],
  _文件体积限制的说明: [
    `如果一个文件的体积不符合要求，下载器就不会下载它。`,
    `如果一個檔案的體積不符合要求，下載器就不會下載它。`,
    `If a file does not meet the required size, the downloader will not download it.`,
    `ファイルが必要なサイズを満たしていない場合、ダウンローダーはファイルをダウンロードしません。`,
    `파일이 필요한 크기에 맞지 않으면 다운로더가 해당 파일을 다운로드하지 않습니다.`,
    `Если файл не соответствует требуемому размеру, загрузчик не загрузит его.`,
  ],
  _不符合要求的文件不会被保存: [
    '不符合要求的文件不会被保存。',
    '不會儲存不符合要求的檔案。',
    'Files that do not meet the requirements will not be saved.',
    '設定 に合わないファイルは保存されません。',
    '요구 사항을 충족하지 않는 파일은 저장되지 않습니다.',
    'Файлы, не соответствующие требованиям, не будут сохранены',
  ],
  _抓取系列小说: [
    '抓取系列小说',
    '擷取系列小說',
    'Crawl series of novels',
    '小説のシリーズをクロールする',
    '시리즈 소설 긁어오기',
    'Просканировать серию новелл',
  ],
  _合并系列小说: [
    '合并系列小说',
    '合併系列小說',
    'Merge series of novels',
    'シリーズ小説の統合',
    '시리즈 소설 합치기',
    'Объединить серию новелл',
  ],
  _已合并系列小说: [
    `已合并系列小说`,
    `已合併系列小說`,
    `Series novels merged`,
    `シリーズ小説をマージ済み`,
    `시리즈 소설 병합됨`,
    `Серии романов объединены`,
  ],
  _跳过合并系列小说: [
    `跳过合并系列小说`,
    `跳過合併系列小說`,
    `Skip merging novel series`,
    `シリーズ小説のマージをスキップ`,
    `시리즈 소설 병합 건너뛰기`,
    `Пропустить объединение серий романов`,
  ],
  _获取小说列表: [
    `获取小说列表`,
    `獲取小說列表`,
    `Get novel list`,
    `小説リストを取得`,
    `소설 목록 가져오기`,
    `Получить список романов`,
  ],
  _发生错误取消合并这个系列小说: [
    `发生错误，取消合并这个系列小说`,
    `發生錯誤，取消合併這個系列小說`,
    `An error occurred, cancel merging this novel series`,
    `エラーが発生しました。このシリーズ小説のマージをキャンセル`,
    `오류가 발생했습니다. 이 시리즈 소설 병합 취소`,
    `Произошла ошибка, отменить слияние этой серии романов`,
  ],
  _获取小说数据进度: [
    `获取小说数据 {}`,
    `獲取小說數據 {}`,
    `Fetching novel data {}`,
    `小説データを取得中 {}`,
    `소설 데이터 가져오는 중 {}`,
    `Получение данных романа {}`,
  ],
  _跳过这个小说: [
    `跳过这个小说`,
    `跳過這個小說`,
    `Skip this novel`,
    `この小説をスキップ`,
    `이 소설 건너뛰기`,
    `Пропустить этот роман`,
  ],
  _下载小说封面失败: [
    `下载小说封面失败`,
    `下載小說封面失敗`,
    `Failed to download novel cover`,
    `小説の表紙のダウンロードに失敗しました`,
    `소설 표지 다운로드 실패`,
    `Не удалось скачать обложку романа`,
  ],
  _下载小说里的图片失败: [
    `下载小说里的图片失败`,
    `下載小說裡的圖片失敗`,
    `Failed to download images in the novel`,
    `小説内の画像のダウンロードに失敗しました`,
    `소설 내 이미지 다운로드 실패`,
    `Не удалось скачать изображения в романе`,
  ],
  _系列简介: [`简介`, `簡介`, `Caption`, `キャプション`, `캡션`, `Подпись`],
  _设定资料: [
    `设定资料`,
    `設定資料`,
    `Glossary`,
    `設定資料`,
    `설정 자료`,
    `Глоссарий`,
  ],
  _获取设定资料: [
    `获取设定资料`,
    `獲取設定資料`,
    `Get glossary`,
    `設定資料を取得`,
    `설정 자료 가져오기`,
    `Получить глоссарий`,
  ],
  _获取系列数据: [
    `获取系列数据`,
    `獲取系列數據`,
    `Get series data`,
    `シリーズデータを取得`,
    `시리즈 데이터 가져오기`,
    `Получить данные серии`,
  ],
  _元数据部分结束: [
    `元数据部分结束`,
    `元數據部分結束`,
    `End of metadata section`,
    `メタデータ部分終了`,
    `메타데이터 부분 종료`,
    `Конец раздела метаданных`,
  ],
  _系列小说的元数据部分结束: [
    `系列小说的元数据部分结束`,
    `系列小說的元數據部分結束`,
    `End of metadata section for novel series`,
    `シリーズ小説のメタデータ部分終了`,
    `시리즈 소설의 메타데이터 부분 종료`,
    `Конец раздела метаданных серии романов`,
  ],
  _更新日期: [
    `更新日期`,
    `更新日期`,
    `Update date`,
    `更新日`,
    `업데이트 날짜`,
    `Дата обновления`,
  ],
  _小说保存格式: [
    '<span class="key">小说</span>保存格式',
    '<span class="key">小說</span>儲存格式',
    'Save the <span class="key">novel</span> as',
    '<span class="key">小説</span>の保存形式',
    '<span class="key">소설</span> 저장 형식',
    'Сохранить <span class="key">новеллу</span> как',
  ],
  _小说保存格式的说明: [
    'TXT 是纯文本文件。选择 TXT 格式时，小说里的图片会单独保存。<br>EPUB 是电子书格式，小说里的图片会内嵌到 EPUB 文件里。',
    'TXT 是純文字檔案。選擇 TXT 格式時，小說裡的圖片會單獨儲存。<br>EPUB 是電子書格式，小說裡的圖片會內嵌到 EPUB 檔案裡。',
    'TXT is a plain text file. When you select TXT format, the pictures in the novel will be saved separately. <br>EPUB is an e-book format, and the pictures in the novel will be embedded in the EPUB file.',
    'TXTはプレーンテキストファイルです。TXT形式を選択すると、小説内の画像は別途保存されます。<br>EPUBは電子書籍形式で、小説内の画像はEPUBファイルに埋め込まれます。',
    'TXT는 일반 텍스트 파일입니다. TXT 형식을 선택하면 소설의 그림이 별도로 저장됩니다. <br>EPUB는 전자책 형식이며, 소설의 그림이 EPUB 파일에 포함됩니다.',
    'TXT — это простой текстовый файл. При выборе формата TXT изображения в романе будут сохранены отдельно. <br>EPUB — это формат электронной книги, и изображения в романе будут встроены в файл EPUB.',
  ],
  _在小说里保存元数据: [
    '在小说里保存<span class="key">元数据</span>',
    '在小說裡儲存<span class="key">元資料</span>',
    'Save <span class="key">metadata</span> in the novel',
    '小説の中に<span class="key">メタデータ</span>を保存する',
    '소설 내 <span class="key">메타데이터</span> 저장',
    'Сохранить <span class="key">метаданные</span> новеллы',
  ],
  _在小说里保存元数据提示: [
    '把小说的标题、作者、标签等信息保存到小说开头。',
    '把小說的標題、作者、標籤等資訊儲存到小說開頭。',
    `Save the novel's title, author, tags and other information to the beginning of the novel.`,
    '小説のタイトル、著者、タグなどの情報を小説の冒頭に保存します。',
    '소설의 제목, 저자, 태그 및 기타 정보를 소설의 시작 부분에 저장합니다.',
    'Сохраните название романа, автора, теги и другую информацию в начале романа.',
  ],
  _作者: [`作者`, `作者`, `Author`, `作者`, `작가`, `Автор`],
  _正在下载小说x中的插画x: [
    `下载小说 {} 中的插画 {}`,
    `下載小說 {} 中的插畫 {}`,
    `Downloading novel {}'s illustrations {}`,
    `小説 {} 内のイラスト {} をダウンロード中`,
    `소설 {} 내의 일러스트 {} 다운로드 중`,
    `Скачивание романа {}: иллюстрации {}`,
  ],
  _下载小说的封面图片的提示: [
    `下载小说 {} 的封面图片`,
    `下載小說 {} 的封面圖片`,
    `Download the cover image of novel {}`,
    `小説 {} の表紙画像をダウンロード`,
    `소설 {} 의 표지 이미지 다운로드`,
    `Скачать обложку романа {}`,
  ],
  _下载系列小说的封面图片: [
    `下载系列小说 {} 的封面图片`,
    `下載系列小說 {} 的封面圖片`,
    `Download the cover image of novel series {}`,
    `シリーズ小説 {} の表紙画像をダウンロード`,
    `시리즈 소설 {} 의 표지 이미지 다운로드`,
    `Скачать обложку серии романов {}`,
  ],
  _下面是正文: [
    `下面是正文`,
    `下面是正文`,
    `Below is the main text`,
    `以下は本文`,
    `아래는 본문`,
    `Ниже основной текст`,
  ],
  _目录: ['目录', '目錄', 'Table of Contents', '目次', '목차', 'Оглавление'],
  _Information: ['信息', '資訊', 'Information', '情報', '정보', 'Информация'],
  _收藏本页面的所有作品: [
    '收藏本页面的所有作品',
    '收藏本頁面的所有作品',
    'Bookmark all works on this page',
    'この頁の全ての作品をブックマークに追加します',
    '이 페이지의 북마크된 모든 작품 다운로드',
    'Перенести в закладки все работы на этой странице',
  ],
  _输出内容太多已经为你保存到文件: [
    '因为输出内容太多，已经为您保存到文件。',
    '因為輸出內容太多，已經為你儲存到檔案。',
    'Because the output is too much, it has been saved to a file.',
    '出力内容が多いため、TXT ファイルに保存しました。',
    '출력 내용이 너무 많아, 파일로 저장했습니다.',
    'Так как выход слишком большой, он был сохранен в файл',
  ],
  _不下载重复文件: [
    '不下载<span class="key">重复</span>文件',
    '不下載<span class="key">重複</span>檔案',
    `Don't download <span class="key">duplicate</span> files`,
    '<span class="key">重複</span>ファイルをダウンロードしない',
    '<span class="key">중복</span> 파일 다운로드하지 않기',
    'Не загружать <span class="key">дубликаты</span> файлов',
  ],
  _因为不下载重复文件跳过了x个文件: [
    `因为不下载重复文件，跳过了 {} 个文件`,
    `因為不下載重複檔案，跳過了 {} 個檔案`,
    `Skipped {} files because duplicate files are not downloaded`,
    `重複ファイルをダウンロードしないため、{} 個のファイルをスキップしました`,
    `중복 파일을 다운로드하지 않아 {}개의 파일을 건너뛰었습니다.`,
    `Пропущено {} файлов, потому что повторяющиеся файлы не загружаются`,
  ],
  _不下载重复文件的提示: [
    `该功能依赖下载器自己保存的下载记录。<br>如果你启用了该功能，那么下载器会在下载每一个文件前检查下载记录，如果它是重复文件，下载器就会跳过它（不会下载它）。<br>该功能在下载阶段生效。如果你想在抓取时就跳过已下载的文件，可以启用另一个功能：“不抓取下载过的作品”。<br><br>该功能有两种判断重复文件的策略：<br>- 宽松：默认值。该模式只会对比作品 ID 和上传日期，不会对比文件名。如果你希望在修改了文件名规则之后，依然可以跳过之前下载过的文件，则可以选择“宽松”模式。<br>- 严格：该模式会对比三个条件：作品的 ID、上传日期、文件名。如果三个条件都相同，则是重复文件。`,
    `該功能依賴下載器自己保存的下載記錄。<br>如果你啟用了該功能，那麼下載器會在下載每一個檔案前檢查下載記錄，如果它是重複檔案，下載器就會跳過它（不會下載它）。<br>該功能在下載階段生效。如果你想在抓取時就跳過已下載的檔案，可以啟用另一個功能：「不抓取下載過的作品」。<br><br>該功能有兩種判斷重複檔案的策略：<br>- 寬鬆：預設值。該模式只會對比作品 ID 和上傳日期，不會對比檔名。如果你希望在修改了檔名規則之後，依然可以跳過之前下載過的檔案，則可以選擇「寬鬆」模式。<br>- 嚴格：該模式會對比三個條件：作品的 ID、上傳日期、檔名。如果三個條件都相同，則是重複檔案。`,
    `This feature relies on the download records saved by the downloader itself.<br>If you enable this feature, the downloader will check the download record before downloading each file. If it is a duplicate file, the downloader will skip it (will not download it).<br>This feature takes effect during the download phase. If you want to skip already downloaded files during the crawling phase, you can enable another feature: "Do not crawl downloaded works".<br><br>This feature has two strategies for determining duplicate files:<br>- Loose: Default value. This mode only compares the work ID and upload date, and does not compare the filename. If you want to still skip previously downloaded files after modifying the naming rule, you can choose the "Loose" mode.<br>- Strict: This mode compares three conditions: the work's ID, upload date, and filename. If all three conditions are the same, it is considered a duplicate file.`,
    `この機能はダウンローダーが自身で保存したダウンロード記録に依存します。<br>この機能を有効にすると、ダウンローダーは各ファイルをダウンロードする前にダウンロード記録を確認し、重複ファイルの場合はスキップします（ダウンロードしません）。<br>この機能はダウンロード段階で有効になります。クローリング時にすでにダウンロード済みのファイルをスキップしたい場合は、別の機能「ダウンロード済みの作品をクロールしない」を有効にできます。<br><br>この機能には重複ファイルを判断する2つの戦略があります：<br>- 緩やか：デフォルト値。このモードは作品IDとアップロード日のみ比較し、ファイル名は比較しません。命名規則を変更した後も以前にダウンロードしたファイルをスキップしたい場合は、「緩やか」モードを選択できます。<br>- 厳格：このモードは3つの条件を比較します：作品のID、アップロード日、ファイル名。3つの条件がすべて同じ場合、重複ファイルとみなされます。`,
    `이 기능은 다운로더가 자체적으로 저장한 다운로드 기록에 의존합니다.<br>이 기능을 활성화하면 다운로더는 각 파일을 다운로드하기 전에 다운로드 기록을 확인하고, 중복 파일인 경우 건너뜁니다(다운로드하지 않습니다).<br>이 기능은 다운로드 단계에서 적용됩니다. 크롤링 시 이미 다운로드된 파일을 건너뛰고 싶다면 다른 기능 "다운로드된 작품을 크롤링하지 않음"을 활성화할 수 있습니다.<br><br>이 기능에는 중복 파일을 판단하는 두 가지 전략이 있습니다:<br>- 느슨함: 기본값. 이 모드는 작품 ID와 업로드 날짜만 비교하며 파일명은 비교하지 않습니다. 파일명 규칙을 수정한 후에도 이전에 다운로드한 파일을 계속 건너뛰고 싶다면 "느슨함" 모드를 선택할 수 있습니다.<br>- 엄격함: 이 모드는 세 가지 조건을 비교합니다: 작품의 ID, 업로드 날짜, 파일명. 세 조건이 모두 동일하면 중복 파일로 간주합니다.`,
    `Эта функция зависит от записей загрузки, сохранённых самим загрузчиком.<br>Если вы включите эту функцию, загрузчик будет проверять запись загрузки перед загрузкой каждого файла. Если это повторяющийся файл, загрузчик пропустит его (не будет скачивать).<br>Эта функция действует на этапе загрузки. Если вы хотите пропускать уже загруженные файлы уже на этапе краулинга, вы можете включить другую функцию: «Не краулить загруженные работы».<br><br>У этой функции есть две стратегии определения повторяющихся файлов:<br>- Слабая: значение по умолчанию. Этот режим сравнивает только ID произведения и дату загрузки, не сравнивая имя файла. Если вы хотите по-прежнему пропускать ранее загруженные файлы после изменения правила именования, выберите режим «Слабая».<br>- Строгая: этот режим сравнивает три условия: ID произведения, дату загрузки и имя файла. Если все три условия совпадают, файл считается повторяющимся.`,
  ],
  _策略: [
    '策略：',
    '策略：',
    'Strategy:',
    'フィルター：',
    '전략:',
    'Стратегия',
  ],
  _严格: ['严格', '嚴格', 'Strict', '厳格', '엄격하게', 'Строгий'],
  _宽松: ['宽松', '寬鬆', 'Loose', '緩い', '느슨하게', 'Свободный'],
  _严格模式说明: [
    '判断条件：作品的 id、上传日期、文件名',
    '判斷條件：作品的 id、上傳日期、檔名',
    'Judgment conditions: id, upload date, file name of the work',
    '審査条件：作品のID、アップロード日、ファイル名',
    '판정 조건: 작품 ID, 업로드 날짜, 파일명',
    'Условия оценки: идентификатор, дата загрузки, имя файла работы',
  ],
  _宽松模式说明: [
    '判断条件：作品的 id、上传日期',
    '判斷條件：作品的 id、上傳日期',
    'Judgment conditions: id, upload date of the work',
    '審査条件：作品のID、アップロード日',
    '판정 조건: 작품 ID, 업로드 날짜',
    'Условия оценки: идентификатор, дата загрузки работы',
  ],
  _清除下载记录: [
    '清除下载记录',
    '清除下載記錄',
    'Clear download record',
    'ダウンロード記録をクリア',
    '다운로드 기록 지우기',
    'Очистить запись загрузки',
  ],
  确定要清除下载记录吗: [
    '确定要清除下载记录吗？',
    '確定要清除下載記錄嗎？',
    'Are you sure you want to clear download record?',
    'ダウンロード記録を消去してもよろしいですか?',
    '다운로드 기록을 지우시겠습니까?',
    'Вы уверены, что хотите очистить запись загрузки?',
  ],
  _下载记录已清除: [
    '下载记录已清除',
    '已清除下載紀錄',
    'Download record has been cleared',
    'ダウンロード履歴がクリアされました',
    '다운로드 기록이 비워졌습니다',
    'Запись загрузок была очищена',
  ],
  _跳过下载因为重复文件: [
    '检测到文件 {} 已经下载过，跳过此次下载',
    '偵測到檔案 {} 已經下載過，跳過此次下載。',
    'Skip downloading duplicate files {}',
    '重複ファイル {} をスキップ',
    '파일 {}이(가) 이미 다운로드되어 있어, 다운로드를 건너뜁니다',
    'Пропустить загрузку дубликатов файлов {}',
  ],
  _保存用户头像为图标: [
    '保存用户头像为图标',
    '將使用者頭貼另存為圖示檔案',
    'Save user avatar as icon',
    'プロフィール画像をアイコンとして保存',
    '아이콘으로 유저 프로필 이미지 저장',
    'Сохранить аватар пользователя как иконку',
  ],
  _保存用户头像为图标说明: [
    '把用户头像保存为 ico 文件，可以手动设置成文件夹的图标。',
    '將使用者頭貼儲存為 ico 檔案，可以手動設定成資料夾圖示。',
    'Save user avatar as icon',
    'ユーザーのプロフィール画像を ico ファイルとして保存して、フォルダーアイコンとして設定できます。',
    '유저 프로필 이미지를 ico 파일로 저장하면, 디렉토리 아이콘으로 수동 설정할 수 있습니다.',
    'Сохранить аватар пользователя как иконку',
  ],
  _正在保存抓取结果: [
    '正在保存抓取结果',
    '正在儲存擷取結果',
    'Saving crawl results',
    'クロール結果を保存しています',
    '긁어오기 결과 저장 중',
    'Сохранение результатов вытаскивания',
  ],
  _已保存抓取结果: [
    '已保存抓取结果',
    '已儲存擷取結果',
    'Crawl results saved',
    'クロール結果を保存しました',
    '긁어오기 결과가 저장되었습니다',
    'Сохранение результатов вытаскивания',
  ],
  _正在恢复抓取结果: [
    '正在恢复抓取结果',
    '正在還原擷取結果',
    'Restoring crawl results',
    'クロール結果を再開しています',
    '긁어오기 결과 복구 중',
    'Восстановление результатов вытаскивания',
  ],
  _已恢复抓取结果: [
    '已恢复抓取结果',
    '已還原擷取結果',
    'Crawl results resumed',
    'クロール結果を再開しました',
    '긁어오기 결과가 복구되었습니다',
    'Результаты вытаскивания восстановлены',
  ],
  _清空已保存的抓取结果: [
    '清空已保存的抓取结果',
    '清除已儲存的擷取結果',
    'Clear saved crawl results',
    'セーブしたクロール結果をクリアします',
    '저장된 긁어오기 결과 비우기',
    'Очистить сохраненные результаты вытаскивания',
  ],
  _数据清除完毕: [
    '数据清除完毕',
    '資料清除完畢',
    'Data cleared',
    'クリアされたデータ',
    '데이터가 비워졌습니다',
    'Данные очищены',
  ],
  _已清除这个URL里保存的抓取结果: [
    `已清除这个 URL 里保存的抓取结果`,
    `已清除這個 URL 裡保存的抓取結果`,
    `Cleared the crawl results saved for this URL`,
    `この URL に保存されたクロール結果をクリアしました`,
    `이 URL에 저장된 크롤링 결과가 지워졌습니다`,
    `Очищены результаты краулинга, сохранённые для этого URL`,
  ],
  _已跳过n个文件: [
    '已跳过 {} 个文件',
    '已跳過 {} 個檔案',
    '{} files skipped',
    '{} つのファイルをスキップしました',
    '{}개의 파일을 건너뛰었습니다',
    '{} файл(ов) пропущены',
  ],
  _不保存图片因为宽高: [
    '{} 没有被保存，因为它的宽高不符合设定。',
    '{} 並未儲存，因為它的寬高不符合設定。',
    '{} was not saved because its width and height do not match the settings.',
    '{} は幅と高さが設定に合わないため、保存されていません。',
    '{} 너비와 높이가 설정에 맞지 않아, 저장되지 않았습니다.',
    '{} не был(и) сохранен, потому что его ширина и высота не соответствуют настройкам.',
  ],
  _保存: ['保存', '儲存', 'Save', '保存', '저장', 'Сохранить'],
  _加载: ['加载', '載入', 'Load', 'ロード', '불러오기', 'Загрузить'],
  _保存命名规则提示: [
    '保存命名规则，最多 20 个',
    '儲存命名規則，最多 20 個',
    'Save naming rule, up to 20',
    '命名規則を保存します。最大 20 個まで',
    '명명 규칙 저장, 최대 20개',
    'Сохранить правило именования, до 20',
  ],
  _已保存命名规则: [
    '已保存命名规则',
    '已儲存命名規則',
    'Naming rule saved',
    '命名規則を保存しました',
    '명명 규칙이 저장되었습니다.',
    'Правило наименования сохранено',
  ],
  _命名: ['命名', '命名', 'Naming', '命名', '이름', 'Имя'],
  _文件名长度限制: [
    '文件名<span class="key">长度</span>限制',
    '檔案名稱<span class="key">長度</span>限制',
    'File name <span class="key">length</span> limit',
    'ファイル名の<span class="key">長さ</span>制限',
    '파일명 <span class="key">길이</span> 제한',
    'Лимит <span class="key">длины</span> имени файла',
  ],
  _文件名长度限制的说明: [
    `如果文件或文件夹的名字超长，浏览器可能无法自动保存文件，并且会显示另存为窗口让用户手动保存。这不仅影响了用户体验，而且如果用户没有及时操作，还会导致下载进度卡住。<br><br>
    启用这个设置之后，下载器会检查文件全名的字数（包含所有的文件夹和文件名），如果字数超出了长度限制，下载器会截断一些字符，让浏览器可以自动保存文件，不再显示另存为窗口。<br>
    下载器会优先截断文件名，其次截断文件夹的名字（如果有必要的话）。<br><br>
    默认值是 210，最大值是 250。不建议设置太大的值。<br>有时 210 可能依然太大，如果你遇到了问题，可以减小这个值。`,
    `如果檔案或資料夾的名稱超長，瀏覽器可能無法自動儲存檔案，並且會顯示另存為視窗讓使用者手動儲存。這不僅影響了使用者體驗，而且如果使用者沒有及時操作，還會導致下載進度卡住。<br><br>
    啟用這個設定之後，下載器會檢查檔案全名的字數（包含所有的資料夾和檔名），如果字數超出了長度限制，下載器會截斷一些字元，讓瀏覽器可以自動儲存檔案，不再顯示另存為視窗。<br>
    下載器會優先截斷檔名，其次截斷資料夾的名字（如果有必要的話）。<br><br>
    預設值是 210，最大值是 250。不建議設定太大的值。<br>有時 210 可能依然太大，如果你遇到了問題，可以減小這個值。`,
    `If the file or folder name is too long, the browser may fail to save the file automatically and will display a "Save As" dialog for manual saving. This not only affects user experience, but if the user does not respond promptly, it can also cause the download progress to stall.<br><br>
    After enabling this setting, the downloader will check the total character count of the full file path (including all folders and the filename). If it exceeds the length limit, the downloader will truncate some characters so the browser can automatically save the file without showing the "Save As" dialog.<br>
    The downloader prioritizes truncating the filename first, then truncates folder names if necessary.<br><br>
    The default value is 210, and the maximum value is 250. It is not recommended to set a value that is too large.<br>Sometimes 210 may still be too big; if you encounter issues, you can reduce this value.`,
    `ファイルまたはフォルダー名が長すぎる場合、ブラウザがファイルを自動保存できず、「名前を付けて保存」ダイアログが表示され、手動保存が必要になります。これはユーザー体験を損なうだけでなく、ユーザーがすぐに対応しない場合、ダウンロードの進行が止まってしまう可能性もあります。<br><br>
    この設定を有効にすると、ダウンロードツールはファイルのフルパス全体の文字数（すべてのフォルダーとファイル名を含む）をチェックし、長さ制限を超えた場合、一部の文字を切り捨ててブラウザが自動保存できるようにします。これにより「名前を付けて保存」ダイアログが表示されなくなります。<br>
    ダウンロードツールはまずファイル名を優先的に切り捨て、次に必要に応じてフォルダー名を切り捨てます。<br><br>
    デフォルト値は 210、最大値は 250 です。あまり大きな値を設定することは推奨されません。<br>210 でもまだ大きい場合があるため、問題が発生した場合は値を小さくしてください。`,
    `파일이나 폴더 이름이 너무 길면 브라우저가 파일을 자동으로 저장하지 못하고 "다른 이름으로 저장" 창을 띄워 수동 저장을 요구합니다. 이는 사용자 경험을 저해할 뿐만 아니라 사용자가 즉시 대응하지 않으면 다운로드 진행이 멈출 수도 있습니다.<br><br>
    이 설정을 활성화하면 다운로더는 파일 전체 경로의 글자 수(모든 폴더와 파일명을 포함)를 확인하고, 길이 제한을 초과할 경우 일부 문자를 잘라내어 브라우저가 자동으로 파일을 저장할 수 있게 합니다. 이렇게 하면 "다른 이름으로 저장" 창이 나타나지 않습니다.<br>
    다운로더는 우선 파일명을 잘라내고, 필요 시 폴더 이름을 잘라냅니다.<br><br>
    기본값은 210이며, 최대값은 250입니다. 너무 큰 값을 설정하는 것은 권장하지 않습니다.<br>때때로 210도 여전히 클 수 있으니 문제가 발생하면 이 값을 줄여보세요。`,
    `Если имя файла или папки слишком длинное, браузер может не сохранить файл автоматически и покажет окно «Сохранить как» для ручного сохранения. Это не только ухудшает пользовательский опыт, но и может привести к зависанию прогресса загрузки, если пользователь не отреагирует вовремя.<br><br>
    После включения этой настройки загрузчик проверяет общее количество символов в полном пути файла (включая все папки и имя файла). Если оно превышает ограничение, загрузчик усекает часть символов, чтобы браузер смог автоматически сохранить файл без показа окна «Сохранить как».<br>
    Загрузчик сначала усекает имя файла, а при необходимости — имена папок.<br><br>
    Значение по умолчанию — 210, максимальное — 250. Не рекомендуется устанавливать слишком большое значение.<br>Иногда даже 210 может быть слишком большим; если возникнут проблемы, уменьшите это значение.`,
  ],
  _文件名可能超长的提示: [
    `一些文件的全名超过了 {} 个字符，但你没有启用“文件名长度限制”。这可能会导致浏览器显示“另存为”窗口，让你手动保存文件。<br>
    文件名：{}<br>
    如果你遇到了此问题，可以先暂停下载，然后尝试下面的方法：<br>
    1. 修改命名规则，移除导致文件名超长的命名标签。这些标签通常是 {tags}、{page_title}，有时它们可能会产生很多字符。<br>
    2. 启用“文件名长度限制”设置，让下载器截断文件夹或文件的名称，使文件可以正常保存。`,
    `一些檔案的全名超過了 {} 個字元，但你沒有啟用「檔名長度限制」。這可能會導致瀏覽器顯示「另存為」視窗，讓你手動儲存檔案。<br>
    檔名：{}<br>
    如果你遇到了此問題，可以先暫停下載，然後嘗試下面的方法：<br>
    1. 修改命名規則，移除導致檔名超長的命名標記。這些標記通常是 {tags}、{page_title}，有時它們可能會產生很多字元。<br>
    2. 啟用「檔名長度限制」設定，讓下載器截斷資料夾或檔案的名稱，使檔案可以正常儲存。`,
    `Some files have full names exceeding {} characters, but you have not enabled "Filename Length Limit". This may cause the browser to display a "Save As" dialog, requiring you to save the file manually.<br>
    Filename: {}<br>
    If you encounter this issue, you can first pause the download and then try the following methods:<br>
    1. Modify the naming rule and remove naming tags that cause the filename to be too long. These tags are usually {tags}, {page_title}, and sometimes they can generate a lot of characters.<br>
    2. Enable the "Filename Length Limit" setting so the downloader truncates folder or file names, allowing files to be saved normally.`,
    `一部のファイルのフルネームが {} 文字を超えていますが、「ファイル名長さ制限」を有効にしていません。これによりブラウザが「名前を付けて保存」ダイアログを表示し、手動で保存する必要が生じる可能性があります。<br>
    ファイル名：{}<br>
    この問題に遭遇した場合、まずダウンロードを一時停止してから以下の方法をお試しください：<br>
    1. 命名ルールを変更し、ファイル名を長くする命名タグを削除してください。これらのタグは通常 {tags}、{page_title} で、場合によっては非常に多くの文字を生成します。<br>
    2. 「ファイル名長さ制限」設定を有効にすると、ダウンロードツールがフォルダーまたはファイル名を切り詰め、ファイルが正常に保存されるようになります。`,
    `일부 파일의 전체 이름이 {}자를 초과했지만 "파일 이름 길이 제한"을 활성화하지 않았습니다. 이로 인해 브라우저가 "다른 이름으로 저장" 창을 표시하여 수동으로 파일을 저장해야 할 수 있습니다.<br>
    파일명: {}<br>
    이 문제가 발생했다면 먼저 다운로드를 일시 중지한 후 아래 방법을 시도해 보세요:<br>
    1. 명명 규칙을 수정하여 파일명을 길게 만드는 명명 태그를 제거하세요. 이러한 태그는 보통 {tags}, {page_title}이며 때로는 많은 문자를 생성할 수 있습니다.<br>
    2. "파일 이름 길이 제한" 설정을 활성화하면 다운로더가 폴더 또는 파일 이름을 잘라내어 파일이 정상적으로 저장되도록 합니다。`,
    `Некоторые файлы имеют полные имена, превышающие {} символов, но у вас не включена настройка «Ограничение длины имени файла». Это может привести к тому, что браузер покажет окно «Сохранить как», и вам придётся сохранять файл вручную.<br>
    Имя файла: {}<br>
    Если вы столкнулись с этой проблемой, сначала приостановите загрузку, а затем попробуйте следующие способы:<br>
    1. Измените правило именования и удалите теги именования, которые приводят к чрезмерной длине имени файла. Обычно это {tags}, {page_title}, иногда они могут генерировать очень много символов.<br>
    2. Включите настройку «Ограничение длины имени файла», чтобы загрузчик усечал имена папок или файлов, позволяя сохранять их нормально.`,
  ],
  _下载器截断了一些文件名的提示: [
    `一些文件名的字符数量超过了“文件名长度限制”里的值，所以下载器截断了一些字符。原文件名：{}`,
    `一些檔名的字元數量超過了「檔名長度限制」裡的值，所以下載器截斷了一些字元。原檔名：{}`,
    `Some filenames exceeded the value in "Filename Length Limit", so the downloader truncated some characters. Original filename: {}`,
    `一部のファイル名の文字数が「ファイル名長さ制限」の値を超えたため、ダウンロードツールが一部の文字を切り詰めました。元のファイル名：{}`,
    `일부 파일명의 글자 수가 "파일 이름 길이 제한" 값보다 초과되어 다운로더가 일부 문자를 잘랐습니다. 원본 파일명: {}`,
    `Некоторые имена файлов превысили значение в настройке «Ограничение длины имени файла», поэтому загрузчик укоротил некоторые символы. Исходное имя файла: {}`,
  ],
  _标签分隔符号: [
    '标签<span class="key">分隔</span>符号',
    '標簽<span class="key">分隔</span>符號',
    'Tag <span class="key">separation</span> symbol',
    'タグ <span class="key">セパレーション</span>シンボル',
    '태그 <span class="key">분리</span> 기호',
    'Тег <span class="key">символ разделения</span>',
  ],
  _标签分隔符号提示: [
    '只会影响这些命名标记的结果：<span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{tags_transl_only}</span>。<br>推荐符号<span class="blue"> , # ^ & _</span>',
    '只會影響這些命名標記的結果：<span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{tags_transl_only}</span>。<br>推薦符號<span class="blue"> , # ^ & _</span>',
    'Only affects results for these named tags: <span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{ tags_transl_only}</span>. <br>Recommended symbols <span class="blue"> , # ^ & _</span>',
    '次の名前付きタグの結果にのみ影響します: <span class="blue">{tags}</span>、<span class="blue">{tags_translate}</span>、<span class="blue">{ tags_transl_only }</スパン>。 <br>推奨記号 <span class="blue"> , # ^ & _</span>。',
    '이러한 명명된 태그의 결과에만 영향을 미칩니다: <span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{ tags_transl_only }</스팬>. <br>권장 기호 <span class="blue"> , # ^ & _</span>',
    'Влияет только на результаты для следующих именованных тегов: <span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{ tags_transl_only </промежуток>. <br>Рекомендуемые символы <span class="blue"> , # ^ & _</span>',
  ],
  _导出csv: [
    '导出 CSV 文件',
    '匯出 CSV 檔',
    'Export CSV file',
    'CSV ファイルをエクスポート',
    'CSV 파일 내보내기',
    'Экспорт в файл CSV',
  ],
  _导出抓取结果: [
    '导出抓取结果',
    '匯出擷取結果',
    'Export results',
    'クロール結果をエクスポート',
    '결과 내보내기',
    'Экспорт результатов',
  ],
  _导入抓取结果: [
    '导入抓取结果',
    '匯入擷取結果',
    'Import results',
    'クロール結果をインポート',
    '결과 불러오기',
    'Импорт результатов',
  ],
  _导入成功: [
    '导入成功',
    '匯入成功',
    'Import successfully',
    'インポート成功',
    '가져오기 성공',
    'Импорт успешен',
  ],
  _导出成功: [
    '导出成功',
    '匯出成功',
    'Export successfully',
    'エクスポート成功',
    '내보내기 성공',
    'Импорт успешен',
  ],
  _图片尺寸: [
    '图片<span class="key">尺寸</span>',
    '圖片<span class="key">尺寸</span>',
    'Image <span class="key">size</span>',
    '画像<span class="key">サイズ</span>',
    '이미지 <span class="key">크기</span>',
    '<span class="key">Размер</span> изображения',
  ],
  _图片尺寸2: [
    '图片尺寸',
    '圖片尺寸',
    'Image size',
    '画像サイズ',
    '이미지 크기',
    'Размер изображения',
  ],
  _查看的图片尺寸: [
    `查看的图片尺寸`,
    `查看的圖片尺寸`,
    `View image dimensions`,
    `閲覧した画像のサイズ`,
    `본 이미지 크기`,
    `Размеры просматриваемого изображения`,
  ],
  _图片查看器: [
    `图片查看器`,
    `圖片查看器`,
    `Image viewer`,
    `画像ビューア`,
    `이미지 뷰어`,
    `Просмотрщик изображений`,
  ],
  _图片查看器的帮助: [
    `当你使用图片查看器时，可以使用这些快捷键：<br>
<span class="blue">←</span> 上一张图片<br>
<span class="blue">→</span> 下一张图片<br>
<span class="blue">↑</span> 增加缩放比例<br>
<span class="blue">↓</span> 减小缩放比例<br>
<span class="blue">F</span> 切换显示比例：100% 或自适应缩放<br>
<span class="blue">Esc</span> 退出图片查看器<br>
<br>
另外，使用鼠标滚轮也可以切换图片或控制缩放，这取决于鼠标指针是否位于图片上：<br>
- 当鼠标滚轮在图片上滚动时，图片会放大或缩小；<br>
- 当鼠标滚轮在图片外滚动时，会切换图片。`,
    `當你使用圖片查看器時，可以使用這些快捷鍵：<br>
<span class="blue">←</span> 上一張圖片<br>
<span class="blue">→</span> 下一張圖片<br>
<span class="blue">↑</span> 增加縮放比例<br>
<span class="blue">↓</span> 減小縮放比例<br>
<span class="blue">F</span> 切換顯示比例：100% 或自適應縮放<br>
<span class="blue">Esc</span> 退出圖片查看器<br>
<br>
另外，使用滑鼠滾輪也可以切換圖片或控制縮放，這取決於滑鼠指標是否位於圖片上：<br>
- 當滑鼠滾輪在圖片上滾動時，圖片會放大或縮小；<br>
- 當滑鼠滾輪在圖片外滾動時，會切換圖片。`,
    `When using the image viewer, you can use these keyboard shortcuts:<br>
<span class="blue">←</span> Previous image<br>
<span class="blue">→</span> Next image<br>
<span class="blue">↑</span> Increase zoom level<br>
<span class="blue">↓</span> Decrease zoom level<br>
<span class="blue">F</span> Toggle display scale: 100% or fit to screen<br>
<span class="blue">Esc</span> Exit image viewer<br>
<br>
Additionally, you can also use the mouse wheel to switch images or control zoom, depending on whether the mouse pointer is over the image:<br>
- When scrolling the mouse wheel over the image, the image will zoom in or out;<br>
- When scrolling the mouse wheel outside the image, it will switch to the next/previous image.`,
    `画像ビューアを使用する際は、以下のショートカットキーが利用できます：<br>
<span class="blue">←</span> 前の画像<br>
<span class="blue">→</span> 次の画像<br>
<span class="blue">↑</span> ズーム倍率を上げる<br>
<span class="blue">↓</span> ズーム倍率を下げる<br>
<span class="blue">F</span> 表示倍率の切り替え：100% または画面に合わせる<br>
<span class="blue">Esc</span> 画像ビューアを終了<br>
<br>
また、マウスホイールでも画像の切り替えやズームの制御が可能です。これはマウスポインタが画像上にあるかどうかによって異なります：<br>
- 画像上でホイールをスクロールすると、画像が拡大または縮小します；<br>
- 画像外でホイールをスクロールすると、画像が切り替わります。`,
    `이미지 뷰어를 사용할 때 다음 단축키를 사용할 수 있습니다:<br>
<span class="blue">←</span> 이전 이미지<br>
<span class="blue">→</span> 다음 이미지<br>
<span class="blue">↑</span> 확대 비율 증가<br>
<span class="blue">↓</span> 축소 비율 감소<br>
<span class="blue">F</span> 표시 비율 전환: 100% 또는 화면에 맞춤<br>
<span class="blue">Esc</span> 이미지 뷰어 종료<br>
<br>
또한 마우스 휠을 사용해 이미지를 전환하거나 확대/축소를 제어할 수도 있습니다. 이는 마우스 포인터가 이미지 위에 있는지에 따라 다릅니다:<br>
- 이미지 위에서 마우스 휠을 스크롤하면 이미지가 확대 또는 축소됩니다;<br>
- 이미지 밖에서 마우스 휠을 스크롤하면 이미지가 전환됩니다.`,
    `При использовании просмотрщика изображений вы можете использовать следующие горячие клавиши:<br>
<span class="blue">←</span> Предыдущее изображение<br>
<span class="blue">→</span> Следующее изображение<br>
<span class="blue">↑</span> Увеличить масштаб<br>
<span class="blue">↓</span> Уменьшить масштаб<br>
<span class="blue">F</span> Переключить масштаб отображения: 100% или по размеру экрана<br>
<span class="blue">Esc</span> Выйти из просмотрщика изображений<br>
<br>
Кроме того, колёсико мыши также можно использовать для переключения изображений или управления масштабом, в зависимости от того, находится ли указатель мыши на изображении:<br>
- При прокрутке колёсика мыши над изображением — изображение увеличивается или уменьшается;<br>
- При прокрутке колёсика мыши вне изображения — происходит переключение изображений.`,
  ],
  _原图: ['原图', '原圖', 'Original', 'Original', '원본', 'Оригинал'],
  _普通: ['普通', '普通', 'Regular', 'Regular', '레귤러', 'Обычный'],
  _小图: ['小图', '小圖', 'Small', 'Small', '스몰', 'Маленький'],
  _方形缩略图: [
    '方形缩略图',
    '方形縮圖',
    'Square thumbnail',
    'Square thumbnail',
    '정사각형 썸네일',
    'Квадратная миниатюра',
  ],
  _导出: ['导出', '匯出', 'Export', 'エクスポート', '내보내기', 'Экспорт'],
  _导入: ['导入', '匯入', 'Import', 'インポート', '불러오기', 'Импорт'],
  _清除: ['清除', '清除', 'Clear', 'クリア', '비우기', 'Очистить'],
  _导入下载记录: [
    '导入下载记录',
    '匯入下載紀錄',
    'Import download record',
    'ダウンロード記録をインポート',
    '다운로드 기록 불러오기',
    'Импорт записи загрузки',
  ],
  _导出下载记录: [
    '导出下载记录',
    '匯出下載紀錄',
    'Export download record',
    'ダウンロード記録のエクスポート',
    '다운로드 기록 내보내기',
    'Экспорт записи загрузки',
  ],
  _数据较多需要花费一些时间: [
    '数据较多，需要花费一些时间',
    '資料較多，需要花費一些時間',
    'A lot of data, it will take some time',
    'データ量が多いので少し時間がかかります',
    '데이터가 많아 시간이 좀 걸립니다',
    'Много данных, это займет некоторое время',
  ],
  _完成: ['完成', '完成', 'Completed', '完了', '완료됨', 'Готово'],
  _日期格式: [
    '日期和时间<span class="key">格式</span>',
    '日期和時間<span class="key">格式</span>',
    'Date and time <span class="key">format</span>',
    '日付と時刻の<span class="key">書式</span>',
    '날짜 및 시간 <span class="key">형식</span>',
    '<span class="key">Формат</span> даты и времени',
  ],
  _日期格式提示: [
    '你可以使用以下标记来设置日期和时间格式。这会影响命名规则里的 <span class="blue">{date}</span> 和 <span class="blue">{upload_date}</span> 和 <span class="blue">{task_date}</span>。<br>对于时间如 2021-04-30T06:40:08',
    '你可以使用以下標記來設定日期和時間格式。這會影響命名規則裡的 <span class="blue">{date}</span> 和 <span class="blue">{upload_date}</span> 和 <span class="blue">{task_date}</span>。<br>對於資料如：2021-04-30T06:40:08。',
    'You can use the following notation to set the date and time format. This will affect <span class="blue">{date}</span> and <span class="blue">{upload_date}</span> and <span class="blue">{task_date}</span> in the naming rules. <br>For time such as 2021-04-30T06:40:08',
    '以下のタグを使用して日時と時刻の書式を設定することができます。 これは命名規則の <span class="blue">{date}</span> と <span class="blue">{upload_date}</span> と <span class="blue">{task_date}</span> に影響します。 <br> 例：2021-04-30T06:40:08',
    '다음 표기법을 사용하여 날짜 및 시간 형식을 설정할 수 있습니다.<br>이것은 명명 규칙에 있는 <span class="blue">{date}</span>와 <span class="blue">{upload_date}</span>와 <span class="blue">{task_date}</span>에 영향을 미칩니다.<br>예: 2021-04-30T06:40:08',
    'Для установки формата даты и времени можно использовать следующую нотацию. Это повлияет на <span class="blue">{date}</span> и <span class="blue">{upload_date}</span> и <span class="blue">{task_date}</span> в правилах именования. <br>Для времени, например, 2021-04-30T06:40:08',
  ],
  _命名标记taskDate: [
    '本次任务抓取完成时的时间。例如：<span class="blue">2020-10-21</span>。',
    '本次工作擷取完成時的時間。例如：<span class="blue">2020-10-21</span>。',
    'The time when the task was crawl completed. For example: <span class="blue">2020-10-21</span>',
    'この作業のクロールが完了した時刻です。 例：<span class="blue">2020-10-21</span>',
    '긁어오기 작업을 완료한 날짜입니다. 예: <span class="blue">2020-10-21</span>',
    'Время, когда задание было выполнено. Например: <span class="blue">2020-10-21</span>',
  ],
  _自动检测: [
    '自动检测',
    '自動偵測',
    'Auto',
    '自動検出',
    '자동',
    'Авто детект',
  ],
  _公开: ['公开', '公開', 'Public', '公開', '공개', 'Публичный'],
  _不公开: ['不公开', '非公開', 'Private', '非公開', '비공개', 'Приватный'],
  _非公开: ['非公开', '非公開', 'Private', '非公開', '비공개', 'Приватный'],
  _已收藏: [
    '已收藏',
    '已收藏',
    'Bookmarked',
    'ブックマークした',
    '북마크됨',
    'В закладках',
  ],
  _已收藏带参数: [
    '已收藏 {}',
    '已收藏 {}',
    'Bookmarked {}',
    'ブックマークした {}',
    '북마크된 {}',
    'В закладках {}',
  ],
  _未收藏: [
    '未收藏',
    '未收藏',
    'Not bookmarked',
    'ブックマークされていない',
    '북마크되지 않음',
    'Не в закладках',
  ],
  _收藏作品: [
    '收藏作品',
    '收藏作品',
    'Bookmark works',
    '作品をブックマークする',
    '북마크 작품',
    'Закладки работают',
  ],
  _下载之后收藏作品: [
    '下载之后<span class="key">收藏</span>作品',
    '下載之後<span class="key">收藏</span>作品',
    '<span class="key">Bookmark</span> works after downloading',
    'ダウンロードした作品を<span class="key">ブックマーク</span>する',
    '다운로드 후 작품 <span class="key">북마크</span>',
    '<span class="key">Закладка</span> работает после загрузки',
  ],
  _下载之后收藏作品的提示: [
    '下载文件之后，自动收藏这个作品。',
    '下載檔案之後，自動收藏這個作品。',
    'After you download a file, the downloader will automatically bookmark the work.',
    'ダウンロード後、作品は自動的にブックマークされます。',
    '파일을 다운로드하면, 자동으로 작품을 북마크합니다.',
    'После загрузки файла загрузчик автоматически делает закладку',
  ],
  _收藏设置: [
    `下载器的<span class="key">收藏</span>功能 (✩)`,
    `下載器的<span class="key">收藏</span>功能 (✩)`,
    `Downloader's <span class="key">bookmark</span> feature (✩)`,
    `ダウンロードツールの<span class="key">ブックマーク</span>機能 (✩)`,
    `다운로더의 <span class="key">북마크</span> 기능 (✩)`,
    `Функция <span class="key">закладок</span> загрузчика (✩)`,
  ],
  _收藏设置的说明: [
    `有时你会看到下载器添加的收藏按钮 (✩)，点击这个按钮可以收藏作品。<br>
    你可以选择是否附带作品的 tags，以及是否公开。<br>
    另外，使用下载器批量收藏作品时也会使用此设置。`,
    `有時你會看到下載器新增的收藏按鈕 (✩)，點選這個按鈕可以收藏作品。<br>
    你可以選擇是否附帶作品的 tags，以及是否公開。<br>
    另外，使用下載器批次收藏作品時也會使用此設定。`,
    `Sometimes you'll see a bookmark button (✩) added by the downloader, which you can click to bookmark the work. <br>
You can choose whether to include tags for the work, and whether to make it public.<br>
This setting is also used when you use the Downloader to bookmark works in batches.`,
    `ダウンロードした作品にはブックマークボタン（✩）が表示されることがあります。このボタンをクリックすると、作品をブックマークできます。<br>
作品にタグを付けるかどうか、また公開するかどうかを選択できます。<br>
この設定は、ダウンローダーを使用して作品を一括でブックマークする場合にも使用されます。`,
    `다운로더에서 북마크 버튼(✩)을 추가하는 경우가 있는데, 이 버튼을 클릭하면 작품을 북마크할 수 있습니다. <br>
작품에 태그를 포함할지 여부와 공개 여부를 선택할 수 있습니다.<br>
이 설정은 다운로더를 사용하여 작품을 일괄적으로 북마크할 때도 사용됩니다.`,
    `Иногда вы увидите кнопку закладки (✩), добавленную загрузчиком, которую вы можете нажать, чтобы добавить работу в закладки. <br>
Вы можете выбрать, следует ли включать теги для работы и следует ли делать ее общедоступной.<br>
Эта настройка также используется при использовании Загрузчика для добавления закладок в пакетном режиме.`,
  ],
  _下载器的收藏按钮默认会添加作品的标签: [
    '点击 <span class="blue">✩</span> 按钮时，下载器会收藏这个作品并且附带它的标签。',
    '點選 <span class="blue">✩</span> 按鈕時，下載器會收藏這個作品並且附帶它的標籤。',
    'When the <span class="blue">✩</span> button is clicked, the downloader bookmarks this work and attaches its tag.',
    '<span class="blue">✩</span> ボタンをクリックすると、ダウンローダはこの作品をブックマークし、タグを付けます。',
    '<span class="blue">✩</span> 버튼을 클릭하면 다운로더는 이 작품을 북마크하고 태그를 붙입니다.',
    'При нажатии кнопки <span class="blue">✩</span> загрузчик добавляет эту работу в закладки и прикрепляет свой тег.',
  ],
  _添加tag: [
    '添加标签',
    '加入標籤',
    'Add tag',
    'タグを追加',
    '태그 추가',
    'Добавить тег',
  ],
  _不添加tag: [
    '不添加标签',
    '不加入標籤',
    "Don't add tag",
    'タグなし',
    '태그 추가하지 않기',
    'Не добавлять тег',
  ],
  _用户阻止名单: [
    '用户<span class="key">阻止</span>名单',
    '使用者<span class="key">阻止</span>名單',
    'User <span class="key">block</span> list',
    '<span class="key">ユーザー</span>ブロックリスト',
    '유저 <span class="key">차단</span> 목록',
    '<span class="key">Блок</span> списка пользователей',
  ],
  _用户阻止名单的说明: [
    `不下载这些用户的作品。需要输入用户 id。<br>
    如果有多个用户 id，使用英文逗号,分割。`,
    `不下載這些使用者的作品。需要輸入使用者 id。<br>
    若有多個使用者 id，使用半形逗號（,）分隔。`,
    `The works of these users will not be downloaded. Need to type the user ID.<br>
    If there are multiple user ID, use comma (,) separated.`,
    `これらのユーザーの作品はダウンロードしません。ユーザー ID が必要です。<br>
    複数のユーザ ID は "," で区切ってください。`,
    `이 유저들의 작품은 다운로드되지 않습니다. 유저 ID를 입력해야 합니다.<br>
    여러 유저 ID가 있는 경우 쉼표(,)로 구분합니다.`,
    `Работы этих пользователей не будут загружаться. Необходимо ввести идентификатор пользователя.<br>
    Если имеется несколько идентификаторов пользователя, используйте разделение запятыми (,).`,
  ],
  _全部: ['全部', '全部', 'All', 'すべて', '전부', 'Все'],
  _任一: ['任一', '任一', 'One', '何れか', '하나만', 'Один'],
  _颜色主题: [
    '颜色<span class="key">主题</span>',
    '色彩<span class="key">主題</span>',
    'Color <span class="key">theme</span>',
    '<span class="key">カラー</span>テーマ',
    '<span class="key">테마</span>',
    'Цветовая <span class="key">тема</span>',
  ],
  _管理设置: [
    '管理<span class="key">设置</span>',
    '管理<span class="key">設定</span>',
    'Manage <span class="key">settings</span>',
    '<span class="key">設定</span>の管理',
    '<span class="key">설정</span> 관리',
    'Изменение <span class="key">настроек</span>',
  ],
  _管理设置的说明: [
    `你可以管理下载器的设置，比如导出以备份设置、分享给别人、重置设置。`,
    `你可以管理下載器的設定，比如匯出以備份設定、分享給別人、重置設定。`,
    `You can manage the Downloader settings, such as exporting to back up your settings, sharing with others, and resetting your settings.`,
    `設定をバックアップするためのエクスポート、他のユーザーとの共有、設定のリセットなど、ダウンローダーの設定を管理できます。`,
    `다운로더 설정을 관리할 수 있습니다. 예를 들어, 설정을 백업하기 위한 내보내기, 다른 사람과 공유하기, 설정을 재설정할 수 있습니다.`,
    `Вы можете управлять настройками Downloader, такими как экспорт для резервного копирования ваших настроек, предоставление общего доступа другим лицам и сброс ваших настроек.`,
  ],
  _导出设置: [
    '导出设置',
    '匯出設定',
    'Export settings',
    'エクスポート設定',
    '내보내기',
    'Настройки экспорта',
  ],
  _导入设置: [
    '导入设置',
    '匯入設定',
    'Import settings',
    'インポート設定',
    '불러오기',
    'Настройки импорта',
  ],
  _重置设置: [
    '重置设置',
    '重設設定',
    'Reset settings',
    'リセット設定',
    '설정 초기화',
    'Сброс настроек',
  ],
  _日均收藏数量: [
    '日均收藏数量',
    '日均收藏數量',
    'Average number of daily bookmarks',
    '1 日の平均ブックマーク数',
    '일일 평균 북마크 수',
    'Среднее количество ежедневных закладок',
  ],
  _日均收藏数量的提示: [
    '你可以设置作品的平均每日收藏数量。满足条件的作品会被下载。',
    '您可以設定作品的平均每日收藏數量。滿足條件的作品會被下載。',
    'You can set the average daily bookmarks number of works. Works that meet the conditions will be downloaded.',
    '作品の 1 日の平均ブックマーク数を設定することができます。条件を満した作品はダウンロードされます。',
    '작품의 일일 평균 북마크 수를 설정할 수 있습니다. 조건을 만족한 작품은 다운로드됩니다.',
    'Вы можете установить среднесуточное количество закладок в работах. Работы, удовлетворяющие условиям, будут загружены.',
  ],
  _获取关注列表失败: [
    `获取关注列表失败`,
    `獲取關注列表失敗`,
    `Failed to retrieve following list`,
    `フォロー一覧の取得に失敗`,
    `팔로우 목록 가져오기 실패`,
    `Не удалось получить список подписок`,
  ],
  _导出关注列表CSV: [
    '导出关注的用户列表（CSV）',
    '匯出關注的使用者列表（CSV）',
    'Export followed users list (CSV)',
    'フォローされているユーザーのリストをエクスポートする（CSV）',
    '팔로우한 사용자 목록 내보내기 (CSV)',
    'Экспорт списка отслеживаемых пользователей (CSV)',
  ],
  _导出关注列表JSON: [
    '导出关注的用户列表（JSON）',
    '匯出關注的使用者列表（JSON）',
    'Export followed users list (JSON)',
    'フォローされているユーザーのリストをエクスポートする（JSON）',
    '팔로우한 사용자 목록 내보내기 (JSON)',
    'Экспорт списка отслеживаемых пользователей (JSON)',
  ],
  _开始抓取用户列表: [
    `开始抓取用户列表`,
    `開始抓取用戶列表`,
    `Start crawling user list`,
    `ユーザーリストのクローリングを開始`,
    `사용자 목록 크롤링 시작`,
    `Начать краулинг списка пользователей`,
  ],
  _用户数量为0: [
    `用户数量为 0`,
    `用戶數量為 0`,
    `Number of users is 0`,
    `ユーザー数 0`,
    `사용자 수 0`,
    `Количество пользователей 0`,
  ],
  _批量关注用户: [
    '批量关注用户（JSON）',
    '批次關注使用者（JSON）',
    'Follow users in batches (JSON)',
    'ユーザーをバッチでフォローする（JSON）',
    '일괄적으로 사용자 팔로우 (JSON)',
    'Подписывайтесь на пользователей пакетами (JSON)',
  ],
  _导入导出关注用户列表的说明: [
    '在你或其他用户的 Following 页面里，你可以导出关注的用户列表，也可以导入列表来批量关注用户。<br>当你有多个帐户时，可以使用这个方法同步你关注的用户列表。你也可以复制其他用户的关注用户列表。',
    '在你或其他使用者的 Following 頁面裡，你可以匯出關注的使用者列表，也可以匯入列表來批次關注使用者。<br>當你有多個帳戶時，可以使用這個方法同步你關注的使用者列表。你也可以複製其他使用者的關注使用者列表。',
    "On the Following page of you or other users, you can export the list of followed users, or import the list to follow users in batches. <br>When you have multiple accounts, you can use this method to synchronize the list of users you follow. You can also copy another user's followed user list.",
    '自分または他のユーザーの [フォロー中] ページで、フォローしているユーザーのリストをエクスポートしたり、ユーザーをフォローするリストをバッチでインポートしたりできます。 <br>複数のアカウントをお持ちの場合、この方法を使用して、フォローしているユーザーのリストを同期できます。 別のユーザーのフォローしているユーザー リストをコピーすることもできます。',
    '본인 또는 다른 사용자의 팔로잉 페이지에서 팔로우한 사용자 목록을 내보내거나 목록을 가져와 사용자를 일괄적으로 팔로우할 수 있습니다. <br>계정이 여러 개인 경우 이 방법을 사용하여 팔로우하는 사용자 목록을 동기화할 수 있습니다. 다른 사용자의 팔로우된 사용자 목록을 복사할 수도 있습니다.',
    'На странице «Отслеживание» вас или других пользователей вы можете экспортировать список отслеживаемых пользователей или импортировать список для подписки на пользователей в пакетном режиме. <br>Если у вас несколько учетных записей, вы можете использовать этот метод для синхронизации списка пользователей, на которых вы подписаны. Вы также можете скопировать список отслеживаемых пользователей другого пользователя.',
  ],
  _手动选择作品: [
    '手动选择作品',
    '手動選擇作品',
    'Manually select',
    '手動で作品を選ぶ',
    '수동 선택',
    'Ручной выбор',
  ],
  _不支持在此页面上手动选择作品: [
    `不支持在此页面上手动选择作品，因为没有合适的目标。`,
    `不支援在此頁面上手動選擇作品，因為沒有合適的目標。`,
    `Manual selection of works is not supported on this page because there is no suitable target.`,
    `このページでは適切な対象がないため、手動で作品を選択することはサポートされていません。`,
    `이 페이지에서는 적합한 대상이 없어 작품을 수동으로 선택할 수 없습니다.`,
    `На этой странице не поддерживается ручной выбор работ, поскольку нет подходящей цели.`,
  ],
  _快捷键ALTS手动选择作品: [
    '你可以使用快捷键 <span class="blue">Alt</span> + <span class="blue">S</span> 开始或暂停手动选择作品。<br>选择完毕之后，打开下载器面板，点击“抓取选择的作品”。',
    '你可以使用快捷鍵 <span class="blue">Alt</span> + <span class="blue">S</span> 開始或暫停手動選擇作品。<br>選擇完畢之後，開啟下載器面板，點選“抓取選擇的作品”。',
    'You can use the shortcut keys <span class="blue">Alt</span> + <span class="blue">S</span> to start or pause manual selection of works.<br>After selecting, open the downloader panel and click "Crawl selected works".',
    'ショートカット キー <span class="blue">Alt</span> + <span class="blue">S</span> を使用して、作品の手動選択を開始または一時停止できます。<br>選択後、ダウンローダパネルを開いて「選ばれた作品をクロール」をクリック。',
    '바로 가기 키 <span class="blue">Alt</span> + <span class="blue">S</span>를 사용하여 작품 수동 선택을 시작하거나 일시 중지할 수 있습니다.<br>선택한 후 다운로더 패널을 열고 "선택된 작품 긁어오기"를 클릭합니다.',
    'Вы можете использовать сочетания клавиш <span class="blue">Alt</span> + <span class="blue">S</span>, чтобы начать или приостановить ручной выбор произведений.<br>После выбора откройте панель загрузчика и нажмите «Стащить выбранные работы».',
  ],
  _抓取选择的作品: [
    '抓取选择的作品',
    '擷取選擇的作品',
    'Crawl selected works',
    '選ばれた作品をクロール',
    '선택된 작품 긁어오기',
    'Стащить выбранные работы',
  ],
  _抓取选择的作品2: [
    '抓取选择的作品 {}',
    '擷取選擇的作品 {}',
    'Crawl selected works {}',
    '選ばれた作品をクロール {}',
    '선택된 작품 긁어오기 {}',
    'Стащить выбранные работы',
  ],
  _清空选择的作品: [
    '清空选择的作品',
    '清空選擇的作品',
    'Clear selected works',
    '選んだ作品をクリアします',
    '선택된 작품 비우기',
    'Очистить выбранные работы',
  ],
  _暂停选择: [
    '暂停选择',
    '暫停選擇',
    'Pause select',
    '選択を一時停止',
    '선택 일시중지',
    'Остановить выбора',
  ],
  _继续选择: [
    '继续选择',
    '繼續選擇',
    'Continue select',
    '選択を続ける',
    '선택 이어하기',
    'Продолжить выбор',
  ],
  _离开页面前提示选择的作品未抓取: [
    '选择的作品尚未抓取。现在离开此页面会导致你选择的作品被清空。',
    '選擇的作品尚未擷取。現在離開此頁面會導致您選擇的作品被清空。',
    'The selected work has not been crawled. Leaving this page now will cause your selected work to be cleared.',
    '選ばれた作品はまだクロールしていません。今このページを離れると、選ばれた作品がクリアされます。',
    '선택된 작품을 아직 긁어오지 않았습니다. 지금 현재 페이지를 떠나면 선택된 작품이 비워집니다.',
    'Выбранная работа не была стащена. Если вы покинете эту страницу, выбранная вами работа будет очищена.',
  ],
  _排除了所有作品类型: [
    '排除了所有作品类型',
    '排除了所有作品類型',
    'Excluded all work types',
    'すべての作品種類を除外しました',
    '모든 작품 유형 제외',
    'Исключены все типы работ',
  ],
  _为多图作品添加一层文件夹: [
    `为<span class="key">多图</span>作品添加一层文件夹`,
    `為<span class="key">多圖</span>作品添加一層資料夾`,
    `Add a folder layer for <span class="key">multi-image</span> works`,
    `<span class="key">複数画像</span>作品に1層のフォルダを追加`,
    `<span class="key">다중 이미지</span> 작품에 한 층의 폴더 추가`,
    `Добавить слой папки для <span class="key">многоизображных</span> работ`,
  ],
  为多图作品添加一层文件夹的帮助: [
    `如果你想仅为多图作品额外创建一层文件夹（并且不为单图作品创建该文件夹），可以启用此设置。<br>
<br>
使用方法：<br>
先在这里设置这层文件夹的规则。注意：在这个设置里，你只需要设置为多图作品额外添加的文件夹。不要在这里填写完整的命名规则。<br>
在设置文件夹规则时，你可以使用命名规则中的标记，也可以加入自定义字符。<br>
默认值 <span class="blue">{pid}</span> 会使用作品 ID 创建这层文件夹。如果你想使用作品标题来创建这层文件夹，就填写 <span class="blue">{title}</span>。
<br>
<br>
然后你需要修改“下载”选项卡里的“图像作品的命名规则”设置，在你想添加这层文件夹的位置插入<span class="blue">/{multi_image_folder}/</span>，它代表了你在这里设置的文件夹规则。<br>
<br>
修改后的“图像作品的命名规则”的示例：<br>
<span class="blue">pixiv/{user}-{user_id}/{multi_image_folder}/{id}-{title}</span><br>
<br>
工作原理：下载器在为多图作品生成文件名时，会将 <span class="blue">{multi_image_folder}</span> 替换为你在这里设置的文件夹规则。<br>`,
    `如果你想僅為多圖作品額外建立一層資料夾（而且不為單圖作品建立這個資料夾），可以啟用此設定。<br>
<br>
使用方法：<br>
先在這裡設定這層資料夾的規則。注意：在這個設定裡，你只需要設定為多圖作品額外添加的資料夾，不要在這裡填寫完整的命名規則。<br>
設定資料夾規則時，你可以使用命名規則中的標記，也可以加入自訂字元。<br>
預設值 <span class="blue">{pid}</span> 會使用作品 ID 建立這層資料夾。如果你想使用作品標題來建立這層資料夾，就填寫 <span class="blue">{title}</span>。<br>
<br>
然後你需要修改 "下載" 分頁裡的 "圖像作品的命名規則" 設定，在你想添加這層資料夾的位置插入<span class="blue">/{multi_image_folder}/</span>，它代表你在這裡設定的資料夾規則。<br>
<br>
修改後的 "圖像作品的命名規則" 範例：<br>
<span class="blue">pixiv/{user}-{user_id}/{multi_image_folder}/{id}-{title}</span><br>
<br>
運作原理：下載器在為多圖作品產生檔名時，會將 <span class="blue">{multi_image_folder}</span> 替換成你在這裡設定的資料夾規則。<br>`,
    `If you want to add an extra folder layer only for multi-image works, and not create this folder for single-image works, you can enable this setting.<br>
<br>
How to use:<br>
First, set the rule for this folder layer here. Note: In this setting, you only need to set the extra folder added for multi-image works. Do not enter the full Naming rule here.<br>
When setting the folder rule, you can use markers from the Naming rule, or add your own custom characters.<br>
The default value <span class="blue">{pid}</span> will create this folder layer using the work ID. If you want to create this folder layer using the work title, enter <span class="blue">{title}</span>.<br>
<br>
Then you need to edit the "Naming rule for image works" setting in the "Download" tab, and insert <span class="blue">/{multi_image_folder}/</span> where you want to add this folder layer. It represents the folder rule you set here.<br>
<br>
Example of the modified "Naming rule for image works":<br>
<span class="blue">pixiv/{user}-{user_id}/{multi_image_folder}/{id}-{title}</span><br>
<br>
How it works: When the downloader generates file names for multi-image works, it will replace <span class="blue">{multi_image_folder}</span> with the folder rule you set here.<br>`,
    `複数画像作品にだけ追加のフォルダ階層を作成し、単一画像作品にはこのフォルダを作成しないようにしたい場合は、この設定を有効にしてください。<br>
<br>
使い方：<br>
まず、ここでこのフォルダ階層の規則を設定します。注意：この設定では、複数画像作品に追加するフォルダだけを設定してください。ここに完全な命名規則を入力しないでください。<br>
フォルダ規則を設定するときは、命名規則内のマーカーを使うことも、任意の文字を追加することもできます。<br>
デフォルト値の <span class="blue">{pid}</span> は、作品 ID を使ってこのフォルダ階層を作成します。作品タイトルを使ってこのフォルダ階層を作成したい場合は、<span class="blue">{title}</span> を入力してください。<br>
<br>
そのあと、"ダウンロード" タブにある "画像作品の命名規則" を変更し、このフォルダ階層を追加したい位置に <span class="blue">/{multi_image_folder}/</span> を挿入してください。これは、ここで設定したフォルダ規則を表します。<br>
<br>
変更後の "画像作品の命名規則" の例：<br>
<span class="blue">pixiv/{user}-{user_id}/{multi_image_folder}/{id}-{title}</span><br>
<br>
仕組み：ダウンローダーが複数画像作品のファイル名を生成するとき、<span class="blue">{multi_image_folder}</span> はここで設定したフォルダ規則に置き換えられます。<br>`,
    `여러 장 이미지 작품에만 폴더를 한 단계 더 만들고, 한 장짜리 작품에는 이 폴더를 만들지 않으려면 이 설정을 켜면 됩니다.<br>
<br>
사용 방법:<br>
먼저 여기에서 이 폴더 단계의 규칙을 설정하세요. 주의: 이 설정에서는 여러 장 이미지 작품에 추가할 폴더만 설정하면 됩니다. 여기에 전체 명명 규칙을 입력하면 안 됩니다.<br>
폴더 규칙을 설정할 때는 명명 규칙의 마커를 사용할 수도 있고, 원하는 문자를 직접 추가할 수도 있습니다.<br>
기본값 <span class="blue">{pid}</span> 는 작품 ID를 사용해 이 폴더 단계를 만듭니다. 작품 제목으로 이 폴더 단계를 만들고 싶다면 <span class="blue">{title}</span> 를 입력하세요.<br>
<br>
그다음 "다운로드" 탭에 있는 "이미지 작품의 명명 규칙" 설정을 수정해서, 이 폴더 단계를 추가하고 싶은 위치에 <span class="blue">/{multi_image_folder}/</span> 를 넣어야 합니다. 이것은 여기에서 설정한 폴더 규칙을 뜻합니다.<br>
<br>
수정한 "이미지 작품의 명명 규칙" 예시:<br>
<span class="blue">pixiv/{user}-{user_id}/{multi_image_folder}/{id}-{title}</span><br>
<br>
동작 방식: 다운로더가 여러 장 이미지 작품의 파일명을 만들 때 <span class="blue">{multi_image_folder}</span> 를 여기에서 설정한 폴더 규칙으로 바꿉니다.<br>`,
    `Если вы хотите добавить дополнительный уровень папки только для работ с несколькими изображениями и не создавать эту папку для работ с одним изображением, включите эту настройку.<br>
<br>
Как использовать:<br>
Сначала задайте здесь правило для этого уровня папки. Внимание: в этой настройке нужно указать только папку, которая будет дополнительно добавляться для работ с несколькими изображениями. Не вводите здесь полное правило названий.<br>
При настройке правила папки можно использовать маркеры из правил названий или добавлять свои символы.<br>
Значение по умолчанию <span class="blue">{pid}</span> создаст этот уровень папки с использованием ID work. Если вы хотите создавать этот уровень папки по названию work, укажите <span class="blue">{title}</span>.<br>
<br>
Затем вам нужно изменить настройку "Правила названий для графических работ" на вкладке "Скачать" и вставить <span class="blue">/{multi_image_folder}/</span> в том месте, где вы хотите добавить этот уровень папки. Это обозначает правило папки, заданное здесь.<br>
<br>
Пример измененного "Правила названий для графических работ":<br>
<span class="blue">pixiv/{user}-{user_id}/{multi_image_folder}/{id}-{title}</span><br>
<br>
Как это работает: когда загрузчик создает имена файлов для работ с несколькими изображениями, он заменяет <span class="blue">{multi_image_folder}</span> на правило папки, которое вы задали здесь.<br>`,
  ],
  _文件夹规则: [
    `文件夹规则`,
    `資料夾規則`,
    `Folder rule`,
    `フォルダ規則`,
    `폴더 규칙`,
    `Правило папки`,
  ],
  _要添加的这层文件夹的规则: [
    `要添加的这层文件夹的规则`,
    `要添加的這層資料夾的規則`,
    `Rule for the folder layer to add`,
    `追加するこのフォルダ階層の規則`,
    `추가할 이 폴더 단계의 규칙`,
    `Правило для этого добавляемого уровня папки`,
  ],
  _文件数量大于: [
    '文件数量 >',
    '檔案數量 >',
    'Number of files >',
    'ファイル数 >',
    '파일 수 >',
    'Количество файлов >',
  ],
  _保存用户头像: [
    '保存用户头像',
    '儲存使用者頭貼',
    'Save user avatar',
    'ユーザーアイコンの保存',
    '유저 프로필 이미지 저장',
    'Сохранить аватар пользователя',
  ],
  _保存用户封面: [
    '保存用户封面',
    '儲存使用者封面',
    'Save user cover',
    'ユーザーカバーの保存',
    '유저 커버 저장',
    'Сохранить обложку пользователя',
  ],
  _抓取进度: [
    `抓取进度`,
    `抓取進度`,
    `Crawling progress`,
    `クローリング進捗`,
    `크롤링 진행`,
    `Прогресс краулинга`,
  ],
  _待处理: [
    '待处理',
    '待處理',
    'Pending',
    '処理待ち',
    '처리 대기',
    'В ожидании',
  ],
  _超出最大页码: [
    '超出最大页码：',
    '超出最大頁碼：',
    'Maximum page number exceeded:',
    '最大ページ数を超えました：',
    '최대 페이지 번호 초과:',
    'Превышен максимальный номер страницы:',
  ],
  _针对特定用户屏蔽tag: [
    '针对特定用户屏蔽<span class="key">标签</span>',
    '針對特定使用者排除<span class="key">標籤</span>',
    'Block <span class="key">tags</span> for specific users',
    '特定のユーザーに対して<span class="key">タグ</span>をブロック',
    '특정 유저에 대한 차단 <span class="key">태그</span>',
    'Блокировать <span class="key">теги</span> для определенных пользователей',
  ],
  _针对特定用户屏蔽tag的提示: [
    '例如，抓取用户 123456 的作品时，排除特定的标签。',
    '例如，抓取使用者 123456 的作品時，排除特定的標籤。',
    'For example, when crawling the works of user 123456, exclude specific tags.',
    'たとえば、ユーザー 123456 の作品をクロールする場合は、特定のタグを除外します。',
    '예를 들어, 사용자 123456의 작품을 크롤링할 때 특정 태그를 제외합니다.',
    'Например, при сканировании работ пользователя 123456 исключите определенные теги.',
  ],
  _展开收起: [
    '展开/收起',
    '展開/摺疊',
    'Expand/Collapse',
    '展開/折りたたみ',
    '확장/축소',
    'Развернуть/Свернуть',
  ],
  _展开: ['展开', '展開', 'Expand', '展開', '확장', 'Развернуть'],
  _收起: ['收起', '摺疊', 'Collapse', '折りたたみ', '축소', 'Свернуть'],
  _为r18作品添加一层文件夹: [
    `为 <span class="key">R-18(G)</span> 作品添加一层文件夹`,
    `為 <span class="key">R-18(G)</span> 作品添加一層資料夾`,
    `Add a folder layer for <span class="key">R-18(G)</span> works`,
    `<span class="key">R-18(G)</span>作品に1層のフォルダを追加`,
    `<span class="key">R-18(G)</span> 작품에 한 층의 폴더 추가`,
    `Добавить слой папки для работ <span class="key">R-18(G)</span>`,
  ],
  _为r18作品添加一层文件夹的帮助: [
    `如果你想为 R-18(G) 作品额外添加一层文件夹，可以启用这个设置。<br>
<br>
使用方法：<br>
先在这里设置这层文件夹的规则。注意：在这个设置里，你只需要设置你想额外添加的这层文件夹。不要在这里填写完整的命名规则。<br>
在设置文件夹规则时，你可以使用命名规则中的标记，也可以加入自定义字符。<br>
<br>
然后你需要修改“下载”选项卡里的“命名规则”设置，在你想添加这层文件夹的位置插入<span class="blue">/{r18_g_folder}/</span>，它代表了你在这里设置的文件夹规则。<br>
<br>
修改后的命名规则的示例：<br>
示例：<span class="blue">pixiv/{user}-{user_id}/{r18_g_folder}/{id}-{title}</span><br>
<br>
工作原理：下载器为 R-18(G) 作品生成文件名时，会把 <span class="blue">{r18_g_folder}</span> 替换为你在这里设置的文件夹规则。<br>
<br>
注意：这个设置会为 R-18 和 R-18G 作品添加相同的文件夹名字。如果你想把 R-18 和 R-18G 作品分开存放，可以关闭这个设置，并在命名规则里使用 <span class="blue">{age_r}/</span> 来建立一层文件夹，它可以区分 R-18 和 R-18G 作品。<br>`,
    `如果你想為 R-18(G) 作品額外添加一層資料夾，可以啟用這個設定。<br>
<br>
使用方法：<br>
先在這裡設定這層資料夾的規則。注意：在這個設定裡，你只需要設定你想額外添加的這層資料夾。不要在這裡填寫完整的命名規則。<br>
設定資料夾規則時，你可以使用命名規則中的標記，也可以加入自訂字元。<br>
<br>
然後你需要修改 "下載" 分頁裡的 "命名規則" 設定，在你想添加這層資料夾的位置插入<span class="blue">/{r18_g_folder}/</span>，它代表你在這裡設定的資料夾規則。<br>
<br>
修改後的命名規則範例：<br>
示例：<span class="blue">pixiv/{user}-{user_id}/{r18_g_folder}/{id}-{title}</span><br>
<br>
運作原理：下載器為 R-18(G) 作品產生檔名時，會將 <span class="blue">{r18_g_folder}</span> 替換成你在這裡設定的資料夾規則。<br>
<br>
注意：這個設定會為 R-18 和 R-18G 作品添加相同的資料夾名稱。如果你想把 R-18 和 R-18G 作品分開存放，可以關閉這個設定，並在命名規則裡使用 <span class="blue">{age_r}/</span> 來建立一層資料夾，它可以區分 R-18 和 R-18G 作品。<br>`,
    `If you want to add an extra folder layer for R-18(G) works, you can enable this setting.<br>
<br>
How to use:<br>
First, set the rule for this folder layer here. Note: In this setting, you only need to set the extra folder layer you want to add. Do not enter the full Naming rule here.<br>
When setting the folder rule, you can use markers from the Naming rule, or add your own custom characters.<br>
<br>
Then you need to edit the "Naming rule" setting in the "Download" tab, and insert <span class="blue">/{r18_g_folder}/</span> where you want to add this folder layer. It represents the folder rule you set here.<br>
<br>
Example of the modified Naming rule:<br>
Example: <span class="blue">pixiv/{user}-{user_id}/{r18_g_folder}/{id}-{title}</span><br>
<br>
How it works: When the downloader generates file names for R-18(G) works, it will replace <span class="blue">{r18_g_folder}</span> with the folder rule you set here.<br>
<br>
Note: This setting will add the same folder name for both R-18 and R-18G works. If you want to store R-18 and R-18G works separately, you can turn off this setting and use <span class="blue">{age_r}/</span> in the Naming rule to create a folder layer. It can distinguish between R-18 and R-18G works.<br>`,
    `R-18(G) 作品用に追加のフォルダ階層を作りたい場合は、この設定を有効にしてください。<br>
<br>
使い方：<br>
まず、ここでこのフォルダ階層の規則を設定します。注意：この設定では、追加したいこのフォルダ階層だけを設定してください。ここに完全な命名規則を入力しないでください。<br>
フォルダ規則を設定するときは、命名規則内のマーカーを使うことも、任意の文字を追加することもできます。<br>
<br>
そのあと、"ダウンロード" タブにある "命名規則" を変更し、このフォルダ階層を追加したい位置に <span class="blue">/{r18_g_folder}/</span> を挿入してください。これは、ここで設定したフォルダ規則を表します。<br>
<br>
変更後の命名規則の例：<br>
例：<span class="blue">pixiv/{user}-{user_id}/{r18_g_folder}/{id}-{title}</span><br>
<br>
仕組み：ダウンローダーが R-18(G) 作品のファイル名を生成するとき、<span class="blue">{r18_g_folder}</span> はここで設定したフォルダ規則に置き換えられます。<br>
<br>
注意：この設定では、R-18 作品と R-18G 作品の両方に同じフォルダ名が追加されます。R-18 作品と R-18G 作品を分けて保存したい場合は、この設定を無効にして、命名規則で <span class="blue">{age_r}/</span> を使ってフォルダ階層を作成してください。これにより、R-18 作品と R-18G 作品を区別できます。<br>`,
    `R-18(G) 작품에 폴더를 한 단계 더 추가하고 싶다면 이 설정을 켜면 됩니다.<br>
<br>
사용 방법:<br>
먼저 여기에서 이 폴더 단계의 규칙을 설정하세요. 주의: 이 설정에서는 추가하고 싶은 이 폴더 단계만 설정하면 됩니다. 여기에 전체 명명 규칙을 입력하면 안 됩니다.<br>
폴더 규칙을 설정할 때는 명명 규칙의 마커를 사용할 수도 있고, 원하는 문자를 직접 추가할 수도 있습니다.<br>
<br>
그다음 "다운로드" 탭에 있는 "명명 규칙" 설정을 수정해서, 이 폴더 단계를 추가하고 싶은 위치에 <span class="blue">/{r18_g_folder}/</span> 를 넣어야 합니다. 이것은 여기에서 설정한 폴더 규칙을 뜻합니다.<br>
<br>
수정한 명명 규칙 예시:<br>
예시: <span class="blue">pixiv/{user}-{user_id}/{r18_g_folder}/{id}-{title}</span><br>
<br>
동작 방식: 다운로더가 R-18(G) 작품의 파일명을 만들 때 <span class="blue">{r18_g_folder}</span> 를 여기에서 설정한 폴더 규칙으로 바꿉니다.<br>
<br>
주의: 이 설정은 R-18 작품과 R-18G 작품 모두에 같은 폴더 이름을 추가합니다. R-18 작품과 R-18G 작품을 따로 저장하고 싶다면 이 설정을 끄고, 명명 규칙에서 <span class="blue">{age_r}/</span> 를 사용해 폴더 단계를 만들면 됩니다. 이것으로 R-18 작품과 R-18G 작품을 구분할 수 있습니다.<br>`,
    `Если вы хотите добавить дополнительный уровень папки для работ R-18(G), включите эту настройку.<br>
<br>
Как использовать:<br>
Сначала задайте здесь правило для этого уровня папки. Внимание: в этой настройке нужно указать только тот дополнительный уровень папки, который вы хотите добавить. Не вводите здесь полное правило названий.<br>
При настройке правила папки можно использовать маркеры из правил названий или добавлять свои символы.<br>
<br>
Затем вам нужно изменить настройку "Правила названий" на вкладке "Скачать" и вставить <span class="blue">/{r18_g_folder}/</span> в том месте, где вы хотите добавить этот уровень папки. Это обозначает правило папки, заданное здесь.<br>
<br>
Пример измененного правила названий:<br>
Пример: <span class="blue">pixiv/{user}-{user_id}/{r18_g_folder}/{id}-{title}</span><br>
<br>
Как это работает: когда загрузчик создает имена файлов для работ R-18(G), он заменяет <span class="blue">{r18_g_folder}</span> на правило папки, которое вы задали здесь.<br>
<br>
Внимание: эта настройка добавляет одинаковое имя папки и для работ R-18, и для работ R-18G. Если вы хотите хранить работы R-18 и R-18G отдельно, отключите эту настройку и используйте <span class="blue">{age_r}/</span> в правилах названий, чтобы создать уровень папки. Он позволяет различать работы R-18 и R-18G.<br>`,
  ],
  _必填项不能为空: [
    '必填项不能为空',
    '必填項不能為空',
    'Required fields cannot be empty',
    '必須フィールドが入力されていません',
    '필수 입력 항목은 비워둘 수 없습니다',
    'Обязательные поля не могут быть пустыми',
  ],
  _用户ID必须是数字: [
    '用户 ID 必须是数字',
    '使用者 ID 必須是數字',
    'User ID must be a number',
    'ユーザー ID は数字です',
    '유저 ID는 숫자만 허용합니다',
    'Идентификатор пользователя должен быть числом',
  ],
  _必须是数字: [
    '必须是数字',
    '必須是數字',
    'Number',
    '数字でなければなりません',
    '숫자만 허용',
    'Число',
  ],
  _tag用逗号分割: [
    '多个标签使用英文逗号,分割',
    '多個標籤使用半形逗號（,）分隔',
    'Multiple tags use comma (,) split',
    '複数のタグはカンマ「,」で区切ってください',
    '여러 태그는 쉼표(,)로 구분합니다.',
    'Для нескольких тегов используется разделение запятой (,)',
  ],
  _添加: ['添加', '新增', 'Add', '追加', '추가', 'Добавить'],
  _取消: ['取消', '取消', 'Cancel', 'キャンセル', '취소', 'Отмена'],
  _更新: ['更新', '更新', 'Update', '更新', '업데이트', 'Обновить'],
  _删除: ['删除', '刪除', 'Delete', '削除', '제거', 'Удалить'],
  _添加成功: [
    '添加成功',
    '新增成功',
    'Added successfully',
    '追加されました',
    '성공적으로 추가되었습니다.',
    'Добавлено успешно',
  ],
  _更新成功: [
    '更新成功',
    '更新成功',
    'update completed',
    '更新成功',
    '업데이트에 성공하였습니다.',
    'обновление завершено',
  ],
  _在作品缩略图上显示放大按钮: [
    '在作品缩略图上显示<span class="key">放大</span>按钮',
    '在作品縮圖上顯示<span class="key">放大</span>按鈕',
    'Show <span class="key">zoom</span> button on thumbnail',
    '作品のサムネイルに<span class="key">拡大</span>ボタンを表示',
    '썸네일에 <span class="key">확대</span> 버튼 표시',
    'Показать кнопку <span class="key">увеличить</span> на миниатюре',
  ],
  _在作品缩略图上显示下载按钮: [
    '在作品缩略图上显示<span class="key">下载</span>按钮',
    '在作品縮圖上顯示<span class="key">下載</span>按鈕',
    'Show <span class="key">download</span> button on thumbnail',
    '作品のサムネイルに<span class="key">ダウンロード</span>ボタンを表示',
    '썸네일에 <span class="key">다운로드</span> 버튼 표시',
    'Показать кнопку <span class="key">загрузить</span> на миниатюре',
  ],
  _已发送下载请求: [
    '已发送下载请求',
    '已傳送下載請求',
    'Download request sent',
    'ダウンロードリクエストを送信しました',
    '다운로드 요청 전송',
    'Запрос на скачивание отправлен',
  ],
  _下载器正忙这次请求已开始排队: [
    '下载器正忙，这次请求已开始排队',
    '下載器正忙，這次請求已開始排隊',
    'The downloader is busy and this request has been queued',
    'このリクエストはキューに入れられ始めました',
    '이번에는 요청이 대기되기 시작했습니다.',
    'На этот раз запрос начал помещаться в очередь.',
  ],
  _HowToUse: [
    `点击网页右侧的蓝色按钮可以打开下载器面板。
    <br><br>
    下载的文件保存在浏览器的下载目录里。如果你想保存到其他位置，需要修改浏览器的下载目录。
    <br><br>
    <strong>建议您在浏览器的下载设置中关闭“下载前询问每个文件的保存位置”，否则保存每个文件时都会显示另存为对话框。</strong>
    <br><br>
    下载器默认启用了一些增强功能，这可能会导致 Pixiv 的一些页面样式产生变化。你可以在下载器的“更多”标签页里启用或关闭这些功能。
    <br><br>
    下载器的 Wiki：<a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `點擊網頁右側的藍色按鈕可以打開下載器面板。
    <br><br>
    下載的文件保存在瀏覽器的下載目錄裡。如果您想保存到其他位置，需要修改瀏覽器的下載目錄。
    <br><br>
    <strong>建議您在瀏覽器的下載設置中關閉“下載前詢問每個文件的保存位置”，否則保存每個文件時都會顯示另存為對話框。</strong>
    <br><br>
    下載器默認開啟了一些增強功能，這可能會導致 Pixiv 的一些頁面樣式產生變化。您可以在下載器的“更多”標籤頁中啟用或關閉這些功能。
    <br><br>
    下載器的 Wiki：<a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `Click the blue button on the right side of the webpage to open the downloader panel.
    <br><br>
    Downloaded files are saved in the browser's download directory. If you want to save them to another location, you need to change the browser's download directory.
    <br><br>
    <strong>It is recommended to disable "Ask where to save each file before downloading" in the browser's download settings, otherwise a save-as dialog will appear for each file.</strong>
    <br><br>
    The downloader enables some enhanced features by default, which may cause changes to the style of some Pixiv pages. You can enable or disable these features in the "More" tab of the downloader.
    <br><br>
    Downloader Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `ウェブページの右側にある青いボタンをクリックすると、ダウンローダーパネルが開きます。
    <br><br>
    ダウンロードしたファイルはブラウザのダウンロードディレクトリに保存されます。別の場所に保存したい場合は、ブラウザのダウンロードディレクトリを変更する必要があります。
    <br><br>
    <strong>ブラウザのダウンロード設定で「ダウンロード前に各ファイルの保存場所を確認する」をオフにすることをお勧めします。そうしないと、ファイルを保存するたびに「名前を付けて保存」ダイアログが表示されます。</strong>
    <br><br>
    ダウンローダーはデフォルトでいくつかの拡張機能を有効にしており、これによりPixivの一部のページのスタイルが変更されることがあります。これらの機能は、ダウンローダーの「その他」タブで有効または無効にできます。
    <br><br>
    ダウンローダーのWiki：<a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `웹페이지 오른쪽의 파란색 버튼을 클릭하면 다운로더 패널이 열립니다.
    <br><br>
    다운로드한 파일은 브라우저의 다운로드 디렉토리에 저장됩니다. 다른 위치에 저장하려면 브라우저의 다운로드 디렉토리를 변경해야 합니다.
    <br><br>
    <strong>브라우저의 다운로드 설정에서 "다운로드 전에 각 파일의 저장 위치를 묻기"를 비활성화하는 것이 좋습니다. 그렇지 않으면 파일을 저장할 때마다 "다른 이름으로 저장" 대화 상자가 나타납니다.</strong>
    <br><br>
    다운로더는 기본적으로 몇 가지 향상된 기능을 활성화하며, 이로 인해 Pixiv의 일부 페이지 스타일이 변경될 수 있습니다. 이러한 기능은 다운로더의 "더보기" 탭에서 활성화하거나 비활성화할 수 있습니다.
    <br><br>
    다운로더 위키: <a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `Нажмите на синюю кнопку справа на веб-странице, чтобы открыть панель загрузчика.
    <br><br>
    Загруженные файлы сохраняются в папке загрузок браузера. Если вы хотите сохранить их в другое место, необходимо изменить папку загрузок в настройках браузера.
    <br><br>
    <strong>Рекомендуется отключить в настройках загрузки браузера опцию "Запрашивать место сохранения каждого файла перед загрузкой", иначе при сохранении каждого файла будет отображаться диалог "Сохранить как".</strong>
    <br><br>
    Загрузчик по умолчанию включает некоторые расширенные функции, которые могут привести к изменению стиля некоторых страниц Pixiv. Вы можете включать или отключать эти функции на вкладке "Ещё" в загрузчике.
    <br><br>
    Вики загрузчика: <a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,
  ],
  _我知道了: ['我知道了', '我知道了', 'OK', '分かりました', '확인', 'Ок'],
  _背景图片: [
    '<span class="key">背景</span>图片',
    '<span class="key">背景</span>圖片',
    '<span class="key">Background</span> image',
    '<span class="key">背景</span>画像',
    '<span class="key">배경</span> 이미지',
    '<span class="key">Фоновое</span> изображение',
  ],
  _背景图片的说明: [
    `你可以选择一张本地图片作为下载器的背景图片。`,
    `你可以選擇一張本地圖片作為下載器的背景圖片。`,
    `You can select a local image as the background image of the downloader.`,
    `ダウンローダーの背景画像としてローカル画像を選択できます。`,
    `다운로더의 배경 이미지로 로컬 이미지를 선택할 수 있습니다.`,
    `Вы можете выбрать локальное изображение в качестве фонового изображения загрузчика.`,
  ],
  _选择文件: [
    '选择文件',
    '選擇檔案',
    'Select a file',
    'ファイルを選択',
    '파일 선택',
    'Выберите файл',
  ],
  _不透明度: [
    '不透明度',
    '不透明度',
    'Opacity',
    '不透明度',
    '투명도',
    'Непрозрачность',
  ],
  _对齐方式: [
    '对齐方式',
    '對齊方式',
    'Alignment',
    '揃え方式',
    '정렬',
    'Выравнивание',
  ],
  _顶部: ['顶部', '頂部', 'top', '上揃え', '상단', 'топ'],
  _居中: ['居中', '居中', 'center', '中央揃え', '중앙', 'центр'],
  _使用第一个匹配的标签建立文件夹: [
    '使用第一个匹配的<span class="key">标签</span>建立文件夹',
    '使用第一個符合的<span class="key">標籤</span>建立資料夾',
    'Create a folder with the first matched <span class="key">tag</span>',
    '最初の一致する<span class="key">タグ</span>にフォルダを作成',
    '첫 번째 일치하는 <span class="key">태그</span>로 디렉토리 생성',
    'Создать папку с первым совпавшим <span class="key">тегом</span>',
  ],
  _使用第一个匹配的标签建立文件夹的说明: [
    `如果作品含有你设置的标签，就使用它来建立一层文件夹。<br>
<br>
使用方法：<br>
首先在这个设置里输入目标标签，如果有多个标签，使用英语逗号 <span class="blue">,</span> 分割。<br>
你可以设置 2 个标签列表：<span class="blue">{match_tag_folder1}</span> 和 <span class="blue">{match_tag_folder2}</span>。这是为了处理一个常见的需求：如果一个角色属于某个作品，就建立两层文件夹：第一层是作品名字，第二层是角色名字。例如我在 <span class="blue">{match_tag_folder1}</span> 里设置作品名字 <span class="blue">GenshinImpact</span>，并在 <span class="blue">{match_tag_folder2}</span> 里设置角色名字 <span class="blue">フリーナ</span>。如果一个作品同时含有这两个标签，下载器就可以为这个作品添加两层文件夹：<span class="blue">GenshinImpact/フリーナ/</span>。<br>
当然，如果你没有这个需求的话，可以只使用第一个标签列表。<br>
<br>
在你设置标签列表之后，还需要修改"下载"选项卡里的"命名规则"设置，在需要的地方插入特定标记和斜线来添加一层文件夹。<span class="blue">/{match_tag_folder1}/</span>代表第一个标签列表的匹配结果，<span class="blue">/{match_tag_folder2}/</span>代表第二个标签列表的匹配结果。<br>
示例：<span class="blue">pixiv/{match_tag_folder1}/{match_tag_folder2}/{id}</span><br>
<br>
使用标签别名来统一文件夹名字：<br>
有些标签有多种变体，例如 <span class="blue">GenshinImpact</span> 有这些变体：<span class="blue">GenshinImpact,Genshin Impact,Genshin,原神,原神インパクト</span>。如果你想把这些标签都视为 <span class="blue">GenshinImpact</span>，并且只建立 <span class="blue">GenshinImpact</span> 文件夹（而不是使用变体来建立多个不同的文件夹），就可以使用该设置下方的"标签别名"功能。<br>
把这些变体的别名设置为 <span class="blue">GenshinImpact</span>，然后在这个设置里只需要使用 <span class="blue">GenshinImpact</span> 即可匹配到所有变体。<br>
<br>
匹配方式：<br>
下载器会在作品的标签列表里查找你设置的标签，并且会优先使用标签别名。<br>
匹配模式是完全一致，不区分大小写。如果你设置了 <span class="blue">A</span>，可以匹配到 <span class="blue">a</span> 或者 <span class="blue">A</span>，但不会匹配到 <span class="blue">abc</span>。<br>
对于你设置的每个标签列表，下载器都会按顺序查找：先查找你设置的第一个标签，如果找不到就查找第二个，以此类推。一旦找到第一个匹配的标签，就停止查找，并用它替换命名规则中的对应标记：<span class="blue">{match_tag_folder1}</span> 或 <span class="blue">{match_tag_folder2}</span>。<br>
如果没有匹配到你设置的标签，下载器会忽略对应的标记。<br>`,
    `如果作品含有你設定的標籤，就使用它來建立一層資料夾。<br>
<br>
使用方法：<br>
首先在這個設定裡輸入目標標籤，如果有多個標籤，使用英語逗號 <span class="blue">,</span> 分割。<br>
你可以設定 2 個標籤列表：<span class="blue">{match_tag_folder1}</span> 和 <span class="blue">{match_tag_folder2}</span>。這是為了處理一個常見的需求：如果一個角色屬於某個作品，就建立兩層資料夾：第一層是作品名字，第二層是角色名字。例如我在 <span class="blue">{match_tag_folder1}</span> 裡設定作品名字 <span class="blue">GenshinImpact</span>，並在 <span class="blue">{match_tag_folder2}</span> 裡設定角色名字 <span class="blue">フリーナ</span>。如果一個作品同時含有這兩個標籤，下載器就可以為這個作品添加兩層資料夾：<span class="blue">GenshinImpact/フリーナ/</span>。<br>
當然，如果你沒有這個需求的話，可以只使用第一個標籤列表。<br>
<br>
在你設定標籤列表之後，還需要修改「下載」選項卡裡的「命名規則」設定，在需要的地方插入特定標記和斜線來添加一層資料夾。<span class="blue">/{match_tag_folder1}/</span>代表第一個標籤列表的匹配結果，<span class="blue">/{match_tag_folder2}/</span>代表第二個標籤列表的匹配結果。<br>
示例：<span class="blue">pixiv/{match_tag_folder1}/{match_tag_folder2}/{id}</span><br>
<br>
使用標籤別名來統一資料夾名字：<br>
有些標籤有多種變體，例如 <span class="blue">GenshinImpact</span> 有這些變體：<span class="blue">GenshinImpact,Genshin Impact,Genshin,原神,原神インパクト</span>。如果你想把這些標籤都視為 <span class="blue">GenshinImpact</span>，並且只建立 <span class="blue">GenshinImpact</span> 資料夾（而不是使用變體來建立多個不同的資料夾），就可以使用該設定下方的「標籤別名」功能。<br>
把這些變體的別名設定為 <span class="blue">GenshinImpact</span>，然後在這個設定裡只需要使用 <span class="blue">GenshinImpact</span> 即可匹配到所有變體。<br>
<br>
匹配方式：<br>
下載器會在作品的標籤列表裡查找你設定的標籤，並且會優先使用標籤別名。<br>
匹配模式是完全一致，不區分大小寫。如果你設定了 <span class="blue">A</span>，可以匹配到 <span class="blue">a</span> 或者 <span class="blue">A</span>，但不會匹配到 <span class="blue">abc</span>。<br>
對於你設定的每個標籤列表，下載器都會按順序查找：先查找你設定的第一個標籤，如果找不到就查找第二個，以此類推。一旦找到第一個匹配的標籤，就停止查找，並用它替換命名規則中的對應標記：<span class="blue">{match_tag_folder1}</span> 或 <span class="blue">{match_tag_folder2}</span>。<br>
如果沒有匹配到你設定的標籤，下載器會忽略對應的標記。<br>`,
    `If a work contains a tag you have set, that tag will be used to create a folder.<br>
<br>
How to use:<br>
First, enter the target tags in this setting. If there are multiple tags, separate them with a comma <span class="blue">,</span>.<br>
You can set up 2 tag lists: <span class="blue">{match_tag_folder1}</span> and <span class="blue">{match_tag_folder2}</span>. This is designed for a common use case: if a character belongs to a certain work, create two levels of folders — the first for the work name and the second for the character name. For example, set the work name <span class="blue">GenshinImpact</span> in <span class="blue">{match_tag_folder1}</span> and the character name <span class="blue">フリーナ</span> in <span class="blue">{match_tag_folder2}</span>. If a work contains both tags, the downloader will add two folder levels for it: <span class="blue">GenshinImpact/フリーナ/</span>.<br>
Of course, if you don't need this, you can just use the first tag list.<br>
<br>
After setting up your tag lists, you also need to update the "Naming rule" in the "Download" tab. Insert the specific tokens and slashes where needed to add a folder level. <span class="blue">/{match_tag_folder1}/</span> represents the match result of the first tag list, and <span class="blue">/{match_tag_folder2}/</span> represents the match result of the second tag list.<br>
Example: <span class="blue">pixiv/{match_tag_folder1}/{match_tag_folder2}/{id}</span><br>
<br>
Using tag aliases to unify folder names:<br>
Some tags have multiple variants. For example, <span class="blue">GenshinImpact</span> has these variants: <span class="blue">GenshinImpact,Genshin Impact,Genshin,原神,原神インパクト</span>. If you want to treat all these tags as <span class="blue">GenshinImpact</span> and only create a <span class="blue">GenshinImpact</span> folder (instead of creating multiple different folders using the variants), you can use the "Tag alias" feature below this setting.<br>
Set the alias of these variants to <span class="blue">GenshinImpact</span>, and then you only need to use <span class="blue">GenshinImpact</span> in this setting to match all variants.<br>
<br>
How matching works:<br>
The downloader searches for your set tags in the work's tag list, with tag aliases taking priority.<br>
Matching is exact and case-insensitive. If you set <span class="blue">A</span>, it will match <span class="blue">a</span> or <span class="blue">A</span>, but not <span class="blue">abc</span>.<br>
For each tag list you set, the downloader searches in order: it looks for the first tag first, and if not found, moves to the second, and so on. Once the first matching tag is found, the search stops, and it replaces the corresponding token in the naming rule: <span class="blue">{match_tag_folder1}</span> or <span class="blue">{match_tag_folder2}</span>.<br>
If none of your set tags are matched, the downloader will ignore the corresponding token.<br>`,
    `作品に設定したタグが含まれている場合、そのタグを使ってフォルダーを 1 階層作成します。<br>
<br>
使い方：<br>
まずこの設定に対象のタグを入力してください。複数のタグがある場合は英語のカンマ <span class="blue">,</span> で区切ります。<br>
タグリストは 2 つ設定できます：<span class="blue">{match_tag_folder1}</span> と <span class="blue">{match_tag_folder2}</span>。これはよくある使い方に対応しています。あるキャラクターが特定の作品に属している場合、2 階層のフォルダーを作成します。1 階層目が作品名、2 階層目がキャラクター名です。例えば <span class="blue">{match_tag_folder1}</span> に作品名 <span class="blue">GenshinImpact</span> を設定し、<span class="blue">{match_tag_folder2}</span> にキャラクター名 <span class="blue">フリーナ</span> を設定します。work に両方のタグが含まれている場合、ダウンローダーはその work に 2 階層のフォルダーを追加します：<span class="blue">GenshinImpact/フリーナ/</span>。<br>
もちろん、この用途が不要であれば最初のタグリストだけを使えばかまいません。<br>
<br>
タグリストを設定したら、「ダウンロード」タブの「命名ルール」設定も変更する必要があります。フォルダーを追加したい場所に特定のトークンとスラッシュを挿入してください。<span class="blue">/{match_tag_folder1}/</span> は最初のタグリストのマッチ結果を表し、<span class="blue">/{match_tag_folder2}/</span> は 2 番目のタグリストのマッチ結果を表します。<br>
例：<span class="blue">pixiv/{match_tag_folder1}/{match_tag_folder2}/{id}</span><br>
<br>
タグの別名を使ってフォルダー名を統一する：<br>
タグには複数の表記ゆれがある場合があります。例えば <span class="blue">GenshinImpact</span> にはこのような表記ゆれがあります：<span class="blue">GenshinImpact,Genshin Impact,Genshin,原神,原神インパクト</span>。これらをすべて <span class="blue">GenshinImpact</span> として扱い、<span class="blue">GenshinImpact</span> フォルダーのみを作成したい（表記ゆれごとに別々のフォルダーを作りたくない）場合は、この設定の下にある「タグの別名」機能を使えます。<br>
これらの表記ゆれの別名を <span class="blue">GenshinImpact</span> に設定すれば、この設定では <span class="blue">GenshinImpact</span> だけを使ってすべての表記ゆれにマッチさせることができます。<br>
<br>
マッチ方式：<br>
ダウンローダーは work のタグリストの中から設定したタグを検索します。タグの別名が優先して使用されます。<br>
マッチモードは完全一致で、大文字と小文字は区別しません。<span class="blue">A</span> を設定した場合、<span class="blue">a</span> や <span class="blue">A</span> にはマッチしますが、<span class="blue">abc</span> にはマッチしません。<br>
設定した各タグリストに対して、ダウンローダーは順番に検索します。最初のタグから検索し、見つからなければ次のタグを検索します。最初にマッチしたタグが見つかった時点で検索を止め、命名ルール内の対応するトークン（<span class="blue">{match_tag_folder1}</span> または <span class="blue">{match_tag_folder2}</span>）をそのタグで置き換えます。<br>
設定したタグがひとつもマッチしなかった場合、ダウンローダーは対応するトークンを無視します。<br>`,
    `작품에 설정한 태그가 포함되어 있으면 해당 태그를 사용해 폴더를 한 단계 만듭니다.<br>
<br>
사용 방법：<br>
먼저 이 설정에 대상 태그를 입력하세요. 태그가 여러 개라면 영어 쉼표 <span class="blue">,</span> 로 구분합니다.<br>
태그 목록을 2개 설정할 수 있습니다：<span class="blue">{match_tag_folder1}</span> 과 <span class="blue">{match_tag_folder2}</span>. 이것은 흔한 요구사항을 처리하기 위한 것입니다. 어떤 캐릭터가 특정 작품에 속할 경우 폴더를 두 단계로 만듭니다. 첫 번째 단계는 작품 이름, 두 번째 단계는 캐릭터 이름입니다. 예를 들어 <span class="blue">{match_tag_folder1}</span> 에 작품 이름 <span class="blue">GenshinImpact</span> 를 설정하고, <span class="blue">{match_tag_folder2}</span> 에 캐릭터 이름 <span class="blue">フリーナ</span> 를 설정합니다. 작품에 두 태그가 모두 포함되어 있으면 다운로더가 해당 작품에 두 단계 폴더를 추가합니다：<span class="blue">GenshinImpact/フリーナ/</span>.<br>
물론 이런 요구사항이 없다면 첫 번째 태그 목록만 사용해도 됩니다.<br>
<br>
태그 목록을 설정한 후에는 "다운로드" 탭의 "명명 규칙" 설정도 수정해야 합니다. 폴더를 추가하고 싶은 위치에 특정 토큰과 슬래시를 삽입하세요. <span class="blue">/{match_tag_folder1}/</span> 는 첫 번째 태그 목록의 매칭 결과를 나타내고, <span class="blue">/{match_tag_folder2}/</span> 는 두 번째 태그 목록의 매칭 결과를 나타냅니다.<br>
예시：<span class="blue">pixiv/{match_tag_folder1}/{match_tag_folder2}/{id}</span><br>
<br>
태그 별칭으로 폴더 이름 통일하기：<br>
일부 태그에는 여러 변형이 있습니다. 예를 들어 <span class="blue">GenshinImpact</span> 에는 이런 변형들이 있습니다：<span class="blue">GenshinImpact,Genshin Impact,Genshin,原神,原神インパクト</span>. 이 태그들을 모두 <span class="blue">GenshinImpact</span> 로 취급하고 <span class="blue">GenshinImpact</span> 폴더만 만들고 싶다면（변형마다 다른 폴더를 만들지 않으려면）이 설정 아래의 "태그 별칭" 기능을 사용할 수 있습니다.<br>
이 변형들의 별칭을 <span class="blue">GenshinImpact</span> 로 설정하면 이 설정에서 <span class="blue">GenshinImpact</span> 만 사용해도 모든 변형에 매칭됩니다.<br>
<br>
매칭 방식：<br>
다운로더는 작품의 태그 목록에서 설정한 태그를 검색하며, 태그 별칭을 우선적으로 사용합니다.<br>
매칭 방식은 완전 일치이며 대소문자를 구분하지 않습니다. <span class="blue">A</span> 를 설정하면 <span class="blue">a</span> 나 <span class="blue">A</span> 에는 매칭되지만 <span class="blue">abc</span> 에는 매칭되지 않습니다.<br>
설정한 각 태그 목록에 대해 다운로더는 순서대로 검색합니다. 첫 번째 태그부터 검색하고 찾지 못하면 두 번째 태그를 검색하는 식입니다. 처음으로 매칭되는 태그를 찾으면 검색을 멈추고 명명 규칙의 해당 토큰(<span class="blue">{match_tag_folder1}</span> 또는 <span class="blue">{match_tag_folder2}</span>)을 그 태그로 교체합니다.<br>
설정한 태그가 하나도 매칭되지 않으면 다운로더는 해당 토큰을 무시합니다.<br>`,
    `Если work содержит заданный вами тег, он будет использован для создания папки.<br>
<br>
Как использовать:<br>
Сначала введите нужные теги в этой настройке. Если тегов несколько, разделите их английской запятой <span class="blue">,</span>.<br>
Можно задать 2 списка тегов: <span class="blue">{match_tag_folder1}</span> и <span class="blue">{match_tag_folder2}</span>. Это сделано для удобного решения распространённой задачи: если персонаж принадлежит определённому произведению, создайте два уровня папок — первый для названия произведения, второй для имени персонажа. Например, задайте название произведения <span class="blue">GenshinImpact</span> в <span class="blue">{match_tag_folder1}</span>, а имя персонажа <span class="blue">フリーナ</span> — в <span class="blue">{match_tag_folder2}</span>. Если work содержит оба тега, загрузчик добавит для неё два уровня папок: <span class="blue">GenshinImpact/フリーナ/</span>.<br>
Конечно, если такой необходимости нет, можно использовать только первый список тегов.<br>
<br>
После настройки списков тегов нужно также изменить "Правило именования" на вкладке "Загрузка": вставьте нужные токены и слэши туда, где требуется добавить папку. <span class="blue">/{match_tag_folder1}/</span> обозначает результат совпадения первого списка тегов, <span class="blue">/{match_tag_folder2}/</span> — второго.<br>
Пример: <span class="blue">pixiv/{match_tag_folder1}/{match_tag_folder2}/{id}</span><br>
<br>
Использование псевдонимов тегов для единообразия имён папок:<br>
У некоторых тегов есть несколько вариантов написания. Например, у <span class="blue">GenshinImpact</span> есть такие варианты: <span class="blue">GenshinImpact,Genshin Impact,Genshin,原神,原神インパクト</span>. Если вы хотите считать все эти теги одним тегом <span class="blue">GenshinImpact</span> и создавать только папку <span class="blue">GenshinImpact</span> (а не отдельные папки для каждого варианта), воспользуйтесь функцией "Псевдоним тега" ниже этой настройки.<br>
Задайте псевдоним для этих вариантов как <span class="blue">GenshinImpact</span>, и тогда в этой настройке достаточно использовать только <span class="blue">GenshinImpact</span>, чтобы сопоставить все варианты.<br>
<br>
Принцип совпадения:<br>
Загрузчик ищет заданные вами теги в списке тегов work, при этом псевдонимы тегов имеют приоритет.<br>
Совпадение точное, без учёта регистра. Если вы задали <span class="blue">A</span>, совпадут <span class="blue">a</span> и <span class="blue">A</span>, но не <span class="blue">abc</span>.<br>
Для каждого заданного списка тегов загрузчик ищет по порядку: сначала первый тег, если не найден — второй, и так далее. Как только найдено первое совпадение, поиск останавливается, и соответствующий токен в правиле именования (<span class="blue">{match_tag_folder1}</span> или <span class="blue">{match_tag_folder2}</span>) заменяется найденным тегом.<br>
Если ни один из заданных тегов не совпал, загрузчик игнорирует соответствующий токен.<br>`,
  ],
  _全年龄: [
    '全年龄',
    '全年齡',
    'All ages',
    '全年齢',
    '전체 연령',
    'Все возраста',
  ],
  _没有符合条件的结果: [
    '没有符合条件的结果',
    '沒有符合條件的結果',
    'There are no eligible results',
    '対象となる結果はありません',
    '조건에 부합하는 결과가 없습니다',
    'Нет результатов, отвечающих требованиям',
  ],
  _收藏: ['收藏', '收藏', 'Bookmark', 'ブックマーク', '북마크', 'Закладка'],
  _已加入收藏: [
    '已加入收藏',
    '已加入收藏',
    'Bookmarked',
    'ブックマークした',
    '북마크됨',
    'В закладках',
  ],
  _全屏查看: [
    '全屏',
    '全螢幕',
    'Full screen view',
    '全画面表示',
    '전체 화면 보기',
    'Просмотр на весь экран',
  ],
  _抓取id区间: [
    '抓取 ID 区间',
    '擷取 ID 區間',
    'Crawl ID range',
    'ID 範囲をクロール',
    'ID 범위 긁어오기',
    'Стащить диапазон идентификаторов',
  ],
  _抓取id区间说明: [
    '你可以设置一个作品 ID 范围，抓取此范围内的所有作品（包含开始和结束的 id）。<br>注意：如果一次任务中产生的抓取结果数量太多，可能会导致页面崩溃。<br>如果你需要抓取很多 ID，请考虑拆分成多个任务。我建议每批抓取的 ID 数量不要超过 100,000 个。',
    '你可以設定一個作品 ID 範圍，擷取此範圍內的所有作品（包含開始和結束的 id）。<br>注意：如果一次任務中產生的擷取結果數量太多，可能會導致頁面崩潰。<br>如果你需要抓取很多 ID，請考慮拆分成多個任務。我建議每批抓取的 ID 數量不要超過 100,000 個。',
    'You can set a range of work ID and grab all works in this range (including the begin and end ID). <br>Note: If the number of crawling results in a task is too much, it may cause the page to crash.<br>If you need to crawl a lot of IDs, consider splitting it into multiple tasks. I recommend crawling no more than 100,000 IDs per batch.',
    '作品 ID の範囲を設定し、その範囲内のすべての作品をクロールすることができます。「開始 ID と終了 id を含む」<br>注意：1 つのタスクであまりにも多くのクロール結果を生成すると、ページがクラッシュする可能性があります。<br>多数の ID をクロールする必要がある場合は、複数のタスクに分割することを検討してください。 バッチごとにクロールする ID は 100,000 未満にすることをお勧めします。',
    '작품 ID 범위를 설정할 수 있습니다. 이 범위 내의 모든 작품 (시작과 끝 ID 포함).<br>참고: 작업의 긁어오기 결과가 너무 많으면 페이지가 충돌할 수 있습니다.<br>많은 ID를 크롤링해야 하는 경우 이를 여러 작업으로 분할하는 것이 좋습니다. 배치당 100,000개 이하의 ID를 크롤링하는 것이 좋습니다.',
    'Вы можете задать диапазон идентификаторов работ и захватить все работы в этом диапазоне (включая идентификаторы начала и конца). <br>Примечание: Если в задании слишком большое количество результатов стаскивания, это может привести к сбою страницы.<br>Если вам нужно сканировать большое количество идентификаторов, рассмотрите возможность разделения этого процесса на несколько задач. Я рекомендую сканировать не более 100 000 идентификаторов за пакет.',
  ],
  _抓取id区间起点: [
    '请输入开始的 ID: ',
    '請輸入開始的 ID: ',
    'Please type in the beginning ID: ',
    '開始 ID を入力してください: ',
    '시작 ID를 입력해주세요: ',
    'Пожалуйста, введите начальный идентификатор: ',
  ],
  _抓取id区间终点: [
    '请输入结束的 ID: ',
    '請輸入結束的 ID: ',
    'Please type  in the ending ID: ',
    '終了 ID を入力してください: ',
    '끝 ID를 입력해주세요: ',
    'Пожалуйста, введите конечный идентификатор: ',
  ],
  _选项卡切换方式: [
    '<span class="key">选项卡</span>切换方式',
    '<span class="key">頁籤</span>切換方式',
    'How to switch <span class="key">tabs</span>',
    '<span class="key">タブ</span>切り替え方式',
    '<span class="key">탭</span> 전환 방식',
    'Как переключать <span class="key">вкладки</span>',
  ],
  _选项卡切换方式的说明: [
    `设置如何切换下载器顶部的三个选项卡。`,
    `設定如何切換下載器頂部的三個選項卡。`,
    `Sets how to switch between the three tabs at the top of the Downloader.`,
    `ダウンローダーの上部にある 3 つのタブを切り替える方法を設定します。`,
    `다운로더 상단의 세 개 탭 사이를 전환하는 방법을 설정합니다.`,
    `Устанавливает способ переключения между тремя вкладками в верхней части Загрузчика.`,
  ],
  _鼠标经过: [
    '鼠标经过',
    '滑鼠經過',
    'Mouse over',
    'マウスオーバー',
    '마우스 올리기',
    'Наведите мышь',
  ],
  _鼠标点击: [
    '鼠标点击',
    '滑鼠點選',
    'Mouse click',
    'マウスクリック',
    '마우스 클릭',
    'Кликнуть мышкой',
  ],
  _在序号前面填充0: [
    '在序号前面<span class="key">填充 0</span>',
    '在序號前面<span class="key">填充 0</span>',
    '<span class="key">Add 0</span> in front of the serial number',
    'シリアル番号の前に<span class="key">0</span>を記入',
    '일련번호 앞 <span class="key">0 채우기</span>',
    '<span class="key">Добавьте 0</span> перед серийным номером',
  ],
  _在序号前面填充0的说明: [
    '这可以解决一些软件不能正确的按照文件名来排序文件的问题。',
    '這可以解決一些軟體不能正確的按照檔名來排序檔案的問題。',
    'This can solve the problem that some software cannot correctly sort files by file name.',
    'これにより、一部のソフトウェアがファイルをファイル名で正しくソートできないという問題を解決できます。',
    '이것은 일부 소프트웨어가 파일 이름별로 파일을 올바르게 정렬할 수 없는 문제를 해결할 수 있습니다.',
    'Это может решить проблему того, что некоторые программы не могут правильно сортировать файлы по имени файла.',
  ],
  _序号总长度: [
    '序号总长度',
    '序號總長度',
    'Total length of serial number',
    'シリアル番号の全長',
    '일련번호 전체 길이',
    'Общая длина серийного номера',
  ],
  _完全一致: [
    '完全一致',
    '完全一致',
    'Perfect match',
    '完全一致',
    '완전 일치',
    'Идеальное совпадение',
  ],
  _部分一致: [
    '部分一致',
    '部分一致',
    'Partial match',
    '部分一致',
    '부분 일치',
    'Частичное совпадение',
  ],
  _位置: ['位置', '位置', 'Position', '位置', '위치', 'Позиция'],
  _左: ['左', '左', 'Left', '左', '왼쪽', 'Слева'],
  _右: ['右', '右', 'Right', '右', '오른쪽', 'Справа'],
  _多图作品的图片数量上限: [
    '多图作品的图片<span class="key">数量</span>上限',
    '多圖作品的圖片<span class="key">數量</span>上限',
    '<span class="key">Maximum number</span> of images for multi-image works',
    'マルチ作品の<span class="key">最大</span>画像数',
    '여러 이미지 작품의 <span class="key">최대 수</span>',
    '<span class="key">Максимальное количество</span> изображений для работ с несколькими изображениями',
  ],
  _多图作品的图片数量上限提示: [
    `如果一个多图作品里的图片数量大于设置的数字，下载器就不会抓取这个作品。`,
    `如果一個多圖作品裡的圖片數量大於設置的數字，下載器就不會抓取這個作品。`,
    `If the number of images in a multi-image work exceeds the set number, the downloader will not crawl this work.`,
    `マルチ画像作品の画像数が設定値を超える場合、ダウンロードツールはこの作品をクロールしません。`,
    `멀티 이미지 작품의 이미지 수가 설정된 숫자를 초과하면, 다운로더는 이 작품을 크롤링하지 않습니다.`,
    `Если количество изображений в многоизображной работе превышает установленное число, загрузчик не будет скачивать эту работу.`,
  ],
  _在搜索页面添加快捷搜索区域: [
    '在搜索页面添加快捷<span class="key">搜索</span>区域',
    '在搜尋頁面新增快速<span class="key">搜尋</span>區域',
    'Add a quick <span class="key">search</span> area on the search page',
    '検索ページにクイック<span class="key">検索</span>領域を追加します',
    '검색 페이지에 빠른 <span class="key">검색</span> 영역 추가',
    'Добавить область быстрого <span class="key">поиска</span> на странице поиска',
  ],
  _在搜索页面添加快捷搜索区域的说明: [
    `在搜索页面（/tags/）的顶部，下载器可以显示一些收藏数量标签，例如“10000users入り”，点击就可以把它添加到搜索的标签的后面。`,
    `在搜尋頁面（/tags/）的頂部，下載器可以顯示一些收藏數量標籤，例如“10000users入り”，點選就可以把它新增到搜尋的標籤的後面。`,
    `At the top of the search page (/tags/), the downloader can display some bookmarks tags, such as "10000users入り", and you can click it to add it after the searched tag.`,
    `検索ページの上部 (/tags/) に、ダウンローダーは「10000users入り」などのお気に入りのタグをいくつか表示し、それをクリックして検索したタグの後に追加することができます。`,
    `검색 페이지 상단(/tags/)에서 다운로더는 "10000users入り"와 같은 즐겨찾는 태그를 표시할 수 있으며, 이를 클릭하면 검색한 태그 뒤에 추가할 수 있습니다.`,
    `В верхней части страницы поиска (/tags/) загрузчик может отображать некоторые избранные теги, например «10000users入り», и вы можете щелкнуть по нему, чтобы добавить его после искомого тега.`,
  ],
  _保存作品的元数据: [
    '保存作品的<span class="key">元数据</span>',
    '儲存作品的<span class="key">元資料</span>',
    'Save the <span class="key">metadata</span> of the work',
    '作品の<span class="key">メタデータ</span>を保存する',
    '작품 <span class="key">메타데이터</span> 저장',
    'Сохранить <span class="key">метаданные</span> работы',
  ],
  _保存作品的元数据说明: [
    `下载器可以为每个作品生成一个同名文件（但扩展名不同），保存它的元数据。<br>
你可以选择为哪些类型的作品生成元数据文件，并且可以选择 TXT 格式或（和）JSON 格式。<br>
TXT 格式易于阅读，但只包含比较常用的数据。<br>
JSON 格式是下载器的内部数据，保存了更多的数据。`,
    `下載器可以為每個作品生成一個同名檔案（但副檔名不同），儲存它的元數據。<br>
你可以選擇為哪些類型的作品生成元數據檔案，並且可以選擇 TXT 格式或（和）JSON 格式。<br>
TXT 格式易於閱讀，但只包含比較常用的資料。<br>
JSON 格式是下載器的內部資料，儲存了更多的資料。`,
    `The downloader can generate a file with the same name (but different extension) for each work to save its metadata.<br>
You can choose which types of works to generate metadata files for, and you can choose TXT format or (and) JSON format.<br>
TXT format is easy to read but only contains relatively common data.<br>
JSON format is the downloader's internal data and saves more information.`,
    `ダウンロードツールは、各作品に対して同名のファイル（拡張子は異なる）を生成し、そのメタデータを保存できます。<br>
どのタイプの作品に対してメタデータファイルを生成するかを選択でき、TXT形式または（および）JSON形式を選択できます。<br>
TXT形式は読みやすいですが、比較的よく使われるデータのみを含みます。<br>
JSON形式はダウンロードツールの内部データで、より多くの情報を保存します。`,
    `다운로더는 각 작품에 대해 동일한 이름의 파일(확장자만 다름)을 생성하여 메타데이터를 저장할 수 있습니다.<br>
어떤 유형의 작품에 대해 메타데이터 파일을 생성할지 선택할 수 있으며, TXT 형식 또는 (및) JSON 형식을 선택할 수 있습니다.<br>
TXT 형식은 읽기 쉽지만 비교적 일반적인 데이터만 포함합니다.<br>
JSON 형식은 다운로더의 내부 데이터로, 더 많은 정보를 저장합니다.`,
    `Загрузчик может создать для каждого произведения файл с тем же именем (но с другим расширением) для сохранения его метаданных.<br>
Вы можете выбрать, для каких типов произведений генерировать файлы метаданных, а также выбрать формат TXT или (и) JSON.<br>
Формат TXT удобен для чтения, но содержит только наиболее часто используемые данные.<br>
Формат JSON — это внутренние данные загрузчика, сохраняющие гораздо больше информации.`,
  ],
  _在不同的页面类型中使用不同的命名规则: [
    '在不同的页面类型中使用<span class="key">不同</span>的命名规则',
    '在不同的頁面類型中使用<span class="key">不同</span>的命名規則',
    'Use <span class="key">different</span> naming rules in different page types',
    'ページの種類によって<span class="key">異なる</span>命名規則を使用',
    '페이지 유형에 따라 <span class="key">다른</span> 명명 규칙 사용',
    'Использовать <span class="key">различные</span> правила именования в разных типах страниц',
  ],
  _在不同的页面类型中使用不同的命名规则的帮助: [
    `默认情况下，下载器会在所有页面类型里使用相同的命名规则。<br>
如果你想为一些页面设置独立的命名规则，例如在搜索页面和作者主页里使用不同的命名规则，可以启用这个设置，这样下载器会为每种页面类型保存它独有的命名规则。<br>
<br>
注意：启用此设置之后，下载器会使用预设的命名规则覆盖你当前的命名规则。之后你可以根据需要自行修改，例如在搜索页面和作者主页里设置不同的命名规则。`,
    `預設情況下，下載器會在所有頁面類型裡使用相同的命名規則。<br>
如果你想為某些頁面設定獨立的命名規則，例如在搜尋頁面和作者主頁裡使用不同的命名規則，可以啟用這個設定，這樣下載器會為每種頁面類型儲存其獨有的命名規則。<br>
<br>
注意：啟用此設定之後，下載器會使用預設的命名規則覆蓋你目前的命名規則。之後你可以根據需要自行修改，例如在搜尋頁面和作者主頁裡設定不同的命名規則。`,
    `By default, the downloader uses the same naming rule for all page types.<br>
If you want to set separate naming rules for certain pages — for example, using different rules on the search page and an artist's profile page — you can enable this setting. The downloader will then save a unique naming rule for each page type.<br>
<br>
Note: After enabling this setting, the downloader will overwrite your current naming rule with the preset naming rules. You can then customize them as needed, such as setting different rules for the search page and an artist's profile page.`,
    `デフォルトでは、ダウンローダーはすべてのページタイプで同じ命名ルールを使います。<br>
検索ページと作者のプロフィールページで異なる命名ルールを使うなど、特定のページに独自の命名ルールを設定したい場合は、この設定を有効にしてください。有効にすると、ダウンローダーはページタイプごとに個別の命名ルールを保存します。<br>
<br>
注意：この設定を有効にすると、ダウンローダーは現在の命名ルールをプリセットの命名ルールで上書きします。その後、検索ページと作者のプロフィールページで異なるルールを設定するなど、必要に応じて自由に変更できます。`,
    `기본적으로 다운로더는 모든 페이지 유형에서 동일한 명명 규칙을 사용합니다.<br>
검색 페이지와 작가 프로필 페이지에서 서로 다른 명명 규칙을 사용하는 것처럼 특정 페이지에 별도의 명명 규칙을 설정하고 싶다면 이 설정을 활성화하세요. 활성화하면 다운로더가 각 페이지 유형마다 고유한 명명 규칙을 저장합니다.<br>
<br>
주의: 이 설정을 활성화하면 다운로더가 현재의 명명 규칙을 사전 설정된 명명 규칙으로 덮어씁니다. 이후 검색 페이지와 작가 프로필 페이지에 서로 다른 규칙을 설정하는 등 필요에 따라 자유롭게 수정할 수 있습니다.`,
    `По умолчанию загрузчик использует одно и то же правило именования для всех типов страниц.<br>
Если вы хотите задать отдельные правила именования для определённых страниц — например, использовать разные правила на странице поиска и на странице профиля автора — включите эту настройку. Тогда загрузчик будет сохранять уникальное правило именования для каждого типа страницы.<br>
<br>
Обратите внимание: после включения этой настройки загрузчик перезапишет ваше текущее правило именования предустановленными правилами. После этого вы можете изменить их по своему усмотрению, например задать разные правила для страницы поиска и страницы профиля автора.`,
  ],
  _显示高级设置: [
    '显示<span class="key">高级</span>设置',
    '顯示<span class="key">進階</span>設定',
    'Show <span class="key">advanced</span> settings',
    '<span class="key">詳細</span>設定を表示する',
    '<span class="key">고급</span> 설정 보기',
    'Показать <span class="key">расширенные</span> настройки',
  ],
  _显示高级设置说明: [
    `下载器默认隐藏了一些设置。点击以显示所有设置。<br>被隐藏的设置依然会生效。`,
    `下載器預設隱藏了一些設定。點選以顯示所有設定。<br>被隱藏的設定依然會生效。`,
    `The Downloader hides some settings by default. Click to show all settings. <br>Hidden settings will still work.`,
    `ダウンローダーはデフォルトで一部の設定を非表示にしています。クリックするとすべての設定が表示されます。<br>非表示の設定も引き続き機能します。`,
    `다운로더는 기본적으로 일부 설정을 숨깁니다. 모든 설정을 표시하려면 클릭하세요. <br>숨겨진 설정도 계속 작동합니다.`,
    `Загрузчик скрывает некоторые настройки по умолчанию. Щелкните, чтобы показать все настройки. <br>Скрытые настройки будут работать.`,
  ],
  _状态码为0的错误提示: [
    '下载时发生错误，状态码为 0，请求未成功。可能的原因：<br><br>1. 系统磁盘的剩余空间可能不足（通常是 C 盘）（建议剩余空间大于 4GB）。请尝试清理系统磁盘空间，然后重新启动浏览器，继续未完成的下载。<br><br>2. 网络错误。可能是网络代理导致的问题。如果你使用 Nginx 或者 Apache 反代理访问 pixiv，请换成梯子。<br><br>3. 可以尝试重启浏览器，或者禁用此扩展然后重新启用，并刷新这个标签页。',
    '下載時發生錯誤，狀態碼為 0，請求未成功。可能的原因：<br><br>1. 系統磁碟的剩餘空間可能不足（通常是 C 盤）（建議剩餘空間大於 4GB）。請嘗試清理系統磁碟空間，然後重新啟動瀏覽器，繼續未完成的下載。<br><br>2. 網路錯誤。可能是網路代理導致的問題。<br><br>3. 可以嘗試重啟瀏覽器，或者禁用此擴充套件然後重新啟用，並重新整理這個標籤頁。',
    'An error occurred while downloading, the status code is 0, and the request was unsuccessful. Possible reasons: <br><br>1. The remaining space of the system disk may be insufficient (usually C drive)(it is recommended that the remaining space be greater than 4GB). Please try to clear the system disk space, and then restart the browser to continue the unfinished download. <br><br>2. Network error. It may be a problem caused by a network proxy.<br><br>3. You can try to restart the browser, or disable and re-enable the extension, and refresh the tab.',
    'ダウンロード中にエラーが発生し、ステータスコードは0で、リクエストは失敗しました。 考えられる理由：<br> <br> 1。 システムディスクの残りのスペースが不足している可能性があります(通常はCドライブ)（残りのスペースは4GBを超えることをお勧めします）。 システムのディスク領域をクリアしてから、ブラウザを再起動して、未完了のダウンロードを続行してください。 <br> <br> 2。 ネットワークエラー。 ネットワークプロキシが原因の問題である可能性があります。<br><br>3. ブラウザを再起動するか、拡張機能を無効にしてから再度有効にして、タブを更新してみてください。',
    '다운로드 중 오류가 발생했으며, 상태 코드가 0이고 요청에 실패했습니다. 가능한 원인: <br><br>1. 시스템 디스크의 남은 공간이 부족할 수 있습니다(보통 C드라이브)(남은 공간은 4GB보다 큰 것이 좋습니다). 시스템 디스크 공간을 비운 다음 브라우저를 다시 시작하여 완료되지 않은 다운로드를 계속해주세요. <br><br>2. 네트워크 오류. 네트워크 프록시로 인한 문제일 수 있습니다.<br><br>3. 브라우저를 다시 시작하거나 확장 프로그램을 비활성화했다가 다시 활성화하고 탭을 새로 고칠 수 있습니다.',
    'Во время загрузки произошла ошибка, код состояния равен 0, и запрос был выполнен неудачно. Возможные причины: <br><br>1. Оставшегося места на системном диске может быть недостаточно (обычно это диск C) (рекомендуется, чтобы оставшееся место было больше 4 ГБ). Пожалуйста, попробуйте освободить место на системном диске, а затем перезапустите браузер, чтобы продолжить незаконченную загрузку. <br><br>2. Ошибка сети. Это может быть проблема, вызванная сетевым прокси-сервером.<br><br>3. Вы можете попробовать перезапустить браузер или отключить и снова включить расширение и обновить вкладку.',
  ],
  _下载完成后显示通知: [
    '下载完成后显示<span class="key">通知</span>',
    '下載完成後顯示<span class="key">通知</span>',
    'Show <span class="key">notification</span> after download is complete',
    'ダウンロードが完了した後に<span class="key">通知</span>を表示する',
    '다운로드가 완료되면 <span class="key">알림</span> 표시',
    'Показать <span class="key">уведомление</span> после завершения загрузки',
  ],
  _下载完成后显示通知的说明: [
    '当所有文件下载完成后显示一条系统通知。可能会请求通知权限。',
    '當所有檔案下載完成後顯示一條系統通知。可能會請求通知許可權。',
    'Show a system notification when all files have been downloaded. May require notification permission.',
    'すべてのファイルのダウンロードが完了したらシステム通知を表示します。通知の許可が必要になる場合があります。',
    '모든 파일이 다운로드되면 시스템 알림을 표시합니다. 알림 권한이 필요할 수 있습니다.',
    'Показывать системное уведомление, когда все файлы будут загружены. Может потребоваться разрешение на уведомление.',
  ],
  _高亮显示关键字: [
    '<span class="key">高亮</span>显示关键字',
    '<span class="key">標明</span>顯示關鍵字',
    '<span class="key">Highlight</span> keywords',
    '<span class="key">強調</span>表示キーワード',
    '<span class="key">강조</span> 키워드 표시',
    '<span class="key">Выделить</span> ключевые слова',
  ],
  _高亮显示关键字的说明: [
    `高亮显示每个设置名称里的关键字，以便你可以快速找到需要的设置。`,
    `高亮顯示每個設定名稱裡的關鍵字，以便你可以快速找到需要的設定。`,
    `Highlight the keywords in each setting name so that you can quickly find the settings you need.`,
    `各設定名のキーワードをハイライト表示して、必要な設定を素早く見つけられるようにします。`,
    `각 설정 이름의 키워드를 강조 표시하여 필요한 설정을 빠르게 찾을 수 있습니다.`,
    `Подсвечивать ключевые слова в названиях каждого параметра, чтобы вы могли быстро найти нужные настройки.`,
  ],
  _抓取标签列表: [
    '抓取标签列表',
    '擷取標籤列表',
    'Crawl tag list',
    'タグのリストをクロール',
    '태그 긁어오기',
    'Сканировать список тегов',
  ],
  _抓取标签列表的输入框提示: [
    '请输入你要抓取的标签列表。多个标签之间使用换行分割',
    '請輸入你要擷取的標籤列表。多個標籤之間使用換行分隔',
    'Please type the list of tags you want to crawl. Use line breaks between multiple tags',
    'クロールしたいタグのリストを入力してください。 複数のタグを改行で分割',
    '긁어올 태그를 입력해주세요. 여러 태그는 줄 바꿈 사용',
    'Пожалуйста, введите список тегов, которые вы хотите просмотреть. Используйте разрывы строк между несколькими тегами',
  ],
  _抓取标签列表的文件夹提示: [
    '在抓取标签列表时，你可以使用 {page_tag} 或者 {page_title} 标记获取当前抓取的标签，并用来建立文件夹。例如：{page_tag}/{id}',
    '在擷取標籤列表時，你可以使用 {page_tag} 或者 {page_title} 標記獲取目前擷取的標籤，並用來建立資料夾。例如：{page_tag}/{id}',
    'When crawling the tag list, you can use {page_tag} or {page_title} tags to get the tags currently crawled and use them to create folders. For example: {page_tag}/{id}',
    'タグリストをクロールする時に、 {page_tag} や {page_title}を使用すると、現在クロールされているタグを取得し、それらを使ってフォルダを作成することができます。例：{page_tag}/{id}',
    '태그를 긁어올 때 {page_tag} 또는 {page_title} 태그를 사용하여, 긁어온 태그로 디렉토리를 생성할 수 있습니다. 예: {page_tag}/{id}',
    'При сканировании списка тегов вы можете использовать теги {page_tag} или {page_title}, чтобы получить теги, которые в данный момент просматриваются, и использовать их для создания папок. Например: {page_tag}/{id}',
  ],
  _停止抓取标签列表: [
    '停止抓取标签列表',
    '停止擷取標籤列表',
    'Stop crawling the list of tags',
    'タグリストのクロールを停止',
    '태그 긁어오기 정지',
    'Прекратить сканирование списка тегов',
  ],
  _等待下载的标签: [
    '等待下载的标签',
    '等待下載的標籤',
    'Tags waiting to be downloaded',
    'ダウンロード待ちのタグ',
    '다운로드 대기 중인 태그',
    'Теги, ожидающие загрузки',
  ],
  _你确定要停止抓取吗: [
    '你确定要停止抓取吗？',
    '確定要停止擷取嗎？',
    'Are you sure you want to stop crawling?',
    '本当にクロールをやめたいのか',
    '긁어오기를 중지하시겠습니까?',
    'Ты уверен, что хочешь перестать сканировать?',
  ],
  _只能在搜索页面使用: [
    '只能在搜索页面使用',
    '只能在搜尋頁面使用',
    'Can only be used on the search page',
    '検索ページでのみ使用できます',
    '검색 페이지에서만 사용 가능',
    'Можно использовать только на странице поиска',
  ],
  _自动导出抓取结果: [
    '自动<span class="key">导出</span>抓取结果',
    '自動<span class="key">匯出</span>擷取結果',
    'Automatically <span class="key">export</span> crawl results',
    'クロール結果の<span class="key">自動</span>エクスポート',
    '자동으로 긁어오기 결과 <span class="key">내보내기</span>',
    'Автоматически <span class="key">экспортировать</span> результаты сканирования',
  ],
  _自动导出抓取结果的说明: [
    '抓取完成后自动导出抓取结果。<br>可以使用两种格式：CSV 格式易于阅读，JSON 格式则可以用于导入抓取结果。',
    '抓取完成後自動匯出抓取結果。<br>可以使用兩種格式：CSV 格式易於閱讀，JSON 格式則可以用於匯入抓取結果。',
    'The crawl results can be automatically exported when the crawl is completed. <br>Two formats are available: CSV format is easy to read, and JSON format can be used to import crawl results.',
    'クロールが完了すると、クロール結果が自動的にエクスポートされます。 <br>簡単に読める CSV とクロール結果をインポートするための JSON の 2 つの形式が利用可能です。',
    '크롤링이 완료되면 크롤링 결과가 자동으로 내보내집니다. <br>두 가지 형식을 사용할 수 있습니다. 읽기 쉬운 CSV 형식과 크롤링 결과를 가져오는 JSON 형식입니다.',
    'После завершения сканирования результаты сканирования автоматически экспортируются. <br>Доступны два формата: CSV для удобного чтения и JSON для импорта результатов сканирования.',
  ],
  _抓取结果: [
    '抓取结果',
    '擷取結果',
    'Crawl results',
    'クロール結果',
    '긁어오기 결과',
    'Сканировать результаты',
  ],
  _文件格式: [
    '文件格式',
    '檔案格式',
    'File format',
    'ファイル形式',
    '파일 형식',
    'Формат файла',
  ],
  _格式: ['格式', '格式', 'Format', '形式', '형식', 'Формат'],
  _预览作品: [
    '<span class="key">预览</span>作品',
    '<span class="key">預覽</span>作品',
    '<span class="key">Preview</span> works',
    '作品の<span class="key">プレビュー</span>',
    '작품 <span class="key">미리보기</span>',
    '<span class="key">Превью</span> работает',
  ],
  _预览作品的说明: [
    `当鼠标放在图片的缩略图上时，下载器可以显示更大的图片。`,
    `當滑鼠放在圖片的縮圖上時，下載器可以顯示更大的圖片。`,
    `When you hover the mouse over the image thumbnail, the downloader can display a larger image.`,
    `画像のサムネイルの上にマウスを置くと、ダウンローダーはより大きな画像を表示できます。`,
    `이미지 섬네일 위에 마우스를 올려 놓으면 다운로더가 더 큰 이미지를 표시합니다.`,
    `При наведении указателя мыши на миниатюру изображения загрузчик может отобразить увеличенное изображение.`,
  ],
  _点击鼠标左键可以关闭预览图: [
    '点击鼠标左键可以关闭预览图',
    '點選滑鼠左鍵可以關閉預覽圖',
    'Click the left mouse button to close the preview',
    'マウスの左クリックでプレビュー画像を閉じる',
    '마우스 왼쪽 버튼을 클릭하면 미리보기를 닫습니다',
    'Нажмите левую кнопку мыши, чтобы закрыть предварительный просмотр',
  ],
  _尺寸: ['尺寸', '尺寸', 'Size', 'サイズ', '크기', 'Размер'],
  _允许鼠标停留在预览图上: [
    '允许鼠标停留在预览图上',
    '允許滑鼠停留在預覽圖上',
    'Allow the mouse to stay on the preview image',
    'プレビュー画像の上にマウスを置くことができます',
    '마우스가 미리보기 이미지 위에서 유지되도록 허용',
    'Разрешить мыши оставаться на изображении предварительного просмотра',
  ],
  _点击预览图时下载作品: [
    '点击预览图时下载作品',
    '點選預覽圖時下載作品',
    'Download the work when you click on the preview',
    'プレビュー画像をクリックするとその作品がダウンロードされます',
    '미리보기 이미지를 클릭하면 작품 다운로드',
    'Загружать работу при нажатии на предварительный просмотр',
  ],
  _转换动图时页面被隐藏的提示: [
    '这个标签页正在转换动图。如果这个标签页被隐藏了，转换速度可能会变慢。',
    '這個標籤頁正在轉換動圖。如果這個標籤頁被隱藏了，轉換速度可能會變慢。',
    'This tab page is converting ugoira. If this tab page is hidden, the conversion speed may slow down.',
    'このタブページはうごイラを変換しています。 このタブを非表示にすると、変換速度が低下する場合があります。',
    '이 탭은 움직이는 일러스트를 변환하는 중입니다.이 탭이 숨겨지면 변환 속도가 느려질 수 있습니다.',
    'Эта страница вкладки преобразует ugoira. Если эта страница вкладки скрыта, скорость конвертации может замедлиться.',
  ],
  _原始尺寸: [
    '原始尺寸',
    '原始尺寸',
    'Original size',
    'オリジナルサイズ',
    '원본 크기',
    'Оригинальный размер',
  ],
  _增强: ['增强', '增強', 'Enhance', '強化機能', '향상', 'Улучшение'],
  _长按右键显示大图: [
    '在缩略图上长按鼠标右键时显示<span class="key">大图</span>',
    '在縮圖上長按滑鼠右鍵時顯示<span class="key">大圖</span>',
    'Long press the right mouse button on the thumbnail to display the <span class="key">large image</span>',
    'サムネイルでマウスの右ボタンを長押しすると、<span class="key">大きな画像</span>が表示されます',
    '썸네일을 마우스 오른쪽 버튼으로 클릭했을 때 <span class="key">큰 이미지</span> 표시',
    'Длительное нажатие правой кнопки мыши на миниатюре для отображения <span class="key">большого изображения</span>',
  ],
  _鼠标滚轮切换图片: [
    '预览多图作品时，可以使用鼠标滚轮切换图片。',
    '預覽多圖作品時，可以使用滑鼠滾輪切換圖片。',
    'When previewing multi-image works, you can use the mouse wheel to switch images.',
    '複数画像をプレビューする際に、マウスホイールを使って画像を切り替えることができます。',
    '여러 이미지 작품을 미리 볼 때, 마우스 휠을 사용하여 이미지를 전환할 수 있습니다.',
    'При предварительном просмотре работ с несколькими изображениями можно использовать колесико мыши для переключения изображений',
  ],
  _whatisnew: [
    `修复因为 Pixiv 的变化而导致的抓取失败的问题。`,
    `修復因為 Pixiv 的變化而導致的抓取失敗的問題。`,
    `Fixed crawl failures due to Pixiv changes.`,
    `Pixiv の変更によるクロールの失敗を修正しました。`,
    `Pixiv 변경으로 인한 크롤링 실패를 수정했습니다.`,
    'Исправлены сбои в сканировании из-за изменений в Pixiv',
  ],
  _等待时间: [
    '等待时间',
    '等待時間',
    'Waiting time',
    '待ち時間',
    '대기 시간',
    'Время ожидания',
  ],
  _格式错误: [
    '格式错误',
    '格式錯誤',
    'Format error',
    'フォーマットエラー',
    '형식 오류',
    'Ошибка форматантирования',
  ],
  _下载数量错误: [
    '下载的页数（作品）数量设置错误',
    '下載的頁數（作品）數量設定錯誤',
    'The number of downloaded pages (works) is set incorrectly',
    '下载页数（作品）设置不正确',
    '다운로드할 페이지 수(작품) 설정 오류',
    'Количество загруженных страниц (работ) установлено неверно',
  ],
  _默认下载多页: [
    '开始抓取, 如有多页，默认会下载全部。',
    '開始擷取，如有多頁，預設會下載全部。',
    'Start crawl, if there are multiple pages, the default will be downloaded.',
    'クロールを開始する、複数のページがある場合、デフォルトですべてをダウンロードされます。',
    '긁어오기를 시작합니다. 여러 페이지가 있으면 기본적으로 모두 다운로드됩니다.',
    'Начать сканирование, если есть несколько страниц, все будут загружены по умолчанию.',
  ],
  _赞助我: [
    '赞助我',
    '贊助我',
    'Sponsor me',
    '支援する',
    '후원하기',
    'Поддержать меня',
  ],
  _赞助方式提示: [
    `如果您觉得这个工具对您有帮助，可以考虑赞助我，谢谢！<br>
    您可以在 Patreon 上赞助我：<br>
    <a href="https://www.patreon.com/xuejianxianzun" target="_blank">https://www.patreon.com/xuejianxianzun</a><br><br>
    中国大陆用户可以在“爱发电”上赞助我：<br>
    <a href="https://afdian.com/a/xuejianxianzun" target="_blank">https://afdian.com/a/xuejianxianzun</a><br><br>
    也可以扫描二维码：<br>
    <a href="https://github.com/xuejianxianzun/PixivBatchDownloader#%E6%94%AF%E6%8C%81%E5%92%8C%E6%8D%90%E5%8A%A9" target="_blank">在 Github 上查看二维码</a>
    `,
    `如果您覺得這個工具對您有幫助，可以考慮贊助我，謝謝！<br>
    您可以在 Patreon 上贊助我：<br>
    <a href="https://www.patreon.com/xuejianxianzun" target="_blank">https://www.patreon.com/xuejianxianzun</a><br><br>
    中國大陸使用者可以在“愛發電”上贊助我：<br>
    <a href="https://afdian.com/a/xuejianxianzun" target="_blank">https://afdian.com/a/xuejianxianzun</a>
    `,
    `If you find this tool helpful, please consider sponsoring me, thank you!<br>
    You can sponsor me on Patreon: <br>
    <a href="https://www.patreon.com/xuejianxianzun" target="_blank">https://www.patreon.com/xuejianxianzun</a>
    `,
    `このツールが役に立ったと思われる場合は、スポンサーになることをご検討ください。ありがとうございます。<br>
    ご支援してくださった方は、以下の Patreon で：<br>
    <a href="https://www.patreon.com/xuejianxianzun" target="_blank"> https://www.patreon.com/xuejianxianzun </a>
    `,
    `이 도구가 도움이 된다면 후원해 보시기 바랍니다. 감사합니다!<br>
    Patreon에서 저를 후원해주세요<br>
    <a href="https://www.patreon.com/xuejianxianzun" target="_blank">https://www.patreon.com/xuejianxianzun</a>
    `,
    `Если вы найдете этот инструмент полезным, пожалуйста, рассмотрите возможность спонсировать меня, спасибо!<br>
    Вы можете спонсировать меня на Patreon: <br>
    <a href="https://www.patreon.com/xuejianxianzun" target="_blank">https://www.patreon.com/xuejianxianzun</a>
    `,
  ],
  _替换方形缩略图以显示图片比例: [
    '替换方形<span class="key">缩略图</span>以显示图片比例',
    '替換方形<span class="key">縮圖</span>以顯示圖片比例',
    'Replace square <span class="key">thumbnails</span> to show image ratio',
    '正方形の<span class="key">サムネイル</span>を置き換えて、画像のスケールを表示',
    '이미지 종횡비를 표시하기 위해 정사각형 <span class="key">썸네일</span> 교체',
    'Замените квадратные <span class="key">миниатюры</span>, чтобы показать соотношение сторон изображения',
  ],
  _替换方形缩略图以显示图片比例的说明: [
    `Pixiv 的缩略图是正方形的，不能看到图片的全貌，也看不出是横图还是竖图。<br>下载器可以显示完整的缩略图，以显示图片比例。`,
    `Pixiv 的縮圖是正方形的，不能看到圖片的全貌，也看不出是橫圖還是豎圖。<br>下載器可以顯示完整的縮圖，以顯示圖片比例。`,
    `Pixiv's thumbnails are square, so you can't see the whole picture or whether it's horizontal or vertical. <br>The downloader can display the full thumbnail to show the image ratio.`,
    `Pixivのサムネイルは正方形なので、全体像や縦横比の確認ができません。<br>ダウンローダーではサムネイル全体を表示することで画像の比率を確認できます。`,
    `Pixiv의 썸네일은 정사각형이므로 전체 그림을 볼 수 없고 가로인지 세로인지도 알 수 없습니다. <br>다운로더는 이미지 비율을 보여주기 위해 전체 썸네일을 표시할 수 있습니다.`,
    `Миниатюры Pixiv квадратные, поэтому вы не можете увидеть всю картинку или определить, горизонтальная она или вертикальная. <br>Загрузчик может отобразить полную миниатюру, чтобы показать соотношение сторон изображения.`,
  ],
  _不创建文件夹: [
    `<span class="key">不创建</span>文件夹`,
    `<span class="key">不建立</span>資料夾`,
    `Do <span class="key">not create</span> folder`,
    `<span class="key">フォルダを作成しない</span>`,
    `<span class="key">폴더를 생성하지 않음</span>`,
    `<span class="key">Не создавать</span> папку`,
  ],
  _不创建文件夹的帮助内容: [
    `启用此设置后，符合条件的文件不会创建文件夹，而是直接保存到浏览器的下载目录里。<br>
<br>
子选项：<br>
- 从插画、漫画里下载 1 张图片时：如果你只从这个作品里下载了 1 张图片，就不为这张图片创建文件夹。每个作品都会单独计算。<br>
- 从插画、漫画里下载多张图片时：如果你从这个作品里下载了多张图片，就不为这些图片创建文件夹。每个作品都会单独计算。<br>
- 动图：不为动图作品创建文件夹。<br>
- 小说：不为单篇小说作品创建文件夹。<br>
<br>
提示：<br>
如果你启用了所有子选项，那么所有作品都不会创建文件夹。<br>
此设置不适用于合并系列小说后生成的合集文件。如果你想让合集文件不创建文件夹，可以在"更多"-"命名"里修改"
合并系列小说时的命名规则"。`,
    `啟用此設定後，符合條件的檔案不會建立資料夾，而是直接儲存到瀏覽器的下載目錄裡。<br>
<br>
子選項：<br>
- 從插畫、漫畫裡下載 1 張圖片時：如果你只從這個作品裡下載了 1 張圖片，就不會為這張圖片建立資料夾。每個作品都會分開計算。<br>
- 從插畫、漫畫裡下載多張圖片時：如果你從這個作品裡下載了多張圖片，就不會為這些圖片建立資料夾。每個作品都會分開計算。<br>
- 動圖：不為動圖作品建立資料夾。<br>
- 小說：不為單篇小說作品建立資料夾。<br>
<br>
提示：<br>
如果你啟用了所有子選項，那麼所有作品都不會建立資料夾。<br>
此設定不適用於合併系列小說後產生的合集檔案。如果你想讓合集檔案不建立資料夾，可以在"更多"-"命名"裡修改"
合併系列小說時的命名規則"。`,
    `After enabling this setting, files that meet the conditions will not have a folder created for them, and will instead be saved directly to the browser's download directory.<br>
<br>
Sub-options:<br>
- When downloading 1 image from an illustration or manga: If you download only 1 image from this work, no folder will be created for that image. Each work is counted separately.<br>
- When downloading multiple images from an illustration or manga: If you download multiple images from this work, no folder will be created for those images. Each work is counted separately.<br>
- Ugoira: No folder will be created for Ugoira works.<br>
- Novel: No folder will be created for a single novel work.<br>
<br>
Tip:<br>
If you enable all sub-options, then no folders will be created for any works.<br>
This setting does not apply to collection files generated after merging a novel series. If you want collection files to be saved without creating folders, you can change the "
Naming rule when merging a novel series" in "More"-"Naming".`,
    `この設定を有効にすると、条件に合うファイルはフォルダを作成せず、ブラウザのダウンロードフォルダに直接保存されます。<br>
<br>
子オプション：<br>
- イラスト・漫画から 1 枚ダウンロードするとき：この作品から 1 枚だけダウンロードした場合、その画像用のフォルダは作成されません。作品ごとに個別で判定されます。<br>
- イラスト・漫画から複数の画像をダウンロードするとき：この作品から複数の画像をダウンロードした場合、それらの画像用のフォルダは作成されません。作品ごとに個別で判定されます。<br>
- 動画：Ugoira 作品用のフォルダは作成されません。<br>
- 小説：単体の小説作品用のフォルダは作成されません。<br>
<br>
ヒント：<br>
すべての子オプションを有効にすると、どの作品でもフォルダは作成されなくなります。<br>
この設定は、シリーズ小説を結合したあとに生成される合集ファイルには適用されません。合集ファイルでフォルダを作成しないようにしたい場合は、"その他"-"命名" で "
シリーズ小説を結合するときの命名規則" を変更してください。`,
    `이 설정을 켜면 조건에 맞는 파일은 폴더를 만들지 않고, 브라우저의 다운로드 폴더에 바로 저장됩니다.<br>
<br>
하위 옵션:<br>
- 일러스트 또는 만화에서 이미지 1장을 다운로드할 때: 이 work에서 이미지를 1장만 다운로드했다면, 그 이미지용 폴더를 만들지 않습니다. 각 work마다 따로 계산됩니다.<br>
- 일러스트 또는 만화에서 여러 장의 이미지를 다운로드할 때: 이 work에서 이미지를 여러 장 다운로드했다면, 그 이미지들용 폴더를 만들지 않습니다. 각 work마다 따로 계산됩니다.<br>
- Ugoira: Ugoira work용 폴더를 만들지 않습니다.<br>
- 소설: 단일 novel work용 폴더를 만들지 않습니다.<br>
<br>
안내:<br>
모든 하위 옵션을 켜면 어떤 work도 폴더를 만들지 않습니다.<br>
이 설정은 시리즈 novel을 병합한 뒤 생성되는 모음 파일에는 적용되지 않습니다. 모음 파일도 폴더를 만들지 않게 하려면 "더보기"-"명명" 에서 "
시리즈 novel 병합 시 명명 규칙" 을 수정하면 됩니다。`,
    `После включения этой настройки для подходящих файлов папки создаваться не будут, и они будут сохраняться прямо в папку загрузок браузера.<br>
<br>
Подпункты:<br>
- При скачивании 1 изображения из иллюстрации или манги: если вы скачали только 1 изображение из этой работы, папка для него создаваться не будет. Каждая работа считается отдельно.<br>
- При скачивании нескольких изображений из иллюстрации или манги: если вы скачали несколько изображений из этой работы, папка для этих изображений создаваться не будет. Каждая работа считается отдельно.<br>
- Ugoira: для работ Ugoira папка создаваться не будет.<br>
- Novel: для отдельной работы-романа папка создаваться не будет.<br>
<br>
Подсказка:<br>
Если вы включите все подпункты, папки не будут создаваться ни для каких работ.<br>
Эта настройка не применяется к файлам-сборникам, созданным после объединения серии novel. Если вы хотите, чтобы для файлов-сборников тоже не создавались папки, можно изменить "
Правила названий при объединении серии novel" в разделе "Ещё"-"Именование".`,
  ],
  _搜索页面页数限制: [
    '由于 pixiv 的限制，下载器最多只能抓取到第 {} 页。',
    '由於 pixiv 的限制，下載器最多只能擷取到第 {} 頁。',
    'Due to the limitation of pixiv, the downloader can only crawl up to the {}th page.',
    'pixiv の制限により、ダウンローダーは {} ページ目までしかクロールできません。',
    'pixiv 제한으로 인해 최대 {} 페이지까지만 다운로드 받을 수 있습니다.',
    'Из-за ограничений pixiv загрузчик может сканировать только до {}-й страницы',
  ],
  _获取图片的宽高时出现错误: [
    '获取图片的宽高时出现错误：',
    '獲取圖片的寬高時出現錯誤：',
    'An error occurred while getting the width and height of the image:',
    '画像の幅と高さの取得中にエラーが発生しました：',
    '이미지의 너비를 가져오는 도중 오류가 발생했습니다:',
    'Произошла ошибка при получении ширины и высоты изображения:',
  ],
  _上限: ['上限', '上限', 'Upper limit', '上限', '상한', 'Верхний предел'],
  _预览搜索结果的数量达到上限的提示: [
    '预览搜索结果的数量已经达到上限，剩余的结果不会显示。',
    '預覽搜尋結果的數量已經達到上限，剩餘的結果不會顯示。',
    'The number of preview search results has reached the upper limit, and the remaining results will not be displayed.',
    'プレビュー検索結果の数が上限に達し、残りの結果は表示されません。',
    '미리보기 검색 결과 수가 상한에 도달하여, 남은 결과는 표시되지 않습니다.',
    'Количество результатов предварительного поиска достигло верхнего предела, и оставшиеся результаты не будут отображаться.',
  ],
  _新增命名标记: [
    '新增命名标记',
    '新增命名標記',
    'Add named tag',
    '名前付きタグを追加',
    '명명된 태그 추가',
    'Добавить именованный тег',
  ],
  _自定义用户名: [
    '自定义<span class="key">用户名</span>',
    '自訂<span class="key">使用者名稱</span>',
    'Customize <span class="key">username</span>',
    '<span class="key">カスタム</span>ユーザー名',
    '사용자 정의 <span class="key">유저명</span>',
    'Настроить <span class="key">имя пользователя</span>',
  ],
  _自定义用户名的说明: [
    `有些用户可能会改名，如果你想使用他原来的名字，你可以在这里手动设置他的名字。<br>
    你也可以为用户设置别名。<br>
    当你在命名规则中使用 {user} 标记时，下载器会优先使用你设置的名字。`,
    `有些使用者可能會改名，如果你想使用他原來的名字，你可以在這裡手動設定他的名字。<br>
    你也可以為使用者設定別名。<br>
    當你在命名規則中使用 {user} 標記時，下載器會優先使用你設定的名字。`,
    `Some users may change their name. If you want to use his original name, you can manually set his name here. <br>
    You can also set aliases for users. <br>
    When you use the {user} tag in the naming rule, the downloader will give priority to the name you set.`,
    `ユーザーによっては名前を変更する場合があります。元の名前を使いたい場合は、ここで名前を手動で設定することができます。<br>
    また、ユーザーの別名を設定することも可能です。<br>
    命名規則で {user} タグを使用すると、ダウンローダーは設定された名前を優先的に使用します。`,
    `일부 유저는 이름을 바꿀 수 있습니다. 만약 당신이 그의 원래 이름을 사용하고 싶다면, 당신은 여기에서 그의 이름을 수동으로 설정할 수 있습니다.<br>
    사용자의 별칭을 설정할 수도 있습니다. <br>
    명명 규칙에 {user} 태그를 사용할 때 다운로드더가 사용자 정의 유저명을 우선시합니다.`,
    `Некоторые пользователи могут изменить свое имя. Если вы хотите использовать его оригинальное имя, вы можете вручную задать его имя здесь. <br>
    Вы также можете задать псевдонимы для пользователей. <br>
    Когда вы используете тег {user} в правиле именования, загрузчик будет отдавать приоритет имени, которое вы задали.`,
  ],
  _移除用户名中的at和后续字符: [
    '移除用户名中的 <span class="key">@</span> 和后续字符',
    '移除使用者名稱中的 <span class="key">@</span> 和後續字元',
    'Remove <span class="key">@</span> and subsequent characters in username',
    'ユーザー名から <span class="key">@</span> 以降の文字を削除する',
    '유저명에서 <span class="key">@</span>와 후속 문자 제거',
    'Удалить <span class="key">@</span> и последующие символы в имени пользователя',
  ],
  _移除用户名中的at和后续字符的说明: [
    '例如：Anmi@画集発売中 → Anmi',
    '例如：Anmi@画集発売中 → Anmi',
    'For example：Anmi@画集発売中 → Anmi',
    '例：Anmi@画集発売中 → Anmi',
    '예: Anmi@画集発売中 → Anmi',
    'Например: Anmi@画集発売中 → Anmi',
  ],
  _抓取被限制时返回空结果的提示: [
    'Pixiv 返回了空数据。下载器已暂停抓取，并且会在等待几分钟后继续抓取。(429)<br>这说明您的账号被 Pixiv 限制访问了，等待几分钟即可恢复正常。',
    'Pixiv 返回了空資料。下載器已暫停抓取，並且會在等待幾分鐘後繼續抓取。(429)<br>這說明您的賬號被 Pixiv 限制訪問了，等待幾分鐘即可恢復正常。',
    'Pixiv returned empty data. The downloader has paused crawling and will resume crawling after a few minutes. (429)<br>This means that your account has been restricted by Pixiv, please wait for a few minutes for it to return to normal.',
    'Pixivが空のデータを返しました。 ダウンローダーはクロールを一時停止し、数分後にクロールを再開します。(429)<br>これは、あなたのアカウントが Pixiv によって制限されていることを意味します。通常の状態に戻るまで数分お待ちください。',
    'Pixiv가 빈 데이터를 반환했습니다. 다운로더가 긁어오기를 일시 중지하고 몇 분 동안 기다린 후 긁어오기를 계속합니다. (429)<br>이것은 귀하의 계정이 Pixiv에 의해 제한되었음을 의미합니다. 정상으로 돌아갈 때까지 몇 분 정도 기다리십시오.',
    'Pixiv вернул пустые данные. Загрузчик приостановил загрузку и возобновит ее через несколько минут. (429)<br>Это означает, что ваша учетная запись была ограничена Pixiv, подождите несколько минут, пока она вернется в нормальное состояние.',
  ],
  _提示启用减慢抓取速度功能: [
    '💡您可以启用“减慢抓取速度”功能来减少 429 问题出现的概率。',
    '💡您可以啟用“減慢抓取速度”功能來減少 429 問題出現的機率。',
    '💡You can reduce the chances of 429 issues by enabling the "Slow down crawl" feature.',
    '💡"クロールを遅くする" 機能を有効にすると、429 の問題が発生する可能性を減らすことができます。',
    '💡"천천히 크롤링" 기능을 활성화하면 429 문제 발생 가능성을 줄일 수 있습니다.',
    '💡Вы можете снизить вероятность возникновения ошибок 429, включив функцию «Замедлить сканирование».',
  ],
  _搜索模式: [
    '搜索模式',
    '搜尋模式',
    'Search mode',
    '検索モード',
    '검색 모드',
    'Режим поиска',
  ],
  _标签部分一致: [
    '标签（部分一致）',
    '標籤（部分一致）',
    'Tags (partial match)',
    'タグ（部分一致）',
    '태그 (부분 일치)',
    'Теги (частичное совпадение)',
  ],
  _标签完全一致: [
    '标签（完全一致）',
    '標籤（完全一致）',
    'Tags (perfect match)',
    'タグ（完全一致）',
    '태그 (완전 일치)',
    'Теги (идеальное совпадение)',
  ],
  _标题说明文字: [
    '标题、说明文字',
    '標題、說明文字',
    'Title, Caption',
    'タイトル・キャプション',
    '제목, 설명',
    'Название, Подпись',
  ],
  _正文: ['正文', '本文', 'Text', '本文', '본문', 'Текст'],
  _标签标题说明文字: [
    '标签、标题、说明文字',
    '標籤、標題、說明文字',
    'Tags, Titles, Captions',
    'タグ・タイトル・キャプション',
    '태그, 제목, 설명',
    'Теги, Заголовки, Подписи',
  ],
  _save_file_failed_tip: [
    `{} 保存失败，code：{}。下载器将会重试下载这个文件。`,
    `{} 儲存失敗，code：{}。下載器將會重試下載這個檔案。`,
    `{} save failed, code: {}. The downloader will retry to download the file.`,
    `{} 保存に失敗しました。code：{}。ダウンローダーはファイルのダウンロードを再試行します。`,
    `{} 저장에 실패했습니다. 코드: {}. 다운로드더가 파일 다운로드를 다시 시도합니다.`,
    `{} сохранение не удалось, код: {}. Загрузчик повторит попытку загрузить файл.`,
  ],
  _user_canceled_tip: [
    `{} 未保存，code：{}。`,
    `{} 未儲存，code：{}。`,
    `{} not saved, code: {}.`,
    `{} 保存されていません。code：{}。`,
    `{} 저장되지 않음, 코드: {}.`,
    `{} не сохранено, код: {}.`,
  ],
  _FILE_FAILED_tip: [
    '可能是文件名太长，或是其他原因导致文件保存失败。你可以尝试启用高级设置里的“文件名长度限制”。',
    '可能是檔名太長，或是其他原因導致檔案儲存失敗。你可以嘗試啟用高階設定裡的“檔案名稱長度限制”。',
    'Maybe the file name is too long, or other reasons cause the file to fail to save. You can try enabling "File name length limit" in advanced settings.',
    'ファイル名が長すぎるか、他の理由でファイルの保存に失敗した可能性があります。 詳細設定で「ファイル名の長さ制限」を有効にしてみてください。',
    '파일명이 너무 길거나 다른 이유로 저장에 실패한 것 같습니다. 고급 설정에서 "파일명 길이 제한"을 사용하도록 설정할 수 있습니다.',
    'Возможно, имя файла слишком длинное, или по другим причинам файл не удается сохранить. Вы можете попробовать включить "Ограничение длины имени файла". в расширенных настройках.',
  ],
  _显示摘要信息: [
    '显示摘要信息',
    '顯示摘要資訊',
    'Show summary',
    '要約情報を表示する',
    '요약 정보 표시',
    'Показать сводку',
  ],
  _显示更大的缩略图: [
    '显示<span class="key">更大</span>的缩略图',
    '顯示<span class="key">更大</span>的縮圖',
    'Show <span class="key">larger</span> thumbnails',
    '<span class="key">大きな</span>サムネイルを表示する',
    '<span class="key">더 큰</span> 썸네일 표시',
    'Показывать <span class="key">большие</span> миниатюры',
  ],
  _显示更大的缩略图的说明: [
    'Pixiv 默认的缩略图比较小，下载器可以显示更大的缩略图以方便预览。<br>这个功能不太稳定，因为 Pixiv 的代码更新可能会导致此功能部分失效。',
    'Pixiv 預設的縮圖比較小，下載器可以顯示更大的縮圖以方便預覽。<br>這個功能不太穩定，因為 Pixiv 的程式碼更新可能會導致此功能部分失效。',
    `Pixiv's default thumbnails are relatively small, and the downloader can display larger thumbnails for easier preview.<br>This feature is not very stable, because Pixiv's code updates may cause this feature to partially fail.`,
    'Pixiv のデフォルトのサムネイルは比較的小さく、ダウンローダーはプレビューを容易にするために大きなサムネイルを表示できます。<br>この機能はあまり安定しておらず、Pixiv のコード更新によりこの機能が部分的に失敗する可能性があります。',
    'Pixiv의 기본 썸네일은 비교적 작고, 다운로더는 더 큰 썸네일을 표시하여 더 쉽게 미리 볼 수 있습니다.<br>이 기능은 그다지 안정적이지 않습니다. Pixiv의 코드 업데이트로 인해 이 기능이 부분적으로 실패할 수 있기 때문입니다.',
    'Миниатюры Pixiv по умолчанию относительно небольшие, а загрузчик может отображать более крупные миниатюры для более удобного предварительного просмотра.<br>Эта функция не очень стабильна, поскольку обновления кода Pixiv могут привести к частичному сбою этой функции.',
  ],
  _该功能默认启用: [
    '这个功能默认启用。',
    '這個功能預設啟用。',
    'This feature is enabled by default.',
    'この機能はデフォルトで有効になっています。',
    '이 기능은 기본적으로 활성화됩니다.',
    'Эта функция включена по умолчанию.',
  ],
  _默认未启用: [
    '默认未启用。',
    '預設未啟用。',
    'It is disabled by default.',
    'デフォルトでは有効になっていません。',
    '기본값이 비활성화되어 있습니다.',
    'По умолчанию не работает.',
  ],
  _你可以在更多选项卡的xx分类里找到它: [
    '你可以在“更多”选项卡 → “{}”分类里找到它。（需要先启用“显示高级设置”）',
    '你可以在“更多”選項卡 → “{}”分類裡找到它。（需要先啟用“顯示進階設定”）',
    'You can find it in the "More" tab → "{}" category. ("Show advanced settings" needs to be enabled first)',
    '[もっと]タブ→[{}]カテゴリにあります。（最初に「詳細設定を表示」を有効にする必要があります）',
    '"더보기" 탭 → "{}" 카테고리에서 찾을 수 있습니다. ("고급 설정 보기"를 먼저 활성화해야 합니다.)',
    'Вы можете найти его в разделе "Еще". вкладка → "{}" категория. ("Показать расширенные настройки" необходимо сначала включить)',
  ],
  _你可以在xx选项卡里找到它: [
    '你可以在“{}”选项卡里找到它。',
    '你可以在“{}”選項卡裡找到它。',
    'You can find it in the "{}" tab.',
    '「{}」タブにあります。',
    '"{}" 탭에서 찾을 수 있습니다.',
    'Вы можете найти его на вкладке "{}".',
  ],
  _你可以在xx选项卡里找到它并需要启用高级设置: [
    '你可以在“{}”选项卡里找到它。（需要先启用“显示高级设置”）',
    '你可以在“{}”選項卡裡找到它。（需要先啟用“顯示進階設定”）',
    'You can find it in the "{}" tab. ("Show advanced settings" needs to be enabled first)',
    '「{}」タブにあります。（最初に「詳細設定を表示」を有効にする必要があります）',
    '"{}" 탭에서 찾을 수 있습니다. ("고급 설정 보기"를 먼저 활성화해야 합니다.)',
    'Вы можете найти его на вкладке "{}". ("Показать расширенные настройки" необходимо сначала включить)',
  ],
  _使用鼠标滚轮切换作品里的图片: [
    '使用鼠标滚轮切换多图作品里的图片',
    '使用滑鼠滾輪切換多圖作品裡的圖片',
    'Use the mouse wheel to switch images in multi-image works',
    'マウスホイールを使用して、マルチイメージ作品のイメージを切り替えます',
    '마우스 휠을 사용하여 여러 이미지 작품에서 이미지 전환',
    'Используйте колесико мыши для переключения изображений в работах с несколькими изображениями',
  ],
  _这可能会阻止页面滚动: [
    '这可能会阻止页面滚动',
    '這可能會阻止頁面滾動',
    'This might stop the page from scrolling',
    'ページのスクロールを妨げる可能性があります',
    '이 기능은 페이지를 스크롤하지 못하게 할 수 있습니다.',
    'Это может остановить прокрутку страницы',
  ],
  _动图转换失败的提示: [
    '动图转换失败，id：{}',
    '動圖轉換失敗，id：{}',
    'Ugoira(animation) conversion failed, id: {}',
    'うごイラの変換に失敗しました、id：{}',
    '움직이는 일러스트 변환에 실패했습니다, ID: {}',
    'Не удалось преобразовать Ugoira(анимацию), идентификатор: {}',
  ],
  _动图不能转换为WEBM视频的提示: [
    '作品 ID {} 不能转换为 WEBM 视频，因为它的某一帧延迟大于 32767 毫秒。下载器会把它转换为 GIF 图像。',
    '作品 ID {} 不能轉換為 WEBM 影片，因為它的某一幀延遲大於 32767 毫秒。下載器會把它轉換為 GIF 影象。',
    'Work ID {} cannot be converted to WEBM video because it has a frame duration greater than 32767 ms. The downloader will convert it into a GIF image.',
    'ワークid {} は、32767ミリ秒以上のフレーム長を持つため、webm動画に変換できません。ダウンローダはそれをgif画像に変換します。',
    '작업 ID {}의 프레임 지속 시간이 32767 ms보다 크기 때문에 WEBM 비디오로 변환할 수 없습니다.다운로더가 GIF 이미지로 변환해 줍니다.',
    'Рабочий ID {} не может быть преобразован в WEBM видео, потому что он имеет длительность кадров более 32767 мс. Загрузчик преобразует его в изображение GIF.',
  ],
  _作品id无法下载带状态码: [
    '{} 无法下载，状态码：{}',
    '{} 無法下載，狀態碼：{}',
    '{} failed to download, status code: {}',
    '{} ダウンロードに失敗しました、ステータスコード：{}',
    '{} 다운로드할 수 없습니다, 상태 코드: {}',
    '{} не удалось загрузить, код состояния: {}',
  ],
  _下载器不会再重试下载它: [
    '下载器不会重试下载它。如果你有需要的话，可以稍后尝试单独下载这个作品。',
    '下載器不會重試下載它。如果你有需要的話，可以稍後嘗試單獨下載這個作品。',
    'The downloader will not retry downloading it. If needed, you can try downloading this work separately later.',
    'ダウンローダーはそれを再試行してダウンロードしません。必要であれば、後でこの作品を個別にダウンロードしてみることができます。',
    '다운로더는 그것을 다시 다운로드하지 않습니다. 필요하다면 나중에 이 작품을 개별적으로 다운로드할 수 있습니다.',
    'Загрузчик не будет пытаться скачать его снова. При необходимости вы можете попробовать скачать эту работу отдельно позже.',
  ],
  _下载器会暂时跳过它: [
    '下载器会暂时跳过它，并在其他文件下载完毕后重试下载它。',
    '下載器會暫時跳過它，並在其他檔案下載完畢後重試下載它。',
    'The downloader will temporarily skip it and retry downloading it after other files are downloaded.',
    'ダウンローダーは一時的にそれをスキップし、他のファイルのダウンロードが完了した後に再試行します。',
    '다운로더는 일시적으로 그것을 건너뛰고 다른 파일 다운로드가 완료된 후 다시 시도합니다.',
    'Загрузчик временно пропустит его и попробует скачать снова после завершения загрузки других файлов.',
  ],
  _作品总数为0: [
    `作品总数为 0。请检查页面上显示的作品总数是否为 0。<br>
如果页面上显示的作品数量大于 0，可能是 Pixiv 拒绝了此次抓取，你可以等待几分钟后重试。`,
    `作品總數為 0。請檢查頁面上顯示的作品總數是否為 0。<br>
如果頁面上顯示的作品數量大於 0，可能是 Pixiv 拒絕了此次抓取，你可以等待幾分鐘後重試。`,
    `Total number of works is 0. Please check if the total number of works displayed on the page is 0.<br>
If the number of works shown on the page is greater than 0, it may be that Pixiv rejected this crawl attempt. You can wait a few minutes and try again.`,
    `作品総数が 0 です。ページに表示されている作品総数が 0 かどうか確認してください。<br>
ページに表示されている作品数が 0 より大きい場合、Pixiv が今回のクロールを拒否した可能性があります。数分待ってから再試行してください。`,
    `작품 총 수가 0입니다. 페이지에 표시된 작품 총 수가 0인지 확인해 주세요.<br>
페이지에 표시된 작품 수가 0보다 크다면 Pixiv가 이번 크롤링을 거부한 것일 수 있습니다. 몇 분 후에 다시 시도해 보세요.`,
    `Общее количество работ равно 0. Пожалуйста, проверьте, действительно ли на странице отображается общее количество работ равное 0.<br>
Если на странице показано больше 0 работ, возможно, Pixiv отклонил эту попытку краулинга. Подождите несколько минут и попробуйте снова.`,
  ],
  _优化预览作品功能: [
    '优化“预览作品”功能',
    '最佳化“預覽作品”功能',
    'Optimize the "Preview Works" function',
    '「作品のプレビュー」機能を最適化する',
    '"작품 미리보기" 기능 최적화',
    'Оптимизация "Предварительного просмотра работ" функция',
  ],
  _年龄限制: [
    '<span class="key">年龄</span>限制',
    '<span class="key">年齡</span>限制',
    '<span class="key">Age</span> restriction',
    '<span class="key">年齢</span>制限',
    '<span class="key">연령</span> 제한',
    '<span class="key">Возраст</span> ограничение',
  ],
  _收藏状态: [
    '<span class="key">收藏</span>状态',
    '<span class="key">收藏</span>狀態',
    '<span class="key">Bookmark</span> status',
    '<span class="key">ブックマーク</span>ステータス',
    '<span class="key">북마크</span> 상태',
    'Статус <span class="key">закладки</span>',
  ],
  _图片色彩: [
    '图片<span class="key">色彩</span>',
    '圖片<span class="key">色彩</span>',
    'Image <span class="key">color</span>',
    '画像の<span class="key">色</span>',
    '이미지 <span class="key">색채</span>',
    '<span class="key">Цвет</span> изображения',
  ],
  _图片数量: [
    '图片<span class="key">数量</span>',
    '圖片<span class="key">數量</span>',
    '<span class="key">Number</span> of images',
    '画像の<span class="key">数</span>',
    '이미지 <span class="key">수</span>',
    '<span class="key">Количество</span> изображений',
  ],
  _图片数量2: [
    '图片数量',
    '圖片數量',
    'Number of images',
    '画像の数',
    '이미지 수',
    'Количество изображений',
  ],
  _不抓取多图作品的最后一张图片: [
    '不抓取多图作品的<span class="key">最后一张</span>图片',
    '不抓取多圖作品的<span class="key">最後一張</span>圖片',
    'Do not crawl the <span class="key">last image</span> of multi-image works',
    'マルチ画像作品の<span class="key">最後の画像</span>をつかまないでください',
    '여러 이미지의 <span class="key">마지막 이미지</span> 긁어오지 않기',
    'Не сканировать <span class="key">последнее изображение</span> в много картинных работах',
  ],
  _下载小说的封面图片: [
    `下载小说的<span class="key">封面</span>图片`,
    `下載小說的<span class="key">封面</span>圖片`,
    `Download the novel's <span class="key">cover</span> image`,
    `小説の<span class="key">表紙</span>画像をダウンロード`,
    `소설의 <span class="key">표지</span> 이미지 다운로드`,
    `Скачать <span class="key">обложку</span> изображения романа`,
  ],
  _预览动图: [
    '<span class="key">预览</span>动图',
    '<span class="key">預覽</span>動圖',
    '<span class="key">Preview</span> Ugoira',
    '<span class="key">うごイラ</span>のプレビュー',
    '움직이는 일러스트 <span class="key">미리보기</span>',
    '<span class="key">Превью</span> Ugoira(анимации)',
  ],
  _过度访问警告: [
    `下载器检测到你可能收到了 Pixiv 的警告消息（站内信），这通常是因为过度下载导致的。<br>多次被警告可能会导致你的 Pixiv 账号被封禁。<br>下载器已暂停下载。<br>你可以在 Wiki 查看更详细的说明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E5%AE%89%E8%A3%85%E4%B9%8B%E5%90%8E?id=%E5%A4%A7%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%8F%AF%E8%83%BD%E5%AF%BC%E8%87%B4%E4%BD%A0%E7%9A%84%E8%B4%A6%E5%8F%B7%E8%A2%AB%E5%B0%81%E7%A6%81" target="_blank" class="blue">大量下载可能导致你的账号被封禁</a>`,
    `下載器檢測到你可能收到了 Pixiv 的警告消息（站內信），這通常是因為過度下載導致的。<br>多次被警告可能會導致你的 Pixiv 帳號被封禁。<br>下載器已暫停下載。<br>你可以在 Wiki 查看更詳細的說明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E5%AE%89%E8%A3%85%E4%B9%8B%E5%90%8E?id=%E5%A4%A7%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%8F%AF%E8%83%BD%E5%AF%BC%E8%87%B4%E4%BD%A0%E7%9A%84%E8%B4%A6%E5%8F%B7%E8%A2%AB%E5%B0%81%E7%A6%81" target="_blank" class="blue">大量下载可能导致你的账号被封禁</a>`,
    `The downloader has detected that you may have received a warning message from Pixiv (in-site message), which is usually caused by excessive downloading.<br>Being warned multiple times may lead to your Pixiv account being banned.<br>The downloader has paused downloading.<br>You can view more detailed instructions in the Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/AfterInstallation?id=large-downloads-may-lead-to-your-account-being-banned" target="_blank" class="blue">Large Downloads May Lead to Your Account Being Banned</a>`,
    `ダウンロードツールが Pixiv からの警告メッセージ（サイト内メッセージ）を受信した可能性を検出しました。これは通常、過度なダウンロードが原因です。<br>複数回の警告は Pixiv アカウントの凍結につながる可能性があります。<br>ダウンロードツールはダウンロードを一時停止しました。<br>Wiki で詳細な説明を確認できます：<a href="https://xuejianxianzun.github.io/PBDWiki/#/en/AfterInstallation?id=large-downloads-may-lead-to-your-account-being-banned" target="_blank" class="blue">Large Downloads May Lead to Your Account Being Banned</a>`,
    `다운로더가 Pixiv의 경고 메시지(사이트 내 메시지)를 받았을 가능성을 감지했습니다. 이는 보통 과도한 다운로드로 인한 것입니다.<br>여러 번 경고를 받으면 Pixiv 계정이 차단될 수 있습니다.<br>다운로더가 다운로드를 일시 중지했습니다.<br>Wiki에서 더 자세한 설명을 확인할 수 있습니다: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/AfterInstallation?id=large-downloads-may-lead-to-your-account-being-banned" target="_blank" class="blue">Large Downloads May Lead to Your Account Being Banned</a>`,
    `Загрузчик обнаружил, что вы, возможно, получили предупреждение от Pixiv (сообщение на сайте), что обычно вызвано чрезмерной загрузкой.<br>Многократные предупреждения могут привести к блокировке вашего аккаунта Pixiv.<br>Загрузчик приостановил загрузку.<br>Вы можете просмотреть более подробные инструкции в Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/AfterInstallation?id=large-downloads-may-lead-to-your-account-being-banned" target="_blank" class="blue">Large Downloads May Lead to Your Account Being Banned</a>`,
  ],
  _下载小说里的内嵌图片: [
    '下载小说里的<span class="key">内嵌</span>图片',
    '下載小說裡的<span class="key">內嵌</span>圖片',
    'Download <span class="key">embedded</span> images in novels',
    '小説に<span class="key">埋め込まれた</span>画像をダウンロードする',
    '소설에서 <span class="key">인라인</span> 이미지 다운로드',
    'Загрузка <span class="key">вложенных</span> изображений в новеллах',
  ],
  _其他优化: [
    '其他优化。',
    '其他最佳化。',
    'Other optimizations.',
    'その他の最適化。',
    '기타 최적화.',
    'Другие оптимизации.',
  ],
  _没有可用的抓取结果: [
    '没有可用的抓取结果',
    '沒有可用的抓取結果',
    'No crawl results available',
    'クロール結果がありません',
    '사용 가능한 크롤링 결과가 없습니다.',
    'Результаты сканирования недоступны',
  ],
  _查看作品大图时的快捷键: [
    `查看作品大图时，按快捷键 <span class="blue">D</span> 可以下载这个作品。
    <br>
    按快捷键 <span class="blue">C</span> 仅下载当前显示的这张图片。
    <br>
    <span class="blue">Alt</span> + <span class="blue">C</span> 复制当前预览的图片和作品信息。
    <br>
    `,
    `檢視作品大圖時，按快捷鍵 <span class="blue">D</span> 可以下載這個作品。
    <br>
    按快捷鍵 <span class="blue">C</span> 僅下載當前顯示的這張圖片。
    <br>
    <span class="blue">Alt</span> + <span class="blue">C</span> 複製當前預覽的圖片和作品資訊。
    <br>
    `,
    `When viewing the large image of the work, press the shortcut key <span class="blue">D</span> to download the work.
    <br>
    Press the shortcut key <span class="blue">C</span> to download only the currently displayed image.
    <br>
    <span class="blue">Alt</span> + <span class="blue">C</span> Copy the currently previewed image and work information.
    <br>
    `,
    `作品の大きな画像をご覧になる場合、ショートカット キー <span class="blue">D</span> を押すと、作品をダウンロードできます。
    <br>
    ショートカット キー <span class="blue">C</span> を押して、現在表示されている画像のみをダウンロードします。
    <br>
    <span class="blue">Alt</span> + <span class="blue">C</span> 現在プレビュー中の画像と作品情報をコピー。
    <br>
    `,
    `작품의 큰 그림을 볼 때 단축키 <span class="blue">D</span>를 누르면 작품을 다운로드할 수 있습니다. 
    <br>
    현재 표시된 이미지만 다운로드하려면 단축키 <span class="blue">C</span>를 누르세요.
    <br>
    <span class="blue">Alt</span> + <span class="blue">C</span> 현재 미리보기 중인 이미지와 작품 정보를 복사.
    <br>
    `,
    `При просмотре большого изображения работы нажмите горячую клавишу <span class="blue">D</span>, чтобы загрузить работу. 
    <br>
    Нажмите горячую клавишу <span class="blue">C</span>, чтобы загрузить только отображаемое в данный момент изображение.
    <br>
    <span class="blue">Alt</span> + <span class="blue">C</span> Скопировать изображение текущего предпросмотра и информацию о работе.
    <br>
    `,
  ],
  _定时抓取: [
    '定时抓取',
    '定時抓取',
    'Timed crawl',
    '時限クロール',
    '시간 제한 크롤링',
    'Сканирование по таймеру',
  ],
  _定时抓取说明: [
    '每隔一定时间，自动开始抓取和下载。',
    '每隔一定時間，自動開始抓取和下載。',
    'Automatically start crawling and downloading at regular intervals.',
    '定期的にクロールとダウンロードを自動的に開始します。',
    '정기적으로 자동으로 크롤링 및 다운로드를 시작합니다.',
    'Автоматически запускать сканирование и загрузку через регулярные промежутки времени',
  ],
  _定时抓取的间隔时间的说明: [
    '在一些页面里有“定时抓取”按钮，即每隔一定时间，自动开始抓取和下载。<br>你可以在这里设置每次抓取的间隔时间。',
    '在一些頁面裡有“定時抓取”按鈕，即每隔一定時間，自動開始抓取和下載。<br>你可以在這裡設定每次抓取的間隔時間。',
    'There is a "Timed crawl" button on some pages, which automatically starts crawling and downloading at a certain interval. <br>You can set the interval time for each crawl here.',
    '一部のページには「時限クロール」ボタンがあり、一定の間隔で自動的にクロールとダウンロードを開始します。<br>ここで、各クロールの間隔時間を設定できます。',
    '일부 페이지에는 "시간 제한 크롤링" 버튼이 있는데, 이를 누르면 일정 간격으로 크롤링과 다운로드가 자동으로 시작됩니다. <br>여기에서 각 크롤링의 간격을 설정할 수 있습니다.',
    'На некоторых страницах есть кнопка «Сканирование по таймеру», которая автоматически запускает сканирование и загрузку с определенным интервалом. <br>Здесь вы можете установить интервал времени для каждого сканирования.',
  ],
  _定时抓取已启动的提示: [
    '定时抓取已启动，间隔时间：{} 分钟。<br>如果你想修改间隔时间，可以在“更多”选项卡里修改设置：定时抓取的间隔时间。',
    '定時抓取已啟動，間隔時間：{} 分鐘。<br>如果你想修改間隔時間，可以在“更多”選項卡里修改設定：定時抓取的間隔時間。',
    'Timed crawl started, interval: {} minutes.<br>If you want to modify the interval time, you can modify the settings in the "More" tab: The interval time of timed crawl.',
    '時限クロールが開始されました。間隔: {} 分。<br>間隔時間を変更したい場合は、[詳細] タブの設定 (時間指定クロールの間隔時間) を変更できます。',
    '시간 제한 크롤링이 시작되었습니다. 간격: {}분. <br>간격 시간을 수정하려면 "자세히" 탭에서 예약된 크롤링 간격 설정을 수정할 수 있습니다.',
    'Таймер сканирования запущен, интервал: {} минут.<br>Если вы хотите изменить интервал времени, вы можете изменить настройки на вкладке «Дополнительно»: Интервальное время сканирования с таймером.',
  ],
  _定时抓取的推荐用法: [
    `推荐用法：增量抓取新作品。例如在关注的用户的新作品页面里，或者搜索页面里，设置抓取页数为 2，然后启动定时抓取。这样下载器可以自动下载新作品。<br>建议启用“不抓取下载过的作品”和“不下载重复文件”功能，以提高效率。`,
    `推薦用法：增量抓取新作品。例如在關注用戶的新作品頁面裡，或者搜索頁面裡，設定抓取頁數為 2，然後啟動定時抓取。這樣下載器可以自動下載新作品。<br>建議啟用「不抓取下載過的作品」和「不下載重複檔案」功能，以提高效率。`,
    `Recommended usage: Incrementally crawl new works. For example, on the new works page of followed users, or on the search page, set the number of crawl pages to 2, then start timed crawling. This way the downloader can automatically download new works.<br>It is recommended to enable the "Do not crawl downloaded works" and "Do not download duplicate files" features to improve efficiency.`,
    `おすすめの使い方：新作を増分クロールします。例えばフォローしているユーザーの新作ページや検索ページで、クロールページ数を2に設定し、定時クロールを開始します。これによりダウンローダーが新作を自動的にダウンロードできます。<br>効率を高めるため、「ダウンロード済みの作品をクロールしない」と「重複ファイルをダウンロードしない」機能を有効にすることをおすすめします。`,
    `추천 사용법: 증분으로 새 작품을 크롤링합니다. 예를 들어 팔로우한 사용자의 새 작품 페이지나 검색 페이지에서 크롤링 페이지 수를 2로 설정한 후 정기 크롤링을 시작하세요. 이렇게 하면 다운로더가 새 작품을 자동으로 다운로드할 수 있습니다.<br>효율성을 높이기 위해 "다운로드된 작품을 크롤링하지 않음"과 "중복 파일 다운로드하지 않음" 기능을 활성화하는 것을 권장합니다.`,
    `Рекомендуемый способ использования: Инкрементный краулинг новых работ. Например, на странице новых работ отслеживаемых пользователей или на странице поиска установите количество страниц для краулинга равным 2, а затем запустите периодический краулинг. Таким образом загрузчик сможет автоматически скачивать новые работы.<br>Рекомендуется включить функции «Не краулить загруженные работы» и «Не загружать повторяющиеся файлы» для повышения эффективности.`,
  ],
  _定时抓取已启动的提示2: [
    '在定时抓取时，将这个标签页静置即可。不要改变这个标签页的 URL，否则抓取结果可能不符合预期。<br><br>如果这个扩展程序自动更新了，那么这个页面将不能正常下载文件（需要刷新页面来恢复正常）。 如果你想长期执行定时抓取任务，建议安装下载器的离线版本，以免因为自动更新而导致问题。<br>你可以在这里下载离线安装包：<a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">Releases page</a>',
    '在定時抓取時，將這個標籤頁靜置即可。不要改變這個標籤頁的 URL，否則抓取結果可能不符合預期。<br><br>如果這個擴充套件程式自動更新了，那麼這個頁面將不能正常下載檔案（需要重新整理頁面來恢復正常）。 如果你想長期執行定時抓取任務，建議安裝下載器的離線版本，以免因為自動更新而導致問題。<br>你可以在這裡下載離線安裝包：<a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">Releases page</a>',
    'During timed crawling, just leave this tab alone. Do not change the URL of this tab, or the crawl results may not be as expected.<br><br>If the extension is automatically updated, the page will not be able to download files normally (refresh the page to restore normal). If you want to perform scheduled crawling tasks for a long time, it is recommended to install the offline version of the downloader to avoid problems caused by automatic updates.<br>You can download the offline installation package here: <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">Releases page</a>',
    '時限クロール中は、このタブをそのままにしておきます。 このタブの URL は変更しないでください。変更すると、クロール結果が期待どおりにならない可能性があります。<br><br>拡張機能が自動的に更新されると、ページはファイルを正常にダウンロードできなくなります (ページを更新して正常に戻します)。 スケジュールされたクロール タスクを長時間実行する場合は、自動更新による問題を回避するために、ダウンローダのオフライン バージョンをインストールすることをお勧めします。<br>オフライン インストール パッケージは、次の場所からダウンロードできます。<a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">Releases page</a>',
    '시간 제한 크롤링 중에는 이 탭을 그대로 두십시오. 이 탭의 URL을 변경하지 마십시오. 그렇지 않으면 크롤링 결과가 예상과 다를 수 있습니다.<br><br>확장자가 자동으로 업데이트되면 페이지에서 파일을 정상적으로 다운로드할 수 없습니다(페이지를 새로고침하여 정상으로 복원). 예약된 크롤링 작업을 장기간 수행하려면 자동 업데이트로 인한 문제를 방지하기 위해 다운로더의 오프라인 버전을 설치하는 것이 좋습니다.<br>여기에서 오프라인 설치 패키지를 다운로드할 수 있습니다. <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">Releases page</a>',
    'Во время сканирования по времени просто оставьте эту вкладку в покое. Не меняйте URL-адрес этой вкладки, иначе результаты сканирования могут отличаться от ожидаемых.<br><br>Если расширение автоматически обновляется, страница не сможет загружать файлы в обычном режиме (обновите страницу, чтобы восстановить нормальный режим). Если вы хотите выполнять запланированные задачи обхода в течение длительного времени, рекомендуется установить автономную версию загрузчика, чтобы избежать проблем, вызванных автоматическими обновлениями.<br>Вы можете скачать автономный установочный пакет здесь: <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">Страница релизов</a>',
  ],
  _定时抓取的间隔时间: [
    '<span class="key">定时</span>抓取的间隔时间',
    '<span class="key">定時</span>抓取的間隔時間',
    'The interval time of <span class="key">timed crawl</span>',
    '<span class="key">時間指定</span>クロールの間隔時間',
    '<span class="key">정기</span> 크롤링 간격 시간',
    'Интервальное время <span class="key">сканирования с таймером</span>',
  ],
  _定时抓取的间隔时间2: [
    '定时抓取的间隔时间',
    '定時抓取的間隔時間',
    'The interval time of timed crawl',
    '時間指定クロールの間隔時間',
    '정기 크롤링 간격 시간',
    'Интервальное время сканирования с таймером',
  ],
  _分钟: ['分钟', '分鐘', 'Minute', '分', '분', 'Минут'],
  _定时抓取的时间超过最大值: [
    '定时抓取的间隔时间超过最大值：',
    '定時抓取的間隔時間超過最大值：',
    'The interval of timed crawl exceeds the maximum value: ',
    '時間指定クロールの間隔が最大値を超えています: ',
    '시간 지정 크롤링 간격이 최대값을 초과합니다: ',
    'Интервал сканирования по таймеру превышает максимальное значение: ',
  ],
  _定时抓取的时间最小值: [
    '定时抓取的间隔时间最小值为 1 分钟。',
    '定時抓取的間隔時間最小值為 1 分鐘。',
    'The minimum interval for timed crawls is 1 minute.',
    '時間指定クロールの最小間隔は 1 分です。',
    '시간 지정 크롤링의 최소 간격은 1분입니다.',
    'Минимальный интервал для сканирования по таймеру составляет 1 минуту.',
  ],
  _取消定时抓取: [
    '取消定时抓取',
    '取消定時抓取',
    'Cancel timed crawl',
    '時間指定クロールをキャンセル',
    '시간 지정 크롤링 취소',
    'Отменить сканирование по таймеру',
  ],
  _已取消定时抓取: [
    '已取消定时抓取',
    '已取消定時抓取',
    'Timed crawl canceled',
    '時間指定クロールがキャンセルされました',
    '예약된 크롤링이 취소되었습니다.',
    'Сканирование по таймеру отменено',
  ],
  _因为URL变化取消定时抓取任务: [
    '因为 URL 变化，定时抓取任务已被取消。',
    '因為 URL 變化，定時抓取任務已被取消。',
    'The timed crawl task has been canceled due to URL changes.',
    'URL が変更されたため、時間指定クロール タスクがキャンセルされました。',
    'URL 변경으로 인해 시간이 지정된 크롤링 작업이 취소되었습니다.',
    'Задание на сканирование по времени было отменено из-за изменений URL.',
  ],
  _开始定时抓取: [
    '开始定时抓取',
    '開始定時抓取',
    'Start timed crawling',
    '時間指定クロールを開始する',
    '시간 지정 크롤링 시작',
    'Начать сканирование по таймеру',
  ],
  _等待下一次定时抓取: [
    '等待下一次定时抓取',
    '等待下一次定時抓取',
    'Wait for the next timed crawl',
    '次回の時限クロールを待つ',
    '다음 시간 크롤링을 기다립니다.',
    'Подождите следующего сканирования с таймером',
  ],
  _当前时间: [
    '当前时间：',
    '當前時間：',
    'Current time: ',
    '現在の時刻：',
    '현재 시간: ',
    'Текущее время: ',
  ],
  _仅在部分页面中可用: [
    '仅在部分页面中可用。',
    '僅在部分頁面中可用。',
    'Only available on some pages.',
    '一部のページのみ利用可能です。',
    '일부 페이지에서만 사용할 수 있습니다.',
    'Доступно только на некоторых страницах',
  ],
  _发生错误原因: [
    '发生错误，原因: ',
    '發生錯誤，原因: ',
    'An error occurred due to: ',
    '次の理由でエラーが発生しました: ',
    '다음으로 인해 오류가 발생했습니다. ',
    'Произошла ошибка по причине: ',
  ],
  _扩展程序已更新: [
    '扩展程序已更新。',
    '擴充套件程式已更新。',
    'The extension has been updated.',
    '拡張機能が更新されました。',
    '확장이 업데이트되었습니다.',
    'Расширение было обновлено.',
  ],
  _未知错误: [
    '未知错误。',
    '未知錯誤。',
    'unknown mistake.',
    '未知の間違い。',
    '알 수 없는 실수.',
    'неизвестная ошибка',
  ],
  _请刷新页面: [
    '请刷新页面。',
    '請重新整理頁面。',
    'Please refresh the page.',
    'ページを更新してください。',
    '페이지를 새로고침하세요.',
    'Пожалуйста, обновите страницу.',
  ],
  _减慢抓取速度: [
    '<span class="key">减慢</span>抓取速度',
    '<span class="key">減慢</span>抓取速度',
    '<span class="key">Slow down</span> crawl',
    'クロールを<span class="key">遅くする</span>',
    '<span class="key">천천히</span> 크롤링',
    '<span class="key">Замедлить</span> сканирование',
  ],
  _减慢抓取速度的说明: [
    '减慢抓取速度可以避免在抓取时被 Pixiv 临时限制（429状态码）。<br>这会增加抓取时间。',
    '減慢抓取速度可以避免在抓取時被 Pixiv 臨時限制（429狀態碼）。<br>這會增加抓取時間。',
    'Slowing down the crawl speed can help avoid Pixiv temporarily blocking your crawl (429 status code). <br>This will increase crawl time.',
    'クロール速度を遅くすることで、クロール中にPixivに一時的にブロックされること（ステータスコード429）を回避できます。 <br>これによりクロール時間が長くなります。',
    '크롤링 속도를 늦추면 크롤링 중에 Pixiv에 의해 일시적으로 차단되는 현상(상태 코드 429)을 피할 수 있습니다. <br>이렇게 하면 크롤링 시간이 늘어납니다.',
    'Замедление скорости сканирования поможет избежать временной блокировки Pixiv (код статуса 429) во время сканирования. <br>Это увеличит время сканирования.',
  ],
  _作品数量: [
    '作品数量',
    '作品數量',
    'Number of works',
    '作品数',
    '작품 수',
    'Количество работ',
  ],
  _当作品数量大于: [
    '当作品数量超过指定数量时启用：',
    '當作品數量超過指定數量时啟用：',
    'Enabled when the number of works exceeds the specified number:',
    '作品数が規定数を超えた場合に有効：',
    '작품 수가 지정된 수를 초과하면 활성화됩니다.',
    'Включается, когда количество работ превышает указанное количество:',
  ],
  _当文件数量大于: [
    `当文件数量超过指定数量时启用：`,
    `當檔案數量超過指定數量時啟用：`,
    `Enable when the number of files exceeds the specified number:`,
    `ファイル数が指定数を超えたときに有効にする：`,
    `파일 수가 지정된 수를 초과할 때 활성화:`,
    `Включить, когда количество файлов превышает указанное:`,
  ],
  _慢速抓取: [
    '慢速抓取，以避免触发 429 限制',
    '慢速抓取，以避免觸發 429 限制',
    'Crawl slowly to avoid triggering 429 throttling',
    '429 スロットリングのトリガーを避けるためにゆっくりとクロールします',
    '429 스로틀링 트리거를 방지하기 위해 천천히 크롤링',
    'Медленно сканируйте, чтобы не спровоцировать 429 троттлинг.',
  ],
  _慢速执行以避免引起429错误: [
    '慢速执行，以避免引起 429 错误',
    '慢速執行，以避免引起 429 錯誤',
    'Execute slowly to avoid causing 429 errors',
    '429 エラーの発生を避けるためにゆっくり実行してください',
    '429 오류가 발생하지 않도록 천천히 실행하십시오.',
    'Выполняйте медленно, чтобы избежать ошибок 429',
  ],
  _点击收藏按钮时下载作品: [
    '点击<span class="key">收藏</span>按钮时下载作品',
    '點選<span class="key">收藏</span>按鈕時下載作品',
    'Download a work when you click the <span class="key">bookmark</span> button',
    '<span class="key">ブックマーク</span>ボタンをクリックすると作品をダウンロード',
    '<span class="key">북마크</span> 버튼 클릭 시 작품 다운로드',
    'Загрузка произведения при нажатии кнопки <span class="key">закладка</span>',
  ],
  _点击点赞按钮时下载作品: [
    '点击<span class="key">点赞</span>按钮时下载作品',
    '點選<span class="key">點贊</span>按鈕時下載作品',
    'Download a work when you click the <span class="key">like</span> button',
    '<span class="key">いいね</span>ボタンをクリックすると作品がダウンロードされます',
    '<span class="key">좋아요</span> 버튼 클릭 시 작품 다운로드',
    'Загрузка произведения при нажатии на кнопку <span class="key">лайк</span>',
  ],
  _优化性能和用户体验: [
    '优化性能和用户体验。',
    '最佳化效能和使用者體驗。',
    'Optimize performance and user experience.',
    'パフォーマンスとユーザー エクスペリエンスを最適化します。',
    '성능과 사용자 경험을 최적화합니다.',
    'Оптимизация производительности и пользовательского опыта',
  ],
  _修复bug: [
    `<strong>🐞 修复bug</strong>`,
    `<strong>🐞 修復bug</strong>`,
    `<strong>🐞 Bug Fix</strong>`,
    `<strong>🐞 バグ修正</strong>`,
    `<strong>🐞 버그 수정</strong>`,
    `<strong>🐞 Исправление ошибок</strong>`,
  ],
  _优化用户体验: [
    `<strong>😊 优化用户体验</strong>`,
    `<strong>😊 優化用戶體驗</strong>`,
    `<strong>😊 Optimized User Experience</strong>`,
    `<strong>😊 ユーザーエクスペリエンスの最適化</strong>`,
    `<strong>😊 사용자 경험 최적화</strong>`,
    `<strong>😊 Оптимизация пользовательского опыта</strong>`,
  ],
  _不支持的浏览器: [
    '你的浏览器不能正常使用这个扩展程序，主要原因可能是浏览器内核版本太低，或者存在兼容性问题。<br>建议您更换成最新版本的 Chrome 或 Edge 浏览器。',
    '你的瀏覽器不能正常使用這個擴充套件程式，主要原因可能是瀏覽器核心版本太低，或者存在相容性問題。<br>建議您更換成最新版本的 Chrome 或 Edge 瀏覽器。',
    'Your browser cannot use this extension properly. The main reason may be that the browser kernel version is too low, or there is a compatibility problem. <br>We recommend that you switch to the latest version of Chrome or Edge.',
    'お使いのブラウザでは、この拡張機能を正しく使用できません。 主な理由としては、ブラウザのカーネル バージョンが低すぎるか、互換性の問題がある可能性があります。 <br>最新バージョンの Chrome または Edge に切り替えることをお勧めします。',
    '브라우저에서 이 확장 프로그램을 제대로 사용할 수 없습니다. 주된 이유는 브라우저 커널 버전이 너무 낮거나 호환성 문제가 있기 때문일 수 있습니다. <br>최신 버전의 Chrome 또는 Edge로 전환하는 것이 좋습니다.',
    'Ваш браузер не может правильно использовать это расширение. Основной причиной может быть слишком низкая версия ядра браузера или проблема совместимости. <br>Мы рекомендуем вам перейти на последнюю версию Chrome или Edge.',
  ],
  _日期时间格式错误: [
    '日期时间格式错误',
    '日期時間格式錯誤',
    'wrong datetime format',
    '間違った日時形式',
    '잘못된 날짜/시간 형식',
    'неправильный формат даты',
  ],
  _添加了对此页面类型的支持: [
    '添加了对此页面类型的支持：',
    '添加了对此页面类型的支持：',
    'Added support for this page type:',
    '次のページ タイプのサポートが追加されました：',
    '이 페이지 유형에 대한 지원이 추가되었습니다：',
    'Добавлена поддержка этого типа страницы:',
  ],
  _仅可由链接浏览: [
    '仅可由链接浏览',
    '僅可由連結瀏覽',
    'URL restricted',
    'URL限定公開',
    'URL 한정 공개',
    'URL ограничен',
  ],
  _添加了俄语翻译: [
    '添加了俄语翻译',
    '添加了俄語翻譯',
    'Added Russian translation',
    'ロシア語の翻訳を追加',
    '러시아어 번역 추가',
    'Добавлен русский перевод',
  ],
  _移除本页面中所有作品的标签: [
    '移除本页面中所有作品的标签',
    '移除本頁面中所有作品的標籤',
    'Remove tags from all works on this page',
    'このページのすべての作品からタグを削除します',
    '이 페이지의 모든 작품에서 태그 제거',
    'Удалить теги со всех работ на этой странице',
  ],
  _它们会变成未分类状态: [
    '它们会变成未分类状态',
    '它們會變成未分類狀態',
    'They become uncategorized',
    'それらは未分類になります',
    '분류되지 않습니다',
    'Они становятся некатегоризированными',
  ],
  _取消收藏本页面的所有作品: [
    '取消收藏本页面中的所有作品',
    '取消收藏本頁面中的所有作品',
    'Unbookmark all works on this page',
    'このページのすべての作品のブックマークを解除',
    '이 페이지의 모든 작품에 대한 북마크 해제',
    'Удалить из избранного все работы на этой странице',
  ],
  _取消收藏所有已被删除的作品: [
    '取消收藏所有已被删除的作品',
    '取消收藏所有已被刪除的作品',
    'Unbookmark all deleted works',
    '削除した作品をすべてブックマーク解除する',
    '삭제된 모든 작품 북마크 해제',
    'Снять закладку со всех удаленных работ',
  ],
  _取消收藏所有已被删除的作品的使用说明: [
    '在你的收藏页面里，切换到下载器的“更多”标签页可以看到该功能按钮。',
    '在你的收藏頁面裡，切換到下載器的“更多”標籤頁可以看到該功能按鈕。',
    'In your bookmark page, switch to the "More" tab of the downloader to see this function button.',
    'ブックマーク ページで、ダウンローダーの「その他」タブに切り替えると、この機能ボタンが表示されます。',
    '북마크 페이지에서 다운로더의 "더보기" 탭으로 전환하면 이 기능 버튼을 볼 수 있습니다.',
    'На странице закладок перейдите на вкладку «Дополнительно» загрузчика, чтобы увидеть эту функциональную кнопку.',
  ],
  _取消收藏作品: [
    '取消收藏作品',
    '取消收藏作品',
    'Unbookmark works',
    '作品のブックマークを解除',
    '작품 북마크 해제',
    'Снять закладку с работ',
  ],
  _已取消收藏: [
    `已取消收藏`,
    `已取消收藏`,
    `Bookmark canceled`,
    `ブックマークをキャンセルしました`,
    `북마크 취소됨`,
    `Закладка отменена`,
  ],
  _收藏页面里的按钮: [
    '当你在自己的收藏页面时，可以在“更多”选项卡里看到这个按钮。',
    '當你在自己的收藏頁面時，可以在“更多”選項卡里看到這個按鈕。',
    `You can see this button in the "More" tab when you're on your bookmarks page.`,
    'このボタンは、ブックマーク ページの [もっと] タブに表示されます。',
    '북마크 페이지에 있을 때 "더보기" 탭에서 이 버튼을 볼 수 있습니다.',
    'Вы можете увидеть эту кнопку на вкладке «Больше», когда находитесь на странице закладок.',
  ],
  _收藏任务尚未完成请等待: [
    '收藏作品的任务尚未全部完成，请等待',
    '收藏作品的任務尚未全部完成，請等待',
    'The task of bookmarking works has not been completed yet, please wait.',
    '作品のブックマーク作業がまだ完了していませんので、しばらくお待ちください',
    '작품을 북마크하는 작업이 아직 완료되지 않았습니다. 잠시만 기다려 주세요',
    'Задание работ по закладке еще не выполнено, пожалуйста, подождите',
  ],
  _收藏作品完毕: [
    '收藏作品完毕',
    '收藏作品完畢',
    'Bookmark works finished',
    'ブックマーク作業終了',
    '북마크 작업 완료',
    'Работа над закладками завершена',
  ],
  _添加收藏失败: [
    '添加收藏失败',
    '新增收藏失敗',
    'Failed to add bookmark',
    'ブックマークを追加できませんでした',
    '북마크 추가 실패',
    'Не удалось добавить закладку',
  ],
  _点赞失败: [
    `点赞失败`,
    `點讚失敗`,
    `Like failed`,
    `いいね失敗`,
    `좋아요 실패`,
    `Лайк не удался`,
  ],
  _下载器会在几分钟后重试: [
    '下载器会在几分钟后重试。',
    '下載器會在幾分鐘後重試。',
    'The downloader will try again in a few minutes.',
    'ダウンローダーは数分後に再試行します。',
    '다운로더는 몇 분 후에 다시 시도합니다.',
    'Загрузчик повторит попытку через несколько минут.',
  ],
  _重试收藏: [
    '重试收藏',
    '重試收藏',
    'Retry bookmark',
    'ブックマークを再試行',
    '북마크 다시 시도',
    'Повторить закладку',
  ],
  _剩余xx个: [
    '剩余 {} 个。',
    '剩餘 {} 個。',
    '{} remaining.',
    '{} 残り。',
    '{} 남음.',
    '{} осталось.',
  ],
  _重试收藏成功: [
    '重试收藏成功。',
    '重試收藏成功。',
    'Retry bookmark successfully.',
    'ブックマークを再試行します。',
    '북마크를 다시 시도하십시오.',
    'Повторите попытку закладки.',
  ],
  _出现错误请稍后重试: [
    '出现错误，请稍后重试。',
    '出現錯誤，請稍後重試。',
    'An error occurred, please try again later.',
    'エラーが発生しました。しばらくしてからもう一度お試しください。',
    '오류가 발생했습니다. 잠시 후 다시 시도 해주세요.',
    'Произошла ошибка. Пожалуйста, повторите попытку позже.',
  ],
  _请稍后重试: [
    '请稍后重试。',
    '請稍後重試。',
    'Please try again later.',
    '後でもう一度やり直してください。',
    '잠시 후에 다시 시도해주세요.',
    'Пожалуйста, повторите попытку позже.',
  ],
  _确定要离开吗: [
    '确定要离开吗？',
    '確定要離開嗎？',
    'Are you sure you want to leave?',
    '退会してもよろしいですか？',
    '떠나시겠습니까?',
    'Вы уверены, что хотите оставить?',
  ],
  _yandex浏览器的警告: [
    `如果你在 Yandex 浏览器（Android）上使用 Powerful Pixiv Downloader，请换成 Kiwi 浏览器。<br>
    因为下载器在最近将会升级到 Manifest version 3，但是 Yandex 浏览器不支持  Manifest version 3， 所以它不能使用新版本的下载器。`,
    `如果你在 Yandex 瀏覽器（Android）上使用 Powerful Pixiv Downloader，請換成 Kiwi 瀏覽器。<br>
    因為下載器在最近將會升級到 Manifest version 3，但是 Yandex 瀏覽器不支援  Manifest version 3， 所以它不能使用新版本的下載器。`,
    `If you are using Powerful Pixiv Downloader on Yandex browser（Android）, please switch to Kiwi browser. <br>
    Because the downloader will be upgraded to Manifest version 3 in the near future, but Yandex browser does not support Manifest version 3, so it cannot use the new version of the downloader.`,
    `Yandex（Android） ブラウザで強力な Pixiv Downloader を使用している場合は、Kiwi ブラウザに切り替えてください。 <br>
    ダウンローダは近いうちにマニフェスト バージョン 3 にアップグレードされますが、Yandex ブラウザはマニフェスト バージョン 3 をサポートしていないため、新しいバージョンのダウンローダを使用することはできません。`,
    `Yandex（Android） 브라우저에서 강력한 Pixiv Downloader를 사용하는 경우 Kiwi 브라우저로 전환하십시오. <br>
    다운로더는 가까운 시일 내에 Manifest 버전 3으로 업그레이드되지만 Yandex 브라우저는 Manifest 버전 3을 지원하지 않으므로 새 버전의 다운로더를 사용할 수 없습니다.`,
    `Если вы используете Powerful Pixiv Downloader в браузере Yandex（Android）, перейдите на браузер Kiwi. <br>
    Потому что в ближайшее время загрузчик будет обновлен до Манифеста версии 3, но Yandex браузер не поддерживает Манифест версии 3, поэтому он не может использовать новую версию загрузчика.`,
  ],
  _导出日志: [
    '导出<span class="key">日志</span>',
    '匯出<span class="key">日誌</span>',
    'Export <span class="key">log</span>',
    '<span class="key">ログ</span>のエクスポート',
    '<span class="key">로그</span> 내보내기',
    'Экспорт <span class="key">журнала</span>',
  ],
  _导出日志成功: [
    '导出日志',
    '匯出日誌',
    'Export log',
    'ログのエクスポート',
    '내보내기 로그',
    'Экспорт журнала',
  ],
  _导出时机: [
    '导出时机',
    '匯出時機',
    'Export timing',
    'エクスポートのタイミング',
    '내보내기 타이밍',
    'Время экспорта',
  ],
  _日志类型: [
    '日志类型',
    '日誌型別',
    'Log type',
    'ログの種類',
    '로그 유형',
    'Тип журнала',
  ],
  _正常: ['正常', '正常', 'Normal', '普通', '정상', 'Обычный'],
  _错误: ['错误', '錯誤', 'Error', 'エラー', '오류', 'Ошибка'],
  _没有找到可用的图片网址: [
    `没有找到可用的图片网址`,
    `沒有找到可用的圖片網址`,
    `No available image URLs found`,
    `利用可能な画像URLが見つかりません`,
    `사용 가능한 이미지 URL을 찾을 수 없습니다`,
    `Доступные URL изображений не найдены`,
  ],
  _排除关键字: [
    '排除关键字',
    '排除關鍵字',
    'Exclude keywords',
    'キーワードを除外',
    '키워드 제외',
    'Исключить ключевые слова',
  ],
  _特定用户的多图作品不下载最后几张图片: [
    '特定用户的多图作品不下载<span class="key">最后几张</span>图片',
    '特定使用者的多圖作品不下載<span class="key">最後幾張</span>圖片',
    `Don't download the <span class="key">last few</span> images for specific user's multi-image works`,
    '特定のユーザーのマルチイメージ作品の<span class="key">最後のいくつかのイメージ</span>をダウンロードしないでください',
    '특정 사용자의 다중 이미지 작품에 대한 <span class="key">마지막 몇 개</span>의 이미지를 다운로드하지 마십시오',
    'Не загружайте <span class="key">последние несколько</span> изображений для работ с несколькими изображениями конкретного пользователя',
  ],
  _不下载最后几张图片: [
    '不下载最后几张图片',
    '不下載最後幾張圖片',
    'Do not download last few images',
    '最後の数枚の画像をダウンロードしない',
    '마지막 몇 개의 이미지를 다운로드하지 마십시오',
    'Не загружайте последние несколько изображений',
  ],
  _提示0表示不生效: [
    '0 表示不生效',
    '0 表示不生效',
    '0 means no effect',
    '0 は影響なしを意味します',
    '0은 영향이 없음을 의미합니다.',
    '0 означает отсутствие эффекта',
  ],
  _如果作品含有某些标签则对这个作品使用另一种命名规则: [
    '如果作品含有某些<span class="key">特定标签</span>，则对这个作品使用另一种命名规则',
    '如果作品含有某些<span class="key">特定標籤</span>，則對這個作品使用另一種命名規則',
    'Use a different naming rule for the work if it has certain <span class="key">tags</span>',
    '特定の<span class="key">タグ</span>がある場合は、作品に別の命名規則を使用する',
    '특정 <span class="key">태그</span>가 있는 경우 작업에 다른 명명 규칙을 사용하십시오',
    'Используйте другое правило именования для работы, если она имеет определенные <span class="key">теги</span>',
  ],
  _升级到manifest_v3的提示: [
    '下载器已升级到 Manifest V3。<br>如果你在下载时遇到问题，请打开扩展管理页面，重新加载本扩展。',
    '下載器已升級到 Manifest V3。<br>如果你在下載時遇到問題，請開啟擴充套件管理頁面，重新載入本擴充套件。',
    'Downloader has been upgraded to Manifest V3. <br>If you encounter problems when downloading, please open the extension management page and reload this extension.',
    'Downloader が Manifest V3 にアップグレードされました。 <br>ダウンロード中に問題が発生した場合は、拡張機能の管理ページを開いて、この拡張機能をリロードしてください。',
    '다운로더가 Manifest V3로 업그레이드되었습니다. <br>다운로드 시 문제가 발생하면 확장 프로그램 관리 페이지를 열고 이 확장 프로그램을 새로고침하세요.',
    'Загрузчик обновлен до версии Manifest V3. <br>Если у вас возникли проблемы при загрузке, откройте страницу управления расширением и перезагрузите это расширение.',
  ],
  _AI作品: [
    '<span class="key">AI</span> 作品',
    '<span class="key">AI</span> 作品',
    '<span class="key">AI</span> works',
    '<span class="key">AI</span>が働く',
    '<span class="key">AI</span> 작동',
    '<span class="key">ИИ</span> работает',
  ],
  _AI生成: [
    'AI 生成',
    'AI 生成',
    'AI-generated',
    'AI 生成',
    'AI 생성',
    'сгенерированный ИИ',
  ],
  _非AI生成: [
    '非 AI 生成',
    '非 AI 生成',
    'Not AI-generated',
    'AI生成ではない',
    'AI 생성 아님',
    'Не сгенерировано ИИ',
  ],
  _未知: [
    '未知',
    '未知',
    'Unknown',
    '知らない',
    '알려지지 않은',
    'Неизвестный',
  ],
  _AI未知作品的说明: [
    '早期作品没有标记，无法判断',
    '早期作品沒有標記，無法判斷',
    'Early works are not marked and cannot be judged',
    '初期の作品は採点せず、審査不可',
    '초기 작품은 표시되지 않으며 평가할 수 없습니다.',
    'Ранние работы не отмечены и не могут быть оценены',
  ],
  _用户可以选择是否下载AI生成的作品: [
    '用户可以选择是否下载由 AI 生成的作品。',
    '使用者可以選擇是否下載由 AI 生成的作品。',
    'Users can choose whether to download AI-generated works.',
    'ユーザーは、AI によって生成された作品をダウンロードするかどうかを選択できます。',
    '사용자는 AI가 생성한 작품을 다운로드할지 여부를 선택할 수 있습니다.',
    'Пользователи могут выбирать, загружать ли работы, созданные ИИ.',
  ],
  _文件下载顺序: [
    '文件下载<span class="key">顺序</span>',
    '檔案下載<span class="key">順序</span>',
    'File download <span class="key">order</span>',
    'ファイルのダウンロード<span class="key">順序</span>',
    '파일 다운로드 <span class="key">순서</span>',
    'Порядок <span class="key">загрузки</span> файлов',
  ],
  _降序: [
    '降序',
    '降序',
    'Descending',
    '降順',
    '내림차순',
    'в порядке убывания',
  ],
  _升序: [
    '升序',
    '升序',
    'Ascending',
    '昇順',
    '오름차순',
    'возрастающий порядок',
  ],
  _排序依据: [
    '排序依据',
    '排序依據',
    'Sort by',
    'ソート基準',
    '정렬 기준',
    'Сортировать по',
  ],
  _作品ID: [
    '作品 ID',
    '作品 ID',
    'Work ID',
    '作品ID',
    'ID 아이디',
    'РРабочий идентификатор',
  ],
  _收藏时间: [
    '收藏时间',
    '收藏時間',
    'Bookmark time',
    'ブックマーク時間',
    '북마크 시간',
    'время сбора',
  ],
  _收藏数量2: [
    '收藏数量',
    '收藏數量',
    'Bookmark count',
    'ブックマークの数',
    '북마크 수',
    'Колличество закладок',
  ],
  _重新显示帮助: [
    '重新显示帮助',
    '重新顯示幫助',
    'Redisplay help',
    'ヘルプを再表示',
    '도움말 다시 표시',
    'Повторно отобразить справку',
  ],
  _自定义标签分隔符号的提示: [
    '现在你可以自定义文件名中使用的标签分隔符号，以替换默认的 <span class="blue">,</span>。',
    '現在你可以自定義檔名中使用的標籤分隔符號，以替換預設的 <span class="blue">,</span>。',
    'You can now customize the tag separator used in filenames to replace the default <span class="blue">,</span>',
    'ファイル名で使用されるタグ区切りをカスタマイズして、デフォルトの <span class="blue">,</span> を置き換えることができるようになりました',
    '이제 파일 이름에 사용되는 태그 구분 기호를 사용자 지정하여 기본 <span class="blue">,</span>',
    'Теперь вы можете настроить разделитель тегов, используемый в именах файлов, чтобы заменить используемый по умолчанию <span class="blue">,</span>',
  ],
  _高亮关注的用户: [
    '<span class="key">高亮</span>关注的用户',
    '<span class="key">高亮</span>關注的使用者',
    '<span class="key">Highlight</span> following users',
    '<span class="key">強調</span>表示するフォローしているユーザー',
    '<span class="key">강조표시</span>하는 팔로우한 사용자',
    '<span class="key">Выделить</span> следующих пользователей',
  ],
  _高亮关注的用户的说明: [
    '你关注（Following）的用户的名字会具有黄色背景，或者显示为黄色。<br>这便于你确认自己是否关注了某个用户。',
    '你關注（Following）的使用者的名字會具有黃色背景，或者顯示為黃色。<br>這便於你確認自己是否關注了某個使用者。',
    'The names of users you are following will have a yellow background, or be displayed in yellow. <br>This is convenient for you to confirm whether you follow a certain user.',
    'フォローしているユーザーの名前は背景が黄色、または黄色で表示されます。 <br>特定のユーザーをフォローしているかどうかを確認するのに便利です。',
    '팔로우하는 사용자의 이름은 노란색 배경으로 표시되거나 노란색으로 표시됩니다. <br>특정 사용자를 팔로우하고 있는지 확인할 때 편리합니다.',
    'Имена пользователей, на которых вы подписаны, будут иметь желтый фон или отображаться желтым цветом. <br>Это удобно для вас, чтобы подтвердить, подписаны ли вы на определенного пользователя',
  ],
  _正在加载关注用户列表: [
    '正在加载关注用户列表',
    '正在載入關注使用者列表',
    'Loading list of followed users',
    'フォローしているユーザーのリストを読み込み中',
    '팔로우한 사용자 목록 로드 중',
    'Загрузка списка отслеживаемых пользователей',
  ],
  _已更新关注用户列表: [
    '已更新关注用户列表',
    '已更新關注使用者列表',
    'The list of following users has been updated',
    'フォローしているユーザーのリストが更新されました',
    '다음 사용자 목록이 업데이트되었습니다',
    'Список следующих пользователей обновлен',
  ],
  _移动端浏览器可能不会建立文件夹的说明: [
    '如果你使用的是移动端的浏览器，它可能不会建立文件夹。这不是下载器的问题。',
    '如果你使用的是移動端的瀏覽器，它可能不會建立資料夾。這不是下載器的問題。',
    `If you're using a mobile browser, it may not create the folder. This isn't a problem with the downloader.`,
    'モバイルブラウザをご利用の場合、フォルダが作成されない可能性があります。これはダウンローダーの問題ではありません。',
    '모바일 브라우저를 사용하는 경우 폴더가 생성되지 않을 수 있습니다. 이는 다운로더 문제가 아닙니다.',
    'Если вы используете мобильный браузер, папка может не создаться. Это не проблема загрузчика.',
  ],
  _优化移动设备上的用户体验: [
    '优化移动设备上的用户体验。',
    '最佳化移動裝置上的使用者體驗。',
    'Optimize user experience on mobile devices.',
    'モバイルデバイスでのユーザーエクスペリエンスを最適化します。',
    '모바일 장치에서 사용자 경험을 최적화합니다.',
    'Оптимизируйте взаимодействие с пользователем на мобильных устройствах.',
  ],
  _批量收藏作品时减慢速度: [
    '批量收藏作品时减慢速度，以减少 429 错误发生的概率',
    '批量收藏作品时减慢速度，以减少 429 错误发生的概率',
    'Slow down when batch bookmarking works to reduce chance of 429 errors',
    'バッチブックマークが機能すると、429 エラーの可能性を減らすために速度が低下します。',
    '429 오류 가능성을 줄이기 위해 일괄 북마크가 작동할 때 속도를 늦춥니다.',
    'Замедлите работу, когда пакетная закладка работает, чтобы уменьшить вероятность ошибки 429',
  ],
  _停止抓取: [
    '停止抓取',
    '停止擷取',
    'Stop crawling',
    'クロールをやめる',
    '크롤링 중지',
    'Остановить сканирование',
  ],
  _已停止抓取: [
    '已停止抓取',
    '已停止擷取',
    'Crawl stopped',
    'クロールを停止しました',
    '크롤링 중지됨',
    'Сканирование остановлено',
  ],
  _导入ID列表: [
    '导入 ID 列表',
    '匯入 ID 列表',
    'Import ID list',
    'インポートIDリスト',
    'ID 목록 가져오기',
    'Список идентификаторов импорта',
  ],
  _导入ID列表的说明: [
    `请选择一个 JSON 文件。它的代码格式如下：
<pre>
[
  { "id": "142565679", "type": "illusts" },
  { "id": "24769308", "type": "novels" },
  { "id": "7671451", "type": "novelSeries" }
]
</pre>
type 可以是 "illusts"、"novels" 或 "novelSeries"。`,
    `請選擇一個 JSON 檔案。它的程式碼格式如下：<pre>
[
  { "id": "142565679", "type": "illusts" },
  { "id": "24769308", "type": "novels" },
  { "id": "7671451", "type": "novelSeries" }
]
</pre>
type 可以是 "illusts"、"novels" 或 "novelSeries"。`,
    `Please select a JSON file. Its code format is as follows:
<pre>
[
  { "id": "142565679", "type": "illusts" },
  { "id": "24769308", "type": "novels" },
  { "id": "7671451", "type": "novelSeries" }
]
</pre>
type can be "illusts", "novels" or "novelSeries".`,
    `JSONファイルを選択してください。コード形式は次のとおりです。
<pre>
[
  { "id": "142565679", "type": "illusts" },
  { "id": "24769308", "type": "novels" },
  { "id": "7671451", "type": "novelSeries" }
]
</pre>
type は "illusts"、"novels" または "novelSeries" です。`,
    `JSON 파일을 선택하세요. 코드 형식은 다음과 같습니다.
<pre>
[
  { "id": "142565679", "type": "illusts" },
  { "id": "24769308", "type": "novels" },
  { "id": "7671451", "type": "novelSeries" }
]
</pre>
type 은 "illusts", "novels" 또는 "novelSeries"가 될 수 있습니다.`,
    `Пожалуйста, выберите файл JSON. Формат его кода следующий:
<pre>
[
  { "id": "142565679", "type": "illusts" },
  { "id": "24769308", "type": "novels" },
  { "id": "7671451", "type": "novelSeries" }
]
</pre>
type может быть "illusts", "novels" или "novelSeries".`,
  ],
  _导出ID列表: [
    '获取作品 ID 列表后导出 <span class="key">ID 列表</span>，并停止任务',
    '獲取作品 ID 列表後匯出 <span class="key">ID 列表</span>，並停止任務',
    'After obtaining the work ID list, export the <span class="key">ID list</span> and stop the task',
    'ワークIDリストを取得後、<span class="key">IDリスト</span>をエクスポートしてタスクを停止する',
    '작업 ID 목록을 가져온 후 <span class="key">ID 목록</span>을 내보내고 작업을 중지합니다',
    'После получения списка идентификаторов работ экспортируйте <span class="key">список идентификаторов</span> и остановите задачу',
  ],
  _导出ID列表的说明: [
    '此时只会运行抓取，不会开始下载。<br>并且会忽略大多数过滤条件。',
    '此時只會執行抓取，不會開始下載。<br>並且會忽略大多數過濾條件。',
    'Only a crawl will be run, no download will be started. <br>Most filters are ignored.',
    'この時点ではフェッチのみが実行され、ダウンロードは開始されません。 <br>ほとんどのフィルターは無視されます。',
    '지금은 가져오기만 실행되고 다운로드는 시작되지 않습니다. <br>대부분의 필터는 무시됩니다.',
    'В этот раз будет запущена только выборка, загрузка не начнется. <br>Большинство фильтров игнорируются.',
  ],
  _导入的用户ID数量: [
    '导入的用户 ID 数量：',
    '匯入的使用者 ID 數量：',
    'Number of user IDs imported: ',
    'インポートされたユーザー ID の数: ',
    '가져온 사용자 ID 수: ',
    'Количество импортированных идентификаторов пользователей:',
  ],
  _任务已中止: [
    '任务已中止',
    '任務已中止',
    'task aborted',
    'タスクが中止されました',
    '작업이 중단됨',
    'задача прервана',
  ],
  _新增的关注用户达到每日限制: [
    '新增的关注用户数量达到 {}， 下载器已中止任务，以免你的账号被 Pixiv 限制。<br>建议明天再执行此任务。',
    '新增的關注使用者數量達到 {}， 下載器已中止任務，以免你的賬號被 Pixiv 限制。<br>建議明天再執行此任務。',
    'The number of newly added followers has reached {}, the downloader has stopped the task to prevent your account from being restricted by Pixiv. <br>It is recommended to perform this task again tomorrow.',
    '新しく追加されたフォロワーの数が {} に達しました。あなたのアカウントが Pixiv によって制限されるのを防ぐために、ダウンローダーはタスクを停止しました。 <br>このタスクは明日もう一度実行することをお勧めします。',
    '새로 추가된 팔로워 수가 {}에 도달했습니다. 다운로더가 작업을 중지하여 Pixiv에서 귀하의 계정을 제한하지 않도록 했습니다. <br>내일 이 작업을 다시 수행하는 것이 좋습니다.',
    'Количество новых подписчиков достигло {}, загрузчик остановил задачу, чтобы предотвратить ограничение вашей учетной записи Pixiv. <br>Рекомендуется повторить это задание завтра.',
  ],
  _没有找到关注按钮的提示: [
    '跳过关注用户 {} 因为没有找到关注按钮。你可以手动关注此用户。再次执行此任务有可能解决此问题。',
    '跳過關注使用者 {} 因為沒有找到關注按鈕。你可以手動關注此使用者。再次執行此任務有可能解決此問題。',
    'Skip following user {} because no follow button was found. You can follow this user manually. Performing this task again may resolve the issue.',
    'フォロー ボタンが見つからなかったため、ユーザー {} のフォローをスキップします。このユーザーを手動でフォローできます。 このタスクを再度実行すると、問題が解決される可能性があります。',
    '팔로우 버튼을 찾을 수 없으므로 사용자 {} 팔로우를 건너뜁니다. 이 사용자를 수동으로 팔로우할 수 있습니다. 이 작업을 다시 수행하면 문제가 해결될 수 있습니다.',
    'Пропустить подписку на пользователя {}, поскольку кнопка подписки не найдена. Вы можете подписаться на этого пользователя вручную. Повторное выполнение этой задачи может решить проблему.',
  ],
  _你的账号已经被Pixiv限制: [
    '你的账号已经被 Pixiv 限制',
    '你的賬號已經被 Pixiv 限制',
    'Your account has been restricted by Pixiv',
    'あなたのアカウントはPixivによって制限されています',
    '귀하의 계정은 Pixiv에 의해 제한되었습니다.',
    'Ваша учетная запись была ограничена Pixiv',
  ],
  _模拟用户点击: [
    '下载器发送的 API 返回 400 错误（需要 recaptcha enterprise score token），切换到模拟用户点击的方式，这会使用较多的硬件资源。',
    '下載器傳送的 API 返回 400 錯誤（需要 recaptcha enterprise score token），切換到模擬使用者點選的方式，這會使用較多的硬體資源。',
    'The API sent by the downloader returns a 400 error (recaptcha enterprise score token is required), and switches to the method of simulating user clicks, which will use more hardware resources.',
    'ダウンローダーによって送信された API は 400 エラー (recaptcha enterprise score token が必要です) を返し、より多くのハードウェア リソースを使用するユーザーのクリックをシミュレートする方法に切り替わります。',
    '다운로더가 보낸 API는 400 오류(recaptcha enterprise score token 필요)를 반환하고 더 많은 하드웨어 리소스를 사용하는 사용자 클릭 시뮬레이션 방법으로 전환합니다.',
    'API, отправленный загрузчиком, возвращает ошибку 400 (требуется recaptcha enterprise score token) и переключается на метод имитации пользовательских кликов, который будет использовать больше аппаратных ресурсов.',
  ],
  _提示可以重新执行批量关注任务: [
    '如果该标签页失去响应，或者关注的用户有遗漏，请关闭标签页，再重新打开，重新执行此任务。',
    '如果該標籤頁失去響應，或者關注的使用者有遺漏，請關閉標籤頁，再重新開啟，重新執行此任務。',
    'If the tab becomes unresponsive, or if you miss a follower, close the tab, reopen it, and redo the task.',
    'タブが応答しなくなった場合、またはフォロワーを見逃した場合は、タブを閉じて再度開き、タスクをやり直してください。',
    '탭이 응답하지 않거나 팔로어를 놓친 경우 탭을 닫았다가 다시 열고 작업을 다시 실행하십시오.',
    'Если вкладка перестает отвечать на запросы или вы пропустили подписчика, закройте вкладку, снова откройте ее и повторите задачу.',
  ],
  _提示下载器会跳过已关注的用户: [
    `如果你已经关注了某个用户，下载器会跳过它，以减少不必要的请求。`,
    `如果你已經關注了某個用戶，下載器會跳過它，以減少不必要的請求。`,
    `If you have already followed a user, the downloader will skip it to reduce unnecessary requests.`,
    `すでにユーザーをフォローしている場合、ダウンロードツールはそれをスキップして不要なリクエストを減らします。`,
    `이미 특정 사용자를 팔로우하고 있다면 다운로더가 해당 사용자를 건너뛰어 불필요한 요청을 줄입니다.`,
    `Если вы уже подписаны на пользователя, загрузчик пропустит его, чтобы уменьшить количество ненужных запросов.`,
  ],
  _新增x个: [
    '新增 {} 个',
    '新增 {} 個',
    'Added {}',
    '追加した {}',
    '추가됨 {}',
    'Добавлен {}',
  ],
  _优化批量关注用户的功能: [
    '优化批量关注用户的功能',
    '最佳化批次關注使用者的功能',
    'Optimize the function of following users in batches',
    'ユーザーの一括フォロー機能を最適化',
    '사용자 일괄 팔로우 기능 최적화',
    'Оптимизируйте функцию подписки на пользователей в пакетном режиме.',
  ],
  _修复了显示更大的缩略图失效的问题: [
    '修复了“显示更大的缩略图”失效的问题',
    '修復了“顯示更大的縮圖”失效的問題',
    `Fixed an issue where "Show Larger Thumbnails" didn't work`,
    '「大きなサムネイルを表示」が機能しない問題を修正しました',
    '"큰 축소판 보기"가 작동하지 않는 문제를 수정했습니다.',
    'Исправлена ​​ошибка, из-за которой не работал параметр «Показать увеличенные эскизы».',
  ],
  _可能发生了错误请刷新页面重试: [
    '可能发生了错误。<br>如果下载进度卡住，请刷新页面重试，或者重启浏览器。',
    '可能發生了錯誤。<br>如果下載進度卡住，請重新整理頁面重試，或者重啟瀏覽器。',
    'An error may have occurred. <br>If the download progress is stuck, please refresh the page and try again, or restart the browser.',
    'エラーが発生した可能性があります。 <br>ダウンロードの進行が進まない場合は、ページを更新して再試行するか、ブラウザを再起動してください。',
    '오류가 발생했을 수 있습니다. <br>다운로드 진행이 중단되면 페이지를 새로 고친 후 다시 시도하거나 브라우저를 다시 시작하세요.',
    'Возможно, произошла ошибка. <br>Если процесс загрузки завис, обновите страницу и повторите попытку или перезапустите браузер.',
  ],
  _下载卡住的提示: [
    `有些用户可能会遇到下载卡住的问题：文件的下载进度条达到 100% 后，需要等待一段时间才能保存到硬盘上，也可能始终无法保存。这个问题可能与浏览器或者硬盘有关，而且有多种原因都可以导致此问题。
<br>
我没有遇到过这个问题（实际上多数用户应该都不会经常遇到这个问题）。如果你遇到了这个问题，可以尝试以下操作，其中一些方法已经被验证过是有效的。
<br>
1. 刷新这个网页，让下载器重试下载。
<br>
2. 点击暂停下载按钮，然后点击开始下载按钮。
<br>
3. 打开浏览器的扩展管理页面，点击这个扩展的刷新按钮来重新加载它，然后刷新这个网页并重试下载。
<br>
4. 如果这个浏览器下载文件时的保存位置是机械硬盘，你可以尝试修改下载位置为固态硬盘（SSD）。这对一些用户很有效。
<br>
5. 如果你打开了很多标签页，可以关闭一些标签页以减轻浏览器的负载。有些用户在打开很多标签页时下载会卡住（文件下载之后需要等待 10 秒钟才能保存），但在打开少量标签页时没有此问题。
<br>
6. 你可以点击浏览器菜单栏上的用户头像按钮，添加新的用户配置（即新建一个浏览器本地用户），然后打开新用户的浏览器窗口，在里面安装和使用这个下载器。
<br>
7. 卸载这个浏览器并重新安装它，或者安装一个新的浏览器。
<br>
8. 清除浏览器的下载记录，然后重启浏览器。这个方法可能无效，但清理不需要的下载记录是有益的。提示：如果浏览器的下载记录很多，会导致浏览器在启动时、打开下载管理页面时卡住一段时间，并可能导致其他潜在问题。`,
    `有些用戶可能會遇到下載卡住的問題：檔案的下載進度條達到 100% 後，需要等待一段時間才能保存到硬碟上，也可能始終無法保存。這個問題可能與瀏覽器或者硬碟有關，而且有多種原因都可以導致此問題。
<br>
我沒有遇到過這個問題（實際上多數用戶應該都不會經常遇到這個問題）。如果你遇到了這個問題，可以嘗試以下操作，其中一些方法已經被驗證過是有效的。
<br>
1. 刷新這個網頁，讓下載器重試下載。
<br>
2. 點擊暫停下載按鈕，然後點擊開始下載按鈕。
<br>
3. 打開瀏覽器的擴展管理頁面，點擊這個擴展的刷新按鈕來重新載入它，然後刷新這個網頁並重試下載。
<br>
4. 如果這個瀏覽器下載檔案時的保存位置是機械硬碟，你可以嘗試修改下載位置為固態硬碟（SSD）。這對一些用戶很有效。
<br>
5. 如果你打開了很多標籤頁，可以關閉一些標籤頁以減輕瀏覽器的負載。有些用戶在打開很多標籤頁時下載會卡住（檔案下載之後需要等待 10 秒鐘才能保存），但在打開少量標籤頁時沒有此問題。
<br>
6. 你可以點擊瀏覽器選單欄上的用戶頭像按鈕，添加新的用戶配置（即新建一個瀏覽器本地用戶），然後打開新用戶的瀏覽器視窗，在裡面安裝和使用這個下載器。
<br>
7. 卸載這個瀏覽器並重新安裝它，或者安裝一個新的瀏覽器。
<br>
8. 清除瀏覽器的下載記錄，然後重啟瀏覽器。這個方法可能無效，但清理不需要的下載記錄是有益的。提示：如果瀏覽器的下載記錄很多，會導致瀏覽器在啟動時、打開下載管理頁面時卡住一段時間，並可能導致其他潛在問題。`,
    `Some users may encounter a download stuck issue: after the file's download progress bar reaches 100%, it may take some time to save to the hard drive, or it may never save. This issue may be related to the browser or hard drive, and there can be multiple causes.
<br>
I haven't encountered this issue (in fact, most users probably won't encounter it frequently). If you encounter this issue, you can try the following operations, some of which have been verified to be effective.
<br>
1. Refresh this webpage to let the downloader retry the download.
<br>
2. Click the pause download button, then click the start download button.
<br>
3. Open the browser's extension management page, click the refresh button for this extension to reload it, then refresh this webpage and retry the download.
<br>
4. If the browser's download save location is a mechanical hard drive, you can try changing the download location to a solid-state drive (SSD). This is effective for some users.
<br>
5. If you have many tabs open, you can close some tabs to reduce the browser's load. Some users experience download stuck when many tabs are open (waiting 10 seconds after file download to save), but not when fewer tabs are open.
<br>
6. You can click the user avatar button in the browser menu bar, add a new user profile (i.e., create a new browser local user), then open a new user's browser window, install and use this downloader in it.
<br>
7. Uninstall this browser and reinstall it, or install a new browser.
<br>
8. Clear the browser's download history, then restart the browser. This method may not work, but clearing unnecessary download history is beneficial. Tip: If the browser's download history is large, it can cause the browser to freeze for a while when starting or opening the download management page, and may lead to other potential issues.`,
    `一部のユーザーはダウンロードが停止する問題に遭遇する可能性があります：ファイルのダウンロード進捗バーが 100% に達した後、ハードドライブに保存されるまでにしばらく時間がかかる場合があり、または保存されない場合があります。この問題はブラウザまたはハードドライブに関連している可能性があり、複数の原因が考えられます。
<br>
私はこの問題に遭遇したことがありません（実際、ほとんどのユーザーは頻繁にこの問題に遭遇しないはずです）。この問題に遭遇した場合は、以下の操作を試してみてください。これらの方法の一部は有効であることが検証されています。
<br>
1. このウェブページを更新して、ダウンロードツールにダウンロードを再試行させます。
<br>
2. ダウンロード一時停止ボタンをクリックし、次にダウンロード開始ボタンをクリックします。
<br>
3. ブラウザの拡張機能管理ページを開き、この拡張機能の更新ボタンをクリックして再読み込みし、次にこのウェブページを更新してダウンロードを再試行します。
<br>
4. ブラウザのダウンロード保存場所が機械式ハードドライブの場合、ダウンロード場所をソリッドステートドライブ（SSD）に変更してみてください。これが一部のユーザーに対して効果的です。
<br>
5. 多くのタブを開いている場合、いくつかのタブを閉じてブラウザの負荷を軽減してください。一部のユーザーは多くのタブを開いているときにダウンロードが停止します（ファイルダウンロード後に保存されるまでに 10 秒待機）、しかし少ないタブではこの問題が発生しません。
<br>
6. ブラウザのメニュー バーのユーザー アバター ボタンをクリックして、新しいユーザー プロファイル（つまり、新しいブラウザローカルユーザー）を追加し、新規ユーザーのブラウザ ウィンドウを開いて、このダウンロードツールをインストールして使用します。
<br>
7. このブラウザをアンインストールして再インストールするか、新しいブラウザをインストールします。
<br>
8. ブラウザのダウンロード履歴をクリアし、ブラウザを再起動します。この方法は効果がない場合がありますが、不要なダウンロード履歴をクリアすることは有益です。ヒント：ブラウザのダウンロード履歴が多い場合、起動時やダウンロード管理ページを開く際に一時的にフリーズし、他の潜在的な問題を引き起こす可能性があります。`,
    `일부 사용자는 다운로드가 멈추는 문제를 겪을 수 있습니다: 파일의 다운로드 진행률이 100%에 도달한 후 하드 드라이브에 저장되는 데 시간이 걸리거나, 저장되지 않을 수 있습니다. 이 문제는 브라우저나 하드 드라이브와 관련이 있을 수 있으며, 여러 원인이 있을 수 있습니다.
<br>
저는 이 문제를 겪어본 적이 없습니다 (사실 대부분의 사용자는 자주 이 문제를 겪지 않을 것입니다). 이 문제를 겪는다면 다음 작업을 시도해 보세요. 이 중 일부 방법은 효과가 검증되었습니다.
<br>
1. 이 웹페이지를 새로 고침하여 다운로더가 다운로드를 다시 시도하도록 합니다.
<br>
2. 다운로드 일시 중지 버튼을 클릭한 후 다운로드 시작 버튼을 클릭합니다.
<br>
3. 브라우저의 확장 프로그램 관리 페이지로 이동하여 이 확장 프로그램의 새로 고침 버튼을 클릭해 다시 로드한 다음, 이 웹페이지를 새로 고침하고 다운로드를 다시 시도합니다.
<br>
4. 브라우저의 다운로드 저장 위치가 기계식 하드 드라이브라면, 다운로드 위치를 솔리드 스테이트 드라이브(SSD)로 변경해 보세요. 이는 일부 사용자에게 효과적입니다.
<br>
5. 많은 탭을 열어두었다면 일부 탭을 닫아 브라우저의 부하를 줄여보세요. 일부 사용자는 많은 탭을 열어두었을 때 다운로드가 멈추며 (파일 다운로드 후 10초 대기해야 저장됨), 적은 탭일 때는 문제가 없습니다.
<br>
6. 브라우저 메뉴 모음의 사용자 아바타 버튼을 클릭하여 새 사용자 프로필(즉, 새 브라우저 로컬 사용자)을 추가한 후, 새 사용자의 브라우저 창을 열고 그 안에서 이 다운로더를 설치하고 사용합니다.
<br>
7. 이 브라우저를 제거하고 재설치하거나, 새 브라우저를 설치합니다.
<br>
8. 브라우저의 다운로드 기록을 지우고 브라우저를 재시작합니다. 이 방법은 효과가 없을 수 있지만, 불필요한 다운로드 기록을 정리하는 것은 유익합니다. 팁: 브라우저의 다운로드 기록이 많으면 시작 시나 다운로드 관리 페이지 열 때 잠시 멈추며, 다른 잠재적 문제를 일으킬 수 있습니다.`,
    `Некоторые пользователи могут столкнуться с проблемой зависания загрузки: после достижения полосой прогресса загрузки файла 100% может потребоваться некоторое время для сохранения на жесткий диск, или файл может так и не сохраниться. Эта проблема может быть связана с браузером или жестким диском, и её могут вызывать различные причины.
<br>
Я не сталкивался с этой проблемой (на самом деле, большинство пользователей, вероятно, не сталкиваются с ней часто). Если вы столкнулись с этой проблемой, попробуйте следующие действия, некоторые из которых были проверены на эффективность.
<br>
1. Обновите эту веб-страницу, чтобы загрузчик повторил попытку загрузки.
<br>
2. Нажмите кнопку паузы загрузки, затем кнопку запуска загрузки.
<br>
3. Откройте страницу управления расширениями браузера, нажмите кнопку обновления для этого расширения, чтобы перезагрузить его, затем обновите эту веб-страницу и повторите попытку загрузки.
<br>
4. Если место сохранения файлов в этом браузере — механический жесткий диск, попробуйте изменить место загрузки на твердотельный накопитель (SSD). Это эффективно для некоторых пользователей.
<br>
5. Если у вас открыто много вкладок, закройте некоторые из них, чтобы снизить нагрузку на браузер. Некоторые пользователи сталкиваются с зависанием загрузки при открытии многих вкладок (нужно ждать 10 секунд после загрузки файла для сохранения), но при меньшем количестве вкладок проблема отсутствует.
<br>
6. Вы можете нажать кнопку аватара пользователя в панели меню браузера, добавить новый профиль пользователя (т.е. создать нового локального пользователя браузера), затем открыть окно браузера нового пользователя и установить и использовать этот загрузчик в нём.
<br>
7. Удалите этот браузер и переустановите его или установите новый браузер.
<br>
8. Очистите историю загрузок браузера, затем перезапустите браузер. Этот метод может не сработать, но очистка ненужной истории загрузок полезна. Совет: Если история загрузок браузера велика, это может привести к зависанию браузера при запуске или открытии страницы управления загрузками на некоторое время и вызвать другие потенциальные проблемы.`,
  ],
  _在多图作品页面里显示缩略图列表: [
    '在多图作品页面里显示<span class="key">缩略图</span>列表',
    '在多圖作品頁面裡顯示<span class="key">縮圖</span>列表',
    'Show <span class="key">thumbnail</span> list on multi-image work pages',
    '複数画像作品ページで<span class="key">サムネイル</span>一覧を表示',
    '멀티 이미지 작품 페이지에서 <span class="key">썸네일</span> 목록을 표시',
    'На рабочей странице с несколькими изображениями отобразите список <span class="key">эскизов</span>',
  ],
  _在多图作品页面里显示缩略图列表的说明: [
    `在多图作品页面里（/artworks/)，下载器可以显示每一张图片的预览图。`,
    `在多圖作品頁面裡（/artworks/)，下載器可以顯示每一張圖片的預覽圖。`,
    `On a multi-image artwork page (/artworks/), the downloader can display a preview of each image.`,
    `複数画像のアートワーク ページ (/artworks/) では、ダウンローダーは各画像のプレビューを表示できます。`,
    `여러 이미지로 구성된 아트워크 페이지(/artworks/)에서 다운로더는 각 이미지의 미리보기를 표시할 수 있습니다.`,
    `На странице с несколькими изображениями (/artworks/) загрузчик может отображать предварительный просмотр каждого изображения.`,
  ],
  _提交: ['提交', '提交', 'Submit', '提出する', '제출하다', 'Подавать'],
  _已导出被删除的作品的ID列表: [
    '已导出被删除的作品的 ID 列表',
    '已匯出被刪除的作品的 ID 列表',
    'List of IDs of deleted works exported',
    'エクスポートされた削除作品のID一覧',
    '내보낸 삭제된 작품의 ID 목록',
    'Список идентификаторов удаленных работ экспортирован',
  ],
  _在收藏页面里提示有辅助功能可用: [
    '在你的收藏页面里，下载器的“更多”标签页里有一些功能可以帮助管理你的收藏。',
    '在你的收藏頁面裡，下載器的“更多”標籤頁裡有一些功能可以幫助管理你的收藏。',
    `On your bookmarks page, the Downloader's "More" tab has some features to help you manage your bookmarks.`,
    'ブックマーク ページのダウンローダーの [その他] タブには、ブックマークの管理に役立つ機能がいくつかあります。',
    '북마크 페이지에서 다운로더의 "더보기" 탭에는 북마크를 관리하는 데 도움이 되는 몇 가지 기능이 있습니다.',
    'На странице закладок на вкладке «Дополнительно» Downloader есть некоторые функции, которые помогут вам управлять своими закладками.',
  ],
  _预览作品的详细信息: [
    '预览作品的<span class="key">详细</span>信息',
    '預覽作品時的<span class="key">詳細</span>資料',
    'Preview the <span class="key">details</span> of the work',
    'プレビュー作品の<span class="key">詳細</span>です',
    '작품의 <span class="key">상세한 정보</span>를 미리보다',
    'Подробности <span class="key">предварительного показа</span>',
  ],
  _预览作品的详细信息的说明: [
    '鼠标放在作品缩略图上即可查看作品数据',
    '滑鼠放在作品縮圖上即可檢視作品資料',
    'Mouse over the thumbnail of the work to view the work data',
    '作品のサムネイルにマウスをかざすだけで作品データを見ることができます',
    '마우스를 작품 썸네일 위에 놓으면 작품 데이터를 볼 수 있다',
    'Данные о работе можно увидеть с помощью мыши на сокращённом графике',
  ],
  _显示区域宽度: [
    '显示区域宽度',
    '顯示區域寬度',
    'Display area width',
    '表示領域幅です',
    '영역 너비 보이기',
    'Покажи ширину зоны',
  ],
  _写入剪贴板失败: [
    '写入剪贴板失败',
    '寫入剪貼簿失敗',
    'Writing to clipboard failed',
    'クリップボードへの書き込みに失敗しました',
    '클립보드에 쓰지 못했습니다.',
    'Запись в буфер обмена не удалась',
  ],
  _在搜索页面里移除已关注用户的作品: [
    '在搜索页面里<span class="key">移除</span>已关注用户的作品',
    '在搜尋頁面裡<span class="key">移除</span>已關注使用者的作品',
    '<span class="key">Remove</span> the works of followed users from the search page',
    'フォローしているユーザーの作品を検索ページから<span class="key">削除</span>します',
    '검색 페이지에서 팔로우한 사용자의 작품을 <span class="key">제거</span>합니다',
    '<span class="key">Удалить</span> работы подписавшихся пользователей со страницы поиска',
  ],
  _在搜索页面里移除已关注用户的作品的说明: [
    '这样只会显示未关注用户的作品，便于你发现新的喜欢的用户。<br>只在搜索页面（/tags/）里生效。',
    '這樣只會顯示未關注使用者的作品，便於你發現新的喜歡的使用者。<br>只在搜尋頁面（/tags/）裡生效。',
    'This will only display the works of unfollowed users, making it easier for you to discover new users you like.<br>Only works on the search page (/tags/).',
    'フォローを解除しているユーザーの作品のみが表示されるので、新たに好みのユーザーを見つけやすくなります。<br>検索ページ (/tags/) でのみ機能します。',
    '팔로우하지 않은 사용자의 작품만 표시되므로 마음에 드는 새로운 사용자를 더 쉽게 찾을 수 있습니다.<br>검색 페이지(/tags/)에서만 작동합니다.',
    'При этом будут отображаться только работы пользователей, на которых вы не подписаны, что облегчит вам поиск новых пользователей, которые вам нравятся.<br>Работает только на странице поиска (/tags/).',
  ],
  _使用方向键和空格键切换图片: [
    '使用方向键和空格键切换图片',
    '使用方向鍵和空格鍵切換圖片',
    'Use the arrow keys and space bar to switch images',
    '矢印キーとスペースバーを使用して画像を切り替えます',
    '이미지를 전환하려면 화살표 키와 스페이스바를 사용하세요.',
    'Используйте клавиши со стрелками и пробел для переключения изображений.',
  ],
  _使用方向键和空格键切换图片的提示: [
    '← ↑ 上一张图片<br>→ ↓ 下一张图片<br>空格键 下一张图片',
    '← ↑ 上一張圖片<br>→ ↓ 下一張圖片<br>空格鍵 下一張圖片',
    '← ↑ Previous image<br>→ ↓ Next image<br>Spacebar Next image',
    '← ↑ 前の画像<br>→ ↓ 次の画像<br>スペースバー 次の画像',
    '← ↑ 이전 이미지<br>→ ↓ 다음 이미지<br>스페이스바 다음 이미지',
    '← ↑ Предыдущее изображение<br>→ ↓ Следующее изображение<br>Пробел Следующее изображение',
  ],
  _快捷键列表: [
    '快捷键列表',
    '快捷鍵列表',
    'Shortcut list',
    'ショートカットリスト',
    '바로가기 목록',
    'Список ярлыков',
  ],
  _预览作品的快捷键说明: [
    `<span class="blue">Alt</span> + <span class="blue">P</span> 关闭/启用预览作品功能<br>
当你查看预览图时，可以使用如下快捷键：<br>
<span class="blue">B</span>(ookmark) 收藏预览的作品<br>
<span class="blue">C</span>(urrent) 下载当前预览的图片（如果这个作品里有多张图片，只会下载当前这一张）<br>
<span class="blue">D</span>(ownload) 下载当前预览的作品（如果这个作品里有多张图片，默认会全部下载）<br>
<span class="blue">Alt</span> + <span class="blue">C</span> 复制当前预览的图片和作品信息<br>
<span class="blue">Esc</span> 关闭预览图<br>
<span class="blue">← ↑</span> 上一张图片<br>
<span class="blue">→ ↓</span> 下一张图片<br>
<span class="blue">空格键</span> 下一张图片`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> 關閉/啟用預覽作品功能<br>
當你查看預覽圖時，可以使用如下快捷鍵：<br>
<span class="blue">B</span>(ookmark) 收藏預覽的作品<br>
<span class="blue">C</span>(urrent) 下載當前預覽的圖片（如果這個作品裡有多張圖片，只會下載當前這一張）<br>
<span class="blue">D</span>(ownload) 下載當前預覽的作品（如果這個作品裡有多張圖片，預設會全部下載）<br>
<span class="blue">Alt</span> + <span class="blue">C</span> 複製當前預覽的圖片和作品資訊<br>
<span class="blue">Esc</span> 關閉預覽圖<br>
<span class="blue">← ↑</span> 上一張圖片<br>
<span class="blue">→ ↓</span> 下一張圖片<br>
<span class="blue">空格鍵</span> 下一張圖片`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> Toggle preview work function on/off<br>
When viewing the preview image, you can use the following shortcut keys:<br>
<span class="blue">B</span>(ookmark) Bookmark the previewed work<br>
<span class="blue">C</span>(urrent) Download the currently previewed image (if the work has multiple images, only the current one will be downloaded)<br>
<span class="blue">D</span>(ownload) Download the currently previewed work (if the work has multiple images, all will be downloaded by default)<br>
<span class="blue">Alt</span> + <span class="blue">C</span> Copy the currently previewed image and work information<br>
<span class="blue">Esc</span> Close the preview image<br>
<span class="blue">← ↑</span> Previous image<br>
<span class="blue">→ ↓</span> Next image<br>
<span class="blue">Spacebar</span> Next image`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> プレビュー作品機能のオン/オフ<br>
プレビュー画像を表示しているときに、以下のショートカットキーを使用できます：<br>
<span class="blue">B</span>(ookmark) プレビュー中の作品をブックマーク<br>
<span class="blue">C</span>(urrent) 現在プレビュー中の画像をダウンロード（作品に複数の画像がある場合、現在表示中のものだけがダウンロードされます）<br>
<span class="blue">D</span>(ownload) 現在プレビュー中の作品をダウンロード（作品に複数の画像がある場合、デフォルトですべてダウンロードされます）<br>
<span class="blue">Alt</span> + <span class="blue">C</span> 現在プレビュー中の画像と作品情報をコピー<br>
<span class="blue">Esc</span> プレビュー画像を閉じる<br>
<span class="blue">← ↑</span> 前の画像<br>
<span class="blue">→ ↓</span> 次の画像<br>
<span class="blue">スペースキー</span> 次の画像`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> 미리보기 작품 기능 끄기/켜기<br>
미리보기 이미지를 볼 때 다음 단축키를 사용할 수 있습니다:<br>
<span class="blue">B</span>(ookmark) 미리보기 중인 작품을 북마크<br>
<span class="blue">C</span>(urrent) 현재 미리보기 중인 이미지를 다운로드 (작품에 여러 이미지가 있으면 현재 이 하나만 다운로드)<br>
<span class="blue">D</span>(ownload) 현재 미리보기 중인 작품을 다운로드 (작품에 여러 이미지가 있으면 기본적으로 모두 다운로드)<br>
<span class="blue">Alt</span> + <span class="blue">C</span> 현재 미리보기 중인 이미지와 작품 정보를 복사<br>
<span class="blue">Esc</span> 미리보기 이미지 닫기<br>
<span class="blue">← ↑</span> 이전 이미지<br>
<span class="blue">→ ↓</span> 다음 이미지<br>
<span class="blue">스페이스바</span> 다음 이미지`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> Включить/выключить функцию предпросмотра работы<br>
При просмотре изображения предпросмотра вы можете использовать следующие комбинации клавиш:<br>
<span class="blue">B</span>(ookmark) Добавить предпросматриваемую работу в закладки<br>
<span class="blue">C</span>(urrent) Скачать изображение текущего предпросмотра (если в работе несколько изображений, будет скачано только текущее)<br>
<span class="blue">D</span>(ownload) Скачать работу текущего предпросмотра (если в работе несколько изображений, по умолчанию все будут скачаны)<br>
<span class="blue">Alt</span> + <span class="blue">C</span> Скопировать изображение текущего предпросмотра и информацию о работе<br>
<span class="blue">Esc</span> Закрыть изображение предпросмотра<br>
<span class="blue">← ↑</span> Предыдущее изображение<br>
<span class="blue">→ ↓</span> Следующее изображение<br>
<span class="blue">Пробел</span> Следующее изображение`,
  ],
  _导出收藏列表: [
    '导出收藏列表（JSON）',
    '匯出收藏列表（JSON）',
    'Export bookmark list（JSON）',
    'ブックマークリストをエクスポートする（JSON）',
    '북마크 목록 내보내기（JSON）',
    'Экспортировать список закладок（JSON）',
  ],
  _导入收藏列表: [
    '导入收藏列表（批量添加收藏）',
    '匯入收藏列表（批次新增收藏）',
    'Import bookmark list (add bookmarks in batches)',
    'ブックマークリストをインポート（ブックマークを一括追加）',
    '북마크 목록 가져오기(북마크 일괄 추가)',
    'Импортировать список закладок (добавлять закладки пакетно)',
  ],
  _提示会跳过已收藏的作品: [
    `如果一个作品已经被收藏，下载器会跳过它，以减少不必要的请求。`,
    `如果一個作品已經被收藏，下載器會跳過它，以減少不必要的請求。`,
    `If a work has already been bookmarked, the downloader will skip it to reduce unnecessary requests.`,
    `作品がすでにブックマークされている場合、ダウンロードツールはそれをスキップして不要なリクエストを減らします。`,
    `작품이 이미 북마크되어 있다면 다운로더가 해당 작품을 건너뛰어 불필요한 요청을 줄입니다.`,
    `Если работа уже добавлена в закладки, загрузчик пропустит её, чтобы уменьшить количество ненужных запросов.`,
  ],
  _加载收藏列表: [
    '正在加载你的收藏列表，以避免重复添加收藏',
    '正在載入你的收藏列表，以避免重複新增收藏',
    'Loading your bookmark list to avoid duplicate bookmarks',
    'ブックマークの重複を避けるためにブックマーク リストをロードする',
    '중복 북마크를 방지하기 위해 북마크 목록 로드 중',
    'Загрузка списка закладок, чтобы избежать дублирования закладок',
  ],
  _一共有x个: [
    '一共有 {} 个',
    '一共有 {} 個',
    'There are {} in total',
    '合計 {} 個あります',
    '총 {}개가 있습니다.',
    'Всего {}',
  ],
  _跳过x个: [
    '跳过了 {} 个已存在的收藏',
    '跳過了 {} 個已存在的收藏',
    '{} existing bookmarks skipped',
    '{} 個の既存のブックマークがスキップされました',
    '{}개의 기존 북마크를 건너뛰었습니다.',
    '{} существующих закладок пропущено',
  ],
  _保存作品的简介: [
    '保存作品<span class="key">简介</span>',
    '儲存作品<span class="key">說明</span>',
    'Save work <span class="key">description</span>',
    '作品<span class="key">説明</span>の保存',
    '작품 <span class="key">설명</span> 저장',
    'Сохранить <span class="key">описание</span> работы',
  ],
  _保存作品的简介2: [
    '保存作品简介',
    '儲存作品說明',
    'Save work description',
    '作品説明の保存',
    '작품 설명 저장',
    'Сохранить описание работы',
  ],
  _保存作品简介的说明: [
    '生成 TXT 文件保存作品简介',
    '生成 TXT 檔案儲存作品說明',
    'Create a TXT file to save the work description',
    '作業説明を保存するためのTXTファイルを作成します。',
    '작업 설명을 저장하려면 TXT 파일을 만드세요.',
    'Создайте файл TXT для сохранения описания работы.',
  ],
  _简介: ['简介', '說明', 'description', '説明', '설명', 'описание'],
  _简介汇总: [
    '简介汇总',
    '說明彙總',
    'description summary',
    '説明の概要',
    '설명 요약',
    'краткое описание',
  ],
  _每个作品分别保存: [
    '每个作品分别保存',
    '每個作品分別儲存',
    'Save each work separately',
    '作品ごとに分けて保存する',
    '각 작품을 별도로 저장',
    'Сохраняйте каждую работу отдельно',
  ],
  _简介的Links标记: [
    `把每个作品的简介保存到单独的 TXT 文件里。<br>如果作品简介里含有超链接，下载器会在文件名末尾添加 'links' 标记`,
    `如果作品說明裡含有超連結，下載器會在檔名末尾新增 'links' 標記`,
    `Save each work's description in a separate TXT file.<br>If the work description contains hyperlinks, the downloader will add a 'links' tag at the end of the file name`,
    `各作品の説明を別々の TXT ファイルに保存します。 <br>作品の説明にハイパーリンクが含まれている場合、ダウンローダーはファイル名の末尾に「links」タグを追加します。`,
    `각 작품에 대한 설명을 별도의 TXT 파일로 저장합니다. <br>작업 설명에 하이퍼링크가 포함된 경우 다운로더는 파일 이름 끝에 'links' 태그를 추가합니다.`,
    `Сохраните описание каждой работы в отдельном TXT-файле. <br>Если описание работы содержит гиперссылки, загрузчик добавит тег «links» в конце имени файла.`,
  ],
  _汇总到一个文件: [
    '汇总到一个文件',
    '彙總到一個檔案',
    'Summarize to one file',
    '1つのファイルにまとめる',
    '하나의 파일로 요약',
    'Свести в один файл',
  ],
  _后续作品低于最低收藏数量要求跳过后续作品: [
    '⏩检测到后续作品的收藏数量低于用户设置的数字，跳过后续作品',
    '⏩檢測到後續作品的收藏數量低於使用者設定的數字，跳過後續作品',
    '⏩It is detected that the number of bookmarks of subsequent works is lower than the number set by the user, and subsequent works are skipped.',
    '⏩以降の作品のブックマーク数がユーザーが設定した数よりも少ないことを検出し、以降の作品をスキップする。',
    '⏩후속 작품의 북마크 수가 사용자가 설정한 수보다 적은 것으로 감지되어 후속 작품을 건너뜁니다.',
    '⏩Обнаружено, что количество закладок последующих произведений меньше количества, установленного пользователем, и последующие произведения пропускаются.',
  ],
  _间隔时间: [
    '间隔时间：',
    '間隔時間：',
    'Interval time:',
    'インターバル時間：',
    '간격 시간:',
    'Интервал времени:',
  ],
  _已有抓取结果时进行提醒: [
    '这个标签页里已经有抓取结果了，重新开始抓取会清空这些抓取结果。\n请确认是否要重新开始抓取？',
    '這個標籤頁裡已經有抓取結果了，重新開始抓取會清空這些抓取結果。\n請確認是否要重新開始抓取？',
    'There are already crawl results on this tab. Restarting the crawl will clear these crawl results. \nPlease confirm that you want to restart the crawl?',
    'このタブにはすでにクロール結果があります。クロールを再開すると、これらのクロール結果は消去されます。 \nクロールを再開するかどうかを確認してください?',
    '이 탭에는 이미 크롤링 결과가 있습니다. 크롤링을 다시 시작하면 크롤링 결과가 지워집니다. \n크롤링을 다시 시작할 것인지 확인해주세요.',
    'На этой вкладке уже есть результаты сканирования. При перезапуске сканирования эти результаты будут удалены. \nПодтвердите, хотите ли вы возобновить сканирование?',
  ],
  _下载间隔: [
    '下载<span class="key">间隔</span>',
    '下載<span class="key">間隔</span>',
    'Download <span class="key">interval</span>',
    'ダウンロード<span class="key">間隔</span>',
    '다운로드 <span class="key">간격</span>',
    '<span class="key">Интервал</span> загрузки',
  ],
  _秒: ['秒', '秒', 'seconds', '秒', '초', 'секунд'],
  _下载间隔的说明: [
    `每隔一定时间开始一次下载。<br>
如果把间隔时间设置为 0，下载器就不会添加延迟时间。<br>
如果设置为 1 秒（默认值），那么每小时最多会下载 3600 个抓取结果（不计算附带下载的文件，例如小说的封面图片和内嵌的图片）。<br>
这是因为连续下载很多文件（特别是小说）时，你的 Pixiv 账号可能会被警告或封禁。设置间隔时间可以缓解此问题。<br>`,
    `每隔一定時間開始一次下載。<br>
如果把間隔時間設置為 0，下載器就不會添加延遲時間。<br>
如果設置為 1 秒（默認值），那麼每小時最多會下載 3600 個抓取結果（不計算附帶下載的文件，例如小說的封面圖片和內嵌的圖片）。<br>
這是因為連續下載很多文件（特別是小說）時，你的 Pixiv 賬號可能會被警告或封禁。設置間隔時間可以緩解此問題。<br>`,
    `Start a download every certain interval of time.<br>
If the interval time is set to 0, the downloader will not add delay time.<br>
If set to 1 second (default value), then up to 3600 crawl results will be downloaded per hour (not counting attached download files, such as novel cover images and embedded images).<br>
This is because when continuously downloading many files (especially novels), your Pixiv account may be warned or banned. Setting the interval time can alleviate this issue.<br>`,
    `一定の間隔でダウンロードを開始します。<br>
間隔時間を 0 に設定すると、ダウンロードツールは遅延時間を追加しません。<br>
1 秒（デフォルト値）に設定すると、1 時間あたり最大 3600 個のクロール結果をダウンロードします（小説の表紙画像や埋め込み画像などの付属ダウンロードファイルは計算に含めません）。<br>
これは、連続して多くのファイル（特に小説）をダウンロードすると、Pixiv アカウントが警告またはBANされる可能性があるためです。間隔時間を設定することで、この問題を緩和できます。<br>`,
    `일정 간격으로 다운로드를 시작합니다.<br>
간격 시간을 0으로 설정하면 다운로더가 지연 시간을 추가하지 않습니다.<br>
1초(기본값)로 설정하면, 시간당 최대 3600개의 크롤 결과(소설 표지 이미지나 내장 이미지와 같은 부수적 다운로드 파일은 계산하지 않음)를 다운로드합니다.<br>
이는 많은 파일(특히 소설)을 연속으로 다운로드하면 Pixiv 계정이 경고되거나 차단될 수 있기 때문입니다. 간격 시간을 설정하면 이 문제를 완화할 수 있습니다.<br>`,
    `Запускать загрузку через определенные интервалы времени.<br>
Если установить время интервала на 0, загрузчик не добавит задержку.<br>
Если установить на 1 секунду (значение по умолчанию), то максимум 3600 результатов захвата будет загружено в час (не считая дополнительные файлы для загрузки, такие как обложки романов и встроенные изображения).<br>
Это потому, что при непрерывной загрузке множества файлов (особенно романов) ваш аккаунт Pixiv может быть предупрежден или заблокирован. Установка интервала времени может смягчить эту проблему.<br>`,
  ],
  _从页面上移除他们的作品: [
    '从页面上移除他们的作品',
    '從頁面上移除他們的作品',
    'Remove their work from the page',
    'ページから作品を削除する',
    '페이지에서 해당 작업을 제거합니다.',
    'Удалить их работу со страницы',
  ],
  _移除了用户xxx的作品: [
    '移除了用户 {} 的作品',
    '移除了使用者 {} 的作品',
    'Removed work from user {}',
    'ユーザー {} の作品を削除しました',
    '사용자 {} 의 작업이 제거되었습니다.',
    'Удалена работа пользователя {}',
  ],
  _用户阻止名单的说明2: [
    `下载器不会抓取“用户阻止名单”里的用户的作品，而且还可以从页面上移除他们的作品，这样你就不会看到不喜欢的用户的作品了。<br>
PS：在被阻止的用户的主页里不会移除他们的作品，所以你可以正常查看他们的主页。`,
    `下載器不會抓取“使用者阻止名單”裡的使用者的作品，而且還可以從頁面上移除他們的作品，這樣你就不會看到不喜歡的使用者的作品了。<br>
PS：在被阻止的使用者的主頁裡不會移除他們的作品，所以你可以正常檢視他們的主頁。`,
    `The downloader will not crawl the works of users in the "user block list", and can also remove their works from the page, so you won't see the works of users you don't like. <br>
PS: The works of blocked users will not be removed from their homepages, so you can view their homepages normally.`,
    `ダウンローダーは「ユーザーブロックリスト」内のユーザーの作品をクロールしません。また、ページから作品を削除することもできます。そのため、気に入らないユーザーの作品は表示されません。<br>
追記：ブロックされたユーザーの作品はホームページから削除されないため、通常どおりホームページを閲覧できます。`,
    `다운로더는 "사용자 차단 목록"에 있는 사용자의 작품을 크롤링하지 않으며, 페이지에서 해당 작품을 제거할 수도 있으므로 마음에 들지 않는 사용자의 작품은 볼 수 없습니다. <br>
PS: 차단된 사용자의 작품은 홈페이지에서 제거되지 않으므로, 해당 홈페이지를 정상적으로 볼 수 있습니다.`,
    `Загрузчик не будет сканировать работы пользователей из «списка заблокированных пользователей», а также может удалить их работы со страницы, так что вы не увидите работы пользователей, которые вам не нравятся. <br>
P.S. Работы заблокированных пользователей не будут удалены с их домашних страниц, так что вы сможете просматривать их домашние страницы как обычно.`,
  ],
  _移除用户阻止名单里的用户的作品: [
    '移除“用户阻止名单”里的用户的作品',
    '移除“使用者阻止名單”裡的使用者的作品',
    'Remove works from users in the "User Blocklist"',
    '「ユーザーブロックリスト」のユーザーから作品を削除する',
    '"사용자 차단 목록"에 있는 사용자의 작품을 제거합니다.',
    'Удалить работы пользователей из «Черного списка пользователей»',
  ],
  _修复了因Pixiv变化而失效的显示更大的缩略图功能: [
    '修复了因 Pixiv 变化而失效的一些增强功能，比如“显示更大的缩略图”、“高亮关注的用户”等功能。',
    '修復了因 Pixiv 變化而失效的一些增強功能，比如“顯示更大的縮圖”、“高亮關注的使用者”等功能。',
    'Fixed some enhancements that were invalid due to Pixiv changes, such as "show larger thumbnails", "highlight followed users", etc.',
    '「サムネイルを大きく表示する」「フォローしているユーザーを強調表示する」など、Pixiv の変更により無効になっていたいくつかの拡張機能を修正しました。',
    'Pixiv 변경으로 인해 유효하지 않았던 "더 큰 썸네일 표시", "팔로우한 사용자 강조 표시" 등 몇 가지 향상된 기능을 수정했습니다.',
    'Исправлены некоторые улучшения, которые были недействительны из-за изменений Pixiv, такие как «показывать увеличенные миниатюры», «выделять подписчиков» и т. д.',
  ],
  _支持抓取好P友的作品: [
    '支持抓取“好P友”页面里的作品：<br><a href="https://www.pixiv.net/mypixiv_new_illust.php" target="_blank">https://www.pixiv.net/mypixiv_new_illust.php</a>',
    '支援抓取“好P友”頁面裡的作品：<br><a href="https://www.pixiv.net/mypixiv_new_illust.php" target="_blank">https://www.pixiv.net/mypixiv_new_illust.php</a>',
    'Supports crawling works from the "My pixiv" page:<br><a href="https://www.pixiv.net/mypixiv_new_illust.php" target="_blank">https://www.pixiv.net/mypixiv_new_illust.php</a>',
    '「マイピクの作品」ページからの作品のクロールをサポートします:<br><a href="https://www.pixiv.net/mypixiv_new_illust.php" target="_blank">https://www.pixiv.net/mypixiv_new_illust.php</a>',
    '"마이픽 작품" 페이지에서 크롤링 작업을 지원합니다.<br><a href="https://www.pixiv.net/mypixiv_new_illust.php" target="_blank">https://www.pixiv.net/mypixiv_new_illust.php</a>https://www.pixiv.net/mypixiv_new_illust.php',
    'Поддерживает сканирование работ со страницы «My pixiv»:<br><a href="https://www.pixiv.net/mypixiv_new_illust.php" target="_blank">https://www.pixiv.net/mypixiv_new_illust.php</a>',
  ],
  _为下载器的设置项添加了更多提示: [
    `为下载器的设置项添加了更详细的提示`,
    `為下載器的設定項添加了更詳細的提示`,
    `Added more detailed tips for the downloader settings`,
    `ダウンローダー設定に関するより詳細なヒントを追加しました`,
    `다운로더 설정에 대한 더 자세한 팁을 추가했습니다`,
    `Добавлены более подробные советы по настройкам загрузчика`,
  ],
  _移除设置项: [
    '移除设置项：',
    '移除設定項：',
    'Remove the settings item: ',
    '設定項目を削除します: ',
    '설정 항목을 제거합니다. ',
    'Удалить пункт настроек: ',
  ],
  _显示日志: [
    '显示日志',
    '顯示日誌',
    'Show Log',
    'ログを表示',
    '로그 표시',
    'Показать журнал',
  ],
  _没有日志: [
    '没有日志',
    '沒有日誌',
    'No logs',
    'ログなし',
    '로그 없음',
    'Нет журналов',
  ],
  _在作品页面里为每张图片添加下载按钮: [
    '在插画和漫画页面里，下载器会为每张图片添加一个下载按钮。当你只需要下载特定图片时很有用。',
    '在插畫和漫畫頁面裡，下載器會為每張圖片新增一個下載按鈕。當你只需要下載特定圖片時很有用。',
    'On the illustration and manga pages, the downloader will add a download button for each image. Useful when you only need to download specific images.',
    'イラストページとマンガページでは、各画像にダウンロードボタンが表示されます。特定の画像のみをダウンロードしたい場合に便利です。',
    '일러스트와 만화 페이지에서는 다운로더가 각 이미지에 대한 다운로드 버튼을 추가합니다. 특정 이미지만 다운로드해야 할 때 유용합니다.',
    'На страницах иллюстраций и манги загрузчик добавит кнопку загрузки для каждого изображения. Полезно, когда вам нужно загрузить только определенные изображения.',
  ],
  _行为变更: [
    '行为变更',
    '行為變更',
    'Behavior changes',
    '動作の変更',
    '동작 변경 사항',
    'Изменения поведения',
  ],
  _现在下载器会默认隐藏网页顶部的日志: [
    '现在下载器会默认隐藏网页顶部的日志。你可以使用一个按钮或快捷键 (L) 来查看日志。',
    '現在下載器會預設隱藏網頁頂部的日誌。你可以使用一個按鈕或快捷鍵 (L) 來檢視日誌。',
    'Downloader now hides the log at the top of the page by default. You can view the log using a button or keyboard shortcut (L).',
    'ダウンローダーは、デフォルトでページ上部のログを非表示にするようになりました。ログはボタンまたはキーボードショートカット（L）を使用して表示できます。',
    '다운로더는 이제 기본적으로 페이지 상단의 로그를 숨깁니다. 버튼이나 키보드 단축키(L)를 사용하여 로그를 볼 수 있습니다.',
    'Загрузчик теперь скрывает журнал в верхней части страницы по умолчанию. Вы можете просмотреть журнал с помощью кнопки или сочетания клавиш (L).',
  ],
  _扩展程序升到x版本: [
    '此扩展程序已经升级到 {} 版本。',
    '此擴充程式已經升級到 {} 版本。',
    'This extension has been upgraded to version {}.',
    'この拡張機能はバージョン {} にアップグレードされました。',
    '이 확장 프로그램이 {} 버전으로 업그레이드되었습니다.',
    'Это расширение было обновлено до версии {}.',
  ],
  _fanboxDownloader的说明: [
    '我制作了一个 Fanbox Downloader，不过目前它只支持 Chromium 内核的浏览器，例如 Chrome、Edge。<br>你可以从 Chrome Web Store 安装它：<br><a href="https://chrome.google.com/webstore/detail/pixiv-fanbox-downloader/ihnfpdchjnmlehnoeffgcbakfmdjcckn" target="_blank">Pixiv Fanbox Downloader</a>',
    '我製作了一個 Fanbox Downloader，不過目前它只支援 Chromium 内核的瀏覽器，例如 Chrome、Edge。<br>你可以從 Chrome Web Store 安裝它：<br><a href="https://chrome.google.com/webstore/detail/pixiv-fanbox-downloader/ihnfpdchjnmlehnoeffgcbakfmdjcckn" target="_blank">Pixiv Fanbox Downloader</a>',
    'I created a Fanbox Downloader, but it currently only supports Chromium-based browsers, such as Chrome and Edge.<br>You can install it from the Chrome Web Store:<br><a href="https://chrome.google.com/webstore/detail/pixiv-fanbox-downloader/ihnfpdchjnmlehnoeffgcbakfmdjcckn" target="_blank">Pixiv Fanbox Downloader</a>',
    '私は Fanbox Downloader を作成しましたが、現在は Chromium ベースのブラウザ（例: Chrome、Edge）のみをサポートしています。<br>Chrome Web Store からインストールできます：<br><a href="https://chrome.google.com/webstore/detail/pixiv-fanbox-downloader/ihnfpdchjnmlehnoeffgcbakfmdjcckn" target="_blank">Pixiv Fanbox Downloader</a>',
    '나는 Fanbox Downloader를 만들었지만, 현재는 Chromium 기반 브라우저(예: Chrome, Edge)만 지원합니다.<br>Chrome Web Store에서 설치할 수 있습니다:<br><a href="https://chrome.google.com/webstore/detail/pixiv-fanbox-downloader/ihnfpdchjnmlehnoeffgcbakfmdjcckn" target="_blank">Pixiv Fanbox Downloader</a>',
    'Я создал Fanbox Downloader, но в настоящее время он поддерживает только браузеры на базе Chromium, такие как Chrome и Edge.<br>Вы можете установить его из Chrome Web Store:<br><a href="https://chrome.google.com/webstore/detail/pixiv-fanbox-downloader/ihnfpdchjnmlehnoeffgcbakfmdjcckn" target="_blank">Pixiv Fanbox Downloader</a>',
  ],
  _支持Firefox: [
    '🦊下载器已经可以在 Firefox 上使用了！🥳<br>从 ADD-ONS 安装：<br><a href="https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/" target="_blank">Powerful Pixiv Downloader</a>',
    '🦊下載器已經可以在 Firefox 上使用了！🥳<br>從 ADD-ONS 安裝：<br><a href="https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/" target="_blank">Powerful Pixiv Downloader</a>',
    '🦊The downloader is now available for use on Firefox! 🥳<br>Install from ADD-ONS:<br><a href="https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/" target="_blank">Powerful Pixiv Downloader</a>',
    '🦊ダウンローダーはすでにFirefoxで使用可能です！🥳<br>ADD-ONSからインストール：<br><a href="https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/" target="_blank">Powerful Pixiv Downloader</a>',
    '🦊다운로더는 이제 Firefox에서 사용할 수 있습니다! 🥳<br>ADD-ONS에서 설치:<br><a href="https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/" target="_blank">Powerful Pixiv Downloader</a>',
    '🦊Загрузчик уже доступен для использования в Firefox! 🥳<br>Установить из ADD-ONS:<br><a href="https://addons.mozilla.org/firefox/addon/powerfulpixivdownloader/" target="_blank">Powerful Pixiv Downloader</a>',
  ],
  _提示查看wiki页面: [
    `现在你可以更方便的查看每个功能的 Wiki 页面了，只需要点击设置项的名字，或者在纯色按钮上长按，下载器就会打开对应的 Wiki 页面。`,
    `現在你可以更方便的查看每個功能的 Wiki 頁面了，只需要點擊設定項的名稱，或者在純色按鈕上長按，下載器就會打開對應的 Wiki 頁面。`,
    `Now you can view the Wiki page for each feature more conveniently, just click on the setting item's name, or long-press on the solid color button, and the downloader will open the corresponding Wiki page.`,
    `今、各機能のWikiページをより便利に閲覧できます。設定項目の名前をクリックするか、単色ボタンを長押しするだけで、ダウンロードツールが対応するWikiページを開きます。`,
    ` 이제 각 기능의 Wiki 페이지를 더 편리하게 볼 수 있습니다. 설정 항목의 이름을 클릭하거나 단색 버튼을 길게 누르면 다운로더가 해당 Wiki 페이지를 엽니다.`,
    `Теперь вы можете просматривать страницу Wiki для каждой функции более удобно: просто кликните на название элемента настройки или долго нажмите на кнопку сплошного цвета, и загрузчик откроет соответствующую страницу Wiki。`,
  ],
  _提示使用小号下载: [
    `💡本次任务需要抓取的作品数量比较多，您可以考虑使用小号进行抓取和下载，以减少大号被封禁的风险。<br>您可以在 Wiki 查看相关说明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8F%B7%E4%B8%8B%E8%BD%BD" target="_blank">使用小号下载</a>`,
    `💡本次任務需要抓取的作品數量比較多，您可以考慮使用小號進行抓取和下載，以減少大號被封禁的風險。<br>您可以在 Wiki 查看相關說明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8F%B7%E4%B8%8B%E8%BD%BD" target="_blank">使用小號下載</a>`,
    `💡This task requires crawling a large number of works. You may consider using an alt account for crawling and downloading to reduce the risk of your main account being banned. <br>You can view the relevant instructions in the Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">Using Secondary Account for Downloading</a>`,
    `💡今回のタスクでは、クロールする作品の数がかなり多いです。小号を使用してクロールとダウンロードを行うことを検討してください。これにより、大号がブロックされるリスクを低減できます。<br>Wiki で関連する説明を確認できます：<a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">小号でダウンロード</a>`,
    `💡이번 작업에서 크롤링할 작품 수가 많습니다. 대본 계정이 차단될 위험을 줄이기 위해 작은 계정을 사용하여 크롤링과 다운로드를 고려해보세요. <br>Wiki에서 관련 설명을 확인할 수 있습니다: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">작은 계정으로 다운로드</a>`,
    `💡Эта задача требует загрузки большого количества работ. Вы можете рассмотреть использование альтернативного аккаунта для загрузки и скачивания, чтобы снизить риск блокировки основного аккаунта. <br>Вы можете ознакомиться с соответствующими инструкциями в Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">Скачивание с альтернативным аккаунтом</a>`,
  ],
  _复制按钮: [
    `<span class="key">复制</span>按钮`,
    `<span class="key">複製</span>按鈕`,
    `<span class="key">Copy</span> button`,
    `<span class="key">コピー</span>ボタン`,
    `<span class="key">복사</span> 버튼`,
    `<span class="key">Копировать</span> кнопку`,
  ],
  _在缩略图上显示: [
    `在缩略图上显示`,
    `在縮略圖上顯示`,
    `Display on thumbnail`,
    `サムネイルに表示`,
    `썸네일에 표시`,
    `Отображать на миниатюре`,
  ],
  _显示复制按钮的提示: [
    `下载器会在作品缩略图上和作品页面内显示一个复制按钮，点击它就可以复制作品的图片和一些数据。
<br>
你可以自定义要复制的数据和格式。
<br>
在作品页面里，以及预览作品时，你可以按快捷键 <span class="blue">Alt + C</span> 进行复制。`,
    `下載器會在作品縮圖上和作品頁面內顯示一個複製按鈕，點擊它就可以複製作品的圖片和一些資料。
<br>
你可以自訂要複製的資料和格式。
<br>
在作品頁面裡，以及預覽作品時，你可以按快捷鍵 <span class="blue">Alt + C</span> 進行複製。`,
    `The downloader will display a copy button on the work thumbnail and within the work page. Clicking it allows you to copy the work's image and some data.
<br>
You can customize the data and format to be copied.
<br>
On the work page, and when previewing a work, you can use the shortcut key <span class="blue">Alt + C</span> to copy.`,
    `ダウンロードツールは、作品のサムネイルと作品ページ内にコピーボタンを表示します。これをクリックすると、作品の画像と一部のデータをコピーできます。
<br>
コピーするデータとフォーマットをカスタマイズできます。
<br>
作品ページ内、および作品をプレビューする際は、ショートカットキー <span class="blue">Alt + C</span> を押してコピーできます。`,
    `다운로더는 작품 썸네일과 작품 페이지 내에 복사 버튼을 표시합니다. 클릭하면 작품의 이미지와 일부 데이터를 복사할 수 있습니다.
<br>
복사할 데이터와 형식을 사용자 지정할 수 있습니다.
<br>
작품 페이지에서, 그리고 작품을 미리보기할 때, 단축키 <span class="blue">Alt + C</span>를 눌러 복사할 수 있습니다.`,
    `Загрузчик отображает кнопку копирования на миниатюре работы и внутри страницы работы. Нажатие на неё позволяет скопировать изображение работы и некоторые данные.
<br>
Вы можете настроить данные и формат для копирования.
<br>
На странице работы, а также при предпросмотре работы, вы можете использовать комбинацию клавиш <span class="blue">Alt + C</span> для копирования.`,
  ],
  _内容格式: [
    `内容格式`,
    `內容格式`,
    `Content format`,
    `内容フォーマット`,
    `내용 형식`,
    `Формат содержимого`,
  ],
  _复制内容的格式的提示: [
    `你可以设置文字内容的格式，这会影响 <span class="blue">text/plain</span> 和 <span class="blue">text/html</span> 格式复制的内容。
<br>
你可以使用命名规则里的所有标签，也可以输入自定义字符，例如空格、下划线、每个标签的名称。
<br>
另外，你还可以使用这些标签：`,
    `你可以設定文字內容的格式，這會影響 <span class="blue">text/plain</span> 和 <span class="blue">text/html</span> 格式複製的內容。
<br>
你可以使用命名規則裡的所有標籤，也可以輸入自訂字符，例如空格、下劃線、每個標籤的名稱。
<br>
另外，你還可以使用這些標籤：`,
    `You can set the format of the text content, which will affect the content copied in <span class="blue">text/plain</span> and <span class="blue">text/html</span> formats.
<br>
You can use all tags from the naming rule, or input custom characters, such as spaces, underscores, the name of each tag.
<br>
Additionally, you can use these tags:`,
    `テキスト内容の形式を設定できます。これにより、<span class="blue">text/plain</span> および <span class="blue">text/html</span> 形式でコピーされる内容に影響します。
<br>
命名規則内のすべてのタグを使用できます。また、カスタム文字を入力することもでき、例えばスペース、アンダースコア、各タグの名前です。
<br>
さらに、これらのタグを使用できます：`,
    `텍스트 내용의 형식을 설정할 수 있으며, 이는 <span class="blue">text/plain</span> 및 <span class="blue">text/html</span> 형식으로 복사되는 내용에 영향을 미칩니다.
<br>
명명 규칙의 모든 태그를 사용할 수 있으며, 사용자 정의 문자를 입력할 수도 있습니다. 예를 들어 공백, 밑줄, 각 태그의 이름.
<br>
또한, 이러한 태그를 사용할 수 있습니다:`,
    `Вы можете установить формат текстового содержимого, что повлияет на содержимое, копируемое в форматах <span class="blue">text/plain</span> и <span class="blue">text/html</span>.
<br>
Вы можете использовать все теги из правила именования, а также вводить пользовательские символы, такие как пробелы, подчеркивания, имя каждого тега.
<br>
Кроме того, вы можете использовать эти теги:`,
  ],
  _换行标记的说明: [
    `换行`,
    `換行`,
    `Line break`,
    `改行`,
    `줄 바꿈`,
    `Перенос строки`,
  ],
  _url标记的说明: [
    `这个作品的网址`,
    `這個作品的網址`,
    `This work's URL`,
    `この作品のURL`,
    `이 작품의 URL`,
    `URL этой работы`,
  ],
  _已复制: [
    `已复制`,
    `已複製`,
    `Copied`,
    `コピー済み`,
    `복사됨`,
    `Скопировано`,
  ],
  _复制失败: [
    '复制失败',
    '複製失敗',
    'Copy failed',
    'コピー失敗',
    '복사 실패',
    'Копирование не удалось',
  ],
  _复制时网页需要处于焦点状态: [
    `复制时，网页需要处于焦点状态。`,
    `複製時，網頁需要處於焦點狀態。`,
    `When copying, the webpage needs to be in a focused state.`,
    `コピーする際は、ウェブページがフォーカス状態である必要があります。`,
    `복사할 때 웹페이지가 포커스 상태여야 합니다.`,
    `При копировании веб-страница должна находиться в состоянии фокуса。`,
  ],
  _复制作品链接: [
    `复制作品链接`,
    `複製作品連結`,
    `Copy work link`,
    `作品のリンクをコピー`,
    `작품 링크 복사`,
    `Скопировать ссылку на работу`,
  ],
  _已复制作品链接: [
    `已复制作品链接`,
    `已複製作品連結`,
    `Copied work link`,
    `作品のリンクをコピーしました`,
    `작품 링크 복사됨`,
    `Скопирована ссылка на работу`,
  ],
  _复制摘要数据: [
    `复制摘要数据`,
    `複製摘要資料`,
    `Copy summary data`,
    `要約データをコピー`,
    `요약 데이터 복사`,
    `Копировать данные сводки`,
  ],
  _相关设置: [
    `相关设置`,
    `相關設定`,
    `Related settings`,
    `関連設定`,
    `관련 설정`,
    `Связанные настройки`,
  ],
  _复制内容: [
    `复制内容`,
    `複製內容`,
    `Copy content`,
    `内容をコピー`,
    `내용 복사`,
    `Копировать содержимое`,
  ],
  _复制缩略图: [
    `复制缩略图`,
    `複製縮略圖`,
    `Copy thumbnail`,
    `サムネイルをコピー`,
    `썸네일 복사`,
    `Копировать миниатюру`,
  ],
  _复制文本: [
    `复制文本`,
    `複製文字`,
    `Copy text`,
    `テキストをコピー`,
    `텍스트 복사`,
    `Копировать текст`,
  ],
  _对复制的内容的说明: [
    `你可以根据自己的需要选择复制的内容。
<br>
在作品页面里，以及预览作品时，你可以按快捷键 <span class="blue">Alt</span> + <span class="blue">C</span> 进行复制。
<br>
<br>
<strong>每种格式的说明：</strong>
<br>
- <span class="blue">image/png</span> 复制作品的图片。默认未选择，因为它在某些社交软件里的优先级太高，会导致 <span class="blue">text/html</span> 格式的内容被忽略。
<br>
你可以选择复制原图还是缩略图。注意：有些图片的原图可能很大（例如超过 30 MiB），在某些应用程序里可能无法粘贴。
<br>
- <span class="blue">text/plain</span> 复制作品的文字信息。几乎所有应用程序都支持粘贴纯文本内容。
<br>
- <span class="blue">text/html</span> 同时复制作品的图片和文字信息。这是富文本格式，同时包含了上面两种内容。
<br>
<br>
<strong>提示：</strong>
<br>
- 这个功能在设计时的重点是同时复制图片和文字内容（<span class="blue">text/html</span>），以便于分享或存档，但实际效果取决于目标应用。有些应用可能不支持此格式，或者无法正确显示图片。
<br>
- 你可以同时选择多种格式，也就是同时复制多种内容。但是当你在应用程序里粘贴时，应用程序只会使用其中<strong>一种</strong>内容，也就是优先级最高的格式。其他格式的内容会被忽略。
<br>
- 在不同的应用程序里，优先级可能会不同。这与下载器无关。
<br>
- 例如：如果你同时复制了 <span class="blue">image/png</span> 和 <span class="blue">text/html</span> 内容，某些应用程序会使用前者，但某些应用程序可能会使用后者。如果粘贴的内容不符合你的预期，你可以取消选择其中一种格式。
<br>
<br>
<strong>一些具体的例子：</strong>
<br>
<br>
浏览器：
<br>
网页上的输入区域默认只能粘贴纯文本内容，也就是 <span class="blue">text/plain</span>。
<br>
某些网页应用程序可能有针对性优化，例如在 Discord 里你可以粘贴图片 <span class="blue">image/png</span>；在 Gmail 里你可以同时粘贴图片和文字，也就是 <span class="blue">text/html</span>。
<br>
<br>
Microsoft Word：
<br>
它会优先采用 <span class="blue">text/html</span> 格式的内容，其次是 <span class="blue">image/png</span>，最后是 <span class="blue">text/plain</span>。
<br>
<br>
Telegram：
<br>
它不支持 <span class="blue">text/html</span> 格式，所以你无法在 Telegram 里同时粘贴图片和文字。
<br>
其他格式的优先级是：<span class="blue">image/png</span>、<span class="blue">text/plain</span>。
<br>
如果你想在 Telegram 里粘贴图片，需要选择 <span class="blue">image/png</span> 格式。
<br>
<br>
QQ、微信：
<br>
它们的优先级是：<span class="blue">image/png</span>、<span class="blue">text/html</span>、<span class="blue">text/plain</span>。
<br>
如果你想在 QQ、微信里同时粘贴图片和文字，应该选择 <span class="blue">text/html</span>，并且取消勾选 <span class="blue">image/png</span>，否则它们只会粘贴图片。
<br>
<br>
Android 应用：
<br>
Android 上的某些应用虽然可以粘贴 <span class="blue">text/html</span> 内容，但图片可能无法显示。
<br>`,
    `你可以根據自己的需要選擇複製的內容。
<br>
在作品頁面裡，以及預覽作品時，你可以按快捷鍵 <span class="blue">Alt</span> + <span class="blue">C</span> 進行複製。
<br>
<br>
<strong>每種格式的說明：</strong>
<br>
- <span class="blue">image/png</span> 複製作品的圖片。預設未選擇，因為它在某些社交軟體裡的優先級太高，會導致 <span class="blue">text/html</span> 格式的內容被忽略。
<br>
你可以選擇複製原圖還是縮略圖。注意：有些圖片的原圖可能很大（例如超過 30 MiB），在某些應用程式裡可能無法貼上。
<br>
- <span class="blue">text/plain</span> 複製作品的文字資訊。幾乎所有應用程式都支援貼上純文字內容。
<br>
- <span class="blue">text/html</span> 同時複製作品的圖片和文字資訊。這是富文字格式，同時包含了上面兩種內容。
<br>
<br>
<strong>提示：</strong>
<br>
- 這個功能在設計時的重點是同時複製圖片和文字內容（<span class="blue">text/html</span>），以便於分享或存檔，但實際效果取決於目標應用。有些應用可能不支援此格式，或者無法正確顯示圖片。
<br>
- 你可以同時選擇多種格式，也就是同時複製多種內容。但是當你在應用程式裡貼上時，應用程式只會使用其中<strong>一種</strong>內容，也就是優先級最高的格式。其他格式的內容會被忽略。
<br>
- 在不同的應用程式裡，優先級可能會不同。這與下載器無關。
<br>
- 例如：如果你同時複製了 <span class="blue">image/png</span> 和 <span class="blue">text/html</span> 內容，某些應用程式會使用前者，但某些應用程式可能會使用後者。如果貼上的內容不符合你的預期，你可以取消選擇其中一種格式。
<br>
<br>
<strong>一些具體的例子：</strong>
<br>
<br>
瀏覽器：
<br>
網頁上的輸入區域預設只能貼上純文字內容，也就是 <span class="blue">text/plain</span>。
<br>
某些網頁應用程式可能有針對性優化，例如在 Discord 裡你可以貼上圖片 <span class="blue">image/png</span>；在 Gmail 裡你可以同時貼上圖片和文字，也就是 <span class="blue">text/html</span>。
<br>
<br>
Microsoft Word：
<br>
它會優先採用 <span class="blue">text/html</span> 格式的內容，其次是 <span class="blue">image/png</span>，最後是 <span class="blue">text/plain</span>。
<br>
<br>
Telegram：
<br>
它不支援 <span class="blue">text/html</span> 格式，所以你無法在 Telegram 裡同時貼上圖片和文字。
<br>
其他格式的優先級是：<span class="blue">image/png</span>、<span class="blue">text/plain</span>。
<br>
如果你想在 Telegram 裡貼上圖片，需要選擇 <span class="blue">image/png</span> 格式。
<br>
<br>
QQ、微信：
<br>
它們的優先級是：<span class="blue">image/png</span>、<span class="blue">text/html</span>、<span class="blue">text/plain</span>。
<br>
如果你想在 QQ、微信裡同時貼上圖片和文字，應該選擇 <span class="blue">text/html</span>，並且取消勾選 <span class="blue">image/png</span>，否則它們只會貼上圖片。
<br>
<br>
Android 應用：
<br>
Android 上的某些應用雖然可以貼上 <span class="blue">text/html</span> 內容，但圖片可能無法顯示。
<br>`,
    `You can select the content to copy according to your own needs.
<br>
On the work page, and when previewing a work, you can use the shortcut key <span class="blue">Alt</span> + <span class="blue">C</span> to copy.
<br>
<br>
<strong>Explanation of each format:</strong>
<br>
- <span class="blue">image/png</span> Copies the image of the work. Not selected by default, because it has too high priority in some social software, which can cause the <span class="blue">text/html</span> format content to be ignored.
<br>
You can choose to copy the original image or the thumbnail. Note: Some original images may be very large (e.g., over 30 MiB), and may not be pasteable in certain applications.
<br>
- <span class="blue">text/plain</span> Copies the text information of the work. Almost all applications support pasting plain text content.
<br>
- <span class="blue">text/html</span> Copies both the image and text information of the work. This is rich text format, which includes both of the above contents.
<br>
<br>
<strong>Tips:</strong>
<br>
- The focus of this feature in design is to copy both image and text content simultaneously (<span class="blue">text/html</span>), for easy sharing or archiving, but the actual effect depends on the target application. Some applications may not support this format, or may not display the image correctly.
<br>
- You can select multiple formats at the same time, which means copying multiple contents simultaneously. However, when you paste in the application, the application will only use <strong>one</strong> of them, which is the format with the highest priority. The content of other formats will be ignored.
<br>
- The priority may differ in different applications. This has nothing to do with the downloader.
<br>
- For example: If you copy both <span class="blue">image/png</span> and <span class="blue">text/html</span> content at the same time, some applications will use the former, but some applications may use the latter. If the pasted content does not meet your expectations, you can unselect one of the formats.
<br>
<br>
<strong>Some specific examples:</strong>
<br>
<br>
Browser:
<br>
The input area on the webpage can only paste plain text content by default, which is <span class="blue">text/plain</span>.
<br>
Some web applications may have targeted optimizations, for example, in Discord you can paste images <span class="blue">image/png</span>; in Gmail you can paste both images and text, which is <span class="blue">text/html</span>.
<br>
<br>
Microsoft Word:
<br>
It will prioritize the <span class="blue">text/html</span> format content, followed by <span class="blue">image/png</span>, and finally <span class="blue">text/plain</span>.
<br>
<br>
Telegram:
<br>
It does not support the <span class="blue">text/html</span> format, so you cannot paste both images and text in Telegram at the same time.
<br>
The priority of other formats is: <span class="blue">image/png</span>, <span class="blue">text/plain</span>.
<br>
If you want to paste images in Telegram, you need to select the <span class="blue">image/png</span> format.
<br>
<br>
QQ, WeChat:
<br>
Their priority is: <span class="blue">image/png</span>, <span class="blue">text/html</span>, <span class="blue">text/plain</span>.
<br>
If you want to paste both images and text in QQ or WeChat, you should select <span class="blue">text/html</span> and uncheck <span class="blue">image/png</span>, otherwise they will only paste the image.
<br>
<br>
Android apps:
<br>
Some apps on Android can paste <span class="blue">text/html</span> content, but the images may not display.
<br>`,
    `自分のニーズに応じてコピーする内容を選択できます。
<br>
作品ページ内、および作品をプレビューする際は、ショートカットキー <span class="blue">Alt</span> + <span class="blue">C</span> を押してコピーできます。
<br>
<br>
<strong>各フォーマットの説明：</strong>
<br>
- <span class="blue">image/png</span> 作品の画像をコピーします。デフォルトでは選択されていません。一部のソーシャルソフトウェアで優先度が高すぎるため、<span class="blue">text/html</span> 形式のコンテンツが無視される可能性があります。
<br>
原画像かサムネイルかを選択してコピーできます。注意：一部の画像の原画像は非常に大きい場合があります（例：30 MiBを超える）、一部のアプリケーションでは貼り付けられない可能性があります。
<br>
- <span class="blue">text/plain</span> 作品のテキスト情報をコピーします。ほぼすべてのアプリケーションがプレーンテキストコンテンツの貼り付けをサポートしています。
<br>
- <span class="blue">text/html</span> 作品の画像とテキスト情報を同時にコピーします。これはリッチテキスト形式で、上記の2つのコンテンツの両方を含みます。
<br>
<br>
<strong>ヒント：</strong>
<br>
- この機能の設計時の重点は、画像とテキストコンテンツを同時にコピーすること（<span class="blue">text/html</span>）で、共有やアーカイブを容易にしますが、実際の効果は対象アプリケーションに依存します。一部のアプリケーションはこの形式をサポートしないか、画像を正しく表示できない可能性があります。
<br>
- 複数のフォーマットを同時に選択できます。つまり、複数のコンテンツを同時にコピーします。ただし、アプリケーションに貼り付けると、アプリケーションはその中から<strong>1つ</strong>のみを使用します。つまり、優先度が最も高いフォーマットです。他のフォーマットのコンテンツは無視されます。
<br>
- 異なるアプリケーションでは優先度が異なる場合があります。これはダウンロードツールとは関係ありません。
<br>
- 例： <span class="blue">image/png</span> と <span class="blue">text/html</span> のコンテンツを同時にコピーした場合、一部のアプリケーションは前者を使用しますが、他のアプリケーションは後者を使用する可能性があります。貼り付けられたコンテンツが期待通りでない場合、そのフォーマットの選択を解除できます。
<br>
<br>
<strong>具体的な例：</strong>
<br>
<br>
ブラウザ：
<br>
ウェブページの入力領域は、デフォルトでプレーンテキストコンテンツ、つまり <span class="blue">text/plain</span> のみを貼り付けられます。
<br>
一部のウェブアプリケーションは対象を最適化しており、例えば Discord では画像 <span class="blue">image/png</span> を貼り付けられます。Gmail では画像とテキストを同時に貼り付けられます。つまり <span class="blue">text/html</span> です。
<br>
<br>
Microsoft Word：
<br>
<span class="blue">text/html</span> 形式のコンテンツを優先的に採用し、次に <span class="blue">image/png</span>、最後に <span class="blue">text/plain</span> です。
<br>
<br>
Telegram：
<br>
<span class="blue">text/html</span> 形式をサポートしていないため、Telegram で画像とテキストを同時に貼り付けられません。
<br>
他のフォーマットの優先度は：<span class="blue">image/png</span>、<span class="blue">text/plain</span>。
<br>
Telegram で画像を貼り付けたい場合は、<span class="blue">image/png</span> 形式を選択する必要があります。
<br>
<br>
QQ、微信：
<br>
優先度は：<span class="blue">image/png</span>、<span class="blue">text/html</span>、<span class="blue">text/plain</span>。
<br>
QQ や微信で画像とテキストを同時に貼り付けたい場合は、<span class="blue">text/html</span> を選択し、<span class="blue">image/png</span> のチェックを外してください。さもないと画像のみが貼り付けられます。
<br>
<br>
Android アプリ：
<br>
Android の一部のアプリは <span class="blue">text/html</span> コンテンツを貼り付けられますが、画像が表示されない場合があります。
<br>`,
    `자신의 필요에 따라 복사할 내용을 선택할 수 있습니다.
<br>
작품 페이지에서, 그리고 작품을 미리보기할 때, 단축키 <span class="blue">Alt</span> + <span class="blue">C</span>를 눌러 복사할 수 있습니다.
<br>
<br>
<strong>각 형식의 설명:</strong>
<br>
- <span class="blue">image/png</span> 작품의 이미지를 복사합니다. 기본적으로 선택되지 않음. 일부 소셜 소프트웨어에서 우선순위가 너무 높아 <span class="blue">text/html</span> 형식의 콘텐츠가 무시될 수 있기 때문입니다.
<br>
원본 이미지나 썸네일을 복사할 수 있습니다. 주의: 일부 이미지의 원본 이미지는 매우 클 수 있습니다(예: 30 MiB 초과), 일부 애플리케이션에서는 붙여넣기가 불가능할 수 있습니다.
<br>
- <span class="blue">text/plain</span> 작품의 텍스트 정보를 복사합니다. 거의 모든 애플리케이션이 플레인 텍스트 콘텐츠의 붙여넣기를 지원합니다.
<br>
- <span class="blue">text/html</span> 작품의 이미지와 텍스트 정보를 동시에 복사합니다. 이는 리치 텍스트 형식으로, 위의 두 가지 콘텐츠를 모두 포함합니다.
<br>
<br>
<strong>팁:</strong>
<br>
- 이 기능의 설계 시 초점은 이미지와 텍스트 콘텐츠를 동시에 복사하는 것(<span class="blue">text/html</span>)으로, 공유나 아카이빙을 쉽게 하기 위한 것입니다. 하지만 실제 효과는 대상 애플리케이션에 따라 다릅니다. 일부 애플리케이션은 이 형식을 지원하지 않거나 이미지를 올바르게 표시하지 못할 수 있습니다.
<br>
- 여러 형식을 동시에 선택할 수 있습니다. 즉, 여러 콘텐츠를 동시에 복사합니다. 그러나 애플리케이션에 붙여넣을 때, 애플리케이션은 그 중 <strong>하나</strong>만 사용합니다. 즉, 우선순위가 가장 높은 형식입니다. 다른 형식의 콘텐츠는 무시됩니다.
<br>
- 다른 애플리케이션에서는 우선순위가 다를 수 있습니다. 이는 다운로더와 무관합니다.
<br>
- 예: <span class="blue">image/png</span>과 <span class="blue">text/html</span> 콘텐츠를 동시에 복사한 경우, 일부 애플리케이션은 전자를 사용하지만, 일부는 후자를 사용할 수 있습니다. 붙여넣은 콘텐츠가 예상과 다르면 해당 형식 중 하나를 선택 해제할 수 있습니다.
<br>
<br>
<strong>구체적인 예시:</strong>
<br>
<br>
브라우저:
<br>
웹페이지의 입력 영역은 기본적으로 플레인 텍스트 콘텐츠, 즉 <span class="blue">text/plain</span>만 붙여넣을 수 있습니다.
<br>
일부 웹 애플리케이션은 대상에 최적화되어 있으며, 예를 들어 Discord에서는 이미지 <span class="blue">image/png</span>을 붙여넣을 수 있습니다. Gmail에서는 이미지와 텍스트를 동시에 붙여넣을 수 있습니다. 즉 <span class="blue">text/html</span>입니다.
<br>
<br>
Microsoft Word:
<br>
<span class="blue">text/html</span> 형식의 콘텐츠를 우선적으로 채택하며, 그 다음은 <span class="blue">image/png</span>, 마지막은 <span class="blue">text/plain</span>입니다.
<br>
<br>
Telegram:
<br>
<span class="blue">text/html</span> 형식을 지원하지 않으므로, Telegram에서 이미지와 텍스트를 동시에 붙여넣을 수 없습니다.
<br>
다른 형식의 우선순위는: <span class="blue">image/png</span>, <span class="blue">text/plain</span>.
<br>
Telegram에서 이미지를 붙여넣고 싶다면 <span class="blue">image/png</span> 형식을 선택해야 합니다.
<br>
<br>
QQ, 위챗:
<br>
우선순위는: <span class="blue">image/png</span>, <span class="blue">text/html</span>, <span class="blue">text/plain</span>.
<br>
QQ나 위챗에서 이미지와 텍스트를 동시에 붙여넣고 싶다면 <span class="blue">text/html</span>을 선택하고 <span class="blue">image/png</span>의 체크를 해제하세요. 그렇지 않으면 이미지만 붙여넣어집니다.
<br>
<br>
Android 앱:
<br>
Android의 일부 앱은 <span class="blue">text/html</span> 콘텐츠를 붙여넣을 수 있지만, 이미지가 표시되지 않을 수 있습니다.
<br>`,
    `Вы можете выбрать содержимое для копирования в соответствии со своими потребностями.
<br>
На странице работы, а также при предпросмотре работы, вы можете использовать комбинацию клавиш <span class="blue">Alt</span> + <span class="blue">C</span> для копирования.
<br>
<br>
<strong>Объяснение каждого формата:</strong>
<br>
- <span class="blue">image/png</span> Копирует изображение работы. По умолчанию не выбрано, поскольку в некоторых социальных программах его приоритет слишком высок, что может привести к игнорированию содержимого в формате <span class="blue">text/html</span>.
<br>
Вы можете выбрать копирование оригинального изображения или миниатюры. Примечание: Некоторые оригинальные изображения могут быть очень большими (например, более 30 MiB), и в некоторых приложениях их может быть невозможно вставить.
<br>
- <span class="blue">text/plain</span> Копирует текстовую информацию работы. Почти все приложения поддерживают вставку содержимого в формате обычного текста.
<br>
- <span class="blue">text/html</span> Копирует как изображение, так и текстовую информацию работы. Это формат расширенного текста, который включает оба вышеуказанных содержимых.
<br>
<br>
<strong>Советы:</strong>
<br>
- Основной акцент в дизайне этой функции — одновременное копирование изображения и текстового содержимого (<span class="blue">text/html</span>) для удобного обмена или архивирования, но фактический эффект зависит от целевого приложения. Некоторые приложения могут не поддерживать этот формат или не отображать изображение корректно.
<br>
- Вы можете выбрать несколько форматов одновременно, что означает одновременное копирование нескольких содержимых. Однако при вставке в приложение приложение использует только <strong>одно</strong> из них — то, у которого наивысший приоритет. Содержимое других форматов будет игнорироваться.
<br>
- Приоритет может различаться в разных приложениях. Это не связано с загрузчиком.
<br>
- Например: если вы одновременно скопируете содержимое <span class="blue">image/png</span> и <span class="blue">text/html</span>, некоторые приложения будут использовать первое, а другие — второе. Если вставленное содержимое не соответствует вашим ожиданиям, вы можете отменить выбор одного из форматов.
<br>
<br>
<strong>Некоторые конкретные примеры:</strong>
<br>
<br>
Браузер:
<br>
Область ввода на веб-странице по умолчанию может вставлять только содержимое в формате обычного текста, то есть <span class="blue">text/plain</span>.
<br>
Некоторые веб-приложения могут иметь целевую оптимизацию, например, в Discord вы можете вставлять изображения <span class="blue">image/png</span>; в Gmail вы можете вставлять как изображения, так и текст, то есть <span class="blue">text/html</span>.
<br>
<br>
Microsoft Word:
<br>
Он будет отдавать предпочтение содержимому в формате <span class="blue">text/html</span>, затем <span class="blue">image/png</span>, и наконец <span class="blue">text/plain</span>.
<br>
<br>
Telegram:
<br>
Он не поддерживает формат <span class="blue">text/html</span>, поэтому вы не можете вставлять в Telegram одновременно изображение и текст.
<br>
Приоритет других форматов: <span class="blue">image/png</span>, <span class="blue">text/plain</span>.
<br>
Если вы хотите вставлять изображения в Telegram, нужно выбрать формат <span class="blue">image/png</span>.
<br>
<br>
QQ, WeChat:
<br>
Их приоритет: <span class="blue">image/png</span>, <span class="blue">text/html</span>, <span class="blue">text/plain</span>.
<br>
Если вы хотите вставлять в QQ или WeChat одновременно изображение и текст, выберите <span class="blue">text/html</span> и снимите галочку с <span class="blue">image/png</span>, иначе они вставят только изображение.
<br>
<br>
Приложения для Android:
<br>
Некоторые приложения на Android могут вставлять содержимое <span class="blue">text/html</span>, но изображения могут не отображаться.
<br>`,
  ],
  _文本格式: [
    `文本格式`,
    `文字格式`,
    `Text format`,
    `テキスト形式`,
    `텍스트 형식`,
    `Текстовый формат`,
  ],
  _正在加载缩略图: [
    `正在加载缩略图`,
    `正在載入縮略圖`,
    `Loading thumbnail`,
    `サムネイルを読み込み中`,
    `썸네일 로딩 중`,
    `Загрузка миниатюры`,
  ],
  _正在加载图片: [
    `正在加载图片`,
    `正在載入圖片`,
    `Loading image`,
    `画像を読み込んでいます`,
    `이미지 로딩 중`,
    `Загружается изображение`,
  ],
  _说明: [`说明`, `說明`, `Explanation`, `説明`, `설명`, `Описание`],
  _帮助: [`帮助`, `幫助`, `Help`, `ヘルプ`, `도움말`, `Справка`],
  _至少需要选择一种复制格式: [
    `至少需要选择一种复制格式`,
    `至少需要選擇一種複製格式`,
    `At least one copy format must be selected`,
    `少なくとも1つのコピー形式を選択する必要があります`,
    `최소 한 가지 복사 형식을 선택해야 합니다`,
    `Необходимо выбрать хотя бы один формат копирования`,
  ],
  _过去: [`过去`, `過去`, `Past`, `過去`, `과거`, `Прошлое`],
  _现在: [`现在`, `現在`, `Now`, `今`, `지금`, `Сейчас`],
  _未来: [`未来`, `未來`, `Future`, `未来`, `미래`, `Будущее`],
  _下载这个作品: [
    `下载这个作品`,
    `下載這個作品`,
    `Download this work`,
    `この作品をダウンロード`,
    `이 작품 다운로드`,
    `Скачать эту работу`,
  ],
  _下载这张图片: [
    `下载这张图片`,
    `下載這張圖片`,
    `Download this image`,
    `この画像をダウンロード`,
    `이 이미지 다운로드`,
    `Скачать это изображение`,
  ],
  _复制图片和摘要: [
    `复制图片和摘要`,
    `複製圖片和摘要`,
    `Copy image and description`,
    `画像と説明をコピー`,
    `이미지와 설명 복사`,
    `Копировать изображение и описание`,
  ],
  _修复了显示更大的缩略图的功能异常的问题: [
    `最近 Pixiv 的网页代码发生了变化，导致“显示更大的缩略图”功能的显示效果异常。现已修复。`,
    `最近 Pixiv 的網頁代碼發生了變化，導致「顯示更大的縮略圖」功能的顯示效果異常。現已修復。`,
    `Recently, changes in Pixiv's webpage code caused abnormal display effects for the "Show Larger Thumbnails" feature. It has now been fixed.`,
    `最近、Pixivのウェブページコードに変更があり、「より大きなサムネイルを表示」機能の表示効果に異常が発生しました。現在は修正済みです。`,
    `최근 Pixiv의 웹페이지 코드가 변경되어 "더 큰 썸네일 표시" 기능의 표시 효과에 이상이 발생했습니다. 이제 수정되었습니다.`,
    `Недавно в коде веб-страницы Pixiv произошли изменения, что привело к аномальному отображению функции «Показать большие миниатюры». Теперь это исправлено.`,
  ],
  _抓取每个用户最新的几个作品: [
    `抓取每个用户<span class="key">最新</span>的几个作品`,
    `抓取每個用戶<span class="key">最新</span>的幾個作品`,
    `Crawl the <span class="key">latest</span> few works of each user`,
    `各ユーザーの<span class="key">最新</span>の数作品をクロール`,
    `각 사용자별 <span class="key">최신</span> 몇 작품 크롤링`,
    `Собрать последние несколько работ каждого пользователя`,
  ],
  _把文件保存到用户上次选择的位置: [
    `把文件保存到用户上次<span class="key">选择</span>的位置`,
    `把檔案保存到用戶上次<span class="key">選擇</span>的位置`,
    `Save file to the user's last <span class="key">selected</span> location`,
    `ファイルをユーザーが最後に<span class="key">選択</span>した場所に保存`,
    `파일을 사용자가 마지막으로 <span class="key">선택</span>한 위치에 저장`,
    `Сохранить файл в последнем <span class="key">выбранном</span> пользователем месте`,
  ],
  _使用前请先查看提示: [
    `使用前请先查看提示`,
    `使用前請先查看提示`,
    `View the tip before use`,
    `使用前にヒントを確認してください`,
    `사용 전에 힌트 확인하세요`,
    `Просмотрите подсказку перед использованием`,
  ],
  _把文件保存到用户上次选择的位置的说明: [
    `我不推荐启用这个设置，除非你已经阅读了下面的说明。
<br>
<br>
这个设置是为喜欢<strong>手动保存文件</strong>的用户设计的，他们喜欢使用“另存为”对话框来保存文件，并希望下载器能记住上次保存的位置。
<br>
<br>
如果你想使用这个功能，需要注意：
<br>
- 要让这个设置正确工作，必须在浏览器的下载设置里启用“每次下载文件时都询问保存位置”，否则浏览器不会显示另存为对话框，并且文件会保存到浏览器设置里的保存位置（而非上次选择的位置）。
<br>
- 如果你关闭了浏览器的“每次下载文件时都询问保存位置”设置，那么也应该关闭这个设置。
<br>
- 如果你启用了这个设置，下载器<strong>不会创建文件夹</strong>，只会设置文件名。这是因为实现“记住上次保存位置”的效果需要使用 a 标签的 download 属性来下载文件，此时不能创建文件夹。
<br>
- 如果你启用了这个设置，下载器总是默认这个文件下载成功（即使你取消保存这个文件也是如此）。这是为了简化处理。
<br>`,
    `我不推薦啟用這個設置，除非你已經閱讀了下面的說明。
<br>
<br>
這個設置是為喜歡<strong>手動保存文件</strong>的用戶設計的，他們喜歡使用「另存為」對話框來保存文件，並希望下載器能記住上次保存的位置。
<br>
<br>
如果你想使用這個功能，需要注意：
<br>
- 要讓這個設置正確工作，必須在瀏覽器的下載設置裡啟用「每次下載文件時都詢問保存位置」，否則瀏覽器不會顯示另存為對話框，並且文件會保存到瀏覽器設置裡的保存位置（而非上次選擇的位置）。
<br>
- 如果你關閉了瀏覽器的「每次下載文件時都詢問保存位置」設置，那麼也應該關閉這個設置。
<br>
- 如果你啟用了這個設置，下載器<strong>不會創建文件夾</strong>，只會設置文件名。這是因為實現「記住上次保存位置」的效果需要使用 a 標籤的 download 屬性來下載文件，此時不能創建文件夾。
<br>
- 如果你啟用了這個設置，下載器總是默認這個文件下載成功（即使你取消保存這個文件也是如此）。這是為了簡化處理。
<br>`,
    `I do not recommend enabling this setting unless you have read the following instructions.
<br>
<br>
This setting is designed for users who prefer <strong>manually saving files</strong>. They like to use the "Save As" dialog to save files and hope the downloader can remember the last save location.
<br>
<br>
If you want to use this feature, please note:
<br>
- To make this setting work correctly, you must enable "Ask where to save each file before downloading" in your browser's download settings. Otherwise, the browser will not display the Save As dialog, and the file will be saved to the browser's default save location (not the last selected location).
<br>
- If you disable "Ask where to save each file before downloading" in the browser, you should also disable this setting.
<br>
- If you enable this setting, the downloader <strong>will not create folders</strong> and will only set the filename. This is because implementing the "remember last save location" effect requires using the download attribute of the a tag to download the file, at which point folders cannot be created.
<br>
- If you enable this setting, the downloader always assumes the file download is successful (even if you cancel saving the file). This is to simplify the handling.
<br>`,
    `この設定を有効にすることを推奨しません。以下の説明を読み終えるまでは有効にしないでください。
<br>
<br>
この設定は、<strong>ファイルを手動で保存</strong>することを好むユーザーのために設計されています。彼らは「名前を付けて保存」ダイアログを使用してファイルを保存し、ダウンロードツールが前回の保存場所を記憶することを望んでいます。
<br>
<br>
この機能を使用したい場合、以下の点に注意してください：
<br>
- この設定を正しく動作させるには、ブラウザのダウンロード設定で「ファイルをダウンロードする前に保存場所を毎回尋ねる」を有効にする必要があります。そうしないと、ブラウザは「名前を付けて保存」ダイアログを表示せず、ファイルはブラウザ設定の保存場所（前回選択した場所ではなく）に保存されます。
<br>
- ブラウザの「ファイルをダウンロードする前に保存場所を毎回尋ねる」設定を無効にした場合、この設定も無効にしてください。
<br>
- この設定を有効にすると、ダウンロードツールは<strong>フォルダを作成しません</strong>。ファイル名のみを設定します。これは、「前回の保存場所を記憶」する効果を実現するために、a タグの download 属性を使用してファイルをダウンロードする必要があるためで、その時点ではフォルダを作成できません。
<br>
- この設定を有効にすると、ダウンロードツールは常にこのファイルのダウンロードが成功したものとみなします（ファイルを保存せずにキャンセルした場合でも同様です）。これは処理を簡素化するためです。
<br>`,
    `이 설정을 활성화하는 것을 권장하지 않습니다. 아래 설명을 읽을 때까지 활성화하지 마세요.
<br>
<br>
이 설정은 <strong>파일을 수동으로 저장</strong>하는 것을 선호하는 사용자들을 위해 설계되었습니다. 그들은 "다른 이름으로 저장" 대화 상자를 사용하여 파일을 저장하고, 다운로더가 마지막 저장 위치를 기억하기를 원합니다.
<br>
<br>
이 기능을 사용하려면 다음 사항에 주의하세요:
<br>
- 이 설정이 제대로 작동하려면 브라우저의 다운로드 설정에서 "각 파일 다운로드 전에 저장 위치를 묻기"를 활성화해야 합니다. 그렇지 않으면 브라우저가 "다른 이름으로 저장" 대화 상자를 표시하지 않고, 파일은 브라우저 설정의 기본 저장 위치(마지막 선택한 위치가 아님)에 저장됩니다.
<br>
- 브라우저의 "각 파일 다운로드 전에 저장 위치를 묻기" 설정을 비활성화한 경우, 이 설정도 비활성화하세요.
<br>
- 이 설정을 활성화하면 다운로더는 <strong>폴더를 생성하지 않습니다</strong>. 파일 이름만 설정합니다. 이는 "마지막 저장 위치 기억" 효과를 구현하기 위해 a 태그의 download 속성을 사용하여 파일을 다운로드해야 하기 때문으로, 그 시점에서 폴더를 생성할 수 없습니다.
<br>
- 이 설정을 활성화하면 다운로더는 항상 이 파일의 다운로드가 성공했다고 가정합니다(파일 저장을 취소한 경우에도 마찬가지입니다). 이는 처리를 단순화하기 위함입니다.
<br>`,
    `Я не рекомендую включать эту настройку, если вы не прочитали следующие инструкции.
<br>
<br>
Эта настройка предназначена для пользователей, которые предпочитают <strong>вручную сохранять файлы</strong>. Они любят использовать диалог «Сохранить как» для сохранения файлов и надеются, что загрузчик запомнит последнее место сохранения.
<br>
<br>
Если вы хотите использовать эту функцию, обратите внимание на следующее:
<br>
- Чтобы эта настройка работала правильно, в настройках загрузок браузера необходимо включить опцию «Спрашивать, куда сохранять каждый файл перед загрузкой». В противном случае браузер не покажет диалог «Сохранить как», и файл будет сохранен в место по умолчанию в настройках браузера (а не в последнее выбранное место).
<br>
- Если вы отключили опцию «Спрашивать, куда сохранять каждый файл перед загрузкой» в браузере, то эту настройку тоже следует отключить.
<br>
- Если вы включили эту настройку, загрузчик <strong>не будет создавать папки</strong> и будет устанавливать только имя файла. Это потому, что для реализации эффекта «запомнить последнее место сохранения» требуется использовать атрибут download тега a для загрузки файла, и в этот момент папки создать нельзя.
<br>
- Если вы включили эту настройку, загрузчик всегда считает, что загрузка файла прошла успешно (даже если вы отменили сохранение файла). Это сделано для упрощения обработки.
<br>`,
  ],
  _下载器排除了一些作品原因: [
    `🚫下载器排除了一些作品，原因: `,
    `🚫下載器排除了一些作品，原因: `,
    `🚫The downloader excluded some works, reason: `,
    `🚫ダウンロードツールがいくつかの作品を除外しました、理由: `,
    `🚫다운로더가 일부 작품을 제외했습니다, 이유: `,
    `🚫Загрузчик исключил некоторые работы, причина: `,
  ],
  _下载器排除了多图作品里的部分图片原因: [
    `🚫下载器排除了多图作品里的部分图片，原因: `,
    `🚫下載器排除了多圖作品裡的部分圖片，原因: `,
    `🚫 The downloader excluded some images from the multi-image work. Reason: `,
    `🚫ダウンローダーは複数画像作品内のいくつかの画像を除外しました。理由：`,
    `🚫 다운로더가 다중 이미지 작품의 일부 이미지를 제외했습니다. 이유: `,
    `🚫 Загрузчик исключил некоторые изображения из многоизображной работы. Причина: `,
  ],
  _作品的语言不符合你选择的语言: [
    `作品的语言不符合你选择的语言 {}`,
    `作品的語言不符合你選擇的語言 {}`,
    `The language of the work does not match the selected language {}`,
    `作品の言語が選択した言語 {} に一致しません`,
    `작품의 언어가 선택한 언어 {}와 일치하지 않습니다`,
    `Язык работы не соответствует выбранному языку {}`,
  ],
  _你屏蔽了这个用户: [
    `你屏蔽了这个用户`,
    `你靜音了這個用戶`,
    `You muted this user`,
    `このユーザーをミュートしました`,
    `이 사용자를 음소거했습니다`,
    `Вы заглушили этого пользователя`,
  ],
  _你屏蔽了它的标签: [
    `你屏蔽了它的标签`,
    `你靜音了它的標籤`,
    `You muted its tags`,
    `この作品のタグをミュートしました`,
    `이 작품의 태그를 음소거했습니다`,
    `Вы заглушили его теги`,
  ],
  _它不是首次登场的作品: [
    `它不是首次登场的作品`,
    `它不是首次登場的作品`,
    `It is not a debut work`,
    `これはデビュー作品ではありません`,
    `이것은 데뷔 작품이 아닙니다`,
    `Это не дебютная работа`,
  ],
  _有同类任务正在执行请等待之前的任务完成: [
    `有同类任务正在执行，请等待之前的任务完成。`,
    `有同類任務正在執行，請等待之前的任務完成。`,
    `A similar task is currently running. Please wait for the previous task to complete.`,
    `同種のタスクが実行中です。前のタスクが完了するまでお待ちください。`,
    `유사한 작업이 실행 중입니다. 이전 작업이 완료될 때까지 기다려 주세요.`,
    `Аналогичная задача выполняется. Пожалуйста, подождите завершения предыдущей задачи.`,
  ],
  _注意这个任务遵从抓取多少页面的设置: [
    `注意：这个任务遵从“抓取多少页面”的设置，并且是从当前页面（可能不是第 1 页）开始抓取的。`,
    `注意：這個任務遵從「抓取多少頁面」的設置，並且是從當前頁面（可能不是第 1 頁）開始抓取的。`,
    `Note: This task follows the "Number of pages to crawl" setting and starts crawling from the current page (which may not be page 1).`,
    `注意：このタスクは「クロールするページ数」の設定に従い、現在のページ（1ページ目ではない可能性があります）からクロールを開始します。`,
    `주의: 이 작업은 "크롤링할 페이지 수" 설정을 따르며, 현재 페이지(1페이지가 아닐 수 있음)부터 크롤링을 시작합니다.`,
    `Примечание: Эта задача следует настройке «Количество страниц для краулинга» и начинается с текущей страницы (которая может не быть первой).`,
  ],
  _添加为公开关注的提示: [
    `由于当前页面显示的是公开关注，所以下载器也会把用户添加为公开关注。`,
    `由於當前頁面顯示的是公開關注，所以下載器也會把用戶添加為公開關注。`,
    `Since the current page displays public follows, the downloader will also add users as public follows.`,
    `現在のページが公開フォロー表示のため、ダウンロードツールもユーザーを公開フォローとして追加します。`,
    `현재 페이지가 공개 팔로우를 표시하므로, 다운로더도 사용자를 공개 팔로우로 추가합니다.`,
    `Поскольку текущая страница отображает публичные подписки, загрузчик также добавит пользователей как публичные подписки。`,
  ],
  _添加为非公开关注的提示: [
    `由于当前页面显示的是非公开关注，所以下载器也会把用户添加为非公开关注。`,
    `由於當前頁面顯示的是非公開關注，所以下載器也會把用戶添加為非公開關注。`,
    `Since the current page displays private follows, the downloader will also add users as private follows.`,
    `現在のページが非公開フォロー表示のため、ダウンロードツールもユーザーを非公開フォローとして追加します。`,
    `현재 페이지가 비공개 팔로우를 표시하므로, 다운로더도 사용자를 비공개 팔로우로 추가합니다.`,
    `Поскольку текущая страница отображает приватные подписки, загрузчик также добавит пользователей как приватные подписки。`,
  ],
  _筛选不活跃的用户: [
    `筛选不活跃的用户`,
    `篩選不活躍的用戶`,
    `Filter inactive users`,
    `非アクティブなユーザーをフィルタリング`,
    `비활성 사용자 필터링`,
    `Фильтрация неактивных пользователей`,
  ],
  _筛选不活跃的用户的输入提示: [
    `请输入一个表示时间的数字（单位是月，每月按 30 天计算），下载器会对每个用户进行筛选，并列出符合条件的用户：
<br>
- 没有任何作品的用户
<br>
- 在指定时间内没有发表过新作品的用户（即不活跃的用户）。附加说明：如果一个用户既有插画作品也有小说作品，那么需要他在这段时间内未发表任何作品才会列出他。`,
    `請輸入一個表示時間的數字（單位是月，每月按 30 天計算），下載器會對每個用戶進行篩選，並列出符合條件的用戶：
<br>
- 沒有任何作品的用戶
<br>
- 在指定時間內沒有發表過新作品的用戶（即不活躍的用戶）。附加說明：如果一個用戶既有插畫作品也有小說作品，那麼需要他在這段時間內未發表任何作品才會列出他。`,
    `Please enter a number representing time (in months, each month calculated as 30 days). The downloader will filter each user and list those who meet the conditions:
<br>
- Users with no works
<br>
- Users who have not posted any new works within the specified time (i.e., inactive users). Additional note: If a user has both illustration works and novel works, they need to have not posted any works during this period to be listed.`,
    `時間を表す数字（単位：月、1ヶ月あたり30日として計算）を入力してください。ダウンロードツールは各ユーザーをフィルタリングし、条件を満たすユーザーをリストアップします：
<br>
- 作品が全くないユーザー
<br>
- 指定期間内に新しい作品を投稿していないユーザー（つまり非アクティブユーザー）。追加説明：ユーザーがイラスト作品と小説作品の両方を持っている場合、この期間内にどの作品も投稿していない場合にのみリストアップされます。`,
    `시간을 나타내는 숫자(단위: 개월, 매월 30일로 계산)를 입력하세요. 다운로더는 각 사용자를 필터링하고 조건에 맞는 사용자를 나열합니다:
<br>
- 작품이 없는 사용자
<br>
- 지정 시간 내에 새로운 작품을 게시하지 않은 사용자(즉, 비활성 사용자). 추가 설명: 사용자가 일러스트 작품과 소설 작품을 모두 가지고 있는 경우, 이 기간 동안 어떤 작품도 게시하지 않아야 나열됩니다.`,
    `Введите число, обозначающее время (в месяцах, каждый месяц рассчитывается как 30 дней). Загрузчик отфильтрует каждого пользователя и выведет список тех, кто соответствует условиям:
<br>
- Пользователи без каких-либо работ
<br>
- Пользователи, которые не публиковали новые работы в указанный период (т.е. неактивные пользователи). Дополнительное замечание: Если пользователь имеет как иллюстрации, так и романы, то он будет включен в список только если не публиковал никаких работ в этот период.`,
  ],
  _没有作品的用户: [
    `没有作品的用户`,
    `沒有作品的用戶`,
    `Users with no works`,
    `作品がないユーザー`,
    `작품이 없는 사용자`,
    `Пользователи без работ`,
  ],
  _最近不活跃的用户: [
    `最近不活跃的用户`,
    `最近不活躍的用戶`,
    `Recently inactive users`,
    `最近非アクティブなユーザー`,
    `최근 비활성 사용자`,
    `Недавно неактивные пользователи`,
  ],
  _自动合并系列小说: [
    `自动<span class="key">合并</span>系列小说`,
    `自動<span class="key">合併</span>系列小說`,
    `Automatically <span class="key">merge</span> novel series`,
    `自動<span class="key">マージ</span>シリーズ小説`,
    `자동 <span class="key">병합</span> 시리즈 소설`,
    `Автоматически <span class="key">объединять</span> серии романов`,
  ],
  _自动合并系列小说的说明: [
    `抓取作品时，如果一个小说属于某个系列，就自动抓取这个系列里的所有小说并且合并。`,
    `抓取作品時，如果一個小說屬於某個系列，就自動抓取這個系列裡的所有小說並且合併。`,
    `When crawling works, if a novel belongs to a series, automatically crawl all novels in that series and merge them.`,
    `作品をクロールする際、小説がシリーズに属する場合、そのシリーズ内のすべての小説を自動的にクロールしてマージします。`,
    `작품을 크롤링할 때, 소설이 특정 시리즈에 속하면 해당 시리즈의 모든 소설을 자동으로 크롤링하여 병합합니다.`,
    `При краулинге работ, если роман принадлежит серии, автоматически краулить все романы в этой серии и объединять их.`,
  ],
  _不再单独下载系列里的小说: [
    `不再单独下载系列里的小说`,
    `不再單獨下載系列裡的小說`,
    `No longer download novels in the series individually`,
    `シリーズ内の小説を個別にダウンロードしない`,
    `시리즈 내 소설을 개별적으로 다운로드하지 않음`,
    `Больше не скачивать романы в серии по отдельности`,
  ],
  _不再单独下载系列里的小说的说明: [
    `当你启用了“自动合并系列小说”时，通常没有必要单独下载系列里的小说，因为它们已经包含在合并后的小说文件里了。<br>如果你仍然想下载它们，可以取消选择这个子设置项。`,
    `當你啟用了「自動合併系列小說」時，通常沒有必要單獨下載系列裡的小說，因為它們已經包含在合併後的小說檔案裡了。<br>如果你仍然想下載它們，可以取消選擇這個子設置項。`,
    `When you enable "Automatically merge series novels", there is usually no need to download novels in the series individually, as they are already included in the merged novel file.<br>If you still want to download them, you can uncheck this sub-setting.`,
    `「自動的にシリーズ小説をマージ」を有効にすると、通常、シリーズ内の小説を個別にダウンロードする必要はありません。それらはすでにマージされた小説ファイルに含まれています。<br>それでもダウンロードしたい場合は、このサブ設定をオフにできます。`,
    `"시리즈 소설 자동 병합"을 활성화하면, 시리즈 내 소설을 개별적으로 다운로드할 필요가 거의 없습니다. 왜냐하면 그것들이 이미 병합된 소설 파일에 포함되어 있기 때문입니다.<br>그래도 다운로드하고 싶다면 이 하위 설정을 해제할 수 있습니다.`,
    `При включении «Автоматическое объединение серий романов» обычно нет необходимости скачивать романы в серии по отдельности, поскольку они уже включены в объединенный файл романа.<br>Если вы все же хотите скачать их, вы можете отменить выбор этого поднастройки.`,
  ],
  _自动合并系列小说时提示会添加间隔时间: [
    `开始自动合并系列小说<br>由于每个系列里都可能含有多个小说和图片，所以下载器可能会发送很多请求。为了避免触发 Pixiv 的警告，下载器在合并时总是会添加间隔时间，以降低发送请求的频率`,
    `開始自動合併系列小說<br>由於每個系列裡都可能含有複數小說和圖片，所以下載器可能會發送很多請求。為了避免觸發 Pixiv 的警告，下載器在合併時總是會添加間隔時間，以降低發送請求的頻率`,
    `Starting to automatically merge series novels<br>Since each series may contain multiple novels and images, the downloader may send many requests. To avoid triggering Pixiv's warnings, the downloader always adds interval time during merging to reduce the frequency of sending requests`,
    `シリーズ小説の自動マージを開始します<br>各シリーズには複数の小説と画像が含まれる可能性があるため、ダウンロードツールは多くのリクエストを送信する可能性があります。Pixiv の警告を回避するために、マージ中に常に間隔時間を追加して、リクエスト送信の頻度を下げます`,
    `시리즈 소설 자동 병합 시작<br>각 시리즈에 여러 소설과 이미지가 포함될 수 있으므로, 다운로더가 많은 요청을 보낼 수 있습니다. Pixiv의 경고를 피하기 위해, 병합 시 항상 간격 시간을 추가하여 요청 전송 빈도를 낮춥니다`,
    `Начинается автоматическое объединение серий романов<br>Поскольку каждая серия может содержать несколько романов и изображений, загрузчик может отправить много запросов. Чтобы избежать срабатывания предупреждений Pixiv, загрузчик всегда добавляет интервалы времени во время объединения, чтобы снизить частоту отправки запросов`,
  ],
  _合并小说时提示用户使用EPUB格式: [
    `💡你当前选择的保存格式是 TXT，但是一些阅读器可能无法识别 TXT 里的章节标记，所以我推荐你在合并小说时选择 EPUB 格式`,
    `💡你目前選擇的保存格式是 TXT，但是一些閱讀器可能無法識別 TXT 裡的章節標記，所以我推薦你在合併小說時選擇 EPUB 格式`,
    `💡Your current selected save format is TXT, but some readers may not recognize the chapter markers in TXT, so I recommend choosing EPUB format when merging novels`,
    `💡現在の保存形式は TXT ですが、一部のリーダーは TXT 内の章セクションマーカーを認識できない可能性があるため、小説をマージする際は EPUB 形式を選択することをおすすめします`,
    `💡현재 선택한 저장 형식은 TXT이지만, 일부 독자는 TXT의 장 마커를 인식하지 못할 수 있으므로 소설을 병합할 때 EPUB 형식을 선택하는 것을 추천합니다`,
    `💡Текущий выбранный формат сохранения — TXT, но некоторые читалки могут не распознавать маркеры глав в TXT, поэтому я рекомендую выбирать формат EPUB при объединении романов`,
  ],
  _本次抓取一共合并了x个系列小说: [
    `本次抓取一共合并了 {} 个系列小说`,
    `本次抓取一共合併了 {} 個系列小說`,
    `This crawling merged a total of {} series novels`,
    `今回のクロールで合計 {} 個のシリーズ小説がマージされました`,
    `이번 크롤링에서 총 {} 개의 시리즈 소설이 병합되었습니다`,
    `В этом краулинге было объединено всего {} серий романов`,
  ],
  _本次抓取一共合并了x个系列小说包含y篇小说: [
    `本次抓取一共合并了 {} 个系列小说，包含 {} 篇小说`,
    `本次抓取一共合併了 {} 個系列小說，包含 {} 篇小說`,
    `This crawl merged a total of {} novel series, containing {} novels`,
    `今回のクロールで合計 {} 個のシリーズ小説をマージしました。{} 件の小説を含みます`,
    `이번 크롤링에서 총 {}개의 시리즈 소설을 병합했습니다. {}편의 소설을 포함합니다`,
    `В этом крауле всего было объединено {} серий романов, содержащих {} романов`,
  ],
  _由于这个系列小说里的图片体积很大所以分割成了x个文件: [
    `由于这个系列小说里的图片体积很大，所以分割成了 {} 个文件`,
    `由於這個系列小說裡的圖片體積很大，所以分割成了 {} 個文件`,
    `Due to the large size of the images in this novel series, it has been split into {} files`,
    `このシリーズ小説内の画像のサイズが大きいため、{} 個のファイルに分割されました`,
    `이 시리즈 소설의 이미지 크기가 크기 때문에 {}개의 파일로 분할되었습니다`,
    `Из-за большого размера изображений в этой серии романов, она была разделена на {} файлов`,
  ],
  _提示有一个系列正在合并中: [
    `注意：有一个系列正在合并中，它会继续工作直到完成合并。如果你不需要它了，可以刷新这个页面`,
    `注意：有一個系列正在合併中，它會繼續工作直到完成合併。如果你不需要它了，可以刷新這個頁面`,
    `Note: There is a series currently being merged, and it will continue working until the merge is complete. If you no longer need it, you can refresh this page`,
    `注意：シリーズが1つマージ中です。マージが完了するまで作業を続けます。それが必要なくなったら、このページを更新できます`,
    `주의: 시리즈 하나가 병합 중입니다. 병합이 완료될 때까지 작업을 계속합니다. 더 이상 필요하지 않으면 이 페이지를 새로고침할 수 있습니다`,
    `Примечание: Одна серия в процессе объединения, она продолжит работу до завершения объединения. Если он вам больше не нужен, вы можете обновить эту страницу`,
  ],
  _合并系列小说时的命名规则: [
    `合并系列小说时的<span class="key">命名</span>规则`,
    `合併系列小說時的<span class="key">命名</span>規則`,
    `<span class="key">Naming</span> rule when merging novel series`,
    `シリーズ小説をマージする際の<span class="key">命名</span>ルール`,
    `시리즈 소설 병합 시 <span class="key">명명</span> 규칙`,
    `Правило <span class="key">наименования</span> при объединении серий романов`,
  ],
  _系列小说的命名标记提醒: [
    `这个命名规则用于设置合集文件的名字，而非单个小说的名字。<br>
可以使用<span class="key">/</span>建立文件夹。<br>
你可以使用多个标记，也可以添加自定义文字。例如：novel series/title {series_title} id {series_id}<br>
为了防止文件名重复，建议你始终添加 {series_id}。`,
    `這個命名規則用於設定合集檔案的名字，而非單個小說的名字。<br>
可以使用<span class="key">/</span>建立資料夾。<br>
你可以使用多個標記，也可以添加自訂文字。例如：novel series/title {series_title} id {series_id}<br>
為了防止檔案名重複，建議你始終添加 {series_id}。`,
    `This naming rule is used to set the name of the collection file, not the name of individual novels.<br>
You can use <span class="key">/</span> to create folders.<br>
You can use multiple tags and add custom text. For example: novel series/title {series_title} id {series_id}<br>
To prevent duplicate filenames, it is recommended to always add {series_id}.`,
    `この命名ルールは、単一の小説の名前ではなく、コレクションファイルの名前を設定するために使用されます。<br>
<span class="key">/</span>を使用してフォルダーを作成できます。<br>
複数のタグを使用したり、カスタムテキストを追加したりできます。例：novel series/title {series_title} id {series_id}<br>
ファイル名の重複を防ぐため、常に {series_id} を追加することをお勧めします。`,
    `이 명명 규칙은 개별 소설의 이름이 아닌 컬렉션 파일의 이름을 설정하는 데 사용됩니다.<br>
<span class="key">/</span>를 사용하여 폴더를 생성할 수 있습니다.<br>
여러 태그를 사용하거나 사용자 지정 텍스트를 추가할 수 있습니다. 예: novel series/title {series_title} id {series_id}<br>
파일 이름 중복을 방지하기 위해 항상 {series_id}를 추가하는 것을 권장합니다.`,
    `Это правило именования используется для установки имени файла коллекции, а не имени отдельных романов.<br>
Вы можете использовать <span class="key">/</span> для создания папок.<br>
Вы можете использовать несколько тегов и добавлять пользовательский текст. Например: novel series/title {series_title} id {series_id}<br>
Чтобы предотвратить дублирование имен файлов, рекомендуется всегда добавлять {series_id}.`,
  ],
  _系列小说的命名标记_series_title: [
    `系列标题`,
    `系列標題`,
    `Series title`,
    `シリーズタイトル`,
    `시리즈 제목`,
    `Название серии`,
  ],
  _系列小说的命名标记_series_id: [
    `系列 ID，是数字。`,
    `系列 ID，是數字。`,
    `Series ID, it is a number.`,
    `シリーズ ID、数値です。`,
    `시리즈 ID, 숫자입니다。`,
    `ID серии, это число。`,
  ],
  _系列小说的命名标记_user: [
    `用户名（作者的名字）`,
    `用戶名（作者的名字）`,
    `Username (author's name)`,
    `ユーザー名（作者の名前）`,
    `사용자 이름 (작가의 이름)`,
    `Имя пользователя (имя автора)`,
  ],
  _系列小说的命名标记_user_id: [
    `用户（作者）的 ID，是数字`,
    `用戶（作者）的 ID，是數字`,
    `User (Author) ID, Numeric`,
    `ユーザー（作者）の ID、数値`,
    `사용자 (작가) ID, 숫자`,
    `ID пользователя (автора), числовой`,
  ],
  _系列小说的命名标记_part: [
    `如果小说的体积比较大，下载器可能会把它分割成多个文件，此时 {part} 是这个文件的编号，如 <span class="blue">1</span>、<span class="blue">2</span>、<span class="blue">3</span>…… 如果这个小说没有被分割，{part} 会被忽略。`,
    `如果小說的體積比較大，下載器可能會把它分割成多個文件，此時 {part} 是這個文件的編號，如 <span class="blue">1</span>、<span class="blue">2</span>、<span class="blue">3</span>…… 如果這個小說沒有被分割，{part} 會被忽略。`,
    `If the novel's size is relatively large, the downloader may split it into multiple files. In this case, {part} is the number of this file, such as <span class="blue">1</span>, <span class="blue">2</span>, <span class="blue">3</span>... If this novel is not split, {part} will be ignored.`,
    `小説のサイズが比較的大きい場合、ダウンロードツールはそれを複数のファイルに分割する可能性があります。この場合、{part} はこのファイルの番号です（例: <span class="blue">1</span>、<span class="blue">2</span>、<span class="blue">3</span>...）。この小説が分割されていない場合、{part} は無視されます。`,
    `소설의 크기가 비교적 크면 다운로더가 여러 파일로 분할할 수 있습니다. 이 경우 {part}는 이 파일의 번호로, <span class="blue">1</span>、<span class="blue">2</span>、<span class="blue">3</span>...과 같습니다. 이 소설이 분할되지 않은 경우, {part}는 무시됩니다.`,
    `Если объем романа относительно велик, загрузчик может разделить его на несколько файлов. В этом случае {part} — это номер этого файла, например <span class="blue">1</span>, <span class="blue">2</span>, <span class="blue">3</span>... Если роман не разделен, {part} будет игнорироваться.`,
  ],
  _系列小说的命名标记_ext: [
    `小说的保存格式，可能是 <span class="blue">txt</span> 或 <span class="blue">epub</span>`,
    `小說的保存格式，可能是 <span class="blue">txt</span> 或 <span class="blue">epub</span>`,
    `The save format for novels may be <span class="blue">txt</span> or <span class="blue">epub</span>`,
    `小説の保存形式は <span class="blue">txt</span> または <span class="blue">epub</span> です`,
    `소설의 저장 형식은 <span class="blue">txt</span> 또는 <span class="blue">epub</span>일 수 있습니다`,
    `Формат сохранения романа может быть <span class="blue">txt</span> или <span class="blue">epub</span>`,
  ],
  _系列小说的命名标记_age: [
    `这个系列的年龄限制，分为：<span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>`,
    `這個系列的年齡限制，分為：<span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>`,
    `The age restriction of this series is divided into: <span class="blue">All Ages</span>, <span class="blue">R-18</span>, <span class="blue">R-18G</span>`,
    `このシリーズの年齢制限は、<span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>に分かれます`,
    `이 시리즈의 연령 제한은 <span class="blue">All Ages</span>、<span class="blue">R-18</span>、<span class="blue">R-18G</span>으로 나뉩니다`,
    `Возрастное ограничение этой серии разделено на: <span class="blue">All Ages</span>, <span class="blue">R-18</span>, <span class="blue">R-18G</span>`,
  ],
  _系列小说的命名标记_age_r: [
    `如果这个系列是限制级，则输出它的年龄限制，分为：<span class="blue">R-18</span>、<span class="blue">R-18G</span>，否则忽略这个标记。`,
    `如果這個系列是限制級，則輸出它的年齡限制，分為：<span class="blue">R-18</span>、<span class="blue">R-18G</span>，否則忽略這個標記。`,
    `If this series is restricted, output its age restriction, divided into: <span class="blue">R-18</span>, <span class="blue">R-18G</span>; otherwise, ignore this tag.`,
    `このシリーズが制限級の場合、その年齢制限を出力：<span class="blue">R-18</span>、<span class="blue">R-18G</span>。それ以外の場合はこのタグを無視します。`,
    `이 시리즈가 제한 등급이면 그 연령 제한을 출력：<span class="blue">R-18</span>、<span class="blue">R-18G</span>。그렇지 않으면 이 태그를 무시합니다。`,
    `Если эта серия ограничена, выведите её возрастное ограничение, разделённое на: <span class="blue">R-18</span>, <span class="blue">R-18G</span>; в противном случае игнорируйте этот тег。`,
  ],
  _系列小说的命名标记_AI: [
    `如果这个系列是 AI 生成的，则输出 <span class="blue">AI</span>，否则忽略这个标记。`,
    `如果這個系列是 AI 生成的，則輸出 <span class="blue">AI</span>，否則忽略這個標記。`,
    `If this series is AI-generated, output <span class="blue">AI</span>; otherwise, ignore this tag.`,
    `このシリーズがAI生成の場合、<span class="blue">AI</span>を出力します。それ以外の場合はこのタグを無視します。`,
    `이 시리즈가 AI 생성이라면 <span class="blue">AI</span>를 출력하며, 그렇지 않으면 이 태그를 무시합니다。`,
    `Если эта серия сгенерирована ИИ, выведите <span class="blue">AI</span>; в противном случае игнорируйте этот тег。`,
  ],
  _系列小说的命名标记_lang: [
    `这个系列的语言代码，例如 <span class="blue">zh-cn</span>、<span class="blue">ja</span>、<span class="blue">en</span> 等。注意：这并不总是准确的，因为有些作者没有设置正确的语言。`,
    `這個系列的語言代碼，例如 <span class="blue">zh-cn</span>、<span class="blue">ja</span>、<span class="blue">en</span> 等。注意：這並不總是準確的，因為有些作者沒有設置正確的語言。`,
    `The language code of this series, for example <span class="blue">zh-cn</span>, <span class="blue">ja</span>, <span class="blue">en</span>, etc. Note: This is not always accurate, because some authors have not set the correct language.`,
    `このシリーズの言語コード、例：<span class="blue">zh-cn</span>、<span class="blue">ja</span>、<span class="blue">en</span> など。注意：これは常に正確ではなく、一部の作者が正しい言語を設定していないためです。`,
    `이 시리즈의 언어 코드, 예: <span class="blue">zh-cn</span>、<span class="blue">ja</span>、<span class="blue">en</span> 등. 주의: 이는 항상 정확하지 않으며, 일부 작가가 올바른 언어를 설정하지 않았기 때문입니다.`,
    `Код языка этой серии, например <span class="blue">zh-cn</span>, <span class="blue">ja</span>, <span class="blue">en</span> и т.д. Примечание: Это не всегда точно, поскольку некоторые авторы не установили правильный язык.`,
  ],
  _系列小说的命名标记_total: [
    `这个系列里一共含有多少篇小说，是数字。`,
    `這個系列裡一共含有多少篇小說，是數字。`,
    `How many novels this series contains in total, it is a number.`,
    `このシリーズに含まれる小説の総数は数字です。`,
    `이 시리즈에 포함된 소설의 총 수는 숫자입니다。`,
    `Общее количество романов в этой серии, это число.`,
  ],
  _系列小说的命名标记_char_count: [
    `这个系列里所有小说的总字数，是数字。`,
    `這個系列裡所有小說的總字數，是數字。`,
    `The total word count of all novels in this series, it is a number.`,
    `このシリーズ内のすべての小説の総文字数、数値です。`,
    `이 시리즈의 모든 소설의 총 글자 수, 숫자입니다。`,
    `Общее количество слов во всех романах этой серии, это число。`,
  ],
  _系列小说的命名标记_create_date: [
    `这个系列的创建时间，例如 <span class="blue">2025-01-01</span>。`,
    `這個系列的創建時間，例如 <span class="blue">2025-01-01</span>。`,
    `The creation time of this series, for example <span class="blue">2025-01-01</span>.`,
    `このシリーズの作成日時、例：<span class="blue">2025-01-01</span>。`,
    `이 시리즈의 생성 시간, 예: <span class="blue">2025-01-01</span>。`,
    `Время создания этой серии, например <span class="blue">2025-01-01</span>.`,
  ],
  _系列小说的命名标记_last_date: [
    `这个系列里最新的一篇小说是何时添加的，例如 <span class="blue">2025-10-01</span>。`,
    `這個系列裡最新的一篇小說是何時添加的，例如 <span class="blue">2025-10-01</span>。`,
    `The date when the latest novel in this series was added, for example <span class="blue">2025-10-01</span>.`,
    `このシリーズの最新の小説が追加された日付、例：<span class="blue">2025-10-01</span>。`,
    `이 시리즈의 최신 소설이 추가된 날짜, 예: <span class="blue">2025-10-01</span>。`,
    `Дата добавления последней новеллы в этой серии, например <span class="blue">2025-10-01</span>.`,
  ],
  _系列小说的命名标记_task_date: [
    `下载器开始合并这个系列小说时的时间，例如 <span class="blue">2025-11-25</span>。`,
    `下載器開始合併這個系列小說時的時間，例如 <span class="blue">2025-11-25</span>。`,
    `The time when the downloader starts merging this novel series, for example <span class="blue">2025-11-25</span>.`,
    `ダウンロードツールがこのシリーズ小説のマージを開始した時間、例：<span class="blue">2025-11-25</span>。`,
    `다운로더가 이 시리즈 소설 병합을 시작한 시간, 예: <span class="blue">2025-11-25</span>。`,
    `Время, когда загрузчик начинает объединение этой серии романов, например <span class="blue">2025-11-25</span>.`,
  ],
  _系列小说的命名标记_first_id: [
    `这个系列里第一篇小说的 ID，是数字。`,
    `這個系列裡第一篇小說的 ID，是數字。`,
    `The ID of the first novel in this series, it is a number.`,
    `このシリーズの最初の小説の ID、数値です。`,
    `이 시리즈의 첫 번째 소설의 ID, 숫자입니다。`,
    `ID первого романа в этой серии, это число。`,
  ],
  _系列小说的命名标记_latest_id: [
    `这个系列里最后一篇小说的 ID，是数字。`,
    `這個系列裡最後一篇小說的 ID，是數字。`,
    `The ID of the last novel in this series, it is a number.`,
    `このシリーズの最後の小説の ID、数値です。`,
    `이 시리즈의 마지막 소설의 ID, 숫자입니다。`,
    `ID последнего романа в этой серии, это число。`,
  ],
  _系列小说的命名标记_tags: [
    `这个系列小说的标签列表。注意这是系列的标签，而非系列里每一篇小说的标签。`,
    `這個系列小說的標籤列表。注意這是系列的標籤，而非系列裡每一篇小說的標籤。`,
    `The tag list of this novel series. Note that these are the series' tags, not the tags of each novel in the series.`,
    `このシリーズ小説のタグリスト。これはシリーズのタグであり、シリーズ内の各小説のタグではありません。`,
    `이 시리즈 소설의 태그 목록. 이는 시리즈의 태그이며, 시리즈 내 각 소설의 태그가 아닙니다.`,
    `Список тегов этой серии романов. Обратите внимание, что это теги серии, а не теги каждого романа в серии.`,
  ],
  _系列小说的命名标记_page_title: [
    `当前页面的标题`,
    `當前頁面的標題`,
    `Title of the current page`,
    `現在のページのタイトル`,
    `현재 페이지의 제목`,
    `Заголовок текущей страницы`,
  ],
  _过滤搜索页面的作品: [
    `<span class="key">过滤</span>搜索页面的作品`,
    `<span class="key">過濾</span>搜尋頁面的作品`,
    `<span class="key">Filter</span> works on the search page`,
    `<span class="key">フィルタリング</span>検索ページの作品`,
    `<span class="key">필터링</span> 검색 페이지의 작품`,
    `<span class="key">Фильтрация</span> работ на странице поиска`,
  ],
  _过滤搜索页面的作品的说明: [
    `当你启用此功能后，下载器会在搜索页面里拦截 Pixiv 的请求，在作品显示之前就应用过滤器，移除不符合条件的作品。这样，只有符合条件的作品会显示出来。
    <br>
    <br>
    <strong>注意事项：</strong>
    <br>
    - 当你启用此功能、以及修改过滤条件后，页面上显示的作品不会变化，这是正常的，因为它们已经显示出来了。这个功能是通过拦截请求实现的，所以之后发起的请求才会应用你的修改，所以你在翻页、刷新时可以看到修改的效果。
    <br>
    - 由于作品列表的数据里不包含收藏数量，所以下载器不能使用收藏数量来过滤作品。收藏数量条件会被忽略。
    <br>
    - 启用此功能时，请谨慎使用“图片色彩”过滤器。如果只选择了一种颜色（也就是需要判断图片的色彩），下载器需要加载所有作品的缩略图来判断颜色，这会产生大量请求，而且也会花费比较多的时间（过滤可能需要超过 2 秒钟）。`,
    `當你啟用此功能後，下載器會在搜尋頁面裡攔截 Pixiv 的請求，在作品顯示之前就應用過濾器，移除不符合條件的作品。這樣，只有符合條件的作品會顯示出來。
    <br>
    <br>
    <strong>注意事項：</strong>
    <br>
    - 當你啟用此功能、以及修改過濾條件後，頁面上顯示的作品不會變化，這是正常的，因為它們已經顯示出來了。這個功能是通過攔截請求實現的，所以之後發起的請求才會應用你的修改，所以你在翻頁、刷新時可以看到修改的效果。
    <br>
    - 由於作品列表的資料裡不包含收藏數量，所以下載器不能使用收藏數量來過濾作品。收藏數量條件會被忽略。
    <br>
    - 啟用此功能時，請謹慎使用「圖片色彩」過濾器。如果只選擇了一種顏色（也就是需要判斷圖片的色彩），下載器需要載入所有作品的縮略圖來判斷顏色，這會產生大量請求，而且也會花費比較多的時間（過濾可能需要超過 2 秒鐘）。`,
    `After you enable this feature, the downloader will intercept Pixiv's requests on the search page and apply the filter before the works are displayed, removing works that do not meet the conditions. This way, only works that meet the conditions will be displayed.
    <br>
    <br>
    <strong>Notes:</strong>
    <br>
    - After you enable this feature or modify the filter conditions, the works displayed on the page will not change; this is normal because they have already been displayed. This feature is implemented by intercepting requests, so subsequent requests will apply your changes. Therefore, you can see the effect of the changes when you turn the page or refresh.
    <br>
    - Since the work list data does not include the bookmark count, the downloader cannot use the bookmark count to filter works. The bookmark count condition will be ignored.
    <br>
    - When enabling this feature, please use the "Image Color" filter with caution. If only one color is selected (which means judging the color of the image), the downloader needs to load thumbnails of all works to determine the color, which will generate a large number of requests and also take more time (filtering may take more than 2 seconds).`,
    `この機能を有効にすると、ダウンロードツールは検索ページでPixivのリクエストを傍受し、作品が表示される前にフィルターを適用して条件に合わない作品を削除します。これにより、条件に合った作品のみが表示されます。
    <br>
    <br>
    <strong>注意事項：</strong>
    <br>
    - この機能を有効にしたり、フィルター条件を変更した後、ページに表示されている作品は変更されません。これは正常です。なぜなら、それらはすでに表示されているからです。この機能はリクエストの傍受によって実装されているため、後続のリクエストにのみ変更が適用されます。したがって、ページをめくるか更新すると変更の効果が見られます。
    <br>
    - 作品リストのデータにブックマーク数を含まないため、ダウンロードツールはブックマーク数で作品をフィルタリングできません。ブックマーク数の条件は無視されます。
    <br>
    - この機能を有効にする際は、「画像色」フィルターを慎重に使用してください。1つの色のみを選択した場合（画像の色を判断する必要がある場合）、ダウンロードツールはすべての作品のサムネイルをロードして色を判断する必要があります。これにより大量のリクエストが発生し、時間もかかります（フィルタリングに2秒以上かかる可能性があります）。`,
    `이 기능을 활성화한 후, 다운로더는 검색 페이지에서 Pixiv의 요청을 차단하고 작품이 표시되기 전에 필터를 적용하여 조건을 충족하지 않는 작품을 제거합니다. 이렇게 하면 조건을 충족하는 작품만 표시됩니다.
    <br>
    <br>
    <strong>주의사항:</strong>
    <br>
    - 이 기능을 활성화하거나 필터 조건을 수정한 후 페이지에 표시된 작품은 변경되지 않습니다. 이는 정상입니다. 왜냐하면 이미 표시되었기 때문입니다. 이 기능은 요청 차단을 통해 구현되므로 후속 요청에만 변경 사항이 적용됩니다. 따라서 페이지를 넘기거나 새로고침할 때 변경 효과를 볼 수 있습니다.
    <br>
    - 작품 목록 데이터에 북마크 수가 포함되지 않으므로 다운로더는 북마크 수를 사용하여 작품을 필터링할 수 없습니다. 북마크 수 조건은 무시됩니다.
    <br>
    - 이 기능을 활성화할 때 "이미지 색상" 필터를 신중하게 사용하십시오. 한 가지 색상만 선택한 경우(이미지의 색상을 판단해야 하는 경우), 다운로더는 모든 작품의 썸네일을 로드하여 색상을 판단해야 하며, 이는 대량의 요청을 생성하고 더 많은 시간을 소비합니다(필터링에 2초 이상 걸릴 수 있습니다).`,
    `После активации этой функции загрузчик будет перехватывать запросы Pixiv на странице поиска и применять фильтр до отображения работ, удаляя те, которые не соответствуют условиям. Таким образом, будут отображаться только работы, соответствующие условиям.
    <br>
    <br>
    <strong>Примечания:</strong>
    <br>
    - После активации этой функции или изменения условий фильтрации отображаемые на странице работы не изменятся; это нормально, поскольку они уже отображены. Эта функция реализована путем перехвата запросов, поэтому изменения применяются только к последующим запросам. Поэтому вы увидите эффект изменений при перелистывании страниц или обновлении.
    <br>
    - Поскольку данные списка работ не включают количество закладок, загрузчик не может использовать количество закладок для фильтрации работ. Условие по количеству закладок будет игнорироваться.
    <br>
    - При активации этой функции используйте фильтр "Цвет изображения" с осторожностью. Если выбран только один цвет (т.е. требуется определить цвет изображения), загрузчику нужно загрузить миниатюры всех работ для определения цвета, что сгенерирует большое количество запросов и займет больше времени (фильтрация может занять более 2 секунд).`,
  ],
  _导出作品数据CSV: [
    `导出作品数据（CSV）`,
    `匯出作品資料（CSV）`,
    `Export work data (CSV)`,
    `作品データをエクスポート（CSV）`,
    `작품 데이터 내보내기 (CSV)`,
    `Экспорт данных работы (CSV)`,
  ],
  _类型: [`类型`, `類型`, `Type`, `タイプ`, `유형`, `Тип`],
  _标题: ['标题', '標題', 'Title', 'タイトル', '타이틀', `Заголовок`],
  _赞: ['赞！', '讚！', 'Likes', 'いいね！', '좋아요!', `Лайк!`],
  _浏览量: ['浏览量', '瀏覽量', 'Views', '閲覧数', '열람 횟수', `Просмотры`],
  _评论: ['评论', '留言', 'Comments', 'コメント', '댓글', `Комментарий`],
  _日期: ['日期', '日期', 'Date', '日付', '날짜', `Дата`],
  _评级: ['评级', '分級', 'Rating', 'レーティング', '연령 등급', 'Рейтинг'],
  _张数: ['张数', '張數', 'Pages', '枚数', '매수', `Количество страниц`],
  _排名: ['排名', '排名', 'Ranking', 'ランキング順位', '랭킹 순위', `Рейтинг`],
  _响应关联作品: [
    '响应关联作品',
    '響應關聯作品',
    'Image Response',
    'イメージレスポンス',
    '이미지 리스폰스',
    `Ответ на связанные работы`,
  ],
  _添加插图: [
    '添加插图',
    '使用插圖',
    'Illustration usage counter',
    '挿絵使用',
    '삽화 사용',
    `Добавленные иллюстрации`,
  ],
  _文字数: [
    '文字数',
    '文字數',
    'Characters',
    '文字数',
    '글자수',
    `Количество символов`,
  ],
  _单词数: ['单词数', '詞彙數', 'Words', '単語数', '단어수', `Количество слов`],
  _数据分析: [
    '数据分析',
    '創作儀表板',
    'Dashboard',
    'ダッシュボード',
    '대쉬보드',
    `Дашборд`,
  ],
  _标签: ['标签', '標籤', 'Tags', 'タグ', '태그', 'Теги'],
  _应募作品: [
    '应募作品',
    '參加作品',
    'applications',
    '応募作品',
    '응모 작품',
    `Работы конкурса`,
  ],
  _抓取应募作品: [
    `抓取应募作品`,
    `抓取應募作品`,
    `Crawl application works`,
    `応募作品をクロール`,
    `응모 작품 크롤링`,
    `Скраулить конкурсные работы`,
  ],
  _API返回了错误信息: [
    `API 返回了错误信息：`,
    `API 回傳了錯誤資訊：`,
    `API returned an error message:`,
    `API がエラー情報を返しました：`,
    `API가 오류 메시지를 반환했습니다:`,
    `API вернул сообщение об ошибке:`,
  ],
  _已抓取x页应募作品: [
    `已抓取 {} 页应募作品`,
    `已抓取 {} 頁應募作品`,
    `Crawled {} pages of application works`,
    `{} ページの応募作品をクロール済み`,
    `{} 페이지의 응모 작품 크롤링 완료`,
    `Скраулено {} страниц конкурсных работ`,
  ],
  _获奖作品: [
    '获奖作品',
    '獲獎作品',
    'Winning Applications',
    '受賞作品',
    '수상 작품',
    `Победившие работы`,
  ],
  _抓取获奖作品: [
    `抓取获奖作品`,
    `抓取獲獎作品`,
    `Crawl winning works`,
    `受賞作品をクロール`,
    `수상 작품 크롤링`,
    `Скраулить победившие работы`,
  ],
  _没有找到任何获奖作品_可能是因为比赛尚未结束: [
    `没有找到任何获奖作品，可能是因为比赛尚未结束。`,
    `沒有找到任何獲獎作品，可能是因為比賽尚未結束。`,
    `No winning works found, possibly because the contest has not ended yet.`,
    `受賞作品が見つかりませんでした。コンテストがまだ終了していない可能性があります。`,
    `수상 작품을 찾을 수 없습니다. 대회가 아직 종료되지 않았기 때문일 수 있습니다.`,
    `Не найдено ни одной победившей работы, возможно, потому что конкурс ещё не завершён.`,
  ],
  _提示有些用户可能已经注销: [
    `💡有些用户可能已经注销，所以实际上的用户数量会少一些。`,
    `💡有些用戶可能已經註銷，所以實際上的用戶數量會少一些。`,
    `💡Some users may have already deactivated their accounts, so the actual number of users will be slightly lower.`,
    `💡一部のユーザーが退会している可能性があるため、実際のユーザー数は少し少なくなります。`,
    `💡일부 사용자가 이미 탈퇴했을 수 있으므로 실제 사용자 수는 조금 더 적을 수 있습니다.`,
    `💡Некоторые пользователи могли уже деактивировать аккаунты, поэтому фактическое количество пользователей будет немного меньше.`,
  ],
  _查找已注销的用户: [
    `查找已注销的用户`,
    `查找已註銷的用戶`,
    `Find deactivated users`,
    `退会済みユーザーを検索`,
    `탈퇴한 사용자 찾기`,
    `Поиск деактивированных/удалённых пользователей`,
  ],
  _检查是否有已注销的用户的说明: [
    `该功能会检查你的关注列表，找出现在比之前少了哪些用户，然后检查他们是否注销了账号。<br>
    Pixiv 不会显示被注销的用户，所以此功能依赖于下载器自己保存的历史关注数据（该数据保存在本地）。<br>
    该数据最早会从该功能推出时（2026 年 3 月）开始保存；如果你在此日期之后才安装了下载器，那么下载器开始工作之后才会保存此数据。<br>
    下载器只能检查到在此之后注销的用户。`,
    `該功能會檢查你的關注列表，找出現在比之前少了哪些用戶，然後檢查他們是否註銷了帳號。<br>
    Pixiv 不會顯示被註銷的用戶，所以此功能依賴於下載器自己保存的歷史關注資料（該資料保存在本地）。<br>
    該資料最早會從該功能推出時（2026 年 3 月）開始保存；如果你在此日期之後才安裝了下載器，那麼下載器開始工作之後才會保存此資料。<br>
    下載器只能檢查到在此之後註銷的用戶。`,
    `This feature checks your following list to identify which users are now missing compared to before, and then checks if they have deactivated their accounts.<br>
    Pixiv does not display deactivated users, so this feature relies on the historical following data saved locally by the downloader itself.<br>
    This data starts being saved from when the feature was released (March 2026) at the earliest; if you installed the downloader after this date, the data will only start being saved after the downloader begins working.<br>
    The downloader can only detect users who deactivated after this point.`,
    `この機能はあなたのフォロー一覧をチェックし、現在前回よりも減ったユーザーを特定した後、それらのユーザーがアカウントを退会したかどうかを確認します。<br>
    Pixiv は退会したユーザーを表示しないため、この機能はダウンロードツール自身がローカルに保存している履歴フォローデータに依存します。<br>
    このデータは最も早くてもこの機能がリリースされた時点（2026年3月）から保存が開始されます。この日付以降にダウンロードツールをインストールした場合、ダウンロードツールが動作を開始した時点からデータの保存が始まります。<br>
    ダウンロードツールはこの日付以降に退会したユーザーのみ検出可能です。`,
    `이 기능은 팔로잉 목록을 확인하여 이전보다 줄어든 사용자를 찾아내고, 해당 사용자가 계정을 탈퇴했는지 확인합니다.<br>
    Pixiv는 탈퇴한 사용자를 표시하지 않으므로 이 기능은 다운로더가 자체적으로 로컬에 저장한 과거 팔로잉 데이터에 의존합니다.<br>
    이 데이터는 가장 빠른 경우 해당 기능 출시 시점(2026년 3월)부터 저장되기 시작하며, 이 날짜 이후에 다운로더를 설치했다면 다운로더가 작동을 시작한 이후부터 데이터가 저장됩니다.<br>
    다운로더는 이 시점 이후에 탈퇴한 사용자만 확인할 수 있습니다.`,
    `Эта функция проверяет ваш список подписок, определяет, какие пользователи теперь отсутствуют по сравнению с предыдущим состоянием, а затем проверяет, деактивировали ли они аккаунт.<br>
    Pixiv не показывает деактивированных пользователей, поэтому функция полагается на историю подписок, сохранённую локально самим загрузчиком.<br>
    Эти данные начинают сохраняться не раньше даты выпуска функции (март 2026 года); если вы установили загрузчик позже этой даты, то данные начнут сохраняться только после того, как загрузчик начал работу.<br>
    Загрузчик может обнаружить только тех пользователей, которые деактивировали аккаунт после этой даты.`,
  ],
  _检查用户x是否已注销: [
    `检查用户 {} 是否已注销`,
    `檢查用戶 {} 是否已註銷`,
    `Check if user {} has deactivated`,
    `ユーザー {} が退会済みか確認`,
    `사용자 {} 가 탈퇴했는지 확인`,
    `Проверить, деактивирован ли пользователь {}`,
  ],
  _该用户已注销: [
    `该用户已注销`,
    `該用戶已註銷`,
    `This user has deactivated`,
    `このユーザーは退会済みです`,
    `이 사용자는 탈퇴했습니다`,
    `Этот пользователь деактивирован`,
  ],
  _该用户未注销: [
    `该用户未注销`,
    `該用戶未註銷`,
    `This user has not deactivated`,
    `このユーザーは退会していません`,
    `이 사용자는 탈퇴하지 않았습니다`,
    `Этот пользователь не деактивирован`,
  ],
  _已注销用户数量: [
    `已注销用户数量`,
    `已註銷用戶數量`,
    `Number of deactivated users`,
    `退会済みユーザーの数`,
    `탈퇴한 사용자 수`,
    `Количество деактивированных пользователей`,
  ],
  _没有找到已注销的用户: [
    `没有找到已注销的用户`,
    `沒有找到已註銷的用戶`,
    `No deactivated users found`,
    `退会済みユーザーは見つかりませんでした`,
    `탈퇴한 사용자를 찾을 수 없습니다`,
    `Не найдено удалённых/деактивированных пользователей`,
  ],
  _日志区域的默认可见性: [
    `日志区域的默认<span class="key">可见性</span>`,
    `日誌區域的預設<span class="key">可見性</span>`,
    `Default <span class="key">visibility</span> of the log area`,
    `ログ領域のデフォルト<span class="key">可視性</span>`,
    `로그 영역의 기본 <span class="key">가시성</span>`,
    `Область журнала по умолчанию <span class="key">видимость</span>`,
  ],
  _日志区域的默认可见性的说明: [
    `当下载器在页面顶部输出日志时，你可以控制日志区域默认显示还是隐藏。`,
    `當下載器在頁面頂部輸出日誌時，你可以控制日誌區域預設顯示還是隱藏。`,
    `When the downloader outputs logs at the top of the page, you can control whether the log area is shown or hidden by default.`,
    `ダウンロードツールがページ上部にログを出力する際、ログ領域のデフォルト表示（表示／非表示）を制御できます。`,
    `다운로더가 페이지 상단에 로그를 출력할 때, 로그 영역의 기본 표시 또는 숨김을 제어할 수 있습니다。`,
    `Когда загрузчик выводит логи в верхней части страницы, вы можете управлять, будет ли область журнала отображаться или скрываться по умолчанию。`,
  ],
  _显示: [`显示`, `顯示`, `Show`, `表示`, `표시`, `Показать`],
  _隐藏: [`隐藏`, `隱藏`, `Hide`, `非表示`, `숨기기`, `Скрыть`],
  _排除作品: [
    `🚫排除作品`,
    `🚫排除作品`,
    `🚫Exclude works`,
    `🚫作品を除外`,
    `🚫작품 제외`,
    `🚫Исключить работы`,
  ],
  _排除小说: [
    `🚫排除小说`,
    `🚫排除小說`,
    `🚫Exclude novels`,
    `🚫小説を除外`,
    `🚫소설 제외`,
    `🚫Исключить романы`,
  ],
  _这个系列里的所有小说都被排除了: [
    `⚠️这个系列里的所有小说都被排除了`,
    `⚠️這個系列裡的所有小說都被排除了`,
    `⚠️All novels in this series have been excluded`,
    `⚠️このシリーズ内のすべての小説が除外されました`,
    `⚠️이 시리즈 내의 모든 소설이 제외되었습니다`,
    `⚠️Все романы в этой серии были исключены`,
  ],
  _提示下载记录数量太多: [
    `💡提示：建议您清理浏览器的下载记录。<br>
    为什么您会看到这个提示：<br>
    如果浏览器的下载记录数量太多，会导致浏览器在启动时卡住（无响应）一段时间。下载记录越多，卡住的时间就越长。<br>
    下载器的用户可能会从 Pixiv 下载很多文件，产生大量下载记录，容易导致这个问题。但很多用户不知道该问题的原因，所以下载器每隔 24 小时会查询一次浏览器的下载记录数量，当数量超过 {} 时就会显示这个提示。`,
    `💡提示：建議您清理瀏覽器的下載記錄。<br>
    為什麼您會看到這個提示：<br>
    如果瀏覽器的下載記錄數量太多，會導致瀏覽器在啟動時卡住（無回應）一段時間。下載記錄越多，卡住的時間就越長。<br>
    下載器的使用者可能會從 Pixiv 下載很多檔案，產生大量下載記錄，容易導致這個問題。但很多使用者不知道該問題的原因，所以下載器每隔 24 小時會查詢一次瀏覽器的下載記錄數量，當數量超過 {} 時就會顯示這個提示。`,
    `💡Tip: It is recommended to clear your browser's download history.<br>
    Why you are seeing this tip:<br>
    If there are too many download records in the browser, it can cause the browser to freeze (become unresponsive) for a period of time when starting up. The more download records there are, the longer the freeze lasts.<br>
    Users of the downloader may download a large number of files from Pixiv, generating a lot of download records, which can easily cause this issue. However, many users are unaware of the cause, so the downloader checks the number of browser download records once every 24 hours. When the number exceeds {}, this tip will be displayed.`,
    `💡ヒント：ブラウザのダウンロード履歴をクリアすることをおすすめします。<br>
    このヒントが表示される理由：<br>
    ブラウザのダウンロード履歴が多すぎると、ブラウザ起動時にフリーズ（無反応）する時間が発生します。ダウンロード履歴が多いほど、フリーズ時間が長くなります。<br>
    ダウンロードツールのユーザーは Pixiv から大量のファイルをダウンロードすることが多く、多くのダウンロード履歴が発生しやすく、この問題を引き起こしやすいです。しかし多くのユーザーが原因を知らないため、ダウンロードツールは 24 時間ごとに 1 回ブラウザのダウンロード履歴数を確認し、数が {} を超えるとこのヒントを表示します。`,
    `💡팁: 브라우저의 다운로드 기록을 정리하는 것을 권장합니다.<br>
    이 팁이 표시되는 이유:<br>
    브라우저의 다운로드 기록이 너무 많으면 브라우저 시작 시 일정 시간 동안 멈춤(무응답)이 발생합니다. 다운로드 기록이 많을수록 멈춤 시간이 길어집니다.<br>
    다운로더 사용자는 Pixiv에서 많은 파일을 다운로드하여 대량의 다운로드 기록을 생성할 수 있어 이 문제가 쉽게 발생합니다. 하지만 많은 사용자가 원인을 모르기 때문에 다운로더는 24시간마다 한 번 브라우저 다운로드 기록 수를 확인하며, 수가 {}를 초과하면 이 팁을 표시합니다.`,
    `💡Подсказка: Рекомендуется очистить историю загрузок браузера.<br>
    Почему вы видите эту подсказку:<br>
    Если в браузере слишком много записей о загрузках, при запуске браузер может зависнуть (стать неотзывчивым) на некоторое время. Чем больше записей о загрузках, тем дольше длится зависание.<br>
    Пользователи загрузчика часто скачивают много файлов с Pixiv, создавая большое количество записей о загрузках, что легко приводит к этой проблеме. Однако многие пользователи не знают причины, поэтому загрузчик каждые 24 часа проверяет количество записей о загрузках в браузере и показывает эту подсказку, когда количество превышает {}.`,
  ],
  _启用了整合相同系列小说时的提示: [
    `提示：由于你启用了“整合系列作品”的搜索条件，所以该页面里有两种内容：系列小说和单篇完结小说。<br>
对于系列小说，下载器会在抓取时直接合并它，并且不会单独下载它里面的单篇小说。<br>
对于单篇小说，下载器不会在抓取时下载它们，而是会保存到抓取结果里。<br>
因此，在抓取阶段，你可能会看到下载器只保存了系列小说，没有保存任何单篇小说。这是正常的，因为它们是分开处理的。<br>
等到抓取完毕之后，正常开始下载即可保存单篇小说。`,
    `提示：由於你啟用了「整合系列作品」的搜尋條件，所以該頁面裡有兩種內容：系列小說和單篇完結小說。<br>
對於系列小說，下載器會在抓取時直接合併它，並且不會單獨下載它裡面的單篇小說。<br>
對於單篇小說，下載器不會在抓取時下載它們，而是會保存到抓取結果裡。<br>
因此，在抓取階段，你可能會看到下載器只保存了系列小說，沒有保存任何單篇小說。這是正常的，因為它們是分開處理的。<br>
等到抓取完畢之後，正常開始下載即可保存單篇小說。`,
    `Tip: Since you have enabled the "Integrate Series Works" search condition, this page contains two types of content: series novels and standalone completed novels.<br>
For series novels, the downloader will merge them directly during crawling and will not download individual chapters inside them separately.<br>
For standalone novels, the downloader will not download them during crawling, but will save them to the crawl results.<br>
Therefore, during the crawling phase, you may see that the downloader only saved series novels and did not save any standalone novels. This is normal because they are handled separately.<br>
After crawling is complete, you can start the normal download to save the standalone novels.`,
    `ヒント：「シリーズ作品を統合する」検索条件を有効にしたため、このページには2種類のコンテンツがあります：シリーズ小説と単発完結小説。<br>
シリーズ小説については、ダウンロードツールはクロール時に直接マージし、中の個別エピソードを単独でダウンロードしません。<br>
単発小説については、クロール時にダウンロードせず、クロール結果に保存します。<br>
したがって、クロール段階ではダウンロードツールがシリーズ小説のみを保存し、単発小説を保存していないように見えることがあります。これは正常です。なぜなら別々に処理されるからです。<br>
クロール完了後、通常のダウンロードを開始すれば単発小説が保存されます。`,
    `팁: "시리즈 작품 통합" 검색 조건을 활성화했기 때문에 이 페이지에는 두 가지 콘텐츠가 있습니다: 시리즈 소설과 단편 완결 소설.<br>
시리즈 소설의 경우 다운로더는 크롤링 시 직접 병합하며, 내부의 개별 편을 따로 다운로드하지 않습니다.<br>
단편 소설의 경우 크롤링 시 다운로드하지 않고 크롤링 결과에 저장합니다.<br>
따라서 크롤링 단계에서는 다운로더가 시리즈 소설만 저장하고 단편 소설은 저장하지 않은 것처럼 보일 수 있습니다. 이는 정상입니다. 왜냐하면 별도로 처리되기 때문입니다.<br>
크롤링 완료 후 정상적인 다운로드를 시작하면 단편 소설이 저장됩니다.`,
    `Подсказка: Поскольку вы включили условие поиска «Интегрировать серии работ», на этой странице присутствуют два типа контента: серии романов и отдельные завершённые романы.<br>
Для серий романов загрузчик во время краулинга сразу объединит их и не будет скачивать отдельные главы внутри них по отдельности.<br>
Для отдельных романов загрузчик не будет скачивать их во время краулинга, а сохранит в результаты краулинга.<br>
Поэтому на этапе краулинга вы можете увидеть, что загрузчик сохранил только серии романов и не сохранил ни одного отдельного романа. Это нормально, поскольку они обрабатываются отдельно.<br>
После завершения краулинга начните обычную загрузку — отдельные романы будут сохранены.`,
  ],
  _提示只会收藏单篇小说: [
    `这个页面里可能有系列小说。下载器会跳过系列小说，只收藏单篇小说。`,
    `這個頁面裡可能有系列小說。下載器會跳過系列小說，只收藏單篇小說。`,
    `This page may contain novel series. The downloader will skip series novels and only bookmark standalone novels.`,
    `このページにはシリーズ小説が含まれる可能性があります。ダウンロードツールはシリーズ小説をスキップし、単発小説のみをブックマークします。`,
    `이 페이지에는 시리즈 소설이 포함될 수 있습니다. 다운로더는 시리즈 소설을 건너뛰고 단편 소설만 북마크합니다.`,
    `На этой странице могут быть серии романов. Загрузчик пропустит серии романов и добавит в закладки только отдельные романы.`,
  ],
  _提示选择的作品里有一些系列小说: [
    `你选择的作品里有一些系列小说，下载器会优先合并系列小说。`,
    `你選擇的作品裡有一些系列小說，下載器會優先合併系列小說。`,
    `Some of the works you selected are novel series, and the downloader will prioritize merging the series novels.`,
    `選択した作品の中にシリーズ小説が含まれています。ダウンロードツールはシリーズ小説を優先的にマージします。`,
    `선택한 작품 중 일부가 시리즈 소설입니다. 다운로더는 시리즈 소설을 우선적으로 병합합니다.`,
    `В выбранных вами работах есть серии романов, загрузчик будет в первую очередь объединять серии романов.`,
  ],
  _建议您关闭询问文件保存位置: [
    `强烈建议您在浏览器的下载设置中关闭“下载前询问每个文件的保存位置”，否则保存每个文件时都会显示另存为对话框。`,
    `強烈建議您在瀏覽器的下載設定中關閉「下載前詢問每個檔案的儲存位置」，否則儲存每個檔案時都會顯示另存為對話框。`,
    `It is strongly recommended to disable "Ask where to save each file before downloading" in your browser's download settings, otherwise the "Save As" dialog will appear for every file saved.`,
    `ブラウザのダウンロード設定で「ダウンロード前に各ファイルの保存先を確認する」をオフにすることを強くおすすめします。そうしないと、すべてのファイル保存時に「名前を付けて保存」ダイアログが表示されます。`,
    `브라우저의 다운로드 설정에서 "다운로드 전에 각 파일의 저장 위치 확인"을 끄는 것을 강력히 권장합니다. 그렇지 않으면 모든 파일 저장 시 "다른 이름으로 저장" 대화상자가 표시됩니다.`,
    `Настоятельно рекомендуется отключить в настройках загрузки браузера опцию «Спрашивать, куда сохранять каждый файл перед загрузкой», иначе для каждого сохраняемого файла будет появляться диалог «Сохранить как».`,
  ],
  _标题必须含有: [
    `<span class="key">标题</span>必须含有`,
    `<span class="key">標題</span>必須含有`,
    `<span class="key">Title</span> must contain`,
    `<span class="key">タイトル</span>は必ず含む`,
    `<span class="key">제목</span> 반드시 포함`,
    `<span class="key">Заголовок</span> должен содержать`,
  ],
  _标题必须含有的说明: [
    `你可以要求作品的标题里必须含有特定字符。不区分大小写。<br>
你可以设置多条字符，每条之间使用逗号(,)分割。<br>
匹配模式是“任一”，即只要标题里含有任意一条设置的字符，下载器就会抓取它。`,
    `你可以要求作品的標題裡必須含有特定字元。不區分大小寫。<br>
你可以設定多條字元，每條之間使用逗號(,)分割。<br>
匹配模式是「任一」，即只要標題裡含有任意一條設定的字元，下載器就會抓取它。`,
    `You can require that the work's title must contain specific characters. Case-insensitive.<br>
You can set multiple strings, separated by commas (,).<br>
The matching mode is "any one", meaning as long as the title contains any one of the specified strings, the downloader will crawl it.`,
    `作品のタイトルに特定の文字列を必ず含めるよう要求できます。大文字小文字は区別しません。<br>
複数の文字列を設定でき、それぞれをカンマ(,)で区切ります。<br>
マッチングモードは「いずれか」で、設定した文字列のいずれか一つでもタイトルに含まれていれば、ダウンロードツールはその作品をクロールします。`,
    `작품 제목에 특정 문자를 반드시 포함하도록 요구할 수 있습니다. 대소문자 구분 없음.<br>
여러 문자열을 설정할 수 있으며, 각 문자열은 쉼표(,)로 구분합니다.<br>
매칭 모드는 "하나라도"로, 제목에 설정한 문자열 중 하나라도 포함되어 있으면 다운로더가 해당 작품을 크롤링합니다.`,
    `Вы можете потребовать, чтобы в названии работы обязательно содержались определённые символы. Без учёта регистра.<br>
Можно задать несколько строк, разделяя их запятыми (,).<br>
Режим соответствия — «любой», то есть достаточно, чтобы в названии присутствовала хотя бы одна из указанных строк, и загрузчик будет краулить эту работу.`,
  ],
  _标题不能含有: [
    `<span class="key">标题</span>不能含有`,
    `<span class="key">標題</span>不能含有`,
    `<span class="key">Title</span> must not contain`,
    `<span class="key">タイトル</span>は含まない`,
    `<span class="key">제목</span> 포함하지 않음`,
    `<span class="key">Заголовок</span> не должен содержать`,
  ],
  _标题不能含有的说明: [
    `你可以要求作品的标题里不能含有特定字符。不区分大小写。<br>
你可以设置多条字符，每条之间使用逗号(,)分割。<br>
匹配模式是“任一”，即只要标题里含有任意一条设置的字符，下载器就不会抓取它。<br>
排除的优先级大于包含的优先级。`,
    `你可以要求作品的標題裡不能含有特定字元。不區分大小寫。<br>
你可以設定多條字元，每條之間使用逗號(,)分割。<br>
匹配模式是「任一」，即只要標題裡含有任意一條設定的字元，下載器就不會抓取它。<br>
排除的優先級大於包含的優先級。`,
    `You can require that the work's title must not contain specific characters. Case-insensitive.<br>
You can set multiple strings, separated by commas (,).<br>
The matching mode is "any one", meaning if the title contains any one of the specified strings, the downloader will not crawl it.<br>
Exclusion takes priority over inclusion.`,
    `作品のタイトルに特定の文字列を含まないよう要求できます。大文字小文字は区別しません。<br>
複数の文字列を設定でき、それぞれをカンマ(,)で区切ります。<br>
マッチングモードは「いずれか」で、設定した文字列のいずれか一つでもタイトルに含まれている場合、ダウンロードツールはその作品をクロールしません。<br>
除外条件の優先度が包含条件より高くなります。`,
    `작품 제목에 특정 문자를 포함하지 않도록 요구할 수 있습니다. 대소문자 구분 없음.<br>
여러 문자열을 설정할 수 있으며, 각 문자열은 쉼표(,)로 구분합니다.<br>
매칭 모드는 "하나라도"로, 제목에 설정한 문자열 중 하나라도 포함되어 있으면 다운로더가 해당 작품을 크롤링하지 않습니다.<br>
제외 조건의 우선순위가 포함 조건보다 높습니다.`,
    `Вы можете потребовать, чтобы в названии работы не содержались определённые символы. Без учёта регистра.<br>
Можно задать несколько строк, разделяя их запятыми (,).<br>
Режим соответствия — «любой», то есть если в названии присутствует хотя бы одна из указанных строк, загрузчик не будет краулить эту работу.<br>
Условия исключения имеют приоритет над условиями включения.`,
  ],
  _系列标题不能含有: [
    `系列标题不能含有`,
    `系列標題不能含有`,
    `Series title must not contain`,
    `シリーズタイトルは含まない`,
    `시리즈 제목 포함하지 않음`,
    `Заголовок серии не должен содержать`,
  ],
  _也检查系列标题: [
    `也检查系列标题`,
    `也檢查系列標題`,
    `Also check series title`,
    `シリーズタイトルもチェック`,
    `시리즈 제목도 확인`,
    `Также проверять заголовок серии`,
  ],
  _也检查系列标题的说明: [
    `如果作品属于一个系列，启用此设置可以同时检查系列标题是否符合条件。`,
    `如果作品屬於一個系列，啟用此設定可以同時檢查系列標題是否符合條件。`,
    `If the work belongs to a series, enabling this setting will also check if the series title meets the conditions.`,
    `作品がシリーズに属する場合、この設定を有効にするとシリーズタイトルも条件に合致するかチェックされます。`,
    `작품이 시리즈에 속할 경우, 이 설정을 활성화하면 시리즈 제목도 조건을 충족하는지 함께 확인합니다.`,
    `Если работа входит в серию, включение этой настройки позволит также проверить, соответствует ли заголовок серии условиям.`,
  ],
  _跳过这个系列: [
    `跳过这个系列`,
    `跳過這個系列`,
    `Skip this series`,
    `このシリーズをスキップ`,
    `이 시리즈 건너뛰기`,
    `Пропустить эту серию`,
  ],
  _原创作品: [
    `<span class="key">原创</span>作品`,
    `<span class="key">原創</span>作品`,
    `<span class="key">Original</span> works`,
    `<span class="key">オリジナル</span>作品`,
    `<span class="key">오리지널</span> 작품`,
    `<span class="key">Оригинальные</span> работы`,
  ],
  _原创: [`原创`, `原創`, `Original`, `オリジナル`, `오리지널`, `Оригинал`],
  _非原创: [
    `非原创`,
    `非原創`,
    `Non-original`,
    `非オリジナル`,
    `비오리지널`,
    `Не оригинал`,
  ],
  _宽松匹配: [
    `宽松匹配`,
    `寬鬆匹配`,
    `Loose matching`,
    `緩いマッチング`,
    `느슨한 매칭`,
    `Слабое совпадение`,
  ],
  _宽松匹配原创作品的说明: [
    `艺术家在投稿作品时可以设置它是否是原创作品。<br>
如果你没有启用“宽松匹配”，这个过滤条件会严格遵守艺术家设置的原创属性。<br>
<br>
但也有一种常见的情况：艺术家没有把作品设置为原创，但作品含有原创相关的标签。<br>
如果你启用了“宽松匹配”，并且作品含有任意一个特定标签，那么即使它是非原创作品，下载器在过滤时也会把它视为原创作品。<br>
这些标签有：<br>
${Config.originalTags.join(',')}`,
    `藝術家在投稿作品時可以設定它是否是原創作品。<br>
如果你沒有啟用「寬鬆匹配」，這個過濾條件會嚴格遵守藝術家設定的原創屬性。<br>
<br>
但也有一種常見的情況：藝術家沒有把作品設定為原創，但作品含有原創相關的標籤。<br>
如果你啟用了「寬鬆匹配」，並且作品含有任意一個特定標籤，那麼即使它是非原創作品，下載器在過濾時也會把它視為原創作品。<br>
這些標籤有：<br>
${Config.originalTags.join(',')}`,
    `Artists can set whether their posted work is an original work when submitting.<br>
If you have not enabled "Loose matching", this filter condition will strictly follow the original property set by the artist.<br>
<br>
However, there is also a common situation: the artist did not set the work as original, but the work contains original-related tags.<br>
If you have enabled "Loose matching" and the work contains any one of the specific tags, then even if it is a non-original work, the downloader will treat it as an original work during filtering.<br>
These tags are:<br>
${Config.originalTags.join(',')}`,
    `アーティストは投稿時に作品がオリジナル作品かどうかを設定できます。<br>
「緩いマッチング」を有効にしていない場合、このフィルター条件はアーティストが設定したオリジナル属性を厳密に遵守します。<br>
<br>
ただし、次のようなよくあるケースもあります：アーティストが作品をオリジナルとして設定していないのに、作品にオリジナル関連のタグが付いている場合。<br>
「緩いマッチング」を有効にしていて、作品に指定されたタグのいずれかが含まれている場合、非オリジナル作品であってもダウンロードツールはフィルタリング時にそれをオリジナル作品として扱います。<br>
これらのタグは以下の通りです：<br>
${Config.originalTags.join(',')}`,
    `아티스트는 작품을 게시할 때 해당 작품이 오리지널 작품인지 설정할 수 있습니다.<br>
"느슨한 매칭"을 활성화하지 않은 경우, 이 필터 조건은 아티스트가 설정한 오리지널 속성을 엄격히 따릅니다.<br>
<br>
하지만 흔한 경우가 있습니다: 아티스트가 작품을 오리지널로 설정하지 않았는데 작품에 오리지널 관련 태그가 포함된 경우.<br>
"느슨한 매칭"을 활성화하고 작품에 특정 태그 중 하나라도 포함되어 있다면, 비오리지널 작품이라도 다운로더는 필터링 시 해당 작품을 오리지널 작품으로 간주합니다.<br>
해당 태그는 다음과 같습니다:<br>
${Config.originalTags.join(',')}`,
    `Художник при публикации работы может указать, является ли она оригинальной.<br>
Если вы не включили «Слабое совпадение», этот фильтр будет строго соблюдать свойство оригинальности, установленное художником.<br>
<br>
Однако часто встречается ситуация: художник не отметил работу как оригинальную, но работа содержит теги, связанные с оригинальными работами.<br>
Если вы включили «Слабое совпадение» и работа содержит любой из указанных тегов, то даже если она неоригинальная, загрузчик при фильтрации будет считать её оригинальной.<br>
Эти теги:<br>
${Config.originalTags.join(',')}`,
  ],
  _它是原创作品: [
    `它是原创作品`,
    `它是原創作品`,
    `It is an original work`,
    `これはオリジナル作品です`,
    `이것은 오리지널 작품입니다`,
    `Это оригинальная работа`,
  ],
  _它是非原创作品: [
    `它是非原创作品`,
    `它是非原創作品`,
    `It is a non-original work`,
    `これは非オリジナル作品です`,
    `이것은 비오리지널 작품입니다`,
    `Это неоригинальная работа`,
  ],
  _抓取条件不正确: [
    `抓取条件不正确`,
    `抓取條件不正確`,
    `Crawl conditions are incorrect`,
    `クロール条件が正しくありません`,
    `크롤링 조건이 올바르지 않습니다`,
    `Условия краулинга неверны`,
  ],
  _取消抓取因为某些抓取条件不正确: [
    `❌取消抓取，因为某些抓取条件不正确`,
    `❌取消抓取，因為某些抓取條件不正確`,
    `❌Cancel crawling because some crawl conditions are incorrect`,
    `❌クロールをキャンセルしました。一部のクロール条件が正しくありません`,
    `❌크롤링 취소: 일부 크롤링 조건이 올바르지 않습니다`,
    `❌Краулинг отменён, поскольку некоторые условия краулинга некорректны`,
  ],
  _抓取线程为x: [
    `抓取线程：{}`,
    `抓取執行緒：{}`,
    `Crawl threads: {}`,
    `クロールスレッド数: {}`,
    `크롤링 스레드: {}`,
    `Потоков краулинга: {}`,
  ],
  _由于有系列小说所以抓取线程被限制为1: [
    `由于这次抓取的内容里含有系列小说，所以抓取线程被限制为 1，以避免同时发送太多请求。`,
    `由於這次抓取的內容裡含有系列小說，所以抓取執行緒被限制為 1，以避免同時發送太多請求。`,
    `Because the content of this crawl contains novel series, the crawl threads have been limited to 1 to avoid sending too many requests at the same time.`,
    `今回のクロール内容にシリーズ小説が含まれているため、同時リクエストが多すぎるのを避けるためクロールスレッドを1に制限しました。`,
    `이번 크롤링 내용에 시리즈 소설이 포함되어 있어 동시에 너무 많은 요청을 보내지 않도록 크롤링 스레드가 1로 제한되었습니다.`,
    `Поскольку содержимое этого краулинга включает серии романов, количество потоков краулинга было ограничено до 1, чтобы избежать отправки слишком большого количества запросов одновременно.`,
  ],
  _对于某种错误下载器会重试一定次数: [
    `对于 {} 错误，下载器会重试一定次数`,
    `對於 {} 錯誤，下載器會重試一定次數`,
    `For {} error, the downloader will retry a certain number of times`,
    `{} エラーの場合、ダウンロードツールは一定回数再試行します`,
    `{} 오류의 경우, 다운로더는 일정 횟수 재시도합니다`,
    `Для ошибки {} загрузчик выполнит повторные попытки определённое количество раз`,
  ],
  _跳过这个作品: [
    `跳过这个作品`,
    `跳過這個作品`,
    `Skip this work`,
    `この作品をスキップ`,
    `이 작품 건너뛰기`,
    `Пропустить эту работу`,
  ],
  _因为网络错误跳过这个作品: [
    `⏩因为网络错误跳过这个作品: {}`,
    `⏩因為網路錯誤跳過這個作品: {}`,
    `⏩Skipped this work due to network error: {}`,
    `⏩ネットワークエラーのためこの作品をスキップしました: {}`,
    `⏩네트워크 오류로 인해 이 작품을 건너뛰었습니다: {}`,
    `⏩Пропущена эта работа из-за сетевой ошибки: {}`,
  ],
  _移除文件名里的emoji: [
    `移除文件名里的 <span class="key">Emoji</span>`,
    `移除檔名裡的 <span class="key">Emoji</span>`,
    `Remove <span class="key">Emoji</span> from filename`,
    `ファイル名から <span class="key">Emoji</span> を削除`,
    `파일 이름에서 <span class="key">Emoji</span> 제거`,
    `Удалить <span class="key">Emoji</span> из имени файла`,
  ],
  _序号起始值: [
    `<span class="key">序号</span>的起始值`,
    `<span class="key">序號</span>的起始值`,
    `<span class="key">Serial number</span> starting value`,
    `<span class="key">番号</span>の開始値`,
    `<span class="key">일련번호</span> 시작값`,
    `<span class="key">Серийный номер</span> начальное значение`,
  ],
  _序号起始值的说明: [
    `设置图片的序号从 0 开始还是从 1 开始`,
    `設定圖片的序號從 0 開始還是從 1 開始`,
    `Set whether the image serial number starts from 0 or from 1`,
    `画像の連番を 0 から開始するか 1 から開始するかを設定`,
    `이미지 일련번호를 0부터 시작할지 1부터 시작할지 설정`,
    `Установить начальное значение порядкового номера изображения — с 0 или с 1`,
  ],
  _提示扩展名为jfif的问题: [
    `⚠️提示：下载器检测到下载的文件名以 .jfif 结尾。这其实是 .jpg 文件，但由于 Windows 在注册表里把 jpeg 文件的扩展名设置为了 .jfif，所以浏览器也会使用 .jfif 作为扩展名。<br>
如果你想解决这个问题，可以按 <span class="blue">Win</span> + <span class="blue">R</span> 键打开运行窗口，输入 <span class="blue">regedit</span> 并回车打开注册表编辑器，定位到 <span class="blue">HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</span>，把右侧的 <span class="blue">Extension</span> 的值从 <span class="blue">.jfif</span> 改成 <span class="blue">.jpg</span>，然后重启浏览器。`,
    `⚠️提示：下載器檢測到下載的檔名以 .jfif 結尾。這其實是 .jpg 檔案，但由於 Windows 在登錄檔裡把 jpeg 檔案的擴展名設定為了 .jfif，所以瀏覽器也會使用 .jfif 作為擴展名。<br>
如果你想解決這個問題，可以按 <span class="blue">Win</span> + <span class="blue">R</span> 鍵打開執行視窗，輸入 <span class="blue">regedit</span> 並按 Enter 打開登錄編輯器，定位到 <span class="blue">HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</span>，把右側的 <span class="blue">Extension</span> 的值從 <span class="blue">.jfif</span> 改成 <span class="blue">.jpg</span>，然後重新啟動瀏覽器。`,
    `⚠️Tip: The downloader detected that the downloaded filename ends with .jfif. This is actually a .jpg file, but because Windows has set the extension for jpeg files to .jfif in the registry, the browser also uses .jfif as the extension.<br>
If you want to solve this problem, press <span class="blue">Win</span> + <span class="blue">R</span> to open the Run window, enter <span class="blue">regedit</span> and press Enter to open the Registry Editor, navigate to <span class="blue">HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</span>, change the value of <span class="blue">Extension</span> on the right from <span class="blue">.jfif</span> to <span class="blue">.jpg</span>, then restart the browser.`,
    `⚠️ヒント：ダウンロードツールがダウンロードされたファイル名が .jfif で終わることを検出しました。これは実際には .jpg ファイルですが、Windows がレジストリで jpeg ファイルの拡張子を .jfif に設定しているため、ブラウザも .jfif を拡張子として使用します。<br>
この問題を解決したい場合は、<span class="blue">Win</span> + <span class="blue">R</span> キーを押して「実行」ウィンドウを開き、<span class="blue">regedit</span> と入力して Enter を押し、レジストリエディタを開きます。<span class="blue">HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</span> に移動し、右側の <span class="blue">Extension</span> の値を <span class="blue">.jfif</span> から <span class="blue">.jpg</span> に変更してから、ブラウザを再起動してください。`,
    `⚠️팁: 다운로더가 다운로드된 파일 이름이 .jfif로 끝나는 것을 감지했습니다. 이는 실제로 .jpg 파일이지만, Windows가 레지스트리에서 jpeg 파일의 확장자를 .jfif로 설정했기 때문에 브라우저도 .jfif를 확장자로 사용합니다.<br>
이 문제를 해결하려면 <span class="blue">Win</span> + <span class="blue">R</span> 키를 눌러 실행 창을 열고 <span class="blue">regedit</span>를 입력한 후 Enter를 눌러 레지스트리 편집기를 엽니다. <span class="blue">HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</span>로 이동하여 오른쪽의 <span class="blue">Extension</span> 값을 <span class="blue">.jfif</span>에서 <span class="blue">.jpg</span>로 변경한 다음 브라우저를 다시 시작하세요.`,
    `⚠️Подсказка: Загрузчик обнаружил, что имя загруженного файла заканчивается на .jfif. На самом деле это файл .jpg, но поскольку Windows в реестре установил расширение для файлов jpeg как .jfif, браузер также использует .jfif в качестве расширения.<br>
Если вы хотите решить эту проблему, нажмите <span class="blue">Win</span> + <span class="blue">R</span>, чтобы открыть окно «Выполнить», введите <span class="blue">regedit</span> и нажмите Enter, чтобы открыть редактор реестра, перейдите к <span class="blue">HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg</span>, измените значение <span class="blue">Extension</span> справа с <span class="blue">.jfif</span> на <span class="blue">.jpg</span>, затем перезапустите браузер.`,
  ],
  _图像作品: [
    `图像作品`,
    `圖像作品`,
    `Image works`,
    `画像作品`,
    `이미지 작품`,
    `Работы с изображениями`,
  ],
  _范围: [`范围`, `範圍`, `Range`, `範囲`, `범위`, `Диапазон`],
  _系列小说: [
    `系列小说`,
    `系列小說`,
    `Novel series`,
    `シリーズ小説`,
    `시리즈 소설`,
    `Серия романов`,
  ],
  _不抓取下载过的作品: [
    `不抓取<span class="key">下载过</span>的作品`,
    `不抓取<span class="key">下載過</span>的作品`,
    `Do not crawl <span class="key">already downloaded</span> works`,
    `<span class="key">ダウンロード済み</span>の作品をクロールしない`,
    `<span class="key">이미 다운로드한</span> 작품 크롤링 안 함`,
    `Не краулить <span class="key">уже скачанные</span> работы`,
  ],
  _不抓取下载过的作品的说明: [
    `如果下载器里有这个作品的下载记录，就不会抓取它。`,
    `如果下載器裡有這個作品的下載記錄，就不會抓取它。`,
    `If the downloader has a download record for this work, it will not be crawled.`,
    `ダウンロードツールにこの作品のダウンロード記録がある場合、クロールしません。`,
    `다운로더에 이 작품의 다운로드 기록이 있으면 크롤링하지 않습니다.`,
    `Если в загрузчике есть запись о скачивании этой работы, она не будет скраулена.`,
  ],
  _不抓取下载过的作品的帮助信息: [
    `该功能依赖下载器自己保存的下载记录。<br>如果你启用了该功能，那么下载器在抓取每个作品前会先检查它是否有下载记录，如果有就不抓取它。这样可以减少不必要的抓取，节约时间。<br>这个功能也有助于增量更新，因为你可以只抓取没有下载过的作品。<br><br>另外，在合并系列小说时，启用该设置可以跳过有下载记录的小说，只合并系列里新增的小说。不过需要注意的是，以前下载器在合并系列小说时不会保存每篇小说的下载记录，所以它们可能依然会被下载一次，之后就可以不再重复下载了。`,
    `該功能依賴下載器自己保存的下載記錄。<br>如果你啟用了該功能，那麼下載器在抓取每個作品前會先檢查它是否有下載記錄，如果有就不抓取它。這樣可以減少不必要的抓取，節約時間。<br>這個功能也有助於增量更新，因為你可以只抓取沒有下載過的作品。<br><br>另外，在合併系列小說時，啟用該設定可以跳過有下載記錄的小說，只合併系列裡新增的小說。不過需要注意的是，以前下載器在合併系列小說時不會保存每篇小說的下載記錄，所以它們可能依然會被下載一次，之後就可以不再重複下載了。`,
    `This feature relies on the download records saved by the downloader itself.<br>If you enable this feature, the downloader will first check whether each work has a download record before crawling it. If it does, it will not crawl it. This can reduce unnecessary crawling and save time.<br>This feature also helps with incremental updates, as you can crawl only works that have not been downloaded before.<br><br>Additionally, when merging series novels, enabling this setting allows skipping novels that have download records and only merging newly added novels in the series. However, note that previously the downloader did not save download records for each individual novel when merging series novels, so they may still be downloaded once, after which they will no longer be repeatedly downloaded.`,
    `この機能はダウンローダーが自身で保存したダウンロード記録に依存します。<br>この機能を有効にすると、ダウンローダーは各作品をクロールする前にダウンロード記録があるかどうかを最初に確認し、記録があればクロールしません。これにより不要なクローリングを減らし、時間を節約できます。<br>この機能は増分更新にも役立ちます。ダウンロードされていない作品のみをクロールできるためです。<br><br>また、シリーズ小説をマージする際、この設定を有効にすると、ダウンロード記録のある小説をスキップし、シリーズ内の新規追加された小説のみをマージできます。ただし、以前はダウンローダーがシリーズ小説をマージする際に各小説のダウンロード記録を保存していなかったため、それらが一度ダウンロードされる可能性があり、その後は繰り返しダウンロードされなくなります。`,
    `이 기능은 다운로더가 자체적으로 저장한 다운로드 기록에 의존합니다.<br>이 기능을 활성화하면 다운로더는 각 작품을 크롤링하기 전에 먼저 다운로드 기록이 있는지 확인하고, 기록이 있으면 크롤링하지 않습니다. 이렇게 하면 불필요한 크롤링을 줄이고 시간을 절약할 수 있습니다.<br>이 기능은 또한 증분 업데이트에 도움이 되며, 다운로드되지 않은 작품만 크롤링할 수 있기 때문입니다.<br><br>또한 시리즈 소설을 병합할 때 이 설정을 활성화하면 다운로드 기록이 있는 소설을 건너뛰고 시리즈에 새로 추가된 소설만 병합할 수 있습니다. 다만 이전에는 다운로더가 시리즈 소설을 병합할 때 각 소설의 다운로드 기록을 저장하지 않았기 때문에, 한 번 다운로드될 수 있으며 그 후에는 반복 다운로드되지 않습니다.`,
    `Эта функция зависит от записей загрузки, сохранённых самим загрузчиком.<br>Если вы включите эту функцию, загрузчик перед краулингом каждого произведения сначала проверит, есть ли у него запись о загрузке. Если есть — не будет его краулить. Это позволяет уменьшить ненужный краулинг и сэкономить время.<br>Эта функция также помогает с инкрементными обновлениями, поскольку вы можете краулить только те произведения, которые ещё не были загружены.<br><br>Кроме того, при объединении серийных новелл включение этой настройки позволяет пропускать новеллы с записями о загрузке и объединять только новые добавленные новеллы в серии. Однако следует отметить, что раньше загрузчик при объединении серийных новелл не сохранял записи о загрузке для каждой отдельной новеллы, поэтому они всё равно могут быть загружены один раз, после чего больше не будут повторно загружаться.`,
  ],
  _提示合并系列小说时可以跳过已合并的小说: [
    `💡提示：在合并系列小说时，如果你启用了“不抓取下载过的作品”，下载器会跳过有下载记录的小说，只合并没有下载记录的小说。<br>从 18.7.0 版本（2026 年 4 月）开始，当你合并系列小说时，下载器会为里面的每篇小说都生成下载记录（就像你单独下载过它们一样）。所以当你再次合并同一个系列时，如果启用了“不抓取下载过的作品”，下载器就可以跳过以前合并过的小说，只合并新增的小说。`,
    `💡提示：在合併系列小說時，如果你啟用了「不抓取下載過的作品」，下載器會跳過有下載記錄的小說，只合並沒有下載記錄的小說。<br>從 18.7.0 版本（2026 年 4 月）開始，當你合併系列小說時，下載器會為裡面的每篇小說都生成下載記錄（就像你單獨下載過它們一樣）。所以當你再次合併同一個系列時，如果啟用了「不抓取下載過的作品」，下載器就可以跳過以前合併過的小說，只合併新增的小說。`,
    `💡Tip: When merging series novels, if you have enabled "Do not crawl downloaded works", the downloader will skip novels that have download records and only merge novels that do not have download records.<br>Starting from version 18.7.0 (April 2026), when you merge series novels, the downloader will generate download records for every novel inside (as if you had downloaded them individually). So when you merge the same series again, if "Do not crawl downloaded works" is enabled, the downloader can skip previously merged novels and only merge newly added novels.`,
    `💡ヒント: シリーズ小説をマージする際、「ダウンロード済みの作品をクロールしない」を有効にしている場合、ダウンローダーはダウンロード記録のある小説をスキップし、ダウンロード記録のない小説のみをマージします。<br>バージョン 18.7.0（2026年4月）以降、シリーズ小説をマージする際、ダウンローダーは内部の各小説に対してダウンロード記録を生成します（個別にダウンロードしたかのように）。したがって、同じシリーズを再度マージする際、「ダウンロード済みの作品をクロールしない」が有効であれば、以前にマージした小説をスキップし、新しく追加された小説のみをマージできます。`,
    `💡팁: 시리즈 소설을 병합할 때 "다운로드된 작품을 크롤링하지 않음"을 활성화한 경우, 다운로더는 다운로드 기록이 있는 소설을 건너뛰고 다운로드 기록이 없는 소설만 병합합니다.<br>18.7.0 버전(2026년 4월)부터 시리즈 소설을 병합할 때 다운로더는 내부의 모든 소설에 대해 다운로드 기록을 생성합니다(개별적으로 다운로드한 것처럼). 따라서 동일한 시리즈를 다시 병합할 때 "다운로드된 작품을 크롤링하지 않음"이 활성화되어 있으면 이전에 병합한 소설을 건너뛰고 새로 추가된 소설만 병합할 수 있습니다.`,
    `💡Подсказка: При объединении серийных новелл, если вы включили «Не краулить загруженные работы», загрузчик пропустит новеллы с записями о загрузке и объединит только новеллы без записей о загрузке.<br>Начиная с версии 18.7.0 (апрель 2026), при объединении серийных новелл загрузчик будет генерировать запись о загрузке для каждой новеллы внутри (как будто вы скачали их по отдельности). Поэтому при повторном объединении той же серии, если включено «Не краулить загруженные работы», загрузчик сможет пропустить ранее объединённые новеллы и объединить только новые добавленные новеллы.`,
  ],
  _在已下载的作品上显示边框: [
    `在已下载的作品上显示<span class="key">边框</span>`,
    `在已下載的作品上顯示<span class="key">邊框</span>`,
    `Show <span class="key">border</span> on downloaded works`,
    `ダウンロード済みの作品に<span class="key">枠</span>を表示`,
    `다운로드된 작품에 <span class="key">테두리</span> 표시`,
    `Показывать <span class="key">рамку</span> на загруженных работах`,
  ],
  _颜色Hex颜色: [
    `颜色(Hex 颜色）`,
    `顏色(Hex 顏色）`,
    `Color (Hex color)`,
    `色（Hex カラー）`,
    `색상 (Hex 색상)`,
    `Цвет (Hex цвет)`,
  ],
  _颜色: [`颜色`, `顏色`, `Color`, `色`, `색상`, `Цвет`],
  _管理下载记录: [
    `管理下载<span class="key">记录</span>`,
    `管理下載<span class="key">記錄</span>`,
    `Manage download <span class="key">records</span>`,
    `ダウンロード<span class="key">記録</span>の管理`,
    `다운로드 <span class="key">기록</span> 관리`,
    `Управление записями <span class="key">загрузки</span>`,
  ],
  _管理下载记录的提示: [
    `这里的下载记录指的是下载器保存的自己的下载记录，而非浏览器的下载记录。每当你使用下载器成功下载一个作品时，就会产生一条下载记录。每条记录会保存该作品的 ID、上传日期、文件名。<br>下载器的一些功能依赖下载记录，例如：不抓取下载过的作品、不下载重复文件、在已下载的作品上显示边框。<br><br>按钮：<br>- 导出：点击该按钮可以导出下载器的下载记录，这样可以备份下载记录，也可以在其他浏览器里导入以同步下载记录。<br>- 导入：点击该按钮可以选择之前导出的下载记录文件，合并到已有的下载记录里。如果有必要，你也可以为硬盘上已下载的文件制作一份下载记录，然后导入。具体方法可以点击该设置的名字，在 Wiki 查看详细说明。<br>- 清除：点击该按钮可以清空下载器的下载记录。<br><br>补充说明：<br>- 下载器的下载记录保存在浏览器的 IndexedDB 里。清除浏览器的下载记录不会影响下载器的下载记录，所以你可以放心清除浏览器的下载记录。<br>- <strong>注意：</strong>当你清除浏览器的数据时，清除“Cookie 及其他网站数据”会导致下载器的下载记录被清空！如果有必要，你可以在清理数据之前导出下载器的下载记录，之后再导入。<br>- 这不是一个可靠的功能。下载器没有权限读取硬盘上的文件，只能依赖自己保存的下载记录。如果你把下载过的文件删除了，下载器是不会知道的，依然会认为文件下载过。在这种情况下，依赖下载记录的功能可能会产生误判，所以你可以视情况关闭这些功能。`,
    `這裡的下載記錄指的是下載器保存的自己的下載記錄，而非瀏覽器的下載記錄。每當你使用下載器成功下載一個作品時，就會產生一條下載記錄。每條記錄會保存該作品的 ID、上傳日期、檔名。<br>下載器的一些功能依賴下載記錄，例如：不抓取下載過的作品、不下載重複檔案、在已下載的作品上顯示邊框。<br><br>按鈕：<br>- 匯出：點擊該按鈕可以匯出下載器的下載記錄，這樣可以備份下載記錄，也可以在其他瀏覽器裡匯入以同步下載記錄。<br>- 匯入：點擊該按鈕可以選擇之前匯出的下載記錄檔案，合併到已有的下載記錄裡。如果有必要，你也可以為硬碟上已下載的檔案製作一份下載記錄，然後匯入。具體方法可以點擊該設定的名字，在 Wiki 查看詳細說明。<br>- 清除：點擊該按鈕可以清空下載器的下載記錄。<br><br>補充說明：<br>- 下載器的下載記錄保存在瀏覽器的 IndexedDB 裡。清除瀏覽器的下載記錄不會影響下載器的下載記錄，所以你可以放心清除瀏覽器的下載記錄。<br>- <strong>注意：</strong>當你清除瀏覽器的數據時，清除「Cookie 及其他網站數據」會導致下載器的下載記錄被清空！如果有必要，你可以在清理數據之前匯出下載器的下載記錄，之後再匯入。<br>- 這不是一個可靠的功能。下載器沒有權限讀取硬碟上的檔案，只能依賴自己保存的下載記錄。如果你把下載過的檔案刪除了，下載器是不會知道的，依然會認為檔案下載過。在這種情況下，依賴下載記錄的功能可能會產生誤判，所以你可以視情況關閉這些功能。`,
    `The download records here refer to the downloader's own saved download records, not the browser's download history. Every time you successfully download a work using the downloader, a download record is created. Each record saves the work's ID, upload date, and filename.<br>Some features of the downloader rely on download records, such as: Do not crawl downloaded works, Do not download duplicate files, Show border on downloaded works.<br><br>Buttons:<br>- Export: Click this button to export the downloader's download records. This allows you to back up the records or import them in another browser to sync the download records.<br>- Import: Click this button to select a previously exported download record file and merge it into the existing download records. If necessary, you can also create a download record for files already downloaded on your hard drive and then import it. For the specific method, click the name of this setting and check the detailed instructions in the Wiki.<br>- Clear: Click this button to clear the downloader's download records.<br><br>Additional notes:<br>- The downloader's download records are stored in the browser's IndexedDB. Clearing the browser's download history will not affect the downloader's download records, so you can safely clear the browser's download history.<br>- <strong>Note:</strong> When you clear browser data, clearing "Cookies and other site data" will cause the downloader's download records to be cleared! If necessary, you can export the downloader's download records before cleaning the data and import them afterward.<br>- This is not a reliable feature. The downloader does not have permission to read files on the hard drive and can only rely on its own saved download records. If you delete downloaded files, the downloader will not know and will still consider the files as downloaded. In this case, features that rely on download records may produce false judgments, so you can turn off these features as needed.`,
    `ここでのダウンロード記録とは、ダウンローダーが保存した自身のダウンロード記録を指し、ブラウザのダウンロード履歴ではありません。ダウンローダーを使用して作品を正常にダウンロードするたびに、ダウンロード記録が生成されます。各記録には作品の ID、アップロード日、ファイル名が保存されます。<br>ダウンローダーの一部の機能はダウンロード記録に依存しています。例えば：ダウンロード済みの作品をクロールしない、重複ファイルをダウンロードしない、ダウンロード済みの作品に枠を表示。<br><br>ボタン：<br>- エクスポート：このボタンをクリックすると、ダウンローダーのダウンロード記録をエクスポートできます。これにより記録をバックアップしたり、他のブラウザにインポートしてダウンロード記録を同期したりできます。<br>- インポート：このボタンをクリックすると、以前にエクスポートしたダウンロード記録ファイルを選択し、既存のダウンロード記録にマージできます。必要に応じて、ハードディスク上にすでにダウンロードされているファイル用のダウンロード記録を作成してインポートすることもできます。具体的な方法は、この設定の名前をクリックして Wiki の詳細説明を確認してください。<br>- クリア：このボタンをクリックすると、ダウンローダーのダウンロード記録を消去できます。<br><br>補足説明：<br>- ダウンローダーのダウンロード記録はブラウザの IndexedDB に保存されます。ブラウザのダウンロード履歴を消去してもダウンローダーのダウンロード記録には影響しないので、ブラウザのダウンロード履歴を安心して消去できます。<br>- <strong>注意：</strong>ブラウザのデータを消去する際、「Cookie およびその他のサイトデータ」を消去すると、ダウンローダーのダウンロード記録が消去されます！必要に応じて、データをクリアする前にダウンローダーのダウンロード記録をエクスポートし、後でインポートしてください。<br>- これは信頼できる機能ではありません。ダウンローダーはハードディスク上のファイルを読み取る権限がなく、自分で保存したダウンロード記録にのみ依存します。ダウンロード済みのファイルを削除した場合、ダウンローダーはそれを知らず、依然としてファイルがダウンロードされたとみなします。この場合、ダウンロード記録に依存する機能が誤った判断をする可能性があるため、必要に応じてこれらの機能をオフにしてください。`,
    `여기서의 다운로드 기록은 다운로더가 저장한 자체 다운로드 기록을 의미하며, 브라우저의 다운로드 기록이 아닙니다. 다운로더를 사용하여 작품을 성공적으로 다운로드할 때마다 다운로드 기록이 생성됩니다. 각 기록에는 해당 작품의 ID, 업로드 날짜, 파일명이 저장됩니다.<br>다운로더의 일부 기능은 다운로드 기록에 의존합니다. 예: 다운로드된 작품을 크롤링하지 않음, 중복 파일 다운로드하지 않음, 다운로드된 작품에 테두리 표시.<br><br>버튼:<br>- 내보내기: 이 버튼을 클릭하면 다운로더의 다운로드 기록을 내보낼 수 있습니다. 이렇게 하면 기록을 백업하거나 다른 브라우저에서 가져와 다운로드 기록을 동기화할 수 있습니다.<br>- 가져오기: 이 버튼을 클릭하면 이전에 내보낸 다운로드 기록 파일을 선택하여 기존 다운로드 기록에 병합할 수 있습니다. 필요하다면 하드 디스크에 이미 다운로드된 파일에 대한 다운로드 기록을 만들어 가져올 수도 있습니다. 구체적인 방법은 이 설정 이름을 클릭하여 Wiki에서 자세한 설명을 확인하세요.<br>- 지우기: 이 버튼을 클릭하면 다운로더의 다운로드 기록을 지울 수 있습니다.<br><br>추가 설명:<br>- 다운로더의 다운로드 기록은 브라우저의 IndexedDB에 저장됩니다. 브라우저의 다운로드 기록을 지워도 다운로더의 다운로드 기록에는 영향을 주지 않으므로 브라우저 다운로드 기록을 안심하고 지울 수 있습니다.<br>- <strong>주의:</strong> 브라우저 데이터를 지울 때 "쿠키 및 기타 사이트 데이터"를 지우면 다운로더의 다운로드 기록이 지워집니다! 필요하다면 데이터를 정리하기 전에 다운로더의 다운로드 기록을 내보내고 나중에 가져오세요.<br>- 이는 신뢰할 수 있는 기능이 아닙니다. 다운로더는 하드 디스크의 파일을 읽을 권한이 없으며, 자신이 저장한 다운로드 기록에만 의존합니다. 다운로드한 파일을 삭제하면 다운로더는 이를 알지 못하고 여전히 파일이 다운로드된 것으로 간주합니다. 이 경우 다운로드 기록에 의존하는 기능이 오판할 수 있으므로, 필요에 따라 이러한 기능을 끌 수 있습니다.`,
    `Здесь под записями загрузки подразумеваются собственные записи загрузки, сохранённые загрузчиком, а не история загрузок браузера. Каждый раз, когда вы успешно загружаете произведение с помощью загрузчика, создаётся одна запись загрузки. Каждая запись сохраняет ID произведения, дату загрузки и имя файла.<br>Некоторые функции загрузчика зависят от записей загрузки, например: не краулить загруженные работы, не загружать повторяющиеся файлы, показывать рамку на загруженных работах.<br><br>Кнопки:<br>- Экспорт: нажатие этой кнопки позволяет экспортировать записи загрузки загрузчика, что позволяет создавать резервную копию записей или импортировать их в другом браузере для синхронизации записей загрузки.<br>- Импорт: нажатие этой кнопки позволяет выбрать ранее экспортированный файл записей загрузки и объединить его с существующими записями. При необходимости вы также можете создать запись загрузки для уже загруженных на жёсткий диск файлов и импортировать её. Подробный способ можно узнать, нажав на название этой настройки и проверив подробные инструкции в Wiki.<br>- Очистить: нажатие этой кнопки позволяет очистить записи загрузки загрузчика.<br><br>Дополнительные пояснения:<br>- Записи загрузки загрузчика хранятся в IndexedDB браузера. Очистка истории загрузок браузера не влияет на записи загрузки загрузчика, поэтому вы можете спокойно очищать историю загрузок браузера.<br>- <strong>Внимание:</strong> При очистке данных браузера очистка «Cookies и другие данные сайтов» приведёт к удалению записей загрузки загрузчика! При необходимости вы можете экспортировать записи загрузки загрузчика перед очисткой данных, а затем импортировать их обратно.<br>- Это не надёжная функция. Загрузчик не имеет разрешения на чтение файлов на жёстком диске и может полагаться только на свои собственные сохранённые записи загрузки. Если вы удалите загруженные файлы, загрузчик об этом не узнает и по-прежнему будет считать, что файлы загружены. В таком случае функции, зависящие от записей загрузки, могут давать ложные срабатывания, поэтому вы можете отключить эти функции по мере необходимости.`,
  ],
  _缩略图上按钮的位置: [
    `缩略图上按钮的<span class="key">位置</span>`,
    `縮略圖上按鈕的<span class="key">位置</span>`,
    `Button <span class="key">position</span> on thumbnails`,
    `サムネイル上のボタンの<span class="key">位置</span>`,
    `썸네일에 있는 버튼의 <span class="key">위치</span>`,
    `Позиция <span class="key">кнопок</span> на миниатюрах`,
  ],
  _缩略图上按钮的位置的说明: [
    `下载器会在作品缩略图上显示一些按钮，你可以设置它们显示在缩略图的左侧还是右侧。`,
    `下載器會在作品縮略圖上顯示一些按鈕，你可以設定它們顯示在縮略圖的左側還是右側。`,
    `The downloader will display some buttons on the work thumbnails. You can set whether they appear on the left or right side of the thumbnail.`,
    `ダウンローダーは作品のサムネイル上にいくつかのボタンを表示します。サムネイルの左側または右側に表示するかを設定できます。`,
    `다운로더는 작품 썸네일에 일부 버튼을 표시하며, 썸네일의 왼쪽 또는 오른쪽에 표시되도록 설정할 수 있습니다.`,
    `Загрузчик будет отображать некоторые кнопки на миниатюрах произведений. Вы можете настроить, будут ли они отображаться слева или справа от миниатюры.`,
  ],
  _左侧: [`左侧`, `左側`, `Left`, `左側`, `왼쪽`, `Левая сторона`],
  _右侧: [`右侧`, `右側`, `Right`, `右側`, `오른쪽`, `Правая сторона`],
  _多图作品不抓取后几张图片: [
    `多图作品不抓取<span class="key">后几张</span>图片`,
    `多圖作品不抓取<span class="key">後幾張</span>圖片`,
    `Do not crawl the <span class="key">last few</span> images of multi-image works`,
    `複数画像作品で<span class="key">後ろの数枚</span>の画像をクロールしない`,
    `다중 이미지 작품에서 <span class="key">뒤의 몇 장</span> 이미지를 크롤링하지 않음`,
    `Не краулить <span class="key">последние несколько</span> изображений в многоизображных работах`,
  ],
  _多图作品不抓取后几张图片的说明: [
    `常见的使用场景：有些画师的作品的最后一张或几张图片是宣传图，或者是有马赛克的图片。如果你不想抓取这些图片，可以使用这个设置来排除最后一张或多张图片。<br><br>
注意：如果你设置的数字大于作品里的图片数量，那么下载器会保留第一张图片，而非排除整个作品。<br><br>
多图作品只抓取、不抓取前/后几张图片的条件可以同时使用。不抓取的优先级更高：如果一张图片同时满足两种条件，下载器不会抓取它。`,
    `常見的使用場景：有些繪師作品的最後一張或幾張圖片是宣傳圖，或者是有馬賽克的圖片。如果你不想抓取這些圖片，可以使用這個設定來排除最後一張或多張圖片。<br><br>
注意：如果你設定的數字大於作品裡的圖片數量，那麼下載器會保留第一張圖片，而不是排除整個作品。<br><br>
多圖作品只抓取、不抓取前/後幾張圖片的條件可以同時使用。不抓取的優先級更高：如果一張圖片同時符合兩種條件，下載器不會抓取它。`,
    `Common use cases: in some artists' works, the last image or last few images are promotional images, or images with mosaic censorship. If you do not want to crawl those images, you can use this setting to exclude the last one or several images.<br><br>
Note: if the number you set is greater than the number of images in the work, the downloader will keep the first image instead of excluding the entire work.<br><br>
The conditions "only crawl the first/last few images" and "do not crawl the first/last few images" for multi-image works can be used at the same time. "Do not crawl" has higher priority: if an image matches both conditions, the downloader will not crawl it.`,
    `よくある使用場面: 作品によっては、最後の1枚または数枚の画像が宣伝画像だったり、モザイク入りの画像だったりします。こうした画像をクロールしたくない場合は、この設定で最後の1枚または複数枚の画像を除外できます。<br><br>
注意: 設定した数字が作品内の画像数より多い場合、ダウンローダーは作品全体を除外せず、最初の1枚を残します。<br><br>
複数画像作品で"最初/最後の数枚だけをクロールする"条件と、"最初/最後の数枚をクロールしない"条件は同時に使えます。"クロールしない"方が優先されるため、1枚の画像が両方の条件に当てはまる場合、その画像はクロールされません。`,
    `자주 있는 사용 상황: 어떤 작가의 작품은 마지막 한 장이나 몇 장의 이미지가 홍보용 이미지이거나 모자이크가 있는 이미지일 수 있습니다. 이런 이미지를 크롤링하고 싶지 않다면 이 설정으로 마지막 한 장 또는 여러 장의 이미지를 제외할 수 있습니다.<br><br>
주의: 설정한 숫자가 작품 안의 이미지 수보다 크면 다운로더는 작품 전체를 제외하지 않고 첫 번째 이미지를 남깁니다.<br><br>
여러 장의 이미지가 있는 작품에서 "앞/뒤 몇 장만 크롤링" 조건과 "앞/뒤 몇 장은 크롤링하지 않음" 조건은 동시에 사용할 수 있습니다. "크롤링하지 않음"의 우선순위가 더 높습니다. 즉, 어떤 이미지가 두 조건을 모두 만족하면 다운로더는 그 이미지를 크롤링하지 않습니다.`,
    `Частый сценарий использования: у некоторых художников последние одно или несколько изображений в work являются рекламными изображениями или изображениями с мозаичной цензурой. Если вы не хотите обрабатывать такие изображения, используйте эту настройку, чтобы исключить последнее одно или несколько изображений.<br><br>
Обратите внимание: если указанное вами число больше количества изображений в work, загрузчик сохранит первое изображение, а не исключит весь work целиком.<br><br>
Условия "обрабатывать только первые/последние несколько изображений" и "не обрабатывать первые/последние несколько изображений" для work с несколькими изображениями можно использовать одновременно. У "не обрабатывать" приоритет выше: если изображение одновременно подходит под оба условия, загрузчик не будет его обрабатывать.`,
  ],
  _多图作品不抓取前几张图片: [
    `多图作品不抓取<span class="key">前几张</span>图片`,
    `多圖作品不抓取<span class="key">前幾張</span>圖片`,
    `Do not crawl the <span class="key">first few</span> images of multi-image works`,
    `複数画像作品で<span class="key">最初の数枚</span>の画像をクロールしない`,
    `다중 이미지 작품에서 <span class="key">앞의 몇 장</span> 이미지를 크롤링하지 않음`,
    `Не краулить <span class="key">первые несколько</span> изображений в многоизображных работах`,
  ],
  _多图作品不抓取前几张图片的说明: [
    `常见的使用场景：有些画师的作品的第一张图片有文字，第二张没有文字；或者第一张是全年龄的，第二张是 R-18 的。如果你想跳过第一张，从第二张开始抓取，就可以启用这个设置。<br><br>
注意：如果你设置的数字大于作品里的图片数量，那么下载器会保留最后一张图片，而非排除整个作品。<br><br>
多图作品只抓取、不抓取前/后几张图片的条件可以同时使用。不抓取的优先级更高：如果一张图片同时满足两种条件，下载器不会抓取它。`,
    `常見的使用場景：有些繪師作品的第一張圖片有文字，第二張沒有文字；或者第一張是全年齡，第二張是 R-18。如果你想跳過第一張，從第二張開始抓取，就可以啟用這個設定。<br><br>
注意：如果你設定的數字大於作品裡的圖片數量，那麼下載器會保留最後一張圖片，而不是排除整個作品。<br><br>
多圖作品只抓取、不抓取前/後幾張圖片的條件可以同時使用。不抓取的優先級更高：如果一張圖片同時符合兩種條件，下載器不會抓取它。`,
    `Common use cases: some artists make works where the first image has text and the second image does not; or the first image is all-ages and the second is R-18. If you want to skip the first image and start crawling from the second one, you can enable this setting.<br><br>
Note: if the number you set is greater than the number of images in the work, the downloader will keep the last image instead of excluding the entire work.<br><br>
The conditions "only crawl the first/last few images" and "do not crawl the first/last few images" for multi-image works can be used at the same time. "Do not crawl" has higher priority: if an image matches both conditions, the downloader will not crawl it.`,
    `よくある使用場面: 作品によっては、1枚目の画像には文字が入っていて、2枚目には入っていないことがあります。あるいは、1枚目は全年齢で、2枚目はR-18の場合もあります。1枚目を飛ばして2枚目からクロールしたいときは、この設定を有効にしてください。<br><br>
注意: 設定した数字が作品内の画像数より多い場合、ダウンローダーは作品全体を除外せず、最後の1枚を残します。<br><br>
複数画像作品で"最初/最後の数枚だけをクロールする"条件と、"最初/最後の数枚をクロールしない"条件は同時に使えます。"クロールしない"方が優先されるため、1枚の画像が両方の条件に当てはまる場合、その画像はクロールされません。`,
    `자주 있는 사용 상황: 어떤 작가의 작품은 첫 번째 이미지에는 글자가 있고 두 번째 이미지에는 없을 수 있습니다. 또는 첫 번째 이미지는 전체이용가이고 두 번째 이미지는 R-18일 수도 있습니다. 첫 번째 이미지를 건너뛰고 두 번째 이미지부터 크롤링하고 싶다면 이 설정을 켜면 됩니다.<br><br>
주의: 설정한 숫자가 작품 안의 이미지 수보다 크면 다운로더는 작품 전체를 제외하지 않고 마지막 이미지를 남깁니다.<br><br>
여러 장의 이미지가 있는 작품에서 "앞/뒤 몇 장만 크롤링" 조건과 "앞/뒤 몇 장은 크롤링하지 않음" 조건은 동시에 사용할 수 있습니다. "크롤링하지 않음"의 우선순위가 더 높습니다. 즉, 어떤 이미지가 두 조건을 모두 만족하면 다운로더는 그 이미지를 크롤링하지 않습니다.`,
    `Частый сценарий использования: у некоторых художников в work на первом изображении есть текст, а на втором нет; или первое изображение для всех возрастов, а второе уже R-18. Если вы хотите пропустить первое изображение и начать обработку со второго, включите эту настройку.<br><br>
Обратите внимание: если указанное вами число больше количества изображений в work, загрузчик сохранит последнее изображение, а не исключит весь work целиком.<br><br>
Условия "обрабатывать только первые/последние несколько изображений" и "не обрабатывать первые/последние несколько изображений" для work с несколькими изображениями можно использовать одновременно. У "не обрабатывать" приоритет выше: если изображение одновременно подходит под оба условия, загрузчик не будет его обрабатывать.`,
  ],
  _多图作品只抓取前几张图片: [
    `多图作品只抓取<span class="key">前几张</span>图片`,
    `多圖作品只抓取<span class="key">前幾張</span>圖片`,
    `Only crawl the <span class="key">first few</span> images of multi-image works`,
    `マルチ画像作品は<span class="key">最初の数枚</span>の画像のみクロールします`,
    `멀티 이미지 작품은 <span class="key">처음 몇 장</span> 이미지만 크롤링합니다`,
    `Многоизображные работы загружают только <span class="key">первые несколько</span> изображений`,
  ],
  _多图作品只抓取前几张图片的说明: [
    `常见的使用场景：如果你不想从多图作品里下载太多图片，或者你觉得第一张图片最有价值，就可以启用这个设置。<br><br>
    提示：两个“只抓取”条件可以同时使用，此时图片只要满足其中一个条件就会保留。这样你可以跳过中间的图片，只下载首尾的图片。`,
    `常見的使用場景：如果你不想從多圖作品裡下載太多圖片，或者你覺得第一張圖片最有價值，就可以啟用這個設定。<br><br>
    提示：兩個「只抓取」條件可以同時使用，此時圖片只要滿足其中一個條件就會保留。這樣你可以跳過中間的圖片，只下載首尾的圖片。`,
    `Common usage scenarios: If you don't want to download too many images from multi-image works, or if you think the first image is the most valuable, you can enable this setting.<br><br>
    Tip: The two "Only crawl" conditions can be used simultaneously. In this case, an image will be kept as long as it meets either condition. This allows you to skip the middle images and only download the first and last images.`,
    `よくある使用シーン：多画像作品からあまり多くの画像をダウンロードしたくない場合、または最初の画像が最も価値があると思う場合は、この設定を有効にできます。<br><br>
    ヒント：2つの「のみクロール」条件を同時に使用できます。この場合、画像はいずれかの条件を満たしていれば保持されます。これにより、中間の画像をスキップして、最初と最後の画像のみをダウンロードできます。`,
    `일반적인 사용 시나리오: 다중 이미지 작품에서 너무 많은 이미지를 다운로드하고 싶지 않거나 첫 번째 이미지가 가장 가치 있다고 생각한다면 이 설정을 활성화할 수 있습니다.<br><br>
    팁: 두 "오직 크롤링" 조건을 동시에 사용할 수 있습니다. 이 경우 이미지는 어느 한 조건을 만족하면 유지됩니다. 이렇게 하면 중간 이미지를 건너뛰고 처음과 마지막 이미지만 다운로드할 수 있습니다.`,
    `Распространённые сценарии использования: Если вы не хотите скачивать слишком много изображений из многоизображных работ или считаете, что первая картинка наиболее ценная, вы можете включить эту настройку.<br><br>
    Подсказка: Два условия «Краулить только» можно использовать одновременно. В этом случае изображение будет сохранено, если оно удовлетворяет хотя бы одному из условий. Таким образом вы можете пропустить средние изображения и скачать только первые и последние.`,
  ],
  _多图作品只抓取后几张图片: [
    `多图作品只抓取<span class="key">后几张</span>图片`,
    `多圖作品只抓取<span class="key">後幾張</span>圖片`,
    `Only crawl the <span class="key">last few</span> images of multi-image works`,
    `複数画像作品で<span class="key">後ろの数枚</span>の画像のみをクロール`,
    `다중 이미지 작품에서 <span class="key">뒤의 몇 장</span> 이미지만 크롤링`,
    `Краулить только <span class="key">последние несколько</span> изображений в многоизображных работах`,
  ],
  _多图作品只抓取后几张图片的说明: [
    `常见的使用场景：一些用户在发布恋活（Koikatsu）等游戏的人物卡或场景卡时，前面的图片都是截图展示，最后一张才是包含数据的卡片。你可以启用这个设置只抓取最后一张或多张图片。<br><br>
    提示：两个“只抓取”条件可以同时使用，此时图片只要满足其中一个条件就会保留。这样你可以跳过中间的图片，只下载首尾的图片。`,
    `常見的使用場景：一些用戶在發佈戀活（Koikatsu）等遊戲的人物卡或場景卡時，前面的圖片都是截圖展示，最後一張才是包含數據的卡片。你可以啟用這個設定只抓取最後一張或多張圖片。<br><br>
    提示：兩個「只抓取」條件可以同時使用，此時圖片只要滿足其中一個條件就會保留。這樣你可以跳過中間的圖片，只下載首尾的圖片。`,
    `Common usage scenarios: When some users post character cards or scene cards for games such as Koikatsu, the preceding images are all screenshots for display, and only the last image contains the actual data card. You can enable this setting to crawl only the last one or more images.<br><br>
    Tip: The two "Only crawl" conditions can be used simultaneously. In this case, an image will be kept as long as it meets either condition. This allows you to skip the middle images and only download the first and last images.`,
    `よくある使用シーン：一部のユーザーがKoikatsuなどのゲームのキャラクタカードやシーンのカードを投稿する際、前の画像はすべてスクリーンショットによる展示で、最後の1枚だけがデータを含むカードです。この設定を有効にすると、最後の1枚または複数枚の画像のみをクロールできます。<br><br>
    ヒント：2つの「のみクロール」条件を同時に使用できます。この場合、画像はいずれかの条件を満たしていれば保持されます。これにより、中間の画像をスキップして、最初と最後の画像のみをダウンロードできます。`,
    `일반적인 사용 시나리오: 일부 사용자가 Koikatsu 등의 게임 캐릭터 카드나 장면 카드를 게시할 때 앞의 이미지는 모두 스크린샷 전시이고 마지막 한 장만이 데이터를 포함한 카드입니다. 이 설정을 활성화하면 마지막 한 장 또는 여러 장의 이미지만 크롤링할 수 있습니다.<br><br>
    팁: 두 "오직 크롤링" 조건을 동시에 사용할 수 있습니다. 이 경우 이미지는 어느 한 조건을 만족하면 유지됩니다. 이렇게 하면 중간 이미지를 건너뛰고 처음과 마지막 이미지만 다운로드할 수 있습니다.`,
    `Распространённые сценарии использования: Когда некоторые пользователи публикуют карточки персонажей или сцен для игр вроде Koikatsu, предыдущие изображения — это все скриншоты для демонстрации, а только последняя картинка содержит саму карточку с данными. Вы можете включить эту настройку, чтобы краулить только последнюю одну или несколько картинок.<br><br>
    Подсказка: Два условия «Краулить только» можно использовать одновременно. В этом случае изображение будет сохранено, если оно удовлетворяет хотя бы одному из условий. Таким образом вы можете пропустить средние изображения и скачать только первые и последние.`,
  ],
  _设置的值不正确需要是数字: [
    `设置的值不正确，需要是数字：`,
    `設定的值不正確，需要是數字：`,
    `The setting value is incorrect, it must be a number:`,
    `設定値が正しくありません。数字である必要があります：`,
    `설정 값이 올바르지 않습니다. 숫자여야 합니다:`,
    `Значение настройки неверно, оно должно быть числом:`,
  ],
  _设置的值不正确需要是数组: [
    `设置的值不正确，需要是数组：`,
    `設定的值不正確，需要是陣列：`,
    `The setting value is incorrect, it must be an array:`,
    `設定値が正しくありません。配列である必要があります：`,
    `설정 값이 올바르지 않습니다. 배열이어야 합니다:`,
    `Значение настройки неверно, оно должно быть массивом:`,
  ],
  _日期和时间的值不正确: [
    `日期和时间的值不正确：`,
    `日期和時間的值不正確：`,
    `The date and time value is incorrect:`,
    `日付と時刻の値が正しくありません：`,
    `날짜와 시간 값이 올바르지 않습니다:`,
    `Значение даты и времени неверно:`,
  ],
  _置顶: [
    `置顶`,
    `置頂`,
    `Pin to top`,
    `トップに固定`,
    `상단 고정`,
    `Закрепить сверху`,
  ],
  _提示可以置顶选项: [
    `你可以置顶自己常用的选项，它们会显示在选项卡的顶部，并且即使未启用“显示高级设置”也会始终显示。方法 1: 把鼠标指针放到选项上，然后点击左侧的置顶图标。方法 2: 长按选项名称 0.5 秒。`,
    `你可以置頂自己常用的選項，它們會顯示在選項卡的頂部，並且即使未啟用「顯示高級設定」也會始終顯示。方法 1: 把滑鼠指標放到選項上，然後點擊左側的置頂圖示。方法 2: 長按選項名稱 0.5 秒。`,
    `You can pin your frequently used options to the top. They will appear at the top of the options tab and will always be displayed even if "Show advanced settings" is not enabled. Method 1: Hover the mouse pointer over the option, then click the pin icon on the left. Method 2: Long press the option name for 0.5 seconds.`,
    `よく使うオプションをトップに固定できます。これらは設定タブの最上部に表示され、「高度な設定を表示」が有効になっていなくても常に表示されます。方法 1: マウスカーソルをオプションに合わせ、左側のピンアイコンをクリックします。方法 2: オプション名を0.5秒長押しします。`,
    `자주 사용하는 옵션을 상단에 고정할 수 있습니다. 이 옵션들은 옵션 탭의 맨 위에 표시되며, "고급 설정 표시"가 활성화되지 않았더라도 항상 표시됩니다. 방법 1: 마우스 포인터를 옵션 위에 올린 후 왼쪽의 고정 아이콘을 클릭하세요. 방법 2: 옵션 이름을 0.5초 동안 길게 누르세요.`,
    `Вы можете закрепить часто используемые параметры сверху. Они будут отображаться в верхней части вкладки параметров и всегда будут видны, даже если «Показывать расширенные настройки» не включено. Способ 1: Наведите указатель мыши на параметр, затем нажмите на иконку закрепления слева. Способ 2: Долгое нажатие на название параметра в течение 0.5 секунды.`,
  ],
  _已置顶: [`已置顶`, `已置頂`, `Pinned`, `固定済み`, `고정됨`, `Закреплено`],
  _取消置顶: [
    `取消置顶`,
    `取消置頂`,
    `Unpin`,
    `固定を解除`,
    `고정 해제`,
    `Открепить`,
  ],
  _提示可以在release页面查看更新日志: [
    `你可以在本项目的 <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">GitHub Releases 页面</a> 查看更新日志（中文）。`,
    `你可以在本項目的 <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">GitHub Releases 頁面</a> 查看更新日誌（中文）。`,
    `You can view the update log (Chinese) on this project's <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">GitHub Releases page</a>.`,
    `本プロジェクトの <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">GitHub Releases ページ</a> で更新ログ（中国語）を確認できます。`,
    `본 프로젝트의 <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">GitHub Releases 페이지</a>에서 업데이트 로그(중국어)를 확인할 수 있습니다.`,
    `Вы можете просмотреть журнал обновлений (на китайском) на странице <a href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases" target="_blank">GitHub Releases</a> этого проекта.`,
  ],
  _不预览这个作品因为它含有你排除的标签: [
    `不预览这个作品，因为它含有你排除的标签`,
    `不預覽這個作品，因為它含有你排除的標籤`,
    `Do not preview this work because it contains a tag you excluded`,
    `この作品はプレビューしません。あなたが除外したタグが含まれているためです`,
    `이 작품은 미리보지 않습니다. 제외한 태그가 포함되어 있기 때문입니다`,
    `Не просматривать это произведение, так как оно содержит исключённый вами тег`,
  ],
  _提示添加收藏时会慢速执行: [
    `由于作品数量较多，下载器在添加收藏时会慢速执行。`,
    `由於作品數量較多，下載器在添加收藏時會慢速執行。`,
    `Due to the large number of works, the downloader will execute slowly when adding bookmarks.`,
    `作品数が多いため、ダウンローダーはブックマークを追加する際に低速で実行します。`,
    `작품 수가 많기 때문에 다운로더는 즐겨찾기 추가 시 느리게 실행됩니다.`,
    `Из-за большого количества работ загрузчик будет выполнять добавление в закладки медленно.`,
  ],
  _合并系列小说时的分割阈值: [
    `合并系列小说时的<span class="key">分割</span>阈值`,
    `合併系列小說時的<span class="key">分割</span>閾值`,
    `Split <span class="key">threshold</span> when merging series novels`,
    `シリーズ小説をマージする際の<span class="key">分割</span>閾値`,
    `시리즈 소설 병합 시 <span class="key">분할</span> 임계값`,
    `Порог <span class="key">разделения</span> при объединении серийных новелл`,
  ],
  _合并系列小说时的分割阈值的帮助: [
    `有些系列小说里的图片非常多，甚至可能会超过 4 GB。如果单个 EPUB 文件的体积太大，可能会导致下载失败，而且一些阅读器也可能无法打开它。所以下载器在合并系列小说时会使用这个设置来分割文件。<br>如果分割阈值设置为 200 MB，那么下载器在合并总体积为 1 GB 的系列小说时，会把它分割成 5 - 6 个文件。<br><br>提示：<br>- 这个设置只在合并系列小说时生效。<br>- 最小值是 100 MiB，最大值是 1000 MiB（不建议）。<br>- 下载器在分割 EPUB 文件时不会截断章节内容。`,
    `有些系列小說裡的圖片非常多，甚至可能會超過 4 GB。如果單個 EPUB 檔案的體積太大，可能會導致下載失敗，而且一些閱讀器也可能無法打開它。所以下載器在合併系列小說時會使用這個設定來分割檔案。<br>如果分割閾值設定為 200 MB，那麼下載器在合併總體積為 1 GB 的系列小說時，會把它分割成 5 - 6 個檔案。<br><br>提示：<br>- 這個設定只在合併系列小說時生效。<br>- 最小值是 100 MiB，最大值是 1000 MiB（不建議）。<br>- 下載器在分割 EPUB 檔案時不會截斷章節內容。`,
    `Some series novels contain a large number of images, which may even exceed 4 GB. If a single EPUB file is too large, it may cause download failure, and some readers may also fail to open it. Therefore, the downloader uses this setting to split files when merging series novels.<br>If the split threshold is set to 200 MB, the downloader will split a series novel with a total size of 1 GB into 5 - 6 files.<br><br>Tips:<br>- This setting only takes effect when merging series novels.<br>- The minimum value is 100 MiB, and the maximum value is 1000 MiB (not recommended).<br>- The downloader will not truncate chapter content when splitting EPUB files.`,
    `一部のシリーズ小説には画像が非常に多く、4GBを超える場合もあります。単一のEPUBファイルのサイズが大きすぎると、ダウンロードに失敗したり、一部のリーダーで開けなかったりする可能性があります。そのため、ダウンローダーはシリーズ小説をマージする際にこの設定を使用してファイルを分割します。<br>分割閾値を200MBに設定した場合、総サイズ1GBのシリーズ小説は5〜6個のファイルに分割されます。<br><br>ヒント：<br>- この設定はシリーズ小説をマージする場合にのみ有効です。<br>- 最小値は100MiB、最大値は1000MiB（非推奨）です。<br>- ダウンローダーはEPUBファイルを分割する際に章の内容を切り捨てません。`,
    `일부 시리즈 소설에는 이미지가 매우 많아 4GB를 초과할 수도 있습니다. 단일 EPUB 파일의 크기가 너무 크면 다운로드에 실패할 수 있고 일부 리더에서 열리지 않을 수도 있습니다. 따라서 다운로더는 시리즈 소설을 병합할 때 이 설정을 사용하여 파일을 분할합니다.<br>분할 임계값을 200MB로 설정하면 총 1GB인 시리즈 소설을 5~6개 파일로 분할합니다.<br><br>팁:<br>- 이 설정은 시리즈 소설을 병합할 때만 적용됩니다.<br>- 최소값은 100MiB, 최대값은 1000MiB(권장하지 않음)입니다.<br>- 다운로더는 EPUB 파일을 분할할 때 챕터 내용을 잘라내지 않습니다.`,
    `В некоторых сериях новелл очень много изображений, что может превышать 4 ГБ. Если размер одного EPUB-файла слишком большой, это может привести к сбою загрузки, а некоторые читалки могут не открыть его. Поэтому загрузчик использует эту настройку для разделения файлов при объединении серий новелл.<br>Если порог разделения установлен на 200 МБ, загрузчик разделит серию новелл общим объёмом 1 ГБ на 5–6 файлов.<br><br>Подсказки:<br>- Эта настройка действует только при объединении серий новелл.<br>- Минимальное значение — 100 MiB, максимальное — 1000 MiB (не рекомендуется).<br>- Загрузчик не обрезает содержимое глав при разделении EPUB-файлов.`,
  ],
  _检查屏蔽的标签: [
    `检查屏蔽的标签`,
    `檢查屏蔽的標籤`,
    `Check blocked tags`,
    `ブロックしたタグを確認`,
    `차단된 태그 확인`,
    `Проверить заблокированные теги`,
  ],
  _检查屏蔽的标签的帮助: [
    `如果你启用了这个设置，下载器会检查作品是否包含两种标签：<br>
1. 你在下载器里设置的"不能含有标签"<br>
2. 你在 Pixiv 账户设置里 Mute 的标签<br>
如果作品匹配任意一种屏蔽条件，下载器就不会预览它。`,
    `如果你啟用了這個設定，下載器會檢查作品是否包含兩種標籤：<br>
1. 你在下載器裡設定的"不能含有標籤"<br>
2. 你在 Pixiv 帳戶設定裡 Mute 的標籤<br>
如果作品符合任意一種屏蔽條件，下載器就不會預覽它。`,
    `If you enable this setting, the downloader will check whether a work contains either of these two kinds of tags:<br>
1. The "Tags to exclude" that you set in the downloader<br>
2. The tags you muted in your Pixiv account settings<br>
If the work matches either blocking condition, the downloader will not preview it.`,
    `この設定を有効にすると、ダウンローダーは作品に次の2種類のタグが含まれているかを確認します。<br>
1. ダウンローダーで設定した"含めないタグ"<br>
2. Pixivアカウントの設定でミュートしたタグ<br>
作品がどちらかのブロック条件に一致した場合、ダウンローダーはその作品をプレビューしません。`,
    `이 설정을 활성화하면 다운로더가 작품에 다음 두 종류의 태그가 포함되어 있는지 확인합니다.<br>
1. 다운로더에서 설정한 "포함하면 안 되는 태그"<br>
2. Pixiv 계정 설정에서 뮤트한 태그<br>
작품이 둘 중 하나의 차단 조건에 해당하면 다운로더는 그 작품을 미리 보여주지 않습니다.`,
    `Если включить эту настройку, загрузчик будет проверять, есть ли у работы два типа тегов:<br>
1. "Теги, которые не должны содержаться", заданные в загрузчике<br>
2. Теги, которые вы добавили в Mute в настройках аккаунта Pixiv<br>
Если работа подпадает хотя бы под одно из этих условий блокировки, загрузчик не будет показывать ее в предпросмотре.`,
  ],
  _命名标记的提示: [
    `命名规则用来设置文件夹和文件的名字。一个命名规则可以由 3 部分组成：<br>
- 特殊标记，例如 <span class="blue name">{id}</span>、<span class="blue name">{user}</span>、<span class="blue name">{title}</span> 等，每个标记都可能会输出一些字符。标记的含义在下面有说明。<br>
- 斜线 <span class="blue name">/</span> 用来建立文件夹。每个斜线前面的内容都是文件夹的名字，最后一个斜线之后的部分是文件名。你可以添加多层文件夹，也可以自由的组织文件夹结构。<br>
- 普通字符和符号。你可以在标记之间添加普通字符，例如 <span class="blue">pixiv/{id}-title {title}-user {user}</span><br>
<br>
建立文件夹的说明：<br>
- 如果你想为每个作品建立一层文件夹，可以在文件名前面添加一层文件夹。使用作品 ID <span class="blue name">{pid}</span> 作为文件夹名字是一个通用的选择，例如 <span class="blue">pixiv/{user}/{pid}/{id}</span>。当然你也可以根据自己的需要使用对应的标记。<br>
- 如果你想把 AI 生成的作品放到单独的文件夹里，可以使用 <span class="blue name">{AI}</span> 标记，例如：<span class="blue">pixiv/{user}/{AI}/{id}</span><br>
- 如果你想根据作品类型建立文件夹，可以使用 <span class="blue name">{type}</span> 标记，例如：<span class="blue">pixiv/{user}/{type}/{id}</span><br>
<br>
提示：<br>
- * 有些标记并不总是可用，有时它们会是空字符串，下载器会忽略它们。<br>
-  如果你想在文件夹里使用作品的 id，应该使用 <span class="blue name">{pid}</span> 而不是 <span class="blue name">{id}</span>。因为每张图片的 id 都不一样，使用 <span class="blue name">{id}</span> 会导致每张图片都产生一个文件夹。<br>
- 为了防止文件名重复，文件名里必须含有 <span class="blue name">{id}</span>。如果你不想使用 <span class="blue name">{id}</span>，就必须同时包含 <span class="blue name">{pid}</span> 和 <span class="blue name">{p}</span>。<br>
<br>
命名标记列表：<br>
提示：点击标记的名字就可以复制它。<br>`,
    `命名規則用來設定資料夾和檔案的名字。一個命名規則可以由 3 個部分組成：<br>
- 特殊標記，例如 <span class="blue name">{id}</span>、<span class="blue name">{user}</span>、<span class="blue name">{title}</span> 等，每個標記都可能會輸出一些字元。標記的含義在下面有說明。<br>
- 斜線 <span class="blue name">/</span> 用來建立資料夾。每個斜線前面的內容都是資料夾的名字，最後一個斜線之後的部分是檔名。你可以添加多層資料夾，也可以自由地組織資料夾結構。<br>
- 普通字元和符號。你可以在標記之間添加普通字元，例如 <span class="blue">pixiv/{id}-title {title}-user {user}</span><br>
<br>
建立資料夾的說明：<br>
- 如果你想為每個作品建立一層資料夾，可以在檔名前面添加一層資料夾。使用作品 ID <span class="blue name">{pid}</span> 作為資料夾名字是一個通用的選擇，例如 <span class="blue">pixiv/{user}/{pid}/{id}</span>。當然你也可以根據自己的需要使用對應的標記。<br>
- 如果你想把 AI 生成的作品放到單獨的資料夾裡，可以使用 <span class="blue name">{AI}</span> 標記，例如：<span class="blue">pixiv/{user}/{AI}/{id}</span><br>
- 如果你想根據作品類型建立資料夾，可以使用 <span class="blue name">{type}</span> 標記，例如：<span class="blue">pixiv/{user}/{type}/{id}</span><br>
<br>
提示：<br>
- * 有些標記並不總是可用，有時它們會是空字串，下載器會忽略它們。<br>
-  如果你想在資料夾裡使用作品的 id，應該使用 <span class="blue name">{pid}</span> 而不是 <span class="blue name">{id}</span>。因為每張圖片的 id 都不一樣，使用 <span class="blue name">{id}</span> 會導致每張圖片都產生一個資料夾。<br>
- 為了防止檔名重複，檔名裡必須含有 <span class="blue name">{id}</span>。如果你不想使用 <span class="blue name">{id}</span>，就必須同時包含 <span class="blue name">{pid}</span> 和 <span class="blue name">{p}</span>。<br>
<br>
命名標記列表：<br>
提示：點擊標記的名字就可以複製它。<br>`,
    `The naming rule sets the names of folders and files. A naming rule can consist of 3 parts:<br>
- Special tokens, such as <span class="blue name">{id}</span>, <span class="blue name">{user}</span>, <span class="blue name">{title}</span>, etc. Each token may output some characters. The meaning of each token is described below.<br>
- A slash <span class="blue name">/</span> is used to create folders. The content before each slash is the folder name, and the part after the last slash is the file name. You can add multiple levels of folders and organize the folder structure freely.<br>
- Regular characters and symbols. You can add regular characters between tokens, for example: <span class="blue">pixiv/{id}-title {title}-user {user}</span><br>
<br>
Notes on creating folders:<br>
- If you want to create a folder for each work, add a folder level before the file name. Using the work ID <span class="blue name">{pid}</span> as the folder name is a common choice, for example: <span class="blue">pixiv/{user}/{pid}/{id}</span>. Of course, you can use other tokens based on your needs.<br>
- If you want to put AI-generated works in a separate folder, use the <span class="blue name">{AI}</span> token, for example: <span class="blue">pixiv/{user}/{AI}/{id}</span><br>
- If you want to create folders by work type, use the <span class="blue name">{type}</span> token, for example: <span class="blue">pixiv/{user}/{type}/{id}</span><br>
<br>
Tips:<br>
- * Some tokens are not always available and may be empty strings — the downloader will ignore them.<br>
- If you want to use the work's ID in a folder name, use <span class="blue name">{pid}</span> instead of <span class="blue name">{id}</span>. Since each image has a different ID, using <span class="blue name">{id}</span> would create a separate folder for each image.<br>
- To prevent duplicate file names, the file name must contain <span class="blue name">{id}</span>. If you don't want to use <span class="blue name">{id}</span>, you must include both <span class="blue name">{pid}</span> and <span class="blue name">{p}</span>.<br>
<br>
List of naming tokens:<br>
Tip: Click a token name to copy it.<br>`,
    `命名ルールはフォルダーとファイルの名前を設定するために使います。命名ルールは次の 3 つの部分で構成できます：<br>
- 特殊トークン。例えば <span class="blue name">{id}</span>、<span class="blue name">{user}</span>、<span class="blue name">{title}</span> など。各トークンは何らかの文字を出力します。トークンの意味は下に説明があります。<br>
- スラッシュ <span class="blue name">/</span> はフォルダーを作るために使います。各スラッシュの前の内容がフォルダー名になり、最後のスラッシュより後の部分がファイル名になります。複数階層のフォルダーを追加したり、自由にフォルダー構造を組み立てることができます。<br>
- 通常の文字や記号。トークンの間に通常の文字を追加できます。例：<span class="blue">pixiv/{id}-title {title}-user {user}</span><br>
<br>
フォルダー作成の説明：<br>
- 各 work ごとにフォルダーを作りたい場合は、ファイル名の前にフォルダー階層を追加してください。作品 ID <span class="blue name">{pid}</span> をフォルダー名に使うのが一般的な選択です。例：<span class="blue">pixiv/{user}/{pid}/{id}</span>。もちろん必要に応じて他のトークンを使うこともできます。<br>
- AI 生成の work を別のフォルダーに入れたい場合は <span class="blue name">{AI}</span> トークンを使います。例：<span class="blue">pixiv/{user}/{AI}/{id}</span><br>
- work の種類別にフォルダーを作りたい場合は <span class="blue name">{type}</span> トークンを使います。例：<span class="blue">pixiv/{user}/{type}/{id}</span><br>
<br>
ヒント：<br>
- * 一部のトークンは常に使えるわけではなく、空文字列になることがあります。その場合、ダウンローダーはそれを無視します。<br>
- フォルダー名に work の ID を使いたい場合は、<span class="blue name">{id}</span> ではなく <span class="blue name">{pid}</span> を使ってください。各 image の ID は異なるため、<span class="blue name">{id}</span> を使うと image ごとにフォルダーが作られてしまいます。<br>
- ファイル名の重複を防ぐため、ファイル名には必ず <span class="blue name">{id}</span> を含める必要があります。<span class="blue name">{id}</span> を使いたくない場合は、<span class="blue name">{pid}</span> と <span class="blue name">{p}</span> の両方を含める必要があります。<br>
<br>
命名トークン一覧：<br>
ヒント：トークン名をクリックするとコピーできます。<br>`,
    `명명 규칙은 폴더와 파일의 이름을 설정하는 데 사용합니다. 명명 규칙은 다음 3가지 부분으로 구성할 수 있습니다：<br>
- 특수 토큰. 예를 들어 <span class="blue name">{id}</span>, <span class="blue name">{user}</span>, <span class="blue name">{title}</span> 등이 있으며, 각 토큰은 일부 문자를 출력할 수 있습니다. 토큰의 의미는 아래에 설명되어 있습니다.<br>
- 슬래시 <span class="blue name">/</span> 는 폴더를 만드는 데 사용합니다. 각 슬래시 앞의 내용이 폴더 이름이 되고, 마지막 슬래시 뒤의 부분이 파일 이름이 됩니다. 여러 단계의 폴더를 추가하거나 폴더 구조를 자유롭게 구성할 수 있습니다.<br>
- 일반 문자와 기호. 토큰 사이에 일반 문자를 추가할 수 있습니다. 예：<span class="blue">pixiv/{id}-title {title}-user {user}</span><br>
<br>
폴더 생성 설명：<br>
- 각 work마다 폴더를 만들고 싶다면 파일 이름 앞에 폴더 레벨을 추가하세요. work ID <span class="blue name">{pid}</span> 을 폴더 이름으로 사용하는 것이 일반적인 선택입니다. 예：<span class="blue">pixiv/{user}/{pid}/{id}</span>. 물론 필요에 따라 다른 토큰을 사용할 수도 있습니다.<br>
- AI로 생성된 work를 별도의 폴더에 넣고 싶다면 <span class="blue name">{AI}</span> 토큰을 사용하세요. 예：<span class="blue">pixiv/{user}/{AI}/{id}</span><br>
- work 유형별로 폴더를 만들고 싶다면 <span class="blue name">{type}</span> 토큰을 사용하세요. 예：<span class="blue">pixiv/{user}/{type}/{id}</span><br>
<br>
팁：<br>
- * 일부 토큰은 항상 사용 가능한 것은 아니며, 빈 문자열이 될 수 있습니다. 이 경우 다운로더는 해당 토큰을 무시합니다.<br>
- 폴더 이름에 work의 ID를 사용하고 싶다면 <span class="blue name">{id}</span> 대신 <span class="blue name">{pid}</span> 을 사용하세요. 각 image마다 ID가 다르기 때문에 <span class="blue name">{id}</span> 를 사용하면 image마다 폴더가 생성됩니다.<br>
- 파일 이름 중복을 방지하려면 파일 이름에 반드시 <span class="blue name">{id}</span> 가 포함되어야 합니다. <span class="blue name">{id}</span> 를 사용하고 싶지 않다면 <span class="blue name">{pid}</span> 과 <span class="blue name">{p}</span> 을 모두 포함해야 합니다.<br>
<br>
명명 토큰 목록：<br>
팁: 토큰 이름을 클릭하면 복사할 수 있습니다.<br>`,
    `Правило именования задаёт названия папок и файлов. Правило именования может состоять из 3 частей:<br>
- Специальные токены, например <span class="blue name">{id}</span>, <span class="blue name">{user}</span>, <span class="blue name">{title}</span> и другие. Каждый токен может выводить определённые символы. Значение каждого токена описано ниже.<br>
- Слэш <span class="blue name">/</span> используется для создания папок. Содержимое перед каждым слэшем — это название папки, а часть после последнего слэша — имя файла. Можно добавлять несколько уровней папок и свободно организовывать структуру.<br>
- Обычные символы и знаки. Между токенами можно вставлять обычные символы, например: <span class="blue">pixiv/{id}-title {title}-user {user}</span><br>
<br>
Пояснения по созданию папок:<br>
- Если вы хотите создать папку для каждой work, добавьте уровень папки перед именем файла. Использование ID work <span class="blue name">{pid}</span> в качестве имени папки — универсальный вариант, например: <span class="blue">pixiv/{user}/{pid}/{id}</span>. Разумеется, вы можете использовать другие токены по своему усмотрению.<br>
- Если вы хотите поместить work, созданные с помощью ИИ, в отдельную папку, используйте токен <span class="blue name">{AI}</span>, например: <span class="blue">pixiv/{user}/{AI}/{id}</span><br>
- Если вы хотите создавать папки по типу work, используйте токен <span class="blue name">{type}</span>, например: <span class="blue">pixiv/{user}/{type}/{id}</span><br>
<br>
Советы:<br>
- * Некоторые токены доступны не всегда и могут быть пустой строкой — загрузчик будет их игнорировать.<br>
- Если вы хотите использовать ID work в названии папки, используйте <span class="blue name">{pid}</span>, а не <span class="blue name">{id}</span>. Поскольку у каждой image свой ID, использование <span class="blue name">{id}</span> приведёт к созданию отдельной папки для каждой image.<br>
- Чтобы избежать дублирования имён файлов, имя файла должно содержать <span class="blue name">{id}</span>. Если вы не хотите использовать <span class="blue name">{id}</span>, необходимо одновременно включить <span class="blue name">{pid}</span> и <span class="blue name">{p}</span>.<br>
<br>
Список токенов именования:<br>
Совет: нажмите на название токена, чтобы скопировать его.<br>`,
  ],
  _小说的命名标记的提示: [
    `小说可以使用的命名标记与图像作品相同，并且有一个特殊的标记：<br>
<span class="blue name">{follow_artwork}</span> 跟随图像作品的命名规则。它也是默认值，表示小说使用与图像作品相同的命名规则。如果你想为小说设置独立的命名规则，可以移除这个标记，并根据自己的需要设置命名规则。`,
    `小說可以使用的命名標記與圖像作品相同，並且有一個特殊的標記：<br>
<span class="blue name">{follow_artwork}</span> 跟隨圖像作品的命名規則。它也是預設值，表示小說使用與圖像作品相同的命名規則。如果你想為小說設定獨立的命名規則，可以移除這個標記，並根據自己的需要設定命名規則。`,
    `Novels can use the same naming tokens as image works, and there is one special token:<br>
<span class="blue name">{follow_artwork}</span> follows the naming rule of image works. It is also the default value, meaning novels use the same naming rule as image works. If you want to set a separate naming rule for novels, remove this token and configure the rule as you like.`,
    `小説で使える命名トークンは画像作品と同じです。また、特別なトークンが 1 つあります：<br>
<span class="blue name">{follow_artwork}</span> 画像作品の命名ルールに従います。これはデフォルト値でもあり、小説が画像作品と同じ命名ルールを使うことを意味します。小説に独自の命名ルールを設定したい場合は、このトークンを削除して、必要に応じてルールを設定してください。`,
    `소설에서 사용할 수 있는 명명 토큰은 이미지 작품과 동일하며, 특별한 토큰이 하나 있습니다：<br>
<span class="blue name">{follow_artwork}</span> 이미지 작품의 명명 규칙을 따릅니다. 이것은 기본값이기도 하며, 소설이 이미지 작품과 동일한 명명 규칙을 사용한다는 뜻입니다. 소설에 별도의 명명 규칙을 설정하고 싶다면 이 토큰을 제거하고 원하는 대로 규칙을 설정하세요.`,
    `Для novel доступны те же токены именования, что и для работ с изображениями, плюс один специальный токен:<br>
<span class="blue name">{follow_artwork}</span> следует правилу именования работ с изображениями. Это также значение по умолчанию, означающее, что novel использует то же правило именования, что и работы с изображениями. Если вы хотите задать для novel отдельное правило именования, удалите этот токен и настройте правило по своему усмотрению.`,
  ],
  _标签别名: [
    `标签<span class="key">别名</span>`,
    `標籤<span class="key">別名</span>`,
    `Tag <span class="key">alias</span>`,
    `タグの<span class="key">別名</span>`,
    `태그 <span class="key">별칭</span>`,
    `<span class="key">Псевдоним</span> тега`,
  ],
  _标签别名的帮助: [
    `如果一个标签有多种变体，你可以为它们设置一个通用的别名。例如 <span class="blue">GenshinImpact</span> 有多个变体：<span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span>。<br>
如果你想把这些变体都作为 <span class="blue">GenshinImpact</span> 处理，可以点击"添加"按钮来添加一条规则：把别名设置为 <span class="blue">GenshinImpact</span> 或者你想使用的其他名字，把标签列表设置为变体列表。<br>
<br>
子选项：<br>
- 应用到文件名里的 {tags} 系列标记：如果你启用了这个选项，那么当你在命名规则里使用这些标签时会受到影响：<span class="blue">{page_title}</span>、<span class="blue">{tags}</span>、<span class="blue">{tags_translate}</span>、<span class="blue">{tags_transl_only}</span>。<br>
对于上面的例子，下载器在生成文件名时，会把作品标签里的 <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span> 都替换为别名 <span class="blue">GenshinImpact</span>（或者你设置的其他名字）。<br>
<br>
另外，如果你启用了"使用第一个匹配的标签建立文件夹"，可以使用你在这里设置的别名。这样隶属于该别名的标签都会使用别名来建立文件夹，可以用来统一文件夹名字。`,
    `如果一個標籤有多種變體，你可以為它們設定一個通用的別名。例如 <span class="blue">GenshinImpact</span> 有多個變體：<span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span>。<br>
如果你想把這些變體都作為 <span class="blue">GenshinImpact</span> 處理，可以點擊「添加」按鈕來添加一條規則：把別名設定為 <span class="blue">GenshinImpact</span> 或者你想使用的其他名字，把標籤列表設定為變體列表。<br>
<br>
子選項：<br>
- 應用到檔名裡的 {tags} 系列標記：如果你啟用了這個選項，那麼當你在命名規則裡使用這些標籤時會受到影響：<span class="blue">{page_title}</span>、<span class="blue">{tags}</span>、<span class="blue">{tags_translate}</span>、<span class="blue">{tags_transl_only}</span>。<br>
對於上面的例子，下載器在生成檔名時，會把作品標籤裡的 <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span> 都替換為別名 <span class="blue">GenshinImpact</span>（或者你設定的其他名字）。<br>
<br>
另外，如果你啟用了「使用第一個匹配的標籤建立資料夾」，可以使用你在這裡設定的別名。這樣隸屬於該別名的標籤都會使用別名來建立資料夾，可以用來統一資料夾名字。`,
    `If a tag has multiple variants, you can set a common alias for them. For example, <span class="blue">GenshinImpact</span> has multiple variants: <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span>.<br>
If you want to treat all these variants as <span class="blue">GenshinImpact</span>, click the "Add" button to add a rule: set the alias to <span class="blue">GenshinImpact</span> or any other name you prefer, and set the tag list to the list of variants.<br>
<br>
Sub-options:<br>
- {tags} series tokens applied to the file name: If you enable this option, the following tokens in your naming rule will be affected: <span class="blue">{page_title}</span>, <span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{tags_transl_only}</span>.<br>
Using the example above, when generating file names, the downloader will replace <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span> in the work's tags with the alias <span class="blue">GenshinImpact</span> (or whatever name you set).<br>
<br>
Additionally, if you have enabled "Create folder using the first matching tag", you can use the aliases set here. Tags belonging to that alias will use the alias to create folders, which helps keep folder names consistent.`,
    `タグに複数の表記ゆれがある場合、それらに共通の別名を設定できます。例えば <span class="blue">GenshinImpact</span> には複数の表記ゆれがあります：<span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span>。<br>
これらをすべて <span class="blue">GenshinImpact</span> として処理したい場合は、「追加」ボタンをクリックしてルールを追加してください。別名を <span class="blue">GenshinImpact</span> または任意の名前に設定し、タグリストに表記ゆれの一覧を設定します。<br>
<br>
サブオプション：<br>
- ファイル名に適用される {tags} 系のトークン：このオプションを有効にすると、命名ルールでこれらのタグを使用する際に影響を受けます：<span class="blue">{page_title}</span>、<span class="blue">{tags}</span>、<span class="blue">{tags_translate}</span>、<span class="blue">{tags_transl_only}</span>。<br>
上の例の場合、ダウンローダーはファイル名を生成する際、作品のタグにある <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span> をすべて別名 <span class="blue">GenshinImpact</span>（または設定した名前）に置き換えます。<br>
<br>
また、「最初にマッチしたタグを使ってフォルダーを作成する」を有効にしている場合、ここで設定した別名を使用できます。その別名に属するタグはすべて別名を使ってフォルダーを作成するため、フォルダー名を統一するのに役立ちます。`,
    `태그에 여러 변형이 있는 경우 공통 별칭을 설정할 수 있습니다. 예를 들어 <span class="blue">GenshinImpact</span> 에는 여러 변형이 있습니다：<span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span>.<br>
이 변형들을 모두 <span class="blue">GenshinImpact</span> 로 처리하고 싶다면 "추가" 버튼을 클릭해 규칙을 추가하세요. 별칭을 <span class="blue">GenshinImpact</span> 또는 원하는 다른 이름으로 설정하고, 태그 목록에 변형 목록을 입력합니다.<br>
<br>
하위 옵션：<br>
- 파일 이름에 적용되는 {tags} 계열 토큰：이 옵션을 활성화하면 명명 규칙에서 다음 토큰을 사용할 때 영향을 받습니다：<span class="blue">{page_title}</span>, <span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{tags_transl_only}</span>.<br>
위 예시의 경우, 다운로더가 파일 이름을 생성할 때 작품 태그의 <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span> 를 모두 별칭 <span class="blue">GenshinImpact</span>（또는 설정한 다른 이름）로 교체합니다.<br>
<br>
또한 "처음 매칭된 태그로 폴더 만들기"를 활성화한 경우 여기서 설정한 별칭을 사용할 수 있습니다. 해당 별칭에 속하는 태그는 모두 별칭을 사용해 폴더를 만들기 때문에 폴더 이름을 통일하는 데 유용합니다.`,
    `Если тег имеет несколько вариантов написания, вы можете задать для них общий псевдоним. Например, у <span class="blue">GenshinImpact</span> есть несколько вариантов: <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span>.<br>
Если вы хотите обрабатывать все эти варианты как <span class="blue">GenshinImpact</span>, нажмите кнопку "Добавить" и добавьте правило: задайте псевдоним <span class="blue">GenshinImpact</span> или любое другое имя, и укажите список вариантов в качестве списка тегов.<br>
<br>
Вложенные параметры:<br>
- Токены серии {tags}, применяемые в имени файла: если вы включите этот параметр, при использовании следующих токенов в правиле именования они будут затронуты: <span class="blue">{page_title}</span>, <span class="blue">{tags}</span>, <span class="blue">{tags_translate}</span>, <span class="blue">{tags_transl_only}</span>.<br>
Для приведённого примера при генерации имён файлов загрузчик заменит <span class="blue">GenshinImpact,Genshin Impact,Genshin,impact,原神,原神インパクト,アリス(原神)</span> в тегах work на псевдоним <span class="blue">GenshinImpact</span> (или другое заданное вами имя).<br>
<br>
Кроме того, если вы включили "Создать папку по первому совпавшему тегу", можно использовать псевдонимы, заданные здесь. Теги, относящиеся к этому псевдониму, будут использовать псевдоним для создания папок, что помогает сохранять единообразие имён папок.`,
  ],
  _别名: [`别名`, `別名`, `Alias`, `別名`, `별칭`, `Псевдоним`],
  _标签列表: [
    `标签列表`,
    `標籤列表`,
    `Tag list`,
    `タグリスト`,
    `태그 목록`,
    `Список тегов`,
  ],
  _确定要删除这一条配置吗: [
    `确定要删除这一条配置吗？`,
    `確定要刪除這一條設定嗎？`,
    `Are you sure you want to delete this entry?`,
    `この設定を削除してもよろしいですか？`,
    `이 설정을 삭제하시겠습니까？`,
    `Вы уверены, что хотите удалить эту запись？`,
  ],
  _应用到文件名里的tags系列标记: [
    `应用到文件名里的 {tags} 系列标记`,
    `應用到檔名裡的 {tags} 系列標記`,
    `{tags} series tokens applied to the file name`,
    `ファイル名に適用される {tags} 系のトークン`,
    `파일 이름에 적용되는 {tags} 계열 토큰`,
    `Токены серии {tags}, применяемые в имени файла`,
  ],
  _版本更新说明18_9_0: [
    `<strong>⚠️🔧调整了“不创建文件夹”设置的子选项</strong><br>
该设置的子选项已经重新设计，以提供更细致的控制能力。如果你使用这个设置，需要重新选择你需要的选项。<br>
<br>
<strong>✨调整了动图保存格式</strong><br>
- 新增格式：WebP 图片（有损）、WebP 图片（无损）、Ugoira 文件<br>
- 多选：之前你只能选择一种格式，现在可以选择多种格式，在一次下载里把动图保存为多种格式。<br>
- 默认值变化：之前的默认格式是 WebM 视频，现在改为 WebP 图片。这不会改变你之前选择的格式，只会影响下载器的新用户。<br>
- 略微加快了转换速度。<br>
- 转换 APNG 图片时不会再冻结页面。<br>
<br>
<strong>😊优化了一些帮助信息</strong><br>`,
    `<strong>⚠️🔧調整了 "不建立資料夾" 設定的子選項</strong><br>
這個設定的子選項已重新設計，以提供更細緻的控制能力。如果你有使用這個設定，需要重新選擇你需要的選項。<br>
<br>
<strong>✨調整了動圖儲存格式</strong><br>
- 新增格式：WebP 圖片（有損）、WebP 圖片（無損）、Ugoira 檔案<br>
- 多選：以前你只能選擇一種格式，現在可以同時選擇多種格式，在一次下載裡把動圖儲存成多種格式。<br>
- 預設值變更：以前的預設格式是 WebM 影片，現在改成 WebP 圖片。這不會改變你之前選擇的格式，只會影響下載器的新使用者。<br>
- 稍微加快了轉換速度。<br>
- 轉換 APNG 圖片時不會再讓頁面凍結。<br>
<br>
<strong>😊優化了一些幫助資訊</strong><br>`,
    `<strong>⚠️🔧Adjusted the sub-options of the "Do not create folders" setting</strong><br>
The sub-options of this setting have been redesigned to provide more detailed control. If you use this setting, you need to select the options you want again.<br>
<br>
<strong>✨Adjusted the Ugoira save formats</strong><br>
- New formats: WebP image (lossy), WebP image (lossless), Ugoira file<br>
- Multi-select: Previously, you could choose only one format. Now you can choose multiple formats and save Ugoira in multiple formats in a single download.<br>
- Default value changed: The previous default format was WebM video, and now it has been changed to WebP image. This will not change the format you selected before. It only affects new users of the downloader.<br>
- Conversion speed has been slightly improved.<br>
- Converting APNG images will no longer freeze the page.<br>
<br>
<strong>😊Improved some help information</strong><br>`,
    `<strong>⚠️🔧"フォルダを作成しない" 設定のサブオプションを調整しました</strong><br>
この設定のサブオプションは、より細かく制御できるように再設計されました。この設定を使っている場合は、必要なオプションをもう一度選び直してください。<br>
<br>
<strong>✨Ugoira の保存形式を調整しました</strong><br>
- 追加された形式：WebP 画像（非可逆）、WebP 画像（可逆）、Ugoira ファイル<br>
- 複数選択：以前は1つの形式しか選べませんでしたが、今は複数の形式を選べるようになり、1回のダウンロードで Ugoira を複数の形式で保存できます。<br>
- デフォルト値の変更：以前のデフォルト形式は WebM 動画でしたが、現在は WebP 画像に変更されました。これは以前に選択した形式には影響せず、ダウンローダーの新規ユーザーにのみ影響します。<br>
- 変換速度が少し向上しました。<br>
- APNG 画像への変換時にページがフリーズしなくなりました。<br>
<br>
<strong>😊いくつかのヘルプ情報を改善しました</strong><br>`,
    `<strong>⚠️🔧"폴더 만들지 않기" 설정의 하위 옵션을 조정했습니다</strong><br>
이 설정의 하위 옵션을 더 세밀하게 제어할 수 있도록 다시 설계했습니다. 이 설정을 사용하고 있다면 필요한 옵션을 다시 선택해야 합니다.<br>
<br>
<strong>✨Ugoira 저장 형식을 조정했습니다</strong><br>
- 새 형식 추가: WebP 이미지(손실), WebP 이미지(무손실), Ugoira 파일<br>
- 다중 선택: 이전에는 한 가지 형식만 선택할 수 있었지만, 이제는 여러 형식을 선택해서 한 번의 다운로드로 Ugoira를 여러 형식으로 저장할 수 있습니다.<br>
- 기본값 변경: 이전 기본 형식은 WebM 비디오였지만, 이제 WebP 이미지로 변경되었습니다. 이 변경은 이전에 선택한 형식에는 영향을 주지 않고, 다운로더의 신규 사용자에게만 영향을 줍니다.<br>
- 변환 속도가 조금 빨라졌습니다.<br>
- APNG 이미지로 변환할 때 더 이상 페이지가 멈추지 않습니다.<br>
<br>
<strong>😊일부 도움말 정보를 개선했습니다</strong><br>`,
    `<strong>⚠️🔧Скорректированы подпункты настройки "Не создавать папки"</strong><br>
Подпункты этой настройки были переработаны, чтобы дать более точный контроль. Если вы используете эту настройку, вам нужно заново выбрать нужные варианты.<br>
<br>
<strong>✨Скорректированы форматы сохранения Ugoira</strong><br>
- Новые форматы: изображение WebP (с потерями), изображение WebP (без потерь), файл Ugoira<br>
- Множественный выбор: раньше можно было выбрать только один формат, а теперь можно выбрать несколько форматов и сохранять Ugoira сразу в нескольких форматах за одну загрузку.<br>
- Изменение значения по умолчанию: раньше форматом по умолчанию было видео WebM, а теперь это изображение WebP. Это не изменит формат, который вы выбрали раньше, и повлияет только на новых пользователей загрузчика.<br>
- Скорость конвертации немного увеличена.<br>
- При конвертации в изображение APNG страница больше не зависает.<br>
<br>
<strong>😊Улучшена некоторая справочная информация</strong><br>`,
  ],
  _从插画漫画里下载1张图片时: [
    `从插画、漫画里下载 1 张图片时`,
    `從插畫、漫畫裡下載 1 張圖片時`,
    `When downloading 1 image from an illustration or manga`,
    `イラスト・漫画から 1 枚ダウンロードするとき`,
    `일러스트 또는 만화에서 이미지 1장을 다운로드할 때`,
    `При скачивании 1 изображения из иллюстрации или манги`,
  ],
  _从插画漫画里下载多张图片时: [
    `从插画、漫画里下载多张图片时`,
    `從插畫、漫畫裡下載多張圖片時`,
    `When downloading multiple images from an illustration or manga`,
    `イラスト・漫画から複数の画像をダウンロードするとき`,
    `일러스트 또는 만화에서 여러 장의 이미지를 다운로드할 때`,
    `При скачивании нескольких изображений из иллюстрации или манги`,
  ],
}

export type LangTextKey = keyof typeof langText
