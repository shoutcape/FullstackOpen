import { useEffect, useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [refetch, setRefetch] = useState(false)
  const client = useApolloClient()

  useEffect(() => {
    const fetchedToken = localStorage.getItem('library-user-token')
    if (fetchedToken) {
      setToken(fetchedToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Book '${addedBook.title}' has been added`)
      updateCache(
        client.cache,
        { query: ALL_BOOKS, variables: { genre: null, author: null } },
        addedBook,
      )
    },
  })

  const logout = async (event) => {
    event.preventDefault()
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books
        show={page === 'books'}
        refetch={refetch}
        setRefetch={setRefetch}
      />

      <NewBook show={page === 'add'} setRefetch={setRefetch} />

      <Login show={page === 'login'} setToken={setToken} />

      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App
