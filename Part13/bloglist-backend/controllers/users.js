const { Op } = require('sequelize')
const { User, Blog } = require('../models')
const { userFinder } = require('../utils/middleware')

const usersRouter = require('express').Router()

usersRouter.post('/', async (req, res) => {
  const { username, name } = req.body
  const user = await User.create({
    username: username,
    name: name,
    password: 'salainen'
  })
  res.status(201).json(user)
})

usersRouter.get('/', async (_req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['blogId']
    },
    include: {
      model: Blog,
      attributes: ['title']
    }
  })
  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read) where.read = req.query.read

  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: ['blogId', 'created_at', 'updated_at', 'id']
    },
    include: [{
      model: Blog,
      as: 'readings',
      attributes: ['id', 'author', 'title', 'url', 'likes', 'year'],
      through: {
        as: 'readingLists',
        attributes: ['read', 'id'],
        where
      },
    }]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

usersRouter.put('/:username', userFinder, async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: 'User not found' })
  }
  const { name } = req.body
  if (name) req.user.name = name
  await req.user.save()
  res.status(200).json(req.user)
})

module.exports = usersRouter
