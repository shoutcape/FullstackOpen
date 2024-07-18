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
    born: Int
    bookCount: Int!
    id: String!
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

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs
