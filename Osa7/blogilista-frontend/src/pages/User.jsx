import axios from "axios"
import { useEffect, useState } from "react"
import { useMatch } from "react-router-dom"

const User = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await axios.get('http://localhost:5173/api/users')
      setUsers(result.data)
    }
    fetchUsers()
  }, [])

  const match = useMatch('/users/:id')
  const user = match
    ? users.find((user) => user.id === match.params.id.toString())
    : null

  if (!user) {
    return null
  }


  return (
    <div>
      <h1>{user.name}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User
