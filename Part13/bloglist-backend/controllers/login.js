const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { SECRET } = require('../utils/config')
const Session = require('../models/session')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  console.log(username, password)
  const user = await User.findOne({
    where: {
      username: username
    }
  })

  const passwordCorrect = password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'User is disabled'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 })

  await Session.destroy({
    where: {
      userId: user.id
    }
  })

  await Session.create({
    userId: user.id,
    token: token
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
