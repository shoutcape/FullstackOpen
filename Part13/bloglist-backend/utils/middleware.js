const logger = require('./logger')
const { User, Blog } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const requestLogger = (request, _response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (
    [
      'SequelizeUniqueConstraintError',
      'SequelizeEagerLoadingError',
      'SequelizeDatabaseError',
      'SequelizeValidationError',
      'ValidationError',
      'SyntaxError',
      'Error',
      'ReferenceError',
    ].includes(error.name)
  ) {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return response.status(500).json({ error: error.message })
  }
  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    req.token = authorization.substring(7);
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, SECRET)
  req.user = await User.findOne({
    where: {
      username: decodedToken.username
    }
  })
  if (req.user.disabled) {
    return res.status(401).json({ error: 'user is disabled'})
  }
  console.log(req.user)
  next()
}

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  console.log(req.blog)
  next()
}

const userFinder = async (req, _res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } })
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  blogFinder,
  userFinder
}
