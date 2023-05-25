const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CreateError = require('./Error')

const { SECRET_KEY } = process.env

class Controller {
  constructor(model) {
    this.model = model
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
      throw new CreateError(401)
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
