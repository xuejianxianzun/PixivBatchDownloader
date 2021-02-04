enum Color {
  white= '#fff',
  black='#000',
  red= '#f00',
  theme = '#0ea8ef',
  
  textSuccess='#00BD17',
  textWarning= '#d27e00',
  textError= '#f00',

  bgBlue = '#0ea8ef',
  bgBrightBlue= '#29b3f3',
  bgGreen = '#14ad27',
  bgRed='#f33939',
  bgYellow = '#e49d00',

  bgSuccess = '#14ad27',
  // 测试下警告的背景颜色是否合适
  bgWarning= '#d27e00',
  bgError= '#f00',
}

const Colors = {
  white: '#fff',
  blue: '#0ea8ef',
  green: '#14ad27',
  red: '#f33939',
  yellow: '#e49d00',
  primary: '#0ea8ef',
  success: '#00ca19',
  warning: '#d27e00',
  error: '#f00',
  beautifyBlue: '#29b3f3',
}
type colorType = keyof typeof Colors
export {Color, Colors, colorType }
