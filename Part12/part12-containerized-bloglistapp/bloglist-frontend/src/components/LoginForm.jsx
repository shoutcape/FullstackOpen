import { useUserDispatch } from '../contexts/UserContext'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const LoginForm = () => {
  const userDispatch = useUserDispatch()
  const showNotification = useNotificationDispatch()


  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      userDispatch({ type: 'LOGIN', payload: user })
    } catch (error) {
      showNotification({ type: 'ERROR', payload: 'wrong username or password' })
    }
  }

  return (
    <div className='loginPage'>
      <form
        className='loginForm'
        onSubmit={handleLogin}>
        <div>
          Username
          <input
            data-testid='username'
            type="text"
            name="username"
          />
        </div>
        <div>
          Password
          <input
            data-testid='password'
            type="password"
            name="password"
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
