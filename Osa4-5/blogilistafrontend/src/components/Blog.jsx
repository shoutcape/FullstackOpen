import blogService from '../services/blogs'
import { useState } from 'react'

const Blog = ({ blog, user, blogs, setBlogs }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState('')

  const handleLikes = async (event) => {
    event.preventDefault()
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    const returnedBlog = await blogService.put(blog.id, updatedBlog)
    setLikes(returnedBlog.likes)
  }

  const handleRemove = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id)
      const newBlogs = { ...blogs }
      delete newBlogs[blog.id]
      setBlogs(blogs.filter((blogs) => blogs.id !== blog.id))
    }
  }

  return (
    <div className='blog'>
      <div className='blogHeader'>
        <div className='blogTitle'>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(!visible)}>
            {visible ? 'hide' : 'view'}
          </button>
        </div>
        {visible && (
          <div>
            <div>{blog.url}</div>
            <div>
              {likes ? likes : blog.likes}
              <button onClick={handleLikes}>like</button>
            </div>
            <div>{blog.name}</div>
            {(blog.user.id === user.id || blog.user === user.id) && (
              <button className='removeButton' onClick={handleRemove}>
                remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default Blog
