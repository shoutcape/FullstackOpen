import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import { useEffect, useState } from 'react'

const Recommend = (props) => {
  const [genre, setGenre] = useState('')
  const currentUser = useQuery(ME)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre },
  })

  useEffect(() => {
    if (currentUser.data && currentUser.data.me) {
      setGenre(currentUser.data.me.favoriteGenre)
    }
  }, [currentUser.data])

  useEffect(() => {
    if(props.show) {
      currentUser.refetch()
    }
  }, [props.show])

  if (result.loading || currentUser.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2> recommendations </h2>
      <p>
        books in your favorite genre <b>{genre}</b>
      </p>
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
      </div>
    </div>
  )
}

export default Recommend
