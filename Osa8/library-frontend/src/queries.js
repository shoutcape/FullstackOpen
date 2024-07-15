import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      title
      published
      author {
        name
        born
      }
      id
      genres
    }
  }
`

export const ALL_GENRES = gql`
  query AllGenres {
    allBooks {
      genres
    }
  }
`

export const CREATE_BOOK = gql`
  mutation AddBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author {
        name
        born
      }
      id
      genres
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation Mutation($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      id
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query Query {
    me {
      username
      favoriteGenre
      id
    }
  }
`
