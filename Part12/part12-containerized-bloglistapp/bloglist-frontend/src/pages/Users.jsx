import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([])


  useEffect(() => {
    const fetchUsers = async () => {
      const result = await axios.get('api/users')
      setUsers(result.data)
    }
    fetchUsers()
  }, [])

  return (
    <div>
      <h1>Users</h1>
      <table>
        <tbody>
          <tr>
            <td>
              <b>
                User:
              </b>
            </td>
            <td>
              <b>blogs created</b>
            </td>
          </tr>
          {users && users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/api/users/${user.id}`}>
                  <div className='user'>
                    {user.name}
                  </div>
                </Link>
              </td>
              <td>
                {user.blogs.length}
              </td>
            </tr>
          )
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users
