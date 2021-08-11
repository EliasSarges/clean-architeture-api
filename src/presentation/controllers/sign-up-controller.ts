import { HttpRequest, HttpResponse } from './protocols/http'
import { MissingParameterError } from './errors/missing-param-errors'
import { BadRequest } from './helpers/http-helper'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requireFields = ['name', 'email']

    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParameterError(field))
      }
    }
    return BadRequest(new Error('body is not provided'))
  }
}
