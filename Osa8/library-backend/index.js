const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongoDB')
  })
  .catch((error) => {
    console.log('error connecting to mongoDB', error.message)
  })

const typeDefs = `

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  
  type Book {
    title: String!
    published: Int! 
    author: Author!
    id: ID! 
    genres: [String!]!
  }

  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: String
  }

  type Query {
    me: User
    dummy: Int
    allAuthors: [Author!]
    booksCount: Int!
    authorsCount: Int!
    allBooks(genre: String, author: String): [Book!]
  }

  type Mutation {
    addBook(
      title: String!
      published: Int! 
      author: String!
      genres: [String!]!
    ): Book
    
    editAuthor(
      name: String!
      born: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    dummy: () => 0,
    allAuthors: async () => {
      return Author.find({})
    },
    allBooks: async (_root, args) => {
      const query = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          query.author = author._id
        }
      }

      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }

      return Book.find(query).populate('author')
    },

    booksCount: async () => {
      return Book.countDocuments({})
    },

    authorsCount: async () => {
      return Author.countDocuments({})
    },

    me: async (_root, _args, context) => {
      return context.currentUser
    },
  },

  Author: {
    bookCount: async (author) => {
      const result = await Book.find({ author: author._id })
      return result.length
    },
  },

  Mutation: {
    addBook: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        }) 
      }


      const author = await Author.findOne({ name: args.author })
      let book = new Book({ ...args, author: author })
      if (!author) {
        const newAuthor = new Author({ name: args.author, born: null })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving new author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
        book = new Book({ ...args, author: newAuthor })
        try {
          await book.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error,
            },
          })
        }
        return book
      }
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
      return book
    },

    editAuthor: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        }) 
      }

      const target = await Author.findOne({ name: args.name })

      if (!target) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      target.born = args.born
      try {
        await target.save()
      } catch (error) {
        throw new GraphQLError('error editing author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return target
    },

    createUser: async (_root, args ) => {
      const user = User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },

    login: async (_root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('invalid credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }

  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
