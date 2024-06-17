import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    createNotification(_state, action) {
      return action.payload
    },
  },
})

export const { createNotification } = notificationSlice.actions

export const setNotification = (content, timer) => {
  return async (dispatch) => {
    dispatch(createNotification(content))
    setTimeout(() => {
      dispatch(createNotification(''))
    }, timer * 1000)
  }
}

export default notificationSlice.reducer
