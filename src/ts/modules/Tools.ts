export function deepCopy<T>(data: T): T {
  if (data === null || typeof data !== 'object') {
    return data
  }

  const result = (Array.isArray(data) ? [] : {}) as any

  for (const [key, value] of Object.entries(data)) {
    result[key] = (data === null || typeof data !== 'object') ? value : deepCopy(value)
  }

  return result
}

export function string2array(str: string): string[] {
  const temp = str.trim().split(',')
  return temp.filter(val => {
    if (val !== '') {
      return val.trim()
    }
  })
}