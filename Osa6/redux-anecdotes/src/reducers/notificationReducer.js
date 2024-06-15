import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(_state, action) {
      const content = action.payload

      if (content.votes >= 0) {
        return `you voted '${content.content}'`
      } else {
          return `you created '${content}'`
      }

    },
    removeNotification() {
      return null
    }
  }
})


export const { showNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
