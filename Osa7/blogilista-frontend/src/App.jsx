import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import Menu from './components/Menu'
import Users from './pages/Users'
import User from './pages/User'
import BlogPage from './pages/BlogPage'
import blogService from './services/blogs'
import { useEffect, useRef } from 'react'
import { useUserValue } from './contexts/UserContext'
import { useQuery } from '@tanstack/react-query'
import { useBlogsDispatch, useBlogsValues } from './contexts/BlogsContext'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  const blogFormRef = useRef()
  const userValue = useUserValue()
  const blogsDispatch = useBlogsDispatch()
  const blogs = useBlogsValues()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll()
  })

  useEffect(() => {
    blogsDispatch({ type: 'GET', payload: result.data })
  }, [result.data])

  if (result.isLoading) {
    return <div>loading...</div>
  }


  return (
    <div >
      {!userValue && (
        <div className='container'>
          <h1>login to application</h1>
          <Notification />
          <LoginForm />
        </div>
      )}

      {userValue && (
        <div>
          <Menu />
          {blogs && (
            <Routes>
              <Route path='/'
                element={
                  <div>
                    <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
                      <NewBlogForm blogFormRef={blogFormRef} />
                    </Togglable>
                    <BlogList blogs={blogs} />
                  </div>
                }
              />
              <Route path='/users' element={<Users />} />
              <Route path='/users/:id' element={<User />} />
              <Route path='/blogs/:id' element={<div>
                <BlogPage blogs={blogs} /></div>
              } />
            </Routes>
          )}
        </div>
      )}
    </div>
  )
}

export default App
