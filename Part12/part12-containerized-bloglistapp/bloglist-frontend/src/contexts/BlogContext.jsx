import { createContext, useContext, useReducer } from "react";


const blogReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE':
      return action.payload
    default:
      return state
  }
}

const BlogContext = createContext()

export const useBlogValues = () => {
  const BlogAndDispatch = useContext(BlogContext)
  return BlogAndDispatch[0]
}

export const useBlogDispatch = () => {
  const BlogAndDispatch = useContext(BlogContext)
  return BlogAndDispatch[1]
}

export const BlogContextProvider = (props) => {
  const [blog, blogDispatch] = useReducer(
    blogReducer, ''
  )

  return (
    <BlogContext.Provider value={[blog, blogDispatch]}>
      {props.children}
    </BlogContext.Provider>
  )
}


