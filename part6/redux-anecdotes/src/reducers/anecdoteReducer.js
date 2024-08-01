import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const fetchAnecdotes = createAsyncThunk(
  'anecdotes/fetchAnecdotes',
  async () => {
    const response = await axios.get(baseUrl)
    return response.data
  }
)

export const createAnecdote = createAsyncThunk(
  'anecdotes/createAnecdote',
  async (anecdote) => {
    const response = await axios.post(baseUrl, anecdote)
    return response.data
  }
)

export const updateAnecdote = createAsyncThunk(
  'anecdotes/updateAnecdote',
  async (anecdote) => {
    const response = await axios.put(`${baseUrl}/${anecdote.id}`, anecdote)
    return response.data
  }
)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote (state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes += 1
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnecdotes.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(updateAnecdote.fulfilled, (state, action) => {
        const updatedAnecdote = action.payload
        return state.map(anecdote =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      })
  }
})

export const { voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
