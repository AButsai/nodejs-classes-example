const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env

class Controller {
  static messagesList = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
  }

  constructor(model) {
    this.model = model
  }

  createError(status, message) {
    const errorMessage = message || this.messagesList[status]
    const error = new Error(errorMessage)
    error.status = status
    return error
  }

  ctrlWrapper(ctrl) {
    const func = async (req, res, next) => {
      try {
        await ctrl(req, res, next)
      } catch (error) {
        next(error)
      }
    }

    return func
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10)
  }

  async passwordCompare(password, hashPassword) {
    const passwordCompare = await bcrypt.compare(password, hashPassword)
    if (!passwordCompare) {
      throw this.createError(401)
    }
    return passwordCompare
  }

  createToken(data) {
    const payload = {
      id: data.id,
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' })
  }
}

module.exports = Controller
