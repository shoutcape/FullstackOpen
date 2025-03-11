const logoutRouter = require('express').Router()
const Session = require('../models/session')
const { userExtractor, tokenExtractor } = require('../utils/middleware')

logoutRouter.delete('/', tokenExtractor ,userExtractor, async (req, res) => {
  const user = req.user

  if (!user) {
    console.log('no user found')
  }
  await Session.destroy({
    where: {
      userId: user.id
    }
  })
  res
    .status(200)
    .send({message: 'Successfully logged out'})
})

module.exports = logoutRouter
