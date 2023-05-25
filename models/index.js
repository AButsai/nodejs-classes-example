const { User, schemas: userSchemas } = require('./user')
const { Movie, schemas: movieSchemas } = require('./movie')

module.exports = {
  User,
  Movie,
  userSchemas,
  movieSchemas,
}
