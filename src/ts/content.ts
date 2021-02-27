/*
 * project: Powerful Pixiv Downloader
 * author:  xuejianxianzun; 雪见仙尊
 * license: GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
 * Github： https://github.com/xuejianxianzun/PixivBatchDownloader
 * Releases: https://github.com/xuejianxianzun/PixivBatchDownloader/releases
 * Wiki:    https://xuejianxianzun.github.io/PBDWiki
 * Website: https://pixiv.download/
 * E-mail:  xuejianxianzun@gmail.com
 */

// 处理和脚本版的冲突
{
  // 标注自己
  window.sessionStorage.setItem('xz_pixiv_extension', '1')
  // 把脚本版的标记设置为 0，这样脚本版就不会运行
  window.sessionStorage.setItem('xz_pixiv_userscript', '0')
}

import './Lang'
import './Theme'
import './setting/Settings'
import './setting/InvisibleSettings'
import './ListenPageSwitch'
import './CenterPanel'
import './InitPage'
import './download/QuickDownload'
import './download/DownloadControl'
import './download/showStatusOnTitle'
import './Tip'
import './ViewBigImage'
import './output/OutputPanel'
import './output/PreviewFileName'
import './output/ShowURLs'
import './download/ExportResult2CSV'
import './download/ExportResult'
import './download/ImportResult'
import './download/ExportLST'
import './CheckNewVersion'
import './ShowWhatIsNew'
import './ShowHowToUse'
