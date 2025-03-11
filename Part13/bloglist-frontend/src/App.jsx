import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [errorState, setErrorState] = useState(false)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort((blogA, blogB) => blogB.likes - blogA.likes))
    })
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch(error) {
      setErrorState(true)
      setMessage(`Adding new blog failed: ${error.message}`)
    }
  }

  return (
    <div>
      <div>
        {!user && (
          <div>
            <h1>login to application</h1>
            <Notification
              message={message}
              setMessage={setMessage}
              errorState={errorState}
              setErrorState={setErrorState}
            />
            <LoginForm
              setUser={setUser}
              setMessage={setMessage}
              setErrorState={setErrorState}
            />
          </div>
        )}
      </div>
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification
            message={message}
            setMessage={setMessage}
            errorState={errorState}
            setErrorState={setErrorState}
          />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
            <NewBlogForm addBlog={addBlog} blogFormRef={blogFormRef} />
          </Togglable>

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              blogs={blogs}
              setBlogs={setBlogs}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
