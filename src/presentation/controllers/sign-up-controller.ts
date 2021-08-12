import { HttpRequest, HttpResponse, EmailValidator, Controller } from './interfaces'
import { MissingParameterError, InvalidParamError } from './errors'
import { BadRequest, ServerError } from './helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    try {
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
    } catch (error) {
      return ServerError()
    }
  }
}
