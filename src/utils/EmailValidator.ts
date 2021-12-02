import { EmailValidator } from '../presentation/interfaces'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
