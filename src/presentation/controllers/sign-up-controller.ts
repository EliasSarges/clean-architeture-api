import { HttpRequest, HttpResponse } from './protocols/http'
import { MissingParameterError } from './errors/missing-param-errors'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParameterError('name')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParameterError('email')
      }
    }

    const response: HttpResponse = {
      statusCode: 400,
      body: {}
    }

    return response
  }
}
