const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const createToken = async () => {
    const users = await User.find({})
    const user = users[0]
    const userForToken = {
        username : user.username,
        id : user._id
    }
    return jwt.sign(userForToken, process.env.SECRET)
}


describe.only('Tests for Blogs API', () => {
    beforeEach(async () => {
        // reset database
        await Blog.deleteMany({})
        await User.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
        await api
            .post('/api/users')
            .send({
                username: 'shoutcape',
                name: 'ville',
                password: 'salainen',
            })
    })

    test('blogs are in JSON format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('correct amount of blogs is returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 6)
    })

    test('blogs have an identification tag of id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach((blog) => {
            assert.ok(blog.id)
        })
    })

    test('blog can be added correctly', async () => {
        console.log('testing')
        const token = await createToken()
        
        const newBlog = {
            url: 'https://testingdummytextforthis.com',
            title: 'AddedTestBlog',
            author: 'Ville',
            likes: 420,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const titles = response.body.map((r) => r.title)
        // check that response is one blog longer than the initial blog list
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        // check that titles include the new title that was added
        assert(titles.includes('AddedTestBlog'))
    })

    test('blog can`t be added if without token', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const users = await User.find({})
        const user = users[0]
        const falsetoken = 'false'
        console.log(falsetoken)

        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://test.com',
            likes: 0,
            user: user._id.toString()
        }

        const savedBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${falsetoken}`)
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        
    }) 

    test('set likes to 0 as default on creation of new blog', async () => {
        const token = await createToken()

        const newBlog = {
            title: 'AddedTestBlog',
            author: 'Ville',
            url: 'https://testingdummytextforthis.com',
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)
    })

    test('blog without title or url is not added', async () => {
        const token = await createToken()
        const newBlog = {
            author: 'Ville',
        }

        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog can be deleted correctly', async () => {
        const users = await User.find({})
        const user = users[0]
        const token = await createToken()

        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://test.com',
            likes: 0,
            user: user._id.toString()
        }

        const savedBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = savedBlog.body

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

        const titles = blogsAtEnd.map((blog) => blog.title)
        assert(!titles.includes(blogToDelete.title))
    })

    test('blog can be updated correctly', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: 'Updated Blog title',
            author: 'Updated Blog author',
            url: 'Updated Blog url',
            likes: 420,
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map((b) => b.title)
        assert(!titles.includes(blogToUpdate.title))
        assert(titles.includes(updatedBlog.title))
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
