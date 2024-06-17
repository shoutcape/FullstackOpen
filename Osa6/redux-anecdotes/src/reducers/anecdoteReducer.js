import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    appendLike(state, action) {
      const updatedAnecdote = action.payload
      const newState = state.map((a) => (a.id !== updatedAnecdote.id ? a : updatedAnecdote))
      const sortedState = newState.sort((a, b) => b.votes - a.votes)
      return sortedState
    },
    setAnecdotes(state, action) {
      state = action.payload
      const sortedState = state.sort((a, b) => b.votes - a.votes)
      return sortedState
    },
  },
})

export const { appendAnecdote, appendLike, setAnecdotes } =
  anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const likeAnecdote = (anecdote) => {
  return async (dispatch) => {
    const likedAnecdote = await anecdoteService.like(anecdote)
    dispatch(appendLike(likedAnecdote))
  }
}

export default anecdoteSlice.reducer
