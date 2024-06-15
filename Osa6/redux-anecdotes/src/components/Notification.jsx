import { useDispatch, useSelector } from 'react-redux'
import { removeNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(({ notification }) => {
    if (notification) {
      return notification
    }
  })

  const timer = setTimeout(() => {
    dispatch(removeNotification())
  }, 5000)

  let style

  if (notification) {
    clearTimeout(timer)
    style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1,
      marginBottom: 10,
    }
  } else {
    style = {
      display: 'none',
    }
  }
  return <div style={style}>{notification}</div>
}

export default Notification
