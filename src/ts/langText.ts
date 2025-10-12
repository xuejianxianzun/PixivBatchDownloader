import { Config } from './Config'

// 储存下载器使用的多语言文本
// 在属性名前面加上下划线
// {} 是占位符
// <br> 和 \n 是换行

const langText = {
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
    '宽高比：{}',
    '寬高比：{}',
    'Aspect ratio: {}',
    '縦横比：{}',
    '종횡비: {}',
    'Соотношение сторон: {}',
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
    `你可以设置下载多少个作品。
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
    `你可以設定下載多少個作品。
<br>
<br>
當你位於某個插畫或小說的詳情頁面裡，下載器會從當前作品開始抓取（包含當前作品）。
<br>
設定為 1 只會抓取當前作品。
<br>
設定為 -1 表示不限制抓取數量，下載器會從當前作品開始，抓取到最後一個作品。
<br>
<br>
在其他頁面裡（例如排行榜頁面、關注的用戶的新作品頁面），下載器會從這一頁的第一個作品開始抓取。
<br>
設定為 1 只會抓取第 1 個作品。
<br>
設定為 -1 表示抓取該頁面裡的所有作品。
<br>`,
    `You can set how many works to download.
<br>
<br>
When you are on the detail page of an illustration or novel, the downloader will start crawling from the current work (including the current work).
<br>
Setting it to 1 will only crawl the current work.
<br>
Setting it to -1 means no limit on the number of works to crawl, and the downloader will crawl from the current work to the last work.
<br>
<br>
On other pages (such as the ranking page or the new works page of followed users), the downloader will start crawling from the first work on that page.
<br>
Setting it to 1 will only crawl the first work.
<br>
Setting it to -1 means crawling all works on that page.
<br>`,
    `ダウンロードする作品の数を設定できます。
<br>
<br>
イラストや小説の詳細ページにいる場合、ダウンローダーは現在の作品からクロールを開始します（現在の作品を含みます）。
<br>
1 に設定すると、現在の作品のみをクロールします。
<br>
-1 に設定すると、クロールする作品数に制限がなく、ダウンローダーは現在の作品から最後の作品までクロールします。
<br>
<br>
他のページ（たとえばランキングページやフォローしているユーザーの新作ページ）にいる場合、ダウンローダーはそのページの最初の作品からクロールを開始します。
<br>
1 に設定すると、最初の作品のみをクロールします。
<br>
-1 に設定すると、そのページにあるすべての作品をクロールします。
<br>`,
    `다운로드할 작품의 수를 설정할 수 있습니다.
<br>
<br>
일러스트나 소설의 상세 페이지에 있을 때, 다운로더는 현재 작품부터 크롤링을 시작합니다(현재 작품 포함).
<br>
1로 설정하면 현재 작품만 크롤링합니다.
<br>
-1로 설정하면 크롤링할 작품 수에 제한이 없으며, 다운로더는 현재 작품부터 마지막 작품까지 크롤링합니다.
<br>
<br>
다른 페이지(예: 랭킹 페이지나 팔로우한 사용자의 신규 작품 페이지)에 있을 때, 다운로더는 해당 페이지의 첫 번째 작품부터 크롤링을 시작합니다.
<br>
1로 설정하면 첫 번째 작품만 크롤링합니다.
<br>
-1로 설정하면 해당 페이지의 모든 작품을 크롤링합니다.
<br>`,
    `Вы можете настроить, сколько работ скачать.
<br>
<br>
Когда вы находитесь на странице с подробностями об иллюстрации или романе, загрузчик начнет сбор данных с текущей работы (включая текущую работу).
<br>
Установка значения 1 означает, что будет собрана только текущая работа.
<br>
Установка значения -1 означает отсутствие ограничений на количество собираемых работ, и загрузчик будет собирать данные от текущей работы до последней.
<br>
<br>
На других страницах (например, на странице рейтинга или странице новых работ пользователей, на которых вы подписаны), загрузчик начнет сбор данных с первой работы на этой странице.
<br>
Установка значения 1 означает, что будет собрана только первая работа.
<br>
Установка значения -1 означает, что будут собраны все работы на этой странице.
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
  _从本页开始下载x个: [
    '从本页开始下载 {} 个作品',
    '從本頁開始下載 {} 個作品',
    'Download {} works from this page.',
    'このページから {} 枚の作品をダウンロード。',
    '이 페이지부터 {}개의 작품 다운로드',
    'Загрузить {} работы с этой страницы.',
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
    '排除作品类型：',
    '排除作品類型：',
    'Excludes these types of works: ',
    'これらのタイプの作品を除外：',
    '제외된 작품 유형: ',
    'Исключает эти виды работ: ',
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
  _漫画: ['漫画', '漫畫', 'Manga', '漫画', '만화', 'Манга'],
  _动图: [
    '动图',
    '動圖',
    'Ugoira',
    'うごイラ',
    '움직이는 일러스트',
    'Ugoira(гиф)',
  ],
  _小说: ['小说', '小說', 'Novel', '小説', '소설', 'Новеллы'],
  _动图保存格式: [
    '<span class="key">动图</span>保存格式',
    '<span class="key">動圖</span>儲存格式',
    'Save the <span class="key">ugoira</span> work as',
    '<span class="key">うごイラ</span>の保存タイプ',
    '<span class="key">움직이는 일러스트</span> 작품 저장 형식',
    'Сохранить <span class="key">Ugoira</span> как',
  ],
  _动图保存格式的说明: [
    `Pixiv 的动图的源文件是一个 Zip 压缩文件，里面包含了多张静态图片。下载器可以把它转换成其他格式。<br>
WebM 视频的体积最小，而且画质损失不明显。它是预设的选择。<br>
GIF 图片的兼容性最好，但是体积比较大，而且画质也比较差，不推荐。<br>
APNG 图片是无损压缩，画质最好，但体积通常是最大的。<br>
Zip 文件是源文件。`,
    `Pixiv 的動圖的原始檔是一個 Zip 壓縮檔案，裡面包含了多張靜態圖片。下載器可以把它轉換成其他格式。<br>
WebM 影片的體積最小，而且畫質損失不明顯。它是預設的選擇。<br>
GIF 圖片的相容性最好，但是體積比較大，而且畫質也比較差，不推薦。<br>
APNG 圖片是無失真壓縮，畫質最好，但體積通常是最大的。<br>
Zip 檔案是原始檔。`,
    `The source file of Pixiv's animated image is a Zip compressed file containing multiple static images. The downloader can convert it to other formats. <br>
WebM video has the smallest size and the image quality loss is not obvious. It is the default choice. <br>
GIF images have the best compatibility, but they are larger in size and the image quality is also poor, so they are not recommended. <br>
APNG images are lossless compression, with the best image quality, but usually the largest in size. <br>
The Zip file is the source file.`,
    `Pixivのアニメーション画像のソースファイルは、複数の静止画を含むZip圧縮ファイルです。ダウンローダーで他の形式に変換できます。<br>
WebM動画はファイルサイズが最も小さく、画質の劣化も目立ちません。デフォルトの選択肢です。<br>
GIF画像は互換性が最も優れていますが、ファイルサイズが大きく、画質も劣るため、あまりお勧めできません。<br>
APNG画像はロスレス圧縮で、画質は最も優れていますが、ファイルサイズが最も大きくなります。<br>
Zipファイルがソースファイルです。`,
    `Pixiv 애니메이션 이미지의 원본 파일은 여러 개의 정적 이미지가 포함된 Zip 압축 파일입니다. 다운로더는 이를 다른 형식으로 변환할 수 있습니다. <br>
WebM 비디오는 크기가 가장 작고 화질 저하가 눈에 띄지 않습니다. 기본 선택 사항입니다. <br>
GIF 이미지는 호환성이 가장 뛰어나지만, 크기가 크고 화질이 좋지 않아 권장하지 않습니다. <br>
APNG 이미지는 무손실 압축으로 화질이 가장 좋지만 일반적으로 크기가 가장 큽니다. <br>
Zip 파일이 원본 파일입니다.`,
    `Исходный файл анимированного изображения Pixiv — это сжатый файл Zip, содержащий несколько статических изображений. Загрузчик может конвертировать его в другие форматы. <br>
Видео WebM имеет наименьший размер, и потеря качества изображения неочевидна. Это выбор по умолчанию. <br>
Изображения GIF имеют лучшую совместимость, но они больше по размеру, а качество изображения также плохое, поэтому они не рекомендуются. <br>
Изображения APNG — это сжатие без потерь, с наилучшим качеством изображения, но обычно самые большие по размеру. <br>
Файл Zip является исходным файлом.`,
  ],
  _webmVideo: [
    'WebM 视频',
    '影片（WebM）',
    'WebM video',
    'WebM ビデオ',
    'WebM 동영상',
    'WebM видео',
  ],
  _gif: [
    'GIF 图片',
    '圖片（GIF）',
    'GIF image',
    'GIF 画像',
    'GIF 이미지',
    'GIF изображение',
  ],
  _apng: [
    'APNG 图片',
    '圖片（APNG）',
    'APNG image',
    'APNG 画像',
    'APNG 이미지',
    'APNG изображение',
  ],
  _zipFile: [
    'Zip 文件',
    '壓縮檔（Zip）',
    'Zip file',
    'ZIP ファイル',
    'Zip 파일',
    'Zip файл',
  ],
  _当前作品个数: [
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
  _已抓取x个用户: [
    '已抓取 {} 个用户',
    '已擷取 {} 個使用者',
    'crawled {} users',
    'クロールされた {} ユーザー',
    '{}명의 유저를 긁어왔습니다',
    'Сканированные {} пользователи',
  ],
  _排行榜进度: [
    '已抓取本页面第{}部分',
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
  _抓取结果为零: [
    '抓取完毕，但没有找到符合筛选条件的作品。<br>请检查“抓取”相关的设置。',
    '擷取完畢，但沒有找到符合篩選條件的作品。<br>請檢查“抓取”相關的設定。',
    'Crawl complete but did not find works that match the filter criteria.<br>Please check the settings related to Crawl.',
    'クロールは終了しましたが、フィルタ条件に一致する作品が見つかりませんでした。<br>クロールに関する設定を確認してください。',
    '긁어오기가 완료되었지만 필터 조건과 일치하는 작품을 찾지 못했습니다.<br>크롤링 관련 설정을 확인하세요.',
    'Вытаскивание завершено, но не найдены работы, соответствующие критериям фильтра.<br>Пожалуйста, проверьте настройки, связанные со сканированием.',
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
  _作品页状态码0: [
    '请求的 URL 不可访问 (0)',
    '要求的 URL 無法存取 (0)',
    'The requested URL is not accessible (0)',
    '要求された URL にアクセスできません (0)',
    '요청한 URL에 접근할 수 없습니다 (0)',
    'Запрашиваемый URL недоступен (0)',
  ],
  _作品页状态码400: [
    '该作品已被删除 (400)',
    '該作品已被刪除 (400)',
    'The work has been deleted (400)',
    '作品は削除されました (400)',
    '이 작품은 삭제되었습니다 (400)',
    'Работа была удалена (400)',
  ],
  _作品页状态码401: [
    '请您登录 Pixiv 账号然后重试。(401)',
    '請您登入 Pixiv 帳號後重試。(401)',
    'Please log in to your Pixiv account and try again. (401)',
    'Pixiv アカウントにログインして、もう一度お試しください。(401)',
    'Pixiv 계정에 로그인 후 다시 시도해주세요. (401)',
    'Пожалуйста, войдите в свою учетную запись Pixiv и попробуйте еще раз. (401)',
  ],
  _作品页状态码403: [
    '无权访问请求的 URL (403)',
    '沒有權限存取要求的 URL (403)',
    'Have no access to the requested URL (403)',
    'リクエストされた URL にアクセスできない (403)',
    '요청한 URL에 접근 권한이 없습니다 (403)',
    'Нет доступа к запрашиваемому URL (403)',
  ],
  _作品页状态码404: [
    '404 not found',
    '404 not found',
    '404 not found',
    '404 not found',
    '404 not found',
    '404 not found',
  ],
  _作品页状态码429: [
    '错误代码：429（请求数量过多）。下载器会重新抓取它。',
    '錯誤程式碼：429（請求數量過多）。下載器会重新抓取它。',
    'Error code: 429 (Too many requests). The downloader will re-crawl it.',
    'エラー コード: 429 (要求が多すぎます)。ダウンローダーはそれを再クロールします。',
    '오류 코드: 429(요청이 너무 많음). 다운로더가 다시 크롤링합니다.',
    'Код ошибки: 429 (Слишком много запросов). Загрузчик будет повторять вытаскивание.',
  ],
  _错误代码: [
    '错误代码',
    '錯誤程式碼',
    'Error code',
    'エラー コード',
    '오류 코드',
    'Код ошибки',
  ],
  _作品页状态码500: [
    'Pixiv 拒绝返回数据 (500)。下载器会重新抓取它。',
    'Pixiv 拒絕返回資料 (500)。下載器会重新抓取它。',
    'Pixiv refuses to return data (500). The downloader will re-crawl it.',
    'ピクシブはデータの返却を拒否します (500)。ダウンローダーはそれを再クロールします。',
    'pixiv는 데이터 반환을 거부합니다 (500). 다운로더가 다시 크롤링합니다.',
    'Pixiv отказывается возвращать данные (500). Загрузчик будет повторять вытаскивание.',
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
  _命名规则: [
    '<span class="key">命名</span>规则',
    '<span class="key">命名</span>規則',
    '<span class="key">Naming</span> rule',
    '<span class="key">命名</span>規則',
    '<span class="key">명명</span> 규칙',
    '<span class="key">Правила</span> названий',
  ],
  _命名规则2: [
    '命名规则',
    '命名規則',
    'Naming rule',
    '命名規則',
    '명명 규칙',
    'Правила названий',
  ],
  _设置文件夹名的提示: [
    '可以使用<span class="key">/</span>建立文件夹。示例：',
    '可以使用斜線(<span class="key">/</span>)建立資料夾。範例：',
    'You can create a directory with <span class="key">/</span>. Example:',
    'フォルダーは<span class="key">/</span>で作成できます。例：',
    '<span class="key">/</span>을 사용하여 디렉토리를 생성할 수 있습니다. 예:',
    'Вы можете создать каталог с помощью <span class="key">/</span>. Пример:',
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
    '默认文件名，如 <span class="blue">44920385_p0</span>',
    '預設檔案名稱，例如：<span class="blue">44920385_p0</span>。',
    'Default file name, for example <span class="blue">44920385_p0</span>',
    'デフォルトのファイル名，例 <span class="blue">44920385_p0</span>',
    '기본 파일명. 예: <span class="blue">44920385_p0</span>',
    'Имя файла по умолчанию, например <span class="blue">44920385_p0</span>',
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
    '宽度和高度。例如：<span class="blue">600x900</span>',
    '寬度和高度。例如：<span class="blue">600x900</span>',
    'Width and height, e.g. <span class="blue">600x900</span>',
    '幅と高さ。例：<span class="blue">600x900</span>',
    '너비와 높이. 예: <span class="blue">600x900</span>',
    'Ширина и высота, напр. <span class="blue">600x900</span>',
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
  _命名标记id_num: [
    '数字 ID，如 <span class="blue">44920385</span>',
    '數字 ID，例如：<span class="blue">44920385</span>。',
    'Number ID, for example <span class="blue">44920385</span>',
    '<span class="blue">44920385</span> などの番号 ID',
    '숫자 ID. 예: <span class="blue">44920385</span>',
    'Идентификатор номера, например <span class="blue">44920385</span>',
  ],
  _命名标记p_num: [
    '图片在作品内的序号，如 <span class="blue">0</span>、<span class="blue">1</span>、<span class="blue">2</span> …… 每个作品都会重新计数。',
    '圖片在作品內的序號，例如：<span class="blue">0</span>、<span class="blue">1</span>、<span class="blue">2</span>……每個作品都將重新計數。',
    'The serial number of the image in the work, such as <span class="blue">0</span>, <span class="blue">1</span>, <span class="blue">2</span> ... Each work will be recounted.',
    '<span class="blue">0</span>、<span class="blue">1</span>、<span class="blue">2</span> など、作品の画像のシリアル番号。各ピースは再集計されます。',
    '작품 안에 있는 번호. 예: <span class="blue">0</span>, <span class="blue">1</span>, <span class="blue">2</span> …… 작품마다 다시 세어봅니다.',
    'Порядковый номер изображения в работе, например, <span class="blue">0</span>, <span class="blue">1</span>, <span class="blue">2</span> .... Каждое произведение будет пересказано',
  ],
  _命名标记tags_trans: [
    '作品的标签列表，附带翻译后的标签（如果有）',
    '作品的標籤清單，包含翻譯後的標籤（如果有的話）。',
    'The tags of the work, with the translated tag (if any)',
    '作品のタグリスト、翻訳付きタグ(あれば)',
    '작품 태그, 번역된 태그 (있다면)',
    'Теги произведения, с тегом перевода (если есть)',
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
    '作品在排行榜中的排名。如 <span class="blue">#1</span>、<span class="blue">#2</span> …… 只能在排行榜页面中使用。',
    '作品在排行榜中的排名。例如：<span class="blue">#1</span>、<span class="blue">#2</span>……只能在排行榜頁面中使用。',
    'The ranking of the work in the ranking pages. Such as <span class="blue">#1</span>, <span class="blue">#2</span> ... Can only be used in ranking pages.',
    '作品のランキング。例え　<span class="blue">#1</span>、<span class="blue">#2</span> …… ランキングページのみで使用できます。',
    '작품의 랭킹. 예: <span class="blue">#1</span>, <span class="blue">#2</span> …… 랭킹 페이지에서만 사용할 수 있습니다.',
    'Рейтинг работы на страницах рейтинга. Например, <span class="blue">#1</span>, <span class="blue">#2</span> ... Может использоваться только на страницах ранжирования.',
  ],
  _命名标记type: [
    '作品类型，分为：<span class="blue">Illustration</span>, <span class="blue">Manga</span>, <span class="blue">Ugoira</span>, <span class="blue">Novel</span>',
    '作品類型，分為：<span class="blue">Illustration</span>, <span class="blue">Manga</span>, <span class="blue">Ugoira</span>, <span class="blue">Novel</span>',
    'The type of work, divided into：<span class="blue">Illustration</span>, <span class="blue">Manga</span>, <span class="blue">Ugoira</span>, <span class="blue">Novel</span>',
    '作品分類は：<span class="blue">Illustration</span>, <span class="blue">Manga</span>, <span class="blue">Ugoira</span>, <span class="blue">Novel</span>',
    '작품 유형: <span class="blue">Illustration</span>, <span class="blue">Manga</span>, <span class="blue">Ugoira</span>, <span class="blue">Novel</span>',
    'Тип работы, разделенный на：<span class="blue">Illustration</span>, <span class="blue">Manga</span>, <span class="blue">Ugoira</span>, <span class="blue">Novel</span>',
  ],
  _命名标记AI: [
    '如果作品是由 AI 生成的，则输出 <span class="blue">AI</span>',
    '如果作品是由 AI 生成的，則輸出 <span class="blue">AI</span>',
    'If the work is generated by AI, output <span class="blue">AI</span>',
    '作品がAIで生成された場合、<span class="blue">AI</span>を出力',
    '작업이 AI로 생성된 경우 <span class="blue">AI</span> 출력',
    'Если работа создана с помощью ИИ, выведите <span class="blue">AI</span>',
  ],
  _命名标记提醒: [
    `你可以使用多个标记，并且可以在标记之间添加自定义文字。例如：pixiv/{id}-title {title}-user {user}<br>
    如果你想把 AI 生成的作品放到单独的文件夹里，可以使用 {AI} 建立文件夹。例如：{user}/{AI}/{id}<br>
    为了防止文件名重复，命名规则里必须含有 {id} 或者 {id_num}{p_num}。`,
    `你可以使用多個標記，並且可以在標記之間新增自定義文字。例如：pixiv/{id}-title {title}-user {user}<br>
    如果你想把 AI 生成的作品放到單獨的資料夾裡，可以使用 {AI} 建立資料夾。例如：{user}/{AI}/{id}<br>
    為了防止檔名重複，命名規則裡必須含有 {id} 或者 {id_num}{p_num}。`,
    `You can use multiple tags and add custom text between tags. For example: pixiv/{id}-title {title}-user {user}<br>
    If you want to put AI-generated works in a separate folder, you can use {AI} to create a folder. For example: {user}/{AI}/{id}<br>
    To prevent duplicate file names, the naming rule must contain {id} or {id_num}{p_num}.`,
    `複数のタグを使用し、タグの間にカスタム テキストを追加できます。例: pixiv/{id}-title {title}-user {user}<br>
    AI生成作品を別のフォルダに入れたい場合は、{AI}を使ってフォルダを作成することができます。例: {user}/{AI}/{id}<br>
    ファイル名の重複を防ぐために、命名規則に {id} または {id_num}{p_num} を含める必要があります。`,
    `여러 태그를 사용하고 태그 사이에 사용자 정의 텍스트를 추가할 수 있습니다. 예: pixiv/{id}-title {title}-user {user}<br>
    AI가 생성한 작품을 별도의 폴더에 넣고 싶다면, {AI}를 사용해 폴더를 만들 수 있습니다. 예: {user}/{AI}/{id}<br>
    파일 이름 중복을 방지하려면 명명 규칙에 {id} 또는 {id_num}{p_num}이 포함되어야 합니다.`,
    `Вы можете использовать несколько тегов и добавлять собственный текст между тегами. Например: pixiv/{id}-title {title}-user {user}<br>
    Если вы хотите поместить созданные ИИ работы в отдельную папку, вы можете использовать {AI} для создания папки. Например: {пользователь}/{AI}/{id}<br>
    Чтобы предотвратить дублирование имен файлов, правило именования должно содержать {id} или {id_num}{p_num}.`,
  ],
  _有些标记并不总是可用的提醒: [
    '有些标记并不总是可用，有时它们可能什么都不输出。',
    '有些標記並不總是可用，有時它們可能什麼都不輸出。',
    'Some tags are not always available, and sometimes they may output nothing.',
    '一部のタグは常に使用できるとは限らず、何も出力しない場合もあります。',
    '일부 태그는 항상 사용할 수 있는 것은 아니며 때로는 아무 것도 출력하지 않을 수도 있습니다.',
    'Некоторые теги не всегда доступны, а иногда могут ничего не выводить.',
  ],
  _命名规则一定要包含id: [
    '为了防止文件名重复，命名规则里一定要包含 {id} 或者 {id_num}{p_num}',
    '為了防止檔名重複，命名規則裡一定要包含 {id} 或者 {id_num}{p_num}。',
    'To prevent duplicate file names, {id} or {id_num}{p_num} must be included in the naming rules.',
    'ファイル名の重複を防ぐために、命名規則には {id} または {id_num}{p_num} を含める必要があります。',
    '파일명이 중복되지 않도록, 명명 규칙에는 {id} 또는 {id_num}{p_num}이 포함되어야 합니다.',
    'Чтобы предотвратить дублирование имен файлов, {id} или {id_num}{p_num} должны быть включены в правила именования.',
  ],
  _文件夹标记PTag: [
    '如果页面里的作品属于同一个标签，则输出这个标签。',
    '如果頁面裡的作品屬於同一個標籤，則輸出這個標籤。',
    'If the works on the page belong to the same tag, then output this tag.',
    'ページ上の作品が同じタグに属している場合は、このタグを出力します。',
    '페이지의 작품이 같은 태그에 속하는 경우 이 태그를 출력합니다.',
    'Если работы на странице относятся к одному и тому же тегу, то выводить этот тег.',
  ],
  _命名标记seriesTitle: [
    '系列标题。',
    '系列標題。',
    'Series title.',
    'シリーズタイトル。',
    '시리즈 제목.',
    'Название серии.',
  ],
  _命名标记seriesOrder: [
    '作品在系列中的序号，如 <span class="blue">#1</span> <span class="blue">#2</span>。',
    '作品在系列中的編號，如 <span class="blue">#1</span> <span class="blue">#2</span>。',
    'The number of the work in the series, such as <span class="blue">#1</span> <span class="blue">#2</span>.',
    'シリーズの中の作品の番号，例え <span class="blue">#1</span> <span class="blue">#2</span>。',
    '시리즈 내 작품 번호. 예: <span class="blue">#1</span> <span class="blue">#2</span>.',
    'Номер работы в серии, например, <span class="blue">#1</span> <span class="blue">#2</span>.',
  ],
  _命名标记seriesId: [
    '系列 ID。',
    '系列 ID。',
    'Series ID.',
    'シリーズ ID。',
    '시리즈 ID.',
    'Идентификатор серии.',
  ],
  _当作品属于一个系列时可用: [
    '当作品属于一个系列时可用。',
    '當作品屬於一個系列時可用。',
    'Available when the work belongs to a series.',
    '作品がシリーズに属している場合に利用できる。',
    '작품이 시리즈에 속할 때 사용할 수 있습니다.',
    'Доступно, если работа принадлежит к серии.',
  ],
  _文件夹标记PTitle: [
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
    'Help',
    'よくある質問',
    '도움말',
    'помощь',
  ],
  _uuid: [
    `下载器检测到下载后的文件名可能异常。如果文件名是一串随机的字母和数字，或者没有使用下载器设置里的命名规则，就表示发生了此问题。<br>
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
    `下載器檢測到下載後的檔名可能異常。如果檔名是一串隨機的字母和數字，或者沒有使用下載器設定裡的命名規則，就表示發生了此問題。<br>
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
    `The downloader detects that the file name after downloading may be abnormal. If the file name is a string of random letters and numbers, or does not use the naming rules in the downloader settings, it means that this problem has occurred. <br>
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
    `ダウンローダーは、ダウンロード後のファイル名が異常である可能性があることを検出しました。ファイル名がランダムな文字と数字の文字列である場合、またはダウンローダー設定の命名規則を使用していない場合は、この問題が発生していることを意味します。<br>
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
    `다운로더가 다운로드 후 파일 이름이 비정상적일 수 있음을 감지했습니다. 파일 이름이 임의의 문자와 숫자로 구성되어 있거나 다운로더 설정의 명명 규칙을 사용하지 않는 경우 이 문제가 발생했음을 의미합니다. <br>
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
    `Загрузчик обнаруживает, что имя файла после загрузки может быть ненормальным. Если имя файла представляет собой строку случайных букв и цифр или не использует правила именования в настройках загрузчика, это означает, что возникла эта проблема. <br>
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
    <br></br>`,

    `<strong>警告</strong>：頻繁且大量的抓取（和下載）可能會導致你的 Pixiv 帳號被封禁。
    <br>
    多數用戶不會遇到這種情況，而且下載器默認會減慢抓取的速度。但如果你的帳戶被封禁，下載器不會承擔任何責任。
    <br>
    如果你計劃進行大量的下載，可以考慮註冊 Pixiv 小號。<br>
    Wiki 有相關說明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8F%B7%E4%B8%8B%E8%BD%BD" target="_blank">使用小號下載</a>
    <br></br>`,

    `<strong>Warning</strong>: Frequent and large-scale crawling (and downloading) may lead to your Pixiv account being banned.
    <br>
    Most users will not encounter this issue, and the downloader will slow down the crawling speed by default. However, if your account is banned, the downloader will not take any responsibility.
    <br>
    If you plan to perform large-scale downloads, consider registering a secondary Pixiv account.<br>
    The Wiki provides related information: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">Using a Secondary Account for Downloading</a>
    <br></br>`,

    `<strong>警告</strong>：頻繁かつ大規模なクロール（およびダウンロード）は、Pixivアカウントの禁止につながる可能性があります。
    <br>
    ほとんどのユーザーはこの問題に遭遇しませんが、ダウンローダーはデフォルトでクロールの速度を遅くします。ただし、アカウントが禁止された場合、ダウンローダーは一切の責任を負いません。
    <br>
    大規模なダウンロードを計画している場合は、Pixivのサブアカウントを登録することを検討してください。<br>
    Wikiに関連情報があります：<a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">サブアカウントを使用したダウンロード</a>
    <br></br>`,

    `<strong>경고</strong>: 빈번하고 대규모의 크롤링(및 다운로드)은 Pixiv 계정이 차단될 수 있습니다.
    <br>
    대부분의 사용자는 이 문제를 겪지 않으며, 다운로더는 기본적으로 크롤링 속도를 늦춥니다. 하지만 계정이 차단되더라도 다운로더는 어떠한 책임도 지지 않습니다.
    <br>
    대규모 다운로드를 계획하고 있다면 Pixiv 보조 계정을 등록하는 것을 고려하세요.<br>
    위키에 관련 정보가 있습니다: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">보조 계정으로 다운로드하기</a>
    <br></br>`,

    `<strong>Предупреждение</strong>: Частый и масштабный краулинг (и загрузка) могут привести к блокировке вашего аккаунта Pixiv.
    <br>
    Большинство пользователей не сталкиваются с этой проблемой, и загрузчик по умолчанию снижает скорость краулинга. Однако, если ваш аккаунт будет заблокирован, загрузчик не несет за это ответственности.
    <br>
    Если вы планируете выполнять масштабные загрузки, рассмотрите возможность регистрации дополнительного аккаунта Pixiv.<br>
    В Вики есть соответствующая информация: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading?id=using-secondary-account-for-downloading" target="_blank">Использование дополнительного аккаунта для загрузки</a>
    <br></br>`,
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
    <br><br>
    下载器的 QQ 群：674991373
    <br>
    如果你有一些问题想要问我，可以加群后直接私聊我。发在群里有时我不能及时看到。
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
    '✓ 下载完毕',
    '✓ 下載完畢',
    '✓ Download complete',
    '✓ ダウンロードが完了しました',
    '✓ 다운로드 완료',
    '✓ Загрузка завершена',
  ],
  _下载完毕2: [
    '下载完毕',
    '下載完畢',
    'Download complete',
    'ダウンロードが完了しました',
    '다운로드 완료',
    'Загрузка завершена',
  ],
  _已暂停: [
    '下载已暂停',
    '下載已暫停',
    'Download is paused',
    'ダウンロードは一時停止中です',
    '다운로드 일시중지',
    'Загрузка приостановлена',
  ],
  _已停止: [
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
    '调整完毕，当前有{}个作品。',
    '調整完畢，目前有 {} 個作品。',
    'The adjustment is complete and now has {} works.',
    '調整が完了し、今、{} の作品があります。',
    '조정이 완료되어, 현재 {}개의 작품이 있습니다.',
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
  _快速收藏: [
    '快速收藏 (Alt + B)',
    '快速收藏 (Alt + B)',
    'Quick bookmarks (Alt + B)',
    'クイックブックマーク (Alt + B)',
    '빠른 북마크 (Alt + B)',
    'Быстрые закладки (Alt + B)',
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
  _自动开始下载的提示: [
    '当“开始下载”状态可用时，自动开始下载，不需要点击下载按钮。',
    '當可下載時自動開始下載，不需要點選下載按鈕。',
    'When the &quot;Start Download &quot; status is available, the download starts automatically and no need to click the download button.',
    '「ダウンロードを開始する」ステータスが利用可能になると、ダウンロードは自動的に開始され、ダウンロードボタンをクリックする必要はありません。',
    '"다운로드 시작" 상태가 활성화되면, 다운로드가 자동으로 시작되고 다운로드 시작 버튼을 클릭할 필요가 없게 됩니다.',
    'При активации этого тумблера загрузка начнется автоматически, без необходимости нажимать кнопку загрузки',
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
    '您可以输入一个作品 id，抓取比它新或者比它旧的作品',
    '可以輸入一個作品 id，擷取比它新或者比它舊的作品。',
    'You can type a work id and crawl works that are newer or older than it',
    '1 つの作品 id を入力することで、それより新しいあるいは古い作品をクロールことができます',
    '작품 ID를 입력하여, 그보다 새로운 혹은 오래된 작품을 긁어올 수 있습니다.',
    'Вы можете ввести идентификатор работы и просмотреть работы, которые новее или старше его',
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
    '由于启用了“预览搜索页面的筛选结果”，本次抓取完成后，下载器不会自动开始下载。<br>这是为了让用户可以在抓取后进一步筛选抓取结果。',
    '由於啟用了“預覽搜尋頁面的篩選結果”，本次抓取完成後，下載器不會自動開始下載。<br>這是為了讓使用者可以在抓取後進一步篩選抓取結果。',
    'Since "Preview filter results of search page" is enabled, the downloader will not automatically start downloading after this crawl is completed.<br>This is to allow users to further filter the crawl results after the crawl.',
    '「検索ページのフィルター結果のプレビュー」が有効になっているため、このクロールが完了した後、ダウンローダーは自動的にダウンロードを開始しません。 <br>これは、ユーザーがクロール後にクロール結果をさらにフィルタリングできるようにするためです。',
    `'검색 페이지 필터 결과 미리보기'가 활성화되어 있으므로 크롤링이 완료된 후 다운로더가 자동으로 다운로드를 시작하지 않습니다. <br>이는 사용자가 크롤링 후 크롤링 결과를 추가로 필터링할 수 있도록 하기 위한 것입니다.`,
    'Поскольку функция «Предварительный просмотр результатов фильтра страницы поиска» включена, загрузчик не начнет загрузку автоматически после завершения сканирования. <br>Это позволит пользователям дополнительно фильтровать результаты сканирования после сканирования.',
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
  _正在下载小说中的插画: [
    '正在下载小说中的插画 {}',
    '正在下載小說中的插畫 {}',
    'Downloading illustrations from the novel {}',
    '小説のイラストをダウンロードする {}',
    '소설에서 삽화 다운로드 {}',
    'Скачивание иллюстраций из романа {}',
  ],
  _下载封面图片: [
    '下载封面图片',
    '下載封面圖片',
    'Download cover image',
    'カバー画像をダウンロード',
    '표지 이미지 다운로드',
    'Загрузить изображение обложки',
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
    `下载器会保存自己的下载记录。每个下载成功（保存到硬盘）的文件都会保存一条下载记录。下载失败的文件不会产生下载记录。<br>
    如果你启用了“不下载重复文件”功能，那么下载器会在下载每一个文件前检查下载记录，如果它是重复文件，下载器就会跳过它（不下载它）。<br>
    <br>
    有两种方式判断一个文件是否是重复文件：<br>
    - “严格”模式会对比三个条件：作品的 ID、上传日期、文件名。如果三个条件都相同，则是重复文件。<br>
    - “宽松”模式只会对比作品 ID 和上传日期，不会对比文件名。如果你希望在修改了文件名规则之后，依然可以跳过之前下载过的文件，则可以选择“宽松”模式。<br>
    <br>
    补充说明：<br>
    - 这不是一个可靠的功能。下载器没有权限读取硬盘上的文件，所以只能依赖自己保存的下载记录。如果你把下载过的文件删除了，下载器是不会知道的，依然会认为文件下载过，从而跳过下载。如果有时你确实需要重新下载，可以关闭此功能。<br>
    - 下载器的下载记录保存在浏览器的 IndexedDB 里。它不是浏览器的下载记录，所以清除浏览器的下载记录不会影响此功能。额外提一句，如果浏览器的下载记录太多，会导致浏览器在启动时卡住一段时间。如果你遇到了此问题，应该清除浏览器的下载记录。<br>
    - 注意：清除浏览器的数据时，清除“Cookie 及其他网站数据”会导致下载器的下载记录被清空！如果你要清理此项，可以提前导出下载记录，以避免丢失下载记录。<br>
    - 如果你使用多个设备或浏览器，可以点击“导出”按钮导出下载器的下载记录，然后在新的设备上导入。<br>
    - 如果你想清空下载器的下载记录，可以点击此设置右边的“清除”按钮。<br>
    `,
    `下載器會儲存自己的下載記錄。每個下載成功（儲存到硬碟）的檔案都會儲存一條下載記錄。下載失敗的檔案不會產生下載記錄。<br>
    如果你啟用了“不下載重複檔案”功能，那麼下載器會在下載每一個檔案前檢查下載記錄，如果它是重複檔案，下載器就會跳過它（不下載它）。<br>
    <br>
    有兩種方式判斷一個檔案是否是重複檔案：<br>
    - “嚴格”模式會對比三個條件：作品的 ID、上傳日期、檔名。如果三個條件都相同，則是重複檔案。<br>
    - “寬鬆”模式只會對比作品 ID 和上傳日期，不會對比檔名。如果你希望在修改了檔名規則之後，依然可以跳過之前下載過的檔案，則可以選擇“寬鬆”模式。<br>
    <br>
    補充說明：<br>
    - 這不是一個可靠的功能。下載器沒有許可權讀取硬碟上的檔案，所以只能依賴自己儲存的下載記錄。如果你把下載過的檔案刪除了，下載器是不會知道的，依然會認為檔案下載過，從而跳過下載。如果有時你確實需要重新下載，可以關閉此功能。<br>
    - 下載器的下載記錄儲存在瀏覽器的 IndexedDB 裡。它不是瀏覽器的下載記錄，所以清除瀏覽器的下載記錄不會影響此功能。額外提一句，如果瀏覽器的下載記錄太多，會導致瀏覽器在啟動時卡住一段時間。如果你遇到了此問題，應該清除瀏覽器的下載記錄。<br>
    - 注意：清除瀏覽器的資料時，清除“Cookie 及其他網站資料”會導致下載器的下載記錄被清空！如果你要清理此項，可以提前匯出下載記錄，以避免丟失下載記錄。<br>
    - 如果你使用多個裝置或瀏覽器，可以點選“匯出”按鈕匯出下載器的下載記錄，然後在新的裝置上匯入。<br>
    - 如果你想清空下載器的下載記錄，可以點選此設定右邊的“清除”按鈕。<br>
    `,
    `This downloader will save its own download history. Each file that is successfully downloaded (saved to disk) will have a download record saved. Files that fail to download will not have a download record. <br>
If you enable the "Do not download duplicate files" feature, the downloader will check the download record before downloading each file. If it is a duplicate file, the downloader will skip it (not download it). <br>
<br>
There are two ways to determine whether a file is a duplicate file: <br>
- "Strict" mode will compare three conditions: work ID, upload date, file name. If all three conditions are the same, it is a duplicate file. <br>
- "Loose" mode will only compare work ID and upload date, not file name. If you want to be able to skip previously downloaded files after modifying the file name rules, you can choose "Loose" mode. <br>
<br>
Additional notes: <br>
- This is not a reliable feature. The downloader does not have permission to read files on the disk, so it can only rely on its own saved download records. If you delete a downloaded file, the downloader will not know and will still think that the file has been downloaded and skip the download. If you do need to re-download sometimes, you can turn this feature off. <br>
- The download history of the Downloader is saved in the browser's IndexedDB. It is not the browser's download history, so clearing the browser's download history will not affect this feature. As an extra note, if the browser has too many download history, it will cause the browser to get stuck for a while when it starts. If you encounter this problem, you should clear the browser's download history. <br>
- Note: When clearing the browser's data, clearing "Cookies and other website data" will cause the Downloader's download history to be cleared! If you want to clear this item, you can export the download history in advance to avoid losing the download history. <br>
- If you use multiple devices or browsers, you can click the "Export" button to export the Downloader's download history, and then import it on a new device. <br>
- If you want to clear the Downloader's download history, you can click the "Clear" button to the right of this setting. <br>
`,
    `このダウンローダーは独自のダウンロード履歴を保存します。正常にダウンロード（ディスクに保存）されたファイルにはダウンロード記録が保存されます。ダウンロードに失敗したファイルにはダウンロード記録は保存されません。<br>
「重複ファイルをダウンロードしない」機能を有効にすると、ダウンローダーは各ファイルをダウンロードする前にダウンロード記録を確認します。重複ファイルの場合は、ダウンローダーはそのファイルをスキップ（ダウンロードしない）します。<br>
<br>
ファイルが重複ファイルかどうかを判断する方法は2つあります。<br>
- 「厳密」モードでは、作品ID、アップロード日、ファイル名の3つの条件を比較します。3つの条件がすべて一致する場合、重複ファイルと判断されます。<br>
- 「緩い」モードでは、作品IDとアップロード日のみを比較し、ファイル名は比較しません。ファイル名ルールを変更した上で、以前にダウンロードしたファイルをスキップしたい場合は、「緩い」モードを選択できます。<br>
<br>
補足事項：<br>
- これは信頼できる機能ではありません。ダウンローダーはディスク上のファイルを読み取る権限がないため、保存されたダウンロード記録のみに依存します。ダウンロード済みのファイルを削除しても、ダウンローダーはそれを認識できず、ファイルがダウンロード済みであると認識してダウンロードをスキップします。再ダウンロードが必要な場合は、この機能をオフにすることができます。<br>
- ダウンローダーのダウンロード履歴はブラウザのIndexedDBに保存されます。これはブラウザのダウンロード履歴ではないため、ブラウザのダウンロード履歴を消去してもこの機能には影響しません。なお、ブラウザにダウンロード履歴が多すぎると、起動時にしばらくフリーズすることがあります。この問題が発生した場合は、ブラウザのダウンロード履歴を消去することをお勧めします。<br>
- 注：ブラウザのデータを消去する際に、「Cookieとその他のウェブサイトデータ」を消去すると、ダウンローダーのダウンロード履歴も消去されます。この項目を消去する場合は、ダウンロード履歴の損失を防ぐために、事前にダウンロード履歴をエクスポートしておくことをお勧めします。 <br>
- 複数のデバイスやブラウザを使用している場合は、「エクスポート」ボタンをクリックしてダウンローダーのダウンロード履歴をエクスポートし、新しいデバイスにインポートすることができます。<br>
- ダウンローダーのダウンロード履歴を消去したい場合は、この設定の右側にある「クリア」ボタンをクリックしてください。<br>
`,
    `이 다운로더는 자체 다운로드 기록을 저장합니다. 성공적으로 다운로드된(디스크에 저장된) 각 파일에는 다운로드 기록이 저장됩니다. 다운로드에 실패한 파일에는 다운로드 기록이 없습니다. <br>
"중복 파일 다운로드 안 함" 기능을 활성화하면 다운로더는 각 파일을 다운로드하기 전에 다운로드 기록을 확인합니다. 중복 파일인 경우, 다운로더는 해당 파일을 건너뜁니다(다운로드하지 않습니다). <br>
<br>
파일이 중복 파일인지 확인하는 방법은 두 가지가 있습니다. <br>
- "엄격" 모드는 작업 ID, 업로드 날짜, 파일 이름의 세 가지 조건을 비교합니다. 세 가지 조건이 모두 동일하면 중복 파일입니다. <br>
- "느슨한" 모드는 작업 ID와 업로드 날짜만 비교하며 파일 이름은 비교하지 않습니다. 파일 이름 규칙을 수정한 후 이전에 다운로드한 파일을 건너뛰려면 "느슨한" 모드를 선택하세요. <br>
<br>
추가 참고 사항: <br>
- 이 기능은 신뢰할 수 없습니다. 다운로더는 디스크에 있는 파일을 읽을 권한이 없으므로 자체 저장된 다운로드 기록에만 의존합니다. 다운로드한 파일을 삭제하면 다운로더는 해당 파일이 다운로드된 것으로 인식하지 못하고 다운로드를 건너뜁니다. 다시 다운로드해야 하는 경우 이 기능을 끌 수 있습니다. <br>
- 다운로더의 다운로드 기록은 브라우저의 IndexedDB에 저장됩니다. 브라우저의 다운로드 기록이 아니므로 브라우저의 다운로드 기록을 삭제해도 이 기능에는 영향을 미치지 않습니다. 참고로, 브라우저에 다운로드 기록이 너무 많으면 브라우저가 시작 시 잠시 멈춥니다. 이 문제가 발생하면 브라우저의 다운로드 기록을 삭제해야 합니다. <br>
- 참고: 브라우저 데이터를 삭제할 때 "쿠키 및 기타 웹사이트 데이터"를 삭제하면 다운로더의 다운로드 기록이 삭제됩니다! 이 항목을 삭제하려면 다운로드 기록을 미리 내보내어 다운로드 기록이 손실되는 것을 방지할 수 있습니다. <br>
- 여러 기기 또는 브라우저를 사용하는 경우, "내보내기" 버튼을 클릭하여 다운로더의 다운로드 기록을 내보낸 후 새 기기로 가져올 수 있습니다. <br>
- 다운로더의 다운로드 기록을 지우려면 이 설정 오른쪽에 있는 "지우기" 버튼을 클릭하세요. <br>
`,
    `Этот загрузчик сохранит собственную историю загрузок. Каждый успешно загруженный файл (сохраненный на диск) будет иметь сохраненную запись загрузки. Файлы, которые не удалось загрузить, не будут иметь записи загрузки. <br>
Если вы включите функцию «Не загружать дублирующиеся файлы», загрузчик будет проверять запись загрузки перед загрузкой каждого файла. Если это дубликат файла, загрузчик пропустит его (не загрузит). <br>
<br>
Есть два способа определить, является ли файл дубликатом: <br>
- «Строгий» режим будет сравнивать три условия: идентификатор работы, дату загрузки, имя файла. Если все три условия одинаковы, это дубликат файла. <br>
- «Свободный» режим будет сравнивать только идентификатор работы и дату загрузки, но не имя файла. Если вы хотите иметь возможность пропускать ранее загруженные файлы после изменения правил имен файлов, вы можете выбрать «Свободный» режим. <br>
<br>
Дополнительные примечания: <br>
- Это ненадежная функция. Загрузчик не имеет разрешения на чтение файлов на диске, поэтому он может полагаться только на свои собственные сохраненные записи загрузок. Если вы удалите загруженный файл, загрузчик не узнает об этом и все равно будет думать, что файл был загружен, и пропустит загрузку. Если вам иногда нужно повторно загрузить файл, вы можете отключить эту функцию. <br>
- История загрузок Загрузчика сохраняется в IndexedDB браузера. Это не история загрузок браузера, поэтому очистка истории загрузок браузера не повлияет на эту функцию. В качестве дополнительного примечания, если у браузера слишком много истории загрузок, это приведет к тому, что браузер зависнет на некоторое время при запуске. Если вы столкнулись с этой проблемой, вам следует очистить историю загрузок браузера. <br>
- Примечание: при очистке данных браузера очистка «Файлов cookie и других данных веб-сайтов» приведет к очистке истории загрузок Загрузчика! Если вы хотите очистить этот элемент, вы можете заранее экспортировать историю загрузок, чтобы не потерять историю загрузок. <br>
- Если вы используете несколько устройств или браузеров, вы можете нажать кнопку «Экспорт», чтобы экспортировать историю загрузок Downloader, а затем импортировать ее на новое устройство. <br>
- Если вы хотите очистить историю загрузок Downloader, вы можете нажать кнопку «Очистить» справа от этой настройки. <br>`,
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
  _跳过下载因为: [
    '跳过 {} 因为：',
    '跳過 {} 因為：',
    'Skipping {} because: ',
    '{} をスキップします。理由: ',
    '{}를 건너뜁니다. 이유: ',
    'Пропустить {}, потому что: ',
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
  _无损: ['无损', '無損', 'Lossless', 'ロスレス', '무손실', 'Без потерь'],
  _文件名长度限制: [
    '文件名<span class="key">长度</span>限制',
    '檔案名稱<span class="key">長度</span>限制',
    'File name <span class="key">length</span> limit',
    'ファイル名の<span class="key">長さ</span>制限',
    '파일명 <span class="key">길이</span> 제한',
    'Лимит <span class="key">длины</span> имени файла',
  ],
  _文件名长度限制的说明: [
    `如果文件名超长，浏览器可能会显示另存为窗口，让用户手动处理。<br>
    通常你不需要启用这个设置，因为 Windows 上的浏览器通常会自动截断超长的部分。<br>
    但是在其他操作系统里，或者把文件保存到网络驱动器时，浏览器可能不会自动截断文件名，从而出现另存为窗口。<br>
    如果你认为有必要，可以启用此设置，下载器会截断文件名里超长的部分。<br>
    建议设置小于 256 的数字。默认值是 200。`,
    `如果檔名超長，瀏覽器可能會顯示另存為視窗，讓使用者手動處理。<br>
    通常你不需要啟用這個設定，因為 Windows 上的瀏覽器通常會自動截斷超長的部分。<br>
    但是在其他作業系統裡，或者把檔案儲存到網路驅動器時，瀏覽器可能不會自動截斷檔名，從而出現另存為視窗。<br>
    如果你認為有必要，可以啟用此設定，下載器會截斷檔名裡超長的部分。<br>
    建議設定小於 256 的數字。預設值是 200。`,
    `If the file name is too long, the browser may display a Save As window for the user to manually process it. <br>
Usually you don't need to enable this setting, because browsers on Windows usually automatically truncate the overlong part. <br>
However, on other operating systems, or when saving files to a network drive, the browser may not automatically truncate the file name, and the Save As window may appear. <br>
If you think it is necessary, you can enable this setting and the downloader will truncate the overlong part of the file name. <br>
It is recommended to set a number less than 256, the default value is 200.`,
    `ファイル名が長すぎる場合、ブラウザはユーザーが手動で処理できるように「名前を付けて保存」ウィンドウを表示することがあります。<br>
通常、Windows のブラウザは長すぎる部分を自動的に切り捨てるため、この設定を有効にする必要はありません。<br>
ただし、他のオペレーティングシステムの場合、またはファイルをネットワークドライブに保存する場合、ブラウザはファイル名を自動的に切り捨てず、「名前を付けて保存」ウィンドウが表示されることがあります。<br>
必要と思われる場合は、この設定を有効にすると、ダウンローダーはファイル名の長すぎる部分を切り捨てます。<br>
256 未満の数値を設定することをお勧めします。デフォルト値は 200 です。`,
    `파일 이름이 너무 길면 브라우저에 사용자가 직접 처리할 수 있는 '다른 이름으로 저장' 창이 표시될 수 있습니다. <br>
일반적으로 Windows 브라우저는 긴 부분을 자동으로 잘라내기 때문에 이 설정을 활성화할 필요가 없습니다. <br>
하지만 다른 운영 체제에서 파일을 저장하거나 네트워크 드라이브에 저장할 때 브라우저가 파일 이름을 자동으로 자르지 않고 '다른 이름으로 저장' 창이 나타날 수 있습니다. <br>
필요하다고 생각되면 이 설정을 활성화하여 다운로더가 파일 이름의 긴 부분을 잘라냅니다. <br>
256보다 작은 값으로 설정하는 것이 좋으며, 기본값은 200입니다.`,
    `Если имя файла слишком длинное, браузер может отобразить окно «Сохранить как», чтобы пользователь мог вручную обработать его. <br>
Обычно вам не нужно включать этот параметр, поскольку браузеры в Windows обычно автоматически обрезают слишком длинную часть. <br>
Однако в других операционных системах или при сохранении файлов на сетевой диск браузер может не автоматически обрезать имя файла, и может появиться окно «Сохранить как». <br>
Если вы считаете это необходимым, вы можете включить этот параметр, и загрузчик обрежет слишком длинную часть имени файла. <br>
Рекомендуется устанавливать число меньше 256, значение по умолчанию — 200.`,
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
    '下载器的<span class="key">收藏</span>功能 (✩)',
    '下載器的<span class="key">收藏</span>功能 (✩)',
    `Downloader' <span class="key">bookmark</span> function (✩)`,
    'ダウンローダーの<span class="key">ブックマーク</span>機能 (✩)',
    '다운로더의 <span class="key">북마크</span> 기능 (☆)',
    'Функция <span class="key">закладки</span> загрузчика (✩)',
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
  _全部: ['全部', '全部', 'All', '全部', '전부', 'Все'],
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
  _导出关注列表CSV: [
    '导出关注的用户列表（CSV）',
    '匯出關注的使用者列表（CSV）',
    'Export followed users list (CSV)',
    'フォローされているユーザーのリストをエクスポートする（CSV）',
    '팔로우한 사용자 목록 내보내기 (CSV)',
    'Экспорт списка отслеживаемых пользователей (CSV)',
  ],
  _导出关注列表: [
    '导出关注的用户列表（JSON）',
    '匯出關注的使用者列表（JSON）',
    'Export followed users list (JSON)',
    'フォローされているユーザーのリストをエクスポートする（JSON）',
    '팔로우한 사용자 목록 내보내기 (JSON)',
    'Экспорт списка отслеживаемых пользователей (JSON)',
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
  _为作品建立单独的文件夹: [
    '为<span class="key">每个</span>作品建立单独的文件夹',
    '為<span class="key">每個</span>作品建立單獨的資料夾',
    'Create a separate folder for <span class="key">each</span> work',
    '作品ごとに<span class="key">別</span>フォルダを作成',
    '작품마다 <span class="key">별도</span>의 디렉토리 생성',
    'Создайте отдельную папку для <span class="key">каждой</span> работы',
  ],
  _用idm_num代替id: [
    '这里应该使用 {id_num} 代替 {id}',
    '這裡應該使用 {id_num} 代替 {id}',
    'Here {id_num} should be used instead of {id}',
    'ここでは、{id} の代わりに {id_num} を使用する必要があります',
    '여기서는 {id}대신 {id_num}을 사용해야 합니다',
    'Здесь {id_num} следует использовать вместо {id}',
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
  _把r18作品存入指定的文件夹里: [
    '把 <span class="key">R-18(G)</span> 作品存入指定的文件夹里',
    '把 <span class="key">R-18(G)</span> 作品存入指定的資料夾裡',
    'Save the <span class="key">R-18(G)</span> works in the designated folder',
    '<span class="key">R-18(G)</span> の作品を指定のフォルダに入れる',
    '<span class="key">R-18(G)</span> 작품을 지정된 디렉토리에 저장',
    'Сохраните <span class="key">R-18(G)</span> работы в указанной папке',
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
    建议您在浏览器的下载设置中关闭“下载前询问每个文件的保存位置”，否则保存每个文件时都会显示另存为对话框。
    <br><br>
    下载器默认启用了一些增强功能，这可能会导致 Pixiv 的一些页面样式产生变化。你可以在下载器的“更多”标签页里启用或关闭这些功能。
    <br><br>
    下载器的 Wiki：<a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `點擊網頁右側的藍色按鈕可以打開下載器面板。
    <br><br>
    下載的文件保存在瀏覽器的下載目錄裡。如果您想保存到其他位置，需要修改瀏覽器的下載目錄。
    <br><br>
    建議您在瀏覽器的下載設置中關閉“下載前詢問每個文件的保存位置”，否則保存每個文件時都會顯示另存為對話框。
    <br><br>
    下載器默認開啟了一些增強功能，這可能會導致 Pixiv 的一些頁面樣式產生變化。您可以在下載器的“更多”標籤頁中啟用或關閉這些功能。
    <br><br>
    下載器的 Wiki：<a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `Click the blue button on the right side of the webpage to open the downloader panel.
    <br><br>
    Downloaded files are saved in the browser's download directory. If you want to save them to another location, you need to change the browser's download directory.
    <br><br>
    It is recommended to disable "Ask where to save each file before downloading" in the browser's download settings, otherwise a save-as dialog will appear for each file.
    <br><br>
    The downloader enables some enhanced features by default, which may cause changes to the style of some Pixiv pages. You can enable or disable these features in the "More" tab of the downloader.
    <br><br>
    Downloader Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `ウェブページの右側にある青いボタンをクリックすると、ダウンローダーパネルが開きます。
    <br><br>
    ダウンロードしたファイルはブラウザのダウンロードディレクトリに保存されます。別の場所に保存したい場合は、ブラウザのダウンロードディレクトリを変更する必要があります。
    <br><br>
    ブラウザのダウンロード設定で「ダウンロード前に各ファイルの保存場所を確認する」をオフにすることをお勧めします。そうしないと、ファイルを保存するたびに「名前を付けて保存」ダイアログが表示されます。
    <br><br>
    ダウンローダーはデフォルトでいくつかの拡張機能を有効にしており、これによりPixivの一部のページのスタイルが変更されることがあります。これらの機能は、ダウンローダーの「その他」タブで有効または無効にできます。
    <br><br>
    ダウンローダーのWiki：<a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `웹페이지 오른쪽의 파란색 버튼을 클릭하면 다운로더 패널이 열립니다.
    <br><br>
    다운로드한 파일은 브라우저의 다운로드 디렉토리에 저장됩니다. 다른 위치에 저장하려면 브라우저의 다운로드 디렉토리를 변경해야 합니다.
    <br><br>
    브라우저의 다운로드 설정에서 "다운로드 전에 각 파일의 저장 위치를 묻기"를 비활성화하는 것이 좋습니다. 그렇지 않으면 파일을 저장할 때마다 "다른 이름으로 저장" 대화 상자가 나타납니다.
    <br><br>
    다운로더는 기본적으로 몇 가지 향상된 기능을 활성화하며, 이로 인해 Pixiv의 일부 페이지 스타일이 변경될 수 있습니다. 이러한 기능은 다운로더의 "더보기" 탭에서 활성화하거나 비활성화할 수 있습니다.
    <br><br>
    다운로더 위키: <a href="https://xuejianxianzun.github.io/PBDWiki/" target="_blank">https://xuejianxianzun.github.io/PBDWiki/</a>
    <br><br>`,

    `Нажмите на синюю кнопку справа на веб-странице, чтобы открыть панель загрузчика.
    <br><br>
    Загруженные файлы сохраняются в папке загрузок браузера. Если вы хотите сохранить их в другое место, необходимо изменить папку загрузок в настройках браузера.
    <br><br>
    Рекомендуется отключить в настройках загрузки браузера опцию "Запрашивать место сохранения каждого файла перед загрузкой", иначе при сохранении каждого файла будет отображаться диалог "Сохранить как".
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
  _根据作品类型自动建立文件夹: [
    '根据作品<span class="key">类型</span>自动建立文件夹',
    '根據作品<span class="key">類型</span>自動建立資料夾',
    'Create folders based on the <span class="key">type</span> of work',
    '作品<span class="key">種類</span>に応じてフォルダを自動作成',
    '작품 <span class="key">유형</span>에 따라 자동으로 디렉토리 생성',
    'Создание папок на основе <span class="key">вида</span> работы',
  ],
  _根据作品类型自动建立文件夹的说明: [
    `插画的文件夹名字：Illustration<br>
漫画的文件夹名字：Manga<br>
动图的文件夹名字：Ugoira<br>
小说的文件夹名字：Novel`,
    `插畫的資料夾名字：Illustration<br>
漫畫的資料夾名字：Manga<br>
動圖的資料夾名字：Ugoira<br>
小說的資料夾名字：Novel`,
    `Illustration folder name: Illustration<br>
Manga folder name: Manga<br>
Ugoira folder name: Ugoira<br>
Novel folder name: Novel`,
    `イラストフォルダ名：Illustration<br>
漫画フォルダ名：Manga<br>
うごイラフォルダ名：Ugoira<br>
小説フォルダ名: Novel`,
    `일러스트 폴더 이름: Illustration<br>
만화 폴더 이름: Manga<br>
움직이는 일러스트 폴더 이름: Ugoira<br>
소설 폴더 이름: Novel`,
    `Имя папки с Иллюстрации: Illustration<br>
Имя папки Манга: Manga<br>
Имя папки Ugoira(гиф): Ugoira<br>
Имя папки Новеллы: Novel`,
  ],
  _使用第一个匹配的tag建立文件夹: [
    '使用第一个匹配的<span class="key">标签</span>建立文件夹',
    '使用第一個符合的<span class="key">標籤</span>建立資料夾',
    'Create a folder with the first matched <span class="key">tag</span>',
    '最初の一致する<span class="key">タグ</span>にフォルダを作成',
    '첫 번째 일치하는 <span class="key">태그</span>로 디렉토리 생성',
    'Создать папку с первым совпавшим <span class="key">тегом</span>',
  ],
  _使用匹配的tag建立文件夹的说明: [
    '如果作品的标签列表里含有用户设置的标签，就会使用这个标签建立文件夹（仅限第一个匹配到的标签）',
    '如果作品的標籤列表裡含有使用者設定的標籤，就會使用這個標籤建立資料夾（僅限第一個匹配到的標籤）',
    'If the tag list of the work contains a tag set by the user, this tag will be used to create a folder (Only the first matching tag)',
    '作品のタグリストにユーザーが設定したタグが含まれている場合、そのタグを使用してフォルダが作成されます。(最初に一致するタグのみ)',
    '작품의 태그에 유저가 설정한 태그가 포함되어 있다면, 태그를 사용하여 디렉토리를 생성합니다. (첫 번째 일치하는 태그만)',
    'Если в списке тегов работы есть тег, заданный пользователем, этот тег будет использован для создания папки (Только первый совпадающий тег)',
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
  _多图作品只下载前几张图片: [
    `多图作品只抓取<span class="key">前几张</span>图片`,
    `多圖作品只抓取<span class="key">前幾張</span>圖片`,
    `Multi-image works only crawl the <span class="key">first few</span> images`,
    `マルチ画像作品は<span class="key">最初の数枚</span>の画像のみクロールします`,
    `멀티 이미지 작품은 <span class="key">처음 몇 장</span> 이미지만 크롤링합니다`,
    `Многоизображные работы загружают только <span class="key">первые несколько</span> изображений`,
  ],
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
    '为每个作品生成一个 TXT 文件，保存它的元数据。',
    '為每個作品生成一個 TXT 檔案，儲存它的元資料。',
    'Generates a TXT file for each work, storing its metadata.',
    '各作品のメタデータを保存する TXT ファイルを生成し、',
    '각 작품에 대한 TXT 파일을 생성하여 해당 메타데이터를 저장합니다.',
    'Создает TXT-файл для каждой работы, сохраняя ее метаданные.',
  ],
  _在不同的页面类型中使用不同的命名规则: [
    '在不同的页面类型中使用<span class="key">不同</span>的命名规则',
    '在不同的頁面類型中使用<span class="key">不同</span>的命名規則',
    'Use <span class="key">different</span> naming rules in different page types',
    'ページの種類によって<span class="key">異なる</span>命名規則を使用',
    '페이지 유형에 따라 <span class="key">다른</span> 명명 규칙 사용',
    'Использовать <span class="key">различные</span> правила именования в разных типах страниц',
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
    `在下载器的设置里高亮显示关键字，以便你可以快速找到需要的设置。<br>在部分语言里无效，因为我不熟悉这些语言，所以我没有设置高亮的文字。`,
    `在下載器的設定裡高亮顯示關鍵字，以便你可以快速找到需要的設定。<br>在部分語言裡無效，因為我不熟悉這些語言，所以我沒有設定高亮的文字。`,
    `Highlight keywords in the downloader settings so you can quickly find the settings you need. <br>It doesn't work in some languages, because I'm not familiar with these languages, so I didn't set the highlighted text.`,
    `ダウンローダー設定でキーワードを強調表示して、必要な設定をすばやく見つけられるようにします。<br>一部の言語では機能しません。これらの言語に精通していないため、強調表示されたテキストを設定しませんでした。`,
    `다운로더 설정에서 키워드를 강조 표시하면 필요한 설정을 빠르게 찾을 수 있습니다.<br>일부 언어에서는 작동하지 않습니다. 해당 언어에 익숙하지 않아서 강조 표시된 텍스트를 설정하지 않았습니다.`,
    `Выделите ключевые слова в настройках загрузчика, чтобы можно было быстро найти нужные настройки. <br>Это не работает на некоторых языках, так как я не знаком с этими языками, поэтому я не устанавливал выделение текста.`,
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
  _只有一个抓取结果时不建立文件夹: [
    '只有一个抓取结果时<span class="key">不建立</span>文件夹',
    '只有一個擷取結果時<span class="key">不建立</span>資料夾',
    '<span class="key">Do not create</span> a folder when there is only one crawl result',
    'クロール結果が１つのみの場合、<span class="key">フォルダを作成しない</span>',
    '긁어오기 결과가 하나일 때 디렉토리 <span class="key">생성하지 않기</span>',
    'Когда есть только один результат сканирования, <span class="key">не создавать</span> папку',
  ],
  _只有一个抓取结果时不建立文件夹的提示: [
    '当只有一个抓取结果时生效。',
    '當只有一個抓取結果時生效。',
    'Takes effect when there is only one crawl result.',
    'クロール結果が 1 つだけの場合に有効になります。',
    '크롤링 결과가 하나만 있는 경우 적용됩니다.',
    'Вступает в силу, когда есть только один результат сканирования.',
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
    '您可以启用“减慢抓取速度”功能来减少 429 问题出现的概率。',
    '您可以啟用“減慢抓取速度”功能來減少 429 問題出現的機率。',
    'You can reduce the chances of 429 issues by enabling the "Slow down crawl" feature.',
    '"クロールを遅くする" 機能を有効にすると、429 の問題が発生する可能性を減らすことができます。',
    '"천천히 크롤링" 기능을 활성화하면 429 문제 발생 가능성을 줄일 수 있습니다.',
    'Вы можете снизить вероятность возникновения ошибок 429, включив функцию «Замедлить сканирование».',
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
    '作品总数为 0，Pixiv 可能拒绝了此次抓取。请稍后重试。',
    '作品總數為 0，Pixiv 可能拒絕了此次抓取。請稍後重試。',
    'The total number of works is 0, Pixiv may have refused this crawl. Please try again later.',
    '作品の総数は 0 です。 Pixivがこのクロールを拒否した可能性があります。 後でもう一度やり直してください。',
    '총 작품 수가 0개입니다, Pixiv가 이번 긁어오기를 거부한 것으로 보입니다. 잠시 후에 다시 시도해주세요.',
    'Общее количество работ равно 0, возможно, Pixiv блокирует сканирование. Пожалуйста, повторите попытку позже.',
  ],
  _优化预览作品功能: [
    '优化“预览作品”功能',
    '最佳化“預覽作品”功能',
    'Optimize the "Preview Works" function',
    '「作品のプレビュー」機能を最適化する',
    '"작품 미리보기" 기능 최적화',
    'Оптимизация "Предварительного просмотра работ" функция',
  ],
  _设定资料: [
    '设定资料',
    '設定資料',
    'Reference materials',
    '設定資料',
    '설정 자료',
    'Справочные материалы',
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
  _不抓取多图作品的最后一张图片: [
    '不抓取多图作品的<span class="key">最后一张</span>图片',
    '不抓取多圖作品的<span class="key">最後一張</span>圖片',
    'Do not crawl the <span class="key">last image</span> of multi-image works',
    'マルチ画像作品の<span class="key">最後の画像</span>をつかまないでください',
    '여러 이미지의 <span class="key">마지막 이미지</span> 긁어오지 않기',
    'Не сканировать <span class="key">последнее изображение</span> в много картинных работах',
  ],
  _下载小说的封面图片: [
    '下载小说的<span class="key">封面</span>图片',
    '下載小說的<span class="key">封面</span>圖片',
    'Download the <span class="key">cover</span> image of the novel',
    '小説の<span class="key">表紙</span>画像をダウンロード',
    '소설 <span class="key">커버</span> 이미지 다운로드',
    'Скачать изображение <span class="key">обложки</span> новеллы',
  ],
  _预览动图: [
    '<span class="key">预览</span>动图',
    '<span class="key">預覽</span>動圖',
    '<span class="key">Preview</span> Ugoira',
    '<span class="key">うごイラ</span>のプレビュー',
    '움직이는 일러스트 <span class="key">미리보기</span>',
    '<span class="key">Превью</span> Ugoira(анимации)',
  ],
  _过度访问警告警告: [
    '下载器检测到你可能收到了 pixiv 的警告消息，这通常是因为过度下载导致的。<br><strong>当你再次被警告时，你会被 Pixiv 封号。</strong><br>我建议你减少下载数量，或者使用新的账号进行下载。',
    '下載器檢測到你可能收到了 pixiv 的警告訊息，這通常是因為過度下載導致的。<br><strong>當你再次被警告時，你會被 Pixiv 封號。</strong><br>我建議你減少下載數量，或者使用新的賬號進行下載。',
    'The downloader has detected that you may have received a warning message from pixiv, usually due to excessive downloads.<br><strong>When you are warned again, you will be banned from Pixiv. </strong><br>I suggest you reduce your downloads, or use a new account to download.',
    'ダウンロードが多すぎるため、pixivから警告メッセージが届いた可能性があることをダウンローダーが検出しました。<br><strong>再度警告を受けた場合、Pixivから追放されます。 </strong><br>ダウンロード数を減らすか、新しいアカウントを使用してダウンロードすることをお勧めします。',
    '다운로더는 일반적으로 과도한 다운로드로 인해 pixiv에서 경고 메시지를 수신했을 수 있음을 감지했습니다.<br><strong>다시 경고를 받으면 Pixiv에서 차단됩니다. </strong><br>다운로드를 줄이거나 새 계정을 사용하여 다운로드하는 것이 좋습니다.',
    'Программа загрузки обнаружила, что вы могли получить предупреждающее сообщение от pixiv, обычно из-за чрезмерной загрузки.<br><strong>Когда вы снова получите предупреждение, вы будете заблокированы в Pixiv. </strong><br>Я предлагаю вам сократить количество загрузок или использовать новую учетную запись для загрузки.',
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
    '查看作品大图时，按快捷键 <span class="blue">D</span> 可以下载这个作品。<br>按快捷键 <span class="blue">C</span> 仅下载当前显示的这张图片。',
    '檢視作品大圖時，按快捷鍵 <span class="blue">D</span> 可以下載這個作品。<br>按快捷鍵 <span class="blue">C</span> 僅下載當前顯示的這張圖片。',
    'When viewing the large image of the work, press the shortcut key <span class="blue">D</span> to download the work.<br>Press the shortcut key <span class="blue">C</span> to download only the currently displayed image.',
    '作品の大きな画像をご覧になる場合、ショートカット キー <span class="blue">D</span> を押すと、作品をダウンロードできます。<br>ショートカット キー <span class="blue">C</span> を押して、現在表示されている画像のみをダウンロードします。',
    '작품의 큰 그림을 볼 때 단축키 <span class="blue">D</span>를 누르면 작품을 다운로드할 수 있습니다. <br>현재 표시된 이미지만 다운로드하려면 단축키 <span class="blue">C</span>를 누르세요.',
    'При просмотре большого изображения работы нажмите горячую клавишу <span class="blue">D</span>, чтобы загрузить работу. <br>Нажмите горячую клавишу <span class="blue">C</span>, чтобы загрузить только отображаемое в данный момент изображение.',
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
    '推荐用法：增量抓取新作品。例如在关注的用户的新作品页面里，设置抓取页数为 2，然后启动定时抓取。这样下载器可以自动下载新作品。<br>建议启用“不下载重复文件”功能，以避免下载重复的文件。',
    '推薦用法：增量抓取新作品。例如在關注的使用者的新作品頁面裡，設定抓取頁數為 2，然後啟動定時抓取。這樣下載器可以自動下載新作品。<br>建議啟用“不下載重複檔案”功能，以避免下載重複的檔案。',
    'Recommended usage: Fetch new work incrementally. For example, in the new work page of the user you follow, set the number of crawled pages to 2, and then start timing crawling. This way the downloader can automatically download new works.<br>It is recommended to enable the "Do not download duplicate files" feature to avoid downloading duplicate files.',
    '推奨される使用法: 新しい作業を段階的にフェッチします。 たとえば、フォローしているユーザーの新しい作品ページで、クロールされたページの数を 2 に設定し、クロールのタイミングを開始します。 このようにして、ダウンローダーは新しい作品を自動的にダウンロードできます。<br>重複ファイルのダウンロードを避けるために、「重複ファイルをダウンロードしない」機能を有効にすることをお勧めします。',
    '권장 사용법: 새 작업을 점진적으로 가져옵니다. 예를 들어 팔로우하는 사용자의 새 작업 페이지에서 크롤링 페이지 수를 2로 설정한 다음 타이밍 크롤링을 시작합니다. 이렇게 하면 다운로더가 자동으로 새 작품을 다운로드할 수 있습니다.<br>중복 파일 다운로드를 방지하기 위해 "중복 파일 다운로드 금지" 기능을 활성화하는 것이 좋습니다.',
    'Рекомендуемое использование: получать новую работу постепенно. Например, на новой рабочей странице пользователя, за которым вы следите, установите количество просканированных страниц равным 2, а затем запустите сканирование по времени. Таким образом, загрузчик может автоматически загружать новые работы.<br>Рекомендуется включить функцию "Не загружать дубликаты файлов", чтобы избежать загрузки дубликатов файлов.',
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
    '发生错误，原因：',
    '發生錯誤，原因：',
    'An error occurred due to:',
    '次の理由でエラーが発生しました:',
    '다음으로 인해 오류가 발생했습니다.',
    'Произошла ошибка по причине:',
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
    '修复 bug',
    '修復 bug',
    'fix bugs',
    'バグを修正',
    '버그 수정',
    'Баг фикс',
  ],
  _修复已知问题: [
    '修复已知问题。',
    '修復已知問題。',
    'fix known issues.',
    '既知の問題を修正する。',
    '알려진 문제 수정。',
    'исправить известные проблемы。',
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
    '✓ 导出日志',
    '✓ 匯出日誌',
    '✓ Export log',
    '✓ ログのエクスポート',
    '✓ 내보내기 로그',
    '✓ Экспорт журнала',
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
  _Chrome108版本转换WebM失败的问题: [
    '从 Chrome 108 版本开始，浏览器的一些变化导致下载器转换 WebM 视频失败。<br>现已修复转换功能。',
    '從 Chrome 108 版本開始，瀏覽器的一些變化導致下載器轉換 WebM 影片失敗。<br>現已修復轉換功能。',
    'Starting with Chrome version 108, some changes in the browser caused the downloader to fail to convert WebM videos. <br>The conversion function is now fixed.',
    'Chrome バージョン 108 以降、ブラウザーの一部の変更により、ダウンローダーが WebM ビデオの変換に失敗しました。 <br>変換機能を修正しました。',
    'Chrome 버전 108부터 브라우저의 일부 변경으로 인해 다운로더가 WebM 비디오를 변환하지 못했습니다. <br>변환 기능이 수정되었습니다.',
    'Начиная с Chrome версии 108, некоторые изменения в браузере приводили к тому, что загрузчик не мог конвертировать видео WebM. <br>Функция преобразования теперь исправлена.',
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
  { "id": "130827095", "type": "illusts" },
  { "id": "130816057", "type": "illusts" },
  { "id": "130811075", "type": "novel" },
  { "id": "130808918", "type": "novel" }
]
</pre>
type 可以是 "illusts" 或 "novel"。`,
    `請選擇一個 JSON 檔案。它的程式碼格式如下：<pre>
[
  { "id": "130827095", "type": "illusts" },
  { "id": "130816057", "type": "illusts" },
  { "id": "130811075", "type": "novel" },
  { "id": "130808918", "type": "novel" }
]
</pre>
type 可以是 "illusts" 或 "novel"。`,
    `Please select a JSON file. Its code format is as follows:
<pre>
[
  { "id": "130827095", "type": "illusts" },
  { "id": "130816057", "type": "illusts" },
  { "id": "130811075", "type": "novel" },
  { "id": "130808918", "type": "novel" }
]
</pre>
type can be "illusts" or "novel".`,
    `JSONファイルを選択してください。コード形式は次のとおりです。
<pre>
[
  { "id": "130827095", "type": "illusts" },
  { "id": "130816057", "type": "illusts" },
  { "id": "130811075", "type": "novel" },
  { "id": "130808918", "type": "novel" }
]
</pre>
type は "illusts" または "novel" です。`,
    `JSON 파일을 선택하세요. 코드 형식은 다음과 같습니다.
<pre>
[
  { "id": "130827095", "type": "illusts" },
  { "id": "130816057", "type": "illusts" },
  { "id": "130811075", "type": "novel" },
  { "id": "130808918", "type": "novel" }
]
</pre>
type 은 "illusts" 또는 "novel"이 될 수 있습니다.`,
    `Пожалуйста, выберите файл JSON. Формат его кода следующий:
<pre>
[
  { "id": "130827095", "type": "illusts" },
  { "id": "130816057", "type": "illusts" },
  { "id": "130811075", "type": "novel" },
  { "id": "130808918", "type": "novel" }
]
</pre>
type может быть "illusts" или "novel".`,
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
    <span class="blue">Esc</span> 关闭预览图<br>
    <span class="blue">← ↑</span> 上一张图片<br>
    <span class="blue">→ ↓</span> 下一张图片<br>
    <span class="blue">空格键</span> 下一张图片`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> 關閉/啟用預覽作品功能<br>
    當你檢視預覽圖時，可以使用如下快捷鍵：<br>
    <span class="blue">B</span>(ookmark) 收藏預覽的作品<br>
    <span class="blue">C</span>(urrent) 下載當前預覽的圖片<br>
    <span class="blue">D</span>(ownload) 下載當前預覽的作品<br>
    <span class="blue">Esc</span> 關閉預覽圖<br>
    <span class="blue">← ↑</span> 上一張圖片<br>
    <span class="blue">→ ↓</span> 下一張圖片<br>
    <span class="blue">空格鍵</span> 下一張圖片`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> Turn off/enable the preview function<br>
    When you view the preview, you can use the following shortcut keys:<br>
    <span class="blue">B</span>(ookmark) Bookmark previewed work<br>
    <span class="blue">C</span>(urrent) Download the currently previewed image<br>
    <span class="blue">D</span>(download) Download the currently previewed work<br>
    <span class="blue">Esc</span> Close preview<br>
    <span class="blue">← ↑</span> Previous image<br>
    <span class="blue">→ ↓</span> Next image<br>
    <span class="blue">Space bar</span> Next image`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> プレビュー機能をオフ/有効にします<br>
    プレビューを表示するときは、次のショートカット キーを使用できます。<br>
    <span class="blue">B</span>(ookmark) プレビューした作品をブックマークします<br>
    <span class="blue">C</span>(urrent) 現在プレビューされている画像をダウンロードします<br>
    <span class="blue">D</span>(ownload) 現在プレビュー中の作品をダウンロードします<br>
    <span class="blue">Esc</span> プレビューを閉じる<br>
    <span class="blue">← ↑</span> 前の画像<br>
    <span class="blue">→ ↓</span> 次の画像<br>
    <span class="blue">スペースバー</span> 次の画像`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> 미리보기 기능 끄기/활성화<br>
    미리보기를 볼 때 다음 단축키를 사용할 수 있습니다.<br>
    <span class="blue">B</span>(ookmark) 북마크 미리보기 작업<br>
    <span class="blue">C</span>(urrent) 현재 미리보기 이미지 다운로드<br>
    <span class="blue">D</span>(ownload) 현재 미리보기된 작품 다운로드<br>
    <span class="blue">Esc</span> 미리보기 닫기<br>
    <span class="blue">← ↑</span> 이전 이미지<br>
    <span class="blue">→ ↓</span> 다음 이미지<br>
    <span class="blue">스페이스바</span> 다음 이미지`,
    `<span class="blue">Alt</span> + <span class="blue">P</span> Выключить/включить функцию предварительного просмотра<br>
    При предварительном просмотре вы можете использовать следующие сочетания клавиш:<br>
    <span class="blue">B</span>(ookmark) Добавить в закладки предварительно просмотренную работу<br>
    <span class="blue">C</span>(urrent) Загрузите просматриваемое в данный момент изображение<br>
    <span class="blue">D</span>(ownload) Загрузите просматриваемую в данный момент работу<br>
    <span class="blue">Esc</span> Закрыть предварительный просмотр<br>
    <span class="blue"> ← ↑</span> Предыдущее изображение<br>
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
  _同步收藏列表的说明: [
    '你可以导出自己或其他用户的收藏列表，然后批量添加收藏。<br>这可以用来拷贝其他用户的收藏列表。<br>另外，如果你有多个 Pixiv 账号，想要同步它们的收藏列表，可以先导出一个账号的收藏列表，然后使用其他账号导入收藏列表。<br><br>当你处于自己或其他人的书签页面里时，可以在下载器的“更多”分类里找到此功能。',
    '你可以匯出自己或其他使用者的收藏列表，然後批次新增收藏。<br>這可以用來複製其他使用者的收藏列表。<br>另外，如果你有多個 Pixiv 賬號，想要同步它們的收藏列表，可以先匯出一個賬號的收藏列表，然後使用其他賬號匯入收藏列表。<br><br>當你處於自己或其他人的書籤頁面裡時，可以在下載器的“更多”分類裡找到此功能。',
    `You can export your own or other users' bookmark lists and then add bookmarks in batches. <br>This can be used to copy another user's bookmark list. <br>In addition, if you have multiple Pixiv accounts and want to synchronize their bookmark lists, you can first export the bookmark list of one account, and then use other accounts to import the bookmark list.<br><br>This feature can be found in the "More" category of the downloader when you are on your own or someone else's bookmark page.`,
    '自分や他のユーザーのブックマークリストをエクスポートして、一括でブックマークを追加できます。<br>他のユーザーのブックマークリストをコピーすることもできます。<br>また、複数のPixivアカウントを持っていて、ブックマークを同期したい場合にも使用できます。リストの場合、最初に 1 つのアカウントのブックマーク リストをエクスポートし、次に他のアカウントを使用してブックマーク リストをインポートできます。<br><br>この機能は、自分または他の人のブックマーク ページにいるときに、ダウンローダーの「その他」カテゴリにあります。',
    '자신 또는 다른 사용자의 북마크 목록을 내보낸 후 일괄적으로 북마크를 추가할 수 있습니다.<br>이는 다른 사용자의 북마크 목록을 복사하는 데 사용할 수 있습니다.<br>또한 Pixiv 계정이 여러 개 있고 북마크를 동기화하려는 경우 목록의 경우 먼저 한 계정의 북마크 목록을 내보낸 다음 다른 계정을 사용하여 북마크 목록을 가져올 수 있습니다.<br><br>이 기능은 자신이나 다른 사람의 북마크 페이지에 있을 때 다운로더의 "더 보기" 카테고리에서 찾을 수 있습니다.',
    'Вы можете экспортировать свои списки закладок или списки закладок других пользователей, а затем добавлять закладки в пакетном режиме. <br>Это можно использовать для копирования списка закладок другого пользователя. <br>Кроме того, если у вас есть несколько учетных записей Pixiv и вы хотите синхронизировать их закладки списки, вы можете сначала экспортировать список закладок одной учетной записи, а затем использовать другие учетные записи для импорта списка закладок.<br><br>Эту функцию можно найти в категории «Дополнительно» загрузчика, когда вы находитесь на своей или чужой странице закладок.',
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
    '检测到后续作品的收藏数量低于用户设置的数字，跳过后续作品',
    '檢測到後續作品的收藏數量低於使用者設定的數字，跳過後續作品',
    'It is detected that the number of bookmarks of subsequent works is lower than the number set by the user, and subsequent works are skipped.',
    '以降の作品のブックマーク数がユーザーが設定した数よりも少ないことを検出し、以降の作品をスキップする。',
    '후속 작품의 북마크 수가 사용자가 설정한 수보다 적은 것으로 감지되어 후속 작품을 건너뜁니다.',
    'Обнаружено, что количество закладок последующих произведений меньше количества, установленного пользователем, и последующие произведения пропускаются.',
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
默认值为 0，即无限制。<br>
如果设置为 1 秒钟，那么每小时最多会从 Pixiv 下载 3600 个文件。<br>
如果你担心因为下载文件太频繁导致账号被封禁，可以设置大于 0 的数字，以缓解此问题。<br>`,
    `每隔一定時間開始一次下載。<br>
預設值為 0，即無限制。<br>
如果設定為 1 秒鐘，那麼每小時最多會從 Pixiv 下載 3600 個檔案。<br>
如果你擔心因為下載檔案太頻繁導致賬號被 Ban，可以設定大於 0 的數字，以緩解此問題。<br>`,
    `Start a download every certain time. <br>
The default value is 0, which means no limit. <br>
If set to 1 second, a maximum of 3,600 files will be downloaded from Pixiv per hour. <br>
If you are worried that your account will be banned due to downloading files too frequently, you can set a number greater than 0 to alleviate this problem. <br>`,
    `一定時間ごとにダウンロードを開始します。<br>
デフォルト値は 0 で、制限なしを意味します。<br>
1 秒に設定すると、Pixiv から 1 時間あたり最大 3,600 ファイルがダウンロードされます。<br>
頻繁にファイルをダウンロードしすぎてアカウントが禁止されるのではないかと心配な場合は、0 より大きい数値を設定することでこの問題を軽減できます。<br>`,
    `특정 시간마다 다운로드를 시작합니다. <br>
기본값은 0으로, 제한이 없음을 의미합니다. <br>
1초로 설정하면 Pixiv에서 시간당 최대 3,600개의 파일이 다운로드됩니다. <br>
파일을 너무 자주 다운로드해서 계정이 금지될까 걱정된다면 0보다 큰 숫자를 설정하여 이 문제를 완화할 수 있습니다. <br>`,
    `Начинать загрузку каждый определенный момент времени. <br>
Значение по умолчанию — 0, что означает отсутствие ограничений. <br>
Если установлено значение 1 секунда, с Pixiv будет загружено максимум 3600 файлов в час. <br>
Если вы беспокоитесь, что ваш аккаунт будет заблокирован из-за слишком частой загрузки файлов, вы можете установить число больше 0, чтобы решить эту проблему. <br>`,
  ],
  _更新说明v1714: [
    '修复了发现（discovery）页面里的一些问题',
    '修復了發現（discovery）頁面裡的一些問題',
    'Fixed some issues in the discovery page',
    '発見ページのいくつかの問題を修正しました',
    '검색 페이지의 일부 문제를 수정했습니다.（discovery page）',
    'Исправлены некоторые проблемы на странице открытий.',
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
    `本次任务需要抓取的作品数量比较多，您可以考虑使用小号进行抓取和下载，以减少大号被封禁的风险。<br>您可以在 Wiki 查看相关说明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8F%B7%E4%B8%8B%E8%BD%BD" target="_blank">使用小号下载</a>`,
    `本次任務需要抓取的作品數量比較多，您可以考慮使用小號進行抓取和下載，以減少大號被封禁的風險。<br>您可以在 Wiki 查看相關說明：<a href="https://xuejianxianzun.github.io/PBDWiki/#/zh-cn/%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8F%B7%E4%B8%8B%E8%BD%BD" target="_blank">使用小號下載</a>`,
    `This task requires crawling a large number of works. You may consider using an alt account for crawling and downloading to reduce the risk of your main account being banned. <br>You can view the relevant instructions in the Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">Using Secondary Account for Downloading</a>`,
    `今回のタスクでは、クロールする作品の数がかなり多いです。小号を使用してクロールとダウンロードを行うことを検討してください。これにより、大号がブロックされるリスクを低減できます。<br>Wiki で関連する説明を確認できます：<a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">小号でダウンロード</a>`,
    `이번 작업에서 크롤링할 작품 수가 많습니다. 대본 계정이 차단될 위험을 줄이기 위해 작은 계정을 사용하여 크롤링과 다운로드를 고려해보세요. <br>Wiki에서 관련 설명을 확인할 수 있습니다: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">작은 계정으로 다운로드</a>`,
    `Эта задача требует загрузки большого количества работ. Вы можете рассмотреть использование альтернативного аккаунта для загрузки и скачивания, чтобы снизить риск блокировки основного аккаунта. <br>Вы можете ознакомиться с соответствующими инструкциями в Wiki: <a href="https://xuejianxianzun.github.io/PBDWiki/#/en/Using-Secondary-Account-for-Downloading" target="_blank">Скачивание с альтернативным аккаунтом</a>`,
  ],
  _版本更新说明17_9_0: [
    `<strong>注意：</strong>这次更新后，“抓取多少页面”和“抓取多少作品”这两个设置被重置为了默认值。如果你需要的话可以重新修改它们的值。`,
    `<strong>注意：</strong>這次更新後，「抓取多少頁面」和「抓取多少作品」這兩個設置被重置為了默認值。如果你需要的話可以重新修改它們的值。`,
    `<strong>Note:</strong> After this update, the settings for "crawl how many pages" and "crawl how many works" have been reset to default values. If needed, you can modify their values again.`,
    `<strong>注意：</strong>この更新後、「クロールするページ数」と「クロールする作品数」の2つの設定がデフォルト値にリセットされました。必要に応じて値を再変更できます。`,
    `<strong>주의:</strong> 이번 업데이트 후, "크롤링할 페이지 수"와 "크롤링할 작품 수" 이 두 설정이 기본값으로 재설정되었습니다. 필요하다면 값을 다시 수정할 수 있습니다.`,
    `<strong>Внимание:</strong> После этого обновления настройки «количество страниц для краулинга» и «количество работ для краулинга» были сброшены на значения по умолчанию. При необходимости вы можете изменить их значения заново.`,
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
    `下载器会在作品缩略图上和作品页面内显示一个复制按钮，点击它就可以复制作品的一些数据。<br>你可以自定义要复制的数据和格式。`,
    `下載器會在作品縮略圖上和作品頁面內顯示一個複製按鈕，點擊它就可以複製作品的一些資料。<br>你可以自訂要複製的資料和格式。`,
    `The downloader will display a copy button on the work thumbnail and within the work page. Clicking it allows you to copy some data of the work. <br>You can customize the data and format to be copied.`,
    `ダウンロードツールは作品のサムネイル上と作品ページ内にコピーボタンを表示します。それをクリックすると作品のデータをコピーできます。<br>コピーするデータと形式をカスタマイズできます。`,
    `다운로더는 작품 썸네일 위와 작품 페이지 내에 복사 버튼을 표시합니다. 클릭하면 작품의 일부 데이터를 복사할 수 있습니다. <br>복사할 데이터와 형식을 사용자 지정할 수 있습니다.`,
    `Загрузчик отобразит кнопку копирования на миниатюре работы и внутри страницы работы. Нажатие на неё позволит скопировать некоторые данные работы. <br>Вы можете настроить данные и формат для копирования.`,
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
  _复制摘要数据: [
    `复制摘要数据 (ALt + C)`,
    `複製摘要資料 (ALt + C)`,
    `Copy summary data (ALt + C)`,
    `要約データをコピー (ALt + C)`,
    `요약 데이터 복사 (ALt + C)`,
    `Копировать данные сводки (ALt + C)`,
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
<br>
<strong>每种格式的说明：</strong>
<br>
- <span class="blue">image/png</span> 复制作品的缩略图。默认未选择，因为它在某些社交软件里的优先级太高，会导致 <span class="blue">text/html</span> 格式的内容被忽略。
<br>
- <span class="blue">text/plain</span> 复制作品的文字信息。几乎所有应用程序都支持粘贴纯文本内容。
<br>
- <span class="blue">text/html</span> 同时复制作品的缩略图和文字信息。这是富文本格式，同时包含了上面两种内容。
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
<br>
QQ、微信：
<br>
它们的优先级是：<span class="blue">image/png</span>、<span class="blue">text/html</span>、<span class="blue">text/plain</span>。
<br>
如果你想在 QQ、微信里同时粘贴图片和文字，应该选择 <span class="blue">text/html</span>，并且取消勾选 <span class="blue">image/png</span>，否则它们只会粘贴图片。
<br>
但是 QQ 的当前版本 9.9.21 存在 Bug，粘贴图文混合内容时，图片会加载失败，并导致消息发送失败。QQ 的旧版本和微信没有上述的 Bug。
<br>
如果你遇到了这个 Bug，可以从 QQ 官网下载 9.9.20 版本的安装文件:
<br>
<a href="https://dldir1v6.qq.com/qqfile/qq/QQNT/Windows/QQ_9.9.20_250616_x64_01.exe" target="_blank" rel="noopener noreferrer">https://dldir1v6.qq.com/qqfile/qq/QQNT/Windows/QQ_9.9.20_250616_x64_01.exe</a>
<br>
然后退出 QQ，安装旧版本的 exe 文件，就可以发送图文混合消息了。
<br>
<br>
Android 应用：
<br>
Android 上的某些应用虽然可以粘贴 <span class="blue">text/html</span> 内容，但图片可能无法显示。
<br>
<br>`,
    `你可以根據自己的需要選擇複製的內容。
<br>
<br>
<strong>每種格式的說明：</strong>
<br>
- <span class="blue">image/png</span> 複製作品的縮略圖。預設未選擇，因為它在某些社交軟體裡的優先級太高，會導致 <span class="blue">text/html</span> 格式的內容被忽略。
<br>
- <span class="blue">text/plain</span> 複製作品的文字資訊。幾乎所有應用程式都支援貼上純文字內容。
<br>
- <span class="blue">text/html</span> 同時複製作品的縮略圖和文字資訊。這是富文字格式，同時包含了上面兩種內容。
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
<br>
QQ、微信：
<br>
它們的優先級是：<span class="blue">image/png</span>、<span class="blue">text/html</span>、<span class="blue">text/plain</span>。
<br>
如果你想在 QQ、微信裡同時貼上圖片和文字，應該選擇 <span class="blue">text/html</span>，並且取消勾選 <span class="blue">image/png</span>，否則它們只會貼上圖片。
<br>
但是 QQ 的當前版本 9.9.21 存在 Bug，貼上圖文混合內容時，圖片會載入失敗，並導致訊息發送失敗。QQ 的舊版本和微信沒有上述的 Bug。
<br>
如果你遇到了這個 Bug，可以從 QQ 官網下載 9.9.20 版本的安裝文件:
<br>
<a href="https://dldir1v6.qq.com/qqfile/qq/QQNT/Windows/QQ_9.9.20_250616_x64_01.exe" target="_blank" rel="noopener noreferrer">https://dldir1v6.qq.com/qqfile/qq/QQNT/Windows/QQ_9.9.20_250616_x64_01.exe</a>
<br>
然後退出 QQ，安裝舊版本的 exe 文件，就可以發送圖文混合訊息了。
<br>
<br>
Android 應用：
<br>
Android 上的某些應用雖然可以貼上 <span class="blue">text/html</span> 內容，但圖片可能無法顯示。
<br>
<br>`,
    `You can select the content to copy based on your needs.
<br>
<br>
<strong>Explanation of each format:</strong>
<br>
- <span class="blue">image/png</span> Copies the work's thumbnail. Not selected by default, because its priority in some social software is too high, which may cause the <span class="blue">text/html</span> format content to be ignored.
<br>
- <span class="blue">text/plain</span> Copies the work's text information. Almost all applications support pasting plain text content.
<br>
- <span class="blue">text/html</span> Copies both the work's thumbnail and text information simultaneously. This is a rich text format that includes both of the above contents.
<br>
<br>
<strong>Tips:</strong>
<br>
- The focus of this feature's design is to copy both image and text content simultaneously (<span class="blue">text/html</span>), for easy sharing or archiving, but the actual effect depends on the target application. Some applications may not support this format or may not display the image correctly.
<br>
- You can select multiple formats at the same time, which means copying multiple contents simultaneously. However, when you paste in an application, the application will only use <strong>one</strong> of them, namely the format with the highest priority. The content of other formats will be ignored.
<br>
- The priority may differ in different applications. This has nothing to do with the downloader.
<br>
- For example: If you copy both <span class="blue">image/png</span> and <span class="blue">text/html</span> content, some applications will use the former, but some may use the latter. If the pasted content does not meet your expectations, you can unselect one of the formats.
<br>
<br>
<strong>Some specific examples:</strong>
<br>
<br>
Browser:
<br>
The input area on a webpage can only paste plain text content by default, which is <span class="blue">text/plain</span>.
<br>
Some web applications may have targeted optimizations, for example, in Discord you can paste images <span class="blue">image/png</span>; in Gmail you can paste both images and text, which is <span class="blue">text/html</span>.
<br>
<br>
Microsoft Word:
<br>
It prioritizes the <span class="blue">text/html</span> format content, followed by <span class="blue">image/png</span>, and finally <span class="blue">text/plain</span>.
<br>
<br>
Telegram:
<br>
It does not support the <span class="blue">text/html</span> format, so you cannot paste both images and text in Telegram at the same time.
<br>
The priority of other formats is: <span class="blue">image/png</span>, <span class="blue">text/plain</span>.
<br>
<br>
QQ, WeChat:
<br>
Their priority is: <span class="blue">image/png</span>, <span class="blue">text/html</span>, <span class="blue">text/plain</span>.
<br>
If you want to paste both images and text in QQ or WeChat, you should select <span class="blue">text/html</span> and uncheck <span class="blue">image/png</span>; otherwise, they will only paste the image.
<br>
<br>
Android apps:
<br>
Some apps on Android can paste <span class="blue">text/html</span> content, but the image may not display properly.
<br>
<br>`,
    `自分のニーズに応じてコピーする内容を選択できます。
<br>
<br>
<strong>各フォーマットの説明：</strong>
<br>
- <span class="blue">image/png</span> 作品のサムネイルをコピーします。デフォルトでは選択されていません。特定のソーシャルソフトウェアでの優先度が非常に高いため、<span class="blue">text/html</span> 形式の内容が無視される可能性があるからです。
<br>
- <span class="blue">text/plain</span> 作品のテキスト情報をコピーします。ほぼすべてのアプリケーションがプレーンテキスト内容の貼り付けをサポートしています。
<br>
- <span class="blue">text/html</span> 作品のサムネイルとテキスト情報を同時にコピーします。これはリッチテキスト形式で、上記の2つの内容の両方を含んでいます。
<br>
<br>
<strong>ヒント：</strong>
<br>
- この機能の設計の焦点は、画像とテキスト内容を同時にコピーすること（<span class="blue">text/html</span>）で、共有やアーカイブを容易にしますが、実際の効果は対象アプリケーションに依存します。一部のアプリケーションはこの形式をサポートしていないか、画像を正しく表示できない場合があります。
<br>
- 複数のフォーマットを同時に選択できます。つまり、複数の内容を同時にコピーします。ただし、アプリケーションに貼り付けると、アプリケーションはその中で<strong>1つ</strong>のみを使用します。つまり、優先度が最も高いフォーマットです。他のフォーマット的内容は無視されます。
<br>
- 異なるアプリケーションでは優先度が異なる可能性があります。これはダウンロードツールとは関係ありません。
<br>
- 例： <span class="blue">image/png</span> と <span class="blue">text/html</span> の両方をコピーした場合、一部のアプリケーションは前者を使用しますが、一部のアプリケーションは後者を使用する可能性があります。貼り付けられた内容が期待に沿わない場合、フォーマットの1つを選択解除できます。
<br>
<br>
<strong>具体的な例：</strong>
<br>
<br>
ブラウザ：
<br>
ウェブページの入力エリアはデフォルトでプレーンテキスト内容のみ貼り付け可能で、<span class="blue">text/plain</span> です。
<br>
一部のウェブアプリケーションは対象を最適化している可能性があり、例えば Discord では画像 <span class="blue">image/png</span> を貼り付けられます；Gmail では画像とテキストの両方を同時に貼り付けられます。つまり <span class="blue">text/html</span> です。
<br>
<br>
Microsoft Word：
<br>
<span class="blue">text/html</span> 形式の内容を優先し、次に <span class="blue">image/png</span>、最後に <span class="blue">text/plain</span> を採用します。
<br>
<br>
Telegram：
<br>
<span class="blue">text/html</span> 形式をサポートしていないため、Telegram で画像とテキストを同時に貼り付けることはできません。
<br>
他のフォーマットの優先度は：<span class="blue">image/png</span>、<span class="blue">text/plain</span>。
<br>
<br>
QQ、WeChat：
<br>
優先度は：<span class="blue">image/png</span>、<span class="blue">text/html</span>、<span class="blue">text/plain</span>。
<br>
QQ や WeChat で画像とテキストを同時に貼り付けたい場合、<span class="blue">text/html</span> を選択し、<span class="blue">image/png</span> のチェックを外してください。さもないと画像のみが貼り付けられます。
<br>
<br>
Android アプリ：
<br>
Android の一部のアプリは <span class="blue">text/html</span> 内容を貼り付けられますが、画像が正しく表示されない場合があります。
<br>
<br>`,
    `자신의 필요에 따라 복사할 내용을 선택할 수 있습니다.
<br>
<br>
<strong>각 형식의 설명:</strong>
<br>
- <span class="blue">image/png</span> 작품의 썸네일을 복사합니다. 기본적으로 선택되지 않으며, 일부 소셜 소프트웨어에서 우선순위가 너무 높아 <span class="blue">text/html</span> 형식의 내용이 무시될 수 있기 때문입니다.
<br>
- <span class="blue">text/plain</span> 작품의 텍스트 정보를 복사합니다. 거의 모든 응용 프로그램이 순수 텍스트 내용을 붙여넣기를 지원합니다.
<br>
- <span class="blue">text/html</span> 작품의 썸네일과 텍스트 정보를 동시에 복사합니다. 이는 리치 텍스트 형식으로 위의 두 가지 내용을 모두 포함합니다.
<br>
<br>
<strong>팁:</strong>
<br>
- 이 기능의 설계 초점은 이미지와 텍스트 내용을 동시에 복사하는 것(<span class="blue">text/html</span>)으로, 공유나 아카이빙을 용이하게 하지만 실제 효과는 대상 응용 프로그램에 따라 다릅니다. 일부 응용 프로그램은 이 형식을 지원하지 않거나 이미지를 올바르게 표시하지 못할 수 있습니다.
<br>
- 여러 형식을 동시에 선택할 수 있으며, 이는 여러 내용을 동시에 복사하는 것을 의미합니다. 그러나 응용 프로그램에 붙여넣을 때 응용 프로그램은 그중 <strong>하나</strong>만 사용합니다. 즉, 우선순위가 가장 높은 형식입니다. 다른 형식의 내용은 무시됩니다.
<br>
- 다른 응용 프로그램에서는 우선순위가 다를 수 있습니다. 이는 다운로더와 무관합니다.
<br>
- 예: <span class="blue">image/png</span>과 <span class="blue">text/html</span> 내용을 동시에 복사하면 일부 응용 프로그램은 전자를 사용하지만 일부는 후자를 사용할 수 있습니다. 붙여넣은 내용이 기대에 맞지 않으면 해당 형식 중 하나를 선택 해제할 수 있습니다.
<br>
<br>
<strong>구체적인 예시:</strong>
<br>
<br>
브라우저:
<br>
웹페이지의 입력 영역은 기본적으로 순수 텍스트 내용만 붙여넣을 수 있으며, 이는 <span class="blue">text/plain</span>입니다.
<br>
일부 웹 응용 프로그램은 대상에 맞게 최적화될 수 있으며, 예를 들어 Discord에서는 이미지 <span class="blue">image/png</span>을 붙여넣을 수 있습니다; Gmail에서는 이미지와 텍스트를 동시에 붙여넣을 수 있으며, 이는 <span class="blue">text/html</span>입니다.
<br>
<br>
Microsoft Word:
<br>
<span class="blue">text/html</span> 형식의 내용을 우선 채택하며, 그 다음 <span class="blue">image/png</span>, 마지막으로 <span class="blue">text/plain</span>입니다.
<br>
<br>
Telegram:
<br>
<span class="blue">text/html</span> 형식을 지원하지 않으므로 Telegram에서 이미지와 텍스트를 동시에 붙여넣을 수 없습니다.
<br>
다른 형식의 우선순위는: <span class="blue">image/png</span>, <span class="blue">text/plain</span>.
<br>
<br>
QQ, WeChat:
<br>
우선순위는: <span class="blue">image/png</span>, <span class="blue">text/html</span>, <span class="blue">text/plain</span>.
<br>
QQ나 WeChat에서 이미지와 텍스트를 동시에 붙여넣고 싶다면 <span class="blue">text/html</span>을 선택하고 <span class="blue">image/png</span>의 체크를 해제하세요. 그렇지 않으면 이미지만 붙여넣습니다.
<br>
<br>
Android 앱:
<br>
Android의 일부 앱은 <span class="blue">text/html</span> 내용을 붙여넣을 수 있지만 이미지가 제대로 표시되지 않을 수 있습니다。
<br>
<br>`,
    `Вы можете выбрать содержимое для копирования в соответствии со своими потребностями.
<br>
<br>
<strong>Описание каждого формата:</strong>
<br>
- <span class="blue">image/png</span> Копирует миниатюру работы. По умолчанию не выбрано, поскольку его приоритет в некоторых социальных программах слишком высок, что может привести к игнорированию содержимого формата <span class="blue">text/html</span>.
<br>
- <span class="blue">text/plain</span> Копирует текстовую информацию работы. Почти все приложения поддерживают вставку чистого текстового содержимого.
<br>
- <span class="blue">text/html</span> Одновременно копирует миниатюру работы и текстовую информацию. Это формат rich text, который включает оба вышеуказанных содержимых.
<br>
<br>
<strong>Советы:</strong>
<br>
- Основной акцент в дизайне этой функции — одновременное копирование изображения и текстового содержимого (<span class="blue">text/html</span>) для удобного обмена или архивирования, но реальный эффект зависит от целевого приложения. Некоторые приложения могут не поддерживать этот формат или не отображать изображение правильно.
<br>
- Вы можете выбрать несколько форматов одновременно, что означает копирование нескольких содержимых. Однако при вставке в приложение оно использует только <strong>одно</strong> из них — формат с наивысшим приоритетом. Содержимое других форматов будет проигнорировано.
<br>
- В разных приложениях приоритет может отличаться. Это не связано с загрузчиком.
<br>
- Например: если вы скопируете содержимое <span class="blue">image/png</span> и <span class="blue">text/html</span>, некоторые приложения будут использовать первое, но другие — второе. Если вставленное содержимое не соответствует вашим ожиданиям, вы можете отменить выбор одного из форматов.
<br>
<br>
<strong>Некоторые конкретные примеры:</strong>
<br>
<br>
Браузер:
<br>
Область ввода на веб-странице по умолчанию может вставлять только чистый текст, то есть <span class="blue">text/plain</span>.
<br>
Некоторые веб-приложения могут иметь целевую оптимизацию, например, в Discord вы можете вставить изображение <span class="blue">image/png</span>; в Gmail вы можете вставить изображение и текст одновременно, то есть <span class="blue">text/html</span>.
<br>
<br>
Microsoft Word:
<br>
Он отдаст предпочтение содержимому формата <span class="blue">text/html</span>, затем <span class="blue">image/png</span>, и наконец <span class="blue">text/plain</span>.
<br>
<br>
Telegram:
<br>
Он не поддерживает формат <span class="blue">text/html</span>, поэтому вы не можете вставить изображение и текст одновременно в Telegram.
<br>
Приоритет других форматов: <span class="blue">image/png</span>, <span class="blue">text/plain</span>.
<br>
<br>
QQ, WeChat:
<br>
Их приоритет: <span class="blue">image/png</span>, <span class="blue">text/html</span>, <span class="blue">text/plain</span>.
<br>
Если вы хотите вставить изображение и текст одновременно в QQ или WeChat, выберите <span class="blue">text/html</span> и снимите галочку с <span class="blue">image/png</span>; иначе они вставят только изображение.
<br>
<br>
Приложения для Android:
<br>
Некоторые приложения на Android могут вставлять содержимое <span class="blue">text/html</span>, но изображение может не отображаться правильно。
<br>
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
}

export { langText }

// prompt

// 我有一些中文语句需要翻译，稍后我会把语句发给你。翻译结果保存在一个 js 的 string[] 里，它包含 6 条 string，第 1 条是原文，后 5 条是其他语言的翻译，按顺序分别是：繁体中文、英语、日语、韩语、俄语。

// 背景说明：
// 这是一个浏览器扩展程序，它是一个爬虫和下载器，用于从 Pixiv.net 这个网站下载插画、漫画、小说等内容。大多数用户在 PC 端的浏览器上使用它。它有很多设置项，还会显示日志和一些提示消息。

// 输出格式：
// - 输出内容保存在一个 JavaScript 代码块里。
// - 代码的内容就是翻译后的数组。不需要把数组保存到一个变量里。
// - 字符串使用反引号 ` 包裹。
// - 数组的最后一条语句后面需要添加逗号。这是 JS 语法里数组项后面的逗号，不要添加到语句里。
// - 翻译的语句后面不需要添加注释。

// 备注：
// - 如果中文语句里有 html 标签，翻译时需要原样保留。
// - 如果原语句里有 `<span class="key">关键字</span>` 形式的标记，那么在翻译后的语句里也要加上。
// - 中文的引号如 `“` 和 `”` 都翻译成英语的引号 `"`。

// 术语表：
// - `作品`（指 pixiv 上的投稿）翻译为`work`。
// - `插画`翻译为`illustration`。
// - `漫画`翻译为`manga`。
// - `小说`翻译为`novel`。
// - `动图`（指 pixiv 上的逐帧动画）翻译为`Ugoira`。
// - `图片`（对 pixiv 上的图片的统称）翻译为`image`。
// - `简介`（指作品的介绍信息）翻译为`description`。
// - `抓取`（让这个下载器爬取作品数据）翻译为`crawl`。
// - `收藏`（把作品添加到收藏夹，相当于书签）翻译为`bookmark`。
// - `命名规则`翻译为`naming rule`。
// - `点击`翻译为`click`。因为这个下载器是为 PC 端网页设计的，所以`点击`指的是鼠标点击，而非点击屏幕。
// - `下载记录`有两种情况。第一种情况：这个扩展程序会保存自己的下载记录格式，此时应该翻译为`download record`。第二种情况：指浏览器的下载记录，翻译为`download history`。第二种情况比较少。
// - `发布时间`、`发表时间`、`投稿时间`是相同的意思，应该翻译为`posting time`。
