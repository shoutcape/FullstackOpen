import { useContext, createContext, useReducer, useEffect } from "react";
import loginService from '../services/login'
import blogService from '../services/blogs'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload

    case 'ERROR':
      
      return action.payload

    case 'LOGOUT':
      window.localStorage.removeItem('loggedBloglistUser')
      
      return null

    default:
      return state
  }
}

const UserContext = createContext()

export const useUserValue = () => {
  const UserAndDispatch = useContext(UserContext)
  return UserAndDispatch[0]
}

export const useUserDispatch = () => {
  const UserAndDispatch = useContext(UserContext)
  return UserAndDispatch[1]
}

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(
    userReducer,
    '',
  )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}
