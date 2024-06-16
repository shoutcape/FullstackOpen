import { createSlice } from '@reduxjs/toolkit'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    likeAnecdote(state, action) {
      const id = action.payload
      const target = state.find((a) => a.id === id)
      const likedAnecdote = {
        ...target,
        votes: target.votes + 1,
      }
      const newState = state.map((a) => (a.id !== id ? a : likedAnecdote))
      return newState.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(_state, action) {
      return action.payload
    },
  },
})

export const { addAnecdote, likeAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
