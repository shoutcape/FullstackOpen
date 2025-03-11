import { createContext, useContext, useReducer } from "react";


const blogsReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE':
      const newBlog = action.payload
      return [...state, newBlog]

    case 'GET':
      const blogs = action.payload
      if (blogs) {
        return blogs.sort((a, b) => b.likes - a.likes)
      }
      return action.payload

    case 'LIKE':
      const id = action.payload
      const target = state.find(b => b.id === id)
      const likedBlog = { ...target, likes: target.likes + 1 }
      const newBlogs = state.map(blog => blog.id !== id ? blog : likedBlog)
      return newBlogs.sort((a, b) => b.likes - a.likes)

    case 'REMOVE':
      return state.filter(blog => blog.id !== action.payload)

    default:
      return state
  }
}

const BlogsContext = createContext()

export const useBlogsValues = () => {
  const BlogsAndDispatch = useContext(BlogsContext)
  return BlogsAndDispatch[0]
}

export const useBlogsDispatch = () => {
  const BlogsAndDispatch = useContext(BlogsContext)
  return BlogsAndDispatch[1]
}

export const BlogsContextProvider = (props) => {
  const [blogs, blogsDispatch] = useReducer(
    blogsReducer, []
  )

  return (
    <BlogsContext.Provider value={[blogs, blogsDispatch]}>
      {props.children}
    </BlogsContext.Provider>
  )
}


