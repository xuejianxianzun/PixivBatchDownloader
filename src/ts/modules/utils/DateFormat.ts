// 格式化日期（和时间）
class DateFormat {
  // format 参数可以由以下格式组合：
  /*
  YYYY
  YY
  MM
  MMM
  MMMM
  DD
  hh
  mm
  ss
  */
  // 区分大小写；可以添加空格或其他符号；不要使用上面未包含的格式。
  // 参考资料：
  // https://www.w3.org/TR/NOTE-datetime
  // https://en.wikipedia.org/wiki/Date_format_by_country
  public static format(
    date: string | number | Date,
    format: string = 'YYYY-MM-DD'
  ) {
    // 生成年、月、日、时、分、秒
    const _date = new Date(date)
    const YYYY = _date.getFullYear().toString()
    const YY = YYYY.substring(YYYY.length - 2, YYYY.length)
    const MM = (_date.getMonth() + 1).toString().padStart(2, '0')
    const MMM = this.months[_date.getMonth()]
    const MMMM = this.Months[_date.getMonth()]
    const DD = _date.getDate().toString().padStart(2, '0')
    const hh = _date.getHours().toString().padStart(2, '0')
    const mm = _date.getMinutes().toString().padStart(2, '0')
    const ss = _date.getSeconds().toString().padStart(2, '0')
    // 对格式字符串进行替换
    let r = format
    r = r.replace('YYYY', YYYY)
    r = r.replace('YY', YY)
    r = r.replace('MMMM', MMMM)
    r = r.replace('MMM', MMM)
    r = r.replace('MM', MM)
    r = r.replace('DD', DD)
    r = r.replace('hh', hh)
    r = r.replace('mm', mm)
    r = r.replace('ss', ss)

    return r
  }

  private static readonly months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]

  private static readonly Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
}

export { DateFormat }
