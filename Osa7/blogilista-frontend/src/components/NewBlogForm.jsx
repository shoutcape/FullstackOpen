import { useState } from 'react'
import { useBlogsDispatch } from '../contexts/BlogsContext'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../contexts/NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const NewBlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const blogsDispatch = useBlogsDispatch()
  const notification = useNotificationDispatch()
  const queryClient = useQueryClient()

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data) => {
      blogsDispatch({ type: 'CREATE', payload: data })
      notification({ type: 'CREATE', payload: `a new blog ${data.title} by ${data.author} added` })
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const handleNewBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url,
    }

    createBlogMutation.mutate(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')

    if (blogFormRef) {
      blogFormRef.current.toggleVisibility()
    }
  }


  return (
    <div>
      <h2>Create new</h2>
      <form className='newBlogForm' onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            data-testid='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default NewBlogForm
