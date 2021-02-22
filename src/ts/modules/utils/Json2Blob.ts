class Json2Blob {
  static convert(data: any) {
    const str = JSON.stringify(data, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    return blob
  }
}

export { Json2Blob }