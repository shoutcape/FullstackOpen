import { Link } from "react-router-dom"
import { useUserDispatch, useUserValue } from "../contexts/UserContext"

const Menu = () => {
  const userValue = useUserValue()
  const userDispatch = useUserDispatch()

  const handleLogout = async () => {
    await userDispatch({ type: 'LOGOUT' })
  }

  return (
    <div className="NavBar">
      <div className="NavContent">
        <div>
          <Link className="NavButton" to='/'>
            blogs
          </Link>
          <Link className="NavButton" to='/users'>
            users
          </Link>
        </div>
        <div className="flex">
          <p> {userValue.name} logged in </p>
          <button onClick={handleLogout}>logout</button>
        </div>
      </div>
    </div>
  )
}

export default Menu
