class CreateError extends Error {
  static messagesList = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
  }

  constructor(status, message) {
    const errorMessage = message || CreateError.messagesList[status]
    super(errorMessage)
    this.status = status
    this.name = this.constructor.name
  }
}

module.exports = CreateError
