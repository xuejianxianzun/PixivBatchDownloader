type ConfigItem = {
  name: string
  mayEmpty: boolean
  help: string
}

class NamingRuleConfig {
  private readonly namingConfig: ConfigItem[] = [
    { name: '{id}', mayEmpty: false, help: '_命名标记id' },
    { name: '{id_num}', mayEmpty: false, help: '_命名标记id_num' },
    { name: '{p_num}', mayEmpty: true, help: '_命名标记p_num' },
    { name: '{user}', mayEmpty: false, help: '_命名标记user' },
    { name: '{user_id}', mayEmpty: false, help: '_用户id' },
    { name: '{title}', mayEmpty: false, help: '_命名标记title' },
    { name: '{page_title}', mayEmpty: false, help: '_命名标记page_title' },
    { name: '{tags}', mayEmpty: false, help: '_命名标记tags' },
    { name: '{tags_translate}', mayEmpty: false, help: '_命名标记tags_trans' },
    {
      name: '{tags_transl_only}',
      mayEmpty: false,
      help: '_命名标记tags_transl_only',
    },
    { name: '{page_tag}', mayEmpty: true, help: '_文件夹标记page_tag' },
    { name: '{type}', mayEmpty: false, help: '_命名标记type' },
    { name: '{type_illust}', mayEmpty: true, help: '_命名标记type_illust' },
    { name: '{type_manga}', mayEmpty: true, help: '_命名标记type_manga' },
    { name: '{type_ugoira}', mayEmpty: true, help: '_命名标记type_ugoira' },
    { name: '{type_novel}', mayEmpty: true, help: '_命名标记type_novel' },
    { name: '{AI}', mayEmpty: true, help: '_命名标记AI' },
    { name: '{age}', mayEmpty: false, help: '_命名标记age' },
    { name: '{age_r}', mayEmpty: true, help: '_命名标记age_r' },
    { name: '{like}', mayEmpty: false, help: '_命名标记like' },
    { name: '{bmk}', mayEmpty: false, help: '_命名标记bmk' },
    { name: '{bmk_1000}', mayEmpty: false, help: '_命名标记bmk_1000' },
    { name: '{bmk_id}', mayEmpty: false, help: '_命名标记bmk_id' },
    { name: '{view}', mayEmpty: false, help: '_命名标记view' },
    { name: '{rank}', mayEmpty: true, help: '_命名标记rank' },
    { name: '{date}', mayEmpty: false, help: '_命名标记date' },
    { name: '{upload_date}', mayEmpty: false, help: '_命名标记upload_date' },
    { name: '{task_date}', mayEmpty: false, help: '_命名标记taskDate' },
    { name: '{px}', mayEmpty: true, help: '_命名标记px' },
    { name: '{char_count}', mayEmpty: true, help: '_命名标记char_count' },
    { name: '{series_title}', mayEmpty: true, help: '_命名标记seriesTitle' },
    { name: '{series_order}', mayEmpty: true, help: '_命名标记seriesOrder' },
    { name: '{series_id}', mayEmpty: true, help: '_命名标记seriesId' },
    { name: '{sl}', mayEmpty: true, help: '_命名标记_sl' },
    {
      name: '{multi_image_folder}',
      mayEmpty: true,
      help: '_命名标记_multi_image_folder',
    },
    { name: '{r18_g_folder}', mayEmpty: true, help: '_命名标记_r18_g_folder' },
    {
      name: '{match_tag_folder}',
      mayEmpty: true,
      help: '_命名标记_match_tag_folder',
    },
  ]

  public getOptionList() {
    const namingOptionList = this.namingConfig
      .map((item) => `<option value="${item.name}">${item.name}</option>`)
      .join('\n')
    return namingOptionList
  }

  public getHelpHtml() {
    const namingHelpHtml = this.namingConfig
      .map((item) => {
        return `${item.mayEmpty ? '* ' : ''}<span class="blue name">${item.name}</span>
      <span data-xztext="${item.help}"></span>
      <br>`
      })
      .join('\n')
    return namingHelpHtml
  }
}

const namingRuleConfig = new NamingRuleConfig()
export { namingRuleConfig }
