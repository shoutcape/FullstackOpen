const blogsRouter = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog } = require('../models')
const { blogFinder, tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search
        },
      },
      {
        author: {
          [Op.substring]: req.query.search
        }
      },
    ]
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog)
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const body = req.body
  const user = req.user
  if (!body.url || !body.title) {
    return response.status(400).json({ error: 'url and title required' })
  }
  if (!body.url || !body.title) {
    return response.status(400).json({ error: 'url and title required' })
  }
  const blog = await Blog.create({ ...body, userId: user.id })
  res.status(201).json(blog)
})

blogsRouter.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog.dataValues.userId === req.decodedToken.id) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  const { title, author, url, likes } = req.body

  if (title) req.blog.title = title
  if (author) req.blog.author = author
  if (url) req.blog.url = url
  if (likes !== null) req.blog.likes = likes

  await req.blog.save()
  res.status(200).json(req.blog)
})

module.exports = blogsRouter
