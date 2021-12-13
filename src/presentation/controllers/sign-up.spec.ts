import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/use-cases/add-account'
import { InvalidParamError, MissingParameterError, InternalServerError } from '../errors'
import { EmailValidator } from '../interfaces'
import { SignUpController } from './sign-up-controller'

// factory to create an email validator stub
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

// factory to create an addAccount stub
const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password'

      }
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

// interface to type SUT's
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

// factory to make SUT's
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Sign Up controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'test@example.com',
        password: 'test',
        passwordConfirmation: 'test'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParameterError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'test',
        password: 'test',
        passwordConfirmation: 'test'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParameterError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'test',
        email: 'test@example.com',
        passwordConfirmation: 'test'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParameterError('password'))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'test',
        email: 'test@example.com',
        password: 'test'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParameterError('passwordConfirmation'))
  })

  test('Should return 400 if password does not match password confirmation', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'test',
        email: 'test@example.com',
        password: 'test',
        passwordConfirmation: 'test'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if EmailValidator returns an error', async () => {
    // const emailValidatorStub = makeEmailValidatorStubWithError()
    const { sut, emailValidatorStub } = makeSut()
    // const sut = new SignUpController(emailValidatorStub)

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = {
      body: {
        name: 'test',
        email: 'test@example.com',
        password: 'test',
        passwordConfirmation: 'test'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new InternalServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@example.com',
      password: 'valid_password'
    })
  })

  test('Should return 201 if a valid account is created', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toEqual(201)
    expect(httpResponse?.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@example.com',
      password: 'valid_password'
    })
  })
})
