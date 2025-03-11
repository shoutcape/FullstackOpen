import { useState } from 'react'
import loginServce from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ setUser, setMessage, setErrorState }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginServce.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setErrorState(true)
    }
  }


  return (
    <div>
      <form
        onSubmit={handleLogin}>
        <div>
                    Username
          <input
            data-testid='username'
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
                    Password
          <input
            data-testid='password'
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
