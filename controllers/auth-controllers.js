const { Controller } = require('../classes')
const { User } = require('../models')

class AuthController extends Controller {
  register = this.ctrlWrapper(async (req, res) => {
    const { email, password } = req.body
    const user = await this.model.findOne({ email })
    if (user) {
      throw this.createError(409, 'Email already exist')
    }
    const hashPassword = await this.hashPassword(password)
    const result = await this.model.create({ ...req.body, password: hashPassword })
    res.status(201).json({
      name: result.name,
      email: result.email,
    })
  })

  login = this.ctrlWrapper(async (req, res) => {
    const { email, password } = req.body
    const user = await this.model.findOne({ email })
    if (!user) {
      throw this.createError(401)
    }
    await this.passwordCompare(password, user.password)
    const { _id: id } = user
    const token = this.createToken({ id })
    await this.model.findByIdAndUpdate(id, { token })
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    })
  })

  getCurrent = this.ctrlWrapper(async (req, res) => {
    const { email } = req.user
    const user = await this.model.findOne({ email }, { password: 0 })

    res.json({
      user,
    })
  })

  logout = this.ctrlWrapper(async (req, res) => {
    const { _id } = req.user
    await this.model.findByIdAndUpdate(_id, { token: '' })

    res.json({
      message: 'Logout success',
    })
  })
}

module.exports = new AuthController(User)
