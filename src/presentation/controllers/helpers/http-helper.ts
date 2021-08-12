import { InternalServerError } from '../errors/server-error'
import { HttpResponse } from '../interfaces/http'

export function BadRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}

export function ServerError (): HttpResponse {
  return {
    statusCode: 500,
    body: new InternalServerError()
  }
}
