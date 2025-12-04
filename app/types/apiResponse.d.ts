import type HttpStatusCode from './httpStatusCode'

declare namespace ApiResponse {
  export interface Success<T> {
    response_code: HttpStatusCode
    status: 'success'
    message: string
    data: T
  }

  export interface Error {
    response_code: HttpStatusCode
    status: 'error'
    message: string
    error: string
  }

  export type SuccessWithPagination<T> = Success<T> & {
    pagination: {
      total: number
      count: number
      per_page: number
      current_page: number
      next_page: number
      previous_page: number
      total_pages: number
    }
  }
}
