import optionsHtmlTemplate from './OptionsHtml.html'
import { Config } from '../Config'
import { namingRuleConfig } from './NamingRuleConfig'

// 导出包含了所有设置项的 HTML 代码的模板，供设置面板使用
export const optionsHtml = optionsHtmlTemplate
  .replace('__BOOKMARK_COUNT_LIMIT__', String(Config.BookmarkCountLimit))
  .replaceAll(
    '<!-- __NAMING_RULE_OPTION_LIST__ -->',
    namingRuleConfig.getOptionList()
  )
  .replaceAll(
    '__DEFAULT_NAME_RULE_FOR_ARTWORK__',
    Config.defaultNameRuleForArtwork
  )
  .replace('<!-- __NAMING_RULE_HELP_HTML__ -->', namingRuleConfig.getHelpHtml())
  .replaceAll('__DEFAULT_NAME_RULE_FOR_NOVEL__', Config.defaultNameRuleForNovel)
