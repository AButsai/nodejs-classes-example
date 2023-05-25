const express = require('express')
const { User } = require('../models')
const Controller = require('./Controller')
const { isValidObjectId } = require('mongoose')
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env

class Router {
  static _user = User
  static _error = new Controller()
  constructor(controller) {
    this.router = express.Router()
    this.controller = controller
  }

  authenticate = async (req, res, next) => {
    const { authorization = '' } = req.headers
    const [bearer, token] = authorization.split(' ')

    if (bearer !== 'Bearer') {
      next(Router._error.createError(401))
    }

    try {
      const { id } = jwt.verify(token, SECRET_KEY)
      const user = await Router._user.findById(id)
      if (!user || !user.token) {
        next(Router._error.createError(401))
      }
      req.user = user
      next()
    } catch {
      next(Router._error.createError(401))
    }
  }

  isValidId = (req, res, next) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      next(Router._error.createError(404, `${id} is not valid id`))
    }

    next()
  }

  validateBody = (schema) => {
    const func = (req, res, next) => {
      const { error } = schema.validate(req.body)
      if (error) {
        next(Router._error.createError(400, error.message))
      }
      next()
    }

    return func
  }
}

module.exports = Router
