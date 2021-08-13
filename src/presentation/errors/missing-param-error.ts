export class MissingParameterError extends Error {
  constructor (param: string) {
    super(`No ${param} is provided`)
    this.name = 'MissingParameterError'
  }
}
