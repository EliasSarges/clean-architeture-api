import { HttpResponse } from '../protocols/http'

export function BadRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}
