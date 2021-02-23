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

import './modules/Lang'
import './modules/Theme'
import './modules/setting/Settings'
import './modules/setting/InvisibleSettings'
import './modules/PageType'
import './modules/download/QuickDownload'
import './modules/CenterPanel'
import './modules/OpenCenterPanel'
import './modules/setting/FormSettings'
import './modules/InitPage'
import './modules/download/DownloadControl'
import './modules/ListenPageSwitch'
import './modules/Tip'
import './modules/download/showStatusOnTitle'
import './modules/ViewBigImage'
import './modules/output/OutputPanel'
import './modules/output/PreviewFileName'
import './modules/output/ShowURLs'
import './modules/download/ExportResult2CSV'
import './modules/download/ExportResult'
import './modules/download/ImportResult'
import './modules/download/ExportLST'
import './modules/CheckNew'
import './modules/ShowWhatIsNew'
import './modules/ShowHowToUse'
