fetch('').then(response => {
  if (response.ok) {
    return response.text() as Promise<any>
  } else {
    // 我想在 catch 里处理错误
    return Promise.reject(new Error(response.status.toString()))
  }
})
