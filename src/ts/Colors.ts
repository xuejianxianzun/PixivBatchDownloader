enum Colors {
  // 通用颜色
  white = '#fff',
  black = '#000',
  red = '#f00',
  // theme = '#0ea8ef',
  theme = '#199df5',

  // 带有语义的字体颜色
  textSuccess = '#00BD17',
  textWarning = '#d27e00',
  textError = '#f00',

  // 背景颜色
  // 稍暗，适合在颜色区域的面积较大时使用。之前用作主要按钮的背景颜色，但现在已经不直接使用这几个颜色了，而是使用 CSS 变量来定义按钮的背景颜色，这样更灵活一些。
  bgBlue = '#0ea8ef',
  bgGreen = '#14ad27',
  bgYellow = '#e49d00',
  bgRed = '#f33939',

  // 带有语义的背景颜色
  // 稍亮，适合在小区域使用
  bgBrightBlue = '#12acff',
  bgSuccess = '#00BD17',
  bgWarning = '#e49d00',
  bgError = '#f00',
}

export { Colors }
