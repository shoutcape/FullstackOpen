const { User, Blog, UserBlogs } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

const readingListRouter = require('express').Router()

readingListRouter.get('/', async (_req, res) => {
  const userBlogs = await UserBlogs.findAll({
    attributes: {
      exclude: ['id']
    },
    //  include: {
    //    model: UserBlogs,
    //    attributes: []
    //  }
  })
  res.json(userBlogs)
})

readingListRouter.post('/', async (req, res) => {
  const readBlog = UserBlogs.create({
    userId: req.body.userId,
    blogId: req.body.blogId,
  })
  res.json(readBlog)
})

readingListRouter.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  if (req.user.id !== req.body.userId) {
    res.json({ error: 'wrong user' })
  }
  const readBlog = await UserBlogs.findByPk(req.params.id)
  readBlog.read = true
  await readBlog.save()
  res.json(readBlog)
})

module.exports = readingListRouter

