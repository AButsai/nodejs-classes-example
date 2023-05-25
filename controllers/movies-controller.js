const { Movie } = require('../models')
const { Controller, CreateError } = require('../classes')

class MovieController extends Controller {
  getAll = this.ctrlWrapper(async (req, res) => {
    const { _id: owner } = req.user
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const result = await this.model.find({ owner }, '-createdAt -updatedAt', { skip, limit })

    res.json(result)
  })

  getById = this.ctrlWrapper(async (req, res) => {
    const { id } = req.params
    const { _id: owner } = req.user
    const result = await this.model.findById(id)

    if (!result) {
      throw new CreateError(404, `Movie with id=${id} not found`)
    }

    if (result.owner.toString() !== owner.toString()) {
      throw new CreateError(400)
    }

    res.json(result)
  })

  add = this.ctrlWrapper(async (req, res) => {
    const { _id: owner } = req.user
    const result = await this.model.create({ ...req.body, owner })
    res.status(201).json(result)
  })

  updateById = this.ctrlWrapper(async (req, res) => {
    const { id } = req.params
    const result = await this.model.findByIdAndUpdate(id, req.body, { new: true })
    if (!result) {
      throw new CreateError(404, `Movie with id=${id} not found`)
    }

    res.json(result)
  })

  updateMovieFavorite = this.ctrlWrapper(async (req, res) => {
    const { id } = req.params
    const result = await this.model.findByIdAndUpdate(id, req.body, { new: true })
    if (!result) {
      throw new CreateError(404, `Movie with id=${id} not found`)
    }

    res.json(result)
  })

  deleteMovieById = this.ctrlWrapper(async (req, res) => {
    const { id } = req.params
    const result = await this.model.findByIdAndDelete(id)
    if (!result) {
      throw new CreateError(404, `Movie with id=${id} not found`)
    }

    res.json({
      message: 'Delete success',
      result,
    })
  })
}

module.exports = new MovieController(Movie)
