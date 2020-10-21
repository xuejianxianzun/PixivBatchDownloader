// 格式化日期
class DateFormat {
  // format 参数可以由以下格式组合：（不区分大小写）
  /*
  yyyy
  yy
  mm
  mmm
  mmmm
  dd
  */
  //  可以添加空格或其他符号；不要使用上面未包含的格式
  // 参考资料： https://en.wikipedia.org/wiki/Date_format_by_country
  public static format(date: string, format: string = 'yyyy-mm-dd') {
    // 生成各种年、月、日的值
    const _date = new Date(date)
    const yyyy = _date.getFullYear()
    const _y = _date.getFullYear().toString()
    const yy = _y.substring(_y.length - 2, _y.length)
    const mm = (_date.getMonth() + 1).toString().padStart(2, '0')
    const mmm = this.months[_date.getMonth()]
    const mmmm = this.Months[_date.getMonth()]
    const dd = _date.getDate().toString().padStart(2, '0')
    // 对格式字符串进行替换
    let r = format.toLowerCase()
    r = r.replace('yyyy', yyyy.toString())
    r = r.replace('yy', yy)
    r = r.replace('mmmm', mmmm)
    r = r.replace('mmm', mmm)
    r = r.replace('mm', mm)
    r = r.replace('dd', dd)

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
