const express = require('express')
const app = express()
const cors = require('cors')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

    app.use(requestLogger)
    app.use(express.json())
    app.use(cors())
    
    let notes = [
        {
            id: 1,
            content: "Html is easy",
            important: true
        }, 
        {
            id: 2,
            content: "Browser can execute only javascript",
            important: false
        },
        {
            id: 3,
            content: "GET and POST are the most important methods of HTTP protocol",
            important: true
        }
    ]
    
    app.get('/', (req, res) => {
        res.send('<h1>Hello world</h1>')
    })
    
    app.get('/api/notes', (req, res) => {
        res.json(notes)
    })
    
    const generateId = () => {
        const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
        return maxId + 1
    }
    
    app.post('/api/notes', (req, res) => {
        const body = req.body
        
        if (!body.content) {
            return res.status(400).json({
                error: 'content missing'
            })
        }
        const note = {
            content: body.content,
            important: body.important || false,
            id: generateId(),
        }
        notes = notes.concat(note)
        res.json(note)
    })
    
    app.get('/api/notes/:id', (req, res) => {
        const id = Number(req.params.id)
        const note = notes.find(note => note.id === id)
        if (note){
            res.json(note)
        } else {
            res.status(404).end()
        }
    })
    
    app.delete('/api/notes/:id', (req, res) => {
        const id = Number(req.params.id)
        notes = notes.filter(note => note.id !== id)
        res.status(204).end()
    })
    
    
    app.use(unknownEndpoint)

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
