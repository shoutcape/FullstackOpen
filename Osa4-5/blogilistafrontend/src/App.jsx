import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/loginForm'
import NewBlogForm from './components/newBlogForm'
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
      setBlogs(blogs)
    })
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
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
            <NewBlogForm
              setMessage={setMessage}
              blogs={blogs}
              setBlogs={setBlogs}
              blogFormRef={blogFormRef}
            />
          </Togglable>
          {blogs
            .sort((blogA, blogB) => blogB.likes - blogA.likes)
            .map((blog) => (
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
