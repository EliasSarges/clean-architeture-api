import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { MissingParameterError } from './errors/missing-param-error'
import { BadRequest } from './helpers/http-helper'
import { EmailValidator } from './protocols/EmailValidator'
import { InvalidParamError } from './errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly emailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    const requireFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParameterError(field))
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return BadRequest(new InvalidParamError('email'))
    }
  }
}
