import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => {
  return {
    async hash (): Promise<string> {
      return await (new Promise(resolve => resolve('hashed_value')))
    }
  }
})

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('shoul return a hashed value on success', async () => {
    const sut = new BcryptAdapter(12)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed_value')
  })
})
