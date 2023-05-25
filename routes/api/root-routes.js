const { Router } = require('../../classes')
const authRouter = require('./auth-routes')
const moviesRouter = require('./movies-routes')

class RootRouter extends Router {
  constructor() {
    super()
    this.setupRouter()
  }

  setupRouter() {
    this.router.use('/api/auth', authRouter.router)
    this.router.use('/api/movies', moviesRouter.router)
  }
}

module.exports = new RootRouter()
