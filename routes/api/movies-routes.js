const { Router } = require('../../classes')
const { movieController } = require('../../controllers')
const { movieSchemas } = require('../../models')

class MoviesRouter extends Router {
  static controller = movieController
  static schemas = movieSchemas
  constructor() {
    super()
    this.setupRouter()
  }

  setupRouter() {
    this.router.use(this.authenticate)

    this.router.get('/', MoviesRouter.controller.getAll)

    this.router.get('/:id', MoviesRouter.controller.getById)

    this.router.post('/', this.validateBody(MoviesRouter.schemas.movieAddSchema), MoviesRouter.controller.add)

    this.router.put(
      '/:id',
      this.isValidId,
      this.validateBody(MoviesRouter.schemas.movieAddSchema),
      MoviesRouter.controller.updateById,
    )

    this.router.patch(
      '/:id/favorite',
      this.isValidId,
      this.validateBody(MoviesRouter.schemas.updateFavoriteMovieSchema),
      MoviesRouter.controller.updateMovieFavorite,
    )

    this.router.delete('/:id', this.isValidId, MoviesRouter.controller.deleteMovieById)
  }
}

module.exports = new MoviesRouter()
