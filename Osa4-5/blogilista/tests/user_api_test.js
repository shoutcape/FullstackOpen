const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

describe('Tests for Users API', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    test('users with valid data can be created', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username : "shoutcape",
            name : "ville",
            password : "salainen"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })

    test('users with invalid data won`t be created', async () => {
        const usersAtStart = await helper.usersInDb()
        const shortUsernameUser = {
            username : "sh",
            name : "ville",
            password : "salainen"
        }
        const shortPasswordUser = {
            username : "shoutcape",
            name : "ville",
            password : "sa"
        }

        await api
            .post('/api/users')
            .send(shortUsernameUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        await api
            .post('/api/users')
            .send(shortPasswordUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)


        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})


after(async () => {
    await mongoose.connection.close()
})