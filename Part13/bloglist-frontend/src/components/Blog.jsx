import blogService from '../services/blogs'
import { useState } from 'react'

const Blog = ({ blog, user, blogs, setBlogs, mockHandler=null }) => {
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
      <div className='blogTitle'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div data-testid='likes'>
            {likes ? likes : blog.likes}
            <button onClick={mockHandler||handleLikes}>like</button>
          </div>
          <div>{blog.name}</div>
            <button className='removeButton' onClick={handleRemove}>
              remove
            </button>
        </div>
      )}
    </div>
  )
}
export default Blog
