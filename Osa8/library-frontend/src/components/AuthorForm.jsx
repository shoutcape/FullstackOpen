import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const AuthorForm = ({ authors }) => {
  const [name, setName] = useState(authors[0].name)
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(UPDATE_AUTHOR)

  const updateAuthor = (event) => {
    event.preventDefault()

    editAuthor({
      variables: { name, born },
      refetchQueries: [{ query: ALL_AUTHORS }],
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={updateAuthor}>
        <div>
          name
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map((author) => (
              <option key={author.name} >{author.name}</option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>edit author</button>
      </form>
    </div>
  )
}

export default AuthorForm
