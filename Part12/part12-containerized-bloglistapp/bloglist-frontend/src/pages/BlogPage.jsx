import { useMatch } from "react-router-dom"
import { useUserValue } from "../contexts/UserContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import blogService from '../services/blogs'
import { useBlogsDispatch } from "../contexts/BlogsContext"
import { useNotificationDispatch } from "../contexts/NotificationContext"
import { useEffect, useState } from "react"
import Notification from "../components/Notification"


const BlogPage = ({ blogs }) => {
  const blogsDispatch = useBlogsDispatch()
  const notification = useNotificationDispatch()
  const queryClient = useQueryClient()
  const user = useUserValue() || '' 
  const [comments, setComments] = useState([])
  const match = useMatch('/api/blogs/:id')
  const blog = match
    ? blogs.find((blog) => blog.id === match.params.id.toString())
    : null


  const updateBlogMutation = useMutation({
    mutationFn: blogService.put,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const createCommentMutation = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const result = useQuery({
    queryKey: ['comments'],
    queryFn: () => blogService.getComments(blog.id)
  })

  useEffect(() => {
    setComments(result.data)
  }, [result.data])


  const handleLikes = async (event) => {
    event.preventDefault()

    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlogMutation.mutate(updatedBlog)

    blogsDispatch({ type: 'LIKE', payload: blog.id })
    notification({ type: 'CREATE', payload: `you liked ${blog.title} by ${blog.author} ` })
  }

  const handleRemove = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutate(blog.id)
      blogsDispatch({ type: 'REMOVE', payload: blog.id })
    }
  }

  
  const addComment = async (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    createCommentMutation.mutate({ id: blog.id, comment: comment })
  }


  if (!blog) {
    return null
  }

  if (result.isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div >
      <h1 className="title">{blog.title}</h1>
      <Notification />
      <div className="blogDetails">
        <a href={blog.url}>{blog.url}</a>
        <div className="likes" data-testid='likes'>
          {blog.likes}
          <button onClick={handleLikes}>like</button>
        </div>
        <div >
          <p>
            added by {blog.name}
          </p>
        </div>
        {blog.user && (blog.user.id === user.id || blog.user === user.id) && (
          <button type="button" className='removeButton' onClick={handleRemove}>
            remove
          </button>
        )}
      </div>
      <div className="comments">
        <h2>Comments</h2>
        <form onSubmit={addComment}>
          <input
            type="text"
            name="comment"
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {comments && comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogPage
