import { HttpRequest, HttpResponse, EmailValidator, Controller } from '../interfaces'
import { MissingParameterError, InvalidParamError } from '../errors'
import { BadRequest, Created, ServerError } from '../helpers/http-helper'
import { AddAccount } from '../../domain/use-cases/add-account'

export class SignUpController implements Controller {
  private readonly emailValidator
  private readonly AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.AddAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requireFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParameterError(field))
        }
      }

      const { password, passwordConfirmation, email, name } = httpRequest.body

      if (password !== passwordConfirmation) {
        return BadRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return BadRequest(new InvalidParamError('email'))
      }

      const account = await this.AddAccount.add({
        name,
        email,
        password
      })

      return Created(account)
    } catch (error) {
      return ServerError()
    }
  }
}
