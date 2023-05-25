const express = require('express')
const { User } = require('../models')
const CreateError = require('./Error')
const { isValidObjectId } = require('mongoose')
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env

class Router {
  static _user = User
  constructor() {
    this.router = express.Router()
  }

  authenticate = async (req, res, next) => {
    const { authorization = '' } = req.headers
    const [bearer, token] = authorization.split(' ')

    if (bearer !== 'Bearer') {
      next(new CreateError(401))
    }

    try {
      const { id } = jwt.verify(token, SECRET_KEY)
      const user = await Router._user.findById(id)
      if (!user || !user.token) {
        next(new CreateError(401))
      }
      req.user = user
      next()
    } catch {
      next(new CreateError(401))
    }
  }

  isValidId = (req, res, next) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      next(new CreateError(404, `${id} is not valid id`))
    }

    next()
  }

  validateBody = (schema) => {
    const func = (req, res, next) => {
      const { error } = schema.validate(req.body)
      if (error) {
        next(new CreateError(400, error.message))
      }
      next()
    }

    return func
  }
}

module.exports = Router
