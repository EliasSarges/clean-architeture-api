import { HttpRequest, HttpResponse, EmailValidator, Controller } from '../interfaces'
import { MissingParameterError, InvalidParamError } from '../errors'
import { BadRequest, ServerError } from '../helpers/http-helper'
import { AddAccount } from '../../domain/use-cases/add-user'

export class SignUpController implements Controller {
  private readonly emailValidator
  private readonly AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.AddAccount = addAccount
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

      // this.AddAccount.add({
      //   name: 'valid_name',
      //   email: 'validEmail@example.com',
      //   password: 'valid_password'
      // })
    } catch (error) {
      return ServerError()
    }
  }
}
