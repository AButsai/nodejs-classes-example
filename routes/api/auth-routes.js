const { Router } = require('../../classes')
const { authController } = require('../../controllers')
const { User, userSchemas } = require('../../models')

class AuthRouter extends Router {
  static controller = authController
  static schemas = userSchemas
  constructor() {
    super()
    this.setupRouter()
  }

  setupRouter = () => {
    this.router.post('/register', this.validateBody(AuthRouter.schemas), AuthRouter.controller.register)

    this.router.post('/login', this.validateBody(AuthRouter.schemas.userLoginSchema), AuthRouter.controller.login)

    this.router.get('/current', this.authenticate, AuthRouter.controller.getCurrent)

    this.router.get('/logout', this.authenticate, AuthRouter.controller.logout)
  }
}

module.exports = new AuthRouter()
