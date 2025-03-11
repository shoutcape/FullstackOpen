const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.get('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.comments)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  console.log('requesti TÄSSÄ:',body)
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    blog.comments.push(body.comment)
    await blog.save()
    response.status(201).json(blog).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = await request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user.id,
    likes: body.likes,
    name: user.name,
    comments: body.comments
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== decodedToken.id) {
    return response.status(400).json({ error: 'no auth' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
