const Notification = ({ message, setMessage, errorState, setErrorState}) => {
    if (message === null) {
        return null
    }

    setTimeout(() => {
        setMessage(null)
        setErrorState(false)
    }, 5000)

    if (message) {
    return (
        <div className={errorState ? 'error' : 'success'}>
            {message}
        </div>
    )
}
}
export default Notification
