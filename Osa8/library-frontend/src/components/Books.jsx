import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES, CREATE_BOOK } from '../queries'
import { useEffect, useState } from 'react'

const Books = (props) => {
  const [author, setAuthor] = useState(null)
  const [genre, setGenre] = useState(null)
  const [genreSet, setGenreSet] = useState(new Set())
  const [books, setBooks] = useState([])

  const result = useQuery(ALL_BOOKS, {
    variables: { author: author, genre: genre },
  })

  const genres = useQuery(ALL_GENRES)

  useEffect(() => {
    if (genres.data && result.data) {
      const newGenreSet = new Set()
      genres.data.allBooks.forEach((genreObject) => {
        genreObject.genres.forEach((genre) => {
          newGenreSet.add(genre)
        })
      })
      const books = result.data.allBooks
      setGenreSet(newGenreSet)
      setBooks(books)
    }
  }, [genres.data, result.data])

  useEffect(() => {
    if (props.refetch) {
      genres.refetch()
      result.refetch()
      props.setRefetch(false)
    }
  }, [props.refetch])

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {[...genreSet].map((genre) => (
          <button onClick={() => setGenre(genre)} key={genre}>
            {genre}
          </button>
        ))}
        <button
          onClick={() => {
            setGenre('')
          }}
        >
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
