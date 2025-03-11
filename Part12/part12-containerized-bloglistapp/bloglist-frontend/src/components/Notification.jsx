import { useNotificationValue } from "../contexts/NotificationContext"

const Notification = () => {

  const notification = useNotificationValue()

    return (
      <div>
        {notification}
      </div>
    )
}
export default Notification
