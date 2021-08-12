import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { MissingParameterError } from './errors/missing-param-errors'
import { BadRequest } from './helpers/http-helper'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    const requireFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParameterError(field))
      }
    }
  }
}
