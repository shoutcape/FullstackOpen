const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
require('dotenv').config()
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    dummy: () => 0,

    allAuthors: async () => {
      const foundAuthors = await Author.find({}).populate('books')
      return foundAuthors.map((author) => {
        return {
          name: author.name,
          born: author.born,
          bookCount: author.books.length,
          id: author._id,
        }
      })
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

  Mutation: {
    addBook: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const author = await Author.findOne({ name: args.author })
      if (!author) {
        console.log('ei löydetty authoria... tehdään uusi')
        const newAuthor = new Author({ name: args.author, born: null })
        console.log('uusiauthori:',newAuthor)
        try {
          const book = new Book({ ...args, author: newAuthor._id })
          newAuthor.books = newAuthor.books.concat(book._id)
          await newAuthor.save()
          await book.save()
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book.populate('author')
        } catch (error) {
          throw new GraphQLError('Saving new Author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error,
            },
          })
        }
      } else {
        try {
          const book = new Book({ ...args, author: author._id })
          author.books = author.books.concat(book._id)
          await book.save()
          await author.save()
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book.populate('author')
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error,
            },
          })
        }
      }
    },

    editAuthor: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
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

    createUser: async (_root, args) => {
      const user = User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })
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
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers

