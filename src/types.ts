import type { AxiosResponse } from 'axios'

export type Response<T = any> = AxiosResponse<{
  code: number
  data: T
  msg: string
}>
