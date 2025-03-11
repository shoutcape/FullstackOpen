import { useState } from 'react'

const NewBlogForm = ({ addBlog, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url,
    }
    addBlog(blogObject)
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
      <form onSubmit={handleNewBlog}>
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
