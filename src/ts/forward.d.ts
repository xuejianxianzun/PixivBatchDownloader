export interface ForwardRequest {
  msg: 'forward',
  url: string
}

export interface ForwardResponse {
  msg: 'forward response',
  data: Blob
}